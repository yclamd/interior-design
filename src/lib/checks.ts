import type {
  Design,
  Furniture,
  FurnitureKind,
  Mm,
  Opening,
  Point,
  Project,
  Room,
  RoomKind,
} from '~/data/types';
import {
  boxCorners,
  clearanceZonesOf,
  cornersOf,
  formatArea,
  formatLength,
  openingSegment,
  outlineOf,
  outlineInPlan,
  outwardNormal,
  overlapArea,
  polygonArea,
  roomArea,
  footprintArea,
  swingZone,
} from './geometry';

/**
 * Everything a drawing can be checked for without knowing anything about taste.
 * A plan can be beautiful and still put a wardrobe where the door lands, so these
 * run over the dataset and print what they find rather than leaving it to be
 * noticed on site.
 */

export type Severity = 'error' | 'warning' | 'note';

export interface Finding {
  severity: Severity;
  /** Short machine-ish label, shown as a tag. */
  code: string;
  message: string;
  /**
   * Which room this is about, where that is not already obvious from where it is shown.
   *
   * Findings printed under a room need no attribution and carry none. The ones gathered
   * for a whole plan do: a message saying a room has no daylight, printed under a
   * heading that covers nine rooms, tells the reader there is a problem and hides which
   * one it is — which is worse than not checking.
   */
  room?: string;
  /**
   * The pieces the finding is about, by id.
   *
   * A finding names them in its message, which is enough to read but not enough to act
   * on: "the coffee table eats into the sofa's legroom" still leaves somebody scanning a
   * drawing for a coffee table. Carrying the ids lets whatever shows the finding point at
   * the thing instead of describing it.
   */
  pieces?: string[];
}

/** Rotation can move a corner by a fraction of a millimetre; ignore slivers. */
const SLIVER = 2500;

/** Space to stand and pass through a doorway, in front of the leaf. */
const DOOR_APPROACH: Mm = 900;

/** Below this a gangway stops being a gangway. */
const WALKWAY: Mm = 600;

/** Past this share of the floor, a room reads as furniture with gaps in it. */
const CROWDED = 0.45;

/** Kinds with no ceiling worth measuring: what is outside, and what is a cupboard. */
const UNROOFED: RoomKind[] = ['balcony', 'canopy', 'storage'];

/**
 * A chair standing in the legroom of a table is what the legroom is for, so it is
 * not reported. Standing in the room a wardrobe needs to open still is.
 */
const SEATED_AT = new Set<FurnitureKind>(['table', 'desk']);

/** How far apart the two sides of one opening may be recorded before it is a mistake. */
const PAIR_TOLERANCE: Mm = 50;

/** Beyond this the two rooms are not on opposite sides of one wall at all. */
const PAIR_WALL_LIMIT: Mm = 400;

/**
 * Checks one design against the room it is drawn in. A room with several designs is
 * checked once per design, because a conflict is a property of an arrangement and
 * not of the space.
 */
