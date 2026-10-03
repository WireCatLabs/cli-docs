---
title: "Primeras tareas"
description: "Encuentra un dato, prepara una reunión y revisa acuerdos con tu agente y el CLI."
---

Con la cuenta conectada y [el agente configurado](./agents.md), empieza por una tarea de lectura:
buscar un mensaje, preparar una reunión o revisar quién espera tu respuesta. Describe el resultado
que necesitas; el agente elige los comandos.

**Iniciar sesión no descarga todo el historial.** El CLI guarda los mensajes que lee en un archivo
local. Para buscar en conversaciones antiguas puede necesitar cargar el periodo del chat que te
interesa. No hace falta descargar todos tus chats para empezar.

## Tu primera petición

Copia esto en tu agente local:

```text prompt
Usa tg cli para mostrar cinco chats de trabajo y revisar en qué mensajes recibidos esperan una
respuesta mía. Indica los chats revisados y cita los mensajes. Solo lee: no envíes nada ni marques
los mensajes como leídos.
```

El agente puede empezar así:

```sh
tg chats list --limit 5
tg inbox --limit 5
```

`chats list` muestra chats recientes; el agente tiene que identificar cuáles son de trabajo.
`inbox` muestra mensajes de otras personas, pero **un mensaje sin leer no implica que debas
responder**. El agente debe comprobar el contenido y explicar si el resultado está limitado por
chats omitidos o mensajes pendientes que no se han leído en esta consulta.

Un buen resultado distingue peticiones de respuesta, mensajes informativos y dudas que requieren
más contexto. Si usa más chats que los cinco iniciales, debe decir cuáles.

## 1. Encontrar un acuerdo en el historial

Los nombres, fechas, IDs y respuestas de los siguientes diálogos son **ficticios**. Ilustran cómo
debería trabajar el agente; no son resultados de tu cuenta. Los comandos corresponden a Telegram
CLI v0.24.0. El agente debe obtener los IDs reales antes de usarlos.

**Tú**

```text prompt
En «Atlas · equipo», encuentra el importe que acordamos para la analítica en septiembre de 2026.
Muéstrame la propuesta y la confirmación. No envíes nada. Si falta historial, dime qué necesitas
cargar antes de concluir que no está.
```

```sh
tg chats list --search Atlas
tg store status "Atlas · equipo"
tg messages search 'analítica after:2026-09-01 before:2026-10-01' --chat "Atlas · equipo" --context 3 --language legacy
```

**Agente**

> La copia local solo contiene algunos mensajes recientes. No he encontrado el acuerdo, pero eso
> no demuestra que no exista. Necesito consultar el historial de este chat desde el 1 de septiembre.
> No he enviado nada.

**Tú**

```text prompt
Puedes cargar el historial de ese chat desde el 1 de septiembre. Empieza con un máximo de 1000
mensajes y avísame si no basta. No cargues otros chats.
```

```sh
tg store fetch "Atlas · equipo" --estimate
tg store fetch "Atlas · equipo" --since-time 2026-09-01T00:00:00+02:00 --limit 1000
tg messages search 'analítica after:2026-09-01 before:2026-10-01' --chat "Atlas · equipo" --context 3 --language legacy
tg messages context "Atlas · equipo" 200
tg store status "Atlas · equipo"
```

**Agente**

> He encontrado **1500 € sin IVA**: Marco propuso esa cifra el 5 de septiembre y tú la confirmaste
> el día 6 («Atlas · equipo», mensajes 200 y 201).
>
> El archivo sigue teniendo huecos. Puedo confirmar ese acuerdo, pero no que el importe no cambiara
> después. Para comprobarlo tendría que continuar con el historial pendiente. No he enviado nada.

`messages search` busca solo en el archivo local. `messages list` lee una ventana de mensajes y
también la guarda; puede bastar para una conversación reciente. `store fetch` carga historial de
forma limitada y reanudable. Una carga que llega al límite no garantiza que haya cubierto todo el
periodo. Consulta [el archivo local](./tg/archive.md).

## 2. Preparar una reunión con el contexto de varios chats

**Tú**

```text prompt
Prepara la reunión de Atlas del 3 de octubre de 2026. Revisa las decisiones, los riesgos y las
preguntas de la última semana en los grupos del proyecto y en mis chats privados con los
participantes. Distingue los bloqueos actuales de los ya resueltos. No envíes nada.
```

```sh
tg chats list --search Atlas
tg chats list --search Tom --kind dialog
tg review --chat "Atlas · equipo" --since-time 2026-09-26T00:00:00+02:00
tg review --chat "Atlas · diseño" --since-time 2026-09-26T00:00:00+02:00
tg messages list "Tom" --limit 50
```

**Agente**

