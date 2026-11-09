---
title: "Fuentes que añades a mano"
---

Esta página te ayuda a dar a Memo una cosa que recordar: un archivo, una página web o un texto que pegas. Memo la
guarda como un documento propio, así que la encuentras al buscar, un agente la encuentra cuando consulta algo y los
hechos pueden citarla. Una carpeta vigilada sirve para muchos archivos que cambian a menudo
([Notas y carpetas](./notes.md)). Esta página es para una sola fuente.

## Añadir una fuente

```sh
memo sources add ~/Downloads/runner-notes.pdf --subject project:3
memo sources add https://example.org/release-notes --title "Release notes"
pbpaste | memo sources add - --subject person:12
```

| Das | Memo lee |
|---|---|
| La ruta de un archivo | El archivo, con los lectores de [Archivos que Memo puede leer](./notes.md#files-memo-can-read), y páginas web guardadas como `.html` o `.htm` |
| Una dirección `http` o `https` | La página, una vez, desde este ordenador, tal como está hoy |
| `-` | El texto de stdin |

- **Solo se guarda el texto.** Memo guarda el texto que leyó, el título y, para una página, la dirección que diste.
  No copia el archivo salvo que añadas `--keep-copy`. Entonces el archivo se copia en la carpeta de datos de Memo con
  un nombre según su contenido, así que el mismo archivo añadido dos veces se guarda una vez. `--keep-copy` solo
  acepta un archivo, no una página ni un texto pegado.
- **La misma fuente dos veces es una sola fuente.** Añadirla otra vez solo cambia los temas que añades. Una fuente
  cuyo contenido ya está en una carpeta vigilada o en Drive no se guarda otra vez. La respuesta nombra ese documento
  como `duplicate_of`, y solo los temas se vinculan a él.
- **`--subject`** dice de quién o de qué trata: `person:`, `organization:`, `project:`, `task:`, `meeting:` o un
  contacto de mensajería como `telegram:'Kai Sample'`. Repítelo para varios. Tus temas cuentan al instante, y los
  de un agente esperan sin confirmar hasta que los confirmes.
- **`--title`** le da un nombre. Sin él, Memo toma el título propio de la página o del archivo, o la primera línea
  del texto.
- **`--max-chars`** guarda como mucho esa cantidad de caracteres de texto, hasta 2.000.000 (por defecto 200.000). La
  respuesta dice `truncated: true` cuando solo se guardó la primera parte.

Una imagen o un PDF escaneado no tienen texto que Memo pueda leer. Se guardan solo por su título y sus temas
(`read: "no-text"`).

## Qué dice la respuesta

```sh
memo sources add notes.txt --json
```

| Campo | Significa |
|---|---|
| `ref` | El documento, como `document:42`. Es el que citas, muestras o quitas |
| `created` | `true` cuando esta llamada lo guardó, y `false` cuando ya estaba |
| `duplicate_of` | El documento de la carpeta vigilada o de Drive con el mismo contenido, cuando no se guardó nada nuevo |
| `kind` | `file`, `page` o `text` |
| `mime`, `bytes` | El tipo y el tamaño de lo que se leyó |
| `chars`, `truncated` | Cuántos caracteres de texto guarda el almacén y si es solo la primera parte. `truncated` es `null` cuando el texto lo guardó un añadido anterior |
| `extractor`, `read` | El lector que lo leyó, y `extracted` o `no-text` |
| `url` | La dirección que diste. Nunca se guarda la dirección en la que terminó una redirección |
| `kept` | `text`, o `copy` cuando también se guarda una copia del archivo. `null` para un duplicado |
| `searchable.words` | Su texto ya está en la búsqueda por palabras |
| `searchable.meaning` | Su texto espera la búsqueda por significado: el modelo de búsqueda está descargado y `notes.embed` no es `false`. `memo sync` lo procesa |
| `subjects` | Todo aquello de lo que trata ahora, incluidos los temas vinculados antes |

## Mirar una fuente

```sh
memo sources show document:42
memo sources show document:42 --bytes 65536 --json
memo sources mentions document:42
```

`sources show` da el texto (16 KiB por defecto, `--bytes` para más), qué es (`kind`, la `url` que diste,
`file_name`, `mime`, `bytes`), si se guarda una copia, los temas y si cada uno está confirmado, y qué la cita. Eso
son los `facts`, los `memories` y los lotes de hallazgos (`batches`) cuya evidencia la nombra. `kept` es `copy` solo
mientras la copia sigue en la carpeta de datos de Memo. Cualquier otro documento se muestra con `added: false` y
estos campos en `null`.

`sources mentions` lista las personas y organizaciones que Memo ya conoce y cuyos nombres aparecen en el texto,
leído en este ordenador. Una persona se encuentra por un nombre que Memo vio en una aplicación de mensajería o en una
reunión, o por una dirección de correo o un número de teléfono suyo, y una organización por su nombre completo. Un
nombre que comparten varias personas las lista a todas. Memo lee los nombres de hasta 500 organizaciones. Si hay
más, la respuesta lo dice en `missing`.

## Un lector propone hechos

Un lector es un modelo que eliges, que lee una fuente y propone los hechos que hay en ella. Tú confirmas cada uno, y
nada se convierte en hecho por sí solo.

```sh
memo sources readers list
memo sources readers set claude-code
memo sources suggest document:42 --subject person:12
memo actions confirm 17 fact-1 fact-3 --fingerprint <fingerprint>
```

**Elige un lector una vez.** `memo sources readers list` muestra cada lector: si está instalado y con sesión
iniciada, su modelo, si el texto sale de este ordenador (`leaves_computer`) y si podría abrir archivos aquí
(`reads_files`). Hace una comprobación de solo lectura por lector y no elige nada. `memo sources readers set <reader>`
elige uno. Solo tú eliges, y hasta que lo hagas, `sources suggest` se niega con `reader.none-chosen` y nombra los
lectores.

| Lector | Qué lee el texto | Sale de este ordenador | Modelo |
|---|---|---|---|
| `claude-code` | Tu Claude Code con sesión iniciada, con todas sus herramientas, servidores MCP, hooks y sesiones guardadas desactivados, en una carpeta vacía | Sí, a Anthropic | El suyo, o `--model` |
| `codex` | Tu Codex CLI con sesión iniciada, en su sandbox de solo lectura, en una carpeta vacía. Es un agente que aun así podría leer archivos de este ordenador | Sí, a OpenAI | El suyo, o `--model` |
| `ollama` | El Ollama que se ejecuta en este ordenador, solo en `127.0.0.1:11434` | No | Obligatorio, uno que muestre `ollama list` |
| `openai`, `anthropic` | La API del proveedor con tu propia clave | Sí | Obligatorio |

Un lector de API toma su clave del llavero del sistema, nunca de una variable de entorno ni de la línea de comandos.
`memo models keys set openai` la pide en una pregunta oculta o la lee de stdin. `memo models keys remove openai` la
olvida. La clave nunca se muestra.

**Qué hace `sources suggest`.** Envía al lector el texto guardado de la fuente con la instrucción de proponer
hechos, cada uno con las palabras exactas en las que se apoya, y trata el texto como datos, nunca como
instrucciones. Después comprueba cada respuesta:

- la cita debe estar en el texto palabra por palabra, sin contar espacios ni saltos de línea. Un hecho cuya cita no
  está se descarta como `quote-not-found`.
- un hecho necesita un enunciado y uno de los tipos de hecho (`fact`, `statement`, `question`, `decision`,
  `promise`).
- un hecho ya guardado desde esta fuente se descarta y se nombra como `duplicate_of`, y un hecho repetido en la
  respuesta se queda una vez.

Lo que queda es un lote de hallazgos que cita la fuente, cada hecho con su cita, preparado por `memo-reader` con el
lector y el modelo como su modelo. **Solo tú lo confirmas**, incluso con `agent_decisions` activado.
`memo actions confirm <batch> [fact ids] --fingerprint <fingerprint>` crea los hechos que nombras y rechaza el resto.
Un hecho confirmado conserva su cita en su evidencia, así que una comprobación posterior de la fuente sabe en qué
palabras se apoya. La respuesta lista los `facts` preparados y los descartados (`dropped`) con el motivo.

Leer el mismo texto otra vez con el mismo lector, modelo y tema devuelve el lote que preparó antes con
`reused: true` y no vuelve a preguntar al lector. `--rescan` vuelve a preguntar. `--subject` dice de quién o de qué
trata cada hecho: `person:`, `organization:`, `project:` o `task:`. `--provider` y `--model` leen una vez con otro
lector, y solo tú puedes darlos.

Un agente en su terminal puede ejecutar `sources suggest`, pero solo con el lector que elegiste, y el lote sigue
esperándote. Por MCP no se ofrece, así que un agente no puede enviar el texto de una fuente fuera de este ordenador.

## Quitar una fuente

```sh
memo sources remove document:42
```

Solo tú quitas una fuente que añadiste. Su texto se va, la copia que guardaba Memo se borra, y la respuesta lista
los hechos y recuerdos que la citan como `facts` y `memories`. Quitarla no cambia ninguno de ellos. Mantienen su
estado, y la siguiente comprobación de fuentes de `memo sync` abre una revisión de cada uno, que cita una fuente que
ya no existe, para que decidas. Nunca se toca un archivo de tu disco.

## Para un agente

Un agente en un terminal añade una fuente de la misma manera, y sus temas esperan a que los confirmes:

```text prompt
Usa memo CLI para guardar estas notas de la reunión como fuente sobre Northbridge Bench y luego lista las personas
que se nombran en ellas.
```

Por MCP, `sources add` recibe solo `text`. Un agente no puede hacer que Memo lea un archivo de este ordenador ni que
abra una dirección. `sources remove`, `sources suggest` y `sources readers set` no se ofrecen por MCP
([El servidor MCP](./mcp.md)).

## Cuando añadir falla

Cada negativa nombra su motivo y qué hacer después. [Solución de problemas](./troubleshooting.md#adding-a-source) los
lista todos, y también los motivos por los que se niega un lector. Un enlace que necesita que inicies sesión, como
un Google Doc privado, no se puede leer así. Guárdalo como archivo y añade el archivo.
