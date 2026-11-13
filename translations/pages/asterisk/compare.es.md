---
title: "Comparado con otras herramientas"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`asterisk` es una línea de comandos y un servidor MCP que copia las llamadas de una centralita Asterisk a tu ordenador,
convierte allí sus grabaciones en texto y se las da a tu agente de IA para leerlas. Aquí aparece junto a las otras
herramientas que se usan para leer, transcribir y buscar las llamadas de un sistema Asterisk o FreePBX, para que veas
cuál encaja con tu tarea. Las marcas de `asterisk` salen de su código fuente, revisado el 13 de noviembre de 2026.
Las marcas de las demás herramientas salen de sus propios README y su documentación, revisados el 13 de noviembre de
2026. Para esta página no se conectó ninguna herramienta a una centralita real, y una herramienta puede hacer más de lo
que dicen sus páginas.

Las herramientas:

- **asterisk**: esta herramienta. Lee los registros de llamadas y las grabaciones de cualquier centralita Asterisk,
  las transcribe en tu ordenador y da las llamadas a un agente. Solo lee: nunca cambia la centralita.
- **[Las herramientas propias de FreePBX](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe)**: la página CDR Reports del panel de FreePBX, la API GraphQL del CDR
  y Scribe, un módulo de pago de Sangoma para FreePBX que transcribe y resume grabaciones.
- **[Frogman](https://github.com/mwtcmi/frogman)**: un módulo de FreePBX con servidor MCP, API HTTP y línea de comandos,
  257 herramientas que leen y cambian la centralita (34 estrellas, actualizado el 11 de septiembre de 2026).
- **[asterisk-ai-call-notes](https://github.com/taka-1128/asterisk-ai-call-notes)**: un proceso en Python que
  transcribe cada grabación nueva y escribe para ella un resumen breve, un siguiente paso y una etiqueta (actualizado el
  18 de septiembre de 2026).

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación

## Funciones

| Tarea | asterisk | [FreePBX](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | [Frogman](https://github.com/mwtcmi/frogman) | [ai-call-notes](https://github.com/taka-1128/asterisk-ai-call-notes) |
|---|:-:|:-:|:-:|:-:|
| **Encontrar llamadas** | | | | |
| Listar las llamadas de un periodo | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26083384/PBX+GUI+-+CDR+Module+GraphQL+APIs) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L155) | [❌](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L20) |
| Encontrar todas las llamadas de un número | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26542152/PBX+GUI+-+CDR+Reports+Module) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L187) | [❌](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L20) |
| Ver estadísticas de llamadas: extensiones con más llamadas, horas punta, llamadas fallidas | ❌ | ➖ | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L438) | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L103) |
| Ver a la misma persona en llamadas, chats, correo y el CRM | ✅ | ➖ | ➖ | ➖ |
| **Grabaciones y transcripciones** | | | | |
| Encontrar la grabación de una llamada | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26083384/PBX+GUI+-+CDR+Module+GraphQL+APIs) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L187) | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L73) |
| Escuchar una grabación desde un enlace | ❌ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L187) | ➖ |
| Convertir en texto las llamadas grabadas | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [✅](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L6) |
| Las grabaciones no salen de tus ordenadores | ✅ | [❌](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L75) |
| Transcribir de una vez las grabaciones que ya tienes | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L39) |
| Un resumen breve de cada llamada | ❌ | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [✅](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L6) |
| Buscar lo que se dijo | 🟡 | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L10) |
| Marcar las llamadas que mencionan palabras que eliges | ❌ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L8) |
| Guardar una transcripción como archivo | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L20) |
| **Agentes y seguridad** | | | | |
| Una aplicación de IA lee las llamadas por MCP | ✅ | ➖ | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L549) | ➖ |
| Un agente con terminal lo ejecuta, con salida JSON y una skill | ✅ | ➖ | [🟡](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L465) | ➖ |
| El agente lee las llamadas pero nunca cambia la centralita | ✅ | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26050564/PBX+GUI+-+API+Access+Tokens) | [🟡](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L113) | ➖ |
| Permitir o denegar comandos concretos a un agente | ✅ | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26050564/PBX+GUI+-+API+Access+Tokens) | [🟡](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L412) | ➖ |
| El texto de una llamada llega al agente como datos, nunca como instrucciones | ✅ | ➖ | ➖ | ➖ |
| Un registro de lo que ejecutó el agente | 🟡 | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26050564/PBX+GUI+-+API+Access+Tokens) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L114) | ➖ |
| El agente no necesita entrar como root en la centralita | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26050564/PBX+GUI+-+API+Access+Tokens) | [🟡](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L562) | ➖ |
| **Instalación** | | | | |
| Funciona con Asterisk sin FreePBX | ✅ | [❌](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26542152/PBX+GUI+-+CDR+Reports+Module) | [❌](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L13) | [✅](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L3) |
| No hay que instalar nada en la centralita | ✅ | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | [❌](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L22) | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L77) |

