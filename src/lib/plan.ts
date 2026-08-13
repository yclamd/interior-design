import type { Box, Design, Furniture, Mm, Opening, Point, Project, Room } from '~/data/types';
import { STYLES } from '~/data/styles';
import {
  bbox,
  cornersOf,
  clearanceZonesOf,
  envelopeOf,
  footprintPoints,
  grow,
  mergeBoxes,
  openingSegment,
  outlineInPlan,
  outwardNormal,
  pathOf,
  rotatePoint,
  round,
  swingZone,
} from './geometry';

/**
 * Turns the dataset into something a plan can be drawn from directly.
 *
 * Two ideas carry the whole drawing. The first is that the SVG user unit is one
 * millimetre, so nothing in the geometry is ever scaled and no figure on the
 * page is a scaled figure read back. The second is that walls are not drawn at
 * all: the building envelope is filled, then every room is filled on top of it,
 * and what is left showing is the wall. Interior partitions therefore come out at
 * exactly the thickness the room origins imply, and can never disagree with them.
 */

export const PLAN_COLOURS = {
  structure: '#b9b0a0',
  structureEdge: '#8d8474',
  sheet: '#f7f4ee',
  ink: '#2b2f36',
  inkSoft: '#6b7280',
  dimension: '#0f5c56',
  glazing: '#7fa8c9',
  /**
   * Dark enough to read over a warm floor. An ochre close to the timber colours
   * disappeared on any room with an oiled parquet in it.
   */
  clearance: '#7a4410',
  focusEdge: '#15181d',
} as const;

export interface PlanFrame {
  viewBox: string;
  box: Box;
  /**
   * Millimetres per rendered pixel at the width the drawing is laid out for.
   * Stroke widths and type sizes are given in pixels and passed through px(),
   * so a hairline stays a hairline whether the frame is one room or the flat.
   */
  mmPerPx: number;
  px: (pixels: number) => number;
}

export function frameFor(box: Box, padding: Mm, nominalWidth = 960): PlanFrame {
  const padded = grow(box, padding);
  const mmPerPx = padded.width / nominalWidth;
  return {
    box: padded,
    viewBox: `${round(padded.x)} ${round(padded.y)} ${round(padded.width)} ${round(padded.depth)}`,
    mmPerPx,
    px: (pixels: number) => pixels * mmPerPx,
  };
}

export const projectBox = (project: Project, rooms: Room[]): Box =>
  bbox(envelopeOf(project, rooms));

export const roomsBox = (rooms: Room[]): Box =>
  mergeBoxes(rooms.map((room) => bbox(outlineInPlan(room))));

/** A room's own outline, placed in the project's plan space and ready for a path. */
export function roomPath(room: Room): string {
  return pathOf(outlineInPlan(room));
}

export function roomFill(design: Design): string {
  return design.floor.colour ?? STYLES[design.style].palette.floor;
}

export interface OpeningRender {
  id: string;
  kind: Opening['kind'];
  label: string;
  /** The hole punched through the wall, in the shared space. */
  gap: string;
  /** Ends of the opening on the room's inner face. */
  a: Point;
  b: Point;
  /** Across-wall direction, pointing out of the room. */
  normal: Point;
  thickness: Mm;
  width: Mm;
  /** Panes for a window, or leaves for a sliding or folding door. */
  leaves: string[];
  /** Fully-open leaf and the arc back to closed, for a swing door. */
  swing?: { leaf: string; arc: string };
  /** Clear floor the leaf sweeps, drawn only when asked for. */
  sweptZone?: string;
}

/**
 * Everything needed to draw one opening.
 *
 * The wall it cuts is a partition only when the room on the far side is drawn in
 * this project; anything else is the perimeter of what is being designed, and gets
 * the exterior thickness. That distinction matters because the hole has to punch
 * all the way through whatever is there: judged by the far side merely not being
 * `outside`, a door from a single-room project to an undrawn hallway would cut
 * 100 mm of a 200 mm wall and leave a sliver of wall lying across the doorway.
 */