export function checkDesign(room: Room, design: Design): Finding[] {
  const findings: Finding[] = [];
  const outline = outlineOf(room);
  const floor = roomArea(room);
  const furniture = design.furniture;

  for (const item of furniture) {
    const corners = cornersOf(item);
    /**
     * The floor the piece really covers, which is its box only when it has no outline
     * of its own. Measured as width × depth, a run with its end cut off would be
     * reported as sticking out of the room by exactly the piece that was cut away.
     */
    const own = polygonArea(corners);
    const inside = overlapArea(corners, outline);
    if (own - inside > SLIVER) {
      findings.push({
        severity: 'error',
        code: 'outside-room',
        pieces: [item.id],
        message: `${item.name} is ${formatArea(own - inside)} outside the room outline. Either the piece has moved or the room was measured smaller than it is.`,
      });
    }
  }

  for (let i = 0; i < furniture.length; i += 1) {
    for (let j = i + 1; j < furniture.length; j += 1) {
      const a = furniture[i]!;
      const b = furniture[j]!;
      if (!canCollide(a, b)) continue;
      const area = overlapArea(cornersOf(a), cornersOf(b));
      if (area > SLIVER) {
        findings.push({
          severity: 'error',
          code: 'pieces-overlap',
          pieces: [a.id, b.id],
          message: `${a.name} and ${b.name} share ${formatArea(area)} of floor. Two things cannot stand in the same place.`,
        });
      }
    }
  }

  for (const opening of room.openings) {
    const swing = swingZone(room, opening);
    if (swing) {
      for (const item of furniture) {
        /**
         * A leaf sweeps the full height of its opening, so a wall-hung piece is
         * only out of its way when its underside clears the head of the door.
         * Judged against a fixed metre instead, shelves at 1200 mm read as safe
         * from a 2 m door that would in fact hit them.
         */
        if (item.mountedAt !== undefined && item.mountedAt >= opening.height) continue;
        if (item.kind === 'rug') continue;
        const area = overlapArea(cornersOf(item), swing);
        if (area > SLIVER) {
          findings.push({
            severity: 'warning',
            code: 'door-swing',
            pieces: [item.id],
            message: `The ${label(opening)} sweeps ${formatArea(area)} of ${item.name}. It will stop before it is open.`,
          });
        }
      }
    }

    if (isDoor(opening)) {
      const approach = approachZone(room, opening, DOOR_APPROACH);
      for (const item of furniture) {
        if (item.mountedAt !== undefined) continue;
        if (item.kind === 'rug') continue;
        const area = overlapArea(cornersOf(item), approach);
        if (area > SLIVER) {
          findings.push({
            severity: 'warning',
            code: 'door-approach',
            pieces: [item.id],
            message: `${item.name} stands in the ${formatLength(DOOR_APPROACH)} of landing space in front of the ${label(opening)}.`,
          });
        }
      }
    }

    if (isWindow(opening)) {
      const reveal = approachZone(room, opening, 300);
      for (const item of furniture) {
        if (item.height <= opening.sill) continue;
        const area = overlapArea(cornersOf(item), reveal);
        if (area > SLIVER) {
          findings.push({
            severity: 'note',
            code: 'window-blocked',
            pieces: [item.id],
            message: `${item.name} stands ${formatLength(item.height)} tall against the ${label(opening)}, whose sill is at ${formatLength(opening.sill)}. It will take some of the light.`,
          });
        }
      }
    }
  }

  for (const item of furniture) {
    for (const zone of clearanceZonesOf(item)) {
      for (const other of furniture) {
        if (other.id === item.id) continue;
        if (other.kind === 'rug' || other.mountedAt !== undefined) continue;
        if (other.kind === 'chair' && SEATED_AT.has(item.kind)) continue;
        const area = overlapArea(zone.polygon, cornersOf(other));
        if (area > SLIVER) {
          findings.push({
            severity: 'warning',
            code: 'clearance',
            pieces: [other.id, item.id],
            message: `${other.name} eats into the ${formatLength(zone.depth)} ${item.name} needs on its ${zone.side} face.`,
          });
        }
      }

      const kept = overlapArea(zone.polygon, outline);
      if (polygonArea(zone.polygon) - kept > SLIVER) {
        findings.push({
          severity: 'note',
          code: 'clearance-wall',
          pieces: [item.id],
          message: `The ${formatLength(zone.depth)} ${item.name} needs on its ${zone.side} face runs into a wall.`,
        });
      }
    }
  }

  const used = footprintArea(design);
  if (floor > 0 && used / floor > CROWDED) {
    findings.push({
      severity: 'note',
      code: 'crowded',
      message: `Furniture covers ${Math.round((used / floor) * 100)}% of the floor. Past about ${Math.round(CROWDED * 100)}% a room starts to be read as the gaps between things.`,
    });
  }

  if (room.ceiling < 2400 && !UNROOFED.includes(room.kind)) {
    findings.push({
      severity: 'note',
      code: 'low-ceiling',
      message: `A ${formatLength(room.ceiling)} ceiling is under the 2.4 m most fitted furniture is drawn for.`,
    });
  }

  /**
   * A design that places nothing.
   *
   * Every other check here asks whether the furniture works, and says nothing at all when
   * there is none — so a bathroom with no WC and a kitchen with no counter passed silently,
   * and the axonometric drew them as empty boxes. Those two kinds cannot function empty, so
   * for them it is a gap rather than a decision; elsewhere an unfurnished room is a room
   * not yet arranged, which is worth stating once and no more.
   */
  if (furniture.length === 0 && !UNROOFED.includes(room.kind)) {
    const fitted = room.kind === 'bathroom' || room.kind === 'kitchen';
    findings.push({
      severity: fitted ? 'warning' : 'note',
      code: 'nothing-placed',
      message: fitted
        ? `A ${room.kind} with nothing in it. The fittings it cannot work without are not recorded, so neither the schedule nor the model knows about them.`
        : 'This design places nothing in the room, so there is nothing here to check.',
    });
  }

  for (const opening of room.openings) {
    if (isDoor(opening) && opening.width < WALKWAY + 100) {
      findings.push({
        severity: 'note',
        code: 'narrow-door',
        message: `The ${label(opening)} is ${formatLength(opening.width)} wide. Furniture wider than that cannot come through it in one piece.`,
      });
    }
  }

  return findings;
}

