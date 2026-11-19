---
title: "WordPress"
---

Escribe y revisa tu blog sin abrir wp-admin. `wordpress` da al agente de IA que ya usas, como Claude Code, Codex o
Claude Desktop, una copia de las entradas y páginas de tu WordPress en tu ordenador, así que responde desde esa copia,
también sin conexión. Escribe borradores en tu sitio y los publica cuando tú lo permites.

Pregunta qué publicaste el mes pasado, qué borradores esperan o qué dice hoy una página. Dale tus notas al agente y
prepara un borrador con título, extracto y etiquetas. Necesitas un sitio WordPress autoalojado, 5.7 o posterior con
https, y un usuario en él.

**En esta página:**

1. [Lo que obtienes](#what-you-get)
2. [Lo que un recién llegado no adivinaría](#things-a-newcomer-would-not-guess)
3. [Cómo se ve](#how-it-looks)
4. [Por qué wordpress](#why-wordpress)
5. [Qué puede hacer](#what-it-can-do)
6. [Cómo funciona](#how-it-works)
7. [Empieza en unos minutos](#start-in-a-few-minutes)
8. [Límites](#limits)
9. [Encuentra una guía para tu tarea](#find-a-guide-for-your-task)

## Lo que obtienes

- **La respuesta, no la búsqueda.** Pregunta por una entrada con tus propias palabras. El agente la encuentra por su
  título y su texto, con su estado, sus etiquetas y su autor, leída de tu ordenador.
- **Todos los borradores y entradas programadas en una lista.** Filtra por estado, etiqueta, autor o el día en que se
  publicó una entrada.
- **Borradores a partir de tus notas.** Un archivo Markdown se convierte en un borrador en tu sitio, con título,
  extracto y etiquetas.
- **Publica ahora o más tarde.** Publica un borrador al momento, prográmalo o devuelve una entrada a borrador.
- **También la papelera.** Las entradas de la papelera siguen en la copia con su estado, así que no pierdes de vista
  nada de lo que tiraste.
- **Tus entradas junto a tus chats.** Están en el mismo almacén local que los mensajes, el correo y las reuniones que
  las otras herramientas de WireCat guardan en tu ordenador.

## Lo que un recién llegado no adivinaría

- **Una contraseña de aplicación es tu llave.** WordPress deja entrar a un programa con una contraseña que creas en
  tu perfil, distinta de la que usas para acceder. Puede hacer lo que puede tu usuario, nada más.
  [Instala](./installation.md) muestra dónde hacer clic.
- **`blog` es un nombre que eliges tú.** Nombra un sitio y un usuario, y es la primera palabra de cada comando.
  Ningún comando elige un sitio por ti.
- **Las lecturas usan una copia, las escrituras van al sitio.** `sync` copia tus entradas y páginas. `posts list`,
  `posts search` y `posts show` responden desde esa copia. `posts create`, `update`, `publish`, `unpublish` y `delete`
  cambian tu sitio.
- **Tu rol decide lo que ves.** Un Administrador obtiene todo el sitio. Un Editor obtiene todas las entradas y
  páginas, pero no la lista de usuarios. Un Autor o un Colaborador obtiene solo una parte: consulta los
  [límites](#limits).
- **Por MCP, "ask" sigue adelante.** MCP es la forma en que apps como Claude Desktop llaman a una herramienta, y allí
  nadie está ante una terminal para responder una pregunta. Así que un agente por MCP puede publicar. Pon
  `posts.publish` en `deny` si quieres publicar tú: [permisos](./permissions.md).

## Cómo se ve

```text
You:    What did I publish in October?
Agent:  (runs wordpress blog posts list status:published "published:[2026-10-01 TO 2026-10-31]")
        · 38 "Release notes for version 2", published on 3 October
        · 40 "How we test with a fake WordPress", published on 17 October
You:    Schedule draft 63 for Monday 9:00.
Agent:  (runs wordpress blog posts publish 63 --at-time 2026-11-23T09:00:00Z)
        Draft 63 is scheduled for Monday, 23 November, 09:00 UTC.
```

*Entradas inventadas, salida de ejemplo.*

## Por qué wordpress

- **Una copia de tu sitio en tu ordenador.** Las listas y la búsqueda responden desde ella sin ninguna petición a tu
  sitio, también sin conexión.
- **Seguro para dárselo a un agente.** Crear, cambiar, publicar y borrar tienen cada uno su propio permiso, y cada uno
  pregunta antes en una terminal. Una línea deja la publicación en tus manos.
- **Cambios seguros.** Una escritura se detiene si la entrada cambió en el sitio desde la última sincronización. Una
  entrada con galerías o contenido incrustado conserva su cuerpo salvo que digas que lo sustituya.
- **La contraseña se queda en el llavero del sistema.** Nunca aparece en la salida, los errores ni los registros.
- **Lista para cualquier agente.** Una skill para agentes con terminal, un servidor MCP para Claude Desktop y Cursor,
  y un enlace seguro para ChatGPT y Claude en el navegador.
- **Gratis y de código abierto.** Apache 2.0.

## Qué puede hacer

- **Entradas y páginas:** lístalas por estado, tipo, etiqueta, autor o fecha, busca sus palabras y muestra una con su
  texto en Markdown. [Úsalo](./usage.md#read-posts-and-pages)
- **Etiquetas, categorías y autores:** lístalos con los ids que usan los otros comandos.
  [Úsalo](./usage.md#tags-and-authors)
- **Borradores:** escribe un borrador nuevo a partir de un archivo Markdown y cambia su título, extracto, etiquetas o
  texto. [Úsalo](./usage.md#write-a-draft)
- **Publicación:** publica ahora, programa, devuelve a borrador o mueve a la papelera.
  [Úsalo](./usage.md#publish)
- **Cualquier operación de la API de WordPress** desde una terminal, con las mismas comprobaciones de permisos.
  [Úsalo](./usage.md#the-wordpress-api)

## Cómo funciona

- **Una copia en tu ordenador.** `sync` pone tus entradas y páginas, con todos sus estados, y sus etiquetas,
  categorías y autores en el almacén local de WireCat, el único archivo de tu ordenador que comparten todas las
  herramientas de WireCat. El texto se guarda en Markdown. Las sincronizaciones siguientes leen solo lo que cambió.
- **Inicio de sesión con una contraseña de aplicación.** Se guarda con su sitio en el llavero del sistema, o en un
  archivo privado en un ordenador sin llavero.
- **Hecho para scripts y agentes.** `--json` da una respuesta en JSON, y un error llega con un código con el que
  decidir qué hacer. [MCP](./mcp.md)
- **Qué se guarda y qué sale por la red.** [Seguridad](./security.md)

## Empieza en unos minutos

Pega esto en tu agente:

```text prompt
Instala wordpress con npm install -g @wirecat/wordpress-cli. Ayúdame a crear una contraseña de aplicación de WordPress y a ejecutar wordpress blog session start --site blog.example.com --login anna para conectar mi sitio, después sincroniza y muéstrame mis borradores.
```

O en una terminal:

```sh
npm install -g @wirecat/wordpress-cli
wordpress skill install          # teaches Claude Code, Codex and Gemini CLI to use wordpress
wordpress blog session start --site blog.example.com --login anna   # paste the application password
wordpress blog sync              # copy your posts, pages, tags and authors
wordpress blog posts list status:draft
```

Necesitas Node.js 22.16 o un 22.x posterior, o Node.js 24 o posterior. [Instala](./installation.md) muestra cómo
crear la contraseña.

## Límites

- Solo WordPress autoalojado con contraseñas de aplicación. Los sitios de WordPress.com no son compatibles.
- Pegas la contraseña de aplicación tú. El inicio de sesión en el navegador está en la [hoja de ruta](./roadmap.md).
- Un Autor o un Colaborador obtiene solo una parte del sitio. WordPress niega a los dos la lista de páginas, así que la
  sincronización de entradas queda parcial y los cambios en el sitio no llegan a la copia. Un Colaborador además ve
  solo sus propias entradas. Solo un Administrador obtiene la lista de usuarios. La sincronización avisa de cada uno de
  estos huecos.
- Sin recuentos de visitas. WordPress no guarda ninguno, y las estadísticas de Jetpack no son compatibles.
  `posts stats` muestra solo lo que tiene la copia.
- Los campos de plugins, como los de un plugin de SEO o de campos personalizados, no tienen opciones propias. El grupo
  `api` los envía en un `--body` sin procesar.
- Las escrituras trabajan con entradas. Los comentarios y los menús se alcanzan con el grupo `api`. El grupo `api`
  solo envía JSON, así que no puede subir un archivo a la biblioteca de medios.

## Encuentra una guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar y conectar un sitio | [Instala](./installation.md) |
| Leer, escribir y publicar entradas | [Úsalo](./usage.md) |
| Conectar una app que usa MCP | [MCP](./mcp.md) |
| Decidir qué puede cambiar un agente | [Permisos](./permissions.md) |
| Un comando o una opción exactos | [Comandos](./commands.md) |
| Cambiar un ajuste | [Ajustes](./configuration.md) |
| Algo no funciona | [Cuando algo falla](./troubleshooting.md) |
| Qué se guarda y qué se envía | [Seguridad](./security.md) |
| Qué viene después | [Hoja de ruta](./roadmap.md) |
