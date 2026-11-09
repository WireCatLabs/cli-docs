---
title: "Correo"
---

Esta página te ayuda a traer tu correo a Memo. Así el correo está junto a tus notas y mensajes en la
búsqueda, en el contexto de una persona y en las fuentes que lee tu agente. La vía de entrada es el
programa aparte [mail](https://github.com/WireCatLabs/mail-cli): `mail` copia tu buzón al almacén compartido de
WireCat, y Memo busca y muestra lo que hay en él. Memo nunca cambia tu buzón ni envía correo.

<a id="importar-correo" />

## Trae el correo con mail

Instala `mail` y añade tu buzón. Su [documentación](https://github.com/WireCatLabs/mail-cli/blob/main/docs/index.md) lista los pasos de cada proveedor,
como el ajuste IMAP y la contraseña de aplicación (una contraseña aparte para un solo programa, que puedes revocar
en cualquier momento).

```sh
npm install -g @wirecat/mail-cli
mail personal session start --address me@example.com
mail personal sync
mail personal status
```

`personal` es un nombre de perfil que eliges para un buzón. `session start` inicia sesión, `sync` lee los últimos 30 días
al almacén compartido y `status` muestra cuánto ha avanzado un buzón grande. Ejecuta `mail personal sync` otra vez para traer
correo nuevo. Memo no necesita ningún ajuste para este correo: lee el mismo almacén.

`mail` guarda el texto y las cabeceras de cada mensaje, no los adjuntos. Consulta su
[documentación](https://github.com/WireCatLabs/mail-cli/blob/main/docs/index.md) para saber qué guarda y cómo mantener un buzón al día.
Todo lo que trata del buzón en sí también es de `mail`:

- `mail <profile> account inspect` agrupa el correo de un buzón por remitente y lista, con una puntuación de spam, antes de
  una primera sincronización grande. `--domain-age` pregunta cuándo se registró el dominio de cada remitente.
- `mail <profile> messages import <file.mbox>` añade años de Gmail antiguo desde un archivo de [Google Takeout](https://takeout.google.com/)
  al mismo buzón, cada correo una sola vez.
- `mail <profile> rules add|list|remove` deciden qué correo se guarda entero, como sobre o nada.

`memo sync` y su temporizador preparan el correo que guardó `mail` para la [búsqueda por significado](./search.md) cuando el modelo de
búsqueda está en tu ordenador. `--no-embed` omite este paso.

## Busca y lee el correo en Memo

```sh
memo search mail 'invoice'
memo messages show <ref>
```

`<ref>` es el `ref` de un resultado de búsqueda. `memo search all` encuentra este correo junto con tus notas y
mensajes. Hay más palabras de búsqueda en [Encontrar tu correo](#find-your-mail) y [Búsqueda](./search.md#search-mail).

## Un agente que lee el correo nuevo y propone tareas

memo puede ejecutar un agente después de cada sincronización que guardó correo nuevo. Lee solo el correo que está más allá de
su propia marca, y solo prepara propuestas: tareas, cierres y cambios de tareas abiertas, hechos, recuerdos, vínculos y
contactos nuevos. No se crea nada hasta que lo confirmas en `memo review`. Lo único que hace por sí mismo es archivar
como sobres a un remitente que está seguro de que solo envía boletines, promociones o avisos (`mail <profile> rules add`),
y la siguiente sincronización guarda el correo de ese remitente sin su texto. El agente nunca envía, redacta, mueve ni
borra correo, nunca cambia ni elimina una regla, y nunca decide por ti.

Actívalo una vez:

```sh
memo schedule agent mail-triage claude 'Run memo skill show mail-triage and follow it.' --every 5m --on-new-mail mail-triage --max-cost 1 --max-cost-per-day 5
```

Cada 5 minutos la programación revisa el almacén. Si no hay correo más allá de la marca `mail-triage`, no hace nada: ni una
llamada al modelo, ni un aviso. Espera hasta que haya 10 correos pendientes, o hasta que el más antiguo lleve 30 minutos
esperando. Así un día de correo disperso cuesta pocas ejecuciones, no decenas. Los boletines, los remitentes sospechosos y
el resto del correo que omitiría no cuentan. Cuando las ejecuciones del día han costado 5 dólares estadounidenses, no empieza
ninguna hasta el día siguiente. `memo schedule list` muestra el gasto del día y por qué se omitió una ejecución. Cambia estos valores
para una programación con `--mail-wait 1h`, `--mail-batch 20` y `--max-cost-per-day 2`, o para todas en el archivo de
configuración: `schedule_mail_wait`, `schedule_mail_batch` y `schedule_max_cost_per_day` (`memo config show` los lista, y una
opción gana al archivo). Cuando espera suficiente correo y el presupuesto del día lo permite, inicia `claude` con Sonnet, con solo `memo` y `mail` permitidos, bajo `MEMO_READ_ONLY` y `MAIL_READ_ONLY` y sin tus
servidores MCP, skills, ajustes ni CLAUDE.md: una ejecución empieza con unos 4.700 tokens en lugar de 38.000. `--model opus`
elige otro modelo para una programación, y `schedule_model_claude` en el archivo de configuración para cada programación nueva.
`schedule_lean_start: false` carga tu configuración. Los dos se aplican cuando se añade la programación, así que vuelve a
añadirla después de cambiarlos. Esa ejecución solo puede mover la marca `mail-triage`. Las instrucciones que sigue son
`memo skill show mail-triage`. Su primera ejecución empieza desde ahora y no lee el correo anterior. Una
programación guardada por un memo anterior solo permite `memo`: ejecuta de nuevo la línea de arriba para sustituirla.

Qué hace, en cada buzón:

1. `memo mail review --holder mail-triage --source email:<account> --json` da el correo que está más allá de su marca.
   Los boletines, las reglas de sobre, los borradores, los remitentes sospechosos y el correo aún no guardado entero se
   dejan fuera y se cuentan. El resto del correo masivo (un pedido, una factura o un formulario de una web con enlace para
   darse de baja) llega al final como su asunto y sus primeras líneas (`excerpt_only`), como mucho 30 por lectura. El agente
   lee uno entero cuando parece algo para ti. Un correo masivo es un boletín cuando lo indican palabras de su asunto y sus
   primeras líneas, la dirección del remitente, un emoji o un enlace para darse de baja, y no lo contradice una palabra de
   pedido en el asunto, un número de pedido o una respuesta. Los ajustes `mail_bulk_*` de `memo config show` guardan las
   palabras, la puntuación y los límites, y `mail_bulk_excerpts: false` deja fuera todo el correo masivo. Cada correo tiene el
   `fingerprint` con el que lo cita un hallazgo, e indica si su remitente es nuevo.
2. Conserva los correos que te piden algo, llevan una fecha o responden a un hilo con una tarea abierta.
3. Lee contexto solo para esos, a través de los vínculos que ya tiene el almacén: el hilo y `memo context` del remitente.
4. Prepara un lote: `memo mail findings add '<json>' --key <key> --source email:<account>`, con el JSON como un solo
   argumento (también sirven un archivo o `-` para stdin) y la clave que dio la revisión en su paso `mail-findings.add`. Los
   remitentes nuevos siempre reciben un vínculo a una persona conocida o una propuesta de contacto nuevo. Después de
   `messages reset` la clave termina en `-r<n>`, así que una ejecución sobre correo leído de nuevo prepara su lote junto a uno
   que aún espera tu decisión.
5. Después, y solo entonces, `memo messages acknowledge --holder mail-triage --cursor <cursor> --source email:<account>`
   mueve su marca. Una ejecución que falla antes de este paso vuelve a leer el mismo correo. El mismo lote no se prepara dos veces.
6. Para un remitente que no está enlazado a una persona, sin tareas abiertas, y cuyos correos de la ejecución fueron
   todos boletines, promociones o avisos, añade `mail <profile> rules add --sender <address> --do envelope` (o
   `--list-id`), como mucho 5 por ejecución, con la dirección tomada de los campos de la revisión, nunca del texto del
   correo. Bajo `MAIL_READ_ONLY` mail solo acepta eso: `--sender` o `--list-id` con `--do envelope`, nunca una regla
   que sustituya a otra, registrada con `source: agent` (`mail <profile> rules list source:agent`). El informe lista las
   reglas que añadió y las que no tenía claras, para que las ejecutes tú.

| Comando | Qué hace |
|---|---|
| `memo mail review --source email:<account>` | Hilos con correo nuevo, `--unanswered` lo que debes responder, `--waiting` lo que espera respuesta. `--holder <name>` lee más allá de la marca de ese titular |
| `memo messages acknowledge --holder <name> --cursor <cursor>` | Mueve la marca de un titular al cursor que dio su revisión |
| `memo messages reset --holder <name> --last <n>` o `--since-time <time>` | Solo tú: mueve atrás la marca de un titular para que vuelva a leer ese correo. Dice cuántos correos. `--dry-run` solo cuenta |
| `memo mail findings add <file>` | Prepara para ti los hallazgos de un buzón |
| `memo mail findings list status:proposed` | Lotes que esperan tu decisión |
| `memo mail findings show <id>` | Un lote con su evidencia |

`MEMO_READ_ONLY` rechaza todo cambio en el almacén salvo `mail findings add` y `messages acknowledge`. `messages reset`
es solo tuyo: rechaza a un agente y a una ejecución programada, y MCP lo muestra como no disponible (`messages.reset` es `deny`).
Tú decides en `memo review`: `memo review show <id>`, luego `memo review confirm <id>/<finding>` o `memo review reject <id>`.
Ningún agente puede confirmar ni rechazar hallazgos de correo. `memo review status` muestra la marca de cada buzón y lo que espera.

El texto de los correos va al proveedor del modelo del agente que programas. Detenlo con `memo schedule remove mail-triage`.

## Comandos que pasaron a mail

Memo ya no lee un buzón por sí mismo. Sus antiguos comandos de correo no cambian nada y nombran su sustituto.
`<profile>` es el perfil de `mail` que guarda la dirección. `mail session list` los lista.

| Comando antiguo de Memo | Ejecuta en su lugar |
|---|---|
| `memo mail add <account> <address>` | `mail <profile> session start --address <address>`, luego `mail <profile> sync` |
| `memo mail check <account>` | `mail <profile> account check` |
| `memo mail inspect <account>` | `mail <profile> account inspect`, las mismas opciones, sin cuenta |
| `memo mail rules list\|add\|remove\|apply\|export\|import <account> …` | `mail <profile> rules list\|add\|remove\|apply\|export\|import …`, las mismas opciones, sin cuenta |
| `memo mail delete <account>` | `mail <profile> messages delete --rules` (una vista previa; `--yes` mueve el correo) |
| `memo mail restore <account> --run <id>` | `mail <profile> messages restore --run <id>`; los id de ejecución de Memo sirven allí |
| `memo mail runs list <account>` | `mail doctor`, que nombra las ejecuciones que se detuvieron a medias o cuya Papelera de Gmail se vaciará pronto; cada ejecución es un archivo `<id>.jsonl` en la carpeta de estado de Memo, en `mail-trash/<profile>/` |

Una configuración que aún tiene los antiguos ajustes `mail` de Memo se carga, y nada los lee: `memo doctor` nombra los buzones
que contienen, para que `mail` los sincronice, y `memo config unset mail` los quita. El correo que importó Memo sigue en el
almacén y se sigue encontrando. `mail <profile> sync` de la misma dirección continúa a partir de él.

## Encontrar tu correo

```sh
memo search mail 'invoice'
memo search mail 'from:kai subject:budget'
memo search mail 'mailbox:starred' --source email:you@example.com
memo search mail 'trip NOT mailbox:bulk'
memo search all 'budget'
```

El correo masivo (boletines, avisos, listas de correo y todo lo que tiene una cabecera List-Id, List-Unsubscribe o
`Precedence: bulk`) está en la carpeta `bulk` (`memo:bulk`), así que `NOT mailbox:bulk` lo deja fuera cuando llena una
búsqueda. No se deja fuera por defecto: las facturas, las reservas y otros avisos de empresas llevan las mismas cabeceras.
`--source email:<address>` nombra un buzón. `--source email:a@example.com,email:b@example.com` busca en los dos.

`mail <profile> sync` también puntúa a todos los remitentes a partir del correo ya guardado, como máximo una vez al día, igual que
`mail <profile> account inspect` puntúa un grupo. Un resultado de un remitente evaluado incluye `sender_score` en `--json`, con la
puntuación y sus señales. El correo de un remitente cuyos indicios de fraude suman 3 o más aparece después del resto de la página en
`memo search mail` y `memo search all`, y su `sender_score` indica `demoted: true`. No se deja fuera nada. Lo tuyo nunca se mueve:
un dominio al que escribiste a alguien, el dominio de tu buzón y un remitente que conserva una regla de protección.
`--plain-order` deja ese correo donde lo ponen las palabras, para encontrarlo:

```sh
memo search mail 'invoice' --plain-order
```

Las etiquetas de Gmail, como Recibidos, Importantes, Destacados y tus propias etiquetas, se convierten
en carpetas de correo, así que `mailbox:important` las encuentra. Consulta
[Búsqueda](./search.md#search-mail).

`memo messages show <msg:email/…>` muestra un correo entero. El correo que importaron versiones anteriores de Memo conserva el
texto que Memo leyó de cada adjunto, como el PDF de una factura: los primeros 4.000 caracteres de cada uno, o todo con `--full`.
El correo sincronizado con `mail` no tiene texto de adjuntos.

Con `--before-n` y `--after-n` también muestra ese número de correos anteriores y posteriores del mismo hilo, del más antiguo
al más nuevo, con el correo que pediste marcado `anchor: true`. El hilo es el que da el buzón (el hilo propio de Gmail, o en
otros buzones el primer correo que nombra su cabecera `References`). Un correo solo en su hilo, como la mayoría de los
boletines, vuelve solo.

## Cuando se borra un correo

Cuando borras un correo en tu buzón, su texto sale del almacén en el siguiente `mail <profile> sync`, y Memo ya no
lo encuentra.

## El correo y las personas

Una dirección que ya tiene el contacto de una persona se une a esa persona por sí sola. Otra dirección se une cuando
la enlazas: `memo people link email:kai@example.com telegram:Kai`. Entonces su correo forma parte de
[su contexto](./people.md#everything-about-a-person).

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
