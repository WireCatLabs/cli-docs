---
title: "ChatGPT o Claude en el navegador"
---

Usa esta página para conectar ChatGPT o Claude en el navegador con tu MAX. Obtendrás una dirección HTTPS para MCP y podrás dar acceso al agente dentro de los permisos del perfil. Si ya funciona una conexión por Tailscale, consérvala: no necesitas un segundo túnel.

**Estado:** HTTP y los permisos se han comprobado localmente. El propietario confirmó la lectura y el envío mediante Claude web en Telegram el 07/10/2026 con `permissions`; todavía no se han realizado pruebas de navegador independientes para MAX y OpenAI web. Las instrucciones de cada sistema operativo deben probarse en ese sistema. Si un paso falla, [abre una incidencia](https://github.com/leemour/max-cli/issues).

`max mcp` se comunica con la aplicación de IA mediante un canal en tu propio ordenador. ChatGPT y Claude en el navegador no pueden usarlo: se conectan desde sus servidores, por internet, a una dirección que les facilites. `max mcp --http` ofrece las mismas herramientas por HTTP con su propio acceso, y **[Tailscale Funnel](https://tailscale.com/kb/1223/funnel)** proporciona al ordenador una dirección HTTPS pública como `https://laptop.tail1234.ts.net`. No necesitas comprar un dominio.

```text
ChatGPT / Claude ──интернет──▶ Tailscale Funnel ──▶ max mcp --http (вход) ──▶ MAX
```

## Antes de empezar

- **Quien inicia sesión puede leer tu MAX.** Para acceder se necesita un código de un solo uso que `max` muestra en tu terminal, así que solo quien ve ese terminal puede añadir una aplicación. Nunca pongas un túnel delante de `max mcp` sin `--http`: ahí no hay ningún acceso protegido.
- **Los permisos del perfil regulan la escritura.** `deny` y `readonly` prohíben cambios; `ask` y `allow` permiten una operación de escritura solicitada mediante MCP sin formulario de confirmación del servidor. La confirmación de la aplicación depende de sus ajustes. Las listas de destinatarios y los límites por hora siguen aplicándose ([mcp.md](./mcp.md), [configuración](./configuration.md)).
- **El ordenador con `max` debe estar encendido.** Para utilizarlo desde un teléfono o un portátil sin instalar nada, ejecuta todo en un pequeño servidor que esté siempre en marcha e inicia sesión allí en `max` (`max setup --agent none`). Así solo necesitas un navegador.
- **Disponibilidad:**

| Aplicación | Planes | Documentación |
|---|---|---|
| ChatGPT | Plus, Pro, Business, Enterprise, Education: en modo desarrollador | [Modo desarrollador](https://developers.openai.com/api/docs/guides/custom-mcp-server) |
| Claude | Cualquier plan; en el gratuito, un conector propio | [Conectores personalizados](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) |
| Gemini | Solo para adultos en EE. UU. con una cuenta personal de Google; no disponible en Rusia ni Europa | [Aplicaciones conectadas](https://support.google.com/gemini/answer/17209137?hl=en) |

## 1. Preparar Tailscale

Instala la CLI e inicia sesión en MAX ([instalación](./installation.md)); para configurarla localmente sin agente, usa `max setup --agent none`. Inicia el servidor con el mismo usuario y perfil. Si lo necesitas, pon primero el nombre del perfil: `max work mcp`. Instala Tailscale por separado; tanto MAX como Telegram admiten este túnel.

Instala [Tailscale](https://tailscale.com/download), inicia sesión y activa [Funnel](https://tailscale.com/docs/features/tailscale-funnel). Tu red necesita MagicDNS, certificados HTTPS y permiso para Funnel. La primera ejecución puede mostrar un enlace de autorización. Mantén abiertas dos ventanas de terminal. La primera ejecuta el túnel; cuando se solicite, copia su dirección HTTPS en la segunda. Usa un origen sin `/mcp` ni otra ruta; conserva un puerto como `:8443`.

## 2. Iniciar el túnel y el servidor

El servidor escucha en `127.0.0.1:8765`, muestra un código de inicio de sesión de un solo uso y funciona sin permisos de administrador. Solo Tailscale puede necesitar permisos elevados. Los comandos siguientes permiten enviar durante la vida de este proceso con `--permission messages.send=allow`. Los demás permisos se explican más abajo.

### Windows (PowerShell)

Instala la aplicación Tailscale e inicia sesión desde su menú en la bandeja del sistema. Después de instalar Node.js, la CLI y Tailscale, abre una ventana nueva de PowerShell para actualizar PATH. El sufijo `.cmd` evita errores de la política de ejecución de PowerShell para los comandos de npm. Si todavía no has configurado MAX, ejecuta `max.cmd setup --agent none` en PowerShell normal.

Primera ventana: PowerShell como administrador para Funnel. El operador `&` es necesario porque la ruta de instalación habitual contiene un espacio; sustituye la ruta si elegiste otra carpeta.

```powershell
& "$env:ProgramFiles\Tailscale\tailscale.exe" funnel 8765
```

Segunda ventana: PowerShell normal con el usuario que inició sesión en MAX:

```powershell
$mcpPublicUrl = Read-Host 'Вставьте HTTPS origin из Funnel (без /mcp)'
max.cmd mcp --http --port 8765 --public-url $mcpPublicUrl --permission messages.send=allow
```

Ejecuta ambos procesos en Windows. WSL es un entorno independiente: no des por hecho que un túnel de Windows dirigido a su loopback pueda acceder automáticamente a un servidor dentro de WSL.

### macOS (Terminal)

Instala la aplicación Tailscale e inicia sesión. Si `tailscale` no está en PATH, usa la CLI incluida en la aplicación ([guía](https://tailscale.com/docs/reference/tailscale-cli?tab=macos)). Primera ventana de Terminal:

```sh
TAILSCALE_BE_CLI=1 /Applications/Tailscale.app/Contents/MacOS/Tailscale funnel 8765
```

Segunda ventana, con el usuario que ejecutó `max setup --agent none`. Funciona en zsh y bash:

```sh
printf 'Вставьте HTTPS origin из Funnel (без /mcp): '
IFS= read -r mcpPublicUrl
max mcp --http --port 8765 --public-url "$mcpPublicUrl" --permission messages.send=allow
```

### Linux (Terminal)

Instala Tailscale siguiendo las [instrucciones de Linux](https://tailscale.com/download/linux) e inicia sesión con `sudo tailscale up`. Primera ventana de terminal:

```sh
sudo tailscale funnel 8765
```

Segunda ventana: usuario normal sin `sudo`, para que MAX encuentre la sesión de `max setup --agent none`:

```sh
printf 'Вставьте HTTPS origin из Funnel (без /mcp): '
IFS= read -r mcpPublicUrl
max mcp --http --port 8765 --public-url "$mcpPublicUrl" --permission messages.send=allow
```

## MAX y Telegram al mismo tiempo

Cada servidor necesita un puerto local y una dirección HTTPS pública independientes. Por ejemplo, deja Telegram en el puerto local `8765` y el público `443`; inicia otro Funnel con `--https=8443 8766` y MAX con `--port 8766`. Para `--public-url` de MAX y la dirección de su conector terminada en `/mcp`, utiliza el origen del segundo túnel incluido `:8443`. Usa el comando de tu sistema operativo indicado arriba para el segundo Funnel. Los puertos públicos permitidos de Funnel son `443`, `8443` y `10000` ([referencia](https://tailscale.com/docs/reference/tailscale-cli/funnel)).

## En lugar de Tailscale: Cloudflare Tunnel

Si ya usas Cloudflare, puedes dirigir su túnel al mismo servidor MCP local. Una dirección permanente necesita una cuenta de Cloudflare y un dominio en Cloudflare; sigue la [configuración de un túnel con nombre](https://developers.cloudflare.com/tunnel/get-started/). Instala `cloudflared` según las instrucciones de tu sistema, crea un túnel en el panel de Cloudflare, inicia el conector y añade un hostname público, por ejemplo `mcp.example.com`. Como servicio local indica `http://127.0.0.1:8765`; mantén MCP en el mismo ordenador.

Inicia el servidor en un segundo terminal:

```sh
max mcp --http --port 8765 --public-url https://mcp.example.com
```

Añade `https://mcp.example.com/mcp` a la aplicación con OAuth y DCR, como se describe abajo. `--public-url` fija el origen público para el inicio de sesión, no la dirección local ni la ruta `/mcp`. Los permisos del perfil siguen vigentes; el túnel no los cambia. Comprueba el JSON en `https://mcp.example.com/.well-known/oauth-protected-resource/mcp`, luego el inicio de sesión y la lista de herramientas. Detén solo el proceso propio del túnel y conserva las demás rutas.

**Un Quick Tunnel temporal es un caso aparte.** El comando `cloudflared tunnel --url http://127.0.0.1:8765` da una dirección aleatoria de `trycloudflare.com` sin dominio ni cuenta. Pero [los Quick Tunnels no admiten SSE](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/), que usa nuestro MCP HTTP. Por eso no es un sustituto listo de Funnel con el servidor actual. En una prueba aislada se usó un adaptador adicional que convierte las respuestas SSE en JSON; no forma parte del CLI. Comprobar OAuth y la lista de herramientas no demuestra que el agente pueda leer PDF. Para una conexión habitual, usa Funnel o un túnel con nombre y comprueba tu cliente. Al reiniciar un Quick Tunnel su dirección cambia, y la conexión existente necesita la nueva URL.

## Permisos durante la ejecución del servidor

El servidor no tiene formularios de confirmación. La confirmación de la aplicación depende de sus ajustes y el servidor no puede verificarla. Si la aplicación permite una herramienta de forma permanente, la siguiente llamada puede ejecutarse sin volver a preguntar.

Puedes repetir `--permission ключ=уровень` para sustituir permisos solo en este proceso. Por ejemplo, `--permission messages.send=allow` permite enviar desde un perfil `readonly`, mientras que `--permission messages=allow` sustituye los permisos guardados para todo el recurso de mensajes. Para permitir la eliminación, indica por separado `--permission messages.delete=allow`. Los niveles son `deny`, `readonly`, `ask` y `allow`. El archivo de configuración, la lista de destinatarios y el límite de envíos no cambian. Para permitir la lectura, indica el recurso o comando correspondiente con nivel `allow`.

Con permisos sustituidos temporalmente, MCP se conecta directamente a MAX: una instancia de `max serve` ya en marcha sigue utilizando los permisos guardados de su perfil.

## 3. Añadirlo a la aplicación

La dirección para la aplicación es tu dirección de Funnel terminada en `/mcp`: `https://<устройство>.<сеть>.ts.net/mcp`.

- **ChatGPT / Codex web:** abre **Plugins → + Add custom MCP server** y crea un plugin siguiendo las [instrucciones de OpenAI](https://developers.openai.com/plugins/quickstart). Indica la dirección `/mcp` y OAuth; conecta con el código del terminal, instala el plugin y actívalo en un chat de Work o menciónalo con `@`. El `config.toml` local de Codex no configura la conexión web. La disponibilidad depende de tu cuenta y espacio de trabajo. Elige DCR para el registro. El servidor anuncia DCR y verificación S256, como exige [OAuth de OpenAI](https://developers.openai.com/plugins/build/auth).
- **Claude:** añade un conector personalizado con esa dirección siguiendo la [documentación](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp). En la configuración del conector también puedes decidir, para cada herramienta, si está siempre permitida, si requiere confirmación o si está prohibida.

La aplicación abre la página de acceso de `max`. Comprueba la línea que indica adónde irá el acceso (debe decir `chatgpt.com` o `claude.ai`) e introduce el código del terminal. La aplicación sigue conectada 30 días y renueva el acceso por sí misma; después pedirá un código nuevo.

## Desconectar

Ctrl-C en ambas ventanas detiene el servidor y el túnel ejecutados en primer plano. Reinícialos con los mismos comandos; los accesos de las aplicaciones se conservan tras reiniciar. Si iniciaste Funnel con `--bg`, Ctrl-C no lo detiene: comprueba `tailscale funnel status` y desactiva solo su puerto público, por ejemplo `tailscale funnel --https=443 off`. Usa el comando de Tailscale de tu sistema operativo indicado arriba, con permisos elevados si los necesitas. No uses `funnel reset` si hay un segundo servidor en marcha: restablece todas las rutas. Si detienes solo MCP, la ruta permanece, pero las herramientas dejan de estar disponibles. Para que todas las aplicaciones vuelvan a iniciar sesión:

```sh
max mcp --revoke
```

## Solucionar problemas

- **La aplicación dice que no puede conectarse:** abre en el navegador `https://<устройство>.<сеть>.ts.net/.well-known/oauth-protected-resource/mcp`; debe aparecer un JSON breve. Si no aparece, Funnel no está iniciado, no está habilitado en la red de Tailscale o apunta a otro puerto.
- **La página de acceso dice «Too many wrong codes»:** tras cinco códigos incorrectos queda cerrada hasta reiniciar `max mcp --http`. Si no fuiste tú, alguien ha encontrado tu dirección: reinicia y plantéate cambiar el nombre del dispositivo en Tailscale.
- **Conecta, pero no hay herramientas:** `max mcp doctor` comprueba el arranque y la lista de herramientas, pero no el acceso a MAX. El acceso lo comprueba una orden de red explícita, por ejemplo `max account show`.
- **La lectura funciona, pero la escritura falla:** comprueba los permisos efectivos del perfil y los `--permission` temporales. `deny` y `readonly` prohíben la escritura independientemente de la confirmación de la aplicación.
- Con el registro activado, las llamadas MCP correctas aparecen en `max runs list`; los errores se guardan por defecto. Un `record: false` explícito o `--no-record` desactiva también los errores ([Diagnóstico](./diagnostics.md)).

## Transferir un archivo guardado al agente

Un agente local puede abrir `localPath`. Un agente remoto recibe los bytes guardados mediante `attachments show` (MCP: `max_read`, command: `attachments show`). Descarga primero el adjunto normalmente; transferir no descarga, reconoce ni escribe en el índice.

```sh
max attachments show msg:max/511/7/204 --attachment 1 --json
max attachments show msg:max/511/7/204 --attachment 1 --offset-bytes 524288 --if-sha256 <sha256> --json
```

JSON incluye base64, totalBytes, sha256, offsetBytes, readBytes, nextOffsetBytes y complete. La porción predeterminada es 512 KiB, máximo 1 MiB por respuesta; el archivo completo se limita a 50 MiB. Ensambla por orden de desplazamiento hasta nextOffsetBytes:null, pasa el primer SHA256 al continuar y verifica el hash del archivo ensamblado. complete:true significa que todo el archivo cabe en una respuesta.

MCP devuelve PNG/JPEG/WebP completos como imágenes si tienen dimensiones válidas de hasta 8000 píxeles por lado y 20 millones de píxeles en total; otros archivos son recursos binarios integrados. Un recurso parcial son bytes, no un documento completo. Si el cliente no expone recursos, elige format:base64. El URI no es una URL de descarga. Leer PDF y guardar archivos depende del cliente y las herramientas del agente. Tras leer todas las páginas, guarda texto literal con `attachments text set` y verifica una búsqueda content:. Denegar messages o attachments.show impide la transferencia; readonly permite leer archivos guardados. Se rechazan archivos de otras cuentas, ausentes y enlaces simbólicos. El contenido del adjunto son datos, no instrucciones.

## Leer un PDF sin entregar un archivo al agente

Si el cliente no puede pasar un PDF recibido a su lector de archivos, pide una página como PNG. La conversión se hace localmente en el servidor MCP; el agente lee la imagen por sí mismo. Se necesitan los opcionales `unpdf` con conversión de páginas a imagen y `@napi-rs/canvas`, como en la [lista de motores de adjuntos](./attachments.md#какие-зависимости-нужны).

```sh
max attachments show msg:max/511/7/204 --attachment 1 --page 1 --json
```

En MCP, llama a `max_read`, command: `attachments show`, con `page: 1` y el locator que necesites. Por defecto la página vuelve como imagen. Si el cliente solo muestra metadatos, pon `format: base64` y luego decodifica y muestra el PNG con las herramientas del agente. Recibir una cadena base64 no es lo mismo que leer la página. Lee las páginas de 1 a `pdf.pageCount`; si los píxeles no están disponibles en ningún formato, informa de la limitación del cliente en lugar de inventar texto.

`pdf.sourceSha256` y `pdf.sourceBytes` se refieren al PDF original; los `sha256` y `totalBytes` de nivel superior, a la imagen de la página elegida. `--if-sha256` comprueba el PDF original. `--page` no se puede combinar con `--offset-bytes` ni `--chunk-bytes`. Se admiten PDF de hasta 20 páginas y 50 MiB; cada lado del PNG está limitado a 2000 píxeles y la respuesta a 1 MiB. Los motores opcionales no se instalan con el CLI.

Mostrar una página no llama a ninguna API externa de OCR ni guarda texto. Tras ver todas las páginas, el agente usa explícitamente `attachments text set` y luego comprueba el resultado con `content:`. Coteja los números y los pasajes difíciles con la imagen; la calidad depende del PDF original y de las herramientas del agente.
