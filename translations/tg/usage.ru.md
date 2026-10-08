---
title: "Использование tg"
---

От первого входа до отправки сообщений — в порядке освоения. Все команды и параметры: [Справочник команд](./commands.md). Здесь объясняется, как они связаны.

Каждая команда выполняет одно действие, выводит результат и выходит. Только `tg watch`, `tg serve` и `tg mcp` продолжают работать и сообщают об этом.

```sh
tg [profile] [options] <resource> <action> [arguments]
```

## Начало работы

```sh
npm install -g @leemour/tg-cli
tg setup                  # guided app registration, login and agent skill
tg chats list --limit 5   # your newest chats
tg messages list me       # Saved Messages, the latest 20
```

На настройку отведите около пяти минут. История загружается отдельно: выберите чат и объём перед `tg store fetch <chat> --last 100`. Агент может прочитать `tg skill show` без входа; `tg setup --agent codex` явно выбирает его skill. Параметры объяснены в `tg setup --help`. Для чтения больше ничего не нужно.

Чтобы узнать параметры для задачи, выполните `tg commands messages search --json` для одной
команды или `tg commands messages --json` для группы. Оба ответа содержат глобальные параметры
и коды завершения. Каждый путь команды проверяйте отдельным вызовом;
`tg commands --json` возвращает всё дерево.

## Вход

`tg setup` — команда первого запуска. По умолчанию она автоматически регистрирует приложение и предлагает вход по QR; `--app browser` и `--method phone` выбирают альтернативы. Для входа без остальных шагов либо для завершения прерванного или истёкшего входа используйте:

```sh
tg session start                        # QR code: Settings → Devices → Link Desktop Device
tg session start phone                  # phone number, the code Telegram sends, your 2FA password
tg session start phone --sms            # the same, asking for the code by SMS instead of in the app
tg session start --qr-file login.png    # the QR code as a picture, for an agent to show you
```

При первом входе нужны данные вашего приложения с my.telegram.org; `--app auto` заполняет сайт за вас. Оба шага и хранение данных: [Вход и сессии](./sessions.md).

**Секреты не передаются аргументами.** Хеш приложения и пароль 2FA вводятся скрыто, код и телефон — по запросу или через stdin. Аргументы видны процессам в `ps` и остаются в истории оболочки.

В CI переменные `TG_API_ID` и `TG_API_HASH` передают данные приложения вместо хранилища ключей и имеют приоритет над ним.

```sh
tg account show                # who this profile is logged in as; the phone as its last four digits
tg account show --show-phone   # the whole phone number
tg account list                # every profile on this computer and the account each is logged in as
tg account sessions list       # every device and app logged in to the account; ends nothing
tg session end                 # log out on Telegram's side, and delete the session here
```

`session end` завершает сессию и в Telegram: устройство исчезает из списка. Для завершения с другого устройства используйте Настройки → Устройства.

## Профили: первое слово

Можно использовать несколько аккаунтов. Профиль задаётся первым словом, а не параметром:

```sh
tg chats list             # profile "default"
tg work chats list        # profile "work"
export TG_PROFILE=work    # or for a whole shell session
```

**Первое слово считается профилем, если это не команда.** Имя `chats` запрещено с пояснением причины. Допустимы буквы, цифры, точки, дефисы и подчёркивания.

