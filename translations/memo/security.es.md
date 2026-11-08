---
title: "Seguridad"
---

Aquí verás qué lee y escribe Memo y qué puede salir del ordenador, para elegir tus fuentes. La importación las deja intactas y Memo nunca cambia un buzón: la limpieza de Gmail es un comando del programa independiente `mail`. Memo guarda sus registros en tu ordenador y envía texto a un proveedor de IA solo cuando lo configuras y lo permites.

<a id="your-sources-are-only-read"></a>
<a id="tus-fuentes-solo-se-leen"></a>

## La importación deja intactas tus fuentes

- Las **carpetas de notas** solo se leen. Las carpetas ocultas como `.obsidian` se omiten. La exportación
  de notas escribe en la carpeta elegida y nunca sobrescribe un archivo que editaste. La exportación
  de anotaciones seleccionadas crea un archivo privado nuevo en la ruta elegida, como se explica abajo.
- **Correo**: Memo nunca abre un buzón, ni envía correo, ni cambia un buzón. La sincronización y la
  [limpieza de Gmail](./mail.md#commands-that-moved-to-mail) son comandos del programa independiente `mail`.
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

- Los recuerdos del agente, los hechos registrados directamente y las propuestas de acciones en cuentas externas empiezan como propuestos. MCP también ofrece comandos para decidir, limitados por los [permisos](./configuration.md#permissions) guardados.
- Las propuestas de proyecto tienen un flujo de revisión aparte. Por defecto solo tú las confirmas o rechazas. Leer y
  proponer siguen disponibles. Configura [`agent_decisions: true`](./configuration.md#agent_decisions) para que un agente
  las decida con un motivo registrado. Confirmarlas puede crear hechos aceptados y tareas numeradas o confirmar un
  documento clave. Las decisiones sobre reuniones requieren permisos explícitos.
- Un hecho, recuerdo o vínculo añadido con `memo` registra al autor.
  Cuando lo ejecuta un terminal de agente (`AI_AGENT` o `CLAUDECODE` definido), o nada indica que haya una persona en un
  terminal, el agente es el autor y el registro espera revisión. Lo tuyo se confirma o se acepta al instante.
- Cada decisión indica quién decide. Un agente nunca decide la propuesta de su propio bot, necesita `--reason` y se
  le rechaza toda decisión salvo que `agent_decisions` sea `true`. En un terminal de agente, `--as-owner` pregunta y/N en
  el terminal antes de actuar como tú. Sin terminal o con `--json`, rechaza el comando con el código de salida 7.
- WireCat Desktop ejecuta memo sin terminal, así que pasa `--from-app` en cada decisión que tomas en la aplicación,
  y memo registra la decisión como tuya. La opción dice que actuaste en la aplicación. No es una comprobación de seguridad. Memo
  le cree siempre, incluso con `AI_AGENT` o `CLAUDECODE` definido, así que cualquier cosa que pueda ejecutar memo como tú puede pasarla.
  Desktop quita las variables de agente de sus ejecuciones. Por MCP la opción no se ofrece.
- Aprobar una acción la convierte en una tarea para ti. Memo no envía mensajes ni correos.
- La [exportación y comprobación de anotaciones seleccionadas](./recipes.md#keep-selected-project-annotations)
  leen las fuentes y el destino sin restaurarlos. La exportación crea un archivo privado nuevo y
  rechaza rutas existentes. La restauración requiere la huella de una
  comprobación correcta; un agente MCP necesita además el permiso explícito `projects.annotations.restore`. Conserva el estado histórico aceptado o propuesto;
  no confirma una propuesta de nuevo. Las lecturas MCP siguen creando su entrada normal de auditoría.
  El formato omite varios aspectos del proyecto y no sustituye una copia completa del archivo.
- El registro del agente conserva agente, herramienta, resultado y hora, sin el contenido enviado.
- Un agente que solo debe leer se ejecuta con `MEMO_READ_ONLY=1`. Entonces todo comando que cambia algo se detiene con `permission_error` (código de salida 5), y `memo mcp serve` mantiene visibles los comandos de escritura, pero rechaza ejecutarlos. Las lecturas y `memo sync` siguen funcionando, igual que las escrituras de tareas que hace un agente programado con `tasks link`, como en tg y max: el vínculo solo se propone y se rechaza vincular dos tareas. `reminders claim` se rechaza.
- Dos cuentas solo representan a una persona después de que las enlaces. Coincidir en nombre o dominio nunca basta.

## Qué puede salir de tu ordenador

- Las apps del navegador y teléfono se conectan por tu túnel HTTPS y el acceso compartido por código. Usan los mismos permisos de comandos que los clientes MCP locales. `memo mcp revoke` invalida sus sesiones guardadas, también en un servidor en ejecución; consulta [el acceso remoto](./remote.md).

- `memo answers create` prepara fuentes para tu agente. Solo las envía a un proveedor con `--analyze` y, si es externo al equipo, también `--allow-remote`. La respuesta generada debe comprobarse con las fuentes.
- Lo que tu agente haga con el texto depende de él y su proveedor; Memo no puede controlarlo. Dale acceso solo a fuentes que quieras compartir.
- Una vez al día Memo pregunta a npm si hay una versión nueva. Desactívalo con `"update_check": false` en los ajustes o con `MEMO_NO_UPDATE_CHECK=1`. Memo nunca se actualiza solo.
