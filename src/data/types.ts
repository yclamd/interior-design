/**
 * The vocabulary the whole site is drawn from.
 *
 * Two rules hold everywhere in the dataset:
 *
 * 1. Every length is an integer number of millimetres. Tape measures read in
 *    millimetres and furniture is specified in them, so keeping the dataset in
 *    the same unit means no figure on the site is ever a rounded version of a
 *    rounded version. Square metres and pings are derived at render time.
 *
 * 2. There is one plan coordinate space for the whole home: x runs right, y runs
 *    down, and the origin is the north-west corner of the building envelope. A
 *    room's own geometry is written relative to that room's origin, because that
 *    is what a person with a tape measure can actually produce, and the renderer
 *    translates it into the shared space.
 */

/** Millimetres. */
export type Mm = number;

export interface Point {
  x: Mm;
  y: Mm;
}

/** A room-local footprint: position of its north-west corner, and its extent. */
export interface Box {
  x: Mm;
  y: Mm;
  width: Mm;
  depth: Mm;
}

export type RoomKind =
  | 'living'
  | 'dining'
  | 'kitchen'
  | 'bedroom'
  | 'study'
  | 'bathroom'
  | 'entry'
  | 'corridor'
  | 'balcony'
  | 'utility'
  | 'storage';

/**
 * A room's shape. Rectangles cover almost every room in a flat, so they get a
 * form anyone can fill in from two measurements; anything else is traced as a
 * polygon in room-local coordinates, clockwise, along the inner face of the
 * walls.
 */
export type RoomShape =
  | { kind: 'rect'; width: Mm; depth: Mm }
  | { kind: 'polygon'; points: Point[] };

/** Which face of a room's bounding box something sits on. */
export type Side = 'north' | 'east' | 'south' | 'west';

export type OpeningKind =
  | 'door-swing'
  | 'door-sliding'
  | 'door-pocket'
  | 'door-folding'
  | 'door-french'
  | 'window'
  | 'window-floor'
  | 'opening';

/**
 * Which way a swing door's leaf travels, described as it is seen standing in the
 * room the opening is listed under: the hinge side first, then whether the leaf
 * swings into this room or away from it.
 */
export type Swing = 'left-in' | 'left-out' | 'right-in' | 'right-out';

export interface Opening {
  id: string;
  kind: OpeningKind;
  /** The wall it sits in. */
  side: Side;
  /**
   * Distance along that wall to the opening's near edge, measured from the
   * room's west end on north and south walls, and from its north end on east
   * and west walls.
   */
  offset: Mm;
  width: Mm;
  height: Mm;
  /** Floor to the underside. Zero for doors and floor-to-ceiling glazing. */
  sill: Mm;
  swing?: Swing;
  /** Room id on the far side, or a label such as 'outside' or 'stairs'. */
  to?: string;
  note?: string;
}

export type FurnitureKind =
  | 'bed'
  | 'sofa'
  | 'armchair'
  | 'chair'
  | 'table'
  | 'desk'
  | 'sideboard'
  | 'wardrobe'
  | 'shelving'
  | 'counter'
  | 'appliance'
  | 'sanitary'
  | 'rug'
  | 'plant'
  | 'lighting';

export type FurnitureStatus = 'owned' | 'ordered' | 'planned' | 'considering';

/**
 * Overrides the glyph drawn inside a piece's footprint, for the fittings whose
 * plan symbol is conventional and carries more than a rectangle would.
 */
export type FurnitureSymbol = 'wc' | 'basin' | 'shower' | 'tub' | 'sink' | 'hob' | 'drum';

/**
 * Space a piece needs in front of it to be usable — a drawer's travel, a chair
 * pushed back, the room to stand and open a wardrobe. Given per face because a
 * wardrobe needs 900 mm at its doors and nothing at its back.
 */
export interface Clearance {
  north?: Mm;
  east?: Mm;
  south?: Mm;
  west?: Mm;
}

export interface Furniture {
  id: string;
  name: string;
  kind: FurnitureKind;
  /** Footprint before rotation: width along x, depth along y. */
  width: Mm;
  depth: Mm;
  /** Overall height off the floor. Used to judge what a piece blocks. */
  height: Mm;
  /** North-west corner of the unrotated footprint, in room-local coordinates. */
  x: Mm;
  y: Mm;
  /** Degrees clockwise about the footprint's centre. Usually 0, 90, 180 or 270. */
  rotation?: number;
  clearance?: Clearance;
  symbol?: FurnitureSymbol;
  /** Height of the underside for a wall-hung piece; omitted when floor-standing. */
  mountedAt?: Mm;
  status?: FurnitureStatus;
  material?: string;
  /** Hex, used to colour the piece in the plan. Falls back to the room's style. */
  colour?: string;
  /** Where it came from, or what it is standing in for until it is chosen. */
  source?: string;
  note?: string;
}

export type StyleKey =
  | 'japandi'
  | 'warm-minimal'
  | 'mid-century'
  | 'muji'
  | 'industrial'
  | 'classic';

/**
 * A style is a palette plus a short list of materials. Both the swatches on the
 * style page and the fills in the plans read from here, so changing a room's
 * style restyles its drawing.
 */
export interface StylePreset {
  key: StyleKey;
  name: string;
  /** One sentence on what the style is actually asking of a room. */
  premise: string;
  palette: {
    wall: string;
    floor: string;
    /** Fill for furniture that has no colour of its own. */
    furniture: string;
    accent: string;
    textile: string;
    metal: string;
  };
  materials: string[];
}

export interface FloorFinish {
  name: string;
  /** Hex used as the room's floor fill, overriding the style's. */
  colour?: string;
  note?: string;
}

export interface Room {
  /** URL slug, and the id other rooms refer to across an opening. */
  id: string;
  name: string;
  kind: RoomKind;
  /** The room's north-west corner in the shared plan space. */
  origin: Point;
  shape: RoomShape;
  /** Clear floor to ceiling. */
  ceiling: Mm;
  /** What the room is for, in the owner's words. Shown as the room's premise. */
  theme: string;
  style: StyleKey;
  floor: FloorFinish;
  openings: Opening[];
  furniture: Furniture[];
  /** A paragraph on how the room is meant to work. */
  summary: string;
  /** Decisions still open, printed as-is so they are not quietly forgotten. */
  openQuestions?: string[];
}

export interface Home {
  name: string;
  /** Where it is, as much as is worth publishing. */
  location: string;
  /**
   * Compass bearing in degrees of the plan's up direction, so the north arrow
   * points where north actually is. 0 means plan-up is true north.
   */
  northOffset: number;
  /** Outer face of the building envelope, in the shared plan space. */
  envelope: Point[];
  walls: {
    exterior: Mm;
    interior: Mm;
  };
  /** Applies to any room that does not state its own. */
  ceiling: Mm;
  style: StyleKey;
  /** The brief for the home as a whole. */
  premise: string;
  /**
   * Registered floor area from the deed, in square millimetres' worth of
   * square metres — kept as a number of m² because that is how it is published,
   * and shown next to the area the drawing measures so the two can disagree
   * honestly.
   */
  registeredArea?: number;
}
