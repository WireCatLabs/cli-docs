---
title: "Bots y Bot API"
description: "Conecta un bot para respuestas, informes y tareas de grupos."
---

Un bot tiene su propio nombre, cuenta y chats. Puede publicar informes, responder solicitudes
o ayudar a gestionar un grupo. Sin `bot`, los comandos usan tu cuenta personal.

## Conectar un bot

Crea un bot de Telegram con [BotFather](https://t.me/BotFather) o sigue las
[instrucciones de MAX](https://business.max.ru/self). Guarda el token con entrada oculta:

```sh
tg support bot auth set
max support bot auth set
```

`support` es el nombre que eliges para el perfil. Conecta solo el mensajero que uses.
No pongas el token en comandos, capturas ni chats. Comprueba el bot conectado:

```sh
tg support bot me
max support bot me
```

## Elegir un chat

Añade el bot al grupo o canal, o inicia una conversación desde tu cuenta personal.
El bot solo accede a chats y mensajes permitidos por el mensajero, no a tu historial personal.
En Telegram, la persona debe iniciar la conversación antes de recibir mensajes del bot.

El identificador llega en actualizaciones recibidas o un chat que consultas explícitamente.
Las guías de [Telegram](./tg/bot.md) y [MAX](./max/bot.md) explican cómo encontrarlo.
Usa el título guardado en comandos posteriores cuando esté disponible.

## Enviar una respuesta o informe

```sh
tg support bot messages send "Equipo" "El informe está listo"
max support bot messages send "Equipo" "El informe está listo"
```

Sustituye chat y texto por el mensaje deseado. Es un envío real desde el bot.
También puedes enviar archivos, responder mensajes y gestionar chats si tiene los derechos necesarios.
No concedas derechos de administrador para acciones que no los requieren.

## Automatizar con cuidado

Un asistente puede preparar borradores e informes o usar el bot en un proceso.
Dale los [permisos](./permissions.md) necesarios y decide sus destinatarios.
Revisa los mensajes importantes antes de enviarlos. Webhooks y consultas de actualizaciones
alimentan otras aplicaciones; cambiarlos puede interrumpir una integración existente.

MCP ofrece herramientas comunes para bots. Un asistente con terminal también puede usar el CLI.
Consulta [cómo conectar un asistente](./mcp.md).

## Una acción que no aparece entre los comandos habituales

La interfaz nativa Bot API expone los métodos definidos por el mensajero. Empieza con ayuda:

```sh
tg support bot api --help
max support bot api --help
tg support bot api get-me --json
max support bot api get-my-info --json
```

Elige un método y usa `--help` para sus campos y ejemplos. Telegram y MAX usan nombres y
entradas distintos. JSON y formatos de respuesta son para integraciones; consulta la guía del bot.

[API oficial Telegram](https://core.telegram.org/bots/api) · [MAX](https://dev.max.ru/docs-api)
