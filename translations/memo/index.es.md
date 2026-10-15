---
title: "Memo"
---

Memo guarda en un solo lugar de tu ordenador lo que sabes sobre personas y proyectos: tus notas, tu
correo y tus mensajes de Telegram y MAX. Tu agente de IA (por ejemplo Claude Code, Codex, Cursor o
Gemini CLI) lo usa para encontrar lo que se dijo, reunir el contexto para una respuesta y recordar lo
importante.

Esta página explica qué puede hacer Memo, cómo funciona en pocas palabras y cómo obtener un primer
resultado en unos minutos.

Tres palabras aparecen en todas las páginas:

- **Terminal** (línea de comandos): la ventana donde escribes comandos, como Terminal en macOS o
  PowerShell en Windows. `memo` es un comando que escribes ahí, o que tu agente escribe por ti.
- **Agente de IA**: un programa que hace tareas por ti y puede ejecutar comandos. Ejecuta `memo` por
  ti.
- **Almacén local**: un archivo de tu ordenador que contiene tus mensajes, tu correo y tus notas.
  Memo, tg y max leen y escriben el mismo archivo.

## Qué puede hacer

| Quieres | Dónde |
|---|---|
| Buscar en una carpeta de notas o documentos, o en una bóveda de Obsidian | [Notas y carpetas](./notes.md) |
| Escribir tus propias notas sobre una persona, un mensaje o un proyecto | [Notas y carpetas](./notes.md#write-your-own-notes) |
| Poner etiquetas como `work` o `follow-up` en notas, mensajes y personas | [Etiquetas](./tags.md) |
| Encontrar algo cuando no recuerdas dónde se escribió | [Búsqueda](./search.md) |
| Ver todo sobre una persona: mensajes, correo y notas | [Personas y proyectos](./people.md) |
| Traer tu correo junto a tus notas y mensajes | [Correo](./mail.md) |
| Llevar la cuenta de lo que debes a otras personas y recibir recordatorios | [Tareas y recordatorios](./tasks.md) |
| Dejar que tu agente recuerde lo que aprendió, y decidir tú qué se queda | [Recuerdos y hechos](./memories.md) |
| Usar Memo desde una aplicación sin terminal, como Claude Desktop | [El servidor MCP](./mcp.md) |

## Cómo funciona

1. **Tú eliges tus fuentes.** Añades una carpeta de notas, conectas una cuenta de correo o usas tg y
   max para guardar tus chats. No se lee nada hasta que tú lo eliges.
2. **Memo copia el texto en el almacén local.** Lee tus archivos y tu correo y nunca los cambia.
   En Linux, un temporizador puede volver a ejecutarlo solo.
3. **Tú o tu agente preguntáis.** Memo responde con el texto que coincide y una referencia a cada
   fuente, para que puedas abrir el original y comprobarlo.
4. **Tu agente puede sugerir, pero tú decides.** Lo que una aplicación añade a través de MCP, y cada
   acción propuesta, espera tu revisión. Memo nunca envía un mensaje ni un correo.

Todo se queda en tu ordenador. Memo envía tu texto a un proveedor de IA solo cuando configuras uno y
lo permites para esa petición. [Cómo funciona Memo](./how-it-works.md) lo explica con más detalle.

## Empezar

Lo más fácil es pedírselo a tu agente. Copia esta petición en él:

```text prompt
Install Memo with npm install -g @wirecat/cli-memo and check that memo --help works.
Then help me add a folder of notes I choose and import it.
Search it for a word I give you and show me the source of each result.
```

O escribe tú los comandos. Sustituye `/path/to/notes` por una carpeta de tu ordenador:

```sh
npm install -g @wirecat/cli-memo
memo folders add /path/to/notes --format markdown
memo sync --only notes --no-embed
memo search notes budget
```

Memo necesita Node.js 22.16 o posterior ([qué instalar primero](./installation.md)). Tus archivos se
quedan donde están; Memo solo los lee.

## Adónde ir después

| Página | Responde a |
|---|---|
| [Instalación](./installation.md) | ¿Qué necesita, dónde guarda sus archivos, cómo lo actualizo o lo quito? |
| [Usar Memo](./usage.md) | ¿Cómo es un día normal con Memo? |
| [Cómo funciona Memo](./how-it-works.md) | ¿Dónde están mis datos, qué se importa y qué significa una referencia? |
| [Notas y carpetas](./notes.md) | ¿Cómo importo notas de Markdown u Obsidian, y cómo escribo las mías? |
| [Etiquetas](./tags.md) | ¿Cómo etiqueto notas, mensajes y personas, y cómo los vuelvo a encontrar? |
| [Búsqueda](./search.md) | ¿Cómo encuentro algo y le doy las fuentes a mi agente? |
| [Personas y proyectos](./people.md) | ¿Cómo veo todo sobre una persona, una empresa o un proyecto? |
| [Correo](./mail.md) | ¿Cómo traigo mi correo? |
| [Tareas y recordatorios](./tasks.md) | ¿Cómo llevo la cuenta de lo que debo a otras personas? |
| [Recuerdos y hechos](./memories.md) | ¿Cómo recuerda las cosas mi agente, y cómo las compruebo? |
| [El servidor MCP](./mcp.md) | ¿Cómo conecto Claude Desktop, Cursor u otra aplicación? |
| [Mantener Memo al día](./archive.md) | ¿Cómo importo los cambios, a mano o con un temporizador? |
| [Recetas](./recipes.md) | ¿Qué puede hacer mi agente por mí con Memo? |
| [Todos los comandos](./commands.md) | Cada comando y cada opción |
| [Configuración](./configuration.md) | Cada ajuste del archivo de configuración |
| [Solución de problemas](./troubleshooting.md) | Algo no funciona: qué dice la pantalla y qué hacer |
| [Seguridad](./security.md) | ¿Qué lee, escribe y envía Memo? |
