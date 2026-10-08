---
title: "Primeras tareas"
description: "Tus primeras peticiones al agente tras iniciar sesión y después ejemplos más largos: encontrar una decisión, preparar una reunión, redactar respuestas."
---

Ya has iniciado sesión. Ahora da a tu agente una tarea con palabras normales. Empieza por tareas
que solo leen: ves lo que puede hacer el agente y nada cambia en tu cuenta.

## Tus primeros cinco minutos

Copia una petición en tu agente. Funcionan igual con Telegram y con MAX; si usas MAX, escribe
*max* en lugar de *tg*.

**¿Quién necesita una respuesta mía?**

```text prompt
Usa tg para revisar mis mensajes sin leer. Agrúpalos por chat y dime quién necesita una respuesta mía. Solo lectura: no envíes nada ni marques nada como leído.
```

Recibes una lista corta de chats con las preguntas que te esperan y los mensajes de cada una.

**¿Qué ha pasado hoy?**

```text prompt
Usa tg para resumir lo que ha pasado hoy en mis cinco chats más activos. Una línea por chat. Solo lectura.
```

Recibes un resumen del día sin abrir cada chat.

**Encontrar algo**

```text prompt
Usa tg para revisar mis cinco chats más recientes y encontrar el último enlace que alguien me envió. Muestra el mensaje y el chat. Solo lectura.
```

El agente lee esos chats y te muestra el mensaje con el enlace.

