---
title: "Correo"
---

Esta página te ayuda a traer tu correo a Memo. Así el correo está junto a tus notas y mensajes en la
búsqueda, en el contexto de una persona y en las fuentes que lee tu agente. Memo lee el correo a
través de [Himalaya](https://github.com/pimalaya/himalaya), un programa de correo que configuras
primero. La importación lee el buzón sin cambiarlo ni marcar correo como leído. Los comandos de
[limpieza de Gmail](#clean-up-gmail) mueven el correo elegido a la Papelera o lo restauran solo con
`--yes`. Memo nunca envía correo.

## Antes de empezar

Configura tu cuenta de correo en Himalaya. Para Gmail, usa una cuenta IMAP con una
[contraseña de aplicación](https://myaccount.google.com/apppasswords) de Gmail (una contraseña aparte
para un solo programa, que puedes revocar en cualquier momento). Memo funciona con Himalaya 2.x (`himalaya --version`).

Himalaya lee sus cuentas de `~/.config/himalaya/config.toml` (`HIMALAYA_CONFIG` o `-c` le indican otro
archivo). Una cuenta de Gmail llamada `work` se ve así; la contraseña sale de un comando, aquí el llavero
de Linux, de modo que nunca queda escrita en el archivo:

```toml
[accounts.work]
imap.server = "imaps://imap.gmail.com:993"
imap.sasl.plain.username = "you@example.com"
imap.sasl.plain.password.command = "secret-tool lookup service himalaya account work"
```

`himalaya account list` muestra las cuentas que ha leído. Comprueba que Himalaya muestra tu
correo antes de continuar.

```text prompt
Help me set up Himalaya for my Gmail account with an app password, and check that it lists my inbox.
Then add the account to Memo's config and import the last 30 days of mail.
```

## Añadir la cuenta a Memo

Pon el nombre de la cuenta en el [archivo de configuración](./configuration.md#mail) de Memo,
`~/.config/cli-memo/config.json`. `name` es el nombre de la cuenta en Himalaya; `address` es tu
dirección de correo:

```json
{ "mail": { "accounts": [{ "name": "work", "address": "you@example.com" }] } }
```

Gmail es la opción predeterminada. Para otro proveedor de correo, añade `"mode": "imap"` y las
carpetas que quieres leer:

```json
{ "mail": { "accounts": [{ "name": "home", "address": "me@example.org", "mode": "imap", "folders": ["INBOX", "Archive"] }] } }
```

## Sincronizar correo

```sh
memo sync --source email:work --since-time 2026-09-01
```

`work` es el `name` de la cuenta en los ajustes; también puedes usar su dirección; separa varias con comas. Sin `--source`, Memo lee todas las cuentas configuradas e identifica cada una en el informe. Si el nombre es incorrecto, muestra las cuentas conocidas.

- Sin `--since-time`, Memo lee los últimos 30 días. Acepta una fecha, hora ISO 8601 o `30d` atrás.
- Cada ejecución lee hasta 200 correos nuevos por cuenta (`--limit` cambia el límite). Repítela para continuar: enumera solo el correo no completado antes, sin volver a listar todo un buzón grande.
- Un listado completo marca el correo eliminado en origen y actualiza etiquetas y estado de lectura. Se ejecuta al menos una vez al día, tras cambiar reglas y con `--rescan`; una ventana de menos de 5000 correos se lista entera cada vez.
- `memo sync` y el temporizador leen todas las cuentas de los ajustes.

Comprueba el progreso sin consultar el buzón:

```sh
memo mail status work
```

La primera línea cuenta la ventana más amplia importada, por ejemplo todo desde 2004, y muestra «complete» solo cuando está guardada entera. Una ejecución posterior más estrecha, como los 30 días del temporizador, aparece por separado como última ejecución. No representa todo el buzón.

## Elegir qué importar

Un buzón grande contiene muchas suscripciones y notificaciones. Revísalo antes de una primera importación grande:

```sh
memo mail inspect work
```

Lee solo las cabeceras (aproximadamente 1 KB por correo) y agrupa por remitente y lista: cantidad, espacio, correo sin leer o masivo, años y si escribiste al remitente. Sugiere `skip` para grupos de al menos 20 correos, con un 80% o más de correo masivo y sin mensajes tuyos al remitente.

Cada grupo recibe una **puntuación** de parecido con spam, estafa o robot, con los indicios que la componen. Gmail ya filtra gran parte del spam; una puntuación alta suele señalar un remitente suplantado o un robot aún no cubierto por una regla:

| Indicio | Suma | Origen |
|---|---:|---|
| `spam_folder` | 4 | La mayoría del grupo está en Spam de Gmail |
| `dmarc_fail` | 3 | Falló la comprobación DMARC de Gmail (`Authentication-Results: mx.google.com`), sin firma DKIM válida, de un remitente que nunca la supera, en correo de 2022 en adelante; solo cuenta junto a otro indicio de fraude |
| `brand_spoof` | 3 | Una marca como PayPal o Apple en el nombre visible, enviada desde otro dominio |
| `young_domain` | 5 | El dominio tenía menos de 180 días al llegar el primer correo |
| `reply_to_elsewhere` | 1 | Las respuestas van a un dominio distinto |
| `never_opened` | 2 | No abriste ningún correo del grupo |
| `dkim_not_passed` | 2 | La comprobación DKIM de Gmail falló en la mayoría del grupo |
| `disposable_domain` | 2 | Dominio de correo desechable |
| `bulk_never_replied` | 1 | Al menos un 80% de correo masivo y nunca escribiste al remitente |
| `replied` | −5 | Escribiste al remitente |

`brand_spoof`, `young_domain`, `disposable_domain` y `dmarc_fail` señalan un remitente falsificado o fraudulento. Un fallo de DMARC por sí solo suele indicar un remitente real con una configuración rota, o correo que llegó por un reenvío o una lista. Los demás indicios son comunes en correo masivo real, incluidas facturas y reservas: una puntuación de 3 solo por `never_opened` y `bulk_never_replied` es un boletín que ignoras, no una estafa, y muchas empresas responden desde un dominio de atención al cliente. Una plataforma que transmite otros nombres no es una suplantación: «Google via LinkedIn» desde LinkedIn, un curso de Coursera o un espacio de Quora con el nombre de una empresa. Los fallos de DMARC anteriores a 2022 no cuentan: entonces muchos remitentes reales no superaban la comprobación.

`young_domain` necesita la fecha de registro de cada dominio. Cada sincronización que puntúa remitentes, como máximo una vez al día, pide las fechas que aún no tiene, para remitentes a los que nunca escribiste y de los que recibiste correo en los dos últimos años: el dominio de un remitente más antiguo puede haber caducado o cambiado de dueño. `memo mail inspect work --domain-age` pide las fechas de los grupos que muestra. Un dominio registrado de nuevo después de llegar un correo no es joven para ese correo.

memo consulta mediante RDAP el registro propio de cada dominio, usando la lista de IANA, a un dominio por segundo, y conserva la respuesta en el equipo para siempre. **Cada consulta comunica al registro el nombre del dominio**: este sabe que alguien revisa correo procedente de él. No consulta grandes proveedores como gmail.com. La mayoría de dominios territoriales, como .ru, .de, .es y .io, carece de RDAP: su edad queda desconocida y no suma puntos.

Tú decides:

```sh
memo mail rules add work --domain shop.example --do envelope --reason 'newsletters'
memo mail rules add work --domain spam.example --do skip
memo mail rules add work --sender orders@shop.example --do keep
memo mail rules list work
```

Las acciones básicas de `--do` se muestran abajo; la protección y las etiquetas se explican en la siguiente sección:

- `skip`: `memo sync` no lee ni guarda el correo y lo cuenta como omitido.
- `envelope`: `memo sync` guarda remitente, fecha, tamaño, etiquetas e id de Gmail, sin texto ni adjuntos. El asunto queda en los metadatos, por lo que el correo no aparece en búsquedas. `memo mail rules list` muestra cantidad y tamaño por regla para valorar una limpieza. El sobre no pide a Gmail más datos que omitir: sus campos vienen con el listado.
- `keep`: importa el correo aunque coincida con una regla de omisión o sobre.

Conservar tiene prioridad sobre el sobre, y el sobre sobre omitir. Si eliminas una regla de sobre o la cambias por conservar, la siguiente sincronización leerá esos correos completos. El correo guardado antes de una regla permanece intacto.

### Más condiciones, etiquetas y protección

Además de `--sender`, `--domain` y `--list-id`, una regla admite una consulta `--filter` y un `--kind`.
Deben cumplirse todas las condiciones indicadas:

| En `--filter` | Correo que coincide |
|---|---|
| `from:<address>`, `from:<domain>` | de ese remitente o de ese dominio y sus subdominios |
| `from:<word>` | la dirección o el nombre visible contiene la palabra, sin distinguir mayúsculas |
| `to:<address>` | enviado a esa dirección en To o Cc |
| `subject:<word>` o una palabra sola | el asunto contiene cada palabra, sin distinguir mayúsculas |
| `older:<n>d` | recibido hace más de n días |
| `larger:<size>` | tamaño en origen mayor que `5MB`, `300KB` o un número de bytes |
| `has:attachment` | enviado como `multipart/mixed`: una estimación de adjuntos por la cabecera |
| `label:<name>` | con esa etiqueta Gmail, como `label:Promotions` o `label:"Two words"` |
| `is:unread` | nunca abierto |
| `is:bulk` | masivo: tiene List-Id, List-Unsubscribe o `Precedence: bulk` |
| `score:<n>` | la puntuación del remitente de arriba es al menos n |

`--do` acepta una acción y cualquier número de etiquetas, separadas por comas: `skip`, `envelope`,
`keep` o `protect`, más `tag:<name>`.

```sh
memo mail rules add work --filter 'label:Promotions older:365d' --do envelope
memo mail rules add work --domain shop.example --do keep,tag:shopping
memo mail rules add work --domain tax.gov.example --do protect
memo mail rules list work --filter is:protected
```

- **`tag:<name>`** etiqueta cada correo coincidente, sea cual sea la regla que decida la acción. La sincronización
  etiqueta el correo que guarda o registra; `memo mail rules apply`, el guardado antes. Si el almacén rechaza
  una etiqueta por parecerse a otra, reutiliza esa y actualiza la regla (`tags_reused` en `--json`). Si no hay
  ninguna que reutilizar, omite la etiqueta, guarda el correo y muestra `tags skipped` (`tags_skipped`) en la regla.
  Una etiqueta rechazada nunca detiene la sincronización.
- **`protect`** conserva el correo completo y fuera de toda limpieza, independientemente de otras reglas o tipos.
  Una regla protegida tiene prioridad y siempre guarda todo: `memo mail rules apply` nunca recorta ese correo
  y una limpieza posterior del buzón debe rechazarlo. Úsala para correo oficial, fiscal o bancario.
  `memo mail rules list` muestra primero las reglas protegidas, como `PROTECTED`.
- **`score:` y `--kind`** evalúan al remitente por el correo del mismo listado: si una sincronización solo enumera
  correo nuevo, lo evalúan con ese correo.

### Tipos de correo

`--kind` nombra un tipo incorporado, por quién envía y cómo, en lugar de por tu lista de remitentes:

| Tipo | Coincide con |
|---|---|
| `social` | notificaciones de redes sociales |
| `newsletters` | listas con List-Id y List-Unsubscribe y servicios de boletines |
| `developer` | notificaciones de alojamiento de código, CI, paquetes y seguimiento de errores |
| `shopping` | tiendas y lo que Gmail clasifica como Promotions |
| `alerts` | avisos de monitorización y disponibilidad |

`memo mail inspect` termina mostrando cuánto correo coincidiría con cada tipo. Nada se aplica hasta añadir una regla:

```sh
memo mail rules add work --kind social --do envelope
```

El correo de alguien a quien escribiste nunca coincide con un tipo, y una regla explícita gana a una de `--kind`.

### Filtros de Gmail

La exportación Mail de Google Takeout incluye los filtros de Gmail en `Mail/User settings/Filters.json`.
Memo propone una regla por cada filtro que puede expresar:

```sh
memo mail rules import-filters work Filters.json        # shows the proposed rules and the skipped filters
memo mail rules import-filters work Filters.json --yes  # adds them
```

Primero compara las etiquetas Gmail que añade el filtro con las de Memo: reutiliza el mismo nombre con otras
mayúsculas y propone una etiqueta parecida en lugar de crear otra. La propuesta muestra cada cambio como `label … → …`.

Un filtro que omite Recibidos, marca como leído o elimina se convierte en una regla de sobre; uno que solo añade
una etiqueta, en una regla de conservación con esa etiqueta. Varios remitentes o destinatarios
(`from:a from:b`, `from:(a OR b)`) se convierten en reglas separadas: un correo no puede proceder de ambos.
Las palabras del filtro pasan a buscarse en el asunto: Gmail buscaba en todo el correo, Memo solo en el asunto,
y el motivo de la regla lo indica. Los filtros que excluyen palabras o usan campos no admitidos (`list:`, `size:`)
se omiten y enumeran. Lee Takeout `{"filter": [{query, labelsToAdd, labelsToRemove}]}`, la forma de la API Gmail
(`criteria` y `action`) y las propiedades planas de la exportación de ajustes (`from`, `shouldArchive`, `label`).
Una etiqueta indicada solo por su id Gmail se etiqueta con ese id.

El correo guardado completo antes de una regla de sobre sigue completo hasta que lo recortes:

```sh
memo mail rules apply work        # says how many emails and how much text each rule would cut
memo mail rules apply work --yes  # cuts them to envelopes
```

Lee las cabeceras del buzón como `memo sync`, porque los correos guardados antes de conservar List-Id no lo tienen. Cada coincidencia pierde texto, adjuntos e índices de búsqueda y conserva remitente, fecha, tamaño, etiquetas y asunto en metadatos. El correo que solo coincide con omitir no cambia. El buzón permanece intacto; cambiar la regla a conservar permite leer de nuevo el correo completo en la siguiente sincronización.

Las reglas viven en el almacén local junto al correo; `memo mail rules list` cuenta los correos por regla en una consulta. Cada sobre recuerda la regla que lo registró. Para revisar, copiar o trasladar reglas:

```sh
memo mail rules export work > rules.json
memo mail rules import work rules.json   # a rule with the same sender, domain or list is replaced
```

Antes de 0.32.0 las reglas estaban en `config.json`. El primer comando memo que las lee las mueve al almacén, comprueba la copia y solo entonces las quita de los ajustes. Conserva al lado `config.json.<time>.before-rules-in-store`, legible solo por ti, y lo comunica una vez por stderr. Una regla de conservación con «never remove» en el motivo queda protegida: ninguna limpieza puede recortar ni eliminar lo que coincida.

## Limpia Gmail

`memo mail trash` mueve a la Papelera de Gmail los correos de los que decidiste conservar solo el sobre. Gmail los conserva allí 30 días y después los elimina definitivamente.

```sh
memo mail trash work                  # says what would move, per rule, and what stays and why
memo mail trash work --yes            # a first run moves at most 100, to check by hand in Gmail's Trash
memo mail trash work --yes            # later runs move up to 5,000, oldest first (--limit changes it)
memo mail trash work --yes --since-time 2012-01-01   # only mail from 2012 on; older mail stays for now
memo mail runs work                   # each run: how much moved, and until when it can be restored
memo mail restore work --run <id> --yes   # moves a run back, to the inbox if it was there, with its labels
```

Cada correo se evalúa otra vez con las reglas actuales y los datos de la última sincronización. Antes de moverlo, Memo consulta en Gmail las etiquetas y marcas actuales solo de los correos elegidos. Se conserva si coincide con una regla de protección o conservación, alguna vez respondiste al remitente, tiene estrella o está marcado como importante, es enviado o borrador, tiene una etiqueta tuya que su regla no añade, o tiene menos de 30 días. `--since-time` deja intacto el correo anterior a esa fecha.

Sin `--yes`, el comando muestra el plan. La primera ejecución con `--yes` mueve como máximo 100 correos para revisarlos en la Papelera; las siguientes, hasta 5 000, del más antiguo al más reciente, salvo otro `--limit`. Se necesita una copia verificada del almacén de menos de 8 días: el script de copia registra `backups/last.json` junto al almacén. Se aconseja un archivo Google Takeout `mbox` para conservar el texto completo, pero no es obligatorio; la vista previa y `memo doctor` indican si se ha importado.

Antes de cada lote, los identificadores Gmail, etiquetas y marcas se escriben en el registro de restauración `mail-trash/<account>/<run>.jsonl` en la carpeta de estado de Memo. La Papelera quita el correo de Todos y la etiqueta Recibidos; conserva las demás etiquetas. memo mail runs muestra las ejecuciones y hasta cuándo se pueden restaurar. memo mail restore muestra el plan sin `--yes`; con él devuelve de la Papelera los correos de la ejecución indicada con sus etiquetas anteriores, incluida Recibidos si la tenían. También restaura un lote que Gmail movió sin confirmar la operación.

El correo movido queda marcado como eliminado en el almacén; la siguiente sincronización tras restaurarlo lo importa según las reglas actuales. El temporizador nunca ejecuta la limpieza.

## Correo antiguo de Google Takeout

Gmail limita la descarga diaria por IMAP; para años de correo es más rápido usar una exportación de Mail de [Google Takeout](https://takeout.google.com/). Añade el archivo como segunda cuenta con la misma dirección para que sus correos y los de Gmail formen un solo conjunto:

```json
{ "name": "archive", "address": "you@example.com", "mode": "mbox", "path": "~/Takeout/Mail/All mail Including Spam and Trash.mbox" }
```

```sh
memo sync --source email:archive --since-time 2000-01-01 --limit 5000
```

El archivo solo se lee al nombrar esa cuenta. Una importación incompleta lo vuelve a recorrer; un archivo completado se omite hasta que cambie su tamaño o fecha de modificación. `--rescan` fuerza otro recorrido. Solo añade correo: lo que falta en el archivo no se elimina del almacén, y se omiten Spam y Papelera.

## Encontrar tu correo

```sh
memo search mail 'invoice'
memo search mail 'from:kai subject:budget'
memo search mail 'mailbox:starred' --source email:work
memo search mail 'trip NOT mailbox:bulk'
memo search all 'budget'
```

El correo masivo — boletines, avisos y listas con List-Id, List-Unsubscribe o `Precedence: bulk` — está en la carpeta `bulk` (`memo:bulk`). `NOT mailbox:bulk` lo excluye de la búsqueda. Se incluye por defecto porque facturas y reservas llevan las mismas cabeceras. Memo lo marca al leer cabeceras de una cuenta con reglas; un listado completo, al menos diario, marca también correo guardado antes. `--source email:<account>` acepta el nombre de la cuenta o su dirección; `--source email:work,email:personal` busca en las dos.

Cada sync también puntúa a todos los remitentes a partir del correo ya guardado, como máximo una vez al día, igual que `memo mail inspect` puntúa un grupo. Un resultado de un remitente evaluado incluye `sender_score` en `--json`, con la puntuación y sus señales. El correo de un remitente cuyos indicios de fraude suman 3 o más aparece después del resto de la página en `memo search mail` y `memo search all`, y su `sender_score` indica `demoted: true`; no se excluye nada. Lo tuyo nunca se mueve: un dominio al que escribiste a alguien, el dominio de tu buzón y un remitente que conserva una regla de protección. `--plain-order` deja ese correo donde lo ponen las palabras, para encontrarlo:

```sh
memo search mail 'invoice' --plain-order
```

Las etiquetas de Gmail, como Recibidos, Importantes, Destacados y tus propias etiquetas, se convierten
en carpetas de correo, así que `mailbox:important` las encuentra. Consulta
[Búsqueda](./search.md#search-mail).

`memo messages show <msg:email/…>` muestra un correo entero y el texto extraído de cada adjunto, como una factura PDF: los primeros 4 000 caracteres, o todo con `--full`. Si no hay texto, indica el motivo, por ejemplo `needs-agent` para una página escaneada.

## Qué se guarda

- El remitente, los destinatarios (Para, CC y CCO), el asunto, la fecha y el texto de cada correo.
- Si un correo está leído o destacado, tal como lo muestra tu buzón.
- El texto de los adjuntos legibles, que se busca junto con el correo ([archivos compatibles](./notes.md#files-memo-can-read)).
  Los lectores de PDF y Word se incluyen con Memo. Si un adjunto quedó sin leer porque faltaba su lector
  (`engine-missing`, por un Memo antiguo o una instalación dañada), `memo sync --source email:work --retry-attachments`
  solo vuelve a leer esos correos por su id Gmail, hasta `--limit`. No lista el buzón, así que es rápido;
  al repetir continúa con el resto.
- Hasta 1.000.000 de caracteres de cada correo y 200.000 de cada adjunto
  ([cambiar los límites](./configuration.md#mail)).

El correo se prepara para la búsqueda por significado cuando el modelo de búsqueda está en tu
ordenador; `--no-embed` omite este paso.

## Cuando se borra un correo

Cuando borras un correo en tu buzón, su texto sale del almacén local en la siguiente importación. El
correo movido a Spam cuenta como borrado. Para protegerte de errores:

- los dos primeros días del periodo no se revisan en busca de correos borrados;
- si una ejecución detecta que falta una parte inusualmente grande de tu correo, no borra nada y te
  avisa.

## El correo y las personas

Para incluir el correo de una persona en [su contexto](./people.md#everything-about-a-person), vincula
la dirección a esa persona en tg o max: `tg personal contacts link 'Kai Sample' email:kai@example.com`.

## Teléfonos y enlaces en el correo

Memo encuentra teléfonos, direcciones de correo, enlaces, nombres y direcciones postales en cada correo, nota y
documento guardado. Puedes verlos en una lista y decir qué son:

```sh
memo mentions list kind:phone --source email:personal
memo mentions show 40 --source email:personal
memo mentions confirm 40 person:7 --source email:personal
memo mentions reject 41 --source email:personal
```

`--source` indica qué leer, igual en todas las herramientas de WireCat: `email:personal` un buzón,
`email:personal,email:work` varios, `mail` todos los buzones (la respuesta indica cuáles), `notes` las notas de
memo, `documents` los documentos importados y `group:<name>` un grupo guardado. `show` enumera los remitentes que
pueden ser dueños de un teléfono, pero no vincula nada hasta que lo confirmas.

Siguiente: [mantener el correo y las notas al día con un temporizador](./archive.md).
