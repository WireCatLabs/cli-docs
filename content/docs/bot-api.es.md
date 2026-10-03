---
title: Bot API completa
description: Todos los métodos de las Bot API oficiales de Telegram y MAX desde la CLI.
---

**Todos los métodos de la Bot API están disponibles desde la CLI.** La interfaz nativa completa
complementa los comandos sencillos para mensajes, archivos y administración de chats. Telegram
cubre los 185 métodos del esquema fijado de Bot API 10.3; MAX cubre las 33 operaciones de su esquema oficial.

Usa Telegram CLI **0.25.0 o posterior** y MAX CLI **0.25.0 o posterior**. Consulta la [instalación](./installation.mdx).

## Descubre todos los métodos

```sh
tg sales bot api --help
max sales bot api --help
tg sales bot api get-me --json
max sales bot api get-my-info --json
```

La primera palabra es el perfil de tu bot. La ayuda `--help` de cada método enumera sus campos
nativos. Los nombres y parámetros siguen la API del proveedor y pueden diferir entre Telegram y MAX.

## Solicitudes y respuestas nativas

Los parámetros son opciones o JSON mediante `--body`, `--body-file` o stdin. El parámetro nativo
`timeout` se llama `--poll-timeout`; `--timeout` limita el comando completo. Las respuestas conservan
la estructura del proveedor; los enteros fuera del rango seguro de JavaScript se representan como cadenas.

Algunos métodos requieren permisos del bot o capacidades concretas de la plataforma. Las escrituras
usan los permisos del perfil, la comprobación de destinatarios y el registro. Pasa las credenciales
por stdin o por un archivo JSON protegido, nunca por argumentos. Los métodos que devuelven tokens
requieren `--store-token <profile>`: el token se guarda solo en el almacén de claves del sistema
y stdout muestra un recibo.

## CLI y MCP

La API nativa completa es una **interfaz CLI**. MCP ofrece herramientas separadas para tareas
habituales, no una herramienta por cada método. Un agente con terminal puede usar `tg bot api`
o `max bot api` para las operaciones restantes.

Más detalles: [bots de Telegram](https://github.com/leemour/tg-cli/blob/v0.25.0/docs/bot.md),
[bots de MAX](https://github.com/leemour/max-cli/blob/v0.25.0/docs/bot.md),
[Telegram Bot API](https://core.telegram.org/bots/api), [MAX Bot API](https://dev.max.ru/docs-api).
