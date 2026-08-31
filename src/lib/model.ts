import type { Design, Furniture, Mm, Opening, Point, Project, Room } from '~/data/types';
import { preferredDesign } from '~/data/types';
import { STYLES } from '~/data/styles';
import { bbox, cornersOf, footprintPoints, openingSegment, outlineInPlan } from './geometry';
import { PLAN_COLOURS, roomFill, wallSegments } from './plan';

/**
 * The dataset as solids, so it can be walked through rather than only looked at.
 *
 * Nothing here is measured that was not measured already. Every room states its ceiling,
 * every opening its height and sill, every catalogue object its height — so the third
 * dimension is not new information, it is information the drawings were throwing away.
 * That is the whole argument for building it this way: extruded from the same data, a
 * model cannot disagree with a plan, and neither can be updated without the other.
 *
 * It deliberately stops at massing. Boxes at true sizes in true positions answer the
 * questions a plan cannot — whether a ceiling presses down, whether a sofa back cuts off
 * a window, what a room looks like from a two-year-old's eye height — and answer them
 * honestly. A photoreal render answers them beautifully and sometimes wrongly, because
 * the camera moves and the sofa in the picture is whichever model was to hand. This
 * project already has the thing renders lack; it should not pretend to the thing they
 * have.
 *
 * Coordinates stay in the plan's: x runs east, y runs south, and height is separate, so
 * that any figure here can be read against the dataset directly. Turning that into a
 * renderer's axes is the renderer's job and is done in one place.
 */

export type SolidRole = 'wall' | 'floor' | 'ceiling' | 'furniture' | 'glazing';

export type Footprint =
  | { kind: 'box'; x: Mm; y: Mm; width: Mm; depth: Mm }
  | { kind: 'prism'; points: Point[] };

export interface Solid {
  id: string;
  role: SolidRole;
  /** Which room it belongs to, so a viewer can isolate or label one. */
  room: string;
  footprint: Footprint;
  /** Height band, with the room's floor at zero. */
  base: Mm;
  top: Mm;
  /** Degrees clockwise about the footprint's centre, as in the plan. */
  rotation?: number;
  colour: string;
  /** Below one for glass. */
  opacity?: number;
}

/** Slab thickness under a floor, so a room reads as standing on something. */
const SLAB: Mm = 120;
/** How thick a glazed screen is, matching the plan's own figure. */
const SCREEN: Mm = 80;
/** Shorter than this and a piece of wall is a modelling artefact rather than a wall. */
const SLIVER: Mm = 20;

const key = (footprint: Footprint, base: Mm, top: Mm): string =>
  footprint.kind === 'box'
    ? `${footprint.x}:${footprint.y}:${footprint.width}:${footprint.depth}:${base}:${top}`
    : `${footprint.points.map((p) => `${p.x},${p.y}`).join('|')}:${base}:${top}`;

/**
 * Whether a wall runs east–west or north–south, and which way is out of the room.
 * Only right-angled walls occur in this dataset, which is what lets a wall be a box.
 */
function orientation(a: Point, b: Point, inside: Point) {
  const horizontal = Math.abs(b.y - a.y) < Math.abs(b.x - a.x);
  if (horizontal) {
    const y = (a.y + b.y) / 2;
    return { horizontal, outward: inside.y > y ? -1 : 1 } as const;
  }
  const x = (a.x + b.x) / 2;
  return { horizontal, outward: inside.x > x ? -1 : 1 } as const;
}

/** The opening's extent along its own wall, in plan space. */
function openingSpan(room: Room, opening: Opening) {
  const local = openingSegment(room, opening);
  return {
    a: { x: local.a.x + room.origin.x, y: local.a.y + room.origin.y },
    b: { x: local.b.x + room.origin.x, y: local.b.y + room.origin.y },
  };
}

/**
 * One wall, with its doors and windows taken out of it.
 *
 * A hole is made by splitting rather than by subtracting solids: every opening in this
 * dataset is a rectangle in a straight wall, so the wall becomes the piece to one side,
 * the piece to the other, the sill under the opening and the head over it. That is four
 * boxes and no boolean geometry, and it stays exact.
 */
