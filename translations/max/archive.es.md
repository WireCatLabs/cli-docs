---
title: "Copia local: contenido, actualización y exportación"
---

Lo que `max` lee permanece en tu ordenador para consultar sin red, buscar y exportar. Esta página explica qué guarda, cómo mantenerlo actualizado y cómo descargar y exportar el historial.

## Qué se guarda

Los datos consultados se guardan localmente para poder responder sin conexión:

```sh
max chats list --offline      # только из локальной копии, никуда не подключаться
max messages send 0 "текст" --offline   # отказ: из копии отправить нельзя
max store clear --left        # посмотреть, сколько данных покинутых чатов можно удалить
max store clear --left --allow-dangerous  # удалить их из общей копии
```

Un chat del que sales o te expulsan desaparece de `chats list` y `chats show` en el siguiente acceso. Sus mensajes permanecen en la copia; `max store clear --left --allow-dangerous` los elimina junto al chat. Sin `--allow-dangerous`, solo informa de cuánto borraría. Si vuelves al chat, reaparece en la lista.

`chats list|show` y `contacts list|show` guardan los datos consultados en la copia compartida que también utiliza `tg`. Se empieza a llenar en la primera ejecución sin `--offline` después de la actualización; la copia anterior de `max` no se traslada a ella. `chats show` obtiene los ajustes del grupo (`description`, `access`, `settings`) únicamente de MAX, por lo que las respuestas con `--offline` los omiten.

Las órdenes normales siguen consultando MAX: el acceso ya devuelve chats y contactos. Responder solo con la copia impediría conocer cambios. Usa `--offline` cuando no tengas red o no quieras conectar.

MAX recibe la marca guardada de contactos; el siguiente acceso puede traer solo personas modificadas. `max contacts list` responde desde la copia compartida actualizada durante ese acceso. Para obtener de nuevo toda la lista, ejecuta `max contacts sync`.

La caché antigua del perfil ya no se abre ni se migra al almacén compartido. Si queda un archivo, `max doctor` muestra su ruta. No hay una orden que borre toda la copia compartida; `store clear --left` solo elimina datos de chats abandonados.

### Descargar el historial

`max store fetch` descarga un chat hacia atrás hasta una fecha, una cantidad de mensajes o su inicio:

```sh
max store fetch Друзья --since-time 2026-01-01
max store fetch Друзья --last 500
max store fetch Друзья --background      # в фоне; `max store jobs show <id>` следит за ним
max store fetch --all                    # все чаты, самые активные первыми: последние 90 дней
```

Recorre el historial hacia atrás como al desplazarte hacia arriba en la versión web: 30 mensajes por página, desde el mensaje descargado más antiguo. Entre páginas espera desde `--pause` hasta el doble de ese tiempo (valor predeterminado `5s`, es decir, de 5 a 10 segundos, aproximadamente el ritmo de una persona que recorre el chat en una pestaña). Cada ejecución descarga como máximo `--limit` mensajes (1200 de forma predeterminada, o 40 páginas). Al repetir el mismo comando, continúa donde se detuvo y omite los mensajes ya descargados. Sin `--since-time` ni `--last`, las ejecuciones continúan hasta el principio del chat; `--since-time` y `--last` no se pueden combinar. `--since-time` acepta una fecha ISO 8601 o una duración relativa (`30d`). Ctrl-C o `--timeout` detienen la descarga después de la página actual y conservan lo descargado.

Si MAX indica que hay demasiadas solicitudes, el comando se detiene. La respuesta no indica a `max` cuánto debe esperar, por lo que `max` no espera ni repite la solicitud. También se detiene ante cualquier otro error. El historial descargado se conserva y la siguiente ejecución continúa desde el mismo punto ([limits.md](./limits.md)). `store fetch` no lee reacciones ni marca nada como leído. `--estimate` no está disponible para MAX: los ID de mensajes de MAX no permiten contar cuánto historial falta.

Los datos van al almacén compartido con `tg`; `max store info` muestra su ruta. `max store status` indica cantidades y tramos completos por chat. La copia antigua de `max` no se migra: descarga de nuevo el historial.

`max store jobs list` muestra descargas en segundo plano; `max store jobs cancel <id>` las detiene.

Mantener el archivo de la base de datos local:

