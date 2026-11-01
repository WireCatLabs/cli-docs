---
title: "Mail"
---

`mail` — инструмент командной строки WireCat, который читает почтовый ящик по IMAP в общее хранилище: для терминала,
для скриптов и для ИИ-агентов. Он входит по паролю приложения, который хранится в системной связке ключей. Он не
отправляет почту.

Команды: `session` (start: создать профиль, проверить и сохранить пароль приложения; status; end; list),
`account check`, `folders list`, `sync` и `status` (как далеко ушла синхронизация), а также команды, общие для всех
CLI WireCat: `doctor`, `commands`, `config`, `skill`, `mcp`, `runs` и `upgrade`.
Начните с [установки](./installation.md), затем прочитайте [работу с инструментом](./usage.md). Перед первым входом
подготовьте почтовый ящик: [шаги для каждого провайдера](./providers.md).

## Поиск по почте

`mail` наполняет общее хранилище. [memo](https://github.com/WireCatLabs/cli-memo) ищет в нём и показывает его содержимое:

```sh
memo search mail "invoice"
```

Слова запроса описаны в [memo search](https://github.com/WireCatLabs/cli-memo/blob/main/docs/search.md).
