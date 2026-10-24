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

`drive` importa las carpetas de Google Drive que elijas y guarda su texto en tu ordenador: Documentos y Hojas de cálculo de Google, PDF, docx, xlsx, CSV y Markdown. Puedes buscar por palabras y significado, leer sin conexión y añadir etiquetas, notas y recuerdos. También lee y edita rangos de Hojas de cálculo, gestiona archivos y sincroniza carpetas locales Markdown y CSV con Documentos y Hojas de cálculo en ambos sentidos, al ejecutar `mirrors sync` o mientras funciona `mirrors watch`. Descarga archivos subidos, exporta documentos Google como PDF, DOCX, XLSX o CSV, y responde, resuelve y reabre comentarios. Su [servidor MCP remoto](./remote.md) conecta agentes del navegador y teléfono mediante tu túnel HTTPS, un código de acceso y los permisos del perfil; el mismo túnel permite que `mirrors sync` inserte imágenes locales en los Documentos. La [guía de espejos](./mirrors.md) explica la configuración y la resolución de conflictos. Todos los comandos están en la [referencia](./commands.md).

## En curso

- **La revisión de Google de la aplicación de acceso de WireCat.** Hasta que termine, Google muestra «aplicación no verificada» y deja entrar a solo 100 usuarios nuevos. Consulta [qué hacer ante la advertencia](./installation.md#google-shows-an-unverified-app-warning).

## Próximamente

- **`mirrors watch` como servicio en segundo plano** que arranque con el ordenador, en lugar de mantener un comando abierto en una terminal.
- **Front matter en Markdown espejado** que no entre en el texto del Documento.

## Más adelante

- **Copiar conjuntos mayores de etiquetas, notas y recuerdos** entre almacenes.
- **Borrado a través de los espejos**, si lo activas, con un archivo local.

Lo que cambió cada versión publicada está en el [registro de cambios](./changelog.md).
