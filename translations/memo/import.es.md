---
title: "Importar archivos y registros"
---

Esta página te ayuda a traer a Memo datos que ninguna herramienta de WireCat sincroniza: una carpeta de archivos de
texto, transcripciones o los registros que escribe un pequeño script tuyo. Tras la importación los encuentran
`memo search`, un agente por MCP y todo lo demás que lee el almacén de Memo, junto a tus mensajes, tu correo y tus
notas.

```sh
memo import ~/Documents/handbook --account import:handbook --dry-run
memo import ~/Documents/handbook --account import:handbook
memo import crm-notes.jsonl --account import:crm-notes
```

## La cuenta

Cada importación indica la cuenta a la que pertenece con `--account <provider>:<account>`. Memo nunca elige una por
ti: sin `--account`, el error lista las cuentas que ya tienen importaciones. Una cuenta nueva se crea la primera vez
que la nombras.

- **`import:<name>`** para documentos, notas y exportaciones: `import:handbook`, `import:crm-notes`.
- **`phone:<exchange>`** para transcripciones de llamadas, junto a las llamadas de esa centralita: `phone:office-pbx`.

Los archivos solo van a estos dos proveedores, que no pertenecen a ninguna sincronización. Cualquier otra cuenta, como
la de un mensajero o la de Drive, se rechaza (`record.provider-not-imported`): es de su propia sincronización. Usa una
cuenta por fuente, y así `memo search --source import:handbook` encuentra solo sus documentos.

## Qué lee la importación de una carpeta

