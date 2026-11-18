---
title: "Próximas mejoras"
---

Mira qué hace `b24` hoy y qué viene después, antes de montar una solución alternativa para algo que le falta. Puede
que ya esté en camino.

Sabrás con qué partes de tu Bitrix24 puede trabajar ya un agente, y cuáles llegan en las próximas versiones. El orden
es aproximado y puede cambiar. Para proponer algo, abre una
[issue en GitHub](https://github.com/WireCatLabs/bitrix24-cli/issues).

**En esta página:**

1. [Qué funciona hoy](#what-works-today)
2. [Siguiente](#next)
3. [Más adelante](#later)

## Qué funciona hoy

`b24` inicia sesión en un portal de Bitrix24 con un webhook entrante, o con una aplicación local que creas en el
portal. Lee y cambia negociaciones, prospectos,
contactos (`people`) y empresas (`organizations`), mueve y cierra negociaciones y prospectos, y lee embudos, etapas,
productos y empleados (`users`). `fields list` muestra los campos propios del portal con sus opciones. `sync` copia
embudos, empresas, contactos, negociaciones y prospectos al almacén local de WireCat, así que `deals`, `leads`,
`pipelines` y `stages` también funcionan sin conexión, y `search all` busca en ellos. También guarda quién es quién:
los contactos como miembros de sus empresas, los contactos y responsables de las negociaciones, y los empleados de tu
propia empresa con su línea jerárquica. `pipelines show` es el tablero
del embudo de ventas: las negociaciones o los prospectos de cada etapa, con su número y su total en cada moneda.
`deals list`, `leads list`, `people list` y `organizations list` imprimen una página como tabla CSV para una hoja de
cálculo con `--format csv`. `schedule` ejecuta `sync` con un temporizador. `changes list` muestra qué cambió en la copia, y `--format
report` lo convierte en un resumen matutino. Con `activities` activado, la sincronización también lee las llamadas, los correos,
las tareas pendientes, las tareas y los comentarios de negociaciones y prospectos. `meetings sync` copia las llamadas
del portal, `meetings transcribe` convierte sus grabaciones en texto en este ordenador, y `calls export` escribe en
Bitrix24 las llamadas de otros sistemas telefónicos. `b24 api` llega a cualquier método del portal por su nombre.
Todos los comandos están en la [referencia de comandos](./commands.md).

## Siguiente

- **Contactos y empresas desde el almacén local.** `people` y `organizations` pasan al mismo modelo compartido que las
  negociaciones y los prospectos, así que leen del almacén local y funcionan sin conexión.
- **Campos propios de los contactos guardados en local.** Los valores de los campos propios de tu portal en los
  contactos se guardan con el contacto, para que puedas leerlos sin conexión.
- **Archivos y documentos de clientes.** Los archivos de las negociaciones y sus adjuntos, y los documentos creados con
  las plantillas del portal. La configuración ya pide los permisos `disk` y `documentgenerator` que necesitan.

## Más adelante

- **Eventos del portal.** Una cola de eventos del portal, para que `b24` sepa qué cambió sin una pasada completa.
- **Actividades, tareas pendientes y comentarios del historial en contactos y empresas.** Los de negociaciones y
  prospectos ya se leen.
- **Presupuestos, facturas inteligentes y procesos inteligentes.**
- **Una comprobación de duplicados antes de crear.** `b24` avisa cuando ya existe un contacto, una empresa o un
  prospecto parecido al nuevo.
- **Importación CSV.** La exportación ya está: `--format csv` en las listas.
- **Una página de negociaciones en la aplicación de escritorio de WireCat.**

Lo que cambió en cada versión publicada está en el [historial de cambios](./changelog.md).
