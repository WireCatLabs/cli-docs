---
title: "Zoom: empieza aquí"
description: "Sabe lo que acordaste antes de la próxima llamada. Tu agente busca en tus transcripciones de Zoom en tu ordenador y cita el pasaje exacto."
---

Tienes el contexto antes de la llamada y recuerdas los compromisos después. `zm` guarda tus reuniones de Zoom, sus
transcripciones y los resúmenes de IA de Zoom en tu ordenador, y se los da al agente de IA que ya usas, como Claude
Code o Codex.

Antes de una llamada tu agente te dice qué acordaste con Bruno la última vez y qué le debes. Después, encuentra lo que
prometiste. Cada respuesta apunta a las líneas exactas de la transcripción, para que las abras y lo compruebes.

**En esta página:**

1. [Qué obtienes](#qué-obtienes)
2. [Lo que no es obvio al principio](#lo-que-no-es-obvio-al-principio)
3. [Cómo se ve](#cómo-se-ve)
4. [Por qué zm](#por-qué-zm)
5. [Qué puede hacer](#qué-puede-hacer)
6. [Cómo funciona](#cómo-funciona)
7. [Empieza](#empieza)
8. [Límites](#límites)
9. [Encuentra la guía para tu tarea](#encuentra-la-guía-para-tu-tarea)

## Qué obtienes

- **Preparado para cada llamada.** Tu próxima reunión con alguien y lo que hablasteis la última vez, en una sola
  respuesta.
- **Promesas que encuentras.** El agente señala la línea donde prometiste algo y te enseña la tarea de seguimiento que
  haría con ella.
- **Cada respuesta con su fuente.** Una referencia abre el pasaje exacto y sigue funcionando después de corregir la
  transcripción.
- **Busca con tus palabras.** Encuentra una reunión por una palabra en cualquiera de sus formas, en español, inglés o
  ruso, o por su tema.
- **Todo el archivo contigo.** Descarga el vídeo, el audio, las transcripciones y el chat de tus grabaciones en la nube
  a tu disco, con cada archivo comprobado.
- **Reuniones junto a tus chats.** Una sola búsqueda cubre tus reuniones, mensajes, correo y notas de las demás
  herramientas de WireCat.

## Lo que no es obvio al principio

- **Zoom pide primero una aplicación.** Cada usuario de `zm` usa una aplicación del Zoom App Marketplace: una que
  creaste tú o una que tu equipo creó para ti. `zm` necesita su Public Client ID, no un secreto.
  [Tu aplicación de Zoom](./zoom-app.md)
- **Para los archivos no hace falta aplicación.** Las transcripciones descargadas se importan sin aplicación y sin
  iniciar sesión.
- **Zoom da las transcripciones de las reuniones que organizaste.** Si solo asististe, descarga la transcripción en
  Zoom e impórtala.
- **`zm` no hace resúmenes propios.** Lee el resumen de Zoom, y tu agente escribe uno a partir de la transcripción.

## Cómo se ve

```text
Tú:     A las tres tengo llamada con Bruno Muestra. ¿Qué acordamos la última vez y qué le debo?
Agente: (ejecuta zm personal meetings people "Bruno Muestra" y luego zm personal search meetings "presupuesto")
        Hablasteis por última vez el 2 de octubre en "Revisión de precios". Le prometiste a Bruno un presupuesto
        nuevo antes del viernes (meeting:1/42/57/118). Preguntó si el plan anual incluye la puesta en marcha
        (meeting:1/42/57/131).
Tú:     Pasa la llamada de hoy a las cuatro.
Agente: (ejecuta zm personal remote-meetings update 85012345678 --start-time 2026-10-09T16:00:00+02:00 --dry-run)
        "Revisión de precios" pasa de las 15:00 a las 16:00 de hoy. ¿Lo cambio en Zoom?
Tú:     Sí.
```

## Por qué zm

- **Lo que las demás herramientas de Zoom de la [comparativa](./compare.md) no documentan:** formas de las palabras en
  tres idiomas, una referencia a las líneas exactas que sobrevive a una transcripción corregida, búsquedas guardadas,
  las reuniones con una persona por nombre o correo, y una vista previa antes de cambiar una reunión.
- **Tus reuniones se quedan en tu ordenador.** Las transcripciones guardadas se leen y se buscan sin conexión y sin
  iniciar sesión.
- **Tu propia aplicación de Zoom, tus reglas.** Los tokens están en el llavero del sistema. Cada perfil permite o
  prohíbe comandos sueltos, y un cambio en Zoom te pregunta primero en la terminal.
- **Gratis y de código abierto.** Apache 2.0.

Otra herramienta te conviene más si quieres que una aplicación de IA pregunte a Zoom por reuniones, Team Chat y Zoom
Docs sin instalar nada (el servidor MCP del propio Zoom), o si administras usuarios y webinars
([zoom-cli de rvben](https://github.com/rvben/zoom-cli)).

## Qué puede hacer

- **Traer reuniones:** sincroniza las reuniones que organizaste en Zoom o importa transcripciones. [Archivo](./archive.md)
- **Leer y buscar:** transcripciones, resúmenes, pasajes con su contexto, las reuniones con una persona.
  [Búsqueda](./search.md)
- **Dar seguimiento:** cita un pasaje y mira antes la tarea de seguimiento. [Uso](./usage.md)
- **Guardar grabaciones:** descarga, comprueba y reanuda, cada día con un temporizador en Linux. [Archivo](./archive.md)
- **Transcribir una grabación** en tu ordenador con un modelo de voz que descargas. [Uso](./usage.md)
- **Próximas reuniones:** consúltalas y mira un cambio antes de hacerlo. [Próximas reuniones](./remote-meetings.md)

## Cómo funciona

- **Una copia en tu ordenador.** Las reuniones, transcripciones y resúmenes quedan en el almacén local que comparten
  las herramientas de WireCat. La lectura y la búsqueda responden desde ahí. [Archivo](./archive.md)
- **Acceso desde el navegador.** Apruebas tu aplicación de Zoom una vez en el navegador. El token se queda en el
  llavero del sistema.
- **Sincroniza cuando quieras.** `meetings sync` trae las reuniones nuevas, y la siguiente ejecución sigue donde se
  quedó la anterior.
- **Qué se guarda y qué sale por la red.** [Seguridad](./security.md)

## Empieza

Pega esto en el chat con tu agente:

```text prompt
Usa zm CLI. Instálalo con npm install -g @wirecat/zoom-cli, ayúdame a conectar mi aplicación de Zoom, sincroniza mis reuniones de la última semana y dime qué prometí en ellas.
```

O en una terminal, instálalo primero:

```sh
npm install -g @wirecat/zoom-cli
```

Después pon el Public Client ID de tu aplicación e inicia sesión, como explica [Primer uso](./installation.md#first-run).
Luego:

```sh
zm personal meetings sync --lookback-days 7    # las reuniones de la última semana
zm personal meetings list                      # lo que hay guardado ahora
```

Necesitas Node.js 22.16 o posterior en 22.x, o 24 o posterior. [Instalar y conectar](./installation.md)

## Límites

- Por ahora solo Zoom. Las llamadas de Google Meet las guarda la [herramienta de Google Calendar](/es/docs/google-meet).
- Una cuenta de Zoom de empresa puede necesitar que un administrador apruebe tu aplicación.
- La tarea diaria de archivo solo se instala en Linux.

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar y conectar | [Instalar y conectar](./installation.md), [Tu aplicación de Zoom](./zoom-app.md) |
| Buscar y leer reuniones | [Búsqueda](./search.md) |
| Guardar grabaciones y transcripciones | [Archivo](./archive.md) |
| Próximas reuniones | [Próximas reuniones](./remote-meetings.md) |
| Conectar un agente por MCP | [MCP](./mcp.md) |
| Reuniones con proyectos y personas | [Reuniones](./meetings.md) |
| Un comando exacto | [Comandos](./commands.md) |
| Algo no funciona | [Solución de problemas](./troubleshooting.md) |
| En qué se diferencia zm de otras herramientas de Zoom | [Comparativa](./compare.md) |
