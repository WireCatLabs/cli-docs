---
title: "Búsqueda y fuentes"
---

Encuentra lo dicho en reuniones guardadas, lee el pasaje exacto con una referencia, recupera el
contexto de una persona, vincula eventos y personas y revisa una tarea basada en su fuente.

## Buscar reuniones guardadas

Para búsquedas limitadas, indexa explícitamente la cola y recorre las páginas:

```sh
zm meetings search-index --limit 100 --max-read-bytes 4194304 --json
zm meetings search-index --limit 100 --yes --json
zm meetings search-page "example plan" --limit 20 --json
zm meetings search-page "example plan" --limit 20 --after <nextCursor> --json
```

La indexación muestra primero un plan; `--yes` aplica un lote y `--dry-run` prevalece. Repite hasta
que la confirmación indique `remaining: 0`. Leer no indexa. La cobertura muestra trabajo pendiente
y una integridad desconocida del índice y archivo. Todas las palabras normalizadas deben coincidir
por prefijos o raíces configuradas. Por defecto se añaden raíces inglesas, rusas y españolas;
pueden cambiarse o desactivarse. No hay componente semántico ni operadores. `--meeting-id`, `--since`
y `--until` limitan la cuenta. El cursor opaco pertenece a la cuenta, consulta y filtros y continúa
incluso dentro de una transcripción larga. JSONL conserva la página con `nextCursor`.

`meetings search` conserva la búsqueda literal por prefijos en transcripciones, chat y resúmenes;
`--since`, `--until`, `--event-id` y `--series-id` la limitan. `meetings people <query>` busca por nombre
o correo. `search all` usa el servicio común y busca solo reuniones por defecto:

```sh
zm search all "example plan" --limit 100 --max-meetings 100 --json
zm meetings evidence meeting:3/15/20/0 --cues 100 --bytes 65536 --json
zm meetings context person:7 --meetings 10 --scan-limit 1000 --json
zm meetings task-proposal meeting:3/15/20/0 --kind promise --json
```

Para otras fuentes indica `--only messages,mail,notes,meetings`. Los mensajes pertenecen a la cuenta
elegida, el correo incluye cuentas guardadas y las notas son globales. Las reuniones usan prefijos;
la sintaxis no admitida y consultas exactas se marcan como omitidas. Para continuar solo reuniones,
pasa `meetings.nextCursor` mediante `--meeting-cursor '<json>'`, vinculado a cuenta y consulta.
JSONL conserva el informe completo, con omisiones, cobertura y cursores.

## Leer fuentes

Las referencias son `meeting:<account>/<meeting>[/<transcript>[/<cue-position>]]` y están limitadas
a la cuenta elegida. Retienen la identidad de revisiones históricas. Se limitan tanto resultados
como lecturas; continúa con `--after` para un pasaje o `--after-transcript-id` para una revisión.
Son opciones excluyentes. `--max-read-bytes` usa 4 MiB por defecto y `--max-transcript-pages` limita
el examen de revisiones, incluso vacías. Consulta los campos de continuación e integridad.

## Contexto de una persona

Usa identidades vinculadas y presencia en la cuenta, sin identificar por nombres de hablantes.
Una persona vinculada no necesariamente habló. Índices pendientes y límites pueden dejar contexto
incompleto. Vincula al participante explícitamente con `meetings link-person`.

## Vincular eventos y personas

La referencia principal es `meeting:<accountId>/<meetingId>`; se añaden revisión y posición del
pasaje para más detalle. Los vínculos de evento y persona usan la principal:

```sh
zm meetings link-event meeting:1/1 --event-id 1 --expected-event-id none --json
zm meetings link-event meeting:1/1 --event-id 1 --expected-event-id none --yes --json
zm meetings link-person meeting:1/1 --participant-id 1 --person 1 --expected-person none --yes --json
```

Primero aparece un plan; `--yes` aplica una vez y `--dry-run` prevalece. Los valores esperados rechazan
una decisión obsoleta. `--event-id none` quita el evento. Solo se mueve la identidad del participante
elegido, sin adivinar por nombre. La persona necesita observaciones autorizadas; `--target-accounts <ids>`
añade cuentas explícitas para buscar. Las etiquetas locales no autentican una identidad remota.

## Notas, etiquetas y recuerdos con memo

[Memo](https://github.com/WireCatLabs/cli-memo) guarda notas, etiquetas y recuerdos comunes. Si cambias
la ruta, usa el mismo `MESSAGING_STORE`. Para el perfil de Zoom `AliceExample`, la cuenta es `zm-profile:AliceExample`:

```sh
memo tags add planning --meeting 1 --provider zoom --account zm-profile:AliceExample --json
memo tags remove planning --meeting 1 --provider zoom --account zm-profile:AliceExample --json
memo notes add --text "Alice Example follow-up" --meeting 1 --provider zoom --account zm-profile:AliceExample --json
memo notes list --about meeting:1/1 --json
memo facts add "Alice Example will review" --type promise --scope work --subject meeting:1/1 --evidence meeting:1/1/1/0 --json
memo facts list --subject meeting:1/1 --json
```

Añadir y quitar en Memo escribe directamente. Los hechos del dueño se aceptan; los enviados mediante
MCP del agente quedan propuestos para revisión. Los recuerdos guardan resúmenes, recopilaciones y
preferencias aparte. Las referencias a revisiones y pasajes siguen disponibles tras correcciones.
Los ejemplos son ficticios: usa los identificadores de tus reuniones y cuenta.

## Propuestas de tareas

Se admiten pregunta, petición, mención y promesa. `applied: false` y `persistence: "proposal-only"`
indican que no se creó una tarea. `zm` no extrae compromisos por sí solo: el agente lee las fuentes
y propone una tarea para el pasaje elegido.

Consulta [búsqueda por significado](./topic-search.md) para otro enfoque.
