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
| `zoom.client_id` | Public Client ID de [app existente o nueva](./zoom-app.md); sin valor inicial, necesario para API |
| `account.profile` | [Etiqueta local](./sessions.md#select-a-local-profile) de reuniones; sin valor inicial, necesaria para la base |
| `source` | Fuente de `meetings sync` y `watch`: `api` predeterminada o `files` |
| `files.folder` | Carpeta para obtención/observación de archivos; sin valor inicial |
| `context.sources` | Array JSON de cuentas de mensajes/correo o carpetas de documentos elegidas para este perfil; vacío por defecto ([configuración abajo](#select-communications-for-preparation)) |
| `files.timezone` | Zona IANA de nombres, por ejemplo `Europe/Madrid`; UTC predeterminado |

Comprueba `zm config show` tras editar. Cambiar `account.profile` no cambia el usuario de Zoom.
Otro ID selecciona otra entrada del almacén; autoriza esa app antes de usar API. `ZOOM_CLIENT_ID`
no es un ajuste de la orden instalada `zm`; usa `zm config set zoom.client_id` en vez de la variable
copiada de una sonda de desarrollo.

El archivo guarda estos ajustes como `client_id`, `files_folder`, `files_timezone`, `account_profile` y `source`.
Los archivos JSON deben usar esas claves snake_case. Los antiguos archivos camelCase se rechazan sin
reescribirlos. Antes de actualizar, renombra `clientId` a `client_id`, `filesFolder` a `files_folder`,
`filesTimezone` a `files_timezone` y `accountProfile` a `account_profile`. Conserva sus valores.
El selector de comando `zoom.clientId` sigue como alias de
`zoom.client_id`, pero no se admite como clave JSON.

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

Los directorios antiguos de macOS ya no se trasladan automáticamente; doctor muestra la ruta utilizada.
Ajustes públicos, tokens del almacén y base de reuniones son datos separados.

## Variables de entorno

| Variable | Efecto |
|---|---|
| `ZM_CONFIG_DIR` | cambia el directorio de configuración y el servicio del llavero para el acceso |
| `ZM_STATE_DIR` | cambia el directorio de las ejecuciones registradas (`runs/`) |
| `ZM_CACHE_DIR` | cambia el directorio de caché |
| `ZM_READ_ONLY` | `1` rechaza los cambios en Zoom, el acceso, los ajustes y lo que hayas añadido, con código 5; la lectura y la sincronización desde Zoom siguen funcionando ([seguridad](./security.md#what-agents-can-do)) |
| `WIRECAT_STATE_DIR` | mueve la carpeta WireCat que comparten todas las CLI de WireCat: la base y los modelos de voz |
| `MESSAGING_STORE` | ruta explícita de la base compartida para importar, descargar, observar y leer mediante CLI o MCP |
| `OPENAI_API_KEY` | para un endpoint OpenAI elegido explícitamente ([búsqueda por significado](./topic-search.md)) |

Los directorios siguen la convención de plataforma. La base predeterminada es `wirecat.db`
(`~/.local/share/WireCat/wirecat.db`, en Windows `%LOCALAPPDATA%\WireCat\Data\wirecat.db`)
([almacenamiento](./archive.md#where-meetings-are-stored)). Usa el mismo entorno en terminal y MCP,
o verán perfiles/bases distintos. En [sesiones](./sessions.md) comprueba autorización aparte de estos ajustes.

## Elige fuentes para la preparación

La preparación puede buscar en cuentas y carpetas ya importadas al almacén compartido. Elige primero
el perfil local de Zoom y guarda hasta ocho fuentes para él. Cada entrada necesita ID, tipo kind,
proveedor provider y cuenta account. Para mensajes y correo usa las identidades guardadas exactas;
cópialas de los ajustes del programa de origen o de sus referencias. El nombre visible no sustituye
la identidad de la cuenta.

```sh
zm config set account.profile research
zm config set context.sources '[{"id":"project-notes","kind":"document","provider":"folder","account":"notes:5"}]'
zm config show
```

El ejemplo usa un ID de carpeta inventado. Ejecuta `memo folders list` y sustituye el ID de la
carpeta que elijas. `notes:5` resuelve su identidad guardada; no crea ni importa una carpeta.
Una fuente de documentos selecciona una carpeta; una de mensajes, una cuenta de mensajería; una
de correo, una cuenta de correo. El permiso cubre toda la cuenta o carpeta: todavía no permite
restringir chats, remitentes o rutas dentro de ella. Elige un alcance adecuado para tu tarea.

El ajuste reemplaza las fuentes del perfil actual y conserva los otros perfiles. Usa `[]` para
revocar las de este perfil. Se rechazan los ID e identidades duplicados, los campos desconocidos y
más de ocho entradas. El archivo JSON guarda el array en `context_sources`, con `profile` en cada
entrada. Usa `config set` para no editar ese formato a mano.

Solo una petición explícita de preparación resuelve y consulta las fuentes solicitadas. Una fuente
configurada que no pediste y no está disponible no bloquea las demás. Las lecturas normales de
reuniones no adquieren acceso a otras cuentas. El servidor MCP captura las definiciones al arrancar
y fija la identidad de cada fuente solicitada en su primer uso. Reinícialo tras cambiar o revocar
selecciones. Una identidad ausente o distinta produce un error; no se eligen fuentes automáticamente.
