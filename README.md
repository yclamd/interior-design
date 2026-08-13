# interior-design

Interior design published as drawings rather than mood boards.

Every room is set out from measured dimensions in millimetres. The plans are
generated from those figures, not sketched, so a piece of furniture that does not
fit is visibly not fitting — and a set of checks says so in words as well.

Published at **https://yclamd.github.io/interior-design/**

**The figures currently published are placeholders**: an invented flat and an
invented single room, not real ones. They are there so the drawings, the checks and
the pages can be seen working before a survey is typed in, and between them they
exercise every part of the model. See [`docs/measuring.md`](docs/measuring.md) for
what to measure, and replace the rooms one file at a time.

## The shape of the thing

A **project** is one job. It may be a whole dwelling, a floor of one, or a single
room — those are the same thing in the data, a list of rooms with real sizes, and
only the overview page reads the room count to decide whether to summarise the
project or simply be the room.

A **room** is what is true of a space: where it sits, its outline, its ceiling
height, and its doorways. A **design** is what has been decided about it: the
palette, the floor and the furniture. A room carries at least one design and may
carry several, to be compared side by side.

That split is what lets two arrangements be drawn against one room without either
claiming to have moved a wall, and it is why comparing designs needs no change to
the check that rooms do not overlap — the room they share is still one room. The
cost is that a door cannot move between designs: an opening is shared with whatever
is on the far side, and the two sides are checked against each other. Comparing door
positions is a second project.

## What the site has

| Page | What is on it |
| --- | --- |
| `/` | Every project, each with its plan, its figures and its conflict count |
| `/projects/<p>` | The whole plan and every room's figures — or, for a one-room project, the room itself |
| `/projects/<p>/rooms` | One card per room, each framed on its own part of the same plan |
| `/projects/<p>/rooms/<room>` | The room at a closer scale, in its preferred design |
| `/projects/<p>/rooms/<room>/<design>` | An alternative design for the same room |
| `/projects/<p>/rooms/<room>/compare` | Every design for that room, side by side, with what each costs |
| `/styles` | The palettes and material lists, shared across projects |
| `/audit` | Every dimensional conflict on the site, on one page |
| `/method` | The survey sheet: what has to be measured, and what is checked |

## How the drawings work

Three decisions carry the whole thing.

**The SVG user unit is one millimetre.** Nothing in the geometry is scaled, so no
figure on the page is a rounded version of a rounded version. Square metres, pings
and metres are all derived at the moment of drawing. Stroke widths and type sizes
are given in pixels and converted, so a hairline stays a hairline whether the frame
holds one bathroom or a whole flat.

**Walls are not drawn.** The building envelope is filled, then every room is filled
on top of it, and what is left showing is the wall. Interior partitions therefore
come out at exactly the thickness the room origins imply and can never disagree with
them. Doors and windows are holes punched back through that fill, and the wall a
hole cuts counts as perimeter unless the far side is a room in the same project.

**Figures that can be computed are not stored.** The building outline is optional:
left out, it is taken as the rooms grown by one exterior wall, which is right for a
single room and for any plan whose perimeter follows its rooms. State it only when
the real outline differs — a building that is not a rectangle, or a deed drawing to
hold the plan against.

Each project has one plan coordinate space: `x` right, `y` down, origin at the
north-west inside corner. A room says where its own corner falls, and everything
inside it is measured from there. This is why the whole plan and the room plans
cannot disagree — a room page is the same drawing with the frame pulled in. Nothing
is ever compared across projects, so two projects may reuse room ids freely.

## What is checked

The checks in `src/lib/checks.ts` run on every build and print what they find on the
room pages and on `/audit`. None of them has an opinion about taste; each is a
statement about two dimensions that cannot both hold. A room with several designs is
checked once per design, because a conflict belongs to an arrangement rather than to
a space.

Conflicts: rooms overlapping, the two sides of one door recorded differently or not
at all, a piece outside its room, two pieces in the same place, a door leading
nowhere, a room with no design.

Tight fits: a leaf that sweeps through furniture, something standing in a doorway's
landing space, a piece eating into the clearance another one needs.

Notes: a blocked window, a door too narrow to carry furniture through, more than 45%
of the floor covered, a ceiling under 2.4 m, a drawn area far short of the deed.

## Project structure

```
src/
├── components/
│   ├── Plan.astro             # the drawing; whole project, one room, one design
│   ├── FurnitureSymbol.astro  # one piece, with its plan glyph
│   ├── RoomDetail.astro       # a room drawn and tabulated, shared by two page shapes
│   ├── Findings.astro         # check results
│   ├── Schedule.astro         # furniture schedule for one design
│   ├── StyleCard.astro        # a palette and its materials
│   └── BaseHead / Header / Footer.astro
├── data/
│   ├── types.ts               # Mm, Project, Room, Design, Opening, Furniture, StylePreset
│   ├── projects.ts            # the registry, and labels shared across projects
│   ├── styles.ts              # palettes and material lists
│   └── projects/
│       ├── _template-room.ts  # a room to copy
│       └── <project>/
│           ├── project.ts     # walls, ceiling, brief, optional envelope, room order
│           └── rooms/*.ts     # one file per room, each with one or more designs
├── lib/
│   ├── geometry.ts            # millimetre maths: outlines, rotation, overlap, areas
│   ├── plan.ts                # dataset to drawing: frames, openings, symbols
│   └── checks.ts              # everything a drawing can be checked for
├── layouts/BaseLayout.astro
├── pages/
└── styles/global.css          # Tailwind 4 theme tokens
docs/measuring.md              # the survey sheet
scripts/render-plans.py        # plans out of dist/ as PNGs, for printing
```

## Adding to it

**A room.** Copy `src/data/projects/_template-room.ts` into that project's `rooms/`,
fill it in, then import it in the project's `project.ts` and add it to `ROOMS` in the
order the space is walked through.

**A design.** Replace the room's `single({ … })` with a list of designs, each with
its own `id`, `name` and `furniture`, and mark one `preferred`. The comparison page
appears on its own once a room has more than one.

**A project.** Add a directory under `src/data/projects/` with a `project.ts` and a
`rooms/`, then register it in `src/data/projects.ts`. Leave out `envelope` unless the
real building outline is known.

Then `npm run build` and read `/audit`. Every shared door has to be listed by both
rooms with the same `id`; the checks compare the two entries and report any drift.

## Running it

Needs Node 22, which is what CI builds with.

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # astro check, no errors expected
npm run build      # static output in dist/
npm run plans      # dist/plans/*.png, needs python3 with cairosvg
```

Built with [Astro](https://astro.build) and Tailwind CSS 4, no front-end framework.
Every drawing is server-rendered SVG, and the site ships **no JavaScript at all** —
the only `<script>` on a page is its JSON-LD. The mobile menu is a `<details>`
element, and switching between designs is a link to another page. `npm run plans` is
a local convenience and is not part of the build.

## Deployment

GitHub Actions builds on every push and deploys `main` to GitHub Pages. The workflow
passes the deployed origin and sub-path in as `SITE_URL` and `BASE_PATH`, so the same
source builds correctly for a project page, a user page or a custom domain.

Two settings this depends on, worth knowing if it is ever set up again elsewhere.
**Settings → Pages → Build and deployment → Source** has to be **GitHub Actions**;
with it left on `Deploy from a branch`, `configure-pages` cannot find a Pages site
and the build fails at `Resolve Pages URL` before it ever reaches the build step.
And Pages will not serve a private repository on a free account, so publishing this
means the dimensions of everything drawn here are public too.
