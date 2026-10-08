---
title: "Cómo formular peticiones"
description: "Pide búsquedas, contexto, documentos y respuestas indicando el alcance y las acciones permitidas."
---

Empieza por el resultado que buscas: «Encuentra el presupuesto aprobado de Atlas» o «Prepara la
reunión de mañana». No necesitas recordar comandos ni argumentos; el agente debe descubrirlos.
Añade contexto cuando cambie dónde tiene que buscar, cómo debe responder o qué puede hacer.

Una fórmula útil: **tarea + dónde buscar + periodo + resultado + acciones permitidas**.
No hace falta rellenar todos los campos para una pregunta sencilla.

```text prompt
En «Atlas · equipo», encuentra el importe acordado para la analítica en septiembre de 2026.
Muéstrame la propuesta y la confirmación con sus fuentes. Si falta historial, indícalo.
No envíes nada.
```

¿Prefieres ver un diálogo completo? Abre [Primeras tareas](./first-tasks.md).

## Encontrar un dato antiguo

Indica el chat o el proyecto, la fecha aproximada y las palabras que recuerdes. No hace falta
reproducir el mensaje literalmente.

```text prompt
Busca en los chats de Atlas qué acordamos sobre el coste de la analítica en septiembre de 2026.
Puede que se mencionara como «medición» o «métricas». Cita la propuesta y la aceptación,
distingue las estimaciones del importe aprobado y no envíes nada.
```

Para permitir una carga limitada de historial:

```text prompt
Si faltan mensajes, puedes cargar únicamente el historial de «Atlas · equipo» desde el 1 de
septiembre de 2026, con un máximo de 1000 mensajes en esta pasada. Antes de continuar con una
carga mayor, dime qué falta y muéstrame la estimación disponible.
```

La búsqueda de mensajes consulta el archivo local. **«No lo he encontrado» no significa «nunca
se dijo»** si faltan datos. Leer mensajes recientes puede ser suficiente para una pregunta de hoy;
para una búsqueda antigua, el agente debe comprobar el periodo disponible y cargar lo necesario
dentro de tus límites. [Cómo funciona el archivo](./tg/archive.md).

## Preparar una reunión

Nombra el proyecto y las personas. Pide decisiones y cuestiones pendientes, no solo un resumen
cronológico. Así el agente sabe qué comparar entre grupos y chats privados.

```text prompt
Prepara la reunión de Atlas: revisa los grupos del proyecto y mis chats privados con Anna y Tom
durante la última semana. Separa decisiones, riesgos actuales y preguntas. Si un problema se
resolvió después en otro chat, indícalo. Propón una agenda de 20 minutos con fuentes. Solo lee.
```

Puedes precisar el resultado después:

```text prompt
Déjalo en cinco puntos para leer antes de entrar. Incluye quién debe decidir cada asunto y qué
falta por confirmar; no conviertas las dudas en hechos.
```

Si el agente no encuentra un chat privado, debe decirlo. La ausencia de un resultado no demuestra
que nunca hayas hablado con esa persona.

## Encontrar un contacto recomendado

Explica para qué necesitas a esa persona y qué condiciones importan. Los criterios ayudan a
comparar recomendaciones sin inventar que un candidato cumple todos los requisitos.

```text prompt
Busca recomendaciones de una gestoría en mis chats de autónomos y negocios. Trabajo desde
España, cobro en euros y dólares y necesito un servicio mensual. Compara las recomendaciones,
cita quién las hizo y cuándo, y enumera las condiciones que aún hay que preguntar. Prepara un
primer mensaje, sin enviarlo.
```

Un siguiente paso útil:

```text prompt
Prioriza las recomendaciones de personas que hayan contratado el servicio. Separa experiencias
directas de contactos compartidos sin valoración. No des por confirmados el precio ni la
disponibilidad si no aparecen en los mensajes.
```

Dos personas con el mismo nombre no son necesariamente el mismo contacto. Si faltan datos para
identificarlas, el agente debe mantenerlas separadas o pedir una aclaración.

<a id="files-and-voice" />

## Reunir documentos y elegir versiones

