# Reviewed releases and documentation corpus

Reviewed on 10 October 2026 against MAX v0.41.0 and Telegram v0.42.0.
The clean worktree started at site main ae3e1138e46090aa163911dc8367e7368c0a33ee.
Previous published releases and site changes were already complete; this review updates the
portal pins, translations and shared reader guidance.

## Coverage and reviewers

The MAX English reviewer read all 30 English tool guides, with the root reviewer owning the
remote guide, and all 24 shared guides in English and Spanish. The MAX Spanish reviewer read
all 30 Spanish MAX guides and all 29 Spanish Telegram guides. The Telegram reviewer read all
29 Russian Telegram guides and all 24 shared Russian guides. The root reviewer checked native
source changes, the Russian MAX command override, correction applicability, terminology,
UI copy and the affected shared pages. That covers 119 translated files or source overrides
and 72 shared page/locale combinations.

Changed prose was reviewed in full. Historical changelog material and unchanged generated
reference/code sections were reused after comparison rather than retranslated. Machine-assisted
translation drafts were manually corrected; structure and source fingerprints are additional
checks, not the basis for calling a translation reviewed.

## Findings and corrections

| Reader path | Problem | Correction and evidence |
| --- | --- | --- |
| Search and archive | Older prose claimed Telegram search never checks the server | Reviewed search contract defaults to both archive and server; explain archive-only mode and downloaded-history requirements for counts, filters and conversations |
| Telegram troubleshooting | Unknown commands were described as exit 1 and non-JSON errors | Isolated released-package checks with network and keyring access blocked measured exit 2 and `validation_error` JSON on stderr; include unknown options and missing arguments |
| MAX scheduled sends | Hourly accounting and a deduplication research caveat were stale | Queue-time safeguards count toward the scheduled hour; released scheduled tests confirm no automatic retry and `outcome_unknown` directs the reader to inspect the queue |
| MAX attachments and links | `--as-file` and message links were overgeneralized | Released adapter sends images as photos; video can use file mode. Message-link lookup is store-only and does not create a browser URL |
| Browser connection | A read-only startup example re-enabled message sending | Remove the startup permission override; distinguish profile permission settings from per-request approvals and require compatible HTTP MCP/OAuth support |
| Drafts and templates | Profile-configured AI generation was described as the user's agent | Explain AI provider and model identifier as separate technical settings; processing consent is separate from permission to send; dry runs can still send text to the provider |
| People and memo | Address-book contacts were confused with stored identities; injection handling sounded guaranteed | Distinguish person, contact and messenger identity; instruct agents to treat message text as data and explain the limit of CLI guards |
| Architecture | Dated source snapshots mixed with current MCP examples and version-policy promises | Label the snapshot, link immutable current MCP surface evidence, describe coordinated compatibility changes and explicit retries, qualify private-data logging claims |
| Shared openings and terminology | Actor synonyms, repetitive setup and editorial openings obscured the task | Use AI agent/agent consistently, start with the reader's purpose, retain technical literals, use generic messenger wording where capabilities are shared |
| Bot guides and reminders | Bot history limits and a past reminder date were misleading | Explain Bot API history limits separately from accessible channel/supergroup imports; use next Monday |
| Navigation and incoming links | Comparison route renamed; native rewrites removed old headings | Redirect from-tgcli to compare in every locale; preserve original and historical heading aliases, resolving retired sections to the guide overview |

The exact source anchors and reasons for public errata are in
[scripts/docs-corrections.json](../../scripts/docs-corrections.json). The raw captured upstream
pages remain unmodified. Reviewed command contracts record exact package versions and integrity
in `.docs-tooling/contracts/` (reproducible with `pnpm docs:contracts`). No personal account data or live messenger action was used.

The MAX `chats check` MCP alias remains supported in the released adapter; it was verified rather
than removed. Registry packages lack gitHead metadata, so package integrity and pinned source
are recorded separately. Earlier native-source discrepancies that remain relevant are retained
as explicit portal corrections; superseded corrections were retired after reviewing the new text.

## Cleanup

Removed 19 clean, merged worktrees and 89 task artifacts from the owner's cleanup ledger.
The private MAX wiki worktree remains because its PR is open. Existing dirty work and unrelated
active design/security worktrees were preserved. The release-docs worktree and its temporary
review evidence are removed only after publication; this checked-in record retains the review.

## Validation

Local checks passed: 119 translation structures and fingerprints, all correction anchors, sync,
release notes, refreshed package contracts, strict docs (915 reference entries, zero gaps or
invalid examples), 248 unit tests, lint, search generation and type checking. The 126 examples
classified for manual review include shell pipelines and intentionally invalid troubleshooting
examples; this count is separate from the zero-invalid-example result.

Record export, browser and publication results in the PR. Required checks include translation
structure and correction applicability, sync, release notes, command contracts, strict docs,
unit tests, lint, type checking, exported links and SEO, and the full browser suite in CI.
