# Tool documentation: translation and orientation

The interface has three languages, but the tool pages currently fall back to the upstream
language. A Russian reader opening Telegram sees an English terminal reference without a clear
starting path. This work translates the full released documentation and improves orientation.

1. Give Telegram and MAX concise overview pages: what the tool is, personal account versus bot,
   platforms, a prominent agent installation path, a manual path, a first useful read, and task links.
2. Translate prose, titles, sidebar groups and link labels into English, Russian and Spanish.
   Preserve executable examples, flags, identifiers, error messages, limitations and security details.
3. Keep durable translations outside the generated content directory. Record a source fingerprint
   so release sync cannot silently reuse a translation of changed documentation. Keep original
   section anchors available when translated headings change.
4. Serve localized search, Markdown and language metadata. Validate completeness, code and inline
   literals, heading topology, source freshness, internal links and representative browser flows.
5. Record documentation issues found during translation; fix navigation and the entry pages here,
   preserve released tool facts and report upstream factual gaps rather than inventing capabilities.

The owner selected parallel Codex agents with the same model. No external translation provider
is used. The work is local until reviewed, committed, checked by remote CI and deployed.

## Completed locally

Full released guides cover Telegram v0.22.0 and MAX v0.23.0 in all three languages, including command
references and complete release history. Six overview pages provide an agent/manual starting path,
first useful read and task-oriented guide links. All 65 translation overlays have reviewed per-locale
fingerprints; original anchors survive Markdown compilation and translated Markdown/search retain
the selected language. Verified source errata are maintained separately with exact-match checks.

The landing now orders benefits, Telegram/MAX, reasons and the short daily timeline after the demo.
The timeline uses 08:00, 11:00, 15:00 and 19:00 in all three languages.

Local validation is recorded in `docs/reviews/2026-10-03-portal-validation.md`. No commit, remote CI
run or production deployment has been performed for this work.
