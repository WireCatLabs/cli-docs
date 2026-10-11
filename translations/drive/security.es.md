---
title: "Datos y permisos"
---

Comprende qué lee Drive, qué permanece en tu ordenador y qué operaciones cambian Google.
Elige solo el acceso y las carpetas necesarios para la tarea.

El permiso predeterminado es `drive.readonly` para toda la cuenta. Las carpetas elegidas limitan
la importación, no los permisos de Google. Sync lee archivos y guarda Markdown local,
metadatos/respuestas originales, texto indexado y vectores opcionales.

Los tokens utilizan el llavero del sistema salvo elección explícita de archivo privado.
Copias y configuración tienen permisos de archivo privados. Etiquetas, notas y recuerdos son
registros locales: no editan un documento Google ni notifican a sus editores.

La extracción de recuerdos envía texto local elegido al proveedor de IA configurado. Es una
operación explícita con vista previa antes de guardar propuestas. Un agente con terminal o MCP
también puede enviar resultados a su proveedor: considera sus ajustes por separado.

Las ediciones remotas requieren volver a conectar con `session start --write`. La eliminación
permanente tiene controles adicionales. Usa `--read-only` para inspeccionar datos. Los roles
y políticas de Google siguen vigentes; un control local no regula acciones fuera de la herramienta.

`drive personal session end` elimina el acceso local pero conserva documentos y configuración. Revoca
la aplicación en tu cuenta de Google para retirar su acceso. Antes de borrar datos locales,
identifica las carpetas y base de esta herramienta; no elimines una base compartida con otros tools.
Consulta [configuración](./configuration.md) antes de cambiar el almacenamiento.
