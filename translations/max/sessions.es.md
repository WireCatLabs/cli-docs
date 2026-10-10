---
title: "Inicio de sesión, sesiones y perfiles"
---

<a id="cómo-obtener-el-token" />
<a id="comprobar-y-olvidar-la-sesión" />
<a id="si-no-hay-llavero" />
<a id="cuánto-dura-el-token" />
<a id="откуда-берётся-токен" />
<a id="проверить-и-забыть" />
<a id="если-ключницы-нет" />
<a id="сколько-живёт-токен" />

Lea esta página cuando conecte `max` por primera vez a una cuenta MAX, agregue una segunda cuenta o `max` diga que no hay inicio de sesión. Al final, usted sabe cómo iniciar sesión, cómo comprobar quién ha iniciado sesión, cómo cerrar sesión y dónde almacena `max` lo que necesita para mantener su inicio de sesión en su lugar.

Primero, las palabras que aparecen aquí:

- **Sesión**: acceso de `max` a tu cuenta MAX en este ordenador. Incluye un token y una identidad de dispositivo; aparece como otro dispositivo en la aplicación.
- **Token**: cadena que MAX entrega al iniciar sesión. Permite leer tus chats: trátala como una contraseña. `max` la guarda en el llavero.
- **Identidad de dispositivo**: cómo se identifica `max` ante MAX; mantiene el mismo dispositivo entre comandos. Se guarda junto al estado.
- **Llavero**: almacén de contraseñas del sistema operativo.
- **Perfil**: nombre de una sesión local con su token, estado y ajustes. Sin nombre, `max` usa `default`. Necesitas otro perfil para otra cuenta o restricciones distintas ([perfiles](#профили)).

No confunda `max session` y `max account sessions`. `max session` — entrada del propio `max`; `max account sessions` enumera todos los demás dispositivos y aplicaciones que hayan iniciado sesión en su cuenta.

## Primer inicio

`max setup --agent codex` comprueba los directorios locales, guía el acceso con QR, comprueba la cuenta y hasta cinco chats e instala el skill del agente. Opciones: `codex`, `cursor`, `claude`, `gemini`, `all`, `none`. Sin opción pregunta en el terminal; en modo máquina omite el skill. `max skill show` se puede leer antes de iniciar sesión.

Tarda unos cinco minutos. La historia se descarga por separado luego de seleccionar el chat y el volumen; La instalación no inicia el servicio en segundo plano. Al reiniciar se comprueba la sesión existente. `--method token|qr|qr-chrome|sms` selecciona el nuevo método de entrada; de forma predeterminada, la configuración toma `qr`. QR y navegador requieren una persona en la terminal local. No pase el token como argumento. Si se interrumpe la configuración, repita la configuración. Si el token ha caducado, ejecute explícitamente `max session start qr`; Si el llavero es inaccesible, primero corrija el entorno de acuerdo con las indicaciones.

## Entrada

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

**`qr` solicita código de MAX con su propia conexión `max`**, haciéndose pasar por un cliente web. Funciona sin navegador, pero ya no es un cliente web real.

**Inicie sesión mediante SMS: solo a través del navegador.** Cuando el SMS solicita una conexión `max`, MAX requiere un captcha y solo se puede completar en la página.

Tras cualquiera de esos tres métodos, aparece un dispositivo nuevo en la lista de sesiones de MAX. Si la cuenta tiene una contraseña en la nube, `qr` la solicita sin mostrarla, con hasta tres intentos; después hay que volver a escanear el código.

Los tres métodos requieren una persona ante el terminal; sin ella, fallan con código 2. Un agente sin terminal debe usar `token`. Si está definido `MAX_TOKEN`, los tres también fallan: tiene prioridad sobre el llavero e impediría usar la sesión nueva.

### Introducir el token manualmente

`max session start` sin método **importa** un token ya emitido por el cliente oficial, como `web.max.ru` u otro cliente, y lo guarda en el llavero. También funciona si el acceso encuentra un CAPTCHA o un segundo factor poco habitual.

```sh
max session start
MAX token: ▏          # ввод не отображается
```

**El token no se pasa como argumento.** Cualquier proceso del comando puede ver los argumentos con `ps`, y quedan en el historial de la shell. Por eso se solicita sin mostrar lo que escribes o, sin terminal, se lee desde una tubería:

```sh
pass show max/token | max session start
```

Para CI y ejecuciones puntuales hay una variable con **prioridad sobre el llavero**: si defines `MAX_TOKEN`, se utiliza ese valor y no se escribe en el llavero. Con ella no se inicia `max serve` en segundo plano: el propio comando se conecta a MAX.

```sh
MAX_TOKEN="$(cat /path/to/token)" max chats list --json
```

## Verificar y salir

```sh
max account show             # под кем выполнен вход: id, имя, последние четыре цифры телефона
max account list             # все профили на этом компьютере и аккаунт каждого
max account sessions list    # все устройства и приложения, вошедшие в аккаунт; ничего не завершает
max session end              # выйти из MAX и забыть токен на этой машине
```

`session end` primero termina la sesión en el servidor de MAX y después borra el token de este ordenador. La respuesta indica el resultado:

```json
{ "profile": "default", "forgotten": true, "revokedOnServer": true }
```

**Si iniciaste sesión con un token de una pestaña de web.max.ru, comparten la misma sesión:** `session end` también cierra la sesión de MAX de esa pestaña.

Si MAX no responde, se conserva el token para que puedas repetir el comando. Un token que MAX ya no acepta se borra de inmediato: ya no queda una sesión que cerrar.

## ¿Cuánto dura una sesión?

Su duración es desconocida: MAX no la comunica. Sigue funcionando después de cerrar la pestaña de web.max.ru. Cuando MAX deje de aceptarlo, vuelve a iniciar sesión con `max session start`.

`max` no limita el número de accesos, pero los cuenta por perfil; `max doctor` muestra el contador.

## Perfiles

El perfil almacena su token y su estado; Se comparte el archivo local de los mensajes, con los datos de la cuenta. El perfil se llama **primera palabra**, no una bandera:

```sh
max chats list              # профиль default
max personal chats list     # профиль personal
export MAX_PROFILE=personal # или на всю сессию оболочки
```

Regla: **La primera palabra es perfil a menos que sea la misma que el nombre del comando.** Por lo tanto, un perfil no puede llamarse `chats`, `runs` o `session`; `max session start` y `max setup` rechazan dicho nombre. De lo contrario, `max chats` significaría silenciosamente "perfil de chat sin comando". El nombre consta de letras latinas, números, puntos, guiones y guiones bajos y comienza con una letra o un número.

Ordene, la primera coincidencia gana: primera palabra, `MAX_PROFILE`, `defaultProfile` en el archivo de configuración, luego `default`.

Si la primera palabra no es un comando y tampoco aparece otro después, el programa explica lo ocurrido en lugar de limitarse a mostrar la ayuda:

```text
"nonsense" is not a command, so it was read as a profile name — and no command followed it.
Run `max --help` for the commands, or `max nonsense account show` if "nonsense" is your profile.
```

**`MAX_PROFILE_LOCK` asigna el proceso a un perfil.** Especifíquelo donde se está ejecutando el agente y se rechazará la primera palabra o `MAX_PROFILE` con el nombre de otro perfil (código de retorno `5`). Sin él, el agente podría elegir un perfil con menos restricciones.

Por qué se necesita cada perfil y cómo funciona el perfil con el bot - en la sección [perfiles y bots](./profiles.md).

## Dónde se guarda cada dato

| Qué | Dónde |
|---|---|
| Token | Llavero del sistema, servicio `max-cli`, entrada con el nombre del perfil |
| Token sin llavero | `credentials.json` junto a los ajustes, modo `0600` |
| Token para CI | `MAX_TOKEN`, con prioridad sobre el llavero |
| Token de bot | Llavero, servicio `max-cli`, entrada `bot:<профиль>`; o `MAX_BOT_TOKEN` |
| Chats vistos por bots | `~/.local/share/max-cli/bots/` |
| Dispositivo, contador de inicios, `viewerId` | `~/.local/share/max-cli/profiles/<профиль>.json`, modo `0600` |
| Ajustes | `~/.config/max-cli/config.json` |

Los directorios para macOS y Windows se enumeran en la sección [donde todo va](./installation.md#куда-всё-ложится).

**La identidad del dispositivo se guarda en la primera lectura**, antes de utilizarse. Presentarse como un dispositivo nuevo con cada comando no reproduce el comportamiento de un cliente real: las sesiones del servidor están vinculadas a esa identidad.

En una máquina sin un llavero (un contenedor típico), la grabación falla; luego el token se coloca en el archivo `credentials.json` al lado de la configuración, con los derechos `0600`, y el comando dice esto en una línea en stderr. En CI, es mejor no confiar ni en uno ni en el otro y pasar `MAX_TOKEN`.

> ⚠ `MAX_CONFIG_DIR`, `MAX_STATE_DIR` y `MAX_CACHE_DIR` también transfieren la entrada en el porta llaves: el nombre cambia
> servicios. Una sesión guardada con estas variables **no es visible** para un comando iniciado sin ellas, y
> viceversa. O instálalos siempre o nunca.

## Siguiente paso

- [Leer los primeros chats de](./usage.md)
- [Configuraciones y el orden en que se aplican](./configuration.md)
- [Lo que termina en el disco y lo que nunca termina](./security.md)
