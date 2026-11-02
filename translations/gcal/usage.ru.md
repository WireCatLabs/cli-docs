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

Без `--client-file` `gcal` входит через приложение Google от WireCat, если оно есть в пакете, а иначе через ваше:
см. [подключите аккаунт Google](./installation.md#connect-your-google-account). Добавьте `--no-browser`, чтобы
получить адрес входа в stderr, и откройте его в любом браузере на этом компьютере.

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
хранится; профиль при этом помнит свой аккаунт, и сохранённые данные календарей остаются. В запуске с перенесёнными
папками он удаляет только собственный вход этого запуска: ответ тогда содержит `kept: "keyring"`, потому что запуск
по-прежнему читает ваш обычный вход, и `session status` его всё ещё показывает. `session list` не
принимает профиль и не выбирает его: она выводит профили, названные в настройках или хоть раз выполнившие вход, у
каждого `signed_in`, `account` и `credential_storage`. Она читает хранилище ключей и никогда не обращается к сети.

На компьютере, где хранилище ключей не работает, например на сервере без рабочего стола, `session start` сам
сохраняет вход в файле, один раз сообщает об этом в stderr и отвечает `credential_storage: "file"`. Он никогда не
спрашивает. Это `credentials.json` в папке состояния `gcal`, доступный для чтения только вам. `gcal doctor` показывает
его путь и профили в нём. Файл можно выбрать и явно, хотя хранилище ключей надёжнее и мы этого не советуем:

```sh
gcal personal session start --credential-storage file
```

Следующий `session start`, которому удастся добраться до хранилища ключей, переносит вход обратно туда.

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
gcal personal store status                  # how far each calendar's sync is, and when it last moved
```

Синхронизация сама останавливается до истечения лимита времени и сохраняет каждую страницу по ходу, поэтому ничего
не теряется. Большой первой синхронизации может понадобиться несколько запусков: тогда ответ содержит
`state: "partial"` и заканчивается командой для следующего запуска — тем же `sync`, который продолжит с места
остановки. Лимит — 15 минут в терминале и 45 секунд, когда синхронизацию запускает агент через MCP; `--timeout` его
меняет, и число запросов к Google следует за ним. `--max-pages <n>` дополнительно уменьшает это число. `--rescan`
начинает все календари заново.

Если календарь не удалось синхронизировать, `sync` ничего не выводит в stdout и завершается с `sync.partial`.
Сообщение называет каждый неудавшийся календарь и его ошибку; `details.calendars` содержит результат каждого
календаря, с `error` у неудавшихся. Календари, которые синхронизировались, сохранены, и повторный `sync` безопасен.

Повторения повторяющегося события читаются по отдельности, включая отменённые. Удалённое прошедшее событие
сохраняет свою запись; удалённое будущее событие помечается как отменённое. Для `--embed` нужна модель для поиска по
смыслу, которую `gcal` никогда не скачивает сам: `gcal models download e5-small` один раз скачивает её в папку, общую
для всех инструментов WireCat, а `gcal models list` показывает, какие модели там есть.

`gcal` никогда не хранит код доступа или PIN встречи. Ссылка для подключения сохраняется без строки запроса, а
строка описания, где упоминается код доступа, пароль или PIN, отбрасывается.

## Читать события

Эти команды читают локальное хранилище, поэтому работают без сети:

```sh
gcal personal events list                                       # from today on, earliest first
gcal personal events list ends_at>=2026-11-02 starts_at<=2026-11-06 person:ana@example.com
gcal personal events list starts_at>=2026-11-02                 # events that start on or after a day
gcal personal events list changed_at>=2026-10-25                # what changed since a date
gcal personal events list --source all                          # every account's events in one list
gcal personal events list overlapping:true --source all         # meetings that overlap, across accounts
gcal personal events list -event_type:birthday -event_type:focus  # without birthdays and focus time
gcal personal events list calendar:Team                         # one calendar, by its name
gcal personal events show event:42                              # attendees, Drive files and history
gcal personal search events roadmap planning                    # by words, and by meaning with the model
gcal personal people list                                       # everyone in this week's events
gcal personal people list event:42                              # one event's attendees
gcal personal people link email:ana@example.com telegram:12345  # the same person in another WireCat tool
gcal personal links review                                      # copies the tool could not join to one event
```

`events list` принимает тот же запрос по полям, что и любой список WireCat, и никаких собственных слов.
`starts_at` ограничивает начало события с любой стороны: `starts_at>=2026-11-02` оставляет события, которые начинаются
в этот день или позже, `starts_at<2026-11-07` — те, что начинаются раньше этого дня, `starts_at:[2026-11-02 TO 2026-11-07}`
— и то и другое, а `starts_at:2026-11-02` — события одного этого дня. `ends_at>=<date>` оставляет события, которые
заканчиваются после начала этого дня, так что событие, которое в этот момент уже идёт, тоже остаётся:
`ends_at>=2026-11-02 starts_at<=2026-11-06` даёт всё, что касается этих дней. `ends_at` задаёт только самый ранний
конец, и событие, которое заканчивается ровно в этот момент, в список не попадает. Точное время пишется в кавычках со
смещением: `starts_at>="2026-11-03T10:00:00+01:00"`. Каждое поле называется один раз; поле, названное дважды,
отклоняется, поэтому пишите промежуток. `calendar:<id>` и `person:<email>` сужают список. Без `starts_at` или
`ends_at` список начинается с начала сегодняшнего дня. `id:<id>` находит одно событие, когда бы оно ни было.
`gcal personal events list --help` перечисляет поля.

`event_type:<kind>` оставляет один вид событий, а `-event_type:<kind>` (или `NOT event_type:<kind>`) исключает его;
повторите, чтобы исключить несколько. Виды: `default` (обычные события), `birthday`, `focus` (время для сосредоточенной
работы), `out-of-office`, `working-location` и `from-mail` (события, которые добавил Gmail). `event_type` — единственное
поле, которое можно исключить минусом; любое другое поле с минусом отклоняется.

Календарь называют по его id из `calendars list`, по id Google или по названию, как его показывает `calendars list`, в
любом регистре: `calendar:Team` или `'calendar:"Team (shared)"'` для названия с пробелами (одинарные кавычки не дают
оболочке съесть двойные). Это работает везде, где называют календарь: в `calendar:` здесь и в `calendars busy`, в
`<calendar>` у `events create` и `calendars sync`, в `--calendar` и `--to-calendar`. Если у двух календарей одно
название, например общий календарь рядом с вашим, команда останавливается с `calendar.ambiguous` и перечисляет их id;
укажите один из них.
На странице `--limit` событий (100); если есть ещё, `page.next_page` — значение для `--page`, а шаг `next` в ответе
запускает тот же запрос на страницу дальше.

`--source` читает не только аккаунт профиля, а одним списком: `--source all` читает все аккаунты Google, которые
`gcal` сохранил, `--source gcal:personal,gcal:work` называет профили, а `--source group:<name>` читает группу
аккаунтов, сохранённую через `config set account_groups.<name>`. Встречу, которая есть в двух аккаунтах, список
показывает один раз. Ответ называет прочитанные аккаунты в `meta.accounts`. Если у одного из них нет
синхронизированного календаря или его синхронизация не закончилась, ответ сообщает `meta.complete: false` с проблемой
для этого аккаунта (`calendar.unsynced`, `calendar.sync-incomplete`): запустите `gcal <that profile> sync`. Читается
каждый профиль, в который вошли на этом компьютере, даже ни разу не синхронизированный. Если задан
`GCAL_PROFILE_LOCK`, `--source` может назвать только аккаунт закреплённого профиля.

`overlapping:true` оставляет встречи, время которых пересекается с другой встречей, у каждой — `overlaps`, другие
встречи в виде `event:<id>`. С `--source` встречи сравниваются между аккаунтами, так что рабочая встреча, которая
совпала с личной, найдётся. Встреча учитывается, только если занимает ваше время: у неё есть время начала и конца,
она не отменена, вы её не отклонили, она не отмечена как «свободен» и не является блоком места работы. События на
весь день никогда не пересекаются, а встреча, которая заканчивается, когда начинается следующая, с ней не
пересекается. `overlapping:false` оставляет все остальные события.

`changed_at>=<date>` оставляет события, которые впервые сохранились, были перенесены, отменены или удалены с этой даты, у
каждого `change` (`new`, `moved` или `cancelled`) и `changed_at`; у перенесённого есть ещё `was` — где оно было
(`starts_at`, `ends_at`). Фильтр читает то, что сохранили синхронизации, поэтому видит только принесённое ими, а
встреча, перенесённая и возвращённая обратно, изменением не считается.

По умолчанию `search events` читает хранилище (`--backend archive`). `--backend server` вместо этого использует
собственный поиск Google Календаря по синхронизируемым календарям. Он находит и события за пределами
синхронизированного периода (год назад, три месяца вперёд). Он только читает, ничего не сохраняет в хранилище и
требует сети. Google возвращает совпадения в порядке, который не указывает, поэтому `gcal` выводит их от ранних к
поздним и отклоняет `--newest`; `--exact` и `--cursor` тоже не применяются:

```sh
gcal personal search events --backend server quarterly review
```

`--backend both` выполняет оба поиска: сначала совпадения из хранилища в его порядке, и у каждого, которое нашёл и
Google, в `found_by` есть `server`; затем события, которые нашёл только Google, от ранних к поздним. Хранилище и Google
по-разному ранжируют и разбивают события на страницы, поэтому `both` отвечает одной страницей без `next_cursor` и
отклоняет `--cursor` и `--newest`; чтобы увидеть больше, увеличьте `--limit`. Как и `server`, ему нужна сеть.

```sh
gcal personal search events --backend both quarterly review
```

Каждый отвечает списком событий в `items`. Поиск по хранилищу разбивает результаты на страницы курсором: если есть ещё,
`page.next_cursor` — значение для `--cursor`. Каждое событие называет в `untrusted` поля, которые написал отправитель
приглашения.

## Подготовка к встрече

`events prepare` собирает, что локальное хранилище знает об одной встрече, чтобы вы или агент написали к ней справку:

```sh
gcal personal events prepare                       # your next meeting
gcal personal events prepare event:42 --limit 3    # one meeting, three messages per list
gcal personal events prepare event:42 --since-time 2026-10-01
```

Без события команда берёт вашу следующую встречу: самое раннее событие, которое ещё не началось, имеет время начала и
конца, не отменено и не отклонено вами. Время для сосредоточенной работы, отсутствие в офисе и блоки места работы —
не встречи, как и событие, куда не приглашён никто, кроме вас и переговорных.

Ответ содержит событие так, как его выдаёт `events show`: участники с их ответами, файлы Drive, история. В `people`
каждый участник, кроме вас, приходит с тем, что о нём сохранили все инструменты WireCat на этом компьютере:

- `identities`: тот же человек в других инструментах — через `people link` или общий адрес;
- `recent.direct`: ваши последние личные сообщения и письма с ним; `recent.groups`: его последние сообщения в
  групповых чатах;
- `past_events`: прошлые события с ним; `meetings`: строки из его последних записанных встреч, например расшифровок
  Zoom, если их сохранил инструмент для встреч.

Команда читает только хранилище, никогда не Google и не мессенджер, поэтому сведения свежи настолько, насколько свежа
последняя синхронизация каждого инструмента. Она читает все аккаунты, которые видели каждого человека, и называет их в
`meta.accounts`. `meta.complete: false` значит, что чего-то не хватает: чата, который хранилище держит не целиком
(`chat.not-read`), встреч, ещё не проиндексированных по людям (`meetings.index-pending`), или незаконченной
синхронизации календаря. `--limit` задаёт, сколько сообщений остаётся в каждом списке (5). Сообщения получают первые
10 участников; остальные перечислены с `read: false`, и об этом говорит `meta.truncated`. У участника, которому вы
никогда не писали, списки пустые; `people link` связывает его с аккаунтом в другом инструменте.

`gcal` не пишет сводки. Поля в `untrusted` — текст приглашения и всё, что написали другие люди, — это данные для
агента, а не инструкции. `gcal guide prepare-meeting` и `gcal guide digest` показывают, как агент превращает этот ответ
и `events list` в справку к встрече или в ежедневную или еженедельную сводку.

## Напоминание перед встречей

`events remind` один раз сообщает о каждом событии, которое скоро начнётся. Команда сделана для таймера, который
запускает её каждые несколько минут, так же как `remind` в gcalcli запускают из cron:

```sh
gcal personal events remind                          # what starts in the next 10 minutes
gcal personal events remind --due-within 15m --json  # the next 15 minutes, as JSON
gcal personal events remind --dry-run                # what it would remind; nothing changes
gcal personal events remind -- /home/me/bin/meeting-reminder
```

Каждый запуск сначала синхронизирует календари (`--offline` читает только хранилище), а потом берёт события, которые
начинаются в пределах `--due-within`: это длительность от `1m` до `1d`, по умолчанию `10m`. Считаются только события,
которые занимают ваше время: со временем начала и конца, не отменённые, не отклонённые вами и не время для
сосредоточенной работы, не отсутствие и не рабочее место. `gcal` запоминает, о каких событиях уже напомнил, и следующий
запуск о них молчит. О встрече, перенесённой на другое время, он напомнит снова. Делайте `--due-within` не короче
промежутка между двумя запусками: при запуске каждые 5 минут `10m` находит каждую встречу не меньше чем за 5 минут до
начала.

Если синхронизация не удалась, например без сети, запуск всё равно напоминает по тому, что есть в хранилище. Об этом
говорят `meta.complete:
false` и `meta.issues`, а запуск завершается с кодом ошибки синхронизации, так что cron или
`systemctl --user status` показывают сбой.

### Запуск своей программы для каждого события

Без программы `events remind` выводит события: cron присылает вам по почте то, что выводит задание. После `--` команда
вместо этого запускает вашу программу по одному разу на событие:

- Событие приходит одной строкой JSON на стандартный ввод программы, в том же виде, что элемент `events list`, с
  добавленными `ref` (`event:<id>`) и `untrusted`.
- `GCAL_EVENT` (`event:<id>`) и `GCAL_PROFILE` есть в её окружении, так что она сама может запустить `gcal`.
- Её запускает не оболочка. Слова после `--` — это программа и её аргументы, ровно как вы их написали. Название, место
  и описание события никогда не попадают в её командную строку: их пишут другие люди, и в оболочке они могли бы
  выполнить команды. Сохраните это и в своей программе: передавайте их как данные и никогда не вставляйте в строку
  оболочки.
- Программа, которая завершилась с кодом 0, напомнила вам. Любой другой код оставляет событие для следующего запуска, и
  `gcal` отвечает `configuration_error` (`remind.hook-failed`) с кодом выхода для каждого события. Программа, которая
  всё ещё работает через 60 секунд, останавливается.
- В Windows укажите `.exe` или запускайте скрипт через его интерпретатор: `-- powershell.exe -File C:\me\remind.ps1`.
  Node.js отказывается запускать файл `.cmd` или `.bat` без оболочки.

`gcal` не запускает ни одной программы, пока вы это не разрешите, один раз на профиль:

```sh
gcal personal config set permissions.events.remind.hook allow
```

До этого ключ в `deny`, а `GCAL_READ_ONLY` отказывает при любом уровне. `--yes` на него не отвечает, и ни один
инструмент MCP не предлагает `events remind`: иначе агент, который может набрать команду `gcal`, мог бы запустить любую
программу на вашем компьютере.

Уведомление на рабочем столе в Linux, с `jq` и `notify-send`:

```sh
#!/bin/sh
# /home/me/bin/meeting-reminder
event=$(cat)
title=$(printf '%s' "$event" | jq -r '.title // "(no title)"')
start=$(printf '%s' "$event" | jq -r '.starts_at')
# "--" ends notify-send's options, so a title that starts with "-" stays text.
notify-send -- "Meeting at $start" "$title"
```

Сообщение в ваше «Избранное» в Telegram через `tg`, и данные о встрече для агента, который пишет справку:

```sh
#!/bin/sh
# /home/me/bin/meeting-to-telegram
title=$(jq -r '.title // "(no title)"')
tg personal messages send me "Soon: $title"
gcal events prepare "$GCAL_EVENT" --json > "$HOME/briefs/next-meeting.json"
```

### Запуск по таймеру

Запускайте её каждые 5 минут. Указывайте полный путь к `gcal` (его выводит `command -v gcal`): таймер запускается с
коротким `PATH`.

cron (`crontab -e`):

```text
*/5 * * * * /usr/local/bin/gcal personal events remind --due-within 10m -- /home/me/bin/meeting-reminder
```

Пользовательский таймер systemd в Linux, который заодно достаёт до вашего сеанса рабочего стола для `notify-send`.
Сохраните `~/.config/systemd/user/gcal-remind.service`:

```ini
[Unit]
Description=gcal meeting reminders

[Service]
Type=oneshot
ExecStart=/usr/local/bin/gcal personal events remind --due-within 10m -- /home/me/bin/meeting-reminder
```

и `~/.config/systemd/user/gcal-remind.timer`:

```ini
[Unit]
Description=gcal meeting reminders every 5 minutes

[Timer]
OnBootSec=1min
OnUnitActiveSec=5min

[Install]
WantedBy=timers.target
```

затем запустите его командой `systemctl --user daemon-reload && systemctl --user enable --now gcal-remind.timer`.

launchd в macOS: сохраните `~/Library/LaunchAgents/dev.wirecat.gcal-remind.plist`, затем выполните
`launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/dev.wirecat.gcal-remind.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>dev.wirecat.gcal-remind</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/gcal</string>
    <string>personal</string>
    <string>events</string>
    <string>remind</string>
    <string>--due-within</string>
    <string>10m</string>
    <string>--</string>
    <string>/Users/me/bin/meeting-reminder</string>
  </array>
  <key>StartInterval</key><integer>300</integer>
</dict>
</plist>
```

Планировщик заданий в Windows, в PowerShell:

```powershell
$gcal = (Get-Command gcal).Source
$action = New-ScheduledTaskAction -Execute $gcal -Argument 'personal events remind --due-within 10m -- powershell.exe -File C:\me\remind.ps1'
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 5)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName gcal-remind -Action $action -Trigger $trigger -Settings $settings
```

Два запуска одновременно не напоминают дважды: второй отвечает `validation_error` (`remind.running`) и ничего не
делает.

## Экспорт и импорт файлов iCalendar

`events export` записывает сохранённые события в файл iCalendar (`.ics`), который открывают другие программы
календаря. Команда принимает тот же запрос, что и `events list`, поэтому `id:<id>` экспортирует одно событие:

```sh
gcal personal events export id:42 --output planning.ics
gcal personal events export starts_at:[2026-11-02 TO 2026-11-09} -event_type:birthday --output week.ics
gcal personal events export id:42                               # the text in the answer, under content
```

Она экспортирует не больше 1000 событий; чтобы получить больше, сузьте запрос. Время записывается в UTC. Каждое
повторение повторяющегося события записывается как отдельное событие, а его правило повторения — нет. Новый файл может
читать только вы. Через MCP `--output` не предлагается: агент получает текст в ответе, через `gcal_read`, поэтому
экспортировать может и профиль только для чтения (`GCAL_READ_ONLY`). Запись файла — это всё-таки изменение: при
заданном `GCAL_READ_ONLY` `--output` отклоняется.

`events import` добавляет события из файла `.ics` в календарь через
[events.import](https://developers.google.com/workspace/calendar/api/v3/reference/events/import) Google. Каждое
событие сохраняет свой UID. Об импортированном событии Google никому не пишет.

```sh
gcal personal events import Team planning.ics
```

- Команда сначала спрашивает, потому что один импорт записывает целый файл событий; `--yes` отвечает за скрипт, а
  `--dry-run` показывает импорт, ничего не отправляя. Её ключ — `events.import` (см. [разрешения](./configuration.md#permissions)).
- Время с часовым поясом (`TZID`) сохраняет этот пояс; время без пояса читается в вашем. Пояс, которого Google не
  знает, например `W. Europe Standard Time` из Outlook, пропускается с причиной, как и изменённое повторение
  повторяющегося события (`RECURRENCE-ID`) и событие без UID. Ответ перечисляет их в `skipped`.
- В одном файле не больше 500 событий и 10 МБ. Если Google на середине отклонит событие, ошибка называет UID,
  импортированные до него. Повторный импорт снова отправляет каждое событие под его UID; справочник Google не говорит,
  что он делает с UID, который уже есть в календаре.

## Когда люди свободны

`calendars busy` спрашивает у Google, когда заняты ваши синхронизируемые календари и названные вами люди. Команде
нужна сеть, и она ничего не сохраняет: человек появляется в ответе только под тем адресом, который вы указали.

```sh
gcal personal calendars busy person:ana@example.com                # this week; busy times only, never what fills them
gcal personal calendars busy start>=2026-11-02 end<=2026-11-06 person:ana@example.com --duration-minutes 30
gcal personal calendars busy start>=today end<=today calendar:3 --duration-minutes 60 --hours 10:00-16:00
```

- Запрос задаёт окно через собственные `start` и `end` ответа: `start>=<date>` — с начала этого дня,
  `end<=<date>` — до его конца. Без `start` окно начинается сегодня; без `end` оно длится семь дней.
- `person:<email>` и `calendar:<id>` можно повторять, по одному условию на каждый: спрашиваются все названные. Без
  `calendar:` спрашиваются все синхронизируемые календари.
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
- Метод, который меняет данные и который легко отменить, например `events.insert` или `events.patch`, выполняется
  без вопроса. Метод, который удаляет, и открытие доступа к календарю сначала спрашивают; `--yes` отвечает за скрипт.
  `calendars.clear` (все события основного календаря), `calendars.delete` и `calendars.transferOwnership`
  отклоняются, пока вы не разрешите их в [разрешениях](./configuration.md#permissions) профиля.
- Уведомления Google об изменениях (`watch` и `channels.stop`) не предлагаются. Им нужен публичный веб-адрес, а у
  программы на вашем компьютере его нет.

## Менять события

После `session start --grant write` команды `events create | update | delete | move | respond | import` меняют
одновременно Google Календарь и хранилище. Календарь указывается по его ID из `calendars list`, например `3` ниже, или
по названию. Это общие команды
записи в календарь из cli-core; к Google они обращаются через те же созданные методы, что и `gcal api`.

```sh
gcal personal events create 3 --title "Planning" --start-time 2026-11-02T10:00 --end-time 2026-11-02T11:00
gcal personal events create 3 --title "Offsite" --start-date 2026-11-03 --end-date 2026-11-04
gcal personal events create Work --text "Lunch with Ana tomorrow 1pm at Example Cafe"
gcal personal events create 3 --title "Standup" --start-time 2026-11-02T09:30 --end-time 2026-11-02T09:45 \
  --repeat "FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=12"
