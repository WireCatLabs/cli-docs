---
title: "Ajustes"
---

Los ajustes viven en un solo archivo, `config.json`, en la carpeta que muestra `mail doctor`. Cada perfil tiene su propia parte,
y `defaults` se aplica a todos los perfiles. Esta página explica cómo verlos y cambiarlos.

```sh
mail ya config show
mail ya config set limit 50
mail ya config unset limit
```

Un perfil creado por `session start` guarda también el buzón: `address`, `login` (cuando no es la dirección), `imap_host`,
`imap_port`, `imap_security` (`tls` o `starttls`) y `folders` (las carpetas que lee `sync`). La contraseña de aplicación no es
un ajuste: vive en el llavero, o en `MAIL_PASSWORD` para una ejecución sin llavero.

`config show` lista cada ajuste y de dónde viene: el archivo, una variable o el valor por defecto.

`config set` también lista ajustes de búsqueda, voz y embeddings (`embedding_*`, `speech_model`, `picture_search` y
otros). Todas las CLI de WireCat comparten esa lista. `mail` los ignora.

## Permisos

`permissions` decide qué puede hacer un comando para este perfil: `allow`, `ask`, `readonly` o `deny`, por cada clave
de permiso. Por MCP no hay nadie a quien preguntar, así que `ask` deja ejecutar el comando. `MAIL_READ_ONLY=1` rechaza toda escritura, diga lo que diga
`permissions`.

## Registros de ejecución

Un comando que falla se guarda como una ejecución, para `mail runs list` y `runs show`. `record_input` decide si una ejecución
guarda las palabras que escribiste; es `true` salvo que lo pongas en `false`. Los secretos se ocultan en ambos casos; consulta
[Seguridad](./security.md).
