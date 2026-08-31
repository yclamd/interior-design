import type { Box, Mm, Project, Room } from '~/data/types';
import { bbox, grow, outlineInPlan } from './geometry';
import {
  PLAN_COLOURS,
  floorRender,
  frameFor,
  furnitureRenders,
  glazedRenders,
  isDoorway,
  openingRender,
  roomFill,
  roomPath,
  wallBandsPath,
  type FloorRender,
  type FurnitureRender,
  type OpeningRender,
} from './plan';

/**
 * The drawing, as functions that return SVG rather than as components.
 *
 * The site renders its plans on the server and the planner renders one in the browser,
 * and they have to draw a sofa the same way — otherwise the tool that lets somebody
 * arrange a room produces a worse picture than the pages that publish one, and the
 * difference is not a style choice, it is two pieces of code that disagree.
 *
 * So the marks live here, in plain functions with no framework in them, and both sides
 * call the same ones. What each view composes out of them is its own business: a project
 * page draws an envelope, several rooms, dimensions and a compass; the planner draws one
 * room. That difference is composition. How a bed's pillows are set out is not, and it
 * is written once, below.
 *
 * Everything is in millimetres, as everywhere else, and takes the frame's px() so a
 * hairline stays a hairline whether the frame is one room or a whole flat.
 */

type Px = (pixels: number) => number;

const attrs = (pairs: Record<string, string | number | undefined>): string =>
  Object.entries(pairs)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

const tag = (name: string, pairs: Record<string, string | number | undefined>): string =>
  `<${name} ${attrs(pairs)}/>`;

const rect = (
  x: number,
  y: number,
  width: number,
  height: number,
  more: Record<string, string | number | undefined> = {},
): string => tag('rect', { x, y, width, height, ...more });

const circle = (
  cx: number,
  cy: number,
  r: number,
  more: Record<string, string | number | undefined> = {},
): string => tag('circle', { cx, cy, r, ...more });

/** Escapes text that goes between tags, since names come from the dataset. */
export const escapeText = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ── Definitions ───────────────────────────────────────────────────────────── */

/** A floor's material as a pattern, so a room is drawn in boards rather than a fill. */
export function floorPatternSvg(id: string, floor: FloorRender, px: Px): string {
  if (floor.pattern === 'none') return '';
  const width = Math.max(4, px(0.45));
  const faint = floor.faint
    .map((d) => tag('path', { d, 'stroke-opacity': floor.opacity * 0.45 }))
    .join('');
  const lines = floor.lines
    .map((d) => tag('path', { d, 'stroke-opacity': floor.opacity }))
    .join('');
  return (
    `<pattern id="${id}" width="${floor.tile.width}" height="${floor.tile.height}" patternUnits="userSpaceOnUse">` +
    rect(0, 0, floor.tile.width, floor.tile.height, { fill: floor.colour }) +
    `<g fill="none" stroke="${PLAN_COLOURS.floorLine}" stroke-width="${width}">${faint}${lines}</g>` +
    `</pattern>`
  );
}

/**
 * A weave, drawn as lines on nothing and laid over a mat's own colour. One pattern
 * serves every mat in a drawing because it carries no fill, and because it repeats in
 * world space two rectangles of one mat share a continuous weave with no seam.
 */
export function weavePatternSvg(id: string, px: Px): string {
  return (
    `<pattern id="${id}" width="120" height="120" patternUnits="userSpaceOnUse">` +
    `<g fill="none" stroke="${PLAN_COLOURS.shadow}" stroke-opacity="0.14" stroke-width="${Math.max(3, px(0.35))}">` +
    `<path d="M 0 0 H 120"/><path d="M 0 0 V 120"/></g></pattern>`
  );
}

