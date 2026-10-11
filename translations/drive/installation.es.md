---
title: "Instalar y conectar"
---

Instala Drive donde se ejecuta tu agente, conecta la cuenta de Google elegida y comprueba la
conexión antes de importar. **Drive se instala actualmente desde el código fuente**; no hay
paquete npm publicado ni identidad de aplicación de Google incluida.

## Instalar la herramienta

Necesitas Git, Node.js 22.16+ de la rama 22.x o Node.js 24+, y pnpm. Pide ayuda a tu agente con terminal:

```text prompt
Help me install WireCat Drive from https://github.com/WireCatLabs/drive-cli.
Follow its installation guide, check Git, Node.js and pnpm, and build the tool.
Check drive --help. Ask me which Google account and folder I want to connect.
I will enter consent in my browser; do not ask me to paste tokens into chat.
```

O abre una terminal y ejecuta:

```sh
git clone https://github.com/WireCatLabs/drive-cli.git
cd drive-cli
pnpm install --frozen-lockfile
pnpm build
npm install -g .
drive --help
```

Conserva el repositorio local: el comando global utiliza esta instalación. Para actualizar,
ejecuta `git pull` allí y repite la instalación de dependencias y compilación. En Windows usa
`npm.cmd` si PowerShell bloquea `npm.ps1`.

## Preparar el acceso a Google

La instalación actual necesita un **JSON de cliente Desktop OAuth**. Identifica la aplicación
ante Google; tú autorizas por separado el acceso a tu cuenta en el navegador.

1. Crea o elige un proyecto en [Google Cloud Console](https://console.cloud.google.com/).
2. Habilita **Google Drive API** y **Google Docs API**.
3. Abre **Google Auth platform**. Configura Branding y Audience. Si la aplicación External está
   en Testing, añade tu cuenta de Google como usuario de prueba.
4. En Data Access añade `https://www.googleapis.com/auth/drive.readonly`.
5. En Clients crea un cliente **Desktop app** y descarga su JSON. Guárdalo fuera de repositorios.

Las guías de Google sobre [credenciales](https://developers.google.com/workspace/guides/create-credentials)
y [consentimiento](https://developers.google.com/workspace/guides/configure-oauth-consent)
explican la configuración. Da al agente la ruta local, no el contenido del archivo.

## Conectar tu cuenta

Sustituye la ruta por la del archivo descargado:

```sh
drive session start --client-file /path/to/desktop-client.json
drive session list --json
```

Elige tu cuenta y autoriza el acceso en el navegador. El resultado vuelve a la herramienta en
el mismo ordenador. Los tokens se guardan por defecto en el llavero del sistema. Si no está
disponible, añade explícitamente `--credential-storage file` para usar un archivo local privado.

Usa `drive --profile work session start --client-file /path/to/desktop-client.json` para otra
cuenta y conserva el perfil en los siguientes comandos de esa cuenta. Los permisos External Testing
suelen caducar a los siete días: vuelve a conectar cuando Google lo solicite.

Comprueba la cuenta añadiendo una carpeta conocida y revisando las fuentes según
[uso diario](./usage.md). Iniciar sesión no importa todo tu Drive.
