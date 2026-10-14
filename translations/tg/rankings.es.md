---
title: "Estadísticas"
---

<a id="preguntas-y-publicaciones-que-necesitan-atención" />
<a id="retención-a-partir-de-listas-observadas" />
<a id="comprobar-y-actualizar-contadores" />
<a id="alcance-y-calidad" />
<a id="métricas-y-puntuaciones" />
<a id="seguir-las-pruebas" />
<a id="guardar-una-clasificación-resuelta" />

Utilice esta página cuando ejecute o siga un grupo o canal y quiera datos en lugar de un sentimiento: qué mensajes llamaron la atención, quién responde preguntas, qué preguntas aún esperan y si los recién llegados se quedan. Aprenderá qué preguntarle a su agente de IA, qué comando ejecuta, cómo es la respuesta y dónde pueden engañar los números.

Algunas palabras en esta página:

- **Historial guardado** es la copia de los mensajes que `tg` guarda en esta computadora. Cada informe cuenta sólo esta copia. Si faltan los mensajes relevantes, [descargue el historial](./archive.md) primero.
- **Observado** significa visto en el historial guardado. Una respuesta, una unión o una reacción que nunca se descargó no se cuentan, por lo que el valor faltante se desconoce, no es cero.
- **Un contador** es un número que Telegram mantiene en un mensaje, como vistas o reacciones.

## Lo que puedes descubrir

| Pregunta | Comando |
| --- | --- |
| Qué mensajes obtuvieron más reacciones | `tg stats messages top` |
| Quién responde más preguntas | `tg stats contacts top` |
| Qué preguntas esperan respuesta | `tg stats messages unanswered` |
| ¿Qué tan rápido responde una persona? | `tg stats contacts responses` |
| Si los recién llegados recibieron ayuda | `tg stats chats newcomers` |
| Si los recién llegados se quedan | `tg stats chats retention` |
| Qué publicaciones fueron vistas pero no discutidas | `tg stats messages discussion` |
| Qué frescas son las opiniones y reacciones | `tg stats messages counters show` |

Las peticiones, los nombres y los resultados son ejemplos ficticios. Sustituye el nombre del chat por el tuyo. Las tablas muestran cómo puede presentar su respuesta el agente; los comandos con `--json` le devuelven los datos.

## Mensajes que reciben reacciones

Encuentra los mensajes con más reacciones guardadas.

**Tu petición:**

> Usa tg CLI. Muéstrame los tres mensajes de Hiking con más reacciones.

**Comando:**

```sh
tg stats messages top --chat "Hiking" --measure reactions --limit 3 --json
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

> Usa tg CLI. ¿Quién respondió más preguntas en Hiking? Muéstrame tres personas.

**Comando:**

```sh
tg stats contacts top --chat "Hiking" --measure answers --limit 3 --json
```

**Ejemplo de respuesta del agente:**

> | Persona | Respuestas |
> | --- | ---: |
> | Alex Rivera | 4 |
> | Lena | 2 |
> | Sam | 1 |

El número de respuestas permite encontrar ejemplos de participación; no demuestra por sí solo que una persona sea útil.

## Preguntas pendientes

Encuentra preguntas antiguas sin respuesta directa observada.

**Tu petición:**

> Usa tg CLI. ¿Qué preguntas de Hiking llevan más de un día esperando respuesta?

**Comando:**

```sh
tg stats messages unanswered --chat "Hiking" --older-than 24h --json
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

> Usa tg CLI. ¿Cuánto tarda Alex Rivera en responder preguntas en Hiking? Muéstrame un ejemplo.

**Comando:**

