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
  /** Glazed on the three outward sides; the west side is the building. */
  glazed: ['north', 'east', 'south'],
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
      'Two tall planters, both held against the building and set one at each end of the window. Against the building because a metre of slab reached through a window is not a metre of usable slab — past about 400 mm nothing can be watered without climbing out, and nobody is climbing out of this window. At the ends because the design next door that turns the sofa to face east looks through the middle of this glass: 400 of the 1800 goes at each end and the 850 between them stays clear, so the planting frames the view instead of being it. The rest of the slab stays bare, which is not indecision but the part that cannot be reached. The checks flag both for standing 300 above a 900 sill and taking some of the light, which they do — that is the trade, because a planter shorter than the sill is one nobody indoors ever sees.',
    furniture: [
      fromCatalogue('planter-tall', 0, 700, {
        id: 'planter-north',
        name: 'Tall planter, north',
        status: 'considering',
        note: 'Hard against the building face, so the whole of it is inside arm’s reach of the sill. Its 1200 height puts the top of the plant 300 above the 900 sill, which is where it can be seen from inside.',
      }),
      fromCatalogue('planter-tall', 0, 1950, {
        id: 'planter-south',
        name: 'Tall planter, south',
        status: 'considering',
        note: 'The south end of the same window, 850 mm clear of its pair. The two together read as one gesture rather than as a row, which is what two of anything does and three does not.',
      }),
    ],
    openQuestions: [
      'The slab’s level relative to the living room floor is not measured. A plant standing on it is only visible from inside if the slab is at or near floor level; if it sits lower, the 1200 planter is the minimum height that shows at all, and if it sits higher, this is a windowsill rather than a floor.',
      'The glazed screen takes the fall risk out of this, which is what makes two pots reasonable where one was cautious. What it does not do is make them reachable in the rain: everything here is watered through the window, so this suits planting that survives being ignored for a week.',
      'What the slab will carry is unknown. Two 400 mm planters with wet soil in them are 80 to 120 kg over two footprints a builder may not have designed for anything but rain.',
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
  /** Glazed on the three outward sides; the west side is the building. */
  glazed: ['north', 'east', 'south'],
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
    theme: 'Two planters at the ends of the window, on figures that are all assumed',
    style: 'warm-minimal',
    floor: EXISTING_CANOPY_SLAB,
    summary:
      'The same arrangement as the living room’s slab, one floor of the facade further north: two tall planters against the building, one at each end of the window, with 560 mm of clear glass between them. The reasoning is identical because the constraint is — the only way onto this slab is over the sill, so the usable strip is the 400 nearest the building and the useful width is the width of the glass. What differs is the confidence. Every figure here is assumed: the projection is copied from the living room’s slab, the length is the guest room’s inner depth, and the window is the children’s room’s window borrowed wholesale. The planting is drawn because the slab is real and green belongs on it; where exactly it lands wants one afternoon with a tape.',
    furniture: [
      fromCatalogue('planter-tall', 0, 660, {
        id: 'planter-north',
        name: 'Tall planter, north',
        status: 'considering',
        note: 'Against the building at the north end of the window, within reach of the sill.',
      }),
      fromCatalogue('planter-tall', 0, 1620, {
        id: 'planter-south',
        name: 'Tall planter, south',
        status: 'considering',
        note: 'The south end of the same window. The window is 1500 rather than the living room’s 1800, so the clear gap between the pair is 560 rather than 850.',
      }),
    ],
    openQuestions: [
      'Three assumed figures: the 1000 projection from the living room’s slab, the 2680 from the guest room’s inner depth, and the window’s 1500 by 1200 with a 900 sill from the children’s room. The projection matters most — it is the difference between a ledge and a slab, and with it the whole question of whether two planters fit.',
      'Level, parapet and load are unknown here as on the other slabs, and the answers may differ, because this one is on a part of the facade that steps 550 out from the rest.',
      'A guest room is the room nobody is in most of the year, so this is the planting least likely to be watered. That argues for the toughest thing on the list rather than the best-looking one.',
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
 * It is also the one whose planting was argued out of and then back in. Left bare, the
 * case was that a 900 sill is climbable and a pot on the far side of it is a reason to
 * climb — which was the right call while the slab was an open ledge. Glazing the three
 * outward sides takes the fall out of it: what is beyond the sill now is an enclosure,
 * not a drop. What remains is soil within reach of a two-year-old who gets the window
 * open, and that is a question about a window catch rather than about whether to have
 * plants.
 *
 * The geometry differs from the other two because this face of the building does. The
 * slab is 2550 across and only 1000 deep, so the reachable strip runs east–west along
 * the south edge rather than north–south, and the planters sit in it side by side.
 */
export const RAIN_SHELTER_CHILDRENS: Room = {
  id: 'rain-shelter-childrens',
  name: "Rain shelter, children's",
  kind: 'canopy',
  /** North of the children's room's outer wall face at −5620, aligned with its inner width. */
  origin: { x: 2950, y: -6620 },
  shape: { kind: 'rect', width: 2550, depth: 1000 },
  /** Glazed on the three outward sides; the south side is the building. */
  glazed: ['north', 'east', 'west'],
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
    theme: 'Two planters at a two-year-old’s eye level, behind glass',
    style: 'warm-minimal',
    floor: EXISTING_CANOPY_SLAB,
    summary:
      'Two tall planters side by side in the strip along the building, set inside the width of the window with 510 mm of clear glass between them. This is the one slab where the planting is for somebody in particular. The window sill is at 900 and the planters stand 1200, so the tops sit 300 above it — which for an adult is a low plant and for a child standing at that window is the whole view. Of the three slabs this is the one whose planting will actually be looked at, every day, by the two people the flat is being arranged around. What it asks in return is a window catch: the glass takes the fall risk out of an open ledge, and what is left is 60 kg of soil a metre from a floor two children play on.',
    furniture: [
      fromCatalogue('planter-tall', 620, 600, {
        id: 'planter-west',
        name: 'Tall planter, west',
        status: 'considering',
        note: 'In the 400 strip along the building, inside the west end of the window. This slab runs east–west, so its pair sits beside it rather than beyond it.',
      }),
      fromCatalogue('planter-tall', 1530, 600, {
        id: 'planter-east',
        name: 'Tall planter, east',
        status: 'considering',
        note: 'The east end of the same window, 510 mm clear of its pair — enough that a child sees two plants and a gap rather than a hedge.',
      }),
    ],
    openQuestions: [
      'The 1000 projection is given; the 2550 is taken as the room’s full inner width, by the same reasoning as the other two, and has not been measured.',
      'A window catch is now part of this design rather than a detail after it. Everything else here is drawn for two children under three, and this is the one place the drawing puts something they want on the far side of an opening.',
      'Level and load are unrecorded as on the other slabs. The parapet matters less than it did, because the screen is doing that job now.',
    ],
  }),
};
