#!/usr/bin/env python3
"""Generate hook-block figures (indices 00–02) for LivingPDF guides."""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from figure_styles import STYLES, render_figure

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "assets" / "content"
FIGURES = ROOT / "assets" / "figures"
WIDTH = 680

# slug -> (index, style_name) — explicit variety, no shared 4-box template
HOOK_STYLE_MAP: dict[str, list[tuple[int, str]]] = {
    "claude-freelancer": [
        (0, "engraving_bw"),
        (1, "bar_chart"),
        (2, "newspaper"),
    ],
    "ai-automation-agency": [
        (0, "blueprint"),
        (1, "isometric"),
        (2, "organic_flow"),
    ],
    "ai-seo": [
        (0, "halftone"),
        (1, "venn_diagram"),
        (2, "heatmap"),
    ],
    "ai-email-agency": [
        (0, "collage"),
        (1, "timeline"),
        (2, "polaroid"),
    ],
    "landing-pages-48h": [
        (0, "ink_sketch"),
        (1, "blueprint"),
        (2, "timeline"),
    ],
    "ai-lead-gen": [
        (0, "stipple"),
        (1, "organic_flow"),
        (2, "bar_chart"),
    ],
    "claude-code-operators": [
        (0, "isometric"),
        (1, "timeline"),
        (2, "woodcut"),
    ],
    "ai-content-engine": [
        (0, "collage"),
        (1, "timeline"),
        (2, "newspaper"),
    ],
}

STYLE_BY_NAME = {fn.__name__: fn for fn in STYLES}

GUIDES = [
    "claude-freelancer",
    "ai-automation-agency",
    "ai-seo",
    "ai-email-agency",
    "landing-pages-48h",
    "ai-lead-gen",
    "claude-code-operators",
    "ai-content-engine",
]


def label_for_block(block: dict) -> str:
    fig = block.get("figure") or ""
    if fig.startswith(("loop:", "flow:", "stages:", "table:")):
        return fig.split(":", 1)[-1].replace("→", " → ")[:56]
    return fig or block.get("heading", "Figure")[:56]


def main() -> None:
    FIGURES.mkdir(parents=True, exist_ok=True)
    created: list[str] = []

    for slug in GUIDES:
        path = CONTENT / f"{slug}.json"
        if not path.is_file():
            print(f"SKIP missing {path}")
            continue

        guide = json.loads(path.read_text(encoding="utf-8"))
        blocks = guide.get("blocks") or []
        assignments = HOOK_STYLE_MAP.get(slug, [(i, "engraving_bw") for i in range(3)])

        for index, style_name in assignments:
            if index >= len(blocks):
                print(f"SKIP {slug}-{index:02d}: block missing")
                continue

            block = blocks[index]
            label = label_for_block(block)
            heading = block.get("heading", label)
            renderer = STYLE_BY_NAME.get(style_name)
            if renderer is None:
                img = render_figure(slug, index, label, heading)
            else:
                img = renderer(slug, index, label, heading)

            if img.width != WIDTH:
                ratio = WIDTH / img.width
                new_h = max(1, int(img.height * ratio))
                img = img.resize((WIDTH, new_h), resample=3)  # LANCZOS

            out = FIGURES / f"{slug}-{index:02d}.png"
            img.save(out, format="PNG", optimize=True)
            rel = f"/assets/figures/{slug}-{index:02d}.png"
            block["figureImage"] = rel
            created.append(out.name)
            safe = label[:40].encode("ascii", "replace").decode("ascii")
            print(f"OK {out.name} ({style_name}) - {safe}")

        path.write_text(json.dumps(guide, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"\nCreated {len(created)} figures in {FIGURES}")
    for name in sorted(created):
        print(f"  {name}")


if __name__ == "__main__":
    main()
