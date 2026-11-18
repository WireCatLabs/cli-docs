---
title: "Permisos"
---

Deja que un agente de IA trabaje en tu CRM de HubSpot con `hubspot` y conserva la última palabra sobre lo que cambia. La
clave lleva los scopes que le diste en HubSpot para toda la cuenta, así que sin tus propios límites un agente podría
cambiar cualquier negociación, contacto o empresa al que lleguen esos scopes.

Para cada perfil, el nombre que diste al inicio de sesión de una cuenta, decides qué puede solo leer un agente, qué te
pregunta antes y qué sigue adelante. Puedes impedir que un agente borre negociaciones o use directamente la API de
HubSpot, y sabes qué controles valen digan lo que digan los ajustes.

Cada comando tiene una clave de permiso, su nombre como `deals.move`, o un grupo como `deals`, donde gana la clave más
larga. Cada operación de la API de HubSpot tiene una también, `api.` y su comando, como `api.deals-search`, y `api`
las cubre todas. Cada clave tiene un nivel: `deny`, `readonly`, `ask` o `allow`. `hubspot work config set` los pone, y
`--dry-run` muestra qué claves comprueba un comando.

**En esta página:**

1. [Los niveles](#the-levels)
2. [Lo que viene puesto antes de que cambies nada](#what-is-set-before-you-change-anything)
3. [Un comando puede comprobar varias claves](#one-command-can-check-several-keys)
4. [Agentes y MCP](#agents-and-mcp)
5. [Controles que valen digan lo que digan los permisos](#checks-that-hold-whatever-the-permissions-say)

## Los niveles

| Nivel | Qué pasa |
|---|---|
| `deny` | El comando se rechaza, también una lectura. |
| `readonly` | Las lecturas funcionan. Una escritura se rechaza. |
| `ask` | Una escritura pregunta antes en una terminal. **Por MCP se ejecuta.** |
| `allow` | El comando se ejecuta sin preguntar. |

```sh
hubspot work config set permissions.people deny        # this profile reads no contacts
hubspot work config set permissions.api readonly       # the API reads, never writes
hubspot work config set permissions.notes.write allow  # let an agent add notes without a question
hubspot work config show                               # each key with its level and where it came from
```

Un rechazo es `permission_error` (código de salida 5) y nombra la clave. No significa que el inicio de sesión esté
roto.

Un agente no puede aflojar un permiso: un `config set` o un `config unset` que levantaría un límite se rechaza salvo
que lo ejecutes tú mismo en una terminal.

## Lo que viene puesto antes de que cambies nada

| Qué | Claves | Nivel de serie |
| --- | --- | --- |
| `deals create`, `update`, `move` y `close`, `people` y `organizations` `create` y `update` | la suya, como `deals.update`. Un cambio de etapa comprueba también `deals.move`, y una etapa de ganada o perdida `deals.close` | `allow` |
| `deals delete` | `deals.delete` | `ask` |
| Una escritura con `api`, como `api deals-update` | `api.deals-update`, la clave `.write` de su grupo (`deals.write`, `notes.write`) y la clave del comando que hace lo mismo. Una etapa de negociación comprueba también `deals.move` y `deals.close` | `ask` |
| Un borrado, archivado o fusión con `api` | su propia clave `api.` y la clave `.delete` de su grupo | `ask` |
| Un propietario puesto en un registro, por cualquier camino | `crm.assign-others` | `deny` |
| `api contacts-gdpr-delete`, que borra un contacto para siempre | además `people.erase`, para que puedas negarlo solo a él | `ask` |
| Cualquier otro comando | la suya | `allow` |

Una clave de HubSpot pertenece a la cuenta, no a una persona. `hubspot` no distingue tus registros de los de un
compañero, así que cualquier propietario cuenta como otra persona, y `crm.assign-others` sigue en `deny` hasta que lo
permitas.

## Un comando puede comprobar varias claves

El mismo cambio puede llegar por dos caminos: un comando como `deals update`, o la operación de la API
`api deals-update`. Cada camino comprueba también las claves del otro, así que un solo ajuste vale para ambos:

```sh
hubspot work config set permissions.deals.update deny   # no deal updates, by deals update or api deals-update
```

`--dry-run` muestra cada clave que comprueba una escritura y no envía nada:

```sh
hubspot work deals move deal:12 "Contract sent" --dry-run
hubspot work api notes-create --body-file note.json --dry-run
```

## Agentes y MCP

Por MCP no hay nadie para responder una pregunta, así que `ask` deja que el comando se ejecute. Pon una clave en
`readonly` o `deny` para detener a un agente:

```sh
hubspot work config set permissions.deals.delete deny
hubspot work config set permissions.api readonly
```

`hubspot work mcp serve --permission people.list=deny` hace una clave más estricta solo para un servidor, y nunca más
floja. [MCP](./mcp.md#keep-writes-yours) muestra el resto.

## Controles que valen digan lo que digan los permisos

- **Los scopes de la clave.** Una clave sin scopes de escritura no puede cambiar nada en HubSpot, sea cual sea el nivel
  que pongas ([instalación](./installation.md#make-a-key)).
- **Solo lectura para todo.** `WCHUBSPOT_READ_ONLY=1` rechaza cada escritura, digan lo que digan los permisos.
- **Una escritura se envía una vez.** Una escritura que no obtuvo respuesta no se envía de nuevo. Termina como
  `outcome_unknown`, y revisas el registro en HubSpot antes de enviarla otra vez.
- **El inicio de sesión sigue siendo tuyo.** `session start` y `session end` no se ofrecen por MCP, y la clave se lee
  oculta o desde stdin, nunca como argumento.
