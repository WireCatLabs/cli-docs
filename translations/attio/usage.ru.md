---
title: "Работа с инструментом"
---

Найдите сделку, посмотрите воронку или что поменялось за ночь одной короткой командой, той же, которую запускает ваш
агент. API Attio говорит на языке id записей, slug атрибутов и id статусов, а `attio` вместо них принимает названия
этапов и обычные слова.

Сделки на этапе, победы недели или почту человека вы находите одной строкой. Агент делает то же самое по вашей
просьбе.

Каждая команда начинается с профиля, то есть имени, которое вы дали входу в одно пространство. `sync` копирует ваши
сделки и людей и компании, которые в них названы, в локальное хранилище WireCat, и команды сделок читают их оттуда.
Нужен профиль, в который вы вошли: его настраивает [установка](./installation.md).

**На этой странице:**

1. [Сначала профиль](#the-profile-comes-first)
2. [Синхронизация](#sync)
3. [Сделки](#deals)
4. [Воронка](#the-pipeline)
5. [Что поменялось](#what-changed)
6. [Люди, компании и участники](#people-companies-and-members)
7. [Ваши собственные атрибуты](#your-own-attributes)
8. [Поиск по всему](#search-everything)
9. [API Attio](#the-attio-api)
10. [Вывод для скриптов](#output-for-scripts)
11. [Агенты](#agents)

## Сначала профиль

Профиль это имя, которое вы выбираете для одного пространства. Это первое слово каждой команды, которой нужен
аккаунт:

```sh
attio work config show
```

`WCATTIO_PROFILE=work` делает то же самое для одного сеанса оболочки. Профиль никогда не подставляется сам, даже
единственный: команда без него останавливается с кодом выхода 2 и показывает профили на этом компьютере. Два
пространства это два профиля, у каждого свой токен.

## Синхронизация

Сделки, воронка и ее этапы читаются из локального хранилища WireCat, того, по которому ищет каждый инструмент
WireCat. `sync` его обновляет:

```sh
attio work sync                # every deal and the people and companies it names, again
attio work sync --rescan       # start over, dropping a sync that stopped half way
attio work store status        # how far each kind is, and how many are stored
```

Attio не умеет отдавать только записи, которые поменялись с какого-то момента, поэтому каждая синхронизация заново
читает каждую сделку, а потом людей и компании из них. Синхронизация останавливается до своего срока или до `--max-pages`, а следующая
продолжает с этого места. Записи, удаленные в Attio, уходят из копии.

Каждая запись хранит только текущие значения. Attio хранит историю каждого атрибута, а замененное значение не
копируется.

## Сделки

```sh
attio work deals list status:open                 # open, won or lost
attio work deals list stage:"In Progress"
attio work deals list "created>=30d"              # made in the last 30 days
attio work deals show deal:12                     # by the ref a list prints
attio work deals list status:open --format csv > deals.csv
```

Сделка отдает свой `stage`, `status`, `amount` с его `currency`, свою компанию, своих людей, ответственного и ссылку
на сделку в Attio. `--offline` читает то же самое без запроса в Attio. Список показывает сначала самые новые:
`--limit` и `--page` это меняют. Поля, по которым список умеет фильтровать, есть в его справке:
`attio help deals list`.

В Attio одна воронка сделок. Ее этапы это статусы атрибута сделки **Stage**, в порядке Attio:

- **Выиграна** сделка на этапе, который Attio празднует, когда сделка до него доходит, или на этапе со словом "won"
  в названии.
- **Проиграна** сделка на этапе со словом "lost" в названии, как в новом пространстве Attio.
- Любой другой этап открытый.

Если вы переименовали этап проигрыша во что-то другое, его сделки считаются открытыми. Оставьте слово "Lost" в его
названии.

### Заметки и задачи сделки

С включенной настройкой `activities` каждая синхронизация копирует и заметки и задачи вашего пространства, которые
привязаны к сохраненным сделкам, людям и компаниям. `deals show` показывает их, открытые задачи первыми, а `search all`
находит сделку по словам из ее заметок. Ключ настройки называет пространство по его id, тому `id`, который печатает
`session status --check --json`:

```sh
attio work config set crm.attio:<workspace id>.activities on
attio work sync
attio work deals show deal:12
```

Настройка выключена, пока вы ее не включите, и включить ее можете только вы: агенту откажут. В заметках и задачах
лежит то, что писали и говорили клиенты. Attio не умеет отдавать только заметки, измененные с какого-то времени,
поэтому каждая синхронизация читает их все заново, и заметка или задача, удаленная в Attio, уходит из копии. Токену
нужны еще два права, `note:read` и `task:read`. Без одного из них синхронизация копирует остальное, ничего не удаляет
и говорит, какой список не смогла прочитать.

`activities list` показывает их из копии, открытые задачи первыми. `activities create` добавляет заметку или задачу
к сделке, человеку или компании, а `activities close` отмечает задачу выполненной. Каждая из них сначала спрашивает,
как и любое изменение:

```sh
attio work activities list status:open
attio work activities create comment --subject deal:12 --text "Called, they want the offer by Friday"
attio work activities create task --subject deal:12 --title "Send the offer" --due 2026-12-04T10:00:00Z
attio work activities close task:3f6c0c2e-0000-4000-8000-000000000000
```

`--subject` принимает ссылку, которую дает `deals show` (`deal:12`, `person:3`), или `person:crm:<id>` по id в
Attio. Заметка в Attio привязана к одной записи, поэтому у заметки один `--subject`, а у задачи их может быть
несколько. Задача без `--owner` ни на кого не назначена. Attio хранит задачу одним текстом, поэтому `--text` идет под
ее названием. Чтобы добавлять их, токену нужны еще два права, `note:read-write` и `task:read-write`.

## Воронка

```sh
attio work pipelines show                       # each stage: how many, their sum per currency, how many went on
attio work pipelines show --since-time 30d      # only the deals made in the last 30 days, with the win rate
attio work stages list                          # each stage with its outcome and how many are open in it
```

Воронка называется `Deals`. Суммы считаются отдельно для каждой валюты и никогда не конвертируются.

## Что поменялось

`changes list` показывает, какие изменения в копии увидели синхронизации: созданные, перемещенные, выигранные,
проигранные и переданные другому ответственному сделки, сначала самые новые. Команда читает последний день, если
`at:` не говорит другое.

```sh
attio work changes list "at>=1d"
attio work changes list change:won "at>=7d" --json
attio work changes list "at>=1d" --format report     # the window as a short morning digest
```

Изменение видит только синхронизация, поэтому сначала запустите `sync`.

## Люди, компании и участники

Люди, компании и участники пространства каждый раз читаются из Attio, поэтому им нужен интернет, а `--offline` их
отклоняет. Слова после `list` ищут в Attio: людей по имени или почте, компании по названию.

```sh
attio work people list anna                       # people whose name or e-mail holds "anna"
attio work people show "Anna Example"             # one person by exact name or id, with e-mails and phones
attio work organizations list example             # companies whose name holds "example"
attio work organizations list --format csv > companies.csv
attio work users list                             # your workspace members, the owners of deals
```

Живой список принимает только слова, а не условия `field:value`. Без слов он показывает всех, сначала самых новых.
Человек или компания отдает собственные атрибуты вашего пространства в `provider_metadata`.

## Ваши собственные атрибуты

```sh
attio work fields list deals
attio work fields list people --json
```

`fields list` показывает атрибуты, которые ваше пространство добавило к сделкам, людям или компаниям
(`organizations`), с их типом, так, как их сохранила последняя `sync`. Варианты атрибута-списка пока не
показываются. Собственные атрибуты Attio не показываются.

## Поиск по всему

```sh
attio work search all "Example LLC"
attio work search all renewal --only crm
```

`search all` ищет сделки в копии по словам из их названия, компании и людей, а также сообщения, заметки, события
календаря и встречи, которые другие инструменты WireCat сохранили на этом компьютере. Лучшее совпадение идет первым.

После `attio work sync --embed` он находит сделку и по смыслу ее заметок и задач, другими словами или на другом
языке: «клиент жалуется на сроки» находит сделку, в заметке которой сказано, что запуск сдвинулся. Векторы строятся
на этом компьютере моделью, которая уже скачана. До этого `search all` ищет по словам и говорит об этом. Находится и
латинское имя, набранное кириллицей: `феррара` находит Ferrara.

## API Attio

`attio work api` выполняет любую операцию API Attio, по одной команде на операцию, со своими флагами и справкой. Так
можно достать до того, у чего пока нет своей команды: списков, пользовательских объектов, встреч и другого.

```sh
attio work api list                               # every operation, without calling Attio
attio work api show objects-records-query         # one operation's parameters
attio work api objects-list                       # the objects in your workspace
```

У каждой операции свой ключ разрешения, например `api.notes-create`. Запись проходит только насколько это разрешают
права токена: с тремя правами на чтение из раздела [установка](./installation.md) Attio ее отклоняет. Чтобы держать
любую запись вне досягаемости на этом компьютере, выполните `attio work config set permissions.api readonly`. См.
[разрешения](./permissions.md).

## Вывод для скриптов

Каждая команда, кроме `mcp serve` на stdin и stdout, принимает `--json` и печатает одно значение JSON в stdout.
Ошибки приходят в JSON в stderr, с кодом, по которому можно ветвиться. `--format csv` превращает страницу списка в
таблицу. Коды выхода перечислены в [справочнике команд](./commands.md#exit-codes).

## Агенты

`attio skill install` кладет навык инструмента туда, где его ищут Claude Code, Codex, Gemini CLI и OpenClaw.
`attio skill install --for hermes` еще и добавляет эту папку в настройки Hermes Agent, а простой `skill install`
Hermes не трогает.

Агент с терминалом после этого сам запускает `attio`. Просите обычными словами:

> *"Используй attio. Какие сделки сдвинулись вчера и какие еще открыты на этапе Negotiation?"*
> *"Используй attio. Выгрузи наши открытые сделки в CSV-файл."*
> *"Используй attio. Кто наш контакт в Example LLC и какие сделки у нас с ними?"*

Для Claude Desktop, Cursor, ChatGPT и других приложений, которые не могут запускать команды, `attio work mcp serve`
отдает те же команды по MCP. Сначала закройте записи группы `api`: через MCP запись на уровне `ask` выполняется. См.
[MCP](./mcp.md).
