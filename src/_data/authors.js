// Author profiles. Keyed by slug. Referenced in post frontmatter as `author: vlad` etc.
// `sameAs` is used by Person schema for entity disambiguation — fill these in as
// each author confirms their preferred public links. Placeholder URLs commented out.
export default {
  vlad: {
    slug: "vlad",
    name: "Vlad Sterngold",
    honorific: null,
    email: "vlad@sterngold.nl",
    role: "AI practitioner and builder",
    location: "Amsterdam",
    bio: "AI practitioner and builder based in Amsterdam. Daily user of AI systems, builder of AI products, and writer on human-AI symbiosis.",
    // Canonical bio lives on sterngold.nl (personal authority engine).
    url: "https://sterngold.nl/",
    personId: "https://sterngold.nl/#person",
    sameAs: [
      "https://www.linkedin.com/in/sterngold/",
      "https://medium.com/@Sterngold",
      "https://vladsterngold.substack.com/",
      "https://github.com/sterngold",
      "https://sterngold.ai/",
      "https://werkanders.com/",
      "https://symbiotic-mind.com/",
      "https://andersreality.com/",
    ],
  },
  milena: {
    slug: "milena",
    name: "Milena S. Nikolova, PhD",
    honorific: "PhD",
    email: "milena@behaviorsmart.com",
    role: "Behavioral scientist, founder of BehaviorSMART",
    location: "Lausanne",
    bio: "PhD behavioral scientist and founder of BehaviorSMART. Works with organizations across four continents on how humans actually change — what AI does and doesn't change about that, and how to design for the difference.",
    url: "https://behavior-smart.com",
    personId: "https://behavior-smart.com/#person",
    sameAs: [
      "https://behavior-smart.com",
      "https://behavior-smart.com/milena-nikolova/",
      "https://www.linkedin.com/in/milena1827/",
      "https://orcid.org/0000-0002-3992-9138",
      // ResearchGate: add when a real URL is provided.
    ],
  },
};
