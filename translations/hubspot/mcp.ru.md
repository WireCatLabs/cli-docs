---
title: "MCP"
---

Дайте вашу CRM HubSpot ИИ-агенту, который не может запускать команды, например Claude Desktop или Cursor, а также
ChatGPT и Claude в браузере. MCP (Model Context Protocol) это способ, которым такой агент спрашивает программу, что
она умеет, и потом вызывает ее. `hubspot` отдает свои команды именно так.

Тогда агент читает ваши сделки, контакты и компании и меняет их в пределах разрешений профиля и scope ключа.

`hubspot work mcp add` добавляет сервер в Claude Code или Codex, а `hubspot work mcp config` печатает запись для
любого другого клиента. Агенту с терминалом, например Claude Code или Codex, лучше подходят команды и навык
(`hubspot skill install`). Нужен профиль, в который вы вошли, и сначала загляните в [Разрешения](./permissions.md):
через MCP запись на уровне `ask` выполняется.

**На этой странице:**

1. [Агенты с терминалом](#agents-with-a-terminal)
2. [Подключите hubspot к MCP-клиенту](#add-hubspot-to-an-mcp-client)
3. [Что видит агент](#what-the-agent-sees)
4. [Записи остаются под вашим контролем](#keep-writes-yours)
5. [ChatGPT и Claude в браузере](#chatgpt-and-claude-in-the-browser)

## Агенты с терминалом

`hubspot skill install` кладет навык инструмента туда, где его ищут Claude Code, Codex, Gemini CLI и OpenClaw. Навык
это файл с инструкциями, который учит агента командам. `hubspot skill install --for hermes` еще и добавляет эту папку
в собственные настройки Hermes Agent, поэтому простой `skill install` Hermes не трогает.

## Подключите hubspot к MCP-клиенту

```sh
hubspot work mcp add claude-code --allow-writes   # or codex
hubspot work mcp check                            # the handshake and the tool list, as the client sees them
```

`--allow-writes` подтверждает, что вы знаете: профиль предлагает инструменты, которые пишут. Это `sync` и расписания
на этом компьютере и записи в HubSpot, которые может сделать только ключ со scope на запись. Для любого другого
клиента `hubspot work mcp config` печатает запись, которую нужно вставить в его настройки. Вручную для Claude Code:

```sh
claude mcp add hubspot -- hubspot work mcp serve
```

Один сервер может обслуживать несколько профилей: `hubspot mcp serve --profiles work,sales` или `--profiles all`.
Тогда каждый вызов называет свой профиль, а агент спрашивает вас, если вы не сказали какой.

## Что видит агент

У сервера три инструмента:

- `hubspot_tools_search` находит команду по словам, с ее аргументами и формой ответа.
- `hubspot_read` запускает команду, которая только читает, например `deals list` или `changes list`.
- `hubspot_write` запускает команду, которая что-то меняет, например `deals move` или `api notes-create`.

Команда называется так же, как в командной строке, без профиля, и проверяет тот же ключ разрешения. Каждая операция
API HubSpot тоже доступна, у каждой свой ключ. Вход и выход через MCP не предлагаются никогда: агент попросит вас
запустить `hubspot work session start` в терминале.

Текст из аккаунта приходит с пометкой «недоверенный»: названия сделок, значения свойств, заметки, имена, адреса
почты, номера телефонов и ссылки, а также то, что находит `search all`. Агенту сказано, что это данные, а не
инструкции.

## Записи остаются под вашим контролем

Через MCP никто не сидит у терминала, чтобы ответить на `ask`, поэтому запись выполняется, и на встроенных уровнях
тоже:

- `deals.delete` по умолчанию стоит на `ask`, поэтому агент может удалить сделку. HubSpot хранит удаленную сделку 90
  дней, и там ее можно восстановить.
- Каждая запись и каждое удаление через `api` по умолчанию стоят на `ask`, поэтому агент может добавлять заметки и
  задачи, сливать записи или менять воронки, насколько позволяют scope ключа.

Выберите одно до того, как добавите сервер:

- Поставьте `readonly` или `deny` для каждой записи, которую агенту делать нельзя:
  `hubspot work config set permissions.deals.delete deny`. Полный список есть в
  [Разрешениях](./permissions.md#what-is-set-before-you-change-anything).
- Или включите подтверждение для инструмента `hubspot_write` в клиенте агента, чтобы клиент спрашивал вас перед
  каждой записью.

Чтобы один сервер был строже профиля, дайте ему свои уровни. Они никогда не ослабляют профиль:

```sh
hubspot work mcp add claude-code --allow-writes --permission deals.delete=deny --permission api=readonly
hubspot work mcp serve --permission people.list=deny
```

## ChatGPT и Claude в браузере

Браузерное приложение доходит до сервера по HTTP через ваш собственный туннель, например Tailscale Funnel. Подставьте
адрес своего туннеля вместо примера `https://laptop.example.ts.net`:

```sh
hubspot work mcp serve --http --public-url https://laptop.example.ts.net
```

Сервер слушает только `127.0.0.1`, порт 8765 (`--port` его меняет). Браузерное приложение входит по одноразовому
коду, который печатает команда. `hubspot work mcp revoke` завершает все входы.

`hubspot work mcp server start` запускает тот же сервер в фоне. `mcp server status` показывает его порт, код входа и
вошедшие приложения, а `mcp server stop` его останавливает.

Еще: [разрешения](./permissions.md), [безопасность](./security.md), [справочник команд](./commands.md#hubspot-mcp).
