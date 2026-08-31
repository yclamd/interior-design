"""Wraps reads of now-localised fields in say(field, locale).

Written as a one-off for the pass that made the dataset's prose translatable. It is kept
because the same job comes back every time another field is localised, and because doing
it by hand across seventy-odd call sites is how one gets missed — a missed site does not
fail to compile, it renders [object Object] once the field actually has a translation.
"""

import pathlib
import re

ROOTS = [pathlib.Path("src/components"), pathlib.Path("src/pages")]

#: Fields that became Localised. The holder is matched loosely so that card.room.name,
#: choice.room.name and item.room.name are all caught alongside room.name.
FIELDS = {
    "name": r"(?:room|design|project|style|item)",
    "theme": r"(?:design)",
    "summary": r"(?:design)",
    "premise": r"(?:project|style)",
    "location": r"(?:project)",
}

#: Label maps whose values became Localised.
MAPS = ["KIND_LABELS", "SCOPE_LABELS", "GROUP_LABELS"]

changed = []

for root in ROOTS:
    for path in sorted(root.rglob("*.astro")):
        text = path.read_text(encoding="utf-8")
        original = text

        for field, holder in FIELDS.items():
            # A holder is an optional dotted prefix ending in one of the holder words.
            pattern = re.compile(rf"(?<!say\()\b((?:\w+\.)*{holder})\.{field}\b(?!\s*[,:])")
            text = pattern.sub(rf"say(\1.{field}, locale)", text)

        for name in MAPS:
            pattern = re.compile(rf"(?<!say\(){name}\[([^\]]+)\]")
            text = pattern.sub(rf"say({name}[\1], locale)", text)

        if text != original:
            path.write_text(text, encoding="utf-8")
            changed.append(str(path))

for path in changed:
    print("wrapped", path)
print(f"{len(changed)} files")
