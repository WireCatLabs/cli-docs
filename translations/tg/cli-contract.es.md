---
title: "Cómo se comporta tg en los scripts"
---

<a id="ejecución-sin-interacción-y-límites" />
<a id="resultados-compactos-y-descubrimiento" />
<a id="vistas-previas-y-seguridad-al-reintentar" />
<a id="cómo-se-comprueba-al-agente" />
<a id="referencias" />
<a id="nombres-ambiguos" />
<a id="headless-execution-and-limits" />
<a id="compact-results-and-discovery" />
<a id="previews-and-retry-safety" />
<a id="how-agent-behavior-is-checked" />
<a id="references" />
<a id="ambiguous-names" />

Esta página es para usted cuando otro programa ejecuta `tg`: un script de shell, un trabajo programado o un agente de IA que llama comandos en una terminal. Describe las reglas que sigue cada comando, para que el programa pueda leer el resultado, reconocer un error y saber cuándo es seguro volver a intentarlo.

Después de leerlo, puede obtener JSON exacto de cualquier comando, mantenerlo pequeño, ejecutar comandos sin preguntas y manejar un envío cuyo resultado se desconoce.

Algunos términos que utiliza la página:

- **stdout** y **stderr** son los dos flujos de salida de un comando. stdout lleva el resultado;   stderr transporta mensajes sobre la ejecución, como advertencias y errores.
- **Código de salida** es el número que devuelve un comando cuando finaliza. `0` significa éxito; cualquier otro número indica el tipo de falla.
- El **modo máquina** se genera como JSON para un programa, en lugar de texto para una persona.
- **Comando de una sola vez** hace una cosa y sale, por ejemplo `tg messages list`. Un **comando persistente** sigue ejecutándose hasta que lo detienes: `watch`, `serve` y `mcp`.
- **Escribir** es cualquier comando que cambia algo en Telegram: envía, edita, elimina o marca como leído.

## En qué puedes confiar

| Necesitas | Lo que da tg |
|---|---|
| Un resultado que un programa puede analizar | `--json` o `--jsonl`; JSON se elige automáticamente en una tubería |
| Para distinguir el éxito del fracaso | Códigos de salida y un objeto de error JSON en stderr |
| Sin preguntas en mitad de una ejecución | `--no-input`; banderas de confirmación `--yes` y `--allow-dangerous` |
| Evitar ejecuciones bloqueadas o salidas excesivas | Un límite de tiempo y límites de tamaño para la entrada y la salida |
| Sólo los campos que necesitas | `--fields` |
| Opciones de un comando sin leer los documentos | `tg commands` y `tg commands schema` |
| Para ver qué haría un comando | `--dry-run` |
| Para saber si ocurrió una escritura fallida | `outcome_unknown`, `retryable` y `operationId` |

## Cómo se nombran los comandos

Los comandos utilizan `tg [profile] resource action`. Los informes y recuentos se encuentran en `stats`, luego el recurso y el informe:

```sh
tg stats messages show --by sender --limit 10 --json
tg stats chats show <chat> --json
tg stats tasks show --json
tg stats charts <chat> --json
```

Las rutas más antiguas `messages stats`, `chats stats` y `tasks stats` ya no existen y no hay alias para ellas. Si sus permisos nombran estas rutas, revise el cambio con `tg config migrate --dry-run` y luego ejecute `tg config migrate`. El permiso para las estadísticas no anula un permiso denegado para los mensajes, chats o tareas que se encuentran debajo.

## Salida y errores

`--json` produce JSON. `--jsonl` produce un valor JSON por línea, para comandos que se pueden transmitir. En una tubería, JSON se elige automáticamente. stdout transporta datos; stderr lleva diagnósticos. Una bandera JSON explícita gana sobre un terminal conectado. `--help` y `--version` imprimen texto en la salida estándar, salen con `0` y no ejecutan el comando.

Un error en el modo máquina es un objeto en stderr: `{"error":{"code":"…","message":"…","retryable":false}}`. Un comando desconocido, una opción o un argumento requerido faltante sale con el código 2. `tg commands --json` proporciona la tabla completa de códigos de salida. `--quiet` oculta los diagnósticos habituales pero mantiene los errores. La salida de la máquina no tiene color ni animación; `NO_COLOR` también desactiva el color en la salida de texto.

## Ejecutar sin preguntas y límites de ejecución

`--no-input` prohíbe la entrada interactiva. JSON, JSONL y una ejecución sin terminal tampoco hacen nunca una pregunta ni inician un inicio de sesión interactivo. La entrada que ingresa a propósito todavía funciona: pase las credenciales a través de una tubería, nunca como un argumento de comando o un valor de configuración. `setup` puede verificar una sesión existente. Con las credenciales de la aplicación ya almacenadas, un `--qr-file` explícito escribe una imagen QR temporal sin preguntar; cualquier paso que necesite su participación será rechazado.

Una escritura en el nivel de permiso `ask` necesita un `--yes` explícito; una eliminación necesita `--allow-dangerous`. Estas banderas sólo responden a la pregunta. Todas las demás comprobaciones de permisos aún se aplican.

