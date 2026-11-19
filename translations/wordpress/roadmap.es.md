---
title: "Hoja de ruta"
---

Mira qué hace hoy `wordpress` y qué viene después, antes de montar un apaño para algo que le falta. Puede que ya esté
en camino.

Sabes con qué partes de tu sitio WordPress puede trabajar ya un agente y cuáles pueden llegar más tarde. El orden es
aproximado y puede cambiar. Para sugerir algo, abre un
[issue en GitHub](https://github.com/WireCatLabs/wordpress-cli/issues).

**En esta página:**

1. [Lo que funciona hoy](#what-works-today)
2. [Lo siguiente](#next)
3. [Más adelante](#later)

## Lo que funciona hoy

`wordpress` inicia sesión en un sitio WordPress autoalojado con una contraseña de aplicación. `sync` copia entradas y
páginas con todos sus estados, etiquetas, categorías y autores en el almacén local de WireCat, con el texto en
Markdown, y las sincronizaciones siguientes leen solo lo que cambió. `posts list`, `posts search` y `posts show` leen
esa copia, también sin conexión. `posts create` escribe un borrador, `posts update` lo cambia, y `posts publish`,
`unpublish` y `delete` publican, programan, devuelven a borrador y mandan a la papelera una entrada, cada uno con su
propio permiso. `wordpress blog api` alcanza todas las operaciones `wp/v2` de WordPress 6.9.4. Cada comando está en
la [referencia de comandos](./commands.md).

## Lo siguiente

- **Sincronización completa para Autores y Colaboradores.** Copiar lo que un Autor o un Colaborador puede leer, sin
  detenerse en la lista de páginas.
- **Inicio de sesión en el navegador.** Aprobar la herramienta en wp-admin, en lugar de pegar una contraseña de
  aplicación.
- **Campos de plugins.** Leer y poner campos de plugins habituales, como un título SEO, sin un `--body` sin procesar.

## Más adelante

- **Sitios de WordPress.com.** Iniciar sesión con el OAuth de WordPress.com.
- **Recuentos de visitas.** Leer las estadísticas de Jetpack o de WordPress.com en `posts stats`.

Lo que cambió cada versión publicada está en el [historial de cambios](./changelog.md).
