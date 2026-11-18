---
title: "Historial de cambios"
---

Cambios notables en `@wirecat/yandex-disk-cli`. Una sección por versión, las más nuevas arriba.

## 0.2.0 — 18.11.2026

### Añadido

- `ydisk store info` muestra el archivo del almacén compartido, su tamaño, su formato y el número de filas, así que
  WireCat Desktop puede decir si Yandex Disk lo lee.
- `ydisk <profile> account remove --keep-data|--delete-data` cierra la sesión del perfil y lo olvida en este
  ordenador. Conserva o borra las carpetas elegidas y los archivos sincronizados, según lo que elijas.
- `folders browse` da a cada carpeta un `kind` y un `has_children`. Yandex no da el número de elementos hijos, así que
  se mira dentro de cada carpeta, con una petición cada una, cuando el nivel tiene 20 carpetas o menos. Con más,
  `has_children` es `null`.

### Corregido

- Publicado desde GitHub Actions con la procedencia de npm (provenance), así que WireCat Desktop lo instala: Desktop se
  niega a instalar una versión de una herramienta integrada que no compiló el workflow de su propio repositorio, y la
  0.1.0 se publicó desde un ordenador.
- **Las guías cubren lo que hace la herramienta, paso a paso.** Páginas nuevas: [encuentra un documento](./search.md)
  (palabras, formas de las palabras, significado, nombres de archivo), [conecta a tu agente](./mcp.md) (el skill,
  `mcp add`, `mcp config`, aplicaciones del navegador y qué puede cambiar un agente), [recetas](./recipes.md) y
  [comparación con otras herramientas](./compare.md). [Instala e inicia sesión](./installation.md) explica cómo
  conseguir el token de Yandex con los nombres que usa el propio Yandex, [la solución de problemas](./troubleshooting.md)
  va por síntomas e incluye los códigos de salida, y [la seguridad](./security.md) dice qué se queda en tu ordenador y
  cómo quitarlo. Los pasos del token ahora nombran el tipo de aplicación "For API access or debugging", como las
  páginas de Yandex.
- La ayuda y el error de `--cursor` en `folders browse` y `files list` nombran `page.next_cursor`, la clave que tiene la
  respuesta, y no `page.next`.

## 0.1.0 — 17.11.2026

### Añadido

- Se empezó desde `@wirecat/cli-template` 0.25.0.
- **Inicio de sesión con un token OAuth de Yandex** pegado una sola vez: `session start` lo lee oculto o desde stdin,
  lo comprueba con `GET /v1/disk` y lo guarda en el llavero del sistema. `session status --check` y `doctor --online`
  dicen de quién es.
- **Carpetas elegidas del Disco como texto en el que buscar**: `folders add <path>`, `sync`, `status`,
  `documents list|show|export`, `search`, `catalog`, etiquetas, notas y recuerdos, los comandos compartidos de
  documentos de cli-core. Cada sincronización recorre de nuevo las carpetas elegidas (la API del Disco no tiene un
  registro de cambios) y lee solo los archivos cuyo MD5 cambió. Un archivo movido conserva su id, sus etiquetas y sus
  notas. El texto sale de PDF, docx, xlsx, CSV, TSV, texto y Markdown. Las horas se guardan y se responden en UTC.
- **Los archivos en vivo**: `files list|show|download|upload|copy|move|create|delete|restore|publish|unpublish`, por
  ruta del Disco. `files delete` envía a la papelera. `--replace` y `files delete` preguntan como lo hace
  `files.delete`, `files publish` como lo hace `files.share`, y `--dry-run` muestra cada clave que comprueba la
  escritura. `files publish` responde con el enlace público, o deja fuera `public_url` cuando no puede leerlo de
  vuelta. Las descargas y las subidas van a la dirección que da Yandex, sin el token.
- **`api`**: un comando por cada operación de la descripción Swagger 1.2 de Yandex, 20 en total. Se dejan fuera las
  tres que responden con un enlace de descarga o de subida, y los enlaces `file`, `preview` y `sizes` de un recurso se
  quitan de cada respuesta. `--all` pasa las páginas donde la API las pagina. Un borrado permanente, `overwrite=true` y
  un enlace público preguntan según `files.delete` y `files.share`. Una operación que hace lo que hace un comando de
  `files` comprueba también la clave de ese comando: `files.move: deny` detiene también `api resources-move`, en la
  ejecución y en `--dry-run`.
