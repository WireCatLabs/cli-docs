---
title: "Adjuntos: envío, descarga y extracción de contenido"
---


Elige cómo enviar o descargar un adjunto, consulta qué archivos lee la propia CLI, qué dependencias necesitas y cuándo pedir a un agente o modelo externo que lea un archivo. Después de la extracción, puedes guardar el texto para buscarlo: `content:` encuentra el mensaje original.


El envío entrega un archivo al chat, la descarga guarda sus bytes y la extracción obtiene su contenido para leerlo y buscarlo. Son funciones distintas: puedes enviar y descargar un XLSX, aunque el extractor integrado todavía no lee sus celdas.


## Qué puedes enviar


La tabla muestra cómo elige la CLI el tipo de adjunto. La aceptación y el procesamiento de un archivo concreto también dependen de MAX. El envío requiere una orden explícita; extraer texto no envía nada al chat.


| Archivo | Cuenta personal: `messages send --file` | Bot: `bot messages send --file` |
| --- | --- | --- |
| JPG, JPEG, PNG, GIF | Foto | Imagen |
| WEBP | Foto | Archivo |
| TIF, TIFF, BMP, HEIC | Archivo | Imagen |
| MP4, MOV, WEBM, MKV | Vídeo; `--as-file` envía el vídeo como archivo | Vídeo; `--as-file` envía el vídeo como archivo |
| MP3, WAV, M4A, OGG, OPUS, AAC, FLAC | Archivo | Audio |
| PDF, DOCX, XLSX, PPTX, ZIP y otros archivos | Archivo | Archivo |

`--voice` es una vía específica para mensajes de voz en Ogg Opus, no para cualquier audio. Una cuenta personal envía la nota de voz por separado, sin texto ni otros adjuntos. Las imágenes se identifican por su extensión, también con `--file`; aquí `--as-file` cambia cómo se envía un vídeo, pero no convierte una imagen en documento. Consulta [envío](./usage.md) y [bots](./bot.md).


## Qué puedes descargar


Esta sección se aplica a las cuentas personales. La descarga guarda bytes; no extrae texto ni convierte un documento a otro formato.


| Adjunto del mensaje | `messages download` |
| --- | --- |
| Documento u otro archivo con un identificador de archivo | Obtiene un enlace de MAX y guarda el archivo; su extensión no limita la descarga |
| Vídeo con un identificador de vídeo | Obtiene un enlace MP4 disponible; guarda la versión que proporciona MAX |
| Foto con un enlace | Guarda la imagen disponible |
| Mensaje de voz con un enlace | Guarda el audio |
| Sticker, evento, encuesta o adjunto sin enlace o identificador disponible | Lo omite; el tipo aparece entre los adjuntos omitidos |

```sh
max messages download "Учебная группа" 204 --output-dir ./files --json
max attachments list --chat "Учебная группа" --needs-text --json
```

El `localPath` guardado está disponible en la máquina donde se ejecuta la CLI. La ruta por sí sola no transfiere el archivo a un agente remoto: el agente necesita acceso al archivo o una transferencia aparte de sus bytes.


## Cómo se lee el contenido


Por defecto, el agente lee los escaneos y las fotos con sus propias herramientas. `attachments extract --ocr` activa explícitamente una API para el reconocimiento en lote. Sin esta opción, la extracción no llama a ningún modelo. Comprueba si tu versión instalada incluye la opción con `max attachments extract --help`.


