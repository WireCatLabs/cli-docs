---
title: "MAX: empieza aquí"
description: "Conecta tu cuenta personal de MAX o un bot a tu agente."
---

`max` permite que tu agente de IA lea MAX, encuentre mensajes y te ayude a responder. También
puedes usarlo directamente desde la terminal. Funciona en Windows, macOS y Linux.

Estás en la documentación de **MAX**. Usa el selector de mensajero de arriba para abrir Telegram.

**En esta página**

- [Elige qué conectar](#elige-qué-conectar)
- [Empieza con tu cuenta personal](#empieza-con-tu-cuenta-personal)
- [Qué probar después de conectar](#qué-probar-después-de-conectar)
- [Encuentra la guía para tu tarea](#encuentra-la-guía-para-tu-tarea)

## Elige qué conectar

- **Cuenta personal:** tus chats, historial y contactos, como en otro dispositivo. Empieza con
  [la instalación y el acceso](/es/docs/installation#max).
- **Bot:** mensajes y acciones en nombre del bot, usando su token. Abre
  [la guía de bots](/es/docs/max/bot).

Son conexiones distintas. Los bots usan la API oficial de MAX; las cuentas personales usan una
API interna que puede cambiar sin aviso. Consulta [seguridad](/es/docs/max/security) para conocer
las limitaciones y cómo se guardan las credenciales.

## Empieza con tu cuenta personal

### Conectar desde tu agente

Abre [la instalación con un agente](/es/docs/installation#max) y copia la petición breve. Tu
agente instalará la herramienta, te ayudará a iniciar sesión y comprobará la conexión. Tú escaneas el QR.

Después sigue [la guía de tu agente](/es/docs/agents): Codex, Claude Code, Cursor, Gemini CLI o
Hermes. Las aplicaciones que usan MCP tienen una [guía de MCP](/es/docs/mcp).

### Empezar desde la terminal

Abre [la guía de instalación](/es/docs/installation#max) y elige las instrucciones para terminal.
Tras instalar la herramienta, configura la cuenta y consulta algunos chats:

```sh
max setup --agent all
```

```sh
max chats list --limit 5
```

`setup` guía el acceso con QR e instala los skills de los agentes. Reutiliza la sesión al repetirlo; no descarga todo el historial.

Consulta [acceso y perfiles](/es/docs/max/sessions) para otros métodos de acceso y cuentas adicionales.

## Qué probar después de conectar

Pide a tu agente que revise los mensajes pendientes, encuentre un mensaje, recuerde acuerdos o
prepare una respuesta. La búsqueda usa Lucene estricto por defecto; `--language legacy` conserva la búsqueda anterior con correcciones. Leer **no marca los mensajes como leídos**. Enviar, eliminar y realizar
otros cambios requiere comandos específicos; puedes limitar el acceso del agente.

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Leer, buscar y enviar mensajes en tu nombre | [Comandos cotidianos](/es/docs/max/usage) |
| Iniciar sesión, salir o añadir otra cuenta | [Acceso y perfiles](/es/docs/max/sessions) |
| Conectar un bot, enviar mensajes y añadir botones | [Bots](/es/docs/max/bot) |
| Seguir preguntas pendientes y moderar un grupo | [Tus grupos](/es/docs/max/groups) |
| Buscar mensajes con campos, fechas y filtros | [Búsqueda](/es/docs/max/search) |
| Buscar en el historial local y exportar conversaciones | [Archivo de mensajes](/es/docs/max/archive) |
| Encontrar una petición preparada para el agente | [Recetas de uso](/es/docs/max/recipes) |
| Resolver un error | [Solución de problemas](/es/docs/max/troubleshooting) |
| Consultar un comando o parámetro concreto | [Referencia de comandos](/es/docs/max/commands) |

La barra izquierda contiene las guías comunes y las páginas de Telegram y MAX. La derecha muestra las secciones de la página
actual. Empieza con la instalación; usa la referencia detallada cuando tengas una tarea concreta.
