---
title: "Comparación con otras herramientas"
---

Elige una herramienta para tu Yandex Disk según el trabajo que quieres hacer: encontrar un documento por lo que dice,
hacer copia de seguridad de carpetas enteras o dejar que un agente de IA trabaje con tus archivos. Esta página reúne
esos trabajos y muestra qué herramienta hace cada uno. Las marcas de `ydisk` vienen de la versión 0.1.0, y las de las
demás herramientas vienen de su propia documentación y su código. Todo se comprobó el 17 de noviembre de 2026. Una
herramienta puede hacer más de lo que dicen sus páginas, y esas celdas llevan ➖.

**En esta página:**

1. [Qué hace cada herramienta](#what-each-tool-does)
2. [Cuándo encaja mejor otra herramienta](#where-another-tool-fits-better)
3. [Comparación con un agente que usa la web del Disk](#compared-with-a-browser-agent)
4. [Instalación y licencia](#install-and-licence)
5. [Cómo se comprobó cada marca](#how-each-mark-was-checked)

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

Las herramientas:

- **ydisk**: esta herramienta. Una línea de comandos y un servidor MCP que copian en tu ordenador el texto de las
  carpetas del Disk que tú eliges, para buscar en él, y trabajan con los archivos del Disk en directo.
- **[MCP de Yandex Disk](https://yandex.ru/dev/yandex-360/mcp/ru/disk)**: el servidor MCP propio de Yandex, que
  funciona en Yandex. Su aplicación de IA se conecta a él por internet. Es una versión preliminar para cuentas con
  una suscripción de pago a Yandex 360.
- **[rclone](https://rclone.org/yandex/)**: una línea de comandos que copia, sincroniza y monta archivos entre tu
  ordenador y Yandex Disk u otros muchos almacenamientos.
- **[Yandex Disk para Linux](https://yandex.ru/support/disk-desktop-linux/cli-commands.html)**: el cliente de consola
  oficial de Yandex. Mantiene una carpeta de tu ordenador sincronizada con el Disk.
- **[yandex-disk-mcp](https://github.com/gorokhovdenis/yandex-disk-mcp)**: un servidor MCP de código abierto que
  ejecutas en tu ordenador con tu propio token, pensado para subidas y descargas grandes.

No están en la tabla: la biblioteca de Python [yadisk](https://github.com/ivknv/yadisk), para quien escribe sus
propios scripts, y [yandex-workspace-mcp](https://github.com/denis-samatov/yandex-workspace-mcp), un servidor MCP nuevo
para Disk y Wiki que por defecto solo lee y cuyo README dice que una ejecución correcta de CI no demuestra una comprobación real, que es opcional.

Existen otros servidores MCP pequeños para Yandex Disk, como [Patr56/yadisk-mcp](https://github.com/Patr56/yadisk-mcp) y
[Antiloop-git/yandex-disk-mcp](https://github.com/Antiloop-git/yandex-disk-mcp). La línea de comandos
[ydcmd](https://github.com/abbat/ydcmd) lista, sube y sincroniza archivos, y un
[issue abierto](https://github.com/abbat/ydcmd/issues/59) cuenta que dejó de funcionar. El registro oficial de MCP no
listaba ningún servidor de Yandex Disk el 17 de noviembre de 2026.

<a id="what-each-tool-does"></a>

## Qué hace cada herramienta

| Trabajo | ydisk | MCP de Yandex Disk | rclone | Yandex Disk para Linux | yandex-disk-mcp |
|---|:-:|:-:|:-:|:-:|:-:|
| **Encontrar un documento** | | | | | |
| Encontrar un documento por las palabras que contiene | ✅ | ✅ | ❌ | ❌ | ❌ |
| Encontrar un documento por significado, no solo por sus palabras | ✅ | ➖ | ❌ | ❌ | ❌ |
| Buscar en tus documentos sin internet | ✅ | ❌ | 🟡¹ | 🟡¹ | ❌ |
| Encontrar un documento junto con tus chats, correo y notas de otros servicios | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Leer un archivo** | | | | | |
| Un agente lee el texto de un archivo PDF, Word o Excel | ✅ | 🟡² | ❌ | ❌ | 🟡³ |
| **Trabajar con archivos en el Disk** | | | | | |
| Subir, copiar y mover archivos | ✅ | ✅ | ✅ | 🟡⁴ | ✅ |
| Borrar a la papelera y recuperar un archivo | ✅ | 🟡⁵ | 🟡⁵ | ➖ | 🟡⁵ |
| Crear y cerrar un enlace público | ✅ | ✅ | ✅ | ✅ | ❌ |
| Guardar en tu ordenador una copia de los propios archivos | 🟡⁶ | ❌ | ✅ | ✅ | 🟡⁷ |
| Poner tus propias etiquetas y notas a los documentos | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Agentes y seguridad** | | | | | |
| Una aplicación de IA trabaja con tu Disk por MCP | ✅ | ✅ | ❌ | ❌ | ✅ |
| Un agente con terminal lo ejecuta, con salida JSON y una skill | ✅ | n/a | 🟡⁸ | ❌ | n/a |
| Un agente solo lee hasta que tú permitas cambios | 🟡⁹ | ➖ | ➖ | n/a | ➖ |
| Permitir o rechazar por separado los borrados y los enlaces públicos | ✅ | 🟡¹⁰ | ➖ | n/a | ➖ |
| Ver qué haría un cambio antes de hacerlo | ✅ | ➖ | ✅ | ➖ | ➖ |
| Usarlo desde Claude o ChatGPT en el navegador | ✅ | ➖ | ❌ | ❌ | ❌ |
| **Instalación** | | | | | |
| Funciona con una cuenta gratuita de Yandex | ✅ | ❌ | ✅ | ✅ | ✅ |
| Entrar sin registrar tu propia aplicación en Yandex | ❌ | ✅ | ✅¹¹ | ✅ | ❌ |

¹ Los dos guardan los propios archivos en una carpeta de tu ordenador, así que la búsqueda del sistema los encuentra.
Ninguno tiene búsqueda propia.

² Da al agente un enlace de descarga, y luego el agente tiene que leer el archivo por su cuenta.

³ Descarga el archivo o la carpeta cuando se le pide, y luego el agente tiene que leer el archivo por su cuenta.

⁴ Sincroniza una carpeta: tú mueves archivos en esa carpeta y el cliente envía el cambio.

⁵ Un borrado va a la papelera, pero no hay ningún comando para recuperar el archivo.

⁶ `ydisk` guarda el texto de los archivos PDF, Word, Excel, CSV y de texto, no los archivos. `files download --output`
guarda un archivo.

⁷ Descarga un archivo o una carpeta cuando se le pide, pero no mantiene esa copia al día.

⁸ `rclone lsjson` y otros comandos responden en JSON, pero no hay skill para agentes.

⁹ El servidor MCP ofrece todos los comandos que cambian el Disk, y un permiso en `ask` se ejecuta sin preguntar por MCP. Para un agente que solo lee, pon `YDISK_READ_ONLY=1` o los permisos en `deny`. `mcp add` pide `--allow-writes` antes de conectar un agente.

¹⁰ Por defecto el agente te pregunta antes de cada cambio, también antes de un borrado o un enlace público.

¹¹ rclone entra con su propia aplicación de Yandex si no le das tu propio `client_id` ([página de rclone sobre Yandex](https://rclone.org/yandex/)). En octubre de 2026 hubo usuarios con errores que desaparecían con su
propia aplicación ([issue 10067](https://github.com/rclone/rclone/issues/10067)).

<a id="where-another-tool-fits-better"></a>

## Cuándo encaja mejor otra herramienta

- **Copia de seguridad o espejo de carpetas enteras, con fotos y vídeos**: rclone o Yandex Disk para Linux. Copian
  los propios archivos y los mantienen sincronizados. `ydisk` guarda texto para buscar.
- **Sin instalar nada ni registrar una aplicación, si ya pagas Yandex 360**: el MCP de Yandex Disk. Tu aplicación de
  IA se conecta al servidor de Yandex con un enlace de acceso ya preparado.
- **Subir vídeos o carpetas de muchos gigabytes desde un agente**: yandex-disk-mcp. Hace las subidas largas en
  segundo plano, las reanuda y comprueba el MD5 de cada archivo.
- **Su propio programa en Python**: la biblioteca yadisk, un cliente de la API REST del Disk ([README](https://github.com/ivknv/yadisk)).

<a id="compared-with-a-browser-agent"></a>

## Comparación con un agente que usa la web del Disk

Un agente de navegador abre disk.yandex.ru y hace clic. `ydisk` y las demás herramientas de esta página llaman a la API
de Yandex. Esta página no afirma cuál es más rápido, más barato o más fiable, porque no hay una medición publicada.

<a id="install-and-licence"></a>

## Instalación y licencia

| | ydisk | MCP de Yandex Disk | rclone | Yandex Disk para Linux | yandex-disk-mcp |
|---|---|---|---|---|---|
| Instalación | npm, Node 22.16 o un 22.x posterior, o Node 24 o posterior | nada: tu aplicación de IA se conecta al servidor de Yandex | un binario, la mayoría de gestores de paquetes | paquetes deb y rpm | npm |
| Sistemas | macOS, Linux, Windows | cualquier aplicación MCP con HTTP | macOS, Linux, Windows y más | Linux | donde funcione Node.js |
| Licencia | Apache-2.0 | servicio de Yandex, suscripción de pago a Yandex 360 | MIT | no se indica en su página | MIT |
| Acceso | un token de tu propia aplicación de Yandex, guardado en el llavero del sistema | un token del enlace preparado por Yandex | la aplicación de rclone en el navegador, o la tuya | un código que escribes en el navegador | un token de tu propia aplicación de Yandex, en la configuración MCP |

Si `ydisk` te encaja, empieza por la [instalación](./installation.md).

<a id="how-each-mark-was-checked"></a>

## Cómo se comprobó cada marca

Las marcas de `ydisk` se comprobaron con el paquete publicado 0.1.0, con una carpeta personal vacía y sin iniciar
sesión: `ydisk commands`, el `--help` de cada comando y `--dry-run` en cada cambio para ver el permiso que comprueba.
La búsqueda por significado necesita descargar una vez un modelo de texto, y el uso desde el navegador necesita tu
propio túnel.

Las marcas de las demás herramientas vienen de sus propias páginas. Si en esas páginas no aparece nada, la marca es ➖,
nunca ❌, salvo cuando la lista de comandos o herramientas está completa.

- **MCP de Yandex Disk** ([servidor del Disk](https://yandex.ru/dev/yandex-360/mcp/ru/disk),
  [quién puede usarlo](https://yandex.ru/dev/yandex-360/mcp/ru/)). Su lista completa de herramientas:
  `disk.search_items` busca archivos «по имени, содержимому, типу и дате» (por nombre, contenido, tipo y fecha).
  `disk.get_download_url` da un enlace, y ninguna herramienta lee el texto de un archivo. `disk.delete_item` mueve a la
  papelera y `disk.list_trash_items` la muestra, sin recuperación. Los enlaces se gestionan con
  `disk.create_public_link` y `disk.update_public_item_permissions`. Acceso: cuentas personales con una suscripción
  de pago a Yandex 360 activa. El agente pregunta antes de un cambio «por defecto». La página describe la configuración
  para Codex y Claude Code, no para aplicaciones de navegador, así que esa fila es ➖. Funciona en los servidores de
  Yandex, así que no busca sin internet.
- **rclone** ([página de Yandex](https://rclone.org/yandex/), [comandos](https://rclone.org/commands/)). Ningún
  comando busca dentro de los archivos. Tiene `copy`, `move`, `sync` y `mount`. `rclone link` crea un enlace público.
  `delete` va a la papelera salvo con `--yandex-hard-delete`, y `cleanup` la vacía, sin recuperación. Todo cambio
  admite `--dry-run`. No hay comando MCP. Entra con la aplicación propia de rclone salvo que indiques `client_id`.
- **Yandex Disk para Linux** ([comandos de consola](https://yandex.ru/support/disk-desktop-linux/cli-commands.html)).
  Su lista completa de comandos: `start`, `stop`, `status`, `sync`, `publish`, `unpublish`, `token` y opciones de
  configuración. No hay comandos de búsqueda, mover, borrar ni papelera, y los cambios se hacen en la carpeta
  sincronizada.
- **yandex-disk-mcp** ([README](https://github.com/gorokhovdenis/yandex-disk-mcp/blob/main/README.md)). Su lista
  completa de herramientas: información, listado, metadatos, comparación, crear carpeta, subir, descargar, borrar,
  copiar, mover, últimos subidos. No hay búsqueda ni enlace público. `yandex_disk_delete` mueve a la papelera salvo
  con `permanently`, sin recuperación. Funciona por stdio, con el token en su configuración.
