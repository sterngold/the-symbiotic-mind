# Buttondown — go-live runbook

A 10-minute path from zero to a working newsletter on symbiotic-mind.com, free under 100 subscribers and portable (you can export every subscriber to listmonk later with one CSV).

> **Prereq:** PR #1 (Eleventy migration) is merged. The signup forms already render on the homepage and below every post; they just point at a placeholder Buttondown username. This runbook flips the placeholder to live.

---

## Step 1 — Create the Buttondown account (3 min)

1. Sign up at [buttondown.com/signup](https://buttondown.com/signup).
2. **Newsletter username**: `symbioticmind` (matches the Eleventy default in `src/_data/site.js`). If `symbioticmind` is taken, pick the closest match and remember it — we'll wire it in Step 4.
3. **Newsletter name**: `The Symbiotic Mind`.
4. **Description**:
   > AI × HI — a discovery journey on human-AI symbiosis by Vlad Sterngold (Amsterdam) and Milena S. Nikolova, PhD (Lausanne). New writing every week. No spam. No SEO bait.
5. **From name**: `Vlad & Milena — The Symbiotic Mind`
6. **From email**: `hello@symbiotic-mind.com` (you'll verify it next).

## Step 2 — Verify the sending domain (3 min)

In Buttondown → **Settings → Domain**:

1. Add `symbiotic-mind.com`.
2. Buttondown shows you 3 DNS records (SPF, DKIM, return-path). Add them in Cloudflare DNS for `symbiotic-mind.com`.
3. Click **Verify**. Records typically resolve in under 2 min on Cloudflare.

**Why this matters:** without domain verification your emails ship from `*.buttondown.email` and land in Promotions. With it, they ship from `hello@symbiotic-mind.com` and look native.

## Step 3 — Turn on RSS-to-email (1 min)

Buttondown → **Settings → Automations → RSS-to-email**:

1. **Feed URL**: `https://symbiotic-mind.com/feed.xml`
2. **Check frequency**: Daily at 9:00 Europe/Berlin.
3. **Send mode**: One email per new item (not digest). Your cadence is ~weekly, not daily.
4. **Email template**: pick `Long-form` (full content rather than summary + link). The full `<content:encoded>` is in your RSS already, so subscribers get the whole post inline.
5. **Subject line template**: `{{ title }}`
6. **Preview text template**: `{{ description }}`

From now on, every PR that ships a new post = an email goes out the next 9:00 CEST automatically. You never log into Buttondown to send.

## Step 4 — Flip the site config (1 min)

In `src/_data/site.js`, update:

```js
newsletter: {
  provider: "buttondown",           // was "both" — switch to "buttondown" until listmonk is up
  buttondown: {
    username: "symbioticmind",       // or whatever you chose in Step 1
    embedUrl: "https://buttondown.com/api/emails/embed-subscribe/symbioticmind"
  },
  listmonk: { ... }                  // leave as-is; dormant until you self-host
}
```

Commit, open a PR, merge. The signup forms on homepage + every post now hit your real Buttondown endpoint.

## Step 5 — Add a homepage `#subscribe` anchor (2 min, optional)

For the YouTube descriptions, podcast show notes, and any LinkedIn link, having `https://symbiotic-mind.com/#subscribe` is friendlier than `/listen/` or `/about/`. The newsletter partial is already on the homepage — add `id="subscribe"` to the wrapper:

```diff
- <aside class="newsletter">
+ <aside class="newsletter" id="subscribe">
```

One-line edit in `src/_includes/partials/newsletter.njk`.

## Step 6 — First send (manual, the only time)

For your first newsletter, **don't rely on RSS-to-email** for the inaugural one — write it as a proper Buttondown draft so it can read like an introduction, not "Post #3 from the feed":

1. Buttondown → **New email**.
2. Subject: `Welcome to The Symbiotic Mind`
3. Body (markdown):
   > You signed up to read about how humans think and act differently in an AI world. We — Vlad in Amsterdam and Milena in Lausanne — wrote this together, from two angles.
   >
   > New essays every week. Long-form audio conversations starting later this season. Always full text in email, not preview-plus-clickbait.
   >
   > Start here:
   > - [You Are Not Using AI. You Are in a Relationship With It.](https://symbiotic-mind.com/posts/001-you-are-not-using-ai/) — Milena
   > - [My API, Not My Resume](https://symbiotic-mind.com/posts/002-my-api-not-my-resume/) — Vlad
   >
   > Reply to this email any time. We read every one.
4. Send to **All subscribers**.

Future emails ship automatically via RSS-to-email.

---

## When you hit 100 subscribers

You have two clean paths:

### Path A — Stay on Buttondown
Upgrade to the paid plan. Worth it if Buttondown's deliverability and zero-ops feel keep being worth more than your time. ~€9/mo.

### Path B — Migrate to self-hosted listmonk (free, sovereign)
1. Buttondown → **Settings → Subscribers → Export CSV**.
2. Stand up listmonk on Hetzner CX11 (~€4/mo) or alongside your existing Supabase / Cloudflare setup. The image is one `docker compose up`.
3. Import the CSV in listmonk.
4. Update `src/_data/site.js`:
   ```js
   newsletter: {
     provider: "listmonk",          // was "buttondown"
     listmonk: {
       formActionUrl: "https://lists.symbiotic-mind.com/subscription/form",
       listUuid: "..."
     }
   }
   ```
5. Open a PR, merge. The site instantly serves the listmonk form to new signups.
6. Cancel Buttondown after the next RSS-to-email run.

Migration is one CSV + one config diff because both forms exist behind the same partial. That portability is the whole point of the `provider: "both"` design.

---

## What the live config looks like

After Step 4, the relevant chunk of `src/_data/site.js`:

```js
newsletter: {
  provider: "buttondown",
  buttondown: {
    username: "symbioticmind",
    embedUrl: "https://buttondown.com/api/emails/embed-subscribe/symbioticmind"
  },
  listmonk: {
    formActionUrl: "",   // empty until you self-host
    listUuid: ""
  }
}
```

That's the entire live-newsletter change in code terms.
