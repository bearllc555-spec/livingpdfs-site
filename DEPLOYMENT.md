# LivingPDFs — deployment

## URLs

| Target | URL |
|--------|-----|
| Production | https://livingpdfs.pages.dev/ · https://livingpdfs.com/ |
| GitHub (app) | https://github.com/bearllc555-spec/livingpdfs-com |
| GitHub (monorepo) | https://github.com/bearllc555-spec/livingpdfs-site |

**CF Pages project:** `livingpdfs` · **Account ID:** `e0f6f68f26f8a26a75eaa793385019ef`  
**Production CF branch:** `dev` (`dev` or `main` git pushes map to CF `dev`)

## Repo layout

Vite + React app lives at **repo root** (`src/`, `public/`, `server.ts`).  
`scripts/` holds PDF/manuscript tooling (not deployed).  
CI: `npm ci` → `npm run build` → `scripts/prepare-pages.mjs` → deploy `_pages/`.

## Local dev

```powershell
npm install
npm run dev
```

Open http://localhost:3003/

## GitHub Actions secrets

| Secret | Value |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | Pages Edit token (`.local/cf-pages-token.txt`) |
| `CLOUDFLARE_ACCOUNT_ID` | `e0f6f68f26f8a26a75eaa793385019ef` |

## Manual deploy

```powershell
$env:CLOUDFLARE_API_TOKEN = (Get-Content "..\..\slatepress\.local\cf-pages-token.txt" -Raw).Trim()
$env:CLOUDFLARE_ACCOUNT_ID = "e0f6f68f26f8a26a75eaa793385019ef"
npm ci
npm run build
node scripts/prepare-pages.mjs
npx wrangler pages deploy _pages --project-name=livingpdfs --branch=dev --commit-dirty=true
```

Bump `SITE_VERSION` in `src/lib/version.ts` on each ship.
