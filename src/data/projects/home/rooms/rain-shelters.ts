import { fromCatalogue } from '~/data/catalogue';
import { single, type Room } from '~/data/types';
import { EXISTING_CANOPY_SLAB } from '../floors';

/**
 * The three 雨遮: two on the east face of the flat and one on the north.
 *
 * Neither is a balcony. There is no door onto either, and the only way to reach one is
 * over the sill of the window it shelters, so everything about what can be put on a
 * slab follows from that single fact: it has to be placed, watered and taken back in
 * through a window. That makes the 400 mm nearest the building the usable strip and
 * everything past it out of reach, whatever the slab measures.
 *
 * They are drawn because they are the only outdoor space the flat has, and because
 * planting belongs outside. Every indoor room was offered a plant and refused it: a
 * floor planter inside is 0.16 m² spent on something wanting light the room has not
 * got, and in a flat where ten designs argue over tenths of a square metre that is not
 * a small price. Out here it costs nothing.
 *
 * They are three rooms rather than one for two different reasons. The children's one is
 * on another face of the building altogether. And the two on the east face are separate
 * because that face steps: the living room's stands at 9100 and the guest room's at 9650,
 * so the slabs start 550 apart with the wall between those two rooms between them, and
 * one room spanning both would have to claim floor across a wall that is there.
 */

/** Overhead is the underside of the slab above, unmeasured; nothing is checked against it. */
const CEILING = 2600;

/**
 * 1000 east–west by 3050 north–south, the full inner width of the living room, standing
 * a metre out from the outer face of its east wall.
 */
export const RAIN_SHELTER_LIVING: Room = {
  id: 'rain-shelter-living',
  name: 'Rain shelter, living',
  kind: 'canopy',
  origin: { x: 9100, y: 200 },
  shape: { kind: 'rect', width: 1000, depth: 3050 },
  ceiling: CEILING,
  openings: [
    {
      /**
       * The living room's east window, recorded from this side too. Both rooms have to
       * list a shared opening, and it is the same id so the two are read as one hole.
       */
      id: 'east-window',
      kind: 'window',
      side: 'west',
      offset: 625,
      width: 1800,
      height: 1500,
      sill: 900,
      to: 'living',
    },
  ],
  designs: single({
    theme: 'One plant, put where a hand can reach it through the window',
    style: 'warm-minimal',
    floor: EXISTING_CANOPY_SLAB,
    summary:
      'One tall planter, held against the building and set towards the north end of the window. Against the building because a metre of slab reached through a window is not a metre of usable slab — past about 400 mm nothing can be watered without climbing out, and nobody is climbing out of this window. Towards the north end because the one design next door that turns the sofa to face east is looking through the middle of this glass, and a plant in the middle of it would be the view rather than part of it. The rest of the slab stays empty, which is not indecision: it is the part that cannot be reached. The checks flag this planter for standing 300 mm above an 1800 window’s sill and taking some of the light, which it does: 400 of the 1800, at the end furthest from where anybody sits. That is the trade the design accepts, because a planter below the sill is one nobody indoors ever sees.',
    furniture: [
      fromCatalogue('planter-tall', 0, 700, {
        id: 'canopy-planter',
        status: 'considering',
        note: 'Hard against the building face, so the whole of it is inside arm’s reach of the sill. Its 1200 height puts the top of the plant 300 above the 900 sill, which is where it can be seen from inside — a planter shorter than the sill is a planter nobody in the living room ever sees.',
      }),
    ],
    openQuestions: [
      'The slab’s level relative to the living room floor is not measured. A plant standing on it is only visible from inside if the slab is at or near floor level; if it sits lower, the 1200 planter is the minimum height that shows at all, and if it sits higher, this is a windowsill rather than a floor.',
      'Whether there is a parapet or an upstand at the outer edge is not recorded, and it is the figure that decides whether anything may be stood here at all. A 400 mm pot on an open slab three floors up is a falling object.',
      'What the slab will carry is unknown. A 400 mm planter with wet soil in it is 40 to 60 kg over a footprint a builder may not have designed for anything but rain.',
      'Nothing on this slab can be reached without opening the window, so it cannot hold anything that needs attention in the rain. That rules out most edible planting and suits one thing that survives being ignored.',
    ],
  }),
};

/**
 * The same arrangement on the guest room's east wall.
 *
 * Its 1000 projection is taken from the living room's, and its 2680 is the guest room's
 * inner depth, on the same reasoning that gave the other one 3050 — neither figure was
 * given. The window onto it is in the east wall as given, but its own figures are
 * assumed too, so this slab rests on three guesses where the living room's rests on none.
 * It is drawn and left empty for that reason rather than for want of a use: an adult
 * bedroom window is a perfectly good place to keep a plant, and the reachable strip
 * follows from the sill and the width the moment either is measured.
 */
