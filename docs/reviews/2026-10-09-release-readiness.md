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
