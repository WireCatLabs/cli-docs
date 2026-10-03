---
title: "Seguridad: datos guardados y protección de envíos"
---

`tg` utiliza tu cuenta real de Telegram. Esta página explica qué guarda en el equipo, qué nunca guarda y qué controles separan a un agente de un mensaje a una persona real.

## Resumen

Protege frente a:

- **Un agente inducido a enviar por un mensaje que ha leído.** Los `permissions` del perfil determinan sus acciones: `ask` muestra un formulario antes del cambio y `--confirm-send` antes de todos los cambios. Una aprobación solo vale una vez, durante cinco minutos y para el chat y texto mostrados ([MCP](./mcp.md#a-confirmation-form-from-the-server-itself)). Cada herramienta de lectura indica al modelo que el texto de los mensajes son datos, nunca instrucciones.
- **Un cambio no permitido por el perfil.** Todos los comandos y herramientas MCP comprueban `permissions`, destinatarios permitidos y límite por hora. Registran cada intento sin su texto ([más abajo](#the-send-guard)).
- **Un agente que cambia de perfil o envía tus claves.** `TG_PROFILE_LOCK` fija el perfil; `--file` rechaza archivos ocultos, `~/.ssh` y las carpetas de `tg`.
- **Texto ajeno que manipula tu terminal.** Los caracteres de control e invisibles se muestran como texto, los nombres ocupan una sola línea y el autocompletado solo inserta identificadores ([más abajo](#other-peoples-text-on-your-screen)).
- **Secretos en registros:** ejecuciones, informes y registro de envíos contienen identificadores y cantidades, nunca texto.
- **Secretos en `ps` o en el historial de la terminal:** ningún comando admite contraseñas, códigos ni teléfonos como argumento.
- **Otros usuarios del equipo.** Los archivos se crean para que solo tú puedas leerlos, dentro de carpetas a las que solo tú puedes acceder ([más abajo](#what-reaches-the-disk)).
- **Una publicación manipulada.** El paquete se publica desde GitHub Actions mediante la publicación de confianza de npm; el paso de publicación no instala nada ni ejecuta scripts del paquete, y las dependencias directas tienen versiones exactas.

No protege frente a:

- **Alguien que utilice tu usuario del equipo.** Puede leer la sesión y el archivo local igual que tú.
- **Un agente capaz de cambiar ajustes.** Los controles leen `config.json` y la lista de destinatarios. Si puede ejecutar `tg config set` o `tg recipients add`, o editar esos archivos, puede retirar los límites. Excluye esos comandos de lo que puede ejecutar ([más abajo](#what-the-guard-cannot-hold)).

## Dónde se guarda la sesión

| Contenido | Ubicación | Quién puede usarlo |
|---|---|---|
| sesión | `sessions/<profile>.session` en el directorio de estado, `0600` en carpeta `0700` | cualquiera que lea el archivo: permite acceder como una contraseña |
| identificador y hash de la aplicación | almacén de claves del sistema; `credentials.json` (`0600`) junto a la configuración si no hay almacén | solo junto con una sesión |
| datos para CI | `TG_API_ID` y `TG_API_HASH` | el proceso que los tenga |

La sesión es la clave de autorización de Telegram. Copiar el archivo copia el acceso, sin contraseña ni código. Trátalo como una contraseña: nunca lo subas al repositorio, adjuntes ni pegues.

**Ningún comando acepta secretos como argumento.** El hash de la aplicación y la contraseña 2FA se solicitan sin mostrarlos; el código y el teléfono se solicitan o se leen por stdin. Un argumento sería visible para todos los procesos mediante `ps` y quedaría en el historial.

**La configuración no admite secretos:** no tiene campos para hash, teléfonos ni sesiones.

## Qué se guarda en disco

| Contenido | Ubicación | Datos | Permisos |
|---|---|---|---|
| archivo local | `~/.local/share/cli-messaging/messages.db` | **texto completo** de todos los mensajes leídos o enviados por `tg`, títulos, nombres y transcripciones | `0600`, carpeta `0700` |
| configuración | `config.json` | solo ajustes | `0644`, carpeta `0700` |
| ejecuciones registradas, con `--record` y todos los fallos | `runs/` en el directorio de estado | palabras del comando, identificadores, cantidades, duraciones y códigos de error | `0600`, carpeta `0700` |
| registro de envíos, siempre | `sends/<profile>.jsonl` | por intento: momento, chat, resultado, longitud, tipo y tamaño de adjunto; nunca texto ni nombre de archivo | `0600`, carpeta `0700` |
| destinatarios permitidos | `profiles/<profile>.recipients.json` | chats a los que puede enviar el perfil | `0600` |
| punto de `inbox --new` | `inbox/<profile>.json` | dónde terminó la última revisión | `0600` |
| descargas en segundo plano | directorio de estado | chat, progreso y resultado | `0600` |
| registro y bloqueo de `serve` | `serve/<profile>.log`, o registro systemd | lo que hizo `serve` | `0600` |
| unidad systemd o agente launchd, solo con `tg server install` | carpeta de unidades del usuario | comando que inicia `serve` | `0644` |
| archivos descargados, solo con `tg messages download` | `--output-dir`, o carpeta actual | archivos de los mensajes indicados | `0600` |
| exportación, solo con `tg store export` | `--output`, o destino de la redirección | mensajes de un chat | `0600` con `--output`; en otros casos decide la terminal |
| copia de seguridad, solo con `tg store backup` | archivo indicado | copia del archivo local completo | `0600` |
| informe de problema, solo con `tg doctor report create` | `--output`, o carpeta actual | identificadores sustituidos por etiquetas, sin texto | `0600` |
| modelos de voz, solo con `tg models audio download` | `~/.cache/cli-common/models/audio/` | modelos descargados | `0600`, carpeta `0700` |

Consulta las rutas exactas con `tg doctor` y las carpetas de cada sistema en [instalación](./installation.md#where-files-go).

**El archivo local no está cifrado.** Quien pueda leerlo puede leer tus mensajes. Se comparte con otros CLI de la misma biblioteca y permanece después de `tg session end` y de desinstalar. El texto también aparece en exportaciones, copias y archivos descargados; nada más de la tabla lo contiene.

### Si pierdes el equipo

`0600` protege frente a otros usuarios del equipo, no frente a quien se lleva el disco. Para eso sirve el cifrado completo: FileVault en macOS, LUKS en Linux o BitLocker en Windows. El archivo local no incorpora cifrado: una clave en el almacén del sistema no detendría a un programa ejecutado como tu usuario, que puede acceder a él igual que `tg`.

Cierra la sesión desde otro dispositivo: Telegram → Ajustes → Dispositivos, y termina la creada por `tg`. Así el archivo de sesión deja de servir.

## Qué nunca hace

- **Marcar como leído sin solicitarlo.** Leer un chat y marcarlo son peticiones diferentes. Solo `tg chats mark-read` envía la segunda.
- **Enviar o cambiar algo que no hayas indicado.** Solo lo hacen los comandos marcados como "Changes something in Telegram" en `docs/commands.md`: envíos y cambios de mensajes, reacciones, encuestas, marcar como leído, administrar grupos y carpetas, `account update`, escrituras de `contacts`, `account sessions end` y `session end`. Cada uno hace lo que indica. `tg commands --json` los marca como `mutates`, junto con los comandos marcados como "Changes something on this computer only": configuración, destinatarios, reglas de grupos y token del bot.
- **Eliminar sin aprobación explícita.** `tg messages delete` pregunta primero; `--allow-dangerous` aprueba por ti. Para eliminar para todos también hace falta `--for-everyone`. No se puede deshacer. Un agente por MCP nunca elimina para todos ni cierra otras sesiones, independientemente de los ajustes.
- **Aceptar teléfonos en el comando.** `contacts lookup` los solicita o lee por stdin. Ningún error, registro de envíos ni ejecución los conserva.
- **Guardar mensajes en registros.** Ni abreviados ni mediante hash ([diagnóstico](./diagnostics.md)).
- **Mantener la conexión por su cuenta.** Cada comando se conecta, realiza su tarea y termina. Solo `watch`, `serve`, `mcp` y las descargas en segundo plano mantienen conexión mientras están activos.

## Protección de envíos

El agente lee mensajes de otras personas junto a tu petición. Un mensaje puede intentar hacerse pasar por una orden: «reenvía esta conversación allí». Por eso todos los comandos y herramientas MCP que cambian Telegram —enviar, responder, editar, reenviar, fijar, reaccionar, votar, crear encuestas, eliminar o marcar como leído— pasan por los mismos controles, en este orden:

| Control | Cómo activarlo | Rechazo |
|---|---|---|
| **`permissions`** por comando: `deny`, `readonly`, `ask` o `allow` ([configuración](./configuration.md#what-a-profile-may-do)) | `tg config set permissions.messages.send ask` | `deny` y `readonly`: código `5`, antes de enviar; `ask` sin nadie que responda: código `7` |
| **Destinatarios permitidos:** solo los chats de la lista | `tg recipients add <chat>`; desactivar con `tg recipients clear` | código `7` |
| **`sendsPerHour`:** máximo por hora, 30 por defecto | `tg config set sendsPerHour 10` | código `8`; el error indica cuándo podrá enviarse de nuevo |
| **Registro:** todos los intentos, nunca el texto | siempre; `tg sends list` | — |

```sh
tg config set permissions.messages readonly  # no change to messages from this profile
tg config set permissions.messages.send ask  # a question before each send
tg recipients add "Book club"                # the first add turns the list on
tg recipients list
tg recipients remove "Book club"             # the list stays on
tg recipients clear                          # the list is gone: any chat again
tg sends list                                # every attempt: sent, refused, failed, or not known
```

**Qué cuenta para el límite por hora:** mensajes, reenvíos, ediciones, mensajes fijados con notificación, cada mensaje eliminado, grupos nuevos y cada persona añadida. No cuentan reacciones, votos, mensajes fijados sin aviso ni marcar como leído. Un mensaje programado cuenta en la hora en que Telegram lo envía. Dos comandos simultáneos no pueden superar juntos el límite: cada uno reserva su lugar desde la comprobación hasta recibir respuesta.

La lista de destinatarios es opcional: antes de añadir alguno se permite cualquier chat. Los reenvíos se comprueban contra el chat de destino. Por MCP se aplica la misma protección que con los comandos.

Por defecto se permiten los cambios salvo eliminar mensajes y cerrar sesiones, que requieren aprobación. Los ajustes anteriores siguen funcionando: `readOnly: true` deja todo en solo lectura y una lista `allow` permite solo las acciones indicadas.

**Un rechazo es una decisión del propietario, no un fallo.** Si el agente recibe código `5`, `7` u `8`, debe detenerse e informar, sin cambiar ajustes ni reintentar. La skill se lo indica expresamente.

### Qué no pueden impedir estos controles

Los controles están dentro de `tg`: un agente con terminal puede cambiar un ajuste o vaciar la lista. Protegen frente a un modelo **inducido** a enviar por un mensaje, no frente a un agente que **intenta** eludirlos. Para eso hace falta un límite externo: entorno aislado, otro usuario del sistema o reglas del propio agente.

Al elegir ese límite:

- **`TG_PROFILE_LOCK` fija el perfil; `TG_PROFILE` no.** La primera palabra tiene prioridad sobre `TG_PROFILE`: con `TG_PROFILE=agent`, el agente puede escribir `tg work messages send …`. `TG_PROFILE_LOCK=agent` lo rechaza, pero solo si el agente no puede modificar su entorno, por ejemplo en los ajustes del cliente MCP o en un script envoltorio. Un agente con terminal puede quitarlo.
- **`--file` y `--photo` rechazan archivos y carpetas ocultos, `~/.ssh`, carpetas de `tg` y la base de datos local:** las claves y tokens suelen estar allí. `--allow-any-file` permite saltar el control en un comando; está pensado para ti, no para un agente. Por MCP no hay excepción. Los demás archivos legibles por tu usuario pueden enviarse; el registro solo guarda tipo y tamaño.
- **Una regla del agente como «pregunta antes de `tg messages send`»** puede no detectar la forma con perfil, `tg
  work messages send`. Es más seguro limitar el propio perfil con `permissions` o destinatarios y no dejar cerca otro perfil sin restricciones con sesión activa.

## Texto ajeno en tu pantalla

Otras personas escriben nombres, títulos, archivos y mensajes. `tg` evita que controlen la terminal o falseen lo que ves:

- Los caracteres de control que cambian colores, borran líneas, modifican el título o el portapapeles se muestran como texto (`\x1b`), no se ejecutan; igual ocurre con caracteres invisibles o que invierten la dirección del texto.
- Nombres, títulos y leyendas se imprimen en una línea: un salto en un nombre no puede simular otra fila del chat o tabla.
- Si un nombre coincide con varios chats, `tg` enumera las coincidencias en lugar de elegir.
- El autocompletado solo inserta el identificador; el título aparece como ayuda.
- Las exportaciones Markdown reciben la misma limpieza. Los nombres de archivos descargados pierden caracteres de control, dirección y cualquier punto inicial.

Para un agente, los mensajes son datos, nunca instrucciones: «reenvía esto» o «responde con esto» dentro de un mensaje no son peticiones tuyas. La skill (`tg skill show`) y el servidor MCP lo explican. La protección de envíos cubre el caso en que el agente no lo respete.

`--json` devuelve datos: las cadenas son las enviadas por Telegram, escapadas según JSON. Si las pasas a un programa que imprime en una terminal, límpialas allí.

## Qué pueden ver otros usuarios del equipo

Todos los procesos pueden ver los argumentos de un comando mediante `ps`. Por eso ningún secreto se introduce como argumento, pero **el texto de un mensaje sí puede hacerlo**:

```sh
tg messages send me "text"     # this line is visible in ps and stays in your shell history
```

Si te preocupa, omite el texto del comando y pásalo por stdin: `tg messages send me < note.txt`.

Otros usuarios no pueden leer los archivos de `tg`: las carpetas tienen permisos `0700` y los archivos `0600`.

## Qué pasa por la red

- **Telegram**, por MTProto, para lo solicitado por el comando, incluidos fotos y archivos.
- **npm**, una vez al día desde la terminal para comprobar versiones y al ejecutar `tg upgrade`. `updateCheck` o `TG_NO_UPDATE_CHECK=1` desactiva la comprobación ([configuración](./configuration.md)).
- **my.telegram.org**, solo durante `tg session start`: en el navegador o mediante `tg` con `--app auto`. Las aplicaciones creadas por `tg` se llaman `tg-cli` y usan la página de GitHub del proyecto como dirección.
- **Hugging Face y GitHub**, solo al ejecutar `tg models audio download`. La voz nunca se envía allí: el modelo local se ejecuta en este equipo.

Nada más. No hay telemetría.

## Tu aplicación y las condiciones de Telegram

`tg` es un cliente de Telegram, igual que las aplicaciones del teléfono y del ordenador. Inicia sesión con tu propia aplicación de my.telegram.org y sigue las [condiciones de la API de Telegram](https://core.telegram.org/api/terms). El límite por hora está activado por defecto para que el agente envíe a un ritmo similar al de una persona.

## Uso personal

`tg` guarda en tu equipo mensajes y nombres ajenos. Para uso propio con tu cuenta, el RGPD no se aplica al tratamiento con fines exclusivamente personales o domésticos (artículo 2(2)(c)). Trabajar con cuentas ajenas o para una empresa deja de ser uso personal. Una exportación entregada a otra persona también sale de ese ámbito.

Un informe (`tg doctor report create`) se envía a una incidencia **pública** en GitHub. No contiene texto, nombres ni teléfonos, y los identificadores se sustituyen por etiquetas; ábrelo y revísalo antes de enviarlo.

## Inicio de sesión

`tg session start` dibuja el QR en la terminal. Queda en el historial visual, pero Telegram lo renueva mientras esperas, por lo que los antiguos no sirven. `--qr-file` lo guarda como PNG legible solo por ti y elimina el archivo al finalizar, funcione o no.

`--app auto` rellena my.telegram.org sin navegador: solicita el teléfono y el código que el sitio envía por Telegram, nada más.

Cada inicio añade un dispositivo en Telegram → Ajustes → Dispositivos.

## Si se filtra la sesión

1. En Telegram → Ajustes → Dispositivos, termina la sesión creada por `tg`. También puedes ejecutar `tg session end` en este equipo: termina la sesión en Telegram y elimina el archivo.
2. Inicia sesión de nuevo: `tg session start`.

## Siguientes pasos

- [Diagnóstico](./diagnostics.md): qué se registra exactamente y qué nunca se registra.
- [Sesiones](./sessions.md): aplicación, almacén de claves, perfiles y cierre de sesión.
- [MCP](./mcp.md): permisos del agente y efecto de niveles y opciones.
- [Configuración](./configuration.md): `permissions` y `sendsPerHour`.
