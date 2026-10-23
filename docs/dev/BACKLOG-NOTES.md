# Backlog notes

Longer analysis behind items in [BACKLOG.md](BACKLOG.md), one section per id.

## DOCS-6

**Per-tool roadmap pages.** Each tool's roadmap stays in its own repository, as `docs/roadmap.md`. The site
does not write it. `pnpm sync` already adds the page last in the tool's sidebar when the file exists at the
pinned `docsRef` (`scripts/sync.ts`, the `sidebar.splice` for `roadmap`). That gives `/docs/<tool>/roadmap`
for every tool with no site code:

| Tool | Repository roadmap | Site page today |
| --- | --- | --- |
| tg | yes | `/docs/tg/roadmap` |
| max | yes (Russian source) | `/docs/max/roadmap` |
| zm | yes | `/docs/zm/roadmap` |
| drive | no | none |
| memo | no | none |
| wa | yes | none (the tool is not on the site, DOCS-4) |

What each new page needs:

1. `docs/roadmap.md` in the tool's repository, listed in its `docs/meta.json`, and a release tag.
2. `translations/<tool>/roadmap.{ru,es}.md` here (and `.en.md` for a tool whose source is Russian), with
   fingerprints in `translations/sources.json`. Without them `pnpm sync` stops at "Documentation
   localization failed".
3. The `docsRef` bump in `tools.json`.

Every tool roadmap uses the same sections: what works today (a link to its features or commands page),
In progress, Next, Later. No dates.

**The global page** (`content/docs/roadmap.md`) keeps only work that crosses tools: new sources (Slack,
Google Meet, Notion), integrations, the SDK, the visual interface. Its "Messenger plans" section becomes
"Each tool's plans": one line per tool, linking its roadmap page. A test in
`scripts/docs-navigation.test.ts` can check that every tool with a roadmap page is linked from the global
page, so a new tool cannot be forgotten.
