---
title: "Archivo local"
---

Mantén el texto consultable y copia las grabaciones antes de que Zoom las elimine por retención.
Elige obtener reuniones del anfitrión, importar una transcripción o archivar audio/vídeo en la nube.
El texto de la base y los medios de una carpeta son copias distintas; una copia de vídeo no se vuelve
consultable automáticamente en la base.

## Elige qué conservar

| Fuente disponible | Uso | Comprobación |
|---|---|---|
| Reuniones del anfitrión accesibles para la app | `zm personal meetings sync --lookback-days 7` | Lista, una transcripción y partes ausentes |
| Archivos VTT descargados | `zm personal meetings import ./downloaded-transcripts` | Fecha/título frente al original |
| Grabaciones en la nube | Lista o descarga | Manifiesto del destino y sumas |
| VTT archivados para búsqueda | Importación del archivo | Recibo y búsqueda del texto guardado |

Para la API, conecta la app con [los permisos de la tarea](./zoom-app.md#add-archive-or-management-access).
La importación y la inspección local no requieren login. Empieza por una reunión antes de configurar
obtención repetida o copia diaria.

## Dónde se guardan las reuniones

Acceso, grabaciones y comandos remotos funcionan sin la base de reuniones. Importación, descarga,
seguimiento y lectura usan el adaptador SQLite publicado: abre conexiones al necesitarlas y las
cierra antes del resultado. `MESSAGING_STORE` elige la base compartida. Modelo, exportación y procesamiento
vienen de `@wirecat/cli-core/meetings`.

La base es `wirecat.db`. Abrirla conserva los archivos antiguos `messages.db` y sus archivos
`-wal` y `-shm`. Gestiona su conservación aparte de importar o leer reuniones.

Elige un [perfil local](./sessions.md#select-a-local-profile) antes de importar o descargar.

## Descargar reuniones organizadas

Selecciona la API, descarga un periodo reciente y comprueba el resultado:

```sh
zm config set source api
zm personal meetings sync --lookback-days 7
zm personal meetings list --json
zm personal meetings transcript <meeting-id> --json
```

Usa un ID de la lista. `zm personal meetings sync` obtiene reuniones del anfitrión y participantes, transcripciones
 y resúmenes disponibles. No crea texto ausente. Comprueba [generación y retención](./zoom-app.md#before-your-first-zm-meetings-sync)
si falta la transcripción.

`meetings sync --lookback-days 7` revisa siete días; `meetings sync --since-time 2026-10-01` recupera transcripciones tardías
anteriores. El cursor no garantiza esa revisión. Serializa descargas de una cuenta para evitar
crear eventos simultáneos. Una reunión fallida no cambia el cursor y se puede reintentar.

## Transcripciones descargadas

Si solo asististe, pide un VTT al anfitrión o descárgalo si tienes permiso. Asistir no garantiza acceso.
Pon el archivo directamente en la carpeta elegida y usa su fecha/hora/título, por ejemplo
`2026-10-01_1000_example-planning.vtt`. Renombrarlo no cambia su contenido.

```sh
zm config set files.timezone Europe/Madrid
zm personal meetings import ./downloaded-transcripts
zm personal meetings list --json
```

La fuente lee archivos `.vtt` y `.txt` directamente en la carpeta, sin recursión. Los nombres usan
`YYYY-MM-DD_HHMM_topic-slug.vtt` o `.txt`. Un `.txt` es la forma que escribía zoom-searcher: una cabecera
(`Встреча:` título, `Дата:` inicio, `Zoom ID:`, `Говорят:` oradores) y después líneas `[hh:mm:ss] Speaker: text`. Su
título sustituye al del nombre del archivo; su hora (como la del nombre) es cuando terminó la grabación, así que el
inicio es esa hora menos el desplazamiento de la última línea, su ID de reunión de Zoom pasa a ser la clave de la
serie y sus oradores pasan a ser participantes solo de esa reunión, con el nombre como clave, nunca una misma persona
entre reuniones. Un `.txt` y un `.vtt` con el mismo nombre son una reunión, y se lee el `.txt`. El ID deriva del
momento y tema normalizado; no hay UUID de Zoom. Los participantes de un `.vtt` quedan desconocidos: los nombres de
hablantes se conservan sin adivinar identidades. `zm personal meetings import` nombra la zona en que leyó las horas
de los archivos (`timezone`), y `zm personal meetings import --help` la muestra antes de ejecutar. Comprueba fecha,
título y texto antes de vincular proyectos o personas.

La hora del nombre de un archivo se lee en la zona de este ordenador. `files.timezone` elige la zona IANA usada en
los nombres cuando es distinta, como `Europe/Madrid`; el almacenamiento sigue en UTC. Horas ambiguas o inexistentes
se rechazan. Contenidos distintos de una clave normalizada dan error:
resuelve el conflicto antes de repetir. Un nombre inválido falla explícitamente, sin importar
parte de la carpeta en silencio.

## Observar nuevas reuniones

`zm personal watch api --lookback-days 7 --jsonl` repite descargas. `zm personal watch files [folder]` observa una
carpeta de transcripciones; si falta, usa `files.folder`. Sin ambos argumentos se aplica el origen
configurado. La API necesita red y admite `--since-time` y solapamiento de 0–31 días. Tras guardar el cursor se usa este con el solapamiento; fallos retienen
la primera frontera. El solapamiento se resta también del primer `--since-time`.
`--pause` es la pausa entre ciclos. Perfil, origen, ajustes y cliente OAuth se capturan al
inicio; reinicia tras cambiarlos. Los ciclos no se superponen y cierran la base antes de confirmar.
Detén con Ctrl-C.

Para una carpeta:

```sh
zm personal watch files ./downloaded-transcripts --pause 10s --jsonl
```

Cada ciclo revisa de nuevo los archivos, incluidas correcciones antiguas, importa en serie, cierra
la base y espera que se vacíe la salida. Intervalos de un segundo a un día. Funciona en primer plano
hasta Ctrl-C. Sin terminal necesita `--jsonl`, no `--json`. Elige un perfil antes de empezar.

Cancelar durante el cierre da hasta un segundo para entregar la confirmación completa. Una tubería
bloqueada detiene esa entrega y no empieza otro ciclo.

## Archivar grabaciones en la nube

`zm` guarda vídeo, audio, transcripciones y chat disponibles. Elige reunión y destino:

```sh
zm personal recordings list --since-time 2026-10-01 --until-time 2026-10-10 --json
zm personal recordings show <zoom-occurrence-uuid> --json
zm personal recordings download <zoom-occurrence-uuid> --output-dir ./zoom-archive --json
zm personal recordings archive check ./zoom-archive --offline --json
```

Sustituye `<zoom-occurrence-uuid>` por el UUID devuelto en la lista, no un ID local o número de reunión
Zoom. El recibo identifica archivos guardados y no disponibles. La verificación compara archivos con
su manifiesto; no demuestra que Zoom tuviera todas las grabaciones. Si la lista está vacía, comprueba
datos, cuenta anfitriona, disponibilidad y permisos antes de ampliar el periodo. Sin `--until-time` la lista termina
hoy en la zona del ordenador, o en `--timezone`, y `meta.timezone` nombra esa zona.

Para historial por meses:

```sh
zm personal recordings download --since-time 2026-01-01 --until-time 2026-10-10 --output-dir ./zoom-archive --jsonl
```

Las fechas deben estar ordenadas y abarcar como máximo diez años. Se hacen peticiones mensuales,
se deduplican UUID y se descarga en serie. Cada registro item de JSONL confirma una reunión; resultados y archivos
anteriores permanecen si falla otra. Repite un período para descubrir archivos nuevos. Con perfil
se guarda progreso y registros pendientes. `--recheck-since-time YYYY-MM-DD` revisa fechas recientes,
`--checkpoint` elige su archivo, `--max-pages` y `--max-entries` limitan descubrimiento.
Usa `--jsonl` para recibir confirmaciones conforme termina cada descarga, o `--json` para una lista
acotada que se devuelve al terminar todo el intervalo. Una tubería recibe JSON por defecto. Si falla una
ejecución agregada, no imprime JSON parcial; los archivos completos y los puntos de control duraderos se
conservan para el siguiente intento. No se puede combinar un ID de reunión con las opciones de intervalo;
`--file-ids` solo sirve para una reunión.

`recordings sync` ya no existe: usa `recordings download` con las mismas fechas. Si un permiso guardado
nombra `recordings.sync`, los comandos se detienen con instrucciones de migración. Revisa esa entrada y
sustitúyela por `recordings.download`, conservando las demás restricciones. La nueva clave cubre tanto la
descarga de una reunión como la de un intervalo. Consulta [permisos del perfil](./configuration.md#permissions).

Los puntos de control confirman operaciones anteriores, no integridad actual ni acceso a todas
las grabaciones. Comprueba archivos con `recordings archive check`. `--no-resume` examina de
nuevo todo el período sin progreso persistente.

Las listas aceptan hasta 31 días. La descarga escribe en disco sin cargar el vídeo completo.
El límite es 20 GiB por archivo, ajustable con `--max-bytes`. `--file-ids` elige IDs separados por
comas. Solo guarda archivos completos descargables; otros se informan aparte. Permisos, retención
y funciones de cuenta limitan el acceso. Asistir a una reunión no garantiza acceso a su grabación.

Los manifiestos contienen metadatos, tamaños y SHA-256, sin URLs firmadas ni tokens. Repetir verifica
y omite archivos coincidentes. Si tamaño y fecha de modificación no cambian desde la última
verificación (`.zoom-verified.json`), no vuelve a calcular su hash. `recordings archive check` siempre
calcula el hash de todos. No sobrescribe: usa otro destino si no coinciden. Descargas y sincronización
actúan para el perfil nombrado primero (`zm personal recordings …`); el archivo pertenece a esa cuenta.
Se conservan partes verificadas y se reanuda solo con validador fuerte y rango coincidentes. Una
representación cambiada reinicia con seguridad. `--no-resume` usa partes temporales. Entradas completas permanecen tras errores posteriores.

## Bloqueos y recuperación

La inspección local no necesita acceso ni base. Se rechazan escritores simultáneos al destino.
Una descarga recupera por sí sola el bloqueo de un proceso terminado en este equipo.
Para los demás casos, inspecciona `recordings archive locks` y revisa `recordings archive recover`.
`--yes` quita bloqueos reconocidos de procesos terminados en este equipo; conserva activos, ajenos
y desconocidos. Solo elimina marcadores. La continuación recupera una publicación completa si
coinciden diario propio, parte verificada y archivo final; archivos ajenos quedan protegidos.

Si el archivado informa de que perdió el bloqueo de escritura o cambió su propietario, revisa
el destino y los registros de bloqueo antes de reintentar. Verifica las sumas de los archivos
completados: la limpieza puede fallar después de guardar archivos, aunque no se devuelva una
confirmación de descarga correcta.

## Copias diarias

Elige destino absoluto y zona del temporizador:

```sh
zm personal recordings schedule create --name daily --output-dir /home/AliceExample/zoom-archive --since-time 2026-01-01 --at 03:15 --timezone Europe/Madrid --json
zm personal recordings schedule list --offline --json
zm personal recordings schedule run <schedule-id> --jsonl
zm personal recordings schedule disable <schedule-id> --yes --json
```

Primero se muestra un plan. `--yes` instala un temporizador de usuario systemd en Linux; `--dry-run`
prevalece. La instalación automática solo admite Linux. El temporizador sigue IANA; el descubrimiento
usa UTC y revisa siete días por defecto. Necesita servicios de usuario systemd; los planes sirven
en otras plataformas. Guarda perfil, client ID público, destino y rutas de configuración y ejecución,
sin credenciales. Perfil y cliente deben seguir elegidos para ejecutar. El estado refleja la última
operación confirmada; lista y detalles no consultan el temporizador. Desactivar conserva trabajos y archivos.

## Leer e importar transcripciones archivadas

Los nombres usan hashes y las identidades quedan en manifiestos:

```sh
zm personal recordings archive transcript ./zoom-archive --offline --json
zm personal search recordings ./zoom-archive "example plan" --limit 100 --offline --json
```

Se verifica tamaño y SHA-256 de cada WebVTT antes de devolver pasajes. La búsqueda se detiene al
hallar un resultado adicional al límite y no lee archivos posteriores. No necesita acceso,
configuración ni base. La lectura de transcripciones acepta `--uuid` o `--file-ids` para elegir datos
y `--max-bytes` para ajustar el límite de 8 MiB por archivo; la búsqueda rechaza una transcripción mayor.
Busca texto normalizado por Unicode y minúsculas, sin nombres de hablantes. Límite 100, máximo 1000.
`has_more` indica otro resultado: amplía el límite o reduce la consulta. No hay
cursor. `--max-output-bytes` limita la salida; un fallo de verificación no da éxito.

Para importar al perfil:

```sh
zm personal recordings archive import ./zoom-archive --offline --jsonl
```

Verifica todos los VTT antes de abrir la base. Límites: 8 MiB por archivo, 64 MiB totales;
`--max-bytes` y `--max-total-bytes` los cambian. Elige `--uuid` o `--file-ids`. Añade cada reunión
atómicamente por UUID original, conservando otras transcripciones, resúmenes, participantes y cursor.
Correcciones retienen revisiones; hashes idénticos son idempotentes. Sin inicio conocido solo se
añade a una reunión existente. Confirma reuniones disponibles o indica las ausentes. Si hay recibos
exactos, muestra creación, inserciones, repeticiones y sustituciones de la misma transacción;
los adaptadores antiguos no inventan cifras. Adiciones anteriores pueden quedar guardadas si falla otra.

## Transcribir audio local

Crea una transcripción independiente para una reunión guardada:

```sh
zm models download parakeet-v3
zm personal meetings transcribe 1 ./AliceExample.m4a --model parakeet-v3 --json
zm personal meetings transcribe 1 ./AliceExample.m4a --model parakeet-v3 --yes --json
```

El plan verifica el archivo y describe el componente sin abrirlo. `--yes` reconoce con uno local
instalado y añade atómicamente el resultado; `--dry-run` prevalece. La transcripción nunca descarga un
componente: `zm models list kind:audio` muestra los modelos que conoce esta versión y `zm models download <model>`
descarga uno a la carpeta que comparten todas las CLI de WireCat, comprobando el sha256 de cada archivo; ejecútalo
de nuevo para reparar un modelo cuyos archivos son de otra versión. Un PCM16 WAV mono o estéreo a 16 o 48 kHz se
lee tal cual; cualquier otra cosa (las grabaciones MP4 y M4A de Zoom, otro audio y vídeo) la decodifica antes el
`ffmpeg` instalado en este ordenador, en una carpeta temporal privada que se borra después. El mismo archivo
siempre da el mismo audio, así que transcribirlo de nuevo es una repetición. `--models-dir` elige un directorio
absoluto. Limita bytes, duración, segmentos y texto con `--max-bytes`, `--max-duration`, `--max-segments`
y `--max-text-bytes`. Las marcas de tiempo indican ventanas de hasta 30 segundos; hablantes desconocidos.
Se conservan fuentes del proveedor e historial; el recibo muestra cifras y procedencia.

El reconocimiento necesita un componente de voz compatible instalado; no se presupone que exista.
Una grabación que no es un WAV listo necesita `ffmpeg` en `PATH`; zm no lo instala. Tras aplicar,
abre `meetings transcript` y revisa palabras y ventanas de tiempo antes de usarlo como evidencia.
Continúa con [búsqueda y citas](./search.md).
