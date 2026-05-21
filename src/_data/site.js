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
  umamiWebsiteId: "e1afdc36-cb27-4f4d-acb3-80c08879420f",
  giscus: {
    repo: "sterngold/sterngold-discussions",
    repoId: "R_kgDORiRCPQ",
    category: "Announcements",
    categoryId: "DIC_kwDORiRCPc4C4As0",
  },
  // Newsletter — two providers, controlled by a single flag.
  // Set provider to "buttondown", "listmonk", or "both".
  newsletter: {
    provider: "buttondown",
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
  // Webmentions (IndieWeb) — sign up free at https://webmention.io
  webmention: {
    enabled: false,
    domain: "symbiotic-mind.com",
  },
};
