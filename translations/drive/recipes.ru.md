---
title: "Сценарии"
---

После подключения аккаунта эти сценарии помогут импортировать проект, найти основания ответа
и сохранить контекст. Все команды используют `personal`: замените его своим профилем.
Укажите его и в запросах агенту. [Импорт и хранение](./usage.md) объясняет поддерживаемые форматы
и локальные копии, которые остаются после этих действий.

## Первая папка для поиска без лишних экспортов

```text prompt
Use drive CLI with profile personal to index the project folder I select.
Import supported documents, report skipped files and finish any pending sync batches.
Find one passage about the budget and show its original source link. Do not export extra files.
```

```sh
drive personal folders add FOLDER_ID
drive personal sync --json
drive personal status --json
drive personal search 'budget' --exact --json
drive personal documents show DOC_ID --json
```

Замените `DOC_ID` идентификатором Google найденного источника из `documents list`. Продолжайте
sync, пока остались задания. Точный поиск не требует модели векторов. Без экспортов нет
дополнительных копий; база и управляемые снимки всё равно сохраняются.

<a id="prepare-for-a-project-meeting"></a>

## Обновить проект и подготовиться к встрече

```text prompt
Use drive CLI with profile personal. Refresh my selected folders, then find the latest budget
and launch decisions. Prepare a short meeting brief with open questions and source links.
Tell me about skipped sources and unfinished sync work. Do not change Google files.
```

```sh
drive personal sync --json
drive personal status --json
drive personal search 'budget OR launch' --exact --json
drive personal documents context DOC_ID --json
```

Откройте ссылки Google и проверьте решения. Обзор не охватывает неподдерживаемые или
неимпортированные источники. `documents get` читает доступный Google Doc напрямую без импорта;
возвращает Docs JSON и не добавляет документ в поиск.

## Хранить вопросы рядом с источниками

```sh
drive personal tags add DOC_ID follow-up budget
drive personal notes add DOC_ID 'Confirm whether tax is included' --title 'Budget review'
drive personal documents list --tag follow-up --json
drive personal search 'budget AND tag:follow-up' --exact --json
drive personal notes list DOC_ID --json
```

`--tag` фильтрует метки в списке документов; поиск использует `tag:` внутри запроса.
Прочитайте список заметок, чтобы проверить запись. Меняется локальный контекст, не документ Google.

## Связать документ с человеком или проектом

```text prompt
Use drive CLI with profile personal to show observed editors and existing document links.
Link the document to the stored project and person I select, then show its saved context.
Do not merge people merely because their names match.
```

```sh
drive personal people list DOC_ID --json
drive personal links add DOC_ID project:PROJECT_ID --kind related-to
drive personal links add DOC_ID person:PERSON_ID --kind about
drive personal documents context DOC_ID --json
```

Используйте ссылки из той же базы. Drive связывает существующие записи, но не создаёт проекты
и задачи. Наблюдаемые владельцы/последние редакторы не дают полного списка участников изменений.
Для связи с данными мессенджера сначала явно выберите совместимую общую базу. Разные базы
не разделяют ID. См. [настройки](./configuration.md) и
[организацию источников](https://wirecat.dev/en/docs/organize).

## Запомнить решение с источником

```text prompt
Use drive CLI with profile personal to propose reusable facts from this imported document.
Show exact supporting quotes. Let me review them before saving or confirming anything.
```

После [настройки ИИ-провайдера](./configuration.md#optional-ai-extraction):

```sh
drive personal memories extract DOC_ID --scope work
drive personal memories extract DOC_ID --scope work --save
drive personal memories list DOC_ID --scope work --json
drive personal memories confirm DOC_ID memory:MEMORY_ID
```

Извлечение по умолчанию показывает предварительный результат; `--save` сохраняет предложения.
Заменяйте `MEMORY_ID` полученной ссылкой только после проверки. Изменение или удаление источника
помечает активную память устаревшей. Извлечение отправляет выбранный кешированный текст провайдеру;
локальный поиск по векторам — другая операция. Можно записать факт вручную:
`memories add DOC_ID 'Your fact' --scope work`.

## Посмотреть версии или дополнительную историю

```sh
drive personal documents history DOC_ID --json
drive personal comments list DOC_ID --json
```

Это чтение непосредственно из Google. Версии и комментарии используют Drive API. Для событий
и участников включите Drive Activity API и подключитесь снова с дополнительным разрешением:

```sh
drive personal session start --client-file /path/to/desktop-client.json --activity
drive personal documents history DOC_ID --activity --json
```

Для продолжения передайте полученный токен в `--page-token` той же команды. Видимые Google
версии/события могут быть неполными; это не посимвольная история правок. Комментарии доступны
для просмотра, но не входят в поиск документов.

## Передать Markdown другому инструменту

```sh
drive personal documents export DOC_ID --out ./decision.md
```

Откройте файл или передайте путь инструменту на том же компьютере. Экспорт читает локальный
Markdown: сначала синхронизируйте, если нужна актуальность. Файл не загружается удалённому
агенту. Ненужную дополнительную копию можно удалить после работы; управляемый кеш останется.

## Создать Google Doc и включить в поиск

Используйте этот сценарий, только если хотите изменить Google Drive. Подключитесь с `--write`,
создайте документ и переместите его в выбранную папку:

```sh
drive personal session start --client-file /path/to/desktop-client.json --write
drive personal documents create --title 'Project review'
drive personal documents update NEW_DOC_ID --body '{"requests":[{"insertText":{"endOfSegmentLocation":{},"text":"Review notes\n"}}]}'
drive personal files get NEW_DOC_ID --json
drive personal files move NEW_DOC_ID --to FOLDER_ID --from OLD_PARENT_ID
drive personal sync --json
```

Замените `NEW_DOC_ID` значением `documentId` ответа создания. Docs создаёт его в корне My Drive.
Прочитайте `parents` через `files get` и замените `OLD_PARENT_ID` этим ID; `--from` удаляет прежнего
родителя при добавлении нового. У файла Google один родитель; см.
[официальную инструкцию перемещения](https://developers.google.com/workspace/drive/api/guides/folder#move-files-between-folders).
Проверьте папку и поиск нового текста.
Для правок существующего документа используйте проверку версии Docs `writeControl`, доступную
в [схеме обновления](./commands.md#drive-documents-update). Создание Google Doc из текста поддерживается;
загрузка произвольных PDF/Office/медиа или преобразование локального Markdown в оформленный
Google Doc отдельным сценарием пока не реализованы.

## Использовать локальный MCP-клиент

Для агента без терминала задайте исполняемый файл `drive` и аргументы `personal --read-only mcp`.
Подключённый аккаунт должен находиться на компьютере, где работает сервер.

```sh
drive personal --read-only mcp --tools --json
drive personal --read-only mcp
```

Проверьте инструменты первой командой перед запуском stdio-сервера. Он использует то же дерево
команд, профиль и ограничения. Это не размещённый HTTP-коннектор для браузера. Другие операции
найдите в [полном справочнике](./commands.md).
