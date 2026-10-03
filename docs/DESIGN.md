# WireCat — how the site is laid out

**WireCat — AI Messaging with CLI tools for agents.** One site, `wirecat.dev`, for the owner's
command line tools: today `max` (MAX Messenger) and `tg` (Telegram). It is read by two kinds of
reader, and every page serves both:

- **people** — developers who install a tool and look up a command;
- **agents** — models that read the docs as Markdown, and MCP clients that use the tools.

This page is the design: what pages exist, what each one shows, and the rules behind them. How each
part gets built is in the plans ([portal v1](plans/2026-10-01-portal-v1.md),
[landing page](plans/2026-10-02-landing.md)). The pages inside a tool's section are laid out by
[STRUCTURE.md](STRUCTURE.md).

Status marks: ✅ live · 🟡 planned · ⚪ later.

## The rules behind every page

1. **One home per fact.** A tool's pages live in that tool's repository, `docs/`. The site copies
   them; it never edits them. The site writes the landing page, interface words, and shared guides
   for installation, agent connections and MCP. Tool-specific details stay in the tool's pages.
2. **The site shows what is released.** Pages are copied at each tool's newest release tag, so the
   site never describes a command that is not on npm yet.
3. **Every tool looks the same.** The same pages at the same addresses, in the same sidebar groups
   (STRUCTURE.md). A reader who knows `max` knows where to look in `tg`.
4. **Agents get plain Markdown.** Every page has a Markdown copy, and `/llms.txt` lists them all.
5. **Three languages, including the guides.** Interface and tool documentation are available in
   English, Russian and Spanish. Reviewed translations survive release sync; changes in the source
   require a new review before publishing.

## The map

```text
wirecat.dev/
├── /                              → the reader's language, from the browser                  ✅
├── /{lang}                        the landing page                                            ✅ → 🟡 redesign
├── /{lang}/docs                   getting started: choose a messenger and a path              ✅
├── /{lang}/docs/installation      install with an agent or terminal, log in, first check        ✅
├── /{lang}/docs/agents            Codex, Cursor, Claude Code, Gemini CLI, Hermes                ✅
├── /{lang}/docs/mcp               MCP connections and documentation for agents                ✅
├── /{lang}/docs/{tool}            the tool's start page (its docs/index.md)                   ✅
├── /{lang}/docs/{tool}/{page}     one page of STRUCTURE.md                                    ✅
├── /{lang}/docs/{tool}/changelog  the tool's CHANGELOG.md                                     ✅
├── /{lang}/compare                max and tg side by side, from parity.json                   ⚪ IDEA-107
├── /llms.txt                      every page once, as links to its Markdown                   ✅
├── /llms-full.txt                 every page in one file                                      ✅
└── /llms.mdx/docs/{tool}/{page}/content.md   one page as Markdown                            ✅
```

`{lang}` is `en`, `ru` or `es`. `{tool}` is `max` or `tg`; a new tool is one line in `tools.json`.
`www.wirecat.dev` answers 301 to `wirecat.dev`.

## The landing page — `/{lang}`

The reviewed `design/landing/g-home*.html` prototypes define the English, Russian and Spanish
landing. The page keeps the purple WireCat mark and pill navigation, dark patterned background,
large condensed headline, install command and documentation CTA, interactive agent demo with
five sessions and replay, a day with an agent, Telegram/MAX tool cards,
all three feature groups, advantages, closing CTA and footer. About is a separate translated
`/{lang}/about` page with project details, custom chatbot/integration information and
`hello@wirecat.dev` for enquiries. Header and footer links lead there.

The hero has a connection dropdown for Telegram and MAX. Each option displays its installation
command and copies it on click, with inline confirmation and a link to the matching installation
guide. The standalone agent connection section is omitted. Five-agent and MCP guides remain in
the documentation. Skills installation commands and detailed setup live in the docs.
Landing buttons stay fixed on hover and press, with 180 ms surface-color and shadow feedback.
The connection menu fades in over 140 ms and its chevron rotates to indicate the open state.
Reduced motion removes the menu fade and chevron transition, retaining brief color feedback.
After the interactive scenarios, sections appear in this order: benefits, Telegram/MAX,
why it works, the daily habit, and the closing CTA. The daily habit is four short moments at
08:00, 11:00, 15:00 and 19:00, with one action and result each; it has no duplicate command demos.
Only feature variant 6 is published, with its groups
always open; prototype design switches and hidden experiments are removed.

