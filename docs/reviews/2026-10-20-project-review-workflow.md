# Project evidence and review workflow

Reader task: gather a recorded project's context, inspect proposed key documents and cited findings,
then decide which facts and follow-ups to keep. Setup belongs to the existing installation guide.

Runtime: reviewed Memo 0.78.0, source `c8d02d66bdd9790bd705ada36dd78d4113ae1a58`, Core 0.365.0,
Base 0.47.1. The prose-only native changes are Memo [#343](https://github.com/WireCatLabs/cli-memo/pull/343)
and [#344](https://github.com/WireCatLabs/cli-memo/pull/344). `tools.json` pins their immutable guide source;
the runtime release remains 0.78.0. No commands, source selectors or permissions are added here.

## Source and behavior evidence

- [Project review CLI](https://github.com/WireCatLabs/cli-memo/blob/c8d02d66bdd9790bd705ada36dd78d4113ae1a58/src/knowledge/project-actions-command.ts):
  batch/page limits, brief view, exact input retries, selected IDs and fingerprints.
- [Decision handling](https://github.com/WireCatLabs/cli-memo/blob/c8d02d66bdd9790bd705ada36dd78d4113ae1a58/src/knowledge/project-actions.ts)
  and [caller labels](https://github.com/WireCatLabs/cli-memo/blob/c8d02d66bdd9790bd705ada36dd78d4113ae1a58/src/author.ts):
  agent reason/off switch, owner-mode terminal boundary, source state and context.
- [Published host tests](https://github.com/WireCatLabs/cli-memo/blob/c8d02d66bdd9790bd705ada36dd78d4113ae1a58/src/knowledge/project-actions.test.ts):
  selected findings accepted, remaining new ones rejected, stale evidence can be rejected, review receipts.
- [Memory creation](https://github.com/WireCatLabs/cli-memo/blob/c8d02d66bdd9790bd705ada36dd78d4113ae1a58/src/memories/memories.ts)
  and [fact creation](https://github.com/WireCatLabs/cli-memo/blob/c8d02d66bdd9790bd705ada36dd78d4113ae1a58/src/facts/command.ts):
  direct owner records versus agent proposals.
- [Note export](https://github.com/WireCatLabs/cli-memo/blob/c8d02d66bdd9790bd705ada36dd78d4113ae1a58/src/notes/export.ts):
  the export recipe creates a file.
- [Synthetic bounded-evidence reproduction](https://github.com/WireCatLabs/cli-testing/pull/174):
  empty pages and checkpoints can coexist with a matching stored document. Empty search output does
  not establish complete retrieval.

A separate manual fixture exercised the actual released CLI and real stdio MCP server in temporary
state, with invented messages and an external-I/O guard on subprocesses. It checked alias gathering,
context/brief output, page numbers, exact retry/changed input, agent decisions disabled through CLI/MCP,
owner decisions and continued staging, selected finding rejection semantics, a numbered project task,
and stale-source rejection. No owner archive, connector, model or live proposal was used. This is a
workflow check, not extraction accuracy or a new routine CI suite.

## Reader review

Reviewer: Codex. Existing page openings, endings and unchanged sections were read alongside the
changed sections. All recipe requests and the opening search request are localized into RU/ES;
executable fences, command names, IDs and settings stay identical to the English source.

| Page / locale | Reader task | Terms and opening | Behavior and next action | Review result |
| --- | --- | --- | --- | --- |
| recipes / en | Gather, propose, review | Records and file effects explicit; fingerprints explained | Whole selection before confirm; separate meeting flow | Prose checked |
| recipes / ru | Same | Requests and workflow localized; owner/agent distinct | Same commands, unknown dates/assignees and partial coverage retained | Prose checked |
| recipes / es | Same | Requests and workflow localized; source evidence distinct from conclusions | Same decision and receipt behavior | Prose checked |
| search / en | Find evidence and choose its review path | No absolute completeness promise | Check progress and coverage; project versus meeting references | Prose checked |
| search / ru | Same | Localized request; no empty-result absence claim | Existing meeting anchors and new project-review link retained | Prose checked |
| search / es | Same | Archive completeness expressed without implying data integrity | Same source/continuation boundaries | Prose checked |
| configuration / en | Control agent decisions | Setting at top level; preserve existing config | Agent-mode control and owner terminal boundary explicit | Prose checked |
| configuration / ru | Same | Same setting and JSON; localized explanation | Same CLI/MCP scope and terminal boundary | Prose checked |
| configuration / es | Same | Same setting and JSON; localized explanation | Same CLI/MCP scope and terminal boundary | Prose checked |

Corrected review findings: project gathering linked only to meeting review; the setting was absent
from the reference; generic agent memories/facts were described as immediately accepted; empty results
and word search overstated completeness; the recipes opening denied file effects despite note export.
The Spanish archive explanation now describes completeness instead of implying integrity.

## Validation record

Passed locally: native docs/spelling/Markdown checks, the released workflow fixture, reviewed command
contracts (network disabled for tool execution), translation structure, full sync, strict docs checks,
lint, search bundle check, release-note check, 319 unit tests, typecheck and all seven browser smoke
cases. Strict quality found no invalid examples or missing reference entries. The six manual constructs
on the affected pages are three configuration-file paths and three explicitly abbreviated note-command
illustrations; they are not presented as executable commands.

A separate one-off browser check passed for all nine changed HTML pages and nine Markdown twins in
EN/RU/ES. It checked preserved anchors, new project-review/configuration links (including clicking
through to the setting), rendered command/config examples, 390-pixel mobile layout and no page errors.
The local dev server emitted the existing shared Sidebar key warning; no runtime code changed.

Deployment additionally runs full export, link/SEO and the existing browser suites. Post-deploy checks
repeat the nine-page/nine-Markdown check against production. Results are recorded on this change's PR.
