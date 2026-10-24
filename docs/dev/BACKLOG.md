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


- **DOCS-3 · P1 🟡 · max page lags npm.** Pinned max v0.66.0; npm has 0.71.0. Wait for
  v0.72.0, which must include BUG-378's attachment-download fix, then issue #335 for max. The newest releases
  dropped `messages list --mark-read`, still used in `max/usage*.md`. tg's scenario correction is merged in
  tg-cli #680; wait for a release containing it before bumping the tg pin from v0.83.0.
- **DOCS-4 · P1 🚩 · WhatsApp is missing from the site.** `wa` 0.6.0 is on npm, its docs include a roadmap
  at v0.6.0, and the other tools' `--help` already names it. Needs a `tools.json` entry,
  RU/ES translations, an install prompt in `lib/words.ts`, the landing and the global roadmap (which still
  says "In progress"). Waits on the owner: advertise WhatsApp at launch or not.


## Next (P2)

