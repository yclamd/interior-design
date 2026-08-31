import { single, type Room } from '~/data/types';
import { ASSUMED_WET_TILE } from '../floors';

/**
 * 2650 east–west by 2000 north–south, north of the entry, with its west wall on the
 * same line as the entry's — both inner faces at 200.
 *
 * It is 800 wider than the entry, so its south wall faces two different things: the
 * entry for the first 1650 and the dining room for the 800 beyond it. The sliding door
 * lands across that join — given as 1100 to 1900 from the west wall, it runs 1300 to
 * 2100 in plan, and the entry stops at 1850, so 550 of the doorway opens into the entry
 * and 250 into the dining room. On the ground there is nothing there to cross: the two
 * stand open to each other with no partition and one continuous floor, so the doorway
 * opens onto one space. The boundary it straddles is a line in this dataset and not a
 * line in the flat. It is listed against the entry because that is the side it is used
 * from.
 *
 * Nothing is drawn in it yet. A kitchen is a run of units, appliances and a worktop,
 * and none of those has been measured — putting a typical galley in from the catalogue
 * would fill 5.3 m² with furniture nobody has chosen.
 */
export const KITCHEN: Room = {
  id: 'kitchen',
  name: { en: 'Kitchen', zh: '廚房' },
  kind: 'kitchen',
  /** West wall on the entry's line at 200; south wall one 100 wall north of it at 550. */
  origin: { x: 200, y: -1450 },
  shape: { kind: 'rect', width: 2650, depth: 2000 },
  /** Assumed, as the flat's. Not measured. */
  ceiling: 2600,
  openings: [
    {
      id: 'kitchen-door',
      kind: 'door-sliding',
      side: 'south',
      /** Given as 1100 to 1900 measured east from this room's own west wall. */
      offset: 1100,
      width: 800,
      height: 2100,
      sill: 0,
      to: 'entry',
      note: 'Sliding, on the entry side of the wall, and pulled east to open. The dataset has no field for which way a sliding leaf travels, so that is written here rather than drawn — and it is a real constraint: with the door open the panel stands on the entry side across the 800 of wall east of the opening, which is wall the dining room shares, so nothing tall can sit flat against it.',
    },
  ],
  designs: single({
    theme: 'Measured, and nothing decided',
    style: 'warm-minimal',
    floor: ASSUMED_WET_TILE,
    summary:
      'The shell only. 2650 by 2000 gives 5.3 m² with one door in the south wall and no window recorded, which is enough to know two things already: a galley with runs down both long walls would leave 1.0 to 1.2 m between them depending on the units, which works; and a single run with a table in it would not, because the door lands in the middle of the south wall rather than at one end, so the middle of the room is a route.',
    furniture: [],
    openQuestions: [
      'No window is recorded. A kitchen 2650 by 2000 with one 800 door and no opening is a room that needs mechanical extraction rather than a choice about it, so whether there is a window, and in which wall, changes what can go against that wall.',
      'The 800 sliding door is the widest thing that can come through in one piece, which rules out most built-in appliances arriving assembled and every worktop longer than the room’s diagonal.',
      'Which walls carry the units is not decided, and the door position decides it: an opening 1100 from the west wall leaves 1100 of south wall to its west and 750 to its east, and neither is a run.',
    ],
  }),
};
