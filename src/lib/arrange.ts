import type { Box, Mm } from '~/data/types';

/**
 * Moving a piece around a room.
 *
 * This is the arithmetic behind dragging: which footprint a piece occupies once it has
 * been turned, which lines it should jump to, and where it is allowed to end up. None of
 * it is interface code — it takes numbers and returns numbers — so it lives here where it
 * can be checked, rather than inside a pointer handler where it cannot.
 *
 * Everything is in millimetres, and positions are the north-west corner of the floor the
 * piece covers, which is the same convention placed() uses and the same one a tape
 * measure produces.
 */

/** Millimetres. Close enough to mean "line these up", far enough not to fight the hand. */
export const SNAP: Mm = 90;

/** What an arrow key moves, and what a free drag rounds to. */
export const STEP: Mm = 10;

/**
 * The floor a piece covers once turned.
 *
 * A right-angle turn swaps the footprint, which is easy to forget and produces a very
 * confusing bug: a wardrobe turned to face a side wall snaps and clamps as though it
 * were still facing the way it was drawn, so it sits 300 mm out and nothing says why.
 */
export function footprintOf(
  size: { width: Mm; depth: Mm },
  at: { x: Mm; y: Mm },
  rotation = 0,
): Box {
  const turned = Math.abs(rotation / 90) % 2 === 1;
  return {
    x: at.x,
    y: at.y,
    width: turned ? size.depth : size.width,
    depth: turned ? size.width : size.depth,
  };
}

/**
 * Where a dragged edge lands.
 *
 * Both edges of the piece are offered to every line, and the closest wins: dragging a
 * sofa's right side towards a wall should put its right side on the wall, not its left.
 * With nothing in range the position is rounded instead, because a room measured to the
 * millimetre from a drag is a fiction — the hand was never that precise.
 */
export function snapTo(
  near: Mm,
  span: Mm,
  lines: Mm[],
  tolerance: Mm = SNAP,
  step: Mm = STEP,
): Mm {
  let best = Math.round(near / step) * step;
  let closest = tolerance;
  for (const line of lines) {
    for (const candidate of [line, line - span]) {
      const distance = Math.abs(near - candidate);
      if (distance < closest) {
        closest = distance;
        best = candidate;
      }
    }
  }
  return Math.round(best);
}

/**
 * Held inside the room.
 *
 * A piece dragged past a wall is a finding waiting to happen, and one the tool can simply
 * refuse to produce. Refusing is better than reporting: the check for furniture outside a
 * room still exists for datasets written by hand, but nothing arranged by dragging should
 * ever need it.
 */
export function clampInto(piece: Box, room: Box): { x: Mm; y: Mm } {
  /**
   * The far limit is held at the near wall for a piece wider than the room it is in.
   * Without that the upper bound falls below the lower one and the piece is pushed to a
   * negative coordinate — a three-seat sofa dragged into a 1.7 m bathroom leaves the
   * drawing altogether. It should sit in the corner and be reported as too big, which is
   * what the crowding and overlap checks are for.
   */
  return {
    x: Math.round(
      Math.min(Math.max(room.x, piece.x), Math.max(room.x, room.x + room.width - piece.width)),
    ),
    y: Math.round(
      Math.min(Math.max(room.y, piece.y), Math.max(room.y, room.y + room.depth - piece.depth)),
    ),
  };
}

/**
 * The lines a piece will snap to: the walls, and the edges of everything else in the room.
 *
 * Furniture is nearly always flush with a wall or lined up with its neighbour, so those
 * are the positions worth making easy to hit exactly. Nothing else is offered, because a
 * grid of arbitrary lines makes every position feel equally correct, which is the opposite
 * of what snapping is for.
 */
export function linesFor(axis: 'x' | 'y', room: Box, others: Box[]): Mm[] {
  const near = axis === 'x' ? room.x : room.y;
  const span = axis === 'x' ? room.width : room.depth;
  const lines = [near, near + span];
  for (const box of others) {
    const edge = axis === 'x' ? box.x : box.y;
    const run = axis === 'x' ? box.width : box.depth;
    lines.push(edge, edge + run);
  }
  return lines;
}
