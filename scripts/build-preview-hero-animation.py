#!/usr/bin/env python3
"""Build a small looping WebP: gentle page motion + lock pulse (no overlay wipes)."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "marketing" / "preview-before-unlock-hero.png"
OUT_WEBP = ROOT / "assets" / "marketing" / "preview-before-unlock.webp"
OUT_PNG = ROOT / "assets" / "marketing" / "preview-before-unlock-hero.png"

OUTPUT_SIZE = 480
FRAME_COUNT = 10
DURATION_MS = 180

# Fractions of width/height: open book (left), padlock (right)
PREVIEW_BOX = (0.04, 0.24, 0.50, 0.86)
LOCK_BOX = (0.62, 0.40, 0.88, 0.58)


def box_px(size: tuple[int, int], box: tuple[float, float, float, float]) -> tuple[int, int, int, int]:
    w, h = size
    x0, y0, x1, y1 = box
    return (int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h))


def paste_region(base: Image.Image, region: Image.Image, box: tuple[int, int, int, int], dy: int = 0) -> None:
    x0, y0, x1, y1 = box
    rw, rh = x1 - x0, y1 - y0
    if region.size != (rw, rh):
        region = region.resize((rw, rh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (rw, rh))
    canvas.paste(region, (0, dy))
    base.paste(canvas, (x0, y0))


def build_frames(base: Image.Image) -> list[Image.Image]:
    preview_box = box_px(base.size, PREVIEW_BOX)
    lock_box = box_px(base.size, LOCK_BOX)
    preview_static = base.crop(preview_box)
    lock_static = base.crop(lock_box)
    frames: list[Image.Image] = []

    for index in range(FRAME_COUNT):
        phase = index / FRAME_COUNT
        angle = phase * 2 * math.pi
        frame = base.copy()

        # Gentle page flutter on the open book (1–2 px vertical nudge)
        dy = int(round(1.8 * math.sin(angle)))
        paste_region(frame, preview_static, preview_box, dy=dy)

        # Subtle lock pulse on the padlock (locked side stays otherwise static)
        pulse = 0.93 + 0.07 * (0.5 + 0.5 * math.sin(angle + 0.6))
        lock = ImageEnhance.Brightness(lock_static).enhance(pulse)
        frame.paste(lock, lock_box[:2])

        frames.append(frame)

    return frames


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Missing source art: {SRC}")

    src = Image.open(SRC).convert("RGB")
    if src.size != (OUTPUT_SIZE, OUTPUT_SIZE):
        src = src.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.LANCZOS)
        src.save(OUT_PNG, format="PNG", optimize=True)

    frames = build_frames(src)
    OUT_WEBP.parent.mkdir(parents=True, exist_ok=True)

    for quality, method in ((72, 4), (65, 4), (58, 4)):
        frames[0].save(
            OUT_WEBP,
            format="WEBP",
            save_all=True,
            append_images=frames[1:],
            duration=DURATION_MS,
            loop=0,
            quality=quality,
            method=method,
        )
        kb = OUT_WEBP.stat().st_size // 1024
        print(f"quality={quality} -> {kb} KB")
        if kb <= 800:
            break

    print(f"Wrote {OUT_WEBP.name} ({len(frames)} frames @ {OUTPUT_SIZE}px, {OUT_WEBP.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
