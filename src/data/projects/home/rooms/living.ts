import { fromCatalogue } from '~/data/catalogue';
import { single, type Room } from '~/data/types';

/**
 * 2500 east–west by 3050 north–south, at the east end. It is 450 deeper than the
 * dining room and they share their south wall, so the building steps out to the
 * north across this room — and that step is very nearly the depth of the television
 * cabinet standing in it. The room is 3050 to the wall and 2670 to the front of the
 * cabinet, which is what makes it read as the same depth as the dining room.
 *
 * Open to the dining room on its west side, with a window in the east wall.
 */
export const LIVING: Room = {
  id: 'living',
  name: 'Living',
  kind: 'living',
  origin: { x: 7100, y: 200 },
  shape: { kind: 'rect', width: 2500, depth: 3050 },
  ceiling: 2600,
  openings: [
    {
      id: 'east-window',
      kind: 'window',
      side: 'east',
      /** Assumed: centred on the wall, and assumed figures throughout. */
      offset: 625,
      width: 1800,
      height: 1500,
      sill: 900,
      to: 'outside',
    },
  ],
  designs: single({
    theme: 'The deep end of an open plan, with the only window in it',
    style: 'warm-minimal',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'Three metres and a bit deep against the dining room’s 2.6, sharing the south wall, so the whole difference is at the north — a recess the width of the room with a 380 mm cabinet built into it. That leaves 2670 clear, near enough the dining room’s depth that the two read as one space with a television at the end of it. The east wall carries the only window on this side of the flat. Seating is not laid out yet: with no partition to the dining room, where a sofa can go depends on the route through, and that route runs to a corridor whose position is still approximate.',
    furniture: [
      fromCatalogue('fitted-run-380', 0, 0, {
        id: 'tv-run',
        name: 'Television cabinet',
        short: 'TV',
        width: 2500,
        depth: 380,
        status: 'owned',
        note: 'Full width of the north wall, in the recess the room’s extra depth makes. Its 380 takes up all but 70 mm of that step.',
      }),
    ],
    openQuestions: [
      'The window’s own figures are assumed — 1800 wide, 1500 high, sill at 900, centred. Everything about how this room can be arranged depends on them.',
      'The television cabinet is drawn the full 2500 width of the wall. If it stops short of either end, the recess gains a corner that could take something tall.',
      'No door anywhere in this room, which is correct if the flat is open from the front door to here. Whether anything closes between the entry and the living room is worth saying out loud.',
    ],
  }),
};
