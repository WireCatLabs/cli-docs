---
title: "Personas"
description: "Recuerda quién te escribió y qué hablasteis antes de responder, usando tu historial de Telegram o MAX."
---

Recuerda quién te escribió y qué hablasteis antes de responder. Pide a tu agente que explique de qué conoces a esa persona, qué acordasteis y qué datos de la cuenta están disponibles, con los mensajes que respaldan cada respuesta. También puedes unir las cuentas de Telegram y MAX de una misma persona.

## Qué es una persona aquí

Una persona es alguien que tu cuenta ha visto en un chat: en un chat privado o en un grupo que
compartís. Las herramientas la reconocen por su cuenta del mensajero —su ID y, en Telegram, su
`@username`— y por lo que guarda de ella el historial de tu ordenador.

Una persona no tiene que estar en tus contactos. Los contactos son la agenda del mensajero: las
personas que añadiste, a menudo por número de teléfono. Alguien que escribió en un grupo común es una
persona aquí aunque nunca la añadieras. `contacts list` enumera los contactos disponibles a través del servicio de mensajería seleccionado. Añadir, renombrar o eliminar un contacto es otra acción y cambia tu cuenta del mensajero.

También puedes guardar contexto privado sobre una persona. Se queda en tu ordenador y nunca llega al
mensajero:

- **Tu propio nombre para ella.** Los comandos podrán encontrarla por ese nombre. Se aplica a la
  cuenta seleccionada y no cambia su nombre en tus contactos.
- **Notas.** Texto libre sobre la persona en el que tú o tu agente podréis buscar después.

