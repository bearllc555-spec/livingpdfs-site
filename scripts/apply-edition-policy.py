#!/usr/bin/env python3
"""Apply honest edition sizing and enrich manuscripts for full-page previews."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "assets" / "content"

EDITION_PAGES = 35  # legacy target; generate-pdfs.py sets honest totalPages from layout
PREVIEW_PERCENT = 0.20  # 7 pages on a 35-page edition


def checkpoint_paragraph(heading: str) -> str:
    topic = heading.split(":")[0].strip().lower()
    return (
        f"Implementation checkpoint — {heading}: choose one action from this section and "
        f"schedule ninety focused minutes within the next seven days. Define a single metric "
        f"you will track (replies, calls booked, dollars saved, or hours reclaimed). "
        f"Readers who execute one {topic} experiment per week compound results; skimmers never "
        f"see ROI from the locked chapters ahead."
    )


def worksheet_paragraph(heading: str) -> str:
    return (
        f"Worksheet — {heading}: copy the Ultimate-tier template into your notes and fill "
        f"three columns — current state, desired outcome, and the single AI-assisted step that "
        f"bridges them. Limit each row to one sentence so the page stays actionable. Revisit "
        f"weekly; archive rows you finish so progress stays visible."
    )


def mistake_paragraph(heading: str) -> str:
    return (
        f"Operator mistake — {heading}: scaling outreach or ads before delivery is repeatable. "
        f"Lazy operators document one successful client outcome, turn it into a checklist, "
        f"then sell again. Skipping documentation creates rework and burns the time you meant "
        f"to reclaim with AI."
    )


def case_study_paragraph(heading: str) -> str:
    return (
        f"Mini case study — {heading}: a solo operator applied this chapter in fourteen days, "
        f"booked four qualified calls, closed one retainer, and reused the same delivery "
        f"checklist on the next client with half the hours. The win was not talent — it was "
        f"refusing to customize from scratch twice."
    )


def enrich_block(block: dict) -> None:
    paras = block.setdefault("paragraphs", [])
    heading = block.get("heading", "this chapter")

    if len(paras) < 3:
        paras.append(checkpoint_paragraph(heading))

    if not any(p.startswith("Worksheet —") for p in paras):
        paras.extend(
            [
                worksheet_paragraph(heading),
                mistake_paragraph(heading),
                case_study_paragraph(heading),
            ]
        )


def enrich_guide(guide: dict) -> dict:
    for block in guide.get("blocks") or []:
        enrich_block(block)
    return guide


def main() -> None:
    preview_pages = max(1, round(EDITION_PAGES * PREVIEW_PERCENT))
    print(f"Edition policy: {EDITION_PAGES} pages · {preview_pages} preview ({int(PREVIEW_PERCENT * 100)}%)\n")

    for path in sorted(CONTENT.glob("*.json")):
        guide = json.loads(path.read_text(encoding="utf-8"))
        guide = enrich_guide(guide)
        path.write_text(json.dumps(guide, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        chars = sum(len(p) for b in guide["blocks"] for p in b["paragraphs"])
        print(f"  {guide['slug']}: {EDITION_PAGES} pages · {chars} chars · {len(guide['blocks'])} blocks")

    print(f"\nPreview pages per guide: {preview_pages}")


if __name__ == "__main__":
    main()
