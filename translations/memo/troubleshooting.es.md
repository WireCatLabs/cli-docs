---
title: "Solución de problemas"
---

Esta página te ayuda cuando Memo no hace lo que esperabas. Busca lo que dice la pantalla o lo que
notaste y sigue los pasos. Para pedir ayuda a tu agente, dale el mensaje completo que mostró Memo.

## `memo: command not found`

Memo no está instalado, o la terminal se abrió antes de instalarlo. Cierra la terminal, abre una nueva
y ejecuta `memo --help`. Si sigue fallando, instala Memo de nuevo:
`npm install -g @wirecat/cli-memo` ([instalación](./installation.md)).

## Una nota o un archivo no aparece en la búsqueda

1. Ejecuta `memo sync --only notes` y lee el informe. Muestra los archivos que no pudo leer y por qué.
2. Comprueba que la carpeta del archivo está en `memo folders list` y que `notes.ignore` no omite el
   archivo en el [archivo de configuración](./configuration.md#notes).
3. Busca una palabra que sepas que está en el archivo. Una búsqueda encuentra resultados que contienen
   **todas** las palabras, así que una frase larga a menudo no encuentra nada; usa dos o tres palabras
   clave.
4. Los PDF escaneados no tienen texto que leer, y los archivos antiguos `.xls` no se pueden leer: el informe
   los muestra en "not read".

## Aparece "Searched by words only"

El modelo de búsqueda para la búsqueda por significado no está en tu ordenador. Memo sigue encontrando
todas las notas que contienen tus palabras. Para buscar también por significado, descarga el modelo
con tg o max y luego importa:

```sh
memo models download embeddinggemma
memo sync
```

## Aparece "nobody by that name yet"

Una nota enlaza a un nombre, como `[[Kai Sample]]`, pero en el almacén local todavía no hay nadie con
ese nombre. El enlace empieza a funcionar cuando se descargan los chats de esa persona con tg o max.
Si dos personas tienen el mismo nombre, enlaza a la correcta con una referencia como `[Kai](person:7)`.

## La importación rechaza una carpeta

Cada carpeta necesita un ID del almacén local. Añádela con `memo folders add /path/to/folder`. Si la
carpeta se añadió en otro ordenador, conéctala en su lugar: `memo folders list` muestra su ID y
`memo folders update ID /path/to/folder` la conecta ([detalles](./notes.md#use-the-same-notes-on-another-computer)).

## Una importación no borró nada y mostró un aviso

La importación detectó que faltaba de golpe la mayor parte de una carpeta y se detuvo
para proteger tus datos. Comprueba que la carpeta o el disco están ahí y luego importa de nuevo.

## Aparece "no mail account"

`no mail account` significa que el almacén no tiene correo de esa dirección. Memo no importa correo: lo hace el CLI
[mail](./mail.md#bring-mail-in-with-mail), con `mail <profile> sync`, y después `memo search mail` lo encuentra.
`--source email:<address>` recibe la dirección del buzón. Si es incorrecta, Memo enumera las que tiene el almacén.

## Aparece "memo sync no longer imports mail"

La configuración aún tiene los antiguos ajustes `mail` de Memo, que nada lee. `memo doctor` nombra los buzones que enumeran:
sincroniza cada uno con `mail <profile> session start --address <address>` y después `mail <profile> sync`. El correo que
importó Memo se queda en el almacén. `memo config unset mail` elimina los ajustes antiguos y el mensaje.

## Añadir una fuente

`memo sources add` se niega con un motivo en `--json` (`error.reason`) y dice qué hacer después. Cuando se niega, no
se guarda nada.

| Motivo | Qué pasó | Qué hacer |
|---|---|---|
| `source.unsupported` | Ningún lector acepta este tipo de archivo o página | Guárdalo como PDF, Word o texto plano y añade ese archivo |
| `source.no-text` | El archivo, la página o el texto pegado no tienen texto | Añade un archivo con texto o pega el texto con `memo sources add -` |
| `source.unreadable` | El lector no pudo leerlo, está dañado o bloqueado | Ábrelo, guárdalo de nuevo o como PDF o texto plano y añade ese |
| `source.engine-missing` | El lector de este tipo de archivo no está instalado | Reinstala Memo: `npm install -g @wirecat/cli-memo` |
| `source.too-large` | Pasa de 50 MiB, o de lo que lee su lector | Añade una parte más pequeña o guarda solo su texto y añádelo |
| `source.url-refused` | No es una dirección `http` o `https` de internet público. Por ejemplo `localhost`, una dirección de la red de casa, un enlace `file:`, un enlace con usuario o contraseña o una redirección de `https` a `http` sin cifrar | Da la dirección de una página pública |
| `source.url-status` | El sitio respondió con un error, como 404 | Comprueba la dirección en un navegador. Si solo se abre para ti, guarda la página como archivo y añádelo |
| `source.url-timeout` | La página no llegó en 30 segundos | Inténtalo más tarde o guarda la página como archivo y añádelo |
| `source.url-redirects` | El sitio reenvió la petición más de 5 veces | Abre la dirección en un navegador y añade la dirección en la que termina |
| `source.url-unreachable` | No se pudo encontrar ni alcanzar el sitio | Comprueba la dirección y la conexión, o guarda la página como archivo |
| `source.needs-sign-in` | La página pide iniciar sesión, como un Google Doc privado | Añádela con tu cuenta de Google con la sesión iniciada: `drive documents add <url> --profiles <names\|all>` (o `drive <profile> documents add <url>`) |

Un PDF escaneado o una imagen no se rechazan. Se guardan por su título y sus temas, con `read: "no-text"`.

## Leer una fuente para sacar hechos

`memo sources suggest` y `memo sources readers set` se niegan con estos motivos. Cuando se niegan, no se añade nada.

| Motivo | Qué pasó | Qué hacer |
|---|---|---|
| `reader.none-chosen` | No hay lector elegido. La negativa los lista | `memo sources readers set <reader>` |
| `reader.unknown` | Memo no conoce ese lector | Da uno de los que lista `memo sources readers list` |
| `reader.owner-picks` | Un agente nombró un lector o un modelo, o intentó elegir uno | Solo tú eliges. El agente lee con tu lector |
| `reader.model-missing` | Ollama o un lector de API no tienen modelo, o Ollama no tiene ese | `memo sources readers set <reader> --model <model>`, y para Ollama `ollama pull <model>` |
| `reader.unavailable` | Claude Code o Codex no están instalados | Instálalo o elige otro lector |
| `reader.failed` | El lector falló. Sin sesión iniciada, versión antigua, clave rechazada o cuenta sin saldo | `memo sources readers list` nombra el problema. Inicia sesión, actualiza o ejecuta `memo models keys set <provider>` |
| `reader.no-key` | No hay clave guardada para el lector de API | `memo models keys set <provider>` |
| `reader.not-running` | Ollama no se está ejecutando en este ordenador | `ollama serve` y vuelve a intentarlo |
| `reader.limit` | Se alcanzó el límite del proveedor | Inténtalo más tarde |
| `reader.timeout` | El lector no respondió en 10 minutos | Vuelve a intentarlo o añade una parte más pequeña de la fuente |
| `reader.unusable-answer` | La respuesta no era el JSON que pidió Memo | Vuelve a intentarlo con `--rescan` o con otro modelo |

Un lote sin hechos significa que se descartaron todos los hechos propuestos. `dropped` dice por qué en cada uno.

## Se rechaza la edición de una nota

La revisión que indicaste no es la actual: la nota cambió después de que la leyeras. Ejecuta
`memo notes show note:ID --json`, toma la `revision` actual y edita de nuevo.

## El contexto de una persona está vacío o le falta algo

- Los chats de la persona todavía no están descargados. Descárgalos con tg o max.
- Las cuentas no están vinculadas. Vincúlalas con `tg personal contacts link` ([detalles](./people.md#link-a-persons-accounts)).
- Si tienes varias cuentas en un servicio de mensajería, añade `--source`, como `--source telegram:1`.
- Una nota que solo menciona el nombre en su texto no se incluye; enlázala en su lugar.

## Aparece "give --account", "give --source" o "names 2 accounts; give one"

El comando trabaja en una sola cuenta y Memo no elige una por ti. Un comando que cambia algo
acepta `--account` con el proveedor y el ID de la cuenta, como `--account telegram:1`; uno que lee
acepta `--source` con la misma forma. El error enumera las cuentas que hay en el almacén.

## Faltan datos de una versión anterior

Las versiones anteriores de Memo guardaban los datos en un archivo llamado `messages.db`. La versión
actual usa el almacén local compartido, `wirecat.db`, y no lee el archivo antiguo. Añade de nuevo cada
carpeta con `memo folders add` y luego ejecuta `memo sync --only notes` y `memo sync --only mail`.

## La ayuda muestra todos los comandos

Una ruta en un solo argumento, como `"projects add"`, se rechaza indicando las palabras correctas. Un bucle puede pasarla así: en zsh, `for c in "projects add"; do memo $c --help; done` conserva `$c` entero. Usa `memo ${=c} --help` en zsh o recorre las palabras.

## Si sigues sin solución

Antes de informar de un error, compara `memo --version` con `npm view @wirecat/cli-memo version`. Si tu versión es anterior, actualiza y prueba de nuevo: el fallo puede estar corregido.

Ejecuta de nuevo el comando que falla con `--json` y da la respuesta completa a tu agente, o
[abre una incidencia](https://github.com/WireCatLabs/cli-memo/issues) con el comando y el mensaje. No
incluyas notas privadas, direcciones de correo ni mensajes.
