#!/usr/bin/env python3
"""Distinct visual styles for LivingPDF figures — no shared template."""

from __future__ import annotations

import hashlib
import math
import random
from typing import Callable

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W = 680


def _seed(*parts: str) -> random.Random:
    digest = hashlib.md5(":".join(parts).encode()).hexdigest()
    return random.Random(int(digest, 16))


def _font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in (
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/georgia.ttf",
        "C:/Windows/Fonts/consola.ttf",
    ):
        try:
            from pathlib import Path

            if Path(path).is_file():
                return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def _caption(draw: ImageDraw.ImageDraw, label: str, y: int, color: tuple[int, ...]) -> None:
    draw.text((28, y), f"Figure · {label[:56]}", fill=color, font=_font(13))


def engraving_bw(slug: str, index: int, label: str, heading: str) -> Image.Image:
    rng = _seed(slug, str(index), label, "engraving")
    h = 220
    img = Image.new("RGB", (W, h), (252, 251, 248))
    draw = ImageDraw.Draw(img)
    cx, cy = W // 2, 95
    for r in range(8, 72, 6):
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(40, 40, 40), width=1)
    for _ in range(120):
        x1, y1 = rng.randint(80, W - 80), rng.randint(40, 150)
        x2, y2 = x1 + rng.randint(-30, 30), y1 + rng.randint(-30, 30)
        draw.line((x1, y1, x2, y2), fill=(30, 30, 30), width=1)
    draw.rectangle((60, 155, W - 60, 175), fill=(20, 20, 20))
    draw.text((72, 158), label.upper()[:32], fill=(255, 255, 255), font=_font(14))
    _caption(draw, label, 188, (60, 60, 60))
    return img.filter(ImageFilter.GaussianBlur(radius=0.3))


def ink_sketch(slug: str, index: int, label: str, heading: str) -> Image.Image:
    rng = _seed(slug, str(index), label, "sketch")
    h = 210
    img = Image.new("RGB", (W, h), (245, 242, 235))
    draw = ImageDraw.Draw(img)
    for i in range(5):
        x = 50 + i * 120 + rng.randint(-10, 10)
        draw.rounded_rectangle((x, 50, x + 90, 140), radius=6, outline=(25, 25, 25), width=2)
        draw.line((x + 10, 70, x + 75, 70), fill=(80, 80, 80), width=1)
        draw.line((x + 10, 88, x + 60, 88), fill=(80, 80, 80), width=1)
    draw.line((50, 165, W - 50, 165), fill=(25, 25, 25), width=2)
    _caption(draw, label, 178, (50, 50, 50))
    return img


def blueprint(slug: str, index: int, label: str, heading: str) -> Image.Image:
    rng = _seed(slug, str(index), label, "blueprint")
    h = 215
    img = Image.new("RGB", (W, h), (15, 32, 58))
    draw = ImageDraw.Draw(img)
    grid = 24
    for x in range(0, W, grid):
        draw.line((x, 0, x, h), fill=(30, 55, 90), width=1)
    for y in range(0, h, grid):
        draw.line((0, y, W, y), fill=(30, 55, 90), width=1)
    bx, by, bw, bh = 120, 45, 440, 110
    draw.rectangle((bx, by, bx + bw, by + bh), outline=(180, 210, 255), width=2)
    draw.line((bx, by + 35, bx + bw, by + 35), fill=(120, 160, 220), width=1)
    draw.text((bx + 12, by + 8), label[:40], fill=(220, 235, 255), font=_font(13))
    for i in range(4):
        draw.line((bx + 40 + i * 100, by + 50, bx + 40 + i * 100, by + bh - 10), fill=(100, 140, 200), width=1)
    _caption(draw, label, 175, (160, 190, 230))
    return img


def halftone(slug: str, index: int, label: str, heading: str) -> Image.Image:
    rng = _seed(slug, str(index), label, "halftone")
    h = 205
    img = Image.new("L", (W, h), 255)
    draw = ImageDraw.Draw(img)
    for y in range(0, h, 4):
        for x in range(0, W, 4):
            if rng.random() > 0.55:
                s = rng.randint(1, 3)
                draw.ellipse((x, y, x + s, y + s), fill=0)
    draw.rectangle((80, 40, W - 80, 130), outline=0, width=3)
    draw.text((100, 72), label[:28], fill=0, font=_font(16))
    rgb = img.convert("RGB")
    d2 = ImageDraw.Draw(rgb)
    _caption(d2, label, 155, (30, 30, 30))
    return rgb


