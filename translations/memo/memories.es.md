---
title: "Recuerdos y hechos"
---

Esta página te ayuda a dejar que tu agente de IA recuerde lo que aprendió y registre lo que pasó,
mientras tú decides qué se guarda. Memo guarda tres tipos de registros, cada uno con las fuentes que lo
demuestran:

- un **recuerdo**: algo que se concluye, como "Kai prefiere las reuniones los viernes";
- un **hecho**: algo que pasó, como una decisión, una promesa o una pregunta;
- una **acción propuesta**: algo que un agente quiere hacer, como una respuesta.

## Revisar lo que sugirió tu agente

```text prompt
Use memo CLI to show the memories, facts and actions waiting for my review, with their evidence.
Do not confirm or approve anything; I will decide.
```

O hazlo tú:

```sh
memo memories list status:proposed
memo facts list status:proposed
memo actions list status:proposed
```

Abre cada fuente, luego confirma lo que es correcto y deja o rechaza el resto. El resto de esta página
explica cómo.

Para un lote de hechos y tareas con citas de reuniones, usa la [revisión de conclusiones de reuniones](#meeting-findings) de abajo.

Para fuentes reunidas en un proyecto, usa la [revisión de propuestas de proyecto](./recipes.md#review-project-facts-and-follow-ups).
Por defecto solo tú decides esas propuestas. Configura [`agent_decisions: true`](./configuration.md#agent_decisions)
para que un agente las decida con un motivo registrado, creando hechos aceptados y tareas numeradas. Las decisiones sobre hallazgos de reuniones requieren permisos explícitos.

**Qué espera tu decisión.** Una acción propuesta siempre espera aprobación o rechazo. Un recuerdo o hecho registrado directamente espera cuando lo añade un agente: mediante [MCP](./mcp.md) o `memo` en su terminal (con `AI_AGENT` o `CLAUDECODE`), que registra al agente como autor. Si lo añades tú en un terminal, el recuerdo se confirma y el hecho se acepta al instante. En un terminal de agente, `--as-owner`
lo hace tuyo después de que respondas y en el terminal. WireCat Desktop pasa `--from-app`, que registra como tuyo lo que
haces en la aplicación.

## Recuerdos

Un recuerdo es una conclusión breve con su **evidencia**: las referencias de los mensajes, notas o
reuniones que lo demuestran. Tiene un tipo y un ámbito:

- tipo: `preference` (lo que alguien prefiere o quiere), `summary` o `digest`;
- ámbito: `personal` o `work`.

```sh
memo memories add 'Kai Sample prefers Friday meetings' --kind preference --scope work --evidence note:12
memo memories list kind:preference scope:work
memo memories show memory:3 --sources
memo search memories friday meetings scope:work
memo memories confirm memory:3
memo memories invalidate memory:3
```

Un recuerdo que añades con `memo` se confirma al instante. El de un agente queda `proposed` hasta que revises las fuentes y lo marques con `confirm`. Si la evidencia deja de ser válida, por ejemplo Kai prefiere ahora los lunes, márcalo `stale`. `--subject person:…` indica de quién o de qué trata.
`--project SYH` lo pone en un proyecto, por clave o `project:<id>`; `memories update memory:4 --project LHT` lo mueve, y
`--project none` lo saca. `memories list` filtra por `kind`, `status`, `scope`, `subject` y `project` en la consulta:
`subject:"person:42"`, `project:SYH`.
Cada recuerdo lleva `subject_name`, cómo se llama su sujeto, `subject_is_owner` cuando trata de ti, y `project_name`
junto a `project`.
`show --sources` lee de vuelta cada prueba: el remitente o el título, la hora, un extracto corto y
`missing: true` si la fuente se borró desde entonces.

## Corregir u olvidar

Tres formas de tratar un recuerdo o un hecho erróneo, de conservar lo máximo a no conservar nada:

```sh
memo memories add 'Kai Sample prefers Monday calls' --kind preference --scope work --evidence note:12 --supersedes memory:3
memo memories invalidate memory:3
memo memories remove memory:3
memo facts reject fact:4
memo facts remove fact:4
```

- **Corregir**: añade el recuerdo correcto con `--supersedes`. El antiguo queda marcado `superseded`, así que conservas
  el registro del error. Tu corrección se aplica al instante. La corrección de un agente espera como propuesta hasta
  que la confirmes, y el recuerdo que corrige sigue igual hasta entonces. Si rechazas o quitas la corrección, el
  recuerdo se queda como estaba. Un recuerdo solo se sustituye una vez.
- **Ya no es cierto**: `invalidate` marca un recuerdo como `stale`; `facts reverse` lo hace con una decisión aceptada y
  `facts reject` rechaza un hecho que propuso un agente. Cada uno conserva el registro.
- **Olvidar**: `remove` borra el registro: su texto, sus vínculos con las fuentes y su entrada en la búsqueda de Memo. Los
  mensajes, notas y reuniones que cita se quedan. Una copia de seguridad del almacén hecha antes lo conserva hasta que se borre esa copia.

Un agente no puede olvidar ni rechazar a través del servidor MCP. Una corrección que propone allí te espera como
cualquier otra.

## Cuando cambia una fuente

Un recuerdo o un hecho se apoya en sus fuentes. Cuando una de ellas cambia, desaparece o alguien la contradice, Memo
abre para ti una **revisión de la fuente** y marca el registro, pero nunca cambia su estado. Sigue confirmado o
aceptado hasta que decidas.

**Verlo.** `memo sync` termina con el paso «memories follow sources», así que el temporizador lo comprueba por ti.
Para comprobarlo ahora:

```sh
memo memories check
memo review list kind:memory_source_review
memo memories show memory:3
```

`memories show`, `memories list`, `facts show` y `facts list` tienen el campo `source_review`. Contiene el número de
la revisión abierta y su causa, o `null`. Las causas, de la más leve a la más grave:

- `changed`: alguien editó una fuente, y las palabras en las que se apoya el registro ya no están o nunca se citaron.
- `outdated`: un recuerdo o un hecho citado fue sustituido o retirado. La revisión dice qué lo sustituyó.
- `deleted`: se borró una fuente.
- `contradicted`: tú o un agente ejecutasteis `challenge` con una evidencia que dice otra cosa.

Una fuente que cambió pero sigue diciendo las palabras citadas no abre nada. Un registro escrito antes de que Memo
guardara firmas de las fuentes abre una revisión solo si su fuente cambió después de citarla. `memo review agenda`
lista en su sección `sources` las revisiones abiertas dentro de `--since-time` (un día si no indicas otra cosa) y las
fuentes que cambiaron en ese tiempo y que ninguna revisión nombra. Una revisión que solo creció no vuelve a aparecer.

**Decidir.**

```sh
memo review show 17090
memo review confirm 17090
memo review reject 17090 --reason 'the edit is a typo fix'
```

`review show` muestra cada fuente tal como se citó y tal como está ahora, la cita, cada objeción con su evidencia y su
motivo y la redacción sugerida si la hay. Después da el comando para cada respuesta:

- **Sigue siendo cierto**: `review confirm`. El recuerdo cuenta como comprobado ahora.
- **Descartar**: `review reject --reason`.
- **Corregir o sustituir**: añade el correcto con `memories add … --supersedes memory:3` o `facts add …
  --supersedes fact:4`, como en [Corregir u olvidar](#correct-or-forget).
- **Retirar**: `memories invalidate memory:3` o `facts reverse fact:4`.

Confirm y reject vuelven a firmar las fuentes tal como están ahora, así que el mismo cambio no vuelve. Solo tú decides
una revisión de la fuente. WireCat Desktop pasa `--from-app`, que registra la decisión como tuya.

**Encontrar la evidencia original.** `memories show memory:3 --sources` vuelve a leer cada fuente citada tal como está
ahora y dice `missing: true` cuando una ya no existe. `review show` añade el texto tal como se citó, para notas,
documentos y mensajes.

**Para agentes.** Un agente puede mirar y proponer, nunca decidir:

```sh
memo memories check --json
memo memories challenge memory:3 --evidence note:15 --reason 'the later note moves delivery to the 30th' --suggest 'Delivery is on the 30th'
memo facts challenge fact:4 --evidence 'msg:telegram/1/77/50' --reason 'the decision was reversed in chat'
memo memories add 'Delivery is on the 28th' --kind preference --scope work --evidence note:12 --quote 'note:12=delivery on the 28th'
```

- `memories check --json` responde con `checked`, `baselined`, `raised`, `refreshed`, `closed` y `changed_refs`. El
  último lista las fuentes cambiadas que todavía no lee ningún lote de hallazgos. Vuelve a leerlas y añade lo nuevo
  con `memo projects actions add`. Una ejecución nombra un cambio una sola vez, y normalmente `memo sync` lo encuentra
  primero, así que `memories check --since-time 1d` también lista lo que ejecuciones anteriores encontraron cambiado
  desde entonces. La sección `sources` de la agenda también los lista.
- `challenge` abre la revisión de la fuente del registro, o añade a la que está abierta, la evidencia, el motivo y, si
  quieres, `--suggest`. No cambia nada más.
- `--quote <ref>=<words>` en `memories add` y `facts add` guarda las palabras de una referencia `--evidence` en las que
  se apoya el registro. Así, una edición posterior que las mantiene no abre nada. Memo rechaza una cita que la fuente
  no dice (`evidence.quote-not-found`) y también una que no nombra ninguna referencia `--evidence`
  (`evidence.quote-unmatched`).
- `review confirm` y `review reject` rechazan a un agente en una revisión de la fuente (`proposal.owner-only`), digan
  lo que digan sus permisos y `agent_decisions`.

## Hechos

Un hecho registra lo ocurrido con su evidencia. Su clase es `fact`, `statement`, `question`, `decision` o `promise`.

```sh
memo facts add 'We moved the launch to spring' --kind decision --evidence 'msg:telegram/1/77/42'
memo facts list kind:decision project:HRB
memo facts show fact:4
memo facts confirm fact:4
```

Un hecho que añades con `memo` se acepta al instante. El de un agente queda `proposed` hasta `memo facts confirm`; `author` y `source` identifican al autor. `facts list` filtra por `kind`, `status`, `project` y `subject` en la consulta. `--project project:1` lo incorpora a un proyecto y `--occurred-time` indica cuándo ocurrió.

Para corregir un hecho de cualquier clase, añade el correcto con `--supersedes fact:2`. El antiguo queda marcado
`superseded` cuando se acepta el nuevo, lo cual ocurre al instante con el tuyo. Solo se puede corregir un hecho propuesto o aceptado.
Un agente puede proponer la corrección de otro hecho propuesto; uno que aceptaste solo lo corriges tú. Cuando una decisión ya no es válida y nada la sustituyó,
ejecuta `memo facts reverse fact:4`.

## Conclusiones de reuniones

Tras leer las fuentes de una reunión, pide al agente que proponga las decisiones y tareas siguientes que quieras conservar. Revisa los pasajes citados antes de crear registros. Una coincidencia del nombre del proyecto no establece una relación: la reunión ya debe tener un vínculo confirmado con el proyecto.

El agente prepara un lote JSON con `memo meetings actions add`. Cada propuesta indica un ID, un proyecto y referencias exactas a pasajes con las huellas que devuelve `zm meetings evidence`. Los hechos conservan su tipo, como `decision` o `promise`; las tareas distinguen un compromiso explícito de un posible seguimiento inferido. Las fechas y personas asignadas desconocidas quedan sin completar; los valores indicados necesitan sus propios pasajes de apoyo.

```sh
memo meetings actions add findings.json --account zoom:me@example.com
memo meetings actions list status:proposed --source zoom:me@example.com
memo meetings actions show 5 --source zoom:me@example.com
```

El archivo contiene `schema_version: 1`, una `key` estable, `extractor` y `findings`. Cada propuesta tiene `id`, `kind`, `project` y `evidence` (objetos con `reference` y `fingerprint`). Un hecho añade `type` y `statement`. Una tarea añade `type` (`bug`, `chore` o `feature`), `title`, `reason` y `commitment` (`explicit` o `inferred`). El campo opcional `due_at` es una fecha y hora ISO con zona horaria y necesita `due_evidence`; el opcional `assignee` es una referencia `person:<id>` y necesita `assignee_evidence`, ambos con referencias a pasajes de apoyo. `-` lee JSON de la entrada estándar. El lote admite hasta 16 propuestas y 65.536 bytes UTF-8.

Preparar el lote no crea hechos ni tareas. La vista previa muestra decisiones anteriores sobre propuestas sin cambios. Abre las fuentes y confirma personalmente los ID que quieras conservar, o rechaza el lote. Sustituye el hash siguiente por la huella exacta de la vista previa:

```sh
memo meetings actions confirm 5 decision followup --fingerprint <hash> --account zoom:me@example.com
memo meetings actions reject 5 --fingerprint <hash> --account zoom:me@example.com
```

La confirmación crea juntos los hechos y tareas de proyecto seleccionados y rechaza las demás propuestas nuevas. No envía nada. Una terminal identificada como agente no puede confirmar ni rechazar estos lotes; el propietario ejecuta esas órdenes directamente. La vía general `memo actions confirm` rechaza las conclusiones de reuniones.

Repetir la misma clave y contenido devuelve el lote existente. Repetir una revisión devuelve su resultado. Un lote posterior reutiliza las referencias aceptadas y mantiene rechazadas las propuestas rechazadas sin cambios; omitir una propuesta aceptada no la revoca. Esto evita duplicados por repeticiones exactas, no por propuestas redactadas de otra forma ni por registros añadidos por otra vía. Los cambios en fuentes o vínculos de proyecto invalidan una revisión pendiente: pide otra vista previa. Las revisiones terminadas conservan sus citas originales tras nuevas versiones de la transcripción.

## Acciones propuestas

Una acción propuesta es algo que un agente quiere hacer en una de tus cuentas: una respuesta, una
invitación, una expulsión en un grupo. Memo nunca la lleva a cabo.

```sh
memo actions list status:proposed
memo actions show 5
memo actions confirm 5
memo actions reject 5
```

Al aprobar una acción, se convierte en una tarea en la cuenta que actuaría, así que aparece en
`memo tasks list`. Después la haces tú, o pides a tu agente que la haga con tg o max. Al rechazarla,
se cierra y no se hace nada.

Un agente propone una acción así:

```sh
memo actions add reply --reason 'Kai asked twice' --account telegram:1 --target 'msg:telegram/1/77/42' --payload '{"text":"Friday works"}'
```

## Qué hicieron los agentes

```sh
memo agents list --limit 20
memo agents list agent:memo-mcp
```

El registro compartido muestra los comandos que llegan al ejecutor de Memo y las llamadas registradas por
tg y max, de la más reciente a la más antigua: qué agente, qué herramienta, el resultado y la hora.
Nunca guarda lo que envió el agente.

## A través del servidor MCP

Una aplicación sin terminal, como Claude Desktop, puede añadir recuerdos, hechos y acciones propuestas mediante
[el servidor MCP](./mcp.md). Los registros nuevos empiezan como propuestos. Las herramientas de comandos pueden
confirmar recuerdos, aceptar hechos y decidir acciones cuando lo permiten los permisos guardados. Las decisiones
sobre propuestas de proyecto también respetan `agent_decisions`, como se explica arriba.

Siguiente: [conectar una aplicación a través de MCP](./mcp.md).
