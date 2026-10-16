---
title: "Поиск"
---

Эта страница поможет найти то, что вы написали или получили, в ваших заметках, почте или сообщениях
Telegram и MAX, и передать агенту источники, на которых основан ответ. Каждый результат называет свой
источник, поэтому вы можете открыть оригинал и проверить его. Пустой результат означает только то, что в
локальном хранилище нет совпадений; возможно, чат ещё не скачан или папка ещё не импортирована.

## Попросите агента

```text prompt
Use memo CLI to find what was agreed about the Harbour budget, in my notes, mail and messages.
Quote the matching text, show the source of each result and tell me what you could not search.
```

Агент выбирает поиск, читает подходящий текст и показывает вам источники. Каждый из них можно проверить
через `memo notes show` или в исходном приложении.

## Выберите, где искать

| Где это | Команда |
|---|---|
| Вы не знаете | `memo search all 'budget'` |
| В ваших заметках и файлах | `memo search notes 'budget'` |
| В вашей почте | `memo search mail 'budget'` |
| В сообщениях Telegram или MAX | `memo search messages 'budget'` |

`search all` ищет сразу в сообщениях, почте и заметках. Он не ищет людей, память, проекты и
задачи; для них используйте `memo context`, `memo search memories` и `memo tasks list`. Если вы знаете,
где что-то лежит, лучше использовать отдельный поиск по этому месту: он понимает больше слов для поиска.

## Слова для поиска

Поиск находит результаты, в которых есть **каждое** введённое вами слово, включая другие формы слова
(`meeting` находит и `meetings`).

| Что найти | Запрос |
|---|---|
| Все слова | `budget venue` |
| Точная фраза | `"budget review"` |
| Одно из слов | `budget OR invoice` |
| Без слова | `budget NOT cancelled` |
| С тегом | `tag:follow-up` |
| За день или начиная с даты | `date:2026-10-08`, `date:[2026-09-01 TO *]` |
| От кого или кому (почта и сообщения) | `from:kai`, `to:kai@example.com` |
| Тема или папка письма | `subject:invoice`, `mailbox:important` |
| Внутри вложения (сообщения и почта) | `content:invoice`, `filename:*.pdf` |

`content:` сужает поиск до текста файлов, `filename:` — до имён: `memo search messages 'content:invoice'`. Текст доступен после обработки файла tg или max (`tg attachments extract`) либо записи агентом.

Заключайте запрос поиска в одинарные кавычки, чтобы терминал передал его в Memo без изменений:
`memo search notes '"budget review" NOT cancelled'`. `--exact` находит слова только в том виде, в котором
они написаны.

## Сузьте поиск по заметкам

```sh
memo search notes 'budget' --filter 'tag:work'          # only notes with a tag
memo search notes 'budget' --source notes:2              # only one folder, by the id a hit shows
memo search notes 'budget source:internal'               # only notes you wrote in Memo
memo search notes 'budget' --filter 'date:2026-10-08'    # and a second condition
```

`source:file` показывает только заметки из файлов. Поле запроса `source:` обозначает источник самой заметки; параметр `--source` выбирает папки для поиска. Выдаётся по 20 результатов; `--page 2` открывает следующую страницу, а `page.next_page` указывает её номер.

## Поиск в почте

```sh
memo search mail 'from:kai subject:invoice'
memo search mail 'mailbox:important budget'
memo search mail 'budget' --account you@example.com
```

`mailbox:` находит почтовую папку или ярлык Gmail, например `inbox`, `important` или `starred`. Без
`--account` Memo ищет во всех почтовых аккаунтах. Текст внутри вложений тоже ищется
(`filename:` и `content:`).

## Поиск по смыслу

Если модель поиска есть на вашем компьютере, Memo также ищет по смыслу, поэтому по слову `holiday` может
найтись заметка об отпуске. tg или max скачивает модель один раз:

```sh
tg models text download e5-small    # or: max models text download e5-small
```

Модель работает на вашем компьютере. После скачивания выполните `memo sync`, чтобы подготовить заметки
к поиску по смыслу. Каждый результат сообщает, как он найден: по словам, по смыслу или обоими способами.
Без модели Memo пишет "Searched by words only" и всё равно находит каждую заметку, в которой есть эти
слова.

## Что показывает результат

Для заметки результат показывает файл и первую подходящую строку. Под результатами Memo перечисляет
заметки и людей, на которых ссылаются результаты:

```text
Projects/Budget.md
  # Budget review

Linked from these notes
  Kai Sample  (nobody by that name yet)  (1)
```

`nobody by that name yet` означает, что заметка ссылается на имя, которое пока не принадлежит ни одному
известному человеку в локальном хранилище. Добавьте `--json`, чтобы получить ссылку на источник каждого
результата, его ссылки и то, как он был найден.

## Передайте агенту источники

`memo ask` собирает источники для вопроса, чтобы агент мог ответить и сослаться на них:

```sh
memo ask 'What is the Harbour budget?' 'Harbour budget' --all
```

Слова после вопроса задают поиск. Без них Memo ищет весь вопрос, и каждое слово должно совпасть. `--all` ищет во всех аккаунтах; `--provider telegram --account 1` выбирает один. Ответ перечисляет источники с ссылками и текстом, область поиска и пропуски. Memo сам не отвечает на вопрос и не сохраняет ответ.

Memo может также отправить источники настроенному вами провайдеру ИИ и вернуть его ответ: добавьте
`--analyze`, а для провайдера за пределами вашего компьютера — ещё и `--allow-remote`. См.
[настройки](./configuration.md#environment-variables). Ответ провайдера — это сгенерированный текст:
сверьте его с источниками.

Дальше: [посмотрите всё об одном человеке](./people.md) или [превратите найденное в задачу](./tasks.md).
