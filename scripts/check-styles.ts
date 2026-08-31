/**
 * Renders one room in every palette, the way the planner's strip does.
 *
 * The point of holding ten styles is that they are worth comparing, and that claim is
 * only true if they actually look different. Ten near-identical thumbnails would be worse
 * than one, so this writes them all out to be looked at side by side, and reports how
 * many distinct floor and upholstery colours the set really contains.
 *
 * Run with: npm run styles
 */

import { writeFileSync } from 'node:fs';
import { fromCatalogue } from '../src/data/catalogue';
import { PRESETS } from '../src/data/presets';
import { STYLES, STYLE_ORDER } from '../src/data/styles';
import type { Design, Opening, Project, Room, StyleKey } from '../src/data/types';
import { roomPlanSvg } from '../src/lib/draw';

const WALL = 100;
const preset = PRESETS[0]!;

const openings: Opening[] = preset.openings.map((opening, index) =>
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

function roomIn(style: StyleKey): Room {
  const design: Design = {
    id: 'draft',
    name: 'Draft',
    preferred: true,
    theme: '',
    summary: '',
    style,
    floor: {
      name: 'Boards',
      pattern: 'plank',
      grain: 'ew',
      module: 190,
      colour: STYLES[style].palette.floor,
    },
    furniture: preset.pieces.map((piece, index) =>
      fromCatalogue(piece.ref, piece.x, piece.y, {
        id: `piece-${index}`,
        rotation: piece.rotation ?? 0,
      }),
    ),
  };
  return {
    id: style,
    name: STYLES[style].name,
    kind: preset.kind,
    origin: { x: WALL, y: WALL },
    shape: { kind: 'rect', width: preset.width, depth: preset.depth },
    ceiling: 2600,
    open: preset.open,
    openings,
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
  style: STYLE_ORDER[0]!,
  premise: '',
};

const floors = new Set<string>();
const textiles = new Set<string>();

for (const style of STYLE_ORDER) {
  const plan = roomPlanSvg(roomIn(style), project, {
    prefix: `st-${style}`,
    dimensions: false,
    north: false,
  });
  writeFileSync(
    `dist/style-${style}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${plan.viewBox}">${plan.body}</svg>`,
  );
  const palette = STYLES[style].palette;
  floors.add(palette.floor);
  textiles.add(palette.textile);
  console.log(
    `${style.padEnd(18)} floor ${palette.floor}  textile ${palette.textile}  furniture ${palette.furniture}`,
  );
}

console.log(
  `\n${STYLE_ORDER.length} styles: ${floors.size} distinct floors, ${textiles.size} distinct upholstery colours.`,
);
if (floors.size < STYLE_ORDER.length / 2) {
  console.log('Too many styles share a floor to be worth comparing.');
  process.exit(1);
}
