# Main-base correction — 8 October 2026

The initial documentation tooling work ran in the existing `design/landing-variants` checkout
at `b46e12a`, without fetching current main. The latest fetched main was `e53617b`, 78 commits
ahead. Most visible architecture and first-task content already existed there. The first
architecture diagram was the only architecture content changed by the tooling work, and the
replacement removed package information. The earlier summary overstated the public-page change.

The corrected work is in `fix/docs-tooling-main-20261008`, based on `e53617b`. The original dirty
checkout and unrelated work are preserved. Local port 3000 now serves the clean main-based
worktree. Architecture pages have no diff from that main commit in any language: their existing
package diagrams and explanations are retained.

Main already contained a sidebar icon fix. This work retains it, adds explicit icons for Features,
People and Meeting brief, and uses a fallback icon for future page entries. People, Meeting brief,
browser-app guides, current search behavior, current dependencies and reviewed release pins
are preserved. The subsequent reader-facing revision rewrites the agent-connection page and
the first-task introduction in all three languages, alongside navigation grouping and the
remaining icon mappings. First tasks no longer contains an architecture/transport diagram.

The substantive additions are the authoring/index/tooling documents, safe Repomix source packs,
CodeWiki trial/review scripts, exact release-contract discovery, Markdown/spelling checks,
command/reference/task coverage reports, Mermaid rendering/export support and the agent skill.

## Verification on the corrected base

- Build and TypeScript passed; 217 unit tests passed.
- Built HTML/Markdown links and SEO passed.
- Three browser tests passed across EN/RU/ES: task onboarding and Markdown exports, retained
  architecture package detail, and visible sidebar-entry SVGs.
- The current contracts cover MAX v0.29.0 (306 entries) and Telegram v0.28.0 (442 entries).
  All 748 generated reference entries/options are present.
- Strict example validation fails on 15 existing examples in the current shared guides;
  105 generic/glob constructs also need manual review. These are not accepted as valid.

## Remaining release mismatches

The People guide uses Telegram `contacts profile`, `contacts check`, and scoped `contacts context`
examples not present in the pinned v0.28 contract. The browser-app guide uses
`--http-confirmation` not present in that contract. Current main has these examples, so passing
its previous checks did not establish release compatibility. Fix the shared guide/version
relationship and review affected locales before claiming the new strict CI gate is green.

## Reader-facing review

First tasks now introduces searching, reading conversations and gathering context before the
five-minute prompts. Agent connection starts with a copyable readiness check and directs readers
to their first task as soon as the account and chats appear. Its repeated agent table is removed;
the page explains automatic setup assistance, supported `setup --agent` choices and agent-specific
notes, with OpenClaw immediately after Hermes. Both pages retain useful cross-links and have
matching English, Russian and Spanish versions. The authoring rules now make benefit, readiness
and next action explicit for onboarding pages.

The existing meeting-page revision is in PR #64, branch
`docs/user-docs-service-home-20261007` at `fbf863a`. Its worktree is unchanged and is previewed
separately on port 3001. The Russian page starts with a working browser demo, but retains large
JSON examples lower down; it still needs editorial simplification. Port 3000 serves this branch's
First tasks and Agent connection pages. Neither preview is a deployment.

After owner review, this branch also replaces Meeting brief with an illustrative task scenario:
request, first brief, a follow-up to check other chats, and an updated 20-minute agenda. Source
messages are expandable and localized; the page no longer requires Node, a repository checkout
or reading JSON. Existing incoming anchors remain available. First tasks links and the task map
now point to this user-facing scenario. The isolated retrieval script remains a developer fixture
with its behavior test, independent of public prose. The PR #64 worktree remains untouched.
The revised meeting page is available on port 3000; port 3001 is the older draft.

A new account-free interactive demo is deferred: the existing fictional conversation explains
the outcome, while a fixed-answer button adds little. Revisit an interactive trial only if it
lets a reader meaningfully change the request and explore different results.

