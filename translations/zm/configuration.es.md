---
title: "Configuración"
---

Los ajustes que lee `zm` y las variables que cambian dónde guarda los datos.

## Ajustes

Configura con `zm config set <key> <value>` y consulta los valores con `zm config show`.

| Clave | Significado |
|---|---|
| `zoom.clientId` | Public Client ID de [tu aplicación de Zoom](./zoom-app.md) |
| `account.profile` | etiqueta del [perfil local](./sessions.md#select-a-local-profile) que agrupa reuniones |
| `source` | origen de `pull` y `watch`: `api` o `files` |
| `files.folder` | carpeta de transcripciones para el origen de archivos y su seguimiento |
| `files.timezone` | zona IANA de los nombres de archivos, como `Europe/Madrid`; UTC por defecto |

Una configuración incorrecta permite `--help` y `--version`; los comandos de configuración indican el error.

## Variables de entorno

| Variable | Efecto |
|---|---|
| `ZM_CONFIG_DIR` | cambia el directorio de configuración y el servicio del llavero para el acceso |
| `MESSAGING_STORE` | ruta explícita de la base compartida para importar, descargar, observar y leer mediante CLI o MCP |
| `OPENAI_API_KEY` | para un endpoint OpenAI elegido explícitamente ([búsqueda por significado](./topic-search.md)) |

Los demás directorios siguen la plataforma. La base compartida predeterminada es `wirecat.db`
([dónde se guardan las reuniones](./archive.md#where-meetings-are-stored)).
