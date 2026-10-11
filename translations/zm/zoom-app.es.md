---
title: "Tu aplicación de Zoom"
---

`zm` lee tus reuniones mediante el API oficial en tu nombre. Zoom solo lo permite mediante una
aplicación registrada en Zoom App Marketplace: como la aplicación de Telegram para `tg`, usa
**tu propia aplicación de Zoom**. La creas una vez.

El manifiesto pide lectura de reuniones, participantes, transcripciones y resúmenes de IA. Archivos
y gestión remota requieren permisos adicionales. Añade lo que necesites. No hay secreto de cliente:
conectas tu cuenta mediante el navegador.

## Crear desde el manifiesto

1. Entra en [marketplace.zoom.us](https://marketplace.zoom.us/).
2. Abre **Build App** al pie del panel izquierdo ([marketplace.zoom.us/user/build](https://marketplace.zoom.us/user/build)) y pulsa **+**.
3. Elige **General app**, creación **from an app manifest**, y carga [`zoom-app.json`](https://github.com/WireCatLabs/zoom-cli/blob/f7a1dd2cb730996c4e4b239e9ff9010d6dbbc783/docs/zoom-app.json).
4. Si pregunta cómo se gestiona, elige **User-managed**.
5. En **Development → Basic Information**, comprueba `https://wirecat.dev/zoom-callback` en
   **OAuth Redirect URL** y **OAuth Allow Lists**, y los cinco permisos siguientes en **Scopes**.
   Rellena los campos vacíos y pulsa **Continue**: el importador puede dejarlos vacíos y Zoom
   rechazar el acceso con «Invalid redirect».
6. Activa **Use Public Client OAuth** en **Basic Information → App Credentials**. El importador
   puede dejarlo apagado pese al manifiesto y provocar «Invalid redirect».
7. Copia el **Public Client ID**. No necesitas el secreto de cliente.

Pasa el ID a la herramienta:

```sh
zm config set zoom.clientId <public-client-id>
zm login
```

`zm login` abre el consentimiento. Tras autorizar, el navegador llega a
[wirecat.dev/zoom-callback](https://wirecat.dev/zoom-callback), una página estática que pasa la respuesta
a `zm` en tu equipo. Zoom ya no acepta `127.0.0.1` allí. La respuesta solo funciona con la clave que
queda en el equipo (PKCE). Si no puede pasarla, la muestra para pegarla. El token se guarda en el llavero.

## Permisos del manifiesto

| Permiso | Uso |
|---|---|
| `meeting:read:list_meetings` | encontrar reuniones anteriores |
| `meeting:read:list_past_instances` | distinguir reuniones de una serie recurrente |
| `cloud_recording:read:meeting_transcript` | leer transcripciones, incluso sin grabación |
| `meeting:read:list_past_participants` | leer participantes y sesiones de entrada y salida |
| `meeting:read:summary` | resúmenes de Zoom; opcional, necesita Pro o superior |

Antes de cargar, cambia `developer_information` por tu nombre y correo.

## Añadir archivo o gestión

Añade los permisos user-managed necesarios en **Scopes** y ejecuta `zm login` de nuevo.
Los tokens existentes no ganan permisos automáticamente.

| Permiso | Función |
|---|---|
| `cloud_recording:read:list_user_recordings` | encontrar grabaciones en la nube |
| `cloud_recording:read:list_recording_files` | inspeccionar y descargar archivos |
| `user:read:user` | verificar el acceso con `session status --check` |
| `meeting:read:meeting` | mostrar una reunión remota |
| `meeting:read:invitation` | obtener invitación |
| `meeting:write:meeting` | crear una reunión |
| `meeting:update:meeting` | modificar una reunión |
| `meeting:delete:meeting` | cancelar una reunión |

La lista usa `meeting:read:list_meetings`. Crear, cambiar y cancelar muestran un plan; `--yes` lo aplica.
El archivo no necesita permisos de escritura de reuniones. Consulta [los permisos granulares](https://developers.zoom.us/docs/integrations/oauth-scopes-granular/)
y [Meeting API](https://developers.zoom.us/docs/api/meetings/).

## Antes del primer `zm pull`

- Activa **Allow hosts to retain transcripts** en la configuración web; sin ello el API no recibe transcripciones guardadas.
- Zoom devuelve transcripciones de reuniones que **organizaste**. Para otras, descárgalas en el portal;
  `zm import <folder>` lee esos archivos.

## Cuenta gestionada por tu empresa

Un administrador puede tener que aprobar la app. Mientras no sea posible, el API no funciona,
pero `zm import` permite leer archivos descargados.
