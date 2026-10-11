---
title: "Instalación"
---

Instala `zm`, registra tu aplicación de Zoom, conecta la cuenta y elige un perfil local.
Después, `zm pull` obtiene las reuniones que organizaste para que el agente pueda leerlas.

## Requisitos

- **Node 22.16 o posterior dentro de 22.x, o Node 24 o posterior.** También funciona con Bun.
- Linux, macOS o Windows. Los trabajos diarios automáticos solo se instalan en Linux mediante temporizadores de usuario de systemd.
- Un llavero del sistema. Los tokens solo se guardan allí; si falta, aparece un error. Nunca se escriben en la configuración.
- **Tu propia aplicación de Zoom** con Public Client OAuth: [la guía](./zoom-app.md) lleva unos minutos.
  Una cuenta corporativa puede necesitar autorización del administrador.

## Instalar

```sh
npm install -g @wirecat/zoom-cli
zm --version
```

`--help` y `--version` funcionan sin aplicación configurada ni sesión. `zm doctor` comprueba
el entorno y la configuración pública sin conectar la cuenta ni abrir la base de datos.

## Primera ejecución

```sh
zm config set zoom.clientId <public-client-id>
zm login
zm config set account.profile personal
zm pull --lookback-days 7
zm meetings list
```

[Sesiones](./sessions.md) explica el acceso y los perfiles; [el archivo](./archive.md), las descargas,
importaciones y grabaciones. Para dar acceso al agente, consulta [MCP y skills](./mcp.md).

## Dónde se guardan los archivos

Los directorios siguen las convenciones de la plataforma. `ZM_CONFIG_DIR` cambia el directorio de
configuración y el servicio del llavero utilizado. Los datos viven en la base compartida de WireCat
(`wirecat.db`), usada por otras herramientas; `MESSAGING_STORE` elige una ruta explícita.
Consulta [configuración](./configuration.md).

## Completar comandos

`zm complete -- <words...>` responde a peticiones de autocompletado con el protocolo de la shell,
salvo que pidas JSON. `zm commands --json` enumera argumentos, opciones y ejemplos.
