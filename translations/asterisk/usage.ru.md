---
title: "Работа с инструментом"
---

Здесь объясняется, как устроена команда и как агент работает с инструментом. Прочитайте это перед первой командой.

## Сначала профиль

Профилем называется имя, которое вы выбираете для одной АТС. Оно стоит первым словом в каждой команде, которой нужен
аккаунт:

```sh
asterisk office meetings list
```

`ASTERISK_PROFILE=office` делает то же самое для одного сеанса оболочки. Профиль никогда не подставляется сам, даже
если он единственный: команда без профиля останавливается с кодом выхода 2 и показывает профили на этом компьютере.

## Звонки хранятся как встречи

Каждая строка CDR становится одной встречей в хранилище WireCat. Ее название составлено из двух сторон,
`+79000000001 → 101`. Люди в ней: внутренний номер (`manager`) и внешний номер (`client`), а аудиозапись прикреплена
как вложение.

```sh
asterisk office meetings sync                                  # import what is new
asterisk office meetings list "started_at>=2026-11-01"          # newest first
asterisk office meetings list "title:*79000000001*"             # the calls of one number
asterisk office meetings show 42                                 # times, people, recording
asterisk office meetings transcribe                              # recordings to text, on this computer
asterisk office meetings transcript 42                           # what was said
```

`asterisk office meetings list --help` перечисляет поля, которые принимает запрос.

## Вывод для скриптов

Каждая команда, кроме `mcp serve` на stdin и stdout, принимает `--json` и печатает одно значение JSON в stdout.
Ошибки выводятся в stderr тоже в JSON, с кодом и причиной, по которым можно ветвиться.
[Справочник команд](./commands.md) перечисляет коды.

## Агенты

`asterisk skill install` кладет навык инструмента туда, где его ищут Claude Code, Codex, Gemini CLI и OpenClaw.
`asterisk skill install --for hermes` еще и добавляет эту папку в собственные настройки Hermes Agent, так что простой
`skill install` обходится без Hermes. `asterisk office mcp serve` отдает команды профиля по MCP, через stdin и stdout:

```sh
claude mcp add asterisk -- asterisk office mcp serve
```

Сервер предлагает все команды, кроме `session start` и `session end`. Что запускается, решают разрешения профиля,
см. [настройки](./configuration.md#permissions). Текст из звонка (расшифровка, имя звонящего, номер) доходит до агента
с пометкой «недоверенные данные».

Для ChatGPT и Claude в браузере
`asterisk office mcp serve --http --public-url https://laptop.example.ts.net` слушает на `127.0.0.1` (порт 8765 или
`--port`) за вашим собственным туннелем. Браузерное приложение входит по одноразовому коду, который печатает команда.
`asterisk office mcp revoke` завершает все входы.