Each feature group has six cards describing user benefits, without command snippets. Personal
accounts cover unread messages, agreements, search, news, transcription and scheduled sends.
Bots cover broadcasts, personalisation, contextual replies, team notifications, buttons and send
controls; the introduction identifies MAX as the platform supporting these messaging workflows.
Groups cover unanswered questions, membership analytics, discussion review, moderation, summaries
and administration. Semantic discussion review is performed by the agent, rather than described
as a built-in automatic profanity filter. The Russian hero uses a smaller size and an explicit
break before its second phrase to stay on two lines on mobile and desktop.

`node scripts/export-landing.mjs` exports the repository-owned prototypes into `lib/landing/`.
`components/landing.tsx` handles demo sessions, replay, results and clipboard, with event/timer
cleanup on navigation. The first demo renders in static HTML without waiting for JavaScript.
Landing CSS is scoped to `.wirecat-landing`; it cannot restyle documentation after navigation.
Fonts are local source assets with OFL licences in `public/fonts/`; Fira Sans Extra Condensed supplies Russian display headings, matching commit b41b263. The documentation header uses an animated SVG logo in a quieter purple,
with motion disabled when the reader requests reduced motion.

## A tool's pages — `/{lang}/docs/{tool}/…`

```text
┌────────────────────┬──────────────────────────────────────────┬──────────────┐
│ WireCat     [Telegram / MAX]       [Search] [Language] [Theme]             │
├────────────────────┬──────────────────────────────────────────┬──────────────┤
│ Getting started    │ Using tg                                 │ On this page │
│ Installation       │ [Copy Markdown] [Open ▾]                 │ The first…   │
│ Connect your agent │ ─────────────────────────────────────── │ Reading      │
│ MCP and docs       │                                          │              │
│ v0.21.0 · Changes  │ This page is in English.  (when the      │ Sending      │
│                    │  interface is another language)          │ …            │
│ Start              │                                          │              │
│   tg               │ the page's own text, from tg-cli's       │              │
│   Installation     │ docs/usage.md at the release tag         │              │
│ Guides             │                                          │              │
│   Usage  ●         │                                          │              │
│   …                │                                          │              │
│ Reference          │                                          │              │
│ When something…    │                                          │              │
│ Project            │                                          │              │
│ [Language ▾] ☀/☾   │                                          │              │
└────────────────────┴──────────────────────────────────────────┴──────────────┘
```

- **Top bar** ✅ — Telegram / MAX, search and a language button next to it, at desktop and mobile
  widths. Switching messengers keeps the current section if it exists in both; otherwise it opens
  the target's overview. Changing language keeps the current page. Getting started remains selected throughout the
  shared installation, agent and MCP guides, including in the sidebar.
- **Sidebar** ✅ — the current section title (Telegram, MAX or localized Getting started),
  shared getting-started links, then the tool's own `docs/meta.json` groups. The brand logo appears
  only in the top bar.
  `root: true` from sync still scopes the sidebar to the active tool; the old tabs dropdown is off.
- **The version line** 🟡 — under the switch: the release the pages come from, and its changelog.
- **Page header** ✅ — title; **Copy Markdown**; **Open** (in ChatGPT, Claude, GitHub); the note
  "This page is in Russian/English" in the interface language when the page's language differs.
- **Body** ✅ — the released guide in the selected language, with reviewed corrections. Entry pages
  explain the tool, the current section and the first steps before linking to detailed reference.
  Links to other pages stay on the site; repository links go to GitHub at the release tag.
- **On this page** ✅ — the headings.

Which pages a tool has, and what each answers, is [STRUCTURE.md](STRUCTURE.md): Start (index,
installation), Guides (usage, sessions, archive, mcp, recipes, and pages only one tool has), Reference
(commands — generated, configuration), When something goes wrong (diagnostics, troubleshooting,
security), Project (changelog, roadmap).

## For agents

