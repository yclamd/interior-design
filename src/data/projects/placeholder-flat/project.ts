import type { Project, Room } from '~/data/types';
import { BALCONY } from './rooms/balcony';
import { BATHROOM } from './rooms/bathroom';
import { BEDROOM_MAIN } from './rooms/bedroom-main';
import { BEDROOM_SECOND } from './rooms/bedroom-second';
import { CORRIDOR } from './rooms/corridor';
import { KITCHEN } from './rooms/kitchen';
import { LIVING } from './rooms/living';
import { UTILITY } from './rooms/utility';

/**
 * PLACEHOLDER. Every figure below is a plausible flat, not a real one. It is here
 * so the drawings, the checks and the pages can be seen working before a survey is
 * typed in; see docs/measuring.md for what has to be measured.
 */
export const PROJECT: Project = {
  id: 'placeholder-flat',
  /**
   * Named for what it is. It shared the real flat's name until both appeared in the
   * same menu, one under the other, and nothing but the room count told them apart.
   */
  name: { en: 'Placeholder flat', zh: '示範住宅' },
  location: 'Placeholder — a 9.0 × 9.2 m single-floor plan',
  scope: 'home',
  northOffset: 0,
  /**
   * Stated rather than derived, because a real deed drawing would state it. Taking
   * it out would give almost the same rectangle, from the rooms plus one wall.
   */
  envelope: [
    { x: 100, y: 100 },
    { x: 8900, y: 100 },
    { x: 8900, y: 9100 },
    { x: 100, y: 9100 },
  ],
  walls: { exterior: 100, interior: 100 },
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
