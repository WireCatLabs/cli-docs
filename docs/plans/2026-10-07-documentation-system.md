# Documentation system: manual baseline and implementation plan

**Base correction, 8 October:** the initial implementation below used a stale working checkout.
It has been moved to a clean worktree based on current `main` (`e53617b`). Existing architecture
diagrams and newer guides are retained. The original verification numbers are historical; new
main-based checks are recorded separately.

Date: 7 October 2026. Implemented on 8 October 2026: source packs, isolated release contracts,
strict checks, lint/spelling tools, CodeWiki trials, Mermaid pilots, shared agent instructions,
task mappings and navigation. See the [implementation review](../reviews/2026-10-08-documentation-tooling.md)
for evidence, trial results and limitations.

## Goal and decisions

Make documentation useful first to nontechnical readers who work through an AI assistant, while
preserving exact reference material for agents and developers. Improve current task paths before
adding pages. The [index](../README.md) identifies existing homes; [authoring rules](../AUTHORING.md)
define orientation, page blocks, results, endings, cross-links, evidence and localization.

Keep Fumadocs, existing routes/anchors, one owning source per fact, deterministic command
generation and reviewed-release translation gates. Trial beautiful-mermaid for editable diagrams.
Run Repomix/CodeWiki only after this manual baseline; judge their value against concrete tasks.

## Current state and manual findings

Reviewed shared navigation, shared-page openings/endings, tool page inventories, selected search,
archive/setup examples, source ownership, command generators and checker implementations. This
is local source inspection, not a deployed-site/browser audit or a complete behavioral evaluation.

At inspection `tools.json:12,24` pins MAX v0.27.0 and TG v0.26.0. Those are reviewed documentation
versions, not a statement about the latest npm releases. Build source and generator inputs must
use each consumer's exact cli-core/cli-messaging dependencies. Portal dev dependencies alone
do not define the documented tool behavior.

| Finding | Evidence and reproduction | Proposed result | Priority |
| --- | --- | --- | --- |
| Existing onboarding already uses ordinary agent requests | Open `content/docs/index.mdx:6` and `first-tasks.md:6` | Refine these foundations; avoid replacing them with an implementation wiki | P1 |
| Technical pages precede shared MCP guidance | Read `content/docs/meta.json`: architecture/search pages occur before MCP | Group start/tasks/setup before technical details; retain URLs and all locales | P2 |
| Shared first-task framing suggests renaming tg to max | Read `content/docs/first-tasks.md:11` and its later capability qualification | Verify each common example against both releases; explain real differences beside the example | P1 |
| Existing page parity is not strict release validation | Inspect `cli-messaging/src/parity/pages.ts:30–35`: unknown paths are skipped and planned options can pass | Add a strict released-contract mode; retain planning/parity behavior for its existing purpose | P1 |
| No command-to-task coverage report is wired in this portal | Inspect `package.json` scripts and `.github/workflows/ci.yml` | Report reference coverage separately from meaningful task coverage; show unmapped families without forcing new pages | P2 |
| Playground descriptions disagree | Compare `search-architecture.mdx:133` (12 messages/four chats), `search-playground.mdx:8` and `lib/search-playground/copy.ts:23` (36/six) | Confirm the fixture inventory and reconcile related prose in EN/RU/ES | P2 |
| Portal has no configured prose/Markdown lint script | Inspect `package.json`; compare tool repositories' `docs:check` | Add scoped Markdown/spelling checks with locale support; keep subjective style review advisory | P2 |
| Translation gate treats every code fence as executable-identical | Inspect `scripts/localize.ts`, `fencedCode` and `translationProblems` | Preserve executable fences; permit reviewed Mermaid label translation with stable graph structure | P1 for diagram rollout |

These are implementation work items, not failures demonstrated by fresh runtime tests. Existing
files include uncommitted work; preserve it and isolate subsequent implementation changes.

## Navigation and page plan

Use these sidebar groups, with localized labels and current routes:

1. **Start here:** docs home, installation, agent connection, first tasks.
2. **Things you can do:** prompting, feature/task orientation; links into existing task sections.
3. **Understand your setup:** MCP, data/access/security, bot API orientation, search playground.
4. **Telegram / MAX:** existing tool guide, reference and help groups.
5. **Technical details:** architecture and search architecture.

