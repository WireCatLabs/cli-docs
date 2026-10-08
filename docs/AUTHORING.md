# Writing documentation for WireCat

Write first for people who want their messenger to work with an AI assistant. They may not know
what a terminal, CLI, profile, local archive, skill or MCP server is. Explain those terms when the
reader needs them. Developers and agents also need exact reference material; give that material
a clear destination without making it a prerequisite for ordinary tasks.

This is the authoring standard for new and revised documentation. Existing pages are improved
in priority order, not mechanically rewritten to match a template.

## Decide what the page is for

Before drafting, write one sentence answering: **Who opens this page, in what situation, to get
what result?** Find the existing home of that task in the [documentation index](README.md).
Improve that page or section first. Add a page when a distinct reader question needs its own
entry point; a new command or source module does not automatically need a new guide.

Choose the page's job:

| Page type | Reader need | Typical contents |
| --- | --- | --- |
| Getting started/tutorial | Help me achieve my first result | Prerequisites, short steps, expected result, next task |
| Task guide | Help me do something specific | Scope, agent request, steps, result, relevant failure recovery |
| Explanation | Help me understand a behavior or decision | Plain-language model, consequences, example, practical next step |
| Reference | Tell me the exact supported behavior | Syntax/settings, defaults, constraints, examples, links to guides |
| Troubleshooting | Help me recover from this symptom | Symptom, likely cause, diagnostic check, remedy, success check |
| Technical/contributor guide | Help me understand or change the implementation | Audience note, source snapshot, architecture, contracts, deeper references |

## Open by orienting the reader

The title names the task or question. The description helps readers choose the page; it must add
information rather than repeat the title. In the first paragraph, explain:

- where the reader is in the workflow and when this page is useful;
- what they will be able to do or understand by the end;
- the one prerequisite or limitation that could change their next action.

For example: “You have connected your account. This page helps you find an older message and check
what was said around it. If that period is missing from the local history, your agent can help
download the part you need.”

For onboarding, the opening should help the reader choose a useful next action. Explain what
they will gain, give a short readiness check when needed, and provide a direct path onward if it
already works. Keep architecture diagrams and repeated agent/command matrices out of that path.
Use a matrix only when comparing rows changes the reader’s decision.

Lead with the user outcome. Package names, dependency lists and implementation details belong
later unless the page's explicit audience needs them immediately. Use the existing inline term
explanations where useful; the sentence should remain readable without opening a popover.

The owner's review adds these practical requirements:

- Define what the feature is and why to use it before steps or a list of methods.
- Call a CLI a command-line tool; explain login as granting a device access to the chosen account.
- Introduce practice data by the action and benefit: what to click and what the reader learns.
- List user capabilities before exhaustive references, and make detailed explanations discoverable.
- Judge progress by improved pages and reader tasks, alongside code and release checks.

## Build the middle around progress

For an ordinary task guide, use the following order when relevant:

1. **Before you start:** only the account, agent, data or permission requirements needed here;
   link setup instead of repeating it.
2. **Try it:** a copyable request in normal language. State scope and allowed actions only when
   they affect the task. Do not make users specify CLI commands to their agent.
3. **What happens:** explain the short sequence and who performs each step. Separate what the
   user approves from what the agent does.
4. **Check the result:** describe observable success, sources the answer should show, and how to
   recognize an incomplete result.
5. **If it does not work:** provide the most likely symptom and a linked or short recovery path.
6. **More control:** exact commands, options and technical detail for readers who need them.

A two-paragraph explanation does not need six headings. Reference pages use scannable entries,
not a pretend tutorial. Give each block a purpose; remove blocks that repeat the same fact.

Keep reading, downloading history, saving locally, drafting and sending distinct. Explain whether
a command uses local data, accesses the messenger or changes the account. Empty search results
do not prove absence when history is incomplete. A CLI guard is not a guarantee about everything
an agent can do outside the CLI. Verify these statements against the selected release.

## End with a useful next action

Close a task guide with a success check or practical handoff, then a descriptive next-step link.
Choose the most likely next task and, if useful, a reference or troubleshooting alternative.
Do not end with a generic summary, a marketing CTA or a list of every related page.

