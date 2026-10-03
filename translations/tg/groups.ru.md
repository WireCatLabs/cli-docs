---
title: "Управление группами"
---

`tg` помогает администратору группы находить вопросы без ответа, видеть новых участников и кто их добавил, подводить итоги недели. Чтение не отмечает сообщения прочитанными: участники не получают уведомления о вашем просмотре.

Все команды выполняются от вашего личного аккаунта. Примеры: [Использование](./usage.md#groups-and-channels); параметры: [Справочник команд](./commands.md).

## Работа через агента

Агенту с доступом к терминалу (например, Claude Code или Codex) нужен [skill](./recipes.md#once-first). Без доступа к терминалу можно использовать [MCP-сервер](./mcp.md), например в Claude Desktop или Cursor. Ниже показаны ваши запросы, команды агента и результат.

### Утро администратора: кто ждёт ответа

```text
You:    What is still unanswered in "Hiking"?
Agent:  (tg review --chat "Hiking" --unanswered 4h --json)
        Unanswered for more than 4 hours — 3 questions:
        · Lena, 08:12 — "What time do we leave on Saturday?"
        · Artem, yesterday 22:40 — a reply to your post about the route: "Are the tents shared?"
        · Ira, yesterday 19:05 — "Who brings the pot?"
        You or the admins answered the rest.
```

Вопросом считается сообщение со знаком `?` или ответ вам либо администратору. Знак `?` внутри ссылки не учитывается. Вопрос считается закрытым, если вы или администратор ответили на него либо написали следующее сообщение после автора вопроса. Если Telegram не сообщает список администраторов, учитываются только ваши ответы; команда предупреждает об этом.

### Новые участники за неделю

```text
You:    Who joined "Hiking" this week?
Agent:  (tg chats events "Hiking" --type join,add --json)
        Five people:
        · Kate — added by Lena, Tuesday
        · Oleg — joined by the link, Wednesday
        · …
```

`chats events` читает служебные сообщения группы и показывает события, сохранившиеся в истории Telegram: кто вступил, вышел, кого добавили или удалили и кто это сделал. `tg chats members list` выводит всех участников с ролями и временем последнего появления.

### Если приглашение стало публичным

```text
You:    The invite link to "Hiking" ended up in a public chat. Replace it, and stop members adding people.
Agent:  (tg chats link reset "Hiking" --json)
        (tg chats update "Hiking" --only-admins-add on --json)
        Done: the old link no longer works, the new one is https://t.me/+…, and only admins can add
        people now.
```

`link reset` возвращает текущее состояние группы вместе с новой ссылкой. `chats update` тоже возвращает состояние, поэтому агент может рассказать об изменениях без повторного чтения группы.

### Итоги недели

```text
You:    Sum up the week in "Hiking".
Agent:  (tg review --chat "Hiking" --since-time 2026-09-20T00:00 --json)
        Decided: we leave on 4 October, at 7:00 from the station.
        Taken on: Lena — food, Artem — tents.
        Open: who brings the pot — asked three times, no answer.
```

### Проверка по расписанию

Для списка открытых вопросов агент не нужен: это обычная команда.

```cron
0 9,21 * * * tg review --chat "Hiking" --unanswered --json >> ~/hiking-open.jsonl 2>> ~/tg-cron.log
```

В cron нет терминала и часто не задан `XDG_RUNTIME_DIR`, без которого `tg` не может обратиться к хранилищу ключей. Подробнее: [Сценарии использования](./recipes.md#running-on-a-schedule).

## Доступные команды

| Команда | Назначение |
|---|---|
| `tg review --chat <chat> --unanswered [duration]` | вопросы без вашего ответа или ответа администратора за указанный срок: `4h`, `1d`; по умолчанию 24 часа |
| `tg chats events <chat>` | кто вступил, вышел, кого добавили или удалили и кто это сделал; по умолчанию за 7 дней |
| `tg chats members list <chat>` | все участники, их роли и время последнего появления |
| `tg topics list\|search <chat>` | темы группы-форума |
| `tg topics enable <chat>` | включить форум; обычная группа требует `--upgrade --yes`, результат содержит новый идентификатор чата |
| `tg topics create <chat> <title>` | создать тему; при неизвестном результате проверить `topics list` вместо повтора |
| `tg messages send <chat> <text> --topic <id>`, `tg polls create <chat> <question> <answers> --topic <id>` | отправить сообщение или опрос в тему форума |
| `tg chats inspect <link>` | куда ведёт публичная ссылка или приглашение; без вступления |
| `tg chats create <title> [person...]` | новая супергруппа; с `--channel` — канал |
| `tg chats join <link>`, `tg chats leave <chat>` | вступить по ссылке или выйти |
| `tg chats update <chat>` | название, описание, право участников закреплять (`--all-can-pin`) или добавлять людей (`--only-admins-add`) |
| `tg chats members add\|remove <chat> <person...>` | добавить участников (они получат уведомление; ошибки добавления перечисляются) или удалить их (сообщения сохранятся) |
| `tg chats admins add <chat> <person> --can <rights>` | назначить администратора с правами: members, admins, info, pin, link, post, edit, delete |
| `tg chats admins remove <chat> <person>` | снять права администратора; человек останется участником |
| `tg chats link show\|reset <chat>` | ссылка-приглашение; `reset` создаёт новую, старая перестаёт работать |
| `tg messages delete --for-everyone`, `pin`, `unpin` | удалить для всех, закрепить или открепить |

Агенту без терминала доступны инструменты чтения MCP: `tg_review` с `unanswered`, `tg_chats_events`, `tg_chats_members`, `tg_chats_inspect` ([MCP](./mcp.md)).

`create`, `join`, `leave`, `update`, `link reset`, `members` и `admins` выполняют изменения, видимые участникам: создание группы уведомляет добавленных людей, а вступление и выход отображаются в чате. Все действия проверяются разрешениями профиля и защитой отправок; каждый добавленный человек учитывается в часовом лимите ([Безопасность](./security.md#the-send-guard)).

## Правила модерации

Правила группы задают, что ищет `tg chats moderate` и какие действия разрешены. Они хранятся в файле профиля, отдельно от Telegram. Фонового наблюдения нет: правила применяются только при запуске `chats moderate`.

```sh
tg chats rules show "Hiking"                       # the defaults, marked not saved, until the first change
tg chats rules set "Hiking" links delete           # a message with a link is deleted
tg chats rules set "Hiking" blocked 12345,67890    # these people…
tg chats rules set "Hiking" blockedPeople remove   # …are removed when they write or join
tg chats rules set "Hiking" consent.delete allow   # delete without asking
tg chats moderate "Hiking" --dry-run               # what it would do, doing nothing
tg chats moderate "Hiking"                         # judge what is new since the last run, and act
```

| Правило | Что проверяется |
|---|---|
| `links`, `invites`, `forwards` | сообщения со ссылками, приглашениями в другую группу или пересылками |
| `blocked`, `blockedNames`, `blockedPeople` | участники по идентификатору или части имени и действия в отношении них |
| `flood.messages`, `flood.minutes`, `flood.action` | превышение числа сообщений от одного человека за указанное количество минут |
| `trusted` | участники, к которым правила не применяются; вы и администраторы группы также исключены |

Действие правила: `report`, `delete` или `remove`. Удаление сообщения (`delete`) или участника (`remove`) контролируется уровнями `consent.delete` и `consent.remove`: `deny` запрещает, `readonly` только сообщает, `ask` запрашивает подтверждение каждого действия (по умолчанию; `--allow-dangerous` подтверждает все), `allow` разрешает действие. Защита отправок и часовой лимит сохраняются; запуск останавливается после `--max-actions` (10). Следующий продолжает с той же позиции. `--since-time` проверяет выбранный вами период без изменения сохранённой позиции.

В MCP `tg_chats_moderate` выполняет только действия с уровнем `allow`. Действия, требующие подтверждения, перечисляются, но не выполняются. Правило `newAccount` недоступно: Telegram не сообщает возраст аккаунта.

## Ограничения

- **Источник — история Telegram.** `chats events` и `review` видят только сохранившиеся сообщения. Удалённое администратором служебное сообщение недоступно и им.
- **Список администраторов доступен не всегда.** Без него `review --unanswered` учитывает только ваши ответы и предупреждает об этом.
- **Автоматического наблюдения нет.** Проверку запускаете вы, агент по вашему запросу или ваше расписание.
- **Действуют лимиты Telegram.** Чтение всех участников большой группы требует много запросов. `FLOOD_WAIT` сообщает, сколько нужно подождать ([Решение проблем](./troubleshooting.md#telegram-asks-to-wait-n-s-before-the-next-request)).
