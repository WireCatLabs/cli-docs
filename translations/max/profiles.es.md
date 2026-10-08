---
title: "Perfiles y bots"
---

Un perfil da un nombre y ajustes propios a una cuenta o un bot. Usa perfiles para varias cuentas, para dar permisos distintos a los asistentes o para trabajar con un bot.

## Elegir un perfil

Pon el nombre del perfil antes del comando:

```sh
max work config show
```

Si no indicas un nombre, se utiliza el perfil predeterminado. Los ajustes de `profiles.work` se aplican a ese perfil; `defaults` se aplica cuando el perfil no tiene un valor propio. Un perfil no es un usuario independiente del sistema operativo: dar al asistente acceso completo a los archivos también puede darle acceso a otros datos.

## Cambiar a un bot

Pon `bot` después del nombre del perfil:

```sh
max support bot api get-my-info --json
```

Estos comandos requieren un perfil de bot ya conectado. El mensajero determina la cuenta y los permisos del bot, independientemente de tu cuenta personal. [Bots](./bot.md) explica la conexión y ofrece ejemplos.

## Ajustes y acceso

[Configuración](./configuration.md) explica el archivo, las variables de entorno y las opciones. [Permisos](./permissions.md) define qué puede hacer cada perfil. Para iniciar sesión, sigue la [guía de inicio de sesión](./sessions.md).
