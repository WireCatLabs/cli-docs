# Handoff — translate the rewritten tg and max guides for the site (2026-10-09)

The trail, optional: [the session journal](../journal/2026-10-09-pr88-merge-and-landing-deploy.md), grep `TASK-6`.

## 1. What this is

The site (wirecat.dev, this repository) imports each messenger tool's own guides and shows them in
English, Russian and Spanish ([README](../../README.md), [HANDOFF.md §3](../../HANDOFF.md)). Every
user page in tg-cli and max-cli was rewritten to the docs standard (tg-cli #401 compare page, #402
replies, #403 every guide; max-cli #523 replies, #524 every guide, #526 MCP config). Once those ship
in a tg and a max release, the site must move to the new releases: almost every tool page's source
changes, so its translations (tg: ru and es; max: en and es) must be updated and reviewed. This is
large, repetitive and needs little context beyond the rules below.

## 2. Orient in one call

```sh
{ echo "## releases"; gh release list --repo leemour/tg-cli --limit 3; gh release list --repo leemour/max-cli --limit 3
  echo "## pinned now"; grep -n '"docsRef"' tools.json
  echo "## did the rewrite ship? (each must show MERGED and be older than the release)"
  for p in 401 402 403; do gh pr view $p --repo leemour/tg-cli --json number,state,mergedAt --jq '"tg #\(.number) \(.state) \(.mergedAt)"'; done
  for p in 523 524 526; do gh pr view $p --repo leemour/max-cli --json number,state,mergedAt --jq '"max #\(.number) \(.state) \(.mergedAt)"'; done
  echo "## translation rules"; sed -n '58,75p' HANDOFF.md
  echo "## helper"; sed -n '1,5p' scripts/translation.ts
  echo "## slug references to the removed page"; grep -n "from-tgcli" lib/seo-copy.json lib/guide-orientation.ts lib/docs-sidebar-tree.tsx scripts/docs-corrections.json | cut -c1-100
  echo "## redirects"; cat public/_redirects
} > ~/.cache/translation-orient.txt 2>&1
```

Then read `~/.cache/translation-orient.txt`. It shows: the latest releases and the version the site
pins; whether all six PRs shipped; how translations are reviewed and fingerprinted; the helper's
usage; every place that still names `from-tgcli`; the redirect file format.

## 3. Read in this order (only if the orient output is not enough)

1. `docs/AUTHORING.md` "Mandatory opening order" and "Publish facts, not editorial history" — the
   rules the rewritten source follows; translations keep them.
2. `scripts/localize.ts:104-128` (`translationProblems`) — exactly what the structure check compares:
   headings, code blocks, inline code, link destinations.
3. One finished pair, to copy tone and terms: `content/upstream/tg/sessions.md` beside
   `translations/tg/sessions.ru.md` (after `pnpm sync --capture-only`).

## 4. Do

0. **Branch** off `origin/main` in a worktree. Wait until both tools have a release that contains all
   six PRs (orient output); otherwise stop and say which is missing.
1. **Pin the releases.** `tools.json` `docsRef` → the new tg and max tags. Then
   `pnpm sync --capture-only` writes the new source to `content/upstream/` (ignored by git). Keep a
   copy of the old source first (`cp -r content/upstream /var/tmp/old-upstream` before the capture)
   so you can `diff` old vs new per page.
2. **List the work.** `pnpm sync` — it stops with "source changed; translation needs review" and
   structure errors per `<tool>/<slug>.<lang>`. Expect most pages in tg ru/es and max en/es.
3. **Translate page by page.** For each listed page: diff old vs new source, carry every change into
   `translations/<tool>/<slug>.<lang>.md`, keep code, inline code, link destinations and heading
   structure identical to the source; translate prose and headings as the existing pages do. Then
   `pnpm docs:translation check <tool>/<slug>.<lang>` → "structure ok", and only after reading the
   whole changed prose, `pnpm docs:translation accept <tool>/<slug>.<lang>`. Parallel agents: one per
   tool and language, each owning its files; `accept` rewrites `translations/sources.json`, so run it
   one at a time or serially at the end.
4. **Fix the corrections.** `pnpm docs:translation corrections <tool>/<slug>.<lang>` for every page.
   An entry in `scripts/docs-corrections.json` whose "before" text no longer matches is either
   obsolete (the rewrite fixed it in the source — delete the entry) or must be re-anchored on the new
   text. Expected obsolete: tg `changelog` PDF sentence and `groups`/`from-tgcli` `topics search`
   rows, tg/max `security`, `configuration`, `diagnostics` openings. Decision yours per entry: delete
   when the source now says the right thing; keep and re-anchor only for a fact still wrong upstream.
5. **`from-tgcli` → `compare`.** tg-cli #401 replaced the page. Add `/<lang>/docs/tg/from-tgcli
   /<lang>/docs/tg/compare 301` lines (en, ru, es) to `public/_redirects`; move the slug in
   `lib/docs-sidebar-tree.tsx` (icon), `lib/seo-copy.json` (all three languages, a description of a
   comparison, not a migration), `lib/guide-orientation.ts`; delete `translations/tg/from-tgcli.*` and
   their `sources.json` keys; translate `compare` (ru, es) as in step 3.
6. **Command reference split.** `lib/command-groups.ts` splits `commands` into personal/bot/admin
   pages; renamed headings must keep old anchors (see the `<a id>` corrections in
   `scripts/docs-corrections.json` for the search commands). Check old `commands#…` links still land.

## 5. What bites

1. **`pnpm sync` stops at the first tool that fails**, so the second tool is not processed. Use
   `pnpm sync --tool tg` / `--tool max` to work on one at a time.
2. **max's source language is Russian**: its translations are `en` and `es`, plus a fully Russian
   `translations/max/commands.ru.md` (the generated reference has English option rows; this file
   translates them). tg's source is English; translations are `ru` and `es`.
3. **The fingerprint ignores version numbers only in GitHub links of the form `/vX.Y.Z/`**
   (`scripts/localize.ts:29-34`); a link that changed from a commit hash to a tag still changes it.
4. **A correction that does not match fails the whole sync** (`scripts/localize.ts:22`); fix
   corrections before expecting a clean sync.
5. **Images from raw.githubusercontent.com are fetched at build time**; a network timeout fails
   `next build` with "Failed obtain image size". Retry; it is not your change.
6. **No version numbers in prose** (owner's rule). Links to a source at a tag are fine.

## 6. Do not touch

- `content/docs/*.md(x)` shared pages and `lib/` beyond the slug moves in step 5 — reviewed separately.
- `content/docs/tg/**`, `content/docs/max/**` — generated by `pnpm sync`; never edit by hand.
- The tools' own repositories — a wrong fact in the source goes to a correction here or a PR there.

## 7. Check

```sh
pnpm lint && pnpm search:check && pnpm sync && pnpm docs:release-notes && pnpm test && pnpm docs:contracts && pnpm docs:check && pnpm typecheck && pnpm exec next build && pnpm check:links && pnpm check:seo
```

`pnpm docs:release-notes` needs a roadmap review per new release in `docs/release-notes-review.json`
(fingerprint the new roadmap, one-line conclusion). Browser tests run in CI; locally they are slow
and not required.
