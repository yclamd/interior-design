import type { FloorFinish } from '~/data/types';

/**
 * The floors, which have not been chosen yet.
 *
 * They are stated anyway, and named as assumptions, because a plan drawn with no
 * material in it is not neutral — it is a diagram, and a diagram hides the one thing
 * about a floor that costs nothing to decide and cannot be changed afterwards: which
 * way the boards run. Entry, dining and living are one open space with no threshold
 * between them, so they take one floor — given as one material, laid one way — and the
 * drawing has to show that continuity or it will keep suggesting partitions that are
 * not there. The entry briefly had a tile of its own on the argument that a change of
 * material makes a threshold where there is no door; it is one floor, so it does not.
 *
 * East–west is along the length of the flat, from the front door to the window. Boards
 * laid along the long axis of a narrow space make it read longer, which here is what is
 * wanted: the dining room is 2.6 m deep and every extra apparent metre of length helps.
 *
 * Change the pattern or the grain on any of these and the plans redraw. Replace the
 * name with a real product and the assumption is gone.
 */
export const ASSUMED_BOARDS: FloorFinish = {
  name: 'Assumed: oak boards, 190 mm, laid east–west',
  colour: '#ddd6c9',
  pattern: 'plank',
  grain: 'ew',
  module: 190,
  note: 'Not chosen. Drawn so the plan shows a floor with a direction rather than a blank fill, and so the open rooms read as one surface.',
};

/**
 * Kitchen and shower room. Both are wet, both are cleaned rather than swept, and both
 * get the same tile for the same reason, so they share one finish rather than two that
 * happen to agree. These are behind doors, so a change of material at the threshold is
 * a change the door already makes.
 */
export const ASSUMED_WET_TILE: FloorFinish = {
  name: 'Assumed: 300 mm tile',
  colour: '#d3cec6',
  pattern: 'tile',
  module: 300,
  note: 'Not chosen. A small module because a wet floor needs falls, and a small tile takes them without cutting.',
};

/**
 * The rain shelter's slab, which is existing and not a choice — it is whatever the
 * builder laid. Drawn cooler and greyer than anything inside, so the drawing shows at
 * a glance where the building stops.
 */
export const EXISTING_CANOPY_SLAB: FloorFinish = {
  name: 'Existing: exterior slab',
  colour: '#c8c6c0',
  pattern: 'tile',
  module: 300,
  note: 'Not measured. Drawn as a 300 mm module because that is the common size for an exterior slab, and the module is the only thing about it the plan shows.',
};
