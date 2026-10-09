# Task chooser, files, voice and connection recovery

## Source and scope

Continued the reader refresh on `fix/docs-tooling-main-20261008`. Fetched and merged main
`e70b784` (merge `caa63e6`), preserving the interactive demo, camera icon, command partitions,
authoring rules and release gate. The portal now reviews TG v0.37.0 / MAX v0.36.0. Attachment
and remote-transfer native guides were already added on main; this pass links their reviewed
content rather than claiming to have authored those guides.

## Visible page changes

All changes below have EN/RU/ES variants and appear in exported Markdown.

| Page | Reader improvement |
| --- | --- |
| Features | Starts with a choice of useful tasks and setup/demo paths; each of five areas has a copyable request and expected result. Command inventories are expandable. Removed the duplicate unsupported-feature list that could drift from native roadmaps. |
| Writing requests | Explains the difference between finding, saving and reading a file; remote paths do not transfer bytes. Adds a voice-summary request, model prerequisites and recognition limits. Adds a one-off digest and a follow-up for recurring setup, including first-run and stop checks. Distinguishes a regenerated digest from a fixed queued reminder. |
| Browser apps | Adds ordered recovery after sleep/restart: check account, restart tunnel/server, retry the chat-list task; identifies the success result and links remote file instructions. |

Exact format, recognition and transfer behavior is grounded in the pinned usage pages and
reviewed attachment/remote guides identified by `tools.json` guide refs. No live account data,
messenger actions or scheduled tasks were used. Automation guidance does not promise any
particular AI client's scheduling feature.

## Release reconciliation

Updated the versioned roadmap review records after reviewing the new changelogs/roadmaps.
Retired corrections whose matching source wording was replaced by the new reviewed releases:
the Telegram login screenshot insertion and the old join-request-filter limitation. Preserved
the tags command correction and separated the newly introduced mutually exclusive invite-link
flags into concrete examples. Native references remain generated.

## Validation

- 227 unit tests passed across 26 files; lint and type checks passed.
- 19 browser checks passed: feature inventories expanded on desktop/mobile, installation,
  browser setup keyboard/Markdown behavior, attachment sidebar icons and command legacy anchors.
- Strict command coverage: 894 reference entries, no reference gaps or invalid examples;
  108 shorthand/glob examples remain explicitly queued for manual review.
- Markdown lint, localization and matching release-note/roadmap checks passed.
- Production export generated 542 routes; link and SEO checks run against the completed export.
- Manually checked the three Russian revised pages at 390px, with no horizontal overflow;
  exported Markdown returned 200 and contained the new task/recovery sections.

Screenshots are local, ignored review evidence in
`.docs-tooling/reports/reader-next-pass/`. Preview serves this checkout's export on port 3000.
No publication was performed.

Manual inspection caught that plain `.md` strips the HTML disclosure wrapper. Converted only
the three feature pages to MDX without changing public routes, and made the existing browser
check require five disclosure controls before expanding the inventories.

After the MDX correction, the six affected onboarding checks passed again. Final export
link/SEO checks passed; manual inspection confirmed five controls and a visible table after click.
