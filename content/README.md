# Content drafts

This folder holds *drafts* — not published content. Everything here is meant to be reviewed, edited, and then either copied into Substack
(newsletters — the live provider since 2026-06-11) or used as the recording brief (episodes).

## Article drafts

- [`posts/`](./posts/) — in-progress article drafts. **Nothing here is built or published.**
  When a draft's prose is final and reviewed, rename it `NNN-slug.md` and move it into
  `src/posts/` — that, and only that, publishes it (any `.md` in `src/posts/` auto-publishes; there is no draft flag).
  - `posts/relationship-design.md` — foundational "pillar" article skeleton. ⚠ The pillar itself
    **shipped 2026-07-16 as post 010**; this scaffold was never the published text.
  - `posts/004-what-the-terrace-knew.md` — a complete 2026-05-26 draft titled *"What the Terrace
    Knew"*, never published under that title. ⚠ The slug `004-what-the-terrace-knew` was reused by
    a different essay, live as *"Queryable vs Quotable"*. Keep the URL; do not "tidy" the slug.

## Newsletter

- [`newsletter/000-welcome.md`](./newsletter/000-welcome.md) — Inaugural welcome email, still
  `status: draft`; never sent. Send manually, once, via Substack. ⚠ The "after this, RSS-to-email
  handles everything" claim was a Buttondown assumption and is **unverified for Substack** —
  confirm before relying on it.

## First three podcast episodes

These are *recording briefs*, not scripts. They contain the structure, chapters, talking points, quotes worth catching, what to re-read before recording, show notes, YouTube descriptions, and production notes. Live conversation off these — don't read them.

- [`episodes/001-relationship-with-ai.md`](./episodes/001-relationship-with-ai.md) — Milena leads. Foundation episode. Companion to the *You Are Not Using AI* post.
- [`episodes/002-my-api-not-my-resume.md`](./episodes/002-my-api-not-my-resume.md) — Vlad leads. Companion to the *My API* post.
- [`episodes/003-cyborg-centaur-self-automator.md`](./episodes/003-cyborg-centaur-self-automator.md) — Joint. The episode that earns the Apple New & Noteworthy slot. Companion post co-written for it.

## Why drafts live in the repo

Single source of truth, versioned, reviewable by both authors via PR comments, and accessible from any of your devices without depending on a third-party note tool. When an episode ships, the brief stays in `content/episodes/` as the canonical record of intent vs. what aired — useful for the recurring "what did we learn" reviews you'll want to do at season's end.
