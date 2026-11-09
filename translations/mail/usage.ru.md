---
title: "Работа с инструментом"
---

Здесь объясняется, как устроена команда и как инструментом пользуется агент. Прочитайте это перед первой командой.
Ссылки, id и курсоры в примерах выдуманы (`me%40example.com`, `5b0e1c2a@example.com`): подставляйте те, что дают
ваш поиск, запуск или список.

## Сначала профиль

Профиль — имя, которое вы выбираете для одного аккаунта. Это первое слово каждой команды, которая работает с
аккаунтом:

```sh
mail personal folders list
```

`MAIL_PROFILE=personal` делает то же для одного сеанса оболочки. Профиль никогда не подставляется сам, даже единственный:
команда без профиля останавливается с кодом выхода 2 и показывает профили на этом компьютере.

## Подключить почтовый ящик

Сначала подготовьте ящик: включите IMAP и создайте пароль приложения. Шаги для каждого провайдера описаны в
[подготовке почтового ящика](./providers.md), их же печатает `session start`.

```sh
mail personal session start --address me@example.com # new profile: finds the server, shows the steps, asks for the app password.
mail personal session start                 # an existing profile: asks for the app password again (checked, kept in the keyring)
mail personal account check                 # logs in and lists what the server supports
mail personal folders list                  # folders with role and counts
mail personal sync --since-time 2026-10-01  # reads new mail into the shared store; stored mail is skipped
```

`session start` для нового профиля должен найти почтовый сервер. Сначала он смотрит в свою таблицу
[провайдеров](./providers.md). Затем смотрит запись MX домена. Затем спрашивает список почтовых серверов Thunderbird и
собственный файл настроек домена. Если сервер не известен никому из них, задайте его сами через `--host`, `--port` и
`--security` или назовите провайдера из таблицы: `--provider yandex`.

В терминале `session start` спрашивает то, чего не хватает: провайдера и адрес. Без терминала он ничего не спрашивает.
Отсутствие `--address` или пароля тогда — ошибка, а пароль он читает из `MAIL_PASSWORD`. Профиль сохраняется только после
того, как сервер принял пароль приложения. Outlook.com и Microsoft 365 принимают только OAuth, поэтому `session start` открывает для них
браузер ([подключение Outlook](./outlook.md)). Чтобы сменить сервер существующего профиля, используйте `config set` или новое имя профиля.

`session start` берёт пароль из терминала или из `MAIL_PASSWORD`. Из параметра или ссылки он его никогда не берёт. После того
как сервер принял пароль, `mail` хранит его в системной связке ключей. Если связка ключей не работает, `mail` хранит его в
закрытом файле и один раз сообщает об этом в stderr. `--credential-storage file` выбирает файл; мы этого не рекомендуем.
Если у `mail` нет пароля, он читает тот, что оставила Himalaya (`secret-tool`, служба `himalaya`, аккаунт — имя профиля).
Тогда существующей настройке Himalaya новый пароль не нужен.

`sync` читает INBOX и папку Sent; в Gmail он читает «Вся почта», потому что архивная почта уходит из INBOX. Другие папки
задают `--folder` или настройка `folders` профиля. Он читает сначала самую новую почту. `--max-messages` ограничивает число новых
писем за один запуск. `--rescan` заново перечисляет всё окно. Он сохраняет текст и заголовки, а также текст каждого
вложения, которое может прочитать, но не сами файлы. Он читает вложения до 10 МБ каждое: настройки профиля
`read_attachments` (`false` — не читать никаких) и `max_attachment_mb` меняют это, а `--no-attachments`, `--attachments`
и `--max-attachment-mb <n>` меняют это на один запуск. Непрочитанный файл сохраняет имя и размер. `messages show` для
письма с таким файлом заново читает это письмо с сервера, каждое вложение независимо от размера, и показывает текст;
`--offline` показывает сохранённое письмо. Чтобы сохранить файл, используйте `attachments download`. Правила аккаунта (`mail personal rules`, их хранит и
memo) действуют и здесь: письмо, названное правилом пропуска, не читается, а правило конверта оставляет только отправителя,
дату и размер.