def bar_chart(slug: str, index: int, label: str, heading: str) -> Image.Image:
    rng = _seed(slug, str(index), label, "bars")
    h = 200
    img = Image.new("RGB", (W, h), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    vals = [rng.randint(30, 95) for _ in range(7)]
    base = 145
    for i, v in enumerate(vals):
        x = 70 + i * 78
        bh = int(v * 1.0)
        shade = 40 + i * 18
        draw.rectangle((x, base - bh, x + 48, base), fill=(shade, shade, shade))
        draw.text((x + 8, base + 6), f"W{i+1}", fill=(80, 80, 80), font=_font(10))
    draw.line((50, base, W - 40, base), fill=(0, 0, 0), width=2)
    _caption(draw, label, 168, (50, 50, 50))
    return img


def venn_diagram(slug: str, index: int, label: str, heading: str) -> Image.Image:
    h = 210
    img = Image.new("RGB", (W, h), (248, 248, 246))
    draw = ImageDraw.Draw(img)
    r = 58
    centers = [(240, 95), (340, 95), (440, 95)]
    labels = ["Now", "AI", "Win"]
    for (cx, cy), txt in zip(centers, labels):
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(20, 20, 20), width=2)
        draw.text((cx - 16, cy - 8), txt, fill=(20, 20, 20), font=_font(14))
    _caption(draw, label, 175, (40, 40, 40))
    return img


def timeline(slug: str, index: int, label: str, heading: str) -> Image.Image:
    rng = _seed(slug, str(index), label, "timeline")
    h = 195
    img = Image.new("RGB", (W, h), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    y = 90
    draw.line((60, y, W - 60, y), fill=(0, 0, 0), width=2)
    steps = ["Start", "Build", "Ship", "Scale"]
    for i, step in enumerate(steps):
        x = 90 + i * 145 + rng.randint(-8, 8)
        draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill=(180, 90, 48))
        draw.text((x - 22, y + 16), step, fill=(30, 30, 30), font=_font(12))
    _caption(draw, label, 155, (50, 50, 50))
    return img


def collage(slug: str, index: int, label: str, heading: str) -> Image.Image:
    rng = _seed(slug, str(index), label, "collage")
    h = 225
    img = Image.new("RGB", (W, h), (235, 230, 220))
    draw = ImageDraw.Draw(img)
    colors = [(30, 30, 30), (180, 90, 48), (240, 240, 240), (90, 90, 90)]
    for i in range(6):
        x, y = rng.randint(40, 400), rng.randint(30, 120)
        w, ht = rng.randint(80, 180), rng.randint(50, 100)
        draw.rectangle((x, y, x + w, y + ht), fill=rng.choice(colors), outline=(0, 0, 0))
    _caption(draw, label, 188, (40, 40, 40))
    return img


def woodcut(slug: str, index: int, label: str, heading: str) -> Image.Image:
    h = 200
    img = Image.new("RGB", (W, h), (250, 246, 240))
    draw = ImageDraw.Draw(img)
    draw.polygon([(340, 35), (520, 150), (160, 150)], fill=(15, 15, 15))
    draw.rectangle((280, 150, 400, 155), fill=(15, 15, 15))
    for i in range(0, W, 18):
        draw.line((i, 0, i + 40, h), fill=(225, 220, 210), width=2)
    _caption(draw, label, 168, (20, 20, 20))
    return img


