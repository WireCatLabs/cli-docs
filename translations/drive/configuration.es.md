---
title: "Configuración"
---

Elige almacenamiento y acciones permitidas según tu uso de Drive. Por defecto, su base está
separada del archivo del servicio de mensajería; compartir datos es una decisión explícita.

```sh
drive personal config show --json
drive work config show --json
drive personal config set readOnly true --defaults
```

| Ajuste | Propósito |
| --- | --- |
| `drive NAME …` o `--profile NAME` | Selección explícita obligatoria. `DRIVE_PROFILE` y el antiguo `defaultProfile` no seleccionan cuenta. |
| `DRIVE_CONFIG_DIR`, `DRIVE_STATE_DIR`, `DRIVE_CACHE_DIR` | Ubicaciones de configuración, copias/estado y caché de herramienta. |
| `CLI_COMMON_CACHE_DIR` | Caché compartida de búsqueda; usa el mismo ajuste al descargar y generar vectores. |
| `DRIVE_STORE` | Ruta explícita de la base. Haz una copia y usa versiones compartidas compatibles antes de abrir con otra herramienta. |
| `--read-only` | Bloquear cambios locales y remotos para esta ejecución. |
| `--offline` | Lecturas locales; rechaza sync, Google y extracción IA. |
| `--json`, `--agent-json` | Salida estructurada; modo agente muestra controles visiblemente. |

Para compartir personas/proyectos/mensajes, indica explícitamente una base compatible. Drive no
descubre ni abre automáticamente otra base. Compartirla no combina accesos, permisos ni carpetas.

## Extracción opcional mediante IA

Los ajustes compartidos seleccionan proveedor e identificador del componente para extraer recuerdos:

```sh
drive personal config set models.memories.provider '"openai"' --defaults
drive personal config set models.memories.model '"YOUR_MODEL_ID"' --defaults
drive personal config show --json
```

Sustituye `YOUR_MODEL_ID` por el identificador del proveedor. Proporciona su clave mediante la
variable documentada, como `DRIVE_OPENAI_API_KEY`; no la guardes en configuración ni en el chat.
Anthropic y endpoints compatibles OpenAI usan el gateway compartido. Consulta
[configuración de IA](https://github.com/WireCatLabs/drive-cli/blob/2ec12e20c9a2dc192076287c56f2e84de41cf8e5/docs/dev/KNOWLEDGE_AND_API.md#memories-and-ai-extraction) y
[comandos](./commands.md). Sigue con [extracción de recuerdos](./recipes.md#remember-a-source-backed-decision).
