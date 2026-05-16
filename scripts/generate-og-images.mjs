#!/usr/bin/env node
/**
 * Per-page OG image generator.
 *
 * For each entry in PAGES below, renders a 1200x630 PNG using satori
 * (SVG-from-React-JSX) + resvg (SVG-to-PNG). Writes to src/images/og/.
 * Eleventy's passthrough config copies src/images -> _site/images at build,
 * so these are served at /images/og/<slug>.png.
 *
 * Run as part of `npm run build` (added to the build script in package.json).
 *
 * Fonts: Libre Baskerville (serif, titles) and Inter (sans, labels). Both
 * downloaded once at build time and cached in scripts/.font-cache/.
 */
import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
// Note: satori accepts plain object trees (React-like) without needing `h`.
// See https://github.com/vercel/satori#use-without-jsx

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "src/images/og");
const FONT_CACHE = join(__dirname, ".font-cache");

// ── Pages that need a unique OG image ────────────────────────────────────────
// Posts already have per-post OGs (their cover.src / ogImage frontmatter).
// These are the *section* pages that all currently share og-default.png.
const PAGES = [
  {
    slug: "home",
    eyebrow: "THE SYMBIOTIC MIND",
    title: "AI × HI is not a tool usage question.\nIt is a relationship design problem.",
    footer: "by Vlad Sterngold & Milena S. Nikolova, PhD",
  },
  {
    slug: "about",
    eyebrow: "ABOUT",
    title: "Two angles on the same question:\nwhat happens to the human\nwhen AI enters the work?",
    footer: "The Symbiotic Mind",
  },
  {
    slug: "posts",
    eyebrow: "WRITING",
    title: "Essays on human-AI symbiosis,\nbehavioral science, and\nrelationship design.",
    footer: "The Symbiotic Mind",
  },
  {
    slug: "listen",
    eyebrow: "LISTEN",
    title: "The AI × HI podcast.\nPractitioner meets behavioral science.",
    footer: "The Symbiotic Mind",
  },
  {
    slug: "watch",
    eyebrow: "WATCH",
    title: "Video essays on relationship design between humans and AI.",
    footer: "The Symbiotic Mind",
  },
  {
    slug: "tags",
    eyebrow: "TAGS",
    title: "Browse posts by topic.",
    footer: "The Symbiotic Mind",
  },
  {
    slug: "author-vlad",
    eyebrow: "AUTHOR",
    title: "Vlad Sterngold",
    footer: "AI practitioner and builder · Amsterdam",
  },
  {
    slug: "author-milena",
    eyebrow: "AUTHOR",
    title: "Milena S. Nikolova, PhD",
    footer: "Behavioral scientist · Lausanne",
  },
];

// ── Brand tokens ─────────────────────────────────────────────────────────────
const BG = "#0c1117";        // deep ink
const FG = "#e8e6e1";        // warm off-white
const ACCENT = "#d4af37";    // muted gold (the "×" mark)
const MUTED = "#8b8f95";     // mid-grey for eyebrow + footer

// ── Font loader (cached) ──────────────────────────────────────────────────────
async function ensureFont(name, url) {
  await mkdir(FONT_CACHE, { recursive: true });
  const path = join(FONT_CACHE, `${name}.ttf`);
  try {
    await access(path);
  } catch {
    console.log(`[og] downloading ${name}...`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Font fetch failed for ${name}: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(path, buf);
  }
  return readFile(path);
}

// ── JSX-as-object (satori accepts React-like objects directly) ───────────────
function card({ eyebrow, title, footer }) {
  return {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: BG,
        backgroundImage:
          "radial-gradient(circle at 70% 30%, rgba(212, 175, 55, 0.08), transparent 60%)",
        fontFamily: "Inter",
      },
      children: [
        // top: eyebrow
        {
          type: "div",
          props: {
            style: {
              fontSize: 22,
              letterSpacing: "0.18em",
              color: MUTED,
              fontWeight: 500,
              textTransform: "uppercase",
              display: "flex",
            },
            children: [
              { type: "span", props: { children: eyebrow.replace("×", "") } },
              eyebrow.includes("×")
                ? {
                    type: "span",
                    props: {
                      style: { color: ACCENT, padding: "0 0.25em" },
                      children: "×",
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        // middle: title (serif)
        {
          type: "div",
          props: {
            style: {
              fontFamily: "Libre Baskerville",
              fontSize: 60,
              lineHeight: 1.15,
              color: FG,
              fontWeight: 400,
              maxWidth: "1040px",
              whiteSpace: "pre-wrap",
              display: "flex",
            },
            children: title,
          },
        },
        // footer
        {
          type: "div",
          props: {
            style: {
              fontSize: 22,
              color: MUTED,
              fontWeight: 400,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            },
            children: [
              { type: "span", props: { children: footer } },
              {
                type: "span",
                props: {
                  style: { color: MUTED, fontFamily: "Inter", letterSpacing: "0.05em" },
                  children: "symbiotic-mind.com",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  // Google Fonts direct .ttf URLs (stable, cached on disk after first run)
  // Direct .ttf URLs from Google Fonts (stable, cached on disk after first run).
  // Mirror of @font-face declarations in src/css/style.css.
  const [interReg, interMed, libreReg] = await Promise.all([
    ensureFont(
      "inter-regular",
      "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf"
    ),
    ensureFont(
      "inter-medium",
      "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf"
    ),
    ensureFont(
      "libre-baskerville-regular",
      "https://fonts.gstatic.com/s/librebaskerville/v24/kmKUZrc3Hgbbcjq75U4uslyuy4kn0olVQ-LglH6T17uj8Q4SCQ.ttf"
    ),
  ]);

  const fonts = [
    { name: "Inter", data: interReg, weight: 400, style: "normal" },
    { name: "Inter", data: interMed, weight: 500, style: "normal" },
    { name: "Libre Baskerville", data: libreReg, weight: 400, style: "normal" },
  ];

  let count = 0;
  for (const p of PAGES) {
    const svg = await satori(card(p), { width: 1200, height: 630, fonts });
    const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
      .render()
      .asPng();
    const outPath = join(OUT_DIR, `${p.slug}.png`);
    await writeFile(outPath, png);
    console.log(`[og] wrote src/images/og/${p.slug}.png (${(png.length / 1024).toFixed(1)} KiB)`);
    count++;
  }

  console.log(`[og] generated ${count} OG images.`);
}

main().catch((e) => {
  console.error("[og] failed:", e);
  process.exit(1);
});
