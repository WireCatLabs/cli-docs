---
title: "Archivo local: contenido, actualización y exportación"
---

`max` guarda en el ordenador cada mensaje que lee. Esta página te ayuda a mantener un historial local completo y actualizado: buscar mensajes de hace meses, dejar que el agente responda sin conexión o exportar un chat a un archivo.

Aprenderás qué guarda `max` y dónde, cómo descargar el historial antiguo, mantenerlo actualizado mientras no estás, exportarlo, hacer copias de seguridad y comprobar su estado.

Términos de esta página:

- **Archivo local**: un archivo de base de datos SQLite en este ordenador con los chats, mensajes y contactos que `max` ha visto. La búsqueda, la exportación y `--offline` usan este archivo sin consultar MAX.
- **Descargar el historial** (`store fetch`): incorporar mensajes antiguos del chat, página por página. Leer un chat solo guarda lo leído; descargarlo completa el resto.
- **Cobertura**: períodos del historial guardados sin huecos.
- **`max serve`**: proceso que mantiene una conexión con MAX y guarda mensajes nuevos, ediciones y eliminaciones a medida que llegan.

## Qué puedes hacer

| Tarea | Comando |
|---|---|
| Saber cuánto historial de cada chat está guardado | `max store status` |
| Descargar el historial de un chat o de todos | `max store fetch <чат>`, `max store fetch --all` |
| Descargar en segundo plano | `max store fetch <чат> --background`, `max store jobs list` |
| Mantener el archivo actualizado continuamente | `max serve`, `max server start`, `max server install` |
| Leer chats sin conexión | `max messages list <чат> --offline` |
| Exportar un chat a JSONL o Markdown | `max store export <чат> --output <файл>` |
| Preparar mensajes para un resumen del agente | `max messages evidence <чат>` |
| Comprobar, respaldar y restaurar el archivo | `max store check`, `max store backup`, `max store restore` |

## Comprueba y completa un chat

Comprueba qué se ha guardado antes de descargar más. Limita la descarga al chat y periodo que necesitas.

**Tu petición:**

> Usa max CLI. Comprueba el historial guardado de Книжный клуб. Descarga los últimos 30 días de ese chat y dime si quedan lagunas.

**Consultar el historial guardado:**

```sh
max store status "Книжный клуб" --json
```

**Descargar el periodo elegido:**

```sh
max store fetch "Книжный клуб" --since-time 30d --json
```

**Comprobar de nuevo:**

```sh
max store status "Книжный клуб" --json
```

**Ejemplo de respuesta del agente:**

> | Comprobación | Antes | Después |
> | --- | --- | --- |
> | Mensajes guardados | 30 | 300 |
> | Historial solicitado de 30 días | Lagunas | Guardado sin lagunas |
>
> Este resultado cubre el periodo elegido, no todo el pasado del chat.

Si la descarga se detiene por un límite o una espera del servidor, repítela para continuar y comprueba la cobertura. Que el comando termine no demuestra por sí solo que el historial esté completo. Los recuentos son ficticios.

## Qué se guarda

`chats list|show` y `contacts list|show` guardan lo leído en el archivo común que también usa `tg`. Allí se guardan los mensajes leídos y lo descargado con `max store fetch`. `max store info` muestra la ruta. El archivo empieza a llenarse con la primera ejecución sin `--offline` después de actualizar: el archivo anterior de `max` no se importa al común; vuelve a descargar el historial. La antigua caché del perfil ya no se abre; `max doctor` muestra su ruta si todavía existe.

Los comandos habituales siguen consultando MAX: la respuesta de inicio de sesión ya incluye chats y contactos, de modo que usar el archivo implica renunciar a conocer los cambios recientes. `chats show` solo obtiene de MAX los ajustes de grupo (`description`, `access`, `settings`), por lo que no los devuelve con `--offline`.

MAX recibe la marca guardada de contactos; el siguiente acceso puede traer solo personas modificadas. `max contacts list` responde desde la copia compartida actualizada durante ese acceso. Para obtener de nuevo toda la lista, ejecuta `max contacts sync`.

