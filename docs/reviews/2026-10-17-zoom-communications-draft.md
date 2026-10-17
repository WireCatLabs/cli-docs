# Zoom communications translation draft

This branch prepares RU/ES documentation for the unreleased host feature in Zoom PR156. It must
not merge or change a public release pin until the matching package is published and reviewed.

## Source and completed preparation

Base: portal main `41f941a7947d6e1d4b58b42cff93147f1ea41dd2`. Source capture uses Zoom
`76b070e6795fd35da3f266b0f7c6d76f18a4b93c` with the documented full-SHA `--capture-only` workflow.
The reviewed runtime remains Zoom0.23.2. No `tools.json`, reviewed contract or translation
fingerprint has changed. Generated/public output is not committed.

Twelve draft translations cover configuration, usage, MCP, roadmap, changelog and commands in
Russian and Spanish. All twelve pass structural/inline-code/executable-fence checks against the
captured source. Fingerprints intentionally remain stale. Ordinary-language agent requests are
translated; literal commands, JSON examples, field names and existing incoming anchors remain.

## Required completion after publication

1. Finish the separate registry Core/Base adoption and feature delivery in Zoom. Capture the actual
   final released source, not this candidate snapshot.
2. Review the generated source flag label: the current candidate still has `<id[=cursor]>`; Core's
   released metadata fix uses `<id=cursor>`. Update both translated references from final source.
3. Translate the final dated changelog, including the actual dependency-adoption entry. The pending
   Added entry here is a draft, not a prediction of the next release number.
4. Read every changed prose block in both locales again. Check explicit whole-account/folder scope,
   profile-local grants, requested-only metadata resolution, restart after revocation, literal-query
   and time bounds, incomplete indexes, citations, projection and frozen-window continuation.
5. Refresh exact npm contracts, record roadmap review and accept translation fingerprints only
   after that review. Then sync and run strict docs, relevant release/localization tests, types,
   applicable browser/export checks and full required CI. Preserve existing layout/home coverage.

No live account test, AI interpretation evaluation, final-release review or feature availability is
claimed by these draft checks. The release pin and already-published docs stay on their reviewed pair.
