---
title: "Ajustes"
---

Los ajustes están en un único archivo, `config.json`, en la carpeta que muestra `b24 doctor`. Cada perfil tiene su
propia sección, y `defaults` se aplica a todos los perfiles. Esta página explica cómo verlos y cambiarlos.

```sh
b24 work config show
b24 work config set limit 50
b24 work config unset limit
```

`config show` muestra cada ajuste y de dónde viene: el archivo, una variable o el valor por defecto.

## Permisos

`permissions` decide qué puede hacer un comando en este perfil: `allow`, `ask`, `readonly` o `deny`, por clave de
permiso. Por MCP `ask` no pregunta y la escritura sigue adelante. Las claves, sus niveles de serie y cómo hacer que
las escrituras de un agente sigan siendo tuyas están en [Permisos](./permissions.md).

## Relaciones del CRM

Dos ajustes del almacén compartido, no de un perfil, dicen cómo guarda la sincronización las relaciones:
`crm.bitrix24:<portal>.links` (`reported` o `review`) y `crm.bitrix24:<portal>.company-types` (qué significa cada tipo
de empresa). [Quién es quién](./usage.md#who-is-who) explica los dos.

## Registros de ejecución

Un comando que falla se guarda como ejecución, para `b24 runs list` y `runs show`. Un comando que llama al portal se
guarda también cuando sale bien, con las peticiones que hizo, salvo que `record` sea `false` (entonces solo los fallos)
o que se ejecutara con `--no-record`. `record_input` decide si una ejecución guarda las palabras que escribiste; es
`true` salvo que lo pongas en `false`. Los secretos se ocultan en ambos casos; consulta
[Seguridad](./security.md).
