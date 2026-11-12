---
title: "Permisos"
---

Lee esta página antes de dejar que un agente de IA, un script o un compañero cambie tu CRM a través de `b24`. Muestra
cómo decidir, para cada perfil, qué solo se puede leer, qué te pregunta antes y qué puede seguir adelante. Al final
puedes impedir que los agentes muevan negociaciones o borren, y sabes qué comprobaciones se mantienen digan lo que
digan los permisos.

Palabras que usa esta página:

- **Perfil**: el nombre que diste al inicio de sesión de un portal, como `work`. Es la primera palabra de un comando.
- **Clave de permiso**: el nombre de un comando, como `deals.move`, o de un grupo de comandos, como `deals`. Una clave
  más larga es más específica y gana.
- **Nivel**: qué pasa cuando se ejecuta el comando: `deny`, `readonly`, `ask` o `allow`.

## Los niveles

| Nivel | Qué pasa |
|---|---|
| `deny` | El comando se rechaza, también una lectura. |
| `readonly` | Las lecturas funcionan. Una escritura se rechaza. |
| `ask` | Una escritura pregunta antes en una terminal. Sin terminal se rechaza salvo que se pase `--yes`. **Por MCP se ejecuta.** |
| `allow` | El comando se ejecuta sin preguntar. |

```sh
b24 work config set permissions.deals.move readonly   # no deal moves through b24 on this profile
b24 work config set permissions.deals readonly        # every deal command reads, none writes
b24 work config show                                  # each key with its level and where it came from
```

Un rechazo es `permission_error` (código de salida 5) y nombra la clave. No significa que el inicio de sesión esté
roto.

Un agente no puede aflojar un permiso. Un `config set` o `config unset` que levantaría un límite se rechaza salvo que
lo ejecutes tú en una terminal.

## Lo que está fijado antes de que cambies nada

| Clave | Nivel de serie | Por qué |
|---|---|---|
| `deals.delete`, `leads.delete` | `ask` | Un borrado no se puede deshacer. |
| `crm.assign-others` | `deny` | Bitrix24 avisa al empleado de que le han dado un elemento. |
| `api.<method>` de una familia que envía mensajes a personas, publica o pone en marcha automatizaciones | `deny` | Ver abajo. También las lecturas. |
| `api.<method>` que `b24` no lee ni escribe por sí mismo | `ask` | Puede contener lo que ocultas a los agentes. |
| Cualquier otro comando | `allow` | |

Las familias denegadas por `api call` son `im`, `imopenlines`, `imbot`, `imconnector`, `log.blogpost`, SMS
(`messageservice`), correo (`mailservice`), telefonía (`telephony`, `voximplant`), procesos de negocio (`bizproc`,
`crm.automation`), actividades del CRM (`crm.activity`), tareas (`tasks`, `task`), `user.add`, enlaces públicos a
archivos, `event.bind` y `batch`. `b24 work api show <method>` indica la clave de un método, su nivel y las claves que
también comprueba.

## Un comando puede comprobar varias claves

Un comando comprueba su propia clave y las claves de lo que hace por el camino. `--dry-run` nombra cada una con su
nivel y no envía nada:

```sh
b24 work deals update deal:12 --stage "Contract signed" --owner 34 --dry-run
```

- Una escritura que fija una etapa (`--stage`, `move`) comprueba `deals.move` o `leads.move`. Una etapa ganada o
  perdida, y `close`, comprueban además `deals.close` o `leads.close`.
- Un responsable distinto del usuario del webhook (`--owner`) comprueba `crm.assign-others`.
- `api call` comprueba `api.<method>` y la clave del comando que hace lo mismo. `api call crm.deal.update` comprueba
  `deals.update`, y con un `stageId` también `deals.move`. Así que `api.crm.deal.update: deny` también detiene
  `deals update`, `move` y `close`.
- `search all` deja fuera un tipo cuya clave de lista está denegada, y lo nombra en `missing`.

## Los cambios de etapa ponen en marcha los robots del portal

Una etapa en Bitrix24 puede tener robots y procesos de negocio. Envían al cliente un correo, un SMS o una factura, o
crean una tarea para un compañero. `b24` no los ve. Si tu portal tiene esos robots, decide quién puede mover una
negociación:

```sh
b24 work config set permissions.deals.move ask        # at a terminal, every move asks you first
b24 work config set permissions.leads.move ask
```

`ask` te protege solo en una terminal. Antes de que un agente reciba el perfil por MCP, pon los movimientos en
`readonly` o activa la aprobación en el cliente del agente. Ver [Agentes y MCP](#agents-and-mcp).

## Agentes y MCP

Por MCP no hay nadie en una terminal para responder, y el servidor no muestra ningún formulario, así que una escritura
en `ask` sigue adelante. Pasa también con los niveles de serie: un agente con el webhook de un administrador puede
borrar negociaciones y prospectos. Elige una opción:

- Pon `readonly` o `deny` en cada escritura que un agente no debe hacer:

  ```sh
  b24 work config set permissions.deals.move readonly
  b24 work config set permissions.leads.move readonly
  b24 work config set permissions.deals.delete deny
  b24 work config set permissions.leads.delete deny
  ```

- O deja los niveles y activa la aprobación de la herramienta `b24_write` en el cliente del agente, para que el
  cliente te pregunte antes de cada escritura.

`mcp serve --permission deals.delete=deny` y `mcp add … --permission …` hacen un nivel más estricto para ese servidor.
Nunca aflojan el perfil. Ver [MCP](./mcp.md).

## Comprobaciones que se mantienen digan lo que digan los permisos

- **`B24_READ_ONLY=1`** rechaza toda escritura en esa shell o ese temporizador. Un agente que pone en marcha
  `schedule agent` se ejecuta con ella.
- **El webhook de un empleado no puede borrar ni vaciar.** Salvo que el usuario del webhook sea administrador de
  Bitrix24, `b24` rechaza todo borrado, una actualización que deja un campo vacío, una desvinculación, una fusión de
  duplicados y `api call batch` (motivo `employee.*`).
- **Las lecturas de contactos y empresas por `api call`** son solo de un administrador.
- **Teléfonos y correos** de clientes que no son del usuario del webhook: como mucho 100 de esos contactos y empresas
  al día con `people show` y `organizations show`, entre el usuario y sus agentes. La cuenta se lleva en este
  ordenador, así que frena un descuido o a un agente, no a alguien que quiera llevarse la base.
- **De quién son las negociaciones que copia una sincronización** (`crm.bitrix24:<portal>.unassigned`, `scope`,
  `self`). Solo tú las fijas. A un agente se le rechaza.
- **Los propios derechos de acceso de Bitrix24.** El webhook actúa como el empleado que lo creó, y el portal rechaza lo
  que ese empleado no puede hacer (`bitrix.access-denied`).

Si iniciaste sesión con una aplicación local en lugar de un webhook, `b24` actúa como el empleado que inició sesión, y
cada regla de arriba que habla del usuario del webhook se aplica a ese empleado.

Más: [ajustes](./configuration.md), [seguridad](./security.md).
