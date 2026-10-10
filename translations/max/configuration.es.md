---
title: "Configuración"
---

<a id="archivo" />
<a id="ejemplo-breve" />
<a id="qué-puedes-configurar" />
<a id="файл" />
<a id="короткий-пример" />

Esta página es necesaria cuando escribe el mismo parámetro una y otra vez o desea que `max` se comporte de manera diferente para una cuenta. Después de leerlo, sabrá dónde está el archivo de configuración, qué hacen las configuraciones principales, cómo cambiar una de ellas y cómo verificar qué valor está vigente. No necesita un archivo para comenzar: sin uno, cada configuración tiene un valor incorporado.

Palabras que aparecen en la página:

- **Archivo de configuración** (`config.json`): un archivo de texto en el que `max` almacena sus selecciones guardadas.
- **Perfil** es un conjunto de configuraciones con nombre para una cuenta MAX o un bot, por ejemplo `work`. Su nombre se coloca antes del comando: `max work chats list`. Ver [perfiles y bots](./profiles.md).
- **Parámetro** (bandera): una palabra agregada a un comando, por ejemplo `--limit 5`. Sólo cambia este ejecución.
- **Variable de entorno** es un valor con nombre que el proceso del terminal o agente pasa a `max`, por ejemplo `MAX_PROFILE=work`.

## ¿Qué se puede configurar?

