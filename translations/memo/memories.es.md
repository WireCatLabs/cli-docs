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
memo memories list --status proposed
memo facts list --status proposed
memo actions list --status proposed
```

Abre cada fuente, luego confirma lo que es correcto y deja o rechaza el resto. El resto de esta página
explica cómo.

**Qué espera tu decisión.** Una acción propuesta siempre espera hasta que la apruebes o la rechaces.
Un recuerdo o un hecho espera cuando una aplicación lo añade a través de [el servidor MCP](./mcp.md).
Un recuerdo o un hecho añadido con el comando `memo` cuenta como tuyo y se confirma al momento, tanto si
lo escribiste tú como tu agente. Así que pide a un agente con terminal que primero te muestre el texto
y su fuente, y que lo añada solo cuando estés de acuerdo.

## Recuerdos

Un recuerdo es una conclusión breve con su **evidencia**: las referencias de los mensajes, notas o
reuniones que lo demuestran. Tiene un tipo y un ámbito:

- tipo: `preference` (lo que alguien prefiere o quiere), `summary` o `digest`;
- ámbito: `personal` o `work`.

```sh
memo memories add 'Kai Sample prefers Friday meetings' --kind preference --scope work --evidence note:12
memo memories list
memo memories show memory:3
memo memories search friday meetings
memo memories confirm memory:3
memo memories stale memory:3
```

Un recuerdo añadido con el comando `memo` se confirma al momento. Uno añadido a través de MCP espera
como `proposed` hasta que revises su evidencia y lo confirmes con `confirm`. Cuando la evidencia ya no
es válida, por ejemplo, si Kai ahora prefiere los lunes, márcalo como `stale`. `--subject person:…`
indica de quién o de qué trata el recuerdo.

## Hechos

Un hecho registra lo que pasó, con su evidencia. Su tipo es `fact`, `statement`, `question`,
`decision` o `promise`.

```sh
memo facts add 'We moved the launch to spring' --type decision --evidence 'msg:telegram/1/77/42'
memo facts list --type decision
memo facts show fact:4
memo facts accept fact:4
```

Un hecho añadido con el comando `memo` se acepta al momento. Uno añadido a través de MCP espera como
`proposed` hasta que lo aceptes con `accept`. `--project project:1` pone el hecho en un proyecto y
`--occurred` indica la fecha en que pasó.

Una decisión puede sustituir a otra anterior: añade `--supersedes fact:2`. Cuando aceptas la nueva
decisión, la antigua deja de ser válida. Cuando una decisión ya no es válida y nada la sustituyó,
ejecuta `memo facts reverse fact:4`.

## Acciones propuestas

Una acción propuesta es algo que un agente quiere hacer en una de tus cuentas: una respuesta, una
invitación, una expulsión en un grupo. Memo nunca la lleva a cabo.

```sh
memo actions list --status proposed
memo actions show 5
memo actions approve 5
memo actions reject 5
```

Al aprobar una acción, se convierte en una tarea en la cuenta que actuaría, así que aparece en
`memo tasks list`. Después la haces tú, o pides a tu agente que la haga con tg o max. Al rechazarla,
se cierra y no se hace nada.

Un agente propone una acción así:

```sh
memo actions propose reply --reason 'Kai asked twice' --provider telegram --target 'msg:telegram/1/77/42' --payload '{"text":"Friday works"}'
```

## Qué hicieron los agentes

```sh
memo agents log --limit 20
memo agents log --agent memo-mcp
```

El registro de agentes muestra cada llamada que hizo un agente a través de los servidores MCP de Memo,
tg y max, de la más reciente a la más antigua: qué agente, qué herramienta, el resultado y la hora.
Nunca guarda lo que envió el agente.

## A través del servidor MCP

Una aplicación sin terminal, como Claude Desktop, puede añadir recuerdos, hechos y acciones propuestas
a través de [el servidor MCP](./mcp.md). Lo que añade siempre espera tu decisión: a través de MCP un
agente no puede confirmar, aceptar, aprobar ni rechazar.

Siguiente: [conectar una aplicación a través de MCP](./mcp.md).
