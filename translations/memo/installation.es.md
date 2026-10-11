---
title: "Instalación"
---

Esta página te ayuda a instalar Memo, comprobar que funciona y saber dónde guarda sus archivos. Al
terminar, `memo --help` muestra los comandos de Memo y puedes importar tu primera carpeta de notas.
Necesitas Node.js; todo lo demás de esta página solo hace falta para las fuentes que lo usan.

## Qué necesita

- **Node.js 22.16 o posterior** (versión 22.16+ o 24+), con npm. Node.js ejecuta Memo, y npm lo
  instala. Si no los tienes, pide a tu agente que te ayude a instalarlos, o descárgalos
  de [nodejs.org](https://nodejs.org).
- **Notas y documentos:** nada más. Los archivos PDF y Word (`.docx`) necesitan dos lectores
  opcionales; consulta [los archivos que Memo puede leer](./notes.md#files-memo-can-read).
- **Mensajes:** [tg](https://github.com/WireCatLabs/tg-cli) para Telegram o
  [max](https://github.com/WireCatLabs/max-cli) para MAX. Guardan tus chats en el almacén local, y
  Memo los lee desde ahí. Memo no inicia sesión en ningún servicio de mensajería por sí mismo.
- **Búsqueda por significado:** un pequeño modelo de búsqueda que se ejecuta en tu ordenador. tg o
  max lo descarga una vez: `tg models text download e5-small`, o `max models text download e5-small`.
  Sin él, Memo busca por palabras.
- **Correo:** [Himalaya](https://github.com/pimalaya/himalaya), un programa de correo que Memo usa
  para leer tu buzón ([correo](./mail.md)).
- **Importar con un temporizador** (`memo auto`): Linux. En macOS y Windows, ejecuta `memo import`
  tú mismo o desde tu propio programador de tareas ([mantener Memo al día](./archive.md)).

## Instalar

**Lo más fácil: pídeselo a tu agente.**

```text prompt
Install Memo with npm install -g @wirecat/cli-memo.
Check Node.js and npm first and help me set them up if needed.
Then run memo --help and tell me if it works.
```

**O instálalo tú.** Abre un terminal y ejecuta:

```sh
npm install -g @wirecat/cli-memo
memo --help
```

En Windows, abre PowerShell y ejecuta:

```powershell
npm.cmd install -g @wirecat/cli-memo
memo --help
```

`memo --help` debería mostrar comandos como `notes`, `search` y `tags`. Si el terminal dice que no
encuentra el comando, ciérralo, abre uno nuevo y vuelve a intentarlo.

Memo no tiene un paso de inicio de sesión. Después, [añade una carpeta de notas](./notes.md#add-a-folder)
o [conecta una cuenta de correo](./mail.md).

## Dónde están los archivos

| Qué | Dónde |
|---|---|
| Ajustes | `~/.config/cli-memo/config.json` ([configuración](./configuration.md)) |
| Tus mensajes, correo, notas, etiquetas, tareas y recuerdos | El almacén local, `wirecat.db`, compartido con tg y max |
| Lo último que este ordenador importó, para cada carpeta | La carpeta de estado de Memo |

`~` significa tu carpeta personal. Tus archivos de notas y tu buzón se quedan donde están; el almacén
local guarda una copia de su texto.

## Actualizar y quitar

```sh
npm install -g @wirecat/cli-memo     # update to the latest version
npm uninstall -g @wirecat/cli-memo   # remove the memo command
```

Si activaste el temporizador, ejecuta `memo auto off` antes de quitar Memo. Quitar Memo conserva el
almacén local y los ajustes, porque tg y max usan el mismo almacén.

## Desarrollo

Para trabajar en Memo, clona [el repositorio](https://github.com/WireCatLabs/cli-memo) y ejecuta:

```sh
pnpm install
pnpm lint && pnpm typecheck && pnpm test
```
