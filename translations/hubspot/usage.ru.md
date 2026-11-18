---
title: "Как пользоваться"
---

Знайте, где стоит каждая сделка и что изменилось за ночь, не открывая HubSpot. `hubspot` приносит CRM аккаунта в ваш
терминал и к вашему ИИ-агенту: какие сделки стоят на стадии, какие задачи просрочены, и утреннюю сводку того, что
изменилось.

Каждая команда начинается с профиля, имени, которое вы дали аккаунту. `sync` копирует сделки с их контактами и
компаниями в локальное хранилище WireCat на вашем компьютере, и большинство команд чтения отвечает оттуда, в том
числе без интернета. Здесь считается, что вы уже вошли в профиль, как показывает
[установка и подключение](./installation.md).

**На этой странице:**

1. [Сначала профиль](#the-profile-comes-first)
2. [Первая синхронизация](#the-first-sync)
3. [Читайте свои сделки](#read-your-deals)
4. [Меняйте сделки, контакты и компании](#change-deals-contacts-and-companies)
5. [Активности и что изменилось](#activities-and-what-changed)
6. [Вызов API](#call-the-api)
7. [Вывод для скриптов](#output-for-scripts)
8. [Агенты](#agents)

## Сначала профиль

Профиль это имя, которое вы выбираете для одного аккаунта. Оно стоит первым словом каждой команды, которая работает с
аккаунтом:

```sh
hubspot work config show
```

`WCHUBSPOT_PROFILE=work` делает то же самое для одного сеанса оболочки. Профиль никогда не подставляется сам, даже
если он единственный. Команда без профиля останавливается с кодом выхода 2 и перечисляет профили на этом компьютере.

`hubspot work session status --check` показывает, какой аккаунт читает профиль.

## Первая синхронизация

`sync` копирует воронки, сделки и их контакты и компании в локальное хранилище. Ключ HubSpot принадлежит аккаунту, а
не человеку, поэтому копия охватывает весь аккаунт. После этого команды вроде `deals list` читают эту копию без
интернета:

```sh
hubspot work sync
hubspot work deals list status:open
```

Запустите `sync` снова, чтобы обновить копию: он спрашивает у HubSpot только то, что изменилось с прошлого раза. Так
копия остается свежей по таймеру:

```sh
hubspot work schedule command crm --every 1h -- sync
```

## Читайте свои сделки

```sh
hubspot work deals list stage:"Contract sent"
hubspot work deals show deal:12
hubspot work pipelines list
```

`deals list` принимает условия вида поле:значение, например `status:open` или `stage:"Contract sent"`, и
`--format csv` для таблицы. Ключ не называет пользователя, поэтому `owner:me` никого не находит. Возьмите id
ответственного из `hubspot work users list` и фильтруйте по нему, например `owner:51234567`. `deals show` показывает
одну сделку с ее стадией, суммой и людьми.

Лиды читаются так же через `leads list` в Sales Hub Professional или Enterprise.

Контакты, компании и ответственные читаются из аккаунта напрямую:

```sh
hubspot work people list "Anna"
hubspot work organizations show 9
hubspot work users list
```

## Меняйте сделки, контакты и компании

Для этого нужны scope ключа на запись ([установка](./installation.md#make-a-key)). Сначала запустите `sync`: стадия
или воронка называется так, как ее знает копия.

```sh
hubspot work deals create --title "Example kitchen" --amount 15000 --currency EUR --stage "Appointment scheduled"
hubspot work deals update deal:12 --close-date 2026-12-24 --field "Lead source=Trade fair"
hubspot work deals move deal:12 "Contract sent"
hubspot work deals close deal:12 lost --reason "Example: chose another supplier"
hubspot work deals delete deal:12
hubspot work people create --first-name Anna --last-name Example --email anna@example.com
hubspot work organizations update 9 --name "Example LLC"
```

Каждое изменение сначала уходит в HubSpot, а копия сохраняет ответ HubSpot. `close` переносит сделку на стадию
выигрыша или проигрыша ее воронки. `delete` архивирует сделку в HubSpot, где ее можно восстановить в течение 90 дней,
и в терминале сначала спрашивает. Через MCP отвечать некому, поэтому агента останавливает только `readonly` или
`deny` ([разрешения](./permissions.md)).
`--dry-run` показывает ключи разрешений, которые проверяет изменение, и ничего не отправляет.

У контакта одна почта и два номера, телефон и мобильный. У компании один номер и нет почты. `--phone` и `--email`
заменяют весь список, поэтому один `--phone` у контакта стирает его мобильный номер, а `--name` задает и имя, и
фамилию. Заметки, задачи,
лиды и контакты и компания сделки записываются через [API](#call-the-api).

Ключ принадлежит аккаунту, а не вам, поэтому назначение ответственного через `--owner` проверяет `crm.assign-others`,
а он стоит на `deny`, пока вы его не разрешите ([разрешения](./permissions.md)). HubSpot не принимает ключ
идемпотентности: изменение,
которое закончилось `outcome_unknown`, могло пройти, поэтому посмотрите на запись, прежде чем отправить его снова.

## Активности и что изменилось

Заметки, звонки, письма, встречи и задачи по умолчанию выключены. Чтобы их копировать, включите настройку активностей,
подставив id своего аккаунта вместо примера `12345678`. `session status` показывает id как `account`.

```sh
hubspot work config set crm.hubspot:12345678.activities on
hubspot work sync
hubspot work activities list overdue:true
```

`changes list` показывает, какие изменения увидели синхронизации: созданные, перенесенные, выигранные и проигранные
сделки и добавленные контакты. Это расписание делает утреннюю сводку за последний день:

```sh
hubspot work changes list "at>=1d"
hubspot work schedule command crm-digest --at 08:30 -- changes list --format report
```

## Вызов API

`hubspot work api list` перечисляет все операции CRM API HubSpot версии 2026-03 с их действием и ключом разрешения.
Каждая операция это отдельная команда:

```sh
hubspot work api list
hubspot work api show deals-search
hubspot work api deals-search --body '{"after":"0","filterGroups":[],"limit":5,"properties":["dealname","amount"],"sorts":[]}'
hubspot work api deals-list --all
```

Каждая операция проверяет свой ключ, `api.<command>`, поэтому `permissions.api deny` не пускает агента в API
напрямую. Запись также проверяет ключ `.write` своей группы, а удаление ключ `.delete`, и оба в терминале сначала
спрашивают. Через MCP
агента останавливает только `readonly` или `deny`.
`--dry-run` показывает ключи, ничего не отправляя:

```sh
hubspot work api notes-create --body-file note.json --dry-run
```

```sh
hubspot work config set permissions.api deny
```

## Вывод для скриптов

Каждая команда, кроме `mcp serve` на stdin и stdout, принимает `--json` и печатает одно значение JSON в stdout.
Ошибки приходят в JSON в stderr, с кодом, по которому можно ветвиться. Коды перечислены в
[справочнике команд](./commands.md).

## Агенты

`hubspot skill install` учит команды Claude Code, Codex, Gemini CLI и OpenClaw.
`hubspot work mcp add claude-code --allow-writes` подключает профиль к приложению, которое работает через MCP.
Остальное, включая ChatGPT и Claude в браузере, показывает страница [MCP](./mcp.md).
