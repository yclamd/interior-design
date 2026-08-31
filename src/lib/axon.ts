import type { Mm, Point } from '~/data/types';
import type { Footprint, Solid } from './model';
import { PLAN_COLOURS } from './plan';

/**
 * The model, seen from above and to one side.
 *
 * A plan is the right drawing for deciding where things go and the wrong one for showing
 * somebody what a room will feel like: it takes training to read a doorway as a doorway
 * and a 950 mm bed as something you can sit on. So the solids are drawn again in
 * axonometric — the same data, projected rather than photographed.
 *
 * Deliberately not WebGL. This is arithmetic that produces an SVG, which means it renders
 * on the server, needs no runtime, works with scripting off, prints, and can be checked by
 * looking at a file. A viewer that has to be driven by hand to find out whether it drew
 * the right thing is a viewer nobody can verify.
 *
 * Walls are cut at eye level rather than drawn full height. A room modelled to the ceiling
 * and seen from outside is six opaque faces; cutting the walls is what makes it a room you
 * can look into, and it is what every dollhouse view does for the same reason.
 */

/** True isometric: equal foreshortening on all three axes. */
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

/**
 * Where a point in the model lands on the sheet.
 *
 * The viewer stands beyond the south-east corner and above it, so x and y both increase
 * towards the eye and height rises up the sheet.
 */
export const project = (x: Mm, y: Mm, z: Mm): Point => ({
  x: (x - y) * COS30,
  y: (x + y) * SIN30 - z,
});

/** Faces the eye can see from there: the top, and the east and south sides. */
type Face = 'top' | 'east' | 'south';

/**
 * How much light a face takes. The top is open to the sky, the south face takes a raking
 * light and the east face is turned away from it. Three values, not a lighting model:
 * enough to tell one plane from another, which is all an axonometric needs to read.
 */
const SHADE: Record<Face, number> = { top: 1, south: 0.84, east: 0.66 };

const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

/** Multiplies a hex colour, so one palette entry gives a lit and a shaded face. */
function shade(colour: string, by: number): string {
  const hex = colour.replace('#', '');
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex;
  const r = clamp(parseInt(full.slice(0, 2), 16) * by);
  const g = clamp(parseInt(full.slice(2, 4), 16) * by);
  const b = clamp(parseInt(full.slice(4, 6), 16) * by);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** The footprint as a ring of points, whichever way it was given. */
function ringOf(footprint: Footprint): Point[] {
  if (footprint.kind === 'prism') return footprint.points;
  const { x, y, width, depth } = footprint;
  return [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + depth },
    { x, y: y + depth },
  ];
}

