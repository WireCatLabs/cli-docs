# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary (owner, 2026-10-02): developers who already work with AI agents — Claude Code, Codex,
Gemini CLI, Cursor, Claude Desktop — and want the agent to read, sort and answer their Telegram and
MAX messages for them. They live in a terminal and an editor, they install from npm, and they are
drowning in chats they cannot keep up with.

Secondary: people who look up a command in the docs; MAX bot and group owners (Russian-speaking);
agents that read the docs as Markdown.

## Product Purpose

WireCat's mission is to help people and AI agents work with conversations, remember agreements
and turn messages into useful actions. Telegram and MAX are the tools available today; other
messengers, email and knowledge-base integrations such as Obsidian and Notion are planned (owner,
2026-10-04). About describes an open-source project building and connecting tools for knowledge
and conversations; personal project enquiries go to the configured maintainer Telegram.


WireCat (`wirecat.dev`) is the home of two command line tools, `tg` (Telegram) and `max` (MAX
Messenger). Each one puts the owner's own account in the terminal: for the owner, their scripts and
their AI agents. Success on the landing page: a visitor understands in seconds that their agent can
now handle their messages safely, and installs a tool or connects their agent.

## Positioning

Your own messenger account, handed to your AI agent with one command: it clears the inbox, tells
you who is still waiting for an answer, searches years of history offline, turns voice notes into
text and sends on schedule. It runs on the user's own computer, on the user's own account — not a
bot framework, not a cloud service. Built for agents first: one operation per call, one JSON value
on stdout, a fixed exit code per failure, an MCP server and an agent skill in each tool. The user
sets limits (allowed chats, sends per hour, read-only profiles) — a fact, stated once, not a pitch.

## Operating Context

- Install: `npm install -g @leemour/tg-cli` / `@leemour/max-cli`. Node 22.16+ (22.x) or 24+ with npm; Bun is also supported. Windows, macOS, Linux.
- Connect an agent: `tg skill install` (Claude Code, Codex, Gemini CLI), `tg mcp config` (MCP
  clients), `https://wirecat.dev/llms.txt` (any model).
- Daily use: `tg inbox`, `tg review --unanswered`, `tg search messages`, `tg watch`, `tg export
  --format markdown`, `tg messages transcribe --local`, `tg messages send --at 2h`.
- Both add bots through each messenger's official Bot API (every method: 185 Telegram, 33 MAX) and
  group moderation by the owner's rules. Differences per tool: `content/docs/features.md`.

## Capabilities and Constraints

- Real capabilities: unread inbox across chats; a review of who owes whom an answer; a local
  searchable archive of chats (works offline); export to JSONL or Markdown; voice notes to text,
  on Telegram or a model on the user's machine; scheduled sends that go out with the computer off;
  live watch of new messages; CLI and MCP share profile permissions; most writes are allowed by default, while deletion asks for confirmation. Read-only permissions and confirmation forms can restrict access.
- Safety by design: nothing is sent, marked read or deleted unless the command asked for it.
- Site languages: English, Russian, Spanish. Tool guides are localized from reviewed releases; the generated Telegram Bot API method appendix retains its English descriptions with an explicit locale-specific notice.
- Hero headline (implemented): "Never search a chat again. Just ask."

## Brand Commitments

- Name **WireCat**; tagline **AI Messaging with CLI tools for agents** (owner, 2026-10-02).
- tg is described as "a Telegram client" — never "unofficial", "at your own risk", or ban talk.
- Logo: the purple WireCat monogram and word mark. max's own logo appears only on max's pages.

## Evidence on Hand

- Real: MIT licence, both tools on npm, CI, MCP server and agent skill, `/llms.txt`.
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
