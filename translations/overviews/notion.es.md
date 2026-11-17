---
title: "Notion: empieza aquí"
description: "Copia tus páginas y bases de datos de Notion a tu ordenador para que tu agente de IA las busque sin conexión y las use como contexto."
---

Tus planes, notas de reuniones y bases de datos de proyectos están en Notion, y un agente de IA en tu ordenador no
puede leerlos si no pegas el texto en el chat. La herramienta de línea de comandos `notion` copia las páginas que
elijas a tu ordenador. Así tu agente puede buscarlas y usarlas como contexto, incluso sin internet.

Pregunta a tu agente en qué página se anotó una decisión, qué filas tiene la base de datos de un proyecto o qué dice
una especificación sobre una función. El agente encuentra la página en la copia local y te da su enlace de Notion.

Esta página explica qué obtienes, cómo funciona la copia y cómo conectar tu espacio de trabajo.

**En esta página:**

1. [Cómo funciona](#cómo-funciona)
2. [Qué obtienes](#qué-obtienes)
3. [Consigue un token de Notion](#consigue-un-token-de-notion)
4. [Conecta y copia tus páginas](#conecta-y-copia-tus-páginas)
5. [Qué no hace todavía](#qué-no-hace-todavía)
6. [Encuentra una guía para tu tarea](#encuentra-una-guía-para-tu-tarea)

## Cómo funciona

- **Una copia en tu ordenador.** `notion` guarda las páginas en el almacén local, un archivo de tu ordenador que
  comparten todas las herramientas de WireCat. La búsqueda lee esta copia, no Notion. Ahí están también tus chats, tu
  correo y tus reuniones, así que [Memo](/es/docs/memo) encuentra una página de Notion junto con la conversación sobre
  ella.
- **Un token en lugar de una contraseña.** Un token de Notion es una clave con la que la herramienta lee tu espacio de
  trabajo. Decide qué ve la herramienta: todo el espacio o solo unas pocas páginas.
- **Un perfil por espacio.** Un perfil es el nombre que eliges para una cuenta de Notion, como `personal`. Cada
  comando que usa una cuenta empieza por él: `notion personal search "quarterly plan"`.
- **Cada sincronización trae los cambios.** La copia está al día según la última sincronización. Vuelve a ejecutarla
  para traer lo que cambió en Notion.
- **Tu agente usa los mismos comandos.** Un agente de terminal ejecuta `notion` por ti, y una aplicación que se conecta
  a servidores MCP recibe los mismos comandos por MCP.

## Qué obtienes

- **Búsqueda sin conexión.** Encuentra una página por sus palabras, en cualquiera de sus formas, y por significado
  cuando la copia esté indexada para ello.
- **Solo las páginas que eliges.** Si no eliges nada, la herramienta copia todo lo que ve el token. Puedes reducirlo
  a unas pocas páginas o bases de datos, con todo lo que contienen.
- **Filas de bases de datos como páginas.** Cada fila de una base de datos se copia como una página, con su enlace de
  Notion.
- **Tus propias notas en una página.** Añade etiquetas, notas y hechos a una página. Se quedan en tu ordenador y nunca
  llegan a Notion.
- **Escritura en Notion.** Crea, cambia y restaura páginas, añade comentarios y sube archivos. Antes de
  borrar una página, pregunta. `WCNOTION_READ_ONLY=1` o el [ajuste `permissions`](./configuration.md#permissions)
  desactivan la escritura.
- **Lectura en directo cuando la necesitas.** Lee una página de Notion como Markdown, o lista las bases de datos que
  ve el token, sin copiar nada.
- **Tu agente conectado.** Instala la skill de la herramienta para un agente de terminal como Claude Code, o sirve la
  herramienta por MCP a una aplicación que se conecte a servidores MCP.

El token se guarda en el llavero del sistema, o en un archivo privado donde no hay llavero. `notion` solo se conecta
a la API de Notion. Más detalles en [acceso y seguridad](./security.md).

## Consigue un token de Notion

El token decide lo que ve la herramienta. Notion ofrece dos tipos:

- Un [token de acceso personal](https://developers.notion.com/guides/connections-and-tokens/personal-access-tokens)
  actúa con tus propios permisos y ve lo que tú ves.
- El token de una conexión interna solo ve las páginas que compartes con esa conexión en Notion. Es la opción para
  dar a la herramienta unas pocas páginas y nada más.

## Conecta y copia tus páginas

1. [Instala `notion`](./installation.md) desde npm.
2. Inicia sesión. `personal` es un perfil: un nombre que eliges para una cuenta de Notion. La herramienta pide el
   token sin mostrarlo.

```sh
notion personal session start
```

3. Elige qué copiar, o salta este paso para copiar todo lo que ve el token. `folders browse` muestra el nivel superior
   del espacio de trabajo, un nivel cada vez.

```sh
notion personal folders browse
notion personal folders add https://www.notion.so/Team-plans-1a2b3c4d5e6f47a8b9c0d1e2f3a4b5c6
```

4. Copia las páginas y busca en ellas.

```sh
notion personal sync
notion personal search "plan trimestral"
```

Una sincronización recorre hasta unas 10 000 entradas y guarda dónde se detuvo. Vuelve a ejecutarla para seguir, y
más tarde para traer lo que cambió. `notion personal status` muestra hasta dónde ha llegado.

5. Conecta tu agente. Un agente de terminal recibe la skill:

```sh
notion skill install
```

Una aplicación con MCP se conecta al servidor, como se explica en [úsalo](./usage.md#agents).

## Qué no hace todavía

- No busca filas de una base de datos por sus propiedades, como el estado o el responsable. La búsqueda encuentra las
  filas por su texto.
- No mantiene una carpeta de archivos Markdown al día con un árbol de páginas de Notion.

## Encuentra una guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar o actualizar la herramienta | [Instalación](./installation.md) |
| Ver cómo se forma un comando y conectar un agente | [Úsalo](./usage.md) |
| Encontrar un comando o una opción | [Comandos](./commands.md) |
| Cambiar un ajuste o un permiso | [Ajustes](./configuration.md) |
| Arreglar un error | [Cuando algo falla](./troubleshooting.md) |
| Saber qué guarda y envía la herramienta | [Acceso y seguridad](./security.md) |
| Compararla con otras herramientas para Notion | [Comparación con otras herramientas](./compare.md) |
