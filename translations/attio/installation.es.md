---
title: "Instala"
---

Conecta tu espacio de trabajo de Attio una vez y, desde entonces, tu agente de IA te dice en qué punto está cada
negociación sin que abras Attio. Attio solo deja entrar a un programa con un token de acceso que crea un
administrador del espacio de trabajo. Crear el token, instalar `attio` e iniciar sesión lleva unos cinco minutos.

Cuando termines, un agente de este ordenador lee tus negociaciones, personas y empresas cuando se lo pides.

**En esta página:**

1. [Lo que necesitas](#what-you-need)
2. [En WireCat Desktop](#in-wirecat-desktop)
3. [Instala la herramienta](#install-the-tool)
4. [Crea un token de acceso en Attio](#make-an-access-token-in-attio)
5. [Inicia sesión](#sign-in)
6. [Comprueba que funciona](#check-it-works)
7. [Cierra la sesión o cambia el token](#sign-out-or-change-the-token)

## Lo que necesitas

- Un espacio de trabajo de Attio y un administrador de ese espacio. Solo un administrador del espacio de trabajo puede
  crear un token de acceso. Si no lo eres, pide a un administrador que cree el token para ti con los ámbitos de abajo.
- Las negociaciones activadas, si las quieres. Attio tiene el objeto Deal en cada espacio de trabajo, pero lo deja
  desactivado hasta que un administrador lo activa en los ajustes de objetos
  ([documentación de Attio](https://docs.attio.com/docs/standard-objects/standard-objects-deals)).
- Para la línea de comandos: Node.js 22.16 o un 22.x posterior, o Node.js 24 o posterior. Node 23 no está soportado.

## En WireCat Desktop

1. En la página **Herramientas**, pulsa **Instalar** en la fila de Attio.
2. Pulsa **Gestionar**, escribe un nombre de cuenta, como `work`, y pulsa **Iniciar sesión aquí**.
3. Pega el token de acceso cuando te lo pida. [Crea un token de acceso en Attio](#make-an-access-token-in-attio)
   muestra cómo conseguir uno.

## Instala la herramienta

Instala `attio` una vez en cada ordenador donde lo uses tú o un agente.

```sh
npm install -g @wirecat/attio-cli
attio --version
attio skill install   # the agent skill, for Claude Code, Codex, Gemini CLI and OpenClaw
attio doctor
```

`doctor` no necesita la red ni abre ningún llavero. Muestra la versión, dónde están los ajustes, qué perfiles existen
y si otros usuarios del ordenador pueden leer los ajustes.

Un agente sin terminal, como Claude Desktop o Cursor, usa `attio` por [MCP](./mcp.md) en lugar de la skill.

## Crea un token de acceso en Attio

Attio describe estos pasos en su página de ayuda,
[Generating an API key](https://attio.com/help/apps/other-apps/generating-an-api-key).

1. En Attio, abre el menú junto al nombre de tu espacio de trabajo y elige **Workspace settings**.
2. Abre la pestaña **Developers**.
3. Pulsa **+ New access token** y dale un nombre, como `WireCat`.
4. En **Scopes**, dale lectura de registros, configuración de objetos y gestión de usuarios:

   | Alcance | Hace falta para |
   |---|---|
   | `record_permission:read` | Negociaciones, personas y empresas. |
   | `object_configuration:read` | Las etapas de las negociaciones y los atributos propios de tu espacio de trabajo. |
   | `user_management:read` | Los miembros del espacio de trabajo, responsables de las negociaciones. |
   | `note:read` y `task:read` | Solo para copiar notas y tareas, ver [notas y tareas](./usage.md#notes-and-tasks-on-a-deal). |

5. Guarda y copia el token que muestra Attio.

Con solo estos ámbitos, el token puede leer y nunca cambia nada en Attio. Los tokens de Attio no caducan. Funcionan
hasta que un administrador los borra en el mismo sitio.

## Inicia sesión

Un perfil es un nombre que eliges para un espacio de trabajo, como `work`. Es la primera palabra de cada comando que
usa una cuenta. Ningún comando elige uno por ti.

```sh
attio work session start
```

`attio` pide el token sin mostrarlo, lo comprueba con Attio y lo guarda en el llavero del sistema. Un token que Attio
rechaza no se guarda. En un ordenador sin llavero, añade `--credential-storage file` para guardarlo en un archivo
privado. Un agente o un script puede pasar el token por stdin. El token nunca se acepta como argumento, así que no
acaba en el historial de tu terminal.

## Comprueba que funciona

```sh
attio work session status --check   # asks Attio which workspace the token belongs to
attio work sync                     # copies your deals and their people and companies
attio work deals list status:open
```

La primera sincronización lee cada negociación del espacio de trabajo y las personas y empresas que nombran, así que
en un espacio de trabajo grande tarda un rato. Si algo falla, mira [cuando algo falla](./troubleshooting.md).

## Cierra la sesión o cambia el token

```sh
attio work session end
```

`session end` olvida el token en este ordenador. El token sigue funcionando en Attio hasta que un administrador lo
borra allí: Workspace settings → Developers, el menú junto al token, **Delete**. Para cambiar el token, vuelve a
ejecutar `session start` con el nuevo.

Siguiente: [úsalo](./usage.md), o conecta una aplicación por [MCP](./mcp.md).
