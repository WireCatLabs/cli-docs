---
title: "Archivo local: contenido, actualización y exportación"
---

`max` guarda en el ordenador cada mensaje que lee. Esta página te ayuda a mantener un historial local completo y actualizado: buscar mensajes de hace meses, dejar que el agente responda sin conexión o exportar un chat a un archivo.

Aprenderás qué guarda `max` y dónde, cómo descargar el historial antiguo, mantenerlo actualizado mientras no estás, exportarlo, hacer copias de seguridad y comprobar su estado.

Términos de esta página:

- **Archivo local**: un archivo de base de datos SQLite en este ordenador con los chats, mensajes y contactos que `max` ha visto. La búsqueda, la exportación y `--offline` usan este archivo sin consultar MAX.
- **Descargar el historial** (`messages sync`): incorporar mensajes antiguos del chat, página por página. Leer un chat solo guarda lo leído; descargarlo completa el resto.
- **Cobertura**: períodos del historial guardados sin huecos.
- **`max personal serve`**: proceso que mantiene una conexión con MAX y guarda mensajes nuevos, ediciones y eliminaciones a medida que llegan.

## Qué puedes hacer

| Tarea | Comando |
|---|---|
| Saber cuánto historial de cada chat está guardado | `max personal store status` |
| Descargar el historial de un chat o de todos | `max personal messages sync <чат>`, `max personal messages sync --all` |
| Descargar en segundo plano | `max personal messages sync <чат> --background`, `max personal store jobs list` |
| Mantener el archivo actualizado continuamente | `max personal serve`, `max personal server start`, `max personal server install` |
| Leer chats sin conexión | `max personal messages list <чат> --offline` |
| Exportar un chat a JSONL o Markdown | `max personal store export <чат> --output <файл>` |
| Preparar mensajes para un resumen del agente | `max personal messages evidence <чат>` |
| Comprobar, respaldar y restaurar el archivo | `max personal store check`, `max personal store backup`, `max personal store restore` |

## Comprueba y completa un chat

Comprueba qué se ha guardado antes de descargar más. Limita la descarga al chat y periodo que necesitas.

**Tu petición:**

> Usa max CLI. Comprueba el historial guardado de Книжный клуб. Descarga los últimos 30 días de ese chat y dime si quedan lagunas.

**Consultar el historial guardado:**

```sh
max personal store status "Книжный клуб" --json
```

**Descargar el periodo elegido:**

```sh
max personal messages sync "Книжный клуб" --since-time 30d --json
```

**Comprobar de nuevo:**

