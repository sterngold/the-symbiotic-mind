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

// Our own origin, derived from the sitemap rather than hardcoded, so a domain change cannot
// silently switch the self-absolute-URL checks in §9 off. Null (sitemap missing/malformed)
// means those checks are SKIPPED, not silently passed — §9 says so out loud.
const SITE_ORIGIN = (sitemap?.match(/<loc>(https?:\/\/[^/]+)/) || [])[1] || null;
if (sitemap && !SITE_ORIGIN)
  errors.push("sitemap.xml: cannot derive site origin from the first <loc> — self-absolute asset URLs cannot be checked");

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

// 9) Internal links AND local assets must resolve.
//
// Nothing checked this before, which is how a curated `related:` / `concepts:` slug list can
// carry a typo and silently render nothing, and how a hardcoded pillar URL in a layout could
// 404 on 16 pages without ever turning the build red.
//
// `href` was covered from the start; `src` never was, and neither was any self-absolute URL.
// That pair of holes let post 013 build green while carrying BOTH an <img src> and an
// og:image pointing at a cover that did not exist — a broken hero and a broken social card,
// with nothing red anywhere.
//
// The lesson of that bug is that PARTIAL coverage looks exactly like full coverage. So this
// section does not merely widen the net; it asserts its own reach (§9d) and refuses to report
// success on a run that quietly examined less than the page actually offers.

// 9a) What carries a URL.
// Double AND single quotes: Eleventy emits double, but posts may contain raw HTML.
// `content` is here for og:image / twitter:image / og:url. Most `content` values are prose or
// colours; they are filtered out by "must resolve to a site-internal path" rather than by an
// allowlist of meta names, so a NEW url-bearing meta is covered the day it is added.
// `srcset`/`poster` are unused in today's output and included anyway, so the day a responsive
// image or a <video poster> lands it is already covered instead of quietly reopening the hole.
const TRACKED_ATTRS = ["href", "src", "srcset", "poster", "content"];
const URL_ATTR = new RegExp(`\\b(${TRACKED_ATTRS.join("|")})\\s*=\\s*("([^"]*)"|'([^']*)')`, "g");

// Any attribute whose value is site-internal — a root-relative path, or an absolute URL on
// our own host. Used ONLY by §9d to measure this section's reach against the real output.
// Independent of TRACKED_ATTRS by design; see the comment at its use site.
const INTERNAL_VALUE_ATTR = new RegExp(
  `\\b([a-zA-Z][a-zA-Z0-9-]*)\\s*=\\s*["'](?:/(?!/)|https?://[^"'/]*${
    SITE_ORIGIN ? SITE_ORIGIN.replace(/^https?:\/\/(www\.)?/, "").replace(/[.]/g, "\\.") : "\\u0000NEVER"
  })`,
  "g"
);

// JSON-LD references assets too ("image", "logo", "thumbnailUrl") and lives in a <script>
// body, not an attribute — invisible to any attribute regex. Post 013's JSON-LD carries the
// same cover URL as its og:image, so leaving it out would have left a third copy of the very
// reference this fix exists to check.
const LD_JSON = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
const LD_URL_KEYS = new Set(["image", "logo", "thumbnailUrl", "contentUrl"]);

