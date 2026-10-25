---
title: "Usar wa"
---

Aquí aprenderás cómo se construye un comando de `wa` y de dónde proceden sus respuestas.

```sh
wa <profile> <resource> <verb> [arguments] [options]
wa personal chats list
wa personal messages list "Book club" --limit 20
wa personal search messages "dinner"
```

- **La primera palabra es el perfil.** Puedes usar cualquier nombre; `wa` nunca elige uno por ti.
- **Las lecturas consultan el almacén local**, que `wa <profile> serve` mantiene actualizado desde tu teléfono. Leer no conecta con WhatsApp.
- **`--json`** imprime un valor JSON en stdout para scripts y agentes; los diagnósticos van a stderr.

## Configurar un perfil

```sh
wa personal setup                  # link, check five chats, offer the agent skill; about 5 minutes
wa personal setup --agent codex    # the same, and install the skill for Codex
wa personal setup --method phone   # a pairing code instead of the QR code
```

`setup` comprueba cinco cosas: las carpetas de este ordenador, la vinculación (reutiliza un dispositivo existente sin preguntar), la cuenta, cinco chats del almacén local y el skill del agente. Comprueba un dispositivo ya vinculado sin volver a vincularlo. Sin terminal, imprime el QR como texto para que el agente pueda pegarlo en el chat y tú lo escanees.

## Vincular un perfil

`setup` utiliza la misma vinculación que `session start`, que solo realiza ese paso:

```sh
wa personal session start          # a QR code to scan in WhatsApp > Settings > Linked devices
wa personal session start phone    # type your number, then a pairing code on the phone
```

Justo después de vincular, el teléfono envía tu historial una vez. `session start` lo guarda en el almacén local y termina cuando el teléfono deja de enviar datos. Después, `wa personal server install` sigue recibiendo en segundo plano. `wa personal session end` desvincula el dispositivo y elimina sus claves de este ordenador.

