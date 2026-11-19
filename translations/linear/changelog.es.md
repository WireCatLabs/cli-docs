---
title: "Registro de cambios"
---

Cambios destacados de `@wirecat/linear-cli`. Una sección por versión, la más reciente primero.

## 0.1.0 — 18.11.2026

### Añadido

- Creado a partir de `@wirecat/cli-template` 0.31.0.
- Construido a partir de un solo archivo, `wirecat.config.ts`, sin hooks.
- **`linear <profile> sync` copia tu espacio de trabajo de Linear en el almacén local de WireCat**: equipos, usuarios,
  estados del flujo de trabajo, etiquetas, proyectos, incidencias y comentarios, con los archivados marcados. Después
  de la primera vez solo lee lo que cambió, y una vez al día encuentra lo que Linear borró. La copia pertenece al
  usuario cuya clave de API personal inició sesión, porque Linear muestra a cada miembro equipos distintos.
- **`linear <profile> issues`, `projects`, `teams`, `users`, `states` y `labels` leen la copia**, también sin
  conexión. `issues assign ENG-12` convierte una incidencia en tu tarea: la tarea apunta a la incidencia y no copia
  nada de su texto.
- **`linear <profile> api` llega a cada consulta y mutación del esquema GraphQL de Linear**, un comando para cada una.
  Una escritura pide su clave de permiso, y un borrado o un archivado pide `linear.delete`.
- Inicio de sesión con una clave de API personal de Linear por stdin: `linear <profile> session start`. Se guarda en el
  llavero del sistema, nunca como argumento.
