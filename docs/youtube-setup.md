# YouTube channel + podcast setup

Free-only, brand-consistent setup for "The Symbiotic Mind". The same recording becomes a YouTube video and a podcast episode. You only do the work once.

---

## Part 1 — YouTube channel (one-time, ~30 min)

### 1.1 Create the channel
1. Sign in to YouTube with the account that should own the channel.
2. **Settings → Create a new channel** (or use a Brand Account so ownership can be transferred and you keep your personal account separate).
3. Channel name: **The Symbiotic Mind**
4. Once the channel exists, claim the handle: **@symbioticmind** at [youtube.com/handle](https://www.youtube.com/handle).
5. Once you cross 100 subscribers, you can claim the matching custom URL: `youtube.com/c/symbioticmind`.

### 1.2 Branding (use the assets in `/src/images/`)
- **Profile picture (PFP)**: 800×800 PNG — a clean wordmark or the AI × HI lockup.
- **Channel banner**: 2560×1440 PNG (safe area 1546×423 centered) with tagline: *"AI × HI is a relationship design problem."*
- **Video watermark**: 150×150 transparent PNG of the wordmark — set under Branding → Video watermark, "Entire video".

### 1.3 Channel details
- **Description**: paste this:

  > AI × HI — a discovery journey on human-AI symbiosis by Vlad Sterngold (AI practitioner, Amsterdam) and Milena S. Nikolova, PhD (behavioral scientist, Lausanne). We don't talk about using AI better. We design how humans think and act with it. Long-form conversations and field notes. Site: https://symbiotic-mind.com

- **Links** (show on banner):
  1. symbiotic-mind.com
  2. sterngold.ai
  3. behavior-smart.com
- **Country**: Netherlands (or whichever you prefer for tax/locale).
- **Keywords**: `AI, human-AI symbiosis, behavioral science, AI practitioner, relationship design, AI HI, AI agents`

### 1.4 Playlists (create empty, fill as you publish)
1. **Field Notes** — short 3–8 min essays-on-camera tied to a post on symbiotic-mind.com.
2. **Conversations** — long-form Vlad × Milena dialogues. These are also the podcast episodes.
3. **Built with AI** — Vlad's dev workflow: Claude Code, multi-model, Ollama.
4. **Research Reads** — walking through a paper or finding that changed our thinking.

### 1.5 Defaults (one-time configuration)
**YouTube Studio → Settings → Upload defaults**:
- **Visibility**: Private (so you never accidentally publish a draft).
- **Category**: Science & Technology.
- **Comments**: Hold potentially inappropriate comments for review.
- **License**: Standard YouTube License.
- **Description template**:
  ```
  {EPISODE TITLE}

  {ONE-PARAGRAPH SUMMARY — same as the podcast description.}

  ▸ Read the companion post: https://symbiotic-mind.com/posts/{slug}/
  ▸ Listen instead: https://symbiotic-mind.com/listen/
  ▸ Subscribe: https://symbiotic-mind.com/#subscribe

  Chapters:
  00:00 Cold open
  00:45 {chapter 2}
  …

  Hosts:
  Vlad Sterngold — https://sterngold.ai
  Milena S. Nikolova, PhD — https://behavior-smart.com

  #AIHI #SymbioticMind
  ```
- **Tags**: `AI, human-AI symbiosis, AI practitioner, behavioral science, Vlad Sterngold, Milena Nikolova`

### 1.6 Get the channel ID for the site
After publishing one video, copy your channel's **canonical URL** (Studio → Customization → Basic info). It looks like `https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxxxxxxx`. Paste the `UC…` ID into `src/watch.njk` (search `UCxxxxxxxxxxxxxxxxxxxxxx`). That enables the YouTube channel RSS link on `/watch/`.

### 1.7 Do NOT start with Shorts
The audience is exec/practitioner, not algorithm-grazing. Shorts dilute the brand at this stage. Add them later, only as trailers for full episodes.

---

## Part 2 — Recording workflow (free)

### 2.1 Recording
- **Vlad (Amsterdam) + Milena (Lausanne)** — both in their local environment. Use **Zoom** with both ends recording locally to disk for separate, clean tracks (Settings → Recording → enable *Record a separate audio file for each participant* and *Optimize for 3rd party video editor*). This avoids the Riverside.fm 2 hr/month free cap entirely.
- Backup: anyone recording on iPhone using Voice Memos at the same time. Costs nothing, saves you once.

### 2.2 Editing
- **DaVinci Resolve (free)** for video editing — runs natively on your M5 Max, supports multicam, proxies, the lot. Far above iMovie.
- **Audacity (free)** for audio cleanup — noise reduction, normalize, EQ.

### 2.3 Transcripts (free, local, on your M5 Max)
- **whisper.cpp** with `large-v3-turbo` runs in real-time-ish on your Mac. Transcript per episode in 5–10 min.
  ```bash
  brew install whisper-cpp
  whisper-cpp -m large-v3-turbo -f episode.wav -of episode --output-srt --output-txt
  ```
- Publish the transcript at `/episodes/<slug>/transcript/` — set `transcriptUrl` in `src/_data/podcast.js`. It surfaces in the podcast feed via `<podcast:transcript>` and is read by Pocket Casts, Overcast, Apple Podcasts.

---

## Part 3 — Audio hosting (free, no SaaS lock-in)

Pick one. All three are free, durable, and return direct file URLs that podcast apps accept.

| Host | Free tier | Pros | Cons |
|---|---|---|---|
| **Internet Archive** (archive.org) | Unlimited | Permanent, public-good, no per-month cap | Slower CDN |
| **Cloudflare R2** | 10 GB storage + 10 GB egress/month free | Already on your stack, fast, custom domain (`cdn.symbiotic-mind.com`) | You manage it |
| **GitHub Releases** | 2 GB per file | Zero new tools, versioned | 2 GB cap; not a CDN |

Recommended: **Internet Archive** for the canonical archive + **Cloudflare R2** for the live, fast-CDN copy. Cost stays at €0.

### Upload checklist (per episode)
1. Export episode audio as MP3 (128 kbps mono is fine for conversation; 192 kbps stereo if you want music).
2. Note the **exact byte length** (`stat -f %z episode.mp3` on Mac).
3. Upload to your chosen host. Copy the direct URL.
4. In `src/_data/podcast.js`, append a new entry to `episodes` with `audio.url`, `audio.lengthBytes`, `audio.mimeType`, `pubDate`, `duration` (hh:mm:ss), `title`, `slug`, `description`, optional `youtubeId` and `transcriptUrl`.
5. Open a PR. CI builds and deploys. The podcast RSS at `/podcast.xml` updates automatically.

---

## Part 4 — Distribution (free, one-time submission)

Once you have **one** episode live in `podcast.xml`:

1. **Validate the feed** at [podba.se/validate](https://podba.se/validate) and [castfeedvalidator.com](https://castfeedvalidator.com/). Both must pass.
2. **Apple Podcasts** — [Podcasts Connect](https://podcastsconnect.apple.com) → New Show → paste `https://symbiotic-mind.com/podcast.xml`. Review takes 1–3 days.
3. **Spotify** — [Spotify for Creators](https://creators.spotify.com) → Add show via RSS → paste the same URL. Live within hours.
4. After Apple approves, **Overcast, Pocket Casts, Pocket Casts Web, Castro, PodLink** all auto-discover from there. No separate submission.
5. **PodcastIndex** — submit at [podcastindex.org/add](https://podcastindex.org/add). Free, open, increasingly used by app makers.

Update the placeholder Apple/Spotify links in `src/listen.njk` (search `idTBD` / `TBD`) with the real ones once approved.

---

## Part 5 — Don't do this

- Don't host on Anchor/Spotify-for-Podcasters-only without the RSS escape route. Always own the feed via `/podcast.xml`.
- Don't pay for Buzzsprout/Transistor/Libsyn at this stage — you have free options that scale to thousands of listeners.
- Don't start a Substack newsletter spinoff. The newsletter lives on symbiotic-mind.com via the existing Buttondown/listmonk wiring. One feed of trust, not three.
- Don't enable Patreon, Buy Me a Coffee, or YouTube memberships until episode 12+. Build the catalog first.

---

## Part 6 — First three episodes (suggested)

Pick the three pieces you can record in May/June and that match a published post:

1. **"Are we in a relationship with AI?"** — Milena leads, walks through her post.
2. **"My API, not my resume"** — Vlad leads, walks through his post.
3. **"Cyborg, centaur, or self-automator — which one are you, today?"** — joint conversation, walks through the HBS finding.

Three episodes is the threshold where the Apple "New & Noteworthy" review actually looks at you. Two is below noise.

---

## Quick reference

| File | Edit when |
|---|---|
| `src/_data/podcast.js` | Adding/editing an episode, or updating show metadata |
| `src/watch.njk` | After channel exists — replace `UCxxxxxxxxxxxxxxxxxxxxxx` with real channel ID |
| `src/listen.njk` | After Apple/Spotify approval — replace `idTBD`/`TBD` with real show IDs |
| `src/images/podcast-cover.png` | Replace the placeholder with your real cover (3000×3000 PNG) |
