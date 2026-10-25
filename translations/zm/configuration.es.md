---
title: "Configuración"
---

Cambia app, fuente o perfil y comprueba los ajustes antes de descargar o iniciar el agente.
La configuración pública elige app y rutas; los tokens quedan en el almacén del sistema.
Esta referencia enumera claves aceptadas y valores predeterminados.

## Ajustes

Configura con `zm config set <key> <value>`, quita un ajuste con `zm config unset <key>` y consulta los valores con
`zm config show`.

| Clave | Significado |
|---|---|
| `zoom.client_id` | Public Client ID de [app existente o nueva](./zoom-app.md); sin valor inicial, necesario para API |
| `source` | Fuente de `meetings sync` y `watch`: `api` predeterminada o `files` |
| `files.folder` | Carpeta para obtención/observación de archivos; sin valor inicial |
| `context.sources` | Array JSON de cuentas de mensajes/correo o carpetas de documentos elegidas para este perfil; vacío por defecto ([configuración abajo](#select-communications-for-preparation)) |
| `files.timezone` | Zona IANA de nombres, por ejemplo `Europe/Madrid`; sin valor: la zona de este ordenador |
| `record` | `true` guarda cada ejecución en el [registro de ejecuciones](#run-log), `false` ninguna, ni siquiera un fallo; sin valor: solo las fallidas |
| `keep_runs_for_days` | cuántos días se conserva una ejecución guardada antes de borrarla; 30 por defecto |

Comprueba `zm config show` tras editar. El perfil no es un ajuste: es la primera palabra de cada comando
([perfiles](./sessions.md#select-a-local-profile)). Otro ID selecciona otra entrada del almacén; autoriza esa app antes de usar API. `ZOOM_CLIENT_ID`
no es un ajuste de la orden instalada `zm`; usa `zm config set zoom.client_id` en vez de la variable
copiada de una sonda de desarrollo.

El archivo guarda estos ajustes como `client_id`, `files_folder`, `files_timezone`, `source`, `context_sources`,
`record` y `keep_runs_for_days`, y los perfiles de este ordenador en `profiles`. Cualquier otra clave es un problema
del archivo.

## Problemas en el archivo

Un archivo con problemas sigue permitiendo `--help`, `--version`, `zm config` y `zm doctor`. Los demás comandos se
detienen en el primer problema, indican cómo quitarlo y cuántos más hay. `zm doctor --json` los enumera todos en
`config.issues`:

```json
{ "kind": "unknown_setting", "file": "/home/you/.config/zm/config.json", "key": "example_setting",
  "what": "setting example_setting is not a setting of zm", "fix": "zm config unset example_setting" }
```

`kind` es `invalid_json`, `unknown_setting`, `unknown_permission` o `invalid_value`. `what` dice qué tiene que ser el
valor y nunca muestra el valor guardado. `fix` funciona tal como está escrito; falta en el JSON no válido, donde `line`
y `column` dicen dónde se detuvo la lectura. Un problema en los permisos de un perfil indica además ese `profile`. Una
parte rota de un ajuste, como una entrada de `context_sources`, se informa como el ajuste entero, y su `fix` lo quita.
Una ruta de configuración que es una carpeta o no se puede leer es un único problema de todo el archivo, sin `fix`.
`zm config show` muestra cada problema tras los ajustes que sí se cargan, y `zm config set` y `zm config unset` cambian
el archivo sin tocar el resto.

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

`zm config set` guarda el archivo para que solo tú puedas leerlo (`0600`). `zm doctor --json` enumera el archivo y
su carpeta en `files.problems` cuando otros usuarios pueden leerlos, cada uno con `path`, `mode` (el encontrado) y
`want`, y escribe en stderr el `chmod` que corrige cada uno. No cambia nada por sí mismo. Windows no se comprueba.

## Permisos

Cada perfil indica qué puede hacer en `permissions`: una ruta de comando, con puntos, y un nivel.

```sh
zm personal config set permissions '{"remote-meetings": "allow", "recordings": "readonly"}'
```

| Nivel | Efecto |
|---|---|
| `deny` | el comando se rechaza |
| `readonly` | solo se ejecuta si no cambia nada, como con `ZM_READ_ONLY` |
| `ask` | un cambio en Zoom pregunta y/N en una terminal; sin terminal necesita `--yes` (si no, código 7) |
| `allow` | se ejecuta; un cambio en Zoom se aplica sin `--yes` |

Gana la clave más específica (`remote-meetings.cancel` sobre `remote-meetings`). De fábrica, `remote-meetings` es `ask`;
una clave más amplia que fija el propietario nunca lo relaja, una clave igual de profunda sí. `--yes` solo responde a `ask`: nunca
levanta `deny` ni `readonly`. En una terminal, los ajustes, el acceso, la ayuda y el servidor MCP nunca se limitan. Una clave que no nombra ningún
comando, o un nivel que no es uno de los cuatro, se rechaza al fijarlo; una ya guardada detiene todos los comandos hasta que
`zm <profile> config unset permissions.<key>` la quita. `ZM_READ_ONLY` se aplica además de cualquier nivel.

Por MCP, los cambios de ajustes, instalación de skills, actualización y temporizadores del archivo
necesitan `mcp.authority` en `allow` o `ask`. Se deniega por defecto. Configúralo desde una terminal en
el mapa `permissions` del perfil, conservando las restricciones existentes, y reinicia el servidor MCP.
Un agente MCP no puede cambiar los permisos del perfil. Consulta [MCP y skills](./mcp.md#the-mcp-server).

## Registro de ejecuciones

`zm` guarda un comando fallido como ejecución: las palabras del comando, el perfil, cómo terminó y un evento por cada
petición a Zoom con su método, ruta (cada id oculto como `:id`), estado y duración. Nunca guarda argumentos, contenido
de reuniones, nombres, correos ni tokens. `--record` guarda también una ejecución correcta, `--no-record` no guarda
nada de ese comando, y el ajuste `record` cambia el comportamiento predeterminado. `zm runs list`,
`zm runs show <run-id>` y `zm runs path <run-id>` leen el registro sin perfil; el `meta.run_id` de una respuesta es
el id que acepta `runs show`.

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
zm research config set context.sources '[{"id":"project-notes","kind":"document","provider":"local","account":"notes:5"}]'
zm config show
```

El ejemplo usa un ID de carpeta inventado. Ejecuta `memo folders list` y sustituye el ID de la
carpeta que elijas y su proveedor: `local` para una carpeta normal, `obsidian` para una bóveda de Obsidian.
`notes:5` resuelve su identidad guardada; no crea ni importa una carpeta.
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
