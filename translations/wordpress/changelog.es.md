---
title: "Historial de cambios"
---

Cambios destacados en `@wirecat/wordpress-cli`. Una sección por versión, la más nueva primero.

## 0.2.0 — 21.11.2026

### Añadido

- **`posts create --type page` y cualquier escritura en una página.** Una página se escribe ahora por las rutas de
  páginas de WordPress: crear, cambiar, publicar, programar, volver a borrador, papelera y borrar para siempre. Una página no
  tiene etiquetas, así que `--tags` en una página se detiene con `content.write-unsupported`. `--dry-run` nombra las
  claves de páginas que comprueba una escritura en una página.

### Cambios — pueden romper scripts

- **cli-core 0.716.0 y cli-base 0.125.3.** cli-base marca ahora como secreta una contraseña de aplicación nueva en
  una respuesta, así que el grupo `api` ya no ofrece ninguna llamada cuya respuesta pueda contenerla:
  `users-application-passwords-create`, `-list`, `-get`, `-update` e `-introspect-list`. La exclusión escrita a mano
  de esa ruta desaparece, y vuelve `api users-application-passwords-delete-all`, que pregunta antes como todo borrado.
- **`posts.delete: deny` también detiene `api pages-delete`.** La ruta de borrado de una página solo comprobaba
  `pages.delete`, así que la clave de contenido no llegaba a ella, como ya llegaba a la ruta de entradas y a crear y
  cambiar una página.

### Corregido

- **La guía de instalación dice qué obtiene un Autor o un Colaborador.** Sus propias entradas y ninguna página, como
  en los [límites](./index.md#limits). Aún decía que la sincronización de sus entradas queda parcial, algo que
  0.1.2 corrigió.
- **Un Editor o un Autor obtiene los autores.** WordPress da los usuarios con su correo solo a un Administrador, y para
  cualquier otro rol la sincronización no obtenía ningún autor. Ahora los lee como WordPress responde a cada rol: los
  autores con entradas publicadas, por su nombre, sin correo. La sincronización lo nombra como un hueco.
- **La sincronización de un Autor o un Colaborador lee solo los cambios y ve una entrada borrada para siempre.** Cada
  sincronización volvía a leer todas las entradas, y una entrada borrada para siempre se quedaba en la copia. Ahora las
  sincronizaciones siguientes leen solo lo que cambió. Una vez al día la sincronización vuelve a leer cada entrada que
  salió de la lista: una que el sitio borró para siempre se marca como borrada, y una que el rol ya no puede leer se
  queda como estaba.
- **El texto de una entrada conserva su marcador de lista `-`** en vez de convertir `- one` en `* one`.
- **`posts publish --at-time` con una hora pasada nombra `--at-time`** en su error, no `--at`.

## 0.1.2 — 19.11.2026

### Corregido

- **Un inicio de sesión de Autor o Colaborador vuelve a sincronizar sus propias entradas.** WordPress niega a los dos
  roles la lista de páginas, y esa negativa detenía toda la sincronización de entradas: después de la primera
  ejecución, los cambios en el sitio ya no llegaban a la copia. Ahora, para un rol sin permiso para editar páginas, la
  sincronización omite las páginas, lo dice en sus huecos y copia las entradas.

## 0.1.1 — 19.11.2026

### Corregido

- **`posts delete --dry-run` también nombra `api.posts-delete`.** El borrado se envía con el delete del grupo `api`,
  cuya propia clave comprueba la ejecución. Con `posts.delete` en `allow`, la vista previa decía `allow` y la
  ejecución seguía preguntando.
- **La cabecera de la skill del agente vuelve a ser YAML válido.** `skills/wordpress-cli/SKILL.md` tenía `site: posts`
  en su `description` sin comillas, que un lector de YAML toma por una clave nueva y rechaza. Ahora los agentes y
  wirecat.dev pueden leer la cabecera de la skill.

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