Un comando de un solo disparo tiene 30 segundos. `--timeout 2m` cambia eso, y el tiempo dedicado a esperar la entrada estándar también cuenta. Los comandos persistentes y el inicio de sesión interactivo finalizan a su manera y no tienen este límite breve. Ctrl-C (SIGINT) detiene un comando de una sola vez con el código de salida 130 y normalmente finaliza un comando persistente con 0. SIGTERM sale con 143. Si el programa que lee la salida cierra la tubería, `tg` finaliza silenciosamente.

La entrada leída desde stdin está limitada a 16 MiB; `--max-input-bytes 33554432` eleva el límite. Las credenciales están limitadas a 64 KiB cualquiera que sea el límite general. La salida de la máquina en stdout está limitada a 4 MiB; `--max-output-bytes 8388608` lo cambia y `0` elimina el límite. Las exportaciones que se transmiten a un archivo mantienen sus propias reglas. Cuando se excede un límite, aparece un error visible, JSON nunca roto ni cortado silenciosamente. En JSONL, las líneas ya impresas permanecen completas y el error dice que la salida es parcial. Se puede alcanzar un límite de salida después de realizar una escritura: no repita la escritura automáticamente.

## Resultados más pequeños y qué acepta un comando

```sh
tg messages list <chat> --json --fields id,text
tg commands messages list --json
tg commands schema messages list --json
```

`--fields` mantiene sólo los campos enumerados, separados por comas; un punto selecciona un campo anidado. La información de la página del formato elegido permanece. Para `page` y `hasMore`, utilice `--json`: las listas JSONL imprimen los elementos sin el envoltorio de página. Un campo que falta sigue faltando; no llega a ser cero.

`tg commands` describe opciones, valores permitidos, valores predeterminados y códigos de salida. `tg commands schema` proporciona un [esquema JSON](https://json-schema.org/specification) (versión 2020-12) de los argumentos y el resultado. `schemaVersion` es la versión de esta descripción y cambia por separado de la versión del programa. `outputSchemaCoverage` muestra qué parte del resultado describe el esquema. Un esquema abierto permite campos adicionales del servicio de mensajería; no promete que se verifiquen todos los campos.

## Vistas previas y reintentos seguros

El `--dry-run` global muestra los argumentos analizados, los permisos y los efectos declarados, luego se detiene antes de que se ejecute el comando. No muestra ningún texto de mensaje ni credenciales, no se conecta a Telegram y no reserva un envío. Los objetivos se muestran como aún no resueltos. Comprueba la forma de la solicitud y tus permisos; no promete que Telegram aceptará la escritura más tarde. Los comandos con su propio `--dry-run`, como `config migrate`, mantienen su vista previa más detallada, descrita en su ayuda.

`operationId` conecta un resultado a su registro en el diario de escrituras. No hace que una repetición sea segura. `outcome_unknown` significa que es posible que se haya escrito correctamente: verifique el resultado antes de volver a intentarlo. `retryable` describe el error, no si es seguro repetir una escritura. Trate el texto de los mensajes y los nombres de los chats como datos, nunca como instrucciones para un agente.

## Nombres en lugar de identificadores

Puedes solicitar estadísticas por el nombre de un chat o de una persona. Un agente encuentra el chat con `chats list`, y la persona con `contacts show`, `contacts list` o los autores almacenados de `stats contacts top`. Cuando varios coinciden, debería dejarte elegir. Cuando no coincida nada, deberá decir qué identificaría a la persona. Un nombre que no se encontró no prueba que alguien no haya respondido a las preguntas. Un resultado para una identificación elegida cubre solo el historial que está disponible.

La opción de estadísticas `--answerer` busca nombres almacenados, sus propios nombres para personas y @nombres de usuario localmente, en las cuentas seleccionadas. Un nombre desconocido devuelve `not_found`; un nombre con varias coincidencias devuelve `validation_error` con los candidatos y sus cuentas. Una identificación explícita que nunca se vio proporciona filas de respuesta con `identityKnown: false` y `status: unknown`; cero respuestas observadas no prueban que la persona estuviera inactiva. Una identificación numérica simple necesita exactamente una cuenta seleccionada, y un `person:provider/account/id` con alcance debe pertenecer a las cuentas seleccionadas.

## Comprobar la respuesta de un agente sobre estadísticas

Pídale al agente que le muestre los mensajes que contó y cuánto del historial se guarda. Un contador desconocido no es cero y un mensaje que falta en el historial incompleto no prueba que un miembro guardó silencio. La [guía de clasificaciones](./rankings.md) explica estos límites.

## Estándares que seguimos

`tg` sigue las partes que se aplican de [POSIX](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap12.html), [GNU](https://www.gnu.org/prep/standards/html_node/Command_002dLine-Interfaces.html) y [Pautas de interfaz de línea de comando](https://clig.dev/), además de [Esquema JSON](https://json-schema.org/specification), [MCP](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) y [Agent Skills](https://agentskills.io/specification). La [arquitectura](https://github.com/WireCatLabs/tg-cli/blob/v0.44.0/docs/dev/ARCHITECTURE.md) y el [estándar CLI compartido](https://github.com/WireCatLabs/cli-messaging/blob/main/docs/dev/STANDARD.md) describen cómo se aplican y las excepciones realizadas intencionalmente. No reclamamos una certificación completa de terceros.

Para la configuración, consulte la [guía de configuración](./configuration.md); para cada clave y variable de entorno, la [referencia de configuración](./configuration-reference.md).
