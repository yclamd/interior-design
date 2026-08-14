import type {
  Box,
  Design,
  Furniture,
  Mm,
  Opening,
  Point,
  Project,
  Room,
  StylePreset,
} from '~/data/types';
import { STYLES } from '~/data/styles';
import {
  bbox,
  centroid,
  cornersOf,
  envelopeOf,
  footprintPoints,
  grow,
  mergeBoxes,
  openingSegment,
  outlineInPlan,
  outwardNormal,
  pathOf,
  pointInPolygon,
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
  /**
   * Cut walls are filled almost black — poché, in the drawing convention. A plan is
   * read first as the shape of its walls, and a wall the colour of a pale floor makes
   * the reader hunt for the layout. The earlier warm grey was honest about the wall
   * being a solid and still lost every argument with the timber next to it.
   */
  structure: '#33322f',
  structureEdge: '#22211f',
  sheet: '#f7f4ee',
  ink: '#2b2f36',
  inkSoft: '#6b7280',
  /**
   * Muted rather than the near-teal it was. Dimensions have to be findable without
   * becoming the brightest thing on a warm drawing, and they were winning.
   */
  dimension: '#4a5b58',
  glazing: '#8fb4d0',
  /**
   * Dark enough to read over a warm floor. An ochre close to the timber colours
   * disappeared on any room with an oiled parquet in it.
   */
  clearance: '#7a4410',
  focusEdge: '#15181d',
  /** Boards, tile joints, and weave: the floor's own lines, not the drawing's. */
  floorLine: '#6b5e4c',
  /** What a piece of furniture casts, so it sits on the floor rather than in it. */
  shadow: '#3a332a',
  /** Planting, which is green on every plan ever drawn and should not take a style's word for it. */
  foliage: '#7d9070',
  /**
   * Two materials a style has no say in. A washing machine and an oven are dark grey
   * whatever the room is meant to look like, and sanitary ware is white. Colouring
   * them from the palette made a plan in which every object was the same timber, and
   * a drawing where everything is one material is a drawing you cannot skim.
   */
  appliance: '#4c4a47',
  sanitary: '#f1eee9',
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

/**
 * What the whole-project view has to fit.
 *
 * The envelope alone is not enough. A slab projecting outside a window is part of the
 * building and is not inside its walls, so a stated envelope does not contain it and
 * framing on the envelope cropped it off the east edge of the drawing. A drawing may
 * decide what to emphasise; it may not silently leave a room out.
 */
export const projectBox = (project: Project, rooms: Room[]): Box =>
  mergeBoxes([bbox(envelopeOf(project, rooms)), roomsBox(rooms)]);

export const roomsBox = (rooms: Room[]): Box =>
  mergeBoxes(rooms.map((room) => bbox(outlineInPlan(room))));

/** A room's own outline, placed in the project's plan space and ready for a path. */
export function roomPath(room: Room): string {
  return pathOf(outlineInPlan(room));
}

export function roomFill(design: Design): string {
  return design.floor.colour ?? STYLES[design.style].palette.floor;
}

const distanceToSegment = (p: Point, a: Point, b: Point): number => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
};

/**
 * Where a room's name goes: the most open floor it has.
 *
 * The centre of a room is the obvious place for its name and frequently the worst,
 * because the centre of a room is where the table is. Written there the name needs a
 * panel behind it to stay readable, and a panel over the one piece of furniture the
 * room is arranged around hides the arrangement. So the name is put where there is
 * actually nothing: the point furthest from both the furniture and the walls, pulled
 * gently back towards the middle so that an empty room still reads as labelled in
 * the middle rather than in an arbitrary corner.
 */
export function labelPoint(outline: Point[], obstacles: Box[]): Point {
  const box = bbox(outline);
  const middle = centroid(outline);
  const steps = 26;
  const reach = Math.min(box.width, box.depth);
  /**
   * A name written over a chair is untidy; one written over a wall is wrong, because
   * the wall belongs to two rooms and the name to one. So clearance from the walls is
   * a condition to be met and clearance from the furniture is only preferred, and a
   * small room crowded with fittings takes the name over a fitting rather than over
   * its own wall. Enough for a line of type at the sizes used here.
   */
  const margin = Math.min(260, reach * 0.22);
  let best = middle;
  let bestScore = -Infinity;

  for (let i = 0; i <= steps; i += 1) {
    for (let j = 0; j <= steps; j += 1) {
      const point = {
        x: box.x + (box.width * i) / steps,
        y: box.y + (box.depth * j) / steps,
      };
      if (!pointInPolygon(point, outline)) continue;

      let fromWall = reach;
      for (let k = 0; k < outline.length; k += 1) {
        fromWall = Math.min(
          fromWall,
          distanceToSegment(point, outline[k]!, outline[(k + 1) % outline.length]!),
        );
      }
      if (fromWall < margin) continue;

      let clear = reach;
      for (const o of obstacles) {
        const dx = Math.max(o.x - point.x, 0, point.x - (o.x + o.width));
        const dy = Math.max(o.y - point.y, 0, point.y - (o.y + o.depth));
        clear = Math.min(clear, Math.hypot(dx, dy));
      }

      const score = clear - Math.hypot(point.x - middle.x, point.y - middle.y) * 0.35;
      if (score > bestScore) {
        bestScore = score;
        best = point;
      }
    }
  }
  return best;
}

