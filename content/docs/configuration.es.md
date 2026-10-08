---
title: "Configuración"
description: "Guarda ajustes habituales para no repetir opciones."
---

Puedes configurar `tg` y `max`, guardar valores habituales, cambiar una sola ejecución o elegir
otro perfil. El acceso del asistente se explica en [Permisos](./permissions.md).

## El archivo

Las herramientas crean un `config.json` inicial con valores predeterminados cuando ejecutas
por primera vez un comando que lee ajustes. Conservan un archivo existente. Consulta su ruta y valores:

```sh
tg config show
max config show
```

Edita el archivo o usa `config set` y `config unset`. No guardes credenciales en él; usa los comandos
de acceso y configuración del proveedor de modelos.

| Sistema | Telegram | MAX |
|---|---|---|
| Linux | `~/.config/tg-cli/config.json` | `~/.config/max-cli/config.json` |
| macOS | `~/Library/Application Support/tg-cli/config.json` | `~/Library/Application Support/max-cli/config.json` |
| Windows | `%APPDATA%\tg-cli\config.json` | `%APPDATA%\max-cli\config.json` |

En PowerShell usa `tg.cmd` y `max.cmd`. Los comandos muestran la ruta real si has elegido otra carpeta.

## Tres maneras de ajustar un valor

- **Archivo:** guarda un valor para futuras ejecuciones. `tg config set limit 50` guarda el límite de resultados.
- **Variable de entorno:** el terminal puede seleccionar perfil o tiempo límite para su sesión.
  Por ejemplo, `TG_PROFILE` o `MAX_PROFILE` elige perfil. No todos los ajustes tienen variable.
- **Opción del comando:** un flag como `--limit 5` cambia solo esa ejecución.

## Qué valor gana

Primero la opción del comando, después la variable de entorno, el valor del perfil seleccionado,
los `defaults` compartidos y el valor incorporado. Solo participan las formas compatibles con ese
ajuste; la referencia del mensajero las enumera.

## Un ejemplo pequeño

```json
{
  "defaults": { "limit": 20, "sendsPerHour": 30 },
  "profiles": { "work": { "limit": 50 } }
}
```

`tg work chats list` o `max work chats list` usa 50. Añade `--limit 5` para obtener cinco solo esa vez.
Al quitar el valor del perfil vuelve a aplicar el valor compartido.

## Qué puedes configurar

Resultados, colores, registro de ejecuciones, límites de envío y proveedores de modelos.
Las referencias de [Telegram](./tg/configuration.md) y [MAX](./max/configuration.md) enumeran valores
y opciones compatibles. Comprueba el resultado con `config show` después de un cambio.

## Perfiles y bots

Un perfil guarda ajustes de una cuenta o bot. Pon su nombre antes del comando, como
`tg work config show`. Añade `bot` después del nombre para trabajar como bot.
Consulta [Perfiles y bots](./profiles.md).
