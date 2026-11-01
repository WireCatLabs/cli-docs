---
title: "Mail"
---

`mail` — инструмент командной строки WireCat, который читает почтовый ящик по IMAP в общее хранилище: для терминала,
для скриптов и для ИИ-агентов. Он входит по паролю приложения, который хранится в системной связке ключей. Он наводит
порядок в ящике на сервере, хранит черновики, отправляет письма, отвечает и пересылает по SMTP с тем же паролем приложения.

Команды: `session` (start: создать профиль, проверить и сохранить пароль приложения; status; end; list),
`account check`, `folders list`, `sync` и `status` (как далеко ушла синхронизация), `search messages`, `messages show` и
`conversations list|show` (читают то, что сохранил sync), `messages mark-read|move|copy|delete|restore|send|forward`,
`folders create|rename|delete`, `drafts`, `attachments`, `rules` и `tags`, а также команды, общие для всех
CLI WireCat: `doctor`, `commands`, `config`, `skill`, `mcp`, `runs` и `upgrade`.
Начните с [установки](./installation.md), затем прочитайте [работу с инструментом](./usage.md). Перед первым входом
подготовьте почтовый ящик: [шаги для каждого провайдера](./providers.md).

## Поиск по почте

`mail` ищет и читает почту, которую синхронизировал его профиль, в локальном хранилище, и спрашивает почтовый сервер о
письмах, которых `sync` ещё не прочитал (`--backend archive` оставляет только хранилище):

```sh
mail ya search messages invoice                                  # best match first, any form of the word
mail ya search messages 'from:ann@example.com has:attachment date>30d'
mail ya search messages 'list:github.com is:unread' --newest     # a mailing list, newest first
mail ya messages show '<ref from a search>'                      # the whole email and its attachments' text
mail ya conversations list emails_count>1                        # threads, newest first
mail ya conversations show '<chat:email/… ref>'                  # one thread, oldest first
```

Язык запросов тот же, что у всех CLI WireCat ([руководство по поиску](https://github.com/WireCatLabs/cli-core/blob/main/docs/search/query-language.md)):
`from:`, `to:`, `cc:`, `subject:`, `mailbox:` или `label:`, `list:` (List-Id или его домен), `is:unread`,
`has:attachment`, `filename:`, `content:` (текст вложений), `size>` и `date:`. Каждая команда читает только ящик своего
профиля; [memo](https://github.com/WireCatLabs/cli-memo) ищет по всем ящикам вместе с вашими сообщениями и заметками
(`memo search mail`, `memo search all`). Хранилище держит текст, а не само письмо, поэтому исходника для показа нет.
