---
title: "Установить и подключить"
---

Установите инструмент Drive, подключите аккаунт Google и импортируйте небольшую папку для
проверки поиска. **Профиль** — выбранное вами имя аккаунта, например `personal` или `work`;
каждая команда для аккаунта должна его указывать. Google открывает браузер для согласия,
поэтому токены доступа не нужно вставлять в терминал или чат агента.

<a id="install-the-tool"></a>

## Установить самостоятельно или с агентом

Если установкой занимается агент, попросите:

```text prompt
Use drive CLI. Install @wirecat/drive-cli from npm and check drive --help.
Ask me for the profile name and Google folder. Follow the Google connection guide; I will approve sign-in in my browser.
Do not request tokens or credential contents in chat.
```

В [официальном руководстве репозитория Drive](https://github.com/WireCatLabs/drive-cli/blob/main/docs/installation.md)
описаны установка, обновление и подключение Google.

Нужен [Node.js](https://nodejs.org/en/download) 22.16+ в ветке 22.x или Node.js 24+.
Откройте терминал на компьютере, где работает агент:

```sh
npm install -g @wirecat/drive-cli
drive --version
drive --help
```

Пакет содержит скомпилированный JavaScript. Пользователям не нужны Git, pnpm или сборка исходников.
`drive --help` должен показать команды. Установка не входит в аккаунт и не импортирует документы.
В Windows используйте `npm.cmd`, если PowerShell блокирует `npm.ps1`. Если после установки команда
`drive` не находится, заново откройте терминал или агента.

Если вы уже используете pnpm или Bun, выберите альтернативу:

```sh
pnpm add -g @wirecat/drive-cli
bun add -g @wirecat/drive-cli
```

Запустить без глобальной установки:

```sh
npx @wirecat/drive-cli --help
```

Для обновления повторите `npm install -g @wirecat/drive-cli`. Чтобы удалить команду:

```sh
npm uninstall -g @wirecat/drive-cli
```

Удаление сохраняет локальные настройки, учётные данные и индексированные документы. Чтобы сначала
забыть вход Google, выполните `drive personal session end` для каждого подключённого профиля.

## Выбрать способ подключения

**Общее приложение Google от WireCat** позволяет подтверждать доступ к своему аккаунту
в браузере; Google Cloud настраивает только владелец приложения. Идентичность Desktop-клиента
WireCat включена в CLI. Пропустите Google Cloud и переходите к [подключению аккаунта](#connect-your-account).
Доступ к общему приложению может зависеть от проверки Google и правил вашей организации.

Предпочитаете своё приложение? Создайте Desktop-клиент ниже и укажите JSON через `--client-file`.
JSON определяет приложение, но сам по себе не даёт доступа к аккаунту. Доступ предоставляется
отдельно вашим согласием в браузере.

## Подготовить вход Google

Этот раздел нужен владельцу приложения или тем, кто создаёт собственный OAuth-клиент.
Пользователи уже настроенного общего приложения не повторяют эти шаги. Ключ Google API
или сервисного аккаунта не заменяет Desktop OAuth-клиент для такого входа.

### 1. Выбрать проект и включить API

Откройте [Google Cloud Console](https://console.cloud.google.com/). Через выбор проекта в верхней
панели откройте существующий проект либо нажмите **New Project**, задайте имя и создайте его.
На всех следующих экранах оставляйте выбранным этот же проект.

Если API уже включены, переходите к Branding. Иначе откройте **☰ → APIs & Services → Library**.
Найдите каждый API, откройте страницу и нажмите **Enable**. Проверьте **Enabled APIs & services**:

| API | Что даёт | Когда нужен |
| --- | --- | --- |
| [Google Drive API](https://console.cloud.google.com/apis/library/drive.googleapis.com) | Папки, файлы, экспорт, комментарии, версии и разрешения | Всегда |
| [Google Docs API](https://console.cloud.google.com/apis/library/docs.googleapis.com) | Все вкладки документов, создание и редактирование Google Docs | Всегда |
| [Google Drive Activity API](https://console.cloud.google.com/apis/library/driveactivity.googleapis.com) | События и участники изменений | Необязательный `--activity`; включите для всех функций общего приложения |

Включение API делает его доступным проекту, но не предоставляет доступ пользователю.
Текущий коннектор не использует API Sheets, Slides, People и Gmail.

### 2. Настроить экран согласия: Branding

Откройте **☰ → Google Auth platform → Branding** либо
[прямую ссылку на Branding](https://console.cloud.google.com/auth/branding). Здесь определяется,
что люди увидят, когда Google предложит разрешить доступ вашему приложению.

Если платформа не настроена, нажмите **Get Started**. Заполните экраны: имя приложения
(например, WireCat Drive), адрес поддержки, аудитория **External** для аккаунтов вне вашей
организации Workspace и контактный адрес. Завершите шаг с политикой Google и создайте
конфигурацию. Если она уже есть, измените поля в Branding. Для приложения WireCat используйте `https://wirecat.dev/en/docs/drive` как главную страницу,
`https://wirecat.dev/en/privacy` как политику конфиденциальности и `https://wirecat.dev/en/terms`
как условия использования. В Authorized domains добавьте `wirecat.dev` без схемы и пути,
затем подтвердите владение в Google Search Console через владельца или редактора Cloud проекта.
Эти сведения настраивает владелец приложения, а не каждый пользователь.

[Официальная инструкция экрана согласия Google](https://developers.google.com/workspace/guides/configure-oauth-consent)
объясняет Branding, Audience и Data Access.

### 3. Разрешить тестовый вход своему аккаунту

Откройте **Google Auth platform → Audience**
([прямая ссылка](https://console.cloud.google.com/auth/audience)). Для External-приложения в
Testing нажмите **Test users → Add users**, добавьте подключаемый аккаунт и сохраните.
Для первой проверки достаточно Testing. Общедоступная публикация — отдельная задача владельца.
Тестовые разрешения обычно истекают через семь дней; подключитесь снова по запросу Google.

### 4. Объявить разрешения

Откройте **Google Auth platform → Data Access**
([прямая ссылка](https://console.cloud.google.com/auth/scopes)). Нажмите **Add or Remove Scopes**,
выберите нужные разрешения ниже и обновите/сохраните список. Если разрешения нет в таблице,
используйте поле ручного ввода scope.

| Разрешение | Для чего в CLI |
| --- | --- |
| `https://www.googleapis.com/auth/drive.readonly` | Импорт папок и чтение по умолчанию |
| `https://www.googleapis.com/auth/drive` | Создание/редактирование/управление в Google с `--write` |
| `https://www.googleapis.com/auth/drive.activity.readonly` | Необязательная история с `--activity` |
| `https://www.googleapis.com/auth/drive.apps.readonly` | Метаданные установленных приложений Drive с `--apps` |

Для личной проверки чтения достаточно первого scope. Общее приложение объявляет и те
необязательные разрешения, которые будет предлагать; CLI запрашивает их только с нужными
флагами. Текущие методы принимают разрешения Drive, отдельный Docs scope не нужен.
Выбор папок ограничивает локальный импорт; разрешение Google на чтение охватывает Drive аккаунта.
См. [разрешения Drive](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
и [разрешения Docs](https://developers.google.com/workspace/docs/api/auth).

### 5. Создать Desktop-клиент и скачать JSON

Откройте **Google Auth platform → Clients**
([прямая ссылка](https://console.cloud.google.com/auth/clients)). Нажмите **Create Client**,
выберите **Application type → Desktop app**, задайте понятное имя и нажмите **Create**.

В окне созданного клиента нажмите **Download JSON**. Если закрыли его, вернитесь в Clients,
откройте Desktop-клиент и используйте кнопку скачивания JSON. Имя файла обычно начинается с
`client_secret_`. Сохраните его вне репозитория и запишите полный путь, например
`/home/YOUR_USER/Downloads/client_secret_…json`. Можно переименовать его в
`wirecat-drive-desktop.json`, чтобы путь был удобнее.

Desktop-клиент использует временный localhost callback CLI. Не создавайте Web application
и не добавляйте веб-адрес перенаправления для этого входа. См.
[официальную инструкцию Desktop OAuth](https://developers.google.com/workspace/guides/create-credentials#desktop-app).
Скачанный JSON содержит раздел приложения `installed`. Это не токен доступа.
Передавайте агенту только путь, а не содержимое.

## Подключить аккаунт

Публикация приложения Google не подключает этот компьютер к вашему аккаунту. Каждый
пользователь открывает экран согласия и подтверждает доступ к своей учётной записи. Desktop
клиент WireCat определяет общее приложение; собственный клиент определяет ваше приложение.
Оба используют одну команду и хранят токены в локальном хранилище учётных данных пользователя.

Выберите имя профиля и войдите через общее приложение WireCat:

```sh
drive personal session start
drive personal session list --json
```

Для собственного приложения замените путь к файлу и выполните:

```sh
drive personal session start --client-file /absolute/path/to/desktop-client.json
```

В браузере выберите нужный аккаунт и проверьте запрашиваемые разрешения. После согласия страница
callback сообщит о полученном ответе, а терминал — об успешном входе профиля `personal`.
Список сессий показывает все настроенные профили без токенов. Если Google блокирует вход,
потому что аккаунт не является тестовым, добавьте именно его в Audience и повторите.
Администратор Workspace тоже может ограничивать доступ к приложению.

Токены хранятся в системном хранилище ключей. Если оно недоступно, явно добавьте
`--credential-storage file` для приватного хранения в файле. `--no-browser` выводит ссылку,
которую можно открыть на том же компьютере. Для другого аккаунта используйте
`drive work session start ...`. Профиль из окружения или сохранённых настроек не выбирается автоматически.

## Проверить первый результат

Выберите небольшую папку с Google Doc или Markdown/TXT. Скопируйте URL папки из браузера
и замените `FOLDER_ID`:

```sh
drive personal folders add https://drive.google.com/drive/folders/FOLDER_ID
drive personal sync --json
drive personal status --json
drive personal documents list --json
drive personal search 'a word from your document' --exact --json
```

Убедитесь, что список содержит ожидаемые документы, незавершённых операций нет, а поиск
возвращает фрагмент и ссылку на оригинал. Повторите sync, если осталось задание.
Сам вход не импортирует весь Drive. Продолжите с [форматами и хранением](./usage.md) либо
[сценариями](./recipes.md).
