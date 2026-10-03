---
title: "MCP и документация"
description: "Что даёт MCP, как подключить своего агента и как агент читает документацию WireCat."
---

**MCP даёт агенту инструменты для вашего аккаунта:** список чатов, чтение входящих, поиск,
подготовку ответов и действия, разрешённые профилем. Клиент получает имена инструментов,
параметры и структурированные ответы. MCP-сервер уже входит в `tg` и `max`.

## CLI, skill или MCP?

| Способ | Что даёт | Когда выбрать |
|---|---|---|
| CLI | Команды в терминале с JSON-ответами | У агента уже есть локальный терминал |
| Skill + CLI | Инструкцию по командам и сценариям | Используете Codex, Cursor Agent, Claude Code, Gemini CLI или Hermes |
| MCP | Инструменты и их параметры прямо в клиенте | Используете Claude Desktop или предпочитаете интерфейс инструментов |
| Markdown-доки | Понятное описание и справку по командам | Агенту нужно узнать, как что-то работает |

Для агента с терминалом начните со [skill](./agents.md). MCP необязателен и использует те же
права профиля, что CLI. Вход и скачивание архива выполняются отдельно.

## Перед подключением

[Установите CLI постоянно и войдите](./installation.mdx). Выполните `tg mcp config` или
`max mcp config`: команда напечатает настройки с настоящими путями Node и CLI на вашей машине.
Она показывает конфигурацию, а не редактирует клиент. PATH у приложения с рабочего стола
может отличаться от PATH терминала.

### Codex

В терминале, где установленная команда уже работает:

```sh
codex mcp add tg -- tg mcp
codex mcp add max -- max mcp
codex mcp list
```

Подключите только нужные мессенджеры. Codex хранит MCP в `~/.codex/config.toml`.
Для Windows или IDE с другим PATH возьмите `command`, `args` и `env` из `mcp config`
и добавьте в `[mcp_servers.tg]` или `[mcp_servers.max]`: Codex использует TOML.
[Официальная инструкция Codex MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).

### Claude Code

```sh
claude mcp add --scope user tg -- tg mcp
claude mcp add --scope user max -- max mcp
claude mcp list
```

В сессии проверьте состояние через `/mcp`. Для полных путей используйте значения из `mcp config`.
[Официальная инструкция Claude Code MCP](https://code.claude.com/docs/en/mcp).

### Cursor и Claude Desktop

Скопируйте запись сервера из `tg mcp config` или `max mcp config` в `mcpServers` клиента,
сохранив полные пути и переменные окружения. Добавьте запись к существующим серверам.

| Клиент | Файл настроек |
|---|---|
| Cursor, личные | `~/.cursor/mcp.json` |
| Cursor, проект | `.cursor/mcp.json` |
| Claude Desktop, macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Desktop, Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

Перезапустите клиент и проверьте наличие инструментов сервера.
[Официальная инструкция Cursor MCP](https://cursor.com/help/customization/mcp).

### Gemini CLI

```sh
gemini mcp add --scope user tg tg mcp
gemini mcp add --scope user max max mcp
gemini mcp list
```

Для полных путей и окружения добавьте сгенерированную запись в `mcpServers` файла
`~/.gemini/settings.json`. [Официальная инструкция Gemini MCP](https://geminicli.com/docs/tools/mcp-server/).

### Hermes

Hermes использует `mcp_servers` в `~/.hermes/config.yaml`. Добавьте туда `tg` или `max`
со значениями `command`, `args` и `env` из сгенерированной конфигурации. Сохраните существующие
настройки. Hermes использует YAML, поэтому весь объект JSON `mcpServers` туда не вставляется.
Перезапустите Hermes. [Официальный старт Hermes](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart/).

## Что агенту разрешено

Набор действий определяется правами профиля. `mcp config --confirm-send` создаёт подключение
с подтверждением изменений; клиент должен поддерживать формы подтверждения MCP.
Профиль только для чтения и полный список инструментов описаны в [MCP Telegram](./tg/mcp.md)
и [MCP MAX](./max/mcp.md). Первая проверка подключения — попросить показать пять чатов.

## Документация для агента

MCP мессенджера обращается к вашему аккаунту. Документация доступна отдельно:

| Ресурс | Что дать агенту |
|---|---|
| [Список страниц](/llms.txt) | `https://wirecat.dev/llms.txt` — найти нужную страницу и открыть её Markdown |
| [Все страницы](/llms-full.txt) | `https://wirecat.dev/llms-full.txt` — вся справка для инструментов, поддерживающих большой документ |
| Одна страница | **Копировать Markdown** или **Открыть** вверху страницы доков |

Запрос: **«Прочитай https://wirecat.dev/llms.txt, найди документацию входящих Telegram и
используй её, чтобы разобрать мои непрочитанные сообщения».** Если агент не открывает URL,
скопируйте Markdown нужной страницы в чат.

Сейчас WireCat предоставляет эти Markdown-ресурсы; опубликованного MCP-сервера документации
пока нет. Для чтения страниц дополнительный сервер не нужен. MCP документации добавил бы
поиск и получение страниц как инструменты; это отдельный сервис от `tg mcp` и `max mcp`.

Если подключение не работает, проверьте полные пути, версию Node, профиль и одинаковые каталоги
настроек в клиенте и терминале. Подробности окружения есть в справке MCP
[Telegram](./tg/mcp.md) и [MAX](./max/mcp.md).
