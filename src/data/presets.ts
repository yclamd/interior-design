import type { CatalogueId } from './catalogue';
import type { Localised } from '~/i18n';
import type { Mm, RoomKind, Side } from './types';

/**
 * Rooms to start from.
 *
 * Nobody wants to describe a room from an empty form, and an empty form is also the one
 * starting point guaranteed to fail every check the site makes: no door, no window, no
 * furniture to judge the size against. So the planner opens on a room instead.
 *
 * Each of these is a plausible room of its kind — a real size, a door where a door goes,
 * a window on an outside wall, and enough furniture to see whether the proportions work.
 * They are starting points to push around rather than answers, and check-presets asserts
 * that every one of them passes the checks, so the tool can never open on a drawing it
 * would itself flag.
 */

export interface Preset {
  id: string;
  label: Localised;
  kind: RoomKind;
  width: Mm;
  depth: Mm;
  /** Sides with no wall, for a room that is part of something larger. */
  open: Side[];
  openings: { kind: 'door-swing' | 'window'; side: Side; offset: Mm; width: Mm }[];
  pieces: { ref: CatalogueId; x: Mm; y: Mm; rotation?: number }[];
}

/**
 * Positions are measured from the inside face of the north-west corner, so 0,0 is the
 * corner of the floor rather than the corner of the building. That is what somebody with
 * a tape measure standing in the room produces, and it means a preset does not have to
 * know how thick the walls are.
 */
export const PRESETS: Preset[] = [
  {
    id: 'living',
    label: { en: 'Living room', zh: '客廳' },
    kind: 'living',
    width: 3400,
    depth: 3050,
    open: [],
    /**
     * Door on the west wall and window on the east, so that neither lands behind the
     * sofa: a plan with a door opening into the back of a three-seater is the sort of
     * thing that gets drawn when the openings are placed before the furniture.
     */
    openings: [
      { kind: 'door-swing', side: 'west', offset: 2000, width: 900 },
      { kind: 'window', side: 'east', offset: 1300, width: 1600 },
    ],
    pieces: [
      { ref: 'rug-flatweave', x: 500, y: 900 },
      { ref: 'sofa-three-seat', x: 900, y: 2100, rotation: 180 },
      { ref: 'table-coffee', x: 1440, y: 1150 },
      { ref: 'armchair-750', x: 2600, y: 300, rotation: 90 },
    ],
  },
  {
    id: 'bedroom',
    label: { en: 'Bedroom', zh: '主臥' },
    kind: 'bedroom',
    width: 3300,
    depth: 3600,
    open: [],
    openings: [
      { kind: 'door-swing', side: 'south', offset: 400, width: 800 },
      { kind: 'window', side: 'east', offset: 400, width: 1500 },
    ],
    /**
     * The bed's head against the north wall, which leaves the wardrobe its 900 mm of
     * standing room. Two hundred further south and the foot of the bed is in it.
     */
    pieces: [
      { ref: 'bed-double', x: 700, y: 0 },
      { ref: 'bedside-table', x: 200, y: 0 },
      /** Facing into the room, which is the only way a wardrobe is any use. */
      { ref: 'wardrobe-1200', x: 1500, y: 3000, rotation: 180 },
    ],
  },
  {
    id: 'childrens',
    label: { en: "Child's room", zh: '兒童房' },
    kind: 'bedroom',
    width: 2600,
    depth: 3000,
    open: [],
    openings: [
      { kind: 'door-swing', side: 'south', offset: 400, width: 800 },
      { kind: 'window', side: 'north', offset: 1200, width: 1200 },
    ],
    pieces: [
      { ref: 'bed-single', x: 0, y: 0 },
      { ref: 'desk-1100', x: 2000, y: 200, rotation: 90 },
      { ref: 'chair-desk', x: 1450, y: 500 },
      { ref: 'shelving-toy-bins', x: 1600, y: 2600, rotation: 180 },
    ],
  },
  {
    id: 'dining',
    label: { en: 'Dining', zh: '餐廳' },
    kind: 'dining',
    width: 2800,
    depth: 3000,
    /**
     * Open to the west, because a dining room is usually part of something larger. It has
     * no door of its own and does not want one; the open side is the way in.
     */
    open: ['west'],
    openings: [{ kind: 'window', side: 'east', offset: 800, width: 1400 }],
    pieces: [
      { ref: 'table-dining-1500', x: 650, y: 1050 },
      { ref: 'chair-dining', x: 800, y: 550 },
      { ref: 'chair-dining', x: 1500, y: 550 },
      { ref: 'chair-dining', x: 800, y: 2000, rotation: 180 },
      { ref: 'chair-dining', x: 1500, y: 2000, rotation: 180 },
    ],
  },
  {
    id: 'study',
    label: { en: 'Study', zh: '書房' },
    kind: 'study',
    width: 2400,
    depth: 2600,
    open: [],
    openings: [
      { kind: 'door-swing', side: 'south', offset: 800, width: 800 },
      { kind: 'window', side: 'east', offset: 300, width: 1200 },
    ],
    pieces: [
      { ref: 'desk-1200', x: 400, y: 0 },
      { ref: 'chair-desk', x: 800, y: 700 },
      { ref: 'bookshelf-490', x: 2120, y: 1600, rotation: 90 },
    ],
  },
  {
    id: 'bathroom',
    label: { en: 'Bathroom', zh: '衛浴' },
    kind: 'bathroom',
    width: 1700,
    depth: 2400,
    open: [],
    /** No window, and none wanted: a bathroom is not a room the daylight check applies to. */
    openings: [{ kind: 'door-swing', side: 'south', offset: 700, width: 700 }],
    pieces: [
      { ref: 'washbasin-600', x: 0, y: 0 },
      { ref: 'shower-900', x: 800, y: 0 },
      { ref: 'wc-wall-hung', x: 100, y: 1600 },
    ],
  },
];
