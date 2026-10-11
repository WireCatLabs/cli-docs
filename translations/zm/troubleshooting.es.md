---
title: "Solución de problemas"
---

Recupera un login bloqueado, datos ausentes o una operación de archivo fallida. Empieza por el síntoma,
corrige su causa y repite la comprobación indicada. Conserva los archivos completados y comprueba
un cambio remoto incierto antes de repetirlo.

## Acceso

### Aprobé en el navegador, pero el terminal espera

El navegador aprobó la app, pero el retorno no llegó al proceso. Deja abierto el terminal.
Copia `code=…&state=…` o la URL completa en la página WireCat y pégalo en **el mismo terminal
con `zm login` activo**, pulsando Enter. Debe informar `loggedIn: true` y devolver el indicador.
Si caducó, inicia otro intento y usa su retorno; el antiguo no completa uno nuevo.

Un navegador en otro dispositivo o un terminal remoto puede impedir el retorno automático.
[Sesiones](./sessions.md#finish-the-browser-callback) explica la finalización y el límite de cinco minutos.

### Zoom muestra "Invalid redirect"

Abre el entorno Development o Production elegido. **OAuth Redirect URL** y **OAuth Allow Lists**
deben contener `https://wirecat.dev/zoom-callback`; activa **Use Public Client OAuth**. Copia el
**Public Client ID**, configúralo y repite. El Client ID normal es distinto. El manifiesto inicial
no activa ese modo ni permisos. Sigue [la lista completa](./zoom-app.md#create-your-own-app) y
comprueba que el terminal termine.

### El navegador no se abre

Selecciona un navegador instalado explícitamente:

```sh
zm login --browser firefox
```

En un terminal interactivo, abre tú la URL de autorización impresa por ese login y pega el retorno
si hace falta. No reutilices una URL antigua. Sin entrada, el fallo del navegador termina pronto.
Para login canalizado/JSON hace falta `--interactive`; `--no-input` lo impide.

### La app no está disponible o necesita aprobación

Comprueba si el usuario puede instalar la app. Una app en desarrollo no está disponible automáticamente
fuera de la cuenta del desarrollador. Pide acceso al dueño o administrador; crear otra no evita la
política de empresa. [Reutilizar una app](./zoom-app.md#use-an-app-you-already-created) muestra los ajustes.
Puedes importar VTT autorizados sin la API.

### El login informa un error del almacén de contraseñas

El almacén debe estar instalado, activo y accesible para este usuario. Conecta desde el mismo
usuario/sesión del sistema donde esté disponible; un entorno sin escritorio puede carecer de él.
No se guarda el token en un archivo de texto. Tras repararlo, repite login y comprueba
`zm session status --json`.

### Falta un permiso necesario

El error indica el nombre exacto. El dueño lo añade en **Scopes** y guarda; el usuario repite
`zm login`. Comprueba lo concedido con `zm session status --json` y repite la lectura. Los tokens
emitidos no adquieren permisos automáticamente. Archivo, detalles, comprobación remota y cambios
necesitan [permisos distintos](./zoom-app.md#add-archive-or-management-access).

## Configuración

Comprueba cliente, fuente y perfil con `zm config show`. Una configuración dañada no impide
`--help` o `--version`, pero sus órdenes informan del error. Cambiar la etiqueta no cambia el usuario.
Si terminal y MCP ven datos distintos, compara `ZM_CONFIG_DIR` y `MESSAGING_STORE`.

## Respuestas de Zoom

El fallo de red y la respuesta inválida se informan por separado. Comprueba conectividad y si usaste
`--offline` para una orden que necesita Zoom. Los diagnósticos omiten texto crudo del proveedor.
Al informar, conserva orden, código y permiso; excluye retornos OAuth, tokens y texto privado.

## Reuniones o transcripciones ausentes

| Síntoma | Diagnóstico y reparación | Resultado |
|---|---|---|
| No hay perfil o la lista está vacía | Elige perfil e importa/descarga; leer no registra cuentas | `zm meetings list --json` muestra sus reuniones |
| No hay reuniones recientes del anfitrión | Revisa usuario, API y fechas; usa un `--since` anterior | Compara fechas con ocurrencias esperadas |
| Reunión sin texto | Revisa generación/retención y permisos; texto nunca guardado o expirado no se recrea | Abre texto tras estar disponible y descargar otra vez |
| Falta una reunión a la que asististe | Pide VTT al anfitrión o descarga con permiso e importa | Comprueba fecha, título y texto |
| El texto llegó después | Repite `zm pull --lookback-days 7` o un `--since` anterior | Abre el nuevo texto |
| Fallo parcial de descarga | Corrige y repite; la ocurrencia fallida no avanza el cursor | Revisa recibo y lista |
| Nombre/hora de archivo inválido | Usa `YYYY-MM-DD_HHMM_topic.vtt` y su zona; resuelve conflictos | Importación con fecha/título correctos |
| Búsqueda vacía | Comprueba texto, perfil y cobertura del índice | Abre un pasaje conocido y comprueba su disponibilidad |

Ejecuta descargas de una cuenta en serie. Consulta [ajustes de texto](./zoom-app.md#before-your-first-zm-pull),
[importación](./archive.md#downloaded-transcripts) y [cobertura](./search.md#search-stored-meetings).

## Archivos

- **No hay archivos disponibles:** revisa fechas, anfitrión, grabación y permisos. Transcripción y
  grabación en la nube son fuentes distintas.
- **Un bloqueo quedó tras un fallo:** inspecciona `recordings archive locks`, previsualiza
  `recordings archive recover` y añade `--yes` solo para bloqueos reconocidos de procesos muertos.
  Los activos o ajenos se conservan. Consulta [recuperación](./archive.md#locks-and-recovery).
- **La suma difiere:** conserva archivos y elige otro destino; no se sobrescriben conflictos.
  Verifica después el archivo.
- **Descarga interrumpida:** repite con el mismo perfil/destino para continuación verificada compatible.
  El punto de control conserva progreso, no demuestra integridad; verifica los archivos terminados.

## Cambios de reuniones remotas

El código de salida 14 indica una escritura enviada con resultado incierto. Lee la reunión remota o
mira Zoom antes de repetir; no hay reintentos automáticos. Tras resolver el síntoma, repite la lectura
mínima pertinente y vuelve a [tu tarea](./usage.md).
