// Global site config. Edit values here, not in templates.
export default {
  title: "The Symbiotic Mind",
  tagline: "AI × HI — a discovery journey on human-AI symbiosis.",
  description:
    "AI × HI is not a tool usage question. It is a relationship design problem. A discovery journey by Vlad Sterngold and Milena Nikolova.",
  url: "https://symbiotic-mind.com",
  language: "en",
  author: "Vlad Sterngold & Milena Nikolova",
  defaultOgImage: "/images/og-default.png",
  // The pillar essay every glossary entry and theme page links up to. Single-sourced
  // here because it is rendered on 16 pages (12 concepts + 3 strands + the themes index),
  // and a hardcoded slug in each of them would mean 16 dead links the day the post is
  // renamed, with no check to catch it. validate-build now crawls internal links, so a
  // wrong value here fails the build instead of shipping a 404.
  pillar: {
    url: "/posts/010-relationship-design/",
    title: "Relationship Design",
  },
  umamiWebsiteId: "e1afdc36-cb27-4f4d-acb3-80c08879420f",
  giscus: {
    repo: "sterngold/sterngold-discussions",
    repoId: "R_kgDORiRCPQ",
    category: "Announcements",
    categoryId: "DIC_kwDORiRCPc4C4As0",
    // Absolute by necessity: giscus fetches the theme from its own origin, so a
    // root-relative path would resolve against giscus.app and 404 into a silent
    // fallback to GitHub's white default. Served with CORS via src/static/_headers.
    theme: "https://symbiotic-mind.com/css/giscus-theme.css",
  },
  // Newsletter — providers controlled by a single flag.
  // Set provider to "substack", "buttondown", "listmonk", or "both" (buttondown+listmonk).
  // 2026-06-11: Substack is the single promoted list (reach plan Track B1) — it carries
  // the network effects (recommendations, Notes, restacks). Buttondown config retained
  // dormant (0 subscribers, nothing migrated); listmonk retained for a future sovereign move.
  newsletter: {
    provider: "substack",
    substack: {
      publicationUrl: "https://thesymbioticmind.substack.com",
      embedUrl: "https://thesymbioticmind.substack.com/embed",
    },
    buttondown: {
      username: "sterngold", // live Buttondown handle — newsletter "The Symbiotic Mind"
      embedUrl: "https://buttondown.com/api/emails/embed-subscribe/sterngold",
    },
    listmonk: {
      // Self-hosted endpoint, e.g. https://lists.example.com/subscription/form
      formActionUrl: "",
      listUuid: "",
    },
  },
  // Social profiles for the footer (rel="me"). Uncomment / add as accounts go live.
  socialLinks: [
    // { label: "Mastodon", url: "https://mas.to/@yourhandle" },
    // { label: "Bluesky",  url: "https://bsky.app/profile/yourhandle" },
  ],
  // Webmentions (IndieWeb) — sign up free at https://webmention.io
  webmention: {
    enabled: false,
    domain: "symbiotic-mind.com",
  },
};
