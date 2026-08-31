/**
 * Renders what the planner draws, outside the browser.
 *
 * The planner's drawing runs client-side, so a build passing says nothing about whether
 * it produces a picture. This goes through roomPlanSvg — the same function the page calls
 * — and writes the result out so it can be looked at, which is the only way to catch a
 * plan that is technically valid and visually wrong.
 *
 * Three cases, because the interesting ones are the wrong ones: a room as it should be,
 * a room open on two sides, and a sealed box with no way in. The last is the drawing the
 * checks exist to stop somebody publishing, and it is worth being able to see it.
 *
 * Run with: npm run planner-svg
 */

import { writeFileSync } from 'node:fs';
import { fromCatalogue } from '../src/data/catalogue';
import type { Design, Opening, Project, Room, RoomKind, Side } from '../src/data/types';
import { axonSvg } from '../src/lib/axon';
import { checkDesign, checkRoom } from '../src/lib/checks';
import { roomPlanSvg } from '../src/lib/draw';
import { modelOf } from '../src/lib/model';

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

const glazing = (side: Side, offset: number): Opening => ({
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
    fromCatalogue('sofa-three-seat', 900, 2100, { rotation: 180 }),
    fromCatalogue('table-coffee', 1440, 1150),
    fromCatalogue('armchair-750', 2600, 300, { rotation: 90 }),
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

const roomFor = (id: string, kind: RoomKind, openings: Opening[], open: Side[] = []): Room => ({
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
    room: roomFor('as-it-should-be', 'living', [door('west', 2000), glazing('east', 1300)]),
    note: 'a door and a window',
  },
  {
    room: roomFor('open-plan', 'living', [glazing('east', 1300)], ['west', 'north']),
    note: 'open on two sides, walled on two',
  },
  {
    room: roomFor('sealed', 'living', []),
    note: 'no door, no window, no open side',
  },
];

for (const { room, note } of cases) {
  const plan = roomPlanSvg(room, project);
  writeFileSync(
    `dist/planner-${room.id}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${plan.viewBox}">${plan.body}</svg>`,
  );

  /** The projection too, since the planner now shows one and it is the same two calls. */
  const view = axonSvg(modelOf(project, [room]));
  writeFileSync(
    `dist/planner-${room.id}-axon.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view.viewBox}">${view.body}</svg>`,
  );

  const findings = [...checkRoom(room), ...checkDesign(room, room.designs[0]!)];
  console.log(`\n${room.id} — ${note}`);
  if (findings.length === 0) console.log('  nothing flagged');
  for (const finding of findings) {
    console.log(`  [${finding.severity}] ${finding.code}: ${finding.message}`);
  }
}