```sh
max personal store status "Книжный клуб" --json
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

`chats list|show` y `contacts list|show` guardan lo leído en el archivo común que también usa `tg`. Allí se guardan los mensajes leídos y lo descargado con `max personal messages sync`. `max personal store info` muestra la ruta. El archivo empieza a llenarse con la primera ejecución sin `--offline` después de actualizar: el archivo anterior de `max` no se importa al común; vuelve a descargar el historial. La antigua caché del perfil ya no se abre; `max personal doctor` muestra su ruta si todavía existe.

Los comandos habituales siguen consultando MAX: la respuesta de inicio de sesión ya incluye chats y contactos, de modo que usar el archivo implica renunciar a conocer los cambios recientes. `chats show` solo obtiene de MAX los ajustes de grupo (`description`, `access`, `settings`), por lo que no los devuelve con `--offline`.

MAX recibe la marca guardada de contactos; el siguiente acceso puede traer solo personas modificadas. `max personal contacts list` responde desde la copia compartida actualizada durante ese acceso. Para obtener de nuevo toda la lista, ejecuta `max personal contacts sync`.

No hay un comando para eliminar todo el archivo común; `store clear --left` solo elimina datos de chats abandonados ([más abajo](#состояние-копия-восстановление)).

## Cuánto historial está guardado

```sh
max personal store status                  # по каждому чату: сколько сообщений, самое старое и новое, какие отрезки скачаны целиком
```

```sh
max personal store status "Книжный клуб"   # один чат
```

Un período «descargado por completo» contiene mensajes consecutivos sin huecos. Leer mensajes sueltos deja huecos; `messages sync` los completa.

## Descargar el historial

`max personal messages sync` descarga un chat hacia atrás hasta una fecha, una cantidad de mensajes o su inicio:

```sh
max personal messages sync Друзья --since-time 2026-01-01
```

```sh
max personal messages sync Друзья --last 500
```

```sh
max personal messages sync --all                    # все чаты, самые активные первыми: последние 90 дней
```

Recorre el historial hacia atrás como al desplazarte hacia arriba en la versión web: 30 mensajes por página, desde el mensaje descargado más antiguo. Entre páginas espera desde `--pause` hasta el doble de ese tiempo (valor predeterminado `5s`, es decir, de 5 a 10 segundos, aproximadamente el ritmo de una persona que recorre el chat en una pestaña). Cada ejecución descarga como máximo `--limit` mensajes (1200 de forma predeterminada, o 40 páginas). Al repetir el mismo comando, continúa donde se detuvo y omite los mensajes ya descargados. Sin `--since-time` ni `--last`, las ejecuciones continúan hasta el principio del chat; `--since-time` y `--last` no se pueden combinar. `--since-time` acepta una fecha ISO 8601 o una duración relativa (`30d`). Ctrl-C o `--timeout` detienen la descarga después de la página actual y conservan lo descargado.

Si MAX responde que hay demasiadas peticiones, el comando se detiene: MAX no indica cuánto esperar, por lo que `max` no espera ni reintenta. También se detiene ante cualquier otro error. Lo descargado se conserva y la siguiente ejecución continúa desde el mismo punto ([límites de MAX](./limits.md)). `messages sync` no lee reacciones ni marca nada como leído. `--estimate` no funciona con MAX: sus identificadores de mensaje no permiten contar lo que falta.

La sección [si no hay resultados](./search.md#если-ничего-не-нашлось) explica cómo completar huecos y preparar la búsqueda por temas a la vez (`--catch-up`).

### En segundo plano

Una descarga larga puede ejecutarse como una tarea que continúa después del comando:

```sh
max personal messages sync Друзья --background      # печатает id задания
```

```sh
max personal store jobs list                      # фоновые задания, новые сверху
```

```sh
max personal store jobs list state:failed        # только упавшие: running, done, partial, failed, cancelled или died
```

```sh
max personal store jobs show                      # последнее задание и сколько его чата теперь в копии
```

```sh
max personal store jobs show <id>
```

```sh
max personal store jobs cancel <id>               # остановить после текущей страницы; следующий fetch продолжит
```

```sh
max personal store jobs retry <id>                # упавшее задание ещё раз, новым заданием с теми же опциями
```

```sh
max personal store jobs retry --failed            # все чаты, чьё последнее задание упало
```

```sh
max personal store jobs clear                     # забыть завершённые задания и их журналы; работающее остаётся
```

## Buscar

`max personal search messages` encuentra mensajes guardados por palabras, remitente, chat, fecha, archivos, enlaces y tus etiquetas. La búsqueda de palabras en un chat concreto también consulta al servidor de MAX de forma predeterminada; sin chat o con `--backend archive`, solo lee el archivo. `--sync-first` descarga primero mensajes nuevos de MAX dentro de unos límites sin marcarlos como leídos. Consulta [búsqueda de mensajes](./search.md) para ver la guía, las búsquedas guardadas y los recuentos. Un resultado vacío no demuestra que el mensaje no exista: comprueba `coverage.next` y descarga el historial que falte antes de volver a buscar.

## Conversaciones dentro de un grupo

En un grupo activo hay varios temas a la vez. `max personal conversations` los separa usando los mensajes guardados y permite buscarlos por su contenido en este ordenador: [búsqueda por temas](./topic-search.md).

## Exportar a un archivo

Exporta la copia en JSONL, con los objetos de `messages list --jsonl`, o Markdown legible:

```sh
max personal store export Друзья --format markdown --output друзья.md
```

```sh
max personal store export 111 --format jsonl --since-time 2026-09-01 > чат.jsonl
```

La exportación **no se conecta a nada**; solo incluye datos leídos o descargados. Usa `max personal messages sync <чат>` para obtener lo anterior. Nunca sobrescribe archivos. El archivo de `--output` es privado (`0600`), pues contiene enlaces de fotos accesibles sin iniciar sesión.

### Exportar a una carpeta y añadir solo lo nuevo

`--to <папка>` escribe los chats en una carpeta: un archivo JSONL por chat y `manifest.json`. Al repetir en la misma carpeta, solo se añade lo que ha cambiado desde la vez anterior: mensajes nuevos, ediciones (también de mensajes antiguos) y borrados. Un mensaje borrado se escribe sin texto: `{ "id", "chat_id", "deleted": true }`.

```sh
max personal store export Друзья Работа --to ~/max-архив
```

```sh
max personal store export --kind group --to ~/max-группы
```

```sh
max personal store export --all --to ~/max-всё
```

`max` no toca una carpeta con archivos ajenos ni la exportación de otra cuenta. Un cambio solo en las reacciones no cuenta como cambio.

### Contraseña

`--encrypt` en `store export` (con `--output` o `--to`) y en `store backup` comprime el archivo y lo cifra con una contraseña. No hacen falta programas externos. Para abrir ese archivo: `max personal store decrypt <файл> --output <новый файл>`; `max personal store restore` pide por sí mismo la contraseña de una copia cifrada.

- **La contraseña no se guarda en ningún sitio**: ni en la configuración, ni en el almacén de contraseñas, ni en el registro. Si la olvidas, el archivo no se puede abrir.
- Si la escribes tú en el terminal, no se muestra y se pide dos veces. Un agente al que hayas dado la contraseña la pasa por stdin, no como argumento de la orden, porque otros programas pueden ver los argumentos:

  ```sh
  printf '%s' 'пароль' | max personal store backup ~/max.sealed --encrypt
  ```

- En una carpeta cifrada se escribe un archivo por ejecución. Su `manifest.json` no incluye nombres de chats, y `max` no acepta una ejecución con otra contraseña.

## Material para resumir un chat

Cuando pides al agente un resumen del chat, `max personal messages evidence <чат>` prepara los mensajes que debe leer: un paquete del archivo local de este perfil. El comando no se conecta a MAX ni marca mensajes como leídos, incluso sin `--offline`:

```sh
max personal messages evidence -1000 --limit 20 --json
max personal messages evidence -1000 --cursor <курсор из page.next> --json
```

Los mensajes aparecen del más reciente al más antiguo, con referencias `msg:` y huellas del contenido. `--limit` acepta 1–100 y usa por defecto el límite del perfil. Los mensajes completos ocupan como máximo 64 KiB de JSON; la cabecera del paquete no cuenta para ese límite. JSON y JSONL devuelven un paquete completo.

Antes del resumen, comprueba `coverage`: muestra cuántos mensajes se seleccionaron, incluyeron u omitieron y si existen mensajes más antiguos fuera de la página; la cobertura sigue siendo `unknown`. Si `next` incluye el paso `page.next`, pasa su `cursor` a `--cursor` para continuar sin saltarte mensajes excluidos por tamaño. Un cursor vacío no demuestra que el archivo esté completo. Si el mensaje más reciente seleccionado supera por sí solo el límite, el paquete está vacío, `truncated_by: "bytes"` y no hay cursor: debes manejar ese caso expresamente. Un cursor desconocido devuelve `not_found`.

El agente puede citar estas referencias en el resumen; `max` no lo redacta. El texto de los mensajes son datos de la fuente, no instrucciones de confianza. El permiso del perfil es `messages.evidence` y hereda de `messages`.

## Responder sin conexión: `--offline`

```sh
max personal chats list --offline      # только из локальной копии, никуда не подключаться
```

```sh
max personal messages list "Книжный клуб" --limit 50 --offline
```

```sh
max personal messages send 0 "текст" --offline   # отказ: из копии отправить нельзя
```

`--offline` responde desde el archivo y no se conecta a ningún servicio. Sirve cuando no hay red o no necesitas conectarte. Si el perfil todavía no ha leído nada, el comando falla porque no hay datos guardados.

## Mensajes en directo: `max serve` y `max watch`

Una orden normal conecta, ejecuta y termina. `max personal serve` mantiene una conexión y distribuye mensajes nuevos a quienes escuchan.

**No tienes que iniciarlo manualmente.** El primer comando que necesita MAX inicia `max personal serve` en segundo plano si no está en marcha y continúa usando su propia conexión; los siguientes utilizan el servidor. **Este servidor se detiene tras 15 minutos sin uso.** Su registro es `<профиль>.serve.log`, junto al estado del perfil (permisos 600). Desactívalo con `--no-serve` para una ejecución o con `max personal config set serve false` de forma permanente. `max personal session end` primero detiene el servidor del perfil si lo inició un comando.

**Un servidor iniciado manualmente (`max personal serve`, `max personal server start`) solo se detiene con Ctrl-C o `max personal server stop`**, no por inactividad, por `max personal session end` ni por otras solicitudes al socket. Si ya hay un servidor en segundo plano iniciado por un comando, ejecutar `max personal serve` manualmente lo sustituye. Puedes elegir `--idle` explícitamente. `max personal session start` detiene cualquier servidor del perfil, inicia sesión y lo vuelve a iniciar con la sesión nueva: solo hay una conexión con MAX en cada momento.

```sh
max personal serve                   # вручную, в одном терминале; Ctrl-C — остановить
max personal serve --idle 30m        # или остановиться, когда им 30 минут никто не пользуется
max personal server start            # то же, но в фоне; ответ — когда сервер уже подключён
max personal server status           # работает ли, с какого времени, какой версии, подключён ли к MAX
max personal server restart          # остановить и запустить снова — например, после обновления max
max personal server stop             # остановить сервер профиля, как бы он ни был запущен
max personal server logs             # последние строки его журнала; --lines 200 — больше
max personal server install          # служба systemd (Linux) или launchd (macOS) для профиля; ничего не запускает
max personal server uninstall        # убрать службу; сначала max personal server stop
max personal watch                   # в другом: новые сообщения по мере прихода
max personal watch --jsonl           # то же для скрипта: одно сообщение на строку, как у `messages list`
max personal watch --jsonl | ./on-message.sh
max personal watch --events --jsonl  # ещё правки, удаления, реакции, прочтения и изменения чатов; у строки поле "event"
```

- **Tras actualizar `max`**, el servidor automático se sustituye solo. Uno manual mantiene la versión hasta reiniciar; `max personal server status` lo muestra y `max personal server restart` lo resuelve.
- **Usar un servicio.** Después de `max personal server install`, `max personal server start` inicia el servidor mediante systemd o launchd y `max personal server stop` lo detiene allí. El servicio ejecuta `max personal serve`, un servidor iniciado manualmente sin cierre por inactividad. Si MAX rechaza el inicio de sesión, el servicio **no** reinicia el servidor: cada reintento supondría otro inicio de sesión. `max personal server status` muestra el servicio y la ubicación de su registro.
- **Uno por perfil.** Un segundo `max personal serve` rechaza iniciarse. El socket junto al estado tiene 600, accesible solo al propietario.
- **Su comportamiento en la red es como el de una pestaña de web.max.ru:** un ping cada 30 segundos, respuestas a los pings de MAX y confirmaciones de recepción de cada mensaje entrante. **No marca nada como leído** ni envía mensajes.
- **Si MAX desconecta**, reintenta tras 1, 2, 4… segundos, hasta un minuto de espera; `max personal watch` lo indica en stderr. Un token rechazado detiene con error de autenticación.
- **Una conexión compartida por perfil.** Comandos, `max personal mcp` y `max personal watch` usan la del servidor para leer, enviar y reaccionar. Los controles de envío siguen en el comando. Si falta, se inicia y espera; con `serve: false`, el comando conecta directamente. Un segundo servidor rechaza antes de entrar.
- El servidor mantiene actualizado el estado de su sesión: tiene en cuenta mensajes nuevos, chats leídos en el teléfono y cambios en los chats. Si MAX informa de algo que no puede aplicar (mensajes eliminados), vuelve a iniciar sesión en segundo plano, como máximo una vez por minuto.
- **Con `--events`, cambia el formato:** `{"event": "message", "message": …}`, `{"event": "edit", "message": …}`, `{"event": "delete", "chat_id", "chat_title", "message_id"}`, `{"event": "reaction", "chat_id", "chat_title", "message_id", "reactions"}`, `{"event": "read", "chat_id", "chat_title", "user_id", "up_to_time", "unread_count"}` indica quién leyó hasta esa hora, incluido el propietario desde otro dispositivo; `{"event": "chat", "chat"}` indica cambios de nombre, miembros o salida del propietario. Marcar como no leído no genera un evento de lectura. Sin la opción, una línea por mensaje. `max personal watch` no muestra quién escribe: MAX solo lo envía a quien tenga abierto ese chat.
- **`max personal watch` solo ve lo que llega mientras tanto él como el servidor están conectados.** Los mensajes que llegan durante una desconexión de MAX se pierden en ese flujo. Una línea `status` con `connected: true` después de una desconexión indica que debes recuperar lo omitido: `max personal inbox 'date>"<время из поля at предыдущей строки status>"'`.

## Estado, copia de seguridad y restauración

```sh
max personal store info                          # где файл, его размер, схема и число строк; ничего не меняет
```

```sh
max personal store check                         # цел ли файл, индексы поиска и место на диске, какие чаты отстали
```

```sh
max personal store backup ~/max-store.db         # копия файла на ходу; --encrypt — с паролем
```

```sh
max personal store restore ~/max-store.db        # положить копию на место
```

```sh
max personal store migrate                       # перевести файл на схему этой версии max
```

```sh
max personal store clear --left                  # посмотреть, сколько данных покинутых чатов можно удалить
```

```sh
max personal store clear --left --allow-dangerous  # удалить их из общей копии
```

- **`backup` no sobrescribe un archivo existente.** La copia se crea mientras el archivo está en uso.
- **`restore` conserva el archivo anterior al lado.** Si la copia está cifrada, pide la contraseña ([Contraseña](#пароль)).
- **`migrate`** actualiza el esquema a esta versión de `max` y completa los índices de los mensajes antiguos.
- **Un chat que has abandonado o del que te han expulsado** desaparece de `chats list` y `chats show` al volver a iniciar sesión. Sus mensajes permanecen en el archivo; `max personal store clear --left --allow-dangerous` los elimina junto al chat (sin `--allow-dangerous`, el comando solo muestra cuántos eliminaría). Si vuelves al chat, reaparece en la lista.

## Mantenimiento del archivo

`max personal store migrate` completa los índices; `max personal store reindex` los reconstruye: búsqueda, diccionario de erratas y raíces de palabras. Los mensajes se conservan. `store info` y `store check` muestran si los índices de palabras y raíces están listos. Una raíz es la parte que permanece entre distintas formas de una palabra; la búsqueda estricta usa raíces para encontrarlas, mientras que `exact:` y `--exact` seleccionan la forma exacta.

`config set searchStemmers.cyrillic` acepta `russian` o `none`; `config set searchStemmers.latin` acepta `english`, `spanish` o ambos separados por comas (por defecto `english,spanish`: las palabras latinas se buscan usando las raíces de ambos idiomas), o `none`. `none` desactiva las raíces de ese alfabeto. Tras cambiarlo, ejecuta `store reindex`. Mientras se reconstruyen las raíces tras una actualización que cambió el valor predeterminado, la búsqueda usa formas exactas y lo indica; `max personal serve` completa las raíces en segundo plano y `store migrate` lo hace de inmediato. El ajuste es común a todos los perfiles y ambos servicios de mensajería: `--defaults`, `--personal` y `--bot` no se aplican, y no se puede modificar bajo `MAX_PROFILE_LOCK`.

`max personal store repair --dry-run --json` muestra las reparaciones de estructura y revierte los cambios; `store repair` las aplica sin borrar datos. Una tabla incompatible se conserva como copia; la respuesta enumera las filas y columnas que no pudieron trasladarse. Conserva la copia hasta comprobar el resultado. `store repair` indica los nombres de las copias (`copies` en `--json`); `store copies delete <точное имя>` borra solo la indicada. Detén los procesos que usen el archivo antes de reparar su estructura.

## El archivo y otras versiones

La estructura del archivo tiene una versión. Un `max` más reciente u otro programa puede actualizarla; una versión anterior sigue funcionando si el cambio es compatible. Si no lo es, cada comando que abre el archivo indica:

```text
the message store was written by a newer version (schema N, needs at least M; this one speaks K) — upgrade this tool
```

**La copia local compartida usa `wirecat.db`.** El antiguo `messages.db` no se migra: al abrir el almacén predeterminado se elimina junto con sus archivos `-wal` y `-shm`.
Si necesitas notas, alias, etiquetas, tareas o transcripciones antiguas, cierra los programas que usan ese archivo y cópialo, con los archivos auxiliares que tenga, a otra carpeta **antes de ejecutar la nueva versión por primera vez**.
Definir `MESSAGING_STORE` desactiva esta limpieza; un archivo abierto por otro proceso permanece hasta una apertura posterior del almacén.
`max personal messages sync --all` recupera mensajes de MAX; los datos que solo existían localmente no se pueden descargar del servidor. El inicio de sesión se conserva por separado.
Actualiza `max` y `tg` juntos para que usen el mismo almacén.

Para actualizar el esquema de `wirecat.db`, ejecuta `max upgrade` después de conservar cualquier archivo antiguo necesario.

## Siguiente paso

- [Búsqueda de mensajes](./search.md): encontrar información del archivo.
- [Uso](./usage.md): leer y enviar.
- [Qué hizo el comando](./diagnostics.md): diagnosticar ejecuciones.
- [Referencia de comandos](./commands.md): todas las opciones de `store`, `serve` y `watch`.
