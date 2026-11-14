---
title: "Úsalo"
---

Has [conectado tu Asterisk](./installation.md), y las llamadas están en el almacén de WireCat. Aquí encontrarás el
trabajo diario que un equipo puede pasar a un agente de IA con ellas: prepararse para devolver una llamada, detectar
las llamadas que nadie contestó, repasar un día de llamadas por empleado y pasar las llamadas a otro sistema. Cada
tarea tiene una petición que puedes copiar, y [Con un horario](#run-it-on-a-schedule) muestra cómo hacer que ocurra
cada día sin ti.

**En esta página:**

1. [Qué obtienes de cada llamada](#what-you-get-from-each-call)
2. [Pídeselo a tu agente](#ask-your-agent)
3. [Con un horario](#run-it-on-a-schedule)
4. [Busca y lee llamadas tú mismo](#find-and-read-calls-yourself)
5. [Salida para scripts](#output-for-scripts)
6. [Agentes](#agents)

<a id="what-you-get-from-each-call"></a>

## Qué obtienes de cada llamada

Un grupo de timbrado, una cola o una transferencia escriben varios registros para una llamada. Tú la ves como una
sola llamada, con:

- **Cómo terminó:** contestada, buzón de voz, ocupado o no contestada, en una frase que un agente puede leer:

  ```text
  Incoming call to 600: answered by 101 Анна Смирнова after 0:03, talk 0:24. 102 Борис Кузнецов did not answer.
  Incoming call to 600: went to voicemail after ringing 101 Анна Смирнова, 102 Борис Кузнецов.
  ```

- **Las personas:** quien llama, el empleado que hizo la llamada y cada uno que contestó. Los empleados se nombran a
  partir del identificador de llamada de las llamadas que hacen.
- **La misma persona en todas partes:** si el móvil de quien llama está en tu CRM o en tus chats, es la misma persona
  allí, así que sus llamadas están junto a sus negocios, mensajes y correo. Un fijo solo se propone como coincidencia,
  porque mucha gente comparte un mismo número de oficina.
- **Lo que se dijo:** la grabación, convertida en texto en tu ordenador, sin enviar ninguna grabación a ningún
  servicio.

<a id="ask-your-agent"></a>

## Pídeselo a tu agente

Las peticiones empiezan con «Usa pbx CLI» para un agente con terminal, como Claude Code o Codex. En una aplicación
conectada por [MCP](#agents), nombra en su lugar la herramienta conectada.

**Antes de devolver la llamada a un cliente.** El agente lee las llamadas del cliente, lo que se dijo en ellas y lo
que escribió en chats o por correo:

```text prompt
Usa pbx CLI y memo. ¿Por qué nos llamó +7 916 123-45-67 este mes, qué le prometimos y nos escribió por algún otro
sitio? Cita las llamadas y los mensajes en los que te basas.
```

**Llamadas que nadie contestó.** El agente lista las llamadas entrantes que fueron al buzón de voz o no se
contestaron, y comprueba cada una con las llamadas posteriores:

```text prompt
Usa pbx CLI. Lista las llamadas entrantes de hoy que nadie contestó o que fueron al buzón de voz, con el número y la
hora. Para cada una, di si devolvimos la llamada a ese número o si después habló con alguien, y lista las que siguen
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

<a id="run-it-on-a-schedule"></a>

## Con un horario

Las llamadas se mantienen al día cuando la sincronización y la transcripción se ejecutan solas, por ejemplo cada
quince minutos desde cron:

```sh
*/15 * * * * pbx office meetings sync && pbx office meetings transcribe --max-meetings 20
```

Una petición como las de [Pídeselo a tu agente](#ask-your-agent) también puede ejecutarse con un horario, en un agente
que ejecuta tareas con un temporizador: cada tarde, la lista de llamadas aún sin devolver, o cada lunes, la semana por
empleado. WireCat Desktop sincroniza con un temporizador sin cron: **Sincronizar con horario** en la cuenta.

<a id="find-and-read-calls-yourself"></a>

## Busca y lee llamadas tú mismo

Un perfil es el nombre que diste a la centralita, la primera palabra de cada comando. Nunca se supone un perfil, ni
siquiera el único: un comando sin perfil se detiene y muestra los perfiles de este ordenador. `PBX_PROFILE=office` lo
fija durante una sesión de la shell.

```sh
pbx office meetings sync                                  # import what is new
pbx office meetings list "started_at>=2026-11-01"          # newest first
pbx office meetings list "title:*79161234567*"             # the calls of one number
pbx office meetings show 42                                # times, people, recording
pbx office meetings transcript 42                          # what was said
pbx office meetings export 42 --format vtt --output call-42.vtt
```

El título de una llamada son sus dos lados, `+79161234567 → 101`. `pbx office meetings list --help` muestra los
campos que admite una consulta, y `meetings export` guarda una llamada como Markdown o su transcripción como WebVTT.

<a id="output-for-scripts"></a>

## Salida para scripts

Todos los comandos salvo `mcp serve` sobre stdin y stdout admiten `--json` e imprimen un único valor JSON en stdout.
`meetings list --jsonl` imprime una llamada por línea, con su descripción, para que la lea otro sistema. Los errores
salen en JSON por stderr, con un código y un motivo para decidir qué hacer. La [referencia de comandos](./commands.md)
lista los códigos.

<a id="agents"></a>

## Agentes

`pbx skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`pbx skill install --for hermes` además añade esa carpeta a los ajustes de Hermes Agent, así que un `skill install`
sin más deja fuera a Hermes. `pbx office mcp serve` sirve los comandos del perfil por MCP, sobre stdin y stdout:

```sh
claude mcp add pbx -- pbx office mcp serve
```

El servidor ofrece todos los comandos salvo `session start` y `session end`. Los permisos del perfil deciden qué se
ejecuta; consulta los [ajustes](./configuration.md#permissions). El texto de una llamada (una transcripción, el nombre
de quien llama, un número) llega al agente marcado como datos no fiables, así que las palabras dichas en una llamada
no pueden dar instrucciones al agente.

Para ChatGPT y Claude en el navegador,
`pbx office mcp serve --http --public-url https://laptop.example.ts.net` escucha en `127.0.0.1` (puerto 8765, o
`--port`) detrás de tu propio túnel. Una aplicación del navegador inicia sesión con un código de un solo uso que
imprime el comando. `pbx office mcp revoke` cierra todas las sesiones.
