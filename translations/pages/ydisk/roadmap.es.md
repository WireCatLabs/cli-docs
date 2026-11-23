---
title: "Hoja de ruta"
---

Esta página enumera lo que está previsto para `ydisk` y aún no está hecho. Léela antes de montar un apaño para una
función que falta: puede que ya esté en camino. El orden puede cambiar y no hay fechas. Para sugerir algo, abre un
[issue en GitHub](https://github.com/WireCatLabs/ydisk-cli/issues).

## Qué funciona hoy

`ydisk` inicia sesión en tu Yandex Disk con un token de Yandex que creas una sola vez. Copia a tu ordenador el texto de
las carpetas que elijas, y tú y tu agente lo buscáis por palabras, por significado y por nombre de archivo, incluso sin
internet. La misma herramienta lista, descarga, sube, mueve y comparte archivos del Disk dentro de los permisos que
fijes, por la línea de comandos o por MCP. Una carpeta que [sincronizas en ambos sentidos](./mirrors.md) queda igual
en tu ordenador y en el Disk, y se guarda cada archivo que una sincronización borra o reemplaza. Un espejo puede
guardar todo el Disk, sin las carpetas que dejes fuera, y se detiene antes de muchos borrados o sobrescrituras a la vez
hasta que los permitas. Un archivo de texto editado en ambos lados en sitios distintos se fusiona, y un conflicto real
te espera con las dos versiones. Tu agente también puede [editar un archivo en el Disk](./usage.md#edit-a-file-on-the-disk)
donde está: un archivo de texto, celdas de un `.xlsx` o párrafos de un `.docx`, con el formato intacto y el contenido
reemplazado guardado en tu ordenador. También puedes [abrir el Disk como una carpeta](./mount.md) en tu gestor de
archivos, en solo lectura. Mira la [introducción](./index.md).

## Siguiente

- Crear un documento de Word o un libro de Excel nuevo. Hoy un agente edita los que ya están en el Disk y solo crea
  archivos de texto.

Lo que cambió en cada versión está en el [registro de cambios](./changelog.md).
