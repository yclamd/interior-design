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
  macaron: {
    key: 'macaron',
    name: 'Macaron',
    premise:
      'Colour used as a way of finding things rather than as decoration, and pitched low enough that it does not shout. Each large object gets one flat pastel of its own — mint, butter, lavender, pistachio — over milk tea and pale birch. The chroma is the point: at this strength the colours still tell one child’s belongings from the other’s, which a two-year-old can use years before they can read a label, and they still leave a plain background for the toys and books that are the actual colour in the room.',
    palette: {
      wall: '#fbf8f3',
      floor: '#d5bfa3',
      furniture: '#ecdcc4',
      accent: '#f4b6ae',
      textile: '#f6e2a3',
      metal: '#f2f0ec',
    },
    materials: [
      'Birch ply',
      'Washable foam mat, milk tea',
      'Water-based paint, matt pastels',
      'Cotton canvas bins',
      'Rounded edges throughout',
    ],
  },
  slate: {
    key: 'slate',
    name: 'Slate and linen',
    premise:
      'The one cool room in the set. Blue-grey upholstery and grey-washed timber against the same warm boards as everywhere else, which is the whole trick: the floor stays where it is and the furniture stops agreeing with it, so the pieces read as objects placed in a room rather than as more of the room.',
    palette: {
      wall: '#eceef0',
      floor: '#cdd2d4',
      furniture: '#9a9d9c',
      accent: '#3d5566',
      textile: '#8f9aa6',
      metal: '#5c646a',
    },
    materials: ['Grey-washed oak', 'Linen, undyed', 'Blued steel', 'Honed limestone', 'Wool felt'],
  },
  sage: {
    key: 'sage',
    name: 'Sage and oak',
    premise:
      'Green as the neutral. A sage sofa is the one colour that never argues with a timber floor, because it is the colour of what the timber grew as, and it lets the oak stay plain instead of having to carry the room on its own.',
    palette: {
      wall: '#eef0ea',
      floor: '#d9d7c4',
      furniture: '#b59b74',
      accent: '#4e6350',
      textile: '#9fae95',
      metal: '#6e7a68',
    },
    materials: ['White oak', 'Sage wool', 'Clay plaster', 'Antique bronze', 'Rush matting'],
  },
  terracotta: {
    key: 'terracotta',
    name: 'Terracotta',
    premise:
      'Warm, and admitting it. Clay upholstery and a redder timber, pitched to be the warmest thing in the flat rather than a beige a shade off the floor. It suits the rooms with the least daylight, because it is the one style that does not need any to look like a decision.',
    palette: {
      wall: '#f4ece5',
      floor: '#e0cdbb',
      furniture: '#b0805a',
      accent: '#9c4f35',
      textile: '#c98d72',
      metal: '#8a5f43',
    },
    materials: ['Iroko', 'Terracotta tile', 'Brushed copper', 'Cotton canvas', 'Lime wash'],
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

/** Warm neutrals first, then the three that are not, then the two darkest. */
export const STYLE_ORDER: StyleKey[] = [
  'japandi',
  'warm-minimal',
  'muji',
  'macaron',
  'sage',
  'slate',
  'terracotta',
  'mid-century',
  'industrial',
  'classic',
];

export const styleOf = (key: StyleKey): StylePreset => STYLES[key];
