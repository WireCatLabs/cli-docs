---
title: "Modelos externos: configuración de API"
---

<a id="tareas-que-usan-una-api" />
<a id="какие-задачи-используют-api" />

Esta página explica cómo configurar servicios de IA que `max` llama directamente para leer escaneos e imágenes, analizar relaciones entre temas o completar una plantilla de respuesta. Aprenderás a elegir un proveedor, guardar una clave, seleccionar el modelo para cada tarea y probarlo con pocos datos.

Unas palabras que aparecerán a continuación:

- **Modelo externo**: modelo de IA que se ejecuta en el servidor del proveedor (por ejemplo, OpenAI o Anthropic). `max` le envía datos a través de la red a través de una API.

- **Propósito**: tarea para la cual se seleccionó el modelo: `models.ocr`, `models.analysis`, `models.replies`. Cada tarea puede tener su propio proveedor y su propio modelo.
- **Punto final** (`baseUrl`): dirección del servidor al que se envía la solicitud.

Estos ajustes no controlan a tu agente de IA. Cuando el agente lee un archivo por su cuenta, usa sus propias herramientas y configuración.

## ¿Qué se puede conectar?

| Tarea | Ajuste | Cómo se ejecuta |
| --- | --- | --- |
| OCR de imágenes y PDF escaneados | `models.ocr` | `attachments extract --ocr`; necesita un modelo que admita imágenes |
| Analizar vínculos entre conversaciones en mensajes guardados | `models.analysis` | `conversations build --analyze`; el consentimiento se aplica a un chat y proveedor concretos |
| Bloque de IA en una plantilla de respuesta | `models.replies` | Regla con un bloque `{% ai %}` y consentimiento aparte para respuestas; consulta [reglas de respuesta](./replies.md) |
| Valores comunes de estas tareas | `models.default` | Se usan para los campos no configurados en una tarea concreta |

La búsqueda por significado se puede configurar por separado: `embeddingProvider`, `embeddingModel` y `embeddingBaseUrl`. Guarda las llaves de la misma forma. Para obtener más detalles, consulte [guía de búsqueda](./search.md). El reconocimiento de voz se reconoce mediante un modelo de voz independiente en su computadora, sin una API; consulte [reconocimiento de voz](./audio-recognition.md).

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

Para un punto final no estándar, el nombre de la clave es su host, incluido el puerto si se especifica en la URL. El campo `baseUrl` en sí no es una clave. Si el servidor acepta texto, esto no significa que lea imágenes; verifique esto en la documentación de su servidor.

Para volver al endpoint estándar de OpenAI, elimina `models.ocr.baseUrl`. Las API de texto y las compatibles con Anthropic no se pueden mezclar solo cambiando la URL: elige el adaptador que corresponda al protocolo del servidor.

## Perfil, valores comunes y una ejecución

Los comandos `config set` anteriores cambian el perfil seleccionado. Pon su nombre primero, por ejemplo `max work config set models.ocr.provider openai`, o añade `--defaults` para los valores comunes. Puedes configurar una tarea por separado: `models.ocr.*` no sustituye `models.analysis.*` ni `models.replies.*`.

Cada campo se toma primero de su variable de entorno, después de los ajustes del perfil y los valores comunes. Los campos sin configurar pueden heredarse de `models.default`. Por ejemplo, para una ejecución en un terminal POSIX con una clave ya guardada:

```sh
MAX_MODELS_OCR_PROVIDER=openai MAX_MODELS_OCR_MODEL=gpt-4o-mini max attachments extract --chat "Учебная группа" --ocr --limit 1 --json
```

En PowerShell, configura las variables correspondientes `$env:MAX_MODELS_OCR_PROVIDER` y `$env:MAX_MODELS_OCR_MODEL`. `MAX_MODELS_OCR_BASE_URL` sobrescribe el endpoint. Para claves se admiten `MAX_OPENAI_API_KEY`/`OPENAI_API_KEY` y las variables correspondientes de Anthropic; no pongas sus valores en ejemplos ni en el historial de comandos.

`models.ocr.provider off` desactiva esta asignación. La configuración y la fuente de cada valor se muestran en `config show`. La forma en que se estructuran los perfiles y los valores generales se puede encontrar en la [guía de configuración](./configuration.md).

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

Los resultados exitosos de OCR se almacenan para realizar búsquedas; La reproducción utiliza el hash del archivo y el modelo objetivo seleccionado. El error no elimina el texto válido que se guardó anteriormente y el texto que guardó el agente no se sobrescribe. Los formatos, dependencias y límites se describen en [guía adjunta](./attachments.md).
