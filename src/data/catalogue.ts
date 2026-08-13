import { placed } from '~/lib/geometry';
import type { Clearance, Furniture, FurnitureKind, FurnitureSymbol, Mm } from './types';

/**
 * Every object this site knows the size of, in one place.
 *
 * A room does not state dimensions any more; it names an entry here and says where
 * it goes. That separation is what makes the same sofa the same sofa in two rooms,
 * and it is what a future picker needs: given a room's measurements, the thing to
 * offer is a list of objects whose sizes are already known.
 *
 * Each entry records where its figures came from. `measured` is true only for
 * figures taken from a real object or given by the owner; everything else is a
 * typical size for the type, good enough to plan against and worth confirming
 * against the actual product before anything is bought. The catalogue page lists
 * which is which, so the unconfirmed ones are visible rather than assumed.
 */
export interface CatalogueItem {
  name: string;
  /** What the plan writes on it, when the name is too long for the footprint. */
  short?: string;
  kind: FurnitureKind;
  /** Width across the front, depth front to back, height overall. */
  width: Mm;
  depth: Mm;
  height: Mm;
  symbol?: FurnitureSymbol;
  /** What the type normally needs kept clear. A room may override it. */
  clearance?: Clearance;
  /** Underside height, for anything that hangs on a wall. */
  mountedAt?: Mm;
  material?: string;
  /** True when the figures are from a real object rather than typical for the type. */
  measured: boolean;
  /** Where the figures came from. */
  source: string;
  /** Cut or built to suit the room, so the size here is only a starting point. */
  madeToSize?: boolean;
  note?: string;
  group: CatalogueGroup;
}

export type CatalogueGroup =
  | 'sleeping'
  | 'seating'
  | 'tables'
  | 'storage'
  | 'kitchen'
  | 'bathroom'
  | 'laundry'
  | 'floor';

export const GROUP_LABELS: Record<CatalogueGroup, string> = {
  sleeping: 'Sleeping',
  seating: 'Seating',
  tables: 'Tables and desks',
  storage: 'Storage',
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  laundry: 'Laundry',
  floor: 'Floor and planting',
};

const TYPICAL = 'Typical for the type — confirm against the product before ordering';
const OWNER = 'Given by the owner';

