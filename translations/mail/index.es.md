---
title: "Mail"
---

`mail` es una herramienta de línea de comandos de WireCat que lee un buzón por IMAP hacia el almacén común, para la terminal, para scripts y para agentes de IA. Inicia sesión con una contraseña de aplicación guardada en el llavero del sistema operativo. No envía correo.

Comandos: `session` (start: crea el perfil, comprueba y guarda la contraseña de aplicación; status; end; list),
`account check`, `folders list`, `sync` y `status` (cuánto lleva una sincronización), además de los comandos que comparten
todas las CLI de WireCat: `doctor`, `commands`, `config`, `skill`, `mcp`, `runs` y `upgrade`.
Empieza por [la instalación](./installation.md) y sigue con [el uso](./usage.md). Antes del primer inicio de sesión, prepara el buzón:
[los pasos de cada proveedor](./providers.md).

## Buscar en tu correo

`mail` llena el almacén común. [memo](https://github.com/WireCatLabs/cli-memo) busca en él y muestra lo que contiene:

```sh
memo search mail "invoice"
```

Las palabras de la consulta están en [memo search](https://github.com/WireCatLabs/cli-memo/blob/main/docs/search.md).
