---
title: "Cuando algo falla"
---

Haz que `hubspot` vuelva a funcionar a partir del mensaje que muestra. Una clave revocada, un scope que falta y un
límite diario agotado tienen cada uno su propio mensaje y su propio arreglo.

Busca tu síntoma en la tabla y ejecuta la comprobación de al lado. Tu agente puede hacer lo mismo: cada error nombra
su motivo, como `session.expired`, así que sabe qué pasó. Empieza con `hubspot doctor`, que muestra qué está
configurado y no necesita red.

**En esta página:**

1. [Síntomas y qué hacer](#symptoms-and-what-to-do)
2. [Pedir ayuda](#asking-for-help)

## Síntomas y qué hacer

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `hubspot doctor`. No lee ningún llavero ni usa la red. |
| No se encuentra `hubspot` | Abre una terminal nueva y comprueba que la carpeta global de npm está en `PATH`. Otra herramienta puede usar la palabra `hubspot`, como el propio Agent CLI de HubSpot: ejecuta `wcat-hubspot` en su lugar. |
| "name a profile" | Pon el perfil primero, como en `hubspot work config show`, o define `WCHUBSPOT_PROFILE`. |
| El archivo de ajustes no se lee | `doctor` enumera cada problema del archivo en `config.issues`. Ejecuta el `config unset` que da cada uno, o arregla el archivo a mano. |
| `doctor` muestra `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que `doctor` imprime después de "to make it private:". `doctor` nunca cambia por sí mismo los permisos de un archivo. |
| "HubSpot refused the token" (`session.expired`) | La clave se borró, se rotó o se escribió mal. Crea una nueva y ejecuta de nuevo `hubspot work session start`, como muestra [instalar y conectar](./installation.md#make-a-key). |
| "the token lacks the … scope" (`hubspot.scope-missing`) | Añade a la clave en HubSpot el scope que nombra el error. La clave sigue funcionando, sin iniciar sesión de nuevo. |
| `WCHUBSPOT_TOKEN needs WCHUBSPOT_ACCOUNT` (`account.id-missing`) | Pon `WCHUBSPOT_ACCOUNT` con el id de la cuenta junto al token. `hubspot work session status --check` solo con el token lo imprime como `account`. |
| `WCHUBSPOT_ACCOUNT names account …, but the token belongs to account …` (`account.mismatch`) | El id es de otra cuenta. Pon en `WCHUBSPOT_ACCOUNT` el id que nombra el error. No se escribió nada. |
| `run hubspot <profile> sync once with WCHUBSPOT_TOKEN first` (`account.unchecked`) | Un comando que solo lee la copia local con `WCHUBSPOT_TOKEN` necesita antes uno comprobado. Ejecuta `hubspot work sync`. |
| "already signs in to HubSpot account" (`session.duplicate`) | Otro perfil lee esa cuenta. Usa ese perfil, o cierra antes su sesión. |
| "spent its daily API allowance" (`hubspot.daily-limit`) | Todas las apps de la cuenta comparten un límite diario. Vuelve a medianoche en la zona horaria de la cuenta, y el error dice dentro de cuántas horas. `api` con `WCHUBSPOT_TOKEN` no conoce la zona horaria: su error dice que lo intentes de nuevo después de una hora en UTC, la más temprana en que el límite puede volver. |
| `owner:me` no encuentra nada | Una clave no nombra a ningún usuario. Toma el id del propietario de `hubspot work users list` y filtra por él, como `owner:51234567`. |
| Se rechaza una escritura | Lo impiden los permisos del perfil o `WCHUBSPOT_READ_ONLY`, como muestra [permisos](./permissions.md). |

## Pedir ayuda

Guarda el código de error y el nombre del perfil. `hubspot doctor reports create` escribe un informe del problema en
un archivo y dice dónde enviarlo. Abre una incidencia en el
[repositorio de hubspot-cli](https://github.com/WireCatLabs/hubspot-cli/issues).

Nunca pegues una clave, una contraseña ni contenido privado en una petición de ayuda.