No hay un comando para eliminar todo el archivo común; `store clear --left` solo elimina datos de chats abandonados ([más abajo](#состояние-копия-восстановление)).

## Cuánto historial está guardado

```sh
max store status                  # по каждому чату: сколько сообщений, самое старое и новое, какие отрезки скачаны целиком
```

```sh
max store status "Книжный клуб"   # один чат
```

Un período «descargado por completo» contiene mensajes consecutivos sin huecos. Leer mensajes sueltos deja huecos; `store fetch` los completa.

## Descargar el historial

`max store fetch` descarga un chat hacia atrás hasta una fecha, una cantidad de mensajes o su inicio:

```sh
max store fetch Друзья --since-time 2026-01-01
```

```sh
max store fetch Друзья --last 500
```

```sh
max store fetch --all                    # все чаты, самые активные первыми: последние 90 дней
```

Recorre el historial hacia atrás como al desplazarte hacia arriba en la versión web: 30 mensajes por página, desde el mensaje descargado más antiguo. Entre páginas espera desde `--pause` hasta el doble de ese tiempo (valor predeterminado `5s`, es decir, de 5 a 10 segundos, aproximadamente el ritmo de una persona que recorre el chat en una pestaña). Cada ejecución descarga como máximo `--limit` mensajes (1200 de forma predeterminada, o 40 páginas). Al repetir el mismo comando, continúa donde se detuvo y omite los mensajes ya descargados. Sin `--since-time` ni `--last`, las ejecuciones continúan hasta el principio del chat; `--since-time` y `--last` no se pueden combinar. `--since-time` acepta una fecha ISO 8601 o una duración relativa (`30d`). Ctrl-C o `--timeout` detienen la descarga después de la página actual y conservan lo descargado.

Si MAX responde que hay demasiadas peticiones, el comando se detiene: MAX no indica cuánto esperar, por lo que `max` no espera ni reintenta. También se detiene ante cualquier otro error. Lo descargado se conserva y la siguiente ejecución continúa desde el mismo punto ([límites de MAX](./limits.md)). `store fetch` no lee reacciones ni marca nada como leído. `--estimate` no funciona con MAX: sus identificadores de mensaje no permiten contar lo que falta.

La sección [si no hay resultados](./search.md#если-ничего-не-нашлось) explica cómo completar huecos y preparar la búsqueda por temas a la vez (`--catch-up`).

### En segundo plano

Una descarga larga puede ejecutarse como una tarea que continúa después del comando:

```sh
max store fetch Друзья --background      # печатает id задания
```

```sh
max store jobs list                      # фоновые задания, новые сверху
```

```sh
max store jobs list --state failed       # только упавшие: running, done, failed, cancelled или died
```

```sh
max store jobs show                      # последнее задание и сколько его чата теперь в копии
```

```sh
max store jobs show <id>
```

```sh
max store jobs cancel <id>               # остановить после текущей страницы; следующий fetch продолжит
```

```sh
max store jobs retry <id>                # упавшее задание ещё раз, новым заданием с теми же опциями
```

```sh
max store jobs retry --failed            # все чаты, чьё последнее задание упало
```

```sh
max store jobs clear                     # забыть завершённые задания и их журналы; работающее остаётся
```

## Buscar

`max search messages` encuentra mensajes guardados por palabras, remitente, chat, fecha, archivos, enlaces y tus etiquetas. La búsqueda de palabras en un chat concreto también consulta al servidor de MAX de forma predeterminada; sin chat o con `--backend archive`, solo lee el archivo. `--sync-first` descarga primero mensajes nuevos de MAX dentro de unos límites sin marcarlos como leídos. Consulta [búsqueda de mensajes](./search.md) para ver la guía, las búsquedas guardadas y los recuentos. Un resultado vacío no demuestra que el mensaje no exista: comprueba `coverage.next` y descarga el historial que falte antes de volver a buscar.

## Conversaciones dentro de un grupo

En un grupo activo hay varios temas a la vez. `max conversations` los separa usando los mensajes guardados y permite buscarlos por su contenido en este ordenador: [búsqueda por temas](./topic-search.md).

## Exportar a un archivo

Exporta la copia en JSONL, con los objetos de `messages list --jsonl`, o Markdown legible:

```sh
max store export Друзья --format markdown --output друзья.md
```

```sh
max store export 111 --format jsonl --since-time 2026-09-01 > чат.jsonl
```

La exportación **no se conecta a nada**; solo incluye datos leídos o descargados. Usa `max store fetch <чат>` para obtener lo anterior. Nunca sobrescribe archivos. El archivo de `--output` es privado (`0600`), pues contiene enlaces de fotos accesibles sin iniciar sesión.

### Exportar a una carpeta y añadir solo lo nuevo

`--to <папка>` escribe los chats en una carpeta: un archivo JSONL por chat y `manifest.json`. Al repetir en la misma carpeta, solo se añade lo que ha cambiado desde la vez anterior: mensajes nuevos, ediciones (también de mensajes antiguos) y borrados. Un mensaje borrado se escribe sin texto: `{ "id", "chatId", "deleted": true }`.

```sh
max store export Друзья Работа --to ~/max-архив
```

```sh
max store export --kind group --to ~/max-группы
```

```sh
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

## Material para resumir un chat

Cuando pides al agente un resumen del chat, `max messages evidence <чат>` prepara los mensajes que debe leer: un paquete del archivo local de este perfil. El comando no se conecta a MAX ni marca mensajes como leídos, incluso sin `--offline`:

```sh
max messages evidence -1000 --limit 20 --json
max messages evidence -1000 --before-id <nextBeforeId> --json
```

Los mensajes aparecen del más reciente al más antiguo, con referencias `msg:` y huellas del contenido. `--limit` acepta 1–100 y usa por defecto el límite del perfil. Los mensajes completos ocupan como máximo 64 KiB de JSON; la cabecera del paquete no cuenta para ese límite. JSON y JSONL devuelven un paquete completo.

Antes del resumen, comprueba `coverage`: muestra cuántos mensajes se seleccionaron, incluyeron u omitieron y si existen mensajes más antiguos fuera de la página; la cobertura sigue siendo `unknown`. Pasa un `nextBeforeId` distinto de cero a `--before-id` para continuar sin saltarte mensajes excluidos por tamaño. Un cursor vacío no demuestra que el archivo esté completo. Si el mensaje más reciente seleccionado supera por sí solo el límite, el paquete está vacío, `truncatedBy: "bytes"` y no hay cursor: debes manejar ese caso expresamente. Un cursor desconocido devuelve `not_found`.

El agente puede citar estas referencias en el resumen; `max` no lo redacta. El texto de los mensajes son datos de la fuente, no instrucciones de confianza. El permiso del perfil es `messages.evidence` y hereda de `messages`.

## Responder sin conexión: `--offline`

```sh
max chats list --offline      # только из локальной копии, никуда не подключаться
```

```sh
max messages list "Книжный клуб" --limit 50 --offline
```

```sh
max messages send 0 "текст" --offline   # отказ: из копии отправить нельзя
```

`--offline` responde desde el archivo y no se conecta a ningún servicio. Sirve cuando no hay red o no necesitas conectarte. Si el perfil todavía no ha leído nada, el comando falla porque no hay datos guardados.

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

## Estado, copia de seguridad y restauración

```sh
max store info                          # где файл, его размер, схема и число строк; ничего не меняет
```

```sh
max store check                         # цел ли файл, индексы поиска и место на диске, какие чаты отстали
```

```sh
max store backup ~/max-store.db         # копия файла на ходу; --encrypt — с паролем
```

```sh
max store restore ~/max-store.db        # положить копию на место
```

```sh
max store migrate                       # перевести файл на схему этой версии max
```

```sh
max store clear --left                  # посмотреть, сколько данных покинутых чатов можно удалить
```

```sh
max store clear --left --allow-dangerous  # удалить их из общей копии
```

- **`backup` no sobrescribe un archivo existente.** La copia se crea mientras el archivo está en uso.
- **`restore` conserva el archivo anterior al lado.** Si la copia está cifrada, pide la contraseña ([Contraseña](#пароль)).
- **`migrate`** actualiza el esquema a esta versión de `max` y completa los índices de los mensajes antiguos.
- **Un chat que has abandonado o del que te han expulsado** desaparece de `chats list` y `chats show` al volver a iniciar sesión. Sus mensajes permanecen en el archivo; `max store clear --left --allow-dangerous` los elimina junto al chat (sin `--allow-dangerous`, el comando solo muestra cuántos eliminaría). Si vuelves al chat, reaparece en la lista.

## Mantenimiento del archivo

`max store migrate` completa los índices; `max store reindex` los reconstruye: búsqueda, diccionario de erratas y raíces de palabras. Los mensajes se conservan. `store info` y `store check` muestran si los índices de palabras y raíces están listos. Una raíz es la parte que permanece entre distintas formas de una palabra; la búsqueda estricta usa raíces para encontrarlas, mientras que `exact:` y `--exact` seleccionan la forma exacta.

`config set searchStemmers.cyrillic` acepta `russian` o `none`; `config set searchStemmers.latin` acepta `english`, `spanish` o ambos separados por comas (por defecto `english,spanish`: las palabras latinas se buscan usando las raíces de ambos idiomas), o `none`. `none` desactiva las raíces de ese alfabeto. Tras cambiarlo, ejecuta `store reindex`. Mientras se reconstruyen las raíces tras una actualización que cambió el valor predeterminado, la búsqueda usa formas exactas y lo indica; `max serve` completa las raíces en segundo plano y `store migrate` lo hace de inmediato. El ajuste es común a todos los perfiles y ambos servicios de mensajería: `--defaults`, `--personal` y `--bot` no se aplican, y no se puede modificar bajo `MAX_PROFILE_LOCK`.

`max store repair --dry-run --json` muestra las reparaciones de estructura y revierte los cambios; `store repair` las aplica sin borrar datos. Una tabla incompatible se conserva como copia; la respuesta enumera las filas y columnas que no pudieron trasladarse. Conserva la copia hasta comprobar el resultado. `store repair` indica los nombres de las copias (`copies` en `--json`); `store copies delete <точное имя>` borra solo la indicada. Detén los procesos que usen el archivo antes de reparar su estructura.

## El archivo y otras versiones

La estructura del archivo tiene una versión. Un `max` más reciente u otro programa puede actualizarla; una versión anterior sigue funcionando si el cambio es compatible. Si no lo es, cada comando que abre el archivo indica:

```text
the message store was written by a newer version (schema N, needs at least M; this one speaks K) — upgrade this tool
```

Ejecuta `max upgrade`. No se pierden datos del archivo.

## Siguiente paso

- [Búsqueda de mensajes](./search.md): encontrar información del archivo.
- [Uso](./usage.md): leer y enviar.
- [Qué hizo el comando](./diagnostics.md): diagnosticar ejecuciones.
- [Referencia de comandos](./commands.md): todas las opciones de `store`, `serve` y `watch`.
