---
title: "Solucionar problemas"
---

Usa esta página cuando falle un comando y su mensaje no diga lo suficiente. Busque el mensaje que ve, o su código de salida, y la página le indicará lo que significa y qué hacer a continuación.

Algunas palabras que utiliza esta página:

- El **código de salida** es el número que devuelve un comando cuando finaliza: `0` significa que se completó y cualquier otro número indica el tipo de falla. Los scripts y los agentes de IA lo leen; la siguiente tabla asigna cada uno a su sección.
- **`wa <profile> doctor`** comprueba la instalación sin conectarse a WhatsApp. Ejecútelo primero.

En la salida `--json`, un error que finaliza el comando es una línea en stderr, `{"error":{"code":"…","reason":"…",
"message":"…"}}`, and the exit code says the same as the `code`. Cada código también se encuentra en la [referencia del código de salida](./commands.md#exit-codes).

## Por código de salida

| Código | Nombre | Lo que suele significar | Dónde |
|---|---|---|---|
| `1` | `internal_error` | un fallo en el propio `wa` | [algo más](#something-else) |
| `2` | `validation_error` | un valor u opción que `wa` no acepta, un nombre que cabe en varios chats, ningún perfil nombrado o un comando que WhatsApp no ​​puede ejecutar | [nombra un perfil](#name-a-profile), [aún no está en wa](./usage.md#not-in-wa-yet) |
| `3` | `configuration_error` | el archivo de configuración es incorrecto o el almacén local es más nueva que este `wa` | [el almacén local y otras versiones](./archive.md#the-store-and-other-versions) |
| `4` | `authentication_error` | el perfil no está vinculado o WhatsApp cerró sesión en el dispositivo | [desconectado](#whatsapp-logged-this-device-out) |
| `5` | `permission_error` | el perfil `permissions` lo rechazó, o WhatsApp baneó o restringió la cuenta | [permisos](./permissions.md), [escribe](./limits.md#writes) |
| `6` | `not_found` | no existe tal chat, mensaje o persona en el almacén local; nada almacenado todavía | [nada registrado](#nothing-recorded-for-profile--yet) |
| `7` | `confirmation_required` | el chat no está en la lista de destinatarios, o el cambio pregunta primero y nadie pudo responder | [preguntas en scripts](./permissions.md#questions-in-scripts) |
| `8` | `rate_limited` | el límite de envío por horas, o WhatsApp pidió que la cuenta fuera más lenta | [escribe](./limits.md#writes) |
| `9` | `timeout` | el teléfono no respondió a tiempo o `--timeout` finalizó el comando | [historia anterior](./archive.md#older-history-from-your-phone) |
| `10` | `network_error` | `wa` no pudo conectarse a WhatsApp a tiempo | [algo más](#something-else) |
| `11` | `provider_error` | WhatsApp rechazó la solicitud o el motor no pudo hacerlo | [algo más](#something-else) |
| `12` | `provider_unavailable` | otro comando retiene el dispositivo, el motor se para o WhatsApp ya no acepta esta versión | [iniciar sesión en uso](#this-whatsapp-login-is-in-use-by-serve-pid-) |
| `14` | `outcome_unknown` | la conexión se cortó después de que se fue una escritura: puede haber sucedido | [reintentos seguros](./cli-contract.md#previews-and-safe-retries) |
| `130` | `cancelled` | presionó Ctrl+C o respondió no a una pregunta | |

## Primero: `wa doctor`

```sh
wa personal doctor
wa personal doctor --online
```

`doctor` no se conecta a nada. Muestra si el motor está instalado, si las claves del dispositivo existen con modos de archivos privados y quién mantuvo la última conexión del dispositivo. `--online` también se conecta una vez y lee la cuenta; no envía nada ([lo que muestra `doctor`](./diagnostics.md#check-the-installation-wa-doctor)).

## "no hay nada registrado para el perfil... todavía"

El almacén local no tiene nada para este perfil. Lee la respuesta solo del almacén local, que `wa <profile> serve` completa desde tu teléfono. Vincula el perfil primero con `wa <profile> setup`.

## "este inicio de sesión de WhatsApp está en uso por servicio (pid...)"

WhatsApp permite una conexión por dispositivo vinculado y otro comando `wa` la retiene. Detenga ese comando o espere a que finalice. Cuando el titular es `serve`, los comandos normalmente pasan por él; Esto se ve en Windows, donde los comandos no pasan por `serve`, o mientras `serve` aún se está iniciando ([una conexión por dispositivo](./sessions.md#one-connection-per-device)). `wa <profile> doctor` nombra al último titular y dice si su proceso aún se ejecuta.

## "el motor de WhatsApp no está instalado"

`wa` ejecuta el protocolo de WhatsApp en un programa independiente, el motor. npm lo instala con `wa` como un pequeño paquete para su sistema, `@wirecat/whatsapp-engine-<system>-<processor>`; el mensaje nombra el que buscaba. Falta cuando la instalación omitió paquetes opcionales (`--omit=optional` o `optional=false` en `.npmrc`): reinstale sin eso. Existen paquetes de motor para Linux, macOS y Windows en x64 y arm64. En una compra de origen, compílelo con `pnpm engine:build` (necesita Go). De cualquier manera, `WA_ENGINE` configurado en una ruta ejecuta ese motor. `wa doctor` dice si encuentra el motor y dónde buscó.

## "WhatsApp cerró la sesión de este dispositivo"

El dispositivo fue eliminado del teléfono o WhatsApp lo finalizó. Ejecuta `wa <profile> session end`, luego `wa <profile> session start`.

## `serve` se detuvo solo

`wa <profile> server logs` dice por qué. Una caída de la red no lo detiene: se vuelve a conectar y sigue ahorrando. Se detiene cuando el motor se apaga (salida 12) y cuando WhatsApp finaliza la conexión: desconectado (salida 4), baneado (salida 5), ​​otra conexión tomó el inicio de sesión o WhatsApp ya no acepta esta versión (salida 12). Su unidad lo inicia nuevamente 30 segundos después, excepto después de la salida 4 o 5: para 4, ejecute `wa <profile> session start`, luego `wa <profile> server start`; para 5, mira el teléfono y reinícialo una vez que finalice la prohibición. Después de una adquisición, detenga primero la otra conexión. En macOS la unidad no la reinicia después de cualquier falla, ya que launchd no puede omitir un código de salida.

## "wa setup necesita un terminal para vincular un dispositivo"

Un enlace de código de emparejamiento solicita su número de teléfono, por lo que necesita una terminal. Ejecuta `setup` en una terminal, o enlace por QR: sin terminal el código QR se imprime como texto para escanear. Un dispositivo vinculado anteriormente no necesita terminal.

## "el terminal tiene 40 columnas de ancho y el código QR necesita 69"

El código no se dibuja porque un código empaquetado no se puede escanear. Ampliar el terminal: se extrae el siguiente código que envía WhatsApp.

## "nombra un perfil"

Cada comando de cuenta nombra tu perfil con la primera palabra: `wa personal chats list`. `wa` nunca elige uno por ti.

## Algo más

Ejecuta el comando nuevamente con `--debug` para ver los detalles del fallo, y `wa <profile> doctor` para el estado de esta instalación: el motor, los modos de archivo de claves del dispositivo y la cerradura, leídos sin conectarse. Informar un problema en el [rastreador de problemas](https://github.com/WireCatLabs/whatsapp-cli/issues/new).
