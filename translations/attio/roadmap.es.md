---
title: "Próximas mejoras"
---

Mira qué hace `attio` hoy y qué viene después, antes de montar una solución alternativa para algo que le falta. Puede
que ya esté en camino.

Sabrás con qué partes de tu espacio de trabajo de Attio puede trabajar ya un agente, y cuáles llegan en las próximas
versiones. El orden es aproximado y puede cambiar. Para proponer algo, abre una
[issue en GitHub](https://github.com/WireCatLabs/attio-cli/issues).

**En esta página:**

1. [Qué funciona hoy](#what-works-today)
2. [Siguiente](#next)
3. [Más adelante](#later)

## Qué funciona hoy

`attio` inicia sesión en un espacio de trabajo de Attio con un token de acceso. `sync` copia las negociaciones del
espacio de trabajo, y las personas y empresas que aparecen en ellas, en el almacén local de WireCat, con las etapas
del embudo de negociaciones, así que `deals`, `pipelines`, `stages` y `changes` funcionan sin conexión, y `search all`
encuentra negociaciones junto a tus mensajes, notas y reuniones. `pipelines show` es el tablero del embudo: las
negociaciones de cada etapa, su número, su suma por moneda y la proporción de ganadas. `changes list` muestra las
negociaciones creadas, movidas, ganadas y perdidas, y `--format report` lo convierte en un resumen. `fields list`
muestra los atributos propios del espacio de trabajo. Con el ajuste `activities` activado, la copia guarda también
las notas y tareas de sus negociaciones, personas y empresas. `people`, `organizations` y `users` leen Attio en
directo. `deals` crea, cambia, mueve y cierra negociaciones, y `people` crea y cambia personas, y cada cambio te
pregunta antes. Las listas se exportan a CSV con `--format csv`. `attio work api` llega a cada operación de la API de Attio. Todos los
comandos están en la [referencia de comandos](./commands.md).

## Siguiente

- **Añadir notas y tareas.** Añadir una nota o una tarea a una negociación, una persona o una empresa con su propio
  comando. Leerlas ya está en la copia.
- **Iniciar sesión con un clic.** Iniciar sesión a través de Attio en el navegador, en lugar de crear un token a mano.

## Más adelante

- **Objetos personalizados y listas.** Los objetos propios de tu espacio de trabajo y sus listas, copiados como las
  negociaciones.
- **Los webhooks de Attio.** Saber qué cambió en el momento en que pasa, sin una sincronización completa.

Lo que cambió cada versión publicada está en el [historial de cambios](./changelog.md).