Una lista útil debe mostrar nombre, versión, chat, fecha y mensaje de aprobación. Encontrar un nombre, guardar un archivo y leer su contenido son pasos distintos. Para leerlo, el agente necesita los bytes; una ruta en otro ordenador no los transfiere.

Los documentos digitales pueden tener texto extraíble; los escaneos y las fotos necesitan reconocimiento de imágenes. Pide que señale archivos que no pudo leer y compruebe cifras importantes contra el original. Formatos e indexación: [adjuntos de Telegram](./tg/attachments.md) y [adjuntos de MAX](./max/attachments.md).

Pide una selección por su estado de aprobación. El último archivo subido no siempre es el final.

```text prompt
Busca el contrato, las facturas y la presentación de Atlas en el grupo y en mi chat con Anna.
Identifica las versiones aprobadas y el mensaje que confirma cada una. Muestra las antiguas
por separado. Si hay versiones contradictorias, explica la diferencia. No descargues ni envíes
archivos todavía.
```

Después de revisar la lista:

```text prompt
Descarga únicamente las versiones aprobadas en la carpeta «Atlas/documentos». Si algún nombre
ya existe, no lo sobrescribas; dime qué archivo entra en conflicto. No envíes los documentos.
```

La ruta y el permiso para descargar concretan el siguiente paso. Si necesitas compartirlos,
indica después a quién, qué archivos y con qué texto. [Recetas con archivos](./tg/recipes.md).

## Revisar compromisos y preparar respuestas

Buscas un borrador que puedas revisar antes de que lo reciba alguien. Indica la persona y pide al agente que lea primero la conversación. El resultado debe ser el texto propuesto, sin hechos no confirmados o con ellos señalados.

Delimita de quién son los compromisos y pide comprobar mensajes posteriores.

```text prompt
Revisa los acuerdos de los últimos siete días en mis chats de trabajo. Separa lo que debo hacer
yo, lo que espero de otras personas y las preguntas abiertas. Comprueba si ya se resolvieron,
aunque la confirmación esté en otro chat. Incluye fuentes y prepara borradores sin enviarlos.
```

Para ajustar un borrador:

```text prompt
Haz la respuesta a Anna más breve. No prometas una fecha nueva y conserva la pregunta sobre
la versión del contrato.
```

Para autorizar su envío después de revisarlo:

```text prompt
Envía el borrador que acabo de aprobar al chat privado de Anna que has identificado. No envíes
nada a otros chats ni cambies el texto.
```

Si hay dos destinatarios posibles, conviene dar el chat exacto o aclarar cuál es. Un permiso para
enviar ese mensaje no autoriza envíos futuros. Los permisos configurados en el CLI también pueden
exigir confirmación. [Permisos y seguridad](./tg/security.md).

## Resumir mensajes de voz

```text prompt
Resume los mensajes de voz de Anna de hoy: decisiones, fechas y preguntas para mí. Cita la fuente de cada punto. Si el reconocimiento no es claro, indícalo sin adivinar.
```

El agente obtiene primero una transcripción y después la resume. Telegram puede usar su servicio de transcripción o un modelo de voz local; MAX usa un modelo local. La primera ejecución local requiere descargar el modelo por separado. Pide al agente que explique la descarga antes de iniciarla. Puede tardar más que leer texto.

