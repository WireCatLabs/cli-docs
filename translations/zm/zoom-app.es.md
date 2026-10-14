---
title: "Conectar una app de Zoom"
---

Una app de Zoom define los permisos que puede solicitar un programa. Conecta una existente a `zm`
o crea una administrada por el usuario. Obtendrás el Public Client ID, ajustes de retorno y permisos
para el login del navegador. Registrarla no añade un bot a las reuniones ni crea grabaciones. No se descarga un archivo de credenciales ni se crea otro cliente OAuth fuera de la app: activa Public Client OAuth dentro y copia el ID.

Elige cómo conectar:

- [Usa una app que ya creaste](#use-an-app-you-already-created)
- [Crea tu propia app](#create-your-own-app)

## Usa una app que ya creaste

1. Entra en [Zoom App Marketplace](https://marketplace.zoom.us/) y abre **Developer → Created apps**.
   Selecciona la app existente sin crear otra copia.
2. Elige **Development** para una app en desarrollo o **Production** para una distribuida.
   Credenciales y ajustes OAuth pertenecen a ese entorno.
3. En **Basic Information → App Credentials**, activa **Use Public Client OAuth** y copia
   **Public Client ID**. También pueden aparecer Client ID y Client Secret normales; `zm` no los usa.
4. Comprueba retorno, lista de URLs y [permisos necesarios](#what-the-manifest-asks-for) de abajo.
5. Configura el ID e inicia otro login:

```sh
zm config set zoom.clientId <public-client-id>
zm config set source api
zm session start
```

Sustituye el valor sin los signos angulares. Entra como el usuario cuyas reuniones quieres, revisa
los permisos y aprueba. Espera `logged_in: true` en el terminal. Si sigue esperando después de aprobar,
[completa el retorno](./sessions.md#finish-the-browser-callback).

### Usa una app de WireCat o de tu equipo

Si el dueño habilitó una app de WireCat o del equipo para tu usuario, usa el **Public Client ID
facilitado por ese dueño** con las mismas órdenes. No necesitas otra app ni su secreto. El dueño
mantiene retorno y permisos; tú autorizas tu propia cuenta.

Una app en desarrollo no está disponible automáticamente para usuarios de otra cuenta. Confirma
el acceso con su dueño; puede hacer falta el administrador. Un enlace de autorización solo no
configura `zm` ni completa su sesión: inicia `zm session start` para crear el retorno y la clave de ese
intento. Si no puedes autorizar la app compartida, crea la tuya siguiendo los pasos siguientes.

## Crea tu propia app

1. Entra en [Zoom App Marketplace](https://marketplace.zoom.us/). Abre **Developer** y, en
   **Created apps**, elige **Develop → Build an app**, **General app** y **Create**.
   Si no aparece Developer, pide al administrador el rol de desarrollador.
2. Ponle un nombre, por ejemplo **My meeting archive**, y elige **User-managed**. Cada usuario
   autoriza sus datos. Server-to-Server OAuth es otro tipo que no corresponde al login de esta herramienta.
3. Para la configuración inicial usa **Development**. En **Basic Information → App Credentials**,
   activa **Use Public Client OAuth** y copia **Public Client ID**.
4. En **OAuth Information** completa los dos campos siguientes y guarda/continúa:

| Campo | Valor |
|---|---|
| OAuth Redirect URL | `https://wirecat.dev/zoom-callback` |
| OAuth Allow Lists | `https://wirecat.dev/zoom-callback` |

Usa la URL exacta sin barra adicional al final. `zm` envía ese retorno; otro requiere cambiar el
código, no un ajuste. Zoom también admite retornos locales para clientes públicos compatibles,
pero esta herramienta envía la URL indicada.

5. Abre **Scopes → Add Scopes**, busca cada nombre de la tabla, selecciona los permisos de usuario
   y guarda. Explica su uso si Zoom pide una descripción. Añade grabación o escritura solo para esas tareas.
6. Revisa **Local Test**, instalación y aprobación requerida. **Add App Now** puede autorizar la
   app en desarrollo, pero vuelve al terminal y ejecuta `zm session start` para establecer la sesión.
   Distribuirla a otras cuentas tiene otro proceso de revisión de Zoom.
7. Vuelve al [primer uso](./installation.md#first-run) con el Public Client ID.

Las guías oficiales de [creación](https://developers.zoom.us/docs/integrations/create/),
[ajustes OAuth](https://developers.zoom.us/docs/build-flow/basic-info/oauth-info/) y
[Public Client OAuth](https://developers.zoom.us/docs/integrations/oauth/#get-your-public-client-id)
explican los campos del Marketplace.

## Crear desde el manifiesto

El [manifiesto inicial opcional](https://github.com/WireCatLabs/zoom-cli/blob/main/docs/zoom-app.json)
es una plantilla para crear la app, no un archivo de credenciales. Contiene URLs de retorno y funciones internas desactivadas. Si Marketplace permite crear desde un
manifiesto, guarda el JSON e impórtalo al crear la General app.

**El manifiesto no incluye permisos ni activa Public Client OAuth.** Completa los pasos 3–6 a mano
tras importarlo. Importar correctamente no significa estar listo para `zm session start`. La creación manual
es la ruta completa cuando no hay opción de importar.

<a id="what-the-manifest-asks-for" />

## Permisos para reuniones del anfitrión

Añade estos permisos manualmente para obtener reuniones del anfitrión. Un scope es un permiso
nombrado: autoriza una llamada API, pero no garantiza que existan los datos solicitados.

| Permiso | Uso |
|---|---|
| `meeting:read:list_meetings` | Reuniones del anfitrión y agenda futura |
| `meeting:read:list_past_instances` | Ocurrencias separadas de reuniones recurrentes |
| `cloud_recording:read:meeting_transcript` | Transcripción disponible |
| `meeting:read:list_past_participants` | Participantes y sesiones de entrada/salida |
| `meeting:read:summary` | Resumen disponible de Zoom AI |

Configura los cinco para `zm meetings sync`: la obtención lee esas partes aunque falte texto o resumen.
El plan, ajustes del anfitrión y retención determinan qué existe. Para solo listar la agenda basta
el permiso de lista de reuniones.

## Añadir archivo o gestión

El dueño añade el permiso en **Scopes** y guarda; el usuario repite `zm session start`. Los tokens ya
emitidos no ganan permisos automáticamente. Comprueba lo realmente concedido con
`zm session status --json`.

| Permiso | Función |
|---|---|
| `cloud_recording:read:list_user_recordings` | Descubrir grabaciones |
| `cloud_recording:read:list_recording_files` | Inspeccionar y descargar archivos |
| `user:read:user` | Verificar sesión remota con `zm session status --check` |
| `meeting:read:meeting` | Ver una reunión remota |
| `meeting:read:invitation` | Leer invitación |
| `meeting:write:meeting` | Crear reunión |
| `meeting:update:meeting` | Actualizar reunión |
| `meeting:delete:meeting` | Cancelar reunión |

Archivar no requiere permisos de escritura de reuniones. Los cambios muestran un plan;
`--yes` aplica una solicitud. Tras concederlos, sigue con [archivo de grabaciones](./archive.md#archive-cloud-recordings)
o [gestión de reuniones](./remote-meetings.md).

<a id="before-your-first-zm-pull" />

## Antes del primer `zm meetings sync`

La transcripción debe haberse generado y retenido en Zoom. En ajustes web busca **Meeting → In Meeting
(Advanced) → Meeting transcript** y activa generación/retención necesarias. El administrador puede
bloquearlas. Cuentas existentes también pueden mostrar **Allow hosts to retain transcripts** para
texto de resúmenes. Consulta [ajustes de Zoom](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0085675)
para requisitos de plan y permisos.

Para transcribir audio de grabaciones, revisa los ajustes separados de grabación en la nube.
Grabación, subtítulos en directo y transcripción retenida son resultados distintos. Activar un ajuste
hoy no recrea texto nunca guardado o expirado.

La API lee reuniones del anfitrión autenticado. Si solo asististe, pide el texto al anfitrión o
 descárgalo si tienes permiso, y [importa el VTT](./archive.md#downloaded-transcripts). Asistir no garantiza descarga.

## Cuenta gestionada por tu empresa

Pide al administrador creación/instalación y los permisos necesarios. Si no se autoriza la API,
puedes importar archivos permitidos sin app. Tras conectar, [descarga un primer periodo](./installation.md#first-run)
y comprueba qué reuniones y textos llegaron.
