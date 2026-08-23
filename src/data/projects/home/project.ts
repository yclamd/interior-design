import type { Project, Room } from '~/data/types';
import { DINING } from './rooms/dining';
import { ENTRY } from './rooms/entry';
import { CHILDRENS_ROOM_IN_FLAT } from './rooms/childrens-room';
import { GUEST_BATHROOM } from './rooms/guest-bathroom';
import { GUEST_BEDROOM } from './rooms/guest-bedroom';
import { KITCHEN } from './rooms/kitchen';
import { LIVING } from './rooms/living';
import {
  RAIN_SHELTER_CHILDRENS,
  RAIN_SHELTER_GUEST,
  RAIN_SHELTER_LIVING,
} from './rooms/rain-shelters';

/**
 * The flat itself, being surveyed room by room.
 *
 * Seven rooms so far. Three run in a line from the front door to the east window and are
 * arranged in detail. The children's room is arranged too — it was surveyed as a project
 * of its own before the flat was, and it is that same room placed here rather than a copy
 * of it, so its furniture and its three designs come with it and correcting either
 * corrects both. Three more — kitchen, guest shower room and guest room — are measured
 * and drawn as empty shells, because a measured shell is worth having and invented
 * furniture is not. Three rain shelters hang off the outside: two on the east face, which
 * steps between them, and one on the north over the children's room's window.
 *
 * What is missing is the main bedroom, the back balcony, and the corridor that joins the
 * two halves. The corridor's absence shows: the opening in the dining room's north wall
 * leads to a hatched strip between the shower room and the guest room, drawn as far north
 * as the children's room's door needs it to reach and no further.
 *
 * The envelope is stated rather than derived, because the building steps: the living
 * room is 450 deeper than the dining room and they share their south wall, so the
 * north face moves out 450 mm across the east end. Derived from the rooms it would
 * come out as a plain rectangle and lose the step.
 */
export const PROJECT: Project = {
  id: 'home',
  name: 'The flat',
  location: 'Being surveyed — seven rooms and three rain shelters drawn so far',
  scope: 'home',
  /** Assumed: plan-up is north. The living room's window faces east, which fits. */
  northOffset: 0,
  /**
   * The outline of what has been surveyed, one 100 mm wall outside every room in it.
   * It is not the outline of the building, because three rooms of the private half are
   * still to come and each will push it further north. Traced clockwise from the
   * kitchen's north-west corner:
   *
   * north of the kitchen at −1550, out to −5620 over the children's room, back to −2120
   * across the corridor, out again to −2680 over the guest room; down its east face at
   * 9650, in to the living room's at 9100, and along the south at 3350.
   *
   * Two of these are provisional. The −2120 across the corridor is where the corridor is
   * known to reach and not where it ends: the children's room's door fixes it as far
   * north as −2020, and the two rooms still to come will take it further. And 9650 is
   * only there because the guest room's east–west position follows from the 900 corridor
   * rather than from any measurement of the outside wall.
   */
  envelope: [
    { x: 100, y: -1550 },
    { x: 2850, y: -1550 },
    { x: 2850, y: -5620 },
    { x: 5600, y: -5620 },
    { x: 5600, y: -2120 },
    { x: 6500, y: -2120 },
    { x: 6500, y: -2680 },
    { x: 9650, y: -2680 },
    { x: 9650, y: 200 },
    { x: 9100, y: 200 },
    { x: 9100, y: 3350 },
    { x: 100, y: 3350 },
  ],
  /**
   * Floor known not to be wall and not yet surveyed.
   *
   * The 1.65 by 1.3 m behind the entry's cabinet run: the entry is 1300 deep against the
   * dining room's 2600, and what fills the difference is not known.
   *
   * And the corridor, 900 wide, running from the dining room's north wall up the far side
   * of the shower room and the children's room, with the guest room down its other flank.
   * Its width and both its sides are fixed by measurement; only its north end is not, and
   * it is drawn to −2020 because that is where the children's room's door needs it to
   * reach. Hatched rather than drawn as a room for that reason. Left out of this list it
   * would come out as solid wall with four doors opening into it.
   */
  unsurveyed: [
    [
      { x: 200, y: 1950 },
      { x: 1850, y: 1950 },
      { x: 1850, y: 3250 },
      { x: 200, y: 3250 },
    ],
    [
      { x: 5600, y: -2020 },
      { x: 6500, y: -2020 },
      { x: 6500, y: 200 },
      { x: 5600, y: 200 },
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
    'The public half was drawn first. Entry, dining and living run west to east in one open line with no partition between them: you come in the west wall, the shoe run turns the corner into 2.6 m of fitted storage, and the flat opens out to a window at the far end. Beyond that window a 1 m rain shelter runs the full width of the living room — the only outdoor space here, reachable only over the sill, and the one place a plant makes sense. North of that line the private half is arriving a room at a time: the kitchen sits behind the entry with a sliding door onto it, the guest shower room behind the dining room, and the guest room behind the living room, all three measured and none of them furnished. A 900 mm opening in the dining room’s north wall is the way between the two halves, and the corridor it leads to is the piece still missing, along with the main bedroom, the children’s room and the back balcony. Everything here is geometry rather than design: the point of drawing it this early is that a room in the wrong place is obvious on a plan and invisible in a list of measurements.',
};

export const ROOMS: Room[] = [
  ENTRY,
  KITCHEN,
  DINING,
  GUEST_BATHROOM,
  LIVING,
  GUEST_BEDROOM,
  CHILDRENS_ROOM_IN_FLAT,
  RAIN_SHELTER_LIVING,
  RAIN_SHELTER_GUEST,
  RAIN_SHELTER_CHILDRENS,
];
