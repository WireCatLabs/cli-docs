---
title: "Configuración"
---

Cambia app, fuente o perfil y comprueba los ajustes antes de descargar o iniciar el agente.
La configuración pública elige app y rutas; los tokens quedan en el almacén del sistema.
Esta referencia enumera claves aceptadas y valores predeterminados.

## Ajustes

Configura con `zm config set <key> <value>` y consulta los valores con `zm config show`.

| Clave | Significado |
|---|---|
| `zoom.clientId` | Public Client ID de [app existente o nueva](./zoom-app.md); sin valor inicial, necesario para API |
| `account.profile` | [Etiqueta local](./sessions.md#select-a-local-profile) de reuniones; sin valor inicial, necesaria para la base |
| `source` | Fuente de `pull` y `watch`: `api` predeterminada o `files` |
| `files.folder` | Carpeta para obtención/observación de archivos; sin valor inicial |
| `files.timezone` | Zona IANA de nombres, por ejemplo `Europe/Madrid`; UTC predeterminado |

Comprueba `zm config show` tras editar. Cambiar `account.profile` no cambia el usuario de Zoom.
Otro ID selecciona otra entrada del almacén; autoriza esa app antes de usar API. `ZOOM_CLIENT_ID`
no es un ajuste de la orden instalada `zm`; usa `zm config set zoom.clientId` en vez de la variable
copiada de una sonda de desarrollo.

Una configuración incorrecta permite `--help` y `--version`; los comandos de configuración indican el error.

## Encontrar el archivo de configuración

`zm config set` crea y actualiza `config.json` automáticamente. Contiene ajustes públicos, no
tokens Zoom; no se descarga desde Marketplace. `zm doctor --json` informa de la ruta real sin
comprobar la sesión OAuth guardada.

| Plataforma | Configuración pública predeterminada |
|---|---|
| Linux y macOS | `~/.config/zm/config.json`, o el directorio `zm` dentro de `XDG_CONFIG_HOME` |
| Windows | `%APPDATA%\zm\Config\config.json` |
| Ruta explícita | `config.json` dentro de `ZM_CONFIG_DIR` |

Los directorios antiguos de macOS se migran cuando es posible; doctor muestra la ruta utilizada.
Ajustes públicos, tokens del almacén y base de reuniones son datos separados.

## Variables de entorno

| Variable | Efecto |
|---|---|
| `ZM_CONFIG_DIR` | cambia el directorio de configuración y el servicio del llavero para el acceso |
| `MESSAGING_STORE` | ruta explícita de la base compartida para importar, descargar, observar y leer mediante CLI o MCP |
| `OPENAI_API_KEY` | para un endpoint OpenAI elegido explícitamente ([búsqueda por significado](./topic-search.md)) |

Los directorios siguen la convención de plataforma. La base predeterminada es `wirecat.db`
([almacenamiento](./archive.md#where-meetings-are-stored)). Usa el mismo entorno en terminal y MCP,
o verán perfiles/bases distintos. En [sesiones](./sessions.md) comprueba autorización aparte de estos ajustes.
