---
title: "Buscar"
description: "Encuentra un mensaje, un acuerdo o una conversación completa."
---

Busca una palabra, frase, persona o una discusión cuyo texto exacto ya no recuerdas.
Empieza con los mensajes guardados en tu ordenador.


Empieza por pedir al agente:

```text prompt
Encuentra dónde acordamos el plazo de la reforma en el grupo y mi chat con el contratista. Muestra el acuerdo final, revisa respuestas posteriores y cita los mensajes. Si falta historial, dime qué hay que descargar. No envíes nada.
```

Deberías obtener la fecha acordada y sus mensajes de origen. Si solo fue una propuesta o cambió después, el agente debe indicarlo. No necesitas conocer la sintaxis de búsqueda.


## Encontrar una palabra o frase

<details>
<summary>Opcional: comandos para el terminal</summary>

```sh
tg messages search factura
max messages search factura
```

</details>

Para una frase exacta, conserva las comillas dentro de la consulta:

<details>
<summary>Opcional: comandos para el terminal</summary>

```sh
tg messages search 'exact:"factura final"'
max messages search 'exact:"factura final"'
```

</details>

Los resultados enlazan a mensajes. Revisa los mensajes cercanos antes de interpretar un acuerdo;
una línea puede omitir una corrección o respuesta posterior.

## Limitar el chat

<details>
<summary>Opcional: comandos para el terminal</summary>

```sh
tg messages search factura --chat "Proyecto"
max messages search factura --chat "Proyecto"
```

</details>

También puedes filtrar por persona, fecha o adjuntos. Las guías de
[Telegram](./tg/search.md) y [MAX](./max/search.md) ofrecen ejemplos.

## Qué búsqueda elegir

- **Recuerdas palabras:** busca mensajes, el primer paso más sencillo.
- **Recuerdas el tema:** busca discusiones por significado.
- **Encontraste un mensaje:** lee el contexto o conversación.
- **Quieres un recuento:** usa estadísticas en vez de leer cada resultado.

[Búsqueda por temas de Telegram](./tg/topic-search.md) · [MAX](./max/topic-search.md)

## Si falta un resultado

No puedes encontrar mensajes que no se han guardado. Descarga el historial del chat primero.
Buscar palabras y buscar por significado resuelven tareas distintas; prueba ambas si no recuerdas
el texto preciso. Comprueba fechas, chats elegidos y si el historial está completo.

## Probar sin instalar

Usa el [buscador de muestra](./search-playground.mdx) o la [demo de reunión](./meeting-brief.mdx).
No leen tu cuenta.

## Consultas precisas y detalles técnicos

Los filtros están en [Telegram](./tg/query-language.md) y [MAX](./max/query-language.md).
[Cómo funciona la búsqueda](./search-architecture.mdx) explica índices, conversaciones y resultados.
