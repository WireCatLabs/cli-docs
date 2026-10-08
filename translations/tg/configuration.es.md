---
title: "Configuración"
---

Puedes configurar `tg`. Puedes guardar los ajustes habituales, cambiar un valor para un comando
o elegir otro perfil. Los permisos se explican por separado en [Permisos](./permissions.md).

## El archivo

Las herramientas crean un `config.json` inicial con los valores predeterminados habituales la primera vez que ejecutas un comando que
carga ajustes. Se conserva un archivo existente. Usa estos comandos para ver su ruta y los valores actuales:

```sh
tg config show
```

Puedes editar el archivo o usar `config set` y `config unset`. No guardes en él las credenciales de acceso;
usa los comandos de inicio de sesión y configuración del proveedor de modelos.

| Sistema | Telegram |
|---|---|
| Linux | `~/.config/tg-cli/config.json` |
| macOS | `~/Library/Application Support/tg-cli/config.json` |
| Windows | `%APPDATA%\tg-cli\config.json` |

Usa `tg.cmd` en PowerShell. Los comandos anteriores muestran la ubicación real si tu
ordenador usa un directorio personalizado.

## Tres formas de establecer un valor

- **Archivo:** un valor queda guardado para los comandos siguientes. `tg config set limit 50` guarda un límite de resultados.
- **Variable de entorno:** un terminal puede seleccionar un perfil o un límite de tiempo del comando para su sesión.
  Por ejemplo, `TG_PROFILE` elige un perfil. No todos los ajustes tienen una variable.
- **Opción del comando:** una opción como `--limit 5` cambia solo esta invocación.

## ¿Qué valor tiene prioridad?

Una opción del comando tiene prioridad sobre una variable de entorno, después viene el valor guardado del perfil seleccionado,
luego los valores predeterminados compartidos del archivo y, por último, el valor integrado. Solo intervienen las formas admitidas de establecer
ese valor concreto. La referencia de cada servicio de mensajería las enumera.

## Una pequeña configuración

```json
{
  "defaults": { "limit": 20, "sendsPerHour": 30 },
  "profiles": { "work": { "limit": 50 } }
}
```

`tg work chats list` usa 50. Añade `--limit 5` para obtener cinco resultados para ese comando.
Eliminar el valor del perfil permite volver a aplicar el valor predeterminado compartido.

## ¿Qué puedo configurar?

Los ajustes habituales incluyen el número de resultados, el color, el registro, los límites de envío y los proveedores de modelos.
Consulta la [referencia de ajustes](./configuration-reference.md)
para ver los valores disponibles y las sustituciones admitidas. Usa `config show` tras un cambio para comprobar el resultado.

## Perfiles y bots

Un perfil guarda los ajustes de una cuenta o un bot. Pon su nombre antes del comando, como
`tg work config show`. Añade `bot` para trabajar como bot en lugar de tu cuenta personal.
[Perfiles y bots](./profiles.md) explica cómo elegirlos y cambiar entre ellos.

<a id="what-a-profile-may-do" />

<a id="a-question-before-a-change" />

Lee [Permisos](./permissions.md) para conocer el acceso y las confirmaciones del terminal.
