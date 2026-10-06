---
title: "Copia local: contenido, actualización y exportación"
---

Lo que `max` lee permanece en tu ordenador para consultar sin red, buscar y exportar. Esta página explica qué guarda, cómo mantenerlo actualizado y cómo descargar y exportar el historial.

## Qué se guarda

Los datos leídos se conservan para responder sin conexión:

```sh
max chats list --offline      # только из локальной копии, никуда не подключаться
max messages send 0 "текст" --offline   # отказ: из копии отправить нельзя
max store clear --left        # посмотреть, сколько данных покинутых чатов можно удалить
max store clear --left --allow-dangerous  # удалить их из общей копии
```

Un chat del que sales o te expulsan desaparece de `chats list` y `chats show` en el siguiente acceso. Sus mensajes permanecen en la copia; `max store clear --left --allow-dangerous` los elimina junto al chat. Sin `--allow-dangerous`, solo informa de cuánto borraría. Si vuelves al chat, reaparece en la lista.

`chats list|show` y `contacts list|show` guardan datos en el almacén compartido con `tg`. Se llena desde la primera ejecución sin `--offline` tras actualizar; la copia anterior de `max` no se migra. `chats show` solo obtiene de MAX los ajustes (`description`, `access`, `settings`), ausentes sin conexión.

Las órdenes normales siguen consultando MAX: el acceso ya devuelve chats y contactos. Responder solo con la copia impediría conocer cambios. Usa `--offline` cuando no tengas red o no quieras conectar.

MAX recibe la marca guardada de contactos; el siguiente acceso puede traer solo personas modificadas. `max contacts list` responde desde la copia compartida actualizada durante ese acceso. Para obtener de nuevo toda la lista, ejecuta `max contacts sync`.

La caché antigua del perfil ya no se abre ni se migra al almacén compartido. Si queda un archivo, `max doctor` muestra su ruta. No hay una orden que borre toda la copia compartida; `store clear --left` solo elimina datos de chats abandonados.

### Descargar el historial

`max store fetch` descarga un chat hacia atrás hasta una fecha, una cantidad de mensajes o su inicio:

```sh
max store fetch Друзья --since-time 2026-01-01
max store fetch Друзья --last 500
max store fetch Друзья --background      # в фоне; `max store jobs show <id>` следит за ним
```

Recorre páginas de 30 mensajes, como desplazarse hacia arriba en la versión web, desde el más antiguo descargado. Entre páginas espera entre `--pause` y el doble, por defecto `5s`, es decir, 5–10 segundos. Cada ejecución obtiene hasta `--limit` mensajes, por defecto 1.200 o 40 páginas. Al repetir continúa donde terminó y omite lo guardado. Sin `--since-time` ni `--last`, las ejecuciones llegan al inicio; ambas opciones son incompatibles. `--since-time` acepta ISO 8601 o tiempo relativo (`30d`). Ctrl-C o `--timeout` detienen después de la página actual, conservando los datos.

Si MAX indica una espera, se respeta. Otro error detiene sin repetir la solicitud. `store fetch` no lee reacciones ni marca mensajes leídos. `--estimate` no funciona para MAX porque sus IDs no permiten contar mensajes pendientes.

Los datos van al almacén compartido con `tg`; `max store info` muestra su ruta. `max store status` indica cantidades y tramos completos por chat. La copia antigua de `max` no se migra: descarga de nuevo el historial.

`max store jobs list` muestra descargas en segundo plano; `max store jobs cancel <id>` las detiene.

Mantenimiento:

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

`max messages search` encuentra mensajes guardados por palabras, remitente, chat, fecha, archivos, enlaces y tus etiquetas. Por defecto solo lee el archivo; `--sync-first` primero descarga un conjunto limitado de mensajes nuevos de MAX sin marcarlos como leídos. La [guía de búsqueda de mensajes](./search.md) también explica las búsquedas guardadas y los recuentos. Un resultado vacío significa «no está en este archivo»: descarga primero el chat.

## Conversaciones dentro de un grupo

En un grupo activo hay varias conversaciones a la vez. `max conversations` agrupa mensajes guardados y encuentra debates por su tema en este ordenador: consulta la [búsqueda por temas](./topic-search.md).

## Mensajes en directo: `max serve` y `max watch`

Una orden normal conecta, ejecuta y termina. `max serve` mantiene una conexión y distribuye mensajes nuevos a quienes escuchan.

