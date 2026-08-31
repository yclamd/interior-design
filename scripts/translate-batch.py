"""Applies one batch of translations to the dataset.

Each entry pairs the exact English source line with the localised form to put in its
place, so the substitution is unambiguous and a source line that has already been
translated, or has since been edited, is reported rather than silently skipped. Run it,
read the misses, fix them, run again.
"""

import pathlib
import sys

Q = "'"

#: file -> [(exact source fragment, replacement)]
BATCH: dict[str, list[tuple[str, str]]] = {
    "src/data/projects/home/rooms/entry.ts": [
        ("  name: 'Entry',", "  name: { en: 'Entry', zh: '玄關' },"),
    ],
    "src/data/projects/home/rooms/dining.ts": [
        ("  name: 'Dining',", "  name: { en: 'Dining', zh: '餐廳' },"),
    ],
    "src/data/projects/home/rooms/living.ts": [
        ("  name: 'Living',", "  name: { en: 'Living', zh: '客廳' },"),
    ],
    "src/data/projects/home/rooms/kitchen.ts": [
        ("  name: 'Kitchen',", "  name: { en: 'Kitchen', zh: '廚房' },"),
    ],
    "src/data/projects/home/rooms/guest-bathroom.ts": [
        (
            "  name: 'Guest shower room',",
            "  name: { en: 'Guest shower room', zh: '客用衛浴' },",
        ),
    ],
    "src/data/projects/home/rooms/guest-bedroom.ts": [
        ("  name: 'Guest room',", "  name: { en: 'Guest room', zh: '客臥' },"),
    ],
    "src/data/projects/home/rooms/rain-shelters.ts": [
        (
            "  name: 'Rain shelter, living',",
            "  name: { en: 'Rain shelter, living', zh: '雨遮，客廳' },",
        ),
        (
            "  name: 'Rain shelter, guest',",
            "  name: { en: 'Rain shelter, guest', zh: '雨遮，客臥' },",
        ),
        (
            '  name: "Rain shelter, children\'s",',
            "  name: { en: \"Rain shelter, children's\", zh: '雨遮，小孩房' },",
        ),
    ],
    "src/data/projects/childrens-room/rooms/childrens-room.ts": [
        (
            '  name: "Children\'s room",',
            "  name: { en: \"Children's room\", zh: '小孩房' },",
        ),
    ],
    "src/data/projects/childrens-room/project.ts": [
        (
            '  name: "The children\'s room",',
            "  name: { en: \"The children's room\", zh: '小孩房' },",
        ),
    ],
    "src/data/projects/placeholder-flat/project.ts": [
        (
            "  name: 'Placeholder flat',",
            "  name: { en: 'Placeholder flat', zh: '示範住宅' },",
        ),
    ],
    "src/data/projects/study-nook/project.ts": [
        ("  name: 'The study',", "  name: { en: 'The study', zh: '書房' },"),
    ],
    "src/data/projects/study-nook/rooms/study.ts": [
        ("  name: 'The study',", "  name: { en: 'The study', zh: '書房' },"),
    ],
    "src/data/projects/placeholder-flat/rooms/balcony.ts": [
        ("  name: 'Balcony',", "  name: { en: 'Balcony', zh: '陽台' },"),
    ],
    "src/data/projects/placeholder-flat/rooms/bathroom.ts": [
        ("  name: 'Bathroom',", "  name: { en: 'Bathroom', zh: '衛浴' },"),
    ],
    "src/data/projects/placeholder-flat/rooms/bedroom-main.ts": [
        ("  name: 'Main bedroom',", "  name: { en: 'Main bedroom', zh: '主臥' },"),
    ],
    "src/data/projects/placeholder-flat/rooms/bedroom-second.ts": [
        ("  name: 'Second bedroom',", "  name: { en: 'Second bedroom', zh: '次臥' },"),
    ],
    "src/data/projects/placeholder-flat/rooms/corridor.ts": [
        ("  name: 'Hall',", "  name: { en: 'Hall', zh: '走廊' },"),
    ],
    "src/data/projects/placeholder-flat/rooms/kitchen.ts": [
        ("  name: 'Kitchen',", "  name: { en: 'Kitchen', zh: '廚房' },"),
    ],
    "src/data/projects/placeholder-flat/rooms/living.ts": [
        (
            "  name: 'Living and dining',",
            "  name: { en: 'Living and dining', zh: '客餐廳' },",
        ),
    ],
    "src/data/projects/placeholder-flat/rooms/utility.ts": [
        ("  name: 'Utility room',", "  name: { en: 'Utility room', zh: '工作間' },"),
    ],
}

misses = 0
for name, pairs in BATCH.items():
    path = pathlib.Path(name)
    text = path.read_text(encoding="utf-8")
    for source, replacement in pairs:
        if source not in text:
            print(f"MISS {name}: {source.strip()[:70]}")
            misses += 1
            continue
        text = text.replace(source, replacement, 1)
    path.write_text(text, encoding="utf-8")

print(f"{len(BATCH)} files, {misses} misses")
sys.exit(1 if misses else 0)
