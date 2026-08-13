import { placed } from '~/lib/geometry';
import type { Furniture, Room } from '~/data/types';

/**
 * 2550 east–west by 4500 north–south, window at the north end, door at the south
 * end of the east wall.
 *
 * Three designs, and the first two are not alternatives: they are the same room in
 * the morning and at night, and both are checked. The third is the room with beds
 * bought for it, drawn to price that decision rather than to propose it.
 */

/**
 * One colour per child, so a two-year-old can find their own things before they can
 * read a label. Macaron rather than primary: at this chroma the colours still tell
 * two children's belongings apart, and none of them competes with what is put on it
 * — a room whose walls and furniture shout has nothing left to give a toy.
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

/**
 * The mat is not furniture that gets moved: it is the floor of the room, down all
 * day and all night. It reaches every wall except at the door, where a 900 by 1000
 * square of bare floor is left as somewhere to stand and take shoes off. Two
 * rectangles rather than one, because a footprint here is a rectangle and the shape
 * needed is a rectangle with the door's corner bitten out of it.
 */
const MAT_PIECES: Furniture[] = [
  placed(0, 0, {
    id: 'mat-main',
    name: 'Floor mat, main run',
    short: 'Mat',
    kind: 'rug',
    width: 2550,
    depth: 3500,
    height: 25,
    colour: MAT,
    status: 'planned',
    material: 'Washable foam, wall to wall',
    note: 'Wall to wall, and permanent. Everything in the room stands on it, which is why nothing in the room is heavy on a small foot.',
  }),
  placed(0, 3500, {
    id: 'mat-door',
    name: 'Floor mat, door end',
    short: 'Mat',
    kind: 'rug',
    width: 1650,
    depth: 1000,
    height: 25,
    colour: MAT,
    status: 'planned',
    note: 'Stops 900 mm short of the east wall, leaving the square inside the door bare. That square is where shoes come off, and it is the one part of the floor that is never sat on.',
  }),
];

