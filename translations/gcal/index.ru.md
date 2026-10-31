---
title: "Google Calendar"
---

`gcal` читает ваш Google Календарь из терминала, из скриптов и через ИИ-агентов. У Google он просит доступ только на
чтение, если вы не войдёте с `--grant write`, чтобы создавать, менять и удалять события.

Он входит в Google (`session start`, `session status`, `session end`), синхронизирует ваши календари в локальное
хранилище WireCat (`sync`, `store status`, `calendars`) и читает их оттуда: `events`, `search events`, `people` и `links`.
`calendars busy` спрашивает у Google, когда люди свободны. С правом записи `events create | update | delete | move |
respond` меняют Google Календарь. Есть и команды, общие для всех CLI WireCat: `doctor`, `commands`, `guide`, `config`,
`skill`, `mcp`, `runs` и `upgrade`. Начните с [установки](./installation.md), затем перейдите к [работе с инструментом](./usage.md).

Чем `gcal` отличается от других инструментов для Google Календаря: [сравнение](./compare.md).