/** What a piece casts, so it sits on the floor rather than in it. */
export function shadowFilterSvg(id: string, px: Px): string {
  return (
    `<filter id="${id}" x="-30%" y="-30%" width="180%" height="180%">` +
    tag('feDropShadow', {
      dx: px(1.4),
      dy: px(2.2),
      stdDeviation: px(1.6),
      'flood-color': PLAN_COLOURS.shadow,
      'flood-opacity': 0.34,
    }) +
    `</filter>`
  );
}

/* ── Furniture ─────────────────────────────────────────────────────────────── */

/**
 * Upholstery is drawn with its corners taken off. Casework and worktops are not: a
 * fitted run really does die square into the wall next to it, and rounding it would
 * draw a gap that is not there. So the radius is a property of what the piece is made
 * of, not a uniform softening of the whole drawing.
 */
const ROUNDING: Partial<Record<FurnitureRender['kind'], Mm>> = {
  sofa: 100,
  armchair: 120,
  chair: 90,
  bed: 70,
};

const CASED = ['wardrobe', 'sideboard', 'shelving', 'counter', 'appliance'];

export interface FurnitureSvgOptions {
  /** Off in a whole-flat view, where the detail would only be noise. */
  detail?: boolean;
  /** Id of the drawing's drop-shadow filter, for pieces that stand on the floor. */
  cast?: string;
  /** Id of the drawing's weave pattern, for mats. */
  weave?: string;
}

/**
 * One piece of furniture.
 *
 * Everything is set out in the piece's unrotated footprint and then turned as a group,
 * so a symbol always faces the way the piece does: a sofa's back stays behind its seat
 * and a bed's pillows stay at its head. Pre-rotation a piece faces south.
 */
export function furnitureSvg(
  item: FurnitureRender,
  px: Px,
  options: FurnitureSvgOptions = {},
): string {
  const { detail = true, cast, weave } = options;
  const { x, y, width, depth } = item.box;

  const hairline = px(0.7);
  const outline = px(item.mounted ? 0.8 : 1.1);
  const inset = Math.min(px(2.6), Math.min(width, depth) * 0.14);
  const short = Math.min(width, depth);
  const front = y + depth;
  const centre = { x: x + width / 2, y: y + depth / 2 };
  const dashed = item.mounted ? `${px(3)} ${px(2)}` : undefined;

  /**
   * A mat lies on the floor and a wall-hung piece stands on nothing, so neither casts.
   * The shadow is what says a piece has a thickness, and one under a rug would say the
   * rug is a step.
   */
  const casts = cast && item.kind !== 'rug' && !item.mounted ? `url(#${cast})` : undefined;

  /**
   * Detail is set out in the bounding box, which is the footprint for everything whose
   * footprint is a rectangle. For a piece with an outline it is not: an L-shaped sofa's
   * box includes the corner it does not occupy, and a cushion was once drawn there, on
   * bare floor. Clipping to the shape means the symbol can never draw upholstery outside
   * the upholstery, whatever the outline turns out to be.
   */
  const clip = item.cut && cast ? `${cast}-clip-${item.id}` : undefined;

  const body: string[] = [];
  if (clip) body.push(`<clipPath id="${clip}"><path d="${item.shape}"/></clipPath>`);

  if (item.kind === 'rug') {
    /**
     * Fill only, with no outline. Dashes on the floor mean a zone to keep clear and a
     * mat is the opposite of that; and an outline puts a seam wherever two rectangles
     * of one mat meet, which is not what the material does.
     */
    body.push(tag('path', { d: item.shape, fill: item.fill, 'fill-opacity': 0.7 }));
    if (weave) body.push(tag('path', { d: item.shape, fill: `url(#${weave})` }));
  } else if (item.kind === 'plant') {
    /**
     * Drawn instead of the footprint rather than over it, so that a plant is its canopy.
     * The footprint is still what the checks use; it is simply not what a plant looks
     * like from above.
     */
    const leaves = Array.from({ length: 7 }, (_, i) => {
      const angle = (i / 7) * Math.PI * 2;
      return circle(
        centre.x + Math.cos(angle) * short * 0.25,
        centre.y + Math.sin(angle) * short * 0.25,
        short * 0.22,
      );
    }).join('');
    body.push(
      `<g fill="${item.fill}" fill-opacity="0.85" stroke="${item.stroke}" stroke-opacity="0.35" stroke-width="${hairline}">` +
        leaves +
        circle(centre.x, centre.y, short * 0.24, { 'fill-opacity': 0.95 }) +
        `</g>`,
    );
  } else {
    const radius = item.cut ? 0 : Math.min(ROUNDING[item.kind] ?? 0, short * 0.32);
    const shared = {
      fill: item.fill,
      'fill-opacity': item.mounted ? 0.3 : 0.92,
      stroke: item.stroke,
      'stroke-opacity': item.mounted ? 0.5 : 0.85,
      'stroke-width': outline,
      'stroke-dasharray': dashed,
    };
    body.push(
      radius > 0
        ? rect(x, y, width, depth, { rx: radius, ...shared })
        : tag('path', { d: item.shape, ...shared }),
    );
  }

  if (detail && !item.mounted) {
    body.push(
      `<g fill="none" stroke="${PLAN_COLOURS.ink}" stroke-opacity="0.55" stroke-width="${hairline}"` +
        (clip ? ` clip-path="url(#${clip})"` : '') +
        `>` +
        detailSvg(item, px, { x, y, width, depth, short, front, centre, inset }) +
        `</g>`,
    );
  }

  return (
    `<g transform="${item.transform}" data-piece="${item.id}"` +
    (casts ? ` filter="${casts}"` : '') +
    `>${body.join('')}</g>`
  );
}

