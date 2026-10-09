# Documentation authoring

Use these rules when writing or reviewing WireCat guides. They help readers identify the right page, complete their task and understand the result. Agents must read this file before documentation work; repository `AGENTS.md` entry points link here.

## Start with the reader's task

Before drafting, identify who opens the page, in what situation, and what they want to achieve. The first paragraph briefly explains when to use the page and what the reader will be able to do or understand after it. State a prerequisite or limitation there only when it changes the next action. Do not open with package internals or a list of command names.

Order the opening around the reader: first explain what the page covers and how WireCat
supports that task; then state what the reader will gain. After that, introduce the tool used
for the task and define it before giving instructions. Do not start by telling the reader to
use an unexplained product or command name.

Keep the title short and specific, such as **File attachments**. A description adds useful context rather than repeating the title. Put the useful outcome before implementation detail. Prefer concrete examples and plain language; distinguish sending a file, downloading its bytes, reading its content and indexing recognized text.

## Keep release evidence out of user guides

Keep reviewed tool versions, source commits and exact dependency pins in `tools.json` and
maintainer review records. User guides use unversioned installation commands and explain what
the reader can do; do not add release numbers, a reviewed-version banner or exact-version output.
Link runtime setup to the installation guide. Release notes and compatibility references retain
version details when those details are the page's purpose.

## Keep facts and navigation trustworthy

Tool repositories own command behavior and native guides. The portal normally imports a reviewed release, not unreleased `main`. An explicitly reviewed documentation-only page may come from a fixed source commit while the runtime release pin stays unchanged. Such a page must describe capabilities already available in that release; its source and edit link must remain traceable. Release-update preparation retires these overrides so newer guide content is reviewed in full. Review contextual prose corrections again when their native counterpart is included in a release.

Preserve URLs, incoming anchors, command tokens and code examples across edits and translations. Link new guides from a relevant existing task page and the sidebar. Every navigable sidebar page and folder needs an icon that represents its subject; icons are decorative and must not replace the label. Shared navigation belongs in `lib/docs-sidebar-tree.tsx` and `components/getting-started-links.tsx`.

Explain available prerequisites and quality limits where readers need them. For attachments, distinguish automatic parsers, agent tools and explicitly configured external APIs. Put voice transcription in its own row. Never imply that passing a local path transfers a file to a remote agent.

## Check the result

Run checks appropriate to the change locally, including the affected tool's documentation checks and the portal's localization checks when changing imported guides. Use the local browser smoke suite and targeted tests for changed behavior; see [local documentation checks](DEVELOPMENT.md). CI owns the complete build, link, SEO and browser suites. Verify the rendered sidebar on desktop and mobile and review the opening paragraph in each affected language. Tests should protect a real reader outcome or contract, not merely repeat implementation details. Keep unrelated checkout changes intact.

## Review reader progress before publishing

Before approving a guide, record the answers to these questions in its maintainer review:

- Who opens it, for which task, and what can they do after reading?
- Does the opening state that situation and outcome in plain language?
- Is the first useful request or action reachable before optional command and configuration detail?
- Can the reader recognize success and incomplete results, then choose a next step?
- Does the guide keep release evidence in maintainer records and preserve the same reader path in every language?

Technical checks validate builds, links, examples and presentation. Passing them does not approve
the prose; review the opening, first action and result in each language before merging.
