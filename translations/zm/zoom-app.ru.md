---
title: "Ваше приложение Zoom"
---

`zm` читает ваши встречи через официальный API от вашего имени. Zoom разрешает это только
приложению, зарегистрированному в Zoom App Marketplace: как приложение Telegram для `tg`,
это **ваше собственное приложение Zoom**. Его создают один раз.

Манифест запрашивает чтение встреч, участников, расшифровок и сводок ИИ. Для архива и управления
нужны дополнительные разрешения ниже. Добавляйте нужные возможности. Секрета клиента нет:
вы входите в аккаунт через браузер.

## Создать из манифеста

1. Войдите на [marketplace.zoom.us](https://marketplace.zoom.us/).
2. Откройте **Build App** внизу левой панели ([marketplace.zoom.us/user/build](https://marketplace.zoom.us/user/build)) и нажмите **+**.
3. Выберите **General app**, создание **from an app manifest**, и загрузите [`zoom-app.json`](https://github.com/WireCatLabs/zoom-cli/blob/f7a1dd2cb730996c4e4b239e9ff9010d6dbbc783/docs/zoom-app.json).
4. Если спрашивают управление, выберите **User-managed**.
5. На вкладке **Development**, в **Basic Information**, проверьте `https://wirecat.dev/zoom-callback`
   в **OAuth Redirect URL** и **OAuth Allow Lists**; **Scopes** должны содержать пять разрешений ниже.
   Пустое поле заполните вручную и нажмите **Continue**: импорт может оставить его пустым,
   и Zoom покажет «Invalid redirect».
6. В **Basic Information → App Credentials** включите **Use Public Client OAuth**. Импорт может не
   включить его, несмотря на манифест, и вход завершится «Invalid redirect».
7. Скопируйте **Public Client ID**. Секрет клиента не нужен.

Передайте ID инструменту:

```sh
zm config set zoom.clientId <public-client-id>
zm login
```

`zm login` открывает страницу согласия. После разрешения браузер переходит на
[wirecat.dev/zoom-callback](https://wirecat.dev/zoom-callback): статическая страница передаёт ответ
в `zm` на вашем компьютере. Zoom больше не принимает там `127.0.0.1`. Ответ работает только с ключом,
оставшимся на компьютере (PKCE). Если передача не удалась, страница показывает ответ для вставки.
Токен сохраняется в системном хранилище секретов.

## Разрешения манифеста

| Разрешение | Для чего |
|---|---|
| `meeting:read:list_meetings` | найти прежние встречи |
| `meeting:read:list_past_instances` | различать встречи повторяющейся серии |
| `cloud_recording:read:meeting_transcript` | читать расшифровку, в том числе без записи встречи |
| `meeting:read:list_past_participants` | читать участников и сеансы входа и выхода |
| `meeting:read:summary` | сводки Zoom; необязательно, нужен Pro или выше |

Перед загрузкой замените `developer_information` своим именем и адресом.

## Разрешить архив или управление

Добавьте нужные user-managed разрешения в **Scopes**, затем снова выполните `zm login`.
Существующие токены не получают новые разрешения автоматически.

| Разрешение | Возможность |
|---|---|
| `cloud_recording:read:list_user_recordings` | найти облачные записи встреч |
| `cloud_recording:read:list_recording_files` | посмотреть и скачать файлы записей |
| `user:read:user` | явно проверить вход через `session status --check` |
| `meeting:read:meeting` | посмотреть удалённую встречу |
| `meeting:read:invitation` | получить приглашение |
| `meeting:write:meeting` | создать встречу |
| `meeting:update:meeting` | изменить встречу |
| `meeting:delete:meeting` | отменить встречу |

Список встреч использует `meeting:read:list_meetings`. Создание, изменение и отмена сначала показывают
план; `--yes` применяет его. Для архива разрешения записи встреч не нужны. См.
[справочник разрешений](https://developers.zoom.us/docs/integrations/oauth-scopes-granular/) и
[Meeting API](https://developers.zoom.us/docs/api/meetings/).

## Перед первым `zm pull`

- В веб-настройках включите **Allow hosts to retain transcripts**, иначе API не получит сохранённую расшифровку.
- Zoom возвращает расшифровки встреч, где **вы организатор**. Для встреч, где вы участвовали,
  скачайте файлы в Zoom; `zm import <folder>` читает их.

## Корпоративный аккаунт

Администратору может потребоваться одобрить приложение. Пока это невозможно, API недоступен,
но `zm import` работает со скачанными расшифровками.
