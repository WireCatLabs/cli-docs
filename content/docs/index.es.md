---
title: "Primeros pasos"
description: "Conecta tu asistente de IA a las conversaciones de Telegram o MAX: encuentra acuerdos, revisa mensajes sin leer y prepara respuestas."
---

Dale a tu asistente de IA acceso a tus **conversaciones de Telegram o MAX**. Podrá encontrar mensajes y acuerdos, resumir chats sin leer y ayudarte con las respuestas.

Instalaremos en tu ordenador un pequeño programa para el mensajero elegido, conectaremos tu cuenta y le enseñaremos al agente a usarlo. Después podrás pedirle tareas con tus propias palabras.

## Por dónde empezar

Abre un agente que pueda ejecutar programas en tu ordenador, como Codex, Claude Code, Cursor, Gemini CLI o Hermes. Ten cerca el teléfono con la cuenta del mensajero que quieres conectar.

1. **Instala el programa de tu mensajero.** Abre [Instalación](./installation.mdx), elige Telegram o MAX y copia el prompt preparado a tu agente. Comprobará el ordenador y te ayudará a instalarlo.
2. **Confirma el acceso a tu cuenta.** El agente te guía por los pasos; tú introduces el código o confirmas desde el teléfono. En la primera conexión a Telegram también hay que registrar el programa; el agente te ayudará. Detalles: [acceso a Telegram](./tg/sessions.md) y [acceso a MAX](./max/sessions.md).
3. **Dale al agente las instrucciones para trabajar con las conversaciones.** La configuración ofrece conectarlas a tu agente. Para comprobar la conexión o elegir otro agente, consulta [Conectar tu agente](./agents.md).

Reserva unos cinco minutos para la configuración. No hace falta descargar todo el historial de inmediato: después de iniciar sesión, elige los chats y cuántos mensajes necesitas.

## Tu primera petición

Una vez conectado, copia esto a tu agente:

```text prompt
Revisa los mensajes sin leer por chat. Destaca las preguntas que debería responder y resume brevemente lo importante.
```

Después prueba una tarea concreta:

- Encontrar el plazo que acordaste con un compañero.
- Reunir el contexto de una conversación antes de una llamada.
- Preparar un borrador de respuesta a un cliente.

[Primeras tareas](./first-tasks.md) incluye ejemplos listos para usar. [Cómo formular peticiones](./prompting.md) te ayuda a indicar los chats, el periodo y el resultado que necesitas.

## Elige tu mensajero

| Mensajero | Con qué puedes trabajar | Guía |
|---|---|---|
| Telegram | Conversaciones de tu cuenta personal, mensajes sin leer y búsqueda en el historial | [Empezar con Telegram](./tg/index.md) |
| MAX | Conversaciones de tu cuenta personal, bots y gestión de grupos | [Empezar con MAX](./max/index.md) |

Puedes conectar ambos mensajeros. Para cada uno, instala su programa e inicia sesión en la cuenta que quieras usar.

## Qué instalamos

El programa para Telegram se llama `tg`; el de MAX, `max`. Se ejecuta en tu ordenador y obtiene los mensajes que el agente solicita para tu tarea.

Más adelante encontrarás tres términos en la documentación:

- **CLI** es un programa que se ejecuta con comandos de texto. El agente puede ejecutarlos por ti; no necesitas aprenderlos para empezar.
- **Skill** es un archivo de instrucciones que enseña al agente a usar el programa y sus comandos.
- **MCP** conecta el programa a un agente que no ejecuta comandos directamente, como Claude Desktop. Para ese caso, usa la [guía de conexión por MCP](./mcp.md).

Leer mensajes no los marca como leídos. Enviar una respuesta o modificar un mensaje es una acción aparte que le pides al agente.

## Comparte la documentación con tu agente

Normalmente, el skill instalado basta para empezar. Para compartir las instrucciones de una tarea concreta, abre su página y pulsa **Copiar Markdown** para darle el texto al agente.

El índice completo está en [wirecat.dev/llms.txt](/llms.txt). [MCP y documentación](./mcp.md#documentación-para-tu-agente) explica todas las opciones.
