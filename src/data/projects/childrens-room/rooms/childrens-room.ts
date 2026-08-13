import { fromCatalogue } from '~/data/catalogue';
import type { Furniture, Room } from '~/data/types';

/**
 * 2550 east–west by 4500 north–south, window at the north end, door at the south
 * end of the east wall.
 *
 * Every object in it now has measured dimensions rather than typical ones, and that
 * changed the layout: the storage family is 440 deep where the assumed pieces were
 * 600, which gives back 160 mm of a room only 2550 wide, and the table is 830 where
 * the assumed one was 700. Nothing here states a size — each piece names a catalogue
 * entry, and this file says only which, where and why.
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
const BIRCH = '#ecdcc4';
/** Milk tea. Warm enough that everything standing on it reads as an object on a floor. */
const MAT = '#d5bfa3';

/** The bare floor only shows in the square inside the door. */
const FLOOR = { name: 'Existing floor, bare only at the door', colour: '#e2ded4' };

/**
 * The mat is not furniture that gets moved: it is the floor of the room, down all day
 * and all night. It reaches every wall except at the door, where a 900 by 1000 square
 * of bare floor is left as somewhere to stand and take shoes off.
 *
 * It is one piece of material. It takes two rectangles to describe here only because a
 * footprint is a rectangle and the shape wanted has the door's corner cut out of it;
 * mats are drawn without an outline so the two meet invisibly, as the material does.
 */
const MAT_PIECES: Furniture[] = [
  fromCatalogue('floor-mat', 0, 0, {
    id: 'mat-main',
    name: 'Floor mat, cut to the room',
    short: 'Mat',
    width: 2550,
    depth: 3500,
    colour: MAT,
    status: 'planned',
    note: 'One piece, wall to wall, and permanent. It is listed as two rectangles because a footprint here is a rectangle and the shape wanted has the door’s corner cut out of it — the material and the order are one mat.',
  }),
  fromCatalogue('floor-mat', 0, 3500, {
    id: 'mat-door',
    name: 'Floor mat, continued',
    /** Empty, so the plan does not label one mat twice. */
    short: '',
    width: 1650,
    depth: 1000,
    colour: MAT,
    status: 'planned',
    note: 'The part that runs down beside the door. It stops 900 mm short of the east wall, leaving the square inside the door bare: that square is where shoes come off, and it is the one part of the floor never sat on.',
  }),
];

/**
 * Everything except the bedding stands in the same place all day and all night.
 *
 * All three storage units go on the east wall in one line. They are 440 deep and the
 * bookshelf is 280, so the run intrudes less than half a metre into a room 2.55 m
 * across, and their order runs by height: the bookshelf at 410 nearest the window,
 * the toy cabinet at 560, then the tall one at 910 by the door. That puts the lowest
 * thing where the light is and the only adult-height thing where an adult comes in.
 */
