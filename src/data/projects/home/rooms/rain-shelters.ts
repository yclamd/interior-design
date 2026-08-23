import { fromCatalogue } from '~/data/catalogue';
import { single, type Room } from '~/data/types';
import { EXISTING_CANOPY_SLAB } from '../floors';

/**
 * The two 雨遮, on the east face of the flat.
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
 * They are two rooms rather than one because the east wall steps. The living room's
 * east face stands at 9100 and the guest room's at 9650, so the slabs start 550 apart
 * and are separated by the wall between those two rooms. One room spanning both would
 * have to claim floor across a wall that is there.
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
 * The same arrangement on the guest room's east wall, and empty for now.
 *
 * Its 1000 projection is taken from the living room's, and its 2680 is the guest room's
 * inner depth, on the same reasoning that gave the other one 3050 — neither figure was
 * given. Nothing is placed on it because nothing can be placed on it yet: the guest
 * room's east window has not been measured, and the window is what decides which part
 * of this slab is within reach and which part is decoration nobody can water.
 */
export const RAIN_SHELTER_GUEST: Room = {
  id: 'rain-shelter-guest',
  name: 'Rain shelter, guest',
  kind: 'canopy',
  /** East of the guest room's outer wall face at 9650 — 550 further out than the living room's. */
  origin: { x: 9650, y: -2580 },
  shape: { kind: 'rect', width: 1000, depth: 2680 },
  ceiling: CEILING,
  /** No window recorded on the guest room's east wall yet, so there is nothing to pair. */
  openings: [],
  designs: single({
    theme: 'Measured by analogy, and nothing on it',
    style: 'warm-minimal',
    floor: EXISTING_CANOPY_SLAB,
    summary:
      'A 2.68 m² slab with nothing on it, which is the honest state of it. A rain shelter shelters a window, so there is a window in the guest room’s east wall — but it has not been measured, and until it is, the reachable part of this slab is unknown. The pattern from the living room says the answer will be the 400 mm nearest the building and only across the width of the glass; what that comes to here depends on figures nobody has taken.',
    furniture: [],
    openQuestions: [
      'Both figures are assumed. The 1000 projection is copied from the living room’s slab and the 2680 from the guest room’s inner depth. Either could be wrong, and the projection is the one that matters, because it is the difference between a ledge and a slab.',
      'The guest room’s east window is not recorded. It is the figure this slab waits on: width and sill decide what can stand here and whether it can be seen from inside.',
      'Level, parapet and load are unknown here for the same reasons as on the other slab, and the answers may differ — this one is on a different part of the facade.',
    ],
  }),
};
