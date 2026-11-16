---
title: "Cuando algo falla"
---

Empieza por el síntoma, haz la comprobación y vuelve a ejecutar el comando. Para pedir ayuda, guarda el código de
error y el nombre del perfil.

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `amo doctor`. No lee el llavero ni usa la red. |
| No se encuentra `amo` | Abre una terminal nueva y comprueba que la carpeta global de npm está en `PATH`. |
| "name a profile" | Pon el perfil primero, como en `amo work config show`, o define `AMO_PROFILE`. |
| El archivo de ajustes no se lee | `doctor` lista cada problema del archivo en `config.issues`. Ejecuta el `config unset` que da cada uno, o corrige el archivo a mano. |
| `doctor` muestra `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que `doctor` imprime después de "to make it private:". `doctor` nunca cambia los permisos de un archivo por sí mismo. |
| "amoCRM refused the token" (`session.expired`) | El token de larga duración caducó o se retiró, o `--host` nombra otra cuenta. Crea un token nuevo y ejecuta `amo work session start --host <address>`. |
| "the amoCRM subscription has ended" (`amo.subscription-ended`) | Renueva la suscripción en amoCRM. Las lecturas se detienen 30 días después que las escrituras. |
| "amoCRM blocks every request" (`amo.blocked`) | Detén todos los comandos de `amo` en la cuenta y revísala en amoCRM: demasiadas peticiones, o una dirección que no está en su lista de permitidas. |
| Se rechaza una escritura | La detienen los permisos del perfil o `AMO_READ_ONLY`. Mira los [ajustes](./configuration.md#permissions). |

Nunca pegues un token, una contraseña ni contenido privado en una petición de ayuda.
