---
title: "Búsqueda por significado"
---

Busca reuniones guardadas por significado con un componente elegido explícitamente. No se descargan
archivos ni se envían datos hasta elegir el componente y, si es remoto, su endpoint.

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
