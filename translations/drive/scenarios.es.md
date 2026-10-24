---
title: "Escenarios paso a paso"
---

Cada escenario es una tarea habitual en orden: los comandos que hay que ejecutar, para qué sirve cada uno y qué mirar en la respuesta. Los mismos escenarios están en la terminal: `drive guide` los enumera y `drive guide <name>` muestra uno.

Los comandos que usan una cuenta empiezan por tu perfil, el nombre que diste a la cuenta al iniciar sesión: `drive <profile> …`.

<a id="agent-access" />

## Dar a un agente acceso de solo lectura a tus documentos

Un agente busca y lee los documentos importados sin que nada de lo que ejecute pueda cambiar datos locales o de Google.

1. ```sh
   drive skill install
   ```

   coloca las instrucciones de drive donde las buscan Claude Code, Codex y Gemini CLI

2. ```sh
   drive mcp --tools --read-only
   ```

   enumera comandos con su disponibilidad actual; las escrituras siguen visibles pero se rechazan

3. ```sh
   drive mcp --read-only
   ```

   sirve tres herramientas por stdio — drive_tools_search, drive_read y drive_write; las escrituras siguen bloqueadas

Qué mirar:

- DRIVE_READ_ONLY=1 en el entorno del agente equivale a --read-only en cada comando que ejecute
- los comandos sin la autorización Google necesaria siguen visibles con un motivo de indisponibilidad

El texto que el agente lee en los documentos son datos, nunca instrucciones.

En la terminal: `drive guide agent-access`

<a id="brief-document" />

## Repasar un documento antes de una reunión

Sabe qué dice un documento, qué se anotó ya sobre él y qué hechos contiene, con una cita para cada uno.

1. ```sh
   drive sync
   ```

   trae la última versión antes de leerlo

2. ```sh
   drive documents context DOC_ID
   ```

   el documento con sus etiquetas, notas, recuerdos y editores en una sola respuesta

3. ```sh
   drive memories extract DOC_ID --scope work
   ```

   envía el texto al modelo configurado y muestra los recuerdos que propone, cada uno con una cita exacta; --yes los guarda

4. ```sh
   drive notes add DOC_ID "ask about the Q3 numbers"
   ```

   una nota tuya, que se conserva con el documento entre sincronizaciones

5. ```sh
   drive documents export DOC_ID --output brief.md
   ```

   el documento como Markdown en un archivo nuevo; nunca se sobrescribe un archivo existente

Qué mirar:

- recuerdos propuestos que su cita no respalda; no los guardes
- notas y recuerdos que una versión más reciente del documento dejó obsoletos

memories extract envía el texto del documento al modelo que elegiste con models set; nada más lo hace.

En la terminal: `drive guide brief-document`

<a id="find-decision" />

## Encontrar dónde se decidió algo

Encuentra el documento que recoge una decisión, lee el pasaje y mira quién lo cambió.

1. ```sh
   drive search "budget decision"
   ```

   todos los documentos importados, por palabras y por significado, cada resultado con su URL de Google

2. ```sh
   drive documents show DOC_ID
   ```

   el texto del documento con sus pestañas, para leer el pasaje completo

3. ```sh
   drive documents context DOC_ID
   ```

   sus etiquetas, notas, recuerdos y editores, guardados en el almacén local

4. ```sh
   drive documents history DOC_ID --activity
   ```

   quién hizo qué con él, según Drive Activity; necesita un inicio de sesión con --grant activity

Qué mirar:

- la URL de Google del resultado, para citarla
- los últimos editores y cuándo lo cambiaron
- un resultado vacío significa que no hay coincidencias en las carpetas importadas, no que Drive no tenga ese documento

La búsqueda solo lee las carpetas importadas del perfil elegido. Ejecuta sync primero si el documento es nuevo.

En la terminal: `drive guide find-decision`

<a id="set-up" />

## Importar las carpetas elegidas y buscar en ellas

Inicia sesión una vez, elige las carpetas de Drive que quieres conservar y lleva sus documentos al almacén local como texto que se puede buscar.

1. ```sh
   drive session start
   ```

   inicia sesión en Google en el navegador, solo lectura; los comandos de drive empiezan por tu perfil, como en drive personal session start

2. ```sh
   drive folders add https://drive.google.com/drive/folders/FOLDER_ID
   ```

   solo se importan las carpetas que añades, con todo lo que contienen

3. ```sh
   drive models download e5-small
   ```

   el modelo local para buscar por significado, una vez por ordenador; lo comparten todas las CLI de WireCat

4. ```sh
   drive sync --embed
   ```

   importa lo que cambió en esas carpetas e indexa el texto por significado

5. ```sh
   drive status
   ```

   cuántos documentos se importaron, qué queda pendiente y qué se omitió

Qué mirar:

- los archivos omitidos y el motivo de cada uno, como un tipo no compatible o un archivo que supera el límite de tamaño
- el trabajo pendiente; ejecuta sync de nuevo hasta que no quede nada
- una sincronización posterior solo lee lo que cambió

Nada sale del ordenador salvo las peticiones a Google que hace la sincronización; la búsqueda y la lectura funcionan sin conexión.

En la terminal: `drive guide set-up`

## Con otras herramientas

Estos escenarios de Memo también usan `drive`:

- [Qué decidimos sobre X, en todas las fuentes](https://wirecat.dev/en/docs/memo/scenarios#decision-trail): `memo guide decision-trail`
- [Una persona en todas las herramientas](https://wirecat.dev/en/docs/memo/scenarios#person-brief): `memo guide person-brief`