gcal personal events update event:42 --series --repeat "FREQ=WEEKLY;BYDAY=TU" --no-notify
gcal personal events update event:42 --start-date 2026-11-02 --end-date 2026-11-02 --no-notify
gcal personal events update event:42 --start-time 2026-11-02T14:00 --end-time 2026-11-02T15:00 --no-notify
gcal personal events update event:42 --following --start-time 2026-11-09T10:00 --end-time 2026-11-09T10:30 --no-notify
gcal personal events respond event:42 accepted --notify
gcal personal events move event:42 --to-calendar 4 --no-notify
gcal personal events delete event:42 --no-notify
gcal personal events delete event:42 --following --no-notify
```

- Создание, изменение, перенос и ответ на приглашение выполняются без вопроса. Удаление сначала спрашивает; `--yes`
  отвечает за скрипт. `--dry-run` показывает любую запись, не выполняя её. Чтобы получать вопрос и для остальных,
  задайте их ключам `ask` (см. [разрешения](./configuration.md#permissions)).
- Если среди участников есть кто-то кроме вас, укажите, рассылает ли Google им письма: `--notify` или `--no-notify`.
  `--notify` отклоняется, пока вы не разрешите `events.notify` (см. [разрешения](./configuration.md#permissions)).
- Изменение несёт версию, которую видела последняя синхронизация. Если с тех пор событие изменилось в Google, запись
  останавливается с `event.conflict`: выполните `sync` и попробуйте снова. Ничего не перезаписывается.
- Создание, ответ на которое потерялся, заканчивается `outcome_unknown` и называет его `operation_id`; повторите его с
  `--operation-id <id>`, и Google найдёт событие вместо того, чтобы создать второе.
- В повторяющемся событии запись меняет одно названное вами повторение; `--series` меняет всю серию, а `--following` —
  это повторение и все следующие. Удаление всей серии отклоняется, пока вы не разрешите `events.delete.series`, как
  и новое правило `--repeat`, которое заканчивает серию раньше (новый `COUNT` или более ранний `UNTIL`).
- `update --following` заканчивает серию прямо перед повторением и начинает с него новую серию с вашим изменением,
  сохраняя участников. Серии, которая заканчивается после заданного числа раз (`COUNT`), для новой части нужен
  `--repeat`. Если закончить старую серию не удалось, ошибка называет ID новой серии; повторите с `--operation-id <id>`.
  `delete --following` только заканчивает серию и, как любое удаление, сначала спрашивает.
- `move --to-calendar <id>` переносит событие, сохраняя его ID, в другой календарь того же аккаунта, в который вы
  можете писать. Повторение переносится только вместе со всей серией (`--series`). Google переносит только обычные
  события, а не время для работы, отсутствие, место работы или дни рождения.
- `--repeat` принимает правило RFC 5545: `FREQ` — `DAILY`, `WEEKLY` или `MONTHLY`, с `INTERVAL`, `BYDAY` (`MO,WE`;
  в ежемесячном правиле также `1MO` или `-1FR`) и `COUNT` или `UNTIL`. `UNTIL` — это дата, `20261231`, для события на
  весь день и время UTC, `20261231T230000Z`, для события со временем. Новому правилу нужен `--series`, и оно сохраняет
  исключённые даты серии. После этого выполните `sync`, чтобы сохранить новые повторения.
- Новые даты делают событие со временем событием на весь день, а новое время делает событие на весь день событием со
  временем. `gcal` читает событие из Google и отправляет его целиком, с вашим изменением, и только если это всё ещё
  версия, которую видела последняя синхронизация. Повторяющемуся событию, правило которого заканчивается датой или
  временем прежнего вида, нужно заново передать правило через `--repeat`.
- `respond` меняет только ваш собственный ответ; остальной список гостей остаётся таким, каким его хранит Google.
- `create --text` передаёт одну строку в
  [быстрое добавление](https://developers.google.com/workspace/calendar/api/v3/reference/events/quickAdd) Google,
  которое находит в ней название, день, время и место так же, как быстрое добавление в самом Google Календаре. Другие
  параметры полей с ним не используются. Её ключ — `events.create`, а также `api.calendar.events.quickAdd`. Без
  `--notify` никому не приходит письмо. Id события выбирает Google, поэтому `--operation-id` не применяется: если ответ
  потерялся (`outcome_unknown`), запустите `sync` и посмотрите `events list changed_at>=today`, прежде чем добавлять
  событие снова, иначе оно может появиться дважды.

## Вывод для скриптов

Каждая команда, кроме `mcp serve`, принимает `--json` и выводит одно значение JSON в stdout. Ошибки выводятся как JSON
в stderr, с кодом, по которому можно ветвиться. Коды перечислены в [справочнике команд](./commands.md).

`events list`, `events prepare`, `doctor` и `session status` также сообщают, когда они ответили и в каком часовом
поясе: `meta.now` (UTC), `meta.now_local` (тот же момент со смещением вашего пояса) и `meta.timezone`. Агент берёт
«сегодня» и «следующий понедельник» из них, а не из своей догадки. Пояс — пояс вашего компьютера (`TZ`), в нём
читаются `today` и дата без времени. Собственный пояс каждого календаря есть в `calendars list` (`timezone`).

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
[настройки](./configuration.md#permissions). Это касается и открытия доступа к календарю (`acl`): агент может сделать
это без вопроса. Удаление целого календаря (`calendars.delete`) и передача его другому аккаунту
(`calendars.transferOwnership`) запрещены, пока вы их не разрешите. Две команды агенту
никогда не предлагаются: `api call` и `calendars.clear`, которая очищает календарь. Их вы запускаете сами, в
терминале. Не предлагаются и команды, которые настраивают вход и связь с агентом: `session start` и `session end`, а
также `mcp serve`, `mcp add`, `mcp config`, `mcp check`, `mcp revoke` и `mcp server start | stop | status`.
