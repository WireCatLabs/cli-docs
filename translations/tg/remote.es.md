---
title: "ChatGPT o Claude en el navegador"
---

**Estado:** esta configuración se basa en la documentación de cada herramienta. No la hemos probado de principio a fin. Si algún paso no funciona como se describe, [abre una incidencia](https://github.com/leemour/tg-cli/issues).

`tg mcp` se comunica con una aplicación de IA mediante una tubería en tu equipo. ChatGPT y Claude en el navegador no pueden usarla: se conectan desde sus servidores, por internet, a una dirección que les indiques. Esta guía sitúa dos herramientas gratuitas entre esas aplicaciones y `tg`:

- **[mcp-auth-proxy](https://github.com/sigbit/mcp-auth-proxy)** ejecuta `tg mcp` y solo permite conectarse después de introducir tu contraseña en una página de acceso.
- **[Tailscale Funnel](https://tailscale.com/kb/1223/funnel)** proporciona una dirección HTTPS pública para tu equipo, como `https://laptop.tail1234.ts.net`. No necesitas comprar un dominio.

```text
ChatGPT / Claude ──internet──▶ Tailscale Funnel ──▶ mcp-auth-proxy (password) ──▶ tg mcp ──▶ Telegram
```

## Antes de empezar

- **Quien supere la contraseña puede leer tu Telegram.** Usa una contraseña larga que no utilices en ningún otro sitio. Nunca lo configures sin contraseña ni mediante un túnel sin autenticación.
- **Por defecto, la aplicación de IA puede enviar mensajes.** Con los ajustes predeterminados, `tg mcp` permite enviar, editar, reaccionar, reenviar, fijar, votar y marcar chats como leídos. Si solo debe leer, sirve un perfil `readonly`; también puedes iniciar el servidor con `--confirm-send` para aprobar o rechazar cada cambio. La lista de destinatarios y el límite por hora siguen aplicándose ([permisos del agente](./mcp.md#what-an-agent-may-do)).
- **El equipo que ejecuta `tg` debe estar encendido.** Para usarlo desde un móvil o portátil sin instalar nada allí, ejecuta todo en un pequeño servidor que permanezca encendido e inicia sesión en él (`tg session start`). En tu dispositivo solo necesitarás un navegador.
- **Quién puede utilizarlo:**

| Aplicación | Planes | Documentación |
|---|---|---|
| ChatGPT | Plus, Pro, Business, Enterprise, Education: en modo desarrollador | [modo desarrollador](https://developers.openai.com/api/docs/guides/developer-mode) |
| Claude | todos los planes; el gratuito permite un conector personalizado | [conectores personalizados](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) |
| Gemini | solo adultos en EE. UU. con una cuenta personal de Google | [aplicaciones conectadas](https://support.google.com/gemini/answer/17209137?hl=en) |

## 1. Dar una dirección pública al equipo

Instala [Tailscale](https://tailscale.com/download) e inicia sesión. Funnel necesita MagicDNS, certificados HTTPS y permiso para Funnel en tu tailnet; la [guía de Funnel](https://tailscale.com/kb/1223/funnel) explica cómo activarlos. Después, en una terminal que dejarás abierta:

```sh
tailscale funnel 8080
```

Se mostrará tu dirección, `https://<device>.<tailnet>.ts.net`. Ctrl-C vuelve a cerrarla.

## 2. Proteger el acceso a `tg`

Descarga `mcp-auth-proxy` desde [sus versiones publicadas](https://github.com/sigbit/mcp-auth-proxy/releases). En otra terminal, introduce la contraseña en un campo oculto para que no quede en el historial de la terminal, e inicia el proxy con tu dirección:

```sh
read -rs PASSWORD && export PASSWORD
./mcp-auth-proxy \
  --external-url https://<device>.<tailnet>.ts.net \
  --no-auto-tls \
  --listen 127.0.0.1:8080 \
  -- tg mcp
```

`--no-auto-tls` se utiliza porque Tailscale ya proporciona el certificado; `--listen 127.0.0.1:8080` permite acceder al proxy solo a Funnel desde este equipo. El proxy también admite acceso con GitHub o Google restringido a tu cuenta en lugar de contraseña: consulta [su configuración](https://github.com/sigbit/mcp-auth-proxy/blob/main/docs/docs/configuration.md).

## 3. Añadirlo a la aplicación de IA

La dirección que debes introducir es la de Funnel con `/mcp` al final: `https://<device>.<tailnet>.ts.net/mcp`.

- **ChatGPT:** activa el modo desarrollador y añade un conector con esa dirección, siguiendo la [guía del modo desarrollador](https://developers.openai.com/api/docs/guides/developer-mode). Por defecto, ChatGPT solicita confirmación para cada acción que escribe.
- **Claude:** añade un conector personalizado con esa dirección, siguiendo la [guía de conectores personalizados](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp). En sus ajustes puedes permitir siempre cada herramienta, exigir aprobación o bloquearla.

La aplicación abre la página de acceso del proxy; introduce la contraseña una vez.

## Desactivarlo

Pulsa Ctrl-C en ambas terminales. Nada permanece abierto cuando se cierra Funnel. Para impedir que una aplicación vuelva a conectarse, elimina su conector en los ajustes y cambia la contraseña antes de iniciar de nuevo el proxy.

## Si algo no funciona

- **La aplicación indica que no puede conectarse:** abre la dirección en un navegador; debería mostrar la página de acceso del proxy. Si no aparece, Funnel no se está ejecutando o no está habilitado en la tailnet.
- **Se conecta pero no muestra herramientas:** ejecuta `tg mcp` solo en una terminal. Allí se verá si la sesión ha caducado (`tg session start`).
- `tg mcp` registra las llamadas fallidas como cualquier otro comando, y todas las llamadas con `--record` o `record: true`: `tg runs list`.
