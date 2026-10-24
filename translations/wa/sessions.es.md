---
title: "Vinculación, dispositivos y perfiles"
---


Abre esta página para vincular `wa` por primera vez, añadir una segunda cuenta o resolver el aviso de `wa` de que un perfil no está vinculado. Aprenderás a vincular el dispositivo, comprobar la cuenta, desconectarlo y encontrar los datos con los que `wa` mantiene el acceso.

> ⚠️ **`wa` es un cliente no oficial de tu cuenta de WhatsApp.** WhatsApp puede bloquear estas cuentas, en particular por envíos masivos o mensajes a desconocidos. `wa` cambia datos solo cuando un comando lo pide, limita los envíos y detiene las escrituras cuando WhatsApp exige reducir el ritmo. No envíes mensajes masivos ni a desconocidos ([límites](./limits.md)).

Primero, las palabras que utiliza esta página:

- **Dispositivo vinculado**: `wa` en esta computadora, tal como lo ve WhatsApp. Lo vincula desde el teléfono, de la misma manera que vincula WhatsApp Web, y el teléfono lo enumera en Configuración → Dispositivos vinculados. Sus claves se encuentran en un archivo en esta computadora. Quien tenga ese archivo puede leerlo y enviarlo como ti, así que trátelo como su contraseña.
- **History push**: la copia de tus chats recientes que el teléfono envía una vez, segundos después de vincularse. `wa` se queda con lo que llega; Los mensajes más antiguos de un chat se pueden solicitar al teléfono más tarde ([historial anterior](./archive.md#older-history-from-your-phone)).
- **Perfil**: un nombre para un dispositivo vinculado en esta computadora, con sus propias claves y configuraciones. Cada comando que usa una cuenta le asigna un nombre, por lo que elige un nombre en la configuración (`wa personal setup`) y lo usa a partir de ese momento ([perfiles](#profiles)).

## Primera ejecución

`wa personal setup` guía una primera ejecución en cinco pasos: las carpetas de esta computadora, el enlace, la cuenta, cinco chats del almacén local y la skill del agente (`--agent codex`, `cursor`, `claude`, `gemini`, `all` o `none`). Espere unos cinco minutos, la mayor parte de ellos dedicados a la historia. Ejecútelo en una terminal. Un perfil vinculado anteriormente se verifica sin vincularse nuevamente y no se pregunta nada. Antes del código QR o el código de emparejamiento, configure y `session start` imprima la advertencia anterior en stderr, una vez por enlace. `wa personal session start` es el comando solo para el enlace.

## Vinculación

```sh
wa personal session start          # a QR code in the terminal
wa personal session start phone    # your number, typed in the terminal, then a code to type on the phone
```

**QR:** escanea el código en WhatsApp en el teléfono: Ajustes → Dispositivos vinculados → Vincular un dispositivo. El código se renueva mientras esperas.**Teléfono:** escribe tu número en formato internacional cuando `wa` te lo solicite. `wa` muestra un código de emparejamiento de ocho caracteres; en el teléfono, abra Configuración → Dispositivos vinculados → Vincular un dispositivo → Vincular con número de teléfono y escríbalo. El número va al motor en su entrada, nunca como argumento, por lo que otros programas en esta computadora no pueden verlo en la lista de procesos.

Inmediatamente después, el teléfono envía su historial. `session start` mantiene abierta la misma conexión, guarda lo que llega a el almacén local y se detiene cuando el teléfono ha estado en silencio durante 45 segundos o con Ctrl+C. Ctrl+C allí, o `--timeout`, finaliza solo esta espera: el dispositivo permanece vinculado, lo que llegó se guarda y cuenta, y el comando finaliza con el código de salida `0`. `wa personal setup` espera de la misma manera, luego continúa con los pasos restantes dentro del límite de tiempo habitual del comando y comienza de nuevo. Luego siga recibiendo con `wa personal server install` ([el almacén local](./archive.md)).

### Cuando un agente ejecuta el enlace

Su agente de IA puede iniciar el enlace por ti. Sin una terminal, `wa` imprime el código QR como texto sin formato y el agente lo pega en el chat para que lo escanees:

```sh
wa personal setup --agent claude --json
wa personal session start qr
```

El agente ejecuta el comando en segundo plano, ya que espera su análisis. WhatsApp envía un nuevo código después de 60 segundos y luego cada 20 segundos; el agente pega cada uno nuevo y dice que el anterior expiró. Con `--json`, cada código también es una línea en stderr: `{"event":"qr","qr":{"text":…,"expires_at":null,"scan":…}}`. El texto tiene aproximadamente 73 columnas de ancho. La vinculación no se ofrece a través de MCP: una aplicación que solo tiene MCP le solicita que ejecute el comando. Un código de emparejamiento es para que lo ejecutes en tu propio terminal: un agente nunca te pide tu número de teléfono ni un código en el chat.

## Comprobar y desvincular

```sh
wa personal account show     # who this profile is linked as; the phone number shows only its last four digits
wa account list              # every profile on this computer, and the account each is linked as
wa personal session end      # unlink the device on WhatsApp's side, and delete its keys here
```

## Cambia tu nombre, información y foto.

```sh
wa personal account update --first-name Ana --last-name Silva   # WhatsApp keeps one name: "Ana Silva"
wa personal account update --description "Back on Monday"       # the "about" line
wa personal account update --photo ~/me.jpg                     # the profile photo, a square JPEG
```

El nombre va al teléfono y a sus otros dispositivos a la vez. Otras personas probablemente lo vean solo la próxima vez que el teléfono se conecte: un dispositivo le dice a WhatsApp su nombre cuando dice que está en línea, y `wa` nunca lo hace (aún no verificado). Es posible que un dispositivo vinculado hace unos minutos aún no tenga las claves de configuración de WhatsApp; Mantén `serve` ejecutándose por un tiempo e inténtelo nuevamente.`wa` toma la foto como un JPEG cuadrado de 190 a 720 píxeles por lado, los lados que toma para un grupo; No se comprueba si WhatsApp toma otros lados de su propia foto. `wa` no convierte ni recorta uno, y su contenido rechaza un PNG o WebP, antes de que algo cambie. En conjunto, primero va el nombre, luego acerca de y luego la foto; si falla uno posterior, el error dice cuál cambió. La eliminación de la foto se realiza en el teléfono.

`wa personal session end` elimina el dispositivo **también del lado de WhatsApp**: desaparece de la lista de dispositivos vinculados del teléfono. Deja el almacén local como está. Mientras `serve` se ejecuta para el perfil, se niega (código de salida `12`): detenga primero `serve` con `wa personal server stop`, o Ctrl+C donde se ejecuta.

## Una conexión por dispositivo

WhatsApp permite una conexión para cada dispositivo vinculado; un segundo hace que WhatsApp abandone el primero. Por lo tanto, un comando `wa` a la vez puede conectar un perfil. `serve`, `watch` y cada comando que se conecta toma primero el bloqueo del dispositivo; se rechaza otro comando para el mismo perfil y nombra al titular:

```text
this WhatsApp login is in use by serve (pid 4242)
```

`serve` es la excepción. Mientras se ejecuta, un comando para el mismo perfil que se conectaría no toma el bloqueo: se ejecuta dentro de `serve`, en la conexión de `serve`. Llega a `serve` a través de un enchufe junto a la cerradura de `serve` (`<state>/serve/<profile>.sock`, modo `0600`, por lo que sólo tu propio usuario puede abrirlo). Esto cubre envíos, ediciones, eliminaciones, reacciones, marcas de lectura, descargas, comandos de grupos y personas, `watch`, `doctor --online` y el servidor MCP `wa <profile> mcp`. La protección de envío y los permisos del perfil aún se aplican. Un comando ejecutado de esta manera nunca pregunta: una escritura en el nivel de permiso `ask` necesita `--yes` (`--allow-dangerous` para una eliminación), o se rechaza y lo dice.- **No a través de `serve`:** vinculación y desvinculación (`session start`, `session end`, `setup`) y `mcp --http`.
  `chats list` y `chats show` leen el almacén local, por lo que nunca se conectan. Las ejecuciones `--offline` y `--dry-run` no se conectan en absoluto.
- **`serve` está iniciando o no responde:** el comando falla. Nunca abre una segunda conexión.
- **`wa` se actualizó y `serve` no se reinició:** el comando se ejecuta dentro del `serve` anterior, con su código. Cuando los dos hablan diferentes versiones de relé, el comando se rechaza y dice que se reinicie `serve`. `wa upgrade` reinicia los servidores en ejecución; de lo contrario utilice `wa <profile> server restart`.
- **Windows:** los comandos no pasan por `serve`. Mientras se ejecuta `serve`, un comando que se conecta se rechaza como se indicó anteriormente, con el código de salida 12.

Sin ningún `serve` en ejecución, cada comando se conecta por sí solo. Mientras uno de ellos sostiene el dispositivo, o `wa personal mcp`, que mantiene su conexión durante dos minutos después de una llamada, `serve` no puede iniciarse. Las lecturas nunca se conectan, por lo que funcionan junto a cualquiera de ellas.

## ¿Cuánto tiempo dura un enlace?

Hasta finalizar: por `wa personal session end`, desde la lista de dispositivos vinculados del teléfono, o por el propio WhatsApp. El teléfono debe conectarse de vez en cuando, o WhatsApp cerrará la sesión de sus dispositivos vinculados. Cuando se eliminó el dispositivo, cada comando que se conecta lo dice con el código de salida `4`; vuelve a vincular con `wa personal session start` ([WhatsApp cerró la sesión de este dispositivo](./troubleshooting.md#whatsapp-logged-this-device-out)).

## Perfiles

Un perfil es un dispositivo vinculado independiente: sus propias claves, configuraciones, destinatarios y ejecuciones. Se nombra con **la primera palabra**, no con una opción:

```sh
wa personal chats list     # profile "personal"
wa work chats list         # profile "work"
export WA_PROFILE=work     # the same for the whole shell session
```

**La primera palabra es el perfil cuando no es un comando.** Por lo tanto, un perfil no puede llamarse `chats`, `messages` ni ninguna otra palabra de comando. Los nombres son letras, dígitos, punto, guión y guión bajo, y comienzan con una letra o un dígito.

Se utiliza la primera coincidencia en este orden: la primera palabra, luego `WA_PROFILE`. Sin ninguno de los dos, un comando que usa una cuenta se detiene con el código de salida `2` y enumera los perfiles en esta computadora. `wa` nunca elige uno, ni siquiera el único. Los comandos que no utilizan ninguna cuenta se ejecutan sin un perfil: `--help`, `--version`, `commands`, `skill show`, `account list` y `config show`.

**`WA_PROFILE_LOCK` fija un proceso a un perfil.** Configúrelo donde se ejecuta un agente y se rechaza una primera palabra o `WA_PROFILE` que nombre cualquier otro perfil (código de salida `5`). Sin él, un agente podría elegir un perfil con menos límites.

Para qué sirve cada perfil: [perfiles](./profiles.md).

## Dónde se guardan las piezas

| Qué | Dónde |
|---|---|
| las claves del dispositivo | `~/.local/share/whatsapp-cli/profiles/<profile>/private.db`, legible sólo por su usuario |
| quién tiene la única conexión | `private.db.lock` al lado |
| chats y mensajes | el almacén local de WireCat que comparte cada CLI de WireCat, `~/.local/share/WireCat/wirecat.db` |
| configuración | `~/.config/whatsapp-cli/config.json`; nunca es un secreto |

`WA_CONFIG_DIR`, `WA_STATE_DIR` y `WA_CACHE_DIR` mueven las tres carpetas ([referencia de configuración](configuration-reference.md)).

## Siguiente

- [Lee tus primeros chats](./usage.md)
- [Configuraciones y el orden en que se resuelven](./configuration.md)
- [Lo que llega al disco, y lo que nunca llega](./security.md)
