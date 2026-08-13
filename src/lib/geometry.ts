import type { Box, Design, Furniture, Mm, Opening, Point, Project, Room, Side } from '~/data/types';

/** Square metres in one ping, the unit floor area is sold in locally. */
export const SQM_PER_PING = 3.305785;

export const mmToM = (mm: Mm): number => mm / 1000;

/** 2450 -> "2.45 m". Lengths are quoted in metres once they pass a metre. */
export function formatLength(mm: Mm): string {
  if (Math.abs(mm) < 1000) return `${mm} mm`;
  const m = mm / 1000;
  return `${m.toFixed(m % 1 === 0 ? 0 : 2)} m`;
}

/** Square millimetres in, square metres out. */
export function formatArea(mm2: number): string {
  return `${(mm2 / 1_000_000).toFixed(2)} m²`;
}

export function formatPing(mm2: number): string {
  return `${(mm2 / 1_000_000 / SQM_PER_PING).toFixed(2)} ping`;
}

export const rectPoints = (width: Mm, depth: Mm): Point[] => [
  { x: 0, y: 0 },
  { x: width, y: 0 },
  { x: width, y: depth },
  { x: 0, y: depth },
];

/** A room's outline in its own coordinates, whichever way its shape was given. */
export function outlineOf(room: Room): Point[] {
  return room.shape.kind === 'rect'
    ? rectPoints(room.shape.width, room.shape.depth)
    : room.shape.points;
}

/** The same outline placed in the shared plan space. */
export function outlineInPlan(room: Room): Point[] {
  return outlineOf(room).map((p) => ({ x: p.x + room.origin.x, y: p.y + room.origin.y }));
}

export function bbox(points: Point[]): Box {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, depth: Math.max(...ys) - y };
}

export function mergeBoxes(boxes: Box[]): Box {
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  const right = Math.max(...boxes.map((b) => b.x + b.width));
  const bottom = Math.max(...boxes.map((b) => b.y + b.depth));
  return { x, y, width: right - x, depth: bottom - y };
}

export function boxCorners(box: Box): Point[] {
  return [
    { x: box.x, y: box.y },
    { x: box.x + box.width, y: box.y },
    { x: box.x + box.width, y: box.y + box.depth },
    { x: box.x, y: box.y + box.depth },
  ];
}

export function grow(box: Box, by: Mm): Box {
  return { x: box.x - by, y: box.y - by, width: box.width + by * 2, depth: box.depth + by * 2 };
}

/** Shoelace area in square millimetres. */
export function polygonArea(points: Point[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i]!;
    const b = points[(i + 1) % points.length]!;
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum) / 2;
}

export function centroid(points: Point[]): Point {
  const n = points.length;
  return {
    x: points.reduce((s, p) => s + p.x, 0) / n,
    y: points.reduce((s, p) => s + p.y, 0) / n,
  };
}