/** Rooms people are meant to spend time in, which are the ones that want daylight. */
const HABITABLE_KINDS: RoomKind[] = ['living', 'dining', 'kitchen', 'bedroom', 'study'];

/**
 * Whether a room is a room.
 *
 * The checks above ask whether the furniture in a room works. These ask something more
 * basic that a drawing can get wrong without anything overlapping anything: whether
 * there is a way in, and whether there is any daylight. A bedroom with no door and a
 * living room sealed on four sides are both perfectly valid geometry and both obvious
 * nonsense, and nonsense of exactly the kind that makes a drawing look unprofessional
 * the moment somebody who builds things looks at it.
 *
 * A side the room states as open counts as a way in and as a source of borrowed light,
 * because that is what an opening onto the rest of a flat is.
 */
export function checkRoom(room: Room, rooms: Room[] = []): Finding[] {
  const findings: Finding[] = [];
  if (UNROOFED.includes(room.kind)) return findings;

  const open = room.open ?? [];
  const doors = room.openings.filter(isDoor);
  const windows = room.openings.filter(isWindow);

  /** A room flush against another is open to it, whether or not it says so. */
  const flush = rooms.some(
    (other) => other.id !== room.id && sharesAnEdge(room, other),
  );

  if (doors.length === 0 && open.length === 0 && !flush) {
    findings.push({
      severity: 'error',
      code: 'no-way-in',
      room: room.id,
      message: `No door and no open side, so there is no way into this room. Either it wants a door, or it wants a side declared open to the rest of the space.`,
    });
  }

  if (HABITABLE_KINDS.includes(room.kind) && windows.length === 0) {
    const borrowed = open.length > 0 || flush;
    findings.push({
      severity: borrowed ? 'note' : 'warning',
      code: 'no-daylight',
      room: room.id,
      message: borrowed
        ? `No window of its own, so the daylight here is borrowed from whatever it opens onto. Worth checking that something over there has one.`
        : `A room to spend time in, with no window and no open side: it has no daylight at all.`,
    });
  }

  return findings;
}

/** Rooms are open to each other when an edge of one lies exactly on an edge of the other. */
function sharesAnEdge(room: Room, other: Room): boolean {
  const mine = outlineInPlan(room);
  const theirs = outlineInPlan(other);
  for (let i = 0; i < mine.length; i += 1) {
    const a = mine[i]!;
    const b = mine[(i + 1) % mine.length]!;
    for (let j = 0; j < theirs.length; j += 1) {
      const c = theirs[j]!;
      const d = theirs[(j + 1) % theirs.length]!;
      const vertical = Math.abs(a.x - b.x) < 1 && Math.abs(c.x - d.x) < 1;
      const horizontal = Math.abs(a.y - b.y) < 1 && Math.abs(c.y - d.y) < 1;
      if (vertical && Math.abs(a.x - c.x) < 1) {
        const overlap =
          Math.min(Math.max(a.y, b.y), Math.max(c.y, d.y)) -
          Math.max(Math.min(a.y, b.y), Math.min(c.y, d.y));
        if (overlap > WALKWAY) return true;
      }
      if (horizontal && Math.abs(a.y - c.y) < 1) {
        const overlap =
          Math.min(Math.max(a.x, b.x), Math.max(c.x, d.x)) -
          Math.max(Math.min(a.x, b.x), Math.min(c.x, d.x));
        if (overlap > WALKWAY) return true;
      }
    }
  }
  return false;
}

