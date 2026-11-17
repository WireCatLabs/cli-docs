---
title: "Memo"
---

Antes de una llamada, tienes en una sola respuesta todo lo que sabes de la persona: los últimos mensajes de cada
lado, el correo, tus notas y lo que le prometiste. Memo guarda tus notas, documentos, correo y mensajes de Telegram,
MAX y WhatsApp en un solo lugar de tu ordenador, así que el agente de IA que ya usas, como Claude Code o Codex, busca
en todo a la vez.

Tu agente responde a "¿Qué necesito saber de Alice antes de la llamada?", "¿Dónde hablamos del presupuesto de
Harbour?" o "¿Qué prometí a la gente esta semana?". Cada respuesta lleva a su fuente: una nota, una página de un
archivo, un correo o un mensaje.

**En esta página:**

1. [Qué obtienes](#what-you-get)
2. [Lo que no es obvio al principio](#things-a-newcomer-would-not-guess)
3. [Cómo se ve](#how-it-looks)
4. [Por qué Memo](#why-memo)
5. [Qué puede hacer](#what-it-can-do)
6. [Cómo funciona](#how-it-works)
7. [Empieza en unos minutos](#start-in-a-few-minutes)
8. [Límites](#limits)
9. [Encuentra la guía para tu tarea](#find-a-guide-for-your-task)

## Qué obtienes

- **Una persona, una respuesta.** Todas las cuentas que tiene, el último mensaje de cada lado, los chats en común, el
  correo, tus notas y las tareas abiertas, cada cosa con un enlace a su fuente.
- **Una búsqueda a la que no le importa dónde se dijo.** Mensajes, correo y notas en los mismos resultados, por
  palabras o por significado.
- **Tu bóveda de Obsidian en la misma búsqueda.** Las notas conservan sus enlaces, alias y etiquetas. Los PDF, los
  Word y los demás documentos de la carpeta también se buscan, hasta la página del PDF de donde salió un fragmento.
- **Promesas bajo control.** Tareas y recordatorios de lo que debes a la gente y de lo que te deben a ti.
- **Una memoria que controlas tú.** Lo que tu agente quiere recordar espera tu confirmación, con la evidencia que lo
  respalda.
- **Respuestas con evidencia.** Tu agente recibe las fuentes que coinciden, cada una con su referencia, y sabe dónde no se
  pudo buscar, así que cita en vez de adivinar.

## Lo que no es obvio al principio

- **Memo lee lo que copiaron las otras herramientas.** `tg`, `max` y `wa` copian tus chats, y `mail` copia tu correo,
  al almacén local de WireCat, un solo archivo en tu ordenador. Memo importa tus carpetas a ese mismo archivo y busca
  en él. Un chat que ninguna herramienta copió no está ahí, así que una búsqueda vacía no prueba que un mensaje nunca
  se envió.
- **No se envía nada, y tus fuentes quedan como están.** Memo no tiene ningún comando que envíe un mensaje o un
  correo. Importar no cambia tus archivos ni tu buzón.
- **Un agente propone, tú decides.** Los recuerdos y hechos que registra un agente esperan tu revisión antes de
  contar.
- **Por MCP, "preguntar" deja pasar el comando.** MCP es la forma en que aplicaciones como Claude Desktop llaman a una
  herramienta, y nadie está ahí para responder una pregunta. Antes de conectarla, marca como "solo lectura" o
  "rechazar" lo que un agente no debe hacer.
- **La búsqueda por significado necesita un modelo que descargas una vez.** Hasta entonces Memo busca por palabras y
  te lo dice.

## Cómo se ve

```text
You:    What do I need to know about Alice before the call?
Agent:  (runs memo context telegram:"Alice Example" --json)
        Alice wrote yesterday in "Harbour": she needs the revised budget by Friday.
        Your note "people/Alice Example.md" says she prefers a short call.
        Open task: send her the contract draft.
        Sources: msg:telegram/1/77/42, people/Alice Example.md, task 7.
You:    Add a task to send her the budget.
Agent:  Draft task: "Send Alice the revised budget", linked to her message in "Harbour". Save it?
You:    Yes.
```

## Por qué Memo

- **Lee tus conversaciones reales.** De las herramientas de memoria de la [comparativa](./compare.md), como Hindsight,
  mem0 y Graphiti, ninguna documenta leer tus chats de Telegram, MAX y WhatsApp ni las transcripciones de tus
  reuniones.
- **Cada respuesta tiene una fuente.** Un resultado trae una referencia que puedes abrir tú o tu agente.
- **Nunca se unen identidades porque coincida un nombre.** Las cuentas se vinculan solo por una dirección de correo o un
  número de teléfono que no tiene nadie más, o cuando las enlazas tú.
- **No hace falta una clave de IA.** La importación y la búsqueda funcionan en tu ordenador, y la búsqueda por
  significado usa un modelo local. Memo envía texto a un proveedor de IA solo si configuras uno y lo permites.
- **Cada llamada de un agente queda registrada**, y para cada comando decides qué puede hacer un agente: permitir,
  preguntar, solo lectura o rechazar.
- **Gratis y de código abierto.** Apache 2.0.

Otra herramienta te conviene más si quieres una memoria que se construya sola a partir de conversaciones con un
modelo (Hindsight, mem0, Graphiti, Cognee), o un servicio de memoria alojado para un producto que estás creando.

## Qué puede hacer

- **Notas y carpetas:** importar Markdown o una bóveda de Obsidian, y escribir tus propias notas sobre una persona o
  un mensaje. [Notas y carpetas](./notes.md)
- **Buscar:** en todo a la vez, o solo en notas, correo o mensajes. [Búsqueda](./search.md)
- **Personas y proyectos:** todo sobre una persona o una empresa. [Personas y proyectos](./people.md)
- **Correo:** buscar en el correo que guarda la herramienta `mail`, junto a tus chats y notas. [Correo](./mail.md)
- **Tareas y recordatorios:** lo que debes y lo que te deben. [Tareas y recordatorios](./tasks.md)
- **Recuerdos y hechos:** lo que aprendió tu agente, que espera tu revisión. [Recuerdos y hechos](./memories.md)
- **Datos de negocio:** contratos, facturas, pagos y movimientos bancarios, y los importes esperan tu revisión.
  [Datos de negocio](./business.md)
- **Agentes en cualquier sitio:** una skill para agentes de terminal, un servidor MCP para Claude Desktop y Cursor, y
  una conexión con inicio de sesión para aplicaciones en la web o en el móvil a través de tu propio túnel HTTPS.
  [El servidor MCP](./mcp.md), [Conexión remota](./remote.md)

## Cómo funciona

- **Un almacén en tu ordenador.** Memo copia el texto de tus notas y documentos al almacén local, junto a los
  mensajes y el correo que guardan ahí las otras herramientas de WireCat. [Cómo funciona Memo](./how-it-works.md)
- **Siempre al día.** `memo sync` lee lo que cambió, y en Linux un temporizador puede ejecutarlo cada cinco minutos.
  [Mantener Memo al día](./archive.md)
- **Hecho para scripts y agentes.** `--json` da respuestas estructuradas, y `memo answers create` entrega a un agente
  la evidencia para una pregunta.
- **Qué lee, escribe y envía.** [Seguridad](./security.md)

## Empieza en unos minutos

Pega esto en el chat con tu agente:

```text prompt
Instala Memo con npm install -g @wirecat/cli-memo y memo skill install --for all. Luego ayúdame a añadir una carpeta de notas que yo elija, importarla y buscar en ella una palabra que te dé, con la fuente de cada resultado.
```

O en una terminal. Cambia `/path/to/notes` por una carpeta de tu ordenador:

```sh
npm install -g @wirecat/cli-memo
memo skill install --for all       # puts memo's skill where your agents read it
memo folders add /path/to/notes    # Obsidian format when it is a vault
memo sync --only notes             # reads the notes, their links and tags
memo search notes budget
```

Necesitas Node.js 22.16 o una versión 22.x posterior, o Node.js 24 o posterior. Los mensajes llegan a través de `tg`, `max` o
`wa`, y el correo a través de `mail`. [Instalación](./installation.md)

## Límites

- Memo está probado en Linux. macOS y Windows aún no están probados.
- La búsqueda por significado necesita un modelo local de unos 220 MB, que se descarga una vez.
- Repetir la importación con un temporizador funciona en Linux con systemd.
- Un almacén por ordenador. No hay una copia alojada a la que acceder desde otro dispositivo, ni una ventana propia.

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar y actualizar | [Instalación](./installation.md) |
| Un día normal con Memo | [Usar Memo](./usage.md) |
| Dónde viven los datos y qué significa una referencia | [Cómo funciona Memo](./how-it-works.md) |
| Una petición lista para tu agente | [Recetas](./recipes.md) |
| Conectar Claude Desktop o Cursor | [El servidor MCP](./mcp.md) |
| Todos los comandos | [Todos los comandos](./commands.md) |
| Algo no funciona | [Solución de problemas](./troubleshooting.md) |
| Qué lee, escribe y envía Memo | [Seguridad](./security.md) |
| En qué se diferencia Memo de otras herramientas de memoria | [Comparativa con otras herramientas](./compare.md) |
