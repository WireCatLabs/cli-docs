---
title: "Historial de cambios"
---

Cambios destacados en `@wirecat/attio-cli`. Una sección por versión, la más nueva primero.

## 0.2.2 — 19.11.2026

### Corregido

- **La página de inicio, la instalación, el uso y la página de fallos dicen qué lee `sync`**: cada negociación y
  luego las personas y empresas que nombra. Una persona sin negociación se encuentra en directo con `people list`.
- **`people list` y `organizations list` dicen que buscan por palabras**, porque la búsqueda propia de Attio
  encuentra registros por palabras. Su ayuda ya no ofrece condiciones `field:value`, y una condición sobre un campo
  que no sea `name` se rechaza con ese motivo.
- **`people show Anna` encuentra a Anna por su nombre.** Attio rechazaba un nombre en lugar de un id de registro, y
  `show` se detenía ahí.

## 0.2.1 — 19.11.2026

### Corregido

- **La página de uso, las próximas mejoras y la referencia de comandos dicen qué copia `sync`**: tus negociaciones y
  las personas y empresas que aparecen en ellas. La referencia de comandos empieza con lo que encuentras en ella y una
  lista de sus secciones principales.

## 0.2.0 — 19.11.2026

### Cambiado — puede romper a quien llama

- **`attio <profile> sync` copia solo las personas y empresas que aparecen en tus negociaciones**, como hace
  bitrix24-cli. Attio añade una persona y una empresa por cada dirección de tu correo, y una copia completa guardaba
  miles a las que nunca vendes. Cualquier otra se sigue encontrando con `people list` y `organizations list`, que leen
  Attio en directo.

### Corregido

- **Un espacio de trabajo con el objeto Deals de Attio desactivado se sincroniza**, y `sync` lo indica como una
  carencia. Antes fallaba con `not_found`.

## 0.1.0 — 18.11.2026

### Añadido

- Partió de `@wirecat/cli-template` 0.28.0.
- Creado a partir de un solo archivo, `wirecat.config.ts`.
- **`attio <profile> sync` copia tus negociaciones de Attio en el almacén local de WireCat**, con su etapa, su
  responsable, su importe, su empresa, sus personas y los atributos propios del espacio de trabajo, y tus personas y
  empresas. Attio no puede listar lo que cambió desde un momento dado, así que cada sincronización lista todos los
  registros.
- **`attio <profile> deals`, `pipelines`, `changes`, `fields` y `search all` leen la copia**, también sin conexión. El
  único embudo de negociaciones de Attio es `Deals`: una etapa que Attio celebra es ganada, y una con el título "Lost"
  es perdida.
- **`attio <profile> people list|show` y `organizations list|show` leen Attio en directo**, con palabras que buscan en
  nombres y correos.
- **`attio <profile> session start` inicia sesión con un token de acceso de Attio** por stdin, comprobado con
  `GET /v2/self`.
- **`attio <profile> api` ejecuta cada operación de la API de Attio**, cada una con sus propias opciones, su ayuda y
  `--json`.
- **`attio <profile> users list|show` lee en directo los miembros de tu espacio de trabajo.**
