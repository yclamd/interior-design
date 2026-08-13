# interior-design

The interior design of one home, published as drawings rather than mood boards.

Every room is set out from measured dimensions in millimetres. The plans are
generated from those figures, not sketched, so a piece of furniture that does not
fit is visibly not fitting — and a set of checks says so in words as well.

Published at **https://yclamd.github.io/interior-design/**

**The figures currently published are a placeholder**: a plausible 9.0 × 9.2 m flat,
not the one being designed. It is there so the drawings, the checks and the pages can
be seen working before the survey is typed in. See [`docs/measuring.md`](docs/measuring.md)
for what to measure, and replace the rooms one at a time.

## What the site has

| Page | What is on it |
| --- | --- |
| `/` | The whole floor plan, drawn to scale, with every room's figures |
| `/rooms` | One card per room, each framed on its own part of the same plan |
| `/rooms/<id>` | The room at a closer scale: dimensions, furniture schedule, doors and windows, and what its size rules out |
| `/styles` | The palettes and material lists the rooms are drawn from |
| `/audit` | Every dimensional conflict in the home, on one page |
| `/method` | The survey sheet: what has to be measured, and what is checked |

## How the drawings work

Two decisions carry the whole thing.

**The SVG user unit is one millimetre.** Nothing in the geometry is scaled, so no
figure on the page is a rounded version of a rounded version. Square metres, pings
and metres are all derived at the moment of drawing. Stroke widths and type sizes
are given in pixels and converted, so a hairline stays a hairline whether the frame
holds one bathroom or the whole flat.

**Walls are not drawn.** The building envelope is filled, then every room is filled
on top of it, and what is left showing is the wall. Interior partitions therefore
come out at exactly the thickness the room origins imply and can never disagree with
them. Doors and windows are holes punched back through that fill.

There is one plan coordinate space for the home: `x` right, `y` down, origin at the
north-west inside corner. A room says where its own corner falls, and everything
inside it is measured from there. This is why the whole-flat plan and the room plans
cannot disagree — a room page is the same drawing with the frame pulled in.

## What is checked

The checks in `src/lib/checks.ts` run on every build and print what they find on the
room pages and on `/audit`. None of them has an opinion about taste; each is a
statement about two dimensions that cannot both hold.

Conflicts: rooms overlapping, the two sides of one door recorded differently, a piece
outside its room, two pieces in the same place, a door leading nowhere.

Tight fits: a leaf that sweeps through furniture, something standing in a doorway's
landing space, a piece eating into the clearance another one needs.

Notes: a blocked window, a door too narrow to carry furniture through, more than 45%
of the floor covered, a ceiling under 2.4 m.

## Project structure

```
src/
├── components/
│   ├── Plan.astro             # the drawing; whole home and single room
│   ├── FurnitureSymbol.astro  # one piece, with its plan glyph
│   ├── Findings.astro         # check results
│   ├── Schedule.astro         # furniture schedule
│   ├── StyleCard.astro        # a palette and its materials
│   └── BaseHead / Header / Footer.astro
├── data/
│   ├── types.ts               # the vocabulary: Mm, Room, Opening, Furniture, StylePreset
│   ├── home.ts                # the home, and the room registry
│   ├── styles.ts              # palettes and material lists
│   └── rooms/                 # one file per room, plus _template.ts to copy
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

## Adding a room

1. Copy `src/data/rooms/_template.ts` to `src/data/rooms/<id>.ts` and fill it in.
2. Import it in `src/data/home.ts` and add it to `ROOMS`, in the order the home is
   walked through.
3. `npm run build`, then read `/audit`. Every shared door has to be listed by both
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
element. `npm run plans` is a local convenience and is not part of the build.

## Deployment

GitHub Actions builds on every push and deploys `main` to GitHub Pages. The workflow
passes the deployed origin and sub-path in as `SITE_URL` and `BASE_PATH`, so the same
source builds correctly for a project page, a user page or a custom domain.

For the first deploy, set **Settings → Pages → Build and deployment → Source** to
**GitHub Actions**. Without that the workflow builds and then fails to publish.
