import { fromCatalogue } from '~/data/catalogue';
import { single, type Room } from '~/data/types';

/**
 * 2250 east–west by 1300 north–south, at the west end of the flat with the front
 * door in its west wall. It shares its north wall with the dining room and stands
 * open to it: the two fitted runs join at the corner, which they could not do with a
 * partition between them.
 *
 * Only 1300 deep, of which 330 is cabinet, so the walking width is 970.
 */
export const ENTRY: Room = {
  id: 'entry',
  name: 'Entry',
  kind: 'entry',
  origin: { x: 200, y: 650 },
  shape: { kind: 'rect', width: 2250, depth: 1300 },
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
  ],
  designs: single({
    theme: 'A metre of walking width, and everything else given to storage',
    style: 'warm-minimal',
    floor: { name: 'Not yet decided', colour: '#ddd6c9' },
    summary:
      'The whole south side is a 330 mm fitted run for shoes and everything that comes in with them, which leaves 970 mm to walk through. That is enough for one person with a bag and not enough for two, which is what a 1.3 m entry gets you. The run turns the corner into the dining room’s 600 mm storage without a break, so the two read as one piece of carpentry rather than two rooms’ worth.',
    furniture: [
      fromCatalogue('fitted-run-330', 0, 970, {
        id: 'entry-run',
        name: 'Shoe and coat run',
        width: 2250,
        /** Turned to face north, into the entry: a piece faces south before it is turned. */
        rotation: 180,
        status: 'owned',
        note: 'Full width of the entry, against the south side, with its doors facing north into the walking space. Its east end meets the dining room’s 600 mm run at the corner.',
      }),
    ],
    openQuestions: [
      'What is south of the entry is not yet known. The entry is 1300 deep against the dining room’s 2600, so there is a 2.25 by 1.3 m space behind the cabinet run that no room has claimed yet, and it is drawn as solid because of it.',
    ],
  }),
};
