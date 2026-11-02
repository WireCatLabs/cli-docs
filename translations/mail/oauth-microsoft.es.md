---
title: "Registrar una aplicación de Microsoft"
---

Outlook.com y Microsoft 365 solo aceptan OAuth para IMAP y SMTP, así que `mail` inicia sesión a través de una
aplicación de Microsoft. Esta página es para quien registra esa aplicación: WireCat una vez para todos, o tú para ti.
Lleva alrededor de media hora y no cuesta nada.

Cuando la aplicación existe, su **Application (client) ID** va o bien dentro de `mail` (la aplicación de WireCat), o
bien, una sola vez, en tu configuración:

```sh
mail config set --defaults microsoft_client_id <application-client-id>
```

Solo puedes establecerlo tú, en una terminal: a un agente por MCP se le rechaza, igual que con los ajustes del servidor
de correo. El id es público; una aplicación de escritorio no tiene secreto.

## Qué necesitas

- Una cuenta de Microsoft que pueda crear aplicaciones en un tenant de Microsoft Entra. Una cuenta de trabajo o de
  centro educativo suele poder. Una cuenta personal de Outlook.com no tiene tenant propio: antes crea una cuenta de
  Azure gratuita, que lo genera
  ([registrar una aplicación](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app),
  requisitos previos).
- Un buzón personal de Outlook.com, para probar la aplicación al final.

## Pasos

1. Abre el [centro de administración de Microsoft Entra](https://entra.microsoft.com) e inicia sesión.
2. Abre **App registrations** (escríbelo en el cuadro de búsqueda de arriba) y elige **New registration**.
3. Rellena el formulario:
   - **Name**: `WireCat mail` (los usuarios lo ven en la página de consentimiento).
   - **Supported account types**: **Any Entra ID Tenant + Personal Microsoft accounts**. Sin las cuentas personales,
     los usuarios de Outlook.com no pueden iniciar sesión.
   - **Redirect URI**: déjalo vacío aquí; el paso 6 lo añade.
4. Elige **Register**. Se abre la página **Overview** de la aplicación. Copia el **Application (client) ID**: es el id
   que `mail` necesita.
5. Permite el inicio de sesión de escritorio: en **Manage**, elige **Authentication**. En **Advanced settings**,
   cambia **Allow public client flows** a **Yes** y elige **Save**.
6. Añade el URI de redirección. En **Manage**, elige **Authentication**, después **Add a platform** y luego **Mobile
   and desktop applications**. En **Custom redirect URIs** escribe `http://localhost/callback`, sin puerto, y elige
   **Configure**. `mail` inicia sesión mediante `http://localhost:<port>/callback` con un puerto nuevo cada vez;
   Microsoft ignora el puerto solo en las direcciones `localhost` y exige que la ruta coincida
   ([reglas de URI de redirección](https://learn.microsoft.com/en-us/entra/identity-platform/reply-url)). No hace falta
   editar el manifiesto. No pongas la dirección bajo una plataforma **Web**: ese tipo de aplicación espera un secreto
   de cliente, y el inicio de sesión de un cliente público falla con ella. Si la dirección ya aparece en **Web**,
   quítala de ahí.
7. Enumera los permisos, para que la página de consentimiento y los administradores los vean de antemano. El inicio de
   sesión los pide por nombre de todos modos
   ([ámbitos](https://learn.microsoft.com/en-us/exchange/client-developer/legacy-protocols/how-to-authenticate-an-imap-pop-smtp-application-by-using-oauth)),
   así que este paso es recomendable, no obligatorio. La página de Microsoft no da pasos del portal para estos
   permisos delegados; suelen estar en **Manage**, **API permissions**, **Add a permission**, **Microsoft Graph**,
   **Delegated permissions** (si no, **APIs my organization uses**, **Office 365 Exchange Online**). Marca:
   - `IMAP.AccessAsUser.All`
   - `SMTP.Send`
   - `offline_access`

   Elige **Add permissions**. No concedas el consentimiento del administrador para ellos: cada persona los permite para
   su propio buzón al iniciar sesión. Microsoft deja que los usuarios lo hagan por defecto para su propio correo
   ([consentimiento del usuario](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-user-consent)).
8. Prueba la redirección. Pon el id en tu configuración como arriba y luego inicia sesión dos veces:

   ```sh
   mail config set --defaults microsoft_client_id <application-client-id>
   mail outlook-test session start --address <your-address>@outlook.com
   mail outlook-test session start
   ```

   Ambos deben terminar con `signed_in: true`. Si la página de Microsoft muestra un error con `AADSTS50011` (el URI de
   redirección no coincide), comprueba que la dirección bajo **Mobile and desktop applications** es exactamente
   `http://localhost/callback`.
9. Para la aplicación propia de WireCat: envía el Application (client) ID a los responsables del mantenimiento. Ellos
   lo ponen en `WIRECAT_MICROSOFT_CLIENT_ID` en `src/oauth.ts`, y la próxima versión inicia sesión sin configuración.

## Más adelante, y no hace falta para empezar

- **Publisher verification** (verificación del editor) añade una insignia de verificado a la página de consentimiento, y
  algunas organizaciones solo permiten aplicaciones verificadas. Es gratis, pero necesita una cuenta del Microsoft AI
  Cloud Partner Program y un dominio propio verificado
  ([verificación del editor](https://learn.microsoft.com/en-us/entra/identity-platform/publisher-verification-overview)).
  Hasta entonces, un usuario de Microsoft 365 cuyo administrador restringe el consentimiento pide al administrador que
  apruebe la aplicación, o que registre la aplicación propia de la organización con estos pasos y le dé su id.
- **Enviar desde Microsoft 365** necesita «Authenticated SMTP» activado en el buzón. Los valores de seguridad
  predeterminados y las organizaciones creadas después de enero de 2020 lo desactivan; un administrador lo activa por
  buzón
  ([SMTP AUTH](https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission)).
  Leer funciona en ambos casos.

## Qué pide el inicio de sesión

| Scope | Qué hace `mail` con él |
|---|---|
| `https://outlook.office.com/IMAP.AccessAsUser.All` | leer y modificar el correo por IMAP |
| `https://outlook.office.com/SMTP.Send` | enviar correo como la cuenta por SMTP |
| `offline_access` | un token de actualización, para que una sincronización programada no necesite un inicio de sesión nuevo |

Los tokens se quedan en el llavero del sistema del ordenador que inició sesión, igual que las contraseñas de
aplicación. `mail <profile> session
end` los olvida; Microsoft sigue listando la aplicación hasta que la quitas en
<https://www.microsoft.com/consent> (cuenta personal) o <https://myapps.microsoft.com> (cuenta de trabajo o de
centro educativo).
