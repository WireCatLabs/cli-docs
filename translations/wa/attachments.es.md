---
title: "Archivos adjuntos"
---

Usa esta página cuando necesite enviar una foto o un documento, guardar un archivo que alguien envió, escuchar una nota de voz como texto o buscar un mensaje por el texto dentro de su archivo. Aprenderá qué envía `wa`, qué guarda, qué puede recuperar más tarde y qué no.

Algunas palabras en esta página:

- **Enviando** entrega un archivo a un chat. **La descarga** guarda los bytes del archivo en esta computadora. **Leer** (extraer) obtiene el texto dentro de un archivo guardado. Estos son pasos separados: un escaneo descargado sigue siendo una imagen hasta que algo lo lee.
- **Las claves del archivo** son lo que WhatsApp necesita para recuperar un archivo: dónde está y cómo descifrarlo. El almacén local los guarda, nunca el archivo en sí.
- **El índice de búsqueda** mantiene el texto de cada archivo leído junto a su mensaje. Una búsqueda con `content:` encuentra el mensaje por ese texto.

## Qué puedes hacer

| Tarea | Comando |
| --- | --- |
| Enviar un archivo, una foto, un vídeo o una nota de voz | `wa personal messages send --file`, `--photo`, `--voice` |
| Guardar los archivos de un mensaje, o de un chat completo | `wa personal messages download` |
| Enviar nuevamente un mensaje almacenado, archivo incluido | `wa personal messages forward` |
| Escuche una nota de voz como texto | `wa personal messages transcribe` |
| Vea los archivos que conoce el almacén local y que aún necesitan texto | `wa personal attachments list` |
| Leer texto de archivos guardados en el índice de búsqueda | `wa personal attachments extract` |
| Mantén el texto que tu agente leyó de un escaneo o una foto | `wa personal attachments text set` |
| Buscar un mensaje por su archivo | `wa personal search messages 'has:file'`, `'content:…'` |

## Lo que puedes enviar

Un mensaje contiene un archivo y el texto se convierte en su título. Un `--photo` y un vídeo `--file` juntos forman un álbum: el texto es el título de la foto y la respuesta es el mensaje de la foto. Un álbum contiene únicamente fotos y vídeos, por lo que se rechaza un documento junto a una foto. Sólo el mensaje de la foto llega a el almacén local; El vídeo está en el chat de WhatsApp. Una foto muestra la pequeña vista previa que muestra el chat antes de descargarse (ni un WEBP ni un video todavía). El envío necesita un comando explícito y pasa los [permisos y límites de envío](./permissions.md) del perfil, como lo hace cualquier envío.

| Archivo | Opción | Lo que obtiene el chat |
| --- | --- | --- |
| Documentos, archivos y cualquier otro archivo | `--file` | Un archivo para descargar, con su nombre |
| JPG, PNG, WEBP | `--photo` | Una foto; `--file` envía el original como un archivo |
| MP4, M4V, MOV | `--file` | Un vídeo reproducible; `--as-file` lo envía como archivo para descargar |
| Grabación de Ogg Opus | `--voice` | Una nota de voz, sola: sin texto ni ningún otro archivo al lado |

```sh
wa personal messages send "Book club" "the agenda" --file agenda.pdf
wa personal messages send "Book club" "us, last week" --photo photo.jpg
wa personal messages send "Book club" --file trip.mp4 --as-file
wa personal messages send "Book club" --voice note.ogg
```

`--filename` cambia el nombre que ven los demás, no el formato. `wa` rechaza un archivo de una carpeta de credenciales o de sus propias carpetas a menos que agregue `--allow-any-file`. WhatsApp no ​​tiene entregas silenciosas o programadas ni publicaciones como otra persona, por lo que `wa` no tiene `--silent`, `--at-time` o `--send-as`.

## Lo que guarda el almacén local

Para cada foto, vídeo, nota de voz, audio, documento y pegatina que llega a el almacén local, `wa` guarda su nombre, tamaño y tipo, y sus claves. Las claves nunca aparecen en una respuesta, en JSON, en la salida de MCP o en eventos `watch`. Un lugar guarda sus coordenadas, nombre y dirección, y una tarjeta de contacto su nombre y la propia tarjeta, por lo que ambos pueden ser reenviados. La tarjeta contiene un número de teléfono, por lo que permanece con las llaves y nunca se muestra. Una ubicación en vivo sólo se mantiene donde estaba.

Dos tipos de mensajes no tienen claves, por lo que `wa` no puede guardar ni reenviar su archivo:

- **Una foto o un vídeo que se puede ver una vez.** Las propias aplicaciones de WhatsApp no guardan ni reenvían uno, por lo que `wa` deja caer sus claves cuando llega.
- **Un mensaje almacenado antes de que `wa` manejara los archivos.** Nombra su archivo, pero no puede recuperarlo.

WhatsApp mantiene un archivo en sus servidores sólo por un tiempo limitado. Cuando una descarga descubre que ya no existe, `wa` le pide a tu teléfono que la cargue nuevamente, como lo hacen las propias aplicaciones de WhatsApp, y recupera la nueva copia. Su teléfono debe estar en línea y aún contener el archivo: uno eliminado del teléfono desaparecerá para siempre.

