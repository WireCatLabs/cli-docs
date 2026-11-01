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
| `profile.wrong-account` o `profile.same-account` | Cada cuenta de Google tiene un solo perfil. Usa el perfil que ya tiene esa cuenta, o un nombre de perfil nuevo para una cuenta nueva. |
| `oauth.not-saved` | El archivo de sesión (`credentials.json` en la carpeta de estado, que usan `--credential-storage file` y cualquier ejecución en la que falla el llavero) existe, pero no se puede leer como archivo de sesión. Apártalo e inicia sesión de nuevo. |
| "the WireCat Google client in this gcal package cannot be read" | El paquete está dañado. Instala `gcal` de nuevo o pasa `--client-file` con tu propio cliente. |
| Se rechaza una escritura | Lo impiden los permisos del perfil o `GCAL_READ_ONLY`; consulta los [ajustes](./configuration.md#permissions). |

## Problemas al iniciar sesión

Aparecen mientras [creas tu propia aplicación de Google](./installation.md#make-your-own-google-app) e inicias sesión
con ella. Una fila que dice «en el navegador» es la página de Google; los demás textos son lo que imprime `gcal`.

| Síntoma | Causa y solución |
| --- | --- |
| "no Google OAuth client is set up" | El paquete no trae la aplicación de WireCat y no indicaste ningún cliente. Pasa `--client-file` con el archivo de tu cliente Desktop app, o define `GCAL_GOOGLE_CLIENT_ID` y `GCAL_GOOGLE_CLIENT_SECRET`. |
| `doctor` muestra `oauth_client.client: null` | No hay ningún cliente en el entorno y el paquete no trae la aplicación de WireCat. Un perfil que inició sesión con `--client-file` sigue funcionando: su sesión guarda el cliente. Solo un nuevo `session start` lo necesita. |
| "the client file can be read by other users of this computer" | Ejecuta el `chmod 600` que indica el mensaje y luego `session start` otra vez. |
| "could not read a Desktop app OAuth client JSON from the client file" | El archivo no es de un cliente Desktop app. El archivo de un cliente **Web application** tiene otra forma. En Google Cloud Console, crea un cliente del tipo **Desktop app** ([paso 6](./installation.md#6-make-the-client-and-download-its-file)) y pasa su archivo. |
| Google muestra `redirect_uri_mismatch` en el navegador | `GCAL_GOOGLE_CLIENT_ID` es de un cliente Web application. `gcal` inicia sesión a través de una dirección local de tu ordenador, y eso solo lo permite un cliente Desktop app. Crea un cliente Desktop app y usa su ID y su secreto. |
| Google muestra `deleted_client` o `invalid_client` en el navegador, o dice que no encuentra el cliente | El cliente se eliminó o el ID del cliente es incorrecto. Google puede restaurar un cliente eliminado durante 30 días; si no, crea un cliente nuevo ([paso 6](./installation.md#6-make-the-client-and-download-its-file)). |
| "Google sign-in was refused (HTTP …)" justo después de permitir el acceso | Google rechazó el cliente cuando `gcal` pidió el inicio de sesión. Lo más habitual es que el secreto no corresponda al ID del cliente, por ejemplo después de añadir un secreto nuevo. Descarga el archivo con el secreto actual y pásalo de nuevo. |
| Google bloquea en el navegador el inicio de sesión porque la aplicación no está verificada o no tienes acceso, y `gcal` termina con "Google sign-in timed out" | La aplicación está en **Testing** y esta cuenta de Google no es usuario de prueba. Añádela en **Audience → Test users** ([paso 4](./installation.md#4-audience)) o publica la aplicación, y ejecuta `session start` de nuevo. |
| "Google sign-in was declined" | Elegiste **Cancel** en la página de Google. Ejecuta `session start` de nuevo y permite el acceso. |
| Google muestra una página «unverified app» | Google no ha verificado la aplicación: la tuya, o la de WireCat hasta que Google termine de revisarla. Usa el enlace de la página que lleva a la aplicación. |
| "Google did not grant read access to Calendar" (`sign-in.scope-missing`) | La página de consentimiento de Google permite desmarcar Calendar. Ejecuta `session start` de nuevo y déjalo marcado. Con `--grant write`, "Google did not grant the write permission": deja marcado también el acceso a los eventos. |
| "the Google Calendar API is turned off for this OAuth project" | El inicio de sesión funcionó, pero la API de Calendar del proyecto está desactivada. [Activa la API](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com) en el proyecto de tu cliente, espera unos minutos y vuelve a ejecutar el comando. |
| "Google sign-in was refused (HTTP 400); run gcal personal session start again" (`oauth.expired`) una semana después de iniciar sesión | Tu aplicación está en **Testing**, donde un inicio de sesión termina 7 días después del consentimiento ([nota de Google](https://developers.google.com/identity/protocols/oauth2#expiration)). Ejecuta `session start` de nuevo. Para evitarlo, publica la aplicación: consulta el [paso 4](./installation.md#4-audience). |

Nunca pegues un token, una contraseña ni contenido privado en una solicitud de soporte.
