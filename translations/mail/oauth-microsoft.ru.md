---
title: "Регистрация приложения Microsoft"
---

Outlook.com и Microsoft 365 принимают для IMAP и SMTP только OAuth, поэтому `mail` входит через приложение Microsoft.
Эта страница для того, кто регистрирует такое приложение: WireCat один раз для всех или вы для себя. Это занимает около
получаса и ничего не стоит.

Когда приложение создано, его **Application (client) ID** попадает либо в сам `mail` (приложение WireCat), либо один
раз в вашу конфигурацию, подставив вместо примера идентификатор своего приложения:

```sh
mail config set --defaults microsoft_client_id 11111111-2222-3333-4444-555555555555
```

Задать его можете только вы, в терминале: агенту через MCP в этом отказано, как и для настроек почтового сервера.
Идентификатор публичный; у приложения для компьютера нет секрета.

## Что понадобится

- Аккаунт Microsoft, который может создавать приложения в тенанте Microsoft Entra. Рабочий или учебный аккаунт обычно
  может. У личного аккаунта Outlook.com собственного тенанта нет: сначала зарегистрируйте бесплатный аккаунт Azure, он
  его создаст
  ([регистрация приложения](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app),
  предварительные требования).
- Личный почтовый ящик Outlook.com, чтобы в конце проверить приложение.

## Шаги

1. Откройте [центр администрирования Microsoft Entra](https://entra.microsoft.com) и войдите.
2. Откройте **App registrations** (введите это в строку поиска вверху) и выберите **New registration**.
3. Заполните форму:
   - **Name**: `WireCat mail` (пользователи видят его на странице согласия).
   - **Supported account types**: **Any Entra ID Tenant + Personal Microsoft accounts**. Без личных аккаунтов
     пользователи Outlook.com не смогут войти.
   - **Redirect URI**: оставьте пустым; его добавит шаг 6.
4. Выберите **Register**. Откроется страница приложения **Overview**. Скопируйте **Application (client) ID**: это
   идентификатор, который нужен `mail`.
5. Разрешите вход с компьютера: в разделе **Manage** выберите **Authentication**. В **Advanced settings** переключите
   **Allow public client flows** в **Yes** и выберите **Save**.
6. Добавьте URI перенаправления. В разделе **Manage** выберите **Authentication**, затем **Add a platform**, затем
   **Mobile and desktop applications**. В **Custom redirect URIs** введите `http://localhost/callback` без порта и
   выберите **Configure**. `mail` входит через `http://localhost:<port>/callback` с новым портом каждый раз; Microsoft
   игнорирует порт только для адресов `localhost` и требует совпадения пути
   ([правила URI перенаправления](https://learn.microsoft.com/en-us/entra/identity-platform/reply-url)). Править
   манифест не нужно. Не добавляйте адрес на платформу **Web**: такое приложение ожидает клиентский секрет, и вход
   публичного клиента через неё не удаётся. Если адрес уже указан в **Web**, удалите его оттуда.
7. Перечислите разрешения, чтобы страница согласия и администраторы видели их заранее. Вход всё равно запрашивает их по
   именам
   ([области доступа](https://learn.microsoft.com/en-us/exchange/client-developer/legacy-protocols/how-to-authenticate-an-imap-pop-smtp-application-by-using-oauth)),
   поэтому этот шаг рекомендуется, но не обязателен. Страница Microsoft не описывает шаги в портале для этих
   делегированных разрешений; обычно они находятся в **Manage**, **API permissions**, **Add a permission**,
   **Microsoft Graph**, **Delegated permissions** (если нет, то **APIs my organization uses**, **Office 365 Exchange
   Online**). Отметьте:
   - `IMAP.AccessAsUser.All`
   - `SMTP.Send`
   - `offline_access`

   Выберите **Add permissions**. Не предоставляйте для них согласие администратора: каждый человек разрешает их для
   своего почтового ящика при входе. Microsoft по умолчанию позволяет пользователям делать это для собственной почты
   ([согласие пользователя](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-user-consent)).
8. Проверьте перенаправление. Запишите идентификатор в конфигурацию, как описано выше, затем войдите дважды:

   ```sh
   mail config set --defaults microsoft_client_id <application-client-id>
   mail outlook-test session start --address <your-address>@outlook.com
   mail outlook-test session start
   ```

   Оба входа должны завершиться `signed_in: true`. Если страница Microsoft показывает ошибку с `AADSTS50011` (URI
   перенаправления не совпадает), убедитесь, что адрес в **Mobile and desktop applications** точно равен
   `http://localhost/callback`.
9. Для собственного приложения WireCat: отправьте Application (client) ID сопровождающим. Они впишут его в
   `microsoft.app.client_id` в `constants.json` из cli-core, и следующий релиз cli-core и обновление `mail` будут входить
   без какой-либо конфигурации.

## Позже, для начала не нужно

- **Общее приложение для всей организации.** Сделать общее приложение Microsoft публичным сложно, поэтому администратор,
  ограничивший согласие, может отклонить приложение WireCat. Администратор одобряет его или регистрирует собственное
  приложение организации по этим шагам и передаёт вам его идентификатор.
- **Отправка из Microsoft 365** требует включённой для ящика функции «Authenticated SMTP». Параметры безопасности по
  умолчанию и организации, созданные после января 2020 года, её отключают; администратор включает её для каждого ящика
  ([SMTP AUTH](https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission)).
  Чтение работает в любом случае.

## О чём просит вход

| Scope | Что `mail` с ним делает |
|---|---|
| `https://outlook.office.com/IMAP.AccessAsUser.All` | читает и изменяет почту по IMAP |
| `https://outlook.office.com/SMTP.Send` | отправляет почту от имени аккаунта по SMTP |
| `offline_access` | токен обновления, чтобы синхронизация по расписанию не требовала нового входа |

Токены хранятся в системной связке ключей компьютера, на котором выполнен вход, так же как и пароли приложений. `mail <profile> session
end` забывает их; Microsoft продолжает показывать приложение в списке, пока вы не удалите его на
<https://www.microsoft.com/consent> (личный аккаунт) или <https://myapps.microsoft.com> (рабочий или учебный).
