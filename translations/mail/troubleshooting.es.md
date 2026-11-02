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
| `doctor` lista `changes.unfinished` o `changes.expiring` | Una ejecución de cambios se detuvo a medias, o el correo que una ejecución movió a la papelera de Gmail está a pocos días de que la vacíen. Ejecuta el `messages restore --run <id> --yes` que imprime `doctor`, con el perfil de ese buzón, o ejecuta de nuevo el primer comando para terminarla. |
| `doctor` lista `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que `doctor` imprime tras "to make it private:". `doctor` nunca cambia por sí mismo los permisos de un archivo. |
| "no app password for profile" | Ejecuta `mail <profile> session start`, o define `MAIL_PASSWORD` para una ejecución. |
| "the mail server refused the login" | La contraseña de aplicación es incorrecta, o IMAP y las contraseñas de aplicación están desactivados. Los pasos de cada proveedor están en [preparar el buzón](./providers.md). Yandex además necesita de 2 a 3 horas tras crear una contraseña de aplicación nueva. Después ejecuta `session start` otra vez. |
| `rate_limited` | Dos causas. **El servidor limita la cuenta:** el comando falla con el error «the mail server is limiting this account»; espera y ejecútalo otra vez. **`sync` gastó su propio presupuesto de peticiones:** `sync` no falla. Responde `state: partial` con `stopped: "requests"`, y `meta.issues` tiene `rate_limited` con el motivo `budget.requests`; ejecuta `sync` otra vez para continuar, o sube `--max-pages`. En ambos casos el correo ya guardado se omite. |
| "could not reach the OS keyring" | El llavero está bloqueado o no hay ningún servicio de secretos en marcha. La contraseña se guardó en su lugar en un archivo privado (`credential_storage: "file"`). Desbloquea el llavero y ejecuta `session start` otra vez para devolverla allí. |
| "no Microsoft app to sign in with" | Esta compilación de `mail` aún no tiene la aplicación de Microsoft de WireCat. Registra la tuya ([pasos](./oauth-microsoft.md)) y ejecuta `mail config set --defaults microsoft_client_id <id>`. |
| "refused the OAuth token from this sign-in" | El inicio de sesión en el navegador funcionó, pero el servidor de correo rechazó el token nuevo. En Outlook.com, IMAP está desactivado por defecto: abre Settings (la rueda dentada), "Mail", "Forwarding and IMAP", activa "Let devices and apps use IMAP", pulsa "Save" y luego `session start` otra vez. En Microsoft 365, IMAP puede estar desactivado para el buzón; pregunta a un administrador. |
| "refused the OAuth token even after a refresh" | Se revocó el inicio de sesión (cambio de contraseña, sesiones cerradas o aplicación quitada). Ejecuta `mail <profile> session start` otra vez. |
| Microsoft dice que un administrador debe aprobar la aplicación | Tu organización solo permite aplicaciones aprobadas. Pide a un administrador que dé el consentimiento o que registre la aplicación propia de la organización ([pasos](./oauth-microsoft.md)) y te dé su id. |
| "Microsoft refused the OAuth login for sending" | Leer funciona pero enviar no: "Authenticated SMTP" está desactivado en el buzón de Microsoft 365, a menudo por los valores de seguridad predeterminados. Un administrador lo activa por buzón. |
| Gmail con OAuth deja de funcionar al cabo de una semana | La aplicación de Google sigue en Testing, donde Google cierra los inicios de sesión a los 7 días. Publícala ([pasos](./oauth-google.md#4-publish-the-app-production-without-verification)) y luego `session start` otra vez. `mail doctor` avisa desde el día 6. |
| Se rechaza una escritura | Lo impiden los permisos del perfil o `MAIL_READ_ONLY`; consulta [los ajustes](./configuration.md#permissions). |

Nunca pegues un token, una contraseña ni contenido privado en una petición de soporte.
