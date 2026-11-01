---
title: "Работа с инструментом"
---

Здесь объясняется, как устроена команда и как инструментом пользуется агент. Прочитайте это перед первой командой.

## Сначала профиль

Профиль — имя, которое вы выбираете для одного аккаунта. Это первое слово каждой команды, которая работает с
аккаунтом:

```sh
mail ya folders list
```

`MAIL_PROFILE=ya` делает то же для одного сеанса оболочки. Профиль никогда не подставляется сам, даже единственный:
команда без профиля останавливается с кодом выхода 2 и показывает профили на этом компьютере.

## Подключить почтовый ящик

Сначала подготовьте ящик: включите IMAP и создайте пароль приложения. Шаги для каждого провайдера описаны в
[подготовке почтового ящика](./providers.md), их же печатает `session start`.

```sh
mail ya session start --address me@example.com # new profile: finds the server, shows the steps, asks for the app password
mail ya session start                 # an existing profile: asks for the app password again (checked, kept in the keyring)
mail ya account check                 # logs in and lists what the server supports
mail ya folders list                  # folders with role and counts
mail ya sync --since-time 2026-10-01  # reads new mail into the shared store; stored mail is skipped
```

`session start` для нового профиля должен найти почтовый сервер. Сначала он смотрит во встроенную таблицу (Яндекс, Gmail,
iCloud, Mail.ru, Fastmail, Outlook). Затем смотрит запись MX домена. Затем спрашивает список почтовых серверов Thunderbird и
собственный файл настроек домена. Если сервер не известен никому из них, задайте его сами через `--host`, `--port` и
`--security` или назовите провайдера из таблицы: `--provider yandex`.

В терминале `session start` спрашивает то, чего не хватает: провайдера и адрес. Без терминала он ничего не спрашивает.
Отсутствие `--address` или пароля тогда — ошибка, а пароль он читает из `MAIL_PASSWORD`. Профиль сохраняется только после
того, как сервер принял пароль приложения. Outlook принимает для IMAP только OAuth, поэтому `session start` пока его
отклоняет. Чтобы сменить сервер существующего профиля, используйте `config set` или новое имя профиля.

`session start` берёт пароль из терминала или из `MAIL_PASSWORD`. Из параметра или ссылки он его никогда не берёт. После того
как сервер принял пароль, `mail` хранит его в системной связке ключей. Если связка ключей не работает, `mail` хранит его в
закрытом файле и один раз сообщает об этом в stderr. `--credential-storage file` выбирает файл; мы этого не рекомендуем.
Если у `mail` нет пароля, он читает тот, что оставила Himalaya (`secret-tool`, служба `himalaya`, аккаунт — имя профиля).
Тогда существующей настройке Himalaya новый пароль не нужен.

`sync` читает INBOX и папку Sent; в Gmail он читает «Вся почта», потому что архивная почта уходит из INBOX. Другие папки
задают `--folder` или настройка `folders` профиля. Он читает сначала самую новую почту. `--limit` ограничивает число новых
писем за один запуск. `--rescan` заново перечисляет всё окно. Он сохраняет текст и заголовки, а также текст каждого
вложения, которое может прочитать, но не сами файлы. Правила аккаунта (`mail <profile> rules`, та же таблица, которую читает
memo) действуют и здесь: письмо, названное правилом пропуска, не читается, а правило конверта оставляет только отправителя,
дату и размер.

Большой ящик не помещается в один запуск. У `sync` есть бюджет запросов к серверу, рассчитанный на его срок: 15 минут в
терминале, 45 секунд через MCP. `--timeout` меняет срок. `--max-pages` уменьшает бюджет. Запуск сохраняет прочитанное, затем
отвечает `state: partial` и выдаёт ту же команду в `next`. Выполните её снова, чтобы продолжить. `mail <profile> status`
показывает, как далеко ушла синхронизация.

Чтобы профиль оставался актуальным, поставьте его `sync` на таймер (systemd, launchd или Планировщик заданий Windows):
`mail ya schedule command mail-ya --every 5m -- sync`. `mail ya schedule list` показывает каждое расписание и итог его
последнего запуска, а `doctor` сообщает, когда запуск раз за разом не удаётся.

