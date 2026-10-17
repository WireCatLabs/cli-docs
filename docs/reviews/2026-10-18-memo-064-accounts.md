# Memo 0.64 account names, sender scores and mail mentions

Reviewer: Claude (memo --source), 18 October 2026. Portal base `6e31928`.

Readers name the accounts a Memo command reads with `--source` (`telegram:1`, a provider, a kind or `group:<name>`)
and the one account a write acts as with `--account provider:account`. The mail guide covers the reweighted sender
signals, mail from senders with signs of fraud placed after the rest of a page, and phones and links in mail
(`memo mentions`).

## Sources and scope

- Memo 0.64.0, tag `v0.64.0`, npm contract captured by `pnpm docs:contracts` with network disabled. Release delta
  from the reviewed 0.58.0: 0.59.0 (Reply-To and Gmail verdicts backfilled), 0.60.0 (timer interval, MCP argument
  refusal, `memo mentions --source`), 0.62.0 (cli-core 0.323.0), 0.63.0 (sender signal weights, daily domain ages),
  0.64.0 (cli-memo#284 and #285: `--source` for reads, `--account provider:account` for writes; cli-memo#286: fraud
  signals lower a mail hit, `--plain-order`). There is no 0.61.0 entry in the source changelog.
- Behaviour evidence: cli-memo#284 and #285 tests (`src/store/source-list.test.ts`: reads across accounts with
  `meta.accounts`, a write refused without one `provider:account`, the old `--provider --account` with its stderr
  hint), 463 tests, command lint 0 new.
- Memo has no public roadmap; `docs:release-notes` passes.

## Corrections

- `memo/commands` (en; ru and es bodies): the generated opening still named `--provider` and `--account`, and the
  reference lacked `--plain-order` on `search all` and `search mail`, which 0.64.0 ships. Fixed upstream in
  cli-memo#291; the corrections go when the pin includes it. The ru and es openings are translated from the corrected
  text.
- `email` (shared page, en/ru/es): its Memo examples move to `--source` / `--account`.

## Review inventory

| Page and locale | Reader task | Terms and opening | Behavior evidence | Links and exports | Result and owner |
| --- | --- | --- | --- | --- | --- |
| memo/usage, en/ru/es | Name the account to read or act as | Reads `--source`, writes `--account`, old spelling one release | #284/#285 tests | Anchors unchanged | Reviewed, Claude |
| memo/tasks, en/ru/es | Add, plan and remind in one account | Reads `--source`, writes `--account` | #285 tests | Anchors unchanged | Reviewed, Claude |
| memo/tags, en/ru/es | Label a chat, contact or meeting | `--account` for an account's things | #285 tests | Anchors unchanged | Reviewed, Claude |
| memo/people, en/ru/es | Read one person's context | `context --source` | #284 tests | Anchors unchanged | Reviewed, Claude |
| memo/memories, en/ru/es | Stage and review meeting findings | Writes `--account`, lists `--source` | #285 tests | Anchors unchanged | Reviewed, Claude |
| memo/search, en/ru/es | Search mailboxes and ask | `--source` lists | #284 tests | Anchors unchanged | Reviewed, Claude |
| memo/mail, en/ru/es | Sync mailboxes, read sender signals, find phones and links | Weights and fraud placement as in 0.63/0.64 | Changelog 0.63.0/0.64.0 | New section anchor | Reviewed, Claude |
| memo/configuration, en/ru/es | Name a mail account | `sync --source email:<name>` | #284 | Unchanged | Reviewed, Claude |
| memo/troubleshooting, en/ru/es | Fix "give --account" / "give --source" | New heading; old anchor unused in the portal | #285 | Old anchor dropped | Reviewed, Claude |
| memo/commands, en/ru/es | Exact released syntax | Opening corrected; bodies English | npm 0.64.0 contract | 0 reference gaps | Reviewed, Claude |
| memo/changelog, en/ru/es | Release delta | English entries, translated opening | Source changelog | Unchanged | Reviewed, Claude |
| email, en/ru/es | Use Memo with mail | Examples on `--source` / `--account` | 0.64.0 contract | Unchanged | Reviewed, Claude |

## Validation

- `pnpm sync`, `docs:contracts`, `docs:release-notes`, `docs:check` (1,384 reference entries, 0 gaps, 0 invalid
  examples; the 144 manual-review examples are the existing category), `test`, `lint`, `typecheck`, `search:check`:
  all pass.
- No live account, mailbox or owner store was used.
