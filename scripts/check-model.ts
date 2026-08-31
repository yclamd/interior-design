/**
 * Sanity-checks the solid model against the drawings it came from.
 *
 * The model compiles whatever it is handed, so compiling proves nothing about whether a
 * wall stands where a wall belongs. These are the assertions worth making before anything
 * is rendered: that every room is enclosed, that every opening actually became a hole,
 * that nothing is inside-out, and that the model's own footprints agree with the plan's.
 *
 * Run with: npx tsx scripts/check-model.ts
 */

import { PROJECTS } from '../src/data/projects';
import { modelOf, modelBounds, type Solid } from '../src/lib/model';
import { bbox, openingSegment, outlineInPlan, roomArea } from '../src/lib/geometry';
import { wallSegments } from '../src/lib/plan';
import { preferredDesign } from '../src/data/types';

let failures = 0;
const fail = (message: string) => {
  console.log(`  FAIL ${message}`);
  failures += 1;
};

const area = (solid: Solid): number =>
  solid.footprint.kind === 'box'
    ? solid.footprint.width * solid.footprint.depth
    : Math.abs(
        solid.footprint.points.reduce((sum, point, i, all) => {
          const next = all[(i + 1) % all.length]!;
          return sum + (point.x * next.y - next.x * point.y);
        }, 0) / 2,
      );

for (const { project, rooms } of PROJECTS) {
  const solids = modelOf(project, rooms);
  console.log(`\n${project.id}: ${solids.length} solids`);

  for (const solid of solids) {
    if (solid.top <= solid.base) fail(`${solid.id} has no height (${solid.base}..${solid.top})`);
    if (area(solid) <= 0) fail(`${solid.id} has no footprint`);
  }

  for (const room of rooms) {
    const mine = solids.filter((solid) => solid.room === room.id);

    const floors = mine.filter((solid) => solid.role === 'floor');
    if (floors.length !== 1) fail(`${room.id} has ${floors.length} floors`);
    else {
      /** The floor is the room, so its area is the room's to the millimetre. */
      const drift = Math.abs(area(floors[0]!) - roomArea(room));
      if (drift > 1) fail(`${room.id} floor is ${drift.toFixed(0)} mm² off the plan`);
    }

    const box = bbox(outlineInPlan(room));
    const middle = { x: box.x + box.width / 2, y: box.y + box.depth / 2 };

    /**
     * Enclosure is a property of the model, not of one room's share of it. A partition
     * between two rooms is one wall and is emitted once, so asking whether a room owns
     * any walls asks the wrong question — a rain shelter owns none and is still walled,
     * because the wall between it and the living room was emitted under the living room.
     * The test is therefore whether something stands outside each of the room's own wall
     * lines, wherever it came from.
     */
    const allWalls = solids.filter((solid) => solid.role === 'wall');
    for (const segment of wallSegments(room, rooms)) {
      const horizontal = Math.abs(segment.b.y - segment.a.y) < Math.abs(segment.b.x - segment.a.x);
      const mid = {
        x: (segment.a.x + segment.b.x) / 2,
        y: (segment.a.y + segment.b.y) / 2,
      };
      const away = horizontal ? { x: 0, y: mid.y > middle.y ? 1 : -1 } : { x: mid.x > middle.x ? 1 : -1, y: 0 };
      const probe = { x: mid.x + away.x * 40, y: mid.y + away.y * 40 };
      const covered = allWalls.some((wall) => {
        if (wall.footprint.kind !== 'box') return false;
        const f = wall.footprint;
        return (
          probe.x >= f.x && probe.x <= f.x + f.width && probe.y >= f.y && probe.y <= f.y + f.depth
        );
      });
      if (!covered) {
        fail(`${room.id} has nothing standing on its wall line at ${Math.round(mid.x)},${Math.round(mid.y)}`);
      }
    }

    /** Walls stand outside the room, never in it: no wall may cover the room's middle. */
    for (const wall of allWalls) {
      if (wall.footprint.kind !== 'box') continue;
      const f = wall.footprint;
      if (
        middle.x > f.x + 1 &&
        middle.x < f.x + f.width - 1 &&
        middle.y > f.y + 1 &&
        middle.y < f.y + f.depth - 1
      ) {
        fail(`${wall.id} stands in the middle of ${room.id}`);
      }
    }

    /**
     * Every opening should have left a hole, and every window should have glass in it.
     * Both are asked of the model rather than of the room, for the same reason as above:
     * a shared opening is emitted once, under whichever side reached it first.
     */
    for (const opening of room.openings) {
      const local = openingSegment(room, opening);
      const mid = {
        x: (local.a.x + local.b.x) / 2 + room.origin.x,
        y: (local.a.y + local.b.y) / 2 + room.origin.y,
      };
      const at = (role: Solid['role'], height: number) =>
        solids.some((solid) => {
          if (solid.role !== role || solid.footprint.kind !== 'box') return false;
          const f = solid.footprint;
          return (
            mid.x >= f.x - 60 &&
            mid.x <= f.x + f.width + 60 &&
            mid.y >= f.y - 60 &&
            mid.y <= f.y + f.depth + 60 &&
            height > solid.base &&
            height < solid.top
          );
        });

      /** Head height of the opening, which must be air rather than wall. */
      const through = opening.sill + opening.height / 2;
      if (at('wall', through)) fail(`${room.id} opening ${opening.id} is still walled up`);
      if (opening.kind.startsWith('window') && !at('glazing', through)) {
        fail(`${room.id} window ${opening.id} produced no glass`);
      }
    }

    const ceilings = mine.filter((solid) => solid.role === 'ceiling');
    const roofed = room.kind !== 'canopy' && room.kind !== 'balcony';
    if (roofed && ceilings.length !== 1) fail(`${room.id} has ${ceilings.length} ceilings`);
    if (!roofed && ceilings.length !== 0) fail(`${room.id} is outside but has a ceiling`);

    const furniture = mine.filter((solid) => solid.role === 'furniture');
    const expected = preferredDesign(room).furniture.length;
    if (furniture.length !== expected) {
      fail(`${room.id} has ${furniture.length} pieces, the design has ${expected}`);
    }
  }

  const bounds = modelBounds(solids);
  console.log(
    `  extent ${Math.round(bounds.width)} × ${Math.round(bounds.depth)} mm, ` +
      `${Math.round(bounds.base)}..${Math.round(bounds.top)} high`,
  );
}

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} failures.`);
process.exit(failures === 0 ? 0 : 1);
