---
title: "Buscar"
description: "Encuentra un mensaje, un acuerdo o una conversación completa."
---

Busca una palabra, frase, persona o una discusión cuyo texto exacto ya no recuerdas.
Empieza con los mensajes guardados en tu ordenador.

## Encontrar una palabra o frase

```sh
tg messages search factura
max messages search factura
```

Para una frase exacta, conserva las comillas dentro de la consulta:

```sh
tg messages search 'exact:"factura final"'
max messages search 'exact:"factura final"'
```

Los resultados enlazan a mensajes. Revisa los mensajes cercanos antes de interpretar un acuerdo;
una línea puede omitir una corrección o respuesta posterior.

## Limitar el chat

```sh
tg messages search factura --chat "Proyecto"
max messages search factura --chat "Proyecto"
```

También puedes filtrar por persona, fecha o adjuntos. Las guías de
[Telegram](./tg/search.md) y [MAX](./max/search.md) ofrecen ejemplos.

## Qué búsqueda elegir

- **Recuerdas palabras:** busca mensajes, el primer paso más sencillo.
- **Recuerdas el tema:** busca discusiones por significado.
- **Encontraste un mensaje:** lee el contexto o conversación.
- **Quieres un recuento:** usa estadísticas en vez de leer cada resultado.

[Búsqueda por temas de Telegram](./tg/topic-search.md) · [MAX](./max/topic-search.md)

## Si falta un resultado

La búsqueda por palabras también consulta el servidor de Telegram, o el de MAX si indicas
un chat. La búsqueda solo en el archivo y por significado necesita historial guardado:
descarga el período que falta y repite la consulta. Revisa fechas, chats y cobertura.

## Probar sin instalar

Usa el [buscador de muestra](./search-playground.mdx) o la [demo de reunión](./meeting-brief.mdx).
No leen tu cuenta.

## Consultas precisas y detalles técnicos

Los filtros están en [Telegram](./tg/query-language.md) y [MAX](./max/query-language.md).
[Cómo funciona la búsqueda](./search-architecture.mdx) explica índices, conversaciones y resultados.
