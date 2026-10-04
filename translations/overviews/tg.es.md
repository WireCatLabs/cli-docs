---
title: "Telegram: empieza aquí"
description: "Conecta tu cuenta de Telegram a un agente o úsala desde la terminal."
---

`tg` permite que tu agente de IA lea Telegram, encuentre mensajes y te ayude a responder. Trabaja
con **tu cuenta personal** y sus chats. También puedes usarlo directamente con comandos en la
terminal. Funciona en Windows, macOS y Linux.

Estás en la documentación de **Telegram**. En la barra izquierda tienes las guías de inicio y las secciones Telegram y MAX; abre MAX para consultar el otro mensajero.

**En esta página**

- [Elige cómo empezar](#elige-cómo-empezar)
- [Qué probar después de conectar](#qué-probar-después-de-conectar)
- [Encuentra la guía para tu tarea](#encuentra-la-guía-para-tu-tarea)

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
Tras instalar la herramienta, ejecuta la configuración guiada y consulta algunos chats:

```sh
tg setup
```

```sh
tg chats list --limit 5
```

Reserva unos cinco minutos. Primero el comando pide el número y un código recibido en Telegram para obtener `api_id` y `api_hash` de [my.telegram.org](https://my.telegram.org/apps). Después muestra el QR para acceder a la cuenta. En el teléfono, abre Telegram → Ajustes → Dispositivos → Vincular dispositivo de escritorio y escanéalo. Setup comprueba los primeros cinco chats e instala las skills. Si ya tienes una sesión válida, la reutiliza. Espera a que termine antes de listar chats. [Pasos completos de acceso](/es/docs/tg/sessions).

> **¿Qué es una aplicación Telegram y para qué sirve?**
>
> Es el registro del programa que se conecta a Telegram, aquí el CLI `tg`. Rellenas un formulario sin desarrollar ni descargar otra aplicación. Telegram entrega `api_id` y `api_hash` para identificar el programa; el QR o código confirma después el acceso a tu cuenta. El comando puede registrar u obtener estas credenciales. [Explicación y método manual](/es/docs/tg/sessions#the-app-from-mytelegramorg).

El archivo local contiene solo lo que hayas leído o descargado; no incluye automáticamente todo tu historial. La búsqueda consulta ese archivo. Para un periodo concreto, elige chat y cantidad siguiendo la [guía del archivo](/es/docs/tg/archive).

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
| Buscar palabras, frases o mensajes de varias cuentas | [Búsqueda de mensajes](/es/docs/tg/search) |
| Descargar historial y exportar conversaciones | [Archivo de mensajes](/es/docs/tg/archive) |
| Seguir las preguntas y los participantes de un grupo | [Tus grupos](/es/docs/tg/groups) |
| Encontrar una petición preparada para el agente | [Recetas de uso](/es/docs/tg/recipes) |
| Consultar qué admiten los bots de Telegram | [Bots: funciones disponibles](/es/docs/tg/bot) |
| Resolver un error | [Solución de problemas](/es/docs/tg/troubleshooting) |
| Consultar un comando o parámetro concreto | [Referencia de comandos](/es/docs/tg/commands) |

La barra izquierda contiene las páginas de este apartado. La derecha muestra las secciones de
la página abierta. La referencia sirve para consultar opciones concretas; para empezar, basta con la instalación y las tareas cotidianas.
