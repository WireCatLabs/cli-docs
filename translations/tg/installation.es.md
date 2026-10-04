---
title: "Instalación"
---
`tg` es un comando que se instala como un paquete npm normal. No compila nada durante la instalación: SQLite viene incluido en el entorno de ejecución, por lo que no hay módulos nativos que compilar. Tampoco inicia procesos en segundo plano por su cuenta. Una instalación global con npm puede instalar las instrucciones del agente y, en Windows, reparar el PATH del usuario. Nunca inicia sesión ni lee chats durante la instalación.

## Requisitos

- **Node 22.16+ (22.x) o 24+** con npm. El comando también admite **Bun**.
- Linux, macOS o Windows.
- **Tu propia aplicación de Telegram** desde [my.telegram.org](https://my.telegram.org/apps). `tg` la pide
  en el primer inicio de sesión y puede registrarla por ti ([sessions.md](./sessions.md#the-app-from-mytelegramorg)).

## Instalación

```sh
npm install -g --allow-scripts=@leemour/tg-cli --foreground-scripts @leemour/tg-cli
# The global install puts the skill in .agents and .claude. Then: tg setup

pnpm add -g @leemour/tg-cli
bun add -g @leemour/tg-cli
```

El paquete se llama **`@leemour/tg-cli`**; el comando que instala es **`tg`**.

Para probarlo sin instalarlo:

```sh
npx @leemour/tg-cli --help
```

Comprueba que funciona:

```sh
tg --version
tg --help
tg doctor        # where its files are, and whether a login exists; connects to nothing
```

## Primer uso

`tg --help` muestra la configuración y las instrucciones para agentes nada más instalar. `tg skill show` funciona antes de iniciar sesión: el agente debe leerlo antes de conectar Telegram. `tg commands --json` enumera comandos y opciones. Estas indicaciones funcionan incluso si el gestor de paquetes omite los scripts de instalación.

En una terminal local, ejecuta:

```sh
tg setup --agent codex
tg setup --help              # examples, login choices and Windows instructions
```

Elige `codex`, `cursor`, `claude`, `gemini`, `all` o `none`. Sin `--agent`, pregunta en una terminal; con `--json` o sin terminal usa `none`. Reserva unos cinco minutos para registrar la aplicación, iniciar sesión, comprobar los primeros cinco chats e instalar la skill. Descargar historial es aparte y puede tardar más: elige chat y cantidad antes de ejecutar el comando `store fetch` sugerido. Setup no inicia servicios en segundo plano.

`tg setup --app browser` muestra las instrucciones de registro manual; `--method phone` inicia sesión por teléfono en vez de QR. El código de registro de my.telegram.org y el código de acceso a la cuenta corresponden a pasos distintos. Repetir setup comprueba la sesión existente sin volver a iniciar sesión. Si el acceso se interrumpió o Telegram terminó la sesión, completa primero `tg session start` y repite setup. Consulta [sesiones](./sessions.md).

Sin instalación global, usa `npm exec --yes --package=@leemour/tg-cli -- tg setup --agent codex`. Setup propone los comandos siguientes de la misma forma.

### Windows: un comando de instalación

En PowerShell, con Node.js 22.16+ o 24+ instalado:

```powershell
& ([scriptblock]::Create((Invoke-RestMethod 'https://wirecat.dev/install.ps1'))) -Tool tg -Agent all
```

El instalador instala el paquete npm, conserva las entradas del PATH del usuario, añade una sola vez la carpeta de comandos de npm, actualiza el PATH de la ventana actual de PowerShell e instala la skill antes del acceso. Comprueba que `tg` arranca sin indicar su ruta. `-Agent codex|cursor|claude|gemini|all|none` elige dónde se guarda la skill; `all`, por defecto, instala ambos directorios admitidos. Repetir la instalación actualiza la skill sin duplicar PATH. También lo hace cuando los scripts de npm están desactivados.

La política de ejecución de PowerShell no cambia. El instalador elimina solo el lanzador `tg.ps1` generado por npm para este paquete y conserva `tg.cmd`, de modo que `tg` funciona con una política restrictiva. Si encuentra un script ajeno con ese nombre, lo conserva e informa del conflicto.

La instalación global de npm también repara el PATH persistente de Windows e instala ambas skills cuando se permite su script postinstall:

```powershell
npm.cmd install -g --allow-scripts=@leemour/tg-cli --foreground-scripts @leemour/tg-cli
```

Las versiones nuevas de npm pueden omitir los scripts de instalación si no se autorizan. `--ignore-scripts`
también omite expresamente este script del paquete. Para una configuración guiada por un agente, usa npm
y comprueba el comando, la habilidad instalada y el PATH del terminal antes de iniciar sesión. El instalador
opcional de PowerShell actualiza tanto el terminal que lo ejecuta como el PATH persistente; un proceso hijo
de npm no puede modificar el entorno de su padre. Los agentes iniciados antes de la instalación deben
actualizar el PATH de su terminal desde el entorno del usuario y del sistema, sin pedir al usuario que lo edite.

El script global solo se ejecuta en una instalación global de npm, nunca en dependencias de proyectos ni con npx. `TG_INSTALL_AGENT=codex|cursor|claude|gemini|all|none` selecciona la skill; `none` la desactiva. El agente lee `tg skill show` y comprueba su skill instalada antes de guiar el acceso a la cuenta. No hace falta un ejecutable separado para Windows.

Los primeros comandos de lectura están en [primeros pasos](./usage.md#log-in).

## Desde el código fuente

Para trabajar en el código o probar una versión antes de su publicación:

```sh
git clone https://github.com/leemour/tg-cli.git
cd tg-cli
pnpm install
pnpm build
```

En una copia del repositorio, `bin/tg` guarda la configuración, la sesión y el archivo local en `.tg/` dentro del repositorio, sin tocar tu perfil habitual. `node dist/bin/tg.js` usa los directorios habituales que se indican a continuación.

## Dónde se guardan los archivos

Hay tres directorios que siguen las convenciones del sistema operativo y otros dos compartidos:

| Contenido | Linux | macOS | Windows |
|---|---|---|---|
| configuración | `~/.config/tg-cli/` | `~/Library/Preferences/tg-cli/` | `%APPDATA%\tg-cli\Config\` |
| estado | `~/.local/share/tg-cli/` | `~/Library/Application Support/tg-cli/` | `%LOCALAPPDATA%\tg-cli\Data\` |
| caché | `~/.cache/tg-cli/` | `~/Library/Caches/tg-cli/` | `%LOCALAPPDATA%\tg-cli\Cache\` |
| archivo local | `~/.local/share/cli-messaging/messages.db` | dentro de `~/Library/Application Support/cli-messaging/` | dentro de `%LOCALAPPDATA%\cli-messaging\Data\` |
| modelos de voz | `~/.cache/cli-common/models/audio/` | dentro de `~/Library/Caches/cli-common/` | dentro de `%LOCALAPPDATA%\cli-common\Cache\` |

- **Configuración:** contiene `config.json` y, solo en equipos sin almacén de claves, `credentials.json`.
- **Estado:** contiene la sesión (`sessions/<profile>.session`), las ejecuciones registradas (`runs/`), el registro de envíos (`sends/`), los destinatarios permitidos (`profiles/`), el punto guardado de `inbox --new` (`inbox/`), las tareas de descarga en segundo plano y el registro y bloqueo de `serve`.
- **Archivo local:** se comparte con otros CLI de mensajería que usan la misma biblioteca, como [max-cli](https://github.com/leemour/max-cli). Consulta [archivo local](./archive.md).
- **Modelos de voz:** solo se descargan cuando lo solicitas (`tg models audio download`), para `messages transcribe --local`.

`tg doctor` muestra las rutas exactas en este equipo.

Puedes cambiar cada ubicación con una variable: `TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR`, `MESSAGING_STORE` (el propio archivo de la base de datos) y `CLI_COMMON_CACHE_DIR` (los modelos).

> ⚠ **`TG_CONFIG_DIR`, `TG_STATE_DIR` y `TG_CACHE_DIR` también cambian la entrada del almacén de claves.** Una sesión creada con alguna de estas variables deja de ser visible si la quitas, y viceversa: el comando responde "no session" aunque hayas iniciado sesión. Úsalas siempre o nunca. `tg config show` indica si alguna está definida.

## Autocompletado en la terminal

La tecla Tab completa comandos, opciones y valores. Cuando se espera un chat, ofrece los chats del archivo local. Añade una línea al archivo de inicio de tu shell:

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

`tg upgrade` también reinicia cualquier `serve` en segundo plano que encuentre activo, para que el servidor no siga usando el código anterior. Nunca se ejecuta por su cuenta.

### Resultado JSON de la actualización

`tg upgrade --check --json` informa de las versiones actual y disponible sin instalar. El resultado común contiene `current`, `latest`, `newer`, `installer`, `command`, `updated` y `restarted`: los perfiles cuyos servidores se reiniciaron después de actualizar. Las comprobaciones, versiones sin cambios y actualizaciones sin reinicio devuelven una lista vacía; los campos anteriores se conservan. Telegram mantiene su política de reinicio de servidores administrados; los que requieren reinicio manual se indican en stderr. Los scripts que comprueban el conjunto exacto de claves JSON deben aceptar `restarted` en todos los casos.

Una vez al día, en una terminal, `tg` avisa por stderr si hay una versión más reciente en npm. No muestra el aviso con `--json`, en una tubería, con `--quiet` ni en CI. Para desactivarlo: `tg config set updateCheck false
--defaults`, o `TG_NO_UPDATE_CHECK=1`.

Desde el código fuente: `git pull && pnpm install && pnpm build`. Con npx: `npx @leemour/tg-cli@latest`.

## Desinstalación

Eliminar el comando no elimina tus datos. Cierra sesión primero, mientras `tg` sigue instalado:

```sh
tg server uninstall                  # if you installed the background unit; stop it first
tg session end                       # logs out on Telegram's side and deletes the session file
npm uninstall -g @leemour/tg-cli
rm -rf ~/.config/tg-cli ~/.local/share/tg-cli ~/.cache/tg-cli
```

`tg session end` no elimina el identificador ni el hash de la aplicación del almacén de claves. Están en el servicio `tg-cli`; elimina esa entrada con la herramienta de tu sistema si también quieres borrarlos.

El archivo local se comparte con otras herramientas. Elimina `~/.local/share/cli-messaging/` solo si ninguna otra lo utiliza: contiene los mensajes que todas ellas han leído.

## Siguiente paso

[Primeros pasos](./usage.md): iniciar sesión y ejecutar los primeros comandos.
