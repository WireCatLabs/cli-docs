---
title: "Permisos"
---

Deja que un agente de IA trabaje con tu espacio de trabajo de Attio a través de `attio` y conserva la última palabra
sobre lo que cambia. El token de acceso lee todo el espacio de trabajo, y con ámbitos de escritura lo cambia, así que
sin tus propios límites un agente podría hacer lo que permite el token.

Para cada perfil, el nombre que diste al inicio de sesión de un espacio de trabajo, decides qué puede solo leer un
agente, qué te pregunta antes y qué sigue adelante. Puedes alejar toda escritura de un agente con una línea, y sabes
qué comprobaciones se mantienen digan lo que digan los ajustes.

Cada comando tiene una clave de permiso, su nombre, como `deals.list` o `api.notes-create`, o un grupo como `api`,
donde la clave más larga gana. Cada clave tiene un nivel: `deny`, `readonly`, `ask` o `allow`. `attio work config set`
los pone, y `--dry-run` muestra qué claves comprueba un comando.

**En esta página:**

1. [Los niveles](#the-levels)
2. [Lo que viene puesto antes de que cambies nada](#what-is-set-before-you-change-anything)
3. [Aleja toda escritura de un agente](#keep-every-write-away-from-an-agent)
4. [Agentes y MCP](#agents-and-mcp)
5. [Comprobaciones que se mantienen digan lo que digan los permisos](#checks-that-hold-whatever-the-permissions-say)

## Los niveles

| Nivel | Qué pasa |
|---|---|
| `deny` | El comando se rechaza, también una lectura. |
| `readonly` | Las lecturas funcionan. Una escritura se rechaza. |
| `ask` | Una escritura pregunta antes en una terminal. Sin terminal se rechaza, salvo que se dé `--yes`. **Por MCP se ejecuta.** |
| `allow` | El comando se ejecuta sin preguntar. |

```sh
attio work config set permissions.api readonly   # every api operation reads, none writes
attio work config set permissions.people deny    # no live reads of people on this profile
attio work config show                           # each key with its level and where it came from
```

Un rechazo es `permission_error` (código de salida 5) y nombra la clave. No significa que el inicio de sesión esté
roto.

Un agente no puede aflojar un permiso: un `config set` o `config unset` que levantaría un límite se rechaza, salvo que
lo ejecutes tú en una terminal.

## Lo que viene puesto antes de que cambies nada

| Clave | Nivel de serie | Por qué |
|---|---|---|
| `api.<operation>` que borra, como `api.objects-records-delete` | `ask` | Un borrado no se puede deshacer. También comprueba `attio.delete`. |
| `attio.delete` | `ask` | Una sola clave para todos los borrados. Ponla en `deny` para pararlos todos. |
| `deals.create`, `deals.update`, `deals.move`, `deals.close`, `deals.delete` | `ask` | Cada uno cambia una negociación que ven tus compañeros. |
| `people.create`, `people.update` | `ask` | Cada uno cambia una persona que ven tus compañeros. |
| `api.<operation>` que escribe, como `api.objects-records-create` | `ask` | Cada una cambia lo que ven tus compañeros. |
| `crm.assign-others` | `deny` | Dar una negociación o una persona a otro miembro del espacio de trabajo espera hasta que lo permitas. Una negociación nueva sin `--owner` es tuya. |
| Cualquier otro comando | `allow` | |

Una escritura de negociación o de persona también comprueba la clave `api` de la operación de Attio que envía, como
`api.objects-records-replace`, así que un `readonly` en `api` también la detiene. Los comandos de embudos, etapas,
cambios, campos y búsqueda solo leen, igual que los de empresas y usuarios.

## Aleja toda escritura de un agente

`--dry-run` nombra cada clave que comprueba un comando, con su nivel, y no envía nada:

```sh
attio work api objects-records-delete --object deals --record-id 0d7d1c2e-0000-4000-8000-000000000000 --dry-run
```

El id de registro de arriba es inventado. Cualquiera de estas opciones hace que las escrituras sigan siendo tuyas:

- **Ámbitos de lectura en el token.** Crea el token con solo los tres ámbitos de lectura de
  [instala](./installation.md). Entonces el propio Attio rechaza toda escritura.
- **`api` en `readonly`.** `attio work config set permissions.api readonly`. Todas las lecturas siguen funcionando y
  toda escritura se rechaza: los comandos de negociaciones y personas envían por las mismas operaciones.
- **Sin borrados.** `attio work config set permissions.attio.delete deny` detiene todo borrado y deja las demás
  escrituras como están.

## Agentes y MCP

Por MCP no hay nadie en una terminal para responder, y el servidor no muestra ningún formulario, así que una escritura
en `ask` sigue adelante. Eso vale también para los niveles de serie: un agente con un token que tiene ámbitos de
escritura puede borrar registros. Elige una opción antes de conectar una aplicación:

- Pon `permissions.api` en `readonly`, como arriba.
- O deja los niveles y activa la aprobación de la herramienta `attio_write` en el cliente de tu agente, para que el
  cliente te pregunte antes de cada escritura.

`mcp serve --permission api=readonly` y `mcp add … --permission …` hacen un nivel más estricto para ese servidor.
Nunca aflojan el perfil. Mira [MCP](./mcp.md#keep-writes-yours).

## Comprobaciones que se mantienen digan lo que digan los permisos

- **`WCATTIO_READ_ONLY=1`** rechaza toda escritura, en esa shell o en la aplicación que la pone.
- **Los ámbitos del token.** Attio rechaza lo que no permiten los ámbitos del token, diga lo que diga el perfil.
- **El texto de Attio son datos.** Los títulos de negociaciones, los nombres y los valores de atributos llegan a un
  agente marcados como `untrusted`, así que un agente no los toma como instrucciones.

Más: [ajustes](./configuration.md), [seguridad](./security.md).
