# LivingPDF Woodcut Engraving

**Official name:** LivingPDF Woodcut Engraving  
**Also called:** vintage editorial woodcut, steel-engraving illustration, cross-hatch mechanical diagram

This is the standard visual style for all LivingPDF inline figures and cover illustrations.

## Reference

Primary reference asset: `/assets/figures/lazy-man-ai-00.png`  
Example live URL: https://livingpdfs.pages.dev/assets/figures/lazy-man-ai-00.png

## Look and feel

- **Medium:** Black ink on aged cream/off-white paper (warm parchment tone)
- **Technique:** Fine cross-hatching, stippling, and parallel line shading — no flat fills or smooth gradients
- **Era:** 19th-century encyclopedia, patent drawing, or newspaper engraving
- **Composition:** Conceptual editorial scene — metaphors, gears, flows, vignettes — not photorealism
- **Palette:** Strictly monochrome (black, charcoal, cream paper)
- **Constraints:** No text, watermarks, logos, or UI chrome inside the illustration

## Prompt template (AI generation)

```
Vintage woodcut steel engraving illustration for a business guide.
Topic: {topic}. Concept: {concept}.
Style: LivingPDF Woodcut Engraving — black ink cross-hatching on aged cream parchment,
19th-century editorial mechanical diagram, monochromatic, intricate line work,
no text, no labels, no watermarks, print quality.
```

## Where it is used

| Asset | Path pattern |
|-------|----------------|
| Inline figures | `/assets/figures/{slug}-{index}.png` |
| Cover illustration (raw) | `/assets/covers/art/{slug}.png` |
| Composed cover (PDF + reader page 1) | `/assets/covers/{slug}-cover.png` |
| Catalog / library / reader thumb | `/assets/covers/{slug}-thumb.png` |

## Regeneration

```powershell
# Cover art + composed covers (uses Gemini if key in slatepress/.local/gemini-api-key.txt)
python scripts/generate-covers.py --gemini

# Inline figures with standard style hint
python scripts/generate-figures.py --gemini

# Rebuild PDFs after cover change
python scripts/generate-pdfs.py
```

## Code

- Style constants and compose logic: `scripts/livingpdf_style.py`
- Cover pipeline: `scripts/generate-covers.py`
- Procedural fallback (inline figures only): `figure_styles.engraving_bw`, `figure_styles.woodcut`
