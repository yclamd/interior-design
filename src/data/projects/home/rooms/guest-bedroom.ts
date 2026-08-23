import { single, type Room } from '~/data/types';
import { ASSUMED_BOARDS } from '../floors';

/**
 * 2950 east–west by 2680 north–south, north of the living room: one 100 wall off it, so
 * its south face is at 100.
 *
 * Its east–west position comes from the 900 between the shower room's east wall and this
 * room's west wall. Read as a clear gap measured face to face, that 900 is the corridor
 * itself: the shower room's wall runs to 5600, the corridor is 5600 to 6500, this room's
 * wall is 6500 to 6600, and the inside starts at 6600. It is the reading that makes
 * everything else land — the opening in the dining room's north wall is 900 wide at
 * exactly 5600 to 6500, so the corridor is the width of its own mouth, and the doors on
 * both sides of it open into it.
 *
 * The alternative reading, 900 between the two inside faces, would put this room's west
 * face at 6400 and leave the corridor 700 clear inside a 900 opening. That does not fit.
 *
 * As drawn the building steps out 550 east at this end, past the living room's east wall
 * and past the rain shelter beyond it. That is the one consequence still worth checking:
 * if the east wall is straight the whole way up, something between the shower room and
 * here is 550 narrower than these figures make it.
 */
export const GUEST_BEDROOM: Room = {
  id: 'guest-bedroom',
  name: 'Guest room',
  kind: 'bedroom',
  origin: { x: 6600, y: -2580 },
  shape: { kind: 'rect', width: 2950, depth: 2680 },
  /** Assumed, as the flat's. Not measured. */
  ceiling: 2600,
  openings: [
    {
      id: 'guest-bedroom-door',
      kind: 'door-swing',
      side: 'west',
      /** Hard to the south end: 2680 of wall less the 900 door. */
      offset: 1780,
      width: 900,
      height: 2100,
      sill: 0,
      /**
       * Inward, hinged at the south end — 'right' being the far end from the one the
       * offset is measured from. Hinged in the corner, the leaf folds back onto the
       * south wall rather than sweeping into the room, which keeps the 900 nearest the
       * door usable and leaves the west wall north of the door whole.
       */
      swing: 'right-in',
      to: 'corridor',
    },
  ],
  designs: single({
    theme: 'Measured, and nothing decided',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The shell only, at 7.91 m² — a metre more floor than the living room next door has, which is worth saying out loud before anything is put in it. At 2950 by 2680 a double bed goes against either the north or the south wall with 1.4 to 1.5 m left in front of it, and that is a real bedroom rather than a room a bed is wedged into. The choice it forces is the wardrobe: 600 of depth off the 2950 leaves 2350, still enough for a 1500 bed centred with 425 either side.',
    furniture: [],
    openQuestions: [
      'No window is recorded, and there has to be one in the east wall: a rain shelter projects from it, and a rain shelter shelters an opening. Its width and sill are the missing figures, and they decide where anything can stand on that slab, because the only way onto it is over the sill.',
      'The leaf folds onto the south wall for 900 of its 2950, so that corner cannot hold a wardrobe. The north wall and the north half of the west wall are the two that stay whole.',
      'It has more floor than the living room — 7.91 m² against 7.63. Whether it stays a guest room, or becomes the room the two children take, is now a question with numbers behind it.',
    ],
  }),
};
