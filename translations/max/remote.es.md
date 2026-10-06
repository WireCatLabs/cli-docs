---
title: "ChatGPT o Claude en el navegador"
---

**Estado:** montado y probado con un cliente local. Aún no se ha probado completo con ChatGPT y Claude a través de un túnel real. Si algún paso no funciona como se describe, [abre una incidencia](https://github.com/leemour/max-cli/issues).

`max mcp` se comunica con la aplicación de IA mediante un canal en tu propio ordenador. ChatGPT y Claude en el navegador no pueden usarlo: se conectan desde sus servidores, por internet, a una dirección que les facilites. `max mcp --http` ofrece las mismas herramientas por HTTP con su propio acceso, y **[Tailscale Funnel](https://tailscale.com/kb/1223/funnel)** proporciona al ordenador una dirección HTTPS pública como `https://laptop.tail1234.ts.net`. No necesitas comprar un dominio.

```text
ChatGPT / Claude ──интернет──▶ Tailscale Funnel ──▶ max mcp --http (вход) ──▶ MAX
```

## Antes de empezar

- **Quien inicia sesión puede leer tu MAX.** Para acceder se necesita un código de un solo uso que `max` muestra en tu terminal, así que solo quien ve ese terminal puede añadir una aplicación. Nunca pongas un túnel delante de `max mcp` sin `--http`: ahí no hay ningún acceso protegido.
- **Cada cambio pregunta.** Con `--http`, cada envío, edición, reacción, reenvío, fijación, voto o eliminación te muestra antes un formulario en la aplicación, sea cual sea el nivel de permisos del perfil. Una aplicación que no sabe mostrar esos formularios solo puede leer. Un perfil con `readonly` nunca escribe; la lista de destinatarios y el límite por hora también se aplican aquí ([mcp.md](./mcp.md), [configuración](./configuration.md)).
- **El ordenador con `max` debe estar encendido.** Para usarlo desde un teléfono o un portátil sin configurar, ejecútalo en un pequeño servidor siempre encendido e inicia sesión allí (`max setup --agent none`). Después solo necesitas el navegador.
- **Quién puede usarlo:**

| Aplicación | Planes | Documentación |
|---|---|---|
| ChatGPT | Plus, Pro, Business, Enterprise, Education, en modo de desarrollador | [Modo de desarrollador](https://developers.openai.com/api/docs/guides/custom-mcp-server) |
| Claude | Cualquier plan; uno personalizado en el gratuito | [Conectores personalizados](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) |
| Gemini | Solo adultos en EE. UU. con cuenta personal de Google; no disponible en Rusia ni Europa | [Aplicaciones conectadas](https://support.google.com/gemini/answer/17209137?hl=en) |

## 1. Dar una dirección pública al ordenador

Instala [Tailscale](https://tailscale.com/download) e inicia sesión. Activa MagicDNS, certificados HTTPS y permiso para Funnel en tu red, siguiendo la [Guía de Funnel](https://tailscale.com/kb/1223/funnel). Ejecuta esto en un terminal que mantendrás abierto:

```sh
tailscale funnel 8765
```

La orden muestra la dirección, `https://<устройство>.<сеть>.ts.net`. Ctrl-C cierra el acceso.

## 2. Iniciar `max` con acceso protegido

En un segundo terminal:

```sh
max mcp --http --public-url https://<устройство>.<сеть>.ts.net
```

`max` solo escucha en `127.0.0.1:8765`, así que únicamente el Funnel de este ordenador puede llegar a él, y muestra un **código de acceso** como `K7QP-M2XD`. El código vale una vez y durante 10 minutos; tras cada acceso, `max` muestra uno nuevo. `--port` elige otro puerto: indica el mismo número a Funnel.

## 3. Añadirlo a la aplicación

La dirección para la aplicación es tu dirección de Funnel terminada en `/mcp`: `https://<устройство>.<сеть>.ts.net/mcp`.

- **ChatGPT:** activa el modo de desarrollador y añade el conector con esa dirección siguiendo la [documentación](https://developers.openai.com/api/docs/guides/custom-mcp-server).
- **Claude:** añade un conector personalizado con esa dirección siguiendo la [documentación](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp). En la configuración del conector también puedes decidir, para cada herramienta, si está siempre permitida, si requiere confirmación o si está prohibida.

La aplicación abre la página de acceso de `max`. Comprueba la línea que indica adónde irá el acceso (debe decir `chatgpt.com` o `claude.ai`) e introduce el código del terminal. La aplicación sigue conectada 30 días y renueva el acceso por sí misma; después pedirá un código nuevo.

## Desconectar

Pulsa Ctrl-C en ambos terminales. Al cerrar Funnel, no queda nada abierto. Para que todas las aplicaciones tengan que volver a iniciar sesión:

```sh
max mcp --revoke
```

## Solucionar problemas

- **La aplicación dice que no puede conectarse:** abre en el navegador `https://<устройство>.<сеть>.ts.net/.well-known/oauth-protected-resource/mcp`; debe aparecer un JSON breve. Si no aparece, Funnel no está iniciado, no está habilitado en la red de Tailscale o apunta a otro puerto.
- **La página de acceso dice «Too many wrong codes»:** tras cinco códigos incorrectos queda cerrada hasta reiniciar `max mcp --http`. Si no fuiste tú, alguien ha encontrado tu dirección: reinicia y plantéate cambiar el nombre del dispositivo en Tailscale.
- **Conecta, pero no hay herramientas:** `max mcp doctor` comprueba el arranque y la lista de herramientas, pero no el acceso a MAX. El acceso lo comprueba una orden de red explícita, por ejemplo `max account show`.
- **Un cambio falla con «the owner did not confirm this»:** la aplicación no mostró el formulario o se rechazó. No se ha enviado nada.
- Con el registro activado, las llamadas MCP correctas aparecen en `max runs list`; los errores se guardan por defecto. Un `record: false` explícito o `--no-record` desactiva también los errores ([Diagnóstico](./diagnostics.md)).
