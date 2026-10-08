---
title: "Límites, esperas y trabajos en segundo plano"
---

MAX limita la frecuencia con la que una cuenta puede contactar con él y no publica esos límites. Rechaza las solicitudes demasiado frecuentes y puede bloquear temporalmente los intentos repetidos de inicio de sesión. `max` comparte un mismo ritmo de solicitudes para cada perfil, se detiene cuando MAX rechaza una solicitud y no la repite automáticamente. Esta página reúne esas reglas.

## Un ritmo de solicitudes por perfil

Cada solicitud que `max` realiza en nombre de un perfil, desde un comando, `max mcp`, `max serve` o un trabajo en segundo plano, espera su turno dentro del ritmo compartido de ese perfil:

- Las primeras **10 solicitudes** se ejecutan de inmediato, por lo que los comandos habituales no tienen que esperar.
- Después, **20 solicitudes por minuto**, aproximadamente una cada 3 segundos, hasta que se reponga la capacidad inicial.

**Dos comandos simultáneos comparten un mismo ritmo de solicitudes.** La cola se guarda en un archivo de la carpeta de estado (`pace/<профиль>.json`), por lo que dos terminales, varios trabajos `store fetch --background` y `max serve` se turnan en lugar de funcionar cada uno a máxima velocidad. Cinco descargas en paralelo no van más rápido que las descargas consecutivas ni añaden riesgo. Cada perfil (cada cuenta de MAX) tiene su propio ritmo.

Si un comando debe esperar más de 5 segundos para su turno, lo indica en stderr:

```text
waiting 12 s to keep this profile's pace with MAX
```

Cambia el ritmo de solicitudes en el archivo de configuración o utiliza una variable de entorno para un entorno concreto:

```json
{ "defaults": { "requestsPerMinute": 10 } }
```

```sh
MAX_REQUESTS_PER_MINUTE=10 max store fetch Друзья
```

`0` desactiva la regulación del ritmo. Úsalo solo para un perfil que estés dispuesto a poner en riesgo.

## Cuando MAX rechaza una solicitud

- **«Demasiadas solicitudes».** El comando se detiene con el código `8` (`rate_limited`). La respuesta de MAX no indica a `max` cuánto debe esperar, por lo que no espera ni repite la solicitud automáticamente. `store fetch` conserva el historial descargado y la siguiente ejecución continúa desde el mismo punto. Espera unos minutos.
- **Inicios de sesión demasiado frecuentes.** MAX rechaza el inicio de sesión y `max` no vuelve a intentarlo hasta que termine la pausa: esto se aplica a todos los comandos, a `max session start` y al servidor en segundo plano. Los rechazos consecutivos aumentan la pausa: 1 minuto, 5 minutos, 30 minutos, 1 hora, 6 horas y después 1 día. Un inicio de sesión correcto la restablece. Consulta [troubleshooting.md](./troubleshooting.md) para más detalles.
- **Si MAX indica un tiempo de espera**, se bloquea todo el perfil: la siguiente solicitud de cualquier proceso espera hasta que termine. Si debe esperar más de 5 minutos, devuelve inmediatamente el código `8` sin enviar nada. `max doctor` muestra el bloqueo activo en `flood`; `max flood clear` lo elimina antes de tiempo si sabes que la restricción ya se ha levantado.

## Un inicio de sesión para todo

`max serve` mantiene una conexión con MAX. Los comandos, `max mcp` y `max watch` la utilizan en lugar de iniciar sesión por separado, por lo que los comandos simultáneos no añaden inicios de sesión. Si el servidor no está en marcha, el comando lo inicia en segundo plano (ajuste `serve`). Tras una desconexión, el servidor vuelve a conectarse con una pausa creciente, de un segundo a un minuto.

## Enviar

- **30 envíos por hora** por perfil de forma predeterminada (`sendsPerHour`), compartidos entre todos los procesos. Si se supera el límite, se devuelve el código `8`. Consulta [security.md](./security.md).
- `max` no repite automáticamente un envío cuya entrega es incierta. MAX reconoce un reintento con el mismo `--send-id` y no crea un segundo mensaje (comprobado con un reintento después de 15 minutos).

## Descargar el historial

- `store fetch` descarga páginas de 30 mensajes, con una pausa de 5 a 10 segundos entre páginas (`--pause`), hasta 1200 mensajes por ejecución (`--limit`). Consulta [archive.md](./archive.md) para más detalles.
- `messages download --all` realiza una solicitud por cada página y cada archivo; las solicitudes de archivos también siguen el ritmo compartido.
- Las listas de miembros y las reparaciones de huecos del archivo siguen el mismo ritmo de solicitudes.

## Trabajos en segundo plano

`store fetch --background` y `store gaps repair --background` inician trabajos que continúan después de que termine el comando: un trabajo por chat, cada uno en su propio proceso y todos con el ritmo compartido del perfil. `max store jobs list` los muestra; `max store jobs cancel <id>` detiene un trabajo después de la página actual.

## Bots

Los bots tienen sus propios límites de la Bot API, independientes de los límites de las cuentas. Tras una respuesta 429 con `retry-after`, una solicitud de lectura se repite una vez después de la pausa indicada por MAX; los envíos no se repiten. Consulta [bot.md](./bot.md).
