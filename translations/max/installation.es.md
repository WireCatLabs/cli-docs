---
title: "Instalación"
---

<a id="instalación-habitual" />
<a id="primer-inicio-e-instrucciones-para-el-agente" />
<a id="actualizar-y-desinstalar" />
<a id="обычный-способ" />
<a id="первый-запуск-и-инструкция-для-агента" />
<a id="обновление-и-удаление" />

Lea esta página antes de iniciar `max` por primera vez, cuando cambie a otra computadora o cuando actualice o desinstale. Al finalizar `max` está instalado, has verificado que se inicia y sabes dónde almacena sus archivos. Iniciar sesión en MAX es el siguiente paso, en una página separada.

Palabras que aparecen aquí:

- **Paquete npm**: forma de distribuir `max`. npm, pnpm o Bun descarga el paquete y añade el comando al ordenador. El paquete se llama **`@wirecat/max-cli`**; el comando, **`max`**.
- **Node** o **Bun**: programa que ejecuta `max`. Instala uno antes.
- **PATH**: lista de carpetas donde el terminal busca comandos. Para ejecutar `max` por nombre, su carpeta debe estar incluida.
- **Llavero**: almacén de contraseñas del sistema operativo donde `max` guarda el token de la cuenta.
- **Skill**: instrucciones para que el agente de IA use `max`.

La instalación no compila nada: se utiliza un binario ya preparado para acceder al llavero. No ejecuta un servicio en segundo plano, no inicia sesión en su cuenta y no lee los chats. El fondo `max serve` aparece más tarde: se inicia con el primer comando normal que necesita MAX (el programa de instalación no lo inicia; es la configuración `serve` en [preferencias](./configuration.md)).

## Requisitos

- **Node 22.16+ (rama 22.x) o 24+** con npm
- **O Bun 1.3+** para ejecutar el comando
- Linux, macOS o Windows

Si no hay un llavero en la máquina, el token va al archivo al lado de la configuración y el comando se lo informará en una línea.

## Instalar

```sh
npm install -g @wirecat/max-cli
pnpm add -g @wirecat/max-cli
bun add -g @wirecat/max-cli
```

Ejecutar sin instalar:

```sh
npx @wirecat/max-cli --help
pnpm dlx @wirecat/max-cli --help
bunx @wirecat/max-cli --help
```

Compruebe que todo esté en su lugar:

```sh
max --version
max --help              # список команд
max doctor              # где лежат файлы и есть ли вход; к MAX не подключается
```

