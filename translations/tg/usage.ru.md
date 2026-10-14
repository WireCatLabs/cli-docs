---
title: "Использование tg"
---

<a id="для-скриптов-и-агентов" />
<a id="профиль-человека" />
<a id="этот-аккаунт--бот" />
<a id="контекст-по-человеку" />
<a id="a-persons-profile" />
<a id="is-this-account-a-bot" />
<a id="local-person-context" />

tg позволяет вам или вашему ИИ-агенту читать сообщения и выполнять действия от своего аккаунта Telegram через терминал. Эта страница показывает работу с аккаунтом: от первого входа до чтения, отправки и управления группами в том порядке, в котором они вам понадобятся. Откройте эту страницу, когда начнете с tg или когда захотите узнать, что возможно, прежде чем спрашивать своего агента.

Прочитав эту страницу, вы узнаете, как назвать чат, как читать и искать так, чтобы никто не видел, что вы просматриваете, как безопасно отправлять сообщения и как получать ответы, которые может использовать скрипт. Каждая команда и параметр находятся в [справке по командам](./commands.md); на этой странице объясняется, как они сочетаются друг с другом.

Термины, используемые на этой странице:

- **Профиль**: один вход в аккаунт Telegram на этом компьютере, со своей сессией и настройками. Его выбирает первое слово команды ([profiles](#profiles-the-first-word)).
- **Чат**: любой разговор — индивидуальный чат, группа, канал или сохраненные сообщения.
- **Локальное хранилище**: база данных на этом компьютере, где tg хранит все прочитанные сообщения ([локальное хранилище](./archive.md)).
- **Защита отправки**: проверка каждой отправки — профиль только для чтения, список разрешенных получателей и часовой лимит ([защита отправки](./security.md#the-send-guard)).

Каждая команда выполняет одно действие, выводит результат и выходит. Только `tg personal watch`, `tg personal serve` и `tg personal mcp` продолжают работать и сообщают об этом.

```sh
tg [profile] [options] <resource> <action> [arguments]
```

## Что можно сделать

| Возможность | Что вы можете сделать | Начните с |
|---|---|---|
| Читать | чаты, сообщения, одно сообщение и его соседи, темы форума | `tg personal chats list`, `tg personal messages list <chat>` |
| Проверить новое | непрочитанные сообщения других людей; что вы обещали и что открыто | `tg personal inbox`, `tg personal review` |
| Голос | превращать голосовые сообщения в текст на этом компьютере | `tg personal messages transcribe` |
| Файлы | скачать файлы сообщения или весь чат | `tg personal messages download` |
| Люди | контакты, профиль человека, проверка бота | `tg personal contacts list`, `tg personal contacts profile` |
| Поиск | сообщения, файлы, даты, люди; дискуссии по смыслу | `tg personal search messages`, `tg personal search conversations` |
| Отправить | текст, файлы, голос, ответы, запланированные сообщения | `tg personal messages send` |
| Изменить | редактировать, пересылать, закреплять, удалять, реагировать, голосовать, отмечать как прочитанное | `tg personal messages edit`, `tg personal reactions add` |
| Организовать | папки | `tg personal chats folders list` |
| Группы | участники, ссылки для приглашений, запросы на присоединение, темы, администраторы | `tg personal chats members list`, `tg personal chats link create` |
| Следить за обновлениями | новые сообщения по мере их поступления; поддерживать актуальность локального архива | `tg personal watch`, `tg personal server start` |
| Проверить | что сделала команда; что может сделать профиль | `tg personal runs list`, `tg config show` |

## Прочитайте чат с агентом

После подключения аккаунта попросите короткий итог переписки. Эта задача читает сообщения и ничего не отправляет.

**Ваш запрос:**

> Подведи итог пяти последних сообщений Book club. Покажи решения и открытые вопросы. Ничего не отправляй.

**Команда:**

```sh
tg personal messages list "Book club" --limit 5 --json
```

**Пример ответа агента:**

> **Решили:** следующая встреча в четверг в 18:00.
>
> **Открыто:** где встречаться.
>
> Могу показать сообщения, на которых основан итог. Ничего не отправлено.

Резюме выше является вымышленным. Попросите агента открыть исходное сообщение, прежде чем полагаться на его интерпретацию. Настройка, действия с сообщениями и разрешения описаны в разделах ниже.

## Начало работы

```sh
npm install -g @wirecat/tg-cli
```

```sh
tg personal setup         # guided app registration, login and agent skill
```

```sh
tg personal chats list --limit 5  # your newest chats
```

```sh
tg personal messages list me  # Saved Messages, the latest 20
```

Выделите около пяти минут на настройку. Загрузка истории осуществляется отдельно: выберите чат и объём истории для `tg personal messages sync <chat> --last 100`. Агент может прочитать `tg skill show` без входа в систему; `tg personal setup --agent codex` явно выбирает навык для одного агента. `tg setup --help` объясняет флаги. Больше ничего читать не нужно.

Чтобы узнать параметры для задачи, выполните `tg commands search messages --json` для одной
команды или `tg commands messages --json` для группы. Оба ответа содержат глобальные параметры
и коды завершения. Каждый путь команды проверяйте отдельным вызовом;
`tg commands --json` возвращает всё дерево.

## Вход

`tg personal setup` — команда первого запуска. По умолчанию она автоматически регистрирует приложение и предлагает вход по QR; `--app browser` и `--method phone` выбирают альтернативы. Для входа без остальных шагов либо для завершения прерванного или истёкшего входа используйте:

```sh
tg personal session start               # QR code: Settings → Devices → Link Desktop Device
```

```sh
tg personal session start phone         # phone number, the code Telegram sends, your 2FA password
```

```sh
tg personal session start phone --sms   # the same, asking for the code by SMS instead of in the app
```

```sh
tg personal session start --qr-file login.png  # the QR code as a picture, for an agent to show you
```

При первом входе также запрашивается ваше собственное приложение Telegram с сайта my.telegram.org; `--app auto` заполняет сайт за вас. Оба шага, и что где хранится: [логин, сессии и профили](./sessions.md).

**Секреты не передаются аргументами.** Хеш приложения и пароль 2FA вводятся скрыто, код и телефон — по запросу или через stdin. Аргументы видны процессам в `ps` и остаются в истории оболочки.

В CI переменные `TG_API_ID` и `TG_API_HASH` передают данные приложения вместо хранилища ключей и имеют приоритет над ним.

```sh
tg personal account show       # who this profile is logged in as; the phone as its last four digits
```

```sh
tg personal account show --show-phone  # the whole phone number
```

```sh
tg account list                # every profile on this computer and the account each is logged in as
```

```sh
tg personal account sessions list  # every device and app logged in to the account; ends nothing
```

```sh
tg personal session end        # log out on Telegram's side, and delete the session here
```

`session end` завершает сессию и в Telegram: устройство исчезает из списка. Для завершения с другого устройства используйте Настройки → Устройства.

## Профили: первое слово

Можно использовать несколько аккаунтов. Профиль задаётся первым словом, а не параметром:

```sh
tg personal chats list    # profile "personal"
```

```sh
tg work chats list        # profile "work"
export TG_PROFILE=work    # or for a whole shell session
```

**Первое слово считается профилем, если это не команда.** Имя `chats` запрещено с пояснением причины. Допустимы буквы, цифры, точки, дефисы и подчёркивания.

Каждый профиль имеет свою сессию, свое приложение, свои настройки и свой список разрешенных получателей. `TG_PROFILE_LOCK` привязывает процесс к одному профилю, поэтому агент не может выбрать профиль с меньшими ограничениями ([профили](./profiles.md)).

## Как указать чат

Везде, где команда принимает `<chat>`, доступны:

- название или часть: `"Book club"`, `book`
- идентификатор: `-1001234567890`
- имя пользователя: `@example_channel`
- `me` для «Избранного»

Если название подходит нескольким чатам, ошибка перечисляет их с идентификаторами. `tg` не угадывает: отправку в неверный чат нельзя отменить. Повторите с идентификатором. Он не меняется, поэтому используйте его дальше.

`messages show` и `messages context` также принимают указатель `msg:` вместо чата и идентификатора сообщения. Его возвращает `search messages --json` для каждого результата.

Для человека (`<person>` в `contacts show`) можно указать идентификатор, `@username` или часть имени.

## Чтение

**Чтение не отмечает сообщения прочитанными.** Команды ниже не показывают собеседнику ваш просмотр. Это делают только `tg personal chats mark-read` и `tg personal messages list --mark-read` ([ниже](#marking-a-chat-read)).

### Чаты

```sh
tg personal chats list                     # newest first, archived chats included
```

```sh
tg personal chats list 'unread_count>0 kind:group'  # only groups with unread messages
```

```sh
tg personal chats list 'title:*book*'   # titles containing "book"; at least 3 characters
```

```sh
tg personal chats show "Book club"         # kind, unread count, last message, who is in it
```

`--kind` принимает `dialog` (личный чат), `group`, `channel`, `saved`. Фильтры проверяют все полученные чаты. Для групп и каналов есть [отдельный раздел](#groups-and-channels).

### Сообщения

```sh
tg personal messages list "Book club"           # the latest 20, oldest first
```

```sh
tg personal messages list "Book club" --limit 50
```

```sh
tg personal messages list "Hiking" topic:12   # one forum topic; topics list shows the ids
```

```sh
tg personal messages show "Book club" 4242      # one message
```

```sh
tg personal messages context "Book club" 4242   # it, and 5 messages either side
```

```sh
tg personal messages context "Book club" 4242 --before-n 2 --after-n 10
```

В `context` выбранное сообщение отмечается `◀` в терминале и `"anchor": true` в JSON.

`topic:<id>` в запросе читает сообщения темы от самого нового назад или от `id<…`. Общая тема (`1`) не принимается: Telegram не присваивает её сообщениям ID темы, поэтому читайте весь чат. С `--offline` условие `topic:` оставляет только сохранённые сообщения этой темы.

### Ссылки на сообщения

`tg personal messages link <chat> <message>` или `tg personal messages link <msg:locator>` возвращает `{ item: { ref, url, access, reason } }`. Постоянные ссылки каналов и супергрупп могут быть общедоступными или ограниченными; ссылка не дает членства. Диалоги, основные группы и сохраненные сообщения возвращают локатор. Offline проверяет сохраненную цель и не возвращает постоянную ссылку. Локатор другого аккаунта отклонен. Эта единственная команда отличается от `messages links`, которая объясняет взаимоотношения диалога ([поиск темы](./topic-search.md)).

### Что требует ответа

```sh
tg personal inbox            # other people's unread messages, in every chat
```

```sh
tg personal inbox 'date>2h'  # everything that came in during the last two hours
```

```sh
tg personal inbox --new      # what arrived since the last --new — for scheduled runs
```

```sh
tg personal inbox --new --jsonl  # the same for a script: one message per line
```

`inbox` показывает только чужие сообщения с указанием чата. Чаты без уведомлений и архив пропускаются, кроме упоминаний и ответов вам; `--all` включает их. Число пропущенных выводится в stderr.

**`inbox --new` сдвигает сохранённую позицию.** Следующий `--new` продолжает с неё, показывая сообщения один раз. Первый `--new` охватывает 24 часа. `inbox` без `--new` и `inbox 'date>…'` позицию не меняют. Обычный `inbox` повторяет результат, пока сообщения не прочитаны в приложении: сам он не отмечает прочитанным.

За запуск читаются максимум 20 чатов. Остальные попадают в запись `missing` с шагом, который читает такой чат. Если ожидающих сообщений больше `--limit`, показываются самые новые, а stderr объясняет, как прочитать остальные.

### Обязательства и ожидания: `review`

```sh
tg personal review                         # the last 3 days
```

```sh
tg personal review 'date>2026-09-23T09:00'  # from where the last review ended
```

```sh
tg personal review 'chat:"Book club"' --json
```

Все сообщения — ваши и чужие — в чатах с активностью после `date>` в запросе. Они помогают понять обещания, ожидания и неясности; классификацию выполняете вы или агент. Отметки прочитанного нет.

Первый шаг `next` в ответе, `review.next`, — это следующая проверка: она начинается там, где закончилась эта
(`date>"<until>"`). **Следующую проверку запускайте с этого шага**, чтобы не было пропусков. При неполном результате — слишком много чатов или ограничение последними 300 сообщениями — команда предупреждает; границу лучше не сдвигать. Максимум 20 чатов за запуск.

#### Вопросы без ответа

```sh
tg personal review --unanswered            # questions nobody answered in 24 hours
```

```sh
tg personal review 'chat:Neighbours' --unanswered 4h
```

`--unanswered [hours]` оставляет вопросы, ожидающие вас или администраторов группы. Вопрос — сообщение с `?` (знак `?` в ссылках не учитывается) или ответ вам/администратору. Он закрыт, если вы или администратор ответили либо написали следом за автором. Вопросы моложе указанного срока (по умолчанию 24 часа) исключаются. Если администраторы неизвестны, учитываются только ваши ответы и выводится предупреждение.

Сохраненные голосовые расшифровки также учитываются в этом фильтре. Добавьте `--transcribe`, чтобы расшифровывать голосовые сообщения, у которых нет сохраненной расшифровки, перед выбором вопросов. Голосовое сообщение, которое не удалось расшифровать, делает обзор неполным: пустой результат не означает, что вопросов без ответа нет. Сохраняйте предыдущую границу, пока в ответе есть запись `missing`.

### Голосовые сообщения

```sh
tg personal messages transcribe "Book club" 4242  # by Telegram where it can, else a model here
```

```sh
tg personal messages transcribe "Book club" 4242 --local  # only the model on this machine
```

```sh
tg personal messages list "Book club" --transcribe  # every voice message shown that has no text yet
```

```sh
tg personal inbox --transcribe
```

```sh
tg personal review --transcribe
```

```sh
tg personal messages list "Book club" --transcribe --model gigaam-v3
```

Локальная расшифровка принимает полную запись Ogg Opus с одним или двумя каналами без фиксированного ограничения в десять минут. Более длинным записям нужно больше памяти и времени на обработку.

Telegram распознаёт речь для Premium и несколько сообщений в неделю по пробной квоте. Иначе работает локальная модель без передачи записи с компьютера. Модель скачивается один раз и только по запросу:

```sh
tg personal models audio list          # the models, which is downloaded, which is the default
```

```sh
tg personal models audio download parakeet-v3  # once, checked against the sha256 this version expects
```

| Модель | Языки | Размер |
|---|---|---|
| `parakeet-v3` — по умолчанию | 25: болгарский, чешский, датский, немецкий, греческий, английский, испанский, эстонский, финский, французский, хорватский, венгерский, итальянский, литовский, латышский, мальтийский, нидерландский, польский, португальский, румынский, русский, словацкий, словенский, шведский, украинский | 670 МБ |
| `gigaam-v3` | русский — лучшая из трёх моделей для русского | 232 МБ |
| `gigaam-v3-ctc` | русский — немного быстрее, хуже с заглавными буквами | 225 МБ |

`--model` выбирает другую модель для одной команды, рядом с `--transcribe` или в `messages transcribe`; `transcribe_with` и `speech_model` в настройках выбирают значения по умолчанию ([конфигурация](./configuration.md)). Расшифровка хранится в локальном хранилище и повторно используется в списках сообщений, входящих и проверках. Повторный вызов `messages transcribe` может запросить новую расшифровку или снова запустить распознавание. `--transcribe` может занять несколько минут.

### Файлы

```sh
tg personal messages download "Book club" 4242 --output-dir ~/Downloads  # one message's files
```

```sh
tg personal messages download "Book club" --all --output-dir ~/tg-files  # every file of the chat, newest first
```

Фотографии, файлы, видео и голосовые заметки сохраняются; папка создается, если она отсутствует. Файл сохраняет свое собственное имя; тот, у кого нет имени, получает идентификатор сообщения. **Загрузка никогда не перезаписывает файл.** При использовании `--all` перед уже занятым именем ставится идентификатор сообщения. `--all` запоминает место остановки в небольшом файле рядом с загрузками и продолжает выполнение той же команды оттуда. Сохраненные файлы доступны для чтения только вам. Отправка файлов, форматов и текста с возможностью поиска: [вложения файлов](./attachments.md).

### Люди

```sh
tg personal contacts list              # people you have a one-to-one chat with, newest first
```

```sh
tg personal contacts list 'name:*ann*' --order name
```

```sh
tg personal contacts show @example_user  # their bio and the chats you share
```

```sh
tg personal contacts lookup            # who has a phone number — asks for it, or reads it from stdin
```

```sh
tg personal contacts sync              # your whole Telegram contact list into the local store
```

```sh
tg personal contacts profile @example_user  # flags, last seen, registered, messages per shared chat
```

```sh
tg personal contacts context @example_user --chat "Book club"  # their latest messages there
```

```sh
tg personal contacts check @example_user  # does the account look like a bot or a spammer
```

`contacts list` — это люди, с которыми вы общаетесь один на один. `contacts sync` также добавляет остальную часть вашего списка контактов Telegram. `name:` и `notes:` ищут людей, которых хранит локальное хранилище, поэтому сначала нужен
`contacts sync` (или ранее прочитанные сообщения); если ничего не сохранено, запрос отклоняется. `contacts lookup` никогда не принимает число в качестве аргумента: передавайте его по конвейеру или вводите по запросу. Профиль человека, его последние сообщения, проверка бота и что он куда отправляет: [люди](./people.md).

Изменение контактов и собственного профиля:

```sh
tg personal contacts add @example_user  # under the name they show
```

```sh
tg personal contacts rename @example_user Ann "from work"  # a name only you see
```

```sh
tg personal contacts remove @example_user  # the chat stays
```

```sh
tg personal contacts block @example_user  # they need not be a contact
```

```sh
tg personal contacts unblock @example_user
```

```sh
tg personal contacts import people.txt  # one "number, name" per line; never numbers as arguments
```

```sh
tg personal account update --first-name Ann --description "about me" --photo me.jpg
```

```sh
tg personal account sessions end --others  # logs out every other device, your phone too; asks first
```

`contacts import` возвращает количество и найденных Telegram людей, без телефонов. `account sessions
end` спрашивает подтверждение; `--yes` подтверждает в скрипте.

### Страницы

Списки показывают `limit` строк (по умолчанию 20). `chats list`, `contacts list`, `chats members list` и `topics` принимают `--page` и `--all`:

```sh
tg personal contacts list --limit 5    # five a page
```

```sh
tg personal contacts list --limit 5 --page 2  # the sixth to the tenth
```

```sh
tg personal contacts list --all        # every row, no paging
```

⚠ **Нумерация страниц живого списка может повторить или пропустить строку.** Новое сообщение между запросами сдвигает чаты через границу страниц.

**У сообщений чата нет страниц: они принимают запрос по `id` и `date`, а для следующей страницы — `--cursor`**, что дает точное продолжение:

```sh
tg personal messages list "Book club" "id<4242"  # older than message 4242
```

```sh
tg personal messages list "Book club" "id>4242"  # newer than 4242, oldest first
```

```sh
tg personal messages list "Book club" "date>2h"  # what came in during the last two hours
```

```sh
tg personal messages list "Book club" "date>2026-09-20T09:00"
```

```sh
tg personal messages list "Book club" "date<1d"  # what came before this time yesterday
```

В терминале строка со следующей страницей идёт в stderr; в JSON это шаг `page.next`, который дает `--cursor`. `id<` и `id>` принимают идентификатор сообщения. `date>` и `date<` — ISO 8601 или период назад: `30m`, `2h`, `1d`. В `messages context` параметры `--before-n`, `--after-n` задают число сообщений вокруг выбранного.

### Найти чат и написать в него

```sh
tg personal chats list 'title:*book* kind:group'  # groups with "book" in the title
```

```sh
tg personal contacts list 'name:*ann*'  # people by name or @username
```

```sh
tg personal search all "contract"            # messages, mail and notes this machine has kept
```

```sh
tg personal search messages "contract"       # the text of every message this machine has kept
```

```sh
tg personal search messages 'contract chat:"Book club"'
```

```sh
tg personal search messages "invoice.*(march|april)" --regex
```

Для поиска чата и контактов необходимо **минимум три символа**. `search messages` использует [язык поисковых запросов](./query-language.md): `invoice` также находит другие формы слова, `invoic*` соответствует началу, а `exact:invoice` только эту форму. Он читает то, что было получено или сохранено `serve`, а также запрашивает собственный поиск Telegram (`--backend archive` только для архива). Вместо этого `--regex` рассматривает слова как одно регулярное выражение JavaScript. Подробнее: [поиск сообщений](./search.md). Если у вас есть чат, используйте его идентификатор.

## Отправка

**Ничего не отправляется, пока вы не введете отправляющую команду**, и оно не запрашивает подтверждения: чат и текст уже находятся в введенной вами строке. Каждая отправка проходит через защиту отправки: профиль только для чтения, список профиля `allow`, список разрешенных получателей и часовой лимит ([защита отправки](./security.md#the-send-guard)). Записывается каждая попытка, а не ее текст: `tg personal sends list`.

```sh
tg personal messages send me "a note to myself"
```

```sh
tg personal messages send "Book club" "See you at 7" --silent  # no notification
```

```sh
tg personal messages send "Book club" "a link, no card" --no-preview
```

```sh
tg personal messages send "Book club" "**Bold** and _italic_" --md  # Telegram Markdown
```

```sh
tg personal messages send "Book club" "<b>Bold</b> and <i>italic</i>" --html
```

`--md` использует форматтер Telegram: `**bold**` или `*bold*`, `_italic_`, `__underline__`, `~~struck~~` или `~struck~`, `||spoiler||`, встроенный код, изолированный код с языком, `[label](https://example.com)` и цитаты — строки, начинающиеся с `> `. Стили могут быть вложенными; code/pre не может вкладываться в другие объекты, ссылки не могут вкладываться, а цитаты не могут быть вложены. Без флага текст остается в том виде, в котором он был набран. Обратная косая черта экранирует знак; Внутренние слова `_` и `*` остаются буквальными. Незакрытые знаки оформления внутри строки остаются буквальными; незакрытый блок кода запрещен. Ссылки поддерживают абсолютные URL-адреса http, https и mailto. `messages edit` и подписи мультимедиа используют один и тот же форматтер. Telegram `__text__` подчеркнута; MAX `__text__` выделен жирным шрифтом. Одиночный `*text*` в Telegram выделен жирным шрифтом.

`--html` обрабатывает текст как HTML Telegram, такой же, как в Bot API: `<b>`, `<i>`, `<u>`, `<s>`, `<a href>`, `<code>`, `<pre language="…">`, `<blockquote>` и `<tg-spoiler>`. Переносы строк и пробелы сохраняются как введены. Ссылка-упоминание (`tg://user?id=`) или пользовательский эмодзи отклоняются. `--md` и `--html` нельзя использовать вместе. `messages edit` тоже принимает `--html`.

### Текст через stdin

Если аргумент текста отсутствует, он читается из stdin. Так можно отправить несколько строк и не оставлять текст в `ps` и истории оболочки:

```sh
printf 'first line\n\nthird line' | tg personal messages send me
tg personal messages send "Book club" < note.txt
```

### Отложенная отправка

```sh
tg personal messages send "Book club" "Tomorrow" --at-time 2026-10-01T09:00  # local time
```

```sh
tg personal messages send "Book club" "In two hours" --at-time 2h  # or 30m, 1d from now
```

```sh
tg personal messages scheduled "Book club"                      # what waits to be sent there
```

`--at-time` передаёт сообщение Telegram, который отправит его даже при выключенном компьютере. Время округляется вниз до минуты. Менее минуты или более года вперёд запрещено. Сообщение учитывается в лимите в час отправки. **Отмена и изменение доступны в приложении Telegram**; `tg` этого не делает.

### Файлы, фото и голосовые

```sh
tg personal messages send "Book club" "The agenda" --file agenda.pdf  # byte for byte; the text is the caption
```

```sh
tg personal messages send "Book club" --photo picture.jpg     # recompressed by Telegram
```

```sh
tg personal messages send "Book club" --file trip.mp4         # a video plays in the chat
```

```sh
tg personal messages send "Book club" --file trip.mp4 --as-file  # the same video as a file to download
```

```sh
tg personal messages send "Book club" --voice note.ogg        # a voice message, alone, with no text
```

```sh
tg personal messages send "Book club" --file 3f9a.pdf --filename "Report Q3.pdf"  # the name others see
```

`--photo` принимает `.jpg`, `.png`, `.webp`. `.mp4` и `.mov` с `--file` отправляются как видео, если нет `--as-file`. `--voice` принимает Ogg Opus (`.ogg`, `.oga`, `.opus`) без текста и других файлов. Известные файлы и папки с учётными данными, собственные папки `tg` и локальное хранилище защищены. Обычные скрытые рабочие папки разрешены; `--allow-any-file` в CLI позволяет использовать защищённые пути.

`--spoiler` размывает фотографию или видео до тех пор, пока на них не нажмут; документ и голосовое сообщение этот параметр не принимают. `--caption-above` показывает текст над фотографией или файлом. Telegram позволяет только ботам останавливать пересылку одного сообщения; для защиты контента включите собственную настройку чата в Telegram. Форматы, загрузки и текстовый поиск внутри файлов: [вложения файлов](./attachments.md).

### Ответ на сообщение

```sh
tg personal messages send "Book club" "Agreed" --reply-to 4242
```

Ответ — разновидность отправки; доступны все её параметры.

### Реакции и опросы

```sh
tg personal reactions add "Book club" 4242 👍  # replaces the reaction you had
```

```sh
tg personal reactions remove "Book club" 4242
```

```sh
tg personal polls show "Book club" 4250    # the poll and its answer ids
```

```sh
tg personal polls voters "Book club" 4250 'answers:<answer id>'  # who chose it; not in an anonymous poll
```

```sh
tg personal polls vote "Book club" 4250 <answer id>
```

```sh
tg personal polls vote "Book club" 4250 --retract
```

```sh
tg personal polls create "Book club" "Which day?" Monday Tuesday --anonymous
```

```sh
tg personal polls create "Book club" "Pizza now?" yes no --close-time 5m  # closes by itself; 5s to 10m
```

```sh
tg personal polls close "Book club" 4250   # your own poll; it cannot be reopened
```

```sh
tg personal polls create "Book club" "2+2?" 3 4 5 --quiz --correct 2 --solution "Four."  # a quiz; a vote is final
```

При чтении чата реакции отображаются под сообщением — `👍 3  🔥 1  (you: 🔥)`. Голос в публичном опросе показывает ваше имя всем участникам чата. Голосуйте по ID из `polls show`, а не по порядковому номеру ответа. `--multiple` позволяет выбирать несколько ответов. Изменить голос можно только в опросе, созданном с `--revote`. Голосование в закрытом опросе, два ответа в опросе с одним вариантом, изменение или отзыв окончательного голоса и `--retract` без голоса отклоняются до отправки; закрытие чужого опроса тоже отклоняется.

### Правка, пересылка, закрепление, удаление

```sh
tg personal messages edit "Book club" 4242 "the corrected text"  # your own message; --md or --html as in a send
```

```sh
tg personal messages forward "Book club" 4242 --to me       # checked against the chat it goes to
```

```sh
tg personal messages forward "Book club" 4242 --to "Hiking" --topic 12  # into one topic of a forum
```

```sh
tg personal messages pin "Book club" 4242                   # quiet unless --notify
```

```sh
tg personal messages unpin "Book club" 4242
```

```sh
tg personal messages delete me 4242 4243 --allow-dangerous  # at most 10, for you only
```

```sh
tg personal messages delete me 4242 --allow-dangerous --for-everyone
```

Редактирование меняет текст, который могли уже прочитать. Пересылка создаёт новое сообщение и проверяется по чату назначения как отправка. Удаление необратимо и требует ответа `y` или `--allow-dangerous`. В супергруппах и каналах Telegram удаляет только у всех, поэтому нужен `--for-everyone`.

**Что учитывается в почасовом лимите:** сообщение, пересылка, редактирование, закрепление с уведомлением, новый опрос, закрытие опроса и каждое удалённое сообщение. Реакция, голос и тихое закрепление не учитываются.

### Неизвестный результат отправки

Код `14` означает обрыв после отправки: **сообщение могло уйти**. Ошибка содержит `--operation-id`. Повторите с ним: Telegram исключит дубликат.

```sh
tg personal messages send "Book club" "See you at 7" --operation-id <id from the error>
```

```sh
tg personal messages forward "Book club" 4242 --to me --operation-id <id from the error>
```

Пересылка и опрос тоже получают идентификатор. Повтор без него создаст второе сообщение. Файл загружается до отправки сообщения: оборванную загрузку tg повторяет три раза, и если она так и не удалась, в ошибке сказано, что ничего не отправлено, — такую команду можно просто запустить снова. Другие записи — закрепление, реакция, отметка о прочтении, удаление, голос, папки, контакты — так же завершаются кодом `14`, когда Telegram не отвечает; сообщение говорит, безопасно ли повторять. Создание папки повторять небезопасно: сначала посмотрите `tg personal chats folders list`, иначе папок может стать две. Отправка с `--at-time` не повторяется: проверьте `tg personal messages scheduled <chat>`.

### Отметка прочитанным

```sh
tg personal chats mark-read "Book club"      # up to the newest message
```

```sh
tg personal chats mark-read "Book club" --until 4242  # only up to this one
```

```sh
tg personal chats mark-read "Hiking" --topic 12  # only this forum topic
```

```sh
tg personal messages list "Book club" --mark-read  # read it, and mark it read up to the newest shown
```

Собеседник видит прочтение. Действие `read` проходит защиту, но не входит в часовой лимит.

### Папки

```sh
tg personal chats folders list                     # your folders, in the order the app shows them
```

```sh
tg personal chats folders show "Trips"             # one folder, with the names of its chats
```

```sh
tg personal chats folders create "Trips" --chat "Hiking" --chat @kate
```

```sh
tg personal chats folders update "Trips" --title "Travel" --add "Climbing" --remove @kate
```

```sh
tg personal chats folders delete "Travel"          # the chats stay
```

```sh
tg personal chats folders order "Travel" "Work"    # these first; the rest keep their order after them
```

```sh
tg personal chats folders join https://t.me/addlist/AbCdEf  # a folder someone shared: joins every chat in it
```

```sh
tg personal chats folders create "Inbox" --include contacts,groups --skip muted,archived --emoji 📥
```

```sh
tg personal chats folders update "Inbox" --exclude-chat "Noisy group" --pin @kate
```

```sh
tg personal chats folders update "Inbox" --include none  # no kinds any more; only the chats named in it
```

Папка может автоматически включать типы `contacts`, `non-contacts`, `groups`, `channels`, `bots` через `--include`; `--skip` исключает `muted`, `read`, `archived`. `--exclude-chat` исключает конкретный чат, `--pin` закрепляет его сверху. При `update` `--include` и `--skip` заменяют прежние правила; `--remove` удаляет чат из всех списков. Общая папка по ссылке не принимает правила. `--emoji` должен быть значком папки Telegram: другой Telegram молча отбросит, и ответ покажет реально сохранённое значение.

Папка указывается по ID или точному названию. Папки видите только вы; каждое изменение всё равно проходит проверки как изменение `account`. `join` отличается: участники этих чатов видят, что вы вступили, как при `tg personal chats join`. Папка «Все чаты» сохраняет своё место при `order`.

### Комментарии к постам канала

```sh
tg personal messages comments "Rozetked" 27644     # the comments under post 27644, oldest first
```

```sh
tg personal messages comments "Rozetked" 27644 "id<3732413"
```

```sh
tg personal messages send "My channel" "Thanks!" --comment-to 120
```

Комментарии находятся в группе обсуждения канала: ответ указывает её в `discussion`, а комментарий отправляется как ответ в этой группе, поэтому список получателей и почасовой лимит учитывают его для неё. Пост канала без группы обсуждения или с закрытыми комментариями приводит к завершению с кодом `6`.

### Отправка от имени канала

В группе, где вы можете писать от имени одного из своих каналов, сначала получите список доступных отправителей, затем выберите одного:

```sh
tg personal chats send-as "Book club"
```

```sh
tg personal messages send "Book club" "Meeting moved to 8" --send-as <id from the list>
```

В списке всегда есть вы, а `default` отмечает сохранённый выбор группы; чтение ничего не меняет. ID, которого нет в списке, отклоняется. `--send-as` работает и с файлами, `tg personal messages forward` и `tg personal polls create` — для пересылки нужен список чата из `--to`. При повторении операции с неизвестным результатом передайте тот же `--send-as` вместе с `--operation-id`.

В группе канал может быть сохранён как отправитель по умолчанию — Telegram делает это для группы обсуждения вашего канала. В такой группе отправка, пересылка или опрос **без** `--send-as` отклоняются (код `2`), чтобы не уйти от имени канала: ошибка предлагает `--send-as <your id>` для отправки от вашего имени и `--send-as <channel id>` — от имени канала.

### Чего пока нет в tg

Несколько фотографий в одном сообщении остаются в [планах](./roadmap.md).

## Группы и каналы

Все для группы, которую вы ведёте — правила модерации, проверки, полный список настроек — находится в [группы, которые вы ведёте](./groups.md).

```sh
tg personal chats inspect https://t.me/+AbCdEf     # where an invite or public link leads; does not join
```

```sh
tg personal chats members list "Hiking" --all      # everyone, with their role and when last seen
```

```sh
tg personal chats events "Hiking"                  # who joined, left, was added or removed — 7 days
```

```sh
tg personal chats events "Hiking" 'type:(join OR leave) time>=2026-09-01T00:00'
```

```sh
tg personal topics list "Hiking"                   # a forum group's topics, newest activity first
```

```sh
tg personal search topics "Hiking" "gear"
```

```sh
tg personal topics show "Hiking" 12                # one topic: title, closed or pinned, last activity
```

```sh
tg personal review 'chat:Hiking' --unanswered    # questions nobody answered
```

Эти команды только читают. `events` читает служебные сообщения чата: кто что сделал и кому. Имена: `join`, `leave`, `add`, `remove`, `create`, `title` и `pin`.

Это что-то меняет, и люди в чате это видят.

Для форума используйте `tg personal topics enable <chat>` и `tg personal topics create <chat> <title>`. Базовая группа требует `--upgrade --yes`; сохраните новый идентификатор чата, возвращенный обновлением. Прочитайте `topics list` после неизвестного результата создания вместо повторения создания. Отправьте на его идентификатор с помощью `tg personal messages send <chat> <text> --topic <id>` или `tg personal polls create <chat> <question> <answers> --topic <id>`. `tg personal topics edit <chat> <id> --title <new>` переименовывает тему, `--closed on`/`--closed off` закрывает ее для новых сообщений или открывает заново, `--pinned on`/`--pinned off` закрепляет ее вверху или открепляет, а на общей теме (id 1) `--hidden on`/`--hidden off` скрывает ее из списка тем или возвращает её в список. `tg personal topics order <chat> <id...>` размещает закрепленные темы в указанном порядке; он ничего не закрепляет и не открепляет. Повторение любого из этих действий безопасно. `tg personal topics delete <chat> <id>` удаляет тему и каждое сообщение в ней для всех; его нельзя отменить, поэтому по умолчанию он сначала запрашивает; явный `topics.delete: allow` или `--allow-dangerous` пропускает вопрос. Общая тема не может быть удалена.

```sh
tg personal chats create "Hiking 2027" @olga 12345  # a supergroup; the people added are told
```

```sh
tg personal chats create "Trail news" --channel    # a channel; people join it by its link
```

```sh
tg personal chats join https://t.me/+AbCdEf        # by an invite link, or a public one
```

```sh
tg personal chats leave "Hiking 2027"
```

```sh
tg personal chats update "Hiking 2027" --title "Hiking 2028" --description "routes and dates"
```

```sh
tg personal chats update "Hiking 2027" --all-can-pin off --only-admins-add on
```

```sh
tg personal chats link show "Hiking 2027"          # the invite link, if you may see it
```

```sh
tg personal chats link reset "Hiking 2027"         # a new one; the old one stops working
```

```sh
tg personal chats link create "Hiking 2027" --approval --expire-time 7d  # another link; who joins asks first
```

```sh
tg personal chats link create "Hiking 2027" --max-uses 20  # at most 20 people join by it
```

```sh
tg personal chats update "Hiking 2027" --join-approval on  # everyone asks first, by any link
```

```sh
tg personal chats requests list "Hiking 2027"      # who asked to join, newest first
```

```sh
tg personal chats requests list "Hiking 2027" 'name:*Ana*'  # by name; or link:<link>
```

```sh
tg personal chats requests accept "Hiking 2027" 67890  # let them in; decline turns them away
```

```sh
tg personal chats requests decline "Hiking 2027" --all  # every pending request at once; --link narrows it
```

```sh
tg personal chats link list "Hiking 2027"          # your links, with how many joined and how many wait
```

```sh
tg personal chats link revoke "Hiking 2027" https://t.me/+AbCd  # stop one link
```

```sh
tg personal chats link update "Hiking 2027" https://t.me/+AbCd --no-approval --max-uses 50  # change only these
```

```sh
tg personal chats members add "Hiking 2027" @kate 67890  # they are told
```

```sh
tg personal chats members remove "Hiking 2027" @kate  # their messages stay
```

```sh
tg personal chats admins add "Hiking 2027" @kate --can pin,delete
```

```sh
tg personal chats admins remove "Hiking 2027" @kate
```

Новая группа — это всегда супергруппа. Имя человека, чьи настройки конфиденциальности запрещают его добавление, указано в ответе под `providerMetadata.notAdded`; группа все равно создается. `chats join` в группу, администраторы которой одобряют присоединение, отвечает `requested: true` и завершается с кодом `0`: запрос отправлен, и вы попадаете в него, как только администратор его примет. Каждый из них проходит через охрану как изменение `chat`, и каждый добавленный человек засчитывается в почасовой лимит.

`chats link create` создает еще одну ссылку-приглашение и никому не сообщает: `--approval` заставляет того, кто присоединится по ней, спросить подтвердить вступление, `--expire-time` задаёт срок действия (`2026-12-01T09:00` или `30m`, `2h`, `7d` с этого момента), а `--max-uses` ограничивает число вступлений. `chats link update` меняет одни и те же три на одной из ваших ссылок, а также на собственной ссылке группы (`--no-approval` отключает одобрение, `--expire-time never` отменяет срок действия); неуказанные настройки сохраняются. Ссылка с одобрением вступления, не имеет ограничения на использование, поэтому `--approval` с `--max-uses` отклоняется. `chats update --join-approval on` заставляет всех спрашивать первыми, какую бы ссылку они ни использовали.

В группе, администраторы которой одобряют присоединение, `chats requests list` показывает ожидающие запросы с примечанием, отправленным пользователем; их видят только админы, а чтение никому не говорит. Запрос сужает список: `name:` или `username:` находит людей, `link:` оставляет тех, кто спросил, по одной ссылке-приглашению; Telegram не может делать и то, и другое одновременно. `accept` и `decline` отвечают на один, по идентификатору из списка. Принятый запрос учитывается в почасовом лимите, отклоненный — нет; список получателей проверяет только группу. Тому, кто уже является участником, отвечают `already: true`, а отсутствующий запрос заканчивается выходом `6`. `--all` отвечает на каждый ожидающий запрос, а с `--link` — на те, которые пришли по одной ссылке; они учитываются в первую очередь, и прием, превышающий часовой лимит, отклоняется до того, как кого-либо впустят. `chats link list` показывает только ваши собственные ссылки; отзыв собственной ссылки группы приводит к тому, что Telegram выдает новую, о чем свидетельствует ответ.

`chats update` меняет заголовок, описание и две настройки Telegram за один раз; ответом является группа в ее нынешнем виде, и `chats show` показывает те же настройки. Правила модерации — `chats rules` и `chats moderate` — находятся в [правилах модерации](./groups.md#rules).

<a id="for-scripts-and-agents"></a>

## Вывод: таблицы, JSON и коды выхода

**На терминале `tg` печатает таблицу; в канал или с помощью `--json` он печатает одно значение JSON на стандартный вывод и ничего больше** — ни счетчика, ни галочки, ни предупреждения. Примечания, предупреждения и ошибки передаются в поток stderr в каждом режиме. Именно это позволяет сценарию или вашему агенту полагаться на ответ.

```sh
tg personal chats list --json | jq -r '.items[].id'
```

```sh
tg personal messages list me --jsonl | jq -r .text  # one message per line
```

- `--json`: одно значение JSON. **Каждый список представляет собой один объект** всегда одной и той же формы: `{ "items": [...], "page": { "limit": 20, "has_more": true }, "meta": { ... } }`; если строк больше, список называет следующий шаг в `page.next`. `--all` и `--offline` отвечают одним и тем же объектом. Одна сущность, а не список, — это `{ "item": {...}, "meta": {...} }`.
- Сообщения чата листаются через `--cursor`, а не по номеру страницы; его несет `page.next`.
- `--jsonl`: по одному объекту в строке, без оболочки; есть ли что-то еще, говорится только в stderr.
  Отчет (`stats …`) — это один объект, поэтому `--jsonl` для него отклоняется; списки `stats * evidence` по-прежнему выдаются потоком.
- Ошибка, завершающая команду, — `{ "error": { "code": "...", "message": "..." } }` на stderr, а stdout пуст, поэтому отказ никогда не может быть воспринят как пустой результат.
- Частичное чтение и скачивание может завершиться с кодом `0`: проверьте `complete` и `batch` или `issue`; JSONL частичной загрузки добавляет `batch_summary`.
- **Переход по коду выхода, а не по тексту.** Текст меняется; код этого не делает. `0` сработал, `2` неправильный ввод, `4` не вошел в систему, `5` профиль не может этого сделать, `6` не найден, `7` нет в списке разрешенных получателей, `8` установлен лимит (почасовой лимит или собственный Telegram), `9` Telegram не ответил вовремя, `14` неизвестно, дошло ли сообщение. Полная таблица находится в [кодах выхода](./commands.md#exit-codes).
- **Идентификаторы — это строки.** Не преобразуйте идентификатор в число.
- `--quiet` скрывает обычные сообщения о работе; ошибки остаются. `-v` и `-vv` добавляют детали к представлению таблицы.
- `--timeout 30s` ограничивает всю команду (`500ms`, `30s` или `2m`).
- `tg commands --json` — это все дерево команд, с `effects: { remote, local }` для каждой команды:
  `remote: "write"` значит, что команда что-то меняет в Telegram.

```sh
if ! tg personal messages send "Book club" "See you at 7" --json > /dev/null; then
  case $? in
    14) echo "it may have gone — repeat only with the same --operation-id" ;;
    4)  echo "run tg personal session start" ;;
  esac
fi
```

## Подключите своего ИИ-агента

ИИ-агент, выполняющий команды в терминале (например, Claude Code, Codex или Gemini CLI), читает файл навыков tg: правила и ловушки, которые `--help` не может объяснить. `tg personal setup` устанавливает его, как и `tg skill install` (`--for claude`, `agents` или `all`, по умолчанию). Чтобы установить его вручную:

```sh
mkdir -p ~/.claude/skills/tg-cli && tg skill show > ~/.claude/skills/tg-cli/SKILL.md   # Claude Code
mkdir -p ~/.agents/skills/tg-cli && tg skill show > ~/.agents/skills/tg-cli/SKILL.md   # Codex, Gemini CLI
```

Локальный Cursor тоже читает `~/.agents/skills/tg-cli/`. Установленные инструкции берутся из той же версии пакета, что и `tg`. Если агент не видит навык, начните новую сессию агента. Как каждый агент находит навыки: [Codex](https://learn.chatgpt.com/docs/build-skills), [Gemini CLI](https://geminicli.com/docs/cli/skills/), [Cursor](https://cursor.com/docs/skills).

Агент без терминала (например, Claude Desktop или Cursor) подключается через MCP: [сервер MCP](./mcp.md).

## Отображение переписки

`tg personal messages list` и `tg personal search messages` в терминале выводят переписку, а не таблицу:

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
tg personal watch                  # new messages, until Ctrl-C or --timeout
```

```sh
tg personal watch --jsonl          # one message per line, as messages list --jsonl
```

```sh
tg personal watch --jsonl | ./on-message.sh
```

```sh
tg personal watch --events --jsonl  # edits, deletions and reactions too
```

```sh
tg personal watch --jsonl --timeout 2m  # a timeout ends it normally, with exit code 0
```

С `--events` строки содержат тип: `message`, `edit`, `delete`, `reaction`. Без параметра — только сообщения. При удалении в личном чате или небольшой группе Telegram не сообщает чат, поэтому он отсутствует.

**`watch` начинается с этого момента.** То, что поступило, пока ничего не прослушивалось, не отображается. Чтобы поддерживать актуальность локального хранилища, включая все, что поступило, пока этот компьютер был выключен, используйте `serve` в фоновом режиме или в качестве системной службы ([поддержание актуальности хранилища](./archive.md#keeping-it-current-serve)):

```sh
tg personal server start  # serve in the background; answers once it is connected
```

```sh
tg personal server status
```

```sh
tg personal server install  # a systemd user unit or a launchd agent; starts nothing
```

## Что сделала команда

```sh
tg --trace chats list          # show each request on stderr, keep nothing
```

```sh
tg --record chats list         # keep it, show nothing
```

```sh
tg personal runs list          # what was kept, newest first
```

Неудачный запуск всегда сохраняется. Запись содержит операции, идентификаторы, количество и продолжительность — но не сообщение, имя, заголовок чата, номер телефона или ключ. Полностью: [диагностика](./diagnostics.md).

## Локальная база

Все прочитанные `tg` данные сохраняются на компьютере для работы без сети:

```sh
tg personal chats list --offline                  # only from the store, never connect
```

```sh
tg personal messages sync "Project Alpha" --estimate  # how much a fetch would take
```

```sh
tg personal messages sync "Project Alpha" --background  # a chat's history, as a job
```

```sh
tg personal store export "Project Alpha" --format markdown --output alpha.md
```

```sh
tg personal store backup ~/tg-store.db            # a copy of the store, while it is in use
```

Обычная команда все равно запрашивает Telegram. `--offline` предназначен для случаев, когда сети нет или подключение не требуется; отправка с `--offline` отклонена. Извлечение, экспорт, поиск, резервное копирование и сервис: [локальный архив](./archive.md).

## Настройки и разрешения профиля

Настройки хранятся в необязательном `config.json`. Приоритет: **параметр → переменная окружения → профиль в файле → общие значения файла → встроенное значение**.

```sh
tg config show                                 # every setting, and where it came from
```

```sh
tg config set limit 50
```

```sh
tg work config set permissions.messages readonly   # profile "work" changes no messages
```

```sh
tg config set permissions.messages.send ask        # a yes or no before each send
```

```sh
tg config set sends_per_hour 10
```

`permissions` сообщает, что профиль может делать для каждой команды: `deny`, `readonly`, `ask` или `allow`. По умолчанию все разрешено, а удаление сообщений и завершение сессий спрашивается в первую очередь. Отказ — это код выхода `5`, а в ошибке указывается команда, которая это разрешает. **В файле нет поля для секрета.** Каждая настройка и переменная: [конфигурация](./configuration.md).

## Один человек

`tg personal contacts profile <person>` показывает, что Telegram говорит об одном человеке и насколько он активен в чатах, которыми вы делитесь. `tg personal contacts check <person>` оценивает их как возможных ботов, фейков или спамеров по всем причинам. `tg personal contacts context <person>` считывает информацию о них в архиве: без `--chat`, для каждого аккаунта, связанного с ними с помощью `contacts link`; с `--chat`, их новейшими сообщениями в каждом названном вами чате. Что каждый спрашивает в Telegram или общедоступном спам-листе, и что он куда отправляет: [люди](./people.md).

Несколько ограничений, которые следует знать: предполагаемая дата регистрации определяется на основе идентификатора аккаунта с таблицей сообщества, и нет оценки после декабря 2024 года. Проверка бота считывает до 1000 сохраненных сообщений. `contacts context` возвращает тела сообщений, поэтому он соответствует разрешениям `messages`; связывание и отключение идентификаторов контролируется `contacts` и никогда не меняет адресную книгу Telegram.

## Дальше

- [Локальный архив](./archive.md): поиск, получение истории чата, экспорт, резервное копирование.
- [Конфигурация](./configuration.md): настройки и возможности профиля.
- [Безопасность](./security.md): то, что достигает диска, и защита отправки.
- [Сценарии](./recipes.md): обычная работа для вашего ИИ-агента.