**Limitación conocida: un archivo antiguo aún no se descarga.** En los teléfonos probados, el teléfono carga el archivo nuevamente pero cifra la nueva copia con una nueva clave que no envía a los dispositivos vinculados, por lo que `wa` no puede leerlo. La descarga finaliza con `media.retry-failed` ("el teléfono cargó este archivo nuevamente, pero la nueva copia no se descargó") y no guarda nada, en lugar de un archivo roto. Abra el archivo en el teléfono o pídale al remitente que lo envíe nuevamente.

## DescargarEl ID del mensaje `3EB0A1B2C3D4E5F6A7B8` en esta página está compuesto; tome uno real de `messages list -v`.

```sh
wa personal messages download "Book club" 3EB0A1B2C3D4E5F6A7B8 --output-dir ~/Downloads --json
wa personal messages download "Book club" --all --output-dir ./book-club
```

Una descarga recupera el archivo con las claves en el almacén local; el mensaje debe estar ahí, así que mantenga `serve` ejecutándose. Un lugar, una tarjeta de contacto o un archivo sin claves se nombra en `skipped` y no se guarda nada para ello. Se vuelve a solicitar a tu teléfono un archivo que WhatsApp ya no guarda y hasta ahora falla ([limitación conocida](#what-the-store-keeps)). El teléfono tiene unos 20 segundos para responder, por lo que, con un teléfono lento, dé la orden con un `--timeout` más largo. La tienda conserva la dirección de la nueva copia, por lo que se puede descargar más tarde y `messages forward` usarla sin volver a preguntar al teléfono, también después de vincular el dispositivo nuevamente y el teléfono envía la dirección anterior. Si el teléfono ya no tiene el archivo, la descarga finaliza con la salida `6`; Pídale al remitente que lo envíe nuevamente. `--all` guarda todos los archivos del chat, el más nuevo primero; ejecútelo nuevamente para continuar donde se detuvo. Mientras se ejecuta `serve`, se realiza una descarga a través de su conexión ([una conexión por dispositivo](./sessions.md#one-connection-per-device)).

## Adelante

```sh
wa personal messages forward "Book club" 3EB0A1B2C3D4E5F6A7B8 --to "Ann Lee"
```

Un reenvío envía nuevamente el texto y el archivo del almacén local, marcados como reenviado, o el lugar o la tarjeta de contacto del almacén local. Necesita el mensaje en el almacén local, con claves para su archivo; de lo contrario se rechaza y no se envía nada, y lo reenvías por teléfono. Un lugar o una tarjeta almacenados en un `wa` antiguo, una ubicación activa y un mensaje con varias tarjetas de contacto se rechazan de la misma manera.

Un reenvío reutiliza las claves del archivo y no comprueba que WhatsApp aún conserva el archivo: comprobarlo significaría descargarlo primero. Un archivo antiguo puede llegar al destinatario como si no se pudiera abrir. Para estar seguro, descárgalo y envíalo como un archivo nuevo.

## Notas de voz como texto

```sh
wa personal models audio list                    # the speech models, and which are downloaded
wa personal models audio download parakeet-v3    # once, about 670 MB
wa personal messages transcribe "Book club" 3EB0A1B2C3D4E5F6A7B8 --local
```

WhatsApp no tiene reconocimiento de voz propio, por lo que `transcribe` siempre utiliza un modelo en esta máquina; `--local` lo dice explícitamente y `--model` elige uno. La nota de voz no sale de tu computadora. Sin un modelo descargado, el comando se detiene con la salida `6` y nombra el modelo a descargar.

## Leer el texto de los archivos.

`wa` lee capas de texto por sí mismo: texto sin formato, texto PDF y DOCX, ODT, ODS, XLSX, PPTX y EPUB. El texto dentro de una imagen o un escaneo no se lee de esta manera.

```sh
wa personal messages download "Book club" 3EB0A1B2C3D4E5F6A7B8 --output-dir ./files --extract
wa personal attachments extract --chat "Book club" --download --output-dir ./files
wa personal attachments list 'is:needs_text' --json
wa personal search messages 'content:"reading list"'
```

`--extract` lee los archivos guardados en esta descarga. `attachments extract` lee los archivos ya guardados, o con `--download` guarda primero los que aún no se han descargado. `attachments list` muestra cada archivo, dónde se guardó y si se conserva su texto, nunca el texto en sí.

Su agente lee un escaneo o una fotografía, con sus propias herramientas de visión. Luego, el agente guarda el texto para que la búsqueda lo encuentre:

```sh
wa personal attachments text set "Book club" 3EB0A1B2C3D4E5F6A7B8 --text-file scan.txt
```

Para leer escaneos de forma masiva con una API modelo, configure `models.ocr.provider` y `models.ocr.model`, luego ejecute `attachments extract --ocr`. Las imágenes van a ese proveedor solo con un `--ocr` explícito.

## Archivos para un agente remoto

Un agente en esta computadora abre la ruta guardada. Un agente en otra computadora obtiene los bytes de un archivo con `attachments show`, una pieza delimitada a la vez, como base64 en JSON; `--page` convierte una página PDF en una imagen, con el paquete opcional `@napi-rs/canvas` instalado donde `wa` puede cargarlo. Consulta [desde el navegador](./remote.md) para conectar dicho agente.

## Siguiente paso

Busque un mensaje por su archivo con `has:file`, `filename:` o `content:` ([búsqueda](./search.md#files)) y vea todas las opciones en la [página de comandos](./commands.md).

## Conservar copias después de eliminar la fuente

Para copias de archivos verificadas y copias de seguridad diarias voluntarias, utilice el [archivo multimedia independiente](./archive.md#keep-independent-media-copies).
