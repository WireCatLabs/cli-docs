---
title: "Escenarios paso a paso"
---

Cada escenario es una tarea habitual en orden: los comandos que hay que ejecutar, para qué sirve cada uno y qué mirar en la respuesta. Los mismos escenarios están en la terminal: `zm guide` los enumera y `zm guide <name>` muestra uno.

Los comandos que usan una cuenta empiezan por tu perfil, el nombre que diste a la cuenta al iniciar sesión: `zm <profile> …`.

<a id="archive-recordings" />

## Un archivo diario y verificado de grabaciones en la nube

Descarga cada día las grabaciones en la nube de Zoom a una carpeta y confirma que cada archivo llegó completo.

1. ```sh
   zm personal recordings list --since-time 2026-10-01
   ```

   las grabaciones en la nube que Zoom tiene para ese intervalo, antes de descargar nada

2. ```sh
   zm personal recordings schedule create --name daily --output-dir /srv/zoom-archive --at 03:00 --timezone Europe/Madrid --since-time 2026-10-01
   ```

   muestra una vista previa de la tarea diaria y su temporizador; ejecútalo de nuevo con --yes para instalarla

3. ```sh
   zm personal recordings schedule run daily
   ```

   una ejecución ahora, para ver la tarea funcionar antes que el temporizador

4. ```sh
   zm personal recordings archive check /srv/zoom-archive
   ```

   comprueba el tamaño y la suma de verificación de cada archivo archivado, sin Zoom ni el almacén

Qué mirar:

- archivos cuya suma de verificación o tamaño no coincide; descárgalos de nuevo
- el último resultado de la tarea en schedule show y si el temporizador está activado
- zm personal recordings archive import añade las transcripciones archivadas al almacén

El archivo guarda sumas de verificación y tamaños, nunca URL firmadas ni tokens.

En la terminal: `zm guide archive-recordings`

<a id="catch-up" />

## Ponerse al día con las reuniones recientes

Lleva al almacén las reuniones de los últimos días y lee qué se decidió en cada una.

1. ```sh
   zm personal meetings sync --since-time 2026-10-01 --lookback-days 3
   ```

   trae reuniones, transcripciones y resúmenes nuevos, y revisa las recientes cuya transcripción llegó tarde

2. ```sh
   zm personal meetings list "started_at:[2026-10-01 TO 2026-10-08]"
   ```

   las reuniones guardadas en ese intervalo, las más recientes primero, con sus id locales

3. ```sh
   zm personal meetings summary 12
   ```

   el resumen propio de Zoom de una reunión; vista general, secciones y próximos pasos

4. ```sh
   zm personal meetings transcript 12
   ```

   la transcripción detrás del resumen, cuando una afirmación necesita las palabras exactas

Qué mirar:

- los recuentos de reuniones, transcripciones y resúmenes añadidos por la sincronización, y lo que omitió
- next_steps en cada resumen, que son los seguimientos
- una reunión sin transcripción todavía; sincroniza más tarde con --lookback-days

Un resumen es una paráfrasis de Zoom. Comprueba con la transcripción todo aquello sobre lo que vayas a actuar.

En la terminal: `zm guide catch-up`

<a id="find-quote" />

## Encontrar lo que se dijo, con su línea

Encuentra dónde surgió un tema en todas las reuniones y lee las líneas exactas a su alrededor.

1. ```sh
   zm personal search meetings "budget review" --limit 20 --json=ref,excerpt,source.title,source.started_at
   ```

   palabras en todas las transcripciones y resúmenes guardados; cada resultado conserva la referencia de su línea

2. ```sh
   zm personal meetings passage meeting:1/12/3/140 --before-n 3 --after-n 3
   ```

   la línea citada con tres líneas antes y después, con hablantes y horas

3. ```sh
   zm personal meetings evidence meeting:1/12
   ```

   las líneas, el chat o el resumen guardados detrás de una referencia de reunión, para un resultado que no es una línea de transcripción

Qué mirar:

- el ref de cada resultado; cítalo junto a cualquier afirmación que hagas
- un resultado vacío no prueba que nunca se dijeran esas palabras; prueba otra forma del nombre o la palabra
- meta.complete y el cursor de página cuando hay más resultados

Pasa el `ref` de un resultado a `meetings passage` tal cual. Los resultados de resúmenes y chat tienen referencias de reunión; léelos
con `meetings evidence` o `meetings show`.

En la terminal: `zm guide find-quote`

<a id="person-in-meetings" />

## Lo que dicen las reuniones sobre una persona

Encuentra a una persona entre los participantes de reuniones y lee lo que dicen de ella las reuniones pasadas.

1. ```sh
   zm personal meetings people "Alice Example"
   ```

   participantes que coinciden con un nombre o email, con los id de identidad y la persona vinculada, si la hay

2. ```sh
   zm personal meetings context person:7 --meetings 5 --cues 40
   ```

   las reuniones a las que asistió esa persona mediante identidades vinculadas, con las líneas que la mencionan

3. ```sh
   zm personal search meetings "Alice" --person-id 7 --limit 20
   ```

   palabras en las reuniones a las que asistió esa persona, cuando quieres un tema y no todo

Qué mirar:

- más de una identidad con el mismo nombre; un nombre por sí solo no prueba quién es
- un participante no es quien habla en cada línea de esa reunión
- para la misma persona en mensajes, correo y notas, usa memo guide person-brief

Vincula un participante con una persona con `zm personal meetings link` (muestra una vista previa; `--yes` la aplica). El contexto solo sigue esos
vínculos.

En la terminal: `zm guide person-in-meetings`

<a id="prepare-meeting" />

## Preparar una reunión próxima

Obtén un resumen con fuentes para la próxima reunión de una serie, a partir de sus reuniones pasadas.

1. ```sh
   zm personal meetings scheduled --json
   ```

   las series de los próximos siete días, con sus id de serie

2. ```sh
   zm personal meetings prepare 8123456789 --meetings 3 --cues 10
   ```

   las tres últimas reuniones de esa serie y las líneas que importan, cada una con su referencia

3. ```sh
   zm personal meetings passage meeting:1/12/3/140 --before-n 5 --after-n 5
   ```

   más contexto alrededor de una línea citada antes de confiar en ella

Qué mirar:

- las reuniones anteriores que usó el resumen y cuántas dejó fuera
- preguntas y promesas abiertas de la última vez, con sus referencias
- la cobertura de comunicaciones cuando hay fuentes de mensajes o correo configuradas

`meetings prepare` lee la agenda en Zoom y el historial en el almacén. No cambia nada.

En la terminal: `zm guide prepare-meeting`

## Con otras herramientas

Estos escenarios de Memo también usan `zm`:

- [Una persona en todas las herramientas](https://wirecat.dev/en/docs/memo/scenarios#person-brief): `memo guide person-brief`
