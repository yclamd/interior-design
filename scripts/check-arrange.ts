/**
 * Checks the arithmetic behind dragging.
 *
 * Dragging is the one part of the site somebody feels rather than reads, and the part
 * that cannot be verified by looking at a rendered plan: a snap that fires 200 mm early
 * or a turned wardrobe that clamps against the wrong dimension both produce a drawing
 * that looks perfectly reasonable and behaves wrongly under the hand.
 *
 * Run with: npm run arrange
 */

import type { Box } from '../src/data/types';
import { clampInto, footprintOf, linesFor, snapTo, SNAP, STEP } from '../src/lib/arrange';

let failures = 0;

function check(what: string, got: unknown, want: unknown) {
  const same = JSON.stringify(got) === JSON.stringify(want);
  if (!same) {
    failures += 1;
    console.log(`  FAIL ${what}\n       got  ${JSON.stringify(got)}\n       want ${JSON.stringify(want)}`);
  }
}

/* ── Footprints ────────────────────────────────────────────────────────────── */

const wardrobe = { width: 1200, depth: 600 };

check(
  'unturned piece keeps its footprint',
  footprintOf(wardrobe, { x: 100, y: 100 }, 0),
  { x: 100, y: 100, width: 1200, depth: 600 },
);
check(
  'half a turn keeps its footprint',
  footprintOf(wardrobe, { x: 100, y: 100 }, 180),
  { x: 100, y: 100, width: 1200, depth: 600 },
);
check(
  'a quarter turn swaps it',
  footprintOf(wardrobe, { x: 100, y: 100 }, 90),
  { x: 100, y: 100, width: 600, depth: 1200 },
);
check(
  'three quarters swaps it too',
  footprintOf(wardrobe, { x: 100, y: 100 }, 270),
  { x: 100, y: 100, width: 600, depth: 1200 },
);

/* ── Snapping ──────────────────────────────────────────────────────────────── */

const room: Box = { x: 100, y: 100, width: 3400, depth: 3050 };
const walls = linesFor('x', room, []);

check('the near wall is a line', walls.includes(100), true);
check('the far wall is a line', walls.includes(3500), true);

check(
  'a piece dropped near the west wall goes flush to it',
  snapTo(140, 1200, walls),
  100,
);
check(
  'a piece dropped near the east wall goes flush by its far edge',
  snapTo(2260, 1200, walls),
  2300,
);
check(
  'a piece dropped in open floor is rounded, not moved',
  snapTo(1637, 1200, walls),
  1640,
);
check(
  'just outside the tolerance does not snap',
  snapTo(100 + SNAP + 1, 1200, walls),
  Math.round((100 + SNAP + 1) / STEP) * STEP,
);
check('just inside the tolerance does snap', snapTo(100 + SNAP - 1, 1200, walls), 100);

const neighbour: Box = { x: 800, y: 500, width: 700, depth: 700 };
const withNeighbour = linesFor('x', room, [neighbour]);

check(
  'a piece lines up with a neighbour\u2019s near edge',
  snapTo(830, 400, withNeighbour),
  800,
);
check(
  'a piece lines up against a neighbour\u2019s far edge',
  snapTo(1470, 400, withNeighbour),
  1500,
);
check(
  'the closer of two candidate lines wins',
  /** 760 is 40 from the neighbour at 800 and 660 from the wall at 100. */
  snapTo(760, 400, withNeighbour),
  800,
);

/* ── Staying in the room ───────────────────────────────────────────────────── */

check(
  'a piece pushed past the west wall stops at it',
  clampInto({ x: -500, y: 200, width: 1200, depth: 600 }, room),
  { x: 100, y: 200 },
);
check(
  'a piece pushed past the east wall stops at it',
  clampInto({ x: 9000, y: 200, width: 1200, depth: 600 }, room),
  { x: 2300, y: 200 },
);
check(
  'a piece pushed past the south wall stops at it',
  clampInto({ x: 200, y: 9000, width: 1200, depth: 600 }, room),
  { x: 200, y: 2550 },
);
check(
  'a turned piece clamps against its turned footprint',
  /** 600 wide once turned, so it may sit as far east as 3500 - 600. */
  clampInto(footprintOf(wardrobe, { x: 9000, y: 200 }, 90), room),
  { x: 2900, y: 200 },
);
check(
  'a piece larger than the room ends up at its corner rather than nowhere',
  clampInto({ x: 500, y: 500, width: 9000, depth: 9000 }, room),
  { x: 100, y: 100 },
);

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} failed.`);
process.exit(failures === 0 ? 0 : 1);
