#!/usr/bin/env python3
"""Remove dev wireframe zone-pill labels from public HTML."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    index = ROOT / "index.html"
    text = index.read_text(encoding="utf-8")
    text = re.sub(r'<span class="zone-pill">[^<]*</span>', "", text)
    text = text.replace('<span class="zone-marker">Trust strip</span>', "")
    text = text.replace('<p class="zone-marker reveal">Trust principles</p>', "")
    text = text.replace('<p class="zone-marker reveal zone-marker--block">Philosophy pair</p>', "")
    text = text.replace("20% free", "Free Preview")
    text = re.sub(r'data-version>v[0-9?]+', "data-version>v??", text)
    text = text.replace("read the first 20%", "read the Free Preview")
    index.write_text(text, encoding="utf-8")

    for path in ROOT.glob("*.html"):
        content = path.read_text(encoding="utf-8")
        updated = re.sub(r"data-version>v[0-9?]+", "data-version>v??", content)
        updated = updated.replace('data-version</span>', 'data-version>v??</span>')
        if updated != content:
            path.write_text(updated, encoding="utf-8")

    catalog = ROOT / "catalog.html"
    cat = catalog.read_text(encoding="utf-8")
    cat = cat.replace(
        "Free Preview on every title on every title.",
        "Free Preview on every title.",
    )
    catalog.write_text(cat, encoding="utf-8")
    print("Stripped wireframe labels from index.html and synced version placeholders.")


if __name__ == "__main__":
    main()
