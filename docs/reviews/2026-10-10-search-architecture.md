# Search architecture review

Reader: someone debugging or understanding search, who wants a short account of what is
indexed, how matches rank and how results connect to their sources. Everyday tasks remain
in the existing Searching guide; this change adds no duplicate business page.

Base: cli-docs main `988b8e9`. Shared EN/RU/ES pages and the existing data-driven diagrams
are owned by the portal. Generated messenger guides and reviewed release pins are unchanged.

| Page and locale | Reader task | Terms and opening | Behavior evidence | Links and exports | Result and owner |
| --- | --- | --- | --- | --- | --- |
| search-architecture, en | Understand searchable content, preparation and matching paths | Full prose review; broad opening keeps message examples; index, stemming, trigrams, substring and BM25 explained | Released shared sources below; direct replies separated from built conversations | Existing headings retained; practical Search guide linked; adjacent prose carries diagram meaning | Reviewed by Codex |
| search-architecture, ru | Same task | Full prose review; same scope and matching distinctions | Same evidence | Same structure, commands and destinations | Reviewed by Codex |
| search-architecture, es | Same task | Full prose review; same scope and matching distinctions | Same evidence | Original Elige la vía adecuada anchor retained; same structure and destinations | Reviewed by Codex |
| Localized diagrams | Understand indexing before query execution | Short labels; original renderer and captions retained | Words/stems, spelling candidates and raw substring structures are distinct; vectors are optional | Mobile/desktop and Markdown reader checks below | Reviewed by Codex |

## Source evidence

cli-messaging `v0.216.0`, used by the portal's reviewed tg/MAX releases:

- `src/services/search-all.ts`: messages, mail and notes searched separately; rank fusion and
  skipped-source reporting. It does not create a universal message index.
- `src/services/notes-search.ts`, `src/store/sqlite/notes.ts`: note text, titles, stems,
  optional prepared vectors and stored links to record references.
- `src/store/migrations.ts`, `src/store/sqlite/search-index.ts`, `words.ts`, `stems.ts`:
  FTS word index, stem vocabulary, message raw-text trigram index and typo vocabulary.
- `src/search/correct.ts`: trigram candidates followed by bounded edit-distance verification.
- `src/search/search.ts`: explicit legacy substring path; strict search does not use it as a fallback.
- `src/services/messages-search.ts`, `src/store/sqlite/lucene.ts`: scoped strict matching,
  attachment-content conditions, BM25/exact-first or newest ordering.
- `src/services/messages-discovery.ts`: bounded partial lexical retrieval, direct replies,
  coverage and lexical rank fusion; no conversation build or neural model required.
- `src/services/attachments.ts`: extracted/supplied text linked to its source attachment.
  Meeting transcripts are searchable once saved as attachment text or a note; no automatic
  recording transcription, cross-source conversation grouping or universal join is promised.

The older source map and immutable historical benchmark links remain available. Benchmark
numbers were moved out of the reading path, not replaced with a new performance claim.
The topic-search diagram now allows the word branch without embeddings, matching the existing
word-only behavior documented in the page. Stored direct replies are distinct from an optional
reconstructed conversation graph; the old “share nothing else” opening was removed.

The browser review also found that Markdown exports left architecture diagrams as raw JSX.
Diagram data now lives in a shared module used by the renderer and Markdown exporter. Captions
and numbered steps are exported in the page language; executable component examples stay literal.
This also restores the existing package/command diagrams in technical Markdown output.

## Validation

Local: reviewed-source sync, localization, refreshed released command contracts, strict docs,
lint/browser structure guard, type checking, unit tests, browser smoke and the affected search
architecture browser tests. Browser cases independently check each locale and viewport; Markdown
cases require the searchable-content, indexing and ranking explanation to survive export.
Full export, links, SEO and complete browser coverage remain CI/release checks.
No live accounts, recordings or private files were used.

Results: localization, contracts and strict docs pass (915 references, zero gaps/invalid examples).
Lint, type checking and 275 unit tests pass. Seven smoke cases and nine targeted search cases pass,
including mobile dark theme, desktop light theme, keyboard focus, accessibility and Markdown.
The mobile indexing diagram was visually inspected. Tests live in the existing documentation
diagram suite so the full release workflow includes them.
