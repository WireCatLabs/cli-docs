---
title: "Personas y proyectos"
---

Esta página te ayuda a responder a «¿qué sé de esta persona?» antes de contestarle o de reunirte con
ella, y a llevar el control de las empresas, los equipos y los proyectos a los que pertenece. Memo
reúne en una sola respuesta los mensajes de la persona, su correo y tus notas, cada cosa con su
fuente. Nunca decide que dos cuentas son una sola persona porque los nombres coinciden: las enlazas
tú.

## Buscar a una persona por su nombre

```sh
memo search people kai
memo search people 'Kai Sample' --source telegram --json
```

Lee todas las cuentas del almacén, salvo que `--source` nombre algunas, y dice cuáles leyó. Una persona coincide
cuando su nombre, su usuario o el alias que le diste contiene todas las palabras; no importan las mayúsculas ni los
acentos. Cada resultado muestra el `person:<id>` de la persona, que acepta `memo projects evidence --contact`, y las
cuentas que tiene detrás.

## Todo sobre una persona

**Lo más fácil: pídeselo a tu agente.**

```text prompt
Use memo CLI to show what I know about Kai Sample on Telegram: recent messages, mail and my notes.
Tell me what is still open between us, with the source of each point.
```

**O ejecútalo tú:**

```sh
memo context telegram:'Kai Sample'
memo context email:kai@example.com
memo context max:'Kai Sample' --limit 50
memo context person:7
```

Nombra a la persona por su cuenta: `telegram:` o `max:` con un nombre o un ID, o `email:` con una
dirección, o como `person:<id>` (lo da `memo search people`). `person:<id>` lee cada cuenta que la vio, también un
contacto del CRM o un nombre que solo añadiste tú (`memo people add`), y `coverage` nombra cada cuenta que leyó y cada
fuente que no leyó, con el motivo. La respuesta reúne:

- todas las cuentas que enlazaste a la persona;
- el último mensaje en cada sentido, los mensajes recientes en chats directos y grupos, y los chats
  que compartís;
- su correo, en cuanto la dirección está enlazada a ella;
- los eventos de calendario a los que está invitada, los próximos y los últimos pasados, de cada calendario que gcal
  guardó. La respuesta nombra los calendarios que leyó. El título y el lugar de un evento los escribe quien envió la
  invitación, y `--json` lista esos campos bajo `untrusted`;
- la nota sobre ella, las notas que enlazan a ella y las notas que escribiste sobre ella en Memo;
- las tareas abiertas que tratan sobre ella o que tiene asignadas.
- los archivos de Google Drive que posee o que editó por última vez, tal como los indica Google. No has revisado estos
  vínculos: vienen del propio registro de archivos de Google, no de una suposición.
- `business`: las organizaciones a las que pertenece con su rol y su cargo, a quién reporta y quién le reporta, las
  oportunidades y los leads en los que está, sus proyectos y categorías como `client`. Cada relación tiene un
  `standing`: `confirmed` (tuya), `reported` (lo dice una cuenta del CRM, que queda nombrada, y nadie lo confirmó),
  `proposed` (te espera en `memo review`) o `ended`.