/**
 * Checks that need more than one room to answer. Designs do not enter into these:
 * a room's shell is one shell however many ways it has been furnished, so two
 * designs can never be reported as overlapping each other.
 */
export function checkProject(project: Project, rooms: Room[]): Finding[] {
  const findings: Finding[] = [];
  const ids = new Set(rooms.map((room) => room.id));

  /** Whether each room is a room at all, which is a property of the shell. */
  for (const room of rooms) findings.push(...checkRoom(room, rooms));
  const NON_ROOM = new Set(['outside', 'balcony', 'stairs', 'corridor', 'shaft', 'lift-lobby']);

  for (const room of rooms) {
    for (const opening of room.openings) {
      if (opening.to && !ids.has(opening.to) && !NON_ROOM.has(opening.to)) {
        findings.push({
          severity: 'error',
          code: 'dangling-opening',
          message: `${room.name}'s ${label(opening)} leads to "${opening.to}", which is not a room in this home.`,
        });
      }
    }
  }

  for (let i = 0; i < rooms.length; i += 1) {
    for (let j = i + 1; j < rooms.length; j += 1) {
      const a = rooms[i]!;
      const b = rooms[j]!;
      const area = overlapArea(outlineInPlan(a), outlineInPlan(b));
      if (area > SLIVER) {
        findings.push({
          severity: 'error',
          code: 'rooms-overlap',
          message: `${a.name} and ${b.name} overlap by ${formatArea(area)} on the plan. One of the two origins is wrong.`,
        });
      }
    }
  }

  findings.push(...checkOpeningPairs(rooms));

  if (project.registeredArea) {
    const drawn = rooms.reduce((sum, room) => sum + roomArea(room), 0) / 1_000_000;
    const gap = project.registeredArea - drawn;
    if (Math.abs(gap) / project.registeredArea > 0.25) {
      findings.push({
        severity: 'note',
        code: 'area-gap',
        message: `The rooms drawn here add up to ${drawn.toFixed(2)} m², against ${project.registeredArea.toFixed(2)} m² on the deed. Walls, shafts and shared space account for some of the difference; a gap this size suggests a room is still missing.`,
      });
    }
  }

  for (const room of rooms) {
    if (room.designs.length === 0) {
      findings.push({
        severity: 'error',
        code: 'no-design',
        message: `${room.name} has no design. A room needs at least one, even if it is only the furniture already in it.`,
      });
      continue;
    }
    const ids = room.designs.map((design) => design.id);
    if (new Set(ids).size !== ids.length) {
      findings.push({
        severity: 'error',
        code: 'duplicate-design',
        message: `${room.name} has two designs with the same id, so one of them has no address of its own.`,
      });
    }
    if (room.designs.filter((design) => design.preferred).length > 1) {
      findings.push({
        severity: 'warning',
        code: 'two-preferred',
        message: `${room.name} marks more than one design as preferred. The plan can only draw one, and will take the first.`,
      });
    }
  }

  return findings;
}

/**
 * A door between two rooms is written down twice, once by each room, so that each
 * room's plan is complete on its own. The price is that the two entries can drift
 * apart. This puts both in the shared space and insists they describe the same
 * hole: the same wall, the same run along it, and a gap between the two faces no
 * wider than a wall.
 */
