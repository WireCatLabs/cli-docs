---
title: "Límites, esperas y trabajos en segundo plano"
---

Utilice esta página cuando un comando espera, se detiene con un error de límite de velocidad o cuando planea descargar una gran cantidad de historial o ejecutar varios comandos a la vez. Explica qué tan rápido `tg` habla con Telegram, por qué a veces espera y qué hacer cuando se detiene. Al final sabrás qué esperas son normales, cómo cambiar el ritmo y cuándo volver a intentarlo.

Palabras que utiliza esta página:

- **Ritmo**: cuántas solicitudes puede enviar un perfil a Telegram por minuto. `tg` mantiene todos los perfiles debajo.
- **FLOOD_WAIT**: Respuesta de Telegram "espera N segundos". Si sigues preguntando durante la espera, las esperas crecen.
- **Límite de spam** (PEER_FLOOD): Telegram limita una cuenta que escribe a demasiados extraños.
- **Trabajo en segundo plano**: una descarga que continúa ejecutándose después de que finaliza el comando que la inició.

`tg` espera esperas cortas de Telegram y se detiene cuando la espera es larga.

## El ritmo: un cupo por perfil

Cada solicitud que `tg` hace para un perfil —desde un comando, `tg mcp`, `tg serve` o un trabajo en segundo plano—
usa el mismo ritmo regulado de ese perfil:

- una ráfaga de **20 solicitudes** se ejecuta de inmediato, por lo que los comandos habituales no esperan;
- después de la ráfaga, **una solicitud por segundo** (60 por minuto), hasta que el cupo se reponga durante la inactividad.

**Dos comandos simultáneos comparten el mismo ritmo.** Los turnos se guardan en un archivo dentro de la carpeta de estado
(`pace/<profile>.json`), por lo que dos terminales, varios trabajos `store fetch --background` y `serve` se ponen
en la misma cola en lugar de ejecutarse cada uno a toda velocidad. Ejecutar cinco descargas en paralelo no es más rápido
que ejecutarlas una tras otra, ni implica más riesgo. Los distintos perfiles —distintas
cuentas de Telegram— tienen su propio ritmo.

Un comando que tenga que esperar más de 5 segundos para su turno lo indica en stderr:

```text
waiting 12 s to keep this profile's pace with Telegram
```

Cambia el ritmo en el archivo de configuración o, para una sesión del intérprete de comandos, con una variable de entorno:

```json
{ "defaults": { "requestsPerMinute": 30 } }
```

```sh
TG_REQUESTS_PER_MINUTE=30 tg store fetch "Book club"
```

`0` desactiva la regulación del ritmo. Hazlo solo para un perfil cuya cuenta puedas permitirte que Telegram limite.

## Cuando Telegram pide esperar

| Cuánto tiempo pide esperar Telegram | Qué hace `tg` |
|---|---|
| hasta 10 s, en un comando que se ejecuta una vez | espera como máximo dos veces y lo indica en stderr |
| hasta 2 min, en `serve` y `watch` | espera como máximo tres veces |
| más tiempo | se detiene con el código de salida `8` (`rate_limited`) y `retryAfterMs` en el JSON |

`store fetch` y `messages download --all` esperan hasta 5 minutos entre páginas y continúan;
una espera más larga detiene la ejecución, y la siguiente continúa desde lo que ya se ha guardado.

**Una espera bloquea todo el perfil.** Hasta que termine, la siguiente solicitud de cada proceso espera a que finalice; una solicitud
que tendría que esperar más de 5 minutos falla de inmediato con el código de salida `8`, sin consultar Telegram.
`tg doctor` y `tg server status` muestran en `flood` qué está bloqueado. Cuando termina la espera, no hace falta
hacer nada; `tg flood clear` la levanta antes si sabes que Telegram ya no limita la cuenta.

## Operaciones de escritura

- **30 envíos por hora** por perfil de forma predeterminada (`sendsPerHour`), contados en todos los procesos; ver [el control de envío](./security.md#the-send-guard).
- **Límite de spam (PEER_FLOOD)** y una cuenta congelada retiene cada escritura; Lee todavía funciona. Consulte [solución de problemas](./troubleshooting.md).
- `tg` nunca repite un envío que puede haber llegado o no; ver [cuando se desconoce el resultado](./usage.md#when-the-outcome-is-unknown).

## Lecturas masivas

- `store fetch`: páginas de hasta 100 mensajes, `--pause` entre páginas (1 s de forma predeterminada), 1000 mensajes por
  ejecución salvo que `--limit` indique otra cantidad. `--estimate` calcula primero las solicitudes y no envía ninguna.
- `messages download --all`: una solicitud por página y por archivo; las descargas de archivos también siguen el ritmo regulado.
- `chats members list --all`, `chats list --all` y la reparación de lagunas siguen el mismo ritmo regulado.

## Trabajos en segundo plano

`store fetch --background` y `store gaps repair --background` inician un trabajo que dura más que el comando: un trabajo por chat a la vez, cada uno en su propio proceso, todo al mismo ritmo del perfil. `tg store jobs
list` los muestra, `tg store jobs cancel <job>` se detiene uno después de su página actual. Consulte [descarga en segundo plano](./archive.md#in-the-background).

## Bots

Los propios límites de Bot API de un bot son independientes de los de la cuenta. `tg` respeta los envíos de Telegram `retry_after`; uno largo termina la ejecución. Ver [bots](./bot.md).

## Un inicio de sesión, varios procesos

Cada proceso `tg` abre su propia conexión con la sesión del perfil. Varios pueden funcionar a la vez, pero cada
uno genera solicitudes para la misma cuenta; por eso comparten el ritmo.
