---
title: "Resolver conexión o búsqueda vacía"
---

Usa esta página si falta la herramienta, Google rechaza el acceso o no aparece un documento.
Comprueba el paso que falla antes de cambiar de cuenta o ampliar permisos.

| Síntoma | Qué hacer |
| --- | --- |
| No se encuentra `drive` | Reabre la terminal/agente, comprueba que sigue existiendo el repositorio y repite [instalación](./installation.md). |
| Google bloquea el acceso | Revisa cliente Desktop, APIs, consentimiento y usuario de prueba. Usa la cuenta añadida a la aplicación. |
| El acceso ha caducado | Ejecuta `session start` otra vez con tu archivo. Los permisos External Testing suelen caducar a los siete días. |
| No hay llavero del sistema | Conecta con `--credential-storage file` explícito si el almacenamiento privado en archivo es adecuado. |
| Búsqueda vacía | Ejecuta `status`, comprueba raíces con `folders list` y luego `sync`. Prueba una palabra conocida con `search --exact`. |
| Se omitió un archivo | Revisa tipo y permiso de descarga. Se admiten Google Docs y Markdown/TXT; PDF, Office, Sheets, Slides y accesos directos no se importan. |
| Sync se detuvo con errores | Repítelo: se reanuda el trabajo pendiente. No trates una importación parcial como completa. |
| Falta el componente de búsqueda semántica | Prepara la caché compartida según [búsqueda](./search.md#search-by-meaning) o usa `--exact`. |
| No se encuentra el destino del vínculo | Usa una referencia de la base seleccionada. Comprueba el almacenamiento compartido antes de vincular personas/proyectos del servicio de mensajería. |

```sh
drive status --json
drive folders list --json
drive sync --json
drive search 'known word' --exact --json
```

Al pedir ayuda, comparte el código de error sin datos privados y el comando. No incluyas JSON
del cliente, tokens ni texto privado. Cuando aparezca la fuente, vuelve a [búsqueda](./search.md).
