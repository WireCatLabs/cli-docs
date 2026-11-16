---
title: "amoCRM y Kommo: empieza aquí"
description: "Copia tus negociaciones de amoCRM o Kommo y sus clientes a tu ordenador, para que tu agente de IA las lea sin conexión y cambie el CRM según tus reglas."
---

Ten tus negociaciones de amoCRM o Kommo al alcance de tu agente de IA. Tus negociaciones, sus contactos y empresas y
el historial de sus etapas se copian a tu ordenador, así que el agente las lee incluso sin internet. amoCRM y Kommo no
tienen un servidor MCP propio para los datos del CRM, y sin una herramienta así el agente solo ve tus negociaciones
cuando las pegas en el chat.

Puedes preguntar a tu agente qué negociaciones llevan tiempo paradas en una etapa, qué cambió ayer en el CRM o cómo
avanza un embudo de etapa en etapa. El agente también puede pasar una negociación a la siguiente etapa, cerrarla como
perdida con su motivo o añadir un contacto, hasta donde lo permitan los permisos que pongas.

`amo` es una herramienta de línea de comandos de WireCat para amoCRM (amocrm.ru) y Kommo (kommo.com). Guarda la copia
en el almacén local, un único archivo en tu ordenador que comparten todas las herramientas de WireCat, así que una
búsqueda encuentra una negociación junto a tus chats, tu correo y tus reuniones. Para empezar, un administrador de la
cuenta crea una vez una integración privada en amoCRM o Kommo.

**En esta página:**

1. [Qué consigues](#qué-consigues)
2. [Conecta la cuenta y copia tus negociaciones](#conecta-la-cuenta-y-copia-tus-negociaciones)
3. [Qué se lee en directo y qué no hace](#qué-se-lee-en-directo-y-qué-no-hace)
4. [Encuentra la guía para tu tarea](#encuentra-la-guía-para-tu-tarea)

## Qué consigues

- **Tus negociaciones sin internet.** `sync` copia las negociaciones asignadas a ti, los embudos con el historial de
  etapas y solo los contactos y empresas de esas negociaciones. Después, negociaciones, embudos y etapas se leen de
  esta copia. Un administrador puede añadir compañeros cuyas negociaciones también se copian.
- **Qué cambió desde ayer.** Negociaciones nuevas, cambios de etapa, ganadas y perdidas, negociaciones con otro
  responsable y tareas añadidas y hechas. Un resumen cada mañana puede llegar como aviso en el escritorio, o a Telegram
  o por correo con las herramientas de WireCat `tg` y `mail`.
- **Tareas y llamadas de tus negociaciones.** Si activas el ajuste `activities`, `sync` copia también las tareas, los
  comentarios y las llamadas de tus negociaciones de los últimos 90 días. De una llamada solo queda su dirección,
  nunca el número de teléfono ni la grabación.
- **Conversión por etapas.** Cuántas negociaciones hay en cada etapa, cuántas llegaron a ella y siguieron, y qué
  parte se ganó en un periodo.
- **Cambios según tus reglas.** Cada acción tiene su permiso: permitir, preguntar, solo lectura o denegar. Las acciones
  que escriben a clientes, inician un Salesbot o añaden usuarios están denegadas hasta que las permitas. Puedes ver
  antes qué haría una escritura con `--dry-run`, y `AMO_READ_ONLY=1` rechaza todas las escrituras.
- **Tu agente conectado.** Instala la skill de la herramienta para un agente de terminal como Claude Code, o sirve la
  herramienta por MCP a una aplicación que se conecte a servidores MCP.

El token se guarda en el llavero del sistema, o en un archivo privado donde no hay llavero, y nunca aparece en la
salida ni en los registros. `amo` se conecta solo a tu propia cuenta. Más en [seguridad](./security.md).

## Conecta la cuenta y copia tus negociaciones

1. [Instala `amo`](./installation.md#install) desde npm.
2. Crea la integración privada en amoCRM o Kommo, como explica
   [crea la integración](./installation.md#create-the-integration). Lo hace un administrador de la cuenta, una vez.
3. Inicia sesión con el token de larga duración de la integración, una clave con la que la herramienta actúa con los
   permisos del administrador que la creó. `work` es un perfil: un nombre que eliges para una cuenta. La herramienta
   pide el token sin mostrarlo.

```sh
amo work session start --host https://example.amocrm.ru
```

Para que cada persona actúe con sus propios permisos, inicia sesión a través de la integración en el navegador, como
explica [inicia sesión con la integración](./installation.md#sign-in-through-the-integration).

4. Copia tus negociaciones y mira las abiertas.

```sh
amo work sync
amo work deals list status:open
```

Ejecuta `sync` otra vez para poner la copia al día, o deja que lo haga un temporizador:

```sh
amo work schedule command crm --every 1h -- sync
```

5. Conecta tu agente. Un agente de terminal recibe la skill:

```sh
amo skill install
```

Una aplicación con MCP recibe el servidor, como explica [úsalo](./usage.md#agents).

## Qué se lee en directo y qué no hace

- **Los demás clientes se leen en directo.** Un contacto o una empresa que no está en ninguna de tus negociaciones no
  se copia nunca. `people` y `organizations` lo buscan en amoCRM mientras tienes conexión.
- **Quien no es administrador ve menos.** Con sus propios permisos, lee de la copia solo sus negociaciones, y ve los
  teléfonos y correos de un cliente de otro usuario como mucho 100 veces al día.
- **No hay comandos propios para tareas y notas.** Solo se escriben con el comando en bruto `api call` en una
  terminal, después de permitir su clave. Ninguna herramienta MCP ofrece `api call`.
- **Las negociaciones no se borran.** La API de amoCRM no puede borrar una negociación.
- **Sin el complemento de filtros de la API, `sync` va más lento.** Sin ese complemento de pago de amoCRM, `sync` lee
  cada contacto o empresa con una petición aparte.

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar la herramienta e iniciar sesión | [Instala y conecta](./installation.md) |
| Ver cómo se forma un comando y conectar un agente | [Úsalo](./usage.md) |
| Encontrar un comando o una opción | [Comandos](./commands.md) |
| Cambiar un ajuste o un permiso | [Ajustes](./configuration.md) |
| Arreglar un error | [Cuando algo falla](./troubleshooting.md) |
| Saber qué guarda y envía la herramienta | [Seguridad](./security.md) |
| Compararla con otras herramientas para amoCRM | [Comparada con otras herramientas](./compare.md) |