An explanation ends by connecting the concept to a decision or task. Troubleshooting ends by
showing how to verify recovery and what evidence to collect if it still fails. References can
end with a relevant guide and related reference. Changelogs and short project pages need no
artificial “Next steps” section.

## Cross-links and navigation

- Link prerequisites at the point they matter, reference beside the relevant command, and help
  beside the likely failure. Link a precise heading when it saves the reader searching.
- Use descriptive link text: “Download older history”, not “click here”. Avoid fixed link quotas.
- Shared pages explain common tasks once. Messenger-specific facts belong to their tool's
  source pages. Give both destinations when behavior differs; replacing `tg` with `max` is not
  evidence that a command works.
- Preserve current URLs and incoming anchors. A route move requires an explicit redirect map.
- A new page needs a sidebar or hub entry and a contextual inbound link from the task that leads
  to it. A page existing in a sitemap is not enough.

## Facts, commands and examples

Document reviewed releases in `tools.json`, with the exact shared dependency versions used by
those releases. The installed package, local `main`, an inspected architecture snapshot and the
portal's reviewed release can differ. State the relevant boundary; do not silently combine them.

Public command references are generated from command trees. Edit their owning descriptions or
generators and regenerate; never hand-edit generated command pages. Tool prose changes go to
the tool repository. `content/docs/tg` and `content/docs/max` are sync outputs.

Verify names, options, argument order, defaults, capabilities and errors against that release's
command contract. A syntax check cannot prove that a task works: use isolated synthetic fixtures
for consequential behaviors such as missing history, permissions and unknown send outcomes.
Document unsupported behavior plainly; planned commands belong in a roadmap.

Use fictional people, messages and IDs for examples. Make placeholders clear enough to replace.
Illustrative output must match a verified output shape and must not imply it came from a real
account. Do not copy real account data, credentials or private captures into docs or generator
inputs. Runtime evaluation uses isolated state; live messenger actions need task authorization.

Keep evidence in a source map or review record: owning repository, release/commit, source path,
relevant behavior/test and page section. Public source notes can be concise. AI-generated text,
DeepWiki and existing prose are research inputs, not sufficient evidence of our behavior.

## Diagrams, localization and agent readers

Use a diagram when a relationship or sequence is clearer visually. Give it one question, short
labels, a caption and a prose equivalent. Prefer editable Mermaid for flows and sequences;
beautiful-mermaid is the selected renderer to trial. Break up overloaded graphs before adding
zoom. Check mobile sizing, light/dark themes, keyboard controls and EN/RU/ES labels.

Preserve executable command tokens, literals, URLs and original anchors in translations. Translate
diagram labels while preserving node identities and relationships. The current translation gate
compares code fences exactly; Mermaid label translation needs a deliberate extension rather
than disabling executable-example checks.

Every public page has a readable Markdown twin. Prompts, prerequisites, alternatives, diagram
meaning and expected results must survive export. JSX that renders in HTML is not proof that
agents can read it. Keep technical reference discoverable through `/llms.txt` and the tool skill.

## Review and checks

Use the [documentation plan](plans/2026-10-07-documentation-system.md) for existing gates and
proposed gaps. Check meaningful properties automatically: valid syntax, links/anchors, sidebar
reachability, locale completeness, source fingerprints, command contracts and diagram/export
behavior. Assess orientation, clarity, appropriate scope and task usefulness through editorial
review and a reader task; a linter cannot prove them.

Approve a revised page when its outcome is clear, its claims match the selected release, a reader
can recognize success or a boundary, and its next step is useful. Do not add rules that require
more pages, more headings or more words just to raise a score.

## Reviewed guide overrides and attachments

Tool repositories own command behavior and native guides. The portal normally imports a reviewed release, not unreleased `main`. An explicitly reviewed documentation-only page may come from a fixed source commit while the runtime release pin stays unchanged. Such a page must describe capabilities already available in that release; its source and edit link must remain traceable. Release-update preparation retires these overrides so newer guide content is reviewed in full. Review contextual prose corrections again when their native counterpart is included in a release.

