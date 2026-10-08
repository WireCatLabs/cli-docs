---
title: "Topic search"
---

`max conversations` finds a discussion by what it was about. Use it when you remember the subject but
not the words: "where did we talk about renting a flat?" finds a conversation that says "apartment",
"lease" and "deposit". For exact words, people, dates and files, use [message search](./search.md).

This is not the `topic:` search field, which restricts results to one discussion thread. Here a conversation is something `max` identifies itself, in any chat.

Search uses messages that `max` has already stored. By default the graph and vectors are built on your computer; an external service is selected explicitly. Download the history first: `max store fetch <чат>` ([archive](./archive.md)).

## What a conversation is

In a busy group, several conversations run at once and their messages interleave. `max` untangles them using stored messages, without asking MAX or using AI:

- a reply belongs to the message it answers;
- a message that mentions someone, by @username or by name, belongs with that person's recent message;
- a person's next message, within a few minutes, continues their previous one.

Each conversation is a list of messages, oldest first. It can skip the messages in between that belong
to other conversations. The rules guess; they can split one discussion in two or join two. Your own AI
agent can link what the rules leave open ([below](#связать-сообщения-поможет-ваш-агент)).

## Build, embed, search

```sh
max conversations build --chat "Книжный клуб"   # найти разговоры; ещё раз — после того, как скачано больше
max models text download e5-small               # один раз: 135 МБ, общая папка с tg
max conversations embed --chat "Книжный клуб"   # продолжает с места, где остановился
max conversations search "где встречаемся" --chat "Книжный клуб"
max conversations search "аренда квартиры"      # во всех построенных чатах
```

1. **Build** finds the conversations in a chat. A new `build` replaces the previous one, so take the conversation number from a fresh `list` rather than keeping it.
2. **Embed** turns each conversation, or each piece of a long one, into a *vector*: numbers that represent the text’s meaning. Texts about the same subject have similar vectors, even when the words or languages differ.
3. **Search** turns your question into a vector and finds the nearest conversations. It also searches the question’s words and ranks conversations found by both methods higher. Each result says how it was found: `"by": ["meaning"]` (by meaning), `["words"]` (by words), or both.

Without a downloaded model, search still works and finds conversations by words; the answer then says `"meaning": "unavailable"`. A chat that has never been built is not searched: run `build` first.

The question remains ordinary text. `--filter 'from:me date:7d'` separately restricts conversations using a strict query: at least one message must match the whole condition. By default only the active account is searched; `--source
personal|bots|all|<провайдер>` explicitly widens the scope. Results include their source and a `msg:` locator. `--timezone` selects the calendar time zone. `--filter` and `--source` cannot be combined with `--refresh`: build and index the relevant chats first. With local `e5-small`, a meaning match requires cosine similarity above 0.80; word matches remain. `--sync-first` downloads new messages, while `--refresh` builds the graph and vectors locally.

## Read what was found

```sh
max conversations list --chat "Книжный клуб" --since-time 7d
max conversations show 91                       # один разговор, от старых к новым
max conversations show "Книжный клуб" 204       # разговор, в котором сообщение 204
max conversations related "Книжный клуб" 204    # другие разговоры о том же, во всех чатах
max messages links "Книжный клуб" 204           # почему сообщение там, где оно есть
```

`related` uses the vectors `embed` stored and runs no model, so it answers quickly. A search result
is a lead, not an answer: open the conversation and read the messages before relying on it.

## Keeping it current

New messages enter a conversation only after the next `build`, and enter vectors only after the next `embed`.

```sh
max conversations status                         # что отстало, по чатам
max conversations build                          # все изменившиеся чаты и группы, ни разу не построенные
max conversations embed                          # все построенные чаты, где остались куски
max conversations search "аренда квартиры" --refresh   # сначала догнать, потом искать
```

`status` counts, for each built chat, messages that `build` has not seen yet (new, edited or deleted), pieces with current, stale or missing vectors, and groups never built. When rules change in a new version, `status` and `max store check` identify chats built with old rules: build them again. Without `--chat`, `build`, `embed` and `search --refresh` process at most 20 chats (`--max-chats`) and embed at most 2,000 pieces (`--max-chunks`) per run; run again to continue. They never download a model.

A result marked `"stale": true` comes from text that was edited after it was embedded: its score is
for the old text. When a message is deleted, its text leaves the vectors too.

## Let your AI agent link messages

Rules cannot see connections that only make sense by meaning. Your own AI agent—the one you already use with `max`—can add them:

```sh
max skill show link-conversations                     # инструкция для агента
max conversations batches status --chat "Книжный клуб"   # сколько сообщений и пачек, сколько текста
```

The agent reads the instructions, tells you how much text it will read and waits for your yes. Then it reads the chat in batches (`max conversations batches next`), decides which earlier message each one answers and saves its answer (`max conversations links add`). The next `build` takes it into account. Replies from MAX take priority, then agent links, then rules. `max conversations links clear --chat "Книжный клуб"` removes the agent’s answers. In this agent workflow, `max` itself does not call a model.

Ordinary `build` uses rules and retained links. `max conversations build --chat <чат> --analyze` sends bounded batches to the configured OpenAI-compatible service or Anthropic. An explicit `--chat` is required. Before the first transmission, the command reports volume, endpoint and token limit and asks for consent; consent is retained for that account, chat and selected service until revoked. Defaults are 50 messages per batch and a maximum reservation of 100,000 tokens; `--yes` grants consent in scripts. `max conversations consents list` lists consent; `consents revoke --chat
<чат>` revokes it. Built-in analysis is CLI-only; keys are not written to config.

## Privacy and cost

By default nothing leaves your computer. The model runs here, and a model is downloaded only when you
ask:

```sh
max models text list                             # модели и какие скачаны
max models text download embeddinggemma --accept-terms
```

`e5-small` is the default: small and fast, about 100 languages. `embeddinggemma` finds more but runs
about seven times slower, and downloads only with `--accept-terms`, since it comes under Google's
Gemma terms. Vectors of two models are never mixed: search with the model you embedded with.

On a recent laptop `e5-small` embeds about 30 pieces a second; a group of 100,000 messages takes
a little over 20 minutes, once. Later runs embed only what changed.

A service can compute the vectors instead, with your own key:

```sh
max models text key set openai
max conversations embed --chat "Книжный клуб" --provider openai
max conversations search "аренда квартиры" --provider openai
```

The text of the chat’s conversations then goes to that service, and each search sends it your question. Before sending anything, `embed` reports the number of pieces, maximum tokens and maximum cost, and waits for your yes (`--yes` in scripts; `--max-tokens` sets a limit). `--base-url` accepts any server with the OpenAI embeddings API (`/v1/embeddings`), such as Ollama or LM Studio on your computer, with `--model` and `--dims`. `max models text key remove openai` removes the key.

## For agents

In MCP, `max_read` (`command: "conversations list"`), `max_read` (`command: "conversations show"`), `max_read` (`command: "conversations search"`), `max_read` (`command: "conversations related"`) and `max_read` (`command: "conversations status"`) read the built index; `max_write` (`command: "conversations refresh"`) brings it up to date on this computer. Through MCP, the agent gets the `link-conversations` instructions, estimates the work with `max_read` (`command: "conversations batches status"`) and waits for the owner’s consent for that chat. It then reads `max_read` (`command: "conversations batches next"`), saves answers through `max_write` (`command: "conversations links add"`) and rebuilds the graph through `max_write` (`command: "conversations build"`). `max_write` (`command: "conversations links clear"`) removes agent answers; the graph must also be rebuilt afterward. Writes require `conversations.links`. External-vector settings also apply to MCP search: the question is sent to the selected service. For the technical details—rules, chunks, vectors and result ordering—see [how search works](https://wirecat.dev/ru/docs/search-architecture).
