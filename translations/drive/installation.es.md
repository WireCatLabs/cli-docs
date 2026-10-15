---
title: "Instalar y conectar"
---

Configura Drive en el ordenador donde tú o tu agente de IA lo usaréis. Al terminar, tendrás la
cuenta Google conectada y una carpeta pequeña guardada localmente para buscar sus documentos.
Drive es una herramienta de línea de comandos: puedes ejecutarla en una terminal o dejar que
lo haga tu agente.

Sigue tres pasos: [instalar Drive](#install-the-tool), [conectar Google](#connect-your-account)
y [importar y buscar en una carpeta](#check-your-first-result). ¿Ya está instalado? Empieza en el paso 2.
¿Ya has iniciado sesión? Empieza en el paso 3.

Necesitas una cuenta Google con acceso a la carpeta y un ordenador con Windows, macOS o Linux.
Usa el mismo ordenador para instalar, iniciar sesión en el navegador y ejecutar los comandos del
agente. El agente que ayude con la configuración necesita acceso a su terminal.

<a id="install-the-tool"></a>
<a id="install-yourself-or-ask-an-agent"></a>

## 1. Instalar Drive

**Elige una de las dos opciones de abajo.** Ambas instalan la misma herramienta; cuando funcione,
sigue con el paso 2. Instalar el paquete no inicia sesión en Google ni descarga archivos.

### Opción A: pedirlo al agente

Copia esta petición a tu agente con acceso a la terminal:

```text prompt
Use drive CLI. Instala @wirecat/drive-cli desde npm en este ordenador.
Comprueba primero Node.js y npm y ayúdame a instalar una versión compatible de Node.js si hace falta.
Comprueba que drive --version y drive --help funcionan y avísame de que la instalación está completa.
```

Cuando el agente confirme que el comando funciona, **omite la opción B y ve al
[paso 2](#connect-your-account)**. Tu agente puede ejecutar los comandos de los pasos 2 y 3;
tú eliges la cuenta Google y apruebas el acceso en el navegador.

### Opción B: instalar a mano

Abre Terminal en macOS/Linux o PowerShell en Windows. Si PowerShell bloquea `npm.ps1`, usa
`npm.cmd` en lugar de `npm` en los comandos de abajo. Comprueba Node.js y npm:

```sh
node --version
npm --version
```

Necesitas **Node.js 22.16+ dentro de 22.x, o Node.js 24+**. Si falta un comando o Node.js es más
antiguo, [instala Node.js](https://nodejs.org/en/download), reabre la terminal y comprueba de nuevo.
Node.js ejecuta Drive; npm descarga e instala su paquete.

Instala el paquete y compruébalo:

```sh
npm install -g @wirecat/drive-cli
drive --version
drive --help
```

Deben aparecer la versión y la ayuda con los comandos disponibles. El paquete npm está listo
para ejecutar; no hay que compilar fuentes. Si no encuentra `drive`, reabre la terminal o el
agente e inténtalo de nuevo;
consulta [problemas de instalación](./troubleshooting.md) si sigue fallando.

Cuando esas comprobaciones funcionen, sigue con el [paso 2](#connect-your-account).

<a id="choose-how-to-connect"></a>
<a id="connect-your-account"></a>

## 2. Conectar tu cuenta

**La aplicación Google de WireCat está lista para usar.** Esta opción no requiere crear un
proyecto Google Cloud ni descargar un archivo de credenciales. Cada usuario autoriza su propia
cuenta en el navegador.

Si prefieres tu propia aplicación Google, completa primero la [configuración opcional de la app](#prepare-google-sign-in).
Su último comando inicia el acceso con tu archivo de cliente y te devuelve a la aprobación en
el navegador de abajo. Si ya tienes ese archivo, ve directamente al [último paso de configuración](#sign-in-with-your-own-client).

### Iniciar sesión con la app de WireCat

Elige un **perfil**, un nombre local para esta cuenta. Los ejemplos usan `personal`; sustitúyelo
en toda la guía si prefieres otro, como `work`. Cada comando de cuenta indica un perfil.

Ejecuta este comando o pide al agente que lo haga. Mantén abierto el proceso de terminal mientras apruebas:

```sh
drive personal session start
```

### Aprobar el acceso en el navegador

1. En el navegador que se abre, elige la cuenta Google que quieres conectar.
2. Revisa los permisos solicitados y aprueba el acceso. La conexión predeterminada solicita
   solo lectura de Drive; no concede permiso para editar archivos Google.
3. Espera la confirmación del navegador y vuelve a la terminal. El acceso se completa cuando
   el comando muestra `signed_in: true` para `personal` y devuelve el indicador de la terminal.
   Aprobar en el navegador no es la comprobación final.

### Comprobar el perfil guardado

```sh
drive personal session list --json
```

Busca `personal` entre los perfiles. Esta lista muestra la configuración local sin imprimir
tokens; no contacta con Google ni comprueba si un acceso anterior sigue vigente. La importación
del paso 3 comprobará el acceso a la carpeta elegida. Sigue con el [paso 3](#check-your-first-result).

Si el navegador no se abre, repite el acceso con `--no-browser` y abre el enlace mostrado en el
mismo ordenador. Si el comando indica que no hay llavero, consulta [reparar la conexión](#connection-repairs)
abajo. No pegues tokens de acceso ni el contenido de credenciales en una conversación con el agente.

<a id="check-your-first-result"></a>

## 3. Importar y buscar en una carpeta

Elige una carpeta pequeña de Google Drive con un Google Doc o archivo Markdown/TXT cuyo texto
conozcas. Así es más fácil comprobar la importación y la búsqueda antes de añadir más archivos.
Iniciar sesión no importa todo tu Drive.

1. **Elige la carpeta.** Ábrela en Google Drive y copia su URL de la barra de direcciones.
   Sustituye el ejemplo de abajo por tu URL y ejecuta:

   ```sh
   drive personal folders add https://drive.google.com/drive/folders/FOLDER_ID
   ```

2. **Importa la carpeta elegida y sus subcarpetas.** Ejecuta estos comandos en orden:

   ```sh
   drive personal sync --json
   drive personal status --json
   drive personal documents list --json
   ```

   La lista debe incluir el documento esperado y el estado debe mostrar `pending: 0`.
   Si queda trabajo, ejecuta sync de nuevo. La importación guarda localmente contenido,
   metadatos y estructura de carpetas; no edita archivos Google. Consulta [formatos y almacenamiento](./usage.md)
   para saber qué aporta cada formato.

3. **Busca una palabra conocida.** Sustituye `budget` por una palabra del documento importado:

   ```sh
   drive personal search 'budget' --exact --json
   ```

   La búsqueda debe devolver un pasaje y su enlace original. Esta primera búsqueda usa el texto
   guardado en este ordenador. Si no devuelve nada, comprueba la lista de
   documentos y el trabajo pendiente antes de elegir otra palabra; consulta [resultados ausentes](./troubleshooting.md).

Ya tienes una conexión que funciona y una carpeta local en la que puedes buscar. Sigue con
[recetas para tu agente](./recipes.md) o [leer y organizar documentos guardados](./usage.md).
Las secciones de abajo son configuración opcional y mantenimiento, no más pasos de esta primera importación.

## Reparar la conexión

Las credenciales suelen guardarse en el llavero del sistema operativo, su almacén privado de
contraseñas. Si no está disponible, añade `--credential-storage file` al comando de acceso para
seleccionar almacenamiento privado en archivo. Para otra cuenta, repite el paso 2 con otro perfil, como `work`.

Si Google bloquea el acceso, revisa el error mostrado y las políticas del administrador Workspace.
Para tu propia app en Testing, asegúrate de que la cuenta sea un usuario de prueba. Consulta
[problemas de conexión](./troubleshooting.md) según el síntoma; la app predeterminada no requiere
que edites un proyecto Google Cloud.

<a id="prepare-google-sign-in"></a>

## Opcional: tu propia app Google

Usa esta opción solo si quieres iniciar sesión mediante una aplicación que controles. Una app
Google es el registro que pide permisos; es distinta de tu cuenta Google. Su JSON de cliente
Desktop identifica la app y tu aprobación en el navegador concede acceso a la cuenta.
Una clave API o de cuenta de servicio no sustituye a este archivo.

Abre los pasos de abajo o ve a [iniciar sesión con tu cliente](#sign-in-with-your-own-client)
si ya descargaste el JSON del cliente Desktop.

<details id="custom-google-app">
<summary>Mostrar los pasos de configuración Google Cloud</summary>

### 1. Elegir el proyecto y habilitar APIs

Abre [Google Cloud Console](https://console.cloud.google.com/). En el selector de proyectos de la
barra superior, elige tu proyecto o pulsa **New Project**, escribe un nombre y créalo.
Mantén seleccionado el mismo proyecto en todas las pantallas siguientes.

Si ya habilitaste las APIs, sigue con Branding. Si no, abre **☰ → APIs & Services → Library**.
Busca cada API, abre su página y pulsa **Enable**. Comprueba **Enabled APIs & services**:

| API | Qué permite | Cuándo hace falta |
| --- | --- | --- |
| [Google Drive API](https://console.cloud.google.com/apis/library/drive.googleapis.com) | Carpetas, archivos, exportación, comentarios, revisiones y permisos | Siempre |
| [Google Docs API](https://console.cloud.google.com/apis/library/docs.googleapis.com) | Leer todas las pestañas y crear/editar Docs nativos | Siempre |
| [Google Drive Activity API](https://console.cloud.google.com/apis/library/driveactivity.googleapis.com) | Historial de actores y actividad | Opcional `--grant activity`; habilítala para todas las funciones de la app compartida |

Habilitar una API la hace disponible para el proyecto; no concede acceso a ningún usuario.
El conector actual no utiliza las APIs Sheets, Slides, People ni Gmail.

### 2. Configurar la pantalla de consentimiento: Branding

Abre **☰ → Google Auth platform → Branding**, o utiliza
[este enlace directo](https://console.cloud.google.com/auth/branding). Branding define lo que
verán las personas cuando Google les pida aprobar tu aplicación.

Si la plataforma no está configurada, pulsa **Get Started**. Completa las pantallas con un nombre
(por ejemplo, Personal Drive), un correo de soporte, audiencia **External** para cuentas fuera de
la organización Workspace y un correo de contacto. Completa el paso de políticas y crea la
configuración. Si ya existe, edita los campos en Branding. Usa un nombre y datos de contacto de tu propia app. La distribución pública y los requisitos de
verificación Google son tareas separadas de esta configuración personal; sigue la guía oficial
si publicas para otros usuarios. No necesitas configurar los dominios ni la marca de WireCat
para conectar mediante su aplicación existente.

La [guía oficial de consentimiento Google](https://developers.google.com/workspace/guides/configure-oauth-consent)
explica Branding, Audience y Data Access.

### 3. Permitir que tu cuenta pruebe la aplicación

Abre **Google Auth platform → Audience**
([enlace directo](https://console.cloud.google.com/auth/audience)). Para una app External en
Testing, pulsa **Test users → Add users**, introduce la cuenta que conectarás y guarda.
Testing basta para la primera prueba. Publicar para usuarios generales es otra tarea del propietario.
Los permisos de Testing suelen caducar a los siete días; vuelve a conectar cuando Google lo pida.

### 4. Declarar los permisos

Abre **Google Auth platform → Data Access**
([enlace directo](https://console.cloud.google.com/auth/scopes)). Pulsa **Add or Remove Scopes**,
selecciona los permisos necesarios de abajo y actualiza/guarda. Si no aparecen en la tabla,
utiliza el campo de introducción manual de scopes.

| Permiso | Uso en el CLI |
| --- | --- |
| `https://www.googleapis.com/auth/drive.readonly` | Importación y lectura predeterminadas |
| `https://www.googleapis.com/auth/drive` | Crear/editar/gestionar en Google con `--grant write` |
| `https://www.googleapis.com/auth/drive.activity.readonly` | Historial opcional con `--grant activity` |
| `https://www.googleapis.com/auth/drive.apps.readonly` | Metadatos de aplicaciones Drive instaladas con `--grant apps` |

Para una prueba personal de lectura basta el primer scope. La app compartida debe declarar también
los permisos opcionales que ofrecerá; el CLI solo los solicita con sus opciones. Los métodos
actuales aceptan estos permisos Drive y no necesitan un scope Docs separado. Elegir carpetas
limita la importación local; el permiso Google de lectura cubre el Drive de la cuenta.
Consulta los [scopes de Drive](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
y los [scopes de Docs](https://developers.google.com/workspace/docs/api/auth).

### 5. Crear el cliente Desktop y descargar su JSON

Abre **Google Auth platform → Clients**
([enlace directo](https://console.cloud.google.com/auth/clients)). Pulsa **Create Client**, elige
**Application type → Desktop app**, escribe un nombre reconocible y pulsa **Create**.

Usa **Download JSON** en el diálogo del cliente creado. Si lo cerraste, vuelve a Clients, abre
el cliente Desktop y utiliza su control de descarga JSON. El archivo suele empezar por
`client_secret_`. Guárdalo fuera del repositorio y apunta la ruta completa, por ejemplo
`/home/YOUR_USER/Downloads/client_secret_…json`. Puedes renombrarlo a
`wirecat-drive-desktop.json` para usar una ruta más sencilla.

El cliente Desktop utiliza el callback temporal localhost del CLI. No crees un cliente Web
application ni añadas una URL de redirección web para este flujo. Consulta las
[instrucciones oficiales Desktop OAuth](https://developers.google.com/workspace/guides/create-credentials#desktop-app).
El JSON descargado tiene una sección `installed` que identifica la aplicación. No es tu token de
acceso. Dale al agente solo la ruta, no el contenido.

### Iniciar sesión con tu cliente

Sustituye la ruta por la ruta completa de tu JSON descargado. Elige el nombre de perfil como en
el paso 2 y ejecuta:

```sh
drive personal session start --client-file /absolute/path/to/desktop-client.json
```

Vuelve a [Conectar tu cuenta](#connect-your-account) desde
[Aprobar el acceso en el navegador](#approve-access-in-your-browser), comprueba el perfil guardado
y sigue el paso 3. Ahora has utilizado tu app en lugar de la app de WireCat.

</details>

## Otras opciones de instalación

Son alternativas al npm de la opción B, no pasos adicionales. Si ya usas pnpm, instala con:

```sh
pnpm add -g @wirecat/drive-cli
```

Si ya usas Bun como gestor de paquetes, instala con:

```sh
bun add -g @wirecat/drive-cli
```

Después comprueba `drive --version` y `drive --help` y sigue con el paso 2. Para consultar la
ayuda sin una instalación global, usa `npx @wirecat/drive-cli --help`; los pasos anteriores suponen una instalación global.

La [guía oficial de instalación del repositorio](https://github.com/WireCatLabs/drive-cli/blob/main/docs/installation.md)
es la fuente de estas instrucciones.

## Actualizar o quitar

Estos comandos son para una instalación existente. Para actualizar:

```sh
npm install -g @wirecat/drive-cli
drive --version
```

Para cerrar la sesión de un perfil, ejecuta `drive personal session end`. Para quitar el comando:

```sh
npm uninstall -g @wirecat/drive-cli
```

Cerrar sesión o desinstalar conserva la configuración local y los datos importados. Consulta
[dónde están los archivos](./configuration.md#where-the-files-live) antes de moverlos o borrarlos.