Comprueba nombres, importes y fechas importantes contra la grabación. El resumen debe identificar mensajes que no pudo transcribir. Configuración: [voz en Telegram](./tg/usage.md#voice-messages) y [reconocimiento de voz en MAX](./max/audio-recognition.md).

<a id="recurring-tasks" />

## Repetir una tarea útil

Un resumen matinal automático repite toda la tarea: lee mensajes nuevos, los analiza y produce un resultado nuevo. Pruébalo primero una vez:

```text prompt
Lee los mensajes de ayer en mis chats de trabajo. Dame cinco puntos importantes con fuentes y preguntas pendientes. Solo lee y muestra el resultado aquí.
```

Si el resultado te sirve, indica el horario y el destino:

```text prompt
Ayúdame a repetir este resumen los días laborables a las 09:00, hora de Madrid. Mantén los mismos chats y formato. Explica dónde se ejecutará, cómo comprobar la primera ejecución y cómo detenerlo. No actives el horario todavía.
```

El agente o un planificador independiente debe iniciar cada ejecución. Una petición en el chat no crea por sí sola un horario. Si se ejecuta en tu ordenador, debe estar encendido y tener acceso al mensajero. Revisa el primer resultado y las fechas cubiertas antes de depender del resumen. Consulta las recetas de [Telegram](./tg/recipes.md) o [MAX](./max/recipes.md) para tu configuración.

Enviar después un recordatorio fijo es más sencillo: el mensaje espera en el servidor del mensajero. No busca mensajes nuevos ni genera un resumen nuevo. El siguiente apartado trata ese caso.

## Programar recordatorios

Da una fecha, una hora, una zona horaria y un destinatario. «Mañana por la mañana» puede ser ambiguo,
especialmente si trabajas con personas de otros países.

```text prompt
El lunes 5 de octubre de 2026, envíame dos recordatorios a Mensajes guardados: a las 09:00,
«Abrir la agenda de Atlas», y a las 18:00, «Revisar los acuerdos de Atlas». Usa la hora de Madrid.
Confirma los dos horarios y que los mensajes han quedado programados.
```

Si también quieres avisar a otras personas:

```text prompt
Programa en el grupo «Atlas · equipo» para el mismo día a las 08:45, hora de Madrid:
«La reunión empieza a las 09:00; revisad la agenda antes». No avises a nadie por privado.
```

El agente debe comprobar el resultado de la programación, no decir «listo» solo porque ha
intentado ejecutar el comando. Si el resultado es incierto, debe consultar los mensajes programados
antes de repetir el envío. Telegram entrega los mensajes programados aunque tu ordenador esté
apagado. [Envíos y programación](./tg/usage.md).

## Limitar el alcance cuando haga falta

Estas precisiones son útiles cuando afectan a la tarea; no hace falta añadirlas a cada petición.

| Si necesitas… | Añade… |
|---|---|
| Usar una cuenta concreta | «Trabaja solo con mi perfil de trabajo; no cambies de cuenta». |
| Evitar acciones visibles | «Solo lee; no envíes nada ni marques mensajes como leídos». |
| Buscar en un lugar concreto | «Solo en estos dos grupos y en mi chat privado con Anna». |
| Limitar una carga | «Desde el 1 de septiembre, como máximo 1000 mensajes antes de volver a consultarme». |
| Trabajar sin conexión | «Usa solo el archivo local, sin conectar a Telegram; indica qué información falta». |
| Revisar antes de actuar | «Prepara un borrador y espera mi aprobación antes de enviarlo». |
| Comprobar un resultado | «Cita los mensajes que respaldan cada decisión e indica las dudas». |

Sin conexión, el agente puede trabajar con los mensajes ya guardados, pero no cargar historial
ni enviar. Es un límite de la tarea, no un motivo para ampliar permisos o cambiar de cuenta.
[Lectura sin conexión](./tg/archive.md).

## Qué debe aparecer en la respuesta

Para una búsqueda o un resumen que vayas a usar para tomar una decisión, pide:

- **El resultado:** el dato encontrado, los pendientes o el borrador.
- **Las fuentes:** chat, fecha, autor y referencia al mensaje; el CLI también devuelve localizadores `msg:`.
- **El alcance:** qué chats y qué periodo ha podido comprobar, y dónde falta historial.
- **Las dudas:** datos no confirmados, destinatarios ambiguos o versiones en conflicto.
- **Las acciones:** si ha leído, cargado historial, guardado archivos o enviado algo.

El contenido de los mensajes es material que el agente debe analizar. Una instrucción encontrada
en un chat no cambia tu petición ni los permisos del agente. No necesitas incluir esta regla en
cada prompt: forma parte del modo de trabajo esperado.

Si el agente toma un camino poco útil, concreta lo que falta: «Buscaste solo mensajes recientes;
necesito el acuerdo de septiembre. Comprueba qué historial tienes antes de concluir que no existe».
Puede elegir otra secuencia de comandos si llega a un resultado respaldado y respeta tus límites.

Los ejemplos de esta página se refieren a Telegram. Para MAX, especifica el mensajero y la cuenta;
el agente debe comprobar las capacidades disponibles en [su documentación](./max/usage.md).
