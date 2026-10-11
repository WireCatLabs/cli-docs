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
tareas; para eso usa `memo context`, `memo memories search` y `memo tasks list`. Cuando sabes dónde
está algo, su propia búsqueda es mejor, porque entiende más palabras de búsqueda.

## Palabras de búsqueda

Una búsqueda encuentra resultados que contienen **todas** las palabras que escribes, incluidas otras
formas de cada palabra (`meeting` también encuentra `meetings`).

| Para encontrar | Escribe |
|---|---|
| Todas estas palabras | `budget venue` |
| Una frase exacta | `"budget review"` |
| Una palabra u otra | `budget OR invoice` |
| Sin una palabra | `budget NOT cancelled` |
| Con una etiqueta | `tag:follow-up` |
| En un día, o desde un día en adelante | `date:2026-10-08`, `date:[2026-09-01 TO *]` |
| De alguien o para alguien (correo y mensajes) | `from:kai`, `to:kai@example.com` |
| En el asunto o en una carpeta de correo (correo) | `subject:invoice`, `mailbox:important` |

Pon la búsqueda entre comillas simples para que el terminal se la pase a Memo tal cual:
`memo search notes '"budget review" NOT cancelled'`. `--exact` solo encuentra las palabras tal como
están escritas.

## Acotar tus notas

```sh
memo search notes 'budget' --tag work                   # only notes with a tag
memo search notes 'budget' --folder /path/to/notes       # only one folder
memo search notes 'budget' --type internal               # only notes you wrote in Memo
memo search notes 'budget' --filter 'date:2026-10-08'    # and a second condition
```

`--type file` muestra solo las notas de archivos. Los resultados llegan de 20 en 20; cuando hay más,
la respuesta da un `nextOffset`, y `--offset` con ese número muestra la página siguiente.

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

El modelo se ejecuta en tu ordenador. Después de la descarga, ejecuta `memo import` para que tus notas
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
memo ask 'What is the Harbour budget?' --all --query 'Harbour budget'
```

`--query` indica las palabras que hay que buscar; sin él, Memo busca la pregunta entera, y todas las
palabras tienen que coincidir. `--all` busca en todas las cuentas; usa
`--provider telegram --account 1` para una sola cuenta. La respuesta muestra cada fuente con su
referencia y su texto, qué se buscó y si algo quedó fuera. Memo no responde la pregunta por sí mismo
y no guarda la respuesta.

Memo también puede enviar las fuentes a un proveedor de IA que hayas configurado y devolver su
respuesta: añade `--model`, y `--allow-remote` para un proveedor fuera de tu ordenador. Consulta la
[configuración](./configuration.md#environment-variables). La respuesta del proveedor es texto
generado: compárala con las fuentes.

Siguiente: [ver todo sobre una persona](./people.md) o [convertir lo que encontraste en una tarea](./tasks.md).
