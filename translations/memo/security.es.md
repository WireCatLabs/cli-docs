---
title: "Seguridad"
---

Esta página explica qué lee Memo, qué escribe y qué puede salir de tu ordenador, para que decidas a
qué le das acceso. En resumen: Memo lee tus fuentes y nunca las cambia, todo lo que añade se queda en
un archivo de tu ordenador, y tu texto solo va a un proveedor de IA cuando configuras uno y lo
permites.

## Tus fuentes solo se leen

- Las **carpetas de notas** solo se leen. Las carpetas ocultas como `.obsidian` se omiten. Memo solo
  escribe archivos cuando exportas notas, en la carpeta que indiques, y nunca sobrescribe un archivo
  que editaste.
- **Tu buzón** se abre solo para lectura. Memo nunca envía, mueve, borra ni marca con indicadores el
  correo, y no lo marca como leído.
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

## Los agentes sugieren, tú decides

- Las acciones propuestas y los recuerdos y hechos añadidos por MCP esperan tu revisión. Por MCP un agente no puede confirmar, aceptar, aprobar ni rechazar.
- Un hecho, recuerdo, vínculo o acción propuesta añadido con `memo` registra al autor. En un terminal de agente (`AI_AGENT` o `CLAUDECODE` definido), el agente es el autor y el hecho, recuerdo o vínculo espera tu revisión, como mediante MCP. Lo tuyo se confirma al instante; en el terminal de un agente se indica con `--as-owner`. Es una etiqueta, no un bloqueo: el agente también puede pasarla, así que indícale que nunca lo haga.
- Aprobar una acción la convierte en una tarea para ti. Memo no envía mensajes ni correos.
- El registro del agente conserva agente, herramienta, resultado y hora, sin el contenido enviado.
- Dos cuentas solo representan a una persona después de que las enlaces. Coincidir en nombre o dominio nunca basta.

## Qué puede salir de tu ordenador

- `memo ask` prepara fuentes para tu agente. Solo las envía a un proveedor con `--analyze` y, si es externo al equipo, también `--allow-remote`. La respuesta generada debe comprobarse con las fuentes.
- Lo que tu agente haga con el texto depende de él y su proveedor; Memo no puede controlarlo. Dale acceso solo a fuentes que quieras compartir.
- `memo mail probe --domain-age` consulta a los registros cuándo se registró un dominio remitente. Cada consulta comunica un nombre de dominio a un registro; la respuesta se guarda en el equipo. Sin el indicador, probe no consulta a nadie.