**No hace falta iniciarlo manualmente.** La primera orden que necesita MAX lo inicia en segundo plano si falta y continúa con su conexión propia; las siguientes usan el servidor. **Se detiene tras 15 minutos sin uso.** Su registro está en `<профиль>.serve.log`, junto al estado del perfil, permisos 600. Desactiva el inicio con `--no-serve` una vez, o `max config set serve false` permanentemente. `max session end` detiene primero un servidor iniciado automáticamente.

**Los servidores manuales (`max serve`, `max server start`) solo se detienen con Ctrl-C o `max server stop`**, no por inactividad, cierre de sesión ni otras peticiones. Un inicio manual sustituye al automático. Puedes elegir `--idle` explícitamente. `max session start` detiene cualquier servidor del perfil, entra y lo reinicia con la sesión nueva, manteniendo una conexión a la vez.

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
max watch --events --jsonl  # ещё правки, удаления и реакции; у каждой строки поле "event"
```

- **Tras actualizar `max`**, el servidor automático se sustituye solo. Uno manual mantiene la versión hasta reiniciar; `max server status` lo muestra y `max server restart` lo resuelve.
- **Como servicio.** Tras `max server install`, inicio y parada usan systemd o launchd. El servicio ejecuta `max serve` sin tiempo de inactividad. Si MAX rechaza el acceso, **no** reinicia para evitar más intentos. `max server status` muestra servicio y registro.
- **Uno por perfil.** Un segundo `max serve` rechaza iniciarse. El socket junto al estado tiene 600, accesible solo al propietario.
- **Comportamiento de una pestaña web.max.ru:** ping cada 30 segundos, respuestas a pings y confirmación de recepción. **No marca leído** ni envía mensajes.
- **Si MAX desconecta**, reintenta tras 1, 2, 4… segundos, hasta un minuto de espera; `max watch` lo indica en stderr. Un token rechazado detiene con error de autenticación.
- **Una conexión compartida por perfil.** Comandos, `max mcp` y `max watch` usan la del servidor para leer, enviar y reaccionar. Los controles de envío siguen en el comando. Si falta, se inicia y espera; con `serve: false`, el comando conecta directamente. Un segundo servidor rechaza antes de entrar.
- El servidor actualiza mensajes, lecturas desde el móvil y cambios de chats. Si no puede aplicar un evento, como un borrado, vuelve a entrar en segundo plano, como máximo una vez por minuto.
- **Con `--events`, cambia el formato:** `{"event": "message", "message": …}`, `{"event": "edit", "message": …}`, `{"event": "delete", "chatId", "chatTitle", "messageId"}`, `{"event": "reaction", "chatId", "chatTitle", "messageId", "reactions"}`. Sin la opción, una línea por mensaje. `max watch` no muestra quién escribe: MAX solo lo envía a quien tenga abierto ese chat.
- **Solo ve mensajes mientras ambos estén conectados.** Tras una interrupción, una línea `status` con `connected: true` indica recuperar lo perdido con `max inbox --since-time <время из поля at предыдущей строки status>`.

## Siguiente paso

- [Uso de la cuenta personal](./usage.md): leer y enviar.
- [Diagnóstico](./diagnostics.md): qué hizo la orden.
- [Referencia](./commands.md): opciones de `store`, `serve`, `watch`.

## Mantenimiento del archivo

`max store migrate` completa los índices; `max store reindex` los reconstruye. `store info` y `store check` indican si los índices de palabras y raíces están listos. Tener un índice de raíces no cambia por sí solo la coincidencia estricta. `config set searchStemmers.cyrillic` acepta `russian` o `none`; `config set searchStemmers.latin` acepta `spanish`, `english` o `none`. `none` desactiva las raíces para ese alfabeto. Después ejecuta `store reindex`. Este ajuste es común a todos los perfiles y ambos mensajeros: no admite `--defaults`, `--personal` ni `--bot`, y no puede cambiarse con `MAX_PROFILE_LOCK`.

`max store repair --dry-run --json` muestra las reparaciones de estructura y revierte los cambios; `store repair` las aplica sin borrar datos. Una tabla incompatible se conserva como copia; la respuesta enumera las filas y columnas que no pudieron trasladarse. Conserva la copia hasta comprobar el resultado. `store repair` indica los nombres de las copias (`copies` en `--json`); `store copies delete <точное имя>` borra solo la indicada. Detén los procesos que usen el archivo antes de reparar su estructura.
