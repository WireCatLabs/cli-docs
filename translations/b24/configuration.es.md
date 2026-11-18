---
title: "Ajustes"
---

Cambia cómo funciona `b24` para un portal, o para todos los portales de este ordenador, con un solo comando, y mira
de dónde salió cada valor. Cambias solo los pocos ajustes que te importan, y el resto conserva su valor por defecto o
queda sin definir.

Decides, por ejemplo, qué puede hacer un agente o si se copian las grabaciones de las llamadas. Solo tú puedes
relajar un permiso: a un agente que lo intenta se le rechaza.

Los ajustes están en un único archivo, `config.json`, en la carpeta que muestra `b24 doctor`. Cada perfil tiene su
propia sección, y `defaults` se aplica a todos los perfiles. `b24 work config` los muestra y los cambia.

**En esta página:**

1. [Ver y cambiar un ajuste](#see-and-change-a-setting)
2. [Permisos](#permissions)
3. [Llamadas](#calls)
4. [Relaciones del CRM](#crm-relationships)
5. [Registros de ejecución](#run-records)

## Ver y cambiar un ajuste

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

## Llamadas

`download_recordings` (`true` o `false`, `false` si no se define) descarga la grabación de cada llamada en
`meetings sync` y la guarda en la carpeta de estado. `phone_region` (un código de país, como `ru`, o varios: `ru,kz`)
es el país del número de quien llama cuando el portal lo escribe sin `+`. `sync_calls` (`true` si no se define) hace
que `sync` copie también las llamadas. `export_calls` (`false` si no se define) permite que `calls export` escriba en
Bitrix24 las llamadas de otras centralitas. Los cuatro están en [Llamadas](./calls.md).

## Relaciones del CRM

Dos ajustes del almacén compartido, no de un perfil, dicen cómo guarda la sincronización las relaciones:
`crm.bitrix24:<portal>.links` (`reported` o `review`) y `crm.bitrix24:<portal>.company-types` (qué significa cada tipo
de empresa). [Quién es quién](./usage.md#who-is-who) explica los dos.

## Registros de ejecución

Un comando que falla se guarda como ejecución, para `b24 runs list` y `runs show`. Un comando que llama al portal se
guarda también cuando sale bien, con las peticiones que hizo, salvo que `record` sea `false` (entonces solo los fallos)
o que se ejecutara con `--no-record`. `record_input` decide si una ejecución guarda las palabras que escribiste. Es
`true` salvo que lo pongas en `false`. Los secretos se ocultan en ambos casos. Consulta
[Seguridad](./security.md).
