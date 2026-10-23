---
title: "Búsqueda por significado"
---

Encuentra discusiones aunque usen palabras distintas de tu pregunta. La búsqueda por significado
compara representaciones numéricas del texto, embeddings, producidas por el componente elegido.
Necesita texto guardado y un modelo local instalado o servicio remoto explícito. Si no está configurado,
usa [búsqueda de palabras](./search.md) inmediatamente.

## Elige dónde procesar el texto

El modelo local procesa texto en este equipo y debe estar instalado. Un servicio remoto recibe
transcripciones al generar vectores y la pregunta al buscar. Elige explícitamente endpoint,
identificador y dimensiones. No se descargan modelos; el plan no los carga ni envía texto.

Los ejemplos usan `e5-small` local. Comprueba que esté instalado antes de aplicar; nombrarlo no
lo instala. Para comparar resultados, deben usar el mismo modelo/dimensiones que los vectores guardados.

<a id="explicit-meeting-vectors" />

## Buscar por significado

Elige un componente local ya instalado o un endpoint remoto y su dimensión:

```sh
zm personal search meetings "what did we decide about pricing?" --model e5-small --since-time 2026-09-01 --json
zm personal search meetings "example plan" --model example-model --base-url http://127.0.0.1:8080/v1 --dims 384 --json
```

Antes de leer, la búsqueda vuelve a dividir las transcripciones actuales en pasajes y genera
vectores para los que aún no tienen uno del componente elegido. La primera búsqueda tarda más
en un almacén grande y, con un servicio remoto, le envía esos pasajes. Continúa mediante
`--cursor <next_cursor>`: las páginas continúan una misma clasificación.

Para preparar vectores de antemano, revisa el plan y procésalos por lotes:

```sh
zm personal meetings embeddings --model e5-small --json
zm personal meetings embeddings --model e5-small --yes --limit 100 --json
```

El primer comando muestra el estado sin abrir el componente, descargar archivos ni crear vectores.
`--yes` valida y abre el componente, reconstruye fragmentos y procesa un lote limitado. Los componentes
locales deben estar instalados; el comando no los descarga. OpenAI usa `OPENAI_API_KEY`.
Los servicios remotos no pueden usarse con `--offline`.

## Generar vectores

La generación usa las revisiones actuales y comprueba de nuevo sus hashes antes de guardar.
`--after-transcript-id` continúa la reconstrucción; `--after-hash`, los vectores ausentes. Son cursores
distintos. Los vectores compartidos en caché siguen disponibles para otros recursos. Una generación
completa puede emitir su confirmación durante un período limitado tras la cancelación y salir con
130. Los fallos y las consultas canceladas no emiten esa confirmación; una salida bloqueada puede impedirla.

## Buscar

El comando genera primero los vectores guardados que faltan y luego hace dos búsquedas sobre las mismas
reuniones (los filtros de fecha, reunión, serie, evento, persona, proyecto y etiqueta valen para ambas) y las
ordena juntas:

- **Por palabras**, como `search meetings` sin `--model`. Una pregunta (con una palabra interrogativa al principio
  o un `?` final) se busca por sus palabras de contenido: "what did we decide about pricing?" por «decide pricing».
  Otro texto es el lenguaje de consulta; el texto que este rechaza se busca igualmente por significado, y
  `missing` lo indica.
- **Por significado**: todos los vectores de pasajes guardados del componente en esas reuniones, hasta
  `--max-chunks` (10000 por defecto).

Una línea hallada de ambas formas queda primera y se cita con su propio `ref`; `by` indica cómo se halló cada
resultado, `score` es la similitud y `passage` da la primera y la última línea que coincidió por significado. En un
empate, una línea que tiene las palabras queda por encima de un pasaje que solo se parece a la pregunta. `missing`
indica cuándo `--max-chunks` detuvo el examen. La integridad del índice y del archivo sigue siendo desconocida.
`--max-rows` y `--max-text-bytes` limitan las lecturas durante generación y búsqueda. Por MCP el mismo comando solo
funciona con un componente instalado: `--base-url` y `meetings embeddings` no se ofrecen a un agente.
[La medición](https://github.com/WireCatLabs/cli-testing/tree/main/performance/search/meeting-hybrid)
compara palabras, significado y ambos con reuniones inventadas.

Abre el pasaje mediante [el contexto de reunión](./search.md#read-around-a-search-hit) y lee
las líneas cercanas: la similitud indica una candidata, no demuestra una decisión. Si no hay
candidatos, comprueba perfil, componente, transcripciones y cobertura de generación y examen
antes de concluir que no hubo una discusión relevante.
