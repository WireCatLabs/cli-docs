---
title: "HubSpot"
---

Sabe en qué punto está cada negociación y qué cambió en tu CRM durante la noche, sin abrir HubSpot. `hubspot` da al
agente de IA que ya usas, como Claude Code o Codex, una copia de tus negociaciones, contactos y empresas de HubSpot en
tu ordenador, así que responde desde esa copia, también sin conexión. También crea, mueve y cierra negociaciones por
ti, hasta donde lo permitas.

Pregunta qué negociaciones esperan en "Contract sent" y por cuánto, qué se movió desde ayer o cuántas negociaciones del
embudo Sales pasaron a la etapa siguiente este mes. El agente responde con la negociación, su importe y su
responsable. Necesitas una clave para la cuenta, que un superadministrador crea una vez en los ajustes de HubSpot.

**En esta página:**

1. [Lo que obtienes](#what-you-get)
2. [Lo que un recién llegado no adivinaría](#things-a-newcomer-would-not-guess)
3. [Cómo se ve](#how-it-looks)
4. [Por qué hubspot](#why-hubspot)
5. [Qué puede hacer](#what-it-can-do)
6. [Cómo funciona](#how-it-works)
7. [Empieza en unos minutos](#start-in-a-few-minutes)
8. [Límites](#limits)
9. [Encuentra una guía para tu tarea](#find-a-guide-for-your-task)

## Lo que obtienes

- **La respuesta, no la búsqueda.** Pregunta por una negociación o un cliente con tus propias palabras. El agente
  encuentra la negociación con su etapa, su importe y las personas que participan, leída de tu ordenador, sin ir
  haciendo clic por HubSpot.
- **El embudo de un vistazo.** Cuántas negociaciones hay en cada etapa y por cuánto, cuántas pasaron a la siguiente y
  la proporción de ganadas.
- **Mañanas que empiezan con lo que cambió.** Las negociaciones nuevas, los cambios de etapa, las ganadas y las
  perdidas de ayer llegan como un resumen corto a la hora que elijas, como un aviso en tu escritorio, o en tu Telegram o
  tu correo a través de `tg` o `mail` de WireCat.
- **El trabajo de una negociación en un solo sitio.** Sus notas, llamadas, correos, reuniones y tareas, y las tareas
  vencidas.
- **Cambios con solo pedirlos.** Basta con "Mueve Example kitchen a Contract sent". El agente encuentra la etapa por su
  nombre, y puedes comprobar qué permisos necesita un cambio antes de hacerlo.
- **Tu CRM junto a tus chats.** Una sola búsqueda encuentra una negociación junto a los mensajes, el correo y las
  reuniones sobre ella que las otras herramientas de WireCat guardan en tu ordenador.

## Lo que un recién llegado no adivinaría

- **La clave pertenece a la cuenta, no a ti.** La clave de servicio de HubSpot, con la que `hubspot` inicia sesión, no
  nombra a ningún usuario. Por eso `hubspot` copia las negociaciones de toda la cuenta, y `owner:me` no encuentra a
  nadie: el agente filtra por el id del propietario que da `hubspot work users list`.
- **Crea una clave de servicio, no una app privada.** HubSpot dejó de permitir apps privadas nuevas el 26 de octubre
  de 2026. El token de una app privada que ya tengas sigue funcionando. La [instalación](./installation.md#make-a-key)
  muestra dónde hacer clic.
- **Los scopes de la clave deciden qué se puede cambiar.** Sin los scopes de escritura la clave solo lee, digan lo que
  digan los ajustes de `hubspot`. Un scope que no marcaste solo hace fallar los comandos que lo necesitan, y el error
  lo nombra.
- **`work` es un nombre que eliges tú.** Nombra una cuenta de HubSpot y es la primera palabra de cada comando. Ningún
  comando elige una cuenta por ti.
- **Por MCP, "ask" sigue adelante.** MCP es la forma en que apps como Claude Desktop llaman a una herramienta, y allí
  no hay nadie en una terminal para responder una pregunta. Pon en solo lectura o en rechazo las escrituras que un
  agente no debe hacer antes de conectarlo.
- **Todas las apps de la cuenta comparten un límite diario de llamadas a la API.** `hubspot` responde la mayoría de las
  preguntas desde su copia y va a un ritmo lento, así que gasta poco. Cuando el límite se agota, el error dice cuándo
  vuelve.

## Cómo se ve

```text
You:    What changed in the CRM since yesterday?
Agent:  (runs hubspot work changes list "at>=1d")
        · New deal "Example kitchen", 15 000 EUR, in Appointment scheduled
        · "Example office" moved to Closed won, 8 200 EUR
You:    Move Example kitchen to Contract sent.
Agent:  (runs hubspot work deals move deal:12 "Contract sent")
        Done. "Example kitchen" (deal 12) is in Contract sent now.
```

## Por qué hubspot

- **Una copia de tus negociaciones en tu ordenador.** De las cinco herramientas de la [comparativa](./compare.md),
  incluido el propio servidor MCP de HubSpot, ninguna otra documenta leer negociaciones sin internet. La siguiente
  sincronización solo trae los cambios.
- **Un permiso para cada acción.** Permitir, preguntar, solo lectura o rechazar, para cada comando y para cada
  operación de la API de HubSpot. Dar un registro a otro propietario se rechaza hasta que lo permitas.
- **Escrituras que puedes comprobar antes.** `--dry-run` no envía nada y muestra qué permisos necesita la escritura.
  Una escritura que perdió su respuesta nunca se reenvía sola, así que una conexión cortada no crea una segunda
  negociación.
- **Respetuoso con HubSpot.** Como mucho 4 peticiones por segundo para cada cuenta, y la mayoría de las respuestas no
  necesitan ninguna petición.
- **La clave se queda en el llavero del sistema.** Nunca aparece en la salida, los errores ni los registros.
- **Libre y de código abierto.** Apache 2.0.

Otra herramienta encaja mejor si quieres HubSpot en ChatGPT o Claude en el navegador sin ejecutar nada en tu
ordenador, con tu propio inicio de sesión y tus propios permisos de HubSpot (el propio servidor MCP de HubSpot).

## Qué puede hacer

- **Negociaciones y leads:** listarlos por etapa, embudo, propietario o fecha, mostrar uno con sus personas, crear,
  actualizar, mover, cerrar como ganada o perdida y exportar una lista a un archivo CSV para una hoja de cálculo. Los
  leads necesitan Sales Hub Professional o Enterprise. [Úsalo](./usage.md)
- **El embudo:** cada etapa con su número y su suma, cuántas llegaron a ella y siguieron, y la tasa de éxito en el
  periodo que elijas. [Úsalo](./usage.md#read-your-deals)
- **Contactos, empresas y propietarios:** encontrar cualquiera en la cuenta, crear y actualizar contactos y empresas.
  [Úsalo](./usage.md#read-your-deals)
- **Qué cambió:** negociaciones creadas, movidas, ganadas y perdidas, pasadas a otro propietario, y actividades
  añadidas y hechas, en la ventana que elijas, y un resumen programado. [Úsalo](./usage.md#activities-and-what-changed)
- **Actividades:** notas, llamadas, correos, reuniones y tareas de tus negociaciones, cuando las activas.
  [Úsalo](./usage.md#activities-and-what-changed)
- **Cualquier operación de la API del CRM de HubSpot:** notas, tareas, tickets, asociaciones y fusiones, cada una con
  su propio permiso. [Úsalo](./usage.md#call-the-api)

## Cómo funciona

- **Una copia en tu ordenador.** `sync` pone los embudos, las negociaciones y los leads, con sus contactos y empresas,
  en el almacén local de WireCat, el único archivo de tu ordenador que comparten todas las herramientas de WireCat. Las
  listas, el embudo y la búsqueda lo leen, también sin conexión.
- **Inicio de sesión con una clave.** Una clave de servicio o el token de una app privada. Se guarda en el llavero del
  sistema, o en un archivo privado en un ordenador sin llavero. [Instalación](./installation.md)
- **Hecho para agentes y scripts.** La skill del agente enseña los comandos a Claude Code, Codex y Gemini CLI, y MCP
  los sirve a apps como Claude Desktop. `--json` da una respuesta JSON, y un error llega con un código para decidir qué
  hacer. [MCP](./mcp.md)
- **Qué se guarda y qué pasa por la red.** [Seguridad](./security.md)

## Empieza en unos minutos

Pega esto en tu agente:

```text prompt
Instala hubspot con npm install -g @wirecat/hubspot-cli. Ayúdame a crear una clave de servicio de HubSpot y a ejecutar hubspot work session start, luego sincroniza y muéstrame mis negociaciones abiertas.
```

O en una terminal:

```sh
npm install -g @wirecat/hubspot-cli
hubspot skill install                 # teaches Claude Code, Codex and Gemini CLI to use hubspot
hubspot work session start            # paste the service key when asked
hubspot work sync                     # copy your deals with their contacts and companies
hubspot work deals list status:open   # your open deals, read from the copy
```

Necesitas Node.js 22.16 o una versión 22.x posterior, o Node.js 24 o posterior. [Instalación](./installation.md)

## Límites

- Los contactos, las empresas y los propietarios se leen de HubSpot cada vez, así que necesitan internet. La copia
  guarda los contactos y las empresas de tus negociaciones.
- Los leads necesitan Sales Hub Professional o Enterprise.
- Los tickets, las notas y las tareas se escriben con `api`, y los tickets no se copian.
- HubSpot no marca una escritura repetida como repetición. Una escritura que perdió su respuesta puede haberse hecho,
  así que revisa el registro antes de enviarla otra vez.

## Encuentra una guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar y conectar una cuenta | [Instalación](./installation.md) |
| Leer y cambiar negociaciones, el resumen, la API | [Uso](./usage.md) |
| Conectar una app que usa MCP | [MCP](./mcp.md) |
| Decidir qué puede cambiar un agente | [Permisos](./permissions.md) |
| Un comando u opción exactos | [Comandos](./commands.md) |
| Algo no funciona | [Cuando algo falla](./troubleshooting.md) |
| En qué se diferencia hubspot de otras herramientas para HubSpot | [Comparativa](./compare.md) |
