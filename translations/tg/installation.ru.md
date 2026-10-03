---
title: "Установка"
---

`tg` устанавливается как обычный npm-пакет. При установке ничего не компилируется: SQLite уже входит в среду выполнения, поэтому сборка нативных модулей не нужна. Фоновые процессы сами по себе тоже не запускаются.

## Требования

- **Node 22.16 или новее.** В CI используется Node 24; минимальная версия 22.16 указана в `package.json`. CI также проверяет собранную команду в Bun.
- Linux, macOS или Windows.
- **Ваше приложение Telegram** с [my.telegram.org](https://my.telegram.org/apps). `tg` запросит его при первом входе и может зарегистрировать его за вас ([Вход и сессии](./sessions.md#the-app-from-mytelegramorg)).

## Установка

```sh
npm install -g @leemour/tg-cli
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

Затем войдите в аккаунт: [Использование](./usage.md#log-in).

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