export const CATALOGUE = {
  // ── Sleeping ──────────────────────────────────────────────────────────────
  'sleeping-bag-toddler': {
    name: 'Toddler sleeping bag',
    kind: 'bed',
    width: 700,
    depth: 1400,
    height: 200,
    measured: true,
    source: OWNER,
    material: 'Laid straight on the mat, folded away by day',
    note: 'Opened out. Suits a child up to about four, after which a duvet starts sliding off a floor mattress with nothing to tuck under.',
    group: 'sleeping',
  },
  cot: {
    name: 'Cot',
    kind: 'bed',
    width: 1240,
    depth: 660,
    height: 950,
    clearance: { north: 700 },
    measured: false,
    source: TYPICAL,
    material: 'Drop side',
    note: 'The 700 mm clearance is what it takes to bend over a cot rail and lift a child out without twisting.',
    group: 'sleeping',
  },
  'bed-single': {
    name: 'Single bed',
    kind: 'bed',
    width: 1050,
    depth: 2000,
    height: 850,
    measured: false,
    source: TYPICAL,
    material: 'Drawers under',
    group: 'sleeping',
  },
  'bed-double': {
    name: 'Double bed',
    kind: 'bed',
    width: 1500,
    depth: 2000,
    height: 950,
    measured: false,
    source: TYPICAL,
    material: 'Low headboard',
    group: 'sleeping',
  },
  'sofa-bed': {
    name: 'Sofa bed',
    kind: 'sofa',
    width: 1900,
    depth: 900,
    height: 780,
    measured: false,
    source: TYPICAL,
    note: 'Folded. Opened out it needs roughly 1900 by 1900, which is a separate thing to check.',
    group: 'sleeping',
  },

  // ── Seating ───────────────────────────────────────────────────────────────
  'sofa-three-seat': {
    name: 'Three-seat sofa',
    kind: 'sofa',
    width: 2180,
    depth: 950,
    height: 830,
    clearance: { south: 800 },
    measured: false,
    source: TYPICAL,
    group: 'seating',
  },
  'floor-cushion': {
    name: 'Floor cushion',
    short: 'Cushion',
    kind: 'armchair',
    width: 600,
    depth: 600,
    height: 400,
    measured: false,
    source: TYPICAL,
    material: 'Washable cover',
    note: 'For an adult to sit at child height.',
    group: 'seating',
  },
  'chair-toddler': {
    name: 'Toddler chair',
    short: 'Chair',
    kind: 'chair',
    width: 300,
    depth: 300,
    height: 560,
    measured: false,
    source: TYPICAL,
    material: '280 mm seat',
    note: 'A 280 mm seat is the height a two-year-old gets onto unaided, which is what decides whether a table gets used.',
    group: 'seating',
  },
  'chair-dining': {
    name: 'Dining chair',
    short: 'Chair',
    kind: 'chair',
    width: 450,
    depth: 450,
    height: 810,
    measured: false,
    source: TYPICAL,
    group: 'seating',
  },
  'chair-desk': {
    name: 'Desk chair',
    short: 'Chair',
    kind: 'chair',
    width: 450,
    depth: 450,
    height: 820,
    measured: false,
    source: TYPICAL,
    group: 'seating',
  },
  'chair-desk-large': {
    name: 'Desk chair, wide',
    short: 'Chair',
    kind: 'chair',
    width: 550,
    depth: 550,
    height: 900,
    measured: false,
    source: TYPICAL,
    group: 'seating',
  },

  // ── Tables and desks ──────────────────────────────────────────────────────
  'table-play-toddler': {
    name: 'Toddler play table',
    short: 'Play table',
    kind: 'table',
    width: 700,
    depth: 500,
    height: 480,
    clearance: { north: 400, south: 400 },
    measured: false,
    source: TYPICAL,
    material: 'Rounded corners, wipeable top',
    note: 'A 480 mm top pairs with a 280 mm seat. Sized for two children opposite each other.',
    group: 'tables',
  },
  'table-coffee': {
    name: 'Coffee table',
    kind: 'table',
    width: 1100,
    depth: 600,
    height: 400,
    measured: false,
    source: TYPICAL,
    group: 'tables',
  },
  'table-dining-1200': {
    name: 'Dining table, 1200',
    short: 'Dining table',
    kind: 'table',
    width: 1200,
    depth: 750,
    height: 740,
    measured: false,
    source: TYPICAL,
    note: 'Seats four at a squeeze, three comfortably if one side is against a wall.',
    group: 'tables',
  },
  'desk-1100': {
    name: 'Desk, 1100',
    short: 'Desk',
    kind: 'desk',
    width: 1100,
    depth: 600,
    height: 740,
    clearance: { south: 750 },
    measured: false,
    source: TYPICAL,
    note: 'A 740 mm top passes under a sill at 900, so it can go against a window rather than blocking it.',
    group: 'tables',
  },
  'desk-1200': {
    name: 'Desk, 1200',
    short: 'Desk',
    kind: 'desk',
    width: 1200,
    depth: 600,
    height: 740,
    clearance: { south: 750 },
    measured: false,
    source: TYPICAL,
    group: 'tables',
  },
  'desk-1600': {
    name: 'Desk, 1600',
    short: 'Desk',
    kind: 'desk',
    width: 1600,
    depth: 700,
    height: 740,
    clearance: { north: 900 },
    measured: false,
    source: TYPICAL,
    group: 'tables',
  },

  // ── Storage ───────────────────────────────────────────────────────────────
  'cupboard-bedding': {
    name: 'Bedding cupboard',
    short: 'Bedding',
    kind: 'wardrobe',
    width: 900,
    depth: 600,
    height: 1350,
    clearance: { south: 900 },
    measured: false,
    source: TYPICAL,
    material: 'Two doors, soft-close',
    note: '600 mm deep takes two floor mattresses folded in three. Kept to 1350 mm so an adult reaches the top and a toddler cannot climb it.',
    group: 'storage',
  },
  'shelving-book-display': {
    name: 'Picture book display',
    short: 'Picture books',
    kind: 'shelving',
    width: 800,
    depth: 300,
    height: 700,
    clearance: { south: 500 },
    measured: false,
    source: TYPICAL,
    material: 'Sloped front-facing shelves',
    note: 'Covers face out, top shelf at 700 mm: a small child chooses a book by its picture and only from a shelf they can reach.',
    group: 'storage',
  },
  'shelving-toy-bins': {
    name: 'Low toy bins',
    short: 'Toys',
    kind: 'shelving',
    width: 900,
    depth: 400,
    height: 600,
    clearance: { south: 500 },
    measured: false,
    source: TYPICAL,
    material: 'Open frame, four canvas bins',
    note: 'Open bins rather than a lidded chest: no lid to drop on fingers, and a child can put things away without help.',
    group: 'storage',
  },
  'wardrobe-1200': {
    name: 'Wardrobe, 1200',
    short: 'Wardrobe',
    kind: 'wardrobe',
    width: 1200,
    depth: 600,
    height: 2100,
    clearance: { south: 900 },
    measured: false,
    source: TYPICAL,
    note: 'Hinged doors. Sliding doors save the 900 mm and cost you reaching half the rail.',
    group: 'storage',
  },
  'wardrobe-2400': {
    name: 'Wardrobe run, 2400',
    short: 'Wardrobe',
    kind: 'wardrobe',
    width: 2400,
    depth: 600,
    height: 2400,
    clearance: { south: 900 },
    measured: false,
    source: TYPICAL,
    material: 'Fitted, doors to the ceiling',
    group: 'storage',
  },
  'sideboard-1100': {
    name: 'Sideboard, 1100',
    short: 'Sideboard',
    kind: 'sideboard',
    width: 1100,
    depth: 400,
    height: 800,
    measured: false,
    source: TYPICAL,
    group: 'storage',
  },
  'console-1800': {
    name: 'Low console, 1800',
    short: 'Console',
    kind: 'sideboard',
    width: 1800,
    depth: 400,
    height: 500,
    measured: false,
    source: TYPICAL,
    note: '400 mm deep, which is what keeps a walkway past it over a metre.',
    group: 'storage',
  },
  'bedside-table': {
    name: 'Bedside table',
    short: 'Bedside',
    kind: 'sideboard',
    width: 450,
    depth: 400,
    height: 550,
    measured: false,
    source: TYPICAL,
    group: 'storage',
  },
  'shelving-open-1200': {
    name: 'Open shelving, 1200',
    short: 'Shelving',
    kind: 'shelving',
    width: 1200,
    depth: 350,
    height: 2000,
    measured: false,
    source: TYPICAL,
    material: 'Five shelves',
    group: 'storage',
  },
  'shelving-tall-800': {
    name: 'Tall shelving, 800',
    short: 'Shelving',
    kind: 'shelving',
    width: 800,
    depth: 300,
    height: 2000,
    measured: false,
    source: TYPICAL,
    material: 'Four shelves, wall-fixed',
    group: 'storage',
  },
  'shelves-wall-1200': {
    name: 'Wall shelves, 1200',
    short: 'Shelves',
    kind: 'shelving',
    width: 1200,
    depth: 250,
    height: 250,
    mountedAt: 1200,
    measured: false,
    source: TYPICAL,
    material: 'Two boards, wall-fixed',
    note: 'Takes no floor, which is what a narrow room wants. A leaf sweeps the full height of its door, so check it clears any door swinging near it.',
    group: 'storage',
  },

  // ── Kitchen ───────────────────────────────────────────────────────────────
  'counter-run': {
    name: 'Worktop run',
    short: 'Worktop',
    kind: 'counter',
    width: 3000,
    depth: 600,
    height: 900,
    measured: false,
    source: TYPICAL,
    madeToSize: true,
    material: 'Quartz top, drawers under',
    note: 'Length is cut to the wall it goes on. Two runs facing each other want 1000 to 1200 mm between them.',
    group: 'kitchen',
  },
  'fridge-freezer': {
    name: 'Fridge-freezer',
    short: 'Fridge',
    kind: 'appliance',
    width: 700,
    depth: 700,
    height: 1800,
    measured: false,
    source: TYPICAL,
    note: '700 deep against a 600 worktop, so it stands 100 mm proud unless it is housed.',
    group: 'kitchen',
  },

  // ── Bathroom ──────────────────────────────────────────────────────────────
  'shower-900': {
    name: 'Shower enclosure, 900',
    short: 'Shower',
    kind: 'sanitary',
    width: 900,
    depth: 900,
    height: 2000,
    symbol: 'shower',
    measured: false,
    source: TYPICAL,
    material: 'Frameless glass, tiled floor to a linear drain',
    group: 'bathroom',
  },
  'washbasin-600': {
    name: 'Washbasin, 600',
    short: 'Basin',
    kind: 'sanitary',
    width: 600,
    depth: 450,
    height: 850,
    symbol: 'basin',
    measured: false,
    source: TYPICAL,
    material: 'Wall-hung, drawer under',
    group: 'bathroom',
  },
  'wc-wall-hung': {
    name: 'WC, wall-hung',
    short: 'WC',
    kind: 'sanitary',
    width: 380,
    depth: 700,
    height: 800,
    symbol: 'wc',
    measured: false,
    source: TYPICAL,
    material: 'Concealed cistern',
    note: 'A concealed cistern wants 200 mm of duct behind the pan, which has to come out of the room.',
    group: 'bathroom',
  },

  // ── Laundry ───────────────────────────────────────────────────────────────
  'washing-machine': {
    name: 'Washing machine',
    short: 'Washer',
    kind: 'appliance',
    width: 600,
    depth: 600,
    height: 850,
    symbol: 'drum',
    measured: false,
    source: TYPICAL,
    group: 'laundry',
  },
  'dryer-stacked': {
    name: 'Dryer, stacked',
    short: 'Dryer',
    kind: 'appliance',
    width: 600,
    depth: 600,
    height: 850,
    mountedAt: 900,
    measured: false,
    source: TYPICAL,
    note: 'Sits on the washer on a stacking kit, so its footprint is the washer’s.',
    group: 'laundry',
  },
  'drying-rack-ceiling': {
    name: 'Ceiling drying rack',
    short: 'Drying rack',
    kind: 'appliance',
    width: 1200,
    depth: 300,
    height: 300,
    mountedAt: 1900,
    measured: false,
    source: TYPICAL,
    note: 'Hung from the soffit and pulled down to load, so it takes no floor at all.',
    group: 'laundry',
  },

  // ── Floor and planting ────────────────────────────────────────────────────
  'floor-mat': {
    name: 'Washable floor mat',
    short: 'Mat',
    kind: 'rug',
    width: 2000,
    depth: 1500,
    height: 25,
    measured: false,
    source: TYPICAL,
    madeToSize: true,
    material: 'One piece rather than interlocking tiles',
    note: 'Cut to the room. One piece has no seams for crumbs and no tiles for a toddler to lift, at the cost of needing two people to lift it to dry.',
    group: 'floor',
  },
  'rug-flatweave': {
    name: 'Flatweave rug',
    short: 'Rug',
    kind: 'rug',
    width: 2400,
    depth: 1700,
    height: 8,
    measured: false,
    source: TYPICAL,
    material: 'Undyed wool',
    group: 'floor',
  },
  'planter-tall': {
    name: 'Tall planter',
    short: 'Planter',
    kind: 'plant',
    width: 400,
    depth: 400,
    height: 1200,
    measured: false,
    source: TYPICAL,
    group: 'floor',
  },
} satisfies Record<string, CatalogueItem>;

