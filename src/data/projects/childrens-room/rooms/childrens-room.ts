import { fromCatalogue } from '~/data/catalogue';
import type { Furniture, Room } from '~/data/types';

/**
 * 2550 east–west by 4500 north–south, window at the north end, door at the south
 * end of the east wall.
 *
 * Nothing here states a dimension. Every object is pulled from the catalogue, which
 * holds its size, and this file says only which object, where it goes, and why. Three
 * designs: the first two are the same room in the morning and at night, and both are
 * checked; the third is the room with beds bought for it, drawn to price that.
 */

/**
 * One colour per child, so a two-year-old can find their own things before they can
 * read a label. Macaron rather than primary: at this chroma the colours still tell
 * two children's belongings apart and none of them competes with what is put on it.
 */
const OLDER = '#a9cbe8';
const YOUNGER = '#f4b6ae';
const MINT = '#b7dbc9';
const BUTTER = '#f6e2a3';
const LAVENDER = '#d6c3e6';
const PISTACHIO = '#cfe2b2';
const BIRCH = '#ecdcc4';
/** Milk tea. Warm enough that everything standing on it reads as an object on a floor. */
const MAT = '#d5bfa3';

/** The bare floor only shows in the square inside the door. */
const FLOOR = { name: 'Existing floor, bare only at the door', colour: '#e2ded4' };

/**
 * The mat is not furniture that gets moved: it is the floor of the room, down all day
 * and all night. It reaches every wall except at the door, where a 900 by 1000 square
 * of bare floor is left as somewhere to stand and take shoes off. Two pieces rather
 * than one, because the shape wanted is a rectangle with the door's corner bitten out
 * of it and a footprint here is a rectangle.
 */
const MAT_PIECES: Furniture[] = [
  fromCatalogue('floor-mat', 0, 0, {
    id: 'mat-main',
    name: 'Floor mat, main run',
    width: 2550,
    depth: 3500,
    colour: MAT,
    status: 'planned',
    note: 'Wall to wall, and permanent. Everything in the room stands on it, which is why nothing in the room is heavy on a small foot.',
  }),
  fromCatalogue('floor-mat', 0, 3500, {
    id: 'mat-door',
    name: 'Floor mat, door end',
    width: 1650,
    depth: 1000,
    colour: MAT,
    status: 'planned',
    note: 'Stops 900 mm short of the east wall, leaving the square inside the door bare. That square is where shoes come off, and it is the one part of the floor never sat on.',
  }),
];

/** Storage, the table and the mat stand in the same places whatever time of day it is. */
const FITTED: Furniture[] = [
  ...MAT_PIECES,
  fromCatalogue('cupboard-bedding', 1950, 2500, {
    rotation: 90,
    colour: MINT,
    status: 'planned',
    note: 'Holds both sleeping bags and nothing else it needs to. Next to the door because it is opened twice a day.',
  }),
  fromCatalogue('shelving-toy-bins', 2150, 1450, {
    rotation: 90,
    colour: BUTTER,
    status: 'planned',
  }),
  fromCatalogue('shelving-book-display', 2250, 500, {
    rotation: 90,
    colour: LAVENDER,
    status: 'planned',
    note: 'At the north end, where the light is.',
  }),
  fromCatalogue('table-play-toddler', 1000, 650, {
    colour: BIRCH,
    status: 'planned',
    note: 'Set at the window end and off the east wall, so both children can be at it and neither is in the way of the shelves.',
  }),
  fromCatalogue('chair-toddler', 1100, 300, {
    id: 'chair-older',
    name: 'Chair, older child',
    colour: OLDER,
    status: 'planned',
  }),
  fromCatalogue('chair-toddler', 1300, 1200, {
    id: 'chair-younger',
    name: 'Chair, younger child',
    colour: YOUNGER,
    status: 'planned',
  }),
  fromCatalogue('floor-cushion', 250, 3700, {
    colour: PISTACHIO,
    status: 'considering',
    note: 'Kept at the door end, which is the one part of the floor no bag is laid on, so it never has to be moved.',
  }),
];

