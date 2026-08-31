/**
 * Renders what the planner draws, outside the browser.
 *
 * The planner's drawing runs client-side, so a build passing says nothing about whether
 * it produces a picture. This composes exactly what its draw() composes, from the same
 * functions, and writes the SVG out so it can be looked at — which is the only way to
 * catch a plan that is technically valid and visually wrong.
 *
 * Run with: npm run planner-svg
 */

import { writeFileSync } from 'node:fs';
import { fromCatalogue } from '../src/data/catalogue';
import { STYLES } from '../src/data/styles';
import type { Design, Opening, Project, Room } from '../src/data/types';
import { checkDesign } from '../src/lib/checks';
import { bbox, envelopeOf, grow, outlineInPlan, pathOf } from '../src/lib/geometry';
import {
  PLAN_COLOURS,
  floorRender,
  frameFor,
  furnitureRenders,
  isDoorway,
  openingRender,
  roomFill,
  roomPath,
} from '../src/lib/plan';
import {
  floorPatternSvg,
  furnitureSvg,
  openingSvg,
  shadowFilterSvg,
  weavePatternSvg,
} from '../src/lib/draw';

const width = 3400;
const depth = 3050;
const wall = 100;
const style = 'warm-minimal' as const;

const openings: Opening[] = [
  {
    id: 'door',
    kind: 'door-swing',
    side: 'south',
    offset: 200,
    width: 900,
    height: 2100,
    sill: 0,
    swing: 'left-in',
    to: 'outside',
  },
  {
    id: 'window',
    kind: 'window',
    side: 'east',
    offset: 700,
    width: 1600,
    height: 1400,
    sill: 900,
    to: 'outside',
  },
];

const design: Design = {
  id: 'draft',
  name: 'Draft',
  preferred: true,
  theme: '',
  summary: '',
  style,
  floor: { name: 'Boards', pattern: 'plank', grain: 'ew', module: 190, colour: '#ddd6c9' },
  furniture: [
    fromCatalogue('sofa-three-seat', 610, 2100, { rotation: 180 }),
    fromCatalogue('table-coffee', 1150, 1050),
    fromCatalogue('armchair-750', 250, 1100, { rotation: 270 }),
    fromCatalogue('rug-flatweave', 700, 900, { width: 2000, depth: 1400 }),
  ],
};

const room: Room = {
  id: 'draft',
  name: 'Room',
  kind: 'living',
  origin: { x: wall, y: wall },
  shape: { kind: 'rect', width, depth },
  ceiling: 2600,
  openings,
  designs: [design],
};

const project: Project = {
  id: 'draft',
  name: 'Draft',
  location: '',
  scope: 'room',
  northOffset: 0,
  walls: { exterior: wall, interior: wall },
  ceiling: 2600,
  style,
  premise: '',
};

const outer = grow(bbox(outlineInPlan(room)), wall);
const frame = frameFor(outer, Math.max(240, Math.round(Math.max(width, depth) * 0.08)), 900);
const px = frame.px;
const floor = floorRender(design);
const ids = { floor: 'pl-floor', cast: 'pl-cast', weave: 'pl-weave' };

const body =
  `<defs>${floorPatternSvg(ids.floor, floor, px)}${weavePatternSvg(ids.weave, px)}${shadowFilterSvg(ids.cast, px)}</defs>` +
  `<rect x="${frame.box.x}" y="${frame.box.y}" width="${frame.box.width}" height="${frame.box.depth}" fill="${PLAN_COLOURS.sheet}"/>` +
  `<path d="${pathOf(envelopeOf(project, [room]))}" fill="${PLAN_COLOURS.structure}" stroke="${PLAN_COLOURS.structureEdge}" stroke-width="${px(1.4)}"/>` +
  `<path d="${roomPath(room)}" fill="${floor.pattern === 'none' ? roomFill(design) : `url(#${ids.floor})`}" stroke="${PLAN_COLOURS.structureEdge}" stroke-opacity="0.5" stroke-width="${px(0.5)}"/>` +
  openings
    .map((opening) =>
      openingSvg(openingRender(project, new Set([room.id]), room, opening), px, {
        fill: isDoorway(opening.kind) ? roomFill(design) : PLAN_COLOURS.sheet,
        swept: true,
      }),
    )
    .join('') +
  furnitureRenders(room, design)
    .map((piece) => furnitureSvg(piece, px, { detail: true, cast: ids.cast, weave: ids.weave }))
    .join('');

writeFileSync(
  'dist/planner-preview.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame.viewBox}">${body}</svg>`,
);

console.log('wrote dist/planner-preview.svg');
for (const finding of checkDesign(room, design)) {
  console.log(`  [${finding.severity}] ${finding.code}: ${finding.message}`);
}
