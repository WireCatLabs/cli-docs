# Latest released docs and update automation

Reviewed published snapshots: Telegram v0.24.0 (previously v0.22.0) and MAX v0.25.0 (previously v0.24.0), confirmed by GitHub releases and npm.

## Documentation changes

Telegram now includes guided setup, a dedicated strict-search guide and migration to legacy matching, topic management, topic-addressed sends, bot history import, MCP setup/diagnostics, and messenger-specific Markdown formatting. Russian and Spanish translations preserve source headings, commands, inline literals and link destinations. All three overviews and shared installation instructions use guided setup and distinguish login from full history downloads.

MAX includes its new Markdown rules, conversation-linking skill, bot API input handling, shared speech-model directory, and send-journal pagination. Its English/Spanish guides and Russian command reference were reviewed. Preserved errata still match; superseded Telegram search text was retired. Unix protected-file permissions remain distinguished from configuration permissions and Windows ACLs.

Historical first-task examples and landing scenarios explicitly select `--language legacy` where they rely on forgiving search. The interactive playground continues to demonstrate strict queries supported by both current releases.

## Partial automation

A daily/manual GitHub workflow compares stable GitHub releases with npm and maintains one bot-owned tracking issue. Its summary lists changed public guides and review tasks; internal upstream development files are excluded. It updates an existing issue only when the report changes and closes only its marked issue when reviewed pins catch up.

`pnpm docs:updates --prepare` captures proposed released source and advances proposed pins only after GitHub/npm agreement. It leaves translation fingerprints and corrections intact. `pnpm sync --tool tg --capture-only` captures a single tool without replacing localized site pages. Fresh checkouts can localize captured sources without pre-existing output directories.

Tests cover numeric/stable release selection, publication mismatch, no-op checks, prerelease/downgrade refusal, renamed/deleted guide reporting, truncated comparisons, notification deduplication/ownership/closure, and preparation preserving review gates. Normal translation, build, link and browser checks remain required before merge and deployment.
