import type { Project, Room, RoomKind } from './types';
import {
  PROJECT as CHILDRENS_ROOM,
  ROOMS as CHILDRENS_ROOM_ROOMS,
} from './projects/childrens-room/project';
import { PROJECT as PLACEHOLDER_FLAT, ROOMS as PLACEHOLDER_FLAT_ROOMS } from './projects/placeholder-flat/project';
import { PROJECT as STUDY_NOOK, ROOMS as STUDY_NOOK_ROOMS } from './projects/study-nook/project';

/**
 * The registry. A project is one design job: a whole dwelling, a floor of one, or a
 * single room. There is no separate kind for the single-room case — it is a project
 * whose room list has one entry, and the pages read the length to decide what to
 * show. Room ids only have to be unique within a project, and nothing is ever
 * compared across them.
 */
export interface Entry {
  project: Project;
  rooms: Room[];
}

/** Real jobs first, placeholders after them. */
export const PROJECTS: Entry[] = [
  { project: CHILDRENS_ROOM, rooms: CHILDRENS_ROOM_ROOMS },
  { project: PLACEHOLDER_FLAT, rooms: PLACEHOLDER_FLAT_ROOMS },
  { project: STUDY_NOOK, rooms: STUDY_NOOK_ROOMS },
];

export const projectById = (id: string): Entry | undefined =>
  PROJECTS.find((entry) => entry.project.id === id);

export const roomById = (entry: Entry, id: string): Room | undefined =>
  entry.rooms.find((room) => room.id === id);

/** Rooms whose floor counts towards the living area, as against space that serves it. */
export const HABITABLE: RoomKind[] = ['living', 'dining', 'kitchen', 'bedroom', 'study'];

export const KIND_LABELS: Record<RoomKind, string> = {
  living: 'Living',
  dining: 'Dining',
  kitchen: 'Kitchen',
  bedroom: 'Bedroom',
  study: 'Study',
  bathroom: 'Bathroom',
  entry: 'Entry',
  corridor: 'Circulation',
  balcony: 'Balcony',
  utility: 'Utility',
  storage: 'Storage',
};

export const SCOPE_LABELS: Record<Project['scope'], string> = {
  home: 'Whole home',
  floor: 'One floor',
  room: 'Single room',
};
