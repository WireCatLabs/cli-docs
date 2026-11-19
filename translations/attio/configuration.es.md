---
title: "Ajustes"
---

Cambia cómo funciona `attio` para un espacio de trabajo, o para todos los espacios de trabajo de este ordenador, con
un solo comando, y mira de dónde viene cada valor. Cambias solo los pocos que te importan, y el resto mantiene sus
valores por defecto.

Tú decides, por ejemplo, qué puede hacer un agente, cuántos elementos muestra una lista o si una ejecución guarda las
palabras que escribiste. Solo tú puedes aflojar un permiso: si un agente lo intenta, se le rechaza.

Los ajustes están en un solo archivo, `config.json`, en la carpeta que muestra `attio doctor`. Cada perfil tiene su
parte, y `defaults` vale para todos los perfiles. `attio work config` los muestra y los cambia.

**En esta página:**

1. [Ver y cambiar un ajuste](#see-and-change-a-setting)
2. [Permisos](#permissions)
3. [Variables](#variables)
4. [Registros de ejecución](#run-records)

## Ver y cambiar un ajuste

```sh
attio work config show
attio work config set limit 50
attio work config unset limit
```

`config show` lista cada ajuste con su valor y de dónde viene: del archivo, de una variable o del valor por defecto.
Los más habituales:

| Ajuste | Por defecto | Qué hace |
|---|---|---|
| `limit` | `20` | Cuántos elementos muestra una lista de una vez. |
| `permissions` | ninguno | Qué puede hacer cada comando. Mira [Permisos](#permissions). |
| `record` | `true` | Guarda cada ejecución. `false` guarda solo las ejecuciones fallidas. |
| `record_input` | `true` | Guarda las palabras que escribiste en una ejecución. |
| `keep_runs_for_days` | `30` | Cuánto tiempo se guarda una ejecución. |
| `update_check` | `true` | Busca una versión más nueva una vez al día. |

## Permisos

`permissions` decide qué puede hacer un comando para este perfil: `allow`, `ask`, `readonly` o `deny`, por clave de
permiso. Por MCP `ask` no pregunta y la escritura sigue adelante. Las claves, sus niveles de serie y cómo hacer que las
escrituras de un agente sigan siendo tuyas están en [Permisos](./permissions.md).

```sh
attio work config set permissions.api readonly
```

## Variables

| Variable | Qué hace |
|---|---|
| `WCATTIO_PROFILE` | El perfil para esta shell, en lugar de la primera palabra. |
| `WCATTIO_TOKEN` | Un token de acceso que se usa antes que el llavero, para un script o un contenedor. |
| `WCATTIO_READ_ONLY` | `1` rechaza toda escritura. |
| `WCATTIO_CONFIG_DIR`, `WCATTIO_STATE_DIR` | Llevan los ajustes o el estado a otra carpeta. |

`attio work session status` dice de dónde vino el token: de la variable, del llavero o de un archivo, nunca el token.

## Registros de ejecución

Un comando que falla se guarda como ejecución, para `attio runs list` y `runs show`. Un comando que llama a Attio,
como `sync`, una operación de `api` o `session status --check`, se guarda también cuando sale bien, salvo que `record`
sea `false` (entonces solo los fallos) o que se ejecutara con `--no-record`. `record_input` decide si una ejecución
guarda las palabras que escribiste. Los secretos se ocultan en cualquier caso. Mira
[Seguridad](./security.md#run-records).
