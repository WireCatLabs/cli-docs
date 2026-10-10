---
title: "Instalación"
---

Lea esta página antes de ejecutar por primera vez `tg`, o cuando lo mueva a otra computadora, actualícelo o elimínelo. Al final, se instala `tg`, has comprobado que se inicia y sabes dónde guarda sus archivos. Iniciar sesión en Telegram es el siguiente paso, en su propia página.

Las palabras que utiliza esta página:

- **paquete npm**: la forma en que se distribuye `tg`. npm (o pnpm, o Bun) lo descarga y coloca el comando `tg` en su computadora. El paquete es **`@wirecat/tg-cli`**; el comando que instala es **`tg`**.
- **Node** o **Bun**: el programa que ejecuta `tg`. Instale uno de ellos primero.
- **PATH**: la lista de carpetas que busca tu terminal cuando escribes un comando. `tg` funciona con su nombre simple sólo cuando su carpeta está en PATH.
- **Llavero**: el almacén de contraseñas de tu sistema operativo. `tg` guarda las claves de la aplicación Telegram allí.
- **Skill**: un breve archivo de instrucciones que le indica a su agente de IA cómo usar `tg`.

La instalación no genera nada: SQLite proviene del propio tiempo de ejecución, por lo que no hay ningún módulo nativo para compilar. No comienza nada en segundo plano. Una instalación global de npm puede instalar la skill incluida y, en Windows, reparar el PATH del usuario. Nunca inicia sesión ni lee los chats.

## Requisitos

