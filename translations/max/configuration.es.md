---
title: "Configuración"
---

Puedes configurar `max` guardando valores habituales, cambiando una ejecución o eligiendo otro perfil. El acceso del asistente se explica por separado en [Permisos](./permissions.md).

## Archivo

El primer comando que lee la configuración crea `config.json` con los valores predeterminados habituales. Si el archivo ya existe, se conserva. Para ver su ruta y los valores actuales:

```sh
max config show
```

Edita el archivo manualmente o con `config set` y `config unset`. No guardes credenciales de inicio de sesión en él: usa los comandos de inicio de sesión y de configuración del proveedor de modelos.

| Sistema | MAX |
|---|---|
| Linux | `~/.config/max-cli/config.json` |
| macOS | `~/Library/Application Support/max-cli/config.json` |
| Windows | `%APPDATA%\max-cli\config.json` |

Usa `max.cmd` en PowerShell. Los comandos anteriores muestran la ubicación real si tu ordenador utiliza otra carpeta.

## Tres formas de establecer un valor

- **Archivo:** el valor se conserva para los siguientes comandos. `max config set limit 50` guarda el límite de resultados.
- **Variable de entorno:** el terminal puede elegir un perfil o un tiempo límite para su sesión. Por ejemplo, `MAX_PROFILE` elige el perfil. No todos los ajustes tienen una variable de entorno.
- **Opción del comando:** una opción como `--limit 5` cambia únicamente esa ejecución.

## ¿Qué valor tiene prioridad?

Primero la opción del comando, después la variable de entorno, el valor del perfil elegido en el archivo, los `defaults` compartidos y el valor integrado. Solo se aplican los métodos compatibles con cada ajuste; se enumeran en la referencia del mensajero.

## Ejemplo breve

```json
{
  "defaults": { "limit": 20, "sendsPerHour": 30 },
  "profiles": { "work": { "limit": 50 } }
}
```

`max work chats list` usa 50. Añade `--limit 5` para obtener cinco resultados en un comando. Al eliminar el valor del perfil, vuelve a aplicarse el valor compartido.

## ¿Qué puedes configurar?

El número de resultados, el color, el registro de ejecuciones, los límites de envío y los proveedores de modelos. La [referencia de configuración](./configuration-reference.md) enumera los valores y las formas de sustituirlos. Después de hacer cambios, compruébalos con `config show`. Los proveedores, las claves y la elección del modelo para OCR se explican en la [guía de modelos externos](./external-models.md).

## Perfiles y bots

Un perfil guarda los ajustes de una cuenta o un bot. Pon su nombre antes del comando, por ejemplo `max work config show`. Para un bot, añade `bot` después del nombre. Consulta [Perfiles y bots](./profiles.md).

<a id="права-доступа" />

Los permisos se explican por separado en [Permisos](./permissions.md).
