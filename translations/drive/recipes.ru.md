---
title: "Полезные запросы"
---

Используйте эти запросы после импорта выбранных папок. Результат можно проверить: ссылки на
источники, сохранённый локальный контекст или предпросмотр перед удалённым изменением.

## Подготовиться к встрече по проекту

```text prompt
Use drive CLI to find the latest budget and launch decisions in my imported documents.
Prepare a short meeting brief with open questions and source links.
Check sync status and tell me about skipped sources. Do not change Google files.
```

Агент ищет по доступной копии и читает подходящие документы. Откройте ссылки и проверьте решения;
обзор не может учесть неподдерживаемые или неимпортированные файлы.

## Связать документ с человеком или проектом

```text prompt
Use drive CLI to show the people observed on this document and its existing links.
Link it to the stored project and person I select, then show the saved context.
Do not merge people merely because their names match.
```

Ручные связи используют ссылку, полученную из той же базы, а не выдуманный ID:

```sh
drive people list DOC_ID --json
drive links add DOC_ID project:PROJECT_ID --kind related-to
drive links add DOC_ID person:PERSON_ID --kind about
drive documents context DOC_ID --json
```

Drive связывает существующие записи, но не создаёт проекты или задачи. Для объединения записей
мессенджера и документов сначала явно настройте общую базу. Разные базы не делят идентификаторы.
См. [настройки](./configuration.md) и [организацию источников](https://wirecat.dev/en/docs/organize).

## Запомнить решение с источником

```text prompt
Use drive CLI to propose a few reusable facts from this imported document.
Show exact supporting quotes. Let me review them before saving or confirming anything.
```

При настроенном ИИ-провайдере:

```sh
drive memories extract DOC_ID --scope work
drive memories extract DOC_ID --scope work --save
```

Первая команда показывает предложения; `--save` сохраняет предложенные записи памяти, а не
подтверждённые факты. Извлечение отправляет выбранный локальный текст настроенному провайдеру.
Поиск по словам и векторам не требует этого внешнего шага генерации текста.
Прочитайте [настройки](./configuration.md) перед включением.

## Использовать локальный MCP-клиент

Для агента без терминала настройте stdio MCP-сервер с исполняемым файлом `drive` и аргументами
`--read-only mcp`. Инструмент и подключённый аккаунт должны быть на компьютере, запускающем сервер.

```sh
drive --read-only mcp --tools --json
drive --read-only mcp
```

Это открывает разрешённые инструменты чтения из того же дерева команд. Это не размещённый
HTTP-сервис для браузерных подключений. Точные операции есть в [справочнике команд](./commands.md).