```sh
tg stats contacts responses --chat "Hiking" --answerer "Alex Rivera" --json
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

> Usa tg CLI. ¿Recibieron ayuda los nuevos miembros de Hiking durante su primera semana?

**Comando:**

```sh
tg stats chats newcomers "Hiking" --within 7d --json
```

**Ejemplo de respuesta del agente:**

> | Nuevo miembro | Preguntas | Respondidas |
> | --- | ---: | ---: |
> | Kate | 2 | 2 |
> | Oleg | 1 | 0 |
>
> Oleg no tiene respuesta observada. Se desconoce cuándo entró una persona, por lo que no se calculó su primera semana.

Por defecto se incluyen las incorporaciones de los últimos 30 días. La primera aparición de una persona en el archivo no demuestra cuándo entró.

## ¿Se quedan los nuevos miembros?

Compara la presencia observada un día, una semana y un mes después de entrar.

**Tu petición:**

> Usa tg CLI. ¿Cuántos nuevos miembros de Hiking seguían presentes después de un día, una semana y un mes? Muestra los datos que faltan.

**Comando:**

```sh
tg stats chats retention "Hiking" --checkpoints 1d,7d,30d --within 7d --timezone UTC --json
```

**Ejemplo de respuesta del agente:**

> | Desde la entrada | Presentes entre los observables | Desconocido | Aún es pronto |
> | --- | --- | ---: | ---: |
> | 1 día | 1 de 1 — 100% | 1 | 1 |
> | 7 días | 1 de 2 — 50% | 0 | 1 |
> | 30 días | Sin denominador observable | 2 | 1 |
>
> Los denominadores son distintos: estos porcentajes no forman una curva completa de retención. No observar un mensaje no demuestra que una persona permaneciera en silencio.

Esto necesita fechas de incorporación conocidas y listas de miembros guardadas. Se desconoce la ausencia en una lista parcial. [Las listas de miembros guardadas de los grupos que ejecuta](./groups.md#member-snapshots-and-changes) ayudan a recopilar datos para informes posteriores.

## Publicaciones sin conversación

Encuentra publicaciones vistas con poca conversación guardada.

**Tu petición:**

> Usa tg CLI. ¿Qué publicaciones de News recibieron visitas, pero ninguna conversación?

**Comando:**

```sh
tg stats messages discussion --chat "News" --min-views 100 --max-replies 0 --json
```

**Ejemplo de respuesta del agente:**

> | Publicación | Visitas guardadas | Respuestas observadas |
> | --- | ---: | ---: |
> | Nueva ruta | 240 | 0 |
>
> No se observa conversación en el historial disponible. Los comentarios que falten podrían cambiar la conclusión.

## Antigüedad de los recuentos

Comprueba por separado cuándo se observaron las visitas y las reacciones.

**Tu petición:**

> Usa tg CLI. Comprueba la antigüedad de las visitas y reacciones de Hiking sin actualizar nada.

**Comando:**

```sh
tg stats messages counters show --chat "Hiking" --counters views,reactions --max-age 24h --limit 20 --json
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
tg stats messages counters refresh --chat "Hiking" --counters views,reactions --max-messages 20 --sync-time 30s --dry-run --json
```

> **Plan:** Como máximo 20 mensajes y 30 segundos. Se admiten visitas y reacciones.
> Es una vista previa: todavía no se ha conectado ni actualizado nada.

Una actualización real necesita tu petición. Consulta los recuentos en Telegram y guarda las observaciones localmente; no envía mensajes, no los marca como leídos ni solicita aumentar visitas. También puede actualizar comentarios donde Telegram los proporcione.

## Cuando faltan datos o no se reconoce un nombre

Si coinciden varias personas, el agente muestra los candidatos y te pide elegir. No identificar a alguien no significa que su actividad sea cero. Incluso un ID seleccionado sin observaciones sigue siendo desconocido: JSON muestra `identityKnown: false`, `status: unknown`.

Un informe vacío con historial incompleto no demuestra que no hubiera preguntas o respuestas. Pide al agente que abra los mensajes originales y muestre los límites del historial disponible.

## Más opciones

Puede seleccionar un período, elegir una medida o puntuación combinada y guardar una selección para otro informe. Las fórmulas de puntuación, los argumentos de evidencia exacta y los límites de páginas se encuentran en la [especificación de estadísticas compartidas](https://github.com/WireCatLabs/cli-messaging/blob/main/docs/rankings.md) y la [referencia de comando para estadísticas](./commands.md#tg-stats).

Para verificar un resultado, pide al agente que abra la pregunta, respuesta o miembros que sustentan esa fila. Antes del siguiente informe, [comprueba la cobertura del archivo](./archive.md).
