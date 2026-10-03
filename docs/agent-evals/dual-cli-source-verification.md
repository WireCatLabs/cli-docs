# Dual CLI source verification, 2026-10-03

No release, publish, commit, push, merge, live login or account access was performed.

## Final rebuilt shared source, including lock fix

The final source is now rebased onto matching messaging **v0.134.0**, branch
`fix/agent-discovery-final`, worktree `/tmp/wirecat-messaging-discovery-final`.
Both CLI worktrees below now contain its **entire rebuilt `dist`**, including scoped discovery
and the SQLite busy-timeout fix. Their full suites, lint/typecheck/build/docs checks passed again.
The source pins remain unchanged. [Combined source patch](patches/messaging-discovery-final-0134.patch)
includes nine discovery regressions and two real-connection contention regressions.

Shared package checks passed: 1,344 tests, 2 skipped; coverage statements 92.9%, branches 81.95%,
functions 93.51%, lines 94.55%. Build and docs checks passed.
[Coverage/test log](runs/2026-10-03/messaging-final-source-coverage.log),
[manifest with compiled module and whole-dist hashes](patches/final-0134-manifest.json).

A fresh MAX agent exposed one transient `database is locked` while parallelizing local reads.
We preserved that trace and original database. Ordinary stress on independently seeded fixtures
had no failures across 64 published and 64 latest calls (eight concurrent), so this is not a
claim of probabilistically reproducing that exact scheduling race.

The concrete initialization defect is that `PRAGMA journal_mode = WAL` ran **before**
`PRAGMA busy_timeout = 5000`. A controlled second-process short exclusive lock made both
published messaging 0.131.0 and unpatched matching 0.134.0 fail immediately (about 4–5 ms).
After reordering the pragmas, the same 100 ms lock produced a successful open (about 109 ms).
The two-opener regression holds the lock for 25 ms; it demonstrably fails with original ordering
and passes with fixed ordering. [Negative-control log](runs/2026-10-03/store-concurrency-negative-control.log),
[isolated reproduction script](patches/store-open-lock-probe.mjs.txt),
[separate concurrency fix patch](patches/store-open-concurrency.patch).
No harness serialization was added. Final matched MAX stress: 64 more parallel reads, zero failures.

## Matching final integration

The final scoped discovery module was tested inside the complete installed shared package,
with freshly compiled provider CLIs and synthetic/isolated environments:

| CLI source | Source revision | CLI version | Shared messaging | Core | Full suite |
|---|---|---|---|---|---|
| tg | `0a90db1ad67dbd0df178c69016009abfdc149a41` | 0.24.0 | 0.134.0 + scoped discovery | 0.17.0 | 952 passed, 1 skipped |
| max | `2f2e37a23b117b5dd4619ecceb92134a8063ea31` | 0.24.0 | 0.134.0 + scoped discovery | 0.17.0 | 1305 passed, 2 skipped |

Worktrees: `/tmp/wirecat-tg-latest-verify`, `/tmp/wirecat-max-latest-verify`.
Installed dependencies came from each source lockfile (`pnpm install --frozen-lockfile --ignore-scripts`).
The pnpm package directory was renamed and **copied with independent file contents** before
replacing the scoped discovery JS/declaration. No pnpm hardlinks or shared store contents were edited.
No source package manifest/lockfile pins were changed to unpublished versions.

Module SHA-256: `5a32028540f7f5fef0b30907c6ca0d71492bc00b37c45d7e2a422b1e1663fe42`.
The compiled module was originally verified from `/tmp/wirecat-messaging-discovery`; the final
rebuilt distribution is now from `/tmp/wirecat-messaging-discovery-final`. Earlier module-only
integration preserved 0.134.0's unrelated features rather than installing the older full 0.133.0 distribution.

Both source CLIs passed `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm docs:check`, and `pnpm test`.
MAX's first test run had exactly one failure: generated `docs/commands.md` did not yet include
the new optional path. The generator itself regenerated that page; the full subsequent suite passed.
The final source patches preserve newer bot Markdown, audio model and native API skill guidance.

See [tg source tests](runs/2026-10-03/tg-source-final-tests.log),
[MAX source tests](runs/2026-10-03/max-source-final-tests.log),
[tg skill patch](patches/tg-latest-task-guidance.patch) and
[MAX skill/generated docs patch](patches/max-latest-task-guidance.patch).

## Recorded read choices on final matched source

Replayed 53 non-mutating command choices, including per-command help, from the three fresh MAX
round-three scenarios against newly seeded matching-source fixtures: all returned exit 0,
including the previously locked `store status`. Root discovery, skill and write/config commands
were excluded. This checks argument acceptance and execution;
it is not a new agent run or a byte-identical/semantic-answer assertion.
[Read replay report](runs/2026-10-03/max-latest-read-replay.json),
[reproduction script](patches/max-latest-read-replay.py.txt).

## Discovery contracts

Twelve real compiled CLI calls passed: each CLI's root JSON tree, messages group,
messages search leaf, unknown command path, multiple-group mistake and scoped-command help.
Assertions cover one JSON value, retained global options and exit codes, expected scope,
unknown/multiple-group exit 2 with actionable diagnostics on stderr and empty stdout,
and no ANSI on stdout. The launcher used empty scratch configuration/state/store directories
and the network-denying Node preload. Zero network primitive attempts were observed.
This preload is not an OS network namespace; it is not proof about arbitrary native subprocesses.

[Machine call report](runs/2026-10-03/dual-cli-source-discovery.json).
[Reproduction script](patches/dual-source-contract.py.txt) uses the worktree paths above.

## Rejected whole-package mix

We first tested the complete compiled messaging 0.133.0 worktree against published source tags:
tg `v0.23.0` (`cf0d994eb7c139c06047cf364ada98a83d8b67b2`, original messaging 0.129.0/core 0.16.0)
and max `v0.24.0` (`6464911ec2e3a68fc20d6684674b19059f471541`, original messaging 0.131.0/core 0.16.0).
Lint/typecheck/build/docs checks passed, but full suites did **not**: tg had five Markdown
send/edit failures (562 passes/1 skip), and MAX had five Markdown send/edit/MCP failures plus
one generated-doc drift (1282 passes/2 skips). Messaging 0.133.0's unrelated new formatter contract
requires newer provider integration. These tests were not changed to conceal the incompatibility.

That whole-package/version combination is **not approved as a release configuration**.
Keep the fresh-agent comparison's published baseline/module-only candidate distinction;
when preparing a future release, rebase the discovery source patch onto the then-current messaging
source and use matching provider/core packages. The matched latest-source configuration above
passes adapter tests, but does not prove real Telegram/MAX protocol behavior online.

## Limits

This is source/contract integration evidence, separate from fresh-agent scenario evaluation.
No live history download or successful send was tested. All account/message fixtures in agent
scenario runs are synthetic. Full test suites use their existing fake adapters and test stores.
