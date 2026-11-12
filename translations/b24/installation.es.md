---
title: "Instalar"
---

Instala `b24` una vez en cada ordenador donde lo uses tú o un agente. Necesitas Node.js 22.16 o una versión 22.x posterior, o la 24 o posterior; Node 23 no es compatible.

```sh
npm install -g @wirecat/bitrix24-cli
b24 --version
```

Comprueba la instalación y luego elige un nombre de perfil para tu cuenta, por ejemplo `work`:

```sh
b24 doctor
```

`doctor` no necesita red ni abre ningún llavero. Muestra la versión, dónde están los ajustes, qué perfiles existen y si
otros usuarios del ordenador pueden leer los ajustes. Siguiente paso: [úsalo](./usage.md).

## Iniciar sesión

La forma rápida es un webhook entrante: `b24 work session start` te pide su dirección. Los pasos están en
[iniciar sesión](./usage.md#sign-in).

Con una aplicación local, `b24` actúa con los permisos del empleado que inicia sesión, no con los de quien creó un
webhook. Créala una vez en el portal (Developer resources → Common use cases → Other → Local application), en modo
**Server**, con **Your handler path** `https://wirecat.dev/webhooks/apps/b24-callback`, el campo **Initial
installation path** vacío, sin texto para el elemento de menú y con los permisos de acceso `crm`, `user_basic` y
`department`. Luego ejecuta `b24 work session start --portal example.bitrix24.ru --client-id <Application ID>` y
escribe la Application key cuando te la pida. Los pasos están en
[con una aplicación local](./usage.md#with-a-local-application).
