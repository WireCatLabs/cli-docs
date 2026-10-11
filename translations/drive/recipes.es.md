---
title: "Peticiones útiles"
---

Usa estas peticiones tras importar tus carpetas. Cada una genera algo comprobable: enlaces a
fuentes, contexto local guardado o una vista previa antes de un cambio remoto.

## Preparar una reunión del proyecto

```text prompt
Use drive CLI to find the latest budget and launch decisions in my imported documents.
Prepare a short meeting brief with open questions and source links.
Check sync status and tell me about skipped sources. Do not change Google files.
```

El agente busca en la copia disponible y lee los documentos encontrados. Abre los enlaces para
comprobar las decisiones; un resumen no puede incluir archivos incompatibles o no importados.

## Vincular un documento con una persona o proyecto

```text prompt
Use drive CLI to show the people observed on this document and its existing links.
Link it to the stored project and person I select, then show the saved context.
Do not merge people merely because their names match.
```

Los vínculos manuales usan una referencia devuelta por la misma base, no un ID inventado:

```sh
drive people list DOC_ID --json
drive links add DOC_ID project:PROJECT_ID --kind related-to
drive links add DOC_ID person:PERSON_ID --kind about
drive documents context DOC_ID --json
```

Drive vincula registros existentes; no crea proyectos ni tareas. Para combinar mensajes y
documentos, configura primero una base compartida explícita. Bases separadas no comparten IDs.
Consulta [configuración](./configuration.md) y [organizar fuentes](https://wirecat.dev/en/docs/organize).

## Recordar una decisión con su fuente

```text prompt
Use drive CLI to propose a few reusable facts from this imported document.
Show exact supporting quotes. Let me review them before saving or confirming anything.
```

Con un proveedor de IA configurado:

```sh
drive memories extract DOC_ID --scope work
drive memories extract DOC_ID --scope work --save
```

El primer comando muestra propuestas; `--save` guarda recuerdos propuestos, no hechos confirmados.
La extracción envía texto local seleccionado al proveedor configurado. La búsqueda por palabras
y vectores no requiere esta generación externa de texto. Consulta [ajustes](./configuration.md)
antes de activarla.

## Usar un cliente MCP local

Para un agente sin terminal, configura un servidor MCP stdio con ejecutable `drive` y argumentos
`--read-only mcp`. La herramienta y la cuenta deben estar en el ordenador que lo ejecuta.

```sh
drive --read-only mcp --tools --json
drive --read-only mcp
```

Expone las herramientas de lectura permitidas del mismo árbol de comandos. No es un endpoint
HTTP alojado para conectores de navegador. Consulta [comandos](./commands.md) para las operaciones exactas.
