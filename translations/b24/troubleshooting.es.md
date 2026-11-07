---
title: "Cuando algo falla"
---

Empieza por el síntoma, haz la comprobación y vuelve a ejecutar el comando. Guarda el código de error y el nombre del
perfil para una solicitud de soporte.

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `b24 doctor`. No lee ningún llavero ni usa la red. |
| No se encuentra `b24` | Abre una terminal nueva y comprueba que la carpeta global de npm está en `PATH`. |
| "name a profile" | Pon el perfil primero, como en `b24 personal config show`, o define `B24_PROFILE`. |
| El archivo de ajustes no se puede leer | `doctor` muestra cada problema del archivo en `config.issues`. Ejecuta el `config unset` que indica cada uno o corrige el archivo a mano. |
| `doctor` muestra `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que `doctor` imprime tras "to make it private:". `doctor` nunca cambia por sí mismo los permisos de un archivo. |
| "not signed in" | Ejecuta `b24 <profile> session start` y pega la dirección del webhook. |
| Bitrix24 rechazó este webhook | El webhook se borró o se editó en Bitrix24, y eso cambia su dirección. Crea uno nuevo y ejecuta `session start` otra vez. |
| Falta el permiso de acceso para un método, o `ERROR_METHOD_NOT_FOUND` | Añade el permiso de acceso (`crm`, `user`, `catalog`) al webhook en Bitrix24. |
| `rate_limited` | El portal permite unas 2 peticiones por segundo para todas sus aplicaciones juntas. `b24` espera por sí mismo una espera corta; si es larga, te avisa. |
| `outcome_unknown` en una escritura | Puede que el portal hiciera el cambio. Mira primero el elemento (`sync` y luego `show`), y repite la escritura con el `--operation-id` que indica el error solo si el cambio no está; consulta [escribir](./usage.md#write). |
| Se rechaza una escritura | Lo impiden los permisos del perfil o `B24_READ_ONLY`; consulta los [ajustes](./configuration.md#permissions). |

Nunca pegues un token, una contraseña ni contenido privado en una solicitud de soporte.
