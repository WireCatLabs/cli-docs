---
title: "Modelos externos: configuración de API"
---


Esta guía te ayuda a conectar un modelo a la CLI: elegir un proveedor, guardar una clave, configurar un modelo para una tarea concreta y llamarlo explícitamente. Aquí el modelo se usa mediante una API, en vez de las herramientas del propio agente; disponibilidad, precio y funciones dependen del proveedor.


## Tareas que usan una API


| Tarea | Ajuste | Cómo se ejecuta |
| --- | --- | --- |
| OCR de imágenes y PDF escaneados | `models.ocr` | `attachments extract --ocr`; necesita un modelo que admita imágenes |
| Analizar vínculos entre conversaciones en mensajes guardados | `models.analysis` | `conversations build --analyze`; el consentimiento se aplica a un chat y proveedor concretos |
| Bloque de IA en una plantilla de respuesta | `models.replies` | Regla con un bloque `{% ai %}` y consentimiento aparte para respuestas; consulta [reglas de respuesta](./replies.md) |
| Valores comunes de estas tareas | `models.default` | Se usan para los campos no configurados en una tarea concreta |

La búsqueda semántica tiene ajustes propios, `embeddingProvider`, `embeddingModel` y `embeddingBaseUrl`, pero puede usar el mismo almacenamiento de claves. Consulta [búsqueda](./search.md). La transcripción de voz usa un modelo de voz local aparte; consulta [transcripción de voz](./audio-recognition.md).


El ajuste `models.ocr` no elige el modelo de tu agente. Cuando el agente lee un archivo por sus propios medios, usa sus propias herramientas y modelo.


## OpenAI: configurar OCR


Elige el identificador exacto de un modelo que admita imágenes. El ejemplo siguiente usa `gpt-4o-mini`; cambia el valor para otro modelo. Primero guarda la clave mediante entrada interactiva oculta y después configura la tarea:


```sh
max models text key set openai
max config set models.ocr.provider openai
max config set models.ocr.model gpt-4o-mini
max config show
```

La clave no se pasa como argumento del comando ni se guarda en el campo `models` del archivo de ajustes. `key set` también acepta el secreto por stdin; debe proporcionarlo tu gestor de secretos. No pongas la propia clave en la línea de comandos.


Si `baseUrl` no está configurado ni se hereda de `models.default`, se usa el endpoint estándar de OpenAI. Para probar con un lote pequeño:


```sh
max attachments extract --chat "Учебная группа" --ocr --concurrency 1 --limit 1 --json
```

`--limit 1` limita archivos, no llamadas API. Un PDF con varias páginas escaneadas puede necesitar una llamada por página. Un PDF de texto o DOCX puede procesarse localmente sin llamar al modelo. El número de llamadas no equivale al de archivos.


## Anthropic


Elige el identificador exacto de un modelo de visión al que tengas acceso; `your-vision-model` es un marcador para tu valor, no un nombre de modelo real.


```sh
max models text key set anthropic
max config set models.ocr.provider anthropic
max config set models.ocr.model your-vision-model
max config unset models.ocr.baseUrl
```

El último comando elimina cualquier endpoint sobrescrito anteriormente. Si la URL tampoco se hereda de `models.default`, se usa el endpoint estándar de Anthropic.


## Servidor compatible o pasarela compartida


Un endpoint compatible con OpenAI usa el adaptador `openai`, aunque el servidor pertenezca a otro proveedor. Debe admitir la API correspondiente e imágenes, no solo peticiones de texto. Configura una URL sin clave, parámetros de consulta ni fragmento:


```sh
max config set models.ocr.provider openai
max config set models.ocr.model your-vision-model
max config set models.ocr.baseUrl https://gateway.example.org/v1
max models text key set gateway.example.org
```

Para un endpoint personalizado, el nombre de la clave es su host, incluido el puerto si aparece en la URL. El propio campo `baseUrl` no es una clave. Admitir peticiones de texto normales no implica admitir OCR con visión; consulta la documentación de tu servidor.


