---
title: "Úsalo"
---

Cómo se forma un comando y cómo usa la herramienta un agente. Léelo antes de tu primer comando.

## Primero el perfil

Un perfil es un nombre que eliges para una cuenta. Es la primera palabra de cada comando que usa una cuenta:

```sh
amo work config show
```

`AMO_PROFILE=work` hace lo mismo para una sesión de la terminal. Nunca se da un perfil por supuesto, ni siquiera el
único: un comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador.

## Inicia sesión

Crea la integración privada de la cuenta e inicia sesión en el perfil como muestra [instala y conecta](./installation.md),
con una clave o con la integración en el navegador. `amo work session status --check` muestra la cuenta y el usuario
con los que actúa un perfil.

## La primera sincronización

`sync` copia en el almacén local de WireCat las negociaciones asignadas a ti, más las de los compañeros que elija un
administrador, y solo los contactos y empresas de esas negociaciones. Después, comandos como `deals list` leen esa
copia sin conexión:

```sh
amo work sync
amo work deals list status:open
```

Cualquier otro cliente se lee en directo con `people` u `organizations`. Ejecuta `sync` otra vez para poner la copia
al día. `amo work schedule command crm --every 1h -- sync` lo hace con un temporizador.

## Llama a la API

`amo work api list` lista todas las operaciones de la API v4 de amoCRM, con nombres del tipo `<HTTP verb> <path>`,
su clave de permiso y su página de referencia. `api call` envía una, con la consulta y el cuerpo en JSON:

```sh
amo work api call "GET /api/v4/leads" --params '{"limit":5,"with":"loss_reason"}'
amo work api call "PATCH /api/v4/leads/42" --body '{"price":1000}' --dry-run
```

`--dry-run` muestra todos los permisos que comprueba la llamada y no envía nada.

## Salida para scripts

Todos los comandos salvo `mcp serve` por stdin y stdout aceptan `--json` e imprimen un solo valor JSON en stdout.
Los errores salen en JSON por stderr, con un código para decidir qué hacer. La
[referencia de comandos](./commands.md) lista los códigos.

## Agentes

`amo skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`amo skill install --for hermes` añade además esa carpeta a los ajustes de Hermes Agent, así que un `skill install`
sin más deja fuera a Hermes. `amo work mcp serve` sirve los comandos del perfil por MCP, por stdin y stdout:

```sh
claude mcp add amo -- amo work mcp serve
```

El servidor ofrece todos los comandos, también los que escriben. Lo que se ejecuta lo deciden los permisos del perfil.
Mira los [ajustes](./configuration.md#permissions).

Para ChatGPT y Claude en el navegador,
`amo work mcp serve --http --public-url https://laptop.example.ts.net` sirve en `127.0.0.1` (puerto 8765, o
`--port`) detrás de tu propio túnel. Una aplicación del navegador entra con un código de un solo uso que imprime el
comando. `amo work mcp revoke` termina todos los accesos. `amo work mcp server start` ejecuta el mismo servidor en
segundo plano, `mcp server status` muestra su puerto, el código de acceso y las aplicaciones conectadas, y
`mcp server stop` lo detiene.
