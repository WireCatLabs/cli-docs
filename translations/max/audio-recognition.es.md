---
title: "Mensajes de voz: reconocimiento de voz"
---

Esta página te ayuda cuando recibes una nota de voz en MAX y tú o tu agente de IA preferís leerla. Aprenderás a elegir un modelo adecuado al idioma, descargarlo una vez y convertir en texto un mensaje de voz o los de una lista.

Términos que encontrarás más abajo:

- **Modelo de voz**: archivo que convierte audio en texto. Se descarga una vez y después funciona sin internet.
- **Transcripción local**: el modelo funciona en tu ordenador. La grabación no sale a un servicio externo ni al proveedor del agente y no consume límites de API.
- **Transcripción**: texto del mensaje de voz. `max` lo guarda para no volver a procesar la misma grabación.

## Qué puedes hacer

| Tarea | Comando |
| --- | --- |
| Ver modelos, tamaños y descargas | `max models audio list` |
| Descargar un modelo | `max models audio download <модель>` |
| Transcribir una nota de voz | `max messages transcribe <чат> <сообщение>` |
| Transcribir notas de la lista mostrada | `--transcribe` en `messages list` e `inbox` |
| Elegir el modelo para siguientes ejecuciones | `max config set --defaults transcribeModel <модель>` |

## Inicio rápido

```sh
max models audio list --json
max models audio download gigaam-v3
max messages transcribe "Учебная группа" 204 --json
```

`max` obtiene el audio de MAX, cierra la conexión y después ejecuta el modelo. No lo descarga automáticamente al leer un chat: ejecuta antes `models audio download`. Reutiliza los archivos descargados y comprueba su suma de verificación al instalarlos.

## Elegir un modelo

| Modelo | Uso |
| --- | --- |
| `gigaam-v3` | Voz en ruso; predeterminado |
| `gigaam-v3-ctc` | Otra variante rusa; el texto y su formato pueden variar |
| `parakeet-v3` | Varios idiomas, incluidos español, inglés y ruso; necesita más disco y memoria |

`models audio list` muestra el tamaño exacto y las descargas. Elige un modelo que conozca el idioma de la grabación. Para una ejecución:

```sh
max models audio download parakeet-v3
max messages transcribe "Учебная группа" 204 --model parakeet-v3 --json
```

Para todas las ejecuciones siguientes:

```sh
max config set --defaults transcribeModel parakeet-v3
```

No confundas los grupos: `models audio` son modelos de voz; `models text` son modelos de búsqueda y claves de API. `models.ocr` para imágenes no afecta a la voz.

## Varios mensajes

```sh
max messages list "Учебная группа" --limit 20 --transcribe --json
max inbox --transcribe --json
```

`--transcribe` solo procesa las notas sin texto de la lista mostrada, no todo el historial. Descarga el audio, cierra la conexión y ejecuta el modelo. `--model` elige otro para una ejecución.

El texto se guarda bajo tu cuenta en el archivo local común. Lo ven las vistas de mensajes, la bandeja de entrada, el resumen y el servidor MCP. Si ese mensaje ya se transcribió con el mismo modelo, `max` puede devolver el texto guardado. En JSON aparece en `transcript`. Las notas no reconocidas aparecen en `unheard` y el motivo se escribe en stderr.

## Formatos y límites

Se transcriben mensajes que MAX identifica como `kind: voice`. Un MP3 o WAV enviado como documento no se transcribe por esta vía, ni se extrae la voz de vídeos. El agente necesita otra herramienta: extraer el audio, convertirlo y ejecutar un modelo de voz adecuado.

La transcripción local requiere una grabación Ogg Opus completa, mono o estéreo, de hasta 10 minutos. Divide las grabaciones más largas antes de transcribirlas.

Los modelos comparten carpeta para MAX y Telegram; `CLI_COMMON_CACHE_DIR` cambia su ubicación. Necesitan disco para guardarse, y memoria y CPU para transcribir. La velocidad depende de la duración, el modelo y el ordenador.

## Calidad

Influyen el idioma, ruido, voces simultáneas, micrófono, ritmo, nombres y términos poco comunes. Un modelo mayor no siempre es mejor para un idioma concreto. Contrasta cifras, nombres y acuerdos importantes con el audio: guardar texto no demuestra que cada palabra sea correcta.

El agente puede leer la transcripción y detectar errores. Para contrastarla con el audio necesita la grabación y herramientas propias para escucharla o reconocerla; depende del agente.

El texto de documentos e imágenes se explica en [adjuntos](./attachments.md). Para conectar un modelo externo por API, consulta [modelos externos](./external-models.md).
