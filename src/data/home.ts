import type { Home, Room, RoomKind } from './types';
import { BALCONY } from './rooms/balcony';
import { BATHROOM } from './rooms/bathroom';
import { BEDROOM_MAIN } from './rooms/bedroom-main';
import { BEDROOM_SECOND } from './rooms/bedroom-second';
import { CORRIDOR } from './rooms/corridor';
import { KITCHEN } from './rooms/kitchen';
import { LIVING } from './rooms/living';
import { UTILITY } from './rooms/utility';

/**
 * PLACEHOLDER. Every figure below is a plausible flat, not this one. It is here
 * so the drawings, the checks and the pages can be seen working before the real
 * survey is typed in; see docs/measuring.md for what has to be measured, and
 * replace room by room.
 */
export const HOME: Home = {
  name: 'The flat',
  location: 'Placeholder — a 9.0 × 9.2 m single-floor plan',
  northOffset: 0,
  envelope: [
    { x: 0, y: 0 },
    { x: 9000, y: 0 },
    { x: 9000, y: 9200 },
    { x: 0, y: 9200 },
  ],
  walls: { exterior: 200, interior: 100 },
  ceiling: 2650,
  style: 'japandi',
  premise:
    'Eight rooms on one floor, of which only three are big enough to have a choice about anything. The design is mostly a set of decisions about which wall each large object has to go against, because at these dimensions there is rarely a second option. Everything here is drawn from measurements rather than sketched, so a piece that does not fit is visibly not fitting.',
  registeredArea: 82.8,
};

/** Ordered as they are walked through, not alphabetically. */
export const ROOMS: Room[] = [
  LIVING,
  BALCONY,
  KITCHEN,
  CORRIDOR,
  BATHROOM,
  UTILITY,
  BEDROOM_MAIN,
  BEDROOM_SECOND,
];

export const roomById = (id: string): Room | undefined => ROOMS.find((room) => room.id === id);

/** Rooms whose floor counts towards the living area, as against served space. */
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
