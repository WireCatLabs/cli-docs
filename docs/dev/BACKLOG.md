# Backlog

Open work for the wirecat.dev site, P1 and P2 only, most important first. P3 and ideas are in
[BACKLOG_LATER.md](BACKLOG_LATER.md). How the site is laid out: [DESIGN.md](../DESIGN.md); which pages
this repository owns: [STRUCTURE.md](../STRUCTURE.md).

## Rules

- **An id is permanent** and never reused: `DOCS-n`, the next free number in this file and in
  BACKLOG_LATER.md. Older ids (`IDEA-107` and so on) keep their names.
- **One item:** id · priority · title, then where the work starts and a link to the details. 1–3 lines.
- **Priority:** **P1** broken, wrong for a reader, or blocks publishing — done before the site is
  advertised · **P2** this cycle · **P3** someday, in BACKLOG_LATER.md.
- **Mark:** none — not started · 🚧 `<branch>` — taken · 🟡 — half done, the rest named · ⏸️ — deferred
  by the owner · 🚩 — waits on an owner decision.
- **Claim before code:** `🚧 <branch>` on the line in the first push of the branch.
- **Close in the PR that ships the work:** delete the line here in that PR.

## Launch blockers (P1)


- **DOCS-3 · P1 🟡 · max page lags npm.** Pinned max v0.66.0; npm has 0.70.0 (drive v0.25.0, memo v0.89.0 and tg v0.83.0
  are current). Waits for the max release of the launch fix round, then issue #335 for max. The newest releases
  dropped `messages list --mark-read`, still used in `max/usage*.md`. tg's `scenarios` page still says
  `review --mark-read` because tg-cli's `scenarios/catch-up.md` at v0.83.0 does (fix upstream).
- **DOCS-4 · P1 🚩 · WhatsApp is missing from the site.** `wa` 0.4.0 is on npm, its docs pass the
  structure check at v0.4.0, and the other tools' `--help` already names it. Needs a `tools.json` entry,
  RU/ES translations, an install prompt in `lib/words.ts`, the landing and the global roadmap (which still
  says "In progress"). Waits on the owner: advertise WhatsApp at launch or not.


## Next (P2)

- **DOCS-6 · P2 · memo has no roadmap page.** tg, max, zm and drive (v0.25.0) have one, and the global page
  links all four. memo has no `docs/roadmap.md` in its repository; a new page also needs RU/ES translations or
  `pnpm sync` fails. Details: [BACKLOG-NOTES.md](BACKLOG-NOTES.md#docs-6).
- **DOCS-14 · P2 · `pnpm docs:report-fixture` fails with `store.saveChats is not a function`.** The fixture
  calls the store API cli-core moved to `store.chats` / `store.messages`; it fails on main too. Start:
  `scripts/docs-report-fixture.mjs`.
