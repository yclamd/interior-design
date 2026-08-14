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
  walls: { exterior: 100, interior: 100 },
  ceiling: 2600,
  style: 'macaron',
  premise:
    'One room, two children both under three, and it has to be two different rooms in the same day: somewhere to play, read and sit at a table in the morning and afternoon, and somewhere for both of them to sleep at midday and at night. The answer is to own no beds. Washable mat to every wall except the square inside the door where shoes come off, two sleeping bags folded into a cupboard each morning, and everything else standing on the mat and low enough to climb on safely. At 2.55 m across, owning no beds is what separates a room with a floor in it from a room with gaps between furniture. The first two designs here are not alternatives to choose between: they are the same room at two times of day, and both are checked.',
};

export const ROOMS: Room[] = [CHILDRENS_ROOM];
