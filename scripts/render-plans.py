#!/usr/bin/env python3
"""Renders the plans out of a built site into PNGs.

The drawings on the site are inline SVG, which is right for the web and useless
for handing to a contractor. This pulls each one out of dist/ and rasterises it,
so there is a picture to print, measure against or attach to a message.

    npm run build && python3 scripts/render-plans.py

Needs cairosvg (pip install cairosvg). It is not part of the build, and CI does
not run it.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

try:
    import cairosvg
except ImportError:
    sys.exit("cairosvg is not installed. Try: pip install cairosvg")

DIST = Path("dist")
OUT = DIST / "plans"
WIDTH = 2000

SVG_NAMESPACE = 'xmlns="http://www.w3.org/2000/svg"'


def pages() -> list[tuple[str, Path]]:
    """Every built page that carries a plan, named after its route."""
    found: list[tuple[str, Path]] = []
    for path in sorted(DIST.rglob("index.html")):
        route = path.parent.relative_to(DIST).as_posix()
        found.append(("home" if route == "." else route.replace("/", "-"), path))
    return found


def plan_svg(html: str) -> str | None:
    """
    A page also carries the header's logo and its menu icon, so the plan is picked
    out by the title it labels itself with rather than by being the biggest.

    Astro scopes styled components with a valueless data attribute, which is legal
    HTML and not legal XML, so those are dropped before an XML parser sees it.
    """
    drawings = [
        svg
        for svg in re.findall(r"<svg\b.*?</svg>", html, re.S)
        if 'aria-labelledby="plan-title-' in svg
    ]
    if not drawings:
        return None
    plan = max(drawings, key=len)
    plan = re.sub(r"\s+data-astro-cid-[\w-]+(?=[\s>])", "", plan)
    return plan if "xmlns" in plan[:200] else plan.replace("<svg", f"<svg {SVG_NAMESPACE}", 1)


def main() -> int:
    if not DIST.is_dir():
        sys.exit("No dist/ directory. Run npm run build first.")

    OUT.mkdir(parents=True, exist_ok=True)
    written = 0

    for name, path in pages():
        svg = plan_svg(path.read_text(encoding="utf-8"))
        if svg is None:
            continue
        target = OUT / f"{name}.png"
        cairosvg.svg2png(
            bytestring=svg.encode("utf-8"),
            write_to=str(target),
            output_width=WIDTH,
            background_color="#f7f4ee",
        )
        print(f"{target}  ({target.stat().st_size // 1024} kB)")
        written += 1

    if written == 0:
        sys.exit("Found no plans in dist/. Has the site changed shape?")
    print(f"\n{written} plans rendered at {WIDTH} px wide.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
