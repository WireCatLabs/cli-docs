---
title: "Поиск сообщений"
---

Вам нужно найти что-то, что было написано: сообщение, соглашение, адрес, написанный несколько месяцев назад. На этой странице показано, как искать все, что `wa` сохранил на этом компьютере — сообщения WhatsApp и заметки, импортированные [memo](https://github.com/WireCatLabs/cli-memo).

Прочитав его, вы сможете найти сообщения по словам, людям, чатам и датам, сохранить поиск и запустить его снова, подсчитать совпадения и сказать настоящее «не найдено» по пробелу в сохраненной истории. Поиск никогда не подключается к WhatsApp и не отмечает ничего прочитанного.

Термины, используемые на этой странице:

- **Локальное хранилище** (также называемое архивом): база данных на этом компьютере, где `wa` хранит все сообщения, отправленные телефоном и полученные `serve` ([локальное хранилище](./archive.md)). Каждый поиск читает только это.
- **Запрос**: что вы ищете. Это могут быть простые слова или слова с полями, например `from:` и `date:`. Ваш ИИ-агент пишет за вас запросы; полный язык находится в [справке по языку запросов](./query-language.md).
- **Охват**: что увидел поиск — сколько чатов и сообщений было сохранено.

## Когда запоминаешь вопрос, а не его формулировку

Попросите своего агента найти сообщения, отвечающие на вопрос, и показать подтверждающие сообщения. Например: «Узнайте, когда запускается ежедневный экспорт Helix в чате проекта, и проверьте, изменилось ли расписание». Агент может использовать обнаружение архивов для поиска частичных совпадений слов и прямых ответов, а затем проверять эти сообщения, прежде чем ответить. Модель не скачивается.

Для управления из командной строки:

```sh
wa personal search messages 'What time does Helix export run? chat:120363000000000001@g.us' --discover --json
```

Фильтры чата, отправителя и даты по-прежнему применяются. Через MCP передайте `discover: true` на `wa_read` (`command: "search messages"`). `discovery` каждого элемента указывает, какая часть запроса ему соответствует: `missing_terms` называет несовпадающие термины, а `parent` связывает ответ с соответствующим родительским элементом. Высокий балл не является показателем уверенности в ответе: вопрос, предложение или старое решение могут занять первое место. Прочтите доказательства и проверьте [то, что хранится в местной базе данных](./archive.md#how-much-is-kept), прежде чем прийти к выводу, что факт отсутствует.

Без `--discover` остается обычный строгий поиск. Логический синтаксис, фразы в кавычках, подстановочные знаки, `--exact` и `--newest` сохраняют строгое поведение.

## Что можно сделать

Каждый поиск осуществляется одной группой команд `wa personal search`. Если вы не знаете, где что-то было написано, начните с `search all`.

| Задача | Команда |
|---|---|
| Поиск сообщений и заметок в одном ответе | `wa personal search all '<query>'` |
| Искать только в сообщениях WhatsApp | `wa personal search messages '<query>'` |
| Поиск почты | памятки: установите @wirecat/cli-memo, затем `memo search mail '<query>'` |
| Поиск заметок, написанных в заметках или импортированных из папки | `wa personal search notes '<query>'` |
| Подсчитайте совпадения по чату, отправителю, дню или часу | `wa personal stats messages show '<query>'` |
| Сохранить поиск и запустить его позже | `wa personal searches create`, `wa personal search messages --saved <name>` |

```sh
wa personal search all 'lease agreement'          # messages and notes, best match first
```

```sh
wa personal search all 'lease' --only notes       # notes only
```

```sh
wa personal search messages 'lease chat:"Book club"'  # WhatsApp messages only, never mail
```

```sh
wa personal search notes 'budget source:internal'  # only notes written in memo
```

`search all` сообщает, что представляет собой каждое попадание — сообщение (`msg:…`) или заметку (`note:…`). `wa` никогда не ищет почту: `memo search mail` делает это. Если поле не применимо — `chat:`/`from:` для примечаний — `search all` пропускает этот ресурс и объясняет, почему. Почта и заметки попадают в локальное хранилище через memo: `memo sync --mail` и `memo import`. Без них `search all` ищет только сообщения.

Остальная часть этой страницы посвящена поиску сообщений, `wa personal search messages`.

## Попробуйте целенаправленный поиск

Начните с фразы и одного чата.

**Ваш запрос:**

> Найдите сообщение «Счет оплачен» в Книжном клубе. Покажите матч и любые пробелы в истории.

**Команда:**

```sh
wa personal search messages '"invoice paid" chat:"Book club"' --json
```

**Пример ответа агента:**

> **Одно подходящее сообщение в сохраненной истории.**
>
> 

| Человек | Сообщение |
> 

| --- | --- |
> 

| Алиса Синтетика | Счет оплачен вчера. |
>
> Магазин держит этот чат только с момента привязки устройства. Я могу открыть это сообщение и его содержимое
> разговор.

Пустой результат не является доказательством того, что сообщения никогда не существовало. Примеры на этой странице являются вымышленными.

## Что может ответить локальное хранилище

Поиск видит только то, что хранится в локальном хранилище: историю, которую телефон отправил при подключении устройства, то, что `serve` получил во время работы, а также более старые сообщения, которые `messages sync` запрашивал у телефона ([старая история](./archive.md#older-history-from-your-phone)). Промежуток между отправкой истории и днем ​​начала `serve` не может быть заполнен. Поддерживайте актуальность локального хранилища с помощью `wa personal server install` ([поддержание актуальности](./archive.md#keeping-it-current-serve)).

Каждый поиск говорит то, что он искал. В случае `--json` `coverage` содержит количество искомых `messages` и `chats`. Заключите запрос в одинарные кавычки, чтобы оболочка не трогала кавычки и скобки. Имена ниже являются примерами; используйте свои собственные чаты и людей.

## Слова и фразы

```sh
wa personal search messages invoice
```

```sh
wa personal search messages '"invoice paid"'     # words together
```

```sh
wa personal search messages 'cafe OR library'
```

```sh
wa personal search messages '(cafe OR library) NOT loud'
```

```sh
wa personal search messages 'invoic*'            # every word that starts with "invoic"
```

В сообщении должны быть все слова, расположенные рядом друг с другом. Поиск включает формы слов в соответствии с языковыми настройками локального хранилища: `piso` позволяет найти `pisos`. Кавычки объединяют слова, а также позволяют формировать слова. Используйте `exact:piso` или добавьте `--exact` для слов без явного поля. Явный `text:` по-прежнему соответствует формам. Регистр и акценты игнорируются. Текст письменного сообщения не исправляется на предмет опечаток.

Простые слова и `transcript:` также выполняют поиск сохраненных расшифровок голосовых заметок, включая словоформы и варианты написания отдельных слов, которые могут быть искажены при распознавании речи. `text:` ищет только письменный текст; `exact:` или `--exact` для простых слов сохраняет точность этих слов без расширения написания транскрипции.

## Люди и чаты

```sh
wa personal search messages 'from:"Alice Synthetic" invoice'
```

```sh
wa personal search messages 'from:("Alice Synthetic" OR "Bob Synthetic") library'
```

```sh
wa personal search messages 'from:me date:7d'    # what you wrote this week
```

```sh
wa personal search messages 'chat:"Book club" library'
```

```sh
wa personal search messages 'chat:120363000000000001@g.us library'  # a chat by its id
```

```sh
wa personal search messages 'passport kind:private'  # one-to-one chats only
```

В WhatsApp `kind:private` — это индивидуальный чат, `kind:group` — групповой, `kind:saved` — чат с самим собой, а `kind:channel` — канал WhatsApp. Идентификатор человека обычно `…@lid`, группы `…@g.us`. Для поиска каждой аккаунта в локальном хранилище добавьте `--source all`.

## Даты

```sh
wa personal search messages 'date:today'
```

```sh
wa personal search messages 'library date:yesterday'
```

```sh
wa personal search messages 'invoice date:7d'    # from 7 days ago until now; also 30m, 2h
```

```sh
wa personal search messages 'invoice date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid
```

`today`, `yesterday` и календарные даты — это дни в часовом поясе вашего компьютера; `--timezone` выбирает другого. В диапазоне `[` и `]` включают этот день, `{` и `}` исключают его.

## Ссылки, телефоны и адреса

```sh
wa personal search messages 'has:link AND "github.com"'  # a link to a site
```

```sh
wa personal search messages 'domain:docs.google.com'
```

Ссылка считается, если она находится в тексте. Чтобы найти телефон, адрес электронной почты, сайт ссылки или подтвержденное лицо, упомянутое в тексте, используйте `phone:`, `email:`, `url:`, `domain:` и `mentions:`; см. [Упоминания](./query-language.md#mentions).

## Файлы

```sh
wa personal search messages 'has:file chat:"Book club"'
wa personal search messages 'filename:agenda.pdf'
wa personal search messages 'mime:"application/pdf"'
wa personal search messages 'content:"reading list"'
```

В хранилище сохраняется имя, размер и тип каждого файла, поэтому `has:file`, `filename:` и `mime:` работают с каждым сообщением, хранящимся с тех пор, как `wa` обрабатывал файлы. `content:` находит текст внутри файла после его чтения ([чтение текста файлов](./attachments.md#read-the-text-of-files)).

## Пароли, коды и карты

```sh
wa personal search messages 'preset:secret kind:saved'  # something that looks like a password or token
```

```sh
wa personal search messages 'preset:card'
```

Предустановка находит сообщения, которые *выглядят* как пароль, код входа, ключ API, номер карты или IBAN, паспорт, телефон, адрес электронной почты или ссылку. Он проверяет только форму: он не доказывает, что пароль работает или карта настоящая. Полный список находится на [языке запросов](./query-language.md#presets).

## Теги

```sh
wa personal tags add work --chat "Book club"
```

```sh
wa personal tags add work --contact 100000000000001@lid
```

```sh
wa personal tags list tag:work type:chat
```

```sh
wa personal search messages 'tag:work invoice'
```

```sh
wa personal search messages 'invoice NOT tag:work'
```

```sh
wa personal tags remove work --chat "Book club"
```

Тег — это ваша собственная метка в чате, человеке, одном сообщении (`--message <id> --chat <chat>`) или задаче (`--task <id-or-key>`). Он хранится только в локальном хранилище и никогда не отправляется в WhatsApp. `tag:work` находит сообщения с тегом `work`, сообщения в чате с тегом `work` и сообщения от человека с тегом `work`. Тег состоит из 1–32 букв a–z, цифр и дефисов.

Группы могут быть помечены автоматически по их названию и описанию — без сообщений и без модели:

```sh
wa personal metadata refresh --chat "Book club"  # read the group's description from WhatsApp; the group is not changed
```

```sh
wa personal metadata refresh --only-missing  # every stored group with no description read yet
```

```sh
wa personal tags auto --dry-run          # what it would tag, without writing
```

```sh
wa personal tags auto                    # write the automatic tags
```

`metadata get --chat "Book club"` показывает, что было прочитано из локального хранилища. Каналы еще не читаются: канал в списке отвечает своей ошибкой, а остальные продолжаются.

## Сохраненные поисковые запросы и история

```sh
wa personal searches create meetings 'library OR cafe' --chat "Book club"
```

```sh
wa personal search messages --saved meetings
```

```sh
wa personal search messages --saved meetings 'date:today'  # extra words are added with AND
```

```sh
wa personal stats messages show --saved meetings --by day
```

```sh
wa personal searches list
```

```sh
wa personal searches history --limit 10
```

```sh
wa personal search messages --saved 42           # a row of the history, by its number
```

`searches create` сохраняет запрос с его параметрами и ничего не выполняет; для существующего имени требуется `--replace`. Параметры, которые вы вводите с помощью `--saved`, заменяют сохраненные. Сохраненный текст считывается снова при каждом запуске, поэтому `date:7d` всегда означает последние 7 дней. `searches show` печатает один, `searches delete` удаляет один.

Каждый успешный поиск и подсчет записываются в историю: запрос и его параметры, а не найденные сообщения. Сохраняются самые новые 1000 запусков. `--no-record` сохраняет один запуск. `searches clear` очищает историю и сохраняет сохраненные поисковые запросы. Эта история отделена от записей запуска `wa personal runs`.

Сохраненные поисковые запросы и история хранятся в локальном хранилище, которую использует каждый интерфейс командной строки WireCat: `tg` и `max` видят одни и те же, а `delete` или `clear` в одном меняют другие. Теги остаются со своим аккаунтом.

## Подсчет: `stats messages show`

```sh
wa personal stats messages show invoice               # how many in each chat
```

```sh
wa personal stats messages show 'date:7d' --by sender
```

```sh
wa personal stats messages show 'from:me' --by day --timezone Europe/Madrid
```

```sh
wa personal stats messages show --by hour             # every stored message
```

`stats messages show` подсчитывает сообщения, которые `search messages` нашел бы по одному и тому же запросу, каждое по одному разу. `--by chat` (по умолчанию) и `--by sender` ставят на первое место самый большой; `--by day` и `--by hour` идут по порядку. Цифры учитывают то, что хранится в локальном хранилище, поэтому для чата, проводимого только с момента установления связи, они являются нижней границей.

## Сообщения о попадании

`--newest` упорядочивает по времени, а не по релевантности, а `--context 2` показывает два сообщения до и после каждого найденного (2 в терминале, 0 в противном случае по умолчанию).`--thread` показывает цепочку ответов и ответы вокруг каждого обращения, а не его соседей во времени. Он следует по ссылкам ответа, сохраненным в локальном хранилище, а в `messages context` тоже вовремя заменяет соседей. По умолчанию — 8 ссылок из хита, 50 сообщений, 65 536 байт и один день с каждой стороны; измените их на `--thread-hops`, `--thread-messages`, `--thread-bytes` и `--thread-within`. Без сохраненных ссылок он вовремя возвращается к соседям.

## Результаты в формате JSON

На терминале `wa` печатает читаемую расшифровку. `--json` возвращает один объект с сообщениями и тем, что было найдено; `--jsonl` передает только сообщения, по одному на строку. Поля ответа находятся в [справке по языку запроса](./query-language.md#the-answer).

## Когда ничего не найдено

Пустой ответ означает «нет в локальном хранилище», а не «никогда не отправлялось». Проверьте, что хранится с помощью `wa personal store status`. При использовании `--json` в ответе указывается, в каких чатах производился поиск, даже если ничего не найдено. Если `wa` запрашивает `wa personal store migrate`, индекс слов все еще строится; поиск без слов (`date:today`, `kind:group`) уже работает.

Сообщение, полученное до подключения устройства, которое телефон не отправил, отсутствует в локальном хранилище. `messages sync` запрашивает на телефоне старые сообщения чата ([старая история](./archive.md#older-history-from-your-phone)); в противном случае ищите его по телефону.

## Далее

- [Язык запроса](./query-language.md): каждое поле, оператор, ограничение и ответ в формате JSON.
- [Локальная база данных](./archive.md): что она содержит и как поддерживать ее в актуальном состоянии.
- [Как работает поиск](https://wirecat.dev/en/docs/search-architecture): техническая страница — указатель слов, график разговоров и ранжирование результатов.
