---
title: "Seguridad: datos guardados y protección de envíos"
---

Lea esta página antes de darle acceso a un agente de IA o un script a su cuenta de Telegram a través de `tg`, o cuando quiera saber qué guarda `tg` en su computadora. Explica dónde se guarda su inicio de sesión, qué escribe `tg` en el disco, con qué servidores habla, qué detiene un envío no deseado y qué hacer si se filtra su inicio de sesión. Al final podrás juzgar lo que podría hacer alguien con acceso a esta computadora, o un agente con acceso a `tg`.

Palabras que utiliza esta página:

- **Sesión**: el archivo que te mantiene conectado a Telegram. Quien la tenga podrá utilizar su cuenta.
- **Archivo local**: la base de datos de tu ordenador donde `tg` y `max` guardan los mensajes que han leído. Es compartido por ambas herramientas y no está cifrado.
- **Control de envío**: las comprobaciones por las que pasa cada cambio antes de llegar a Telegram: permisos, la lista de destinatarios permitidos y el límite de envío por hora.

Lo que cada herramienta WireCat tiene en común (el archivo local, el control de envío, lo que un agente puede hacer a través de MCP, el texto de otras personas en su pantalla, cómo informar una vulnerabilidad) se encuentra en la [página de seguridad compartida](https://wirecat.dev/en/docs/security). Esta página cubre lo que solo agrega Telegram.

## Resumen

- **El archivo de sesión es tu acceso.** Quien pueda leerlo usa tu cuenta, sin contraseña ni código ([más abajo](#where-the-login-lives)).
- **Ningún comando acepta secretos como argumento:** ni el hash de la aplicación, ni la contraseña 2FA, ni el código de inicio de sesión, ni un número de teléfono.
- **La protección de envíos es la común:** todos los comandos y herramientas MCP comprueban `permissions`, la lista de destinatarios y `sendsPerHour` ([más abajo](#the-send-guard)).
- **`tg` se comunica con Telegram, npm y my.telegram.org** (a través de tu proxy si configuras uno) y con los servidores de descarga de modelos o los servicios de embeddings y análisis que configures de forma explícita ([más abajo](#what-goes-over-the-network)).
- **No protege frente a alguien que utilice tu usuario del equipo** ni frente a un agente al que se permite cambiar los ajustes.

## Dónde se guarda la sesión

| Contenido | Ubicación | Quién puede usarlo |
|---|---|---|
| sesión | `sessions/<profile>.session` en el directorio de estado, `0600` en carpeta `0700` | cualquiera que leal archivo: permite acceder como una contraseña |
| sesión de historial del bot | `bots/<profile>/mtproto-<bot-id>.session` en el directorio de estado | quien pueda leerla puede usar esa autorización del bot; protégela como la sesión personal |
| identificador y hash de la aplicación | llavero del sistema; `credentials.json` (`0600`) junto a la configuración si no hay almacén | solo junto con una sesión |
| datos para CI | `TG_API_ID` y `TG_API_HASH` | el proceso que los tenga |
| contraseña del proxy o secreto de MTProxy | llavero del sistema, o `credentials.json`, uno por perfil y otro para `--defaults`; la configuración guarda la URL sin él | cualquiera que pueda usar el proxy con él |

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

Las rutas exactas en esta máquina: `tg doctor`. Las carpetas de cada sistema: [dónde van los archivos](./installation.md#where-files-go).

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

- **Telegram**, a través de MTProto para comandos de cuentas personales, incluidos archivos y fotos. Los comandos de bot utilizan la API de bot HTTPS; `bot store fetch` utiliza una sesión de bot MTProto separada para el historial.
- **npm**, una vez al día en una terminal, para ver si existe un `tg` más nuevo y en `tg upgrade`.   `updateCheck` o `TG_NO_UPDATE_CHECK=1` lo apaga ([configuración](./configuration.md)).
- **my.telegram.org**, solo durante `tg setup` o `tg session start`: abierto en su navegador, o, con `--app auto`, controlado por `tg`. Una aplicación que `tg` crea allí se titula `tg-cli` y tiene la página GitHub de este proyecto como dirección.
- **Hugging Face y GitHub**, solo cuando ejecutas `tg models audio download` o `tg models text download`. Un mensaje de voz nunca llega allí: en esta máquina se ejecuta un modelo local.
- **Los endpoints de embeddings configurados** reciben texto de conversación de `conversations embed` después del consentimiento y consulta de texto de `search conversations` remoto, incluidas las búsquedas de MCP. Las incrustaciones locales no envían ningún texto.
- **Los puntos finales de análisis configurados** reciben lotes de mensajes limitados solo con `conversations build --analyze --chat`, después del consentimiento limitado a la cuenta, el chat y el proveedor; La construcción ordinaria no envía nada.

No hay telemetría.

## Tu aplicación y las condiciones de Telegram

`tg` es un cliente de Telegram, igual que las aplicaciones del teléfono y del ordenador. Inicia sesión con tu propia aplicación de my.telegram.org y sigue las [condiciones de la API de Telegram](https://core.telegram.org/api/terms). El límite por hora está activado por defecto para que el agente envíe a un ritmo similar al de una persona.

## Inicio de sesión

`tg setup` y `tg session start` dibujan el QR en la terminal. Queda en el historial visual, pero Telegram lo renueva mientras esperas, por lo que los antiguos no sirven. `--qr-file` lo guarda como PNG legible solo por ti y eliminal archivo al finalizar, funcione o no.

`--app auto` rellena my.telegram.org sin navegador: solicita el teléfono y el código que el sitio envía por Telegram, nada más.

Cada inicio añade un dispositivo en Telegram → Ajustes → Dispositivos.

## Cambios de la instalación global

El postinstall global de npm instala la skill incluida en los directorios de agentes del usuario; en Windows añade la carpeta de comandos npm al PATH del usuario y elimina solo el lanzador `tg.ps1` generado por npm para este paquete. Conserva el lanzador `.cmd`. Las instalaciones de proyectos y npx no hacen estos cambios. `TG_INSTALL_AGENT=none` omite la skill. El instalador independiente de Windows hace la misma preparación aunque los scripts npm estén desactivados. No cambia la política de ejecución, el PATH del equipo, las credenciales ni el estado de la cuenta. La instalación nunca inicia sesión ni lee chats.

## Si se filtra la sesión

1. En Telegram → Ajustes → Dispositivos, termina la sesión creada por `tg`. También puedes ejecutar `tg session end` en este equipo: termina la sesión en Telegram y eliminal archivo.
2. Inicia sesión de nuevo: `tg session start`.

## Siguiente paso

- [Página de seguridad compartida](https://wirecat.dev/en/docs/security): el archivo local, el guardia, agentes y MCP, reportando una vulnerabilidad
- [Diagnóstico](./diagnostics.md): qué se registra exactamente y qué nunca se registra
- [Inicio de sesión, sesiones y perfiles](./sessions.md): la aplicación, el llavero, perfiles, cerrar sesión
- [MCP](./mcp.md): qué puede hacer un agente a través de MCP y qué cambia en cada nivel y bandera
- [Permisos](./permissions.md): cómo configurar `permissions` y `sendsPerHour`
