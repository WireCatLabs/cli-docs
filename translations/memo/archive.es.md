---
title: "Mantener Memo al día"
---

Esta página te ayuda a mantener Memo actualizado sin tener que pensar en ello. Un solo comando trae
lo que cambió en tus carpetas de notas y buzones de correo, y en Linux un temporizador puede
ejecutarlo por ti cada pocos minutos. Solo se lee lo que cambió, así que cada ejecución después de la
primera es rápida.

## Importar lo que cambió

```sh
memo import
```

Esto importa todas las carpetas y cuentas de correo del [archivo de configuración](./configuration.md).
Informa de lo que encontró en cada una:

```text
notes /path/to/notes: 24 notes, 2 changed, 0 moved, 0 gone
```

| Opción | Qué hace |
|---|---|
| `--notes` | Solo carpetas de notas |
| `--mail` | Solo cuentas de correo |
| `--no-embed` | Omite la preparación para la búsqueda por significado |

Los mensajes de Telegram y MAX los mantienen al día tg y max, no `memo import`.

## Importar con un temporizador (Linux)

```sh
memo auto on --every 5m     # import every 5 minutes, starting a minute from now
memo auto status            # whether the timer is on, when it runs next and how the last run ended
memo auto off               # stop and remove the timer
```

`--every` acepta `90s`, `5m`, `1h`, etc.; el intervalo más corto es un minuto. El temporizador usa
systemd, el gestor de servicios de la mayoría de los sistemas Linux. En macOS y Windows, ejecuta
`memo import` tú mismo o desde tu propio programador de tareas.

El temporizador ejecuta `memo import` con los ajustes de la terminal desde la que lo activaste, así que
encuentra Himalaya y tus contraseñas de la misma forma. `memo auto on` y `off` escriben `auto` en el
archivo de configuración; si lo editas allí, el temporizador lo sigue en su siguiente ejecución.

## Qué lee una importación

- Un archivo de nota con el mismo tamaño y la misma hora de cambio que la vez anterior no se lee.
- El texto que ya está en el almacén local no se guarda de nuevo, así que un segundo ordenador que
  importa la misma carpeta no añade nada nuevo.
- El correo que ya está guardado se omite.
- Dos importaciones nunca se ejecutan a la vez, y si una fuente falla, no detiene a las demás.

[Cómo funciona Memo](./how-it-works.md#what-an-import-does) explica qué pasa con los archivos editados,
movidos y borrados.

Siguiente: [buscar lo que importaste](./search.md).
