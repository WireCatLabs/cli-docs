---
title: "Búsqueda"
---

Esta página te ayuda a encontrar algo que escribiste o recibiste, en tus notas, tu correo o tus
mensajes de Telegram y MAX, y a dar a tu agente las fuentes de una respuesta. Cada resultado nombra
su fuente, para que puedas abrir el original y comprobarlo. Un resultado vacío solo significa que el
almacén local no tiene nada que coincida; puede que el chat no esté descargado o que la carpeta aún
no esté importada.

## Pregunta a tu agente

```text prompt
Use memo CLI to find what was agreed about the Harbour budget, in my notes, mail and messages.
Quote the matching text, show the source of each result and tell me what you could not search.
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

`search all` busca en mensajes, correo y notas a la vez. No busca personas, recuerdos, proyectos ni
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

`content:` limita la búsqueda al texto de archivos y `filename:` a sus nombres: `memo search messages 'content:invoice'`. El texto está disponible cuando tg o max lo ha leído (`tg attachments extract`) o un agente lo ha escrito.

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
memo search mail 'budget' --account you@example.com
```

`mailbox:` encuentra una carpeta de correo o una etiqueta de Gmail, como `inbox`, `important` o
`starred`. Sin `--account`, Memo busca en todas las cuentas de correo. También se busca el texto
dentro de los adjuntos (`filename:` y `content:`).

## Búsqueda por significado

Con el modelo de búsqueda en tu ordenador, Memo también busca por significado, así que `holiday`
puede encontrar una nota sobre unas vacaciones. tg o max descarga el modelo una vez:

```sh
tg models text download e5-small    # or: max models text download e5-small
```

El modelo se ejecuta en tu ordenador. Después de la descarga, ejecuta `memo sync` para que tus notas
queden preparadas para él. Cada resultado indica si se encontró por palabras, por significado o de
las dos formas. Sin el modelo, Memo dice "Searched by words only" y aun así encuentra todas las notas
que contienen las palabras.

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

Las palabras después de la pregunta indican qué buscar; sin ellas, Memo busca toda la pregunta y cada palabra debe coincidir. `--all` busca en todas las cuentas; `--provider telegram --account 1` elige una. La respuesta enumera fuentes con referencia y texto, el ámbito buscado y lo omitido. Memo no responde a la pregunta ni guarda la respuesta por sí solo.

Memo también puede enviar las fuentes a un proveedor de IA que hayas configurado y devolver su
respuesta: añade `--analyze`, y `--allow-remote` para un proveedor fuera de tu ordenador. Consulta la
[configuración](./configuration.md#environment-variables). La respuesta del proveedor es texto
generado: compárala con las fuentes.

Siguiente: [ver todo sobre una persona](./people.md) o [convertir lo que encontraste en una tarea](./tasks.md).
