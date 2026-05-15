import { DateTime } from "luxon";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from "markdown-it-footnote";
import rssPlugin from "@11ty/eleventy-plugin-rss";

export default function (eleventyConfig) {
  // Passthrough: keep CSS, images, and a few static files copied as-is.
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // RSS / date helpers.
  eleventyConfig.addPlugin(rssPlugin);

  // Markdown configuration: footnotes + heading anchors + HTML-in-markdown allowed.
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: false,
    breaks: false,
  })
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink({
        safariReaderFix: true,
        class: "heading-anchor",
      }),
      level: [2, 3],
      slugify: (s) =>
        s
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-"),
    })
    .use(markdownItFootnote);
  eleventyConfig.setLibrary("md", md);

  // ---- Filters ---------------------------------------------------------------

  eleventyConfig.addFilter("postDate", (d) =>
    DateTime.fromJSDate(d, { zone: "utc" }).toFormat("d LLLL yyyy")
  );
  eleventyConfig.addFilter("isoDate", (d) =>
    DateTime.fromJSDate(d, { zone: "utc" }).toISO()
  );
  eleventyConfig.addFilter("year", (d) =>
    (d ? DateTime.fromJSDate(d, { zone: "utc" }) : DateTime.now()).toFormat(
      "yyyy"
    )
  );
  eleventyConfig.addFilter("rfc822", (d) =>
    DateTime.fromJSDate(d, { zone: "utc" }).toRFC2822()
  );

  // Reading time: ~220 wpm.
  eleventyConfig.addFilter("readingTime", (html) => {
    if (!html) return "1 min";
    const text = String(html).replace(/<[^>]+>/g, " ");
    const words = text.split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(words / 220))} min`;
  });

  // Absolute-URL filter (in addition to the rss plugin's).
  eleventyConfig.addFilter("absUrl", (path, base) => {
    if (!path) return base;
    if (/^https?:\/\//.test(path)) return path;
    return new URL(path, base).toString();
  });

  // ---- Collections -----------------------------------------------------------

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("postsByAuthor", (api) => {
    const map = new Map();
    api.getFilteredByGlob("src/posts/*.md").forEach((p) => {
      const slug = (p.data.author && p.data.author.slug) || "unknown";
      if (!map.has(slug)) map.set(slug, []);
      map.get(slug).push(p);
    });
    for (const arr of map.values()) arr.sort((a, b) => b.date - a.date);
    return map;
  });

  eleventyConfig.addCollection("tags", (api) => {
    const tags = new Set();
    api.getFilteredByGlob("src/posts/*.md").forEach((p) => {
      (p.data.tags || []).forEach((t) => {
        if (t !== "post") tags.add(t);
      });
    });
    return [...tags].sort();
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["md", "njk", "html", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