export function openingRender(
  project: Project,
  drawnRooms: Set<string>,
  room: Room,
  opening: Opening,
): OpeningRender {
  const local = openingSegment(room, opening);
  const a = { x: local.a.x + room.origin.x, y: local.a.y + room.origin.y };
  const b = { x: local.b.x + room.origin.x, y: local.b.y + room.origin.y };
  const normal = outwardNormal(opening.side);
  const interior = opening.to !== undefined && drawnRooms.has(opening.to);
  const thickness = interior ? project.walls.interior : project.walls.exterior;

  /** Overshoot, so the hole meets the wall it is cut in without a seam. */
  const bleed = 3;
  const inner = -bleed;
  const outer = thickness + bleed;
  const gap = pathOf([
    offset(a, normal, inner),
    offset(b, normal, inner),
    offset(b, normal, outer),
    offset(a, normal, outer),
  ]);

  const along = unit({ x: b.x - a.x, y: b.y - a.y });
  const mid = thickness / 2;
  const leaves: string[] = [];

  if (opening.kind === 'window' || opening.kind === 'window-floor') {
    for (const depth of [mid - thickness * 0.18, mid + thickness * 0.18]) {
      leaves.push(line(offset(a, normal, depth), offset(b, normal, depth)));
    }
  } else if (opening.kind === 'door-sliding' || opening.kind === 'door-pocket') {
    const half = opening.width / 2;
    const panel = thickness * 0.3;
    leaves.push(
      line(offset(a, normal, mid - panel), offset(shift(a, along, half), normal, mid - panel)),
      line(offset(shift(a, along, half * 0.8), normal, mid + panel), offset(b, normal, mid + panel)),
    );
  } else if (opening.kind === 'door-folding') {
    const steps = 4;
    const step = opening.width / steps;
    for (let i = 0; i < steps; i += 1) {
      const from = offset(shift(a, along, step * i), normal, i % 2 === 0 ? 0 : thickness);
      const to = offset(shift(a, along, step * (i + 1)), normal, i % 2 === 0 ? thickness : 0);
      leaves.push(line(from, to));
    }
  } else if (opening.kind === 'opening') {
    for (const end of [a, b]) {
      leaves.push(line(offset(end, normal, 0), offset(end, normal, thickness)));
    }
  }

  const render: OpeningRender = {
    id: opening.id,
    kind: opening.kind,
    label: describe(opening),
    gap,
    a,
    b,
    normal,
    thickness,
    width: opening.width,
    leaves,
  };

  const zone = swingZone(room, opening);
  if (zone && opening.swing) {
    const world = zone.map((p) => ({ x: p.x + room.origin.x, y: p.y + room.origin.y }));
    const [hinge, closed, open] = world as [Point, Point, Point];
    /**
     * The arc runs from the leaf standing open to the leaf shut, around the hinge,
     * so it has to bulge away from the hinge. Which of the two arcs SVG draws is set
     * by the sweep flag, and that follows the turn from open to shut — taken the
     * other way round it draws the arc that curves back towards the hinge, which is
     * not a door.
     */
    const turn =
      (open.x - hinge.x) * (closed.y - hinge.y) - (open.y - hinge.y) * (closed.x - hinge.x);
    render.swing = {
      leaf: line(hinge, open),
      arc: `M ${round(open.x)} ${round(open.y)} A ${opening.width} ${opening.width} 0 0 ${
        turn > 0 ? 1 : 0
      } ${round(closed.x)} ${round(closed.y)}`,
    };
    render.sweptZone = pathOf(world);
  }

  return render;
}

export interface FurnitureRender {
  id: string;
  name: string;
  /** What to write on the drawing, which may be shorter than the name. */
  label: string;
  kind: Furniture['kind'];
  symbol?: Furniture['symbol'];
  /** Explicit carcass divisions, and whether the piece has a cut end. */
  divisions?: Mm[];
  cut: boolean;
  /** Unrotated footprint, already in the shared space. */
  box: Box;
  /**
   * The unrotated footprint as a path — the box, or the piece's own outline where it
   * has one. Drawn inside the rotate below, so a cut corner turns with the piece.
   */
  shape: string;
  /** SVG rotate() arguments, so the symbol turns with the piece. */
  transform: string;
  /** The floor it really covers, for hit areas and labels. */
  corners: string;
  /** Extent of that floor, so a label can be set along the piece's longer side. */
  occupied: Box;
  at: Point;
  fill: string;
  stroke: string;
  mounted: boolean;
  height: Mm;
  clearance: { path: string; depth: Mm }[];
}

