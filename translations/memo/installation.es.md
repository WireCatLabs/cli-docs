---
title: "Instalación"
---

Esta guía te ayuda a instalar Memo por primera vez, trasladarlo a otro equipo, actualizarlo o eliminarlo. Comprobarás que funciona y sabrás dónde guarda sus archivos. Añadir notas y correo es el siguiente paso, explicado en sus propias guías.

Términos de esta página:

- **Paquete npm**: la forma de distribuir Memo. npm (o pnpm o Bun) lo descarga y añade el comando `memo` al equipo. El paquete es **`@wirecat/cli-memo`**; el comando instalado es **`memo`**.
- **Node.js**: el programa que ejecuta Memo. Instálalo primero.
- **PATH**: la lista de carpetas donde el terminal busca comandos por su nombre. `memo` funciona por nombre solo si su carpeta está en PATH.
- **Almacén local**: un archivo de base de datos del equipo con el texto de tus notas, correo y mensajes. Memo lo comparte con [tg](https://github.com/WireCatLabs/tg-cli) y [max](https://github.com/WireCatLabs/max-cli).
- **Skill**: instrucciones breves para que un agente de IA utilice Memo.

La instalación no inicia sesión, no arranca un servicio en segundo plano ni lee tus notas o correo. Memo lee una carpeta o un buzón solo cuando lo añades y ejecutas `memo sync`. La sincronización periódica se activa por separado con `memo auto start`.

## Qué necesita

- **Node.js 22.16+ (rama 22.x) o 24+**, con npm. Si no lo tienes, pide ayuda a tu agente o descárgalo de [nodejs.org](https://nodejs.org).
- Linux. macOS y Windows aún no se han probado: las pruebas de Memo solo se ejecutan en Linux.

Cada fuente necesita algo más, solo cuando vayas a utilizarla:

| Fuente | Requisito |
|---|---|
| Notas y documentos | Ninguno. Los PDF y Word (`.docx`) requieren dos lectores opcionales: [archivos compatibles](./notes.md#files-memo-can-read) |
| Mensajes de Telegram o MAX | [tg](https://github.com/WireCatLabs/tg-cli) o [max](https://github.com/WireCatLabs/max-cli). Guardan los chats en el almacén local; Memo no inicia sesión en un servicio de mensajería |
| Búsqueda por significado | Un modelo pequeño en el equipo. tg o max lo descarga una vez: `tg models text download e5-small`. Sin él, Memo busca por palabras |
| Correo | [Himalaya](https://github.com/pimalaya/himalaya), el programa con el que Memo lee el buzón ([correo](./mail.md)) |
| Sincronización periódica (`memo auto`) | Linux con systemd. En macOS y Windows, ejecuta `memo sync` personalmente o con tu planificador ([mantener Memo al día](./archive.md)) |

## Instalar

**Lo más fácil: pídeselo a tu agente.**

```text prompt
Install Memo with npm install -g @wirecat/cli-memo.
Check Node.js and npm first and help me set them up if needed.
Then run memo --version and memo --help and tell me if it works.
```

**O instálalo personalmente** con una de estas opciones:

```sh
npm install -g @wirecat/cli-memo
pnpm add -g @wirecat/cli-memo
bun add -g @wirecat/cli-memo
```

Para probarlo sin instalarlo (sigue necesitando Node.js):

```sh
npx @wirecat/cli-memo --help
pnpm dlx @wirecat/cli-memo --help
bunx @wirecat/cli-memo --help
```

Comprueba que funciona:

```sh
memo --version
memo --help            # the list of commands
memo doctor            # where Memo keeps its files and what needs attention; connects to nothing
memo commands --json   # every command and option, for agents and scripts
```

`memo doctor` revisa los ajustes, el almacén, las carpetas de notas, las cuentas de correo y Himalaya, el modelo de búsqueda, el temporizador y el skill. Cada problema incluye el comando para corregirlo; termina con código 1 mientras algo requiera atención. `memo doctor --json` devuelve lo mismo para un agente.

`memo --help` muestra comandos como `notes`, `search`, `mail` y `sync`. Si la instalación terminó pero no se encuentra `memo`, abre un terminal nuevo: uno que ya estaba abierto puede no ver el comando. Si sigue sin aparecer, la carpeta de comandos del gestor de paquetes no está en PATH. `npm prefix -g` muestra esa carpeta (en Linux y macOS el comando está en su subcarpeta `bin`); añádela a PATH o pide ayuda al agente.

## Primer uso

Memo no requiere iniciar sesión ni una configuración inicial. Añade una carpeta de notas, léela y busca:

```sh
memo folders add ~/Documents/Notes   # your notes folder; Obsidian format by default
memo sync --only notes                    # reads the notes, their links and tags
memo search notes "budget"
```

Después, [añade más carpetas](./notes.md#add-a-folder) o [conecta una cuenta de correo](./mail.md).

**El skill del agente.** La instalación global con npm también coloca el skill de Memo en las carpetas de Claude Code (`~/.claude/skills/cli-memo/`) y de Codex o Gemini CLI (`~/.agents/skills/cli-memo/`). `MEMO_INSTALL_AGENT` elige el destino: `all` (predeterminado), `claude`, `codex`, `cursor`, `gemini` o `none` para omitirlo. `npx` y una instalación local no colocan el skill; pnpm y Bun pueden omitir los scripts de instalación. En esos casos ejecuta `memo skill install --for all` (`--for claude` o `--for agents` para un destino). `memo skill show` lo muestra.

## Windows

Abre PowerShell y usa `npm.cmd`, porque PowerShell puede bloquear el script `npm`:

```powershell
npm.cmd install -g @wirecat/cli-memo
memo --version
```

Después abre un terminal nuevo: npm no puede cambiar el PATH del terminal donde se ejecuta. El instalador de Node.js suele añadir la carpeta de comandos de npm a PATH; `npm.cmd prefix -g` muestra cuál es.

## Desde el código fuente

Esta opción sirve para modificar el código de Memo o utilizar una versión aún no publicada.

```sh
git clone git@github.com:WireCatLabs/cli-memo.git
cd cli-memo
pnpm install
pnpm build
```

Después, añade el comando a PATH:

```sh
pnpm link --global   # now plain `memo` works
```

o ejecútalo por su ruta, sin enlazarlo:

```sh
node dist/bin/memo.js --help
```

## Dónde están los archivos

| Datos | Linux y macOS | Windows |
|---|---|---|
| Ajustes | `~/.config/cli-memo/` | `%APPDATA%\cli-memo\Config\` |
| Estado | `~/.local/share/cli-memo/` | `%LOCALAPPDATA%\cli-memo\Data\` |
| Almacén compartido con tg y max | `~/.local/share/WireCat/wirecat.db` | `%LOCALAPPDATA%\WireCat\Data\wirecat.db` |
| Modelos descargados por tg o max | `~/.local/share/WireCat/models/` | `%LOCALAPPDATA%\WireCat\Data\models\` |
| Temporizador tras `memo auto start` | `~/.config/systemd/user/memo-import.timer` y `.service` | — |

- **Ajustes**: `config.json` ([configuración](./configuration.md)): carpetas, cuentas y reglas de correo y temporizador.
- **Estado**: lo último importado de cada carpeta (`folders/`), el bloqueo de sincronizaciones simultáneas (`import.lock`) y el resultado de la última ejecución periódica (`auto/`).
- **El almacén local** contiene notas, correo, mensajes, etiquetas, tareas y recuerdos. Los archivos y el buzón permanecen en su sitio; el almacén conserva una copia de su texto.

`~` representa tu carpeta personal. Las variables de entorno cambian las ubicaciones: `MEMO_CONFIG_DIR` (ajustes), `MEMO_STATE_DIR` (estado), `MESSAGING_STORE` (archivo del almacén) y `WIRECAT_STATE_DIR` (carpeta WireCat con el almacén y los modelos).

> ⚠ **Establece estas variables en todas partes o en ninguna.** Sin ellas, un comando lee otros ajustes y otro almacén e indica que faltan carpetas o correo. El temporizador conserva las variables de `memo auto start`; repite el comando tras cambiarlas. tg y max leen el mismo almacén solo con los mismos `MESSAGING_STORE` o `WIRECAT_STATE_DIR`. Estas variables están pensadas para pruebas y perfiles temporales.

## Actualizar

```sh
memo upgrade --check           # only say whether a newer version exists; installs nothing
memo upgrade                   # update with the package manager that installed Memo: npm, pnpm or Bun
memo skill install --for all   # a global npm install does this for you; pnpm and Bun may not
```

Una vez al día Memo pregunta a npm si existe una versión nueva y, si la hay, escribe una línea en stderr tras el comando. Solo aparece ante una persona en el terminal: no con `--json`, en una tubería ni en ejecuciones periódicas. Desactívala con `"update_check": false` en los ajustes o `MEMO_NO_UPDATE_CHECK=1`. Memo nunca se actualiza por sí solo.

- **El temporizador** usa el Memo actualizado en su siguiente ejecución, sin reiniciarlo. Tras cambiar de Node.js (por ejemplo con nvm) e instalar Memo allí, el siguiente comando `memo` actualiza la ruta del temporizador, de modo que eliminar el Node.js anterior no lo rompe. Solo una instalación global cambia la ruta del temporizador: ejecutarlo desde el código, con `npx` o desde los `node_modules` de otra herramienta no lo modifica.
- **`memo mcp`** conserva la versión anterior hasta que el agente lo reinicie. Reinicia el agente o su servidor MCP.

Desde el código fuente: `git pull && pnpm install && pnpm build`.

## Eliminar

La desinstalación elimina el comando Memo y conserva tus datos. Sigue este orden:

```sh
memo auto stop                       # if you turned on the timer: removes it while memo still exists
npm uninstall -g @wirecat/cli-memo   # or pnpm remove -g, or bun remove -g
rm -rf ~/.claude/skills/cli-memo ~/.agents/skills/cli-memo   # the agent skill
rm -rf ~/.config/cli-memo ~/.local/share/cli-memo            # Memo's settings and state
```

El almacén local permanece. tg y max también lo utilizan; contiene notas, correo, etiquetas y recuerdos. Elimina `~/.local/share/WireCat/` solo si ninguna otra herramienta lo utiliza: guarda todo lo que cada una conservó.

## Desarrollo

Para desarrollar Memo, compílalo [desde el código fuente](#from-sources) y ejecuta las comprobaciones:

```sh
pnpm lint && pnpm typecheck && pnpm test
```

## Siguiente

[Añade tus notas](./notes.md#add-a-folder) y después [conecta el correo](./mail.md).
