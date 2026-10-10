# Search discovery release review

Readers can find messages from a question with local archive discovery, inspect matching/missing
terms and direct-reply provenance, and install the current tools. The portal pins published
Telegram 0.44.0 and MAX 0.43.0, both using exact `@wirecat/cli-messaging` 0.216.0 and core 0.18.1.
Runtime contracts were captured from isolated npm installations with network/keyring access blocked.

## Release and behavior evidence

- [Shared implementation](https://github.com/WireCatLabs/cli-messaging/releases/tag/v0.216.0):
  [planner](https://github.com/WireCatLabs/cli-messaging/blob/v0.216.0/src/search/question-plan.ts),
  [ranking/replies](https://github.com/WireCatLabs/cli-messaging/blob/v0.216.0/src/services/messages-discovery.ts)
  and [archive backend](https://github.com/WireCatLabs/cli-messaging/blob/v0.216.0/src/services/messages.ts#L427-L439).
- [Telegram release](https://github.com/WireCatLabs/tg-cli/releases/tag/v0.44.0), commit
  `be1c3ba831e49e6fbd1640d62047427a7334bcec`; [MAX release](https://github.com/WireCatLabs/max-cli/releases/tag/v0.43.0),
  commit `259ef04cbd879debfbcf1bbac565cd15398322b5`.
- Both actual npm binaries retrieved an eligible synthetic direct reply, excluded a different sender,
  preserved the empty strict-search result and returned the parent locator. Parent and child used
  the same hard chat/sender/day constraints. No connection was attempted in the injected path;
  the real binary succeeded with network/keyring access blocked. These are bounded synthetic
  correctness checks, not a live-account smoke test or broad relevance certificate.
- [Recorded research](https://github.com/WireCatLabs/cli-testing/blob/63de1d7870e5d983bbc05dd253cdb66d0bbfd7cd/performance/search/model-free/FRESH-VALIDATION.md)
  retains failures: fresh development questions improve 9/16 to 16/16 actual answers in top ten,
  but only 2/16 rank first. Original controls keep eight paraphrase failures and missing-fact
  partial hits. Public strict defaults remain; scores are not answer probabilities.

## Review findings resolved

The primary read-only reviewers read full search/attachment/installation/remote guides in both
translated locales; MAX also read audio recognition. A third read-only reviewer read full prose
of all 40 remaining affected locale pages, including usage, MCP, rankings and troubleshooting.
Generated inventories were reviewed at the changed sections; preserved examples and links were
checked structurally. Changelog review covered new entries and the package introduction.

- Corrected current package introductions, a duplicate DOCX mention and missing DOCX archive limits.
- Qualified discovery's archive-only behavior beside existing server-search descriptions.
- Preserved four actual old translated troubleshooting slugs and the two native-language slugs.
- Corrected Telegram's local-only recovery claim and MAX usage's unconditional server claim using
  explicit, source-linked portal corrections. Owning fixes are [Telegram PR 413](https://github.com/WireCatLabs/tg-cli/pull/413)
  and [MAX PR 539](https://github.com/WireCatLabs/max-cli/pull/539); runtime pins remain released tags.
- Repaired inherited Spanish statistics examples and preserved the sending/deletion distinction.
- Matched MAX MCP resource-list wording to its account-filtered
  [released source](https://github.com/WireCatLabs/max-cli/blob/v0.43.0/src/mcp/resources.ts#L28-L35).
- Reviewed all changed locale prose before accepting 67 source fingerprints. Namespace substitutions
  preserve code/link contracts; new discovery terms remain literal API names. Legacy immutable
  shared query-language references stay as authored in the released native guides.

## Page coverage

| Page and locale | Read scope | Behavior, terms and links | Reviewer and result |
| --- | --- | --- | --- |
| `max/attachments.en` | full prose, opening and ending | bounded PDF/DOCX extraction and retained-file paths | max_docs_review; resolved |
| `max/attachments.es` | full prose, opening and ending | bounded PDF/DOCX extraction and retained-file paths | max_docs_review; resolved |
| `max/audio-recognition.en` | full prose, opening and ending | complete mono/stereo Ogg Opus, ten-minute limit | max_docs_review; resolved |
| `max/audio-recognition.es` | full prose, opening and ending | complete mono/stereo Ogg Opus, ten-minute limit | max_docs_review; resolved |
| `max/bot.en` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/bot.es` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/changelog.en` | new released entries and introduction | current package, discovery, intervening security/license entries | primary tool reviewer; resolved |
| `max/changelog.es` | new released entries and introduction | current package, discovery, intervening security/license entries | primary tool reviewer; resolved |
| `max/cli-contract.en` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/cli-contract.es` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/commands.en` | changed generated reference sections | new discovery option and archive-only backend descriptions | primary tool reviewer; resolved |
| `max/commands.es` | changed generated reference sections | new discovery option and archive-only backend descriptions | primary tool reviewer; resolved |
| `max/commands.ru` | changed generated reference sections | new discovery option and archive-only backend descriptions | primary tool reviewer; resolved |
| `max/diagnostics.en` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/diagnostics.es` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/groups.en` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/groups.es` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/installation.en` | full prose, opening and ending | current npm scope and native installer paths | max_docs_review; resolved |
| `max/installation.es` | full prose, opening and ending | current npm scope and native installer paths | max_docs_review; resolved |
| `max/mcp.en` | full prose, opening and ending | published bin paths; MAX resource lists are account-filtered | portal_links_review; resolved |
| `max/mcp.es` | full prose, opening and ending | published bin paths; MAX resource lists are account-filtered | portal_links_review; resolved |
| `max/query-language.en` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/query-language.es` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/rankings.en` | full prose, opening and ending | preserved statistics contract; repaired Spanish examples | portal_links_review; resolved |
| `max/rankings.es` | full prose, opening and ending | preserved statistics contract; repaired Spanish examples | portal_links_review; resolved |
| `max/remote.en` | full prose, opening and ending | repository links and preserved release facts | max_docs_review; resolved |
| `max/remote.es` | full prose, opening and ending | repository links and preserved release facts | max_docs_review; resolved |
| `max/roadmap.en` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/roadmap.es` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/search.en` | full prose, opening and ending | archive-only discovery, strict syntax, missing terms, DOCX limits | max_docs_review; resolved |
| `max/search.es` | full prose, opening and ending | archive-only discovery, strict syntax, missing terms, DOCX limits | max_docs_review; resolved |
| `max/security.en` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/security.es` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `max/troubleshooting.en` | full prose, opening and ending | archive/server recovery and previous heading anchors | portal_links_review; resolved |
| `max/troubleshooting.es` | full prose, opening and ending | archive/server recovery and previous heading anchors | portal_links_review; resolved |
| `max/usage.en` | full prose, opening and ending | scope/account limits, transcription or deletion outcomes | portal_links_review; resolved |
| `max/usage.es` | full prose, opening and ending | scope/account limits, transcription or deletion outcomes | portal_links_review; resolved |
| `tg/archive.es` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `tg/archive.ru` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `tg/attachments.es` | full prose, opening and ending | bounded PDF/DOCX extraction and retained-file paths | tg_docs_review; resolved |
| `tg/attachments.ru` | full prose, opening and ending | bounded PDF/DOCX extraction and retained-file paths | tg_docs_review; resolved |
| `tg/changelog.es` | new released entries and introduction | current package, discovery, intervening security/license entries | primary tool reviewer; resolved |
| `tg/changelog.ru` | new released entries and introduction | current package, discovery, intervening security/license entries | primary tool reviewer; resolved |
| `tg/cli-contract.es` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `tg/cli-contract.ru` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `tg/commands.es` | changed generated reference sections | new discovery option and archive-only backend descriptions | primary tool reviewer; resolved |
| `tg/commands.ru` | changed generated reference sections | new discovery option and archive-only backend descriptions | primary tool reviewer; resolved |
| `tg/diagnostics.es` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `tg/diagnostics.ru` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `tg/installation.es` | full prose, opening and ending | current npm scope and native installer paths | tg_docs_review; resolved |
| `tg/installation.ru` | full prose, opening and ending | current npm scope and native installer paths | tg_docs_review; resolved |
| `tg/mcp.es` | full prose, opening and ending | published bin paths; MAX resource lists are account-filtered | portal_links_review; resolved |
| `tg/mcp.ru` | full prose, opening and ending | published bin paths; MAX resource lists are account-filtered | portal_links_review; resolved |
| `tg/query-language.es` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `tg/query-language.ru` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `tg/rankings.es` | full prose, opening and ending | preserved statistics contract; repaired Spanish examples | portal_links_review; resolved |
| `tg/rankings.ru` | full prose, opening and ending | preserved statistics contract; repaired Spanish examples | portal_links_review; resolved |
| `tg/remote.es` | full prose, opening and ending | repository links and preserved release facts | tg_docs_review; resolved |
| `tg/remote.ru` | full prose, opening and ending | repository links and preserved release facts | tg_docs_review; resolved |
| `tg/roadmap.es` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `tg/roadmap.ru` | full prose, opening and ending | repository links and preserved release facts | portal_links_review; resolved |
| `tg/search.es` | full prose, opening and ending | archive-only discovery, strict syntax, missing terms, DOCX limits | tg_docs_review; resolved |
| `tg/search.ru` | full prose, opening and ending | archive-only discovery, strict syntax, missing terms, DOCX limits | tg_docs_review; resolved |
| `tg/troubleshooting.es` | full prose, opening and ending | archive/server recovery and previous heading anchors | portal_links_review; resolved |
| `tg/troubleshooting.ru` | full prose, opening and ending | archive/server recovery and previous heading anchors | portal_links_review; resolved |
| `tg/usage.es` | full prose, opening and ending | scope/account limits, transcription or deletion outcomes | portal_links_review; resolved |
| `tg/usage.ru` | full prose, opening and ending | scope/account limits, transcription or deletion outcomes | portal_links_review; resolved |

Shared EN/RU/ES search architecture explains candidates, word coverage, reciprocal rank fusion,
reply eligibility and model-free bounds. Architecture package labels and all installation copy
controls use current names while preserving dated implementation evidence. The Windows installer
is the released native mirror. Landing/editorial sources and outputs retain the latest owner-reviewed
layout; the rebase keeps project installation changes from PRs 110–111 and the Apache license.

## Checks

Local checks pass: lint, 257 unit tests, generated search bundle, complete/source-matched localization,
release-note/roadmap review, type checking and strict documentation validation. The latter reports
915 reference entries, zero gaps and zero invalid examples; 126 generic illustration constructs
remain manually reviewable, rather than claimed executable. Both released synthetic report fixtures pass.
Browser smoke passes 10 cases; the affected diagram/onboarding suite passes all three locales.
The post-rebase smoke suite also passes all ten cases, including the shared installation path.
Full export, links, SEO, accessibility and the wider browser suite run in CI before merge.
