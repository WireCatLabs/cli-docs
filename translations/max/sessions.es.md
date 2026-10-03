---
title: "Sesiones y perfiles"
---

Una sesión combina el token de tu cuenta de MAX con una identidad de dispositivo estable. El token se guarda en el llavero del sistema operativo; el resto, en un archivo junto a la configuración.

## Cómo obtener el token

`max session start <способ>` permite iniciar sesión de cuatro maneras. En todos los casos, el token solo se guarda en el llavero después de que MAX lo acepte.

| Método | Qué ocurre | Requisitos |
|---|---|---|
| `token` (predeterminado) | Pegar un token emitido por el cliente oficial o pasarlo mediante una tubería | Ninguno |
| `qr` | Muestra el QR en la terminal para escanearlo con MAX. Si la terminal es estrecha, abre el código en el navegador predeterminado | Unas 70 columnas de ancho o cualquier navegador |
| `qr-chrome` | Abre web.max.ru en una ventana separada; escaneas su QR | Chrome, Chromium, Edge o Brave |
| `sms` | Abre la misma ventana de web.max.ru; elige acceso por teléfono en la página | Chrome, Chromium, Edge o Brave |

```sh
max session start qr
```

**`qr-chrome` y `sms` son los métodos más conservadores.** El acceso lo realiza web.max.ru en un navegador real: MAX ve su propio cliente web. Se utiliza un perfil temporal separado del tuyo. Cuando termina el acceso, se cierra la ventana y se elimina el perfil, también al pulsar Ctrl-C. Cerrar la ventana no termina la sesión: es como cerrar una pestaña. El navegador se detecta automáticamente; puedes elegir otro con `MAX_BROWSER`. Los navegadores instalados por snap no sirven porque tienen su propio directorio `/tmp`.

**`qr` solicita el código a MAX mediante nuestra propia conexión**, que se presenta como un cliente web. Funciona sin navegador, pero no es el cliente web oficial.

**El acceso por SMS solo funciona desde el navegador.** Si nuestra conexión solicita el SMS, MAX exige un CAPTCHA que solo se puede completar en la página.

Tras cualquiera de esos tres métodos, aparece un dispositivo nuevo en la lista de sesiones de MAX. Si la cuenta tiene una contraseña en la nube, `qr` la solicita sin mostrarla, con hasta tres intentos; después hay que volver a escanear el código.

Los tres métodos necesitan a una persona en la terminal; de lo contrario, el comando termina con código 2. Para scripts y agentes queda `token`. También se rechazan si está definida `MAX_TOKEN`: esa variable tiene prioridad sobre el llavero y ocultaría la sesión nueva.

### Introducir el token manualmente

`max session start` sin método **importa** un token ya emitido por el cliente oficial, como `web.max.ru` u otro cliente, y lo guarda en el llavero. También funciona si el acceso encuentra un CAPTCHA o un segundo factor poco habitual.

```sh
max session start
MAX token: ▏          # ввод не отображается
```

**El token no se pasa como argumento.** Cualquier proceso del equipo puede ver los argumentos con `ps`, y quedan en el historial de la shell. Por eso se solicita sin mostrar lo que escribes o, sin terminal, se lee desde una tubería:

```sh
pass show max/token | max session start
```

Para CI y ejecuciones puntuales hay una variable con **prioridad sobre el llavero**: si defines `MAX_TOKEN`, se utiliza ese valor y no se escribe en el llavero. Con ella no se inicia `max serve` en segundo plano: el propio comando se conecta a MAX.

```sh
MAX_TOKEN="$(cat /path/to/token)" max chats list --json
```

## Comprobar y olvidar la sesión

```sh
max account show      # кто вы: id, имя, телефон
max session end       # забыть токен на этой машине
```

`session end` elimina el token **localmente** y no avisa al servidor. La sesión abierta en el navegador sigue funcionando; la respuesta lo indica:

```json
{ "profile": "default", "forgotten": true, "revokedOnServer": false }
```

Es una diferencia importante: olvidar un token que el servidor sigue aceptando no equivale a revocarlo.

## Perfiles

Un perfil es una cuenta separada, con su token, estado y caché. Se indica como **primera palabra**, no con una opción:

```sh
max chats list              # профиль default
max personal chats list     # профиль personal
export MAX_PROFILE=personal # или на всю сессию оболочки
```

Regla: **la primera palabra es un perfil si no coincide con el nombre de un comando.** No puedes llamar a un perfil `chats`, `runs` o `session`: se rechaza al crearlo, cuando todavía se puede explicar el conflicto. De lo contrario, `max chats` podría interpretarse como «perfil chats sin comando».

Si la primera palabra no es un comando y tampoco aparece otro después, el programa explica lo ocurrido en lugar de limitarse a mostrar la ayuda:

```text
"nonsense" is not a command, so it was read as a profile name — and no command followed it.
Run `max --help` for the commands, or `max nonsense account show` if "nonsense" is your profile.
```

## Dónde se guarda cada dato

| Dato | Ubicación |
|---|---|
| token | Llavero del sistema, servicio `max-cli`, entrada con el nombre del perfil |
| token del bot | Llavero del sistema, servicio `max-cli`, entrada `bot:<профиль>`; o `MAX_BOT_TOKEN` |
| chats vistos por el bot | `~/.local/share/max-cli/bots/` |
| dispositivo, contador de accesos y `viewerId` | `~/.local/share/max-cli/profiles/<профиль>.json`, permisos `0600` |
| configuración | `~/.config/max-cli/config.json` |

**La identidad del dispositivo se guarda en la primera lectura**, antes de utilizarse. Presentarse como un dispositivo nuevo con cada comando no reproduce el comportamiento de un cliente real: las sesiones del servidor están vinculadas a esa identidad.

> ⚠ `MAX_CONFIG_DIR`, `MAX_STATE_DIR` y `MAX_CACHE_DIR` también cambian la entrada del llavero, porque cambia el nombre del servicio. Una sesión guardada con estas variables **no es visible** para un comando ejecutado sin ellas, y viceversa. Úsalas siempre o no las uses.

## Si no hay llavero

Si el equipo no tiene llavero, como suele ocurrir en un contenedor, el token se guarda en `credentials.json`, junto a la configuración, con permisos `0600`. El comando lo indica en una línea en stderr.

En CI es preferible no depender del llavero ni del archivo y proporcionar `MAX_TOKEN`.

## Cuánto dura el token

Su duración es desconocida: MAX no la comunica. Sigue funcionando después de cerrar la pestaña de web.max.ru. Cuando MAX deje de aceptarlo, vuelve a iniciar sesión con `max session start`.

`max` no limita el número de accesos, pero los cuenta por perfil; `max doctor` muestra el contador.

## Siguiente paso

- [Uso cotidiano](./usage.md): los primeros comandos.
- [Configuración](./configuration.md): ajustes y orden de prioridad.
- [Seguridad](./security.md): qué se guarda en disco y qué nunca se guarda.
