"""Prints the findings for one project, read back off the built audit page.

Reading the published page is a way of checking what a change did without writing a
second implementation of the checks for the first one to disagree with.
"""

import html
import re
import sys

PROJECT = sys.argv[1] if len(sys.argv) > 1 else "home"

page = open("dist/audit/index.html", encoding="utf-8").read()
page = re.sub(r"<script.*?</script>", "", page, flags=re.S)

start = page.find(f'id="{PROJECT}"')
if start < 0:
    raise SystemExit(f"no section for {PROJECT}")
"""Only project sections carry an id, so that is what bounds this one — the Findings
component nests sections of its own inside it."""
end = page.find('<section id="', start + 1)
body = page[start : end if end > 0 else len(page)]

lines = [
    re.sub(r"\s+", " ", html.unescape(line)).strip()
    for line in re.sub(r"<[^>]+>", "\n", body).split("\n")
]
for line in lines:
    if len(line) > 3:
        print(line)
