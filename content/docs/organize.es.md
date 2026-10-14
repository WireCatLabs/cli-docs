---
title: "Organizar tus fuentes"
description: "Elige etiquetas, notas, recuerdos y vínculos con proyectos para información útil y reutilizable."
---

Conecta una decisión del proyecto con el documento, mensaje y persona que la explican. Esta guía
te ayuda a elegir qué guardar y qué vincular sin copiar cada fuente en una nota nueva.
Los registros conectados deben estar en la misma base local elegida expresamente.

## Elegir el registro adecuado

| Usa esto | Para | Ejemplo |
| --- | --- | --- |
| Documento o mensaje original | Conservar la evidencia y su ubicación. | Un presupuesto Google y el mensaje que lo aprueba. |
| Carpeta | Elegir una colección de archivos para importar. | Una carpeta local de notas o una carpeta Google Drive. |
| Etiqueta | Dar una marca sencilla a varias fuentes. | `budget` o `follow-up`. Una etiqueta no es un proyecto ni permiso. |
| Nota | Escribir tu propio contexto sobre una fuente o persona. | «Pedir a Rin que explique los totales». |
| Recuerdo | Conservar resumen, hecho o preferencia con evidencia. | Una decisión de presupuesto propuesta y revisada antes de confirmar. |
| Persona | Conectar identidades que sabes que pertenecen al mismo humano. | Un editor Google y una identidad del servicio de mensajería; el nombre no basta. |
| Proyecto | Conectar trabajo existente y evidencia bajo un registro de proyecto. | El lanzamiento vinculado con su presupuesto. |
| Tarea | Seguir una acción en lugar de solo etiquetar una fuente. Ver [Tareas](./tasks.md). | Confirmar el presupuesto con un vínculo al documento. |

Etiquetas y notas son organización local: no editan un archivo Google, envían mensajes ni cambian
etiquetas del correo. Proyectos y tareas son registros de trabajo, no comandos de todo conector.
Drive vincula registros existentes; no crea proyectos ni convierte cada elemento etiquetado en tarea.

## Probar con una decisión

```text prompt
Use drive CLI with profile personal to find the budget decision in my imported project documents.
Use tg CLI to find the message discussing it in the history already on this computer.
Show the source links first. Tag the document budget and save a note about the open question.
If the project and person already exist in the same store, show them before adding links.
Do not merge people based only on names or create a task without asking me what the action is.
```

Para historial MAX, sustituye «Use tg CLI» por «Use max CLI». El agente puede leer herramientas
separadas y preparar una respuesta, pero **un vínculo en la base exige ambos registros en la misma
base**. Drive usa una base separada por defecto. [Sus ajustes](./drive/configuration.md) explican
cómo compartirla explícitamente; compartir no combina accesos ni concede permisos remotos.

Comprueba IDs de fuentes y personas. Un vínculo describe una relación; no copia todo el contenido
del destino al documento. Para un hecho reutilizable conserva la fuente y revisa el recuerdo
propuesto. Si el documento cambia, un recuerdo anterior puede quedar obsoleto.

## Carpetas y navegación

Memo registra carpetas locales y subcarpetas; puede etiquetar una subcarpeta importada por su ruta.
Drive elige raíces Google recursivamente y conserva la ascendencia de carpetas para sincronizar.
Su colección actual en la base corresponde a una cuenta: no expone un árbol navegable de Google
ni trata cada carpeta remota como un proyecto local. Usa `drive personal folders list` para las raíces
elegidas y `drive personal files list --parent FOLDER_ID` para contenido remoto, sustituyendo el marcador.

Una carpeta de chats agrupa chats. Es una colección distinta de una carpeta de archivos fuente.
Una etiqueta o proyecto no debe cambiar silenciosamente la carpeta de una fuente.

## Usar cada herramienta para su acción

- [Notas y archivos](./memo/tags.md): importa carpetas locales, etiqueta fuentes y
  escribe notas sobre personas o mensajes guardados.
- [Personas](./people.md): comprueba contexto y conecta identidades conocidas explícitamente.
- [Recetas Google Drive](./drive/recipes.md): etiqueta documentos, vincula registros y revisa recuerdos.
- [Modelo de datos](./data-model.mdx#organizaciones-y-proyectos): relaciones técnicas entre proyectos y tareas.

Empieza con una fuente, una etiqueta útil y una nota. Abre su contexto otra vez para comprobar
registros y vínculos antes de aplicar la misma organización a toda una colección.