Una nota que solo menciona el nombre en su texto no se incluye; solo cuentan los enlaces
([por qué](./how-it-works.md#links-between-notes-and-people)). Si una parte no dio nada, la respuesta
dice por qué. `--limit` muestra más de 20 elementos de cada tipo, y `--json` da la respuesta a un
agente.

Si tienes varias cuentas en el mismo servicio de mensajería, añade `--source` a una referencia `<messenger>:<name>`,
por ejemplo `memo context telegram:101 --source telegram:1`. Para `person:<id>`, `--source` solo limita las cuentas
que se leen.

## Enlazar las cuentas de una persona

Una persona puede tener una cuenta de Telegram, una cuenta de MAX, un contacto del CRM y una dirección de correo.
Memo las trata como una sola persona cuando:

- tienen la **misma dirección de correo**, en cualquier cuenta, de trabajo o personal, y ninguna tercera persona la
  tiene. Una dirección de rol como `info@` o `support@` solo sugiere un vínculo.
- tienen el **mismo número de teléfono**, nadie más lo tiene, y una de ellas lo tiene en Telegram, MAX o WhatsApp.

Las une `memo sync`, y también `memo people scan`. Un nombre, un usuario o un dominio de correo que coinciden nunca
bastan, y una dirección sin respuesta como `noreply@` no une ni sugiere a nadie. Un par que rechazaste nunca se une.
Una prueba nueva, como la misma dirección de correo después de rechazar una coincidencia por teléfono, lo vuelve a
sugerir. La prueba que rechazaste nunca lo hace.

Algunas señales solo sugieren un vínculo. Por ejemplo, un número de teléfono que solo comparten contactos del CRM o
tarjetas, un número de teléfono o una dirección que comparten tres o más personas, una dirección que un invitado a una reunión escribió para sí mismo o una suposición de un agente. Estas esperan como
coincidencias:

```sh
memo people review
memo review kind:identity_link
memo review confirm 17090
```

Enlaza tú mismo dos cuentas o mira a una persona:

```sh
memo people link max:Kai telegram:Kai
memo people show telegram:Kai
```

`memo people show` lista las identidades de la persona por fuente, las cuentas que vieron cada una, las fusiones que
las unieron (`merge:12-34`) y las coincidencias que esperan. `memo context` para cualquiera de las cuentas muestra
todo lo de todas ellas.

### Deshacer un vínculo

- `memo people unmerge merge:12-34` devuelve las identidades de una fusión a la persona de la que venían.
- `memo people unlink telegram:12345` vuelve a dar a una identidad una persona propia.
- `memo people unlink email:kai@example.com max:6789` mueve varias identidades de una persona a una sola persona
  nueva.

`unlink` toma cada identidad por su id exacto, tal como lo lista `memo people show`, nunca por un nombre.

Solo tú puedes hacerlo, en un terminal o en WireCat Desktop. Después, ninguna coincidencia automática vuelve a unir a
esas personas. Un agente solo puede proponer un vínculo con `memo people link … --reason`. Tú lo confirmas o lo
rechazas en `memo review`.

Para elegir la nota principal sobre la persona, consulta [la nota sobre una persona](./notes.md#the-note-about-a-person).

## Importar los contactos de un teléfono

Exporta los contactos de tu teléfono como un archivo vCard (`.vcf`) e impórtalos con el nombre del teléfono:

```sh
memo records check contacts.vcf --account phone:pixel --region ru
memo records import contacts.vcf --account phone:pixel --region ru
```

Un contacto se vincula a la persona que ya tiene una de sus direcciones de e-mail o números de teléfono, o se crea
como persona nueva. Un número escrito sin `+`, como `8 900 000-00-02`, se lee en el país que nombra `--region` (`ru`,
`gb`, `de`, etc., en mayúsculas o minúsculas). Sin `--region`, ese número se guarda pero no se busca, así que el
contacto puede convertirse en una segunda entrada de alguien que ya tienes. La importación dice qué tarjetas son.

## Organizaciones y proyectos

Las organizaciones y los proyectos son tuyos, no están ligados a una cuenta de un servicio de
mensajería.

- Una **organización** es una empresa, un equipo, una familia o una comunidad.
- Un **proyecto** tiene un nombre, una clave corta como `HRB` (3 o 4 letras y dígitos), un tipo y, si
  quieres, la organización a la que pertenece.

```sh
memo organizations add 'Synthetic Studio' --kind company
memo organizations list 'name:*studio*'
memo organizations show organization:1
memo organizations rename organization:1 'Synthetic Studio Ltd'
memo projects add 'Harbour' --key HRB --scope work --organization organization:1
memo projects list
memo projects context HRB
```

`--scope` es `personal` o `work`. `name:` no distingue mayúsculas y toma `*` como cualquier texto, así que `name:*studio*` encuentra todos los nombres
que contienen la palabra. `organizations add` y `organizations rename` de un agente se escriben al instante, como los tuyos.
Los ajustes `permissions` de memo son los que los limitan. `projects context` recibe una clave, un número, `project:<id>`, el nombre exacto o un alias.
`projects context` muestra las personas enlazadas al proyecto, las notas que tratan sobre él o que enlazan a él, y sus
etiquetas. `organizations context` muestra las personas de la organización por rol, sus clientes, proveedores y socios,
sus proyectos, las oportunidades y los leads abiertos, las facturas, los pagos y los pedidos tal como están guardados
(totales por estado y moneda, solo filas confirmadas), cuánto te escribieron sus personas, las tareas abiertas de sus
proyectos, sus categorías, las notas sobre ella y sus etiquetas. Cada relación indica su estado, y `coverage` lo que
no se leyó. `memo organizations list category:client` lista las organizaciones que son clientes de una de las tuyas, y
`supplier`, `partner` y `employer` funcionan igual. Una categoría se lee de las relaciones cada vez y nunca se guarda.
Para un proyecto, la vista también agrupa los documentos clave, las relaciones, los hechos y los seguimientos de reuniones pendientes
bajo `review`, separados de las tareas numeradas abiertas que ya existen. No confirma nada. La vista de texto muestra
las referencias de las propuestas; `--json` incluye la evidencia, el alcance de las fuentes y los comandos de continuación. Las vistas previas
de hechos y tareas contienen 20 registros cada una. Las vistas previas de reuniones leen como máximo cinco lotes propuestos por cada cuenta
de reuniones enlazada, en ocho cuentas. Lee un lote completo antes de revisarlo, porque puede abarcar varios proyectos.

La clave
de un proyecto también se usa para sus tareas, como `HRB-1` ([tareas](./tasks.md#tasks-in-a-project)).

## Documentos clave de un proyecto

Un **documento clave** es una nota, archivo o mensaje guardado que conviene leer primero sobre un proyecto, con un motivo breve. La marca pertenece a un proyecto: el mismo archivo puede ser clave para uno y no para otro.

```sh
memo projects key-documents add HRB document:3 --reason 'the plan everyone follows'
memo projects key-documents add HRB msg:telegram/1/77/42 --reason 'the agreed budget'
memo projects key-documents list HRB
memo projects key-documents remove HRB document:3
```

`projects context` empieza por ellos: título, ruta y motivo. Si el archivo o mensaje desaparece del almacén, la marca permanece con `available: false` hasta que la elimines. `memo search all` y `memo search notes` con `--project HRB` ponen primero los documentos clave sin excluir los demás; `search notes` los marca `key`. Una marca añadida por un agente espera confirmación e identifica al agente, como un vínculo.

**Empieza a trabajar en un proyecto con `memo projects context <key>`**, personalmente o mediante tu agente.

Una etiqueta global como `key` (`memo tags add key --note document:3`) no identifica un proyecto. Conviértela en documento clave con `memo projects key-documents add` y retira la etiqueta con `memo tags remove key`.

## Quién pertenece a dónde

Una **relación** indica que una persona pertenece a una organización o trabaja en un proyecto, que reporta a
alguien, o que una organización es cliente o socia de otra:

```sh
memo relationships add person:PERSON_UID organization:1 --role employee --position CTO --start-date 2026-01-01
memo relationships add person:PERSON_UID project:1 --role contributor
memo relationships add person:PERSON_UID person:OTHER_UID --kind reports-to
memo relationships add organization:2 organization:1 --kind customer-of
memo relationships list 'about:"project:1"'
memo relationships list kind:reports-to 'to:"person:5"'
memo relationships list standing:reported include:ended --limit 50
memo relationships end 4 --end-date 2026-09-30
memo relationships remove 4
```

`--position` guarda el cargo aparte del rol, y `--start-date` y `--end-date` (el último día) dicen cuándo estuvo
vigente. `memo relationships end <id> --end-date <date>` dice que ya no está vigente. La relación se queda, como
`ended`.

Tipos: `member-of`, `reports-to`, `customer-of` (leído al revés, proveedor de), `partner-of` y `related-to`. Un rol
sale de una lista. En una organización `employee`, `contractor`, `founder`, `owner`, `manager`, `adviser`, `contact`.
En un proyecto `owner`, `manager`, `contributor`, `client-contact`, `approver`. En una oportunidad o un lead `owner`,
`contact`, `decision-maker`, `influencer`. Un cargo no es un rol, indícalo con `--position`.
`memo relationships roles list` muestra las listas. `memo relationships roles add organization board-member --label 'Board member'`
añade un rol tuyo, y `remove` lo quita mientras ninguna relación lo use. Solo tú cambias las listas. Un rol guardado
antes de estas listas se queda como estaba escrito, y `relationships list` lo marca como `custom`.

`relationships list` filtra por `kind:`, `role:`, `standing:`, `from:`, `to:` y `at:<day>` (vigente ese día), y pagina
con `--limit` y `--page`. `at:<day>` significa vigente al inicio de ese día UTC. Deja fuera las que terminaron salvo
que añadas `include:ended`, y lista las propuestas que te esperan con `standing:proposed`. Con `about:<ref>` cada fila
indica su `direction` (`outgoing` o `incoming`) y, si es entrante, su `inverse`, como `manages` para `reports-to` leído
al revés. Cada fila muestra su estado y, si viene de un CRM, la cuenta que la informó.

Lo que significa el rol aquí va al lado, con tus palabras, en `--role-note`. Un rol de texto libre de antes de las
listas se sigue leyendo. Para cambiarlo, pon un rol de la lista y guarda las palabras antiguas como nota:
`memo relationships update 4 --role client-contact --role-note '<the old words>'`.

Una persona en un proyecto también tiene un **nivel de implicación**: cuánto tratas tú con ella, no cuánta actividad
tiene. Es `none`, `low`, `medium` o `high`, y sin él es desconocido. Alguien que escribe en el grupo del cliente pero
a quien rara vez respondes sigue siendo miembro, con `low`:

```sh
memo relationships update 4 --engagement low
memo relationships update 4 --role approver --role-note 'signs the acts'
memo relationships update 4 --engagement ''    # back to unknown
```

`memo projects context` y `memo relationships list` ordenan a las personas del proyecto así: high, medium, unknown,
low, none.

Un chat también puede ser de un proyecto, así `memo projects evidence` lo lee entero, no solo los mensajes que nombran
el proyecto. La referencia nombra la cuenta del chat, así que no se adivina ninguna cuenta:

```sh
memo relationships add chat:telegram/1/123 project:1
```

Para un chat solo se permite `member-of` un proyecto.

Las relaciones son afirmaciones tuyas. No unen dos cuentas en una persona. Una que añade un agente en su terminal
es una propuesta para ti, con el nombre del agente, no una relación. `--as-owner` la hace tuya
después de que respondas «y» en el terminal.

Memo puede proponer los chats, hilos de correo y personas que parecen de un proyecto: su nombre o sus alias en títulos de chats
y en mensajes, grupos y diálogos de sus miembros confirmados, personas que escriben en sus chats confirmados. Sin proyecto,
propone personas que te escriben desde el mismo dominio de empresa.

```sh
memo relationships scan HRB --source all        # lists them, writes nothing
memo relationships scan HRB --source all --yes  # proposes them for review
memo review kind:relationship
```

Una persona propuesta porque escribe en un grupo del proyecto dice qué grupo y cuánto: "wrote 40 messages in
«Sales» (25 people)". Cuando un análisis propone dos o más remitentes de un grupo, muestra el comando que los lista
juntos, para que decidas sobre las personas de ese grupo de una vez, aparte de las personas con las que trabajas directamente:

```sh
memo review list via:chat:max/1/-100                # that group's senders; next names the confirm command
memo review confirm 17070-17074                     # all of them
memo review reject 17070-17074 --reason "not this project"
```

Las propuestas esperan hasta que las confirmes en `memo review`, y antes de eso no aparecen en el contexto de una persona. Un
par que rechazaste nunca se vuelve a proponer. Las personas se identifican por la cuenta que escribió, nunca por un nombre en un texto.
Los dominios de correo gratuito habituales, como Gmail, nunca se usan para propuestas.

## Reuniones en un proyecto

Si tus reuniones están guardadas en el almacén local, puedes enlazar una reunión a un proyecto:

```sh
memo projects meetings link HRB 5 --account zoom:ACCOUNT
memo projects meetings list HRB --source zoom:ACCOUNT
```

Nombra exactamente la cuenta de la reunión. `confirmed:false` muestra los enlaces que propuso un agente;
para confirmar uno, repite `link` con el valor `--fingerprint` que aparece en esa lista.

## Otros nombres para proyectos y etiquetas

La gente llama al mismo proyecto de formas distintas. Puedes dar otros nombres a un proyecto o a una
etiqueta, para que una búsqueda o un agente los encuentre por cualquiera de ellos:

```sh
memo vocabulary list kind:project
memo vocabulary show 'Harbor' --kind project
memo vocabulary aliases add project:1 'Harbor' --fingerprint VALUE
```

`vocabulary list` muestra cada proyecto, etiqueta y tema con sus otros nombres y un valor de
comprobación. Pasa ese valor a `--fingerprint` cuando añadas o quites un nombre; si la lista cambió
mientras tanto, Memo se niega y vuelves a mirar. `memo vocabulary check 'on-boarding'` muestra
etiquetas parecidas que ya existen antes de que crees una nueva, para que no acabes con `onboarding`
y `on-boarding`.

Siguiente: [escribe una nota sobre una de ellas](./notes.md#write-your-own-notes).
