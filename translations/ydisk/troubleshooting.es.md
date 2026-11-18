---
title: "Cuando algo falla"
---

Un inicio de sesión que falla, una sincronización que se detiene, una búsqueda que no encuentra nada: busca aquí tu
síntoma y arréglalo en uno o dos minutos. Cada error dice en su mensaje qué hacer, y su código de salida le indica a un
script qué tipo de fallo fue.

**En esta página:**

1. [Primera comprobación](#first-check)
2. [Por síntoma](#by-symptom)
3. [Códigos de salida](#exit-codes)
4. [Si sigue fallando](#if-it-still-fails)

## Primera comprobación

```sh
ydisk doctor
ydisk personal doctor --online
```

`doctor` no lee el llavero ni usa la red. Muestra qué está configurado y cualquier problema del archivo de ajustes.
`doctor --online` además pregunta a Yandex si el token del perfil funciona.

## Por síntoma

| Síntoma | Qué hacer |
| --- | --- |
| No se encuentra `ydisk` | Abre una terminal nueva y comprueba que la carpeta global de npm está en `PATH`. |
| "name a profile" | Pon el perfil primero, como en `ydisk personal status`, o define `YDISK_PROFILE`. |
| "refused the token", código de salida 4 | El token es incorrecto, se revocó o caducó. [Consigue un token nuevo](./installation.md#get-a-yandex-token) y vuelve a ejecutar `ydisk personal session start`. |
| Un cambio falla con el código de salida 5 | El token no tiene el permiso `cloud_api:disk.write`, o lo rechazan los permisos del perfil o `YDISK_READ_ONLY`. Revisa los [ajustes](./configuration.md#permissions). Para el permiso, registra la aplicación de nuevo con él y consigue un token nuevo. |
| "the OS keyring did not answer" en Linux | El bus de sesión se reinició. Cierra la sesión y vuelve a entrar, o inicia sesión con `session start --credential-storage file`. |
| "no such item, or this token cannot see it", código de salida 6 | Comprueba la ruta con `files list --folder` en su carpeta superior. Una ruta del Disk empieza por `/`, como en `/Documents/plan.pdf`. |
| "asked to slow down", código de salida 8 | Yandex recibió demasiadas peticiones de esta cuenta. Espera un minuto y vuelve a ejecutar el comando. |
| Una sincronización se detiene antes del final | Una sincronización lee hasta 200 archivos. Ejecuta `sync` otra vez hasta que `status` no muestre trabajo pendiente. |
| Faltan los documentos de una carpeta elegida | La carpeta se renombró o se movió en el Disk. Añádela de nuevo con su ruta nueva con `folders add`. |
| La búsqueda no encuentra un archivo que sabes que está | Mira [cuando la búsqueda no encuentra nada](./search.md#when-search-finds-nothing). |
| Un PDF se encuentra por el nombre pero no por su texto | Es un escaneo sin capa de texto, o pesa más de 50 MB. `status` lista esos archivos con el motivo. |
| Una subida falla porque el Disk está lleno | Libera espacio en el Disk o vacía su papelera. Reintentar no sirve hasta que haya sitio. |
| Se rechaza una subida grande | Yandex limita el tamaño de un archivo según el plan: 1 GB sin un plan de Yandex 360, más con uno ([límites de Yandex](https://yandex.ru/support/yandex-360/customers/disk/web/ru/uploading)). |
| Un cambio terminó con "outcome_unknown", código de salida 14 | Yandex falló durante el cambio, así que puede que se hiciera o puede que no. Comprueba con `files show` antes de volver a ejecutarlo. |
| Un agente cambió un archivo que no querías que cambiara | Por MCP el nivel ask deja que un comando se ejecute. Deniega `files.delete` y `files.share`, o define `YDISK_READ_ONLY=1`. Mira [la conexión del agente](./mcp.md#decide-what-the-agent-may-change). Un archivo borrado está en la papelera del Disk: `files restore`. |
| El archivo de ajustes no se lee | `doctor` lista cada problema del archivo en `config.issues`. Ejecuta el `config unset` que da cada uno, `config repair`, o corrige el archivo a mano. |
| `doctor` lista `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que `doctor` imprime después de "to make it private:". |

## Códigos de salida

| Código | Significado |
| --- | --- |
| 2 | El comando se escribió mal: falta un perfil, un argumento o una opción. |
| 3 | Los ajustes o el llavero no se pueden usar. |
| 4 | Yandex rechazó el token. |
| 5 | No permitido: los permisos del token o los del perfil. |
| 6 | No existe ese archivo o carpeta, o el token no lo ve. |
| 7 | Un cambio necesita tu confirmación y no había terminal para preguntarla. |
| 8 | Yandex pidió ir más despacio. |
| 14 | Puede que un cambio se hiciera o puede que no. |

Todos los códigos están en la [referencia de comandos](./commands.md).

## Si sigue fallando

`ydisk runs list` muestra las ejecuciones recientes, y `ydisk runs show` una de ellas con cada paso que dio. Los
secretos están ocultos. `ydisk doctor reports create` escribe un archivo de informe para un reporte de error y dice qué
contiene. Abre una incidencia en [github.com/WireCatLabs/ydisk-cli/issues](https://github.com/WireCatLabs/ydisk-cli/issues)
con el código de error y el comando. No pegues nunca un token ni contenido privado en una incidencia.
