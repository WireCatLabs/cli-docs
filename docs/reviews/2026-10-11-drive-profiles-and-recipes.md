# Drive profiles, installation and task recipes

Reader brief: someone connecting their first Google account should reach browser consent without
having to guess Google Cloud screens; someone using an imported folder should know which content
is searchable, what is saved and which commands perform remote versus local operations.

## Reviewed bases and scope

- Source clean worktree: Drive main `3ada367`, branch `feat/explicit-profiles-and-guides`.
- Portal clean worktree: cli-docs main `8d92d7c`, branch `docs/drive-profile-recipes`.
- Preserve the owner's root checkout changes; native Drive guides own the facts, portal imports
  the immutable source commit in `tools.json`. Telegram/MAX runtime pins remain unchanged.
- Existing nine-page Drive reader path remains; improve existing installation, usage, search,
  recipes and generated commands rather than adding overlapping pages.

## Reader review

| Pages/locales | Situation and result | Review |
| --- | --- | --- |
| Installation EN/RU/ES | Install, choose a profile, configure a Desktop client and approve browser consent | Direct console links; current UI labels; separate shared-app user path from owner setup; actual JSON download steps; first searchable folder and recovery |
| Usage EN/RU/ES | Choose a live read, import, cached read or Markdown export | Action/storage comparison; supported file-type table; pending sync and pagination; disk retention and current discard/upload limits |
| Search EN/RU/ES | Find evidence in the selected account's local corpus | Explicit profiles; tags; exact versus optional meaning; offline reads; coverage and meaning-skipped checks |
| Recipes EN/RU/ES | Complete typical tasks without assembling reference fragments | Import, meeting brief, follow-ups, people/projects, reviewed memories, history, export, native Doc creation and MCP |
| Configuration/security/troubleshooting EN/RU/ES | Control storage/access and recover setup | Explicit selection; unchanged credential handling; default grant boundaries; missing-profile and Cloud-console recovery |
| Commands EN/RU/ES | Look up exact operations and options | Owning generator updated; provider operation text retains CLI help language; complete command contract remains visible |

Code fences, inline literals and link destinations match reviewed source translations. Original
English heading aliases are retained by localization. Native usage/recipes preserve incoming
`import-a-folder`, `add-local-context` and `prepare-for-a-project-meeting` anchors explicitly.

## Behavior evidence

- `src/program.ts`: named profile required in root pre-action before store/provider/account actions;
  legacy `DRIVE_PROFILE` and saved `defaultProfile` ignored; conflicting selectors rejected.
- `src/config.ts`: shared MAX `usableProfileName`; existing shared profile lifting and reserved-word
  helpers retained. Help/version/commands/schema/completion/API catalog remain account-independent.
- `src/profiles.test.ts`: two-account fixture, omitted-profile defaults/environment refusal,
  provider/store spies untouched, MAX-compatible names, unsafe names, ambiguity and invalid-config
  discovery. Synthetic profiles only. 108 tests and coverage gates pass locally.
- Executable contracts include missing-profile errors and explicit-profile MCP; installed-package
  smoke still checks configuration-free help/discovery. Google browser consent not live-tested.
- `src/google.ts`, `src/documents.ts`, `src/sync.ts`, `src/state.ts`, `src/store.ts`: supported
  Docs/Markdown/TXT, recursive scope, skipped formats, retained snapshots/index, source removals.
  No arbitrary binary transfer or index-and-discard mode is claimed.
- `src/login.ts`, `src/tokens.ts`, `src/remote-commands.ts`: default read scope; optional write,
  activity and apps grants; history/comments remain live; shared OAuth identity still requires
  owner-supplied client data. Existing code does not bundle an application identity.

## External setup evidence

Checked official Google guides on 11 October 2026: [Desktop client creation](https://developers.google.com/workspace/guides/create-credentials#desktop-app),
[consent setup](https://developers.google.com/workspace/guides/configure-oauth-consent),
[Drive scopes](https://developers.google.com/workspace/drive/api/guides/api-specific-auth),
[Docs scopes](https://developers.google.com/workspace/docs/api/auth) and
[Activity setup](https://developers.google.com/workspace/drive/activity/v2/quickstart/nodejs).
Drive/Docs APIs cover ingestion; activity events additionally need Drive Activity API and its scope.
API enablement, consent configuration, client JSON and user authorization are distinct steps.

## Follow-up boundaries

- Owner has created a client but its local file path has not arrived. Wire up and validate the
  shared Desktop application before offering JSON-free sign-in as an available default.
- Binary upload/download and ephemeral ingestion require implementation before new recipes.
  Snapshot pruning must preserve cached reads, exports and source-backed memory evidence.
- First-class provider folder nodes/tree remain the shared-store follow-up from the earlier review.
- Inspected MAX/shared parser still contains an implicit default account. Flagged to owner;
  Drive follows the stricter cross-CLI requirement rather than copying that fallback.

## Validation results

- Native source: 108 tests; coverage thresholds; typecheck, lint, Markdown, generated freshness,
  executable/MCP contracts, prior-store upgrades and installed Node/Bun acceptance. Full source
  CI at `af2cb8b` and `2f095d2` passed. Final help-only follow-up is covered by the same test suite.
- Portal: 291 tests; typecheck; lint; standards; release-note gate; reviewed EN/RU/ES localization.
  Strict contract report: 1,065 references, zero gaps, zero invalid examples, 126 separately
  reported manual/syntax examples and 11 task mappings.
- Local browsers: 12 existing Drive cases passed, then the three new cache/export cases passed
  after correcting a test-only expectation about stripped HTML anchors in Markdown. All seven
  existing browser smoke cases passed. HTML retains incoming anchor aliases; Markdown preserves
  the workflow and executable commands. Full production export/link/browser checks belong to CI.
