---
title: "Qué se indexa"
description: "Qué tipos de contenido permiten buscar las herramientas (texto, archivos, páginas web, notas de voz, imágenes), qué necesita cada uno y qué no sale de tu ordenador."
---

Averigua antes de buscar si lo que recuerdas se puede encontrar: una frase, un PDF, una nota de voz, una página web o una foto. Cada tipo de contenido se puede buscar a su manera. Algunos funcionan de inmediato, otros necesitan un comando y unos pocos siguen apagados hasta que los activas. La indexación se hace en tu ordenador y el índice vive en el archivo local. Las excepciones se indican donde aplican.

## Antes de empezar

La búsqueda lee el archivo local, no el servicio de mensajería. Descarga primero el historial del chat: [Búsqueda](./search.md#descarga-primero-el-historial-de-los-chats-pertinentes). Un resultado vacío no prueba que no se enviara nada.

## Qué necesita cada tipo

| Contenido | Se busca por | Necesita |
| --- | --- | --- |
| Texto de mensajes | Palabras, frases, remitente, chat, fecha | Nada: funciona en cuanto se guarda el mensaje |
| Texto de archivos y documentos | Palabras dentro del archivo (`content:`) | Un comando: `attachments extract` |
| Páginas web (archivos HTML) | Palabras del texto principal | El mismo comando |
| Notas de voz | Lo que se dijo (`transcript:`) | Un modelo de voz, una vez; luego `messages transcribe` |
| Teléfonos, correos, enlaces | El valor en cualquier escritura | Nada más: se encuentran en mensajes, texto de archivos y transcripciones |
| Imágenes, por su entorno | El significado del chat alrededor de la foto | Un modelo de texto, una vez; luego `conversations embed` |
| Imágenes, por lo que muestran | Palabras en inglés, como "dog on a beach" | Un ajuste, descargar un modelo y `images embed` |
| Escaneos y fotos con texto | Palabras del texto | Un agente lee la imagen y guarda el texto |

En todas las filas pasa lo mismo. Los archivos y las imágenes se leen en tu ordenador y no se modifican. Solo van a un servicio externo si tú eliges uno: un servicio de modelos para reconocer escaneos en bloque (abajo) o un modelo remoto para la búsqueda por significado.

## Texto de mensajes

El texto de cada mensaje guardado se indexa con el remitente, el chat, la fecha, los enlaces y los datos de los adjuntos. La búsqueda por palabras también encuentra otras formas de la palabra. Para una frase exacta, usa `exact:`. Cómo funciona la coincidencia: [Cómo funciona la búsqueda](./search-architecture.mdx).

```sh
tg personal search messages invoice
max personal search messages 'exact:"final invoice"'
```

`has:text` deja los mensajes que tienen texto. Con `NOT` encuentra los que no lo tienen, como una foto sin pie:

```sh
tg personal search messages 'has:photo NOT has:text'
```

## Archivos y documentos

`attachments extract` lee el texto de los archivos descargados y lo guarda en el archivo local. Después, `content:` busca dentro de ellos. La lectura se hace en tu ordenador.

```sh
tg personal attachments extract --chat "Book club" --download --output-dir ./files
tg personal search messages 'content:invoice'
```

Hay lectores para:

- Texto plano: `.txt`, `.md`, `.markdown`, `.json`, `.log`, también en codificaciones antiguas habituales.
- Tablas: `.csv`, `.tsv`, `.xlsx`, `.ods`, con hoja, fila y columna.
- Documentos y presentaciones: `.pdf` con capa de texto, `.docx`, `.doc`, `.rtf`, `.odt`, `.pptx`, `.odp`, `.epub`.
- Páginas web: `.html`, `.htm`, `.xhtml`.

Una página web se lee por su texto principal, no por su marcado. Se descartan menús, pies de página y avisos de cookies, y no se descarga nada de internet. Se conservan los títulos, las listas, las tablas y el texto de los enlaces.

Los archivos que no se pueden leer como texto, como escaneos y fotos, aparecen en la lista de los que necesitan texto. El texto que tu agente escriba para ellos cuenta como texto del archivo, y `content:` lo encuentra.

### Escaneos y fotos con texto

Tu agente lee la imagen con sus propias herramientas de visión y guarda las palabras:

```sh
tg personal attachments list --chat "Book club" --needs-text
tg personal attachments text set "Book club" 204 --text-file ./scan.txt
```

Para muchos escaneos puedes elegir un servicio de modelos. Es el único sitio donde los archivos salen de tu ordenador: `attachments extract --ocr` envía imágenes y páginas de PDF escaneados al servicio que configuraste. Sin `--ocr` no se llama a ningún modelo.

## Notas de voz

Una nota de voz se puede buscar cuando tiene transcripción. La herramienta la guarda y la encuentra con una palabra normal o con `transcript:`.

```sh
max personal models audio download gigaam-v3
max personal messages transcribe "Book club" 204
max personal search messages 'transcript:invoice'
```

- Un modelo de voz funciona en tu ordenador. La grabación no sale de él. Descarga un modelo una vez con `models audio download`; no se descarga solo.
- Modelos: `parakeet-v3` cubre 25 idiomas, `gigaam-v3` es el mejor para ruso.
- `tg` también puede usar la transcripción del propio Telegram si tu cuenta la tiene (`transcribeWith`: `auto`, `messenger` o `local`). `max` siempre usa el modelo de tu ordenador.
- La transcripción local lee una grabación Ogg Opus completa. Las grabaciones largas necesitan más memoria y tiempo.
- Transcribir no es instantáneo. `--transcribe` en `messages list` transcribe las notas de voz que muestra y que aún no tienen texto.

En archivos y transcripciones, la palabra se busca en su forma exacta. Las otras formas de la palabra se buscan solo en el texto de los mensajes.

## Teléfonos, correos y enlaces

Las herramientas encuentran números de teléfono, direcciones de correo, enlaces, enlaces a documentos de Google y nombres de personas que conoces en el texto de mensajes, archivos y transcripciones. Cada valor se guarda como una mención. La búsqueda lo encuentra como se haya escrito:

```sh
tg personal search messages 'phone:"+1 555 010 0100"'
tg personal search messages 'email:"ana@example.com"'
tg personal search messages 'domain:example.com'
```

`phone:` encuentra igual `+1 555 010 0100` y `15550100100`. `domain:` encuentra todos los enlaces y direcciones de ese sitio. Las menciones se encuentran con reglas, sin modelo. Una mención que rechazas sigue descartada.

## Imágenes

Las imágenes se buscan de dos maneras. Elige según lo que recuerdes.

### Por el entorno de la imagen

Recuerdas de qué se hablaba cuando llegó la foto. `conversations embed` da a cada foto un fragmento de texto con su pie, hasta 3 mensajes antes y después en un margen de 10 minutos, el título del chat y el remitente. La búsqueda por significado encuentra entonces el mensaje de la foto en cualquier idioma.

```sh
tg personal models text download e5-small
tg personal conversations build --chat "Book club"
tg personal conversations embed --chat "Book club"
tg personal search conversations "photos from the trip" --chat "Book club"
```

Una foto sin pie y sin mensajes cerca no recibe fragmento. Para encontrarla, usa el método siguiente. Sobre la búsqueda por significado en general: [Búsqueda por tema](./tg/topic-search.md).

### Por lo que muestra la imagen

Recuerdas cómo es la imagen. Está apagado hasta que lo actives, y se activa por perfil. Está en las últimas versiones de `tg` y `max`; ejecuta `images --help` para comprobar la tuya. En orden:

1. `config set picture_search true`
2. `images models download clip-b32`
3. `images embed --chat "Book club" --limit 100`
4. Busca con palabras, por ejemplo `search messages "dog on a beach"`

Pon delante de cada comando el nombre de la herramienta y de tu perfil, como en los ejemplos anteriores.

- El modelo es CLIP ViT-B/32, unos 155 MB, se descarga una vez y lo comparten todos los perfiles.
- `images embed` descarga cada imagen guardada a través del servicio de mensajería, una a una, y no marca nada como leído. Guarda una lista corta de números (un vector) y un hash de la imagen, y borra el archivo. Una imagen no se lee dos veces. Ejecútalo otra vez para continuar.
- Una búsqueda de mensajes con palabras añade entonces una lista `pictures` junto a los resultados habituales. Se ordena aparte y nunca cambia los resultados de texto. Las coincidencias débiles se descartan. Con el ajuste apagado no hay lista. Con el ajuste activo y sin modelo, la respuesta dice `picturesSkipped`.
- **Escribe la consulta en inglés.** El modelo solo sabe inglés. Tu agente traduce antes la pregunta: «ticket de la tienda» pasa a "a shop receipt".

Las imágenes no salen de tu ordenador.

## En qué se diferencian las herramientas

| Herramienta | Mensajes | Archivos | Notas de voz | Imágenes |
| --- | --- | --- | --- | --- |
| `tg` | Sí | Sí | Transcripción de Telegram o modelo local | Por entorno y por contenido |
| `max` | Sí | Sí | Solo modelo local | Por entorno y por contenido |
| `memo` | También correo y notas, con `search all` | Carpetas de notas: texto, tablas, PDF, Word, presentaciones | No | No |
| `drive` | No | Docs, texto subido, Sheets, PDF, Word, Excel, CSV | No | Por contenido, imágenes de hasta 25 MB |

Drive deja solo por nombre los PDF escaneados, Slides, audio y vídeo: una palabra del nombre del archivo los encuentra, y el resultado indica por qué no hay texto. Detalles: [búsqueda en Drive](./drive/search.md), [notas de Memo](./memo/notes.md), [búsqueda en Telegram](./tg/search.md), [búsqueda en MAX](./max/search.md).

## Límites

- Un archivo de más de 50 MiB no se lee como texto. Cámbialo con `MESSAGING_ATTACHMENT_MAX_MIB`.
- De un archivo se leen como máximo 2 000 000 de caracteres de texto.
- Los archivos de Office (`.odt`, `.ods`, `.xlsx`, `.pptx`, `.epub`) están limitados a 1000 partes y 50 MiB descomprimidos. Un archivo que supera un límite se señala como demasiado grande.
- PDF escaneados enviados a un servicio de modelos: 20 páginas por documento.
- La búsqueda por contenido de imágenes solo entiende inglés.
- Memo conserva como máximo 200 000 caracteres de cada archivo de notas o adjunto de correo.
- Las palabras de una nota de voz solo se encuentran tras la transcripción. El contenido de una imagen solo se encuentra tras crear su vector.

## Comprueba el resultado

Busca una palabra que sepas que está en un archivo, una nota de voz o el chat alrededor de una imagen, y mira dónde se encontró. Cada resultado de mensajes indica si la coincidencia viene del texto del mensaje, de una transcripción, del nombre de un archivo o del texto de un archivo. Si un tipo de contenido nunca aparece, revisa el único paso que necesita en la tabla de arriba.

Siguiente: [Búsqueda](./search.md) para las consultas habituales, o el lenguaje de consultas de [Telegram](./tg/query-language.md) y [MAX](./max/query-language.md).
