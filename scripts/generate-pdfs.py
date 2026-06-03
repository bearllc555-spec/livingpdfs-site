#!/usr/bin/env python3
"""Generate full and preview PDFs: cover page 1, flow-filled content pages."""

from __future__ import annotations

import json
import unicodedata
from io import BytesIO
from pathlib import Path

from fpdf import FPDF
from PIL import Image
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, DictionaryObject, FloatObject, NameObject
from reportlab.graphics import renderPM
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from svglib.svglib import svg2rlg

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "assets" / "content"
COVERS_DIR = ROOT / "assets" / "covers"
RASTER_DIR = COVERS_DIR / "_raster"
FULL_DIR = ROOT / "private" / "pdfs" / "full"
PREVIEW_DIR = ROOT / "assets" / "pdfs" / "previews"

MARGIN = 16
BODY_SIZE = 11
HEADING_SIZE = 14
FOOTER_SIZE = 8
LINE_BODY = 5.5
LINE_HEAD = 6.5
PARA_GAP = 1.5
BLOCK_GAP = 2
FIGURE_H = 72
PREVIEW_RATIO = 0.15
COVER_PX = (1275, 1650)  # 150 DPI letter
MIN_COVER_PX = 500


def preview_page_count(total_pages: int, hook_blocks: int = 3) -> int:
    if total_pages <= 1:
        return 1
    content_pages = total_pages - 1
    ratio_based = max(1, round(content_pages * PREVIEW_RATIO))
    hook_based = min(hook_blocks, content_pages)
    # Always leave at least one locked content page when possible.
    min_locked = 2 if content_pages >= 3 else 1
    max_preview_content = max(1, content_pages - min_locked)
    preview_content = min(max_preview_content, max(ratio_based, hook_based))
    return 1 + preview_content


def sanitize(text: str) -> str:
    text = unicodedata.normalize("NFKC", text)
    replacements = {
        "\u2014": "-",
        "\u2013": "-",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2026": "...",
        "\u00a0": " ",
    }
    for src, dst in replacements.items():
        text = text.replace(src, dst)
    return text.encode("latin-1", "replace").decode("latin-1")


def cover_png_path(guide: dict) -> Path:
    slug = guide["slug"]
    composed = COVERS_DIR / f"{slug}-cover.png"
    if composed.is_file():
        with Image.open(composed) as img:
            if img.size[0] >= MIN_COVER_PX:
                return composed

    cover = guide.get("cover", "")
    svg_name = Path(cover).name if cover else f"{slug}.svg"
    if svg_name.endswith("-cover.png"):
        svg_name = f"{slug}.svg"
    svg_path = COVERS_DIR / svg_name
    png_path = RASTER_DIR / f"{slug}.png"
    if not svg_path.is_file():
        raise FileNotFoundError(f"Cover SVG missing: {svg_path}")
    needs_raster = not png_path.is_file() or png_path.stat().st_mtime < svg_path.stat().st_mtime
    if not needs_raster and png_path.is_file():
        with Image.open(png_path) as img:
            needs_raster = img.size[0] < MIN_COVER_PX
    if needs_raster:
        rasterize_cover(svg_path, png_path)
    return png_path


def rasterize_cover(svg_path: Path, png_path: Path) -> None:
    drawing = svg2rlg(str(svg_path))
    if drawing is None:
        raise ValueError(f"Could not parse SVG: {svg_path}")

    img = renderPM.drawToPIL(drawing)
    if img.size != COVER_PX:
        img = img.resize(COVER_PX, Image.Resampling.LANCZOS)

    png_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(png_path, format="PNG", optimize=True)


