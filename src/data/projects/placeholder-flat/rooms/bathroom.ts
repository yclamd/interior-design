import { placed } from '~/lib/geometry';
import { single, type Room } from '~/data/types';

export const BATHROOM: Room = {
  id: 'bathroom',
  name: 'Bathroom',
  kind: 'bathroom',
  origin: { x: 5100, y: 2600 },
  shape: { kind: 'rect', width: 1900, depth: 2100 },
  ceiling: 2400,
  openings: [
    {
      id: 'bathroom-door',
      kind: 'door-swing',
      side: 'south',
      offset: 500,
      width: 800,
      height: 2100,
      sill: 0,
      swing: 'left-in',
      to: 'corridor',
    },
  ],
  designs: single({
    theme: 'An internal bathroom, so everything that can be pale is pale',
    style: 'warm-minimal',
    floor: {
      name: 'Porcelain, 300 × 600, laid to a linear drain',
      colour: '#d9d2c8',
      pattern: 'tile',
      module: 300,
    },
    summary:
      'No external wall, which decides most of it: mechanical extraction, and no dark surfaces anywhere. The shower takes the north-west corner because that is the only 900 mm square the room has; the basin goes on the north wall beside it, and the WC on the east, which is the one position the door can swing fully open past.',
    furniture: [
      placed(0, 0, {
        id: 'shower',
        name: 'Shower enclosure',
        kind: 'sanitary',
        width: 900,
        depth: 900,
        height: 2000,
        symbol: 'shower',
        status: 'planned',
        material: 'Clear glass, no frame, tiled floor to a linear drain',
      }),
      placed(1250, 0, {
        id: 'basin',
        name: 'Washbasin',
        kind: 'sanitary',
        width: 600,
        depth: 450,
        height: 850,
        symbol: 'basin',
        status: 'planned',
        material: 'Wall-hung, oak drawer under',
      }),
      placed(1500, 1200, {
        id: 'wc',
        name: 'WC',
        kind: 'sanitary',
        width: 380,
        depth: 700,
        height: 800,
        symbol: 'wc',
        status: 'planned',
        material: 'Wall-hung pan, concealed cistern',
      }),
    ],
    openQuestions: [
      'A concealed cistern needs 200 mm of duct behind the pan, which the 1.9 m width has to give up. Drawn without it for now.',
    ],
  }),
};
