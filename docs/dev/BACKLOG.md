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


- **DOCS-3 · P1 · The other tools' pages lag npm.** Pinned max v0.66.0 / tg v0.77.0; npm has
  0.69.0 / 0.81.0 (drive v0.23.0 and memo v0.89.0 are current). Work through issue #335 per tool:
  translations, `docs:contracts`, release notes.
- **DOCS-4 · P1 🚩 · WhatsApp is missing from the site.** `wa` 0.4.0 is on npm, its docs pass the
  structure check at v0.4.0, and the other tools' `--help` already names it. Needs a `tools.json` entry,
  RU/ES translations, an install prompt in `lib/words.ts`, the landing and the global roadmap (which still
  says "In progress"). Waits on the owner: advertise WhatsApp at launch or not.


## Next (P2)

- **DOCS-6 · P2 · A roadmap page for every tool, and the global page linking them all.** drive and memo
  have none (no `docs/roadmap.md` in their repositories); a new page also needs RU/ES translations or
  `pnpm sync` fails. The global page links Telegram, MAX and Zoom; drive and memo wait on their repositories. Details: [BACKLOG-NOTES.md](BACKLOG-NOTES.md#docs-6).
- **DOCS-8 · P2 · Check every command on the site against the newest npm release, not only the pinned
  one.** The zm drift (DOCS-2) passed every check, because the pages match their own pin. Add a
  profile-aware command check to the daily `docs-updates` report. Start: `scripts/docs-updates.ts`.
