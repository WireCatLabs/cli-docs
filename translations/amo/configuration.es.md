---
title: "Ajustes"
---

Cambia cómo funciona `amo` para una cuenta, o para todas las cuentas de este ordenador, con un solo comando, y mira
de dónde viene cada valor. Cambias solo los pocos que te importan, y el resto mantiene sus valores por defecto.

Tú decides de quién son las negociaciones que copia `sync`, si las tareas y las llamadas vienen con ellas, qué etapas
abren una tarea en tu ordenador y qué puede hacer un agente. Solo tú puedes aflojar un permiso o cambiar lo que copia
una sincronización: si un agente lo intenta, se le rechaza.

Los ajustes están en un solo archivo, `config.json`, en la carpeta que muestra `amo doctor`. Cada perfil tiene su
parte, y `defaults` vale para todos los perfiles. `amo work config show` lista cada ajuste y de dónde viene: del
archivo, de una variable o del valor por defecto.

**En esta página:**

1. [Ver y cambiar un ajuste](#see-and-change-a-setting)
2. [Permisos](#permissions)
3. [Qué negociaciones copia sync](#which-deals-sync-copies)
4. [Tareas y llamadas](#tasks-and-calls)
5. [Una tarea cuando una negociación entra en una etapa](#a-task-when-a-deal-enters-a-stage)
6. [Registros de ejecución](#run-records)
7. [Variables](#variables)

## Ver y cambiar un ajuste

```sh
amo work config show
amo work config set limit 50
amo work config unset limit
```

## Permisos

`permissions` decide qué puede hacer un comando para este perfil: `allow`, `ask`, `readonly` o `deny`, por clave de
permiso. Por MCP `ask` no pregunta y la escritura sigue adelante. Las claves, sus niveles de serie y cómo hacer que las
escrituras de un agente sigan siendo tuyas están en [Permisos](./permissions.md).

```sh
amo work config set permissions.deals.close deny
```

## Qué negociaciones copia sync

Por defecto `sync` copia las negociaciones asignadas al usuario que ha iniciado sesión. Un administrador puede elegir
otros usuarios en su lugar. Busca sus ids con `amo work users list` y luego lístalos con tu propio id entre ellos,
porque la lista sustituye a la tuya. El comando de abajo usa la dirección de ejemplo `example.amocrm.ru` y los ids de
ejemplo `7001` y `7002`. Pon en su lugar la dirección de tu cuenta y los ids que elegiste:

```sh
amo work config set crm.amocrm:example.amocrm.ru.unassigned 7001,7002
amo work sync
```

Solo tú pones este ajuste, porque se rechaza en la ejecución de un agente. Un usuario que no es administrador solo
puede elegirse a sí mismo. Ningún ajuste copia el CRM entero. Cualquier otro cliente se lee en directo con `people` u
`organizations`.

## Tareas y llamadas

`crm.amocrm:<address>.activities` está desactivado por defecto. Si lo activas, la siguiente `sync` copia las tareas,
los comentarios y las llamadas de tus negociaciones y sus clientes de los últimos 90 días.
[Tareas y qué cambió](./usage.md#tasks-and-what-changed) muestra el comando. Como la elección de negociaciones, solo
tú lo pones.

## Una tarea cuando una negociación entra en una etapa

`crm.amocrm:<address>.stage-tasks` nombra etapas, y cada negociación que entra en una de ellas abre una tarea en este
ordenador, junto a tus otras tareas de WireCat. La abre la sincronización que trae el cambio, una vez por cambio: una
tarea que descartas no vuelve, y la siguiente entrada en la misma etapa abre una nueva. Una etapa se nombra por su id,
que `amo work stages list --json` imprime como `external_id`. El comando de abajo usa la dirección de ejemplo
`example.amocrm.ru`. La etapa de ganada de amoCRM es `142` en todos los embudos, así que esta regla abre una tarea por
cada negociación ganada en cualquiera de ellos:

```sh
amo work config set crm.amocrm:example.amocrm.ru.stage-tasks \
  '{"142":{"title":"Send the closing papers","due_days":2}}'
amo work sync
```

`amo` lee el historial de etapas de la cuenta, así que una negociación que pasó por una etapa entre dos
sincronizaciones también recibe la tarea de esa etapa. Los cambios hechos antes de poner el ajuste por primera vez no
abren ninguna. Solo tú lo pones. Para pararlo,
`amo work config unset crm.amocrm:example.amocrm.ru.stage-tasks`.

## Registros de ejecución

Un comando que falla se guarda como ejecución, para `amo runs list` y `runs show`. `api call` y
`session status --check` se guardan también cuando salen bien, salvo que `record` sea `false` (entonces solo los
fallos) o que se ejecutaran con `--no-record`. `record_input` decide si una ejecución guarda las palabras que
escribiste: `true` (el valor por defecto), `false`, o `failed` para guardarlas solo en las ejecuciones fallidas. Los
secretos se ocultan en cualquier caso, como muestra [seguridad](./security.md).

## Variables

Una variable puesta para una shell o un temporizador va antes que el archivo:

- `AMO_PROFILE` nombra el perfil, así que un comando puede omitirlo.
- `AMO_READ_ONLY=1` rechaza todas las escrituras, digan lo que digan los permisos.
- `AMO_TOKEN` con `AMO_HOST` inicia sesión con un token de larga duración solo para esa ejecución, sin el llavero.
  `AMO_HOST` es la dirección de la cuenta, y `AMO_TOKEN` sin ella es un error.
- `AMO_AMOCRM_CLIENT_SECRET` da la clave secreta de la integración a `session start --client-id`.
- `AMO_CONFIG_DIR` y `AMO_STATE_DIR` llevan los ajustes y el estado a otras carpetas. Un inicio de sesión hecho con
  ellas se guarda aparte del habitual.
