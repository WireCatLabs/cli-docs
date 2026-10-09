# Documentation tooling implementation and trial

**Base correction, 8 October:** the initial implementation below used a stale working checkout.
It has been moved to a clean worktree based on current `main` (`e53617b`). Existing architecture
diagrams and newer guides are retained. The original verification numbers are historical; new
main-based checks are recorded separately.

Implemented on 8 October 2026 after the manual baseline. Repomix 1.18.1 and beautiful-mermaid
1.1.3 are pinned. CodeWiki 2.0.0 uses upstream commit `64c2b60f23013904e495b0c12acba9b91ceb5746`
with its coding-agent-wrapper dependency fixed at `9ec22af22a32ee50392443ae00ca401c3ec4e46b`.

## What changed

- Allowlisted source packs with fixed-ref support, hashes and isolated concurrent outputs.
- Exact reviewed npm-release command discovery, with install scripts disabled and network/keyring
  sockets blocked during discovery. Current contracts: MAX 0.27.0 and TG 0.26.0.
- Separate generated-reference, command-example and task-mapping reports. Strict checks are in
  CI/deployment; explicit unreleased deployment previews receive an advisory release comparison.
- Scoped Markdown lint and an advisory EN/RU/ES spelling report.
- Build-time SVG from Mermaid fences, localized captions, theme variables, distinct identifiers,
  keyboard scrolling and preserved Markdown source. Pilots are architecture packages and first tasks.
- Shared navigation puts onboarding/tasks/setup before technical details. First tasks now
  distinguishes common requests from Telegram-only command sequences and explains result checks
  and recovery links. The search playground description was reconciled across languages.
- A validated documentation skill is available to the owner's shared agents and Claude Code.

## CodeWiki comparison

All three bounded trials used the existing Codex login and its default model. Each received at
most ten files from a released source snapshot. MAX login used v0.27.0; shared search/replies
used cli-messaging v0.140.0. No messenger task was executed. The runs generated one technical
overview each, with module metadata, in ignored `.docs-tooling/codewiki/`.

| Topic | Measured elapsed time | Draft lines | Citation file/range checks |
| --- | --- | --- | --- |
| Login | 283.1 s | 192 | 72 of 90 within supplied files |
| Search | 298.8 s | 174 | 68 of 89 within supplied files |
| Replies/permissions | 289.3 s | 175 | 68 of 78 within supplied files |

The range check is deliberately narrow: a bounded line range does not prove the claim it cites.
Several failing ranges exceed the source's end by a few lines. The drafts claim original line
counting despite receiving extracted components; the trial instructions now prohibit inferred
line numbers and permit file/symbol references when offsets are unavailable. `docs:wiki:review`
checks supplied input hashes and citation ranges without following arbitrary draft paths.

Manual samples show useful architectural distinctions: token acquisition/adoption/persistence;
parser versus executor contracts; and write permission/admission versus provider execution.
The drafts generally label missing implementations and inferences. They are too technical for
direct publication and need factual review, source-link correction and task-focused rewriting.

The initial search selection prioritized lexically sorted parser files, omitting the archive
executor and search service. Selection now respects the declared service/executor priority.
The recorded search result remains a parser-heavy partial-source experiment; no broader coverage
is claimed. Requests for supplied modules by filename sometimes failed because the tool expects
component identifiers. This adds review effort even when the file is in the snapshot.

Recommendation: use Repomix and the authoring workflow routinely, and CodeWiki on demand for
technical exploration. This trial does not justify unattended documentation generation. Keep
drafts separate and verify evidence before editing public pages. No source pack is automatically
uploaded; requested CodeWiki runs send the supplied source to the user's selected AI provider.

## Verification and limits

The strict report currently finds all 661 released command-reference entries and their own
options, no invalid supported examples, seven task mappings, and 93 constructs requiring manual
review (generic subcommand placeholders and shell globs). Unmapped command families remain an
advisory queue. This does not establish full behavioral or prose coverage.

Markdown lint, translation preservation, search-language generation, TypeScript and the unit
suite pass. Production export and built HTML/Markdown link/SEO checks pass. Diagram browser
checks pass in EN/RU/ES, including mobile overflow, keyboard focus, axe and Markdown equivalents.
The 22 existing production browser tests also passed; the implementation plan records the
completed verification.

Spelling remains advisory: the current report has 50 dictionary findings in 14 shared pages,
including technical terms, British spellings and valid Spanish/Russian inflections. These are
not automatically treated as 50 typos. No real-account behavioral checks or human-reader test
were performed, and no site was deployed.
