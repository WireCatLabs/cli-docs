---
title: "Seguridad: datos guardados y protección de envíos"
---

`tg` utiliza tu cuenta real de Telegram. Lo que comparte con todas las herramientas de WireCat (el archivo local, la protección de envíos, lo que un agente puede hacer por MCP, el texto ajeno en tu pantalla y cómo informar de una vulnerabilidad) está en la [página de seguridad común](https://wirecat.dev/en/docs/security). Esta página trata solo lo que añade Telegram: dónde se guarda la sesión, los archivos que solo escribe `tg`, con qué servidores se comunica y qué hacer si la sesión se filtra.

## Resumen

- **El archivo de sesión es tu acceso.** Quien pueda leerlo usa tu cuenta, sin contraseña ni código ([más abajo](#where-the-login-lives)).
- **Ningún comando acepta secretos como argumento:** ni el hash de la aplicación, ni la contraseña 2FA, ni el código de acceso, ni un número de teléfono.
- **La protección de envíos es la común:** todos los comandos y herramientas MCP comprueban `permissions`, la lista de destinatarios y `sendsPerHour` ([más abajo](#the-send-guard)).
- **`tg` se comunica con Telegram, npm y my.telegram.org** (a través de tu proxy si configuras uno) y con los servidores de descarga de modelos o los servicios de embeddings y análisis que configures de forma explícita ([más abajo](#what-goes-over-the-network)).
- **No protege frente a alguien que utilice tu usuario del equipo** ni frente a un agente al que se permite cambiar los ajustes.

## Dónde se guarda la sesión

| Contenido | Ubicación | Quién puede usarlo |
|---|---|---|
| sesión | `sessions/<profile>.session` en el directorio de estado, `0600` en carpeta `0700` | cualquiera que lea el archivo: permite acceder como una contraseña |
| sesión de historial del bot | `bots/<profile>/mtproto-<bot-id>.session` en el directorio de estado | quien pueda leerla puede usar esa autorización del bot; protégela como la sesión personal |
| identificador y hash de la aplicación | almacén de claves del sistema; `credentials.json` (`0600`) junto a la configuración si no hay almacén | solo junto con una sesión |
| datos para CI | `TG_API_ID` y `TG_API_HASH` | el proceso que los tenga |
| contraseña del proxy o secreto de MTProxy | almacén de claves del sistema, o `credentials.json`, uno por perfil y otro para `--defaults`; la configuración guarda la URL sin él | cualquiera que pueda usar el proxy con él |

La sesión es la clave de autorización de Telegram. Copiar el archivo copia el acceso, sin contraseña ni código. Trátalo como una contraseña: nunca lo subas al repositorio, adjuntes ni pegues.

**Ningún comando acepta secretos como argumento.** El hash de la aplicación y la contraseña 2FA se solicitan sin mostrarlos; el código y el teléfono se solicitan o se leen por stdin. Un argumento sería visible para todos los procesos mediante `ps` y quedaría en el historial.

**La configuración no admite secretos:** no tiene campos para hash, teléfonos ni sesiones.

## Qué se guarda en disco

El archivo local, la configuración, los registros de ejecución, el registro de envíos, la lista de destinatarios, los modelos de voz y las exportaciones se describen en la [página común](https://wirecat.dev/en/docs/security). El archivo local se comparte con `max`, contiene **el texto completo** de todos los mensajes que `tg` ha leído o enviado y no está cifrado. Además, `tg` escribe:

| Contenido | Ubicación | Datos | Permisos |
|---|---|---|---|
| punto de `inbox --new` | `inbox/<profile>.json` | dónde terminó la última revisión | `0600` |
| descargas en segundo plano | directorio de estado | chat, progreso y resultado | `0600` |
| registro y bloqueo de `serve` | `serve/<profile>.log`, o registro systemd | lo que hizo `serve` | `0600` |
| unidad systemd o agente launchd, solo con `tg server install` | carpeta de unidades del usuario | comando que inicia `serve` | `0644` |
| copia de seguridad, solo con `tg store backup` | archivo indicado | copia del archivo local completo | `0600` |

Consulta las rutas exactas con `tg doctor` y las carpetas de cada sistema en [instalación](./installation.md#where-files-go).

Si pierdes el equipo, cierra la sesión desde otro dispositivo: Telegram → Ajustes → Dispositivos, y termina la creada por `tg`. Así el archivo de sesión deja de servir.

## Protección de envíos

Todos los comandos y herramientas MCP que cambian algo en Telegram pasan por la protección común: `permissions`, la lista de destinatarios, `sendsPerHour` (30 por defecto) y un registro sin texto. Cómo funciona cada control, su código de salida y lo que no puede impedir: la [página común](https://wirecat.dev/en/docs/security).

```sh
tg config set permissions.messages readonly  # no change to messages from this profile
tg config set permissions.messages.send ask  # a question before each send
tg recipients add "Book club"                # the first add turns the list on
tg sends list                                # every attempt: sent, refused, failed, or not known
```

En Telegram cuentan para el límite por hora: mensajes, reenvíos, ediciones, mensajes fijados con notificación, cada mensaje eliminado, grupos nuevos y cada persona añadida. No cuentan reacciones, votos, mensajes fijados sin aviso ni marcar como leído. Los reenvíos se comprueban contra el chat de destino.

`TG_PROFILE_LOCK` fija el perfil allí donde el agente no puede modificar su entorno. `--file` y `--photo` rechazan archivos y carpetas ocultos, `~/.ssh`, carpetas de `tg` y la base de datos local; por MCP no hay excepción.

## Texto ajeno en tu pantalla

Los caracteres de control, los saltos de línea en nombres y los títulos de chat que se parecen entre sí se tratan como describe la [página común](https://wirecat.dev/en/docs/security). Los nombres de archivos descargados pierden también cualquier punto inicial.

## Qué pasa por la red

- **Telegram**, por MTProto para comandos de la cuenta personal, incluidos fotos y archivos. Los comandos de bots usan la Bot API por HTTPS; `bot store fetch` usa una sesión MTProto separada del bot para el historial.
- **npm**, una vez al día en un terminal para comprobar si hay una versión más reciente de `tg`, y al ejecutar `tg upgrade`.
  `updateCheck` o `TG_NO_UPDATE_CHECK=1` desactiva esta comprobación ([configuration.md](./configuration.md)).
- **my.telegram.org**, solo durante `tg setup` o `tg session start`: se abre en tu navegador o, con `--app auto`,
  lo controla `tg`. Una aplicación que `tg` crea allí lleva el título `tg-cli` y usa la página de GitHub de este proyecto como
  dirección.
- **Hugging Face y GitHub**, solo al ejecutar `tg models audio download` o `tg models text download`. La voz nunca se envía allí: el modelo local se ejecuta en este equipo.
- **Los servicios de embeddings configurados** reciben texto de conversaciones de `conversations embed` tras tu consentimiento, y el texto de las consultas de `conversations search` remotas, incluidas las búsquedas por MCP. Los embeddings locales no envían texto.
- **Los servicios de análisis configurados** reciben lotes limitados de mensajes solo con `conversations build --analyze --chat`, tras un consentimiento limitado a la cuenta, el chat y el proveedor; una construcción normal no envía nada.

No hay telemetría.

## Tu aplicación y las condiciones de Telegram

`tg` es un cliente de Telegram, igual que las aplicaciones del teléfono y del ordenador. Inicia sesión con tu propia aplicación de my.telegram.org y sigue las [condiciones de la API de Telegram](https://core.telegram.org/api/terms). El límite por hora está activado por defecto para que el agente envíe a un ritmo similar al de una persona.

## Inicio de sesión

`tg setup` y `tg session start` dibujan el QR en la terminal. Queda en el historial visual, pero Telegram lo renueva mientras esperas, por lo que los antiguos no sirven. `--qr-file` lo guarda como PNG legible solo por ti y elimina el archivo al finalizar, funcione o no.

`--app auto` rellena my.telegram.org sin navegador: solicita el teléfono y el código que el sitio envía por Telegram, nada más.

Cada inicio añade un dispositivo en Telegram → Ajustes → Dispositivos.

## Si se filtra la sesión

1. En Telegram → Ajustes → Dispositivos, termina la sesión creada por `tg`. También puedes ejecutar `tg session end` en este equipo: termina la sesión en Telegram y elimina el archivo.
2. Inicia sesión de nuevo: `tg session start`.

## Siguiente paso

- [Página de seguridad común](https://wirecat.dev/en/docs/security): el archivo local, la protección de envíos, agentes y MCP, e informar de una vulnerabilidad.
- [Diagnóstico](./diagnostics.md): qué se registra exactamente y qué nunca se registra.
- [Sesiones](./sessions.md): aplicación, almacén de claves, perfiles y cierre de sesión.
- [MCP](./mcp.md): permisos del agente y efecto de niveles y opciones.
- [Configuración](./configuration.md): `permissions` y `sendsPerHour`.

## Cambios de la instalación global

El postinstall global de npm instala la skill incluida en los directorios de agentes del usuario; en Windows añade la carpeta de comandos npm al PATH del usuario y elimina solo el lanzador `tg.ps1` generado por npm para este paquete. Conserva el lanzador `.cmd`. Las instalaciones de proyectos y npx no hacen estos cambios. `TG_INSTALL_AGENT=none` omite la skill. El instalador independiente de Windows hace la misma preparación aunque los scripts npm estén desactivados. No cambia la política de ejecución, el PATH del equipo, las credenciales ni el estado de la cuenta. La instalación nunca inicia sesión ni lee chats.
