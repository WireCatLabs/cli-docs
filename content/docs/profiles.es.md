---
title: "Perfiles y bots"
description: "Separa cuentas, accesos de bots y ajustes."
---

Usa perfiles si tienes varias cuentas, un bot o permisos distintos para tus asistentes. Un perfil da nombre y ajustes propios a una cuenta o bot. Aquí aprenderás a elegir el adecuado y distinguir un comando del bot de uno de tu cuenta personal.

## Elegir un perfil

Pon el nombre antes del comando:

```sh
tg work config show
max work config show
```

Sin nombre se usa el perfil predeterminado. `profiles.work` aplica a ese perfil; `defaults`
aplica cuando no hay valor propio. Un perfil no es otro usuario del SO: un asistente con acceso
completo a archivos puede acceder a otros datos del mismo ordenador.

## Cambiar a un bot

Pon `bot` después del perfil:

```sh
tg support bot api get-me --json
max support bot api get-my-info --json
```

Necesitas un perfil de bot conectado. Su cuenta y derechos los define el mensajero, no tu
cuenta personal. [Bots](./bot-api.mdx) explica la conexión y ejemplos.

## Ajustes y acceso

[Configuración](./configuration.mdx) explica archivo, variables de entorno y opciones.
[Permisos](./permissions.mdx) controla las acciones de cada perfil.
Consulta el acceso de [Telegram](./tg/sessions.md) o [MAX](./max/sessions.md).
