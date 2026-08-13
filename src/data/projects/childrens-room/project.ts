import type { Project, Room } from '~/data/types';
import { CHILDRENS_ROOM } from './rooms/childrens-room';

/**
 * The first real job on this site: a room that exists, measured rather than
 * invented. The building outline is left out and taken from the room plus one wall,
 * because the rest of the flat is not being designed here yet.
 */
export const PROJECT: Project = {
  id: 'childrens-room',
  name: "The children's room",
  location: 'A 2.55 × 4.50 m room with one north window',
  scope: 'room',
  /** The window is in the north wall, so plan-up is north. */
  northOffset: 0,
  walls: { exterior: 200, interior: 100 },
  ceiling: 2600,
  style: 'muji',
  premise:
    'One room, two children both under three, and three things it has to do: sleep, play on the floor, and hold picture books where a small person can reach them. The room is 2.55 m across and 4.5 m deep, which is narrow enough that almost nothing has a second possible position — the west wall is the only long unbroken run, so it takes whatever is longest. Two designs are drawn against it: the one needed now, and the one the same room has to become when both children are at school, so that today’s decisions can be checked against what they cost later.',
};

export const ROOMS: Room[] = [CHILDRENS_ROOM];
