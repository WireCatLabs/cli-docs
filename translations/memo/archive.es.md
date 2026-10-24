---
title: "Mantener Memo al día"
---

Esta página te ayuda a mantener Memo actualizado sin tener que pensar en ello. Un solo comando trae
lo que cambió en tus carpetas de notas y buzones de correo, y en Linux un temporizador puede
ejecutarlo por ti cada pocos minutos. Solo se lee lo que cambió, así que cada ejecución después de la
primera es rápida.

## Importar lo que cambió

```sh
memo sync
```

Esto importa todas las carpetas y cuentas de correo del [archivo de configuración](./configuration.md).
Informa de lo que encontró en cada una:

```text
notes /path/to/notes: 24 notes, 2 changed, 0 moved, 0 gone
```

| Opción | Qué hace |
|---|---|
| `--only notes` | Solo carpetas de notas |
| `--only mail` | Solo cuentas de correo |
| `--no-embed` | Omite la preparación para la búsqueda por significado |

Los mensajes de Telegram y MAX los mantienen al día tg y max, no `memo sync`.

## Importar con un temporizador (Linux)

```sh
memo jobs start --every 5m   # sync every 5 minutes, starting a minute from now
memo jobs status             # whether the timer is on, when it runs next and how the last run ended
memo jobs stop               # stop and remove the timer
```

Mientras fallen las ejecuciones del temporizador, cada comando memo escribe una línea en stderr con el inicio del fallo, el número de ejecuciones y la causa. `memo jobs status` muestra lo mismo en `failing`. La línea desaparece tras una ejecución correcta. La causa contiene el código de error, su identificador de motivo y el tipo de fuente (`notes: configuration_error (folder.unbound)`), nunca el texto del error, que puede revelar una carpeta o un asunto. El mensaje completo queda en el registro del temporizador, `journalctl --user -u memo-import.service`, indicado por `memo jobs status`.

`--every` acepta `90s`, `5m`, `1h`, etc.; el intervalo más corto es un minuto. El temporizador usa
systemd, el gestor de servicios de la mayoría de los sistemas Linux. En macOS y Windows, ejecuta
`memo sync` tú mismo o desde tu propio programador de tareas.

El temporizador ejecuta `memo sync` con los ajustes de la terminal desde la que lo activaste, así que
encuentra Himalaya y tus contraseñas de la misma forma. `memo jobs start` y `stop` escriben `auto` en el
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
