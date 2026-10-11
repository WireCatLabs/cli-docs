---
title: "Instalar y conectar"
---

Instala la herramienta Drive, conecta una cuenta de Google e importa una carpeta pequeña para
comprobar la búsqueda. Un **perfil** es el nombre elegido para la cuenta, como `personal` o `work`;
cada comando de cuenta debe indicarlo. Google abre el navegador para tu consentimiento, así que
no pegas tokens en la terminal ni en el chat del agente.

<a id="install-the-tool"></a>

## Instalar tú mismo o pedirlo al agente

Si el agente instala la herramienta, pide:

```text prompt
Use drive CLI. Install @wirecat/drive-cli from npm and check drive --help.
Ask me for the profile name and Google folder. Follow the Google connection guide; I will approve sign-in in my browser.
Do not request tokens or credential contents in chat.
```

Consulta las [instrucciones oficiales del repositorio Drive](https://github.com/WireCatLabs/drive-cli/blob/main/docs/installation.md)
para instalar, actualizar y conectar Google.

Necesitas [Node.js](https://nodejs.org/en/download) 22.16+ en la rama 22.x o Node.js 24+.
Abre una terminal en el ordenador donde trabaja tu agente:

```sh
npm install -g @wirecat/drive-cli
drive --version
drive --help
```

El paquete contiene JavaScript compilado. No necesitas Git, pnpm ni compilar fuentes.
`drive --help` debe mostrar los comandos. Instalar no conecta la cuenta ni importa documentos.
En Windows usa `npm.cmd` si PowerShell bloquea `npm.ps1`. Reabre el terminal o el agente si no
encuentra `drive` tras instalar.

Si ya usas pnpm o Bun, elige una alternativa:

```sh
pnpm add -g @wirecat/drive-cli
bun add -g @wirecat/drive-cli
```

Para probar sin instalar globalmente:

```sh
npx @wirecat/drive-cli --help
```

Para actualizar, repite `npm install -g @wirecat/drive-cli`. Para quitar el comando:

```sh
npm uninstall -g @wirecat/drive-cli
```

Desinstalar conserva ajustes locales, credenciales y documentos indexados. Para olvidar antes
el acceso de Google, ejecuta `drive personal session end` para cada perfil conectado.

## Elegir cómo conectar

Con **la aplicación Google compartida de WireCat**, apruebas tu propia cuenta en el navegador;
solo el propietario configura Google Cloud. La identidad del cliente Desktop de WireCat está
incluida en el CLI. Omite Google Cloud y ve a [conectar tu cuenta](#connect-your-account).
La verificación de Google y las políticas de tu organización pueden afectar el acceso a la app.

¿Prefieres tu propia aplicación? Crea un cliente Desktop abajo y pasa su JSON con `--client-file`.
El JSON identifica la aplicación; por sí solo no da acceso a tu cuenta. Ese permiso se concede
por separado en el navegador.

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
configuración. Si ya existe, edita los campos en Branding. Para la app WireCat usa `https://wirecat.dev/en/docs/drive` como página principal,
`https://wirecat.dev/en/privacy` como política de privacidad y `https://wirecat.dev/en/terms`
como términos. Añade `wirecat.dev` en Authorized domains sin esquema ni ruta, y verifica su
propiedad en Google Search Console con una cuenta propietaria o editora del proyecto Cloud.
Esos datos los configura el propietario, no cada usuario.

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

Publicar la aplicación Google no conecta este ordenador con tu cuenta. Cada usuario sigue
abriendo el consentimiento y autorizando su cuenta. El cliente Desktop de WireCat identifica
la app compartida; un cliente propio identifica tu aplicación. Ambos usan el mismo comando
y guardan tokens en el almacén local de credenciales de cada usuario.

Elige el nombre del perfil y conecta con la aplicación compartida de WireCat:

```sh
drive personal session start
drive personal session list --json
```

Para tu propia aplicación, sustituye la ruta y ejecuta:

```sh
drive personal session start --client-file /absolute/path/to/desktop-client.json
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
