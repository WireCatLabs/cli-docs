---
title: "ChatGPT o Claude en el navegador"
---
**Estado:** este montaje sigue la documentación de cada herramienta. No lo hemos probado completo de principio a fin. Si algún paso no funciona como se describe, [abre una incidencia](https://github.com/leemour/max-cli/issues).

`max mcp` se comunica con la aplicación de IA mediante un canal en tu propio ordenador. ChatGPT y Claude en el navegador se conectan desde sus servidores, por internet, a una dirección que les facilites. Esta página sitúa dos herramientas gratuitas entre ellos y `max`:

- **[mcp-auth-proxy](https://github.com/sigbit/mcp-auth-proxy)** inicia `max mcp` y permite la conexión únicamente después de introducir tu contraseña en la página de acceso.
- **[Tailscale Funnel](https://tailscale.com/kb/1223/funnel)** proporciona una dirección HTTPS pública como `https://laptop.tail1234.ts.net`. No necesitas comprar un dominio.

```text
ChatGPT / Claude ──интернет──▶ Tailscale Funnel ──▶ mcp-auth-proxy (пароль) ──▶ max mcp ──▶ MAX
```

## Antes de empezar

- **Quien conoce la contraseña puede leer tu MAX.** Usa una contraseña larga que no reutilices. No ejecutes este servicio sin contraseña ni mediante un túnel sin autenticación.
- **La mayoría de escrituras están permitidas por defecto.** Antes de conectar la aplicación, establece `permissions` con `readonly` o `deny` para los recursos que no debe cambiar. Una clave más específica puede permitir una acción concreta; revisa los permisos efectivos con `max config show`. `--confirm-send` confirma cada escritura; aquí también se aplica la lista de destinatarios. El antiguo `--allow-send` no añade permisos. Consulta [mcp.md](./mcp.md) y [configuración](./configuration.md).
- **El ordenador con `max` debe estar encendido.** Para usarlo desde un teléfono o un portátil sin configurar, ejecútalo en un pequeño servidor siempre encendido e inicia sesión allí (`max setup --agent none`). Después solo necesitas el navegador.
- **Quién puede usarlo:**

| Aplicación | Planes | Documentación |
|---|---|---|
| ChatGPT | Plus, Pro, Business, Enterprise, Education, en modo de desarrollador | [Modo de desarrollador](https://developers.openai.com/api/docs/guides/developer-mode) |
| Claude | Cualquier plan; uno personalizado en el gratuito | [Conectores personalizados](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) |
| Gemini | Solo adultos en EE. UU. con cuenta personal de Google; no disponible en Rusia ni Europa | [Aplicaciones conectadas](https://support.google.com/gemini/answer/17209137?hl=en) |

## 1. Dar una dirección pública al ordenador

Instala [Tailscale](https://tailscale.com/download) e inicia sesión. Activa MagicDNS, certificados HTTPS y permiso para Funnel en tu red, siguiendo la [Guía de Funnel](https://tailscale.com/kb/1223/funnel). Ejecuta esto en un terminal que mantendrás abierto:

```sh
tailscale funnel 8080
```

La orden muestra `https://<устройство>.<сеть>.ts.net`. Ctrl-C cierra el acceso.

## 2. Añadir autenticación delante de `max`

Descarga `mcp-auth-proxy` desde sus [versiones publicadas](https://github.com/sigbit/mcp-auth-proxy/releases). En un segundo terminal, introduce la contraseña en la entrada oculta para evitar el historial e inicia el proxy con tu dirección:

```sh
read -rs PASSWORD && export PASSWORD
./mcp-auth-proxy \
  --external-url https://<устройство>.<сеть>.ts.net \
  --no-auto-tls \
  --listen 127.0.0.1:8080 \
  -- max mcp --confirm-send
```

`--no-auto-tls` indica que Tailscale ya proporciona el certificado. `--listen 127.0.0.1:8080` limita el acceso al Funnel de este ordenador. También puedes usar autenticación GitHub o Google restringida a tu cuenta: [Configuración del proxy](https://github.com/sigbit/mcp-auth-proxy/blob/main/docs/docs/configuration.md).

## 3. Añadirlo a la aplicación

La dirección termina en `/mcp`: `https://<устройство>.<сеть>.ts.net/mcp`.

- **ChatGPT:** activa el modo de desarrollador y añade el conector siguiendo la [documentación](https://developers.openai.com/api/docs/guides/developer-mode). Por defecto, ChatGPT pide confirmar cada acción que modifica algo.
- **Claude:** añade un conector personalizado con esa dirección siguiendo la [documentación](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp). Cada herramienta puede estar siempre permitida, requerir confirmación o estar prohibida.

La aplicación abre la página de acceso del proxy; introduces la contraseña una vez.

## Desconectar

Pulsa Ctrl-C en ambos terminales. Al cerrar Funnel, no queda ningún acceso público. Para impedir reconexiones, elimina el conector de la aplicación y cambia la contraseña antes de volver a iniciar el proxy.

## Solucionar problemas

- **No conecta:** abre la dirección en el navegador; debe aparecer la página de acceso. Si no, Funnel no está iniciado o habilitado en la red.
- **Conecta, pero no hay herramientas:** ejecuta `max mcp` directamente en el terminal para detectar una sesión caducada (`max session start`).
- Las operaciones se registran como cualquier otra orden: `max runs list` ([Diagnóstico](./diagnostics.md)).
