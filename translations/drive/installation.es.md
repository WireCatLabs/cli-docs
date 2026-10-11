---
title: "Instalar y conectar"
---

Instala la herramienta de línea de comandos Drive, conecta una cuenta Google e importa una carpeta
pequeña para probar la búsqueda. Un **perfil** es el nombre que eliges para esa cuenta, como
`personal` o `work`; cada comando de cuenta debe indicarlo. Google abre el navegador para que
apruebes el acceso: no tienes que pegar tokens en la terminal ni en una conversación con el agente.

## Instalar la herramienta

La distribución actual se instala desde un repositorio de código fuente. Necesitas Git, pnpm y
Node.js 22.16+ de la rama 22.x o Node.js 24+. Abre una terminal donde se ejecuta tu agente:

```sh
git clone https://github.com/WireCatLabs/drive-cli.git
cd drive-cli
pnpm install --frozen-lockfile
pnpm build
npm install -g .
drive --help
```

El último comando debe mostrar la ayuda de Drive. Conserva el repositorio: el comando global
utiliza esa instalación. Para actualizar, ejecuta `git pull` allí y repite instalación y compilación.
En Windows, usa `npm.cmd` si PowerShell bloquea `npm.ps1`. Si lo instala un agente, pide:

```text prompt
Help me install drive CLI from https://github.com/WireCatLabs/drive-cli using its installation
instructions. Check Git, Node.js and pnpm. Ask me for the profile name and Google folder.
I will approve sign-in in my browser. Do not request tokens or credential contents in chat.
```

Consulta las [instrucciones oficiales del repositorio Drive](https://github.com/WireCatLabs/drive-cli/blob/main/docs/installation.md)
para instalar desde el código fuente y actualizar.

## Elegir cómo conectar

Con **la aplicación Google compartida de WireCat**, cada usuario aprueba su cuenta en el navegador;
solo el propietario configura Google Cloud. Esa es la conexión predeterminada prevista.
La distribución actual todavía no incluye la identidad de ese cliente: hoy necesitas el JSON
Desktop del propietario de la aplicación o crear uno siguiendo los pasos siguientes.

Si el propietario te entregó el JSON Desktop, omite la configuración Google Cloud y ve a
[conectar tu cuenta](#connect-your-account). El JSON identifica la aplicación; por sí solo no le
da acceso a tu cuenta. Ese permiso se concede por separado en el navegador.

## Preparar el acceso Google

Esta sección es para el propietario de la aplicación o quien elija crear su propio cliente OAuth.
Los usuarios de una aplicación compartida ya configurada no repiten estos pasos. Una clave API
Google o de cuenta de servicio no sustituye al cliente Desktop OAuth de este flujo.

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
| [Google Drive Activity API](https://console.cloud.google.com/apis/library/driveactivity.googleapis.com) | Historial de actores y actividad | Opcional `--activity`; habilítala para todas las funciones de la app compartida |

Habilitar una API la hace disponible para el proyecto; no concede acceso a ningún usuario.
El conector actual no utiliza las APIs Sheets, Slides, People ni Gmail.

### 2. Configurar la pantalla de consentimiento: Branding

Abre **☰ → Google Auth platform → Branding**, o utiliza
[este enlace directo](https://console.cloud.google.com/auth/branding). Branding define lo que
verán las personas cuando Google les pida aprobar tu aplicación.

Si la plataforma no está configurada, pulsa **Get Started**. Completa las pantallas con un nombre
(por ejemplo, WireCat Drive), un correo de soporte, audiencia **External** para cuentas fuera de
la organización Workspace y un correo de contacto. Completa el paso de políticas y crea la
configuración. Si ya existe, edita los campos en Branding. Para un lanzamiento público, el
propietario también prepara página principal, política de privacidad y dominios autorizados.
Esos datos de lanzamiento los configura el propietario, no cada usuario.

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
| `https://www.googleapis.com/auth/drive` | Crear/editar/gestionar en Google con `--write` |
| `https://www.googleapis.com/auth/drive.activity.readonly` | Historial opcional con `--activity` |
| `https://www.googleapis.com/auth/drive.apps.readonly` | Metadatos de aplicaciones Drive instaladas con `--apps` |

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

## Conectar tu cuenta

Elige el nombre de perfil y sustituye la ruta del archivo:

```sh
drive personal session start --client-file /absolute/path/to/wirecat-drive-desktop.json
drive personal session list --json
```

En el navegador, elige la cuenta prevista y revisa los permisos. Tras aprobar, la página de
callback confirma que se recibió el acceso y la terminal indica que `personal` está conectado.
La lista de sesiones muestra todos los perfiles sin imprimir tokens. Si Google bloquea el acceso
porque no eres usuario de prueba, añade esa cuenta exacta en Audience y repite. Un administrador
Workspace también puede restringir esta aplicación.

Los tokens se guardan en el llavero del sistema operativo. Si no está disponible, añade
`--credential-storage file` explícitamente para almacenamiento privado en archivo.
`--no-browser` imprime un enlace que puedes abrir en el mismo ordenador. Usa
`drive work session start ...` para otra cuenta. Ningún perfil de entorno o configuración se elige
automáticamente.

## Comprobar el primer resultado

Elige una carpeta pequeña con un Google Doc o archivo Markdown/TXT. Copia su URL del navegador
y sustituye `FOLDER_ID`:

```sh
drive personal folders add https://drive.google.com/drive/folders/FOLDER_ID
drive personal sync --json
drive personal status --json
drive personal documents list --json
drive personal search 'a word from your document' --exact --json
```

Comprueba que la lista contiene los documentos esperados, no quedan operaciones pendientes y
la búsqueda devuelve un pasaje y su enlace original. Repite sync si queda trabajo. Conectar
la cuenta no importa todo Drive. Sigue con [formatos y almacenamiento](./usage.md) o
[recetas](./recipes.md).
