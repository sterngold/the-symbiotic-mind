#!/usr/bin/env node
/** IndexNow ping for symbiotic-mind.com. */
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";

const HOST = "symbiotic-mind.com";
const KEY_FILE = process.env.INDEXNOW_KEY_FILE || "src/static/b8e5597ce674644b282efeff00f92344.txt";
const SITEMAP = process.env.INDEXNOW_SITEMAP || "_site/sitemap.xml";
const DRY = process.env.INDEXNOW_DRY === "1";
const STRICT = process.env.STRICT_INDEXNOW === "1";

if (process.env.SKIP_INDEXNOW) { console.log("[indexnow] SKIP_INDEXNOW set, skipping."); process.exit(0); }
function bail(msg, code = 0) { console.warn(`[indexnow] ${msg}`); process.exit(STRICT ? 1 : 0); }

async function main() {
  let key;
  try {
    key = (await readFile(resolve(KEY_FILE), "utf8")).trim();
  } catch {
    return bail(`IndexNow key file not found at ${resolve(KEY_FILE)}; skipping.`);
  }
  if (!/^[a-f0-9]{32}$/i.test(key)) return bail("IndexNow key file is malformed.", 2);

  const path = resolve(SITEMAP);
  try { await access(path); } catch { return bail(`sitemap not found at ${path}; skipping.`); }
  console.log(`[indexnow] reading sitemap: ${path}`);
  const xml = await readFile(path, "utf8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urls.length === 0) return bail("no <loc> URLs found.", 2);
  const ours = urls.filter((u) => { try { return new URL(u).host === HOST; } catch { return false; } });
  if (ours.length === 0) return bail(`no URLs match host ${HOST}.`, 2);
  console.log(`[indexnow] ${ours.length} URLs to submit`);
  if (DRY) { ours.forEach((u) => console.log("  " + u)); return; }
  const body = { host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList: ours };
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text().catch(() => "");
  console.log(`[indexnow] HTTP ${res.status} ${res.statusText}${text ? " — " + text.slice(0, 200) : ""}`);
  if (res.status >= 400) bail(`rejected: HTTP ${res.status}`, 1);
}
main().catch((e) => bail(`ping failed: ${e.message}`, 1));
