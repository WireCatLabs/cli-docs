---
title: "Подключение агента"
description: "Настройте Codex, Cursor, Claude Code, Gemini CLI или Hermes для Telegram и MAX."
---

Установщик Windows уже ставит навык до входа. Прочитайте `tg skill show` или `max skill show` и проверьте, что агент загрузил навык. Команды ниже обновляют навык или устанавливают его отдельно после другого способа установки.

Сначала [установите CLI и войдите](./installation.mdx). Локальный агент вызывает `tg` или `max`
в терминале. **Skill** учит его командам, форматам ответов и сценариям работы; установка CLI
и вход всё равно нужны. [MCP](./mcp.md) — другой способ дать агенту инструменты.

## Выберите агента

Выполните команду своего мессенджера. Если используете оба — выполните обе.

| Агент | Telegram | MAX | Где лежит skill |
|---|---|---|---|
| Codex | `tg skill install --for agents` | `max skill install --for agents` | `~/.agents/skills/<tool>-cli/SKILL.md` |
| Cursor Agent | `tg skill install --for agents` | `max skill install --for agents` | `~/.agents/skills/<tool>-cli/SKILL.md` |
| Claude Code | `tg skill install --for claude` | `max skill install --for claude` | `~/.claude/skills/<tool>-cli/SKILL.md` |
| Gemini CLI | `tg skill install --for agents` | `max skill install --for agents` | `~/.agents/skills/<tool>-cli/SKILL.md` |
| Hermes | Сохраните `tg skill show`, как описано ниже | Сохраните `max skill show`, как описано ниже | `~/.hermes/skills/<tool>-cli/SKILL.md` |

`<tool>-cli` — это `tg-cli` или `max-cli`. `~` означает домашний каталог, в том числе на Windows.
Без `--for` команда `skill install` устанавливает сразу в `.claude/skills` и `.agents/skills`.

### Codex

Используйте локальный Codex в CLI или IDE. Он находит пользовательские skills в `~/.agents/skills`.
Выберите `$tg-cli` или `$max-cli` в разговоре; если новый skill не появился, перезапустите Codex.
Команда CLI должна быть на PATH агента.
[Официальная инструкция Codex](https://learn.chatgpt.com/docs/build-skills).

### Cursor

Используйте режим **Agent** с доступом к терминалу. Cursor читает общий каталог `~/.agents/skills`.
Найдите `tg-cli` или `max-cli` через `/` в чате Agent. Если новый skill не появился, перезапустите
Cursor. Также можно [подключить MCP](./mcp.md#cursor-и-claude-desktop).
[Официальная инструкция Cursor](https://cursor.com/help/customization/skills).

### Claude Code

В локальной сессии Claude Code вызовите `/tg-cli` или `/max-cli`. Пользовательские skills
лежат в `~/.claude/skills`. При работающем терминале MCP необязателен.
[Официальная инструкция Claude Code](https://code.claude.com/docs/en/skills).

### Gemini CLI

Проверьте наличие `tg-cli` или `max-cli` через `gemini skills list`. В запущенной сессии
обновите список через `/skills reload`. Gemini поддерживает общий каталог `~/.agents/skills`.
[Официальная инструкция Gemini](https://geminicli.com/docs/cli/skills/).

### Hermes

У Hermes свой каталог skills. Попросите его создать `~/.hermes/skills/tg-cli/SKILL.md`
из **точного вывода** `tg skill show`, либо `~/.hermes/skills/max-cli/SKILL.md` из `max skill show`.
Сохраните frontmatter и текст в UTF-8. Для Telegram на macOS или Linux:

```sh
mkdir -p ~/.hermes/skills/tg-cli
tg skill show > ~/.hermes/skills/tg-cli/SKILL.md
```

Для MAX используйте `max-cli` в пути и `max skill show`. Начните новую сессию Hermes и вызовите
`/tg-cli` или `/max-cli`. В его окружении должны быть CLI и та же сессия аккаунта.
[Официальная инструкция Hermes](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills/).

## Проверьте подключение

Попросите агента: **«Используй tg-cli / max-cli: проверь мой аккаунт и покажи пять чатов.
Затем разбери непрочитанные сообщения по чатам и скажи, кому нужно ответить. В этой задаче только читай».**

Агент должен выполнить `account show`, `chats list --limit 5` и `inbox --limit 5` или аналогичные
MCP-инструменты. Если команда не находится, переоткройте редактор после установки Node/npm;
см. [Windows и PATH](./installation.mdx#windows). При отсутствии сессии войдите в том же
окружении и профиле, которые использует агент.

## CLI уже предлагает skill

При установленной `AI_AGENT` или `CLAUDECODE` оба CLI предлагают `skill install`, если копия
skill отсутствует или старее CLI. Подсказка появляется на stderr, максимум раз в сутки;
JSON на stdout остаётся пригодным для обработки. После обновления CLI повторите команду
установки выше. Для Hermes обновите файл из `skill show`.

## Другие клиенты

Для **Claude Desktop** используйте [MCP](./mcp.md#cursor-и-claude-desktop).
Агенту без поддержки skills дайте [Markdown-документацию](./mcp.md#документация-для-агента).
Для облачного агента установите CLI и войдите в его окружении выполнения: локальная сессия
туда автоматически не переносится.