interface Geometry {
  x: number;
  y: number;
  width: number;
  depth: number;
  short: number;
  front: number;
  centre: { x: number; y: number };
  inset: number;
}

function detailSvg(item: FurnitureRender, px: Px, g: Geometry): string {
  const { x, y, width, depth, short, front, centre, inset } = g;
  const parts: string[] = [];
  const glyph = item.symbol;

  if (item.kind === 'bed') {
    /**
     * A made bed, from the head down: pillows, the sheet turned back over the duvet,
     * then the duvet. The turn-back is what tells you which end is the head at a glance,
     * without reading the label.
     */
    const pillow = width >= 1400 ? width / 2 - 120 : width - 160;
    const turn = Math.max(180, depth * 0.15);
    parts.push(
      rect(x + 90, y + 100, pillow, 340, {
        rx: 80,
        fill: PLAN_COLOURS.sheet,
        'fill-opacity': 0.85,
      }),
    );
    if (width >= 1400) {
      parts.push(
        rect(x + width - 90 - pillow, y + 100, pillow, 340, {
          rx: 80,
          fill: PLAN_COLOURS.sheet,
          'fill-opacity': 0.85,
        }),
      );
    }
    parts.push(
      rect(x + 50, y + 520, width - 100, turn, {
        rx: 40,
        fill: PLAN_COLOURS.sheet,
        'fill-opacity': 0.92,
        'stroke-opacity': 0.7,
      }),
      rect(x + 50, y + 520 + turn, width - 100, Math.max(200, depth - 600 - turn), {
        rx: 50,
        fill: PLAN_COLOURS.sheet,
        'fill-opacity': 0.45,
        'stroke-opacity': 0.7,
      }),
    );
  }

  if (item.kind === 'sofa' || item.kind === 'armchair') {
    /**
     * Cushions with gaps between them, not a grid drawn over a block. The gaps are what
     * make it read as upholstery: a back cushion and a seat cushion are two objects, and
     * a single dividing line says they are one.
     */
    const arm = Math.min(150, width * 0.16);
    const back = Math.min(230, depth * 0.28);
    const seats = Math.max(1, Math.round(width / 700));
    parts.push(
      rect(x + 40, y + 40, arm, depth - 80, { rx: 70 }),
      rect(x + width - arm - 40, y + 40, arm, depth - 80, { rx: 70 }),
    );
    const gap = 50;
    const span = (width - arm * 2 - gap * (seats - 1)) / seats;
    for (let i = 0; i < seats; i += 1) {
      const at = x + arm + i * (span + gap);
      parts.push(
        rect(at, y + 40, span, back, { rx: 60 }),
        rect(at, y + back + 90, span, depth - back - 170, { rx: 60 }),
      );
    }
  }

  if (item.kind === 'chair') {
    /** Back at the north edge, seat inside it: enough to see which way it faces. */
    const back = Math.max(80, depth * 0.17);
    parts.push(
      rect(x + 60, y + 50, width - 120, back, { rx: 45 }),
      rect(x + 80, y + back + 90, width - 160, depth - back - 170, { rx: 60 }),
    );
  }

  if ((item.kind === 'table' || item.kind === 'desk') && !item.cut) {
    parts.push(rect(x + inset, y + inset, width - inset * 2, depth - inset * 2));
  }

  if (item.kind === 'table' && !item.cut && short >= 700) {
    /**
     * A runner down the long axis, which is the one mark that separates a dining table
     * from a rectangle at this scale. Only on tables big enough to be dined at: a side
     * table with a stripe across it reads as two objects.
     */
    const wide = width >= depth;
    parts.push(
      rect(
        wide ? x + width * 0.14 : centre.x - short * 0.16,
        wide ? centre.y - short * 0.16 : y + depth * 0.14,
        wide ? width * 0.72 : short * 0.32,
        wide ? short * 0.32 : depth * 0.72,
        { rx: px(1), fill: PLAN_COLOURS.ink, 'fill-opacity': 0.1 },
      ),
    );
  }

  if (item.kind === 'table' && item.cut && Math.abs(width - depth) < 60) {
    /**
     * A round table, the one outline whose bounding box is square. It gets a rim rather
     * than the inset rectangle, whose corners would sit outside the top.
     */
    parts.push(circle(centre.x, centre.y, short * 0.5 - inset));
  }

  if (CASED.includes(item.kind) && !glyph) {
    /**
     * Where the run is divided, along its width. Given by the piece where the joinery is
     * known; otherwise guessed at roughly 600 intervals. A piece with a cut end stops its
     * doors at the last division, because what is past it is a filler panel.
     */
    const even = Math.max(1, Math.round(width / 600));
    const cuts =
      item.divisions ?? Array.from({ length: even - 1 }, (_, i) => (width * (i + 1)) / even);
    const doorRun = item.cut && cuts.length > 0 ? Math.max(...cuts) : width;
    parts.push(tag('path', { d: `M ${x} ${front - inset} L ${x + doorRun} ${front - inset}` }));
    for (const at of cuts) {
      parts.push(tag('path', { d: `M ${x + at} ${y} L ${x + at} ${front}` }));
    }
  }

  if (glyph === 'drum') {
    parts.push(
      circle(centre.x, centre.y, short * 0.3),
      tag('path', { d: `M ${x} ${front - inset} L ${x + width} ${front - inset}` }),
    );
  }
  if (glyph === 'wc') {
    parts.push(
      rect(x, y, width, depth * 0.16),
      tag('ellipse', {
        cx: centre.x,
        cy: y + depth * 0.62,
        rx: width * 0.42,
        ry: depth * 0.32,
        fill: PLAN_COLOURS.sheet,
        'fill-opacity': 0.6,
      }),
    );
  }
  if (glyph === 'basin') {
    parts.push(
      tag('ellipse', {
        cx: centre.x,
        cy: y + depth * 0.55,
        rx: width * 0.36,
        ry: depth * 0.34,
        fill: PLAN_COLOURS.sheet,
        'fill-opacity': 0.6,
      }),
      circle(centre.x, y + depth * 0.14, Math.max(20, depth * 0.06)),
    );
  }
  if (glyph === 'shower') {
    parts.push(
      tag('path', { d: `M ${x} ${y} L ${x + width} ${front}`, 'stroke-opacity': 0.3 }),
      tag('path', { d: `M ${x + width} ${y} L ${x} ${front}`, 'stroke-opacity': 0.3 }),
      circle(centre.x, centre.y, Math.max(25, short * 0.06)),
    );
  }
  if (glyph === 'tub') {
    parts.push(
      rect(x + inset, y + inset, width - inset * 2, depth - inset * 2, {
        rx: Math.min(120, short * 0.2),
      }),
      circle(x + width * 0.16, centre.y, Math.max(25, short * 0.06)),
    );
  }
  if (glyph === 'sink') {
    parts.push(
      rect(x + width * 0.12, y + depth * 0.2, width * 0.5, depth * 0.6, { rx: px(1) }),
      circle(x + width * 0.78, y + depth * 0.3, Math.max(20, depth * 0.07)),
    );
  }
  if (glyph === 'hob') {
    for (let i = 0; i < 4; i += 1) {
      parts.push(
        circle(
          x + width * (i % 2 === 0 ? 0.28 : 0.72),
          y + depth * (i < 2 ? 0.3 : 0.7),
          short * 0.14,
        ),
      );
    }
  }

  if (item.kind === 'lighting') {
    parts.push(
      circle(centre.x, centre.y, short * 0.4),
      tag('path', { d: `M ${x} ${centre.y} L ${x + width} ${centre.y}` }),
      tag('path', { d: `M ${centre.x} ${y} L ${centre.x} ${front}` }),
    );
  }

  return parts.join('');
}

