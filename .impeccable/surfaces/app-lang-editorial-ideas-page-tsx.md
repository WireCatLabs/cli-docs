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

## Redesign round, 2026-11-02 (shipped)

Owner on the first build: chips flicker with no transition, posting leaves the page, the look is bulky, the form is
too rounded and toy-like, black buttons, no comments or tags. Three variants were built (seed 1c409e6a: search-first,
status roadmap, split view); the owner picked search-first, on the site's standard blog frame with a sidebar.

THESIS: one page for the whole loop (find, vote, discuss, post, sign in), never a route change.
OWN-WORLD: the blog frame (`blog-columns`, `blog-main`, `blog-sidebar`, `BlogWidget`), editorial tokens, Unbounded
only for the page title, Onest everywhere else, 4/6/8px corners on the page's own controls, the brand `--button`
for the primary action, status as a small tinted label, tags as `#Name`.
FIRST VIEWPORT: title and one line; the ask box (search, and the new idea's title once "New idea" is pressed);
sort tabs and tool/status/tag selects; ruled rows with the vote box on the left. Sidebar: roadmap (in progress,
planned, shipped), tags with counts, what goes where, the email note.
OPEN IDEA: the row becomes a paper panel in place, with the answer and the comments inside; `?id=` opens it.
FORM: `/ideas` only. `/ideas/idea?id=` and `/ideas/new` forward to it; `/ideas/sign-in` stays for the email link
and the Google pop-up.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
