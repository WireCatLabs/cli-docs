---
title: "Linear: empieza aquí"
description: "Una CLI de Linear y un servidor MCP de Linear: tus incidencias y proyectos en tu ordenador, para que tu agente de IA los lea sin conexión y use toda la API de Linear."
---

Deja que tu agente de IA lea tus incidencias, proyectos y comentarios de Linear sin pegarlos en el chat. La
herramienta de línea de comandos `linear` copia tu espacio de trabajo a tu ordenador, y el agente responde a partir de
esa copia, incluso sin conexión. Si lo permites, la misma herramienta crea y cambia incidencias con la API de Linear.

Puedes preguntar a tu agente qué incidencias de un equipo siguen en curso, qué se dijo en los comentarios de ENG-12 o
qué incidencias no tienen responsable. El agente las encuentra en la copia local y nombra cada incidencia por su clave.
Una incidencia que asumes se convierte en una [tarea](/es/docs/tasks) en el almacén local, junto a las tareas de tus
chats.

`linear` es a la vez una CLI de Linear para tu terminal y un servidor MCP de Linear para aplicaciones como Claude
Desktop, y para ChatGPT a través de un túnel que ejecutas tú. Necesitas una clave de API personal de Linear, que creas una vez en los ajustes de Linear.

**En esta página:**

1. [Qué obtienes](#qué-obtienes)
2. [Cómo funciona](#cómo-funciona)
3. [Crea una clave de API personal](#crea-una-clave-de-api-personal)
4. [Conecta y copia tu espacio de trabajo](#conecta-y-copia-tu-espacio-de-trabajo)
5. [Qué no hace todavía](#qué-no-hace-todavía)
6. [Encuentra la guía para tu tarea](#encuentra-la-guía-para-tu-tarea)

## Qué obtienes

- **Incidencias sin conexión.** Lista incidencias por equipo, proyecto, estado, responsable o etiqueta, abre una con
  sus comentarios y encuentra incidencias, proyectos y comentarios por sus palabras.
- **Una incidencia se convierte en tu tarea.** `issues assign ENG-12` te añade una tarea que apunta a la incidencia,
  con fecha límite si la indicas. No cambia nada en Linear.
- **Todo lo demás que ofrece Linear.** Crea una incidencia, cambia su estado, añade un comentario o lee ciclos y
  documentos con el grupo `api`. `api list` nombra todas las operaciones.
- **Tú decides qué puede cambiar el agente.** Cada perfil permite, pregunta o rechaza cada tipo de escritura. Un
  borrado o un archivado necesita un permiso propio, `WCLINEAR_READ_ONLY=1` rechaza cualquier escritura y `--dry-run`
  muestra lo que enviaría una escritura sin enviarlo. Por MCP no hay nadie a quien preguntar, así que una escritura
  en ask se ejecuta. Pon `permissions.api` en `readonly` para evitarlo. Más en los
  [ajustes](./configuration.md#permissions).
- **Tu agente conectado.** Instala la skill de la herramienta para un agente de terminal como Claude Code o Codex, o
  sirve la herramienta por MCP a una aplicación que se conecta a servidores MCP.

La clave se queda en el llavero del sistema, o en un archivo privado donde no hay llavero. Se la das a la herramienta
oculta o por stdin, nunca como argumento, así que no acaba en el historial de la terminal. Más en
[seguridad](./security.md).

## Cómo funciona

- **Una copia en tu ordenador.** `linear` guarda tus incidencias, proyectos y comentarios, con sus equipos,
  estados y etiquetas, en el almacén local, un archivo de tu ordenador que comparten todas las
  herramientas de WireCat. Las listas y la búsqueda leen esta copia, no Linear.
- **La copia es tuya.** Linear muestra a cada miembro equipos distintos, así que la copia guarda lo que ve tu propia
  clave y nada de los equipos privados de otra persona.
- **Una sincronización trae los cambios.** La primera copia todo. Después solo lee lo que cambió, y una vez al día
  detecta lo que se borró en Linear. Las incidencias archivadas siguen en la copia, marcadas.
- **Un perfil para cada cuenta.** Un perfil es un nombre que eliges para una cuenta de Linear, como `work`. Cada
  comando que usa una cuenta lo nombra primero: `linear work issues show ENG-12`.
- **Toda la API como comandos.** Cada una de las 493 consultas y mutaciones de la API de Linear es un comando propio
  del grupo `api`, con sus opciones y su ayuda. Tu agente usa los mismos comandos, en una terminal o por MCP.

## Crea una clave de API personal

En Linear, abre [Settings → Account → Security & access](https://linear.app/settings/account/security) y crea una clave
de API personal. Linear te deja darle acceso completo o solo algunos permisos, como Read, y limitarla a algunos
equipos. Para copiar y leer tu espacio de trabajo basta una clave de solo lectura. Para crear o cambiar incidencias con
la herramienta, dale también Write. Si no ves la opción, un administrador de tu espacio de trabajo ha desactivado las
claves de API para los miembros. Linear describe las opciones en su
[página de API y webhooks](https://linear.app/docs/api-and-webhooks).

## Conecta y copia tu espacio de trabajo

1. [Instala `linear`](./installation.md) con WireCat Desktop o desde npm. En Desktop inicias sesión con la clave en
   su ventana. Los comandos de aquí hacen lo mismo en un terminal.
2. Inicia sesión. `work` es un perfil, un nombre que eliges para una cuenta de Linear. La herramienta pide la clave
   oculta y la comprueba con Linear antes de guardarla.

```sh
linear work session start
```

3. Copia tu espacio de trabajo y mira las incidencias en curso.

```sh
linear work sync
linear work issues list type:started
linear work issues show ENG-12
```

Vuelve a ejecutar `sync` más tarde para traer lo que cambió.

4. Conecta tu agente. Un agente de terminal recibe la skill:

```sh
linear skill install
```

Una aplicación que se conecta a servidores MCP recibe el servidor, como se explica en [úsalo](./usage.md#agents).

## Qué no hace todavía

- La búsqueda común de WireCat todavía no lee las incidencias de Linear. Encuéntralas con `issues search`, no junto a
  tus mensajes y notas.
- Solo inicia sesión con una clave de API personal, no a través del navegador.
- Crear y cambiar incidencias pasa por el grupo `api`, una operación de Linear cada vez.

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar o actualizar la herramienta | [Instalar](./installation.md) |
| Ver cómo se forma un comando y conectar un agente | [Úsalo](./usage.md) |
| Encontrar un comando o una opción | [Comandos](./commands.md) |
| Cambiar un ajuste o un permiso | [Ajustes](./configuration.md) |
| Arreglar un error | [Cuando algo falla](./troubleshooting.md) |
| Saber qué guarda y envía la herramienta | [Seguridad](./security.md) |
| Compararla con otras herramientas de Linear | [Comparada con otras herramientas](./compare.md) |
