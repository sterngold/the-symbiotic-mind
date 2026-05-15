// Build-time validator. Fails the CI job if critical outputs are missing or malformed.
// Mirrors the weekly cron's checks so issues surface BEFORE deploy, not after.
import fs from "node:fs";
import path from "node:path";

const SITE = "_site";
const errors = [];
const warnings = [];

function must(file) {
  const p = path.join(SITE, file);
  if (!fs.existsSync(p)) {
    errors.push(`Missing: ${file}`);
    return null;
  }
  return fs.readFileSync(p, "utf8");
}

// 1) RSS
const rss = must("feed.xml");
if (rss) {
  if (!/<rss[^>]*xmlns:content=/.test(rss))
    errors.push("feed.xml missing xmlns:content");
  const items = rss.match(/<item>/g) || [];
  if (!items.length) errors.push("feed.xml has zero <item>s");
  const encoded = rss.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/g) || [];
  if (encoded.length !== items.length)
    errors.push(`feed.xml: ${items.length} items but ${encoded.length} <content:encoded> blocks`);
  encoded.forEach((c, i) => {
    const inner = c.replace(/^<content:encoded><!\[CDATA\[/, "").replace(/\]\]><\/content:encoded>$/, "").trim();
    if (inner.length < 200) errors.push(`feed.xml item #${i + 1}: <content:encoded> too short (${inner.length} chars)`);
  });
}

// 2) JSON Feed
const json = must("feed.json");
if (json) {
  try {
    const parsed = JSON.parse(json);
    if (!parsed.items?.length) errors.push("feed.json has no items");
    parsed.items?.forEach((it, i) => {
      if (!it.content_html || it.content_html.length < 200)
        errors.push(`feed.json item #${i + 1}: content_html too short`);
    });
  } catch (e) {
    errors.push(`feed.json: invalid JSON — ${e.message}`);
  }
}

// 3) Sitemap
const sitemap = must("sitemap.xml");
if (sitemap) {
  if (!/<urlset/.test(sitemap)) errors.push("sitemap.xml missing <urlset>");
  if (sitemap.trim().startsWith("<!DOCTYPE html")) errors.push("sitemap.xml is HTML, not XML");
}

// 4) Robots
const robots = must("robots.txt");
if (robots) {
  if (!/^Sitemap:\s+https:\/\//m.test(robots)) errors.push("robots.txt missing Sitemap: directive");
  if (robots.trim().startsWith("<!DOCTYPE html")) errors.push("robots.txt is HTML, not text");
}

// 5) llms.txt
must("llms.txt");

// 6) Per-author feeds
must("feed/vlad.xml");
must("feed/milena.xml");

// 7) Posts pages must include OG meta + JSON-LD
const postsDir = path.join(SITE, "posts");
const postDirs = fs.readdirSync(postsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
postDirs.forEach((slug) => {
  const file = path.join(postsDir, slug, "index.html");
  if (!fs.existsSync(file)) {
    errors.push(`Post page missing: posts/${slug}/index.html`);
    return;
  }
  const html = fs.readFileSync(file, "utf8");
  const must = (re, label) => { if (!re.test(html)) errors.push(`posts/${slug}: missing ${label}`); };
  must(/<meta property="og:title"/, "og:title");
  must(/<meta property="og:description"/, "og:description");
  must(/<meta property="og:url"/, "og:url");
  must(/<meta property="og:image"/, "og:image");
  must(/<meta property="og:type" content="article"/, 'og:type=article');
  must(/<meta name="twitter:card"/, "twitter:card");
  must(/<link rel="canonical"/, "canonical");
  must(/<script type="application\/ld\+json">/, "JSON-LD");
});

// Report
if (warnings.length) {
  console.warn("Warnings:\n" + warnings.map((w) => "  - " + w).join("\n"));
}
if (errors.length) {
  console.error("\n❌ Build validation failed:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`✅ Build validation passed (${postDirs.length} posts, ${(rss.match(/<item>/g) || []).length} feed items).`);
