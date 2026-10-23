---
title: "Próximas mejoras"
---

<a id="lo-que-funciona-hoy" />
<a id="en-curso" />
<a id="próximamente" />
<a id="más-adelante" />
<a id="what-works-today" />
<a id="in-progress" />
<a id="next" />
<a id="later" />

Esta página enumera lo que está planeado para `drive` y aún no incluye. Léela antes de crear una solución alternativa para una función que falta: es posible que ya esté en camino. El orden es aproximado y puede cambiar. Para sugerir algo, abre una [incidencia en GitHub](https://github.com/WireCatLabs/drive-cli/issues).

## Lo que funciona hoy

`drive` importa las carpetas de Google Drive que elijas y guarda su texto en tu ordenador: Documentos y Hojas de cálculo de Google, PDF, docx, xlsx, CSV y Markdown. Puedes buscar en ellos por palabras y por significado, leerlos sin conexión y añadir etiquetas, notas y recuerdos. También lee y edita rangos de Hojas de cálculo de Google en vivo, gestiona archivos y mantiene carpetas locales de Markdown y CSV espejadas en Documentos y Hojas de cálculo de Google, en ambos sentidos, cuando ejecutas `mirrors sync`. Todos los comandos están en la [referencia de comandos](./commands.md).

## En curso

- **La revisión de Google de la aplicación de inicio de sesión de WireCat.** Hasta que Google la termine, Google muestra una pantalla de «aplicación no verificada» y deja que solo 100 usuarios nuevos inicien sesión con la aplicación. Consulta [qué hacer ante la advertencia](./installation.md#google-shows-an-unverified-app-warning).

## Próximamente

- **Una guía para carpetas espejadas**: cómo configurar una, qué pasa cuando cambian ambos lados y qué nunca se traslada.
- **Espejos que se mantienen sincronizados solos** mientras trabajas, sin ejecutar `mirrors sync` a mano.
- **Imágenes locales en Markdown espejado**, subidas junto con el documento. Hoy solo aparecen en el Documento las imágenes con un enlace `https://`.
- **Front matter en Markdown espejado** que no entre en el texto del Documento.
- **Descargar y exportar con un solo comando**, como un Documento en PDF o una Hoja de cálculo en CSV.

## Más adelante

- **Responder y resolver comentarios** desde la línea de comandos.
- **Copiar conjuntos mayores de etiquetas, notas y recuerdos** entre almacenes.
- **Borrado a través de los espejos**, si lo activas, con un archivo local.
- **Un servidor MCP para agentes web y móviles**, además del local.

Lo que cambió cada versión publicada está en el [registro de cambios](./changelog.md).