Яндекс не выдаёт id сообщения. Для такого сервера `sync` перечисляет только номер, флаги, дату и размер каждого сообщения, а
каждое новое сообщение скачивает один раз. Сохранённую почту он пропускает по этому номеру, так что повторный запуск ничего не
читает дважды. Он не замечает почту, удалённую на сервере, и изменённые флаги у пропущенных сообщений. `--rescan` учитывает и
то и другое. Он также переносит ответ, сохранённый версией mail 0.1, в цепочку первого письма, на которое тот отвечает:
выполните один раз `mail <profile> sync --rescan --since-time <date>` с датой, такой же старой, как сохранённая почта, и
`rethreaded` покажет, сколько писем он перенёс.

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

## Поиск по почте

`mail` ищет и читает почту, которую синхронизировал его профиль, в локальном хранилище, и спрашивает почтовый сервер о
письмах, которых `sync` ещё не прочитал (`--backend archive` оставляет только хранилище):

```sh
mail ya search messages invoice                                  # best match first, any form of the word
mail ya search messages 'from:ann@example.com has:attachment date>30d'
mail ya search messages 'list:github.com is:unread' --newest     # a mailing list, newest first
mail ya messages show '<ref from a search>'                      # the whole email and its attachments' text
mail ya conversations list emails_count>1                        # threads, newest first
mail ya conversations show '<chat:email/… ref>'                  # one thread, oldest first
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
нашёл сервер, а `--server-time 20s` ждёт дольше обычных 5 секунд. Сервер читает слова, `from:`, `to:`, `cc:`,
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
mail ya messages export 'from:ann@example.com' --output ~/mail-backup     # one mbox file per folder
mail ya messages export --folder INBOX --format maildir --output ~/Maildir # Maildir++, for mu and notmuch
mail ya messages export 'date>30d' --limit 500 --output ~/mail-backup --resume
mail ya stats messages top --by list --limit 10                          # which lists send the most
```

- **Что записывается.** Каждое письмо так, как его хранит сервер, байт в байт, в каждой папке, где оно лежит (Gmail
  хранит письмо и в «Вся почта», и в INBOX: передайте `--folder`, чтобы выгрузить одну). Файлы mbox — mboxrd: строка тела,
  которая начинается со слова From, получает `>` перед собой. Имена файлов Maildir несут состояние «прочитано» (`S`) и
  «помечено» (`F`).
- **Никогда поверх существующего.** Папка, в которой что-то есть, отклоняется. `--resume` продолжает начатую там выгрузку
  (файл журнала `.mail-export.jsonl` перечисляет сделанное и длину каждого файла mbox после него); `--replace` пишет в любую
  папку поверх файлов с теми же именами и ничего не удаляет.
- **По частям.** Запуск останавливается на `--limit`, `--max-pages` или перед своим сроком и отвечает `state: "partial"`;
  запустите его снова с `--resume`. Письма, для которых в хранилище нет UID (сделайте sync снова) или которых на сервере уже
  нет, считаются, но не записываются.

## Порядок в ящике

Каждое изменение сначала идёт на сервер, затем в хранилище, поэтому `search messages` показывает его сразу. Письма
называют через `ref`, который выдаёт поиск, или выбирают через `--filter` тем же запросом:

```sh
mail ya messages mark-read '<ref>'                               # also mark-unread, star, unstar
mail ya messages update '<ref>' --flag answered --unflag '$Junk'  # flags and keywords; --replace sets the whole set
mail ya messages move '<ref>' --folder archive                   # a folder by path, name or role
mail ya messages copy --filter 'list:github.com' --folder Lists --yes
mail ya messages delete --filter 'from:shop@example.com date<2025-01-01'   # a preview: nothing moves
mail ya messages delete --filter 'from:shop@example.com date<2025-01-01' --yes
mail ya messages restore --run '<run id the change answered with>' --yes
mail ya folders create Receipts                                  # also folders rename, folders delete
```

- **Сначала предпросмотр.** Удаление, изменение, выбранное через `--filter`, и изменение более чем 20 писем отвечают тем,
  что изменится, и той же командой с `--yes` в `next`; до этого ничего не меняется. `--dry-run` всегда только показывает.
  Флаг или перемещение одного письма выполняются сразу.