export const RAIN_SHELTER_GUEST: Room = {
  id: 'rain-shelter-guest',
  name: 'Rain shelter, guest',
  kind: 'canopy',
  /** East of the guest room's outer wall face at 9650 — 550 further out than the living room's. */
  origin: { x: 9650, y: -2580 },
  shape: { kind: 'rect', width: 1000, depth: 2680 },
  ceiling: CEILING,
  openings: [
    {
      /** The guest room's east window from this side, on figures assumed at both ends. */
      id: 'guest-east-window',
      kind: 'window',
      side: 'west',
      offset: 590,
      width: 1500,
      height: 1200,
      sill: 900,
      to: 'guest-bedroom',
    },
  ],
  designs: single({
    theme: 'Assumed at every figure, and left empty until one of them is real',
    style: 'warm-minimal',
    floor: EXISTING_CANOPY_SLAB,
    summary:
      'A 2.68 m² slab, drawn from three assumptions and holding nothing. Its projection is copied from the living room’s, its length from the guest room’s inner depth, and the window onto it from the children’s room’s. Everything a plant needs to be decided here — how far out a hand reaches over the sill, how much of the width is in front of glass, whether the top of a pot shows from inside — follows from figures nobody has taken, so the slab is drawn because it exists and left bare because that is all that is honest. The living room’s slab, whose window is measured, is where the one plant went.',
    furniture: [],
    openQuestions: [
      'Three assumed figures: the 1000 projection from the living room’s slab, the 2680 from the guest room’s inner depth, and the window’s 1500 by 1200 with a 900 sill from the children’s room. The projection matters most — it is the difference between a ledge and a slab.',
      'Level, parapet and load are unknown here as on the other slabs, and the answers may differ, because this one is on a part of the facade that steps 550 out from the rest.',
    ],
  }),
};

/**
 * 1000 north–south by 2550 east–west, off the children's room's north wall, and the full
 * inner width of it.
 *
 * This is the one slab whose window was measured before the slab was: the children's
 * room's north window is 1500 wide with a 900 sill, so both sides of the opening are
 * known and the two are recorded as one hole rather than as a window onto nothing.
 *
 * It stays empty, and not for want of figures. The other slabs are reached over a sill by
 * an adult; this one is reached over a 900 sill in a room whose whole design is a floor
 * for two children under three to play on. A 900 sill is climbable, and a pot on a slab
 * on the far side of it is a reason to climb. Whatever goes out here is a decision about
 * a window catch first and about planting second.
 */
export const RAIN_SHELTER_CHILDRENS: Room = {
  id: 'rain-shelter-childrens',
  name: "Rain shelter, children's",
  kind: 'canopy',
  /** North of the children's room's outer wall face at −5620, aligned with its inner width. */
  origin: { x: 2950, y: -6620 },
  shape: { kind: 'rect', width: 2550, depth: 1000 },
  ceiling: CEILING,
  openings: [
    {
      /**
       * The children's room's north window from this side. Same id, so the two are read as
       * one hole; and because this slab spans the room's full width, the offset along the
       * wall is the same figure from either side.
       */
      id: 'north-window',
      kind: 'window',
      side: 'south',
      offset: 525,
      width: 1500,
      height: 1200,
      sill: 900,
      to: 'childrens-room',
    },
  ],
  designs: single({
    theme: 'Left empty, because of what is on the other side of the glass',
    style: 'warm-minimal',
    floor: EXISTING_CANOPY_SLAB,
    summary:
      'A 2.55 m² slab with nothing on it, and the only one of the three that is empty by decision rather than for want of a measurement. The window onto it is 1500 wide with a 900 sill, so the reachable strip is known — the 400 nearest the building, across the middle 1500 of the wall. What is on the inside of that window is the reason not to use it: this room is drawn as a floor for two children under three, and the case for a plant they can see is also the case for a plant they will climb to. The slab is worth having drawn because it is 2.55 m² of the building that exists, and because it says the north window has something under it rather than open air.',
    furniture: [],
    openQuestions: [
      'The 1000 projection is given; the 2550 is taken as the room’s full inner width, by the same reasoning as the other two, and has not been measured.',
      'Level, parapet and load are unrecorded here as on the other slabs, and here the parapet is the figure that matters most: it is the difference between a ledge a child could get onto and one they could not.',
      'Whether the window opens at all, and how far, is not recorded. On this one that is a safety figure rather than a gardening one.',
    ],
  }),
};
