---
title: "Llamadas"
---

Guarda en tu ordenador las llamadas de los teléfonos de Bitrix24, con lo que se dijo como texto, en el mismo almacén
local que las negociaciones, los mensajes y el correo del cliente. El portal guarda sus llamadas en el historial de
llamadas (Telephony → Call history), y `b24` las copia de ahí.

Luego un agente te dice cuándo llamó un cliente por última vez, cómo terminó la llamada y qué se dijo en ella. Las
llamadas de otra centralita también pueden llegar al contacto del cliente en Bitrix24, para que el CRM las muestre.

`meetings sync` copia las llamadas al almacén local de WireCat, y cada `sync` también lo hace. `meetings transcribe`
convierte las grabaciones en texto con un modelo de voz que funciona en este ordenador. `calls export` escribe en
Bitrix24 las llamadas de otras centralitas. Necesitas el permiso `telephony` del webhook.

**En esta página:**

1. [Antes de la primera sincronización](#before-the-first-sync)
2. [Copiar las llamadas](#copy-the-calls)
3. [El cliente y el empleado](#the-client-and-the-employee)
4. [Grabaciones](#recordings)
5. [Convertir las llamadas en texto](#turn-calls-into-text)
6. [Permisos](#permissions)
7. [Escribir en Bitrix24 las llamadas de otras centralitas](#write-other-phone-systems-calls-into-bitrix24)

## Antes de la primera sincronización

El webhook necesita el permiso `telephony`, además de `crm`, `user_basic` y `department`. Edita el webhook en
Developer resources → Integrations, marca Telephony y guarda. Una aplicación local necesita el mismo permiso en su
ficha. El empleado que creó el webhook también necesita el permiso del portal para ver las estadísticas de llamadas.

Copiar las llamadas solo lee. Ningún comando hace una llamada ni cambia una línea. Solo `calls export`, desactivado
hasta que lo actives, escribe en el portal. Consulta
[Escribir en Bitrix24 las llamadas de otras centralitas](#write-other-phone-systems-calls-into-bitrix24).

## Copiar las llamadas

`b24 work sync` copia las llamadas después del CRM y dice cuántas en su respuesta. Si no puede copiarlas, por ejemplo
porque al webhook le falta el permiso de telefonía, dice por qué en una nota y la sincronización del CRM termina bien
igualmente. Para dejar las llamadas fuera de `sync`: `b24 work config set sync_calls false`. `meetings sync` copia
solo las llamadas:

```sh
b24 work meetings sync                                   # calls since the last sync, the first reads 30 days
b24 work meetings sync --since-time 2026-11-01T00:00:00Z # calls from a date on
b24 work meetings list                                   # newest first, from the store, offline too
b24 work meetings show 12                                # one call: who, when, how it ended
```

Cada llamada es una reunión de tipo llamada. Guarda su dirección (entrante o saliente), el número del cliente, el
empleado, cuánto hablaron y cómo terminó: contestada, no contestada, ocupado o fallida. También guarda el contacto, la
empresa o el prospecto del CRM al que el portal vinculó la llamada, y la actividad del CRM de la llamada, como números
para buscar.

En una línea con mucho uso, una primera sincronización lee muchas páginas antes de guardar nada. Si se detiene por su
límite de tiempo, dale un periodo más corto o más tiempo: `meetings sync --since-time 7d` o `--timeout 5m`.

Cada sincronización vuelve a leer las tres horas anteriores a la última, así que una llamada que seguía en curso
aparece la vez siguiente. Un temporizador que ejecuta `sync` también mantiene las llamadas al día.

### De quién son las llamadas

La misma regla que para las negociaciones: una copia nunca es todo el portal. `meetings sync` copia las llamadas del
usuario que inició sesión, o de los usuarios que elegiste en `crm.bitrix24:<portal>.unassigned`
(consulta [De quién son las negociaciones y los prospectos](./usage.md#whose-deals-and-leads)).
Un perfil cuyo `scope` es `all` se niega a sincronizar llamadas hasta que lo pongas en `mine`.

## El cliente y el empleado

El empleado de una llamada es la misma persona que el usuario del portal en tu copia: sus llamadas aparecen en esa
persona.

El cliente se encuentra por su número. Un número que el portal escribe con `+` se lee tal cual. Un número sin `+`,
como `79000000001`, necesita su país:

```sh
b24 work config set phone_region ru        # or several: ru,kz
b24 work meetings sync --rescan            # read the calls again with it
```

Sin `phone_region`, o cuando dos de sus países leen un número de forma distinta, el número se guarda tal como está
escrito y no se une a nadie. Con él, una llamada desde un móvil se une al contacto, a la cuenta de WhatsApp o
Telegram, o a las llamadas de otra centralita que tienen el mismo número. Un fijo no se une a nadie por sí solo: una
línea de oficina es de todos los que trabajan allí.

```sh
memo context person:12        # the client's history: messages, mail and calls, newest first
```

## Grabaciones

Las grabaciones se quedan en el portal salvo que las pidas:

```sh
b24 work config set download_recordings true
b24 work meetings sync         # downloads the recording of each new call
```

Cada grabación se guarda en la carpeta de estado de b24, en `recordings/<profile>/`, y solo tú puedes leerla.
`meetings show` da su ruta como `local_path`, y WireCat Desktop la reproduce. Una grabación puede ocupar unos
megabytes por llamada: comprueba el espacio antes de activarlo en una línea con mucho uso.

El enlace que da el portal para una grabación lleva un token de acceso. b24 lo sigue justo después de leerlo, sin
redirecciones, y nunca lo guarda ni lo imprime. Cuando tu proveedor de telefonía guarda las grabaciones él mismo, como
hace una centralita en la nube de Beeline, el enlace lleva al servidor del proveedor. b24 solo sigue un enlace así por
https y solo a una dirección de internet pública, nunca a este ordenador ni a tu red local, y no envía con él nada de
tu inicio de sesión en Bitrix24.

## Convertir las llamadas en texto

El texto se hace en este ordenador con un modelo de voz local: ninguna grabación sale de él.

```sh
b24 models download gigaam-v3        # once, a few hundred megabytes
b24 work meetings transcribe         # calls of five seconds or more with no text yet, newest first
b24 work meetings transcript 12      # one call's text
```

Una grabación guardada por `download_recordings` se lee de este ordenador. Cualquier otra se descarga para la
transcripción, y se guarda solo cuando `download_recordings` está activado. Bitrix24 no dice qué lado de una
grabación estéreo es el empleado, así que el texto nombra los canales "Channel 1" y "Channel 2". Una llamada de más
de una hora se omite.

## Permisos

Cada comando tiene su propia clave: `meetings.sync`, `meetings.transcribe`, `meetings.list` y otras. Para que los
agentes no copien llamadas:

```sh
b24 work config set permissions.meetings.sync deny
```

`api call voximplant.statistic.get` sigue denegado: su respuesta lleva los enlaces de las grabaciones con sus tokens.
Consulta [Permisos](./permissions.md).

## Escribir en Bitrix24 las llamadas de otras centralitas

Las llamadas de otra centralita, como pbx, pueden llegar al contacto del cliente en Bitrix24, para que el CRM las
muestre junto a las llamadas del propio portal. Está desactivado hasta que lo actives, y escribe cada llamada una vez.

Bitrix24 solo deja escribir una llamada a una aplicación, no a un webhook. Primero inicia la sesión del perfil como
aplicación local ([con una aplicación local](./usage.md#with-a-local-application)), con el host de tu portal y tu
Application ID en lugar de estos ejemplos:

```sh
b24 work session start --portal example.bitrix24.ru --client-id local.0123abcd.45678901
```

Luego actívalo y permite sus dos métodos:

```sh
b24 work config set export_calls true
b24 work config set permissions.api.telephony.externalcall.register allow
b24 work config set permissions.api.telephony.externalcall.finish allow
b24 work calls export --since-time 7d --dry-run   # each call, the fields it would send, where it would land
b24 work calls export --since-time 7d
```

Una llamada llega solo cuando su cliente está vinculado a exactamente un contacto de este portal, y su empleado a un
usuario del portal (`memo people link` los vincula). Cualquier otra llamada aparece como omitida, con el motivo. Las
llamadas del propio portal se omiten: ya están en Bitrix24.

Cada llamada se registra y se termina con `telephony.externalCall.register` y `telephony.externalCall.finish`, sin un
registro nuevo en el CRM, sin ficha de llamada y sin mensaje en el chat. b24 guarda las llamadas que escribió en su
carpeta de estado, en `calls-export/<portal>.json`, así que una segunda ejecución nunca vuelve a escribir una llamada.
Bitrix24 por sí solo solo detecta una repetición dentro de 30 minutos.

Para pararlo: `b24 work config set export_calls false`. Nada de lo escrito en el portal se deshace.