function wallPieces(
  room: Room,
  segment: { a: Point; b: Point },
  thickness: Mm,
  ceiling: Mm,
  inside: Point,
  colour: string,
  index: number,
): Solid[] {
  const { horizontal, outward } = orientation(segment.a, segment.b, inside);
  const from = horizontal
    ? Math.min(segment.a.x, segment.b.x)
    : Math.min(segment.a.y, segment.b.y);
  const to = horizontal ? Math.max(segment.a.x, segment.b.x) : Math.max(segment.a.y, segment.b.y);
  const face = horizontal ? segment.a.y : segment.a.x;
  const near = outward > 0 ? face : face - thickness;

  const box = (start: Mm, end: Mm): Footprint =>
    horizontal
      ? { kind: 'box', x: start, y: near, width: end - start, depth: thickness }
      : { kind: 'box', x: near, y: start, width: thickness, depth: end - start };

  /** Openings that actually sit on this stretch of wall. */
  const holes = room.openings
    .map((opening) => ({ opening, span: openingSpan(room, opening) }))
    .filter(({ span }) => {
      const onFace = horizontal
        ? Math.abs(span.a.y - face) < 1 && Math.abs(span.b.y - face) < 1
        : Math.abs(span.a.x - face) < 1 && Math.abs(span.b.x - face) < 1;
      if (!onFace) return false;
      const lo = horizontal
        ? Math.min(span.a.x, span.b.x)
        : Math.min(span.a.y, span.b.y);
      const hi = horizontal ? Math.max(span.a.x, span.b.x) : Math.max(span.a.y, span.b.y);
      return hi > from + SLIVER && lo < to - SLIVER;
    })
    .map(({ opening, span }) => ({
      opening,
      lo: Math.max(
        from,
        horizontal ? Math.min(span.a.x, span.b.x) : Math.min(span.a.y, span.b.y),
      ),
      hi: Math.min(to, horizontal ? Math.max(span.a.x, span.b.x) : Math.max(span.a.y, span.b.y)),
    }))
    .sort((one, two) => one.lo - two.lo);

  const solids: Solid[] = [];
  const id = (what: string, n: number) => `${room.id}-wall-${index}-${what}${n}`;

  let cursor = from;
  holes.forEach((hole, n) => {
    if (hole.lo - cursor > SLIVER) {
      solids.push({
        id: id('run', n),
        role: 'wall',
        room: room.id,
        footprint: box(cursor, hole.lo),
        base: 0,
        top: ceiling,
        colour,
      });
    }
    const head = hole.opening.sill + hole.opening.height;
    if (hole.opening.sill > SLIVER) {
      solids.push({
        id: id('sill', n),
        role: 'wall',
        room: room.id,
        footprint: box(hole.lo, hole.hi),
        base: 0,
        top: hole.opening.sill,
        colour,
      });
    }
    if (ceiling - head > SLIVER) {
      solids.push({
        id: id('head', n),
        role: 'wall',
        room: room.id,
        footprint: box(hole.lo, hole.hi),
        base: head,
        top: ceiling,
        colour,
      });
    }
    /** The glass itself, so a window reads as a window rather than as a gap. */
    if (hole.opening.kind.startsWith('window')) {
      solids.push({
        id: id('glass', n),
        role: 'glazing',
        room: room.id,
        footprint: box(hole.lo, hole.hi),
        base: hole.opening.sill,
        top: head,
        colour: PLAN_COLOURS.glazing,
        opacity: 0.28,
      });
    }
    cursor = Math.max(cursor, hole.hi);
  });
  if (to - cursor > SLIVER) {
    solids.push({
      id: id('run', holes.length),
      role: 'wall',
      room: room.id,
      footprint: box(cursor, to),
      base: 0,
      top: ceiling,
      colour,
    });
  }
  return solids;
}

/**
 * Which fill a piece takes, following the plan's own rule so that an object is the same
 * colour in both views.
 */
function furnitureColour(item: Furniture, palette: (typeof STYLES)[keyof typeof STYLES]['palette']) {
  if (item.colour) return item.colour;
  switch (item.kind) {
    case 'bed':
    case 'sofa':
    case 'armchair':
    case 'chair':
    case 'rug':
      return palette.textile;
    case 'appliance':
      return PLAN_COLOURS.appliance;
    case 'sanitary':
      return PLAN_COLOURS.sanitary;
    case 'plant':
      return PLAN_COLOURS.foliage;
    case 'lighting':
      return palette.metal;
    default:
      return palette.furniture;
  }
}

export interface ModelOptions {
  /** Which design to model for a given room. Defaults to the preferred one. */
  designFor?: (room: Room) => Design;
}

