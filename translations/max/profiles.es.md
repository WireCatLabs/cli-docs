---
title: "Perfiles y bots"
---

**Perfil** es el nombre de un inicio de sesión `max` en esta computadora: una cuenta MAX personal o un bot, con su propia sesión y su propia configuración. Sin nombre, `max` toma el perfil `default`, por lo que con una cuenta no tienes que pensar en perfiles.

Lea esta página si necesita una segunda cuenta, si el agente de IA necesita menos derechos que usted o si desea ejecutar un bot. Al final, sabes cómo elegir un perfil para el comando, cómo configurarlo y cómo cambiar a un bot.

## ¿Qué perfiles dan?

| Necesidad | Cómo |
|---|---|
| Dos cuentas MAX en un ordenador | Iniciar sesión una vez por perfil: `max work session start qr` |
| Dar menos permisos al agente | Perfil con sus [permisos](./permissions.md) |
| Mantener al agente en ese perfil | `MAX_PROFILE_LOCK` ([perfiles y sesiones](./sessions.md#профили)) |
| Usar un bot junto a la cuenta personal | Perfil de bot: `max support bot api get-my-info` |
| Ver todos los perfiles locales | `max account list` |

## Elegir un perfil

Coloque el nombre del perfil delante del comando:

```sh
max work config show
```

`max account list` muestra los perfiles locales y sus cuentas; `max work session end` cierra la sesión MAX del perfil `work`.

La entrada en `profiles.work` en el archivo de configuración es válida para este perfil; `defaults` se utiliza cuando no hay ningún valor. Las reglas para los nombres de los perfiles y el orden en el que `max` selecciona un perfil se encuentran en la sección [perfiles en el inicio de sesión y las sesiones de](./sessions.md#профили).

El perfil no es un usuario de sistema operativo independiente: un agente con acceso completo a los archivos puede acceder a otros datos en esta computadora.

## Cambiar a un bot

Coloque `bot` después del nombre del perfil:

```sh
max support bot api get-my-info --json
```

Estos comandos requieren un perfil de bot ya conectado. Su cuenta y sus derechos los determina MAX, no su cuenta personal. [El bot MAX](./bot.md) explica la conexión y los ejemplos.

## Ajustes y acceso

- [Configuración](./configuration.md) explical archivo, las variables de entorno y las opciones.
- [Permisos](./permissions.md) determinan las acciones de cada perfil.
- [Inicio de sesión, sesiones y perfiles](./sessions.md) explica cómo iniciar sesión en un perfil.
