# Meeting batch and Memo release review

Reviewer: Codex root, 16 October 2026. Base: cli-docs main `060c540`.

Readers can run several stored meeting searches or passage reads together and interpret each
answer independently. Memo readers can use the released mail filtering, protection and tagging
workflow, retry unread Gmail attachments and update without a temporary tool install retargeting
their timer. No new sidebar page or shared runtime implementation is needed.

## Immutable sources

- Zoom v0.20.1 → v0.21.0, commit `18e11cfe9f07a53096e1c3f64796a9a7588bc466`.
  [Released source](https://github.com/WireCatLabs/zoom-cli/tree/18e11cfe9f07a53096e1c3f64796a9a7588bc466).
- Memo v0.41.0 → v0.45.0, commit `3eafced054f5c5118d950c9105bef65cfe63e1a7`.
  [Released source](https://github.com/WireCatLabs/cli-memo/tree/3eafced054f5c5118d950c9105bef65cfe63e1a7).
- npm and GitHub stable releases agreed before capture. Both installed discovery contracts use
  Core 0.293.0 and Base 0.35.0. All five portal contracts were refreshed with the shared offline
  discovery guard, in isolated directories, without owner account access or lifecycle scripts.
- Tool-native guide metadata supplies the inventory. Zoom changes search, commands and changelog;
  Memo changes mail, installation, usage, commands and changelog. Zoom roadmap is unchanged and
  reviewed for the new pin; Memo has no public roadmap page. Other pins stay unchanged.

## Review inventory

The table records the affected release pages and the unchanged roadmap recheck. This is a focused
release-delta review against the previous portal reviews, not a claim that all historical changelog
entries or the entire site's unchanged prose were re-audited. Generated operation descriptions
retain the native help language; existing translated task prose, headings and reference orientation
are preserved. New technical changelog bodies follow the existing Memo English-body convention
with an explicit localized notice.

| Page and locale | Reader task | Terms and opening | Behavior evidence | Links and exports | Result and owner |
| --- | --- | --- | --- | --- | --- |
| zm/search, en | Search several names or cited passages; keep independent continuation, errors and coverage. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| zm/search, ru | Search several names or cited passages; keep independent continuation, errors and coverage. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| zm/search, es | Search several names or cited passages; keep independent continuation, errors and coverage. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| zm/commands, en | Exact released batch arguments and budgets; existing localized reference framing retained. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| zm/commands, ru | Exact released batch arguments and budgets; existing localized reference framing retained. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| zm/commands, es | Exact released batch arguments and budgets; existing localized reference framing retained. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| zm/changelog, en | New batch release; technical body kept in English with a localized language notice. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| zm/changelog, ru | New batch release; technical body kept in English with a localized language notice. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| zm/changelog, es | New batch release; technical body kept in English with a localized language notice. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| zm/roadmap, en | Existing future intake, broader preparation and archive work remain planned. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| zm/roadmap, ru | Existing future intake, broader preparation and archive work remain planned. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| zm/roadmap, es | Existing future intake, broader preparation and archive work remain planned. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/mail, en | Choose filter rules, protection and tags; import Gmail filters; bulk search and targeted attachment retry. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/mail, ru | Choose filter rules, protection and tags; import Gmail filters; bulk search and targeted attachment retry. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/mail, es | Choose filter rules, protection and tags; import Gmail filters; bulk search and targeted attachment retry. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/installation, en | Only a global install retargets the timer; normal install and update steps retained. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/installation, ru | Only a global install retargets the timer; normal install and update steps retained. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/installation, es | Only a global install retargets the timer; normal install and update steps retained. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/usage, en | Supported compact projection replaces the removed tasks.id example; envelope metadata retained. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/usage, ru | Supported compact projection replaces the removed tasks.id example; envelope metadata retained. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/usage, es | Supported compact projection replaces the removed tasks.id example; envelope metadata retained. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/commands, en | Exact released mail-rule command and option changes; reference framing retained. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/commands, ru | Exact released mail-rule command and option changes; reference framing retained. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/commands, es | Exact released mail-rule command and option changes; reference framing retained. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/changelog, en | 0.42–0.45 entries with localized headings and explicit English technical-body notice. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/changelog, ru | 0.42–0.45 entries with localized headings and explicit English technical-body notice. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |
| memo/changelog, es | 0.42–0.45 entries with localized headings and explicit English technical-body notice. | Existing opening, ending and terms retained; new prose reviewed. | Exact tag and captured command contract. | Literal preservation and original anchors checked; HTML/Markdown checks below. | Reviewed, Codex root. |

## Findings and corrections

- `translations/zm/search.*.md`: add the batch task before person context, including the exact JSON
  example, limits, conservative byte reservations, per-request statuses, zero exit on partial answers,
  malformed-input refusal, independent continuations and compact projections. References identify
  source cues; document URLs remain distinct from joining links. No model or remote read is implied.
- `docs/tasks.json`: map the released `batch` family to the existing preparation/search reader path.
- `scripts/docs-corrections.json`: retire Memo's Takeout-resume and removed `tasks.id` overrides;
  both fixes are now in native source. Retain incoming anchor aliases and still-needed corrections.
- Memo's released mail guide still says “one of three actions” before describing `protect`.
  A traceable correction in all locales now introduces the basic actions and points to protection
  and tags below. The released command contract explicitly lists all four actions. Owning repository:
  cli-memo `docs/mail.md`; source wording can be simplified in a later native docs release.
- The attachment retry description is Gmail-id-specific; it does not promise retry for IMAP or mbox.
  The global-install timer boundary is preserved in both translations.

## Validation

- Exact-release sync, complete localization with command/link preservation, roadmap/changelog gate,
  search-language check, lint and 305 unit tests passed. Lint reports three existing warnings.
- Strict documentation check: 1,329 command reference entries, zero reference gaps, zero invalid
  examples, 17 valid task mappings. Its 144 syntax/manual-review entries are a separate category;
  affected mail/installation entries are literal paths and package names, not executable commands.
- Unmapped command families are also separate: Zoom has none after mapping `batch`; Memo's existing
  `messages` and `stats` families remain unmapped. This update adds no new unmapped family.
- Mobile HTML and Markdown twins for Zoom search and Memo mail passed in all three locales,
  checking the new examples, relevant status/coverage fields and absence of horizontal overflow.
- Seven browser smoke tests, their 20% timeout-headroom guard and typecheck passed.
- Remaining before merge: PR full export/link/SEO/browser CI.
  Production deployment and public route checks follow merge. No live mailbox, meeting, model,
  keyring or owner store was accessed.