> **Resuelto:** el diseño está listo. Tom confirmó hoy en el chat privado que ya tiene acceso a
> producción y que el pago funciona (Tom, mensaje 510). El problema de acceso de ayer en el grupo
> ya no parece un bloqueo.
>
> **Por decidir:** Anna pide aprobar los textos («Atlas · diseño», mensaje 450). Aún no hay una
> fecha de lanzamiento confirmada.
>
> He revisado los dos grupos y el chat con Tom. No he localizado los chats privados de Anna y
> Marco; no puedo afirmar que haya visto todas sus conversaciones. El historial local es parcial.

**Tú**

```text prompt
Prepara una agenda de 20 minutos. Confirma el contexto del mensaje de Anna y deja claro qué
debemos decidir. Mantén los problemas resueltos fuera de la lista de bloqueos.
```

```sh
tg messages context "Atlas · diseño" 450 --before-n 3 --after-n 5
```

**Agente**

> - **3 minutos:** confirmar el estado del diseño y del pago.
> - **10 minutos:** identificar los textos pendientes, quién los aprueba y para cuándo.
> - **7 minutos:** decidir las condiciones del lanzamiento y fijar una fecha.
>
> Anna escribió «antes del jueves» el 2 de octubre. Hay que confirmar a qué fecha se refiere;
> no lo convierto en un plazo concreto sin comprobarlo. Nada enviado.

El agente compara las fuentes y las fechas: un mensaje más reciente en un chat privado puede
resolver un problema mencionado antes en el grupo. Si una lectura está truncada o faltan
participantes, debe explicarlo. Consulta [lectura y revisión de mensajes](./tg/usage.md).

## 3. Revisar compromisos y preparar respuestas

**Tú**

```text prompt
Revisa los acuerdos de los últimos siete días en mis chats de trabajo. Separa lo que tengo que
hacer yo, lo que espero de otras personas y las preguntas sin respuesta. Comprueba si algo ya se
resolvió en otro chat. Prepara borradores, pero no envíes nada.
```

```sh
tg review --since-time 7d
tg review --unanswered 1d
```

**Agente**

> **Te corresponde:** enviar a Anna la factura acordada para el viernes (Anna, mensaje 620).
>
> **Esperas de otra persona:** la aprobación de los textos de Atlas. El acceso de Tom ya está
> resuelto por su mensaje de hoy en el chat privado; lo he quitado de la lista de pendientes.
>
> **Por aclarar:** quién lleva las muestras a la reunión («Atlas · equipo», mensaje 730).
>
> La revisión no incluye todos los chats de tu cuenta: el CLI ha señalado chats omitidos. Estos
> son los pendientes que puedo respaldar con lo revisado, no una lista exhaustiva.

**Tú**

```text prompt
Prepara un borrador para Anna sobre la factura y otro para el grupo preguntando por las muestras.
No prometas una nueva fecha y no envíes los borradores.
```

```sh
tg messages context "Anna" 620
tg messages context "Atlas · equipo" 730
```

**Agente**

> **Para Anna:** «He visto tu mensaje sobre la factura. Estoy revisando lo que acordamos y te
> confirmaré cuándo puedo enviártela».
>
> **Para Atlas · equipo:** «¿Quién se encarga de llevar las muestras a la reunión? No veo una
> confirmación en la conversación que he revisado».
>
> Son borradores; no he enviado ninguno ni cambiado los plazos acordados.

`review` aporta mensajes para analizarlos; no interpreta por sí solo las obligaciones. El filtro
`--unanswered` usa reglas para detectar preguntas y respuestas, por lo que sirve como pista,
no como prueba definitiva de que alguien espera una respuesta. Consulta [el uso de tg](./tg/usage.md).

## Más tareas que puedes pedir

| Tarea | Qué concretar | Consulta |
|---|---|---|
| Resumen de la mañana | Chats o canales, periodo y temas prioritarios | [Lectura de mensajes](./tg/usage.md) |
| Contacto recomendado | Servicio, país, monedas y criterios; pide fuentes | [Cómo formular peticiones](./prompting.md) |
| Documentos de un proyecto | Tipos de archivo, versiones aprobadas y permiso para descargar | [Recetas](./tg/recipes.md) |
| Mensaje de voz | Chat, mensaje y si necesitas transcripción o una respuesta | [Audio](./tg/usage.md) |
| Recordatorios | Fecha, hora, zona horaria y destinatario exacto | [Envíos programados](./tg/usage.md) |
| Exportación local | Chat, periodo, carpeta y si se permite conectar a la red | [Archivo local](./tg/archive.md) |
| Bot para clientes | Cuenta del bot, fuentes permitidas y cuándo consultar a una persona | [Bots](./tg/bot.md) |

Los ejemplos desarrollados usan Telegram. Puedes expresar los mismos objetivos con MAX; el agente
debe comprobar qué admite tu cuenta y usar [los comandos de MAX](./max/usage.md), sin sustituir
automáticamente `tg` por `max` en cualquier receta.

Para adaptar las peticiones a tus tareas, sigue con [Cómo formular peticiones](./prompting.md).
