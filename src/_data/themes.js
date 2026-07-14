// Themes — the three strands the essay series actually runs on.
//
// A post declares `theme: <slug>` in its frontmatter. The `themes` collection
// (eleventy.config.mjs) groups posts by that slug, /themes/ lists the strands,
// /themes/<slug>/ lists the essays in one, and post.njk renders "Also in this
// theme". Each strand is a query-shaped page in its own right, which is the
// point: the essays sit deep in the site and Google has been slow to reach them.
//
// Order controls display order on /themes/ and in the nav.
export default {
  relationship: {
    title: "The Relationship",
    seoTitle: "The Human-AI Relationship: Asymmetry, Flattery, and Terms You Did Not Set",
    description:
      "The human-AI relationship behaves like a relationship, not a tool: one side cannot leave, one side flatters, and both adapt. These essays map how it actually works, and what it costs to leave the terms unchosen.",
    oneLine:
      "How the relationship actually behaves: asymmetry, flattery, worldview, and the terms you set or inherit.",
    order: 1,
  },
  identity: {
    title: "Identity & Capability",
    seoTitle: "AI and Professional Identity: What Changes About Being Good at Your Job",
    description:
      "When the competitive unit becomes the human plus their AI team, professional identity changes underneath you. These essays follow what AI amplifies, what it quietly takes, and which parts of your capability are actually transferable.",
    oneLine:
      "What AI does to professional identity, voice, and the skills that made you valuable.",
    order: 2,
  },
  memory: {
    title: "Memory",
    seoTitle: "AI Memory vs Human Memory: What Should Be Allowed to Be Remembered",
    description:
      "AI memory and human memory are not the same kind of thing, and treating them as one will mislead you. These essays cover what each kind of memory is for, why more memory can make a system worse, and what should be allowed to keep shaping future answers.",
    oneLine:
      "How AI memory differs from human memory, and what deserves to be kept at all.",
    order: 3,
  },
};
