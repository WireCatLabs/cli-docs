---
title: "Perfiles y bots"
---

Un **perfil** es el nombre de un inicio de sesión de `tg` en esta computadora: una cuenta de Telegram o un bot, con su propia sesión y su propia configuración. Sin nombre, `tg` usa el perfil `default`, por lo que con una cuenta nunca tendrás que pensar en perfiles.

Lea esta página cuando desee una segunda cuenta, desee que su agente de IA tenga menos derechos que usted o desee ejecutar un bot. Al final, sabrás cómo elegir un perfil para un comando, cómo darle su propia configuración y cómo cambiar a un bot.

## ¿Qué perfiles te permiten hacer?

| Quieres | Cómo |
|---|---|
| Utilice dos cuentas de Telegram en una computadora | Inicie sesión una vez por perfil: `tg work session start` |
| Dale a tu agente menos derechos de los que tienes | Un perfil con sus propios [permisos](./permissions.md) |
| Mantenga un agente en ese perfil | `TG_PROFILE_LOCK` ([perfiles en inicio de sesión y sesiones](./sessions.md#profiles)) |
| Ejecute un bot de Telegram junto a su cuenta | Un perfil de bot: `tg support bot api get-me` |
| Ver todos los perfiles en esta computadora | `tg account list` |

## Elige un perfil

Coloque el nombre del perfil antes del comando:

```sh
tg work config show
```

`tg account list` muestra todos los perfiles en esta computadora y la cuenta con la que cada uno inició sesión; `tg work session end` cierra la sesión del perfil `work`.

Una configuración en `profiles.work` en el archivo de configuración se aplica a ese perfil; Los valores bajo `defaults` se aplican cuando no tiene valor propio. Las reglas para los nombres de los perfiles y el orden en el que `tg` elige un perfil se encuentran en [perfiles en inicios de sesión y sesiones](./sessions.md#profiles).

Los perfiles no son usuarios separados del sistema operativo: un agente con acceso a archivos sin restricciones aún puede acceder a otros datos en esa computadora.

## Cambia a un bot

Coloque `bot` después del nombre del perfil:

```sh
tg support bot api get-me --json
```

Estos comandos necesitan un perfil de bot que ya esté conectado. La cuenta y los derechos del bot provienen de Telegram, no de su cuenta personal. [Un bot de Telegram](./bot.md) explica cómo conectar un bot, con ejemplos.

## Ajustes y acceso

- [Configuración](./configuration.md) explica los valores guardados, las variables de entorno y las opciones.
- [Permisos](./permissions.md) controla lo que puede hacer cada perfil.
- [Inicio de sesión, sesiones y perfiles](./sessions.md) explica cómo iniciar sesión en un perfil.