- **Отмена.** Каждое изменение отвечает id запуска (`run`). Перед обращением к серверу запуск записывает место каждого
  письма, флаги и метки Gmail; `messages restore --run <id>` возвращает то, что всё ещё там, где его оставил запуск: корзину
  в папку, перемещение обратно, копию убирает, флаги как были. Запуски старого `mail delete` из memo восстанавливаются здесь
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
mail ya drafts create --to anna@example.com --subject 'Monday' 'Shall we meet at ten?'
mail ya drafts create --reply-to '<ref>' --reply-all 'Thanks, agreed.'   # in the thread, to everyone but you
mail ya drafts create --to anna@example.com --subject Notes - < notes.txt # - reads the text from stdin
mail ya drafts list                                                       # newest first, read from the server
mail ya drafts update '<id>' 'New text'                                   # only what you give changes
mail ya drafts delete '<id>' --yes                                        # gone for good; a preview without --yes
```

- **Id** — это Message-ID черновика, как его показывает `drafts list`, с `<>` или без. Он остаётся прежним при изменении
  черновика.
- **Ответ** читает письмо с сервера: он уходит на его Reply-To или отправителю (с `--reply-all` ещё и всем остальным, кому
  оно шло, но не вам), с `Re:`, `In-Reply-To` и `References`, которые оставляют его в цепочке.
- **Изменение** сначала сохраняет новую версию, затем переносит старую в корзину, поэтому сбой посередине оставляет два
  черновика, но не ноль, и старый текст можно найти. Текст, `--to`, `--cc`, `--bcc` и `--subject`, которые вы указали,
  заменяют прежние; остальное, цепочка и вложения остаются. Нужна папка корзины.
- **Удаление** необратимо: `drafts delete` и `drafts send` убирают черновик через UID EXPUNGE, для чего серверу нужен UIDPLUS.
- **Папка** — та, что сервер помечает `\Drafts`, иначе собственное название провайдера (Gmail «[Gmail]/Drafts», Яндекс
  «Черновики»).
- Черновик помечен `\Draft` и `\Seen`. `drafts.delete` спрашивает сначала; `drafts.create` и `drafts.update`
  выполняются сразу, а `MAIL_READ_ONLY=1` отклоняет все три.

## Ваши теги

Ваши теги ставятся на сохранённую почту и остаются на этом компьютере: сервер их не видит. Это те же теги, которые читает
memo, и поиск их находит.

```sh
mail ya tags add invoices --message '<ref>'     # one email; --chat '<conversation ref>' tags a whole conversation
mail ya search messages 'tag:invoices date>30d'
mail ya tags list tag:invoices                  # what is tagged; type:message or type:chat
mail ya tags remove invoices --message '<ref>'
```

Тег — это 1–32 символа: буквы a–z, цифры и дефисы; заглавные становятся строчными. Сервер хранит вместо них ключевые слова
(`messages update --flag '$Work'`) и, в Gmail, метки (`messages move|copy --folder Work`).

## Отправка, ответ и пересылка

`mail` отправляет через SMTP-сервер провайдера с паролем приложения профиля; сервер берётся из
[списка провайдеров](./providers.md) или из `smtp_host`, `smtp_port` и `smtp_security` в профиле.

```sh
mail ya messages send --to ann@example.com --subject Lunch "See you at noon."
echo "The report." | mail ya messages send --to ann@example.com --subject Report --file ./report.pdf
mail ya messages send --reply-to '<ref>' "Paid today."                # Re:, In-Reply-To, References, the quote
mail ya messages send --reply-to '<ref>' --reply-all "Thanks, all."   # also to the original's To and Cc, not you
mail ya messages forward '<ref>' --to bob@example.com "FYI"           # the original attached whole
mail ya messages send --to ann@example.com --subject Hi "Hello" --dry-run   # build it, send nothing
mail ya drafts send '<draft id>'                                     # send a saved draft, then remove it
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
- **Вложения.** `attachments list '<ref>'` нумерует файлы одного письма; `attachments download '<ref>'
  --output-dir ./folder` сохраняет их, доступными только вам, под их обычными именами; `attachments download '<ref>' 2
  --output-dir ./folder` сохраняет только второй. Байты берутся с сервера и никогда не попадают в хранилище.
  Существующий файл остаётся, если нет `--replace`.
