# Reader documentation refresh

This is the content work plan, separate from source-pack and generator experiments. The reader
is a person using a messenger with an assistant, not someone studying the implementation.
Existing tooling research is in the 7 October plan and 8 October reviews; it informs checks,
not a substitute for editing pages. Current source: main `e70b784`, TG v0.37.0 / MAX v0.36.0.

## Page work and acceptance

| Page/task | Reader question | Concrete change | Acceptance |
| --- | --- | --- | --- |
| Bots / Bot API | What can a bot do for me? | Define Bot API, distinguish bot/personal account, list messages/files/events/group tasks, connect and verify, then native API | A newcomer can name a useful bot task and find setup without reading method counts first |
| Search playground | Why try this invented archive? | Explain the practice data and benefit; give three actions before the widget | Reader can try a filter and inspect a source without an account |
| Telegram overview | What is tg? | Define the command-line tool and its agent use | No unexplained “tool” as the product definition |
| Installation | What will I get, and why log in? | Account/agent benefit, expected chat-list check, reason for device authorisation | Prerequisites follow the purpose; login does not imply downloading all history |
| Tool login guides | Why is this step necessary? | Add a localized purpose/result before native instructions, mirrored in Markdown | Reader understands access and knows how to recognise a successful connection |
| Other tool guides | What is this page for? | Specific orientation for usage/archive/search/bots/groups/security/recipes/recovery/release pages | The first block names the task and result; native reference remains intact |
| Commands | Where is the command for my task? | Lightweight index plus personal/bot/admin references derived from the same release source | Fewer DOM nodes on entry, old anchors work, no command lost, full Markdown retained |
| Security | What may the assistant do? | Keep the simple Security title and current permissions/storage explanation | Reader can choose a permission and find its limits |
| Changelog / roadmap | What shipped and what remains planned? | Incorporate reviewed current-release source; require versioned roadmap review and matching release-note entry in CI/deploy | Version change cannot quietly keep stale release material |

## Shared editorial rules from owner review

1. Say what the feature/page is, why someone would use it and what they will get before steps,
   prerequisites, warnings or internal terminology.
2. Name an unfamiliar product accurately: “command-line tool”, not just “tool”. Define Bot API,
   login and practice data at the point they appear.
3. Explain a demo's benefit and next action. “Fictional archive” alone gives neither.
4. List the practical capabilities before exhaustive methods or flags. Link precise reference
   beside the topic, with a readable next task at the end.
5. Separate account types, reading, downloading, drafting and sending. State prerequisites only
   when they change the user's action.
6. Keep ordinary requests and visible results first. Put developer syntax in reference or
   expandable detail. Use the existing homepage scenarios where they explain a task better.
7. A technical page can remain technical; label its audience and make the useful explanation
   discoverable from the task page. Diagrams should answer a concrete question.
8. Changes must be visible on actual pages and their Markdown versions. Record page-level
   outcomes and source/version boundaries, not just tooling counts.

## Implementation and review

Portal-authored pages are edited directly. Native tool guides remain generated from reviewed
releases; their reader orientation is a portal presentation layer mirrored in Markdown. Telegram
entry copy stays in `translations/overviews`. Command partitions derive from the full release
reference after localization; no native command descriptions are manually forked.

Validate release syntax and fingerprints, localization, full reference coverage across partitions,
legacy anchor routing, Markdown parity, mobile/a11y and measured reference-page load behavior.
Then review the visible pages. Release checks here govern documentation publication; they do
not claim to replace either tool repository's separate package-publish checks.

The next editorial pass is implemented in the existing shared pages:

- `features`: task chooser, five copyable requests with expected results, collapsible command inventories, current roadmap links.
- `prompting`: file access and extraction boundaries, voice summary and recognition prerequisites, a one-off digest before recurring setup, distinction from queued reminders.
- `browser-apps`: ordered recovery after sleep/restart, account check before tunnel/app checks, observable success and remote file handoff.

All three locales are maintained. Native attachment and remote-transfer guides came from main's reviewed source updates; this pass links them rather than claiming authorship of those guides.

Next review: try the updated task chooser and requests with the owner, then prioritise the remaining native guide bodies by actual reader friction. Add a new guide only for a distinct reader question not served by the current shared and messenger pages.