Preserve URLs, incoming anchors, command tokens and code examples across edits and translations. Link new guides from a relevant existing task page and the sidebar. Every navigable sidebar page and folder needs an icon that represents its subject; icons are decorative and must not replace the label. Shared navigation belongs in `lib/docs-sidebar-tree.tsx` and `components/getting-started-links.tsx`.

Explain available prerequisites and quality limits where readers need them. For attachments, distinguish automatic parsers, agent tools and explicitly configured external APIs. Put voice transcription in its own row. Never imply that passing a local path transfers a file to a remote agent.


## Reader review refinements

Use the information pyramid on overview pages: key capabilities in a short list, a fuller list
grouped by reader tasks, then worked examples and exact commands. On a connection guide, explain
what chat or application the reader will use and what the finished connection enables. Give the
simple connection model before introducing the implementation program. Explain unfamiliar setup
steps where they are performed, including the UI labels and what successful completion looks like.

Use a term hint at the first useful unfamiliar term, not on every repeated word. Definitions
needed to understand the task stay in the prose; a popup offers extra context and a specific guide.
Keep the info icon directly beside its term with no layout padding; preserve the following text’s
ordinary space. Explanations must also survive Markdown export and keyboard/touch interaction.
Agent names are examples, not a closed compatibility list: distinguish prepared setup integrations
from the general requirement for command-line or MCP tool access.

For a corpus review, fix clear wording, structure and navigation issues directly. Record disputed
behavior claims or major restructuring as proposals with an exact before quote, proposed after
text and a page link. Do not mark proposals implemented, and do not silently change a reviewed
release contract to make an example pass. Native source pages remain owned by the messenger repos;
portal orientation and explicit contextual errata must remain traceable.

## Current capabilities, examples and starting requests

User guides describe the latest supported behavior. Do not put package release numbers in
prose, headings, source-link labels or installation commands. Install the current package without
a version suffix. Keep release numbers in changelogs, internal reviewed contracts and immutable
evidence links. Keep necessary runtime requirements (such as the minimum Node.js version).

Begin terminal-agent prompts with “Use tg CLI” or “Use max CLI” and explain the substitution on
shared pages. Browser MCP examples should name the connected tool instead. First tasks is a quick
start; messenger usage guides should offer deeper tasks rather than repeat the same requests.

Illustrative reports can use fictional, coherent numbers without a “demo” badge. Introduce them
as an example, never as a measurement of the reader’s actual account. Give a chart a readable
caption, visible values and an equivalent Markdown table. Follow totals with interpretation and
a useful next request; put coverage details after the value of the report is clear.

Do not hide most of a task guide inside a single disclosure. Use separate existing personal-account,
bot and administration pages for those reader contexts, with visible links between them. Keep
commands beside report examples and retain detailed native references visibly below the task layer.
Report examples should cover group information, participant/post rankings, person context and
anti-bot signals when the reviewed tool supports them. Explain the chosen metric and the next
useful action, not only how many items were counted.

## Publish facts, not editorial history

Public guides assume the current tool version. State supported behavior and the steps to use it.
Remove “if this command is missing, update”, “we have not tested this”, “the owner confirmed”,
“this still needs a platform check”, and explanations of how an author reached the wording.
Review dates, test provenance, uncertainties and unfinished research belong in internal reports.
When a capability lacks evidence, omit the claim and document the supported path.

Keep actual prerequisites and observable behavior: account permissions, supported clients,
required indexes, archive coverage and defined errors. Explain these as concrete conditions or
recovery steps rather than a vague “it may not work”. Do not invent support or hide a factual
limitation to make prose sound confident. Installation/update instructions belong on their task
pages; unrelated feature guides should not hedge around obsolete releases.

Give metadata and the opening different jobs. The short description helps readers choose a
page; the opening explains their task and result. Never reuse the opening as the description.
Check the rendered page, including portal introductions and native text, for adjacent repetitions.
A shared reader layer must add useful orientation, not repeat the native explanation.
