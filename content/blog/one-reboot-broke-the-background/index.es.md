---
title: Qué necesita un servicio en segundo plano para sobrevivir al reinicio del portátil
description: Mi portátil se reinició de noche, y cada pieza en segundo plano de un CLI local-first falló a su manera. Lo que tuve que arreglar para que el servicio y las tareas programadas en un escritorio sobrevivan a un reinicio y a un keyring bloqueado.
date: 2026-11-02
tags: [cli, telegram]
cover: ./cover.jpg
coverAlt: "Un portátil de noche sobre una mesa oscura con la pantalla apagada, rodeado de pequeñas máquinas de latón con engranajes que se han detenido, un candado cerrado delante y un tubo fino de cristal partido en dos entre ellas"
author: viacheslav-ptsarev
draft: false
---

En la noche del 1 al 2 de noviembre mi portátil se reinició, y por la mañana no funcionaba nada en segundo plano. No sé por qué se reinició. Los servicios de tg y max no arrancaron, las sincronizaciones completas de la noche fallaron, y una sincronización lanzada a mano por la mañana murió justo después del comando que la lanzó. Todo falló de forma distinta, y el problema nunca estuvo en el código de la sincronización.

El segundo plano en WireCat son 2 cosas. `serve` mantiene la conexión con el mensajero y escribe los mensajes nuevos en el archivo local, es un servicio de usuario de systemd (un LaunchAgent en Mac). Y las tareas programadas, por ejemplo una sincronización completa una vez al día por la noche, que es un timer de systemd. Parece simple, pero esa noche se rompieron 4 sitios distintos, y cada uno tiene su sección abajo.

Esa noche yo dormía y un agente de IA estaba terminando la app de escritorio. Sobre las 06:30 vio que los servicios estaban parados y los arrancó a mano, y las sincronizaciones completas también. A partir de ahí los agentes lanzaron los comandos y escribieron las correcciones, y yo los dirigía y decidía qué arreglar y cómo.

## El servicio que nadie habilitó

`tg personal server install` escribía el archivo de la unit en `~/.config/systemd/user/` y ahí se quedaba. A una persona le mostraba una pista de cómo arrancar el servicio ahora y cómo habilitarlo al iniciar sesión (`systemctl --user enable ...`). Pero muchas veces quien instala el servicio no es una persona, sino un agente de IA o la app de escritorio, y leen JSON, donde esa pista no está. Así que la unit estaba en el disco y `systemctl --user is-enabled` decía disabled.

