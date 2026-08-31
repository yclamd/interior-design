/**
 * Renders the axonometric view of every room, and of each flat whole.
 *
 * A projection is very easy to get subtly wrong — a face shaded as though it faced the
 * other way, a box drawn over the one in front of it, a wall cut at the wrong height —
 * and every one of those mistakes still produces a plausible-looking picture. So the only
 * useful check is to write the drawings out and look at them.
 *
 * Run with: npm run axon
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { PROJECTS } from '../src/data/projects';
import { axonSvg } from '../src/lib/axon';
import { modelOf } from '../src/lib/model';

mkdirSync('dist/axon', { recursive: true });

let written = 0;

for (const entry of PROJECTS) {
  const solids = modelOf(entry.project, entry.rooms);

  const whole = axonSvg(solids, { cut: 800 });
  writeFileSync(
    `dist/axon/${entry.project.id}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${whole.viewBox}">${whole.body}</svg>`,
  );
  written += 1;

  for (const room of entry.rooms) {
    const mine = solids.filter((solid) => solid.room === room.id);
    if (mine.length === 0) continue;
    const view = axonSvg(mine, { cut: 800 });
    writeFileSync(
      `dist/axon/${entry.project.id}-${room.id}.svg`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view.viewBox}">${view.body}</svg>`,
    );
    written += 1;
  }

  const counts = solids.reduce<Record<string, number>>((tally, solid) => {
    tally[solid.role] = (tally[solid.role] ?? 0) + 1;
    return tally;
  }, {});
  console.log(
    `${entry.project.id.padEnd(18)} ${solids.length} solids  ` +
      Object.entries(counts)
        .map(([role, n]) => `${role} ${n}`)
        .join('  '),
  );
}

console.log(`\n${written} axonometric views written to dist/axon.`);
