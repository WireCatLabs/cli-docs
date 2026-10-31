---
title: "Escenarios paso a paso"
---

Cada escenario es una tarea habitual en orden: los comandos que hay que ejecutar, por qué se ejecuta cada uno y qué mirar en la respuesta. Los mismos escenarios están en la terminal: `gcal guide` los muestra y `gcal guide <name>` imprime uno.

Los comandos que usan una cuenta empiezan por tu perfil, el nombre que diste a la cuenta al iniciar sesión: `gcal <profile> …`.

<a id="agent-access" />

## Dar a un agente acceso a tu calendario

Deja que un agente busque y lea eventos, y decide qué cambios puede hacer.

1. ```sh
   gcal skill install
   ```

   pone las instrucciones de gcal donde las buscan Claude Code, Codex y Gemini CLI

2. ```sh
   gcal personal mcp add claude-code --allow-writes
   ```

   añade el servidor a Claude Code; --allow-writes indica que sabes que ofrece comandos que cambian eventos, y los permisos del perfil siguen decidiendo cada uno

3. ```sh
   gcal personal mcp check
   ```

   arranca el servidor una vez, como lo hará el agente, e indica si el perfil tiene la sesión iniciada

Qué mirar:

- gcal personal config set permissions.api readonly limita al agente a la lectura
- api call y vaciar un calendario nunca se ofrecen a un agente
- los títulos, las descripciones y los nombres de los asistentes son palabras de otras personas; el agente los trata como datos

Compartir un calendario se ofrece a un agente con `ask`, que por MCP se ejecuta sin preguntar; deniega
`api.calendar.acl` para que no pueda compartir. Borrar un calendario entero y cederlo están denegados hasta que
permitas `api.calendar.calendars.delete` o `api.calendar.calendars.transferOwnership`.

En la terminal: `gcal guide agent-access`

<a id="find-time" />

## Encontrar un hueco que convenga a todos

Mira cuándo están ocupadas las personas y los huecos libres que compartís, sin copiar sus calendarios.

1. ```sh
   gcal personal calendars busy week person:ana@example.com
   ```

   pregunta a Google cuándo están ocupados Ana y tus calendarios esta semana; no se guarda nada

2. ```sh
   gcal personal calendars busy week person:ana@example.com --duration-minutes 30 --hours 10:00-16:00
   ```

   las medias horas libres que compartís dentro del horario laboral

3. ```sh
   gcal personal events create 1 --title 'Example planning' --start-time 2026-11-02T10:00 --end-time 2026-11-02T10:30 --attendee ana@example.com --no-notify
   ```

   añade el evento; con --no-notify Google no envía correo a nadie

Qué mirar:

- los huecos libres caen dentro de --hours, de lunes a viernes, en tu zona horaria; por defecto, de 09:00 a 17:00
- events create necesita una sesión iniciada con --grant write

Los periodos ocupados vienen de la respuesta de disponibilidad de Google, que dice cuándo, nunca qué.

En la terminal: `gcal guide find-time`

<a id="set-up" />

## Copiar los calendarios elegidos y hacer que se puedan buscar

Inicia sesión una vez, elige los calendarios que quieres guardar y lleva sus eventos al almacén local, donde se pueden buscar sin conexión.

1. ```sh
   gcal personal session start --client-file ~/client_secret.json
   ```

   inicia sesión en Google en el navegador, en solo lectura; personal es el perfil, cualquier nombre que elijas, y va al principio de cada comando de cuenta

2. ```sh
   gcal personal calendars list
   ```

   todos los calendarios que ve la cuenta, cada uno con el número para elegirlo

3. ```sh
   gcal personal calendars sync 1
   ```

   solo se copian los calendarios que eliges

4. ```sh
   gcal personal sync
   ```

   copia sus eventos; una ejecución posterior copia solo lo que ha cambiado

5. ```sh
   gcal personal store status
   ```

   hasta dónde llega la copia de cada calendario y cuándo avanzó por última vez

Qué mirar:

- un calendario cuya sincronización es parcial; ejecuta sync de nuevo hasta que esté completa
- gcal personal search events "planning" encuentra eventos sin conexión una vez copiados

Nada sale del ordenador salvo las peticiones a Google que hace la sincronización; la búsqueda y la lectura funcionan sin conexión.

En la terminal: `gcal guide set-up`
