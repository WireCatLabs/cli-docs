---
title: "История изменений"
---

Новые записи переведены ниже; ранняя история сохранена на исходном английском. Названия команд и ограничения относятся к указанным версиям.

## 0.20.0 — 15.10.2026

### Добавлено

- Подготовка включает заметки и комментарии владельца о явно связанных людях и подтверждённых
  общих проектах через общий сервис cli-core. Ссылки, номера редакций и отдельное покрытие
  сохраняются; контекст встреч и принятые факты имеют приоритет. Импортированные документы,
  почта, сообщения и кандидаты по псевдонимам проекта остаются вне этой выборки.

## 0.19.0 — 15.10.2026

### Изменения — могут нарушить совместимость

- Общие стандарты используют cli-base 0.33.0 и cli-core 0.288.0. `meetings link --source <accounts>`
  заменяет `--target-accounts` для явно разрешённых дополнительных числовых аккаунтов базы при
  поиске человека. Обновите скрипты на `--source`: старого псевдонима нет. Остаток замечаний
  проверки команд уменьшился с 27 до 26 без новых исключений.

### Исправлено

- Документация хранения отражает cli-core 0.286.0 и новее: открытие `wirecat.db` сохраняет старые
  файлы `messages.db` и связанные файлы SQLite. Управление их хранением — отдельное действие.

## 0.18.0 — 15.10.2026

### Добавлено

- Подготовка включает в `knowledge` принятые факты о явно связанных людях и подтверждённых
  общих проектах, включая решения вне встречи. Ссылки, признаки дополнительных строк и ограничения
  размера остаются видимыми; байты в первую очередь получает контекст встреч. Доказательства заново
  не проверяются, заметки, почта и сообщения не запрашиваются. Поведением владеет общий SDK Core.

## 0.17.1 — 15.10.2026

### Исправлено

- Ответы MCP показывают скрытые символы в расшифровках, названиях, именах и заметках, как tg и max:
  символы тегов, управляющие направлением, нулевой ширины, U+FEFF, C1 и другие управляющие символы
  экранируются в тексте и структурированном содержимом всех инструментов, включая ошибки;
  ANSI escape читается как `\x1b`. Размер учитывает экранированный ответ. Описания инструментов и
  инструкции сервера говорят, что чужой текст — данные, а не инструкции. Кириллица, эмодзи и флаги
  сохраняются; CLI `--json` оставляет исходный текст. Core 0.285.0 переводит общую базу на версию 16:
  новые таблицы и триггеры совместимы со старыми инструментами.
- Автономные тесты удаляют временные каталоги файлов после закрытия ресурсов. Текущая и предыдущая
  трассы команд остаются в `coverage`, вместо накопления временных резервных каталогов.

## 0.17.0 — 15.10.2026

### Добавлено

- Подготовка включает цитируемые сохранённые встречи из других серий по существующим связям
  с людьми или подтверждённым общим проектам. Временное окно выбранного аккаунта, отдельное
  покрытие связанных строк и общий бюджет JSON ограничивают сводку. Контекст выбранной серии
  имеет приоритет; имена и слова расшифровки не создают связи. CLI и дополнительный MCP используют
  общую службу Core.

## 0.16.0 — 15.10.2026

### Изменено — может нарушить работу вызывающих программ

- Флаги следуют общим именам cli-base: `recordings download`, `recordings sync` и
  `recordings schedule create` принимают `--output-dir <dir>` вместо `--destination`, а `watch` —
  `--pause` вместо `--interval`. Старые имена удалены. Имена значений также общие: `--at <hh:mm>`,
  `--max-entries <n>`, `--models-dir <dir>`, `--start-time <time>`, `--title <title>`.

## 0.15.0 — 15.10.2026

### Изменено — может нарушить работу вызывающих программ

- Вложенные селекторы JSON используют проектор Base. Точечные пути проходят через объекты и массивы,
  сохраняя покрытие, страницы и метаданные выполнения. Результат поиска встречи включает название,
  дату и ссылку на источник, чтобы цитировать без отдельного чтения деталей. Компактный выбор
  фрагментов и встроенные инструкции агенту используют те же правила.
