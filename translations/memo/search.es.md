---
title: "Búsqueda"
---

Esta página te ayuda a encontrar algo que escribiste o recibiste, en tus notas, tu correo o tus
mensajes de Telegram y MAX, y a dar a tu agente las fuentes de una respuesta. Cada resultado nombra
su fuente, para que puedas abrir el original y comprobarlo. Un resultado vacío significa que esa
búsqueda no devolvió coincidencias. Las fuentes elegidas, el historial importado o el índice de búsqueda
pueden estar incompletos.

## Pregunta a tu agente

```text prompt
Usa memo CLI para encontrar lo acordado sobre el presupuesto de Harbour en mis notas, correo y mensajes.
Cita el texto coincidente, muestra la fuente de cada resultado e indica dónde no pudiste buscar.
```

Tu agente elige la búsqueda, lee el texto que coincide y te muestra las fuentes. Puedes comprobar
cada una con `memo notes show` o en la aplicación original.

## Elegir dónde buscar

| Dónde está | Comando |
|---|---|
| No lo sabes | `memo search all 'budget'` |
| Tus notas y archivos | `memo search notes 'budget'` |
| Tu correo | `memo search mail 'budget'` |
| Mensajes de Telegram o MAX | `memo search messages 'budget'` |
| Transcripciones y resúmenes de reuniones guardados | `memo search meetings 'budget' --source zoom:work` |

`search all` busca en mensajes, correo y notas a la vez. No busca reuniones, personas, recuerdos, proyectos ni
tareas; para eso usa `memo context`, `memo search memories` y `memo tasks list`. Cuando sabes dónde
está algo, su propia búsqueda es mejor, porque entiende más palabras de búsqueda.

## Palabras de búsqueda

Una búsqueda encuentra resultados que contienen **todas** las palabras que escribes, incluidas otras
formas de cada palabra (`meeting` también encuentra `meetings`).

| Qué buscar | Consulta |
|---|---|
| Todas las palabras | `budget venue` |
| Una frase exacta | `"budget review"` |
| Una palabra u otra | `budget OR invoice` |
| Sin una palabra | `budget NOT cancelled` |
| Con una etiqueta | `tag:follow-up` |
| En un día o desde una fecha | `date:2026-10-08`, `date:[2026-09-01 TO *]` |
| De alguien o para alguien (correo y mensajes) | `from:kai`, `to:kai@example.com` |
| En el asunto o carpeta de correo | `subject:invoice`, `mailbox:important` |
| Dentro de un adjunto (mensajes y correo) | `content:invoice`, `filename:*.pdf` |

`content:` limita la búsqueda al texto de archivos y `filename:` a sus nombres: `memo search messages 'content:invoice'`. El texto está disponible cuando tg o max lo ha leído (`tg personal attachments extract`) o un agente lo ha escrito.

Pon la búsqueda entre comillas simples para que el terminal se la pase a Memo tal cual:
`memo search notes '"budget review" NOT cancelled'`. `--exact` solo encuentra las palabras tal como
están escritas.

## Acotar tus notas

```sh
memo search notes 'budget' --filter 'tag:work'          # only notes with a tag
memo search notes 'budget' --source notes:2              # only one folder, by the id a hit shows
memo search notes 'budget source:internal'               # only notes you wrote in Memo
memo search notes 'budget' --filter 'date:2026-10-08'    # and a second condition
```

`source:file` muestra solo notas de archivos. El campo de consulta `source:` indica el origen de la nota; la opción `--source` elige las carpetas donde buscar. Los resultados llegan de 20 en 20; `--page 2` abre la siguiente página y `page.next_page` indica su número.

## Buscar en el correo

```sh
memo search mail 'from:kai subject:invoice'
memo search mail 'mailbox:important budget'
memo search mail 'budget' --source email:you@example.com
```

`mailbox:` encuentra una carpeta de correo o una etiqueta de Gmail, como `inbox`, `important` o
`starred`. Sin `--source`, Memo busca en todas las cuentas de correo; `--source email:work,email:personal`
busca en esas dos. También se busca el texto dentro de los adjuntos (`filename:` y `content:`).

## Buscar en reuniones guardadas

Cuando Zoom ya ha archivado tus reuniones en el almacén compartido, Memo puede encontrar localmente pasajes de
transcripciones, títulos de reuniones, resúmenes y texto del chat. No contacta con Zoom ni envía texto a un modelo.
Usa el nombre de tu cuenta guardada en lugar de `zoom:work`. `--source zoom` también funciona si el almacén tiene
exactamente una cuenta de Zoom; una selección ambigua muestra las cuentas entre las que elegir:

