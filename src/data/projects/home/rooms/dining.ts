import { fromCatalogue } from '~/data/catalogue';
import { circlePoints } from '~/lib/geometry';
import type { Design, Furniture, Room } from '~/data/types';
import { ASSUMED_BOARDS } from '../floors';

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
 *
 * The style is the project's on every one of them, and held there deliberately. These
 * used to carry a style each, cycling through seven, so the first thing anyone saw
 * comparing two designs was a change of colour — the one variable in the set that costs
 * nothing and can be changed after the flat is built. Held still, the difference between
 * two designs is the difference in the arrangement, which is what is being decided.
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

/**
 * Chairs, each given the way it faces.
 *
 * The facing is not optional and has no default, because leaving it out is exactly the
 * mistake that was here: every chair took rotation 0, which is facing south, so the
 * chairs on the south side of every table were drawn with their backs to it. The
 * footprint is 450 square and does not change when it turns, so nothing in the checks
 * noticed and nothing in the drawing showed it until chairs were drawn with a back.
 *
 * A piece faces south before it is turned, so: 0 faces south, 180 north, 270 east and
 * 90 west. A chair north of a table therefore takes 0, and one south of it takes 180.
 */
const chairs = (
  positions: [x: number, y: number, facing: 0 | 90 | 180 | 270][],
  status: Furniture['status'] = 'planned',
) =>
  positions.map(([x, y, facing], i) =>
    fromCatalogue('chair-dining', x, y, { id: `chair-${i + 1}`, status, rotation: facing }),
  );

