import { fromCatalogue } from '~/data/catalogue';
import type { Design, Furniture, Room } from '~/data/types';
import { ASSUMED_BOARDS } from '../floors';

/**
 * 2500 east–west by 3050 north–south, at the east end, open to the dining room along
 * its whole west side. The north wall carries a 380 mm television cabinet in the
 * recess the room's extra depth makes, which leaves 2670 clear. The east wall carries
 * the only window on this side of the flat, sill assumed at 900.
 *
 * At 2.5 m across there is exactly one wall a sofa can go against — the south — and
 * every design below agrees about that. What they disagree about is what else is
 * allowed in, and the answer runs from nothing to a chair, a table and a rug.
 *
 * The ten here are numbered to pair with the ten dining designs: read them together,
 * because there is no wall between the two rooms and the floor is continuous.
 *
 * Every design holds the project's style, and that is the point rather than an
 * oversight. Each of these used to carry a style of its own and the ten cycled through
 * seven of them, so the loudest difference between any two designs was the colour of
 * the floor and the sofa. That is the one variable here that costs nothing and can be
 * changed after everything is built, and putting it on the same axis as the
 * arrangement made a set of similar layouts look like a set of different ones. With the
 * palette held still, what is left to see between two designs is where the furniture
 * is — which is the only thing a plan can settle.
 */
const BUILT_IN: Furniture[] = [
  fromCatalogue('fitted-run-380', 0, 0, {
    id: 'tv-run',
    name: 'Television cabinet',
    short: 'TV',
    width: 2500,
    depth: 380,
    status: 'owned',
    note: 'Full width of the north wall, in the recess the room’s extra depth makes. Its 380 takes up all but 70 mm of that step.',
  }),
];

/** The three-seat sofa in the only place it goes: against the south wall, facing the television. */
const SOFA_BIG = fromCatalogue('sofa-three-seat', 160, 2100, {
  rotation: 180,
  clearance: { south: 400 },
  status: 'planned',
  note: 'Centred on the south wall with 160 either side. Its east end reaches into the window’s reveal, but at 830 it sits below the 900 sill and takes no light.',
});

/** The narrower sofa, pushed west, which is what makes room for anything beside it. */
const SOFA_SMALL = fromCatalogue('sofa-two-seat', 200, 2150, {
  rotation: 180,
  clearance: { south: 400 },
  status: 'considering',
  note: 'Half a metre narrower than the three-seat and pushed west, which leaves 470 mm of the south wall free at the east end.',
});

