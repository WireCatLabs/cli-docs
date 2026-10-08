---
title: "Buscar"
description: "Encuentra mensajes, personas, chats o archivos por palabras, formas, errores de escritura o significado."
---

Esta página te ayuda a encontrar mensajes, acuerdos, personas, chats y documentos en Telegram o MAX. Aprenderás qué buscar, cómo elegir el método y cómo comprobar las fuentes aunque solo recuerdes parte de una frase o el tema.

**Qué puedes buscar:**

- **Mensajes y discusiones** — por texto, autor, fecha, tema y mensajes cercanos.
- **Contactos y personas** — por nombre, usuario o ID, y después recordar lo que hablasteis.
- **Chats, grupos y canales** — por título entre los chats de tu cuenta.
- **Archivos** — por nombre, extensión y contenido, si el texto del documento ya se extrajo y guardó.
- **Enlaces y adjuntos** — por ejemplo, mensajes con un enlace, PDF o audio; las transcripciones se pueden buscar una vez guardado su texto.

Se admite contenido de archivos de texto, Word y PDF con capa de texto. Las fotos y escaneos
necesitan reconocimiento de texto primero; pídeselo al agente. Detalles: [archivos de Telegram](./tg/search.md#for-scripts-and-agents)
y [MAX](./max/search.md#scripts-y-agentes). Para encontrar personas, consulta [Personas](./people.md).

Para formas de palabras, errores de escritura y búsqueda por significado, consulta [Cómo funciona la búsqueda](./search-architecture.mdx).

## Descarga primero el historial de los chats pertinentes

Antes de buscar mensajes antiguos, descarga las conversaciones del periodo que necesitas.
Iniciar sesión no descarga todo el historial; la búsqueda habitual lee mensajes ya guardados
localmente. Si falta esa conversación, un resultado vacío no significa que nunca se enviara el mensaje.

Pide al agente que descargue los chats elegidos o ejecuta el comando de tu mensajero. Sustituye
`Project` por el nombre del chat; el ejemplo descarga el último mes, hasta 1000 mensajes por ejecución:

```sh
tg store fetch "Project" --since-time 30d --limit 1000
```

```sh
max store fetch "Project" --since-time 30d --limit 1000
```

Si se alcanza el límite, el historial del mes puede seguir incompleto. Instrucciones para descargar,
continuar y comprobar el historial: [Telegram](./tg/archive.md#fetch-a-chats-history) y
[MAX](./max/archive.md#descargar-el-historial).

## Encontrar una palabra o frase

Empieza por pedir al agente:

```text prompt
Usa tg CLI. Encuentra dónde acordamos el plazo de la reforma en el grupo y mi chat con el contratista. Muestra el acuerdo final, revisa respuestas posteriores y cita los mensajes. Si falta historial, dime qué hay que descargar. No envíes nada.
```

Deberías obtener la fecha acordada y sus mensajes de origen. Si solo fue una propuesta o cambió después, el agente debe indicarlo. No necesitas conocer la sintaxis de búsqueda.

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

## Si no recuerdas las palabras exactas

Hay varias formas de buscar mensajes:

- **Palabra o frase exacta:** si recuerdas cómo se escribió. Usa `exact:` para una coincidencia literal.
- **Parte de una palabra:** `piso*` encuentra palabras que empiezan así, como «piso» y «pisos».
- **Formas y raíces compartidas:** «piso» puede encontrar «pisos». Depende del idioma y del índice configurado.
- **Errores de escritura:** pide al agente que admita escritura aproximada. La búsqueda puede corregir palabras desconocidas según el vocabulario guardado; el agente elige el modo adecuado.
- **Significado:** si recuerdas el tema, como «el plazo de la reforma que acordamos», pero no las palabras. Necesita un índice de discusiones preparado.

Formas, coincidencias exactas, índices y búsqueda por significado: **[Cómo funciona la búsqueda](./search-architecture.mdx)**.
Sintaxis y modos detallados: [Telegram](./tg/query-language.md#the-older-modes) y
[MAX](./max/query-language.md#los-modos-anteriores). Estos modos describen la búsqueda de mensajes;
buscar nombres de chats o personas puede funcionar de otra forma.

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
