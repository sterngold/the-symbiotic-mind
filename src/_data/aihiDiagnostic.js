// The AI×HI Diagnostic — question bank + result copy.
// Source: proposal draft 2026-06-11 (sent to Milena), all 9 candidate questions kept
// per Vlad's 2026-06-12 decision. Position names are PLACEHOLDERS pending both
// authors' naming pass. All copy here is R2 public prose — author-reviewed on the
// PR preview before merge.
// Scoring: options index 0..3 map to scores 0..3 (tool-use→structural / drifting→designed).
// A reader may instead write their own answer (unscored, never transmitted — reflective only).

export default {
  title: "Where are you on the AI×HI matrix?",
  axes: {
    depth: {
      label: "Depth",
      question: "how much has AI changed you?",
      poles: ["Tool-use — AI executes tasks; your way of working is intact",
              "Structural — AI has changed how you think, decide, remember"],
    },
    intent: {
      label: "Intent",
      question: "who is steering that change?",
      poles: ["Drifting — the change happens to you",
              "Designed — you choose and steer it"],
    },
  },

  questions: [
    {
      key: "d1", axis: "depth", label: "The disappearance test",
      prompt: "If every AI tool vanished tomorrow, what would change about your work?",
      options: [
        "Almost nothing, some tasks would take longer",
        "I'd lose speed but my way of working would survive",
        "I'd have to rebuild parts of how I think through problems",
        "I genuinely don't know who I'd be professionally without it",
      ],
      essay: { num: "005", slug: "005-the-partner-who-cannot-leave", title: "The Partner Who Cannot Leave" },
    },
    {
      key: "d2", axis: "depth", label: "The first move",
      prompt: "When a hard problem lands on your desk, what happens first?",
      options: [
        "I work it out myself; AI maybe polishes the result",
        "I rough out my answer, then test it against AI",
        "I think WITH it from the first minute, back and forth",
        "The conversation IS the thinking; I can't separate my part from its part",
      ],
      essay: { num: "001", slug: "001-you-are-not-using-ai", title: "You Are Not Using AI. You Are in a Relationship With It." },
    },
    {
      key: "d3", axis: "depth", label: "The memory question",
      prompt: "Does your AI know things about you that matter to the quality of its answers?",
      options: [
        "No, every conversation starts from zero",
        "A few preferences, nothing structural",
        "It carries real context about my work and corrects me from it",
        "It holds parts of my professional memory I no longer keep in my head",
      ],
      essay: { num: "006", slug: "006-down-the-memory-river", title: "Down the memory river with AI" },
    },
    {
      key: "d4", axis: "depth", label: "The identity question",
      prompt: "When you describe what you're good at professionally, does AI appear in the answer?",
      options: [
        "No, my skills are mine, AI is a tool I sometimes use",
        "It shows up as one tool among many",
        "Some of my output is honestly “us,” not “me”",
        "My capability without it and with it are two different professionals",
      ],
      essay: { num: "002", slug: "002-my-api-not-my-resume", title: "My API, Not My Resume" },
    },
    {
      key: "d5", axis: "depth", label: "The voice test",
      prompt: "Could your AI produce a paragraph that colleagues would attribute to you?",
      options: [
        "Not at all",
        "Roughly my topics, not my voice",
        "Close enough that I'd only need light edits",
        "It has written things I published with my name on them",
      ],
      essay: { num: "004", slug: "004-what-the-terrace-knew", title: "Queryable vs Quotable" },
    },
    {
      key: "i1", axis: "intent", label: "The rules question",
      prompt: "Do you have explicit rules for what you do and don't hand to AI?",
      options: [
        "No rules, I decide in the moment",
        "A few instincts I couldn't write down",
        "Clear personal rules I actually follow",
        "Written rules I revisit and revise as the tools change",
      ],
      essay: null, // traces to the framework's design-intent axis, not a single essay
    },
    {
      key: "i2", axis: "intent", label: "The skills ledger",
      prompt: "Which of your skills are getting stronger because of AI, and which are quietly fading?",
      options: [
        "Never thought about it",
        "I sense some fading but haven't named them",
        "I can name both lists",
        "I actively train the skills I refuse to let atrophy",
      ],
      essay: { num: "003", slug: "003-amplification", title: "Amplification" },
    },
    {
      key: "i3", axis: "intent", label: "The review habit",
      prompt: "When did you last change HOW you work with AI on purpose (not just try a new tool)?",
      options: [
        "Never, my usage just evolved on its own",
        "Once, when something went wrong",
        "Every few months I step back and adjust",
        "I treat the relationship itself as something I design and iterate",
      ],
      essay: null, // traces to the framework's design-intent axis, not a single essay
    },
    {
      key: "i4", axis: "intent", label: "The dependency check",
      prompt: "You notice you're reaching for AI on something you used to do alone. What do you do?",
      options: [
        "Nothing, that's just progress",
        "A flicker of unease, then I carry on",
        "I make a conscious call: is this a skill I'm willing to outsource?",
        "I have a standing answer for which skills are mine to keep",
      ],
      essay: { num: "005", slug: "005-the-partner-who-cannot-leave", title: "The Partner Who Cannot Leave" },
    },
  ],

  // Quadrants keyed by depth-pole + intent-pole. Names are placeholders (authors rename).
  // Essay pairs for symbiont + minimalist are fixed in the proposal; the other two are
  // draft recommendations for the review.
  quadrants: {
    "tooluse-drifting": {
      id: "occasional-user",
      name: "The Occasional User",
      tagline: "AI as utility, relationship unexamined",
      reading:
        "AI shows up in your work as a utility: it does tasks, and you stay you. There is real strength in an intact way of working. What hasn't happened yet is a decision — the relationship is shallow by default, not by design, and defaults have a way of deepening on their own.",
      essays: [
        { num: "001", slug: "001-you-are-not-using-ai", title: "You Are Not Using AI. You Are in a Relationship With It.", why: "the case for treating even light use as a relationship" },
        { num: "003", slug: "003-amplification", title: "Amplification", why: "what AI quietly amplifies once you let it in" },
      ],
    },
    "tooluse-designed": {
      id: "deliberate-minimalist",
      name: "The Deliberate Minimalist",
      tagline: "uses little, on purpose",
      reading:
        "You use less AI than most — and you could explain exactly why. The boundary is yours, drawn on purpose, and that makes it strong. The edge to watch: boundaries set once can quietly go stale while the tools keep moving.",
      essays: [
        { num: "004", slug: "004-what-the-terrace-knew", title: "Queryable vs Quotable", why: "what stays yours when AI can write in your voice" },
        { num: "006", slug: "006-down-the-memory-river", title: "Down the memory river with AI", why: "a builder's case for keeping the important memory human" },
      ],
    },
    "structural-drifting": {
      id: "unaware-symbiont",
      name: "The Unaware Symbiont",
      tagline: "deeply changed, hasn't chosen the changes",
      reading:
        "AI has genuinely changed how you think, decide, or remember — and most of that change arrived without a decision from you. That is not failure; it is what happens to early, deep adopters. The invitation is to look at what has already moved, and start choosing which changes get to stay.",
      essays: [
        { num: "001", slug: "001-you-are-not-using-ai", title: "You Are Not Using AI. You Are in a Relationship With It.", why: "naming the relationship you are already in" },
        { num: "005", slug: "005-the-partner-who-cannot-leave", title: "The Partner Who Cannot Leave", why: "what the asymmetry of this attachment really means" },
      ],
    },
    "structural-designed": {
      id: "relationship-designer",
      name: "The Relationship Designer",
      tagline: "deeply changed, by design",
      reading:
        "AI runs deep in how you work, and you are the one steering it. You've made the relationship itself something you design. The discipline that got you here is also the ongoing work: every new capability re-opens the question of what stays yours.",
      essays: [
        { num: "002", slug: "002-my-api-not-my-resume", title: "My API, Not My Resume", why: "the identity of the combined system, owned deliberately" },
        { num: "005", slug: "005-the-partner-who-cannot-leave", title: "The Partner Who Cannot Leave", why: "the asymmetry even a designed relationship sits on" },
      ],
    },
  },

  // Shown when an axis has no scored answers (reader wrote their own answer everywhere).
  unplotted: {
    name: "Off the grid — in your own words",
    reading:
      "You answered in your own words rather than ours — which is itself an answer: your relationship with AI doesn't fit four boxes, and you know it well enough to say so. Your reflections below are the result. They never left this page; copy them somewhere they can keep working on you.",
  },
};
