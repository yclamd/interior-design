import type { Project, Room } from '~/data/types';
import { STUDY } from './rooms/study';

/**
 * PLACEHOLDER, and the second reason this project exists: it is a single room, so
 * it shows that a one-room job needs no shape of its own in the data. It is a
 * project whose room list has one entry, and only the overview page reads
 * differently.
 *
 * Note what is missing. There is no envelope, because nobody surveying one room of
 * an existing flat knows the outline of the building — it is taken as the room plus
 * one wall. And there is no registered area, because a deed does not record rooms.
 */
export const PROJECT: Project = {
  id: 'study-nook',
  name: 'The study',
  location: 'Placeholder — one 2.6 × 3.2 m room in an existing flat',
  scope: 'room',
  northOffset: 0,
  walls: { exterior: 100, interior: 100 },
  ceiling: 2450,
  style: 'mid-century',
  premise:
    'One room, and one argument about 900 millimetres. A desk chair needs that much to push back into and a sofa bed is that much deep, and the room is 2.6 m wide, so the whole design is the decision not to let those two measurements share a line.',
};

export const ROOMS: Room[] = [STUDY];