```sh
memo search meetings 'budget' --source zoom:work --project HRB --since-time 2026-10-01 --limit 10 --json
memo meetings passage 'meeting:1/42/3/0' --source zoom:work --before-n 2 --after-n 2 --json
```

Copia el `ref` de un resultado en el comando del pasaje. Un resultado de transcripción tiene una referencia de
intervención como `meeting:1/42/3/0`, la referencia de su reunión y `offset_ms`. Un resultado de título, resumen o
chat apunta a la reunión; para leer un pasaje hace falta una intervención de la transcripción. El pasaje incluye
las intervenciones cercanas, las etiquetas de hablante, la revisión y las huellas para que un agente pueda citar
exactamente lo que leyó. Conserva un hablante nulo como desconocido; una etiqueta por sí sola no establece la
identidad de una persona.

`--project` acepta la clave, el nombre o un alias registrado de un proyecto y selecciona los vínculos de reuniones
confirmados. La herramienta MCP `search_meetings` también acepta `tag` y `topic` con etiquetas existentes y sus
alias. Una palabra de proyecto en una transcripción no vincula la reunión con ese proyecto. Para descubrir reuniones
sin vincular, busca por separado los distintos nombres del proyecto sin `--project` y revisa las coincidencias.
`identity_id` y `person_id` de MCP seleccionan reuniones con participantes observados; no limitan los resultados a
lo que dijo esa persona.

La búsqueda de reuniones usa su propia consulta de palabras y sus propias opciones; los campos de consulta de
correo y mensajes de arriba no se aplican. Usa `memo search meetings --help` para las opciones de fecha y proyecto;
MCP también tiene selectores de evento y serie. Las respuestas JSON tienen los estándar `items`, `page`, `next` y
`meta.accounts`; usa el cursor devuelto con la misma cuenta y los mismos filtros. El campo `missing` indica que no
se sabe si el archivo está completo. Aunque la indexación esté lista, una búsqueda vacía no puede demostrar que
ninguna reunión trató el tema. Si los pasajes cambiaron durante la indexación, repite la búsqueda como indica el
siguiente paso. Una transcripción sin archivar o ausente debe obtenerse antes con Zoom.

