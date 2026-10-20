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

La importación deja los originales intactos: los archivos no cambian y el buzón se abre solo para lectura.
El almacén local conserva una copia del texto. Los [comandos de limpieza de Gmail](./mail.md#clean-up-gmail)
mueven el correo elegido a la Papelera o lo restauran solo con `--yes`; el temporizador nunca ejecuta la limpieza.

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

Dos importaciones de Memo nunca se ejecutan a la vez, y una fuente que falla no detiene las demás.

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
Memo las trata como una sola persona solo después de que tú las enlaces, con `tg personal contacts link` o
`max personal contacts link`. Un nombre o un dominio de correo que coinciden nunca bastan. Así los mensajes de
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

<a id="agents-suggest-you-decide"></a>
<a id="los-agentes-sugieren-tú-decides"></a>

## Autoría del agente y revisión

Tu agente puede añadir tres tipos de registros:

- un **recuerdo**: algo que se ha concluido, como una preferencia;
- un **hecho**: algo que ocurrió, como una decisión;
- una **acción propuesta**: algo que hacer, como una respuesta. Siempre espera hasta que la apruebes o
  la rechaces. Aprobarla la convierte en una tarea para ti. Memo nunca envía un mensaje ni un correo.

Los recuerdos y los hechos registrados directamente mediante el [servidor MCP](./mcp.md) empiezan como **propuestos**. MCP no confirma recuerdos, no acepta directamente hechos propuestos existentes ni aprueba acciones en cuentas externas. Cada llamada se escribe en el registro de agentes (`memo agents log`), sin los detalles enviados.

Por defecto, un agente puede confirmar o rechazar propuestas de proyecto con un motivo registrado: confirmarlas puede crear hechos aceptados y tareas numeradas o confirmar un documento clave. Configura [`agent_decisions: false`](./configuration.md#agent_decisions) para que solo el propietario decida las propuestas de proyecto. Leer y proponer siguen disponibles. Las conclusiones de reuniones siguen requiriendo al propietario.

El comando `memo` reconoce el terminal de un agente por `AI_AGENT` o `CLAUDECODE`, variables que establecen agentes como Claude Code. Allí, un hecho registrado directamente, recuerdo o vínculo se atribuye al agente y empieza como propuesto. Sin ellas, o con `--as-owner`, se atribuye a ti: los recuerdos y vínculos se confirman y los hechos se aceptan al instante. Las acciones propuestas siguen esperando aprobación. Las variables y `--as-owner` son etiquetas, no un bloqueo: un agente puede establecerlas y escribir como tú.

## Qué puede salir de tu ordenador

El envío de fuentes a un proveedor de IA requiere tu autorización. Por defecto, `memo ask` prepara fuentes para tu agente. Envía texto a un proveedor de IA solo cuando configuras uno y añades `--analyze`, y a uno remoto solo con `--allow-remote` además. Lo que tu agente hace con el texto depende de él. Las comprobaciones automáticas de actualizaciones y dominios de remitentes también pueden hacer peticiones de red; [Seguridad](./security.md) explica qué envían y qué ajustes se aplican.
