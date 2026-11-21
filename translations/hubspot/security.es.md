---
title: "Seguridad"
---

Da tu CRM de HubSpot a un agente de IA y sabe adónde van tu clave y los datos de tus clientes. La clave se queda en el
llavero del sistema y solo llega a HubSpot, la copia de tu CRM se queda en tu ordenador, y puedes borrarla con un solo
comando.

Aquí encuentras qué guarda `hubspot` en el disco, qué envía por la red y cómo limpiar después de que se filtre una
clave. Lo que comparten las CLI de WireCat, como el llavero, los permisos, MCP y lo que nunca llega a un registro, está
en la [página de seguridad común](https://wirecat.dev/en/docs/security).

**En esta página:**

1. [La clave](#the-key)
2. [La copia](#the-copy)
3. [Texto de la cuenta](#text-from-the-account)
4. [MCP por HTTP](#mcp-over-http)
5. [Registros de ejecución y archivos](#run-records-and-files)

<!-- cspell:words hubapi -->

## La clave

`session start` lee la clave de servicio o el token de app privada oculto o desde stdin, nunca como argumento.
Pregunta a HubSpot a qué cuenta pertenece la clave (`GET /account-info/2026-03/details`), y solo entonces guarda la
clave con el id de la cuenta en el llavero del sistema, o en un archivo que solo tú puedes leer donde no hay llavero.
La clave va solo en la cabecera `Authorization` de una petición a `api.hubapi.com`, nunca en una dirección, una
respuesta, un registro de ejecución ni el diario de envíos. `hubspot` nunca la envía al endpoint de información de
tokens de HubSpot, que recibe el token en su dirección.

La clave lee y cambia lo que permiten sus scopes, para toda la cuenta: dale los scopes de escritura solo si quieres
escrituras. `hubspot` no puede revocarla.
`session end` y `account remove` la olvidan en este ordenador, y después de una filtración la borras o la rotas en
HubSpot.

## La copia

`sync` guarda las negociaciones, los contactos y las empresas de la cuenta, y las actividades cuando las activas, en
el almacén local de WireCat en tu ordenador. Los
[términos para desarrolladores de HubSpot](https://legal.hubspot.com/developer-terms) piden no guardar los datos más
tiempo del necesario: `hubspot work account remove --delete-data` borra la copia de la cuenta y olvida la clave.

## Texto de la cuenta

Los nombres, los valores de propiedades, las notas, las direcciones de correo, los números de teléfono y los enlaces
de una respuesta los escribieron otras personas. Por MCP llegan al agente marcados como no fiables, así que los lee
como datos, nunca como instrucciones.

## MCP por HTTP

`hubspot work mcp serve --http` escucha solo en `127.0.0.1`, para apps del navegador que llegan a través de tu propio
túnel. Cada app entra con un código de un solo uso, y el servidor guarda un hash de cada entrada que da, en la carpeta
de estado, legible solo por ti. `hubspot work mcp revoke` las olvida todas.

## Registros de ejecución y archivos

Un registro de ejecución guarda la línea de comandos tal como la escribiste, con cada secreto guardado como
`[redacted]`. Para no guardar ninguna de las palabras que escribes, ejecuta
`hubspot work config set record_input false`.

`config.json` se guarda legible solo por ti (`0600`), y su carpeta se crea solo para ti (`0700`). `hubspot
doctor` muestra en `files.problems` un archivo o una carpeta abiertos a otros usuarios e imprime el `chmod` que lo
arregla. Informa de una vulnerabilidad como indica
[SECURITY.md](https://github.com/WireCatLabs/hubspot-cli/blob/main/SECURITY.md).
