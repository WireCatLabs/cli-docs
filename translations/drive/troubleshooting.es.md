---
title: "Resolver conexión o búsqueda vacía"
---

Recupera el funcionamiento si Drive no aparece, Google rechaza la conexión o no encuentras
un documento guardado. Empieza por el síntoma, comprueba el paso y verifica el resultado antes
de importar más datos o cambiar permisos. Guarda el código de error y el perfil para soporte.

| Síntoma | Qué hacer |
| --- | --- |
| No se encuentra `drive` | Reabre la terminal/agente, comprueba que el directorio de comandos globales de npm está en PATH y repite [instalación](./installation.md). |
| Google bloquea el acceso | Revisa el error mostrado por Google y las políticas Workspace. Con tu propio cliente, comprueba también APIs, consentimiento y usuarios de prueba. |
| El acceso ha caducado | Repite `drive personal session start`. Añade `--client-file` solo para tu propia aplicación. Los permisos External Testing suelen caducar a los siete días. |
| No hay llavero del sistema | Conecta con `--credential-storage file` explícito si el almacenamiento privado en archivo es adecuado. |
| Búsqueda vacía | Ejecuta `status`, comprueba raíces con `folders list` y luego `sync`. Prueba una palabra conocida con `search --exact`. |
| Se omitió un archivo | Revisa tipo y permiso de descarga. Se admiten Google Docs y Markdown/TXT; PDF, Office, Sheets, Slides y accesos directos no se importan. |
| Sync se detuvo con errores | Repítelo: se reanuda el trabajo pendiente. No trates una importación parcial como completa. |
| Falta el componente de búsqueda semántica | Prepara la caché compartida según [búsqueda](./search.md#search-by-meaning) o usa `--exact`. |
| No se encuentra el destino del vínculo | Usa una referencia de la base seleccionada. Comprueba el almacenamiento compartido antes de vincular personas/proyectos del servicio de mensajería. |

```sh
drive personal status --json
drive personal folders list --json
drive personal sync --json
drive personal search 'known word' --exact --json
```

Al pedir ayuda, comparte el código de error sin datos privados y el comando. No incluyas JSON
del cliente, tokens ni texto privado. Cuando aparezca la fuente, vuelve a [búsqueda](./search.md).

## «Choose a profile explicitly»

Ejecuta `drive personal …` o `drive --profile personal …`, sustituyendo `personal` por tu cuenta.
El error lista perfiles configurados. Ni `DRIVE_PROFILE` ni un antiguo perfil guardado sustituyen
la selección. Para la primera conexión, consulta [acceso](./installation.md#connect-your-account).
`drive personal session list` muestra todos los nombres configurados.

## La configuración Google Cloud resulta confusa

Habilitar una API no crea un cliente OAuth. Configura **Google Auth platform → Branding**,
añade la cuenta en **Audience → Test users**, crea **Clients → Desktop app** y descarga JSON.
Sigue [los pasos de la consola](./installation.md#prepare-google-sign-in).
Necesitas JSON Desktop, no clave API ni de cuenta de servicio.

## La aplicación Google está publicada pero falta conectar

Publicar la aplicación no autoriza tu cuenta ni este ordenador. Sigue el paso de
[conexión de la cuenta](./installation.md#connect-your-account) y aprueba el acceso en el navegador.
Con el cliente incluido de WireCat, los usuarios no repiten la configuración de Google
Cloud. Un cliente Desktop propio sigue siendo una alternativa. Las políticas de Workspace y la
verificación de permisos de Google pueden limitar cuentas o autorizaciones disponibles.

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
