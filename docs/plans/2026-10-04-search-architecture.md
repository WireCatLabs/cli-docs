# Search architecture documentation

The owner requests a detailed public explanation of search, graphs, embeddings and reconstructed conversations, plus a separate internal future-work document. This authorizes documentation work; it does not authorize implementing future search features or using live accounts.

Create a shared architecture guide at `/{lang}/docs/search-architecture` in English, Russian and Spanish, linked from the playground and sidebar. Cover ingestion/identity/coverage, strict Lucene parsing and SQLite execution, chronological context, per-chat link graphs and agent-assisted reconstruction, chunk/vector lifecycle, account-scoped semantic/word rank fusion, evidence, limits and the fictional demo. Add a source-owned SVG flow diagram and fixed source links. Tool command references remain generated from reviewed releases.

Source snapshot: cli-messaging `680d22e` (0.140.0), inspected in a detached worktree; site `a02bb5a`, reviewed tool refs MAX0.25/TG0.24. Existing consumer search/archive guides already document both message and conversation search. Inspect source rather than repeating older storage plans which still describe legacy fuzzy fallback. Message search's `--source all` and conversation search's current-account scope must remain distinct. Native provider topics and inferred conversations must remain distinct.

Write an internal dated roadmap in max-cli's private docs_ai repository. Carry forward the approved A2–A4 queue, separate already-existing graph/vector features from proposed hybrid improvements, identify scope/freshness/performance/evaluation work, and state decisions and acceptance checks without claiming authorization to implement them.

Validate source anchors, locale parity and code examples against current command factories, lint/typecheck/unit checks, reviewed-release sync, static export and local links. Preview in an isolated worktree. Open a documentation PR; publish only after the normal review/release workflow.
