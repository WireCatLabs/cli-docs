---
title: "WireCat Desktop 0.8: herramientas nuevas sin actualizar la app, y Permisos ahora dice qué hace de verdad Preguntar antes"
description: "Las herramientas oficiales nuevas de WireCat aparecen en la app sin actualizarla, y la sección Permisos ahora dice que a un agente conectado por MCP no se le pregunta en Preguntar antes. Además el catálogo tiene 6 herramientas nuevas, entre ellas amoCRM, Yandex Disk y HubSpot, tu modelo de IA ordena tu correo y en Linux las actualizaciones llegan por apt."
date: 2026-11-24
tags: [release-notes, security]
cover: ./cover.es.jpg
coverAlt: "WireCat Desktop 0.8 junto a la página Herramientas en modo oscuro: Telegram y WhatsApp están instalados, y los detalles de WhatsApp están abiertos con la cuenta personal marcada como sesión iniciada, los botones Iniciar sesión aquí y Abrir terminal, y el comando para instalarlo desde un terminal."
author: viacheslav-ptsarev
draft: false
---

WireCat Desktop instala las herramientas de WireCat, inicia sesión por ti y le da a tu agente de IA tus chats, correo, reuniones, documentos y notas. Todo queda en tu ordenador.

Después de la 0.7 saqué 5 versiones pequeñas en una semana, de la 0.7.1 a la 0.7.5, y no escribí una nota para ninguna, así que aquí va todo junto. En esa semana el catálogo ganó 6 herramientas nuevas, tu modelo de IA ahora ordena tu correo y en Linux las actualizaciones llegan por apt.

La propia 0.8 trae dos cosas principales. Las herramientas oficiales nuevas llegan desde wirecat.dev sin actualizar la app. Y la sección Permisos ahora dice tal cual que Preguntar antes no frena a un agente por MCP.

## Herramientas nuevas sin una app nueva

La app ahora descarga una vez al día una lista de herramientas oficiales desde wirecat.dev, y una herramienta nueva aparece en la página Herramientas con su icono y sus textos en tu idioma, si la lista los trae. Antes una herramienta nueva llegaba a la app solo con una versión nueva de Desktop, y sin ella solo podías añadirla como herramienta propia, en inglés y con un icono genérico.

La lista está firmada, y la app solo la guarda si la firma coincide con la clave que lleva dentro. Una lista nueva se aplica desde el siguiente arranque, para que la página no cambie delante de ti. Sin red la app usa la última lista verificada que guardó, aunque sea antigua, y si no hay ninguna, la lista que lleva dentro. En la lista solo entra un paquete `@wirecat` de un repositorio de WireCatLabs, y al instalar la app sigue comprobando en npm que el paquete lo construyó el propio GitHub Actions de la herramienta.

En las herramientas incluidas la lista solo cambia los textos y el icono, y los comandos siguen siendo los probados en el catálogo de la app. Cuando comparé los manifiestos de los 17 CLI incluidos con el catálogo, salieron 60 diferencias. La mayoría son solo otra redacción, pero en Zoom, por ejemplo, el catálogo tiene un comando de sincronización y el manifiesto otro, así que por ahora las herramientas incluidas no toman sus comandos de la lista.

## Preguntar antes no frena a un agente por MCP

En la sección Permisos de cada herramienta, cada grupo de comandos tiene 4 niveles: **Permitir**, **Preguntar antes**, **Solo lectura** y **Bloquear**. Preguntar antes solo funciona en una terminal. Por MCP no hay a quién preguntar, y el cambio del agente simplemente se ejecuta. Es así desde el principio, y la 0.8 no lo cambia.

Solo cambió el texto - antes decía que por MCP decide la app del agente, y se leía como si alguien te fuera a preguntar igualmente. Ahora debajo de cada grupo y comando en Preguntar antes, y en el diálogo donde confirmas el cambio, dice que los agentes por MCP hacen estos cambios sin preguntarte. Para pararlos, elige **Solo lectura** o **Bloquear**.

