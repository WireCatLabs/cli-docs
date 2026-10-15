---
title: "Correo"
---

Esta página te ayuda a traer tu correo a Memo. Así el correo está junto a tus notas y mensajes en la
búsqueda, en el contexto de una persona y en las fuentes que lee tu agente. Memo lee el correo a
través de [Himalaya](https://github.com/pimalaya/himalaya), un programa de correo que configuras
primero. Tu buzón se abre solo para lectura: Memo nunca envía, mueve ni borra correo, y no lo marca
como leído.

## Antes de empezar

Configura tu cuenta de correo en Himalaya. Para Gmail, usa una cuenta IMAP con una
[contraseña de aplicación](https://myaccount.google.com/apppasswords) de Gmail (una contraseña aparte
para un solo programa, que puedes revocar en cualquier momento). Comprueba que Himalaya muestra tu
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
memo sync --account work --since-time 2026-09-01
```

`work` es el `name` de la cuenta en los ajustes; también puedes usar su dirección. Sin `--account`, Memo lee todas las cuentas configuradas e identifica cada una en el informe. Si el nombre es incorrecto, muestra las cuentas conocidas.

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
memo mail probe work
```

Lee solo las cabeceras (aproximadamente 1 KB por correo) y agrupa por remitente y lista: cantidad, espacio, correo sin leer o masivo, años y si escribiste al remitente. Sugiere `skip` para grupos de al menos 20 correos, con un 80% o más de correo masivo y sin mensajes tuyos al remitente.

Cada grupo recibe una **puntuación** de parecido con spam, estafa o robot, con los indicios que la componen. Gmail ya filtra gran parte del spam; una puntuación alta suele señalar un remitente suplantado o un robot aún no cubierto por una regla:

| Indicio | Suma | Origen |
|---|---:|---|
| `spam_folder` | 4 | La mayoría del grupo está en Spam de Gmail |
| `dmarc_fail` | 3 | Falló la comprobación DMARC de Gmail al recibirlo (`Authentication-Results: mx.google.com`) |
| `brand_spoof` | 3 | Una marca como PayPal o Apple en el nombre visible, enviada desde otro dominio |
| `young_domain` | 3 | El dominio tenía menos de 180 días al llegar el primer correo |
| `reply_to_elsewhere` | 2 | Las respuestas van a un dominio distinto |
| `disposable_domain` | 2 | Dominio de correo desechable |
| `bulk_never_replied` | 1 | Al menos un 80% de correo masivo y nunca escribiste al remitente |
| `replied` | −5 | Escribiste al remitente |

`young_domain` necesita la fecha de registro del dominio. memo solo la consulta con `--domain-age`:

```sh
memo mail probe work --domain-age
```

Consulta mediante RDAP el registro del dominio remitente de cada grupo mostrado, usando la lista de IANA, a un dominio por segundo, y conserva la respuesta en el equipo. **Cada consulta comunica al registro el nombre del dominio**: este sabe que alguien revisa correo procedente de él. No consulta grandes proveedores como gmail.com ni remitentes a los que escribiste. La mayoría de dominios territoriales, como .ru, .de, .es y .io, carece de RDAP: su edad queda desconocida y no suma puntos. Sin `--domain-age` solo usa fechas ya guardadas.

Tú decides:

```sh
memo mail rules add work --domain shop.example --do envelope --reason 'newsletters'
memo mail rules add work --domain spam.example --do skip
memo mail rules add work --sender orders@shop.example --do keep
memo mail rules list work
```

El `--do` de una regla elige una de tres acciones:

- `skip`: `memo sync` no lee ni guarda el correo y lo cuenta como omitido.
- `envelope`: `memo sync` guarda remitente, fecha, tamaño, etiquetas e id de Gmail, sin texto ni adjuntos. El asunto queda en los metadatos, por lo que el correo no aparece en búsquedas. `memo mail rules list` muestra cantidad y tamaño por regla para valorar una limpieza. El sobre no pide a Gmail más datos que omitir: sus campos vienen con el listado.
- `keep`: importa el correo aunque coincida con una regla de omisión o sobre.

Conservar tiene prioridad sobre el sobre, y el sobre sobre omitir. Si eliminas una regla de sobre o la cambias por conservar, la siguiente sincronización leerá esos correos completos. El correo guardado antes de una regla permanece intacto.

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

## Correo antiguo de Google Takeout

Gmail limita la descarga diaria por IMAP; para años de correo es más rápido usar una exportación de Mail de [Google Takeout](https://takeout.google.com/). Añade el archivo como segunda cuenta con la misma dirección para que sus correos y los de Gmail formen un solo conjunto:

```json
{ "name": "archive", "address": "you@example.com", "mode": "mbox", "path": "~/Takeout/Mail/All mail Including Spam and Trash.mbox" }
```

```sh
memo sync --account archive --since-time 2000-01-01 --limit 5000
```

El archivo solo se lee al nombrar esa cuenta; cada ejecución lo lee entero. Solo añade correo: lo que falta en el archivo no se elimina del almacén, y se omiten Spam y Papelera.

## Encontrar tu correo

```sh
memo search mail 'invoice'
memo search mail 'from:kai subject:budget'
memo search mail 'mailbox:starred' --account you@example.com
memo search all 'budget'
```

Las etiquetas de Gmail, como Recibidos, Importantes, Destacados y tus propias etiquetas, se convierten
en carpetas de correo, así que `mailbox:important` las encuentra. Consulta
[Búsqueda](./search.md#search-mail).

## Qué se guarda

- El remitente, los destinatarios (Para, CC y CCO), el asunto, la fecha y el texto de cada correo.
- Si un correo está leído o destacado, tal como lo muestra tu buzón.
- El texto de los adjuntos legibles, que se busca junto con el correo. Los adjuntos PDF y Word
  necesitan los [lectores opcionales](./notes.md#files-memo-can-read). Después de instalarlos,
  ejecuta `memo sync --account work --retry-attachments` para leer los adjuntos que se omitieron.
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
la dirección a esa persona en tg o max: `tg contacts link 'Kai Sample' email:kai@example.com`.

Siguiente: [mantener el correo y las notas al día con un temporizador](./archive.md).
