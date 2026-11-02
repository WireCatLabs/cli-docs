---
version: 1
slug: "app-lang-editorial-ideas-page-tsx"
primary_target: "app/[lang]/(editorial)/ideas/page.tsx"
related_targets: ["lib/ideas","components/ideas"]
---

# Ideas

Mode: Operate. People browse ideas, vote, post one, sign in. Phone first-class. Whole surface inside the established WireCat world (blog vocabulary: pills, 12px inputs, ink buttons, 14px widgets, editorial tokens). Screens for owner approval before the API exists; sample data, behind a flag.

Seed: surface ea830ae6 (operate). Dealt 3, 5, 4; lead 3 built unattended (subagent run, no question tool). Alternates for the owner: 5 search-first entry (one box that searches and starts a post), 4 grouped by tool with a tool index.

## Direction contract

THESIS: a ruled ledger of ideas ranked by votes, the count as the row's left anchor, refusing the kanban board and the card grid.
OWN-WORLD: WireCat editorial tokens, Unbounded headings, Onest copy, ruled rows on the page ground, ink pill chips for filters, one ink vote column, status as a small tinted label.
STORY: see what others asked, vote instead of posting a duplicate, post when nothing matches, hear back when it ships.
FIRST VIEWPORT: title, one line on what the page is for, filters, the first ranked rows. Sidebar on desktop: post an idea, what goes where (GitHub, Discord, Telegram).
FORM: list, idea, post, sign in as separate routes; states via sample data.
FINISH: detector, one screenshot round, fixes, one confirm round, finish review.

## Redesign round, 2026-11-02 (three variants behind `?variant=a|b|c`)

Owner on the first build: chips flicker with no transition, posting leaves the page, the look is bulky, the form is
too rounded and toy-like, black buttons, no comments, no tags. Seed 1c409e6a (surface, operate) dealt 3, 4, 2 of the
ranked list (1 ledger + side sheet, 2 split view, 3 search-first, 4 status roadmap, 5 by tool, 6 activity feed,
7 tiles). All three are built for the owner to choose; the old screens stay the default until he picks.

THESIS: one page for the whole loop (find, vote, discuss, post, sign in), never a route change.
OWN-WORLD: editorial tokens, Unbounded only for the page title, Onest everywhere else, 6px controls, 8px panels,
brand `--button` for primary actions, quiet ruled rows, status as a small tinted label, tags as plain `#words`.
A: search-first. The ask box searches and becomes the title of a new idea; ideas open inline in the list.
B: roadmap strip (in progress, planned, shipped) over a filter rail and list; the idea and the composer open as dialogs.
C: split view. List left, the idea or the composer right; on a phone the right pane slides over the list.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
