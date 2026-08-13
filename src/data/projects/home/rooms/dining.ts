import { fromCatalogue } from '~/data/catalogue';
import { circlePoints } from '~/lib/geometry';
import type { Design, Furniture, Room } from '~/data/types';

/** The west wall's fitted run, in the piece's own terms before it is turned. */
const RUN = 1630;
const DEPTH = 600;
/** How far the far end is cut back on the door side: the entry run's own depth. */
const CHAMFER = 330;
/** Three equal cupboards fill the run up to where the cut begins. */
const CARCASS = (RUN - CHAMFER) / 3;

/**
 * 4650 east–west by 2600 north–south, wall to wall, and open on three sides: the entry
 * runs into its west end, the living room into its east, and the last 900 mm of its
 * north wall is the corridor into the private half of the flat.
 *
 * Four figures decide everything that follows. The fitted run takes 600 of the width
 * and its doors ask for 750 more, so 1350 of the 4650 is gone before a chair is
 * placed. The corridor's landing space takes a 900 square out of the north-east
 * corner. The way in from the entry is the 970 strip north of the run. What is left to
 * arrange is about 3300 by 2600, and every design below is a different answer to the
 * same question: how much of that goes to seating and how much stays as floor, with
 * two children under three who use the floor rather than the furniture.
 */
const BUILT_IN: Furniture[] = [
  fromCatalogue('fitted-run-600', 0, 970, {
    id: 'dining-run',
    name: 'Fitted storage run',
    width: RUN,
    depth: DEPTH,
    rotation: 270,
    clearance: { south: 750 },
    outline: [
      { x: 0, y: 0 },
      { x: RUN, y: 0 },
      { x: RUN - CHAMFER, y: DEPTH },
      { x: 0, y: DEPTH },
    ],
    divisions: [CARCASS, CARCASS * 2, CARCASS * 3],
    status: 'owned',
    note: 'Three cupboards of 433 mm with their doors facing east, and beyond them the cut corner, which is a filler panel rather than a fourth door.',
  }),
];

const chairs = (positions: [number, number][], status: Furniture['status'] = 'planned') =>
  positions.map(([x, y], i) =>
    fromCatalogue('chair-dining', x, y, { id: `chair-${i + 1}`, status }),
  );

