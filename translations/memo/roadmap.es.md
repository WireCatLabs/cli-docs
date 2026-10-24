---
title: "Hoja de ruta"
---

Aquí puedes ver qué hace Memo hoy, qué se está construyendo y qué está previsto. Consulta los planes antes de
buscar una solución alternativa: quizá la función que falta ya esté prevista. El orden es aproximado y puede
cambiar. Puedes proponer ideas en [las incidencias de GitHub](https://github.com/WireCatLabs/cli-memo/issues).

## Qué funciona hoy

Memo lee carpetas de notas y sus documentos, importa correo de Gmail e IMAP a través de Himalaya y lee los
mensajes que tg, max y wa guardan en el almacén local. Puedes buscar en todas esas fuentes, consultar lo que
sabes de una persona o proyecto, etiquetar contenido, mantener tareas y recordatorios locales y dejar que
un agente registre recuerdos, hechos y propuestas para que los revises, desde el terminal o mediante MCP.
MCP ofrece comandos, incluidas escrituras, limitados por permisos guardados, y abre las fuentes completas.
Descarga el modelo con `models text download` y añade una cuenta explícita de Himalaya con `mail add`.
Todos los comandos y opciones están en [la referencia de comandos](./commands.md); las guías empiezan en
[la introducción](./index.md).

## En curso

Ahora mismo no hay nada en desarrollo. Los primeros elementos del apartado siguiente tienen prioridad.

## A continuación

- **Fuentes de un proyecto: próximos pasos.** Antes de recopilar, indicar qué fuentes están lo bastante
  actualizadas para buscar; leer el hilo completo alrededor de una coincidencia; añadir búsqueda por significado si se desea.
- **Reuniones en `search all` y en el contexto de una persona.** Hoy las reuniones guardadas tienen su propia búsqueda.
- **Búsqueda más rápida.** Una búsqueda en un almacén pequeño no debería tardar varios segundos.

## Más adelante

- Exportación y restauración completas de un proyecto, más allá de los alias, hechos y enlaces que Memo ya traslada.
- Análisis opcional con IA de las fuentes de un proyecto, indicando qué ha cambiado desde la ejecución anterior.
- Fusión de etiquetas duplicadas. Hoy Memo muestra qué afectaría una fusión sin cambiar nada.
- Recordatorios de las propias tareas de un proyecto.
- Compatibilidad con macOS y Windows. Hoy Memo solo está probado en Linux.
- MCP mediante HTTP para aplicaciones que no inician Memo por sí mismas.
- Búsqueda de imágenes por la conversación que las rodea y por los datos de la foto.

Los cambios de cada versión están en el [historial de cambios](./changelog.md).
