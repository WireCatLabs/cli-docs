---
title: "Установка"
---

`tg` устанавливается как обычный npm-пакет. При установке ничего не компилируется: SQLite уже входит в среду выполнения, поэтому сборка нативных модулей не нужна. Фоновые процессы сами по себе не запускаются. Глобальная установка через npm может установить инструкции для агента и исправить пользовательский PATH в Windows. Во время установки инструмент не входит в аккаунт и не читает чаты.

## Требования

- **Node 22.16+ (22.x) или 24+** с npm. Команда также поддерживает **Bun**.
- Linux, macOS или Windows.
- **Собственное приложение Telegram** с [my.telegram.org](https://my.telegram.org/apps). `tg` запросит его
  при первом входе и может зарегистрировать за вас ([Вход и профили](./sessions.md#the-app-from-mytelegramorg)).

## Установка

```sh
npm install -g --allow-scripts=@leemour/tg-cli --foreground-scripts @leemour/tg-cli
# The global install puts the skill in .agents and .claude. Then: tg setup

pnpm add -g @leemour/tg-cli
bun add -g @leemour/tg-cli
```

Пакет называется **`@leemour/tg-cli`**, а установленная команда — **`tg`**.

Попробовать без установки:

```sh
npx @leemour/tg-cli --help
```

Проверить установку:

```sh
tg --version
tg --help
tg doctor        # where its files are, and whether a login exists; connects to nothing
```

## Первый запуск

Сразу после установки `tg --help` показывает настройку и инструкции для агента. `tg skill show` работает до входа: агенту следует прочитать инструкции перед подключением Telegram. `tg commands --json` выводит доступные команды и параметры. Подсказки доступны, даже если менеджер пакетов пропустил установочные скрипты.

Запустите в локальном терминале:

```sh
tg setup --agent codex
tg setup --help              # examples, login choices and Windows instructions
```

Выберите `codex`, `cursor`, `claude`, `gemini`, `all` или `none`. Без `--agent` команда спрашивает выбор в терминале; с `--json` и без терминала используется `none`. На регистрацию приложения, вход, проверку первых пяти чатов и установку skill отведите около пяти минут. Загрузка истории — отдельный шаг, который может занять больше времени: выберите чат и объём перед предложенной командой `store fetch`. Настройка не запускает фоновую службу.

`tg setup --app browser` открывает инструкции для ручной регистрации приложения; `--method phone` выбирает вход по телефону вместо QR. Код регистрации приложения на my.telegram.org и код входа в аккаунт относятся к разным шагам. Повторная настройка проверяет существующую сессию без нового входа. Если вход прервался или Telegram завершил сессию, сначала выполните `tg session start`, затем повторите настройку. См. [Вход и профили](./sessions.md).

Без глобальной установки используйте `npm exec --yes --package=@leemour/tg-cli -- tg setup --agent codex`. Настройка предложит последующие команды в таком же виде.

### Windows: одна команда установки

Выполните в PowerShell с установленным Node.js 22.16+ или 24+:

```powershell
& ([scriptblock]::Create((Invoke-RestMethod 'https://wirecat.dev/install.ps1'))) -Tool tg -Agent all
```

Установщик устанавливает npm-пакет, сохраняет существующие записи пользовательского PATH, один раз добавляет каталог npm-команд, обновляет PATH текущего PowerShell и устанавливает skill до входа. Затем проверяет запуск `tg` без полного пути. `-Agent codex|cursor|claude|gemini|all|none` выбирает каталог skill; значение `all` по умолчанию устанавливает его в оба поддерживаемых каталога. Повторная установка обновляет skill без дублирования PATH. Установщик выполняет эти шаги и при отключённых скриптах жизненного цикла npm.

Политика выполнения PowerShell не меняется. Установщик удаляет только созданную npm обёртку `tg.ps1` этого пакета и сохраняет `tg.cmd`, поэтому `tg` запускается и при ограничительной политике. Посторонний скрипт с таким именем остаётся на месте; установщик сообщает о конфликте.

Глобальная установка npm также исправляет постоянный PATH Windows и устанавливает оба skill, если разрешён скрипт postinstall:

```powershell
npm.cmd install -g --allow-scripts=@leemour/tg-cli --foreground-scripts @leemour/tg-cli
```

Новые версии npm могут пропускать скрипты установки, если они не разрешены. `--ignore-scripts`
также явно пропускает этот обработчик пакета. При настройке через агента используйте npm и до
входа проверьте доступность команды, установленного навыка и PATH терминала. Необязательный
установщик PowerShell обновляет текущий терминал и постоянный PATH; дочерний процесс npm не может
изменить окружение родительского процесса. Агент, запущенный до установки, должен сам обновить
PATH своего терминала из окружения пользователя и системы, не прося пользователя редактировать PATH.

Глобальный установочный скрипт работает только при глобальной установке npm, не для зависимостей проекта или npx. `TG_INSTALL_AGENT=codex|cursor|claude|gemini|all|none` выбирает skill; `none` явно отключает установку. Агент читает `tg skill show` и проверяет установленный skill перед входом в аккаунт. Отдельный исполняемый файл для Windows не нужен.

Первые команды чтения — в [руководстве по использованию](./usage.md#log-in).

## Из исходного кода

Для разработки или проверки ещё не выпущенной версии:

```sh
git clone https://github.com/leemour/tg-cli.git
cd tg-cli
pnpm install
pnpm build
```

При запуске из репозитория `bin/tg` хранит настройки, сессию и базу в `.tg/` внутри репозитория, отдельно от вашего обычного профиля. `node dist/bin/tg.js` использует стандартные каталоги, описанные ниже.

## Где хранятся файлы

Три каталога соответствуют правилам операционной системы; ещё два используются совместно с другими инструментами:

| Данные | Linux | macOS | Windows |
|---|---|---|---|
| настройки | `~/.config/tg-cli/` | `~/Library/Preferences/tg-cli/` | `%APPDATA%\tg-cli\Config\` |
| состояние | `~/.local/share/tg-cli/` | `~/Library/Application Support/tg-cli/` | `%LOCALAPPDATA%\tg-cli\Data\` |
| кеш | `~/.cache/tg-cli/` | `~/Library/Caches/tg-cli/` | `%LOCALAPPDATA%\tg-cli\Cache\` |
| локальная база | `~/.local/share/cli-messaging/messages.db` | в `~/Library/Application Support/cli-messaging/` | в `%LOCALAPPDATA%\cli-messaging\Data\` |
| модели распознавания речи | `~/.cache/cli-common/models/audio/` | в `~/Library/Caches/cli-common/` | в `%LOCALAPPDATA%\cli-common\Cache\` |

- **Настройки**: `config.json`, а также `credentials.json`, если на компьютере нет системного хранилища ключей.
- **Состояние**: сессия (`sessions/<profile>.session`), записи запусков (`runs/`), журнал отправок (`sends/`), разрешённые получатели (`profiles/`), сохранённая позиция `inbox --new` (`inbox/`), фоновые задания загрузки, журнал и файл блокировки `serve`.
- **Локальная база** используется совместно с другими CLI мессенджеров на той же библиотеке, например [max-cli](https://github.com/leemour/max-cli). Подробнее: [Локальная база](./archive.md).
- **Модели речи** скачиваются только по запросу (`tg models audio download`) и используются командой `messages transcribe --local`.

`tg doctor` показывает точные пути на текущем компьютере.

Каталоги можно перенести переменными: `TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR`, `MESSAGING_STORE` (путь к самому файлу базы) и `CLI_COMMON_CACHE_DIR` (модели).

> ⚠ **`TG_CONFIG_DIR`, `TG_STATE_DIR` и `TG_CACHE_DIR` также меняют запись в хранилище ключей.** Сессия, созданная с одной из этих переменных, не видна без неё, и наоборот: команда сообщает «нет сессии», хотя вы уже вошли. Задавайте их всегда или не задавайте вовсе. `tg config show` показывает, какие переменные установлены.

## Автодополнение в терминале

Tab дополняет команды, параметры и их значения. Для аргумента чата предлагаются чаты из локальной базы. Добавьте строку в файл запуска оболочки:

```sh
echo 'source <(tg complete zsh)' >> ~/.zshrc      # zsh
echo 'source <(tg complete bash)' >> ~/.bashrc    # bash
tg complete fish | source                         # fish, in config.fish
```

PowerShell: добавьте `tg complete powershell | Out-String | Invoke-Expression` в файл профиля.

Нажатие Tab **никогда не подключается к Telegram**. Пока локальной базы нет, дополняются только команды и параметры.

## Обновление

```sh
tg upgrade            # with the package manager that installed tg: npm, pnpm or bun
tg upgrade --check    # only say whether a newer version exists; installs nothing
```

`tg upgrade` также перезапускает найденный фоновый `serve`, чтобы сервер не продолжал работать со старым кодом. Обновление никогда не запускается самостоятельно.

### JSON-ответ обновления

`tg upgrade --check --json` сообщает текущую и доступную версии без установки. Общий ответ содержит `current`, `latest`, `newer`, `installer`, `command`, `updated` и `restarted` — профили, чьи серверы перезапущены после обновления. При проверке, неизменной версии или обновлении без перезапуска возвращается пустой массив; прежние поля сохраняются. Telegram сохраняет свою политику перезапуска управляемых серверов; сервер, требующий ручного перезапуска, указывается в stderr. Скриптам, проверяющим точный набор JSON-ключей, нужно допускать поле `restarted` во всех случаях.

Раз в день при работе в терминале `tg` сообщает в stderr о новой версии в npm. При `--json`, передаче в канал, `--quiet` и в CI это сообщение отключено. Отключить его вручную: `tg config set updateCheck false
--defaults` или `TG_NO_UPDATE_CHECK=1`.

Из исходников: `git pull && pnpm install && pnpm build`. Через npx: `npx @leemour/tg-cli@latest`.

## Удаление

Удаление команды не удаляет данные. Сначала выйдите из аккаунта, пока `tg` ещё установлен:

```sh
tg server uninstall                  # if you installed the background unit; stop it first
tg session end                       # logs out on Telegram's side and deletes the session file
npm uninstall -g @leemour/tg-cli
rm -rf ~/.config/tg-cli ~/.local/share/tg-cli ~/.cache/tg-cli
```

`tg session end` не удаляет идентификатор и хеш приложения из хранилища ключей. Они находятся в записи сервиса `tg-cli`; при необходимости удалите её системным инструментом управления ключами.

Локальная база общая для нескольких инструментов. Удаляйте `~/.local/share/cli-messaging/`, только если она больше никому не нужна: там хранятся сообщения, прочитанные всеми этими инструментами.

## Дальше

[Использование](./usage.md) — вход и первые команды.
