# Reader examples, current-version guides and AI-chat tabs

The owner requested simpler browser/mobile setup, application tabs, practical search entrances,
no package versions in user guides, a useful statistics example, and distinct first-task and
messenger usage pages. Work continues on `fix/docs-tooling-main-20261008`; latest main merged
from `10842bf`, including the Memo guide. Existing navigation and Memo's sidebar icon remain.

## Reader changes

- Browser/mobile guide: general MCP-compatible AI-chat opening; desktop ChatGPT/Claude apps are
  unnecessary. ChatGPT, Claude, Gemini and DeepSeek have separate tabs. Existing setup steps and
  incoming anchors remain. The nonselected application panels stay mounted for exported anchors.
- Gemini: Google's custom-app instructions, account requirements and browser-to-mobile path.
  Evidence: [Google Help](https://support.google.com/gemini/answer/17209137?hl=en-yt).
- DeepSeek: distinguish ordinary chat from the separate
  [Harness web client](https://www.deepseek.com/en/harness/) and its
  [MCP client configuration](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/mcp/mcp-client/README.md).
  No unverified direct chat.deepseek.com connector steps or remote OAuth success claim.
- Search explanation: Telegram/MAX task links at the beginning and end; agent request before
  implementation detail. Typo correction is a capability of discovery mode, while strict Lucene
  remains the released CLI default. The exact flag is in a disclosure for terminal users.
- First tasks: three short first-success prompts and links to deeper workflows. Messenger usage:
  changed agreements, meeting materials, a long discussion and commitments spanning chats.
  Prompts explicitly request tg CLI or max CLI; browser examples still name their MCP connection.
- Reports: coherent illustrative weekly totals, seven-day chart, group comparison, interpretation
  and a next request. The numbers are examples, not observations of the owner's account. Daily
  counts and group message counts both total 684; four questions remain without a found answer.
  The older isolated runtime fixture remains a separate behavioral check, not the new chart's data.
- Package release numbers removed from guide prose/link labels and Memo installation commands.
  Minimum runtimes and historical changelogs remain useful. Immutable evidence URLs and internal
  reviewed-release contracts retain exact revisions. Native pages use explicit sync corrections.

## Verification

`pnpm docs:versions` is part of `pnpm docs:check`; it checks public guides for package pins and
release-number prose. Localization, command contracts and strict examples remain separate checks.
Browser checks cover app selection, old deep links, mobile overflow, accessible reports, matching
chart/table totals and Markdown equivalents. Build/link/SEO checks inspect the static export used
by the local preview. No live account operations or publication are part of this change.

Validation passed: 227 unit tests; 13 affected browser checks (three languages, both messenger
reader guides, app selection, deep links, mobile layout and accessibility); production export
of 548 routes; localization; strict command quality (899 reference entries, no gaps or invalid
examples); version-prose guard; lint; links and SEO. Manual visual inspection covered the weekly
chart and Gemini panel. Port 3000 serves this export and was checked for the new Telegram tasks.
