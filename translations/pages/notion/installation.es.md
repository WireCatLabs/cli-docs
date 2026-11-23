---
title: "Instalación"
---

Conecta tu espacio de trabajo de Notion una vez y, desde entonces, tu agente de IA encuentra cualquier página que
escribiste y responde con su enlace. Notion guarda tus páginas en su nube y solo deja entrar a un programa con un
token que creas en Notion. Crear el token, instalar `notion` e iniciar sesión lleva unos cinco
minutos.

Al terminar, el agente de este ordenador busca en las páginas que elegiste y las usa como contexto, incluso sin
internet.

Puedes hacerlo todo en [WireCat Desktop](/es/docs/desktop), una aplicación que instala las herramientas por ti, o en
un terminal con npm. En los dos casos necesitas un token de Notion.

**En esta página:**

1. [Qué necesitas](#what-you-need)
2. [Crea un token de Notion](#make-a-notion-token)
3. [En WireCat Desktop](#in-wirecat-desktop)
4. [En un terminal](#in-a-terminal)
5. [Inicia sesión](#sign-in)
6. [Comprueba que funciona](#check-that-it-works)
7. [Cierra la sesión](#sign-out)

<a id="what-you-need" />

## Qué necesitas

- Un espacio de trabajo de Notion donde seas miembro completo. Un invitado no puede crear un token.
- Para el terminal: Node.js 22.16 o un 22.x posterior, o Node.js 24 o posterior. Node 23 no es compatible. WireCat
  Desktop instala Node.js por su cuenta.

<a id="make-a-notion-token" />

## Crea un token de Notion

Notion tiene dos tipos de token. Crea uno de ellos.

**Un token de acceso personal** actúa con tus propios permisos y ve lo que tú ves
([guía de Notion](https://developers.notion.com/guides/connections-and-tokens/personal-access-tokens)):

1. Abre [notion.so/developers/tokens](https://www.notion.so/developers/tokens) y pulsa **New token**.
2. Ponle un nombre, como `WireCat`, y elige cuándo caduca. Si Notion pide un espacio de trabajo, elige el tuyo.
3. Pulsa **Create token** y cópialo. Notion lo muestra una sola vez.

En el plan Free solo los propietarios del espacio pueden crearlo. En Business y Enterprise los propietarios deciden
quién puede, en **Settings → Connections**.

**El token de una conexión interna** solo ve las páginas que compartes con esa conexión. Elígelo para dar a la
herramienta unas pocas páginas y nada más
([guía de Notion](https://developers.notion.com/guides/connections-and-tokens/internal-connections)):

1. Abre el [portal de desarrolladores](https://app.notion.com/developers/connections) y pulsa **New connection**.
2. Ponle un nombre, elige **API token** en **Authentication method** y pulsa **Create connection**.
3. En la pestaña **Configuration**, copia el **API token**. Activa la lectura de contenido y "Read user information
   including email addresses" ([capacidades de Notion](https://developers.notion.com/reference/capabilities)). Sin
   la información de usuarios, la sincronización guarda el autor de una página solo por su id de Notion y no puede
   relacionarlo con las personas que conoces por su correo. Activa también la edición y la inserción de contenido si
   tu agente puede escribir en Notion.
4. Comparte las páginas: en cada página principal de Notion, abre el menú **•••**, elige **Connections**, luego
   **+ Add connection**, y elige tu conexión. Sus páginas hijas se comparten con ella.

<a id="in-wirecat-desktop" />

## En WireCat Desktop

1. En la página **Herramientas**, pulsa **Instalar** en la fila de Notion.
2. Pulsa **Gestionar**, escribe un nombre de cuenta, como `personal`, y pulsa **Iniciar sesión aquí**.
3. Pega el token. Después elige las páginas y bases de datos que se copian. Mientras no elijas ninguna, la herramienta
   copia todo lo que ve el token.

Desktop también da a tus agentes de IA la skill de la herramienta, así que puedes saltarte el resto de esta página.

<a id="in-a-terminal" />

## En un terminal

Instala `notion` una vez en cada ordenador donde lo uses tú o un agente:

```sh
npm install -g @wirecat/notion-cli
notion --version
notion doctor
```

`doctor` no usa la red ni abre el llavero. Muestra la versión, dónde están los ajustes, qué perfiles existen y si otros
usuarios del ordenador pueden leer los ajustes.

Da a tu agente de terminal la skill de la herramienta, la guía breve de sus comandos. Una aplicación que se conecta a
servidores MCP usa la herramienta por MCP, como explica [úsalo](./usage.md#agents).

```sh
notion skill install
```

<a id="sign-in" />

## Inicia sesión

Un perfil es el nombre que eliges para una cuenta de Notion, como `personal`. Es la primera palabra de cada comando
que usa una cuenta. Inicia sesión en el perfil con tu token:

```sh
notion personal session start
```

El comando pide el token sin mostrarlo, o lo lee de stdin. Primero Notion comprueba el token. Después se guarda en el
llavero del sistema. Donde no funciona ningún llavero, añade `--credential-storage file` para guardarlo en un archivo
privado.

<a id="check-that-it-works" />

## Comprueba que funciona

```sh
notion personal session status --check
notion personal sync
notion personal search "plan trimestral"
```

`session status --check` pregunta a Notion de quién es el token. `sync` copia las páginas y `search` las encuentra en
la copia. Para copiar solo algunas páginas, mira [conecta y copia tus páginas](./index.md#conecta-y-copia-tus-páginas).

<a id="sign-out" />

## Cierra la sesión

`notion personal session end` olvida el token en este ordenador. El token sigue siendo válido en Notion hasta que lo
borres allí, en la misma página donde lo creaste.

Siguiente: [úsalo](./usage.md).