export function furnitureRenders(room: Room, design: Design): FurnitureRender[] {
  const palette = STYLES[design.style].palette;
  return design.furniture.map((item) => {
    const box: Box = {
      x: item.x + room.origin.x,
      y: item.y + room.origin.y,
      width: item.width,
      depth: item.depth,
    };
    const centre = { x: box.x + box.width / 2, y: box.y + box.depth / 2 };
    const corners = cornersOf(item).map((p) => ({
      x: p.x + room.origin.x,
      y: p.y + room.origin.y,
    }));
    /**
     * A rug is labelled at a corner rather than its middle, because whatever
     * stands on it would otherwise claim the same point for its own key.
     */
    const anchor =
      item.kind === 'rug'
        ? { x: box.x + item.width * 0.11, y: box.y + item.depth * 0.15 }
        : centre;
    return {
      id: item.id,
      name: item.name,
      label: item.short ?? item.name,
      kind: item.kind,
      symbol: item.symbol,
      ...(item.divisions !== undefined && { divisions: item.divisions }),
      cut: item.outline !== undefined,
      box,
      shape: pathOf(footprintPoints({ ...item, x: box.x, y: box.y })),
      occupied: bbox(corners),
      transform: `rotate(${item.rotation ?? 0} ${round(centre.x)} ${round(centre.y)})`,
      corners: pathOf(corners),
      at: rotatePoint(anchor, centre, item.rotation ?? 0),
      fill: item.colour ?? (item.kind === 'rug' ? palette.textile : palette.furniture),
      stroke: PLAN_COLOURS.ink,
      mounted: item.mountedAt !== undefined,
      height: item.height,
      clearance: clearanceZonesOf(item).map((zone) => ({
        depth: zone.depth,
        path: pathOf(
          zone.polygon.map((p) => ({ x: p.x + room.origin.x, y: p.y + room.origin.y })),
        ),
      })),
    };
  });
}

/** A dimension line with its witness lines and the figure it carries. */
export interface DimensionRender {
  line: string;
  witnesses: string[];
  text: string;
  at: Point;
  vertical: boolean;
}

export function dimension(from: Point, to: Point, offsetBy: Mm, text: string): DimensionRender {
  const vertical = from.x === to.x;
  const normal: Point = vertical ? { x: 1, y: 0 } : { x: 0, y: 1 };
  const a = offset(from, normal, offsetBy);
  const b = offset(to, normal, offsetBy);
  return {
    line: line(a, b),
    witnesses: [
      line(offset(from, normal, offsetBy * 0.15), offset(from, normal, offsetBy * 1.12)),
      line(offset(to, normal, offsetBy * 0.15), offset(to, normal, offsetBy * 1.12)),
    ],
    text,
    at: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    vertical,
  };
}

const offset = (p: Point, normal: Point, by: number): Point => ({
  x: p.x + normal.x * by,
  y: p.y + normal.y * by,
});

const shift = (p: Point, along: Point, by: number): Point => ({
  x: p.x + along.x * by,
  y: p.y + along.y * by,
});

const line = (a: Point, b: Point): string =>
  `M ${round(a.x)} ${round(a.y)} L ${round(b.x)} ${round(b.y)}`;

function unit(v: Point): Point {
  const length = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / length, y: v.y / length };
}

const KIND_WORDS: Record<Opening['kind'], string> = {
  'door-swing': 'door',
  'door-sliding': 'sliding door',
  'door-pocket': 'pocket door',
  'door-folding': 'folding door',
  'door-french': 'french door',
  window: 'window',
  'window-floor': 'full-height window',
  opening: 'cased opening',
};

export const describe = (opening: Opening): string =>
  `${opening.side.charAt(0).toUpperCase()}${opening.side.slice(1)} ${KIND_WORDS[opening.kind]}`;

export const isDoorway = (kind: Opening['kind']): boolean =>
  kind.startsWith('door') || kind === 'opening';
