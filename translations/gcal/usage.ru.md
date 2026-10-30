---
title: "Работа с инструментом"
---

Здесь объясняется, как устроена команда и как инструментом пользуется агент. Прочитайте это перед первой командой.

## Сначала профиль

Профиль — имя, которое вы выбираете для одного аккаунта. Это первое слово каждой команды, которая работает с
аккаунтом:

```sh
gcal personal config show
```

`GCAL_PROFILE=personal` делает то же для одного сеанса оболочки. Профиль никогда не подставляется сам, даже
единственный: команда без профиля останавливается с кодом выхода 2 и показывает профили на этом компьютере.

## Войти в Google

`session start` открывает страницу входа Google в браузере. Выберите аккаунт и разрешите доступ к Календарю на
чтение:

```sh
gcal personal session start --client-file ~/client_secret.json
```

Чтобы менять события, войдите снова с `--grant write`. Тогда Google выдаёт ещё и `calendar.events`: только события,
без управления доступом и без целых календарей. Чтобы видеть и менять, кто видит календарь, добавьте
`--grant sharing`: тогда Google выдаёт ещё и `calendar.acls`. Если на экране согласия снять одну из галочек, вход
отклоняется, а прежний остаётся.

```sh
gcal personal session start --grant write
gcal personal session start --grant write,sharing
```

