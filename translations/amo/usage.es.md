---
title: "Úsalo"
---

Encuentra una negociación, muévela o mira qué cambió durante la noche con un comando corto, el mismo que ejecuta tu
agente. La API de amoCRM habla con ids de embudos, de etapas y de campos, y `amo` acepta en su lugar nombres de etapas
y etiquetas de campos.

Tu agente te dice qué negociaciones están en una etapa, cómo va el embudo este mes y qué tareas están vencidas. Mueve
una negociación, la cierra con el motivo o actualiza un cliente cuando se lo pides, y cada mañana puede enviarte un
resumen de lo que cambió.

Cada comando empieza con un perfil, el nombre que diste a la cuenta. `sync` copia tus negociaciones y sus clientes en
el almacén local de WireCat en tu ordenador, y la mayoría de las lecturas responden desde ahí, también sin conexión.
Esta página da por hecho que el perfil ha iniciado sesión, como muestra [instala y conecta](./installation.md).

**En esta página:**

1. [Primero el perfil](#the-profile-comes-first)
2. [Inicia sesión](#sign-in)
3. [La primera sincronización](#the-first-sync)
4. [Lee tus negociaciones](#read-your-deals)
5. [Cambia una negociación](#change-a-deal)
6. [Tareas y qué cambió](#tasks-and-what-changed)
7. [Llama a la API](#call-the-api)
8. [Salida para scripts](#output-for-scripts)
9. [Agentes](#agents)

## Primero el perfil

Un perfil es un nombre que eliges para una cuenta. Es la primera palabra de cada comando que usa una cuenta:

```sh
amo work config show
```

`AMO_PROFILE=work` hace lo mismo para una sesión de la terminal. Nunca se da un perfil por supuesto, ni siquiera el
único. Un comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador.

## Inicia sesión

Crea la integración privada de la cuenta e inicia sesión en el perfil como muestra [instala y conecta](./installation.md),
con un token o con la integración en el navegador. `amo work session status --check` muestra la cuenta y el usuario
con los que actúa un perfil.

## La primera sincronización

`sync` copia en el almacén local los embudos, las negociaciones asignadas a ti y solo los contactos y empresas de esas
negociaciones. Un administrador puede elegir compañeros cuyas negociaciones también copia, como muestran los
[ajustes](./configuration.md#which-deals-sync-copies). Después, comandos como `deals list` leen esa copia sin
conexión:

```sh
amo work sync
amo work deals list status:open
```

Cualquier otro cliente se lee en directo con `people` u `organizations`. Ejecuta `sync` otra vez para poner la copia
al día: solo lee lo que cambió desde la última. Una sincronización detenida por `--max-pages` sigue desde ahí la
próxima vez. Esto mantiene la copia al día con un temporizador:

```sh
amo work schedule command crm --every 1h -- sync
amo work store status            # how far each kind is, and how many are stored
amo work sync --rescan           # everything again, every id too
```

## Lee tus negociaciones

```sh
amo work deals list stage:"Quote sent"
amo work deals show deal:12
amo work pipelines show Sales --since-time 30d
```

`deals list` acepta términos campo:valor, como `status:open` o `stage:"Quote sent"`, y `--format csv` para una hoja de
cálculo. `deals show` da una negociación con su etapa, su importe y las personas que tiene. `pipelines show` dibuja el
embudo como un tablero y como un embudo de conversión: cuántas negociaciones hay en cada etapa y su suma, cuántas
llegaron a ella y siguieron adelante, y la proporción de ganadas.

Los contactos y las empresas se leen en directo desde la cuenta:

```sh
amo work people list "Anna"
amo work organizations show "Example LLC"
```

Un contacto de tus propias negociaciones viene con sus teléfonos y correos. Un usuario que no es administrador ve los
teléfonos y correos de como máximo 100 contactos y empresas más al día, contados en este ordenador.

## Cambia una negociación

```sh
amo work deals move deal:12 "Negotiation"
amo work deals close deal:12 lost --reason "Example: chose another supplier"
amo work deals update deal:12 --amount 18000 --dry-run
```

Una etapa se nombra por su nombre en el embudo. `close` marca una negociación como ganada o perdida a la manera del
propio CRM, con el motivo. `--field` pone uno de los campos propios de la cuenta por su etiqueta, tal como los imprime
`amo work fields list deals`. El cargo de un contacto también es uno de esos campos. Cada cambio responde con un
`operation_id`, y `--dry-run` muestra lo que haría y los permisos que comprueba, sin enviar nada. amoCRM no tiene
ninguna llamada que borre una negociación, así que ciérrala como perdida. Los archivos de negociaciones y contactos
todavía no están soportados.

Cuando se pierde la respuesta a una escritura, el error dice `outcome_unknown` y `amo` no la vuelve a enviar. Puede que
amoCRM haya hecho el cambio, así que ejecuta `sync`, mira la negociación con `deals show` y vuelve a escribir solo si el
cambio no está.

## Tareas y qué cambió

Las tareas, los comentarios y las llamadas están desactivados por defecto. Para copiarlos, activa el ajuste de
actividades con la dirección de tu cuenta en lugar del ejemplo `example.amocrm.ru`:

```sh
amo work config set crm.amocrm:example.amocrm.ru.activities on
amo work sync
amo work activities list overdue:true
```

La siguiente `sync` copia las tareas, los comentarios y las llamadas de tus negociaciones y sus clientes de los últimos
90 días. Los de la negociación de un compañero nunca se guardan, y una llamada solo guarda su dirección (entrante o
saliente), nunca el número de teléfono ni la grabación.

`changes list` muestra lo que las sincronizaciones vieron cambiar: negociaciones creadas, movidas, ganadas, perdidas y
pasadas a otro responsable, tareas añadidas y hechas, contactos añadidos. Esta programación crea un resumen matutino
del último día:

```sh
amo work changes list "at>=1d"
amo work schedule command crm-digest --at 08:30 -- changes list --format report
```

El resumen llega como un aviso de escritorio. Con `--deliver-to` va también a un chat de Telegram o a un buzón de
correo a través de tus propios `tg` o `mail` de WireCat, y `amo help schedule command` muestra la forma de la ruta. El
resumen nombra títulos de negociaciones, importes, nombres de contactos y asuntos de tareas, nunca el texto de una
nota, y oculta los números de teléfono y las direcciones de correo. Todos los que leen la ruta lo leen.

## Llama a la API

`amo work api list` lista todas las operaciones de la API v4 de amoCRM, con nombres del tipo `<HTTP verb> <path>`,
su clave de permiso y su página de referencia. `api call` envía una, con la consulta y el cuerpo en JSON:

```sh
amo work api call "GET /api/v4/leads" --params '{"limit":5,"with":"loss_reason"}'
amo work api call "PATCH /api/v4/leads/42" --body '{"price":1000}' --dry-run
```

`--dry-run` muestra todos los permisos que comprueba la llamada y no envía nada. Las tareas y las notas se escriben así,
cuando sus claves lo permiten. `api call` nunca se ofrece por MCP.

## Salida para scripts

Todos los comandos salvo `mcp serve` por stdin y stdout aceptan `--json` e imprimen un solo valor JSON en stdout.
Los errores salen en JSON por stderr, con un código para decidir qué hacer. La
[referencia de comandos](./commands.md) lista los códigos.

## Agentes

`amo skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`amo skill install --for hermes` añade además esa carpeta a los ajustes de Hermes Agent, así que un `skill install`
sin más deja fuera a Hermes. Un agente con una skill ejecuta los mismos comandos que tú. `amo guide` lista escenarios
de tareas frecuentes, cada uno como comandos en orden y para qué sirve cada uno.

Una aplicación sin terminal, como Claude Desktop, o ChatGPT y Claude en el navegador, se conecta a `amo` por MCP, como
muestra [MCP](./mcp.md). Antes, decide qué puede cambiar, como muestran los [permisos](./permissions.md#agents-and-mcp):
por MCP no hay nadie que responda a una pregunta, así que una escritura con `ask` sigue adelante.
