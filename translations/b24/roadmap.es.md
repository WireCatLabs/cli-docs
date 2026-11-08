---
title: "Próximas mejoras"
---

Esta página reúne lo que está previsto para `b24` y todavía no tiene. Léela antes de montar una solución alternativa
para algo que falta: puede que ya esté en camino. El orden es aproximado y puede cambiar. Para proponer algo, abre una
[issue en GitHub](https://github.com/WireCatLabs/bitrix24-cli/issues).

## Qué funciona hoy

`b24` inicia sesión en un portal de Bitrix24 con un webhook entrante. Lee y cambia negociaciones, prospectos,
contactos (`people`) y empresas (`organizations`), mueve y cierra negociaciones y prospectos, y lee embudos, etapas,
productos y empleados (`users`). `fields list` muestra los campos propios del portal con sus opciones. `sync` copia
embudos, empresas, contactos, negociaciones y prospectos al almacén local de WireCat, así que `deals`, `leads`,
`pipelines` y `stages` también funcionan sin conexión, y `search all` busca en ellos. `pipelines show` es el tablero
del embudo de ventas: las negociaciones o los prospectos de cada etapa, con su número y su total en cada moneda.
`deals list`, `leads list`, `people list` y `organizations list` imprimen una página como tabla CSV para una hoja de
cálculo con `--format csv`. `b24 api` llega a cualquier método del portal por su nombre. Todos los comandos están en
la [referencia de comandos](./commands.md).

## Siguiente

- **Contactos y empresas desde el almacén local.** `people` y `organizations` pasan al mismo modelo compartido que las
  negociaciones y los prospectos, así que leen del almacén local y funcionan sin conexión.
- **Campos propios de los contactos guardados en local.** Los valores de los campos propios de tu portal en los
  contactos se guardan con el contacto, para que puedas leerlos sin conexión.

## Más adelante

- **Inicio de sesión con una aplicación local.** Un inicio de sesión OAuth en lugar de un webhook, y una cola de
  eventos del portal, para que `b24` sepa qué cambió sin una pasada completa.
- **Actividades, tareas pendientes y comentarios del historial** en negociaciones, prospectos, contactos y empresas.
- **Presupuestos, facturas inteligentes y procesos inteligentes.**
- **Una comprobación de duplicados antes de crear.** `b24` avisa cuando ya existe un contacto, una empresa o un
  prospecto parecido al nuevo.
- **Importación CSV.** La exportación ya está: `--format csv` en las listas.
- **Una página de negociaciones en la aplicación de escritorio de WireCat.**

Lo que cambió en cada versión publicada está en el [historial de cambios](./changelog.md).
