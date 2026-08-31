/**
 * Renders what the planner draws, outside the browser.
 *
 * The planner's drawing runs client-side, so a build passing says nothing about whether
 * it produces a picture. This composes exactly what its draw() composes, from the same
 * functions, and writes the SVG out so it can be looked at — which is the only way to
 * catch a plan that is technically valid and visually wrong.
 *
 * Three cases, because the interesting ones are the wrong ones: a room as it should be,
 * a room open on two sides, and a sealed box with no way in. The last is the drawing the
 * checks exist to stop somebody publishing.
 *
 * Run with: npm run planner-svg
 */

import { writeFileSync } from 'node:fs';
import { fromCatalogue } from '../src/data/catalogue';
import type { Design, Opening, Project, Room, RoomKind, Side } from '../src/data/types';
import { checkDesign, checkRoom } from '../src/lib/checks';
import { bbox, grow, outlineInPlan } from '../src/lib/geometry';
import {
  PLAN_COLOURS,
  floorRender,
  frameFor,
  furnitureRenders,
  isDoorway,
  openingRender,
  roomFill,
  roomPath,
  wallBandsPath,
} from '../src/lib/plan';
import {
  floorPatternSvg,
  furnitureSvg,
  openingSvg,
  shadowFilterSvg,
  weavePatternSvg,
} from '../src/lib/draw';

const WIDTH = 3400;
const DEPTH = 3050;
const WALL = 100;
const STYLE = 'warm-minimal' as const;

const door = (side: Side, offset: number): Opening => ({
  id: `d-${side}`,
  kind: 'door-swing',
  side,
  offset,
  width: 900,
  height: 2100,
  sill: 0,
  swing: 'left-in',
  to: 'outside',
});

const window_ = (side: Side, offset: number): Opening => ({
  id: `w-${side}`,
  kind: 'window',
  side,
  offset,
  width: 1600,
  height: 1400,
  sill: 900,
  to: 'outside',
});

const design = (): Design => ({
  id: 'draft',
  name: 'Draft',
  preferred: true,
  theme: '',
  summary: '',
  style: STYLE,
  floor: { name: 'Boards', pattern: 'plank', grain: 'ew', module: 190, colour: '#ddd6c9' },
  furniture: [
    fromCatalogue('sofa-three-seat', 900, 2000, { rotation: 180 }),
    fromCatalogue('table-coffee', 1300, 1000),
    fromCatalogue('armchair-750', 2450, 400, { rotation: 180 }),
  ],
});

const project: Project = {
  id: 'draft',
  name: 'Draft',
  location: '',
  scope: 'room',
  northOffset: 0,
  walls: { exterior: WALL, interior: WALL },
  ceiling: 2600,
  style: STYLE,
  premise: '',
};

/** Exactly the composition in the planner's draw(), so this tests that and not a copy. */
function svgFor(room: Room): string {
  const spec = room.designs[0]!;
  const outer = grow(bbox(outlineInPlan(room)), WALL);
  const frame = frameFor(outer, 300, 900);
  const px = frame.px;
  const floor = floorRender(spec);
  const ids = { floor: `f-${room.id}`, cast: `c-${room.id}`, weave: `w-${room.id}` };

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame.viewBox}">` +
    `<defs>${floorPatternSvg(ids.floor, floor, px)}${weavePatternSvg(ids.weave, px)}${shadowFilterSvg(ids.cast, px)}</defs>` +
    `<rect x="${frame.box.x}" y="${frame.box.y}" width="${frame.box.width}" height="${frame.box.depth}" fill="${PLAN_COLOURS.sheet}"/>` +
    `<path d="${wallBandsPath(room, WALL)}" fill="${PLAN_COLOURS.structure}" stroke="${PLAN_COLOURS.structureEdge}" stroke-width="${px(1.4)}"/>` +
    `<path d="${roomPath(room)}" fill="${floor.pattern === 'none' ? roomFill(spec) : `url(#${ids.floor})`}"/>` +
    room.openings
      .map((opening) =>
        openingSvg(openingRender(project, new Set([room.id]), room, opening), px, {
          fill: isDoorway(opening.kind) ? roomFill(spec) : PLAN_COLOURS.sheet,
          swept: true,
        }),
      )
      .join('') +
    furnitureRenders(room, spec)
      .map((piece) => furnitureSvg(piece, px, { detail: true, cast: ids.cast, weave: ids.weave }))
      .join('') +
    `</svg>`
  );
}

const roomFor = (
  id: string,
  kind: RoomKind,
  openings: Opening[],
  open: Side[] = [],
): Room => ({
  id,
  name: id,
  kind,
  origin: { x: WALL, y: WALL },
  shape: { kind: 'rect', width: WIDTH, depth: DEPTH },
  ceiling: 2600,
  open,
  openings,
  designs: [design()],
});

const cases: { room: Room; note: string }[] = [
  {
    room: roomFor('as-it-should-be', 'living', [door('south', 200), window_('east', 700)]),
    note: 'a door and a window',
  },
  {
    room: roomFor('open-plan', 'living', [window_('east', 700)], ['west', 'north']),
    note: 'open on two sides, walled on two',
  },
  {
    room: roomFor('sealed', 'living', []),
    note: 'no door, no window, no open side',
  },
];

for (const { room, note } of cases) {
  writeFileSync(`dist/planner-${room.id}.svg`, svgFor(room));
  const findings = [...checkRoom(room), ...checkDesign(room, room.designs[0]!)];
  console.log(`\n${room.id} — ${note}`);
  if (findings.length === 0) console.log('  nothing flagged');
  for (const finding of findings) console.log(`  [${finding.severity}] ${finding.code}: ${finding.message}`);
}
