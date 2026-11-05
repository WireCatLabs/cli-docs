---
title: "Gmail с вашим собственным приложением Google"
---

Gmail работает с паролем приложения, и `mail` по умолчанию использует именно его. Используйте OAuth, если пароль
приложения создать нельзя: на аккаунте нет двухэтапной аутентификации или в домене Google Workspace пароли приложений
отключены.

Вход в Gmail по OAuth использует приложение Google от WireCat, если вы не указали своё. Побеждает первое совпадение:
`--client-file <Desktop client JSON>`, затем `MAIL_GOOGLE_CLIENT_ID` (вместе с `MAIL_GOOGLE_CLIENT_SECRET`), затем
настройка профиля `google_client_id` (её секрет по-прежнему берётся из `MAIL_GOOGLE_CLIENT_SECRET`), затем приложение
WireCat. `mail doctor` показывает, какое из них использует профиль, в поле `oauth_client`. Сделать общее приложение Google публичным
для почты сложно, поэтому Google может отказать во входе через приложение WireCat. Если так, создайте своё приложение,
как описано ниже (это занимает около 20 минут и ничего не стоит), или используйте пароль приложения.

## 1. Проект Google Cloud только для почты

Откройте [Google Cloud Console](https://console.cloud.google.com/) и выберите **New Project** (Создать проект) в
селекторе проектов. Дайте ему имя, например `mail for me`, и держите его выбранным на всех шагах ниже.

Создайте новый проект, даже если у вас уже есть проект для `drive` или `gcal`. Когда вход отзывают, Google снимает все
разрешения, выданные этому проекту, для каждого приложения в нём
([установленные приложения](https://developers.google.com/identity/protocols/oauth2/native-app)): общий проект
разлогинил бы и `drive`, и `gcal`.

## 2. Экран согласия

Откройте **☰ → Google Auth platform → Branding** ([прямая ссылка](https://console.cloud.google.com/auth/branding)) и
выберите **Get Started**. Укажите название приложения (`mail for me`), свой адрес как контактный адрес для поддержки и
связи и аудиторию **External** (или **Internal** для аккаунта Workspace, которым пользуетесь только вы). Создайте его.

## 3. Разрешение

Откройте **Google Auth platform → Data Access** ([прямая ссылка](https://console.cloud.google.com/auth/scopes)),
выберите **Add or Remove Scopes** и вручную добавьте `https://mail.google.com/` в поле ручного ввода. Сохраните. Это
единственная область доступа (scope), которую Gmail даёт для IMAP и SMTP
([XOAUTH2](https://developers.google.com/workspace/gmail/imap/xoauth2-protocol)). Также `mail` запрашивает `openid` и
`email`, чтобы проверить, что вы вошли под нужным аккаунтом.

Страница Google не говорит, нужно ли включать Gmail API только для IMAP. Если вход проходит, а затем
`session status --check` завершается ошибкой, включите
[Gmail API](https://console.cloud.google.com/apis/library/gmail.googleapis.com) в этом проекте и повторите попытку.

## 4. Опубликуйте приложение (Production) без проверки

Откройте **Google Auth platform → Audience** ([прямая ссылка](https://console.cloud.google.com/auth/audience)) и
выберите **Publish app**, затем подтвердите. Не отправляйте приложение на проверку.

Пока приложение External находится в статусе **Testing**, Google завершает его входы через 7 дней
([срок действия токена обновления](https://developers.google.com/identity/protocols/oauth2#expiration)), и
синхронизация по расписанию останавливается раз в неделю. Опубликованное приложение сохраняет вход. Google не требует
проверки от личного приложения с числом пользователей менее 100
([исключения](https://support.google.com/cloud/answer/13464323)); при входе оно показывает «Google hasn't verified this
app»: выберите **Advanced**, затем **Go to mail for me (unsafe)**. Это ваше собственное приложение.

Если оставить приложение в статусе Testing, добавьте свой адрес в **Test users** и будьте готовы запускать
`session start` каждую неделю; `mail doctor` предупреждает начиная с шестого дня.

## 5. Клиент для компьютера

Откройте **Google Auth platform → Clients** ([прямая ссылка](https://console.cloud.google.com/auth/clients)), выберите
**Create Client**, **Application type → Desktop app**, имя и **Create**. Выберите **Download JSON** и сохраните файл вне
любого репозитория. Сделайте его доступным для чтения только вам, иначе `mail` его отклонит:

```sh
chmod 600 ~/Downloads/client_secret_*.json
```

Этот файл называет приложение, но не даёт доступа к вашей почте. `mail` читает его один раз, при входе, и хранит
идентификатор и секрет приложения вместе с токенами в связке ключей.

## 6. Вход

Новый профиль:

```sh
mail gm session start --address me@gmail.com --client-file ~/Downloads/client_secret_XXXX.json
```

`--client-file` делает так, что новый профиль Gmail входит через OAuth. Если у профиля Gmail сейчас пароль приложения,
сначала переключите его в терминале (агент не может менять `auth`):

```sh
mail gm config set auth oauth
mail gm session start --client-file ~/Downloads/client_secret_XXXX.json
```

Браузер откроет страницу Google. Выберите аккаунт, разрешите доступ, и `mail` проверит адрес и войдёт по IMAP, прежде
чем что-либо сохранит. Для профиля, уже переключённого на OAuth, `MAIL_GOOGLE_CLIENT_ID` и
`MAIL_GOOGLE_CLIENT_SECRET` могут заменить `--client-file`; если нет ни того, ни другого, `mail gm session start` входит
через приложение WireCat.

## Выход

`mail gm session end` забывает вход на этом компьютере и сохраняет почту. `--revoke` дополнительно просит Google отозвать
его, что снимает все разрешения всего проекта Google; если проект только для почты, это касается одного `mail`.
