---
title: "Cuando algo falla"
---

Haz que vuelva a funcionar un comando que falló, casi siempre en un paso. Busca en la tabla el síntoma o el código del
error, haz lo que dice su fila y vuelve a ejecutar el comando. Guarda el código de error y el nombre del perfil para una
consulta al soporte.

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `notion doctor`. No lee ningún llavero ni usa la red. |
| No se encuentra `notion` | Abre una terminal nueva y comprueba que la carpeta global de npm está en el `PATH`. |
| "name a profile" | Pon el perfil primero, como en `notion personal config show`, o define `WCNOTION_PROFILE`. |
| El archivo de ajustes no se lee | `doctor` lista cada problema del archivo en `config.issues`. Ejecuta el `config unset` que indica cada uno, o corrige el archivo a mano. |
| `doctor` muestra `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que `doctor` imprime después de "to make it private:". `doctor` nunca cambia por sí mismo los permisos de un archivo. |
| `doctor` dice que un perfil no lee la información de los usuarios o sus direcciones de correo, o la sincronización nombra `notion.no-user-information` o `notion.no-user-email` | Activa "Read user information including email addresses" en las capacidades de la conexión de Notion y sincroniza. Hasta entonces, el autor y el editor de una página se guardan por su id de Notion, y solo `identities link` los une a una persona. |
| `notion.not-shared`, o Notion no tiene esa página o base de datos | La página o la base de datos no está compartida con tu conexión, o el id está mal. En Notion, abre la página, elige ••• → Connections y añade tu conexión. Después vuelve a ejecutar el comando. |
| Una página se lee, pero la respuesta incluye `notion.not-shared` | Una parte de la página, como una base de datos enlazada, no está compartida con tu conexión, así que quedó fuera. Compártela igual. |
| `notion.restricted` | Notion dice que el token no puede hacer esto. Revisa las [capacidades](https://developers.notion.com/reference/capabilities) de la conexión en Notion: leer necesita Read content, y un cambio Update content o Insert content. Si el error pide direcciones de correo, activa "Read user information including email addresses" o da un id de usuario en lugar de un correo. |
| Se rechaza una escritura | La detienen los permisos del perfil o `WCNOTION_READ_ONLY`. Consulta los [ajustes](./configuration.md#permissions). |

Nunca pegues un token, una contraseña ni contenido privado en una consulta al soporte.
