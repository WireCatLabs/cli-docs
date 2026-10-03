---
title: "Telegram: empieza aquí"
description: "Conecta tu cuenta de Telegram a un agente o úsala desde la terminal."
---

`tg` permite que tu agente de IA lea Telegram, encuentre mensajes y te ayude a responder. Trabaja
con **tu cuenta personal** y sus chats. También puedes usarlo directamente con comandos en la
terminal. Funciona en Windows, macOS y Linux.

Estás en la documentación de **Telegram**. Usa el selector de mensajero de arriba para abrir MAX.

## Elige cómo empezar

### Conectar desde tu agente

Si usas Codex, Claude Code, Cursor, Gemini CLI o Hermes, abre la
[guía de instalación con un agente](/es/docs/installation#tg). Copia la petición breve: tu agente
instalará la herramienta, te ayudará a iniciar sesión y comprobará la conexión. Tú escaneas el QR
y confirmas el acceso.

Después sigue [la guía de tu agente](/es/docs/agents). Las aplicaciones que necesitan un servidor
MCP tienen una [guía de MCP](/es/docs/mcp).

### Empezar desde la terminal

Abre [la guía de instalación](/es/docs/installation#tg) y elige las instrucciones para terminal.
Tras instalar la herramienta, inicia sesión y consulta algunos chats:

```sh
tg session start --app auto
```

```sh
tg chats list --limit 5
```

El primer acceso necesita una aplicación de Telegram de my.telegram.org. El comando te ayuda a
registrarla y después muestra un código QR. Consulta [acceso y perfiles](/es/docs/tg/sessions)
para conocer los detalles o iniciar sesión con tu número de teléfono.

## Qué probar después de conectar

- **Ponerte al día.** Pregunta qué chats esperan tu respuesta.
- **Recordar acuerdos.** Pregunta qué prometiste esta semana y qué esperas de otras personas.
- **Encontrar un mensaje.** Pide una conversación, fecha, enlace o archivo.
- **Preparar una respuesta.** Da contexto a tu agente y pídele que redacte o envíe un mensaje.

Leer **no marca los mensajes como leídos**. Enviar, eliminar y realizar otros cambios requiere
comandos específicos. Puedes limitar el acceso del agente: consulta [acceso y seguridad](/es/docs/tg/security).

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Leer, buscar y enviar mensajes | [Comandos cotidianos](/es/docs/tg/usage) |
| Iniciar sesión, salir o añadir otra cuenta | [Acceso y perfiles](/es/docs/tg/sessions) |
| Buscar en el historial local y exportar conversaciones | [Archivo de mensajes](/es/docs/tg/archive) |
| Seguir las preguntas y los participantes de un grupo | [Tus grupos](/es/docs/tg/groups) |
| Encontrar una petición preparada para el agente | [Recetas de uso](/es/docs/tg/recipes) |
| Consultar qué admiten los bots de Telegram | [Bots: funciones disponibles](/es/docs/tg/bot) |
| Resolver un error | [Solución de problemas](/es/docs/tg/troubleshooting) |
| Consultar un comando o parámetro concreto | [Referencia de comandos](/es/docs/tg/commands) |

La barra izquierda contiene las páginas de este apartado. La derecha muestra las secciones de
la página abierta. La referencia sirve para consultar opciones concretas; para empezar, basta con la instalación y las tareas cotidianas.
