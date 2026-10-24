---
title: "Instalar wa"
---


Instala `wa` desde npm y aprende a actualizarlo o desinstalarlo. Necesitas Node.js 22.16 o posterior en la rama 22.x, o 24 o posterior.

> ⚠️ **`wa` es un cliente no oficial de tu cuenta de WhatsApp.** WhatsApp puede bloquear estas cuentas, en particular por envíos masivos o mensajes a desconocidos. `wa` cambia datos solo cuando un comando lo pide, limita los envíos y detiene las escrituras cuando WhatsApp exige reducir el ritmo. No envíes mensajes masivos ni a desconocidos ([límites](./limits.md)).

## Instalar

```sh
npm install --global @wirecat/whatsapp-cli
wa --version
```

npm también instala el motor, un programa separado que se comunica con WhatsApp. Está disponible para Linux, macOS y Windows, en x64 y arm64. Mantén los paquetes opcionales habilitados: `--omit=optional` deja fuera el motor.

Luego vincule un perfil e instale la skill del agente con `wa personal setup` (consulte [uso](./usage.md)).

La instalación en sí no escribe nada en las carpetas de sus agentes. Para instalar la skill del agente sin vincularla, ejecute `wa skill install` (`--for claude` o `--for agents` para una carpeta). Para que la instalación lo haga, configure `WA_INSTALL_AGENT` en `all`, `claude`, `codex`, `cursor` o `gemini`: `WA_INSTALL_AGENT=all npm install --global @wirecat/whatsapp-cli`.


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


## Adónde van los archivos

Las claves del dispositivo, las configuraciones y el almacén local tienen cada uno su propio lugar: [donde se guardan las piezas](./sessions.md#where-the-parts-are-kept).


## Finalización del caparazón

Tab completa comandos, opciones y sus valores. Cuando se espera un chat, ofrece chats del almacén local. Añade una línea al archivo de inicio de su shell:

```sh
echo 'source <(wa complete zsh)' >> ~/.zshrc      # zsh
echo 'source <(wa complete bash)' >> ~/.bashrc    # bash
wa complete fish | source                         # fish, in config.fish
```

PowerShell: `wa complete powershell | Out-String | Invoke-Expression` en tu perfil.

Una Tab nunca se conecta a WhatsApp. Sin un almacén local todavía, solo se completan los comandos y opciones.


## Actualizar

```sh
wa upgrade            # with the package manager that installed wa
wa upgrade --check    # only say whether a newer version exists; installs nothing
```

`upgrade` pregunta a npm, por lo que se rechaza `--offline` con el código de salida `2`. `upgrade --check` se ejecuta bajo `WA_READ_ONLY`; `upgrade` sin él no lo hace.

Después de una actualización, `wa upgrade` reinicia cada `serve` en ejecución en segundo plano, por lo que no sigue ejecutando el código anterior. El motor viene como paquete `wa`, por lo que se actualiza con él. Una vez al día, `wa` dice en stderr cuando existe una versión más nueva; `WA_NO_UPDATE_CHECK=1`, o `update_check: false` en la configuración, lo desactiva.

De fuente: `git pull && pnpm install && pnpm build && pnpm engine:build`.


## Desinstalar

Al eliminar el comando, se dejan sus datos. Desvincule primero, mientras `wa` todavía esté ahí:

```sh
wa personal server uninstall         # if you installed the background unit; stop it first
wa personal session end              # unlinks the device on WhatsApp's side and deletes its keys here
npm uninstall -g @wirecat/whatsapp-cli
rm -rf ~/.config/whatsapp-cli ~/.local/share/whatsapp-cli ~/.cache/whatsapp-cli
```

Repita `session end` para cada perfil. El almacén local se comparte con otras herramientas WireCat. Elimine `~/.local/share/WireCat/` solo si nada más lo usa: contiene los mensajes que cada uno de ellos ha guardado.


## Siguiente

[Vincular un perfil y leer tus primeros chats](./usage.md#set-up-a-profile).
