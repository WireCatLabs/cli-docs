---
title: "Ajustes"
---

Decide una vez qué puede cambiar tu agente en Linear y cuánto muestra un comando. Los ajustes están en un archivo,
`config.json`, en la carpeta que muestra `linear doctor`. Cada perfil tiene su parte, y `defaults` se aplica a todos
los perfiles.

```sh
linear personal config show
linear personal config set limit 50
linear personal config unset limit
```

`config show` enumera cada ajuste y de dónde viene: el archivo, una variable o el valor predeterminado.

## Permisos

`permissions` decide qué puede hacer un comando para este perfil: `allow`, `ask`, `readonly` o `deny`, por clave de
permiso. Por MCP no hay nadie a quien preguntar, así que `ask` deja que el comando se ejecute. `WCLINEAR_READ_ONLY=1`
rechaza cualquier escritura, digan lo que digan los permisos.

## Registros de ejecución

Un comando que falla se guarda como ejecución, para `linear runs list` y `runs show`. Con `record` en `false` solo se
guardan los fallos, y `--no-record` no guarda nada. `session status --check` trabaja dentro de una ejecución, así que
`--record` lo guarda. `record_input` decide si una ejecución guarda las palabras que escribiste. Es
`true` mientras no lo pongas en `false`. Los secretos se ocultan en cualquier caso. Mira [Seguridad](./security.md).
