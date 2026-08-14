import { fromCatalogue } from '~/data/catalogue';
import { single, type Room } from '~/data/types';
import { EXISTING_CANOPY_SLAB } from '../floors';

/**
 * 1000 east–west by 3050 north–south, projecting from the living room's east wall.
 *
 * A 雨遮, not a balcony. It runs the full 3050 of the living room's inner width and
 * stands a metre out beyond the outer face of the east wall, and there is no door onto it:
 * the only way to reach it is over the sill of the living room's east window, which is
 * 900 up and spans the middle 1800 of the wall. That single fact decides everything
 * that can be put here. Anything on this slab has to be placed, watered and taken back
 * in through a window, so it has to stand within arm's reach of the wall and within
 * the width of the opening. The 400 mm nearest the building is the usable strip; the
 * outer 600 is out of reach and stays empty.
 *
 * It is drawn because it is the only outdoor space the flat has, and because planting
 * belongs outside. Every indoor room here was offered a plant and refused it: a floor
 * planter inside is 0.16 m² of floor spent on something wanting light the room has not
 * got, and in a flat where the argument between ten designs is measured in tenths of a
 * square metre, that is not a small price. Out here it costs nothing at all.
 */
export const RAIN_SHELTER: Room = {
  id: 'rain-shelter',
  name: 'Rain shelter',
  kind: 'canopy',
  /** East of the living room's outer wall face at 9100, aligned with its inner width. */
  origin: { x: 9100, y: 200 },
  shape: { kind: 'rect', width: 1000, depth: 3050 },
  /**
   * Whatever is overhead is the underside of the slab above, and it has not been
   * measured. Taken as the flat's own figure so it is not a second invented number;
   * nothing is checked against it, because a rain shelter has no ceiling.
   */
  ceiling: 2600,
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