export const DINING_DESIGNS: Design[] = [
  {
    id: 'table-west',
    name: '1 · Table west, floor east',
    preferred: true,
    theme: 'Push the table as far west as its own chairs allow and keep the rest as one floor',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The 1500 by 900 table with its length running east–west, held 50 mm clear of where the storage run’s standing room ends. Turned this way the chairs take their 750 out of the depth and only 1.5 m of the width; turned the other way they would take 2.4 m of the width instead, and the room would be a table with a corridor round it. What this buys is 1.75 m of clear width east of the table, running into the living room without a threshold — two children under three use the floor of a flat rather than its furniture, and this is the most of it any arrangement here leaves in one piece. The depth is the tight figure: 900 of table and 750 either side comes to 2400 of the room’s 2600, so the table sits centred with 100 mm to spare at each end and neither of those walls can hold anything at all.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1500', 1400, 850, { status: 'planned' }),
      /** Table y 850–1750, so 400 is the north side and 1750 the south. */
      ...chairs([
        [1550, 400, 0],
        [2250, 400, 0],
        [1550, 1750, 180],
        [2250, 1750, 180],
      ]),
    ],
    openQuestions: [
      'Four seats. A chair at each end would make six, but at this position the west one would sit inside the storage run’s standing room — which is why the six-seat design moves the whole table 400 mm east and pays for it in floor.',
      'The chairs’ clearance runs to within 100 mm of both the north and south walls. There is no sideboard on either of them, now or later, and the 900 deep table is what spends that.',
    ],
  },
  {
    id: 'table-six',
    name: '2 · Five at the same table, one of them at the west end',
    theme: 'The fifth seat, and the sixth one the room no longer has room for',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'Two chairs down each long side and one at the west end. This was six until the living room took 900 from this room’s east end, and the sixth chair stood in exactly that 900: at the east head of the table it needed 750 behind it to be pulled out, and what is behind it now is a wall. So the design is five, and the honest reading is that the sixth seat is what the wider living room cost. The five that remain are properly seated — the four along the sides keep the full 750 they get in the four-seat design, and the one at the west end gets the whole 900 of the table depth. Three a side would put six round a 1500 top on paper and give each of them 500 mm of edge, under the 550 a place setting needs, which is a drawing of six seats rather than six seats.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1500', 1800, 850, {
        clearance: { north: 750, south: 750, west: 750 },
        status: 'considering',
        note: 'Held 400 mm east of where the four-seat design puts it, so the chair at the west end clears the storage run’s standing room instead of sitting in it. No clearance is asked for on the east face any more: nobody sits there.',
      }),
      /** Table x 1800–3300, y 850–1750: two a side, and one at the west end facing along it. */
      ...chairs(
        [
          [1950, 400, 0],
          [2600, 400, 0],
          [1950, 1750, 180],
          [2600, 1750, 180],
          [1350, 1075, 270],
        ],
        'considering',
      ),
    ],
    openQuestions: [
      'The chair at the west end stands exactly where the storage run’s standing room ends. That is a check passed rather than a margin.',
      'The sixth seat could come back by moving the whole table west, but not far: 300 mm in, the west end chair is inside the storage run’s standing room. The table would have to lose depth instead, and a 750 top seats four rather than six.',
      'Five seats in a flat with two children under three is already a bet on five years from now. Whether the sixth was worth 900 mm of living room is the question this pair of designs exists to ask.',
    ],
  },
  {
    id: 'extendable',
    name: '3 · An extendable table',
    theme: 'Four every day, six when it matters, and stop choosing',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The first two designs are a choice between four seats and six. This one refuses it. A 1200 by 800 top that takes a leaf to 1800 sits exactly where the four-seat table sits and leaves the same 2.05 m of floor for 360 days a year; on the other five, the leaf goes in, two chairs come from the bedrooms, and the table grows east into floor nobody is using at dinner time anyway. It needs 600 mm of length at one end and nothing in depth, and the room has 2.05 m spare at that end. This is the answer small-space design keeps arriving at, and it is available here at no cost in floor at all.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-extendable', 1400, 900, {
        status: 'planned',
        note: 'Drawn closed at 1200. Extended it reaches 2600 east, which is 1.1 m short of the corridor’s landing space, so even open it blocks nothing.',
      }),
      /** Table y 900–1700. */
      ...chairs([
        [1550, 450, 0],
        [2050, 450, 0],
        [1550, 1700, 180],
        [2050, 1700, 180],
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
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
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
      /** Table y 1250–2150, so both chairs are on its north side. */
      ...chairs(
        [
          [1650, 800, 0],
          [2400, 800, 0],
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
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'An 1100 round top seating four, with a chair at each quarter. A round table loses less to circulation than a rectangle seating the same number, because people pass a circle on the diagonal and a rectangle square-on, and it is the only table shape with nothing at a two-year-old’s eye height to run into. It also has no head of the table, which in a room this open matters more than it sounds: nobody sits with their back to the way in. What it costs is the wall: a round table cannot be pushed against anything, so it holds the middle of the room and the clear floor ends up in two pieces rather than one.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-round-1100', 1800, 750, {
        /** Round, so its footprint is a circle and not the square around it. */
        outline: circlePoints(1100),
        status: 'considering',
      }),
      /** One at each quarter of the 1100 round top, which spans x and y 1800–2900 / 750–1850. */
      ...chairs(
        [
          [2100, 300, 0],
          [2100, 1850, 180],
          [2900, 1075, 90],
          [1350, 1075, 270],
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
    floor: ASSUMED_BOARDS,
    summary:
      'The standard answer to a narrow room, applied literally: put the furniture along one long side and leave the other as a route. The 1500 table goes hard against the south wall with chairs only on its north side, which seats two facing the room and two more at the ends if they are wanted. That leaves 950 mm of clear depth running the entire 4.65 m width — the widest single piece of floor any of these designs produces, and the only one a child can run the length of. What it costs is dining: half the table is against a wall and out of reach, and it suits a household that eats in shifts rather than together.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1500', 1400, 1700, {
        clearance: { north: 750 },
        status: 'considering',
        note: 'Against the south wall, so all its standing room is on the north side.',
      }),
      /** Table hard against the south wall at y 1700, so the chairs face south into it. */
      ...chairs(
        [
          [1550, 1250, 0],
          [2250, 1250, 0],
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
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The four-seat table where it belongs, and a 930 by 440 cabinet standing out from the north wall rather than against it. Turned that way it does two jobs from one footprint: it holds things, and its end makes a corner of the room feel like somewhere rather than like the middle of a route. That corner — 1.21 m of the east end, opening into the living room — becomes the children’s, with everything in it at their height and nothing in it belonging to the dining table. A low unit accessible from both sides is the standard small-flat divider, and it is the only kind of boundary a room this open can have.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1500', 1400, 850, { status: 'planned' }),
      ...chairs([
        [1550, 400, 0],
        [2250, 400, 0],
        [1550, 1750, 180],
        [2250, 1750, 180],
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
    name: '8 · A rug under the table, not beside it',
    theme: 'Mark the dining zone, because the play zone is now next door',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'This design used to put a 1.7 by 1.8 m rug at the east end of the room and call it the children’s corner. That floor is the living room now — the 900 the living room took is most of what the rug stood on, and what is left at the east end is an 850 strip. So the rug does the other job a rug does in a dining room: it goes under the table and catches the chairs, which marks the eating zone in a room that has no wall around it and stops four chair legs scraping bare boards twice a day. It is 2.2 by 2.0 m, which is the smallest that still has all four chairs on it when they are pulled out. Nothing is bought that was not being bought, nothing is climbed, and the play corner it gave up has moved to the room next door, where there is now 900 mm more floor to put it on.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1500', 1400, 850, { status: 'planned' }),
      ...chairs([
        [1550, 400, 0],
        [2250, 400, 0],
        [1550, 1750, 180],
        [2250, 1750, 180],
      ]),
      fromCatalogue('rug-flatweave', 1250, 300, {
        id: 'dining-rug',
        name: 'Dining rug',
        short: 'Rug',
        width: 2200,
        depth: 2000,
        colour: '#d5bfa3',
        status: 'considering',
        note: 'Under the table and out past the chairs on all four sides, so a chair pulled back is still on it. Held 300 mm off the north wall and 300 off the south, which is where the chairs’ own clearance ends.',
      }),
    ],
    openQuestions: [
      'A rug under a dining table is the thing that gets food on it, and with two children under three it will. It wants to be washable, which rules out most rugs that look good in a dining room.',
      'A rug and four hard chairs is a rug that gets dragged. Either the chairs get felt pads or the rug gets a grip underlay, and neither is on the plan.',
      'It could be argued the other way: a room this open reads as one space, and a rug under the table is the one move that makes the eating half look like a room. Whether that is worth doing when the boards are new is a decision about liking a floor, not about using one.',
    ],
  },
  {
    id: 'benches-both',
    name: '9 · Benches on both sides',
    theme: 'The smallest a table for six can be made',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
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
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'Every other design leaves the south wall bare because the chairs’ clearance runs to within 175 mm of it. This one moves the table to the north wall instead — chairs on its south side only — which frees the whole south wall for a 1.1 m sideboard, and puts a second surface at working height in a room that otherwise has none outside the fitted run. What it costs is the north wall: the table now sits against the wall the corridor opens off, so anybody going to bed passes behind whoever is eating. In a flat where two children go to bed while adults are still at the table, that is not a small thing.',
    furniture: [
      ...BUILT_IN,
      fromCatalogue('table-dining-1500', 1400, 100, {
        clearance: { south: 750 },
        status: 'considering',
        note: 'Against the north wall, 100 mm off it, with all its standing room to the south.',
      }),
      /** Table against the north wall at y 100–1000, so these two face north into it. */
      ...chairs(
        [
          [1550, 1000, 180],
          [2250, 1000, 180],
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
  name: { en: 'Dining', zh: '餐廳' },
  kind: 'dining',
  /** Flush with the entry's east edge at 1850, so the two stand open to each other. */
  origin: { x: 1850, y: 650 },
  shape: { kind: 'rect', width: 3750, depth: 2600 },
  ceiling: 2600,
  /**
   * No opening to the corridor any more. It used to be the last 900 of this room's north
   * wall; the living room then took 900 of this room's east end and, with it, the corridor's
   * south end. The way into the private half is now in the living room's north wall, and
   * this room's north wall runs unbroken along the back of the kitchen and the shower room.
   */
  openings: [],
  designs: DINING_DESIGNS,
};