/** Storage, the table and the mat stand in the same places whatever time of day it is. */
const FITTED: Furniture[] = [
  ...MAT_PIECES,
  placed(1950, 2500, {
    id: 'bedding-store',
    name: 'Bedding cupboard',
    short: 'Bedding',
    kind: 'wardrobe',
    width: 900,
    depth: 600,
    height: 1350,
    rotation: 90,
    clearance: { south: 900 },
    colour: MINT,
    status: 'planned',
    material: 'Birch ply, two doors, soft-close',
    note: 'Holds both sleeping bags and nothing else it needs to. Next to the door because it is opened twice a day, and kept to 1350 mm so an adult reaches the top and a toddler cannot climb it.',
  }),
  placed(2150, 1450, {
    id: 'toy-bins',
    name: 'Low toy bins',
    short: 'Toys',
    kind: 'shelving',
    width: 900,
    depth: 400,
    height: 600,
    rotation: 90,
    clearance: { south: 500 },
    colour: BUTTER,
    status: 'planned',
    material: 'Open frame, four canvas bins',
    note: 'Open bins rather than a lidded chest: no lid to drop on fingers, and a two-year-old can put things away without help.',
  }),
  placed(2250, 500, {
    id: 'book-display',
    name: 'Picture book display',
    short: 'Picture books',
    kind: 'shelving',
    width: 800,
    depth: 300,
    height: 700,
    rotation: 90,
    clearance: { south: 500 },
    colour: LAVENDER,
    status: 'planned',
    material: 'Birch ply, sloped front-facing shelves',
    note: 'At the north end where the light is. Covers face out and the top shelf is at 700 mm, because a two-year-old chooses a book by its picture and only from a shelf they can reach.',
  }),
  placed(1000, 650, {
    id: 'play-table',
    name: 'Play table',
    short: 'Play table',
    kind: 'table',
    width: 700,
    depth: 500,
    height: 480,
    clearance: { north: 400, south: 400 },
    colour: BIRCH,
    status: 'planned',
    material: 'Birch ply, rounded corners, wipeable top',
    note: 'A 480 mm top for 280 mm seats: the height a two-year-old can get onto unaided, which is the whole point of having one rather than using the floor. Set at the window end and off the east wall, so both children can be at it and neither is in the way of the shelves.',
  }),
  placed(1100, 300, {
    id: 'chair-older',
    name: 'Chair, older child',
    short: 'Chair',
    kind: 'chair',
    width: 300,
    depth: 300,
    height: 560,
    colour: OLDER,
    status: 'planned',
    material: 'Birch, 280 mm seat',
  }),
  placed(1300, 1200, {
    id: 'chair-younger',
    name: 'Chair, younger child',
    short: 'Chair',
    kind: 'chair',
    width: 300,
    depth: 300,
    height: 560,
    colour: YOUNGER,
    status: 'planned',
    material: 'Birch, 280 mm seat',
  }),
  placed(250, 3700, {
    id: 'floor-cushion',
    name: 'Floor cushion',
    short: 'Cushion',
    kind: 'armchair',
    width: 600,
    depth: 600,
    height: 400,
    colour: PISTACHIO,
    status: 'considering',
    material: 'Washable cover',
    note: 'For an adult to sit at child height and read. Kept at the door end, which is the one part of the floor no bag is laid on, so it never has to be moved.',
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
      floor: { name: 'Existing floor, bare only at the door', colour: '#e2ded4' },
      summary:
        'Nothing sleeps here by day. Both bags are folded into the cupboard by the door and what is left is the whole floor: mat to every wall except the 900 by 1000 square inside the door where shoes come off. Furniture covers 18% of it, all of it standing on the mat and all of it low — the tallest thing in the room is the bedding cupboard at 1350 mm, which an adult can reach over and a toddler cannot climb. The table is the piece that was missing from the first version of this room: at 480 mm with 280 mm seats it is a height a two-year-old gets onto without help, which is what makes it get used instead of the floor. Colour does a job here rather than decorating: one flat colour per object, and one per child on the things that are theirs.',
      furniture: [...FITTED],
      openQuestions: [
        'The window figures are assumed: 1500 wide, 1200 high, sill at 900, centred on the wall. Worth measuring, because at a sill of 900 nothing climbable may stand under it.',
        'Where the air conditioner is has not been recorded, and it matters more in a room slept in on the floor than in one with beds, because the coldest air in a room is at floor level.',
        'A 1350 mm cupboard standing on 25 mm of foam will sink into it unevenly and can be rocked. It has to be screwed to the wall, and that is not optional in a room with a two-year-old in it.',
        'The mat is in two pieces to leave the door square bare. Both pieces still want lifting to dry; 2.55 by 3.5 m is a two-person job, and splitting the main run again would make it one.',
      ],
    },
    {
      id: 'night',
      name: 'Midday and night',
      theme: 'Two bags down the middle, feet to feet',
      style: 'macaron',
      floor: { name: 'Existing floor, bare only at the door', colour: '#e2ded4' },
      summary:
        'Two sleeping bags, 1400 by 700 each, laid end to end down the room with the children’s feet meeting in the middle — so neither is breathing on the other and neither can reach the other’s face, which is what settles two children a year apart in one room. Head to head they would take the same 2.8 m; feet to feet they get 700 mm of separation for nothing. The pair sits against the west side, which leaves a 1.6 m aisle down the east for an adult to walk in, reach either child, and get to the cupboard without stepping over anybody. Nothing has to be moved to lay them out: the table, the shelves and the cushion all stand clear of the 700 mm strip the bags need. That is the test this design exists to pass.',
      furniture: [
        ...FITTED,
        placed(250, 700, {
          id: 'bag-older',
          name: 'Sleeping bag, older child',
          short: 'Older child',
          kind: 'bed',
          width: 700,
          depth: 1400,
          height: 200,
          colour: OLDER,
          status: 'owned',
          material: 'Sleeping bag, laid straight on the mat',
          note: 'Head to the north. 1400 by 700 opened out, folded into the cupboard every morning.',
        }),
        placed(250, 2100, {
          id: 'bag-younger',
          name: 'Sleeping bag, younger child',
          short: 'Younger child',
          kind: 'bed',
          width: 700,
          depth: 1400,
          /** Turned end for end, so the two children lie feet to feet. */
          rotation: 180,
          height: 200,
          colour: YOUNGER,
          status: 'owned',
          material: 'Sleeping bag, laid straight on the mat',
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
        placed(0, 400, {
          id: 'bed-older',
          name: 'Bed, older child',
          short: 'Older child',
          kind: 'bed',
          width: 1050,
          depth: 2000,
          height: 850,
          colour: OLDER,
          status: 'considering',
          material: 'Single, drawers under',
          note: 'Head to the north. Both beds run along the west wall end to end, and their feet meet in the middle.',
        }),
        placed(0, 2450, {
          id: 'bed-younger',
          name: 'Bed, younger child',
          short: 'Younger child',
          kind: 'bed',
          width: 1050,
          depth: 2000,
          height: 850,
          /** Turned end for end, so this head is at the south wall. */
          rotation: 180,
          colour: YOUNGER,
          status: 'considering',
          material: 'Single, drawers under',
        }),
        placed(1100, 0, {
          id: 'desk-window',
          name: 'Desk at the window',
          short: 'Desk (window)',
          kind: 'desk',
          width: 1100,
          depth: 600,
          height: 740,
          clearance: { south: 750 },
          status: 'considering',
          note: 'Top at 740 against a sill at 900, so the desk passes under the glass instead of blocking it.',
        }),
        placed(1400, 700, {
          id: 'chair-window',
          name: 'Chair at the window',
          short: 'Chair',
          kind: 'chair',
          width: 450,
          depth: 450,
          height: 820,
          colour: OLDER,
          status: 'considering',
        }),
        placed(1950, 1700, {
          id: 'desk-east',
          name: 'Desk on the east wall',
          short: 'Desk (east)',
          kind: 'desk',
          width: 1100,
          depth: 600,
          height: 740,
          rotation: 90,
          clearance: { south: 750 },
          status: 'considering',
          note: 'Faces west into the room. No daylight of its own, so it needs a task lamp the other desk does not.',
        }),
        placed(1300, 1950, {
          id: 'chair-east',
          name: 'Chair on the east wall',
          short: 'Chair',
          kind: 'chair',
          width: 450,
          depth: 450,
          height: 820,
          colour: YOUNGER,
          status: 'considering',
        }),
        placed(2300, 2250, {
          id: 'wall-shelves',
          name: 'Wall shelves',
          short: 'Shelves',
          kind: 'shelving',
          width: 1200,
          depth: 250,
          height: 250,
          rotation: 90,
          mountedAt: 1200,
          status: 'considering',
          material: 'Two boards, wall-fixed',
          note: 'On the wall rather than on the floor: a 350 mm bookcase here would take a fifth of the width of the only route through the room. Stops 50 mm short of where the door leaf reaches.',
        }),
      ],
      openQuestions: [
        'A bunk and one shared desk would bring this back to about 30% covered, at the cost of one child sleeping in the air. That is the comparison worth drawing next, not this one against the floor.',
        'Neither this nor the floor version has anywhere for clothes. If a wardrobe has to come into this room, 600 mm of the spine goes and the east desk goes with it.',
      ],
    },
  ],
};
