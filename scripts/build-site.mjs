/**
 * Assemble Cloudflare Pages output: 003 React app at /.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appDir = path.join(root, "003");
const siteDir = path.join(root, "_site");

function copyDir(src, dest) {
  if (!existsSync(src)) return;
  cpSync(src, dest, { recursive: true });
}

console.log("Building 003 (Vite)...");
const viteReady = existsSync(path.join(appDir, "node_modules", "vite"));
const runOpts = {
  cwd: appDir,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NODE_ENV: "production" },
};
if (process.env.CI === "true" || process.env.CI === "1" || !viteReady) {
  execSync("npm ci", runOpts);
}
execSync("npm run build", runOpts);

rmSync(siteDir, { recursive: true, force: true });
mkdirSync(siteDir, { recursive: true });

copyDir(path.join(appDir, "dist"), siteDir);
for (const name of ["server.cjs", "server.cjs.map"]) {
  rmSync(path.join(siteDir, name), { force: true });
}

copyDir(path.join(root, "functions"), path.join(siteDir, "functions"));
cpSync(path.join(root, "_redirects"), path.join(siteDir, "_redirects"));

console.log(`Site ready: ${siteDir}`);
