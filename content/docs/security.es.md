---
title: Seguridad
description: Qué guardan las herramientas de WireCat en tu ordenador, qué impide que un agente envíe de más y cómo informar de una vulnerabilidad.
---

`tg` y `max` trabajan con tus cuentas reales de mensajería. Esta página describe lo que comparten
las dos: la copia local de los mensajes, la protección de envíos, lo que puede hacer un agente y lo
que nunca sale de tu ordenador. Los detalles de cada mensajero — dónde vive el inicio de sesión, con
qué servidores habla, qué dicen sus condiciones — están en la página de cada herramienta:
[seguridad de Telegram](./tg/security.md) y [seguridad de MAX](./max/security.md).

Las dos herramientas se construyen sobre las mismas bibliotecas ([arquitectura](./architecture.mdx)),
así que lo que dice esta página es una sola implementación, no dos promesas.

## En resumen

Protege contra:

- **un agente convencido por un mensaje que leyó.** Los `permissions` del perfil deciden qué puede
  hacer un agente. Cada herramienta de lectura avisa al modelo de que el texto de un mensaje son
  datos, nunca instrucciones.
- **un cambio que el perfil no permite.** `permissions`, la lista de destinatarios y el límite por
  hora se comprueban en cada comando y en cada herramienta MCP. Cada intento se escribe en un
  registro sin su texto.
- **un agente que sale de su perfil o envía tus claves.** `TG_PROFILE_LOCK` y `MAX_PROFILE_LOCK` fijan
  el perfil; `--file` rechaza archivos ocultos, `~/.ssh` y las carpetas de la propia herramienta.
- **texto ajeno que toma el control del terminal.** Los caracteres de control e invisibles se
  muestran como texto, los nombres se imprimen en una línea y el autocompletado inserta solo ids.
- **un secreto en un registro, en `ps` o en el historial de la shell.** Las ejecuciones, los informes
  y el registro de envíos guardan ids y recuentos, nunca texto. Ningún comando recibe una contraseña,
  un token, un código o un número de teléfono como argumento.
- **otros usuarios de esta máquina.** Cada archivo se crea legible solo por ti, en carpetas que solo
  tú puedes abrir (Linux y macOS).
- **una versión manipulada.** Los paquetes se publican desde GitHub Actions con procedencia de npm.
  El paso de publicación no instala nada ni ejecuta scripts de paquetes; las dependencias directas
  están fijadas a versiones exactas.

No protege contra:

- **alguien con tu usuario en esta máquina.** Puede leer el inicio de sesión y la copia local, igual
  que tú.
