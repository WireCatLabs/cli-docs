---
title: "Задачи и напоминания"
---

Эта страница поможет следить за тем, что вам нужно сделать: за просьбой в сообщении, обещанием в
заметке или работой в одном из ваших проектов. Задача, созданная из сообщения или заметки, указывает на
них. Поэтому вы всегда видите, откуда взялась задача. Напоминания остаются на вашем компьютере: Memo
никогда не отправляет их в мессенджер или почтовый ящик.

## Задача из сообщения или заметки

**Проще всего — попросить агента.**

```text prompt
Use memo CLI to find the messages from this week where someone asked me for something.
Show them to me first. Make a task only for the ones I choose.
```

**Или выполните команду сами.** Скопируйте ссылку на источник из результата поиска:

```sh
memo tasks add 'msg:telegram/1/77/42' --type request
memo tasks add note:12 --account telegram:1 --type promise
memo tasks list --source telegram:1
```

У задачи из источника есть тип: `request` (по умолчанию), `question`, `mention` или `promise`. Она
относится к одному аккаунту. Ссылка на сообщение уже содержит аккаунт, а файл из папки заметок
(`document:<id>`) относится к этой папке. Для заметки, которую вы написали через `memo notes add`, добавьте
`--account`, например `--account telegram:1` или папку заметок, `--account notes:1`. Если добавить ту же задачу
дважды, вы получите уже существующую.

Папка заметок — тоже аккаунт: номер папки search выдаёт как `folder_id`, а Memo принимает его как
`notes:<number>` или как `folder:<id>`, который показывают её сообщения. `--source notes` указывает вашу папку,
если она одна. `memo tasks list` и `memo reminders list` без `--source` читают все аккаунты и называют их в
`meta.accounts`.

## Что требует внимания сегодня

Повестка, план и карточка — те же команды, что в tg и max. Каждая читает один аккаунт; укажите его:

```sh
memo tasks agenda --source telegram:1           # overdue, due, owed and waiting chats
memo tasks plan 1a2b3c4d --due 2d --remind-time 1d --title 'Send the revised budget' --account telegram:1
memo tasks show 1a2b3c4d --source telegram:1
memo stats tasks show --source telegram:1       # open tasks per chat
memo tasks agenda --source notes                # tasks from your notes folder
```

Без `--source` или `--account` команда перечисляет аккаунты в хранилище. tg и max открывают эти задачи при синхронизации; memo читает то же хранилище.

## Задачи в проекте

Задаче в проекте не нужен источник. Она получает ключ из ключа проекта и номера, например `HRB-1`:

```sh
memo tasks add --project HRB --title 'Book the venue' --priority 1
memo tasks add --project HRB --title 'Export drops the last row' --type bug
memo tasks list project:HRB
memo tasks update HRB-1 --priority 0 --description 'Call before Friday'
```

Простой `memo tasks list` показывает только задачи ваших аккаунтов; задачи проекта выводятся через
`project:` и ключ проекта.

| Параметр | Значение |
|---|---|
| `--type` | `chore` (по умолчанию), `bug` или `feature` |
| `--priority` | число от 0 (срочно) до 4 (низкий приоритет) |
| `--parent` | более крупная задача в том же проекте, частью которой является эта |
| `--description` | подробности в формате Markdown |
| `--assignee` | кто выполняет задачу, по ID человека |

Как сначала создать проект, см. [организации и проекты](./people.md#organizations-and-projects).

## Кто работает над задачей

```sh
memo tasks assign HRB-1 PERSON_UID
memo tasks assign HRB-1 PERSON_UID --role reviewer
```

Роль — `assignee` (по умолчанию), `reviewer` или `watcher`. ID человека берётся из его контекста
(`memo context … --json`). Задачи, назначенные человеку, видны в
[его контексте](./people.md#everything-about-a-person).

## Закройте задачу

```sh
memo tasks close HRB-1 --reason booked
memo tasks close 7 --account telegram:1 --as dismissed
```

Закройте задачу через `--as done` (по умолчанию) или `--as dismissed`. `memo tasks list state:done` показывает закрытые задачи; с `project:` поле `kind:bug` сужает вид. `source:"note:12"` оставляет задачи аккаунта из одного сообщения, заметки или документа — этот шаг `memo search all` предлагает для результата, на который ссылаются задачи. Каждое изменение статуса, приоритета или исполнителя сохраняется с задачей.

## Что делать в первую очередь

Одна задача может ждать другую. Свяжите их, затем спросите Memo, какие задачи можно начинать:

```sh
memo tasks link HRB-2 HRB-1 --kind blocked-by     # HRB-2 waits for HRB-1
memo tasks list project:HRB ready:true          # tasks with nothing left to wait for
memo tasks status HRB-2                           # why HRB-2 can or cannot start
memo tasks relations HRB-2
memo tasks unlink HRB-2 HRB-1 --kind blocked-by
```

`tasks link` также принимает другую задачу как `task:HRB-1`. Иная цель — сообщение, чат, человек или URL — связывает задачу аккаунта с её предметом и требует `--account`:

```sh
memo tasks link 12 msg:telegram/500/7/101 --account telegram:500
```

Задача становится готовой, только когда выполнены все задачи, которые она ждёт. Если одна из
них закрыта как ненужная, Memo попросит вас проверить эту связь. Связи `follow-up-of` и `related-to` служат для информации и ничего
не блокируют.

## Напоминания

Напоминание — это время, когда нужно обратить ваше внимание на задачу. Memo хранит его на вашем
компьютере. Другая программа на ваш выбор, например агент или скрипт, запрашивает у Memo напоминания,
срок которых наступил, и показывает их вам.

```sh
memo reminders add 7 --at-time 2026-10-20T09:00:00+02:00 --timezone Europe/Madrid --account telegram:1
memo reminders list --source telegram:1
memo reminders update 3 --revision 1 --at-time 2026-10-21T09:00:00+02:00 --account telegram:1
memo reminders cancel 3 --account telegram:1
```

Указывайте время со смещением от UTC, например `+02:00` для Мадрида летом. Напоминание относится к
аккаунту, поэтому, чтобы добавить или изменить его, нужен `--account`; для задачи из папки заметок это сама
папка, например `--account notes:1`. Когда задача закрывается, её напоминания отменяются.

Задача в проекте, например `HRB-1`, не относится ни к одному аккаунту, поэтому напоминание для неё пока
невозможно. Так же для задачи из заметки, написанной через `memo notes add`, если в хранилище нет ни одного
аккаунта.

Для программы, которая показывает напоминания:

```sh
memo reminders poll --account telegram:1 --json
memo reminders ack REMINDER_ID RECEIPT --account telegram:1
```

`poll` выдаёт напоминания, срок которых наступил, каждое с квитанцией. `ack` с этой квитанцией
подтверждает, что напоминание показано. Напоминание, которое не подтвердили вовремя, выдаётся снова с
новой квитанцией, поэтому сбой не приведёт к его потере. Используйте `deliveryId` из ответа, чтобы не
показывать одно и то же напоминание дважды. Таймер импорта не доставляет напоминания.

Дальше: [пометьте задачи тегами](./tags.md) или [посмотрите, что предложил агент](./memories.md#proposed-actions).
