# WireCat package links and Request styling

Reader: someone installing Memo or following a copied installation request. The package named
in displayed text, copied requests, npm links and Markdown must be the published WireCat package.
Request blocks should share the command background in light and dark themes.

Portal base: `2e31e3c`. Memo is registry-confirmed as `@wirecat/cli-memo` 0.6.0;
the old scope resolves to an older release. This change updates package identity only, preserving
the reviewed commands, guide scope, routes and anchors. No live mailbox/account was used.

| Page and locale | Reader task | Review and evidence | Result |
| --- | --- | --- | --- |
| memo, en | Install Memo and copy the request | Changed installation paragraphs and surrounding guide read; current npm package verified | Scope fixed in request, Unix and PowerShell commands |
| memo, ru | Same task | Same capability and command boundaries; full changed section read | Same corrections |
| memo, es | Same task | Same capability and command boundaries; full changed section read | Same corrections |
| Shared installation/landing | Install Telegram or MAX | Current tools.json uses WireCat; fallback, displayed snippets, copy attributes and npm destinations audited | Old scope removed from current UI sources |
| Request blocks | Read/copy an agent request | Shared command background token; Request header remains readable with a transparent background | Same surface color in both themes; identity labels remain |

The current-guide check now rejects the retired package scope, including encoded npm links,
while changelogs and roadmap history retain real release identities. Unit fixtures that represent
current packages were updated; legacy install/analytics compatibility tests remain intentional.

## Repository audit

Inspected current default branches of all 13 WireCatLabs repositories: cli-core, cli-messaging,
cli-meetings, cli-tasks, cli-memo, cli-testing, tg-cli, max-cli, zoom-cli, cli-docs, cli-private,
community and .github. Source reads used a tracked text-file allowlist, excluding private state,
credentials and protected files. Exact bases and matching-line inventory remain in the local
`.docs-tooling/wirecat-namespace-audit.json` (private findings are not published here).

Current developer links and Dependabot scope filters also needed correction in meetings/testing;
the schema metadata named cli-tasks under its retired scope. The migration helper omitted meetings,
testing, Zoom and shared organization repositories. Private current package/release guidance needed
the same namespace correction. These changes land at their owning sources in separate PRs.

Kept intentionally: changelog release identities, old package aliases used to verify store
compatibility, historical lockfiles/benchmark launch evidence and source snapshots, migration
rules/tests, forbidden-import guards for both old and new packages, personal account/home-path
identifiers and the unmigrated brazecli repository. The old one-off publish script is explicitly
labelled historical; it was not run. Historical file hashes remain unchanged.

## Checks

Refreshed released-source sync/contracts; strict docs (915 references, zero gaps/invalid examples),
localization, lint/browser structure, type checking and 275 unit tests pass. Isolated namespace
fixtures reject old instructions and encoded links while allowing real release history.
Browser smoke and targeted EN/RU/ES checks cover the visible/copyable package, Markdown, mobile
layout and equal Request/command backgrounds in light and dark themes. Publication gets full
export, link/SEO, browser, security and platform checks before live verification.
