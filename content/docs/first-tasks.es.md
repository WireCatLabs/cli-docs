---
title: "Primeras tareas"
description: "Prueba una petición útil, comprueba la respuesta y sigue con búsquedas, reuniones o borradores."
---

Una vez conectada tu cuenta, prueba una primera petición con tu agente de IA. Encuentra un mensaje, resume un chat o prepara una respuesta y comprueba que esté completa. Una
petición es una tarea con tus propias palabras; el agente elige los comandos.

Si aún falta configurar algo, empieza por [instalación](./installation.mdx) o
[conectar al agente](./agents.mdx). Puedes ver el proceso antes de probarlo en [Demo](./meeting-brief.mdx).

## Tus primeros cinco minutos

Elige una petición. Estas tareas solo leen, así que nada cambia en tu cuenta. Para MAX, cambia
«tg CLI» por «max CLI» y Telegram por MAX. En un chat de IA con MCP, pide usar la conexión de
Telegram o MAX.

**¿Quién espera mi respuesta?**

```text prompt
Usa tg CLI. Revisa mis mensajes no leídos en Telegram. Dime qué preguntas necesitan mi respuesta y muestra los mensajes de origen. Solo lee: no envíes nada ni marques mensajes como leídos.
```

**¿Qué pasó hoy?**

```text prompt
Usa tg CLI. Resume los mensajes de hoy en cinco de mis chats activos. Una línea por chat, con las preguntas importantes aparte. Indica qué chats revisaste. Solo lee.
```

**Encontrar algo**

```text prompt
Usa tg CLI. Encuentra el último enlace que me enviaron en mis cinco chats más recientes. Muestra el mensaje y el chat. Solo lee.
```

Obtendrás una respuesta breve con mensajes que puedes abrir o identificar. Empieza por unos pocos chats para comprobar fácilmente el resultado.