- JSON настроек использует snake_case без автоматического переписывания, а запуск больше не
  переносит папки. Перед обновлением переименуйте старые поля и явно выберите актуальные папки.
  Псевдоним команды `zoom.clientId` по-прежнему записывает `client_id`.

## 0.14.0 — 15.10.2026

### Изменено — может нарушить работу вызывающих программ

- `recordings download` и `recordings sync` требуют выбранный профиль. Архив принадлежит его аккаунту; без `account.profile` возвращается `configuration_error`. В SDK обязателен `DownloadOptions.account`, а `syncRecordingArchive` принимает службу с `catalog`.
- `ZoomError` удалён из SDK: ошибки используют `CliError` из cli-base. Возможности `StoreConnection` обязательны; `StoreConnectRequest.capability` и `StoreConnection.appendTranscripts` удалены. `ProgramDeps` больше не принимает отдельные подмены возможностей; `createStoreConnector` принимает полное хранилище cli-core.
- Терминал печатает элементы ответа через общий обработчик cli-core; следующие шаги идут в stderr. Форматы JSON и JSONL сохраняются.
- `--json=id,title` заменяет `--fields`: общий стандарт `--json [fields]` обрабатывается через `liftJson`, как в tg, max, drive и memo. Поля доступны с `--json`, но не с `--jsonl`; неизвестное поле отклоняется со списком допустимых. Используется Core 0.280.0.
- `zm search recordings <directory> <query>` заменяет `zm search meetings <query> --archive <directory>`. Поиск архива теперь возвращает совпадения `search all`: `ref` (`recording:<file id>/<cue position>`), `title`, `timestamp`, `excerpt`, `sender_name`, `offset_ms`; `account` — папка архива. Работает `--json=ref,excerpt`. Параметры `--archive`, `--uuid`, `--file-ids` и `--max-bytes` удалены из `search meetings`; новая команда принимает только `--limit`. Для одной встречи, файла или расшифровки больше 8 МиБ используйте `recordings archive transcript`.
- Настройки файла используют snake_case: `client_id`, `files_folder`, `files_timezone`, `account_profile`. Документированная команда — `zm config set zoom.client_id`; прежний вариант `zm config set zoom.clientId` всё ещё принимается. Старый файл при чтении переписывается в snake_case с сохранением режима доступа. Противоречащие друг другу значения двух написаний отклоняются.

### Добавлено

- `meetings prepare <series-id>` читает подтверждение предстоящего времени выбранной серии и ограниченную сохранённую историю: расшифровки с цитатами, наблюдаемых участников, подтверждённые проекты, принятые факты и задачи с прямыми источниками. Покрытие и ссылки сохраняются вместе; найденные сведения не принимаются. `serve --mcp --meeting-preparation` включает дополнительный `meeting_prepare`.
- SDK предоставляет `createZoomUpcomingMeetingReader`: ограниченные сведения Zoom преобразуются в общий формат подтверждения времени; отсутствующее расписание и неполное покрытие повторений остаются неподтверждёнными. Его использует общий сценарий подготовки.

### Исправлено

- Идентификаторы удалённых встреч с переводом строки на конце отклоняются до аутентификации.
- Загрузка сама забирает блокировку, оставленную завершившимся процессом на этом компьютере, без `recordings archive recover --yes`. Активные, чужие и неизвестные блокировки по-прежнему отклоняются.
- Повторная загрузка не хеширует заново каждый файл: прежние размер и время изменения из `.zoom-verified.json` позволяют использовать последнюю проверку. При изменении файл хешируется снова; `recordings archive check` всегда проверяет все файлы.

## 0.13.0 — 14.10.2026

### Изменено — может нарушить работу вызывающих программ

- Переход на cli-base 0.28 и общую политику ответов Core 0.273. Список команд использует контракт 3
  с отдельным описанием локальных и удалённых эффектов. Списки JSON содержат режим страницы и
  `next_cursor`; JSONL выдаёт записи item и end, в том числе для пустого результата. Скрипты,
  читавшие полный ответ на каждой строке, должны читать `data` и итоговую страницу/полноту.
