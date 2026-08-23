import { fromCatalogue } from '~/data/catalogue';
import type { Design, Furniture, Room } from '~/data/types';
import { ASSUMED_BOARDS } from '../floors';

/**
 * 3400 east–west by 3050 north–south, at the east end, open to the dining room along its
 * west side. It was 2500 across until it took 900 from the dining room's east end and
 * from the corridor's south end, and that 900 changed what the room is rather than just
 * how much of it there is.
 *
 * Three things follow from it. At 2500 there was exactly one wall a sofa could go
 * against and all ten designs agreed about that; at 3400 by 3050 the room is nearly
 * square and the east wall is a second one, so the designs below put the sofa in four
 * different places rather than one. No arrangement here now passes 36% of the floor,
 * where the same furniture in the old room reached 55% — the room has stopped being a
 * set of things with gaps between them. And the way into the private half moved with the
 * corridor: it is now the first 900 of this room's north wall, so everybody going to bed
 * crosses this room, and the 900 square inside that opening has to stay clear.
 *
 * The north wall carries the 380 mm television cabinet east of that opening. The east
 * wall carries the window, sill assumed at 900, with the rain shelter beyond it.
 *
 * The ten are numbered to pair with the ten dining designs: read them together, because
 * there is no wall between the two rooms and the floor is continuous.
 *
 * Every design holds the project's style, and that is the point rather than an oversight.
 * Each of these used to carry a style of its own and the ten cycled through seven of them,
 * so the loudest difference between any two designs was the colour of the floor and the
 * sofa — the one variable here that costs nothing and can be changed after everything is
 * built. With the palette held still, what is left to see between two designs is where the
 * furniture is, which is the only thing a plan can settle.
 */
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

/** The three-seat sofa centred on the south wall, facing the television. */
const SOFA_BIG = fromCatalogue('sofa-three-seat', 610, 2100, {
  rotation: 180,
  clearance: { south: 400 },
  status: 'planned',
  note: 'Centred on the 3400 south wall with 610 either side, where it had 160 either side of the old one. It is the same sofa in a room that now has room for it.',
});

/** The narrower sofa, pushed west, which is what makes room for anything beside it. */
const SOFA_SMALL = fromCatalogue('sofa-two-seat', 300, 2150, {
  rotation: 180,
  clearance: { south: 400 },
  status: 'considering',
  note: 'Half a metre narrower than the three-seat and set at the west end of the south wall, which leaves 1.47 m of that wall free at the east end — enough for a chair rather than the 470 mm it used to leave.',
});

