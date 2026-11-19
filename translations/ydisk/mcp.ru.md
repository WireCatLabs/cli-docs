---
title: "Подключите агента"
---

Дайте ИИ-агенту доступ к своему Яндекс Диску, чтобы он по вашей просьбе находил документ, цитировал его и раскладывал
файлы. Агент с терминалом сам запускает `ydisk`, когда вы установите навык инструмента. Приложение без терминала,
например Claude Desktop или Cursor, вызывает те же команды через MCP, Model Context Protocol, на котором ИИ-приложения
вызывают инструменты. Что агент может менять, решаете вы.

**На этой странице:**

1. [Агенты с терминалом](#agents-with-a-terminal)
2. [Claude Code и Codex через MCP](#claude-code-and-codex-over-mcp)
3. [Claude Desktop, Cursor и другие приложения с MCP](#claude-desktop-cursor-and-other-mcp-apps)
4. [ChatGPT и Claude в браузере](#chatgpt-and-claude-in-the-browser)
5. [Решите, что агент может менять](#decide-what-the-agent-may-change)

## Агенты с терминалом

Claude Code, Codex, Gemini CLI, OpenClaw и другим агентам, которые запускают команды, нужен только навык: короткий
файл, который учит агента командам и правилам инструмента.

```sh
ydisk skill install
```

Он кладет навык туда, где его ищут Claude Code (`~/.claude/skills/`) и Codex, Gemini CLI и OpenClaw
(`~/.agents/skills/`). `ydisk skill install --for hermes` дополнительно добавляет эту папку в собственные настройки
Hermes Agent, чего простой `skill install` не делает. Запускайте команду снова после обновления. `ydisk skill status`
говорит, совпадает ли установленный навык с этой версией.

Дальше просите обычными словами и называйте профиль:

```text prompt
Use ydisk CLI with profile personal. What did I upload to /Documents/Invoices this month?
List the files with their dates. Do not change anything.
```

## Claude Code и Codex через MCP

Чтобы подключить инструмент к Claude Code или Codex как MCP-сервер, добавьте его одной командой:

```sh
ydisk personal mcp add claude-code --allow-writes
ydisk personal mcp add codex --allow-writes
```

`--allow-writes` подтверждает, что вы знаете: сервер предлагает команды, которые меняют Диск. Что выполнится, все равно
решают разрешения профиля. Подробнее в разделе [Решите, что агент может менять](#decide-what-the-agent-may-change).

## Claude Desktop, Cursor и другие приложения с MCP

```sh
ydisk personal mcp config
```

Команда печатает запись `mcpServers` с полными путями. Вставьте ее в настройки MCP приложения и перезапустите
приложение. Где какое приложение хранит настройки, написано на [странице об агентах](https://wirecat.dev/en/docs/agents).
Печатайте запись заново после смены или обновления Node.js, потому что в ней указан один путь к Node.js.

`ydisk personal mcp check` запускает сервер так, как это сделало бы приложение, и перечисляет инструменты, которые он
предлагает. Запустите ее, если приложение не показывает инструментов `ydisk`.

Один сервер может обслуживать несколько профилей: `ydisk mcp config --profiles personal,work`. Тогда каждый
инструмент спрашивает, какой профиль использовать.

## ChatGPT и Claude в браузере

Приложение в браузере не может запустить программу на вашем компьютере. Поэтому `ydisk` отдает MCP по HTTP на вашем
компьютере, а ваш собственный туннель, например Tailscale Funnel или Cloudflare Tunnel, дает ему адрес `https`:

```sh
ydisk personal mcp server start --public-url https://laptop.example.ts.net
ydisk personal mcp server status
```

Адрес в примере выдуманный. Используйте адрес своего туннеля. Сервер слушает `127.0.0.1`, порт 8765 (`--port` меняет
его) и работает в фоне, пока вы не выполните `ydisk personal mcp server stop`. Приложение в браузере входит по
одноразовому коду, который печатают `server start` и `server status`. `ydisk personal mcp revoke` завершает все
входы. Настройка туннеля и приложения описана на [странице о приложениях в браузере](https://wirecat.dev/en/docs/browser-apps).

## Решите, что агент может менять

MCP-сервер предлагает все команды, в том числе те, что меняют Диск. В терминале инструмент спрашивает перед
удалением, перезаписью и публичной ссылкой, а через MCP спросить некого, поэтому они выполняются. Выберите для
агента один из вариантов:

- **Только чтение.** `YDISK_READ_ONLY=1` в окружении сервера отклоняет любое изменение.
- **Без удаления и без публичных ссылок.** Задайте два разрешения для профиля:

  ```sh
  ydisk personal config set permissions.files.delete deny
  ydisk personal config set permissions.files.share deny
  ```

- **Строже только для одного сервера.** `--permission` у `mcp serve`, `mcp add`, `mcp config` или
  `mcp server start` делает разрешение строже для этого сервера, но никогда не мягче:
  `ydisk personal mcp add claude-code --allow-writes --permission files.delete=deny`.

Агент может синхронизировать [зеркала](./mirrors.md), которые вы добавили (`mirrors list`, `mirrors status`,
`mirrors preview`, `mirrors sync`). Он не может добавить или убрать зеркало, запустить `mirrors watch` или передать
`--allow-deletions` или `--repin`. Синхронизация, которая заменяет или удаляет файл, проверяет `files.delete`, поэтому
`deny` там оставляет агенту синхронизацию только новых файлов.

Через MCP агент читает текст файла командой `files download`, но не может сохранить файл по пути на вашем компьютере.
Все ключи разрешений перечислены в [настройках](./configuration.md#permissions), а что доходит до вашего Диска и сети,
описано в разделе [безопасность](./security.md).

Дальше: [запросы, которые стоит попробовать](./recipes.md).
