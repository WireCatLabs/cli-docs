---
title: "Instala y conecta"
---

Conecta tu cuenta de amoCRM o Kommo una vez, y desde entonces tu agente de IA puede leer y actualizar tus
negociaciones. El CRM guarda tus negociaciones, contactos y empresas en la nube. Un administrador de amoCRM deja entrar a `amo` con un
clic en el navegador, sin una integración propia. Kommo, y los usuarios que no son administradores, pegan una clave de
una integración privada que crea un administrador.

Después tu agente te dice qué negociaciones están abiertas, pasa una negociación a la siguiente etapa o encuentra a
un cliente, desde una terminal o por MCP, hasta donde lo permiten los permisos que pongas. Tú ejecutas los mismos
comandos, o desde un script.

`amo` es una herramienta de línea de comandos de WireCat, un programa que tú o tu agente ejecutáis por su nombre. Lo
conectas una vez por cuenta, y `amo work setup` hace cada pregunta por turno. Un administrador de una cuenta de
amoCRM inicia sesión con un clic en el navegador y no copia nada. Un token que pegas también funciona, y es el camino
para Kommo y para los usuarios que no son administradores. ¿No eres administrador? Pide una clave a uno, como muestra
[si no eres administrador](#if-you-are-not-an-administrator).

**En esta página:**

1. [Instala](#install)
2. [Inicia sesión con amoCRM](#sign-in-with-amocrm)
3. [Crea la integración](#create-the-integration)
4. [Inicia sesión con una clave](#sign-in-with-a-key)
5. [Inicia sesión con la integración](#sign-in-through-the-integration)
6. [Cuál elegir](#which-one-to-choose)
7. [Si no eres administrador](#if-you-are-not-an-administrator)
8. [Conecta paso a paso](#connect-step-by-step)
9. [Conecta en WireCat Desktop](#connect-in-wirecat-desktop)
10. [Cierra la sesión y retira el acceso](#sign-out-and-revoke-access)
11. [Siguiente: la primera sincronización](#next-the-first-sync)

## Instala

Instala `amo` una vez en cada ordenador donde lo uses tú o un agente. Necesitas Node.js 22.16 o un 22.x posterior, o
24 o posterior. Node 23 no está soportado.

```sh
npm install -g @wirecat/amo-cli
amo --version
amo skill install   # the agent skill, for Claude Code, Codex, Gemini CLI and OpenClaw
amo doctor
```

Un agente sin terminal, como Claude Desktop, usa `amo` por [MCP](./mcp.md). `amo doctor` no usa la red ni abre el
llavero. Muestra la versión, dónde están los ajustes, qué perfiles existen y si otros usuarios del ordenador pueden
leer los ajustes.

## Inicia sesión con amoCRM

Un clic en el navegador, sin nada que copiar. Funciona con cuentas de amoCRM en `<subdomain>.amocrm.ru`. Las cuentas de
Kommo inician sesión con una clave por ahora.

```sh
amo work session start --host https://example.amocrm.ru --one-click
```

1. El navegador abre una página de WireCat con el botón de amoCRM. Púlsalo.
2. Elige la cuenta y pulsa **«Разрешить»** (permitir).
3. amoCRM crea una integración de WireCat en la cuenta. `amo` comprueba qué cuenta y qué usuario recibió, y guarda el
   inicio de sesión en el llavero del sistema.

Qué pasa detrás del clic:

- amoCRM solo deja permitirlo a un administrador de la cuenta
  ([amoCRM: el botón](https://www.amocrm.ru/developers/content/oauth/button)). A los demás les muestra bajo el botón
  «Разрешить»: «Интеграция не может быть установлена в выбранный аккаунт. Первичная установка интеграции доступна
  только администраторам аккаунта.» (la integración no se puede instalar en la cuenta elegida: la primera instalación
  solo la hacen los administradores). Después la integración aparece en
  амоМаркет, donde un administrador puede desactivarla.
- amoCRM envía la clave secreta de la nueva integración a connect.wirecat.dev, un servidor de WireCat en Rusia al que
  llegan los servidores de amoCRM. `amo` recoge la clave de allí una vez, y el servidor no guarda ninguna copia.
- `amo` canjea el código solo con la cuenta que nombraste en `--host`. Si elegiste otra cuenta en la ventana de
  amoCRM, se detiene y nombra esa cuenta.
- Actúas con tus propios permisos, y `amo` renueva el inicio de sesión por sí mismo, como con
  [el inicio de sesión con la integración](#sign-in-through-the-integration).

## Crea la integración

Lo hace un administrador de la cuenta, una vez, para la clave o para un inicio de sesión con una integración propia.
El inicio de sesión con un clic no la necesita.

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

1. En la integración, abre la pestaña **«Ключи»** (en Kommo, **Keys and scopes**) y pulsa
   **«Сгенерировать токен»** (en Kommo, **Generate long-lived token**).
2. Elige una fecha de fin, de un día a cinco años.
3. Copia el token. Solo se muestra una vez
   ([amoCRM: paso a paso](https://www.amocrm.ru/developers/content/oauth/step-by-step),
   [Kommo: token de larga duración](https://developers.kommo.com/docs/long-lived-token)).
4. Elige un nombre de perfil para esta cuenta, como `work`. Ejecuta los comandos de abajo con la dirección de tu
   cuenta en lugar del ejemplo `https://example.amocrm.ru`, y pega el token cuando `amo` lo pida:

   ```sh
   amo work session start --host https://example.amocrm.ru
   amo work session status --check
   ```

`session start` lee el token sin mostrarlo, o desde stdin. Lo comprueba con la cuenta y solo entonces lo guarda en el
llavero del sistema junto con la dirección. Con `--credential-storage file` lo guarda en un archivo privado.
`session status --check` muestra la cuenta y el usuario con el que actúa el token. La dirección se queda tal como la
escribes: `<subdomain>.amocrm.ru`, `<subdomain>.kommo.com` o `<subdomain>.amocrm.com`.

## Inicia sesión con la integración

Este inicio de sesión usa OAuth: permites la integración en el navegador y actúas con tus propios permisos. amoCRM
solo ofrece las cuentas donde eres administrador
([amoCRM: paso a paso](https://www.amocrm.ru/developers/content/oauth/step-by-step)).

1. En la pestaña **«Ключи»** de la integración (en Kommo, **Keys and scopes**), copia el ID de la integración. Ten
   también a mano la clave secreta.
2. Ejecuta el comando de abajo con tu dirección y tu ID de integración en lugar de los ejemplos
   `https://example.amocrm.ru` y `0123abcd-4567-89ef-0123-456789abcdef`:

   ```sh
   amo work session start --host https://example.amocrm.ru --client-id 0123abcd-4567-89ef-0123-456789abcdef
   ```

3. Pega la clave secreta cuando `amo` la pida. No se muestra. También puede darla `AMO_AMOCRM_CLIENT_SECRET`.
4. El navegador abre amoCRM. Elige la cuenta y pulsa **«Разрешить»** (permitir).

`amo` guarda los tokens y renueva el token de acceso por sí mismo. La Redirect URI de la integración debe ser
`https://wirecat.dev/webhooks/apps/amo-callback`. Un inicio de sesión nuevo de cualquier tipo sustituye al otro del
perfil.

## Cuál elegir

- **Iniciar sesión con amoCRM** es lo más rápido: un clic, sin integración que crear y sin nada que copiar. Necesita
  un administrador de una cuenta de amoCRM. Actúa como esa persona, y `amo` lo renueva como el inicio de sesión con la
  integración.
- **La clave** funciona para Kommo y para usuarios que no son administradores: pegarla una vez y sin navegador. Actúa
  como el administrador que la creó y deja de funcionar en su fecha de fin. Entonces creas otra y vuelves a ejecutar
  `session start`.
- **El inicio de sesión con la integración** usa una integración que creaste tú. Actúa como el administrador que entra
  y no tiene fecha de fin que vigilar. El
  refresh token de amoCRM dura 3 meses, y `amo` recibe uno nuevo cada vez que renueva el token de acceso. Así sigue
  funcionando mientras `amo` se ejecute al menos una vez cada 3 meses. Tras una pausa más larga, vuelve a iniciar
  sesión ([amoCRM: paso a paso](https://www.amocrm.ru/developers/content/oauth/step-by-step)).

## Si no eres administrador

Lo ves en el menú de la izquierda de amoCRM: si no aparece **амоМаркет**, no eres administrador. Solo un administrador
puede crear la integración y su clave. El inicio de sesión con un clic también muestra tu cuenta, pero amoCRM lo
rechaza: «Первичная установка интеграции доступна только администраторам аккаунта» (la primera instalación solo la
hacen los administradores). Así que te conectas con una clave que un administrador crea para ti:

1. Envía a un administrador de tu cuenta el enlace a esta página y pídele una integración privada y su token de larga
   duración.
2. El administrador sigue [crea la integración](#create-the-integration) e
   [inicia sesión con una clave](#sign-in-with-a-key), y te pasa la clave. La clave funciona como una contraseña:
   pásala por un gestor de contraseñas, no por un chat de grupo.
3. Ejecuta `amo work setup`, responde **No, soy usuario** y pega la clave.

La clave actúa con los permisos del administrador: ves y puedes cambiar lo mismo que él. Los permisos de amo siguen
limitando lo que cambia un agente. Una sincronización copia primero las negociaciones del administrador, así que elige
las tuyas como muestra [qué negociaciones copia la sincronización](./configuration.md#which-deals-sync-copies).

## Conecta paso a paso

`amo work setup` hace las preguntas una a una, comprueba las respuestas y solo las guarda si la comprobación sale bien:

1. **¿Qué cuenta?** La dirección en la que abres el CRM.
2. **¿Eres administrador de esta cuenta?** Un administrador elige cómo iniciar sesión. Un usuario recibe la petición
   que enviar a un administrador, como en [si no eres administrador](#if-you-are-not-an-administrator).
3. **¿Cómo quieres entrar?** **Entrar con amoCRM** va al navegador, como en
   [inicia sesión con amoCRM](#sign-in-with-amocrm), y luego al último paso. **Con un token de larga duración** sigue
   con los pasos siguientes.
4. **Crea una integración privada.** Los pasos de [crea la integración](#create-the-integration).
5. **Crea el token.** Pega la clave de la pestaña «Ключи», o la clave que te envió el administrador.
6. **Comprobando el token.** `amo` pregunta a la cuenta de quién es el token, y guarda la dirección y el token solo si
   la cuenta responde. Un token rechazado te devuelve al paso del token.
7. **Conectado.** El perfil está listo. Un usuario que no es administrador ve también cómo elegir sus propias
   negociaciones.

Un inicio de sesión con una integración propia es el comando que aparece en **Avanzado: entrar con la integración** en
el último paso.

## Conecta en WireCat Desktop

[WireCat Desktop](https://wirecat.dev/en/docs/desktop) instala `amo` desde su página Herramientas, a partir de la
versión 0.7.1. Su ventana hace las mismas preguntas que `amo work setup`, porque las describe el propio `amo`, y
comprueba el token igual antes de guardar nada. **Entrar con amoCRM** muestra un enlace que abrir en el
navegador, y la ventana espera hasta que permitas el acceso. Un inicio de sesión con una integración propia es el
comando de **Avanzado: entrar con la integración** en el último paso.

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
