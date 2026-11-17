---
title: "Asterisk"
---

Sabes qué pidió cada cliente por teléfono y qué llamadas nadie devolvió, sin escuchar ni una grabación. `pbx` da al
agente de IA que ya usas, como Claude Code o Codex, las llamadas de tu centralita Asterisk: cada llamada en tu
ordenador, con cómo terminó y lo que se dijo, pasado a texto ahí mismo.

Tu agente puede prepararte para devolver una llamada, listar las llamadas perdidas, hacer un informe de la semana por
empleado y encontrar las llamadas en las que un cliente estaba descontento, citando la llamada detrás de cada
respuesta. Funciona con Asterisk estándar, FreePBX, Issabel y VitalPBX, y no instala nada en la centralita.

**En esta página:**

1. [Qué obtienes](#what-you-get)
2. [Lo que no es obvio al principio](#things-a-newcomer-would-not-guess)
3. [Cómo se ve](#how-it-looks)
4. [Por qué pbx](#why-pbx)
5. [Qué puede hacer](#what-it-can-do)
6. [Con tus otras herramientas de WireCat](#with-your-other-wirecat-tools)
7. [Cómo funciona](#how-it-works)
8. [Empieza](#start)
9. [Límites](#limits)
10. [Encuentra la guía para tu tarea](#find-a-guide-for-your-task)

## Qué obtienes

- **Cada llamada como una sola llamada.** Un grupo de timbrado, una cola o una transferencia escriben varios
  registros. Tú ves una llamada con su resultado, quién contestó y cuánto esperó y habló quien llamaba.
- **Llamadas que puedes leer.** Las grabaciones se convierten en texto en tu ordenador. Ninguna grabación ni
  transcripción va a un servicio de voz, salvo que actives la transcripción en la nube para un perfil.
- **Ninguna llamada perdida olvidada.** Cada llamada perdida indica si alguien la devolvió, junto a las llamadas por
  empleado, por hora y por día.
- **Una llamada encontrada por lo que se dijo.** "Un cliente descontento con la entrega" encuentra una llamada en la
  que nadie dijo esas palabras.
- **Llamadas marcadas por ti.** Marca una vez todas las llamadas sobre devoluciones, y la siguiente ejecución marca
  solo las nuevas.
- **Quien llama, reconocido.** Si el móvil de quien llama está en tu CRM o en tus chats, se reconoce como la misma persona.
- **La centralita, intacta.** `pbx` solo lee: un usuario de base de datos que solo puede leer, un archivo o una
  carpeta por SFTP.

## Lo que no es obvio al principio

- **`office` es un nombre que eliges tú.** Identifica una centralita, y es la primera palabra de cada comando. Ningún
  comando elige una centralita por ti.
- **Lee el registro de llamadas, no las llamadas en curso.** Asterisk escribe un registro de cada llamada terminada,
  el registro detallado de llamada o CDR. `pbx` lee esos registros y las grabaciones.
- **La primera sincronización lee los últimos 30 días.** Cada sincronización posterior lee solo lo nuevo, y una llamada
  nunca se guarda dos veces. Pide una fecha anterior si quieres más.
- **Las grabaciones se convierten en texto en tu ordenador** con un modelo de voz que descargas una vez. La
  transcripción en la nube es una opción que eliges para un perfil.
- **Por MCP, "preguntar" deja pasar el comando.** MCP es la forma en que aplicaciones como Claude Desktop llaman a una
  herramienta, y nadie está ahí para responder una pregunta. Antes de conectarla, marca como "solo lectura" o
  "rechazar" lo que un agente no debe hacer.

## Cómo se ve

```text
You:    Which calls did nobody return on 31 October?
Agent:  (runs pbx office stats calls show --since-time 2026-10-31 --until-time 2026-10-31)
        One: +7 900 000-00-03 at 14:00, call 3. It rang Oleg Operatorov on 101, and nobody called back.
You:    Mark every call about a refund as a complaint.
Agent:  (runs pbx office tags add complaint --matching "refund")
        Done. The next run marks only the new calls.
```

## Por qué pbx

- **Las grabaciones se quedan contigo.** La voz se reconoce en tu ordenador. El módulo Scribe de FreePBX envía las
  grabaciones a Deepgram, un servicio de voz en la nube, como muestra la [comparativa](./compare.md).
- **Sin acceso como root y sin nada instalado en la centralita.** La configuración MCP de Frogman se conecta a la
  centralita por SSH como root. `pbx` funciona en tu ordenador con un usuario que solo puede leer.
- **Una misma persona en llamadas, chats, correo y CRM.** Ninguna otra herramienta de la comparativa lo documenta.
- **Funciona sin FreePBX.** Las herramientas propias de FreePBX y Frogman necesitan FreePBX. `pbx` también lee
  Asterisk estándar.
- **Un permiso en cada comando.** Permitir, preguntar, solo lectura o rechazar, para cada perfil.
- **Gratis y de código abierto.** Apache 2.0.

Otra herramienta te conviene más si quieres resúmenes y análisis de sentimiento dentro del propio portal de FreePBX y no te
importa un servicio en la nube (FreePBX con Scribe), o un agente que cambie la propia centralita, como los grupos de
timbrado y las rutas (Frogman).

## Qué puede hacer

- **Listar y leer llamadas:** por hora, duración o número, una llamada con su grabación y su transcripción, y una
  exportación a Markdown o a subtítulos WebVTT. [Úsalo](./usage.md)
- **Transcribir:** cada llamada grabada nueva, primero las más recientes, con cada línea a nombre de quien llama o del
  empleado cuando la grabación es estéreo. [Instalar y conectar](./installation.md)
- **Contar:** llamadas por dirección y resultado, por empleado, por hora y por día, y las llamadas perdidas con sus
  devoluciones. [Úsalo](./usage.md)
- **Buscar y marcar:** por palabras o por significado, y una etiqueta en cada llamada que encuentra la búsqueda.
  [Úsalo](./usage.md)
- **Agentes:** una skill para agentes con terminal, y un servidor MCP para Claude Desktop, Cursor y otras
  aplicaciones. [Úsalo](./usage.md)

## Con tus otras herramientas de WireCat

- **Memo** responde a preguntas sobre una persona a partir de llamadas, chats, correo y notas.
- **Las herramientas de CRM**, como `b24` de Bitrix24, traen contactos y negociaciones, así que las llamadas de
  un cliente aparecen junto a su negociación.
- **WireCat Desktop** conecta la centralita con un formulario, mantiene la sincronización con un temporizador y
  reproduce la grabación de una llamada cuando la carpeta de grabaciones está en tu ordenador.

## Cómo funciona

- **Una copia en tu ordenador.** `meetings sync` lee los registros de llamadas y enlaza sus grabaciones en el almacén
  local de WireCat que comparten todas las herramientas de WireCat.
- **Tres sitios donde Asterisk guarda las llamadas.** `Master.csv`, MySQL o MariaDB, y PostgreSQL. La contraseña de
  una base de datos se guarda en el llavero del sistema.
- **Hecho para scripts y agentes.** `--json` da una respuesta JSON. Las palabras dichas en una llamada llegan al
  agente como datos, nunca como instrucciones.
- **Qué se guarda, y el consentimiento que puede necesitar una grabación.** [Seguridad](./security.md)

## Empieza

Conéctalo en [WireCat Desktop](https://wirecat.dev/en/docs/desktop) con un formulario, o pega esto en el chat con tu
agente:

```text prompt
Instala pbx con npm install -g @wirecat/asterisk-cli. Ayúdame a conectar nuestro registro de llamadas de Asterisk y las grabaciones como el perfil office, sincronizar los últimos 30 días y transcribir las llamadas nuevas.
```

O en una terminal, en un ordenador que pueda leer el registro de llamadas y las grabaciones:

```sh
npm install -g @wirecat/asterisk-cli
pbx office config set cdr_csv_path /var/log/asterisk/cdr-csv/Master.csv
pbx office config set recordings_path /var/spool/asterisk/monitor
pbx office config set cdr_timezone Europe/Moscow    # the phone system's time zone
pbx office config set phone_region ru               # the country of numbers written without +
pbx office session start          # checks the source
pbx office meetings sync          # the last 30 days of calls
pbx models download gigaam-v3     # the local Russian speech model, once
pbx office meetings transcribe    # up to 20 recorded calls
```

Necesitas Node.js 22.16 o una versión 22.x posterior, o Node.js 24 o posterior, y `ffmpeg`. Una conexión a una base de datos
o por SFTP en lugar de archivos locales: [instalar y conectar](./installation.md).

## Límites

- **Sin resúmenes propios.** Tu agente lee una transcripción y escribe el resumen.
- **Reproducir una grabación.** WireCat Desktop la reproduce cuando la carpeta de grabaciones está en tu ordenador.
  Una grabación leída por SFTP se queda en la centralita, y ningún enlace reproduce una grabación en el navegador.
- **Quién dijo qué en una grabación mono.** Una grabación estéreo pone el nombre de quien llama o del empleado en
  cada línea cuando defines [`recordings_channels`](./installation.md#transcribe). Una grabación mono da el texto sin
  nombres.
- **Grabaciones largas.** Una grabación de más de una hora no se transcribe. La llamada aparece en la lista con el
  motivo, y las demás siguen.
- **La calidad del reconocimiento** depende de la grabación y del modelo. Una línea con ruido o una llamada en dos
  idiomas da un texto menos preciso.

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar y conectar, en WireCat Desktop o en una terminal | [Instalar y conectar](./installation.md) |
| Peticiones para tu agente, y una programación | [Úsalo](./usage.md) |
| Cada comando y opción | [Comandos](./commands.md) |
| Ajustes y permisos | [Ajustes](./configuration.md) |
| Algo no funciona | [Cuando algo falla](./troubleshooting.md) |
| Qué se guarda, y grabaciones y consentimiento | [Seguridad](./security.md) |
| En qué se diferencia pbx de otras herramientas de Asterisk | [Comparativa con otras herramientas](./compare.md) |
| Qué viene después | [Hoja de ruta](./roadmap.md) |
