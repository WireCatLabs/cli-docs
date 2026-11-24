---
title: "Úsalo"
---

Encuentra una negociación, mira tu embudo o qué cambió durante la noche con un comando corto, el mismo que ejecuta tu
agente. La API de Attio habla con ids de registros, slugs de atributos e ids de estados, y `attio` acepta en su lugar
nombres de etapas y palabras normales.

Encuentras las negociaciones de una etapa, las ganadas de la semana o el correo de una persona en una línea. Un agente
hace lo mismo a partir de tu petición.

Cada comando empieza con un perfil, el nombre que diste al inicio de sesión de un espacio de trabajo. `sync` copia tus
negociaciones, y las personas y empresas que aparecen en ellas, en el almacén local de WireCat, donde las leen los
comandos de negociaciones. Necesitas un perfil con sesión iniciada: [instala](./installation.md) prepara uno.

**En esta página:**

1. [Primero el perfil](#the-profile-comes-first)
2. [Sincroniza](#sync)
3. [Negociaciones](#deals)
4. [El embudo](#the-pipeline)
5. [Qué cambió](#what-changed)
6. [Personas, empresas y miembros](#people-companies-and-members)
7. [Tus atributos propios](#your-own-attributes)
8. [Busca en todo](#search-everything)
9. [La API de Attio](#the-attio-api)
10. [Salida para scripts](#output-for-scripts)
11. [Agentes](#agents)

## Primero el perfil

Un perfil es un nombre que eliges para un espacio de trabajo. Es la primera palabra de cada comando que usa una
cuenta:

```sh
attio work config show
```

`WCATTIO_PROFILE=work` hace lo mismo para una sesión de la terminal. Nunca se da un perfil por supuesto, ni siquiera
el único: un comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador. Dos
espacios de trabajo son dos perfiles, cada uno con su propio token.

## Sincroniza

Las negociaciones, el embudo y sus etapas se leen del almacén local de WireCat, el mismo en el que buscan todas las
herramientas de WireCat. `sync` lo pone al día:

```sh
attio work sync                # every deal and the people and companies it names, again
attio work sync --rescan       # start over, dropping a sync that stopped half way
attio work store status        # how far each kind is, and how many are stored
```

Attio no puede listar solo los registros que cambiaron desde un momento dado, así que cada sincronización vuelve a
leer cada negociación y luego las personas y empresas que nombran. Una sincronización se detiene antes de su plazo o de `--max-pages`, y la siguiente
sigue desde ahí. Los registros borrados en Attio salen de la copia.

Cada registro guarda solo sus valores actuales. Attio guarda el historial de cada atributo, y un valor que se
sustituyó no se copia.

## Negociaciones

```sh
attio work deals list status:open                 # open, won or lost
attio work deals list stage:"In Progress"
attio work deals list "created>=30d"              # made in the last 30 days
attio work deals show deal:12                     # by the ref a list prints
attio work deals list status:open --format csv > deals.csv
```

Una negociación responde con su `stage`, su `status`, su `amount` con su `currency`, su empresa, sus personas, su
responsable y un enlace a la negociación en Attio. `--offline` lee lo mismo, sin ninguna petición a Attio. Una lista
muestra primero las más nuevas: `--limit` y `--page` lo cambian. Los campos por los que una lista puede filtrar están
en su ayuda: `attio help deals list`.

Attio tiene un solo embudo de negociaciones. Sus etapas son los estados del atributo **Stage** de la negociación, en
el orden de Attio:

- **Ganada** es la etapa que Attio celebra cuando una negociación llega a ella, o una con la palabra "won" en su
  título.
- **Perdida** es una etapa con la palabra "lost" en su título, como en un espacio de trabajo nuevo de Attio.
- Cualquier otra etapa está abierta.

Si cambiaste el nombre de tu etapa de perdidas por otro, sus negociaciones cuentan como abiertas. Deja la palabra
"Lost" en su título.

### Notas y tareas de una negociación

Con `activities` activado, cada sincronización copia también las notas y tareas de tu espacio de trabajo que cuelgan
de las negociaciones, personas y empresas que guarda. `deals show` las muestra, primero las tareas abiertas, y
`search all` encuentra una negociación por las palabras de sus notas. La clave del ajuste nombra el espacio de trabajo
por su id, el `id` que imprime `session status --check --json`:

```sh
attio work config set crm.attio:<workspace id>.activities on
attio work sync
attio work deals show deal:12
```

Está desactivado hasta que lo activas, y solo tú puedes hacerlo: a un agente se le niega. Las notas y tareas guardan
lo que los clientes escribieron y dijeron. Attio no puede listar solo las notas cambiadas desde un momento, así que
cada sincronización las vuelve a leer todas. Una nota o tarea borrada en Attio se queda en la copia. El token necesita
dos ámbitos más, `note:read` y `task:read`. Sin uno de ellos, la sincronización copia el resto y dice qué lista no pudo
leer.

## El embudo

```sh
attio work pipelines show                       # each stage: how many, their sum per currency, how many went on
attio work pipelines show --since-time 30d      # only the deals made in the last 30 days, with the win rate
attio work stages list                          # each stage with its outcome and how many are open in it
```

El embudo se llama `Deals`. Las sumas se llevan por moneda y nunca se convierten.

## Qué cambió

`changes list` muestra lo que las sincronizaciones vieron cambiar en la copia: negociaciones creadas, movidas,
ganadas, perdidas y pasadas a otro responsable, las más nuevas primero. Lee el último día salvo que `at:` diga otra
cosa.

```sh
attio work changes list "at>=1d"
attio work changes list change:won "at>=7d" --json
attio work changes list "at>=1d" --format report     # the window as a short morning digest
```

Un cambio solo lo ve una sincronización, así que ejecuta `sync` primero.

## Personas, empresas y miembros

Las personas, las empresas y los miembros del espacio de trabajo se leen de Attio cada vez, así que necesitan internet
y `--offline` los rechaza. Las palabras después de `list` buscan en Attio: personas por nombre o correo, empresas por
nombre.

```sh
attio work people list anna                       # people whose name or e-mail holds "anna"
attio work people show "Anna Example"             # one person by exact name or id, with e-mails and phones
attio work organizations list example             # companies whose name holds "example"
attio work organizations list --format csv > companies.csv
attio work users list                             # your workspace members, the owners of deals
```

Una lista en directo acepta solo palabras, no términos `field:value`. Sin palabras lista a todos, los más nuevos
primero. Una persona o una empresa da los atributos propios de tu espacio de trabajo en `provider_metadata`.

## Tus atributos propios

```sh
attio work fields list deals
attio work fields list people --json
```

`fields list` muestra los atributos que tu espacio de trabajo añadió a negociaciones, personas o empresas
(`organizations`), con su tipo, tal como los guardó la última `sync`. Las opciones de un atributo de selección todavía
no se listan. Los atributos propios de Attio quedan fuera.

## Busca en todo

```sh
attio work search all "Example LLC"
attio work search all renewal --only crm
```

`search all` busca las negociaciones de la copia por las palabras de su título, su empresa y sus personas, y los
mensajes, notas, eventos del calendario y reuniones que otras herramientas de WireCat guardaron en este ordenador. El
mejor resultado sale primero.

## La API de Attio

`attio work api` ejecuta cualquier operación de la API de Attio, un comando por operación, con sus propias opciones y
su ayuda. Llega a lo que todavía no tiene un comando propio: notas, tareas, listas, objetos personalizados, reuniones
y más.

```sh
attio work api list                               # every operation, without calling Attio
attio work api show objects-records-query         # one operation's parameters
attio work api objects-list                       # the objects in your workspace
```

Cada operación tiene su propia clave de permiso, como `api.notes-create`. Las escrituras solo pasan hasta donde lo
permiten los ámbitos del token: con los tres ámbitos de lectura de [instala](./installation.md), Attio las rechaza.
Para dejar toda escritura fuera de alcance en este ordenador, pon `attio work config set permissions.api readonly`.
Mira los [permisos](./permissions.md).

## Salida para scripts

Todos los comandos salvo `mcp serve` por stdin y stdout aceptan `--json` e imprimen un solo valor JSON en stdout. Los
errores salen en JSON por stderr, con un código para decidir qué hacer. `--format csv` convierte una página de una
lista en una tabla. La [referencia de comandos](./commands.md#exit-codes) lista los códigos de salida.

## Agentes

`attio skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`attio skill install --for hermes` añade además esa carpeta a los ajustes de Hermes Agent, así que un `skill install`
sin más deja fuera a Hermes.

Después, un agente con terminal ejecuta `attio` por sí mismo. Pregunta con palabras normales:

> *"Usa attio. ¿Qué negociaciones se movieron ayer, y cuáles siguen abiertas en Negotiation?"*
> *"Usa attio. Exporta nuestras negociaciones abiertas a un archivo CSV."*
> *"Usa attio. ¿Quién es nuestro contacto en Example LLC, y qué negociaciones tenemos con ellos?"*

Para Claude Desktop, Cursor, ChatGPT y otras aplicaciones que no pueden ejecutar comandos, `attio work mcp serve`
ofrece los mismos comandos por MCP. Bloquea antes las escrituras del grupo `api`: por MCP una escritura en `ask` sigue
adelante. Mira [MCP](./mcp.md).
