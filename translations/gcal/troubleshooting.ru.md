---
title: "Если что-то пошло не так"
---

Найдите симптом, выполните проверку, затем повторите команду. Для обращения в поддержку сохраните код ошибки и имя
профиля.

| Симптом | Что делать |
| --- | --- |
| Непонятно, что настроено | Запустите `gcal doctor`. Он не читает хранилище ключей и не обращается к сети. |
| `gcal` не найден | Откройте новый терминал и проверьте, что глобальная папка npm есть в `PATH`. |
| «name a profile» | Поставьте профиль первым словом, как в `gcal personal config show`, или задайте `GCAL_PROFILE`. |
| Файл настроек не читается | `doctor` перечисляет все проблемы файла в `config.issues`. Выполните `config unset`, который предлагается для каждой, или исправьте файл вручную. |
| `doctor` показывает `files.problems` | Другие пользователи компьютера могут читать `config.json` или заходить в его папку. Выполните каждую команду `chmod`, которую `doctor` выводит после «to make it private:». Сам `doctor` права файлов не меняет. |
| `profile.wrong-account` или `profile.same-account` | У каждого аккаунта Google один профиль. Используйте профиль, который уже есть у этого аккаунта, или новое имя профиля для нового аккаунта. |
| `oauth.not-saved` | Файл со входом (`credentials.json` в папке состояния; его используют `--credential-storage file` и любой запуск, когда хранилище ключей не работает) существует, но не читается как файл со входом. Уберите его в сторону и войдите снова. |
| «the WireCat Google client in this gcal package cannot be read» | Пакет повреждён. Установите `gcal` заново или передайте `--client-file` со своим клиентом. |
| Запись отклонена | Её запрещают разрешения профиля или `GCAL_READ_ONLY`; см. [настройки](./configuration.md#permissions). |

## Проблемы со входом

Они возникают, когда вы [создаёте своё приложение Google](./installation.md#make-your-own-google-app) и входите через
него. Строка со словами «в браузере» — это страница Google; остальные тексты выводит `gcal`.

| Симптом | Причина и решение |
| --- | --- |
| «no Google OAuth client is set up» | В пакете нет приложения WireCat, а вы не указали клиент. Передайте `--client-file` с файлом своего клиента Desktop app или задайте `GCAL_GOOGLE_CLIENT_ID` и `GCAL_GOOGLE_CLIENT_SECRET`. |
| `doctor` показывает `oauth_client.client: null` | В окружении нет клиента, и в пакете нет приложения WireCat. Профиль, вошедший с `--client-file`, продолжает работать: его вход хранит клиент. Клиент нужен только для нового `session start`. |
| «the client file can be read by other users of this computer» | Выполните `chmod 600` из сообщения, затем снова `session start`. |
| «could not read a Desktop app OAuth client JSON from the client file» | Это не файл клиента Desktop app. У файла клиента **Web application** другое устройство. Создайте в Google Cloud Console клиент типа **Desktop app** ([шаг 6](./installation.md#6-make-the-client-and-download-its-file)) и передайте его файл. |
| Google показывает в браузере `redirect_uri_mismatch` | `GCAL_GOOGLE_CLIENT_ID` указывает на клиент Web application. `gcal` входит через локальный адрес на вашем компьютере, а его разрешает только клиент Desktop app. Создайте клиент Desktop app и используйте его ID и секрет. |
| Google показывает в браузере `deleted_client` или `invalid_client` или пишет, что клиент не найден | Клиент удалён, или ID клиента неверный. Google может восстановить удалённый клиент в течение 30 дней; иначе создайте новый клиент ([шаг 6](./installation.md#6-make-the-client-and-download-its-file)). |
| «Google sign-in was refused (HTTP …)» сразу после того, как вы разрешили доступ | Google отказал клиенту, когда `gcal` запрашивал вход. Чаще всего секрет клиента не подходит к ID клиента, например после добавления нового секрета. Скачайте файл с текущим секретом и передайте его снова. |
| Google в браузере блокирует вход, потому что приложение не проверено или у вас нет доступа, а `gcal` завершается с «Google sign-in timed out» | Приложение в режиме **Testing**, а этот аккаунт Google не тестовый пользователь. Добавьте его в **Audience → Test users** ([шаг 4](./installation.md#4-audience)) или опубликуйте приложение, затем снова запустите `session start`. |
| «Google sign-in was declined» | Вы нажали **Cancel** на странице Google. Снова запустите `session start` и разрешите доступ. |
| Google показывает страницу «unverified app» | Google не проверял приложение: ваше собственное или приложение WireCat, пока Google не закончил его проверку. Нажмите на странице ссылку, ведущую дальше к приложению. |
| «Google did not grant read access to Calendar» (`sign-in.scope-missing`) | На странице согласия Google можно снять галочку с Календаря. Снова запустите `session start` и оставьте её. С `--grant write` — «Google did not grant the write permission»: оставьте отмеченным и доступ к событиям. |
| «the Google Calendar API is turned off for this OAuth project» | Вход прошёл, но Calendar API в проекте выключен. [Включите его](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com) в проекте своего клиента, подождите несколько минут и повторите команду. |
| «Google sign-in was refused (HTTP 400); run gcal personal session start again» (`oauth.expired`) через неделю после входа | Ваше приложение в режиме **Testing**, где вход заканчивается через 7 дней после согласия ([пояснение Google](https://developers.google.com/identity/protocols/oauth2#expiration)). Снова запустите `session start`. Чтобы это прекратилось, опубликуйте приложение: см. [шаг 4](./installation.md#4-audience). |

Никогда не вставляйте в обращение в поддержку токен, пароль или личное содержимое.
