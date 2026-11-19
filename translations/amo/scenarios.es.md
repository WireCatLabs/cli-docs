---
title: "Escenarios paso a paso"
---

Cada escenario es una tarea habitual en orden: los comandos que hay que ejecutar, para qué sirve cada uno y qué mirar en la respuesta. Los mismos escenarios están en la terminal: `amo guide` los enumera y `amo guide <name>` muestra uno.

Los comandos que usan una cuenta empiezan por tu perfil, el nombre que diste a la cuenta al iniciar sesión: `amo <profile> …`.

<a id="first-sync" />

## Primera sincronización y el tablero del embudo

Copia tus negocios y sus clientes en el almacén local y mira en qué etapa está cada negocio.

1. ```sh
   amo setup
   ```

   la dirección de la cuenta y el token de larga duración de tu integración privada; los dos se comprueban en la cuenta antes de guardar nada

2. ```sh
   amo session status --check
   ```

   la cuenta y el usuario en cuyo nombre actúa el token, y si ese usuario es administrador

3. ```sh
   amo sync
   ```

   copia los embudos, los negocios asignados a ti y solo los contactos y empresas de esos negocios; la siguiente sincronización toma solo los cambios

4. ```sh
   amo pipelines show Sales
   ```

   el embudo como tablero y como embudo de ventas: cuántos negocios hay en cada etapa y cuántos llegaron a ella

5. ```sh
   amo deals list status:open
   ```

   los negocios abiertos con etapa, importe y responsable, desde el almacén, también sin conexión

Qué mirar:

- el usuario en session status, porque el token de un compañero copia sus negocios, no los tuyos
- los avisos en la respuesta de sync, como una página que la cuenta rechazó
- la etapa donde esperan más negocios

`Sales` representa uno de tus embudos; `amo <profile> pipelines list` los nombra. Un administrador puede copiar
también los negocios de sus compañeros, por sus id de usuario: `amo <profile> users list` y luego el ajuste
`unassigned` en la página de ajustes. Ningún ajuste copia todo el CRM, y cualquier otro cliente se lee en directo con
`people` u `organizations`.

En la terminal: `amo guide first-sync`

<a id="keep-in-sync" />

## Mantener la copia al día

Haz que el almacén local siga a la cuenta por sí solo y busca en él junto a tus otras herramientas de WireCat.

1. ```sh
   amo schedule command crm --every 1h -- sync
   ```

   un temporizador en este ordenador que ejecuta sync cada hora; lee solo lo que cambió

2. ```sh
   amo schedule list
   ```

   la programación, cuándo se ejecuta la próxima vez y cómo fue su última ejecución

3. ```sh
   amo store status
   ```

   cuánto ha avanzado la sincronización de cada tipo, cuántos registros hay guardados y cuándo se ejecutó por última vez

4. ```sh
   amo search all invoice
   ```

   los negocios guardados junto a tus mensajes, notas y reuniones de otras herramientas de WireCat

Qué mirar:

- una programación cuya última ejecución falló
- un tipo en store status que está partial, con el que sigue la próxima sincronización

`amo <profile> sync --rescan` vuelve a leerlo todo, también cada id, cuando la copia parece incorrecta.

En la terminal: `amo guide keep-in-sync`

<a id="safe-agent-writes" />

## Dejar que un agente cambie el CRM sin sorpresas

Da a un agente tu CRM por MCP mientras las escrituras que llegan a los clientes o que no se pueden deshacer siguen siendo tuyas.

1. ```sh
   amo config set permissions.deals.move readonly
   ```

   un cambio de etapa puede lanzar la automatización de la propia cuenta, como un Salesbot que escribe a un cliente; por MCP ask no pregunta, así que ahí ask no detiene nada

2. ```sh
   amo config set permissions.deals.close deny
   ```

   ningún agente marca un negocio como ganado o perdido, se le pida lo que se le pida

3. ```sh
   amo mcp add claude-code --permission people.update=deny --allow-writes
   ```

   añade este perfil a Claude Code; este servidor además rechaza los cambios de contactos, y --allow-writes reconoce las escrituras que todavía ofrece

4. ```sh
   amo config show
   ```

   cada permiso con su nivel y de dónde viene

5. ```sh
   amo runs list
   ```

   lo que ejecutó el agente, también las escrituras rechazadas

Qué mirar:

- los niveles de deals.move, deals.close y people.update en config show
- las ejecuciones rechazadas en runs list, y qué comando las pidió

En una terminal `ask` sigue preguntando antes de escribir. Por MCP nadie puede responder, así que una escritura en
`ask` sigue adelante. Pon `readonly` o `deny`, o activa la aprobación de `amo_write` en el cliente del agente.

En la terminal: `amo guide safe-agent-writes`
