---
title: "Seguridad"
---

Aquí verás qué lee y escribe Memo y qué puede salir del ordenador, para elegir tus fuentes. La importación las deja intactas; los comandos de limpieza de Gmail pueden mover correo con `--yes`. Memo guarda sus registros en tu ordenador y envía texto a un proveedor de IA solo cuando lo configuras y lo permites.

<a id="your-sources-are-only-read"></a>
<a id="tus-fuentes-solo-se-leen"></a>

## La importación deja intactas tus fuentes

- Las **carpetas de notas** solo se leen. Las carpetas ocultas como `.obsidian` se omiten. Memo solo
  escribe archivos cuando exportas notas, en la carpeta que indiques, y nunca sobrescribe un archivo
  que editaste.
- **La importación de correo** abre el buzón solo para lectura y no marca correo como leído. Memo nunca envía correo.
- **La limpieza de Gmail** es independiente: `memo mail trash` y `memo mail restore` muestran una vista previa sin `--yes`. La limpieza mueve el correo elegido a la Papelera de Gmail; Gmail lo elimina definitivamente a los 30 días. La restauración devuelve el correo de una ejecución registrada mientras siga en la Papelera. La limpieza requiere una copia reciente del almacén y nunca se ejecuta desde el temporizador. Consulta [la limpieza de Gmail](./mail.md#clean-up-gmail).
- Las **etiquetas** dejan tus archivos, las etiquetas de Gmail y los indicadores del buzón tal como
  están.

## Lo que añade Memo se queda en tu ordenador

Tus notas, enlaces, etiquetas, tareas, recordatorios, recuerdos, hechos y acciones propuestas se
guardan en el almacén local, un archivo de tu ordenador que comparte con tg y max. La búsqueda por
significado usa un modelo que se ejecuta en tu ordenador. Los recordatorios van a un programa de tu
ordenador que los pide, nunca a un servicio de mensajería ni a un buzón de correo.

## Se respetan los borrados

Cuando borras un archivo de nota o un correo, su texto sale del almacén local en la siguiente
importación. Si una importación detecta que falta de golpe una parte inusualmente grande de una
carpeta o de un buzón, no borra nada y te avisa.

<a id="agents-suggest-you-decide"></a>
<a id="los-agentes-sugieren-tú-decides"></a>

## Controlar las decisiones del agente

- Los recuerdos del agente, los hechos registrados directamente y las propuestas de acciones en cuentas externas empiezan como propuestos. MCP no confirma recuerdos, no acepta directamente hechos propuestos existentes ni aprueba acciones en cuentas externas.
- Por defecto, un agente puede confirmar o rechazar propuestas de proyecto con un motivo registrado: confirmarlas puede crear hechos aceptados y tareas numeradas o confirmar un documento clave. Configura [`agent_decisions: false`](./configuration.md#agent_decisions) para que solo el propietario decida las propuestas de proyecto. Leer y proponer siguen disponibles. Las conclusiones de reuniones siguen requiriendo al propietario.
- Un hecho, recuerdo o vínculo añadido con `memo` registra al autor. En un terminal de agente (`AI_AGENT` o `CLAUDECODE` definido), el agente es el autor y el hecho registrado directamente, recuerdo o vínculo nuevo espera revisión. Los recuerdos y vínculos del propietario se confirman y los hechos se aceptan al instante; en el terminal de un agente, añade `--as-owner`. Es una etiqueta, no un bloqueo: el agente también puede pasarla, así que indícale que nunca lo haga.
- Aprobar una acción la convierte en una tarea para ti. Memo no envía mensajes ni correos.
- El registro del agente conserva agente, herramienta, resultado y hora, sin el contenido enviado.
- Un agente que solo debe leer se ejecuta con `MEMO_READ_ONLY=1`. Entonces todo comando que cambia algo se detiene con `permission_error` (código de salida 5), y `memo mcp` ofrece solo sus herramientas de lectura. Las lecturas y `memo sync` siguen funcionando, igual que las escrituras de tareas que hace un agente programado con `tasks plan` y `tasks link`, como en tg y max: el vínculo solo se propone y se rechaza vincular dos tareas. `reminders poll` se rechaza.
- Dos cuentas solo representan a una persona después de que las enlaces. Coincidir en nombre o dominio nunca basta.

## Qué puede salir de tu ordenador

- `memo ask` prepara fuentes para tu agente. Solo las envía a un proveedor con `--analyze` y, si es externo al equipo, también `--allow-remote`. La respuesta generada debe comprobarse con las fuentes.
- Lo que tu agente haga con el texto depende de él y su proveedor; Memo no puede controlarlo. Dale acceso solo a fuentes que quieras compartir.
- La sincronización del correo pregunta por sí sola a los registros de dominios cuándo se registró el dominio de un remitente: como mucho una vez al día, para remitentes a los que nunca escribiste y de los que recibiste correo en los últimos dos años. `memo mail inspect --domain-age` pregunta por los grupos que muestra. Cada consulta comunica un nombre de dominio a un registro; se hace una sola vez y la respuesta se guarda en tu ordenador. Nunca se pregunta por grandes proveedores de correo como gmail.com. No hay ajuste para desactivarlo; consulta [cómo se comprueban los dominios de remitentes](./mail.md#choose-what-to-import).
- Una vez al día Memo pregunta a npm si hay una versión nueva. Desactívalo con `"update_check": false` en los ajustes o con `MEMO_NO_UPDATE_CHECK=1`. Memo nunca se actualiza solo.
