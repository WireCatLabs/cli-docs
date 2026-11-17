---
title: "Cuando algo falla"
---

Haz que `amo` vuelva a funcionar a partir del mensaje que muestra. Un token que caducó, un perfil que falta en el
comando y una cuenta de amoCRM que dejó de responder tienen cada uno su propio mensaje y su propia solución.

Buscas tu síntoma en la tabla, haces la comprobación que indica y vuelves a ejecutar el comando. Si sigue fallando,
tienes el código de error y el nombre del perfil listos para una petición de ayuda. Tu agente puede hacer lo mismo:
cada error nombra su motivo, como `session.expired`, así que sabe qué pasó.

`amo doctor` muestra qué está configurado sin la red ni el llavero. `amo work session status --check` pregunta a la
cuenta con qué usuario actúa el inicio de sesión.

**En esta página:**

1. [Primeras comprobaciones](#first-checks)
2. [Síntomas y qué hacer](#symptoms-and-what-to-do)
3. [Pedir ayuda](#asking-for-help)

## Primeras comprobaciones

```sh
amo doctor                         # the version, the settings, the profiles, without the network
amo work session status --check    # the account and the user the sign-in acts as
amo work store status              # how far each kind's sync is, and when it last ran
```

## Síntomas y qué hacer

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `amo doctor`. No lee el llavero ni usa la red. |
| No se encuentra `amo` | Abre una terminal nueva y comprueba que la carpeta global de npm está en `PATH`. |
| "name a profile" | Pon el perfil primero, como en `amo work config show`, o define `AMO_PROFILE`. |
| El archivo de ajustes no se lee | `doctor` lista cada problema del archivo en `config.issues`. Ejecuta el `config unset` que da cada uno, o corrige el archivo a mano. |
| `doctor` muestra `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que `doctor` imprime después de "to make it private:". `doctor` nunca cambia los permisos de un archivo por sí mismo. |
| "not signed in" (`session.missing`) | Ejecuta `amo work setup`, o `amo work session start --host` con la dirección de la cuenta, como muestra [instala y conecta](./installation.md#sign-in-with-a-key). |
| "amoCRM refused the token" (`session.expired`) | El token de larga duración caducó o se retiró, o `--host` nombra otra cuenta. Crea un token nuevo y vuelve a ejecutar `amo work session start` con la dirección de la cuenta, como muestra [instala y conecta](./installation.md#sign-in-with-a-key). |
| El inicio de sesión en el navegador dejó de funcionar | `amo` no se usó durante más de 3 meses y el refresh token de amoCRM caducó. Vuelve a iniciar sesión, como muestra [inicia sesión con la integración](./installation.md#sign-in-through-the-integration). |
| "another profile here already signs in to this account as this user" (`session.duplicate`) | Usa ese perfil, o quítalo con `amo <profile> account remove --keep-data` y vuelve a iniciar sesión. |
| La sincronización copia negociaciones de otra persona, o no todas las tuyas | Una sincronización copia las negociaciones del usuario que inició sesión, o de los usuarios que eligió un administrador. Busca los ids con `users list` y ponlos como muestra [qué negociaciones copia sync](./configuration.md#which-deals-sync-copies). |
| Un contacto o una empresa no está en la copia | La copia solo guarda los clientes de tus negociaciones. Lee cualquier otro en directo con `people list` u `organizations list`. |
| "the account has no API filter add-on" (`amo.filters-off`) | Una lista en directo de contactos o empresas solo filtra por responsable o por fecha con el complemento de pago de filtros de la API de amoCRM. Busca por palabras en su lugar, como `amo work people list "Anna"`. |
| No hay más teléfonos ni correos hoy (`crm.foreign-contacts-spent`) | Un usuario que no es administrador ve los de como máximo 100 contactos y empresas más al día. La cuenta vuelve a empezar al día siguiente (UTC). |
| "the token's user may not do this in amoCRM" (`amo.access-denied`) | Lo rechazan los propios permisos de amoCRM. Un administrador da ese permiso al usuario en amoCRM, o un administrador inicia sesión en el perfil en su lugar. |
| "only an amoCRM administrator …" (`employee.delete`, `employee.clear`, `employee.unbind`) | Borrar, dejar un campo vacío y desvincular registros necesitan el inicio de sesión de un administrador. Mira los [permisos](./permissions.md#checks-that-hold-whatever-the-permissions-say). |
| `rate_limited` (salida 8) | `amo` se mantiene en 5 peticiones por segundo y espera por sí mismo cuando el rechazo es corto. Espera un minuto y ejecuta el comando una vez más. |
| `outcome_unknown` (salida 14) en una escritura | Puede que amoCRM haya hecho el cambio. Ejecuta `sync`, mira el registro con `show` y vuelve a escribirlo solo si el cambio no está. |
| "the amoCRM subscription has ended" (`amo.subscription-ended`) | Renueva la suscripción en amoCRM. Las escrituras se detienen enseguida, y las lecturas 30 días después. |
| "amoCRM blocks every request" (`amo.blocked`) | Detén todos los comandos de `amo` en la cuenta y revísala en amoCRM: demasiadas peticiones, o una dirección que no está en su lista de permitidas. |
| Se rechaza una escritura | La detienen los permisos del perfil o `AMO_READ_ONLY`. Mira los [permisos](./permissions.md). |

## Pedir ayuda

Guarda el código de error y el nombre del perfil. `amo doctor reports create` escribe un informe del problema en un
archivo y dice adónde enviarlo. Pregunta en [Discord](https://discord.gg/DebENqbRrJ), o abre una incidencia en el
[repositorio de amo-cli](https://github.com/WireCatLabs/amo-cli/issues).

Nunca pegues un token, una contraseña ni contenido privado en una petición de ayuda.
