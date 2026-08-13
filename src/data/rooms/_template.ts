import { placed } from '~/lib/geometry';
import type { Room } from '../types';

/**
 * A room to copy. Nothing imports this file, so it can be left here as a working
 * example; see docs/measuring.md for how each figure is taken.
 *
 * To add the room for real: copy this to `src/data/rooms/<id>.ts`, fill it in, then
 * import it in `src/data/home.ts` and add it to the ROOMS array in the order the
 * home is walked through.
 */
export const TEMPLATE: Room = {
  id: 'template-room',
  name: 'Template room',
  kind: 'bedroom',

  /** North-west inside corner of this room, in whole-home coordinates. */
  origin: { x: 0, y: 0 },

  /** Clear internal size. Use a polygon instead if the room is not rectangular. */
  shape: { kind: 'rect', width: 3000, depth: 3600 },
  // shape: { kind: 'polygon', points: [{ x: 0, y: 0 }, { x: 3000, y: 0 }, ...] },

  ceiling: 2650,

  theme: 'One line on what this room has to do.',
  summary:
    'A paragraph on how the room is meant to work: which wall each large object has to go against, and why the alternatives were rejected. This is the text on the room’s own page.',

  style: 'japandi',
  floor: { name: 'Engineered oak, 190 mm boards', colour: '#dfd0ba' },

  openings: [
    {
      id: 'template-door',
      kind: 'door-swing',
      /** The wall it is in. */
      side: 'north',
      /** Along that wall to the near edge: from the west end here, from the north end on an east or west wall. */
      offset: 300,
      width: 900,
      height: 2100,
      /** Floor to underside. Zero for a door. */
      sill: 0,
      /** Hinge side, then whether the leaf comes into this room. */
      swing: 'left-in',
      /** The room on the other side, by id. Both rooms list a shared door, using this same id. */
      to: 'corridor',
    },
    {
      id: 'template-window',
      kind: 'window',
      side: 'south',
      offset: 700,
      width: 1600,
      height: 1500,
      sill: 900,
      to: 'outside',
    },
  ],

  furniture: [
    /**
     * placed(x, y, …) takes the north-west corner of the floor the piece ends up
     * covering, which is what a tape measure gives. A piece faces south at zero
     * rotation, so 270 turns its front to the east.
     */
    placed(200, 400, {
      id: 'template-bed',
      name: 'Double bed',
      kind: 'bed',
      width: 1500,
      depth: 2000,
      height: 950,
      rotation: 0,
      status: 'owned',
      material: 'Oak frame',
      note: 'Anything worth saying about this particular piece.',
    }),
    placed(200, 2600, {
      id: 'template-wardrobe',
      name: 'Wardrobe',
      kind: 'wardrobe',
      width: 1800,
      depth: 600,
      height: 2400,
      /** Room to stand and open the doors. Turned with the piece. */
      clearance: { south: 900 },
      status: 'planned',
    }),
  ],

  openQuestions: ['Anything still undecided, printed as-is so it is not forgotten.'],
};
