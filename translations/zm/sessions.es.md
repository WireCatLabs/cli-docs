---
title: "Acceso, sesiones y perfiles"
---

Conecta la cuenta de Zoom correcta y comprueba que la aprobación del navegador llegó a la herramienta.
Después elige un perfil local para sus reuniones. Los permisos de la app, la sesión OAuth y el perfil
son distintos: cada perfil tiene su propio acceso, así que el perfil se elige antes de cada comando.

## Conectar la cuenta

Obtén el Public Client ID de [una app existente o nueva](./zoom-app.md). Inicia la conexión en un
terminal interactivo del ordenador que guardará la sesión:

```sh
zm config set zoom.client_id <public-client-id>
zm personal session start --browser firefox
```

Si eres un agente: ejecuta `zm personal session start` en segundo plano (espera la aprobación hasta cinco minutos, y una
herramienta de shell no muestra nada hasta que el comando termina), lee la línea `Open this URL to approve Zoom login:`
y la URL debajo, y da la URL a la persona como enlace. El navegador que la abra debe estar en este ordenador, porque el
retorno llega a un receptor de aquí. `--quiet` conserva la URL.

Omite `--browser firefox` para usar el navegador predeterminado. Zoom muestra los permisos solicitados;
entra en la cuenta correcta y aprueba. Los tokens se guardan en el almacén de contraseñas del sistema,
no en la configuración pública. Si ese almacén no está disponible, la conexión falla.

Si iniciaste sesión por última vez con zm 0.34 o anterior, vuelve a ejecutar `zm <profile> session start`: ese acceso antiguo ya no se usa.

## Completa el retorno del navegador

Deja el terminal abierto. Tras **Allow**, `https://wirecat.dev/zoom-callback` envía la respuesta al
receptor temporal del ordenador. Al recibirla correctamente, se cierra; la orden informa
`logged_in: true`, muestra los permisos concedidos y devuelve el indicador del terminal.

Si no aparece nada en el terminal después de aprobar:

1. Mira la página de retorno del navegador. Copia los parámetros `code=…&state=…` o la URL completa.
2. Pégalos en **el mismo terminal que sigue esperando en `zm personal session start`** y pulsa Enter. No inicies
   otro proceso ni pegues el valor como una orden nueva del intérprete.
3. Si pasaron cinco minutos, repite la conexión y usa el nuevo retorno. Cada intento tiene su
   estado y clave de verificación; una respuesta antigua se rechaza.

Un navegador en otro dispositivo, un terminal remoto o restricciones de conexiones locales pueden
requerir el pegado manual. No publiques el retorno ni lo envíes a una conversación con un agente;
pertenece al intento activo. La conexión termina cuando el terminal la confirma.

## Comprobar la sesión

```sh
zm personal session status --json
```

Se comprueba el estado guardado sin contactar con Zoom ni renovar tokens. `state: saved` indica
credenciales guardadas, no validez remota. Los permisos devueltos muestran lo concedido. Para una
comprobación remota, añade `user:read:user`, autoriza otra vez y ejecuta:

```sh
zm personal session status --check --json
```

El error de permiso ausente indica su nombre. El dueño lo añade y guarda la app; el usuario repite
`zm personal session start`. Cambiar la configuración no amplía un token ya emitido.

Sin terminal, el inicio de sesión imprime igualmente la URL y espera el retorno del navegador; solo la
alternativa de pegar el retorno necesita un terminal. `--no-input` y CI rechazan el acceso con navegador.
El inicio de sesión no es una herramienta MCP.

## Elegir un perfil local

```sh
zm personal meetings list
ZM_PROFILE=personal zm meetings list
```

La primera palabra es el perfil, como en `tg` y `max`; `ZM_PROFILE` dice lo mismo para toda una sesión de
shell. Un perfil es un acceso de Zoom y sus propias reuniones en la base. Nada elige uno por ti: sin perfil, un
comando que usa una cuenta falla con `validation_error` y enumera los perfiles de este ordenador en
`details.profiles`. Los nombres tienen 1–64 letras, dígitos, puntos, guiones bajos o guiones y empiezan por
letra o dígito; una palabra de comando como `meetings` no puede ser un perfil.

`zm <name> session start` inicia sesión en ese perfil y lo crea. En un ordenador sin ningún perfil, la primera
importación o descarga también crea uno, así que una configuración solo con archivos no necesita acceso a Zoom.
Junto a otros perfiles, una importación o descarga que nombra uno desconocido se rechaza antes de guardar nada
(`zm persnal meetings import …` falla y enumera los perfiles), así que una cuenta nueva empieza con su inicio de
sesión; `zm <name> config set permissions '{}'` también crea un perfil, para uno que solo importa archivos. Los
comandos de lectura solo buscan el perfil: descarga o importa primero para que `meetings list` pueda encontrarlo.

Para otro usuario de Zoom, crea un segundo perfil con `zm work session start` y elige a ese usuario en el
navegador. El acceso de cada perfil es su propia entrada del llavero, `<client id>:<profile>`.

`ZM_PROFILE_LOCK=personal` fija un proceso a un solo perfil: una primera palabra o un `ZM_PROFILE` que nombre
otro se rechaza con `permission_error`. Fíjalo donde se ejecuta un agente.

`MESSAGING_STORE` selecciona la base compartida. Usa la misma ruta en Zoom, Memo y MCP para conectar
reuniones con notas y proyectos. Importar archivos no avanza el cursor; al cambiar de fuente puede
hacer falta un `--since-time` anterior explícito.

## Retirar el acceso

No hay orden de cierre de sesión. Retira la autorización desde la gestión de apps de Zoom App Marketplace.
Para borrar el token local, abre el almacén de contraseñas del sistema y elimina la entrada cuyo servicio es
`zoom-cli:<configuration directory>` (por ejemplo `zoom-cli:/home/you/.config/zm`; `zm doctor --json` muestra
el directorio) y cuya cuenta es `<Public Client ID>:<profile>`.
Desinstalar `zm` no revoca permisos ni borra reuniones. Consulta [seguridad](./security.md) antes de
compartir datos con un agente.

Varios usuarios de Zoom en un mismo equipo son varios perfiles: cada uno tiene su propia entrada del llavero y sus propias reuniones.

Cuando la sesión y el perfil estén listos, [descarga o importa la primera reunión](./archive.md#pull-hosted-meetings).
