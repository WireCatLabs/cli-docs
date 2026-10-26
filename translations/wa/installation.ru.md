---
title: "Установка wa"
---


Установите `wa` из npm, узнайте, как обновлять и удалять его. Нужен Node.js 22.16 или новее в ветке 22.x либо 24 или новее.

> ⚠️ **`wa` — неофициальный клиент вашего аккаунта WhatsApp.** WhatsApp может блокировать такие аккаунты, в том числе за массовую рассылку и сообщения незнакомым людям. `wa` меняет данные только по явной команде, ограничивает отправку и приостанавливает изменения, когда WhatsApp требует снизить частоту запросов. Не отправляйте массовые или нежелательные сообщения ([ограничения](./limits.md)).

## Установить

```sh
npm install --global @wirecat/whatsapp-cli
wa --version
```

npm также устанавливает движок — отдельную программу для протокола WhatsApp. Он доступен для Linux, macOS и Windows, для x64 и arm64. Оставьте установку необязательных пакетов включённой: `--omit=optional` исключает движок.

Затем свяжите профиль и установите навык агента с помощью `wa personal setup` (см. [использование](./usage.md)).

Сама установка ничего не записывает в папки ваших агентов. Чтобы установить навык агента без привязки, запустите `wa skill install` (`--for claude` или `--for agents` для одной папки). Чтобы навык устанавливался вместе с пакетом, задайте для `WA_INSTALL_AGENT` значение `all`, `claude`, `codex`, `cursor` или `gemini`: `WA_INSTALL_AGENT=all npm install --global @wirecat/whatsapp-cli`.


## Из исходного кода

Вместо этого, чтобы запустить `wa` из локальной копии репозитория:

```sh
git clone https://github.com/WireCatLabs/whatsapp-cli.git
cd whatsapp-cli
pnpm install
pnpm build
pnpm engine:build   # needs Go
node dist/bin/wa.js --version
```


## Куда идут файлы

Ключи устройства, настройки и локальное хранилище имеют свое собственное место: [где хранятся детали](./sessions.md#where-the-parts-are-kept).


## Завершение оболочки

Вкладка завершает команды, параметры и их значения. Там, где ожидается чат, он предлагает чаты из локального хранилища. Добавьте одну строку в файл запуска вашей оболочки:

```sh
echo 'source <(wa complete zsh)' >> ~/.zshrc      # zsh
echo 'source <(wa complete bash)' >> ~/.bashrc    # bash
wa complete fish | source                         # fish, in config.fish
```

PowerShell: `wa complete powershell | Out-String | Invoke-Expression` в вашем профиле.

Tab никогда не подключается к WhatsApp. Пока нет локального хранилища, выполняются только команды и параметры.


## Обновление

```sh
wa upgrade            # with the package manager that installed wa
wa upgrade --check    # only say whether a newer version exists; installs nothing
```

`upgrade` запрашивает npm, поэтому `--offline` отклоняется с кодом выхода `2`. `upgrade --check` работает под управлением `WA_READ_ONLY`; `upgrade` без него не обходится.

После обновления `wa upgrade` перезапускает каждый работающий фоновый `serve`, поэтому старый код не продолжает выполняться. Движок поставляется в виде пакета `wa`, поэтому он обновляется вместе с ним. Раз в день `wa` сообщает в stderr, когда существует более новая версия; `WA_NO_UPDATE_CHECK=1` или `update_check: false` в настройках отключает это.

Из исходного кода: `git pull && pnpm install && pnpm build && pnpm engine:build`.


## Удалить

Удаление команды оставляет ваши данные. Сначала отсоедините, пока `wa` еще здесь:

```sh
wa personal server uninstall         # if you installed the background unit; stop it first
wa personal session end              # unlinks the device on WhatsApp's side and deletes its keys here
npm uninstall -g @wirecat/whatsapp-cli
rm -rf ~/.config/whatsapp-cli ~/.local/share/whatsapp-cli ~/.cache/whatsapp-cli
```

Повторите `session end` для каждого профиля. Локальная база данных используется совместно с другими инструментами WireCat. Удалите `~/.local/share/WireCat/`, только если его больше никто не использует: он содержит сообщения, которые сохранил каждый из них.


## Далее

[Свяжите профиль и прочитайте свои первые чаты](./usage.md#set-up-a-profile).
