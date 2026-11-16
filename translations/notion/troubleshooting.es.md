---
title: "Cuando algo falla"
---

Empieza por el síntoma, haz la comprobación y vuelve a ejecutar el comando. Guarda el código de error y el nombre del
perfil para una consulta al soporte.

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `notion doctor`. No lee ningún llavero ni usa la red. |
| No se encuentra `notion` | Abre una terminal nueva y comprueba que la carpeta global de npm está en el `PATH`. |
| "name a profile" | Pon el perfil primero, como en `notion personal config show`, o define `WCNOTION_PROFILE`. |
| El archivo de ajustes no se lee | `doctor` lista cada problema del archivo en `config.issues`. Ejecuta el `config unset` que indica cada uno, o corrige el archivo a mano. |
| `doctor` muestra `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que `doctor` imprime después de "to make it private:". `doctor` nunca cambia por sí mismo los permisos de un archivo. |
| Se rechaza una escritura | La detienen los permisos del perfil o `WCNOTION_READ_ONLY`. Consulta los [ajustes](./configuration.md#permissions). |

Nunca pegues un token, una contraseña ni contenido privado en una consulta al soporte.
