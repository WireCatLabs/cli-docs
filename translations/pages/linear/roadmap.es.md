---
title: "Hoja de ruta"
---

Esta página enumera lo que `linear` hace hoy y lo que todavía no hace. Léela antes de montar un apaño para una función
que falta. No hay fechas. Para pedir algo, abre un [issue en GitHub](https://github.com/WireCatLabs/linear-cli/issues).

## Qué funciona hoy

`linear` inicia sesión con tu clave de API personal de Linear y copia tus incidencias, proyectos y comentarios, con sus
equipos, estados y etiquetas, en el almacén local de tu ordenador. Tú y tu agente listáis
incidencias por equipo, estado, responsable o etiqueta, abrís una con sus comentarios y encontráis incidencias por sus
palabras, sin red. `issues assign` convierte una incidencia en tu propia tarea. Cada consulta y mutación de la API de
Linear es un comando del grupo `api`, dentro de los permisos que fijes, en la línea de comandos o por MCP. Mira
[empieza aquí](./index.md).

## Qué falta todavía

- La búsqueda común de WireCat no lee las incidencias de Linear. Hoy solo las encuentra `issues search`.
- Iniciar sesión en el navegador. Hoy se inicia sesión con una clave de API personal.
- Comandos cortos para crear, cambiar o comentar una incidencia. Hoy pasan por el grupo `api`.

Lo que cambió en cada versión publicada está en el [registro de cambios](./changelog.md).
