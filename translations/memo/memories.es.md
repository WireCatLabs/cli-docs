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

**Qué espera tu decisión.** Una acción propuesta siempre espera aprobación o rechazo. Un recuerdo o hecho espera cuando lo añade un agente: mediante [MCP](./mcp.md) o `memo` en su terminal (con `AI_AGENT` o `CLAUDECODE`), que registra al agente como autor. Lo que añades personalmente se confirma al instante; en un terminal de agente, `--as-owner` lo atribuye a ti. El agente también puede pasar `--as-owner`; indícale que no lo haga.

## Recuerdos

Un recuerdo es una conclusión breve con su **evidencia**: las referencias de los mensajes, notas o
reuniones que lo demuestran. Tiene un tipo y un ámbito:

- tipo: `preference` (lo que alguien prefiere o quiere), `summary` o `digest`;
- ámbito: `personal` o `work`.

```sh
memo memories add 'Kai Sample prefers Friday meetings' --kind preference --scope work --evidence note:12
memo memories list kind:preference scope:work
memo memories show memory:3
memo search memories friday meetings
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

Un hecho que añades con `memo` se acepta al instante. El de un agente queda `proposed` hasta `accept`; `author` y `origin` identifican al autor. `facts list` filtra por `kind`, `status`, `project` y `subject` en la consulta. `--project project:1` lo incorpora a un proyecto y `--occurred-time` indica cuándo ocurrió.

Una decisión puede sustituir a otra anterior: añade `--supersedes fact:2`. Cuando aceptas la nueva
decisión, la antigua deja de ser válida. Cuando una decisión ya no es válida y nada la sustituyó,
ejecuta `memo facts reverse fact:4`.

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
memo actions add reply --reason 'Kai asked twice' --provider telegram --target 'msg:telegram/1/77/42' --payload '{"text":"Friday works"}'
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

Una aplicación sin terminal, como Claude Desktop, puede añadir recuerdos, hechos y acciones propuestas
a través de [el servidor MCP](./mcp.md). Lo que añade siempre espera tu decisión: a través de MCP un
agente no puede confirmar, aceptar, aprobar ni rechazar.

Siguiente: [conectar una aplicación a través de MCP](./mcp.md).
