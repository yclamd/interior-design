import { placed } from '~/lib/geometry';
import { single, type Room } from '~/data/types';

/**
 * A room to copy. Nothing imports this file, so it can be left here as a working
 * example; see docs/measuring.md for how each figure is taken.
 *
 * To add a room for real: copy this into `src/data/projects/<project>/rooms/<id>.ts`,
 * fill it in, then import it in that project's `project.ts` and add it to the ROOMS
 * array in the order the space is walked through.
 *
 * Note the two halves. Everything above `designs` is a fact about the space and
 * cannot differ between designs; everything inside a design is a decision. A room
 * with alternatives to compare replaces single({ … }) with a list of designs, each
 * with its own id, name and furniture — see the living room of the placeholder flat.
 */
export const TEMPLATE: Room = {
  id: 'template-room',
  name: 'Template room',
  kind: 'bedroom',

  /** North-west inside corner of this room, in the project's coordinates. */
  origin: { x: 0, y: 0 },

  /** Clear internal size. Use a polygon instead if the room is not rectangular. */
  shape: { kind: 'rect', width: 3000, depth: 3600 },
  // shape: { kind: 'polygon', points: [{ x: 0, y: 0 }, { x: 3000, y: 0 }, ...] },

  ceiling: 2650,

  /**
   * Doorways belong to the room rather than to a design, because an opening is
   * shared with whatever is on the other side and the two sides are checked against
   * each other. Comparing two positions for a door is a second project.
   */
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
      /** The room on the other side, by id. Both rooms list a shared door under this same id. */
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

  designs: single({
    theme: 'One line on what this room has to do.',
    summary:
      'A paragraph on how the room is meant to work: which wall each large object has to go against, and why the alternatives were rejected. This is the text on the room’s own page.',
    style: 'japandi',
    floor: {
      name: 'Engineered oak, 190 mm boards',
      colour: '#dfd0ba',
      /** Drop these three and the floor draws as a flat colour. */
      pattern: 'plank',
      grain: 'ew',
      module: 190,
    },
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
  }),
};
