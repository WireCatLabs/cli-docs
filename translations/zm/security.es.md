---
title: "Seguridad"
---

Elige los datos que puede leer el agente y dónde se procesan. Autorización Zoom, almacenamiento local
y procesamiento IA tienen límites separados: autorizar la app no envía por sí solo texto a un servicio
IA. Esta guía los explica antes de conectar o archivar.

## Credenciales

- `zm` usa una app configurada con Public Client OAuth. Zoom puede mostrar su Client Secret,
  pero la herramienta no lo pide ni usa. Configura solo el Public Client ID.
- El login usa PKCE y comprueba el estado. La página estática
  [wirecat.dev/zoom-callback](https://wirecat.dev/zoom-callback) pasa el retorno a `zm`; no sirve
  sin la clave de verificación que queda en el equipo.
- Los tokens solo van al almacén del sistema, no a la configuración. Si no está disponible, hay error.
- El receptor se cierra al completar, fallar o caducar el login.

## Qué se envía por la red

- API de Zoom para acceso, descargas, grabaciones y operaciones remotas. `--offline` rechaza la red.
- Un endpoint remoto de vectores, solo al indicar `--base-url` ([búsqueda por significado](./topic-search.md)).
- Metadatos, ayuda, configuración y `recordings archive` funcionan sin conectar la cuenta.

## Qué queda en disco

- Reuniones en la base compartida (`wirecat.db`), salvo otra ruta en `MESSAGING_STORE`.
- Manifiestos con metadatos, tamaños y SHA-256, sin URLs de descarga firmadas ni tokens OAuth.
- Trabajos con perfil, client ID público, destino y rutas, sin credenciales.
- La salida diagnóstica omite el texto original de errores del proveedor.

## Qué pueden los agentes

- MCP solo lee: no escribe exportaciones ni cambios remotos, ni genera vectores o crea tareas.
  Las lecturas de reuniones usan el perfil de Zoom elegido.
- La preparación opcional también puede leer cuentas de mensajes/correo y carpetas de documentos
  que [selecciones explícitamente para ese perfil](./configuration.md#select-communications-for-preparation).
  El permiso cubre toda la cuenta o carpeta; solo se resuelven y consultan los ID solicitados.
  Reinicia MCP tras cambiar o revocar selecciones. La preparación abre el almacén existente
  compatible en modo de solo lectura, sin migraciones ni mantenimiento del índice.
- La transcripción local usa un componente instalado en el equipo y no descarga ninguno.
- Cambios remotos, vínculos, transcripción, trabajos, generación explícita mediante `meetings embeddings` y recuperación primero muestran un plan
  y requieren `--yes`; `--dry-run` prevalece donde está disponible. Las escrituras remotas no se reintentan.
- La búsqueda de palabras actualiza su índice automáticamente. Con `--model` genera los vectores que
  faltan antes de ordenar; un `--base-url` remoto recibe pasajes de transcripción además de la consulta.
- Proponer una tarea no la crea.
- `ZM_READ_ONLY=1` deja que una ejecución lea y copie, sin cambiar nada, como `TG_READ_ONLY` en tg, max y wa.
  Se rechaza con código 5 antes de conectar con nada, vistas previas incluidas: cambios remotos de reuniones,
  acceso, configuración, instalación del skill, importación, exportación, vínculos, transcripción, trabajos de
  archivo y recuperación de bloqueos, creación de vectores (`meetings embeddings`, búsqueda por significado con
  `--model`) y un servidor MCP cuyas consultas semánticas van a un `--base-url` remoto. Siguen funcionando: lecturas,
  búsqueda de palabras (que mantiene su índice al día), `batch`, `serve --mcp` y las sincronizaciones que copian
  Zoom al almacén o a un archivo: `meetings sync`, `watch`, `recordings sync`, `recordings download` y
  `recordings schedule run`; una sincronización o `watch` desde una fuente de archivos lee la carpeta configurada,
  mientras que `meetings import <folder>` nombra una carpeta puntual y se rechaza. Cualquier otro comando que
  escriba, incluido uno añadido en una versión posterior, se rechaza. Actívalo para un agente que solo deba leer; `0` o un valor vacío
  lo desactivan.

Una app IA puede enviar los resultados a su propio proveedor. Elige app y política por separado
de la autorización Zoom. Un servicio remoto de vectores recibe texto y consultas solo cuando se
selecciona explícitamente; la ejecución local queda en el equipo. Archivos y base siguen conteniendo
datos sensibles aunque los manifiestos omitan tokens.

Para retirar acceso Zoom, [revoca la autorización](./sessions.md#remove-access). Para controlar lo
que solicita una app, elige [instrucciones CLI o MCP de lectura](./mcp.md).
