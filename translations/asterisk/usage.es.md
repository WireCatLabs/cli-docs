---
title: "Úsalo"
---

Aquí se explica cómo se construye un comando y cómo usa un agente la herramienta. Léelo antes de tu primer comando.

## Primero el perfil

Un perfil es un nombre que eliges para una centralita. Es la primera palabra de cada comando que usa una cuenta:

```sh
asterisk office meetings list
```

`ASTERISK_PROFILE=office` hace lo mismo durante una sesión de la shell. Nunca se supone un perfil, ni siquiera el
único: un comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador.

## Las llamadas son reuniones

Cada fila del CDR es una reunión en el almacén de WireCat. Su título son los dos lados, `+79000000001 → 101`. Sus
personas son la extensión (`manager`) y el número externo (`client`), y su grabación es un adjunto.

```sh
asterisk office meetings sync                                  # import what is new
asterisk office meetings list "started_at>=2026-11-01"          # newest first
asterisk office meetings list "title:*79000000001*"             # the calls of one number
asterisk office meetings show 42                                 # times, people, recording
asterisk office meetings transcribe                              # recordings to text, on this computer
asterisk office meetings transcript 42                           # what was said
```

`asterisk office meetings list --help` muestra los campos que admite una consulta.

## Salida para scripts

Todos los comandos salvo `mcp serve` sobre stdin y stdout admiten `--json` e imprimen un único valor JSON en stdout.
Los errores salen en JSON por stderr, con un código y un motivo para decidir qué hacer. La
[referencia de comandos](./commands.md) lista los códigos.

## Agentes

`asterisk skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`asterisk skill install --for hermes` además añade esa carpeta a los ajustes de Hermes Agent, así que un
`skill install` sin más deja fuera a Hermes. `asterisk office mcp serve` sirve los comandos del perfil por MCP, sobre
stdin y stdout:

```sh
claude mcp add asterisk -- asterisk office mcp serve
```

El servidor ofrece todos los comandos salvo `session start` y `session end`. Los permisos del perfil deciden qué se
ejecuta; consulta los [ajustes](./configuration.md#permissions). El texto de una llamada (una transcripción, el nombre
de quien llama, un número) llega al agente marcado como datos no fiables.

Para ChatGPT y Claude en el navegador,
`asterisk office mcp serve --http --public-url https://laptop.example.ts.net` escucha en `127.0.0.1` (puerto 8765, o
`--port`) detrás de tu propio túnel. Una aplicación del navegador inicia sesión con un código de un solo uso que
imprime el comando. `asterisk office mcp revoke` cierra todas las sesiones.
