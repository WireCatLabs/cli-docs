# Documentation authoring

Use these rules when writing or reviewing WireCat guides. They help readers identify the right page, complete their task and understand the result. Agents must read this file before documentation work; repository `AGENTS.md` entry points link here.

## Start with the reader's task

Before drafting, identify who opens the page, in what situation, and what they want to achieve. The first paragraph briefly explains when to use the page and what the reader will be able to do or understand after it. State a prerequisite or limitation there only when it changes the next action. Do not open with package internals or a list of command names.

Keep the title short and specific, such as **File attachments**. A description adds useful context rather than repeating the title. Put the useful outcome before implementation detail. Prefer concrete examples and plain language; distinguish sending a file, downloading its bytes, reading its content and indexing recognized text.

## Keep facts and navigation trustworthy

Tool repositories own command behavior and native guides. The portal normally imports a reviewed release, not unreleased `main`. An explicitly reviewed documentation-only page may come from a fixed source commit while the runtime release pin stays unchanged. Such a page must describe capabilities already available in that release; its source and edit link must remain traceable.

Preserve URLs, incoming anchors, command tokens and code examples across edits and translations. Link new guides from a relevant existing task page and the sidebar. Every navigable sidebar page and folder needs an icon that represents its subject; icons are decorative and must not replace the label. Shared navigation belongs in `lib/docs-sidebar-tree.tsx` and `components/getting-started-links.tsx`.

Explain available prerequisites and quality limits where readers need them. For attachments, distinguish automatic parsers, agent tools and explicitly configured external APIs. Put voice transcription in its own row. Never imply that passing a local path transfers a file to a remote agent.

## Check the result

Run the affected tool's documentation checks and the portal's lint, type checks, tests, localization, build and link checks. Verify the rendered sidebar on desktop and mobile and review the opening paragraph in each affected language. Tests should protect a real reader outcome or contract, not merely repeat implementation details. Keep unrelated checkout changes intact.
