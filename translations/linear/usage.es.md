---
title: "Úsalo"
---

Pregunta por las incidencias de tu equipo o cambia una desde un terminal, o deja que lo haga tu agente, siempre en
el espacio de trabajo que nombras. Cada comando empieza por un perfil, así que nada va a la cuenta equivocada. Un
script recibe JSON, con un código de error para decidir qué hacer, y un agente recibe los mismos comandos como skill o
por MCP.

## Primero el perfil

Un perfil es un nombre que eliges para una cuenta. Es la primera palabra de cada comando que usa una cuenta:

```sh
linear personal config show
```

`WCLINEAR_PROFILE=personal` hace lo mismo para una sesión de la terminal. Nunca se da un perfil por supuesto, ni
siquiera el único: un comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador.

## Salida para scripts

Todos los comandos, salvo `mcp serve` sobre stdin y stdout, aceptan `--json` e imprimen un solo valor JSON en stdout.
Los errores salen en JSON por stderr, con un código para decidir qué hacer. La
[referencia de comandos](./commands.md) enumera los códigos.

## Agentes

`linear skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`linear skill install --for hermes` además añade esa carpeta a los ajustes de Hermes Agent, así que un simple
`skill install` deja fuera a Hermes. `linear personal mcp serve` sirve los comandos del perfil por MCP, sobre stdin y
stdout:

```sh
claude mcp add linear -- linear personal mcp serve
```

El servidor ofrece todos los comandos, también los que escriben. Los permisos del perfil deciden qué se ejecuta. Mira
los [ajustes](./configuration.md#permissions).

Para ChatGPT y Claude en el navegador,
`linear personal mcp serve --http --public-url https://laptop.example.ts.net` escucha en `127.0.0.1` (puerto 8765, o
`--port`) detrás de tu propio túnel. Una aplicación del navegador inicia sesión con un código de un solo uso que
imprime el comando. `linear personal mcp revoke` termina todas las sesiones. `linear personal mcp server start`
ejecuta el mismo servidor en segundo plano, `mcp server status` muestra su puerto, el código de inicio de sesión y las
aplicaciones conectadas, y `mcp server stop` lo detiene.