class ManuscriptPDF(FPDF):
    def __init__(self, title: str):
        super().__init__(format="Letter", unit="mm")
        self.guide_title = sanitize(title)
        self.set_auto_page_break(auto=True, margin=24)
        self.set_margins(MARGIN, MARGIN, MARGIN)

    def footer(self) -> None:
        if self.page_no() == 1:
            return
        self.set_y(-12)
        self.set_font("Helvetica", "I", FOOTER_SIZE)
        self.set_text_color(120, 120, 120)
        self.cell(
            0,
            8,
            f"LivingPDFs · {self.guide_title} · Page {self.page_no()}",
            align="C",
        )

    def add_cover(self, png_path: Path) -> None:
        self.add_page()
        self.set_margin(0)
        self.image(str(png_path), x=0, y=0, w=215.9, h=279.4)
        self.set_margins(MARGIN, MARGIN, MARGIN)

    def add_floated_figure(self, img_path: Path, page_bottom: float) -> tuple[float, float, float, float]:
        usable_w = self.w - self.l_margin - self.r_margin
        with Image.open(img_path) as fig:
            fw, fh = fig.size
        img_w = min(usable_w * 0.42, 78)
        img_h = min(img_w * fh / fw, 88)
        y0 = self.get_y()
        if y0 + img_h > page_bottom:
            self.add_page()
            y0 = self.get_y()
        x0 = self.l_margin
        self.image(str(img_path), x=x0, y=y0, w=img_w, h=img_h)
        text_x = x0 + img_w + 4
        text_w = self.w - self.r_margin - text_x
        return y0, y0 + img_h + 2, text_x, text_w

    def write_para(self, text: str, page_bottom: float, x: float | None = None, w: float | None = None) -> None:
        if self.get_y() > page_bottom - 18:
            self.add_page()
        if x is not None:
            self.set_x(x)
        self.set_font("Helvetica", "", BODY_SIZE)
        width = w if w is not None else 0
        self.multi_cell(width, LINE_BODY, sanitize(text))
        self.ln(PARA_GAP)

    def add_manuscript(self, guide: dict) -> None:
        self.add_page()
        self.set_text_color(20, 20, 20)
        page_bottom = self.h - self.b_margin - 16

        for block in guide.get("blocks") or []:
            if self.get_y() > page_bottom - 24:
                self.add_page()

            self.set_font("Helvetica", "B", HEADING_SIZE)
            self.multi_cell(0, LINE_HEAD, sanitize(block["heading"]))
            self.ln(PARA_GAP)

            paragraphs = block.get("paragraphs") or []
            figure_image = block.get("figureImage")
            img_path = ROOT / str(figure_image).lstrip("/") if figure_image else None
            has_figure = bool(img_path and img_path.is_file())

            if paragraphs:
                self.write_para(paragraphs[0], page_bottom)

            img_bottom = None
            text_x = self.l_margin
            text_w = self.w - self.l_margin - self.r_margin

            if has_figure and len(paragraphs) > 1:
                y0, img_bottom, text_x, text_w = self.add_floated_figure(img_path, page_bottom)
                self.set_xy(text_x, y0)
                for paragraph in paragraphs[1:]:
                    if self.get_y() >= img_bottom:
                        text_x = self.l_margin
                        text_w = self.w - self.l_margin - self.r_margin
                    self.write_para(paragraph, page_bottom, text_x, text_w)
                if self.get_y() < img_bottom:
                    self.set_y(img_bottom)
            elif has_figure:
                if img_path:
                    y0, img_bottom, _, _ = self.add_floated_figure(img_path, page_bottom)
                    if self.get_y() < img_bottom:
                        self.set_y(img_bottom)
                for paragraph in paragraphs[1:]:
                    self.write_para(paragraph, page_bottom)
            else:
                for paragraph in paragraphs[1:]:
                    self.write_para(paragraph, page_bottom)

            self.ln(BLOCK_GAP)

    def add_back_to_top(self) -> None:
        if self.page_no() <= 1:
            return
        page_bottom = self.h - self.b_margin - 16
        if self.get_y() > page_bottom - 10:
            self.add_page()
        self.ln(6)
        link = self.add_link(page=1)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(70, 70, 70)
        self.cell(0, 6, "Back to top", align="C", link=link)


