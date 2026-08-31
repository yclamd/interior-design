import { fromCatalogue } from '~/data/catalogue';
import { single, type Room } from '~/data/types';
import { ASSUMED_BOARDS } from '../floors';

/**
 * 1650 east–west by 1300 north–south, at the west end of the flat with the front
 * door in its west wall. It shares its north wall with the dining room and stands
 * open to it: the two fitted runs join at the corner, which they could not do with a
 * partition between them.
 *
 * Only 1300 deep, of which 330 is cabinet, so the walking width is 970. At 1650 wide
 * that walking space is 1.65 by 0.97 m, which is a space to put a bag down in and turn
 * round, and not one two people pass each other in.
 */
export const ENTRY: Room = {
  id: 'entry',
  name: { en: 'Entry', zh: '玄關' },
  kind: 'entry',
  origin: { x: 200, y: 650 },
  shape: { kind: 'rect', width: 1650, depth: 1300 },
  ceiling: 2600,
  openings: [
    {
      id: 'front-door',
      kind: 'door-swing',
      side: 'west',
      /** Measured from the north end. Flush to the north wall, as given. */
      offset: 0,
      width: 900,
      height: 2100,
      sill: 0,
      /** Hinged at the north end, so the leaf opens back against the north wall. */
      swing: 'left-in',
      to: 'outside',
    },
    {
      /**
       * The kitchen's sliding door, recorded from this side too because both rooms have
       * to list a shared opening. Same id, so the two are read as one hole.
       *
       * It runs 1300 to 2100 in plan and this room's east wall is at 1850, so 250 of it
       * is beyond the entry and over the dining room. That is not a mistake in either
       * room: the entry and the dining room stand open to each other, so the doorway
       * opens onto the join between them rather than into one of them.
       */
      id: 'kitchen-door',
      kind: 'door-sliding',
      side: 'north',
      offset: 1100,
      width: 800,
      height: 2100,
      sill: 0,
      to: 'kitchen',
    },
  ],
  designs: single({
    theme: 'A metre of walking width, and everything else given to storage',
    style: 'warm-minimal',
    floor: ASSUMED_BOARDS,
    summary:
      'The whole south side is a 330 mm fitted run for shoes and everything that comes in with them, which leaves 970 mm to walk through. That is enough for one person with a bag and not enough for two, which is what a 1.3 m entry gets you. The run turns the corner into the dining room’s 600 mm storage without a break, so the two read as one piece of carpentry rather than two rooms’ worth.',
    furniture: [
      fromCatalogue('fitted-run-330', 0, 970, {
        id: 'entry-run',
        name: 'Shoe and coat run',
        width: 1650,
        /** Turned to face north, into the entry: a piece faces south before it is turned. */
        rotation: 180,
        status: 'owned',
        note: 'Full width of the entry, against the south side, with its doors facing north into the walking space. Its east end meets the dining room’s 600 mm run at the corner.',
      }),
    ],
    openQuestions: [
      'What is south of the entry is not yet known. The entry is 1300 deep against the dining room’s 2600, so there is a 1.65 by 1.3 m space behind the cabinet run that no room has claimed yet, and it is hatched rather than drawn as a room because of it.',
    ],
  }),
};
