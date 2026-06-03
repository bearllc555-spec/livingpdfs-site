#!/usr/bin/env python3
"""LivingPDF Woodcut Engraving — shared style constants and cover composition."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

STYLE_NAME = "LivingPDF Woodcut Engraving"
STYLE_ALIASES = (
    "vintage editorial woodcut",
    "steel-engraving illustration",
    "cross-hatch mechanical diagram",
)

REFERENCE_FIGURE = "/assets/figures/lazy-man-ai-00.png"

PROMPT_TEMPLATE = (
    "Vintage woodcut steel engraving illustration for a business guide. "
    "Topic: {topic}. Concept: {concept}. "
    "Style: LivingPDF Woodcut Engraving — black ink cross-hatching on aged cream parchment, "
    "19th-century editorial mechanical diagram, monochromatic, intricate line work, "
    "no text, no labels, no watermarks, print quality."
)

COVER_SIZE = (1275, 1650)
BG_OUTER = (12, 18, 34)
BG_INNER = (30, 41, 59)
CREAM = (252, 251, 248)
ACCENT = (56, 189, 248)
MUTED = (148, 163, 184)
INK = (246, 241, 232)


def _font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = (
        ["C:/Windows/Fonts/georgiab.ttf", "C:/Windows/Fonts/georgia.ttf"]
        if bold
        else ["C:/Windows/Fonts/georgia.ttf", "C:/Windows/Fonts/times.ttf"]
    )
    for path in names:
        try:
            if Path(path).is_file():
                return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def _wrap(text: str, draw: ImageDraw.ImageDraw, font: ImageFont.ImageFont, max_w: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current: list[str] = []
    for word in words:
        trial = " ".join(current + [word])
        if draw.textlength(trial, font=font) <= max_w:
            current.append(word)
        else:
            if current:
                lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return lines[:4]


THUMB_SIZE = (144, 208)  # 2× catalog thumb (72×104)
PREVIEW_SIZE = (1088, 1571)  # 7.5× catalog thumb — hover pop at 34rem + 2× retina


def _paste_art_cover_fit(
    canvas: Image.Image,
    art_path: Path,
    box: tuple[int, int, int, int],
    *,
    mat: tuple[int, int, int] | None = CREAM,
) -> None:
    left, top, right, bottom = box
    if mat:
        ImageDraw.Draw(canvas).rectangle(box, fill=mat)

    target_w = right - left
    target_h = bottom - top
    art = Image.open(art_path).convert("RGB")
    scale = max(target_w / art.width, target_h / art.height)
    nw = max(1, int(art.width * scale))
    nh = max(1, int(art.height * scale))
    art = art.resize((nw, nh), Image.Resampling.LANCZOS)
    crop_left = max(0, (nw - target_w) // 2)
    crop_top = max(0, (nh - target_h) // 2)
    art = art.crop((crop_left, crop_top, crop_left + target_w, crop_top + target_h))
    canvas.paste(art, (left, top))


def compose_thumb(art_path: Path, out_path: Path) -> None:
    tw, th = THUMB_SIZE
    thumb = Image.new("RGB", THUMB_SIZE, BG_INNER)
    _paste_art_cover_fit(thumb, art_path, (0, 0, tw, th), mat=CREAM)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    thumb.save(out_path, format="PNG", optimize=True)


def compose_preview(art_path: Path, out_path: Path) -> None:
    pw, ph = PREVIEW_SIZE
    preview = Image.new("RGB", PREVIEW_SIZE, BG_INNER)
    _paste_art_cover_fit(preview, art_path, (0, 0, pw, ph), mat=CREAM)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    preview.save(out_path, format="PNG", optimize=True)


def compose_cover(
    title: str,
    category: str,
    art_path: Path,
    out_path: Path,
    *,
    eyebrow: str = "AI INCOME",
) -> None:
    img = Image.new("RGB", COVER_SIZE, BG_OUTER)
    draw = ImageDraw.Draw(img)
    mx, my = 72, 88
    inner = (mx, my, COVER_SIZE[0] - mx, COVER_SIZE[1] - my)
    draw.rounded_rectangle(inner, radius=12, fill=BG_INNER)

    inner_h = inner[3] - inner[1]
    art_left = inner[0] + 28
    art_right = inner[2] - 28
    art_top = inner[1] + 28
    art_bottom = inner[1] + int(inner_h * 0.54)
    _paste_art_cover_fit(img, art_path, (art_left, art_top, art_right, art_bottom))

    text_y = art_bottom + 40
    eyebrow_font = _font(28)
    title_font = _font(52, bold=True)
    sub_font = _font(26)
    brand_font = _font(24)

    draw.text((COVER_SIZE[0] // 2, text_y), eyebrow.upper(), fill=ACCENT, font=eyebrow_font, anchor="mt")
    text_y += 42

    lines = _wrap(title.upper(), draw, title_font, COVER_SIZE[0] - mx * 2 - 80)
    for line in lines:
        draw.text((COVER_SIZE[0] // 2, text_y), line, fill=INK, font=title_font, anchor="mt")
        text_y += 58

    text_y += 8
    draw.text((COVER_SIZE[0] // 2, text_y), category.upper(), fill=MUTED, font=sub_font, anchor="mt")

    swatch_y = COVER_SIZE[1] - my - 120
    colors = [(56, 189, 248), (99, 102, 241), (56, 189, 248), (99, 102, 241)]
    sx = COVER_SIZE[0] // 2 - 90
    for i, color in enumerate(colors):
        draw.rounded_rectangle((sx + i * 48, swatch_y, sx + i * 48 + 32, swatch_y + 32), radius=4, fill=color)

    draw.text((COVER_SIZE[0] // 2, COVER_SIZE[1] - my - 52), "LivingPDFs", fill=(100, 116, 139), font=brand_font, anchor="mt")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, format="PNG", optimize=True)


COVER_CONCEPTS: dict[str, str] = {
    "micro-saas": "Interlocking gears feeding into small software boxes and LLM brain nodes, product ideas flowing to coin stacks",
    "lazy-man-ai": "Wealthy lazy man in beach lounge chair sipping piña colada, Rube Goldberg fan contraption, beautiful woman beside him, lavish lazy-rich beach paradise",
    "claude-freelancer": "Freelancer at desk with contract scrolls, client handshake vignette, Upwork-style marketplace gears",
    "ai-automation-agency": "Workflow pipes connecting app nodes, n8n-style automation diagram, robot arm moving data blocks",
    "ai-seo": "Search magnifying glass over ranking ladder, AI and search engine symbols in mechanical engraving",
    "ai-email-agency": "Envelope conveyor through funnel to inbox, campaign flow arrows, subscriber growth chart as gears",
    "landing-pages-48h": "Landing page wireframe rising from clock gears, fast delivery conveyor, 48-hour dial",
    "ai-lead-gen": "Phone and calendar booking sales calls, lead pipeline funnel with qualified prospects",
    "claude-code-operators": "Terminal and delivery checklist for client billing, operator shipping code packages not writing from scratch",
    "ai-content-engine": "Content calendar wheel publishing fifty posts per month through mechanical press",
}
