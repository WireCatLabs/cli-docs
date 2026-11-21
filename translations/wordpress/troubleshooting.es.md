---
title: "Cuando algo falla"
---

Haz que `wordpress` vuelva a funcionar a partir del síntoma que ves. La mayoría de los fallos vienen de la contraseña
de aplicación, de tu rol en WordPress o de los permisos del perfil, y cada uno tiene una comprobación que nombra la
causa.

Buscas tu síntoma en la tabla, haces la comprobación que indica y vuelves a ejecutar el comando. Si sigue fallando,
tienes el código de error y el nombre del perfil listos para una petición de ayuda.

**En esta página:**

1. [Primeras comprobaciones](#first-checks)
2. [Síntomas y qué hacer](#symptoms-and-what-to-do)
3. [Pide ayuda](#ask-for-help)

## Primeras comprobaciones

En los ejemplos, `blog` es el perfil, un nombre que elegiste para un sitio.

```sh
wordpress doctor                         # the version, the settings, the profiles, without the network
wordpress blog session status --check    # asks your site whose password it is
```

## Síntomas y qué hacer

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `wordpress doctor`. No lee ningún llavero ni usa la red. |
| No se encuentra `wordpress` | Abre una terminal nueva y comprueba que la carpeta global de npm está en `PATH`. |
| Escribiste `wp` | Ese es el WP-CLI oficial. Esta herramienta es `wordpress`. |
| "name a profile" | Pon el perfil primero, como en `wordpress blog config show`, o define `WCWP_PROFILE`. |
| "not signed in" | Ejecuta `wordpress blog session start --site blog.example.com --login anna`, con tu sitio y tu nombre de usuario. Consulta [inicia sesión](./installation.md#sign-in). |
| La contraseña se rechaza | Se anuló, se escribió mal o es de otro usuario. Crea una nueva ([cómo](./installation.md#make-an-application-password-in-wordpress)) y ejecuta `session start` de nuevo con el `--login` correcto. |
| No hay sección **Contraseñas de aplicación** en tu perfil | El sitio necesita WordPress 5.7 o posterior con https, y un plugin o el alojamiento puede desactivar la sección. Pregunta al administrador del sitio. |
| Una dirección de WordPress.com | Los sitios de WordPress.com no son compatibles, solo WordPress autoalojado. |
| `posts list` está vacío | Ejecuta antes `wordpress blog sync`. Las entradas se leen de la copia que crea. |
| `sync` nombra huecos, o faltan páginas | Un inicio de sesión de Autor o Colaborador no puede listar páginas y obtiene solo sus propias entradas, y un Colaborador solo sus borradores y sus entradas pendientes de revisión. Solo un Administrador obtiene todos los usuarios con su correo; los demás roles obtienen los autores con entradas publicadas. Inicia sesión como Administrador para una copia completa, o como Editor para todas las entradas y páginas. |
| Falta en la copia un cambio del sitio | Ejecuta `sync`. Si la entrada no es tuya y entras como Autor o Colaborador, mira la fila anterior. |
| `content.conflict` | La entrada cambió en el sitio desde la última sincronización. Ejecuta `sync`, mira la entrada de nuevo y vuelve a intentarlo. |
| `content.lossy-body` | La entrada tiene galerías, columnas, contenido incrustado o iframes que Markdown no puede conservar. Cambia solo su título, extracto, etiquetas o estado, o añade `--replace-body` para escribir el cuerpo de todos modos y aplanarlos. Consulta [cuando una escritura se detiene](./usage.md#when-a-write-stops). |
| `content.schedule-past` | `--at-time` debe estar en el futuro. |
| `content.already-published` | Una entrada publicada no se puede programar. Ejecuta antes `posts unpublish`. |
| `content.empty` | La escritura no nombra ningún campo. Añade `--title`, `--text-file` u otro campo. |
| `posts publish` falla con `permission_error` (WordPress respondió HTTP 403) | Tu rol en WordPress no puede publicar. Un Colaborador no puede. Pide ayuda a un Editor, o inicia sesión como uno. |
| `posts stats` no muestra visitas | WordPress no guarda recuentos de visitas, y las estadísticas de Jetpack no son compatibles. |
| Un campo de plugin, como un título SEO, no tiene opción | Los campos de plugins no están en la descripción de la API. Envíalos en un `--body` sin procesar con `wordpress blog api`. |
| El archivo de ajustes no se lee | `doctor` enumera cada problema del archivo en `config.issues`. Ejecuta el `config unset` que da cada uno, o corrige el archivo a mano. |
| `doctor` muestra `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que imprime `doctor` después de "to make it private:". `doctor` nunca cambia por sí mismo el modo de un archivo. |
| "the OS keyring did not answer" | El ordenador no tiene ningún llavero en marcha. Inicia sesión con `--credential-storage file`. |
| Una escritura se rechaza | Los permisos del perfil o `WCWP_READ_ONLY` la detienen. Consulta los [permisos](./permissions.md). |

## Pide ayuda

Pregunta en [Discord](https://discord.gg/DebENqbRrJ), o abre un
[issue](https://github.com/WireCatLabs/wordpress-cli/issues) con el código de error, el nombre del perfil y el
comando. Nunca pegues una contraseña, un token ni contenido privado en una petición de ayuda.
