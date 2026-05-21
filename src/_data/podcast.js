// Podcast feed config + episodes. All free-tier compatible.
//
// Episode hosting: any URL that returns the audio file (MP3 recommended).
// Recommended free hosts:
//   - Internet Archive (archive.org) — free, permanent, direct URLs
//   - Cloudflare R2 with public access — free up to 10 GB egress/mo (your stack)
//   - GitHub Releases — free, direct URLs for files up to 2 GB
//
// To submit the feed once it has 1+ episodes:
//   Apple Podcasts: https://podcastsconnect.apple.com
//   Spotify:       https://podcasters.spotify.com
//   Pocket Casts/Overcast/etc auto-discover from Apple/Spotify.
//
// Add a new episode by appending to `episodes` below. The feed regenerates on next build.
export default {
  show: {
    title: "The Symbiotic Mind — Conversations",
    subtitle: "AI × HI is a relationship design problem.",
    description:
      "Long-form conversations on human-AI symbiosis between Vlad Sterngold (AI practitioner, Amsterdam) and Milena S. Nikolova, PhD (behavioral scientist, Lausanne). The audio companion to symbiotic-mind.com.",
    language: "en",
    category: "Technology",
    subcategory: "Tech News",
    explicit: "false",
    type: "episodic",
    copyright: "© 2026 Vlad Sterngold & Milena Nikolova",
    author: "Vlad Sterngold & Milena Nikolova",
    ownerName: "Vlad Sterngold",
    ownerEmail: "vlad@sterngold.nl",
    image: "/images/podcast-cover.png", // 3000×3000 PNG required by Apple
    youtubeChannelUrl: "https://www.youtube.com/@symbiotic-mind",
    youtubeChannelId: "UCXPq0wU1juoFnJl2ixImCsQ",
  },
  // Add episodes here. Empty array is fine — the feed still validates.
  episodes: [
    // Example template — uncomment and fill in when you publish your first one:
    // {
    //   number: 1,
    //   season: 1,
    //   title: "Episode title",
    //   slug: "001-episode-slug",
    //   description: "One paragraph summary. Plain text or simple HTML.",
    //   pubDate: "2026-06-01T09:00:00+02:00",
    //   duration: "00:42:13",                    // hh:mm:ss
    //   audio: {
    //     url: "https://archive.org/download/sm-ep001/sm-ep001.mp3",
    //     mimeType: "audio/mpeg",
    //     lengthBytes: 50331648                  // exact file size in bytes
    //   },
    //   youtubeId: "abcDEF123",                   // optional, for /watch embed
    //   transcriptUrl: "/episodes/001/transcript/", // optional
    //   image: "/images/ep-001.png"               // optional, falls back to show image
    // }
  ],
};
