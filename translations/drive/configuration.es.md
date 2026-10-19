---
title: "Ajustes"
---

Controla dónde guarda Drive su copia local, qué puede hacer cada perfil y qué proveedor de IA
usa la extracción opcional de recuerdos. Abre esta guía para guardar una elección o cambiar el
comportamiento de una cuenta. Aprenderás dónde está el archivo, cómo modificar un valor y cómo
se distinguen los ajustes guardados, las variables de entorno y las opciones de comandos.

Un **ajuste** es un valor guardado en `config.json`. Un **perfil** es la configuración con nombre
de una cuenta de Google. Una **variable de entorno** viene del terminal o proceso del agente;
una **opción** afecta a una ejecución. Son formas distintas de controlar la herramienta.

## Dónde están los archivos

| Sistema | Archivo de configuración | Datos y copias locales |
| --- | --- | --- |
| Linux | `~/.config/drive-cli/config.json` | `~/.local/share/drive-cli/` |
| macOS | `~/.config/drive-cli/config.json` | `~/Library/Application Support/drive-cli/` |
| Windows | `%APPDATA%\drive-cli\Config\config.json` | `%LOCALAPPDATA%\drive-cli\Data\` |

Son los valores del sistema; las variables de abajo pueden moverlos. La configuración contiene
ID de carpetas seleccionadas, identidad de la cuenta y ajustes, no tokens OAuth. Los tokens se
guardan en el almacén de credenciales, salvo que elijas explícitamente un archivo al conectar.
En Linux, la base predeterminada es `~/.local/share/WireCat/wirecat.db`; las copias y puntos de control
están en `profiles/PROFILE_NAME/`. Lee sobre [almacenamiento local](./usage.md#disk-use-index-without-an-export-directory)
antes de moverlos o borrarlos.

Los archivos con nombres antiguos en camelCase se migran a snake_case en la primera lectura
correcta. Conservan sus permisos y no se reescriben si no hay cambios. Se mantienen los nombres
de perfiles, las rutas de permisos y los nombres de usos de modelos. Los valores antiguos y
nuevos que entren en conflicto se rechazan.

## Ajustes guardados

| Clave | Qué controla | Alcance |
| --- | --- | --- |
| `read_only` | Rechaza cambios locales y remotos, incluida la sincronización y añadir notas | Perfil o `defaults` |
| `permissions` | Acceso por comando: `deny`, `readonly`, `ask` o `allow` | Perfil o `defaults` |
| `max_text_chars` | Máximo de caracteres por archivo; valor predeterminado y máximo `2000000`, límite de los lectores | Perfil o `defaults` |
| `picture_search` | `true` busca imágenes por su contenido: sync descarga imágenes de hasta 25 MB y la búsqueda devuelve `pictures`; predeterminado `false` | Solo perfil |
| `models.memories.provider` | Proveedor de IA para la extracción solicitada explícitamente | Perfil o `defaults` |
| `models.memories.model` | Identificador del modelo del proveedor | Perfil o `defaults` |
| `models.memories.base_url` | Dirección opcional del proveedor configurado | Perfil o `defaults` |

Los datos de la cuenta se gestionan aparte: `session start` guarda identidad y almacenamiento
de credenciales; `folders add`/`folders remove` cambian las raíces elegidas. No guardes tokens
de acceso ni claves de proveedores en el archivo de configuración.

## Cambiar y comprobar un valor

```text prompt
Use drive CLI with profile personal. Show the saved settings and explain which actions they allow.
Set remote file operations to read-only, keeping local indexing and notes available.
Show the saved change; do not change Google files.
```

Para uso manual:

```sh
drive personal config show --json
drive personal config set permissions.files '"readonly"'
drive personal config set permissions.documents '"readonly"'
drive personal config show --json
```

Estos permisos limitan las familias de comandos de archivos y Docs en Google. La sincronización
local y las notas tienen claves separadas. `read_only true` es más amplio: también bloquea cambios
locales, así que no lo actives si quieres importar o etiquetar. Revisa la [referencia de comandos](./commands.md)
y los [permisos de datos](./security.md) antes de elegir reglas más amplias.

`config set` cambia el perfil elegido salvo que añadas `--defaults`. Por ejemplo:

```sh
drive personal config set read_only true --defaults
drive work config set read_only false
drive personal config show --json
```

La primera línea cambia el valor compartido; la segunda lo sustituye para `work`. La última
imprime ambas secciones, no una lista combinada de valores efectivos.

`drive personal config set picture_search true` activa imágenes solo para `personal`.
Descarga primero el modelo local compartido `clip-b32` (unos 160 MB) y escribe consultas en inglés. La descarga no
necesita perfil ni inicio de sesión:

```sh
drive images models download clip-b32
```

`drive personal config set max_text_chars 500000` omite textos más largos con su razón; se leen
en el siguiente sync después de aumentar el límite.

Omitir el perfil es un error: `DRIVE_PROFILE` y un antiguo perfil predeterminado guardado no lo seleccionan.

## Variables de entorno

Afectan al proceso que ejecuta Drive; `config set` no las guarda.

| Variable | Para qué sirve |
| --- | --- |
| `DRIVE_TIMEOUT` | Plazo para todo el comando, como `--timeout` (`500ms`, `30s`, `2m`); por defecto 30 segundos |
| `DRIVE_READ_ONLY` | Cualquier valor salvo `0` o vacío: todos los comandos rechazan cambios, locales o en Google, con salida 5, igual que `--read-only` |
| `DRIVE_PROFILE_LOCK` | Fija el proceso a un perfil: nombrar cualquier otro perfil se rechaza con salida 5 |
| `DRIVE_CONFIG_DIR` | Mover `config.json` y el espacio asociado de credenciales |
| `DRIVE_STATE_DIR` | Mover copias y puntos de control |
| `DRIVE_CACHE_DIR` | Mover la caché de la herramienta; no mueve las copias de documentos |
| `MESSAGING_STORE` | Elegir el archivo de la base compartida en lugar de la base WireCat predeterminada |
| `WIRECAT_STATE_DIR` | Mueve la carpeta WireCat con la base y los modelos compartidos; por defecto `~/.local/share/WireCat/` |
| `DRIVE_GOOGLE_CLIENT_ID`, `DRIVE_GOOGLE_CLIENT_SECRET` | Usar tu aplicación Desktop OAuth en lugar de la incluida de WireCat; configura el ID antes de su secret |
| `DRIVE_MODELS_MEMORIES_PROVIDER`, `DRIVE_MODELS_MEMORIES_MODEL`, `DRIVE_MODELS_MEMORIES_BASE_URL` | Sustituir los ajustes de extracción de recuerdos para el proceso |
| `DRIVE_OPENAI_API_KEY`, `DRIVE_ANTHROPIC_API_KEY` | Proporcionar la clave del proveedor; también se acepta la variable correspondiente sin prefijo |

Mantén las mismas rutas al conectar y en comandos posteriores: cambiarlas puede cambiar la
entrada de credenciales que ve el CLI. Si defines `WIRECAT_STATE_DIR`, la preparación del
modelo y la creación de embeddings deben usar ese mismo directorio.

## Opciones de una ejecución

| Opción | Efecto en esta ejecución |
| --- | --- |
| `--profile NAME` o la primera palabra `NAME` | Elegir explícitamente el perfil de Google |
| `--offline` | Rechazar Google, sincronización y extracción con IA; responder con la copia local |
| `--read-only` | Rechazar cambios locales y remotos |
| `--permission KEY=LEVEL` | Sustituir temporalmente el permiso de un comando |
| `--dry-run` | Validar y mostrar una operación compatible sin ejecutarla |
| `--json`, `--jsonl` | Salida estructurada; `--json=id,name` conserva solo esos campos; MCP muestra los caracteres de control de forma visible |
| `--timeout DURATION`, `--max-output-bytes N` | Limitar el tiempo del comando y la salida almacenada en búfer |

Estas opciones no son ajustes del archivo. Las de cada comando, como `search --limit` y
`sync --limit`, se explican en su referencia. Los permisos temporales tienen prioridad sobre los
del perfil y después los compartidos. Un `read_only true` guardado sigue limitando incluso con
permiso `allow`. Las variables de IA tienen prioridad sobre el modelo y proveedor del perfil
o de los valores compartidos.

## Extracción opcional con IA

Configura la extracción una vez y revisa el resultado antes de guardar recuerdos:

```sh
drive personal config set models.memories.provider '"openai"'
drive personal config set models.memories.model '"YOUR_MODEL_ID"'
drive personal config show --json
```

Sustituye `YOUR_MODEL_ID` por el identificador del proveedor. Proporciona la clave por el entorno,
no en el chat del agente. La extracción envía el texto local seleccionado a ese proveedor.
La búsqueda por palabras y los embeddings locales son operaciones separadas sin clave de IA.
Consulta [extraer recuerdos](./recipes.md#remember-a-source-backed-decision) para revisar y guardar.

<a id="share-a-store-deliberately"></a>

## Documentos y mensajes compartidos

Drive usa la misma base WireCat que Memo, Telegram y MAX. Los documentos importados aparecen en
sus búsquedas locales con su enlace de Google y la última fecha de edición en Google. Una
sincronización correcta registra el perfil Drive seleccionado junto a su colección importada.
La búsqueda Drive lee la cuenta Google elegida; las búsquedas combinadas de otras herramientas
pueden cubrir varias fuentes guardadas. Las copias y los puntos de control siguen en
`DRIVE_STATE_DIR`; `MESSAGING_STORE` selecciona la base. Compartir almacenamiento no comparte
conexiones ni permisos de Google.

Al pasar de una base separada antigua, Drive reconstruye las referencias desde las copias locales
y conserva el archivo original. Puedes repetir una reconstrucción interrumpida. Si faltan copias,
ejecuta `drive personal sync --rescan` para volver a descargar las fuentes seleccionadas.

Drive se detiene si la base anterior contiene anotaciones que quedarían fuera de la nueva base.
Para seguir usándolas, apunta `MESSAGING_STORE` al archivo anterior; no lo borres. No hay
transferencia automática de anotaciones del usuario entre bases.

Continúa con [vincular documentos con personas y proyectos](./recipes.md#link-a-document-to-a-person-or-project).
