---
title: "Datos y permisos"
---

Decide qué pueden leer o cambiar Drive y tu agente antes de conectar fuentes sensibles.
Esta guía explica las autorizaciones de Google, el almacenamiento y los permisos de comandos
para elegir el alcance, saber dónde van los datos y distinguir desconectar de borrar copias.

La [guía de seguridad compartida de WireCat](https://wirecat.dev/en/docs/security) explica las protecciones
y cómo informar de problemas en todas las herramientas. Esta página trata los permisos y datos de Drive.

## Acceso a Google y permisos de comandos

La autorización predeterminada es `drive.readonly` sobre el Drive de la cuenta. Las carpetas
seleccionadas limitan la importación, no el permiso de Google. Siguen aplicándose las funciones
del archivo y las políticas de la organización. Editar requiere conectar con `--grant write` y permiso
del comando. La actividad y los metadatos de aplicaciones instaladas tienen permisos opcionales separados.

```sh
drive personal --read-only files get FILE_ID --json
drive personal --offline documents show DOC_ID --json
```

`--read-only` bloquea cambios locales y remotos, incluida la sincronización, etiquetas y notas.
`--offline` bloquea operaciones que necesitan Google o el proveedor de extracción configurado.
Para un agente que pueda indexar y organizar localmente pero no editar Google, usa los permisos
específicos de [configuración](./configuration.md#change-and-check-a-value). El CLI no controla
lo que haga el agente fuera de esta herramienta.

## Qué se guarda localmente

El ID de cliente Desktop OAuth y el client secret incluido identifican la aplicación pública
WireCat. No conceden acceso a una cuenta. Google trata las aplicaciones instaladas como clientes
públicos que no pueden mantener confidencial esta identidad; cada usuario concede su propio
acceso. Los tokens de acceso y actualización son privados y nunca se incluyen en el paquete.
Un `--client-file` propio tiene prioridad sobre los ajustes de aplicación del entorno, que tienen
prioridad sobre la identidad incluida de WireCat. Consulta [la explicación de OAuth nativo de Google](https://developers.google.com/identity/protocols/oauth2/native-app).

| Datos | Ubicación y protección |
| --- | --- |
| Tokens de Google | Almacén de credenciales del sistema; archivo privado solo si lo eliges explícitamente |
| Perfiles y raíces elegidas | `config.json` en el directorio de configuración |
| Texto, fragmentos, vectores y contexto local | La base WireCat compartida, seleccionada por `MESSAGING_STORE` |
| Copias de fuentes y relaciones de carpetas | Documentos del perfil y estado de sincronización en el directorio de datos |
| Exportaciones Markdown adicionales | La ruta solicitada; no sobrescribe archivos existentes |

Las copias locales contienen texto y metadatos personales. Los permisos privados limitan el
acceso; no cifran la base ni protegen un ordenador desbloqueado de los procesos del propietario.
Usa cifrado del dispositivo y de las copias de seguridad cuando sea necesario. Consulta
[las ubicaciones](./configuration.md#where-the-files-live).

## Qué se envía a otros servicios

La sincronización y los comandos en Google envían peticiones directamente desde este ordenador.
La búsqueda por palabras y los embeddings locales no envían texto a un proveedor de IA. La
extracción explícita de recuerdos envía el texto local elegido al proveedor configurado y
muestra propuestas antes de guardarlas. Un agente de terminal o MCP puede enviar resultados
a su propio proveedor de forma independiente.

Las etiquetas, notas y recuerdos locales no editan Docs ni notifican a sus editores. Los
propietarios y el último editor guardados son observaciones, no una auditoría completa. Consulta
la [Política de privacidad](https://wirecat.dev/en/privacy) para datos de Google y uso limitado.

## Desconectar o eliminar la copia local

```sh
drive personal session end
```

Elimina las credenciales locales del perfil y conserva ajustes y documentos. Quita la aplicación
de las [conexiones de Google](https://myaccount.google.com/connections) para revocar su acceso.
Quitar una raíz y sincronizar elimina las fuentes gestionadas y sus copias; las notas, recuerdos,
exportaciones y copias de seguridad independientes pueden permanecer.

Para eliminar todos los datos locales, identifica primero los directorios y la base configurados.
No borres un almacén compartido salvo que también quieras eliminar los datos de otras herramientas.
Desinstalar el paquete npm no borra esos archivos. Continúa con [ajustes](./configuration.md) o
[recuperar la conexión](./troubleshooting.md).
