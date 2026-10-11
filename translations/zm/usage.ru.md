---
title: "Использование"
---

Группы команд, результаты, сроки выполнения и отмена для скриптов и агентов.
[Все команды и параметры](./commands.md) формируются из программы.

## Команды

| Команда | Назначение |
|---|---|
| `config show` | показать локальные настройки |
| `config set <key> <value>` | настроить публичный клиент или файловый источник |
| `login [--browser <program>]` | разрешить доступ через браузер |
| `commands --json` | показать аргументы, параметры и примеры |
| `complete -- <words...>` | ответить на дополнение команд |
| `doctor` | проверить среду и публичные настройки без входа или базы |
| `session status` | проверить OAuth отдельно от профилей данных |
| `import <folder>` | импортировать скачанные расшифровки в выбранный профиль |
| `pull [--since <date>]` | загрузить встречи из настроенного источника |
| `meetings list`, `meetings show <meeting>` | прочитать сохранённые встречи |
| `meetings transcript <meeting>` | прочитать текущие расшифровки |
| `meetings summary <meeting>` | прочитать сохранённые сводки |
| `meetings export <meeting> --format markdown\|vtt` | экспортировать данные встреч |
| `meetings search <query>`, `meetings people <query>` | найти сохранённый текст или участников |
| `meetings search-page <query>`, `meetings search-index` | продолжить поиск и явно индексировать слова |
| `meetings link-event <reference>`, `meetings link-person <reference>` | просмотреть или применить выбранные связи |
| `meetings transcribe <meeting> <file> --model <model>` | просмотреть или локально распознать WAV в отдельную расшифровку |
| `meetings evidence <reference>`, `meetings context <person>` | прочитать ограниченные источники или контекст связанного человека |
| `meetings task-proposal <reference> --kind <kind>` | просмотреть задачу со ссылкой на встречу |
| `meetings semantic <query> --model <id>` | ранжировать просмотренные векторы выбранным компонентом |
| `meetings embeddings --model <id>` | просмотреть генерацию; `--yes` обрабатывает одну порцию |
| `search all <query>` | искать встречи или явно выбранные общие ресурсы |
| `events list` | прочитать сохранённые события |
| `watch [folder] --source api\|files --jsonl` | повторно импортировать источник в текущем процессе |
| `recordings list`, `recordings show <meeting>` | найти облачные записи и метаданные файлов |
| `recordings download <meeting> --destination <directory>` | архивировать доступные файлы |
| `recordings sync --from <date> --to <date> --destination <directory> --jsonl` | архивировать историю по календарным месяцам |
| `recordings schedule create\|list\|show\|run\|disable` | управлять ежедневными архивными заданиями |
| `recordings archive inspect\|verify\|locks <directory>` | проверить локальные манифесты, суммы или блокировки |
| `recordings archive recover <directory>` | просмотреть восстановление устаревших блокировок |
| `recordings archive transcript <directory>` | прочитать проверенные WebVTT-фрагменты без базы |
| `recordings archive search <directory> <query>` | искать проверенный текст без базы |
| `recordings archive import <directory>` | проверить VTT и добавить к сохранённым встречам |
| `remote-meetings list\|show\|invitation` | прочитать будущие встречи и приглашения |
| `remote-meetings create\|update\|cancel` | просмотреть или применить простое изменение Zoom |
| `serve --mcp` | предоставить чтение встреч через MCP stdio |
| `skill show`, `skill install --for agents` | показать или явно установить инструкции агенту |

`meetings` использует локальные ID, `remote-meetings` — числовые ID Zoom.
[Управление встречами](./remote-meetings.md) описывает изменения.

## Вывод для скриптов и агентов

`--json` выдаёт одно значение, `--jsonl` — объект на строку. Ошибки идут в stderr; `--quiet` убирает
прочую диагностику. Конвейер по умолчанию получает JSON, терминал — удобный для чтения вывод.
Дополнение команд возвращает протокол оболочки, если не выбран JSON.

`--fields id,title` выбирает поля. `--offline` запрещает сеть. Конечные команды сохраняют успешный
вывод до завершения освобождения ресурсов; предел по умолчанию 4 МиБ. `--max-output-bytes 0` снимает его.

## Сроки и отмена

`--timeout <milliseconds>` задаёт положительный срок всей команды. Можно использовать `30s`, `5m`
и `1h`. По умолчанию чтению даётся 30 секунд, входу — пять минут, загрузке записей, синхронизации и
проверке архива — час. Наблюдение и MCP не имеют стандартного срока. Отмена ждёт операции и очистку;
внедрённая операция, игнорирующая сигнал, может задержать завершение.