systemd no tiene la culpa, hace justo lo que dice la documentación: [`enable`](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html#enable%20UNIT%E2%80%A6) crea los enlaces simbólicos de la sección `[Install]` y no arranca nada. Y sin el enlace el servicio no arranca después de un reinicio.

Y esto ya lo habíamos visto. En octubre pasó lo mismo con el CLI de WhatsApp, entonces habilité su unit a mano, y en las notas quedó "cli-core debería habilitarla en install", y nadie se puso con ello antes de este reinicio.

Ahora `server install` escribe el archivo, ejecuta `daemon-reload` y `enable`, y sigue sin arrancar nada. En Mac es lo mismo con `launchctl enable`, y el plist ya no tiene `Disabled`. `server uninstall` primero deshabilita la unit y luego borra el archivo. Y `server status` responde `starts_at_login`, así que tanto una persona como la app de escritorio ven de antemano si el servicio volverá después de un reinicio. Los tests lo cubren, pero con un reinicio de verdad todavía no lo he comprobado.

Una unit de una copia de trabajo (una build de una rama con sus propias carpetas de configuración y datos) la dejo sin habilitar a propósito, solo se escribe en el disco. Los agentes lanzan builds así todo el rato, y no quiero para nada que una rama cualquiera arranque en cada inicio de sesión y lea mi keyring.

## El timer llegó antes que yo

La sincronización completa es un timer con `OnCalendar=` y [`Persistent=true`](https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html#Persistent=). Según la documentación, Persistent lanza el servicio enseguida si le habría tocado ejecutarse al menos una vez mientras el timer estaba inactivo. Para un portátil que de noche está apagado o suspendido, en principio es justo lo que hace falta.

Los timers de usuario viven en el gestor del propio usuario, eso sí, y yo tengo linger activado. Según la [documentación de loginctl](https://www.freedesktop.org/software/systemd/man/latest/loginctl.html#enable-linger%20USER%E2%80%A6), entonces el gestor del usuario arranca con el sistema y sigue vivo después de cerrar sesión. Parece que eso es lo que pasó esa noche, y los timers recuperaron obedientemente la ejecución perdida mientras el keyring seguía bloqueado. Y el keyring donde está la sesión de Telegram solo se abre cuando yo inicio sesión.

tg no pudo leer las claves y salió con `auth.failed`, código 4. El propio texto del error decía que probablemente el keyring no estaba accesible. Pero quien mira el código y no el texto ve un error de sesión, o sea, vuelve a iniciar sesión. La sesión no se había perdido, el keyring simplemente seguía bloqueado. Volver a iniciar sesión no lo arregla, y la ejecución de ese día se pierde igualmente.

max falló por otra razón: "name a profile", aunque el archivo de la tarea tiene `MAX_PROFILE=default`. Resultó ser un bug en `schedule exec`. En cli-core lo corrigieron la tarde anterior, y el nuevo max con esa corrección salió esa misma mañana, antes de que nos pusiéramos a mirarlo. Yo tenía la versión anterior.

Para el keyring separé 2 casos. Si el perfil nunca ha iniciado sesión en esta máquina, es un error de sesión real, código 4. Pero cuando un perfil que ya inició sesión no puede leer sus claves en segundo plano (serve o una ejecución del timer), devuelve `provider_unavailable`, código 12, con el motivo `credentials.unreachable`. Un comando escrito a mano sigue hablando de iniciar sesión, porque hay una persona delante que puede desbloquear el keyring.

Y `schedule exec` (es lo que llama el timer), cuando recibe ese motivo, espera y lo intenta de nuevo. La primera pausa es de un minuto. Cada pausa siguiente dura el doble, hasta 15 minutos. Espera 12 horas como máximo. Así la ejecución de la noche espera a que yo inicie sesión por la mañana, y si en 12 horas no ha pasado, falla tal cual.

Llegará una sola notificación, y solo si al final no salió. No se manda una por intento. Solo esperan las tareas diarias y las de una sola vez. Las que se repiten cada cierto intervalo no esperan, ya tendrán su siguiente ejecución. Y `schedule run` a mano también falla al momento, esperar 12 horas a espaldas de una persona sería raro.

Además, a los timers ya instalados les basta con actualizar el CLI. El reintento vive en el código que llama el timer, y el archivo de la unit no cambia.

## El código 4, que systemd tenía orden de no reiniciar nunca

La unit de serve de tg tiene esto:

```ini
Restart=on-failure
RestartSec=30
RestartPreventExitStatus=4
```

[`Restart=on-failure`](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#Restart=) reinicia el servicio con cualquier código distinto de cero, y [`RestartPreventExitStatus=`](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#RestartPreventExitStatus=) impide el reinicio con los códigos de la lista, diga lo que diga `Restart=`. El 4 está en esa lista porque con una sesión revocada o perdida el servicio falla igual en cada reintento, así que reiniciarlo no tiene sentido. En max el motivo es aún más serio - un servicio que se reinicia tras un inicio de sesión rechazado volvería a iniciar sesión cada 30 segundos, y MAX contaría cada uno de esos intentos contra la cuenta. Por eso max no tiene solo el 4 en la lista, también el límite de peticiones (8) y el error del proveedor (11).

Y max con el keyring bloqueado también salía con 4. Así que, aunque la unit hubiera estado habilitada, serve habría arrancado con el sistema, no habría leído el token, habría salido con 4, y systemd, tal como se le pidió, no lo habría vuelto a tocar hasta el siguiente reinicio, que habría terminado igual. tg ya devolvía 12 en este caso, max no. Por eso por la mañana el agente arrancó los dos servicios a mano, pero no activó el arranque automático: antes de iniciar sesión el keyring está bloqueado, y el servicio fallaría.

Pasé max también al 12 con el motivo `credentials.unreachable`, el 12 no está en la lista, y systemd vuelve a levantar serve cada 30 segundos hasta que inicio sesión y se abre el keyring. El propio bucle de reconexión de max serve tampoco lo trata ya como un inicio de sesión rechazado. De momento esto solo funciona en Linux. En Mac un LaunchAgent con una lista de códigos sin reinicio no se reinicia nunca, así que allí el código 12 no vuelve a levantar serve.

Había una opción más simple: colgar la unit de `graphical-session.target`, para que arranque con la sesión gráfica, cuando el keyring ya está abierto. Pero entonces el servicio no arrancaría nunca donde systemd no tiene session targets, ni en una máquina a la que solo se entra por ssh. Así que la unit se quedó en `default.target`, y el keyring bloqueado se resuelve con el código de salida. Un reinicio cada 30 segundos hasta el inicio de sesión me parece un precio razonable por un servicio que arranca en cualquier Linux, incluso sin sesión gráfica.

## 30 segundos y una tubería cerrada

Por la mañana el agente lanzó a mano una sincronización completa: `tg personal schedule run full-sync`. El comando esperó 30 segundos, devolvió `timeout` (código 9) y salió. Y la sincronización que había lanzado murió justo después con `write EPIPE`. Esa misma noche, antes del reinicio, una sincronización lanzada desde la app de escritorio había muerto igual: a los 18 minutos la app cerró la tubería por su lado, y la sincronización falló en la siguiente escritura.

EPIPE es lo que pasa cuando un proceso escribe en una tubería y ya nadie la lee. El manejador de cli-core paraba cualquier comando con EPIPE y código 0. Para `tg ... | head` eso es correcto, head ya leyó sus 10 líneas, cerró la tubería y no tiene sentido seguir. Una sincronización, en cambio, dura un par de horas y escribe en el archivo, su salida es solo un log, y abandonar el trabajo porque se cerró la salida está mal.

Ahora una sincronización (decide sola cuándo parar) y `schedule run`/`schedule exec` (esperan el trabajo que lanzaron) siguen después de EPIPE, solo que su salida ya no va a ninguna parte. Cómo terminó la ejecución sigue quedando en su registro. Los demás comandos salen con 0, como espera `| head`. Y `watch` también sale, sin nadie leyendo no tiene nada que hacer.

Y los 30 segundos de `schedule run` ya estaban corregidos, esa corrección salió en un tg nuevo esa misma mañana. Yo tenía el anterior. O sea, 2 de los fallos de esa noche ya estaban corregidos por la mañana, solo que no en mi máquina.

Luego el agente lanzó `tg personal messages sync --all` directamente, con la salida a un archivo, y llegó hasta el final (menos 11 chats no disponibles). De paso cerró un hueco en el archivo de Telegram: desde el 28 de octubre llegaban de 6 a 107 mensajes al día en vez de 7-10 mil.

## Qué hago distinto ahora

Para un CLI local-first en un escritorio, con un servicio y tareas programadas, esto es lo que hago ahora:

- habilitar el servicio al instalarlo en vez de mostrar una pista, porque muchas veces no lo instala una persona
- tratar un keyring bloqueado al arrancar como un error temporal con su propio código
- dejar en `RestartPreventExitStatus=` solo los códigos en los que reintentar seguro que no sirve
- esperar al inicio de sesión con pausas y avisar a la persona una vez si al final no salió
- no abandonar un trabajo largo cuando se cierra la salida

Y actualizar, sí. Las dos versiones nuevas con las correcciones salieron esa misma mañana, menos de una hora antes de que nos pusiéramos a mirarlo, así que simplemente no me dio tiempo a actualizar.

Todo esto salió el 2 de noviembre: cli-core 0.552.0, max 0.97.0 y tg 0.114.0. Detalles en los PR: [cli-core #2401](https://github.com/WireCatLabs/cli-core/pull/2401) (habilitar la unit, reintento con el keyring bloqueado, EPIPE), [tg-cli #812](https://github.com/WireCatLabs/tg-cli/pull/812) y [max-cli #901](https://github.com/WireCatLabs/max-cli/pull/901) (código 12 en vez de 4).

Lo que todavía no he comprobado:

- Un reinicio con las versiones nuevas. Los tests cubren la habilitación de la unit, los reintentos con pausas y EPIPE, pero ni `server install` ni un timer se ejecutaron sobre mis units reales.
- Mac. El análisis de `launchctl print-disabled` lo comprobé contra la salida de la documentación, no en un Mac de verdad.
- Cuántos reinicios acumula serve antes del inicio de sesión y cómo se ve eso en el journal de systemd.

Si tienes el servicio de tg o max, actualiza y ejecuta otra vez `tg <perfil> server install` (o lo mismo para max). Una unit de una versión anterior no se habilita sola. Luego `server status`, y `starts_at_login` debería ser true.
