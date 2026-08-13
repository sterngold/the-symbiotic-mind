# Newsletter — how it actually works

*Replaces `buttondown-activation.md`, deleted 2026-08-13. That file was a go-live runbook for
Buttondown written before the provider changed; every step in it was either already done, done
differently, or actively wrong — its Step 4 instructed you to set `provider: "buttondown"`, which
would have taken the live newsletter off Substack. Nothing linked to it.*

## The live state

**Substack**, and only Substack, since **2026-06-11**.

- Publication: <https://thesymbioticmind.substack.com>
- Account: Vlad's `@sterngold` Substack. The handle `symbioticmind` was already taken.
- On-site: rendered as an iframe embed by `src/_includes/partials/newsletter.njk`, which appears
  on the home page and at the foot of every post. The wrapper carries `id="subscribe"`, so
  `/#subscribe` works as an anchor.

Substack was chosen for the network effects — recommendations, Notes, restacks — over a
self-hosted or SaaS list with none.

## Where it is configured

One flag, in `src/_data/site.js`:

```js
newsletter: {
  provider: "substack",   // "substack" | "buttondown" | "listmonk" | "both"
  substack: {
    publicationUrl: "https://thesymbioticmind.substack.com",
    embedUrl:       "https://thesymbioticmind.substack.com/embed",
  },
  buttondown: { ... },    // dormant
  listmonk:   { ... },    // dormant, unconfigured
}
```

Changing the provider is that one string. `newsletter.njk` renders whichever provider it names;
`"both"` means Buttondown + listmonk, not Substack + anything.

## The dormant providers

- **Buttondown** — handle `sterngold`, **0 subscribers, nothing ever migrated or sent**. Config
  retained only so the flag can be flipped back. ⚠ Its API key lives in `~/.config/zsh/secrets.zsh`
  and is known to have passed through a session transcript; rotation was noted in 2026 and never
  done. Worth deciding on, since this repo is public (the key is not in the repo — but the
  posture should be deliberate).
- **listmonk** — retained for a future sovereign move. `formActionUrl` and `listUuid` are empty,
  so it cannot render until someone stands a server up.

## What is NOT automated

There is **no RSS-to-email automation**. Merging a post does not send anything. The old Buttondown
runbook claimed a post would go out automatically at 9:00 CEST the next morning — that was never
true here, and it is not true on Substack either unless it is configured in Substack's own
dashboard, which it currently is not.

`content/newsletter/000-welcome.md` is still `status: draft` and has never been sent.

## Substack rules that bind

From the series' own workflow, not from Substack:

- Never paste a full essay. Excerpt **≤150 words**.
- Use a **different title** from the site version.
- Always link back to `symbiotic-mind.com`.
- Share the **apex domain only** — never a `*.pages.dev` URL, which trips LinkedIn's link-safety
  scanner.
