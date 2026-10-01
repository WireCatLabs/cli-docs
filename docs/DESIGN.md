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
   them; it never edits them. The site writes only what belongs to no tool: the landing page, the
   interface words, the "built for agents" text.
2. **The site shows what is released.** Pages are copied at each tool's newest release tag, so the
   site never describes a command that is not on npm yet.
3. **Every tool looks the same.** The same pages at the same addresses, in the same sidebar groups
   (STRUCTURE.md). A reader who knows `max` knows where to look in `tg`.
4. **Agents get plain Markdown.** Every page has a Markdown copy, and `/llms.txt` lists them all.
5. **Three interface languages, one text per page.** The interface is English, Russian or Spanish; a
   page's text is in the language its tool writes it in, and says so when the reader's interface
   differs.

## The map

```text
wirecat.dev/
├── /                              → the reader's language, from the browser                  ✅
├── /{lang}                        the landing page                                            ✅ → 🟡 redesign
├── /{lang}/docs                   → the landing page                                          🟡
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

What it must do: say in five seconds what this is, why it suits agents, which tools there are, and
how to connect one. Build steps: [the landing plan](plans/2026-10-02-landing.md).

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ WireCat                          [Search  Ctrl K]  ☀/☾  Language  GitHub │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  WireCat                                                                 │
│  AI Messaging with CLI tools for agents                                  │
│  Your Telegram and MAX accounts, from the terminal — for you, your       │
│  scripts and your AI agents.                                             │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐        │
│  │ $ tg inbox --json --limit 2                                  │        │
│  │ {"items":[{"chat":…,"from":…,"text":"Are we still on…"}…],   │        │
│  │  "limit":2,"hasMore":true}                                   │        │
│  └──────────────────────────────────────────────────────────────┘        │
│  [ Get started ]  [ GitHub ]                                             │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│  BUILT FOR AGENTS                                                        │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐    │
│  │ One call, one      │ │ Limits you set     │ │ Agents connect     │    │
│  │ answer             │ │                    │ │ themselves         │    │
│  │ JSON on stdout,    │ │ allowed chats,     │ │ MCP server, agent  │    │
│  │ fixed exit codes   │ │ sends per hour,    │ │ skill, /llms.txt   │    │
│  │                    │ │ read-only profiles │ │                    │    │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘    │
├──────────────────────────────────────────────────────────────────────────┤
│  THE TOOLS                                                               │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐      │
│  │ max                  v0.22.0 │  │ tg                   v0.21.0 │      │
│  │ MAX Messenger: bots and your │  │ A Telegram client for the    │      │
│  │ personal account.            │  │ terminal and AI agents.      │      │
│  │ • …  • …  • …                │  │ • …  • …  • …                │      │
│  │ npm install -g @leemour/max… │  │ npm install -g @leemour/tg-… │      │
│  │ Docs · GitHub · npm · Changes│  │ Docs · GitHub · npm · Changes│      │
│  └──────────────────────────────┘  └──────────────────────────────┘      │
├──────────────────────────────────────────────────────────────────────────┤
│  CONNECT YOUR AGENT                              tool: [ tg ▾ ]          │
│  [Claude Code · Codex · Gemini CLI] [MCP clients] [Any model]            │
│  $ tg skill install                                                      │
├──────────────────────────────────────────────────────────────────────────┤
│  GitHub · MIT · Docs as Markdown: /llms.txt                              │
└──────────────────────────────────────────────────────────────────────────┘
```

| Section | Shows | Comes from |
|---|---|---|
| Hero | name, tagline, one promise, a real command and answer, two buttons | `lib/words.ts`; the answer's shape from a real `tg inbox --json` |
| Built for agents | three blocks | `lib/words.ts` |
| The tools | summary, version, three highlights, install, four links | `tools.json`; the version from the tag `pnpm sync` used |
| Connect your agent | one command per kind of client | the tools' own commands: `skill install`, `mcp config` |
| Footer | links | `lib/shared.ts` |

## A tool's pages — `/{lang}/docs/{tool}/…`

```text
┌────────────────────┬──────────────────────────────────────────┬──────────────┐
│ WireCat            │ Using tg                                 │ On this page │
│ [Search]           │ [Copy Markdown] [Open ▾]                 │ The first…   │
│ [ tg ▾ ]  ← switch │ ─────────────────────────────────────── │ Reading      │
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

- **Sidebar** ✅ — the tool switch at the top, then the tool's own `docs/meta.json` groups. Each tool
  is a tab of its own (`root: true` added by sync).
- **The version line** 🟡 — under the switch: the release the pages come from, and its changelog.
- **Page header** ✅ — title; **Copy Markdown**; **Open** (in ChatGPT, Claude, GitHub); the note
  "This page is in Russian/English" in the interface language when the page's language differs.
- **Body** ✅ — the page as its tool wrote it. Links to its other pages stay on the site; links to
  anything else in the repository go to GitHub at the same tag.
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
| The agent skill | `<tool> skill install` — on the landing page and each start page | 🟡 |
| An MCP server over the docs themselves | — | ⚪ step 2 of the portal plan |

## Languages

- Interface: English (default), Russian, Spanish — menus, landing page, notes. Written in
  `lib/words.ts` and `tools.json`, not by the translation agent.
- First visit: `/` picks the language from the browser (`public/language.js`); after that the
  language switch decides.
- Pages: `max` in Russian, `tg` in English. Translations of the tools' pages come later, from a
  separate agent, as separate files.
- Search finds a page in any interface language; Russian words are found from the English one too.

## Look

- Fumadocs' neutral theme, Inter (Latin and Cyrillic), light and dark from the system, with a switch.
- No logo yet: **WireCat** as a word mark. max's own logo appears only on max's pages.
- Code blocks: Shiki highlighting, a copy button; an unknown language shows as plain text.
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
