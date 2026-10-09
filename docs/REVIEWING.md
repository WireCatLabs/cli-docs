# Reviewing documentation changes

Review every affected reader path before merging a documentation PR or updating the site's
reviewed releases. The goal is to catch a wrong promise, an inconsistent term, a missing next
step or a broken translated page while it can still be corrected. Use
[AUTHORING.md](AUTHORING.md), [TERMINOLOGY.md](TERMINOLOGY.md) and the
[page ownership index](README.md) as the shared rules.

## Review a pull request

1. List the changed files and the affected reader tasks. Include public pages in every locale,
   shared UI copy, navigation, term hints, diagrams and Markdown output. Inspect native tool
   changes and translations when sync or a release pin changes; the final generated page alone
   is not the source of truth.
2. Read each changed page as a reader, including its unchanged opening and ending. It should
   explain what the feature is for, what the reader can do and what successful completion looks
   like before showing steps, syntax or configuration. Remove editorial openings such as “This
   page is about” and repeated account/agent setup outside onboarding.
3. Check the terms against TERMINOLOGY.md. Use AI agent/agent for the actor, distinguish a person
   from a contact, a messaging app from a messenger, a draft from a template, and an audience
   from sending permissions. Inspect prose surrounding code; preserve literal command and
   setting names. Verify that a technical word is explained where it first matters.
4. Verify every changed capability or consequential promise against the reviewed command
   contract and owning source. Check where an action occurs, what it changes, what is sent,
   what the reader reviews and which controls apply. For example, an agent returning reply text
   does not prove that a draft was saved in the messaging app. A bot's streaming draft API does
   not prove personal-account draft support.
5. Follow instructions and links in order. If a reader must choose an audience, grant a
   permission or fetch history, provide the next action or a precise guide link there. Remove
   duplicate Start here blocks from task navigation; preserve the actual getting-started links,
   incoming URLs and old heading anchors.
6. Read each locale's changed prose in full. Keep the same terms, capabilities, action boundaries
   and required context; matching code fences or fingerprints does not establish this. Verify
   headings, links, examples and diagrams in the exported Markdown as well as HTML. Never
   accept a translation fingerprint merely to make a check pass.
7. Run the checks appropriate to the change. For routine prose edits, use the targeted checks
   in [DEVELOPMENT.md](DEVELOPMENT.md). Refresh reviewed command contracts before the strict
   documentation check. For navigation, controls or rendering changes, exercise the affected
   routes in a browser, including keyboard use and mobile layout. Full export and broader
   browser checks remain required in CI.
8. Record findings with file/line, the rule, the problem, the correction and the evidence used.
   Recheck the final diff after revisions. An unresolved factual claim, unsupported example,
   broken reader path or terminology conflict is a reason to hold the affected change.

Use `rg` for a candidate list, then read the surrounding prose. These searches are review aids,
not pass/fail rules; code identifiers and quoted API descriptions can legitimately match:

```sh
rg -n --max-columns 180 --max-columns-preview 'This page is about|You need a.*connected|connected account.*agent' content/docs translations
rg -n --max-columns 180 --max-columns-preview 'model|assistant|AI app|модел|помощник|modelo|asistente' content/docs translations lib/doc-terms.ts lib/guide-orientation.ts lib/search-playground/copy.ts
rg -n --max-columns 180 --max-columns-preview 'Start here|Начните здесь|Empieza aquí' content/docs lib components
```

Do not edit generated `content/docs/tg` or `content/docs/max` pages directly. Correct native
prose in the owning tool repository, or use a reviewed portal correction with a source and a
reason. Internal maintainer documents and technical references can explain implementation terms;
that is different from introducing them without explanation in an ordinary task guide.

## Review the whole corpus before a release update

Create an inventory from the page index, shared metadata and each tool's metadata, rather than
checking only the landing page. Include all shared pages, messenger guides, translated locales,
sidebar and onboarding copy, public examples, agent-readable exports and the relevant term hints.
Assign a named reviewer to each portion and track which pages were read. Every changed page needs
a full read; a corpus review also covers unchanged pages that share the changed terminology,
setup assumptions or capability.

For a tool release, first inspect its command and behavior diff and capture the new public guide
sources using the reviewed-release workflow in [TOOLING.md](TOOLING.md). Separate runtime changes,
native guide rewrites, translated prose and portal corrections. Review the entire affected tool
and locale, including source overrides and corrections that a native rewrite may have made
obsolete. Preserve version pins and immutable evidence; do not change a runtime contract to make
an example pass.

Use a review table with one row per page/locale:

| Page and locale | Reader task | Terms and opening | Behavior evidence | Links and exports | Result and owner |
| --- | --- | --- | --- | --- | --- |
| Example: drafts-and-templates, en | Review a reply before sending | draft and template remain distinct; setup assumed | personal commands and adapter support checked; app-saving boundary stated | audience settings and old anchors checked | fixed, reviewer name |

Mark a page reviewed only after reading its prose and checking the material claims. Record
remaining issues separately with their owning repository, proposed correction and source. A
successful CI run is evidence for its checks, not a declaration that the entire corpus follows
editorial rules.

## Required evidence before merge or release

The PR description should state what the reader can do after the change, the pages/locales
reviewed, source evidence for changed behavior, any term decision, and the checks actually run.
For a release update, include the reviewed-release/translation report and any remaining native
source discrepancies. The reviewer should be able to reproduce the checks without personal
messenger data.

The shared checks are:

```sh
pnpm lint
pnpm search:check
pnpm sync
pnpm docs:release-notes
pnpm test
pnpm docs:contracts
pnpm docs:check
pnpm typecheck
```

CI additionally exports the site and checks links, SEO and the applicable browser suites. Check
that deployment runs sync before tests that read generated pages. After publication, verify the
changed public routes and the reader's main action. Fix the owning source when a check finds a
regression; do not remove an assertion or weaken a gate just to obtain a green result.
