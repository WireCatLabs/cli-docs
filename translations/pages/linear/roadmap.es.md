---
title: "Hoja de ruta"
---

Mira lo que `linear` ya hace por ti y lo que todavía no hace, antes de montar un apaño para una función que falta. No
hay fechas. Para pedir algo, abre un [issue en GitHub](https://github.com/WireCatLabs/linear-cli/issues).

## Qué funciona hoy

`linear` inicia sesión con tu clave de API personal de Linear y copia tus incidencias, proyectos, sprints (lo que
Linear llama ciclos) y comentarios, con sus equipos, estados y etiquetas, en el almacén local de tu ordenador. La
misma sincronización copia los documentos de los proyectos que eliges. Tú y tu agente listáis incidencias por equipo,
sprint, estado, responsable o etiqueta, abrís una con sus comentarios y encontráis incidencias por sus palabras, sin
red. Las incidencias abiertas asignadas a ti se vuelven tus tareas. `issues create`, `issues update` e
`issues comments create` cambian incidencias en Linear, y todas las demás consultas y mutaciones de la API de Linear
son comandos del grupo `api`, dentro de los permisos que fijes, en la línea de comandos o por MCP. Mira
[empieza aquí](./index.md).

## Qué falta todavía

- Búsqueda por significado en `issues search`. Hoy `search all` de memo encuentra las incidencias de Linear por
  significado después de `sync --embed`.
- Iniciar sesión en el navegador. Hoy se inicia sesión con una clave de API personal.

Lo que cambió en cada versión publicada está en el [registro de cambios](./changelog.md).
