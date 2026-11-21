---
title: "Instala"
---

Pon `wordpress` en marcha en tu ordenador y conéctalo a tu sitio WordPress en unos cinco minutos. WordPress deja
entrar a un programa con una contraseña de aplicación que creas en tu propio perfil, y esta guía te lleva paso a paso.

Cuando termines, un agente en este ordenador lee tus entradas y páginas cuando se lo pides, y escribe borradores
hasta donde lo permiten tus permisos.

**En esta página:**

1. [Lo que necesitas](#what-you-need)
2. [Instala la herramienta](#install-the-tool)
3. [Crea una contraseña de aplicación en WordPress](#make-an-application-password-in-wordpress)
4. [Inicia sesión](#sign-in)
5. [Comprueba que funciona](#check-it-works)
6. [Cierra la sesión o cambia la contraseña](#sign-out-or-change-the-password)

## Lo que necesitas

- Un sitio WordPress autoalojado, versión 5.7 o posterior, con acceso por https. WordPress crea contraseñas de
  aplicación solo ahí. Los sitios de WordPress.com no son compatibles.
- Un usuario en el sitio. Para una copia completa, el usuario debe ser Administrador. Un Editor obtiene todas las
  entradas y páginas, pero WordPress da todos los usuarios y su correo solo a un Administrador: un Editor obtiene los
  autores con entradas publicadas. Un Autor o un Colaborador obtiene solo sus propias entradas y ninguna página:
  WordPress les niega la lista de páginas. Un Colaborador obtiene solo sus borradores y sus entradas pendientes de
  revisión.
- Para la línea de comandos: Node.js 22.16 o un 22.x posterior, o Node.js 24 o posterior. Node 23 no es compatible.

## Instala la herramienta

Instala `wordpress` una vez en cada ordenador donde tú o un agente lo uséis.

```sh
npm install -g @wirecat/wordpress-cli
wordpress --version
wordpress skill install   # the agent skill, for Claude Code, Codex, Gemini CLI and OpenClaw
wordpress doctor
```

El comando es `wordpress`, no `wp`. El WP-CLI oficial ya usa `wp`, y los dos pueden convivir en un ordenador.

`doctor` no necesita red y no abre ningún llavero. Muestra la versión, dónde están los ajustes, los perfiles que
existen y si otros usuarios del ordenador pueden leer los ajustes.

Un agente sin terminal, como Claude Desktop o Cursor, usa `wordpress` por [MCP](./mcp.md) en lugar de la skill.

## Crea una contraseña de aplicación en WordPress

WordPress describe estos pasos en su
[guía de contraseñas de aplicación](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/).

1. Accede a wp-admin de tu sitio.
2. Abre **Usuarios → Perfil**.
3. Baja hasta **Contraseñas de aplicación**.
4. Escribe un nombre para la nueva contraseña, como `WireCat`, y haz clic en
   **Añadir nueva contraseña de aplicación**.
5. Copia la contraseña que muestra WordPress. La muestra una sola vez.

La contraseña puede hacer lo que puede tu usuario, nada más. Funciona hasta que la anulas en el mismo sitio.

Si la sección no aparece, el sitio no usa https, o un plugin o el alojamiento desactivó las contraseñas de aplicación.
Pregunta al administrador del sitio.

## Inicia sesión

Un perfil es un nombre que eliges para un sitio y un usuario, como `blog`. Es la primera palabra de cada comando que
usa una cuenta. Ningún comando elige uno por ti.

```sh
wordpress blog session start --site blog.example.com --login anna
```

`--site` es la dirección de tu sitio, con `https://` o sin él. `--login` es tu nombre de usuario de WordPress.
`wordpress` pide la contraseña de aplicación sin mostrarla, la comprueba con tu sitio y la guarda, con el sitio, en el
llavero del sistema. No se guarda una contraseña que el sitio rechaza. La contraseña va solo a ese sitio, nunca a otro
sitio del mismo host.

En un ordenador sin llavero, añade `--credential-storage file` para guardarla en un archivo privado. Un agente o un
script puede pasar la contraseña por stdin. La contraseña nunca se acepta como argumento, así que no queda en el
historial de tu shell.

## Comprueba que funciona

```sh
wordpress blog session status --check   # asks your site whose password it is
wordpress blog sync                     # copies your posts, pages, tags and authors
wordpress blog posts list status:draft
```

La primera sincronización lee todas las entradas y páginas, así que un sitio grande tarda un rato. Las siguientes
leen solo lo que cambió. Si algo falla, consulta [cuando algo falla](./troubleshooting.md).

## Cierra la sesión o cambia la contraseña

```sh
wordpress blog session end
```

`session end` olvida la contraseña en este ordenador. La contraseña sigue funcionando en tu sitio hasta que la anulas:
Usuarios → Perfil → Contraseñas de aplicación, **Anular**. Para cambiarla, ejecuta `session start` de nuevo con la
nueva.

Siguiente: [úsalo](./usage.md), o conecta una app por [MCP](./mcp.md).
