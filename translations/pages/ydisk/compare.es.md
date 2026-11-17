---
title: "Comparación con otras herramientas"
---

Elija una herramienta para su Yandex Disk según el trabajo que quiere hacer: encontrar un documento por lo que dice,
hacer copia de seguridad de carpetas enteras o dejar que un agente de IA trabaje con sus archivos. Esta página reúne
esos trabajos y muestra qué herramienta hace cada uno. Las marcas de `ydisk` vienen de la versión 0.1.0, y las de las
demás herramientas vienen de su propia documentación y su código. Todo se comprobó el 17 de noviembre de 2026. Una
herramienta puede hacer más de lo que dicen sus páginas, y esas celdas llevan ➖.

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

Las herramientas:

- **ydisk**: esta herramienta. Una línea de comandos y un servidor MCP que copian en su ordenador el texto de las
  carpetas del Disco que usted elige, para buscar en él, y trabajan con los archivos del Disco en directo.
- **[MCP de Yandex Disk](https://yandex.ru/dev/yandex-360/mcp/ru/disk)**: el servidor MCP propio de Yandex, que
  funciona en Yandex. Su aplicación de IA se conecta a él por internet. Es una versión preliminar para cuentas con
  una suscripción de pago a Yandex 360.
- **[rclone](https://rclone.org/yandex/)**: una línea de comandos que copia, sincroniza y monta archivos entre su
  ordenador y Yandex Disk u otros muchos almacenamientos.
- **[Yandex Disk para Linux](https://yandex.ru/support/disk-desktop-linux/cli-commands.html)**: el cliente de consola
  oficial de Yandex. Mantiene una carpeta de su ordenador sincronizada con el Disco.
- **[yandex-disk-mcp](https://github.com/gorokhovdenis/yandex-disk-mcp)**: un servidor MCP de código abierto que
  usted ejecuta en su ordenador con su propio token, pensado para subidas y descargas grandes.

No están en la tabla: la biblioteca de Python [yadisk](https://github.com/ivknv/yadisk), para quien escribe sus
propios scripts, y [yandex-workspace-mcp](https://github.com/denis-samatov/yandex-workspace-mcp), un servidor MCP nuevo
para Disco y Wiki que por defecto solo lee y cuyo README dice que aún no se ha probado con una cuenta real.

Existen otros servidores MCP pequeños para Yandex Disk, como [Patr56/yadisk-mcp](https://github.com/Patr56/yadisk-mcp) y
[Antiloop-git/yandex-disk-mcp](https://github.com/Antiloop-git/yandex-disk-mcp). La línea de comandos
[ydcmd](https://github.com/abbat/ydcmd) lista, sube y sincroniza archivos, y un
[issue abierto](https://github.com/abbat/ydcmd/issues/59) cuenta que dejó de funcionar. El registro oficial de MCP no
listaba ningún servidor de Yandex Disk el 17 de noviembre de 2026.

## Qué hace cada herramienta

| Trabajo | ydisk | MCP de Yandex Disk | rclone | Yandex Disk para Linux | yandex-disk-mcp |
|---|:-:|:-:|:-:|:-:|:-:|
| **Encontrar un documento** | | | | | |
| Encontrar un documento por las palabras que contiene | ✅ | ✅ | ❌ | ❌ | ❌ |
| Encontrar un documento por significado, no solo por sus palabras | ✅ | ➖ | ❌ | ❌ | ❌ |
| Buscar en sus documentos sin internet | ✅ | ❌ | 🟡¹ | 🟡¹ | ❌ |
| Encontrar un documento junto con sus chats, correo y notas de otros servicios | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Leer un archivo** | | | | | |
| Un agente lee el texto de un archivo PDF, Word o Excel | ✅ | 🟡² | ❌ | ❌ | 🟡² |
| **Trabajar con archivos en el Disco** | | | | | |
| Subir, copiar y mover archivos | ✅ | ✅ | ✅ | 🟡³ | ✅ |
| Borrar a la papelera y recuperar un archivo | ✅ | 🟡⁴ | 🟡⁴ | ➖ | 🟡⁴ |
| Crear y cerrar un enlace público | ✅ | ✅ | ✅ | ✅ | ❌ |
| Guardar en su ordenador una copia de los propios archivos | 🟡⁵ | ❌ | ✅ | ✅ | 🟡⁶ |
| Poner sus propias etiquetas y notas a los documentos | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Agentes y seguridad** | | | | | |
| Una aplicación de IA trabaja con su Disco por MCP | ✅ | ✅ | ❌ | ❌ | ✅ |
| Un agente con terminal lo ejecuta, con salida JSON y una skill | ✅ | n/a | 🟡⁷ | ❌ | n/a |
| Un agente solo lee hasta que usted permita cambios | ✅ | ➖ | ➖ | n/a | ➖ |
| Permitir o rechazar por separado los borrados y los enlaces públicos | ✅ | 🟡⁸ | ➖ | n/a | ➖ |
| Ver qué haría un cambio antes de hacerlo | ✅ | ➖ | ✅ | ➖ | ➖ |
| Usarlo desde Claude o ChatGPT en el navegador | ✅ | ➖ | ❌ | ❌ | ❌ |
| **Instalación** | | | | | |
| Funciona con una cuenta gratuita de Yandex | ✅ | ❌ | ✅ | ✅ | ✅ |
| Entrar sin registrar su propia aplicación en Yandex | ❌ | ✅ | ✅⁹ | ✅ | ❌ |

¹ Los dos guardan los propios archivos en una carpeta de su ordenador, así que la búsqueda del sistema los encuentra.
Ninguno tiene búsqueda propia.

² Da al agente un enlace de descarga o guarda el archivo, y luego el agente tiene que leerlo por su cuenta.

³ Sincroniza una carpeta: usted mueve archivos en esa carpeta y el cliente envía el cambio.

⁴ Un borrado va a la papelera, pero no hay ningún comando para recuperar el archivo.

⁵ `ydisk` guarda el texto de los archivos PDF, Word, Excel, CSV y de texto, no los archivos. `files download --output`
guarda un archivo.

⁶ Descarga un archivo o una carpeta cuando se le pide, pero no mantiene esa copia al día.

⁷ `rclone lsjson` y otros comandos responden en JSON, pero no hay skill para agentes.

⁸ Por defecto el agente le pregunta antes de cada cambio, también antes de un borrado o un enlace público.

⁹ rclone entra con su propia aplicación de Yandex. En octubre de 2026 hubo usuarios con errores que desaparecían con su
propia aplicación ([issue 10067](https://github.com/rclone/rclone/issues/10067)).

## Cuándo encaja mejor otra herramienta

- **Copia de seguridad o espejo de carpetas enteras, con fotos y vídeos**: rclone o Yandex Disk para Linux. Copian
  los propios archivos y los mantienen sincronizados. `ydisk` guarda texto para buscar.
- **Sin instalar nada ni registrar una aplicación, si ya paga Yandex 360**: el MCP de Yandex Disk. Su aplicación de
  IA se conecta al servidor de Yandex con un enlace de acceso ya preparado.
- **Subir vídeos o carpetas de muchos gigabytes desde un agente**: yandex-disk-mcp. Hace las subidas largas en
  segundo plano, las reanuda y comprueba el MD5 de cada archivo.
- **Su propio programa en Python**: la biblioteca yadisk, que cubre toda la API del Disco.

## Comparación con un agente que usa la web del Disco

Un agente de navegador abre disk.yandex.ru y hace clic. `ydisk` y las demás herramientas de esta página llaman a la API
de Yandex. Esta página no afirma cuál es más rápido, más barato o más fiable, porque no hay una medición publicada.

## Instalación y licencia

| | ydisk | MCP de Yandex Disk | rclone | Yandex Disk para Linux | yandex-disk-mcp |
|---|---|---|---|---|---|
| Instalación | npm, Node 22.16 o un 22.x posterior, o Node 24 o posterior | nada: su aplicación de IA se conecta al servidor de Yandex | un binario, la mayoría de gestores de paquetes | paquetes deb y rpm | npm |
| Sistemas | macOS, Linux, Windows | cualquier aplicación MCP con HTTP | macOS, Linux, Windows y más | Linux | donde funcione Node.js |
| Licencia | Apache-2.0 | servicio de Yandex, suscripción de pago a Yandex 360 | MIT | licencia de Yandex | MIT |
| Acceso | un token de su propia aplicación de Yandex, guardado en el llavero del sistema | un token del enlace preparado por Yandex | la aplicación de rclone en el navegador, o la suya | un código que escribe en el navegador | un token de su propia aplicación de Yandex, en la configuración MCP |

Si `ydisk` le encaja, empiece por la [instalación](./installation.md).

## Cómo se comprobó cada marca

Las marcas de `ydisk` se comprobaron con el paquete publicado 0.1.0, con una carpeta personal vacía y sin iniciar
sesión: `ydisk commands`, el `--help` de cada comando y `--dry-run` en cada cambio para ver el permiso que comprueba.
La búsqueda por significado necesita descargar una vez un modelo de texto, y el uso desde el navegador necesita su
propio túnel.

Las marcas de las demás herramientas vienen de sus propias páginas. Si en esas páginas no aparece nada, la marca es ➖,
nunca ❌, salvo cuando la lista de comandos o herramientas está completa.

- **MCP de Yandex Disk** ([servidor del Disco](https://yandex.ru/dev/yandex-360/mcp/ru/disk),
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
  admite `--dry-run`. No hay comando MCP. Entra con la aplicación propia de rclone salvo que usted indique `client_id`.
- **Yandex Disk para Linux** ([comandos de consola](https://yandex.ru/support/disk-desktop-linux/cli-commands.html)).
  Su lista completa de comandos: `start`, `stop`, `status`, `sync`, `publish`, `unpublish`, `token` y opciones de
  configuración. No hay comandos de búsqueda, mover, borrar ni papelera, y los cambios se hacen en la carpeta
  sincronizada.
- **yandex-disk-mcp** ([README](https://github.com/gorokhovdenis/yandex-disk-mcp/blob/main/README.md)). Su lista
  completa de herramientas: información, listado, metadatos, comparación, crear carpeta, subir, descargar, borrar,
  copiar, mover, últimos subidos. No hay búsqueda ni enlace público. `yandex_disk_delete` mueve a la papelera salvo
  con `permanently`, sin recuperación. Funciona por stdio, con el token en su configuración.
