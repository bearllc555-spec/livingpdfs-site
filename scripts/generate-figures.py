#!/usr/bin/env python3
"""Generate unique per-figure artwork for LivingPDF manuscripts."""

from __future__ import annotations

import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from figure_styles import render_figure

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "assets" / "content"
FIGURES = ROOT / "assets" / "figures"
KEY_FILE = ROOT.parent.parent / ".local" / "gemini-api-key.txt"
GEMINI_MODEL = "gemini-2.0-flash-preview-image-generation"


def gemini_key() -> str | None:
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if key:
        return key.strip()
    if KEY_FILE.is_file():
        return KEY_FILE.read_text(encoding="utf-8").strip()
    return None


def gemini_prompt(slug: str, label: str, heading: str, style_hint: str) -> str:
    return (
        f"Editorial illustration for a business PDF about {slug.replace('-', ' ')}. "
        f"Topic: {heading}. Concept: {label}. "
        f"Style: {style_hint}. Single cohesive image, no text labels, no watermarks, "
        f"professional print quality, suitable for inline figure in a guide."
    )


def try_gemini_image(prompt: str, out_path: Path) -> bool:
    key = gemini_key()
    if not key:
        return False

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={key}"
    body = json.dumps(
        {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
        }
    ).encode()

    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            payload = json.loads(resp.read().decode())
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
        return False

    for candidate in payload.get("candidates") or []:
        for part in candidate.get("content", {}).get("parts") or []:
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                out_path.parent.mkdir(parents=True, exist_ok=True)
                out_path.write_bytes(base64.b64decode(inline["data"]))
                return True
    return False


STYLE_HINTS = [
    "LivingPDF Woodcut Engraving: black ink cross-hatching on aged cream parchment, 19th-century editorial mechanical diagram, monochromatic",
    "vintage newspaper halftone engraving",
    "high-contrast woodcut print",
    "black and white charcoal sketch on cream paper",
    "minimal ink line drawing",
    "blueprint technical schematic",
    "abstract geometric black and white collage",
    "isometric diagram muted tones",
    "editorial magazine illustration grayscale",
    "data visualization monochrome",
    "hand-drawn whiteboard sketch",
]


def style_hint(slug: str, index: int, label: str) -> str:
    key = f"{slug}:{index}:{label}"
    return STYLE_HINTS[hash(key) % len(STYLE_HINTS)]


def main() -> None:
    use_gemini = "--gemini" in sys.argv
    gemini_available = gemini_key() is not None
    if use_gemini and not gemini_available:
        print("No Gemini key — using procedural art (place key in slatepress/.local/gemini-api-key.txt)")
        use_gemini = False

    count = 0
    gemini_count = 0
    for path in sorted(CONTENT.glob("*.json")):
        guide = json.loads(path.read_text(encoding="utf-8"))
        slug = guide["slug"]
        for index, block in enumerate(guide.get("blocks") or []):
            if not block.get("figure"):
                continue
            label = block["figure"]
            heading = block.get("heading", label)
            out = FIGURES / f"{slug}-{index:02d}.png"

            rendered = False
            if use_gemini:
                hint = style_hint(slug, index, label)
                prompt = gemini_prompt(slug, label, heading, hint)
                rendered = try_gemini_image(prompt, out)
                if rendered:
                    gemini_count += 1
                    time.sleep(0.5)

            if not rendered:
                img = render_figure(slug, index, label, heading)
                out.parent.mkdir(parents=True, exist_ok=True)
                img.save(out, format="PNG", optimize=True)

            block["figureImage"] = f"/assets/figures/{slug}-{index:02d}.png"
            count += 1

        path.write_text(json.dumps(guide, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    mode = f"{gemini_count} Gemini + {count - gemini_count} procedural" if use_gemini else "procedural"
    print(f"Generated {count} unique figures ({mode}) in {FIGURES}")


if __name__ == "__main__":
    main()
