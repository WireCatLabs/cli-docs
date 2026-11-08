---
title: "Hoja de ruta"
description: "Lo que WireCat construye a continuación: la aplicación Desktop, búsqueda y memoria, nuevas fuentes e inicio de sesión verificado."
---

WireCat reúne tu contexto en un solo lugar. Los mensajes, las reuniones, los archivos, las notas
y las tareas suelen estar en aplicaciones separadas, así que un agente solo ve una parte de cada
conversación. Conectamos estas fuentes y las relacionamos por personas y temas, para que tu
agente responda con la imagen completa y muestre de dónde sale cada dato. Cómo encajan los datos
se explica en el [modelo de datos](./data-model.mdx).

Esta página muestra lo que construimos a continuación. Algo planificado aún no es una función
disponible, y el orden puede cambiar. No hay fechas prometidas. Lo que ya funciona está en
[funciones](./features.mdx).

**Puedes influir en esta hoja de ruta.** Propón una fuente o una función, cuéntanos qué necesitas primero o
comenta un punto en el [Discord de WireCat](https://discord.gg/DebENqbRrJ). Leemos cada petición y con ellas
decidimos qué viene después.

## Novedades

Lo más reciente primero.

- **[Bitrix24](./b24/usage.md)**: acuerdos, leads, contactos y empresas de tu portal. Se copian a tu ordenador, y
  una búsqueda en todas tus fuentes los encuentra junto a los mensajes y las notas.
- **[WireCat Desktop](./desktop/index.mdx) 0.5**: el instalador de Windows está firmado. La aplicación revisa el
  almacén compartido antes de instalar o actualizar una herramienta, y puede mantener Telegram, MAX y WhatsApp en
  segundo plano.
- **[El correo](./mail/usage.md) como herramienta propia**: inicio de sesión con Outlook y Microsoft 365, un repaso
  de lo nuevo y de lo que te falta responder, archivos de Gmail desde Google Takeout y deshacer un solo cambio.
- **WireCat Desktop 0.4**: una página de estadísticas, editar u olvidar lo que WireCat recuerda en la página de
  memoria, añadir un bot y pasos de inicio de sesión que dicen a qué accede cada herramienta.
- **Tu propia aplicación de inicio de sesión**: Google Drive, Google Calendar y Zoom pueden iniciar sesión con una
  aplicación que creaste tú.
- **[Google Calendar](./gcal/usage.md)**: recordatorios de reuniones, seguir cualquier calendario por su dirección y
  una sola búsqueda en reuniones, chats y notas.
- **Archivos de Telegram, MAX y WhatsApp**: el servicio en segundo plano arranca al iniciar sesión y recupera lo que
  llegó mientras estaba apagado.
- **Las transcripciones de Zoom** guardan su idioma, y un resultado de búsqueda dice quién habló y dónde.
- **Tareas en Memo**: comentarios, fechas límite y tareas de proyecto, y recuerdos que pertenecen a un proyecto.
- **WireCat Desktop**: la aplicación instala las herramientas, te ayuda a iniciar sesión y las conecta con tus
  agentes sin terminal.
- **OpenClaw y Hermes**: OpenClaw lee la skill que instala cada herramienta y encuentra las skills de WireCat en
  ClawHub. Hermes las instala desde el índice de skills de este sitio. Consulta los [agentes](./agents.mdx).

Antes: las reuniones de [Zoom](./zm/meetings.md), los documentos de [Google Drive](./drive/index.md) y los chats y
bots de [WhatsApp](./wa/index.md). Todo lo que funciona hoy está en [funciones](./features.mdx).

## A continuación

### En WireCat Desktop

- **Clientes**: una página con las personas y empresas con las que trabajas y tus acuerdos con ellas, junto a los
  chats, el correo y las reuniones de cada una.
- **Notas**: leer y escribir tus notas en la aplicación y enlazarlas con personas y mensajes.

### Búsqueda y memoria

La búsqueda por significado ya funciona en tu ordenador para mensajes, notas, correo y documentos de Drive, junto con
la búsqueda por palabras. Consulta [cómo funciona la búsqueda](./search-architecture.mdx). Ahora mejorará en esto.

- **Mejores respuestas a preguntas con tus propias palabras**: una pregunta formulada de otra manera pone más a
  menudo la nota, el documento o el mensaje correcto entre los primeros. Hoy, en nuestras pruebas con notas, pasa en 2 de
  cada 5 preguntas reformuladas.
- **Reuniones en cada búsqueda**: las reuniones de Zoom ya se buscan en Zoom. Una búsqueda en todas tus fuentes
  mostrará lo que se decidió en una llamada junto a los mensajes y correos sobre el mismo tema.
- **Una persona en todas las fuentes**: hoy enlazas a mano las cuentas de una persona. Las personas con la misma
  dirección de correo en Telegram, el correo y Zoom pasarán a ser una sola, y la aplicación tendrá una página de
  Personas. Siempre puedes deshacer la unión.
- **Enlaces entre los datos**: las herramientas ya encuentran nombres, teléfonos y documentos en los mensajes. Ahora
  enlazarán cada uno con la persona o la empresa a la que pertenece. Así tu agente podrá pasar de una nota a una
  persona y a sus documentos.
- **Temas sin etiquetar a mano**: las etiquetas que pones tú ya funcionan. Las etiquetas sugeridas para notas,
  documentos y mensajes encontrarán un tema también donde no lo etiquetaste.
- **Resúmenes automáticos**: el resumen de la mañana de Memo ya muestra lo nuevo. Pasará a ser un texto breve en tu
  idioma sobre tus chats, correo y reuniones, y te llegará con la frecuencia que elijas.
- **Recuerdos al día**: los recuerdos que propone tu agente ya esperan tu revisión. Ahora un recuerdo se marcará
  cuando cambie la fuente en la que se basa, con un cambio que tú confirmas.

### Nuevas fuentes

- **Google Meet**: las reuniones y sus transcripciones, enlazadas con las personas y los chats relacionados, como ya
  ocurre con Zoom.
- **Notion**: tus páginas y bases de datos junto a tus notas y documentos.

### Confianza

- **Aplicaciones verificadas**: las aplicaciones de inicio de sesión de WireCat para Google, Microsoft y Zoom pasan
  la revisión de cada empresa. Google dejará de mostrar su pantalla de aviso, y Zoom ya no necesitará una aplicación
  propia.

### Después

- **Más mensajería y reuniones**: Microsoft Teams y Slack, tanto mensajes como reuniones.
- **GitHub**: descripciones de pull requests, issues y proyectos.

## Más adelante

- **Código en GitHub**: búsqueda por significado en el propio código y, por separado, en el propósito de cada cambio.
- **Confluence.**
- **Gestores de tareas**: Jira, Linear, Todoist y TickTick.

## Planes de cada herramienta

- [Hoja de ruta de Telegram](./tg/roadmap.md)
- [Hoja de ruta de MAX](./max/roadmap.md)
- [Hoja de ruta de Zoom](./zm/roadmap.md)
- [Hoja de ruta de Google Drive](./drive/roadmap.md)
- [Hoja de ruta de Google Calendar](./gcal/roadmap.md)
- [Hoja de ruta de Mail](./mail/roadmap.md)
- [Hoja de ruta de Bitrix24](./b24/roadmap.md)
- [Hoja de ruta de Memo](./memo/roadmap.md)
- [Hoja de ruta de WhatsApp](./wa/roadmap.md)

Para proponer una fuente o función, abre un issue en el repositorio de GitHub de la herramienta.
