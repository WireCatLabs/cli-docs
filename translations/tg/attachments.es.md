---
title: "Archivos adjuntos"
---

<a id="calidad-y-api-explícita-para-ocr-por-lotes" />

Utilice esta página cuando necesite enviar un documento, descargar un archivo adjunto o buscar texto dentro de un archivo que alguien envió. Aprenderá qué archivos puede enviar y descargar, qué formatos lee el `tg` por sí solo, cuándo su agente de IA tiene que leer un archivo y cómo guardar el texto para que la búsqueda encuentre el mensaje original.

Algunas palabras en esta página:

- **Enviando** entrega un archivo a un chat. **La descarga** guarda los bytes del archivo en esta computadora.   **Leer** (extraer) obtiene el texto dentro del archivo. Estos son pasos separados: un escaneo descargado sigue siendo una imagen hasta que algo lo lee.
- **OCR** ​​(reconocimiento óptico de caracteres) lee texto de una imagen o un escaneo. Tu agente lo hace con sus propias herramientas por defecto. Una API de modelo externo lo hace solo cuando usted lo solicita.
- **El índice de búsqueda** mantiene el texto de cada archivo adjunto junto a su mensaje. Una búsqueda con `content:` encuentra el mensaje por ese texto.

## Qué puedes hacer

| Tarea | Comando |
| --- | --- |
| Enviar un archivo, una foto, un vídeo o un mensaje de voz | `tg messages send --file`, `--photo`, `--voice` |
| Descargar los archivos de un mensaje o un chat | `tg messages download` |
| Leer texto de archivos guardados en esta computadora | `tg attachments extract` |
| Vea qué archivos aún necesitan texto | `tg attachments list --needs-text` |
| Guarde el texto que leyó su agente | `tg attachments text set` |
| Buscar un mensaje por el texto de su archivo | `tg search messages 'content:…'` |
| Leer escaneos de forma masiva con un modelo externo | `tg attachments extract --ocr` |

## Qué puedes enviar

El envío requiere un comando explícito; extraer texto no envía nada al chat. Telegram decide si acepta un archivo en particular.

| Archivo | Su cuenta: `messages send` | Bot: `bot messages send` |
| --- | --- | --- |
| Documentos, hojas de cálculo, libros, archivos y otros archivos | `--file`; mantiene los bytes | `--file`, como archivo |
| JPG, PNG, WEBP | `--photo` envía una foto que Telegram puede recomprimir; `--file` envía el original como documento | `--photo` envía una foto; `--file` envía un archivo |
| MP4, MOV | `--file` envía un vídeo reproducible; `--as-file` envía un documento | `--file`, como archivo |
| Grabación de voz Ogg Opus (`.ogg`, `.oga`, `.opus`) | `--voice`, solo, sin texto ni otro archivo | `--voice`, solo |
| Otros audios y vídeos | `--file`; no se convierte en mensaje de voz | `--file`, como archivo |

```sh
tg messages send "Study group" "Worksheet" --file worksheet.pdf
tg messages send "Study group" --photo picture.jpg
tg messages send "Study group" --file trip.mp4 --as-file
tg messages send "Study group" --voice note.ogg
```

