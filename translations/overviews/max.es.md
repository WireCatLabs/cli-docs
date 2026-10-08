---
title: "MAX: empieza aquí"
description: "Conecta tu cuenta personal de MAX o un bot a tu agente."
---

`max` es una herramienta de línea de comandos que permite que tu agente de IA lea MAX, encuentre mensajes y te ayude a responder. También
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
max setup
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

Por defecto, la búsqueda por palabras consulta el archivo local y el mensajero (`--backend both`); usa `--backend archive` para consultar solo el archivo. El lenguaje de consulta predeterminado es Lucene estricto; `--language legacy` recupera la coincidencia anterior y la corrección de erratas. Prepara el historial antes de buscar solo en el archivo, contar o clasificar, y comprueba la cobertura antes de considerar que un resultado vacío demuestra que no existe un mensaje. La búsqueda en el servidor de MAX necesita un chat. Los recuentos, las clasificaciones y las consultas que el servidor no admite usan el historial guardado. [Guía de búsqueda](/es/docs/max/search).

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
| Gestionar contactos, alias y notas privadas | [Personas](/es/docs/max/people) |
| Comparar actividad y comprobar pruebas de una clasificación | [Clasificaciones](/es/docs/max/rankings) |
| Enviar, descargar y leer archivos | [Adjuntos](/es/docs/max/attachments) |
| Transcribir notas de voz localmente | [Transcripción de voz](/es/docs/max/audio-recognition) |
| Configurar API opcionales de modelos | [Modelos externos](/es/docs/max/external-models) |
| Limitar lectura, escritura y confirmaciones | [Permisos](/es/docs/max/permissions) |
| Elegir un perfil personal o de bot | [Perfiles y bots](/es/docs/max/profiles) |
| Consultar tipos y prioridad de ajustes | [Referencia de configuración](/es/docs/max/configuration-reference) |

La barra izquierda contiene las guías comunes y las páginas de Telegram y MAX. La derecha muestra las secciones de la página
actual. Empieza con la instalación; usa la referencia detallada cuando tengas una tarea concreta.
