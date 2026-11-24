---
title: "Ajustes"
---

Los ajustes están en un archivo, `config.json`, en la carpeta que muestra `slk doctor`. Cada perfil tiene su parte,
y `defaults` se aplica a todos los perfiles. Esta página explica cómo verlos y cambiarlos.

```sh
slk personal config show
slk personal config set limit 50
slk personal config unset limit
```

`config show` enumera cada ajuste y de dónde viene: el archivo, una variable o el valor predeterminado.

## Permisos

`permissions` decide qué puede hacer un comando para este perfil: `allow`, `ask`, `readonly` o `deny`, por clave de
permiso. Por MCP no hay nadie a quien preguntar, así que `ask` deja que el comando se ejecute. `SLACK_READ_ONLY=1`
rechaza cualquier escritura, digan lo que digan los permisos.

## Registros de ejecución

Un comando que falla se guarda como ejecución, para `slk runs list` y `runs show`. Un comando que añadas y que haga su
trabajo en `context.run` se guarda también cuando sale bien, salvo que `record` sea `false` (entonces solo los fallos) o
que se haya ejecutado con `--no-record`. Los comandos `api`, `session start`, `session status --check` y
`doctor --online` trabajan dentro de una ejecución, así que `--record` los guarda. `record_input` decide si una
ejecución guarda las palabras que escribiste. Es `true` mientras no lo pongas en `false`. Los secretos se ocultan en
cualquier caso. Mira [Seguridad](./security.md).
