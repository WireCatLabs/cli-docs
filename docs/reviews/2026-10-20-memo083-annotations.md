# Memo selected annotation workflow review

Status: published Memo0.83 is independently verified and adopted locally; portal deployment and
production verification remain pending.

## Reader outcome and source

The reader can retain selected aliases, facts and generic links, inspect explicit destination
bindings and understand the owner-only restore boundary. The format does not include notes,
specialized meeting memberships, tasks, memories, labels or findings and cannot justify a live reset.

- Native implementation and guides: [Memo #356](https://github.com/WireCatLabs/cli-memo/pull/356),
  feature source31650f12238a149a83896cdc94653da09c2c2429; released source
  5a2a5b2b594bbf9454ac27e1eb43721d036f8c9e, release run39454675571.
- Shared runtime: published Core0.374 and Base0.47.4; immutable registry and validated artifacts match.
- [Independent installed SDK reproduction](https://github.com/WireCatLabs/cli-testing/tree/91787332f0943f6eba9657e312abf4088ae0d2df/performance/projects/restore)
  verifies different destination IDs, source/preview byte preservation, historical proposed state,
  stale preview refusal and repeat refusal. This is not an extraction-quality score.
- Memo's605 tests pass under coverage. Independent installed Memo0.83 CLI and actual stdio MCP
  acceptance pass with the published dependency graph. The npm/validated Memo tarballs match SHA-256
  8df6a8f5c2d290c32e88a21b65f92f30f4bfa29446f3f033164078912d728852.

## Prose and reference review

The complete current recipe, MCP and security guides were read in English, Russian and Spanish.
Changed command reference sections and the person-reference option were checked against the native
generated command tree. The existing technical reference and historical changelog remain in English
where the localized pages already explain that choice; task instructions are localized.

| Page | Locales | Review result |
| --- | --- | --- |
| recipes | EN/RU/ES | Explains the outcome, prepared target, explicit references, omitted facets, private new file, exact check fingerprint, rollback and repeat refusal; links back to project review |
| MCP | EN/RU/ES | Exactly two reading tools, no restore tool; bounded reads and audit entry remain distinct; local example requests translated |
| security | EN/RU/ES | Note exports and annotation exports described separately; restore preserves historical state and does not newly confirm proposals |
| commands | EN/RU/ES | Three leaves, budget value names, required target/bindings/fingerprint, file effects and JSON projections match the command tree |
| changelog | EN/RU/ES | Technical source notes retained; no historical section rewritten |

Editorial corrections include an obsolete claim that only note export writes files, untranslated
MCP example requests, inconsistent Russian words for findings and unclear wording for omitted
meeting-project memberships. Executable fences, reference values and incoming anchors are preserved.
The projects task mapping now includes the existing recipe page.

The native release also includes earlier permission-guide corrections. Retire the five fixed guide
overrides only when their content is included in the adopted release; verify index, how-it-works,
memories and usage against the already deployed corrections rather than silently dropping them.

## Validation and remaining delivery

- Published0.83 source and validated/registry bytes match; independent CLI and actual stdio MCP checks pass.
- Five native guide overrides are retired. The four unchanged guide/README bodies match their earlier
  fixed source exactly; security includes the native export correction and retains the permission guidance.
- All five released command contracts were freshly captured with network blocked. Strict documentation
  validation reports1415 reference entries, zero gaps and zero invalid examples;144 syntax illustrations
  remain marked for manual review. The projects task mapping includes the recipe.
- Lint passes with the same three existing warnings, typechecking passes and325 unit cases pass.
- Source-preview mobile checks pass15 HTML pages and15 Markdown twins across EN/RU/ES at390px,
  including the new leaves/tools, selected-annotation anchor, old security anchor and configuration links.
  The preview source is the exact released commit. The existing Sidebar React key warning remains;
  no page errors or horizontal overflow were observed. The owned development server was stopped.
- PR checks, deployment and verification of the changed public routes remain pending.

No UI behavior or route is changed by this task. Reader verification supplements the existing shared
browser coverage rather than adding repeated permanent layout cases.
