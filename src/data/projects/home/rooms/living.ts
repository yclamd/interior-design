import { fromCatalogue } from '~/data/catalogue';
import type { Design, Furniture, Point, Room } from '~/data/types';
import { ASSUMED_BOARDS } from '../floors';

/**
 * 3400 east–west by 3050 north–south, at the east end, open to the dining room along its
 * west side. It was 2500 across until it took 900 from the dining room's east end and
 * from the corridor's south end.
 *
 * Every sofa here faces north. The room has one wall a sofa belongs against — the south —
 * and one thing worth facing, which is the length of the room and the television on the
 * north wall. Turning a sofa to face the window across the short axis was drawn twice and
 * both are gone: a seat looking east sits with its back to the way in and its side to the
 * room, and in a room this shape it reads as furniture that has been rotated rather than
 * placed. What varies instead is which sofa, where along that wall it sits, and what comes
 * in beside it.
 *
 * The corner sofa in the south-east is the arrangement the room is best at, and six of the
 * ten use it. Its back runs the south wall and its return runs north up the east wall
 * under the window, so it holds two walls with one object and leaves the floor in one
 * piece — an L opening onto the corner where the dining room and the way through both are.
 *
 * The north wall carries the 380 mm television cabinet east of the corridor opening, and
 * the 900 square inside that opening stays clear in every design. The east wall carries
 * the window, sill assumed at 900, with the rain shelter beyond it.
 *
 * The palette varies again, and that is a reversal worth explaining. It used to vary while
 * the ten layouts were nearly identical, so the colour was doing the work of telling them
 * apart and the drawings lied about how different they were. Now the layouts differ — four
 * sofa types across four positions — so a palette on top of that is a second axis rather
 * than a substitute for the first. It is also the one axis here that costs nothing and can
 * be changed after the flat is built, which is exactly why it is worth seeing early.
 */

/**
 * The corner sofa's footprint, in the piece's own space before it is turned.
 *
 * A run along the back with a return down one side. The return is on the west here and the
 * piece is turned 180°, which puts the back on the south wall and the return up the east —
 * so the handedness is a decision about the room, which is why it lives with the placement
 * and not in the catalogue.
 */
const CORNER_L: Point[] = [
  { x: 0, y: 0 },
  { x: 2400, y: 0 },
  { x: 2400, y: 950 },
  { x: 950, y: 950 },
  { x: 950, y: 1600 },
  { x: 0, y: 1600 },
];

/** The chaise version: a shallower run, and a narrower return that is lain on rather than sat on. */
const CHAISE_L: Point[] = [
  { x: 0, y: 0 },
  { x: 2600, y: 0 },
  { x: 2600, y: 900 },
  { x: 800, y: 900 },
  { x: 800, y: 1550 },
  { x: 0, y: 1550 },
];

/**
 * Neither L-shaped sofa declares a clearance, and that is a limit of the model rather
 * than a claim about the furniture. A clearance here is an offset from one edge of a
 * piece's bounding box, and an L has two fronts inside its own box: the run faces north
 * and the return faces west. Declared off the box, the zone would land north of the
 * return, which is floor nobody steps off it onto. So the legroom in front of these is
 * held by the positions rather than checked, and it is written in each note.
 */
const NO_BOX_CLEARANCE = {};

const CORNER_SOFA = fromCatalogue('sofa-corner-2400', 1000, 1450, {
  rotation: 180,
  outline: CORNER_L,
  clearance: NO_BOX_CLEARANCE,
  status: 'considering',
  note: 'South-east corner, back along the south wall and return north up the east wall under the window. At 830 high it passes below the 900 sill. It leaves 700 mm of floor between its run and the television cabinet, and 1000 mm between its return and the middle of the room.',
});

const CHAISE_SOFA = fromCatalogue('sofa-chaise-2600', 800, 1500, {
  rotation: 180,
  outline: CHAISE_L,
  clearance: NO_BOX_CLEARANCE,
  status: 'considering',
  note: 'The same corner as the corner sofa and 200 mm longer along the wall, but with the return only 800 wide and the back 780 high instead of 830 — lower to look over, so it divides the room less.',
});

