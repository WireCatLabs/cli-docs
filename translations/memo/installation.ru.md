---
title: "Установка"
---

Эта страница поможет установить Memo, проверить, что он работает, и узнать, где он хранит свои файлы.
В конце `memo --help` покажет список команд Memo, и вы сможете импортировать первую папку заметок.
Вам нужен Node.js; всё остальное на этой странице нужно только для тех источников, которые это используют.

## Что нужно для работы

- **Node.js 22.16 или новее** (версия 22.16+ или 24+) вместе с npm. Node.js запускает Memo, а npm
  устанавливает его. Если у вас их нет, попросите агента помочь их установить или
  скачайте их с [nodejs.org](https://nodejs.org).
- **Заметки и документы:** больше ничего не нужно. Для файлов PDF и Word (`.docx`) нужны две
  дополнительные программы чтения, см. [файлы, которые читает Memo](./notes.md#files-memo-can-read).
- **Сообщения:** [tg](https://github.com/WireCatLabs/tg-cli) для Telegram или
  [max](https://github.com/WireCatLabs/max-cli) для MAX. Они сохраняют ваши чаты в локальное хранилище,
  и Memo читает их оттуда. Сам Memo не входит в мессенджеры.
- **Поиск по смыслу:** небольшая модель поиска, которая работает на вашем компьютере. tg или max
  скачивает её один раз: `tg models text download e5-small` или `max models text download e5-small`.
  Без неё Memo ищет по словам.
- **Почта:** [Himalaya](https://github.com/pimalaya/himalaya) — почтовая программа, через которую Memo
  читает ваш почтовый ящик ([почта](./mail.md)).
- **Импорт по таймеру** (`memo auto`): Linux. В macOS и Windows запускайте `memo import` сами или через
  свой планировщик ([обновление данных Memo](./archive.md)).

## Установка

**Проще всего попросить агента.**

```text prompt
Install Memo with npm install -g @wirecat/cli-memo.
Check Node.js and npm first and help me set them up if needed.
Then run memo --help and tell me if it works.
```

**Или установите сами.** Откройте терминал и выполните:

```sh
npm install -g @wirecat/cli-memo
memo --help
```

В Windows откройте PowerShell и вводите `npm.cmd` вместо `npm`.

`memo --help` должна показать команды, например `notes`, `search` и `tags`. Если терминал пишет, что
команда не найдена, закройте его, откройте новый и попробуйте снова.

Входить в Memo не нужно. Дальше [добавьте папку заметок](./notes.md#add-a-folder) или
[подключите почтовый аккаунт](./mail.md).

## Где лежат файлы

| Что | Где |
|---|---|
| Настройки | `~/.config/cli-memo/config.json` ([настройки](./configuration.md)) |
| Ваши сообщения, почта, заметки, теги, задачи и записи памяти | Локальное хранилище `wirecat.db`, общее с tg и max |
| Что этот компьютер импортировал последним для каждой папки | Папка состояния Memo |

`~` означает вашу домашнюю папку. Файлы заметок и почтовый ящик остаются на месте; в локальном
хранилище лежит копия их текста.

## Обновление и удаление

```sh
npm install -g @wirecat/cli-memo     # update to the latest version
npm uninstall -g @wirecat/cli-memo   # remove the memo command
```

Если вы включили таймер, выполните `memo auto off` перед удалением Memo. После удаления Memo локальное
хранилище и настройки остаются, потому что tg и max используют то же хранилище.

## Разработка

Чтобы работать над самим Memo, клонируйте [репозиторий](https://github.com/WireCatLabs/cli-memo) и
выполните:

```sh
pnpm install
pnpm lint && pnpm typecheck && pnpm test
```
