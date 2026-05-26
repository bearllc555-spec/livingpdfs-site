import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const py = fs.readFileSync(path.join(__dirname, "generate-manuscripts.py"), "utf8");

function replacePCalls(text) {
  let result = "";
  let i = 0;
  while (i < text.length) {
    if (text.startsWith("p(", i)) {
      let depth = 1;
      let j = i + 2;
      while (j < text.length && depth > 0) {
        if (text[j] === "(") depth++;
        else if (text[j] === ")") depth--;
        j++;
      }
      const inner = text.slice(i + 2, j - 1);
      const parts = inner.match(/"([^"\\]|\\.)*"/g) || [];
      const joined = parts.map((s) => JSON.parse(s)).join(" ");
      result += JSON.stringify(joined);
      i = j;
    } else {
      result += text[i];
      i++;
    }
  }
  return result;
}

function extractMakeGuideCalls(source) {
  const calls = [];
  let idx = 0;
  const marker = "GUIDES.append(make_guide(";
  while ((idx = source.indexOf(marker, idx)) !== -1) {
    let start = idx + marker.length;
    let depth = 1;
    let j = start;
    while (j < source.length && depth > 0) {
      if (source[j] === "(") depth++;
      else if (source[j] === ")") depth--;
      j++;
    }
    calls.push(source.slice(start, j - 1));
    idx = j;
  }
  return calls;
}

function pyListToJs(pyExpr) {
  let s = replacePCalls(pyExpr.trim());
  s = s.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false").replace(/\bNone\b/g, "null");
  // tuples -> arrays
  s = s.replace(/\(\s*\n/g, "[\n").replace(/\),\s*\n/g, "],\n").replace(/\)\s*\]/g, "]]");
  s = s.replace(/\(\s*"/g, '["').replace(/",\s*\[/g, '", [');
  // fix remaining tuple closings at end of block entries
  s = s.replace(/\),\s*\]/g, "], ]");
  s = s.replace(/\)\s*,\s*\n\s*\]/g, "],\n  ]");
  return s;
}

const calls = extractMakeGuideCalls(py);
const guideEntries = calls.map((c) => {
  let converted = replacePCalls(c.trim());
  converted = converted.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false").replace(/\bNone\b/g, "null");
  // Convert Python tuples to JS arrays
  converted = converted.replace(/\(\s*"/g, '["');
  converted = converted.replace(/\),\s*\n/g, "],\n");
  converted = converted.replace(/\[\s*\n\s*\[/g, "[\n        [");
  converted = converted.replace(/\],\s*\n\s*\[/g, "],\n        [");
  converted = converted.replace(/\),\s*\n\s*\[/g, "],\n        [");
  converted = converted.replace(/\)\s*,\s*\n\s*\]/g, "]\n    ]");
  converted = converted.replace(/\),\s*\n\s*\]/g, "]\n    ]");
  converted = converted.replace(/\)\s*,\s*$/gm, "]");
  converted = converted.replace(/\),$/gm, "]");
  return `  [${converted}],`;
});

const out = `// Auto-transpiled from generate-manuscripts.py
export const GUIDES = [
${guideEntries.join("\n")}
];

${`export const COVER_DATA = {
  "lazy-man-ai": ["AI INCOME", ["LAZY", "MAN'S WAY"], "GET RICH WITH AI"],
  "claude-freelancer": ["FREELANCE", ["CLAUDE", "PLAYBOOK"], "UPWORK & FIVERR"],
  "ai-automation-agency": ["AI AUTO", ["AUTOMATION", "AGENCY"], "n8n · MAKE · CLAUDE"],
  "ai-seo": ["AI SEO", ["GOOGLE &", "ANSWER ENGINES"], "CHATGPT · PERPLEXITY"],
  "ai-email-agency": ["AI EMAIL", ["MARKETING", "AGENCY"], "RETAINER BLUEPRINT"],
  "landing-pages-48h": ["48 HOURS", ["LANDING", "PAGES"], "DONE WITH CLAUDE"],
  "ai-lead-gen": ["AI LEADS", ["BOOK SALES", "CALLS"], "GENERATION SYSTEMS"],
  "claude-code-operators": ["CLAUDE CODE", ["OPERATORS", "WHO BILL"], "NOT DEVELOPERS"],
  "ai-content-engine": ["CONTENT", ["50 POSTS", "PER CLIENT"], "MONTHLY ENGINE"],
};`}
`;

fs.writeFileSync(path.join(__dirname, "guide-data.mjs"), out, "utf8");
console.log(`Wrote guide-data.mjs with ${calls.length} guides`);
