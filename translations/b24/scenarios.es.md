---
title: "Escenarios paso a paso"
---

Cada escenario es una tarea habitual en orden: los comandos que hay que ejecutar, para qué sirve cada uno y qué mirar en la respuesta. Los mismos escenarios están en la terminal: `b24 guide` los enumera y `b24 guide <name>` muestra uno.

Los comandos que usan una cuenta empiezan por tu perfil, el nombre que diste a la cuenta al iniciar sesión: `b24 <profile> …`.

<a id="first-sync" />

## Primera sincronización y el tablero del embudo

Copia tus negociaciones y prospectos al almacén local y mira en qué punto está cada uno.

1. ```sh
   b24 session start
   ```

   pega la dirección del webhook entrante del portal, se comprueba contra el portal y se guarda en el llavero

2. ```sh
   b24 session status --check
   ```

   el empleado con el que actúa el webhook y si es administrador de Bitrix24

3. ```sh
   b24 users list
   ```

   tu propio id de usuario y los ids de los compañeros cuyas negociaciones quieres

4. ```sh
   b24 config set crm.bitrix24:example.bitrix24.ru.unassigned 1
   ```

   de quién copiar las negociaciones y los prospectos, por id de usuario separados por comas, con la dirección de tu portal en lugar de example.bitrix24.ru. Hasta que elijas, una sincronización no copia nada

5. ```sh
   b24 sync
   ```

   copia las negociaciones y los prospectos de los usuarios elegidos y sus clientes, y la siguiente sincronización solo trae los cambios

6. ```sh
   b24 pipelines show Sales
   ```

   el embudo como tablero, cuántas negociaciones hay en cada etapa y cuántas llegaron a ella

7. ```sh
   b24 deals list status:open
   ```

   las negociaciones abiertas con etapa, importe y responsable, desde el almacén, también sin conexión

Qué mirar:

- scope en la respuesta de sync, que dice de quién copió las negociaciones y los prospectos
- issues en la respuesta de sync, como un usuario que no pudo tomar o un permiso que le falta al webhook
- la etapa donde esperan más negociaciones

`example.bitrix24.ru` es la dirección de tu portal, y `1` los ids que elegiste. A menudo un webhook es de un
compañero, así que b24 nunca elige de quién copias las negociaciones.

En la terminal: `b24 guide first-sync`

<a id="keep-in-sync" />

## Mantener la copia al día

Haz que el almacén local siga al portal por su cuenta, y busca en él junto a tus otras herramientas de WireCat.

1. ```sh
   b24 schedule command crm --every 1h -- sync
   ```

   un temporizador en este ordenador que ejecuta sync cada hora y solo lee lo que cambió

2. ```sh
   b24 schedule list
   ```

   la programación, cuándo se ejecuta la próxima vez y cómo fue la última

3. ```sh
   b24 store status
   ```

   cuánto avanzó la sincronización de cada tipo, cuántos elementos hay guardados y cuándo se ejecutó por última vez

4. ```sh
   b24 search all kitchen
   ```

   las negociaciones y los prospectos guardados junto a tus mensajes, notas y reuniones de otras herramientas de WireCat

Qué mirar:

- una programación cuya última ejecución falló
- un tipo en store status que está a medias, que la siguiente sincronización continúa

En la terminal: `b24 guide keep-in-sync`

<a id="safe-agent-writes" />

## Dejar que un agente cambie el CRM sin sorpresas

Da a un agente tu CRM por MCP y quédate con las escrituras que llegan a los clientes o que no se pueden deshacer.

1. ```sh
   b24 config set permissions.deals.move readonly
   ```

   un cambio de etapa puede poner en marcha los robots del portal, que escriben a los clientes. Por MCP ask no pregunta, así que allí ask no detiene nada

2. ```sh
   b24 config set permissions.deals.delete deny
   ```

   ningún agente borra una negociación, se le pida lo que se le pida

3. ```sh
   b24 mcp add claude-code --permission leads.delete=deny --allow-writes
   ```

   añade este perfil a Claude Code. Este servidor también rechaza borrar prospectos, y --allow-writes reconoce las escrituras que aún ofrece

4. ```sh
   b24 config show
   ```

   cada permiso con su nivel y de dónde viene

5. ```sh
   b24 runs list
   ```

   lo que ejecutó el agente, también las escrituras rechazadas

Qué mirar:

- los niveles de deals.move, deals.delete y leads.delete en config show
- las ejecuciones rechazadas en runs list, y qué comando las pidió

En una terminal `ask` sigue preguntando antes de escribir. Por MCP no hay nadie para responder, así que una escritura
en `ask` sigue adelante. Pon `readonly` o `deny`, o activa la aprobación de `b24_write` en el cliente del agente.

En la terminal: `b24 guide safe-agent-writes`