| | asterisk | FreePBX | Frogman | ai-call-notes |
|---|---|---|---|---|
| Instalación | npm, Node 22.16 o posterior | incluido en FreePBX, Scribe desde Module Admin | un módulo de FreePBX | clonarlo, luego Python |
| Licencia | Apache-2.0 | Scribe necesita una licencia de pago | AGPL-3.0 | MIT |
| Voz a texto | un modelo en tu ordenador | Deepgram, socio de Sangoma | el de Scribe, solo para el buzón de voz | faster-whisper en tu servidor, u OpenAI |

Notas sobre las marcas:

- **Buscar lo que se dijo.** `asterisk` no tiene un comando de búsqueda propio. Las llamadas están en el almacén de
  WireCat, así que `memo` y la búsqueda de las demás herramientas de WireCat las encuentran junto a tus chats y tu
  correo. FreePBX busca transcripciones por las etiquetas que configures. ai-call-notes escribe el texto en una tabla
  de SQLite y te deja la búsqueda a ti.
- **Resúmenes.** `asterisk` no hace resúmenes propios. Tu agente lee la transcripción y escribe uno. Scribe hace
  resúmenes solo en inglés. ai-call-notes envía el texto de la transcripción a Anthropic u OpenAI para su resumen.
- **Las grabaciones se quedan contigo.** `asterisk` reconoce la voz en tu ordenador. Scribe envía las grabaciones a
  Deepgram. ai-call-notes deja el audio en tu servidor con faster-whisper y envía el texto a un modelo en la nube.
- **Transcribir lo que ya tienes.** Scribe Rewind transcribe las grabaciones pasadas que eliges. ai-call-notes toma un
  archivo cada vez con su opción de archivo, o vigila la carpeta.
- **El agente solo puede leer.** `asterisk` abre la base de datos del CDR en una sesión de solo lectura y los archivos
  solo para lectura, y no tiene ningún comando que escriba en la centralita. Un token de acceso de FreePBX se limita a
  lo que se concede a su aplicación. Frogman da a cada usuario un nivel de permisos y pide una confirmación antes de un
  cambio.
- **Comandos concretos.** `asterisk` fija cada comando en allow, ask, readonly o deny, por perfil. Por MCP no hay nadie
  que responda, así que ask deja que el comando se ejecute. Consulta los [ajustes](./configuration.md#permissions).
- **Un registro de lo que se ejecutó.** `asterisk` guarda las ejecuciones fallidas, y una sincronización o una
  transcripción cuando se lo pides. Frogman guarda un registro de auditoría de cada llamada a una herramienta. FreePBX
  muestra cuándo y desde dónde se usó cada token por última vez.
- **Entrar como root.** La configuración MCP de Frogman se conecta a la centralita por SSH como root. `asterisk`
  funciona en tu ordenador y necesita un usuario de base de datos de solo lectura o una carpeta montada en solo
  lectura.
- **Instalar en la centralita.** `asterisk` no necesita nada en la centralita. CDR Reports viene con FreePBX, y Scribe
  es un módulo que se instala allí. ai-call-notes funciona donde pueda leer la carpeta de grabaciones, a menudo en la
  propia centralita.
- **Estadísticas de llamadas.** ai-call-notes cuenta la tasa de abandono, las causas de colgado por hora y el
  reparto de resultados solo para VICIdial, dentro de su informe de revisión.
- **Grabaciones con un enlace.** `asterisk` enlaza cada llamada con su archivo de grabación por la ruta. No la sirve
  en streaming.

## Cuándo encaja mejor otra herramienta

- **FreePBX con Scribe**: usas FreePBX, quieres resúmenes, sentimiento y etiquetas en el portal de usuario y en la app
  del teléfono, y no te importa enviar las grabaciones a un servicio en la nube.
- **Frogman**: quieres que un agente cambie la centralita (extensiones, grupos de timbrado, rutas o llamadas en curso)
  y no solo lea sus llamadas. Además ya muestra estadísticas de llamadas.
- **asterisk-ai-call-notes**: un centro de llamadas salientes quiere un resumen, un siguiente paso y una hora para
  devolver la llamada junto a cada llamada en cuanto termina.

Si `asterisk` encaja, empieza por la [instalación](./installation.md) y luego [conecta tu Asterisk](./asterisk.md).