const FITTED: Furniture[] = [
  ...MAT_PIECES,
  fromCatalogue('bookshelf-490', 2270, 400, {
    id: 'book-display',
    name: 'Picture books',
    rotation: 90,
    colour: LAVENDER,
    status: 'owned',
    note: 'At the north end where the light is, and at 410 mm high a two-year-old reaches every shelf in it.',
  }),
  fromCatalogue('cabinet-990-low', 2110, 1200, {
    id: 'toy-cabinet',
    name: 'Toy cabinet',
    short: 'Toys',
    rotation: 90,
    colour: BUTTER,
    status: 'owned',
    note: 'The widest of the family and one of the lowest, which is what makes it the toy one: at 560 mm a child can reach the top and put things away without help.',
  }),
  fromCatalogue('cabinet-930-tall', 2110, 2290, {
    id: 'bedding-cabinet',
    name: 'Bedding cabinet',
    short: 'Bedding',
    rotation: 90,
    colour: MINT,
    status: 'owned',
    note: 'Both sleeping bags live here, and it is by the door because it is opened twice a day. The 910 height is the only one in the family an adult can use without crouching — and the only one that has to be screwed to the wall.',
  }),
  fromCatalogue('table-play-830', 900, 550, {
    colour: BIRCH,
    status: 'owned',
    note: 'Held 900 mm off the west wall so it clears the sleeping bags, and 140 mm off the bookshelf’s reach, which leaves it standing free with a child on each long side.',
  }),
  fromCatalogue('chair-toddler-320', 1200, 200, {
    id: 'chair-older',
    name: 'Chair, older child',
    colour: OLDER,
    status: 'owned',
  }),
  fromCatalogue('chair-toddler-320', 1250, 1160, {
    id: 'chair-younger',
    name: 'Chair, younger child',
    colour: YOUNGER,
    status: 'owned',
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
        'Nothing sleeps here by day. Both bags are folded into the cabinet by the door and what is left is the whole floor: mat to every wall except the 900 by 1000 square inside the door where shoes come off. Furniture covers 15% of it. All three storage units stand in one line on the east wall — they are 440 deep, which is 160 mm less than the pieces this room was first drawn with, and in a room 2.55 m across that is most of what makes the table able to stand free rather than against a wall. They run by height, lowest at the window: bookshelf at 410, toy cabinet at 560, then the 910 one by the door. The tallest thing is therefore where an adult comes in, and the shortest is where the light is.',
      furniture: [...FITTED],
      openQuestions: [
        'The window figures are still assumed: 1500 wide, 1200 high, sill at 900, centred on the wall. At a sill of 910 the tall cabinet would begin to cross it; it stands 85 mm clear of the glass as drawn, which is not much of a margin to be holding on an assumed figure.',
        'Where the air conditioner is has not been recorded, and it matters more in a room slept in on the floor than in one with beds, because the coldest air in a room is at floor level.',
        'The 910 cabinet stands on 25 mm of foam and is the one thing here tall enough to go over. It has to be screwed to the wall, and that is not optional in a room with a two-year-old in it.',
        'There is nowhere in this room for clothes, and nothing has been assumed about where they go instead. A wardrobe would have to come out of the 1.5 m of clear floor the night layout depends on — so if clothes have to live in here, the sleeping arrangement is what pays for it.',
        'The chair height was given as 280 mm, which is a seat height and pairs correctly with the 480 table. If the chairs have backs, their overall height is nearer 560, which changes nothing in plan.',
      ],
    },
    {
      id: 'night',
      name: 'Midday and night',
      theme: 'Two bags down the west side, feet to feet',
      style: 'macaron',
      floor: FLOOR,
      summary:
        'Two sleeping bags, 1400 by 700 each, laid end to end against the west wall with the children’s feet meeting in the middle — so neither is breathing on the other and neither can reach the other’s face, which is what settles two children a year apart in one room. Head to head they would take the same 2.8 m; feet to feet they get 700 mm of separation for nothing. Everything else stays exactly where it stands by day: the bags clear the table by 50 mm and the storage run by more than half a metre, so laying them out is a matter of taking them out of the cabinet and unrolling them. Furniture and bedding together cover 32% of the floor, and the aisle between the bags and the storage is 1.26 m — enough to walk in at night, kneel beside either child, and open the bedding cabinet without stepping over anybody.',
      furniture: [
        ...FITTED,
        fromCatalogue('sleeping-bag-toddler', 150, 700, {
          id: 'bag-older',
          name: 'Sleeping bag, older child',
          short: 'Older child',
          colour: OLDER,
          status: 'owned',
          note: 'Head to the north. Folded into the cabinet every morning.',
        }),
        fromCatalogue('sleeping-bag-toddler', 150, 2100, {
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
        'The bedding cabinet is 440 deep, not 600. That is enough for two sleeping bags and not enough for folded floor mattresses, so the choice of bags over mattresses is now a consequence of the furniture rather than a preference. If mattresses are ever wanted, they have to be stored somewhere else.',
        'A 1400 mm bag suits a two-year-old and not a five-year-old. Two 1800 mm bags feet to feet come to 3.6 m, which this room still takes with 900 mm to spare — so the arrangement survives the children growing, and only the bags have to be replaced.',
        'Feet to feet puts one child’s head at the window end and the other’s at the door end. The one by the door will hear the household; the one by the window will get the morning light. Which child gets which is worth deciding on purpose rather than by which bag is unrolled first.',
        'The table stands 50 mm from the older child’s bag, level with their chest. Its top is well above a lying child but its legs are not, and a child in a bag rolls. Either the table moves at night, which defeats the point of nothing having to be moved, or its legs want to be the round ones.',
      ],
    },
  ],
};