- Успешные ответы CLI/MCP содержат полные метаданные. Пропущенные источники поиска явно снижают
  полноту и добавляют ошибки источников. Общие политики проверяют доступные следующие шаги
  и безопасность повтора.

## 0.12.0 — 14.10.2026

### Добавлено

- Источники по существующему названию, ключу и псевдонимам проекта через общие `meetings projects evidence` и MCP `meeting_project_evidence`. Чтение сохраняет ссылки на источники, продолжение с фиксированным аккаунтом и датами, явное неизвестное покрытие; индекс не обновляется и принадлежность не подтверждается.

### Исправлено

- Руководства поиска/MCP указывают продолжение отчётов внутри `item` и не показывают удалённое поле отбора словесного поиска.

## 0.11.0 — 14.10.2026

### Изменено — может нарушить скрипты

- Используется общий SDK `@wirecat/cli-core` 0.268.0. Список команд объявляет контракт 2. Успешные ответы CLI/MCP имеют оболочки элемента/списка snake_case с метаданными выполнения; JSONL сохраняет полные ответы. Подробные отчёты и потоковые подтверждения находятся в `item`.
- Сведения о встрече находятся в `item` и учитывают текущие расшифровки; чтение расшифровок/резюме возвращает `items`. Словесные совпадения содержат ссылки `ref`, `meeting`, фрагмент `excerpt` и `offset_ms`, со стандартным продолжением в том же отборе.

### Исправлено

- MCP отклоняет неизвестные/неверные аргументы в обработчике, называет поле до открытия хранилища, объявляет строгие схемы успеха/ошибки и сохраняет общие причины/сведения ошибок.
- Руководство приложения Zoom начинается со ссылок на использование существующего приложения и создание своего.
- Установка предлагает настройку с агентом, существующее/новое приложение Zoom, запуск команд Windows и проверку первого фрагмента с источником. Вводная страница обозначена как начало работы.

## 0.10.0 — 14.10.2026

### Изменено — может нарушить скрипты

- Используются общий SDK встреч `@wirecat/cli-core` 0.267.0 и основа CLI `@wirecat/cli-base` 0.27.2.
- Списки сохранённых встреч отбираются запросом метаданных вместо параметров списка `--since-time` и `--until-time`. Общая сущность встречи содержит строковые ID и сведения о провайдере и аккаунте; `page` и шаги указывают продолжение. JSONL сохраняет весь ответ списка.
- Поиск участников возвращает ограниченные наблюдения snake_case с `identity_id`, неоднозначностью на текущей странице и явным покрытием чтения. JSONL сохраняет продолжение вместо передачи отдельных записей. Следуйте `page.next` или `page.cursor`, даже если страница пуста.

### Добавлено

- `meetings people` и MCP `meeting_people` ограничивают совпадения, просмотренные наблюдения и прочитанные байты имён и адресов через `--limit`, `--scan-limit`, `--max-read-bytes` и `--cursor` (аргументы MCP — snake_case). Курсор привязан к аккаунту и запросу имени; связи с человеком автоматически не создаются.

### Исправлено

- Старые ссылки на настройку первой синхронизации, поиск сохранённых встреч и явную подготовку векторов продолжают работать после переименования команд.

## 0.9.0 — 14.10.2026

### Изменено — может нарушить скрипты

- **Используются `@wirecat/cli-core` 0.264.0** (новое имя cli-messaging) **и `@wirecat/cli-base` 0.27.1.**
- **Все ключи, которые выводит сам zm, используют snake_case**, в stdout и его результатах MCP:
  `config show` (`account_profile`, `client_id`, `files_folder`, `files_timezone`), `doctor` и `session status`
  (`data_profile`, `expires_at`), `session start` (`logged_in`), записи, архивы и задания
  (`manifest_path`, `timer_state`, `checkpoint_revision`, `job.capture.client_id`),
  `meetings update|link|transcribe|evidence|context`, `search meetings`, `search all` и `watch`
  (`has_more`, `next_cursor`, `meeting_id`, `transcript_rows`). `--fields` принимает эти имена.
  `commands --json` содержит `global_options`, `inherited_options`, `exit_codes`; его `contract` равен 1.
  Команды из cli-core (`meetings list|show|transcript|summary|export|people`) сохраняют прежние ключи,
  пока их не изменит cli-core.
