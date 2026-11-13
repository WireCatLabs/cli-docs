---
title: "Asterisk"
---

`asterisk` переносит звонки АТС Asterisk в WireCat: для терминала, для скриптов и для ИИ-агентов. Он читает записи о
звонках (CDR) из `Master.csv` или из базы CDR, находит для каждого звонка его аудиозапись и хранит звонки в локальном
хранилище WireCat как встречи. `meetings transcribe` превращает аудиозаписи в текст на этом компьютере.

Он только читает: никогда не меняет АТС, ее настройки или аудиозаписи. В нем есть команды, общие для всех CLI WireCat:
`doctor`, `commands`, `config`, `skill`, `mcp`, `runs` и `upgrade`, а также `session`, `meetings`, `events` и
`models`.

Начните с [установки](./installation.md), затем [подключите Asterisk](./asterisk.md) и [начните работу](./usage.md).
