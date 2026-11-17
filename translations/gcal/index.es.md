---
title: "Google Calendar"
---

Consulta tu semana en todas tus cuentas de Google a la vez y vuelve a encontrar eventos pasados por palabras o por su
significado. Tus calendarios se copian a tu ordenador, así que la búsqueda funciona sin conexión. Las transcripciones
de tus llamadas de Google Meet también se quedan contigo, incluso después de que Google las borre.

Tú o tu agente de IA podéis responder "¿Qué tengo esta semana y qué se solapa?", encontrar un hueco en el que Ana esté
libre y reservarlo, o recordar qué se acordó en la última llamada con ella. Una sola búsqueda encuentra tus reuniones
junto a los chats y las notas que otras herramientas de WireCat guardan en este ordenador.

`gcal` es la herramienta de línea de comandos de WireCat para Google Calendar y Google Meet. Pide a Google solo acceso
de lectura. Cambia eventos solo después de que inicies sesión con `--grant write`, y `--grant meetings` añade tus
llamadas de Meet. Las transcripciones solo existen en cuentas de Google Workspace, y Google solo muestra las llamadas
que organizaste tú. Para empezar necesitas Node.js, como explica la [instalación](./installation.md).

**En esta página:**

1. [Empieza en pocos minutos](#start-in-a-few-minutes)
2. [Úsalo con tu agente](#use-it-with-your-agent)
3. [En qué se diferencia de otras herramientas](#how-it-differs-from-other-tools)

## Empieza en pocos minutos

```sh
npm install -g @wirecat/gcal-cli
gcal personal session start         # sign in to Google in the browser, read-only
gcal personal sync                  # copy your calendars, then only what changed
gcal personal events list           # your events from today on, earliest first
```

`personal` es un nombre que eliges para esta cuenta de Google. Más tarde puedes añadir `work` o cualquier otro. Todos
los pasos, y qué hacer cuando Google rechaza el inicio de sesión: [instalación](./installation.md). Después lee tus
eventos, búscalos y crea otros nuevos: [uso](./usage.md).

## Úsalo con tu agente

Los agentes con terminal, como Claude Code o Codex, ejecutan `gcal` por sí mismos cuando `gcal skill install` les
enseña cómo. Claude Desktop, Cursor y otras aplicaciones con MCP se conectan a `gcal personal mcp serve`. MCP es la
forma estándar en que una aplicación así llama a una herramienta.

Para usarlo desde ChatGPT o Claude en el navegador o en el móvil: [conexión remota](./remote.md).

## En qué se diferencia de otras herramientas

En qué se diferencia `gcal` de otras herramientas de Google Calendar: [comparación](./compare.md).
