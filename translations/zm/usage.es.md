---
title: "Uso"
---

Lee una reunión guardada, abre su transcripción y exporta lo necesario. Esta guía ayuda a elegir
la orden y saber si lee datos locales, contacta con Zoom o modifica algo. Si todavía no hay reuniones,
empieza por [instalar y conectar](./installation.md).

## Lee tu primera reunión

```sh
zm meetings list --json
zm meetings show <meeting-id> --json
zm meetings transcript <meeting-id> --json
zm meetings summary <meeting-id> --json
```

Sustituye `<meeting-id>` por un ID de la lista. Comprueba la fecha y el título antes de usar el texto.
Si falta el resumen o la transcripción, esa parte no se obtuvo; no significa que no se habló.
La lectura usa el perfil local elegido y no descarga datos nuevos de Zoom. La [guía del archivo](./archive.md)
explica cómo recuperar periodos o importar archivos.

Para obtener una copia portable del contenido disponible:

```sh
zm meetings export <meeting-id> --format markdown --json
```

Lee el resultado antes de guardarlo en un archivo. MCP devuelve exportaciones como texto, pero no
escribe archivos. [Búsqueda y fuentes](./search.md) conserva referencias exactas para citar pasajes.

## Elige datos locales o remotos

| Necesidad | Familia de órdenes | Dónde trabaja |
|---|---|---|
| Leer transcripciones y fuentes | `meetings`, `events`, `search` | Base local compartida |
| Obtener reuniones del anfitrión | `meetings sync`, API `watch` | De Zoom a la base local |
| Importar transcripciones | `meetings import`, carpeta `watch` | De archivos a la base |
| Guardar grabaciones disponibles | `recordings` | De Zoom al destino indicado |
| Leer agenda o modificar una reunión | `remote-meetings` | Cuenta de Zoom |

Una lectura local correcta no demuestra que Zoom conserve el mismo contenido. Descargar un archivo
no importa su transcripción en la base hasta que solicites la importación del archivo.

## Comandos

| Comando | Función |
|---|---|
| `config show` | mostrar configuración local |
| `config set <key> <value>` | configurar cliente público u origen de archivos |
| `session start [--browser <program>]` | autorizar acceso en el navegador |
| `commands --json` | descubrir argumentos, opciones y ejemplos |
| `complete -- <words...>` | responder a autocompletado |
| `doctor` | inspeccionar entorno y configuración sin acceso ni base |
| `session status` | comprobar OAuth aparte de perfiles locales |
| `meetings import <folder>` | importar transcripciones al perfil elegido |
| `meetings sync [--since-time <time>]` | descargar reuniones del origen configurado |
| `meetings list`, `meetings show <meeting>` | leer reuniones guardadas |
| `meetings transcript <meeting>` | leer transcripciones actuales |
| `meetings summary <meeting>` | leer resúmenes guardados |
| `meetings export <meeting> --format markdown\|vtt` | exportar contenido guardado |
| `search meetings <query>`, `meetings people <query>` | buscar texto o participantes |
| `meetings update <reference>`, `meetings link <reference>` | revisar o aplicar vínculos elegidos |
| `meetings transcribe <meeting> <file> --model <model>` | revisar o reconocer un WAV como transcripción independiente |
| `meetings passage <reference>`, `meetings evidence <reference>`, `meetings context <person>` | leer fuentes limitadas o contexto personal vinculado |
| `meetings task-proposal <reference> --type <type>` | revisar una tarea con su fuente |
| `search meetings <query> --model <model>` | buscar por significado, generando primero los vectores que faltan |
| `meetings embeddings --model <model>` | revisar generación; `--yes` aplica un lote |
| `search all <query>` | buscar reuniones o recursos elegidos explícitamente |
| `events list` | leer eventos guardados |
| `watch [api\|files] [folder] --jsonl` | importar repetidamente en primer plano |
| `recordings list`, `recordings show <meeting>` | descubrir grabaciones y metadatos |
| `recordings download <meeting> --destination <directory>` | archivar archivos disponibles |
| `recordings sync --since-time <date> --until-time <date> --destination <directory> --jsonl` | archivar historial por meses |
| `recordings schedule create\|list\|show\|run\|disable` | gestionar trabajos diarios de archivo |
| `recordings archive show\|check\|locks <directory>` | inspeccionar manifiestos, sumas o bloqueos |
| `recordings archive recover <directory>` | revisar recuperación de bloqueos obsoletos |
| `recordings archive transcript <directory>` | leer WebVTT verificado sin base de datos |
| `search meetings <query> --archive <directory>` | buscar texto verificado sin base |
| `recordings archive import <directory>` | verificar VTT y añadirlo a reuniones guardadas |
| `remote-meetings list\|show\|invitation` | leer próximas reuniones e invitaciones |
| `remote-meetings create\|update\|cancel` | revisar o aplicar un cambio simple en Zoom |
| `serve --mcp` | servir lecturas de reuniones por MCP stdio |
| `skill show`, `skill install --for agents` | mostrar o instalar instrucciones del agente |

`meetings` usa IDs locales; `remote-meetings`, IDs numéricos de Zoom.
[Gestionar reuniones](./remote-meetings.md) explica las escrituras.

## Salida para scripts y agentes

`--json` produce un valor. `--jsonl` transmite los elementos normales uno por línea; las listas
de reuniones guardadas y las páginas acotadas de participantes conservan un sobre completo por línea,
con continuación y cobertura. Los errores van a stderr; `--quiet` omite
otros diagnósticos. Las tuberías reciben JSON por defecto y la terminal una salida legible.
El autocompletado emite el protocolo de la shell salvo que pidas JSON.

`--fields id,title` elige campos. `--offline` rechaza la red. Los comandos finitos conservan la salida
hasta liberar recursos; el límite predeterminado es 4 MiB. `--max-output-bytes 0` lo elimina.

## Plazos y cancelación

`--timeout <milliseconds>` establece un plazo positivo para todo el comando. También acepta `30s`,
`5m` y `1h`. Lecturas: 30 segundos; acceso: cinco minutos; descargas, sincronización y verificación:
una hora. El seguimiento y MCP no tienen plazo predeterminado. La cancelación espera operaciones
y limpieza; una operación inyectada que ignore la señal puede retrasar la salida.
