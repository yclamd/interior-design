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
 * 2. Each project has one plan coordinate space: x runs right, y runs down, and the
 *    origin is the north-west corner of the building. A room's own geometry is
 *    written relative to that room's origin, because that is what a person with a
 *    tape measure can actually produce, and the renderer translates it into the
 *    project's space. Nothing is ever compared across projects, so two projects
 *    may reuse room ids without either knowing about the other.
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
  /**
   * What the plan calls it, when the full name is too long to sit inside the piece.
   * The schedule always uses the full name.
   */
  short?: string;
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
  | 'classic'
  | 'macaron';

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

/**
 * One way of fitting out a room. A room always has at least one, and may have
 * several to be compared.
 *
 * The split between this and the room it belongs to is the split between what is
 * true of the space and what has been decided about it. Walls, ceiling height and
 * doorways are facts; the sofa, the palette and the argument for them are not.
 * Keeping them apart is what lets two designs be drawn against the same room
 * without either of them claiming to have moved a wall — and it is why comparing
 * designs needs no change to the check that rooms do not overlap, since the room
 * they share is still one room.
 */
export interface Design {
  /** URL slug within the room. */
  id: string;
  /** How this option is referred to: 'Low and open', 'Option B', 'As built'. */
  name: string;
  /** What this design is trying to do that the others are not. */
  theme: string;
  /** A paragraph on how it is meant to work. */
  summary: string;
  style: StyleKey;
  floor: FloorFinish;
  furniture: Furniture[];
  /** Decisions still open, printed as-is so they are not quietly forgotten. */
  openQuestions?: string[];
  /** Drawn wherever a page has to pick one. The first design is used if none says so. */
  preferred?: boolean;
}

export interface Room {
  /** URL slug, and the id other rooms refer to across an opening. Unique within a project. */
  id: string;
  name: string;
  kind: RoomKind;
  /** The room's north-west corner in the project's plan space. */
  origin: Point;
  shape: RoomShape;
  /** Clear floor to ceiling. */
  ceiling: Mm;
  /**
   * Doorways belong to the room and not to a design, because an opening is shared
   * with whatever is on the other side of it and both sides are checked against
   * each other. Comparing two positions for a door is a second project, not a
   * second design.
   */
  openings: Opening[];
  /** At least one. Use single() for a room with nothing to compare. */
  designs: Design[];
}

/**
 * A design job: a whole dwelling, one floor of one, or a single room. There is no
 * separate shape for the single-room case — it is a project whose room list has one
 * entry, and only the overview page reads differently.
 */
export interface Project {
  /** URL slug. */
  id: string;
  name: string;
  /** Where it is, as much as is worth publishing. */
  location: string;
  /** What kind of job this is, for the reader. The pages key off the room count. */
  scope: 'home' | 'floor' | 'room';
  /**
   * Compass bearing in degrees of the plan's up direction, so the north arrow
   * points where north actually is. 0 means plan-up is true north.
   */
  northOffset: number;
  /**
   * Outer face of the building, in the project's plan space. Optional: left out,
   * it is taken as the rooms' outlines grown by the exterior wall thickness, which
   * is right for a single room and for any rectangular plan. State it only when
   * the real outline differs — a building that is not a rectangle, or a deed
   * drawing to hold the plan against. A figure that can be computed should not be
   * a second figure that can disagree with the first.
   */
  envelope?: Point[];
  walls: {
    exterior: Mm;
    interior: Mm;
  };
  /** Applies to any room that does not state its own. */
  ceiling: Mm;
  style: StyleKey;
  /** The brief for the job as a whole. */
  premise: string;
  /**
   * Registered floor area from the deed, in square metres because that is how it
   * is published. Shown next to the area the drawing measures, so the two can
   * disagree honestly.
   */
  registeredArea?: number;
}

/** Wraps a room's only design, so the common case stays short to write. */
export function single(
  design: Omit<Design, 'id' | 'name' | 'preferred'> & Partial<Pick<Design, 'id' | 'name'>>,
): Design[] {
  return [{ id: 'as-drawn', name: 'As drawn', preferred: true, ...design }];
}

/** The design a page draws when it has not been told which. */
export const preferredDesign = (room: Room): Design =>
  room.designs.find((design) => design.preferred) ?? room.designs[0]!;

export const designById = (room: Room, id: string): Design | undefined =>
  room.designs.find((design) => design.id === id);
