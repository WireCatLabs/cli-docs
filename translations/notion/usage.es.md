---
title: "Úsalo"
---

Aquí se explica cómo se construye un comando y cómo usa un agente la herramienta. Léelo antes de tu primer comando.

## Primero el perfil

Un perfil es un nombre que eliges para una cuenta. Es la primera palabra de cada comando que usa una cuenta:

```sh
notion personal config show
```

`WCNOTION_PROFILE=personal` hace lo mismo durante una sesión de la shell. Nunca se supone un perfil, ni siquiera el
único: un comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador.

## Salida para scripts

Todos los comandos salvo `mcp serve` sobre stdin y stdout admiten `--json` e imprimen un único valor JSON en stdout.
Los errores salen en JSON por stderr, con un código para decidir qué hacer. La
[referencia de comandos](./commands.md) lista los códigos.

## Agentes

`notion skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`notion skill install --for hermes` además añade esa carpeta a los ajustes de Hermes Agent, así que un
`skill install` sin más deja fuera a Hermes. `notion personal mcp serve` sirve los comandos del perfil por MCP, sobre
stdin y stdout:

```sh
claude mcp add notion -- notion personal mcp serve
```

El servidor ofrece todos los comandos, también los que escriben. Los permisos del perfil deciden qué se ejecuta.
Consulta los [ajustes](./configuration.md#permissions).

Para ChatGPT y Claude en el navegador,
`notion personal mcp serve --http --public-url https://laptop.example.ts.net` escucha en `127.0.0.1` (puerto 8765, o
`--port`) detrás de tu propio túnel. Una aplicación del navegador inicia sesión con un código de un solo uso que
imprime el comando. `notion personal mcp revoke` cierra todas las sesiones. `notion personal mcp server start` ejecuta
el mismo servidor en segundo plano, `mcp server status` muestra su puerto, el código de inicio de sesión y las
aplicaciones conectadas, y `mcp server stop` lo detiene.
