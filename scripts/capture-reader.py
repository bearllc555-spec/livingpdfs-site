#!/usr/bin/env python3
"""Capture reader screenshots for QA."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "scripts" / "_screenshots"
URL = "https://livingpdfs.pages.dev/reader?guide=lazy-man-ai&v=71"


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    errors: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.on("pageerror", lambda err: errors.append(str(err)))
        page.goto(URL, wait_until="networkidle", timeout=90000)
        page.wait_for_selector(".pdf-page", timeout=90000)
        page.wait_for_selector(".pdf-page__cover-img", timeout=90000)
        page.wait_for_timeout(2500)

        page.screenshot(path=str(OUT / "reader-top.png"), full_page=False)

        pages = page.query_selector_all(".pdf-page")
        for i, el in enumerate(pages[:4]):
            el.scroll_into_view_if_needed()
            page.wait_for_timeout(600)
            page.screenshot(path=str(OUT / f"page-{i + 1}.png"), full_page=False)

        browser.close()

    (OUT / "report.json").write_text(
        json.dumps({"url": URL, "pages": len(pages), "errors": errors}, indent=2),
        encoding="utf-8",
    )
    print(json.dumps({"url": URL, "pages": len(pages), "errors": errors}, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
