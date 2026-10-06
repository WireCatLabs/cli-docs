---
title: "Personas"
description: "Averigua quién es alguien desde tus propias cuentas de Telegram y MAX: su perfil, dónde habláis, qué escribió, si la cuenta parece un bot — y respuestas automáticas con tus reglas."
---

Antes de contestar a un desconocido, aceptar a alguien en un grupo o pasar una conversación a tu
agente, puedes preguntar a tu propia cuenta qué sabe de esa persona. Todo aquí lee tu cuenta y la
copia local de tus mensajes en tu ordenador. No se envía nada a la persona y nada se marca como
leído.

| Pregunta | Comando |
|---|---|
| ¿Quién es y dónde hablamos? | `contacts profile` |
| ¿Qué escribió, en todos los chats o en los que yo diga? | `contacts context` |
| ¿Parece la cuenta un bot, una cuenta falsa o un spammer? | `contacts check` |
| ¿Qué miembros de mi grupo parecen sospechosos? | `chats members audit --deep` |
| ¿Es esta cuenta de Telegram la misma persona que esta de MAX? | `contacts link` |

Los comandos son los mismos en `tg` y `max`. Una persona es su id, su `@username` o parte de su
nombre; si parte de un nombre coincide con varias personas, el comando las lista y se detiene.

## Quién es

```sh
tg contacts profile @example_user
max contacts profile 20000002
```

La respuesta incluye su id, nombre, nombres de usuario, biografía y cumpleaños, si es tu contacto,
cuándo se conectó por última vez y cuándo se creó la cuenta. Para cada chat que compartís dice
cuántos de sus mensajes tiene tu copia local, y el primero y el último. La cifra es un mínimo cuando
la copia local no tiene el chat desde el principio (`complete: false`); `store fetch <chat>` lo completa.

Su número de teléfono solo se ve con sus cuatro últimas cifras, y solo si el mensajero te lo muestra.
`--show-phone` lo imprime entero. Un agente conectado por MCP nunca recibe el número completo.

La fecha de registro siempre indica su origen:

- **Telegram** envía el mes cuando alguien te escribe por primera vez. Si no, `tg` lo calcula a partir
  del id de la cuenta y lo marca como `estimate`. El cálculo llega hasta cuentas creadas antes de 2025;
  las más nuevas no reciben fecha antes que una equivocada.
- **MAX** da el día exacto, así que `max` lo muestra para todos.

## Qué escribió

```sh
tg contacts context @example_user
tg contacts context @example_user --chat "Club de lectura" --chat "Trabajo" --limit 10
```

Sin `--chat` obtienes un resumen: los chats que compartís, el último mensaje en cada sentido, sus
mensajes recientes y dónde lo mencionaron otros. Con `--chat` obtienes sus mensajes más nuevos en
cada chat que nombres, del más antiguo al más reciente. Cada mensaje es solo su hora y su texto, para
que un agente lea muchos a la vez y los resuma; `-v` añade ids y enlaces, `-vv` el mensaje completo.

Por defecto la respuesta sale de tu copia local y no se conecta. `--refresh` pregunta antes al
mensajero: Telegram busca en cada chat los mensajes de esa persona; MAX lee la página más reciente de
cada chat.

## Si la cuenta parece un bot

```sh
tg contacts check @example_user
max contacts check 20000002
```

La respuesta es una puntuación y todos los motivos, cada uno con su origen: las marcas del propio
mensajero (bot, estafa, falsa), un perfil vacío, una cuenta nueva, solo fotos recientes, un enlace
como primer mensaje, el mismo texto en varios chats. La puntuación es una pista, nunca un veredicto:
muchas personas reales no tienen foto ni biografía. `unknown` enumera lo que no se pudo juzgar.

En Telegram, `tg` también consulta dos listas públicas de spam, [Combot Anti-Spam](https://cas.chat/api)
y [lols.bot](https://lols.bot). **Se les envía el id de Telegram de la persona.** `--no-registries`
las omite. Las listas solo cubren cuentas de Telegram, así que `max` nunca les envía nada.

Para un grupo entero, `chats members audit` puntúa a cada miembro a partir de la lista de miembros y
tu copia local, y lista a quienes tienen algún motivo. `--deep 10` hace después la comprobación
completa de los diez con más puntos, una persona por segundo. No elimina a nadie.

## La misma persona en los dos mensajeros

`tg` y `max` comparten una sola copia local en tu ordenador. Si sabes que una cuenta de Telegram y
una de MAX son la misma persona, regístralo:

```sh
tg contacts link @example_user max:"Example User"
```

Después, `contacts profile` y `contacts context` incluyen las dos. El mismo nombre en dos mensajeros
nunca se toma como la misma persona; solo cuenta lo que registras tú. `contacts unlink` lo deshace.

## Qué cambia en MAX

| | Telegram (`tg`) | MAX (`max`) |
|---|---|---|
| Fecha de registro | el mes de Telegram tras un primer contacto; si no, un cálculo | el día exacto, de MAX |
| Marcas como estafa, falsa, verificada, premium | se muestran | MAX no las envía |
| `--refresh` | busca en cada chat los mensajes de la persona | lee la página más reciente de cada chat |
| Listas públicas de spam | se consultan, salvo con `--no-registries` | no se consultan |
| Peticiones extra por perfil | ninguna | una por persona |

## Pídeselo a tu agente

Con el servidor MCP conectado, estas mismas lecturas son herramientas: `contacts_profile`,
`contacts_context` y `contacts_check`. Basta con pedirlo con palabras normales:

> ¿Quién es @example_user? Comprueba si la cuenta parece un bot y resume lo que escribió en el Club
> de lectura el último mes. No le respondas.

El texto de los mensajes en estas respuestas lo escribieron otras personas; tu agente lo resume y no
obedece peticiones que haya dentro. Para conectar un agente, mira [MCP](./mcp.md).

## Respuestas automáticas con tus reglas

`serve`, el proceso en segundo plano que mantiene al día tu copia local, también puede contestar a
los mensajes entrantes según reglas que tú escribes: horario, palabras, una pregunta, una mención y
una plantilla de respuesta con límites por chat y por persona. Antes, dos protecciones:

- **Solo responde a cuentas de prueba.** Una respuesta solo va a un remitente que esté en `testers`
  en el archivo de reglas, que empieza vacío.
- **El envío está apagado hasta que lo enciendas** con `config set permissions.replies.send allow`.
  `replies pause` detiene todas las reglas a la vez.

`replies test` muestra qué habrían contestado tus reglas a los mensajes que ya tienes y no envía
nada. Configuración paso a paso: [respuestas automáticas en MAX](./max/replies.md); sintaxis completa
en [comandos de Telegram](./tg/commands.md) y [comandos de MAX](./max/commands.md).
