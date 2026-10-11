# Namespace normalization

Readers should find the WireCat package name in current instructions, historical documents,
installation assets and copied requests. The owner requested scripted replacement across all
repositories, including the historical references previously retained.

The tracked-file script normalizes package scopes and migrated repository links. Credentials
and private state are excluded. Migration fixtures use a fictional source owner; unused
historical SDK dependency aliases are removed. Original search migration hashes are retained,
with the normalized copies' hashes recorded separately.

The earlier namespace-specific documentation gate is removed, as requested. Existing syntax,
localization, behavior, security and release checks remain. Existing reviewed command versions
stay pinned. Import formatting normalizes historical names before localization, so regeneration
does not restore the retired namespace. Commands and routes remain source-owned.

Shared UI and current-package fixture tests cover canonical installation commands. The full
site export and browser suite remain required before publication, followed by a default-branch
rescan and public installation verification.

Local evidence: released-source sync/localization, 275 unit tests, strict documentation checks
(915 references, no gaps or invalid examples), lint, type checking and production export pass.
All 15 affected browser cases pass across EN/RU/ES, including Request styling and legacy command
navigation. A normalization fixture preserves adjacent historical release bullets. Full deployment
and public verification remain required before declaring publication complete.
