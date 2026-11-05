---
title: "ChatGPT или Claude в браузере"
---

Это руководство для случая, когда приложение ИИ в браузере или на телефоне — например ChatGPT или Claude — должно читать ваш Google Календарь через `gcal`. Такое приложение не может запустить `gcal` на вашем компьютере, поэтому вы даёте ему интернет-адрес. В итоге приложение подключено к `gcal` через отдельный HTTPS-адрес, может делать только то, что разрешает профиль, а вы знаете, как остановить подключение или отозвать доступ.

Термины в этом руководстве:

- **MCP** (Model Context Protocol) — стандарт, по которому приложение ИИ вызывает внешние инструменты. `gcal personal mcp serve` — MCP-сервер, который входит в `gcal`; для приложения на своём компьютере см. [агенты](./usage.md#agents).
- **Удалённое подключение** означает, что приложение обращается со своих серверов через интернет к указанному вами адресу. Для этого `gcal personal mcp serve --http` предоставляет те же инструменты по HTTP на `127.0.0.1`.
- **HTTPS-туннель** — программа, которая даёт порту вашего компьютера публичный HTTPS-адрес. Здесь используется [Tailscale Funnel](https://tailscale.com/docs/features/tailscale-funnel); подойдёт и Cloudflare Tunnel. Для Funnel не нужно покупать домен.
- **Публичный URL** — этот адрес, например `https://laptop.tail1234.ts.net`. Вы передаёте его `gcal` через `--public-url`, а приложение получает его с `/mcp` в конце.
- **Код входа** — одноразовый код, который `gcal` выводит в терминале. Страница входа приложения запрашивает этот код, поэтому подключить приложение может только человек, который видит терминал.

```text
ChatGPT / Claude ──internet──▶ Tailscale Funnel ──▶ gcal personal mcp serve --http (login) ──▶ Google Calendar
```

Если Tailscale уже работает, используйте существующее подключение: второй туннель не нужен. Локальное подключение через стандартные потоки ввода и вывода продолжает работать.

## Перед началом

- **Тот, кто вошёл, читает ваш календарь.** События, их описания, участников и людей, с которыми вы встречаетесь. Для входа нужен код входа из терминала.
- **Права профиля определяют, что приложение может менять.** Через MCP спросить некого, поэтому право со значением `ask` пропускает команду. По умолчанию это создание, изменение и удаление событий, а также открытие календаря кому угодно ([права](./configuration.md#permissions)). Подтверждение в самом приложении — отдельная вещь и зависит от его настроек. Для изменений также нужно право записи в Google: профиль, вошедший без `--grant write`, только читает ([вход](./usage.md#sign-in-to-google)).
- **Компьютер с `gcal` должен оставаться включённым.** Чтобы работать с телефона, запустите всё это на небольшом сервере, который всегда включён, и войдите в Google там.
- **Проверьте, разрешены ли в приложении или рабочем пространстве пользовательские подключения MCP.** Доступность и ограничения администратора зависят от приложения. Следуйте актуальному [руководству OpenAI](https://developers.openai.com/api/docs/guides/custom-mcp-server) или [руководству Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

Не все шаги настройки проверены на каждой операционной системе. Если шаг не работает, [создайте задачу](https://github.com/WireCatLabs/gcal-cli/issues).

## Запустите туннель и сервер

Сначала установите `gcal` и войдите в Google ([установка](./installation.md)). Настраивайте и запускайте MCP-сервер под одним пользователем операционной системы и с одним профилем.

Установите [Tailscale](https://tailscale.com/download), войдите и включите [Funnel](https://tailscale.com/docs/features/tailscale-funnel): в вашей сети Tailscale (tailnet) должны быть разрешены MagicDNS, HTTPS-сертификаты и Funnel. Первая команда Funnel может вывести ссылку для подтверждения.

Оставьте открытыми два окна терминала. В первом работает туннель. Скопируйте HTTPS-адрес, который он выведет, во второе окно, без `/mcp`. Явно указанный публичный порт, например `:8443`, сохраните.

Сервер слушает `127.0.0.1:8765` (порт меняется через `--port`) и выводит код входа. Права администратора ему не нужны никогда; они могут понадобиться только туннелю.

В Linux, первое окно:

```sh
sudo tailscale funnel 8765
```

В macOS, если `tailscale` нет в PATH ([руководство по CLI Tailscale](https://tailscale.com/docs/reference/tailscale-cli?tab=macos)):

```sh
TAILSCALE_BE_CLI=1 /Applications/Tailscale.app/Contents/MacOS/Tailscale funnel 8765
```

В Windows, в PowerShell от имени администратора:

```powershell
& "$env:ProgramFiles\Tailscale\tailscale.exe" funnel 8765
```

Второе окно, от вашего обычного пользователя, без `sudo`. Во всех командах ниже стоит пример адреса
`https://laptop.example-tailnet.ts.net`, который ни у кого не работает: подставьте вместо него HTTPS-адрес, который
напечатал ваш туннель.

```sh
gcal personal mcp serve --http --port 8765 --public-url https://laptop.example-tailnet.ts.net
```

Он отвечает локальным адресом, на котором работает, адресом коннектора для приложения и кодом входа.

Чтобы запустить `gcal` рядом с `tg`, `drive` или другим инструментом WireCat, дайте каждому серверу свой локальный порт. Затем либо дайте каждому свой публичный HTTPS-порт, например второй Funnel с `--https=8443 8766` и `gcal personal mcp serve --http --port 8766 --public-url https://laptop.example-tailnet.ts.net:8443` (Funnel поддерживает публичные порты `443`, `8443` и `10000`), либо используйте один адрес с отдельным путём для каждого инструмента: `--public-url https://laptop.example-tailnet.ts.net/gcal`, а `--set-path /gcal` в Funnel направляет этот путь на нужный порт. Адрес коннектора тогда `…/gcal/mcp`. См. [справочник команды Funnel](https://tailscale.com/docs/reference/tailscale-cli/funnel).

### Вариант: Cloudflare Tunnel

[Именованный туннель Cloudflare](https://developers.cloudflare.com/tunnel/get-started/) с публичным именем, например `mcp.example.com`, и локальной службой `http://127.0.0.1:8765` работает так же:

```sh
gcal personal mcp serve --http --port 8765 --public-url https://mcp.example.com
```

Временный Quick Tunnel (`cloudflared tunnel --url …`) не подойдёт: [Quick Tunnels не поддерживают SSE](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/), а именно так HTTP-сервер MCP передаёт ответы.

### Работа в фоне

Чтобы сервер продолжал работать после закрытия окна, запустите его в фоне. Он отвечает, как только начинает слушать, и выводит адрес коннектора и код входа:

```sh
gcal personal mcp server start --port 8765 --public-url https://laptop.example-tailnet.ts.net
gcal personal mcp server status   # running, port, connector address, the current login code, apps logged in
gcal personal mcp server stop     # stops only a server that `mcp server start` started
```

Сервер, запущенный так, не пишет код в свой журнал: его показывает `mcp server status`. Код хранится в папке состояния `gcal`, `mcp-http/<profile>.lock`, которую может читать только ваш пользователь (режим 600).

Один сервер может обслуживать несколько профилей: `gcal mcp serve --http --profiles work,personal` или `--profiles all` для всех профилей на этом компьютере. Тогда каждый вызов инструмента называет свой профиль. У набора профилей свой вход, отдельный от входа каждого профиля; `mcp server start | stop | status` и `mcp revoke` принимают тот же `--profiles`. Если не указан ни профиль, ни `--profiles`, `gcal` отказывается и перечисляет профили.

## Подключите приложение

Адрес для приложения — ваш публичный URL с `/mcp` в конце, например `https://laptop.example-tailnet.ts.net/mcp`. Добавьте его как удалённый MCP-коннектор:

- **ChatGPT:** откройте **Plugins**, выберите **+ Add custom MCP server** и создайте плагин с адресом `/mcp` и OAuth, как описано в [руководстве OpenAI](https://developers.openai.com/api/docs/guides/custom-mcp-server). Если предложат, выберите динамическую регистрацию клиента (DCR), затем установите плагин, прежде чем использовать его в разговоре.
- **Claude:** добавьте пользовательский коннектор с этим адресом, как описано в [руководстве по коннекторам Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

Приложение откроет страницу входа `gcal`. Проверьте строку, где сказано, куда идёт вход: там должно быть подключаемое приложение, например `chatgpt.com` или `claude.ai`. Затем введите код входа из терминала. Код действует для одного входа и десять минут; потом `gcal` выводит новый. После пяти неверных кодов страница отказывает тридцать секунд, а затем принимает самый новый код. Приложение остаётся в системе, пока пользуется подключением хотя бы раз в 30 дней.

Сервер предлагает те же три инструмента, что и через стандартные потоки ввода и вывода: `gcal_tools_search`, `gcal_read` и `gcal_write`. `api call`, очистка календаря, `session` и `mcp` не предлагаются никогда. Названия, описания событий и имена участников — слова других людей: приложение должно считать их данными, а не инструкциями.

## Права для этого процесса сервера

Сервер не видит, спросило ли вас приложение перед вызовом. Повторяйте `--permission key=level`, чтобы ужесточить права только для этого процесса сервера:

```sh
gcal personal mcp serve --http --public-url https://laptop.example-tailnet.ts.net --permission api=readonly
gcal personal mcp serve --http --public-url https://laptop.example-tailnet.ts.net --permission api.calendar.acl=deny
```

`api=readonly` отклоняет любое изменение, включая события; `api.calendar.acl=deny` не даёт приложению открыть доступ к календарю. Такая настройка только ужесточает права и никогда не ослабляет уровень профиля. Чтобы разрешить больше, измените права профиля ([настройки](./configuration.md#permissions)). `GCAL_READ_ONLY=1` в окружении сервера тоже отклоняет любое изменение.

## Остановите сервер или отзовите доступ

Нажмите Ctrl-C в обоих окнах, чтобы остановить сервер и туннель. Входы приложений сохраняются после перезапуска.

Если вы запустили Funnel с `--bg`, Ctrl-C не останавливает этот фоновый маршрут: проверьте `tailscale funnel status` и выключите только его порт, например `tailscale funnel --https=443 off`.

Чтобы выйти из всех приложений профиля или сервера нескольких профилей:

```sh
gcal personal mcp revoke
gcal mcp revoke --profiles all
```

Этим приложениям придётся войти снова с новым кодом. Вход `gcal` в Google при этом сохраняется; выйти из Google позволяет `session end`.

## Если не работает

- **Приложение пишет, что не может подключиться:** откройте в браузере `https://laptop.example-tailnet.ts.net/.well-known/oauth-protected-resource/mcp` (с путём: `…/.well-known/oauth-protected-resource/gcal/mcp`). Там должен быть короткий JSON. Если его нет, Funnel не запущен, не включён в вашей сети Tailscale или направлен на другой порт.
- **Страница входа пишет «Too many wrong codes»:** подождите тридцать секунд и введите самый новый код. Если вы их не вводили, кто-то нашёл ваш адрес: выполните `gcal personal mcp revoke` и подумайте о новом имени устройства в Tailscale.
- **«already serves MCP over HTTP for this profile»:** сервер для этого профиля уже работает, возможно в фоне. `gcal personal mcp server status` покажет где; `mcp server stop` останавливает сервер, запущенный через `server start`.
- **«port 8765 is in use»:** порт занят другой программой; укажите другой `--port` и направьте на него туннель.
- **«too many logged-in apps»:** вход держат десять приложений. Выполните `gcal personal mcp revoke`, затем подключитесь снова.
- **Чтение работает, запись нет:** проверьте права профиля, переопределения `--permission`, `GCAL_READ_ONLY` и право записи в Google (`gcal personal session status` перечисляет `grants`).