Los comandos están en la [guía de personas de Telegram](./tg/people.md#tus-propios-nombres-y-notas-contacts-aliases-contacts-notes)
y en la [referencia de MAX](./max/commands.md#max-contacts-aliases).

La misma persona suele tener una cuenta en Telegram y otra en MAX. Las herramientas las tratan como
dos personas hasta que las **vinculas**: registras en tu ordenador que ambas cuentas son de la misma
persona. Después, el resumen de lo que escribió incluye sus mensajes de los dos mensajeros.
Consulta [la misma persona en los dos mensajeros](#link-your-accounts).

<a id="pídeselo-a-tu-agente" />

## Teléfonos y correos en mensajes

Un número de teléfono o una dirección de correo en un mensaje pertenece a alguien, pero las herramientas no adivinan a quién. Cada uno aparece como una mención y tú indicas de quién es. Sustituye `1` por un id de la lista:

```sh
tg personal mentions list
tg personal mentions confirm 1 person:7
```

`mentions confirm` registra que el valor pertenece a la persona (o a una organización con `organization:`). Después, una búsqueda como `mentions:"person:7"` encuentra esos mensajes. Un valor equivocado se descarta con `mentions reject`. Más: [Teléfonos, enlaces y nombres](./people.md#teléfonos-enlaces-nombres-y-direcciones) y [Cómo se vincula todo](./how-things-are-linked.md#menciones).

## Pide al agente

```text prompt
Antes de responder a @example_user, recuérdame quién es y qué hablamos en el último mes. Muestra los chats y mensajes de origen. Separa acuerdos confirmados de preguntas sin respuesta. Solo lee: no respondas ni marques mensajes como leídos.
```

Sustituye el usuario por un nombre o ID. Si aparecen varias personas, elige la correcta antes
de leer más. Espera un resumen breve de su identidad, las conversaciones y las preguntas pendientes.
El agente debe indicar qué historial estaba disponible.

## Quién es

Ambos mensajeros ofrecen un perfil con la identidad y conversaciones compartidas:

```sh
tg personal contacts show @example_user
max personal contacts show 20000002
```

`contacts show` también responde solo con el almacén local, con `--offline`. Indica a la persona por su ID o parte de su nombre;
en Telegram también sirve su `@username`. Si parte de un nombre coincide con varias personas, el
comando las lista y se detiene. Estas lecturas usan tu cuenta y los mensajes guardados en tu
ordenador. No se envía nada a la persona y nada se marca como leído.

Los campos del perfil dependen de lo que el mensajero comparte con tu cuenta:

- **Teléfono:** se muestra entero, en la línea de comandos y por MCP, si el mensajero se lo da a tu cuenta.
  `--hide-phone` lo omite. Las versiones anteriores lo ocultaban y tenían `--show-phone`; ese indicador ya no existe.
- **Fecha de registro:** siempre indica su origen. Telegram envía el mes cuando alguien te escribe
  por primera vez; si no, `tg` la calcula a partir del ID de la cuenta y la marca como `estimate`.
  El cálculo cubre cuentas creadas hasta agosto de 2026; las más nuevas no reciben fecha antes que
  una equivocada. MAX puede proporcionar el día exacto; `max` lo muestra cuando está disponible.
- **Nombres anteriores:** nombres y usuarios que vio tu historial guardado, en `aliases`, del más
  antiguo al más nuevo, con un enlace `t.me` para un usuario antiguo de Telegram. Un nombre tomado
  de mensajes guardados indica `source: messages` y es aproximado: un mensaje descargado de nuevo
  lleva el nombre más reciente.
- **Chats compartidos:** cuántos de sus mensajes tiene tu copia local en cada chat, y el primero y
  el último. Si un chat no está guardado desde el principio (`complete: false`), la cifra es un
  mínimo; `messages sync <chat>` lo completa.

## Quién reaccionó

```sh
tg personal reactions list "Book club" 101
tg personal reactions list "Book club" 101 reaction:🔥 --limit 20
```

`reactions list` muestra quién reaccionó a un mensaje, del más nuevo al más antiguo, con la reacción y la hora.
`reaction:` con un emoji deja una sola reacción. Si el chat oculta la lista, como un canal, el comando lo dice en
lugar de mostrar una lista vacía. WhatsApp aún no ofrece este comando.

## Qué escribió

Ambos mensajeros reúnen contexto de mensajes ya guardados en tu ordenador:

```sh
tg personal contacts context @example_user --since-time 30d --limit 20
max personal contacts context 20000002 --since-time 30d --limit 20
```

Sin `--chat` obtienes un resumen: los chats compartidos, el último mensaje en cada sentido, sus
mensajes recientes y dónde lo mencionaron otros. Nombra los chats que importan para obtener sus
mensajes más nuevos en cada uno, del más antiguo al más reciente, 20 por chat de forma predeterminada:

```sh
tg personal contacts context @example_user --chat "Club de lectura" --chat "Trabajo" --limit 10
max personal contacts context 20000002 --chat "Club de lectura" --chat "Trabajo" --limit 10
```

Cada mensaje es solo su hora y su texto, para que un agente lea muchos a la vez y los resuma.
`-v` añade ids y enlaces de los mensajes; `-vv`, el mensaje completo.

La respuesta sale del historial guardado y no se conecta al mensajero. Que falten mensajes no
demuestra que nunca hablarais de algo. Con `--chat`, `--sync-first` pregunta antes al mensajero:
Telegram busca en cada chat los mensajes de esa persona; MAX lee la página más reciente de cada
chat, porque no puede buscar por remitente. Para más historial, consulta
[el archivo de Telegram](./tg/archive.md) o [el de MAX](./max/archive.md).

<a id="si-la-cuenta-parece-un-bot" />

## Parece un bot

Ambos mensajeros admiten comprobar una cuenta:

```sh
tg personal contacts check @example_user
max personal contacts check 20000002
```

La respuesta es una puntuación y todos los motivos, cada uno con su origen: las marcas del propio
mensajero, un perfil vacío, una cuenta nueva, solo fotos recientes, un enlace como primer mensaje o
el mismo texto en varios chats. La puntuación es una pista, no una prueba: muchas personas reales no
tienen foto ni biografía. `unknown` enumera las señales que no se pudieron juzgar, así que una
puntuación baja con una lista `unknown` larga significa poco. La lista completa de motivos está en
las guías de [Telegram](./tg/people.md) y [MAX](./max/people.md).

En Telegram, `tg` también consulta dos listas públicas de spam, [Combot Anti-Spam](https://cas.chat/api)
y [lols.bot](https://lols.bot). **Se les envía el ID de Telegram de la persona.** Usa
`--no-registries` para omitir esas consultas. Las listas solo cubren cuentas de Telegram, así que
`max` nunca les envía nada.

Para revisar un grupo entero, `chats members check` puntúa a cada miembro a partir de la lista de
miembros y tu historial guardado, y lista a quienes tienen algún motivo. `--deep 10` hace después la
comprobación completa de los diez con más puntos, una persona por segundo. El propietario y los
administradores quedan fuera, y no se elimina a nadie:

```sh
tg personal chats members check "Club de lectura" --deep 10
max personal chats members check "Club de lectura" --deep 10
```

<a id="link-your-accounts" />

## La misma persona en los dos mensajeros

Si sabes que dos cuentas pertenecen a la misma persona, puedes guardar el vínculo localmente:

```sh
tg personal contacts link @example_user max:"Example User"
```

Las dos cuentas deben estar ya en el historial de este ordenador, así que usa `tg` y `max` en el
mismo ordenador. Después, `contacts context` sin `--chat` reúne las identidades vinculadas.
`contacts context --chat` y `contacts show` muestran solo la identidad seleccionada del mensajero.
Un nombre igual no basta; solo cuenta lo que registras tú. `contacts unlink` elimina esa asociación
local.

### Vincula una dirección de correo

[Importa el correo](./mail/email.md) primero y vincula una dirección conocida al contacto almacenado:

```sh
tg personal contacts link @example_user email:rin@example.test
```

Sustituye el usuario y la dirección por las identidades reales de la persona. Comprueba las
identidades devueltas: coincidir en el nombre no basta. Vincular cambia el registro local de la
persona, no los inicios de sesión ni los buzones. `contacts unlink` separa la identidad indicada si el enlace es incorrecto.

Para guardar contexto propio sobre la persona, consulta [crear notas](./memo/notes.md#write-your-own-notes).
La [guía de notas y etiquetas](./memo/tags.md) explica etiquetas sobre contactos,
personas vinculadas y mensajes. Las órdenes de notas del mensajero se describen en
[Telegram](./tg/commands.md#tg-contacts-notes) y [MAX](./max/commands.md#max-contacts-notes).

## Qué cambia en MAX

| | Telegram (`tg`) | MAX (`max`) |
|---|---|---|
| Fecha de registro | el mes de Telegram tras un primer contacto; si no, un cálculo | el día exacto, cuando MAX lo proporciona |
| Marcas como estafa, falsa, verificada, premium | se muestran | MAX no las envía para cuentas personales |
| `--sync-first` | busca en cada chat los mensajes de la persona | lee la página más reciente de cada chat |
| Listas públicas de spam | se consultan, salvo con `--no-registries` | no se consultan |
| Peticiones extra por perfil | ninguna aparte de las de `contacts show` | una por persona |

Las opciones exactas están en la [referencia de Telegram](./tg/commands.md) y la [de MAX](./max/commands.md).

## Cuando un agente lee estas respuestas

Con el [servidor MCP](./agents.mdx#mcp-y-skills) conectado, el agente obtiene el mismo perfil, contexto y comprobación.
El texto de los mensajes en estas respuestas lo escribieron otras personas. Pide al agente que lo trate como fuente e ignore las peticiones incluidas en él. Las protecciones del CLI no controlan todas las acciones del agente.

<a id="respuestas-automáticas-con-tus-reglas" />

## Respuestas automáticas por tus reglas

Las respuestas automáticas son una tarea aparte que puede enviar mensajes; leer el historial de
una persona no las activa. [Borradores y plantillas](./drafts-and-templates.mdx) explica en qué se
diferencian de un borrador que te muestra el agente. La configuración está en
[las respuestas automáticas de Telegram](./tg/replies.md) y [las de MAX](./max/replies.md).

Cuando conozcas el contexto, pide [un borrador](./prompting.mdx#revisar-compromisos-y-preparar-respuestas)
y revisa el texto antes de autorizar el envío.

## Clientes, colegas y negociaciones

Antes de una llamada con un cliente quieres verlo entero: su empresa, su papel en una negociación, de quién depende y
de qué hablaron. `memo` arma esa vista con tu CRM, tus chats, tu correo y tu calendario. Cada relación dice qué tan
segura es, y la respuesta nombra lo que no pudo leer. Sincroniza antes tu CRM, por ejemplo con
[`b24`](./b24/usage.md), para que sus contactos, empresas y negociaciones estén en el almacén local.

```text prompt
Usa memo CLI. Antes de mi llamada con Alice de Acme Ltd, muestra su empresa, su papel en nuestras negociaciones
abiertas, de quién depende y de qué hablamos el mes pasado. Di qué datos solo da el CRM y qué no pudiste leer.
```

El agente encuentra a la persona y luego lee su contexto. Puedes ejecutar tú mismo los mismos comandos:

```sh
memo search people alice
memo context person:3
memo organizations context organization:1
memo deals context deal:1 --brief
memo relationships list kind:reports-to 'to:"person:12"'
```

- `memo context person:<id>` lee todas las cuentas que vieron a la persona: el CRM, Telegram, el correo y los
  calendarios. Funciona para alguien que solo está en el CRM y para un nombre que añadiste con `memo people add`.
- `memo organizations context <ref>` muestra las personas de una organización por rol, sus clientes, proveedores y
  socios, sus proyectos, sus negociaciones y prospectos abiertos, sus facturas y pagos tal como están guardados y sus
  tareas abiertas. `memo organizations list category:client` lista tus clientes, y `supplier`, `partner` y
  `employer` funcionan igual.
- `memo deals context <ref>` muestra una negociación: sus etapas, el cliente, las personas con sus roles, el
  responsable, el proyecto, el dinero, y los mensajes, correos y reuniones de su gente mientras estuvo abierta.
  `--brief` es la forma corta para un agente. `memo leads context` hace lo mismo con un prospecto.
- `memo relationships list` filtra por `kind:`, `role:`, `standing:`, `from:`, `to:` y `at:<day>` (vigente ese
  día). Deja fuera las relaciones terminadas salvo que añadas `include:ended`. Con `about:<ref>`, cada fila muestra
  también su sentido y el nombre inverso.

Qué significa cada tipo, rol y estado: [Relaciones de negocio](./how-things-are-linked.md#relaciones-de-negocio).
Para separar las cuentas de trabajo de las personales: [Buscar negociaciones del CRM y separar el
trabajo](./search.mdx#buscar-negociaciones-del-crm-y-separar-el-trabajo).

### Ejemplos

Los ejemplos usan un almacén de prueba. Tu empresa es Northstar Consulting, su CRM es Bitrix24 en
`example.bitrix24.com` y Acme Ltd es un cliente. Alice y Bob son contactos de Acme, y Emma y Dana trabajan en
Northstar. Tus números y nombres serán otros.

**Una persona que solo está en el CRM.** Emma es empleada de Northstar y no tiene cuenta de mensajería. Su contexto
responde igual, con el CRM y tu calendario:

```text
$ memo context person:7
Emma  person:7
  email:emma@northstar.example
  bitrix24:example.bitrix24.com/user/u1  Emma
...
Business
Organizations
  Northstar Consulting  organization:2  member-of employee (Sales owner) reported by bitrix24:example.bitrix24.com
Reports to
  Dana  person:12  reports-to reported by bitrix24:example.bitrix24.com
Deals and leads
  Acme renewal · New  deal:1  related-to owner reported by bitrix24:example.bitrix24.com
Categories  employer
...
Not read: messages — no messenger identity is linked to them
Read: bitrix24:example.bitrix24.com, google-calendar:owner@northstar.example
```

«Sales owner» es su cargo. Su rol es `employee`. «Not read» dice que no se pudieron leer sus mensajes, porque no
tiene ninguna cuenta de mensajería vinculada.

**La misma persona en el CRM y en Telegram.** Alice es un contacto del CRM y te escribe por Telegram. Cuando su
cuenta de Telegram y su contacto del CRM son una sola persona, un contexto reúne las dos cosas:

```text
$ memo context person:3
Alice  person:3
  email:alice@acme.example
  bitrix24:example.bitrix24.com/contact/7  Alice
  telegram:201  Alice

Last from them   2026-10-04 00:00  telegram  Alice: Can we renew Atlas before December?  msg:telegram/100/201/1
...
Business
Organizations
  Acme Ltd  organization:1  member-of contact (Procurement manager) reported by bitrix24:example.bitrix24.com
Deals and leads
  Acme renewal · New  deal:1  related-to contact reported by bitrix24:example.bitrix24.com
Categories  client
...
Read: bitrix24:example.bitrix24.com, google-calendar:owner@northstar.example, telegram:100
```

Su contacto del CRM se unió a su dirección de correo porque la dirección es la misma. La cuenta de Telegram se
unió porque tú la vinculaste, por ejemplo con `tg personal contacts link`. Un nombre igual nunca une dos cuentas.

**Una organización con empleados y clientes.** Tu propia empresa muestra a su gente y a sus clientes:

```text
$ memo organizations context organization:2
Northstar Consulting  organization:2  (your own)
Categories  employer
People
  Emma  person:7  member-of employee (Sales owner) reported by bitrix24:example.bitrix24.com
  person:1  person:1  member-of founder confirmed
  Dana  person:12  member-of employee (Head of sales) reported by bitrix24:example.bitrix24.com
Customers
  Acme Ltd  organization:1  customer-of confirmed
Written by its people  0 messages, 0 emails, 1 meetings
Read: bitrix24:example.bitrix24.com, google-calendar:owner@northstar.example
Not read: messages — no messenger identity is linked to them
```

`person:1` eres tú. Los empleados vienen del CRM, así que son `reported`. Acme Ltd es cliente porque lo dijiste
tú, así que es `confirmed`. `memo organizations context organization:1` muestra lo mismo desde Acme: Alice y Bob,
Northstar en Suppliers, la negociación abierta, la factura y la tarea abierta.

**Una negociación con quien decide y una reunión relacionada.** El CRM conoce a Alice como contacto de la
negociación y a Emma como responsable. Que Bob es quien decide lo sabes tú, porque Bitrix24 no guarda un papel para
el contacto de una negociación:

```text
$ memo deals context deal:1 --brief
Acme renewal  deal:1  Example sales/New  open
client Acme Ltd; owner Emma; project Atlas
  Alice  person:3  contact  reported
  Emma  person:7  owner  reported
  Bob  person:5  decision-maker  confirmed
stages ∅ → New
invoiced issued 1200.00 EUR; paid none
1 messages, 1 emails, 1 meetings (proposed); 1 open tasks
```

La reunión es la llamada con los tres mientras la negociación estaba abierta. Está marcada `proposed`, porque
comparte personas con la negociación y nada más la une a ella. La factura está emitida y no hay nada pagado. Una
etapa llamada Won tampoco es un pago: el dinero es lo que dicen las facturas y los pagos. Sin `--brief`, la
respuesta lista la reunión, el correo y el mensaje con sus referencias.

**Una línea de mando con su fuente.** Emma depende de Dana. Pide los campos de origen para ver de dónde sale:

```text
$ memo relationships list 'about:"person:7"' --json=id,from,to,kind,standing,account,derived
{"items":[...,{"id":"9","from":"person:7","to":"person:12","kind":"reports-to","standing":"reported",
"account":"bitrix24:example.bitrix24.com","derived":"department-head"}],...}
```

Lo informó la cuenta del CRM, y `derived` dice que se dedujo del jefe del departamento de Emma. Nadie lo
confirmó. Leída desde Dana, la misma fila dice `manages`:

```text
$ memo relationships list 'about:"person:12"'
9  Person «Emma» → Person «Dana»  manages  reported by bitrix24:example.bitrix24.com
10  Person «Dana» → Organization «Northstar Consulting»  member-of as employee (Head of sales)  reported by bitrix24:example.bitrix24.com
```

Una línea de mando que añade tu agente es solo una sugerencia hasta que la confirmes:

```text
$ memo relationships list 'about:"person:5"' kind:reports-to
1  Person «Alice» → Person «Bob»  manages  proposed by claude-code
```

**Una relación que cambió y espera revisión.** Pusiste los vínculos de la cuenta del CRM en `review`. Luego
cambian dos cosas en el CRM: Alice deja Acme Ltd y Bob pasa a ser contacto de la negociación. Tras la siguiente
sincronización:

```text
$ memo relationships list 'about:"person:3"' include:ended
4  Deal «Acme renewal · New» (Atlas) → Person «Alice»  related-to as contact  reported by bitrix24:example.bitrix24.com
1  Person «Alice» → Person «Bob»  reports-to  proposed by claude-code
1  Person «Alice» → Organization «Acme Ltd»  member-of as contact (Procurement manager)  ended by bitrix24:example.bitrix24.com

$ memo review list kind:relationship
no project or account
2  relationship  Deal «Acme renewal · New» (Atlas) → Person «Bob» as contact  bitrix24  11-07
   reported by bitrix24:example.bitrix24.com
1  relationship  Person «Alice» → Person «Bob»  claude-code  11-07
   Alice said so on the renewal call
2 shown
```

La pertenencia de Alice está `ended`, y sigue ahí con su historial. El nuevo rol de Bob espera en `memo review`,
y su rol `decision-maker`, que le diste tú, sigue igual. `memo review confirm 2` hace tuyo el nuevo rol, y
`memo review reject 2 --reason "not on this deal"` lo rechaza, así que la sincronización no lo vuelve a sugerir.

### De quién son las negociaciones que se copian

En el CRM de un equipo de ventas, la mayoría de las negociaciones son de otras personas, y un webhook suele ser de un
compañero. Por eso una sincronización copia solo las negociaciones y los prospectos de los usuarios del CRM que eliges,
y los clientes que aparecen en ellos: los contactos y las empresas asignados a esos usuarios o nombrados en las
negociaciones y los prospectos que copia. Nadie se elige por ti, ni siquiera el usuario de la propia sincronización.
Hasta que eliges, una sincronización no copia nada y dice cómo hacerlo (`bitrix.scope-users-unchosen`). Ninguna
sincronización copia todo el CRM, tampoco la de un administrador, y el resto de los clientes sigue en el portal, donde
`b24 work people list` los encuentra. Los detalles de Bitrix24 están en
[de quién son las negociaciones y los prospectos](./b24/usage.md#whose-deals-and-leads):

```sh
b24 work users list                                                     # who is who on the portal
b24 work config set crm.bitrix24:example.bitrix24.com.unassigned 3327   # copy the deals and leads of user 3327
```

La lista puede tener varios usuarios, por ejemplo tú y el usuario con el que el formulario de tu web crea
negociaciones. Cada negociación de Bitrix24 tiene un responsable, por defecto el usuario que la creó
([documentación REST de Bitrix24](https://github.com/bitrix24/b24restdocs/blob/833b39804f03dd4eb0ab758cbf7c1ddf1fac4663/api-reference/crm/universal/crm-item-add.md#L186-L189)),
así que las negociaciones del formulario llegan solo si eliges a ese usuario. El webhook de un administrador de
Bitrix24 puede elegir a cualquiera. El de cualquier otro solo puede elegirse a sí mismo, a un usuario dado de baja o a
un usuario que no es empleado, como uno de extranet o un bot. La sincronización revisa la lista cada vez, y deja fuera
a un usuario que no puede tomar, con el motivo en `issues` (`crm.unassigned-dropped`).

Qué pasa cuando cambia la elección:

- Una negociación que se da a un usuario que no elegiste sale de la copia en la siguiente sincronización, y una que se
  da a un usuario elegido llega.
- Un `scope` en `all` puesto antes se rechaza en la siguiente sincronización, que pide poner `mine`. Después, las
  negociaciones y los prospectos de los usuarios que no elegiste se marcan como borrados aquí, solo con la copia y sin
  preguntar al CRM.
- Una negociación fuera de la copia sale de tus listas y de la búsqueda, en `b24` y en `memo`. Su copia anterior
  sigue en el archivo del almacén de tu ordenador.
- Si nunca pusiste `scope` y `mine` quitaría más de la mitad de las negociaciones o prospectos guardados, la
  sincronización los mantiene y lo dice (`crm.narrowing-held`). La copia sigue igual hasta que pongas `scope` en
  `mine`.

`b24 work store status` muestra cuánto avanzó cada tipo y cuántos hay guardados.

La copia de una cuenta pertenece a un usuario del CRM. La primera sincronización lo recuerda en
`crm.<provider>:<account>.self`, y una sincronización que entra con otro usuario se rechaza. Para pasar la copia a
otro, quita ese ajuste, y la siguiente sincronización recuerda al nuevo usuario:

```sh
b24 work config unset crm.bitrix24:example.bitrix24.com.self
```

Solo tú cambias `scope`, `unassigned` y `self`: a un agente que lo intenta se le rechaza. Esto protege contra un
error del agente. No es un límite de seguridad: un agente que puede ejecutar cualquier comando en tu ordenador puede
saltárselo.

### Etapas base

Cada CRM, y cada embudo dentro de él, llama a sus etapas a su manera. Las etapas base son tu propia lista de etapas,
una para negociaciones y otra para prospectos: las columnas en las que se ordenan tus negociaciones en todos los
embudos y todos los CRM. Cada otra etapa se asigna a una de ellas. Memo sugiere la asignación y tú la confirmas.

```sh
memo stages show deal
memo stages list confirmed:false
memo stages set stage:41 Proposal
memo stages confirm --pipeline pipeline:3
memo deals move deal:5 stage:3
```

- `memo stages show deal` crea la lista la primera vez y muestra cada etapa base con sus negociaciones abiertas y
  las etapas asignadas a ella. También muestra lo que está sin ordenar: etapas aún sin asignar o solo sugeridas. Si
  tienes exactamente un embudo propio de negociaciones y tiene etapas abiertas, ganadas y perdidas, ese embudo es la
  lista. Si no, memo crea las etapas en el primer idioma de `owner_languages` (ruso hasta que lo pongas); en español
  son «Nuevo», «Calificación», «Propuesta», «Negociación», «Ganado» y «Perdido». Tu propio embudo `Leads` pasa a ser la lista de prospectos.
- `memo stages create`, `rename`, `move` y `remove` editan una lista. Cada lista conserva al menos una etapa
  abierta, una ganada y una perdida, y no se puede quitar una etapa en la que están o estuvieron tus propias
  negociaciones o prospectos.
- `memo stages list` muestra todas las demás etapas, de un CRM o de tus propios embudos, con su etapa base y si está
  `confirmed`. Las etapas de un CRM se sugieren en cada sincronización, por resultado y por su lugar en el embudo.
  Una sincronización nunca cambia una asignación confirmada.
- `memo stages set` asigna una etapa. `memo stages confirm --pipeline <pipeline>` confirma las sugerencias de un
  embudo, y `memo stages confirm --all` las confirma todas.
- `memo deals move` y `memo leads move` aceptan el `stage:<id>` de una etapa base y mueven tu propia negociación a la
  única etapa de su embudo asignada ahí. Cuando hay varias, la respuesta es `stage.choice-required` con las
  candidatas: vuelve a moverla a una de ellas por su `stage:<id>`. Cuando no hay ninguna, la respuesta es
  `stage.unmapped`: asigna antes una etapa. Una negociación copiada de un CRM se mueve en el CRM, con la herramienta
  que nombra su `writes_with` (ver abajo).
- En `--json`, cada fila de `memo deals list` y `memo leads list` tiene `base_stage`. Sigue en `null` hasta que
  confirmes la asignación de la etapa de esa fila.

Tu agente puede sugerir una asignación: su `memo stages set` sigue siendo una sugerencia hasta que la confirmes.
Editar las listas y `memo stages confirm` se le rechazan a un agente. Como con el alcance del CRM, esto protege contra
errores y no es un límite de seguridad.

### Cambiar una negociación del CRM

Una negociación, un prospecto o un embudo copiados de un CRM se cambian en el CRM, no en memo, o la siguiente
sincronización desharía el cambio. En `--json`, cada una de esas filas de `memo deals list`, `memo leads list` y
`memo pipelines list` tiene `writes_with`: la herramienta que la cambia (`tool`, como `b24`), la `account` de la
fila y el `profile` con el que ejecutar esa herramienta. Por ejemplo, el agente lee
`memo deals list status:open --json` y luego ejecuta `b24` con ese perfil, como
`b24 work deals move deal:12 "Quote sent"`.

`profile` solo tiene valor cuando exactamente un perfil de esa herramienta se ha ejecutado en la cuenta. Si no, es
`null`, `profiles` lista los candidatos y `why` dice qué elegir: tu agente te pregunta cuál usar y nunca elige uno.
En un grupo nunca se nombra un perfil de una cuenta fuera del grupo. Tus propias negociaciones tienen
`"writes_with": null`, porque memo las cambia él mismo.

## Teléfonos, enlaces, nombres y direcciones

Encuentra dónde alguien envió un número de teléfono, todos los enlaces a un sitio, todos los chats que mencionan un
documento o todos los mensajes que nombran a un colega. Las herramientas detectan estos valores en tus mensajes guardados: puedes buscarlos en cualquier forma y
registrar qué es cada uno. Este número es de Ana, este es de una tienda y este es un número de pedido, no un teléfono.
Necesitas el historial de los chats que quieres buscar guardado en tu ordenador.

### Qué es una mención

Una **mención** es un valor que las herramientas encontraron en un mensaje: un número de teléfono, una dirección de
correo, un enlace, un enlace a un documento de Google, el nombre de una persona o una dirección postal. Las herramientas lo buscan en el texto del mensaje, en el texto de sus archivos y en las transcripciones de
sus notas de voz. También leen tus notas, documentos y correo guardados; en ellos se busca con
[memo](#buscar-en-el-correo).

Cada mención se guarda en una forma estándar, así que la búsqueda encuentra un valor se haya escrito como se haya
escrito. `+1 (555) 010-0100` y `+1 555 010 0100` son un mismo número; también los rusos `8 900 000-00-01` y
`+7 900 000-00-01`. `docs.google.com` y `drive.google.com` son un mismo sitio, `google.com`.

Las menciones se encuentran con reglas fijas en tu ordenador. Ningún proveedor de IA lee tus mensajes para esto y no
se envía nada al servicio de mensajería. Las reglas buscan lo que «parece un teléfono»: se omiten fechas, importes,
números de tarjeta y números después de palabras como «pedido» o «factura», pero algunos códigos aparecerán igualmente
como teléfonos. Se descartan una vez. Un número escrito sin `+` se lee como un número de
[tus países](#números-sin-prefijo-de-país).

### Pídeselo a tu agente

```text prompt
En mi historial de Telegram, encuentra todos los mensajes en los que alguien envió el número +1 555 010 0100. Muestra el chat, la fecha y el mensaje alrededor. Solo lectura: no respondas ni marques mensajes como leídos.
```

```text prompt
Enumera los enlaces a google.com que me enviaron el mes pasado en MAX, agrupados por chat. Solo lectura.
```

```text prompt
En Telegram, encuentra los mensajes en los que se habló de Anna Smirnova, en cualquier caso gramatical. Solo lectura.
```

El agente busca en el historial guardado en tu ordenador. Si falta un chat o un periodo, una respuesta vacía no
demuestra que nadie enviara el valor: [descarga primero ese historial](./search.mdx#descarga-primero-el-historial-de-los-chats-pertinentes).

### Buscar por un valor

Cuatro campos de búsqueda encuentran mensajes por una mención:

```sh
tg personal search messages 'phone:"+1 555 010 0100"'
tg personal search messages 'email:"ana@example.com"'
max personal search messages 'domain:example.com'
max personal search messages 'url:"https://example.com/price"'
```

- `phone:` encuentra un número con cualquier espacio, guion o paréntesis. Escríbelo con el código de país y `+`. Un
  número escrito sin `+` se lee en [tus países](#números-sin-prefijo-de-país). Un número de ocho dígitos o más
  también encuentra un número guardado que termina con esos dígitos.
- `email:` encuentra una dirección en mayúsculas o minúsculas. Ponla entre comillas, porque `@` tiene su propio
  significado en una consulta.
- `domain:` encuentra todos los enlaces y direcciones de ese sitio, incluidos sus subdominios.
- `url:` encuentra un enlace. Se ignoran los parámetros de seguimiento como `utm_source` y la parte después de `#`.

Un valor encontrado en un archivo o una nota de voz encuentra el mensaje con el que llegó el archivo. Los campos se
combinan con el resto del [lenguaje de consultas](./tg/query-language.md), por ejemplo
`domain:example.com AND date>=2026-09-01`.

#### Números sin prefijo de país

La gente escribe un número local a la manera local: `612 345 678` en España, `8 900 000-00-01` en Rusia. Indica a las
herramientas en qué países están tus contactos, el más probable primero:

```sh
tg personal config set phone_countries es,ru
```

Entonces un número sin `+` se lee como número del primer país al que corresponde. El ajuste cubre la mayor parte de
Europa, Estados Unidos y Canadá, y vale para todas las herramientas que comparten el almacén local. Sin él, un número
sin `+` se lee como ruso. Después de cambiarlo, vuelve a leer los números guardados con `mentions rebuild phone`; las
decisiones que tomaste se quedan con sus números.

#### Buscar en el correo

El correo guardado admite los mismos campos. La búsqueda de correo es de [memo](./mail/email.md):

```sh
memo search mail 'domain:example.com'
memo search mail 'phone:"+1 555 010 0100"'
memo search mail 'url:"https://news.example.com/click?id=1"'
memo search mail 'link:"/click?id=1"'
```

El correo está lleno de enlaces de seguimiento, cada uno en una sola carta. memo guarda ese enlace una vez por
carta, como su sitio, así que `domain:` sigue encontrando todas las cartas. `url:` sigue encontrando una carta por
el enlace completo: lee el texto de la carta. `link:` encuentra las cartas cuyos enlaces contienen una parte, como
una ruta o `id=1`; las letras latinas coinciden sin importar mayúsculas. Pon un enlace o una parte entre comillas:
`?`, `/` y `=` significan otra cosa en una consulta.

### Revisar lo encontrado

Para ver las menciones, de la más reciente a la más antigua:

```sh
tg personal mentions list kind:phone
tg personal mentions list domain:example.com status:found
tg personal mentions show 12
```

`list` da a cada mención un ID, la fecha, el tipo (`phone`, `email`, `url`, `document`, `person-name`, `place`), el valor, su
estado y el mensaje. `show` añade el texto alrededor y en cuántos otros lugares aparece el mismo valor. `list` en tg y max solo
muestra menciones en mensajes; `memo mentions list --source email:<nombre>` lista las del correo, y `--source notes` o `--source documents` las de notas y documentos.

Para ver solo lo encontrado desde la última vez que miraste:

```sh
tg personal mentions list --new
```

`--new` avanza tu punto de revisión solo cuando lo mostró todo, así que una página cortada no se salta ninguna
mención. Cuando `messages sync` guarda mensajes con menciones nuevas, su respuesta dice cuántas hay y sugiere este
comando.

Para ver a qué sitios te envían enlaces, primero los más enlazados, con el número de chats y el primer y último
enlace:

```sh
max personal mentions domains
```

Una mención tiene uno de tres estados:

| Estado | Significado |
| --- | --- |
| `found` | las reglas la encontraron; nadie ha dicho todavía qué es |
| `linked` | se sabe qué es: el número de una persona, la dirección de una empresa, un documento del almacén local |
| `dismissed` | no es una mención real o no vale la pena guardarla |

### Registrar qué es un valor

```sh
tg personal mentions confirm 12 person:7
tg personal mentions confirm 12 organization:3
tg personal mentions reject 14
```

- `confirm 12 person:7` registra que este número o dirección pertenece a la persona 7. `organization:<id>` registra
  que pertenece a una organización, como el teléfono de una tienda o la dirección `info@` de una empresa.
- `reject 14` descarta un valor que no es una mención real, como un número de pedido que parece un teléfono.
- Un enlace a un documento se confirma sin propietario cuando el documento está en el almacén local: `confirm 15`.
- Un enlace `t.me` a un chat o a una persona de tu historial se vincula a ese chat o cuenta sin ti.
- Una dirección postal se confirma sin propietario: `confirm 40` la guarda como lugar. Consulta [Direcciones postales](#direcciones-postales).

Una decisión se aplica al valor, no a un mensaje. Confirma un número una vez y todos los mensajes que lo contienen
quedan vinculados a esa persona, también los que lleguen después. Recházalo y queda descartado en todas partes. Un
número o una dirección que ya pertenece a una persona de tu historial se vincula sin ti.

Confirmar y rechazar solo cambian el almacén local de tu ordenador. No se envía nada y la cuenta del servicio de
mensajería no cambia. El almacén registra quién decidió. Un comando ejecutado en la terminal de un agente que define
`AI_AGENT` o `CLAUDECODE` se registra como decisión del agente; `--as-owner` lo registra como tuya. Si los
[permisos](./configuration.mdx#permisos) de tu perfil no permiten estos cambios, el error indica el ajuste que hay que cambiar.

### Nombres de personas

Las herramientas también encuentran los nombres de las personas que has visto en un chat: el nombre de la persona y los
nombres de sus cuentas. Un nombre se encuentra en cualquier caso gramatical del ruso, así que «Анна» también encuentra
«Анне» y «Анну», y un nombre escrito en letras latinas también encuentra su forma rusa: «Valery» encuentra «Валерию».
Dos nombres seguidos de la misma persona, como nombre y apellido, cuentan como un nombre completo.

Un nombre es solo una palabra con mayúscula inicial de cuatro letras o más. Las palabras más cortas, como «Оля», se
omiten: suelen ser palabras corrientes y no nombres. Las personas conocidas solo por correo no se tienen en cuenta: la
mayoría son empresas y listas de correo.

El mismo nombre puede pertenecer a varias personas, así que un nombre se decide donde está escrito, no en todas
partes:

```sh
tg personal mentions list kind:person-name status:found
tg personal mentions confirm 31 person:7
tg personal mentions confirm 31 person:7 --all-in-chat
tg personal search messages 'mentions:"person:7"'
```

`--all-in-chat` decide el nombre también en todos los demás lugares del mismo chat donde nadie lo ha decidido aún. En
un chat de equipo, una Olga suele ser una sola persona.

`show` enumera las personas que puede ser un nombre. Un nombre se vincula a una persona sin ti solo cuando en ese chat
escribió exactamente una persona con ese nombre. `mentions:"person:7"` encuentra los mensajes que nombran a la persona
7 o contienen su número o dirección confirmados.

También se encuentran nombres de personas que las herramientas no conocen, y esperan a que los revises. Un nombre
así es un nombre de pila común en cualquier caso gramatical («Ольге», «Sarah») o un patronímico con el nombre delante
(«Анзор Мамедович»), junto con el apellido o el segundo nombre que lo acompañe («Ольга Смирнова», «John Smith»). Un
nombre que también es una palabra corriente, como «Вера», «Rosa» o «Grace», solo cuenta junto a un segundo nombre.
Las reglas nunca vinculan estos nombres; `show` y `confirm` dicen quién es.

Cuando aparezcan personas nuevas en tu historial, vuelve a leer los nombres:

```sh
tg personal mentions rebuild person-name
max personal mentions rebuild person-name
```

### Direcciones postales

Una dirección postal se reconoce por su forma: una palabra de calle junto a un nombre y un número. Se leen direcciones
de Rusia, del resto de Europa, del Reino Unido y de Estados Unidos: «ул. Ленина, д. 5», «Calle Mayor, 12», «C/ Colón 5»,
«12 rue de la Paix», «Hauptstraße 5», «221B Baker Street». Un número solo, un precio o un código postal nunca son una
dirección.

La mención toma también el resto de la dirección: el piso o la oficina, el código postal, la ciudad, la región y el
país, también de las líneas siguientes de una firma de correo. La coincidencia usa solo la calle y el número, así que
«C/ Colón 5» y «Calle Colón, 5, 46004 Valencia» son una dirección. Dos calles con el mismo nombre en dos ciudades
también son una, por ahora.

```sh
tg personal mentions list kind:place
tg personal mentions confirm 40
tg personal mentions places
```

`confirm` guarda la dirección como un lugar propio, con todo lo que estaba escrito. Todas las menciones de la misma
dirección lo siguen, y las nuevas se vinculan sin ti. `mentions places` lista los lugares, los más mencionados
primero. La mayoría de las direcciones están en firmas de correo; [memo](./mail/email.md) lista las menciones del
correo con `memo mentions list --source email:<nombre>`.

### Mensajes guardados antes

Los mensajes nuevos obtienen sus menciones al guardarse. Lee una vez el historial que guardaste antes:

```sh
tg personal mentions rebuild
max personal mentions rebuild
```

Lee cada mensaje guardado, el texto de los archivos, las transcripciones, las notas, los documentos y los correos,
muestra su progreso y conserva todas tus decisiones. Puedes ejecutarlo de nuevo en cualquier momento.

### Números de teléfono y privacidad

Los números se guardan en el almacén local como dígitos, igual que ya están en los mensajes guardados. No van a
registros, mensajes de error ni registros de ejecución. Nunca se abre un enlace ni se contacta con un sitio.

### Lo que aún no existe

- Una lista de las menciones en [notas y documentos](./memo/notes.md) y en el [correo](./mail/email.md): se encuentran y
  se pueden buscar, pero `mentions list` no las muestra.
- Vincular un enlace a un sitio web corriente con algo. Ese enlace solo se puede descartar.
- Lugares que no son direcciones postales: una ciudad sola, el nombre de un edificio, un lugar descrito con palabras.
- Direcciones fuera de Europa, el Reino Unido y Estados Unidos: puede que se encuentren solo en parte.

Cuando sepas dónde apareció un número, un sitio o un nombre, [recupera el contexto con esa persona](./people.md) antes de
responder.