| Archivo | Se convierte en |
|---|---|
| `.txt`, `.text` | Un documento cuyo título es el nombre del archivo |
| `.md`, `.markdown` | Un documento cuyo título es el primer encabezado, después del front matter, o si no el nombre del archivo |
| `.pdf`, `.docx` | Un documento que leen en este ordenador los lectores de [Archivos que Memo puede leer](./notes.md#files-memo-can-read). Su título es el del propio archivo, o si no su nombre. Un PDF escaneado no tiene texto y se omite |
| `.vtt`, `.srt` | Una transcripción: una línea `Name: text` por intervención, como la guarda [Fuentes que añades a mano](./sources.md#add-a-source). Los tiempos y los hablantes van a `metadata.transcript` |
| `.wav`, `.mp3`, `.m4a`, `.ogg`, `.opus`, `.flac` | Con `--transcribe`, lo que se dijo, reconocido en este ordenador ([Grabaciones](#recordings)). Sin esa opción, la grabación se omite |
| `.json`, `.jsonl` indicado por sí solo | Registros, tal como los lee `memo records import` ([Integraciones propias](#custom-integrations)) |

Memo recorre la carpeta y sus subcarpetas. Deja fuera los nombres que empiezan por `.` (`.git`, `.obsidian`). La
respuesta lista en `skipped` cada otro archivo que no importó, con el motivo: un tipo de archivo sin lector, un
archivo que no es texto UTF-8, un archivo vacío o un enlace simbólico.

En lugar de una carpeta puedes indicar un solo archivo `.txt` o `.md`. Su documento se identifica solo por el nombre
del archivo, así que dos archivos con el mismo nombre de carpetas distintas son un solo documento. En ese caso, importa
su carpeta.

## Grabaciones

```sh
memo import ./recordings --account import:voice-memos --transcribe
```

`--transcribe` reconoce cada grabación con el modelo de voz local `parakeet-v3`, que entiende 25 idiomas. La grabación
nunca sale de este ordenador. Cada fragmento que reconoció el modelo es una línea del texto del documento, con el
momento en que empieza en la grabación:

```text
[00:00] Depot, good morning.
[01:01] The crane is due Friday.
```

- **El modelo no se descarga solo.** Ocupa unos 670 MB. Sin él, la importación se detiene antes de escribir nada e
  indica el comando que lo descarga una vez, como `tg models download parakeet-v3`. Todas las herramientas de WireCat
  de este ordenador lo comparten.
- **Una grabación se reconoce una sola vez.** Su documento guarda el hash de los bytes de la grabación. La siguiente
  importación con `--transcribe` encuentra el mismo hash y vuelve a enviar el texto guardado, así que la grabación no
  se reconoce de nuevo y el documento queda `unchanged`. Una grabación modificada se reconoce otra vez.
- `--dry-run` no transcribe: lista las grabaciones nuevas en `skipped`.
- Una grabación se trata como una sola voz: no distingue a los hablantes. Una grabación de más de una hora, o una que
  el decodificador no puede leer, aparece en `skipped` y el resto de la carpeta se importa.
- Memo lee MP3, Ogg, Opus y FLAC con sus propios decodificadores. WAV, M4A y otros formatos necesitan `ffmpeg`
  instalado.

## Repítela cuando quieras

- **La misma carpeta dos veces no cambia nada.** Cada archivo se identifica por su ruta dentro de la carpeta, así que
  la segunda ejecución responde `unchanged` para cada archivo.
- **Un archivo editado actualiza su propio documento.** Se sustituyen su texto, su título y sus fechas, y el documento
  conserva su referencia, así que los enlaces y los hechos que lo citan siguen apuntando a él.
- **Un archivo que desaparece de la carpeta se queda.** Memo no borra lo que importaste cuando el archivo desaparece.
  Para quitar uno, envía un registro `delete` para él ([Integraciones propias](#custom-integrations)).
- **Un archivo renombrado o movido es un documento nuevo.** La ruta es su clave.
- **Una carpeta movida actualiza cada documento una vez.** Las rutas dentro de ella no cambian, así que no se añade
  ningún documento, pero la `url` de cada uno indica el nuevo lugar.
- Un archivo cuya fecha de modificación cambió pero cuyo texto no, cuenta como `updated`.

`--dry-run` lee todos los archivos y planifica la importación sin escribir nada. Mientras se ejecuta, bloquea la
escritura en el almacén. `--json` muestra el recibo para un script.

## Qué se guarda

Cada archivo es un registro `document` con:

| Campo | Valor |
|---|---|
| `title` | El primer encabezado Markdown, o el nombre del archivo sin su extensión |
| `text` | El texto del archivo |
| `created_at` | Cuándo se creó el archivo, si el sistema de archivos lo indica; si no, su fecha de modificación |
| `updated_at` | Su fecha de modificación |
| `url` | La dirección `file://` del archivo en este ordenador |
| `metadata.path` | Su ruta dentro de la carpeta |
| `metadata.format` | `text`, `markdown`, `pdf`, `docx`, `vtt` o `srt` |
| `metadata.extractor` | El lector de un archivo PDF o Word, con su versión |
| `metadata.transcript` | Para una transcripción: `cues`, `start_seconds`, `end_seconds` y `speakers` |
| `metadata.audio` | Para una grabación: su duración en `seconds`, el `model` de voz y el número de `pieces` |
| `metadata.sha256` | El hash de los bytes del archivo |
| `metadata.size` | Su tamaño en bytes |

El recibo dice qué ejecución lo escribió: su `source.batchId` indica la hora de la importación, y la ejecución de un
agente añade el nombre del agente.

## Límites

- **10.000 archivos** en una importación de carpeta. Un árbol más grande se rechaza entero: importa sus carpetas una a
  una.
- **32 niveles de carpetas.** Las carpetas más profundas aparecen en `skipped`.
- **50 MiB** por archivo, **256 MiB** por grabación. Un archivo más grande se omite.
- **Un millón de caracteres** de texto por documento, dentro de 1 MiB. Un texto más largo se corta: la respuesta lista
  el archivo en `cut` y su `metadata.truncated` es `true`.

## Seguridad

- **Nada sale de este ordenador.** Memo lee los archivos donde están y solo escribe en su almacén local.
- **Los enlaces no se siguen.** Un enlace simbólico dentro de la carpeta se omite, así que una importación nunca lee
  un archivo fuera de la carpeta que indicaste. La propia carpeta que indicas sí puede ser un enlace.
- **Sin credenciales.** Un archivo cuyo texto contiene algo con forma de credencial, como una clave privada o un token
  `Bearer`, se rechaza y aparece en `skipped` (`record.secret-field`). Los demás archivos se importan.
- **El texto son datos.** Memo lo guarda y busca en él, y no ejecuta nada de su contenido. Un agente que lee un
  documento importado lo lee como fuente, no como instrucciones.
- **La importación de un agente queda a nombre del agente.** Si se ejecuta desde la terminal de un agente, el campo
  `by` del recibo nombra al agente. Por MCP, un agente no puede ejecutar `memo import`: entrega los registros con
  `records import`.

## Integraciones propias

Una fuente sin herramienta de WireCat llega a Memo mediante un archivo de registros: el **sobre de registros**, un
formato JSON con versión que leen tanto `memo import` como `memo records import`. Un script obtiene los datos de la API
o de una exportación de la fuente, escribe el sobre y se lo da a Memo. No necesitas conocer la base de datos de Memo.

El sobre en JSONL: la primera línea indica la versión del formato y la fuente, y cada línea siguiente es un registro.

```jsonl
{"schema_version":1,"source":{"provider":"import","account":"crm-notes","batch_id":"2026-11-13"}}
{"key":"p1","type":"person","external_id":"contact-17","operation":"upsert","fields":{"name":"Ana Example","email":"ana@example.com"}}
{"key":"n1","type":"document","external_id":"note-901","operation":"upsert","fields":{"title":"Delivery call","text":"The crane is due Friday.","created_at":"2026-11-10T09:02:00+01:00","metadata":{"manager":"reception"}},"relations":[{"role":"about","type":"person","external_id":"contact-17"}]}
```

- **`external_id` es el id del registro en la fuente.** Mantenlo estable: el mismo id es el mismo registro en cada
  ejecución, así que volver a ejecutar el script actualiza lo que cambió y deja el resto. Nunca uses un número de fila
  ni la hora de la ejecución.
- **`operation`** es `upsert`, o `delete` para quitar un registro que enviaste antes.
- **`fields`** contienen los datos del registro. Las claves que un tipo no conoce se guardan tal como llegan.
  `metadata` guarda todo lo demás que valga la pena saber.
- **`relations`** enlazan registros de la misma cuenta, o una entidad del almacén por `ref`: un documento `about` una
  persona, una organización, un trato o una llamada.
- `memo records templates show <type> --format json` muestra un registro de ejemplo de cada tipo. El formato completo,
  cada tipo y cada regla están en [The records envelope](https://github.com/WireCatLabs/cli-core/blob/main/docs/storage/records-envelope.md).

Comprueba un archivo antes de escribirlo y luego impórtalo:

```sh
memo import crm-notes.jsonl --account import:crm-notes --dry-run
memo import crm-notes.jsonl --account import:crm-notes
```

### Un adaptador de fuente en 20 líneas

Este script de Node convierte una exportación de notas de un CRM separada por tabuladores (`id`, `date`, el correo del
cliente, `text`) en el sobre por stdout: cada cliente es una persona identificada por su correo, y cada nota un
documento sobre esa persona. Memo lo lee desde stdin con `-`:

```js
// notes-to-envelope.mjs: node notes-to-envelope.mjs notes.tsv | memo import - --account import:crm-notes
import { readFileSync } from "node:fs"

const [, ...rows] = readFileSync(process.argv[2], "utf8").trim().split("\n")
const line = (value) => process.stdout.write(`${JSON.stringify(value)}\n`)
const people = new Set()

line({ schema_version: 1, source: { provider: "import", account: "crm-notes", batch_id: new Date().toISOString() } })
for (const row of rows) {
  const [id, date, email, text] = row.split("\t")
  if (!people.has(email)) {
    people.add(email)
    line({ key: email, type: "person", external_id: email, operation: "upsert", fields: { name: email, email } })
  }
  line({
    key: id, type: "document", external_id: `note-${id}`, operation: "upsert",
    fields: { title: `Note ${id}`, text, created_at: date },
    relations: [{ role: "about", type: "person", external_id: email }],
  })
}
```

Las fechas deben llevar su desfase horario (`2026-11-10T09:00:00+01:00`). Una persona se identifica por un correo
exacto, nunca por el nombre. Si ningún contacto tiene ese correo, se crea una persona nueva.

### Ejemplo: historial de llamadas de Asterisk

Una centralita [Asterisk](https://www.asterisk.org/) escribe un registro de detalle de llamada (CDR) por cada llamada,
en `/var/log/asterisk/cdr-csv/Master.csv`, y puede grabar llamadas con MixMonitor. Este script hace que las llamadas se
puedan buscar: cada llamada pasa a ser un evento `call`, y la transcripción de su grabación, cuando la hay, un
documento `about` esa llamada. Ambos van a la cuenta `phone:office-pbx`.

El script toma el texto de cada grabación de un archivo `.txt` junto a ella, que puede escribir cualquier herramienta
local de reconocimiento de voz. Usa este camino o
`memo import /var/spool/asterisk/monitor --account phone:office-pbx --transcribe`, no los dos: ese comando también
importa los archivos `.txt` que encuentra allí, y las mismas palabras se guardarían dos veces.
`memo import --transcribe` crea un documento por grabación, pero sin enlazarlo con su llamada.

Convierte el CDR en el sobre:

```js
// asterisk-cdr.mjs: node asterisk-cdr.mjs Master.csv +01:00 | memo import - --account phone:office-pbx
import { existsSync, readFileSync } from "node:fs"

const [file, offset] = process.argv.slice(2)
const cells = (row) => {
  const out = [""]
  let quoted = false
  for (let i = 0; i < row.length; i++) {
    if (row[i] === '"' && quoted && row[i + 1] === '"') out[out.length - 1] += row[i++]
    else if (row[i] === '"') quoted = !quoted
    else if (row[i] === "," && !quoted) out.push("")
    else out[out.length - 1] += row[i]
  }
  return out
}
const line = (value) => process.stdout.write(`${JSON.stringify(value)}\n`)

line({
  schema_version: 1,
  source: { provider: "phone", account: "office-pbx", batch_id: new Date().toISOString() },
  options: { phone_region: "es" },
})
for (const row of readFileSync(file, "utf8").trim().split("\n")) {
  const c = cells(row)
  const [src, dst, start, seconds, disposition, id, recording] = [c[1], c[2], c[9], c[13], c[14], c[16], c[17]]
  const inbound = dst.length <= 4
  const startedAt = `${start.replace(" ", "T")}${offset}`
  line({
    key: id, type: "event", external_id: id, operation: "upsert",
    fields: {
      kind: "call", phone: inbound ? src : dst, started_at: startedAt, duration: Number(seconds),
      direction: !inbound ? "out" : disposition === "ANSWERED" ? "in" : "missed",
    },
  })
  const transcript = recording && recording.replace(/\.\w+$/, ".txt")
  if (!transcript || !existsSync(transcript)) continue
  line({
    key: `t-${id}`, type: "document", external_id: `transcript-${id}`, operation: "upsert",
    fields: {
      title: `Call ${inbound ? "from" : "to"} ${inbound ? src : dst}`,
      text: readFileSync(transcript, "utf8"),
      created_at: startedAt,
      metadata: { recording, disposition },
    },
    relations: [{ role: "about", type: "event", external_id: id }],
  })
}
```

- **El `uniqueid` del CDR es el id del registro.** Es estable, así que ejecutar el script cada noche actualiza las
  llamadas que cambiaron y añade las nuevas.
- **El CDR no tiene zona horaria.** Pasa el desfase de la centralita (`+01:00`), o `+00:00` cuando `cdr.conf` define
  `usegmtime=yes`. El sobre rechaza una hora sin desfase.
- **`phone_region`** lee los números locales sin `+` como números de ese país, así que una llamada se enlaza con la
  persona cuyo contacto tiene ese número.
- Las columnas son las de `cdr_csv` con `loguniqueid` y `loguserfield` activados: el `uniqueid` es la columna 17 y el
  `userfield` la 18. El script lee la ruta de la grabación del `userfield`, que el plan de marcación rellena con
  `Set(CDR(userfield)=${MIXMONITOR_FILENAME})`. Una plantilla `cdr_custom` necesita su propio orden. Los números de
  cuatro cifras o menos se toman como extensiones internas. Comprueba las columnas con tu propio `Master.csv` antes
  de la primera ejecución.