| Formato | Mediante software local | API explícita: `extract --ocr` | Cuándo necesitas un agente |
| --- | --- | --- | --- |
| TXT, MD, MARKDOWN, CSV, TSV, JSON, LOG | Lee UTF-8, UTF-16 con BOM y codificaciones antiguas detectadas con confianza | Sigue leyendo localmente | La codificación ambigua requiere revisión y conversión por el agente |
| Otros archivos con MIME `text/*` o `application/json` | Lee texto con las mismas reglas de codificación | Sigue leyendo localmente | Si falta MIME y la extensión no se admite, usa un lector externo |
| DOCX | Extrae texto con `mammoth` | Sigue leyendo localmente | Esta extracción no reconoce imágenes incrustadas ni conserva el diseño exacto |
| PDF con capa de texto | Extrae texto con `unpdf` | Lee las páginas de texto localmente | Comprobar el orden de columnas, las tablas y la precisión del texto extraído |
| PDF con páginas escaneadas o mixtas | Sin texto: `needs-agent`; la extracción normal lee la capa de texto existente en un PDF mixto | Lee el texto de las páginas; convierte las páginas sin texto en imágenes con `unpdf` y `@napi-rs/canvas` y las reconoce con un modelo | La vía habitual para escaneos; también cuando falta un motor, hay límites o falla la API |
| JPG, JPEG, PNG, WEBP | `needs-agent` | Envía una imagen compatible a un modelo de visión | Por defecto, el propio agente la lee |
| GIF, HEIC, TIF, TIFF, BMP | `needs-agent`, sin conversión integrada | El OCR automático no admite estos formatos | El agente necesita un visor adecuado o convertir a PNG/JPEG/WEBP |
| DOC, PPT, XLS | Sin lector integrado para los formatos binarios antiguos | No añade un lector para estos formatos | Convertir con una aplicación ofimática instalada y leer el texto o las páginas |
| ODT | Lee localmente texto y tablas del documento | Sigue leyendo localmente | Las imágenes y el diseño exacto requieren al agente |
| ODS, XLSX | Lee hojas, valores de celdas guardados y texto en orden; no calcula fórmulas | Sigue leyendo localmente | Revisar gráficos, fórmulas sin valor guardado y estructura visual |
| PPTX | Lee texto de diapositivas en orden | Sigue leyendo localmente | Las imágenes, diagramas y el diseño exacto requieren al agente |
| RTF | Sin extractor integrado específico | No añade un lector de RTF | Convertir con un programa que entienda las instrucciones y la codificación de RTF |
| EPUB | Lee el texto de capítulos en el orden del libro | Sigue leyendo localmente | Revisar imágenes y diseños complejos |
| ZIP | No recorre el contenido del archivo comprimido | No reconoce su contenido | Consultar la lista de archivos, extraer los necesarios y procesar cada uno según su formato |
| Mensaje de voz | Modelo de voz local aparte: `messages transcribe` | Este OCR no reconoce voz | Configurar el modelo y el idioma; consulta [transcripción de voz](./audio-recognition.md) |
| Otros archivos con MIME `text/*` o `application/json` | Lee texto con las mismas reglas de codificación | Sigue leyendo localmente | Si falta MIME y la extensión no se admite, usa un lector externo |

Aquí CSV y JSON se convierten en texto para buscar, no en tablas estructuradas de la base de datos. HTML/XML con MIME de texto se lee como código fuente, no como una página en el navegador. La extracción de PDF/DOCX guarda texto, no el diseño original. El OCR puede equivocarse en cifras, orden de lectura y formato; comprueba los datos importantes en el original.


Detectar una codificación antigua requiere confianza; el texto corto o ambiguo queda para el agente. Los bytes originales no cambian. Los intentos fallidos pueden repetirse y se protege el texto guardado por el agente. ODT, ODS, XLSX, PPTX y EPUB se limitan a1000 partes y 50 MiB descomprimidos, con un máximo de 10 MiB por parte XML/HTML de texto. Los archivos dañados o parciales no se indexan como texto completo.

Las notas de voz se procesan aparte de los documentos: el modelo de voz se descarga una vez y después funciona localmente. Los comandos, la selección de idioma y los límites se explican en [transcripción de voz](./audio-recognition.md).


## Dependencias necesarias

La lectura de texto, ODT, ODS, XLSX, PPTX y EPUB ya está incluida en la CLI. Los paquetes opcionales siguientes sirven para PDF, DOCX y convertir páginas PDF en imágenes.


| Tarea | Paquete |
| --- | --- |
| Leer la capa de texto de un PDF | `unpdf` |
| Leer texto de DOCX | `mammoth` |
| Convertir páginas PDF en imágenes para OCR por API | `unpdf` con renderizado y `@napi-rs/canvas` |
| Leer una imagen compatible mediante una API | No hacen falta paquetes de PDF/Word; se necesita una API de visión configurada |
| El agente lee el archivo con sus propias herramientas y guarda el texto | Estos paquetes de la CLI son opcionales; el agente necesita su propio modo de abrir el archivo |

Los paquetes son opcionales y no se instalan automáticamente con la CLI. `engine-missing` significa que falta el paquete necesario o no se puede cargar. No es un rechazo del modelo de IA. `unpdf` lee los PDF y sus capas de texto, pero por sí solo no hace OCR de un escaneo.


Instala el paquete en un entorno donde la CLI pueda cargarlo. Para una instalación global con npm en el mismo prefijo:


```sh
npm install -g unpdf mammoth @napi-rs/canvas
```

Para una instalación local, añade los paquetes necesarios al mismo proyecto. Con otro gestor de paquetes, una instalación global en un entorno aparte no garantiza que estén disponibles: repite la extracción tras instalarlos y comprueba que desaparece `engine-missing`. El renderizado se verificó con `unpdf` 1.8.1 y `@napi-rs/canvas` 1.0.10; un `unpdf` antiguo puede leer texto sin ofrecer las funciones de renderizado necesarias.


## Agente: leer y guardar


```sh
max attachments list --chat "Учебная группа" --needs-text --json
# Агент открывает localPath, читает все страницы и сохраняет буквальный текст в scan.txt.
max attachments text set "Учебная группа" 204 --attachment 1 --text-file ./scan.txt --json
max messages search 'content:умножение' --chat "Учебная группа" --offline --json
```

La numeración de `--attachment` empieza en 1. Conserva el idioma original y el orden de páginas; no sustituyas una transcripción por un resumen. No marques todo el PDF como leído si solo has procesado una página. El texto escrito por el agente está protegido frente a la sobrescritura por la extracción automática.