- **Node 22.16+ (22.x) o 24+** con npm. El comando también admite **Bun**.
- Linux, macOS o Windows.
- **Tu propia aplicación de Telegram** de [my.telegram.org](https://my.telegram.org/apps). `tg` lo solicita en el primer inicio de sesión y puede registrarlo por usted ([su aplicación Telegram](./sessions.md#the-app-from-mytelegramorg)).

## Instalación

```sh
npm install -g --allow-scripts=@wirecat/tg-cli --foreground-scripts @wirecat/tg-cli
# The global install puts the skill in .agents and .claude. Then: tg setup

pnpm add -g @wirecat/tg-cli
bun add -g @wirecat/tg-cli
```

Para probarlo sin instalarlo:

```sh
npx @wirecat/tg-cli --help
```

Comprueba que funciona:

```sh
tg --version
tg --help
tg doctor        # where its files are, and whether a login exists; connects to nothing
```

## Primer uso

`tg --help` muestra la configuración y las instrucciones del agente inmediatamente después de la instalación. `tg skill show` imprime la skill y funciona antes de iniciar sesión. `tg commands --json` enumera los comandos y opciones. Estos funcionan incluso cuando el administrador de paquetes omitió los scripts de instalación.

Ejecute la configuración en una terminal local:

```sh
tg setup --agent codex
tg setup --help              # examples, login choices and Windows instructions
```

`--agent` elige qué agente obtiene la skill: `codex`, `cursor`, `claude`, `gemini`, `all` o `none`. Sin `--agent`, el comando pregunta en una terminal; `--json` y funciona sin terminal, elija `none`. Espere unos cinco minutos para registrarse en la aplicación, iniciar sesión, verificar los primeros cinco chats y la skill. La descarga del historial de chat es independiente y puede llevar más tiempo: elija un chat y la cantidad antes de ejecutar el comando `store fetch` sugerido. La instalación no inicia ningún servicio en segundo plano.

`tg setup --app browser` abre las instrucciones de registro manual de la aplicación; `--method phone` inicia sesión mediante número de teléfono en lugar de código QR. El código de my.telegram.org (para la aplicación) y el código para iniciar sesión en la cuenta son dos pasos separados. Al ejecutar la configuración nuevamente, se verifica su sesión existente y no se vuelve a iniciar sesión. Si se interrumpió un inicio de sesión o Telegram finalizó la sesión, primero finalice `tg session start` y luego ejecute la configuración nuevamente. Ver [inicio de sesión, sesiones y perfiles](./sessions.md).

Sin una instalación global, utilice `npm exec --yes --package=@wirecat/tg-cli -- tg setup --agent codex`. Luego, el programa de instalación sugiere los siguientes comandos de la misma forma.

### Windows: un comando de instalación

En PowerShell, con Node.js 22.16+ o 24+ instalado:

```powershell
& ([scriptblock]::Create((Invoke-RestMethod 'https://wirecat.dev/install.ps1'))) -Tool tg -Agent all
```

El instalador instala el paquete npm, mantiene las entradas de el PATH del usuario existente, agrega la carpeta de comandos npm una vez, actualiza el PATH del PowerShell actual e instala la skill. Comprueba que se inicia el `tg` desnudo. `-Agent codex|cursor|claude|gemini|all|none` selecciona dónde va la skill; el `all` predeterminado lo instala en ambas carpetas compatibles. Ejecutarlo nuevamente actualiza la skill y no agrega PATH dos veces. También realiza estos pasos cuando los scripts de instalación de npm están desactivados.

La política de ejecución de PowerShell no cambia. El instalador elimina solo el shim `tg.ps1` generado por npm para este paquete y mantiene `tg.cmd`, por lo que el `tg` desnudo también funciona bajo una política restringida. Un script no relacionado con ese nombre se deja solo y se informa como un conflicto.

Una instalación global de npm también repara el PATH de Windows guardada e instala la skill, cuando npm permite su script de instalación:

```powershell
npm.cmd install -g --allow-scripts=@wirecat/tg-cli --foreground-scripts @wirecat/tg-cli
```

Las versiones más nuevas de npm omiten los scripts de instalación a menos que usted los permita, y `--ignore-scripts` también omite este. npm no puede cambiar el PATH del terminal que lo inició, así que abra un nuevo terminal después de una instalación de npm. El instalador de PowerShell anterior también actualiza el terminal actual.

El script de instalación se ejecuta solo para una instalación global de npm, nunca para una dependencia de proyecto o npx. `TG_INSTALL_AGENT=codex|cursor|claude|gemini|all|none` selecciona la skill; `none` lo apaga. No se necesita ningún programa de Windows independiente.

Los primeros comandos para leer tus chats están en [iniciar sesión y los primeros comandos](./usage.md#log-in).

## Desde el código fuente

Para trabajar en el código o para una versión que aún no se ha publicado:

```sh
git clone https://github.com/WireCatLabs/tg-cli.git
cd tg-cli
pnpm install
pnpm build
```

En una copia del repositorio, `bin/tg` guarda la configuración, la sesión y el archivo local en `.tg/` dentro del repositorio, sin tocar tu perfil habitual. `node dist/bin/tg.js` usa los directorios habituales que se indican a continuación.

## Dónde se guardan los archivos

Tres directorios siguen las convenciones del sistema operativo y dos más se comparten con otras herramientas:

| Contenido | Linux | macOS | Windows |
|---|---|---|---|
| configuración | `~/.config/tg-cli/` | `~/Library/Preferences/tg-cli/` | `%APPDATA%\tg-cli\Config\` |
| estado | `~/.local/share/tg-cli/` | `~/Library/Application Support/tg-cli/` | `%LOCALAPPDATA%\tg-cli\Data\` |
| caché | `~/.cache/tg-cli/` | `~/Library/Caches/tg-cli/` | `%LOCALAPPDATA%\tg-cli\Cache\` |
| archivo local | `~/.local/share/cli-messaging/messages.db` | dentro de `~/Library/Application Support/cli-messaging/` | dentro de `%LOCALAPPDATA%\cli-messaging\Data\` |
| modelos de voz | `~/.cache/cli-common/models/audio/` | dentro de `~/Library/Caches/cli-common/` | dentro de `%LOCALAPPDATA%\cli-common\Cache\` |

- **configuraciones** mantienen `config.json` y `credentials.json` solo en una máquina sin llavero.
- **estado** contiene el inicio de sesión (`sessions/<profile>.session`), las ejecuciones registradas (`runs/`), el diario de envíos (`sends/`), la lista de destinatarios permitidos (`profiles/`), el punto guardado de `inbox --new` (`inbox/`), los trabajos de recuperación en segundo plano y el registro y bloqueo de `serve`.
- **el archivo local** se comparte con otras herramientas de mensajería creadas en la misma biblioteca, como [max-cli](https://github.com/WireCatLabs/max-cli). La página [El archivo local](./archive.md) lo describe.
- **Los modelos de voz** se descargan solo cuando preguntas (`tg models audio download`), para `messages transcribe --local`.

`tg doctor` muestra las rutas exactas en este equipo.

Puedes cambiar cada ubicación con una variable: `TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR`, `MESSAGING_STORE` (el propio archivo de la base de datos) y `CLI_COMMON_CACHE_DIR` (los modelos).

> ⚠ **`TG_CONFIG_DIR`, `TG_STATE_DIR` y `TG_CACHE_DIR` también cambian la entrada del llavero.** Una sesión creada con alguna de estas variables deja de ser visible si la quitas, y viceversa: el comando responde "no session" aunque hayas iniciado sesión. Úsalas siempre o nunca. `tg config show` indica si alguna está definida.

## Autocompletado en la terminal

Tab completa comandos, opciones y sus valores. Cuando se espera un chat, ofrece chats del archivo local. Agregue una línea al archivo de inicio de su shell:

```sh
echo 'source <(tg complete zsh)' >> ~/.zshrc      # zsh
echo 'source <(tg complete bash)' >> ~/.bashrc    # bash
tg complete fish | source                         # fish, in config.fish
```

En PowerShell, añade `tg complete powershell | Out-String | Invoke-Expression` a tu perfil.

Tab **nunca se conecta a Telegram**. Si todavía no hay archivo local, solo completa comandos y opciones.

## Actualización

```sh
tg upgrade            # with the package manager that installed tg: npm, pnpm or bun
tg upgrade --check    # only say whether a newer version exists; installs nothing
```

Después de una actualización, `tg upgrade` reinicia cada `serve` en segundo plano que inició `tg`, por lo que el servidor no sigue ejecutando el código antiguo. Un `serve` que inició manualmente no se reinicia: `tg` lo nombra en stderr con el comando que lo reinicia. `tg upgrade` nunca se ejecuta solo.

### Resultado JSON de la actualización

`tg upgrade --check --json` informa la versión actual y disponible sin instalar. El resultado tiene `current`, `latest`, `newer`, `installer`, `command`, `updated` y `restarted`. `restarted` enumera los perfiles cuyos servidores se reiniciaron después de la actualización; es una lista vacía después de una verificación, cuando no hay una versión más nueva o cuando no se reinicia ningún servidor.

Una vez al día, en una terminal, `tg` avisa por stderr si hay una versión más reciente en npm. No muestra el aviso con `--json`, en una tubería, con `--quiet` ni en CI. Para desactivarlo: `tg config set updateCheck false
--defaults`, o `TG_NO_UPDATE_CHECK=1`.

Desde el código fuente: `git pull && pnpm install && pnpm build`. Con npx: `npx @wirecat/tg-cli@latest`.

## Desinstalación

Al eliminar el comando, se dejan sus datos. Primero cierre sesión, mientras `tg` todavía esté allí. `support` a continuación se muestra un nombre de ejemplo de un perfil de bot; repita esa línea para cada bot que haya conectado.

```sh
tg server uninstall                  # if you installed the background unit; stop it first
tg session end                       # logs out on Telegram's side and deletes the session file
tg support bot auth remove           # forgets the token of the bot profile "support"
npm uninstall -g @wirecat/tg-cli
rm -rf ~/.config/tg-cli ~/.local/share/tg-cli ~/.cache/tg-cli
```

`tg session end` no elimina el identificador ni el hash de la aplicación del llavero. Están en el servicio `tg-cli`; elimina esa entrada con la herramienta de tu sistema si también quieres borrarlos.

El archivo local se comparte con otras herramientas. Elimina `~/.local/share/cli-messaging/` solo si ninguna otra lo utiliza: contiene los mensajes que todas ellas han leído.

## Siguiente paso

[Inicie sesión y ejecute los primeros comandos](./usage.md#log-in).
