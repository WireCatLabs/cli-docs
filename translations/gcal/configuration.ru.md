---
title: "Настройки"
---

Настройки хранятся в одном файле, `config.json`, в папке, которую показывает `gcal doctor`. У каждого профиля своя
часть, а `defaults` действуют для всех профилей. Здесь описано, как смотреть и менять настройки.

```sh
gcal personal config show
gcal personal config set limit 50
gcal personal config unset limit
```

`config show` выводит каждую настройку и откуда она взялась: из файла, из переменной окружения или по умолчанию.

## Свой клиент Google

У `gcal` пока нет собственного приложения Google, поэтому `session start` входит через ваше. Создайте его один раз в
[Google Cloud Console](https://console.cloud.google.com/):

1. Создайте проект и включите в нём Google Calendar API.
2. Настройте экран согласия OAuth. Пока приложение в режиме Testing, добавьте свой аккаунт Google как тестового
   пользователя.
3. Создайте идентификатор клиента OAuth типа **Desktop app** и скачайте его JSON-файл.

Затем передайте файл `gcal`, сделав его доступным для чтения только вам:

```sh
chmod 600 ~/client_secret.json
gcal personal session start --client-file ~/client_secret.json
```

`gcal` не принимает файл клиента, который могут читать другие пользователи компьютера. Вместо файла можно задать
`GCAL_GOOGLE_CLIENT_ID` и `GCAL_GOOGLE_CLIENT_SECRET`. Клиент нужен только при входе: `gcal` сохраняет его вместе со
входом в системной связке ключей, так что дальше команды работают без файла.

## Разрешения

`permissions` определяет, что команда может делать в этом профиле: `allow`, `ask`, `readonly` или `deny` для каждого
ключа разрешения. У каждого метода Google Календаря свой ключ, `api.<method>`, например `api.calendar.events.insert`;
`api` и `api.calendar.events` охватывают все методы под ними. Один и тот же ключ действует для `api call <method>` и
для собственной команды метода, `api calendar-events-insert`.

```sh
gcal personal config set permissions.api readonly                        # reads only, every method
gcal personal config set permissions.api.calendar.events.insert allow    # add events without the question
```

Если вы ничего не задали:

- Метод, который меняет Календарь, — `ask`. В терминале `gcal` спрашивает перед обращением к Google; в скрипте
  добавьте `--yes`. Через MCP спросить некого, поэтому `ask` разрешает команде выполниться.
- Предоставление доступа к календарю (`calendar.acl.insert`, `patch`, `update`, `delete`) и передача его другому
  аккаунту (`calendar.calendars.transferOwnership`) — `ask`, как и любое другое изменение. Через MCP это значит, что
  агент может открыть ваш календарь кому угодно или отдать его без вопроса. Чтобы это запретить, задайте
  `permissions.api.calendar.acl deny`.
- `sharing.notify`, разрешение Google отправить письмо человеку, которому открыт календарь, — `deny`. Google
  отправляет это письмо, если `sendNotifications` не равно `false`, поэтому пока ключ в `deny`, при открытии доступа
  нужно указать `--send-notifications false`.
- Очистка календаря (`calendar.calendars.clear`, все события основного календаря) — `deny` и никогда не предлагается
  через MCP.
- Запись событий (`events create`, `update`, `delete`, `respond`) — `ask`, у каждой команды свой ключ, например
  `events.create`.
- `events.notify`, разрешение Google отправить письмо остальным участникам (`--notify`), — `deny`. Через MCP `ask`
  разрешает команде выполниться, так что иначе агент мог бы рассылать людям письма.
- `events.delete.series`, удаление всех повторений повторяющегося события (`events delete --series`), — `deny`.

Запись события требует ещё и ключ метода Google, который она вызывает: `api.calendar.events.insert` для `create`,
`api.calendar.events.patch` для `respond`, `api.calendar.events.patch` и `api.calendar.events.update` для `update`
(переключение между событием со временем и событием на весь день отправляет событие целиком),
`api.calendar.events.delete` для `delete`. Поэтому `permissions.api readonly` останавливает и запись событий. Один
вопрос покрывает все ключи одной записи.

Команды `api` подчиняются тем же ключам. Методу, после которого Google рассылает письма участникам (`--send-updates`
со значением кроме `none` или `--send-notifications true`), нужен ещё и `events.notify`. Удалению события или его
изменению на `cancelled` нужен ещё и `events.delete.series`, если событие повторяется: чтобы это узнать, `gcal`
сначала читает событие из Google. Предоставлению доступа к календарю (`calendar.acl.insert`, `patch`, `update`) нужен
ещё и `sharing.notify`, если вызов не передаёт `--send-notifications false` (`"sendNotifications": false` в
`api call --params`); `gcal` никогда не добавляет его за вас. Отзыв доступа (`calendar.acl.delete`) писем не
отправляет, поэтому дополнительный ключ ему не нужен. `--dry-run` выводит все ключи, которые проверяет вызов, с их
уровнями, и ничего не вызывает.

```sh
gcal personal config set permissions.events.notify allow     # let --notify mail attendees
gcal personal config set permissions.sharing.notify allow    # let a share mail the person it is shared with
gcal personal config set permissions.events.create allow     # add events without the question
```

Более общий ключ может сделать эти значения по умолчанию только строже: при `permissions.api allow` и вопрос, и
`deny` остаются. Чтобы изменить одно из них, задайте собственный ключ метода, например
`permissions.api.calendar.calendars.clear ask`. Ключ, который не называет ни одного метода, отклоняется, а
`gcal doctor` показывает такие ключи в файле. `GCAL_READ_ONLY=1` запрещает любую запись, что бы ни говорили
разрешения. `gcal <profile> mcp serve --permission api=readonly` делает ключ строже только для этого сервера.

## Записи запусков

Команда, которая завершилась ошибкой, сохраняется как запуск для `gcal runs list` и `runs show`. `record_input`
определяет, хранит ли запуск введённые вами слова; это `true`, пока вы не зададите `false`. Секреты скрываются в любом
случае; см. [Безопасность](./security.md).