Solo un comando de `wa` puede conectar un perfil a la vez: WhatsApp cortaría la primera conexión. Mientras funciona `serve`, los envíos del mismo perfil pasan por él y utilizan su conexión. Allí no puede preguntar, así que con el nivel de permiso `ask` necesita `--yes` ([una conexión por dispositivo](./sessions.md#one-connection-per-device)).

## Cambiar un mensaje

El identificador `3EB0A1B2C3D4E5F6A7B8` es ficticio; toma uno real de `messages list -v`.

```sh
wa personal messages edit "Book club" 3EB0A1B2C3D4E5F6A7B8 "the new text"
wa personal messages delete "Book club" 3EB0A1B2C3D4E5F6A7B8                 # for you only
wa personal messages delete "Book club" 3EB0A1B2C3D4E5F6A7B8 --for-everyone
wa personal reactions add "Book club" 3EB0A1B2C3D4E5F6A7B8 👍
wa personal messages pin "Book club" 3EB0A1B2C3D4E5F6A7B8 --expire-time 24h
wa personal messages unpin "Book club" 3EB0A1B2C3D4E5F6A7B8
wa personal chats mark-read "Book club"
```

WhatsApp identifica un mensaje por su remitente y su ID, así que estos comandos necesitan mensajes guardados localmente; mantén `serve` en marcha. Puedes editar un mensaje propio durante los 20 minutos posteriores al envío. La eliminación afecta solo a ti por defecto: `wa` pide a WhatsApp que quite el mensaje de tu teléfono y tus otros dispositivos, lo deje a los demás y conserve las fotos y archivos que el teléfono haya guardado. Esto aún no se ha comprobado en un teléfono. `--for-everyone` lo elimina para todos. Cada mensaje fijado avisa a los miembros: WhatsApp no tiene fijación silenciosa y no hace falta un indicador. Puede durar 24 horas, 7 días o 30 días (`--expire-time 24h`, `7d`, `30d`); sin `--expire-time`, `wa` fija durante 7 días. Leer no marca mensajes como leídos. Usa `chats mark-read` para enviar explícitamente una confirmación de lectura.

## Destacar un mensaje

```sh
wa personal messages star "Book club" 3EB0A1B2C3D4E5F6A7B8
wa personal messages unstar "Book club" 3EB0A1B2C3D4E5F6A7B8
```

La estrella es una marca propia que WhatsApp sincroniza entre tus dispositivos; no avisa al chat. Como una edición, necesita el mensaje en el almacén local. El almacén conserva las estrellas puestas con `wa`: `wa personal messages list "Book club" starred:true` y `wa personal search messages is:starred` encuentran esos mensajes. Mientras funciona `serve` o `watch`, las estrellas que pongas o quites en el teléfono también llegan al almacén y `watch --events` muestra el evento. También se guardan las estrellas del historial que el teléfono envía tras vincular. Aún no se ha comprobado si el teléfono muestra una estrella puesta desde `wa`. Destaca las publicaciones de canales desde el teléfono.

## Silenciar un chat

```sh
wa personal chats mute "Book club"              # for good
wa personal chats mute "Book club" --until 8h   # or until a time: --until 2026-10-09T09:00
wa personal chats unmute "Book club"
```

Silenciar es un ajuste propio que WhatsApp sincroniza con tus dispositivos; no avisa al chat. Aún no se ha comprobado su aplicación en el teléfono para chats individuales. Un dispositivo recién vinculado puede carecer de las claves de ajustes: deja `serve` en marcha y vuelve a intentarlo más tarde. Silencia los canales desde el teléfono.

Mientras funciona `serve` o `watch`, se guarda el silencio aplicado en el teléfono y su vencimiento; `inbox` y `review` omiten el chat hasta entonces. `chats show --offline` muestra `muted` y `muted_until` (sin vencimiento para un silencio permanente).

## Archivar, fijar o marcar un chat como no leído

```sh
wa personal chats archive "Book club"       # wa personal chats unarchive "Book club" brings it back
wa personal chats pin "Book club"           # at the top of the chat list; wa personal chats unpin "Book club"
wa personal chats mark-unread "Book club"
```

También son ajustes propios sincronizados entre tus dispositivos, sin avisar al chat. `chats pin` fija el chat, no un mensaje. Archivar también quita la fijación: la operación de archivado de whatsmeow hace ambas cosas. Las aplicaciones de WhatsApp permiten tres chats fijados; `wa` no los cuenta y no se ha comprobado qué hace el teléfono con un cuarto. Archivar, desarchivar y marcar como no leído utilizan el mensaje más reciente del almacén, como `chats delete`; se rechaza un chat sin mensajes guardados. Los canales se rechazan. Marcar como no leído no envía confirmación de lectura. El teléfono muestra fijación, desfijación, archivo, desarchivo y marca de no leído en el chat contigo mismo (comprobado el 2026-10-18); faltan pruebas en otros chats.

`chats mark-read` envía primero el cambio de ajuste a «leído», hasta el mensaje guardado más reciente (o `--until-id`), y después la confirmación: una confirmación por sí sola deja la marca de no leído en el teléfono. Hasta recibir las claves de ajustes de WhatsApp, se rechaza sin enviar ninguno de los dos cambios. Un canal solo recibe la confirmación. Aún no se ha comprobado que el teléfono quite la marca de esta forma.

Mientras funciona `serve` o `watch`, leer un chat en el teléfono pone a cero el contador y quita la marca en el almacén local; `inbox` deja de mostrarlo. Cada nuevo mensaje entrante guardado por `serve` o `watch` suma uno al contador. También se guardan el archivo y la marca de no leído del teléfono (`archived`, `marked_unread`): `inbox` omite los archivados e incluye los marcados como no leídos. La fijación, eliminación y vaciado de chats desde el teléfono aún no se guardan. `watch --events` no imprime estos cambios.

Una respuesta (`messages send --reply-to 3EB0A1B2C3D4E5F6A7B8`) a un mensaje guardado muestra la cita y su remitente en el teléfono. Si falta el mensaje, la respuesta se envía solo con su ID y las aplicaciones de WhatsApp pueden mostrar la cita como no disponible.

## Eliminar o vaciar un chat

```sh
wa personal chats clear "Book club" --allow-dangerous    # every message, starred ones too; the chat stays
wa personal chats delete "Book club" --allow-dangerous   # the chat itself
```

Ambas acciones afectan solo a tus dispositivos: los demás conservan el chat y sus mensajes. Sin `--allow-dangerous`, preguntan en el terminal y se rechazan en scripts. WhatsApp borra hasta el mensaje que indique `wa`: el más reciente del almacén local. Mantén `serve` en marcha para actualizarlo; se rechazan chats sin mensajes guardados. `wa` pide conservar fotos y archivos guardados en el teléfono. El almacén local de `wa` sigue conservando los mensajes. Esto aún no se ha comprobado en un teléfono.

## Dar formato a un mensaje

```sh
wa personal messages send "Book club" "**Friday** at _8_, see [the notes](https://example.com/n)" --md
printf '**Agenda**\n- the _new_ book\n> a quote\n' | wa personal messages send "Book club" --md
wa personal messages edit "Book club" 3EB0A1B2C3D4E5F6A7B8 "**moved** to Friday" --md
```

`--md` lee Markdown y lo convierte al formato de WhatsApp: `**bold**` o `*bold*` pasan a `*bold*`, `_italic_` se conserva, `~~strike~~` pasa a `~strike~`, y se conservan `` `code` `` y los bloques ```` ``` ````. Las citas (`>`) y listas (`-`, `1.`) se mantienen, y un título `#` pasa a negrita. Un enlace se convierte en su texto y su dirección, que WhatsApp hace pulsable. Subrayados, spoilers y resaltados quedan como texto normal porque WhatsApp no tiene esas marcas. No puede conservar un `*` literal, así que `\*word\*` también aparece en negrita. Sin `--md`, el texto se envía tal como lo escribas y funciona el formato propio de WhatsApp.

## Encuestas

```sh
wa personal polls create "Book club" "Which day?" Monday Tuesday            # one answer each
wa personal polls create "Book club" "Which books?" Dune Emma Ulysses --multiple
wa personal polls show "Book club" 3EB0A1B2C3D4E5F6A7B8        # the question, its answer ids and the counts
wa personal polls vote "Book club" 3EB0A1B2C3D4E5F6A7B8 a1b2c3d4
wa personal polls vote "Book club" 3EB0A1B2C3D4E5F6A7B8 --retract
wa personal polls voters "Book club" 3EB0A1B2C3D4E5F6A7B8      # who voted for what, newest first
```

Todos ven quién votó qué y el voto siempre se puede cambiar, por lo que no hay `--anonymous` ni `--revote`. Una encuesta tiene de 2 a 12 respuestas distintas; no es un cuestionario ni se cierra, así que no existe `polls close`. Vota con los ID de `polls show`; `a1b2c3d4` es ficticio. `polls show`, `polls vote` y `polls voters` necesitan una encuesta guardada, incluidas las creadas con `wa polls create`. WhatsApp entrega la clave al dispositivo cuando recibe la encuesta, así que una encuesta anterior a la vinculación puede rechazar el voto.

WhatsApp no ofrece una petición para recuperar votos: cada voto llega una vez como un mensaje. `wa serve` y `wa watch` guardan el voto más reciente de cada persona (`watch --events` imprime los nuevos), así como los votos enviados con el historial inicial. Los contadores reflejan lo recibido por el almacén. Se pierde un voto emitido mientras nada escuchaba hasta que esa persona vuelva a votar.

## Privacidad

```sh
wa personal account privacy show                         # who sees last seen, the photo, about; receipts, groups, calls
wa personal account privacy set --last-seen contacts     # only contacts see when you were last online; the rest stays
wa personal account privacy set --hide-online on         # last seen to nobody, online only to those who see it
wa personal account privacy set --read-receipts off      # no read receipts sent, and none shown to you
```

`show` consulta WhatsApp cada vez, no una copia local. `set` cambia solo lo que indiques y devuelve todos los valores actuales. Cambia la cuenta en todos tus dispositivos y pasa por los permisos del perfil, como un envío (`permissions.account.privacy.set`). Envía una petición por ajuste: si una falla, los anteriores permanecen cambiados y el error lo indica. Ejecuta `show` para comprobar el resultado.

- **`--last-seen`, `--profile-photo` y `--about-text`** aceptan everyone, contacts o nobody. «Mis contactos, excepto…» aparece como `contacts_except`; `set` no puede elegirlo porque la lista de excepciones permanece en el teléfono. Otro valor lo reemplaza.
- **`--hide-online on`** oculta la última conexión a todos y muestra el estado en línea solo a quienes pueden verla: nadie. `--hide-online off` muestra la última conexión a tus contactos, ya que `wa` desconoce el valor anterior. `--last-seen everyone` permite elegir la audiencia explícitamente. Usa una de las dos opciones.
- **`--read-receipts off`** funciona en ambos sentidos, como en el teléfono: nadie ve cuándo lees y tú tampoco ves sus lecturas. Entonces `chats mark-read` marca el chat como leído solo en tus dispositivos (whatsmeow envía la confirmación solo a tus dispositivos cuando están desactivadas; se ha leído en su código y no se ha probado con una cuenta real).
- **`--chat-invites`** acepta everyone o contacts. Según los informes, WhatsApp rechaza nobody y `wa` también. Un ajuste con excepciones guardado en el teléfono se omite en `show`.
- **`--calls contacts`** corresponde a «silenciar llamadas de números desconocidos»: las llamadas llegan sin sonar. Aún no se ha comprobado con una cuenta real. WhatsApp no tiene `--calls nobody` y `wa` lo rechaza.

WhatsApp no permite configurar quién encuentra o ve tu número; `wa` no ofrece `--find-by-phone` ni `--phone-number`.

## Enviar, guardar y reenviar archivos

```sh
wa personal messages send "Book club" "the agenda" --file agenda.pdf
wa personal messages send "Book club" "us, last week" --photo photo.jpg
wa personal messages send "Book club" --voice note.ogg
wa personal messages send "Book club" --sticker-file thumbs-up.webp
wa personal messages download "Book club" 3EB0A1B2C3D4E5F6A7B8 --output-dir ~/Downloads
wa personal messages transcribe "Book club" 3EB0A1B2C3D4E5F6A7B8 --local
wa personal messages forward "Book club" 3EB0A1B2C3D4E5F6A7B8 --to "Ann Lee"
```

Un mensaje lleva un archivo; el texto es su pie, salvo las notas de voz, que van solas. `.mp4`, `.m4v` y `.mov` se envían como vídeo salvo con `--as-file`. `--photo` junto con un vídeo `--file` forman un álbum y el texto es el pie de la foto. `--sticker-file` envía un `.webp` de hasta 500 KiB como sticker, solo y sin texto. WhatsApp no tiene conjuntos de stickers para elegir por ID, así que no hay `--sticker`. Puedes guardar y reenviar las fotos, vídeos, notas de voz, archivos y stickers que lleguen al almacén, que conserva los datos necesarios para descargarlos. WhatsApp los guarda por tiempo limitado; descargar uno que ya no conserva pide al teléfono que lo suba de nuevo, pero aún no funciona ([lo que falta en wa](#not-in-wa-yet)). También se guardan ubicaciones y tarjetas de contacto para reenviarlas, aunque no son archivos descargables. WhatsApp no reconoce voz por sí mismo: `transcribe` usa un modelo local (`wa models list kind:audio`). Consulta [archivos adjuntos](./attachments.md) para saber qué se guarda, qué se puede volver a descargar y cómo buscar dentro de archivos.

## Mensajes antiguos

WhatsApp no conserva el historial de chats en sus servidores. Los mensajes antiguos solo pueden llegar del teléfono, de 50 en 50 y con WhatsApp abierto. `wa personal messages sync "Book club"` los pide para un chat cada vez ([cómo funciona](./archive.md#older-history-from-your-phone)).

## Canales

Un canal de WhatsApp es un chat unidireccional: los administradores publican y los demás siguen y leen. Su ID termina en `@newsletter` (`120363000000000001@newsletter`).

```sh
wa personal chats join https://whatsapp.com/channel/AAAAAAAAAAAAAAAAAAAAAA   # follow a channel by its link
wa personal chats list 'kind:channel' --offline                            # the channels you follow
wa personal messages sync 120363000000000001@newsletter --limit 100         # read its posts into the local store
wa personal messages list 120363000000000001@newsletter
wa personal messages send 120363000000000001@newsletter "Meeting moved to 8"   # in a channel you run
wa personal messages send 120363000000000001@newsletter "New menu" --photo ~/menu.jpg
wa personal chats leave 120363000000000001@newsletter                     # unfollow it
```

- **Los canales que sigues llegan a la lista de chats** cuando conecta `wa serve` o `wa watch`: `wa` los pide una vez por conexión. Con `serve` en marcha, `chats join` añade el nuevo canal inmediatamente.
- **Las publicaciones se guardan en los servidores de WhatsApp**, a diferencia de los mensajes de chats. `messages sync` las lee de allí, no del teléfono: de nuevas a antiguas, de 50 en 50. `messages list` muestra después la copia local.
- **El canal es el remitente** de toda publicación, incluso una tuya enviada con `wa`: aparece como del canal, no como tuya (`outgoing: false`), porque WhatsApp no identifica cuáles publicaste tú.
- **Solo publican el propietario y los administradores.** `messages send` consulta tu rol y rechaza a los demás (salida `5`) antes de subir nada. Se admite texto o un archivo (`--photo`, `--file`, `--voice`, con el texto como pie), sin respuesta a otra publicación. Los seguidores lo ven inmediatamente. Los archivos de canales no están cifrados, como en las aplicaciones de WhatsApp. Se rechazan álbumes, stickers, encuestas, votos, reenvíos, ediciones y eliminaciones. También se rechaza reenviar un archivo del canal a un chat (`media.channel-file-forward`): sin su clave no se abriría.
- `chats join` y `chats leave` pasan por los [permisos](./permissions.md), como en grupos: los administradores ven que has seguido el canal. En vez de la lista de miembros, que WhatsApp no muestra, aparece el número de seguidores.

## Previsualizar enlaces, dispositivos y listas

Revisa una invitación a un grupo o canal antes de unirte, lista tus dispositivos vinculados o lee una lista personalizada creada en el teléfono:

```sh
wa personal chats inspect https://chat.whatsapp.com/INVITECODE
wa personal account sessions list
wa personal chats folders list
wa personal chats folders show "Work"
```

Revisar un enlace no te une a nada. Las sesiones muestran identificadores numéricos de dispositivo: `0` es el teléfono; el dispositivo actual aparece marcado. WhatsApp no da a un dispositivo vinculado los nombres de los dispositivos ni la última actividad. Cierra otros dispositivos desde el teléfono, en **Ajustes → Dispositivos vinculados**; `wa personal session end` desvincula este dispositivo.

Las carpetas son las listas personalizadas de WhatsApp, con su título y los chats añadidos expresamente. Si este dispositivo aún no tiene una instantánea, la primera lectura descarga las listas sincronizadas; las siguientes usan el último estado sincronizado. Los filtros integrados y las etiquetas de WhatsApp Business son otra cosa. Crea o cambia una lista en el teléfono.

## Leer comentarios de una comunidad

Usa `messages comments` para leer las respuestas bajo una publicación del grupo de avisos de una comunidad:

```sh
wa personal messages comments "Announcements" POST_ID --limit 20
```

El resultado muestra los comentarios que este dispositivo vinculado recibió y descifró, guardados bajo su publicación. Mantén `serve` recibiendo mensajes para completar ese historial. No se pueden descifrar los comentarios cuya clave de publicación este dispositivo nunca recibió. Los canales de WhatsApp tienen reacciones, no comentarios. No se admite enviar comentarios a una comunidad.

## Lo que falta en wa

`wa` comparte el árbol de comandos con tg y max; aparecen comandos que WhatsApp no puede ejecutar. Terminan con código `2` y explican por qué. No llega nada a WhatsApp.

Aún no está implementado:

- más archivos por mensaje que una foto y un vídeo en un álbum;
- listar grupos de una comunidad, añadir uno o quitarlo ([comunidades](./groups.md#communities));
- crear un canal (`chats create --channel`).

WhatsApp no ofrece estas funciones o las conserva en el teléfono:

- temas de foro y comentarios en publicaciones de canales (los canales solo tienen reacciones);
- varias invitaciones por grupo: `chats links reset` reemplaza la única;
- administradores con derechos parciales: todos tienen los mismos;
- encuestas que se cierran, cuestionarios y votos anónimos;
- mensajes silenciosos, programados o enviados con otra identidad;
- cambios e importaciones en la agenda: gestiona los contactos desde el teléfono; `wa` lee la agenda sincronizada;
- edad de la cuenta: se rechaza una regla `newAccount` en `chats rules set`.

`wa` nunca responde por sí mismo: no tiene respuestas automáticas porque WhatsApp bloquea cuentas que responden como bots. Los planes están en la [hoja de ruta](./roadmap.md).

## Mantener wa actualizado

`wa upgrade` instala la versión más reciente y reinicia los servidores en marcha ([actualización](./installation.md#upgrade)).

## Qué hacer después

- [Vinculación, dispositivos y perfiles](./sessions.md): QR o código de vinculación y una conexión cada vez.
- [Búsqueda](./search.md) y [almacén local](./archive.md): encontrar lo dicho, exportarlo y guardar una copia.
- [Servidor MCP](./mcp.md): los mismos comandos para una aplicación sin terminal.
- [Tareas para tu agente](./recipes.md): qué encargarle cada día.

Todos los comandos y opciones están en la [referencia](./commands.md).