**Qué pasa por dentro.** Para la primera petición, el agente ejecuta comandos como
`tg inbox --limit 5` y `tg chats list --limit 5`, y después lee más mensajes donde necesita
contexto. Leer no marca los mensajes como leídos. [Leer mensajes](./tg/usage.md#reading) explica
los límites.

**Conviene saber**

- **Sin leer no es lo mismo que «necesita respuesta».** Un buen agente lee el contexto antes de
  decidir y te dice qué chats ha revisado.
- **Tu historial solo se descarga cuando hace falta.** Iniciar sesión no descarga los mensajes
  antiguos. Para una pregunta sobre el mes pasado, el agente puede pedirte primero descargar el
  historial de ese chat. Tú decides hasta qué fecha.
- **Pide las fuentes.** «Muéstrame los mensajes en los que te basas» obliga al agente a demostrar
  cada afirmación.

## Ejemplos más largos

Los diálogos siguientes muestran cómo es una tarea completa: la petición, los comandos que ejecuta
el agente y su respuesta. Los chats, los IDs y los mensajes son ficticios; no ejecutes los comandos
tal cual. MAX tiene su propia [guía de uso](./max/usage.md); no todas las opciones de Telegram
existen en MAX.

### Encontrar un acuerdo en el historial antiguo

**Tú**

```text prompt
En «Atlas · equipo», encuentra el importe de la analítica que acordamos en septiembre de 2026.
Muéstrame la propuesta y la confirmación. Revisa primero el archivo local; dime si le falta ese
periodo. No envíes nada.
```

**El agente revisa el chat y su archivo**

```sh
tg chats list --search Atlas --kind group
tg store status -1001001001001
tg search messages 'analytics after:2026-09-01 before:2026-10-01' --chat -1001001001001 --json --language legacy
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

**El agente descarga, comprueba la cobertura y verifica el resultado**

```sh
tg store fetch -1001001001001 --since-time 2026-09-01 --limit 1000
tg store status -1001001001001
tg search messages 'analytics after:2026-09-01 before:2026-10-01' --chat -1001001001001 --json --language legacy
tg messages context -1001001001001 4312 --before-n 2 --after-n 4
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

**Por qué estos comandos:** `messages list` lee una ventana de mensajes y la guarda en local;
`store fetch` carga un tramo de historial más largo. `search messages` busca solo en lo guardado.
`messages context` comprueba qué se dijo alrededor de un resultado. Ni los últimos 20 mensajes ni
una búsqueda local vacía demuestran que se haya revisado un mes. [Archivo y búsqueda](./tg/archive.md).

### Preparar una reunión

**Tú**

```text prompt
Prepara una agenda de 20 minutos para la llamada de Atlas con Anna y Tom. Revisa los grupos del
proyecto y de diseño, y mis chats privados con esos participantes durante la última semana.
Separa las decisiones, los riesgos actuales y las preguntas abiertas. Cita las fuentes; no envíes
nada.
```

**El agente encuentra los grupos y los participantes, y después lee los chats elegidos**

```sh
tg chats list --search Atlas --kind group
tg contacts list --search Anna
tg contacts list --search Tom
tg messages list -1001001001001 --after-time 7d --limit 100
tg messages list -1001001001002 --after-time 7d --limit 100
tg messages list 100200300 --after-time 7d --limit 100
tg messages list 100200301 --after-time 7d --limit 100
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

**El agente lee los mensajes posteriores**

```sh
tg messages context -1001001001002 732 --before-n 2 --after-n 10
tg messages list 100200300 --after-time 2026-10-02T12:00:00+02:00 --limit 50
```

**Agente**

> Anna confirmó que lo había recibido, pero no lo aprobó de forma explícita en los mensajes
> revisados. Añade: **«Anna, ¿podemos aprobar el diseño revisado o aún hacen falta cambios?»**
> Deja la aprobación abierta.
>
> Fuentes: mensaje de diseño 735 y mensaje privado de Anna 204. No he enviado ninguna respuesta.

La hora del ejemplo es la hora de entrega del diseño ficticio. Si una ventana de lectura está
truncada, el agente debe seguir el cursor de mensajes o indicar la parte que falta antes de afirmar
que ha revisado toda la semana. Si el nombre de un participante es ambiguo, debe preguntar en vez
de elegir un chat privado sin pruebas. [Ventanas de mensajes y cursores](./tg/usage.md#pages).

### Revisar compromisos y preparar respuestas

**Tú**

```text prompt
Revisa las conversaciones de Atlas de la última semana y busca compromisos y preguntas que me
afecten. Incluye el grupo del equipo y mis chats privados con Anna y Tom. Separa lo que debo yo de
lo que espero de otros, comprueba si algo se completó después y prepara borradores de respuesta.
No los envíes.
```

**El agente identifica los chats y revisa las dos partes de cada conversación**

```sh
tg chats list --search Atlas --kind group
tg contacts list --search Anna
tg contacts list --search Tom
tg review --chat -1001001001001 --since-time 7d
tg review --chat 100200300 --since-time 7d
tg review --chat 100200301 --since-time 7d
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

**El agente revisa la promesa original y sus respuestas**

```sh
tg messages context -1001001001001 4520 --before-n 3 --after-n 6
tg messages context 100200300 201 --before-n 2 --after-n 5
```

**Agente**

> Prometiste comentarios sobre las diapositivas de precios para el viernes 2 de octubre. Borrador:
> **«Te prometí comentarios sobre las diapositivas de precios para el viernes y no he cumplido ese
> plazo. Te enviaré una nueva fecha de entrega».** Así reconoces la promesa sin inventar un plazo
> nuevo.
>
> Fuentes: mensaje del equipo 4520 y mensaje privado de Anna 201. Sigue siendo un borrador.

`review` aporta mensajes para que el agente los interprete. Su filtro de preguntas sin respuesta
es una aproximación, no una lista completa de las obligaciones de todos. El agente debe indicar
las ventanas de revisión incompletas y revisar los mensajes posteriores antes de marcar una
promesa antigua como pendiente.
[Revisión y preguntas sin respuesta](./tg/usage.md#who-owes-what-review).

## Más tareas que puedes pedir

| Tarea | Qué concretar | Siguiente guía |
|---|---|---|
| Resumen de la mañana | Chats o canales, periodo, temas y qué merece atención | [Qué necesita respuesta](./tg/usage.md#what-needs-an-answer) |
| Contacto recomendado | Servicio, país, monedas y criterios de comparación | [Ejemplos de peticiones](./prompting.md#encontrar-un-contacto-recomendado) |
| Documentos de un proyecto | Chats, tipos de archivo, versiones aprobadas y si se permite descargar | [Archivos](./prompting.md#reunir-documentos-y-elegir-versiones) |
| Recordatorios | Fechas, horas y zona horaria exactas, destinatarios y texto del mensaje | [Programación](./prompting.md#programar-recordatorios) |
| Mensaje de voz | El mensaje o el remitente, y si necesitas una transcripción o una lista de acciones | [Mensajes de voz](./tg/usage.md#voice-messages) |
| Exportación sin conexión | Chat, periodo, destino y sin acceso a la red | [Trabajo sin conexión](./prompting.md#limitar-el-alcance-cuando-haga-falta) |

Para ver peticiones que puedes adaptar, sigue con [Cómo formular peticiones](./prompting.md).
Para la sintaxis de los comandos, usa [los comandos de Telegram](./tg/commands.md) o
[los comandos de MAX](./max/commands.md).

Para reproducir una búsqueda con la salida real del conjunto controlado, sigue el [recorrido para preparar una reunión](./meeting-brief.mdx).
