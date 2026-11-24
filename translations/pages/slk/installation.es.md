---
title: "Instalación"
---

Conecta tu espacio de trabajo de Slack una vez y, a partir de ahí, tu agente de IA lee y busca en tus canales,
mensajes directos e hilos como tú. Slack deja a un programa leer mensajes solo a través de una app instalada en el
espacio de trabajo, así que creas tú una pequeña app para `slk`. Crear la app, instalar `slk` e iniciar sesión lleva
unos diez minutos.

Al terminar, el agente de este ordenador ve lo que ves tú en Slack, encuentra mensajes con la búsqueda de Slack y
envía solo lo que le pides. Necesitas permiso para instalar apps en el espacio de trabajo, o un administrador que
apruebe la app.

**En esta página:**

1. [En resumen](#en-resumen)
2. [Qué necesitas](#qué-necesitas)
3. [Por qué una app propia](#por-qué-una-app-propia)
4. [Crea tu propia app de Slack](#crea-tu-propia-app-de-slack)
5. [Instala la app y copia el token](#instala-la-app-y-copia-el-token)
6. [Instala slk](#instala-slk)
7. [Inicia sesión](#inicia-sesión)
8. [Comprueba que funciona](#comprueba-que-funciona)
9. [Cerrar sesión](#cerrar-sesión)

## En resumen

1. [Crea la app](#crea-tu-propia-app-de-slack) desde un enlace que rellena sus ajustes.
2. [Instálala](#instala-la-app-y-copia-el-token) en tu espacio de trabajo y copia el **User OAuth Token**.
3. Instala la herramienta y deja que `setup` te pida el token:

```sh
npm install -g @wirecat/slack-cli
slk personal setup
```

## Qué necesitas

- Un espacio de trabajo de Slack donde puedas instalar apps. En algunos solo puede un administrador. Entonces Slack
  te deja enviar una solicitud, e instalas la app cuando el administrador la aprueba.
- Node.js 22.16 o un 22.x posterior, o Node.js 24 o posterior. Node 23 no es compatible.

## Por qué una app propia

Slack da a un programa acceso a los mensajes solo a través de una app, y la app decide a qué velocidad puede leer.
Desde mayo de 2025, una app que otra empresa publica fuera del Slack Marketplace puede leer el historial de un canal
[a una página de 15 mensajes por minuto](https://docs.slack.dev/changelog/2025/05/29/rate-limit-changes-for-non-marketplace-apps).
Una app creada en tu propio espacio de trabajo conserva los límites normales. Además es tuya: nadie más tiene su
token, y solo la usas tú.

La app pide solo lo que usan los comandos: leer canales, mensajes directos, personas, archivos, reacciones y mensajes
fijados, buscar y enviar como tú.

## Crea tu propia app de Slack

1. Inicia sesión en Slack en el navegador, en el espacio de trabajo que debe leer `slk`: [slack.com/signin](https://slack.com/signin).
2. Abre [Create the app in Slack](https://api.slack.com/apps?new_app=1&manifest_json=%7B%22_metadata%22%3A%7B%22major_version%22%3A2%2C%22minor_version%22%3A1%7D%2C%22display_information%22%3A%7B%22name%22%3A%22WireCat%20slk%22%2C%22description%22%3A%22Your%20own%20Slack%2C%20read%20and%20written%20as%20you%20by%20the%20slk%20CLI%20on%20your%20computer.%22%7D%2C%22oauth_config%22%3A%7B%22scopes%22%3A%7B%22user%22%3A%5B%22channels%3Ahistory%22%2C%22groups%3Ahistory%22%2C%22im%3Ahistory%22%2C%22mpim%3Ahistory%22%2C%22channels%3Aread%22%2C%22groups%3Aread%22%2C%22im%3Aread%22%2C%22mpim%3Aread%22%2C%22users%3Aread%22%2C%22users%3Aread.email%22%2C%22search%3Aread%22%2C%22reactions%3Aread%22%2C%22files%3Aread%22%2C%22pins%3Aread%22%2C%22usergroups%3Aread%22%2C%22chat%3Awrite%22%2C%22reactions%3Awrite%22%2C%22files%3Awrite%22%2C%22pins%3Awrite%22%2C%22channels%3Awrite%22%2C%22groups%3Awrite%22%2C%22im%3Awrite%22%2C%22mpim%3Awrite%22%5D%7D%7D%2C%22settings%22%3A%7B%22org_deploy_enabled%22%3Afalse%2C%22socket_mode_enabled%22%3Afalse%2C%22token_rotation_enabled%22%3Afalse%7D%7D).
   Slack abre **Create New App** con los ajustes de `slk` ya rellenados.
3. Elige tu espacio de trabajo en la lista y haz clic en **Next** hasta que veas **Create**, y luego en **Create**.
   No hace falta cambiar nada por el camino.
4. Slack abre la página **Basic Information** de la app. Su Client ID, Client Secret, Signing Secret y Verification
   Token no hacen falta. El token que necesitas llega en el paso siguiente.

Si el enlace no abre el formulario, ve a [api.slack.com/apps](https://api.slack.com/apps), haz clic en
**Create New App**, luego en **From a manifest**, y elige tu espacio de trabajo. Sustituye el texto que aparece por el
[manifiesto de slk](https://github.com/WireCatLabs/slack-cli/blob/main/docs/slack-app-manifest.json): en su página,
haz clic en **Copy raw file**, el botón con dos cuadrados sobre el texto, y pégalo.

## Instala la app y copia el token

1. En la página de la app, en el menú de la izquierda, haz clic en **OAuth & Permissions**. Si perdiste la página,
   abre [api.slack.com/apps](https://api.slack.com/apps) y haz clic en **WireCat slk**.
2. Haz clic en **Install to Workspace**. Slack puede mostrar el nombre de tu espacio de trabajo en lugar de
   Workspace. Muestra lo que la app puede hacer como tú: leer y enviar mensajes, ver personas y archivos. Haz clic en
   **Allow**.
3. Vuelves a **OAuth & Permissions**. En **OAuth Tokens**, busca **User OAuth Token**. Empieza por `xoxp-`. Haz clic
   en **Copy**.

Si Slack te ofrece enviar una solicitud en lugar de instalar, en este espacio de trabajo solo un administrador puede
instalar apps. Envía la solicitud. Cuando el administrador la apruebe, abre de nuevo **OAuth & Permissions** y haz
clic en **Install to Workspace**.

Copia solo el token que empieza por `xoxp-`. Un token de bot (`xoxb-`) se rechaza, porque un bot ve solo los canales
a los que lo añaden, y `slk` lee como tú.

## Instala slk

Instala `slk` una vez en cada ordenador donde lo uses tú o un agente:

```sh
npm install -g @wirecat/slack-cli
slk --version
slk doctor
```

El comando es `slk`, no `slack`, porque `slack` es el nombre de la CLI de Slack para desarrolladores. `doctor` no usa
la red ni abre el llavero. Muestra la versión, dónde están los ajustes, qué perfiles hay y si otros usuarios del
ordenador pueden leer los ajustes.

Da a tu agente de terminal la skill de la herramienta, la guía breve de sus comandos. Una app que se conecta a
servidores MCP usa la herramienta por MCP, como muestra [uso](./usage.md#agents).

```sh
slk skill install
```

## Inicia sesión

Un perfil es un nombre que eliges para un espacio de trabajo de Slack, como `personal` o `work`. Es la primera palabra
de cada comando que usa una cuenta. Inicia sesión en el perfil con el token:

```sh
slk personal setup
```

`setup` muestra los mismos pasos que esta página, uno a uno, y luego pide el token. `slk personal session start` lo
pide directamente. Los dos leen el token sin mostrarlo o desde stdin, nunca como argumento, así que no queda en el
historial de la terminal. Primero el token se comprueba con Slack. Después va al llavero del sistema, o a un archivo
privado con `--credential-storage file` donde no funciona ningún llavero.

## Comprueba que funciona

```sh
slk personal session status --check
slk personal chats list
slk personal inbox
```

`session status --check` pregunta a Slack de quién es el token. `chats list` muestra los canales, mensajes directos y
mensajes grupales en los que estás, e `inbox` muestra lo que no has leído.

## Cerrar sesión

`slk personal session end` olvida el token en este ordenador. El token sigue siendo válido en Slack mientras la app
esté instalada. Para revocarlo, quita la app del espacio de trabajo.

Siguiente: [uso](./usage.md).
