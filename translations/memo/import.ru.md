---
title: "Импорт файлов и записей"
---

Эта страница поможет добавить в Memo данные, которые не синхронизирует ни один инструмент WireCat: папку текстовых
файлов, расшифровки или записи, которые пишет ваш собственный небольшой скрипт. После импорта их находят
`memo search`, агент через MCP и всё остальное, что читает хранилище Memo, рядом с вашими сообщениями, почтой и
заметками.

```sh
memo import ~/Documents/handbook --account import:handbook --dry-run
memo import ~/Documents/handbook --account import:handbook
memo import crm-notes.jsonl --account import:crm-notes
```

## Аккаунт

Каждый импорт называет аккаунт, которому он принадлежит: `--account <provider>:<account>`. Memo никогда не выбирает
аккаунт за вас: без `--account` ошибка перечисляет аккаунты, в которых уже есть импорт. Новый аккаунт появляется,
когда вы впервые его называете.

- **`import:<name>`** для документов, заметок и выгрузок: `import:handbook`, `import:crm-notes`.
- **`phone:<exchange>`** для расшифровок звонков, рядом со звонками этой АТС: `phone:office-pbx`.

Файлы попадают только к этим двум провайдерам, которыми не владеет ни одна синхронизация. Любой другой аккаунт,
например мессенджера или Drive, импорт отклоняет (`record.provider-not-imported`): им владеет его собственная
синхронизация. Держите по одному аккаунту на источник, тогда `memo search --source import:handbook` найдёт только его
документы.

## Что читает импорт папки

