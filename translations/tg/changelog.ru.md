---
title: "История изменений"
---

Основные изменения `@wirecat/tg-cli` по версиям, от новых к старым. Используется [семантическое версионирование](https://semver.org); до `1.0.0` интерфейс команд может меняться.

## 0.104.0 — 29.10.2026

### Changed — may break callers

- **Сервер MCP обслуживает только те профили, которые вы назвали.** `tg mcp serve` без профиля теперь отказывается
  запускаться (код 2) и перечисляет ваши профили. Назовите один (`tg work mcp serve`), список
  (`tg mcp serve --profiles work,personal`) или все профили (`tg mcp serve --profiles all`); строка в stderr при запуске
  называет обслуживаемые профили. Тот же выбор действует для `--http`, `mcp revoke`, `mcp config` и
  `mcp server start|stop|status`. Запись в приложении, которая запускает `tg mcp serve` без профиля, перестаёт работать:
  напечатайте её заново через `tg mcp config --profiles all` или назовите профиль. Фоновый сервер всех профилей,
  запущенный прежней версией `tg`, останавливается командой `tg upgrade`; запустите его снова через
  `tg mcp server start --profiles all`. Запись в MCP Registry теперь запускает `tg mcp serve --profiles all` (cli-core
  0.470.0).

### Added

- **У каждого сообщения, которое печатает `tg`, есть `sender_is_me`** — true для отправленного вами сообщения, в
  `messages list`, `show`, `context`, окнах поиска и `inbox` (cli-core 0.473.0).
- **`tg runs show` сохраняет сетевой код ошибки неудачного запуска** (`error.cause_code`, например `ETIMEDOUT`), но
  никогда не текст сервера (cli-core 0.473.0).

### Fixed

- **`--offline --transcribe` сообщает, какие голосовые сообщения не расшифрованы.** Они перечислены в `missing` вместе с
  командой `tg <profile> messages transcribe <chat> <id>` для запуска (cli-core 0.473.0).
- **У каждого вызова инструмента MCP есть собственный `run_id`** в ответе и в `tg runs` (cli-core 0.471.0).

## 0.103.0 — 27.10.2026

### Changed — may break callers

- **cli-core 0.469.0 и cli-base 0.65.0.** cli-core 0.469 принимает только cli-base 0.65, поэтому обе версии
  меняются вместе. cli-base 0.65 знает глаголы `serve` и `revoke`, поэтому их записи в базовой линии линтера удалены, а
  его `cli-dev bundle` находит сервер, запущенный с флагом перед `mcp serve`. Начиная с cli-core 0.468, сервер MCP
  предлагает через инструмент чтения команду, которая только загружает данные в архив.

### Fixed

- **`tg --version` отвечает до загрузки любой части сборки.** Сборку теперь делает общий `cli-dev bundle` из cli-base,
  а не собственный `scripts/bundle.ts` tg; части сборки и весь вывод те же. Сервер, запущенный с флагом перед
  `mcp serve` (`tg work --read-only mcp serve`), теперь загружает все части вскоре после запуска, как и обычный
  `mcp serve`, поэтому обновление на месте не может убрать часть у него из-под ног.

## 0.102.0 — 27.10.2026

### Changed — may break callers

- **Теперь сохраняется каждый запуск, в том числе удачный.** Удачный запуск хранится 7 дней
  (`keep_successful_runs_for_days`), неудачный — 30 (`keep_runs_for_days`), а папка запусков остаётся меньше 200 МБ
  (`runs_size_limit_mb`). При включённом `record_input`, как по умолчанию, удачный `send` теперь сохраняет то, что вы
  ввели (сообщение, чат, названный по заголовку), в запуске, который может читать только вы, на этом компьютере, 7 дней.
  `record_input failed` сохраняет это только в неудачном запуске; `record false` сохраняет только неудачные запуски;
  `--no-record` не сохраняет ничего. `watch`, `serve` и `mcp serve` сохраняют удачный запуск только с `--record`.
  Запуск теперь говорит, кто его запросил: командная строка, приложение MCP (и его вызов инструмента) или WireCat
  Desktop (cli-core 0.467.0).

### Added

- **`tg runs show` перечисляет каждый запрос к Telegram с его временем, повторами и ожиданиями.** У запуска команды
  теперь есть строка для каждого обращения к Telegram, для аккаунта и для бота: метод (`messages.getHistory`,
  `sendMessage`), сколько он занял и чем закончился. Когда Telegram просит подождать (`FLOOD_WAIT` или `429` в Bot API),
  а `tg` ждёт и пробует снова, запуск показывает отклонённый вызов, а затем повтор как попытку 2 с временем ожидания.
  Текст сообщений, имена, номера телефонов и токен бота никогда не записываются.

## 0.101.0 — 27.10.2026

### Changed — may break callers

- **Сервер MCP — это `tg <profile> mcp serve`; `tg <profile> mcp` сам по себе печатает справку.** Входы браузерных
  приложений забываются командой `tg <profile> mcp revoke` вместо `mcp --revoke`. Сервер бота — `tg <name> bot mcp serve`.
  Запись в приложении, которая запускает `tg personal mcp`, нужно заменить на `tg personal mcp serve`: снова выполните
  `tg personal mcp add <app>` или `tg personal mcp config`. `mcp server start` и записи, которые печатает `mcp config`,
  уже запускают новую команду (cli-core 0.463.0).
- **`tg skill show|status|install --json` печатают `{ item, meta }`.** Поля навыка перенесены в `item`; установщик для
  Windows читает их оттуда (cli-core 0.462.0).
- **Результаты поиска всех видов и `tg topics show` называют поля, которые агент должен читать как данные**
  (`untrusted`, например `["title"]` у темы форума). Вызывающая программа, которая сверяет их со старой строгой копией
  схемы, отклоняет новое поле (cli-core 0.464.0).
- **`tg account list` сообщает, выполнен ли вход в каждый профиль на этом компьютере** (`signed_in`). Вызывающая
  программа, которая сверяет элементы со старой строгой копией схемы, отклоняет новое поле (cli-core 0.466.0).

### Added

- **`tg search all` также находит события календаря в общем архиве**, помеченные для агентов как недоверенный текст, а
  `contacts context|prepare` называют ещё одно поле (cli-core 0.453.0–0.461.0).
- **`tg upgrade` перезапускает запущенный им браузерный сервер MCP и называет сессии агентов, оставшиеся на старой
  версии.** После установки каждый `tg mcp serve --http`, запущенный через `tg mcp server start`, снова запускается на
  том же порту, адресе и с теми же ограничениями (`mcp_servers`, старая → новая версия); запущенный вручную остаётся
  работать и называется. Сессии агентов через stdio, оставшиеся на старой версии, перечисляются (`stale_sessions`):
  перезапустите их из приложения агента. Это работает начиная со следующего обновления (cli-core 0.464.0).

### Fixed

- **`tg mcp serve` без профиля помечает профили, в которые не выполнен вход.** Он перечислял каждый профиль с файлом
  аккаунта, поэтому приложение могло выбрать профиль без сессии и получить ошибку. Теперь каждый профиль помечен
  (`default — not signed in`) в меню приложения и в описании, а вызов для профиля без входа отвечает, как войти:
  `tg <profile> setup` или через WireCat Desktop. Запись в реестре MCP и образ Glama запускают `tg mcp serve`.
- **Страница входа браузерного сервера MCP говорит, что каждый код действует для одного входа.** После входа приложения
  новый код появляется в WireCat Desktop и в `tg mcp server status`; повторный ввод старого кода сообщал только
  «Wrong code» (cli-core 0.466.0).

## 0.100.0 — 27.10.2026

### Fixed

- **Команды запускаются примерно на 0,2 с быстрее: пакет работает из сборки.** Команда загружала около 1110 файлов
  модулей до начала работы; теперь она загружает около 55 с тем же кодом. `tg messages list --help` ускорилась с 389 до
  192 мс, а при первом запуске после установки или перезагрузки — с 534 до 272 мс. Команда, которая подключается,
  по-прежнему загружает клиентскую библиотеку Telegram. Вывод не изменился. Пакет стал больше: 3,0 МБ для загрузки
  вместо 0,5 МБ, 16 МБ на диске вместо 4 МБ. Работающий `tg serve`, `watch` или сервер MCP загружает весь свой код
  через несколько секунд после запуска, поэтому обновление `tg` под ним не оставит его без файла, который он ещё не
  использовал.
- **Навык агента tg снова публикуется в ClawHub как `tg-cli`.** ClawHub хранит имена навыков отдельно для каждого
  издателя, поэтому `wirecat/tg-cli` — собственное имя tg, хотя у другого издателя тоже есть `tg-cli`, и навык каждого
  инструмента WireCat теперь использует простое имя. `tg skill install` по-прежнему пишет `skills/tg-cli/`.

## 0.99.0 — 27.10.2026

### Fixed

- **Без сессии ошибка и инструкции MCP также предлагают WireCat Desktop.** `no session`, `not logged in` и
  отсутствующие ключи приложения теперь говорят: выполните команду в терминале или войдите через WireCat Desktop
  (Tools → Telegram → Manage). Через MCP агенту сказано никогда не просить коды или пароли (cli-core 0.452.0).
- **Навык агента tg публикуется в ClawHub как `wirecat-tg`.** Имя `tg-cli` в ClawHub принадлежит другому издателю,
  поэтому навык tg нельзя было под ним разместить. `tg skill install` по-прежнему пишет `skills/tg-cli/`.

## 0.98.0 — 27.10.2026

### Fixed

- **Поиск по смыслу и `--discover` работают на нативном ONNX Runtime и в Windows (cli-core 0.451.0).** После
  `tg <profile> models download` текстовые модели и модель переранжирования используют нативную библиотеку в Windows
  x64 и arm64, как уже было в Linux и macOS: в 2–3 раза быстрее, чем WebAssembly. Загрузка берёт `onnxruntime.dll` из
  npm-пакета `onnxruntime-node` (113,5 МБ, один раз, с проверкой sha256). Модели картинок (CLIP, SigLIP2) теперь тоже
  используют нативную библиотеку там, где она установлена. Результаты те же.

## 0.97.0 — 27.10.2026

### Added

- **`tg mcp` без профиля обслуживает все профили, через stdio и с `--http` (cli-core 0.450.0).** Приложению ИИ нужно
  одно подключение к Telegram, а не по одному на профиль. Каждый инструмент (`tg_tools_search`, `tg_read`, `tg_write`)
  принимает обязательный `profile` (любой профиль на этом компьютере, без значения по умолчанию), и агенту сказано
  спросить, если вы не назвали аккаунт. Вызов выполняется в собственном `tg <profile> mcp` этого профиля, который
  запускается при первом использовании и закрывается после 10 минут простоя, поэтому разрешения, сессия и журнал
  аудита каждого профиля действуют как прежде. `tg mcp --revoke`, `tg mcp config` и `tg mcp server start|stop|status`
  тоже работают без профиля, со своим входом. `--public-url` принимает путь, `https://<name>.ts.net/tg`, чтобы
  инструменты делили один адрес туннеля. Запись в MCP Registry запускает `tg mcp`. `tg <profile> mcp` не изменился.

### Changed — may break callers

- **tg нужен cli-base 0.63.0 (cli-core 0.450.0).** Ничего из того, что использует tg, в нём не изменилось.

## 0.96.0 — 27.10.2026

### Fixed

- **Каждая команда тратит меньше времени на подготовку (cli-base 0.62.0, cli-core 0.449.0).** Проверка общих команд
  теперь описывает каждую команду один раз, а не заново для каждой группы над ней. Тёплый `run(["--version"])`
  ускорился с 49 до 29 мс. Она ловит те же изменения, что и раньше.
- **Команды вне `bot api` запускаются быстрее: 185 сгенерированных команд Bot API строятся только при необходимости.** `tg messages list`, `tg --help` и другие команды больше не загружают около 1,5 МБ сгенерированного кода. `bot api`, `bot --help`, `bot mcp`, `commands`, `complete`, `help`, `mcp`, `serve`, `config` и `doctor` по-прежнему строят группу, как и любая команда, если в настройках сохранено разрешение `bot.api`. Вывод не изменился.
- **Поиск по смыслу и модель переранжирования в `search messages --discover` работают в 2–3 раза быстрее в Linux и на Mac с Apple silicon после следующего `tg models download` (cli-core 0.448.0).** Загрузка устанавливает нативный ONNX Runtime, и модели работают на нём; без него они работают как прежде. Модель переранжирования теперь читает только начало сообщения, на которое отвечает результат (cli-core 0.447.0).

## 0.95.0 — 26.10.2026

### Added

- **`tg <profile> session start --json --answer-stdin` выполняет вход без терминала, для WireCat Desktop (cli-core 0.443.0).** Каждый вопрос — строка `needs` в stderr (`{"event":"needs","field","secret","prompt","hint"}`: `api_id`, `api_hash`, `phone`, `code`, `password`), а ответ на него — одна строка в stdin; my.telegram.org приходит строкой `open_url`. Без `--answer-stdin` запуск без терминала по-прежнему отказывается, поэтому оболочка агента никогда не ждёт ответа на вопрос. Ответы никогда не печатаются и не сохраняются в записи запуска.

- **`tg <profile> mcp server start|stop|status` запускает HTTP-сервер MCP в фоне (cli-core 0.445.0).** `start` принимает `--public-url`, `--port` и `--permission`, как `mcp --http`, и возвращается, когда сервер начал слушать; `status` показывает порт, адрес, одноразовый код входа и приложения, которые вошли; `stop` останавливает только запущенный им сервер. WireCat Desktop запускает и останавливает его из панели Manage инструмента.

### Changed — may break callers

- **Запись запуска хранит командную строку в том виде, в каком её ввели (cli-core 0.439.0–0.447.0).** `runs show` и `run.json` содержат `argv` — слова после `tg`, — где секреты заменены на `[redacted]` (параметр с именем секрета, пароль в URL, известный формат токена, случайно выглядящая строка), а номер телефона никогда не сохраняется. `tg <profile> config set record_input false` ставит `[redacted]` вместо каждого введённого значения, которое может быть текстом. Записанные события по-прежнему содержат идентификаторы, но никогда не заголовок чата или текст сообщения.

## 0.94.0 — 26.10.2026

### Added

- **`tg skill install --for hermes` даёт навык Hermes Agent, а `tg skill status` говорит, что читает Hermes (cli-base 0.59.0).** Команда добавляет `~/.agents/skills` в `skills.external_dirs` Hermes через `hermes config set`, сохраняя уже перечисленные папки, или копирует файл в домашнюю папку Hermes, если это не удалось. Без установленного Hermes она завершается с `not_found` и ничего не пишет. Простой `tg skill install` и `--for all` по-прежнему пишут только копии для Claude Code и `~/.agents/skills`. `skill status --json` получает `hermes` рядом с `targets`.
- **Запуск, начатый OpenClaw или Hermes Agent, называет этого агента (cli-core 0.437.0).** `runs show` указывает `agent` как `openclaw` для команды, выполненной агентом OpenClaw, с `from_chat: true`, если её начало сообщение в чате; запуск из Hermes несёт его сессию, поэтому захват задачи из Hermes держится для каждой сессии отдельно.
- **Навык `tg-cli` сообщает OpenClaw и ClawHub, что ему нужен `tg`, и как его установить** (`metadata.openclaw`: `requires.bins` и npm-пакет `@wirecat/tg-cli`). Если `tg` нет в PATH, OpenClaw помечает навык как неготовый и предлагает установить пакет. Claude Code и Codex этот блок пропускают.

## 0.93.0 — 25.10.2026

### Added

- **`store reset --dry-run` перечисляет, что очистил бы сброс, и ничего не удаляет** (cli-core 0.429.0): файлы и байты архива, каждую таблицу данных с числом строк, будет ли сначала сделана резервная копия и держит ли файл открытым `serve` или другой процесс.
- **`search messages --discover` также находит сообщения, близкие по смыслу**, когда загружена e5-small и `conversations rebuild` дал сообщениям собственные векторы (cli-core 0.432.0). `discovery.found_by` каждого результата говорит, какой поиск его нашёл. До этого discovery ищет по словам, как прежде, и объясняет почему. Ничего не загружается, и текст не покидает компьютер.
- **`search messages --discover` переранжирует первые 50 результатов, когда загружена модель переранжирования (cli-core 0.435.0).** Локальная модель читает вопрос вместе с каждым результатом, и её оценка смешивается с собственной оценкой discovery; результаты после первых 50 сохраняют порядок. По умолчанию это mMARCO (136 МБ, `tg models download mmarco`); настройка профиля `search_reranker` выбирает `bge-reranker-v2-m3` (588 МБ) или `off`. У каждого переранжированного результата есть `discovery.reranker_score`; `score` остаётся оценкой discovery. Без модели discovery сохраняет свой порядок и сообщает `not reranked: …` (в `--json` и MCP: `missing` и `next`). Поиск никогда не загружает модель и никуда не отправляет текст; `--exact`, `--newest` и строгие запросы не затрагиваются.
- **`search all` тоже находит сообщения по смыслу, когда загружена e5-small и у сообщений есть векторы (cli-core 0.435.0).** Результаты по смыслу объединяются с результатами по словам в один список сообщений; `foundBy` каждого элемента говорит, какой поиск его нашёл. Запрос с NOT или с фильтром под OR или в группе остаётся поиском только по словам. Без модели или векторов `search all` ищет по словам, как прежде, и объясняет почему. `--exact` и `--backend server` остаются поиском только по словам.

### Changed — may break callers

- **Запуск неудачной команды `bot` называет вызов Bot API, который не удался.** `runs show` и `runs list` дают в его `error.http` поля `method` и `endpoint_template` рядом со статусом — `{ "method": "POST", "endpoint_template": "/:token/sendMessage", "status": 400 }`, — тогда как раньше там был только статус. Токен всегда записывается как `:token`: Telegram помещает его в адрес, и настоящий токен никогда не попадает в запуск или трассировку. Запросы бота в `--trace` и в записанном запуске несут те же два поля, а читаемая строка трассировки показывает их после имени метода (`← getMe  POST /:token/getMe  401 …`). Скрипт, который разбирает текст `--trace`, увидит этот дополнительный столбец.
- **tg нужен Node 22.19+ или 24+ (было 22.16+).** Поддержка прокси для Bot API использует undici 8, которому нужен Node 22.19. Bun это не затрагивает.
- **Общий архив переходит на версию 34 (cli-core 0.434.0).** Поиск по смыслу ранжирует через векторный индекс в архиве, который строится при первом открытии этой версией. Как только эта версия открыла архив, CLI на cli-core 0.433.0 или старше отказывается его открывать и просит обновиться, поэтому обновляйте вместе все CLI WireCat, которые делят архив. Если SQLite-расширение индекса отсутствует или не загружается, открытие архива завершается ошибкой `store.vector-extension-missing` или `store.vector-extension-failed`: переустановите tg. `store check` сообщает `vector_indexes` и завершается ошибкой, если индекс рассинхронизирован.
- **`tg upgrade --help` показывает в примере только `tg upgrade --check` (cli-core 0.433.0).** Пример с простым `tg upgrade` удалён: скопированный и запущенный, он выполнял обновление.
- **Анализ через Anthropic отправляет ключ как `Authorization: Bearer` (cli-core 0.433.0).** Раньше отправлялся `X-Api-Key`. Шлюз на собственном `models.<purpose>.base_url`, который читает `X-Api-Key`, должен читать `Authorization`.

### Fixed

- **Hermes Agent устанавливает навык `tg-cli` без предупреждения о безопасности.** Его проверка при установке держала навык на уровне «caution», потому что одно предложение называло папку SSH по её пути, хотя в нём говорится, что tg отказывается её отправлять. Теперь предложение говорит «SSH keys»; то, что tg отказывается отправлять, не изменилось.
- **Загрузка файла ботом через прокси SOCKS5 или HTTP отправляет файл.** Раньше запрос через прокси нёс текст `[object FormData]` вместо формы, поэтому Telegram отклонял фото, документы и голосовые сообщения, отправленные с `--proxy`.
- **Простой `--version` отвечает до загрузки программы**: bin запускается через `@wirecat/cli-core/cli/start` (cli-core 0.429.0).
- **Сохранённый вектор удаляется, когда его не использует ни один текст в архиве (cli-core 0.435.0).** Изображение с изменившейся картинкой и очищенный чат (`store clear --left`, чат, объединённый с другим) оставляли векторы, а теперь нет. `store rebuild` удаляет оставленные старыми версиями (`unused_vectors_dropped`), а `store check` их считает (`vectors.unused`).
- **`conversations embeddings clear --chat` удаляет и векторы сообщений чата (cli-core 0.435.0)**, а не только векторы его бесед.

## 0.92.0 — 25.10.2026

### Changed — may break callers

- **Разрешения проверяются по полному ключу каждой команды (cli-core 0.421.0).** `messages sync` проверяется как `messages.sync`, а `bot messages sync` — как `bot.messages.sync`; уровень на `messages` или `bot.messages` по-прежнему действует на них. Сохранённый ключ читается только так, как он записан, поэтому `chats.mute` больше не распространяется на `chats unmute`.
- **Сохранённый ключ разрешения, который не называет ни одной команды, отклоняется, в том числе для команд бота.** Для ключа под известным ресурсом любая команда, кроме `config show`, `set` и `unset`, останавливается с `configuration_error`, где названы ключ и `config unset`, который его убирает.
- **`tg <profile> search mail` — неизвестная команда.** Почту ищет `memo search mail`.
- **`doctor --json` сообщает о проблемах файла настроек в `config.issues` (cli-core 0.423.0).** Поля `config.error` больше нет. У каждой проблемы есть `kind` (`invalid_json`, `unknown_setting`, `unknown_permission`, `missing_setting` или `invalid_value`), `file`, `profile` и `key`, где они применимы, `line` и `column` для некорректного JSON, фраза о том, каким должно быть значение (никогда не само значение), и `fix` — команда `config unset`, которая её убирает. `doctor` перечисляет все проблемы файла, по-прежнему завершается с кодом 0 и отвечает, даже когда JSON сломан. Блокировка профиля, флаг или переменная окружения, которые настройки отклоняют, попадают в `settings.error`.
- **`default_profile`, `analysis_provider`, `analysis_model` и `analysis_base_url` — неизвестные настройки, а `TG_ANALYSIS_PROVIDER`, `TG_ANALYSIS_MODEL` и `TG_ANALYSIS_BASE_URL` не читаются.** Файл с одной из них отклоняется, как с любой неизвестной настройкой, вместе с `config unset`, который её убирает. Анализ задаётся через `models.analysis.provider`, `models.analysis.model` и `models.analysis.base_url` (`TG_MODELS_ANALYSIS_*`); `--model` и `--base-url` у `conversations links rebuild` переопределяют их.
- **Команда, отклонённая из-за проблемы в файле настроек, называет первую проблему и команду, которая её убирает**, и говорит, сколько ещё проблем перечислит `doctor`. `config show`, `set` и `unset` работают с таким файлом, а `config unset` убирает настройку, которой не знает ни одна схема. Неизвестный ключ разрешения отклоняется в любом разделе файла, а не только в разделах, которые читает команда.
- **`config set` сохраняет `config.json` с доступом только для вас (`0600`) (cli-core 0.428.0, cli-base 0.57.0).** Раньше файл перезаписывался как `0644`. Всё, что читает настройки от имени другого пользователя — общесистемная служба, контейнер с другим uid, — после следующего сохранения прочитать их не сможет; запускайте это от владельца или дайте ему собственные настройки.
- **Запись о запуске говорит, как он был начат и почему не удался (cli-core 0.425.0).** В `run.json`, `runs list`, `runs show` и `search runs` появились `cli_command` (вся команда, `tg messages list`), `argv`, где каждое значение, которое может быть содержимым, записано как `[redacted]`, `agent` (агент для программирования и его сессия, если он их сообщает) и, для неудачного запуска, `error`. Запуск без названного профиля не содержит `profile`, вместо того чтобы записывать `default` (cli-core 0.424.0).
- **Первый экран говорит, что zm и drive «можно искать вместе с другими данными WireCat»** (cli-core 0.426.0), а пример `guide` называет настоящий сценарий вместо `<name>`.

### Added

- **`tg skill status` и `tg skill show --for claude|agents`** (cli-base 0.56.0, через cli-core 0.427.0). `skill status` сообщает для Claude Code и для `~/.agents`, совпадает ли установленный SKILL.md с этой версией; `skill show --for` печатает установленную там копию.
- **`tg store tables list` перечисляет все таблицы локального архива** с их видом и числом строк; `--full` добавляет размер каждой таблицы (cli-core 0.427.0). `store info` также говорит, какие инструменты открывали базу, её режим журнала, страницы, миграции и последнюю резервную копию, и считает данные по провайдеру, виду чата, аккаунту, году и виду вложений.

### Security

- **`doctor` сообщает о `config.json` или папке настроек, которые могут читать другие пользователи, и даёт исправляющий `chmod` (cli-core 0.428.0).** `files.problems` перечисляет файл настроек (нужен `0600`) и его папку (нужен `0700`), в том числе когда папку задаёт `TG_CONFIG_DIR`, а stderr печатает `to make it private: chmod 600 '<path>'`. `files` есть в ответе и без названного профиля, и когда настройки отклонены. На диске ничего не меняется; Windows не проверяется.

### Fixed

- **Каждая команда запускается быстрее: клиентская библиотека Telegram загружается, только когда команда подключается.** `tg --version`, `--help`, `config show` и `runs list` загружали около 1 900 файлов модулей, 650 из них — mtcute; теперь около 1 100.
- **Сохранённый запрет на команду синхронизации теперь её останавливает.** `permissions.messages.sync: deny` можно сохранить, и он соблюдается, а `permissions.bot.messages.sync: deny` больше не игнорируется. Запрет на `bot.messages` также останавливает `bot messages list` и `bot messages sync` до подключения.
- **Сбой посреди команды сообщается, как любая другая ошибка.** Раньше печаталась трассировка стека Node; теперь печатается ошибка `internal_error` (`command.crashed`) — одной строкой в терминале, иначе объектом ошибки JSON, — и код выхода по-прежнему 1. Трассировка стека ничего не говорит скрипту и может содержать текст, которому не место на экране. Скрипт, читавший трассировку в stderr, теперь читает объект ошибки.

## 0.91.0 — 25.10.2026

### Changed — may break callers

- **Общая база переходит на версию 33 (cli-core 0.420.0).** После того как эта версия откроет базу, CLI на более старом cli-core отказывается с ней работать и просит обновиться, поэтому обновляйте вместе все CLI WireCat, которые делят базу.

## 0.90.0 — 25.10.2026

### Changed — may break callers

- **`tg <bot> bot store fetch` теперь называется `tg <bot> bot messages sync`, группы `bot store` больше нет.** Команда загружает старые сообщения канала или супергруппы в локальную копию бота — то же, что делает личная `messages sync`, поэтому у неё то же имя; `store` относится к локальной базе данных. Параметры не изменились. Старый путь отвечает подсказкой с новым. Сохранённый ключ `permissions.bot.store.fetch` отклоняется, пока вы не переименуете его в `permissions.bot.messages.sync`.

## 0.89.0 — 25.10.2026

### Changed — may break callers

- **Заблокированный аккаунт Telegram возвращает `permission_error` (код выхода 5).** Новый вход не снимает блокировку; используется тот же контракт причин и кодов, что и в других CLI.

- **Общие контракты CLI теперь требуют явно объявленных отличий провайдера.** Описание команд экспортирует унаследованные определения, схемы, причины ошибок и точные принятые отличия. Активность контакта фильтруется запросами `scope:` и `at:`; поиск диагностических запусков использует границы `started_at:` вместо параметров времени. Неизвестные списки участников чата и неограниченные списки типов вебхуков опускаются, а не возвращаются как `null`.

### Security

- **В разрешении зависимостей исключены уязвимые версии Zod и Vite.** Локальная и свежая производственная проверки используют исправленные версии.

## 0.88.0 — 24.10.2026

### Added

- `messages send --draft` сохраняет текст в чате, чтобы вы проверили его и отправили из Telegram. Поддерживаются форматирование, ответы и темы форума; используется отдельное разрешение `drafts`, сообщение не отправляется. Пустые черновики и параметры только для отправки отклоняются.

### Fixed

- `watch --events` и `serve` получают снимки реакций, доставленные как изменения сообщения, включая удаление реакции. Счётчики остаются актуальными, даже если Telegram не присылает отдельное обновление реакций.

## 0.87.0 — 24.10.2026

### Fixed

- Руководства MCP описывают операции записи с отдельными ключами разрешений и отдельное разрешение на прямые вызовы Bot API.
- Сценарий catch-up использует `chats mark-read` как отдельную команду. Руководство по установке объясняет, как восстановить работу, если каталог глобальных команд pnpm отсутствует в PATH.
- Запрещённые команды остаются видимыми в справке CLI и MCP с текущей доступностью, причинами и ключами разрешений. Настройки бота остаются в разделе бота, а вызовы проверяют текущие разрешения.
- **`chats members check --help` снова использует описание tg**: что читает `--deep` и что идентификаторы отправляются в публичные списки блокировок. Начиная с 0.86.0 отображалось общее описание без этих подробностей.

## 0.86.0 — 24.10.2026

### Added

- **Send up to ten attachments as one album** by repeating `messages send --photo` or `--file`.
  Photos and videos can share an album; documents form a separate group. The caption belongs to the first
  item, and JSON includes every sent message. Each item counts toward the hourly send limit. Retrying an
  unscheduled send with the same operation id repeats the same per-item Telegram ids.

### Changed — may break callers

- **Shared commands have one name each, and the old names are gone** (cli-core 0.406.0). `contacts profile` is
  `contacts info`, `contacts timeline` is `contacts events`, `contacts alias set|rm` is `contacts aliases set|remove`.
  `chats link …` is `chats links …` and `chats link revoke` is `chats links remove`; `chats members audit` is
  `chats members check`; `chats requests accept|decline` is `chats requests confirm|reject`. `metadata get|refresh` is
  `metadata show|sync`, `tasks plan` is `tasks update`, `tags auto` is `tags rebuild`, `attachments text set` is
  `attachments update`, `store reindex` is `store rebuild`, `store gaps plan` is `store gaps show` and
  `stats messages counters refresh` is `stats messages counters sync`. `conversations build` is
  `conversations links rebuild`, `conversations embed status|clear` is `conversations embeddings status|clear`,
  `conversations batches next` is `conversations batches show` and `conversations consents revoke` is
  `conversations consents remove`. `models audio list` and `models text list` are `models list kind:audio|kind:text`,
  `models audio|text download` is `models download`, `models text key` is `models keys`. `doctor report create` is
  `doctor reports create` and `doctor report` is `doctor reports show`. `mcp setup` is `mcp add`, `mcp doctor` is
  `mcp check` and `commands schema` is `commands info`. An old name stops with the new one in the message; CLI and MCP
  use the same paths.
- **The hidden old option spellings are removed.** Use `--analysis-provider`, `--embedding-provider` or
  `--consent-provider` for `--provider`, `--answer-model` on `conversations links clear`, `--template-mode` on reply
  rules, `--claim` on `tags remove`, `--text-file` on `contacts notes`, and `kind:` in the `inbox` and `review` query.
- **A saved permission key with an old path stops every command with `configuration_error`** and names the key to
  rename it to, for example `permissions.conversations.embed` to `permissions.conversations.embeddings`. `config set`
  and `config unset` stop too, so rename the key by hand in `config.json`
  ([where it is](./configuration-reference.md)).

## 0.85.0 — 24.10.2026

### Added

- **The first command at a terminal asks three questions once for every WireCat tool** (cli-core 0.404.0): which
  languages you write and speak, which other WireCat tools to install, and whether commands and agents may only read.
  Answered in any tool, they hold in all of them; "read only" caps every profile, over MCP too. `tg setup` asks them
  again. Agents, `--json`, `--no-input`, `CI` and `TG_READ_ONLY` are never asked.

## 0.84.0 — 24.10.2026

### Added

- **`permissions.mcp.authority` decides whether an MCP server offers the commands that change what a later run may
  do** (cli-core 0.400.0): `config set|unset`, `schedule command|agent|remove`, reply rules and consents, recipient lists,
  chat rules, `server install`, `skill install`, model keys, media archive timers and `flood clear`. It is `deny` by
  default, so an agent still cannot loosen its own limits until you run
  `tg <profile> config set permissions.mcp.authority allow` in a terminal (add `--bot` for a bot's server).
  [Permissions](./permissions.md#let-an-agent-change-its-own-limits) and
  [the MCP guide](./mcp.md#commands-that-change-what-a-later-run-may-do) explain it.

### Changed — may break callers

- **`tg mcp` offers the writes that had no permission key before, each `ask` by default** (cli-core 0.401.0): store
  backup, restore, migrate, repair, reset, clear, decrypt and copy deletion, server start/stop/restart, model downloads,
  `schedule run|exec`, `doctor report create` and `account sessions end`; the bot server offers `store fetch`. Over MCP
  `ask` goes ahead, so set a key to `readonly` or `deny` to hide a tool. `tasks duplicates` is `tasks duplicates list`.

- **`tg <profile> events list --json` writes times as ISO 8601 and ids as strings** (cli-core 0.401.0): `starts_at`,
  `ends_at`, `deleted_at`, `created_at` and `updated_at`, as every other answer does.
- **A bot's MCP server can offer `bot api`, behind `permissions.bot.api`** (cli-core 0.402.0). It is `deny` by default;
  `tg <profile> config set --bot permissions.bot.api allow` in a terminal turns it on.

- **`tg <profile> watch --jsonl` prints `{"type":"item","data":…}` lines and a final `{"type":"end","complete":true}`.**
  Read each message or event from `data`, and stop at the `end` line. Fields are snake_case. A timeout or a normal stop
  ends with `complete: true`; a failure ends with `complete: false` and its exit code.
- **`runs search` is now `search runs`.** Filters are terms in the query: `status:failed`, `error_code:timeout`,
  `operation:messages.download`, `profile:work`, next to plain words. Saved MCP requests use the new command path.
- **`stats` reports take their filters as query terms.** `--message-kind` is `message_kind:posts|comments|all`,
  `--min-messages 5` is `min_messages:5`, `--min-views` and `--max-replies` are `min_views:` and `max_replies:`,
  `--older-than 24h` is `older_than:24h`, and `--chat` is `chat:<chat>` on the rankings and reports; exact words use `exact:` in place of `--exact`. Update saved
  commands and MCP requests.

- **Options have one meaning each** (cli-core 0.399.0). Use `--analysis-provider` for analysis and `--embedding-provider`
  for vector search (`conversations build|embed|related|status`, `search conversations`), `--consent-provider` for
  `conversations consents revoke`, `--claim` for `tags remove`, `--answer-model` for `conversations links clear`,
  `--template-mode` for reply templates and `--text-file` for `contacts notes add|edit`. `inbox` and `review` take
  `kind:group,channel` in their query. The old spellings still work, hidden, for one release.

### Fixed

- **Voice-note search no longer finds a different real English or Spanish word for the one you typed** (cli-core
  0.402.0). A misheard spelling still turns up: "budget" finds "budjet", but "cost" no longer finds "cast".

- **Downloading media skips service events and keyboards** (cli-core 0.400.0). A chat with a group event or an inline
  keyboard no longer makes `attachments download` fail with `provider.invalid-response`.

## 0.83.0 — 23.10.2026

### Added

- **`tg <profile> messages press <chat> <message> <button>`, `chats start <bot>` and `chats app <bot>` work with bots.**
  `messages show` now numbers the inline buttons under a bot's message; `press` presses a callback button by its number
  or text. A button that asks for your 2FA password is refused, never pressed. `chats start` starts a bot as its Start
  button does (`--start <param>`, or a `t.me/<bot>?start=` link), and `chats app` prints the address of its mini app,
  which signs you in.
- **The skill tells an agent to search again in other words before saying something is not there.** A search
  finds the words it is given, and a paraphrase shares none with its answer.
- **`tg <profile> chats archive|unarchive|pin|unpin|mark-unread|mute|unmute <chat>`: your own chat list from the
  command line.** Telegram's archive, pinned chats, the unread dot and notifications, with `mute --until 2h` for a
  time and plain `mute` for good. They change only your list; nobody in the chat is told, and repeating one is safe.

- **Verified media backups.** `attachments download <dir>` archives available files across chats with size and
  SHA-256 manifests; `attachments check <dir>` verifies them offline. `attachments jobs` manages opt-in Linux
  daily timers. Completed copies survive interrupted runs and message-store deletion; interrupted files restart.
  `attachments move <dir> <archive-dir> --before-time <time>` moves older images into another verified archive,
  retaining relocation records so checks follow the copies and later downloads do not duplicate them.

- **`tg <profile> review --offline` reads the local store** (cli-core 0.398.0) instead of refusing. It shows only
  what was already synced and says so (`missing` in JSON, a warning on the terminal).
- **The MCP server offers more commands, each limited by the profile's permissions** (cli-core 0.398.0): `runs`,
  `store status|info|check|export|reindex`, `store jobs`, `attachments move`, `attachments jobs status`, `config show`,
  `commands schema`, `guide`, `skill show`, `doctor report`, the `models` lists, `replies status|test|consents show`,
  `schedule list`, `server status|logs`, and on the bot server `webhooks`, `commands set|clear`, `chats leave` and
  `chats admins`. [The MCP guide](./mcp.md#commands-the-server-leaves-out) lists the few it leaves out, and why.

- Saved voice-note transcripts match word forms and spellings that speech recognition may have garbled.
  `text:` searches written text only; `exact:` disables expansion for that word.

### Changed — may break callers

- **`tg <profile> setup --json`: the command map is `item.commands`, not `item.next`.** The envelope's `next` is
  reserved for structured continuation steps, so the map of follow-up commands (`instructions`, `inbox`, `chats`,
  `history`, `history_status`, and `skill`, `mcp` when no agent skill was installed) moved to `item.commands`; the
  values are unchanged. Login details stay under `item.session`. What to do: read `item.commands.<name>` where you
  read `item.next.<name>`.

- MCP message deletion takes `message`, chat export takes `chat`, and duplicate-task operations take `task`
  and, for a pair, `other_task`. Update saved MCP requests using `messages`, `chats` or `dup`.
  CLI positional arguments keep their order.
- Command discovery (`commands` and `commands schema`) rejects `--jsonl`; use `--json` for its single document.

### Fixed

- **The docs and the skill say `search all` also asks Telegram.** By default it sends the query's words to
  Telegram's own search too (`--backend both`); `--offline` or `--backend archive` keeps the query on your computer.
  README, usage, search and the skill said it read only this computer.
- **Installation explains npm's install-script warnings.** npm 11.17 also prints `not yet covered by allowScripts`
  for `@wirecat/tg-cli` and `better-sqlite3`; both are harmless, and the guide says why.
- **`contacts prepare` is in the people guide and the skill**, and the comparison page covers tlgr and
  mcp-telegram, links the maintained tgcli and marks tgcli's several accounts.

- **A pasted `--help` example runs** (cli-core 0.398.0): an account command's example names the profile
  (`tg personal messages list Team`) instead of failing with "name a profile".
- **`search all --help` says it asks Telegram's server by default** and names `--offline` and `--backend archive`
  to keep the query local (cli-core 0.398.0).
- Message-search commands no longer list or delete saved meeting searches.
- Command corrections preserve the chosen profile; help shows concise descriptions and concrete examples.

## 0.82.0 — 23.10.2026

### Added

- **`tg <profile> contacts prepare <person>`: what to know before talking to someone** (cli-core 0.394.0). What
  `contacts context` gives, plus the one-to-one chats where their message is the newest the store holds, open tasks
  assigned to them, accepted facts about them and their projects, your notes about them, and their recent meetings —
  each with its reference, under one size budget, with `prepare.coverage` saying what each section left out and why.
  Tasks of another Telegram account, and facts on a project bound to one, stay out. `contacts.notes.list: deny`
  leaves the notes out and says so; `messages: deny` refuses the command, as it does `contacts context`.
- **Message search reads `"a b"~N`: the words at most N words apart in one message** (cli-core 0.391.0).
- **`bot watch --public-url <url> [--port <n>]` receives a bot's updates by webhook** (cli-core 0.391.0).

### Changed — may break callers

- **Reads never mark chats read** (cli-core 0.391.0). `messages list`, `inbox` and `review` no longer take
  `--mark-read` or `--no-mark-read`, and the `catch_up_marks_read` setting is refused. Why: a command that only read
  sent the other person a read receipt. What to do: remove `catch_up_marks_read`; run `tg <profile> chats mark-read
  <chat>` when you mean to mark a chat read.
- **An unknown key under `permissions` refuses messenger commands with `configuration_error`** (cli-core 0.391.0),
  typos such as `messages.sedn` included. It was a warning, and the restriction did not hold. What to do: correct the
  key or remove it with `config unset`.

### Fixed

- **A local read with an unknown profile lists the profiles on this computer** (cli-core 0.391.0), instead of
  suggesting to link a new account.

## 0.81.0 — 22.10.2026

### Added

- **JSON answers of commands with a date filter say how they read the date** (cli-core 0.385.0): `meta.window` gives
  the bounds used, in UTC, and `meta.timezone` names the zone a date typed without one was read in. This covers
  `store export`, `messages sync`, `stats chats show`, `stats chats retention`, `contacts context`,
  `search conversations`, `replies test`, `runs search`, `stats messages unanswered`, `stats contacts responses`,
  `stats chats newcomers`, `stats messages discussion`, and a `time:` or `date:` term in `chats events`,
  `chats members history`, `inbox` and `review`.

## 0.80.0 — 22.10.2026

### Changed — may break callers

- **A time typed without a zone is read in your zone, and a date alone means local midnight** (cli-core 0.379.0).
  This covers `messages send --at-time`, `chats link create` and `chats link update --expire-time`,
  `chats mute --until` and date-only `time>=` queries, such as `chats events Valencia time>=2026-09-20`. Before,
  some of them read a date alone as midnight UTC. A time with `Z` or an offset is read as before, and JSON and MCP
  output still give every time in UTC with `Z`.

### Fixed

- **`stats chats retention` and `chats stats show` read `--since-time`/`--until-time` in their `--timezone`**, and a
  date alone in retention's `--until-time` covers that whole local day (cli-core 0.380.0). `stats charts`, `contacts
  timeline` and the MCP `stats` tool name the zone in `meta.timezone` and give the UTC window in `meta.window`.

- **The QR login line names the zone of its time:** "valid until 22:00:00 Asia/Vladivostok". Before, it gave the
  computer's local time without saying so.
- **A frozen account's deletion date says it is a UTC date:** "deletes it on 2026-10-03 (UTC)". The `until` field
  is unchanged.

## 0.79.0 — 21.10.2026

### Fixed

- **An action Telegram keeps for Premium accounts now says so** ("that needs Telegram Premium on this account").
  Before, every such refusal, for example a reaction from a free account, said that Telegram transcribes only for
  Premium. `messages transcribe` keeps its own message about Premium and the free trial.
- **A locked or unreachable Linux keyring now warns and falls back to the credentials file** (cli-base 0.47.5). The
  keyring is read through the Secret Service only; before, a failure could end in silent storage in kernel memory,
  which is gone after a logout or reboot.

## 0.78.0 — 21.10.2026

### Changed — may break callers

- **Markdown headings are refused when sending (cli-core parser).** Send text now goes through cli-core's shared
  Markdown parser, as `max` does. A line that starts with `#` used to go out as typed; it now fails with a
  validation error, because Telegram has no headings. Write the line in bold instead. Nothing else changes.
- **A message that sends you to another command names it with your profile:** after a send or an edit with no answer
  from Telegram, "check `tg personal chats list`" replaces "check `tg chats list`", so it can be pasted as it
  stands. The words now come from cli-core.
- **Telegram's account and login refusals, a stopped watch and an unanswered write carry their own error
  `reason`** instead of the generic one for their code: `login.revoked`, `login.duplicated`, `account.deactivated`,
  `account.banned`, `account.frozen`, `account.limited` (were `auth.failed` or `access.denied`), `updates.stopped`
  (was `provider.unavailable`) and `write.unanswered` (was `outcome.unknown`). Codes, exit codes and messages are
  unchanged. Under `--debug`, the record's `cause` now gives the failure behind it, not only its code.

### Fixed

- **Search queries keep an `@` that is followed by a letter inside a term.** E-mail addresses without a dot after the
  `@` and chat ids no longer need quotes: `email:ana@example.com` works as typed.

## 0.77.0 — 20.10.2026

### Новое

- **Хранилище помнит историю чата (версия хранилища 25, cli-core 0.366.0).** Смена id, названия, участия или
  видимости чата в поиске сохраняется в `chat_revisions` со старым и новым значением; чтение по id, который чат
  носил до смены, находит чат, которым он стал. Хранилище переходит на версию 25 при первом открытии; ничего не
  отправляется.

### Исправлено

- **Покинутый чат находится по любому своему id** (cli-core 0.368.0) в `store export`, `store status`, `messages
  thread`, в `--chat` и `chat:` поиска, в тегах, задачах и других чтениях сохранённой истории. `chats track` и
  `store gaps plan` отказывают для него: "you left chat <id>".
- **`tg guide` показывает сценарий memo под тем же названием, что memo и остальные инструменты:** "One person across
  every tool", с заглавной. На cli-core 0.370.0 проверка сценариев в тестах ловит и символы оболочки вне кавычек в
  шаге.

## 0.76.0 — 19.10.2026

### Изменено — может сломать скрипты

- **Без терминала QR-код для входа печатается текстом, чтобы агент вставил его в чат; `--qr-file` удалён.** Агент
  записывал PNG и открывал его в просмотрщике изображений — в окне, которое легко потерять. Теперь `tg <profile> session
  start qr` и `setup` печатают код в stderr обычным текстом (полублоки, без цветов, для тёмной темы терминала), а затем
  говорят агенту вставить его блоком кода точно как напечатано, а обновлённый код вставить снова и сказать, что старый
  истёк. С `--json` каждый код также печатается одной строкой в stderr,
  `{"event":"qr","qr":{"text","expires_at","scan"}}`. В терминале код рисуется как раньше. `--qr-file` удалён из
  `session start` и `setup`. Без терминала вход по-прежнему требует сохранённых ключей приложения и отсутствия 2FA и
  отклоняется до открытия браузера; вход по телефону требует терминала. Вход по-прежнему не доступен через MCP:
  запустите команду ([когда вход запускает агент](./sessions.md#when-an-agent-runs-the-login)).

### Новое

- **`store clear --left` называет чаты, которые удаляет** (cli-core 0.353.0): отказ без `--allow-dangerous`
  перечисляет первые 20, `--dry-run` перечисляет все, а ответ содержит список `left` (`id`, `title`, `messages`).

### Исправлено

- **Из cli-core 0.351.0–0.362.0:** `chats leave` и `chats join` обновляют хранилище, а `chats show` находит чат,
  который вы покинули; отправленное сообщение сохраняется в том чате, где ответил Telegram; чат со сменённым ключом
  сохраняет более строгую приватность из двух половин; чат, скрытый из поиска, не попадает ни в один поиск, который
  его не называет; `last.json` неудачного запуска по расписанию хранит код ошибки, а не название чата; первый
  `serve` после обновления переключает ключи чатов короткими проходами, не блокируя хранилище.
- **`messages forward` возвращает и сохраняет пересланную копию в том чате, куда она ушла.** Раньше он брал первое
  новое сообщение из ответа Telegram, а оно может принадлежать другому чату; теперь он берёт то, на которое указывает
  его id отправки, в целевом чате. Создание темы форума так же читает её первое сообщение.

## 0.75.0 — 19.10.2026

### Исправлено

- **Шаг входа в `setup` называется «Link this device»** и больше не просит отсканировать QR-код до того, как он
  нарисован. Строка под кодом говорит, где сканировать; в узком терминале видна только подсказка расширить окно.
- **Терминал, слишком узкий для QR-кода, больше не просит его отсканировать** (cli-core 0.350.0). `session start` и
  `setup` говорили, где сканировать в Telegram, ещё до кода; если код не помещался, за этим шла только подсказка
  расширить терминал или передать `--qr-file`. Теперь строка о сканировании идёт после нарисованного кода или
  заметки о `--qr-file`, а узкий терминал показывает только подсказку.
- **`tg <profile> setup --help` снова показывает блок Global Options.** 0.74.0 потерял его, когда в строке
  использования появился `<profile>`.
- **Подсказки в ошибках и заметках называют профиль**: «the store is behind this build — `tg personal store migrate`»
  вместо `tg store migrate`, который при копировании падал с «name a profile».

### Новое

- **Следующий шаг в выводе `--json` и в ошибке содержит `line` — всю команду с профилем, которую нужно ввести**
  (cli-core 0.348.0): `"line": "tg personal mcp config"` рядом с `"command": "mcp config"`. Скопированный один `command`
  падал с «name a profile». `command` не изменился, а ответы MCP не содержат `line`.

## 0.74.0 — 19.10.2026

### Новое

- **`tg guide` показывает сценарии: команды для частой задачи по порядку и зачем каждая.** С tg поставляются четыре —
  `catch-up`, `find-what-was-said`, `searchable-files` и `agent-without-send`, — а список указывает на `person-brief`
  из memo для одного человека во всех инструментах. `tg guide <name> --json` выдаёт сценарий как данные. CI проверяет,
  что каждый шаг — команда tg, чьи опции и аргументы разбираются.
- **`--help` каждой команды заканчивается строками Returns, Next usually и Example** (cli-core 0.345.0), и
  `docs/commands.md` содержит те же строки. Строка использования показывает `tg <profile> …`.

### Изменено — может сломать скрипты

- **`npm install -g` устанавливает skill агента, только когда об этом просят.** Раньше он по умолчанию записывал skill
  в `~/.claude/skills` и `~/.agents/skills`, а npm скрывает вывод скриптов установки, так что никто об этом не знал.
  Теперь `TG_INSTALL_AGENT=all` (или имя агента) устанавливает его при установке; иначе его предлагает
  `tg <profile> setup`, или `tg skill install --for all`. Установщик для Windows сам передаёт `all` и не изменился.
- **`tg --help` и `tg` без аргументов показывают короткий первый экран** (cli-core 0.344.0): для чего tg, восемь
  вещей, которых не делает обычный клиент, другие инструменты WireCat и куда идти дальше. Полная справка commander со
  всеми командами и опциями — в `tg --help-all`; только опции — в `tg help options`. Скрипт, который искал команду или
  глобальную опцию в `tg --help`, должен читать `--help-all`.
- **`tg commands` без `--json` печатает текстовый список по разделам, даже при выводе в конвейер**: одна строка на
  команду — использование, что она делает и `(writes)`, если она что-то меняет. Раньше печатался весь документ JSON.
  `--json` и `--jsonl` печатают тот же документ, что и раньше; скрипт, который разбирал вывод `tg commands` без опций,
  должен передавать `--json`.
- **`provider_metadata` чата содержит `null` для выключенного флага или исчезнувшего username**: раньше `isBot`,
  `isForum`, `pinned` и `username` в этом случае пропускались. Хранилище cli-core скоро начнёт сохранять пропущенный
  ключ, и тогда откреплённый чат или удалённый username остались бы в хранилище, а `@old` по-прежнему находил бы чат.
  Все читатели в tg и cli-core считают `null` отсутствием значения, но вывод JSON теперь показывает эти ключи как
  `null`: скрипт, который проверяет наличие ключа, его увидит.

### Безопасность

- **Вход по QR-коду — это `loginQr` из cli-core, как в max и wa.** `--qr-file` записывается во временный файл,
  созданный с правами `0600` и переименованный в нужный путь, а не записывается и затем получает права через chmod; и
  он удаляется, когда вход прерван Ctrl+C, отменой или `--timeout`, а не только когда вход завершился сам. В слишком
  узком для кода терминале ничего не рисуется, и tg предлагает расширить терминал или передать `--qr-file`. Без
  терминала `session start` сообщает "shows a QR code to scan — run it in a terminal, or pass --qr-file <png>".
- **При блокировке только для чтения и в профиле readonly запись отказывает до подключения; отказы видны в
  `sends list`** (cli-core 0.343.0).

### Исправлено

- **`inbox` и `review` объявляют свой вывод**, поэтому `tg commands schema inbox` выдаёт поля сводки сообщений, а
  `--json=<fields>` отказывает на имени, которого у них нет, вместо того чтобы печатать пустые элементы (cli-core 0.345.0).

## 0.73.1 — 18.10.2026

### Исправлено

- **tg запускается немного быстрее.** Сборка на cli-core 0.342.0 и cli-base 0.45.0: команда больше не разбирает
  таблицы правил, нужные только проверкам при разработке, — по
  [замеру](https://github.com/WireCatLabs/cli-testing/tree/main/performance/startup/standards-split-before/README.md)
  это экономит около 7–12 мс на запуск.

## 0.73.0 — 18.10.2026

### Новое

- **Через `tg mcp` агенты получают все команды, которые разрешают уровни профиля** (cli-core 0.341.0). Сервер предлагал
  инструменты, написанные вручную; теперь он строит их из самих команд и выполняет в этом процессе — всего 188 команд,
  среди новых `messages sync`, `contacts sync`, `mentions confirm`, `conversations embed` и `images embed`. Что агенту
  нельзя, решают уровни профиля: задайте области `readonly` или `deny`. Полный список закреплён в
  `contracts/mcp-catalogue.json`.
- **`tg conversations rebuild`** заново строит разговоры в изменившихся чатах и встраивает их моделью на этом
  компьютере; команда не обращается к Telegram, не скачивает модель и никуда не отправляет текст. Она заменяет
  инструмент `conversations_refresh`, который был только у агента.

### Изменено — может сломать скрипты

- **Аргументы инструментов `tg mcp` — это опции команды в snake_case**: `chat`, `limit`, `query`, `sync_first` и так
  далее. Агент, который помнит старые имена, снова спрашивает `tg_tools_search`.
- **`search messages` у агента принимает запрос только текстом**; структурированного ввода `ast` больше нет.
- **Агент не может отмечать прочитанным и действовать как владелец**: `--mark-read` у `messages list`, `inbox` и
  `review` и `--as-owner` ему не предлагаются, настройка `catch_up_marks_read` на его запуски не действует, а его
  отметки `--new` — его собственные.
- **Под `TG_READ_ONLY` локальные записи, которые удаляют или перезаписывают сохранённое вами, запрещены** (cli-core
  0.336.0, 0.337.0): `searches create`, `searches delete`, `searches clear`, `contacts alias set|rm`, `contacts notes
  add|edit|remove`, `contacts link|unlink`, `tags add|auto|remove`, `mentions confirm|reject`, `attachments text set`,
  `chats tracking add|remove`, `conversations links add|clear`, `conversations consents revoke` и `tasks reject`, а
  также их инструменты для агента, завершаются с кодом 5. То, что хранилище восстанавливает само, синхронизация,
  `serve` и учёт задач по-прежнему работают.
- **Пока Telegram ограничивает аккаунт, никакая запись не уходит** (cli-core 0.334.0): реакции, отметка прочитанным,
  тихие закрепления, смена названия и профиля тоже запрещены; чтение работает. Бессрочный бан держит запись, пока
  `tg flood clear` или `tg doctor --online` не увидит, что аккаунт в порядке (`until: null` в JSON).
- **Отправка, заблокированная чужой блокировкой процесса, завершается с кодом 9 (`timeout`), а не 1** (cli-core
  0.338.0); ничего не отправлено, так что повторить безопасно. `flood clear` тоже.
- **`tg upgrade --offline` завершается с кодом 2** (cli-core 0.338.0), вместо того чтобы всё равно спросить npm.
- **`conversations build`, `conversations embed` и `search conversations` предупреждают, что могут отправить текст
  наружу** (cli-core 0.334.0, 0.336.0): с `--analyze`, `--provider` или удалённой моделью эмбеддингов. Под
  `TG_READ_ONLY` они отказывают до отправки; локальная модель по-прежнему работает. Через `serve` они не выполняются
  никогда.

### Исправлено

- **`tg mcp` отвечает на каждый вызов, полученный до закрытия stdin**, а не завершается, пока один ещё выполняется.
  `tg bot mcp` пока нет.
- **Агенту не предлагается `offline` для команды, которая его отклоняет** (cli-core 0.335.0): `topics`, `chats events`,
  `chats inspect`, `chats members audit`, `chats members fetch` и команды `chats folders`.
- **Занятая блокировка больше не задерживает `tg serve`** (cli-core 0.340.0) на время до 5 секунд.
- **Два одновременных изменения списка получателей больше не отменяют друг друга** (cli-core 0.338.0).
- **`tg store gaps repair --background` выполняет свою задачу**, а не сразу падает (cli-core 0.339.0).
- **Подсказки команд `server` и обслуживания хранилища называют профиль** (cli-core 0.339.0).
- **`tg upgrade --check` работает под `TG_READ_ONLY`** (cli-core 0.338.0).
- **Скачивание моделей никогда не идёт через `tg serve`** (cli-core 0.336.0).
- **Хранилище, которое не удалось открыть, закрывается** (cli-core 0.332.0), так что его папку можно удалить в Windows.

## 0.72.0 — 18.10.2026

### Новое

- **`tg tasks agenda` показывает, что вам должны другие** (cli-core 0.328.0): открытые задачи, которые делает кто-то
  другой, от старых к новым, с исполнителями, в разделе «assigned» и в поле `assigned` в JSON.

### Изменено — может сломать скрипты

- **Путь команды одним аргументом — ошибка** (cli-core 0.328.0): `tg 'chats list' --help` печатал общую справку и
  завершался с кодом 0; теперь команда завершается ошибкой и показывает, какую строку запустить.
- **Интерактивная команда без терминала по умолчанию ждёт 5 минут, а не 30 секунд** (cli-core 0.328.0), чтобы
  `tg session start --qr-file` у агента не обрывался, пока код не отсканирован. `--timeout` и `TG_TIMEOUT`, если они
  заданы, по-прежнему решают сами.
- **Под `TG_READ_ONLY` запись, которая сначала спрашивает, останавливается с кодом 5 до вопроса, а не с кодом 7**
  (cli-core 0.329.0): `messages delete`, `topics delete`, `account sessions end`, `chats delete` и `chats clear`
  говорили «спрашивает, прежде чем действовать», как будто `--allow-dangerous` их пропустит. Теперь они говорят
  «этот процесс только для чтения», как и любая другая запись. Без блокировки они спрашивают, как раньше.

### Исправлено

- **Меньше ложных подсказок о дубликатах из-за цепочек ответов** (cli-core 0.331.0): ответ, в котором просят о чём-то
  новом, больше не помечает две задачи как, возможно, одну и ту же.
- **`tg chats list --json | head` завершается тихо** (cli-core 0.328.0), в том числе через запущенный `serve`, а не
  печатает трассировку стека, когда читатель останавливается.

### Безопасность

- **`tg session end` больше не выходит из аккаунта у запущенного `tg serve`** (cli-core 0.328.0): когда для профиля
  работал `serve`, `session end` передавался на выполнение `serve`. Он выходил из подключения, которым пользовался
  `serve`, и удалял файл сессии, который `serve` ещё держал открытым. Теперь `session start`, `session end` и `setup`
  никогда не выполняются через `serve`, а `session end` останавливается с кодом 2 и просит сначала выполнить
  `tg <profile> server stop`. Под `TG_READ_ONLY` все три по-прежнему останавливаются с кодом 5, теперь с сообщением
  «нельзя войти или выйти».

## 0.71.0 — 17.10.2026

### Изменено — может сломать скрипты

- **В группе с тегом `watch-tasks` вопрос закрывает ответ любого участника** (cli-core 0.325.0): прямой ответ от
  кого-то, кроме спросившего, закрывает вопрос; более позднее сообщение, которое не отвечает на него, ничего не закрывает.
- **Инструменты `tg <bot> bot mcp` — это сами команды бота** (cli-core 0.325.0): аргументы агента — собственные
  аргументы команды в snake_case: `messages send` и `messages edit` принимают `md` или `html` вместо `format`,
  `messages delete` принимает `messages` (список), `search messages` — `query`, `chats members remove` —
  `person`. Новое: `chats rules show` и `offline` у каждого чтения. Отправка файлов, `--allow-dangerous` и
  `chats moderate --max-actions` остаются за владельцем. Каталог зафиксирован в `contracts/bot-catalogue.snap`.

## 0.70.0 — 17.10.2026

### Что нового

- **`tg <profile> contacts link <person> me`** (cli-core 0.323.0): указать, что контакт — это вы, для вашего
  аккаунта, который хранилище не может сопоставить само, например `zoom:<id>`.

### Исправлено

- **Упоминания реже находят неверные имена** (cli-core 0.323.0). Отдельное слово из имени контакта учитывается само по
  себе, только если это имя или фамилия; контакт с названием как у компании («Smart Agents») находится только по полному
  названию, а вежливые «Ваш», «Вам», «Вас» не учитываются никогда. Имя святого в названии места («Saint Michael's
  Bridge») и город после «в»/«во» («во Владимире») — тоже не имена.
- **Ваши собственные аккаунты — это вы** (cli-core 0.323.0): собственная личность аккаунта связывается с вами при
  следующей синхронизации, так что ваше имя в ваших сообщениях больше не принадлежит кому-то другому.
- **Адрес сохраняет свой город** (cli-core 0.323.0): одна и та же улица в двух городах — два места; адрес, записанный
  без города, по-прежнему совпадает со своим местом на этой улице.

После обновления один раз перечитайте старые сообщения: `tg <profile> mentions rebuild person-name place`.

### Безопасность

- **`TG_READ_ONLY` теперь запрещает вход и выход, а также изменения хранилища сообщений**: `session start`, `session end`
  и `setup` отказывают с `permission_error` до подключения, как и `store reset`, `restore`, `clear`,
  `migrate`, `repair`, `copies delete` и `decrypt`. Раньше `session end` выходил из аккаунта и удалял сессию при
  включённой блокировке.

## 0.69.0 — 17.10.2026

### Изменено — может сломать скрипты

- **Агент больше не может удалять сообщения для всех** (cli-core 0.321.0). MCP `messages delete` не принимает
  `for_everyone`, и такой аргумент отклоняется как неизвестный; у владельца остаётся
  `tg <profile> messages delete --for-everyone`.
- **`mcp --permission` только ужесточает** (cli-core 0.321.0). Переопределение, которое ослабило бы уровень профиля,
  например `messages.send=allow` для профиля только для чтения, отклоняется при запуске с названием ключа; чтобы
  разрешить больше, измените разрешения профиля. `--permission messages.send=deny` и другие сужающие переопределения
  работают как раньше.

### Исправлено

- **Запрет агенту на `chats send-as` и `chats members list` теперь действует** (cli-core 0.321.0). Через MCP эти
  команды брали уровни из других ключей, поэтому `chats.send-as` и `chats.members.list` до них не доходили.

## 0.68.0 — 17.10.2026

### Изменено — может сломать скрипты

- **Задачи открываются только там, где что-то спрашивают у вас** (cli-core 0.318.0). В личном чате каждый вопрос,
  на который вы не ответили, открывает задачу, как и раньше; в группе — только вопрос в ответ на ваше сообщение и
  упоминание вас; в канале или «Избранном» — ничего. В хранилище владельца 300 постов одного канала раньше открыли бы 85.
- **`tasks apply` теперь называется `tasks scan`** (cli-core 0.320.0); MCP `tasks_scan`, ключ разрешения `tasks.scan`.
- **Ни одна настройка больше не выбирает профиль** (cli-core 0.319.0). Команда называет профиль первым словом или
  через `TG_PROFILE`. Файл настроек, в котором ещё есть `default_profile`, останавливает команду без профиля и
  подсказывает, какой профиль ввести и `tg config unset default_profile`; `tg config set default_profile` отклоняется.
  Профиль с именем `default` — обычное имя: `tg default mcp config` называет свой сервер `tg-default`, а не `tg`.

### Что нового

- **У задач есть исполнители** (cli-core 0.320.0): `tasks add` и `tasks plan` принимают `--assignee sender` (тот, кто
  отправил сообщение) или `--assignee person:<id>`; `none` убирает исполнителя. `tasks list "assignee:any state:open"` —
  это то, что вам должны другие.
- **`tg <profile> tags add --chat <group> watch-tasks`** записывает каждый вопрос в этой группе как задачу, кому бы
  он ни был адресован.

### Исправлено

- **Подсказка `tg upgrade` об отложенном обновлении называет пакет и сохраняет исключение pnpm по возрасту релиза**
  (cli-core 0.320.0).

## 0.67.0 — 17.10.2026

### Безопасность

- Внутренние ссылки вложений не попадают в JSON, JSON lines, MCP и поток событий (Core0.315.0); медиа-ключи и учётные данные провайдера остаются внутри клиента.

- Файлы состояния WhatsApp нельзя загрузить как вложение (Core 0.314.0), в том числе при изменённых путях состояния и через символические ссылки. Обычные соседние файлы по-прежнему разрешены.

## 0.66.0 — 17.10.2026

### Изменено — может сломать скрипты

- **Первая синхронизация не открывает задач из истории** (cli-core 0.309.0). После первой синхронизации аккаунта
  правила задач открывают не больше `task_first_pass_per_chat` задач на чат, по умолчанию 0. В ответе синхронизации
  `tasks` считает, что было отложено (`held`, `held_chats`), а примечание называет `tasks apply`. Следующие
  синхронизации по-прежнему открывают задачи из новых сообщений. `tg <profile> config set task_first_pass_per_chat 50`
  возвращает прежнее поведение.

### Что нового

- **`tg <profile> tasks apply <chat...>`** (cli-core 0.309.0): правила задач над последними сохранёнными сообщениями
  чата (`--last`, по умолчанию 50) — для чата, историю которого вы хотите превратить в задачи. Команда показывает,
  что откроется, и ничего не меняет без `--yes`. Только локальное хранилище. MCP: `tasks_apply`.

- **Упоминания находят почтовые адреса и имена людей, которых хранилище ещё не знает** (cli-core 0.308.0).
  `tg <profile> mentions places` показывает подтверждённые адреса во всех аккаунтах. Хранилище переходит на версию
  18 с таблицей `places`, когда его впервые откроет команда.

### Исправлено

- **`tg upgrade` через pnpm ставит самую новую версию** (cli-base 0.40.2). pnpm 11 ставит только версии старше
  суток, поэтому обновление могло поставить `tg` старее того, что у вас был. Теперь для `@wirecat/*` это ожидание
  снято; для остальных пакетов оно остаётся.
- Краткие описания в справке `mentions` укладываются в общий предел 80 символов (cli-core 0.311.0).
- **Проверка дубликатов сравнивает задачи по времени отправки их сообщений** (cli-core 0.310.0), а не по времени
  записи задачи. Задачи, записанные из истории за один раз, больше не выглядят одинаковыми.
- **Старые сообщения, загруженные в тихий чат, не открывают задач** (cli-core 0.309.0): проход синхронизации
  пропускает чат, в котором ничего не отправлено с прошлого прохода.
- **Нет строк `[client] cannot reach Telegram`, пока tg не может подключиться.** С 0.64.0 tg печатал каждую фоновую
  ошибку mtcute одной строкой; без сети это строка на каждую попытку подключения. Теперь они видны только с
  `--verbose`. Запрос, который не удался, по-прежнему сообщает свою ошибку.

## 0.65.0 — 17.10.2026

### Что нового

- **Карточка закрытой задачи показывает задачу, которая её продолжает** (cli-core 0.305.0). `tasks show` печатает
  `task:<id> follow-up-of this task`, а `--json` и MCP возвращают `linked_from`. Раньше закрытую задачу называла
  только новая.

### Изменено — может сломать скрипты

- **Ежедневная строка «вышла новая версия» молчит и для `--json=…`, `--timeout=…` и других тихих параметров,
  записанных через `=`** (cli-core 0.307.0). Раньше её отключал только параметр без значения. Теперь tg берёт это
  уведомление из cli-core, общее с max и memo.

### Исправлено

- **`tg setup --app auto` читает ключи приложения на обновлённом my.telegram.org.** Сайт теперь показывает api_hash
  точками и хранит его значение в кнопках копирования и показа, поэтому 0.64.0 останавливался с «could not read its
  keys». Теперь ключи читаются оттуда (проверено на настоящей странице), создание считается выполненным, когда сайт
  отвечает OK, и показывается текст ошибки самого сайта, а не его JSON.

- **Сломанный файл настроек называется в короткой ошибке** (cli-core 0.304.0): первый неверный ключ, никогда не его
  значение.

## 0.64.0 — 16.10.2026

### Что нового

- **Импортированные документы Drive сохраняют ссылку Google и время правки в общем поиске** (cli-core 0.301.0).
  `--source drive:<profile>` выбирает зарегистрированный профиль Drive; списки документов чата могут показывать
  импортированное название, после того как синхронизация Drive свяжет сохранённые сообщения.

- **Сервер MCP загружается, только когда MCP запущен** (cli-core 0.300.0), поэтому другие команды при запуске
  загружают примерно на десятую часть меньше файлов.

### Исправлено

- **`tg setup --app auto` больше не пытается создать второе приложение, когда у аккаунта оно уже есть.** Он читал
  ключи приложения только из одной точной разметки страницы; когда my.telegram.org показывал страницу приложения в
  другом виде, tg считал, что приложения нет, и просил сайт создать ещё одно (Telegram разрешает одно на номер).
  Теперь ключи читаются из текста страницы, а страница приложения, ключи которой прочитать нельзя, останавливает
  настройку с «use `--app browser`». Ошибка сайта больше не цитирует всю страницу, где мог быть `api_hash`
  приложения, — только её заголовок. Подсказка после неудачного шага с приложением называет выполненную команду
  (`tg <profile> setup --app browser`), а слишком много попыток ввести код сайта — это `rate_limited`.

- **Вход с паролем 2FA больше не печатает стек mtcute «unhandled error: ConnectionClosedError».** После успешного
  входа mtcute намеренно заменяет свои соединения. Старое соединение сообщало, что закрыто, и без слушателя mtcute
  печатал это красным стеком с id аккаунта сразу после скрытого запроса пароля. Теперь tg слушает эти фоновые
  ошибки: ожидаемое закрытие видно только с `--verbose`, а любая другая ошибка выводится одной строкой словами tg.

- **`bin/release` перезапускает себя один раз, когда выпуск приносит более новый `bin/release`**: свёртка истории
  изменений и повышение версии перематывают `main`, а оболочка продолжала читать старый скрипт с того байта, где
  остановилась, и остаток запуска был смесью старого и нового текста. Теперь новый скрипт запускается заново с
  теми же аргументами; второе изменение во время этого запуска останавливает его с `run it again`. Перезапуск
  работает и тогда, когда `bin/release` запущен из другой папки по относительному пути. Это касается только выпуска
  самого репозитория; опубликованный пакет не меняется.

## 0.63.0 — 16.10.2026

### Что нового

- **`messages delete` принимает id сообщений через запятую, а не только через пробел** (cli-core 0.299.0).
- **tg запускается примерно на пятую часть быстрее после первого запуска.** Он хранит скомпилированный код Node в
  кэше, во временной папке системы (`NODE_COMPILE_CACHE` переносит его): `tg --help` стал занимать около 0.49
  секунды вместо 0.60.
- **Список категорий задач хранится в одном файле, общем для tg, MAX и memo** (cli-core 0.298.0):
  `~/.config/WireCat/config.json`, раздел `task_categories`. В нём только ваши изменения списка по умолчанию:
  `"garden": "plants | seedling, es:planta"` добавляет или заменяет категорию, `"religion": null` убирает категорию
  по умолчанию, а категории, которые добавит следующий выпуск, всё равно появятся. `tasks categories` (MCP
  `tasks_categories`) называет файл в `file`, а `config show` отмечает категории, которые взяты из него. Файл с
  неверным JSON или с неверной категорией отклоняется с указанием его пути. Хранилище, перенесённое через
  `MESSAGING_STORE`, читает `config.json` рядом с собой; `WIRECAT_CONFIG_DIR` переносит файл.

### Изменено — может сломать скрипты

- **`config set task_categories.<name>` и `config unset task_categories.<name>` теперь пишут в
  `~/.config/WireCat/config.json`, а не в хранилище**, и сохраняют другие разделы файла;
  `config unset task_categories` убирает раздел. Список, который старая версия tg сохранила в хранилище, переходит в
  файл при следующем `config set` или `unset` категории; до этого действует список из хранилища. Старые версии tg
  не читают этот файл.

## 0.62.0 — 16.10.2026

### Что нового

- **Закрытие задачи агентом может ждать вас** (cli-core 0.295.0): `tasks close`, запущенная ИИ-агентом (задана
  `AI_AGENT` или `CLAUDECODE`), указывает уверенность через `--certainty <0..1>`. Ниже порога хранилища
  (`config set task_agent_close_min`, по умолчанию 0.8) или при `config set task_agent_close off` задача остаётся
  открытой с предложением закрыть; его показывают `tasks list close:suggested` и `tasks agenda`. Подтвердите его
  командой `tasks close <task>` или отклоните новой `tasks reject <task>`. `--as-owner` закрывает от вашего имени.
- **Новая задача о задаче, закрытой за последние 14 дней, открывается как её продолжение**: она связана
  `follow-up-of` с закрытой, а не отклоняется как дубликат. Её по-прежнему отклоняют, пока открытая задача может
  быть той же работой.
- **`tasks categories` называет категории, которых больше нет в списке**, но которые ещё стоят у задач, с числом
  открытых задач и всего (`unlisted`); `tasks agenda` перечисляет те, что стоят у открытых задач
  (`unlisted_categories`).

### Изменено — может сломать скрипты

- **`tasks close` от агента должна передать `--certainty`** (MCP `tasks_close`: обязательный `certainty`), иначе
  она завершается ошибкой `task.certainty-required`. Ниже порога ответ содержит `state: open` и `close_suggestion`
  вместо закрытой задачи. Скрипту, который закрывает задачи из терминала агента, нужен `--certainty` или
  `--as-owner`, если закрыть попросил владелец.
- **`tasks add` теперь может отклонить задачу, сообщение которой разделяет слова с сообщением открытой задачи**
  (код выхода 2, `task.duplicate-candidates`): проверка дубликатов читает и исходное сообщение задачи, и её
  новейшие связанные сообщения, поэтому задача правила с пустым заголовком сравнивается по своему сообщению.
  Повторите с `--into <task>` или `--new`.
- **59 категорий задач по умолчанию вместо 7**, например `bills`, `health`, `travel`, `fitness` и `subscriptions`;
  `tasks categories` печатает каждую с её смыслом и словами-признаками. Старые семь сохраняют имена, поэтому
  сохранённые задачи остаются верными, но правило теперь выбирает более узкое имя: счёт за коммунальные услуги —
  это `bills`, а не `money`. Поэтому фильтр вроде `category:personal` ловит меньше новых задач. Хранилище, где
  сохранён свой список, сохраняет его; `config unset task_categories` берёт новый список по умолчанию. В списке до
  80 категорий.

### Исправлено

- **Испанский текст задач читается лучше**: категория правила совпадает с другими формами испанского
  слова-признака (`pagues` попадает в `pagar`), а проверка дубликатов читает испанские сроки, такие как `mañana`
  или `el viernes`.

## 0.61.0 — 16.10.2026

### Изменения, которые могут затронуть скрипты

- **`tg mcp` и `tg bot mcp` больше не принимают старые флаги доступа** `--allow-send`, `--allow-mark-read`,
  `--allow-delete`, `--allow-moderate`, `--confirm-send`, `--allow-dangerous` и `--http-confirmation` (cli-core
  0.292.0). Запись приложения, где остался такой флаг, перестаёт запускаться с ошибкой «unknown option»: уберите
  флаг; решают разрешения профиля, как и раньше.

### Исправлено

- **Скрипты выпуска показывают живых держателей блокировки отдельно от устаревших меток выпуска.** Общая
  диагностика больше не приписывает живую блокировку прошлому запуску; дождитесь, пока держатели закончат, и
  повторите.

- **Вход, который падает при открытии, больше не оставляет клиент Telegram открытым**: если не удалось загрузить
  вошедшего пользователя, адаптер закрывает клиент и файл сеанса до того, как ошибка дойдёт до команды.

## 0.60.0 — 15.10.2026

### Изменения, которые могут затронуть скрипты

- **Задачи и сервер используют имена общего словаря**, без псевдонимов (следующий cli-core, cli-base 0.33.0):
  `tasks similar` → `tasks related`; `tasks duplicates unsure` → `tasks duplicates defer` (ключ разрешения
  `tasks.duplicates.defer`; сохранённое решение по-прежнему `unsure`); `tasks add --attach` → `--into`;
  `tasks claim
--for` → `--lease`; `tasks agenda --due` → `--due-within`; `server logs --lines` → `--limit` (`-n` сохранён).
  В MCP: `tasks_related`, `tasks_duplicates_defer`, `into`, `lease`, `due_within`.
- **`tasks agenda` и `tasks duplicates` фильтруются полями запроса, не флагами**: `tasks agenda --tag <name>` →
  `tag:<name>`, `--category <name>` → `category:<name>`, `--claimed` → `claimed:any`;
  `tasks duplicates --unsure` → `decision:unsure`. В MCP `tasks_agenda` и `tasks_duplicates` принимают `query`.

## 0.59.0 — 15.10.2026

### Изменения, которые могут затронуть скрипты

- **Флаги используют имена общего словаря**, без псевдонимов (следующий cli-core):
  `chats members audit|fetch --budget` → `--max-pages`; `messages sync --estimate` → `--dry-run`;
  `contacts context --refresh`, `bot contacts show
--refresh` и `tags auto --refresh-metadata` → `--sync-first`;
  `search conversations --refresh` → `--catch-up`; `attachments show --if-sha256` → `--expected-fingerprint`;
  `replies edit --chats|--not-chats|--people|--not-people` → `--allow-chats|--deny-chats|--allow-people|--deny-people`;
  `schedule agent|command --once` → `--at-time`; `bot chats moderate --no-ban` → `--no-block`;
  `chats mark-read --until` → `--until-id`; `tasks add|plan --check` → `--remind-time`;
  `store export --to` → `--output-dir`, а `--kind` → `--include`; `bot store fetch --from` → `--until-id`.
  Аргументы MCP следуют этим именам: `max_pages`, `until_id`, `expected_fingerprint`, `sync_first`, `remind_time`.

## 0.58.0 — 15.10.2026

### Что нового

- **Задачи об одной работе** (cli-core 0.285.0): `tasks similar <task>` оценивает похожие задачи;
  `tasks duplicates [--unsure]` показывает найденные правилами пары; `tasks merge <task> --into <other>`
  объединяет их, а `tasks unmerge` отменяет объединение; `tasks duplicates reject|unsure` решает судьбу пары.
  `tasks agenda` принимает `--category` и `--tag`, `config set task_categories.<name>` меняет категории всего хранилища.
- **Упоминания** (cli-core 0.285.0): `mentions domains` показывает сайты из ссылок; `mentions list --new` —
  найденное после последнего просмотра; `mentions confirm|reject <id> --all-in-chat` решает все случаи имени
  в одном чате; ссылка `t.me` указывает на чат или человека. `config set phone_countries es,ru` читает номера без `+`.
- **Версия хранилища 16**: правила упоминаний также читают текст заметок и сохранённых документов;
  один `mentions rebuild` обрабатывает прежние записи. `mentions list` по-прежнему показывает только упоминания
  в сообщениях. Добавляются лишь триггеры, поэтому старый tg продолжает открывать хранилище.

### Изменения, которые могут затронуть скрипты

- **`tasks add` отклоняет возможный дубликат** открытой задачи или закрытой за последние 14 дней
  (cli-core 0.285.0): код 2, причина `task.duplicate-candidates`, кандидаты в `details.candidates`.
  Повторите с `--attach <task>`, чтобы связать сообщение с задачей, или `--new`, чтобы всё же создать новую;
  это действует и в `tasks add` через MCP.
- **`phone:` и `value:` также сопоставляют конец сохранённого номера с национальными цифрами запроса**
  (от 8 цифр, cli-core 0.285.0). Номер, сохранённый до `phone_countries`, находится обоими способами.
  Российский городской номер в группах, `(812) 000-00-01`, сохраняется как `+78120000001`, а не голые цифры.
- **tg больше не ищет почту** (cli-core 0.285.0, cli-core#1121): `tg search mail` и MCP `search_mail` удалены,
  `search all` читает сообщения и заметки, но не почту; `--only mail` отклоняется. `tg search mail …`
  отвечает ``mail is memo's: install @wirecat/cli-memo, then `memo search mail …` ``.
  `search notes`, задачи, заметки и теги остаются.

### Исправлено

- Название с кириллическими заглавными буквами находится запросом в нижнем регистре (cli-core 0.285.0).
- **Вредоносное HTML-вложение больше не задерживает чтение** (cli-core 0.285.0): страница с незакрытыми
  тегами или комментариями обрабатывается за время, линейное её размеру.

## 0.57.0 — 15.10.2026

### Изменения, которые могут затронуть скрипты

- **`bot api --allow-any-file` находится на `bot api`**, а не каждой операции с файлами: укажите его один раз
  до или после имени метода, и каждый файл `@path` вызова можно читать из защищённых мест. Без него
  файлы `@path` из каталогов учётных данных, собственных папок `tg` и локального хранилища отклоняются до подключения.
- **`tasks add` требует `--category <name>`** (cli-core 0.282.0): money, documents, meeting, delivery, access,
  personal или other; `tasks categories` показывает список. Задачи получают ключи вроде `Q-15`;
  `tasks claim` / `tasks release` занимают задачу для одной сессии агента.
- **`permissions` — единственная настройка доступа** (cli-core 0.282.0): файл с `read_only` или `allow`
  отклоняется из-за неизвестного ключа, `config migrate` удалён. Настройки читаются только в snake_case;
  `config set` больше не принимает camelCase.
- **Один язык поиска** (cli-core 0.281.0): `--language` и `--regex` удалены из `search messages` и
  `searches create`; используйте Lucene, например `body:/.*invoice.*/`. `conversations embed --workers` удалён.
  Сохранённый в старом языке поиск отклоняется: сохраните его заново.
- **Нет переноса папок при запуске**: прежние папки в `~/Library` больше не перемещаются.

### Что нового

- **`messages sync` открывает задачи по сохранённым сообщениям** (cli-core 0.282.0): неотвеченный вопрос,
  упоминание вас; закрывает после вашего ответа.
- **Совпадение по заголовку идёт первым в `search notes` и `search all`** (cli-core 0.281.0).

### Исправлено

- **Уведомление об обновлении называет `tg upgrade` и молчит лишь во время `upgrade`** (cli-base 0.29.0):
  `tasks update` больше не отключает его.
- **Вложенные пути полей `--json` работают через списки** (cli-base 0.31.1, cli-core 0.283.0).

## 0.56.0 — 14.10.2026

### Изменения, которые могут затронуть скрипты

- **`store export` сохраняет файлы в том же виде, что выводит на экран** (cli-core 0.276.0): файлы `--output`
  и папки `--to` содержат те же записи (`chat_id`, `sender_name`, `ref`…). Папка от прежней версии
  отклоняется с сообщением "export into a new folder".

- **`bot api` отклоняет файлы `@path` из защищённых мест**: известные файлы и папки учётных данных, собственные папки `tg` и локальное хранилище — до подключения, как `bot messages send --file`; `--allow-any-file` на операции с файлами разрешает отправить их. Файл больше 256 МиБ отклоняется без загрузки в память.

### Что нового

- **`config set` и `config unset` принимают имена настроек в camelCase** (cli-core 0.279.0): `tg <profile> config set senderColors false`
  сохраняет `sender_colors`, как и написание в snake_case.
- **Возобновляемая синхронизация** (cli-core 0.276.0): прерванный sync сохраняет обработанное,
  а следующий запуск продолжает с этого места.

### Исправлено

- **Отказ Telegram по лимиту до отправки разрешает повтор**: если `messages send`, `messages forward` или
  `polls create` получает FLOOD_WAIT до того, как Telegram принял сообщение, `retry.safe` равно `true`
  и указано `after_ms`. Если Telegram уже принял его, а лимит пришёл при проверке результата,
  `retry.safe` остаётся `false`.

## 0.55.0 — 14.10.2026

### Что нового

- **Файлы читаются с диска по ходу отправки** (cli-core 0.272.0). `messages send --file`, `--photo`, `--voice`, фото
  профиля и `tg bot` больше не читают весь файл в память заранее, и отказ для файлов от 2 ГиБ убран: действует
  собственный лимит Telegram.

### Изменено — может сломать скрипты

- **Непрослушанное голосовое сообщение указывается в `missing`** (cli-core 0.274.0): `review`, `inbox` и `messages list`
  добавляют `{field: "transcript", step: "messages.transcribe"}` для каждого голосового сообщения без сохранённой
  расшифровки, поэтому ответ, в котором есть только голосовое сообщение, больше не выглядит полным.
- **`tasks link <task> task:<id>` записывает связь между двумя задачами** (cli-core 0.274.0), с
  `--kind
  blocked-by`, `follow-up-of` или `related-to`.
- **Следующий шаг с командой, которая меняет только этот компьютер, никогда не выполняется без спроса** (cli-core
  0.273.0): шаги `server restart` и `store reindex` содержат `safe_to_auto_execute: false`.
- **`mentions rebuild` принимает вид упоминаний аргументом**: `tg <profile> mentions rebuild person-name`, а не
  `--kind` (cli-core 0.272.0).

## 0.54.0 — 14.10.2026

### Что нового

- **`tg images embed`: поиск картинок по тому, что на них изображено** (cli-core 0.268.0). Выключен, пока не задано
  `tg <profile> config set picture_search true`; один раз загрузите модель командой
  `tg <profile> models image download clip-b32` (около 155 МБ), затем выполните `tg <profile> images embed [--chat] [--limit]`.
  После этого `search messages` возвращает рядом с найденным список `pictures`. Запросы по картинкам пишутся на английском.

- **`tg mentions`: телефоны, e-mail, ссылки и документы Google, найденные в сохранённых сообщениях** (cli-core 0.264.0,
  версия хранилища 7). `mentions list kind:phone`, `mentions list domain:google.com`; простое слово — это значение,
  записанное как угодно, поэтому `89001234567` находит `+79001234567`. `mentions show <id>` показывает текст вокруг
  упоминания. Для сообщений, сохранённых до этой версии, нужно один раз выполнить `tg <profile> mentions rebuild`;
  новые читаются при сохранении.

- **Упоминания в файлах и голосовых сообщениях** (cli-core 0.269.0, версия хранилища 10). Текст, прочитанный
  `attachments
  extract`, и расшифровка голосового сообщения тоже дают упоминания, с `field` `file_text` или
  `transcript`. Для вложений с текстом, полученным до версии 10, нужно один раз выполнить
  `tg <profile> mentions rebuild`, который теперь также считает `attachments`.
- **`tg mentions confirm <id> [person:<uid>|organization:<id>]` и `mentions reject <id>`** решают, кому принадлежит
  телефон или адрес, или отклоняют его навсегда. Организация может владеть телефоном или адресом отдельно от любого
  человека (версия хранилища 11; старые сборки продолжают работать).
- **`phone:`, `email:`, `url:` и `domain:` в поиске сообщений** находят сообщения по тому, что упомянуто в их тексте:
  `phone:"8 900 000-00-01"`, `email:"ana@example.com"`, `domain:docs.google.com`. У почты упоминаний пока нет.
- **О сбоях расписания сообщается перед любой другой командой** одной строкой в stderr, пока следующий запуск не
  пройдёт успешно; `schedule list` показывает серию сбоев.

### Изменено — может сломать скрипты

- **`contacts timeline` разбивается на страницы, как любой другой список:** список, обрезанный по `--limit`, отвечает
  `page.has_more: true`, `page.cursor` и шагом `page.next` (`--cursor` продолжает); `meta.truncated` остаётся для
  изменений, которые ещё в очереди. Заметки «cut at --limit» в stderr больше нет.
- **Собрано на `@wirecat/cli-core` 0.269.0 и `@wirecat/cli-base` 0.27.2.**
- **Каждый ответ — обёртка с ключами в snake_case.** Список — это `{items, page: {limit, has_more, cursor?}, next?,
  missing?, meta}`, один объект — `{item, next?, missing?, meta}`; `meta.run_id` называет запуск. Это касается каждой
  команды: сообщения, чаты, контакты, запись (`{item: {operation_id, send_id, message}}`), inbox, review, поиск,
  статистика, хранилище, аккаунт, doctor, config, runs, `upgrade`, `bot *`, а также собственные `session start|end` и
  `setup` в tg (`app_keys`, `already_logged_in`, `chats.has_more`). Что выполнить дальше, указывает шаг `next` вместо
  полей вроде `nextBeforeId`, `nextOffset`, `nextCursor` и `hasMore`. Ответы MCP — те же обёртки, и инструменты MCP
  отклоняют аргументы, которых не принимают.
- **Списки принимают запрос, а не параметры фильтрации.** `chats list kind:group unread_count>0`,
  `chats events "Hiking" time>=7d`, `messages list "Book club" id<4242`, `contacts list notes:<text>`,
  `attachments list chat:<id> is:needs_text`, `store jobs list state:failed`, `inbox date>2h`,
  `review date>3d chat:<id>`, `search messages 'chat:"Book club"
  lease'`.
  `--search`, `--kind`, `--unread`, `--type`, `--since-time`, `--before-id`, `--after-id`,
  `--before-time`, `--after-time`, `--topic`, `--search-notes`, `--min-score`, `--revoked`, `--link`, `--answer`,
  `--needs-text`, `--state`, `--chat` у review и `--chat` у search убраны из этих команд. `messages
  evidence` и `chats media` продолжают через `--cursor` из `page.next`. `contacts list name:` требует сохранённых контактов.
- **Блок Telegram в `doctor` — в snake_case:** `app_credentials`, `keyring_moved_by_environment`, `proxy.bot_api`.
- **Подробности ошибок — в snake_case:** `provider_error` (было `providerError`); группа, ставшая супергруппой, сообщает
  `migrated_chat_id` в отказе Bot API; преобразование в форум, которое могло произойти, сообщает `previous_chat_id` и
  `chat_id`.
- **Настройки файла конфигурации — в snake_case** (`keep_runs_for_days`, `sends_per_hour`, `read_only`, `default_profile`,
  …). Существующий файл переводится сам при первом чтении.
- **Журналы запусков — в snake_case** (`duration_ms`, `error_code`, `error_class`, `provider_error`); запуски, записанные
  раньше, по-прежнему читаются.
- **Отчёты статистики отклоняют `--jsonl`**: отчёт — это один объект. `stats chats show` называет свой чат ссылкой
  `chat:`; `stats tasks show` отвечает одним объектом с `open` и `rows`.
- **`--json=<fields>` заменяет `--fields` и `--agent-json`, которые убраны.** `--json=id,text` оставляет эти поля
  у каждого объекта. JSON в CLI сохраняет текст сообщений как он написан; ответы MCP по-прежнему показывают невидимые символы.
- **`tags list`, `tasks list` и `conversations list` принимают запрос вместо параметров фильтрации.**
  `tags list tag:work type:chat`, `tags list sources:auto`; `tasks list state:open kind:promise chat:<id>`;
  `conversations list <chat> started_at>=7d`. `--tag`, `--type`, `--source`, `--state`, `--chat`, `--before-time`
  и `--since-time` у этих списков убраны. Элементы — общие сущности: тег называет то, на чём стоит, как `target`,
  обсуждение сообщает `messages_count`, `started_at`, `first_message`.
- **Записи запусков хранят только перечисленные ключи атрибутов.** Id сообщения в `ids.message` пока отбрасывается,
  поэтому `runs search <message id>` его не находит (сообщено в cli-core).

### Исправлено

- **Промпты MCP называют только аргументы, которые принимают инструменты.** `review` передаёт своё окно как `query`
  (`date>"…"`).
- **`tg <profile> bot messages delete` принимает больше 100 сообщений.** Он отправлял все id одним вызовом, а Telegram
  принимает не больше 100, поэтому более длинный список завершался ошибкой. Теперь он отправляет их по 100; если
  следующий вызов не удаётся, ошибка говорит, сколько уже удалено.

## 0.53.0 — 14.10.2026

### Изменено — может сломать скрипты

- **Собрано на `@wirecat/cli-core` 0.262.0 и `@wirecat/cli-base` 0.26.0.** `@wirecat/cli-core` — новое имя
  `@wirecat/cli-messaging`; его версия 0.262.0 следует за 0.261.0. Команда проверки соответствия — `cli-core-parity`.
  Ключи машинного вывода пишутся в snake_case: в `error.details` — `operation_id`, `send_id`, `retry_after_ms`; в
  `commands --json` — `global_options`, `inherited_options`, `exit_codes`, `takes_value` и `contract: 1`. Дерево запроса
  в аргументе MCP `ast` содержит `lower_inclusive`, `upper_inclusive` и `must_not`.
- **HTML-файлы читаются как основной текст** (cli-core 0.262.0): меню, подвалы и баннеры отбрасываются, заголовки,
  списки, таблицы и ссылки остаются. Уже сохранённый текст HTML-вложений перечитывается при следующем
  `attachments extract` и при этом меняется. `title:`, `site:`, `lang:`, `author:` и `keyword:` ищут по заметкам и файлам.

### Исправлено

- **`tg config set defaultProfile <name>` и `config unset defaultProfile` работают без указания профиля.** Раньше они
  сначала требовали профиль и завершались ошибкой, если профилей было несколько (cli-core 0.262.0).
- **`tg default mcp config` и `mcp install` указывают профиль.** Запись не содержала профиль с именем `default`, поэтому
  его сервер MCP останавливался на первом же вызове: tg больше не подставляет профиль сам (cli-messaging 0.260.0).

## 0.52.0 — 13.10.2026

### Что нового

- **Собрано на cli-messaging 0.259.0 и cli-base 0.24.0.** `store fetch` теперь называется `messages sync` (те же
  аргументы, параметры и JSON). `store fetch` по-прежнему работает как скрытое устаревшее имя; документация и навык
  используют `messages sync`. `bot store fetch` сохраняет своё имя.
- **`--debug`:** при сбое за ошибкой следует вся запись — причина и стек: в терминале после строки `✗`, в остальных
  случаях второй строкой JSON.
- **`runs list` и `runs search` читают индекс по дням**, поэтому отвечают за миллисекунды даже на тысячах запусков.

### Исправлено

- **Навык предупреждает о трёх ошибках, которые агент допустил при тестировании.** Агент сравнивал простое слово в
  одном инструменте с `content:` в другом, читал `ref` там, где поиск отвечает `locator` (или `items` там, где заметки
  отвечают `hits`), и сообщал об ошибке, уже исправленной в более новой версии; цикл zsh по `$c` передавал путь команды
  одним аргументом.

### Изменено — может сломать скрипты

- **Локальное хранилище и модели распознавания речи один раз переносятся в папку WireCat**, `~/.local/share/WireCat/`
  (Windows: `%LOCALAPPDATA%\WireCat\Data\`), при первом запуске — из `~/.local/share/cli-messaging/` и
  `~/.cache/cli-common/models/`. Перенос никогда ничего не перезаписывает: если в обоих местах лежат разные хранилища,
  `tg` останавливается с кодом выхода `3` и называет оба файла. `WIRECAT_STATE_DIR` заменяет `CLI_COMMON_CACHE_DIR` и
  переносит всю папку. Обновляйте `max` и `memo` вместе с `tg`: более старая версия создала бы новое хранилище на
  старом месте. [Где tg хранит свои файлы](./installation.md).
- **Один объект ошибки:** `{"error":{"code","reason","message","details"}}`. То, что раньше лежало на верхнем уровне
  `error` — `candidates`, `sendId`, `operationId`, `permission`, `retryAfterMs`, — теперь находится в `error.details`.
  `reason` — идентификатор через точки (`output_limit` → `output.too-large`, `input_limit` → `input.too-large`);
  `retryable` появляется только там, где его задаёт сбой, а `actions` — только у неудавшихся элементов частичного
  результата. Код выхода `1` — это `internal_error` (раньше `generic_failure`), и его сообщение больше не содержит
  собственный текст сбоя; его показывает `--debug`.
- **`runs show` показывает только то, что пошло не так** (неудачные ответы, предупреждения, аварийное завершение), и
  добавляет `eventCount`; `-v`, как и раньше, показывает все события.
- **`tg` никогда не выбирает профиль за вас.** Команда, которая работает с аккаунтом и не называет профиль (нет первого
  слова, нет `TG_PROFILE`, нет `defaultProfile` в файле настроек), останавливается с кодом выхода `2`, а не использует
  `default` — даже если `default` единственный профиль. **Это ломает все существующие установки с одним профилем**:
  `tg chats list` теперь завершается ошибкой. Ошибка перечисляет профили на этом компьютере, так что решение есть в
  самом сообщении: `tg default chats list`, `export TG_PROFILE=default` или `"defaultProfile": "default"` в файле
  настроек. На новом компьютере первый вход — `tg personal setup` (имя любое). `--help`, `--version`, `commands`,
  `skill show`, `account list` и `config show` по-прежнему работают без профиля. Клиентам MCP и заданиям по расписанию,
  которые запускают `tg mcp` или `tg serve` без профиля, нужно его добавить. `store fetch` бота использует только данные
  приложения и личную сессию своего профиля, а не профиля `default`.

## 0.51.0 — 12.10.2026

### Что нового

- **`--brief` и `--full` у каждой команды.** `--brief` оставляет у найденного сообщения ссылку, чат, время,
  отправителя, отрывок и оценку; `--full` оставляет всё.
- **`tg search all` называет автора каждого результата** и то, как он найден (по словам или по смыслу).

- **`tg schedule`: запуск команды или агента по таймеру** через systemd (Linux), launchd (macOS) или Планировщик
  заданий (Windows). `tg schedule command <name> --every 2h -- messages list <chat>` запускает команду tg; чтение
  сохраняет прочитанное. `tg schedule agent <name> claude "<prompt>" --at 08:30` запускает агента (claude или codex),
  не чаще раза в час. Агент работает с `TG_READ_ONLY=1` и не может отправлять; его ответ сохраняется как `latest.md`
  рядом с расписанием, а уведомление на рабочем столе сообщает, что он готов. `--once 2h` запускает один раз, после
  чего удаляет расписание. `tg schedule list`, `run` и `remove`.
- **`tg server install` предлагает команду для ежедневной проверки незакрытых дел** и ничего не включает сам.
- **`TG_READ_ONLY=1` запрещает процессу любую запись**, главнее файла настроек и `--permission`.

### Изменено — может сломать скрипты

- **`tg search messages` возвращает отрывок, а не весь текст.** Каждый результат содержит `excerpt` — около 240
  символов вокруг первого слова запроса — вместо `text`; весь текст сообщения дают `--full` или
  `tg messages show <ref>`. Пустые (`null`) `editedAt`, `replyTo`, `forwardedFrom` и `reactions` не попадают в машинный
  вывод. Скрипт, который читал `text` из результатов поиска, должен читать `excerpt` или добавить `--full`.


## 0.50.0 — 11.10.2026

### Что нового

- **У задач появились план, связи и ежедневная повестка** (общее хранилище 0.247.0, версия 4). `tg tasks add`
  принимает `--title`, `--description`, `--due` и `--check`; `tg tasks plan <task>` меняет их позже, `none` очищает
  дату. Следующая проверка — это время, когда агенту стоит снова посмотреть на задачу, а не напоминание: владельцу
  ничего не приходит. `tg tasks link` связывает задачу с сообщениями, чатами, людьми, документами и URL; `tg tasks show`
  печатает план со связями. `tg tasks agenda` без текста сообщений перечисляет просроченные задачи и задачи с близким
  сроком, чаты, где ждут вашего ответа (`owed`), чаты, где вы ждёте других (`waiting`), и чаты, чьё новейшее сообщение
  не сохранено (`unsynced`). `tg skill show follow-ups` — ежедневный порядок работы для агента: только черновики,
  он никогда не отправляет.

### Изменено — может сломать скрипты

- Общее хранилище 0.247.0: контекст встречи записывает факты через `fact.add`; `memory.add` больше не принимает вид `fact`.

### Исправлено

- Закреплён общий пакет 0.248.0 с записями проверки соответствия для отслеживания задач. Проверки релиза теперь
  распознают планы задач, связи, карточки, повестку и их параметры.

## 0.49.0 — 11.10.2026

### Что нового

- **Поиск принимает запись сравнения через двоеточие.** `date:>=2026-01-01` (а также `:>`, `:<`, `:<=`) означает то
  же, что `date>=2026-01-01`; раньше такая запись завершалась ошибкой `invalid_syntax`. Отклонённые `after:` или
  `before:` теперь называют замену: `after:2026-09-01` предлагает использовать `date>=2026-09-01`.

### Изменено — может сломать скрипты

- Общее хранилище 0.246.0 перед созданием сверяет новые метки с каноническими именами и псевдонимами. Похожие имена
  требуют проверки владельцем; используйте существующую метку или её явный псевдоним. Существующие метки и данные
  остаются, а автоматические совпадения по каноническому имени и по псевдониму засчитываются как одно утверждение.

## 0.48.1 — 11.10.2026

### Что нового

- **Общее хранилище 0.242.0**: существующие идентификаторы проектов и задач сохраняются; новые проекты получают
  короткие ключи, а хранилище умеет проверять, какие задачи от каких зависят.

### Исправлено

- **npm снова устанавливает пакеты рядом друг с другом.** Собрано на `@wirecat/cli-messaging` 0.241.0, чей
  `@wirecat/cli-meetings` 0.4.2 принимает cli-core 0.20.0. С 0.240.0 npm помещал cli-messaging во вложенную папку со
  второй копией cli-core.

## 0.48.0 — 11.10.2026

### Что нового

- **`--source` принимает список аккаунтов и групп** в `search messages`, `search mail` и `search conversations`:
  `--source group:work,tg:mila,email:me@work.example` ищет ровно в них. Элемент списка — группа, `app:account`
  (профиль любого приложения — `max:default` работает из tg, — идентификатор аккаунта или его имя) или обычное слово
  `--source`. `config set accountGroups.<name> <list>` сохраняет группу для всех приложений.
- **Общее хранилище обновляется до версии 2 при первом открытии в tg.** Факты — что было сказано, спрошено, решено
  или обещано — получают собственную таблицу рядом с воспоминаниями; воспоминания вида `fact` переносятся туда, а
  назначения задач копируются в отдельную таблицу. Более старые tg, max или memo по-прежнему открывают обновлённое
  хранилище.

### Изменено — может сломать скрипты

- **В macOS tg хранит файлы там же, где в Linux**: `~/.config/tg-cli`, `~/.local/share/tg-cli` и `~/.cache/tg-cli`
  вместо `~/Library/…`. Первый запуск переносит туда старые папки вместе с общим хранилищем и моделями распознавания
  речи и направляет установленный агент `tg server` на новый журнал. Пока работает `tg serve` или сервер MCP, он один
  раз выводит предупреждение, на этот запуск оставляет старые папки и пробует снова в следующий раз. Linux и Windows
  не меняются.
- **Удаление данных аккаунта удаляет и людей, которых видел только этот аккаунт.** Человек остаётся, пока на него
  ссылается другой аккаунт, метка, заметка или любая другая запись.
- **Почта ищется по смыслу по веткам.** Первый проход индексации после обновления заново делит каждую ветку и ещё раз
  вычисляет эмбеддинги почты; поиск по словам не меняется.

### Исправлено

- **Удаление данных аккаунта, в котором были встречи, больше не завершается ошибкой**, а удаление убирает векторы,
  которые использовал только этот аккаунт.
- На `@wirecat/cli-messaging` 0.238.0.

## 0.47.0 — 11.10.2026

### Что нового

- **`messages list --limit` возвращает столько сообщений, сколько запрошено.** Telegram отдаёт не больше 100 за
  запрос, и `--limit 500` раньше останавливался на 100 с `hasMore: true`; теперь команда читает дальше страница за
  страницей (cli-messaging 0.235.0).
- **Опрос в `messages list` содержит вопрос, варианты ответа и общее число голосов** в `providerMetadata.poll`, так
  что опросы канала читаются без отдельного `polls show` для каждого сообщения.

### Исправлено

- **`messages comments --limit 100` (или больше) сообщает, что остались более старые комментарии.** Чтобы это узнать,
  команда запрашивала у Telegram на один комментарий больше лимита, но Telegram возвращает не больше 100, поэтому
  ветка из 1600 комментариев отвечала 100 комментариями с `hasMore: false`. Теперь команда запрашивает не больше 100 и
  считает полную страницу признаком того, что есть ещё.
- **`polls show` показывает общее число голосов до того, как вы проголосуете.** Telegram в любом случае присылает
  общее число; только число голосов за каждый вариант ждёт вашего голоса. Раньше общее число тоже было `null`.
- На `@wirecat/cli-messaging` 0.235.0.

## 0.46.3 — 11.10.2026

### Изменено — может сломать скрипты

- **Вступление в чат и импорт контактов учитываются в `sendsPerHour`.** Вступление считается за одно, импорт — за
  одно на каждый номер; `tg contacts import` отправляет по 10 номеров за запрос. Если лимит останавливает импорт на
  полпути, ошибка сообщает, сколько номеров ушло, и что повторный импорт безопасен.

### Что нового

- **`tg bot watch` печатает и сохраняет обновление один раз**, даже если Telegram доставляет его снова после
  перезапуска: каждое обновление записывается по `update_id` и пропускается после обработки. С `--events --jsonl`
  каждая строка содержит `update: { id, kind }`.
- `tg search all --backend archive|server|both` и `--server-time`, как у `search messages`; они действуют только на
  сообщения, почта и заметки всегда ищутся локально. По умолчанию — `both`.
- `tg search mail --account <address>` ищет в одном почтовом ящике; без него — во всех. Почту можно искать и по
  получателю, папке и теме (`to:`, `cc:`, `bcc:`, `mailbox:`, `subject:`), а вложения — по смыслу.

### Исправлено

- **`tg store fetch --all` пережидает короткий FLOOD_WAIT при получении списка чатов** (до 5 минут, как уже делали
  страницы сообщений), а не сразу завершается с `rate_limited`; ожидание в 21 с обрывало каждую загрузку пустого
  хранилища. Вошло в 0.46.2, но там не указано.
- Листание чатов (`store fetch --all` получает их по 100) читает каждый диалог из Telegram один раз.
  Раньше каждая страница заново проходила все диалоги с начала, и около 1400 чатов стоили больше 100 запросов подряд
  вместо примерно 15.
- `chats members list --all` выдерживает 1 с между страницами по 200 участников. Раньше он запрашивал до 50 страниц
  подряд, хотя страница о лимитах говорила, что темп ограничен.

### Безопасность

- **Поиск больше не отвечает сообщениями другого аккаунта.** `search messages --backend server` с `--source all`
  или `in:all` мог вернуть сообщение другого аккаунта с теми же id чата и сообщения, а id чата без аккаунта
  совпадал с этим чатом во всех аккаунтах; оба случая исправлены.
- Работает на `@wirecat/cli-messaging` 0.233.0.

## 0.46.2 — 11.10.2026

### Исправлено

- Поиск в архиве с `--discover` обрабатывает вопросы о правах доступа вроде «Есть ли у подрядчиков доступ к продакшену?»,
  не превращая последний вопросительный знак в подстановочный. Строгий поиск и фильтры работают как прежде.
- Поиск почты и контекст связанного человека читают также отдельное хранилище писем, наряду с прежним импортом.
  Почта поддерживает фильтры отправителя и цепочки; в поисковой выдаче каждое письмо со своей ссылкой показывается один раз.
- Фоновая загрузка истории больше не останавливается на стандартном 30-секундном пределе; явный
  `--timeout` по-прежнему действует.

### Изменено — может сломать скрипты

- Неустранимый сбой загрузки истории до первой сохранённой страницы теперь завершает команду ошибкой, а не
  кодом `0` с `issue`. Загрузка истории бота без начального сообщения завершается с кодом `2`
  и просит `--from`. Сбои после того, как часть сохранена, по-прежнему дают частичный результат.

## 0.46.1 — 11.10.2026

### Исправлено

- Названия пакетов, документация и примеры используют пространство имён WireCat.

### Изменено — может сломать скрипты

- Независимый отказ файла или страницы истории сохраняет успешную часть и возвращает `complete: false`, `batch` или `issue` с кодом выхода `0`. Скриптам нужно проверять полноту; JSONL загрузки добавляет `batch_summary`. Ошибки содержат `actions` для восстановления. Повтор загрузки учитывает неудачные ID checkpoint.
- Пакет прекращает новые запросы после десяти попыток, если доля ошибок выше 50%; `MESSAGING_BATCH_MAX_ERROR_PERCENT` меняет процент, а 100 отключает этот процентный останов. Ограничение частоты и отказ авторизации останавливают раньше; запись с неизвестным исходом не повторяется автоматически.

### Что нового

- Размер файла для извлечения и передачи настраивается через `MESSAGING_ATTACHMENT_MAX_MIB` (по умолчанию 50). PDF-превью теперь допускает 4000 пикселей по стороне и 8 МиБ; `MESSAGING_PDF_PREVIEW_MAX_PIXELS` и `MESSAGING_PDF_PREVIEW_MAX_MIB` меняют эти пределы. Большие значения требуют больше памяти; пределы внешнего OCR и распаковки остаются отдельными.
- `tg runs search` и команда `runs search` в MCP `tg_read` ищут безопасные диагностические записи по тексту, статусу, коду ошибки и времени без подключения к мессенджеру.

## 0.46.0 — 11.10.2026

### Изменено — может сломать скрипты

- **Локальная копия сама чистит растущие журналы при открытии**, не чаще раза в день: вызовы инструментов
  агентом старше 90 дней удаляются, а у обработанного обновления бота старше 30 дней строка остаётся, но
  содержимое стирается. Обновите max-cli и cli-memo одновременно: копия у них общая.

### Что нового

- `tg store reset` — для копии, которую эта сборка не может перенести на новую схему: сохраняет её рядом,
  удаляет и создаёт пустую. Сначала спрашивает; `--yes` пропускает вопрос, `--no-backup` — копию.
- `tg search all --meetings [provider:account]` ищет ещё и в одной учётной записи встреч: расшифровки, чат и
  итоги; `--max-meetings <n|all>` задаёт, сколько встреч просмотреть (по умолчанию 100).

### Безопасность

- **Старый `messages.db` удаляется** при открытии копии по пути по умолчанию: незашифрованный файл, который
  был до `wirecat.db`, вместе с `-wal` и `-shm`. Одна строка в stderr называет его. Файл остаётся, если задан
  `MESSAGING_STORE` или пока его держит открытым другой процесс. Из `@wirecat/cli-messaging` 0.222.0.

## 0.45.0 — 10.10.2026

### Изменено — может сломать скрипты

- **Локальная копия теперь в новом файле `wirecat.db` и после обновления пуста.** Он лежит рядом со
  старым `messages.db`, который `tg` оставляет как есть: не читает, не переносит, не удаляет.
  `tg store fetch --all` заново скачивает сообщения из Telegram. То, что есть только на этом компьютере, —
  например заметки, псевдонимы, метки, задачи и расшифровки — остаётся в `messages.db`. Вход
  сохраняется. Обновите max-cli одновременно, иначе они будут видеть разные архивы.

### Что нового

- `tg contacts timeline <person>`, и через MCP — команда `contacts timeline` в `tg_read`: всё, в чём
  участвовал один человек, во всех связанных с ним мессенджерах, новое сверху, из локальной копии.
  `--scope personal|work`, `--since-time`, `--until-time` и `--limit` сужают выдачу.

## 0.44.1 — 10.10.2026

### Исправлено

- Локальное извлечение текста PDF и просмотр страниц принимают документы длиннее 20 страниц; извлечение следует отмене команды вместо отдельного тайм-аута в 30 секунд. Ограничения размера файла и изображения сохраняются.
- Локальная расшифровка принимает полные записи Ogg Opus с одним или двумя каналами длиннее десяти минут. Длинным записям нужно больше памяти и времени на обработку.
- Вложения из обычных скрытых рабочих папок разрешены. Известные файлы с учётными данными, папки CLI и хранилище сообщений остаются защищены.
- Экспорт Markdown сохраняет форматирование сообщений. Аргументы записи MCP сохраняют исходные символы Unicode, а возвращаемый текст по-прежнему показывает невидимые управляющие символы; настроенные шлюзы моделей поддерживают обычные перенаправления.
- Обновление и настройка MCP в Windows поддерживают обычные относительные записи PATH и пользовательское окружение командного процессора. Эта версия сохраняет существующую схему хранилища сообщений.
- Руководство по поиску различает запросы к локальному архиву с discovery или offline и обычный поиск слов через сервер: пустой локальный архив не означает, что поиск в Telegram был выполнен.

## 0.44.0 — 10.10.2026

### Что нового

- Поиск сообщений с `--discover` или MCP `discover: true` находит частичные совпадения слов и подходящие прямые ответы в локальном архиве без скачивания моделей. Строгий поиск остаётся по умолчанию; совпавшие и отсутствующие слова помогают агенту проверить основания ответа.

## 0.43.1 — 10.10.2026

### Изменено — может сломать скрипты

- **Проект распространяется по лицензии Apache License 2.0.** Условия — в `LICENSE`.

## 0.43.0 — 10.10.2026

### Изменено — может сломать скрипты

- **Пакет называется `@wirecat/tg-cli`, репозиторий находится в WireCatLabs.** Используйте этот пакет для установки и обновления.
- Локальная расшифровка принимает полную запись Ogg Opus с одним или двумя каналами до 10 минут. Более длинную запись разделите. Извлечение текста PDF ограничено 20 страницами и 30 секундами.
- MCP делает невидимые управляющие символы видимыми в текстовых результатах и аргументах записи, включая декодированную разметку. Эмодзи флагов отдельных регионов сохраняются; обычный JSON CLI сохраняет исходные строки.

### Исправлено

- После обновления перезапуск сервера вызывает Node напрямую с отдельными аргументами и сохраняет выбранное окружение, в том числе пути с пробелами в Windows. Неверные имена профилей в файлах блокировки пропускаются.

### Безопасность

- Извлечение текста из папки и передача сохранённых вложений не читают скрытые пути, собственные папки CLI и хранилище сообщений, в том числе через ссылки. Загрузка через MCP также не пишет в эти места.
- DOCX проверяется тем же ограниченным читателем архивов офисных форматов до загрузки содержимого документа.

## 0.42.0 — 09.10.2026

### Изменения, влияющие на скрипты

- **Автоответы отвечают всем, кто соответствует вашим правилам, если вы не ограничиваете аудиторию; отдельный список `testers` исчез.** `tg replies audience --reply listed --allow-people <ids>` отвечает только избранным людям;   `--deny-people` и `--deny-chats` исключают отдельных людей и чаты. Ничего не отправляется, пока `permissions.replies.send` не станет `allow`, а новое правило отключено, пока вы его не включите. Файл правил, в котором все еще есть `testers`, продолжает отвечать тем же людям: они становятся разрешенными людьми (только теми, кому аудитория также разрешила, если это уже был `listed`). Разрешенные чаты в таком файле удаляются, поскольку в них будут открываться ответы всем участникам этих чатов; списки запретов остаются. Файл перезаписывается без `testers` при следующем редактировании `tg replies`.
- **`tg replies status --json` больше не имеет `testers`**; подсчеты `audience` говорят, кому можно ответить. В `tg replies test` и `serve` отправитель, не входящий в аудиторию, пропускается с надписью «не в списке разрешений» вместо «не тестовый аккаунт».

## 0.41.0 — 09.10.2026

### Изменения, влияющие на скрипты

- **Хранилище сообщений удаляет копии, сохраненные для более старых версий** (версия хранилища 28, cli-messaging 0.212.0).   Заметки, заметки о контактах, связи и сущности, написанные до рефакторинга заметок, копируются в новые таблицы один раз во время обновления. После него старые tg, max и memo отказываются открывать архив с сообщением "upgrade this tool" - обновляйте все три вместе.

## 0.40.1 — 09.10.2026

### Исправлено

- **`tg search all` ничего не находил в новом хранилище.** Он искал только по аккаунтам, уже записанным в хранилище, поэтому до первого сохранения не искал нигде; теперь он всегда включает аккаунт этого профиля и обращается к серверу так же, как `tg search messages`.
- **`tg search mail` без импортированной почты возвращает пустой результат** с пояснением в stderr, а не завершается ошибкой.
- **Заметки, найденные только слабым совпадением по смыслу, отбрасываются**, поэтому редкое слово больше не возвращает все заметки.

## 0.40.0 — 09.10.2026

### Что нового

- **`tg topics show <chat> <topic>` показывает одну тему форума**: её название, закрыта ли она или закреплена, непрочитанные сообщения и последнюю активность.
- **`tg messages forward --topic <id>` пересылает в тему форума** группы `--to`. Тема сначала проверяется, как в `messages send --topic`; тема 1 — General.
- **`tg attachments show --page 1` возвращает страницу сохранённого PDF как PNG.** Удалённые агенты, чьи приложения не открывают встроенные PDF, могут читать страницы как изображения; для рендеринга нужны необязательные пакеты `unpdf` и `@napi-rs/canvas`.

### Изменено — может затронуть скрипты

- **`--answerer` в статистике принимает сохранённые имена, псевдонимы и @username.** Разрешение остаётся локальным в аккаунтах выбранной истории; для неоднозначных имён возвращаются кандидаты в пределах области. Неизвестные имена теперь дают ошибку, а не выдуманного человека с нулём ответов. Чтобы явно выбрать ещё не встречавшийся непрозрачный ID, используйте `person:provider/account/id`. В строки ответа добавлено `identityKnown`; у ID без наблюдений `identityKnown: false` и `status: unknown`. Ноль замеченных ответов не доказывает неактивности ([статистика](./rankings.md)).

- **Весь поиск перенесён в `tg search`.** Старых команд больше нет:

  | Было | Стало |
  |---|---|
  | `tg messages search` | `tg search messages` |
  | `tg messages search --source email` | `tg search mail` |
  | `tg conversations search` | `tg search conversations` |
  | `tg topics search <chat> <text>` | `tg search topics <chat> <text>` |
  | `tg bot messages search` | `tg bot search messages` |

  Инструменты для агентов перенесены так же: `search messages`, `search conversations`, `search topics` и новый `search all`, с которого стоит начинать.
- **`tg search messages` никогда не возвращает почту.** Сохранённый поиск с `in:email` теперь предлагает использовать `tg search mail`.
- **Права, названные по старым путям** (`messages.search`, `conversations.search`, `topics.search`), блокируют `tg search`, пока `tg config migrate` не переименует их с сохранением уровней.

## 0.39.1 — 08.10.2026

### Исправлено

- Общая библиотека сообщений закреплена на 0.205.0, как у Memo и MAX, для совместной установки.

## 0.39.0 — 08.10.2026

### Что нового

- **`tg polls create --close-time 5m`** автоматически закрывает опрос через заданное время: от 5 секунд до 10 минут.
- **`tg polls voters <chat> <message> [--answer <id>]`** показывает, кто за что голосовал в неанонимном опросе. Если Telegram отвечает, что сначала нужно проголосовать самому или что канал скрывает проголосовавших, ошибка так и говорит.
- **`tg chats link update --expire-time never`** снимает срок действия ссылки. Основную ссылку группы тоже можно менять; справка больше не утверждает обратное.
- **`tg store jobs list --state <state>`** фильтрует фоновые задачи: running, done, failed, cancelled или died.

### Изменено — может затронуть скрипты

- **`tg chats link create` и `update` отклоняют сочетание `--approval` и `--max-uses`.** Telegram молча снимал лимит вступлений при включении одобрения; теперь нужно выбрать одно.
- **Латинские слова ищутся по основам английского и испанского одновременно.** Раньше использовался только испанский, и английские формы слов («budgets» → «budget») находились хуже. Учтите: после обновления индекс основ перестраивается сам — небольшой архив при открытии, большой по частям: `tg serve` достраивает его в фоне, `tg store migrate` — сразу. Пока индекс не готов, поиск находит только точные формы слов, сообщает об этом в stderr, а в JSON `query.stemming.applied` равно `false`. Индекс основ для латиницы примерно вдвое больше. Заданное вами значение `searchStemmers.latin` сохраняется, и `tg store reindex` по-прежнему его применяет. Обновите и `max`: старая версия, открыв перестроенный архив, отвечает на поиск по основам просьбой обновить инструмент ([архив](./archive.md#repair-and-index-maintenance)).
- **Заметки о человеке (`tg contacts notes`) видны во всех профилях, где он доступен.** Раньше — только в профиле, где их написали. Почему: заметки принадлежат вам, а не одному аккаунту; общий архив теперь хранит их отдельно от сообщений, вместе с заметками из `memo`. Учтите: при нескольких профилях Telegram заметки о человеке из всех них теперь показываются вместе. Свои имена (`contacts alias`) по-прежнему действуют только в своём профиле.

### Исправлено

- **`tg polls voters --answer <id>`** правильно указывает выбранный ответ. Без `--answer` больше не сообщает о дополнительных голосах, когда показаны все.

## 0.38.0 — 08.10.2026

### Новое

- **`tg account list`** показывает все профили на компьютере, аккаунт каждого и его имя. В Telegram не обращается.

### Исправлено

- **`tg session start` сообщает «Already logged in»**, если сессия работает и ничего не запрошено; для повторного входа предлагает `session end`. Раньше это выглядело как вход без кода. В `--json` добавлено `alreadyLoggedIn`.
- **`tg session start phone --sms` продолжает вход**, если Telegram не может отправить SMS (`SEND_CODE_UNAVAILABLE`): сообщает об этом и просит уже отправленный в приложение код.
- **`tg` и группы без подкоманды (`tg account`, `tg chats`) снова показывают справку** в терминале вместо `✗ (outputHelp)`. Скрипт или `--json` получает `validation_error` с просьбой указать команду.

## 0.37.0 — 08.10.2026

### Новое

- **Агент читает чаты одной папки по именам через MCP**, как `tg chats folders show` (`tg_read`, command: `chats folders show`).
- **`tg chats link update <chat> <link> [--approval | --no-approval] [--expire-time] [--max-uses]` меняет одну дополнительную ссылку:** меняются только заданные параметры.
- **Сохранённые файлы для удалённого агента:** `attachments show` передаёт ограниченные порции с SHA256 всего файла. MCP возвращает целые изображения или бинарные ресурсы с запасным JSON/base64. Передача не распознаёт и не индексирует текст; агент читает файл и сохраняет результат ([вложения](./attachments.md)).
- Общая библиотека добавляет наблюдаемые когорты удержания и наблюдения счётчиков со свежестью каждого поля; неизвестное остаётся явным.

### Изменения, которые могут сломать скрипты

- JSON рейтингов и доказательств содержит наблюдения счётчиков и свежесть; evidence принимает выборки когорт удержания. Проверяйте каждое поле и вид selection; неизвестные значения и неполный архив не означают ноль.

## 0.36.0 — 08.10.2026

### Новое

- **`tg polls create --quiz --correct <n> [--solution <text>]`** создаёт викторину:
  один правильный ответ по позиции от1; голос окончательный.
- **Сохранённые отчёты администратора** находят вопросы без наблюдаемого ответа, время ответа
  выбранных людей, помощь после известного вступления и просмотренные посты с малым обсуждением.
  Покрытие/evidence показывают границы данных; история сохраняет параметры/selection.
- **`tg chats folders show <folder>`** показывает папку и названия чатов, закреплённых и исключённых.
  Названия сначала берутся из архива; Telegram спрашивается только о недостающих.
- **`tg metadata refresh --only-missing`** читает описания только там, где их ещё нет;
  без `--chat` — все сохранённые группы/каналы до `--limit`.
- **`tg store jobs retry <job>`** запускает неудачное или прерванное задание с теми же опциями;
  `--failed` — каждый чат с таким последним заданием. **`tg store jobs clear`** удаляет завершённые задания и журналы.
- **`tg session start phone --sms`** просит отправить код по SMS; способ выбирает Telegram,
  CLI сообщает фактическую доставку.
- **`tg topics delete <chat> <topic>`** удаляет тему и все сообщения у всех.
  По умолчанию спрашивает; `--allow-dangerous` пропускает вопрос.
- **Текст вложений читается локально:** ODT, ODS, XLSX, PPTX, EPUB, UTF-16 с BOM и уверенно
  определённые старые кодировки. Без модели; формулы не вычисляются, картинки остаются агенту ([поиск](./search.md)).
- **Правила папок в `tg chats folders create|update`:** `--include` contacts, non-contacts, groups,
  channels, bots; `--skip` muted, read, archived; `--exclude-chat`, `--pin`, `--emoji`.
  `folders list` показывает правила.

### Изменено — может сломать скрипты

- `tg chats folders join` сообщает о неверной/истёкшей ссылке с кодом6;
  `folders order` возвращает только id и название.
- `tg chats folders create|update` возвращают реально сохранённую папку: Telegram отбросит
  `--emoji`, если это не его значок папки; раньше CLI сообщал, что он установлен.

## 0.35.0 — 08.10.2026

### Новое

- **`tg chats requests list --search <name>` или `--link <link>` сужает список запросов** — по имени либо до тех,
  что пришли по одной ссылке; Telegram не позволяет сочетать оба фильтра.
- **`tg polls show` сообщает, является ли опрос викториной (`quiz`), можно ли изменить голос (`revote`) и создали ли
  вы его (`creator`)** — закрыть опрос может только его создатель.
- **`tg polls vote` и `tg polls close` до отправки отклоняют то, что отклонил бы Telegram**: закрытый опрос, два
  ответа в опросе с одним ответом, изменение или отзыв окончательного голоса, `--retract` без голоса и
  закрытие чужого опроса. Отказы Telegram при работе с опросами теперь объясняют, что делать, вместо «Telegram refused: X», а
  тайм-аут чтения опроса больше не сообщает, что голос мог быть отправлен.
- **`tg chats requests accept|decline <chat> --all [--link <link>]` обрабатывает все ожидающие запросы сразу, а
  `tg chats link list` / `tg chats link revoke` показывают ваши ссылки запросы и прекращают их действие.** Принятие с `--all` проверяется
  с учётом почасового лимита до того, как кого-либо впустят.
- **Рейтинги сохраняют связи ответов Telegram и связанные обсуждения каналов**, поэтому показатели бесед используют эти
  связи, когда они доступны; неоднозначные связи с темами форума остаются неизвестными.
- [Руководство по рейтингам](./rankings.md) объясняет показатели, оценки, охват, сохранённые выборки и подтверждающие данные.
  Повторное выполнение сохранённой выборки теперь сохраняет исключающие границы дат.
- **`tg store fetch --all` загружает все чаты** — последние 90 дней каждого, сначала недавно активные;
  `--background` запускает загрузку как задание. Это нужно для поиска: [подготовьте архив](./search.md#prepare-your-archive-first).
- **Ваши имена и заметки о людях: `tg contacts alias` и `tg contacts notes`**, хранящиеся только на этом
  компьютере; `contacts show --with-notes` и `contacts list --search-notes` показывают их и выполняют поиск
  ([люди](./people.md#your-own-names-and-notes-contacts-alias-contacts-notes)).
- **Автоматические теги для групп и каналов: `tg metadata refresh` и `tg tags auto`**, по названию и
  описанию, без изменения ваших собственных тегов ([поиск](./search.md#tags)).

### Изменения, влияющие на скрипты

- **Каждый поиск сообщает, какие данные проверил.** Одна строка в терминале показывает число проверенных сообщений и чатов, чаты, которые ещё
  не загружались или устарели, и команду для исправления ситуации; `coverage.next` в JSON сообщает агенту, что выполнить.

- **Поиск по словам теперь по умолчанию обращается к Telegram и локальному архиву (`--backend both`).**
  Раньше он искал только в архиве, если не был выбран другой источник. Теперь поиск может подключаться к Telegram;
  используйте `--backend archive` для поиска только локально. Подсчёт через `stats`, поиск по темам и запросы, на которые сервер
  не может ответить, по-прежнему читают только архив.

- **`tg chats join` для группы с одобрением вступления администраторами отвечает `requested: true` и завершается с кодом `0`**, вместо
  кода `11`: запрос и раньше успешно отправлялся. Скрипт, считавший код выхода 11 признаком отправленного запроса, теперь читает
  `requested`.

## 0.34.0 — 07.10.2026

### Новое

- **`tg stats messages top` и `tg stats contacts top` ранжируют сохранённые сообщения и их авторов**, а
  `evidence` под каждой командой показывает сообщения, подтверждающие место в рейтинге. Они читают только локальное хранилище и
  не обращаются к Telegram; `searches create --selection` сохраняет такой рейтинг как поиск.
- **Каждый профиль теперь имеет общее ограничение частоты запросов для всех использующих его процессов `tg`.** Две одновременные команды,
  фоновые задания `store fetch`, `mcp` и `serve` раньше ограничивали частоту отдельно, поэтому несколько процессов
  умножали частоту запросов; теперь у них общий лимит — пакет из 20, затем один запрос в секунду.
  Назначенное Telegram ожидание блокирует весь профиль, а запрос, которому пришлось бы ждать более 5 минут, сразу
  завершается с кодом выхода `8`. Массовая работа, запущенная параллельно, занимает больше времени. `requestsPerMinute` или
  `TG_REQUESTS_PER_MINUTE` меняет частоту; [limits.md](./limits.md) объясняет все правила.
- **`tg messages send --html` и `tg messages edit --html` читают HTML Telegram** — `<b>`, `<i>`, `<u>`, `<s>`,
  `<a href>`, `<code>`, `<pre>`, `<blockquote>`, `<tg-spoiler>` — сохраняя введённые переводы строк
  ([использование](./usage.md#sending)).
- **`tg messages send --file … --filename <name>`** отправляет файл с именем, которое видят другие.
- **`tg messages list <chat> --topic <id>` читает одну тему форума**, назад от последнего сообщения или `--before-id`.
- **`tg chats folders order` располагает папки в указанном вами порядке**, а **`tg chats folders join <link>`** добавляет
  папку, которой поделились через ссылку `t.me/addlist/`, вступая в каждый её чат.
- **`tg chats link create <chat>` создаёт ещё одну ссылку запросы: `--approval` требует сначала запросить вступление,
  `--expire-time` и `--max-uses` ограничивают ссылку; `tg chats update --join-approval on|off` требует запроса
  от всех вступающих.** Обе возможности работают как в частных, так и в публичных группах.
- **`tg chats requests list <chat>` показывает запросивших вступление в группу с одобрением, а `tg chats requests
  accept|decline <chat> <person>` обрабатывает один запрос.** Запросы видят только администраторы; принятый запрос учитывается в
  почасовом лимите, как добавление участника.

- **`tg messages search --backend both` обращается к Telegram и архиву.** Результаты Telegram сохраняются
  и проверяются тем же запросом, поэтому `exact:`, `-word` и ранжирование сохраняют своё значение; каждое сообщение указывает,
  пришло ли оно из архива, Telegram или обоих источников. `--backend server` показывает только результаты Telegram;
  `--server-time` ограничивает ожидание (5 с). Источником по умолчанию остаётся архив ([поиск](./search.md)).

- **`tg chats mark-read <chat> --topic <id>` помечает одну тему форума прочитанной**, до `--until` или её последнего
  сообщения, не меняя состояние остального чата.

- **`tg topics edit <chat> <topic>` переименовывает (`--title`), закрывает или открывает (`--closed on|off`), закрепляет или открепляет
  (`--pinned on|off`) тему форума, а также скрывает или показывает тему General (`--hidden on|off`); `tg topics order
  <chat> <topic...>` упорядочивает закреплённые темы.** Обе команды безопасно повторять.

- **`tg messages send --spoiler` размывает фото или видео до нажатия, а `--caption-above` размещает текст над
  ним.** Спойлер для документа или голосового сообщения отклоняется.

- **`tg chats send-as <chat>` показывает, от чьего имени вы можете публиковать в группе, а `--send-as <id>` выбирает одно из
  них** — в `tg messages send` (включая файлы), `tg messages forward` и `tg polls create`. В списке всегда
  есть вы и отмечен сохранённый выбор группы; чтение ничего не меняет. Идентификатор вне списка отклоняется.

### Изменения, влияющие на скрипты

- **Отправка, пересылка или опрос без `--send-as` в группу, которая по умолчанию публикует от имени канала, отклоняется** (код выхода
  `2`), вместо отправки от имени канала. Ошибка указывает `--send-as <your id>` для публикации от своего имени и
  `--send-as <channel id>` для публикации от имени канала.

## 0.33.0 — 07.10.2026

- **`tg contacts profile` и `tg contacts check` оценивают возраст аккаунтов, созданных до августа 2026 года.**
  Таблица оценки месяца регистрации по идентификатору аккаунта заканчивалась ноябрём 2025 года, поэтому самые новые аккаунты не получали
  оценки. Идентификаторы конца 2025 года теперь дают дату до четырёх месяцев позже, ближе к реальной дате создания.
  Погрешность оценок для 2026 года — около трёх месяцев; `source: "estimate"` по-прежнему отмечает каждую оценку.
- **OCR вложений через общий шлюз.** Обычно агенты сами читают изображения и сканы и
  записывают текст через `attachments text set`. Явная массовая обработка использует `attachments extract --ocr`,
  `models.ocr` и ограниченный `--concurrency`; полный текст попадает в существующий индекс `content:`.
  Кеширование по хешу и модели предотвращает повторные вызовы, а ошибки сохраняют текст агента и прежний проиндексированный текст.

## 0.32.0 — 07.10.2026

### Новое

- **`tg messages comments <channel> <post>` читает комментарии под публикацией канала, а `tg messages send
  --comment-to <post>` пишет комментарий.** Комментарии находятся в группе обсуждения канала; публикация без неё даёт код выхода `6`.
- **`tg contacts profile` перечисляет прежние имена и имена пользователей** в `aliases`, сначала старые, со ссылкой `t.me`
  для прежнего имени пользователя. Локальное хранилище теперь сохраняет имя или имя пользователя при его изменении. См.
  [Люди](./people.md).

## 0.31.0 — 07.10.2026

### Новое

- Извлечение файлов через MCP, явно указанные каталоги и `messages download --extract`; изменения файлов
  проверяются по хешу содержимого. После загрузки истории возможна локальная подготовка с ограничениями, по
  умолчанию выключенная. `store gaps plan` и `store gaps repair` проверяют записанные внутренние пробелы и явно
  устраняют их с ограничениями и возобновляемыми заданиями; неизвестные края и неоднозначные страницы остаются в ожидании.

- **`tg stats chats official <chat>`**: статистика самого Telegram для управляемой вами супергруппы или канала, как
  в приложениях Telegram — общие показатели в сравнении с прошлым периодом, ведущие авторы, администраторы и приглашающие (супергруппы), последние
  публикации и доля включённых уведомлений (каналы), а также все графики в виде рядов JSON. Только чтение. Работает там, где Telegram показывает
  вам статистику; иначе завершается ошибкой разрешения или проверки. См. [Группы, которыми вы управляете](./groups.md).
- cli-messaging 0.162.0 также добавляет `store gaps repair`, параметры подготовки для `store fetch`,
  `messages download --extract` и `attachments extract --from-dir` / `--cursor`.

- **У конфигурации, разрешений и профилей отдельные руководства.** Настройка начинается с расположения файлов и обычных задач; полный справочник настроек остаётся доступным.

### Изменения, влияющие на скрипты

- Конфигурация разделена на краткое руководство и полный справочник ключей, типов, значений по умолчанию, областей действия и переменных окружения.
  Публичный контракт CLI описывает выполнение без интерактивного ввода, схемы, ограничения, предварительный просмотр и правила повторных попыток.
- Проверка переносимых метаданных навыка, установленной версии, путей команд и полноты охвата ключей конфигурации в CI.
  Встроенный вход и необязательные вопросы настройки соблюдают общую политику запрета интерактивного ввода.

- **Первое определение настроек создаёт config.json.** Существующие файлы сохраняются; переопределения из окружения и флагов не записываются. config show теперь может создать файл, а обычные значения указывают значения по умолчанию из файла как свой источник.
- **Поиск слов и фраз учитывает словоформы.** Запросы в скриптах могут возвращать больше сообщений. Используйте exact: или --exact для прежнего поиска точной формы; явное text: по-прежнему учитывает словоформы. Языковые настройки архива влияют на совпадения.

### Исправления

- Подготовка поиска соблюдает readonly или запрет `conversations.links` до загрузки или постановки подготовки
  в очередь, включая устранение пробелов. Явное `--no-catch-up` по-прежнему позволяет разрешённое чтение истории.

- Контекст человека находит личные диалоги без записанных участников, если идентификатор диалога совпадает с
  идентификатором человека, восстанавливая личные сообщения и последнее сообщение в каждом направлении в существующих хранилищах Telegram.
- Прерванные операции записи сохраняют неизвестный исход, идентификатор операции и сведения для повторной попытки; проверьте
  результат перед повторением операции записи Bot API, у которой истекло время ожидания.

## 0.30.0 — 07.10.2026

### Изменения, влияющие на скрипты

- **`tg mcp` предлагает агенту три инструмента вместо одного на команду: `tg_tools_search`, `tg_read` и
  `tg_write`.** Агент находит команду по словам и выполняет её как
  `{ "command": "messages list", "arguments": { … } }`, с теми же аргументами и ответом, что у
  прежнего инструмента. `tg bot mcp` работает так же: `tg_bot_tools_search`, `tg_bot_read`, `tg_bot_write`.
  Причина: агент читал описания примерно 80 инструментов до первого вопроса.
  На что обратить внимание: прежние имена (`tg_messages_send`, `tg_status` и остальные) больше не работают, как и
  правила клиента, ссылающиеся на них; разрешите в клиенте `tg_read` и, если хотите, `tg_write`
  ([MCP](./mcp.md)).

- **Операции записи через MCP не показывают форму подтверждения: решение определяют только разрешения профиля.** Уровень
  `ask` работает как `allow` через MCP, как через stdin/stdout, так и через `--http`.
  Причина: формы не работали во многих клиентах и мешали работе.
  На что обратить внимание: с разрешениями по умолчанию агент теперь может удалять ваши сообщения; задайте
  `tg config set permissions.messages.delete readonly`, чтобы это запретить. Действия, для которых правила группы требуют
  подтверждения, остаются за вами. `--confirm-send`, `--allow-dangerous` и `--http-confirmation` (из
  0.30.0) принимаются с предупреждением и ничего не меняют; `tg mcp config` больше их не записывает.

- **Статистика использует `stats messages show`, `stats chats show` и `stats tasks show`.**
  Прежние пути `messages stats`, `chats stats` и `tasks stats` удалены. Обновите команды
  и точные разрешения до `stats.messages.show`, `stats.chats.show`, `stats.tasks.show`.
  MCP: используйте `tg_read` с тем же путём команды.
- **Ошибки разбора возвращают код выхода 2 со структурированным validation_error.** Скрипты, ожидающие
  обычный текст или код выхода 1, должны обновить обработку ошибок.

### Новое

- **Ход `tg setup` легче понять.** Каждый шаг — заголовок `[1/5] This computer`, а результат
  показан под ним с отступом; вопросы и QR-код находятся под своим шагом, вокруг кода — пустые строки.
  Заключительный блок выравнивает подписи, а команда для первой попытки находится вверху. Вывод `--json` и его ключи
  не изменились; `--quiet` по-прежнему скрывает шаги.

- **Список того, что требует вашего внимания.** Начиная с 0.29.0, `review` и `serve` сохраняют задачу в локальном хранилище для
  вопроса без ответа и сообщения с упоминанием вас по имени, а после вашего ответа закрывают её; теперь
  задачи можно увидеть. `tg tasks list` показывает каждую с её сообщением; `tg tasks add <message> --type
  promise` добавляет то, что правила не распознают; `tg tasks close <task> --as done|dismissed` закрывает задачу окончательно;
  `tg stats tasks show` подсчитывает их по чатам. Эти команды ничего не отправляют. MCP: используйте `tg_read` или `tg_write` с тем же путём команды.

- **Правила ответа можно редактировать через CLI; они используют шаблоны Liquid с необязательными блоками ai.**
  `replies add|edit|on|off` меняет правила, а `replies audience` — списки разрешений и запретов профиля.
  `models.replies` выбирает провайдера; `replies consents` даёт согласие для профиля и адреса API с
  исключениями по собственным идентификаторам чатов. Обычная `replies test` показывает инструкции и запасной ответ без вызовов;
  `--ai` явно передаёт сохранённые данные. Старые шаблоны сохраняют буквальный запасной ответ с предупреждениями.
  Отправка по-прежнему ограничена тестировщиками и replies.send; см. [архив](./archive.md#reply-rules).

- **Операции записи MCP могут выполняться из веб-клиентов без серверных форм.** Уровни разрешений профиля
  одинаково действуют для HTTP и stdio; `ask` и `allow` разрешают запрошенную запись MCP. Повторяйте
  `--permission key=level`, чтобы переопределить разрешения для этого процесса сервера без изменения конфигурации.
  Подтверждение приложения — отдельный механизм, который сервер не может проверить. [Настройка в браузере](./remote.md).

- **Графики можно сохранять в PNG.** `tg stats charts <chat> --output activity.png` записывает график с тёмным оформлением
  в новый файл; SVG остаётся доступным. В MCP `tg_read` с `command: "stats charts"` и `format: "png"`
  возвращает изображение и JSON без подключения к Telegram и без записи файла.
- **Промпт MCP open-tasks перечисляет ожидающие задачи.** Он вызывает review для обновления задач,
  затем выводит их с необязательным фильтром `chat`; закрывает задачи только после одобрения и ничего не отправляет.
- **Настройка в браузере охватывает Windows, macOS и Linux.** Руководство отдельно описывает команды PowerShell и
  терминала, временные разрешения на отправку, веб-вход Codex, два одновременных сервера
  и остановку отдельных туннелей. [Настройка в браузере](./remote.md).

### Исправления

- **Оценки дат регистрации стали точнее для аккаунтов, созданных в 2022–2025 годах.** Если Telegram не сообщает
  месяц, `contacts profile` оценивает его по идентификатору; оценка теперь основана на 212 реальных датах регистрации. Аккаунты
  2022 года больше не выглядят примерно на девять месяцев моложе: типичная погрешность оценок составляет один-два месяца.
  Идентификаторы до ноября 2025 года теперь получают оценку; более новые по-прежнему её не получают.

- **`tg serve` и `tg watch` корректно завершаются при остановке через SIGTERM или Ctrl-C.** Раньше они завершались с кодом 1 и
  `database is not open`, а поступающие обновления и контакты терялись: библиотека Telegram
  закрывала файл входа по сигналу до того, как команда заканчивала работу с ним. Теперь команда
  закрывает его один раз после сохранения поступивших данных.

- `chats show` показывает реальное число участников супергруппы, которое в списке чатов Telegram отсутствовало или
  устарело, а карточка группы или ссылка запросы показывает число участников обычной группы вместо 0. Список участников
  теперь тоже содержит число участников группы, поэтому `chats members fetch` сможет определить, кто вышел из супергруппы, когда
  tg перейдёт на следующую версию общей библиотеки.

## 0.29.0 — 06.10.2026

### Новое

- **Длинные сообщения участвуют в поиске по смыслу целиком.** Сообщение длиннее примерно 1200 символов делится
  на перекрывающиеся фрагменты перед построением векторов, поэтому поиск по смыслу `messages search` читает всё сообщение, а не только
  начало. Построенные раньше чаты считаются устаревшими, и `conversations build` или `search --refresh` перестраивает их
  (cli-messaging 0.153.0; хранилище переходит на версию 21, в которую старые сборки по-прежнему могут записывать).

- **Профиль человека.** `tg contacts profile <person>` показывает сведения Telegram о человеке: все
  имена пользователей, описание, день рождения, отметки самого Telegram (бот, проверенный, premium, мошенник, фальшивый аккаунт, ограничен, удалён),
  последний визит (`recently`, `week` и `month` больше не обозначаются как скрытые), являетесь ли вы
  контактами друг друга, дату создания аккаунта (месяц от Telegram или оценка по идентификатору, всегда
  помеченная), есть ли у человека собственная фотография, а также для каждого общего чата — число его
  сохранённых сообщений, первое и последнее. Номер телефона показывает последние четыре цифры, если не задан `--show-phone`. Команда
  обращается к Telegram не больше, чем `contacts show`. MCP: `tg_contacts_profile`.
- **История участия в группах.** `tg chats members fetch <chat>` сохраняет профили, изменения состава
  и ежедневное число участников; `--budget` ограничивает страницы, а после неполного чтения никто не отмечается как вышедший.
  `--track` запускает ежедневную загрузку, пока работает `tg serve`. `chats tracking list|show|add|remove` управляет
  отслеживаемыми группами; прекращение отслеживания сохраняет записанную историю. `chats members history --since-time` читает
  записанные вступления, выходы и изменения профилей без обращения к Telegram. Первый снимок фиксирует
  исходное состояние, а не доказывает, что каждый вступил в тот день; пропущенные дни не восстанавливаются.
  `chats members list --offline` читает последний полный сохранённый список. Использует cli-messaging 0.152.0.
- `tg contacts context <person> --chat <chat>` (повторите для нескольких чатов) даёт последние сообщения человека в каждом чате
  только со временем и текстом, чтобы агент мог их обобщить; `-v` добавляет идентификаторы и ссылки, `--limit` действует на чат, а `--refresh`
  сначала обращается к Telegram с одним поиском по отправителю для каждого чата.
- **Этот аккаунт — бот?** `tg contacts check <person>` оценивает человека по отметкам самого Telegram,
  профилю и самой старой фотографии, его сообщениям в хранилище и публичным спискам спама Combot CAS и
  lols.bot, в которые отправляется его идентификатор; `--no-registries` пропускает списки. `tg chats members audit --deep <n>` выполняет
  ту же проверку для первых n участников, по одному в секунду. Каждая причина указывает свой источник; это готовый запрос, а не
  окончательный вывод.

### Исправления

- **Справка объясняет, что читают проверки участников и куда подключаются.** `--no-registries` пропускает публичные списки
  блокировок, но всё равно запрашивает профиль и фотографии человека у Telegram; `--offline` — режим только локальных
  данных. Глубокие проверки читают не более 1,000 сохранённых сообщений на человека и делают отдельные запросы для
  выбранных участников. `contacts context --chat --refresh` явно подключается перед чтением хранилища.
- **`contacts profile` больше не оценивает дату регистрации самых новых аккаунтов.** Таблица идентификаторов заканчивается
  декабрём 2024 года и не позволяет отличить новый идентификатор 2025 года от 2026 года; такие идентификаторы теперь не получают оценки, вместо
  даты, которая могла быть на несколько лет раньше действительной.
- **`tg mcp --http`: Claude и ChatGPT могут завершить вход.** Страница входа заставляла браузер отправлять форму
  как будто без источника, и `tg` отклонял её с «Origin not allowed». Теперь вход работает (cli-messaging 0.152.0).
## 0.28.0 — 06.10.2026

### Новое

- **Поиск по тексту внутри файлов.** `attachments extract` индексирует сохранённый обычный текст, документы Word
  и текстовый слой PDF для запросов `content:`. Для Word и PDF нужны необязательные `mammoth` и `unpdf`; сканы и фотографии
  читает агент и сохраняет их текст через `attachments text set`. `--download --output-dir` явно скачивает недостающие файлы.
- **Обновление перед поиском и переход по ответам.** `--sync-first` загружает новое в пределах значений по умолчанию:
  пять чатов, 500 сообщений и 30 секунд; при неполном обновлении остаются локальные результаты, а охват отмечается как устаревший.
  `--thread` проходит по ограниченному сохранённому графу ответов с указанием происхождения связей, а без него переходит к контексту по времени.
- **Фильтр разговоров и выбор аккаунтов.** `--filter` использует строгий Lucene и применяется до ранжирования;
  одно сообщение должно соответствовать всему фильтру. `--source` явно расширяет охват. В MCP появились пакеты для связывания агентом,
  запись связей, пересборка и запрос `link-conversations`.
- **Настройки векторов и анализа задаются отдельно для каждого профиля.** По умолчанию остаются локальные векторы и агент владельца.
  Удалённые сервисы получают текст, только если вы их выбрали; `build --analyze --chat` запрашивает и запоминает
  согласие для аккаунта, чата и сервиса до отзыва. Настройка удалённых векторов также отправляет текст поисковых запросов MCP.

- **`tg` подключается через прокси: SOCKS5, HTTP `CONNECT` или MTProxy.** Прокси задаётся для профиля через
  `tg config set proxy <url>` — или `tg config set proxy -`, чтобы вставить адрес с паролем или секретом MTProxy; секрет
  хранится в хранилище ключей ОС и никогда не попадает в файл настроек, — либо для одного запуска через `TG_PROXY`. Команды Bot API используют
  тот же прокси SOCKS5 или HTTP; с MTProxy они подключаются напрямую, и `tg doctor` об этом сообщает. Прокси, который отказывает или
  недоступен, сразу даёт ошибку `configuration_error` (код 3), поэтому её нельзя принять за недоступность Telegram.
- **`tg doctor` сообщает, что он действительно проверил.** Вход показан как `not checked`, пока вы не добавите `--online`, а каждый
  закрытый файл или каталог, который могут прочитать другие пользователи, назван вместе с командой `chmod`, которая это исправляет; сам `doctor`
  права не меняет. `tg doctor --online` также сравнивает часы этого компьютера с часами Telegram (предупреждение при расхождении больше 10
  секунд) и сообщает, активен ли аккаунт, заморожен (с датами и ссылкой на обжалование), заблокирован, удалён или
  вышел из системы. `tg doctor` и `tg server status` показывают в `flood` ожидания, которые Telegram попросил соблюдать этот профиль, и запрет
  на его запись, если он есть.
- **`tg flood clear`** забывает эти ожидания и снимает запрет на запись, когда Telegram уже не ограничивает
  аккаунт. Команда не подключается к Telegram. Инструмента MCP для неё у агентов намеренно нет.
- **Метки: ваши собственные пометки на чате, человеке или отдельном сообщении**, хранятся в локальной базе и никуда не отправляются.
  `tg tags add <tag…> --chat <chat> | --contact <person> | --message <message>`, `tags remove` с той же целью
  и `tags list`. `tag:<tag>` в поиске находит помеченное. MCP: `tags_list`, `tags_add`, `tags_remove`.
- **Сохранённые поиски и история поиска.** `tg searches create <name> [query]` сохраняет поиск без запуска;
  `tg messages search --saved <name>` и `tg messages stats --saved <name>` запускают его — дополнительные слова добавляются через
  AND, а указанные параметры заменяют сохранённые. `searches list`, `show`, `history`, `delete` и `clear` управляют
  ими. Каждый успешный поиск и подсчёт сохраняется в истории: запрос и параметры, но не сообщения и не
  результаты, последние 1000. `--no-record` не добавляет запуск в историю; для MCP — `tg mcp --no-record` или `record` со значением
  `false`. Сохранённые поиски и история общие с max-cli, который использует ту же базу.
- **`tg contacts context <person>`**: что хранится в базе об одном человеке — общие чаты, последнее сообщение в каждую
  сторону, его недавние сообщения, где его упоминали другие — во всех связанных с ним мессенджерах. Команда никогда не
  подключается, и `permissions.messages: deny` блокирует её, как другие чтения сообщений. `tg contacts link <person>
  max:<person>` записывает, что аккаунты Telegram и MAX принадлежат одному человеку; `contacts unlink` отменяет это.
- **Правила ответов могут отвечать тестовым аккаунтам.** `tg serve` отвечает по правилам из `config/<profile>.replies.json`
  только аккаунтам из списка `testers` и только если `permissions.replies.send` имеет уровень `allow` — по умолчанию он `deny`,
  а пустой список не отвечает никому. `tg replies test` показывает, что правила ответили бы на
  сохранённые сообщения, и ничего не отправляет; `replies pause` сразу останавливает все правила, в том числе в работающем `serve`; `replies
  resume` отменяет паузу; `replies status` сообщает, могут ли правила отправлять и кому.
- **`tg store repair [--dry-run]`** приводит каждую таблицу базы к виду этой сборки, ничего не удаляя:
  таблица неправильного вида сохраняется копией рядом с новой, а `tg store copies delete <name>` удаляет копию
  после проверки. Команда восстанавливает базу, в которой чтение сообщения завершалось ошибкой на `messages.mentions`.
- При первом открытии этой версией в базе появляются таблицы для меток, сохранённых поисков, истории участников и основ слов;
  старые сборки `tg` по-прежнему открывают файл. `tg store migrate` и `tg store reindex` также строят индекс основ слов
  (для большой базы один раз выполните `tg store migrate`), а `tg config set searchStemmers.cyrillic` (`russian` или `none`)
  и `searchStemmers.latin` (`spanish`, `english` или `none`) выбирают стеммеры для всей базы. Поиск пока
  не использует основы.
- **`chats members audit` учитывает всё, что содержит список участников Telegram.** Для каждого участника теперь известно, когда
  он вступил, кто его пригласил и является ли аккаунт ботом, удалённым, помеченным как scam или fake, или без фотографии, —
  поэтому видны всплески вступлений, массовые запросы и помеченные аккаунты без дополнительных запросов на каждого человека.
- **`chats stats` считает комментарии к постам канала**, наряду с просмотрами и пересылками.
- **Файл, загрузка которого оборвалась, отправляется повторно до трёх раз, прежде чем что-либо будет отправлено.** Если не получилось,
  ошибка сообщает, что ничего не отправлено, вместо кода `14` «возможно, отправлено». Само сообщение по-прежнему отправляется один раз,
  со своим идентификатором отправки.
- **У поиска три руководства.** [Поиск сообщений](./search.md) — повседневный поиск по словам, людям, датам,
  файлам, ссылкам и меткам; [Поиск по темам](./topic-search.md) объясняет разговоры, векторы, актуальность и что
  отправляется удалённой модели; [Язык запросов](./query-language.md) — справочник.
- `tg mcp doctor` показывает последние строки вывода ошибок сервера, если он не запустился; домашний каталог,
  длинные числа и всё похожее на токены скрыты.

### Изменения, влияющие на скрипты

- **Результаты по смыслу от локальной e5-small должны иметь косинусное сходство выше 0.80, прежде чем объединяться с результатами по словам.**
  Точные совпадения слов остаются в выдаче. Результатов может стать меньше, а совмещённое попадание может стать только словесным.
- **В общем архиве появились таблицы текста вложений и согласия на анализ.** При открытии локальная схема обновляется
  с сохранением существующих сообщений; перед обновлением сделайте резервную копию большого архива.

- **Ожидание, которое попросил Telegram, запоминается.** После `FLOOD_WAIT` (код 8, `rate_limited`, с
  `retryAfterMs`) тот же вызов — а если ожидание касалось чата, то тот же вызов в этом чате — сразу завершается кодом 8
  и `details.remembered: true`, пока ожидание не истечёт, без запроса к Telegram. Скрипт, который сразу повторял запрос
  после кода 8, теперь снова получит код 8, только раньше. `tg flood clear` забывает ожидания.
- **Запись замороженного аккаунта или аккаунта с ограничением за спам удерживается.** После того как Telegram отклонил запись, потому что аккаунт
  заморожен или ограничен за спам (`PEER_FLOOD`), любая запись типа отправки завершается кодом 5 (`permission_error`) с указанием,
  до какого времени; чтение, реакции и отметка прочитанным работают. Ограничение за спам удерживается час и продлевается каждым новым
  отказом; заморозка — до даты окончания от Telegram или на сутки. `tg doctor --online` устанавливает запрет из-за заморозки и снимает
  его, когда аккаунт снова активен; запрет из-за спама он не снимает никогда — это делает `tg flood clear`, когда вы знаете, что ограничение
  снято.
- **`PEER_FLOOD` завершается кодом 5 (`permission_error`), а не 11**, и указывает на @SpamBot: повторы только ухудшают
  ситуацию. Отказ замороженному аккаунту тоже даёт `permission_error` с указанием на `tg doctor --online`, а не ограничение частоты,
  которое нужно переждать. Заблокированный или удалённый аккаунт больше не предлагает войти заново.
- **Разовая команда пережидает FLOOD_WAIT до 10 секунд не более двух раз, а не пяти**, и сообщает об этом в
  stderr; следующее ожидание завершает её кодом 8 (`rate_limited`) и `retryAfterMs`. `serve` и `watch` ждут до
  2 минут, три раза.
- **`tg serve` и `tg watch` завершаются, когда Telegram завершает вход во время их работы**, с кодом 4, примерно в течение 15
  минут; служба после этого не перезапускается. Если обновления прекращаются по другой причине или Telegram не отвечает на запрос
  в течение 30 секунд, они завершаются с кодом 12, после которого systemd перезапускает службу. Раньше они продолжали работать и ничего
  не получали.
- **`AUTH_KEY_DUPLICATED` от Telegram** (вход завершён, потому что его одновременно использовали два соединения) теперь
  `authentication_error`, код 4, а не `provider_error`. Сообщение предлагает войти заново и называет причиной пересекающиеся
  процессы `tg`.
- **Закрепление, открепление, реакция, отметка прочитанным, удаление, голосование, закрытие опроса, изменения папок и контактов завершаются кодом `14`
  (`outcome_unknown`), если Telegram не ответил**, вместо ошибки времени ожидания или сети, которую журнал отправок
  записывал как неудачу. Сообщение говорит, безопасно ли повторить; для создания папки — нет:
  сначала проверьте `tg chats folders list`.
- **`tg inbox`, `inbox --new`, `review` и `chats list --unread` (также с `--search` и `--kind`) просматривают все
  чаты**, а не только последние 100 или 200, поэтому непрочитанный чат ниже по списку больше не пропускается. Это стоит
  одного запроса на 100 чатов. `partial` теперь означает только то, что Telegram не смог перечислить все чаты; чаты сверх
  ограничения в 20 за запуск названы в примечании `skipped N chats`.
- **`tg messages list --after-id`, `--after-time` и `--before-time` больше не останавливаются на странице короче
  `--limit`.** Telegram не включает удалённые сообщения в страницу, поэтому короткая страница в середине чата давала
  `hasMore: false` и теряла подсказку для следующей страницы. Теперь они сообщают о продолжении, пока Telegram не вернёт
  пустую страницу, как уже делал обычный `messages list`: последняя страница может сообщать о продолжении, а переход по её подсказке
  возвращает пустую страницу.
- `tg messages search` принимает запрос как необязательный, поскольку `--saved` может использоваться отдельно; без обоих команда по-прежнему отказывает.

### Исправления

- **Локаторы контекста с указанием аккаунта отклоняют чужой аккаунт до чтения.** MCP также принимает
  `offline: true` для обычного сохранённого контекста.
- **Остановка `tg serve` через Ctrl-C или сигналом завершается с кодом 0.** База сессии закрывается один раз, без
  прежней ошибки «database is not open» при завершении.

- **`messages delete` сначала проверяет, что идентификаторы принадлежат чату.** В личном чате или обычной группе Telegram
  нумерует сообщения отдельно для каждого аккаунта и удаляет только по номеру, поэтому идентификатор из другого чата — или номер
  того же сообщения у собеседника — удалял сообщение там. Теперь любой идентификатор не из указанного чата останавливает
  всё удаление с кодом 2, и ничего не удаляется.
- `text:/…/` в строгом поиске приводит буквы к общему виду так же, как индекс слов, поэтому `text:/Квартир.*/` и `text:/счёт/`
  находят пропущенные раньше слова. Ошибка поиска подсказывает, что делать: `~` указывает на `--language legacy`, слишком короткий
  для раскрытия префикс — на более длинный, а ещё строящийся индекс — на точную команду `tg store migrate`.
- Два `tg serve`, запущенные одновременно для одного профиля, больше не могут работать вместе.
## 0.27.0 — 04.10.2026

### Новое

- `tg mcp --http --public-url https://<name>.ts.net` работает за вашим HTTPS-туннелем с собственным входом OAuth по коду владельца.
  Каждая запись через HTTP требует формы; `tg mcp --revoke` забывает входы из браузера для профиля.
- `tg chats stats <chat>` считает сохранённую активность группы или канала и запрашивает у Telegram вступления и выходы.
  Результаты без подключения и через MCP не содержат состава участников; неполные счётчики — нижняя граница.
- `tg chats members audit` перечисляет подозрительные признаки участников, никого не удаляя; недоступные признаки
  указываются в `unknown`. Входящие и review в MCP принимают `kinds` и `new` с собственными позициями.

- Личный MCP использует общий каталог, принятый и в MAX. Предпросмотр фотографий принимает `index`,
  а прямое распознавание речи — `model`. SDK также добавляет статистику архива, готовность разговоров
  и ограниченное локальное обновление; модели никогда не скачиваются автоматически.

### Изменения, влияющие на скрипты

- Охват поиска и статистики использует фактический список чатов и время загрузки; каждая запись о полноте получает
  `fetchedAt`. Старые базы получат эти данные после следующего полного чтения списка чатов и загрузки истории.
  Запрос `/catch-up` принимает `kind` и `mode` вместо `since`.
- `config set permissions` отклоняет неизвестные ключи команд, в том числе внутри целого объекта, с кодом 2.
  Существующие файлы дают предупреждение и продолжают работу; `config unset` может удалить старый неизвестный ключ.
- `store fetch --page-size` больше 100 отклоняется до подключения. Выполните `store fetch <chat>` повторно, чтобы исправить
  неверную отметку начала истории, если есть более старые сообщения.

- **`tg serve` завершается с кодом 12 (`provider_unavailable`), если сохранённая сессия есть, а данные приложения недоступны**,
  например пока хранилище ключей заблокировано. Systemd повторяет запуск через 30 секунд; в macOS нужен `tg server start`.
  Другие команды и профили без сохранённой сессии по-прежнему завершаются с кодом 4.
- **`tg serve` и `tg watch` не запускаются и завершаются с кодом 4 (`authentication_error`), если сессия уже отозвана.**
  Они проверяют вход до сообщения о готовности. Сессию, отозванную после запуска, по-прежнему нужно проверять отдельно.
- **Фоновая служба больше не перезапускается при этом коде.** В systemd код 4 запрещает перезапуск. В macOS
  launchd не умеет исключить один код завершения, поэтому агент больше не перезапускается ни после какой ошибки. Снова выполните `tg server install`,
  чтобы обновить службу; после `tg session start` выполните `tg server start`.

- Неизвестные аргументы личного MCP теперь вызывают ошибку до выполнения. Используйте объявленную схему, в том числе
  `at_time` для отложенной отправки. Одобренная отложенная отправка выполняется в абсолютное время, показанное в форме.

- **`tg messages list` может ответить `hasMore: true` с подсказкой `older messages: --before-id` на странице короче
  `--limit`.** Telegram не включает удалённые сообщения в страницу, поэтому короткая страница не доказывает, что достигнуто первое сообщение чата.
  Даже последняя непустая страница может сообщать о продолжении; переход по её подсказке может вернуть пустую страницу.

### Исправления

- Прежний поиск, поиск по регулярному выражению и поиск только по фильтрам сообщают фактическую готовность индекса слов. `server status` сообщает
  о последнем обычном завершении службы и даёт подсказку об остановленном входе, если служба намеренно остаётся остановленной.

- **`tg store fetch` больше не останавливается раньше времени и не считает чат полным, если страница пришла короткой.**
  Telegram не включает удалённые сообщения в страницу, поэтому страница может быть короткой в середине чата; загрузка
  теперь продолжается, пока у Telegram есть более старые сообщения. Для чата, уже отмеченного полным, хотя более старых
  сообщений не хватает, снова выполните `tg store fetch <chat>`: команда прочитает то, что ниже сохранённого.

## 0.26.0 — 04.10.2026

### Новое

- **Встроенные инструкции для агента объясняют, как находить договорённости, готовиться к встречам и рекомендовать контакты.**
  Агент проверяет полноту архива, сопоставляет групповые и личные переписки, различает людей
  с одинаковыми именами и сохраняет черновик, если отправка запрещена.

- **`tg messages link` и инструмент MCP для чтения `tg_messages_link` возвращают постоянную ссылку и локатор сообщения.**
  В каналах и супергруппах ссылки сохраняют контекст обсуждения; для частных ссылок нужен доступ,
  сама ссылка не добавляет пользователя в чат. Для личных переписок, обычных групп и Избранного
  возвращается локатор. Без соединения проверяется сохранённое сообщение; локаторы другого
  аккаунта отклоняются. Команда `link` отличается от `links`, которая показывает связи переписок.

### Изменения, влияющие на скрипты

- **Снятие закрепления использует отдельное разрешение `messages.unpin` в cli и MCP.** Раньше общая
  проверка использовала `messages.pin`. В профилях с явно заданными современными разрешениями
  стоит проверить правило снятия закрепления; прежнее `allow: ["pin"]` по-прежнему покрывает оба действия.

- **`tg commands [path...] --json` описывает отдельную команду или группу.** Например,
  `tg commands messages search --json` возвращает глобальные параметры и коды завершения вместе
  со справкой этой команды. Без пути возвращается всё дерево; ответ для конкретного пути содержит
  `scope` и `inheritedOptions`. Разные пути команд проверяйте отдельными вызовами.

### Исправления

- **Перед отбором вопросов без ответа учитываются сохранённые и запрошенные новые расшифровки голосовых сообщений.**
  Добавьте `--transcribe`, чтобы распознать голосовые сообщения без сохранённого текста.
  Нераспознанные сообщения оставляют `complete` равным false: сохраните прежнюю границу проверки,
  а не считайте пустой результат доказательством того, что отвечать не на что.

- Команды, одновременно открывающие локальный архив, немного ждут его инициализации вместо
  немедленной ошибки при блокировке записи другим процессом. Длительная блокировка по-прежнему вызывает ошибку.

- Файлы для распознавания речи скачиваются через соединение с историей; перед локальным
  распознаванием оно закрывается. Второе соединение для `messages list --transcribe`, `inbox` и `review` больше не требуется.

## 0.25.0 — 03.10.2026

### Исправления

- `chats show` объясняет, что различие между списком участников и их общим количеством может
  быть связано с отсутствием самого пользователя в списке или с частичным списком, а не обязательно
  с неполной загрузкой. Данные JSON не изменились.

### Новое

- README и руководство по ботам явно описывают полный набор методов API: все 185 методов
  зафиксированной схемы Telegram Bot API 10.3, а также удобные команды бота и инструменты MCP для конкретных задач.

- `config migrate --dry-run` показывает преобразование прежних настроек доступа в современные
  разрешения без записи и соединения; `config migrate` применяет его по явному запросу,
  сохраняя действующие уровни доступа. Остальные настройки не меняются.

- `tg <bot> bot api <method>` предоставляет методы зафиксированной схемы Telegram Bot API через
  генераторы cli-core и общий сборщик команд MAX/TG. Флаги полей API, тела JSON/stdin и вложенные
  загрузки файлов используют общую проверку данных и разрешений записи. Разрушительные методы
  требуют подтверждения по умолчанию; операции записи без ответа не повторяются.
  Учётные данные управляемых ботов требуют явного назначения `--store-token <profile>` и хранятся
  только в системном хранилище ключей; stdout содержит подтверждение сохранения.

## 0.24.0 — 03.10.2026

### Изменения, влияющие на скрипты

- `--md` использует собственный форматтер Telegram для отправки, правок и подписей личного аккаунта и бота. Поддерживаются вложенные стили, подчёркивание, спойлеры, ссылки, блоки кода и цитаты. `__text__` означает подчёркивание; одиночный `*text*` теперь означает жирный текст. Синтаксис MAX отличается. Недопустимая вложенность и небезопасные ссылки отклоняются до изменения данных.

## 0.23.0 — 03.10.2026

### Изменения, влияющие на скрипты

- **Локальный поиск сообщений по умолчанию использует строгий профиль Lucene:** группы, типизированные поля и диапазоны дат, `--timezone`, подстановочные знаки и regex с ограничениями, а также охват при пустом результате. Начало слова задавайте явно через `word*`; для прежнего неточного поиска используйте `--language legacy`. Руководство по поиску и skill агента объясняют переход. JavaScript `--regex` работает в изолированном рабочем потоке с ограничениями размера и времени.

- **`tg upgrade --json` всегда включает `restarted`**, даже при проверке и обновлении без изменений. Прежние поля сохраняются; успешное обновление сохраняет политику перезапуска управляемых серверов. Скриптам с проверкой точного набора ключей нужно принимать пустой массив, если ни один сервер не перезапущен.

### Новое

- **`tg mcp` освобождает модель поиска через 10 минут без запросов**: `conversations_search` агента больше не удерживает около 1 ГБ памяти на протяжении всей сессии. Следующий поиск заново загружает модель примерно за секунду.
- **`tg <bot> bot me` и MCP `tg_bot_me`** показывают идентификатор, имя и имя пользователя бота профиля. Команда использует токен бота, не поддерживает автономный режим и не отправляет сообщений.

- Глобальная установка npm устанавливает skill агента до входа, если разрешён установочный скрипт. В Windows сохраняет каталог команд npm в пользовательский PATH и оставляет рабочий запуск `.cmd` при ограничительной политике PowerShell. Установщик Windows одной командой также обновляет текущую оболочку, устанавливает skill при пропущенных скриптах и проверяет запуск `tg` без доступа к аккаунту.

- **Настройка доступна сразу после установки**: основная справка и ошибки первого запуска направляют к `tg setup`; справка настройки и входа содержит примеры, инструкции для агента и советы для Windows. Быстрый старт, установка, MCP и безопасность согласованно объясняют первый запуск. `tg skill show` работает до входа; завершение настройки направляет агента к этой команде.

- **`tg topics enable` включает темы форума, `tg topics create` создаёт тему с названием.** Обычная группа требует явного `--upgrade --yes`; её идентификатор меняется, результат содержит новый адрес. CLI и MCP проверяют права и сообщают частичный результат, если преобразование удалось, а включение тем — нет. Создание темы использует `--send-id` как идентификатор попытки; журнал запрещает повторное использование после успешного или неизвестного результата. Никогда не повторяйте создание темы с неизвестным результатом. Старые строки архива сохраняют исходные идентификаторы чатов.

- **`tg messages send --topic` и `tg polls create --topic` отправляют в выбранную тему форума.** Текст, подписи медиа, ответы и отложенные сообщения сохраняют тему; отсутствующие или закрытые темы и ответы из другой темы отклоняются до отправки. MCP принимает тот же адрес в `topic`.
- **`tg setup` проводит первый запуск**: локальные проверки, автоматическая регистрация приложения или регистрация через браузер, вход по QR или телефону, проверка пяти чатов и необязательный skill агента. Использует существующую сессию, объясняет ожидание около пяти минут и оставляет загрузку истории отдельным выбором. Инструкции Windows включают обёртки `.cmd` и запасной вариант npm exec при отсутствии PATH.

- **`tg mcp setup codex|claude-code` и `tg mcp doctor`** добавляют локальный сервер в клиент и проверяют подключение со списком инструментов. Setup требует `--allow-writes`, если профиль предоставляет инструменты изменения; doctor не проверяет вход в Telegram.
- **`tg <bot> bot store fetch <chat>` загружает старые сообщения каналов и супергрупп** в локальную копию бота без отправки и отметки прочитанным. Для первого запуска без известного номера сообщения используйте `--from <message link>`; следующие запуски продолжают назад. Личные чаты и обычные группы не поддерживаются. См. [руководство по ботам](./bot.md#fetching-older-messages).

### Исправления

- **При усечённом `tg runs list --limit` предлагается увеличить `--limit`**, а не использовать неподдерживаемый `--page`. JSON по-прежнему сообщает `hasMore`; чтение сохранённых запусков не создаёт новую запись.
- Ранние ошибки команд бота учитывают настройки записи бота, а неизвестная подкоманда больше не обвиняет корректный профиль в начале команды. Общий исполнитель применяет эти правила согласованно.

- Завершение входа корректно сокращает пути домашнего каталога Windows. Проверки документации выпуска распознают разделители путей Windows. Тесты прав файлов применяют Unix-права только в Unix; в Windows доступ определяется унаследованными ACL, что теперь указано на странице безопасности.

## 0.22.0 — 03.10.2026

### Новое

- **`tg messages evidence <chat>` и `tg_messages_evidence` в MCP** готовят ограниченный пакет локального архива для сводки агента без подключения и отметки прочитанным. Указатели источников, отпечатки, явная полнота и курсор старой страницы обеспечивают точность цитат и продолжения. Целые сообщения занимают до 64 КиБ JSON; `--limit` принимает 1–100.

- **`tg <name> bot contacts show --refresh`** использует справку как `max`, без имени мессенджера (cli-messaging 0.109.0).
- **Полная документация бота** ([Бот Telegram](./bot.md)): поиск идентификатора чата, файлы, лимиты и коды завершения.
- **`tg <name> bot contacts show`, `bot messages search`, `bot messages between`** читают локальную базу бота. См. [Сохранённые данные](./bot.md#what-the-bot-kept).
- **`tg <name> bot chats moderate`, `bot chats rules`** проверяют новые сообщения по правилам и выполняют разрешённое. Читают сохранённое `bot watch`, поскольку Telegram не даёт историю. См. [Модерация](./bot.md#moderating-a-group-by-its-rules).
- **`tg <name> bot mcp` — бот для агента** с инструментами по разрешениям профиля и формой перед удалением. См. [MCP бота](./bot.md#the-bot-for-an-agent-mcp).
- **Язык запросов `tg messages search`**: `"a phrase"`, `-word`, `a OR b`, `from:`, `chat:`, `after:`/`before:`, `has:`. Исправление опечаток сообщается в stderr. `--context <n>` показывает контекст (2 сообщения в терминале). `in:max`, `in:all`, `--source` включают другие аккаунты, в том числе MAX. См. [Поиск](./archive.md#search).
- **Поиск разговоров группы по смыслу**: `tg conversations embed --chat <chat>` строит локальные векторы; `tg conversations search "<question>"` ищет ближайшие в одном или всех обработанных чатах. `tg models text list|download` скачивает модель в общий с моделями речи каталог. `--provider openai` или `--base-url` для Ollama, LM Studio и других использует ваш сервис после оценки передачи и стоимости. См. [Поиск по темам](./topic-search.md).
- **`tg store fetch` не зацикливается** при повторных ответах Telegram с теми же сообщениями.
- **`tg bot watch`** сохраняет события до вывода; `--events` — правки, кнопки, вступления и выходы. **`tg bot callbacks answer`**, **`tg bot commands list|set|clear`**, **`tg bot webhooks
  list|set|delete`**, как `max bot`. См. [Бот Telegram](./bot.md).
- **`tg bot chats admins list|add|remove`**, **`tg bot chats members remove [--block]`**: администраторы, права и титул, назначение с `--can`, `--title`, снятие прав, удаление участника, с `--block` — блокировка. См. [Бот Telegram](./bot.md).
- **`tg bot messages send|list|show|edit|delete|pin|unpin`**, **`tg bot chats show|leave|action`**: бот пишет по идентификатору/названию или `user:<id>`, с `--md`, `--html`, файлом/фото. `list`, `show` читают локально отправленное и полученное, поскольку истории Telegram нет. Удаление требует подтверждения или `--allow-dangerous`.
- **Ваш ИИ-агент связывает разговоры по запросу**: `tg skill show
  link-conversations` объясняет процесс. Сначала объём текста и согласие, затем пакеты (`tg conversations batches next`, `tg conversations links add`); `tg conversations links clear` удаляет связи. Сам tg не вызывает модель. См. [Локальная база](./archive.md).
- **`tg mcp` предоставляет инструкцию ресурсом `tg://skill`**, указывая её при подключении: агент читает без `tg skill show`.

### Изменения, влияющие на скрипты

- **`tg messages search` сначала показывает лучшее совпадение**; `--newest` возвращает прежний порядок. Без всех слов поиск пробует любое, затем часть слова. JSON сохраняет `items`, `limit`, `hasMore`, добавляет `match`, `score`, `corrections`, `completeness` (полнота по чатам), `wordsReady`. Запросы из одной-двух букв больше не отклоняются.
- **Нужен Node 22.16+** или Bun. При слишком старом системном SQLite в Linux `tg` перезапускается на своём SQLite из `@wirecat/cli-messaging-sqlite` до чтения/отправки. Официальные сборки Node/Bun работают без изменений.

### Исправления

- **Отказ изменения ботом указывает правильную команду настройки** с `--bot` и ключом разрешения (cli-messaging 0.111.0). Раньше `config` ошибочно располагался внутри `bot`.

- **Локальные изменения больше не помечаются как изменения Telegram.** `config set`, `unset`, `chats rules set`, `unset`, `recipients add`, `remove`, `clear`, а также `auth set`, `auth remove`, `recipients add`, `remove`, `clear` бота записывают настройки, правила, получателей или ключи. [Справочник команд](./commands.md) отмечает локальные изменения; в `tg commands` они остаются изменяющими. `chats moderate`, `session end` меняют Telegram.
- **`tg contacts show` включает личный чат** в общий список от новых к старым. Раньше показывались только группы, возвращаемые списком общих чатов Telegram.

## 0.21.0 — 01.10.2026

### Новое

- **`tg bot`** — бот Telegram через официальный Bot API: `bot auth set|show|remove`, `bot list [--check]`, `bot chats list`, `bot recipients list|add|remove|clear`, `bot sends list`, аналогично `max bot`. Несколько имён ботов; токен в хранилище как `bot:<name>` или `TG_BOT_TOKEN`. См. [Бот Telegram](./bot.md).
- **`tg conversations batches status|next --chat <chat> [--size <n>]`** — пакеты групповой переписки для связывания вашим ИИ-агентом. `status` показывает оставшиеся сообщения и пакеты, `next` — следующий пакет. Сам tg не вызывает модель.
- **`tg skill install [--for claude|agents|all]`** устанавливает инструкцию для Claude Code и других агентов. При отсутствии копии агенту сообщается раз в день в stderr; отключение: `tg config set skillHint false --defaults`.
- **`tg store clear --left`** удаляет покинутые чаты с сообщениями из базы. Требует `--allow-dangerous`, иначе только показывает объём.
- **`tg conversations build|list|show`**, **`tg messages links`**, MCP `tg_conversations_list`, `tg_conversations_show` — разговоры группы из сохранённых ответов, упоминаний и очередности авторов без Telegram и AI. Построение только после `build`. См. [Локальная база](./archive.md#conversations-in-a-group).
- **Сохраняются упоминания по имени**, а не только @username, для связывания разговоров.
- **`tg chats rules show|set|unset`**, **`tg chats moderate`**, MCP `tg_chats_rules_show`, `tg_chats_moderate` — правила ссылок, приглашений, пересылок, флуда и заблокированных участников. Уровни: запрет, отчёт, подтверждение (по умолчанию), действие. Ничего не работает в фоне. См. [Группы](./groups.md#rules).
- **`tg messages list --before-time`** читает назад от ISO 8601 или `2h` / `1d` назад.
- **`tg contacts add|remove|block|unblock|rename|import`**, **`tg account update`**, **`tg account sessions end --others`**, MCP `tg_contacts_add|remove|block|unblock|rename`, `tg_account_update`. `contacts import` читает строки `number, name` и возвращает только числа и найденных людей. Завершение сессий отключает и телефон, требует подтверждения и не предлагается агенту.
- **`tg chats folders list|create|update|delete`**, MCP `tg_chats_folders_list|create|update|delete`. Остальные чаты папки сохраняются; неизменяемая папка «Все чаты» не выводится.
- **`tg chats members add|remove`**, **`tg chats admins add|remove`**, MCP `tg_chats_members_add|remove`, `tg_chats_admins_add|remove`. `--can`: members, admins, info, pin, link, post, edit, delete; отдельного права читать нет. Неудачные добавления перечисляются; каждый участник входит в часовой лимит.
- **`tg chats update <chat>`**: `--title`, `--description`, `--all-can-pin on|off`, `--only-admins-add on|off`; **`tg chats link show|reset`**, MCP `tg_chats_update`, `tg_chats_link_show`, `tg_chats_link_reset`. `tg chats show` показывает описание, приглашение и настройки.
- **`tg chats create <title> [person...]`, `tg chats join <link>`, `tg chats leave <chat>`**, MCP `tg_chats_create`, `tg_chats_join`, `tg_chats_leave`. Создаётся супергруппа (`--channel` — канал); ошибки добавления перечисляются. См. [Использование](./usage.md#groups-and-channels).
- **Разрешения команд для вас и агента.** `permissions`: `deny` (включая чтение), `readonly`, `ask`, `allow`. Конкретный ключ важнее общего: `tg config set permissions.messages.delete allow`. По умолчанию всё разрешено кроме удаления и завершения других сессий с подтверждением. `ask` спрашивает y/N; `--allow-dangerous` подтверждает удаление, `--yes` — другое изменение в скрипте. `readOnly` и `allow` совместимы. См. [Безопасность](./security.md).
- **`tg messages send --voice <file>`** — Ogg Opus как голосовое; `.mp4`, `.mov` с `--file` воспроизводятся как видео; `--as-file` оставляет скачиваемым файлом.
- **`tg messages list --mark-read`** отмечает чат до последнего показанного сообщения. Обычное чтение не отмечает.
- **`--model` с `--transcribe`** для `tg messages list`, `tg inbox`; **`tg review
  --transcribe`** — текст голосовых в обзоре.
- **`tg store fetch --last <n>`** останавливается после сохранения последних n сообщений; повтор с `--last` проверяет одну страницу и выходит.
- **`tg polls create --revote`** разрешает менять голос.
- **`tg store export --output <file> --since-time <time>`** пишет в новый закрытый файл без перезаписи, начиная с выбранного времени.
- **`tg account show`** показывает последние четыре цифры телефона, полный номер — с `--show-phone`. `tg_account_show` всегда показывает только четыре.
- **`tg messages forward --send-id`** повторяет неизвестную пересылку без дубликата, как отправка. `--json` возвращает `sendId`; `tg_messages_forward` принимает `send_id`.
- **`tg messages edit --md`** форматирует как `messages send --md`; `tg_messages_edit` принимает `markdown`.
- **Обслуживание базы: `tg store info`, `check`, `migrate`, `backup`, `restore`.** `info` — путь `messages.db`, размер, структура, строки. `check` — целостность, внешние ключи, индексы, свободный диск, отстающие чаты; ничего не исправляет. `migrate` обновляет структуру и старые сообщения. `backup <file>` копирует используемую базу в новый закрытый файл. `restore <file>` сохраняет заменяемую базу рядом; запрещён при `tg serve` или открытой базе. После восстановления общей с max-cli базы перезапустите `serve` и `mcp` обоих CLI.
- **Каждое изменение имеет `operationId`** в `--json`, MCP, журнале и `--trace`: отправка, правка, пересылка, удаление, закрепление, реакция, отметка прочитанным, голос. Для отправки `operationId` равен `sendId`.
- **Размер установки меньше примерно на 16 МБ**: cli-messaging 0.60.0 включает слой базы вместо отдельной зависимости.

### Изменения, влияющие на скрипты

- **`tg server status --json` возвращает общие для обоих инструментов поля**: `since` становится `startedAt`,
  `listening` — `connected`, `listeningSince` — `connectedAt`; добавлены `cliVersion`, `log` и
  `stale`, когда завершившийся `serve` оставил блокировку. `tg server start` возвращает `startedAt`
  и `connectedAt` так же, а `tg server stop` сообщает, кто его запустил (`by`). Строки вывода говорят
  «connected» вместо «listening».
- **`tg messages send --at` → `--at-time`**.
- **Аргументы MCP соответствуют параметрам:** `tg_messages_list`: `before_id`, `before_time`, `after_id`, `after_time`; `tg_messages_context`: `before_n`, `after_n`; `since` → `since_time` в `tg_inbox`, `tg_review`, `tg_chats_events`, где `event` → `type`; `tg_messages_send`: `md`, `at_time`.
- **Названия параметров указывают тип принимаемого значения.** Старые названия отклоняются как неизвестные параметры;
  псевдонимов нет. Аргументы инструментов MCP не меняются.
  - `tg messages list --before` → `--before-id`; `--after` → `--after-id` для идентификатора или `--after-time` для времени.
  - `tg messages context --before`, `--after` → `--before-n`, `--after-n`.
  - `--since` → `--since-time` в `tg inbox`, `tg review`, `tg chats events`, `tg store fetch`.
  - `tg messages download --output` → `--output-dir`.
  - `tg chats events --event` → `--type`.
- **`tg review --unanswered` принимает длительность** (`4h`, `1d`), а не часы без единицы; `--unanswered 4` отклоняется. Без значения 24 часа. MCP `tg_review` по-прежнему принимает часы.
- **`tg chats events --json`: `{ items, page, limit, hasMore, chatId, since }`**, `events` → `items`, `more` → `hasMore`. **`tg server logs --json`**: `lines` → `items`. `--jsonl` не меняется.
- **`.mp4`, `.mov` с `--file` воспроизводятся как видео**; `--as-file` сохраняет прежний вид файла.
- **`tg mcp` выбирает инструменты по разрешениям профиля.** По умолчанию отправка, правка, пересылка, реакции, голосование, отметка прочитанным без `--allow-send` и формы. Удаление с формой; `tg mcp --allow-dangerous` пропускает её. Для чтения профиль с `readOnly`: [MCP](./mcp.md). `--allow-send`, `--allow-mark-read`, `--allow-delete` устарели и предупреждают; `--confirm-send` показывает каждое изменение.
- **`tg messages delete` спрашивает** без `--allow-dangerous` вместо отказа; без терминала отказ сохраняется.
- **`tg store fetch --max <n>` удалён:** `--limit <n>` ограничивает сообщения запуска (1000), `--page-size <n>` — страницу (100), как max-cli. Псевдонима `--max` нет.
- **Опрос без `--revote` больше не позволяет менять голос**, как в max-cli; раньше Telegram
  разрешал это по умолчанию. Добавьте `--revote`, чтобы сохранить прежнее поведение.
- **`tg polls vote`, `tg polls close --json`: `{ operationId, poll }`**, опрос теперь в `.poll`. `tg_polls_vote`, `tg_polls_close` аналогичны.
- **`tg runs list`, `tg sends list`, `tg recipients list --json`: `{ items, page, limit, hasMore }`** вместо массива; строки в `.items`. `--jsonl` не меняется.

### Исправления

- **`tg chats list` не дублирует закреплённые чаты.** Страницы Telegram с архивом повторяли закрепления ниже: на одном аккаунте 8 из 1361 чатов. Название такого чата также ошибочно считалось неоднозначным.

- **`tg server stop` и Ctrl-C корректно завершают `serve`, `watch`.** Раньше очистка не успевала, и `tg server status` показывал `stale`.
- **`tg server` из репозитория не меняет службу установленного tg.** Свои `TG_STATE_DIR` или база дают отдельное имя службы; установленный использует `tg-serve-<profile>.service`.
- **Покинутые чаты исчезают из `chats list --offline`** после полного `tg chats list`. Сообщения остаются до `tg store clear --left`; повторное вступление возвращает чат.

- **Отказы объясняют действия.** При повторном добавлении вышедшего или удалённого человека без взаимных контактов предлагается приглашение (`tg chats link show <chat>`). Неизвестный аккаунту идентификатор требует @username или предварительного чтения его чата.

- **Ошибка библиотеки не повторяет аргументы.** Раньше могли раскрыться названия и ссылки. Теперь сообщается тип неверных данных: не вступивший чат, сообщение, приглашение, телефон, код или пароль; иначе общий отказ аргумента.
- **Переписка отображается на английском.** Ваши сообщения — `you`, даты — `26 September 2026`; раньше были русскими.
- **Отсутствующие чат/сообщение — `not_found`**, неверный тип чата — `validation_error`, вместо общего кода 1 и текста библиотеки с возможным раскрытием названия.
- **Ошибка входа указывает профиль:** `tg <profile> session start`.
- **Права загрузок и экспортов снова обычные.** Раньше вход делал все последующие файлы tg закрытыми. Сессия и связанные файлы остаются доступны только владельцу.

## 0.20.0 — 30.09.2026

### Новое

- **В базе сохраняется @username автора**, для `--from @name` и связывания упоминаний. cli-messaging 0.57.0+; старая история обновляется при следующей загрузке.
- **`tg store fetch <chat> --since <time>`** останавливается у сообщений старше `2026-09-01` или `2h` / `1d` назад.

### Изменения, влияющие на скрипты

Команды используют единый порядок: существительное, затем глагол. Старые имена удалены без псевдонимов; скрипты получают «unknown command» или «unknown option».

- **`tg export <chat>` → `tg store export <chat>`**, **`tg sync status [chat]` → `tg store status [chat]`**, **`tg backfill <chat>` → `tg store fetch <chat>`**, **`tg backfill list|status|cancel` → `tg store jobs list|show|cancel`**. `store fetch` загружает по умолчанию; `--estimate` оценивает. `--pace` → **`--pause`** там и в `tg messages download --all`. `--max` пока сохраняется и считает сообщения.
- **`tg messages reply` удалён:** ответ через `tg messages send <chat> [text] --reply-to <id>`, доступны `--file`, `--photo`, `--silent`, `--at` и остальные. Для `msg:telegram/…` замены нет: укажите чат и сообщение.
- **`tg chats read` → `tg chats mark-read`**; `tg_chats_read` → `tg_chats_mark_read`.
- **`tg recipients off` → `tg recipients clear`.**
- **`tg update [--check]` → `tg upgrade [--check]`**, уведомление тоже указывает `tg upgrade`.
- **`tg messages search <words…>`** переименовывает аргумент в `<text…>` без изменений поиска.

## 0.19.0 — 30.09.2026

### Исправления

- **tg выходит после завершения команды.** Раньше загрузка могла оставаться открытой полчаса даже с `--timeout`. Через пять секунд перечисляются открытые ресурсы в stderr и процесс выходит со своим кодом, дожидаясь записи вывода.

## 0.18.0 — 30.09.2026

### Исправления

- **Супергруппа/канал, впервые увиденные через сообщение, не теряют сообщения из-за удаления в личном чате** (cli-messaging 0.54.0). В 0.16.0 тип мог быть неизвестен; теперь достаточно `-100…`.
- **Ошибочно удалённые записи восстанавливаются** при чтении чата (`messages list`, `messages context`, правка в реальном времени). Более позднее удаление сохраняется.

## 0.17.0 — 30.09.2026

### Новое

- **`tg messages download <chat> --all`** сохраняет все фото, документы, видео и голосовые в `--output` от новых к старым. После `--timeout` или Ctrl-C продолжает, также подхватывая новое; позиция в `.download-<chat>.json`. Ожидание Telegram выполняется до пяти минут; `--pace` (1 секунда) разделяет страницы. К занятому имени добавляется идентификатор; без перезаписи (cli-messaging 0.53.0).

## 0.16.0 — 30.09.2026

### Исправления

- **Удаление в личном чате/обычной группе не помечает сообщения других чатов удалёнными** (cli-messaging 0.52.0). Telegram не указывает чат, а база раньше затрагивала все совпадающие номера, включая каналы/супергруппы. Старые ошибочные отметки остаются; текст сохранён.

## 0.15.0 — 30.09.2026

### Исправления

- **Локальная модель не пропускает тихие слова.** Раньше тихий фрагмент считался тишиной; исправлено для Parakeet и GigaAM. Ранее обработанные локально записи распознаются заново при `--transcribe`; расшифровки Telegram сохраняются (cli-messaging 0.51.0).

## 0.14.0 — 30.09.2026

### Новое

Изменения видимых другим сообщений проходят защиту, как `messages send`: профиль для чтения запрещает, `allow` должен разрешать, получатели и лимит проверяются, `tg sends list` записывает без текста.

- **`tg messages edit <chat> <id> [text]`** правит своё сообщение; повтор не меняет ничего. `tg_messages_edit` с `mcp --allow-send`.
- **`tg messages forward <chat> <id> --to <chat> [--silent]`** проверяет получателя; при неизвестном результате сначала проверьте чат. `tg_messages_forward`.
- **`tg messages pin|unpin <chat> <id>`**, тихо без `--notify`; в личном чате закрепление только у вас. `tg_messages_pin`, `tg_messages_unpin`.
- **`tg reactions add <chat> <id> <emoji>`**, **`tg reactions remove <chat> <id>`** без часового лимита. `tg_reactions_add`, `tg_reactions_remove`.
- **`tg chats read <chat> [--until id]`** отмечает прочитанным видимо собеседнику. `tg_chats_read` только с **`tg mcp --allow-mark-read`**; `--allow-send` не включает.
- **`tg messages delete <chat> <id…> --allow-dangerous [--for-everyone]`**: максимум 10, только у себя без `--for-everyone`, ничего без `--allow-dangerous`. Супергруппы/каналы требуют `--for-everyone`. **`tg mcp --allow-delete`** предоставляет `tg_messages_delete` только для своей копии.
- **`tg polls show|vote|close|create`**: опрос, голос по идентификатору или `--retract`, закрытие своего, новый публичный без `--anonymous`; `--send-id` безопасно повторяет. `tg_polls_show` читает; `tg_polls_vote`, `_close`, `_create` с `--allow-send`.

## 0.13.0 — 30.09.2026

### Изменения, влияющие на скрипты

- **Структура общей базы версии 6** (cli-messaging 0.49.0). Первый `tg` обновляет `messages.db`; старый `max` требует `npm install -g @wirecat/max-cli@latest`. Команды `tg` не меняются.

## 0.12.0 — 30.09.2026

### Новое

- **`tg chats inspect <link>`**, `tg_chats_inspect`: название, участники, описание, ваш статус и необходимость одобрения по ссылке без вступления.
- **`tg topics list <chat>`, `tg topics search <chat> <text>`**, `tg_topics_list`: темы форума постранично с идентификатором `threadId`.

## 0.11.0 — 30.09.2026

### Новое

- **Текст голосовых в `tg messages list` и `tg inbox`.** Расшифровка сохраняется для профиля и видна при следующих чтениях: `transcript` в `--json`, `🎤 …` в терминале. `--transcribe` распознаёт остальные через Telegram или локальную модель, максимум две минуты на список; остаток в `unheard`. Аналогично `transcribe` у `tg_messages_list`, `tg_inbox`.
- **`tg chats members list <chat>`**, `tg_chats_members`: участники постранично с ролью и последним появлением, до лимита Telegram 10 000.
- **`tg contacts lookup`**, `tg_contacts_lookup`: человек по номеру при разрешённой приватности; телефон через stdin или запрос, не аргумент.
- **`tg contacts sync`** загружает контакты и возвращает числа новых и изменённых.
- **`tg account sessions list`**, `tg_account_sessions`: устройства и приложения без IP; сессии не завершаются.

## 0.10.0 — 29.09.2026

### Новое

- **Локальное распознавание речи.** `tg models audio list`, `tg models audio download <id>` скачивают Parakeet v3 (25 языков, по умолчанию), GigaAM v3/CTC (русский) в общую `~/.cache/cli-common/models/audio`. `tg messages transcribe` сначала пробует Telegram, без Premium — локальную модель; `--local`, `--model <id>` пропускают Telegram. `transcribeWith` (`auto`, `messenger`, `local`) и `speechModel` задают исходные значения. Автозагрузки нет.
- **`tg messages send --photo <path>`, `--file <path>`**, `photo`, `file` у `tg_messages_send`: текст — подпись. Скрытые файлы, `~/.ssh`, каталоги tg и база запрещены без `--allow-any-file`; через MCP обхода нет. Журнал сохраняет тип/размер, не имя. Повтор с `--send-id` даёт одну копию (проверено на фото).

- **`tg update` перезапускает сервер новой версией**; ручной serve предлагается перезапустить. **`tg server status` сообщает устаревшую версию serve**, как max-cli.

- **`tg chats events <chat> [--since] [--event]`**, `tg_chats_events`: вступления, выходы, добавления, удаления с авторами, создание, переименование, закрепление из служебных сообщений; семь дней по умолчанию. Максимум десять страниц, `more` показывает остаток.

## 0.9.0 — 29.09.2026

### Новое

- **`tg session start` объясняет аккаунт, путь сессии, источник ключей и следующий шаг**; `--json` добавляет `session`, `appKeys` (`environment`, `keyring`, `file`, без ключей).
- **`tg chats list --search <text> --kind <kind> --unread`**, аналогично `tg_chats_list`: совместные фильтры последних 200 чатов, `--search` минимум 3 символа.
- **`tg messages list --after <id-or-time>`** читает вперёд после идентификатора или времени (`2h`, `1d`, ISO 8601); `after` в `tg_messages_list`.
- **`tg messages send --silent --no-preview --md`** — без уведомления, без карточки предпросмотра ссылки
  и с `**bold**`, `_italic_`, `~~struck~~` и `` `code` `` как форматированием Telegram. Инструмент отправки MCP
  принимает `silent`, `no_preview` и `markdown`. Журнал отправок по-прежнему хранит только длину.
- **`tg messages send --at <time>`** передаёт отложенную отправку Telegram: `2h`, `1d`, `2026-10-01T09:00` местного времени. `tg messages scheduled <chat>`, `tg_messages_scheduled` показывают очередь. Повтор запрещён, `--send-id` отклоняется.

### Изменения, влияющие на скрипты

- **`tg service …` → `tg server …`**: `start|stop|restart|status|logs|install|uninstall`, как max-cli. `tg serve status` заменён на `tg server status`. `tg server start` без службы работает в фоне. Служба из `tg service install` распознаётся (cli-messaging 0.40.0).

## 0.8.0 — 29.09.2026

### Новое

- **`tg review`**: все сообщения, включая ваши, в чатах с активностью после `--since` (три дня). Показывает начало следующей проверки. `--chat` — один чат, `--unanswered [hours]` — вопросы без ответа с учётом администраторов, `--all` — архив и отключённые уведомления. Аналогично `tg_review` и запросу `review`.

## 0.7.0 — 29.09.2026

### Новое

- **`tg messages transcribe <chat> <id>`**, `tg_messages_transcribe` распознают голосовые/видеозаметки через Telegram для Premium или пробной квоты. Ожидание до минуты, затем `"pending": true`. Отказ поясняет неверный тип, длину, отсутствие Premium.
- **`tg_messages_photo`** передаёт агенту фото до 512 КБ. Большие фото, файлы, видео и голосовые отклоняются с командой сохранения `tg messages download`.

## 0.6.0 — 29.09.2026

### Новое

- **`tg inbox` исключает архив и чаты без уведомлений**, кроме упоминаний и ответов вам. `--all`/`all` у `tg_inbox` включает их. Иначе они занимали лимит 20 чатов `inbox`; `quiet` считает исключённые.
- **Чат содержит `muted`, `archived`, `unreadMentions`** в `--json`. `archived` вынесен из `providerMetadata`; `muted` отсутствует при общих настройках аккаунта.

### Исправления

- **`tg messages send --silent`, `--no-preview`, `--markdown` отклоняют отправку** вместо игнорирования: cli-messaging 0.32 добавил их, но tg ещё не передаёт Telegram.

## 0.5.0 — 29.09.2026

### Новое

- **`tg service install|uninstall|start|stop|status|logs`** запускает `tg serve` службой systemd (Linux) или launchd (macOS) по профилям. `install` пишет файл; запуск только через `tg service start`.
- **`tg backfill <chat> --background`** — фоновое задание; `tg backfill list`, `status [job]`, `cancel <job>` управляют им. Ctrl-C/`cancel` заканчивают текущую страницу и сохраняют её.
- **`tg backfill <chat> --estimate`** оценивает оставшиеся сообщения, запросы, секунды по базе без Telegram.
- **`tg export <chat> --format markdown`** — читаемая переписка.
- **`tg messages search --regex '<pattern>'`** — регулярное выражение по базе.
- **`tg doctor report create`** — версии, пути, ошибочный запуск и отправки без текста; идентификаторы заменяются метками.
- **`tg session start --qr-file login.png`** сохраняет QR в PNG для агента и удаляет после входа; при сохранённом приложении терминал не нужен.
- **`tg messages download <chat> <id> [--output dir]`** сохраняет вложение в текущий или `--output` каталог и возвращает путь/размер. Имя не может выйти из каталога или скрыть файл; перезаписи нет. Сообщение каждый раз загружается заново, даже старое.

### Исправления

- **`tg messages list --jsonl`, `tg messages search --jsonl` выводят сообщение на строку**, как в `--help`, вместо страницы. Скрипты должны читать строки, а не `.items`.

## 0.4.0 — 29.09.2026

### Новое

- **`tg inbox`** — чужие непрочитанные; `--new` — после последней проверки, каждое один раз. MCP `tg_inbox`, запрос `catch-up`.
- **`tg skill show`** выводит инструкции агенту.
- **Готовые запросы MCP и ресурс чата:** `reply`, `find`, `tg://chat/{id}`.

## 0.3.0 — 28.09.2026

### Новое

- **`tg mcp`** предоставляет профиль по stdin/stdout, по умолчанию чтение. `--allow-send` добавляет отправку, `--confirm-send` показывает каждую владельцу. `tg mcp config` выводит настройки клиента.

### Изменения, влияющие на скрипты

- **Ошибки до запуска команды сохраняются**: неверное использование или конфигурация. Видны в `tg runs list`; `--no-record` отключает.

## 0.2.0 — 28.09.2026

### Новое

- **`tg update`** обновляет через установивший менеджер пакетов; `--check` проверяет.
- **Раз в день stderr сообщает о новой версии npm**, только в терминале после команды. `TG_NO_UPDATE_CHECK=1` отключает.

## 0.1.0 — 27.09.2026

Первый выпуск в npm.

### Новое

- **Вход** по QR или телефону (`tg session start`); приложение my.telegram.org через браузер или `--app auto`, ключи в системном хранилище.
- **Чтение:** `account show`, `chats list|show`, `contacts list|show`, `messages list|show|context`.
- **Отправка:** `messages send`, `messages reply` с получателями, профилем для чтения, журналом (`tg sends`), `--send-id` для безопасного повтора неизвестного результата.
- **Локальный архив:** каждое чтение сохраняется в общую базу; `--offline` читает, `messages search` ищет, `backfill` загружает, `watch`, `serve` обновляют, `sync status`, `export` показывают.
- **Записи запусков** (`tg runs`), `config`, `doctor`, `commands`, автодополнение (`complete`).
