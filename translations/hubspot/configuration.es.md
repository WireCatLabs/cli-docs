---
title: "Ajustes"
---

Configura `hubspot` como quieras para cada cuenta de HubSpot: qué puede hacer tu agente de IA, si también se copian las
notas, llamadas y tareas de tus negociaciones, y qué guarda una ejecución para más tarde.

Los ajustes viven en un archivo, `config.json`, en la carpeta que muestra `hubspot doctor`. Cada perfil tiene su parte,
y `defaults` vale para todos los perfiles. `hubspot work config show` muestra cada ajuste y de dónde salió: el archivo,
una variable o el valor por defecto.

**En esta página:**

1. [Ver y cambiar un ajuste](#see-and-change-a-setting)
2. [Permisos](#permissions)
3. [Actividades](#activities)
4. [Registros de ejecución](#run-records)

## Ver y cambiar un ajuste

```sh
hubspot work config show
hubspot work config set limit 50
hubspot work config unset limit
```

## Permisos

`permissions` decide qué puede hacer un comando para este perfil: `allow`, `ask`, `readonly` o `deny`, por clave de
permiso. [Permisos](./permissions.md) enumera cada clave, su nivel de serie y qué vale por MCP.

```sh
hubspot work config set permissions.api readonly
```

## Actividades

`crm.hubspot:12345678.activities` está desactivado por defecto. Pon el id de tu cuenta en lugar del ejemplo
`12345678`: `hubspot work session status` lo muestra como `account`. Una vez activado, el siguiente `sync` copia las
notas, llamadas, correos, reuniones y tareas de las negociaciones y de sus contactos y empresas.
[Actividades y lo que cambió](./usage.md#activities-and-what-changed) muestra el comando. Solo tú lo cambias, en una
terminal.

## Registros de ejecución

Un comando que falla se guarda como ejecución, para `hubspot runs list` y `runs show`. Un comando que llega a HubSpot,
como `session status --check`, se guarda también cuando sale bien, salvo que `record` sea `false` (entonces solo los
fallos) o que se ejecutara con `--no-record`.
`record_input` decide si una ejecución guarda las palabras que escribiste. Es `true` salvo que lo pongas en `false`.
Los secretos se enmascaran en cualquier caso, como muestra [seguridad](./security.md).
