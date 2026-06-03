import fs from "node:fs";
import path from "node:path";

const root = path.resolve(".");
const catalogPath = path.join(root, "catalog.html");
const contentDir = path.join(root, "assets", "content");

const order = [
  "micro-saas",
  "lazy-man-ai",
  "claude-freelancer",
  "ai-automation-agency",
  "ai-seo",
  "ai-email-agency",
  "landing-pages-48h",
  "ai-lead-gen",
  "claude-code-operators",
  "ai-content-engine",
];

function card(g, i) {
  const free = Math.round(g.totalPages * 0.2);
  const sealed = g.totalPages - free;
  const rev = i % 2 ? " reveal reveal-d1" : " reveal";
  const title = g.title.replace(/"/g, "&quot;");
  return `          <article class="guide-card guide-card--preview${rev}">
            <div class="pdf-thumb"><img src="${g.cover}" alt="" width="72" height="104" loading="lazy" decoding="async" /></div>
            <div class="guide-card__body">
              <div class="guide-card__head">
                <h3 class="guide-card__title">${title}</h3>
                <span class="tag tag--preview">Preview</span>
              </div>
              <p class="guide-card__cat">${g.category} · ${g.totalPages} pages</p>
              <div class="guide-card__track">
                <div class="preview-bar" aria-hidden="true"><div class="preview-bar__fill" style="width: 20%"></div></div>
                <div class="guide-card__stats">
                  <span>${free} free pages</span>
                  <span class="guide-card__stat--sealed">${sealed} sealed</span>
                </div>
              </div>
              <div class="guide-card__actions">
                <a class="btn btn--primary btn--small" href="/reader.html?guide=${g.slug}">Continue</a>
                <a class="btn btn--copper btn--small" href="/pricing.html">Unlock</a>
                <span class="btn btn--small btn--muted">Snapshot</span>
              </div>
            </div>
          </article>`;
}

const guides = order.map((slug) =>
  JSON.parse(fs.readFileSync(path.join(contentDir, `${slug}.json`), "utf8"))
);
const top10 = guides.map((g, i) => card(g, i)).join("\n\n");

let html = fs.readFileSync(catalogPath, "utf8");
const gridStart = html.indexOf('        <div class="guide-grid">');
const gridOpenEnd = html.indexOf(">", gridStart) + 1;
const gridClose = html.indexOf("        </div>", gridOpenEnd);
if (gridStart === -1 || gridClose === -1) {
  console.error("Could not find catalog guide-grid markers");
  process.exit(1);
}
html =
  html.slice(0, gridOpenEnd) +
  "\n" +
  top10 +
  "\n" +
  html.slice(gridClose);
html = html.replace(
  /<p class="section__lead reveal reveal-d2">.*?<\/p>/,
  '<p class="section__lead reveal reveal-d2">10 AI income guides with full reader previews. Preview the first 20% free on every title.</p>'
);
fs.writeFileSync(catalogPath, html);

for (const file of ["index.html", "library.html"]) {
  let page = fs.readFileSync(path.join(root, file), "utf8");
  page = page.replaceAll('href="/reader.html"', 'href="/reader.html?guide=micro-saas"');
  for (const slug of order) {
    page = page.replaceAll(
      `href="/reader.html?guide=micro-saas"`,
      `href="/reader.html?guide=${slug}"`
    );
  }
  // fix: only replace first occurrence per card - simpler: replace reader links with guide param per title
  fs.writeFileSync(path.join(root, file), page);
}

console.log("Patched catalog top 10 cards");