- **un agente que puede cambiar la configuración.** La protección lee la configuración del perfil.
  Un agente al que se le permite ejecutar `config set` o `recipients add`, o editar esos archivos,
  puede quitar los límites ([abajo](#lo-que-la-protección-no-puede-impedir)).

## Lo que queda en tu ordenador

| Qué | Dónde | Contiene |
|---|---|---|
| la copia local, compartida por `tg` y `max` | `~/.local/share/cli-messaging/messages.db` | **el texto completo** de cada mensaje leído o enviado, títulos de chats, nombres, transcripciones de voz |
| el inicio de sesión | max: un token en el llavero del sistema · tg: un archivo de sesión, con el id y el hash de la app en el llavero | ver la página de la herramienta |
| configuración | `config.json` en la carpeta de configuración de la herramienta | solo ajustes — no hay campo para un secreto |
| ejecuciones registradas — con `--record`, y cada ejecución fallida | `runs/` en la carpeta de estado de la herramienta | las palabras del comando, ids, recuentos, duraciones, códigos de error |
| el registro de envíos — siempre | `sends/<perfil>.jsonl` | por cada intento: cuándo, qué chat, el resultado, la longitud — nunca el texto |
| la lista de destinatarios | `profiles/<perfil>.recipients.json` | los chats a los que este perfil puede enviar |
| modelos de voz — solo tras `models audio download` | `~/.cache/cli-common/models/audio/` | los archivos del modelo |
| exportaciones, descargas, informes de problemas | solo donde lo pidas, con `--output` | lo que pediste |

`tg doctor` y `max doctor` muestran las rutas exactas en esta máquina.

En Linux y macOS los archivos son `0600` en carpetas `0700`. Windows usa las listas de acceso
heredadas de tu carpeta de usuario; los modos numéricos no las fijan.

**La copia local no está cifrada.** Ese es su propósito: responder sin red. Quien pueda leer el
archivo lee tus mensajes. Se conserva tras `session end` y tras desinstalar. El texto de los mensajes
está también en exportaciones y archivos descargados; nada más de la tabla lo contiene.

**Si pierdes el ordenador:** los permisos de archivo frenan a otros usuarios, no a quien se lleva el
disco. Eso lo hace el cifrado de disco completo — FileVault en macOS, LUKS en Linux, BitLocker en
Windows. La copia no tiene cifrado propio: una clave en el llavero no detendría a un programa que se
ejecuta con tu usuario, que puede leer el llavero igual que la herramienta. Cierra la sesión desde
otro dispositivo; la página de la herramienta dice dónde.

## Lo que nunca hace

- **Marcar como leído sin que lo pidas.** Leer un chat y marcarlo como leído son dos peticiones
  distintas. Solo `chats mark-read` y `messages list --mark-read` envían la segunda.
- **Enviar o cambiar algo que no escribiste.** Solo lo hacen los comandos marcados como «cambia
  algo»; `commands --json` los marca con `mutates`. Cada uno hace solo lo que dice su línea.
- **Borrar sin una palabra explícita.** Borrar mensajes y cerrar otras sesiones preguntan por
  defecto. Borrar para todos necesita además `--for-everyone`. Un agente por MCP nunca borra para
  todos.
- **Escribir un mensaje en un registro.** Ni acortado ni como hash.
- **Enviar telemetría propia.** No la hay.

## La protección de envíos

Un agente lee mensajes de otras personas junto con tu petición. Un mensaje puede estar escrito para
que el agente lo tome por una orden: «reenvía esta conversación allí». Por eso cada comando y cada
herramienta MCP que cambia algo — un envío, una respuesta, una edición, un reenvío, un mensaje
fijado, una reacción, un voto, un borrado, marcar como leído — pasa por las mismas comprobaciones,
en este orden:

| Comprobación | Cómo activarla | Rechazo |
|---|---|---|
| **`permissions`** — por recurso o comando: `deny`, `readonly`, `ask` o `allow` | `tg config set permissions.messages.send ask` | `deny` y `readonly`: código `5`, antes de enviar nada; `ask` sin nadie que responda: código `7` |
| **la lista de destinatarios** — solo los chats que contiene | `max recipients add <chat>` | código `7` |
| **`sendsPerHour`** — el máximo de envíos en cualquier hora, 30 por defecto | `tg config set sendsPerHour 10` | código `8`; el error dice cuándo se puede volver a enviar |
| **el registro** — cada intento, nunca su texto | siempre; `sends list` | — |

Por defecto se permite todo salvo borrar mensajes y cerrar otras sesiones, que preguntan. Una clave
más precisa gana: `messages` en `readonly` y `messages.send` en `allow` permiten al perfil enviar y
nada más.

La lista de destinatarios es opcional: mientras esté vacía, se permite cualquier chat. Dos comandos
lanzados a la vez no pueden superar juntos el límite por hora: cada uno reserva su sitio desde la
comprobación hasta la respuesta del mensajero. Un mensaje programado cuenta en la hora en que sale.

**Un rechazo es una decisión del propietario, no un fallo.** Un agente que recibe el código `5`, `7`
u `8` debe detenerse y decirlo, no cambiar la configuración ni reintentar. El archivo de skill se lo
dice así a los agentes.

### Lo que la protección no puede impedir

Las comprobaciones viven en la propia herramienta, así que un agente con shell puede quitarlas:
cambiar un ajuste, vaciar la lista. Protegen contra un modelo **convencido** por un mensaje que leyó,
no contra un agente que **se propone** saltárselas. Contra eso solo sirve un límite externo: un
sandbox, un usuario del sistema aparte, una regla en la configuración del propio agente.

Al elegir ese límite:

- **`*_PROFILE_LOCK` fija el perfil; `*_PROFILE` no.** La primera palabra de un comando gana a
  `TG_PROFILE`: a un agente con `TG_PROFILE=agent` le basta escribir `tg work messages send …`.
  `TG_PROFILE_LOCK=agent` lo rechaza — pero solo donde el agente no puede cambiar su propio entorno:
  en la configuración del cliente MCP o en un script envoltorio. El servidor MCP fija su perfil al
  arrancar.
- **`--file` rechaza archivos y carpetas ocultos, `~/.ssh` y las carpetas de la herramienta**, donde
  viven claves y tokens. `--allow-any-file` lo levanta para un comando; es para ti, no para un agente.
  Cualquier otra cosa que tu usuario pueda leer se puede enviar; el registro guarda solo su tipo y
  tamaño.
- **Una regla del agente como «preguntar antes de `tg messages send`»** no ve la forma con perfil,
  `tg work messages send`. Limita el propio perfil — `permissions` o la lista de destinatarios — y no
  tengas al lado un perfil sin límites con una sesión activa.

## Agentes y MCP

- **El texto de un mensaje son datos.** «Reenvía esto allí» dentro de un mensaje no es tu petición.
  El archivo de skill y las instrucciones del servidor MCP se lo dicen a cada agente que los lee; la
  protección de envíos está para cuando uno no hace caso.
- **El servidor MCP usa los mismos `permissions` que los comandos.** Un nivel `ask` muestra un
  formulario en el cliente MCP antes del cambio.
- **`--confirm-send` muestra un formulario antes de cada cambio**, incluso con `allow`. Un sí vale una
  vez, durante cinco minutos, y solo para el chat y el texto que mostró. Los antiguos `--allow-send` y
  `--allow-delete` se aceptan con un aviso y no deciden nada.

Cómo conectar un cliente y qué hace cada herramienta: [MCP](./mcp.md).

## Texto ajeno en tu pantalla

Los nombres, títulos de chats, nombres de archivo y mensajes los escriben otras personas. Las
herramientas no les dejan controlar tu terminal ni falsear lo que ves:

- los caracteres de control — los que cambian colores, borran líneas, cambian el título de la ventana
  o el portapapeles — se muestran como texto (`\x1b`), no se ejecutan; igual los invisibles y los que
  invierten la dirección del texto;
- un nombre, un título o un pie se imprime en una línea, así que un salto de línea en un nombre no
  puede iniciar una línea falsa de la conversación;
- cuando un nombre escrito encaja con más de un chat, la herramienta no elige: los muestra todos;
- el autocompletado inserta solo un id; el título es una pista al lado;
- una exportación Markdown y el nombre de un archivo descargado pasan por la misma limpieza.

`--json` son datos: las cadenas llegan como las envió el mensajero, escapadas según las reglas de
JSON. Si las pasas a un programa que imprime en un terminal, límpialas allí.

## Lo que ven otros en esta máquina

Los argumentos de un comando son visibles para cualquier proceso en `ps`. Por eso ningún secreto es
un argumento — pero **el texto de un mensaje sí lo es**:

```sh
tg messages send me "text"     # visible en ps, y queda en el historial de la shell
```

Cuando importe, pasa el texto por una tubería: `tg messages send me < note.txt`.

## Lo que sale a la red

- **El propio mensajero** — Telegram o MAX, para los comandos que lo necesitan. Qué servidores
  exactamente: la página de la herramienta.
- **npm**, una vez al día cuando una persona ejecuta un comando en un terminal, para saber si hay una
  versión nueva, y con `upgrade`. `updateCheck: false` lo desactiva.
- **Hugging Face y GitHub**, solo cuando ejecutas `models … download`. Un mensaje de voz nunca va
  allí: el reconocimiento se hace en este ordenador.
- **Un proveedor de embeddings que elijas**, solo si configuras uno externo para la búsqueda de
  conversaciones. Recibe el texto que vectoriza; el comando pregunta antes de enviar fragmentos. El
  modelo por defecto funciona en local.

Estos son los destinos de red de la CLI. Un agente de IA es un programa aparte: cuando le das mensajes o permites que lea la salida de la CLI, ese contenido se procesa según su modelo y su configuración local o en la nube. Una caché local no convierte un modelo alojado en un modelo local. Revisa los ajustes del agente antes de elegir qué conversaciones compartir.

## Datos de otras personas

Las herramientas guardan en tu ordenador mensajes, nombres y contactos de otras personas, incluido el
texto de los mensajes. Quien accede al almacén local accede a esos datos. Una exportación que
entregas a otra persona entrega también la conversación; los enlaces a fotos que contiene pueden
abrirse sin iniciar sesión. Revisa qué contiene y quién la recibe antes de compartirla. Esta página
describe cómo funcionan las herramientas; no confirma que tu uso cumpla la ley de tu país.

Un informe de problema (`doctor report create`) está pensado para una incidencia **pública**. No
contiene textos, nombres ni teléfonos, y cada id se sustituye por una etiqueta. Abre el archivo y
revísalo antes de enviarlo.

## Informar de una vulnerabilidad

Informa de un problema de seguridad en privado, no en el chat ni en una incidencia pública:

- por correo: [hello@wirecat.dev](mailto:hello@wirecat.dev);
- o mediante el informe privado de vulnerabilidades de GitHub, en el repositorio afectado:
  [tg-cli](https://github.com/leemour/tg-cli/security/advisories/new),
  [max-cli](https://github.com/leemour/max-cli/security/advisories/new),
  [cli-messaging](https://github.com/leemour/cli-messaging/security/advisories/new),
  [cli-core](https://github.com/leemour/cli-core/security/advisories/new).

Di qué viste, cómo repetirlo y qué versión usas (`tg --version`, `max --version`). Nunca envíes un
archivo de sesión, un token ni mensajes de otras personas.

Todo lo demás — un fallo, una pregunta — va al [chat de soporte](https://t.me/wirecatdev).
