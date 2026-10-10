---
title: "Estadísticas"
---

<a id="retención-a-partir-de-listas-observadas" />
<a id="comprobar-y-actualizar-contadores" />
<a id="selección-y-calidad" />
<a id="measures-and-scores" />
<a id="follow-the-evidence" />
<a id="save-a-resolved-ranking" />
<a id="métricas-y-puntuaciones" />
<a id="mensajes-originales" />

Esta página es necesaria cuando diriges o sigues un grupo o canal y quieres datos, no sensaciones: qué mensajes llamaron la atención, quién responde preguntas, qué preguntas aún están esperando y si quedan algún recién llegado. Aprenderá qué preguntarle al agente de IA, qué comando ejecutará, cómo será la respuesta y dónde los números pueden ser engañosos.

Unas palabras que aparecerán a continuación:

- **Historial guardado**: mensajes que `max` conserva en este ordenador. Cada informe solo cuenta estos datos. Si faltan los necesarios, [descarga el historial](./archive.md).
- **Observado**: visto en ese historial. Una respuesta, entrada o reacción no descargada no se cuenta: un valor ausente es desconocido, no cero.
- **Contador**: cifra que MAX guarda para un mensaje, como vistas o reacciones.

## Lo que puedes descubrir

|Pregunta|Comando|
| --- | --- |
|¿Qué mensajes recibieron más reacciones?| `max stats messages top` |
|¿Quién responde las preguntas con más frecuencia?| `max stats contacts top` |
|¿Qué preguntas esperan ser respondidas?| `max stats messages unanswered` |
|¿Qué tan rápido responde una persona?| `max stats contacts responses` |
|¿Recibieron ayuda los recién llegados?| `max stats chats newcomers` |
|¿Quedan algunos recién llegados?| `max stats chats retention` |
|¿Qué publicaciones se vieron pero no se discutieron?| `max stats messages discussion` |
|¿Qué tan recientes son las opiniones y reacciones?| `max stats messages counters show` |

Las peticiones, los nombres y los resultados son ejemplos ficticios. Sustituye el nombre del chat por el tuyo. Las tablas muestran cómo puede presentar su respuesta el agente; los comandos con `--json` le devuelven los datos.

## Mensajes que reciben reacciones

Encuentra los mensajes con más reacciones guardadas.

**Tu petición:**

> Usa max CLI. Muéstrame los tres mensajes de Поход con más reacciones.

**Comando:**

```sh
max stats messages top --chat "Поход" --measure reactions --limit 3 --json
```

**Ejemplo de respuesta del agente:**

> | Mensaje | Reacciones |
> | --- | ---: |
> | Lista de equipaje | 18 |
> | Fotos de la excursión | 11 |
> | Nueva ruta | 7 |

El agente puede abrir los mensajes originales para comprobar el contexto. Los recuentos son acumulados: no son solo las reacciones recibidas durante un periodo seleccionado.

## Quién responde preguntas

Compara a las personas por sus respuestas observadas a preguntas.

**Tu petición:**

> Usa max CLI. ¿Quién respondió más preguntas en Поход? Muéstrame tres personas.

**Comando:**

```sh
max stats contacts top --chat "Поход" --measure answers --limit 3 --json
```

**Ejemplo de respuesta del agente:**

<a id="find-questions-and-posts-that-need-attention" />

<a id="preguntas-y-publicaciones-que-necesitan-atención" />

<a id="вопросы-и-посты-которым-нужно-внимание" />

## Preguntas pendientes

Encuentra preguntas antiguas sin respuesta directa observada.

**Tu petición:**

> Usa max CLI. ¿Qué preguntas de Поход llevan más de un día esperando respuesta?

**Comando:**

```sh
max stats messages unanswered --chat "Поход" --older-than 24h --json
```

**Ejemplo de respuesta del agente:**

> **Una pregunta no tiene respuesta observada.**
>
> | De | Pregunta | Espera |
> | --- | --- | --- |
> | Ira | ¿Quién llevará la olla? | 2 días |
>
> El historial está incompleto: puede faltar una respuesta en el archivo.

Se detectan preguntas por el signo de interrogación fuera de los enlaces. Cuenta una respuesta directa de otra persona conocida; el siguiente mensaje sin relación no cierra la pregunta.

## Cuánto tarda una persona en responder

Consulta cuántas respuestas se observaron y cuánto tardaron para la persona elegida.

**Tu petición:**

> Usa max CLI. ¿Cuánto tarda Алекс en responder preguntas en Поход? Muéstrame un ejemplo.

**Comando:**

```sh
max stats contacts responses --chat "Поход" --answerer "Алекс" --json
```

**Ejemplo de respuesta del agente:**

> | Indicador | Resultado |
> | --- | --- |
> | Respuestas observadas | 1 |
> | Mediana de espera | 2 días |
> | Espera p90 | 2 días |
>
> Ambos valores proceden de una sola respuesta: la muestra es pequeña. Puedo abrir la pregunta y la respuesta vinculada.

La mediana es el punto central de los tiempos observados; p90 es el límite superior de aproximadamente el 90% de las respuestas. Elegir una persona no demuestra que fuera administradora en el pasado.

## Ayuda a los nuevos miembros

