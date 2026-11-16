---
title: "Ajustes"
---

Los ajustes viven en un archivo, `config.json`, en la carpeta que muestra `notion doctor`. Cada perfil tiene su
parte, y `defaults` se aplica a todos los perfiles. Esta página explica cómo verlos y cambiarlos.

```sh
notion personal config show
notion personal config set limit 50
notion personal config unset limit
```

`config show` lista cada ajuste y de dónde viene: el archivo, una variable o el valor por defecto.

## Permisos

`permissions` decide qué puede hacer un comando en este perfil: `allow`, `ask`, `readonly` o `deny`, por clave de
permiso. Por MCP no hay nadie a quien preguntar, así que `ask` deja que el comando se ejecute. `WCNOTION_READ_ONLY=1`
rechaza cualquier escritura, digan lo que digan los permisos.

## Registros de ejecución

Un comando que falla se guarda como ejecución, para `notion runs list` y `runs show`. Un comando que añades y que hace
su trabajo en `context.run` se guarda también cuando sale bien, salvo que `record` sea `false` (entonces solo los
fallos) o que se ejecute con `--no-record`. `documents`, `databases` y `session status --check` hacen su trabajo dentro
de una ejecución, así que `--record` las guarda. `record_input` decide si una ejecución guarda las palabras que
escribiste. Es `true` salvo que lo pongas en `false`. Los secretos se ocultan siempre. Consulta
[Seguridad](./security.md).
