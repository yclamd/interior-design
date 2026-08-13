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
    'One room, two children both under three, and it has to be two different rooms in the same day: somewhere to play and read on the floor in the morning and afternoon, and somewhere for both of them to sleep at midday and at night. The answer is to own no beds. Bedding folds into a cupboard by the door, and the floor — 1.8 by 3 metres of it, in one piece — is the mat by day and the bed by night. At 2.55 m across, that decision is what separates a room with a floor in it from a room with gaps between furniture. The first two designs here are not alternatives to choose between: they are the same room at two times of day, and both are checked.',
};

export const ROOMS: Room[] = [CHILDRENS_ROOM];
