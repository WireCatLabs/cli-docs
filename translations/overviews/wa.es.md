---
title: "WhatsApp: empieza aquí"
description: "Tu agente lee tus chats de WhatsApp, te dice quién espera respuesta y busca en todo desde tu ordenador. Solo envía cuando tú lo pides."
---

Sabes quién te espera en WhatsApp sin abrir cada chat. `wa` vincula tu propia cuenta de WhatsApp con el agente de IA que
ya usas, como Claude Code, Codex o Cursor, igual que WhatsApp Web vincula un ordenador. Todo lo que recibe se guarda en
tu ordenador, y tu agente busca ahí.

Tu agente te dice qué llegó desde esta mañana, qué preguntas de un grupo nadie respondió y cuándo quedaste con Alicia en
el sitio. Responde con los mensajes que encontró y solo envía una respuesta cuando dices que sí. La configuración lleva
unos cinco minutos y un código QR.

**En esta página:**

1. [Qué obtienes](#qué-obtienes)
2. [Lo que no es obvio al principio](#lo-que-no-es-obvio-al-principio)
3. [Cómo se ve](#cómo-se-ve)
4. [Por qué wa](#por-qué-wa)
5. [Qué puede hacer](#qué-puede-hacer)
6. [Cómo funciona](#cómo-funciona)
7. [Empieza en cinco minutos](#empieza-en-cinco-minutos)
8. [Límites](#límites)
9. [Encuentra la guía para tu tarea](#encuentra-la-guía-para-tu-tarea)

## Qué obtienes

- **Al día en una respuesta.** Los no leídos de otras personas y los chats donde alguien te espera. Nada se marca como
  leído.
- **Encuentra todo lo que te enviaron.** "¿Cuándo quedamos con Alicia en el sitio?" te da la fecha y el mensaje, desde
  la copia de tu ordenador.
- **Promesas cumplidas.** Un repaso de los chats que cambiaron muestra quién debe qué, con tus propios mensajes
  incluidos.
- **Grupos bajo control.** Quién participa, quién entró y quién salió, y qué preguntas nadie respondió.
- **Notas de voz en texto.** WhatsApp no tiene reconocimiento de voz propio. `wa` usa un modelo en tu ordenador, y la
  grabación no sale de él.
- **También un número de empresa.** Si tienes uno, `wa` también habla por él con la Cloud API oficial de Meta.

## Lo que no es obvio al principio

- **El historial empieza al vincular.** `wa` guarda lo que tu teléfono envía justo después de vincular y todo lo que
  llega después. Los mensajes más antiguos de un chat se le pueden pedir al teléfono, de 50 en 50.
- **`personal` es un nombre que eliges tú** para una cuenta, y es la primera palabra de cada comando. Ningún comando
  elige una cuenta por ti, ni siquiera cuando solo hay una.
- **Déjalo en marcha para seguir recibiendo.** En macOS y Linux, `wa personal server install` y luego
  `wa personal server start` mantienen el vínculo abierto, así los mensajes nuevos llegan a la copia mientras trabajas.
- **Nada se envía si un comando no lo pide**, y puedes dejar un perfil en solo lectura.

## Cómo se ve

```text
Tú:     ¿Quién espera mi respuesta desde ayer?
Agente: (ejecuta wa personal review 'date>1d' --unanswered: 3 chats)
        · Alicia Ejemplo preguntó por la mesa del sábado, ayer a las 18:40
        · "Club de lectura": Bruno Muestra preguntó quién trae el próximo libro
Tú:     Dile a Alicia: sí, a las 8.
Agente: Borrador para Alicia Ejemplo: "Sí, a las 8." ¿Lo envío?
Tú:     Sí.
```

## Por qué wa

- **Tu propia cuenta, no un bot.** `wa` ve tus chats, grupos y contactos y habla por ti.
- **Las búsquedas no salen de tu ordenador.** Cada búsqueda responde desde la copia local y nunca se conecta a
  WhatsApp.
- **Envíos más seguros.** Como mucho 30 mensajes por hora por defecto, envíos solo a los chats que permites, y cada
  envío se retiene cuando WhatsApp pide a la cuenta que vaya más despacio. Ninguna otra herramienta de la
  [comparativa](./compare.md) documenta esa retención.
- **Hecho para agentes.** Una operación por llamada, el mismo JSON cada vez, una skill para agentes de terminal y un
  servidor MCP con seis peticiones listas para aplicaciones como Claude Desktop y Cursor.
- **Gratis y de código abierto.** Apache 2.0, en macOS, Linux y Windows.

Otra herramienta te conviene más si eres una empresa que atiende a clientes (solo la Cloud API oficial), o si tu script
solo envía ([mudslide](https://github.com/robvanderleek/mudslide)).

## Qué puede hacer

- **Leer:** chats, un mensaje con los de alrededor, no leídos, todo desde el último repaso, mensajes nuevos según
  llegan. [Usar wa](./usage.md)
- **Encontrar:** busca mensajes en tu ordenador y exporta un chat a Markdown. [Búsqueda](./search.md),
  [El almacén local](./archive.md)
- **Escribir:** respuestas, archivos, fotos, notas de voz, encuestas, reacciones, ediciones en los primeros 15 minutos,
  y borrar para todos tú mismo. [Usar wa](./usage.md)
- **Archivos:** guarda lo que te enviaron y lee el texto que contiene. [Adjuntos](./attachments.md)
- **Grupos:** miembros, eventos, actividad, preguntas sin respuesta. [Grupos](./groups.md)
- **Privacidad:** quién ve tu última conexión, tu foto y tu info, las confirmaciones de lectura.
  [Privacidad](./usage.md#privacy)
- **Un número de empresa:** mensajes y eventos entrantes con la Cloud API. [Bot](./bot.md)

## Cómo funciona

- **Un dispositivo vinculado.** Escaneas un código QR en WhatsApp y `wa` pasa a ser uno de tus dispositivos
  vinculados, como WhatsApp Web.
- **Una copia en tu ordenador.** Cada mensaje que tu teléfono envió y `wa` recibió queda en un almacén local. La
  búsqueda y la exportación leen solo de ahí. [El almacén local](./archive.md)
- **Tus límites en un solo sitio.** La línea de comandos y el servidor MCP comparten los permisos de cada perfil.
  [Permisos](./permissions.md)
- **Qué se guarda y qué sale por la red.** [Seguridad](./security.md)

## Empieza en cinco minutos

Pega esto en el chat con tu agente:

```text prompt
Usa wa CLI. Instálalo con npm install -g @wirecat/whatsapp-cli, ayúdame a ejecutar wa personal setup y vincular mi teléfono, y luego muéstrame quién espera mi respuesta.
```

O en una terminal:

```sh
npm install -g @wirecat/whatsapp-cli
wa personal setup     # vincula con código QR, revisa cinco chats, instala la skill del agente
wa personal inbox     # los no leídos de otras personas, nada se marca como leído
```

Escaneas el código en WhatsApp, en Dispositivos vinculados. Necesitas Node.js 22.16 o posterior.
[Instalación](./installation.md)

## Límites

- `wa` es un cliente no oficial, y WhatsApp puede bloquear una cuenta que envía en masa o escribe a desconocidos. Los
  límites por defecto están para evitarlo. [Límites](./limits.md)
- Lo que está previsto está en la [hoja de ruta](./roadmap.md).
- Un mensaje lleva como mucho una foto y un vídeo, como álbum.

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar y vincular tu teléfono | [Instalación](./installation.md) |
| Leer, buscar y enviar | [Usar wa](./usage.md) |
| Archivos y notas de voz | [Adjuntos](./attachments.md) |
| Grupos | [Grupos](./groups.md) |
| Decidir qué puede hacer un agente | [Permisos](./permissions.md) |
| Conectar una aplicación con MCP | [El servidor MCP](./mcp.md) |
| Un número de empresa | [Bot](./bot.md) |
| Un comando exacto | [Referencia de comandos](./commands.md) |
| Algo no funciona | [Solución de problemas](./troubleshooting.md) |
| En qué se diferencia wa de otras herramientas de WhatsApp | [Comparativa](./compare.md) |