export const LIVING_DESIGNS: Design[] = [
  {
    id: 'table-west',
    name: '1 · Sofa only',
    preferred: true,
    theme: 'One long seat facing the television and 1.3 m of floor in front of it',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The sofa against the south wall facing north, and nothing else. That leaves 1.72 m between the seat and the cabinet, and 1.32 m of it is clear floor — which running west into the dining room without a threshold is the same floor the children use. Furniture covers 40% of the room, which for a room this size with a sofa in it is as low as it goes. The absence is the design: everything this room could hold, it holds better on a wall or in the next room.',
    furniture: [...BUILT_IN, SOFA_BIG],
    openQuestions: [
      'The window’s figures are assumed. The sofa passing under that sill by 70 mm is why it can go where it goes, so this is the assumption most worth checking.',
      'Nowhere to put a cup down. The nearest surface is the television cabinet, 1.7 m away.',
    ],
  },
  {
    id: 'table-six',
    name: '2 · Sofa and a low table',
    theme: 'A normal living room, at the price of the floor',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The same sofa with a coffee table 450 mm in front of it — the right distance, and most of what the room had left. Furniture goes from 40% of the floor to 48%, which the checks call crowded: past about 45% a room reads as the gaps between things. The gap here is 670 mm between the table and the cabinet, which is a passage rather than a place. Worth drawing because a room with nowhere to put a cup down is a room people stop sitting in, and that cost is real too — it is just not one a plan can measure.',
    furniture: [
      ...BUILT_IN,
      SOFA_BIG,
      fromCatalogue('table-coffee', 700, 1050, {
        status: 'considering',
        note: '450 off the front of the sofa, which is the reach of somebody sitting down, and 670 off the cabinet, which is what is left to walk in.',
      }),
    ],
    openQuestions: [
      'A 1100 by 600 table is the largest that leaves a walkway. A 900 by 500 would give back 200 mm and still hold what a coffee table holds.',
      'A 400 high table in the middle of the floor is both a hazard and the first thing to be climbed on. This is the design to come back to, not the one to start with.',
    ],
  },
  {
    id: 'extendable',
    name: '3 · Sofa and an ottoman',
    theme: 'A surface that is also a seat and also a toy box',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'Instead of a coffee table, a 600 square storage ottoman. It is a surface with a tray on it, a second seat when six people have eaten at the extendable table next door, and the place the toys go at eight o’clock — three jobs from a footprint 40% the size of the coffee table’s. Soft on all four sides, which matters at the height a toddler’s head is, and light enough that a child is allowed to move it, which turns the one object in the middle of the floor from an obstacle into part of the game. Furniture covers 44% of the floor: under the line, where the coffee table was over it.',
    furniture: [
      ...BUILT_IN,
      SOFA_BIG,
      fromCatalogue('ottoman-600', 950, 1050, {
        status: 'considering',
        note: '450 off the sofa like a coffee table, and 670 off the cabinet, but 500 mm narrower, so the floor either side of it stays walkable.',
      }),
    ],
    openQuestions: [
      'An ottoman is a worse table. Nothing with a stem stands up on one, which is most of what gets put on a coffee table.',
      'It only holds what fits in 600 by 600 by 400, which is one evening’s toys and not a day’s.',
    ],
  },
  {
    id: 'bench-south',
    name: '4 · Sofa and an armchair',
    theme: 'Two places to sit facing each other, not two facing a screen',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The narrower two-seat sofa on the south wall and an armchair in the north-west corner turned to face east, which puts two seats at right angles rather than in a row. It is a room for talking rather than for watching, and the only design here where somebody sitting down faces the dining room and the children in it rather than the television. The armchair costs 0.6 m² and the sofa gives 0.53 m² back by being 1.63 m instead of 2.18 m, so the two nearly cancel: 40% covered, the same as the room with nothing in it but the big sofa. Two seats for the price of one.',
    furniture: [
      ...BUILT_IN,
      SOFA_SMALL,
      fromCatalogue('armchair-750', 150, 900, {
        rotation: 270,
        status: 'considering',
        note: 'Facing east across the room, 50 mm clear of the sofa’s legroom. Its back is to the dining room, which is the price of facing the seat rather than the screen.',
      }),
    ],
    openQuestions: [
      'An armchair here has its back to the way in. Anybody arriving from the dining room arrives behind whoever is sitting in it.',
      'Two seats at right angles means neither of them is square to the television. This design gives the screen up rather than arranging round it.',
    ],
  },
  {
    id: 'round',
    name: '5 · Sofa, side table, and the corner left alone',
    theme: 'Solve the cup problem with 0.2 m² and stop there',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The narrower sofa pushed west, and a 450 square side table in the gap that leaves at the east end of the south wall. It answers the one complaint the empty room has — nowhere to put a cup down — for a third of the floor a coffee table costs, and it does it at the arm of the sofa where somebody sitting can reach it without leaning. Nothing stands in the middle of the room at all. Furniture covers 34%, the lowest of any design here that has somewhere to sit and somewhere to put something down, and the clear floor is a single piece 1.37 m deep running the width of the room and on into the dining room.',
    furniture: [
      ...BUILT_IN,
      SOFA_SMALL,
      fromCatalogue('side-table-450', 1900, 2400, {
        status: 'considering',
        note: 'In the 470 mm of south wall the narrower sofa leaves, at the arm of it. 550 high, which is the height of a sofa arm.',
      }),
    ],
    openQuestions: [
      'A side table serves one end of the sofa. Whoever sits at the west end still has nowhere.',
      'It sits in the window’s reveal at 550 high against a 900 sill, so it takes no light — but it does mean the window cannot have a floor-length curtain at that end.',
    ],
  },
  {
    id: 'one-side',
    name: '6 · Sofa west, facing the window',
    theme: 'Turn the room a quarter, and look out instead of in',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The one arrangement that does not face the television. The two-seat sofa stands against the south wall’s west end, turned to face east at the window, so what somebody sitting down looks at is daylight rather than a screen. It suits the design next door that keeps the whole north half of the dining room as a route, because a sofa turned this way stops being something you walk behind. The television becomes what it is in most rooms with small children in them — something switched on for an hour, watched at an angle, and otherwise a dark rectangle on a wall.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('sofa-two-seat', 200, 1400, {
        rotation: 270,
        clearance: { south: 400 },
        status: 'considering',
        note: 'Turned to face east at the window. 900 deep against a 2500 room, so it leaves 1.2 m of floor between it and the glass.',
      }),
    ],
    openQuestions: [
      'Facing east means the television is 90° off. It is a real compromise and not a clever one — worth drawing to see whether the view is worth it.',
      'The window figures are assumed, so what this sofa is looking at is assumed too.',
    ],
  },
  {
    id: 'play-corner',
    name: '7 · Sofa, and a low shelf as the boundary',
    theme: 'Let the storage do the dividing, on this side of the opening too',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The three-seat sofa where it belongs, and a low cabinet standing out from the south wall at the west end, in line with the one doing the same job in the dining room. The two of them make a soft gate across the opening between the rooms: nothing blocks the way through, but there is a place where one room stops and the other starts, at a height an adult sees over and a child does not. Between them the children’s corner is a defined 1.6 m square rather than the middle of a corridor. Furniture covers 45%, exactly on the line.',
    furniture: [
      ...BUILT_IN,
      SOFA_BIG,
      fromCatalogue('cabinet-930-low', 0, 700, {
        id: 'divider',
        name: 'Low cabinet, standing out from the wall',
        short: 'Cabinet',
        rotation: 90,
        /** Standing room on its east face, inside this room; its west face is used from the dining room. */
        clearance: { north: 400 },
        status: 'considering',
        note: 'Out from the west edge rather than along a wall, in line with its twin in the dining room. Open on both faces, and held 70 mm clear of the sofa’s legroom.',
      }),
    ],
    openQuestions: [
      'Two low cabinets facing each other across the opening narrow the way through to 1.6 m. That is generous now and will not feel it with a pushchair.',
      'A 530 high unit standing free is climbable and has to be weighted or fixed down.',
    ],
  },
  {
    id: 'rug-zones',
    name: '8 · Sofa, and a rug where the toys are allowed',
    theme: 'Mark the floor and buy nothing else',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The three-seat sofa and a rug, and that is the whole room. The rug fills the floor between the sofa’s legroom and the television cabinet, and it says what a low shelf would have said without standing in the way of anything: on the rug is where toys are allowed. It costs no floor, nothing has to be fixed down, nothing is climbable, and the room can be swept clear in one movement. It is also the only design here that a two-year-old can be taught in a sentence.',
    furniture: [
      ...BUILT_IN,
      SOFA_BIG,
      fromCatalogue('rug-flatweave', 300, 500, {
        id: 'play-rug',
        name: 'Play rug',
        short: 'Rug',
        width: 1900,
        depth: 1150,
        colour: '#d5bfa3',
        status: 'considering',
        note: 'Between the sofa’s legroom and the cabinet, held 100 mm off both so its edges are not underfoot at either end.',
      }),
    ],
    openQuestions: [
      'This is the design that admits the room has one job at a time. It works because the storage is elsewhere, which is a decision made in the other rooms and not in this one.',
      'A washable rug that also looks like a living room rug is the hard part of this design, and it is a shopping problem rather than a plan problem.',
    ],
  },
  {
    id: 'benches-both',
    name: '9 · Sofa and wall shelves',
    theme: 'Put the storage in the air and keep every millimetre of floor',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The three-seat sofa and 1.2 m of shelving on the wall above the television cabinet, hung at 1200 so it clears the cabinet and everything on it. It takes no floor at all — the drawing shows it dashed for that reason — which is the whole argument: in a room where furniture is already at 40% and the floor is the thing being protected, the only storage worth adding is storage that is not on the ground. Pairs with the benches next door, which is the other design that treats floor as the scarce material and everything else as negotiable.',
    furniture: [
      ...BUILT_IN,
      SOFA_BIG,
      fromCatalogue('shelves-wall-1200', 650, 0, {
        status: 'considering',
        note: 'Above the television cabinet, underside at 1200. Out of reach of a child standing on the cabinet, which is the height that matters rather than the height off the floor.',
      }),
    ],
    openQuestions: [
      'Shelves at 1200 over a 600 cabinet are reachable by a child who climbs on the cabinet. Whether that is a problem depends on whether the cabinet is climbable, which depends on what is in front of it.',
      'Open shelves in a room this small are a display, not storage. Anything that needs a door has to go elsewhere.',
    ],
  },
  {
    id: 'sideboard',
    name: '10 · Sofa, table and chair — the room as it would be without children',
    theme: 'The version everybody draws first, priced honestly',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'Sofa, coffee table, armchair: the arrangement anybody would sketch for a living room, drawn here so its cost is a number rather than a feeling. It comes to 48% of the floor covered, over the line at which a room reads as the gaps between things, and there is no continuous floor left at all — the table is hard against the armchair’s standing room on one side and its own 400 mm of legroom on the other. For two adults it would be a good room. For two adults and two children under three it is a room with nowhere to put the children, which is why every other design on this list gives something up.',
    furniture: [
      ...BUILT_IN,
      SOFA_SMALL,
      fromCatalogue('table-coffee', 700, 1150, {
        status: 'considering',
        note: '400 mm off the narrower sofa, which is as close as its legroom allows, and hard up against the armchair’s standing room on the other side.',
      }),
      fromCatalogue('armchair-750', 150, 400, {
        rotation: 270,
        status: 'considering',
      }),
    ],
    openQuestions: [
      'At 55% covered this is the design the checks like least, and it is drawn for that reason. It is the control the other nine are measured against.',
      'The coffee table ends up 850 from the sofa, which is too far to reach from a seat. Adding the third piece made the second one worse, which is the usual way small rooms fail.',
    ],
  },
];

export const LIVING: Room = {
  id: 'living',
  name: 'Living',
  kind: 'living',
  /** Flush with the dining room's east edge at 6500, with no partition between them. */
  origin: { x: 6500, y: 200 },
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
      /** Not 'outside': what is on the other side is the rain shelter, and it is drawn. */
      to: 'rain-shelter-living',
    },
  ],
  designs: LIVING_DESIGNS,
};
