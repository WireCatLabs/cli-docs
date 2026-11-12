---
title: "Сравнение с другими инструментами"
---

<a id="what-each-tool-does" />
<a id="if-google-refuses-the-sign-in" />
<a id="where-another-tool-fits-better" />
<a id="compared-with-an-agent-driving-the-drive-web-page" />
<a id="install-and-licence" />
<a id="how-each-mark-was-checked" />
<a id="features" />
<a id="when-another-tool-fits-better" />

Выбирайте инструмент по задаче, которую нужно сделать. На этой странице собраны задачи, которые люди дают инструменту
для Google Drive, и показано, какой инструмент делает каждую из них. Проверено 24 октября 2026 года по `drive` и
собственной документации каждого проекта. Инструмент может делать больше, чем говорит его документация. Такие ячейки
отмечены ➖.

✅ да · 🟡 частично · ❌ нет · ➖ нет в документации · n/a неприменимо

Инструменты:

- **drive**: этот инструмент. Командная строка и MCP-сервер для Google Документов, Таблиц и файлов в выбранных вами
  папках. Они хранятся в локальной копии, в которой можно искать, ставить теги и писать заметки.
- **[gog](https://github.com/openclaw/gogcli)**: командная строка для всего Google Workspace, с множеством команд для
  правки Документов и Таблиц и с MCP-сервером.
- **[Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)**: MCP-сервер для двенадцати сервисов
  Google. Его можно запустить на своём компьютере или развернуть для команды.
- **[rclone](https://github.com/rclone/rclone)**: копирует и синхронизирует файлы между вашим компьютером и Google
  Drive, а также многими другими хранилищами.
- **[Коннектор Google Drive в Claude](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)**:
  встроен в Claude в браузере и в приложении для компьютера. Для правки Документов, Таблиц и Презентаций есть
  отдельные коннекторы.

[gdrive](https://github.com/glotlabs/gdrive) в таблицу не входит. Его README говорит: «only the most basic
functionality is implemented».

## Что делает каждый инструмент

| # | Задача | drive | gog | Workspace MCP | rclone | Claude |
|---|---|:-:|:-:|:-:|:-:|:-:|
| | **Найти документ по содержанию** | | | | | |
| 1 | Найти документ по словам внутри него | ✅ | ✅ | ✅ | ➖ | ✅ |
| 2 | Искать по смыслу, а не только по точным словам, а изображение по тому, что на нём | ✅ | ➖ | ➖ | ➖ | ➖ |
| 3 | Искать по документам без интернета | ✅ | ➖ | ➖ | ➖ | ➖ |
| | **Прочитать документ как текст** | | | | | |
| 4 | Прочитать Google Документ или Таблицу как текст | ✅ | ✅ | ✅ | 🟡 | ✅ |
| 5 | Прочитать файл PDF, Word или Excel как текст | ✅ | ➖ | 🟡 | ➖ | ✅ |
| | **Кто что изменил** | | | | | |
| 6 | Последние действия с документом: кто что сделал и когда | ✅¹ | ✅ | ➖ | ➖ | 🟡 |
| | **Держать локальную копию в актуальном виде** | | | | | |
| 7 | Обновлять локальную копию выбранных папок | 🟡² | ➖ | ➖ | ✅ | ➖ |
| 8 | Держать локальные файлы Markdown и CSV в согласии с Документами и Таблицами в обе стороны и показывать конфликт по частям | ✅ | 🟡 | ➖ | 🟡 | ➖ |
| 9 | Подхватывать изменения сразу, как они происходят | 🟡³ | 🟡 | ➖ | ➖ | ➖ |
| | **Скачать, экспортировать, загрузить** | | | | | |
| 10 | Скачать файл | ✅ | ✅ | ✅ | ✅ | ➖ |
| 11 | Экспортировать Документ или Таблицу в PDF, Word, Excel или CSV | ✅ | ✅ | 🟡 | ✅ | ➖ |
| 12 | Превратить Markdown в оформленный Google Документ | ✅ | ✅ | ✅ | ➖ | ➖ |
| | **Теги и заметки к документам** | | | | | |
| 13 | Ставить на документы свои теги | ✅ | 🟡 | ➖ | 🟡 | ➖ |
| 14 | Хранить заметки и цитаты с фактами рядом с документом | ✅ | ➖ | ➖ | ➖ | ➖ |
| 15 | Найти чат, в котором поделились документом | ✅⁴ | ➖ | ➖ | ➖ | ➖ |
| | **Агенты и безопасность** | | | | | |
| 16 | MCP-сервер для агента | ✅ | ✅ | ✅ | ❌ | n/a |
| 17 | Агент только читает, пока вы не разрешите изменения | ✅ | ✅ | 🟡 | 🟡 | 🟡 |
| 18 | Разрешать или запрещать команды по одной | ✅ | ✅ | ✅ | ➖ | 🟡 |
| 19 | Посмотреть изменение до того, как оно сделано | ✅ | ✅ | ➖ | ✅ | ➖ |
| 20 | Полученный текст помечен для агента как данные, а не инструкции | 🟡 | ✅ | ➖ | ➖ | ➖ |
| 21 | Ваши документы остаются на вашем компьютере | ✅ | ✅ | 🟡 | ✅ | ❌ |
| | **Настройка** | | | | | |
| 22 | Войти без создания своего проекта Google Cloud | 🟡⁵ | ❌ | ❌ | 🟡 | ✅ |
| 23 | Работать из Claude или ChatGPT в браузере и на телефоне | ✅ | ❌ | ✅ | ❌ | ✅ |

¹ Нужно дополнительное разрешение на историю действий при входе. Показывает то, что возвращает журнал действий
Google, а не полную историю правок.

² `drive` хранит текстовые снимки Документов, Таблиц, файлов PDF и Word. Исходные файлы остаются в Google. rclone
копирует сами файлы.

³ `mirrors watch` синхронизирует зеркальные папки, пока команда работает. Это не фоновая служба.

⁴ Нужен инструмент мессенджера из того же семейства (Telegram или MAX), и сообщение уже должно быть сохранено на
вашем компьютере.

⁵ См. следующий раздел.

## Если Google отказывает во входе

Сделать общее приложение Google публичным для Drive сложно, поэтому Google может отказать во входе через приложение
WireCat. Вместо этого можно войти через собственное приложение Google.
Шаги и ссылки на страницы Google есть в разделе [установка](./installation.md#google-shows-an-unverified-app-warning).

## Когда лучше подходит другой инструмент

- **Подробная правка Документов и Таблиц**: gog или Workspace MCP. Для таблиц, колонтитулов, стилей, диаграмм и
  условного форматирования там есть готовые команды. `drive` умеет Markdown, ячейки и простое форматирование таблиц,
  а остальные правки делаются через прямые вызовы API.
- **Резервные копии или перенос больших папок и файлов, которые не являются Документами**: rclone. Он копирует сами
  файлы, синхронизирует их в обе стороны и работает со многими хранилищами. `drive` хранит текст и не копирует
  исходные файлы.
- **Claude или ChatGPT в браузере или на телефоне, без установки**: коннектор Claude или Workspace MCP, запущенный
  как размещённый сервер. `drive` работает на вашем компьютере или сервере и подключается через ваш
  [HTTPS-туннель](./remote.md).
- **Gmail и Календарь в одном инструменте**: gog или Workspace MCP. `drive` работает только с Drive, Документами и
  Таблицами.

## Сравнение с агентом, который работает в веб-интерфейсе Drive

Агент в браузере открывает Drive и нажимает кнопки. `drive` и другие инструменты здесь вызывают API Google. Эта
страница не утверждает, какой способ быстрее, дешевле или надёжнее, потому что опубликованных измерений нет.

## Установка и лицензия

| | drive | gog | Workspace MCP | rclone | Claude |
|---|---|---|---|---|---|
| Установка | npm (Node 22.16+ в линейке 22.x или Node 24+) | Homebrew, Go, Docker, готовые файлы программы | uv, Docker, Helm | один файл программы, большинство менеджеров пакетов | ничего устанавливать не нужно |
| Лицензия | Apache-2.0 | MIT | MIT | MIT | сервис |

Если `drive` подходит, начните с [установки](./installation.md). Как подключить агента, см.
[MCP-сервер](./recipes.md#use-a-local-mcp-client).

## Как проверялась каждая оценка

Оценки `drive` проверены по [проверенному исходному коду](https://github.com/WireCatLabs/drive-cli/tree/v0.27.0):
запуском сборки с пустой домашней папкой (`drive commands --json` и `drive <profile> mcp --tools --json`, которые
выводят список команд и 105 команд, доступных через MCP профилю без входа) и по страницам
[руководство по использованию](./usage.md), [руководство по поиску](./search.md),
[руководство по зеркальным папкам](https://github.com/WireCatLabs/drive-cli/blob/main/docs/mirrors.md),
[настройка](./configuration.md) и [безопасность](./security.md). Там, где оценка означает ограничение (🟡 или ❌),
раздел выше говорит, в чём оно состоит. Удалённый MCP использует защищённый HTTP-сервер и вход по коду доступа из
[руководства по удалённому подключению](./remote.md). Для него нужны ваш собственный запущенный сервер и туннель.

Оценки других инструментов взяты с их собственных страниц. Если поиск по этим страницам ничего не нашёл, ставится ➖,
а не ❌. Исключение: когда список команд полный.

- **gog**
  ([README](https://github.com/openclaw/gogcli/blob/main/README.md),
  [руководство по MCP](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md)).
  Строки 1, 10: [`gog drive search`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-search.md)
  («Full-text search across Drive») и
  [`gog drive download`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-download.md).
  Строка 4: [`gog docs cat`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-docs-cat.md) и
  инструменты MCP `docs_get` и `sheets_read_range`. Строка 6:
  [`gog drive activity query`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-activity-query.md).
  Строка 7: единственная подкоманда `gog drive sync` это
  [`push`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-sync-push.md), поэтому в строках 7 и
  8 нет получения изменений и синхронизация идёт в одну сторону. Строка 9:
  [`gog drive changes watch`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-changes-watch.md)
  настраивает вебхук и не синхронизирует файлы. Строка 11:
  [`gog docs export`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-docs-export.md). Строка 12:
  MCP `docs_write` «optionally as Markdown». Строка 13:
  [`gog drive labels`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-labels.md) это ярлыки
  Google Drive, а не теги, которые хранятся на вашем компьютере. Строки с 16 по 19: README («`gog mcp` ... is read-only
  by default», `--readonly`, точные списки разрешённых команд, планы пробного запуска, обёртка для
  содержимого, которому нельзя доверять). Строка 22: README, «download its JSON file», то есть ваш собственный
  клиент OAuth. Строка 23: руководство по MCP описывает «typed stdio MCP server».
- **Workspace MCP**
  ([README](https://github.com/taylorwilsdon/google_workspace_mcp),
  [инструменты Drive](https://workspacemcp.com/google-drive),
  [инструменты Документов](https://workspacemcp.com/google-docs),
  [инструменты Таблиц](https://workspacemcp.com/google-sheets)).
  Строка 1: `search_drive_files` «speaks the full Drive query syntax». Строка 4: `get_doc_as_markdown`,
  `read_sheet_values`. Строка 5: `get_drive_file_content` читает «uploaded Office files». PDF не назван, поэтому 🟡.
  Строка 10: `get_drive_file_download_url`. Строка 11: `export_doc_to_pdf`. Инструмент скачивания принимает
  `export_format`, но его значения не перечислены, поэтому 🟡. Строка 12: `import_to_google_doc` (Markdown, DOCX, CSV
  и другие). Строки с 16 по 18: README (`--read-only`, `--permissions`, `--tools`, `--disabled-tools`, «run locally over
  stdio»). Строка 21: README, локально или на размещённом сервере. Строка 22: README, «You'll need an OAuth client
  from Google Cloud Console». Строка 23: README, «Claude Desktop, web & mobile ... run the server in HTTP mode» и
  руководство для ChatGPT. В списках инструментов нет инструментов для ревизий, истории действий или ярлыков, поэтому
  в строках 6 и 13 стоит ➖.
- **rclone**
  ([страница Google Drive](https://rclone.org/drive/), [bisync](https://rclone.org/bisync/),
  [список команд](https://rclone.org/commands/)).
  Строка 4: Документы скачиваются как файл в формате из `--drive-export-formats`, который вы выбираете (среди них есть
  `md`), поэтому 🟡. Строки 7, 10, 11: [`sync`](https://rclone.org/commands/rclone_sync/), `copy` и
  `--drive-export-formats`. Строка 8: `bisync`, с разделом о Google Документах и примером с `--drive-skip-gdocs`,
  поэтому 🟡. Строка 13: `--drive-metadata-labels` читает и записывает ярлыки Google Drive, поэтому 🟡. Строка 16: в
  списке команд нет команды MCP. Строка 17: `--drive-scope drive.readonly`, вход только для чтения, поэтому 🟡.
  Строка 19: `--dry-run`. Строка 22: на странице сказано, что общий клиент «is being retired and will stop working
  during 2026».
- **Claude**
  ([Use Google Workspace connectors](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)).
  Строка 1: «Search and retrieve Google Docs». Строки 4, 5: «Read Sheets, Slides, PDFs, images, and MS Office files».
  Строка 6: «list recent changes to your Drive» это список изменений, а не то, кто изменил документ, поэтому 🟡.
  Строки 17, 18: «By default, Claude asks for your approval before each of these actions», а владельцы тарифов Team и
  Enterprise решают, могут ли участники пропускать подтверждение, поэтому 🟡. Строка 21: коннектор читает ваши файлы
  внутри Claude, поэтому ❌. Строки 22, 23: встроен, работает в браузере и в приложении для компьютера. Страница не
  описывает скачивание файла на ваш компьютер или экспорт в PDF, поэтому в строках 10 и 11 стоит ➖.
