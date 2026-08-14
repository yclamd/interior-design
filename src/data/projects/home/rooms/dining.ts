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
      'The 1500 by 900 table with its length running east–west, held 50 mm clear of where the storage run’s standing room ends. Turned this way the chairs take their 750 out of the depth and only 1.5 m of the width; turned the other way they would take 2.4 m of the width instead, and the room would be a table with a corridor round it. What this buys is 1.75 m of clear width east of the table, running into the living room without a threshold — two children under three use the floor of a flat rather than its furniture, and this is the most of it any arrangement here leaves in one piece. The depth is the tight figure: 900 of table and 750 either side comes to 2400 of the room’s 2600, so the table sits centred with 100 mm to spare at each end and neither of those walls can hold anything at all.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1500', 1400, 850, { status: 'planned' }),
      ...chairs([
        [1550, 400],
        [2250, 400],
        [1550, 1750],
        [2250, 1750],
      ]),
    ],
    openQuestions: [
      'Four seats. A chair at each end would make six, but at this position the west one would sit inside the storage run’s standing room — which is why the six-seat design moves the whole table 400 mm east and pays for it in floor.',
      'The chairs’ clearance runs to within 100 mm of both the north and south walls. There is no sideboard on either of them, now or later, and the 900 deep table is what spends that.',
    ],
  },
  {
    id: 'table-six',
    name: '2 · Six at the same table, two of them at the ends',
    theme: 'Seat six without anybody getting 500 mm of table',
    style: 'warm-minimal',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'Two chairs down each long side and one at each end. Three a side would also fit a 1500 top on paper and would give each of six people 500 mm of edge, which is under the 550 a place setting needs and not worth drawing — a chair nobody can sit at is not a seat. This way the four along the sides keep the full 750 they get in the four-seat design and the two at the ends get the whole 900 of the table depth, so all six are properly seated. What it costs is the table moving 400 mm east, which is what it takes to keep the head of the table out of the storage run’s standing room. Clear floor east then drops from 1.75 m to 0.9 m, and the last 900 of that is the corridor’s own landing space. Six proper seats costs almost all of the continuous floor.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1500', 1800, 850, {
        clearance: { north: 750, south: 750, east: 750, west: 750 },
        status: 'considering',
        note: 'Held 400 mm east of where the four-seat design puts it, so the chair at the west end clears the storage run’s standing room instead of sitting in it.',
      }),
      ...chairs(
        [
          [1950, 400],
          [2600, 400],
          [1950, 1750],
          [2600, 1750],
          [1350, 1075],
          [3300, 1075],
        ],
        'considering',
      ),
    ],
    openQuestions: [
      'The chair at the west end stands exactly where the storage run’s standing room ends, and the one at the east end exactly where the corridor’s landing begins. Both are checks passed rather than margins.',
      'Six seats in a flat with two children under three is a bet on five years from now rather than on now — and this is the version of that bet that does not also seat them badly.',
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
      'A bench against the south wall with the 1500 table pushed onto it, and chairs on the north side only. A bench needs no room to pull back into, so this arrangement saves the 750 mm a second row of chairs would want and puts the whole saving into one place: a clear 500 mm strip along the north wall running the full width of the room, from the front door to the living room, with the table and everybody at it out of the way of it. Four sit properly, two on chairs and two on the bench, and the bench will take a third at a squeeze in a way a row of chairs cannot. What it costs is the shuffle: the person in the middle of a bench gets out last.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('bench-dining-1600', 1450, 2150, {
        status: 'considering',
        note: 'Hard against the south wall, and 100 mm longer than the table at either end. Its 450 depth and no clearance is the whole trick.',
      }),
      fromCatalogue('table-dining-1500', 1500, 1250, {
        clearance: { north: 750 },
        status: 'considering',
        note: 'Pushed south onto the bench, so all its standing room is on one side.',
      }),
      ...chairs(
        [
          [1650, 800],
          [2400, 800],
        ],
        'considering',
      ),
    ],
    openQuestions: [
      'Four seated properly: two on chairs at 750 each and two on the bench. A third chair would fit the 1500 table only by giving all three 500 mm, which is under what a place setting needs, so it is not drawn. The bench will take a third at a squeeze because a bench has no arms to define where one person stops.',
      'A bench against a wall means the wall is the backrest. At 450 high with a 740 table this is a perch rather than a chair, and it is not where anybody wants to sit for two hours.',
      'The clear strip along the north is 500 mm, where the shallower table left 600. That is a passage either way, not a play space — this design buys circulation, not floor.',
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
      'The standard answer to a narrow room, applied literally: put the furniture along one long side and leave the other as a route. The 1500 table goes hard against the south wall with chairs only on its north side, which seats two facing the room and two more at the ends if they are wanted. That leaves 950 mm of clear depth running the entire 4.65 m width — the widest single piece of floor any of these designs produces, and the only one a child can run the length of. What it costs is dining: half the table is against a wall and out of reach, and it suits a household that eats in shifts rather than together.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1500', 1400, 1700, {
        clearance: { north: 750 },
        status: 'considering',
        note: 'Against the south wall, so all its standing room is on the north side.',
      }),
      ...chairs(
        [
          [1550, 1250],
          [2250, 1250],
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
      'The four-seat table where it belongs, and a 930 by 440 cabinet standing out from the north wall rather than against it. Turned that way it does two jobs from one footprint: it holds things, and its end makes a corner of the room feel like somewhere rather than like the middle of a route. That corner — 1.21 m of the east end, opening into the living room — becomes the children’s, with everything in it at their height and nothing in it belonging to the dining table. A low unit accessible from both sides is the standard small-flat divider, and it is the only kind of boundary a room this open can have.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1500', 1400, 850, { status: 'planned' }),
      ...chairs([
        [1550, 400],
        [2250, 400],
        [1550, 1750],
        [2250, 1750],
      ]),
      fromCatalogue('cabinet-930-low', 3000, 0, {
        id: 'divider',
        name: 'Low cabinet, standing out from the wall',
        short: 'Cabinet',
        rotation: 270,
        /** 250 rather than 400: the corridor's landing space is 310 mm further east. */
        clearance: { south: 250 },
        status: 'considering',
        note: 'Out from the north wall rather than along it, so its 930 length becomes a boundary. Open on the east face for the children and on the west for the table. Held in the 550 mm between the table’s east end and the corridor, which is all the room the 1500 table leaves it.',
      }),
    ],
    openQuestions: [
      'The 1500 table leaves this cabinet 550 mm of wall to stand on and 250 mm to be used from, against the 400 a cupboard wants. With the shallower table it had 400. This is the design the bigger table costs the most.',
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
      fromCatalogue('table-dining-1500', 1400, 850, { status: 'planned' }),
      ...chairs([
        [1550, 400],
        [2250, 400],
        [1550, 1750],
        [2250, 1750],
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
      fromCatalogue('bench-dining-1600', 1450, 700, { id: 'bench-north', status: 'considering' }),
      fromCatalogue('table-dining-1500', 1500, 1150, {
        clearance: {},
        status: 'considering',
        note: 'No clearance either side: both are benches, and a bench is got onto from the end.',
      }),
      fromCatalogue('bench-dining-1600', 1450, 2050, { id: 'bench-south', status: 'considering' }),
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
      fromCatalogue('table-dining-1500', 1400, 100, {
        clearance: { south: 750 },
        status: 'considering',
        note: 'Against the north wall, 100 mm off it, with all its standing room to the south.',
      }),
      ...chairs(
        [
          [1550, 1000],
          [2250, 1000],
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
