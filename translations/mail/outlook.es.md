---
title: "Conectar Outlook.com o Microsoft 365"
---

Usa esta página para conectar un buzón de Outlook.com, Hotmail o Microsoft 365 a `mail`. Inicias sesión en Microsoft en
el navegador y apruebas el acceso. No escribes ninguna contraseña en `mail`, y la aplicación de Microsoft de WireCat ya
viene incluida, así que no registras nada. Al terminar, `mail` lee tu correo en el almacén local y puede enviar desde
esa dirección.

## Antes de empezar

1. Instala `mail` ([instalación](./installation.md)).
2. Solo Outlook.com: activa IMAP. Microsoft lo tiene desactivado por defecto
   ([página de Microsoft](https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-for-outlook-com-d088b986-291d-42b8-9564-9c414e2aa040)).
   Con IMAP desactivado, el inicio de sesión en el navegador funciona pero el servidor de correo rechaza el token, así
   que saltarte este paso te saldrá caro:
   1. Abre [outlook.live.com](https://outlook.live.com) e inicia sesión.
   2. Elige Settings (la rueda dentada), luego "Mail" y "Forwarding and IMAP".
   3. Activa "Let devices and apps use IMAP" y pulsa "Save".
3. Cuenta de trabajo o de centro educativo de Microsoft 365: no hay nada que activar en el buzón. Lo que puede que un
   administrador tenga que permitir está en [cuenta de trabajo o de centro educativo](#work-or-school-account-microsoft-365).

## Iniciar sesión

Elige un nombre de perfil (aquí `outlook`) y usa tu propia dirección:

```sh
mail outlook session start --address you@outlook.com
```

`mail` abre el navegador en la página de inicio de sesión de Microsoft. Inicia sesión y aprueba el acceso. La pestaña
dirá "Sign-in received; you can close this tab". Vuelve a la terminal: `mail` responde con el perfil, `signed_in`, el
inicio de sesión (`auth` es `oauth`, `provider` es `microsoft`, `client` es `wirecat`), los permisos concedidos
(`IMAP.AccessAsUser.All` y `SMTP.Send`) y las carpetas que encontró.

En un ordenador sin navegador, por ejemplo por SSH, añade `--no-browser`. `mail` imprime el enlace; ábrelo en cualquier
ordenador, inicia sesión y la terminal termina igual.

## Leer y enviar

```sh
mail outlook sync                                  # INBOX and Sent by default
mail outlook schedule command mail-outlook --every 5m -- sync   # sync every 5 minutes
mail outlook search messages invoice               # search what sync stored
```

Enviar usa el mismo inicio de sesión, por el servidor SMTP de Microsoft con OAuth. `mail` guarda una copia en Sent. Los
comandos están en [el uso](./usage.md) y en [todos los comandos](./commands.md).

## Cuenta de trabajo o de centro educativo (Microsoft 365)

Usa el mismo comando con tu dirección de trabajo. Las cuentas personales de Outlook.com y Hotmail no se ven afectadas
por esta sección.

### Qué ves y por qué

Una cuenta de trabajo o de centro educativo pertenece a una organización (un "tenant"), y un tenant puede no dejar que
los usuarios corrientes aprueben una aplicación multitenant como la de WireCat. En su lugar, el inicio de sesión se detiene en una página que dice "Need
admin approval" o con el error `AADSTS90094` (el administrador debe dar el consentimiento). Esa página la muestra el
navegador, así que `mail` no imprime ningún código de error de Microsoft. No es un fallo de tu cuenta ni de `mail`. Un
administrador debe actuar una vez, y después todos en la organización inician sesión como siempre. Microsoft describe la
regla en
[Configure risk-based step-up consent](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-risk-based-step-up-consent).

Elige una de las dos opciones siguientes y envíasela a tu administrador.

### Opción A: el administrador permite la aplicación de WireCat para la organización

El administrador abre este enlace en un navegador e inicia sesión con una cuenta de administrador. Sustituye `{tenant}`
por el dominio de la organización (por ejemplo `contoso.com`) o por su id de tenant:

```text
https://login.microsoftonline.com/{tenant}/v2.0/adminconsent?client_id=f7f05d3a-b948-4d50-b3ce-59c816ce69e9&scope=offline_access%20https://outlook.office.com/IMAP.AccessAsUser.All%20https://outlook.office.com/SMTP.Send&redirect_uri=http://localhost/callback
```

El formato viene del [protocolo de consentimiento de administrador](https://learn.microsoft.com/en-us/entra/identity-platform/v2-admin-consent)
de Microsoft: el punto de conexión `/v2.0/adminconsent` con `client_id`, `scope` (separado por espacios, escrito `%20` en
un enlace) y un `redirect_uri` registrado para la aplicación. La cuenta necesita un rol que pueda dar el consentimiento
en nombre de la organización, como Cloud Application Administrator o Privileged Role Administrator
([roles](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/grant-admin-consent#prerequisites)).

El administrador ve la página de consentimiento de Microsoft para WireCat. Lista los tres permisos. El administrador pulsa "Accept". Después Microsoft envía el navegador a `http://localhost/callback`; la
pestaña puede mostrar un error de conexión porque nada escucha ahí, y es lo esperado. El consentimiento ya está guardado.

Para deshacerlo, el administrador abre el [Microsoft Entra admin center](https://entra.microsoft.com), luego "Entra ID",
"Enterprise apps", "All applications", WireCat, "Permissions", la pestaña "Admin consent", y pulsa "Revoke permission"
en cada entrada. Para quitar la aplicación de la organización, el administrador elimina WireCat de "Enterprise apps"
([pasos](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/manage-application-permissions)).

### Opción B: la organización registra su propia aplicación

Si tu organización no permite aplicaciones de terceros, un administrador registra una aplicación privada, que funciona dentro de
su propio tenant:

1. En el Microsoft Entra admin center, registra una aplicación. Plataforma: "Mobile and desktop applications". Redirect
   URI: `http://localhost/callback`. Pon "Allow public client flows" en Yes.
2. Copia el Application (client) ID.
3. Cada usuario lo configura una vez, en una terminal:

   ```sh
   mail config set --defaults microsoft_client_id <application-client-id>
   ```

Los pasos completos, con los permisos que hay que listar, están en [registro de la aplicación de Microsoft](./oauth-microsoft.md).

### Enviar aún puede fallar

La organización también puede tener "Authenticated SMTP" desactivado para tu buzón. Los valores de seguridad
predeterminados, y las organizaciones creadas después de enero de 2020, lo tienen desactivado hasta que un administrador
lo activa. Leer funciona igual; solo falla el envío.

## Si no funciona

| Lo que ves | Qué hacer |
|---|---|
| "refused the OAuth token from this sign-in" | IMAP está desactivado. Actívalo como en [Antes de empezar](#before-you-start) y ejecuta `session start` otra vez. En Microsoft 365, pregunta a un administrador si IMAP está activado para el buzón. |
| `AADSTS90094` o "Need admin approval" | Mira [cuenta de trabajo o de centro educativo](#work-or-school-account-microsoft-365). |
| "Microsoft refused the OAuth login for sending", y leer funciona | "Authenticated SMTP" está desactivado en el buzón. Lo activa un administrador. |
| El navegador no se abre | Ejecuta el comando otra vez con `--no-browser` y abre el enlace impreso. |

Más errores: [solución de problemas](./troubleshooting.md).

## Avanzado: tu propia aplicación de Microsoft

Úsalo solo si tu organización exige su propia aplicación. Regístrala ([pasos](./oauth-microsoft.md)): plataforma "Mobile
and desktop applications", redirección `http://localhost/callback` sin puerto, nunca "Web". Después configura su id una
vez, en una terminal, con el id de tu aplicación en lugar del id de ejemplo:

```sh
mail config set --defaults microsoft_client_id 11111111-2222-3333-4444-555555555555
```

Solo tú puedes configurarlo; a un agente por MCP se le rechaza.
