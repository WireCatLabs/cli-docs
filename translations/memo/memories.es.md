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
Por defecto, un agente puede confirmar o rechazar propuestas de proyecto con un motivo registrado: confirmarlas puede crear hechos aceptados y tareas numeradas o confirmar un documento clave. Configura [`agent_decisions: false`](./configuration.md#agent_decisions) para que solo el propietario decida las propuestas de proyecto. Leer y proponer siguen disponibles. Las conclusiones de reuniones siguen requiriendo al propietario.

**Qué espera tu decisión.** Una acción propuesta siempre espera aprobación o rechazo. Un recuerdo o hecho registrado directamente espera cuando lo añade un agente: mediante [MCP](./mcp.md) o `memo` en su terminal (con `AI_AGENT` o `CLAUDECODE`), que registra al agente como autor. Tu recuerdo se confirma y tu hecho se acepta al instante; en un terminal de agente, `--as-owner` lo atribuye a ti. El agente también puede pasar `--as-owner`; indícale que no lo haga.

## Recuerdos

Un recuerdo es una conclusión breve con su **evidencia**: las referencias de los mensajes, notas o
reuniones que lo demuestran. Tiene un tipo y un ámbito:

- tipo: `preference` (lo que alguien prefiere o quiere), `summary` o `digest`;
- ámbito: `personal` o `work`.

```sh
memo memories add 'Kai Sample prefers Friday meetings' --kind preference --scope work --evidence note:12
memo memories list kind:preference scope:work
memo memories show memory:3
memo search memories friday meetings scope:work
memo memories confirm memory:3
memo memories stale memory:3
```

Un recuerdo que añades con `memo` se confirma al instante. El de un agente queda `proposed` hasta que revises las fuentes y lo marques con `confirm`. Si la evidencia deja de ser válida, por ejemplo Kai prefiere ahora los lunes, márcalo `stale`. `--subject person:…` indica de quién o de qué trata. `memories list` filtra por `kind`, `status`, `scope` y `subject` en la consulta: `subject:"person:42"`.

## Hechos

Un hecho registra lo ocurrido con su evidencia. Su clase es `fact`, `statement`, `question`, `decision` o `promise`.

```sh
memo facts add 'We moved the launch to spring' --kind decision --evidence 'msg:telegram/1/77/42'
memo facts list kind:decision project:HRB
memo facts show fact:4
memo facts confirm fact:4
```

Un hecho que añades con `memo` se acepta al instante. El de un agente queda `proposed` hasta `memo facts confirm`; `author` y `source` identifican al autor. `facts list` filtra por `kind`, `status`, `project` y `subject` en la consulta. `--project project:1` lo incorpora a un proyecto y `--occurred-time` indica cuándo ocurrió.

Una decisión puede sustituir a otra anterior: añade `--supersedes fact:2`. Cuando aceptas la nueva
decisión, la antigua deja de ser válida. Cuando una decisión ya no es válida y nada la sustituyó,
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
memo agents log --limit 20
memo agents log agent:memo-mcp
```

El registro de agentes muestra cada llamada que hizo un agente a través de los servidores MCP de Memo,
tg y max, de la más reciente a la más antigua: qué agente, qué herramienta, el resultado y la hora.
Nunca guarda lo que envió el agente.

## A través del servidor MCP

Una aplicación sin terminal, como Claude Desktop, puede añadir recuerdos, hechos y acciones propuestas mediante [el servidor MCP](./mcp.md). Los registros directos quedan propuestos. Las propuestas de proyecto usan el flujo de revisión separado descrito arriba.

Siguiente: [conectar una aplicación a través de MCP](./mcp.md).