export const CHILDRENS_ROOM: Room = {
  id: 'childrens-room',
  name: "Children's room",
  kind: 'bedroom',
  origin: { x: 200, y: 200 },
  shape: { kind: 'rect', width: 2550, depth: 4500 },
  ceiling: 2600,
  openings: [
    {
      id: 'door',
      kind: 'door-swing',
      side: 'east',
      /** From the north end. 3500 puts the leaf 100 mm off the south wall. */
      offset: 3500,
      width: 900,
      height: 2000,
      sill: 0,
      /** Hinged at the south end, so the leaf lies back against the south wall. */
      swing: 'right-in',
      to: 'corridor',
    },
    {
      id: 'north-window',
      kind: 'window',
      side: 'north',
      offset: 525,
      width: 1500,
      height: 1200,
      sill: 900,
      to: 'outside',
    },
  ],
  designs: [
    {
      id: 'day',
      name: 'Morning and afternoon',
      preferred: true,
      theme: 'A floor to play on, a table to sit at, and no beds in the room at all',
      style: 'macaron',
      floor: FLOOR,
      summary:
        'Nothing sleeps here by day. Both bags are folded into the cupboard by the door and what is left is the whole floor: mat to every wall except the 900 by 1000 square inside the door where shoes come off. Furniture covers 18% of it, all of it standing on the mat and all of it low — the tallest thing in the room is the bedding cupboard at 1350 mm, which an adult can reach over and a toddler cannot climb. The table is what was missing from the first version of this room: at 480 mm with 280 mm seats it is a height a two-year-old gets onto without help, which is what makes it get used instead of the floor. Colour does a job here rather than decorating: one flat pastel per object, and one per child on the things that are theirs.',
      furniture: [...FITTED],
      openQuestions: [
        'The window figures are assumed: 1500 wide, 1200 high, sill at 900, centred on the wall. Worth measuring, because at a sill of 900 nothing climbable may stand under it.',
        'Where the air conditioner is has not been recorded, and it matters more in a room slept in on the floor than in one with beds, because the coldest air in a room is at floor level.',
        'A 1350 mm cupboard standing on 25 mm of foam will sink into it unevenly and can be rocked. It has to be screwed to the wall, and that is not optional in a room with a two-year-old in it.',
        'Every figure in this room except the sleeping bags is a typical size for its type rather than a measured one. The catalogue marks which is which; they are good enough to plan against and want confirming before anything is ordered.',
      ],
    },
    {
      id: 'night',
      name: 'Midday and night',
      theme: 'Two bags down the middle, feet to feet',
      style: 'macaron',
      floor: FLOOR,
      summary:
        'Two sleeping bags, 1400 by 700 each, laid end to end down the room with the children’s feet meeting in the middle — so neither is breathing on the other and neither can reach the other’s face, which is what settles two children a year apart in one room. Head to head they would take the same 2.8 m; feet to feet they get 700 mm of separation for nothing. The pair sits against the west side, which leaves a 1.6 m aisle down the east for an adult to walk in, reach either child, and get to the cupboard without stepping over anybody. Nothing has to be moved to lay them out: the table, the shelves and the cushion all stand clear of the 700 mm strip the bags need. That is the test this design exists to pass.',
      furniture: [
        ...FITTED,
        fromCatalogue('sleeping-bag-toddler', 250, 700, {
          id: 'bag-older',
          name: 'Sleeping bag, older child',
          short: 'Older child',
          colour: OLDER,
          status: 'owned',
          note: 'Head to the north. Folded into the cupboard every morning.',
        }),
        fromCatalogue('sleeping-bag-toddler', 250, 2100, {
          id: 'bag-younger',
          name: 'Sleeping bag, younger child',
          short: 'Younger child',
          /** Turned end for end, so the two children lie feet to feet. */
          rotation: 180,
          colour: YOUNGER,
          status: 'owned',
          note: 'Head to the south, feet meeting the other bag in the middle of the room.',
        }),
      ],
      openQuestions: [
        'A 1400 mm bag suits a two-year-old and not a five-year-old. Two 1800 mm bags feet to feet come to 3.6 m, which this room still takes with 900 mm to spare — so the arrangement survives the children growing, and only the bags have to be replaced.',
        'Feet to feet puts one child’s head at the window end and the other’s at the door end. The one by the door will hear the household; the one by the window will get the morning light. Which child gets which is worth deciding on purpose rather than by which bag is laid out first.',
        'The play table stands 50 mm from the older child’s bag, level with their shoulders. Its top is well above a lying child but its legs are not, and a child in a bag rolls. Either the table moves 300 mm east at night, which defeats the point of nothing having to be moved, or its legs want to be the round ones.',
      ],
    },
    {
      id: 'fixed-beds',
      name: 'Later, with fixed beds',
      theme: 'What buying beds would cost, drawn so the choice can be made against something',
      style: 'macaron',
      floor: { name: 'Existing floor, mat lifted', colour: '#e2ded4' },
      summary:
        'The version of this room with two single beds and two desks in it. Everything fits: the beds run end to end along the west wall, using 4 m of its 4.5 m, and a 1.5 m spine down the east side takes both desks and the walking. But furniture then covers 52% of the floor, which the checks call crowded and which they are right about — the floor stops being a place and becomes the gaps between four large objects, and the mat comes up because there is no longer any floor worth covering. The point of drawing it is that sleeping on the floor is not a compromise made for now: it is what keeps the room from becoming this. If beds are ever wanted, the honest comparison is against a bunk and one shared desk, not against this.',
      furniture: [
        fromCatalogue('bed-single', 0, 400, {
          id: 'bed-older',
          name: 'Bed, older child',
          short: 'Older child',
          colour: OLDER,
          status: 'considering',
          note: 'Head to the north. Both beds run along the west wall end to end, and their feet meet in the middle.',
        }),
        fromCatalogue('bed-single', 0, 2450, {
          id: 'bed-younger',
          name: 'Bed, younger child',
          short: 'Younger child',
          /** Turned end for end, so this head is at the south wall. */
          rotation: 180,
          colour: YOUNGER,
          status: 'considering',
        }),
        fromCatalogue('desk-1100', 1100, 0, {
          id: 'desk-window',
          name: 'Desk at the window',
          short: 'Desk (window)',
          status: 'considering',
        }),
        fromCatalogue('chair-desk', 1400, 700, {
          id: 'chair-window',
          name: 'Chair at the window',
          colour: OLDER,
          status: 'considering',
        }),
        fromCatalogue('desk-1100', 1950, 1700, {
          id: 'desk-east',
          name: 'Desk on the east wall',
          short: 'Desk (east)',
          rotation: 90,
          status: 'considering',
          note: 'Faces west into the room. No daylight of its own, so it needs a task lamp the other desk does not.',
        }),
        fromCatalogue('chair-desk', 1300, 1950, {
          id: 'chair-east',
          name: 'Chair on the east wall',
          colour: YOUNGER,
          status: 'considering',
        }),
        fromCatalogue('shelves-wall-1200', 2300, 2250, {
          rotation: 90,
          status: 'considering',
          note: 'Stops 50 mm short of where the door leaf reaches.',
        }),
      ],
      openQuestions: [
        'A bunk and one shared desk would bring this back to about 30% covered, at the cost of one child sleeping in the air. That is the comparison worth drawing next, not this one against the floor.',
        'Neither this nor the floor version has anywhere for clothes. If a wardrobe has to come into this room, 600 mm of the spine goes and the east desk goes with it.',
      ],
    },
  ],
};