export type CatalogueId = keyof typeof CATALOGUE;

export const CATALOGUE_IDS = Object.keys(CATALOGUE) as CatalogueId[];

/**
 * Reading straight out of CATALOGUE gives the literal type of that one entry, which
 * does not carry the optional fields the entry happens not to use. Anything walking
 * the whole list wants them all, so it comes through here.
 */
export const catalogueItem = (id: CatalogueId): CatalogueItem => CATALOGUE[id];

/**
 * Puts a catalogue object in a room. x and y are the north-west corner of the floor
 * it ends up covering, as everywhere else, and anything room-specific — its colour,
 * whether it is owned yet, why it is where it is — is given as an override.
 *
 * The instance id defaults to the catalogue id, which is right until a room wants two
 * of the same thing; then each needs an id of its own, because the checks tell pieces
 * apart by it.
 */
export function fromCatalogue(
  ref: CatalogueId,
  x: Mm,
  y: Mm,
  overrides: Partial<Omit<Furniture, 'x' | 'y'>> = {},
): Furniture {
  const item: CatalogueItem = CATALOGUE[ref];
  return placed(x, y, {
    id: ref,
    from: ref,
    name: item.name,
    kind: item.kind,
    width: item.width,
    depth: item.depth,
    height: item.height,
    ...(item.short !== undefined && { short: item.short }),
    ...(item.symbol !== undefined && { symbol: item.symbol }),
    ...(item.clearance !== undefined && { clearance: item.clearance }),
    ...(item.mountedAt !== undefined && { mountedAt: item.mountedAt }),
    ...(item.material !== undefined && { material: item.material }),
    source: item.source,
    ...overrides,
  });
}