| Файл | Что получается |
|---|---|
| `.txt`, `.text` | Документ, его название это имя файла |
| `.md`, `.markdown` | Документ, его название это первый заголовок после front matter, а если заголовка нет, имя файла |
| `.pdf`, `.docx` | Документ, который читают на этом компьютере те же читатели, что в разделе [Файлы, которые читает Memo](./notes.md#files-memo-can-read). Название берётся из самого файла, иначе это его имя. В отсканированном PDF нет текста, и такой файл пропускается |
| `.vtt`, `.srt` | Расшифровка: одна строка `Name: text` на реплику, как в разделе [Источники, которые вы добавляете сами](./sources.md#add-a-source). Метки времени и говорящие попадают в `metadata.transcript` |
| `.wav`, `.mp3`, `.m4a`, `.ogg`, `.opus`, `.flac` | С `--transcribe` это сказанное в записи, распознанное на этом компьютере ([Записи](#recordings)). Без него запись пропускается |
| `.json`, `.jsonl`, переданный отдельно | Записи, так же как их читает `memo records import` ([Свои интеграции](#custom-integrations)) |

Memo обходит папку и все вложенные папки. Имена, которые начинаются с `.` (`.git`, `.obsidian`), он не трогает.
Каждый другой файл, который не попал в импорт, ответ перечисляет в `skipped` с причиной: для такого типа файлов нет
читателя, файл не в текстовой кодировке UTF-8, файл пустой или это символическая ссылка.

Вместо папки можно передать один файл `.txt` или `.md`. Его документ определяется только по имени файла, поэтому два
файла с одним именем из разных папок станут одним документом. В таком случае импортируйте их папку.

## Записи

```sh
memo import ./recordings --account import:voice-memos --transcribe
```

С `--transcribe` каждую запись распознаёт локальная модель речи `parakeet-v3`, которая понимает 25 языков. Запись
не покидает этот компьютер. Каждый распознанный фрагмент становится строкой текста документа с отметкой, где он
начинается в записи:

```text
[00:00] Depot, good morning.
[01:01] The crane is due Friday.
```

- **Модель не скачивается сама.** Она весит около 670 МБ. Без неё импорт останавливается, ничего не записав, и
  называет команду, которая скачает модель один раз, например `tg models download parakeet-v3`. Все инструменты
  WireCat на этом компьютере пользуются одной копией.
- **Каждая запись распознаётся один раз.** Документ хранит хеш байтов записи. Следующий импорт с `--transcribe`
  находит тот же хеш и снова отправляет сохранённый текст, так что запись не распознаётся заново, а документ остаётся
  `unchanged`. Изменённая запись распознаётся заново.
- `--dry-run` ничего не распознаёт: новые записи он показывает в `skipped`.
- Вся запись считается одним голосом: говорящие не различаются. Запись длиннее часа или та, которую декодер не может
  прочитать, попадает в `skipped`, а остальная папка импортируется.
- MP3, Ogg, Opus и FLAC Memo читает своими декодерами. Для WAV, M4A и других форматов нужен установленный `ffmpeg`.

## Повторяйте когда угодно

- **Та же папка второй раз ничего не меняет.** Каждый файл определяется по своему пути внутри папки, поэтому второй
  запуск отвечает `unchanged` для каждого файла.
- **Изменённый файл обновляет свой документ.** Его текст, название и даты заменяются, а ссылка на документ остаётся
  прежней, поэтому ссылки и факты, которые на него опираются, по-прежнему ведут к нему.
- **Файл, который исчез из папки, остаётся.** Memo не удаляет импортированное, когда файл пропадает. Чтобы убрать
  документ, отправьте для него запись `delete` ([Свои интеграции](#custom-integrations)).
- **Переименованный или перенесённый файл становится новым документом.** Ключ документа это путь.
- **Перенесённая папка один раз обновляет все документы.** Пути внутри неё не меняются, поэтому новых документов не
  появляется, но `url` каждого указывает на новое место.
- Файл, у которого изменилось время изменения, а текст остался прежним, считается `updated`.

`--dry-run` читает все файлы и планирует импорт, ничего не записывая. Пока он работает, хранилище закрыто для записи.
`--json` выводит квитанцию для скрипта.

## Что сохраняется

Каждый файл становится записью `document` с полями:

| Поле | Значение |
|---|---|
| `title` | Первый заголовок Markdown или имя файла без расширения |
| `text` | Текст файла |
| `created_at` | Когда файл был создан, если это сообщает файловая система, иначе время его изменения |
| `updated_at` | Время его изменения |
| `url` | Адрес файла на этом компьютере в виде `file://` |
| `metadata.path` | Его путь внутри папки |
| `metadata.format` | `text`, `markdown`, `pdf`, `docx`, `vtt` или `srt` |
| `metadata.extractor` | Читатель файла PDF или Word и его версия |
| `metadata.transcript` | Для расшифровки: `cues`, `start_seconds`, `end_seconds` и `speakers` |
| `metadata.audio` | Для записи: её длина в `seconds`, модель речи `model` и число фрагментов `pieces` |
| `metadata.sha256` | Хеш байтов файла |
| `metadata.size` | Его размер в байтах |

Квитанция показывает, какой запуск её записал: `source.batchId` называет время импорта, а запуск агента добавляет имя
агента.

## Ограничения

- **10 000 файлов** в одном импорте папки. Дерево побольше отклоняется целиком: импортируйте его папки по одной.
- **32 уровня вложенности.** Более глубокие папки попадают в `skipped`.
- **50 МиБ** на файл, **256 МиБ** на запись. Файл крупнее пропускается.
- **Миллион символов** текста на документ, в пределах 1 МиБ. Более длинный текст обрезается: ответ показывает файл в
  `cut`, а его `metadata.truncated` равно `true`.

## Безопасность

- **Ничего не покидает этот компьютер.** Memo читает файлы там, где они лежат, и пишет только в своё локальное
  хранилище.
- **Ссылки не открываются.** Символическая ссылка внутри папки пропускается, поэтому импорт никогда не читает файл за
  пределами названной вами папки. Сама названная папка может быть ссылкой.
- **Никаких учётных данных.** Файл, в тексте которого есть что-то похожее на учётные данные, например закрытый ключ
  или токен `Bearer`, отклоняется и попадает в `skipped` (`record.secret-field`). Остальные файлы импортируются.
- **Текст это данные.** Memo хранит его и ищет по нему, но ничего из него не выполняет. Агент, который читает
  импортированный документ, читает его как источник, а не как инструкции.
- **Импорт агента записывается на агента.** Если импорт запущен из терминала агента, поле `by` в квитанции называет
  агента. Через MCP агент вообще не может запустить `memo import`: он передаёт записи через `records import`.

## Свои интеграции

Источник, для которого нет инструмента WireCat, попадает в Memo через файл записей. Это **конверт записей**, формат
JSON с номером версии, который читают и `memo import`, и `memo records import`. Скрипт берёт данные из API или
выгрузки источника, пишет конверт и отдаёт его Memo. Знать устройство базы данных Memo для этого не нужно.

Конверт в виде JSONL: первая строка называет версию формата и источник, каждая следующая строка это одна запись.

```jsonl
{"schema_version":1,"source":{"provider":"import","account":"crm-notes","batch_id":"2026-11-13"}}
{"key":"p1","type":"person","external_id":"contact-17","operation":"upsert","fields":{"name":"Ana Example","email":"ana@example.com"}}
{"key":"n1","type":"document","external_id":"note-901","operation":"upsert","fields":{"title":"Delivery call","text":"The crane is due Friday.","created_at":"2026-11-10T09:02:00+01:00","metadata":{"manager":"reception"}},"relations":[{"role":"about","type":"person","external_id":"contact-17"}]}
```

- **`external_id` это id записи в источнике.** Он не должен меняться: один и тот же id означает одну и ту же запись
  при каждом запуске, поэтому повторный запуск скрипта обновит изменившееся и не тронет остальное. Не используйте
  номер строки или время запуска.
- **`operation`** это `upsert` или `delete`, чтобы удалить запись, отправленную раньше.
- **`fields`** содержат данные записи. Ключи, которых тип не знает, сохраняются как есть. В `metadata` можно положить
  всё остальное, что стоит знать.
- **`relations`** связывают записи одного аккаунта или сущность хранилища по `ref`: например, документ `about`
  человека, организацию, сделку или звонок.
- `memo records templates show <type> --format json` выводит пример записи каждого типа. Полный формат, все типы и
  все правила описаны на странице [The records envelope](https://github.com/WireCatLabs/cli-core/blob/main/docs/storage/records-envelope.md).

Проверьте файл, прежде чем записывать, и затем импортируйте его:

```sh
memo import crm-notes.jsonl --account import:crm-notes --dry-run
memo import crm-notes.jsonl --account import:crm-notes
```

### Адаптер источника в 20 строк

Этот скрипт на Node превращает выгрузку заметок из CRM с табуляцией в качестве разделителя (`id`, `date`, e-mail
клиента, `text`) в конверт на stdout. Каждый клиент становится человеком, которого находят по e-mail, каждая заметка
документом об этом человеке. Memo читает конверт из stdin, если вместо файла указать `-`:

```js
// notes-to-envelope.mjs: node notes-to-envelope.mjs notes.tsv | memo import - --account import:crm-notes
import { readFileSync } from "node:fs"

const [, ...rows] = readFileSync(process.argv[2], "utf8").trim().split("\n")
const line = (value) => process.stdout.write(`${JSON.stringify(value)}\n`)
const people = new Set()

line({ schema_version: 1, source: { provider: "import", account: "crm-notes", batch_id: new Date().toISOString() } })
for (const row of rows) {
  const [id, date, email, text] = row.split("\t")
  if (!people.has(email)) {
    people.add(email)
    line({ key: email, type: "person", external_id: email, operation: "upsert", fields: { name: email, email } })
  }
  line({
    key: id, type: "document", external_id: `note-${id}`, operation: "upsert",
    fields: { title: `Note ${id}`, text, created_at: date },
    relations: [{ role: "about", type: "person", external_id: email }],
  })
}
```

Даты должны быть со смещением часового пояса (`2026-11-10T09:00:00+01:00`). Человек находится только по точному
e-mail, никогда по имени. Если такого адреса нет ни у одного контакта, создаётся новый человек.

### Пример: история звонков из Asterisk

АТС [Asterisk](https://www.asterisk.org/) пишет запись о каждом звонке (CDR) в
`/var/log/asterisk/cdr-csv/Master.csv` и умеет записывать звонки через MixMonitor. Этот скрипт делает звонки
доступными для поиска: каждый звонок становится событием `call`, а расшифровка его записи, если она есть, документом
`about` этого звонка. И то, и другое попадает в аккаунт `phone:office-pbx`.

Текст каждой записи скрипт берёт из файла `.txt` рядом с ней, который может написать любая локальная программа
распознавания речи. Используйте либо этот путь, либо
`memo import /var/spool/asterisk/monitor --account phone:office-pbx --transcribe`, но не оба: эта команда тоже
импортирует найденные там файлы `.txt`, и одни и те же слова сохранятся дважды. `memo import --transcribe` создаёт
документ для каждой записи, но не связывает его со звонком.

Превратите CDR в конверт:

```js
// asterisk-cdr.mjs: node asterisk-cdr.mjs Master.csv +01:00 | memo import - --account phone:office-pbx
import { existsSync, readFileSync } from "node:fs"

const [file, offset] = process.argv.slice(2)
const cells = (row) => {
  const out = [""]
  let quoted = false
  for (let i = 0; i < row.length; i++) {
    if (row[i] === '"' && quoted && row[i + 1] === '"') out[out.length - 1] += row[i++]
    else if (row[i] === '"') quoted = !quoted
    else if (row[i] === "," && !quoted) out.push("")
    else out[out.length - 1] += row[i]
  }
  return out
}
const line = (value) => process.stdout.write(`${JSON.stringify(value)}\n`)

line({
  schema_version: 1,
  source: { provider: "phone", account: "office-pbx", batch_id: new Date().toISOString() },
  options: { phone_region: "es" },
})
for (const row of readFileSync(file, "utf8").trim().split("\n")) {
  const c = cells(row)
  const [src, dst, start, seconds, disposition, id, recording] = [c[1], c[2], c[9], c[13], c[14], c[16], c[17]]
  const inbound = dst.length <= 4
  const startedAt = `${start.replace(" ", "T")}${offset}`
  line({
    key: id, type: "event", external_id: id, operation: "upsert",
    fields: {
      kind: "call", phone: inbound ? src : dst, started_at: startedAt, duration: Number(seconds),
      direction: !inbound ? "out" : disposition === "ANSWERED" ? "in" : "missed",
    },
  })
  const transcript = recording && recording.replace(/\.\w+$/, ".txt")
  if (!transcript || !existsSync(transcript)) continue
  line({
    key: `t-${id}`, type: "document", external_id: `transcript-${id}`, operation: "upsert",
    fields: {
      title: `Call ${inbound ? "from" : "to"} ${inbound ? src : dst}`,
      text: readFileSync(transcript, "utf8"),
      created_at: startedAt,
      metadata: { recording, disposition },
    },
    relations: [{ role: "about", type: "event", external_id: id }],
  })
}
```

- **`uniqueid` из CDR это id записи.** Он не меняется, поэтому ночной запуск скрипта обновляет изменившиеся звонки и
  добавляет новые.
- **В CDR нет часового пояса.** Передайте смещение АТС (`+01:00`) или `+00:00`, если в `cdr.conf` задано
  `usegmtime=yes`. Конверт не принимает время без смещения.
- **`phone_region`** читает местные номера без `+` как номера этой страны, поэтому звонок связывается с человеком, у
  которого этот номер есть в контакте.
- Столбцы соответствуют `cdr_csv` с включёнными `loguniqueid` и `loguserfield`: `uniqueid` в столбце 17, а
  `userfield` в столбце 18. Путь к записи скрипт берёт из `userfield`, который заполняет план набора командой
  `Set(CDR(userfield)=${MIXMONITOR_FILENAME})`. Для шаблона `cdr_custom` нужен свой порядок столбцов. Номера из
  четырёх цифр и короче считаются внутренними. Перед первым запуском сверьте столбцы со своим `Master.csv`.
