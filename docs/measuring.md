# The survey sheet

What has to be measured before a room can be drawn, in the order it is easiest to
take. Everything is in **millimetres, as whole numbers**. Nothing else on the site
needs converting, because square metres, pings and metres are all worked out from
these at the moment of drawing.

The same list is published at `/method` on the site. This copy is the one to print
and write on.

---

## Before anything else: one origin for the whole home

Pick the **north-west inside corner of the building** and call it `0, 0`. From
there, `x` runs east and `y` runs south. Every room states where its own north-west
inside corner falls in that space, and everything inside a room is then measured
from the room's own corner.

Pick which way is up on the plan and keep it. If plan-up is not true north, record
how many degrees off it is as `northOffset`, and the compass will point correctly.

```
        x →
   0,0 ┌──────────────────────────┐
       │  ┌────────┐              │
   y   │  │ room   │ origin is    │
   ↓   │  │        │ this corner  │
       │  └────────┘              │
       └──────────────────────────┘
```

---

## 1. The home, measured once

| Field | Unit | What to take |
| --- | --- | --- |
| `envelope` | mm | Outer face of the building, clockwise from `0,0`. A rectangle is four points. |
| `walls.exterior` | mm | Perimeter wall, finish face to finish face. Commonly 150–250. |
| `walls.interior` | mm | A partition. Commonly 80–120. Used wherever two rooms sit apart. |
| `ceiling` | mm | Floor to ceiling, clear. The default for rooms that do not state their own. |
| `northOffset` | degrees | How far plan-up is from true north. `0` if plan-up is north. |
| `registeredArea` | m² | The figure on the deed. Published beside the area the drawing measures. |
| `name`, `location`, `premise` | text | Whatever is worth publishing. |

Take the envelope with the longest tape you have, along the outside if you can get
to it, and check the diagonal — if the two diagonals of a supposedly rectangular
flat differ by more than about 20 mm, the walls are not square and the rooms want
tracing as polygons rather than rectangles.

---

## 2. Each room

One file per room in `src/data/rooms/`.

| Field | Unit | What to take |
| --- | --- | --- |
| `id` | slug | `main-bedroom`. Becomes the URL, and the name other rooms use across a door. |
| `origin` | mm point | The room's north-west inside corner, in home coordinates. |
| `shape` | mm | `{ kind: 'rect', width, depth }`, or a clockwise polygon of inside corners. |
| `ceiling` | mm | Clear height in this room. Note any bulkhead separately. |
| `theme` | text | What the room has to do. One line. |
| `summary` | text | How it is meant to work. A paragraph; it is the room's page. |
| `style` | key | One of the styles in `src/data/styles.ts`. Sets the drawing's colours. |
| `floor` | text + hex | The finish, and the colour to fill the room with. |
| `openQuestions` | text[] | Anything still undecided. Printed as-is. |

**Measure the width in three places** — at each end and in the middle. If they
differ, use the smallest, because that is what furniture has to pass.

Blank to fill in:

```
Room ______________________  id ______________________

origin      x __________  y __________
size        width __________  depth __________     (or trace a polygon)
ceiling     __________       bulkhead? __________
style       __________       floor ______________________
```

---

## 3. Each door and window

Take these with the tape held flat against the wall. Both rooms either side of an
interior door list it, using **the same `id`** — the checks compare the two and
report any disagreement, so this is worth doing rather than skipping.

| Field | Unit | What to take |
| --- | --- | --- |
| `side` | n/e/s/w | Which wall it is in. |
| `offset` | mm | Along that wall to the **near edge**: from the west end on north and south walls, from the north end on east and west walls. |
| `width` | mm | The structural opening, not the leaf and not the glass. |
| `height` | mm | Same. |
| `sill` | mm | Floor to the underside. `0` for a door. |
| `kind` | enum | `door-swing`, `door-sliding`, `door-pocket`, `door-folding`, `door-french`, `window`, `window-floor`, `opening`. |
| `swing` | enum | `left-in`, `left-out`, `right-in`, `right-out`. Hinge side first, then whether the leaf comes into this room. Judged standing in the room the entry is written under. |
| `to` | room id | The room on the other side, or `outside`. |

Blank to fill in, one line each:

```
side   offset   width   height   sill    kind            swing        to
_____  _______  ______  _______  ______  ______________  ___________  __________
_____  _______  ______  _______  ______  ______________  ___________  __________
```

---

## 4. Each piece of furniture

Sizes come from the catalogue; positions come from the floor.

| Field | Unit | What to take |
| --- | --- | --- |
| `width`, `depth`, `height` | mm | The piece's own size. Depth is front to back **before** it is turned. |
| `x`, `y` | mm | North-west corner of the floor it covers, from the room's own north-west corner. |
| `rotation` | degrees | Clockwise. A piece faces **south** at `0`, so `90` faces west, `180` north, `270` east. |
| `clearance` | mm per face | What must stay empty for it to be usable. Given per face, and turned with the piece. |
| `mountedAt` | mm | Underside height if wall-hung. Such a piece is drawn but takes no floor. |
| `symbol` | enum | `wc`, `basin`, `shower`, `tub`, `sink`, `hob`, `drum`, for fittings with a conventional glyph. |
| `status` | enum | `owned`, `ordered`, `planned`, `considering`. |
| `material`, `colour`, `source`, `note` | text | `colour` is a hex and overrides the style's fill for that piece. |

Use `placed(x, y, { … })` from `~/lib/geometry` and give `x, y` as the corner of
the floor the piece **ends up** covering. That is what a tape measure produces; the
helper works back to the anchor the drawing needs. It only accepts right-angle
rotations, which is all a room usually needs.

### Clearances worth using

| Piece | Face | Depth |
| --- | --- | --- |
| Wardrobe, hinged doors | front | 900 |
| Wardrobe, sliding doors | front | 600 |
| Chest of drawers | front | 750 |
| Desk or dining chair | seat side | 750–900 |
| Bed, to get in | one long side | 600 |
| Kitchen run facing another | between | 1000–1200 |
| Anything you walk past | side | 600 |

Blank to fill in:

```
name ______________________  kind ____________  status __________
W ________  D ________  H ________   rotation ______
x ________  y ________            clearance ____________________
```

---

## 5. Type it in, then read the audit

```bash
npm run build
```

Then open `/audit`, which lists every conflict in the home on one page. Work down
it until it is empty, or until what is left is a decision rather than a mistake.
The checks are all dimensional; none of them has an opinion about taste.

The `error` findings are worth fixing before anything else, because they usually
mean a figure was written down wrong rather than that a room is badly designed:

- `rooms-overlap` — two rooms claim the same floor, so one `origin` is wrong.
- `opening-drift` — the two sides of one door disagree, so one `offset` is wrong.
- `outside-room` — a piece sticks out of the room, so either its `x, y` or the
  room's `shape` is wrong.

To get pictures out for a contractor:

```bash
npm run build && npm run plans     # writes dist/plans/*.png
```
