# LivingPDFs — deployment

**Dev preview:** https://livingpdfs.pages.dev/
**GitHub:** https://github.com/bearllc555-spec/livingpdfs-site
**CF Pages project:** `livingpdfs` (production branch: `dev`)

## Ship loop

1. Edit files in this repo.
2. Commit: `vNN: concise description` (ASCII only).
3. Push to `dev` (or a feature branch for preview).
4. Glance at the live site — confirm the version pill bumped.

## Branch previews

Every branch deploys to `<branch-slug>.livingpdfs.pages.dev`.

## Secrets (GitHub repo)

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID` = `e0f6f68f26f8a26a75eaa793385019ef`

## Manual deploy (optional)

```powershell
$env:CLOUDFLARE_API_TOKEN = (Get-Content "..\..\..\.local\cf-pages-token.txt" -Raw).Trim()
$env:CLOUDFLARE_ACCOUNT_ID = "e0f6f68f26f8a26a75eaa793385019ef"
cd slatepress\repos\livingpdfs-site
npx wrangler pages deploy . --project-name=livingpdfs --branch=dev --commit-dirty=true
```