def build_full_pdf(guide: dict) -> bytes:
    png_path = cover_png_path(guide)
    pdf = ManuscriptPDF(guide["title"])
    pdf.add_cover(png_path)
    pdf.add_manuscript(guide)
    pdf.add_back_to_top()
    return bytes(pdf.output())


def extract_preview_pages(full_bytes: bytes, preview_pages: int) -> bytes:
    reader = PdfReader(BytesIO(full_bytes))
    writer = PdfWriter()
    for index in range(min(preview_pages, len(reader.pages))):
        writer.add_page(reader.pages[index])
    buffer = BytesIO()
    writer.write(buffer)
    return buffer.getvalue()


def ensure_back_to_top(pdf_bytes: bytes) -> bytes:
    reader = PdfReader(BytesIO(pdf_bytes))
    last_text = (reader.pages[-1].extract_text() or "") if reader.pages else ""
    if "Back to top" in last_text:
        return pdf_bytes

    packet = BytesIO()
    overlay = canvas.Canvas(packet, pagesize=letter)
    overlay.setFont("Helvetica", 9)
    overlay.setFillColorRGB(0.27, 0.27, 0.27)
    label = "Back to top"
    text_w = overlay.stringWidth(label, "Helvetica", 9)
    x = (letter[0] - text_w) / 2
    y = 62
    overlay.drawString(x, y, label)
    overlay.save()

    writer = PdfWriter()
    stamp = PdfReader(packet).pages[0]
    for index, page in enumerate(reader.pages):
        if index == len(reader.pages) - 1:
            page.merge_page(stamp)
        writer.add_page(page)

    dest = writer.pages[0]
    last = writer.pages[-1]
    annot = DictionaryObject(
        {
            NameObject("/Type"): NameObject("/Annot"),
            NameObject("/Subtype"): NameObject("/Link"),
            NameObject("/Rect"): ArrayObject(
                [FloatObject(x), FloatObject(y), FloatObject(x + text_w), FloatObject(y + 10)]
            ),
            NameObject("/Border"): ArrayObject([FloatObject(0), FloatObject(0), FloatObject(0)]),
            NameObject("/Dest"): ArrayObject([dest.indirect_reference, NameObject("/Fit")]),
        }
    )
    if "/Annots" in last:
        last["/Annots"].append(annot)
    else:
        last[NameObject("/Annots")] = ArrayObject([annot])

    buffer = BytesIO()
    writer.write(buffer)
    return buffer.getvalue()


def write_total_pages(json_path: Path, guide: dict, total_pages: int) -> None:
    guide["totalPages"] = total_pages
    json_path.write_text(json.dumps(guide, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> None:
    json_files = sorted(CONTENT_DIR.glob("*.json"))
    if not json_files:
        raise SystemExit(f"No manuscripts found in {CONTENT_DIR}")

    FULL_DIR.mkdir(parents=True, exist_ok=True)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Generating PDFs for {len(json_files)} guides...\n")

    for json_path in json_files:
        guide = json.loads(json_path.read_text(encoding="utf-8"))
        slug = guide.get("slug") or json_path.stem

        full_bytes = build_full_pdf(guide)
        total_pages = len(PdfReader(BytesIO(full_bytes)).pages)
        preview_target = preview_page_count(total_pages, guide.get("hookBlocks", 3))
        preview_bytes = ensure_back_to_top(extract_preview_pages(full_bytes, preview_target))

        write_total_pages(json_path, guide, total_pages)

        full_path = FULL_DIR / f"{slug}-full.pdf"
        preview_path = PREVIEW_DIR / f"{slug}-preview.pdf"
        full_path.write_bytes(full_bytes)
        preview_path.write_bytes(preview_bytes)

        preview_count = len(PdfReader(BytesIO(preview_bytes)).pages)
        print(
            f"  {slug}: {total_pages} pages (cover + {total_pages - 1} content) · "
            f"preview {preview_count} pages"
        )

    print(f"\nDone. Full PDFs: {FULL_DIR}\nPreview PDFs: {PREVIEW_DIR}")


if __name__ == "__main__":
    main()
