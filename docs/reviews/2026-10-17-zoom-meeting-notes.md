# Zoom preparation meeting-note review

Reviewer: Codex root, 17 October 2026. The branch starts at
`95b2c55768ae8d23db11a2015142e3f8f3c446fd`, preserving the other reviewed tool pins.

## Reader result and source scope

Readers preparing an upcoming series can recognize owner notes about the included earlier calls,
alongside notes about explicitly linked people and confirmed global projects. A shared project
alone cannot include a note primarily about another meeting. The existing series-ID, permission,
history, read-only and incomplete-coverage boundaries remain visible. Memo still owns note writes.

Core [PR 1385](https://github.com/WireCatLabs/cli-core/pull/1385), merged at
`274802fa803c7c0e625dbf40b7897464a64d8208`, implements this in the domain port, preparation service,
SQLite adapter and shared CLI/MCP schema. Its 67 focused tests pass after rebasing. Registry Core 0.306.0 is published from
`d88926cb59e476516df151dac90f42db0df899f5`; tag, CI artifact and registry bytes/SRI match.
Its release passes 4,763 tests with four existing skips, security and consumer parity. Tests also
cover a fictional second provider and the old custom-host response shape. No store migration,
provider dependency, note database or model was added.

The native notes selection becomes `owner-written-meeting/person/project-notes`; items add a
nullable `meeting` reference. This caller-visible change belongs in the changelog. Legacy custom
hosts that omit the extended selection and field retain their old shape. Existing notes carry
references, revisions and update times; preparation does not accept them as facts.

## Changed-page review

The usage, MCP, roadmap and shared Meetings pages were read in full in all three locales. Prompts retain the same
requested result and read-only boundary. Commands, heading structure and incoming anchors are
preserved. Historical changelog entries retain their previous review; the new entry is reviewed
separately and will be compared to the captured release.

| Page and locale | Reader task | Terms and opening | Behavior evidence | Links and exports | Result and owner |
| --- | --- | --- | --- | --- | --- |
| usage, en | Prepare with earlier call notes. | Existing task opening; saved comments remain distinct from accepted facts. | Core selected-anchor/account tests and Zoom consumer proof. | Existing preparation anchor, Memo and schedule paths preserved. | Prose reviewed, Codex root. |
| usage, ru | Подготовиться с заметками о созвонах. | Сохранённые комментарии отделены от принятых фактов. | Те же границы профиля и включённых встреч. | Команды и ссылки сохранены. | Prose reviewed, Codex root. |
| usage, es | Preparar con notas de llamadas anteriores. | Comentarios guardados separados de hechos aceptados. | Mismos límites de perfil y llamadas incluidas. | Órdenes y enlaces conservados. | Prose reviewed, Codex root. |
| mcp, en | Interpret preparation note fields. | Existing connection explanation retained. | Shared schema, extended selection and nullable meeting reference. | Optional tool and usage paths preserved. | Prose reviewed, Codex root. |
| mcp, ru | Прочитать заметки в ответе MCP. | Подключение и выбор аккаунта сохранены. | Та же выборка, nullable-ссылка и ограничение основного предмета. | Ссылки сохранены. | Prose reviewed, Codex root. |
| mcp, es | Interpretar notas en MCP. | Conexión y cuenta elegida conservadas. | Misma selección, referencia nullable y límite del sujeto principal. | Enlaces conservados. | Prose reviewed, Codex root. |
| roadmap, en | Separate delivered context from future intake. | Existing capability opening retained. | Meeting-note selection delivered by shared Core service. | Usage/search/provider links retained. | Prose reviewed, Codex root. |
| roadmap, ru | Отличить доступный контекст от планов. | Текущие возможности и планы разделены. | Заметки включённых созвонов, без автоматических связей. | Ссылки сохранены. | Prose reviewed, Codex root. |
| roadmap, es | Distinguir contexto disponible y planes. | Capacidades actuales separadas de planes. | Notas de llamadas incluidas, sin asociaciones inferidas. | Enlaces conservados. | Prose reviewed, Codex root. |
| shared Meetings, en | Combine sources and prepare a call. | Existing cross-source task opening retained. | Included call notes; meeting primary subject needs an included same-account anchor. | Existing `/docs/zoom` address and all headings retained. | Prose reviewed, Codex root. |
| shared Meetings, ru | Сопоставить источники и подготовиться. | Сценарий и границы записей сохранены. | Включённые созвоны; одного проекта недостаточно. | Адрес и заголовки сохранены. | Prose reviewed, Codex root. |
| shared Meetings, es | Combinar fuentes y preparar una llamada. | Tarea y límites de escritura conservados. | Llamadas incluidas; compartir proyecto no basta. | Dirección y encabezados conservados. | Prose reviewed, Codex root. |
| changelog, en | Understand the new selection and field. | New Added and Changed entries; older history retained. | Shared Core behavior and legacy custom-host compatibility. | Release heading and existing history retained. | New entry reviewed, Codex root. |
| changelog, ru | Понять новую выборку и поле. | Возможность и совместимость разделены. | Та же nullable-ссылка и прежние хранилища. | История сохранена. | New entry reviewed, Codex root. |
| changelog, es | Entender selección y campo nuevos. | Capacidad y compatibilidad separadas. | Misma referencia nullable y almacenes anteriores. | Historial conservado. | New entry reviewed, Codex root. |

## Validation and publication

Zoom adopts exact registry Core 0.306.0/Base 0.40.0 in PR 133, merged at
`b19b04ee65dce8151ea006b4ebb18670c5199c14`. All 481 consumer tests pass (98.44% lines, 93.79%
branches), as do types/build, docs, generated commands, five offline contracts and the installed
preparation helper. The new regression fails as expected against registry Core 0.304.0. Command
lint retains 26 baseline findings, zero new or overridden; one existing Biome warning remains.

The 0.22.0 release preparation is PR 134 at `11ceb0fddc39e3f70d83d754e34f0497177f8ef8`.
The published Zoom registry tarball and annotated tag match the checked source and validated
artifact (SHA-256 `1c6e0df68697ff22c9479a006f134c8f657ecd25bd73807bc45a531df47bce46`).
All four Linux/Windows Node 22.16/24.19 installed-platform jobs pass, including direct-note and
meeting-scope proofs. The global CLI and both managed skills are verified.

Source sync, all eight reviewed translation structures/fingerprints, five exact pinned offline
command captures, release-note checks, 306 unit tests, lint and types pass. Strict content checks
report 1,333 references, zero gaps/invalid examples, 144 separately identified manual cases and
17 task mappings. Three existing portal lint warnings remain. No UI, navigation, test, workflow,
timeout or performance guard changes are included. The existing full export/browser gates run in
CI. Production and live-route verification follow the merge; this record does not claim they
have run.

The first local smoke attempt hit the unchanged 60-second dev-server startup deadline while
compiling the documentation route, before any tests ran. Its report and log are retained.
The bounded retry passed all seven smoke cases using the existing compiler cache, without changing
a test or timeout. Existing Sidebar key warnings remain visible in the retained logs.
