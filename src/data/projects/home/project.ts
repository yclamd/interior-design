import type { Project, Room } from '~/data/types';
import { DINING } from './rooms/dining';
import { ENTRY } from './rooms/entry';
import { LIVING } from './rooms/living';

/**
 * The flat itself, being surveyed room by room. Three rooms so far, and they are the
 * ones that run in a line from the front door to the east window.
 *
 * The envelope is stated rather than derived, because the building steps: the living
 * room is 450 deeper than the dining room and they share their south wall, so the
 * north face moves out 450 mm across the east end. Derived from the rooms it would
 * come out as a plain rectangle and lose the step.
 */
export const PROJECT: Project = {
  id: 'home',
  name: 'The flat',
  location: 'Being surveyed — three rooms of it drawn so far',
  scope: 'home',
  /** Assumed: plan-up is north. The living room's window faces east, which fits. */
  northOffset: 0,
  envelope: [
    { x: 0, y: 450 },
    { x: 7100, y: 450 },
    { x: 7100, y: 0 },
    { x: 9800, y: 0 },
    { x: 9800, y: 3450 },
    { x: 0, y: 3450 },
  ],
  /**
   * The 2.25 by 1.3 m behind the entry's cabinet run. The entry is 1300 deep against
   * the dining room's 2600, and what fills the difference is not known yet.
   */
  unsurveyed: [
    [
      { x: 200, y: 1950 },
      { x: 2450, y: 1950 },
      { x: 2450, y: 3250 },
      { x: 200, y: 3250 },
    ],
  ],
  /** Assumed. Neither thickness has been measured yet. */
  walls: { exterior: 200, interior: 100 },
  /** Assumed. */
  ceiling: 2600,
  style: 'warm-minimal',
  premise:
    'The public half, drawn first. Entry, dining and living run west to east in one open line with no partition between them: you come in the west wall, the shoe run turns the corner into 2.6 m of fitted storage, and the flat opens out to a window at the far end. A 900 mm corridor leaves the north-east corner of the dining room into the private half — a guest shower room, the children’s room, a guest room and the main bedroom — none of which is surveyed yet, so the plan stops at that opening. Everything here is geometry rather than design: the point of drawing it this early is that a room in the wrong place is obvious on a plan and invisible in a list of measurements.',
};

export const ROOMS: Room[] = [ENTRY, DINING, LIVING];
