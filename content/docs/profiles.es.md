---
title: "Perfiles y bots"
description: "Separa cuentas, accesos de bots y ajustes."
---

Usa perfiles si tienes varias cuentas, un bot o permisos distintos para tus agentes. Un perfil es una configuración con nombre para la conexión de una cuenta o bot en este ordenador, con sus propios datos de acceso y permisos. Aquí aprenderás a elegir el adecuado y distinguir un comando del bot de uno de tu cuenta personal.

## Elegir un perfil

Pon el nombre antes del comando:

```sh
tg work config show
max work config show
drive personal config show
```

Indica siempre el perfil previsto en comandos y peticiones al agente. Los comandos de cuenta
Drive lo requieren explícitamente; omitirlo es un error. Las versiones revisadas de Telegram/MAX
conservan la selección predeterminada sin nombre, así que indícalo también allí. `profiles.work`
se aplica a ese perfil y `defaults` aporta valores ausentes. Un perfil no es otro usuario del SO: un agente con acceso
completo a archivos puede acceder a otros datos del mismo ordenador.

## Cambiar a un bot

Pon `bot` después del perfil:

```sh
tg support bot api get-me --json
max support bot api get-my-info --json
```

Necesitas un perfil de bot conectado. Su cuenta y derechos los define el servicio de mensajería, no tu
cuenta personal. [Bots](./bot-api.mdx) explica la conexión y ejemplos.

## Ajustes y acceso

[Configuración](./configuration.mdx) explica archivo, variables de entorno y opciones.
[Permisos](./permissions.mdx) controla las acciones de cada perfil.
Consulta el acceso de [Telegram](./tg/sessions.md) o [MAX](./max/sessions.md), o [conecta Google Drive](./drive/installation.md).
