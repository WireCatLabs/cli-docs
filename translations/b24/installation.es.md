---
title: "Instalar"
---

Pon `b24` en marcha en tu ordenador y conéctalo a tu portal de Bitrix24 en pocos minutos. Bitrix24 solo deja entrar a
un programa a través de un webhook entrante o de una aplicación que creas en el portal, y esta página configura uno de
los dos.

Cuando termines, un agente en este ordenador lee tus negociaciones, prospectos y clientes, y los cambia cuando se lo
pides.

npm instala `b24` como comando, y `b24 skill install` enseña a tu agente a usarlo. `b24 work setup` te muestra dónde
crear el webhook en Bitrix24 y qué permisos de acceso (scopes) marcar, comprueba la dirección del webhook con el portal
y la guarda en el llavero del sistema. `b24 doctor` muestra qué está configurado, sin red. Necesitas Node.js 22.16 o
una versión 22.x posterior, o la 24 o posterior. Node 23 no es compatible.

**En esta página:**

1. [Instalar la herramienta](#install-the-tool)
2. [Iniciar sesión](#sign-in)

## Instalar la herramienta

Instala `b24` una vez en cada ordenador donde lo uses tú o un agente.

```sh
npm install -g @wirecat/bitrix24-cli
b24 --version
b24 skill install   # the agent skill, for Claude Code, Codex, Gemini CLI and OpenClaw
b24 doctor
```

Un agente sin terminal, como Claude Desktop, usa `b24` a través de [MCP](./mcp.md). `doctor` no necesita red ni abre
ningún llavero. Muestra la versión, dónde están los ajustes, qué perfiles existen y si otros usuarios del ordenador
pueden leer los ajustes. Luego elige un nombre de perfil para tu portal, por ejemplo `work`.

## Iniciar sesión

La forma rápida es un webhook entrante. `b24 work setup` te guía paso a paso, con los mismos pasos que muestra
WireCat Desktop. `b24 work session start` solo pide la dirección. Los pasos y los permisos de acceso que hay que
marcar están en [iniciar sesión](./usage.md#sign-in).

Con una aplicación local, `b24` actúa con los permisos del empleado que inicia sesión, no con los de quien creó un
webhook. Créala una vez en el portal (Developer resources → Common use cases → Other → Local application), en modo
**Server**, con **Your handler path** `https://wirecat.dev/webhooks/apps/b24-callback`, el campo **Initial
installation path** vacío, sin texto para el elemento de menú y con los permisos de acceso `crm`, `user_basic` y
`department`, `task` para las tareas, `telephony` para las llamadas, y `disk` y `documentgenerator` para los
archivos y documentos. Luego ejecuta `session start` con el host de tu portal y el Application ID que muestra
Bitrix24. Aquí el host es `example.bitrix24.ru` y el ID `local.0123abcd.45678901`, así que pon los tuyos en su lugar:

```sh
b24 work session start --portal example.bitrix24.ru --client-id local.0123abcd.45678901
```

Escribe la Application key cuando te la pida. Los pasos están en [con una aplicación local](./usage.md#with-a-local-application).

Siguiente paso: [úsalo](./usage.md).