### Qué hace exactamente el agente


Un agente no puede abrir automáticamente cualquier archivo. Necesita acceso a `localPath`, un programa para leer o convertir el formato y, para imágenes, un modelo con visión. Elige un método disponible, comprueba que el resultado esté completo y guarda el texto mediante `text set`.


| Archivo original | Cómo puede obtener texto el agente |
| --- | --- |
| Texto en otra codificación | Comprobar el marcador o detectar la codificación; convertir con una herramienta disponible y comprobar que se lee bien |
| PDF con texto | Usar un lector de PDF disponible, como `pdftotext`; comprobar el orden de columnas y tablas |
| PDF escaneado | Consultar el número de páginas, convertir cada una en imagen, por ejemplo con `pdftoppm`, y leer todas las imágenes con un modelo de visión |
| DOCX/ODT y presentaciones | Leer con una biblioteca o aplicación ofimática instalada; exportar páginas para una comprobación visual si hace falta |
| Hoja de cálculo | Leer cada hoja con una biblioteca o exportarla a CSV; conservar nombres de hojas y filas y comprobar cifras y fórmulas |
| EPUB | Lee el texto de capítulos en el orden del libro | Sigue leyendo localmente | Revisar imágenes y diseños complejos |
| ZIP | Revisar el contenido, seleccionar los archivos necesarios y aplicar a cada uno el método de lectura adecuado |

Son ejemplos de herramientas posibles, no programas que la CLI instala por el agente. Si falta una herramienta necesaria, el agente debe indicar que el procesamiento está incompleto. Un agente remoto necesita recibir el propio archivo; una ruta no le da acceso.


### De qué depende la calidad


| Método | Qué afecta al resultado |
| --- | --- |
| Lectura de texto mediante software | Codificación correcta, capa de texto completa, compatibilidad del formato y orden de párrafos, columnas y celdas; no lee el texto dentro de una imagen |
| Agente con herramientas disponibles | Todo lo anterior, más la calidad de su modelo de visión, resolución de imágenes, acceso a todas las páginas, límites de contexto y cuidado al comprobar |
| OCR por API | Modelo de visión elegido, resolución y calidad del escaneo, idioma, letra pequeña, giro, tablas y escritura manual; procesar muchos archivos de la misma forma mejora la repetibilidad, pero no garantiza precisión |

Una API no es necesariamente más precisa que un agente: pueden usar modelos similares. Aquí sus ventajas son una cola controlada, el procesamiento en paralelo y la reutilización de resultados. Un agente puede combinar la lectura precisa de texto mediante software con comprobaciones visuales de las partes difíciles. Para un documento digital, primero obtén su texto original en vez de reconocer una imagen. Con cualquier OCR, comprueba cifras, nombres y tablas importantes en el original.


## API: procesamiento en lote elegido explícitamente


Un modelo externo puede leer texto en imágenes compatibles y páginas PDF escaneadas. La CLI le envía una imagen de cada página necesaria, recibe el texto literal y lo guarda en el mismo índice `content:`. Los PDF con capa de texto y los DOCX siguen usando lectura mediante software; elegir una API no añade compatibilidad con formatos antiguos de Office ni ZIP.


Necesitas un modelo de visión, su endpoint y una clave API. La configuración paso a paso de OpenAI, Anthropic y servidores compatibles, el almacenamiento de claves y la tarea `models.ocr` se explican en la [guía de modelos externos](./external-models.md). Después de configurar:


```sh
max attachments extract --chat "Учебная группа" --ocr --concurrency 4 --limit 20 --json
```

La extracción repetida usa el hash del archivo y el destino del modelo; conserva el texto válido guardado si hay errores, cancelación o respuestas incompletas. No sobrescribe el texto del agente. Las imágenes y páginas escaneadas solo se envían al proveedor con `--ocr` explícito; las llamadas se cobran según sus condiciones. `--offline --ocr` no se pueden combinar; no hay cambio automático del agente a la API.


El límite de extracción es de 50 MiB por archivo; el texto local se limita a 2 millones de caracteres. El OCR por API admite PDF de hasta 20 páginas e imágenes de hasta 4 MiB y 20 millones de píxeles, sin superar 8000 píxeles por lado. La concurrencia de archivos es de 1–8, con 4 por defecto; las páginas de un mismo archivo se procesan secuencialmente. Por defecto la API procesa hasta 100 archivos; `--limit` admite 1–500. Continúa con el `cursor` devuelto. Una respuesta 429 del proveedor detiene las siguientes llamadas API de esa ejecución, sin reintentos. El comando devuelve estados y enlaces a mensajes, no el texto reconocido completo.


La descarga, extracción y búsqueda se explican con más detalle en [búsqueda](./search.md). Esta descripción corresponde al código de la CLI; que exista un comando no significa que se haya probado cada archivo posible de ese formato con MAX real.

