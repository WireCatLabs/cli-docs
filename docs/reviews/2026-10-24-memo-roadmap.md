# Memo roadmap release review

This update lets readers find Memo's planned work from the global roadmap and the tool sidebar in EN, RU and
ES. Source: cli-memo v0.90.0 (6383c958), compared with v0.89.0. npm has 0.90.0 and the GitHub tag exists.

| Page/locales | Reader task | Review and evidence |
| --- | --- | --- |
| memo/roadmap EN/RU/ES | Find planned work before choosing a workaround | Read the new native page and both full translations; scope, opening, planned/current distinctions and all source links preserved. Native docs/meta.json adds the page to Project. |
| memo/commands EN/RU/ES | Inspect exact command output | Compared all changed return summaries: tasks plan/show/link, search all/messages/mail. Technical field names and counts updated verbatim in RU/ES. Syntax and examples unchanged. |
| memo/changelog EN/RU/ES | See what the release changes | New first-run questions and corrected introduction example; retained the existing policy of exact English technical entries in translated changelogs. Preserved the native empty Unreleased heading. |
| Global roadmap EN/RU/ES | Choose a tool's plans | Replaced inline links with one row per tool and added Memo. Existing URLs retained. WhatsApp launch status remains owner-dependent. |

Native installation, usage, MCP and other guide files do not differ between these tags. The runtime dependency
moves to cli-core 0.404.0; the reviewed command capture records the release's exact dependency versions.
The new roadmap's Next/Later items are future work; the changelog does not ship them. No terminology decision
was needed. Source fingerprints were accepted only after structural/link checks and prose review.

Validation commands and results are recorded in the PR. A successful localization check verifies structural
parity and fingerprints; it does not establish editorial quality or behavioral correctness. The native-page
claims remain owned by cli-memo; this update publishes its released roadmap without rewriting those claims.

Local results: sync, lint, 333 unit tests, all five released command captures and release-note validation pass.
An initial guide-version check overlapped sync and read two English Memo passages before localization applied
the existing corrections. After sync completes, the guide-version check passes; no new migration-wording fix
is needed. Those passages are identical at v0.89.0 and v0.90.0. The command-reference browser run
failed its legacy-anchor navigation in English, then lost the development server for RU/ES; its initial DOM
assertions passed for English. The production export then found a missing Memo roadmap description; added explicit EN/RU/ES metadata. The complete export now passes, including /en/docs/memo/roadmap.html. All six command-reference browser cases pass against that frozen export, preserving the 3000-element limit and legacy-anchor checks. Strict command quality: 1452 entries, zero reference gaps and invalid examples; 147 examples remain classified for manual review.