The docs home provides the primary install/first-task path. Task pages link prerequisites,
relevant messenger-specific steps, exact reference and likely recovery. Explanations link back to
an actionable task. Reference pages link to relevant task guides. Keep the existing header and
messenger-switch behavior; breadcrumb/URL changes are unnecessary for a grouping change.

Do not create the earlier proposed standalone catch-up, search, meeting and reply pages yet.
Pilot those questions in their existing homes and split only when reader navigation benefits.

## Quality tooling: keep, extend, add

| Check | Current state | Next action and limit |
| --- | --- | --- |
| Command reference generation | Both CLIs generate `commands.md` from their actual command tree | Preserve generation drift checks; compare command paths/options/defaults at the release snapshot |
| Tool page/sidebar/link structure | Tool `docs:check`, cli-core structure checks, portal sync | Reuse; add public reachability check only if current browser/link checks do not cover it |
| CLI example/parity validation | Both CLIs run `parity:check --pages` | Add strict actual-release validation for shared guides, translations and exported examples |
| Translation preservation | `docs:localize` and sync validate fingerprints, headings, code/literals/links | Extend for diagram label translation; keep stale-source failures |
| Built HTML/Markdown links/anchors | `check:links` | Reuse; include new diagram references and fallback/export behavior |
| Metadata/locales/sitemap | `check:seo` | Reuse |
| Search vocabulary | `search:check` | Preserve; add phrases only for existing supported task homes |
| Browser/accessibility/mobile | Playwright quality suites and axe dependency | Add targeted diagram/theme/keyboard/mobile checks when renderer is introduced |
| Markdown syntax and spelling | rumdl/cspell in tool repositories; no portal script | Reuse their conventions, with MDX-aware scope and EN/RU/ES dictionaries; avoid overlapping linters |
| Prose conventions | Editorial review; no portal prose linter | Trial Vale in report/advisory mode if it flags useful errors with acceptable locale noise |
| Task coverage | Manual index | Add a small maintained task-to-page/command-family manifest after the pilot |

### Strict commands and coverage design

Capture `commands --json` from the built reviewed release with temporary isolated config/state
and networking disabled. Pin the producing CLI version/commit and shared dependencies beside
the artifact. Do not query the owner's account. Prefer existing introspection APIs for validation.

Parse executable fences and inline command examples structurally. Handle quoted arguments,
profiles, global flags, nested command paths, shell continuations, pipelines and Windows forms.
Keep syntax-only examples, placeholders and deliberately invalid troubleshooting examples
explicit; validate negative examples as negative examples. Report unsupported constructs for
review instead of silently treating them as valid. Do not execute documentation shell blocks.

Reject nonexistent command paths/options against the actual release even when a parity manifest
plans them. Check argument arity and option forms where the command contract exposes them.
Future-work examples cannot satisfy released reference or task coverage.

Report separately:

- **Reference coverage:** released command paths/options represented by the generated reference.
- **Example validity:** examples checked, unsupported/negative examples, failures by file/line.
- **Task coverage:** important user tasks mapped to an existing guide with prerequisites, expected
  result and recovery; reviewed messenger differences and justified exclusions.

Exclude generated command lists from guided-task coverage. No universal tutorial quota or page
count target. Block reference drift and invalid examples; start missing task mappings as a report
until priorities are reviewed. A green syntax report does not prove factual prose or task success.

## Repomix, CodeWiki and TypeScript navigation

