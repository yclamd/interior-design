import type { StyleKey, StylePreset } from './types';

/**
 * A style here is not a mood board. It is the palette the drawings are coloured
 * from and the short list of materials the room is meant to be built out of, so
 * that naming a style on a room actually changes what you see.
 */
export const STYLES: Record<StyleKey, StylePreset> = {
  japandi: {
    key: 'japandi',
    name: 'Japandi',
    premise:
      'Scandinavian frankness about function, Japanese patience about emptiness. Low furniture, pale wood, and one thing on each surface rather than three.',
    palette: {
      wall: '#efeae1',
      floor: '#dccdb7',
      furniture: '#b99a76',
      accent: '#3f4a45',
      textile: '#cbc4b4',
      metal: '#6f6a61',
    },
    materials: ['White oak', 'Lime plaster', 'Paper and linen', 'Blackened steel', 'Rattan'],
  },
  'warm-minimal': {
    key: 'warm-minimal',
    name: 'Warm minimal',
    premise:
      'Minimal in the count of things, not in temperature. Few pieces, generous ones, and no cold surface left where a hand will land.',
    palette: {
      wall: '#f4efe8',
      floor: '#e0d3c2',
      furniture: '#c8a888',
      accent: '#9a6b4f',
      textile: '#ddd2c3',
      metal: '#9c8f7e',
    },
    materials: ['Ash', 'Micro-cement', 'Bouclé wool', 'Brushed brass', 'Travertine'],
  },
  'mid-century': {
    key: 'mid-century',
    name: 'Mid-century',
    premise:
      'Legs on everything, so the floor runs unbroken under the room. Walnut, tapering profiles, and colour used deliberately instead of apologetically.',
    palette: {
      wall: '#f1ece2',
      floor: '#c9a074',
      furniture: '#8a5a3b',
      accent: '#a8452f',
      textile: '#c7a24a',
      metal: '#8a7345',
    },
    materials: ['Walnut', 'Teak veneer', 'Wool tweed', 'Powder-coated steel', 'Smoked glass'],
  },
  muji: {
    key: 'muji',
    name: 'Muji plain',
    premise:
      'Every piece the same family of pale birch and off-white, sized to fit a module, so the room can be rearranged without anything looking out of place.',
    palette: {
      wall: '#f6f4ef',
      floor: '#e6dcc9',
      furniture: '#cbb794',
      accent: '#7d8a86',
      textile: '#e2ddd2',
      metal: '#a6a29a',
    },
    materials: ['Birch ply', 'Unbleached cotton', 'Steel wire', 'Cork', 'Enamelled tin'],
  },
  industrial: {
    key: 'industrial',
    name: 'Industrial',
    premise:
      'The building left visible. Concrete, dark metal and a lot of one wall material, with wood brought in only where skin touches.',
    palette: {
      wall: '#dedbd6',
      floor: '#b9b4ac',
      furniture: '#6d6a66',
      accent: '#8c4a2f',
      textile: '#8f8b84',
      metal: '#4a4845',
    },
    materials: ['Fair-faced concrete', 'Hot-rolled steel', 'Reclaimed fir', 'Wire glass', 'Leather'],
  },
  playful: {
    key: 'playful',
    name: 'Bright',
    premise:
      'Colour used as a way of finding things rather than as decoration. Pale birch and washable foam carry the room, and each large object gets one strong flat colour of its own — which matters most when the people using it are two, because a child sorts by colour years before they can read a label. Nothing is patterned, so the colour that is there does the work.',
    palette: {
      wall: '#faf7f0',
      floor: '#a9c8be',
      furniture: '#e3cba3',
      accent: '#e2574c',
      textile: '#f2b93b',
      metal: '#f7f7f5',
    },
    materials: [
      'Birch ply',
      'Washable foam mat',
      'Powder-coated steel',
      'Cotton canvas bins',
      'Water-based paint, matt',
    ],
  },
  classic: {
    key: 'classic',
    name: 'Quiet classic',
    premise:
      'Panelled walls and proper proportions, kept from being a period room by plain fabric and no gilt anywhere.',
    palette: {
      wall: '#eeeae4',
      floor: '#b78a5e',
      furniture: '#7d6247',
      accent: '#2f4553',
      textile: '#cfc6b6',
      metal: '#87755a',
    },
    materials: ['Painted MDF panelling', 'Oak parquet', 'Linen', 'Antique brass', 'Marble'],
  },
};

export const STYLE_ORDER: StyleKey[] = [
  'japandi',
  'warm-minimal',
  'muji',
  'playful',
  'mid-century',
  'industrial',
  'classic',
];

export const styleOf = (key: StyleKey): StylePreset => STYLES[key];
