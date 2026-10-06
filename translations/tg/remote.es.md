---
title: "ChatGPT o Claude en el navegador"
---

`tg mcp --http` ofrece las mismas herramientas en `127.0.0.1`, detrás de tu túnel HTTPS. El servidor HTTP tiene su propio acceso OAuth para un único propietario; no hace falta un proxy de autenticación aparte. La conexión local por stdin/stdout sigue funcionando como antes. La configuración en el navegador no se ha probado de principio a fin.

## Iniciar el túnel y el servidor

Primero configura Telegram con `tg setup --agent none`. Mantén el equipo encendido mientras uses el conector. Por ejemplo, instala [Tailscale](https://tailscale.com/download), activa [Funnel](https://tailscale.com/kb/1223/funnel) y ejecuta:

```sh
tailscale funnel 8765
```

En otra terminal, usa la dirección HTTPS que mostró Funnel, sin ruta:

```sh
tg mcp --http --public-url https://<device>.<network>.ts.net --port 8765
```

Si hace falta, pon delante un perfil: `tg work mcp --http --public-url https://<device>.<network>.ts.net`. El puerto local predeterminado es `8765`. El servidor muestra en la terminal un código de propietario de un solo uso.

## Conectar la aplicación

Añade la dirección del túnel con `/mcp`, por ejemplo `https://<device>.<network>.ts.net/mcp`, como conector MCP remoto. Consulta las instrucciones de la aplicación: [modo desarrollador de ChatGPT](https://developers.openai.com/api/docs/guides/developer-mode) o [conectores personalizados de Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp). La página de acceso pide el código que aparece en tu terminal. Caduca a los diez minutos; tras cada acceso se muestra un código nuevo. Cinco códigos incorrectos bloquean el acceso hasta que se reinicie el servidor.

Los `permissions` del perfil siguen decidiendo qué herramientas están disponibles. Toda escritura por HTTP requiere un formulario de confirmación, incluso con `allow`, `--yes` o `--allow-dangerous`. Un cliente sin formularios no puede realizar esa escritura. Elige `readonly` o `deny` para los recursos que el conector no debe cambiar; consulta la [configuración](./configuration.md).

## Detener o revocar el acceso

Pulsa Ctrl-C en ambas terminales para detener el servidor y el túnel. Los accesos ya hechos desde el navegador se conservan tras un reinicio normal del servidor. Para olvidar todos los accesos desde el navegador de un perfil:

```sh
tg mcp --revoke --json
```

Esas aplicaciones tendrán que volver a iniciar sesión. Esto no cierra tu sesión de Telegram.

## Comprobar una conexión

`tg mcp doctor` comprueba el saludo inicial MCP local y la lista de herramientas; no verifica la sesión de Telegram ni el túnel. Un comando de red explícito, como `tg account show`, comprueba la conexión de la cuenta. Los registros de ejecución están disponibles con `tg runs list`: las llamadas correctas solo se registran si el registro está activado; las fallidas se conservan por defecto, salvo que se haya desactivado el registro de forma explícita.
