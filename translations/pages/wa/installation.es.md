---
title: "Instalar wa"
description: "Instala la herramienta de WhatsApp, vincula tu teléfono y conecta tu agente de IA."
---

Conecta tu WhatsApp a un agente de IA en tu ordenador. Al terminar podrá leer chats guardados, buscar mensajes y preparar respuestas. Ten cerca el teléfono con WhatsApp abierto y deja unos cinco minutos para recibir el historial reciente.

## Los pasos

1. [Instalar wa](#install): la herramienta y su motor de WhatsApp.
2. [Vincular tu cuenta](#log-in): escanea un QR desde WhatsApp en el teléfono.
3. [Conectar tu agente](#connect-agent): instala sus instrucciones, llamadas skill.
4. [Comprobar el resultado](#check): identifica tu cuenta y algunos chats guardados.

Es un cliente no oficial. Lee [seguridad](./security.md) y [límites](./limits.md) antes de vincular: WhatsApp puede restringir o bloquear cuentas que usan clientes no oficiales.

<a id="install" />
<a id="requirements" />

## 1. Instalar wa

### Con tu agente

Usa un agente con acceso al terminal de este ordenador, como Codex, Claude Code, Cursor o Gemini CLI. Para un chat solo en el navegador, consulta [acceso web o móvil](/es/docs/browser-apps).

```text prompt
Usa wa CLI. Ayúdame a conectar mi WhatsApp al agente siguiendo https://wirecat.dev/es/docs/wa/installation. Comprueba los programas necesarios e instala la herramienta. Pregunta qué cuenta y nombre de perfil quiero; personal es un ejemplo. Yo confirmaré la vinculación en el teléfono. Instala el skill y muestra mi cuenta y algunos chats. No envíes mensajes ni inicies trabajo en segundo plano sin preguntar.
```

### A mano en el terminal

Abre Terminal en macOS o Linux, o PowerShell en Windows. Necesitas Node.js 22.16 o posterior dentro de 22.x, o 24 o posterior, con npm; consulta [preparar el entorno](/es/docs/installation#nodejs).

```sh
npm install -g @wirecat/whatsapp-cli
wa --version
wa doctor
```

Mantén habilitados los paquetes opcionales: npm instala el motor de WhatsApp para tu sistema y procesador. El gestor puede avisar de scripts de instalación bloqueados; comprueba el resultado con los comandos siguientes. Si falta el motor, consulta [solución de problemas](./troubleshooting.md#the-whatsapp-engine-is-not-installed). En Windows, abre un terminal nuevo si no se encuentra el comando.

<a id="log-in" />
<a id="first-run" />

## 2. Vincular tu cuenta de WhatsApp

En los ejemplos, personal es el nombre del perfil: una cuenta vinculada en este ordenador. Elige cualquier nombre y repítelo en los comandos posteriores. La herramienta no elige una cuenta por ti.

```sh
wa personal setup
```

1. Ejecuta la configuración en el terminal. Comprueba carpetas e inicia la vinculación; reutiliza un perfil ya vinculado.
2. En el teléfono, abre WhatsApp → Ajustes → Dispositivos vinculados → Vincular un dispositivo. Usa el escáner de WhatsApp para leer el QR mostrado por la configuración.
3. Mantén WhatsApp abierto mientras llega el historial reciente. La configuración comprueba tu cuenta y hasta cinco chats guardados y ofrece instalar el skill del agente.

Se añade un dispositivo vinculado, como WhatsApp Web. Puedes desconectarlo cuando quieras desde Dispositivos vinculados en el teléfono. Para usar un código en lugar del QR, ejecuta `wa personal setup --method phone`; introduces el número en el terminal. Confirma tú el acceso. El historial antiguo requiere una [petición aparte al teléfono](./archive.md#older-history-from-your-phone).

<a id="connect-agent" />

## 3. Conectar tu agente

Un skill es un archivo breve que explica al agente del terminal cómo usar wa. La configuración puede instalarlo para el agente elegido. Para instalarlo aparte:

```sh
wa skill install --for all
```

Una aplicación sin terminal puede usar [MCP](./mcp.md). Elige antes los [permisos](./permissions.md) del perfil: MCP ofrece comandos de escritura además de lectura.

<a id="check" />

## 4. Comprobar el resultado

```sh
wa personal account show
wa personal chats list --limit 5
```

La cuenta debe ser la elegida en tu teléfono. La lista de chats utiliza el historial guardado y no envía confirmaciones de lectura. Un historial vacío o incompleto no demuestra que no haya mensajes; consulta [cobertura del historial](./archive.md).

Para seguir recibiendo mensajes, ejecuta `wa personal serve` en un terminal; Ctrl-C lo detiene. Un dispositivo vinculado solo admite una conexión. Lee [la regla de conexión](./sessions.md#one-connection-per-device) antes de ejecutar otro comando conectado.

<a id="questions" />

## Preguntas y respuestas

### No se ve el QR

Pide al agente que muestre el terminal o pegue el QR de texto en el chat. Usa el escáner de WhatsApp. Si el terminal es demasiado estrecho, amplíalo y espera el siguiente QR. Consulta otros fallos en [solución de problemas](./troubleshooting.md).

## Instalación avanzada y mantenimiento

<a id="from-source" />

## De la fuente

Para ejecutar `wa` desde el repositorio:

```sh
git clone https://github.com/WireCatLabs/whatsapp-cli.git
cd whatsapp-cli
pnpm install
pnpm build
pnpm engine:build   # needs Go
node dist/bin/wa.js --version
```


<a id="where-files-go" />

## Adónde van los archivos

Las claves del dispositivo, las configuraciones y el almacén local tienen cada uno su propio lugar: [donde se guardan las piezas](./sessions.md#where-the-parts-are-kept).


<a id="shell-completion" />

## Finalización del caparazón

Tab completa comandos, opciones y sus valores. Cuando se espera un chat, ofrece chats del almacén local. Añade una línea al archivo de inicio de su shell:

```sh
echo 'source <(wa complete zsh)' >> ~/.zshrc      # zsh
echo 'source <(wa complete bash)' >> ~/.bashrc    # bash
wa complete fish | source                         # fish, in config.fish
```

PowerShell: `wa complete powershell | Out-String | Invoke-Expression` en tu perfil.

Una Tab nunca se conecta a WhatsApp. Sin un almacén local todavía, solo se completan los comandos y opciones.


<a id="upgrade" />

## Actualizar

```sh
wa upgrade            # with the package manager that installed wa
wa upgrade --check    # only say whether a newer version exists; installs nothing
```

`upgrade` pregunta a npm, por lo que se rechaza `--offline` con el código de salida `2`. `upgrade --check` se ejecuta bajo `WA_READ_ONLY`; `upgrade` sin él no lo hace.

Después de una actualización, `wa upgrade` reinicia cada `serve` en ejecución en segundo plano, por lo que no sigue ejecutando el código anterior. El motor viene como paquete `wa`, por lo que se actualiza con él. Una vez al día, `wa` dice en stderr cuando existe una versión más nueva; `WA_NO_UPDATE_CHECK=1`, o `update_check: false` en la configuración, lo desactiva.

De fuente: `git pull && pnpm install && pnpm build && pnpm engine:build`.


<a id="uninstall" />

## Desinstalar

Al eliminar el comando, se dejan sus datos. Desvincule primero, mientras `wa` todavía esté ahí:

```sh
wa personal server uninstall         # if you installed the background unit; stop it first
wa personal session end              # unlinks the device on WhatsApp's side and deletes its keys here
npm uninstall -g @wirecat/whatsapp-cli
rm -rf ~/.config/whatsapp-cli ~/.local/share/whatsapp-cli ~/.cache/whatsapp-cli
```

Repita `session end` para cada perfil. El almacén local se comparte con otras herramientas WireCat. Elimine `~/.local/share/WireCat/` solo si nada más lo usa: contiene los mensajes que cada uno de ellos ha guardado.


<a id="next" />

## Siguiente

[Vincular un perfil y leer tus primeros chats](./usage.md#set-up-a-profile).
