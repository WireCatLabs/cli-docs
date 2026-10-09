# Documentation release readiness

All 88 page homes / 264 locale openings were reviewed for the owner’s purpose → outcome → terms →
steps rule. This is an opening/structure review, not a claim to have executed every messenger task.
The previous complete export passed all 104 browser checks and 227 unit checks.

Release preflight found newer published CLI versions. Telegram v0.39.1 and MAX v0.38.1 were reviewed
against GitHub and npm. Changed archive, command, configuration, person, remote, usage, changelog
and roadmap text was translated; 33 source fingerprints were updated only after protected code,
inline literals, heading structure and links matched. Current references cover 904 command paths
without gaps or invalid examples. Synthetic report checks pass for both reviewed dependencies.
The isolated unit timeout passes on retry and the full unit suite passes.

During that work main advanced to 3e808fc, merging PRs 82–84. Its latest production deployment
fails deliberately at sync because docs/release-hold.json requires released and reviewed Telegram,
MAX and Memo search namespaces and removal of candidate guide refs. Telegram v0.40.0 is now
published, while MAX's latest confirmed release is v0.38.1. These new main changes must be
integrated and their release inputs reconciled before publishing the combined documentation.
Unrelated draft routes/branches must not be silently deployed, and the hold must not be bypassed.

## Integrated preview

Merged main through 1968ed3, retaining the richer reader guides, interactive Demo, navigation
icons, purpose/outcome openings and Markdown equivalents. Incoming notes/files and email guides
are included. Removed obsolete corrections already fixed in incoming report guides. Added an
optional PLAYWRIGHT_PORT so verification does not interrupt another worktree's preview.

The owner-directed main commit 1968ed3 removes the publication hold. That removal is retained;
it does not make future search examples match the currently reviewed runtime contracts.
The strict command check currently reports 36 invalid examples (localized namespace commands
in shared Searching and homepage/Demo scenarios) against Telegram v0.39.1 and MAX v0.38.1.
Telegram v0.40.0 is published but has not yet been incorporated into this review. MAX remains
v0.38.1; Memo's latest GitHub release is v0.2.1. No command validator was weakened.

Combined export: 554 routes; TypeScript and build pass. All 230 unit tests, lint, localization,
Markdown lint, release-note/roadmap checks, exported links and SEO checks pass. Browser results
are recorded below after completion. The native candidate statistics/admin guide refs remain
traceable in tools.json; replacing them requires the matching release and review.

Local preview was restored on 4329 using the combined server, preserving the owner's design
preview at / and serving this worktree's export under /ru/docs, /en/docs and /es/docs. HTTP 200
was verified for the docs root, agents, MCP, Demo, notes, email and Russian search API.

Before claiming release readiness: review the new Telegram release and its translations,
align MAX's namespace examples with a published release, verify Memo's documented commands,
then refresh source contracts and run the strict command check on that final export.

Review branch: https://github.com/leemour/cli-docs/pull/88 (draft; publication readiness gaps above).

CI initially exposed an ordering error: the command partition test read generated messenger
references before sync on a fresh checkout. Moved unit tests after sync and release-note checks;
the test and command assertions remain unchanged.
