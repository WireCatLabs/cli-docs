---
title: "Instalar tg"
description: "Instala tg, registra su aplicación de Telegram, inicia sesión con un código QR y conecta tu agente de IA, con su ayuda o a mano."
---

En esta página conectarás tu cuenta de Telegram a un agente de IA en tu ordenador. Después podrás pedirle que lea tus chats, busque mensajes y prepare respuestas. Necesitas unos cinco minutos y tu teléfono con la sesión de Telegram iniciada.

## Los pasos

1. [Instala tg](#install). tg es un pequeño programa que da a tu agente acceso a tu cuenta de Telegram. El agente puede instalarlo por ti, o puedes hacerlo a mano.
2. [Inicia sesión en Telegram](#log-in). Confirmas dos veces en el teléfono: primero con un código que registra tg en Telegram, luego escaneando un código QR. Así tu ordenador pasa a ser un dispositivo nuevo de tu cuenta.
3. [Conecta tu agente](#connect-agent). El agente recibe las instrucciones que necesita para usar tg.
4. [Comprueba que funciona](#check). El agente muestra tu cuenta y algunos chats.

Si un paso no funciona, consulta las [preguntas y respuestas](#questions).

<a id="install" />

<a id="what-it-needs" />

<a id="requirements" />

## 1. Instala tg

Hay dos formas de instalarlo. El resultado es el mismo.

### Con tu agente

Usa un agente que pueda ejecutar programas en este ordenador, por ejemplo Claude Code, Codex, Cursor o Gemini CLI. Si solo usas un chat con el agente en el navegador o en el teléfono, sigue la guía [Conectar desde la web o el teléfono](/es/docs/browser-apps).

Copia esta petición en el chat con tu agente. Te ayudará a instalar la herramienta e iniciar sesión en tu ordenador.

```text prompt
Ayúdame a conectar mi cuenta de Telegram a mi agente de IA en este ordenador.
Sigue https://wirecat.dev/es/docs/tg/installation: comprueba los programas necesarios y ayúdame a instalar la herramienta.
Muéstrame los pasos de inicio de sesión para que yo confirme el acceso a mi cuenta.
Conecta las instrucciones de la herramienta a mi agente. Al final muestra mi cuenta y algunos chats. No envíes mensajes.
```

El agente te guía por estos pasos:

1. **Revisa tu ordenador.** tg necesita Node.js 22.16 o posterior. Si falta, el agente te explica cómo instalarlo.
2. **Instala tg.** En este paso tu cuenta no se toca.
3. **Inicia el acceso.** El agente ejecuta `tg personal setup` en una ventana de terminal. Confirmas en el teléfono, como se explica en [Inicia sesión en Telegram](#log-in). Si el agente no puede mostrarte esa ventana, pega el código QR en el chat como texto: consulta [el agente no puede mostrarme el terminal](#q-agent-qr).
4. **Se conecta a tg.** El agente instala para sí las instrucciones de tg.
5. **Muestra el resultado.** Ves el nombre de tu cuenta y algunos chats. El agente no envía nada.

Tú confirmas el acceso, en tu teléfono. No pegues códigos ni contraseñas en el chat con el agente.

<a id="windows-one-install-command" />

### A mano en un terminal

Abre Terminal en macOS o Linux, o PowerShell en Windows.

1. **Instala Node.js 22.16 o posterior** (22.x o 24+), o Bun. Consulta [Node.js, npm y encontrar el comando](/es/docs/installation#nodejs).
2. **Instala tg:**

   ```sh
   npm install -g @wirecat/tg-cli && tg skill install --for all
   ```

   npm puede informar de scripts de instalación bloqueados. El segundo comando instala las instrucciones del agente de forma explícita. Lee los avisos del gestor de paquetes y comprueba la versión en el paso siguiente. En Windows, abre otra terminal si no se encuentra `tg`.

   En Windows puedes usar un solo comando. Instala tg, lo añade a `PATH` (las carpetas donde el terminal busca comandos) y conecta todos los agentes compatibles:

   ```powershell
   & ([scriptblock]::Create((Invoke-RestMethod 'https://wirecat.dev/install.ps1'))) -Tool tg -Agent all
   ```

3. **Comprueba la instalación:**

   ```sh
   tg --version
   ```

   Verás un número de versión. Si el terminal dice que no encuentra el comando, consulta [tg no se encuentra después de instalarlo](#q-not-found).

4. **Inicia el acceso:**

   ```sh
   tg personal setup
   ```

   Continúa con el paso siguiente.

<a id="log-in" />

<a id="first-run" />

## 2. Inicia sesión en Telegram

El acceso añade tu ordenador como un dispositivo nuevo de tu cuenta de Telegram, igual que Telegram Desktop. Puedes ver ese dispositivo en Telegram en el teléfono y quitarlo cuando quieras. El acceso no descarga el historial de chats.

`tg personal setup` muestra el acceso. Lo inicia tu agente o lo ejecutas tú.

`personal` es el nombre de este acceso en tu ordenador, llamado perfil. Sirve cualquier nombre. Los comandos siguientes empiezan con el mismo nombre, por ejemplo `tg personal doctor`.

Telegram pide dos confirmaciones. Primero, tg registra para tu cuenta su propia aplicación de Telegram: dos valores, App api_id y App api_hash, que identifican el programa pero por sí solos no permiten leer mensajes. Después escaneas un código QR, y tg inicia sesión.

1. Cuando la configuración pida tu número de teléfono, introdúcelo con el prefijo del país, por ejemplo +34… . Esta primera confirmación permite a tg preparar los datos de conexión que Telegram requiere para tu cuenta.
2. Abre Telegram en el teléfono y busca el mensaje de servicio de Telegram con el código para my.telegram.org. Este código llega a Telegram, no por SMS. Introdúcelo cuando lo pida la configuración. tg obtiene los datos de conexión existentes o los crea por ti; no necesitas programar.

   ![Mensaje de Telegram con el código para acceder a my.telegram.org](/screenshots/telegram/code-message.jpg)

3. Después espera a que aparezca el código QR de inicio de sesión en el ordenador. Son dos confirmaciones distintas: el primer código prepara la conexión y el QR conecta tg a tu cuenta.
4. En Telegram en el teléfono, abre **Configuración → Dispositivos** y elige **Vincular dispositivo de escritorio** o **Vincular dispositivo**. Permite el acceso a la cámara si se solicita y apunta el escáner al QR que muestra la configuración en el ordenador. Usa el escáner de Telegram, no la cámara habitual del teléfono.

   ![Telegram: Configuración → Dispositivos, con Add Device resaltado](/screenshots/telegram/add-device.jpg)

5. Si la configuración pide la contraseña adicional de Telegram, introduce la que configuraste en Telegram. No es el código de un solo uso. El terminal no muestra lo que escribes. Escríbela y pulsa Enter.
6. Espera a que la configuración confirme el acceso y revise tu cuenta y hasta cinco chats.

<a id="connect-agent" />

## 3. Conecta tu agente

El agente necesita instrucciones para usar tg. Esas instrucciones se llaman skill. La configuración pregunta qué agente usas e instala la skill para él. El comando de instalación de arriba ya ejecuta `tg skill install --for all`.

Para instalarla de nuevo:

```sh
tg skill install --for all
```

Después abre una sesión nueva del agente para que cargue las instrucciones. Para otros agentes y aplicaciones MCP, consulta [Conectar el agente](/es/docs/agents).

<a id="check" />

## 4. Comprueba que funciona

Pide a tu agente:

```text prompt
Use tg CLI. Muestra mi cuenta de Telegram y mis cinco chats más recientes. No envíes nada.
```

Comprueba que el nombre y los chats son de la cuenta que querías conectar. Si es así, tg está listo.

La configuración no descarga todo el historial de chats. Para buscar mensajes antiguos, pide al agente que [descargue el historial que necesitas](/es/docs/tg/archive).

A mano, `tg personal doctor` muestra si has iniciado sesión y dónde guarda tg sus archivos. No se conecta a Telegram.

<a id="next" />

**Siguiente:** [prueba tu primera tarea](/es/docs/first-tasks).

<a id="questions" />

## Preguntas y respuestas

<a id="q-qr" />

### El código QR no se escanea

**Con tu agente:** pide al agente que use el acceso por número de teléfono. Introduce el número y el nuevo código cuando lo pida la configuración, seguido de la contraseña adicional de Telegram si se solicita. El código puede llegar a Telegram en lugar de por SMS; la configuración indica cuál.

**A mano:**

```sh
tg personal setup --method phone
```

<a id="q-agent-qr" />

### El agente no puede mostrarme el terminal con el código QR

El agente ejecuta `tg personal session start qr` en segundo plano. Sin terminal, tg imprime el código QR como texto. El agente lo pega en el chat como bloque de código, tal como se imprimió, y tú lo escaneas desde la pantalla. Cuando Telegram renueva el código, el agente pega el nuevo y dice que el anterior caducó. Solo funciona si tg ya tiene su aplicación de Telegram y tu cuenta no tiene contraseña adicional; si no, ejecuta `tg personal setup` tú mismo. Más en [cuando el agente inicia la sesión](/es/docs/agents#agent-login).

<a id="q-app" />

### No se puede registrar la aplicación de Telegram

tg rellena por ti el formulario de my.telegram.org. Si Telegram cambia ese sitio, registra la aplicación a mano y da a tg sus dos valores.

**Con tu agente:** pídele que use el registro manual de la aplicación. Abre my.telegram.org/apps en tu navegador.

**A mano:** ejecuta `tg personal setup --app browser` y después:

1. Abre my.telegram.org/apps e inicia sesión con tu número. Introduce el código del chat de servicio de Telegram en esa página, no en el chat con el agente.

   ![Formulario de my.telegram.org para el teléfono y el código de confirmación](/screenshots/telegram/my-telegram-login.png)

2. Elige **API development tools**. Necesitas los ajustes de la aplicación, no Delete account.

   ![Menú de my.telegram.org con API development tools resaltado](/screenshots/telegram/my-telegram-api-tools.png)

3. Si todavía no hay una aplicación, elige un título y un nombre corto, selecciona **Desktop** y créala. Si ya existe, úsala.
4. Introduce App api_id y App api_hash en el terminal de configuración cuando los pida. El hash permanece oculto al escribir. Son datos de conexión, no un token de bot.

   ![App configuration con App api_id y App api_hash resaltados](/screenshots/telegram/my-telegram-credentials.png)

5. Continúa con el inicio de sesión por QR.

### El código QR caducó o la configuración se detuvo

**Con tu agente:** pídele que termine el acceso y vuelva a ejecutar la configuración.

**A mano:** ejecuta `tg personal session start` para terminar el acceso y después `tg personal setup` de nuevo. Si ya iniciaste sesión, la configuración usa ese acceso y no vuelve a preguntar.

<a id="q-not-found" />

### tg no se encuentra después de instalarlo

**Con tu agente:** reinicia el agente o pídele que abra un terminal nuevo. Un terminal que estaba abierto durante la instalación no ve el comando nuevo.

**A mano:** abre un terminal nuevo y vuelve a ejecutar `tg --version`. npm no puede cambiar el `PATH` del terminal donde se ejecutó. En Windows, el comando de PowerShell de [Instala tg](#install) también corrige `PATH` cuando npm omitió su script de instalación, y actualiza el terminal actual.

### pnpm no encuentra su directorio global de comandos

Si pnpm muestra `ERR_PNPM_GLOBAL_BIN_DIR_NOT_IN_PATH`, ejecuta `pnpm setup`, abre otra terminal y repite la instalación. Consulta [pnpm setup](https://pnpm.io/cli/setup).

### ¿Dónde escribo los códigos y las contraseñas?

En el terminal de configuración o en la página de my.telegram.org, nunca en el chat con el agente. Si no encuentras la ventana del terminal, pide al agente que te la muestre.

### El agente no puede usar tg después de la configuración

**Con tu agente:** abre una sesión nueva del agente para que cargue las instrucciones de tg. Si sigue sin poder, consulta [Conectar el agente](/es/docs/agents).

**A mano:** ejecuta `tg skill install --for claude` para Claude Code, `--for agents` para Codex, Gemini CLI y otros agentes que leen `~/.agents`, o `--for all`.

### Tras actualizar, tg dice que no se indicó un perfil

tg nunca elige una cuenta por sí mismo: cada comando que usa tu cuenta empieza con el nombre del perfil.

**Con tu agente:** dile el nombre del perfil. Si configuraste tg antes sin nombrar un perfil, se llama `default`.

**A mano:** escribe el nombre primero (`tg default chats list`) o fíjalo una vez: `export TG_PROFILE=default` en el perfil de tu shell. Si añadiste tg a una aplicación MCP, vuelve a crear esa entrada con `tg default mcp config`. Cualquier otra cosa que inicie `tg serve` o `tg mcp` por ti, como una tarea programada, también necesita el perfil en su comando: `tg default serve`.

### Tras actualizar, tg se detiene y nombra dos archivos de mensajes

La actualización mueve una sola vez el archivo de mensajes a la carpeta WireCat. Si el sitio antiguo y el nuevo tienen copias distintas, tg se detiene con el código 3 y nombra los dos archivos. Conserva el que necesitas, aparta el otro y vuelve a ejecutar el comando. No se ha movido ni cambiado nada.

### Falta un chat o mensajes antiguos

La configuración solo revisa algunos chats. Pide al agente que descargue el chat y el período que necesitas: consulta [Archivo local](/es/docs/tg/archive). Un resultado de búsqueda vacío no significa que el chat no tenga esos mensajes.

### ¿Puedo probar tg sin instalarlo?

Sí: `npx @wirecat/tg-cli --help`. Así tg se ejecuta una vez. No añade el comando `tg` ni conecta tu agente.

### ¿Dónde se guarda el acceso?

El acceso es un archivo de sesión en la carpeta de estado de tg (ver la tabla). Quien tenga ese archivo puede leer tus chats, así que trátalo como una contraseña. App api_id y App api_hash se guardan en el almacén de contraseñas del sistema operativo (el llavero). Consulta [Seguridad](/es/docs/security).

<a id="files" />

<a id="where-files-go" />

## Dónde se guardan los archivos

| Qué | Linux y macOS | Windows |
| --- | --- | --- |
| Ajustes | `~/.config/tg-cli/` | `%APPDATA%\tg-cli\Config\` |
| Estado: el acceso, registros de ejecución, envíos, destinatarios | `~/.local/share/tg-cli/` | `%LOCALAPPDATA%\tg-cli\Data\` |
| Caché | `~/.cache/tg-cli/` | `%LOCALAPPDATA%\tg-cli\Cache\` |
| Archivo local de mensajes, compartido con max | `~/.local/share/WireCat/wirecat.db` | `%LOCALAPPDATA%\WireCat\Data\wirecat.db` |
| Modelos de reconocimiento de voz | `~/.local/share/WireCat/models/audio/` | `%LOCALAPPDATA%\WireCat\Data\models\audio\` |

`tg personal doctor` muestra las rutas exactas en tu ordenador. `WIRECAT_STATE_DIR` mueve toda la carpeta WireCat. Para cambiar estas carpetas u otros ajustes, consulta [Configuración](/es/docs/configuration) y la [referencia de ajustes de tg](/es/docs/tg/configuration).

La primera ejecución tras actualizar desde un tg anterior mueve aquí una sola vez el archivo y los modelos, desde `~/.local/share/cli-messaging/` y `~/.cache/cli-common/models/`. En macOS, las versiones anteriores guardaban sus carpetas en `~/Library`; también se mueven una vez.

<a id="upgrade" />

<a id="upgrade-json-result" />

<a id="shell-completion" />

## Actualizar

```sh
tg upgrade            # usa el gestor de paquetes que instaló tg: npm, pnpm o bun
tg upgrade --check    # solo indica si hay una versión más nueva
```

Si actualizas desde una versión que guardaba los mensajes en `messages.db`, copia antes las notas o etiquetas que solo existen en tu ordenador: el archivo antiguo se borra al abrir el nuevo. `tg personal messages sync --all` vuelve a descargar los mensajes, pero no las notas ni etiquetas locales.

Actualiza max y memo junto con tg: comparten el archivo de mensajes, y una herramienta antigua crearía un archivo nuevo en el sitio anterior.

tg no se actualiza solo. Una vez al día comprueba si hay una versión nueva y lo indica en una línea del terminal. Tras actualizar, `tg upgrade` reinicia el `serve` en segundo plano que inició tg. El acceso se conserva.

<a id="uninstall" />

## Desinstalar

Desinstalar tg quita el comando, no tus datos. Cierra sesión antes, mientras tg sigue instalado:

```sh
tg personal server uninstall          # solo si instalaste el servicio en segundo plano
tg personal session end               # cerrar sesión en Telegram y borrar el archivo de sesión
npm uninstall -g @wirecat/tg-cli
rm -rf ~/.config/tg-cli ~/.local/share/tg-cli ~/.cache/tg-cli
rm -rf ~/.claude/skills/tg-cli ~/.agents/skills/tg-cli
```

Si conectaste bots, ejecuta también `tg <profile> bot auth remove` para cada perfil de bot. Cerrar sesión deja App api_id y App api_hash en el llavero, bajo el servicio `tg-cli`; borra esa entrada con la herramienta del sistema si ya no los necesitas. Borra `~/.local/share/WireCat/` solo si ninguna otra herramienta, como max, necesita los mensajes guardados.

## Desde el código fuente

Instala desde el código fuente si cambias el código o quieres una versión que aún no se ha publicado.

```sh
git clone https://github.com/WireCatLabs/tg-cli.git
cd tg-cli
pnpm install
pnpm build
```

En una copia de trabajo, `bin/tg` guarda sus ajustes, el acceso y el archivo en `.tg/` dentro de ella, nunca en tu perfil real. `node dist/bin/tg.js` usa las carpetas reales de la tabla. Para actualizar: `git pull && pnpm install && pnpm build`.
