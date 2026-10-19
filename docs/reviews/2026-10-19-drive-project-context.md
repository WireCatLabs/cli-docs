# Drive project-context guide review

## Source and scope

Prepared from site main `3efbcb4897402e70f4f75e5b91d8be1960c91083` in an isolated worktree.
The Drive runtime remains v0.18.0 and Memo remains v0.73.0. The three Drive guide overrides select
immutable native source `c86e077a5ffac187ce079572a844318bc8b6a663`
([native PR #139](https://github.com/WireCatLabs/drive-cli/pull/139)). Against Drive v0.18.0,
the guide delta is exactly the new project-context recipe and its two incoming links: 74 added lines.
No command reference, runtime pin, sidebar or OAuth setting changes.

## Behavioral comparison and publication hold

The existing [synthetic acceptance proof](https://github.com/WireCatLabs/cli-testing/tree/dc041b98/performance/projects/drive-context)
passed ten checks with registry Drive 0.17.1 / Core 0.331.0 and Memo 0.75.0 / Core 0.351.0.
It exercises Drive's public source-injection API with its real importer/index and actual Memo CLI
and stdio MCP processes. The original proof and recorded result were preserved unchanged.

A temporary copy changed only the expected package-version assertions to the site's exact reviewed
pair, Drive 0.18.0 and Memo 0.73.0 (both Core 0.348.0). On Node v24.19.0, with a fresh synthetic store
and the same external-I/O guard, it failed the first gathering assertion: one expected document,
zero returned. Source scope resolved to the registered document folder; `unread_sources` was empty.
The sole read unit reported `state: done`, `issue: index-pending`, one page and zero hydrated bytes.
A diagnostic rerun serialized that first synthetic result to explain the failure. No later check
is counted as passing on this pair.

| Registry artifact | Version | npm integrity |
| --- | --- | --- |
| Drive | 0.18.0 | `sha512-BUIp199Diw9DFMpxsaWoM6js/KUc25IICdCvahh/VKzC+I8hjL+oB+Pz1cwkBkj3WzfB9d8bJnRNpKq06PiUpA==` |
| Memo | 0.73.0 | `sha512-OsibQc+C8Nf9s2oFtMz3JfuBTWC9JaucNx+lmKN2r6GEzfdlUEtqljGM1AUAsGBrSzZv74/yvU8d1wruFGTmeA==` |

The temporary comparison summary is `/var/tmp/dm-reviewed-comparison.json`; the installed packages
and npm lock are in `/var/tmp/dm-reviewed-install-xM2OSh/packages`. Reproduce from the preserved
runner using those exact registry versions and updating only its two version assertions. No live
Google conversion, OAuth, owner account, memory invalidation or proposal creation was tested.

**Hold publication:** the documented immediate sync-to-gather workflow is not validated on the
currently reviewed Memo release. Keep this change a draft until Memo's separately owned runtime
review advances to a release with index catch-up and the same synthetic scenario passes against
the resulting exact reviewed pair. Passing syntax or localization checks cannot clear that hold.
The guide text is not weakened or rewritten to pretend automatic catch-up works on Memo 0.73.0.

## Editorial review

The changed English sections and all six affected translated pages were read, including their
unchanged openings, endings and surrounding tasks. Existing unrelated recipes were retained;
their capabilities are not newly certified by this scoped review.

| Page/locales | Reader result and reviewed boundaries | Result |
| --- | --- | --- |
| usage / en, ru, es | Imports become shared local sources; connected-app reads alone do not import | Reviewed |
| search / en, ru, es | Follow the recipe with explicit Drive scope; retain dates/links and separate relationships | Reviewed |
| recipes / en, ru, es | Choose narrow roots, bound content reads, inspect pending/skipped work, gather within a date window | Reviewed; runtime hold above |

Russian uses «вы» in instructions and «основания» for source evidence; Spanish addresses the reader
as «tú». New agent requests are localized. Command fences, inline literals, URLs and heading depth
match the captured native source. The new recipe introduces one heading in both translations;
localization retains its original English anchor. No existing incoming anchors are removed.
Translation fingerprints were accepted only after reading the prose and passing the structural
comparison; they record translation review, not runtime compatibility approval.

## Validation

The exact reviewed command contracts were refreshed offline. Full source sync, six translation
checks with current fingerprints, strict documentation quality, release-note review, search-language
freshness and typechecking pass. Strict quality reports 1,406 references, zero reference gaps,
zero invalid examples, 144 examples requiring manual review and 19 task mappings.

The sync/localization unit suites pass 20 tests. Nine existing localized Drive browser cases pass
on the development server. An additional temporary browser check verifies the new recipe anchor,
both Memo commands, the localized next link, mobile width and Markdown twins in all three languages.
The preview server was stopped after the checks. No full production export was run locally.

Repository lint passes with three existing warnings in unrelated CSS/search/reader-guide files.
Markdownlint's scoped run reports zero inspected files from this nested worktree, so it is not
claimed as prose validation. Explicit rumdl checks pass for the six raw translations with only
the anchor rule disabled: their English heading aliases are generated during localization.
The generated Russian/Spanish recipes and this review pass rumdl with that rule enabled, and
the browser check confirms the new anchor. No lint baseline or assertion was changed.