/* ── Openings ──────────────────────────────────────────────────────────────── */

export interface OpeningSvgOptions {
  /** Fill for the hole itself: the floor for a doorway, the sheet for a window. */
  fill: string;
  /** The floor a leaf sweeps, drawn only where it is worth seeing. */
  swept?: boolean;
}

/**
 * One door or window: the hole punched through the wall, the leaves or panes in it, and
 * for a swing door the leaf standing open with the arc back to shut.
 */
export function openingSvg(
  opening: OpeningRender,
  px: Px,
  options: OpeningSvgOptions,
): string {
  const glazed = opening.kind.startsWith('window');
  const parts: string[] = [tag('path', { d: opening.gap, fill: options.fill })];

  for (const leaf of opening.leaves) {
    parts.push(
      tag('path', {
        d: leaf,
        fill: 'none',
        stroke: glazed ? PLAN_COLOURS.glazing : PLAN_COLOURS.ink,
        'stroke-opacity': glazed ? 0.95 : 0.6,
        'stroke-width': px(glazed ? 1 : 0.8),
      }),
    );
  }

  if (opening.swing) {
    if (options.swept && opening.sweptZone) {
      parts.push(
        tag('path', { d: opening.sweptZone, fill: PLAN_COLOURS.ink, 'fill-opacity': 0.05 }),
      );
    }
    parts.push(
      tag('path', {
        d: opening.swing.arc,
        fill: 'none',
        stroke: PLAN_COLOURS.ink,
        'stroke-opacity': 0.35,
        'stroke-width': px(0.6),
        'stroke-dasharray': `${px(2.5)} ${px(2)}`,
      }),
      tag('path', {
        d: opening.swing.leaf,
        fill: 'none',
        stroke: PLAN_COLOURS.ink,
        'stroke-opacity': 0.7,
        'stroke-width': px(1.2),
      }),
    );
  }

  return `<g>${parts.join('')}</g>`;
}

