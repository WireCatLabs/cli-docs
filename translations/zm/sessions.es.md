---
title: "Acceso, sesiones y perfiles"
---

Conecta la cuenta de Zoom correcta y comprueba que la aprobación del navegador llegó a la herramienta.
Después elige un perfil local para sus reuniones. Los permisos de la app, la sesión OAuth y el perfil
son distintos: cambiar la etiqueta no inicia sesión como otro usuario.

## Conectar la cuenta

Obtén el Public Client ID de [una app existente o nueva](./zoom-app.md). Inicia la conexión en un
terminal interactivo del ordenador que guardará la sesión:

```sh
zm config set zoom.client_id <public-client-id>
zm session start --browser firefox
```

Omite `--browser firefox` para usar el navegador predeterminado. Zoom muestra los permisos solicitados;
entra en la cuenta correcta y aprueba. Los tokens se guardan en el almacén de contraseñas del sistema,
no en la configuración pública. Si ese almacén no está disponible, la conexión falla.

## Completa el retorno del navegador

Deja el terminal abierto. Tras **Allow**, `https://wirecat.dev/zoom-callback` envía la respuesta al
receptor temporal del ordenador. Al recibirla correctamente, se cierra; la orden informa
`logged_in: true`, muestra los permisos concedidos y devuelve el indicador del terminal.

Si no aparece nada en el terminal después de aprobar:

1. Mira la página de retorno del navegador. Copia los parámetros `code=…&state=…` o la URL completa.
2. Pégalos en **el mismo terminal que sigue esperando en `zm session start`** y pulsa Enter. No inicies
   otro proceso ni pegues el valor como una orden nueva del intérprete.
3. Si pasaron cinco minutos, repite la conexión y usa el nuevo retorno. Cada intento tiene su
   estado y clave de verificación; una respuesta antigua se rechaza.

Un navegador en otro dispositivo, un terminal remoto o restricciones de conexiones locales pueden
requerir el pegado manual. No publiques el retorno ni lo envíes a una conversación con un agente;
pertenece al intento activo. La conexión termina cuando el terminal la confirma.

## Comprobar la sesión

```sh
zm session status --json
```

Se comprueba el estado guardado sin contactar con Zoom ni renovar tokens. `state: saved` indica
credenciales guardadas, no validez remota. Los permisos devueltos muestran lo concedido. Para una
comprobación remota, añade `user:read:user`, autoriza otra vez y ejecuta:

```sh
zm session status --check --json
```

El error de permiso ausente indica su nombre. El dueño lo añade y guarda la app; el usuario repite
`zm session start`. Cambiar la configuración no amplía un token ya emitido.

El inicio de sesión necesita entrada interactiva. La salida canalizada o con `--json` requiere
además `--interactive`; `--no-input` impide abrir el navegador. Haz la primera conexión en un terminal
normal, no en una tarea de fondo o un cliente MCP.

## Elegir un perfil local

```sh
zm config set account.profile personal
```

Un perfil es una etiqueta de datos, no otras credenciales de Zoom. A diferencia de `tg` y `max`,
`zm` no admite un argumento de perfil: el perfil es el ajuste `account.profile`. Acepta 1–64 letras, dígitos,
puntos, guiones bajos o guiones, y empieza por letra o dígito. Importación y API comparten la etiqueta.
La escritura registra el perfil; la lectura solo lo busca. Descarga o importa primero para que
`meetings list` pueda encontrarlo.

Para otro usuario de Zoom, elige otro perfil de datos **y** vuelve a iniciar sesión con ese usuario
en el navegador. No mezcles usuarios en una etiqueta. La entrada del almacén se selecciona por
directorio de configuración y Public Client ID; cambiar solo `account.profile` conserva la sesión OAuth.

`MESSAGING_STORE` selecciona la base compartida. Usa la misma ruta en Zoom, Memo y MCP para conectar
reuniones con notas y proyectos. Importar archivos no avanza el cursor; al cambiar de fuente puede
hacer falta un `--since-time` anterior explícito.

## Retirar el acceso

No hay orden de cierre de sesión. Retira la autorización desde la gestión de apps de Zoom App Marketplace.
Para borrar el token local, abre el almacén de contraseñas del sistema y elimina la entrada cuyo servicio es
`zoom-cli:<configuration directory>` (por ejemplo `zoom-cli:/home/you/.config/zm`; `zm doctor --json` muestra
el directorio) y cuya cuenta es tu Public Client ID.
Desinstalar `zm` no revoca permisos ni borra reuniones. Consulta [seguridad](./security.md) antes de
compartir datos con un agente.

Varios usuarios de Zoom en un mismo equipo necesitan cada uno su propio `ZM_CONFIG_DIR`: la entrada del llavero
depende del directorio de configuración y del ID de cliente, así que los usuarios que comparten ambos comparten
un mismo acceso.

Cuando la sesión y el perfil estén listos, [descarga o importa la primera reunión](./archive.md#pull-hosted-meetings).