| What | Where | Status |
|---|---|---|
| Index of every page, sidebar order, once each | `/llms.txt` | ✅ |
| Every page in one file | `/llms-full.txt` | ✅ |
| One page as Markdown | `/llms.mdx/docs/{tool}/{page}/content.md` | ✅ |
| Copy / open a page in a chat | page header buttons | ✅ |
| The agent skill | `<tool> skill install` — in the shared agent guide; the CLI already hints at it in agent environments | ✅ |
| An MCP server over the docs themselves | — | ⚪ step 2 of the portal plan |

## Languages

- Interface: English (default), Russian, Spanish — menus, landing page, notes. Written in
  `lib/words.ts` and `tools.json`, not by the translation agent.
- First visit: `/` picks the language from the browser (`public/language.js`); after that the
  language switch decides.
- Tool pages: source MAX guides are Russian and Telegram guides English; all three locales have
  full reviewed guides. Durable translations live in `translations/`, with per-locale source
  fingerprints and checks for commands, literals, links and heading structure. Original section
  anchors remain usable. Translation review findings live in `docs/reviews/`.
- Shared getting-started, installation, agent and MCP guides: English, Russian and Spanish,
  owned by the portal. They are in search and the default-language Markdown index. Copy Markdown
  on any translated guide keeps that language at `/llms.mdx/docs/{lang}/…/content.md`.
- Search finds a page in any interface language; Russian words are found from the English one too.

## Look

- Documentation: Fumadocs' neutral theme, Inter (Latin and Cyrillic), light and dark with a switch.
- Landing: the reviewed dark design, Anybody headings, Onest body, JetBrains Mono commands.
- Landing uses the purple WireCat monogram and word mark. max's own logo appears on max's pages.
- Code blocks: Shiki highlighting, a copy button; an unknown language shows as plain text.
- Documentation uses the owner-selected **Quiet** treatment (2026-10-03): headings retain their
  ordinary text color; links have a muted blue tone and no underline; prompts use a nearly neutral
  surface with a small labelled header and copy icon. `lib/docs-usability.css` owns these styles,
  and `components/text-snippet.tsx` renders the prompt and command blocks. The selection is recorded
  in `design/docs/options.json`; the comparison gallery is excluded from the shipped site.
- Works at phone width: the sidebar folds into the menu button.

## Later

- ⚪ **IDEA-107** — `/{lang}/compare`: max and tg side by side, generated from cli-messaging's
  `parity.json`, so it cannot drift from the programs.
- ⚪ **IDEA-108** — a searchable commands reference built from `<tool> commands --json`, beside the
  generated `commands` page.
- ⚪ **IDEA-109** — sitemap and `robots.txt`; link preview images; Cloudflare Web Analytics (no
  cookies); "Edit on GitHub" at the release tag instead of `main`.
- ⚪ Outside links checked weekly with lychee.
- ⚪ Each tool's release workflow signals this site to rebuild (the daily build covers it now).

The benefits section is followed by an interactive, localized time estimate. `components/time-savings.tsx` uses `lib/time-savings.ts`: messages, active chats and replies per day plus six editable timing assumptions. Monthly estimates use 22 days; negative savings are shown honestly. It makes no measured speed or accuracy claim.

Scenario order: context, cross-messenger recommendations, group management, inbox, commitments, scheduling, files, bot. The window’s Telegram/MAX selector preserves the scenario, and shareable URLs use `scenario=<id>&messenger=<tg|max>`. Each request can be copied; each illustrated source has its chat/date/excerpt. Group management previews first, then performs only specifically approved deletions. Time-calculator defaults remain editable assumptions by the owner’s choice; no measured calibration is claimed.

Sources inside scenarios use native disclosures rather than anchor links. Summaries identify sender/message ID and chat/date; opening a source never navigates or scrolls the document. The shared landing footer also follows the docs layout, with its theme/locale controls. Tool-card links show a stationary hover underline and external-tab icon.

Source disclosures remain compact single-line rows (12px type and 3px vertical padding), with full message text appearing only when expanded. Prompt-copy controls sit at the bottom-right of each request bubble; there is no adjacent setup link.

Prompt copying now uses an icon-only button at the bubble’s bottom-right, with a localized tooltip/accessibility label and checkmark feedback. Spanish hero: “Deja de buscar. Solo pregunta.”