Para volver al endpoint estándar de OpenAI, elimina `models.ocr.baseUrl`. Las API de texto y las compatibles con Anthropic no se pueden mezclar solo cambiando la URL: elige el adaptador que corresponda al protocolo del servidor.


## Perfil, valores comunes y una ejecución


Los comandos `config set` anteriores cambian el perfil seleccionado. Pon su nombre primero, por ejemplo `max work config set models.ocr.provider openai`, o añade `--defaults` para los valores comunes. Puedes configurar una tarea por separado: `models.ocr.*` no sustituye `models.analysis.*` ni `models.replies.*`.


Cada campo se toma primero de su variable de entorno, después de los ajustes del perfil y los valores comunes. Los campos sin configurar pueden heredarse de `models.default`. Por ejemplo, para una ejecución en un terminal POSIX con una clave ya guardada:


```sh
MAX_MODELS_OCR_PROVIDER=openai MAX_MODELS_OCR_MODEL=gpt-4o-mini max attachments extract --chat "Учебная группа" --ocr --limit 1 --json
```

En PowerShell, configura las variables correspondientes `$env:MAX_MODELS_OCR_PROVIDER` y `$env:MAX_MODELS_OCR_MODEL`. `MAX_MODELS_OCR_BASE_URL` sobrescribe el endpoint. Para claves se admiten `MAX_OPENAI_API_KEY`/`OPENAI_API_KEY` y las variables correspondientes de Anthropic; no pongas sus valores en ejemplos ni en el historial de comandos.


`models.ocr.provider off` desactiva esta tarea. `config show` muestra los ajustes y el origen de cada valor. Referencia completa: [configuración](./configuration.md).


## Consentimiento, datos y coste


Para OCR, `--ocr` explícito permite enviar las imágenes y páginas escaneadas seleccionadas al modelo configurado; el consentimiento para análisis o respuestas automáticas no sustituye esta elección. El OCR no se activa automáticamente si un agente no puede leer un archivo. `--offline --ocr` no se pueden combinar.


El análisis requiere consentimiento aparte para el chat y proveedor. Las respuestas automáticas tienen su propio consentimiento y pueden enviar mensajes: configurar una clave por sí solo no autoriza el envío. Sigue las [reglas de respuesta](./replies.md) antes de activar bloques de IA.


Una API puede cobrar tanto por imágenes como por texto de entrada y salida. Consulta con el proveedor los precios y límites del modelo elegido; usa un ámbito pequeño y `--limit` en la primera ejecución. El procesamiento paralelo acelera el trabajo, pero no reduce los datos ni garantiza precisión. Un mal escaneo o un modelo inadecuado pueden producir errores incluso con una respuesta HTTP correcta.


## Si falla una llamada


| Resultado | Qué comprobar |
| --- | --- |
| Proveedor o modelo sin configurar | `config show`, campos de la tarea y herencia de `models.default` |
| Falta la clave o el proveedor ha rechazado la petición | Nombre correcto de clave, perfil, endpoint y acceso al modelo; no imprimas la clave para comprobarla |
| El servidor no acepta imágenes | Compatibilidad de la API y funciones de visión del modelo elegido |
| `engine-missing` para un PDF | `unpdf` y `@napi-rs/canvas` locales; no es un error de API |
| Sin texto o texto insuficiente | Calidad e integridad de la imagen, formato de respuesta, modelo y límites del OCR |
| Límite de frecuencia | Esperar el tiempo indicado por el proveedor e iniciar otra ejecución; tras un 429 cesan las nuevas llamadas OCR de la ejecución actual |

Los resultados correctos del OCR se guardan para buscar; la extracción repetida usa el hash del archivo y el destino del modelo elegido. Los errores no borran el texto válido guardado anteriormente ni sobrescriben el texto del agente. Los formatos, dependencias y límites se explican en la [guía de adjuntos](./attachments.md).
