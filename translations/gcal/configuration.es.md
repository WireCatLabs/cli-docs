---
title: "Ajustes"
---

Los ajustes están en un único archivo, `config.json`, en la carpeta que muestra `gcal doctor`. Cada perfil tiene su
propia sección, y `defaults` se aplica a todos los perfiles. Esta página explica cómo verlos y cambiarlos.

```sh
gcal personal config show
gcal personal config set limit 50
gcal personal config unset limit
```

`config show` muestra cada ajuste y de dónde viene: el archivo, una variable o el valor por defecto.

## Tu propio cliente de Google

`gcal` todavía no tiene su propia aplicación de Google, así que `session start` inicia sesión a través de la tuya.
Créala una vez en [Google Cloud Console](https://console.cloud.google.com/):

1. Crea un proyecto y activa en él la API de Google Calendar.
2. Configura la pantalla de consentimiento de OAuth. Mientras la aplicación esté en Testing, añade tu cuenta de Google
   como usuario de prueba.
3. Crea un ID de cliente de OAuth del tipo **Desktop app** y descarga su archivo JSON.

Después pasa el archivo a `gcal`, legible solo por ti:

```sh
chmod 600 ~/client_secret.json
gcal personal session start --client-file ~/client_secret.json
```

`gcal` rechaza un archivo de cliente que puedan leer otros usuarios del ordenador. En lugar del archivo, puedes definir
`GCAL_GOOGLE_CLIENT_ID` y `GCAL_GOOGLE_CLIENT_SECRET`. El cliente solo hace falta al iniciar sesión: `gcal` lo guarda
junto con la sesión en el llavero del sistema, así que los comandos siguientes funcionan sin el archivo.

## Permisos

`permissions` decide qué puede hacer un comando en este perfil: `allow`, `ask`, `readonly` o `deny`, por clave de
permiso. Cada método de Google Calendar tiene su propia clave, `api.<method>`, como `api.calendar.events.insert`;
`api` y `api.calendar.events` abarcan todos los métodos que hay debajo. La misma clave cubre `api call <method>` y el
comando propio del método, `api calendar-events-insert`.

```sh
gcal personal config set permissions.api readonly                        # reads only, every method
gcal personal config set permissions.api.calendar.events.insert allow    # add events without the question
```

Si no defines nada:

- Un método que cambia Calendar está en `ask`. En una terminal, `gcal` pregunta antes de llamar a Google; en un
  script, añade `--yes`. Por MCP no hay nadie a quien preguntar, así que `ask` deja que el comando se ejecute.
- Compartir un calendario (`calendar.acl.insert`, `patch`, `update`, `delete`) y cederlo a otra cuenta
  (`calendar.calendars.transferOwnership`) están en `ask`, como cualquier otro cambio. Por MCP eso significa que un
  agente puede compartir tu calendario con cualquiera, o cederlo, sin preguntar. Define
  `permissions.api.calendar.acl deny` para impedirlo.
- `sharing.notify`, que deja a Google enviar un correo a la persona con quien se comparte un calendario, está en
  `deny`. Google envía ese correo salvo que `sendNotifications` sea `false`, así que mientras la clave esté en `deny`
  una compartición debe indicar `--send-notifications false`.
- Vaciar un calendario (`calendar.calendars.clear`, todos los eventos del calendario principal) está en `deny` y nunca
  se ofrece por MCP.
- Las escrituras de eventos (`events create`, `update`, `delete`, `respond`) están en `ask`, cada una con su propia
  clave, como `events.create`.
- `events.notify`, que deja a Google enviar un correo a los demás asistentes (`--notify`), está en `deny`. Por MCP,
  `ask` deja que un comando se ejecute, así que de otro modo un agente podría enviar correos a otras personas.
- `events.delete.series`, borrar todos los casos de un evento periódico (`events delete --series`), está en `deny`.

Una escritura de eventos también necesita la clave del método de Google al que llama: `api.calendar.events.insert`
para `create`, `api.calendar.events.patch` para `respond`, `api.calendar.events.patch` y `api.calendar.events.update`
para `update` (pasar de evento con hora a evento de todo el día, o al revés, envía el evento completo),
`api.calendar.events.delete` para `delete`. Por eso `permissions.api readonly` también detiene las escrituras de
eventos. Una sola pregunta cubre todas las claves de una escritura.

Los comandos `api` responden a las mismas claves. Un método que hace que Google envíe un correo a los asistentes
(`--send-updates` distinto de `none`, o `--send-notifications true`) también necesita `events.notify`. Borrar un
evento, o cambiarlo a `cancelled`, también necesita `events.delete.series` cuando el evento es periódico: `gcal` lee
antes el evento de Google para saberlo. Compartir un calendario (`calendar.acl.insert`, `patch`, `update`) también
necesita `sharing.notify`, salvo que la llamada pase `--send-notifications false` (`"sendNotifications": false` en
`api call --params`); `gcal` nunca lo añade por ti. Quitar el acceso (`calendar.acl.delete`) no envía correo a nadie,
así que no necesita ninguna clave adicional. `--dry-run` muestra todas las claves que comprueba una llamada, con su
nivel, y no llama a nada.

```sh
gcal personal config set permissions.events.notify allow     # let --notify mail attendees
gcal personal config set permissions.sharing.notify allow    # let a share mail the person it is shared with
gcal personal config set permissions.events.create allow     # add events without the question
```

Frente a una clave más general, estos valores por defecto solo se vuelven más estrictos: `permissions.api allow`
mantiene tanto la pregunta como el `deny`. Para cambiar uno, define la clave propia de ese método, como
`permissions.api.calendar.calendars.clear ask`. Una clave que no corresponde a ningún método se rechaza, y
`gcal doctor` muestra las que haya en el archivo. `GCAL_READ_ONLY=1` rechaza toda escritura, digan lo que digan los
permisos. `gcal <profile> mcp serve --permission api=readonly` hace una clave más estricta solo para ese servidor.

## Registros de ejecución

Un comando que falla se guarda como ejecución, para `gcal runs list` y `runs show`. `record_input` decide si una
ejecución guarda las palabras que escribiste; vale `true` salvo que lo pongas en `false`. Los secretos se ocultan en
ambos casos; consulta [Seguridad](./security.md).
