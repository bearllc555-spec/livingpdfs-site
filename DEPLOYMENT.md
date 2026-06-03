# LivingPDFs — deployment

## Agent rules (read first)

1. **Never deploy unless the user explicitly asks.** Code changes alone do not mean deploy.
2. **Default target is dev only:** https://livingpdfs.pages.dev/ — not `livingpdfs.com`.
3. **Do not push live / mention production** unless the user says so (e.g. “push live”, “ship to .com”).
4. When deploying to dev, say **“deployed to dev”** and link **pages.dev only**. Do not frame it as a production release.

**Production:** https://livingpdfs.com/ (also https://www.livingpdfs.com/) — user-initiated only
**Dev (our working site):** https://livingpdfs.pages.dev/
**GitHub:** https://github.com/bearllc555-spec/livingpdfs-site
**CF Pages project:** `livingpdfs` (production branch: `dev`)
**CF zone ID:** `93564b4b572015e77d5f0dc14eeaf9c5` (also in `slatepress/.local/livingpdfs-cf-zone-id.txt`)

## Custom domain (2026-05-26)

Pages custom domains: `livingpdfs.com`, `www.livingpdfs.com`

DNS (proxied CNAME, both → `livingpdfs.pages.dev`):

| Name | Type | Content |
|------|------|---------|
| `livingpdfs.com` | CNAME | `livingpdfs.pages.dev` |
| `www` | CNAME | `livingpdfs.pages.dev` |

## Site layout

- **`/` (production home)** — built from `003/` (Vite + React). CI runs `node scripts/build-site.mjs` and deploys `_site/`.
- Canonical app source for Cloudflare: **github.com/bearllc555-spec/livingpdfs-com** (flat repo, same `003/` code).

Local dev: `npm run dev` from repo root (or `cd 003 && npm run dev`) → http://localhost:3003/

## Ship loop

1. Edit files in this repo (usually under `003/src/`).
2. Commit: `vNN: concise description` (ASCII only).
3. Push to `dev` (or a feature branch for preview).
4. Glance at the live site — confirm the app version pill bumped (003 header).

## Live vs pages.dev

`livingpdfs.com` and `livingpdfs.pages.dev` serve the **same production deployment** (branch `dev`). Static assets (JS, CSS, images, PDFs) are byte-identical.

HTML files on the custom domain are ~735 bytes larger because Cloudflare **Email Address Obfuscation** injects a script around `bearllc555@gmail.com` in the header popdown. Visible page content matches.


## Secrets (GitHub repo)

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID` = `e0f6f68f26f8a26a75eaa793385019ef`

## Manual deploy to dev (only when user asks)

```powershell
$env:CLOUDFLARE_API_TOKEN = (Get-Content "..\..\..\.local\cf-pages-token.txt" -Raw).Trim()
$env:CLOUDFLARE_ACCOUNT_ID = "e0f6f68f26f8a26a75eaa793385019ef"
cd slatepress\repos\livingpdfs-site
node scripts/build-site.mjs
npx wrangler pages deploy _site --project-name=livingpdfs --branch=dev --commit-dirty=true
```

Verify on https://livingpdfs.pages.dev/ (version pill). Do not call this a production deploy.

Note: CF attaches `livingpdfs.com` to the same `dev` branch deployment. Treat **pages.dev** as dev in conversation; only discuss `.com` when the user requests a live push.
