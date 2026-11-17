---
title: "Hoja de ruta"
---

Esta página reúne lo que está previsto para `notion` y aún no está hecho. Léela antes de buscar un rodeo para una
función que falta: puede que ya esté en camino. El orden puede cambiar y no hay fechas. Para proponer algo, abre un
[issue en GitHub](https://github.com/WireCatLabs/notion-cli/issues).

## Qué funciona hoy

`notion` inicia sesión con tu propio token de Notion y lee una página en directo como Markdown. Copia las páginas y
bases de datos que elijas, con las páginas que contienen y las filas de las bases, al almacén local de tu ordenador.
Tú y tu agente buscáis en esa copia por palabras y por significado sin conexión, leéis y exportáis sus páginas y
añadís vuestras etiquetas y notas, desde la línea de comandos o por MCP. También escribís páginas con
`documents create`, `documents update`, `documents delete` y `documents restore`, leéis y respondéis comentarios con
`comments list`, `comments create` y `comments reply`, y añadís un archivo a una página con `files upload`. Consulta
[empieza aquí](./index.md).

## A continuación

- Buscar filas de una base de datos por una propiedad, como `status:Done`. Hoy la búsqueda encuentra una fila solo
  por su texto.

## Más adelante

- Mantener una carpeta de archivos Markdown en tu ordenador al día con un árbol de páginas de Notion, en los dos
  sentidos.
- Iniciar sesión en el navegador, con tu propia conexión de Notion, en lugar de pegar un token.

Lo que cambió en cada versión está en el [registro de cambios](./changelog.md).
