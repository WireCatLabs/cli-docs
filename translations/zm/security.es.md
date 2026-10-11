---
title: "Seguridad"
---

Qué guarda `zm` en disco, qué envía por la red y qué acciones no realiza.

## Credenciales

- `zm` usa tu aplicación de Zoom con Public Client OAuth, sin secreto de cliente.
- El acceso comprueba PKCE y state. [wirecat.dev/zoom-callback](https://wirecat.dev/zoom-callback) es una página
  estática que pasa la respuesta a `zm`; sin el verifier que queda en el equipo, la respuesta no sirve.
- Los tokens solo están en el llavero, nunca en la configuración. Sin llavero aparece un error.
- El listener se cierra tras éxito, fallo o vencimiento.

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

- MCP solo lee la cuenta elegida: no escribe exportaciones ni cambios remotos, ni genera vectores o crea tareas.
- La transcripción local usa un componente instalado en el equipo y no descarga ninguno.
- Cambios remotos, vínculos, indexación, transcripción, trabajos, vectores y recuperación primero muestran un plan
  y requieren `--yes`; `--dry-run` prevalece donde está disponible. Las escrituras remotas no se reintentan.
- Proponer una tarea no la crea.
