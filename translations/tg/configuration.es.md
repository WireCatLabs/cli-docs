---
title: "Configuración"
---

<a id="el-archivo" />
<a id="una-pequeña-configuración" />
<a id="qué-puedo-configurar" />
<a id="the-file" />
<a id="a-small-configuration" />
<a id="what-can-i-configure" />

Utilice esta página cuando escriba la misma opción una y otra vez, o cuando desee que `tg` se comporte de manera diferente para una cuenta. Al final sabrá dónde está el archivo de configuración, qué hacen las configuraciones comunes, cómo cambiar una y cómo verificar qué valor está vigente. No necesita un archivo de configuración para comenzar: sin uno, cada configuración tiene un valor incorporado.

Algunas palabras que utiliza esta página:

- **Archivo de configuración** (`config.json`): un archivo de texto donde `tg` guarda sus opciones guardadas.
- **Perfil**: un conjunto de configuraciones con nombre para una cuenta de Telegram o un bot, como `work`. Pones su nombre antes del comando: `tg work chats list`. Consulte [perfiles y bots](./profiles.md).
- **Opción** (o bandera): una palabra agregada a un comando, como `--limit 5`. Sólo cambia esa ejecución.
- **Variable de entorno**: un valor con nombre que su terminal o el proceso de su agente le da a `tg`, como por ejemplo `TG_PROFILE=work`.
- **Predeterminado**: el valor que utiliza `tg` cuando nada más establece uno.

## Lo que puedes configurar