- **`search all --meeting-cursor` и аргумент `meeting_cursor` инструмента MCP `search_all` принимают
  курсор snake_case**, который возвращает `meetings.next_cursor`
  (`account_id`, `query`, `meeting_offset`, `hit_offset`).
- **В терминале ошибка выводится одной строкой** (`✗ message`); в канале или при `--json`/`--jsonl` —
  объектом JSON. Сбой запуска — `internal_error` с кодом 1, а не `configuration_error`.
- **Источник `watch` задаётся первым аргументом вместо `--source`:** `zm watch api` или
  `zm watch files [folder]`. Без аргументов действует настройка `source`.
  Одна папка (`zm watch ./downloads`) теперь вызывает ошибку; используйте `zm watch files ./downloads`.

### Добавлено

- `meetings passage <ref>` открывает строку результата поиска и соседние реплики с источниками в тексте,
  Markdown или JSON. `--before-n`, `--after-n`, пределы байтов и сведения о покрытии ограничивают ответ;
  сохранённые версии и необязательная проверка отпечатка сохраняют связь с источником.
  MCP предоставляет тот же привязанный к аккаунту `meeting_passage` при `--meeting-context`.
- **`--debug`:** при ошибке выводится полная диагностическая запись с причиной и стеком — после объекта
  ошибки или вместо короткой строки.

### Исправлено

- README различает Public Client ID и Client Secret, объясняет ручное добавление разрешений и
  необязательный манифест, использует текущую команду входа и адрес документации. Описание покрытия
  различает доступные записи базы и отдельно скачанные расшифровки.
- Руководство по безопасности объясняет автоматическую индексацию и создание недостающих векторов,
  включая передачу расшифровок явно выбранному удалённому сервису.
- Руководство MCP перечисляет семь стандартных инструментов после объединения поиска; руководство
  управления встречами уточняет, что разрешение списка добавляется вручную.
- Поиск различает генерацию недостающих векторов CLI и чтение существующих векторов MCP;
  руководства используют `session start` для входа и `--cursor` для продолжения чтения источников.

- **`zm meetings import <folder>` и файловый источник читают папку по одной расшифровке.** Раньше все `.vtt` открывались одновременно. Файл более 10 МиБ — существующего предела скачивания расшифровок — отклоняется до чтения. Папка с более чем 10 000 расшифровок отклоняется с просьбой перенести часть в другую папку.

## 0.8.0 — 13.10.2026

### Изменено — может нарушить скрипты