export const DINING_DESIGNS: Design[] = [
  {
    id: 'table-west',
    name: '1 · Table west, floor east',
    preferred: true,
    theme: 'Push the table as far west as its own chairs allow and keep the rest as one floor',
    style: 'japandi',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'A four-seat table with its length running east–west, held 50 mm clear of where the storage run’s standing room ends. Turned this way the chairs take their 750 out of the depth — 2.25 m of the 2.6 — and only 1.2 m of the width. Turned the other way they would take 2.25 m of the width instead, and the room would be a table with a corridor round it. What this buys is 2.05 m of clear width east of the table, running into the living room without a threshold. Two children under three use the floor of a flat rather than its furniture, and 2 m of it in one piece is the most this plan can give them.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1200', 1400, 925, { status: 'planned' }),
      ...chairs([
        [1550, 475],
        [2050, 475],
        [1550, 1675],
        [2050, 1675],
      ]),
    ],
    openQuestions: [
      'Four seats. A fifth and sixth could sit at the ends, where there is room for a chair but not the 750 to pull it back into.',
      'The chairs’ clearance runs to within 175 mm of both the north and south walls, so there is no sideboard on either of them, now or later.',
    ],
  },
  {
    id: 'table-six',
    name: '2 · A table for six',
    theme: 'Seat six properly and pay for it in floor',
    style: 'warm-minimal',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'A 1.6 m table, three chairs down each long side, six people and nobody at a corner. The table has to sit 400 mm further east than the four-seat one to keep the last chair out of the corridor’s landing space. The cost is exactly measurable: clear floor east of the table drops from 2.05 m to 1.05 m. Six seats costs a metre of the only continuous floor in the flat.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1600', 2000, 900, { status: 'considering' }),
      ...chairs(
        [
          [2100, 450],
          [2675, 450],
          [3250, 450],
          [2100, 1700],
          [2675, 1700],
          [3250, 1700],
        ],
        'considering',
      ),
    ],
    openQuestions: [
      'The third chair on each side stops 50 mm short of the corridor’s landing space: a check passed rather than a margin.',
      'Six seats in a flat with two children under three is a bet on five years from now rather than on now.',
    ],
  },
  {
    id: 'extendable',
    name: '3 · An extendable table',
    theme: 'Four every day, six when it matters, and stop choosing',
    style: 'muji',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'The first two designs are a choice between four seats and six. This one refuses it. A 1200 by 800 top that takes a leaf to 1800 sits exactly where the four-seat table sits and leaves the same 2.05 m of floor for 360 days a year; on the other five, the leaf goes in, two chairs come from the bedrooms, and the table grows east into floor nobody is using at dinner time anyway. It needs 600 mm of length at one end and nothing in depth, and the room has 2.05 m spare at that end. This is the answer small-space design keeps arriving at, and it is available here at no cost in floor at all.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-extendable', 1400, 900, {
        status: 'planned',
        note: 'Drawn closed at 1200. Extended it reaches 2600 east, which is 1.1 m short of the corridor’s landing space, so even open it blocks nothing.',
      }),
      ...chairs([
        [1550, 450],
        [2050, 450],
        [1550, 1700],
        [2050, 1700],
      ]),
    ],
    openQuestions: [
      'Extending needs the two extra chairs to come from somewhere. Two stacking or folding chairs kept in the fitted run would make this design self-contained; two chairs carried from a bedroom would not.',
      'A leaf mechanism is a moving part in a room with toddlers in it. Worth checking the leaf cannot be pulled out by a child hanging on the end of the table.',
    ],
  },
  {
    id: 'bench-south',
    name: '4 · Bench against the south wall',
    theme: 'Take the pull-back off one side and give the north wall to walking',
    style: 'japandi',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'A bench against the south wall with the table pushed onto it, and chairs on the north side only. A bench needs no room to pull back into, so this arrangement saves the 750 mm a second row of chairs would want and puts the whole saving into one place: a clear 600 mm strip along the north wall running the full width of the room, from the front door to the living room, with the table and everybody at it out of the way of it. Six can sit — three on the bench, three on chairs. What it costs is the shuffle: the person in the middle of a bench gets out last.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('bench-dining-1600', 1500, 2150, {
        status: 'considering',
        note: 'Hard against the south wall. Its 450 depth and no clearance is the whole trick.',
      }),
      fromCatalogue('table-dining-1600', 1500, 1350, {
        clearance: { north: 750 },
        status: 'considering',
        note: 'Pushed south onto the bench, so all its standing room is on one side.',
      }),
      ...chairs(
        [
          [1650, 900],
          [2225, 900],
          [2800, 900],
        ],
        'considering',
      ),
    ],
    openQuestions: [
      'A bench against a wall means the wall is the backrest. At 450 high with a 750 table this is a perch rather than a chair, and it is not where anybody wants to sit for two hours.',
      'The clear strip along the north is 600 mm. That is a passage, not a play space — this design buys circulation, not floor.',
    ],
  },
  {
    id: 'round',
    name: '5 · A round table',
    theme: 'No corners, and a table people walk past on the diagonal',
    style: 'mid-century',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'An 1100 round top seating four, with a chair at each quarter. A round table loses less to circulation than a rectangle seating the same number, because people pass a circle on the diagonal and a rectangle square-on, and it is the only table shape with nothing at a two-year-old’s eye height to run into. It also has no head of the table, which in a room this open matters more than it sounds: nobody sits with their back to the way in. What it costs is the wall: a round table cannot be pushed against anything, so it holds the middle of the room and the clear floor ends up in two pieces rather than one.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-round-1100', 1800, 750, {
        /** Round, so its footprint is a circle and not the square around it. */
        outline: circlePoints(1100),
        status: 'considering',
      }),
      ...chairs(
        [
          [2100, 300],
          [2100, 1850],
          [2900, 1075],
          [1350, 1075],
        ],
        'considering',
      ),
    ],
    openQuestions: [
      'The west chair sits exactly where the storage run’s standing room ends. Somebody in it has to move for a cupboard to open.',
      'Four is the honest capacity. A 1100 circle will take five at a squeeze and nobody will have room for their elbows.',
    ],
  },
  {
    id: 'one-side',
    name: '6 · Everything along one side',
    theme: 'Table against the south wall, chairs on one side, the north half left empty',
    style: 'warm-minimal',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'The standard answer to a narrow room, applied literally: put the furniture along one long side and leave the other as a route. The table goes hard against the south wall with chairs only on its north side, which seats four with two of them facing the room. That leaves 1.1 m of clear depth running the entire 4.65 m width — the widest single piece of floor any of these designs produces, and the only one a child can run down. What it costs is dining: two people sit facing a wall, and reaching the far side of the table means walking round the end of it.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1200', 1400, 1850, {
        clearance: { north: 750 },
        status: 'considering',
        note: 'Against the south wall, so all its standing room is on the north side.',
      }),
      ...chairs(
        [
          [1550, 1400],
          [2050, 1400],
        ],
        'considering',
      ),
    ],
    openQuestions: [
      'Two seats as drawn. Two more could sit at the ends, which would make it four but would also start to fill the strip this design exists to keep empty.',
      'A table against a wall is a table half of which is out of reach. It suits a household that eats in shifts and not one that eats together.',
    ],
  },
  {
    id: 'play-corner',
    name: '7 · A low shelf, and a corner that is theirs',
    theme: 'Spend one footprint on storage and a boundary at the same time',
    style: 'muji',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'The four-seat table where it belongs, and a 930 by 440 cabinet standing out from the north wall rather than against it. Turned that way it does two jobs from one footprint: it holds things, and its end makes a corner of the room feel like somewhere rather than like the middle of a route. That corner — 1.36 m of the east end, opening into the living room — becomes the children’s, with everything in it at their height and nothing in it belonging to the dining table. A low unit accessible from both sides is the standard small-flat divider, and it is the only kind of boundary a room this open can have.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1200', 1400, 925, { status: 'planned' }),
      ...chairs([
        [1550, 475],
        [2050, 475],
        [1550, 1675],
        [2050, 1675],
      ]),
      fromCatalogue('cabinet-930-low', 2850, 0, {
        id: 'divider',
        name: 'Low cabinet, standing out from the wall',
        short: 'Cabinet',
        rotation: 270,
        clearance: { south: 400 },
        status: 'considering',
        note: 'Out from the north wall rather than along it, so its 930 length becomes a boundary. Open on the east face for the children and on the west for the table, and set far enough west that the room to use its east face stops 60 mm short of the corridor’s landing.',
      }),
    ],
    openQuestions: [
      'The room to stand and use the cabinet’s east face stops 60 mm short of the corridor’s landing space. That is a check passed rather than a margin: 100 mm further east and somebody at the cabinet is in the way of somebody going to bed.',
      'A 530 high unit is climbable. Standing free rather than against a wall, it has to be weighted or fixed to the floor, and that is a real cost of using it as a divider.',
    ],
  },
  {
    id: 'rug-zones',
    name: '8 · Zoned by rug, not by furniture',
    theme: 'Mark the floor instead of dividing it, and buy nothing',
    style: 'macaron',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'The same table in the same place, and the east end of the room given a rug instead of a divider. Nothing is bought, nothing is climbed, nothing has to be fixed to the floor, and the boundary is a change of surface a two-year-old reads perfectly well: on the rug is where toys are allowed. It gives up what a shelf would have given — storage, and a boundary you can see over the top of — in exchange for a floor that can be swept clear in one movement and a room that stays one room. Of the eight designs so far this is the one that changes the least and costs the least.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1200', 1400, 925, { status: 'planned' }),
      ...chairs([
        [1550, 475],
        [2050, 475],
        [1550, 1675],
        [2050, 1675],
      ]),
      fromCatalogue('rug-flatweave', 2800, 400, {
        id: 'play-rug',
        name: 'Play rug',
        short: 'Rug',
        width: 1700,
        depth: 1800,
        colour: '#d5bfa3',
        status: 'considering',
        note: 'The east end of the room, held 950 mm clear of the corridor’s landing space so its edge is not something to trip over on the way to bed.',
      }),
    ],
    openQuestions: [
      'A rug under a play area is the thing that gets food on it. It wants to be washable, which rules out most rugs that look good in a dining room.',
      'No storage at all in this design. The toys go back to the children’s room every evening, which is a habit rather than a piece of furniture.',
    ],
  },
  {
    id: 'benches-both',
    name: '9 · Benches on both sides',
    theme: 'The smallest a table for six can be made',
    style: 'industrial',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'Two benches and a 1.6 m table, and no chair anywhere. Neither bench needs room to pull back into, so the whole arrangement is 1.7 m deep against the 2.3 m a table with chairs on both sides demands, and it seats six. That 600 mm goes straight into the clear strip along the north wall, which becomes 900 — enough to walk two abreast, or for a child to get past a chair that is not there. It is the tightest seating this room can hold, and it is a canteen: nobody has a back, everybody shuffles, and it suits a family that eats fast and often rather than long and rarely.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('bench-dining-1600', 1500, 900, { id: 'bench-north', status: 'considering' }),
      fromCatalogue('table-dining-1600', 1500, 1350, {
        clearance: {},
        status: 'considering',
        note: 'No clearance either side: both are benches, and a bench is got onto from the end.',
      }),
      fromCatalogue('bench-dining-1600', 1500, 2150, { id: 'bench-south', status: 'considering' }),
    ],
    openQuestions: [
      'The north bench has nothing behind it, so it is got onto from either end only. With the table between them that is a real constraint at every meal.',
      'A 450 high bench and a 750 table is a 300 rise, which is right. Two children under three cannot get onto it unaided, which may be a feature.',
    ],
  },
  {
    id: 'sideboard',
    name: '10 · Table north, sideboard south',
    theme: 'Use the south wall for storage and accept a table against the corridor end',
    style: 'classic',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'Every other design leaves the south wall bare because the chairs’ clearance runs to within 175 mm of it. This one moves the table to the north wall instead — chairs on its south side only — which frees the whole south wall for a 1.1 m sideboard, and puts a second surface at working height in a room that otherwise has none outside the fitted run. What it costs is the north wall: the table now sits against the wall the corridor opens off, so anybody going to bed passes behind whoever is eating. In a flat where two children go to bed while adults are still at the table, that is not a small thing.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1200', 1400, 175, {
        clearance: { south: 750 },
        status: 'considering',
        note: 'Against the north wall, 175 mm off it, with all its standing room to the south.',
      }),
      ...chairs(
        [
          [1550, 925],
          [2050, 925],
        ],
        'considering',
      ),
      fromCatalogue('sideboard-1100', 1500, 2200, {
        clearance: { north: 750 },
        status: 'considering',
        note: 'Against the south wall, which no other design here can use.',
      }),
    ],
    openQuestions: [
      'Two seats, or four with chairs at the ends. The sideboard is what this design is for, and the table is what pays for it.',
      'The table is 1.1 m from the corridor opening. Everybody who goes to bed walks behind somebody who is eating.',
    ],
  },
];

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
  designs: DINING_DESIGNS,
};
