---
title: "Instalar max"
description: "Instala max, inicia sesión en MAX con un código QR y conecta tu agente de IA, con su ayuda o a mano."
---

En esta página conectarás tu cuenta de MAX a un agente de IA en tu ordenador. Después podrás pedirle que lea tus chats, busque mensajes y prepare respuestas. Necesitas unos cinco minutos y tu teléfono con la sesión de MAX iniciada.

## Los pasos

1. [Instala max](#install). max es un pequeño programa que da a tu agente acceso a tu cuenta de MAX. El agente puede instalarlo por ti, o puedes hacerlo a mano.
2. [Inicia sesión en MAX](#log-in). Escaneas un código QR con el teléfono. Así tu ordenador pasa a ser un dispositivo nuevo de tu cuenta.
3. [Conecta tu agente](#connect-agent). El agente recibe las instrucciones que necesita para usar max.
4. [Comprueba que funciona](#check). El agente muestra tu cuenta y algunos chats.

Si un paso no funciona, consulta las [preguntas y respuestas](#questions).

<a id="install" />

<a id="установить" />

<a id="обычный-способ" />

<a id="что-нужно" />

<a id="requirements" />

## 1. Instala max

Hay dos formas de instalarlo. El resultado es el mismo.

### Con tu agente

Usa un agente que pueda ejecutar programas en este ordenador, por ejemplo Claude Code, Codex, Cursor o Gemini CLI. Si solo usas un chat con el agente en el navegador o en el teléfono, sigue la guía [Conectar desde la web o el teléfono](/es/docs/browser-apps).

Copia esta petición en el chat con tu agente. Te ayudará a instalar la herramienta e iniciar sesión en tu ordenador.

```text prompt
Ayúdame a conectar mi cuenta de MAX a mi agente de IA en este ordenador.
Sigue https://wirecat.dev/es/docs/max/installation: comprueba los programas necesarios y ayúdame a instalar la herramienta.
Muéstrame los pasos de inicio de sesión para que yo confirme el acceso a mi cuenta.
Conecta las instrucciones de la herramienta a mi agente. Al final muestra mi cuenta y algunos chats. No envíes mensajes.
```

El agente te guía por estos pasos:

1. **Revisa tu ordenador.** max necesita Node.js 22.16 o posterior. Si falta, el agente te explica cómo instalarlo.
2. **Instala max.** En este paso tu cuenta no se toca.
3. **Inicia el acceso.** El agente ejecuta `max personal setup` en una ventana de terminal, y ahí aparece un código QR. Lo escaneas con el teléfono, como se explica en [Inicia sesión en MAX](#log-in). Si el agente no puede mostrarte esa ventana, te pedirá que ejecutes `max personal setup` tú mismo.
4. **Se conecta a max.** El agente instala para sí las instrucciones de max.
5. **Muestra el resultado.** Ves el nombre de tu cuenta y algunos chats. El agente no envía nada.

Tú confirmas el acceso, en tu teléfono. No pegues códigos ni contraseñas en el chat con el agente.

<a id="windows-одна-команда-установки" />

<a id="windows-one-command-installation" />

### A mano en un terminal

Abre Terminal en macOS o Linux, o PowerShell en Windows.

1. **Instala Node.js 22.16 o posterior** (22.x o 24+), o Bun 1.3+. Consulta [Node.js, npm y encontrar el comando](/es/docs/installation#nodejs).
2. **Instala max:**

   ```sh
   npm install -g @wirecat/max-cli
   ```

   En Windows puedes usar un solo comando. Instala max, lo añade a `PATH` (las carpetas donde el terminal busca comandos) y conecta todos los agentes compatibles:

   ```powershell
   & ([scriptblock]::Create((Invoke-RestMethod 'https://wirecat.dev/install.ps1'))) -Tool max -Agent all
   ```

3. **Comprueba la instalación:**

   ```sh
   max --version
   ```

   Verás un número de versión. Si el terminal dice que no encuentra el comando, consulta [max no se encuentra después de instalarlo](#q-not-found).

4. **Inicia el acceso:**

   ```sh
   max personal setup
   ```

   Continúa con el paso siguiente.

<a id="log-in" />

<a id="первый-запуск" />

<a id="первый-запуск-и-инструкция-для-агента" />

<a id="first-run" />

## 2. Inicia sesión en MAX

El acceso añade tu ordenador como un dispositivo nuevo de tu cuenta de MAX, igual que la aplicación de MAX para ordenador. Puedes ver ese dispositivo en MAX en el teléfono y quitarlo cuando quieras. El acceso no descarga el historial de chats.

`max personal setup` muestra el acceso. Lo inicia tu agente o lo ejecutas tú.

`personal` es el nombre de este acceso en tu ordenador, llamado perfil. Sirve cualquier nombre. Los comandos siguientes empiezan con el mismo nombre, por ejemplo `max personal doctor`.

1. Espera a que aparezca el código QR de acceso en el ordenador. Aparece en el terminal. Si la ventana es demasiado estrecha, setup abre el código en el navegador.
2. En el teléfono, abre MAX, entra en Ajustes → Dispositivos y elige escanear el QR. Permite el acceso a la cámara si se solicita.
3. Apunta el escáner al código del ordenador. Usa el código de acceso de setup, no el QR de tu perfil para compartir contactos. Confirma en MAX si te lo pide.
4. Si setup pide la contraseña adicional de tu cuenta, escribe la contraseña que configuraste en MAX. El terminal no muestra lo que escribes. Escríbela y pulsa Enter.
5. Espera a que setup confirme el acceso y revise tu cuenta y hasta cinco chats.

<a id="connect-agent" />

## 3. Conecta tu agente

El agente necesita instrucciones para usar max. Esas instrucciones se llaman skill. Setup pregunta qué agente usas e instala la skill para él. Una instalación global con npm ya instala la skill para todos los agentes compatibles.

Para instalarla de nuevo, o para otro agente:

```sh
max skill install --for all
```

Después abre una sesión nueva del agente para que cargue las instrucciones. Para otros agentes y aplicaciones MCP, consulta [Conectar el agente](/es/docs/agents).

<a id="check" />

## 4. Comprueba que funciona

Pide a tu agente:

```text prompt
Use max CLI. Muestra mi cuenta de MAX y mis cinco chats más recientes. No envíes nada.
```

Comprueba que el nombre y los chats son de la cuenta que querías conectar. Si es así, max está listo.

Setup no descarga todo el historial de chats. Para buscar mensajes antiguos, pide al agente que [descargue el historial que necesitas](/es/docs/max/archive).

A mano, `max personal doctor` muestra si has iniciado sesión y dónde guarda max sus archivos. No se conecta a MAX.

<a id="дальше" />

<a id="next-steps" />

**Siguiente:** [prueba tu primera tarea](/es/docs/first-tasks).

<a id="questions" />

## Preguntas y respuestas

<a id="q-qr" />

### El código QR no se escanea

**Con tu agente:** pide al agente que use el acceso por navegador. Se abre web.max.ru en una ventana de navegador aparte. Escanea su código QR, o elige el acceso por número de teléfono y completa los pasos de la página, incluido el CAPTCHA si aparece.

**A mano:** ejecuta uno de estos comandos:

```sh
max personal setup --method qr-chrome   # web.max.ru en una ventana de navegador aparte
max personal setup --method sms         # la misma ventana, con acceso por número de teléfono
```

El acceso por navegador necesita Chrome, Chromium, Edge o Brave. Los navegadores instalados como paquete snap no funcionan. La ventana usa un perfil temporal, no el tuyo, y se cierra tras el acceso.

### El código QR caducó o setup se detuvo

**Con tu agente:** pídele que ejecute setup otra vez y escanea el código nuevo.

**A mano:** vuelve a ejecutar `max personal setup`. Si ya iniciaste sesión, setup usa ese acceso y no vuelve a preguntar.

<a id="q-not-found" />

### max no se encuentra después de instalarlo

**Con tu agente:** reinicia el agente o pídele que abra un terminal nuevo. Un terminal que estaba abierto durante la instalación no ve el comando nuevo. En Windows, un agente en un terminal ya abierto debe actualizar su entorno y leer `max skill show` antes de iniciar sesión.

**A mano:** abre un terminal nuevo y vuelve a ejecutar `max --version`. Si sigue fallando, este comando explica por qué y qué ejecutar:

```sh
npx @wirecat/max-cli doctor
```

En Windows, npm a veces omite el paso que añade max a `PATH`. Ejecuta esta reparación en PowerShell. Conserva las demás entradas de `PATH`:

```powershell
$maxNpmPrefix = (npm.cmd prefix -g).Trim()
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$maxNpmPrefix\node_modules\@wirecat\max-cli\install\windows.ps1" -RepairOnly -Prefix $maxNpmPrefix
$env:Path = "$maxNpmPrefix;$env:Path"
max skill install --for all
max --version
```

### Tras actualizar, max dice que no se indicó un perfil

max nunca elige una cuenta por sí mismo: cada comando que usa tu cuenta empieza con el nombre del perfil.

**Con tu agente:** dile el nombre del perfil. Si configuraste max antes sin nombrar un perfil, se llama `default`.

**A mano:** escribe el nombre primero (`max default chats list`) o fíjalo una vez: `export MAX_PROFILE=default` en el perfil de tu shell, o `max config set defaultProfile default`. Si añadiste max a una aplicación MCP con `max mcp config`, vuelve a ejecutar ese comando.

### Tras actualizar, max se detiene y nombra dos archivos de mensajes

La actualización mueve una sola vez el archivo de mensajes a la carpeta WireCat. Si el sitio antiguo y el nuevo tienen copias distintas, max se detiene con el código 3 y nombra los dos archivos. Conserva el que necesitas, aparta el otro y vuelve a ejecutar el comando. No se ha movido ni cambiado nada.

### ¿Dónde escribo los códigos y las contraseñas?

En el terminal de configuración o en la página de web.max.ru, nunca en el chat con el agente. Si no encuentras la ventana del terminal, pide al agente que te la muestre.

### El agente no puede usar max después de la configuración

**Con tu agente:** abre una sesión nueva del agente para que cargue las instrucciones de max. Si sigue sin poder, consulta [Conectar el agente](/es/docs/agents).

**A mano:** instala la skill para tu agente, por ejemplo `max skill install --for claude`. Las opciones son `codex`, `cursor`, `claude`, `gemini` y `all`.

### Falta un chat o mensajes antiguos

Setup solo revisa algunos chats. Pide al agente que descargue el chat y el período que necesitas: consulta [Archivo local](/es/docs/max/archive). Un resultado de búsqueda vacío no significa que el chat no tenga esos mensajes.

### ¿Puedo probar max sin instalarlo?

Sí: `npx @wirecat/max-cli --help`. Así max se ejecuta una vez. No añade el comando `max` ni conecta tu agente.

### ¿Dónde se guarda el acceso?

En el almacén de contraseñas del sistema operativo (el llavero), no en un archivo. Si tu ordenador no tiene llavero, max guarda el acceso en un archivo junto a sus ajustes y te lo indica. Consulta [Seguridad](/es/docs/security).

<a id="files" />

<a id="куда-всё-ложится" />

## Dónde se guardan los archivos

| Qué | Linux y macOS | Windows |
| --- | --- | --- |
| Ajustes | `~/.config/max-cli/` | `%APPDATA%\max-cli\Config\` |
| Estado: perfiles, bots, registros de ejecución | `~/.local/share/max-cli/` | `%LOCALAPPDATA%\max-cli\Data\` |
| Caché | `~/.cache/max-cli/` | `%LOCALAPPDATA%\max-cli\Cache\` |
| Archivo local de mensajes, compartido con tg | `~/.local/share/WireCat/wirecat.db` | `%LOCALAPPDATA%\WireCat\Data\wirecat.db` |
| Modelos de reconocimiento de voz | `~/.local/share/WireCat/models/audio/` | `%LOCALAPPDATA%\WireCat\Data\models\audio\` |

`max personal doctor` muestra las rutas exactas en tu ordenador. `WIRECAT_STATE_DIR` mueve toda la carpeta WireCat; sustituye a `CLI_COMMON_CACHE_DIR`. Para cambiar estas carpetas u otros ajustes, consulta [Configuración](/es/docs/configuration) y la [referencia de ajustes de max](/es/docs/max/configuration).

La primera ejecución tras actualizar desde un max anterior mueve aquí una sola vez el archivo y los modelos, desde `~/.local/share/cli-messaging/` y `~/.cache/cli-common/models/`. Si ambos sitios tienen copias distintas, max se detiene y nombra los dos archivos: conserva uno y vuelve a ejecutarlo.

<a id="обновление" />

<a id="обновление-и-удаление" />

<a id="json-ответ-обновления" />

<a id="upgrade-json-response" />

## Actualizar

```sh
max upgrade           # usa el gestor de paquetes que instaló max: npm, pnpm o bun
max upgrade --check   # solo indica si hay una versión más nueva
```

Si actualizas desde una versión que guardaba los mensajes en `messages.db`, copia antes las notas o etiquetas que solo existen en tu ordenador: el archivo antiguo se borra al abrir el nuevo. `max personal messages sync --all` vuelve a descargar los mensajes, pero no las notas ni etiquetas locales.

Actualiza tg y memo junto con max: comparten el archivo de mensajes, y una herramienta antigua crearía un archivo nuevo en el sitio anterior.

max no se actualiza solo. Una vez al día comprueba si hay una versión nueva y lo indica en una línea del terminal. El acceso se conserva tras actualizar.

<a id="удаление" />

<a id="removal" />

## Desinstalar

Desinstalar max quita el comando, no tus datos. Cierra sesión antes, para que el acceso también se borre del llavero:

```sh
max personal server uninstall          # solo si instalaste el servicio en segundo plano
max personal session end               # cerrar sesión y olvidar el acceso
npm uninstall -g @wirecat/max-cli
rm -rf ~/.config/max-cli ~/.local/share/max-cli ~/.cache/max-cli
```

Si conectaste bots, ejecuta también `max <profile> bot auth remove` para cada perfil de bot. Borra `~/.local/share/WireCat/` solo si ninguna otra herramienta, como tg, necesita los mensajes guardados.

<a id="из-исходников" />

<a id="from-source" />

## Desde el código fuente

Instala desde el código fuente si cambias el código o quieres una versión que aún no se ha publicado.

```sh
git clone git@github.com:WireCatLabs/max-cli.git
cd max-cli
pnpm install
pnpm build
pnpm link --global      # el comando max queda disponible
```

Para ejecutarlo sin enlazar: `node dist/bin/max.js --help`. Para actualizar: `git pull && pnpm install && pnpm build`.