export const LIVING_DESIGNS: Design[] = [
  {
    id: 'table-west',
    name: '1 · Sofa only',
    preferred: true,
    theme: 'One long seat facing the television, and the rest left as floor',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The sofa centred on the south wall facing north, and nothing else. That leaves 1.32 m of clear floor the full 3.4 m width of the room, running west into the dining room without a threshold — the same floor the children use. Furniture covers 29% of the room. In the 2500 room the identical pair of objects covered 40%, and that difference is the whole argument for the 900: not that anything new fits, but that what was already here stopped filling the place.',
    furniture: [...BUILT_IN, SOFA_BIG],
    openQuestions: [
      'The window’s figures are assumed. The sofa is on the south wall now rather than reaching into the reveal, so nothing depends on the sill any more — which makes this the design least exposed to that assumption.',
      'Nowhere to put a cup down. The nearest surface is the television cabinet, 1.7 m away, and at 3.4 m wide the room can now afford a side table without noticing — which is design 5’s argument.',
    ],
  },
  {
    id: 'table-six',
    name: '2 · Sofa and a low table',
    theme: 'The ordinary living room, which now fits',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The same sofa with an 1100 by 600 coffee table 450 mm in front of it, which is the reach of somebody sitting down. In the old room this was the design the checks called crowded at 48%: the table left 670 mm between itself and the cabinet, a passage rather than a place. Here it covers 36% and leaves 1.15 m to walk round the north side of it and 1.15 m either end. It is the same three objects, and the only thing that changed is that the room is now big enough for the arrangement everybody draws first.',
    furniture: [
      ...BUILT_IN,
      SOFA_BIG,
      fromCatalogue('table-coffee', 1150, 1050, {
        status: 'considering',
        note: '450 off the front of the sofa and centred on the room, with 1.15 m of clear floor between it and the cabinet.',
      }),
    ],
    openQuestions: [
      'A 400 high table in the middle of the floor is both a hazard and the first thing to be climbed on. That is not solved by the room being bigger; it is only made easier to walk round.',
      'With this much floor a 1300 by 700 table would also fit and hold more. The 1100 is drawn because it is the common size, not because it is the largest that works.',
    ],
  },
  {
    id: 'extendable',
    name: '3 · Sofa and an ottoman',
    theme: 'A surface that is also a seat and also a toy box',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'Instead of a coffee table, a 600 square storage ottoman. It is a surface with a tray on it, a second seat when five people have eaten at the table next door, and the place the toys go at eight o’clock — three jobs from a footprint 55% the size of the coffee table’s. Soft on all four sides, which matters at the height a toddler’s head is, and light enough that a child is allowed to move it, which turns the one object in the middle of the floor from an obstacle into part of the game. Furniture covers 33%.',
    furniture: [
      ...BUILT_IN,
      SOFA_BIG,
      fromCatalogue('ottoman-600', 1400, 1050, {
        status: 'considering',
        note: '450 off the sofa like a coffee table and centred, but 500 mm narrower, so the floor either side of it is a route rather than a gap.',
      }),
    ],
    openQuestions: [
      'An ottoman is a worse table. Nothing with a stem stands up on one, which is most of what gets put on a coffee table.',
      'It only holds what fits in 600 by 600 by 420, which is one evening’s toys and not a day’s.',
    ],
  },
  {
    id: 'bench-south',
    name: '4 · Two seats at right angles',
    theme: 'Somewhere to talk rather than somewhere to watch',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The two-seat sofa at the west end of the south wall and an armchair in the south-east corner turned to face west, so the two seats meet at a corner rather than sitting in a row. It is a room for talking, and the only design here where somebody sitting down faces the dining room and the children in it rather than the television. In the 2500 room this had to put the armchair in the north-west corner, which is now the corridor’s landing and no longer available; the wider south wall is what lets both seats sit on it. Furniture covers 29% — the same as the room with nothing in it but the big sofa, because the narrower sofa gives back almost exactly what the armchair takes.',
    furniture: [
      ...BUILT_IN,
      SOFA_SMALL,
      fromCatalogue('armchair-750', 2500, 2250, {
        rotation: 90,
        status: 'considering',
        note: 'In the south-east corner facing west across the room, 570 mm clear of the sofa’s east arm. Its back is to the window rather than to the way in, which is the arrangement the old room could not offer.',
      }),
    ],
    openQuestions: [
      'Two seats at right angles means neither is square to the television. This design gives the screen up rather than arranging round it.',
      'The armchair sits in front of the window’s south end. At 800 high against a 900 sill it takes no light, but it does mean a floor-length curtain cannot close at that end.',
    ],
  },
  {
    id: 'round',
    name: '5 · Sofa on the east wall, under the window',
    theme: 'Use the second wall the room just gained',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The arrangement the 2500 room could not hold at all: the three-seat sofa against the east wall, facing west across the room. At 2180 long it needs 2.18 m of wall and the east wall is 3.05 m, so it fits with 435 either end — where the old room’s east wall was the same length but had no width in front of it to sit facing. At 830 high the sofa passes under the 900 sill and takes no light. What it buys is the shape of the clear floor: one piece 1.65 m wide running the full 3.05 m depth along the west side, continuous with the dining room, instead of a 1.3 m strip across the middle. What it costs is the television, which is now 90° off to the right of anybody sitting down. Furniture covers 29%.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('sofa-three-seat', 2450, 435, {
        rotation: 90,
        clearance: { south: 800 },
        status: 'considering',
        note: 'Against the east wall facing west, centred on it. Its 800 of legroom runs west to 1650, which is where the clear floor begins.',
      }),
    ],
    openQuestions: [
      'The television ends up beside the sofa rather than in front of it. Either it moves to the west end of the north cabinet, where it is square to nothing, or this design accepts that the room is not arranged round a screen.',
      'This is the design most exposed to the window’s assumed sill. If the sill is lower than 900 the sofa back is in the glass.',
    ],
  },
  {
    id: 'one-side',
    name: '6 · Sofa in the south-west corner, facing east',
    theme: 'Turn a quarter, look out, and keep the north half as a route',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The two-seat sofa in the south-west corner, turned to face east at the window, so what somebody sitting down looks at is daylight rather than a screen. It suits the dining design next door that keeps a clear strip along the north wall, because a sofa turned this way is not something you walk behind: the whole north half of this room stays a route, from the corridor opening straight through to the dining room. Furniture covers 23%, the lowest of any design here that has somewhere to sit. What it costs is the same as design 5 and worse — the television is behind the sofa’s left shoulder.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('sofa-two-seat', 0, 1420, {
        rotation: 270,
        clearance: { south: 400 },
        status: 'considering',
        note: 'Hard into the south-west corner facing east. It sits on the boundary with the dining room, and stops 970 mm short of the corridor’s landing, which is what keeps the way through open.',
      }),
    ],
    openQuestions: [
      'A sofa on the boundary with the dining room narrows the opening between the two rooms to 970 mm for the length of it. That is a doorway’s width where the rest of the boundary is 2.6 m of nothing.',
      'Facing east means the television is 90° off, and the window figures the view depends on are assumed.',
    ],
  },
  {
    id: 'play-corner',
    name: '7 · Sofa, and a low shelf on the boundary',
    theme: 'Let the storage mark where one room stops',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The three-seat sofa where it belongs, and a 930 by 440 low cabinet standing on the boundary with the dining room, in line with the one doing the same job on the other side of it. The two make a soft gate across the opening: nothing blocks the way through, but there is a place where one room stops and the other starts, at a height an adult sees over and a child does not. It stood in the north-west corner before, which is the corridor’s landing now, so it has moved 1 m south — where it works better anyway, because it is no longer in the way of anybody going to bed. Furniture covers 33%.',
    furniture: [
      ...BUILT_IN,
      SOFA_BIG,
      fromCatalogue('cabinet-930-low', 0, 1000, {
        id: 'divider',
        name: 'Low cabinet, standing out from the wall',
        short: 'Cabinet',
        rotation: 90,
        /** Standing room on its east face, inside this room; its west face is used from the dining room. */
        clearance: { north: 400 },
        status: 'considering',
        note: 'On the boundary rather than against a wall, open on both faces, and held 1 m south of the corridor’s landing so it is clear of the route to bed. Its north end stops 550 mm short of the sofa’s legroom.',
      }),
    ],
    openQuestions: [
      'Two low cabinets facing each other across the boundary narrow the way through to 2.0 m, where it used to be 1.6 m. The wider room is what makes this design comfortable rather than tight.',
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
      'The three-seat sofa and a rug, and that is the whole room. This is the design the 900 helped most: the play rug used to be next door at the dining room’s east end, on the floor this room now owns, and it was 1.7 by 1.8 m. Here it is 2.4 by 1.15 m and it sits in the middle of the room between the cabinet and the sofa’s legroom, which is where the children already are. It costs no floor the checks count, nothing has to be fixed down, nothing is climbable, and the room can be swept clear in one movement. It is also the only design here that a two-year-old can be taught in a sentence.',
    furniture: [
      ...BUILT_IN,
      SOFA_BIG,
      fromCatalogue('rug-flatweave', 900, 480, {
        id: 'play-rug',
        name: 'Play rug',
        short: 'Rug',
        width: 2400,
        depth: 1150,
        colour: '#d5bfa3',
        status: 'considering',
        note: 'Between the cabinet and the sofa’s legroom, 100 mm off both, and lined up with the cabinet’s west end so its edge is not across the corridor’s landing.',
      }),
    ],
    openQuestions: [
      'This is the design that admits the room has one job at a time. It works because the storage is elsewhere, which is a decision made in the other rooms and not in this one.',
      'A washable rug that also looks like a living room rug is the hard part, and it is a shopping problem rather than a plan problem.',
    ],
  },
  {
    id: 'benches-both',
    name: '9 · Sofa and wall shelves',
    theme: 'Put the storage in the air and keep every millimetre of floor',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The three-seat sofa and 1.2 m of shelving on the wall above the television cabinet, hung at 1200 so it clears the cabinet and everything on it. It takes no floor at all — the drawing shows it dashed for that reason — which was the whole argument when the room was at 40% covered and the floor was the thing being protected. At 29% that argument is weaker, and the design is now worth drawing for the opposite reason: this is the room where storage could go on the ground and does not have to.',
    furniture: [
      ...BUILT_IN,
      SOFA_BIG,
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
    name: '10 · Sofa, table and chair',
    theme: 'Everything at once, which the room can now take',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'Sofa, coffee table and armchair: the arrangement anybody would sketch for a living room. In the 2500 room this was the control the other nine were measured against — 48% covered on the checks’ count and 55% by the time the armchair’s standing room was included, with no continuous floor left at all and the table 850 mm from the sofa, too far to reach from a seat. Here it covers 36%, the table is 400 off the sofa where a hand can reach it, and the armchair is in the south-east corner instead of standing in the route. The design that was the argument against putting three things in this room is now just a room with three things in it, which is the clearest single statement of what the 900 bought.',
    furniture: [
      ...BUILT_IN,
      SOFA_SMALL,
      fromCatalogue('table-coffee', 500, 1150, {
        status: 'considering',
        note: '400 mm off the two-seat sofa, which is as close as its legroom allows, and clear of the armchair’s standing room by 600.',
      }),
      fromCatalogue('armchair-750', 2500, 2250, {
        rotation: 90,
        status: 'considering',
        note: 'In the south-east corner facing west, as in design 4. With the table in as well it is the third seat rather than the second.',
      }),
    ],
    openQuestions: [
      'Three pieces is where this room stops being about floor. At 36% it is inside every check, but it is also the design that would notice a fourth object.',
      'The coffee table serves the sofa and not the armchair, which is 900 mm from it across the corner. A second small surface by the chair would make four objects.',
    ],
  },
];

export const LIVING: Room = {
  id: 'living',
  name: 'Living',
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
