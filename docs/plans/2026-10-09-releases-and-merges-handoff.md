# Handoff — finish the max and tg releases, then the site merges (2026-10-09)

The trail, optional: [the session journal](../journal/2026-10-09-pr88-merge-and-landing-deploy.md).

## 1. What this is

Three repositories ship one change set: cli-messaging 0.213.0 is released (auto-replies answer the
audience, everyone by default); tg-cli and max-cli have it merged together with rewritten user
guides (tg #401 #402 #403, max #523 #524 #526). What is left: release max 0.41.0 and tg 0.42.0, then
merge the site PRs (cli-docs #88, #92) and start the site's translation pass. Each repository's
`CLAUDE.md` is the authority on its release; this file only orders the steps.

## 2. Orient in one call

```sh
{ echo "## max smoke (run from the max release worktree)"; tail -25 /home/leemour/Projects/AI/max-smoke.log
  echo "## PRs"; gh pr view 527 --repo WireCatLabs/max-cli --json state,mergeable --jq '"max #527 \(.state) \(.mergeable)"'
  gh pr view 88 --repo WireCatLabs/cli-docs --json state,isDraft,mergeable --jq '"site #88 \(.state) draft=\(.isDraft) \(.mergeable)"'
  gh pr view 92 --repo WireCatLabs/cli-docs --json state,baseRefName --jq '"site #92 \(.state) base=\(.baseRefName)"'
  echo "## npm"; for p in cli-messaging tg-cli max-cli; do echo "$p $(npm view @wirecat/$p version --prefer-online)"; done
  echo "## last releases (2-hour gap per tool)"; gh release list --repo WireCatLabs/tg-cli --limit 1; gh release list --repo WireCatLabs/max-cli --limit 1; date -u +%FT%TZ
  echo "## worktrees"; git -C /home/leemour/Projects/AI/max-cli worktree list | grep release; git -C /home/leemour/Projects/AI/tg-cli worktree list | grep release
  echo "## last max report (shape to copy)"; cat /home/leemour/Projects/AI/max-cli/docs_ai/releases/0.40.0.md
  echo "## tg release skill, live step"; git -C /home/leemour/Projects/AI/tg-cli show origin/main:docs/dev/skills/release/SKILL.md | sed -n '/^## 5. Live/,/^## 6/p'
} > ~/.cache/releases-orient.txt 2>&1
```

Then read `~/.cache/releases-orient.txt`: the max smoke result, PR states, what npm has, whether the
two-hour gap has passed, both release worktrees, the report format, and tg's live rule.

## 3. Read in this order (only if the orient output is not enough)

1. `/home/leemour/Projects/AI/max-cli/docs_ai/releasing.md` — how `bin/release` uses the signed report.
2. `/home/leemour/Projects/AI/tg-cli/docs/dev/skills/release/SKILL.md` — tg releases without sign-off; only the live smoke needs the owner's yes.
3. [the translation handoff](2026-10-09-tool-guides-translation-handoff.md) — the site work after both releases.
4. cli-messaging `docs/dev/combined-search-handoff.md` — the next feature, independent of all this.

## 4. Do

1. **max 0.41.0.** Worktree `/home/leemour/Projects/AI/max-cli-wt-release-041`, branch
   `chore/release-0.41.0`, PR #527 (version and dated changelog; `release:check` 14/14 ok).
   - Read the smoke result in `/home/leemour/Projects/AI/max-smoke.log`. Every line `ok` (a known
     `SKIP` is fine) → continue. Any `FAIL` → stop and tell the owner; it stops the release.
   - Merge #527 (`gh pr merge 527 --repo WireCatLabs/max-cli --squash`).
   - Write `docs_ai/releases/0.41.0.md` in the max **main checkout** (`docs_ai/` is the private repo
     `WireCatLabs/cli-private`): `Commit:` = the full sha of max `main` after the merge, `Previous: v0.40.0`,
     the gate table like 0.40.0's (release:check 14 ok; changelog accepted; docs: guides rewritten in
     #524; requirements: replies send path changed in #523 — read it against `CLAUDE.md` constraints 1, 4, 6;
     live: the smoke lines). Sign-off line, already granted: `Signed off: 2026-10-09 — owner (release
     approved: "Accept and sign off")`. Commit and push it in `docs_ai` as its own repository does.
   - From a clean checkout of max `main` run `bin/release`. Check: `npm view @wirecat/max-cli version --prefer-online` prints 0.41.0.
2. **tg 0.42.0** — not before two hours after the last tg release (orient shows the time).
   Worktree `/home/leemour/Projects/AI/tg-cli-wt-release-042`, branch `chore/release-0.42.0`, nothing
   changed yet. Follow tg's release skill: version 0.42.0 in `package.json`, `pnpm version:sync`,
   `## Unreleased` → `## 0.42.0 — DD.MM.YYYY`, `pnpm release:check`, PR, merge.
   - **Live smoke:** the owner said yes to `pnpm smoke:live` for tg, but that yes is per session.
     Ask again in one line ("run tg smoke:live — Saved Messages only, deleted after?") before running.
     The release changes a write path (auto-replies), so it waits for the run.
   - Then `bin/release` from a clean `main`. Check: npm shows 0.42.0.
3. **Site.** cli-docs #88 is a draft by the owner's choice («wait and first apply fixes we find
   here»): ask whether to mark it ready and merge. After #88 merges, retarget #92 to `main`
   (`gh pr edit 92 --repo WireCatLabs/cli-docs --base main`), let CI pass, merge.
4. **Translation pass.** Only after both releases and #92: follow the translation handoff. It is
   large and needs little context — a fresh session, or parallel agents per tool and language.

Decisions yours: the merge method is squash in all three repositories (their history shows it);
if `bin/release` renumbers because a parallel session took the version, follow what it prints.

## 5. What bites

1. **`bin/release` commits to `main` when the tree is dirty** (`git commit -am`). The main checkouts
   of cli-messaging, tg-cli and max-cli carry an unrelated uncommitted `CLEANUP.md`; release from a
   fresh clone or a clean checkout of `main`, never from those. cli-messaging 0.213.0 was released
   from a fresh clone for this reason.
2. **Never `node dist/bin/<cli>.js` for live work** — only `bin/tg` / `bin/max` in a worktree; the
   bare build opens the owner's real store.
3. **The max report must name `HEAD` of `main` exactly**; any merge after writing it means rewriting
   `Commit:`.
4. A local preview server of the site may still run on port 4500 (PID in
   `/var/tmp/claude/claude-1000/-home-leemour-Projects-AI-cli-docs/73a74b46-51e4-4728-8e10-0613e894db20/scratchpad/preview.pid`);
   stop it by that PID only, never by name.

## 6. Do not touch

- cli-messaging search code — the combined-search handoff owns it.
- `content/docs/tg/**`, `content/docs/max/**` in cli-docs — generated by `pnpm sync`.
- Other sessions' worktrees (`git worktree list` shows many); only the two release worktrees above are this work's.

## 7. Check

```sh
for p in cli-messaging tg-cli max-cli; do echo "$p $(npm view @wirecat/$p version --prefer-online)"; done   # 0.213.0 / 0.42.0 / 0.41.0
gh pr view 92 --repo WireCatLabs/cli-docs --json state --jq .state                                            # MERGED
```

Cleanup items from this work are listed in `/home/leemour/Projects/AI/cli-docs/CLEANUP.md`; present
them to the owner once, at the end, and remove only after a yes.