**Qué pasa por dentro.** Para la primera petición, el agente ejecuta comandos como
`tg inbox --limit 5` y `tg chats list --limit 5`, y después lee más mensajes donde necesita
contexto. Leer no marca los mensajes como leídos. [Leer mensajes](./tg/usage.md#reading) explica
los límites.

**Conviene saber**

- **Sin leer no es lo mismo que «necesita respuesta».** Un buen agente lee el contexto antes de
  decidir y te dice qué chats ha revisado.
- **Tu historial solo se descarga cuando hace falta.** Iniciar sesión no descarga los mensajes
  antiguos. La búsqueda propia de Telegram puede encontrar un mensaje por sus palabras, pero una
  pregunta sobre el mes pasado suele necesitar el historial de ese chat: el agente puede pedirte
  primero descargarlo. Tú decides hasta qué fecha.
- **Pide las fuentes.** «Muéstrame los mensajes en los que te basas» obliga al agente a demostrar
  cada afirmación.

<a id="longer-examples" />

<a id="ejemplos-más-largos" />

Los apartados siguientes muestran tareas más largas: la petición, lo que hace el agente y su
respuesta. Los chats, los IDs y los mensajes son ficticios; no ejecutes los comandos tal cual. MAX
tiene su propia [guía de uso](./max/usage.md); no todas las opciones de Telegram existen en MAX.

<a id="find-a-decision-in-older-history" />

<a id="encontrar-un-acuerdo-en-el-historial-antiguo" />

## Encontrar un acuerdo antiguo

Recuerdas más o menos qué se acordó y cuándo, pero no el mensaje exacto. Indica el chat, el
periodo y qué cuenta como respuesta:

```text prompt
Usa tg CLI. En «Atlas · equipo», encuentra el importe de la analítica que acordamos en septiembre
de 2026. Muéstrame la propuesta y la confirmación. Revisa primero el archivo local; dime si le
falta ese periodo. No envíes nada.
```

**Agente**

> He encontrado «Atlas · equipo», pero su historial local solo cubre desde el 28 de septiembre.
> La búsqueda no ha encontrado ningún importe en esos mensajes. Eso no indica si se acordó un
> importe antes ese mes. ¿Puedo descargar el historial de este chat hasta el 1 de septiembre?

**Tú**

```text prompt
Sí, solo ese chat. Descarga hasta el 1 de septiembre. Si hacen falta más de 1000 mensajes, para y
dime qué queda.
```

**Agente**

> **Importe acordado: 1500 € sin IVA.** Marco lo propuso el 5 de septiembre (mensaje 4312); tú lo
> confirmaste el 6 de septiembre (mensaje 4315). La conversación de alrededor describe la
> configuración de la analítica, no un soporte continuo. El archivo aún tiene huecos, así que no
> puedo descartar un cambio posterior en otro momento de septiembre.
>
> Fuentes: «Atlas · equipo», mensajes 4312 y 4315. No he enviado nada.

La propuesta y la confirmación respaldan el importe, pero un archivo parcial no puede demostrar
que no cambiara durante el resto del mes. Otra descarga limitada puede continuar más tarde.
Una descarga desde septiembre también lee el historial más reciente por el camino, y los filtros
de la búsqueda reducen el resultado a septiembre.

<details>
<summary>Comandos que ejecuta el agente</summary>

Encuentra el chat, comprueba qué está guardado y busca solo en el historial guardado, como pedía la
petición:

```sh
tg chats list --search Atlas --kind group
tg store status -1001001001001
tg search messages 'analytics date:[2026-09-01 TO 2026-10-01}' --chat -1001001001001 --backend archive --json
```

Tras tu aprobación, descarga el periodo, vuelve a comprobar la cobertura y lee alrededor del
resultado:

```sh
tg store fetch -1001001001001 --since-time 2026-09-01 --limit 1000
tg store status -1001001001001
tg search messages 'analytics date:[2026-09-01 TO 2026-10-01}' --chat -1001001001001 --backend archive --json
tg messages context -1001001001001 4312 --before-n 2 --after-n 4
```

</details>

**Por qué estos comandos:** `messages list` lee una ventana de mensajes y la guarda en local;
`store fetch` carga un tramo de historial más largo. `search messages` también consulta por
defecto la búsqueda propia de Telegram; `--backend archive` la limita al historial guardado. La
búsqueda de Telegram solo encuentra palabras, así que leer la conversación alrededor de un
resultado y revisar un mes entero necesitan el historial guardado. `messages context` comprueba qué
se dijo alrededor de un resultado. Ni los últimos 20 mensajes ni una búsqueda local vacía
demuestran que se haya revisado un mes. [Archivo y búsqueda](./tg/archive.md) ·
[Búsqueda](./search.md).

<a id="check-promises-and-prepare-replies" />

<a id="revisar-compromisos-y-preparar-respuestas" />

## Preparar una respuesta

Pide primero un borrador y revisa destinatario y hechos. Un buen punto de partida es revisar qué
has prometido y qué esperas de otros:

```text prompt
Usa tg CLI. Revisa las conversaciones de Atlas de la última semana y busca compromisos y preguntas
que me afecten. Incluye el grupo del equipo y mis chats privados con Anna y Tom. Separa lo que debo
yo de lo que espero de otros, comprueba si algo se completó después y prepara borradores de
respuesta. No los envíes.
```

**Agente**

> **Le debes a Anna:** comentarios sobre las diapositivas, prometidos para el 2 de octubre. No he
> encontrado que se completara en los mensajes revisados. Fuentes: mensaje del equipo 4520,
> mensaje privado de Anna 201.
>
> **A la espera de una decisión:** la aprobación de Anna del diseño revisado. Fuente: conversación
> sobre el diseño citada en el mensaje privado de Tom 188.
>
> **Completado:** Tom envió el diseño en su chat privado. Su promesa anterior ya no está pendiente.
>
> Borrador para Anna: «He recibido las diapositivas. En breve te confirmo cuándo te envío mis
> comentarios».
> No he enviado nada; esto cubre solo los tres chats indicados arriba.

**Tú**

```text prompt
No te inventes una fecha de entrega. Comprueba qué le prometí exactamente a Anna y concreta el
borrador.
```

**Agente**

> Prometiste comentarios sobre las diapositivas de precios para el viernes 2 de octubre. Borrador:
> **«Te prometí comentarios sobre las diapositivas de precios para el viernes y no he cumplido ese
> plazo. Te enviaré una nueva fecha de entrega».** Así reconoces la promesa sin inventar un plazo
> nuevo.
>
> Fuentes: mensaje del equipo 4520 y mensaje privado de Anna 201. Sigue siendo un borrador.

<details>
<summary>Comandos que ejecuta el agente</summary>

Identifica los chats y revisa las dos partes de cada conversación:

```sh
tg chats list --search Atlas --kind group
tg contacts list --search Anna
tg contacts list --search Tom
tg review --chat -1001001001001 --since-time 7d
tg review --chat 100200300 --since-time 7d
tg review --chat 100200301 --since-time 7d
```

Después revisa la promesa original y sus respuestas:

```sh
tg messages context -1001001001001 4520 --before-n 3 --after-n 6
tg messages context 100200300 201 --before-n 2 --after-n 5
```

</details>

`review` aporta mensajes para que el agente los interprete. Su filtro de preguntas sin respuesta
es una aproximación, no una lista completa de las obligaciones de todos. El agente debe indicar
las ventanas de revisión incompletas y revisar los mensajes posteriores antes de marcar una
promesa antigua como pendiente.
[Revisión y preguntas sin respuesta](./tg/usage.md#who-owes-what-review).

Enviar es un paso aparte que autorizas después de leer el borrador.
[Cómo formular peticiones](./prompting.mdx#preparar-una-respuesta-y-decidir-si-enviarla) explica
cómo aportar contexto y autorizar el envío aparte.

<a id="preparar-una-reunión" />

## Prepararte para una reunión

Indica los participantes, los chats que hay que revisar y cuánto dura la reunión:

```text prompt
Usa tg CLI. Prepara una agenda de 20 minutos para la llamada de Atlas con Anna y Tom. Revisa los
grupos del proyecto y de diseño, y mis chats privados con esos participantes durante la última
semana. Separa las decisiones, los riesgos actuales y las preguntas abiertas. Cita las fuentes; no
envíes nada.
```

**Agente**

> **Decisiones:** el lanzamiento está fijado para el 9 de octubre; el alcance reducido de la
> analítica está aprobado.
>
> **Riesgo actual:** ha llegado el diseño revisado, pero nadie ha confirmado todavía que se acepte.
> El mensaje privado de Tom sustituye al bloqueo anterior del grupo, «a la espera del diseño».
>
> **Agenda:** confirmar el alcance (5 minutos), aprobar el diseño revisado (10 minutos), asignar
> responsables de las comprobaciones del lanzamiento (5 minutos).
>
> Fuentes: mensajes del equipo 4501/4508, mensaje de diseño 732, mensaje privado de Tom 188.
> He revisado los dos grupos y los dos chats privados de la última semana; no he enviado nada ni
> marcado nada como leído.

**Tú**

```text prompt
Comprueba si Anna aprobó el diseño revisado después de que Tom lo enviara. Si no, añádelo como
pregunta.
```

**Agente**

> Anna confirmó que lo había recibido, pero no lo aprobó de forma explícita en los mensajes
> revisados. Añade: **«Anna, ¿podemos aprobar el diseño revisado o aún hacen falta cambios?»**
> Deja la aprobación abierta.
>
> Fuentes: mensaje de diseño 735 y mensaje privado de Anna 204. No he enviado ninguna respuesta.

<details>
<summary>Comandos que ejecuta el agente</summary>

Encuentra los grupos y los participantes, y después lee los chats elegidos:

```sh
tg chats list --search Atlas --kind group
tg contacts list --search Anna
tg contacts list --search Tom
tg messages list -1001001001001 --after-time 7d --limit 100
tg messages list -1001001001002 --after-time 7d --limit 100
tg messages list 100200300 --after-time 7d --limit 100
tg messages list 100200301 --after-time 7d --limit 100
```

Para la pregunta siguiente, lee los mensajes posteriores a la llegada del diseño:

```sh
tg messages context -1001001001002 732 --before-n 2 --after-n 10
tg messages list 100200300 --after-time 2026-10-02T12:00:00+02:00 --limit 50
```

</details>

La hora del ejemplo es la hora de entrega del diseño ficticio. Si una ventana de lectura está
truncada, el agente debe seguir el cursor de mensajes o indicar la parte que falta antes de afirmar
que ha revisado toda la semana. Si el nombre de un participante es ambiguo, debe preguntar en vez
de elegir un chat privado sin pruebas. [Ventanas de mensajes y cursores](./tg/usage.md#pages).

[Demo](./meeting-brief.mdx) muestra cómo el agente reúne decisiones, preguntas y una agenda en un
escenario preparado.

## Comprobar la respuesta

La respuesta debe indicar los chats y el periodo revisados, los mensajes que respaldan los hechos importantes y el historial que falta. Si no lo hace, pide una aclaración.

<a id="other-useful-requests" />

## Más tareas que puedes pedir

| Tarea | Qué concretar | Siguiente guía |
|---|---|---|
| Resumen de la mañana | Chats o canales, periodo, temas y qué merece atención | [Qué necesita respuesta](./tg/usage.md#what-needs-an-answer) |
| Contacto recomendado | Servicio, país, monedas y criterios de comparación | [Ejemplos de peticiones](./prompting.mdx#encontrar-un-contacto-recomendado) |
| Documentos de un proyecto | Chats, tipos de archivo, versiones aprobadas y si se permite descargar | [Archivos](./prompting.mdx#reunir-documentos-y-elegir-versiones) |
| Recordatorios | Fechas, horas y zona horaria exactas, destinatarios y texto del mensaje | [Programación](./prompting.mdx#programar-recordatorios) |
| Mensaje de voz | El mensaje o el remitente, y si necesitas una transcripción o una lista de acciones | [Mensajes de voz](./tg/usage.md#voice-messages) |
| Exportación sin conexión | Chat, periodo, destino y sin acceso a la red | [Trabajo sin conexión](./prompting.mdx#trabajar-sin-conexión) |

Para ver peticiones que puedes adaptar, sigue con [Cómo formular peticiones](./prompting.mdx).
Para la sintaxis de los comandos, usa [los comandos de Telegram](./tg/commands.md) o
[los comandos de MAX](./max/commands.md).

[Ayuda de Telegram](./tg/troubleshooting.md) · [Ayuda de MAX](./max/troubleshooting.md)
