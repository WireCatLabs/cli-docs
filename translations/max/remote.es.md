---
title: "ChatGPT o Claude en el navegador"
---

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