def heatmap(slug: str, index: int, label: str, heading: str) -> Image.Image:
    rng = _seed(slug, str(index), label, "heatmap")
    h = 205
    img = Image.new("RGB", (W, h), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    cols, rows = 12, 5
    cw, rh = 44, 22
    x0, y0 = 70, 45
    for r in range(rows):
        for c in range(cols):
            v = rng.randint(0, 255)
            color = (v, v, v) if rng.random() > 0.3 else (180, 90, 48)
            draw.rectangle((x0 + c * cw, y0 + r * rh, x0 + (c + 1) * cw - 2, y0 + (r + 1) * rh - 2), fill=color)
    _caption(draw, label, 165, (40, 40, 40))
    return img


def organic_flow(slug: str, index: int, label: str, heading: str) -> Image.Image:
    rng = _seed(slug, str(index), label, "organic")
    h = 210
    img = Image.new("RGB", (W, h), (252, 252, 250))
    draw = ImageDraw.Draw(img)
    pts = [(80, 120)]
    for i in range(1, 8):
        pts.append((80 + i * 75, 120 + rng.randint(-45, 45)))
    draw.line(pts, fill=(180, 90, 48), width=3, joint="curve")
    for p in pts:
        draw.ellipse((p[0] - 10, p[1] - 10, p[0] + 10, p[1] + 10), fill=(30, 30, 30))
    _caption(draw, label, 175, (50, 50, 50))
    return img


def polaroid(slug: str, index: int, label: str, heading: str) -> Image.Image:
    rng = _seed(slug, str(index), label, "polaroid")
    h = 230
    img = Image.new("RGB", (W, h), (240, 238, 232))
    draw = ImageDraw.Draw(img)
    fx, fy, fw, fh = 200, 30, 280, 150
    draw.rectangle((fx - 8, fy - 8, fx + fw + 8, fy + fh + 28), fill=(255, 255, 255), outline=(200, 200, 200))
    for _ in range(40):
        x1 = rng.randint(fx, fx + fw - 20)
        y1 = rng.randint(fy, fy + fh - 20)
        draw.ellipse(
            (x1, y1, x1 + rng.randint(12, 28), y1 + rng.randint(12, 28)),
            fill=(rng.randint(60, 200), rng.randint(60, 200), rng.randint(60, 200)),
        )
    draw.text((fx + 20, fy + fh + 4), label[:24], fill=(30, 30, 30), font=_font(12))
    _caption(draw, label, 198, (60, 60, 60))
    return img


def newspaper(slug: str, index: int, label: str, heading: str) -> Image.Image:
    h = 205
    img = Image.new("RGB", (W, h), (245, 245, 243))
    draw = ImageDraw.Draw(img)
    draw.rectangle((50, 35, W - 50, 140), outline=(0, 0, 0), width=2)
    draw.text((70, 48), heading[:42], fill=(0, 0, 0), font=_font(15))
    draw.line((70, 72, W - 70, 72), fill=(0, 0, 0), width=1)
    body = "Operators who productize once and sell outcomes—not hours—are compounding while competitors customize from scratch."
    draw.multiline_text((70, 82), body[:120], fill=(60, 60, 60), font=_font(11), spacing=4)
    _caption(draw, label, 158, (40, 40, 40))
    return img


def isometric(slug: str, index: int, label: str, heading: str) -> Image.Image:
    rng = _seed(slug, str(index), label, "iso")
    h = 215
    img = Image.new("RGB", (W, h), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    def iso_block(bx: int, by: int, bw: int, bh: int, depth: int, fill: tuple[int, ...]) -> None:
        top = [(bx, by), (bx + bw, by), (bx + bw + depth, by - depth), (bx + depth, by - depth)]
        right = [(bx + bw, by), (bx + bw, by + bh), (bx + bw + depth, by + bh - depth), (bx + bw + depth, by - depth)]
        left = [(bx, by), (bx, by + bh), (bx + depth, by + bh - depth), (bx + depth, by - depth)]
        draw.polygon(top, fill=fill)
        draw.polygon(right, fill=tuple(max(0, c - 40) for c in fill))
        draw.polygon(left, fill=tuple(max(0, c - 70) for c in fill))

    iso_block(180, 110, 80, 40, 24, (200, 200, 200))
    iso_block(290, 90, 80, 40, 24, (120, 120, 120))
    iso_block(400, 70, 80, 40, 24, (180, 90, 48))
    _caption(draw, label, 175, (40, 40, 40))
    return img


def stipple(slug: str, index: int, label: str, heading: str) -> Image.Image:
    rng = _seed(slug, str(index), label, "stipple")
    h = 210
    img = Image.new("RGB", (W, h), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    cx, cy, rad = 340, 95, 70
    for _ in range(900):
        ang = rng.random() * math.tau
        dist = rng.random() * rad
        x = cx + math.cos(ang) * dist
        y = cy + math.sin(ang) * dist
        if (x - cx) ** 2 + (y - cy) ** 2 < rad**2:
            draw.point((x, y), fill=(rng.randint(0, 80),) * 3)
    _caption(draw, label, 165, (30, 30, 30))
    return img


STYLES: list[Callable[..., Image.Image]] = [
    engraving_bw,
    ink_sketch,
    blueprint,
    halftone,
    bar_chart,
    venn_diagram,
    timeline,
    collage,
    woodcut,
    heatmap,
    organic_flow,
    polaroid,
    newspaper,
    isometric,
    stipple,
]


def pick_style(slug: str, index: int, label: str) -> Callable[..., Image.Image]:
    digest = hashlib.md5(f"{slug}:{index}:{label}".encode()).hexdigest()
    return STYLES[int(digest, 16) % len(STYLES)]


def render_figure(slug: str, index: int, label: str, heading: str) -> Image.Image:
    renderer = pick_style(slug, index, label)
    return renderer(slug, index, label, heading)
