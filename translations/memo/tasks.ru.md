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
`notes:<number>` или как `obsidian:<id>` либо `local:<id>`, которые показывают её сообщения; `folder:<id>` тоже её называет.
`--source notes` указывает вашу папку,
если она одна. `memo tasks list` и `memo reminders list` без `--source` читают все аккаунты и называют их в
`meta.accounts`.

## Что требует внимания сегодня

Повестка, план и карточка — те же команды, что в tg и max. Каждая читает один аккаунт; укажите его:

```sh
memo tasks agenda --source telegram:1           # overdue, due, owed and waiting chats
memo tasks update 1a2b3c4d --due 2d --remind-time 1d --title 'Send the revised budget' --account telegram:1
memo tasks show 1a2b3c4d --source telegram:1
memo stats tasks show --source telegram:1       # open tasks per chat
memo tasks agenda --source notes                # tasks from your notes folder
```

Чтобы изменить поля задачи, используйте `tasks update`.

Без `--source` или `--account` команда перечисляет аккаунты в хранилище. tg и max открывают эти задачи при синхронизации; memo читает то же хранилище.

## Задачи в проекте

Задаче в проекте не нужен источник. Она получает ключ из ключа проекта и номера, например `HRB-1`:

```sh
memo tasks add --project HRB --title 'Book the venue' --priority high
memo tasks add --project HRB --title 'Export drops the last row' --type bug
memo tasks list project:HRB
memo tasks update HRB-1 --priority critical --description 'Call before Friday'
```

Простой `memo tasks list` показывает только задачи ваших аккаунтов; задачи проекта выводятся через
`project:` и ключ проекта, его название или псевдоним, а задачи всех проектов — через `project:*`.

| Параметр | Значение |
|---|---|
| `--type` | `chore` (по умолчанию), `bug` или `feature` |
| `--priority` | `low`, `medium`, `high` или `critical`; `none` снимает приоритет. 0 (срочно) – 4 (низкий приоритет) работают как раньше |
| `--parent` | более крупная задача в том же проекте, частью которой является эта |
| `--description` | подробности в формате Markdown |
| `--assignee` | кто выполняет задачу, по ID человека |

Как сначала создать проект, см. [организации и проекты](./people.md#organizations-and-projects).

## Приоритет и порядок

Приоритет — число от 0 до 1, чем больше, тем выше; вы видите его как одну из четырёх меток по четвертям: `low`
(ниже 0,25), `medium`, `high` и `critical` (от 0,75). `--json` отдаёт оба значения: `priority` и
`priority_label`. Число задаёт и порядок задач проекта, поэтому колонка доски сохраняет заданный вами порядок:

```sh
memo tasks move HRB-3 --before HRB-1                      # HRB-3 goes just above HRB-1
memo tasks move HRB-3 --status in_progress --after HRB-2  # into another column, below HRB-2
```

`tasks move` задаёт задаче приоритет между новыми соседями. Если при этом она попадает в другую четверть, её метка
меняется, и ответ сообщает об этом (`label.changed`). Если между двумя соседями нет места, Memo равномерно
распределяет эту четверть колонки и называет задачи, которым дал новые номера.

## Состояния

Задача проекта бывает `open` (новая), `todo` (решено делать), `in_progress`, `done` или `dismissed`. Меняйте
состояние через `tasks update --status`, в том числе возвращайте из `done` или `dismissed`; каждое изменение
сохраняется в истории. `todo` и `in_progress` везде считаются открытой работой: задача, которая ждёт такую, не
готова, а агент может такую взять. Задача из сообщения бывает только `open`, `done` или `dismissed`.

```sh
memo tasks update HRB-1 --status in_progress
memo tasks history HRB-1 --json      # who changed what, and when
```

## Поиск задач проекта

`memo tasks list` с `project:` принимает запрос: поля, соединённые через AND, OR внутри поля, NOT и обычные слова,
которые ищут по названию и описанию:

```sh
memo tasks list project:* 'assignee:"person:3"' priority:[high TO critical] invoice
memo tasks list project:(HRB OR OPS) state:(done OR dismissed) closed:>=14d
memo tasks list project:* overdue:true --sort due
memo tasks list project:* NOT due:* NOT priority:*
memo tasks counts project:* --json   # how many per project, assignee, priority and state
```

| Поле | Значение |
|---|---|
| `state:` | `open`, `todo`, `in_progress`, `done`, `dismissed`; без него — три открытых состояния |
| `project:` | ключ, название, `project:<id>` или `*` для всех проектов |
| `assignee:` | `any`, `none` или человек: `"person:3"` в кавычках либо `3` |
| `priority:` | метка, `none` или диапазон меток или чисел |
| `agent:` | агент, который над ней работает, `none` или `any` |
| `due:`, `closed:` | дата или диапазон: `due:[today TO 2026-12-31]`, `closed:>=14d` |
| `overdue:`, `ready:` | `true` или `false` |

`--sort` принимает `priority` (по умолчанию), `due`, `created`, `updated`, `key` или `state`; `--desc` меняет
порядок на обратный. В списке не больше 500 задач; `page.next_cursor` и `--cursor` читают следующие, а `page.total`
показывает, сколько всего подходит. У каждой задачи есть `assignments`, `ready` и `blocked_by`, а также `revision`.

## Изменено в другом месте

Агент может изменить задачу, пока вы на неё смотрите. Передайте прочитанную вами `revision`, и Memo откажет в записи,
если задача с тех пор изменилась, с причиной `task.stale` и кодом выхода 3:

```sh
memo tasks update HRB-1 --title 'Book the hall' --revision 4
```

`tasks update`, `close`, `assign` и `move` принимают `--revision`.

## Кто работает над задачей

```sh
memo tasks assign HRB-1 PERSON_UID
memo tasks assign HRB-1 PERSON_UID --role reviewer
memo tasks assign HRB-1 PERSON_UID --clear     # take them off it
memo people list                               # you, and everyone tasks already name
memo tasks update HRB-1 --agent hermes         # the agent working on it; --agent none clears it
```

Агент — не исполнитель: `agent` называет агента, занятого работой, пока кто-то это не изменит, а захват
(`tasks claim`) — аренда, которая истекает сама. Роль — `assignee` (по умолчанию), `reviewer` или `watcher`. ID человека берётся из его контекста
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
memo tasks links HRB-2
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
memo reminders claim --account telegram:1 --json
memo reminders acknowledge REMINDER_ID RECEIPT --account telegram:1
```

`claim` выдаёт напоминания, срок которых наступил, каждое с квитанцией. `acknowledge` с этой квитанцией
подтверждает, что напоминание показано. Напоминание, которое не подтвердили вовремя, выдаётся снова с
новой квитанцией, поэтому сбой не приведёт к его потере. Используйте `deliveryId` из ответа, чтобы не
показывать одно и то же напоминание дважды. Таймер импорта не доставляет напоминания.

Дальше: [пометьте задачи тегами](./tags.md) или [посмотрите, что предложил агент](./memories.md#proposed-actions).