Большой ящик не помещается в один запуск. У `sync` есть бюджет запросов к серверу, рассчитанный на его срок: 15 минут в
терминале, 45 секунд через MCP. `--timeout` меняет срок. `--max-pages` уменьшает бюджет. Запуск сохраняет прочитанное, затем
отвечает `state: partial` и выдаёт ту же команду в `next`. Выполните её снова, чтобы продолжить. `mail personal status`
показывает, как далеко ушла синхронизация.

Чтобы профиль оставался актуальным, поставьте его `sync` на таймер (systemd, launchd или Планировщик заданий Windows):
`mail personal schedule command mail-personal --every 5m -- sync`. `mail personal schedule list` показывает каждое расписание и итог его
последнего запуска, а `doctor` сообщает, когда запуск раз за разом не удаётся.

Яндекс не выдаёт id сообщения. Для такого сервера `sync` перечисляет только номер, флаги, дату и размер каждого сообщения, а
каждое новое сообщение скачивает один раз. Сохранённую почту он пропускает по этому номеру, так что повторный запуск ничего не
читает дважды. Он не замечает почту, удалённую на сервере, и изменённые флаги у пропущенных сообщений. `--rescan` учитывает и
то и другое. Он также переносит сохраненный ответ, оказавшийся вне своей цепочки, в цепочку первого письма, на которое
тот отвечает, начиная с `--since-time`. `rethreaded` показывает, сколько писем он перенес.

Иногда сервер не может ответить по одному сообщению (Яндекс отвечает так на некоторые с `NO [UNAVAILABLE]`). `sync` запрашивает
его ещё раз в конце запуска. Если сбой повторяется, `sync` учитывает сообщение в `unreadable` и оставляет его до следующего
запуска.

Иногда сервер закрывает соединение. `sync` ждёт 1, затем 3, затем 10 секунд, с небольшим случайным разбросом, чтобы много
запусков не повторяли попытку одновременно. Затем он переподключается. Он проверяет, что сервер по-прежнему нумерует почту
папки так же, и продолжает с неудавшегося запроса, пока позволяют бюджет и срок. Если сбой повторяется, ответ сохраняет
собственный код сетевой ошибки как `cause_code`, и `mail runs show` его показывает.

## Вывод для скриптов

Каждая команда, кроме `mcp serve` на stdin и stdout, принимает `--json` и печатает одно значение JSON в stdout. Ошибки — JSON в stderr, с кодом, по которому можно ветвиться. В
[справочнике команд](./commands.md) коды перечислены.

## Агенты

`mail skill install` кладёт навык инструмента туда, где его ищут Claude Code, Codex, Gemini CLI и OpenClaw.
`mail skill install --for hermes` также добавляет эту папку в собственные настройки Hermes Agent, поэтому простая
`skill install` Hermes не затрагивает. `mail personal mcp serve` отдаёт команды профиля по MCP, через stdin и stdout:

```sh
claude mcp add mail -- mail personal mcp serve
```

