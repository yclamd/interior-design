import { CHILDRENS_ROOM } from '~/data/projects/childrens-room/rooms/childrens-room';
import type { Room } from '~/data/types';

/**
 * The children's room, placed in the flat.
 *
 * It is not a second copy of it. The room was surveyed on its own before the flat was,
 * and it already carries its measured shell, its two openings and its three designs with
 * every piece of furniture in them; all of that is held in room-local coordinates, so
 * moving the room into the flat is a matter of saying where its north-west corner falls
 * and nothing else. Written out again here it would be a second set of figures to keep
 * in step, and the two would disagree the first time either was corrected.
 *
 * The position was given as north of the shower room with its east wall on the shower
 * room's, which fixes the east face at 5500 and the south face at 1020 north of it. Three
 * things then agree without being made to:
 *
 * Its 2550 width puts its west face at 2950, which is the shower room's west face too, so
 * the two rooms stack in one column.
 *
 * Its door is already in the east wall and already leads to the corridor, and the corridor
 * runs 5600 to 6500 — the far side of this room's east wall. It opens straight onto it.
 *
 * Its window is in the north wall, which out here is an outside wall.
 *
 * What it changes is the corridor. The door sits 3500 from this room's north end, which
 * puts it at −2020 to −1120 in the flat, and the corridor has to reach −2020 to serve it.
 * That is 1100 further north than the shower room's door asked for.
 */
export const CHILDRENS_ROOM_IN_FLAT: Room = {
  ...CHILDRENS_ROOM,
  /** East face on the shower room's at 5500, and one 100 wall north of it at −1020. */
  origin: { x: 2950, y: -5520 },
};
