---
title: "Configuración"
---

Elige la cuenta, almacenamiento y acciones permitidas para trabajar con Drive. Por defecto,
su base está separada del archivo del servicio de mensajería; compartir datos es una decisión explícita.

```sh
drive config show --json
drive --profile work config show --json
drive config set readOnly true --defaults
```

| Ajuste | Propósito |
| --- | --- |
| `--profile NAME` | Seleccionar el perfil de cuenta para esta ejecución. |
| `DRIVE_CONFIG_DIR`, `DRIVE_STATE_DIR`, `DRIVE_CACHE_DIR` | Cambiar ubicaciones de configuración, copias/estado y caché de componentes. |
| `DRIVE_STORE` | Ruta explícita de la base. Haz una copia y usa versiones compartidas compatibles antes de abrirla con otra herramienta. |
| `--read-only` | Bloquear cambios locales y remotos en esta ejecución. |
| `--offline` | Leer la copia local; rechazar sincronización, solicitudes Google y extracción mediante IA. |
| `--json`, `--agent-json` | Salida estructurada; el modo agente muestra caracteres de control visiblemente. |

Para compartir personas, proyectos y mensajes, indica la base compatible que elijas expresamente.
Drive no descubre ni abre bases de otras herramientas automáticamente. Compartir la base no
combina accesos, permisos de Google ni carpetas seleccionadas.

## Extracción opcional mediante IA

Los ajustes compartidos seleccionan proveedor e identificador del componente para extraer recuerdos:

```sh
drive config set models.memories.provider '"openai"' --defaults
drive config set models.memories.model '"YOUR_MODEL_ID"' --defaults
drive config show --json
```

Sustituye `YOUR_MODEL_ID` por el identificador de tu proveedor. Proporciona la clave mediante
su variable de entorno documentada, como `DRIVE_OPENAI_API_KEY`; no la guardes en configuración
ordinaria ni en el chat. Anthropic y endpoints compatibles con OpenAI usan el gateway compartido.
Los parámetros exactos están en [configuración de IA](https://github.com/WireCatLabs/drive-cli/blob/884162b4f1399d21dbd51c61ba68f2443eb86b7e/docs/dev/KNOWLEDGE_AND_API.md#memories-and-ai-extraction)
y [comandos](./commands.md). Sigue con [extracción de recuerdos](./recipes.md#remember-a-source-backed-decision).