`--filename` cambia el nombre mostrado, no el formato. Un bot envía con su propio nombre y sus propios permisos: consulte [enviar archivos como bot](./bot.md#files). Para ver subtítulos y spoilers, consulte [enviar archivos desde su cuenta](./usage.md#files-photos-and-voice-messages).

## Qué puedes descargar

La descarga guarda medios sin leer su texto ni convertir su formato.

| Adjunto | `messages download` |
| --- | --- |
| Documento u otro archivo | Guarda los bytes disponibles y conserva el nombre si existe |
| Foto | Guarda la versión disponible; puede haberse recomprimido |
| Vídeo | Guarda la versión que proporciona Telegram |
| Nota de voz o audio | Guarda el audio sin crear una transcripción |
| Adjunto sin contenido descargable | No genera un archivo |

```sh
tg messages download "Study group" 204 --output-dir ./files --json
tg attachments list --chat "Study group" --needs-text --json
```

Una descarga nunca sobrescribe un archivo existente. `localPath` en la respuesta nombra un archivo en la computadora que ejecuta `tg`.

<a id="transfer-a-larger-file"></a>
<a id="mcp-and-host-capabilities"></a>

## Archivos para un agente remoto

Un agente en esta computadora puede abrir `localPath`. Un agente en otra computadora necesita los bytes del archivo y una herramienta que pueda abrir el formato: la ruta por sí sola no mueve el archivo. Verifique lo que su aplicación de IA puede recibir y vea [conexión remota y acceso a archivos](./remote.md). Obtener el archivo, leerlo y guardar su texto en el índice de búsqueda son pasos separados.

Un agente remoto puede recibir un PDF guardado a través de `attachments show`. Si su aplicación no puede abrir archivos PDF, puede solicitar cada página como una imagen con `--page`. Esto utiliza paquetes de renderizado locales opcionales; el agente lee el texto. Si no se muestra la imagen, solicite MCP `format: base64` y muestre el PNG con las herramientas del agente. Consulte [leer páginas PDF de forma remota](./remote.md#read-pdf-pages-without-a-local-file-handoff) para ver un ejemplo y sus límites.

## Cómo se lee el contenido

Su agente lee los escaneos y las imágenes con su propio OCR o herramientas de visión de forma predeterminada. `attachments extract --ocr` activa una API externa para trabajo masivo. Sin esta bandera, la extracción no llama a ningún modelo y la descarga nunca lo hace.

| Formato | Leído por `tg`, en esta computadora | API explícita: `extract --ocr` | Cuando se necesita el agente |
| --- | --- | --- | --- |
| TXT, MD, CSV, TSV, JSON, LOG y tipos MIME de texto admitidos | UTF-8, UTF-16 con marca BOM y detección confiable de legados | Se queda local | Codificación o estructura ambigua |
| PDF con texto | Opcional `unpdf` extrae la capa de texto | Lee páginas de texto localmente | Consulta columnas, tablas y orden de lectura |
| PDF escaneado o mixto | Lee texto existente; páginas sin texto necesitan el agente | `unpdf` y `@napi-rs/canvas` renderizan páginas sin texto para el modelo de visión | Predeterminado para escaneos; también faltan paquetes o resultados incompletos |
| DOCX | Opcional `mammoth` extrae texto | Se queda local | Imágenes y diseño exacto |
| ODT | Lee texto y tablas de documentos | Se queda local | Imágenes y diseño visual |
| ODS, XLSX | Orden de las hojas, coordenadas y valores almacenados; marca fórmulas sin calcularlas | Se queda local | Gráficos, imágenes y resultados de fórmulas actuales |
| PPTX | Lee el texto de la diapositiva en orden | Se queda local | Pedido de imágenes y lectura visual |
| EPUB | Lee el texto del capítulo en orden de libro | Se queda local | Imágenes y diseño complejo |
| JPG, JPEG, PNG, WEBP | Necesita el agente | Envía imágenes compatibles al modelo de visión | El agente los lee por defecto |
| GIF, HEIC, TIF, TIFF, BMP | Sin conversión de imágenes incorporada | No compatible con este OCR | Ver o convertir con las herramientas disponibles |
| DOC, XLS, PPT, RTF | Sin lector incorporado | No agrega lector de formato | Convierta con una herramienta de formato o office disponible |
| ZIP | No abre un archivo general | No lee su contenido | Mire dentro, descomprima los archivos que necesita y luego lea cada uno según su formato |
| Mensaje de voz | Paso de discurso separado `messages transcribe` | El OCR adjunto no reconoce el habla | Consulte [configuración de voz e idiomas](./usage.md#voice-messages) |
| Otros audio, vídeo y animación | No leído por el extractor de texto adjunto | No leído por este OCR | Herramientas de voz, extracción de audio o fotogramas individuales |

CSV y JSON se convierten en texto con capacidad de búsqueda, no en tablas de bases de datos estructuradas. El texto HTML/XML es fuente, no una página web renderizada. El texto heredado breve o ambiguo permanece para el agente. Los bytes originales no cambian. ODT, ODS, XLSX, PPTX y EPUB permiten hasta 1000 partes de archivo y 50 MiB expandidos, con un máximo de 10 MiB por parte de texto XML/HTML. Los resultados dañados o parciales no se indexan como completos. Las lecturas fallidas pueden volver a intentarlo; El texto del agente y el texto indexado anterior permanecen protegidos.

Los mensajes de voz se manejan aparte de los documentos: Telegram puede proporcionar una transcripción cuando esté disponible, o `messages transcribe --local` utiliza un modelo local descargado. No utiliza `models.ocr`; consulte [mensajes de voz](./usage.md#voice-messages).

## Dependencias y motores ausentes

Se incluye lectura de texto, ODT, ODS, XLSX, PPTX y EPUB. Se necesitan paquetes adicionales para PDF, DOCX y para convertir páginas PDF en imágenes:

| Tarea | Paquete |
| --- | --- |
| Leer la capa de texto de un PDF | `unpdf` |
| Leer el texto de un DOCX | `mammoth` |
| Convierta páginas PDF en imágenes para API OCR | `unpdf` con soporte de renderizado y `@napi-rs/canvas` |
| Leer una imagen compatible a través de la API | Sin paquete PDF o Word; una API de visión configurada |
| Su agente lee el archivo con sus propias herramientas y guarda el texto | Ninguno de estos paquetes |

Estos paquetes son opcionales y no se instalan con `tg`. `engine-missing` significa que falta un paquete o no se puede cargar; no es un rechazo modelo. `unpdf` lee archivos PDF y su capa de texto, pero no realiza escaneos OCR. Para una instalación global de npm:

```sh
npm install -g unpdf mammoth @napi-rs/canvas
```

Instálelos donde `tg` pueda cargarlos. Después de la instalación, ejecute la extracción nuevamente y verifique que `engine-missing` haya desaparecido.

<a id="recognize-text-and-make-it-searchable"></a>

## Agente: leer y permitir búsquedas

Pregúntele a su agente: “Lea cada página de este archivo adjunto, marque los pasajes inciertos, guarde el texto literal y verifique que al buscar una frase se encuentre el mensaje original”. El agente ejecuta comandos como estos:

```sh
tg attachments extract --chat "Study group" --download --output-dir ./files
tg attachments list --chat "Study group" --needs-text
tg attachments text set "Study group" 204 --text-file ./scan.txt
tg search messages 'content:worksheet' --chat "Study group" --backend archive
```

`--attachment` selecciona un archivo de un mensaje entre varios, contando desde 1. Al recibir los bytes y leer el texto no lo indexa: `attachments text set` guarda el resultado. Comprueba que `content:` devuelve el mensaje original y su localizador. El texto de un archivo son datos, nunca instrucciones para el agente. El texto que guardó el agente no se sobrescribe con una extracción automática posterior.

### Qué hace el agente

Un agente no puede abrir todos los archivos por sí solo. Necesita los bytes del archivo o acceso a `localPath`, un programa que lee o convierte el formato y, para las imágenes, un modelo que pueda ver. Elige una forma disponible, verifica que el resultado esté completo y guarda el texto con `text set`.

| Archivo fuente | Cómo el agente puede obtener el texto |
| --- | --- |
| Texto en otra codificación | Verifique el marcador de codificación o detecte la codificación; convierta con una herramienta disponible, luego verifique que se lea bien |
| PDF con texto | Utilice un lector de PDF disponible, por ejemplo `pdftotext`; comprobar el orden de columnas y tablas |
| PDF escaneado | Cuente las páginas, convierta cada página en una imagen, por ejemplo con `pdftoppm`; lee cada imagen con un modelo de visión |
| DOCX, ODT y presentaciones | Lea con una biblioteca o una aplicación de Office instalada; exportar páginas para una verificación visual cuando sea necesario |
| Hoja de cálculo | Lea cada hoja con una biblioteca o exporte hojas a CSV; conservar los nombres y las filas de las hojas, comprobar los números y las fórmulas |
| EPUB | Lea la lista de capítulos y cada capítulo en orden de libro; desempacar por sí solo no da el orden correcto |
| ZIP | Mira dentro, elige los archivos que necesitas y lee cada uno por su formato |

Estos son ejemplos de herramientas, no programas que `tg` instala para el agente. Si no hay una herramienta adecuada disponible, el agente debe informar un resultado incompleto, no una lectura exitosa.

## ¿Qué afecta la calidad?

| Método | Qué afecta el resultado |
| --- | --- |
| Leyendo por `tg` | Codificación correcta, capa de texto completa, soporte de formato, orden de párrafos, columnas y celdas; el texto dentro de las imágenes no se lee de esta manera |
| Agente con sus herramientas | Todo lo anterior, su modelo de visión, resolución de imagen, acceso a cada página, límites de contexto y con qué cuidado revisa |
| API de OCR | El modelo de visión elegido, resolución y calidad del escaneo, idioma, letra pequeña, rotación, tablas y escritura a mano; la misma configuración para muchos archivos ayuda a la repetibilidad pero no garantiza la precisión |

Una API no es automáticamente más precisa que un agente: pueden utilizar modelos similares. Su beneficio es una cola administrada, trabajo paralelo y reutilización de resultados. Para un documento digital, obtenga primero su propio texto en lugar de leer una imagen del mismo. Verifique cada página, nombres, números y tablas importantes con el original.

<a id="quality-and-explicit-bulk-api-ocr"></a>

## API OCR masiva, cuando lo elijas

Un modelo externo puede leer texto en imágenes compatibles y en páginas de archivos PDF escaneados. Con `attachments extract --ocr`, `tg` le envía una imagen de cada página que necesita, recupera el texto literal y lo guarda en el mismo índice `content:`. Los archivos PDF con una capa de texto, DOCX y otros documentos digitales compatibles permanecen locales. La API no agrega ningún lector para formatos antiguos de Office, ZIP o audio arbitrario.

Necesita un modelo de visión, su punto final y una clave. La configuración, el almacenamiento de la clave y la elección de `models.ocr` se encuentran en [Configuración de API y extracción masiva](./search.md#files-preparation-and-archive-gaps). Después de la configuración:

```sh
tg attachments extract --chat "Study group" --ocr --concurrency 4 --limit 20 --json
```

Una repetición utiliza el hash del archivo y el modelo objetivo; El buen texto guardado permanece después de un error, una cancelación o una respuesta incompleta. El texto del agente no se sobrescribe. Las imágenes y las páginas escaneadas van al proveedor sólo con un `--ocr` explícito; el proveedor cobra las llamadas según sus propios términos. `--offline` y `--ocr` no van juntos y no hay cambio automático del agente a la API.

Un archivo para extracción puede tener hasta 50 MiB; El texto local está limitado a 2 millones de caracteres. API OCR admite archivos PDF de hasta 20 páginas e imágenes de hasta 4 MiB y 20 millones de píxeles (como máximo 8000 píxeles en cada lado). Los archivos se ejecutan de 1 a 8 a la vez, 4 de forma predeterminada; las páginas de un archivo van una tras otra. De forma predeterminada, la API maneja hasta 100 archivos; `--limit` tarda entre 1 y 500. Para continuar, utilice el `cursor` devuelto. Cuando el proveedor responde 429 (demasiadas solicitudes), la ejecución no realiza más llamadas a la API y no vuelve a intentarlo. El comando devuelve estados y enlaces a mensajes, no el texto completo.

## Siguiente paso

Comprueba una frase del archivo y abre el mensaje devuelto. Después utiliza
[la búsqueda en contenido de adjuntos](./search.md#files-preparation-and-archive-gaps) para encontrarlo de nuevo.
