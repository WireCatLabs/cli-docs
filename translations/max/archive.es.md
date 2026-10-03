---
title: "Copia local: contenido, actualización y exportación"
---

Lo que `max` lee permanece en tu ordenador para consultar sin red, buscar y exportar. Esta página explica qué guarda, cómo mantenerlo actualizado y cómo descargar y exportar el historial.

## Qué se guarda

Los datos leídos se conservan para responder sin conexión:

```sh
max chats list --offline      # только из локальной копии, никуда не подключаться
max messages send 0 "текст" --offline   # отказ: из копии отправить нельзя
max cache clear               # забыть всё, что этот профиль накопил
max cache clear --left        # забыть только чаты, из которых вы вышли, с их сообщениями
```

Un chat del que sales o te expulsan desaparece de `chats list` y `chats show` en el siguiente acceso. Los mensajes permanecen. `max store clear --left --allow-dangerous` elimina chats abandonados y mensajes; sin `--allow-dangerous`, solo informa de cuánto borraría. `max cache clear --left` hace lo mismo en la antigua copia de `max`. Al volver al chat reaparece en la lista.

`chats list|show` y `contacts list|show` guardan datos en el almacén compartido con `tg`. Se llena desde la primera ejecución sin `--offline` tras actualizar; la copia anterior de `max` no se migra. `chats show` solo obtiene de MAX los ajustes (`description`, `access`, `settings`), ausentes sin conexión.

Las órdenes normales siguen consultando MAX: el acceso ya devuelve chats y contactos. Responder solo con la copia impediría conocer cambios. Usa `--offline` cuando no tengas red o no quieras conectar.

El acceso incluye la fecha de la conexión anterior, y MAX envía **solo los cambios posteriores**. `max contacts list` responde con la copia actualizada completa, no únicamente con los datos de ese acceso. `max cache clear` borra tanto datos como fecha: conservar la fecha sin datos dejaría sin información de base al siguiente acceso.

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
- `max store backup <файл>`: copia del archivo en uso, sin sobrescribir. `max store restore <файл>` restaura y conserva el anterior al lado.
- `max store reindex`: reconstruye índices sin perder mensajes.
- `max store migrate`: actualiza el esquema a esta versión de `max`.

### Exportar a un archivo

Exporta la copia en JSONL, con los objetos de `messages list --jsonl`, o Markdown legible:

```sh
max store export Друзья --format markdown --output друзья.md
max store export 111 --format jsonl --since-time 2026-09-01 > чат.jsonl
```

La exportación **no se conecta a nada**; solo incluye datos leídos o descargados. Usa `max store fetch <чат>` para obtener lo anterior. Nunca sobrescribe archivos. El archivo de `--output` es privado (`0600`), pues contiene enlaces de fotos accesibles sin iniciar sesión.

## Buscar

```sh
max messages search счёт --context 3                 # по три сообщения вокруг каждого совпадения
max messages search 'from:@anna after:7d "договор" -черновик'
max messages search счёт --source all                # во всех аккаунтах общей копии
```

La búsqueda lee únicamente la copia local. Ordena por coincidencia; `--newest` muestra primero lo reciente. Corrige errores tipográficos con aviso en stderr. Consulta la cuenta actual; `in:personal`, `in:bots`, `in:all` o `--source` también incluyen otras cuentas del almacén, incluso `tg`.

## Conversaciones dentro de un grupo

`max conversations` separa conversaciones simultáneas mediante respuestas, menciones y orden de mensajes, sin consultar MAX ni usar IA:

```sh
max conversations build --chat Друзья                  # найти; ещё раз — после того, как скачано больше
max conversations list --chat Друзья --since-time 7d
max conversations show 91                              # один разговор, от старых к новым
max messages links Друзья <id>                         # почему это сообщение там, где оно есть
```

Nada se construye antes de `build`; repetirlo reemplaza el resultado. Descarga antes con `max store fetch`.

Tu agente puede mejorar los enlaces. `max conversations batches status --chat <чат>` muestra mensajes y lotes; `batches next` entrega el siguiente; `conversations links
add --batch <id>` lee la respuesta JSON del agente desde stdin. `conversations links clear` elimina sus respuestas. `max` no llama a un modelo.

### Búsqueda por significado

Una vez construidas, `max` puede buscar conversaciones por tema. `max conversations embed` calcula vectores localmente; `max conversations search` encuentra las más cercanas a tu pregunta:

```sh
max models text download e5-small                       # один раз: 135 МБ, общая папка с tg
max conversations embed --chat Друзья                   # продолжает с места, где остановился
max conversations search "где снять квартиру" --chat Друзья
max conversations search "аренда квартиры"              # во всех чатах, для которых посчитано
```

Nada sale del ordenador. `max conversations embed status --chat <чат>` muestra lo pendiente; `embed clear --chat <чат>` borra vectores. Un servicio externo puede calcularlos con tu clave: `max models text key set openai`, después `--provider openai` en `embed` y `search`. Antes de enviar, `embed` muestra fragmentos, tokens y precio y pide aprobación (`--yes` en scripts).

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
