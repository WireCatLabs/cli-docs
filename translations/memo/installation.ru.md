---
title: "Установка"
---

Это руководство поможет установить Memo впервые, перенести его на другой компьютер, обновить или удалить. Вы проверите запуск и узнаете, где находятся его файлы. Добавление заметок и почты — следующий шаг, описанный в отдельных руководствах.

Термины на этой странице:

- **Пакет npm**: способ установки Memo. npm (либо pnpm или Bun) скачивает его и добавляет команду `memo` на компьютер. Пакет называется **`@wirecat/cli-memo`**, команда — **`memo`**.
- **Node.js**: программа, которая запускает Memo. Установите её первой.
- **PATH**: список папок, где терминал ищет команды по имени. `memo` запускается по имени, только если его папка есть в PATH.
- **Локальное хранилище**: файл базы данных на компьютере с текстами заметок, почты и сообщений. Memo использует его вместе с [tg](https://github.com/WireCatLabs/tg-cli) и [max](https://github.com/WireCatLabs/max-cli).
- **Навык**: краткие инструкции для ИИ-агента по работе с Memo.

Установка не выполняет вход, не запускает фоновую службу и не читает заметки или почту. Memo читает папку или ящик, только когда вы добавляете источник и запускаете `memo sync`. Синхронизация по таймеру включается отдельно: `memo auto start`.

## Что нужно для работы

- **Node.js 22.16+ (ветка 22.x) или 24+**, с npm. Если его нет, попросите агента помочь или скачайте с [nodejs.org](https://nodejs.org).
- Linux, macOS или Windows.

Дополнительные требования зависят от используемого источника:

| Источник | Что нужно |
|---|---|
| Заметки и документы | Ничего. Для PDF и Word (`.docx`) нужны два необязательных обработчика: [форматы файлов](./notes.md#files-memo-can-read) |
| Сообщения Telegram или MAX | [tg](https://github.com/WireCatLabs/tg-cli) или [max](https://github.com/WireCatLabs/max-cli). Они сохраняют чаты в локальном хранилище; Memo не входит в мессенджер |
| Поиск по смыслу | Небольшая модель на компьютере. tg или max скачивает её один раз: `tg models text download e5-small`. Без неё Memo ищет по словам |
| Почта | [Himalaya](https://github.com/pimalaya/himalaya), программа для чтения почтового ящика ([почта](./mail.md)) |
| Синхронизация по таймеру (`memo auto`) | Linux с systemd. На macOS и Windows запускайте `memo sync` сами или своим планировщиком ([обновление архива](./archive.md)) |

## Установка

**Проще всего попросить агента.**

```text prompt
Install Memo with npm install -g @wirecat/cli-memo.
Check Node.js and npm first and help me set them up if needed.
Then run memo --version and memo --help and tell me if it works.
```

**Или установите самостоятельно** одним из способов:

```sh
npm install -g @wirecat/cli-memo
pnpm add -g @wirecat/cli-memo
bun add -g @wirecat/cli-memo
```

Чтобы попробовать без установки (всё равно нужен Node.js):

```sh
npx @wirecat/cli-memo --help
pnpm dlx @wirecat/cli-memo --help
bunx @wirecat/cli-memo --help
```

Проверьте работу:

```sh
memo --version
memo --help            # the list of commands
memo doctor            # where Memo keeps its files and what needs attention; connects to nothing
memo commands --json   # every command and option, for agents and scripts
```

`memo doctor` проверяет файл настроек, хранилище, папки заметок, почтовые аккаунты и Himalaya, модель поиска, таймер и навык агента. Для каждой проблемы он показывает команду исправления и завершается с кодом 1, пока что-то требует внимания. `memo doctor --json` возвращает те же сведения для агента.

`memo --help` показывает команды, включая `notes`, `search`, `mail` и `sync`. Если установка завершилась, но команда `memo` не найдена, откройте новый терминал: уже открытый терминал может не увидеть её. Если это не помогло, папка команд менеджера пакетов отсутствует в PATH. `npm prefix -g` показывает её (на Linux и macOS команда находится в подпапке `bin`); добавьте путь в PATH или попросите агента.

## Первый запуск

Memo не требует входа или отдельной настройки. Добавьте папку заметок, прочитайте её и выполните поиск:

```sh
memo folders add ~/Documents/Notes   # your notes folder; Obsidian format by default
memo sync --only notes                    # reads the notes, their links and tags
memo search notes "budget"
```

Затем [добавьте другие папки](./notes.md#add-a-folder) или [подключите почту](./mail.md).

**Навык для агента.** Глобальная установка через npm также устанавливает навык Memo в папки Claude Code (`~/.claude/skills/cli-memo/`) и Codex или Gemini CLI (`~/.agents/skills/cli-memo/`). `MEMO_INSTALL_AGENT` выбирает назначение: `all` (по умолчанию), `claude`, `codex`, `cursor`, `gemini` или `none` для пропуска. `npx` и локальная установка не устанавливают навык; pnpm и Bun могут пропускать установочные скрипты. Тогда выполните `memo skill install --for all` сами (`--for claude` или `--for agents` для одного назначения). `memo skill show` показывает навык.

## Windows

Откройте PowerShell и используйте `npm.cmd`: PowerShell может блокировать скрипт `npm`.

```powershell
npm.cmd install -g @wirecat/cli-memo
memo --version
```

Затем откройте новый терминал: npm не может изменить PATH уже запущенного терминала. Установщик Node.js обычно добавляет папку команд npm в PATH; `npm.cmd prefix -g` показывает, какая это папка.

## Из исходников

Это нужно для изменения кода Memo или использования ещё не выпущенной версии.

```sh
git clone git@github.com:WireCatLabs/cli-memo.git
cd cli-memo
pnpm install
pnpm build
```

Затем добавьте команду в PATH:

```sh
pnpm link --global   # now plain `memo` works
```

или запускайте по пути без создания ссылки:

```sh
node dist/bin/memo.js --help
```

## Где лежат файлы

| Данные | Linux и macOS | Windows |
|---|---|---|
| Настройки | `~/.config/cli-memo/` | `%APPDATA%\cli-memo\Config\` |
| Состояние | `~/.local/share/cli-memo/` | `%LOCALAPPDATA%\cli-memo\Data\` |
| Общее хранилище с tg и max | `~/.local/share/WireCat/wirecat.db` | `%LOCALAPPDATA%\WireCat\Data\wirecat.db` |
| Модели поиска, скачанные tg или max | `~/.local/share/WireCat/models/` | `%LOCALAPPDATA%\WireCat\Data\models\` |
| Таймер после `memo auto start` | `~/.config/systemd/user/memo-import.timer` и `.service` | — |

- **Настройки**: `config.json` ([справочник](./configuration.md)): папки, почтовые аккаунты, правила почты и таймер.
- **Состояние**: что импортировано из каждой папки (`folders/`), блокировка одновременных синхронизаций (`import.lock`) и результат последнего запуска таймера (`auto/`).
- **Локальное хранилище** содержит заметки, почту, сообщения, теги, задачи и память. Файлы заметок и почтовый ящик остаются на своих местах; хранилище содержит копию их текста.

`~` означает домашнюю папку. Переменные среды меняют расположение: `MEMO_CONFIG_DIR` — настройки, `MEMO_STATE_DIR` — состояние, `MESSAGING_STORE` — сам файл хранилища, `WIRECAT_STATE_DIR` — папка WireCat с хранилищем и моделями.

> ⚠ **Задавайте эти переменные везде или нигде.** Без них команда читает другие настройки и другое хранилище и сообщает об отсутствии папок или почты. Таймер сохраняет переменные при `memo auto start`; повторите команду после их изменения. tg и max читают то же хранилище только с одинаковыми `MESSAGING_STORE` или `WIRECAT_STATE_DIR`. Эти переменные предназначены для тестов и временных профилей.

## Обновление

```sh
memo upgrade --check           # only say whether a newer version exists; installs nothing
memo upgrade                   # update with the package manager that installed Memo: npm, pnpm or Bun
memo skill install --for all   # a global npm install does this for you; pnpm and Bun may not
```

Раз в день Memo запрашивает npm о новой версии и, если она есть, выводит строку в stderr после команды. Уведомление показывается только человеку в терминале: не с `--json`, не в канале и не при запуске таймером. Отключите его через `"update_check": false` в настройках или `MEMO_NO_UPDATE_CHECK=1`. Memo не обновляет себя самостоятельно.

- **Таймер** использует обновлённый Memo со следующего запуска, без перезапуска. Если сменить версию Node.js (например, через nvm) и установить Memo там, следующая команда `memo` обновит путь таймера. Удаление старого Node.js его не сломает. Запуск из исходников или через `npx` не меняет таймер.
- **`memo mcp`** использует старую версию, пока агент его не перезапустит. Перезапустите агента или его сервер MCP.

Из исходников: `git pull && pnpm install && pnpm build`.

## Удаление

Удаление убирает команду Memo, сохраняя данные. Действуйте в таком порядке:

```sh
memo auto stop                       # if you turned on the timer: removes it while memo still exists
npm uninstall -g @wirecat/cli-memo   # or pnpm remove -g, or bun remove -g
rm -rf ~/.claude/skills/cli-memo ~/.agents/skills/cli-memo   # the agent skill
rm -rf ~/.config/cli-memo ~/.local/share/cli-memo            # Memo's settings and state
```

Локальное хранилище остаётся. tg и max тоже используют его; там находятся заметки, почта, теги и память. Удаляйте `~/.local/share/WireCat/`, только если другие инструменты её не используют: она содержит всё, что каждый из них сохранил.

## Разработка

Для работы над Memo соберите его [из исходников](#from-sources), затем запустите проверки:

```sh
pnpm lint && pnpm typecheck && pnpm test
```

## Дальше

[Добавьте заметки](./notes.md#add-a-folder), затем [подключите почту](./mail.md).
