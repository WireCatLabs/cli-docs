---
title: "Cuando algo falla"
---

Empieza por el síntoma, haz la comprobación y vuelve a ejecutar el comando. Guarda el código de error y el nombre del
perfil para una solicitud de soporte.

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `gcal doctor`. No lee ningún llavero ni usa la red. |
| No se encuentra `gcal` | Abre una terminal nueva y comprueba que la carpeta global de npm está en `PATH`. |
| "name a profile" | Pon el perfil primero, como en `gcal personal config show`, o define `GCAL_PROFILE`. |
| El archivo de ajustes no se puede leer | `doctor` muestra cada problema del archivo en `config.issues`. Ejecuta el `config unset` que indica cada uno o corrige el archivo a mano. |
| `doctor` muestra `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que `doctor` imprime tras "to make it private:". `doctor` nunca cambia por sí mismo los permisos de un archivo. |
| "no Google OAuth client is set up" | Pasa `--client-file` con el JSON de tu cliente de aplicación de escritorio, o define `GCAL_GOOGLE_CLIENT_ID` y `GCAL_GOOGLE_CLIENT_SECRET`. Consulta [tu propio cliente de Google](./configuration.md#your-own-google-client). |
| `doctor` muestra `oauth_client.client: null` | No hay ningún cliente en el entorno. Un perfil que inició sesión con `--client-file` sigue funcionando: su sesión guarda el cliente. Solo un nuevo `session start` lo necesita. |
| "the client file can be read by other users" | Ejecuta el `chmod 600` que indica el mensaje y vuelve a iniciar sesión. |
| `sign-in.scope-missing` | La página de consentimiento de Google permite desmarcar Calendar. Ejecuta `session start` de nuevo y déjalo marcado. |
| `profile.wrong-account` o `profile.same-account` | Cada cuenta de Google tiene un solo perfil. Usa el perfil que ya tiene esa cuenta, o un nombre de perfil nuevo para una cuenta nueva. |
| `oauth.expired` una semana después de iniciar sesión | Una aplicación de Google en modo Testing da sesiones que caducan a los 7 días ([nota de Google](https://developers.google.com/identity/protocols/oauth2#expiration)). Ejecuta `session start` de nuevo o publica la aplicación en Google Cloud Console. |
| `oauth.not-saved` | El archivo de sesión (`credentials.json` en la carpeta de estado, que usan `--credential-storage file` y cualquier ejecución en la que falla el llavero) existe, pero no se puede leer como archivo de sesión. Apártalo e inicia sesión de nuevo. |
| Se rechaza una escritura | Lo impiden los permisos del perfil o `GCAL_READ_ONLY`; consulta los [ajustes](./configuration.md#permissions). |

Nunca pegues un token, una contraseña ni contenido privado en una solicitud de soporte.
