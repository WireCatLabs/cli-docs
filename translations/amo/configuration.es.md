---
title: "Ajustes"
---

Los ajustes están en un solo archivo, `config.json`, en la carpeta que muestra `amo doctor`. Cada perfil tiene su
parte, y `defaults` vale para todos los perfiles. Aquí se explica cómo verlos y cambiarlos.

```sh
amo work config show
amo work config set limit 50
amo work config unset limit
```

`config show` lista cada ajuste y de dónde viene: del archivo, de una variable o del valor por defecto.

## Permisos

`permissions` decide qué puede hacer un comando para este perfil: `allow`, `ask`, `readonly` o `deny`, por clave de
permiso. Por MCP no hay nadie a quien preguntar, así que `ask` deja que el comando se ejecute. `AMO_READ_ONLY=1`
rechaza todas las escrituras, digan lo que digan los permisos.

## Registros de ejecución

Un comando que falla se guarda como ejecución, para `amo runs list` y `runs show`. Un comando que añades y que hace
su trabajo en `context.run` se guarda también cuando sale bien, salvo que `record` sea `false` (entonces solo los
fallos) o que se ejecutara con `--no-record`. `api call` y `session status --check` hacen su trabajo en una ejecución,
así que `--record` los guarda. `record_input` decide si una ejecución guarda las palabras que escribiste. Es `true`
salvo que lo pongas en `false`. Los secretos se ocultan en cualquier caso. Mira [seguridad](./security.md).
