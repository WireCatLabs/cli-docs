---
title: "Импорт бизнес-данных"
description: "Один формат JSON приносит в хранилище клиентов, сделки, договоры, заказы, счета, платежи, банковские данные, данные телефона и собственные объекты источника, и правила, которые решают, что ждет владельца."
---

У вас есть бизнес-данные в другой системе: ERP, выгрузка из CRM, банковская выписка, таблица или резервная копия
телефона. Вы хотите перенести их в локальное хранилище владельца, чтобы его ИИ-агент отвечал на вопрос «сколько должен
этот клиент, по какому договору и оплачено ли» ссылками, а не догадками. На этой странице есть один формат, которым
пользуется любой импорт, его правила и один полный пример, от файла до ответов агента.

Сначала несколько слов. **Конверт записей** и есть этот формат: документ JSON или JSONL, где каждая строка одна запись.
Каждый элемент в нем это **запись источника**, то, что ваш источник говорит об одной вещи. cli-core превращает запись
источника в **сущность** (человека, сделку, договор) или в **предложение**, то есть деньги, которые учитываются только
после того, как владелец их подтвердит. Подробнее о сущностях и записях источников написано на странице
[основ](./build-concepts.md).

## Для кого эта страница

- Вы делаете инструмент командной строки на WireCat, и в вашем сервисе есть бизнес-записи.
- Вы пишете разовый скрипт, который переносит выгрузку в хранилище.
- Вы ИИ-агент, и вас попросили импортировать файл или найти, что принес импорт.

## Один формат, три способа

