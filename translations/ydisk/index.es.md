---
title: "ydisk"
---

Encuentra cualquier documento de tu Yandex Disk por lo que dice y deja que tu agente de IA lo lea, lo archive y lo
comparta por ti. `ydisk` copia a tu ordenador el texto de las carpetas del Disk que elijas, así que una búsqueda de «lease» o «договор
аренды» encuentra el PDF aunque se llame `scan_0042.pdf`, e incluso sin internet. Cuando necesitas el Disk mismo, la
misma herramienta lista, descarga, sube, mueve y comparte archivos allí.

Un agente con `ydisk` responde a «¿dónde está el contrato con la imprenta y qué condiciones de pago tiene?» con la
cita y la ruta del archivo en el Disk. Funciona con Claude Code, Codex, Gemini CLI y otros agentes que ejecutan
comandos, con Claude Desktop y Cursor por MCP, y con ChatGPT y Claude en el navegador a través de tu propio túnel.

Necesitas Node.js y un token OAuth de Yandex, una clave que permite a la herramienta usar tu Disk. Conseguir el token
lleva unos cinco minutos, una sola vez.

**En esta página:**

1. [Qué obtienes](#what-you-get)
2. [Cómo funciona](#how-it-works)
3. [Pruébalo en cinco comandos](#try-it-in-five-commands)
4. [Pregunta a tu agente](#ask-your-agent)
5. [Adónde ir después](#where-to-go-next)

## Qué obtienes

- **Busca dentro de tus archivos, no solo en sus nombres.** Se puede buscar en el texto de PDF, Word (`.docx`, `.doc`), Excel
  (`.xlsx`), PowerPoint (`.pptx`), OpenDocument, RTF, HTML, EPUB, CSV, TSV, texto plano y Markdown. Los escaneos y las
  imágenes JPEG, PNG y WebP se leen por [OCR](./usage.md#scans-and-pictures), en tu ordenador por defecto. La búsqueda encuentra otras formas de una palabra en ruso y en inglés, y
  encuentra un documento por su significado cuando su texto ya está indexado.
- **Busca sin internet.** La búsqueda lee la copia de tu ordenador, así que es rápida y no hace ninguna petición a
  Yandex.
- **Todo el Disk, en vivo.** Lista, lee, descarga, sube, copia, mueve, envía a la papelera, restaura y comparte
  archivos sin abrir un navegador.
- **Edita un archivo donde está.** Tú o tu agente cambiáis una nota, celdas de Excel o párrafos de Word en el Disk sin
  descargarlos a mano. El resto del archivo queda como estaba, y lo que la edición reemplazó se guarda en tu
  ordenador. Un archivo sin enlace público lo comprueba el propio Disk en el momento de escribir, y uno compartido se
  comprueba justo antes. Mira [edita un archivo en el Disk](./usage.md#edit-a-file-on-the-disk).
- **Una carpeta al día con el Disk.** Un espejo mantiene igual una carpeta de tu ordenador y una del Disk en ambos
  sentidos. Un archivo de texto editado en los dos lados se fusiona, y un conflicto real te espera con las diferencias.
  Se detiene antes de muchos borrados o reemplazos. Mira [espejos](./mirrors.md).
- **Seguro para dárselo a un agente.** En un terminal, la herramienta pregunta antes de borrar, sobrescribir o crear
  un enlace público. Para un agente puedes desactivar cada una de esas preguntas o permitir solo la lectura.
- **Una búsqueda en todas tus fuentes.** La copia está en el mismo almacén local que tu Telegram, WhatsApp, correo,
  notas y reuniones de las otras herramientas de WireCat, así que una búsqueda lo cubre todo.
- **Gratis y de código abierto.** Apache 2.0, en macOS, Linux y Windows. Sin cuenta de WireCat y sin servidor de
  WireCat: la herramienta habla con la API oficial de Yandex desde tu ordenador.

## Cómo funciona

- **Un perfil por cuenta.** Un perfil es el nombre que eliges para una cuenta de Yandex, como `personal` o `work`.
  Todo comando que usa una cuenta empieza con él: `ydisk personal search budget`.
- **Una copia del texto, no de los archivos.** `sync` lee las carpetas que elegiste y guarda su texto en el almacén
  local, un único archivo de base de datos en tu ordenador. Los archivos siguen en el Disk. Las fotos y otros
  archivos sin texto se guardan solo por su nombre.
- **Solo las carpetas que eliges.** Yandex Disk no avisa a la herramienta de lo que cambió, así que cada sincronización
  vuelve a listar las carpetas elegidas y descarga solo los archivos cuyo contenido cambió. Elige las carpetas que
  importan, no todo el Disk.
- **Los comandos en vivo van al Disk.** Los comandos `files` trabajan directamente en el Disk y no necesitan
  sincronización.

## Pruébalo en cinco comandos

Después de [instalar la herramienta e iniciar sesión](./installation.md):

```sh
ydisk personal folders browse
ydisk personal folders add /Documents
ydisk personal sync
ydisk personal search "quarterly budget"
ydisk personal files list --folder /Documents
```

El primer comando lista las carpetas de la raíz de tu Disk. Los dos siguientes copian el texto de `/Documents`. La
búsqueda responde desde esa copia, y el último comando lee la carpeta en vivo desde el Disk.

## Pregunta a tu agente

Instala una vez el skill de la herramienta con `ydisk skill install` y pide lo que necesitas con palabras normales:

```text prompt
Use ydisk CLI with profile personal. Find the lease for the flat in my Disk folders.
Quote the notice period and give me the file's path on the Disk. Do not change any files.
```

El agente busca primero en la copia y lee en vivo desde el Disk un archivo que esté fuera de las carpetas elegidas.
Encontrarás más peticiones en las [recetas](./recipes.md).

## Adónde ir después

- [Instala e inicia sesión](./installation.md): Node.js, el token de Yandex paso a paso y la primera comprobación.
- [Carpetas y sincronización](./usage.md): elige carpetas, mantén la copia al día y trabaja con archivos en vivo.
- [Encuentra un documento](./search.md): palabras, formas de palabras, significado, nombres de archivo.
- [Conecta tu agente](./mcp.md): el skill, Claude Code, Codex, Claude Desktop, Cursor y aplicaciones del navegador.
- [Comparación con otras herramientas](./compare.md): rclone, el cliente propio de Yandex y los servidores MCP de Yandex Disk.
