---
title: "Historial de cambios"
---

Cambios destacados en `@wirecat/wordpress-cli`. Una sección por versión, la más nueva primero.

## 0.1.0 — 19.11.2026

### Añadido

- Creado a partir de `@wirecat/cli-template` 0.32.0.
- Construido desde un solo archivo, `wirecat.config.ts`, sin hooks, más un nombre de comando y la forma de la clave
  de permiso en `scripts/generate.ts`.
- **`wordpress <profile> session start --site <address> --login <user>` inicia sesión con una contraseña de
  aplicación** desde stdin, la comprueba con `GET /wp/v2/users/me` y la guarda con su sitio. Va solo a ese sitio.
- **`wordpress <profile> sync` copia tus entradas y páginas en el almacén local de WireCat**, con cualquier estado y
  también la papelera, con sus etiquetas, categorías y autores. El texto se guarda en Markdown. Las siguientes
  sincronizaciones leen solo lo que cambió.
- **`wordpress <profile> posts list|show|search|stats`, `tags list`, `users list` y `channels list` leen la
  copia**, también sin conexión.
- **`wordpress <profile> posts create|update|publish|unpublish|delete` escriben en el sitio.** Una entrada nueva es
  un borrador. Publicar, ahora o con `--at-time`, tiene su propia clave. Borrar envía a la papelera, y
  `--allow-delete` borra para siempre. Cada una pregunta por defecto. Una entrada con bloques o contenidos
  incrustados que Markdown no puede guardar conserva su texto salvo con `--replace-body`, y una entrada cambiada en
  el sitio desde la última sincronización no se sobrescribe. Las páginas se leen, no se escriben: una escritura en
  una página se detiene con `content.write-unsupported`.
- **`wordpress <profile> api` ejecuta cada ruta `wp/v2` de WordPress 6.9.4**, cada una con sus flags, su ayuda y
  `--json`. Publicar y borrar para siempre necesitan sus propias claves. Instalar un plugin, cambiar un ajuste del
  sitio, crear o cambiar un usuario o un comentario, y cambiar plantillas, widgets, menús o navegación preguntan por
  defecto. `api posts-create` y `api pages-create` comprueban también `posts.create`, y sus actualizaciones
  comprueban `posts.update`. `batch/v1` y crear una contraseña de aplicación nunca se ofrecen.
