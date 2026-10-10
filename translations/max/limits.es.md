---
title: "Límites, esperas y trabajos en segundo plano"
---

Esta página es necesaria cuando el comando está en espera, se detiene con un error porque las solicitudes son demasiado frecuentes o cuando va a descargar una gran cantidad de historial o ejecutar varios comandos a la vez. Explica con qué frecuencia `max` llama a MAX, por qué a veces espera y qué hacer cuando se detiene. Después de leerlo, sabrás qué es normal esperar, cómo cambiar el ritmo y cuándo volver a intentarlo.

Palabras que aparecen en la página:

- **Ritmo**: peticiones por minuto que el perfil puede enviar a MAX. `max` mantiene cada perfil dentro del límite.
- **Rechazo de MAX**: respuesta «demasiadas peticiones». MAX no publica sus límites y bloquea temporalmente inicios demasiado frecuentes.
- **Tarea en segundo plano**: descarga que continúa después de terminar el comando que la inició.

`max` se detiene ante el error MAX y no vuelve a intentar la solicitud.

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

- **"Demasiadas solicitudes".** El comando se detiene con el código `8` (`rate_limited`). Según la respuesta de MAX, `max` no sabe cuánto tiempo esperar, por lo que no espera ni repite la solicitud. `store fetch` guarda lo que ya se ha descargado y el siguiente ejecución continúa desde el mismo lugar. Espere unos minutos.
- **Inicios de sesión demasiado frecuentes.** MAX rechaza el inicio de sesión y el propio `max` no inicia sesión hasta el final de la pausa: ni el comando, ni `max session start`, ni el servidor en segundo plano. La pausa aumenta con cada rechazo consecutivo: 1 minuto, 5 minutos, 30 minutos, una hora, 6 horas, luego un día; una entrada exitosa lo restablece. Más detalles en [resolución de problemas](./troubleshooting.md).
- **Si MAX todavía llama al tiempo de espera**, esta espera retiene todo el perfil: la siguiente solicitud de cualquier proceso espera su finalización, y el que tiene que esperar más de 5 minutos recibe inmediatamente el código `8` sin enviar nada. `max doctor` muestra lo que se lleva a cabo en la sección `flood`; `max flood clear` se elimina antes de lo previsto si sabe que se ha levantado la restricción.

## Enviar

- **30 envíos por hora** por perfil predeterminado (`sendsPerHour`), en todos los procesos juntos; arriba: falla con el código `8`. Consulte [protección contra mala dirección](./security.md#защита-от-отправки-не-туда).
- `max` no repite el envío propiamente dicho, que puede haber llegado o no: la repetición con el mismo `--send-id` MAX reconoce y no crea un segundo mensaje.

## Descargar el historial

- `store fetch` se desplaza por 30 mensajes, con una pausa de 5 a 10 segundos entre páginas (`--pause`), no más de 1200 mensajes por inicio (`--limit`). Para obtener más detalles, consulte [guía de archivo](./archive.md).
- `messages download --all` realiza una solicitud para cada página y cada archivo; Los archivos también avanzan a un ritmo.
- Las listas de participantes y la reparación de pases en el archivo avanzan al mismo ritmo.

## Trabajos en segundo plano

`store fetch --background` y `store gaps repair --background` inician trabajos que continúan después de que termine el comando: un trabajo por chat, cada uno en su propio proceso y todos con el ritmo compartido del perfil. `max store jobs list` los muestra; `max store jobs cancel <id>` detiene un trabajo después de la página actual.

## Bots

El bot tiene sus propias restricciones de Bot API, independientes de la cuenta. Ante una respuesta 429 con `retry-after`, la lectura se repite una vez después de la pausa solicitada por MAX; El envío no se repite. Ver [bots](./bot.md).

## Un inicio de sesión para todo

`max serve` mantiene una conexión con MAX. Los comandos, `max mcp` y `max watch` la utilizan en lugar de iniciar sesión por separado, por lo que los comandos simultáneos no añaden inicios de sesión. Si el servidor no está en marcha, el comando lo inicia en segundo plano (ajuste `serve`). Tras una desconexión, el servidor vuelve a conectarse con una pausa creciente, de un segundo a un minuto.
