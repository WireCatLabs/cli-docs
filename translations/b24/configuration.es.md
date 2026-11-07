---
title: "Ajustes"
---

Los ajustes están en un único archivo, `config.json`, en la carpeta que muestra `b24 doctor`. Cada perfil tiene su
propia sección, y `defaults` se aplica a todos los perfiles. Esta página explica cómo verlos y cambiarlos.

```sh
b24 personal config show
b24 personal config set limit 50
b24 personal config unset limit
```

`config show` muestra cada ajuste y de dónde viene: el archivo, una variable o el valor por defecto.

## Permisos

`permissions` decide qué puede hacer un comando en este perfil: `allow`, `ask`, `readonly` o `deny`, por clave de
permiso. Por MCP no hay nadie a quien preguntar, así que `ask` deja que el comando se ejecute. `B24_READ_ONLY=1`
rechaza toda escritura, digan lo que digan los permisos.

## Registros de ejecución

Un comando que falla se guarda como ejecución, para `b24 runs list` y `runs show`. Un comando que llama al portal se
guarda también cuando sale bien, con las peticiones que hizo, salvo que `record` sea `false` (entonces solo los fallos)
o que se ejecutara con `--no-record`. `record_input` decide si una ejecución guarda las palabras que escribiste; es
`true` salvo que lo pongas en `false`. Los secretos se ocultan en ambos casos; consulta
[Seguridad](./security.md).
