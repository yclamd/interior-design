import { placed } from '~/lib/geometry';
import { single, type Room } from '~/data/types';

export const STUDY: Room = {
  id: 'study',
  name: 'The study',
  kind: 'study',
  /**
   * Set 200 mm in from the origin so the derived building outline starts at 0, 0.
   * Nothing depends on it — a single-room project has no other room to be placed
   * relative to — but it keeps the figures on the page tidy.
   */
  origin: { x: 200, y: 200 },
  shape: { kind: 'rect', width: 2600, depth: 3200 },
  ceiling: 2450,
  openings: [
    {
      id: 'study-door',
      kind: 'door-swing',
      side: 'north',
      offset: 300,
      width: 800,
      height: 2050,
      sill: 0,
      swing: 'left-in',
      /**
       * The hall is not drawn, because it is not part of this job. The wall is
       * therefore treated as the perimeter of what is being designed, which is what
       * it is from inside this room.
       */
      to: 'corridor',
    },
    {
      id: 'south-window',
      kind: 'window',
      side: 'south',
      offset: 600,
      width: 1400,
      height: 1400,
      sill: 800,
      to: 'outside',
    },
  ],
  designs: single({
    theme: 'A room to work in that has to sleep a guest twice a year',
    style: 'mid-century',
    floor: {
      name: 'Existing parquet, kept and re-oiled',
      colour: '#c9a074',
      pattern: 'plank',
      grain: 'ns',
      module: 160,
    },
    summary:
      'Two things want the same 900 mm: the pull-back for the desk chair, and the depth of a sofa bed. At 2.6 m wide the room can have both only if they do not share a line, so the sofa takes the west wall and the desk starts 950 mm in from it, which puts the desk under the window and clear of the sofa entirely. The desk top is 740 mm and the sill is 800 mm, so the worktop passes under the glass rather than blocking it. Shelving goes on the one piece of north wall the door does not need.',
    furniture: [
      placed(0, 1000, {
        id: 'sofa-bed',
        name: 'Sofa bed',
        kind: 'sofa',
        width: 1900,
        depth: 900,
        height: 780,
        rotation: 270,
        status: 'owned',
        material: 'Charcoal wool, walnut legs',
        note: 'Folds out east into the middle of the room, which is only in the way on the nights it is used.',
      }),
      placed(950, 2500, {
        id: 'desk',
        name: 'Desk',
        kind: 'desk',
        width: 1600,
        depth: 700,
        height: 740,
        clearance: { north: 900 },
        status: 'owned',
        material: 'Walnut veneer, tapered legs',
        note: 'Under the window and facing it. Starts 950 mm east so it never meets the sofa.',
      }),
      placed(1475, 1900, {
        id: 'desk-chair',
        name: 'Desk chair',
        kind: 'chair',
        width: 550,
        depth: 550,
        height: 900,
        status: 'owned',
      }),
      placed(1600, 0, {
        id: 'shelving',
        name: 'Shelving',
        kind: 'shelving',
        width: 800,
        depth: 300,
        height: 2000,
        status: 'planned',
        material: 'Walnut, four shelves, wall-fixed',
      }),
    ],
    openQuestions: [
      'The sofa bed folds out across the desk chair’s position, so the chair has to be moved on the nights it is used. Acceptable twice a year, and not if it turns out to be twice a month.',
      'No second light source. One pendant over a room this narrow will put the desk in its own shadow.',
    ],
  }),
};
