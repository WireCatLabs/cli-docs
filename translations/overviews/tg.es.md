---
title: "Telegram: empieza aquí"
description: "Tu agente lee tu Telegram, te dice quién espera respuesta y encuentra cualquier mensaje sin conexión. Nada se marca como leído ni se envía sin que lo pidas."
---

Ves quién te espera sin recorrer los chats. `tg` conecta tu propia cuenta de Telegram con el agente de IA que ya
usas, como Claude Code, Codex o Cursor. Guarda una copia de tus chats en tu ordenador, así que tu agente busca en años
de historial, incluso sin conexión.

Tu agente te dice qué chats esperan respuesta, qué prometiste esta semana y dónde te mandó Alicia el PDF del alquiler.
Responde con los mensajes que encontró y prepara un borrador que puedes enviar o cambiar. La configuración lleva unos
cinco minutos.

**En esta página:**

1. [Qué obtienes](#qué-obtienes)
2. [Lo que no es obvio al principio](#lo-que-no-es-obvio-al-principio)
3. [Cómo se ve](#cómo-se-ve)
4. [Por qué tg](#por-qué-tg)
5. [Qué puede hacer](#qué-puede-hacer)
6. [Cómo funciona](#cómo-funciona)
7. [Empieza en cinco minutos](#empieza-en-cinco-minutos)
8. [Límites](#límites)
9. [Encuentra la guía para tu tarea](#encuentra-la-guía-para-tu-tarea)

## Qué obtienes

- **Ninguna respuesta pendiente se te escapa.** Una sola petición muestra quién espera tu respuesta, en todos los
  chats. Nadie ve que miraste.
- **Cualquier mensaje en segundos.** "¿Cuándo quedamos con Alicia en el sitio?" te da la fecha y el mensaje, sin
  internet. La búsqueda encuentra una palabra en sus otras formas, y una conversación entera por su tema.
- **Promesas cumplidas.** "¿Qué prometí esta semana y qué espero de otros?" tiene una sola respuesta para todos tus
  chats.
- **Notas de voz en texto.** Las notas de voz se convierten en texto en tu ordenador, sin Telegram Premium. El texto
  de archivos y documentos escaneados también se busca.
- **Grupos tranquilos.** Tus reglas se ocupan de los enlaces, los mensajes en masa y la gente no deseada. Ves las
  preguntas que nadie respondió, quién entró y quién salió.
- **Respuestas mientras no estás.** Respuestas automáticas con tus propias reglas, y puedes limitarlas a las personas
  que elijas.
- **Un bot en la misma herramienta.** Cualquier bot con la Bot API oficial, sus 185 métodos, junto a comandos listos
  para enviar y responder.

## Lo que no es obvio al principio

- **`personal` es un nombre que eliges tú.** Nombra una cuenta de Telegram y es la primera palabra de cada comando.
  Puedes añadir `work` más tarde para otra cuenta. Ningún comando elige una cuenta por ti.
- **Leer no marca nada como leído.** Solo `tg personal chats mark-read` le dice al otro que lo viste.
- **Nada se envía si un comando no lo pide.** Enviar, editar y borrar son comandos aparte, y puedes dejar un perfil en
  solo lectura.
- **La copia se llena mientras lees.** Un chat que aún no abriste ni descargaste no está en la copia, así que una
  búsqueda sin conexión vacía no prueba que el mensaje no exista. `tg` sabe qué tramos de cada chat tiene completos y
  te lo dice.

## Cómo se ve

```text
Tú:     ¿Qué le prometí a alguien en los últimos tres días?
Agente: (ejecuta tg personal review 'date>3d': 12 chats)
        Debes
        · Alicia Ejemplo: la factura antes del viernes. "Alicia Ejemplo", 24.09
        Esperas de otros
        · Bruno Muestra: la maqueta para el 25.09. Aún no está en "Diseño"
Tú:     Recuérdale a Bruno lo de la maqueta.
Agente: Borrador: "Hola Bruno, ¿cómo va la maqueta?" ¿Lo envío?
Tú:     Sí.
```

## Por qué tg

- **Sin servidor de WireCat.** `tg` solo habla con Telegram, desde tu ordenador. No necesitas una cuenta con nosotros.
- **Entra como la aplicación de escritorio de Telegram.** Usa la API oficial de Telegram con tu propio registro de
  aplicación y pasa a ser un dispositivo más de tu cuenta.
- **Búsquedas que las demás no documentan.** De las cinco herramientas abiertas para Telegram de la
  [comparativa](./compare.md), ninguna documenta buscar un mensaje por su significado, buscar dentro de los archivos
  recibidos o mostrar lo que debes a la gente y lo que te deben. `tg` lo hace todo.
- **Límites que tú pones al agente.** Solo lectura, escritura solo en los chats de tu lista y como mucho 30 envíos por
  hora por defecto. Antes de enviar puede preguntarte en la terminal.
- **Tu sesión queda en el llavero del sistema.** Ninguna otra herramienta de la comparativa la guarda ahí.
- **Gratis y de código abierto.** Apache 2.0, en macOS, Linux y Windows.

Otra herramienta te conviene más si sobre todo mueves archivos en bloque ([tdl](https://github.com/iyear/tdl)), o si
quieres el mayor número de acciones listas en Claude Desktop sin copia local
([telegram-mcp](https://github.com/chigwell/telegram-mcp)).

## Qué puede hacer

- **Ponerte al día:** los no leídos de otras personas en todos los chats, un repaso de lo que cambió desde la última
  vez, las preguntas sin respuesta. [Comandos de uso diario](./usage.md)
- **Encontrar:** por persona, chat, fecha, archivo, enlace y etiqueta, por significado y en el servidor de Telegram a
  la vez. [Búsqueda](./search.md)
- **Responder:** enviar, responder, reenviar, editar, fijar, reaccionar, encuestas, archivos y voz. Programar un
  mensaje para más tarde. [Comandos de uso diario](./usage.md)
- **Llevar un grupo:** miembros, solicitudes de entrada, temas, reglas de moderación, resumen de la semana.
  [Tus grupos](./groups.md)
- **Guardar el historial:** descarga una vez todo el historial de un chat y expórtalo a Markdown o JSONL.
  [Archivo de mensajes](./archive.md)
- **Una persona en varios servicios:** une las cuentas de Telegram y MAX de una persona, y busca a la vez en tus
  mensajes, correo y notas de este ordenador. [Personas](./people.md)
- **Agentes en cualquier sitio:** una skill para agentes de terminal, un servidor MCP con peticiones listas para Claude
  Desktop y Cursor, y un enlace seguro para ChatGPT y Claude en el navegador. [Agentes](/es/docs/agents)

## Cómo funciona

- **Una copia en tu ordenador.** Los mensajes que `tg` leyó o descargó quedan en un archivo local. La búsqueda, la
  exportación y la lectura sin conexión responden desde ahí, y una búsqueda también puede preguntar al servidor de
  Telegram. [Archivo de mensajes](./archive.md)
- **Acceso con código QR.** Registras una aplicación de Telegram una vez y luego escaneas un código en Telegram. `tg`
  pasa a ser un dispositivo más de tu cuenta.
- **Hecho para scripts y agentes.** Una operación por llamada y una respuesta JSON con `--json`. [MCP](./mcp.md)
- **Qué se guarda y qué sale por la red.** [Seguridad](./security.md)

## Empieza en cinco minutos

Pega esto en el chat con tu agente:

```text prompt
Usa tg CLI. Instálalo con npm install -g @wirecat/tg-cli, ayúdame a ejecutar tg personal setup y luego muéstrame quién espera mi respuesta.
```

O en una terminal:

```sh
npm install -g @wirecat/tg-cli
tg personal setup     # registra tu aplicación de Telegram, entra con código QR, instala la skill del agente
tg personal inbox     # los no leídos de otras personas, en todos los chats
```

Necesitas Node.js 22.19 o posterior en 22.x, 24 o posterior, o Bun. `setup` abre
[my.telegram.org](https://my.telegram.org/apps) por ti: Telegram pide que se registre cada programa que se conecta a
una cuenta, y `tg` rellena el formulario. [Instalación](./installation.md)

## Límites

- La búsqueda por significado necesita un modelo que descargas una vez (219 MB, compartido con `max`). La búsqueda por
  palabras funciona sin él.
- El historial de llamadas, los ajustes de privacidad y los stickers aún no están en `tg`. [Hoja de ruta](./roadmap.md)

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar, entrar, añadir otra cuenta | [Instalación](./installation.md), [Acceso y perfiles](./sessions.md) |
| Leer, buscar y enviar mensajes | [Comandos de uso diario](./usage.md) |
| Escribir una búsqueda precisa | [Búsqueda de mensajes](./search.md) |
| Llevar un grupo | [Tus grupos](./groups.md) |
| Una petición lista para tu agente | [Recetas](./recipes.md) |
| Decidir qué puede hacer un agente | [Permisos](./permissions.md) |
| Un bot | [Bots](./bot.md) |
| Un comando u opción exactos | [Referencia de comandos](./commands.md) |
| Algo no funciona | [Solución de problemas](./troubleshooting.md) |
| En qué se diferencia tg de otras herramientas de Telegram | [Comparativa](./compare.md) |
