---
title: "Encuentra un documento"
---

Encuentra un contrato, una cifra o una decisión en tus carpetas del Disk por lo que dice el documento, aunque no
recuerdes su nombre. La búsqueda lee la copia de tu ordenador, así que responde sin internet y no cuesta ninguna
petición a Yandex. Cubre las carpetas que elegiste y sincronizaste. Mira [carpetas y sincronización](./usage.md).

```text prompt
Use ydisk CLI with profile personal. Find the document where we agreed the budget for the spring campaign.
Quote the passage and give me the file's path on the Disk.
```

**En esta página:**

1. [Búsqueda por palabras](#search-by-words)
2. [Búsqueda por significado](#search-by-meaning)
3. [Encuentra un archivo por su nombre](#find-a-file-by-its-name)
4. [Etiquetas y notas](#tags-and-notes)
5. [En tus otras fuentes](#across-your-other-sources)
6. [Cuando la búsqueda no encuentra nada](#when-search-finds-nothing)

## Búsqueda por palabras

```sh
ydisk personal search "quarterly budget"
ydisk personal search "договор аренды" --limit 5
ydisk personal search "invoice 2026" --exact
```

La búsqueda encuentra otras formas de una palabra: "договор" también encuentra "договора" y "договоре", y "budgets"
encuentra "budget". `--exact` busca las palabras tal como están escritas. Cada resultado trae el id del documento,
su ruta en el Disk y un fragmento. Pasa el id a `documents show` para ver el texto completo.

Un campo acota los resultados: `tag:` encuentra los documentos con una etiqueta tuya, y `date:` busca por la fecha
del último cambio en el Disk.

```sh
ydisk personal search "budget tag:follow-up"
ydisk personal search "budget date>=30d"
```

## Búsqueda por significado

La búsqueda por significado encuentra un documento que responde a una pregunta con otras palabras, como "¿qué
acordamos gastar?" para un texto que dice "el presupuesto se aprueba en 2 millones". Usa un modelo de texto de tu
ordenador, compartido por todas las herramientas de WireCat. Descarga el modelo una vez con una herramienta de WireCat
que tenga el comando `models`, como [Memo](https://wirecat.dev/en/docs/memo), y luego indexa la copia:

```sh
memo models download embeddinggemma
ydisk personal sync --embed
ydisk personal search "what did we agree to spend?"
```

La descarga usa la red. La indexación y la búsqueda se ejecutan en tu ordenador. Sin el modelo, la búsqueda por
palabras funciona como siempre.

## Encuentra un archivo por su nombre

`catalog` busca en los nombres y tipos de los archivos y carpetas que listó la sincronización, incluidas las fotos y
otros archivos sin texto. `catalog import` pasa lo que listó la sincronización al almacén local. Ejecútalo después de
sincronizar:

```sh
ydisk personal catalog import
ydisk personal catalog search "passport"
ydisk personal catalog tree
```

Un archivo fuera de las carpetas elegidas se encuentra en directo: `files list --folder /Documents` lista una carpeta
del Disk.

## Etiquetas y notas

Las etiquetas y las notas son tuyas y se quedan en tu ordenador. El Disk nunca las ve. Se quedan con el documento
cuando el archivo se mueve.

```sh
ydisk personal tags add 1a2b3c follow-up
ydisk personal notes add 1a2b3c "Signed copy is with Anna"
ydisk personal documents context 1a2b3c
```

El id de arriba es un ejemplo. Toma uno real de `search` o de `documents list`. `documents context` muestra un
documento con sus etiquetas, notas y recuerdos.

## En tus otras fuentes

La copia vive en el almacén local que comparten las otras herramientas de WireCat. Con
[Memo](https://wirecat.dev/en/docs/memo), una sola búsqueda encuentra un documento del Disk junto al chat de
Telegram o al correo donde se habló de él.

## Cuando la búsqueda no encuentra nada

Un resultado vacío significa que nada coincidió en la copia, no que el Disk no tenga ese archivo. Comprueba, por
este orden:

1. `ydisk personal folders list`: ¿está elegida la carpeta del archivo?
2. `ydisk personal status`: ¿terminó la sincronización y el archivo figura como guardado solo por el nombre?
3. Ejecuta `ydisk personal sync` si el archivo es nuevo.
4. Busca el nombre con `catalog search`, o lista la carpeta en directo con `files list`.

Un PDF escaneado no tiene capa de texto, así que solo se puede buscar por su nombre.
