---
title: "Mensajes de voz: reconocimiento de voz"
---

Esta guía te ayuda a convertir los mensajes de voz de MAX en texto: elige un modelo para el idioma, descárgalo una vez y transcribe un mensaje o los mensajes de voz de unos resultados concretos. El reconocimiento se ejecuta en tu ordenador; las grabaciones no se envían a un modelo de IA externo.

## Inicio rápido

```sh
max models audio list --json
max models audio download gigaam-v3
max messages transcribe "Учебная группа" 204 --json
```

La CLI obtiene la grabación de MAX, cierra la conexión y ejecuta el modelo local. Los modelos no se descargan automáticamente al leer un chat: ejecuta primero `models audio download`. Los archivos descargados se reutilizan y se comprueban mediante su suma de verificación durante la instalación.

## Elegir un modelo

| Modelo | Uso recomendado |
| --- | --- |
| `gigaam-v3` | Voz en ruso; modelo predeterminado |
| `gigaam-v3-ctc` | Otra variante del modelo para ruso; la transcripción y el formato pueden variar |
| `parakeet-v3` | Voz en varios idiomas, incluidos español, inglés y ruso; requiere más espacio y memoria |

Consulta `models audio list` para ver el tamaño exacto y el estado de instalación. Elige un modelo compatible con el idioma de la grabación. Para una ejecución:

```sh
max models audio download parakeet-v3
max messages transcribe "Учебная группа" 204 --model parakeet-v3 --json
```

Para las siguientes ejecuciones:

```sh
max config set --defaults transcribeModel parakeet-v3
```

`models audio` gestiona los modelos de voz. `models text` gestiona los modelos de búsqueda y las claves de API; es otro grupo. El ajuste de imágenes `models.ocr` no cambia el reconocimiento de voz.

## Varios mensajes

```sh
max messages list "Учебная группа" --limit 20 --transcribe --json
max inbox --transcribe --json
```

`--transcribe` procesa los mensajes de voz de los resultados mostrados que todavía no tienen texto, en lugar de todo el historial del chat. Primero descarga las grabaciones, después cierra la conexión y realiza el reconocimiento. Si lo necesitas, usa `--model` para elegir el modelo de una ejecución.

El texto se guarda bajo tu cuenta en la base de datos local compartida. Lo utilizan la vista de mensajes, la bandeja de entrada, el resumen y MCP. Al volver a transcribir el mismo mensaje con el mismo modelo, se puede reutilizar el resultado guardado. En JSON, el texto aparece en `transcript`; las grabaciones fallidas se enumeran en `unheard` y el motivo también aparece en stderr.

## Formatos y límites

Este flujo admite los mensajes de voz que MAX representa como `kind: voice`. No promete transcribir cualquier MP3/WAV enviado como documento ni extrae automáticamente el habla de los vídeos. Para esos archivos, el agente necesita otras herramientas disponibles, como extracción de la pista de audio, conversión de audio y un modelo de voz adecuado.

Los modelos se guardan en una carpeta compartida por MAX y Telegram; `CLI_COMMON_CACHE_DIR` permite cambiarla. La descarga requiere espacio en disco y el reconocimiento necesita memoria y tiempo de procesador. La velocidad depende de la duración de la grabación, del modelo y del ordenador.

## Calidad

El idioma, el ruido, varias personas hablando a la vez, la calidad del micrófono, el ritmo del habla, los nombres y los términos especializados afectan al resultado. Un modelo más grande no garantiza mejores resultados para un idioma concreto. Contrasta los números, nombres y acuerdos importantes con el audio. Una transcripción guardada no demuestra que todas las palabras se hayan reconocido correctamente.

Un agente puede leer la transcripción y ayudar a encontrar errores, pero para verificarla necesita acceso a la grabación y una herramienta de reproducción o reconocimiento. Esto depende de sus herramientas. Los comandos de CLI anteriores no requieren una API externa ni consumen su cuota.

Los documentos y el OCR de imágenes se explican en la [guía de adjuntos](./attachments.md). Consulta la [guía de API](./external-models.md) para configurar modelos externos.
