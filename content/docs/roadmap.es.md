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

- **[Google Calendar](./gcal/usage.md)**: tu agente ve tus eventos, te recuerda las reuniones y las encuentra junto a
  los chats y las notas sobre ellas.
- **[OpenClaw y Hermes](./agents.mdx#openclaw)**: los dos agentes usan las herramientas de WireCat con sus skills.
- **[Bitrix24](./b24/usage.md)**: tus acuerdos, leads, contactos y empresas, en la búsqueda junto a tus mensajes.

Todo lo que funciona hoy está en [funciones](./features.mdx).

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