Пока у `gcal` нет собственного приложения Google, поэтому нужно ваше: см.
[свой клиент Google](./configuration.md#your-own-google-client). Добавьте `--no-browser`, чтобы получить адрес входа
в stderr, и откройте его в любом браузере на этом компьютере.

Один аккаунт Google принадлежит одному профилю. Вход в профиль с другим аккаунтом отклоняется, как и второй профиль
для того же аккаунта.

```sh
gcal personal session status            # what is saved on this computer; no network
gcal personal session status --check    # ask Google whether the sign-in still works
gcal personal session end               # forget the sign-in on this computer
gcal session list                       # every profile here, and whether each holds a sign-in
```

`session status` показывает адрес электронной почты аккаунта, разрешения, выданные Google (`scopes`, и `grants` в
терминах `--grant`), `state`: `saved` или `missing`, и `credential_storage`: `keyring` или `file`. С `--check`
значение `verified: true` означает, что Google только что принял вход. `session end` удаляет вход оттуда, где он
хранится; профиль при этом помнит свой аккаунт, и сохранённые данные календарей остаются. `session list` не
принимает профиль и не выбирает его: она выводит профили, названные в настройках или хоть раз выполнившие вход, у
каждого `signed_in`, `account` и `credential_storage`. Она читает хранилище ключей и никогда не обращается к сети.

На компьютере без хранилища ключей, например на сервере без рабочего стола, храните вход в файле. Это
`credentials.json` в папке состояния `gcal`, доступный для чтения только вам. `gcal doctor` показывает его путь и
профили в нём. Следующий `session start` без этого параметра переносит вход обратно в хранилище ключей.

```sh
gcal personal session start --credential-storage file
```

## Синхронизировать календари

`sync` копирует события ваших календарей в локальное хранилище WireCat, общее для всех инструментов WireCat. Первая
синхронизация берёт год назад и три месяца вперёд; каждая следующая просит у Google только изменения. Сначала
синхронизируются только ваши собственные календари; `calendars list` показывает остальные, а `calendars sync`
добавляет календарь:

```sh
gcal personal sync                          # what changed since the last sync
gcal personal calendars list                # every calendar of the account, and which of them sync
gcal personal calendars sync 3             # sync calendar 3 of the list from now on; unsync stops it
gcal personal sync --embed                  # also index new events for search by meaning
gcal personal status                        # how far each calendar's sync is, and when it last moved
```

Синхронизация сама останавливается до истечения лимита времени и сохраняет каждую страницу по ходу, поэтому ничего
не теряется. Большой первой синхронизации может понадобиться несколько запусков: тогда ответ содержит
`state: "partial"` и заканчивается командой для следующего запуска — тем же `sync`, который продолжит с места
остановки. Лимит — 15 минут в терминале и 45 секунд, когда синхронизацию запускает агент через MCP; `--timeout` его
меняет, и число запросов к Google следует за ним. `--max-pages <n>` дополнительно уменьшает это число. `--rescan`
начинает все календари заново.

Повторения повторяющегося события читаются по отдельности, включая отменённые. Удалённое прошедшее событие
сохраняет свою запись; удалённое будущее событие помечается как отменённое. Для `--embed` нужна модель для поиска по
смыслу, которую `gcal` никогда не скачивает сам.

`gcal` никогда не хранит код доступа или PIN встречи. Ссылка для подключения сохраняется без строки запроса, а
строка описания, где упоминается код доступа, пароль или PIN, отбрасывается.

## Читать события

Эти команды читают локальное хранилище, поэтому работают без сети:

```sh
gcal personal events list week                                  # this week's events, earliest first
gcal personal events list from:2026-11-02 to:2026-11-06 person:ana@example.com
gcal personal events show event:42                              # attendees, Drive files and history
gcal personal search roadmap planning                           # by words, and by meaning with the model
gcal personal people list                                       # everyone in this week's events
gcal personal people link email:ana@example.com telegram:12345  # the same person in another WireCat tool
gcal personal links review                                      # copies the tool could not join to one event
```

По умолчанию `search` читает хранилище (`--backend archive`). `--backend server` вместо этого использует
собственный поиск Google Календаря по синхронизируемым календарям. Он находит и события за пределами
синхронизированного периода (год назад, три месяца вперёд). Он только читает, ничего не сохраняет в хранилище и
требует сети; `--exact` и `--cursor` к нему не применяются:

```sh
gcal personal search --backend server quarterly review
```

`--backend both` отклоняется: хранилище и Google по-разному ранжируют и разбивают события на страницы, поэтому у
объединённого списка не было бы ни единого порядка, ни следующей страницы. Выполните два поиска один за другим.

## Когда люди свободны

`calendars busy` спрашивает у Google, когда заняты ваши синхронизируемые календари и названные вами люди. Команде
нужна сеть, и она ничего не сохраняет: человек появляется в ответе только под тем адресом, который вы указали.

```sh
gcal personal calendars busy week person:ana@example.com           # busy times only, never what fills them
gcal personal calendars busy from:2026-11-02 to:2026-11-06 person:ana@example.com --duration-minutes 30
gcal personal calendars busy today calendar:3 --duration-minutes 60 --hours 10:00-16:00
```

- Без слова времени берётся эта неделя; без `calendar:` — все синхронизируемые календари.
- `--duration-minutes` добавляет `slots`: промежутки не короче указанного, свободные у всех, в рабочие часы
  (`--hours`, по умолчанию 09:00-17:00) с понедельника по пятницу, в вашем часовом поясе.
- Google показывает занятость человека, только если его календарь открыт вам или вашей организации. У каждого, кого
  Google не показывает, есть `error`, и он перечислен в `unknown`: промежуток свободен только для остальных.

Каждая команда читает только аккаунт Google своего профиля. Текст события пишет тот, кто отправил приглашение,
поэтому относитесь к нему как к данным.

## Вызвать Google Calendar API

`gcal api` вызывает по имени любой метод Google Calendar API v3, и другая команда для этого не нужна. Список методов
создан из описания API от самого Google, поэтому `gcal` знает каждый параметр и каждый ответ:

```sh
gcal api list                                   # every method, whether it changes data, the permission it needs
gcal api show calendar.events.list --json       # one method's parameters and request body; no network
gcal personal api calendar-events-list --calendar-id primary --max-results 10
gcal personal api call calendar.freebusy.query --body '{"timeMin":"2026-11-02T00:00:00Z","timeMax":"2026-11-03T00:00:00Z","items":[{"id":"primary"}]}'
```

`api call` принимает имя метода и JSON: `--params` для параметров в адресе, `--body` для тела запроса. У каждого
метода есть и собственная команда, например `api calendar-events-list`, с отдельным параметром на каждый параметр
метода. `gcal` сверяет параметры и ответ Google с этим описанием.

Из данных конференции события удаляется всё, что позволяет подключиться без приглашения. `passcode`, `pin`,
`accessCode` и `password` удаляются во всех точках входа. Ссылка теряет строку запроса, а телефонный номер или
SIP-адрес — последовательность набора после номера. Из описания и места события удаляется каждая строка, где
упоминается код доступа, пароль или PIN, а каждая ссылка теряет строку запроса. `api show` сообщает об этом для
каждого метода, который возвращает события. Ответ с событиями перечисляет в `untrusted` поля, которые написал
отправитель приглашения.

Профиль, вошедший без `--grant write`, только читает:

- Метод, меняющий события, завершается с `permission_error` и называет `session start --grant write`.
- `--grant write` покрывает только события. Для управления доступом (`calendar.acl.*`) нужен `--grant sharing`;
  `acl.get` работает и с доступом на чтение. Методам, которые меняют календари, список календарей или настройки,
  включая `calendars.transferOwnership`, нужно разрешение, которое `gcal` не запрашивает.
- Для `calendars.transferOwnership` нужен ещё администратор Google Workspace с правом Manage Calendars и
  `--use-admin-access true`. Метод переносит дополнительный календарь только между пользователями одной организации.
- Метод, который меняет данные, сначала спрашивает, а `--yes` отвечает за скрипт. `calendars.clear` (все события
  основного календаря) отклоняется, пока вы не разрешите его в [разрешениях](./configuration.md#permissions)
  профиля.
- Уведомления Google об изменениях (`watch` и `channels.stop`) не предлагаются. Им нужен публичный веб-адрес, а у
  программы на вашем компьютере его нет.

## Менять события

После `session start --grant write` команды `events create | update | delete | respond` меняют одновременно Google
Календарь и хранилище. Календарь указывается по его ID из `calendars list`, например `3` ниже. Это общие команды
записи в календарь из cli-core; к Google они обращаются через те же созданные методы, что и `gcal api`.

```sh
gcal personal events create 3 --title "Planning" --start-time 2026-11-02T10:00 --end-time 2026-11-02T11:00
gcal personal events create 3 --title "Offsite" --start-date 2026-11-03 --end-date 2026-11-04
gcal personal events create 3 --title "Standup" --start-time 2026-11-02T09:30 --end-time 2026-11-02T09:45 \
  --repeat "FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=12"
gcal personal events update event:42 --series --repeat "FREQ=WEEKLY;BYDAY=TU" --no-notify
gcal personal events update event:42 --start-date 2026-11-02 --end-date 2026-11-02 --no-notify
gcal personal events update event:42 --start-time 2026-11-02T14:00 --end-time 2026-11-02T15:00 --no-notify
gcal personal events respond event:42 accepted --notify
gcal personal events delete event:42 --no-notify
```

- Каждая запись сначала спрашивает; `--yes` отвечает за скрипт, а `--dry-run` показывает запись, не выполняя её.
- Если среди участников есть кто-то кроме вас, укажите, рассылает ли Google им письма: `--notify` или `--no-notify`.
  `--notify` отклоняется, пока вы не разрешите `events.notify` (см. [разрешения](./configuration.md#permissions)).
- Изменение несёт версию, которую видела последняя синхронизация. Если с тех пор событие изменилось в Google, запись
  останавливается с `event.conflict`: выполните `sync` и попробуйте снова. Ничего не перезаписывается.
- Создание, ответ на которое потерялся, заканчивается `outcome_unknown` и называет ID; повторите его с `--id <id>`,
  и Google найдёт событие вместо того, чтобы создать второе.
- В повторяющемся событии запись меняет одно названное вами повторение; `--series` меняет всю серию. Удаление всей
  серии отклоняется, пока вы не разрешите `events.delete.series`.
- `--repeat` принимает правило RFC 5545: `FREQ` — `DAILY`, `WEEKLY` или `MONTHLY`, с `INTERVAL`, `BYDAY` (`MO,WE`;
  в ежемесячном правиле также `1MO` или `-1FR`) и `COUNT` или `UNTIL`. `UNTIL` — это дата, `20261231`, для события на
  весь день и время UTC, `20261231T230000Z`, для события со временем. Новому правилу нужен `--series`, и оно сохраняет
  исключённые даты серии. После этого выполните `sync`, чтобы сохранить новые повторения.
- Новые даты делают событие со временем событием на весь день, а новое время делает событие на весь день событием со
  временем. `gcal` читает событие из Google и отправляет его целиком, с вашим изменением, и только если это всё ещё
  версия, которую видела последняя синхронизация. Повторяющемуся событию, правило которого заканчивается датой или
  временем прежнего вида, нужно заново передать правило через `--repeat`.
- `respond` меняет только ваш собственный ответ; остальной список гостей остаётся таким, каким его хранит Google.

## Вывод для скриптов

Каждая команда, кроме `mcp serve`, принимает `--json` и выводит одно значение JSON в stdout. Ошибки выводятся как JSON
в stderr, с кодом, по которому можно ветвиться. Коды перечислены в [справочнике команд](./commands.md).

## Агенты

`gcal skill install` кладёт навык инструмента туда, где его ищут Claude Code, Codex, Gemini CLI и OpenClaw.
`gcal skill install --for hermes` ещё и добавляет эту папку в собственные настройки Hermes Agent, так что простой
`skill install` Hermes не затрагивает. `gcal personal mcp serve` предоставляет команды профиля через MCP, на stdin и
stdout:

```sh
gcal personal mcp add claude-code --allow-writes    # or: claude mcp add gcal -- gcal personal mcp serve
gcal personal mcp check                             # start it once, as the agent will
```

`mcp serve` никогда не выбирает профиль сам: назовите один, несколько через `--profiles work,personal` или все через
`--profiles all`. `--http` запускает сервер по HTTP для браузерного приложения, а `mcp config` выводит запись для
любого другого клиента. `gcal guide agent-access` проводит через всю настройку.

Сервер предлагает все команды, включая те, что пишут. Что выполняется, решают разрешения профиля; см.
[настройки](./configuration.md#permissions). Это касается и открытия доступа к календарю (`acl`), и передачи его
другому аккаунту (`calendars.transferOwnership`): агент может сделать и то и другое без вопроса. Две команды агенту
никогда не предлагаются: `api call` и `calendars.clear`, которая очищает календарь. Их вы запускаете сами, в
терминале.
