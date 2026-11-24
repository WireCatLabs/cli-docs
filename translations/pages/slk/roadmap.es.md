---
title: "Hoja de ruta"
---

Esta página recoge lo que `slk` hace hoy y lo que todavía no hace. Léela antes de buscar un rodeo para una función
que falta. No hay fechas. Para pedir algo, abre una [issue en GitHub](https://github.com/WireCatLabs/slack-cli/issues).

## Lo que funciona hoy

`slk` inicia sesión con el User OAuth Token de una app de Slack que creas en tu propio espacio de trabajo, y lee Slack
como tú. Con tu agente ves tus canales, mensajes directos y grupales, lees un hilo entero, ves lo no leído con
`inbox` y encuentras mensajes con la búsqueda de Slack y con la copia que guardas en tu ordenador. Envía, edita,
reacciona y sube archivos cuando se lo pides, dentro de los permisos que configuras. Cada método de la Slack Web API
es un comando del grupo `api`, por la línea de comandos o por MCP. Mira [por dónde empezar](./index.md).

## Lo que todavía no hace

- Las respuestas dentro de hilos y las menciones a un grupo de usuarios en `inbox`. Hoy la bandeja lee los mensajes
  más recientes de cada chat, no las respuestas debajo de ellos.
- Contadores de no leídos en `chats list`. Hoy los da `inbox`.
- Iniciar sesión desde el navegador. Hoy inicias sesión con el token de tu propia app de Slack.
- Las llamadas huddle de Slack y sus notas.

Lo que cambió en cada versión publicada está en el [registro de cambios](./changelog.md).
