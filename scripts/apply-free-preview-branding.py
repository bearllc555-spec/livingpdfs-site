#!/usr/bin/env python3
"""Apply Free Preview branding to static HTML pages."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = [ROOT / "index.html", ROOT / "catalog.html", ROOT / "library.html", ROOT / "pricing.html"]

REPLACEMENTS = [
    (re.compile(r"<span class=\"tag tag--preview\">Preview</span>"), '<span class="tag tag--preview">Free Preview</span>'),
    (re.compile(r"Preview the first 20% free \(7 pages\)"), "Free Preview on every title"),
    (re.compile(r"Preview the first 20% free"), "Free Preview"),
    (re.compile(r"Preview active in your library"), "Free Preview active in your library"),
    (re.compile(r"Preview\. Unlock\. Stay current\."), "Free Preview. Unlock. Stay current."),
    (re.compile(r">Preview<"), ">Free Preview<"),
    (re.compile(r"Preview before you buy"), "Free Preview before you buy"),
    (re.compile(r"content=\"Preview premium PDFs free"), 'content="Free Preview on premium PDFs'),
    (re.compile(r"Your library always has the latest edition\. Preview the first 20% free \(7 pages\), unlock once,"),
     "Your library always has the latest edition. Start with a Free Preview, unlock once,"),
    (re.compile(r"locked pages stay visible"), "the full edition stays visible behind the preview"),
    (re.compile(r"<div class=\"guide-card__stats\">\s*<span>\d+ free pages</span>\s*<span class=\"guide-card__stat--sealed\">\d+ sealed</span>\s*</div>"),
     '<div class="guide-card__stats"><span>Free Preview</span><span class="guide-card__stat--sealed">Full edition</span></div>'),
    (re.compile(r"<strong>\d+ pages free</strong>"), "<strong>Free Preview</strong>"),
    (re.compile(r"<strong>\d+ pages locked</strong>"), "<strong>Full edition</strong>"),
    (re.compile(r"aria-label=\"\d+ pages: \d+ open for preview, \d+ locked until unlock\""),
     'aria-label="Free Preview open now, full edition locked until unlock"'),
]


def main() -> None:
    for path in FILES:
        text = path.read_text(encoding="utf-8")
        original = text
        for pattern, replacement in REPLACEMENTS:
            text = pattern.sub(replacement, text)
        if text != original:
            path.write_text(text, encoding="utf-8")
            print(f"Updated {path.name}")


if __name__ == "__main__":
    main()