export const pathOf = (points: Point[]): string =>
  `${points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${round(p.x)} ${round(p.y)}`).join(' ')} Z`;

export const round = (n: number): number => Math.round(n * 10) / 10;

/**
 * Clockwise on screen, which is what SVG's own rotate() does, so a footprint's
 * corners computed here land exactly where the browser draws the piece.
 */
export function rotatePoint(p: Point, about: Point, degrees: number): Point {
  if (degrees === 0) return p;
  const t = (degrees * Math.PI) / 180;
  const cos = Math.cos(t);
  const sin = Math.sin(t);
  const dx = p.x - about.x;
  const dy = p.y - about.y;
  return { x: about.x + dx * cos - dy * sin, y: about.y + dx * sin + dy * cos };
}

export const footprintOf = (item: Furniture): Box => ({
  x: item.x,
  y: item.y,
  width: item.width,
  depth: item.depth,
});

/** The four corners a piece actually occupies, rotation included. */
export function cornersOf(item: Furniture): Point[] {
  const box = footprintOf(item);
  const about = { x: box.x + box.width / 2, y: box.y + box.depth / 2 };
  return boxCorners(box).map((p) => rotatePoint(p, about, item.rotation ?? 0));
}

/**
 * The strip a piece needs kept clear on each face it asks for one, as polygons
 * in room coordinates, rotated with the piece so a wardrobe turned to face east
 * asks for its standing room to the east.
 */
export function clearanceZonesOf(item: Furniture): { side: Side; polygon: Point[]; depth: Mm }[] {
  const clearance = item.clearance;
  if (!clearance) return [];
  const box = footprintOf(item);
  const about = { x: box.x + box.width / 2, y: box.y + box.depth / 2 };
  const strips: { side: Side; box: Box; depth: Mm }[] = [];

  if (clearance.north)
    strips.push({
      side: 'north',
      depth: clearance.north,
      box: { x: box.x, y: box.y - clearance.north, width: box.width, depth: clearance.north },
    });
  if (clearance.south)
    strips.push({
      side: 'south',
      depth: clearance.south,
      box: { x: box.x, y: box.y + box.depth, width: box.width, depth: clearance.south },
    });
  if (clearance.west)
    strips.push({
      side: 'west',
      depth: clearance.west,
      box: { x: box.x - clearance.west, y: box.y, width: clearance.west, depth: box.depth },
    });
  if (clearance.east)
    strips.push({
      side: 'east',
      depth: clearance.east,
      box: { x: box.x + box.width, y: box.y, width: clearance.east, depth: box.depth },
    });

  return strips.map((strip) => ({
    side: strip.side,
    depth: strip.depth,
    polygon: boxCorners(strip.box).map((p) => rotatePoint(p, about, item.rotation ?? 0)),
  }));
}

/**
 * Separating-axis test. Both arguments must be convex, which every footprint and
 * clearance strip here is.
 */
export function polygonsOverlap(a: Point[], b: Point[]): boolean {
  for (const polygon of [a, b]) {
    for (let i = 0; i < polygon.length; i += 1) {
      const p = polygon[i]!;
      const q = polygon[(i + 1) % polygon.length]!;
      const axis = { x: -(q.y - p.y), y: q.x - p.x };
      const spanA = project(a, axis);
      const spanB = project(b, axis);
      if (spanA.max <= spanB.min + EPSILON || spanB.max <= spanA.min + EPSILON) return false;
    }
  }
  return true;
}

/** Square millimetres of overlap, which is worth reporting when there is any. */
export function overlapArea(a: Point[], b: Point[]): number {
  const clipped = clip(a, b);
  return clipped.length < 3 ? 0 : polygonArea(clipped);
}

const EPSILON = 1;

function project(polygon: Point[], axis: Point): { min: number; max: number } {
  const values = polygon.map((p) => p.x * axis.x + p.y * axis.y);
  return { min: Math.min(...values), max: Math.max(...values) };
}

/** Sutherland–Hodgman, for convex clip windows. */
function clip(subject: Point[], window: Point[]): Point[] {
  let output = subject;
  for (let i = 0; i < window.length && output.length > 0; i += 1) {
    const a = window[i]!;
    const b = window[(i + 1) % window.length]!;
    const inside = (p: Point) => (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x) >= 0;
    const next: Point[] = [];
    for (let j = 0; j < output.length; j += 1) {
      const current = output[j]!;
      const previous = output[(j + output.length - 1) % output.length]!;
      if (inside(current)) {
        if (!inside(previous)) next.push(intersect(previous, current, a, b));
        next.push(current);
      } else if (inside(previous)) {
        next.push(intersect(previous, current, a, b));
      }
    }
    output = next;
  }
  return output;
}

function intersect(p1: Point, p2: Point, p3: Point, p4: Point): Point {
  const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
  if (d === 0) return p1;
  const t = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
  return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
}

export function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i]!;
    const b = polygon[j]!;
    const straddles = a.y > point.y !== b.y > point.y;
    if (straddles && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

/**
 * Where an opening sits, as the two ends of its gap in room coordinates. Offsets
 * run west-to-east on the north and south walls and north-to-south on the other
 * two, so a figure taken with a tape held against the wall goes straight in.
 */
export function openingSegment(room: Room, opening: Opening): { a: Point; b: Point } {
  const box = bbox(outlineOf(room));
  const { offset, width } = opening;
  switch (opening.side) {
    case 'north':
      return { a: { x: box.x + offset, y: box.y }, b: { x: box.x + offset + width, y: box.y } };
    case 'south':
      return {
        a: { x: box.x + offset, y: box.y + box.depth },
        b: { x: box.x + offset + width, y: box.y + box.depth },
      };
    case 'west':
      return { a: { x: box.x, y: box.y + offset }, b: { x: box.x, y: box.y + offset + width } };
    case 'east':
      return {
        a: { x: box.x + box.width, y: box.y + offset },
        b: { x: box.x + box.width, y: box.y + offset + width },
      };
  }
}

/** Unit vector pointing out of the room through the given wall. */
export function outwardNormal(side: Side): Point {
  switch (side) {
    case 'north':
      return { x: 0, y: -1 };
    case 'south':
      return { x: 0, y: 1 };
    case 'west':
      return { x: -1, y: 0 };
    case 'east':
      return { x: 1, y: 0 };
  }
}

/**
 * The quarter-disc a swinging leaf sweeps, approximated by the triangle through
 * its ends. A triangle is enough for the overlap tests and keeps every shape in
 * the model convex.
 */
export function swingZone(room: Room, opening: Opening): Point[] | null {
  if (opening.kind !== 'door-swing' || !opening.swing) return null;
  const { a, b } = openingSegment(room, opening);
  const [hinge, leaf] = opening.swing.startsWith('left') ? [a, b] : [b, a];
  const into = opening.swing.endsWith('-in');
  const normal = outwardNormal(opening.side);
  const sign = into ? -1 : 1;
  const radius = opening.width;
  const swept = {
    x: hinge.x + sign * normal.x * radius,
    y: hinge.y + sign * normal.y * radius,
  };
  return [hinge, leaf, swept];
}

/**
 * Places a piece by the north-west corner of the floor it ends up covering,
 * rather than by the corner its unrotated footprint would have had. A tape
 * measure produces the former, so that is what the dataset is written in, and
 * this works back to the anchor the renderer and the overlap tests need.
 *
 * Only right-angle rotations can be expressed this way; anything else has to
 * give its anchor directly, which is why the rotation is asserted here.
 */
export function placed(
  x: Mm,
  y: Mm,
  spec: Omit<Furniture, 'x' | 'y'>,
): Furniture {
  const rotation = spec.rotation ?? 0;
  if (rotation % 90 !== 0) {
    throw new Error(
      `${spec.id}: placed() takes right-angle rotations only; give x and y directly for ${rotation}°.`,
    );
  }
  const turned = Math.abs(rotation / 90) % 2 === 1;
  const occupiedWidth = turned ? spec.depth : spec.width;
  const occupiedDepth = turned ? spec.width : spec.depth;
  return {
    ...spec,
    x: x + occupiedWidth / 2 - spec.width / 2,
    y: y + occupiedDepth / 2 - spec.depth / 2,
  };
}

export const roomArea = (room: Room): number => polygonArea(outlineOf(room));

/** Floor actually stood on, so a rug and a wall-hung cupboard do not count. */
export const footprintArea = (design: Design): number =>
  design.furniture
    .filter((item) => item.mountedAt === undefined && item.kind !== 'rug')
    .reduce((sum, item) => sum + item.width * item.depth, 0);

/**
 * The building outline. Stated when the real one is known, and otherwise taken as
 * the rooms grown by an exterior wall — which is exactly right for a single room,
 * and right for any plan whose perimeter follows its rooms.
 */
export function envelopeOf(project: Project, rooms: Room[]): Point[] {
  if (project.envelope) return project.envelope;
  const outer = grow(mergeBoxes(rooms.map((room) => bbox(outlineInPlan(room)))), project.walls.exterior);
  return boxCorners(outer);
}
