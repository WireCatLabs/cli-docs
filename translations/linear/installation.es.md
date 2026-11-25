---
title: "Instalación"
---

Conecta tu espacio de trabajo de Linear una vez y, desde entonces, tu agente de IA responde sobre tus incidencias sin
que tengas que pegarlas en el chat. Linear solo deja entrar a un programa con una clave de API personal que creas en
sus ajustes. Crear la clave, instalar `linear` e iniciar sesión lleva unos cinco minutos.

Al terminar, el agente de este ordenador lee una copia de tus incidencias, proyectos y comentarios, incluso sin
internet, y cambia incidencias dentro de lo que permiten tu clave y tus permisos.

Puedes hacerlo todo en [WireCat Desktop](https://wirecat.dev/en/docs/desktop), una aplicación que instala las herramientas por ti, o en
un terminal con npm. En los dos casos necesitas una clave de API personal.

**En esta página:**

1. [En resumen](#in-short)
2. [Qué necesitas](#what-you-need)
3. [Crea una clave de API personal](#make-a-personal-api-key)
4. [En WireCat Desktop](#in-wirecat-desktop)
5. [En un terminal](#in-a-terminal)
6. [Inicia sesión](#sign-in)
7. [Comprueba que funciona](#check-that-it-works)
8. [Cierra la sesión](#sign-out)

<a id="in-short" />

## En resumen

1. [Crea una clave](#make-a-personal-api-key) en Linear.
2. En WireCat Desktop: en la página **Herramientas**, pulsa **Instalar** en la fila de Linear, luego **Gestionar** e
   **Iniciar sesión aquí**, y pega la clave.
3. O en un terminal, instala la herramienta, inicia sesión con la clave y copia tus datos:

```sh
npm install -g @wirecat/linear-cli
linear work session start
linear work sync
```

<a id="what-you-need" />

## Qué necesitas

- Un espacio de trabajo de Linear donde puedas crear claves de API. Los administradores siempre pueden. Los miembros
  pueden salvo que un administrador lo haya desactivado en **Settings → Administration → API → Member API keys**.
- Para el terminal: Node.js 22.16 o un 22.x posterior, o Node.js 24 o posterior. Node 23 no es compatible. WireCat
  Desktop instala Node.js por su cuenta.

<a id="make-a-personal-api-key" />

## Crea una clave de API personal

Linear describe estos pasos en su página sobre la [API y los webhooks](https://linear.app/docs/api-and-webhooks).

1. En Linear, abre [Settings → Account → Security & access](https://linear.app/settings/account/security).
2. Crea una clave de API personal nueva y ponle un nombre, como `WireCat`.
3. Elige su acceso. **Read** basta para copiar el espacio de trabajo y buscar en él. Añade **Write** si tu agente puede
   crear y cambiar incidencias. También puedes limitar la clave a algunos equipos.
4. Copia la clave. Linear la muestra una sola vez.

<a id="in-wirecat-desktop" />

## En WireCat Desktop

1. En la página **Herramientas**, pulsa **Instalar** en la fila de Linear.
2. Pulsa **Gestionar**, escribe un nombre de cuenta, como `work`, y pulsa **Iniciar sesión aquí**.
3. Pega la clave. Desktop la comprueba con Linear antes de guardarla.

Desktop también da a tus agentes de IA la skill de la herramienta, así que puedes saltarte el resto de esta página.

<a id="in-a-terminal" />

## En un terminal

Instala `linear` una vez en cada ordenador donde lo uses tú o un agente:

```sh
npm install -g @wirecat/linear-cli
linear --version
linear doctor
```

`doctor` no usa la red ni abre el llavero. Muestra la versión, dónde están los ajustes, qué perfiles existen y si otros
usuarios del ordenador pueden leer los ajustes.

Da a tu agente de terminal la skill de la herramienta, la guía breve de sus comandos. Una aplicación que se conecta a
servidores MCP usa la herramienta por MCP, como explica [úsalo](./usage.md#agents).

```sh
linear skill install
```

<a id="sign-in" />

## Inicia sesión

Un perfil es el nombre que eliges para una cuenta de Linear, como `work`. Es la primera palabra de cada comando que
usa una cuenta. Inicia sesión en el perfil con tu clave:

```sh
linear work session start
```

El comando pide la clave sin mostrarla, o la lee de stdin, nunca como argumento. Primero Linear comprueba la clave.
Después se guarda en el llavero del sistema, o en un archivo privado con `--credential-storage file` donde no funciona
ningún llavero.

<a id="check-that-it-works" />

## Comprueba que funciona

```sh
linear work session status --check
linear work sync
linear work issues list type:started
```

`session status --check` pregunta a Linear de quién es la clave. `sync` copia el espacio de trabajo e `issues list`
muestra desde la copia las incidencias en curso.

<a id="sign-out" />

## Cierra la sesión

`linear work session end` olvida la clave en este ordenador. La clave sigue siendo válida en Linear hasta que la
revoques en la misma página de ajustes.

Siguiente: [úsalo](./usage.md).
