import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTENT = path.join(ROOT, "assets", "content");
const COVERS = path.join(ROOT, "assets", "covers");

function block(heading, pages, ...paragraphs) {
  return { heading, pages, paragraphs };
}

function distributePages(total, count, earlyTarget) {
  const base = Array(count).fill(3);
  let s = base.reduce((a, b) => a + b, 0);
  let guard = 0;
  while (s < total && guard++ < 500) {
    base[guard % count] = Math.min(4, base[guard % count] + 1);
    s = base.reduce((a, b) => a + b, 0);
  }
  guard = 0;
  while (s > total && guard++ < 500) {
    let reduced = false;
    for (let j = count - 1; j >= 0; j--) {
      if (base[j] > 2 && s > total) {
        base[j]--;
        s--;
        reduced = true;
      }
    }
    if (!reduced) break;
  }
  let used = 0;
  for (let idx = 0; idx < count && used < earlyTarget; idx++) {
    if (base[idx] < 4 && used + base[idx] + 1 <= earlyTarget + 2) {
      base[idx]++;
    }
    used += base[idx];
  }
  return base;
}

function makeGuide(slug, title, category, totalPages, section, blocksData) {
  const pages = distributePages(totalPages, blocksData.length, Math.max(1, Math.round(totalPages * 0.2)));
  const blocks = blocksData.map(([heading, paras], i) => block(heading, pages[i], ...paras));
  return {
    slug,
    title,
    cover: `/assets/covers/${slug}.svg`,
    category,
    totalPages,
    currentSection: section,
    blocks,
  };
}

function p(...sentences) {
  return sentences.join(" ");
}

// Load guide definitions from transpiled module
const { GUIDES, COVER_DATA } = await import("./guide-data.mjs");

function svgCoverV2(accent, titleLines, subtitle) {
  const lines = [];
  let y = 42;
  for (const t of titleLines.slice(0, 3)) {
    if (t) {
      lines.push(
        `  <text x="36" y="${y}" fill="#f6f1e8" font-family="Georgia, serif" font-size="6.5" font-weight="700" text-anchor="middle">${t}</text>`
      );
      y += 10;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="104" viewBox="0 0 72 104">
  <rect width="72" height="104" fill="#0c1222"/>
  <rect x="6" y="10" width="60" height="84" fill="#1e293b"/>
  <text x="36" y="28" fill="#38bdf8" font-family="sans-serif" font-size="5" font-weight="700" text-anchor="middle">${accent}</text>
${lines.join("\n")}
  <text x="36" y="66" fill="#94a3b8" font-family="sans-serif" font-size="4" text-anchor="middle">${subtitle}</text>
  <rect x="14" y="72" width="8" height="8" rx="1" fill="#38bdf8" opacity="0.7"/>
  <rect x="24" y="72" width="8" height="8" rx="1" fill="#6366f1" opacity="0.6"/>
  <rect x="34" y="72" width="8" height="8" rx="1" fill="#38bdf8" opacity="0.5"/>
  <rect x="44" y="72" width="8" height="8" rx="1" fill="#6366f1" opacity="0.4"/>
  <text x="36" y="92" fill="#64748b" font-family="sans-serif" font-size="4.5" text-anchor="middle">LivingPDFs</text>
</svg>`;
}

fs.mkdirSync(CONTENT, { recursive: true });
fs.mkdirSync(COVERS, { recursive: true });

const createdJson = [];
for (const spec of GUIDES) {
  const guide = makeGuide(...spec);
  const file = path.join(CONTENT, `${guide.slug}.json`);
  fs.writeFileSync(file, JSON.stringify(guide, null, 2) + "\n", "utf8");
  createdJson.push(`${guide.slug}.json`);
  const early = guide.blocks.slice(0, 4).reduce((s, b) => s + b.pages, 0);
  const target = Math.max(1, Math.round(guide.totalPages * 0.2));
  console.log(
    `${guide.slug}: ${guide.blocks.length} blocks, early4=${early} (target ~${target})`
  );
}

const createdCovers = [];
for (const [slug, data] of Object.entries(COVER_DATA)) {
  const [accent, titles, sub] = data;
  const file = path.join(COVERS, `${slug}.svg`);
  fs.writeFileSync(file, svgCoverV2(accent, titles, sub), "utf8");
  createdCovers.push(`${slug}.svg`);
}

console.log("\nJSON:", createdJson.join(", "));
console.log("Covers:", createdCovers.join(", "));