const BUILT_IN: Furniture[] = [
  fromCatalogue('fitted-run-380', 900, 0, {
    id: 'tv-run',
    name: 'Television cabinet',
    short: 'TV',
    width: 2500,
    depth: 380,
    status: 'owned',
    note: 'The north wall east of the way through. Its 2500 was the full width of this wall before the room took 900 from the dining room; now the first 900 is the corridor’s landing and the cabinet starts beyond it, at the same length it always was.',
  }),
];

/** The plain three-seat, centred on the south wall, for the designs that want symmetry. */
const SOFA_BIG = fromCatalogue('sofa-three-seat', 610, 2100, {
  rotation: 180,
  clearance: { south: 400 },
  status: 'planned',
  note: 'Centred on the 3400 south wall with 610 either side, facing north. The straight alternative to the corner sofa: less seat, more floor, and two free corners instead of one held one.',
});

/** The two-seat, at the east end, for the designs that want the west of the room for something else. */
const SOFA_SMALL = fromCatalogue('sofa-two-seat', 1770, 2150, {
  rotation: 180,
  clearance: { south: 400 },
  status: 'considering',
  note: 'The east end of the south wall, facing north. It gives up a seat to leave the whole west half of the room for something that is not seating.',
});

export const LIVING_DESIGNS: Design[] = [
  {
    id: 'table-west',
    name: '1 · Corner sofa in the south-east',
    preferred: true,
    theme: 'One object holding two walls, and the floor left in one piece',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The corner sofa in the south-east, back along the south wall and return running north up the east wall under the window, and nothing else in the room. It is the arrangement this room is best at. A single L holds both the walls worth sitting against, so the seating is over in one corner instead of being distributed round the edges, and what is left is one piece of floor 3.4 m wide opening onto the corner where the dining room and the way through both are. It seats five where the straight three-seat seats three, and it covers 37% of the floor doing it. The 700 mm between its run and the television cabinet is the tight figure and it is enough: that is a gangway, and the room does not need to be walked across at that point because the route runs west of the sofa, not in front of it.',
    furniture: [...BUILT_IN, CORNER_SOFA],
    openQuestions: [
      'A corner sofa is the hardest thing in the room to change your mind about. It fits one corner, it cannot be split, and a room arranged round it is arranged round it — which is why the straight three-seat is drawn as design 5 rather than left out.',
      'Its return sits under the window for 650 mm of the glass. At 830 high against a 900 sill it takes no light, but the sill is assumed, and this is the design most exposed to that assumption.',
    ],
  },
  {
    id: 'table-six',
    name: '2 · Corner sofa and a low table',
    theme: 'The corner sofa with something to put a cup on',
    style: 'sage',
    floor: ASSUMED_BOARDS,
    summary:
      'The corner sofa with an 1100 by 600 coffee table in the crook of the L, 450 mm off the run and clear of the return, which is where a table in front of a corner sofa has to go — anywhere further east and it is in front of the part people lie on rather than sit at. It covers 43% of the floor, the highest of the ten and still inside every check, and it answers the one complaint design 1 has. Sage rather than the warm neutral the rest of the flat is in: a green sofa is the one colour that does not argue with a timber floor, and against boards this warm it stops the room reading as one material at two brightnesses.',
    furniture: [
      ...BUILT_IN,
      CORNER_SOFA,
      fromCatalogue('table-coffee', 1225, 1050, {
        status: 'considering',
        note: '450 mm off the run and 125 mm clear of the return, centred in the floor west of it. Its north edge stops 670 mm short of the television cabinet.',
      }),
    ],
    openQuestions: [
      'A 400 high table in the middle of the floor is both a hazard and the first thing to be climbed on. That is not solved by the room being bigger, only made easier to walk round.',
      'At 43% this is the design that would notice a third object. It is the ceiling of what this room takes comfortably rather than a warning.',
    ],
  },
  {
    id: 'extendable',
    name: '3 · Corner sofa and an ottoman',
    theme: 'A surface that is also a seat and also a toy box',
    style: 'slate',
    floor: ASSUMED_BOARDS,
    summary:
      'The corner sofa with a 600 square storage ottoman instead of a table. It is a surface with a tray on it, a sixth seat, and the place the toys go at eight o’clock — three jobs from a footprint 55% the size of the coffee table’s, soft on all four sides at the height a toddler’s head is, and light enough that a child is allowed to move it. Furniture covers 41%. Drawn in slate, which is the one cool palette in the set: blue-grey upholstery against warm boards, so the sofa reads as an object placed in the room rather than as more of the room.',
    furniture: [
      ...BUILT_IN,
      CORNER_SOFA,
      fromCatalogue('ottoman-600', 1500, 1050, {
        status: 'considering',
        note: '450 off the run like a coffee table, and 950 mm clear of the return, so the floor either side of it is a route rather than a gap.',
      }),
    ],
    openQuestions: [
      'An ottoman is a worse table. Nothing with a stem stands up on one, which is most of what gets put on a coffee table.',
      'It only holds what fits in 600 by 600 by 420, which is one evening’s toys and not a day’s.',
    ],
  },
  {
    id: 'bench-south',
    name: '4 · Chaise sofa, and a chair facing it',
    theme: 'A lower back to look over, and a second seat at an angle',
    style: 'terracotta',
    floor: ASSUMED_BOARDS,
    summary:
      'The chaise version in the same corner — 200 mm longer along the wall, a narrower return, and a back 780 high instead of 830 — with an armchair in the west of the room turned to face east across it. The lower back is the point: this is the design for somebody who minds that a corner sofa walls off a quarter of the room, and 50 mm of back height is most of the difference between looking over it and looking at it. The armchair puts a second seat at an angle to the first rather than in a row with it, which is the arrangement for talking. Furniture covers 43%. Terracotta, which is the warmest palette here and the one that needs no daylight to look like a decision.',
    furniture: [
      ...BUILT_IN,
      CHAISE_SOFA,
      fromCatalogue('armchair-750', 250, 1100, {
        rotation: 270,
        status: 'considering',
        note: 'In the west of the room facing east at the sofa, 300 mm of standing room in front of it and 450 clear of the chaise’s run. Not against the dining boundary: 250 mm off it, so the way through is not narrowed.',
      }),
    ],
    openQuestions: [
      'The armchair faces east across the room, which is the one orientation the sofas here are not allowed. A chair is a different case — it is turned to face a person rather than a wall — but if that reads wrong on the drawing it is the piece to move.',
      'A chaise is only a chaise from one end. Whoever sits at the wrong end of it is on a sofa 900 deep with a footstool they cannot reach.',
    ],
  },
  {
    id: 'round',
    name: '5 · Three-seat centred, and both corners left',
    theme: 'The symmetrical answer, for comparison with the corner',
    style: 'japandi',
    floor: ASSUMED_BOARDS,
    summary:
      'The plain three-seat centred on the south wall with 610 either side, a side table at each arm, and both corners of the room left empty. This is the control the corner designs are measured against. It seats three where the corner seats five and covers 33% where the corner covers 37%, and what it buys is reversibility: nothing here is shaped to this room, every piece could go somewhere else in the flat, and the two corners stay available for whatever the next five years asks for. It is also the only design with a surface at both ends of the sofa rather than one in the middle of the floor.',
    furniture: [
      ...BUILT_IN,
      SOFA_BIG,
      fromCatalogue('side-table-450', 100, 2400, {
        id: 'side-table-west',
        name: 'Side table, west',
        status: 'considering',
        note: 'At the west arm, 60 mm off it, and 100 mm off the dining boundary so it is not something to catch on the way through.',
      }),
      fromCatalogue('side-table-450', 2850, 2400, {
        id: 'side-table-east',
        name: 'Side table, east',
        status: 'considering',
        note: 'At the east arm, in the corner the corner sofa would have filled. 550 mm of the south wall is left beyond it.',
      }),
    ],
    openQuestions: [
      'Two side tables and no coffee table is a room where four people have somewhere to put a cup and nowhere to put a tray.',
      'The empty corners are the argument and also the risk: an empty corner in a flat with two small children fills up by itself within a year.',
    ],
  },
  {
    id: 'one-side',
    name: '6 · Seating east, play floor west',
    theme: 'Split the room across its width instead of filling it',
    style: 'macaron',
    floor: ASSUMED_BOARDS,
    summary:
      'The two-seat sofa at the east end of the south wall and the whole west half of the room given to the floor, with a 1.7 by 1.9 m mat marking it. It is the only design here that divides the room rather than furnishing it: the seating is one object in one corner, and what is left is a 1.7 m wide play floor running the full depth and continuing into the dining room without a threshold, which is the largest single piece of child’s floor anywhere in the flat. Furniture covers 23%, the lowest of the ten. It pairs with the dining design that keeps a clear strip along its north wall, and the two together are the version of this flat that is arranged around two children rather than around two adults.',
    furniture: [
      ...BUILT_IN,
      SOFA_SMALL,
      fromCatalogue('rug-flatweave', 0, 1000, {
        id: 'play-mat',
        name: 'Play mat',
        short: 'Mat',
        width: 1700,
        depth: 1900,
        colour: '#d5bfa3',
        status: 'considering',
        note: 'From the dining boundary east, and held 100 mm clear of the corridor’s landing so its edge is not underfoot on the way to bed. It costs no floor the checks count and it is the only boundary in this design.',
      }),
    ],
    openQuestions: [
      'A mat is a boundary a two-year-old reads and an adult walks over. It works as a zone only for as long as the children are the ones deciding where they play.',
      'Two seats for a household of four. This design assumes the floor is where people are, which is true now and stops being true.',
    ],
  },
  {
    id: 'play-corner',
    name: '7 · Corner sofa, and a low shelf on the boundary',
    theme: 'Let the storage mark where one room stops',
    style: 'muji',
    floor: ASSUMED_BOARDS,
    summary:
      'The corner sofa, and a 930 by 440 low cabinet standing on the boundary with the dining room in line with the one doing the same job on the other side of it. The two make a soft gate across the opening: nothing blocks the way through, but there is a place where one room stops and the other starts, at a height an adult sees over and a child does not. With the sofa held in the east corner the cabinet has the whole west side to itself, which is why this pairing works better here than it did in the 2500 room, where the same two objects were 70 mm apart. Furniture covers 41%.',
    furniture: [
      ...BUILT_IN,
      CORNER_SOFA,
      fromCatalogue('cabinet-930-low', 0, 1000, {
        id: 'divider',
        name: 'Low cabinet, standing out from the wall',
        short: 'Cabinet',
        rotation: 90,
        /** Standing room on its east face, inside this room; its west face is used from the dining room. */
        clearance: { north: 400 },
        status: 'considering',
        note: 'On the boundary rather than against a wall, open on both faces, and held 1 m south of the corridor’s landing so it is clear of the route to bed. 160 mm of floor between its standing room and the sofa’s run.',
      }),
    ],
    openQuestions: [
      'Two low cabinets facing each other across the boundary narrow the way through to 2.0 m, where it used to be 1.6 m. The wider room is what makes this comfortable rather than tight.',
      'A 530 high unit standing free is climbable and has to be weighted or fixed down.',
    ],
  },
  {
    id: 'rug-zones',
    name: '8 · Corner sofa, and a rug in the crook of it',
    theme: 'Mark the floor and buy nothing else',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The corner sofa and a 1.4 by 1.15 m rug in the crook of the L, and that is the whole room. The rug sits where a coffee table would and does the job a table cannot: it says where the floor is for sitting on. An L-shaped sofa is already a room within a room — three sides of an enclosure with the fourth open to the rest of the flat — and a rug closes it without standing in it. It costs no floor the checks count, nothing has to be fixed down, nothing is climbable, and the room can be swept clear in one movement.',
    furniture: [
      ...BUILT_IN,
      CORNER_SOFA,
      fromCatalogue('rug-flatweave', 1000, 500, {
        id: 'play-rug',
        name: 'Rug',
        short: 'Rug',
        width: 1400,
        depth: 1150,
        colour: '#d5bfa3',
        status: 'considering',
        note: 'In the crook of the L, 100 mm off the television cabinet and 450 off the sofa’s run, so no edge of it is under a foot leaving the sofa.',
      }),
    ],
    openQuestions: [
      'This is the design that admits the room has one job at a time. It works because the storage is elsewhere, which is a decision made in the other rooms and not in this one.',
      'A washable rug that also looks like a living room rug is the hard part, and it is a shopping problem rather than a plan problem.',
    ],
  },
  {
    id: 'benches-both',
    name: '9 · Corner sofa and wall shelves',
    theme: 'Put the storage in the air and keep the floor',
    style: 'industrial',
    floor: ASSUMED_BOARDS,
    summary:
      'The corner sofa and 1.2 m of shelving hung at 1200 above the television cabinet, clear of it and of everything standing on it. It takes no floor at all — the drawing shows it dashed for that reason — which was the whole argument when this room was at 40% covered and the floor was the thing being protected. At 37% the argument is weaker, and the design is now worth drawing for the opposite reason: this is the room where storage could go on the ground and does not have to. Industrial, which is the only palette here that puts the furniture darker than the floor.',
    furniture: [
      ...BUILT_IN,
      CORNER_SOFA,
      fromCatalogue('shelves-wall-1200', 1550, 0, {
        status: 'considering',
        note: 'Above the television cabinet, underside at 1200, centred on the cabinet rather than on the room so it reads as part of it.',
      }),
    ],
    openQuestions: [
      'Shelves at 1200 over a 600 cabinet are reachable by a child who climbs on the cabinet. Whether that is a problem depends on whether the cabinet is climbable, which depends on what is in front of it.',
      'Open shelves are a display, not storage. Anything that needs a door has to go elsewhere.',
    ],
  },
  {
    id: 'sideboard',
    name: '10 · Two-seat, table and chair',
    theme: 'Three pieces, which the room can now take',
    style: 'classic',
    floor: ASSUMED_BOARDS,
    summary:
      'Two-seat sofa, coffee table and armchair — the arrangement anybody would sketch for a living room, and in the 2500 room the control that proved this room could not hold three things: 55% covered with the armchair’s standing room in, no continuous floor left, and the table 850 mm from the sofa, too far to reach from a seat. Here it covers 36%, the table is 400 off the sofa where a hand reaches it, and the armchair sits in the west of the room facing east instead of standing in the route. It is the clearest single statement of what the extra 900 bought, and it is drawn in the classic palette because this is the arrangement that comes from wanting a living room to look like one.',
    furniture: [
      ...BUILT_IN,
      SOFA_SMALL,
      fromCatalogue('table-coffee', 2035, 1150, {
        status: 'considering',
        note: '400 mm off the two-seat sofa, which is as close as its legroom allows, and centred on it.',
      }),
      fromCatalogue('armchair-750', 250, 1200, {
        rotation: 270,
        status: 'considering',
        note: 'In the west of the room facing east, 300 mm of standing room in front of it and 685 mm clear of the coffee table.',
      }),
    ],
    openQuestions: [
      'Three pieces is where this room stops being about floor. At 36% it is inside every check, but it is the design that would notice a fourth object.',
      'The coffee table serves the sofa and not the armchair, which is 685 mm from it across the room. A second small surface by the chair would make four objects.',
    ],
  },
];

export const LIVING: Room = {
  id: 'living',
  name: { en: 'Living', zh: '客廳' },
  kind: 'living',
  /** Flush with the dining room's east edge at 5600, with no partition between them. */
  origin: { x: 5600, y: 200 },
  shape: { kind: 'rect', width: 3400, depth: 3050 },
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
      /** Not 'outside': what is on the other side is the rain shelter, and it is drawn. */
      to: 'rain-shelter-living',
    },
    {
      /**
       * The way into the private half, which used to be in the dining room's north wall.
       * Widening this room west took the corridor's south end with it, so the corridor now
       * discharges here — into the first 900 of this room's north wall — and the dining
       * room no longer touches it at all.
       */
      id: 'hall-opening',
      kind: 'opening',
      side: 'north',
      offset: 0,
      width: 900,
      height: 2100,
      sill: 0,
      to: 'corridor',
      note: 'Everyone going to bed now crosses this room. That is the price of the 900 it gained, and it is a real one: the corridor used to open off the dining room, where nobody was sitting still.',
    },
  ],
  designs: LIVING_DESIGNS,
};
