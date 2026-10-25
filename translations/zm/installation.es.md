---
title: "Instalar y conectar Zoom"
---

Da a tu agente de IA acceso a las transcripciones de Zoom guardadas para encontrar lo hablado y
mostrar los pasajes que respaldan una respuesta. Puedes configurarlo con tu agente o ejecutar
los comandos. Si ya tienes transcripciones, empieza sin crear una aplicación de Zoom ni iniciar sesión.

## Los pasos

1. [Instala la herramienta](#install) en el ordenador donde funciona el agente.
2. [Elige la fuente](#choose-how-to-connect): tu cuenta de Zoom o transcripciones descargadas.
3. [Conecta el agente](#give-your-agent-access) para que conozca los comandos.
4. [Comprueba una reunión](#check-your-first-result) y lee un pasaje que respalde el resultado.

¿Ya tienes reuniones guardadas? Ve directamente a [búsqueda y fuentes](./search.md).

## Configura con tu agente

Usa un agente que ejecute comandos en este ordenador, como Codex, Claude Code, Cursor o Gemini
CLI. Copia esta petición en su chat:

```text prompt
Use zm CLI: ayúdame a conectar transcripciones de Zoom con mi agente de IA en este ordenador.
Sigue https://wirecat.dev/es/docs/zm/installation y comprueba los programas necesarios antes de instalar.
Pregunta si quiero conectar mi cuenta de Zoom o importar transcripciones que ya tengo.
Si elijo Zoom, ayúdame a usar mi aplicación o crear una y encontrar su Public Client ID.
Yo aprobaré el acceso en el navegador; no me pidas tokens ni códigos de callback en este chat.
Instala las instrucciones para mi agente, busca una reunión guardada y muestra un pasaje citado.
Explica qué datos faltan. No crees ni cambies reuniones remotas.
```

El agente prepara la herramienta y comprueba resultados. Tú eliges la aplicación y la cuenta,
apruebas el consentimiento de Zoom y completas la respuesta de acceso si hace falta. Si el agente
no puede mantener abierta una terminal interactiva, ejecuta [Primer uso](#first-run) y vuelve a él.
Para un agente sin terminal, consulta [MCP y skills](./mcp.md).

## Qué necesitas

- **Node.js 22.16 o posterior dentro de 22.x, o Node.js 24 o posterior**, con npm. Comprueba
  `node --version` y `npm --version` en Terminal de macOS/Linux o PowerShell de Windows.
  Si falta alguno, instala Node.js desde [nodejs.org](https://nodejs.org/en/download), abre otra
  terminal y comprueba de nuevo. La herramienta también funciona con Bun.
- Espacio para las reuniones que guardes en este ordenador. Una herramienta instalada en un
  servidor usa los archivos y el acceso del servidor, no los del portátil.
- **Para acceder a Zoom:** una cuenta autorizada para añadir la aplicación y un almacén de
  contraseñas del sistema: Keychain en macOS, Credential Manager en Windows o un servicio de
  secretos del escritorio en Linux. La organización puede exigir aprobación del administrador.
  Antes de iniciar sesión, ejecuta `zm doctor --json` y revisa `authentication.keyring`: prueba y elimina
  una entrada temporal sin leer accesos guardados. Un servidor sin ese almacén no guarda el acceso;
  importar archivos no lo necesita.

## Instalar

```sh
npm install -g @wirecat/zoom-cli
zm --version
zm doctor
```

Debes ver un número de versión y resultados del diagnóstico local. Ninguno inicia sesión ni
lee reuniones. El paquete es `@wirecat/zoom-cli`; el comando corto que usarás es `zm`.

En Windows, si PowerShell bloquea `npm.ps1` o `zm.ps1`, usa los lanzadores:

```powershell
npm.cmd install -g @wirecat/zoom-cli
zm.cmd --version
zm.cmd doctor
```

Usa `zm.cmd` en los demás ejemplos si tu terminal lo requiere. No necesitas cambiar la política
de ejecución de PowerShell. Si no encuentra el comando, abre otra terminal y comprueba que la
carpeta global de comandos de npm esté en PATH, las carpetas donde busca programas. Reinicia
un agente que ya estuviera abierto si no ve el nuevo comando.

## Elige cómo conectar

zm no incluye un client ID y no hay una app de WireCat disponible para otras cuentas de Zoom.
Usa tu propia General app de Zoom o una app de equipo que un compañero haya compartido con tu cuenta.

| Tu punto de partida | Qué hacer |
|---|---|
| Ya creaste una aplicación de Zoom | [Abre sus credenciales](./zoom-app.md#use-an-app-you-already-created), activa Public Client OAuth y copia el **Public Client ID** |
| Un compañero compartió una app de equipo con tu cuenta de Zoom | Pide su **Public Client ID** al propietario y confirma que tu usuario pueda autorizarla; [usa la app compartida](./zoom-app.md#use-a-wirecat-or-team-app) |
| Necesitas una aplicación | [Crea una General app con User-managed](./zoom-app.md#create-your-own-app), configura la respuesta y los permisos, y vuelve aquí |
| Tienes archivos de transcripciones | [Importa sin aplicación de Zoom](#import-without-a-zoom-app) y omite el acceso del navegador |

**No hay archivo de credenciales que descargar.** La aplicación de Zoom registra los permisos que
puede pedir la herramienta. Es distinta de tu cuenta y de la aplicación para llamadas. Dentro de
ella activa **Use Public Client OAuth** y copia el **Public Client ID**. No uses el Client ID
normal ni el Client Secret. No crees otro cliente OAuth fuera de la aplicación.

Antes de iniciar sesión, revisa el mismo entorno Development o Production al que pertenece ese ID:

| Ajuste | Valor necesario |
|---|---|
| Tipo de aplicación / gestión | General app / User-managed |
| Use Public Client OAuth | Activado |
| OAuth Redirect URL y OAuth Allow Lists | Ambos incluyen exactamente `https://wirecat.dev/zoom-callback` |
| Scopes | Los cinco [permisos de lectura de reuniones del anfitrión](./zoom-app.md#what-the-manifest-asks-for) para sincronizar |

La [guía de la aplicación](./zoom-app.md) explica los pasos del Marketplace y el acceso a grabaciones.
Instalar `zm` no elige una aplicación compartida. Una aplicación en desarrollo puede estar limitada
a la cuenta de su creador; el ID por sí solo no da acceso a reuniones de otra persona.

## Primer uso

Sustituye `<public-client-id>` por el Public Client ID de la aplicación, sin los signos angulares.
Ejecuta los comandos de uno en uno en una terminal normal. Déjala abierta mientras apruebas en el navegador:

```sh
zm config set zoom.client_id <public-client-id>
zm config set source api
zm personal session start
```

1. Inicia sesión en la cuenta de Zoom cuyas reuniones organizadas quieres recuperar y revisa los permisos.
2. Elige **Allow**. Zoom abre la página de respuesta de WireCat, que entrega la autorización
   a la herramienta que espera en este ordenador.
3. Vuelve a la terminal. El éxito es `logged_in: true` seguido del indicador de la terminal.
   Aprobar solo en el navegador no termina el acceso de la herramienta.
4. Si sigue esperando, copia `code=…&state=…` o la URL completa de respuesta y pégala en
   **esa misma terminal que espera**. Pulsa Enter. No la pegues en el chat del agente ni la
   ejecutes como comando. Tras el plazo de cinco minutos, inicia un nuevo intento.

La primera palabra, `personal`, es el **perfil**: este acceso y sus reuniones guardadas. Recupera un periodo pequeño:

```sh
zm personal session status --json
zm personal meetings sync --lookback-days 7
zm personal meetings list --json
```

El estado debe mostrar credenciales guardadas con `state: saved`; no contacta con Zoom para
comprobar si el acceso sigue siendo válido. Sync hace las peticiones remotas y guarda los datos
disponibles de reuniones del anfitrión. List lee la copia local. Otro usuario de Zoom es otro perfil, con su propio acceso. Consulta [sesiones y perfiles](./sessions.md#select-a-local-profile).

Si la lista está vacía, comprueba la cuenta, las fechas y [la disponibilidad de grabaciones y transcripciones](./zoom-app.md#before-your-first-zm-meetings-sync).
Una reunión organizada por otra persona nunca llega mediante sync: la API de Zoom enumera las reuniones
que programó tu usuario y no tiene una lista de las reuniones a las que solo asististe. Pide al anfitrión
el archivo de transcripción `.vtt` e [impórtalo](#import-without-a-zoom-app); se incorpora al mismo almacén,
búsqueda y revisión que una reunión sincronizada. Un error de permiso indica cuál falta; guarda el cambio
en la app y autoriza de nuevo.

## Importar sin una aplicación de Zoom

Usa un `.vtt` descargado con permiso o proporcionado por el anfitrión. Nombra el archivo, por ejemplo,
`2026-10-01_1000_example-planning.vtt` y guárdalo directamente en una carpeta. El nombre aporta la fecha, la
hora y el título; el ajuste de zona horaria determina cómo se interpreta la hora:

```sh
zm config set files.timezone Europe/Madrid
zm personal meetings import ./downloaded-transcripts
zm personal meetings list --json
```

Usa tu carpeta y zona horaria. La importación no recorre subcarpetas ni deduce asistentes a partir
de los nombres de quienes hablan. No necesita aplicación, acceso del navegador ni token OAuth.
Consulta [transcripciones descargadas](./archive.md#downloaded-transcripts) para nombres compatibles
e historial de correcciones.

## Da acceso al agente

Un **skill** es el conjunto de instrucciones para un agente con terminal:

```sh
zm skill install --for agents
```

Instala instrucciones para Codex/Gemini. Para Claude Code usa `--for claude`; sin `--for` instala
ambas variantes. Las instrucciones no autorizan Zoom ni recuperan reuniones. Para un agente que
use MCP, sigue [MCP y skills](./mcp.md); los permisos del perfil limitan sus comandos de lectura y escritura.

## Comprueba el primer resultado

Usa un ID devuelto por la lista, sustituyendo `<meeting-id>` sin los signos angulares:

```sh
zm personal meetings show <meeting-id> --json
zm personal meetings transcript <meeting-id> --json
```

Debes ver la reunión guardada y las transcripciones que Zoom proporcionó o importaste. Una reunión
puede existir sin texto; el permiso por sí solo no lo crea. Pide al agente:

```text prompt
Use zm CLI: busca la reunión que acabo de importar o recuperar.
Muestra la fecha, los participantes realmente registrados, una decisión y el pasaje que la respalda.
Si ninguna decisión está respaldada, dilo. Indica si faltan la transcripción o los datos de participantes.
```

Una respuesta útil muestra una referencia, las palabras que la respaldan y la información ausente.
Si falta la transcripción o el acceso no termina, consulta [solución de problemas](./troubleshooting.md).
Cuando funcione, [busca un tema y lee el contexto de sus fuentes](./search.md).

## Dónde se guardan los archivos

| Qué | Linux y macOS | Windows |
|---|---|---|
| ajustes (`config.json`) | `~/.config/zm/` | `%APPDATA%\zm\Config\` |
| estado (ejecuciones registradas en `runs/`) | `~/.local/share/zm/` | `%LOCALAPPDATA%\zm\Data\` |
| caché | `~/.cache/zm/` | `%LOCALAPPDATA%\zm\Cache\` |
| el almacén local | `~/.local/share/WireCat/wirecat.db` | `%LOCALAPPDATA%\WireCat\Data\wirecat.db` |

`config.json` guarda ajustes públicos; no es un archivo de credenciales descargado. `zm doctor --json`
muestra su ubicación. Los tokens de acceso quedan en el almacén de contraseñas del sistema. Las grabaciones
se descargan en el destino elegido. `ZM_CONFIG_DIR` cambia la configuración y su servicio de claves;
`MESSAGING_STORE` elige otra base de datos. Consulta [configuración](./configuration.md).

## Actualizar o quitar la herramienta

Actualiza con el mismo comando y comprueba la versión:

```sh
npm install -g @wirecat/zoom-cli
zm --version
```

Si iniciaste sesión por última vez con zm 0.34 o anterior, vuelve a ejecutar `zm <profile> session start`: ese acceso antiguo ya no se usa.

Para quitar el comando:

```sh
npm uninstall -g @wirecat/zoom-cli
```

La desinstalación quita solo el paquete. Para quitar todo lo demás, borra:

- los directorios de ajustes, estado y caché: `~/.config/zm`, `~/.local/share/zm` y `~/.cache/zm` en Linux y
  macOS; `%APPDATA%\zm` y `%LOCALAPPDATA%\zm` en Windows;
- las carpetas del skill del agente, si lo instalaste: `~/.claude/skills/zoom-cli` y
  `~/.agents/skills/zoom-cli` (`%USERPROFILE%\.claude\skills\zoom-cli` y
  `%USERPROFILE%\.agents\skills\zoom-cli` en Windows);
- la entrada de acceso en tu almacén de contraseñas, descrita en [sesiones](./sessions.md#remove-access);
- la base de reuniones compartida y tus carpetas de grabaciones, solo si quieres borrar las reuniones guardadas.
  Otras herramientas de WireCat usan la misma base.

Revoca el acceso de la aplicación en Zoom Marketplace si también quieres retirar su autorización.
Usa los lanzadores `.cmd` en Windows si hace falta.

## Completar comandos en la terminal

`zm complete -- <words...>` responde a peticiones de autocompletado; no lo instala en tu terminal.
`zm commands` enumera todos los comandos por sección; `zm commands --json` añade las opciones para agentes
y scripts.

Tras instalar, [busca un pasaje de reunión](./search.md) y comprueba la fuente antes de guardar conclusiones.
