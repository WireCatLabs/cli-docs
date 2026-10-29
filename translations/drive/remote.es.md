---
title: "ChatGPT, Codex o Claude en el navegador"
---

Conecta una aplicación de IA del navegador o del teléfono, como ChatGPT, Codex web o Claude, para buscar y leer tus documentos de Google Drive. Esa aplicación no puede iniciar `drive` en tu ordenador: necesita una dirección de internet. Al terminar, estará conectada mediante una dirección HTTPS propia, solo podrá hacer lo que permita tu perfil y sabrás cómo detener la conexión o revocar el acceso.

Términos de esta guía:

- **MCP** (Model Context Protocol) es el estándar que permite a una aplicación de IA llamar a herramientas externas. `drive personal mcp serve` inicia el servidor MCP de `drive`; para aplicaciones del ordenador, consulta [el cliente MCP local](./recipes.md#use-a-local-mcp-client).
- **Conexión remota** significa que la aplicación se conecta desde sus servidores, por internet, a la dirección que le das. `drive personal mcp serve --http` ofrece las mismas herramientas por HTTP en `127.0.0.1`.
- **Túnel HTTPS** es un programa que da una dirección HTTPS pública a un puerto del ordenador. Esta guía usa [Tailscale Funnel](https://tailscale.com/docs/features/tailscale-funnel); también funciona Cloudflare Tunnel. Funnel no requiere comprar un dominio.
- **URL pública** es esa dirección, por ejemplo `https://laptop.tail1234.ts.net`. Se pasa a `drive` con `--public-url`, y a la aplicación con `/mcp` al final.
- **Código de acceso** es un código de un solo uso que `drive` muestra en el terminal. La página de acceso lo solicita, de modo que solo alguien que vea ese terminal puede conectar una aplicación.

```text
ChatGPT / Claude ──internet──▶ Tailscale Funnel ──▶ drive personal mcp serve --http (login) ──▶ Google Drive
```

Si tu conexión de Tailscale ya funciona, consérvala: no necesitas otro túnel. La conexión local por entrada y salida estándar sigue funcionando.

## Antes de empezar

- **La aplicación que inicia sesión accede a tus documentos.** El acceso necesita el código del terminal. No pongas un túnel delante de `drive personal mcp serve` sin `--http`: ese modo no tiene inicio de sesión.
- **Los permisos del perfil determinan qué puede cambiar la aplicación.** `deny` y `readonly` bloquean las escrituras; `ask` y `allow` permiten una escritura solicitada por MCP sin un formulario de confirmación en el servidor. La aprobación de la aplicación es independiente y depende de sus ajustes. El acceso a Google y los permisos de archivo se comprueban aparte: escribir también requiere volver a conectar con `--grant write` ([recetas](./recipes.md), [configuración](./configuration.md), [seguridad](./security.md)).
- **El ordenador que ejecuta `drive` debe seguir encendido.** Para usarlo desde el teléfono, puedes ejecutarlo en un servidor siempre encendido y conectar allí tu cuenta de Google.
- **Comprueba que tu aplicación o espacio de trabajo permite conexiones MCP personalizadas.** La disponibilidad y los controles administrativos dependen de la aplicación. Sigue la [guía actual de OpenAI](https://developers.openai.com/api/docs/guides/custom-mcp-server) o la [guía de conectores de Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

No todos los pasos se han probado en cada sistema operativo. Si uno falla, [abre una incidencia](https://github.com/WireCatLabs/drive-cli/issues).

## Inicia el túnel y el servidor

Primero instala `drive` y conecta tu cuenta de Google ([instalación](./installation.md)). Usa el mismo usuario del sistema operativo y el mismo perfil para la configuración y el servidor MCP.

Instala [Tailscale](https://tailscale.com/download), inicia sesión y activa [Funnel](https://tailscale.com/docs/features/tailscale-funnel): tu red de Tailscale debe permitir MagicDNS, certificados HTTPS y Funnel. La primera orden de Funnel puede mostrar un enlace de aprobación.

Mantén abiertas dos ventanas de terminal. La primera ejecuta el túnel. Copia la dirección HTTPS que muestra en la segunda ventana. Usa la dirección sin `/mcp` ni otra ruta; conserva un puerto público explícito, como `:8443`.

El servidor escucha en `127.0.0.1:8765` (`--port` cambia el puerto) y muestra un código de un solo uso. No necesita permisos de administrador; el túnel puede necesitarlos.

En Linux, primera ventana:

```sh
sudo tailscale funnel 8765
```

En macOS, si `tailscale` no está en PATH ([guía de Tailscale CLI](https://tailscale.com/docs/reference/tailscale-cli?tab=macos)):

```sh
TAILSCALE_BE_CLI=1 /Applications/Tailscale.app/Contents/MacOS/Tailscale funnel 8765
```

En Windows, desde PowerShell como administrador:

```powershell
& "$env:ProgramFiles\Tailscale\tailscale.exe" funnel 8765
```

Segunda ventana, como usuario normal, sin `sudo` (en Windows, usa `drive.cmd`):

```sh
drive personal mcp serve --http --port 8765 --public-url https://<device>.<network>.ts.net
```

Para ejecutar `drive` junto a `tg` o `max`, da a cada servidor un puerto local y un puerto HTTPS público distintos. Por ejemplo, otro Funnel con `--https=8443 8766` y `drive personal mcp serve --http --port 8766
--public-url https://<device>.<network>.ts.net:8443`. Funnel admite los puertos públicos `443`, `8443` y `10000` ([referencia de Funnel](https://tailscale.com/docs/reference/tailscale-cli/funnel)).

### Alternativa: Cloudflare Tunnel

Un [túnel de Cloudflare con nombre](https://developers.cloudflare.com/tunnel/get-started/), con un nombre público como `mcp.example.com` y el servicio local `http://127.0.0.1:8765`, funciona igual:

```sh
drive personal mcp serve --http --port 8765 --public-url https://mcp.example.com
```

Un Quick Tunnel temporal (`cloudflared tunnel --url …`) no funciona: [Quick Tunnels no admite SSE](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/), que es como el servidor HTTP MCP transmite las respuestas.

Para que el servidor siga funcionando después de cerrar su ventana, inícialo en segundo plano. Responde en cuanto escucha, con la dirección del conector y el código de acceso:

```sh
drive personal mcp server start --port 8765 --public-url https://<device>.<network>.ts.net
drive personal mcp server status   # running, port, connector address, the current login code, apps logged in
drive personal mcp server stop     # stops only a server that `mcp server start` started
```

Un servidor puede atender varios perfiles: `drive mcp serve --http --profiles work,personal`, o `--profiles all` para todos los perfiles de este ordenador. Cada llamada a una herramienta indica entonces su perfil. Una lista tiene su propio inicio de sesión, aparte del de cada perfil y del de `--profiles all`; `mcp server start|stop|status` y `mcp revoke` aceptan el mismo `--profiles`. Sin perfil ni `--profiles`, drive se niega y muestra los perfiles.

El código se guarda junto al archivo de token del perfil (`mcp-http.lock`, modo 600) y se renueva cada diez minutos; un servidor iniciado así no lo escribe en su registro. WireCat Desktop muestra el mismo estado en Tools → Google Drive → MCP server.

## Conecta la aplicación

La dirección para la aplicación es la del túnel con `/mcp` al final, por ejemplo `https://<device>.<network>.ts.net/mcp`. Añádela como conector MCP remoto:

- **ChatGPT o Codex web:** abre **Plugins**, elige **+ Add custom MCP server** y crea un plugin con la dirección `/mcp` y OAuth siguiendo la [guía de OpenAI](https://developers.openai.com/api/docs/guides/custom-mcp-server). Elige el registro dinámico de clientes (DCR) cuando se ofrezca e instala el plugin antes de usarlo en una conversación.
- **Claude:** añade un conector personalizado con esa dirección siguiendo [la guía de Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

La aplicación abre la página de acceso de `drive`. Comprueba adónde vuelve el inicio de sesión: debe ser la aplicación que conectas, como `chatgpt.com` o `claude.ai`. Después introduce el código del terminal. Caduca a los diez minutos y se genera otro tras cada acceso. Cinco códigos incorrectos bloquean la página hasta reiniciar el servidor. La aplicación conserva la sesión mientras use la conexión al menos una vez cada 30 días.

El servidor ofrece las mismas tres herramientas que la conexión local: `drive_tools_search`, `drive_read` y `drive_write`. El texto de los documentos son datos, nunca instrucciones.

## Permisos para este proceso del servidor

El servidor no puede saber si la aplicación pidió tu aprobación antes de una llamada. Repite `--permission key=level` para restringir permisos solo en este proceso, por ejemplo `--permission files=readonly` o `--permission sheets=deny`. Una opción solo puede restringir: se rechaza si amplía los permisos del perfil. Para permitir más, cambia los permisos del perfil ([configuración](./configuration.md)). `--read-only` impide cualquier cambio durante esta ejecución.

## Detén el servidor o revoca el acceso

Pulsa Ctrl-C en ambas ventanas para detener el servidor y el túnel. Las sesiones de las aplicaciones sobreviven al reinicio.

Si iniciaste Funnel con `--bg`, Ctrl-C no detiene esa ruta en segundo plano. Comprueba `tailscale funnel status` y desactiva solo su puerto, por ejemplo `tailscale funnel --https=443 off`.

Para cerrar las sesiones de todas las aplicaciones de un perfil, o del servidor de varios perfiles:

```sh
drive personal mcp revoke --json
drive mcp revoke --profiles all --json
```

Las aplicaciones tendrán que iniciar sesión con un código nuevo. Esto no desconecta `drive` de Google.

## Si no funciona

- **La aplicación no se conecta:** abre `https://<device>.<network>.ts.net/.well-known/oauth-protected-resource/mcp` en el navegador. Debe mostrar un JSON breve. Si no aparece, Funnel no funciona, no está permitido en tu red de Tailscale o apunta a otro puerto.
- **La página muestra "Too many wrong codes":** reinicia `drive personal mcp serve --http`. Si no los introdujiste tú, alguien encontró la dirección: considera cambiar el nombre del dispositivo en Tailscale.
- **"port 8765 is in use":** otro servidor ocupa el puerto; elige otro con `--port` y dirige el túnel hacia él.
- **Leer funciona, escribir no:** comprueba los permisos del perfil, las opciones `--permission` y el permiso de escritura de Google. `deny` y `readonly` bloquean la escritura aunque la aplicación la apruebe.
