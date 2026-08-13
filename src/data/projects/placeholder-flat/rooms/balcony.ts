import { placed } from '~/lib/geometry';
import { single, type Room } from '~/data/types';

export const BALCONY: Room = {
  id: 'balcony',
  name: 'Balcony',
  kind: 'balcony',
  origin: { x: 200, y: 200 },
  shape: { kind: 'rect', width: 4800, depth: 1300 },
  ceiling: 2400,
  openings: [
    {
      id: 'balcony-slider',
      kind: 'door-sliding',
      side: 'south',
      offset: 1200,
      width: 2400,
      height: 2200,
      sill: 0,
      to: 'living',
    },
  ],
  designs: single({
    theme: 'Drying, and one thing worth looking at from the sofa',
    style: 'japandi',
    floor: {
      name: 'Outdoor porcelain on pedestals, level with the living room',
      colour: '#cfc6b8',
    },
    summary:
      'A 1.3 m deep balcony is not somewhere to sit; it is where the laundry goes and what the living room looks at. Keeping it clear apart from the drying rack and one tall plant is the whole design, because it is the only thing in front of a 2.4 m glass door.',
    furniture: [
      placed(200, 0, {
        id: 'drying-rack',
        name: 'Ceiling drying rack',
        kind: 'appliance',
        width: 1200,
        depth: 300,
        height: 300,
        mountedAt: 1900,
        status: 'planned',
        note: 'Hung from the soffit and pulled down to load, so it takes no floor at all.',
      }),
      placed(4200, 400, {
        id: 'balcony-plant',
        name: 'Tall planter',
        kind: 'plant',
        width: 400,
        depth: 400,
        height: 1200,
        status: 'considering',
        note: 'Set at the east end, off the line of sight from the sofa through the glass.',
      }),
    ],
  }),
};
