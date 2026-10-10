---
title: "Inicio de sesión y perfiles"
---

<a id="inicio-de-sesión" />

Lea esta página cuando conecte `tg` a su cuenta de Telegram por primera vez, cuando agregue una segunda cuenta o cuando `tg` diga que no ha iniciado sesión. Al final, sabrá cómo iniciar sesión, cómo verificar con quién inició sesión, cómo cerrar sesión y dónde guarda `tg` lo que necesita para permanecer conectado.

Primero, las palabras que utiliza esta página:

- **Sesión**: el inicio de sesión de `tg` en esta computadora. Telegram lo emite cuando inicias sesión y lo incluye en la aplicación Telegram como un dispositivo más. `tg` lo guarda en un archivo. Quien tenga ese archivo puede leer tus chats, así que trátalo como tu contraseña.
- **App** (`api_id` y `api_hash`): dos valores de [my.telegram.org](https://my.telegram.org/apps) que identifican el programa ante Telegram. Cada usuario registra su propia aplicación una vez; `tg` puede hacerlo por usted.
- **Llavero**: el almacén de contraseñas de tu sistema operativo. `tg` mantiene los valores de la aplicación allí.
- **Perfil**: un nombre para un inicio de sesión en esta computadora, con su propia sesión, aplicación y configuración. Sin nombre, `tg` utiliza el perfil `default`. Necesita un segundo perfil solo para una segunda cuenta o para límites separados ([perfiles](#profiles)).

No confunda `tg session` con `tg account sessions`. `tg session` es el inicio de sesión del propio `tg`; `tg account sessions` enumera todos los demás dispositivos y aplicaciones que hayan iniciado sesión en su cuenta.

## Primera ejecución

`tg setup` guía una primera ejecución a través de la aplicación y la sesión, verifica cinco chats y ofrece una skill de agente. Espere unos cinco minutos; Las descargas del historial son un paso aparte. Ejecútelo en una terminal. Utilice `tg setup --app browser` para el registro manual de la aplicación o `--method phone` para iniciar sesión por teléfono. `tg session start` sigue siendo el comando para iniciar sesión únicamente, incluida la reanudación de un inicio de sesión interrumpido. El programa de instalación comprueba una sesión existente y no vuelve a iniciar sesión silenciosamente si se rechaza.

## La aplicación de my.telegram.org

Cada usuario registra su propia aplicación. Telegram proporciona una aplicación por número de teléfono; por eso `tg` no incluye ni comparte un identificador de aplicación. Se necesita una vez por perfil; `tg session start` solo lo pide si el perfil todavía no tiene uno.

Hay dos formas de obtenerlo:

- **`--app
browser`** abre [my.telegram.org/apps](https://my.telegram.org/apps). Inicie sesión allí, cree una aplicación si no tiene ninguna (cualquier título y nombre corto, plataforma de escritorio) y pegue `App api_id` y `App api_hash` cuando `tg` lo solicite. El hash no se muestra mientras escribe. Este es el valor predeterminado para `tg session start`.
- **`--app auto`** completa el sitio por usted. Le solicita su número de teléfono y el código que my.telegram.org le envía como mensaje en Telegram, luego lee su aplicación o crea una si no tiene ninguna. El sitio no tiene API, por lo que `tg` sigue su formulario web; un cambio por parte de Telegram puede romper esto. `--app browser` todavía funciona entonces. Este es el valor predeterminado para `tg setup`.

La aplicación solo se guarda después de que Telegram acepte el inicio de sesión.

## Iniciar sesión

```sh
tg session start           # a QR code in the terminal
tg session start phone     # a phone number, the code Telegram sends, and your 2FA password
tg session start phone --sms   # the same, asking Telegram for the code by SMS
```

**QR:** escanea el código en la aplicación Telegram: Configuración → Dispositivos → Vincular dispositivo de escritorio. El código se renueva mientras esperas.

**Teléfono:** escriba el número en formato internacional, luego el código de inicio de sesión. Si la cuenta tiene una contraseña de nube (2FA), `tg` la solicita sin mostrar lo que escribe. Con `--app auto`, el número de teléfono se solicita solo una vez. El código suele llegar a la aplicación Telegram; `--sms` solicita un SMS en su lugar, pero Telegram elige y `tg` dice de qué manera se envió. Cuando Telegram no tiene SMS para la cuenta, `tg` lo dice y pide el código desde la app.

Después de cualquiera de los dos, Telegram incluye un nuevo dispositivo en la lista de sesiones de la aplicación.

```text
Logged in as <your name> (@<username>, id <id>) — profile default.
Session:  ~/.local/share/tg-cli/sessions/default.session
App keys: in the keyring
Next:     tg chats list · tg server install to keep the archive current
```

### Cuando un agente inicia la sesión

Su agente de IA puede iniciar el inicio de sesión por usted, pero no tiene una terminal para dibujar el código QR. `--qr-file` escribe el código como una imagen (PNG) y el agente se lo muestra para que lo escanee:

```sh
tg session start --qr-file login.png
```

El archivo se reemplaza cuando Telegram renueva el código y se elimina cuando finaliza el inicio de sesión, haya funcionado o no. Sin terminal, esto funciona sólo cuando el perfil ya tiene su aplicación y la cuenta no tiene contraseña 2FA: cualquier otra cosa tienes que escribirla tú mismo. `tg setup` toma la misma opción `--qr-file`.

## Comprobar la cuenta y cerrar sesión

```sh
tg account show              # who this profile is logged in as
tg account list              # every profile on this computer, and the account each is logged in as
tg account sessions list     # every device and app logged in to the account; ends nothing
tg session end               # log out on Telegram's side, and delete the session file here
```

`tg session end` también cierra la sesión **en Telegram**: el dispositivo desaparece de la lista de la aplicación. No elimina el identificador ni el hash de la aplicación del llavero y deja intacto el archivo local.

## Cuánto dura una sesión

Hasta que finalice: por `tg session end`, desde la lista de dispositivos en una aplicación de Telegram, o por el propio Telegram una vez que la sesión no se haya utilizado durante más tiempo que el límite de sesiones inactivas de la cuenta (`authorization_ttl_days` en [API de Telegram](https://core.telegram.org/method/account.setAuthorizationTTL)), que las aplicaciones te permiten configurar en la lista de dispositivos. Un perfil que se ejecuta todos los días nunca llega a él. Cuando finaliza una sesión, cada comando responde "no inició sesión o la sesión finalizó" con el código de salida `4`; inicie sesión nuevamente con `tg session start` ([qué hacer cuando finalizó la sesión](./troubleshooting.md#not-logged-in-or-the-session-was-ended--run-tg-session-start)).

## Perfiles

Un perfil es una sesión independiente, con su propia aplicación, configuración, destinatarios y ejecuciones. Su nombre es **la primera palabra** del comando, no una opción:

```sh
tg chats list              # profile "default"
tg work chats list         # profile "work"
export TG_PROFILE=work     # the same for the whole shell session
```

**La primera palabra es el perfil si no es un comando.** Por eso un perfil no puede llamarse `chats`, `messages` ni usar otra palabra de comando; `tg session start` rechaza esos nombres. Los nombres admiten letras, cifras, puntos, guiones y guiones bajos, y deben empezar por una letra o cifra.

El orden de prioridad, de mayor a menor, es: primera palabra, `TG_PROFILE`, `defaultProfile` en la configuración y, por último, `default`.

Si una palabra no es un comando y no va seguida de ningún comando, se muestra este error:

```text
"nonsense" is not a command, so it was read as a profile name — and no command followed it.
```

**`TG_PROFILE_LOCK` limita un proceso a un perfil.** Defínelo en el entorno del agente: cualquier primera palabra o `TG_PROFILE` que indique otro perfil se rechazará (código de salida `5`). Sin él, un agente podría elegir un perfil con menos restricciones.

Para qué sirve cada perfil y cómo funciona un perfil con un bot: [perfiles y bots](./profiles.md).

## Dónde se guarda cada parte

| Contenido | Ubicación |
|---|---|
| sesión | `sessions/<profile>.session` en el directorio de estado |
| identificador y hash de la aplicación | llavero del sistema, servicio `tg-cli`, entrada `<profile>:api` |
| identificador y hash sin llavero | `credentials.json` en el directorio de configuración |
| identificador y hash para CI | `TG_API_ID` y `TG_API_HASH`; tienen prioridad sobre el llavero |

Los directorios se enumeran en [dónde van los archivos](./installation.md#where-files-go).

En equipos sin llavero (habitual en contenedores), la aplicación se guarda en `credentials.json`, junto a la configuración. `tg` lo avisa una vez por stderr.

> ⚠ **`TG_CONFIG_DIR`, `TG_STATE_DIR` y `TG_CACHE_DIR` también cambian la entrada del llavero.** Si alguna está definida, el nombre del servicio incluye el directorio de configuración. Una sesión creada sin ellas no es visible al definirlas, y viceversa. Úsalas siempre o nunca.

> ⚠ **En Linux, el llavero se accede a través de `XDG_RUNTIME_DIR`.** cron, ssh y algunos clientes MCP > inicia `tg` sin él, y cada comando dice que no se encontraron las credenciales de la aplicación "aunque ha iniciado sesión en esta máquina". **No volver a iniciar sesión**: eso agrega otro dispositivo y no arregla el entorno. Configure `XDG_RUNTIME_DIR` > ([credenciales de la aplicación no encontradas después de iniciar sesión](./troubleshooting.md#no-telegram-app-credentials-found--although-it-has-logged-in-on-this-machine)).

## Siguiente paso

- [Lee tus primeros chats](./usage.md)
- [Configuraciones y el orden en que se resuelven](./configuration.md)
- [Lo que llega al disco, y lo que nunca llega](./security.md)
