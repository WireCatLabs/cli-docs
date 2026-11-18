---
title: "Permisos"
---

Deja que un agente de IA trabaje en tu CRM a través de `amo` y conserva la última palabra sobre lo que cambia. El token
lleva los permisos del administrador que lo creó, así que sin tus propios límites un agente podría hacer mucho de lo
que puede hacer ese administrador.

Para cada perfil, el nombre que diste al inicio de sesión de una cuenta, decides qué puede solo leer un agente, qué te
pregunta antes y qué sigue adelante. Puedes impedir que un agente mueva o cierre negociaciones, y sabes qué
comprobaciones se mantienen digan lo que digan los ajustes.

Cada comando tiene una clave de permiso, como `deals.move`, y también cada operación de la API de amoCRM. Cada clave
tiene un nivel: `allow`, `ask`, `readonly` o `deny`. Pones los niveles con `amo work config set`, y solo tú puedes
aflojar uno: si un agente lo intenta, se le rechaza.

**En esta página:**

1. [Los niveles](#the-levels)
2. [Lo que permite un perfil nuevo](#what-a-new-profile-allows)
3. [Operaciones de la API](#api-operations)
4. [Agentes y MCP](#agents-and-mcp)
5. [Comprobaciones que se mantienen digan lo que digan los permisos](#checks-that-hold-whatever-the-permissions-say)

## Los niveles

- `allow` ejecuta el comando.
- `ask` te pregunta en una terminal antes de una escritura. En un script no hay nadie para responder, así que la
  escritura se detiene con el código 7, salvo que el comando lleve `--yes`. Por MCP la escritura sigue adelante.
- `readonly` deja que se ejecuten las lecturas de la clave y rechaza sus escrituras.
- `deny` rechaza la clave, también las lecturas.

```sh
amo work config set permissions.deals.close deny   # this profile closes no deal
amo work config show                               # each permission with its level and where it came from
```

Una clave de grupo cubre todas las claves que tiene debajo, y la clave más larga gana: `api.leads` cubre todas las
operaciones sobre negociaciones, y `api.leads.id.get` todavía puede ser distinta. `--dry-run` en una escritura muestra
cada clave que comprueba, con su nivel, y no envía nada.

## Lo que permite un perfil nuevo

- **Permitido:** lo que leen los propios comandos de `amo`, como negociaciones, contactos, empresas, embudos, campos,
  usuarios, tareas y eventos, y crear, cambiar, mover y cerrar negociaciones, contactos y empresas.
- **Pregunta antes:** cualquier otra lectura, como las notas o los no clasificados, las demás escrituras y todos los
  borrados.
- **Denegado, también las lecturas:** conversaciones, chats, Salesbots, webhooks, widgets, botones del sitio web,
  llamadas, y activar o desactivar usuarios.
- **Escrituras denegadas:** añadir usuarios, y escribir tareas, roles y fuentes de clientes potenciales.
  `crm.assign-others` también está denegado, así que ninguna escritura da una negociación, una tarea o un contacto a
  otro usuario.

## Operaciones de la API

La clave de una operación son las palabras de la ruta y el verbo: `GET /api/v4/leads/{id}` es `api.leads.id.get`.
`amo work api list` muestra todas las operaciones con su clave y su nivel, y `amo work api show "PATCH /api/v4/leads"`
muestra una de ellas.

`api call` también comprueba la clave del comando que hace lo mismo, como `deals.update` para
`PATCH /api/v4/leads`, así que una llamada directa no puede saltarse el nivel de un comando. `api call` nunca se ofrece
por MCP.

## Agentes y MCP

Por MCP no hay nadie en una terminal para responder a `ask`, así que la escritura sigue adelante. De todos modos, mover
y cerrar negociaciones está en `allow` en un perfil nuevo, y un cambio de etapa puede poner en marcha la automatización
propia de la cuenta, como un Salesbot que escribe a un cliente.

Antes de que un agente reciba el perfil por MCP, elige una opción:

- Pon `readonly` o `deny` en cada escritura que el agente no debe hacer:

  ```sh
  amo work config set permissions.deals.move readonly
  amo work config set permissions.deals.close readonly
  ```

- O deja los niveles y activa la aprobación de la herramienta `amo_write` en el cliente de tu agente, para que el
  cliente te pregunte antes de cada escritura.

`mcp serve --permission deals.close=deny` y `mcp add … --permission …` hacen un nivel más estricto para ese servidor.
Nunca aflojan el perfil. Ver [MCP](./mcp.md).

## Comprobaciones que se mantienen digan lo que digan los permisos

- **`AMO_READ_ONLY=1`** rechaza toda escritura en esa shell o ese temporizador. Un agente que pone en marcha
  `schedule agent` se ejecuta con ella.
- **Solo un administrador borra o vacía.** Salvo que el usuario del inicio de sesión sea administrador de amoCRM, `amo`
  rechaza todo borrado, una escritura que deja un campo vacío y la desvinculación de registros (motivo `employee.*`).
- **Las lecturas de contactos, empresas, notas, eventos y entradas sin clasificar por `api call`** son solo de un administrador: contienen
  teléfonos y correos de clientes.
- **Teléfonos y correos** de clientes que no están en las negociaciones del propio usuario: como mucho 100 de esos
  contactos y empresas al día con `people show` y `organizations show`, para un usuario que no es administrador y sus
  agentes juntos. La cuenta se lleva en este ordenador: detiene un accidente o a un agente, no a alguien que quiere
  llevarse la base.
- **De quién son las negociaciones que copia una sincronización, y si las tareas y llamadas vienen con ellas**
  (`crm.amocrm:<address>.unassigned`, `activities`, `stage-tasks`): solo tú los pones. A un agente se le rechaza.
- **Los propios derechos de acceso de amoCRM.** El token actúa como el usuario al que pertenece, y amoCRM rechaza lo
  que ese usuario no puede hacer (`amo.access-denied`).

Si iniciaste sesión con la integración en el navegador en lugar de con un token, `amo` actúa como el usuario que
inició sesión, y cada regla de arriba que habla del usuario del inicio de sesión se aplica a ese usuario.

Más: [ajustes](./configuration.md), [seguridad](./security.md).
