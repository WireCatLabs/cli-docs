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

## Vectores de reuniones

Elige un componente local ya instalado o un endpoint remoto y su dimensión:

```sh
zm meetings embeddings --model e5-small --json
zm meetings embeddings --model e5-small --yes --limit 100 --json
zm meetings semantic "example plan" --model e5-small --max-chunks 1000 --json
zm meetings semantic "example plan" --model example-model --base-url http://127.0.0.1:8080/v1 --dims 384 --json
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

La búsqueda calcula solo el vector de la consulta y lee los existentes, sin reconstruirlos ni
crearlos. Ordena los candidatos examinados de la cuenta y componente elegidos. `--after-chunk-id`
continúa el examen, no pagina una clasificación global. El informe muestra la cobertura de candidatos;
la integridad del índice y del archivo es desconocida. `--max-rows` y `--max-text-bytes` limitan las lecturas.

Comprueba que se generaron vectores antes de esperar coincidencias. Abre el pasaje con
[fuentes de reunión](./search.md#read-evidence) y lee contexto: similitud es una candidata, no prueba
una decisión. Si no hay candidatos, revisa perfil/modelo, vectores y cobertura antes de concluir ausencia.