export function modelOf(project: Project, rooms: Room[], options: ModelOptions = {}): Solid[] {
  const chosen = options.designFor ?? preferredDesign;
  const solids: Solid[] = [];
  const seen = new Set<string>();

  const push = (solid: Solid) => {
    /**
     * Two rooms either side of one partition each ask for the wall between them, and it
     * is the same wall. Dropping the duplicate here rather than working out which room
     * owns it keeps the rule local: a solid already standing in this space is this space.
     */
    const k = `${solid.role}:${key(solid.footprint, solid.base, solid.top)}`;
    if (seen.has(k)) return;
    seen.add(k);
    solids.push(solid);
  };

  for (const room of rooms) {
    const design = chosen(room);
    const palette = STYLES[design.style].palette;
    const outline = outlineInPlan(room);
    const box = bbox(outline);
    const inside = {
      x: box.x + box.width / 2,
      y: box.y + box.depth / 2,
    };
    const ceiling = room.ceiling;

    push({
      id: `${room.id}-floor`,
      role: 'floor',
      room: room.id,
      footprint: { kind: 'prism', points: outline },
      base: -SLAB,
      top: 0,
      colour: roomFill(design),
    });

    /**
     * A canopy has no ceiling to model — it is outside — and a ceiling on it would put a
     * lid over the one part of the plan that is meant to be open to the sky.
     */
    if (room.kind !== 'canopy' && room.kind !== 'balcony') {
      push({
        id: `${room.id}-ceiling`,
        role: 'ceiling',
        room: room.id,
        footprint: { kind: 'prism', points: outline },
        base: ceiling,
        top: ceiling + SLAB,
        colour: palette.wall,
      });
    }

    wallSegments(room, rooms).forEach((segment, index) => {
      /**
       * A wall is exterior unless a room of this project stands on the other side of it.
       * Judged from the segment's own midpoint, stepped over by the thickness it would
       * have as a partition and asked whether that lands in another room.
       */
      const { horizontal, outward } = orientation(segment.a, segment.b, inside);
      const mid = {
        x: (segment.a.x + segment.b.x) / 2 + (horizontal ? 0 : outward * project.walls.interior * 1.5),
        y: (segment.a.y + segment.b.y) / 2 + (horizontal ? outward * project.walls.interior * 1.5 : 0),
      };
      const neighbour = rooms.some((other) => {
        if (other.id === room.id) return false;
        const b = bbox(outlineInPlan(other));
        return mid.x > b.x && mid.x < b.x + b.width && mid.y > b.y && mid.y < b.y + b.depth;
      });
      const thickness = neighbour ? project.walls.interior : project.walls.exterior;

      for (const piece of wallPieces(
        room,
        segment,
        thickness,
        ceiling,
        inside,
        palette.wall,
        index,
      )) {
        push(piece);
      }
    });

    /** Glazed sides stand on the boundary itself rather than outside it. */
    for (const side of room.glazed ?? []) {
      const east = box.x + box.width;
      const south = box.y + box.depth;
      const footprint: Footprint =
        side === 'north'
          ? { kind: 'box', x: box.x, y: box.y, width: box.width, depth: SCREEN }
          : side === 'south'
            ? { kind: 'box', x: box.x, y: south - SCREEN, width: box.width, depth: SCREEN }
            : side === 'west'
              ? { kind: 'box', x: box.x, y: box.y, width: SCREEN, depth: box.depth }
              : { kind: 'box', x: east - SCREEN, y: box.y, width: SCREEN, depth: box.depth };
      push({
        id: `${room.id}-screen-${side}`,
        role: 'glazing',
        room: room.id,
        footprint,
        base: 0,
        top: ceiling,
        colour: PLAN_COLOURS.glazing,
        opacity: 0.24,
      });
    }

    for (const item of design.furniture) {
      const placed = { ...item, x: item.x + room.origin.x, y: item.y + room.origin.y };
      /**
       * A piece with an outline is modelled from it, so an L-shaped sofa is an L in three
       * dimensions too. The prism is given unrotated and turned by the same angle the plan
       * turns it, which is why the rotation travels with the solid rather than being baked
       * into the points.
       */
      const footprint: Footprint = item.outline
        ? { kind: 'prism', points: footprintPoints({ ...placed, rotation: 0 }) }
        : {
            kind: 'box',
            x: placed.x,
            y: placed.y,
            width: item.width,
            depth: item.depth,
          };
      const base = item.mountedAt ?? 0;
      push({
        id: `${room.id}-${item.id}`,
        role: 'furniture',
        room: room.id,
        footprint,
        base,
        top: base + item.height,
        rotation: item.rotation ?? 0,
        colour: furnitureColour(item, palette),
        ...(item.kind === 'rug' ? { opacity: 0.9 } : {}),
      });
    }
  }

  return solids;
}

/** The extent of a model, for framing a camera on it. */
export function modelBounds(solids: Solid[]) {
  const points = solids.flatMap((solid) =>
    solid.footprint.kind === 'box'
      ? [
          { x: solid.footprint.x, y: solid.footprint.y },
          {
            x: solid.footprint.x + solid.footprint.width,
            y: solid.footprint.y + solid.footprint.depth,
          },
        ]
      : solid.footprint.points,
  );
  const box = bbox(points);
  return {
    ...box,
    base: Math.min(...solids.map((solid) => solid.base)),
    top: Math.max(...solids.map((solid) => solid.top)),
  };
}

/**
 * Eye heights worth standing at.
 *
 * The last one is not a novelty. This flat is being arranged around two children under
 * three, and several of its decisions — what a divider hides, what is climbable, which
 * surfaces are in reach — are claims about what the room is like at 950 mm. There is no
 * other way to check them.
 */
export const EYE_HEIGHTS: { id: string; height: Mm }[] = [
  { id: 'standing', height: 1600 },
  { id: 'seated', height: 1150 },
  { id: 'child', height: 950 },
];

/** Corners of a room, stood in far enough not to be inside the wall. */
export function viewpointsFor(room: Room, inset: Mm = 700): Point[] {
  const box = bbox(outlineInPlan(room));
  const east = box.x + box.width - inset;
  const south = box.y + box.depth - inset;
  return [
    { x: box.x + inset, y: box.y + inset },
    { x: east, y: box.y + inset },
    { x: east, y: south },
    { x: box.x + inset, y: south },
    { x: box.x + box.width / 2, y: box.y + box.depth / 2 },
  ];
}

export { cornersOf };
