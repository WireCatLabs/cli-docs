---
title: "ChatGPT, Codex o Claude en el navegador"
---

<a id="comprobar-una-conexión" />
<a id="transferir-un-archivo-grande" />
<a id="capacidades-de-mcp-y-del-cliente" />
<a id="check-a-connection" />
<a id="mcp-and-host-capabilities" />

Utilice esta página cuando desee una aplicación de IA que se ejecute en el navegador o en su teléfono, por ejemplo ChatGPT, Codex web o Claude, para leer y responder sus mensajes de Telegram. Una aplicación de este tipo no puede iniciar `tg` en su computadora, por lo que le proporciona una dirección de Internet. Al final, la aplicación está conectada a `tg` a través de una dirección HTTPS privada, solo puede hacer lo que su perfil permite y usted sabe cómo detenerla o recuperar su acceso.

Términos utilizados en esta página:

- **MCP** (Model Context Protocol) es la forma estándar en que una aplicación de IA llama a herramientas externas. `tg mcp` es el servidor MCP que viene con `tg`; la [guía del servidor MCP](./mcp.md) cubre aplicaciones en su propia computadora.
- **Conexión remota** significa que la aplicación se conecta desde sus propios servidores, a través de Internet, a la dirección que usted le proporcione. `tg mcp --http` utiliza las mismas herramientas a través de HTTP en `127.0.0.1` para esto.
- **Túnel HTTPS** es un programa que le da a un puerto de su computadora una dirección HTTPS pública.   Esta página utiliza [Tailscale Funnel](https://tailscale.com/docs/features/tailscale-funnel); El túnel Cloudflare también funciona. No es necesario comprar un dominio para Funnel.
- **URL pública** es esa dirección, por ejemplo `https://laptop.tail1234.ts.net`. Lo pasas a `tg` como `--public-url` y la aplicación lo obtiene con `/mcp` al final.
- **Código de acceso** es un código de un solo uso que `tg` imprime en tu terminal. La página de inicio de sesión de la aplicación lo solicita, por lo que solo una persona que vea ese terminal puede conectar una aplicación.

```text
ChatGPT / Claude ──internet──▶ Tailscale Funnel ──▶ tg mcp --http (login) ──▶ Telegram
```

Si su conexión Tailscale ya funciona, consérvela; No necesitas un segundo túnel. La conexión stdin/stdout local sigue funcionando como antes.

## Qué puedes hacer

| Tarea | Dónde |
|---|---|
| Conecte una aplicación de inteligencia artificial del navegador o del teléfono a Telegram | [Iniciar el túnel y el servidor](#start-the-tunnel-and-server), luego [conectar la aplicación](#connect-the-app) |
| Ejecute los servidores Telegram y MAX uno al lado del otro | [Ejecute MAX y Telegram juntos](#run-max-and-telegram-together) |
| Utilice Cloudflare en lugar de Tailscale | [Alternativa: Túnel Cloudflare](#alternative-cloudflare-tunnel) |
| Permitir más o menos ejecución de un servidor | [Permisos para este proceso de servidor](#permissions-for-this-server-process) |
| Detenga el servidor o cierre sesión en todas las aplicaciones | [Detener o revocar acceso](#stop-or-revoke-access) |
| Proporcionar a un agente remoto un archivo guardado o una página PDF como imagen | [Transferir archivos retenidos a un agente](#transfer-retained-files-to-an-agent), [leer páginas PDF](#read-pdf-pages-without-a-local-file-handoff) |

## Antes de empezar

- **Quien inicia sesión lee tu Telegram.** El inicio de sesión necesita la clave de acceso de tu terminal.   Nunca coloques un túnel frente a `tg mcp` sin `--http`: ese modo no tiene ningún inicio de sesión.
- **Los permisos de perfil deciden qué puede cambiar la aplicación.** `deny` y `readonly` bloquean escrituras;   `ask` y `allow` permiten que una escritura MCP solicitada se realice sin un formulario en el servidor. La aprobación de la aplicación es independiente y depende de su configuración. Aún se aplican restricciones de destinatarios y límites por horas ([lo que puede hacer un agente](./mcp.md#what-an-agent-may-do), [guía de configuración](./configuration.md)).
- **La computadora que ejecuta `tg` debe permanecer encendida.** Para usarlo desde un teléfono o desde una computadora portátil sin nada instalado, ejecute todo esto en un servidor pequeño que esté siempre encendido e inicie sesión en `tg` allí (`tg setup --agent none`). Entonces sólo necesitas un navegador.
- **Quién puede agregar un conector remoto:**

| Aplicación | Planes | Documentación |
|---|---|---|
| ChatGPT | Plus, Pro, Business, Enterprise, Education: en modo desarrollador | [modo desarrollador](https://developers.openai.com/api/docs/guides/custom-mcp-server) |
| Claudio | cualquier; un conector personalizado en el plan gratuito | [conectores personalizados](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) |
| Géminis | sólo adultos en EE.UU. con una cuenta personal de Google | [aplicaciones conectadas](https://support.google.com/gemini/answer/17209137?hl=en) |

No se han probado todos los pasos de configuración para cada sistema operativo en ese sistema. Si un paso no funciona, [abra un problema](https://github.com/leemour/tg-cli/issues).

## Iniciar el túnel y el servidor

Instale la CLI e inicie sesión en Telegram primero ([guía de instalación](./installation.md)). Utilice el mismo usuario y perfil del sistema operativo para la configuración y para el servidor MCP. Coloque un perfil antes del comando cuando sea necesario: `tg work mcp`. Tailscale es una instalación separada; Tanto `tg` como `max` admiten esta configuración.

Instale [Tailscale](https://tailscale.com/download), inicie sesión y habilite [Funnel](https://tailscale.com/docs/features/tailscale-funnel): MagicDNS, los certificados HTTPS y el permiso Funnel deben estar habilitados en su tailnet (su red Tailscale). El primer comando dFunnel puede imprimir un enlace de aprobación.

Mantenga dos ventanas de terminal abiertas. El primero recorre el túnel. Copie el origen HTTPS que imprime en la segunda ventana cuando se le solicite. El origen es la dirección sin `/mcp` ni ninguna otra ruta. Mantenga un puerto público explícito como `:8443` en él.

El servidor escucha en `127.0.0.1:8765` e imprime un código de inicio de sesión único. Nunca necesita derechos de administrador; Sólo el túnel puede necesitarlos. Los siguientes comandos permiten el envío únicamente para este proceso de servidor, con `--permission messages.send=allow`; consulte [permisos para este proceso de servidor](#permissions-for-this-server-process).

### Windows (PowerShell)

Instale la aplicación Tailscale para Windows e inicie sesión desde el menú de su bandeja. Abra una nueva ventana de PowerShell después de instalar Node.js, la CLI y Tailscale, para que vea el PATH actualizada. Utilice `.cmd` para los comandos npm para evitar errores de política de ejecución de PowerShell. Si la configuración aún no ha finalizado, ejecute `tg.cmd setup --agent none` en una ventana normal de PowerShell.

Primera ventana: ejecute PowerShell como administrador de Funnel. El operador de llamada `&` maneja el espacio en la ruta de instalación predeterminada; cambie la ruta si instaló Tailscale en otro lugar.

```powershell
& "$env:ProgramFiles\Tailscale\tailscale.exe" funnel 8765
```

Segunda ventana: PowerShell normal, como el usuario que inició sesión en Telegram:

```powershell
$mcpPublicUrl = Read-Host 'Paste the HTTPS origin printed by Funnel (no /mcp)'
tg.cmd mcp --http --port 8765 --public-url $mcpPublicUrl --permission messages.send=allow
```

Ejecute ambos procesos en el propio Windows. WSL es un entorno separado: un túnel de Windows que apunta a la dirección de bucle invertido de Windows puede no llegar a un servidor dentro de WSL.

### macOS (Terminal)

Instale e inicie sesión en la aplicación Tailscale. Su CLI viene con la aplicación; utilice esta ruta cuando `tailscale` no esté en el PATH ([guía CLI de Tailscale](https://tailscale.com/docs/reference/tailscale-cli?tab=macos)). Primera ventana de Terminal:

```sh
TAILSCALE_BE_CLI=1 /Applications/Tailscale.app/Contents/MacOS/Tailscale funnel 8765
```

Segunda ventana de Terminal, como el mismo usuario que ejecutó `tg setup --agent none`. Esto funciona tanto en zsh como en bash:

```sh
printf 'Paste the HTTPS origin printed by Funnel (no /mcp): '
IFS= read -r mcpPublicUrl
tg mcp --http --port 8765 --public-url "$mcpPublicUrl" --permission messages.send=allow
```

### Linux (Terminal)

Instale Tailscale con las [instrucciones de Linux](https://tailscale.com/download/linux), luego inicie sesión con `sudo tailscale up`. Primera ventana de terminal:

```sh
sudo tailscale funnel 8765
```

Segunda ventana de terminal: su usuario normal, sin `sudo`, por lo que `tg` encuentra la sesión creada por `tg setup --agent none`:

```sh
printf 'Paste the HTTPS origin printed by Funnel (no /mcp): '
IFS= read -r mcpPublicUrl
tg mcp --http --port 8765 --public-url "$mcpPublicUrl" --permission messages.send=allow
```

## Ejecutar MAX y Telegram juntos

Cada servidor necesita su propio puerto local y su propia dirección HTTPS pública. Por ejemplo, mantenga Telegram en `8765` local y `443` público; ejecute un segundo comando Funnel con `--https=8443 8766` y ejecute MAX con `--port 8766`. Utilice el segundo origen dFunnel, con `:8443`, para el `--public-url` de MAX y para la dirección de su conector que termina en `/mcp`. Utilice el comando Tailscale de su sistema desde arriba para el segundo comando Funnel. Funnel admite los puertos públicos `443`, `8443` y `10000` ([Referencia de comando de Funnel](https://tailscale.com/docs/reference/tailscale-cli/funnel)).

## Alternativa: Cloudflare Tunnel

Si ya usa Cloudflare, apunte su túnel al mismo servidor MCP local. Un nombre de host fijo necesita una cuenta de Cloudflare y un dominio en Cloudflare. Siga la [configuración del túnel con nombre](https://developers.cloudflare.com/tunnel/get-started/): instale `cloudflared` para su sistema, cree el túnel en el panel, inicie su conector y agregue un nombre de host público como `mcp.example.com`. Configure su servicio local en `http://127.0.0.1:8765` y ejecute MCP en esa misma computadora.

Inicia el servidor en otro terminal:

```sh
tg mcp --http --port 8765 --public-url https://mcp.example.com
```

Agregue `https://mcp.example.com/mcp` a su aplicación de IA con OAuth y DCR, como se describe en [conectar la aplicación](#connect-the-app). `--public-url` es el origen público utilizado para iniciar sesión, no la dirección local ni la ruta `/mcp`. El túnel no cambia los permisos del perfil. Verifique el JSON en `https://mcp.example.com/.well-known/oauth-protected-resource/mcp`, luego inicie sesión y vea la lista de herramientas. Cuando te detengas, detén solo el proceso propio de este túnel, para que otras rutas sigan funcionando.

**Un Quick Tunnel temporal no funciona por sí solo.** `cloudflared tunnel --url http://127.0.0.1:8765` proporciona una dirección `trycloudflare.com` aleatoria sin cuenta ni dominio. Pero [los túneles rápidos no admiten SSE](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/) (eventos enviados por el servidor, la forma en que el servidor HTTP MCP transmite las respuestas). Por lo tanto, un Quick Tunnel no reemplaza al Funnel con este servidor. Solo funciona con un adaptador adicional que convierte las respuestas SSE en JSON, y ese adaptador no viene con la CLI. Un inicio de sesión funcional y una lista de herramientas no prueban que un agente pueda leer archivos PDF. Un Quick Tunnel también obtiene un nuevo nombre de host en cada reinicio, por lo que se debe actualizar la dirección del conector. Para uso regular, elija Funnel o un túnel con nombre y verifique su aplicación.

## Conectar la aplicación

La dirección de la aplicación es el origen de su túnel con `/mcp` al final, por ejemplo `https://<device>.<network>.ts.net/mcp`. Agréguelo como conector MCP remoto:

- **ChatGPT o Codex web:** abra **Complementos**, elija **+ Agregar servidor MCP personalizado** y cree un complemento con la dirección `/mcp` y OAuth, como se describe en la [guía de conexión OpenAI](https://developers.openai.com/plugins/quickstart). Conéctese con el código de inicio de sesión, instale el complemento y actívelo en su chat de trabajo (o menciónelo con `@`). El Codex local `config.toml` no configura esta conexión web. La disponibilidad puede depender de su cuenta o espacio de trabajo. Elija el registro dinámico de clientes (DCR) cuando se lo ofrezcan; el servidor admite DCR y el desafío del código S256 que solicitan los [requisitos de OpenAI OAuth](https://developers.openai.com/plugins/build/auth).
- **Claude:** agregue un conector personalizado con esta dirección, como se describe en [Conectores personalizados Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).   En la configuración del conector también puede configurar cada herramienta como siempre permitida, necesita aprobación o bloqueada.

Las tres herramientas funcionan sin indicaciones, recursos o obtención de MCP (preguntas que el servidor hace a la aplicación), por lo que las aplicaciones que solo admiten herramientas pueden usarlas.

La aplicación abre la página de inicio de sesión `tg`. Verifica la línea que dice dónde va el inicio de sesión: debe ser la aplicación que estás conectando, como `chatgpt.com` o `claude.ai`. A continuación teclea la clave de acceso desde tu terminal. El código caduca después de diez minutos; Se imprime un nuevo código después de cada inicio de sesión. Cinco códigos incorrectos bloquean la página de inicio de sesión hasta que se reinicia el servidor.

La aplicación permanece conectada siempre que utilice la conexión al menos una vez cada 30 días; renueva su inicio de sesión por sí mismo. Después de 30 días sin uso, pide un nuevo código.

El perfil `permissions` decide qué comandos están disponibles. El servidor no muestra formularios de aprobación; La aprobación de la aplicación es independiente y depende de su configuración.

## Permisos para este proceso del servidor

El servidor no puede ver si la aplicación le preguntó antes de una llamada. Si la aplicación siempre permite una herramienta, la siguiente llamada puede realizarse sin una nueva pregunta.

Repita `--permission key=level` para cambiar los permisos solo para este proceso de servidor. Los niveles son `deny`, `readonly`, `ask` y `allow`. Por ejemplo, agregue `--permission messages.send=allow` para permitir el envío desde un perfil de solo lectura. `--permission messages=allow` reemplaza los permisos guardados para todo el recurso de mensajes; la eliminación se permite por separado con `--permission messages.delete=allow`. La configuración guardada, las restricciones de destinatarios y los límites horarios no cambian. Para levantar un rechazo de lectura, nombre su recurso o comando con el nivel `allow`. Las claves de permiso se enumeran en la [guía de configuración](./configuration.md).

## Detener o revocar el acceso

Presione Ctrl-C en ambas ventanas de terminal para detener el servidor y este túnel. Inícielos nuevamente con los mismos comandos; Los inicios de sesión de la aplicación sobreviven a un reinicio normal del servidor.

Si inició Funnel con `--bg`, Ctrl-C no detiene esa ruta en segundo plano. Verifique `tailscale funnel status` y apague solo su puerto público, por ejemplo `tailscale funnel --https=443 off`. Utilice el comando Tailscale de su sistema desde arriba, con derechos de administrador cuando sea necesario. No utilice `funnel reset` cuando otro servidor utilice Funnel: borra todas las rutas. Si detienes solo MCP, la ruta permanece, pero las herramientas no están disponibles.

Revocar el acceso de las aplicaciones es distinto de detener el proceso. Para cerrar sesión en todas las aplicaciones de un perfil:

```sh
tg mcp --revoke --json
```

Esas aplicaciones deben iniciar sesión nuevamente con un nuevo código. Esto no finaliza su sesión de Telegram.

## Si no funciona

- **La aplicación dice que no se puede conectar:** abra `https://<device>.<network>.ts.net/.well-known/oauth-protected-resource/mcp` en un navegador. Debe mostrar un JSON corto. Si no es así, Funnel no se está ejecutando, no está habilitado en su red Tailscale o apunta a otro puerto.
- **La página de inicio de sesión dice "Demasiados códigos incorrectos":** después de cinco códigos incorrectos, se bloquea hasta que se reinicie `tg mcp --http`. Si no los escribiste, alguien encontró tu dirección: reinicia y piensa en un nuevo nombre de dispositivo en Tailscale.
- **La aplicación se conecta, pero no hay herramientas:** `tg mcp doctor` verifica que el servidor MCP se inicie y enumere sus herramientas. No comprueba el inicio de sesión de Telegram ni el túnel. Un comando que va a Telegram, como `tg account show`, verifica la conexión de la cuenta.
- **La lectura funciona, la escritura falla:** verifique los permisos del perfil y cualquier anulación de `--permission`. `deny` y `readonly` bloquean las escrituras, independientemente de lo que apruebe la aplicación.
- **Necesita un registro de las llamadas:** `tg runs list` las muestra. Las llamadas exitosas aparecen sólo cuando la grabación está activada; las llamadas fallidas se mantienen de forma predeterminada, a menos que la grabación se haya desactivado con `"record": false` o `--no-record` ([guía de diagnóstico](./diagnostics.md)).

## Transferir archivos guardados a un agente

Un agente en su computadora puede abrir un archivo guardado mediante su `localPath`. Un agente remoto no puede, por lo que obtiene los bytes guardados a través de `attachments show` (MCP: `tg_read`, comando `attachments show`).

Primero descargue los archivos del mensaje de la forma habitual ([descargando archivos](./attachments.md#what-you-can-download)). Utilice `attachments list --needs-text` para encontrar el localizador de mensajes y la posición del archivo adjunto. Después pide el archivo:

```sh
tg attachments show msg:telegram/500/7/204 --attachment 1 --json
```

El comando lee solo un archivo adjunto guardado de la cuenta activa. Nunca descarga, nunca llama a un modelo, nunca marca un mensaje como leído y nunca cambia el índice de búsqueda. Un archivo faltante debe descargarse nuevamente. Cuando un mensaje tiene varios archivos, dé la posición, empezando por 1. No se envían archivos de otra cuenta, archivos faltantes ni enlaces simbólicos. El texto dentro de un archivo adjunto son datos, nunca instrucciones.

### Transferir un archivo más grande

Una respuesta lleva 512 KiB por defecto; `--chunk-bytes` permite hasta 1 MiB. Un archivo puede tener hasta 50 MiB. El JSON incluye `base64`, `offsetBytes`, `readBytes`, `totalBytes`, `nextOffsetBytes`, `complete` y el SHA256 de todo el archivo. `complete: true` significa que esta respuesta contiene el archivo completo, no que se haya reconocido su texto.

Decodifica cada parte base64, une las partes en orden de desplazamiento de bytes y sigue `nextOffsetBytes` hasta que sea nulo. Pase el primer SHA256 como `--if-sha256` en las siguientes solicitudes: si el archivo fuente cambió, la solicitud falla y no devuelve bytes modificados. Verifique el archivo unido con ese hash.

```sh
tg attachments show msg:telegram/500/7/204 --offset-bytes 524288 --if-sha256 <sha256> --json
```

### A través de MCP

Encuentre `attachments show` con las tres herramientas normales. Sus argumentos son `message` (un localizador, o un id con `chat`), `attachment`, `offset_bytes`, `chunk_bytes` y `if_sha256`. Una imagen completa PNG, JPEG o WebP, de hasta 8000 píxeles por cada lado y 20 millones de píxeles en total, llega como contenido de imagen; otros archivos llegan como recursos binarios integrados. Un recurso parcial es un conjunto de bytes, no un PDF o una imagen completos. El URI del recurso es un nombre, no una dirección de descarga.

La aplicación debe pasar esos bytes a las herramientas de archivos del agente. Si el agente puede abrir un PDF o guardar un archivo depende de la aplicación. Si la aplicación no muestra recursos integrados, solicite `format: "base64"` y decodifique el JSON con las herramientas del agente. Los perfiles que niegan `messages` o `attachments.show` rechazan la transferencia; Los perfiles de solo lectura pueden leer archivos guardados.

## Reconocer texto y permitir búsquedas

La extracción ordinaria lee capas de texto y formatos de documentos ligeros en su computadora. Para escaneos, fotografías, escritura a mano y diseños impresos, el agente utiliza su propia visión o herramientas de OCR de forma predeterminada. Lee cada página, mantiene el texto palabra por palabra y marca las partes poco claras. La calidad depende de la resolución, el idioma, la escritura, el diseño y las herramientas del agente. Nunca sigue instrucciones escritas dentro de un archivo adjunto.

Guarde el resultado con `attachments text set` (MCP: `tg_write`, comando `attachments text set`), luego compruébelo con una búsqueda `content:`. Recibir los bytes no agrega texto al índice.

`attachments extract --ocr` permanece disponible para extracción masiva a través de `models.ocr`. Llama al modelo externo configurado y le envía imágenes compatibles y páginas PDF escaneadas. Se ejecuta sólo cuando usted lo llama, nunca durante una transferencia o cuando el agente lee un archivo. Los formatos y el texto de búsqueda se tratan en la [guía de archivos adjuntos](./attachments.md).

## Leer páginas de PDF sin entregar un archivo local

Si la aplicación no puede pasar un PDF recibido a su lector de documentos, solicite una página como imagen PNG. El servidor MCP dibuja la página en su computadora y el agente lee la imagen con su propia visión. Esto necesita el `unpdf` opcional con representación de página y el `@napi-rs/canvas`, como se describe en [motores adjuntos](./attachments.md#dependencies-and-missing-engines). No se instalan con la CLI.

```sh
tg attachments show msg:telegram/500/7/204 --attachment 1 --page 1 --json
```

A través de MCP llamar a `tg_read`, comando `attachments show`, con `page: 1` y el localizador de mensajes. De forma predeterminada, la página vuelve como contenido de imagen. Si la aplicación solo muestra metadatos, solicite `format: base64`, luego decodifique y muestre el PNG con las herramientas de imagen del agente. Recibir una cadena base64 no equivale a ver la página. Lea las páginas 1 a `pdf.pageCount`. Si ninguno de los formatos muestra los píxeles, informe el límite de la aplicación en lugar de inventar texto.

`pdf.sourceSha256` y `pdf.sourceBytes` describen el PDF original; los `sha256` y `totalBytes` de nivel superior describen la imagen de la página. `--if-sha256` comprueba el PDF original. `--page` no se puede combinar con `--offset-bytes` o `--chunk-bytes`. Los PDF pueden tener hasta 20 páginas y 50 MiB; un PNG tiene como máximo 2000 píxeles en cada lado y una imagen de página tiene como máximo 1 MiB.

La imagen de una página no llama a ningún servicio OCR externo ni indexa ningún texto. Después de mirar cada página, el agente llama a `attachments text set` y verifica una búsqueda de `content:`. Verifique números y diseños complejos con las imágenes; La calidad depende del documento fuente y de las herramientas del agente.