/* ── One room, whole ───────────────────────────────────────────────────────── */

export interface RoomPlan {
  /** Everything inside the svg element, defs included. */
  body: string;
  viewBox: string;
  px: Px;
}

export interface RoomPlanOptions {
  /** Drawn as a ring, in the room's own coordinates. */
  selected?: Box | null;
  /** Distinct per drawing, so two plans on one page cannot share a pattern id. */
  prefix?: string;
}

/**
 * A single room, drawn whole.
 *
 * Three things needed this and each had grown its own copy: the planner, the script that
 * renders what the planner draws, and the script that checks the presets. Three copies of
 * a composition is how the planner came to disagree with the site in the first place, so
 * there is one, and the two scripts genuinely verify what the page shows rather than
 * something arranged the same way by hand.
 *
 * A whole-flat plan is a different drawing — envelope, several rooms, dimensions, compass
 * — and stays where it is. This is the one-room case.
 */
export function roomPlanSvg(
  room: Room,
  project: Project,
  options: RoomPlanOptions = {},
): RoomPlan {
  const design = room.designs[0]!;
  const wall = project.walls.exterior;
  const inner = bbox(outlineInPlan(room));
  const frame = frameFor(
    grow(inner, wall),
    Math.max(240, Math.round(Math.max(inner.width, inner.depth) * 0.08)),
    900,
  );
  const px = frame.px;
  const prefix = options.prefix ?? room.id;
  const ids = {
    floor: `${prefix}-floor`,
    cast: `${prefix}-cast`,
    weave: `${prefix}-weave`,
  };

  const floor = floorRender(design);

  const ring = options.selected
    ? (() => {
        const gap = px(3);
        const box = options.selected;
        return rect(
          box.x + room.origin.x - gap,
          box.y + room.origin.y - gap,
          box.width + gap * 2,
          box.depth + gap * 2,
          {
            rx: px(2),
            fill: 'none',
            stroke: PLAN_COLOURS.glazing,
            'stroke-width': px(1.2),
            'stroke-dasharray': `${px(4)} ${px(2.5)}`,
          },
        );
      })()
    : '';

  const body =
    `<defs>${floorPatternSvg(ids.floor, floor, px)}${weavePatternSvg(ids.weave, px)}${shadowFilterSvg(ids.cast, px)}</defs>` +
    rect(frame.box.x, frame.box.y, frame.box.width, frame.box.depth, {
      fill: PLAN_COLOURS.sheet,
    }) +
    tag('path', {
      d: wallBandsPath(room, wall),
      fill: PLAN_COLOURS.structure,
      stroke: PLAN_COLOURS.structureEdge,
      'stroke-width': px(1.4),
    }) +
    /**
     * The floor, with no outline on it. An open side has no wall, and a line along it
     * says there is one; the poché is what draws an edge, so where there is no poché
     * there should be nothing at all.
     */
    tag('path', {
      d: roomPath(room),
      fill: floor.pattern === 'none' ? roomFill(design) : `url(#${ids.floor})`,
    }) +
    glazedRenders(room)
      .map((screen) => glazingSvg(screen, px))
      .join('') +
    room.openings
      .map((opening) =>
        openingSvg(openingRender(project, new Set([room.id]), room, opening), px, {
          fill: isDoorway(opening.kind) ? roomFill(design) : PLAN_COLOURS.sheet,
          swept: true,
        }),
      )
      .join('') +
    furnitureRenders(room, design)
      .map((piece) => furnitureSvg(piece, px, { detail: true, cast: ids.cast, weave: ids.weave }))
      .join('') +
    ring;

  return { body, viewBox: frame.viewBox, px };
}

/* ── Glazed screens ────────────────────────────────────────────────────────── */

/** A screen closing a side of a room, drawn the way a window is: a void band with panes. */
export function glazingSvg(screen: { band: string; lines: string[] }, px: Px): string {
  const panes = screen.lines
    .map((d) =>
      tag('path', {
        d,
        fill: 'none',
        stroke: PLAN_COLOURS.glazing,
        'stroke-opacity': 0.95,
        'stroke-width': px(1),
      }),
    )
    .join('');
  return (
    `<g>` +
    tag('path', {
      d: screen.band,
      fill: PLAN_COLOURS.sheet,
      stroke: PLAN_COLOURS.structureEdge,
      'stroke-opacity': 0.55,
      'stroke-width': px(0.5),
    }) +
    panes +
    `</g>`
  );
}
