---
title: "Preparar el buzón"
---

<!-- Generated from src/providers.ts by pnpm generate. Do not edit. -->

Usa esta página antes de `mail <profile> session start`, que pide la contraseña de aplicación. Cada proveedor necesita IMAP activado y, la mayoría, una contraseña de aplicación:
una contraseña creada solo para este programa. Al final tendrás una contraseña de aplicación lista para escribir en el aviso.

`mail <profile> session start` imprime estos mismos pasos y repite la
causa probable cuando el servidor rechaza el inicio de sesión. Los pasos de abajo se leyeron en la página de ayuda oficial de cada proveedor,
citada bajo cada uno. Las etiquetas se citan en el idioma de la interfaz del proveedor. Un proveedor puede cambiar
sus pantallas; la página de ayuda es la fuente de verdad.

## Yandex

1. Abre <https://mail.yandex.ru/#setup/client> (o el engranaje, «Все настройки», «Почтовые программы»).
2. En «Разрешить доступ к почтовому ящику с помощью почтовых клиентов» activa «С сервера imap.yandex.ru по протоколу IMAP».
3. Comprueba que «Пароли приложений и OAuth токены» está activado y guarda.
4. Abre <https://id.yandex.ru/security>, pestaña «Безопасность», sección «Доступ к вашим данным», «Пароли приложений».
5. En «Создать пароль приложения» elige el tipo «Почта», pon un nombre a la contraseña y pulsa «Далее».
6. Copia la contraseña enseguida: Yandex la muestra una sola vez.

- Una contraseña de aplicación nueva empieza a funcionar de 2 a 3 horas después de crearla (ayuda de Yandex ID).
- En un dominio empresarial de Yandex 360, un ajuste del administrador podría bloquear las contraseñas de aplicación. Las páginas de ayuda no lo confirman; pregunta al administrador del dominio si el inicio de sesión sigue fallando.

Leído en: <https://yandex.ru/support/yandex-360/customers/mail/ru/mail-clients/others>, <https://yandex.ru/support/id/ru/authorization/app-passwords>

## Gmail

1. Cuenta de Google personal: IMAP siempre está activado, no hay nada que cambiar. Google Workspace: lo controla el administrador, y puede faltar la pestaña "Forwarding and POP/IMAP" en Ajustes de Gmail, "See all settings".
2. Activa la verificación en dos pasos de la cuenta de Google.
3. Abre <https://myaccount.google.com/apppasswords> y crea una contraseña de aplicación. La página de ayuda de Google no lista las etiquetas de esa pantalla, así que aquí no se cita ninguna.
4. Copia la contraseña de 16 dígitos y úsala en lugar de la contraseña de la cuenta.

- No se ofrecen contraseñas de aplicación si la verificación en dos pasos solo está configurada con llaves de seguridad, en una cuenta de trabajo o de centro educativo, o con la Protección avanzada activada.

Leído en: <https://support.google.com/mail/answer/7126229>, <https://support.google.com/accounts/answer/185833>

## iCloud

1. Activa la autenticación de dos factores para la cuenta de Apple.
2. Ve a <https://account.apple.com> e inicia sesión.
3. En la sección "Sign In and Security" selecciona "App Specific Passwords".
4. Selecciona "Generate an app specific password" y sigue los pasos en pantalla.
5. Copia la contraseña cuando aparezca; la página de Apple no dice si se puede volver a mostrar.

- `mail` inicia sesión con la dirección completa. Apple dice que lo habitual es usar como usuario el nombre anterior a @icloud.com; si se rechaza la dirección completa, inicia sesión con un nombre de perfil nuevo: `mail <profile> session start --address <address> --login <name>`.

Leído en: <https://support.apple.com/en-us/102654>, <https://support.apple.com/en-us/102525>

## Mail.ru

1. Abre <https://e.mail.ru/inbox>.
2. Abajo a la izquierda pulsa «Настройки», luego «Все настройки», «Безопасность», «Пароли для внешних приложений».
3. Pulsa «Создать», escribe un nombre y pulsa «Продолжить».
4. Elige «Полный доступ к Почте» como tipo de protocolo y pulsa «Продолжить».
5. Copia la contraseña: Mail.ru no la conserva, así que no se puede ver después.

- La página de ayuda de Mail.ru exige un número de teléfono vinculado al buzón (compruébalo en «Контакты и адреса»). No lista un interruptor de IMAP aparte, solo los datos del servidor.

Leído en: <https://help.mail.ru/mail/login/mailer/>

## Fastmail

1. En la interfaz web de Fastmail ve a Settings, "Privacy & Security".
2. En "Connected apps & API tokens" pulsa "Manage app passwords and access".
3. Pulsa "New app password" (si aparece "Verify it's you", escribe tu contraseña y pulsa "Continue").
4. Elige un nombre y mantén el acceso "Mail, Contacts & Calendars", que incluye IMAP.
5. Pulsa "Generate password", cópiala y pulsa "Done".

- Los planes Basic de Fastmail no pueden crear contraseñas de aplicación.

Leído en: <https://www.fastmail.help/hc/en-us/articles/360058752854-App-passwords>

## Outlook

1. Outlook.com: abre Settings (la rueda dentada), "Mail", "Forwarding and IMAP", activa "Let devices and apps use IMAP" y guarda.
2. La página de Microsoft lista solo OAuth2 (Modern Auth) para IMAP y no lista contraseñas de aplicación para él. El inicio de sesión con OAuth llegará en una fase posterior de `mail`, así que todavía no se puede guardar un perfil.

- Las cuentas de trabajo y de centro educativo de Microsoft 365 no se leyeron en una página oficial: sus pasos no están verificados.

Leído en: <https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-for-outlook-com-d088b986-291d-42b8-9564-9c414e2aa040>

## Cualquier otro proveedor

Comprueba que IMAP está activado en el buzón y, si el proveedor ofrece contraseñas de aplicación, crea una: una contraseña normal suele rechazarse.

`session start` busca el servidor de un perfil nuevo mediante el registro MX, el ISPDB de Thunderbird y el archivo autoconfig del dominio. Si no encuentra
ninguno, pasa `--host`, `--port` y `--security` tú mismo. Consulta [el uso](./usage.md).
