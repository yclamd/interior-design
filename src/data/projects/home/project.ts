import type { Project, Room } from '~/data/types';
import { DINING } from './rooms/dining';
import { ENTRY } from './rooms/entry';
import { LIVING } from './rooms/living';
import { RAIN_SHELTER } from './rooms/rain-shelter';

/**
 * The flat itself, being surveyed room by room. Three rooms so far, and they are the
 * ones that run in a line from the front door to the east window — plus the rain
 * shelter beyond that window, which is not a room anyone stands in but is the only
 * outdoor space the flat has, and so the only place planting belongs.
 *
 * The envelope is stated rather than derived, because the building steps: the living
 * room is 450 deeper than the dining room and they share their south wall, so the
 * north face moves out 450 mm across the east end. Derived from the rooms it would
 * come out as a plain rectangle and lose the step.
 */
export const PROJECT: Project = {
  id: 'home',
  name: 'The flat',
  location: 'Being surveyed — three rooms and the rain shelter drawn so far',
  scope: 'home',
  /** Assumed: plan-up is north. The living room's window faces east, which fits. */
  northOffset: 0,
  /**
   * Every face sits exactly one 100 mm wall outside the rooms behind it: west of the
   * entry at 200, north of the entry and dining at 650, north of the living room at
   * 200, east of it at 9000, and south of everything at 3250.
   *
   * The step is a wall's width west of the living room rather than on it. Standing on
   * the room's own west face, the 250 mm of that wall north of the dining room had no
   * thickness at all — the inside of the room and the outside of the building were one
   * line.
   */
  envelope: [
    { x: 100, y: 550 },
    { x: 6400, y: 550 },
    { x: 6400, y: 100 },
    { x: 9100, y: 100 },
    { x: 9100, y: 3350 },
    { x: 100, y: 3350 },
  ],
  /**
   * The 1.65 by 1.3 m behind the entry's cabinet run. The entry is 1300 deep against
   * the dining room's 2600, and what fills the difference is not known yet.
   */
  unsurveyed: [
    [
      { x: 200, y: 1950 },
      { x: 1850, y: 1950 },
      { x: 1850, y: 3250 },
      { x: 200, y: 3250 },
    ],
  ],
  /**
   * Given as 100 mm throughout. Both figures were assumed at 200 and 100 before, and
   * the perimeter one is worth a second look: 100 mm is a normal partition and a thin
   * exterior wall for a reinforced-concrete building, where 150 to 240 is usual. It is
   * drawn as given, and the drawing will show it — the perimeter is now the same weight
   * as an internal wall would be.
   */
  walls: { exterior: 100, interior: 100 },
  /** Assumed. */
  ceiling: 2600,
  style: 'warm-minimal',
  premise:
    'The public half, drawn first. Entry, dining and living run west to east in one open line with no partition between them: you come in the west wall, the shoe run turns the corner into 2.6 m of fitted storage, and the flat opens out to a window at the far end. Beyond that window a 1 m rain shelter runs the full width of the living room — the only outdoor space here, reachable only over the sill, and the one place a plant makes sense. A 900 mm corridor leaves the north-east corner of the dining room into the private half — a guest shower room, the children’s room, a guest room and the main bedroom — none of which is surveyed yet, so the plan stops at that opening. Everything here is geometry rather than design: the point of drawing it this early is that a room in the wrong place is obvious on a plan and invisible in a list of measurements.',
};

export const ROOMS: Room[] = [ENTRY, DINING, LIVING, RAIN_SHELTER];
