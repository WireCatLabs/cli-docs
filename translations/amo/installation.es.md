---
title: "Instala y conecta"
---

Conecta tu cuenta de amoCRM o Kommo una vez, y desde entonces tu agente de IA puede leer y actualizar tus
negociaciones. El CRM guarda tus negociaciones, contactos y empresas en la nube, y solo deja entrar a un programa a
través de una integración privada que crea un administrador de la cuenta.

Después tu agente te dice qué negociaciones están abiertas, pasa una negociación a la siguiente etapa o encuentra a
un cliente, desde una terminal o por MCP, hasta donde lo permiten los permisos que pongas. Tú ejecutas los mismos
comandos, o desde un script.

`amo` es una herramienta de línea de comandos de WireCat, un programa que tú o tu agente ejecutáis por su nombre. Lo
conectas una vez por cuenta, y `amo work setup` hace cada pregunta por turno. Una sola integración privada sirve para
las dos formas de iniciar sesión: un token que pegas o un inicio de sesión en el navegador. El único requisito es un
administrador de la cuenta, que crea la integración.

**En esta página:**

1. [Instala](#install)
2. [Crea la integración](#create-the-integration)
3. [Inicia sesión con una clave](#sign-in-with-a-key)
4. [Inicia sesión con la integración](#sign-in-through-the-integration)
5. [Cuál elegir](#which-one-to-choose)
6. [Conecta paso a paso](#connect-step-by-step)
7. [Conecta en WireCat Desktop](#connect-in-wirecat-desktop)
8. [Cierra la sesión y retira el acceso](#sign-out-and-revoke-access)
9. [Siguiente: la primera sincronización](#next-the-first-sync)

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

## Crea la integración

Lo hace un administrador de la cuenta, una vez. La misma integración sirve para la clave y para el inicio de sesión
en el navegador.

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

Este inicio de sesión usa OAuth: permites la integración en el navegador, y cada persona actúa con sus propios
permisos.

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

- **La clave** es lo más sencillo: pegarla una vez y sin navegador. Actúa como el administrador que la creó y deja de
  funcionar en su fecha de fin. Entonces creas otra y vuelves a ejecutar `session start`.
- **El inicio de sesión con la integración** actúa como la persona que entra y no tiene fecha de fin que vigilar. El
  refresh token de amoCRM dura 3 meses, y `amo` recibe uno nuevo cada vez que renueva el token de acceso. Así sigue
  funcionando mientras `amo` se ejecute al menos una vez cada 3 meses. Tras una pausa más larga, vuelve a iniciar
  sesión ([amoCRM: paso a paso](https://www.amocrm.ru/developers/content/oauth/step-by-step)).

## Conecta paso a paso

`amo work setup` hace las preguntas una a una, comprueba las respuestas y solo las guarda si la comprobación sale bien:

1. **¿Qué cuenta?** La dirección en la que abres el CRM.
2. **Crea una integración privada.** Los pasos de [crea la integración](#create-the-integration).
3. **Crea el token.** Pega la clave de la pestaña «Ключи».
4. **Comprobando el token.** `amo` pregunta a la cuenta de quién es el token, y guarda la dirección y el token solo si
   la cuenta responde. Un token rechazado te devuelve al paso del token.
5. **Conectado.** El perfil está listo.

Inicia sesión con la clave. El inicio de sesión en el navegador es el comando que aparece en **Advanced** en el último
paso.

## Conecta en WireCat Desktop

[WireCat Desktop](https://wirecat.dev/en/docs/desktop) instala `amo` desde su página Herramientas, a partir de la
versión 0.7.1. Su ventana hace las mismas preguntas que `amo work setup`, porque las describe el propio `amo`, y
comprueba el token igual antes de guardar nada. Como en el terminal, inicia sesión con la clave; el inicio de sesión en
el navegador es el comando de **Advanced** en el último paso.

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
