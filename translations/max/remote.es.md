---
title: "ChatGPT o Claude en el navegador"
---

Esta página es necesaria si desea que una aplicación de IA en su navegador o teléfono, como ChatGPT, Codex web o Claude, lea y responda a su MAX. Una aplicación de este tipo no puede ejecutar `max` en su computadora, por lo que le proporciona una dirección de Internet. Como resultado, la aplicación se conecta a `max` mediante una dirección HTTPS privada, hace solo lo que permite el perfil y usted sabe cómo detenerla o revocar el acceso.

Términos en esta página:

- **MCP** (Model Context Protocol) es una forma común para que una aplicación de IA llame a herramientas externas. `max mcp`: servidor MCP, que se instala junto con `max`; Las aplicaciones en su computadora se describen en [MCP Server Manual](./mcp.md).
- **Conexión remota** - la aplicación se conecta desde sus servidores, vía Internet, a la dirección que le hayas proporcionado. Para ello, `max mcp --http` envía las mismas herramientas vía HTTP a `127.0.0.1`.
- **Túnel HTTPS** es un programa que le da a un puerto de su computadora una dirección HTTPS pública. Esto utiliza [Tailscale Funnel](https://tailscale.com/docs/features/tailscale-funnel); El túnel Cloudflare también es adecuado. No es necesario comprar un dominio para Funnel.
- **Dirección pública**: esta dirección, por ejemplo `https://laptop.tail1234.ts.net`. Se lo pasas a `max` como `--public-url`, y a la aplicación con `/mcp` al final.
- **Código de inicio de sesión** es un código de un solo uso que `max` imprime en su terminal. La página de inicio de sesión de la aplicación lo solicita, por lo que solo alguien que pueda ver ese terminal puede conectar la aplicación.

```text
ChatGPT / Claude ──интернет──▶ Tailscale Funnel ──▶ max mcp --http (вход) ──▶ MAX
```

Si la conexión Tailscale ya está funcionando, manténgala: no es necesario un segundo túnel. La conexión local a través de stdin y stdout sigue funcionando como antes.

## ¿Qué se puede hacer?

|Tarea|Dónde|
|---|---|
|Conecte su aplicación de IA en su navegador o teléfono a MAX|[Inicie el túnel y el servidor](#2-запустить-туннель-и-сервер), luego [agregue a la aplicación](#3-добавить-в-приложение)|
|Ejecute servidores MAX y Telegram uno al lado del otro|[MAX y Telegram al mismo tiempo](#max-и-telegram-одновременно)|
|Utilice Cloudflare en lugar de Tailscale|[En lugar de Tailscale: Cloudflare Tunnel](#вместо-tailscale-cloudflare-tunnel)|
|Permitir más o menos por inicio de servidor|[Derechos solo mientras el servidor está en ejecución](#права-только-на-время-работы-сервера)|
|Detenga el servidor o salga de todas las aplicaciones|[Apagar](#выключить)|
|Enviar un archivo guardado o una página PDF como imagen al agente remoto|[Transferir el archivo guardado al agente](#передача-сохранённого-файла-агенту), [leer PDF página por página](#читать-pdf-без-сохранения-файла-у-агента)|

## Antes de empezar

- **Quien inicia sesión puede leer tu MAX.** Necesita el código del terminal. No expongas `max mcp` mediante un túnel sin `--http`: no hay autenticación.
- **Los permisos del perfil determinan qué puede cambiar la aplicación.** `deny` y `readonly` bloquean escrituras; `ask` y `allow` permiten la escritura solicitada por MCP sin formulario del servidor. La confirmación del cliente depende de su configuración. Siguen vigentes la lista de destinatarios y el límite horario ([permisos MCP](./mcp.md#что-может-агент), [configuración](./configuration.md)).
- **El ordenador con `max` debe estar encendido.** Para usarlo desde un móvil u ordenador sin instalar nada, inicia todo en un servidor que permanezca encendido e inicia sesión allí (`max setup --agent none`). Después solo necesitas un navegador.
- **Quién puede añadir un conector remoto:**

| Aplicación | Planes | Documentación |
|---|---|---|
| ChatGPT | Plus, Pro, Business, Enterprise, Education: en modo desarrollador | [Modo desarrollador](https://developers.openai.com/api/docs/guides/custom-mcp-server) |
| Claude | Cualquier plan; en el gratuito, un conector propio | [Conectores personalizados](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) |
| Gemini | Solo para adultos en EE. UU. con una cuenta personal de Google; no disponible en Rusia ni Europa | [Aplicaciones conectadas](https://support.google.com/gemini/answer/17209137?hl=en) |

Los pasos para cada sistema operativo no se han probado en todos los sistemas. Si el paso no funciona, [abra el problema](https://github.com/WireCatLabs/max-cli/issues).

## 1. Preparar Tailscale

Primero instale la CLI e inicie sesión en MAX ([guía de instalación](./installation.md)); para la configuración local sin agente utilice `max setup --agent none`. Ejecute el servidor con el mismo usuario de sistema operativo y con el mismo perfil. Si es necesario, ponga primero el perfil: `max work mcp`. Tailscale se instala por separado; Tanto `max` como `tg` admiten dicho túnel.

Instale [Tailscale](https://tailscale.com/download), inicie sesión y permita [Funnel](https://tailscale.com/docs/features/tailscale-funnel): su red Tailscale requiere MagicDNS, certificados HTTPS y permiso de Funnel. La primera ejecución de Funnel puede imprimir un enlace de permiso.

Deje dos ventanas de terminal abiertas. En el primero hay un túnel. Copie su dirección HTTPS en la segunda ventana cuando se le solicite. Necesita origen: una dirección sin `/mcp` y otra ruta. Guarde un puerto como `:8443` en él.

## 2. Iniciar el túnel y el servidor

El servidor escucha `127.0.0.1:8765` e imprime un código de inicio de sesión único. No necesita derechos de administrador; Sólo el túnel puede necesitarlos. Los siguientes comandos permiten enviar sólo mientras se ejecuta este proceso: `--permission messages.send=allow`; consulte [permisos solo durante el tiempo que el servidor esté ejecutando](#права-только-на-время-работы-сервера).

### Windows (PowerShell)

Instale la aplicación Tailscale e inicie sesión a través del menú de la bandeja. Una vez que Node.js, CLI y Tailscale estén instalados, abra una nueva ventana de PowerShell para actualizar su PATH. El sufijo `.cmd` soluciona un error de política de ejecución de PowerShell para comandos npm. Si aún no ha configurado MAX, ejecute `max.cmd setup --agent none` en PowerShell normal.

Primera ventana: PowerShell del administrador de Funnel. El operador `&` es necesario debido a un espacio en la ruta de instalación estándar; si elige un directorio diferente, reemplace la ruta.

```powershell
& "$env:ProgramFiles\Tailscale\tailscale.exe" funnel 8765
```

Segunda ventana: PowerShell normal con el usuario que inició sesión en MAX:

```powershell
$mcpPublicUrl = Read-Host 'Вставьте HTTPS origin из Funnel (без /mcp)'
max.cmd mcp --http --port 8765 --public-url $mcpPublicUrl --permission messages.send=allow
```

Ejecute ambos procesos en el propio Windows. WSL es un entorno independiente: es posible que un túnel de Windows dirigido a una dirección local de Windows no llegue al servidor dentro de WSL.

### macOS (Terminal)

Instale la aplicación Tailscale e inicie sesión. Su CLI está incluido con la aplicación; si `tailscale` no está en PATH, use esta ruta ([guía CLI Tailscale](https://tailscale.com/docs/reference/tailscale-cli?tab=macos)). Primera ventana de Terminal:

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

Instale Tailscale usando [instrucciones de Linux](https://tailscale.com/download/linux) e inicie sesión a través de `sudo tailscale up`. Primera ventana de terminal:

```sh
sudo tailscale funnel 8765
```

Segunda ventana: un usuario normal sin `sudo`, para que `max` encuentre una sesión de `max setup --agent none`:

```sh
printf 'Вставьте HTTPS origin из Funnel (без /mcp): '
IFS= read -r mcpPublicUrl
max mcp --http --port 8765 --public-url "$mcpPublicUrl" --permission messages.send=allow
```

## MAX y Telegram al mismo tiempo

Cada servidor necesita un puerto local y una URL HTTPS pública propios. Por ejemplo, deja Telegram en `8765` local y `443` público; inicia otro Funnel con `--https=8443 8766` y MAX con `--port 8766`. Usa el origen del segundo túnel, incluido `:8443`, en `--public-url` y añade `/mcp` para el conector. Usa el comando Tailscale de tu sistema indicado arriba. Funnel admite `443`, `8443` y `10000` ([referencia Funnel](https://tailscale.com/docs/reference/tailscale-cli/funnel)).

## Alternativa: Cloudflare Tunnel

Si ya está utilizando Cloudflare, apunte su túnel al mismo servidor MCP local. Una dirección permanente requiere una cuenta de Cloudflare y un dominio de Cloudflare. Realice [configuración de túnel con nombre](https://developers.cloudflare.com/tunnel/get-started/): instale `cloudflared` para su sistema operativo, cree un túnel en el panel de Cloudflare, inicie su conexión y agregue un nombre de host público, por ejemplo `mcp.example.com`. Para servicio local, especifique `http://127.0.0.1:8765`; Ejecute MCP en la misma computadora.

Inicia el servidor en otro terminal:

```sh
max mcp --http --port 8765 --public-url https://mcp.example.com
```

Agregue `https://mcp.example.com/mcp` a su aplicación de IA con OAuth y DCR como se describe en [agregar a app](#3-добавить-в-приложение). `--public-url` es el origen público para iniciar sesión, no la dirección local ni la ruta `/mcp`. El túnel no cambia los derechos del perfil. Verifique el JSON en `https://mcp.example.com/.well-known/oauth-protected-resource/mcp`, luego la entrada y la lista de herramientas. Detenga únicamente el proceso de este túnel para permitir que otras rutas sigan funcionando.

**El túnel rápido temporal no funciona por sí solo.** El comando `cloudflared tunnel --url http://127.0.0.1:8765` produce una dirección aleatoria `trycloudflare.com` sin cuenta ni dominio. Pero [los túneles rápidos no admiten SSE](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/) (eventos enviados por el servidor, la forma en que un servidor HTTP MCP transmite respuestas). Por lo tanto, Quick Tunnel no reemplaza a Funnel para este servidor. Solo funciona con un adaptador adicional que convierte las respuestas SSE en JSON y dicho adaptador no está incluido en la CLI. Una lista de herramientas y datos de trabajo no prueban que el agente pueda leer el PDF. Además, cada vez que reinicia Quick Tunnel recibe una nueva dirección y la dirección del conector debe actualizarse. Para operación permanente, seleccione Funnel o túnel con nombre y pruebe su aplicación.

## 3. Añadirlo a la aplicación

La dirección de la aplicación es el origen de su túnel con `/mcp` al final, por ejemplo `https://<устройство>.<сеть>.ts.net/mcp`. Agréguelo como conector MCP remoto:

- **ChatGPT o Codex web:** abra **Complementos**, seleccione **+ Agregar servidor MCP personalizado** y cree un complemento con la dirección `/mcp` y OAuth como se describe en [Instrucciones de OpenAI para conectar](https://developers.openai.com/plugins/quickstart). Conéctelo con su código de inicio de sesión, instale el complemento y habilítelo en el chat de trabajo (o menciónelo a través de `@`). El Codex local `config.toml` no configura esta conexión web. La disponibilidad puede variar según la cuenta y el espacio de trabajo. Si se le solicita que seleccione el registro, seleccione DCR (registro de cliente dinámico): el servidor admite la verificación DCR y S256, que es requerida por [requisitos de OpenAI para OAuth](https://developers.openai.com/plugins/build/auth).
- **Claude:** agrega tu conector con esta dirección, como se describe en [conectores personalizados Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp). En la configuración del conector, puede configurar cada herramienta: siempre permitida, requiere confirmación o prohibida.

Las tres herramientas funcionan sin solicitudes, recursos y obtención de MCP (preguntas del servidor a la aplicación), por lo que también pueden ser utilizadas por aplicaciones que solo entienden las herramientas.

La aplicación abre la página de inicio de sesión de `max`. Comprueba el destino de la sesión: debe ser la aplicación que conectas, como `chatgpt.com` o `claude.ai`. Introduce después el código del terminal. Dura diez minutos y tras cada conexión aparece otro. Después de cinco códigos erróneos, la página se bloquea hasta reiniciar el servidor.

La aplicación permanece conectada siempre que utilice la conexión al menos una vez cada 30 días; prolonga la entrada misma. Después de 30 días sin uso, te pedirá un nuevo código.

Los comandos disponibles los decide el perfil `permissions`. No hay formularios de confirmación en el servidor; la confirmación en la aplicación es algo independiente y depende de su configuración.

## Permisos durante la ejecución del servidor

El servidor no ve si la aplicación le preguntó antes de llamar. Si la aplicación siempre permite la herramienta, la siguiente llamada puede realizarse sin una nueva pregunta.

`--permission ключ=уровень` repetido cambia los derechos solo para este proceso de servidor. Niveles: `deny`, `readonly`, `ask`, `allow`. Por ejemplo, `--permission messages.send=allow` permitirá enviar desde un perfil con `readonly`. `--permission messages=allow` reemplazará los derechos guardados para todo el recurso de mensajes; la eliminación se permite por separado a través de `--permission messages.delete=allow`. El archivo de configuración, la lista de destinatarios y el límite de envío por hora no cambian. Para eliminar la prohibición de lectura, asigne un nombre a su recurso o comando con el nivel `allow`. Las claves de permiso se enumeran en la [Guía de configuración de](./configuration.md).

Con permisos sustituidos temporalmente, MCP se conecta directamente a MAX: una instancia de `max serve` ya en marcha sigue utilizando los permisos guardados de su perfil.

## Desconectar

Ctrl-C en ambas ventanas detiene el servidor y este túnel. Para reiniciar, use los mismos comandos; las entradas de la aplicación sobreviven a los reinicios normales del servidor.

Si Funnel se inició con `--bg`, Ctrl-C no desactiva esta ruta en segundo plano. Marque `tailscale funnel status` y desactive solo su puerto público, por ejemplo `tailscale funnel --https=443 off`. Utilice el comando Tailscale de su sistema operativo anterior, con derechos de administrador si es necesario. No utilice `funnel reset` si otro servidor necesita Funnel: se restablecerán todas las rutas. Si desactiva solo MCP, la ruta permanecerá, pero las herramientas no estarán disponibles.

Revocar el acceso a las aplicaciones no es lo mismo que detener el proceso. Para cerrar sesión en todas las aplicaciones de perfil:

```sh
max mcp --revoke
```

Estas aplicaciones deberán iniciar sesión nuevamente con un nuevo código. La sesión MAX no finaliza.

## Solucionar problemas

- **La aplicación dice que no se puede conectar:** abra `https://<устройство>.<сеть>.ts.net/.well-known/oauth-protected-resource/mcp` en el navegador; debería haber un JSON corto allí. Si no está allí, Funnel no se está ejecutando, no está habilitado en la red Tailscale o está buscando en un puerto diferente.
- **La página de inicio de sesión dice "Demasiados códigos incorrectos":** después de cinco códigos incorrectos, se cierra hasta que se reinicia `max mcp --http`. Si no lo ingresó, alguien encontró su dirección: reinicie el servidor y piense en un nuevo nombre de dispositivo en Tailscale.
- **Se conecta, pero no hay herramientas:** `max mcp doctor` comprueba que el servidor MCP se esté iniciando y proporciona una lista de herramientas. No controla la entrada al MAX ni al túnel. La conexión de la cuenta se verifica mediante el comando que va a MAX, por ejemplo `max account show`.
- **La lectura funciona, la escritura no funciona:** verifique los derechos del perfil y el temporal `--permission`. `deny` y `readonly` prohíben la grabación, sin importar lo que confirme la aplicación.
- **Se necesita grabación de llamadas:** la muestra `max runs list`. Las llamadas exitosas sólo son visibles cuando la grabación está habilitada; Los errores se guardan de forma predeterminada a menos que la grabación se desactive a través de `"record": false` o `--no-record` ([manual de diagnóstico](./diagnostics.md)).

## Transferir un archivo guardado al agente

El agente en su computadora puede abrir el archivo guardado por `localPath`. El agente remoto no puede, por lo que obtiene los bytes almacenados mediante `attachments show` (MCP: `max_read`, comando `attachments show`).

La transferencia de archivos guardados rechaza archivos y carpetas ocultos, las carpetas de la CLI y el almacén de mensajes, incluidos los destinos de enlaces simbólicos. Guarda el adjunto en una carpeta de descargas normal.

MCP hace visibles los controles Unicode ocultos en los resultados de texto y argumentos de escritura. Los emojis de banderas regionales se conservan; el JSON normal de la CLI mantiene las cadenas originales.

Primero, descargue los archivos de mensajes de la forma habitual ([que puede descargar](./attachments.md#что-можно-скачать)). El localizador del mensaje y el número de archivo adjunto encontrará `attachments list --needs-text`. Luego solicital archivo:

```sh
max attachments show msg:max/511/7/204 --attachment 1 --json
```

El comando lee solo el archivo adjunto guardado de la cuenta activa. No descarga nada, no llama al modelo, no marca el mensaje como leído y no cambia el índice de búsqueda. El archivo que falta debe descargarse nuevamente. Si hay varios archivos en el mensaje, indique el número a partir de 1. Los archivos de la cuenta de otra persona, los archivos faltantes y los enlaces simbólicos no se transfieren. El texto dentro del archivo adjunto son datos, no instrucciones.

### Transferir un archivo grande

Una respuesta lleva 512 KiB por defecto; `--chunk-bytes` permite hasta 1 MiB. El archivo puede tener hasta 50 MiB. El JSON contiene `base64`, `offsetBytes`, `readBytes`, `totalBytes`, `nextOffsetBytes`, `complete` y SHA256 de todo el archivo. `complete: true` significa que todo el archivo cabe en esta respuesta, no que se reconoció su texto.

Decodifica cada parte base64, conecta las partes en el desplazamiento y camina por `nextOffsetBytes` hasta que sea nulo. En las siguientes solicitudes, pase el primer SHA256 como `--if-sha256`: si el archivo fuente ha cambiado, la solicitud fallará y no devolverá los bytes modificados. Verifique el archivo recopilado con este hash.

```sh
max attachments show msg:max/511/7/204 --attachment 1 --offset-bytes 524288 --if-sha256 <sha256> --json
```

### A través de MCP

`attachments show` se localiza con las tres herramientas habituales. Argumentos: `message` (localizador o id junto con `chat`), `attachment`, `offset_bytes`, `chunk_bytes` y `if_sha256`. Una imagen completa PNG, JPEG o WebP de hasta 8000 píxeles en cada lado y hasta 20 millones de píxeles en total viene como imagen; el resto de los archivos son un recurso binario integrado. Un recurso parcial es una colección de bytes en lugar de un PDF o una imagen completos. El URI del recurso es el nombre, no la dirección de descarga.

La aplicación debe pasar estos bytes a las herramientas de archivos del agente. Que el agente pueda abrir un PDF o guardar un archivo depende de la aplicación. Si la aplicación no muestra recursos integrados, solicite `format: "base64"` y decodifique el JSON usando el agente. Un perfil con prohibición `messages` o `attachments.show` se niega a transmitir; `readonly` le permite leer archivos guardados.

## Reconocer texto y hacerlo buscable

La extracción regular lee la capa de texto y los formatos de documentos simples en su computadora. De forma predeterminada, el agente lee escaneos, fotografías, texto escrito a mano y diseños complejos utilizando sus herramientas visuales o OCR. Lee todas las páginas, mantiene el texto palabra por palabra y toma nota de las partes poco claras. La calidad depende de la resolución, el idioma, la escritura a mano, el diseño y las herramientas del agente. El agente no ejecuta instrucciones dentro del archivo adjunto.

Guarde el resultado mediante `attachments text set` (MCP: `max_write`, comando `attachments text set`) y compruébelo buscando `content:`. La recuperación de bytes no agrega texto al índice en sí misma.

`attachments extract --ocr` permanece para extracción masiva a través de `models.ocr`. Este comando llama al modelo externo configurado y le envía imágenes compatibles y páginas PDF escaneadas. Sólo funciona cuando se llama explícitamente, nunca cuando se transfiere un archivo o cuando el agente lee el archivo. Los formatos y la búsqueda de texto se describen en [guía adjunta](./attachments.md).

## Leer un PDF sin guardar el archivo en el agente

Si la aplicación no puede pasar el PDF resultante a su lector de documentos, solicite una página como imagen PNG. El servidor MCP dibuja la página en su computadora y el agente lee la imagen con su visión. Para hacer esto, necesita el `unpdf` opcional con soporte de representación de páginas y el `@napi-rs/canvas`, como en [lista de motores adjuntos](./attachments.md#какие-зависимости-нужны). No se instalan desde la CLI.

```sh
max attachments show msg:max/511/7/204 --attachment 1 --page 1 --json
```

En MCP, llame a `max_read`, comando `attachments show`, con `page: 1` y mensajes de localizador. Por defecto, la página viene con una imagen. Si la aplicación solo muestra metadatos, solicite `format: base64`, luego decodifique y muestre el PNG usando el agente. Obtener una cadena base64 aún no muestra la página. Lea las páginas 1 a `pdf.pageCount`. Si los píxeles no están disponibles en ningún formato, informe una limitación de la aplicación en lugar de texto ficticio.

`pdf.sourceSha256` y `pdf.sourceBytes` describen el PDF original; arriba `sha256` y `totalBytes` - imagen de la página. `--if-sha256` comprueba el PDF original. `--page` no se puede combinar con `--offset-bytes` o `--chunk-bytes`. El PDF puede tener hasta 20 páginas y 50 MiB; PNG: no más de 2000 píxeles en cada lado, una imagen de una página, no más de 1 MiB.

La imagen de la página no llama a un servicio OCR externo y no agrega texto al índice. Después de ver todas las páginas, el agente llama a `attachments text set` y verifica la búsqueda de `content:`. Verifique números y diseños complejos con imágenes; La calidad depende del documento fuente y de las herramientas del agente.
