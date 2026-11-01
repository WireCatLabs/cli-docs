---
title: "Correo"
---

Esta página te ayuda a traer tu correo a Memo. Así el correo está junto a tus notas y mensajes en la
búsqueda, en el contexto de una persona y en las fuentes que lee tu agente. La vía de entrada es el
programa aparte [mail](https://github.com/WireCatLabs/mail-cli): `mail` copia tu buzón al almacén compartido de
WireCat, y Memo busca y muestra lo que hay en él. Memo nunca cambia tu buzón ni envía correo.

Memo todavía puede importar correo con Himalaya. Ese camino antiguo funciona por ahora y se eliminará en una versión
posterior; se describe en [Importación antigua con Himalaya](#older-import-through-himalaya-legacy).

<a id="importar-correo" />

## Trae el correo con mail

Instala `mail` y añade tu buzón. Su [documentación](https://github.com/WireCatLabs/mail-cli/blob/main/docs/index.md) lista los pasos de cada proveedor,
como el ajuste IMAP y la contraseña de aplicación (una contraseña aparte para un solo programa, que puedes revocar
en cualquier momento).

```sh
npm install -g @wirecat/mail-cli
mail ya session start --address me@example.com
mail ya sync
mail ya status
```

`ya` es un nombre de perfil que eliges para un buzón. `session start` inicia sesión, `sync` lee los últimos 30 días
al almacén compartido y `status` muestra cuánto ha avanzado un buzón grande. Ejecuta `mail ya sync` otra vez para traer
correo nuevo. Memo no necesita ningún ajuste para este correo: lee el mismo almacén.

`mail` guarda el texto y las cabeceras de cada mensaje, no los adjuntos. Consulta su
[documentación](https://github.com/WireCatLabs/mail-cli/blob/main/docs/index.md) para saber qué guarda y cómo mantener un buzón al día.

## Busca y lee el correo en Memo

```sh
memo search mail 'invoice'
memo messages show <ref>
```

`<ref>` es el `ref` de un resultado de búsqueda. `memo search all` encuentra este correo junto con tus notas y
mensajes. Hay más palabras de búsqueda en [Encontrar tu correo](#find-your-mail) y [Búsqueda](./search.md#search-mail).

## Los comandos memo mail

`memo mail inspect` se mantiene. Toma una cuenta de la lista `mail.accounts` de Memo, que `memo mail add` rellena a
partir de una cuenta de Himalaya, así que no funciona con una cuenta que solo añadió `mail`.

Cuando `mail` sincroniza una cuenta que también está en `mail.accounts`, pon `"import": false` en ella, por ejemplo
`{ "name": "personal", "address": "you@gmail.com", "import": false }`. `memo sync` y el temporizador omiten entonces
su importación con Himalaya, y `memo sync --source email:personal` avisa de que la importación pasó a `mail`. `memo mail inspect`
sigue funcionando, y cada sync sigue reparando el texto HTML, puntuando remitentes e
incrustando el correo que ya está en el almacén. Solo el relleno de cabeceras necesita Himalaya, así que se detiene.

| Comando | Qué necesita | Qué hace |
|---|---|---|
| `memo mail inspect <account>` | Una cuenta de Himalaya en la configuración de Memo | Lee cabeceras del buzón y agrupa el correo por remitente ([Elegir qué importar](#choose-what-to-import)) |

Las reglas, la limpieza de Gmail y la restauración son comandos de `mail`. Los antiguos comandos de Memo solo nombran su
sustituto y no cambian nada. `<profile>` es el perfil de `mail` que guarda la dirección; `mail session status` los lista.

| Comando antiguo de Memo | Ejecuta en su lugar |
|---|---|
| `memo mail rules list\|add\|remove\|apply\|export\|import <account> …` | `mail <profile> rules list\|add\|remove\|apply\|export\|import …`, las mismas opciones, sin cuenta |
| `memo mail delete <account>` | `mail <profile> messages delete --rules` (una vista previa; `--yes` mueve el correo) |
| `memo mail restore <account> --run <id>` | `mail <profile> messages restore --run <id>`; los id de ejecución de Memo sirven allí |
| `memo mail runs list <account>` | `mail doctor`, que nombra las ejecuciones que se detuvieron a medias o cuya Papelera de Gmail se vaciará pronto; cada ejecución es un archivo `<id>.jsonl` en la carpeta de estado de Memo, en `mail-trash/<profile>/` |

## Importación antigua con Himalaya (legacy)

Esta importación se eliminará en una versión posterior. Usa [mail](#bring-mail-in-with-mail) para cuentas nuevas.
Aquí Memo lee el correo a través de [Himalaya](https://github.com/pimalaya/himalaya), un programa de correo que
configuras primero. La importación lee tu buzón sin cambiarlo ni marcar correo como leído.

### Antes de empezar

Configura tu cuenta de correo en Himalaya. Para Gmail, usa una cuenta IMAP con una
[contraseña de aplicación](https://myaccount.google.com/apppasswords) de Gmail. Memo funciona con Himalaya 2.x (`himalaya --version`).

Himalaya lee sus cuentas de `~/.config/himalaya/config.toml` (`HIMALAYA_CONFIG` o `-c` le indican otro
archivo). Una cuenta de Gmail llamada `work` se ve así; la contraseña sale de un comando, aquí el llavero
de Linux, de modo que nunca queda escrita en el archivo:

```toml
[accounts.work]
email = "you@example.com"
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

### Añadir la cuenta a Memo

Indica explícitamente el nombre de la cuenta de Himalaya y su correo configurado:

```sh
memo mail add work you@example.com
memo mail check work
```

`add` pide a Himalaya la lista de cuentas, comprueba el `email` (o `from`) de la cuenta elegida en su archivo TOML
y la añade a la [configuración](./configuration.md#mail) de Memo. Nunca elige la cuenta predeterminada de Himalaya.
Si falta el nombre, enumera los nombres disponibles sin cambiar nada. Rechaza una dirección distinta o un nombre/correo
ya existente. Si falta `email`, configúralo primero en la cuenta de Himalaya. `check` repite las comprobaciones
locales sin cambiar Memo ni conectar al buzón; no comprueba el inicio de sesión.

Para otro proveedor IMAP, selecciona el tipo y las carpetas:

```sh
memo mail add home me@example.org --kind imap --folder INBOX --folder Archive
```

Gmail es el tipo predeterminado. Estos comandos admiten un archivo de configuración de Himalaya, elegido por
`HIMALAYA_CONFIG` o su ubicación normal. Mantén el mismo entorno para importar. Una lista combinada de archivos
requiere configuración manual. Google Takeout `mbox` sigue usando `mode: "mbox"`, descrito más abajo.

### Sincronizar correo

```sh
memo sync --source email:work --since-time 2026-09-01
```

`work` es el `name` de la cuenta en los ajustes; también puedes usar su dirección; separa varias con comas. Sin `--source`, Memo lee todas las cuentas configuradas e identifica cada una en el informe. Si el nombre es incorrecto, muestra las cuentas conocidas.

- Sin `--since-time`, Memo lee los últimos 30 días. Acepta una fecha, hora ISO 8601 o `30d` atrás.
- Cada ejecución lee hasta 200 correos nuevos por cuenta (`--limit` cambia el límite). Repítela para continuar: enumera solo el correo no completado antes, sin volver a listar todo un buzón grande.
- Un listado completo marca el correo eliminado en origen y actualiza etiquetas y estado de lectura. Se ejecuta al menos una vez al día, tras cambiar reglas y con `--rescan`; una ventana de menos de 5000 correos se lista entera cada vez.
- `memo sync` y el temporizador leen todas las cuentas de los ajustes.

Para ver hasta dónde llegó un buzón que sincronizó `mail`, ejecuta `mail <profile> status`. La importación con
Himalaya ya no tiene un comando de estado.

## Elegir qué importar

Esto funciona con una cuenta de la importación con Himalaya.

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

Decides con reglas, que `mail <profile> rules add` escribe en el almacén (consulta la
[documentación de mail](https://github.com/WireCatLabs/mail-cli/blob/main/docs/index.md)). `memo sync` lee las reglas
de la cuenta del almacén en cada importación con Himalaya:

- `skip`: `memo sync` no lee ni guarda el correo y lo cuenta como omitido.
- `envelope`: `memo sync` guarda remitente, fecha, tamaño, etiquetas e id de Gmail, sin texto ni adjuntos. El asunto queda en los metadatos, por lo que el correo no aparece en búsquedas. El sobre no pide a Gmail más datos que omitir: sus campos vienen con el listado.
- `keep`: importa el correo aunque coincida con una regla de omisión o sobre.
- Una etiqueta en una regla pone una etiqueta de memo en cada correo que la regla encuentra y que una sincronización guarda o registra. Una etiqueta que el almacén rechaza por parecerse demasiado a otra existente se pone como esa etiqueta; una rechazada sin nada que reutilizar se omite, y el correo se guarda igualmente.
- Una regla protegida gana a todas las demás y siempre guarda el correo completo.

Conservar tiene prioridad sobre el sobre, y el sobre sobre omitir. Si eliminas una regla de sobre o la cambias por conservar, la siguiente sincronización leerá esos correos completos. El correo guardado antes de una regla permanece intacto. Las reglas que juzgan a un remitente por su correo (una puntuación o un tipo) lo juzgan por el correo del mismo listado, así que una sincronización que lista solo correo nuevo juzga al remitente por ese correo.

Los ajustes antiguos guardaban las reglas en `config.json`. La primera `memo sync` que lee las reglas las mueve al almacén, comprueba que llegaron todas y solo entonces las quita de los ajustes. Conserva al lado `config.json.<time>.before-rules-in-store`, legible solo por ti, y lo comunica una vez por stderr. Una regla de conservación con «never remove» en el motivo queda protegida.

## Limpia Gmail

Memo ya no cambia un buzón. Mover a la Papelera de Gmail el correo de sobre y devolver una ejecución son comandos de
`mail`: `mail <profile> messages delete --rules` muestra el plan y `--yes` mueve, `mail <profile> messages restore
--run <id>` deshace una ejecución, y `mail doctor` nombra las ejecuciones que se detuvieron a medias o cuya Papelera de
Gmail se vaciará pronto. `mail` lee los registros de restauración que escribieron versiones anteriores de Memo, así que
sus id de ejecución siguen sirviendo: cada uno es un archivo `<id>.jsonl` en la carpeta de estado de Memo, en
`mail-trash/<profile>/` (`memo doctor` muestra la carpeta).

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

`memo messages show <msg:email/…>` muestra un correo entero. Para el correo de la importación con Himalaya añade el texto extraído de cada adjunto, como una factura PDF: los primeros 4 000 caracteres, o todo con `--full`. Si no hay texto, indica el motivo, por ejemplo `needs-agent` para una página escaneada. El correo sincronizado con `mail` no tiene texto de adjuntos.

## Qué se guarda

Esta lista es para la importación con Himalaya. El correo que sincronizó `mail` guarda solo el texto y las cabeceras:
sin adjuntos, y por tanto sin texto de adjuntos.

- El remitente, los destinatarios (Para, CC y CCO), el asunto, la fecha y el texto de cada correo.
- Si un correo está leído o destacado, tal como lo muestra tu buzón.
- Para la importación con Himalaya: el texto de los adjuntos legibles, que se busca junto con el correo ([archivos compatibles](./notes.md#files-memo-can-read)).
  Los lectores de PDF y Word se incluyen con Memo. Si un adjunto quedó sin leer porque faltaba su lector
  (`engine-missing`, por un Memo antiguo o una instalación dañada), `memo sync --source email:work --retry-attachments`
  solo vuelve a leer esos correos por su id Gmail, hasta `--limit`. No lista el buzón, así que es rápido;
  al repetir continúa con el resto.
- Hasta 1.000.000 de caracteres de cada correo y 200.000 de cada adjunto
  ([cambiar los límites](./configuration.md#mail)).

El correo se prepara para la búsqueda por significado cuando el modelo de búsqueda está en tu
ordenador; `--no-embed` omite este paso.

## Cuando se borra un correo

Cuando borras un correo en tu buzón, su texto sale del almacén local en la siguiente importación con Himalaya. El
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
