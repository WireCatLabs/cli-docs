---
title: "Сценарии"
---

Поручите агенту полную задачу: импортировать проект, подготовить справку, сохранить вопросы
для проверки или вспомнить решение с источниками. Каждый сценарий связывает запрос с командами
и проверкой результата. Примеры используют `personal`; замените его профилем подключённого аккаунта.

Выберите, можно ли обновлять данные Google, менять только локальный контекст или изменять файл
Google. [Импорт и хранение](./usage.md) объясняет содержимое сохранённой копии.

## Выбрать сценарий

| Задача | Использует Google | Меняет локальные данные | Меняет файлы Google |
| --- | --- | --- | --- |
| Импортировать или обновить проект | Да | Индекс и снимки | Нет |
| Подготовить справку из сохранённой копии | Нет | Нет | Нет |
| Добавить теги, заметки и связи | Нет | Да | Нет |
| Предложить память через провайдера ИИ | Отправляет сохранённый текст настроенному провайдеру | Только с `--save` или подтверждением | Нет |
| Проверить комментарии или историю | Да | Без автоматического импорта | Нет |
| Создать или изменить Google Doc | Да | Импортируется при следующей синхронизации | Да |
| Просмотреть и организовать сохранённое дерево папок | Нет | Теги/заметки по запросу | Нет |

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

Прочитайте сохранённые фрагменты и метаданные для проверки решений. Откройте ссылки Google,
когда нужна актуальная версия. Обзор не охватывает неподдерживаемые или
неимпортированные источники. `documents get` читает доступный Google Doc напрямую без импорта;
возвращает Docs JSON и не добавляет документ в поиск.

## Подготовить справку полностью без сети

```text prompt
Use drive CLI with profile personal and --offline. Find budget and launch decisions in the saved
project documents. Prepare a brief with exact passages, source titles and links, and the last sync
information. Do not contact Google or an AI extraction provider through the CLI.
```

```sh
drive personal --offline status --json
drive personal --offline search 'budget OR launch' --exact --json
drive personal --offline documents show DOC_ID --json
drive personal --offline documents context DOC_ID --json
```

Результат использует последнюю сохранённую копию. Нельзя выдавать её дату за новую проверку
Google. `--offline` управляет CLI; облачный агент всё равно может передавать возвращённые
основания своему провайдеру. Для полностью локальной работы проверьте настройки самого агента.

## Сохранить полные доступные метаданные для работы без сети

```text prompt
Use drive CLI with profile personal. Fetch all metadata Google exposes for the file I select,
save the JSON locally, and explain its fields. Read that saved file for later questions instead
of contacting Google again. Do not download its binary contents or change Google files.
```

```sh
drive personal files get FILE_ID --json > ./file-metadata.json
drive personal files list --parent FOLDER_ID --json > ./folder-metadata.json
```

Команды запрашивают все доступные поля метаданных файлов Google. Первая сохраняет ответ одного
файла; вторая — страницу непосредственных детей папки, включая метаданные форматов, содержимое
которых не индексируется. Продолжите по токену следующей страницы для полного списка. Доступные
поля определяются ролями и правилами Google.

Агент может читать сохранённый JSON без Google. Это отдельный снимок под вашим управлением;
он автоматически не импортируется в базу и не становится доступным через `drive search`.
Списки разрешений, комментарии и история — отдельные действия API. Обновляйте или удаляйте
дополнительные JSON-файлы, когда сохранённая версия больше не нужна.

Sync также сохраняет доступный ответ метаданных файла в локальном каталоге. Используйте
`catalog show FILE_ID --offline` без дополнительного JSON-файла. Старые записи содержат только
прежний набор полей до повторного обхода. Разрешения, комментарии и история остаются отдельными API-операциями.

## Просмотреть папки и назначить теги без Google

```text prompt
Use drive CLI with profile personal and only local data. Show the imported folder tree,
find the PDFs last edited by Rin, and show their source links and content availability.
Tag the folder I choose follow-up and save my memo beside it. Do not download or export files.
```

```sh
drive personal catalog import --offline
drive personal catalog tree --depth 3 --offline --json
drive personal catalog list 'mime:"application/pdf" AND person:Rin*' --offline --json
drive personal catalog tags add FOLDER_ID follow-up --offline
drive personal notes add FOLDER_ID 'Check the final version with Rin' --offline
drive personal catalog list 'tag:follow-up' --offline --json
drive personal documents context FOLDER_ID --offline --json
```

`catalog import` переносит прежний кеш в базу; обычный sync заполняет её при новых импортах.
Замените `FOLDER_ID` идентификатором из дерева. Проверьте, что контекст папки содержит тег и заметку.
Тег относится к папке, а не всем потомкам. Файлы с одними метаданными доступны до завершения
скачивания содержимого. Для цитаты убедитесь, что текст индексирован, и используйте `documents show`:
метаданные сами по себе не доказывают содержимого. См. [навигацию и фильтры каталога](./usage.md#browse-and-organize-the-local-catalog).

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
drive personal identities list DOC_ID --json
drive personal relationships add DOC_ID project:PROJECT_ID --kind related-to
drive personal relationships add DOC_ID person:PERSON_ID --kind about
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
drive personal facts list DOC_ID --status proposed --json
drive personal memories confirm DOC_ID memory:MEMORY_ID
drive personal facts confirm DOC_ID fact:FACT_ID
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

Для продолжения передайте полученный токен в `--cursor` той же команды. Видимые Google
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
drive personal files move NEW_DOC_ID --parent FOLDER_ID --old-parent OLD_PARENT_ID
drive personal sync --json
```

Замените `NEW_DOC_ID` значением `documentId` ответа создания. Docs создаёт его в корне My Drive.
Прочитайте `parents` через `files get` и замените `OLD_PARENT_ID` этим ID; `--old-parent` удаляет прежнего
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
