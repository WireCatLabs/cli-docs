---
title: "Perfiles"
---

Un **perfil** es el nombre de un dispositivo vinculado de `wa` en esta computadora: una cuenta de WhatsApp, con sus propias claves y su propia configuración. `wa` nunca elige uno por ti: un comando que usa una cuenta nombra tu perfil como la primera palabra (`wa personal chats list`) o mediante `WA_PROFILE`, siempre, incluso con una sola cuenta.

Lee esta página si quieres una segunda cuenta o que tu agente de IA tenga menos permisos que tú. Al terminar, sabrás cómo elegir un perfil para un comando y cómo darle su propia configuración.

## Qué puedes hacer con perfiles

| Quieres | Cómo |
|---|---|
| Usa dos cuentas de WhatsApp en una computadora | Vincula una vez por perfil: `wa work session start` |
| Dale a tu agente menos derechos de los que tienes | Un perfil con sus propios [permisos](./permissions.md) |
| Mantén un agente en ese perfil | `WA_PROFILE_LOCK` ([perfiles en vinculación](./sessions.md#profiles)) |
| Ver todos los perfiles en esta computadora | `wa account list` |

## Elige un perfil

Pon el nombre del perfil antes del comando:

```sh
wa work config show
```

`wa account list` muestra todos los perfiles en esta computadora y la cuenta a la que está vinculado cada uno; `wa work session end` desvincula el perfil `work`.

Una configuración en `profiles.work` en el archivo de configuración se aplica a ese perfil; los valores bajo `defaults` se aplican cuando no tiene valor propio. Las reglas para los nombres de los perfiles y el orden en el que `wa` elige un perfil se encuentran en [perfiles en la vinculación](./sessions.md#profiles).

Cada perfil es un dispositivo propio en la lista de dispositivos vinculados del teléfono, con su propia conexión ([una conexión por dispositivo](./sessions.md#one-connection-per-device)).

Los perfiles no son usuarios separados del sistema operativo: un agente con acceso a archivos sin restricciones aún puede acceder a otros datos en esa computadora.

## Configuración y acceso

- [Configuración](./configuration.md) explica los valores guardados, las variables de entorno y las opciones.
- [Permisos](./permissions.md) controla lo que puede hacer cada perfil.
- [Vinculación, dispositivos y perfiles](./sessions.md) explica cómo vincular un perfil.
