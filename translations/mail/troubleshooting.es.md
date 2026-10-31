---
title: "Cuando algo falla"
---

Empieza por el síntoma, ejecuta la comprobación y vuelve a probar el comando. Guarda el código de error y el nombre del perfil para una
petición de soporte.

| Síntoma | Qué hacer |
| --- | --- |
| No sé qué está configurado | Ejecuta `mail doctor`. No lee el llavero y no usa la red. |
| No se encuentra `mail` | Abre una terminal nueva y comprueba que la carpeta global de npm está en `PATH`. |
| "name a profile" | Pon el perfil primero, como en `mail ya folders list`, o define `MAIL_PROFILE`. |
| El archivo de ajustes no se lee | `doctor` lista cada problema del archivo en `config.issues`. Ejecuta el `config unset` que da cada uno, o corrige el archivo a mano. |
| `doctor` lista `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que `doctor` imprime tras "to make it private:". `doctor` nunca cambia por sí mismo los permisos de un archivo. |
| "no app password for profile" | Ejecuta `mail <profile> session start`, o define `MAIL_PASSWORD` para una ejecución. |
| "the mail server refused the login" | La contraseña de aplicación es incorrecta, o IMAP y las contraseñas de aplicación están desactivados. Los pasos de cada proveedor están en [preparar el buzón](./providers.md). Yandex además necesita de 2 a 3 horas tras crear una contraseña de aplicación nueva. Después ejecuta `session start` otra vez. |
| `rate_limited` | El servidor está limitando esta cuenta. Espera y ejecuta `sync` otra vez; el correo ya guardado se omite. |
| "the OS keyring is not available" | El llavero está bloqueado o no hay ningún servicio de secretos en marcha. Desbloquéalo y prueba otra vez; la contraseña nunca se guarda en un archivo. |
| Se rechaza una escritura | Lo impiden los permisos del perfil o `MAIL_READ_ONLY`; consulta [los ajustes](./configuration.md#permissions). |

Nunca pegues un token, una contraseña ni contenido privado en una petición de soporte.
