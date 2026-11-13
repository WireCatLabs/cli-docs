---
title: "Privacidad y agentes de IA: adónde van tus datos mientras trabaja el agente"
description: Cuándo la privacidad importa de verdad, por dónde se escapan los datos cuando trabajas con agentes de IA y qué puedes hacer. Con filtraciones reales y cómo lo resolvemos en WireCat.
date: 2026-11-05
tags: [security, ai-agents]
author: viacheslav-ptsarev
draft: false
---

Ahora mucha gente piensa en la privacidad, sobre todo después de las últimas filtraciones. Las conversaciones de la gente con ChatGPT y Claude ya [se venden](https://www.theregister.com/2026/03/03/chatbot_data_harvesting_personal_info/) en una base comercial, y un investigador encontró ahí datos de pacientes que sanitarios habían pegado en un chatbot. Unas extensiones VPN para Chrome, justo las que prometían privacidad, [recogían](https://www.malwarebytes.com/blog/news/2025/12/chrome-extension-slurps-up-ai-chats-after-users-installed-it-for-privacy) chats con IA de 8 millones de personas y se los pasaban a un broker de datos. Y una app de chatbot directamente [dejó](https://www.foxnews.com/tech/millions-ai-chat-messages-exposed-app-data-leak.print) a la vista de cualquiera unos 300 millones de mensajes (es la estimación de un investigador), solo porque configuraron mal Firebase.

Hago [WireCat](https://wirecat.dev/es), herramientas open source que conectan un agente de IA a tus mensajes de Telegram, WhatsApp y MAX, a tu correo, notas y reuniones, o sea, justo a lo que no debería filtrarse. Así que en WireCat pensamos en la privacidad todo el tiempo, y he reunido cuándo importa de verdad, por dónde se filtran los datos mientras trabajas con un agente y qué puedes hacer.

## Cuándo la privacidad importa de verdad

No creo que todo el mundo tenga que dejar ya los modelos en la nube. Yo mismo programo con Claude Code, y para la mayoría de las tareas la nube es más rápida y más lista que lo que puede mover un portátil. Pero hay casos en los que vale la pena pensarlo antes:

- **En tus mensajes hay palabras de otros.** Me parece lo más infravalorado. Un cliente te mandó un contrato, un amigo te contó algo de su salud, y ninguno aceptó que lo leyera el modelo de alguien. Tu código se lo das al agente tú, pero con los mensajes en parte decides también por otros. WhatsApp, por cierto, [añadió](https://blog.whatsapp.com/introducing-advanced-chat-privacy) en la primavera de 2025 un ajuste de chat que impide usar sus mensajes con IA.
- **Secreto profesional.** La American Bar Association [escribe](https://www.jdsupra.com/legalnews/aba-weighs-in-on-generative-ai-use-in-3097638) que un abogado debe obtener el consentimiento explícito del cliente antes de meter sus datos en una IA que aprende de ellos. En los Países Bajos el regulador [recibió](https://www.dutchitchannel.nl/news/466398/ap-gebruik-ai-chatbot-kan-leiden-tot-datalekken) notificaciones de filtración después de que un empleado de una clínica pegara datos médicos de pacientes en un chatbot.
- **NDA y datos de trabajo.** El clásico es Samsung, que en 2023 [prohibió](https://www.csoonline.com/article/3695170/samsung-bans-staff-ai-use-over-data-leak-concerns.html) la IA generativa en una de sus divisiones después de que unos ingenieros subieran código interno a ChatGPT.
- **Simplemente no te apetece.** También es un buen motivo.

## Por dónde se escapan los datos mientras trabajas con un agente

Normalmente se piensa en un solo sitio, el modelo ve mi petición. Pero hay más, y no todos son obvios:

1. **El modelo del agente.** Todo lo que el agente ha leído lo envía a su modelo. Si el modelo está en la nube, va al proveedor. Eso no es una filtración, pero a partir de ahí todo depende de las reglas del proveedor.
2. **Almacenamiento y entrenamiento en el proveedor.** En Anthropic, en Free, Pro y Max, desde el otoño de 2025 tus datos [van al entrenamiento](https://www.anthropic.com/news/updates-to-our-consumer-terms) si el ajuste está activado, y entonces se guardan 5 años, y si está desactivado, 30 días. Esto cubre también Claude Code en esos planes. Google guarda los chats de Gemini que pasaron por revisión humana [hasta 3 años](https://support.google.com/gemini/answer/13594961), aunque hayas borrado el historial. Y OpenAI en 2025, por una orden judicial en el caso con el NYT, [tuvo que guardar](https://engadget.com/ai/openai-no-longer-has-to-preserve-all-of-its-chatgpt-data-with-some-exceptions-192422093.html) todos los chats, también los borrados, y después el juez le [obligó](https://news.bloomberglaw.com/ip-law/openai-must-turn-over-20-million-chatgpt-logs-judge-affirms) a entregar al NYT unos 20 millones de chats, aunque anonimizados. La API y los planes de empresa tienen reglas más suaves, pero tienes que comprobarlo para tu plan.
3. **El botón de compartir.** En el verano de 2025 miles de chats compartidos de ChatGPT [acabaron](https://fortune.com/2025/08/05/openai-google-search-chat-history/) en Google, y de Grok [hubo más de 370.000](https://9to5mac.com/2025/08/20/370k-grok-ai-chats-made-public-without-user-consent/), con preguntas médicas y hasta una contraseña.
4. **Texto ajeno que da órdenes al agente (prompt injection).** El agente lee un correo o un mensaje, dentro hay una instrucción y el agente la cumple. Ya ha pasado. A través de un issue público en GitHub, un agente con el MCP oficial de GitHub [filtró](https://invariantlabs.ai/blog/mcp-github-vulnerability) datos de repositorios privados, y un solo correo [hacía](https://www.securityweek.com/echoleak-ai-attack-enabled-theft-of-sensitive-data-via-microsoft-365-copilot/) que Microsoft 365 Copilot enviara datos fuera sin un solo clic. Simon Willison lo [llamó](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) lethal trifecta. Si un agente tiene tus datos personales, lee texto ajeno y puede enviar algo fuera, se le puede obligar a filtrar tus datos. Un agente con acceso a tus mensajes entra ahí de inmediato.
5. **Las propias herramientas.** Un servidor MCP o una extensión también es código que ve tus datos. En septiembre de 2025 apareció en npm un servidor MCP de correo [falso](https://www.theregister.com/2025/09/29/postmark_mcp_server_code_hijacked/) que ponía en silencio al atacante en copia oculta de cada correo, y tenía unas 1.500 descargas a la semana.
6. **Modelos dentro de las herramientas.** Además de tu agente, las herramientas a veces tienen sus propios modelos, para leer imágenes, transcribir mensajes de voz, buscar con más cuidado. Cada uno de esos modelos es otro sitio adonde va el texto, y normalmente nadie piensa en ellos.
7. **Lo local que no es del todo local.** Por ejemplo, en Ollama parte de los modelos funciona en los servidores de Ollama, no en tu ordenador. O tienes un modelo en un servidor de casa, la herramienta le habla por http normal y tus mensajes van por la red sin cifrar.
8. **La copia en disco.** Si una herramienta guarda tus mensajes en tu ordenador, puede leerlos cualquiera que se siente en él con tu usuario. Aquí ayudan el cifrado del disco y el bloqueo de pantalla, no los ajustes de la herramienta.

La lista no está completa, junté lo que encontré mientras hacía WireCat.

## Qué hacer

Parte de esto no depende de ti, pero mucho lo puedes hacer tú:

- Desactivar el entrenamiento con tus datos en el proveedor, y para lo sensible usar la API o un plan de empresa, donde las reglas de almacenamiento son más estrictas.
- No pulsar compartir en chats con algo personal.
- Dar al agente los mínimos permisos. Que lea, pero que envíe mensajes solo con tu confirmación.
- Mirar qué servidores MCP y extensiones instalas, y quién los ha hecho.
- Para lo más sensible, usar el modelo en tu ordenador. Es más lento, pero el texto no va a ningún sitio.
- Activar el cifrado del disco.

## Cómo funciona esto en WireCat

Desde el principio dimos por hecho que el agente iba a leer mensajes ajenos, y por tanto instrucciones ajenas.

- **Tus datos se quedan contigo.** Cada herramienta guarda una copia de tus mensajes en una base de datos en tu ordenador, y la búsqueda en ella, por palabras y por significado, funciona con modelos que WireCat descarga en tu ordenador. O sea, puedes encontrar lo que buscas sin nada de nube.
- **Todo lo que necesita un modelo en la nube está apagado por defecto.** La búsqueda por significado y la transcripción de reuniones funcionan en local, y leer imágenes, los borradores de respuesta y la búsqueda más cuidadosa los activas tú, y en los ajustes se ve adónde envía datos cada función.
- **Un interruptor, Solo este ordenador.** Cuando está activado, las herramientas de WireCat se niegan a hablar con un modelo en otro ordenador antes de enviar nada. Un agente puede activarlo, pero solo tú puedes desactivarlo.
- **El texto ajeno va marcado como datos.** Las herramientas dan los mensajes al agente como material para leer, no como instrucciones. No es una garantía, el agente puede equivocarse igualmente, así que puedes limitar el permiso de enviar, hasta destinatarios concretos y un número de mensajes por hora.
- **Agentes en segundo plano con límites.** Los resúmenes y el agente de correo leen correos ajenos sin ti, así que Claude Code recibe para ellos solo los comandos de WireCat, y Codex funciona en un sandbox sin red (sus comandos no se pueden limitar, por eso WireCat te avisa antes de activarlo). Tus propios ajustes del agente, que podrían ampliar esto, no se leen.

El último punto, por cierto, estorba a la privacidad. Como tus ajustes del agente no se leen, el modelo local que pusiste ahí tampoco llega a los resúmenes. Tuve que elegir, y de momento elegí la seguridad.

Cómo usar WireCat entero con modelos locales, con cifras de lo que cuesta en velocidad y memoria, lo conté [en otro post](/es/blog/local-models-and-private-messages).

Si estás pensando en la privacidad para tu equipo o tus clientes y quieres hablarlo, escribe en el tema Ayuda en Telegram o en #help en Discord. Y si conoces casos que se me escaparon, me alegrará saberlo.