The next usability revision adds a meeting-request builder: three meeting types, personal topic
and chat fields, Telegram/MAX choice and week/month scope produce a copyable request. An optional
four-step fictional walkthrough shows how checking a private chat changes the agenda, with
expandable evidence, back and restart controls. This helps readers prepare their own task; it
does not execute messenger commands or generate an AI answer in the browser. EN/RU/ES share the
same interactions, and the Markdown export expands the component into its request and full
walkthrough. Mobile browser checks exercise editing, copying, navigation, sources and accessibility.

Following the next review, the builder is replaced by the homepage's existing `context` scenario,
read directly from the reviewed EN/RU/ES landing JSON for Telegram and MAX. Original message,
command, response and source-message markup uses the homepage styles. Prepared requests wait
for Send; each click reveals the corresponding commands and answer, then stops at the next
request. The three-turn flow has a messenger selector, restart and prompt-copy controls, and
runs entirely on fictional data. The homepage is unchanged. Markdown expands the same scenario
instead of exposing JSX. Build, typecheck, lint, localization, 217 unit tests, links and SEO pass;
three mobile browser tests cover send boundaries, command output, follow-ups, evidence, messenger
switching, overflow, accessibility and the Markdown export.

The page and sidebar are now titled Demo / Демо, keeping the existing route and anchor aliases.
Send immediately commits the prepared message; commands then appear with a running spinner,
followed by completed ticks and the response. Message entrances, typing dots and button feedback
use short animations. Reduced-motion settings remove animations and delays. The next request
receives keyboard focus when ready. Browser checks cover the running phase and reduced motion.

| File | Line | Example | Problem |
| --- | --- | --- | --- |
| `content/docs/browser-apps.es.mdx` | 82 | `tg mcp --http --port 8765 --public-url "$mcpPublicUrl" --http-confirmation permissions --permission messages.send=allow` | Unknown option --http-confirmation for mcp |
| `content/docs/browser-apps.es.mdx` | 104 | `tg mcp --http --port 8765 --public-url "$mcpPublicUrl" --http-confirmation permissions --permission messages.send=allow` | Unknown option --http-confirmation for mcp |
| `content/docs/browser-apps.mdx` | 82 | `tg mcp --http --port 8765 --public-url "$mcpPublicUrl" --http-confirmation permissions --permission messages.send=allow` | Unknown option --http-confirmation for mcp |
| `content/docs/browser-apps.mdx` | 104 | `tg mcp --http --port 8765 --public-url "$mcpPublicUrl" --http-confirmation permissions --permission messages.send=allow` | Unknown option --http-confirmation for mcp |
| `content/docs/browser-apps.ru.mdx` | 81 | `tg mcp --http --port 8765 --public-url "$mcpPublicUrl" --http-confirmation permissions --permission messages.send=allow` | Unknown option --http-confirmation for mcp |
| `content/docs/browser-apps.ru.mdx` | 103 | `tg mcp --http --port 8765 --public-url "$mcpPublicUrl" --http-confirmation permissions --permission messages.send=allow` | Unknown option --http-confirmation for mcp |
| `content/docs/people.es.md` | 25 | `tg contacts profile @example_user` | Unknown subcommand profile for contacts |
| `content/docs/people.es.md` | 53 | `tg contacts context @example_user --chat "Club de lectura" --chat "Trabajo" --limit 10` | Unknown option --chat for contacts context |
| `content/docs/people.es.md` | 68 | `tg contacts check @example_user` | Unknown subcommand check for contacts |
| `content/docs/people.md` | 25 | `tg contacts profile @example_user` | Unknown subcommand profile for contacts |
| `content/docs/people.md` | 52 | `tg contacts context @example_user --chat "Book club" --chat "Team" --limit 10` | Unknown option --chat for contacts context |
| `content/docs/people.md` | 66 | `tg contacts check @example_user` | Unknown subcommand check for contacts |
| `content/docs/people.ru.md` | 25 | `tg contacts profile @example_user` | Unknown subcommand profile for contacts |
| `content/docs/people.ru.md` | 53 | `tg contacts context @example_user --chat "Книжный клуб" --chat "Работа" --limit 10` | Unknown option --chat for contacts context |
| `content/docs/people.ru.md` | 68 | `tg contacts check @example_user` | Unknown subcommand check for contacts |
