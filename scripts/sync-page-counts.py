#!/usr/bin/env python3
"""Sync catalog HTML page counts from manuscript JSON."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "assets" / "content"

GUIDE_ORDER = [
    "micro-saas",
    "lazy-man-ai",
    "claude-freelancer",
    "ai-automation-agency",
    "ai-seo",
    "ai-email-agency",
    "landing-pages-48h",
    "ai-lead-gen",
    "claude-code-operators",
    "ai-content-engine",
]

FILES = [ROOT / "index.html", ROOT / "catalog.html", ROOT / "library.html"]


PREVIEW_RATIO = 0.15


def preview_page_count(total: int, hook_blocks: int = 3) -> int:
    if total <= 1:
        return 1
    content = total - 1
    ratio_based = max(1, round(content * PREVIEW_RATIO))
    hook_based = min(hook_blocks, content)
    min_locked = 2 if content >= 3 else 1
    max_preview_content = max(1, content - min_locked)
    preview_content = min(max_preview_content, max(ratio_based, hook_based))
    return 1 + preview_content


def load_stats() -> dict[str, dict[str, int]]:
    stats: dict[str, dict[str, int]] = {}
    for slug in GUIDE_ORDER:
        path = CONTENT / f"{slug}.json"
        guide = json.loads(path.read_text(encoding="utf-8"))
        total = guide["totalPages"]
        preview = preview_page_count(total, guide.get("hookBlocks", 3))
        stats[slug] = {
            "total": total,
            "preview": preview,
            "sealed": total - preview,
        }
    return stats


def patch_demo_index(text: str, demo: dict[str, int]) -> str:
    text = re.sub(
        r'(<p class="reading-demo__status">Preview active in your library · )\d+( pages total</p>)',
        rf"\g<1>{demo['total']}\2",
        text,
    )
    text = re.sub(
        r'aria-label="\d+ pages: \d+ open for preview, \d+ locked until unlock"',
        f'aria-label="{demo["total"]} pages: {demo["preview"]} open for preview, {demo["sealed"]} locked until unlock"',
        text,
    )
    text = re.sub(
        r'(<span>)\d+(–)\d+(</span>\s*\n\s*<strong>)\d+( pages free</strong>)',
        rf"\g<1>1\g<2>{demo['preview']}\g<3>{demo['preview']}\4",
        text,
        count=1,
    )
    text = re.sub(
        r'(<span>)\d+(–)\d+(</span>\s*\n\s*<strong>)\d+( pages locked</strong>)',
        rf"\g<1>{demo['preview'] + 1}\g<2>{demo['total']}\g<3>{demo['sealed']}\4",
        text,
        count=1,
    )
    text = re.sub(
        r'(<span class="reading-demo__stat-num">)\d+(</span>\s*\n\s*<span class="reading-demo__stat-label">pages reading now</span>)',
        rf"\g<1>{demo['preview']}\2",
        text,
        count=1,
    )
    text = re.sub(
        r'(<span class="reading-demo__stat-num">)\d+(</span>\s*\n\s*<span class="reading-demo__stat-label">pages to unlock</span>)',
        rf"\g<1>{demo['sealed']}\2",
        text,
        count=1,
    )
    text = re.sub(
        r'(<span class="reading-demo__stat-num">)\d+(</span>\s*\n\s*<span class="reading-demo__stat-label">pages in full edition</span>)',
        rf"\g<1>{demo['total']}\2",
        text,
        count=1,
    )
    text = re.sub(
        r'(<div class="page-map__segment page-map__segment--open" style="width: )[\d.]+%',
        rf"\g<1>{round(demo['preview'] / demo['total'] * 100, 2)}%",
        text,
        count=1,
    )
    return text


def patch_card(text: str, slug: str, info: dict[str, int]) -> str:
    block = re.search(
        rf'href="/reader\.html\?guide={re.escape(slug)}"',
        text,
    )
    if not block:
        return text

    start = text.rfind('<article', 0, block.start())
    end = text.find("</article>", block.start())
    if start == -1 or end == -1:
        return text

    chunk = text[start : end + len("</article>")]
    updated = chunk
    updated = re.sub(r"· \d+ pages", f"· {info['total']} pages", updated, count=1)
    updated = re.sub(
        r'<div class="guide-card__stats">\s*<span>[^<]*</span>\s*<span class="guide-card__stat--sealed">[^<]*</span>\s*</div>',
        '<div class="guide-card__stats"><span>Free Preview</span><span class="guide-card__stat--sealed">Full edition</span></div>',
        updated,
        count=1,
    )
    return text[:start] + updated + text[end + len("</article>") :]


def main() -> None:
    stats = load_stats()
    demo = stats["micro-saas"]

    for path in FILES:
        text = path.read_text(encoding="utf-8")
        original = text
        if path.name == "index.html":
            text = patch_demo_index(text, demo)
        for slug in GUIDE_ORDER:
            text = patch_card(text, slug, stats[slug])
        if text != original:
            path.write_text(text, encoding="utf-8")
            print(f"Updated {path.name}")
        else:
            print(f"No changes {path.name}")

    print("\nPage counts:")
    for slug in GUIDE_ORDER:
        info = stats[slug]
        print(f"  {slug}: {info['total']} total · {info['preview']} preview · {info['sealed']} sealed")


if __name__ == "__main__":
    main()
