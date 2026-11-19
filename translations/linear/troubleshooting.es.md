---
title: "Cuando algo falla"
---

Empieza por el síntoma, haz la comprobación y vuelve a ejecutar el comando. Guarda el código de error y el nombre del
perfil para una petición de ayuda.

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `linear doctor`. No lee el llavero ni usa la red. |
| No se encuentra `linear` | Abre una terminal nueva y comprueba que la carpeta global de npm está en `PATH`. |
| "name a profile" | Pon el perfil primero, como en `linear personal config show`, o define `WCLINEAR_PROFILE`. |
| El archivo de ajustes no se lee | `doctor` enumera cada problema del archivo en `config.issues`. Ejecuta el `config unset` que indica para cada uno, o corrige el archivo a mano. |
| `doctor` muestra `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que `doctor` imprime después de "to make it private:". `doctor` nunca cambia por sí mismo los permisos de un archivo. |
| Se rechaza una escritura | La detienen los permisos del perfil o `WCLINEAR_READ_ONLY`. Mira los [ajustes](./configuration.md#permissions). |

Nunca pegues un token, una contraseña ni contenido privado en una petición de ayuda.
