---
title: "WireCat Desktop 0.2: mira lo que recuerda tu agente"
description: La app de escritorio ya tiene Búsqueda, Memoria, Tareas y Guías, así que puedes ver lo que guardaron tus herramientas y tus agentes sin abrir una terminal.
date: 2026-11-01
tags: [ai-agents, release-notes]
author: viacheslav-ptsarev
draft: false
---

WireCat empezó siendo solo herramientas de línea de comandos. Eso funciona bien si vives en la terminal, y funciona
bien para los agentes. Pero mucha gente a la que se lo enseñé se quedaba atascada en `npm install -g` y nunca llegaba
a la parte buena.

Así que hace unos días saqué una pequeña app de escritorio. Instala las herramientas de WireCat, te ayuda a iniciar
sesión y las conecta con el agente que ya usas: Claude Code, Codex, Cursor, Gemini CLI, OpenCode, Hermes u OpenClaw.
No necesitas Node.js para abrirla. Si las herramientas lo necesitan y no lo tienes, la app instala su propia copia en
tu carpeta de usuario.

La versión 0.1 se quedaba ahí. Lo configurabas todo, veías luces verdes y luego tenías que volver a la terminal o
preguntarle a tu agente para saber qué había dentro. La 0.2.0 de hoy lo arregla.

## Qué hay de nuevo

**Búsqueda.** Eliges una herramienta y una cuenta y buscas en lo que guardó: mensajes, reuniones, notas, documentos,
correo. Usa la búsqueda de la propia herramienta, así que ves los mismos resultados que tu agente.

**Memoria.** Esta es la que más quería. Cuando un agente trabaja con Memo, guarda lo que aprendió sobre ti y sobre la
gente que te rodea, y propone cosas que hacer. Hasta ahora solo podías revisarlo en una terminal. Ahora tiene su
página, agrupada por persona o proyecto. Puedes confirmar lo que es correcto y olvidar lo que no. Cuando confirmas una
acción propuesta, se convierte en una tarea. No se envía nada a ninguna parte.

**Tareas.** Tus proyectos de Memo y sus tareas, en una tabla o en un tablero de cinco columnas. Puedes arrastrar
tareas entre columnas, editarlas ahí mismo y ver quién cambió qué, tú o un agente.

**Guías.** Después de configurar todo, la pregunta obvia es "vale, ¿y ahora qué le pido?". La página de Guías tiene
peticiones listas para pegar en tu agente. Cada una usa varias herramientas a la vez, por ejemplo para planificar tu
día o tu semana con lo que ya hay en tus chats, correo y calendario.

También hay cosas más pequeñas. Una campana muestra novedades de WireCat, sobre todo actualizaciones de seguridad, y
solo mira una vez por hora. Un panel de Privacidad en el menú ? explica claramente qué se queda en tu ordenador y qué
sale de él. Y los botones que todavía no pueden funcionar ahora te dicen qué falta en lugar de no hacer nada.

## Sigue siendo local

La misma regla que las herramientas. Tus datos se quedan en tu ordenador. La app no tiene cuenta ni servidor propio
para tus datos, y nunca pide permisos de administrador. Las actualizaciones van firmadas y la app comprueba la firma
antes de instalar una.

## Descarga

Desde [wirecat.dev/es/download](/es/download), para macOS, Windows o Linux. Si ya tienes la 0.1, la propia app te
ofrecerá la actualización.

Es una versión temprana y algunas páginas todavía tienen asperezas. Lo siguiente en lo que trabajo es añadir cosas a
la memoria a mano. Si algo falla o te parece raro, cuéntamelo en [Discord](https://discord.gg/DebENqbRrJ) o abre un
issue en [GitHub](https://github.com/WireCatLabs/wirecat-desktop/issues). Lo leo todo.
