---
title: "MAX: empieza aquí"
description: "Tu agente lee tus chats de MAX, encuentra cualquier mensaje sin conexión y pasa las notas de voz a texto. Los bots usan la Bot API oficial."
---

Te pones al día en MAX en un minuto, sin revisar chat por chat. `max` conecta tu cuenta de MAX, o tu bot, con el agente de
IA que ya usas, como Claude Code, Codex o Cursor. Guarda una copia de tus chats en tu ordenador, así que el agente
busca en todo el historial, incluso sin conexión.

Tu agente te dice quién espera tu respuesta, qué prometiste esta semana y qué dijo Alicia en una nota de voz. Responde
con los mensajes que encontró y prepara una respuesta que envías tú. La configuración lleva unos cinco minutos y un
código QR.

**En esta página:**

1. [Qué obtienes](#qué-obtienes)
2. [Lo que no es obvio al principio](#lo-que-no-es-obvio-al-principio)
3. [Cómo se ve](#cómo-se-ve)
4. [Por qué max](#por-qué-max)
5. [Qué puede hacer](#qué-puede-hacer)
6. [Cómo funciona](#cómo-funciona)
7. [Empieza en cinco minutos](#empieza-en-cinco-minutos)
8. [Límites](#límites)
9. [Encuentra la guía para tu tarea](#encuentra-la-guía-para-tu-tarea)

## Qué obtienes

- **Ninguna respuesta pendiente se te escapa.** Una sola petición muestra quién espera tu respuesta en todos los
  chats. Nada se marca como leído.
- **Cualquier mensaje en segundos.** "¿Cuándo quedamos en vernos con Alicia?" te da la fecha y el mensaje, sin
  internet. También encuentras una conversación por su tema, sin recordar las palabras exactas.
- **Notas de voz en texto.** Las notas de voz se convierten en texto en tu ordenador, y ese texto también se busca.
- **Promesas cumplidas.** "¿Qué prometí esta semana y qué espero de otros?" tiene una sola respuesta para todos los
  chats.
- **Grupos tranquilos.** Una revisión con tus reglas detecta enlaces, invitaciones a otros chats y mensajes en masa.
  Por defecto solo los marca, y borra cuando tú lo permites. Ves quién entró y qué preguntas nadie respondió.
- **Un bot en la misma herramienta.** Conecta un bot con su token y llama a cualquier operación de la Bot API oficial
  de MAX, junto a comandos listos para enviar y moderar.

## Lo que no es obvio al principio

- **Dos formas de conectar.** Tu cuenta personal funciona como un dispositivo más, como web.max.ru. Un bot funciona con
  su token a través de la Bot API oficial. Son perfiles distintos.
- **`personal` es un nombre que eliges tú** para una cuenta, y es la primera palabra de cada comando. Ningún comando
  elige una cuenta por ti.
- **Leer no marca nada como leído**, y nada se envía si un comando no lo pide.
- **La copia se llena mientras lees.** Un chat que no abriste ni descargaste no está en ella, así que una búsqueda sin
  conexión vacía no prueba que el mensaje no exista.

## Cómo se ve

```text
Tú:     ¿Qué le prometí a alguien en los últimos tres días?
Agente: (ejecuta max personal review 'date>3d': 12 chats, 3 notas de voz transcritas)
        Debes
        · Alicia Ejemplo: enviar la factura antes del viernes. Chat privado, 24.09
        Esperas de otros
        · Bruno Muestra: la maqueta para el 25.09. Aún no está en "Diseño"
Tú:     Recuérdale a Bruno lo de la maqueta.
Agente: Borrador: "Hola Bruno, ¿cómo va la maqueta?" ¿Lo envío?
Tú:     Sí.
```

## Por qué max

- **Lo que ninguna otra herramienta de MAX de la [comparativa](./compare.md) documenta.** Los no leídos de todos los
  chats con una petición, las respuestas que debes, la búsqueda por significado y sin conexión, las notas de voz a
  texto en tu ordenador, un resumen matutino programado.
- **Límites que tú pones al agente.** Solo lectura, envíos solo a los chats de tu lista y como mucho 30 envíos por hora
  por defecto. Antes de enviar, `max` puede preguntarte en el terminal. Ninguna otra herramienta de la comparativa documenta estos
  límites.
- **Sin servidor de WireCat.** `max` solo habla con MAX, desde tu ordenador. Tu sesión se guarda en el llavero del
  sistema.
- **Respetuoso con MAX.** Un solo ritmo de peticiones por perfil, compartido por todos los comandos y agentes. Cuando
  MAX dice "demasiadas peticiones", `max` se detiene en lugar de reintentar.
- **Gratis y de código abierto.** Apache 2.0, en macOS, Linux y Windows.

Otra herramienta te conviene más si necesitas llamadas y videomensajes (la aplicación de MAX), o un bot oficial para una
organización sin instalar nada ([mcp-max-messenger](https://github.com/woyaxnini/mcp-max-messenger) con la Bot API).

## Qué puede hacer

- **Ponerte al día:** no leídos de todos los chats, un repaso de lo nuevo, las preguntas sin respuesta.
  [Comandos de uso diario](./usage.md)
- **Encontrar:** por persona, chat, fecha, archivo, enlace y etiqueta, por significado, sin conexión.
  [Búsqueda](./search.md)
- **Responder:** enviar, responder, reenviar, editar, fijar, reaccionar, encuestas, archivos, mensajes programados.
  [Comandos de uso diario](./usage.md)
- **Llevar un grupo:** revisión con tus reglas, quién entró, actividad, resumen de la semana. [Tus grupos](./groups.md)
- **Voz y archivos:** notas de voz a texto, texto de los archivos guardados.
  [Notas de voz](./audio-recognition.md), [Adjuntos](./attachments.md)
- **Bots:** mensajes, botones y cualquier operación de la Bot API. [Bots](./bot.md)
- **Con tus otras fuentes:** une las cuentas de MAX y Telegram de una persona, y busca a la vez en tus mensajes,
  correo y notas de este ordenador. [Personas](./people.md)

## Cómo funciona

- **Una copia en tu ordenador.** Los mensajes que `max` ha visto quedan en un archivo local. La búsqueda, la exportación
  y la lectura sin conexión responden desde ahí. [Archivo de mensajes](./archive.md)
- **Acceso con código QR.** Escaneas un código en la aplicación de MAX y `max` pasa a ser un dispositivo más de tu
  cuenta. Un bot entra con su token.
- **Hecho para scripts y agentes.** Una operación por llamada, una respuesta JSON con `--json`, una skill para agentes
  de terminal y un servidor MCP para aplicaciones como Claude Desktop. [MCP](./mcp.md)
- **Qué se guarda y qué sale por la red.** [Seguridad](./security.md)

## Empieza en cinco minutos

Pega esto en el chat con tu agente:

```text prompt
Usa max CLI. Instálalo con npm install -g @wirecat/max-cli, ayúdame a ejecutar max personal setup y luego muéstrame quién espera mi respuesta.
```

O en una terminal:

```sh
npm install -g @wirecat/max-cli
max personal setup     # acceso con código QR y la skill del agente
max personal inbox     # no leídos de todos los chats, nada se marca como leído
```

Escaneas el código QR en la aplicación de MAX. Necesitas Node.js 22.16 o posterior en 22.x, 24 o posterior, o Bun.
[Instalación](./installation.md)

## Límites

- Para una cuenta personal, `max` usa la API interna de MAX, la misma que la versión web. MAX puede cambiarla sin
  aviso. El acuerdo de usuario de MAX no permite programas automáticos sin el consentimiento de la empresa, y una
  cuenta puede quedar restringida. [Seguridad](./security.md) explica cómo reducir ese riesgo. Los bots usan la Bot API
  oficial y esto no les afecta.
- Las llamadas y los videomensajes siguen en la aplicación de MAX.

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar, entrar, añadir una cuenta | [Instalación](./installation.md), [Acceso y perfiles](./sessions.md) |
| Leer, buscar y enviar | [Comandos de uso diario](./usage.md) |
| Conectar un bot | [Bots](./bot.md) |
| Llevar un grupo | [Tus grupos](./groups.md) |
| Una petición lista para tu agente | [Recetas](./recipes.md) |
| Decidir qué puede hacer un agente | [Permisos](./permissions.md) |
| Conectar una aplicación por MCP | [MCP](./mcp.md) |
| Un comando exacto | [Referencia de comandos](./commands.md) |
| Algo no funciona | [Solución de problemas](./troubleshooting.md) |
| En qué se diferencia max de otras herramientas de MAX | [Comparativa](./compare.md) |
