---
title: "Работа с инструментом"
---

Здесь объясняется, как устроена команда и как агент работает с инструментом. Прочитайте это перед первой командой.

## Сначала профиль

Профилем называется имя, которое вы выбираете для одной АТС. Оно стоит первым словом в каждой команде, которой нужен
аккаунт:

```sh
pbx office meetings list
```

`PBX_PROFILE=office` делает то же самое для одного сеанса оболочки. Профиль никогда не подставляется сам, даже
если он единственный: команда без профиля останавливается с кодом выхода 2 и показывает профили на этом компьютере.

## Звонки хранятся как встречи

Каждая строка CDR становится одной встречей в хранилище WireCat. Ее название составлено из двух сторон,
`+79000000001 → 101`. Люди в ней: внутренний номер (`manager`) и внешний номер (`client`), а аудиозапись прикреплена
как вложение.

```sh
pbx office meetings sync                                  # import what is new
pbx office meetings list "started_at>=2026-11-01"          # newest first
pbx office meetings list "title:*79000000001*"             # the calls of one number
pbx office meetings show 42                                 # times, people, recording
pbx office meetings transcribe                              # recordings to text, on this computer
pbx office meetings transcript 42                           # what was said
```

`pbx office meetings list --help` перечисляет поля, которые принимает запрос.

## Вывод для скриптов

Каждая команда, кроме `mcp serve` на stdin и stdout, принимает `--json` и печатает одно значение JSON в stdout.
Ошибки выводятся в stderr тоже в JSON, с кодом и причиной, по которым можно ветвиться.
[Справочник команд](./commands.md) перечисляет коды.

## Агенты

`pbx skill install` кладет навык инструмента туда, где его ищут Claude Code, Codex, Gemini CLI и OpenClaw.
`pbx skill install --for hermes` еще и добавляет эту папку в собственные настройки Hermes Agent, так что простой
`skill install` обходится без Hermes. `pbx office mcp serve` отдает команды профиля по MCP, через stdin и stdout:

```sh
claude mcp add pbx -- pbx office mcp serve
```

Сервер предлагает все команды, кроме `session start` и `session end`. Что запускается, решают разрешения профиля,
см. [настройки](./configuration.md#permissions). Текст из звонка (расшифровка, имя звонящего, номер) доходит до агента
с пометкой «недоверенные данные».

Для ChatGPT и Claude в браузере
`pbx office mcp serve --http --public-url https://laptop.example.ts.net` слушает на `127.0.0.1` (порт 8765 или
`--port`) за вашим собственным туннелем. Браузерное приложение входит по одноразовому коду, который печатает команда.
`pbx office mcp revoke` завершает все входы.