// 9b) Deciding what is ours.
// Matching on the raw origin STRING was itself a silent-failure generator: a sitemap on the
// apex while pages emit `www`, or one hand-typed absolute ogImage in frontmatter, and every
// self-absolute URL silently fell into the "external, ignore" bucket. The degraded run then
// printed FEWER warnings and still exited 0 — it looked cleaner precisely because it checked
// less. Matching on HOST, ignoring scheme and a leading `www.`, removes that failure mode
// instead of merely detecting it. §9d is the backstop for a genuinely different domain.
const siteHost = SITE_ORIGIN ? SITE_ORIGIN.replace(/^https?:\/\//, "").replace(/^www\./, "") : null;
const isOurHost = (host) => !!siteHost && host.replace(/^www\./, "").toLowerCase() === siteHost.toLowerCase();

let selfAbsolute = 0; // self-absolute URLs successfully normalised — floor-asserted in §9d

// One raw value expands to the internal URLs it references. srcset carries several
// ("a.png 1x, b.png 2x"); everything else carries exactly one and must NOT be comma-split —
// a description meta full of commas would be shredded into nonsense candidates.
function internalUrls(attr, raw) {
  const out = [];
  for (const part of attr === "srcset" ? raw.split(",") : [raw]) {
    let u = part.trim().split(/\s+/)[0];
    if (!u) continue;
    const abs = u.match(/^https?:\/\/([^/]+)(\/.*)?$/i);
    if (abs) {
      if (!isOurHost(abs[1])) continue; // genuinely external
      selfAbsolute++;
      u = abs[2] || "/";
    }
    if (!u.startsWith("/") || u.startsWith("//")) continue; // protocol-relative, mailto:, #anchor, data:, relative
    out.push(u.split("#")[0].split("?")[0].replace(/&amp;/g, "&"));
  }
  return out;
}

const resolves = (url) => {
  const rel = decodeURIComponent(url).replace(/^\//, "");
  if (!rel) return true; // "/" is the homepage
  return (
    fs.existsSync(path.join(SITE, rel)) ||
    fs.existsSync(path.join(SITE, rel, "index.html"))
  );
};

// 9c) Assets from build STEPS that can be skipped locally: `og` downloads fonts from
// fonts.gstatic.com (unreachable in a sandboxed session) and `pagefind` is a separate binary.
// When the producing step never ran, its whole output directory is absent, and a reference
// into it is UNCHECKED — neither clean nor broken. Reporting it as broken trains people to
// ignore this validator; reporting it as clean is a lie. It is counted, named, surfaced in the
// success line, and made a hard error under CI.
//
// The allowance is DIRECTORY-level, never file-level: if the directory exists and a file
// inside it is missing, that is a hard error on every machine.
const GENERATED_ROOTS = [
  { prefix: "/images/og/", dir: "images/og", step: "npm run og" },
  { prefix: "/pagefind/", dir: "pagefind", step: "npm run pagefind" },
];
const unchecked = new Map();
const skippedProducer = (url) =>
  GENERATED_ROOTS.find(
    (g) => url.startsWith(g.prefix) && !fs.existsSync(path.join(SITE, g.dir))
  );

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
let urlsChecked = 0;
const examinedByAttr = new Map(); // attr -> count actually examined, for the §9d reach assertion
const candidateByAttr = new Map(); // attr -> site-internal values present in the raw HTML
const uncheckedByAttr = new Map(); // attr -> refs that fell into a skipped producer's dir

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const seen = new Set();

  // Empirical manifest of which attributes in THIS OUTPUT actually carry an internal URL,
  // derived by scanning the raw HTML for any attribute whose value is site-internal. It is
  // deliberately NOT derived from TRACKED_ATTRS: a guard computed from the thing it guards
  // cannot catch that thing shrinking. Typo `src` out of TRACKED_ATTRS and this still sees
  // 13 internal `src=` values in the output, so §9d can say they went unexamined.
  // Scanning for internal values only means an external-only attribute (an `action=` posting
  // off-site) can never provoke a false red.
  for (const [, attr] of html.matchAll(INTERNAL_VALUE_ATTR)) {
    candidateByAttr.set(attr, (candidateByAttr.get(attr) || 0) + 1);
  }

  const refs = [];
  for (const [, attr, , dq, sq] of html.matchAll(URL_ATTR)) {
    for (const url of internalUrls(attr, dq ?? sq ?? "")) refs.push([attr, url]);
  }
  for (const [, body] of html.matchAll(LD_JSON)) {
    try {
      const collect = (node) => {
        if (typeof node === "string") return;
        if (Array.isArray(node)) return node.forEach(collect);
        if (!node || typeof node !== "object") return;
        for (const [k, v] of Object.entries(node)) {
          if (LD_URL_KEYS.has(k)) {
            for (const one of Array.isArray(v) ? v : [v]) {
              if (typeof one === "string") {
                for (const url of internalUrls("ld+json", one)) refs.push(["ld+json " + k, url]);
              } else collect(one);
            }
          } else collect(v);
        }
      };
      collect(JSON.parse(body));
    } catch (e) {
      // Malformed JSON-LD is itself a defect: Google drops the whole block silently.
      errors.push(`invalid JSON-LD on /${path.relative(SITE, file)} — ${e.message}`);
    }
  }

  // Keyed on attr+url, not url alone: the same missing cover is genuinely broken on TWO
  // surfaces (the <img> and the social card) and naming only whichever matched first
  // pointed at the wrong one.
  for (const [attr, url] of refs) {
    const key = `${attr}|${url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const skip = skippedProducer(url);
    if (skip) {
      unchecked.set(skip.step, (unchecked.get(skip.step) || 0) + 1);
      uncheckedByAttr.set(attr, (uncheckedByAttr.get(attr) || 0) + 1);
      continue;
    }
    urlsChecked++;
    examinedByAttr.set(attr, (examinedByAttr.get(attr) || 0) + 1);
    if (!resolves(url)) {
      deadLinks++;
      if (deadLinks <= 20) {
        const kind = attr === "href" ? "dead internal link" : `dead ${attr} target`;
        errors.push(`${kind}: ${url}  (on /${path.relative(SITE, file)})`);
      }
    }
  }
}
if (deadLinks > 20) errors.push(`...and ${deadLinks - 20} more dead internal references`);

// 9d) Assert this section's own REACH.
//
// The bug being fixed was partial coverage, and partial coverage is invisible: `href` alone
// yields ~95% of the URLs on this site, so typoing `src` out of the list, or breaking the
// absolute-URL branch, still prints a confident four-digit total and exits 0. A count is not
// evidence of coverage. These compare what was examined against what the OUTPUT actually
// offered, so they self-calibrate as the site changes instead of hardcoding an expectation.
for (const [attr, present] of candidateByAttr) {
  const examined = examinedByAttr.get(attr) || 0;
  if (examined > 0) continue;
  // Legitimately zero when every internal reference through this attribute pointed into a
  // skipped producer's directory. Counted per-attribute so the allowance stays exactly as
  // wide as the evidence, instead of muting the assertion whenever ANY producer is skipped.
  if ((uncheckedByAttr.get(attr) || 0) >= present) continue;
  errors.push(
    `link check found ${present} site-internal '${attr}=' value(s) in the output but examined ZERO of them — ` +
      `the extractor lost this attribute; the site is not clean, it is unmeasured`
  );
}
if (!urlsChecked) errors.push("link check examined ZERO internal URLs — the extractor is broken, not the site clean");
if (SITE_ORIGIN && htmlFiles.length && selfAbsolute === 0) {
  errors.push(
    `link check normalised ZERO self-absolute URLs against ${SITE_ORIGIN}, yet every page renders ` +
      `canonical/og:url through absUrl — the derived origin does not match what the pages emit, ` +
      `so og:image and canonical went unchecked`
  );
}

// Warnings never move the exit code, and CF Pages reads only the exit code — so under CI an
// UNCHECKED bucket is promoted to a hard error. `build:no-search` really does omit pagefind,
// so "the producers always run in CI" is an assumption, and assumptions are what this file is
// for catching.
for (const [step, n] of unchecked) {
  const msg = `${n} reference(s) UNCHECKED: '${step}' did not run, so its output directory is absent`;
  if (process.env.CI) errors.push(`${msg} — unacceptable in CI`);
  else warnings.push(`${msg} (expected locally, never in a full build)`);
}

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
// The UNCHECKED total belongs in the success line, not only in the warnings block. A reader
// who sees "✅ passed" and a four-digit count has no way to tell a full run from a degraded
// one, and a degraded run prints FEWER warnings, not more. State the instrument, not just the
// verdict.
const uncheckedTotal = [...unchecked.values()].reduce((a, b) => a + b, 0);
console.log(
  `✅ Build validation passed (${postDirs.length} posts, ${(rss.match(/<item>/g) || []).length} feed items, ` +
    `${htmlFiles.length} pages checked, ${urlsChecked} internal links+assets resolved` +
    (uncheckedTotal ? `, ${uncheckedTotal} UNCHECKED` : ", 0 unchecked") +
    `, ${builtPages.size} pages in sitemap).`
);
