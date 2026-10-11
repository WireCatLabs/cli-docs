# Drive reader guide review

Bases: Drive `53f6148`, portal `365a94c`. Native owning sources were revised through Drive PR #15;
the portal's old source pin `f07ad613` explains why source build instructions remained public.
The new pin must be the verified npm release, not an unreviewed main checkout. Owner authorized
first npm publication and supplied publisher authentication through an isolated npm configuration.
No credential contents were read or logged; account tests use synthetic sources.

## Corresponding MAX pages and adopted patterns

Reviewed source: MAX `v0.45.4`, matching the portal, rather than newer local main. Inspected each
corresponding guide's opening, task structure and the sections relevant to Drive, plus its archive
explanation. The large generated reference remains governed by the shared generator and syntax
contract; it is not hand-edited or presented as a prose corpus review of every API description.

| Drive page | MAX counterpart and useful pattern | Drive-specific evidence |
| --- | --- | --- |
| index | index: capabilities first, task groups, first result | Google/remote command tree; sync/state/store |
| installation | installation: npm/agent first, prerequisites, check, update/remove | Compiled package acceptance; Desktop client JSON/browser OAuth |
| usage | usage and archive: live versus saved, coverage, actions and result | metadataOf, state snapshots and resumable sync |
| search | search: choose a query, check evidence and coverage, empty-result recovery | Shared note search and account-scoped folder filter |
| recipes | recipes: request → commands → expected result; distinguish remote/local changes | Friendly file methods request fields='*'; cached show/context; knowledge commands |
| configuration | configuration: definitions, locations, saved choices, env/flags, priorities | ConfigSchema, resolvePaths, policySettings, resolveAISettings |
| commands | commands: generated complete reference, global flags and exit contract | Owning generator unchanged; freshness/executable/MCP contracts |
| troubleshooting | troubleshooting: symptom, recovery step and success check | Profile/OAuth/model/pending-source errors and write journal |
| security | security: where data lives, what leaves the computer, disconnect/delete distinction | Keyring helper, index/snapshots, provider gateway and command policies |
| changelog | changelog: released user capabilities, rather than development chronology | First package release candidate and its validated artifact |

## Important boundaries retained

- Normal sync saves selected file metadata and source content; it is not an automatic complete
  backup of every Google API response. Live file get/list request all available fields; the recipe
  saves that JSON for offline agent use, separately from the searchable database.
- Folder IDs/parents are persisted in sync state. There is no database-backed folder tree browser.
- Comments, permissions, revisions and activity remain live reads, not indexed offline history.
- Read-only mode also blocks local mutations. Specific remote command permissions let sync and
  notes remain available. A cloud agent is not made offline by the CLI's `--offline` flag.
- Shared Google app publication and local user login are separate. Desktop client configuration
  is distinct from Google API keys or service accounts. Custom clients remain supported.

## Page and locale read-through

Every changed page was read for opening, result, terms, supported claims, links and literal examples.
Fenced examples stay executable and identical across translations under the existing contract.
Incoming native anchors were retained; new sections receive original-language anchor aliases.

| Page | Locale | Outcome |
| --- | --- | --- |
| index | en | Capabilities, local data, boundaries and first result |
| index | ru | Equivalent value and metadata boundaries |
| index | es | Equivalent value and metadata boundaries |
| installation | en | npm and agent path; account consent and owner/client setup |
| installation | ru | Same installation and owner/user distinction |
| installation | es | Same installation and owner/user distinction |
| usage | en | Import, cached text/metadata, folder ancestry and retention |
| usage | ru | Same live/offline and storage meanings |
| usage | es | Same live/offline and storage meanings |
| search | en | Query choices, labels, meaning and coverage |
| search | ru | Same query and evidence interpretation |
| search | es | Same query and evidence interpretation |
| recipes | en | Offline briefs, full metadata JSON, tags/links/memories and remote edits |
| recipes | ru | All task additions translated; literal commands retained |
| recipes | es | All task additions translated; literal commands retained |
| configuration | en | Four distinct tables: locations, saved settings, environment, flags |
| configuration | ru | Settings versus process/invocation controls preserved |
| configuration | es | Settings versus process/invocation controls preserved |
| commands | en | Existing generated opening and source contract retained |
| commands | ru | Existing generated reference translation retained |
| commands | es | Existing generated reference translation retained |
| troubleshooting | en | Installation, sign-in, scope, offline and unknown-write recovery |
| troubleshooting | ru | Same recovery tasks and corrected npm PATH advice |
| troubleshooting | es | Same recovery tasks and corrected npm PATH advice |
| security | en | Permissions, storage, network and deletion boundaries |
| security | ru | Same permissions and data handling |
| security | es | Same permissions and data handling |
| changelog | en | Initial release capabilities |
| changelog | ru | Equivalent initial release notes |
| changelog | es | Equivalent initial release notes |

Privacy/terms use shared, server-rendered two-item navigation with active page state and decorative
icons in EN/RU/ES. Markdown twins use the same maintained policy data and are discoverable in
llms.txt. Existing policy URLs, content and footer links remain.

## Verification

Source shared-app follow-up: 111 tests with coverage gates (88.16% lines, 85.85% statements); lint/typecheck/standards; generation; eight executable/MCP
contracts; five store upgrades; no-leak checks; Node/Bun packed acceptance. Earlier docs-only release dry run
38178410542 passed. Its publication and validated-package artifacts matched byte for byte; this
artifact was not published and was superseded by the shared-app candidate:
SHA-256 59b8296c4a5af134769831a0fbb9a4c2ec3671733c4a3094408068df4be8baa0.

Portal: translation structure/literals/links checked against captured owning sources; add targeted
reader paths for npm installation, settings separation, offline/metadata Markdown and legal sidebar.
Twenty-four targeted Drive/legal browser cases and seven local smoke cases passed. Lint, typecheck
and 297 unit tests passed before the small shared-app text update; relevant checks are repeated
for the final pin. Strict documentation contracts/checks, unit/type/lint checks and local browser smoke. Full
production export, links, SEO and browser coverage remain CI publication gates. Do not claim the
npm/site publication complete until registry and public-route checks pass.

## Shared application follow-up

[Source PR #16](https://github.com/WireCatLabs/drive-cli/pull/16) includes WireCat's public Desktop
OAuth identity and retains explicit custom file/environment overrides. Google treats installed
clients as public clients; account tokens are not part of the application identity. The owner
approved GitHub push-protection exceptions for these two app identifiers. No original client
JSON or user token is committed. Tests cover custom precedence, missing/invalid files, orphaned
custom secrets, independent returned objects and separate private credential persistence.

[Updated full release validation](https://github.com/WireCatLabs/drive-cli/actions/runs/38180975170)
passed all validation/security jobs. Publication and validated tarballs match byte for byte;
SHA-256 `1f01523effacff0407477bd85999b39f878dc0ea86438d3e8da9bc3f78c6962c`.
Source merge: `5139aefaaddf4b0a9ff241b46e7cc5fe3d326165`.

Manual browser sign-in with WireCat's included application succeeded and stored the user's
refresh credentials in the OS keyring. Only the sanitized profile/storage success was observed;
no account token or credential value was printed. This validates account connection, not native
Docs conversion, tab fidelity or ingestion, which still require a user-selected fixture folder.
