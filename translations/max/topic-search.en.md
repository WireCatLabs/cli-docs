---
title: "Topic search"
---

<a id="что-такое-разговор" />
<a id="построить-посчитать-векторы-искать" />
<a id="для-агентов" />

Topic search helps when you remember what a chat discussed but cannot recall the wording. Ask where you talked about renting an apartment, and it can find messages about rent, deposits and a landlady without that exact phrase. It also works across languages: a Russian question can find an English or Spanish discussion.

After reading this page, you can prepare your chat for topic searches, ask questions in your own words, read the results, and understand when a regular word search is best. Searching for topics only uses messages that `max` has already saved on this computer, so first download the history: `max store fetch <чат>` ([download chat history](./archive.md#скачать-историю)).

Terms used below:

- **Discussion** — related messages within a chat, ordered oldest to newest. Several discussions can overlap in a busy group; `max` separates them.
- **Chunk** — about 1,200 characters from a discussion. Long discussions are divided so each chunk focuses on roughly one subject.
- **Vector** — numbers representing text meaning. Related texts have similar vectors even with different wording or languages.
- **Embedding model** — the component turning text into vectors; it runs locally by default.

Topic search differs from the `topic:` field in [message search](./search.md). That field restricts results to a discussion thread; here `max` groups related messages itself in any chat.

## What you can do

| Task | Command |
|---|---|
| Find a discussion on a topic - in one chat or in all prepared ones | `max search conversations "<вопрос>"` |
| View chat conversations, new ones on top | `max conversations list --chat <чат>` |
| Read one conversation from start to finish | `max conversations show <id>` |
| Open entire conversation that contains a message | `max conversations show <чат> <сообщение>` |
| Find other conversations about the same thing in all chats | `max conversations related <чат> <сообщение>` |
| Limit result to person, period or word | `max search conversations "<вопрос>" --filter '<запрос>'` |
| Find out what's outdated and catch up | `max conversations status`, `max search conversations "<вопрос>" --refresh` |
| Ask your AI agent to link messages more accurately | `max skill show link-conversations` |

## Search by topic or search by word?

| | [Search by words](./search.md) (`max search messages`) | Search by topic (`max search conversations`) |
|---|---|---|
| What do you remember | exact words, name, date, file | just what was discussed |
| What finds | individual messages with your words | whole conversations about your question |
| Other words about the same | no: “apartment” will not find “housing” | yes |
| Other languages ​​| no | yes, about 100 languages ​​for the default model |
| Exact conditions (sender, date, file, link) | yes, all [query language](./query-language.md) | yes, via `--filter` |
| Preparation | download history | download history, then `build` and `embed` |
| Refers to MAX | yes, when searching in one named chat | no, only this computer reads |

Use word search when you remember a word, number, name or filename. Use topic search when you remember the subject, a discussion spans many short messages, or the language differs. If unsure, try topic search: it also searches your words, keeping discussions containing them near the top.

## Try it

Prepare the chat once, and then ask as many questions as you like.

**Your request to the AI agent:**

> In the Book Club, find where we discussed to meet elsewhere. Show the conversation.

**What happens step by step:**

```sh
max store fetch "Книжный клуб"                  # 1. скачать историю, если её ещё нет
max conversations build --chat "Книжный клуб"   # 2. разделить чат на разговоры
max models text download e5-small               # 3. один раз: скачать модель, 135 МБ, общая с tg
max conversations embed --chat "Книжный клуб"   # 4. посчитать вектор каждого куска
max search conversations "где встречаемся" --chat "Книжный клуб"   # 5. спросить
max conversations show 91                       # 6. прочитать найденный разговор
```

Steps 2–4 run on this computer without contacting MAX. `embed` resumes where it stopped. Later questions need only step 5; see [freshness](#свежесть) for when to repeat steps 2 and 4.

**Example result** (fictitious):

```text
0.874  91  2026-09-14 18:02–18:40  23 messages · 4 people · from message 4180  (messages 4185–4192)  msg:max/500/7/4185
0.851  64  2026-08-02 10:15–10:31  9 messages · 3 people · from message 3302  (messages 3302–3310)  msg:max/500/7/3302
```

What you find is a clue, not an answer: open the conversation and read the messages before relying on it.

## How it works

There are three stages to searching by topic. The first two prepare the chat once; the third is performed for each question.

### 1. Build: Split chat into conversations

`max conversations build` reads saved messages oldest to newest and decides which previous message each continues. It uses no AI and does not contact MAX. Links are chosen in this order:

1. **Explicit MAX replies.** A reply links to its original message.
2. **Links from your agent**, if you requested them ([below](#связать-сообщения-поможет-ваш-агент)).
3. **Mentions.** A message mentioning someone links to their latest message. It recognises `@username`, messenger-tagged mentions, and a name followed by a colon or comma (`anna: согласна`). `max` looks back at most 50 messages.
4. **The same person writes again.** Their next message continues the previous one if it arrives within 5 minutes and the previous message is among the last 10.

A message without a link starts a new discussion. Messages from other discussions can appear between its messages. The rules are estimates: they can split one discussion or combine two. A new `build` replaces the previous graph; take discussion ids from a fresh `list` rather than saving them.

### 2. Embed: turn each piece into a vector

`max conversations embed` divides discussions at message boundaries into chunks of about 1,200 characters, with lines formatted as sender and text. Longer messages become overlapping chunks so recognition covers the whole message. Messages without text contribute nothing. Each chunk becomes a vector, which `max` saves alongside a fingerprint to detect text changes; it does not save a second text copy.

### 3. Search: by meaning and by words at the same time

`max search conversations` searches for your question in two ways and combines the results:

- **By meaning.** The question also becomes a vector. `max` compares it with saved chunks and ranks each discussion by its closest chunk. The default `e5-small` requires similarity above 0.80, on a scale where 1 means the same meaning.
- **By words.** Each query word is searched in saved messages. Words of at least three characters also match longer words beginning with them (`встреч` matches the Russian word for meeting). Typos are not corrected.

A discussion found by both methods ranks above one found by only one. Each result reports `"by": ["meaning"]`, `["words"]` or both. Without downloaded recognition files, word search still works and the result says `"meaning": "unavailable"`. Chats without a built graph are skipped; run `build` first.

**Why this can find more:** word search needs matching words. Meaning search compares subjects across a discussion chunk, so “where do we meet” can find a choice between a library and a cafe. Combining word matches preserves exact names and uncommon words.

The technical side - rules, pieces, vectors and order of results - on the page [how the search works](https://wirecat.dev/ru/docs/search-architecture).

## Read what was found

In the terminal, each result is one line:

- Similarity score, or `—` for a word-only match.
- Discussion id, start/end times, message/person counts and the first message.
- `(messages 4185–4192)`, the best matching chunk, or a message for word-only matches: start reading there.
- A message locator (`msg:…`) accepted by `max messages show` and `max messages context`.
- `stale` if text changed after vector calculation: the score refers to older text.

`--json` also includes `meaning` (`searched` or `unavailable`), `model` and `readiness`: chats searched by meaning, by words only, stale chats and unbuilt chats. When coverage is limited, stderr names affected chats and the command to fix them, such as `conversations embed --chat <чат>`.

```sh
max conversations list --chat "Книжный клуб" --since-time 7d
max conversations show 91                       # один разговор, от старых к новым
max conversations show "Книжный клуб" 204       # разговор, в котором сообщение 204
max conversations related "Книжный клуб" 204    # другие разговоры о том же, во всех чатах
max messages links "Книжный клуб" 204           # почему сообщение там, где оно есть
```

`related` takes the vectors that `embed` saved and does not run the model, so it responds quickly. This is a search for meaning only.

## Examples

**Remember the topic, not the words.**

```sh
max search conversations "кто берёт еду на пикник"
```

Search covers all prepared chats. It can find “I'll bring sandwiches” and “Boris has drinks” even when word search would miss them.

**Discussed in another language.**

```sh
max search conversations "аренда квартиры" --chat "Valencia expats"
```

With the default model, this is also the case in Spanish - about “piso”.

**Narrow by person and period.** `--filter` accepts strict [query language](./query-language.md). A conversation is suitable if at least one of its messages satisfies all the conditions. The question itself is still being sought for its meaning.

```sh
max search conversations "бюджет поездки" --filter 'from:"Алиса Тестова" date:30d'
```

```sh
max search conversations "условия договора" --filter 'has:file' --timezone Europe/Madrid
```

**Start with one message.** You found a message using a word search and want everything else on this topic:

```sh
max search messages '"вернули залог"' --chat "Valencia expats"
max conversations related "Valencia expats" 5120
```

**Search in bot chats too.** By default, the search for topics is carried out in the current account. `--source personal`, `bots`, `all` or the name of the messenger expands coverage; then each result says which account it is from.

```sh
max search conversations "задержка доставки" --source all
```

**Download new before asking.** `--sync-first` downloads new messages first - within the chat, time and number of messages, like message search.

```sh
max search conversations "где встречаемся" --chat "Книжный клуб" --sync-first
```

## Keeping it current

New messages enter a conversation only after the next `build`, and enter vectors only after the next `embed`.

```sh
max conversations status                         # что отстало, по чатам
max conversations build                          # все изменившиеся чаты и группы, ни разу не построенные
max conversations embed                          # все построенные чаты, где остались куски
max search conversations "аренда квартиры" --refresh   # сначала догнать, потом искать
```

For every built chat, `status` counts unseen new/edited/deleted messages, chunks with current/stale/missing vectors, and groups never built. Without `--chat`, `build`, `embed` and `search --refresh` process at most 20 chats (`--max-chats`) and 2,000 chunks (`--max-chunks`); repeat to continue. They never download recognition files automatically. `--refresh` cannot combine with `--filter` or `--source`; prepare the required chats separately.

If an update changes grouping rules, `status` and `max store check` identify chats built with older rules. Build them again.

When a message is deleted, its text also disappears from the vectors.

`max store fetch <чат> --catch-up` can immediately after downloading build chat conversations and calculate vectors ([download chat history](./archive.md#скачать-историю)).

## Let your AI agent link messages

The rules do not see connections that are understandable only by meaning. These can be added by your own AI agent (for example, Claude Code, Codex, Cursor or Gemini CLI):

```sh
max skill show link-conversations                     # инструкция для агента
max conversations batches status --chat "Книжный клуб"   # сколько сообщений и пачек, сколько текста
```

The agent reads instructions, estimates how much text it will read and waits for approval. It reads batches through `max conversations batches next`, identifies earlier messages they answer, then saves links through `max conversations links add`. The next `build` prioritises MAX replies, agent links, then rules. `max conversations links clear --chat "Книжный клуб"` removes agent links; rebuild afterwards. `max` calls no AI service in this workflow. Saving links requires `conversations.links`.

`max` can also send batches to an AI provider. Ordinary `build` uses rules and saved links; `max conversations build --chat <чат> --analyze` sends limited batches to a configured OpenAI-compatible service or Anthropic. Explicit `--chat` is required. Before first sharing, it shows volume, destination and token budget and asks for consent, saved for this account, chat and provider until revoked. Default batch size is 50 messages (`--size`), with a reserved budget of 100,000 tokens per run (`--max-tokens`); scripts confirm with `--yes`. `max conversations consents list` shows consent and `consents revoke --chat <чат>` revokes it. Built-in analysis runs only through the CLI, not MCP; keys stay out of configuration files.

## Privacy and cost

By default, nothing leaves the computer. The model works here and is downloaded only by your command:

```sh
max models text list                             # модели и какие скачаны
max models text download embeddinggemma --accept-terms
```

`e5-small` is the small, fast default and supports about 100 languages. `embeddinggemma` can find more but is about seven times slower; downloading requires `--accept-terms` for Google Gemma terms. Their vectors are kept separate: search with the model used to calculate them. Stderr identifies chats prepared only with a different model.

On a recent laptop `e5-small` embeds about 30 pieces a second; a group of 100,000 messages takes
a little over 20 minutes, once. Later runs embed only what changed.

A service can compute the vectors instead, with your own key:

```sh
max models text key set openai
max conversations embed --chat "Книжный клуб" --provider openai
max search conversations "аренда квартиры" --provider openai
```

This sends discussion text to that service and sends each search question too. Before sending, `embed` shows chunk count, maximum token use and estimated maximum price, then waits for approval (`--yes` in scripts; `--max-tokens` sets the budget). `--base-url` accepts an OpenAI-compatible vector server (`/v1/embeddings`), including local Ollama or LM Studio, together with `--model` and `--dims`. `max models text key remove openai` forgets the key. External vector settings also affect MCP search: your agent's questions go to this service too.

## Next steps

- [Message search](./search.md) - exact words, people, dates and files.
- [How the search works](https://wirecat.dev/ru/docs/search-architecture) - the technical side of the rules, pieces, vectors and order of results.
