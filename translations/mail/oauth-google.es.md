---
title: "Gmail con tu propia aplicación de Google"
---

Gmail funciona con una contraseña de aplicación, y `mail` usa una por defecto. Usa OAuth en su lugar cuando no puedas
crear una contraseña de aplicación: la cuenta no tiene verificación en dos pasos, o un dominio de Google Workspace
desactiva las contraseñas de aplicación.

Un inicio de sesión de Gmail con OAuth usa la aplicación de Google de WireCat, salvo que indiques la tuya. Gana la
primera coincidencia: `--client-file <Desktop client JSON>`, luego `MAIL_GOOGLE_CLIENT_ID` (con
`MAIL_GOOGLE_CLIENT_SECRET`), luego el ajuste `google_client_id` del perfil (su secreto sigue viniendo de
`MAIL_GOOGLE_CLIENT_SECRET`) y, por último, la aplicación de WireCat. `mail doctor` muestra cuál usa un perfil en
`oauth_client`. Hacer pública una aplicación de Google compartida para el correo es
complejo, así que Google puede rechazar el inicio de sesión con la aplicación de WireCat. Si lo hace, crea tu propia
aplicación como se indica abajo (lleva unos 20 minutos y no cuesta nada) o usa una contraseña de aplicación.

## 1. Un proyecto de Google Cloud solo para el correo

Abre [Google Cloud Console](https://console.cloud.google.com/) y elige **New Project** (Proyecto nuevo) en el selector
de proyectos. Ponle un nombre, por ejemplo `mail for me`, y mantenlo seleccionado en todos los pasos siguientes.

Usa un proyecto nuevo aunque ya tengas uno para `drive` o `gcal`. Cuando se revoca un inicio de sesión, Google quita
todos los permisos concedidos a ese proyecto, para cada aplicación que contenga
([aplicaciones instaladas](https://developers.google.com/identity/protocols/oauth2/native-app)): un proyecto
compartido cerraría también la sesión de `drive` y de `gcal`.

## 2. Pantalla de consentimiento

Abre **☰ → Google Auth platform → Branding** ([enlace directo](https://console.cloud.google.com/auth/branding)) y elige
**Get Started**. Indica un nombre de aplicación (`mail for me`), tu dirección como correo de asistencia y de contacto, y
el público **External** (o **Internal** para una cuenta de Workspace que solo usas tú). Créala.

## 3. Permiso

Abre **Google Auth platform → Data Access** ([enlace directo](https://console.cloud.google.com/auth/scopes)), elige
**Add or Remove Scopes** y añade `https://mail.google.com/` a mano en el campo de entrada manual. Guarda. Es el único
ámbito (scope) que Gmail ofrece para IMAP y SMTP
([XOAUTH2](https://developers.google.com/workspace/gmail/imap/xoauth2-protocol)). `mail` también pide `openid` y
`email`, para comprobar que iniciaste sesión con la cuenta correcta.

La página de Google no dice si hay que activar la API de Gmail solo para IMAP. Si el inicio de sesión funciona y luego
`session status --check` falla, activa la
[API de Gmail](https://console.cloud.google.com/apis/library/gmail.googleapis.com) en este proyecto e inténtalo de
nuevo.

## 4. Publica la aplicación (Production), sin verificación

Abre **Google Auth platform → Audience** ([enlace directo](https://console.cloud.google.com/auth/audience)) y elige
**Publish app**; después confirma. No la envíes a verificación.

Mientras una aplicación External está en **Testing**, Google cierra sus inicios de sesión a los 7 días
([caducidad del token de actualización](https://developers.google.com/identity/protocols/oauth2#expiration)), y una
sincronización programada se detiene una vez por semana. Una aplicación publicada conserva el inicio de sesión. Google
no pide verificación a una aplicación personal con menos de 100 usuarios
([excepciones](https://support.google.com/cloud/answer/13464323)); al iniciar sesión muestra «Google hasn't verified
this app»: elige **Advanced** y después **Go to mail for me (unsafe)**. Es tu propia aplicación.

Si dejas la aplicación en Testing, añade tu dirección en **Test users** y cuenta con ejecutar `session start` cada
semana; `mail doctor` avisa a partir del sexto día.

## 5. Cliente de escritorio

Abre **Google Auth platform → Clients** ([enlace directo](https://console.cloud.google.com/auth/clients)), elige
**Create Client**, **Application type → Desktop app**, un nombre y **Create**. Elige **Download JSON** y guarda el
archivo fuera de cualquier repositorio. Hazlo legible solo para ti, o `mail` lo rechaza:

```sh
chmod 600 ~/Downloads/client_secret_*.json
```

El archivo nombra la aplicación; no es tu acceso. `mail` lo lee una vez, al iniciar sesión, y guarda el id y el secreto
de la aplicación junto con los tokens en el llavero.

## 6. Inicia sesión

Un perfil nuevo:

```sh
mail gm session start --address me@gmail.com --client-file ~/Downloads/client_secret_XXXX.json
```

`--client-file` hace que un perfil nuevo de Gmail inicie sesión con OAuth. Un perfil de Gmail que ahora usa
una contraseña de aplicación: cámbialo primero, en una terminal (un agente no puede cambiar `auth`):

```sh
mail gm config set auth oauth
mail gm session start --client-file ~/Downloads/client_secret_XXXX.json
```

El navegador abre la página de Google. Elige la cuenta, permite el acceso, y `mail` comprueba la dirección e inicia
sesión en IMAP antes de guardar nada. En un perfil que ya cambió a OAuth, `MAIL_GOOGLE_CLIENT_ID` y
`MAIL_GOOGLE_CLIENT_SECRET` pueden sustituir a `--client-file`; sin ninguno de los dos, `mail gm session start` inicia sesión con la
aplicación de WireCat.

## Cerrar sesión

`mail gm session end` olvida el inicio de sesión en este ordenador y conserva el correo. `--revoke` además pide a Google
que lo revoque, lo que quita todos los permisos de todo el proyecto de Google; con un proyecto solo para el correo, eso
es únicamente `mail`.
