---
title: "Bitrix24"
---

Sabes en qué punto está cada negociación y qué dijo un cliente por teléfono, sin abrir Bitrix24. `b24` da al agente
de IA que ya usas, como Claude Code o Codex, una copia de tus negociaciones y prospectos en tu ordenador, así que
responde a partir de esa copia, incluso sin conexión. También mueve y cierra negociaciones por ti, hasta donde lo
permitas.

Tu agente puede decirte qué negociaciones están atascadas en "Quote sent", qué cambió en el CRM durante la noche, o
cómo fue el embudo Sales en los últimos 30 días y por qué se perdieron negociaciones. Responde con la negociación, su
importe y su responsable. Necesitas un plan de Bitrix24 que incluya la API REST, que es como los programas hablan con
el portal.

**En esta página:**

1. [Qué obtienes](#what-you-get)
2. [Lo que no es obvio al principio](#things-a-newcomer-would-not-guess)
3. [Cómo se ve](#how-it-looks)
4. [Por qué b24](#why-b24)
5. [Qué puede hacer](#what-it-can-do)
6. [Cómo funciona](#how-it-works)
7. [Empieza en unos minutos](#start-in-a-few-minutes)
8. [Límites](#limits)
9. [Encuentra la guía para tu tarea](#find-a-guide-for-your-task)

## Qué obtienes

- **La respuesta, no la búsqueda.** Pregunta por una negociación o un cliente con tus propias palabras. El agente
  encuentra la negociación con su importe y su responsable, leída de tu ordenador, sin recorrer el portal a clics.
- **El embudo de un vistazo.** Cuántas negociaciones llegaron a cada etapa, cuánto tardaron las cerradas y por qué se
  perdieron las perdidas.
- **Mañanas que empiezan con lo que cambió.** Las negociaciones ganadas, perdidas y movidas de ayer llegan como un
  resumen breve a la hora que elijas, como un aviso en tu escritorio o en tu Telegram a través de `tg` de WireCat.
- **Llamadas que puedes leer.** La grabación de una llamada con un cliente se convierte en texto en tu ordenador, así
  que el agente puede decirte qué se prometió.
- **Cambios con solo pedirlos.** Basta con "Mueve Kitchen for Example a Contract signed". El agente encuentra la etapa
  por su nombre, y puedes comprobar qué permisos necesita un cambio antes de que se haga.
- **Tu CRM junto a tus chats.** Una sola búsqueda encuentra una negociación junto a los mensajes, el correo y las
  reuniones sobre ella que las otras herramientas de WireCat guardan en tu ordenador.

## Lo que no es obvio al principio

- **Un webhook es tu llave.** Bitrix24 te da un enlace que funciona como una contraseña, llamado webhook entrante.
  `b24` actúa con los permisos del empleado que lo creó. `b24 work setup` muestra dónde hacer clic y qué permisos
  marcar.
- **`work` es un nombre que eliges tú.** Identifica un portal, y es la primera palabra de cada comando. Ningún comando
  elige un portal por ti.
- **La copia guarda negociaciones, no todo el CRM.** Una sincronización copia las negociaciones y los prospectos del
  empleado del webhook o, con el webhook de un administrador, de los compañeros que elijas, con sus clientes, embudos y
  etapas. Los contactos, las empresas y los empleados se leen del portal cada vez.
- **Por MCP, "preguntar" deja pasar el comando.** MCP es la forma en que aplicaciones como Claude Desktop llaman a una
  herramienta, y nadie está ahí para responder una pregunta. Antes de conectarla, marca como "solo lectura" o
  "rechazar" los cambios que un agente no debe hacer.
- **Un cambio de etapa puede poner en marcha los robots del portal**, que pueden escribir a tus clientes. Decide quién
  puede mover una negociación antes de dar el perfil a un agente.

## Cómo se ve

```text
You:    Which of my deals are in Quote sent?
Agent:  (runs b24 work deals list stage:"Quote sent" owner:me)
        · "Kitchen for Example", 15 000 EUR, deal 42
        · "Office for Sample", 8 200 EUR, deal 57
You:    Move Kitchen for Example to Contract signed.
Agent:  (runs b24 work deals move deal:42 "Contract signed")
        Done. "Kitchen for Example" (deal 42) is in Contract signed now.
```

## Por qué b24

- **Una copia de tus negociaciones en tu ordenador.** De las cinco herramientas de la
  [comparativa](https://wirecat.dev/en/docs/b24/compare), entre ellas Vibecode MCP, la del propio Bitrix24, ninguna
  otra documenta la lectura de negociaciones y prospectos sin internet. La siguiente sincronización trae solo los
  cambios.
- **Un permiso en cada acción.** Permitir, preguntar, solo lectura o rechazar, para cada comando y cada método de
  Bitrix24. Los métodos que escriben a clientes o inician procesos de negocio, y pasar una negociación a un compañero,
  se rechazan hasta que los permitas.
- **Cambios que puedes comprobar antes.** `--dry-run` no envía nada y muestra qué permisos necesita el cambio. Un
  cambio que perdió su respuesta nunca se reenvía solo, así que una conexión cortada no crea una segunda negociación.
- **Respetuoso con el portal.** Bitrix24 permite unas 2 peticiones por segundo para todas sus aplicaciones juntas.
  `b24` mantiene ese ritmo, y la mayoría de las respuestas no necesitan ninguna petición.
- **El webhook se queda en el llavero del sistema.** Nunca aparece en la salida, los errores ni los registros.
- **Gratis y de código abierto.** Apache 2.0.

Otra herramienta te conviene más si quieres Bitrix24 en ChatGPT o Claude en el navegador sin nada que ejecutar en tu
ordenador (Zapier MCP), o más de Bitrix24 que los datos de ventas, como tareas y chats (Vibecode MCP).

## Qué puede hacer

- **Negociaciones y prospectos:** listas por etapa, embudo o responsable, ver uno con las etapas por las que pasó,
  crear, mover, cerrar como ganada o perdida, y rellenar los campos propios de tu portal por su etiqueta.
  [Úsalo](./usage.md)
- **El embudo:** cada etapa con su número, su suma y cuántas siguieron adelante, y los últimos 30 días con el tiempo
  hasta el cierre y los motivos de pérdida. [Úsalo](./usage.md)
- **Contactos y empresas:** leerlos, crearlos y actualizarlos, y exportar una lista a un archivo CSV para una hoja de
  cálculo. Los empleados se pueden leer. [Úsalo](./usage.md)
- **Llamadas:** el historial de llamadas del portal, y las grabaciones convertidas en texto en tu ordenador.
  [Llamadas](./calls.md)
- **Qué cambió:** negociaciones creadas, movidas, ganadas y perdidas en el periodo que elijas, y un resumen
  programado. [Úsalo](./usage.md)
- **El trabajo en una negociación:** sus llamadas, correos, reuniones, tareas y comentarios del historial cuando los
  activas, y una tarea en tu ordenador cada vez que una negociación entra en una etapa que nombres. [Úsalo](./usage.md)
- **Cualquier método de Bitrix24** desde una terminal, con las mismas comprobaciones de permisos.
  [Comandos](./commands.md)

## Cómo funciona

- **Una copia en tu ordenador.** `sync` guarda tus negociaciones y prospectos en el almacén local de WireCat, el único
  archivo de tu ordenador que comparten todas las herramientas de WireCat. Las listas, el embudo y la búsqueda lo
  leen, también sin conexión.
- **Inicio de sesión con un webhook o una aplicación local.** Cualquiera de los dos se guarda en el llavero del
  sistema, o en un archivo privado en un ordenador sin llavero.
- **Hecho para scripts y agentes.** `--json` da una respuesta JSON, y un error trae un código con el que decidir el
  siguiente paso. [MCP](./mcp.md)
- **Qué se guarda y qué pasa por la red.** [Seguridad](./security.md)

## Empieza en unos minutos

Pega esto en el chat con tu agente:

```text prompt
Instala b24 con npm install -g @wirecat/bitrix24-cli. Ayúdame a ejecutar b24 work setup para conectar mi portal de Bitrix24, y después sincronizar y mostrar mis negociaciones abiertas.
```

O en una terminal:

```sh
npm install -g @wirecat/bitrix24-cli
b24 skill install          # teaches Claude Code, Codex and Gemini CLI to use b24
b24 work setup             # make an inbound webhook in Bitrix24, tick its permissions, paste its address
b24 work sync              # copy your deals, leads and their clients
b24 work deals list status:open    # your open deals, read from the copy
```

Necesitas Node.js 22.16 o una versión 22.x posterior, o Node.js 24 o posterior. [Instalar](./installation.md)

## Límites

- Probado en Bitrix24 en la nube. Un portal en un servidor propio no está probado.
- La API REST viene con los planes Vibe+ de Bitrix24 y la prueba de 15 días, no con los planes Essentials
  ([página de Bitrix24](https://apidocs.bitrix24.com/first-steps/access-to-rest-api.html)).
- Los contactos, las empresas, los productos y los empleados se leen del portal cada vez, así que necesitan internet.

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar y conectar un portal | [Instalar](./installation.md) |
| Leer y cambiar negociaciones, el resumen, agentes | [Úsalo](./usage.md) |
| Llamadas y su texto | [Llamadas](./calls.md) |
| Conectar una aplicación que usa MCP | [MCP](./mcp.md) |
| Decidir qué puede cambiar un agente | [Permisos](./permissions.md) |
| Un comando o una opción exactos | [Comandos](./commands.md) |
| Algo no funciona | [Cuando algo falla](./troubleshooting.md) |
| En qué se diferencia b24 de otras herramientas de Bitrix24 | [Comparativa](https://wirecat.dev/en/docs/b24/compare) |