Comprueba si las personas recién incorporadas recibieron respuestas.

**Tu petición:**

> Usa max CLI. ¿Recibieron ayuda los nuevos miembros de Поход durante su primera semana?

**Comando:**

```sh
max stats chats newcomers "Поход" --within 7d --json
```

**Ejemplo de respuesta del agente:**

> | Nuevo miembro | Preguntas | Respondidas |
> | --- | ---: | ---: |
> | Kate | 2 | 2 |
> | Oleg | 1 | 0 |
>
> Oleg no tiene respuesta observada. Se desconoce cuándo entró una persona, por lo que no se calculó su primera semana.

Por defecto se incluyen las incorporaciones de los últimos 30 días. La primera aparición de una persona en el archivo no demuestra cuándo entró.

<a id="retention-from-roster-observations" />

## ¿Se quedan los nuevos miembros?

Compara la presencia observada un día, una semana y un mes después de entrar.

**Tu petición:**

> Usa max CLI. ¿Cuántos nuevos miembros de Поход seguían presentes después de un día, una semana y un mes? Muestra los datos que faltan.

**Comando:**

```sh
max stats chats retention "Поход" --checkpoints 1d,7d,30d --within 7d --timezone UTC --json
```

**Ejemplo de respuesta del agente:**

> | Desde la entrada | Presentes entre los observables | Desconocido | Aún es pronto |
> | --- | --- | ---: | ---: |
> | 1 día | 1 de 1 — 100% | 1 | 1 |
> | 7 días | 1 de 2 — 50% | 0 | 1 |
> | 30 días | Sin denominador observable | 2 | 1 |
>
> Los denominadores son distintos: estos porcentajes no forman una curva completa de retención. No observar un mensaje no demuestra que una persona permaneciera en silencio.

Necesitamos fechas de entrada conocidas y listas guardadas de participantes. Se desconoce la ausencia de una persona en la lista incompleta; [Las listas guardadas de miembros de sus grupos](./groups.md#снимки-участников) ayudan a recopilar datos para informes futuros.

## Publicaciones sin conversación

Encuentra publicaciones vistas con poca conversación guardada.

**Tu petición:**

> Usa max CLI. ¿Qué publicaciones de Новости recibieron visitas, pero ninguna conversación?

**Comando:**

```sh
max stats messages discussion --chat "Новости" --min-views 100 --max-replies 0 --json
```

**Ejemplo de respuesta del agente:**

> | Publicación | Visitas guardadas | Respuestas observadas |
> | --- | ---: | ---: |
> | Nueva ruta | 240 | 0 |
>
> No se observa conversación en el historial disponible. Los comentarios que falten podrían cambiar la conclusión.

<a id="check-and-refresh-counters" />

## Antigüedad de los recuentos

Comprueba por separado cuándo se observaron las visitas y las reacciones.

**Tu petición:**

> Usa max CLI. Comprueba la antigüedad de las visitas y reacciones de Поход sin actualizar nada.

**Comando:**

```sh
max stats messages counters show --chat "Поход" --counters views,reactions --max-age 24h --limit 20 --json
```

**Ejemplo de respuesta del agente:**

> | Campo del mensaje | Valor | Observado |
> | --- | ---: | --- |
> | Visitas | 0 | Hace 1 hora — reciente |
> | Reacciones | 0 | Hace 3 días — antiguo |
>
> Cada campo tiene su propia antigüedad. Un valor ausente se muestra como desconocido, no como cero.

### Vista previa de una actualización

Antes de consultar recuentos nuevos, pide los mensajes exactos y los límites.

```sh
max stats messages counters refresh --chat "Поход" --counters views,reactions --max-messages 20 --sync-time 30s --dry-run --json
```

> **Plan:** Como máximo 20 mensajes y 30 segundos. Se admiten visitas y reacciones.
> Es una vista previa: todavía no se ha conectado ni actualizado nada.

Una actualización real necesita tu petición. Consulta los recuentos en MAX y guarda las observaciones localmente; no envía mensajes, no los marca como leídos ni solicita aumentar visitas. MAX actualiza visitas y reacciones; no admite actualizar comentarios.

<a id="scope-and-quality" />

<a id="names-and-unknown-response-activity" />

## Cuando faltan datos o no se reconoce un nombre

Si coinciden varias personas, el agente muestra los candidatos y te pide elegir. No identificar a alguien no significa que su actividad sea cero. Incluso un ID seleccionado sin observaciones sigue siendo desconocido: JSON muestra `identityKnown: false`, `status: unknown`.

<a id="clasificaciones-guardadas" />

<a id="метрики-и-оценки" />

<a id="исходные-сообщения" />

<a id="сохранённый-рейтинг" />

## Más opciones

Puedes elegir período, dimensión y puntuación compuesta, y guardar la selección para repetir el informe. Las fórmulas, argumentos de evidencia y límites de páginas están en la [especificación compartida de estadísticas](https://github.com/leemour/cli-messaging/blob/main/docs/rankings.md) y la [referencia de comandos](./commands.md#max-stats).

Para verificar un resultado, pide al agente que abra la pregunta, respuesta o miembros que sustentan esa fila. Antes del siguiente informe, [comprueba la cobertura del archivo](./archive.md).
