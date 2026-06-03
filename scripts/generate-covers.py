#!/usr/bin/env python3
"""Generate LivingPDF Woodcut Engraving cover art and composed cover PNGs."""

from __future__ import annotations

import base64
import json
import os
import shutil
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from livingpdf_style import COVER_CONCEPTS, PROMPT_TEMPLATE, compose_cover, compose_preview, compose_thumb

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "assets" / "content"
ART_DIR = ROOT / "assets" / "covers" / "art"
COVERS_DIR = ROOT / "assets" / "covers"
FIGURES_DIR = ROOT / "assets" / "figures"
KEY_FILE = ROOT.parent.parent / ".local" / "gemini-api-key.txt"
GEMINI_MODEL = "gemini-2.0-flash-preview-image-generation"

GUIDES = [
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


def gemini_key() -> str | None:
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if key:
        return key.strip()
    if KEY_FILE.is_file():
        return KEY_FILE.read_text(encoding="utf-8").strip()
    return None


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
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as err:
        print(f"  Gemini error: {err}")
        return False

    for candidate in payload.get("candidates") or []:
        for part in candidate.get("content", {}).get("parts") or []:
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                out_path.parent.mkdir(parents=True, exist_ok=True)
                out_path.write_bytes(base64.b64decode(inline["data"]))
                return True
    return False


def art_source(slug: str) -> Path | None:
    art = ART_DIR / f"{slug}.png"
    if art.is_file():
        return art
    return None


def generate_art(slug: str, title: str, use_gemini: bool) -> Path | None:
    ART_DIR.mkdir(parents=True, exist_ok=True)
    out = ART_DIR / f"{slug}.png"
    if out.is_file() and out.stat().st_size > 100_000:
        return out

    concept = COVER_CONCEPTS.get(slug, title)
    prompt = PROMPT_TEMPLATE.format(topic=title, concept=concept)
    if use_gemini and try_gemini_image(prompt, out):
        print(f"  Gemini OK {out.name}")
        time.sleep(0.6)
        return out

    if out.is_file():
        return out

    return None


def sync_json_cover(slug: str) -> None:
    path = CONTENT / f"{slug}.json"
    if not path.is_file():
        return
    guide = json.loads(path.read_text(encoding="utf-8"))
    guide["cover"] = f"/assets/covers/{slug}-cover.png"
    guide["coverThumb"] = f"/assets/covers/{slug}-cover.png"
    guide["coverPreview"] = f"/assets/covers/{slug}-cover.png"
    path.write_text(json.dumps(guide, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> None:
    use_gemini = "--gemini" in sys.argv
    force = "--force" in sys.argv
    ok = 0
    missing: list[str] = []

    for slug in GUIDES:
        path = CONTENT / f"{slug}.json"
        if not path.is_file():
            print(f"SKIP {slug}: no JSON")
            continue
        guide = json.loads(path.read_text(encoding="utf-8"))
        title = guide["title"]
        category = guide.get("category", "Living · Ultimate")
        cover_out = COVERS_DIR / f"{slug}-cover.png"
        thumb_out = COVERS_DIR / f"{slug}-thumb.png"
        preview_out = COVERS_DIR / f"{slug}-preview.png"

        if force and cover_out.is_file():
            cover_out.unlink()
        if force and thumb_out.is_file():
            thumb_out.unlink()
        if force and preview_out.is_file():
            preview_out.unlink()
        if force:
            art = ART_DIR / f"{slug}.png"
            if art.is_file() and slug != "lazy-man-ai":
                art.unlink()

        art_path = generate_art(slug, title, use_gemini)
        if not art_path:
            missing.append(slug)
            print(f"FAIL {slug}: no art (run with --gemini or add art PNG)")
            continue

        compose_cover(title, category, art_path, cover_out)
        compose_thumb(art_path, thumb_out)
        compose_preview(art_path, preview_out)
        sync_json_cover(slug)
        print(f"OK {slug}-cover.png + {slug}-thumb.png + {slug}-preview.png")
        ok += 1

    print(f"\nComposed {ok}/{len(GUIDES)} covers")
    if missing:
        print("Missing art for:", ", ".join(missing))
        sys.exit(1)


if __name__ == "__main__":
    main()
