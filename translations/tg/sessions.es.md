---
title: "Inicio de sesión y perfiles"
---

Un inicio de sesión tiene dos partes:

- **La aplicación:** un `api_id` y un `api_hash` de [my.telegram.org](https://my.telegram.org/apps). Identifican el programa ante Telegram. `tg` los guarda en el almacén de claves del sistema operativo.
- **La sesión:** lo que Telegram entrega después de iniciar sesión. Se guarda como archivo en el directorio de estado y permite acceder a tu cuenta igual que una contraseña.

`tg setup` guía el primer uso: prepara ambas partes, comprueba cinco chats y ofrece una skill para el agente. Reserva unos cinco minutos; descargar historial es un paso aparte. Ejecútalo en una terminal. Usa `tg setup --app browser` para registrar la aplicación manualmente o `--method phone` para acceder por teléfono. `tg session start` sigue siendo el comando para solo iniciar sesión, incluido retomar un acceso interrumpido. Setup comprueba una sesión existente y no inicia otra en silencio si Telegram la rechaza.

## La aplicación de my.telegram.org

Cada usuario registra su propia aplicación. Telegram proporciona una aplicación por número de teléfono; por eso `tg` no incluye ni comparte un identificador de aplicación. Se necesita una vez por perfil; `tg session start` solo lo pide si el perfil todavía no tiene uno.

Hay dos formas de obtenerlo:

- **`--app browser`** (predeterminado) abre [my.telegram.org/apps](https://my.telegram.org/apps). Inicia sesión allí, crea una aplicación si aún no tienes una (cualquier título y nombre corto, plataforma Desktop) y pega `App api_id` y `App api_hash` cuando `tg` los solicite. El hash no se muestra mientras lo escribes.
- **`--app auto`** rellena el sitio por ti. Solicita tu número y el código que my.telegram.org envía por Telegram; después consulta tu aplicación o crea una si no existe. El sitio no tiene API, así que `tg` utiliza el formulario web; un cambio de Telegram puede romper este proceso. En ese caso, `--app
  browser` sigue disponible.

La aplicación solo se guarda después de que Telegram acepte el inicio de sesión.

## Inicio de sesión

```sh
tg session start           # a QR code in the terminal
tg session start phone     # a phone number, the code Telegram sends, and your 2FA password
tg session start phone --sms   # the same, asking Telegram for the code by SMS
```

**QR:** escanea el código desde Telegram: Ajustes → Dispositivos → Vincular dispositivo de escritorio. El código se renueva mientras esperas.

**Teléfono:** escribe el número en formato internacional y después el código de inicio de sesión. Si la cuenta tiene una contraseña en la nube (2FA), `tg` la solicita sin mostrar lo que escribes. Con `--app auto`, solo pide el número una vez.

En ambos casos, Telegram muestra un nuevo dispositivo en la lista de sesiones de la aplicación.

```text
Logged in as <your name> (@<username>, id <id>) — profile default.
Session:  ~/.local/share/tg-cli/sessions/default.session
App keys: in the keyring
Next:     tg chats list · tg server install to keep the archive current
```

El código suele llegar a la aplicación Telegram. `--sms` pide un SMS, pero Telegram decide; la CLI indica cómo se envió realmente.

### Cuando un agente inicia la sesión

Un agente no tiene una terminal donde dibujar el QR. `--qr-file` lo guarda como PNG para que el agente pueda mostrártelo:

```sh
tg session start --qr-file login.png
```

El archivo se sustituye cuando Telegram renueva el código y se elimina al finalizar el inicio de sesión, tenga éxito o no. Sin terminal, esto solo funciona si el perfil ya tiene su aplicación y la cuenta no tiene contraseña 2FA: cualquier otro dato debe introducirse manualmente.

## Comprobar la cuenta y cerrar sesión

```sh
tg account show              # who this profile is logged in as
tg account sessions list     # every device and app logged in to the account; ends nothing
tg session end               # log out on Telegram's side, and delete the session file here
```

`tg session end` también cierra la sesión **en Telegram**: el dispositivo desaparece de la lista de la aplicación. No elimina el identificador ni el hash de la aplicación del almacén de claves y deja intacto el archivo local.

## Cuánto dura una sesión

Hasta que se cierre: mediante `tg session end`, desde la lista de dispositivos de Telegram o por Telegram cuando la sesión no se utiliza durante más tiempo que el límite de inactividad de la cuenta (`authorization_ttl_days` en [la API de Telegram](https://core.telegram.org/method/account.setAuthorizationTTL)). Puedes ajustar ese límite en la lista de dispositivos. Un perfil que se utiliza a diario nunca lo alcanza. Si la sesión termina, todos los comandos responden "not logged in, or the session was ended" con código de salida `4`; vuelve a iniciar sesión con `tg session start` ([solución de problemas](./troubleshooting.md#not-logged-in-or-the-session-was-ended--run-tg-session-start)).

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

## Dónde se guarda cada parte

| Contenido | Ubicación |
|---|---|
| sesión | `sessions/<profile>.session` en el directorio de estado |
| identificador y hash de la aplicación | almacén de claves del sistema, servicio `tg-cli`, entrada `<profile>:api` |
| identificador y hash sin almacén de claves | `credentials.json` en el directorio de configuración |
| identificador y hash para CI | `TG_API_ID` y `TG_API_HASH`; tienen prioridad sobre el almacén de claves |

Consulta las rutas en [instalación](./installation.md#where-files-go).

En equipos sin almacén de claves (habitual en contenedores), la aplicación se guarda en `credentials.json`, junto a la configuración. `tg` lo avisa una vez por stderr.

> ⚠ **`TG_CONFIG_DIR`, `TG_STATE_DIR` y `TG_CACHE_DIR` también cambian la entrada del almacén de claves.** Si alguna está definida, el nombre del servicio incluye el directorio de configuración. Una sesión creada sin ellas no es visible al definirlas, y viceversa. Úsalas siempre o nunca.

> ⚠ **En Linux se accede al almacén de claves mediante `XDG_RUNTIME_DIR`.** cron, ssh y algunos clientes MCP inician `tg` sin ella, por lo que todos los comandos indican que no se encuentran las credenciales "although it has logged in on this machine". **No vuelvas a iniciar sesión:** añadirías otro dispositivo sin resolver el entorno. Define `XDG_RUNTIME_DIR` ([solución de problemas](./troubleshooting.md#no-telegram-app-credentials-found--although-it-has-logged-in-on-this-machine)).

## Siguiente paso

- [Primeros pasos](./usage.md): los primeros comandos.
- [Configuración](./configuration.md): ajustes y orden de prioridad.
- [Seguridad](./security.md): qué se guarda en disco y qué nunca se guarda.
