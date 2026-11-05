---
title: "Подключение Outlook.com или Microsoft 365"
---

Эта страница поможет подключить к `mail` почтовый ящик Outlook.com, Hotmail или Microsoft 365. Вы входите в Microsoft в
браузере и разрешаете доступ. Пароль в `mail` вводить не нужно, а приложение Microsoft от WireCat уже встроено, так что
регистрировать ничего не придётся. В итоге `mail` читает вашу почту в локальное хранилище и может отправлять письма с
этого адреса.

## Перед началом

1. Установите `mail` ([установка](./installation.md)).
2. Только для Outlook.com: включите IMAP. У Microsoft он по умолчанию выключен
   ([страница Microsoft](https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-for-outlook-com-d088b986-291d-42b8-9564-9c414e2aa040)).
   Если IMAP выключен, вход в браузере проходит, но почтовый сервер отклоняет токен, так что пропускать этот шаг не стоит:
   1. Откройте [outlook.live.com](https://outlook.live.com) и войдите.
   2. Выберите Settings (шестерёнка), затем "Mail", затем "Forwarding and IMAP".
   3. Включите "Let devices and apps use IMAP" и нажмите "Save".
3. Рабочий или учебный аккаунт Microsoft 365: в ящике ничего включать не нужно. Что может понадобиться разрешить
   администратору, описано в разделе [рабочий или учебный аккаунт](#work-or-school-account-microsoft-365).

## Вход

Выберите имя профиля (здесь `outlook`) и укажите свой адрес:

```sh
mail outlook session start --address you@outlook.com
```

`mail` откроет в браузере страницу входа Microsoft. Войдите и разрешите доступ. Вкладка покажет "Sign-in received; you
can close this tab". Вернитесь в терминал: `mail` ответит профилем, `signed_in`, способом входа (`auth` — `oauth`,
`provider` — `microsoft`, `client` — `wirecat`), выданными правами (`IMAP.AccessAsUser.All` и `SMTP.Send`) и найденными
папками.

На компьютере без браузера, например по SSH, добавьте `--no-browser`. Тогда `mail` напечатает ссылку; откройте её на
любом компьютере, войдите, и терминал завершит вход так же.

## Чтение и отправка

```sh
mail outlook sync                                  # INBOX and Sent by default
mail outlook schedule command mail-outlook --every 5m -- sync   # sync every 5 minutes
mail outlook search messages invoice               # search what sync stored
```

Отправка использует тот же вход, через SMTP-сервер Microsoft с OAuth. `mail` кладёт копию в Sent. Команды описаны в
разделе [работа с инструментом](./usage.md) и в [справочнике команд](./commands.md).

## Рабочий или учебный аккаунт (Microsoft 365)

Используйте ту же команду с рабочим адресом. Личных аккаунтов Outlook.com и Hotmail этот раздел не касается.

### Что вы видите и почему

Рабочий или учебный аккаунт принадлежит организации ("тенанту"), и тенант может не
позволять обычным пользователям одобрять многотенантное приложение, такое как приложение WireCat. Вместо этого вход останавливается на странице "Need admin approval" или с ошибкой `AADSTS90094`
(администратор должен дать согласие). Эту страницу показывает браузер, поэтому `mail` сам не печатает код ошибки
Microsoft. Дело не в вашем аккаунте и не в `mail`. Администратору нужно один раз выполнить действие, после чего все в
организации входят как обычно. Правило описано у Microsoft на странице
[Configure risk-based step-up consent](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-risk-based-step-up-consent).

Выберите один из двух вариантов ниже и отправьте его администратору.

### Вариант A: администратор разрешает приложение WireCat для организации

Администратор открывает эту ссылку в браузере и входит администраторским аккаунтом. Вместо `{tenant}` подставьте домен
организации (например, `contoso.com`) или идентификатор тенанта:

```text
https://login.microsoftonline.com/{tenant}/v2.0/adminconsent?client_id=f7f05d3a-b948-4d50-b3ce-59c816ce69e9&scope=offline_access%20https://outlook.office.com/IMAP.AccessAsUser.All%20https://outlook.office.com/SMTP.Send&redirect_uri=http://localhost/callback
```

Формат взят из [протокола согласия администратора](https://learn.microsoft.com/en-us/entra/identity-platform/v2-admin-consent)
Microsoft: конечная точка `/v2.0/adminconsent` с `client_id`, `scope` (через пробел, в ссылке `%20`) и `redirect_uri`,
зарегистрированным для приложения. Аккаунту нужна роль, которая может давать согласие от имени организации, например
Cloud Application Administrator или Privileged Role Administrator ([роли](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/grant-admin-consent#prerequisites)).

Администратор увидит страницу согласия Microsoft для WireCat. На ней перечислены три права. Администратор нажимает "Accept". Затем Microsoft перенаправляет браузер на `http://localhost/callback`;
вкладка может показать ошибку соединения, потому что там ничего не слушает, и это нормально. Согласие уже сохранено.

Чтобы отменить его, администратор открывает [Microsoft Entra admin center](https://entra.microsoft.com), затем "Entra
ID", "Enterprise apps", "All applications", WireCat, "Permissions", вкладку "Admin consent" и нажимает "Revoke
permission" у каждой записи. Чтобы убрать приложение из организации совсем, администратор удаляет WireCat из
"Enterprise apps" ([шаги](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/manage-application-permissions)).

### Вариант B: организация регистрирует собственное приложение

Если организация не разрешает сторонние приложения, администратор регистрирует частное приложение, которому внутри
своего тенанта проверка издателя не нужна:

1. В Microsoft Entra admin center зарегистрируйте приложение. Платформа: "Mobile and desktop applications". Redirect
   URI: `http://localhost/callback`. Переключите "Allow public client flows" в Yes.
2. Скопируйте Application (client) ID.
3. Каждый пользователь задаёт его один раз, в терминале:

   ```sh
   mail config set --defaults microsoft_client_id <application-client-id>
   ```

Полные шаги со списком прав есть в разделе [регистрация приложения Microsoft](./oauth-microsoft.md).

### Отправка всё равно может не работать

В организации для вашего ящика может быть выключена "Authenticated SMTP". В настройках безопасности по умолчанию и в
организациях, созданных после января 2020 года, она выключена, пока администратор её не включит. Чтение работает в любом
случае; не работает только отправка.

## Если не получается

| Что вы видите | Что делать |
|---|---|
| "refused the OAuth token from this sign-in" | IMAP выключен. Включите его, как описано в разделе [Перед началом](#before-you-start), и снова выполните `session start`. В Microsoft 365 спросите администратора, включён ли IMAP для ящика. |
| `AADSTS90094` или "Need admin approval" | См. [рабочий или учебный аккаунт](#work-or-school-account-microsoft-365). |
| "Microsoft refused the OAuth login for sending", а чтение работает | Для ящика выключена "Authenticated SMTP". Её включает администратор. |
| Браузер не открывается | Выполните команду снова с `--no-browser` и откройте напечатанную ссылку. |

Другие ошибки: [решение проблем](./troubleshooting.md).

## Дополнительно: собственное приложение Microsoft

Нужно только если организация требует своё приложение. Зарегистрируйте его ([шаги](./oauth-microsoft.md)): платформа
"Mobile and desktop applications", перенаправление `http://localhost/callback` без порта, никогда не "Web". Затем один раз
задайте его идентификатор в терминале, подставив вместо примера идентификатор своего приложения:

```sh
mail config set --defaults microsoft_client_id 11111111-2222-3333-4444-555555555555
```

Задать его можете только вы; агенту через MCP в этом отказано.
