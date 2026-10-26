---
title: "WhatsApp"
---

`wa` conecta tu propia cuenta de WhatsApp al terminal y a tu agente de IA (por ejemplo, Claude Code, Codex, Cursor o Gemini CLI). Úsalo si quieres leer, buscar y responder tus chats sin abrir WhatsApp, o entregar ese trabajo a un agente dentro de los límites que establezcas. Se vincula a tu cuenta como un dispositivo, como lo hace WhatsApp Web.

Aquí verás qué puede hacer `wa`, cómo comenzar en unos cinco minutos y qué página responde a qué pregunta.

En cada página aparecen tres términos:

- **Terminal** (línea de comando): la ventana donde escribes comandos, como Terminal en macOS o PowerShell en Windows. `wa` es un comando que escribes allí.
- **Agente de IA**: un programa que realiza tareas por ti y puede ejecutar comandos, como Claude Code o Codex. Utiliza `wa` para ti.
- **Skill**: un breve archivo de instrucciones que indica a tu agente cómo usar `wa`. El programa de instalación lo instala.

## Qué puede hacer

| Quieres | Dónde |
|---|---|
| Leer tus chats y los mensajes no leídos de otras personas; nada está marcado como leído a menos que lo pidas | [Usando wa](./usage.md) |
| Encuentra lo dicho, por palabras, personas, fechas o etiquetas | [Buscar](./search.md) |
| Guarda una copia de tus mensajes en esta computadora y búsquelos o expórtelos | [El almacén local](./archive.md) |
| Envía, guarda y reenvía fotografías y archivos, y escuche notas de voz como texto | [Archivos adjuntos](./attachments.md) |
| Responde, edita, reacciona y elimina, tú mismo o mediante un agente, y elimina para todos tú mismo, dentro de tus límites | [Usando wa](./usage.md), [Permisos](./permissions.md) |
| Silencia, archiva, fija o elimina un chat y destaca un mensaje en tus propios dispositivos; establece tu nombre y privacidad | [Usando wa](./usage.md) |
| Mira qué preguntas nadie respondió en tus grupos | [Grupos](./groups.md) |
| Usa WhatsApp desde una app sin terminal, o desde un chat en el navegador | [El servidor MCP](./mcp.md), [Desde el navegador](./remote.md) |

Cada comando hace una cosa, da la misma forma de respuesta cada vez y tiene un código de salida fijo para cada tipo de falla. Es por eso que los scripts y los agentes pueden confiar en él.

`wa` sigue en desarrollo: lo que viene después está en la [hoja de ruta](./roadmap.md).

## Empezar

```sh
npm install -g @wirecat/whatsapp-cli
wa personal setup                      # link by QR code, check five chats, install the agent skill
wa personal server install             # keep receiving in the background
wa personal inbox                      # other people's unread messages; nothing is marked read
```

Espere unos cinco minutos para la configuración: tu teléfono envía tus chats recientes una vez, justo después de vincularlos. Los mensajes más antiguos de un chat se pueden solicitar al teléfono más tarde, 50 a la vez ([historial anterior](./archive.md#older-history-from-your-phone)). Para elegir el agente que obtiene el skill, agregue `--agent` con `codex`, `cursor`, `claude`, `gemini` o `all`. `wa setup --help` muestra las opciones de vinculación.

`wa` necesita el Nodo 22.16 o posterior ([instalación](./installation.md)). Cómo funciona la vinculación y por qué solo se puede conectar un comando `wa` a la vez: [vinculación, dispositivos y perfiles](./sessions.md).

## Adónde ir a continuación

| Página | Respuestas |
|---|---|
| [Instalación](./installation.md) | ¿Qué necesita y cómo lo instalo? |
| [Usando wa](./usage.md) | ¿Cómo leo, envío y cambio un mensaje? |
| [Vinculación, dispositivos y perfiles](./sessions.md) | ¿Cómo funciona la vinculación, dónde están las claves, cómo funcionan los perfiles? |
| [El almacén local](./archive.md) | ¿Qué guarda el almacén local y cómo la mantengo actualizada, la exporto y hago una copia de seguridad? |
| [Archivos adjuntos](./attachments.md) | ¿Cómo envío, guardo, reenvío y leo archivos, y escucho una nota de voz como texto? |
| [Buscar](./search.md) | ¿Cómo encuentro un mensaje por sus palabras, remitente, chat, fecha o etiqueta? |
| [El servidor MCP](./mcp.md) | ¿Cómo conecto Claude Desktop, Cursor u otro cliente sin terminal? |
| [Recetas](./recipes.md) | ¿Qué puede hacer un agente por mí todos los días y cómo lo ejecuto según un cronograma? |
| [Todos los comandos](./commands.md) | Cada comando, opción y código de salida |
| [Configuración](./configuration.md) | ¿Qué puedo configurar y qué valor gana? |
| [Diagnóstico](./diagnostics.md) | ¿Qué hizo una orden y qué nunca se registra? |
| [Solución de problemas](./troubleshooting.md) | Algo no funciona: qué dice la pantalla y qué hacer |
| [Seguridad](./security.md) | ¿Qué guarda `wa` en mi computadora y qué puede salir mal? |
| [Hoja de ruta](./roadmap.md) | ¿Qué viene después? |
