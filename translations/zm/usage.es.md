---
title: "Uso"
---

Grupos de comandos, salida, plazos y cancelación para scripts y agentes.
[Todos los comandos y opciones](./commands.md) se generan desde el programa.

## Comandos

| Comando | Función |
|---|---|
| `config show` | mostrar configuración local |
| `config set <key> <value>` | configurar cliente público u origen de archivos |
| `login [--browser <program>]` | autorizar acceso en el navegador |
| `commands --json` | descubrir argumentos, opciones y ejemplos |
| `complete -- <words...>` | responder a autocompletado |
| `doctor` | inspeccionar entorno y configuración sin acceso ni base |
| `session status` | comprobar OAuth aparte de perfiles locales |
| `import <folder>` | importar transcripciones al perfil elegido |
| `pull [--since <date>]` | descargar reuniones del origen configurado |
| `meetings list`, `meetings show <meeting>` | leer reuniones guardadas |
| `meetings transcript <meeting>` | leer transcripciones actuales |
| `meetings summary <meeting>` | leer resúmenes guardados |
| `meetings export <meeting> --format markdown\|vtt` | exportar contenido guardado |
| `meetings search <query>`, `meetings people <query>` | buscar texto o participantes |
| `meetings search-page <query>`, `meetings search-index` | continuar resultados e indexar palabras explícitamente |
| `meetings link-event <reference>`, `meetings link-person <reference>` | revisar o aplicar vínculos elegidos |
| `meetings transcribe <meeting> <file> --model <model>` | revisar o reconocer un WAV como transcripción independiente |
| `meetings evidence <reference>`, `meetings context <person>` | leer fuentes limitadas o contexto personal vinculado |
| `meetings task-proposal <reference> --kind <kind>` | revisar una tarea con su fuente |
| `meetings semantic <query> --model <id>` | ordenar vectores examinados con componente explícito |
| `meetings embeddings --model <id>` | revisar generación; `--yes` aplica un lote |
| `search all <query>` | buscar reuniones o recursos elegidos explícitamente |
| `events list` | leer eventos guardados |
| `watch [folder] --source api\|files --jsonl` | importar repetidamente en primer plano |
| `recordings list`, `recordings show <meeting>` | descubrir grabaciones y metadatos |
| `recordings download <meeting> --destination <directory>` | archivar archivos disponibles |
| `recordings sync --from <date> --to <date> --destination <directory> --jsonl` | archivar historial por meses |
| `recordings schedule create\|list\|show\|run\|disable` | gestionar trabajos diarios de archivo |
| `recordings archive inspect\|verify\|locks <directory>` | inspeccionar manifiestos, sumas o bloqueos |
| `recordings archive recover <directory>` | revisar recuperación de bloqueos obsoletos |
| `recordings archive transcript <directory>` | leer WebVTT verificado sin base de datos |
| `recordings archive search <directory> <query>` | buscar texto verificado sin base |
| `recordings archive import <directory>` | verificar VTT y añadirlo a reuniones guardadas |
| `remote-meetings list\|show\|invitation` | leer próximas reuniones e invitaciones |
| `remote-meetings create\|update\|cancel` | revisar o aplicar un cambio simple en Zoom |
| `serve --mcp` | servir lecturas de reuniones por MCP stdio |
| `skill show`, `skill install --for agents` | mostrar o instalar instrucciones del agente |

`meetings` usa IDs locales; `remote-meetings`, IDs numéricos de Zoom.
[Gestionar reuniones](./remote-meetings.md) explica las escrituras.

## Salida para scripts y agentes

`--json` produce un valor; `--jsonl`, un objeto por línea. Los errores van a stderr; `--quiet` omite
otros diagnósticos. Las tuberías reciben JSON por defecto y la terminal una salida legible.
El autocompletado emite el protocolo de la shell salvo que pidas JSON.

`--fields id,title` elige campos. `--offline` rechaza la red. Los comandos finitos conservan la salida
hasta liberar recursos; el límite predeterminado es 4 MiB. `--max-output-bytes 0` lo elimina.

## Plazos y cancelación

`--timeout <milliseconds>` establece un plazo positivo para todo el comando. También acepta `30s`,
`5m` y `1h`. Lecturas: 30 segundos; acceso: cinco minutos; descargas, sincronización y verificación:
una hora. El seguimiento y MCP no tienen plazo predeterminado. La cancelación espera operaciones
y limpieza; una operación inyectada que ignore la señal puede retrasar la salida.