En HubSpot esto salió con el borrado RGPD de un contacto. Elimina el contacto con todo lo que tiene y bloquea su dirección, y estaba en Preguntar antes. Por MCP un agente habría borrado un contacto sin preguntar a nadie, así que en [hubspot 0.5.0](https://github.com/WireCatLabs/hubspot-cli/releases/tag/v0.5.0) está bloqueado por defecto. Los borrados normales se quedaron en Preguntar antes.

## 6 herramientas nuevas en el catálogo

En cada una inicias sesión en la ventana de la app, y ahí mismo están los pasos para sacar el token o la contraseña.

- **amoCRM y Kommo.** Inicia sesión con la dirección de la cuenta y un token de larga duración, y WireCat copia a tu ordenador tus negociaciones con sus contactos y empresas. Tú y tu agente veis qué cambió en ellas. ([docs de amo](/es/docs/amo))
- **Yandex Disk.** Sacas el token en las propias páginas de Yandex y eliges carpetas por su ruta en el Disco, luego WireCat las copia igual que Google Drive. También lee escaneos e imágenes, por defecto con tesseract en tu ordenador. ([docs de ydisk](/es/docs/ydisk))
- **Attio.** Las negociaciones, personas y empresas se copian a tu ordenador, y puedes encontrar una negociación por el sentido de sus notas. феррара escrito en cirílico encuentra Ferrara. ([docs de attio](/es/docs/attio))
- **HubSpot.** HubSpot tiene un único cupo diario de peticiones para todas las apps de la cuenta, y cuando se acaba, hubspot dice enseguida cuándo vuelve en lugar de seguir machacando la API. ([docs de hubspot](/es/docs/hubspot))
- **Linear.** Issues, proyectos, comentarios y documentos. ([docs de linear](/es/docs/linear))
- **WordPress.** Escribes la dirección del sitio, el nombre de usuario y la contraseña de aplicación en un solo formulario, y la contraseña llega a la herramienta por su entrada estándar, nunca como argumento de un comando. Una entrada nueva de un agente siempre es un borrador, pero publicar está en Preguntar antes, así que un agente por MCP publica sin preguntar. Publicar tiene su propia clave, así que si no quieres eso, ponla en Bloquear y los borradores siguen funcionando. ([docs de wordpress](/es/docs/wordpress))

Slack no está en esta lista. [slk](/es/docs/slk) 0.1.0 salió el 24 de noviembre y funciona desde la terminal, y Slack llegará a Desktop en una versión posterior.

## Tu modelo de IA ordena tu correo

Resúmenes tiene una pestaña nueva, **Bandeja**. El modelo de IA que elegiste en Ajustes ordena el correo nuevo de todas las cuentas en 3 grupos: **Necesita respuesta**, **Para leer** y **Puede esperar**. Cada hilo muestra por qué el modelo lo puso ahí, y un clic en la fila abre el hilo. Necesita mail 0.35, y el remitente se ve desde la 0.36.

Si el modelo funciona fuera de tu ordenador y memo está configurado para preguntar antes de enviar, WireCat primero muestra cuántos correos y tokens saldrían y más o menos cuánto costaría, y pregunta. Desde mail 0.36 la pregunta llega en tu idioma, y después de ordenar ves qué modelo trabajó y cuánto costó, lo que no llega a un céntimo sale como < $0.01. Las reglas de correo pasaron a su propio diálogo, con búsqueda y páginas.

Si el modelo no está en tu ordenador, una ordenación programada envía tu correo a su proveedor sin preguntar.

## Ve a quién unió un agente

Un agente ahora puede unir por su cuenta dos entradas de una misma persona, cuando dos fuentes distintas tienen para ella un móvil personal o una dirección que nadie más tiene. Para un número, al menos una de las fuentes tiene que ser un mensajero o una llamada. La página Contactos muestra estas uniones en una lista aparte. Ves qué agente lo hizo, con qué número o dirección y por qué, y puedes deshacerlo si se equivocó.

Esto lo hace memo, la herramienta de WireCat que enlaza a las personas de todas tus fuentes, y necesita memo 0.141.0. Si no quieres que un agente una personas por su cuenta, pon `"agent_merges": "propose"` en [los ajustes de memo](/es/docs/memo/configuration), y cada unión te esperará.

Una coincidencia que espera tu decisión ahora dice por qué no se unió sola, por ejemplo el número resultó ser la línea de oficina de una empresa. Cada lado de una coincidencia muestra sus últimos mensajes o llamadas, su empresa y su negociación.

## Actualizaciones por apt en Linux

Desde la 0.7.4 el .deb añade el repositorio apt de WireCat, apt.wirecat.dev. Las versiones nuevas llegan por el Actualizador de software o con `sudo apt update && sudo apt install wirecat`, y la ventana de actualización de la app ahora lo dice y no descarga el paquete.

El App Center de Ubuntu no mostraba el desarrollador de un .deb descargado, solo lo muestra para un paquete de un repositorio, así que tuve que montar el nuestro. App Center lee el nombre del desarrollador solo de la clave antigua DeveloperName, que `appstreamcli convert` ya no escribe. Y una Ubuntu 26.04 Desktop recién instalada no trae curl, así que los comandos para añadir el repositorio a mano en apt.wirecat.dev usan wget. Desde la 0.7.5 App Center además muestra la fecha de la versión en lugar de Unknown.

## Detalles

- **WhatsApp dice lo frescos que están sus datos.** WhatsApp no tiene sincronización completa, los mensajes nuevos llegan solo mientras funciona su servicio en segundo plano. La cuenta dice **En vivo** mientras el servicio está conectado, y **Datos al 9:05** cuando no. Necesita whatsapp-cli 0.46.0.
- **Tus propias herramientas inician sesión en la ventana.** Una herramienta que añadiste por su nombre de npm, como beeline (llamadas de la centralita de Beeline), puede definir sus propios pasos de inicio de sesión, y pegas el token en la ventana, sin terminal. Con la versión nueva de la herramienta su menú de cuenta tiene **Cerrar sesión** y **Quitar cuenta**. WireCat comprueba que estos pasos solo ejecutan comandos de la propia herramienta, y te pregunta antes de usarlos.
- **Ajustes en dos pestañas.** Una para la app y otra para cada herramienta. Ahí también eliges cuánto correo sincronizar.
- **Cambia el id de un perfil.** El menú de la cuenta tiene **Cambiar el id del perfil**, y la sesión, los ajustes y los datos pasan al id nuevo. Funciona cuando la versión nueva de la propia herramienta lo admite.
- **Google Calendar se sincroniza desde la app.** También muestra cuándo lo hizo por última vez.
- **Elige páginas y bases de datos de Notion.** WireCat copia las que elegiste, igual que las carpetas de Google Drive. Los pasos para iniciar sesión ya están en ruso y en español, y llevan a la página nueva de tokens de Notion.
- **El resumen matutino del CRM está en Resúmenes.** Primero las negociaciones ganadas y perdidas, luego las tareas vencidas, y cada negociación abre su propia ficha.
- **Resúmenes, tareas y documentos salen de la beta.**
- **La biblioteca de cookies de la app está actualizada**, por el aviso [RUSTSEC-2026-0594](https://rustsec.org/advisories/RUSTSEC-2026-0594.html).

## Cómo conseguirla

Si tienes la 0.7, la app te ofrecerá la actualización, y si instalaste un .deb de la 0.7.4 o posterior, llega por el Actualizador de software. ¿Eres nuevo? Descarga WireCat en [wirecat.dev/es/download](/es/download) para macOS, Windows o Linux. La [guía de Desktop](/es/docs/desktop) cubre cada página, y cada versión de la 0.7.1 a la 0.8.0 tiene sus propias [notas de la versión en GitHub](https://github.com/WireCatLabs/wirecat-desktop/releases).

Las ideas de qué hacer después van en [la página de ideas](/es/ideas), y las preguntas en [Discord](https://discord.gg/DebENqbRrJ) o en [GitHub](https://github.com/WireCatLabs/wirecat-desktop/issues).
