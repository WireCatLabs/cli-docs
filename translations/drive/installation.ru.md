---
title: "Установить и подключить"
---

Установите Drive там, где работает агент, войдите в выбранный аккаунт Google и проверьте
подключение перед импортом. **Сейчас Drive устанавливается из исходников**: опубликованного
npm-пакета и встроенного идентификатора приложения Google нет.

## Установить инструмент

Нужны Git, Node.js 22.16+ в ветке 22.x или Node.js 24+, а также pnpm. Попросите терминального агента:

```text prompt
Help me install WireCat Drive from https://github.com/WireCatLabs/drive-cli.
Follow its installation guide, check Git, Node.js and pnpm, and build the tool.
Check drive --help. Ask me which Google account and folder I want to connect.
I will enter consent in my browser; do not ask me to paste tokens into chat.
```

Или откройте терминал и выполните:

```sh
git clone https://github.com/WireCatLabs/drive-cli.git
cd drive-cli
pnpm install --frozen-lockfile
pnpm build
npm install -g .
drive --help
```

Сохраните рабочую копию: глобальная команда использует эту локальную установку. Для обновления
выполните в ней `git pull`, затем повторите установку зависимостей и сборку. В Windows используйте
`npm.cmd`, если PowerShell блокирует `npm.ps1`.

## Подготовить вход в Google

Для текущей установки нужен **JSON Desktop OAuth-клиента**. Он идентифицирует приложение в Google;
доступ к вашему аккаунту вы отдельно разрешаете в браузере.

1. Создайте или выберите проект в [Google Cloud Console](https://console.cloud.google.com/).
2. Включите **Google Drive API** и **Google Docs API**.
3. Откройте **Google Auth platform**. Настройте Branding и Audience. Для External-приложения
   в Testing добавьте свой аккаунт Google в список тестовых пользователей.
4. В Data Access добавьте `https://www.googleapis.com/auth/drive.readonly`.
5. В Clients создайте клиент **Desktop app** и скачайте JSON. Храните его вне репозиториев.

Инструкции Google по [учётным данным](https://developers.google.com/workspace/guides/create-credentials)
и [экрану согласия](https://developers.google.com/workspace/guides/configure-oauth-consent)
объясняют настройку. Передайте агенту путь к файлу, а не его содержимое.

## Подключить аккаунт

Замените путь на путь к скачанному файлу:

```sh
drive session start --client-file /path/to/desktop-client.json
drive session list --json
```

Выберите аккаунт и разрешите доступ в браузере. Результат возвращается инструменту на том же
компьютере. По умолчанию токены хранятся в системном хранилище ключей. Если оно недоступно,
явно добавьте `--credential-storage file` для хранения в приватном локальном файле.

Для другого аккаунта используйте `drive --profile work session start --client-file /path/to/desktop-client.json`.
Указывайте профиль и в следующих командах для этого аккаунта. Разрешения External Testing обычно
истекают через семь дней: повторите вход, когда Google этого потребует.

Проверьте аккаунт, добавив знакомую папку и просмотрев источники по руководству
[ежедневной работы](./usage.md). Один вход не импортирует весь Google Drive.
