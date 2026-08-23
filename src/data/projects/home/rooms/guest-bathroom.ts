import { single, type Room } from '~/data/types';
import { ASSUMED_WET_TILE } from '../floors';

/**
 * 2550 east–west by 1470 north–south, east of the kitchen and north of the dining
 * room: one 100 wall off each, so its west face is at 2950 and its south face at 550.
 *
 * Its east wall lands at 5500 and its door is in it, so it opens onto the corridor that
 * runs 5600 to 6500 — the same 900 the dining room's north wall opens into. That is what
 * makes this the guest shower room rather than an en suite: it is the first door off the
 * corridor and the only one reachable without passing a bedroom.
 *
 * The door is 750 and hard to the north end of that wall, which is the end furthest from
 * the dining room. So the whole of the south end of the room, and the whole of the long
 * south wall, is out of the doorway's way.
 */
export const GUEST_BATHROOM: Room = {
  id: 'guest-bathroom',
  name: 'Guest shower room',
  kind: 'bathroom',
  origin: { x: 2950, y: -920 },
  shape: { kind: 'rect', width: 2550, depth: 1470 },
  /** Assumed, as the flat's. A shower room often has a bulkhead, and none is recorded. */
  ceiling: 2600,
  openings: [
    {
      id: 'guest-bathroom-door',
      kind: 'door-swing',
      side: 'east',
      /** Hard to the north end, which for an east wall is offset zero. */
      offset: 0,
      width: 750,
      height: 2100,
      sill: 0,
      /**
       * Inward, hinged at the north end — 'left' being the end the offset is measured
       * from. Hinged in the corner it stands against, the leaf folds back flat on the
       * north wall instead of sweeping the room, which at 1470 deep is the difference
       * between a 750 quarter-circle of unusable floor and none.
       */
      swing: 'left-in',
      to: 'corridor',
    },
  ],
  designs: single({
    theme: 'Measured, and nothing decided',
    style: 'warm-minimal',
    floor: ASSUMED_WET_TILE,
    summary:
      'The shell only, at 3.75 m². The proportion is the fact worth having: 2550 long by 1470 deep is a room whose fittings go down one long wall, because 1470 takes a 700 basin or a 700 WC with 770 left to stand in. The door being in the east wall and hard north is what makes that work — it keeps the whole 2550 of the south wall, which is enough for a WC, a basin and a shower at 800 apiece. Had it been in the south wall, off the dining room, that run would have been cut in two. And hinged north as it is, the leaf folds onto the 720 of east wall above it rather than into the room, so the south wall stays clear for its whole length with nothing swinging over it.',
    furniture: [],
    openQuestions: [
      'The leaf folds onto the north end of the east wall, so that 720 of wall cannot hold anything — no towel rail, no cistern, no shelf. It is the one stretch this room has to give up.',
      'Shower or bath is not decided. At 1470 deep a bath has to run along the short wall, which uses 1470 of the 2550 length and leaves 1080 for a basin and a WC. A shower at 800 by 800 leaves 1750.',
      'No window is recorded, which for a shower room means extraction is not optional.',
    ],
  }),
};