Éstas son las configuraciones que la mayoría de la gente cambia. Cada uno tiene una entrada exacta, con su tipo y todas las formas de anularlo, en la [referencia de configuración](./configuration-reference.md#the-file).

| Configuración | Qué hace | Valor incorporado |
|---|---|---|
| `limit` | cuántas filas muestra una lista cuando no agrega `--limit` | `20` |
| `sendsPerHour` | la mayor cantidad de mensajes que este perfil puede enviar en una hora; detiene un bucle de envío | `30`; un bot no tiene límite hasta que se establezca uno en la sección `bot` |
| `requestsPerMinute` | qué tan rápido `tg` le pide cosas a Telegram después de una breve ráfaga; `0` apaga el ritmo ([límites y esperas](./limits.md)) | `60` |
| `permissions` | qué puede hacer este perfil: solo lectura, preguntar primero o seguir adelante ([permisos](./permissions.md)) | todo está permitido, excepto: eliminar y algunos otros cambios que no se pueden deshacer, pregunte primero; las reglas de respuesta pueden no enviarse |
| `record` | mantenga un registro de cada ejecución para verlo más tarde ([diagnóstico](./diagnostics.md)) | `false` |
| `keepRunsForDays` | Días de conservación de los registros | `30` |
| `color` | color en tablas | lo decide tu terminal |
| `senderColors` | un color diferente para cada remitente en una lista de mensajes | `false` |
| `timeoutMs` | cuánto tiempo puede esperar **una** solicitud a Telegram, en milisegundos. Para limitar un comando completo, use `--timeout` en su lugar | la propia espera de la conexión |
| `catchUpMarksRead` | `inbox` y `review` marcan los chats que muestran como leídos. La otra persona lo ve | `false` |
| `proxy` | un servidor proxy para acceder a Telegram, donde está bloqueado ([configuración de proxy](./configuration-reference.md#through-a-proxy)) | ninguno |
| `transcribeWith` | quién convierte mensajes de voz en texto: `auto`, `messenger` o `local` | `auto` |
| `updateCheck` | una vez al día, avise cuando exista un `tg` más nuevo | `true` |
| `defaultProfile` | qué perfil utiliza un comando cuando no nombras uno | `default` |

El archivo no guarda secretos. No tiene lugar para su sesión, el hash de la aplicación, un número de teléfono o una contraseña de proxy. La sesión es un archivo propio y el hash de la aplicación y una contraseña de proxy van al llavero de su sistema o, cuando no hay ninguno, a un archivo que solo usted puede leer ([donde reside el inicio de sesión](./security.md#where-the-login-lives)).

## Un archivo de configuración de ejemplo

El primer comando que lee la configuración crea un archivo de inicio. Se ve así, con un perfil agregado:

```json
{
  "defaults": { "limit": 20, "keepRunsForDays": 30, "sendsPerHour": 30, "updateCheck": true, "skillHint": true },
  "profiles": {
    "work": { "limit": 50 }
  }
}
```

- `defaults` se aplica a todos los perfiles.
- `profiles.work` se aplica sólo al perfil `work` y gana a `defaults`.

Entonces, `tg work chats list` muestra 50 filas y `tg chats list` muestra 20. Agregue `--limit 5` para obtener cinco para un comando. Elimine el `limit` del perfil y el valor de `defaults` se aplicará nuevamente.

<details> <summary>Un ejemplo completo con cada sección</summary>

```json
{
  "defaultProfile": "personal",
  "defaults": {
    "limit": 20,
    "keepRunsForDays": 14,
    "sendsPerHour": 30,
    "requestsPerMinute": 60,
    "updateCheck": true,
    "skillHint": true
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
      "proxy": "socks5://proxy.example:1080",
      "transcribeWith": "local"
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

- `defaultProfile`: `tg chats list` sin nombre de perfil utiliza `personal`.
- `defaults`: cada perfil obtiene estos valores a menos que establezca los suyos propios. `updateCheck` y `skillHint` solo se permiten aquí, porque hay una copia de `tg` para todos los perfiles.
- `profiles.personal`: más filas, colores y un registro de cada ejecución, sólo para `personal`.
- `profiles.work`: se permite la lectura de mensajes, se permite el envío, se rechaza cualquier otro cambio en los mensajes. Como máximo 10 envíos por hora. Se accede a Telegram a través de un proxy SOCKS5. Los mensajes de voz se convierten en texto en esta computadora.
- `personal.defaults`: aplica sólo a comandos para cuentas personales, nunca a `tg … bot`.   Aquí, `store fetch` también prepara chats recuperados para la búsqueda.
- `bot.defaults`: aplica solo a comandos de bot (`tg shop bot …`). Los bots pueden leer y enviar, y nada más.
- `bot.profiles.shop`: el bot `shop` puede enviar 200 mensajes por hora y no puede leer lo que guardaron otros bots en este ordenador. `readOtherBots` está permitido sólo en la sección `bot`.

</details>

## Dónde está el archivo

| Sistema | Camino |
|---|---|
| Linux | `~/.config/tg-cli/config.json` |
| macOS | `~/Library/Preferences/tg-cli/config.json` |
| Windows | `%APPDATA%\tg-cli\Config\config.json` |

`tg config show` imprime la ruta que realmente usa esta computadora y cada configuración con su valor. En PowerShell, escriba `tg.cmd` en lugar de `tg`. Un archivo existente nunca es reemplazado por el archivo inicial.

## Tres formas de establecer un valor

- **En el archivo:** el valor permanece para comandos posteriores. `tg config set limit 50` lo guarda.
- **Con una variable de entorno:** el valor es válido para un terminal o un proceso de agente.   Por ejemplo, `TG_PROFILE` elige un perfil y `TG_TIMEOUT` limita cuánto tiempo se puede ejecutar un comando.   Sólo algunas configuraciones tienen una variable.
- **Con una opción:** `--limit 5` cambia solo este comando.

## ¿Qué valor tiene prioridad?

Una opción gana a una variable de entorno. Luego viene el valor propio del perfil en el archivo, luego `defaults` en el archivo y luego el valor integrado. Un ajuste participa sólo en las formas en que lo apoya; la [referencia de configuración](./configuration-reference.md#which-value-wins) los enumera para cada configuración.

## Cambiar un valor

Puede editar el archivo en cualquier editor de texto o dejar que `tg` lo haga. `config set` comprueba el valor antes de escribirlo, por lo que nunca guarda un archivo que un comando posterior rechace.

```sh
tg config set limit 50                 # the profile you use now
tg work config set limit 50            # the profile "work"
tg config set sendsPerHour 10 --defaults   # every profile
tg config unset limit                  # back to the default
tg config show                         # check what is in force, and where each value came from
```

Una configuración mal escrita en el archivo es un error, no un valor predeterminado silencioso: cada comando se detiene y nombra la clave incorrecta ([errores tipográficos en el archivo](./configuration-reference.md#a-typo-is-an-error-not-a-default)).

## Perfiles y bots

Un perfil mantiene la configuración para una cuenta o un bot. Coloque su nombre antes del comando, como `tg work config show`. Agregue `bot` después del nombre para que funcione como un bot en lugar de como su cuenta personal. [Perfiles y bots](./profiles.md) explica cómo crearlos y cambiarlos.

## Próximo

- [Permisos](./permissions.md): elige lo que puede hacer un perfil y el agente que lo utiliza.
- [Referencia de configuración](./configuration-reference.md): cada configuración, su tipo, dónde puede aparecer y cada variable de entorno.
