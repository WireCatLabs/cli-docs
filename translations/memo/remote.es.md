---
title: "Conectar una app del navegador o del teléfono"
---

Conecta una app de IA remota a Memo cuando no pueda iniciar un programa en tu ordenador. La app llega a Memo por tu propio túnel HTTPS, inicia sesión con un código del terminal y usa los mismos comandos de búsqueda, lectura y escritura que un cliente MCP local. El ordenador con Memo debe permanecer encendido.

Un túnel HTTPS reenvía una dirección pública a un puerto de tu ordenador. El acceso por código usa OAuth: la app recibe un token después de que autorices su conexión. Los permisos de los comandos siguen decidiendo qué puede hacer. El texto devuelto por Memo puede llegar a la app y a su proveedor de IA; elige las fuentes teniendo esto en cuenta ([seguridad](./security.md)).

## Iniciar el túnel y el servidor

[Instala Memo](./installation.md) e importa primero las notas o el correo que quieras consultar. Los mensajes y reuniones deben estar guardados por las otras herramientas WireCat. Usa el mismo usuario del sistema operativo y los mismos ajustes de Memo para importar y servir MCP. Memo no lleva un perfil delante del comando.

Prepara un túnel HTTPS que admita respuestas en streaming. Por ejemplo, instala [Tailscale](https://tailscale.com/download), inicia sesión, activa [Funnel](https://tailscale.com/docs/features/tailscale-funnel) y dirígelo al puerto local 8767. La [referencia de Funnel](https://tailscale.com/docs/reference/tailscale-cli/funnel) explica los permisos y el comando de tu sistema. Un Cloudflare Tunnel con nombre también sirve; los [Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/) temporales no admiten las respuestas en streaming de este servidor.

Deja el túnel en ejecución en un terminal. En otro, sustituye el origen del ejemplo por el origen HTTPS que te da el túnel, incluido el puerto si aparece:

```sh
memo mcp serve --http --public-url https://device.example
```

Memo escucha solo en `127.0.0.1:8767` y muestra un código de acceso de un solo uso y la dirección del conector. Dirige el túnel a `http://127.0.0.1:8767`. El origen público no debe tener credenciales, ruta, consulta ni fragmento; Memo añade `/mcp` para el conector. Los orígenes públicos remotos deben usar HTTPS.

Para usar otro puerto local, pasa `--port` y cambia el destino del túnel:

```sh
memo mcp serve --http --port 8768 --public-url https://device.example:8443
```

Cada servidor WireCat necesita su propio puerto local y origen público. El puerto inicial de Memo, 8767, deja libres los habituales de tg y MAX. Sigue las reglas del proveedor del túnel al elegir el puerto público.

Para que siga funcionando después de cerrar el terminal, inícialo en segundo plano. Responde en cuanto escucha, con la dirección del conector y el código de acceso:

```sh
memo mcp server start --public-url https://device.example
memo mcp server status   # running, port, connector address, the current login code, apps logged in
memo mcp server stop     # stops only a server that `mcp server start` started
```

El código se guarda junto al archivo de tokens (`mcp-http/memo.lock`, modo 600) y se renueva cada diez minutos; un servidor iniciado así no lo escribe en su registro. WireCat Desktop muestra el mismo estado en Tools → Memo → MCP server.

## Conectar la app

Añade la dirección del conector que muestra Memo, terminada en `/mcp`, en los ajustes MCP remotos de la app. Elige el inicio de sesión OAuth; la app debe admitir registro dinámico de clientes. Cuando se abra la página de acceso, introduce el código actual del terminal. Un inicio correcto entrega un token a esa app; Memo muestra un código nuevo para la siguiente conexión. No pongas los códigos en mensajes ni registros públicos.

Pide a la app que descubra los comandos de Memo y busque una nota conocida que sea ficticia o no privada. Debe ofrecer `memo_tools_search`, `memo_read` y `memo_write`. Abre una fuente devuelta antes de usarla como evidencia. Si la app no puede leer los resultados, debe comunicar esa limitación.

El túnel y la app se instalan por separado. Esta guía describe el protocolo probado del servidor; no certifica todas las apps, suscripciones o configuraciones del sistema operativo.

## Limitar lo que puede hacer una app

HTTP usa los mismos [permisos guardados](./configuration.md#permissions) que stdio. Los comandos bloqueados siguen en el catálogo con un motivo y cada llamada vuelve a comprobar los permisos actuales. `ask` no muestra una pregunta en el terminal de Memo; las solicitudes de aprobación dependen de la app cliente.

Una modificación del servidor solo puede restringir los permisos guardados:

```sh
memo mcp serve --http --public-url https://device.example --permission notes.add=deny
```

Repite `--permission` para otras claves. `MEMO_READ_ONLY=1` rechaza escrituras. Las decisiones sobre hallazgos de reuniones, la restauración de anotaciones y los cambios de carpetas de origen o reglas de correo siguen necesitando sus permisos explícitos. Memo nunca envía mensajes ni correo. La [guía MCP](./mcp.md) explica esos límites.

## Detener o revocar el acceso

Pulsa Ctrl-C para detener Memo y detén por separado la ruta de este túnel. Un reinicio normal conserva las sesiones de las apps. Si el túnel funciona en segundo plano, usa su comando para detener esa ruta; no restablezcas las rutas de otros servidores.

Para cerrar las sesiones de todas las apps del navegador en esta instalación de Memo:

```sh
memo mcp revoke --json
```

La revocación también afecta al servidor en ejecución: los tokens existentes dejan de funcionar y las apps deben iniciar sesión de nuevo. No desconecta un servicio de mensajería ni elimina notas o correo. Los hashes de tokens y registros de clientes se guardan bajo la carpeta de estado de Memo en `mcp-http/memo.json`; allí no se guardan tokens sin hash. La revocación usa esa carpeta, así que ejecútala con el mismo entorno que el servidor.

## Si falla la conexión

- Si el conector no llega a Memo, comprueba que el ordenador, servidor y túnel están funcionando y que el túnel apunta al puerto local elegido. La dirección pública terminada en `/.well-known/oauth-protected-resource/mcp` debe devolver metadatos JSON.
- Si el puerto local está ocupado, elige otro `--port` y actualiza el destino del túnel.
- Si falla el inicio de sesión, usa el último código del terminal. El acceso compartido limita los intentos repetidos con códigos incorrectos.
- Si puedes leer pero no escribir, revisa los permisos guardados, las modificaciones del servidor y el bloqueo de escritura.
- Usa `memo agents list agent:memo-mcp` para revisar la ejecución de comandos sin sus argumentos.

Siguiente: [revisar lo que guardó la app](./memories.md).
