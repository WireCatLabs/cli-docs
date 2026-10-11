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

- Las acciones propuestas, y los recuerdos y hechos añadidos a través del servidor MCP, esperan tu
  revisión. A través del servidor MCP, un agente no puede confirmar, aceptar, aprobar ni rechazar.
- Un recuerdo o un hecho añadido con el comando `memo` se confirma al momento, lo escriba quien lo
  escriba. Pide a un agente con terminal que primero te muestre lo que quiere añadir.
- Al aprobar una acción, se convierte en una tarea para ti. Memo nunca envía un mensaje ni un correo.
- El registro de agentes guarda el agente, la herramienta, el resultado y la hora, nunca lo que envió
  el agente.
- Dos cuentas se tratan como una sola persona solo después de que las vincules. Que coincida el nombre
  o el dominio del correo nunca es suficiente.

## Qué puede salir de tu ordenador

- `memo ask` da las fuentes a tu propio agente de forma predeterminada. Solo las envía a un proveedor
  de IA con `--model`, y a un proveedor fuera de tu ordenador solo si además usas `--allow-remote`.
  La respuesta del proveedor es texto generado: compruébala con las fuentes.
- Lo que tu agente hace con el texto que lee depende de ese agente y de su proveedor. Memo no puede
  controlarlo. Da acceso a tu agente solo a las fuentes que estés dispuesto a compartir con él.