- `max store check`: integridad, índices de búsqueda, espacio y chats desactualizados.
- `max store backup <файл>`: copia del archivo en uso, sin sobrescribir. `max store restore <файл>` restaura y conserva el anterior al lado. Con `--encrypt`, la copia se comprime y se cifra con contraseña; consulta [Contraseña](#пароль).
- `max store reindex`: reconstruye índices, diccionario de errores y raíces sin perder mensajes.
- `max store migrate`: actualiza el esquema a esta versión de `max` y completa índices de mensajes antiguos.

### Exportar a un archivo

Exporta la copia en JSONL, con los objetos de `messages list --jsonl`, o Markdown legible:

```sh
max store export Друзья --format markdown --output друзья.md
max store export 111 --format jsonl --since-time 2026-09-01 > чат.jsonl
```

La exportación **no se conecta a nada**; solo incluye datos leídos o descargados. Usa `max store fetch <чат>` para obtener lo anterior. Nunca sobrescribe archivos. El archivo de `--output` es privado (`0600`), pues contiene enlaces de fotos accesibles sin iniciar sesión.

### Exportar a una carpeta y añadir solo lo nuevo

`--to <папка>` escribe los chats en una carpeta: un archivo JSONL por chat y `manifest.json`. Al repetir en la misma carpeta, solo se añade lo que ha cambiado desde la vez anterior: mensajes nuevos, ediciones (también de mensajes antiguos) y borrados. Un mensaje borrado se escribe sin texto: `{ "id", "chatId", "deleted": true }`.

```sh
max store export Друзья Работа --to ~/max-архив
max store export --kind group --to ~/max-группы
max store export --all --to ~/max-всё
```

`max` no toca una carpeta con archivos ajenos ni la exportación de otra cuenta. Un cambio solo en las reacciones no cuenta como cambio.

### Contraseña

`--encrypt` en `store export` (con `--output` o `--to`) y en `store backup` comprime el archivo y lo cifra con una contraseña. No hacen falta programas externos. Para abrir ese archivo: `max store decrypt <файл> --output <новый файл>`; `max store restore` pide por sí mismo la contraseña de una copia cifrada.

- **La contraseña no se guarda en ningún sitio**: ni en la configuración, ni en el almacén de contraseñas, ni en el registro. Si la olvidas, el archivo no se puede abrir.
- Si la escribes tú en el terminal, no se muestra y se pide dos veces. Un agente al que hayas dado la contraseña la pasa por stdin, no como argumento de la orden, porque otros programas pueden ver los argumentos:

  ```sh
  printf '%s' 'пароль' | max store backup ~/max.sealed --encrypt
  ```

- En una carpeta cifrada se escribe un archivo por ejecución. Su `manifest.json` no incluye nombres de chats, y `max` no acepta una ejecución con otra contraseña.

## Buscar

`max messages search` encuentra mensajes guardados por palabras, remitente, chat, fecha, archivos, enlaces y tus etiquetas. La búsqueda de palabras en un chat concreto también consulta al servidor de MAX de forma predeterminada; sin chat o con `--backend archive`, solo lee el archivo. `--sync-first` descarga primero mensajes nuevos de MAX dentro de unos límites sin marcarlos como leídos. Consulta [búsqueda de mensajes](./search.md) para ver la guía, las búsquedas guardadas y los recuentos. Un resultado vacío no demuestra que el mensaje no exista: comprueba `coverage.next` y descarga el historial que falte antes de volver a buscar.

## Conversaciones dentro de un grupo

En un grupo activo hay varias conversaciones a la vez. `max conversations` agrupa mensajes guardados y encuentra debates por su tema en este ordenador: consulta la [búsqueda por temas](./topic-search.md).

## Mensajes en directo: `max serve` y `max watch`

Una orden normal conecta, ejecuta y termina. `max serve` mantiene una conexión y distribuye mensajes nuevos a quienes escuchan.

**No tienes que iniciarlo manualmente.** El primer comando que necesita MAX inicia `max serve` en segundo plano si no está en marcha y continúa usando su propia conexión; los siguientes utilizan el servidor. **Este servidor se detiene tras 15 minutos sin uso.** Su registro es `<профиль>.serve.log`, junto al estado del perfil (permisos 600). Desactívalo con `--no-serve` para una ejecución o con `max config set serve false` de forma permanente. `max session end` primero detiene el servidor del perfil si lo inició un comando.

**Un servidor iniciado manualmente (`max serve`, `max server start`) solo se detiene con Ctrl-C o `max server stop`**, no por inactividad, por `max session end` ni por otras solicitudes al socket. Si ya hay un servidor en segundo plano iniciado por un comando, ejecutar `max serve` manualmente lo sustituye. Puedes elegir `--idle` explícitamente. `max session start` detiene cualquier servidor del perfil, inicia sesión y lo vuelve a iniciar con la sesión nueva: solo hay una conexión con MAX en cada momento.

```sh
max serve                   # вручную, в одном терминале; Ctrl-C — остановить
max serve --idle 30m        # или остановиться, когда им 30 минут никто не пользуется
max server start            # то же, но в фоне; ответ — когда сервер уже подключён
max server status           # работает ли, с какого времени, какой версии, подключён ли к MAX
max server restart          # остановить и запустить снова — например, после обновления max
max server stop             # остановить сервер профиля, как бы он ни был запущен
max server logs             # последние строки его журнала; --lines 200 — больше
max server install          # служба systemd (Linux) или launchd (macOS) для профиля; ничего не запускает
max server uninstall        # убрать службу; сначала max server stop
max watch                   # в другом: новые сообщения по мере прихода
max watch --jsonl           # то же для скрипта: одно сообщение на строку, как у `messages list`
max watch --jsonl | ./on-message.sh
max watch --events --jsonl  # ещё правки, удаления, реакции, прочтения и изменения чатов; у строки поле "event"
```

- **Tras actualizar `max`**, el servidor automático se sustituye solo. Uno manual mantiene la versión hasta reiniciar; `max server status` lo muestra y `max server restart` lo resuelve.
- **Usar un servicio.** Después de `max server install`, `max server start` inicia el servidor mediante systemd o launchd y `max server stop` lo detiene allí. El servicio ejecuta `max serve`, un servidor iniciado manualmente sin cierre por inactividad. Si MAX rechaza el inicio de sesión, el servicio **no** reinicia el servidor: cada reintento supondría otro inicio de sesión. `max server status` muestra el servicio y la ubicación de su registro.
- **Uno por perfil.** Un segundo `max serve` rechaza iniciarse. El socket junto al estado tiene 600, accesible solo al propietario.
- **Su comportamiento en la red es como el de una pestaña de web.max.ru:** un ping cada 30 segundos, respuestas a los pings de MAX y confirmaciones de recepción de cada mensaje entrante. **No marca nada como leído** ni envía mensajes.
- **Si MAX desconecta**, reintenta tras 1, 2, 4… segundos, hasta un minuto de espera; `max watch` lo indica en stderr. Un token rechazado detiene con error de autenticación.
- **Una conexión compartida por perfil.** Comandos, `max mcp` y `max watch` usan la del servidor para leer, enviar y reaccionar. Los controles de envío siguen en el comando. Si falta, se inicia y espera; con `serve: false`, el comando conecta directamente. Un segundo servidor rechaza antes de entrar.
- El servidor mantiene actualizado el estado de su sesión: tiene en cuenta mensajes nuevos, chats leídos en el teléfono y cambios en los chats. Si MAX informa de algo que no puede aplicar (mensajes eliminados), vuelve a iniciar sesión en segundo plano, como máximo una vez por minuto.
- **Con `--events`, cambia el formato:** `{"event": "message", "message": …}`, `{"event": "edit", "message": …}`, `{"event": "delete", "chatId", "chatTitle", "messageId"}`, `{"event": "reaction", "chatId", "chatTitle", "messageId", "reactions"}`, `{"event": "read", "chatId", "chatTitle", "userId", "upToTime", "unreadCount"}` indica quién leyó hasta esa hora, incluido el propietario desde otro dispositivo; `{"event": "chat", "chat"}` indica cambios de nombre, miembros o salida del propietario. Marcar como no leído no genera un evento de lectura. Sin la opción, una línea por mensaje. `max watch` no muestra quién escribe: MAX solo lo envía a quien tenga abierto ese chat.
- **`max watch` solo ve lo que llega mientras tanto él como el servidor están conectados.** Los mensajes que llegan durante una desconexión de MAX se pierden en ese flujo. Una línea `status` con `connected: true` después de una desconexión indica que debes recuperar lo omitido: `max inbox --since-time <время из поля at предыдущей строки status>`.

## Siguiente paso

- [Uso de la cuenta personal](./usage.md): leer y enviar.
- [Diagnóstico](./diagnostics.md): qué hizo la orden.
- [Referencia](./commands.md): opciones de `store`, `serve`, `watch`.

## Mantenimiento del archivo

`max store migrate` completa los índices; `max store reindex` los reconstruye. `store info` y `store check` muestran si los índices de palabras y raíces están listos. La búsqueda estricta usa raíces para encontrar formas de palabras; `exact:` y `--exact` eligen formas exactas. `config set searchStemmers.cyrillic` acepta `russian` o `none`; `config set searchStemmers.latin` acepta `spanish`, `english` o `none`. `none` desactiva las raíces para ese alfabeto. Después, ejecuta `store reindex`. Este ajuste se comparte entre todos los perfiles y ambos mensajeros, por lo que no se aplican `--defaults`, `--personal` ni `--bot`, y no se puede cambiar bajo `MAX_PROFILE_LOCK`.

`max store repair --dry-run --json` muestra las reparaciones de estructura y revierte los cambios; `store repair` las aplica sin borrar datos. Una tabla incompatible se conserva como copia; la respuesta enumera las filas y columnas que no pudieron trasladarse. Conserva la copia hasta comprobar el resultado. `store repair` indica los nombres de las copias (`copies` en `--json`); `store copies delete <точное имя>` borra solo la indicada. Detén los procesos que usen el archivo antes de reparar su estructura.