Сервер предлагает все команды. `sync` пишет только в локальное хранилище; записи `messages` и `folders` меняют почтовый
ящик. Что выполнится, решают разрешения профиля; см. [настройки](./configuration.md#permissions).

Для ChatGPT и Claude в браузере
`mail personal mcp serve --http --public-url https://laptop.example.ts.net` работает на `127.0.0.1` (порт 8765 или
`--port`) за вашим собственным туннелем. Браузерное приложение входит по одноразовому коду, который печатает команда;
`mail personal mcp revoke` завершает все входы. `mail personal mcp server start` запускает тот же
сервер в фоне, `mcp server status` показывает его порт, код входа и вошедшие приложения, а
`mcp server stop` его останавливает.

## Обзор: что нового, кому вы должны ответить, чего ждёте

`review` читает почту, которую сохранил sync, и ничего не спрашивает у сервера. Он говорит словами tg:

```sh
mail personal review "date>2h"            # every email, yours too, in threads that changed in the last 2 hours
mail personal review --new                # what changed since the last `review --new`; 3 days back the first time
mail personal review --unanswered 1d      # threads whose newest email came to you (To or Cc) and has no answer for a day
mail personal review --waiting 7d         # threads where you wrote last and nobody answered for a week
mail personal review "bulk:false"         # leave out threads of mail sent to many, lists and envelopes
```

Показываются все письма, массовые тоже; поле `email` каждого элемента содержит `bulk`, `list_id` и `rule_id` рядом с
оценкой отправителя, чтобы вы или агент могли их рассортировать. Почта новее последней законченной синхронизации ждёт
следующего обзора. `--new` хранит отметку для каждого ящика и читателя: вашу, агента через MCP и отдельную для каждого
запуска по расписанию, так что расписание никогда не сдвигает вашу. Без даты `--unanswered` и `--waiting` смотрят на
цепочки, активные за последние 30 дней. `memo tasks agenda --source email:me@example.com` показывает те же цепочки, где вы
должны ответить или ждёте ответа.

Агент или конвейер, который обрабатывает вашу почту, хранит свою отметку о том, докуда он дошёл, в общем хранилище и в
порядке сохранения почты — поэтому письмо, сохранённое поздно и со старой датой, не пропускается:

```sh
mail personal review --holder mail-triage --json        # what is stored past its mark; the answer gives a cursor
mail personal messages acknowledge --holder mail-triage --cursor 9123.1762090000000   # once processed: move the mark there
mail personal status                                    # how far each holder got, what it held and skipped
```

Отметка движется только вперёд. Массовые письма, конверты и черновики пропускаются и считаются; письмо, которое ещё
читается целиком (частичное), задерживается, пока не прочитано, но не дольше 7 дней. Новый держатель начинает с почты,
сохранённой сейчас.

## Поиск по почте

`mail` ищет и читает почту, которую синхронизировал его профиль, в локальном хранилище, и спрашивает почтовый сервер о
письмах, которых `sync` ещё не прочитал (`--backend archive` оставляет только хранилище):

```sh
mail personal search messages invoice                                  # best match first, any form of the word
mail personal search messages 'from:ann@example.com has:attachment date>30d'
mail personal search messages 'list:github.com is:unread' --newest     # a mailing list, newest first
mail personal messages show 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E' # the whole email and its attachments' text
mail personal conversations list emails_count>1                        # threads, newest first
mail personal conversations show 'chat:email/me%40example.com/thread-1' # one thread, oldest first
```

Язык запросов тот же, что у всех CLI WireCat ([руководство по поиску](https://github.com/WireCatLabs/cli-core/blob/main/docs/search/query-language.md)):
`from:`, `to:`, `cc:`, `subject:`, `mailbox:` или `label:`, `list:` (List-Id или его домен), `is:unread`,
`has:attachment`, `filename:`, `content:` (текст вложений), `size>` и `date:`. Каждая команда читает только ящик своего
профиля; [memo](https://github.com/WireCatLabs/cli-memo) ищет по всем ящикам вместе с вашими сообщениями и заметками
(`memo search mail`, `memo search all`). Хранилище держит текст, а не само письмо, поэтому исходника для показа нет.

`search messages` спрашивает и почтовый сервер, поэтому находится и почта, которую sync ещё не прочитал: в Gmail — его
собственным поиском по «Вся почта», на других серверах — IMAP SEARCH в INBOX, Sent и Archive (или в `folders` профиля).
Найденное сервером сохраняется, а решает тот же запрос, поэтому каждая находка говорит `found_in`: `archive`, `server`
(новое с сервера) или `both`. `--backend archive` оставляет только хранилище, `--backend server` отвечает только тем, что
нашёл сервер, а `--server-time 20s` ждёт дольше обычного: 5 секунд, 20 у Яндекса, где поиск по большому INBOX
идёт 5-7 секунд. Ожидание всегда заканчивается раньше срока самой команды, поэтому медленный сервер даёт частичный ответ, а не
таймаут. Поиск скачивает только первые 256 КиБ каждого найденного письма: более крупное сохраняется с текстом и без вложений,
и ответ об этом говорит (`search.server-partial`). Следующий `sync` читает его целиком и сообщает, сколько таких, в
`partial_emails` (`completed`, `left`); письмо, которое сервер больше не отдаёт там, где оно было сохранено, после трёх попыток
оставляют и считают в `stuck`, и оно остаётся читаемым без вложений. Сервер читает слова, `from:`, `to:`, `cc:`,
`subject:`, `body:`, `is:` и `date:`; остальную часть запроса применяют к тому, что он вернул. IMAP SEARCH находит части
слов и не знает других форм слова, поэтому сервер может пропустить находку, которую хранилище, со всеми формами, найдёт после
sync. `permissions.messages.server-search=deny` в профиле отключает поиск на сервере.

Письма от отправителя, чья почта похожа на спам или мошенничество, идут после остальных на странице; `--plain-order`
сохраняет порядок, который задают слова. `messages show` выдаёт первые 4000 символов текста каждого вложения; `--full`
выдаёт весь текст и HTML-тело. `--before-n` и `--after-n` добавляют письма вокруг него в цепочке.

## Экспорт почты

Хранилище держит текст, а не само письмо, поэтому `messages export` заново читает оригиналы с сервера. Он выбирает тем же
запросом, что и `search messages`, и пишет закрытую папку (режим 700, файлы 600):

```sh
mail personal messages export 'from:ann@example.com' --output-dir ~/mail-backup     # one mbox file per folder
mail personal messages export --folder INBOX --format maildir --output-dir ~/Maildir # Maildir++, for mu and notmuch
mail personal messages export 'date>30d' --max-messages 500 --output-dir ~/mail-backup --resume
mail personal stats messages top --by list --limit 10                          # which lists send the most
```

`stats messages show` считает сохранённые письма, подходящие запросу, полученные и отправленные, по календарным дням,
неделям (ключ — её понедельник) или отправителям в часовом поясе `--timezone`. Только счётчики, поиск не записывается:

```sh
mail personal stats messages show --by day --timezone Europe/Madrid -- 'date>=30d'
# {"item":{"by":"day","received":14,"sent":3,"rows":[{"key":"2026-11-01","name":null,"received":4,"sent":1}]}}
mail personal stats messages show --by sender --limit 10                       # by sender counts received mail only
```

- **Что записывается.** Каждое письмо так, как его хранит сервер, байт в байт, в каждой папке, где оно лежит (Gmail
  хранит письмо и в «Вся почта», и в INBOX: передайте `--folder`, чтобы выгрузить одну). Файлы mbox — mboxrd: строка тела,
  которая начинается со слова From, получает `>` перед собой. Имена файлов Maildir несут состояние «прочитано» (`S`) и
  «помечено» (`F`).
- **Никогда поверх существующего.** Папка, в которой что-то есть, отклоняется. `--resume` продолжает начатую там выгрузку
  (файл журнала `.mail-export.jsonl` перечисляет сделанное и длину каждого файла mbox после него); `--replace` пишет в любую
  папку поверх файлов с теми же именами и ничего не удаляет.
- **По частям.** Запуск останавливается на `--max-messages`, `--max-pages` или перед своим сроком и отвечает `state: "partial"`;
  запустите его снова с `--resume`. Письма, для которых в хранилище нет UID (сделайте sync снова) или которых на сервере уже
  нет, считаются, но не записываются.

## Посмотреть до sync и принести архив

`account inspect` читает с сервера заголовки писем ящика, ничего не сохраняет и группирует их по рассылке или
отправителю, самая большая группа первой, чтобы вы решили, что оставить, до большого первого `sync`:

```sh
mail gm account inspect                                    # every email the profile's folders hold
mail gm account inspect --since-time 2025-01-01 --limit 20
mail gm account inspect --domain-age                       # also asks when each sender's domain was registered
mail gm messages import ~/Takeout/Mail/archive.mbox         # a Google Takeout file of the same Gmail account
```

- **Что показывает группа.** Сколько писем и МБ, долю непрочитанных и массовых, годы, отвечали ли вы, подсказку `skip` и
  оценку: насколько отправитель похож на спам, мошенничество или робота. Виды писем, под которые подошло бы встроенное
  правило, закрывают список; `rules add --kind <kind> --do envelope` делает из вида правило.
- **Возраст домена отправителя.** Домен, зарегистрированный за несколько месяцев до прихода письма, — признак
  мошенничества. `--domain-age` спрашивает реестр домена каждой показанной группы по RDAP, один вопрос в секунду, и
  навсегда хранит ответ в папке состояния `mail`. `sync` оценивает каждого отправителя сохранённой почты не чаще раза в
  день, спрашивает реестры о доменах, от которых писали за последние два года и которых он ещё не знает, и перестаёт
  спрашивать до своего срока; поиск ранжирует письма отправителя с признаками мошенничества ниже. Крупных почтовых
  провайдеров и отправителей, которым вы отвечали, не спрашивают никогда, а у большинства национальных доменов (.ru, .de,
  .es, .io) нет RDAP, и они остаются неизвестными.
- **Архив Takeout.** `messages import` читает файл mbox Gmail, который Google Takeout записал, в сохранённую почту этого
  профиля Gmail. Takeout хранит собственные идентификаторы Gmail, поэтому письмо, которое приносят и файл, и `sync`,
  сохраняется один раз. Команда только добавляет: Спам и Корзина пропускаются, правила профиля пропускают то, что
  пропускают, а письма, которых нет в файле, никогда не помечаются удалёнными. Неизменённый файл, прочитанный до конца,
  заново не читается; `--max-messages` и `--since-time` ограничивают запуск. Профиль не из Gmail отклоняется, потому что его
  идентификаторы сохранили бы каждое письмо дважды.

## Порядок в ящике

Каждое изменение сначала идёт на сервер, затем в хранилище, поэтому `search messages` показывает его сразу. Письма
называют через `ref`, который выдаёт поиск, или выбирают через `--filter` тем же запросом:

```sh
mail personal messages mark-read 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E'                               # also mark-unread, star, unstar
mail personal messages update 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E' --flag answered --unflag '$Junk'  # flags and keywords; --replace sets the whole set
mail personal messages move 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E' --folder archive                   # a folder by path, name or role
mail personal messages copy --filter 'list:github.com' --folder Lists --yes
mail personal messages delete --filter 'from:shop@example.com date<2025-01-01'   # a preview: nothing moves
mail personal messages delete --filter 'from:shop@example.com date<2025-01-01' --yes
mail personal messages restore --run 20261101T101500Z-messages-delete-1a2b3c --yes
mail personal folders create Receipts                                  # also folders rename, folders delete
```

- **Сначала предпросмотр.** Удаление, изменение, выбранное через `--filter`, и изменение более чем 20 писем отвечают тем,
  что изменится, и той же командой с `--yes` в `next`; до этого ничего не меняется. `--dry-run` всегда только показывает.
  Флаг или перемещение одного письма выполняются сразу.
- **Отмена.** Каждое изменение отвечает полем `run_id`. Перед обращением к серверу запуск записывает место каждого
  письма, флаги и метки Gmail; `messages restore --run <id>` возвращает то, что всё ещё там, где его оставил запуск: корзину
  в папку, перемещение обратно, копию убирает, флаги как были. Каждая запись запуска на сервер указана в `writes` со
  своим `operation_id`, и `--write <id>` отменяет только эту запись. Запуски старого `memo mail delete` восстанавливаются здесь
  же. Письмо с текстом возвращается в поиск со следующим `sync`; конверт — сразу.
- **Gmail.** Вся почта лежит в «Вся почта», а папка — это метка: `move --folder Work` добавляет метку `Work` и убирает
  `Inbox`, `copy` только добавляет её, `--folder archive` только убирает `Inbox`, а `delete` переносит письма из «Вся
  почта» в корзину, сохраняя их метки в запуске, так что восстановление возвращает их.
- **Корзина.** `delete` никогда не стирает насовсем. Ему нужна папка корзины: та, что сервер помечает `\Trash`, иначе
  собственные названия провайдера (Яндекс: «Удалённые»). Письмо, уже лежащее в корзине, считается как `in_trash` и не
  трогается.
- **Правила.** `rules add --domain shop.example --do envelope` оставляет от такой почты только конверт; `rules apply --yes`
  урезает уже сохранённую почту. `messages delete --rules` затем переносит почту-конверты в корзину, каждое письмо
  решается заново: оно остаётся, если совпало правило защиты или сохранения, вы отвечали отправителю, оно помечено звёздочкой,
  важное, отправленное или черновик, на нём есть ваша метка или ему меньше 30 дней; метки и звёздочки Gmail читаются заново
  прямо перед переносом. Команда отказывается работать, пока резервной копии хранилища не меньше 8 дней, а первый запуск
  переносит не больше 100 писем.
- **Папки.** `folders delete` — предпросмотр, пока нет `--yes`, и отказывается удалять папку, в которой ещё есть почта или
  число писем в которой сервер не сообщает; `--allow-dangerous` удаляет её вместе с почтой насовсем (вне Gmail почта
  пропадает). `--allow-dangerous` передаёте только вы, в терминале: агент по MCP его никогда не получает. Входящие и
  специальные папки сохраняют свои названия.

## Черновики

Черновик попадает в собственную папку «Черновики» почтового ящика, поэтому виден в каждом почтовом приложении. Его пишет
агент; вы читаете его и отправляете из почтового приложения или через `drafts send`.

```sh
mail personal drafts create --to anna@example.com --subject 'Monday' 'Shall we meet at ten?'
mail personal drafts create --reply-to 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E' --reply-all 'Thanks, agreed.'   # in the thread, to everyone but you
mail personal drafts create --to anna@example.com --subject Notes - < notes.txt # - reads the text from stdin
mail personal drafts list                                                       # newest first, read from the server
mail personal drafts update 5b0e1c2a@example.com 'New text'                                   # only what you give changes
mail personal drafts delete 5b0e1c2a@example.com --allow-dangerous                             # the owner's; gone for good, a preview without it
```

- **Id** — это Message-ID черновика, как его показывает `drafts list`, с `<>` или без. Он остаётся прежним при изменении
  черновика.
- **Ответ** читает письмо с сервера: он уходит на его Reply-To или отправителю (с `--reply-all` ещё и всем остальным, кому
  оно шло, но не вам), с `Re:`, `In-Reply-To` и `References`, которые оставляют его в цепочке.
- **Изменение** сначала сохраняет новую версию, затем переносит старую в корзину, поэтому сбой посередине оставляет два
  черновика, но не ноль, и старый текст можно найти. Текст, `--to`, `--cc`, `--bcc` и `--subject`, которые вы указали,
  заменяют прежние; остальное, цепочка и вложения остаются. Нужна папка корзины.
- **Удаление** необратимо, поэтому `drafts delete` принимает `--allow-dangerous`, который передаёт только владелец: `drafts delete` и `drafts send` убирают черновик через UID EXPUNGE, для чего серверу нужен UIDPLUS.
- **Папка** — та, что сервер помечает `\Drafts`, иначе собственное название провайдера (Gmail «[Gmail]/Drafts», Яндекс
  «Черновики»).
- Черновик помечен `\Draft` и `\Seen`. `drafts.delete` спрашивает сначала; `drafts.create` и `drafts.update`
  выполняются сразу, а `MAIL_READ_ONLY=1` отклоняет все три.

## Ваши теги

Ваши теги ставятся на сохранённую почту и остаются на этом компьютере: сервер их не видит. Это те же теги, которые читает
memo, и поиск их находит.

```sh
mail personal tags add invoices --message 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E'     # one email; --chat 'chat:email/me%40example.com/thread-1' tags a whole conversation
mail personal search messages 'tag:invoices date>30d'
mail personal tags list tag:invoices                  # what is tagged; type:message or type:chat
mail personal tags remove invoices --message 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E'
```

Тег — это 1–32 символа: буквы a–z, цифры и дефисы; заглавные становятся строчными. Сервер хранит вместо них ключевые слова
(`messages update --flag '$Work'`) и, в Gmail, метки (`messages move|copy --folder Work`).

## Отправка, ответ и пересылка

`mail` отправляет через SMTP-сервер провайдера с паролем приложения профиля; сервер берётся из
[списка провайдеров](./providers.md) или из `smtp_host`, `smtp_port` и `smtp_security` в профиле.

```sh
mail personal messages send --to ann@example.com --subject Lunch "See you at noon."
echo "The report." | mail personal messages send --to ann@example.com --subject Report --file ./report.pdf
mail personal messages send --reply-to 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E' "Paid today."                # Re:, In-Reply-To, References, the quote
mail personal messages send --reply-to 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E' --reply-all "Thanks, all."   # also to the original's To and Cc, not you
mail personal messages forward 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E' --to bob@example.com "FYI"           # the original attached whole
mail personal messages send --to ann@example.com --subject Hi "Hello" --dry-run   # build it, send nothing
mail personal messages send --to me@example.com --subject Digest --html < digest.html   # HTML, with a plain-text alternative made from it
mail personal drafts send 5b0e1c2a@example.com                                     # send a saved draft, then remove it
```

- **Вопрос.** Письмо кому-либо, кроме вас, сначала спрашивает и показывает от кого, кому, копию, скрытую копию, тему,
  каждое вложение и первые строки текста; `--yes` отвечает на вопрос. Без терминала ответ — `confirmation_required`.
  `config set permissions.messages.send.others allow` отключает вопрос. Письмо только себе не спрашивает никогда.
- **Агенты.** По MCP агент может писать, отвечать, пересылать и отправлять черновики только вам; письмо кому-то ещё
  отвечает `permission_error`, пока вы не зададите `messages.send.others` в настройках.
- **Файлы.** `--file` принимает путь так, как вы его назвали; `mail` никогда не раскрывает шаблоны. Папки с учётными данными
  (`.ssh`, связки ключей, профили браузеров) и папки WireCat отклоняются, если нет `--allow-any-file`, который передаёте
  только вы, в терминале: агент по MCP его никогда не получает. Текст со словом «attached» без файла вызывает
  предупреждение.
- **Отправленные.** Gmail сам кладёт письма, отправленные по SMTP, в «Отправленные». В других местах `mail` добавляет свою
  копию, со строкой Bcc, если в «Отправленных» нет этого Message-ID. Затем письмо читается в хранилище, поэтому
  `search messages` находит его сразу.
- **Потерянный ответ.** Если связь рвётся после того, как письмо ушло, ответ — `outcome_unknown` с `operation_id`.
  Выполните ту же команду с `--operation-id <id>`: если письмо лежит в «Отправленных», повторно ничего не отправляется. У
  провайдера, который сам не кладёт отправленные письма, первая попытка всё же могла дойти; посмотрите в почте получателя
  перед повтором.
- **Вложения.** `attachments list 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E'` нумерует файлы одного письма; `attachments download 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E'
  --output-dir ./folder` сохраняет их, доступными только вам, под их обычными именами; `attachments download 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E' 2
  --output-dir ./folder` сохраняет только второй. Байты берутся с сервера и никогда не попадают в хранилище.
  Существующий файл остаётся, если нет `--replace`.