function checkOpeningPairs(rooms: Room[]): Finding[] {
  const findings: Finding[] = [];
  const byId = new Map(rooms.map((room) => [room.id, room]));

  for (const room of rooms) {
    for (const opening of room.openings) {
      const far = opening.to ? byId.get(opening.to) : undefined;
      /** Each pair is examined once, from the room whose id sorts first. */
      if (!far || far.id < room.id) continue;

      const match =
        far.openings.find((other) => other.id === opening.id) ??
        far.openings.find((other) => other.to === room.id);

      if (!match) {
        findings.push({
          severity: 'error',
          code: 'unpaired-opening',
          message: `${room.name} has a ${label(opening)} to ${far.name}, but ${far.name} does not record it. Both rooms have to list a shared opening.`,
        });
        continue;
      }

      const mine = inPlan(room, opening);
      const theirs = inPlan(far, match);
      const mineFlat = Math.abs(mine.a.y - mine.b.y) < 1;
      const theirsFlat = Math.abs(theirs.a.y - theirs.b.y) < 1;

      if (mineFlat !== theirsFlat) {
        findings.push({
          severity: 'error',
          code: 'opening-axis',
          message: `${room.name} puts ${opening.id} in a ${mineFlat ? 'horizontal' : 'vertical'} wall and ${far.name} puts it in a ${theirsFlat ? 'horizontal' : 'vertical'} one. One of the two sides is wrong.`,
        });
        continue;
      }

      const span = (segment: { a: Point; b: Point }) =>
        mineFlat
          ? [Math.min(segment.a.x, segment.b.x), Math.max(segment.a.x, segment.b.x)]
          : [Math.min(segment.a.y, segment.b.y), Math.max(segment.a.y, segment.b.y)];
      const [mineFrom, mineTo] = span(mine) as [number, number];
      const [theirFrom, theirTo] = span(theirs) as [number, number];
      const drift = Math.max(Math.abs(mineFrom - theirFrom), Math.abs(mineTo - theirTo));

      if (drift > PAIR_TOLERANCE) {
        findings.push({
          severity: 'error',
          code: 'opening-drift',
          message: `${opening.id} is recorded ${formatLength(Math.round(drift))} apart by ${room.name} and ${far.name}. Check the offset each takes it from.`,
        });
      }

      const gap = mineFlat
        ? Math.abs(mine.a.y - theirs.a.y)
        : Math.abs(mine.a.x - theirs.a.x);
      if (gap > PAIR_WALL_LIMIT) {
        findings.push({
          severity: 'error',
          code: 'opening-gap',
          message: `The two sides of ${opening.id} are ${formatLength(Math.round(gap))} apart, which is thicker than any wall here. ${room.name} and ${far.name} are probably not neighbours at that point.`,
        });
      }
    }
  }

  return findings;
}

const inPlan = (room: Room, opening: Opening): { a: Point; b: Point } => {
  const { a, b } = openingSegment(room, opening);
  return {
    a: { x: a.x + room.origin.x, y: a.y + room.origin.y },
    b: { x: b.x + room.origin.x, y: b.y + room.origin.y },
  };
};

/**
 * A rug goes under things and a wall-hung piece goes over them, so neither is in
 * anything's way on the floor.
 */
function canCollide(a: Furniture, b: Furniture): boolean {
  if (a.kind === 'rug' || b.kind === 'rug') return false;
  if (a.mountedAt !== undefined || b.mountedAt !== undefined) return false;
  return true;
}

const isDoor = (opening: Opening): boolean =>
  opening.kind.startsWith('door') || opening.kind === 'opening';

const isWindow = (opening: Opening): boolean => opening.kind.startsWith('window');

/** The strip of floor immediately inside an opening. */
function approachZone(room: Room, opening: Opening, depth: Mm) {
  const { a, b } = openingSegment(room, opening);
  const normal = outwardNormal(opening.side);
  const inward = { x: -normal.x * depth, y: -normal.y * depth };
  const box = {
    x: Math.min(a.x, b.x, a.x + inward.x, b.x + inward.x),
    y: Math.min(a.y, b.y, a.y + inward.y, b.y + inward.y),
    width: Math.abs(b.x - a.x) || depth,
    depth: Math.abs(b.y - a.y) || depth,
  };
  return boxCorners(box);
}

function label(opening: Opening): string {
  const kind = opening.kind
    .replace('door-', '')
    .replace('window-floor', 'full-height window')
    .replace(/-/g, ' ');
  const noun = isWindow(opening) ? (kind === 'window' ? 'window' : kind) : `${kind} door`;
  return `${opening.side} ${noun}`;
}

export const worst = (findings: Finding[]): Severity | null =>
  findings.some((f) => f.severity === 'error')
    ? 'error'
    : findings.some((f) => f.severity === 'warning')
      ? 'warning'
      : findings.length > 0
        ? 'note'
        : null;
