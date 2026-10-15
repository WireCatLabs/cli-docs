---
title: "Cómo funciona Memo"
---

Esta página explica qué pasa con tus notas, tu correo y tus mensajes cuando Memo los usa: dónde se
guarda el texto, qué hace una importación, cómo funcionan los enlaces y las referencias, y qué puede
y qué no puede hacer un agente. Léela cuando quieras saber por qué Memo responde como responde, o
antes de dirigirlo a algo privado.

## El almacén local

Memo guarda todo en un archivo de tu ordenador, el **almacén local** (`wirecat.db`). tg y max
guardan tus mensajes de Telegram y MAX en el mismo archivo, así que Memo puede responder sobre
mensajes, correo y notas a la vez.

| De dónde viene | Quién lo pone en el almacén local |
|---|---|
| Mensajes de Telegram y MAX | tg y max, cuando descargan tus chats |
| Correo | `memo sync --only mail` o `memo sync` |
| Archivos de tus carpetas de notas | `memo sync --only notes` o `memo sync` |
| Tus propias notas, etiquetas, tareas, recuerdos y hechos | Memo, cuando tú o tu agente los añadís |

Memo nunca cambia el original: tus archivos se quedan como están, y tu buzón se abre solo para
lectura. El almacén local guarda una copia de su texto.

## Qué hace una importación

Una importación lee tus carpetas y tus cuentas de correo y pone al día el almacén local.

- **Solo se lee lo que ha cambiado.** Un archivo con el mismo tamaño y la misma hora de cambio que la
  última vez se omite. El correo que ya está guardado se omite. Una segunda importación es rápida.
- **Las ediciones conservan el historial.** Cuando editas un archivo de notas, el almacén local
  guarda el texto antiguo como una versión anterior.
- **Los traslados lo conservan todo.** Un archivo que mueves dentro de su carpeta conserva sus
  enlaces y sus etiquetas.
- **Se respetan los borrados.** Cuando borras un archivo o un correo, su texto sale del almacén local
  en la siguiente importación.
- **Una parada de seguridad.** Si una importación descubre que de repente falta la mayor parte de una
  carpeta o de un buzón (por ejemplo, un disco que no está conectado), no borra nada y te avisa.
- **Se prepara la búsqueda por significado.** Si el modelo de búsqueda está en tu ordenador, la
  importación también prepara el texto nuevo para la búsqueda por significado. `--no-embed` se salta
  este paso.

Dos importaciones nunca se ejecutan a la vez, y una fuente que falla no detiene las demás.

## Carpetas en más de un ordenador

Cuando añades una carpeta, Memo le da un ID (un número corto) en el almacén local. Las notas y los
enlaces usan ese ID, no la ruta de la carpeta. Si usas las mismas notas en otro ordenador,
`memo folders attach` conecta el ID con la ruta de la carpeta en ese ordenador. Como el ID no cambia,
las notas conservan sus enlaces y sus etiquetas.

## Enlaces entre notas y personas

Cuando Memo importa una nota, también lee los enlaces que contiene:

- Un enlace a otra nota de la carpeta se convierte en un enlace a esa nota.
- Un enlace a un nombre, como `[[Kai Sample]]` en Obsidian, se convierte en un enlace a esa persona
  en cuanto hay en el almacén local alguien con ese nombre, apodo o nombre de usuario. Si dos personas
  tienen el mismo nombre, el enlace espera hasta que tú elijas.
- Un enlace escrito como referencia, como `[Kai](person:7)` o `msg:telegram/1/77/42`, enlaza
  directamente con esa persona o ese mensaje.

Un nombre en texto normal **no** es un enlace. Memo no adivina de quién trata una nota a partir de
las palabras que contiene.

## Una persona, varias cuentas

La misma persona puede tener una cuenta de Telegram, una cuenta de MAX y una dirección de correo.
Memo las trata como una sola persona solo después de que tú las enlaces, con `tg contacts link` o
`max contacts link`. Un nombre o un dominio de correo que coinciden nunca bastan. Así los mensajes de
una persona no se mezclan con los de otra.

## Referencias

Cada resultado nombra su fuente con una referencia. Puedes copiar una referencia en otro comando
para etiquetarla, escribir una nota sobre ella o usarla como evidencia.

| Referencia | A qué apunta |
|---|---|
| `note:12` | Una nota que escribiste en Memo |
| `document:3` | Un archivo de una de tus carpetas de notas |
| `msg:telegram/1/77/42` | Un mensaje: el servicio de mensajería, la cuenta, el chat y el mensaje |
| `chat:…`, `contact:…` | Un chat o un contacto en una cuenta |
| `person:…` | Una persona cuyas cuentas enlazaste |
| `organization:…`, `project:…`, `task:…` | Tus organizaciones, proyectos y tareas |
| `memory:…`, `fact:…` | Un recuerdo o un hecho |
| `meeting:…` | Una reunión guardada en el almacén local |

Una referencia de mensaje incluye la cuenta, así que el mismo número de mensaje en otra cuenta es un
mensaje distinto.

## Búsqueda por palabras y por significado

Memo siempre busca por palabras: encuentra notas, correos y mensajes que contienen todas las palabras
que escribiste, incluidas otras formas de cada palabra. Con el modelo de búsqueda en tu ordenador,
también busca por significado, así que `holiday` puede encontrar una nota sobre unas vacaciones. El
modelo se ejecuta en tu ordenador; tu texto no se envía a ningún sitio para esto. Cada resultado
indica cómo se encontró.

Un resultado vacío solo significa que el almacén local no tiene nada que coincida. No demuestra que
algo nunca ocurrió: puede que el chat no esté descargado o que la carpeta no esté importada.

## Los agentes sugieren, tú decides

Tu agente puede añadir tres tipos de registros:

- un **recuerdo**: algo que se ha concluido, como una preferencia;
- un **hecho**: algo que ocurrió, como una decisión;
- una **acción propuesta**: algo que hacer, como una respuesta. Siempre espera hasta que la apruebes o
  la rechaces. Aprobarla la convierte en una tarea para ti. Memo nunca envía un mensaje ni un correo.

Lo que una aplicación añade a través del [servidor MCP](./mcp.md) queda como **propuesto** hasta que
confirmes el recuerdo o aceptes el hecho. A través de MCP, un agente no puede confirmar, aceptar,
aprobar ni rechazar, y cada llamada que hace queda escrita en el registro de agentes
(`memo agents log`), sin los detalles que envió.

El comando `memo` reconoce el terminal de un agente por `AI_AGENT` o `CLAUDECODE`, variables que establecen agentes como Claude Code. Un hecho, recuerdo, vínculo o acción propuesta se atribuye al agente y espera tu revisión, como mediante MCP. Sin ellas, o con `--as-owner`, se atribuye a ti y se confirma al instante. Las variables y `--as-owner` son etiquetas, no un bloqueo: un agente puede establecerlas y escribir como tú.

## Qué puede salir de tu ordenador

Nada, a menos que lo pidas. Por defecto, `memo ask` prepara fuentes para tu propio agente. Envía
texto a un proveedor de IA solo cuando configuras uno y añades `--analyze`, y a un proveedor remoto
solo si además añades `--allow-remote`. Lo que tu agente hace con el texto que lee depende de ese
agente. Consulta [Seguridad](./security.md).
