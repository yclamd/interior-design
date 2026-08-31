/**
 * Checks the rooms the planner opens on.
 *
 * The presets are the first thing anybody sees, so a preset that trips a check teaches
 * the reader that the checks are noise. It has to be the other way round: the starting
 * points are clean, and a finding means somebody has moved something.
 *
 * Warnings are allowed where they are inherent to the room — a 1.7 m bathroom is tight
 * by definition and saying so is correct — but errors are not, and neither is a room
 * with no way in or no daylight, which is the whole point of having presets at all.
 *
 * Run with: npm run presets
 */

import { writeFileSync } from 'node:fs';
import { fromCatalogue } from '../src/data/catalogue';
import { PRESETS, type Preset } from '../src/data/presets';
import { STYLES } from '../src/data/styles';
import type { Design, Opening, Project, Room } from '../src/data/types';
import { checkDesign, checkRoom } from '../src/lib/checks';
import { roomPlanSvg } from '../src/lib/draw';
import { formatArea, roomArea } from '../src/lib/geometry';

const WALL = 100;
const STYLE = 'warm-minimal';

const openingsOf = (preset: Preset): Opening[] =>
  preset.openings.map((opening, index) =>
    opening.kind === 'window'
      ? {
          id: `w${index}`,
          kind: 'window',
          side: opening.side,
          offset: opening.offset,
          width: opening.width,
          height: 1400,
          sill: 900,
          to: 'outside',
        }
      : {
          id: `d${index}`,
          kind: 'door-swing',
          side: opening.side,
          offset: opening.offset,
          width: opening.width,
          height: 2100,
          sill: 0,
          swing: 'left-in',
          to: 'outside',
        },
  );

/** Exactly what the planner builds, so this checks what somebody actually sees. */
function roomOf(preset: Preset): Room {
  const design: Design = {
    id: 'draft',
    name: 'Draft',
    preferred: true,
    theme: '',
    summary: '',
    style: STYLE,
    floor: {
      name: 'Boards',
      pattern: 'plank',
      grain: 'ew',
      module: 190,
      colour: STYLES[STYLE].palette.floor,
    },
    /**
     * Furniture is placed in the room's own coordinates, not the plan's: the origin puts
     * the room in the building, and a piece 200 from the west wall is at x=200 whatever
     * the walls are made of. Adding the wall thickness here — which looks right and is
     * not — reports every piece flush against a wall as sticking out of the room by
     * exactly one wall.
     */
    furniture: preset.pieces.map((piece, index) =>
      fromCatalogue(piece.ref, piece.x, piece.y, {
        id: `piece-${index}`,
        rotation: piece.rotation ?? 0,
      }),
    ),
  };
  return {
    id: preset.id,
    name: preset.label,
    kind: preset.kind,
    origin: { x: WALL, y: WALL },
    shape: { kind: 'rect', width: preset.width, depth: preset.depth },
    ceiling: 2600,
    open: preset.open,
    openings: openingsOf(preset),
    designs: [design],
  };
}

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

let errors = 0;

for (const preset of PRESETS) {
  const room = roomOf(preset);

  /**
   * Written out as well as checked, because a room can pass every check and still look
   * wrong — a wardrobe facing a wall, a chair marooned in the middle of the floor. The
   * checks catch what is measurable and the drawing catches the rest.
   */
  const plan = roomPlanSvg(room, project);
  writeFileSync(
    `dist/preset-${preset.id}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${plan.viewBox}">${plan.body}</svg>`,
  );

  const findings = [...checkRoom(room), ...checkDesign(room, room.designs[0]!)];
  const fatal = findings.filter(
    (finding) =>
      finding.severity === 'error' ||
      finding.code === 'no-way-in' ||
      finding.code === 'no-daylight',
  );
  errors += fatal.length;

  const size = `${preset.width} × ${preset.depth}`;
  const name = typeof preset.label === 'string' ? preset.label : preset.label.en;
  console.log(
    `\n${name}  ${size}  ${formatArea(roomArea(room))}  ${
      fatal.length === 0 ? 'clean' : `${fatal.length} to fix`
    }`,
  );
  for (const finding of findings) {
    const mark = fatal.includes(finding) ? 'X' : '·';
    console.log(`  ${mark} [${finding.severity}] ${finding.code}: ${finding.message}`);
  }
}

console.log(
  errors === 0
    ? '\nEvery preset opens clean.'
    : `\n${errors} thing(s) a preset should not open with.`,
);
process.exit(errors === 0 ? 0 : 1);