Estas son las configuraciones que se cambian con más frecuencia. Una descripción exacta de cada tipo y todos los métodos de anulación en [referencia de configuración](./configuration-reference.md#файл).

|Ajustes|¿Qué hace?|Valor incorporado|
|---|---|---|
| `limit` |¿Cuántas líneas muestra la lista si no se especifica `--limit`?| `20` |
| `sendsPerHour` |cuántos mensajes puede enviar un perfil en una hora; detiene el ciclo de envío|`30`; el bot no tiene límite hasta que se especifica en la sección `bot`|
| `requestsPerMinute` |¿Con qué frecuencia accede `max` a MAX después de una breve serie de solicitudes? `0` apaga el tempo ([limitaciones y expectativas](./limits.md))| `20` |
| `permissions` |qué puede hacer el perfil: sólo leer, preguntar antes de cambiar o hacer sin preguntar ([permisos](./permissions.md))|todo está permitido excepto: primero se solicita la eliminación y algunos cambios irreversibles más; las respuestas automáticas no se envían|
| `record` |registrar cada ejecución para verlo más tarde ([diagnóstico](./diagnostics.md))| `false` |
| `keepRunsForDays` |¿Cuántos días se almacenan los registros de ejecución?| `30` |
| `color` |color en tablas|por terminal|
| `senderColors` |Cada autor tiene un color diferente en la lista de mensajes.| `false` |
| `timeoutMs` |cuánto tiempo esperar una respuesta a **una** solicitud a MAX, en milisegundos. Para restringir todo el comando, use `--timeout`|en transporte|
| `catchUpMarksRead` |`inbox` y `review` marcan los chats mostrados como leídos. El interlocutor ve esto.| `false` |
| `serve` |ejecute el servidor en segundo plano `max serve` cuando el comando necesite MAX ([una entrada para todos los](./limits.md#один-вход-на-всё))| `true` |
| `transcribeModel` |qué modelo reconocer mensajes de voz| `gigaam-v3` |
| `updateCheck` |una vez al día para informar que se ha lanzado una nueva versión de `max`| `true` |
| `defaultProfile` |¿Qué perfil toma el comando si el perfil no se nombra?| `default` |

No hay ningún secreto en un archivo. No hay lugar en él para un token, un número de teléfono o una identificación de chat: el token se almacena en el llavero del sistema y, donde no está, en un archivo que solo usted puede leer ([donde vive token](./security.md#где-живёт-токен)).

## Archivo de configuración de ejemplo

El primer comando que lee la configuración creal archivo inicial. Aquí está, con un perfil agregado:

```json
{
  "defaults": { "limit": 20, "keepRunsForDays": 30, "sendsPerHour": 30, "updateCheck": true, "skillHint": true },
  "profiles": {
    "work": { "limit": 50 }
  }
}
```

- `defaults` es válido para todos los perfiles.
- `profiles.work` es válido sólo para el perfil `work` y es más importante que `defaults`.

Por lo tanto, `max work chats list` mostrará 50 líneas y `max chats list` mostrará 20. Agregue `--limit 5` para obtener cinco líneas en un comando. Elimine `limit` del perfil y el valor de `defaults` volverá a ser válido.

<details> <summary>Ejemplo completo con todas las secciones</summary>

```json
{
  "defaultProfile": "personal",
  "defaults": {
    "limit": 20,
    "keepRunsForDays": 14,
    "sendsPerHour": 30,
    "requestsPerMinute": 20,
    "updateCheck": true,
    "skillHint": true,
    "transcribeModel": "gigaam-v3"
  },
  "profiles": {
    "personal": {
      "limit": 50,
      "color": true,
      "senderColors": true,
      "record": true
    },
    "work": {
      "permissions": { "messages": "readonly", "messages.send": "allow" },
      "sendsPerHour": 10,
      "serve": false
    }
  },
  "personal": {
    "defaults": { "catchUpMarksRead": false, "searchCatchUp": true }
  },
  "bot": {
    "defaults": { "permissions": { "bot": "readonly", "bot.messages.send": "allow" } },
    "profiles": {
      "shop": { "sendsPerHour": 200, "readOtherBots": false }
    }
  }
}
```

Qué hace cada parte:

- `defaultProfile`: `max chats list` sin nombre de perfil funciona con `personal`.
- `defaults`: cada perfil recibe estos valores si no ha especificado los suyos propios. `updateCheck`, `skillHint` y `transcribeModel` sólo son válidos aquí: el programa y los modelos de voz son los mismos para todos los perfiles.
- `profiles.personal`: más líneas, colores y grabación de cada ejecución - sólo para `personal`.
- `profiles.work`: se pueden leer mensajes, se pueden enviar mensajes, se prohíben otros cambios en los mensajes. No más de 10 envíos por hora. El servidor en segundo plano no se inicia: cada comando ingresa MAX.
- `personal.defaults`: sólo para comandos de cuentas personales, nunca para `max … bot`. Aquí `store fetch` también prepara chats descargados para búsqueda.
- `bot.defaults`: sólo para comandos de bot (`max shop bot …`). Los bots pueden leer y enviar, y nada más.
- `bot.profiles.shop`: El bot `shop` puede enviar 200 mensajes por hora y no lee lo que otros bots en esta computadora han guardado. `readOtherBots` sólo es válido en la sección `bot`; Allí, por el contrario, no se aceptan `serve`, `senderColors` y `catchUpMarksRead`.

</details>

## ¿Dónde está el archivo?

|Sistema|Camino|
|---|---|
| Linux | `~/.config/max-cli/config.json` |
| macOS | `~/Library/Preferences/max-cli/config.json` |
| Windows | `%APPDATA%\max-cli\Config\config.json` |

`max config show` imprime la ruta que esta computadora realmente usa y cada configuración con un valor. En PowerShell, escriba `max.cmd` en lugar de `max`. Un archivo existente nunca se reemplaza por el inicial.

## Tres formas de establecer un valor

- **En archivo:** el valor se guardará para los siguientes comandos. `max config set limit 50` lo anota.
- **Variable de entorno:** el valor es válido en un terminal o en un proceso de agente. Por ejemplo, `MAX_PROFILE` selecciona el perfil y `MAX_TIMEOUT` limita el tiempo del comando. No todas las configuraciones tienen una variable.
- **Parámetro:** `--limit 5` cambia solo este comando.

## ¿Qué valor tiene prioridad?

El parámetro es más importante que la variable de entorno. Luego viene el valor del perfil en el archivo, luego `defaults` en el archivo y luego el valor integrado. La configuración está involucrada sólo en los métodos que admite; [la referencia de configuración](./configuration-reference.md#какое-значение-побеждает) las enumera para cada configuración.

## Cambiar valor

El archivo se puede editar en cualquier editor de texto o confiar a `max`. `config set` verifica el valor antes de escribir, por lo que nunca guarda un archivo que el siguiente comando descartará.

```sh
max config set limit 50                 # профилю, с которым вы работаете
max work config set limit 50            # профилю work
max config set sendsPerHour 10 --defaults   # всем профилям
max config unset limit                  # вернуть значение по умолчанию
max config show                         # проверить, что действует и откуда взялось каждое значение
```

Un error tipográfico en el nombre de una configuración es un error, no el valor predeterminado silencioso: cada comando se detiene y nombra la clave incorrecta ([errores tipográficos en el archivo](./configuration-reference.md#опечатка--это-ошибка-а-не-умолчание)).

## Perfiles y bots

Un perfil almacena la configuración de una cuenta o un bot. Su nombre se coloca antes del comando, por ejemplo `max work config show`. Para trabajar como un bot en lugar de una cuenta personal, agregue `bot` después del nombre. Cómo crear perfiles y cambiar entre ellos se explica en la página [perfiles y bots](./profiles.md).

<a id="права-доступа" />

## Más

- [Permisos](./permissions.md): decide qué se permite para el perfil y el agente que trabaja con él.
- [Directorio de configuración](./configuration-reference.md): cada configuración, su tipo, dónde es válida y todas las variables de entorno.
- [Modelos externos](./external-models.md): proveedores, claves y selección de modelo para reconocimiento de texto en imágenes (OCR).
