---
title: "Acceso, sesiones y perfiles"
---

Conecta tu aplicación de Zoom, guarda el token en el llavero del sistema y elige una etiqueta
local que agrupe las reuniones guardadas.

## Conectar la cuenta

Sigue [la guía de la aplicación](./zoom-app.md). Usa Public Client OAuth y la redirección
`https://wirecat.dev/zoom-callback`. Configura el Public Client ID y conecta la cuenta:

```sh
zm config set zoom.clientId <public-client-id>
zm login --browser firefox
```

La respuesta vuelve a un listener del equipo. Si no llega, pega los parámetros `code=…&state=…`
mostrados en la página. Se comprueban state y PKCE, se guardan tokens solo en el llavero y se devuelve
el estado y los permisos realmente concedidos. Sin llavero se produce un error; los tokens no se
escriben en la configuración. El listener se cierra ante éxito, error o vencimiento; el plazo predeterminado
es de cinco minutos.

El acceso mediante navegador necesita una terminal con entrada. En una tubería o modo JSON también
requiere `--interactive`; CI y terminales sin entrada interactiva no abren el navegador.
`--no-input` rechaza ese acceso.

## Comprobar la sesión

`zm session status` inspecciona el estado OAuth guardado por separado de los perfiles locales,
sin renovar credenciales. `session status --check` contacta explícitamente con Zoom y necesita
el permiso de lectura del usuario (`user:read:user`).

Los errores indican el permiso que falta. Añádelo a tu aplicación y conecta de nuevo:
los tokens existentes no reciben los nuevos permisos automáticamente.

## Elegir un perfil local

Elige una etiqueta para las reuniones guardadas:

```sh
zm config set account.profile personal
```

Las etiquetas tienen 1–64 letras, dígitos, puntos, guiones bajos o guiones y empiezan por letra o dígito.
Agrupan los datos locales; OAuth usa el cliente y la entrada del llavero configurados. Usa etiquetas
distintas para datos de cuentas separadas. La importación y el API comparten el perfil elegido.
Importar no cambia el cursor de descarga; cambiar de origen puede requerir un `--since` más antiguo.

Importar y descargar registran el perfil al comenzar. Las lecturas buscan un perfil existente,
sin crear una cuenta: importa o descarga primero. `MESSAGING_STORE` cambia la ruta compartida para
estas operaciones y MCP. Metadatos, ayuda, configuración y acceso no abren la base.