Каждый профиль имеет свои сессию, приложение, настройки и получателей. `TG_PROFILE_LOCK` фиксирует процесс на профиле, чтобы агент не выбрал менее ограниченный ([Вход и сессии](./sessions.md#profiles)).

## Как указать чат

Везде, где команда принимает `<chat>`, доступны:

- название или часть: `"Book club"`, `book`
- идентификатор: `-1001234567890`
- имя пользователя: `@example_channel`
- `me` для «Избранного»

Если название подходит нескольким чатам, ошибка перечисляет их с идентификаторами. `tg` не угадывает: отправку в неверный чат нельзя отменить. Повторите с идентификатором. Он не меняется, поэтому используйте его дальше.

`messages show` и `messages context` также принимают указатель `msg:` вместо чата и идентификатора сообщения. Его возвращает `messages search --json` для каждого результата.

Для человека (`<person>` в `contacts show`) можно указать идентификатор, `@username` или часть имени.

## Чтение

**Чтение не отмечает сообщения прочитанными.** Команды ниже не показывают собеседнику ваш просмотр. Это делают только `tg chats mark-read` и `tg messages list --mark-read` ([ниже](#marking-a-chat-read)).

### Чаты

```sh
tg chats list                              # newest first, archived chats included
tg chats list --unread --kind group        # only groups with unread messages
tg chats list --search book                # titles containing "book"; at least 3 characters
tg chats show "Book club"                  # kind, unread count, last message, who is in it
```

`--kind` принимает `dialog` (личный чат), `group`, `channel`, `saved`. Фильтры проверяют все полученные чаты. Для групп и каналов есть [отдельный раздел](#groups-and-channels).

### Ссылки на сообщения

`tg messages link <chat> <message>` или `tg messages link <msg:locator>` возвращает
`{ locator, url, access, reason }`. Постоянные ссылки каналов и супергрупп бывают общедоступными
или ограниченными; ссылка не добавляет пользователя в чат. Для личных переписок, обычных групп
и Избранного возвращается локатор. Без соединения команда проверяет сохранённое сообщение и
не возвращает постоянную ссылку. Локатор другого аккаунта отклоняется. Эта команда отличается
от `messages links`, которая объясняет связи переписок.

### Сообщения

```sh
tg messages list "Book club"                    # the latest 20, oldest first
tg messages list "Book club" --limit 50
tg messages list "Hiking" --topic 12            # one forum topic; topics list shows the ids
tg messages show "Book club" 4242               # one message
tg messages context "Book club" 4242            # it, and 5 messages either side
tg messages context "Book club" 4242 --before-n 2 --after-n 10
```

В `context` выбранное сообщение отмечается `◀` в терминале и `"anchor": true` в JSON.

`--topic` читает сообщения темы от самого нового назад или от `--before-id`. Общая тема (`1`) не принимается: Telegram не присваивает её сообщениям ID темы, поэтому читайте весь чат. С `--offline` параметр `--topic` оставляет только сохранённые сообщения этой темы.

### Что требует ответа

```sh
tg inbox                     # other people's unread messages, in every chat
tg inbox --since-time 2h     # everything that came in during the last two hours
tg inbox --new               # what arrived since the last --new — for scheduled runs
tg inbox --new --jsonl       # the same for a script: one message per line
```

`inbox` показывает только чужие сообщения с указанием чата. Чаты без уведомлений и архив пропускаются, кроме упоминаний и ответов вам; `--all` включает их. Число пропущенных выводится в stderr.

**`inbox --new` сдвигает сохранённую позицию.** Следующий `--new` продолжает с неё, показывая сообщения один раз. Первый `--new` охватывает 24 часа. `inbox` без `--new` и `inbox --since-time` позицию не меняют. Обычный `inbox` повторяет результат, пока сообщения не прочитаны в приложении: сам он не отмечает прочитанным.

За запуск читаются максимум 20 чатов. Остальные перечислены в stderr и `skipped` с командой чтения. Если ожидающих сообщений больше `--limit`, показываются самые новые, а stderr объясняет, как прочитать остальные.

### Обязательства и ожидания: `review`

```sh
tg review                                  # the last 3 days
tg review --since-time 2026-09-23T09:00    # from where the last review ended
tg review --chat "Book club" --json
```

Все сообщения — ваши и чужие — в чатах с активностью после `--since-time`. Они помогают понять обещания, ожидания и неясности; классификацию выполняете вы или агент. Отметки прочитанного нет.

В конце stderr показывает прочитанный период. **Следующую проверку начинайте с этого `--since-time`**, чтобы не было пропусков. При неполном результате — слишком много чатов или ограничение последними 300 сообщениями — команда предупреждает; границу лучше не сдвигать. Максимум 20 чатов за запуск.

#### Вопросы без ответа

```sh
tg review --unanswered                     # questions nobody answered in 24 hours
tg review --chat "Neighbours" --unanswered 4h
```

`--unanswered [hours]` оставляет вопросы, ожидающие вас или администраторов группы. Вопрос — сообщение с `?` (знак `?` в ссылках не учитывается) или ответ вам/администратору. Он закрыт, если вы или администратор ответили либо написали следом за автором. Вопросы моложе указанного срока (по умолчанию 24 часа) исключаются. Если администраторы неизвестны, учитываются только ваши ответы и выводится предупреждение.

В отборе участвуют и сохранённые расшифровки голосовых сообщений. Добавьте `--transcribe`,
чтобы до отбора вопросов без ответа распознать голосовые сообщения без сохранённого текста.
Нераспознанные сообщения оставляют проверку неполной: пустой результат не доказывает отсутствие
вопросов без ответа. Сохраняйте прежнюю границу, пока `complete` не станет true.

### Голосовые сообщения

```sh
tg messages transcribe "Book club" 4242          # by Telegram where it can, else a model here
tg messages transcribe "Book club" 4242 --local  # only the model on this machine
tg messages list "Book club" --transcribe        # every voice message shown that has no text yet
tg inbox --transcribe
tg review --transcribe
tg messages list "Book club" --transcribe --model gigaam-v3
```

Telegram распознаёт речь для Premium и несколько сообщений в неделю по пробной квоте. Иначе работает локальная модель без передачи записи с компьютера. Модель скачивается один раз и только по запросу:

```sh
tg models audio list                   # the models, which is downloaded, which is the default
tg models audio download parakeet-v3   # once, checked against the sha256 this version expects
```

| Модель | Языки | Размер |
|---|---|---|
| `parakeet-v3` — по умолчанию | 25: болгарский, чешский, датский, немецкий, греческий, английский, испанский, эстонский, финский, французский, хорватский, венгерский, итальянский, литовский, латышский, мальтийский, нидерландский, польский, португальский, румынский, русский, словацкий, словенский, шведский, украинский | 670 МБ |
| `gigaam-v3` | русский — лучшая из трёх моделей для русского | 232 МБ |
| `gigaam-v3-ctc` | русский — немного быстрее, хуже с заглавными буквами | 225 МБ |

`--model` выбирает другую модель для одного вызова вместе с `--transcribe` или в `messages transcribe`;
настройки `transcribeWith` и `speechModel` задают значения по умолчанию
([Настройки](./configuration.md)). Расшифровка сохраняется локально и повторно используется
в списках сообщений, входящих и проверках. Повторный вызов `messages transcribe` может запросить
новую расшифровку или заново запустить распознавание. `--transcribe` может занять несколько минут.

### Файлы

```sh
tg messages download "Book club" 4242 --output-dir ~/Downloads   # one message's files
tg messages download "Book club" --all --output-dir ~/tg-files   # every file of the chat, newest first
```

Сохраняются фотографии, файлы, видео и голосовые. Недостающий каталог создаётся. Имя файла сохраняется; безымянный получает идентификатор сообщения. **Файлы не перезаписываются.** С `--all` к занятому имени добавляется идентификатор сообщения. `--all` сохраняет позицию в небольшом файле рядом и продолжает с неё. Файлы доступны только вам.

### Люди

```sh
tg contacts list                       # people you have a one-to-one chat with, newest first
tg contacts list --order name --search ann
tg contacts show @example_user         # their bio and the chats you share
tg contacts lookup                     # who has a phone number — asks for it, or reads it from stdin
tg contacts sync                       # your whole Telegram contact list into the local store
tg contacts profile @example_user      # flags, last seen, registered, messages per shared chat
tg contacts context @example_user --chat "Book club"   # their latest messages there
tg contacts check @example_user        # does the account look like a bot or a spammer
```

Подробнее о человеке и о том, куда `contacts check` отправляет данные: [people.md](./people.md).

`contacts list` показывает людей с личными чатами. `contacts sync` также загружает остальных из адресной книги Telegram. `contacts lookup` не принимает телефон аргументом: передайте stdin или введите по запросу.

Изменение контактов и собственного профиля:

```sh
tg contacts add @example_user          # under the name they show
tg contacts rename @example_user Ann "from work"   # a name only you see
tg contacts remove @example_user       # the chat stays
tg contacts block @example_user        # they need not be a contact
tg contacts unblock @example_user
tg contacts import people.txt          # one "number, name" per line; never numbers as arguments
tg account update --first-name Ann --description "about me" --photo me.jpg
tg account sessions end --others       # logs out every other device, your phone too; asks first
```

`contacts import` возвращает количество и найденных Telegram людей, без телефонов. `account sessions
end` спрашивает подтверждение; `--yes` подтверждает в скрипте.

### Страницы

Списки показывают `limit` строк (по умолчанию 20). `chats list`, `contacts list`, `chats members list` и `topics` принимают `--page` и `--all`:

```sh
tg contacts list --limit 5             # five a page
tg contacts list --limit 5 --page 2    # the sixth to the tenth
tg contacts list --all                 # every row, no paging
```

⚠ **Нумерация страниц живого списка может повторить или пропустить строку.** Новое сообщение между запросами сдвигает чаты через границу страниц.

**У сообщений чата нет страниц: используйте `--before-id`, `--after-id`, `--after-time`** для точного продолжения:

```sh
tg messages list "Book club" --before-id 4242   # older than message 4242
tg messages list "Book club" --after-id 4242    # newer than 4242, oldest first
tg messages list "Book club" --after-time 2h    # what came in during the last two hours
tg messages list "Book club" --after-time 2026-09-20T09:00
tg messages list "Book club" --before-time 1d   # what came before this time yesterday
```

Подсказка следующей страницы идёт в stderr. `--before-id` и `--after-id` принимают идентификатор сообщения. `--after-time` — ISO 8601 или период назад: `30m`, `2h`, `1d`. В `messages context` параметры `--before-n`, `--after-n` задают число сообщений вокруг выбранного.

### Найти чат и написать в него

```sh
tg chats list --search book --kind group     # groups with "book" in the title
tg contacts list --search ann                # people by name or @username
tg messages search "contract"                # the text of every message this machine has kept
tg messages search "contract" --chat "Book club"
tg messages search "invoice.*(march|april)" --regex
```

Для поиска чатов и контактов нужно **не менее трёх символов**. `messages search` использует [строгий профиль Lucene](./search.md): `invoice` находит и другие формы слова, `invoic*` — совпадения по началу, а `exact:invoice` — только эту форму. Поиск читает сообщения, загруженные или сохранённые `serve`, и также обращается к поиску Telegram (`--backend archive` — только архив). Для прежнего поведения поиска используйте `--language legacy`. Найдя чат, используйте его ID.

## Отправка

**Отправка происходит только по команде отправки.** По умолчанию подтверждения нет: вы уже указали чат и текст. Каждая попытка проходит защиту: профиль только для чтения, список `allow`, разрешённые получатели и часовой лимит ([Безопасность](./security.md#the-send-guard)). Попытки записываются без текста: `tg sends list`.

```sh
tg messages send me "a note to myself"
tg messages send "Book club" "See you at 7" --silent       # no notification
tg messages send "Book club" "a link, no card" --no-preview
tg messages send "Book club" "**Bold** and _italic_" --md  # Telegram Markdown
tg messages send "Book club" "<b>Bold</b> and <i>italic</i>" --html
```

`--md` использует форматтер Telegram: `**bold**` или `*bold*`, `_italic_`, `__underline__`, `~~struck~~` или `~struck~`, `||spoiler||`, встроенный код, блоки кода с языком, `[label](https://example.com)` и строки цитат, начинающиеся с `> `. Стили могут быть вложенными; код и блоки кода нельзя совмещать с другими сущностями, ссылки и цитаты нельзя вкладывать друг в друга. Без флага текст отправляется как есть. Обратная косая черта экранирует знак; `_` и `*` внутри слова остаются буквальными. Незакрытые встроенные знаки остаются в тексте; незакрытый блок кода вызывает ошибку. Ссылки поддерживают абсолютные URL http, https и mailto. `messages edit` и подписи медиа используют тот же форматтер. В Telegram `__text__` — подчёркивание; в MAX `__text__` — жирный текст. Одиночный `*text*` в Telegram теперь тоже означает жирный текст.

`--html` обрабатывает текст как HTML Telegram, такой же, как в Bot API: `<b>`, `<i>`, `<u>`, `<s>`, `<a href>`, `<code>`, `<pre language="…">`, `<blockquote>` и `<tg-spoiler>`. Переносы строк и пробелы сохраняются как введены. Ссылка-упоминание (`tg://user?id=`) или пользовательский эмодзи отклоняются. `--md` и `--html` нельзя использовать вместе. `messages edit` тоже принимает `--html`.

### Текст через stdin

Если аргумент текста отсутствует, он читается из stdin. Так можно отправить несколько строк и не оставлять текст в `ps` и истории оболочки:

```sh
printf 'first line\n\nthird line' | tg messages send me
tg messages send "Book club" < note.txt
```

### Отложенная отправка

```sh
tg messages send "Book club" "Tomorrow" --at-time 2026-10-01T09:00   # local time
tg messages send "Book club" "In two hours" --at-time 2h        # or 30m, 1d from now
tg messages scheduled "Book club"                               # what waits to be sent there
```

`--at-time` передаёт сообщение Telegram, который отправит его даже при выключенном компьютере. Время округляется вниз до минуты. Менее минуты или более года вперёд запрещено. Сообщение учитывается в лимите в час отправки. **Отмена и изменение доступны в приложении Telegram**; `tg` этого не делает.

### Файлы, фото и голосовые

Форматы, отправка, скачивание, OCR агента и поиск текста описаны в [Файловых вложениях](./attachments.md).

```sh
tg messages send "Book club" "The agenda" --file agenda.pdf   # byte for byte; the text is the caption
tg messages send "Book club" --photo picture.jpg              # recompressed by Telegram
tg messages send "Book club" --file trip.mp4                  # a video plays in the chat
tg messages send "Book club" --file trip.mp4 --as-file        # the same video as a file to download
tg messages send "Book club" --voice note.ogg                 # a voice message, alone, with no text
tg messages send "Book club" --file 3f9a.pdf --filename "Report Q3.pdf"   # the name others see
```

`--photo` принимает `.jpg`, `.png`, `.webp`. `.mp4` и `.mov` с `--file` отправляются как видео, если нет `--as-file`. `--voice` принимает Ogg Opus (`.ogg`, `.oga`, `.opus`) без текста и других файлов. Скрытые файлы, `~/.ssh`, каталоги `tg` и база запрещены без `--allow-any-file`: там могут быть ключи и токены.

`--spoiler` размывает фото или видео, пока на него не нажмут; для документа или голосового сообщения этот параметр недоступен. `--caption-above` показывает текст над фото или файлом. Telegram разрешает запрещать пересылку отдельного сообщения только ботам; для защиты содержимого включите соответствующую настройку чата в Telegram.

### Ответ на сообщение

```sh
tg messages send "Book club" "Agreed" --reply-to 4242
```

Ответ — разновидность отправки; доступны все её параметры.

### Комментарии к постам канала

```sh
tg messages comments "Rozetked" 27644              # the comments under post 27644, oldest first
tg messages comments "Rozetked" 27644 --before-id 3732413
tg messages send "My channel" "Thanks!" --comment-to 120
```

Комментарии находятся в группе обсуждения канала: ответ указывает её в `discussion`, а комментарий отправляется как ответ в этой группе, поэтому список получателей и почасовой лимит учитывают его для неё. Пост канала без группы обсуждения или с закрытыми комментариями приводит к завершению с кодом `6`.

### Отправка от имени канала

В группе, где вы можете писать от имени одного из своих каналов, сначала получите список доступных отправителей, затем выберите одного:

```sh
tg chats send-as "Book club"
tg messages send "Book club" "Meeting moved to 8" --send-as <id from the list>
```

В списке всегда есть вы, а `default` отмечает сохранённый выбор группы; чтение ничего не меняет. ID, которого нет в списке, отклоняется. `--send-as` работает и с файлами, `tg messages forward` и `tg polls create` — для пересылки нужен список чата из `--to`. При повторении операции с неизвестным результатом передайте тот же `--send-as` вместе с `--send-id`.

В группе канал может быть сохранён как отправитель по умолчанию — Telegram делает это для группы обсуждения вашего канала. В такой группе отправка, пересылка или опрос **без** `--send-as` отклоняются (код `2`), чтобы не уйти от имени канала: ошибка предлагает `--send-as <your id>` для отправки от вашего имени и `--send-as <channel id>` — от имени канала.

### Неизвестный результат отправки

Код `14` означает обрыв после отправки: **сообщение могло уйти**. Ошибка содержит `--send-id`. Повторите с ним: Telegram исключит дубликат.

```sh
tg messages send "Book club" "See you at 7" --send-id <id from the error>
tg messages forward "Book club" 4242 --to me --send-id <id from the error>
```

Пересылка и опрос тоже получают идентификатор. Повтор без него создаст второе сообщение. Файл загружается до отправки сообщения: оборванную загрузку tg повторяет три раза, и если она так и не удалась, в ошибке сказано, что ничего не отправлено, — такую команду можно просто запустить снова. Другие записи — закрепление, реакция, отметка о прочтении, удаление, голос, папки, контакты — так же завершаются кодом `14`, когда Telegram не отвечает; сообщение говорит, безопасно ли повторять. Создание папки повторять небезопасно: сначала посмотрите `tg chats folders list`, иначе папок может стать две. Отправка с `--at-time` не повторяется: проверьте `tg messages scheduled <chat>`.

### Правка, пересылка, закрепление, удаление

```sh
tg messages edit "Book club" 4242 "the corrected text"      # your own message; --md or --html as in a send
tg messages forward "Book club" 4242 --to me                # checked against the chat it goes to
tg messages pin "Book club" 4242                            # quiet unless --notify
tg messages unpin "Book club" 4242
tg messages delete me 4242 4243 --allow-dangerous           # at most 10, for you only
tg messages delete me 4242 --allow-dangerous --for-everyone
```

Редактирование меняет текст, который могли уже прочитать. Пересылка создаёт новое сообщение и проверяется по чату назначения как отправка. Удаление необратимо и требует ответа `y` или `--allow-dangerous`. В супергруппах и каналах Telegram удаляет только у всех, поэтому нужен `--for-everyone`.

**Что учитывается в почасовом лимите:** сообщение, пересылка, редактирование, закрепление с уведомлением, новый опрос, закрытие опроса и каждое удалённое сообщение. Реакция, голос и тихое закрепление не учитываются.

### Реакции и опросы

```sh
tg reactions add "Book club" 4242 👍       # replaces the reaction you had
tg reactions remove "Book club" 4242
tg polls show "Book club" 4250             # the poll and its answer ids
tg polls vote "Book club" 4250 <answer id>
tg polls vote "Book club" 4250 --retract
tg polls create "Book club" "Which day?" Monday Tuesday --anonymous
tg polls close "Book club" 4250            # your own poll; it cannot be reopened
tg polls create "Book club" "2+2?" 3 4 5 --quiz --correct 2 --solution "Four."   # a quiz; a vote is final
```

При чтении чата реакции отображаются под сообщением — `👍 3  🔥 1  (you: 🔥)`. Голос в публичном опросе показывает ваше имя всем участникам чата. Голосуйте по ID из `polls show`, а не по порядковому номеру ответа. `--multiple` позволяет выбирать несколько ответов. Изменить голос можно только в опросе, созданном с `--revote`. Голосование в закрытом опросе, два ответа в опросе с одним вариантом, изменение или отзыв окончательного голоса и `--retract` без голоса отклоняются до отправки; закрытие чужого опроса тоже отклоняется.

### Отметка прочитанным

```sh
tg chats mark-read "Book club"               # up to the newest message
tg chats mark-read "Book club" --until 4242  # only up to this one
tg chats mark-read "Hiking" --topic 12       # only this forum topic
tg messages list "Book club" --mark-read     # read it, and mark it read up to the newest shown
```

Собеседник видит прочтение. Действие `read` проходит защиту, но не входит в часовой лимит.

### Папки

```sh
tg chats folders list                              # your folders, in the order the app shows them
tg chats folders show "Trips"                      # one folder, with the names of its chats
tg chats folders create "Trips" --chat "Hiking" --chat @kate
tg chats folders update "Trips" --title "Travel" --add "Climbing" --remove @kate
tg chats folders delete "Travel"                   # the chats stay
tg chats folders order "Travel" "Work"             # these first; the rest keep their order after them
tg chats folders join https://t.me/addlist/AbCdEf  # a folder someone shared: joins every chat in it
tg chats folders create "Inbox" --include contacts,groups --skip muted,archived --emoji 📥
tg chats folders update "Inbox" --exclude-chat "Noisy group" --pin @kate
tg chats folders update "Inbox" --include none     # no kinds any more; only the chats named in it
```

Папка указывается по ID или точному названию. Папки видите только вы; каждое изменение всё равно проходит проверки как изменение `account`. `join` отличается: участники этих чатов видят, что вы вступили, как при `tg chats join`. Папка «Все чаты» сохраняет своё место при `order`.

Папка может автоматически включать типы contacts, `non-contacts`, `groups`, `channels`, `bots` через `--include`; `--skip` исключает `muted`, read, `archived`. `--exclude-chat` исключает конкретный чат, `--pin` закрепляет его сверху. При `update` include/skip заменяют прежние правила; `--remove` удаляет чат из всех списков. Общая папка по ссылке не принимает правила. `--emoji` должен быть значком папки Telegram: другой Telegram молча отбросит, и ответ покажет реально сохранённое значение.

### Чего пока нет в tg

Несколько фотографий в одном сообщении остаются в [планах](./roadmap.md).

## Группы и каналы

```sh
tg chats inspect https://t.me/+AbCdEf              # where an invite or public link leads; does not join
tg chats members list "Hiking" --all               # everyone, with their role and when last seen
tg chats events "Hiking"                           # who joined, left, was added or removed — 7 days
tg chats events "Hiking" --type join,leave --since-time 2026-09-01T00:00
tg topics list "Hiking"                            # a forum group's topics, newest activity first
tg topics search "Hiking" "gear"
tg review --chat "Hiking" --unanswered             # questions nobody answered
```

Эти команды только читают. `events` получает служебные сообщения: кто, что и с кем сделал. Типы: `join`, `leave`, `add`, `remove`, `create`, `title`, `pin`.

Эти команды меняют данные, и участники видят изменения:

Для форума используйте `tg topics enable <chat>` и `tg topics create <chat> <title>`. Для обычной группы нужны `--upgrade --yes`; сохраните новый ID чата, возвращённый при преобразовании. Если результат создания неизвестен, прочитайте `topics list`, а не создавайте тему повторно. Отправляйте в тему по её ID с помощью `tg messages send <chat> <text> --topic <id>` или `tg polls create <chat> <question> <answers> --topic <id>`. `tg topics edit <chat> <id> --title <new>` переименовывает тему, `--closed on` / `--closed off` закрывает её для новых сообщений или открывает снова, `--pinned on` / `--pinned off` закрепляет наверху или открепляет, а для общей темы (ID 1) `--hidden on` / `--hidden off` скрывает её из списка тем или показывает снова. `tg topics order <chat> <id...>` располагает закреплённые темы в указанном порядке; ничего не закрепляет и не открепляет. Любое из этих действий можно безопасно повторять.

```sh
tg chats create "Hiking 2027" @olga 12345          # a supergroup; the people added are told
tg chats create "Trail news" --channel             # a channel; people join it by its link
tg chats join https://t.me/+AbCdEf                 # by an invite link, or a public one
tg chats leave "Hiking 2027"
tg chats update "Hiking 2027" --title "Hiking 2028" --description "routes and dates"
tg chats update "Hiking 2027" --all-can-pin off --only-admins-add on
tg chats link show "Hiking 2027"                   # the invite link, if you may see it
tg chats link reset "Hiking 2027"                  # a new one; the old one stops working
tg chats link create "Hiking 2027" --approval --expire-time 7d --max-uses 20   # another link; who joins asks first
tg chats update "Hiking 2027" --join-approval on   # everyone asks first, by any link
tg chats requests list "Hiking 2027"               # who asked to join, newest first
tg chats requests list "Hiking 2027" --search Ana  # by name; or --link <link>, never both
tg chats requests accept "Hiking 2027" 67890       # let them in; decline turns them away
tg chats requests decline "Hiking 2027" --all      # every pending request at once; --link narrows it
tg chats link list "Hiking 2027"                   # your links, with how many joined and how many wait
tg chats link revoke "Hiking 2027" https://t.me/+AbCd   # stop one link
tg chats link update "Hiking 2027" https://t.me/+AbCd --no-approval --max-uses 50   # change only these
tg chats members add "Hiking 2027" @kate 67890     # they are told
tg chats members remove "Hiking 2027" @kate        # their messages stay
tg chats admins add "Hiking 2027" @kate --can pin,delete
tg chats admins remove "Hiking 2027" @kate
```

Новая группа всегда создаётся как супергруппа. Если настройки приватности человека не позволяют добавить его, ответ указывает его в `providerMetadata.notAdded`; сама группа всё равно создаётся. `chats join` для группы с одобрением вступления администраторами возвращает `requested: true` и код `0`: заявка отправлена, и вы вступите после одобрения. Каждое действие проходит проверки как изменение `chat`, а каждый добавленный человек учитывается в почасовом лимите.

`chats link create` создаёт дополнительную пригласительную ссылку, никого не уведомляя: `--approval` требует одобрения для вступления по ней, `--expire-time` задаёт срок действия (`2026-12-01T09:00` или через `30m`, `2h`, `7d`), а `--max-uses` допускает не более указанного числа людей. `chats link update` меняет те же три параметра одной своей дополнительной ссылки (`--no-approval` выключает одобрение); пропущенные параметры сохраняются, а основную ссылку группы менять нельзя. `chats update --join-approval on` требует одобрения для всех, независимо от использованной ссылки.

В группе с одобрением вступления `chats requests list` показывает ожидающие заявки вместе с заметкой человека; их видят только администраторы, и чтение никого не уведомляет. `accept` и `decline` обрабатывают одну заявку по ID из списка. Одобренная заявка учитывается в почасовом лимите, отклонённая — нет; список получателей проверяет только группу. Для уже вступившего человека возвращается `already: true`, а исчезнувшая заявка приводит к коду `6`. `--all` обрабатывает все ожидающие заявки, а с `--link` — только пришедшие по одной ссылке; сначала подсчитывается их число, и одобрение сверх почасового лимита отклоняется до вступления кого-либо. `chats link list` показывает только ваши ссылки; отзыв основной ссылки группы заставляет Telegram создать новую, которую показывает ответ.

`chats update` одновременно меняет название, описание и две настройки Telegram; ответ показывает текущее состояние. `chats show` выводит те же настройки. Правила `chats rules` и модерация `chats moderate` описаны в [Управлении группами](./groups.md#rules).

`tg topics delete <chat> <id>` необратимо удаляет тему и все сообщения у всех. По умолчанию спрашивает; явное `topics.delete: allow` или `--allow-dangerous` пропускает вопрос. Общую тему удалить нельзя.

У запросов на вступление `--search` ищет по имени или @username, а `--link` оставляет запросы по одной ссылке приглашения; одновременно Telegram их не принимает.

## Для скриптов и агентов

**В терминале `tg` выводит таблицу; в канал или с `--json` — единственное JSON-значение в stdout** без индикаторов, галочек и предупреждений. Примечания, предупреждения и ошибки всегда идут в stderr.

```sh
tg chats list --json | jq -r '.items[].id'
tg messages list me --jsonl | jq -r .text     # one message per line
```

- `--json`: одно значение JSON. **Любой список — объект** одинаковой формы: `{ "items": [...], "page": 1, "limit": 20, "hasMore": true }`. `--all` и `--offline` возвращают тот же объект.
- Сообщения чата без номера страницы: `{ "items": [...], "limit": 20, "hasMore": true }`.
- `--jsonl`: объект на строку без оболочки; наличие продолжения только в stderr.
- Ошибка: `{ "error": { "code": "...", "message": "..." } }` в stderr, stdout пуст. Отказ не спутать с пустым результатом.
- **Проверяйте код завершения, не текст.** Текст меняется, код стабилен: `0` успех, `2` неверные данные, `4` нет входа, `5` запрет профиля, `6` не найдено, `7` запрет получателя, `8` лимит профиля или Telegram, `9` таймаут, `14` неизвестный результат отправки. Полная таблица: [Справочник команд](./commands.md#exit-codes).
- **Идентификаторы — строки.** Не преобразуйте в числа.
- `--quiet` отключает примечания, но не ошибки. `-v`, `-vv` добавляют подробности в таблицы.
- `--timeout 30s` ограничивает всю команду (`500ms`, `30s`, `2m`).
- `tg commands --json` возвращает дерево команд с `mutates: true` у изменений Telegram.

```sh
if ! tg messages send "Book club" "See you at 7" --json > /dev/null; then
  case $? in
    14) echo "it may have gone — repeat only with the same --send-id" ;;
    4)  echo "run tg session start" ;;
  esac
fi
```

Агент с терминалом читает skill, объясняющий нюансы вне справки:

```sh
mkdir -p ~/.claude/skills/tg-cli && tg skill show > ~/.claude/skills/tg-cli/SKILL.md   # Claude Code
mkdir -p ~/.agents/skills/tg-cli && tg skill show > ~/.agents/skills/tg-cli/SKILL.md   # Codex, Gemini CLI
```

Агент без терминала (Claude Desktop; в Cursor тоже доступен этот вариант) подключается через [MCP](./mcp.md).

## Отображение переписки

`tg messages list` и `tg messages search` в терминале выводят переписку, а не таблицу:

```text
10:05:12  Anna
          Shall we call on Thursday?

10:09:03  Boris
          ↳ Anna: Shall we call on Thursday?
          Thursday works.
          📎 photo
          edited 10:09:30
```

Время локальное, новый день отмечен строкой. `↳` — исходное сообщение ответа, `↪` — автор пересланного, `📎` — вложение. Управляющие символы показываются текстом и не исполняются. `-v` добавляет идентификаторы сообщения, автора и чата; `-vv` — все известные данные.

## Новые сообщения в реальном времени

```sh
tg watch                           # new messages, until Ctrl-C or --timeout
tg watch --jsonl                   # one message per line, as messages list --jsonl
tg watch --jsonl | ./on-message.sh
tg watch --events --jsonl          # edits, deletions and reactions too
tg watch --jsonl --timeout 2m      # a timeout ends it normally, with exit code 0
```

С `--events` строки содержат тип: `message`, `edit`, `delete`, `reaction`. Без параметра — только сообщения. При удалении в личном чате или небольшой группе Telegram не сообщает чат, поэтому он отсутствует.

**`watch` начинает с текущего момента.** Пропущенные события не появляются. Для актуальной базы с догрузкой после отключения используйте `serve` в фоне или как службу ([Локальная база](./archive.md#keeping-it-current-serve)):

```sh
tg server start           # serve in the background; answers once it is connected
tg server status
tg server install         # a systemd user unit or a launchd agent; starts nothing
```

## Что сделала команда

```sh
tg --trace chats list          # show each request on stderr, keep nothing
tg --record chats list         # keep it, show nothing
tg runs list                   # what was kept, newest first
```

Неудачные запуски сохраняются автоматически. Запись содержит операции, идентификаторы, количества и длительности, но не сообщения, имена, названия, телефоны или ключи. Подробнее: [Диагностика](./diagnostics.md).

## Локальная база

Все прочитанные `tg` данные сохраняются на компьютере для работы без сети:

```sh
tg chats list --offline                           # only from the store, never connect
tg store fetch "Project Alpha" --estimate      # how much a fetch would take
tg store fetch "Project Alpha" --background       # a chat's history, as a job
tg store export "Project Alpha" --format markdown --output alpha.md
tg store backup ~/tg-store.db                     # a copy of the store, while it is in use
```

Обычная команда всё ещё обращается к Telegram. `--offline` нужен, когда нет сети или подключение нежелательно; отправка с `--offline` отклоняется. Загрузка, экспорт, поиск, резервное копирование и служба: [archive.md](./archive.md).

## Настройки и разрешения профиля

Настройки хранятся в необязательном `config.json`. Приоритет: **параметр → переменная окружения → профиль в файле → общие значения файла → встроенное значение**.

```sh
tg config show                                 # every setting, and where it came from
tg config set limit 50
tg work config set permissions.messages readonly   # profile "work" changes no messages
tg config set permissions.messages.send ask        # a yes or no before each send
tg config set sendsPerHour 10
```

`permissions` задаёт уровень каждой команды: `deny`, `readonly`, `ask`, `allow`. По умолчанию разрешено всё, кроме удаления сообщений и завершения сессий с подтверждением. Отказ даёт код `5` и указывает разрешающую команду. **Поля для секретов в файле нет.** Все настройки: [Настройки](./configuration.md).

## Дальше

- [Локальная база](./archive.md) — поиск, история, экспорт, копии
- [Настройки](./configuration.md) — значения и разрешения
- [Безопасность](./security.md) — хранение и защита отправок
- [Сценарии использования](./recipes.md) — повседневные задачи агента

## Профиль человека

`tg contacts profile <person>` показывает сведения Telegram о человеке и его активность в общих с вами чатах:

- все имена пользователя, описание, день рождения, если он открыт, и номер телефона, если Telegram показывает его вам — последние четыре цифры, если не добавлен `--show-phone`;
- отметки самого Telegram: `bot`, `verified`, `premium`, `scam`, `fake`, `restricted`, `deleted`, `support`;
- `seen`: `online`, время или `recently`, `week`, `month`, если настройки приватности скрывают время, и `hidden`, если Telegram ничего не сообщает;
- `contact` и `mutualContact`, а также число общих групп (`commonChatsCount`);
- `registered`: когда создан аккаунт, с обязательным указанием источника — `telegram` (месяц, который Telegram сообщает при первом сообщении человека вам) или `estimate` (оценка по ID аккаунта на основе таблицы сообщества; для дат после декабря 2024 года оценки нет);
- `hasPhoto`: собственное фото человека — назначенное вами фото не учитывается;
- для каждого общего чата — число сообщений этого человека в вашем локальном хранилище, первое и последнее. `complete: false` означает, что в хранилище есть не весь чат, поэтому число сообщений — нижняя граница.

Команда запрашивает у Telegram ровно то же, что `contacts show`, и не уведомляет человека. С `--offline` отвечает из хранилища.

## Этот аккаунт — бот?

`tg contacts check <person>` оценивает, похож ли человек на бота, владельца поддельного аккаунта или спамера, и перечисляет все причины с источниками:

- отметки самого Telegram: bot, scam, fake, deleted;
- профиль: нет фото, имени пользователя или описания; необычное имя, новый аккаунт, первое фото за последние 30 дней;
- до 1 000 сохранённых сообщений: ничего не найдено, ссылка в самом старом сохранённом сообщении, если все сохранённые сообщения укладываются в лимит, одинаковый текст в нескольких чатах;
- два публичных списка спама — Combot CAS и lols.bot, которым отправляется ID человека.

`--no-registries` пропускает публичные списки; профиль и фото всё равно запрашиваются у Telegram. `--offline` ничего не запрашивает в сети и оценивает только сохранённые сведения. Недоступный список или отказ отображается как `unknown`, а остальные проверки продолжаются. Если у вас есть ключ Combot API, храните его в `TG_CAS_API_KEY` или в записи ключницы `registries:cas`; пока CAS отвечает и без ключа. Оценка — подсказка, а не вердикт.

## Контекст по человеку

`tg contacts context <person>` читает сохранённые сообщения связанных учётных записей и общие чаты без подключения
и без отметок о прочтении. `complete:false` и `notRead` показывают пробелы в архиве. `contacts link <person> max:<id>` и
`contacts unlink` ведут локальные связи между учётными записями; адресную книгу Telegram они не меняют.

`tg contacts context <person> --chat <chat> --chat <chat>` показывает последние сообщения человека в каждом указанном чате, от старых к новым, только время и текст — достаточно кратко для сводки AI-агента. `--limit` действует для каждого чата (по умолчанию 20); `-v` добавляет ID, ссылки на сообщения, отправителя и сообщение, на которое дан ответ; `-vv` показывает всё. `--refresh` сначала обращается к Telegram: один поиск по отправителю для каждого чата. Ничего не отмечается прочитанным.

`contacts context` возвращает тексты сообщений, поэтому подчиняется разрешениям `messages`; запись связей по-прежнему управляется `contacts`.
