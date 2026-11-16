---
title: "Instala y conecta"
---

amoCRM y Kommo guardan tus negociaciones, contactos y empresas en la nube, y un agente de IA no tiene forma de
leerlos ni de actualizar una negociación por ti. Al terminar esta página, `amo` está instalado y conectado a tu
cuenta, y tú o tu agente podéis leer y cambiar el CRM desde una terminal, desde un script o por MCP. `amo` es una
herramienta de línea de comandos de WireCat, un programa que ejecutas escribiendo su nombre en una terminal. Solo
cambia tu cuenta hasta donde lo permiten los permisos que pongas.

`amo` se conecta una vez por cuenta. Un administrador de la cuenta crea una integración privada en amoCRM o Kommo, y
las dos formas de iniciar sesión la usan: una clave que pegas o un inicio de sesión en el navegador.

**En esta página:**

1. [Instala](#install)
2. [Crea la integración](#create-the-integration)
3. [Inicia sesión con una clave](#sign-in-with-a-key)
4. [Inicia sesión con la integración](#sign-in-through-the-integration)
5. [Cuál elegir](#which-one-to-choose)
6. [Conecta en WireCat Desktop](#connect-in-wirecat-desktop)
7. [Cierra la sesión y retira el acceso](#sign-out-and-revoke-access)
8. [Siguiente: la primera sincronización](#next-the-first-sync)

## Instala

Instala `amo` una vez en cada ordenador donde lo uses tú o un agente. Necesitas Node.js 22.16 o un 22.x posterior, o
24 o posterior. Node 23 no está soportado.

```sh
npm install -g @wirecat/amo-cli
amo --version
amo doctor
```

`amo doctor` no usa la red ni abre el llavero. Muestra la versión, dónde están los ajustes, qué perfiles existen y si
otros usuarios del ordenador pueden leer los ajustes.

WireCat Desktop instalará `amo` por ti cuando amoCRM esté en su catálogo. Eso llega con la próxima versión de Desktop.

## Crea la integración

Lo hace un administrador de la cuenta, una vez. La misma integración sirve para la clave y para el inicio de sesión
en el navegador.

<!-- TODO screenshots, when the files exist:
  src/setup/assets/01-amomarket-menu.png (the ⋯ menu in амоМаркет)
  src/setup/assets/02-integration-form.png (the integration form) -->

En amoCRM (`<subdomain>.amocrm.ru`):

1. Abre **амоМаркет**, pulsa **⋯** arriba a la izquierda y elige **«Создать интеграцию»** (crear integración).
2. Dale un nombre y una descripción, como *WireCat*.
3. En **«Ссылка для перенаправления»** (la Redirect URI), escribe `https://wirecat.dev/webhooks/apps/amo-callback`.
   La clave no la usa, pero con ella la misma integración sirve también para iniciar sesión en el navegador.
4. En **«Предоставить доступ»**, marca **«Доступ к данным аккаунта»** (acceso a los datos de la cuenta).
5. Deja sin marcar **«Контроль дублей»** y **«Множественные источники»**, y guarda.

En una cuenta que no está marcada como técnica, amoCRM pide primero firmar una renuncia al soporte técnico para una
integración privada. Después, el soporte de amoCRM deja de aceptar avisos de errores del sistema en la cuenta, y la
renuncia no se puede retirar. Léela antes de firmar
([amoCRM: integraciones](https://www.amocrm.ru/developers/content/integrations/intro),
[amoCRM: paso a paso](https://www.amocrm.ru/developers/content/oauth/step-by-step)).

En Kommo (`<subdomain>.kommo.com` o `<subdomain>.amocrm.com`): Settings → Integrations → **Create integration**.
Rellena el nombre, la descripción y la misma **Redirect URL**. **Allow access** tiene todos los permisos marcados por
defecto. Deja sin marcar **Duplicate control** y **Multiple sources**, y guarda. Kommo no pide ninguna renuncia
([Kommo: integración privada](https://developers.kommo.com/docs/private-integration)).

## Inicia sesión con una clave

La clave es el token de larga duración de amoCRM. Actúa con los permisos del administrador que la creó.

<!-- TODO screenshots, when the files exist:
  src/setup/assets/03-keys-tab.png (the «Ключи» tab)
  src/setup/assets/04-generate-token.png (the end date and the token) -->

1. En la integración, abre la pestaña **«Ключи»** (en Kommo, **Keys and scopes**) y pulsa
   **«Сгенерировать токен»** (en Kommo, **Generate long-lived token**).
2. Elige una fecha de fin, de un día a cinco años.
3. Copia el token. Solo se muestra una vez
   ([amoCRM: paso a paso](https://www.amocrm.ru/developers/content/oauth/step-by-step),
   [Kommo: token de larga duración](https://developers.kommo.com/docs/long-lived-token)).
4. Elige un nombre de perfil para esta cuenta, como `work`, da la dirección de la cuenta y pega el token cuando `amo`
   lo pida:

   ```sh
   amo work session start --host https://example.amocrm.ru
   amo work session status --check
   ```

`session start` lee el token sin mostrarlo, o desde stdin. Lo comprueba con la cuenta y solo entonces lo guarda en el
llavero del sistema junto con la dirección. Con `--credential-storage file` lo guarda en un archivo privado.
`session status --check` muestra la cuenta y el usuario con el que actúa el token. La dirección se queda tal como la
escribes: `<subdomain>.amocrm.ru`, `<subdomain>.kommo.com` o `<subdomain>.amocrm.com`.

## Inicia sesión con la integración

Este inicio de sesión usa OAuth: permites la integración en el navegador, y cada persona actúa con sus propios
permisos.

1. En la pestaña **«Ключи»** de la integración (en Kommo, **Keys and scopes**), copia el ID de la integración. Ten
   también a mano la clave secreta.
2. Ejecuta, con tu dirección y tu ID:

   ```sh
   amo work session start --host https://example.amocrm.ru --client-id <integration ID>
   ```

3. Pega la clave secreta cuando `amo` la pida. No se muestra. También puede darla `AMO_AMOCRM_CLIENT_SECRET`.
4. El navegador abre amoCRM. Elige la cuenta y pulsa **«Разрешить»** (permitir).

`amo` guarda los tokens y renueva el token de acceso por sí mismo. La Redirect URI de la integración debe ser
`https://wirecat.dev/webhooks/apps/amo-callback`. Un inicio de sesión nuevo de cualquier tipo sustituye al otro del
perfil.

## Cuál elegir

- **La clave** es lo más sencillo: pegarla una vez y sin navegador. Actúa como el administrador que la creó y deja de
  funcionar en su fecha de fin. Entonces creas otra y vuelves a ejecutar `session start`.
- **El inicio de sesión con la integración** actúa como la persona que entra y no tiene fecha de fin que vigilar. El
  refresh token de amoCRM dura 3 meses, y `amo` recibe uno nuevo cada vez que renueva el token de acceso. Así sigue
  funcionando mientras `amo` se ejecute al menos una vez cada 3 meses. Tras una pausa más larga, vuelve a iniciar
  sesión ([amoCRM: paso a paso](https://www.amocrm.ru/developers/content/oauth/step-by-step)).

## Conecta en WireCat Desktop

Llega con la próxima versión de Desktop, cuando amoCRM esté en su catálogo. Desktop hará las mismas preguntas que
describe el propio `amo`, así que coinciden con la terminal:

1. **¿Qué cuenta?** La dirección en la que abres el CRM.
2. **Crea una integración privada.** Los pasos de [crea la integración](#create-the-integration).
3. **Crea el token.** Pega la clave de la pestaña «Ключи».
4. **Comprobando el token.** `amo` pregunta a la cuenta de quién es el token, y guarda la dirección y el token solo si
   la cuenta responde. Un token rechazado te devuelve al paso del token.
5. **Conectado.** El perfil está listo.

Desktop inicia sesión con la clave. El inicio de sesión en el navegador es el comando de terminal que aparece en
**Advanced** en el último paso.

## Cierra la sesión y retira el acceso

`amo work session end` olvida el inicio de sesión en este ordenador. `amo work account remove --keep-data` olvida el
inicio de sesión y los archivos del perfil, y `--delete-data` además borra la copia de la cuenta del almacén de
WireCat.

Ninguno de los dos avisa a amoCRM. Para detener una clave en la propia cuenta, por ejemplo tras una filtración, abre la
pestaña **«Выданные доступы»** de la integración y pulsa **«Отозвать доступ»**
([amoCRM: paso a paso](https://www.amocrm.ru/developers/content/oauth/step-by-step)). En Kommo es la pestaña
**Authorization** → **Revoke access** ([Kommo: token de larga duración](https://developers.kommo.com/docs/long-lived-token)).

## Siguiente: la primera sincronización

Copia tus negociaciones y sus clientes en WireCat, y luego lista las abiertas:

```sh
amo work sync
amo work deals list status:open
```

Más en [la primera sincronización](./usage.md#the-first-sync).
