---
title: "Instalar"
---

Instala `gcal` una vez en cada ordenador donde lo uses tú o un agente. Necesitas Node.js 22.16 o una versión 22.x posterior, o la 24 o posterior; Node 23 no es compatible.

```sh
npm install -g @wirecat/gcal-cli
gcal --version
```

Comprueba la instalación y luego elige un nombre de perfil para tu cuenta, por ejemplo `personal`:

```sh
gcal doctor
```

`doctor` no necesita red ni abre ningún llavero. Muestra la versión, dónde están los ajustes, qué perfiles existen y si
otros usuarios del ordenador pueden leer los ajustes.

## Conecta tu cuenta de Google

`gcal` inicia sesión a través de una aplicación de Google, llamada cliente OAuth. Google usa esa aplicación para
preguntarte qué acceso das a `gcal`. Hay dos formas de conseguir una.

**La aplicación de WireCat.** Un paquete de `gcal` puede incluir la aplicación de Google de WireCat. Las versiones
actuales todavía no la incluyen, así que por ahora cada usuario crea la suya. Compruébalo con `gcal doctor --json`: si
`oauth_client.client` es `wirecat`, el paquete trae la aplicación e inicias sesión sin un proyecto de Google Cloud
propio:

```sh
gcal personal session start
```

Hasta que Google termine de revisar la aplicación de WireCat, puede mostrar antes una página «unverified app»
(aplicación no verificada). Para seguir, usa el enlace de esa página que lleva a la aplicación y luego permite la
lectura de Calendar. Google limita una aplicación no verificada a 100 usuarios nuevos en total; cuando la aplicación de
WireCat llegue a ese límite, usa tu propia aplicación, como se explica abajo. Consulta
[la página de Google sobre aplicaciones no verificadas](https://support.google.com/cloud/answer/7454865).

**Tu propia aplicación.** Si `oauth_client.client` es `null`, el paquete no trae la aplicación de WireCat y
`session start` necesita una tuya. [Crea tu propia aplicación de Google](#make-your-own-google-app) una vez, en unos diez
minutos, y pasa su archivo:

```sh
gcal personal session start --client-file ~/client_secret.json
```

Tu aplicación también gana cuando el paquete trae la de WireCat: pasa `--client-file` o define `GCAL_GOOGLE_CLIENT_ID`
y `GCAL_GOOGLE_CLIENT_SECRET`.

## Crea tu propia aplicación de Google

Se hace una vez, en [Google Cloud Console](https://console.cloud.google.com/), con la cuenta de Google que usarás con
`gcal`. Es gratis. La aplicación es solo tuya: nadie más inicia sesión con ella. Si un paso falla, consulta
[problemas al iniciar sesión](./troubleshooting.md#sign-in-problems).

### 1. Elige un proyecto

Abre el [selector de proyectos](https://console.cloud.google.com/projectselector2/home/dashboard). Elige un proyecto que
ya tengas, o elige **New project**, ponle un nombre como `gcal` y elige **Create**. Mantén este proyecto seleccionado en
la barra superior durante todos los pasos siguientes.

### 2. Activa la API de Google Calendar

Abre la [página de la API de Google Calendar](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com)
y elige **Enable**. Si te saltas este paso, el inicio de sesión funciona igual, pero el primer comando que lee Calendar
falla con «the Google Calendar API is turned off for this OAuth project».

### 3. Branding

Abre **Google Auth platform → [Branding](https://console.cloud.google.com/auth/branding)**. Si la página ofrece
**Get started**, elige esa opción. Para uso propio, rellena solo estos campos:

- **App name**: cualquier nombre que reconozcas, como `My gcal`. Google lo muestra al iniciar sesión.
- **User support email**: tu propia dirección.
- **Audience**: **External**. **Internal** solo sirve para una cuenta de una organización de Google Workspace, y solo
  para los usuarios de esa organización.
- **Contact information**: otra vez tu dirección.

Acepta la política de datos de usuario de Google y elige **Create**. Puedes dejar vacíos el logotipo, la página de
inicio y el enlace a la política de privacidad. La
[guía de Google sobre la pantalla de consentimiento](https://developers.google.com/workspace/guides/configure-oauth-consent)
describe cada campo.

### 4. Audience

Abre **Google Auth platform → [Audience](https://console.cloud.google.com/auth/audience)**. El tipo de usuario es
**External** y el estado de publicación empieza en **Testing**.

En **Test users**, elige **Add users**, escribe la cuenta de Google con la que iniciarás sesión y guarda. Mientras la
aplicación está en Testing, Google solo deja iniciar sesión a los usuarios de prueba.

Después elige cuánto dura un inicio de sesión:

| Estado de publicación | Qué pasa |
| --- | --- |
| **Testing** | El inicio de sesión termina 7 días después de dar tu consentimiento. Entonces los comandos fallan y vuelves a ejecutar `session start`. Solo pueden iniciar sesión los usuarios de prueba, como máximo 100. |
| **In production** | Sin límite de 7 días. Google puede mostrar una página «unverified app» en cada inicio de sesión, y la pasas. Una aplicación no verificada puede tener como máximo 100 usuarios, y tú eres uno. |

Para una aplicación que solo usas tú, recomendamos **In production**. Elige **Publish app**, confirma y después inicia
sesión. No necesitas la verificación de Google: Google no la exige para una aplicación de uso personal con menos de 100
usuarios, y deja que esos usuarios pasen la advertencia. Quédate en **Testing** si no quieres ver la advertencia y
aceptas iniciar sesión de nuevo cada semana.

Las páginas de Google sobre esto:

- [Caducidad del token de actualización](https://developers.google.com/identity/protocols/oauth2#expiration): los 7
  días para una aplicación External en Testing que pide más que nombre, correo y perfil, como el acceso a Calendar.
- [Gestionar la audiencia de la aplicación](https://support.google.com/cloud/answer/15549945): Testing, usuarios de
  prueba, In production.
- [Aplicaciones no verificadas](https://support.google.com/cloud/answer/7454865): la página de advertencia y el límite
  de 100 usuarios.
- [Cuándo no hace falta la verificación](https://support.google.com/cloud/answer/13464323): uso personal.

### 5. Data Access

Abre **Google Auth platform → [Data Access](https://console.cloud.google.com/auth/scopes)**. Este paso es opcional para
tu propia aplicación: `gcal` pide sus permisos a Google al iniciar sesión de todos modos. Google dice que un permiso que
no añadiste aquí hace que muestre la página de aplicación no verificada
([gestionar el acceso a datos](https://support.google.com/cloud/answer/15549135)), y tu aplicación ya la muestra.
Añadir los permisos los lista en la página de consentimiento, así ves lo que permites.

Para añadirlos, elige **Add or remove scopes**, pega los permisos en **Manually add scopes**, elige **Add to table**,
**Update** y luego **Save**:

| Permiso | Cuándo lo pide `gcal` |
| --- | --- |
| `openid`, `email` | Siempre: `gcal` sabe qué cuenta inició sesión. |
| `https://www.googleapis.com/auth/calendar.readonly` | Siempre: leer tus calendarios y eventos. |
| `https://www.googleapis.com/auth/calendar.events` | Con `--grant write`: crear, cambiar y borrar eventos, y responder a invitaciones. |
| `https://www.googleapis.com/auth/calendar.acls` | Con `--grant sharing`: ver y cambiar quién puede ver un calendario. |

`--grant` se suma al permiso de lectura; nunca lo sustituye.

### 6. Crea el cliente y descarga su archivo

Abre **Google Auth platform → [Clients](https://console.cloud.google.com/auth/clients)** y elige **Create client**. En
**Application type** elige **Desktop app**, ponle cualquier nombre y elige **Create**.

En el diálogo que aparece, elige **Download JSON**. Hazlo ya: Google muestra el secreto completo del cliente solo una
vez, al crearlo ([gestionar clientes OAuth](https://support.google.com/cloud/answer/15549257)). Si cerraste el diálogo,
abre el cliente, añade un secreto nuevo y descarga el archivo otra vez.

El nombre del archivo empieza por `client_secret_`. Mueve el archivo a tu carpeta personal como
`client_secret.json` y haz que solo tú puedas leerlo. `gcal` rechaza un archivo de cliente que puedan leer otros usuarios del ordenador.

```sh
mv ~/Downloads/client_secret_*.json ~/client_secret.json
chmod 600 ~/client_secret.json
```

No crees un cliente **Web application**: `gcal` inicia sesión a través de una dirección local de tu ordenador, y eso
solo lo permite un cliente Desktop app. Consulta la
[guía de Google sobre credenciales de Desktop app](https://developers.google.com/workspace/guides/create-credentials#desktop-app).

### 7. Inicia sesión

Elige un nombre de perfil para esta cuenta de Google, como `personal`, e inicia sesión:

```sh
gcal personal session start --client-file ~/client_secret.json
```

Así `gcal` obtiene acceso de lectura. Para que también pueda crear, cambiar y borrar eventos, pídelo al iniciar sesión:

```sh
gcal personal session start --client-file ~/client_secret.json --grant write
```

En lugar del archivo, puedes definir `GCAL_GOOGLE_CLIENT_ID` y `GCAL_GOOGLE_CLIENT_SECRET` con el `client_id` y el
`client_secret` que contiene. `--client-file` gana sobre ellas.

`gcal` guarda el cliente junto con el inicio de sesión, en el llavero del sistema. Los comandos siguientes, y cada
renovación del inicio de sesión, no vuelven a leer el archivo, así que puedes guardarlo en un lugar seguro. Solo un
nuevo `session start` lo necesita.

### 8. Qué muestra Google en el navegador

`session start` abre en el navegador la página de inicio de sesión de Google. Después:

1. Elige la cuenta de Google que usarás con este perfil.
2. Google puede decir que no ha verificado la aplicación. Es tu propia aplicación, así que usa el enlace de esa página
   que lleva a ella.
3. Google lista lo que pide `gcal`, cada cosa con una casilla. Deja marcada **Calendar**. Con `--grant write`, deja
   marcado también el acceso a los eventos. Si desmarcas una, `gcal` rechaza el inicio de sesión y te pide ejecutar
   `session start` otra vez.
4. Elige **Continue**. El navegador dice «Sign-in received; you can close this tab» y `gcal` muestra la cuenta con la
   que iniciaste sesión.

`gcal` espera 5 minutos a que termines en el navegador. Comprueba el resultado con `gcal personal session status`.

Siguiente paso: [úsalo](./usage.md).
