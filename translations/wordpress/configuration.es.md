---
title: "Ajustes"
---

Cambia cómo funciona `wordpress` para un sitio, o para todos los sitios de este ordenador, con un comando, y mira de
dónde viene cada valor. Cambias solo los pocos que te importan, y el resto mantiene sus valores por defecto.

Decides, por ejemplo, qué puede publicar un agente, cuántos elementos muestra una lista o si una ejecución guarda las
palabras que escribiste. Solo tú puedes aflojar un permiso: un agente que lo intenta recibe un rechazo.

Los ajustes viven en un archivo, `config.json`, en la carpeta que muestra `wordpress doctor`. Cada perfil tiene su
propia parte, y `defaults` se aplica a todos los perfiles. `wordpress blog config` los muestra y los cambia, donde
`blog` es el perfil, un nombre que elegiste.

**En esta página:**

1. [Ver y cambiar un ajuste](#see-and-change-a-setting)
2. [Permisos](#permissions)
3. [Variables](#variables)
4. [Registros de ejecución](#run-records)

## Ver y cambiar un ajuste

```sh
wordpress blog config show
wordpress blog config set limit 50
wordpress blog config unset limit
```

`config show` enumera cada ajuste con su valor y de dónde viene: el archivo, una variable o el valor por defecto. Los
más comunes:

| Ajuste | Por defecto | Qué hace |
|---|---|---|
| `limit` | `20` | Cuántos elementos muestra a la vez una lista del grupo `api`. `posts list`, `tags list` y `users list` muestran 50, usa `--limit`. |
| `permissions` | ninguno | Qué puede hacer cada comando. Consulta [Permisos](#permissions). |
| `record` | `true` | Guarda cada ejecución. `false` guarda solo las ejecuciones fallidas. |
| `record_input` | `true` | Guarda las palabras que escribiste en una ejecución. |
| `keep_runs_for_days` | `30` | Cuánto tiempo se guarda una ejecución. |
| `keep_successful_runs_for_days` | `7` | Cuánto tiempo se guarda una ejecución que funcionó. |
| `update_check` | `true` | Comprueba una vez al día si hay una versión más nueva. |

## Permisos

`permissions` decide qué puede hacer un comando para este perfil: `allow`, `ask`, `readonly` o `deny`, por clave de
permiso. Todas las escrituras de `posts` están en `ask` por defecto. Por MCP, `ask` no pregunta: la escritura sigue
adelante, también una publicación. Las claves, sus niveles de serie y cómo dejar la publicación en tus manos están en
[Permisos](./permissions.md).

```sh
wordpress blog config set permissions.posts.publish deny
```

## Variables

| Variable | Qué hace |
|---|---|
| `WCWP_PROFILE` | El perfil para esta shell, en lugar de la primera palabra. |
| `WCWP_READ_ONLY` | `1` rechaza todas las escrituras. |
| `WCWP_CONFIG_DIR`, `WCWP_STATE_DIR` | Mueven los ajustes o el estado a otra carpeta. |

`wordpress blog session status` dice de dónde vino la contraseña: el llavero o un archivo, nunca la contraseña misma.

## Registros de ejecución

Un comando que falla se guarda como ejecución, para `wordpress runs list` y `runs show`. Un comando que llama a
WordPress, como `sync`, una escritura de `posts`, una operación de `api` o `session status --check`, se guarda también
cuando sale bien, salvo que `record` sea `false` (entonces solo los fallos) o que se ejecutara con `--no-record`.
`record_input` decide si una ejecución guarda las palabras que escribiste. Los secretos se ocultan en ambos casos.
Consulta [Seguridad](./security.md#run-records).