Любой импорт читает один и тот же конверт, `schema_version: 1`, описанный в
[JSON Schema](https://github.com/WireCatLabs/cli-core/blob/main/schemas/records-envelope.v1.schema.json).
В хранилище он попадает одним из трех способов:

- **Файл** JSON или JSONL, который читает команда `records import` инструмента memo.
- **Стандартный ввод**: та же команда с `-` вместо имени файла, так другая программа может передать данные по конвейеру.
- **Из вашего кода** через `ingest` или `ingestLines` из `@wirecat/cli-core/services`.

В конверте JSON есть `schema_version`, `source` и `records`. В JSONL первая непустая строка содержит `schema_version`,
`source` и необязательный `options`, а каждая следующая строка это одна запись. JSONL читается построчно и
записывается каждые 1000 записей, поэтому файл любой длины никогда не лежит в памяти целиком.

```json
{
  "schema_version": 1,
  "source": { "provider": "example-erp", "account": "demo", "batch_id": "2026-11-07" },
  "options": { "lines": "products" },
  "records": [
    { "key": "org", "type": "organization", "external_id": "C-1", "operation": "upsert", "revision": 1,
      "fields": { "name": "ООО Пример" }, "relations": [] }
  ]
}
```

- `source.provider` называет вашу систему, а `source.account` аккаунт в ней. Вместе это аккаунт, которому принадлежат
  записи. Записи разных аккаунтов никогда не сопоставляются друг с другом.
- У записи есть `key` (уникальный в файле, на него ссылается квитанция), `type`, собственный id источника в
  `external_id`, `operation` (`upsert` или `delete`), ее `fields` (не больше 64 КиБ), необязательный `revision` и не
  больше 100 `relations`.
- `options.lines` со значением `products` читает `product` в строке как внешний id записи товара. По умолчанию, при
  `text`, в строке счета это просто данные. Строки заказа всегда читают его как товар.
- `options.phone_region`, страна из двух букв, например `GB`, в которой читается телефон человека без `+`.

## Выберите тип

Выбирайте тип в таком порядке:

1. **Тип, который в WireCat уже есть.** Если ваш объект это клиент, сделка, договор или платеж, присылайте его этим
   типом, даже если в вашей системе он называется иначе. Тогда каждый инструмент и каждый агент прочитает его
   одинаково.
2. **`custom:<name>`** для объекта, которого WireCat не знает, например коммерческого предложения, тикета или слота
   доставки. Он хранится так, как вы его прислали, вместе с вложенным JSON и отношениями. Он никогда не становится
   сущностью, и деньги из него никто не читает.
3. **Новая общая сущность** только тогда, когда вопросу владельца нужны свои правила, например сумма, статус или
   правило сопоставления. Это изменение в cli-core, а не таблица в вашем инструменте. Сначала откройте issue в
   [cli-core](https://github.com/WireCatLabs/cli-core/issues).

Неизвестный тип отклоняется с кодом `record.type`. Сам по себе он никогда не превращается в собственную запись, поэтому
опечатка в имени типа видна в квитанции, а не прячется в хранилище. `task` тоже отклоняется, у задач свои правила
источников.

## Типы

Импорт никогда не записывает подтвержденные деньги. Все, что входит в денежные суммы, приходит как предложение, и
подтвердить или отклонить его может только владелец, в списке на проверку memo. Остальное записывается сразу.

| Тип | Чем становится | Предложение |
| --- | --- | --- |
| `person` | человеком, найденным или созданным (см. [сопоставление](#как-сопоставляются-люди-организации-и-проекты)) | нет |
| `organization` | организацией, найденной или созданной | нет |
| `project` | проектом, найденным по ключу или созданным | нет |
| `product` | товаром или услугой с ценой, в каталоге | нет |
| `pipeline` | воронкой продаж с ее `stages` | нет |
| `deal`, `lead` | сделкой или лидом, той же строкой, что пишет синхронизация CRM | нет |
| `contract` | договором с датами, условиями продления и уведомления | да, если у него есть сумма. Без суммы записывается сразу |
| `order` | заказом с его `lines` | да |
| `invoice` | счетом с его `lines` | да |
| `payment` | платежом, его долей в каждом счете, который он `settles`, или возвратом | да |
| `subscription` | подпиской с ее `prices`, которые никогда не перезаписываются | да |
| `wallet` | банковским счетом, картой или наличными | нет. Начальный остаток остается в записи, пока владелец его не задаст |
| `transaction` | одной строкой банковской выписки с ее `splits` | да |
| `message` с `kind: "sms"` | SMS в чате (см. [данные телефона](#данные-телефона-sms-звонки-и-контакты)) | нет |
| `event` с `kind: "call"` | звонком, как событием | нет |
| `custom:<name>` | только записью, сохраненной как прислали | нет |

Известные `fields` каждого типа описаны в схеме. Любой другой ключ хранится как прислали. Деньги это десятичная строка,
например `"10000.00"`, и рядом ее `currency`.

## Отношения

Запись указывает на другие записи через `relations`. У каждого отношения есть `role` и цель:

- **Другая запись того же аккаунта:** `{ "role": "counterparty", "type": "organization", "external_id": "C-1" }`.
- **Сущность, которая уже есть в хранилище**, по типизированной ссылке: `{ "role": "counterparty", "ref": "organization:12" }`.

Какие роли бывают, решает тип. У счета есть `issuer`, `counterparty`, `project`, `contract` и `subscription`. У
платежа есть `payer`, `payee`, `settles` (с `amount`, долей платежа в этом счете) и `refund_of`. У сделки есть
`organization`, `person` и `project`. Роль, которая берется один раз, например `counterparty` счета, отклоняется, если
она указывает на две разные цели (`record.relation-ambiguous`).

- **`as`** говорит, какую часть играет человек или организация, например `"as": "decision-maker"` у `person` сделки
  или `"as": "customer"` у `party` договора. Такое отношение становится деловой связью, о которой сообщает ваш
  аккаунт. Своя связь владельца для той же пары важнее, а удаление записи отзывает связь.
- **Роль, которой нет у типа**, это собственное слово вашего источника, например `quoted-for` или `parent-ticket`. Она
  хранится так, как вы ее прислали, разрешается от записи к записи и ни во что другое не превращается.
- **Цель, которой еще нет**, оставляет запись **ждать**. Платеж по счету, который вы пришлете завтра, ждет и
  записывается, когда счет придет, в этом запуске или в следующем. Квитанция называет недостающую роль.

## Как сопоставляются люди, организации и проекты

Запись человека, организации или проекта связывается с сущностью, которая уже есть в хранилище, только по надежному
идентификатору. Никогда по имени.

| Тип | Надежные идентификаторы |
| --- | --- |
| `person` | `fields.email` и `fields.phone` (одно значение или список) и собственный id контакта в вашем источнике |
| `organization` | `fields.identifiers`: `{ "scheme": "tax-id:ru", "value": "7700000000" }`, со схемой `email`, `domain`, `tax-id:<страна>` или `registration:<страна>` |
| `project` | `fields.key` |

- **Подходит ровно одна сущность:** запись связывается с ней, и импорт ничего к этой сущности не добавляет.
- **Подходят две или больше:** ничего не создается и ничего не связывается. Запись ждет владельца, она есть в квитанции
  под `unmatched` вместе с `candidates`. Какая из них верная, говорит только владелец. Агент может только сообщить
  об этом.
- **Не подходит ничего:** импорт создает новую сущность, отмечает, что ее создал импорт, и дает ей идентификаторы
  записи.

E-mail сравнивается без пробелов по краям и в нижнем регистре. Номер телефона сравнивается в международном виде,
например `+447700900123`. Номер без `+` или `00` читается только с регионом: `options.phone_region` конверта, а без
него настройкой хранилища `phone_countries`, если ровно одна ее страна считает номер верным. Без региона это не
идентификатор. Квитанция показывает его под `ignored` (`record.phone-region`), и запись создает нового человека, а не
находит существующего. Присылайте номера с `+`, когда они у вас есть.

Домен бесплатной почты, например `gmail.com`, отклоняется как `domain` организации (`record.identifier`).

## Ревизии, повторы и удаления

- **Повтор ничего не меняет.** Тот же файл дважды дает `unchanged` для каждой записи. Те же поля и отношения в другом
  порядке считаются той же записью.
- **Ревизии только растут.** Если у записи есть `revision`, каждая следующая версия тоже его присылает. Меньшая
  ревизия или та же ревизия с другим содержимым отклоняется с кодом `record.stale-revision`.
- **Измененная запись** обновляет то, что было записано сразу. Предложение, которое создал импорт, обновляется, пока
  оно ждет владельца. Когда владелец уже решил, изменение только **помечается** в квитанции, а его решение остается.
  Счета помечаются всегда, как в первой версии формата.
- **Удаление мягкое.** `"operation": "delete"` помечает запись как удаленную. Ее сущность остается и попадает в
  `flagged`, чтобы владелец решил, что с ней делать. У собственной записи сущности нет, поэтому ничего не помечается.

## Квитанция и ошибки

`ingest` и `ingestLines` возвращают эту квитанцию. С `--json` команды `records import` и `records check` печатают ее
под `item`, с именами в snake case: `dry_run` и `batch_id`.

| Поле | Что в нем |
| --- | --- |
| `dryRun` | `true`, если ничего не записано |
| `source` | провайдер, аккаунт и `batchId` |
| `created`, `updated`, `unchanged`, `deleted`, `refused` | точные числа |
| `proposed` | созданные или измененные предложения, например `invoice:1` |
| `waiting` | записи без цели: `key`, `pointer`, недостающие роли в `missing` |
| `unmatched` | записи с двумя или больше кандидатами: `key`, `pointer`, `reason`, `candidates` |
| `ignored` | значения, похожие на идентификатор, которые сохранены только как данные: `key`, `pointer`, `reason` |
| `relationships` | деловые связи, о которых сообщает аккаунт: `added`, `kept`, `restored`, `withdrawn`, `proposed` и пропущенные, потому что владелец их отклонил |
| `notices` | записи, принятые не так, как их прислали, например слово связи не из списка ролей (`relationship.role-unlisted`) |
| `flagged` | измененные или удаленные записи, чью сущность не тронули |
| `errors` | отказы: `pointer`, `code`, `message`, `key` |
| `truncated` | `true`, если список остановился на 1000 элементах. Числа при этом точные |

`pointer` это JSON Pointer внутрь конверта, например `/records/0/type`, так ваш инструмент может показать точное
место. Одна плохая запись отклоняется, остальные записываются. Ошибка в самом конверте (`envelope.invalid`,
`envelope.schema-version`, `envelope.account-mismatch`) не пропускает ни одной записи.

Вот квитанция для файла с неизвестным типом и платежом, чей счет еще не пришел:

```json
{
  "dryRun": false,
  "source": { "provider": "example-erp", "account": "demo2", "batchId": "b2" },
  "created": 1,
  "updated": 0,
  "unchanged": 0,
  "deleted": 0,
  "refused": 1,
  "proposed": [],
  "waiting": [{ "key": "p", "pointer": "/records/1/relations", "missing": ["settles"] }],
  "flagged": [],
  "unmatched": [],
  "ignored": [],
  "relationships": { "added": 0, "kept": 0, "restored": 0, "withdrawn": 0, "proposed": 0, "skippedOwnerRejected": 0 },
  "notices": [],
  "errors": [
    {
      "pointer": "/records/0/type",
      "code": "record.type",
      "message": "a type is one of invoice, payment, person, organization, project, order, product, contract, subscription, wallet, transaction, deal, lead, message, event, pipeline or custom:<name>",
      "key": "t"
    }
  ],
  "truncated": false
}
```

**Пробный запуск** проверяет весь файл и ничего не записывает. Его квитанция настоящая, вместе со ссылками между
записями. Он идет одной транзакцией, которая в конце откатывается, поэтому tg, max и memo ждут хранилище, пока он
работает. Настоящий запуск фиксирует каждые 1000 записей. Если он остановится на середине, записи до этого места
останутся, и запустить его снова безопасно.

## Данные телефона: SMS, звонки и контакты

Выгрузка телефона это один конверт одного телефона, JSON или JSONL, который импортируется в один аккаунт, например
`phone:pixel`. Записи, SMS и звонки остаются в этом аккаунте, поэтому группа аккаунтов показывает телефон один раз.

- SMS это `message` с `kind: "sms"`. Оно записывается в отдельный чат для каждой переписки, и поиск читает его как
  сообщения мессенджера.
- Звонок это `event` с `kind: "call"` в собственном календаре `Calls` аккаунта телефона. Он никогда не считается
  занятым временем. `memo events list` показывает его рядом со встречами всех календарных аккаунтов, по умолчанию за
  последние 30 дней и следующие 7. `memo events list event_type:call` оставляет только звонки. Чтобы найти звонок
  по номеру, используйте `memo search all "+447700900123" --only events`.
- Человек на другой стороне это запись `person`, которую присылает источник, одна на номер. На нее указывает
  отношение `counterpart`.

```json
{ "key": "sms-1", "type": "message", "external_id": "sms-1", "operation": "upsert",
  "fields": { "kind": "sms", "direction": "in", "phone": "+447700900123", "name": "Иван Петров",
              "body": "Буду в 10", "sent_at": "2026-11-01T09:12:00+01:00", "read": true },
  "relations": [{ "role": "counterpart", "type": "person", "external_id": "+447700900123" }] }
{ "key": "call-1", "type": "event", "external_id": "call-1", "operation": "upsert",
  "fields": { "kind": "call", "direction": "missed", "phone": "+447700900123", "started_at": "2026-11-01T10:00:00Z",
              "duration": 0 },
  "relations": [{ "role": "counterpart", "type": "person", "external_id": "+447700900123" }] }
```

SMS или звонок связывается с человеком только через эту запись человека. Она сопоставляется как любой человек: один
точный номер связывает, ни одного создает человека, два или больше оставляют SMS или звонок ждать владельца. Запись
без `counterpart` хранит только номер.

Файл контактов в формате vCard (`.vcf`) превращается в такой же конверт. memo импортирует его в аккаунт телефона:

```sh
memo records import contacts.vcf --account phone:pixel --json
```

Из вашего кода `ingestVcard` из `@wirecat/cli-core/services` читает и импортирует его за один вызов, с `region` в
нижнем регистре, например `gb`, для национальных номеров. Без региона национальный номер сохраняется, но не сопоставляется, и об этом говорит список
`vcard` в квитанции.

## Полный пример

Один выдуманный клиент от начала до конца. ERP под названием `example-erp`, аккаунт `demo`, присылает организацию
клиента с ее ИНН, человека с e-mail, который там работает, воронку продаж, сделку, где этот человек принимает решение,
услугу, договор с суммой, заказ на продажу с одной строкой этой услуги, счет по договору, платеж, который его
оплачивает, и коммерческое предложение, объект, которого WireCat не знает, связанное со сделкой.

### Файл

`erp.jsonl`, по одной записи в строке:

```json
{"schema_version": 1, "options": {"lines": "products"}, "source": {"provider": "example-erp", "account": "demo", "batch_id": "2026-11-07"}}
{"key": "org", "type": "organization", "external_id": "C-1", "operation": "upsert", "revision": 1, "fields": {"name": "ООО Пример", "identifiers": [{"scheme": "tax-id:ru", "value": "7700000000"}]}}
{"key": "anna", "type": "person", "external_id": "P-1", "operation": "upsert", "fields": {"name": "Анна Образцова", "email": "anna@example.com"}, "relations": [{"role": "member-of", "type": "organization", "external_id": "C-1"}]}
{"key": "pipe", "type": "pipeline", "external_id": "sales", "operation": "upsert", "fields": {"kind": "deal", "name": "Sales", "stages": [{"external_id": "new", "name": "New", "position": 1, "outcome": "open"}, {"external_id": "won", "name": "Won", "position": 2, "outcome": "won"}]}}
{"key": "deal", "type": "deal", "external_id": "D-7", "operation": "upsert", "fields": {"title": "Rental fleet 2027", "pipeline": "sales", "stage": "new", "amount": "120000.00", "currency": "RUB"}, "relations": [{"role": "organization", "type": "organization", "external_id": "C-1"}, {"role": "person", "type": "person", "external_id": "P-1", "as": "decision-maker"}]}
{"key": "svc", "type": "product", "external_id": "SKU-RENT", "operation": "upsert", "fields": {"kind": "service", "name": "Bike rental, month", "unit": "month", "unit_price": "10000.00", "currency": "RUB"}}
{"key": "contract", "type": "contract", "external_id": "K-2026-14", "operation": "upsert", "fields": {"name": "Rental agreement", "kind": "service", "status": "active", "effective_date": "2026-11-01", "expiration_date": "2027-10-31", "auto_renew": true, "notice_days": 30, "value": "120000.00", "currency": "RUB"}, "relations": [{"role": "party", "type": "organization", "external_id": "C-1", "as": "customer"}, {"role": "deal", "type": "deal", "external_id": "D-7"}]}
{"key": "order", "type": "order", "external_id": "O-55", "operation": "upsert", "fields": {"number": "O-55", "direction": "sale", "purpose": "business", "order_date": "2026-11-02", "currency": "RUB", "lines": [{"product": "SKU-RENT", "quantity": "12", "unit_price": "10000.00"}]}, "relations": [{"role": "customer", "type": "organization", "external_id": "C-1"}, {"role": "contract", "type": "contract", "external_id": "K-2026-14"}]}
{"key": "inv", "type": "invoice", "external_id": "INV-901", "operation": "upsert", "fields": {"direction": "receivable", "number": "901", "currency": "RUB", "issue_date": "2026-11-03", "due_date": "2026-11-17", "lines": [{"product": "SKU-RENT", "description": "Rental, November", "quantity": "1", "unit_price": "10000.00", "amount": "10000.00"}]}, "relations": [{"role": "counterparty", "type": "organization", "external_id": "C-1"}, {"role": "contract", "type": "contract", "external_id": "K-2026-14"}]}
{"key": "pay", "type": "payment", "external_id": "PAY-3", "operation": "upsert", "fields": {"direction": "in", "amount": "10000.00", "currency": "RUB", "date": "2026-11-05"}, "relations": [{"role": "payer", "type": "organization", "external_id": "C-1"}, {"role": "settles", "type": "invoice", "external_id": "INV-901", "amount": "10000.00"}]}
{"key": "quote", "type": "custom:quote", "external_id": "Q-7", "operation": "upsert", "fields": {"valid_until": "2026-11-30", "options": [{"bikes": 12, "insurance": {"kind": "full"}}]}, "relations": [{"role": "quoted-for", "type": "deal", "external_id": "D-7"}]}
```

Тот же файл входит в cli-core как `@wirecat/cli-core/schemas/examples/records-business.jsonl`.

### Импорт глазами разработчика

Сначала проверьте файл, потом импортируйте его. `--account` называет источник как `<provider>:<account>`:

```sh
memo records check erp.jsonl --account example-erp:demo --json
memo records import erp.jsonl --account example-erp:demo --json
```

Квитанция первого импорта:

```json
{
  "item": {
    "dry_run": false,
    "source": { "provider": "example-erp", "account": "demo", "batch_id": "2026-11-07" },
    "created": 10,
    "updated": 0,
    "unchanged": 0,
    "deleted": 0,
    "refused": 0,
    "proposed": ["contract:1", "order:1", "invoice:1", "payment:1"],
    "waiting": [],
    "flagged": [],
    "unmatched": [],
    "ignored": [],
    "relationships": {
      "added": 3, "kept": 0, "restored": 0, "withdrawn": 0, "proposed": 0, "skipped_owner_rejected": 0
    },
    "notices": [],
    "errors": [],
    "truncated": false
  },
  "meta": { "run_id": "20261109T131039Z-process-5827f3", "duration_ms": 85, "complete": true }
}
```

Что произошло:

- Организация и Анна созданы, потому что в хранилище не было ни этого ИНН, ни этого e-mail.
- Воронка, сделка и услуга записаны.
- Договор, заказ, счет и платеж стали предложениями, и платеж распределен на счет.
- Коммерческое предложение хранится как запись, и его отношение `quoted-for` указывает на запись сделки.
- Место Анны в организации, ее роль в сделке и покупатель по договору стали тремя деловыми связями, о которых
  сообщает `example-erp:demo` (`relationships.added: 3`).

Запустите тот же импорт снова, и каждая запись будет `unchanged`: `created: 0`, `unchanged: 10`, `proposed: []` и
`relationships.kept: 3`.

### Импорт из вашего инструмента командной строки

Ваш инструмент может прислать те же записи без memo. Откройте хранилище, передайте строки и покажите квитанцию:

```ts
import { createReadStream } from "node:fs"
import { ingestLines, jsonlLines } from "@wirecat/cli-core/services"
import { openStore } from "@wirecat/cli-core/store"

const store = await openStore()
const input = process.argv[2] === "-" ? process.stdin : createReadStream(process.argv[2])
const receipt = await ingestLines(store, jsonlLines(input), {
  account: "demo",
  onIssue: (error) => console.error(error.pointer, error.code, error.message),
})
console.log(JSON.stringify(receipt))
```

- `account` это `source.account` конверта. Другое значение отклоняется с кодом `envelope.account-mismatch`.
- `onIssue` получает каждый отказ сразу, в том числе те, что не попали в первые 1000 квитанции.
- `dryRun: true` проверяет и ничего не записывает. `chunk` меняет число записей в транзакции, по умолчанию 1000.
- Для конверта, который у вас уже есть одним объектом JSON, вызовите `ingest(store, envelope, { account })`.

### Что видит агент

Агенту не нужно знать вашу ERP. Он спрашивает memo. Сначала что ждет владельца, потом сделку, договор, собственную
запись и поиск по бизнес-записям:

```sh
memo review list kind:invoice,payment,order,contract --json
memo organizations context organization:1
memo deals show deal:1 --json
memo contracts show contract:1 --json
memo relationships list 'about:"contract:1"'
memo orders show order:1 --json
memo invoices show invoice:1 --json
memo records list type:custom:quote --account example-erp:demo --json
memo records show custom:quote:Q-7 --account example-erp:demo --json
memo search all "Rental agreement" --only business --json
```

- `organizations context` дает организацию с Анной среди ее людей, `member-of` от `example-erp:demo`, и ее
  открытую сделку, счет, платеж и заказ.
- `review list` показывает четыре предложения. Владелец их подтверждает, и только после этого они входят в суммы.
- `deals show` дает сделку с организацией, Анной, которая принимает решение, и записями источников, среди них
  коммерческое предложение.
- `contracts show` дает даты, сумму, срок уведомления (1 октября 2027 года, за 30 дней до 31 октября) и сделку, которую договор
  закрыл.
- `relationships list 'about:"contract:1"'` дает сторону договора: ООО Пример как `customer`, от
  `example-erp:demo`.
- `records show` дает поля коммерческого предложения такими, какими их прислали, вместе с вложенным JSON, и его
  отношение к сделке.
- `search all --only business` ищет по названиям счетов, платежей, заказов, договоров, подписок, товаров и кошельков.
  Каждый результат называет источник, откуда он пришел. Банковских операций и собственных записей там нет, их
  находят через `transactions list` и `records list`.

## Дальше

Чтобы приносить данные целого сервиса по расписанию, со входом и синхронизацией, следуйте шагам
[Добавить источник](./build-concepts.md#добавить-источник).
