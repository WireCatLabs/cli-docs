---
title: "Instalación"
---

Instala la herramienta Zoom en el equipo donde trabaja tu agente, conecta la cuenta y obtén una
primera reunión. El paquete es `@wirecat/zoom-cli` y la orden, `zm`. Puedes reutilizar una app
configurada, crear la tuya o importar texto sin app ni login.

## Requisitos

- **Node.js 22.16 o posterior en 22.x, o Node.js 24 o posterior**, con npm. También funciona con Bun.
  Instala Node.js desde [nodejs.org](https://nodejs.org/en/download) si falta `node --version`.
- Linux, macOS o Windows. Abre un terminal de ese equipo para las órdenes siguientes.
- Para login API, un almacén de contraseñas operativo. macOS usa Keychain, Windows Credential Manager
  y Linux necesita un servicio de secretos de escritorio accesible. Un servidor sin él no puede guardar
  la sesión; sigue disponible importar archivos.
- Una cuenta Zoom autorizada a instalar la app. Tu organización puede exigir aprobación del administrador.

## Instalar

```sh
npm install -g @wirecat/zoom-cli
zm --version
zm --help
zm doctor
```

Versión y ayuda aparecen sin login. Doctor comprueba entorno y ajustes públicos sin contactar con
Zoom ni abrir la base. Si falta `zm`, vuelve a abrir el terminal y comprueba que el directorio global
de ejecutables npm esté en PATH, la lista de carpetas donde se buscan órdenes.

## Elige cómo conectar

| Situación inicial | Siguiente acción |
|---|---|
| Ya creaste una app Zoom | Abre credenciales, activa Public Client OAuth y copia **Public Client ID**; revisa la lista inferior |
| Tu equipo facilita una app, incluida WireCat | Obtén **Public Client ID** del dueño y confirma que tu usuario puede autorizarla; sigue el mismo login |
| Necesitas una app | [Crea la tuya](./zoom-app.md#create-your-own-app) y vuelve con el Public Client ID |
| Solo tienes transcripciones | Omite el login y usa [importación sin app](#import-without-a-zoom-app) |

Una app Zoom es un registro de permisos en Marketplace, distinto de tu cuenta y la aplicación de
llamadas. No hay archivo de credenciales: configura Public Client ID y autoriza tu cuenta en el navegador. `zm` necesita un ID explícito; instalarlo no selecciona una app. Una app en desarrollo
puede estar limitada a la cuenta del desarrollador. Un ID solo no da acceso a datos ajenos.

Antes del login, el dueño comprueba ajustes en el mismo entorno Development o Production que el ID elegido:

| Ajuste | Valor necesario |
|---|---|
| Tipo / gestión | General app / User-managed |
| Use Public Client OAuth | Activado; copia **Public Client ID**, no Client ID normal ni Client Secret |
| OAuth Redirect URL | `https://wirecat.dev/zoom-callback` |
| OAuth Allow Lists | Incluye `https://wirecat.dev/zoom-callback` |
| Scopes | [Permisos de lectura](./zoom-app.md#what-the-manifest-asks-for); archivo/gestión solo para esas tareas |

## Primera ejecución

Sustituye `<public-client-id>` por el valor copiado sin signos angulares. Ejecuta una orden cada vez;
mantén abierto el terminal mientras apruebas en el navegador:

```sh
zm config set zoom.clientId <public-client-id>
zm config set source api
zm login
```

1. Entra en la cuenta correcta en el navegador y revisa los permisos.
2. Pulsa **Allow**. Zoom abre el retorno WireCat, que envía la autorización al proceso `zm` esperando.
3. Vuelve al terminal. El login termina cuando `zm` informa `loggedIn: true` y vuelve al indicador.
   Aprobar en el navegador solo no basta.
4. Si espera, copia `code=…&state=…` o la URL completa, pégalo en ese mismo terminal y pulsa Enter
   antes del límite de cinco minutos. Si ya terminó, ejecuta `zm login` otra vez y aprueba el intento nuevo.

Comprueba la sesión guardada y elige un **perfil**, una etiqueta local de las reuniones:

```sh
zm session status --json
zm config set account.profile personal
zm pull --lookback-days 7
zm meetings list --json
```

La sesión debe informar `loggedIn: true`. La obtención guarda reuniones disponibles del anfitrión;
la lista devuelve sus ID locales. Abre una con el ID de esa lista:

```sh
zm meetings show <meeting-id> --json
zm meetings transcript <meeting-id> --json
```

La lista puede estar vacía si no hay reuniones disponibles del anfitrión en ese periodo. Texto vacío
significa que Zoom no lo proporcionó; el permiso no lo crea. Revisa [retención](./zoom-app.md#before-your-first-zm-pull)
y descarga un periodo anterior si hace falta. El error de scope nombra el permiso; autoriza otra vez
tras añadirlo el dueño.

Un perfil local no cambia la cuenta elegida en el navegador. Para separar cuentas, consulta
[sesiones](./sessions.md#select-a-local-profile), y si no termina la aprobación,
[recuperación del login](./troubleshooting.md#login).

## Importar sin una app Zoom

Usa un VTT que tengas permiso de descargar o un archivo del anfitrión. Ponlo en una carpeta y nómbralo
por fecha, hora y título, por ejemplo `2026-10-01_1000_example-planning.vtt`. La hora del nombre se
interpreta en la zona configurada:

```sh
zm config set account.profile personal
zm config set files.timezone Europe/Madrid
zm import ./downloaded-transcripts
zm meetings list --json
```

No necesitas app, login ni token OAuth. La importación lee archivos `.vtt` normales directamente en
la carpeta, sin recursión ni deducir asistentes por nombres. Consulta [transcripciones descargadas](./archive.md#downloaded-transcripts).

## Da acceso a tu agente

Tras guardar la primera reunión, instala las instrucciones para un agente de terminal:

```sh
zm skill install --for agents
```

Se elige el directorio Codex/Gemini; usa `--for claude` para Claude Code u omite `--for` para ambos.
Para una app con MCP, consulta [MCP e instrucciones](./mcp.md). Prueba a pedir:

```text prompt
Busca la reunión que acabo de importar o descargar. Muestra fecha, discusión principal y un pasaje que la apoye. Indica si falta texto o información de participantes.
```

## Dónde se guardan los archivos

La herramienta crea `config.json` público al configurar; no es un archivo de credenciales descargado. `zm doctor --json` muestra su ubicación. La configuración usa el directorio de aplicaciones de tu plataforma. `ZM_CONFIG_DIR` elige otro
y cambia el servicio del almacén de login. Las reuniones usan `wirecat.db` compartida;
`MESSAGING_STORE` elige otra base. Las grabaciones van solo al destino indicado. Consulta [configuración](./configuration.md).

## Actualizar o quitar la herramienta

```sh
npm install -g @wirecat/zoom-cli
zm --version
```

Para quitar la orden:

```sh
npm uninstall -g @wirecat/zoom-cli
```

Desinstalar el paquete no borra la base compartida ni carpetas de grabaciones. Revoca acceso en
Marketplace si quieres retirar la autorización. No existe orden de logout; [sesiones](./sessions.md#remove-access)
explica los controles disponibles.

## Completar comandos

`zm complete -- <words...>` responde a peticiones de completado, pero no lo instala en el intérprete.
`zm commands --json` enumera órdenes y opciones para agentes y scripts.

Cuando veas la primera reunión, [busca su texto y conserva referencias](./search.md).