/** A floor's material, resolved into what has to be drawn to show it. */
export interface FloorRender {
  colour: string;
  pattern: 'plank' | 'tile' | 'weave' | 'none';
  /** One tile of the repeat, in millimetres, ready for patternUnits="userSpaceOnUse". */
  tile: { width: Mm; height: Mm };
  /**
   * The material's own lines within one tile of the repeat, split by weight. A board
   * floor is the clearest case for the split: its long seams run unbroken and its end
   * joints are short and few, and drawing both at one weight is what turns a timber
   * floor into brickwork.
   */
  lines: string[];
  faint: string[];
  opacity: number;
}

/**
 * Boards default to 190 mm — a common engineered-oak width — and tiles to 600 mm,
 * so a floor named but not otherwise specified still draws at a believable module.
 */
const FLOOR_MODULE = { plank: 190, tile: 600, weave: 90, none: 0 } as const;

export function floorRender(design: Design): FloorRender {
  const colour = roomFill(design);
  const pattern = design.floor.pattern ?? 'none';
  const module = design.floor.module ?? FLOOR_MODULE[pattern];
  /** Boards run along the room unless the floor says otherwise. */
  const across = (design.floor.grain ?? 'ew') === 'ew';

  if (pattern === 'plank') {
    /**
     * Two courses per repeat, with the end joints of the second offset by half a
     * board: a running bond, which is how boards are actually laid. One course per
     * repeat would line every joint up into a grid and read as tile.
     *
     * The boards are 12 modules long — about 2.3 m, a plausible plank — and their end
     * joints are drawn faint. Short boards with strong ends read as a masonry floor,
     * which is the mistake this length and weighting exist to avoid.
     */
    const run = module * 12;
    const tile = across ? { width: run, height: module * 2 } : { width: module * 2, height: run };
    const seam = (at: Mm) => (across ? `M 0 ${at} H ${run}` : `M ${at} 0 V ${run}`);
    const end = (at: Mm, from: Mm, to: Mm) =>
      across ? `M ${at} ${from} V ${to}` : `M ${from} ${at} H ${to}`;
    return {
      colour,
      pattern,
      tile,
      lines: [seam(0), seam(module)],
      faint: [end(0, 0, module), end(run / 2, module, module * 2)],
      opacity: 0.28,
    };
  }

  if (pattern === 'tile') {
    /** Both joints at one weight, because a tile floor's grid really is square. */
    const tile = { width: module, height: module };
    return {
      colour,
      pattern,
      tile,
      lines: [`M 0 0 H ${module}`, `M 0 0 V ${module}`],
      faint: [],
      opacity: 0.32,
    };
  }

  if (pattern === 'weave') {
    /** A mat: fine lines both ways, closer together than any floor material. */
    const tile = { width: module, height: module };
    return {
      colour,
      pattern,
      tile,
      lines: [`M 0 0 H ${module}`, `M 0 0 V ${module}`],
      faint: [],
      opacity: 0.22,
    };
  }

  return {
    colour,
    pattern: 'none',
    tile: { width: 0, height: 0 },
    lines: [],
    faint: [],
    opacity: 0,
  };
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
}

/**
 * What a piece is made of, which is what decides its colour. Upholstery takes the
 * style's textile and casework its timber, so naming a style still changes the
 * drawing; appliances and sanitary ware take neither, because they are not
 * negotiable. A piece may still override all of this with its own colour.
 */
function materialFill(kind: Furniture['kind'], palette: StylePreset['palette']): string {
  switch (kind) {
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
      fill: item.colour ?? materialFill(item.kind, palette),
      stroke: PLAN_COLOURS.ink,
      mounted: item.mountedAt !== undefined,
      height: item.height,
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
