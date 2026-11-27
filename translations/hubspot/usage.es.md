---
title: "Uso"
---

Sabe en qué punto está cada negociación y qué cambió durante la noche, sin abrir HubSpot. `hubspot` lleva el CRM de
la cuenta a tu terminal y a tu agente de IA: qué negociaciones están en una etapa, qué tareas están vencidas y un
resumen cada mañana de lo que cambió.

Cada comando empieza con un perfil, el nombre que diste a la cuenta. `sync` copia las negociaciones con sus contactos
y empresas en el almacén local de WireCat en tu ordenador, y la mayoría de las lecturas responden desde ahí, también
sin conexión. Esta página da por hecho que el perfil ya inició sesión, como muestra
[instalar y conectar](./installation.md).

**En esta página:**

1. [El perfil va primero](#the-profile-comes-first)
2. [La primera sincronización](#the-first-sync)
3. [Lee tus negociaciones](#read-your-deals)
4. [Cambia negociaciones, contactos y empresas](#change-deals-contacts-and-companies)
5. [Actividades y lo que cambió](#activities-and-what-changed)
6. [Llama a la API](#call-the-api)
7. [Salida para scripts](#output-for-scripts)
8. [Agentes](#agents)

## El perfil va primero

Un perfil es un nombre que eliges para una cuenta. Es la primera palabra de cada comando que usa una cuenta:

```sh
hubspot work config show
```

`WCHUBSPOT_PROFILE=work` hace lo mismo para una sesión de la terminal. Nunca se da un perfil por supuesto, ni siquiera
si solo hay uno. Un comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador.

`hubspot work session status --check` muestra qué cuenta lee un perfil.

## La primera sincronización

`sync` copia los embudos, las negociaciones y sus contactos y empresas en el almacén local. Una clave de HubSpot
pertenece a la cuenta, no a una persona, así que la copia es la de toda la cuenta. Comandos como `deals list` leen
después esa copia sin conexión:

```sh
hubspot work sync
hubspot work deals list status:open
```

Vuelve a ejecutar `sync` para poner la copia al día: solo pide a HubSpot lo que cambió desde la última vez. Esto la
mantiene fresca con un temporizador:

```sh
hubspot work schedule command crm --every 1h -- sync
```

## Lee tus negociaciones

```sh
hubspot work deals list stage:"Contract sent"
hubspot work deals show deal:12
hubspot work pipelines list
```

`deals list` acepta términos campo:valor, como `status:open` o `stage:"Contract sent"`, y `--format csv` para una hoja
de cálculo. La clave no nombra a ningún usuario, así que `owner:me` no nombra a nadie. Toma el id del propietario de
`hubspot work users list` y filtra por él, como `owner:51234567`. `deals show` da una negociación con su etapa, su
importe y sus personas.

Los leads se leen igual con `leads list` en Sales Hub Professional o Enterprise.

Los contactos, las empresas y los propietarios se leen en directo desde la cuenta:

```sh
hubspot work people list "Anna"
hubspot work organizations show 9
hubspot work users list
```

## Cambia negociaciones, contactos y empresas

Esto necesita los scopes de escritura de la clave ([instalación](./installation.md#make-a-key)). Ejecuta `sync`
antes: una etapa o un embudo se nombran como los conoce la copia.

```sh
hubspot work deals create --title "Example kitchen" --amount 15000 --currency EUR --stage "Appointment scheduled"
hubspot work deals update deal:12 --close-date 2026-12-24 --field "Lead source=Trade fair"
hubspot work deals move deal:12 "Contract sent"
hubspot work deals close deal:12 lost --reason "Example: chose another supplier"
hubspot work deals delete deal:12
hubspot work people create --first-name Anna --last-name Example --email anna@example.com
hubspot work organizations update 9 --name "Example LLC"
```

Cada cambio va primero a HubSpot, y la copia guarda la respuesta de HubSpot. `close` mueve la negociación a la etapa
de ganada o perdida de su embudo. `delete` archiva la negociación en HubSpot, donde se puede restaurar durante 90 días,
y pregunta antes en una terminal. Por MCP no hay nadie para responder, así que solo `readonly` o `deny` detienen a un
agente ([permisos](./permissions.md)).
`--dry-run` muestra las claves de permiso que comprueba un cambio y no envía nada.

Un contacto guarda un correo y dos números, teléfono y móvil. Una empresa guarda un número y ningún correo. `--phone`
y `--email` sustituyen la lista entera, así que un solo `--phone` en un contacto borra su número móvil, y `--name`
pone a la vez el nombre y el apellido. Los leads, los tickets y los contactos y la empresa de una negociación se
escriben con [la API](#call-the-api).

La clave pertenece a la cuenta, no a ti, así que poner un propietario con `--owner` comprueba `crm.assign-others`, que
es `deny` hasta que lo permitas ([permisos](./permissions.md)). HubSpot no acepta una clave de idempotencia: un cambio
que terminó en `outcome_unknown` puede haberse hecho, así que mira el registro antes de enviarlo otra vez.

## Actividades y lo que cambió

Las notas, llamadas, correos, reuniones y tareas están desactivadas por defecto. Para copiarlas, activa el ajuste de
actividades con el id de tu cuenta en lugar del ejemplo `12345678`. `session status` muestra el id como `account`.

```sh
hubspot work config set crm.hubspot:12345678.activities on
hubspot work sync
hubspot work activities list overdue:true
```

Una nota o una tarea se pone en una negociación, un contacto o una empresa por su referencia, tal como la da
`deals show`, con un `--subject` para cada uno. Un contacto o una empresa por el id de HubSpot, tal como lo imprime
`people list`, es `person:crm:<id>`. Se escribe en HubSpot tanto si el ajuste de actividades está activado como
si no, y se guarda en el almacén local solo cuando lo está. Para cerrar una tarea hace falta su id de `activities list`:

```sh
hubspot work activities create comment --subject deal:12 --text "Agreed on the price"
hubspot work activities create task --subject deal:12 --subject person:crm:4021 --title "Send the contract" --due 2026-12-01
hubspot work activities close tasks:5501
```

`changes list` muestra lo que las sincronizaciones vieron cambiar: negociaciones creadas, movidas, ganadas y perdidas,
y contactos añadidos. Esta programación prepara cada mañana un resumen del último día:

```sh
hubspot work changes list "at>=1d"
hubspot work schedule command crm-digest --at 08:30 -- changes list --format report
```

## Llama a la API

`hubspot work api list` muestra todas las operaciones de la API del CRM de HubSpot, versión 2026-03, con su efecto y
su clave de permiso. Cada operación es un comando propio:

```sh
hubspot work api list
hubspot work api show deals-search
hubspot work api deals-search --body '{"after":"0","filterGroups":[],"limit":5,"properties":["dealname","amount"],"sorts":[]}'
hubspot work api deals-list --all
```

Cada operación comprueba su propia clave, `api.<command>`, así que `permissions.api deny` deja a un agente fuera de la
API directa. Una escritura en negociaciones, contactos o empresas comprueba además la clave de su comando
(`deals.update`), otra escritura la clave `.write` de su grupo (`notes.write`) y un borrado su clave `.delete`. Preguntan
antes en una terminal. Por MCP solo `readonly` o `deny` detienen a un agente.
`--dry-run` muestra las claves sin enviar nada:

```sh
hubspot work api tickets-create --body-file ticket.json --dry-run
```

```sh
hubspot work config set permissions.api deny
```

## Salida para scripts

Todos los comandos salvo `mcp serve` en stdin y stdout aceptan `--json` e imprimen un único valor JSON en stdout. Los
errores son JSON en stderr, con un código para decidir qué hacer. La [referencia de comandos](./commands.md) enumera
los códigos.

## Agentes

`hubspot skill install` enseña los comandos a Claude Code, Codex, Gemini CLI y OpenClaw.
`hubspot work mcp add claude-code --allow-writes` conecta el perfil a una app que usa MCP. [MCP](./mcp.md) muestra el
resto, y también ChatGPT y Claude en el navegador.
