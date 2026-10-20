# tg 0.77.0, max 0.66.0, zoom 0.31.0, memo 0.81.0, drive 0.19.0

Reviewer: Claude (scenario quoting session), 20 October 2026. Portal base `e494e59`.

All five releases adopt cli-core 0.370.0 (cli-core#1675): `checkGuide` refuses a scenario step whose shell
characters (`>`, `<`, `|`, `&`, `;`, backtick, `$(`, globs) are left outside quotes, and memo's cross-tool scenario
titles come from one place, `MEMO_SCENARIOS`. The site found the bug this fixes: max 0.65.0's `catch-up` step
`max review date>1d --unanswered 4h` made a shell write a file named `1d` and drop the filter. Core 0.363.0–0.369.0
come along: store version 25 (a chat's history) and left chats found by any id.

## Sources

- Tags and npm: tg v0.77.0, max v0.66.0, zoom v0.31.0, drive v0.19.0, cli-memo v0.81.0 (`npm view` matches each).
- Change lists: `git diff <old tag> <new tag> -- docs scenarios CHANGELOG.md` per tool.

## Portal changes beside the ports

- `scripts/docs-corrections.json`: the max `scenarios` correction that quoted `date>1d` is retired; 0.66.0 ships
  the quoted step, and the RU/ES scenario translations carry it too.
- `tools.json`: drive's and memo's `guideRefs` overrides are retired; their commits (drive `c86e077`, memo `fb5b7da`)
  are in v0.19.0 and v0.81.0.

## Review inventory

| Page and locale | Reader task | Terms and opening | Behavior evidence | Links and exports | Result and owner |
| --- | --- | --- | --- | --- | --- |
| max: changelog (0.66.0), scenarios, en/es (scenarios ru/es); release links in bot, cli-contract, usage | Catch up after a day away | quoted `'date>1d'`; store version 25 | max v0.66.0 changelog and `scenarios/catch-up.md` | links pinned to v0.66.0 | Reviewed, Claude |
| tg: changelog, cli-contract (release links), ru/es | Read a left chat's history | store version 25; left chat by any id | tg v0.77.0 changelog | links pinned to v0.77.0 | Reviewed, Claude |
| zm: changelog, ru/es | — | shared store version 25 | zoom v0.31.0 changelog | — | Reviewed, Claude |
| drive: changelog (English, as the page says), commands (`--json=id,name`), ru/es | Keep only some fields with `--json` | `name`, not `title` | drive v0.19.0 `docs/commands.md` | — | Reviewed, Claude |
| memo: changelog 0.79.0–0.81.0 (English, as the page says), mcp, ru/es | Let an agent decide project findings | a changed text refuses only the findings citing it | cli-memo v0.81.0 `docs/mcp.md` | — | Reviewed, Claude |

## Remaining (owning repositories)

- None found in these releases.
