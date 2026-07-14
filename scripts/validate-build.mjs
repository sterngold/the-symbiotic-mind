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

// 7) Podcast feed (must always exist; episode count may be zero before launch).
const podcast = must("podcast.xml");
if (podcast) {
  if (!/<rss[^>]*xmlns:itunes=/.test(podcast))
    errors.push("podcast.xml missing xmlns:itunes");
  if (!/<itunes:owner>/.test(podcast))
    errors.push("podcast.xml missing <itunes:owner>");
  if (!/<itunes:image\s+href="https?:\/\//.test(podcast))
    errors.push("podcast.xml: <itunes:image> must use an absolute https URL");
  const items = podcast.match(/<item>/g) || [];
  const enclosures = podcast.match(/<enclosure\s/g) || [];
  if (items.length !== enclosures.length)
    errors.push(`podcast.xml: ${items.length} items but ${enclosures.length} <enclosure>s`);
  if (items.length && !/<lastBuildDate>/.test(podcast))
    warnings.push("podcast.xml has episodes but no <lastBuildDate>");
}

// 8) Posts pages must include OG meta + JSON-LD
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

// 9) Internal links must resolve.
//
// Nothing checked this before, which is how a curated `related:` / `concepts:` slug list can
// carry a typo and silently render nothing, and how a hardcoded pillar URL in a layout could
// 404 on 16 pages without ever turning the build red. Every internal href is now crawled
// against the built output. This is also what makes the single-sourced `site.pillar.url` safe:
// get it wrong and the build fails here instead of shipping dead links.
const HREF = /href="(\/[^"#?]*)/g;
const resolves = (url) => {
  const rel = url.replace(/^\//, "");
  if (!rel) return true; // "/" is the homepage
  return (
    fs.existsSync(path.join(SITE, rel)) ||
    fs.existsSync(path.join(SITE, rel, "index.html"))
  );
};

const htmlFiles = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "pagefind") walk(p); // generated search index, not our links
    } else if (entry.name.endsWith(".html")) {
      htmlFiles.push(p);
    }
  }
})(SITE);

let deadLinks = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const seen = new Set();
  for (const [, href] of html.matchAll(HREF)) {
    if (seen.has(href)) continue;
    seen.add(href);
    if (!resolves(href)) {
      deadLinks++;
      if (deadLinks <= 20) {
        errors.push(`dead internal link: ${href}  (on /${path.relative(SITE, file)})`);
      }
    }
  }
}
if (deadLinks > 20) errors.push(`...and ${deadLinks - 20} more dead internal links`);

// 10) The sitemap must list EVERY built page, and nothing that isn't built.
//
// The sitemap used to be a hand-written list, and that is how /start-here/ (the crawl hub)
// and /diagnostic/ (the link magnet) went un-submitted to Google from the day they shipped.
// It now enumerates from collections.all — but that had its own silent hole: Eleventy adds
// only the FIRST page of a paginated template to collections unless the template sets
// `addAllPagesToCollections`, so /themes/identity/, /authors/milena/ and most /tags/ pages
// vanished from the sitemap while the build stayed green. Both failure modes are silent, so
// neither mechanism gets trusted: this asserts the invariant directly against the output.
const SITEMAP_EXEMPT = new Set(["/404/"]);
const sitemapXml = must("sitemap.xml") || "";
const sitemapUrls = new Set(
  [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, u]) =>
    u.replace(/^https?:\/\/[^/]+/, "")
  )
);
const builtPages = new Set();
for (const file of htmlFiles) {
  if (path.basename(file) !== "index.html") continue;
  const dir = path.relative(SITE, path.dirname(file));
  const url = dir === "" ? "/" : `/${dir}/`;
  if (!SITEMAP_EXEMPT.has(url)) builtPages.add(url);
}
for (const url of builtPages) {
  if (!sitemapUrls.has(url)) errors.push(`page built but missing from sitemap.xml: ${url}`);
}
for (const url of sitemapUrls) {
  if (!builtPages.has(url)) errors.push(`sitemap.xml lists a page that was not built: ${url}`);
}

// Report
if (warnings.length) {
  console.warn("Warnings:\n" + warnings.map((w) => "  - " + w).join("\n"));
}
if (errors.length) {
  console.error("\n❌ Build validation failed:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(
  `✅ Build validation passed (${postDirs.length} posts, ${(rss.match(/<item>/g) || []).length} feed items, ` +
    `${htmlFiles.length} pages link-checked, ${builtPages.size} pages in sitemap).`
);
