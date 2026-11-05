---
title: "ChatGPT o Claude en el navegador"
---

Usa esta página cuando quieras que una aplicación de IA que funciona en el navegador o en el móvil, por ejemplo ChatGPT o Claude, lea tu Google Calendar a través de `gcal`. Esa aplicación no puede iniciar `gcal` en tu ordenador, así que le das una dirección de internet. Al final, la aplicación está conectada a `gcal` mediante una dirección HTTPS privada, solo puede hacer lo que permite tu perfil, y sabes cómo detenerla o retirarle el acceso.

Términos de esta página:

- **MCP** (Model Context Protocol) es la forma estándar en que una aplicación de IA llama a herramientas externas. `gcal personal mcp serve` es el servidor MCP que viene con `gcal`; para una aplicación en tu propio ordenador, consulta [agentes](./usage.md#agents).
- **Conexión remota** significa que la aplicación se conecta desde sus propios servidores, por internet, a la dirección que le das. Para ello, `gcal personal mcp serve --http` ofrece las mismas herramientas por HTTP en `127.0.0.1`.
- **Túnel HTTPS** es un programa que da a un puerto de tu ordenador una dirección HTTPS pública. Esta página usa [Tailscale Funnel](https://tailscale.com/docs/features/tailscale-funnel); Cloudflare Tunnel también sirve. Para Funnel no necesitas comprar un dominio.
- **URL pública** es esa dirección, por ejemplo `https://laptop.tail1234.ts.net`. Se la pasas a `gcal` con `--public-url`, y la aplicación la recibe con `/mcp` al final.
- **Código de acceso** es un código de un solo uso que `gcal` muestra en tu terminal. La página de inicio de sesión de la aplicación lo pide, de modo que solo alguien que vea ese terminal puede conectar una aplicación.

```text
ChatGPT / Claude ──internet──▶ Tailscale Funnel ──▶ gcal personal mcp serve --http (login) ──▶ Google Calendar
```

Si tu conexión de Tailscale ya funciona, mantenla; no necesitas un segundo túnel. La conexión local por la entrada y la salida estándar sigue funcionando como antes.

## Antes de empezar

- **Quien inicia sesión lee tu calendario.** Los eventos, sus descripciones, los asistentes y las personas con las que te reúnes. El inicio de sesión necesita el código de acceso de tu terminal.
- **Los permisos del perfil deciden qué puede cambiar la aplicación.** Por MCP no hay nadie a quien preguntar, así que un permiso en `ask` deja que el comando se ejecute. Por defecto eso incluye crear, cambiar y borrar eventos, y compartir un calendario con cualquiera ([permisos](./configuration.md#permissions)). La aprobación de la propia aplicación es aparte y depende de su configuración. Un cambio también necesita el permiso de escritura de Google: un perfil que inició sesión sin `--grant write` solo lee ([iniciar sesión](./usage.md#sign-in-to-google)).
- **El ordenador que ejecuta `gcal` debe seguir encendido.** Para usarlo desde el móvil, ejecuta todo esto en un pequeño servidor siempre encendido e inicia sesión en Google allí.
- **Comprueba que tu aplicación o espacio de trabajo permite conexiones MCP personalizadas.** La disponibilidad y los controles de administración dependen de la aplicación. Sigue la [guía de conexión de OpenAI](https://developers.openai.com/api/docs/guides/custom-mcp-server) o la [guía de conectores de Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) actuales.

No todos los pasos de configuración se han probado en cada sistema operativo. Si un paso no funciona, [abre una incidencia](https://github.com/WireCatLabs/gcal-cli/issues).

## Inicia el túnel y el servidor

Primero instala `gcal` e inicia sesión en Google ([instalación](./installation.md)). Usa el mismo usuario del sistema operativo y el mismo perfil para la configuración y para el servidor MCP.

Instala [Tailscale](https://tailscale.com/download), inicia sesión y activa [Funnel](https://tailscale.com/docs/features/tailscale-funnel): MagicDNS, los certificados HTTPS y el permiso de Funnel deben estar activados en tu tailnet (tu red de Tailscale). El primer comando de Funnel puede mostrar un enlace de aprobación.

Mantén abiertas dos ventanas de terminal. La primera ejecuta el túnel. Copia la dirección HTTPS que muestra en la segunda ventana, sin `/mcp`. Conserva un puerto público explícito como `:8443`.

El servidor escucha en `127.0.0.1:8765` (`--port` lo cambia) y muestra un código de acceso. Nunca necesita permisos de administrador; solo el túnel puede necesitarlos.

En Linux, primera ventana:

```sh
sudo tailscale funnel 8765
```

En macOS, cuando `tailscale` no está en el PATH ([guía de la CLI de Tailscale](https://tailscale.com/docs/reference/tailscale-cli?tab=macos)):

```sh
TAILSCALE_BE_CLI=1 /Applications/Tailscale.app/Contents/MacOS/Tailscale funnel 8765
```

En Windows, en PowerShell ejecutado como administrador:

```powershell
& "$env:ProgramFiles\Tailscale\tailscale.exe" funnel 8765
```

Segunda ventana, con tu usuario normal, sin `sudo`. Todos los comandos de abajo usan
`https://laptop.example-tailnet.ts.net` como dirección de ejemplo, que no funciona para nadie: pon en su lugar la
dirección HTTPS que imprimió tu túnel.

```sh
gcal personal mcp serve --http --port 8765 --public-url https://laptop.example-tailnet.ts.net
```

Responde con la dirección local en la que sirve, la dirección del conector para la aplicación y el código de acceso.

Para ejecutar `gcal` junto a `tg`, `drive` u otra herramienta de WireCat, da a cada servidor su propio puerto local. Después, o bien da a cada uno su propio puerto HTTPS público, por ejemplo un segundo Funnel con `--https=8443 8766` y `gcal personal mcp serve --http --port 8766 --public-url https://laptop.example-tailnet.ts.net:8443` (Funnel admite los puertos públicos `443`, `8443` y `10000`), o bien comparte una dirección con una ruta por herramienta: `--public-url https://laptop.example-tailnet.ts.net/gcal`, con el `--set-path /gcal` de Funnel apuntando a ese puerto. La dirección del conector es entonces `…/gcal/mcp`. Consulta la [referencia del comando Funnel](https://tailscale.com/docs/reference/tailscale-cli/funnel).

### Alternativa: Cloudflare Tunnel

Un [túnel de Cloudflare con nombre](https://developers.cloudflare.com/tunnel/get-started/) con un nombre de host público como `mcp.example.com` y el servicio local `http://127.0.0.1:8765` funciona igual:

```sh
gcal personal mcp serve --http --port 8765 --public-url https://mcp.example.com
```

Un Quick Tunnel temporal (`cloudflared tunnel --url …`) no funciona: [los Quick Tunnels no admiten SSE](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/), que es como el servidor MCP por HTTP envía las respuestas.

### Mantenerlo en segundo plano

Para que el servidor siga funcionando después de cerrar su ventana, inícialo en segundo plano. Responde en cuanto escucha, con la dirección del conector y el código de acceso:

```sh
gcal personal mcp server start --port 8765 --public-url https://laptop.example-tailnet.ts.net
gcal personal mcp server status   # running, port, connector address, the current login code, apps logged in
gcal personal mcp server stop     # stops only a server that `mcp server start` started
```

Un servidor iniciado así no escribe el código en su registro: lo muestra `mcp server status`. El código se guarda en la carpeta de estado de `gcal`, `mcp-http/<profile>.lock`, que solo tu usuario puede leer (modo 600).

Un servidor puede atender varios perfiles: `gcal mcp serve --http --profiles work,personal`, o `--profiles all` para todos los perfiles de este ordenador. Cada llamada a una herramienta nombra entonces su perfil. Un conjunto de perfiles tiene su propio inicio de sesión, aparte del de cada perfil; `mcp server start | stop | status` y `mcp revoke` aceptan el mismo `--profiles`. Sin un perfil ni `--profiles`, `gcal` se niega y lista los perfiles.

## Conecta la aplicación

La dirección para la aplicación es tu URL pública con `/mcp` al final, por ejemplo `https://laptop.example-tailnet.ts.net/mcp`. Añádela como conector MCP remoto:

- **ChatGPT:** abre **Plugins**, elige **+ Add custom MCP server** y crea un plugin con la dirección `/mcp` y OAuth, como describe la [guía de conexión de OpenAI](https://developers.openai.com/api/docs/guides/custom-mcp-server). Elige el registro dinámico de clientes (DCR) cuando se ofrezca y luego instala el plugin antes de usarlo en una conversación.
- **Claude:** añade un conector personalizado con esta dirección, como se describe en [conectores personalizados de Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

La aplicación abre la página de inicio de sesión de `gcal`. Comprueba la línea que dice adónde va el inicio de sesión: debe ser la aplicación que conectas, como `chatgpt.com` o `claude.ai`. Después escribe el código de acceso de tu terminal. Un código sirve para un inicio de sesión y durante diez minutos; luego `gcal` muestra uno nuevo. Tras cinco códigos incorrectos la página se niega durante treinta segundos y después acepta el código más reciente. La aplicación sigue con la sesión iniciada mientras use la conexión al menos una vez cada 30 días.

El servidor ofrece las mismas tres herramientas que por la entrada y la salida estándar: `gcal_tools_search`, `gcal_read` y `gcal_write`. `api call`, vaciar un calendario, `session` y `mcp` nunca se ofrecen. Los títulos, las descripciones de los eventos y los nombres de los asistentes son palabras de otras personas: la aplicación debe tratarlos como datos, nunca como instrucciones.

## Permisos para este proceso del servidor

El servidor no puede ver si la aplicación te preguntó antes de una llamada. Repite `--permission key=level` para endurecer los permisos solo para este proceso del servidor:

```sh
gcal personal mcp serve --http --public-url https://laptop.example-tailnet.ts.net --permission api=readonly
gcal personal mcp serve --http --public-url https://laptop.example-tailnet.ts.net --permission api.calendar.acl=deny
```

`api=readonly` rechaza cualquier cambio, también en los eventos; `api.calendar.acl=deny` impide que la aplicación comparta un calendario. Un ajuste así solo endurece: nunca afloja el nivel del perfil. Para permitir más, cambia los permisos del perfil ([ajustes](./configuration.md#permissions)). `GCAL_READ_ONLY=1` en el entorno del servidor también rechaza cualquier cambio.

## Detén el servidor o revoca el acceso

Pulsa Ctrl-C en las dos ventanas para detener el servidor y el túnel. Los inicios de sesión de las aplicaciones sobreviven a un reinicio.

Si iniciaste Funnel con `--bg`, Ctrl-C no detiene esa ruta en segundo plano: consulta `tailscale funnel status` y desactiva solo su puerto, por ejemplo `tailscale funnel --https=443 off`.

Para cerrar la sesión de todas las aplicaciones de un perfil, o del servidor de varios perfiles:

```sh
gcal personal mcp revoke
gcal mcp revoke --profiles all
```

Esas aplicaciones deben iniciar sesión de nuevo con un código nuevo. Esto no cierra la sesión de `gcal` en Google; eso lo hace `session end`.

## Si no funciona

- **La aplicación dice que no puede conectarse:** abre `https://laptop.example-tailnet.ts.net/.well-known/oauth-protected-resource/mcp` en un navegador (con una ruta: `…/.well-known/oauth-protected-resource/gcal/mcp`). Debe mostrar un JSON breve. Si no, Funnel no está en marcha, no está activado en tu red de Tailscale o apunta a otro puerto.
- **La página de inicio de sesión dice «Too many wrong codes»:** espera treinta segundos y escribe el código más reciente. Si no los escribiste tú, alguien encontró tu dirección: ejecuta `gcal personal mcp revoke` y plantéate un nuevo nombre de dispositivo en Tailscale.
- **«already serves MCP over HTTP for this profile»:** ya hay un servidor para este perfil, quizá en segundo plano. `gcal personal mcp server status` dice dónde; `mcp server stop` detiene uno que inició `server start`.
- **«port 8765 is in use»:** otro programa lo ocupa; pasa otro `--port` y apunta el túnel a él.
- **«too many logged-in apps»:** diez aplicaciones tienen la sesión iniciada. Ejecuta `gcal personal mcp revoke` y vuelve a conectar.
- **La lectura funciona, la escritura falla:** revisa los permisos del perfil, los ajustes de `--permission`, `GCAL_READ_ONLY` y el permiso de escritura de Google (`gcal personal session status` lista los `grants`).
