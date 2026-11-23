---
title: "Готовые сценарии"
---

Целые задачи, которые можно поручить агенту. У каждой есть запрос, который можно скопировать, и команды, которые
агент выполнит. Предполагается, что вы уже [вошли в аккаунт](./installation.md), выбрали папки и
[подключили агента](./mcp.md). Замените профиль, пути и имена на свои. Те, что в примерах, выдуманные.

**На этой странице:**

1. [Найдите договор и процитируйте условия](#find-a-contract-and-quote-its-terms)
2. [Ответ по файлу вне выбранных папок](#answer-from-a-file-outside-the-chosen-folders)
3. [Уберите счета прошлого года в архив](#tidy-last-years-invoices-into-an-archive)
4. [Поделитесь файлом и закройте ссылку потом](#share-a-file-and-close-the-link-later)
5. [Положите на Диск отчет, который написал агент](#put-a-report-the-agent-wrote-on-the-disk)
6. [Отредактируйте файл с агентом](#edit-a-file-with-your-agent)
7. [Отмените удаление](#undo-a-delete)
8. [Обновляйте копию каждое утро](#keep-the-copy-current-every-morning)

## Найдите договор и процитируйте условия

```text prompt
Use ydisk CLI with profile personal. Find the contract with Harbour Ltd in my Disk folders.
Quote the payment terms and the notice period, and give me the file's path on the Disk. Do not change any files.
```

```sh
ydisk personal search "Harbour Ltd contract" --json
ydisk personal documents show 1a2b3c --json
```

Агент ищет по копии, а потом читает весь текст лучшего результата. Если копия устарела, он сначала запускает
`ydisk personal sync`.

## Ответ по файлу вне выбранных папок

```text prompt
Use ydisk CLI with profile personal. Open /Work/Q3/report.xlsx on my Disk and tell me the total for September.
```

```sh
ydisk personal files download /Work/Q3/report.xlsx --json
```

`files download` без `--output` отвечает текстом файла, поэтому на вашем компьютере ничего не сохраняется. Текст
длиннее 200 000 символов обрезается, и в ответе стоит `truncated: true`. Сами ячейки с их формулами по адресам
покажет `ydisk personal files sheets show /Work/Q3/report.xlsx`.

## Уберите счета прошлого года в архив

```text prompt
Use ydisk CLI with profile personal. Move every invoice from 2025 in /Documents/Invoices to /Archive/Invoices-2025.
Show me the list before you move anything.
```

```sh
ydisk personal files list --folder /Documents/Invoices --json
ydisk personal files create /Archive/Invoices-2025
ydisk personal files move /Documents/Invoices/2025-03.pdf --folder /Archive/Invoices-2025 --dry-run
ydisk personal files move /Documents/Invoices/2025-03.pdf --folder /Archive/Invoices-2025
```

`--dry-run` показывает, что сделал бы перенос, но ничего не делает. При переносе теги и заметки файла в копии
сохраняются.

## Поделитесь файлом и закройте ссылку потом

```text prompt
Use ydisk CLI with profile personal. Make a public link to /Documents/Flat/lease-2026.pdf so I can send it to Bob.
```

```sh
ydisk personal files publish /Documents/Flat/lease-2026.pdf
ydisk personal files unpublish /Documents/Flat/lease-2026.pdf
```

Файл откроет любой, у кого есть публичная ссылка. В терминале инструмент сначала спрашивает. Через MCP он учитывает
разрешение `files.share`, см. [подключение агента](./mcp.md#decide-what-the-agent-may-change).

## Положите на Диск отчет, который написал агент

```text prompt
Use ydisk CLI with profile personal. Save the summary you just wrote as summary.md in /Reports on my Disk.
```

```sh
ydisk personal files upload ./summary.md --folder /Reports
```

Загрузка отклоняет файлы с учетными данными, профили браузеров и папки WireCat, поэтому агент не отправит их на Диск
по ошибке.

## Отредактируйте файл с агентом

Агент читает файл, правит его и записывает обратно с тем `sha256`, который прочитал. Если кто-то за это время
изменил файл, запись отклоняется и ничего не загружается: агент читает файл заново и повторяет правку. То, что
заменила каждая правка, сохраняется на этом компьютере.

Заметка в Markdown:

```text prompt
Use ydisk CLI with profile personal. In /Notes/plan.md on my Disk, tick "send the invoice" and add
"call the bank" under Friday. Keep everything else as it is.
```

```sh
ydisk personal files download /Notes/plan.md --json
ydisk personal files update /Notes/plan.md --expected-fingerprint <sha256 from the download> < plan.md
```

Скачивание отвечает всем текстом и его `sha256`. У текста, обрезанного на 200 000 символах, `sha256` нет, поэтому
записать его обратно нельзя.

Таблица:

```text prompt
Use ydisk CLI with profile personal. In /Work/budget.xlsx, set the March rent to 1300 and mark it paid.
```

```sh
ydisk personal files sheets show /Work/budget.xlsx "Sheet1!A1:D20" --json
ydisk personal files sheets update /Work/budget.xlsx "Sheet1!B3:C3" --values '[[1300, "paid"]]' --expected-fingerprint <sha256>
```

Меняются только эти ячейки. Форматирование, другие листы и формулы остаются. Ячейка с формулой отклоняется, если
агент не добавит `--replace`.

Документ Word:

```text prompt
Use ydisk CLI with profile personal. In /Work/letter.docx, replace the second paragraph with
"The pond opens on Monday." and add "Kind regards, Anna" at the end.
```

```sh
ydisk personal files documents show /Work/letter.docx --json
ydisk personal files documents update /Work/letter.docx --payload '[{"index": 1, "text": "The pond opens on Monday."}, {"insert_after": 5, "text": "Kind regards, Anna"}]' --expected-fingerprint <sha256>
```

Абзацы сохраняют свой стиль. Абзац с исправлением в режиме рецензирования, картинкой, комментарием или ссылкой
отклоняется с указанием причины, чтобы агент мог сказать вам об этом.

Чтобы отменить правку:

```sh
ydisk personal files history /Work/letter.docx
ydisk personal files restore /Work/letter.docx <version> --expected-fingerprint <sha256 the file has now>
```

## Отмените удаление

```text prompt
Use ydisk CLI with profile personal. I deleted old.pdf from my Disk by mistake. Bring it back.
```

```sh
ydisk personal api trash-resources-list --json
ydisk personal files restore trash:/old.pdf
```

`files delete` переносит файл в корзину Диска, поэтому его можно вернуть, пока корзина не очищена.

## Обновляйте копию каждое утро

В фоне ничего не синхронизируется. Чтобы копия обновлялась каждое утро, запускайте `sync` из планировщика системы,
например cron в Linux и macOS:

```text
0 8 * * * ydisk personal sync --quiet
```

Эта строка запускает синхронизацию каждый день в 8:00. Если cron не находит `ydisk`, укажите полный путь, который
печатает `which ydisk`. Когда закончилась последняя синхронизация, покажет `ydisk personal status`.
