---
title: "Úsalo"
---

Has [conectado tu Asterisk](./installation.md), y las llamadas están en el almacén local de WireCat. Esta página muestra
qué trabajo diario con las llamadas puede pasar un equipo a un agente de IA.

El agente puede prepararte para devolver una llamada, encontrar las llamadas que nadie contestó y hacer el informe de
la semana. Cada tarea tiene una petición que puedes copiar y enviar a tu agente.

El agente saca las respuestas del almacén local y muestra la llamada en la que se basa cada una.
[Con un horario](#run-it-on-a-schedule) muestra cómo hacer que este trabajo ocurra cada día sin ti.

**En esta página:**

1. [Qué obtienes de cada llamada](#what-you-get-from-each-call)
2. [Pídeselo a tu agente](#ask-your-agent)
3. [Un informe de la semana](#a-report-of-the-week)
4. [Encuentra llamadas por su significado](#find-calls-by-what-was-meant)
5. [Etiqueta todas las llamadas sobre devoluciones](#mark-every-call-about-refunds)
6. [Con un horario](#run-it-on-a-schedule)
7. [Busca y lee llamadas tú mismo](#find-and-read-calls-yourself)
8. [Salida para scripts](#output-for-scripts)
9. [Agentes](#agents)

<a id="what-you-get-from-each-call"></a>

## Qué obtienes de cada llamada

Un grupo de timbrado (un número que hace sonar varios teléfonos a la vez), una cola o una transferencia escriben
varios registros para una llamada. Tú la ves como una sola llamada, con:

- **Cómo terminó:** contestada, buzón de voz, ocupado o no contestada. Está escrito en una frase que un agente puede
  leer:

  ```text
  Incoming call to 600: answered by 101 Анна Смирнова after 0:03, talk 0:24. 102 Борис Кузнецов did not answer.
  Incoming call to 600: went to voicemail after ringing 101 Анна Смирнова, 102 Борис Кузнецов.
  ```

- **Las personas:** quien llama, el empleado que hizo la llamada y cada uno que contestó. Los empleados se nombran a
  partir del identificador de llamada (el nombre que la centralita muestra al llamar) de las llamadas que hacen.
  `memo context` y WireCat Desktop muestran en cada llamada su dirección, el empleado y el número de quien llama.
- **La misma persona en todas partes:** si el móvil de quien llama está en tu CRM o en tus chats, es la misma persona
  allí. Así sus llamadas están junto a sus negocios, mensajes y correo. Un fijo solo se propone como coincidencia,
  porque mucha gente comparte un mismo número de oficina.
- **Lo que se dijo:** la grabación, convertida en texto en tu ordenador. Una grabación solo va a un servicio si
  activas la [transcripción en la nube](./installation.md#cloud-transcription) para el perfil. Un perfil es el nombre
  que das a la conexión con la centralita.

<a id="ask-your-agent"></a>

## Pídeselo a tu agente

Para un agente con terminal, como Claude Code o Codex, la petición empieza con «Usa pbx CLI». Si usas una aplicación
conectada por [MCP](#agents) (la forma en que las aplicaciones conectan herramientas), nombra en la petición la
herramienta conectada.

**Antes de devolver la llamada a un cliente.** El agente lee las llamadas del cliente, lo que se dijo en ellas y lo
que escribió en chats o por correo:

```text prompt
Usa pbx CLI y memo. ¿Por qué nos llamó +7 916 123-45-67 este mes, qué le prometimos y nos escribió por algún otro
sitio? Cita las llamadas y los mensajes en los que te basas.
```

**Llamadas que nadie contestó.** El agente lista las llamadas entrantes que fueron al buzón de voz o no se
contestaron. Comprueba cada una con las llamadas posteriores:

```text prompt
Usa pbx CLI. Lista las llamadas entrantes de hoy que nadie contestó o que fueron al buzón de voz, con el número y la
hora. Para cada una, di si devolvimos la llamada a ese número o si después habló con alguien. Lista las que siguen
pendientes.
```

**Un día de llamadas por empleado.** El agente cuenta a partir de cómo terminó cada llamada:

```text prompt
Usa pbx CLI. Con las llamadas de ayer, da para cada empleado las llamadas que contestó, las que le sonaron y no
contestó, su tiempo total de conversación y la espera más larga antes de descolgar. Muéstralo en una tabla.
```

**De qué trató una llamada.** El agente lee la transcripción y escribe un resumen:

```text prompt
Usa pbx CLI. Lee la transcripción de la llamada más larga con Ольга Новикова de esta semana. Resume qué pidió, qué se
acordó y qué le debemos todavía.
```

Cada respuesta sale del almacén local, y el agente puede mostrar la llamada detrás de cada línea. Si una llamada aún
no tiene transcripción, el agente lo dice y puede [transcribirla](./installation.md#transcribe).

<a id="a-report-of-the-week"></a>

## Un informe de la semana

`stats calls show` cuenta las llamadas guardadas: por dirección y resultado, por empleado, por hora y por día.
También lista las llamadas entrantes perdidas y dice si alguien devolvió la llamada al cliente en un día. Solo lee el
almacén local. Por eso es rápido y no necesita conexión con la centralita.

```sh
pbx office stats calls show --since-time 7d --timezone Europe/Moscow
```

`--timezone` es la zona horaria en la que se cuentan las horas y los días. Sin él, se usa la zona de este ordenador.
`--within 2h` cambia el plazo: una llamada devuelta dentro de ese plazo cuenta como respuesta a la llamada perdida.

```text prompt
Usa pbx CLI. Haz un informe de las llamadas de la semana pasada con pbx office stats calls show: las llamadas por día,
la proporción de contestadas, las llamadas contestadas y el tiempo de conversación de cada empleado, las horas con más
llamadas y las llamadas perdidas que nadie devolvió, con el número y la hora. Muéstralo en tablas y luego di las tres
cosas que hay que arreglar primero.
```

<a id="find-calls-by-what-was-meant"></a>

## Encuentra llamadas por su significado

`search meetings` encuentra una llamada por las palabras que se dijeron en ella. Con `--model`, también la encuentra
por su significado. Por ejemplo, la petición «un cliente descontento con la entrega» puede encontrar una llamada donde
el cliente dijo «el mensajero llegó tres días tarde». No tienen ninguna palabra en común. El modelo de texto (un
programa que compara el significado de las frases) funciona en este ordenador, así que ninguna transcripción sale de
él.

Descarga el modelo de texto una vez y prepara los datos de búsqueda para las llamadas que ya tienes:

```sh
pbx models download embeddinggemma
pbx office meetings embed            # shows what it would do, and changes nothing
pbx office meetings embed --yes      # builds one batch; run it again until nothing is left
pbx office search meetings "a client unhappy with the delivery" --model embeddinggemma
```

Cada resultado dice cómo se encontró, por palabras o por significado, y cita el fragmento de la transcripción. Una
búsqueda con `--model` también prepara los datos de las llamadas transcritas desde el último `meetings embed`. Así
nunca se salta una llamada nueva. Pero es más rápida cuando [el horario](#run-it-on-a-schedule) ejecuta
`meetings embed --yes`.

```text prompt
Usa pbx CLI. Encuentra las llamadas de este mes en las que un cliente estaba descontento con la entrega. Busca por
significado con --model embeddinggemma. Para cada llamada da la fecha, el número del cliente, qué salió mal con sus
palabras y si prometimos algo. Cita el fragmento en el que se basa cada línea.
```

<a id="mark-every-call-about-refunds"></a>

## Etiqueta todas las llamadas sobre devoluciones

`tags add` pone una etiqueta en las llamadas. Con `--matching`, la pone en cada llamada que encuentra una búsqueda.
Con `--meeting`, la pone en las llamadas que tú nombras. `--matching` admite las mismas palabras que
`search meetings`, con `OR` entre las alternativas.

```sh
pbx office tags add refund --matching "refund OR возврат"
pbx office tags add vip --meeting 42
pbx office tags list tag:refund
pbx office search meetings "delivery" --tag refund
```

Una segunda ejecución etiqueta solo las llamadas nuevas desde la primera, y la respuesta lista lo que cambió. Una
etiqueta se queda aunque la llamada se vuelva a transcribir. Memo y las demás herramientas de WireCat ven las mismas
etiquetas. `tags remove refund --meeting 42` quita una etiqueta.

```text prompt
Usa pbx CLI. Pon la etiqueta refund a cada llamada sobre una devolución, con tags add --matching. Luego lista las
llamadas etiquetadas de esta semana con el cliente, el importe si lo dijo y si se aceptó la devolución.
```

<a id="run-it-on-a-schedule"></a>

## Con un horario

Las llamadas se mantienen al día cuando la sincronización, la transcripción y las etiquetas se ejecutan solas. Por
ejemplo, cada quince minutos desde cron, el programador de tareas de Linux y macOS:

```sh
*/15 * * * * pbx office meetings sync && pbx office meetings transcribe --max-meetings 20 && pbx office tags add refund --matching "refund OR возврат" && pbx office meetings embed --yes
```

Cada paso trabaja con lo que es nuevo desde la última ejecución: llamadas, grabaciones y transcripciones nuevas.
`meetings embed --yes` mantiene rápida la búsqueda por significado. Si solo buscas por palabras, puedes quitar ese
paso.

Una petición como las de [Pídeselo a tu agente](#ask-your-agent) también puede ejecutarse con un horario. Para eso
necesitas un agente que ejecute tareas con un temporizador. Por ejemplo, cada tarde la lista de llamadas aún sin
devolver, o cada lunes la semana por empleado. WireCat Desktop sincroniza con un temporizador sin cron: activa
**Sincronizar con horario** en la cuenta.

<a id="find-and-read-calls-yourself"></a>

## Busca y lee llamadas tú mismo

Un perfil es el nombre que diste a la centralita. Es la primera palabra de cada comando. Nunca se supone un perfil,
ni siquiera el único. Un comando sin perfil se detiene y muestra los perfiles de este ordenador.
`PBX_PROFILE=office` lo fija durante una sesión de la terminal.

```sh
pbx office meetings sync                                  # import what is new
pbx office meetings list "started_at>=2026-11-01"          # newest first
pbx office meetings list "title:*79161234567*"             # the calls of one number
pbx office meetings show 42                                # times, people, recording
pbx office meetings transcript 42                          # what was said
pbx office meetings export 42 --format vtt --output call-42.vtt
```

El título de una llamada son sus dos lados, `+79161234567 → 101`. `pbx office meetings list --help` muestra los
campos que admite una consulta. `meetings export` guarda una llamada como Markdown o su transcripción como WebVTT (un
formato de subtítulos).

<a id="output-for-scripts"></a>

## Salida para scripts

Todos los comandos salvo `mcp serve` sobre stdin y stdout admiten `--json`. Con él imprimen un único valor JSON en la
salida estándar (stdout). `meetings list --jsonl` imprime una llamada por línea, con su descripción, para que la lea
otro sistema. Los errores salen en JSON por la salida de errores (stderr). Cada error trae un código y un motivo, y un
script puede decidir con ellos qué hacer. La [referencia de comandos](./commands.md) lista los códigos.

<a id="agents"></a>

## Agentes

`pbx skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw. Una
skill es un archivo con instrucciones que enseña al agente los comandos. `pbx skill install --for hermes` además
añade esa carpeta a los ajustes de Hermes Agent. Un `skill install` sin más deja fuera a Hermes.

`pbx office mcp serve` sirve los comandos del perfil por MCP, sobre stdin y stdout:

```sh
claude mcp add pbx -- pbx office mcp serve
```

El servidor ofrece todos los comandos salvo `session start` y `session end`. Los permisos del perfil deciden qué se
ejecuta; consulta los [ajustes](./configuration.md#permissions). El texto de una llamada (una transcripción, el nombre
de quien llama, un número) llega al agente marcado como datos no fiables. Así las palabras dichas en una llamada no
pueden dar instrucciones al agente.

Para ChatGPT y Claude en el navegador,
`pbx office mcp serve --http --public-url https://laptop.example.ts.net` escucha en `127.0.0.1` (puerto 8765, o
`--port`) detrás de tu propio túnel. Una aplicación del navegador inicia sesión con un código de un solo uso que
imprime el comando. `pbx office mcp revoke` cierra todas las sesiones.
