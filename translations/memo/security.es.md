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

## Una fuente que añades a mano

[`memo sources add`](./sources.md) guarda el texto que leyó, no el archivo. Solo se hace una copia del archivo con
`--keep-copy`, en la carpeta de datos de Memo, y solo tú puedes leerla. Nada dice que un archivo se guarda si no se
hizo una copia. Leer un archivo o un texto pegado no envía nada a ninguna parte.

Un enlace se lee una vez, desde este ordenador, con una sola petición sencilla:

- Solo `http` y `https`, sin usuario ni contraseña en la dirección. No se envían cookies ni inicio de sesión, así que
  se rechaza una página que necesita que inicies sesión, como un Google Doc privado.
- Cada dirección a la que apunta el nombre debe estar en internet público. Se rechazan `localhost`, las redes de casa
  y de oficina (`10.*`, `192.168.*` y similares), las direcciones de enlace local y las de metadatos de la nube,
  también en cada redirección, y la conexión va a la dirección que se comprobó. Un enlace no puede hacer que Memo lea
  un servicio de tu ordenador o de tu red.
- Como mucho 50 MiB, 30 segundos y 5 redirecciones. Se rechaza una redirección de `https` a `http` sin cifrar.
- El sitio ve tu dirección IP, como la vería en un navegador.
- Memo guarda la dirección que diste, nunca aquella en la que terminó una redirección, que puede llevar un token
  firmado. Un error nombra solo el sitio.
- La dirección es un valor escrito, así que el registro de ejecuciones la guarda salvo que
  [`record_input`](./configuration.md#record-record_input-and-keep_runs_for_days) sea `false`. Añade `--no-record`
  cuando la dirección lleve un token.
- Por MCP un agente solo puede añadir texto. No puede hacer que Memo lea un archivo ni abra una dirección, y solo tú
  quitas una fuente.

## Se respetan los borrados

Cuando borras un archivo de nota, su texto sale del almacén local en la siguiente importación. Cuando borras un correo,
su texto sale del almacén cuando `mail <profile> sync` vuelve a comprobar los borrados del buzón. Si una importación o
una sincronización detecta que falta de golpe una parte inusualmente grande de una carpeta o de un buzón, no borra
nada y te avisa.

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
- Dos cuentas se tratan como una persona cuando tienen la misma dirección de correo, en cualquier cuenta, de trabajo
  o personal, y ninguna tercera persona la tiene y no es una dirección de rol como `info@`. También cuando tienen un
  número de teléfono que nadie más tiene y una de ellas lo tiene en Telegram, MAX o WhatsApp. Y después de que las
  enlaces. Coincidir en nombre, nombre de usuario o dominio de correo nunca basta, y un par que rechazaste nunca se
  une. Las nuevas pruebas sobre él te esperan otra vez. Una dirección de rol solo propone, y una dirección no-reply
  no une ni propone a nadie. Una señal más débil, o la suposición de un agente, te espera en `memo people review`, y
  solo tú deshaces un enlace (`memo people unlink`, `memo people unmerge`).

## Un lector que propone hechos

[`memo sources suggest`](./sources.md#have-a-reader-propose-facts) envía el texto guardado de una fuente al lector
que elegiste, y a nada más. Memo nunca elige uno. Hasta que lo hagas, se niega, y un agente no puede elegir uno ni
nombrar otro.

- `memo sources readers list` dice de cada lector si el texto sale de este ordenador y si el lector podría leer
  archivos aquí. A Ollama solo se llega en `127.0.0.1`. Codex es un agente. Su sandbox es de solo lectura, pero aun
  así podría leer archivos de este ordenador.
- Claude Code se ejecuta con todas sus herramientas, servidores MCP, hooks, comandos de barra y sesiones guardadas
  desactivados, en una carpeta vacía, con el texto por stdin. Codex se ejecuta en su sandbox de solo lectura, en una
  carpeta vacía. Ninguno recibe `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` ni las variables de un agente del entorno de
  Memo.
- Una clave de API vive solo en el llavero del sistema. `memo models keys set` la recibe en una pregunta oculta o por
  stdin, nunca como argumento, y nunca la lee del entorno. Ninguna respuesta, error o registro de ejecución la
  contiene.
- El texto se entrega como datos, con la instrucción de no seguir nunca lo que dice. Un hecho se propone solo con una
  cita que está en el texto, y solo tú confirmas el lote, incluso con `agent_decisions` activado.
- Por MCP no se ofrecen `sources suggest`, `sources readers set` ni `models keys`.

## Qué puede salir de tu ordenador

- Las apps del navegador y teléfono se conectan por tu túnel HTTPS y el acceso compartido por código. Usan los mismos permisos de comandos que los clientes MCP locales. `memo mcp revoke` invalida sus sesiones guardadas, también en un servidor en ejecución; consulta [el acceso remoto](./remote.md).

- `memo sources suggest` envía el texto de una fuente al lector que elegiste. `memo sources readers list` dice si
  sale de este ordenador.
- `memo answers create` prepara fuentes para tu agente. Solo las envía a un proveedor con `--analyze` y, si es externo al equipo, también `--allow-remote`. La respuesta generada debe comprobarse con las fuentes.
- Lo que tu agente haga con el texto depende de él y su proveedor; Memo no puede controlarlo. Dale acceso solo a fuentes que quieras compartir.
- Una vez al día Memo pregunta a npm si hay una versión nueva. Desactívalo con `"update_check": false` en los ajustes o con `MEMO_NO_UPDATE_CHECK=1`. Memo nunca se actualiza solo.