Si la instalación se realiza correctamente y no se encuentra `max`, `npx @wirecat/max-cli doctor` le dirá por qué y qué comando ejecutar ([No se encuentra `max` después de instalar ](./troubleshooting.md#max-не-находится-после-установки)).

## Primer ejecución

`max --help` y `max setup --help` funcionan tras instalar. `max skill show` muestra la skill incluso antes de iniciar sesión. `max commands --json` enumera comandos y opciones.

Ejecute la configuración en una terminal local:

```sh
max setup --agent codex            # QR-вход и навык агента
max setup --help                   # примеры и способы входа
```

`--agent` elige a qué agente asignarle la habilidad: `codex`, `cursor`, `claude`, `gemini`, `all` o `none`. Toma unos cinco minutos: `setup` navega a través del inicio de sesión, la verificación de la cuenta y hasta cinco chats. La historia se descarga por separado, luego de seleccionar el chat y el volumen. El comando no inicia un servicio en segundo plano. El reinicio utiliza la sesión existente. Configure la habilidad por separado: `max skill install --for all`. Los métodos de inicio de sesión y qué hacer si se interrumpe el inicio de sesión se encuentran en [instrucciones de inicio de sesión](./sessions.md).

**La instalación global a través de npm** también instala la habilidad del agente. Predeterminado: para todos los agentes admitidos; `MAX_INSTALL_AGENT=codex|cursor|claude|gemini|all|none` selecciona un agente o deshabilita la instalación de habilidades. La instalación local del paquete y `npx` no cambia la PATH y no instala la habilidad.

### Windows: instalación con un solo comando

Ejecute en PowerShell cuando Node.js 22.16+ o 24+ ya esté instalado:

```powershell
& ([scriptblock]::Create((Invoke-RestMethod 'https://wirecat.dev/install.ps1'))) -Tool max -Agent all
```

El instalador instala el paquete npm, guarda las entradas de la PATH del usuario, agrega la carpeta de comandos npm una vez, actualiza la PATH del PowerShell actual e instala la habilidad. Comprueba que `max` se inicie por nombre. `-Agent codex|cursor|claude|gemini|all|none` elige dónde colocar la habilidad. Ejecutarlo nuevamente actualiza la habilidad y no duplica la PATH. No cambia la política de ejecución de PowerShell.

A través de npm use `npm.cmd install -g @wirecat/max-cli`. Si npm permite scripts de instalación, el paquete agrega su carpeta a la PATH del usuario, preservando las entradas existentes y deja una ejecución funcional a través de `.cmd`. El nuevo terminal encontrará `max` por su nombre. Una terminal ya abierta no verá esto: npm no puede cambiar la PATH de la terminal desde la que se inició; abra una nueva.

Si npm omitió el script de instalación, ejecuta la reparación del paquete instalado:

```powershell
$maxNpmPrefix = (npm.cmd prefix -g).Trim()
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$maxNpmPrefix\node_modules\@wirecat\max-cli\install\windows.ps1" -RepairOnly -Prefix $maxNpmPrefix
$env:Path = "$maxNpmPrefix;$env:Path"
max skill install --for all
max --version
```

La restauración conserva las entradas restantes de la PATH y no cambia la política permanente de PowerShell. Volver a ejecutar no crea duplicados. Diagnóstico - `max doctor`; otros métodos: en la sección [`max` no se encuentra después de instalar ](./troubleshooting.md#max-не-находится-после-установки).

Los primeros comandos para leer chats se encuentran en la sección [iniciar sesión y primeros comandos](./usage.md#вход).

## Desde el código fuente

Esto es necesario si está editando código o desea una versión que aún no se ha publicado.

```sh
git clone git@github.com:WireCatLabs/max-cli.git
cd max-cli
pnpm install
pnpm build
```

A continuación, coloque el comando en PATH:

```sh
pnpm link --global      # теперь работает просто `max`
```

O ejecutarlo por su ruta, sin crear enlaces:

```sh
node dist/bin/max.js --help
```

El paquete se nombra con el alcance `@wirecat/`: el nombre `max-cli` sin el alcance lo ocupa el paquete de otra persona.

## Dónde se guardan los archivos

Tres directorios siguen las convenciones del sistema operativo y dos más se comparten con otras herramientas:

|Qué| Linux | macOS | Windows |
|---|---|---|---|
|ajustes| `~/.config/max-cli/` | `~/Library/Preferences/max-cli/` | `%APPDATA%\max-cli\Config\` |
|estado| `~/.local/share/max-cli/` | `~/Library/Application Support/max-cli/` | `%LOCALAPPDATA%\max-cli\Data\` |
|cache| `~/.cache/max-cli/` | `~/Library/Caches/max-cli/` | `%LOCALAPPDATA%\max-cli\Cache\` |
|copia general de mensajes| `~/.local/share/cli-messaging/messages.db` |bajo `~/Library/Application Support/cli-messaging/`|bajo `%LOCALAPPDATA%\cli-messaging\Data\`|
|modelos de reconocimiento de voz| `~/.cache/cli-common/models/audio/` |bajo `~/Library/Caches/cli-common/`|bajo `%LOCALAPPDATA%\cli-common\Cache\`|

- **configuración** - `config.json`, y `credentials.json` con token, solo si la máquina no tiene llavero.
- **estado** - `profiles/<имя>.json` (dispositivo y contador de entradas), `bots/` (chat visto por los bots y su registro de envío), registros de ejecución (`runs/`) y punto de referencia `inbox --new` (`inbox/`).
- **copia compartida de mensajes** - compartida con otras herramientas en la misma biblioteca, por ejemplo [tg-cli](https://github.com/WireCatLabs/tg-cli). Se describe en la página [Archivo local](./archive.md).
- **Los modelos de reconocimiento de voz** se descargan solo cuando usted lo ordene (`max models audio download`), para [reconocimiento de voz](./audio-recognition.md).

`max doctor` muestra las rutas exactas de este comando.

**El token se guarda en el llavero del sistema operativo**, no en un archivo. `config.json` no tiene un campo para él y su esquema no lo acepta.

Cada directorio se puede transferir mediante variable: `MAX_CONFIG_DIR`, `MAX_STATE_DIR`, `MAX_CACHE_DIR`, `MESSAGING_STORE` (el archivo de copia compartido en sí) y `CLI_COMMON_CACHE_DIR` (modelos).

> ⚠ **Las variables también trasladan la entrada en el titular de la clave.** La sesión guardada con `MAX_CONFIG_DIR`,
> `MAX_STATE_DIR` o `MAX_CACHE_DIR`, no es visible para el comando iniciado sin ellos: el nombre del servicio cambia,
> debajo del cual se encuentra la ficha. El comando responderá "sin sesión", aunque el inicio de sesión sea exitoso. Esto es necesario para un perfil temporal y para pruebas. o poner
> variables siempre o nunca establecidas.

## Autocompletado

Usando Tab, se agregan comandos, acciones, banderas y sus significados, y en lugar de un chat o persona, un número del almacenamiento general de la cuenta seleccionada, con el nombre del chat o el nombre al lado. Agregue una línea a su archivo de configuración de Shell:

```sh
echo 'source <(max complete zsh)' >> ~/.zshrc      # zsh
echo 'source <(max complete bash)' >> ~/.bashrc    # bash
max complete fish | source                         # fish, в config.fish
```

En PowerShell: `max complete powershell | Out-String | Invoke-Expression` en el perfil.

Tab **nunca se conecta a MAX**: hacerlo con cada pulsación supondría iniciar sesión cientos de veces. Los nombres de chats y personas proceden del almacén compartido `messages.db` de la cuenta del perfil elegido. Si todavía no se conoce la cuenta o no existe ese almacén, solo se completan comandos y opciones. Los comandos de bot proponen chats de su lista local. Los chats se proponen por ID y muestran el nombre al lado: un nombre con espacios llegaría a `max` como varias palabras.

## Actualizar

```sh
max upgrade           # тем же менеджером пакетов, которым max поставлен: pnpm, npm или bun
max upgrade --check   # только сказать, есть ли новее; ничего не ставит
```

`max upgrade` no reinicia por sí mismo `max serve` en segundo plano. Un servidor iniciado automáticamente cede: el primer comando nuevo lo detiene y lo sustituye. Un servidor iniciado manualmente conserva el código antiguo: reinícialo con `max server restart`. `max` nunca se actualiza automáticamente.

### Respuesta JSON de actualización

`max upgrade --check --json` informa la versión actual y disponible sin instalación. La respuesta contiene `current`, `latest`, `newer`, `installer`, `command`, `updated` y `restarted`. `restarted`: lista de perfiles cuyos servidores se reiniciaron después de la actualización; para `max` siempre está vacío.

Una vez al día `max` consulta npm; si hay una versión nueva, muestra una línea en stderr al terminar, solo para personas ante el terminal: no con `--json`, tuberías, `--quiet` o `CI`. Se desactiva con `max config set updateCheck false --defaults`.

Desde el código fuente: `git pull && pnpm install && pnpm build`.

## Borrar

Al eliminar se elimina el comando, pero no los datos. Primero, salga mientras `max` todavía está en pie. `sales` a continuación es un ejemplo de un nombre de perfil de bot; repita esta línea para cada bot conectado.

```sh
max server uninstall                   # если ставили фоновую службу
max session end                        # выйти и забыть токен ДО удаления команды
max sales bot auth remove              # забыть токен бота из профиля sales
npm uninstall -g @wirecat/max-cli
rm -rf ~/.config/max-cli ~/.local/share/max-cli ~/.cache/max-cli
```

`max session end` y `bot auth remove` borran los tokens del llavero. Si desinstalas primero el comando, la entrada permanece en el llavero: no causa problemas, pero sigue guardada.

Otras herramientas también necesitan una copia compartida de los mensajes. Elimina `~/.local/share/cli-messaging/` solo si nadie más lo está usando: hay mensajes que cada uno de ellos ha leído.

## Siguiente paso

[Inicie sesión en su cuenta y ejecute los primeros comandos](./usage.md#вход).
