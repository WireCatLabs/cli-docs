# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary (owner, 2026-10-02): developers who already work with AI agents — Claude Code, Codex,
Gemini CLI, Cursor, Claude Desktop — and want the agent to read, sort and answer their messages for them, then work across their mail,
meetings, documents, calendar and notes too. They are drowning in chats they cannot keep up with.
Since 2026-11 they need no terminal: WireCat Desktop installs the tools and connects the agent.

Secondary: people who look up a command in the docs; MAX bot and group owners (Russian-speaking);
agents that read the docs as Markdown.

## Product Purpose

WireCat's mission is to help people and AI agents work with conversations, remember agreements
and turn messages into useful actions. Released tools: Telegram (`tg`), WhatsApp (`wa`), MAX
(`max`), Zoom (`zm`), Google Drive (`drive`), Google Calendar (`gcal`) and Memo (`memo`), plus WireCat
Desktop, the app for macOS, Windows and Linux that installs and connects them. The user's existing
agent can also use the separate Himalaya email tool and Markdown notes in Obsidian or another editor.
More sources and Notion remain planned. About describes an open-source project building and connecting tools for knowledge
and conversations; personal project enquiries go to the configured maintainer Telegram.


WireCat (`wirecat.dev`) is the home of these command-line tools and the desktop app. Each tool puts
the owner's own account on their computer: for the owner, their scripts and their AI agents. Success on the landing page: a visitor understands in seconds that their agent can
now handle their messages safely, and installs a tool or connects their agent.

## Positioning

Owner, 2026-11-02. Slogan: **"Everything you've said. Ready for your agent."** (RU «Всё, что вы
сказали, — под рукой у агента.», ES «Todo lo que has dicho. Listo para tu agente.»). WireCat
connects the AI agent the user already uses (Claude, ChatGPT, Codex…) to their chats, mail,
meetings, documents, calendar and notes, and keeps them on the user's computer. Messengers lead: they
are the obvious first use, because nothing else gives an agent easy access to them. Name the
concrete messengers first (Telegram, WhatsApp; MAX only for Russian readers at the top of the
landing), then the other sources. "Personal context" may explain what WireCat does, but is never a
headline or the category name: it is too vague to be understood at a glance.

Your own messenger account, handed to your AI agent with one command: it clears the inbox, tells
you who is still waiting for an answer, searches years of history offline, turns voice notes into
text and sends on schedule. It runs on the user's own computer, on the user's own account — not a
bot framework, not a cloud service. Built for agents first: one operation per call, one JSON value
on stdout, a fixed exit code per failure, an MCP server and an agent skill in each tool. The user
sets limits (allowed chats, sends per hour, read-only profiles) — a fact, stated once, not a pitch.

## Operating Context

- Install: `npm install -g @wirecat/tg-cli` / `@wirecat/max-cli`. Node 22.16+ (22.x) or 24+ with npm, and 22.19+ on 22.x for tg; Bun is also supported. Windows, macOS, Linux.
- Connect an agent: `tg skill install` (Claude Code, Codex, Gemini CLI), `tg personal mcp config` (MCP
  clients), `https://wirecat.dev/llms.txt` (any model).
- Daily use: `tg inbox`, `tg review --unanswered`, `tg search messages`, `tg watch`, `tg export
  --format markdown`, `tg messages transcribe --local`, `tg messages send --at 2h`.
- Both add bots through each messenger's official Bot API (every method: 185 Telegram, 33 MAX) and
  group moderation by the owner's rules. Differences per tool: `content/docs/features.mdx`.

## Capabilities and Constraints

- Real capabilities: unread inbox across chats; a review of who owes whom an answer; a local
  searchable archive of chats (works offline); export to JSONL or Markdown; voice notes to text,
  on Telegram or a model on the user's machine; scheduled sends that go out with the computer off;
  live watch of new messages; CLI and MCP share profile permissions; most writes are allowed by default, while deletion asks for confirmation. Read-only permissions and confirmation forms can restrict access.
- Safety by design: nothing is sent, marked read or deleted unless the command asked for it.
- Site languages: English, Russian, Spanish. Tool guides are localized from reviewed releases; the generated Telegram Bot API method appendix retains its English descriptions with an explicit locale-specific notice.
- Hero headline (implemented, 2026-11-02): "Everything you've said. Ready for your agent." Until then
  it was "Memory for your messages. Context for your agent." The selected editorial landing is released in English, Russian and Spanish, with reviewed localized copy. Its open Personal/Bots/Admin capability lists, paper outcomes band, complete conversations, trust strip and editable estimate retain the owner-selected composition.

## Brand Commitments

- Name **WireCat**; tagline **AI Messaging with CLI tools for agents** (owner, 2026-10-02).
- tg is described as "a Telegram client" — never "unofficial", "at your own risk", or ban talk.
- Logo: the purple WireCat monogram and word mark. max's own logo appears only on max's pages.

## Evidence on Hand

- Real: Apache 2.0 licence, both tools on npm, CI, MCP server and agent skill, `/llms.txt`.
- Allowed (owner, 2026-10-02): sample conversations and terminal sessions with invented names,
  shown plainly with no "example" label (owner, 2026-10-02: "don't mark chats as examples"). The
  output shape comes from a real `tg inbox --json`.
- Absent and never to be invented: testimonials, user or download counts, customers, benchmarks,
  stars, press.

## Product Principles

1. Lead with what the user gets — their agent handles their messages — before how it works.
2. Confident, not protective (owner, 2026-10-02): lead with what the agent does for you; limits get
   one plain line, never a headline.
3. Agents are readers too: every page has a Markdown twin.
4. One home per fact: tool facts come from the tools' repositories.