Siguiente: [convierte pasajes citados de reuniones en hallazgos para revisar](./recipes.md#review-a-meetings-decisions-and-follow-ups).

## Reunir contexto de reuniones de un proyecto

Al preparar una conversación sobre un proyecto, busca sus distintos nombres en las cuentas elegidas.
Así encuentras fragmentos de transcripciones incluso antes de vincular la reunión al proyecto.
Pide a tu agente:

```text prompt
Usa memo CLI para reunir evidencia de Harbour desde mi cuenta de reuniones del trabajo y Telegram.
Busca los últimos 60 días con los alias guardados del proyecto. Muestra fragmentos con referencias,
separa los hechos comunicados de los seguimientos propuestos e indica qué fuentes o transcripciones
faltan. No confirmes hallazgos ni crees tareas.
```

Para usar el comando directamente, sustituye la clave del proyecto y las cuentas por las tuyas:

```sh
memo projects evidence HRB --source zoom:work,telegram:1 --since-time 60d --json
```

Para comparar ejecuciones sobre la misma ventana de tiempo, fija un final exclusivo exacto con `--before-time`:

```sh
memo projects evidence HRB --source zoom:work,telegram:1 --since-time 60d --before-time 2026-10-01T12:00:00Z --json
```

Los días hacia atrás se cuentan desde esa marca de tiempo. Una fecha de inicio explícita en `--since-time` también
conserva ese final; el inicio se incluye y el final se excluye. Usa una marca de tiempo real con `Z` o un desfase UTC,
no solo una fecha. La salida de texto imprime el límite exacto. Mantén `--before-time` y las demás opciones sin
cambios al usar `--cursor`. Una ventana fija no congela el contenido de las fuentes, los alias registrados ni la
selección de cuentas: importaciones, ediciones o eliminaciones posteriores aún pueden cambiar la evidencia.

Cada nombre o alias es una búsqueda separada: todas sus palabras deben aparecer en un mismo texto, en cualquier orden,
como palabras completas; los resultados se unen. También se lee cada mensaje de un chat confirmado como del proyecto
cuando `--source` incluye su cuenta. Esos elementos llevan la etiqueta `linked-chat`: no nombran nada, pertenecen al
chat. Un chat vinculado fuera de `--source` aparece como no leído. `--contact person:<id>` lee cada mensaje y correo
que escribieron las identidades guardadas de esa persona en `--source`, con la etiqueta `sender` (se encuentra por
quién lo escribió, no por palabras), y busca los alias que les diste; su nombre visible en el mensajero no se busca,
porque los textos rara vez lo escriben. Un `--contact "<name>"` literal se busca como palabras.
Un resultado de reunión conserva la referencia exacta del fragmento y usa la fecha de inicio:
una reunión antigua importada hoy sigue siendo antigua. Lee el fragmento y sus vecinos con
`memo meetings passage` antes de sacar conclusiones. La recopilación no crea vínculos al proyecto,
no establece asistentes ni guarda hechos o tareas extraídos.

Un resultado de documento incluye párrafos breves alrededor del primer párrafo con una palabra buscada.
Ayudan a localizar el pasaje, pero no prueban una conclusión. Si `oversized` enumera un documento,
la recopilación no leyó su texto: abre su referencia con `memo notes show` cuando lo necesites.
Mantén la fuente sin leer en el resultado en vez de afirmar que no hay evidencia.

Si `units` indica un índice de reuniones pendiente, ejecuta `memo search meetings` para esa misma
cuenta siguiendo [la búsqueda de reuniones](#search-stored-meetings) y vuelve a recopilar. La
actualización de correo y documentos no indexa fragmentos de transcripciones. Las transcripciones
ausentes deben archivarse primero con su herramienta de reuniones; incluso al terminar las páginas
la cobertura del archivo sigue siendo desconocida.

Continúa una ejecución limitada con el punto devuelto, las mismas opciones y `--cursor`. Comprueba
si las fuentes realmente avanzan: repetir páginas vacías con el mismo estado de error no demuestra
cobertura completa. Indica las fuentes pendientes en la respuesta en vez de reintentar indefinidamente.

Para hechos y seguimientos respaldados por mensajes guardados, correo importado o archivos,
[revisa las propuestas del proyecto con su evidencia](./recipes.md#review-project-facts-and-follow-ups).
Las referencias a fragmentos de transcripciones usan la
[revisión separada de hallazgos de reuniones](./recipes.md#review-a-meetings-decisions-and-follow-ups),
que exige vínculos confirmados entre reunión y proyecto. La recopilación por sí misma no crea ninguno
de los dos tipos de propuesta.

## Búsqueda por significado

Con el modelo de búsqueda en tu ordenador, Memo también busca por significado, así que `holiday`
puede encontrar una nota sobre unas vacaciones. tg o max descarga el modelo una vez:

```sh
npx -y @wirecat/tg-cli local models text download e5-small
```

El modelo se ejecuta en tu ordenador. Después de la descarga, ejecuta `memo sync` para que tus notas
queden preparadas para él. Cada resultado indica si se encontró por palabras, por significado o de
las dos formas. Sin el modelo, Memo dice "Searched by words only" y busca por palabras en las notas guardadas.

## Qué muestra un resultado

Para una nota, un resultado muestra el archivo y la primera línea que coincide. Debajo de los
resultados, Memo muestra las notas y las personas a las que enlazan los resultados:

```text
Projects/Budget.md
  # Budget review

Linked from these notes
  Kai Sample  (nobody by that name yet)  (1)
```

`nobody by that name yet` significa que la nota enlaza a un nombre que todavía no es una persona
conocida en el almacén local. Añade `--json` para obtener la referencia de cada resultado, sus
enlaces y cómo se encontró.

## Dar las fuentes a tu agente

`memo ask` reúne las fuentes para una pregunta, para que tu agente pueda responder y citarlas:

```sh
memo ask 'What is the Harbour budget?' 'Harbour budget' --all
```

Las palabras después de la pregunta indican qué buscar; sin ellas, Memo busca toda la pregunta y cada palabra debe coincidir. `--all` busca en todas las cuentas; `--source telegram:1` elige una. La respuesta enumera fuentes con referencia y texto, el ámbito buscado y lo omitido. Memo no responde a la pregunta ni guarda la respuesta por sí solo.

Memo también puede enviar las fuentes a un proveedor de IA que hayas configurado y devolver su
respuesta: añade `--analyze`, y `--allow-remote` para un proveedor fuera de tu ordenador. Consulta la
[configuración](./configuration.md#environment-variables). La respuesta del proveedor es texto
generado: compárala con las fuentes.

Siguiente: [ver todo sobre una persona](./people.md) o [convertir lo que encontraste en una tarea](./tasks.md).
