---
title: "Cuando algo falla"
---

Haz que `attio` vuelva a funcionar a partir del síntoma que ves. La mayoría de los fallos vienen del token, de un
ámbito que le falta o de los permisos del perfil, y cada uno tiene una comprobación que nombra la causa.

Buscas tu síntoma en la tabla, haces la comprobación que indica y vuelves a ejecutar el comando. Si sigue fallando,
tienes el código de error y el nombre del perfil listos para una petición de ayuda.

**En esta página:**

1. [Primeras comprobaciones](#first-checks)
2. [Síntomas y qué hacer](#symptoms-and-what-to-do)
3. [Pide ayuda](#ask-for-help)

## Primeras comprobaciones

```sh
attio doctor                         # the version, the settings, the profiles, without the network
attio work session status --check    # asks Attio which workspace the token belongs to
```

## Síntomas y qué hacer

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `attio doctor`. No lee ningún llavero ni usa la red. |
| No se encuentra `attio` | Abre una terminal nueva y comprueba que la carpeta global de npm está en `PATH`. |
| "name a profile" | Pon el perfil primero, como en `attio work config show`, o define `WCATTIO_PROFILE`. |
| "not signed in" | Ejecuta `attio work session start` y pega el token. Mira [inicia sesión](./installation.md#sign-in). |
| Se rechaza el token, o "not active" | Se borró en Attio o se escribió mal. Crea uno nuevo ([cómo](./installation.md#make-an-access-token-in-attio)) y vuelve a ejecutar `session start`. |
| No encuentras **Developers** en Attio | Solo lo ve un administrador del espacio de trabajo. Pide a un administrador que cree el token. |
| Un comando falla con 403, o "missing scope" | Al token le falta un ámbito. Edítalo en Workspace settings → Developers, o crea uno nuevo, con `record_permission:read`, `object_configuration:read` y `user_management:read`. |
| `rate_limited` | Attio documenta 100 lecturas y 25 escrituras por segundo ([página de Attio](https://docs.attio.com/rest-api/guides/rate-limiting)). Espera un momento y vuelve a ejecutarlo. |
| `deals list` está vacío | Ejecuta primero `attio work sync`. Las negociaciones se leen de la copia que hace. |
| `sync` falla con `not_found` | El objeto Deal está desactivado en tu espacio de trabajo. Un administrador lo activa en los ajustes de objetos de Attio ([documentación de Attio](https://docs.attio.com/docs/standard-objects/standard-objects-deals)). |
| Una negociación ganada o perdida aparece como abierta | Una etapa de ganadas tiene que ser la que Attio celebra, y el título de una etapa de perdidas tiene que empezar por "Lost". Mira [negociaciones](./usage.md#deals). |
| Falta una persona o una empresa en `search all` | `sync` copia solo las personas y empresas que nombra una negociación: añádela a una y ejecuta `attio work sync`. `attio work people list anna` lee el propio Attio y encuentra a cualquiera enseguida. |
| Se rechaza `people list assigned_to:…` | Una lista en directo acepta palabras (`attio work people list anna`), no otros campos. |
| El archivo de ajustes no se lee | `doctor` lista cada problema del archivo en `config.issues`. Ejecuta el `config unset` que da cada uno, o corrige el archivo a mano. |
| `doctor` muestra `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que `doctor` imprime después de "to make it private:". `doctor` nunca cambia los permisos de un archivo por sí mismo. |
| "the OS keyring did not answer" | El ordenador no tiene ningún llavero en marcha. Inicia sesión con `attio work session start --credential-storage file`. |
| Se rechaza una escritura | La detienen los permisos del perfil, `WCATTIO_READ_ONLY` o los ámbitos del token. Mira los [permisos](./permissions.md). |

## Pide ayuda

Pregunta en [Discord](https://discord.gg/DebENqbRrJ), o abre una [incidencia](https://github.com/WireCatLabs/attio-cli/issues)
con el código de error, el nombre del perfil y el comando. Nunca pegues un token, una contraseña ni contenido privado
en una petición de ayuda.
