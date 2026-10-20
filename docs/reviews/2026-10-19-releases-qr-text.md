# tg 0.76.0, max 0.65.0, zoom 0.30.0, memo 0.78.0; drive 0.18.0 unchanged

Reviewer: Claude (release pins session), 19 October 2026. Portal base `b45c524`.

tg 0.76.0 and max 0.65.0 are on Core 0.362.0 / Base 0.47.0; zoom 0.30.0 on Core 0.348.0 / Base 0.47.0. drive stays
at v0.18.0 (newest on npm, with its `guideRefs` overrides); memo moves from v0.76.0 to v0.78.0, which reached npm
while this update was in progress (project actions, `--before-time`). All three releases
change how an agent runs the login: tg and max print the QR code as text for the agent to paste into the chat and
drop `--qr-file`; zoom prints its approval URL without a terminal and drops `--interactive`.

## Sources

- Tags and npm: tg v0.76.0, max v0.65.0, zoom v0.30.0, drive v0.18.0, cli-memo v0.78.0 (`npm view` matches each, rechecked 20 October).
- Change lists: `git diff <old tag> <new tag> -- docs CHANGELOG.md` per tool.
- drive's sign-in URL: `src/login.ts` at v0.18.0 calls `showUrl(url)` before it tries to open a browser, so the URL
  is always printed.

## Portal changes beside the ports

- `content/docs/agents*` (en/ru/es): new section "When the agent runs the login" (`#agent-login`): tg/max
  `session start qr` in the background, QR text pasted as a code block exactly as printed, renewed tg codes, MAX
  codes last about 2 minutes (rerun when expired), zoom's printed URL opened on the same computer, drive's always
  printed Google sign-in URL, what still needs a terminal, login not on MCP.
- `content/docs/installation*` (en/ru/es): the agent setup paragraph points to that section instead of sending the
  reader to the tool guide for QR codes.
- `translations/pages/tg/installation*` and `translations/pages/max/installation*` (the portal's own install
  pages, en/ru/es): "The agent cannot show me the terminal with the QR code" (`#q-agent-qr`) now describes the QR
  text flow instead of `tg personal setup --qr-file login.png`, which 0.76.0 rejects (`docs:check` reported it as an
  invalid example); max gains the same answer, the narrow-terminal step no longer promises a browser (removed in
  0.64.0), and the expired-code answer says a MAX code lasts about 2 minutes.
- `scripts/docs-corrections.json`: the memo `mcp` correction for the project-evidence footer is retired; 0.77.0
  ships the same wording.
- `scripts/docs-corrections.json`: the tg troubleshooting correction that quoted `--qr-file <png>` in a heading is
  retired; the heading is gone in 0.76.0.

## Review inventory

| Page and locale | Reader task | Terms and opening | Behavior evidence | Links and exports | Result and owner |
| --- | --- | --- | --- | --- | --- |
| zm: changelog, commands, installation, security, sessions, troubleshooting, ru/es | Log in to Zoom through an agent | printed approval URL, `--interactive` gone | zoom v0.30.0 pages and changelog | — | Reviewed, Claude |
| tg: changelog, cli-contract, commands, people, query-language, rankings, security, sessions, troubleshooting, usage, ru/es | Log in to Telegram through an agent | QR text pasted as a code block; `--qr-file` gone; snake_case people sample | tg v0.76.0 pages | troubleshooting heading renamed; cli-core links pinned to v0.350.0 | Reviewed, Claude |
| max: changelog (0.64.0–0.65.0), commands, security, sessions, en/es; commands ru; release links in bot, cli-contract, usage | Log in to MAX through an agent | one code per run, about 2 minutes; new "Login through an agent" section | max v0.65.0 pages | `#вход-через-агента` anchor kept | Reviewed, Claude |
| memo: changelog (0.77.0–0.78.0, English as the page says), commands, mcp, search, ru/es | Let an agent propose and decide project findings | `projects actions`, `agent_decisions`, `--before-time` | cli-memo v0.78.0 pages | — | Reviewed, Claude |
| tg and max install pages (portal-owned), en/ru/es | Log in with or without the agent | QR text pasted by the agent; MAX code lifetime | tg v0.76.0 and max v0.65.0 sessions pages | `#q-agent-qr` added | Reviewed, Claude |
| agents, installation, en/ru/es | Let the agent run the login | QR text, sign-in URL, what still needs a terminal | the three tool releases and drive v0.18.0 source | `#agent-login` | Reviewed, Claude |

## Remaining (owning repositories)

- None found in these releases. Last review's tg (`--qr-file` heading, camelCase people sample, `blob/main` links),
  max ("four things") and zoom (security wording, uninstall folders) discrepancies are fixed in the released pages.