- **Runs on `@wirecat/cli-messaging` 0.258.0 and `@wirecat/cli-base` 0.24.0.**
- **The shared store and models move to the WireCat folder** (`~/.local/share/WireCat/` on Linux and macOS,
  `%LOCALAPPDATA%\WireCat\Data\` on Windows) on the first start of zm, as tg, max and memo do. Nothing moves when
  `MESSAGING_STORE` or `WIRECAT_STATE_DIR` is set. Two different stores under the same name stop the command with
  an error naming both paths; nothing is changed.
- **Meeting ingestion moves under `meetings`.** The old names stop working:
  - `zm pull` → `zm meetings sync`, with `--since` → `--since-time`
  - `zm import <folder>` → `zm meetings import <folder>`
  - `meetings list --since`/`--until` → `--since-time`/`--until-time`
- **One error object:** `{ error: { code, reason, message, … } }` on stderr and in MCP results. A failure that is
  not a typed error is `internal_error` (exit 1) and replaces `generic_failure`, also in `commands --json`
  `exitCodes`.
- **`zm commands --json` prints the shared commands document**: `cli`, `version`, `contract`, `description`,
  `globalOptions` (was `options`), `commands` and `exitCodes`; a command path adds `scope` and `inheritedOptions`.
- `zm commands` without `--json` lists one row per command: usage, description and whether it writes.
- **Commands renamed to the shared command words.** The old names stop working:
  - `zm login` → `zm session start`
  - `meetings link-person` → `meetings link`; `meetings link-event` → `meetings update`
  - `recordings archive inspect` → `recordings archive show`; `recordings archive verify` → `recordings archive check`
- **Options renamed.** The old names stop working:
  - `recordings list|sync --from`/`--to` → `--since-time`/`--until-time`; `recordings sync --recheck-from` →
    `--recheck-since-time`; `recordings schedule create --from` → `--since-time`
  - `watch --since` and `meetings context --since` → `--since-time`
  - `meetings evidence --after` → `--cursor`
  - `meetings task-proposal --kind` → `--type`
  - `remote-meetings create|update --topic` → `--title`
- **One meeting search, `zm search meetings <query>`, that indexes on its own.** It replaces four commands, which
  stop working:
  - `meetings search` and `meetings search-page`: their filters all move over, including `--event-id` and
    `--series-id`; `--since`/`--until` are `--since-time`/`--until-time` and `--after` is `--cursor`.
  - `meetings search-index`: gone. The search indexes what was stored since the last search before it reads.
  - `meetings semantic`: `search meetings <query> --model <model>` (with `--base-url`, `--dims`,
    `--max-chunks`, `--max-rows`, `--max-text-bytes`; `--after-chunk-id` is `--cursor`). It first builds the
    vectors that are missing for that model.
  - `recordings archive search <directory> <query>`: `search meetings <query> --archive <directory>` (with
    `--uuid`, `--file-ids`, `--max-bytes`).
  - MCP: `meetings_search`, `meeting_search_page` and `meeting_semantic_search` are one tool,
    `search_meetings`. With `serve --semantic`, `by_meaning: true` ranks existing vectors; MCP never builds
    them.
- Value names in help now say what they hold: `--limit <n>`, `--model <model>`, `--max-read-bytes <bytes>`,
  `--max-text-bytes <bytes>`; every argument has a description and long summaries are shorter.

## 0.7.3 — 12.10.2026

### Добавлено

- `meetings search-page` совмещает даты с `--identity-id`, `--person-id`, `--project`, `--tag` или `--topic`. Имена, ключи и явные псевдонимы проектов разрешаются через общий словарь; нужна подтверждённая принадлежность проекту и явно прикреплённые к встрече метки. Фильтры участников выбирают встречи, но не определяют автора реплики.
- MCP только для чтения `meeting_search_page` предоставляет тот же ограниченный поиск в аккаунте, выбранном сервером.

### Исправлено

- Общая регистрация и проверка поиска больше не дублируются в Zoom: ими, выбором основных имён и обработчиком MCP владеет cli-messaging для повторного использования другими провайдерами встреч.
- Vitest передаёт опубликованную конфигурацию компилятора cli-base напрямую Oxc; TypeScript продолжает проверять полную конфигурацию проекта.

## 0.7.2 — 12.10.2026

### Исправлено

- **Собрано на общем фреймворке с новым именем `@wirecat/cli-base` 0.21.0** и `@wirecat/cli-messaging` 0.253.0. Фреймворк переименован из `@wirecat/cli-core`; установка содержит одну его копию. Команды `zm` не изменились.
- Полные инструкции по созданию и повторному использованию приложения, восстановлению браузерного обратного вызова и проверке первого результата; исправлены сведения о разрешениях стартового манифеста и границах аккаунта и данных в руководствах.
- Примеры заметок и фактов встреч используют поддерживаемые команды Memo, включая создание заметок в выбранном аккаунте. План развития разделяет доступные действия и будущую обработку встреч и подготовку к ним. Настройка Zoom содержит один заменяемый пример идентификатора клиента.

## 0.7.1 — 11.10.2026

### Исправлено

- Reuse shared native file-safety and bounded WAV helpers from `cli-messaging` instead of
  maintaining provider-local copies. Archive verification and local transcription keep their
  existing limits and preview behavior.

## 0.7.0 — 11.10.2026

### Изменено — может затронуть вызывающий код

- **Built on `@wirecat/cli-messaging` 0.246.0, which now contains the meetings code.** zm imports
  `@wirecat/cli-messaging/meetings` and no longer depends on `@wirecat/cli-meetings`; commands and data are
  unchanged. A script that imported `@wirecat/cli-meetings` from zm's install folder imports
  `@wirecat/cli-messaging/meetings` instead.

### Добавлено

- **A front-page README** introduces `zm` as Zoom context for AI agents: quick start, scenarios and
  an honest list of what is not ready come first, then a reference by task with links to new `docs/`
  pages for installation, sessions, usage, the archive, search, topic search, MCP, remote meetings,
  configuration, troubleshooting and security, listed in `docs/meta.json`.

## 0.6.0 — 11.10.2026

### Изменено — может затронуть вызывающий код

- **On macOS zm keeps its files where it does on Linux**: `~/.config/zm`, `~/.local/share/zm` and `~/.cache/zm`
  instead of `~/Library/…`. The first run moves the old folders there and copies the saved login to the keyring
  name of the new config folder, so no new `zm login` is needed. If the move cannot happen it prints one warning
  and uses the old folders for that run. Linux and Windows are unchanged. Built on `@wirecat/cli-messaging` 0.241.0 and
  `@wirecat/cli-meetings` 0.4.2, which npm installs side by side with cli-core 0.20.0.

## 0.5.1 — 11.10.2026

### Исправлено

- **Shared facts compatibility** pins the published producer 0.237.0, supplies its required facts
  port to meeting context services, and retains scoped event/person links after the facts migration.
  The update includes the producer's meeting-account purge and attachment-piece fixes.

## 0.5.0 — 11.10.2026

### Добавлено

- **Explicit meeting links** preview or apply event and participant/person associations in the
  shared store. Writes check live account ownership and optional prior values, keep manual identity
  audit and involvement records current, and support deliberate target-account selection.
- **Bounded word search and indexing** page hits inside a large meeting and match literal prefixes
  or configured English/Spanish/Russian word forms. Explicit indexing processes small local batches;
  read coverage reports pending work and unknown completeness.
- **Local WAV transcription** previews media without recognition and uses an already installed
  shared speech model only with explicit `--yes`. PCM16 mono/stereo WAV at 16 or 48 kHz is processed
  in bounded windows, with coarse timestamps and separate media/model provenance. Provider
  transcripts remain intact; reruns retain local history. No model download or large dependency is added.
- **Exact archive import receipts** report transactional created, inserted, replayed and superseded
  counts on the current shared store. Committed receipts survive late cancellation; malformed
  acknowledgements preserve uncertain outcomes and never trigger a second write.
- **Memo integration guidance** uses the existing meeting notes, tags and memory commands and shared
  records, without adding duplicate Zoom knowledge commands.

## 0.4.0 — 11.10.2026

### Добавлено

- **Profile-bound recording resume** retains independently verified partial bytes and resumes only
  with matching strong validators and response ranges. Owned promotion journals recover the gap
  between final publication and manifest commitment without adopting unrelated files.
- **Durable archive progress** saves lease-protected checkpoints, retains unavailable assets for
  retry and supports recent discovery rechecks plus bounded pages/entries. Prior acknowledgements
  do not certify current disk integrity or complete provider availability.
- **Daily archive jobs** preview captured profile/client/destination/runtime settings and install
  Linux systemd user timers only with explicit `--yes`. Jobs use durable sync and recent rechecks;
  changed profile/client configuration fails before credentials. Other platforms support planning
  and manual runs. Disabling preserves job definitions and archived files.
- **Provider-neutral SDK reuse** moves management validation, transfer rules, catalog sync and
  schedule planning into cli-meetings 0.3.0. Public Zoom adapters expose optional shared capabilities;
  authentication, URL trust and native storage remain in this package.

### Изменено — может затронуть вызывающий код

- Configured local profiles enable persistent resume by default. Explicit `--resume` requires a
  profile; `--no-resume` and legacy unscoped calls retain ephemeral transfer behavior.

## 0.3.2 — 11.10.2026

### Исправлено

- Explicit shared mail search finds email stored in dedicated mail tables alongside older imports,
  without duplicate email locators. Mail reads include stored email accounts; message reads use
  the selected local account.

## 0.3.1 — 11.10.2026

### Исправлено

- Package references, documentation and fixtures use the WireCat namespace throughout.

## 0.3.0 — 11.10.2026

### Изменено — может затронуть вызывающий код

- **Shared store security policy** deletes legacy unencrypted `messages.db` and its SQLite sidecars
  on default-path store open, without migration. Explicit paths and `MESSAGING_STORE` preserve the
  files; an active legacy lock defers deletion until a later default-path open.

### Исправлено

- **Offline remote-model checks** refuse remote semantic requests before store or model work.
- **MCP profile selection** stays fixed after its first tool read, including across config edits.
- **Acknowledged embedding receipts** survive late cancellation within a bounded output grace period.
- **Archive file replacement checks** verify the opened object and path before reading bytes,
  including on Windows where no-follow file-open flags are unavailable.

### Добавлено

- **Archive transcript import** verifies every selected VTT before opening the store, then appends
  atomically by occurrence UUID. It retains corrections and unrelated meeting data, preserves the
  pull cursor, and emits per-occurrence acknowledgements without inventing replay counts.
- **Bounded evidence, person context and task proposals** use public producer services, selected
  account ownership and durable revision/cue references. Proposals never create tasks.
- **Shared resource search** defaults to meetings, with explicit broader resource selection,
  bounded candidate scans and reports that preserve skips, coverage and continuation cursors.
- **Explicit meeting vectors** preview generation by default; `--yes` rebuilds and embeds one
  bounded current-revision batch. Installed local models or explicit remote endpoints are required.
  Read-only semantic queries rank scanned existing candidates and expose their coverage limits.
- **Optional read-only MCP tools** add context, meetings-only unified search and fixed-model
  semantic queries. Embedding generation and task creation remain outside MCP.
- **Generated command reference and measured test matrix** reuse cli-core's generators. Release
  and manual validation install the checked tarball on Linux and Windows with Node 22.16 and 24.

## 0.2.2 — 10.10.2026

### Исправлено

- **One shared meeting model** aligns cli-messaging 0.219.0 with cli-meetings 0.2.4, so the Zoom
  commands and native meeting adapter resolve the same package version.

### Изменено — может затронуть вызывающий код

- **Shared store baseline** adopts automatic log pruning, checked at most daily on store open or
  log writes: agent audit records older than 90 days are removed, and handled bot-update payloads
  older than 30 days are cleared while their delivery rows remain.

## 0.2.1 — 10.10.2026

### Добавлено

- **Offline archive transcript reads and search** verify manifest size and SHA-256 before parsing
  WebVTT. Select occurrences or files, bound per-file reads and results, and search literal cue text
  without login or a meeting database. Successful finite output is withheld if verification fails.
- **API foreground watching** repeatedly pulls the configured source with an optional late-part
  lookback. File watching retains its positional folder form. Configuration is captured before the
  first cycle; cycles serialize ingestion and close each store connection before emitting a receipt.

## 0.2.0 — 10.10.2026

### Добавлено

- **Persistent meeting data** connects the published shared SQLite adapter lazily. Imports and pulls
  register the selected local profile; reads resolve it without registration. Summary/history reads,
  Markdown/VTT exports, folder watching and MCP now use real persistence in the executable.
- **Recording history synchronization** splits explicit date ranges into monthly requests and emits
  serial occurrence receipts with verified skipping. Folder watching rescans corrected transcripts
  and closes each ingestion connection before its receipt; headless streams require JSONL.
- **Read-only MCP serving and packaged agent instructions** reuse the shared meeting tools and
  cli-core skill installation. MCP reads use the selected account and close before responding;
  discovery opens no database. Native reads require a selected profile with stored meeting data.
- **Cloud recording archives** discover assets and stream available video, audio, VTT and chat files
  into a local archive with checksummed manifests, verified skipping, bounded transfers and explicit
  stale lock recovery. Archive inspection and verification do not need Zoom or a meeting database.
- **Simple remote meeting commands** list, show and retrieve invitations, and preview creation,
  updates and cancellation. `--yes` applies once; `--dry-run` always previews. Dispatched writes with
  an uncertain result are reported separately and never automatically retried.
- **Command discovery and local diagnostics** expose command metadata/examples, shell completion,
  local runtime/config checks and saved OAuth session status without opening the meeting database.
  Session status distinguishes OAuth login from the selected local data profile.

### Изменено — может затронуть вызывающий код

- **Native store runtime prerequisites** add the published cli-messaging 0.218.0 dependency.
  Node now requires 22.16 or newer within 22.x, or version 24 or newer, matching its SQLite runtime.
- **Shared CLI output and errors** use cli-core rendering and exit codes. Piped output is JSON;
  terminal output uses human-readable rendering. `--quiet` suppresses non-error diagnostics.
- **Unattended login fails promptly.** CI and terminals without interactive input cannot launch a browser;
  Piped or JSON login with an input terminal requires `--interactive`.

### Исправлено

- **Cancellation and output cleanup** close file handles when cancellation arrives during open,
  wait for submitted writes and drain, and preserve completed stream receipts with a bounded grace.
  Failed close or file output never emits a successful result; existing exports are never overwritten.
- **OAuth grants remain bound to their client.** Configuration changes cannot save tokens under a
  different client key. Successful malformed or interrupted grants report an uncertain outcome and
  require login before retrying.

### Безопасность

- Fast secret checks remain on PRs; source, production dependency and workflow security checks run before publication. Automatic Socket checks are disabled.

## 0.1.1 — 10.10.2026

### Добавлено

- **Local account profiles and lazy connections** let library callers select a stored account, open
  only for store commands and close after success or failure. The standalone SQLite binding remains
  pending the shared store release.
- **Bounded late-transcript recovery** exposes `pull --lookback-days` from zero through 31 days.
  Zoom uses the shared cli-meetings 0.2.3 package.

## 0.1.0 — 10.10.2026

### Добавлено

- **`zm login`** uses public-client PKCE through the browser callback, validates state, accepts
  pasted callback parameters, and saves tokens in the system keyring. Refresh uses the client id
  without a secret; actual token scopes are retained.
- **The API source** reads occurrences, participants, transcripts and summaries. Rejoin sessions
  are grouped by stable participant identity; missing scopes are named without exposing response
  values in errors.
- **The files source and commands** import legacy WebVTT filenames and expose shared meeting reads.
  Import and pull use the memory store in tests; real ingestion awaits the shared SQLite adapter.
- **Installed-package acceptance checks** exercise the real bin with isolated config and guards
  against network, browser and keyring access. A CI release workflow builds and packs before a
  separate trusted-publishing job; tagging follows registry verification.

### Исправлено

- **File occurrence ids** use the original filename date, clock and topic, so correcting the
  configured timezone updates the existing meeting instead of creating a duplicate.
- **OAuth and CLI recovery** fail promptly when a browser cannot launch without paste input;
  help and version work with malformed config. Token transport and malformed-response errors are
  classified without exposing arbitrary response text. CLI version follows package metadata.
- **Source fidelity** validates every transcript redirect and bounds downloads, deduplicates stable
  participant sessions, preserves empty unified summaries and rejects invalid timezones and
  conflicting normalized filenames. Import preflights the whole input before saving; identical
  filename aliases import once.

### Изменено — может затронуть вызывающий код

- **The project is now licensed under Apache License 2.0.** See `LICENSE` for the terms.
