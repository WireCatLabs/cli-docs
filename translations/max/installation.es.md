---
title: "Instalación"
---

`max` se instala como un paquete npm normal. Funciona con Node o Bun: no compila nada al instalarse ni inicia procesos por su cuenta. El servidor en segundo plano `max serve` se inicia después, cuando un comando lo necesita (véase `serve` en [configuración](./configuration.md)).

## Requisitos

- **Node 22.16 o posterior**: probado con 24.19.0; 22.16 es la versión mínima indicada en `package.json`.
- **O Bun 1.3+**: probado con 1.3.14, con una comprobación independiente en CI para cada pull request.
- Linux, macOS o Windows: el desarrollo se hace en Linux; las pruebas también pasan en macOS y Windows.

El acceso al llavero del sistema usa un binario ya preparado: no tienes que compilarlo. Si el equipo no tiene llavero, el token se guarda en un archivo junto a la configuración y el comando lo indica en una línea.

## Instalación habitual

Ejecutar sin instalar:

```sh
npx @leemour/max-cli --help
pnpm dlx @leemour/max-cli --help
bunx @leemour/max-cli --help
```

Instalar de forma permanente:

```sh
npm install -g @leemour/max-cli
pnpm add -g @leemour/max-cli
bun add -g @leemour/max-cli
```

El paquete se llama **`@leemour/max-cli`** y el comando que instala es **`max`**.

Comprobar la instalación:

```sh
max --version
max --help              # список команд
```

Si la instalación termina pero no se encuentra `max`, ejecuta `npx @leemour/max-cli doctor`: explicará el motivo y qué comando usar ([solución de problemas](./troubleshooting.md#max-не-находится-после-установки)).

## Desde el código fuente

Úsalo si quieres modificar el código o probar una versión antes de su publicación.

```sh
git clone git@github.com:leemour/max-cli.git
cd max-cli
pnpm install
pnpm build
```

Después puedes añadir el comando a `PATH`:

```sh
pnpm link --global      # теперь работает просто `max`
```

O ejecutarlo por su ruta, sin crear enlaces:

```sh
node dist/bin/max.js --help
```

Comprobar la instalación:

```sh
max --version
max --help              # список команд
```

El nombre sin ámbito (`max-cli`) pertenece a otro paquete desde 2018. El ámbito es obligatorio.

## Dónde se guardan los archivos

Hay tres directorios, según las convenciones de cada sistema operativo:

| Contenido | Linux | macOS | Windows | Archivos |
|---|---|---|---|---|
| configuración | `~/.config/max-cli/` | `~/Library/Preferences/max-cli/` | `%APPDATA%\max-cli\Config\` | `config.json` y el archivo del token si no hay llavero |
| estado | `~/.local/share/max-cli/` | `~/Library/Application Support/max-cli/` | `%LOCALAPPDATA%\max-cli\Data\` | `profiles/<имя>.json`, `bots/`: chats vistos por los bots y su registro de envíos; `runs/`: registros de ejecución |
| caché | `~/.cache/max-cli/` | `~/Library/Caches/max-cli/` | `%LOCALAPPDATA%\max-cli\Cache\` | `<профиль>.db`: copia local de chats y mensajes |

`max doctor` muestra las rutas exactas de este equipo.

**El token se guarda en el llavero del sistema operativo**, no en un archivo. `config.json` no tiene un campo para él y su esquema no lo acepta.

Puedes cambiar cada directorio con una variable de entorno: `MAX_CONFIG_DIR`, `MAX_STATE_DIR`, `MAX_CACHE_DIR`.

> ⚠ **Estas variables también cambian la ubicación de la entrada del llavero.** Una sesión guardada con `MAX_CONFIG_DIR` no es visible para un comando ejecutado sin ella: cambia el nombre del servicio bajo el que se guarda el token. Es útil para perfiles temporales y pruebas, pero puede parecer que no hay sesión aunque el token siga existiendo; al propietario le costó media hora encontrar el motivo. Usa siempre las mismas variables o no las uses.

## Autocompletado

Tab completa comandos, acciones, opciones y valores. Para chats o personas propone un ID del almacén compartido de la cuenta elegida, con su nombre al lado. Añade una línea al archivo de configuración de la shell:

```sh
echo 'source <(max complete zsh)' >> ~/.zshrc      # zsh
echo 'source <(max complete bash)' >> ~/.bashrc    # bash
max complete fish | source                         # fish, в config.fish
```

En PowerShell: `max complete powershell | Out-String | Invoke-Expression` en el perfil.

Tab **nunca se conecta a MAX**: hacerlo con cada pulsación supondría iniciar sesión cientos de veces. Los nombres de chats y personas proceden del almacén compartido `messages.db` de la cuenta del perfil elegido. Si todavía no se conoce la cuenta o no existe ese almacén, solo se completan comandos y opciones. Los comandos de bot proponen chats de su lista local. Los chats se proponen por ID y muestran el nombre al lado: un nombre con espacios llegaría a `max` como varias palabras.

## Actualizar y desinstalar

```sh
max upgrade           # тем же менеджером пакетов, которым max поставлен: pnpm, npm или bun
max upgrade --check   # только сказать, есть ли новее; ничего не ставит
```

Una vez al día, `max` consulta npm para comprobar si hay una versión nueva. Si la hay, escribe una línea en stderr después del comando, solo en una terminal interactiva: no con `--json`, una tubería, `--quiet` ni `CI`. Desactívalo con `max config set updateCheck false --defaults`. `max` nunca se actualiza por sí solo.

Desde el código fuente: `git pull && pnpm install && pnpm build`.

La desinstalación elimina el comando, pero conserva los datos:

```sh
max session end                        # забыть токен ДО удаления команды
max <бот> bot auth remove              # и токен каждого бота
npm uninstall -g @leemour/max-cli
rm -rf ~/.config/max-cli ~/.local/share/max-cli ~/.cache/max-cli ~/.local/share/cli-messaging
```

`max session end` y `bot auth remove` borran los tokens del llavero. Si desinstalas primero el comando, la entrada permanece en el llavero: no causa problemas, pero sigue guardada.

## Siguiente paso

[Uso cotidiano](./usage.md): iniciar sesión y ejecutar los primeros comandos.
