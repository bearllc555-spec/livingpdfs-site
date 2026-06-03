/**
 * Cloudflare Pages bundle: Vite dist + SPA redirects + API functions.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "_pages");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const distDir = path.join(root, "dist");
if (!existsSync(distDir)) {
  console.error("Missing dist/ — run npm run build first");
  process.exit(1);
}

cpSync(distDir, outDir, { recursive: true });
for (const name of ["server.cjs", "server.cjs.map"]) {
  rmSync(path.join(outDir, name), { force: true });
}

cpSync(path.join(root, "functions"), path.join(outDir, "functions"), { recursive: true });
cpSync(path.join(root, "_redirects"), path.join(outDir, "_redirects"));

console.log(`Pages bundle ready: ${outDir}`);
