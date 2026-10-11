# Drive documentation and shared organization review

Base: cli-docs main `4b4b643`. Drive runtime baseline: `e6e3298`. The owner explicitly requested
Drive next to Telegram/MAX, value-first installation and workflows, and shared organization guidance.

Source distribution is intentional: Drive has no npm release or registered bundled application.
The new source mode requires a full immutable commit; npm tools retain exact release checks.
No fake release is created. Reviewed source installation must include an offline command capture.

Reviewed guide/runtime source: `884162b4f1399d21dbd51c61ba68f2443eb86b7e`, merged via
[Drive PR #4](https://github.com/WireCatLabs/drive-cli/pull/4) as `4f6329c`.
The immutable source pin is retained rather than replacing it with a mutable branch or release label.

Reader path: Drive overview → source installation + Desktop consent → first folder sync → search
and organization → focused recipes. Nine pages include the generated command reference, three
concise reference/recovery pages and three task guides; no separate API tutorial per endpoint.

Shared organize page owns the concepts and cross-tool example; existing Memo/people pages remain
the detailed homes for local notes/tags and identity linking. Drive has its own database by default.
Existing targets must share the selected store; document linking does not create tasks/projects.

## Source evidence

- Drive `src/program.ts`, `knowledge-commands.ts`: exact commands, scopes and arguments.
- Drive `src/google.ts`, `documents.ts`, `sync.ts`: content support, tabs, omissions, scope/retries.
- Drive `src/store.ts`, `state.ts`, `model.ts`: one account collection in SQLite, ancestry in JSON.
- Drive `src/knowledge.ts`, `extraction.ts`: known identities, explicit links, proposed/stale memories.
- cli-messaging pinned 0.231.0 public notes/store APIs: no provider folder-node hierarchy API.
- Existing Memo and people reader pages: shared source references and local labels.
- Google credential/consent documentation checked 2026-10-11; source-install client setup matches
  current Desktop flow. No credentials or live account/model actions used for this documentation.

## Folder follow-up design

Folder ancestry is durable today, but is not first-class navigable data in the shared store.
Add a provider-neutral source collection/node API in cli-messaging before implementing a second
database inside Drive. Nodes should have stable provider/account/source IDs, display name,
kind, parent edges, source URL, scope/deleted/unavailable status and last-seen revision.
Documents should link to nodes without changing their existing `document:` references.

Expose read-only children/tree/path APIs and common CLI navigation; allow notes/tags/links to
folder nodes through shared reference resolution. Use IDs for identity and names only for display.
Handle renamed/moved folders, duplicate names, shared drives, shortcuts, cycles, partial scans and
revoked access. Commit graph changes only with a successful discovery batch; failed syncs must not
erase known ancestry. Backfill from each profile's existing state idempotently.

Acceptance: shared migration and old-store upgrade fixtures, two-account isolation, cycle/shortcut
bounds, rename/move preserving document tags/links, subtree scope exits, offline tree navigation
and common schema contracts. Folder tags should have an explicitly chosen inheritance model.
Do not represent remote folders as fake documents or title-derived note paths.

## Review checklist

Review every new Drive page and locale, shared organize page and onboarding cross-links.
Verify literal/code preservation, expected results, real prerequisites, decorative sidebar icons,
Markdown twins, source/edit links, command examples and navigation. Record the actual check
results after implementation; syntax tests do not establish live Google fidelity.

## Completed review and checks

Reviewer: Codex. Fully read the nine native pages and their EN/RU/ES portal forms, the shared
organization page in all three locales, and changed overview/installation/Memo cross-links.
Introductions orient readers; source installation and Desktop-client prerequisites are explicit.
Shared-store and folder-navigation limits are stated beside the relevant task. The generated
reference retains native English operation help, with localized title, global/exit sections and
an explanation of that language boundary. It does not invent translated CLI tokens.

- Source global-option discovery remains backward-compatible with `items`; the portal captures
  the root contract offline without sockets, account state or credentials.
- Source guide structure, Markdown and generation freshness pass. The real shared-store tagged
  search fixture excludes untagged and other-account documents. Full Drive CI passed for the pin:
  [run 38139595895](https://github.com/WireCatLabs/drive-cli/actions/runs/38139595895).
- Portal: 277 unit tests, typecheck, lint, search asset freshness and release-note checks pass.
- Strict documentation checks: 1,065 reference entries, zero reference gaps, zero invalid examples,
  and all 11 task mappings resolve. Existing 126 syntax/manual-review examples remain reported;
  that category is not represented as runtime success.
- Reviewed translation checks preserve code fences, inline literals, heading structure and links.
- Twelve browser cases pass: three locales each for overview/navigation, source installation,
  tagged search/Markdown export and mobile shared-organization links.
- The existing seven-case onboarding/browser smoke suite passes. The documented global source
  installation was also exercised in a temporary npm prefix, and its `drive --help` works.

No Google credentials or live Google/model actions were needed for these checks. Runtime limits
and future provider-folder database work remain in their owning source/design, not fictional commands.

The full-history security workflow flagged the pre-existing PostHog browser project token in
commit `6331ced`, `site.config.json:11`. Its project-token type was verified without logging the
value; [PostHog documents that type as public](https://posthog.com/docs/privacy#is-it-ok-for-my-api-key-to-be-exposed-and-public).
An exact historical fingerprint exemption addresses this false positive; no rule, path or new
credential is generally excluded. The new-commit scan had zero findings before the exemption.
