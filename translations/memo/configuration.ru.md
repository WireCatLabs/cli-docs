---
title: "Настройки"
---

На этой странице перечислены все параметры файла настроек Memo и все переменные окружения, которые
читает Memo. Используйте её как справочник; редактировать файл вручную приходится редко.
`memo folders add` добавляет папку, а `memo auto start` включает таймер за вас. Вручную в файле задаются
файлы, которые нужно пропускать, почтовые аккаунты и место для экспортированных заметок.

Файл находится здесь: `~/.config/cli-memo/config.json`. Это файл JSON: сохраняйте кавычки, запятые и
фигурные скобки так, как в примере.

```json
{
  "notes": {
    "folders": [{ "id": "1", "path": "/path/to/vault", "format": "obsidian" }],
    "ignore": ["Journal/Private.md", "Archive", "**/Private*"],
    "embed": true,
    "export": { "dir": "/path/to/vault/memo", "format": "obsidian" }
  },
  "mail": {
    "accounts": [{ "name": "work", "address": "you@example.com" }],
    "max_body_chars": 1000000,
    "max_attachment_chars": 200000
  },
  "auto": { "enabled": true, "every": "5m" }
}
```

## `notes`

| Ключ | Значение |
|---|---|
| `folders` | Ваши папки с заметками. У каждой есть `id`, который ей присвоило локальное хранилище, `path` на этом компьютере и `format`: `obsidian` (по умолчанию) или `markdown`. `memo folders add` добавляет запись; запись без `id` импорт отклоняет. См. [Markdown или Obsidian](./notes.md#markdown-or-obsidian). |
| `ignore` | Файлы и папки, которые импорт пропускает: путь внутри папки, папка или шаблон, например `**/Private*`. `--ignore` добавляет правила на один запуск. |
| `embed` | `false` исключает заметки из поиска по смыслу. |
| `export` | `dir` и `format` для `memo notes export` и `--export`, когда вы не указываете папку. |

`id` папки одинаковый на всех компьютерах, а `path` на каждом свой. См.
[одни и те же заметки на другом компьютере](./notes.md#use-the-same-notes-on-another-computer).

## `mail`

`accounts` перечисляет почтовые аккаунты для импорта. У каждого аккаунта есть:

| Ключ | Значение |
|---|---|
| `name` | Имя аккаунта в Himalaya; его принимает `memo sync --source email:<name>`. |
| `address` | Адрес электронной почты. |
| `mode` | `gmail` (по умолчанию), `imap` или `mbox` для файла Google Takeout. |
| `path` | Для `mbox`: файл Takeout, например `~/Takeout/Mail/All mail Including Spam and Trash.mbox`. |
| `folders` | Для `imap`: папки почты, например `["INBOX", "Archive"]`. |
| `embed` | `false` исключает почту аккаунта из поиска по смыслу. |
| `rules` | Читается только для переноса правил в хранилище: с 0.32.0 они хранятся там, управление — `memo mail rules`. См. [Почта](./mail.md#choose-what-to-import). |

Рядом с `accounts`:

| Ключ | Значение |
|---|---|
| `max_body_chars` | Сколько символов каждого письма сохраняется. По умолчанию 1 000 000. |
| `max_attachment_chars` | Сколько символов текста каждого вложения сохраняется. По умолчанию 200 000. |

Настройки называются в snake_case; имя в camelCase отклоняется.

См. [Почта](./mail.md).

## `auto`

| Ключ | Значение |
|---|---|
| `enabled` | `true`, если таймер импорта включён. |
| `every` | Частота: `90s`, `5m`, `1h`; интервал не меньше минуты. |
| `places` | Переменные путей memo и хранилища (`MEMO_CONFIG_DIR`, `MESSAGING_STORE`…), сохранённые при `memo auto start`; передаются каждому запуску таймера. |

`memo auto start` и `memo auto stop` записывают эти значения. Если вы измените их вручную, таймер учтёт
это при следующем запуске. См. [импорт по таймеру](./archive.md#import-on-a-timer-linux).

## `update_check`

`false` отключает ежедневную проверку новой версии memo. `MEMO_NO_UPDATE_CHECK=1` делает то же для одной оболочки.

## Переменные окружения

| Переменная | Значение |
|---|---|
| `MEMO_CONFIG_DIR` | Папка, в которой лежит `config.json`. |
| `MEMO_STATE_DIR` | Папка состояния Memo: как выглядела каждая папка при последнем импорте. |
| `MEMO_MODELS_ANALYSIS_PROVIDER`, `MEMO_MODELS_ANALYSIS_MODEL` | Провайдер ИИ и идентификатор модели (имя, под которым её знает провайдер), к которым обращается `memo ask --analyze`. |
| `MEMO_MODELS_ANALYSIS_BASE_URL` | Необязательно: адрес провайдера. |
| `MEMO_MODEL_API_KEY` | Ключ провайдера. |

Memo обращается к провайдеру за пределами вашего компьютера, только когда у `memo ask` указаны и
`--analyze`, и `--allow-remote`. См. [передайте агенту источники](./search.md#give-your-agent-the-sources).
