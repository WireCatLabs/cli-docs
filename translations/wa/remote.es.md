---
title: "WhatsApp desde el navegador"
---

Usa esta página cuando desee una aplicación de IA que se ejecute en el navegador o en tu teléfono, por ejemplo ChatGPT, Codex web o Claude, para leer y responder sus mensajes de WhatsApp. Una aplicación de este tipo no puede iniciar `wa` en tu ordenador, por lo que le proporciona una dirección de Internet. Al final, la aplicación está conectada a `wa` a través de una dirección HTTPS privada, solo puede hacer lo que tu perfil permite y ti sabe cómo detenerla o recuperar su acceso.

Términos utilizados en esta página:

- **MCP** (Protocolo de contexto modelo) es la forma estándar en que una aplicación de IA llama a herramientas externas. `wa personal mcp serve` es el servidor MCP que viene con `wa`; la [guía del servidor MCP](./mcp.md) cubre aplicaciones en su propia computadora.
- **Conexión remota** significa que la aplicación se conecta desde sus propios servidores, a través de Internet, a la dirección que ti le proporcione.
  `wa personal mcp serve --http` ofrece las mismas herramientas a través de HTTP en `127.0.0.1` para esto.
- **Túnel HTTPS** es un programa que le da a un puerto de tu ordenador una dirección HTTPS pública. Esta página utiliza [Embudo de escala de cola](https://tailscale.com/docs/features/tailscale-funnel); El túnel Cloudflare también funciona. No es necesario comprar un dominio para Funnel.
- **URL pública** es esa dirección, por ejemplo `https://laptop.tail1234.ts.net`. Se lo pasas a `wa` como
  `--public-url`, y la aplicación lo obtiene con `/mcp` al final.
- **Código de acceso** es un código de un solo uso que `wa` imprime en tu terminal. La página de inicio de sesión de la aplicación lo solicita, por lo que solo una persona que vea ese terminal puede conectar una aplicación.

```text
ChatGPT / Claude ──internet──▶ Tailscale Funnel ──▶ wa personal mcp serve --http (login) ──▶ WhatsApp
```

## Qué puedes hacer

| Tarea | Dónde |
|---|---|
| Conecte un navegador o una aplicación de inteligencia artificial de teléfono a WhatsApp | [Iniciar el túnel y el servidor](#start-the-tunnel-and-server), luego [conectar la aplicación](#connect-the-app) |
| Ejecuta wa al lado de tg o max | [Ejecutar varios servidores juntos](#run-several-servers-together) |
| Usa Cloudflare en lugar de Tailscale | [Alternativa: Túnel Cloudflare](#alternative-cloudflare-tunnel) |
| Permitir menos para la ejecución de un servidor | [Permisos para este proceso de servidor](#permissions-for-this-server-process) |
| Detenga el servidor o cierre sesión en todas las aplicaciones | [Detener o revocar acceso](#stop-or-revoke-access) |

## Antes de empezar

- **Quien inicia sesión lee tu WhatsApp.** El inicio de sesión necesita la clave de acceso de tu terminal. Nunca pongas un túnel delante de `wa personal mcp serve` sin `--http`: ese modo no tiene ningún inicio de sesión.
- **Los permisos de perfil deciden qué puede cambiar la aplicación.** `deny` y `readonly` bloquean escrituras; `ask` y `allow` permiten que una escritura MCP solicitada se realice sin un formulario en el servidor. La aprobación de la aplicación es independiente y depende de tu configuración. La lista de destinatarios y el límite por horas aún se aplican ([lo que puede hacer un agente](./mcp.md#what-an-agent-may-do), [permisos](./permissions.md)).
- **El servidor comparte la única conexión del dispositivo con `serve`.** Las lecturas del almacén local funcionan mientras se ejecuta `serve`. A diferencia del terminal y `wa personal mcp serve`, el servidor HTTP no pasa por `serve`: un envío, una edición o una reacción de la aplicación se rechaza hasta que `serve` se detiene, y `serve` no puede iniciarse mientras el servidor mantiene una conexión ([una conexión, compartida con `serve`](./mcp.md#one-connection-shared-with-serve)).
- **La computadora que ejecuta `wa` debe permanecer encendida.** Para usarlo desde un teléfono, o desde una computadora portátil sin nada instalado, ejecute todo esto en un servidor pequeño que esté siempre encendido y vincule allí `wa` (`wa personal setup --agent none`). Ese es un dispositivo vinculado más en tu teléfono.
- **Quién puede agregar un conector remoto:**

| Aplicación | Planes | Documentación |
|---|---|---|
| ChatGPT | Plus, Pro, Business, Enterprise, Education: en modo desarrollador | [modo desarrollador](https://developers.openai.com/api/docs/guides/custom-mcp-server) |
| Claude | cualquier; un conector personalizado en el plan gratuito | [conectores personalizados](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) |
| Gemini | sólo adultos en EE.UU. con una cuenta personal de Google | [aplicaciones conectadas](https://support.google.com/gemini/answer/17209137?hl=en) |

No se han probado todos los pasos de configuración para cada sistema operativo en ese sistema. Si un paso no funciona, [abra un problema](https://github.com/WireCatLabs/whatsapp-cli/issues).

## Inicie el túnel y el servidor.

Instale `wa` y vincule un perfil primero ([instalación](./installation.md), [vinculación](./sessions.md)). Usa el mismo usuario y perfil del sistema operativo para la configuración y para el servidor MCP. Coloque un perfil antes del comando cuando sea necesario: `wa work mcp serve`. Tailscale es una instalación separada.

Instale [Tailscale](https://tailscale.com/download), inicie sesión y habilite [Funnel](https://tailscale.com/docs/features/tailscale-funnel): MagicDNS, los certificados HTTPS y el permiso Funnel deben estar habilitados en su tailnet (su red Tailscale). El primer comando del embudo puede imprimir un enlace de aprobación.Mantén dos ventanas de terminal abiertas. El primero recorre el túnel. Copie el origen HTTPS que imprime en la segunda ventana cuando se le solicite. El origen es la dirección sin `/mcp` ni ninguna otra ruta. Mantén un puerto público explícito como `:8443` en él.

El servidor escucha en `127.0.0.1:8765` e imprime un código de acceso único. Nunca necesita derechos de administrador; Sólo el túnel puede necesitarlos. Lo que puede hacer la aplicación es el propio `permissions` del perfil; configúrelos antes de comenzar ([permisos para este proceso de servidor](#permissions-for-this-server-process)).

### Windows (PowerShell)

Instale la aplicación Tailscale para Windows e inicie sesión desde el menú de su bandeja. Abra una nueva ventana de PowerShell después de instalar Node.js, `wa` y Tailscale, para que vea la RUTA actualizada. Usa `.cmd` para los comandos npm para evitar errores de política de ejecución de PowerShell.

Primera ventana: ejecute PowerShell como administrador de Funnel. El operador de llamada `&` maneja el espacio en la ruta de instalación predeterminada; cambie la ruta si instaló Tailscale en otro lugar.

```powershell
& "$env:ProgramFiles\Tailscale\tailscale.exe" funnel 8765
```

Segunda ventana: PowerShell normal, como el usuario que vinculó `wa`:

```powershell
$mcpPublicUrl = Read-Host 'Paste the HTTPS origin printed by Funnel (no /mcp)'
wa.cmd personal mcp serve --http --port 8765 --public-url $mcpPublicUrl
```

Ejecuta ambos procesos en el propio Windows. WSL es un entorno separado: un túnel de Windows que apunta a la dirección de bucle invertido de Windows puede no llegar a un servidor dentro de WSL.

### MacOS (Terminal)

Instale e inicie sesión en la aplicación Tailscale. Su CLI viene con la aplicación; utilice esta ruta cuando `tailscale` no esté en la RUTA ([guía CLI de Tailscale](https://tailscale.com/docs/reference/tailscale-cli?tab=macos)). Primera ventana de Terminal:

```sh
TAILSCALE_BE_CLI=1 /Applications/Tailscale.app/Contents/MacOS/Tailscale funnel 8765
```

Segunda ventana de Terminal, como el mismo usuario que ejecutó `wa personal setup`. Esto funciona tanto en zsh como en bash:

```sh
printf 'Paste the HTTPS origin printed by Funnel (no /mcp): '
IFS= read -r mcpPublicUrl
wa personal mcp serve --http --port 8765 --public-url "$mcpPublicUrl"
```

### Linux (Terminal)

Instale Tailscale con las [instrucciones de Linux](https://tailscale.com/download/linux), luego inicie sesión con `sudo tailscale up`. Primera ventana de terminal:

```sh
sudo tailscale funnel 8765
```

Segunda ventana de terminal: su usuario normal, sin `sudo`, por lo que `wa` encuentra el dispositivo vinculado por `wa personal setup`:

```sh
printf 'Paste the HTTPS origin printed by Funnel (no /mcp): '
IFS= read -r mcpPublicUrl
wa personal mcp serve --http --port 8765 --public-url "$mcpPublicUrl"
```

## Ejecuta varios servidores juntos

Cada servidor necesita su propio puerto local y su propia dirección HTTPS pública. Por ejemplo, mantenga `tg` en `8765` local y `443` público; ejecute un segundo comando Funnel con `--https=8443 8766` y ejecute `wa` con `--port 8766`. Usa el segundo origen del embudo, con `:8443`, para el `--public-url` de `wa` y para la dirección de su conector que termina en `/mcp`. Usa el comando Tailscale de su sistema desde arriba para el segundo comando Funnel. Funnel admite los puertos públicos `443`, `8443` y `10000` ([Referencia de comando de Funnel](https://tailscale.com/docs/reference/tailscale-cli/funnel)).

## Receptor de webhook para un bot

Un número de WhatsApp Business en la Cloud API recibe sus mensajes solo mediante webhook, por lo que su receptor se publica de la misma manera ([un número de WhatsApp Business como bot](./bot.md)). `wa <profile> bot watch --public-url` escucha en `8766` local. Con Funnel, publíquelo en un puerto público que el servidor MCP no utiliza, como `10000`:

```sh
tailscale funnel --bg --https=10000 8766
wa cloudtest bot watch --public-url https://<name>.ts.net:10000
```

Ejecuta primero `tailscale funnel status` para ver qué puertos públicos están ocupados. Con un túnel de Cloudflare con nombre, agregue un segundo nombre de host público cuyo servicio local sea `http://127.0.0.1:8766`. Ingrese el mismo origen que la URL de devolución de llamada en el Panel de aplicaciones de Meta. El receptor solo guarda las entregas con una firma válida de tu aplicación.

## Alternativa: Túnel Cloudflare

Si ya usa Cloudflare, apunte su túnel al mismo servidor MCP local. Un nombre de host fijo necesita una cuenta de Cloudflare y un dominio en Cloudflare. Siga la [configuración del túnel con nombre](https://developers.cloudflare.com/tunnel/get-started/): instale `cloudflared` para su sistema, cree el túnel en el panel, inicie su conector y agregue un nombre de host público como `mcp.example.com`. Configure su servicio local en `http://127.0.0.1:8765` y ejecute MCP en esa misma computadora.

Inicie el servidor en una segunda terminal:

```sh
wa personal mcp serve --http --port 8765 --public-url https://mcp.example.com
```

Añade `https://mcp.example.com/mcp` a su aplicación de IA con OAuth y DCR, como se describe en [conectar la aplicación](#connect-the-app). `--public-url` es el origen público utilizado para iniciar sesión, no la dirección local ni la ruta `/mcp`. El túnel no cambia los permisos del perfil. Verifique el JSON en `https://mcp.example.com/.well-known/oauth-protected-resource/mcp`, luego inicie sesión y vea la lista de herramientas.

**Un túnel rápido temporal no funciona.** `cloudflared tunnel --url http://127.0.0.1:8765` proporciona una dirección `trycloudflare.com` aleatoria sin cuenta ni dominio, pero [los túneles rápidos no admiten SSE](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/) (eventos enviados por el servidor, la forma en que el servidor HTTP MCP transmite las respuestas). Elige Embudo o un túnel con nombre.

## Conecta la aplicación

La dirección de la aplicación es el origen de su túnel con `/mcp` al final, por ejemplo `https://<device>.<network>.ts.net/mcp`. Agréguelo como conector MCP remoto:

- **ChatGPT o Codex web:** abra **Complementos**, elija **+ Agregar servidor MCP personalizado** y cree un complemento con el
  Dirección `/mcp` y OAuth, como se describe en la [guía de conexión OpenAI](https://developers.openai.com/plugins/quickstart). Conéctese con el código de acceso, instale el complemento y actívelo en su chat (o menciónelo con `@`). Elige el registro dinámico de clientes (DCR) cuando se lo ofrezcan; el servidor admite DCR y el desafío del código S256 que solicitan los [requisitos de OpenAI OAuth](https://developers.openai.com/plugins/build/auth).
- **Claude:** agregue un conector personalizado con esta dirección, como se describe en [Conectores personalizados Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp). En la configuración del conector también puede configurar cada herramienta como siempre permitida, necesita aprobación o bloqueada.

Las tres herramientas funcionan sin indicaciones, recursos o obtención de MCP (preguntas que el servidor hace a la aplicación), por lo que las aplicaciones que solo admiten herramientas pueden usarlas.

La aplicación abre la página de inicio de sesión `wa`. Verifica la línea que dice dónde va el inicio de sesión: debe ser la aplicación que estás conectando, como `chatgpt.com` o `claude.ai`. A continuación teclea la clave de acceso desde tu terminal. El código caduca después de diez minutos; Se imprime un nuevo código después de cada inicio de sesión. Cinco códigos incorrectos detienen el inicio de sesión durante 30 segundos; después de eso se imprime un nuevo código.

La aplicación permanece conectada siempre que utilice la conexión al menos una vez cada 30 días; renueva su inicio de sesión por sí mismo. Después de 30 días sin uso, pide un nuevo código.

## Permisos para este proceso de servidor

El servidor no puede ver si la aplicación le preguntó antes de una llamada. Si la aplicación siempre permite una herramienta, la siguiente llamada puede realizarse sin una nueva pregunta.

El `permissions` del perfil decide qué puede hacer la aplicación. Repita `--permission key=level` para restringirlos solo a este proceso de servidor: `--permission messages.send=readonly` deja de enviar. Nunca se afloja: una anulación que daría más que el perfil (de `readonly` a `allow`, un `deny` a cualquier cosa) detiene el servidor al inicio y `validation_error` nombra la clave. Una anulación deja la configuración guardada, la lista de destinatarios y el límite por hora tal como están. Para permitir que la aplicación envíe desde un perfil de solo lectura, primero cambie el perfil: `wa personal config set permissions.messages.send allow`. Las claves de permiso se encuentran en la página [permisos](./permissions.md).

## Detener o revocar el acceso

Pulsa Ctrl-C en ambas ventanas de terminal para detener el servidor y este túnel. Inícielos nuevamente con los mismos comandos; Los inicios de sesión de la aplicación sobreviven a un reinicio normal del servidor. Al detener el servidor también se interrumpe la conexión del dispositivo, por lo que `serve` puede comenzar de nuevo.

Si inició Funnel con `--bg`, Ctrl-C no detiene esa ruta en segundo plano. Verifique `tailscale funnel status` y apague solo su puerto público, por ejemplo `tailscale funnel --https=443 off`. No utilice `funnel reset` cuando otro servidor utilice Funnel: borra todas las rutas.

Revocar el acceso de las aplicaciones es independiente de detener un proceso. Para cerrar sesión en todas las aplicaciones de un perfil:

```sh
wa personal mcp revoke --json
```

Esas aplicaciones deben iniciar sesión nuevamente con un nuevo código. Esto no desvincula el dispositivo de WhatsApp.

## Si no funciona

- **La aplicación dice que no se puede conectar:** abra `https://<device>.<network>.ts.net/.well-known/oauth-protected-resource/mcp` en un navegador. Debe mostrar un JSON corto. Si no es así, Funnel no se está ejecutando, no está habilitado en su red Tailscale o apunta a otro puerto.
- **La página de inicio de sesión dice "Demasiados códigos incorrectos":** después de cinco códigos incorrectos, espera 30 segundos y luego el terminal muestra un nuevo código. Si no los escribiste, alguien encontró tu dirección: detén el servidor y piensa en un nuevo nombre de dispositivo en Tailscale.
- **La aplicación se conecta, pero no hay herramientas:** `wa personal mcp check` verifica que el servidor MCP se inicie y enumere sus herramientas. No comprueba el enlace a WhatsApp ni al túnel; `wa personal doctor` lee el estado del dispositivo.
- **La lectura funciona, la escritura falla:** el servidor HTTP no pasa por `serve`, por lo que se rechaza una escritura mientras se ejecuta `serve`; el error lo nombra. De lo contrario, verifique los permisos del perfil y cualquier anulación de `--permission`: `deny` y `readonly` bloquean las escrituras aunque la aplicación las apruebe.
- **Necesitas un registro de llamadas a herramientas:** `wa personal runs list` las muestra. Cada llamada se mantiene de forma predeterminada; `"record": false` mantiene solo las llamadas fallidas, `--no-record` ninguna ([diagnóstico](./diagnostics.md)).