[Repomix](https://repomix.com/guide/) packages source for agent context. It can help broad overview,
cross-package review and handoff; targeted `rg` and file reads remain efficient for routine
navigation. Optional compression reduces input but can omit details needed to verify behavior.
Its generated reference skills are experimental. [Skill output](https://repomix.com/guide/agent-skills-generation),
[compression](https://repomix.com/guide/code-compress).

Next stage: install a pinned development dependency and add a documented script shared by all
agents. Use an explicit allowlist, stable output path, source/version manifest and ignored output.
For local repositories, enumerate permitted tracked source first and pack a staging snapshot
containing only those files. Exclude protected files, private docs/captures, generated files and
unrelated evaluation artifacts before any tool reads them. Compression is optional; verify
claims against original source. Do not automatically load whole-repository packs on every task.

Trial [CodeWiki](https://github.com/FSoft-AI4Code/CodeWiki) in isolated released source snapshots,
with generated output separate from maintained `docs/`. Compare it with manual evidence for
login, older-history search and replies/permissions. Record factual errors, missing topics,
source-link quality, useful discoveries, editing effort and measured cost/time. It is a draft
analysis tool until that trial shows value.

A [TypeScript language server](https://github.com/typescript-language-server/typescript-language-server)
provides semantic source navigation through an LSP client. Installing a binary alone does not
give an agent definition/reference tools. Check the editor/agent's actual client support and
the repository's TypeScript version first; this portal declares TypeScript 7, while the current
standalone language-server setup recommends TypeScript 6. Do not downgrade this project to add it.
Use the existing compiler/editor navigation initially; add an LSP adapter only for a demonstrated
cross-package navigation gap. No new MCP server is required just to run Repomix as a CLI.

## Ordered implementation

1. **Manual foundation — done:** this plan, maintainer index and authoring standard. Documented
   existing page homes and checker limitations before running generators.
2. **Tooling baseline:** install/configure Repomix, test an allowlisted source pack and record
   its provenance. Audit installed checker versions against reviewed tool releases. Add scoped
   linting and strict command/example/reference reports, reusing current machinery where possible.
3. **Generator comparison:** run the three-topic CodeWiki trial against the manual baseline;
   keep useful evidence and reject unsupported claims. Decide whether it merits repeated use.
4. **Beautiful-mermaid pilot:** render one existing architecture relationship and one task flow
   as build-time SVG. Wire editable fenced source into `lib/source.ts`/`components/mdx.tsx` after
   verifying installed Fumadocs APIs. Preserve diagram meaning in Markdown twins. Test supported
   syntax, unique SVG IDs, captions, themes, mobile sizing and keyboard enlargement if provided.
5. **Three content pilots:** refine account/agent connection, older-history search and drafting
   replies in existing pages. Verify examples and meaningful behavioral cases in isolated fixtures;
   run a reader task and review all locales. Reconcile playground descriptions from the fixture.
6. **Coverage and navigation:** encode a small reviewed task manifest from those pilots; reorganize
   sidebar groups consistently in EN/RU/ES, preserving destinations and switch behavior.
7. **Maintenance:** extend release-update reporting to impacted task mappings, source claims and
   diagrams. Review drafts and translations before advancing `docsRef`; do not auto-publish AI prose.

## Validation and acceptance

The manual foundation was checked before installation and generation. Implementation checks
now include the unit suite, release contracts, localization, production export and browser checks.
Public improvements use existing pages; generated CodeWiki drafts remain private research.

For implementation, run applicable tool generation/docs/parity checks in isolated release copies.
Run portal localization, lint, tests, search check, typecheck, build, link/SEO checks and targeted
production-export browser tests. Check command/example validation with meaningful negative cases:
unknown command, planned-but-unreleased option, quoted/profile command, obsolete option, and
intentional error example. Verify diagrams and prose survive HTML/Markdown export in every locale.

Accept each pilot when a reader can tell why they are on the page, what to do, how to recognize
success or incomplete data, and where to go next; its examples match the selected release and
its consequential claims have source evidence. Neither prose lint nor source generation can
replace this judgment.

## Implementation verification — 8 October 2026

Production export, localization, search check, lint, TypeScript and the unit suite passed. The
22 existing production browser tests and three new diagram tests passed. Strict release checking
found 661 reference entries, no missing options/entries and no invalid supported examples.
Ninety-three generic/glob examples remain a manual-review queue; spelling is advisory.
All three CodeWiki trials generated draft overviews; their source-citation problems are recorded
in the implementation review. No human-reader or real-account evaluation and no deployment were
performed. Generated evidence remains separate from authored pages.

Current-base correction and outstanding release mismatches: [review](../reviews/2026-10-08-main-base-correction.md).


## User-task refresh — 8 October 2026

The main-based continuation now incorporates `f5ad67f`, fixes the 15 shared-guide release
mismatches, shortens First tasks, adapts the existing shared Search guide, and extends Demo
with homepage-backed meeting, inbox and recommendation scenarios. Strict checks cover the
rendered Demo commands as well as Markdown examples. The review records release evidence,
branch reconciliation and validation: [user-task refresh](../reviews/2026-10-08-user-task-refresh.md).

The separate newer-release guide review remains with its current worktree. Manual review of
the generic-example queue and reader feedback on these pages are the next editorial inputs;
additional pages are not required merely to increase coverage.
