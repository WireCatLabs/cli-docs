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

Ya funcionan las reuniones de [Zoom](./zm/meetings.md), los documentos de [Google Drive](./drive/index.md), los
eventos de [Google Calendar](./gcal/usage.md), el [correo](./mail/usage.md) y [Bitrix24](./b24/usage.md). También
están disponibles los chats de [WhatsApp](./wa/index.md) y los bots empresariales. [WireCat Desktop](./desktop/index.mdx)
instala las herramientas, te ayuda a iniciar sesión y las conecta con tus agentes sin terminal. Consulta las
[funciones](./features.mdx).

## A continuación

### En WireCat Desktop

- **Clientes**: una página con las personas y empresas con las que trabajas y tus acuerdos con ellas, junto a los
  chats, el correo y las reuniones de cada una.
- **Notas**: leer y escribir tus notas en la aplicación y enlazarlas con personas y mensajes.

### Búsqueda y memoria

- **Mejor búsqueda por significado**: una pregunta con tus propias palabras encuentra más a menudo la nota o el
  documento correcto, aunque no comparta palabras con él.
- **Reuniones en cada búsqueda**: lo que se decidió en una llamada aparece junto a los mensajes y correos sobre el
  mismo tema.
- **Una persona en todas las fuentes**: las personas con la misma dirección de correo en Telegram, el correo y Zoom
  pasan a ser una sola, y la aplicación tendrá una página de Personas. Siempre puedes deshacer la unión.
- **Enlaces entre los datos**: los nombres, teléfonos y documentos de un mensaje se enlazan con la persona o la
  empresa a la que pertenecen. Así tu agente puede pasar de una nota a una persona y a sus documentos.
- **Temas sin etiquetar a mano**: etiquetas sugeridas para notas, documentos y mensajes, para encontrar un tema
  también donde no lo etiquetaste tú.
- **Resúmenes automáticos**: el resumen de la mañana de Memo ya muestra lo nuevo. Pasará a ser un texto breve en tu
  idioma sobre tus chats, correo y reuniones, y te llegará con la frecuencia que elijas.
- **Recuerdos al día**: tu agente propone recuerdos nuevos a partir de tus fuentes y marca un recuerdo cuando cambia
  la fuente en la que se basa. Tú confirmas el cambio.

### Nuevas fuentes

- **Google Meet**: las reuniones y sus transcripciones, enlazadas con las personas y los chats relacionados, como ya
  ocurre con Zoom.
- **Notion**: tus páginas y bases de datos junto a tus notas y documentos.

### Confianza

- **Aplicaciones verificadas**: las aplicaciones de inicio de sesión de WireCat para Google, Microsoft y Zoom pasan
  la revisión de cada empresa. Google dejará de mostrar su pantalla de aviso, y Zoom ya no necesitará una aplicación
  propia.

## Más adelante

- **Más mensajería y reuniones**: Microsoft Teams y Slack, tanto mensajes como reuniones.
- **Plataformas de agentes**: integraciones nativas con OpenClaw y Hermes, más allá de la skill que
  [ambos ya pueden usar](./agents.mdx).
- **GitHub**: descripciones de pull requests, issues y proyectos.
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
