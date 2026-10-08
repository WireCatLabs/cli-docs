---
title: "Perfiles y bots"
---

Un perfil da un nombre y ajustes propios a una cuenta o un bot. Úsalo si tienes más de una
cuenta, quieres permisos separados para el asistente o trabajas con un bot.

## Elige un perfil

Pon el perfil antes del comando:

```sh
tg work config show
```

`tg account list` muestra todos los perfiles de este ordenador y la cuenta de cada uno; `tg <profile> session end` cierra la sesión de uno.

Sin un nombre, las herramientas usan el perfil predeterminado. Un ajuste en `profiles.work` se aplica a
ese perfil; los valores de `defaults` se usan cuando no tiene uno propio.
Los perfiles no son usuarios independientes del sistema operativo: un asistente con acceso a archivos sin restricciones
puede acceder a otros datos de ese ordenador.

## Cambia a un bot

Usa `bot` después del nombre del perfil:

```sh
tg support bot api get-me --json
```

Estos comandos requieren un perfil de bot ya conectado. La cuenta y los derechos del bot dependen
del servicio de mensajería, no de tu cuenta personal. [Bots](./bot.md) explica la configuración y ofrece ejemplos.

## Ajustes y acceso

[Configuración](./configuration.md) explica los valores guardados, las variables de entorno y las opciones.
[Permisos](./permissions.md) controla lo que puede hacer cada perfil.
Para iniciar sesión, usa la guía de [inicio de sesión](./sessions.md).