/** Turns a footprint about its own centre, as the plan does. */
function turned(ring: Point[], rotation: number): Point[] {
  if (!rotation) return ring;
  const cx = ring.reduce((sum, p) => sum + p.x, 0) / ring.length;
  const cy = ring.reduce((sum, p) => sum + p.y, 0) / ring.length;
  const angle = (rotation * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return ring.map((p) => ({
    x: cx + (p.x - cx) * cos - (p.y - cy) * sin,
    y: cy + (p.x - cx) * sin + (p.y - cy) * cos,
  }));
}

const polygon = (points: Point[]): string =>
  points.map((p) => `${Math.round(p.x)},${Math.round(p.y)}`).join(' ');

interface Piece {
  /** Farther from the eye sorts first, so nearer things are drawn over it. */
  depth: number;
  svg: string;
}

export interface AxonOptions {
  /**
   * Where the walls are sliced.
   *
   * At this elevation a wall hides about one and a half times its own height of floor
   * behind it, so the figure is not a stylistic choice: much above waist height and the
   * rooms disappear behind their own partitions. 800 leaves a sofa's back and a bed just
   * clearing the cut, which is what makes the pieces read as furniture rather than as
   * blocks on a plan.
   */
  cut?: Mm;
  /** Nominal width in pixels, used only to keep stroke weights proportionate. */
  nominalWidth?: number;
  /** Drawn behind everything, so the sheet matches the plans. */
  background?: boolean;
}

export interface AxonRender {
  body: string;
  viewBox: string;
}

/**
 * Draws the solids.
 *
 * Painter's algorithm on the sum of x and y: from this eye, that sum is distance, so
 * sorting by it and drawing in order puts near things over far ones. Boxes in a room do
 * not interpenetrate, so nothing needs splitting.
 */
export function axonSvg(solids: Solid[], options: AxonOptions = {}): AxonRender {
  const { cut = 800, nominalWidth = 900, background = true } = options;

  /**
   * The floors, kept to answer one question: is there a room on the far side of this wall
   * face? Cutting the walls low is not enough on its own — the building's own south and
   * east skin still stands between the eye and everything behind it, so a flat comes out
   * as two long blank walls with rooms hiding behind them.
   *
   * Dropping every face that turns towards the eye would take the partitions with it, and
   * a partition's eye-facing side is the far wall of the room in front of it, which is
   * exactly what there is to see. So the test is whether the face has floor behind it: an
   * interior face does and is kept, the outside of the building does not and goes.
   */
  const floors = solids
    .filter((solid) => solid.role === 'floor')
    .map((solid) => {
      const ring = turned(ringOf(solid.footprint), solid.rotation ?? 0);
      const xs = ring.map((p) => p.x);
      const ys = ring.map((p) => p.y);
      return {
        x0: Math.min(...xs),
        x1: Math.max(...xs),
        y0: Math.min(...ys),
        y1: Math.max(...ys),
      };
    });

  /** A shade under a wall's thickness, so a point just past a face lands in the next room. */
  const PEEK: Mm = 60;

  const roomBehind = (point: Point): boolean =>
    floors.some(
      (floor) =>
        point.x > floor.x0 && point.x < floor.x1 && point.y > floor.y0 && point.y < floor.y1,
    );

  const pieces: Piece[] = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const see = (point: Point) => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  };

  for (const solid of solids) {
    /** A ceiling is the one surface that can only ever be in the way. */
    if (solid.role === 'ceiling') continue;

    const sliced = solid.role === 'wall' || solid.role === 'glazing';
    const top = sliced ? Math.min(solid.top, cut) : solid.top;
    if (top <= solid.base) continue;

    const ring = turned(ringOf(solid.footprint), solid.rotation ?? 0);
    const lid = ring.map((p) => project(p.x, p.y, top));
    const fill = solid.colour;
    const opacity = solid.opacity ?? 1;
    const faces: string[] = [];

    /**
     * A side is drawn when it faces the eye. Both x and y increase towards it, so an edge
     * is visible when it runs the other way round the ring than the hidden edges do — which
     * for a ring wound clockwise in plan means testing the edge's outward normal against
     * the view direction, and for the axis-aligned case reduces to east and south.
     */
    for (let i = 0; i < ring.length; i += 1) {
      const a = ring[i]!;
      const b = ring[(i + 1) % ring.length]!;
      /** Outward normal of a clockwise ring in a y-down plan. */
      const normal = { x: b.y - a.y, y: -(b.x - a.x) };
      const towardsEye = normal.x + normal.y;
      if (towardsEye <= 0) continue;

      if (solid.role === 'wall') {
        const run = Math.hypot(normal.x, normal.y) || 1;
        const outside = {
          x: (a.x + b.x) / 2 + (normal.x / run) * PEEK,
          y: (a.y + b.y) / 2 + (normal.y / run) * PEEK,
        };
        /** The outside of the building, turned towards the eye: nothing to see through it. */
        if (!roomBehind(outside)) continue;
      }

      const wall = [
        project(a.x, a.y, top),
        project(b.x, b.y, top),
        project(b.x, b.y, solid.base),
        project(a.x, a.y, solid.base),
      ];
      wall.forEach(see);
      /** East-facing sides get the deeper shade; south-facing ones the lighter. */
      const face: Face = Math.abs(normal.x) >= Math.abs(normal.y) ? 'east' : 'south';
      faces.push(
        `<polygon points="${polygon(wall)}" fill="${shade(fill, SHADE[face])}" fill-opacity="${opacity}"/>`,
      );
    }

    lid.forEach(see);
    faces.push(
      `<polygon points="${polygon(lid)}" fill="${shade(fill, SHADE.top)}" fill-opacity="${opacity}"/>`,
    );

    /** The centre of the footprint, which is a stable stand-in for the whole box. */
    const cx = ring.reduce((sum, p) => sum + p.x, 0) / ring.length;
    const cy = ring.reduce((sum, p) => sum + p.y, 0) / ring.length;

    pieces.push({
      depth: cx + cy + solid.base * 0.001,
      svg: faces.join(''),
    });
  }

  pieces.sort((a, b) => a.depth - b.depth);

  const pad = Math.max(200, (maxX - minX) * 0.04);
  const box = {
    x: minX - pad,
    y: minY - pad,
    width: maxX - minX + pad * 2,
    depth: maxY - minY + pad * 2,
  };
  const hairline = (box.width / nominalWidth) * 0.5;

  const body =
    (background
      ? `<rect x="${Math.round(box.x)}" y="${Math.round(box.y)}" width="${Math.round(box.width)}" height="${Math.round(box.depth)}" fill="${PLAN_COLOURS.sheet}"/>`
      : '') +
    /**
     * One hairline over the whole drawing rather than per face. Every face carries the
     * same thin edge, which is what keeps a pale wall meeting a pale floor legible without
     * outlining each box into a diagram.
     */
    `<g stroke="${PLAN_COLOURS.structureEdge}" stroke-opacity="0.35" stroke-width="${hairline.toFixed(1)}" stroke-linejoin="round">` +
    pieces.map((piece) => piece.svg).join('') +
    `</g>`;

  return {
    body,
    viewBox: `${Math.round(box.x)} ${Math.round(box.y)} ${Math.round(box.width)} ${Math.round(box.depth)}`,
  };
}
