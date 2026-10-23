---
title: "Resolver conexión o búsqueda vacía"
---

Recupera el funcionamiento si Drive no aparece, Google rechaza la conexión o no encuentras
un documento guardado. Empieza por el síntoma, comprueba el paso y verifica el resultado antes
de importar más datos o cambiar permisos. Guarda el código de error y el perfil para soporte.

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `drive doctor`: versión, si se lee el archivo de ajustes, los perfiles existentes y las rutas. No necesita perfil y no lee el llavero ni el almacén. |
| No se encuentra `drive` | Reabre la terminal/agente, comprueba que el directorio de comandos globales de npm está en PATH y repite [instalación](./installation.md). |
| Google bloquea el acceso | Revisa el error mostrado por Google y las políticas Workspace. Con tu propio cliente, comprueba también APIs, consentimiento y usuarios de prueba. |
| `google-api.disabled` | El propietario del proyecto OAuth debe habilitar la API solicitada; consulta [configuración de API](#google-api-is-disabled). Reconectar o conceder escritura no la habilita. |
| El acceso ha caducado | Repite `drive personal session start`. Añade `--client-file` solo para tu propia aplicación. Los permisos External Testing suelen caducar a los siete días. |
| No hay llavero del sistema | Conecta con `--credential-storage file` explícito si el almacenamiento privado en archivo es adecuado. |
| Búsqueda vacía | Ejecuta `status`, comprueba raíces con `folders list` y luego `sync`. Prueba una palabra conocida con `search --exact`. |
| Se omitió un archivo | Revisa tipo y permiso de descarga. Se importan Docs, Sheets, Markdown/TXT, PDF, `.docx`, `.xlsx` y CSV; PDF escaneados, Slides y accesos directos no se leen. |
| Sync se detuvo con errores | Repítelo: se reanuda el trabajo pendiente. No trates una importación parcial como completa. |
| Falta el componente de búsqueda semántica | Prepara la caché compartida según [búsqueda](./search.md#search-by-meaning) o usa `--exact`. |
| No se encuentra el destino del vínculo | Usa una referencia de la base seleccionada. Comprueba que todas las herramientas usan el mismo MESSAGING_STORE antes de vincular personas/proyectos del servicio de mensajería. |

```sh
drive doctor --json
drive personal status --json
drive personal folders list --json
drive personal sync --json
drive personal search 'known word' --exact --json
```

Al pedir ayuda, comparte el código de error sin datos privados y el comando. No incluyas JSON
del cliente, tokens ni texto privado. Cuando aparezca la fuente, vuelve a [búsqueda](./search.md).

## «Name a profile»

Ejecuta `drive personal status`, sustituyendo `personal` por tu cuenta, o define `DRIVE_PROFILE=personal`.
El error lista los perfiles existentes. Un antiguo perfil guardado no se elige; el error lo nombra.
Para la primera conexión, consulta [acceso](./installation.md#connect-your-account).
`drive session list` muestra todos los nombres configurados.

## La configuración Google Cloud resulta confusa

Habilitar una API no crea un cliente OAuth. Configura **Google Auth platform → Branding**,
añade la cuenta en **Audience → Test users**, crea **Clients → Desktop app** y descarga JSON.
Sigue [los pasos de la consola](./installation.md#prepare-google-sign-in).
Necesitas JSON Desktop, no clave API ni de cuenta de servicio.

## La aplicación Google está publicada pero falta conectar

Publicar la aplicación no autoriza tu cuenta ni este ordenador. Sigue el paso de
[conexión de la cuenta](./installation.md#connect-your-account) y aprueba el acceso en el navegador.
Con el cliente incluido de WireCat, los usuarios no repiten la configuración de Google
Cloud. Un cliente Desktop propio sigue siendo una alternativa. Google aún no ha terminado de revisar
la aplicación de WireCat, así que muestra un aviso de "aplicación no verificada" y la limita a 100
usuarios nuevos en total; consulta [el aviso](./installation.md#google-shows-an-unverified-app-warning).
Las políticas de Workspace también pueden limitar cuentas o autorizaciones disponibles.

## Google API está deshabilitada

La conexión puede ser válida aunque una API esté deshabilitada en el proyecto Google Cloud de
la aplicación. Por ejemplo, importar Sheets mediante la exportación XLSX de Drive puede funcionar
mientras fallan los comandos actuales `sheets`. `google-api.disabled` distingue este problema de
configuración del acceso al archivo o permisos OAuth. No confirma que exista una hoja concreta.

Con la aplicación incluida de WireCat, comunica a WireCat el comando y el error sin datos sensibles;
los usuarios no necesitan crear su propia app para corregir el proyecto de WireCat. Con tu propia
app, selecciona su proyecto en Google Cloud Console, abre **APIs & Services → Library**, busca la API
y pulsa **Enable**. Para operaciones actuales de Sheets, abre la
[página de Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com).
Comprueba el selector de proyecto antes de habilitarla. Consulta las
[instrucciones oficiales de API](https://developers.google.com/workspace/guides/enable-apis).

Espera a que el ajuste se propague y repite una lectura como `sheets info` con la hoja seleccionada
y el mismo perfil explícito. Habilitar una API no concede acceso al archivo ni permiso de escritura;
este error por sí solo no justifica reconectar con permisos más amplios.

## El contenido local difiere de Google

Comprueba la última sincronización y el trabajo pendiente con `drive personal --offline status --json`.
Las lecturas locales muestran esa versión. Ejecuta `drive personal sync --json` conectado para
actualizarla y repite la búsqueda. Los metadatos actuales, comentarios e historial necesitan
Google y se rechazan con `--offline`; `documents show` lee una fuente importada.

## El resultado de una escritura remota es desconocido

Si un comando informa de un resultado incierto tras un tiempo de espera o respuesta interrumpida,
revisa el archivo en Google antes de repetirlo. Crear o copiar de nuevo puede duplicar una
operación que sí se completó. La [referencia de comandos](./commands.md) explica los errores;
comparte el código de error sin datos privados, no respuestas del SDK ni contenido sensible.

## La actualización del almacén encuentra anotaciones

Drive conserva la base anterior si la reconstrucción dejaría fuera etiquetas, notas, recuerdos,
hechos o vínculos. Apunta `MESSAGING_STORE` al archivo anterior para seguir usando esas anotaciones.
Usa la misma ruta en las demás herramientas WireCat si deben buscar esos datos. No borres el archivo
anterior ni reinicies su punto de control para saltarte esta protección. Para copiar el contexto, ejecuta `drive personal status --json`: `store.checkpoint` muestra la
base anterior. Sigue [la receta de copia](./recipes.md#keep-notes-when-changing-databases).
`store check` previsualiza recuentos y conflictos sin cambiar archivos. `store import` exige su
fingerprint y solo guarda el punto de control después de confirmar la copia. Conserva el original.
Los proyectos/tareas ausentes necesitan correspondencias explícitas; resuelve primero las diferencias
de contenido, identidades o alias. Una copia interrumpida y sin cambios se reintenta sin duplicar notas.

Si el esquema de origen es anterior a la versión 2, actualiza primero una copia separada; la
transferencia no migra el original. Puedes indicar esa copia si sus hashes coinciden con la caché del
perfil. Los grafos grandes se rechazan sin copia parcial. Detén otros escritores del origen durante
el cambio: esta operación no mantiene sincronizadas dos bases.

Si el error indica que falta una copia, ejecuta `drive personal sync --rescan` para volver
a descargar el árbol seleccionado. Esto no omite la protección de las anotaciones.
