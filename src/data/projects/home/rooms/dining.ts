import { fromCatalogue } from '~/data/catalogue';
import { single, type Room } from '~/data/types';

/** The west wall's fitted run, in the piece's own terms before it is turned. */
const RUN = 1630;
const DEPTH = 600;
/** How far the far end is cut back on the door side: the entry run's own depth. */
const CHAMFER = 330;
/** Three equal cupboards fill the run up to where the cut begins. */
const CARCASS = (RUN - CHAMFER) / 3;

/**
 * 4650 east–west by 2600 north–south, wall to wall. The figure quoted as 4050 was
 * this room with its 600 mm fitted run already taken off — the clear width rather
 * than the room.
 *
 * It stands open on three sides. The entry runs into its west end and the living
 * room into its east, neither with a partition, and the last 900 mm of its north wall
 * is a corridor going north into the private half of the flat.
 */
export const DINING: Room = {
  id: 'dining',
  name: 'Dining',
  kind: 'dining',
  origin: { x: 2450, y: 650 },
  shape: { kind: 'rect', width: 4650, depth: 2600 },
  ceiling: 2600,
  openings: [
    {
      id: 'hall-opening',
      kind: 'opening',
      side: 'north',
      /** The last 900 of the north wall, up against the living room. */
      offset: 3750,
      width: 900,
      height: 2100,
      sill: 0,
      to: 'corridor',
      note: 'The way into the private half: guest shower room, children’s room, guest room and main bedroom all open off the corridor beyond it. None of them is surveyed yet.',
    },
  ],
  designs: single({
    theme: 'A room that is 4.65 m wide, has 4.05 m to arrange, and is open on three sides',
    style: 'warm-minimal',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'The west wall carries a 600 mm fitted run, so 600 of the room’s 4650 is spoken for before anything is put in it. The run does not reach the north wall: it stops level with the entry’s shallower one and its end is cut on the diagonal rather than squared off, which is what stops the corner of a 600 mm carcass standing in the way of somebody coming through the front door. What is left is 4.05 by 2.6 m with no wall on either side and a corridor off the north-east corner, which makes this the crossroads of the flat rather than a room in it. Nothing is laid out here yet, because a table in a room three ways open is decided by the routes through it, and one of those routes is not surveyed.',
    furniture: [
      fromCatalogue('fitted-run-600', 0, 970, {
        id: 'dining-run',
        name: 'Fitted storage run',
        /**
         * 1630 long by 600 deep, turned to stand against the west wall with its doors
         * facing east into the room. A piece faces south before it is turned, and 270°
         * takes south to east.
         */
        width: RUN,
        depth: DEPTH,
        rotation: 270,
        /**
         * Square except at the far end — the north end once turned — which is cut back
         * 330 on the door side. The cut runs from the corner where the dining room's
         * west wall meets the entry run's north face, across to where this run's own
         * front face meets the line of the entry's south wall.
         */
        outline: [
          { x: 0, y: 0 },
          { x: RUN, y: 0 },
          { x: RUN - CHAMFER, y: DEPTH },
          { x: 0, y: DEPTH },
        ],
        /** Three equal carcasses, then the line that separates the cut corner from them. */
        divisions: [CARCASS, CARCASS * 2, CARCASS * 3],
        status: 'owned',
        note: 'Starts level with the entry run’s face, 970 mm down the wall, and goes to the south wall. Three equal cupboards of 433 mm with their doors facing east, and beyond them the cut corner, which is a filler panel rather than a fourth door.',
      }),
    ],
    openQuestions: [
      'The total width of the dining and living rooms together is drawn as 7150 — 4650 plus 2500 — where the figure given earlier was 6550. The difference is the 600 mm run, which the earlier figure had already deducted.',
      'Nothing is laid out in here yet. A dining table has to keep clear of three openings, and the corridor is the one whose position is still only approximate.',
    ],
  }),
};
