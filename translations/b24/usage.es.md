---
title: "Uso"
---

Encuentra una negociación, muévela o mira qué cambió durante la noche con un comando corto, el mismo que ejecuta tu
agente. La API REST de Bitrix24 habla con nombres de métodos, códigos de campo como `UF_CRM_…` e ids de etapa como
`C1:WON`, y `b24` acepta en su lugar nombres de etapa y etiquetas de campo.

Encuentras las negociaciones atascadas en una etapa, o cierras una como ganada, en una línea. Un agente hace lo mismo
a partir de lo que le pides.

Cada comando empieza por un perfil, el nombre que diste al inicio de sesión de un portal. `sync` copia tus
negociaciones y prospectos al almacén local de WireCat, donde los encuentran las lecturas. `api call` llega a
cualquier otro método de Bitrix24. Necesitas un perfil con la sesión iniciada: [instalar](./installation.md) te
prepara uno.

**En esta página:**

1. [El perfil va primero](#the-profile-comes-first)
2. [Iniciar sesión](#sign-in)
3. [Sincronizar](#sync)
4. [Leer](#read)
5. [Archivos de clientes](#client-files)
6. [Qué cambió](#what-changed)
7. [Escribir](#write)
8. [Salida para scripts](#output-for-scripts)
9. [Agentes](#agents)

## El perfil va primero

Un perfil es un nombre que eliges para una cuenta. Es la primera palabra de todo comando que usa una cuenta:

```sh
b24 work config show
```

`B24_PROFILE=work` hace lo mismo para una sesión de la terminal. Nunca se da un perfil por supuesto, ni siquiera si
es el único: un comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador.

## Iniciar sesión

Crea un webhook entrante en Bitrix24 (Developer resources → Common use cases → Other → Inbound webhook). En
**Assign permissions** («права доступа» en un portal en ruso), marca estos permisos y copia la dirección del webhook:

| Permiso | En Bitrix24 (EN / RU) | Para qué sirve |
|---|---|---|
| `crm` | CRM | Obligatorio: negociaciones, prospectos, contactos, empresas, productos y actividades. |
| `user_basic` (o `user`) | Users (basic) / Пользователи (базовый) | Obligatorio: quién creó el webhook, y los nombres y correos de los empleados. |
| `department` | Company Structure / Структура компании | Quién depende de quién. Más en [Quién es quién](#who-is-who). |
| `task` | Tasks / Задачи | Las tareas de Bitrix24 de tus negociaciones ([Actividades y tareas](#activities-and-tasks-on-a-deal)). |
| `telephony` | Telephony / Телефония | Las llamadas del portal ([Llamadas](./calls.md)). El empleado también necesita el permiso para ver las estadísticas de llamadas. |
| `disk` | Drive / Диск | Los archivos adjuntos a actividades y a comentarios de la línea de tiempo ([Archivos de clientes](#client-files)). |
| `documentgenerator` | Document Generator / Генератор документов | Documentos hechos a partir de plantillas ([Archivos de clientes](#client-files)). La documentación de Bitrix24 nombra `crm` en las páginas de los métodos y este permiso en la tabla de permisos. Un webhook solo con `crm` también los lista. |

`b24 work setup` muestra los mismos pasos en la terminal, y WireCat Desktop los muestra en su ventana. O inicia sesión
directamente:

```sh
b24 work session start
```

`b24` pide la dirección sin mostrarla, o la lee de stdin, la comprueba contra el portal y la guarda en el llavero del
sistema. `--credential-storage file` la guarda en un archivo privado, para un ordenador sin llavero. `B24_TOKEN` con
la dirección se usa antes que cualquiera de los dos. La dirección es la contraseña: quien la tenga puede hacer lo mismo
que el empleado del webhook.

`b24 work session status --check` muestra el empleado con el que actúa el webhook y si es administrador.
`b24 work session end` olvida la dirección en este ordenador. El webhook sigue en Bitrix24 hasta que lo borres allí.
`b24 session list` muestra los perfiles de este ordenador.

Un webhook pertenece a un solo perfil. `session start` rechaza un webhook que ya usa otro perfil de este ordenador (el
mismo portal y el mismo empleado), nombra ese perfil y dice cómo volver a iniciar su sesión o quitarlo. Dos perfiles
en un mismo portal funcionan bien si cada uno tiene el webhook de su propio empleado.

Si el portal responde que el webhook no puede leer quién lo creó, al webhook le falta el permiso "Users (basic)"
(`user_basic`, «Пользователи (базовый)» en un portal en ruso). Abre Developer resources → Integrations, edita el
webhook, marca ese permiso y guarda. Luego ejecuta `session start` otra vez con la dirección que muestra el webhook.

### Con una aplicación local

Un webhook actúa como el empleado que lo creó. Una aplicación local actúa como el empleado que inicia sesión, y sus
tokens duran solo una hora, y `b24` los renueva. La crea una vez un administrador de Bitrix24, o un empleado con
permiso para ello:

1. Developer resources → Common use cases → Other → Local application.
2. Elige el modo **Server**. En **Your handler path** pon `https://wirecat.dev/webhooks/apps/b24-callback`. Deja
   vacíos **Initial installation path** y los textos del elemento de menú, y desmarcada **Application completes the
   installation itself**, para que el portal la instale al guardar.
3. En **Assign permissions**, marca los mismos permisos que para un webhook (la tabla de arriba), y guarda.
4. Copia el **Application ID (client_id)** y la **Application key (client_secret)** que muestra Bitrix24.

Luego inicia sesión:

```sh
b24 work session start --portal example.bitrix24.ru --client-id local.0123abcd.45678901
```

`b24` pide la clave sin mostrarla, o la lee de stdin o de `B24_BITRIX24_CLIENT_SECRET`, y abre el inicio de sesión del
portal en el navegador. Cuando autorizas la aplicación, la página `wirecat.dev/webhooks/apps/b24-callback` devuelve la
respuesta a `b24` en este ordenador. Si el navegador no llega a `b24`, por ejemplo por SSH, pega en la terminal la
dirección en la que terminó el navegador. Después `session status` muestra `kind: app`. Volver a dar un webhook con
`session start` olvida el inicio de sesión de la aplicación, y al revés. `session end` olvida los tokens en este
ordenador. Bitrix24 no permite revocarlos, así que para pararlos borra la aplicación en el portal.

### Quitar un perfil

```sh
b24 work account remove --keep-data --dry-run   # what it would remove and keep, changing nothing
b24 work account remove --keep-data             # forget the profile, its copy of the portal stays searchable
b24 work account remove --delete-data --yes     # also delete the portal's deals, leads, contacts and companies
```

`account remove` olvida el perfil en este ordenador: la dirección de su webhook, sus ajustes y sus archivos. Pregunta
antes, o acepta `--yes`. El webhook sigue en Bitrix24 hasta que lo borres allí. El almacén guarda una sola copia de
cada portal, así que `--delete-data` se niega mientras otro perfil de este ordenador lee el mismo portal. Quita antes
ese perfil, o usa `--keep-data`.

## Sincronizar

Las negociaciones, los prospectos, los embudos y las etapas se leen del almacén local de WireCat, el mismo en el que
buscan todas las herramientas de WireCat. `sync` lo pone al día:

```sh
b24 work sync                    # what changed since the last sync, everything on the first one
b24 work sync --rescan           # everything again, every id too
b24 work store status            # how far each kind is, and how many are stored
```

Una sincronización lee por la hora de cambio de cada elemento, con un solapamiento, así que un elemento que cambió
mientras se ejecutaba vuelve a llegar la próxima vez. Una vez al día también lista todos los ids y marca como borrados
los que el portal ya no tiene. Una lista que marcaría más de la mitad se retiene, porque un webhook que perdió sus
derechos no lista ninguno. Una sincronización se detiene antes de su plazo o de `--max-pages`, y la siguiente sigue
desde ahí.

### De quién son las negociaciones y los prospectos

Una sincronización copia las negociaciones y los prospectos de los usuarios de Bitrix24 que elijas en
`crm.bitrix24:<portal>.unassigned`, y los clientes que aparecen en ellos. Hasta que elijas, copia las negociaciones y
los prospectos del usuario que inició sesión, el usuario del webhook o de la aplicación local. Una lista elegida
sustituye a ese usuario, que queda fuera si no lo nombras. Elige cuando el webhook sea de un compañero o cuando
trabajes en el portal de otra persona. Ninguna sincronización copia todo el CRM, tampoco la de un administrador.
Cualquier otro cliente lo encuentras en el propio portal.

```sh
b24 work users list                                                    # who is who on the portal
b24 work config set crm.bitrix24:example.bitrix24.ru.unassigned 3327   # copy the deals and leads of user 3327
b24 work config set crm.bitrix24:example.bitrix24.ru.scope mine        # the default, an old "all" is refused
b24 work people list name:ivan*                                        # any contact, read from the portal now
```

`example.bitrix24.ru` es la dirección de tu portal. El webhook de un administrador de Bitrix24 puede elegir a
cualquiera. El de cualquier otro solo puede elegirse a sí mismo, a un usuario dado de baja o a un usuario que no es
empleado (de extranet, de correo o un bot, según el `USER_TYPE` de Bitrix24). La sincronización revisa la lista cada
vez. Un usuario que no puede tomar se deja fuera, con el motivo en `issues` (`crm.unassigned-dropped`), y sus
negociaciones y prospectos salen de la copia. Un webhook sin el permiso `user` se queda solo con su propio usuario. Un
`scope all` puesto antes se rechaza en la siguiente sincronización, que indica poner `mine`. Una vez puesto, las
negociaciones y los prospectos de los usuarios que no elegiste se marcan aquí como borrados.

La respuesta de la sincronización dice qué `scope` aplicó y cuál es el usuario del propio webhook (`self`). Una
negociación que pasa a un usuario que no elegiste sale de la copia local en la siguiente sincronización, y una que pasa
a un usuario elegido llega. Pasar a `mine` marca las demás como borradas aquí, solo a partir de la copia, sin preguntar
al portal. Borradas aquí significa que salen de las listas y de la búsqueda, y su copia anterior se queda en el archivo
del almacén. Si nunca pusiste `scope` y `mine` marcaría como borradas más de la mitad de las negociaciones o los
prospectos guardados, la sincronización los conserva y lo dice (`crm.narrowing-held`) hasta que pongas `scope` en
`mine`. Solo tú pones `scope`, `self` y `unassigned`, a un agente se le rechaza.

Con `mine` una sincronización copia solo tus clientes: los contactos y las empresas asignados a ti o a un usuario sin
asignar, y los que aparecen en las negociaciones y los prospectos que copia. El resto de la base de clientes se queda
en el portal.

La copia de un portal pertenece a un usuario. La primera sincronización recuerda al usuario del webhook como
`crm.bitrix24:<portal>.self`. Una sincronización con el webhook de otro usuario se rechaza, y
`b24 work config unset crm.bitrix24:example.bitrix24.ru.self` da la copia al siguiente.

Sin conexión con el portal, un perfil lee solo lo que puede leer su propio usuario. El administrador del portal, tal
como lo encontró el último `sync`, lee toda la copia. Cualquier otro lee solo las negociaciones y los prospectos
asignados a él, incluso en una copia que hizo su propia sincronización. Los que no tienen asignación y los de los
usuarios que eligió quedan fuera de las listas, de `show` (`not_found`), del embudo y de `search all`. Un inicio de
sesión que no nombra a ningún usuario del portal no lee nada. Volver a ejecutar `session start` lo arregla.

### Quién es quién

La sincronización también guarda quién pertenece a dónde, como relaciones entre personas, organizaciones y
negociaciones. Todas las herramientas de WireCat las leen del mismo almacén.

| En Bitrix24 | En el almacén |
|---|---|
| Una empresa | Una organización. Una empresa con el mismo nombre en otro sitio sigue siendo una organización aparte. |
| Tus propias empresas ("Mis empresas") | Organizaciones marcadas como tuyas, leídas en cada sincronización. |
| Un contacto | Una persona, unida a una que ya tienes solo por la misma dirección de correo. |
| Las empresas de un contacto | La persona es miembro de cada una, con el rol `contact`. La primera empresa es la principal. El cargo (`post`) se guarda al lado, nunca como rol. |
| Los contactos de una negociación o un prospecto | Personas en la negociación con el rol `contact`. El contacto principal va marcado. |
| El responsable de una negociación o un prospecto | El `owner` de la negociación. |
| Un empleado (un usuario del portal) | Una persona, miembro de tu propia empresa con el rol `employee`. Un empleado que se fue conserva la persona, y la pertenencia termina. |
| Un jefe de departamento | Cada empleado depende del jefe de su departamento, y un jefe del jefe del departamento superior. |
| Un prospecto convertido en negociación | El prospecto apunta a su negociación. |

Bitrix24 no lo dice todo, así que algunas relaciones solo vienen de ti:

- El papel de un contacto en una negociación (quien decide, quien influye). Bitrix24 no guarda un rol para el contacto
  de una negociación.
- De quién depende un contacto. Bitrix24 solo tiene dependencias entre sus propios empleados.
- La empresa matriz de una empresa. Bitrix24 no tiene un campo para ella.
- Cuándo empezó o terminó una relación. Bitrix24 no da fechas.

Una relación que guarda la sincronización es `reported`: Bitrix24 lo dice y tú no lo has confirmado. Cuenta en todas las
respuestas. Cuando Bitrix24 deja de decirlo, por ejemplo cuando un contacto deja una empresa, la sincronización la
termina. Se queda, con la fecha en que terminó, y nunca se borra. Una relación que creaste o confirmaste nunca la cambia
una sincronización. Si quitaste una, la sincronización no la vuelve a escribir.

Para que las relaciones nuevas esperen tu revisión, pon el ajuste `links` de la cuenta en `review`. La cuenta es
`bitrix24:` y la dirección de tu portal:

```sh
b24 work config set crm.bitrix24:example.bitrix24.com.links review
```

Un tipo de empresa, como `CUSTOMER`, no significa nada por sí solo, ya que un administrador puede renombrar o añadir
tipos. Di qué significa un tipo, y la siguiente sincronización hace de cada empresa de ese tipo un cliente de tu propia
empresa, un proveedor suyo o un socio:

```sh
b24 work config set crm.bitrix24:example.bitrix24.com.company-types CUSTOMER=customer-of,SUPPLIER=supplier
```

Cuando al webhook le falta el permiso `user` o `department`, la sincronización lee el resto y dice en `issues` lo que no
pudo leer. Nada de lo guardado antes termina por eso. Sin `user_basic` los empleados llegan sin su dirección de correo,
así que un empleado no se une a la misma persona de tu correo. Un portal que no da sus propias empresas deja a sus
empleados sin empresa. La sincronización guarda estos dos casos como huecos de la cuenta, que nombran las respuestas de
memo, no en `issues`.

### Llamadas

`meetings sync` copia las llamadas del portal, y `meetings transcribe` las convierte en texto en este ordenador.
Tienen su propia página: [Llamadas](./calls.md).

### Mantenerla al día

`schedule` instala un temporizador (un temporizador de usuario de systemd en Linux, un agente de launchd en macOS, una
tarea del Programador de tareas en Windows) que ejecuta `sync` por su cuenta:

```sh
b24 work schedule command crm --every 1h -- sync
b24 work schedule list                           # the schedule and how its last run went
b24 work schedule remove crm
```

### Una tarea cuando una negociación entra en una etapa

`stage-tasks` nombra etapas, y cada negociación o prospecto que pasa a una de ellas abre una tarea en este ordenador,
junto a tus otras tareas de WireCat. La abre la sincronización que trae el cambio, una vez por cada paso: una tarea que
descartas no vuelve, y la siguiente entrada en la misma etapa abre una nueva. La etapa de un prospecto se escribe
`lead:<stage id>`. `b24 work stages list` muestra los ids.

```sh
b24 work config set crm.bitrix24:example.bitrix24.ru.stage-tasks \
  '{"C1:WON":{"title":"Send the closing papers","due_days":2},"lead:CONVERTED":{"title":"Call back","due_days":0}}'
b24 work sync          # moves since the last sync open their tasks
```

b24 lee el historial de etapas del propio portal, así que una negociación que pasó por una etapa entre dos
sincronizaciones también recibe la tarea de esa etapa. Un paso de "New" por "Quote" a "Won" en un mismo día abre las
tareas de "Quote" y de "Won".
Los pasos hechos antes de poner el ajuste por primera vez no abren ninguna, y tampoco la primera copia de una
negociación. La tarea nombra la negociación, su etapa y su embudo, y vence `due_days` días después de la
sincronización. Solo tú pones este ajuste, a un agente se le rechaza. Para pararlo,
`b24 work config unset crm.bitrix24:example.bitrix24.ru.stage-tasks`. En el propio portal, el robot "Create task" de
Bitrix24 hace lo mismo con una tarea del portal.

### Actividades y tareas de una negociación

Con `activities` activado, cada sincronización también lee las llamadas, los correos, las reuniones y los pendientes
de las negociaciones y los prospectos que guarda, las tareas de Bitrix24 vinculadas a ellos y los comentarios de su
línea de tiempo. `deals show` y `leads show` los muestran, primero los abiertos, con su texto: el cuerpo de un correo,
la descripción de una tarea, un comentario. La primera sincronización lee los últimos 90 días, y cada una de las
siguientes lo que cambió desde entonces. Solo se leen las actividades, tareas y comentarios de las negociaciones y los
prospectos que guarda la copia.

```sh
b24 work config set crm.bitrix24:example.bitrix24.ru.activities on
b24 work sync
b24 work deals show deal:12
```

Está desactivado hasta que lo actives, y solo tú puedes hacerlo: a un agente se le rechaza. El número de teléfono o
la dirección de correo del cliente en una llamada o un correo nunca se copia. Las tareas necesitan el permiso `task`
del webhook o de la aplicación. Sin él, la sincronización lee las actividades y dice que las tareas no se leyeron.

El portal da los comentarios de una negociación o un prospecto por petición. Por eso una sincronización pregunta por
cada negociación y prospecto abierto de la copia, y por cada uno cerrado que cambió desde la última sincronización.
Un comentario no cambia su negociación. Uno dejado en una negociación ya ganada o perdida, sin ningún otro cambio, se
lee cuando la negociación cambie. Un comentario editado conserva su primer texto.

### Preguntar a memo por un cliente

`memo` responde a partir de las relaciones que guarda la sincronización. Estos comandos necesitan una versión de `memo`
que los tenga, y aún no ha salido:

```sh
memo context person:12                    # a person's companies, deals and reporting lines, with what was not read
memo organizations context organization:4 # a company's people, deals and open work
memo deals context deal:7 --brief         # a deal's people with their parts, its owner and stage
```

## Leer

```sh
b24 work deals list status:open                 # open, won or lost
b24 work deals list stage:"Quote sent" pipeline:Sales
b24 work leads list --json
b24 work deals show deal:12                     # by the ref a list prints
b24 work pipelines show Sales                   # its funnel: how many reached each stage
b24 work stages list kind:lead                  # each stage with its outcome: open, won or lost
b24 work people show "Anna Ivanova"             # contacts and companies by id, or by the exact name
```

`deals`, `leads`, `pipelines` y `stages` son los comandos de CRM que comparte WireCat: las mismas palabras, consulta y
respuesta en todas las herramientas de CRM. Una negociación o un prospecto responde su `pipeline`, `stage`, `status`,
`close_date`, y `amount` como decimal en su `currency`. `--offline` lee lo mismo. Los prospectos de Bitrix24 no tienen
embudos, así que están en un único embudo llamado `Leads`.

`people`, `organizations` y `users` también son comandos de CRM compartidos y leen el propio portal, así que
`--offline` los rechaza. Una persona u organización da los campos propios del portal en `provider_metadata`, cada uno
por su código con su etiqueta. Un campo de lista da la etiqueta de su opción, y el id de la opción como `option_id`.
El sector, los ingresos y la moneda de una empresa también están ahí. `b24 work fields list deals` muestra esos campos con su tipo y sus opciones, tal como los
guardó el último `sync`. `leads`, `people` y `organizations` funcionan igual. Sus listas también filtran por esos
campos, por código o por etiqueta, cuando el portal puede filtrar por ellos, y `--json` puede añadirlos:

```sh
b24 work organizations list type:CUSTOMER
b24 work organizations list --json=id,name,provider_metadata.UF_CRM_1745512486047
```

Una lista muestra primero lo más reciente: `--limit` y `--page` lo cambian.
Los campos por los que puede filtrar una lista están en su ayuda, `b24 help deals list`.

Los teléfonos y correos solo se ven en tus clientes, salvo que seas administrador de Bitrix24. Tus clientes son los
contactos y las empresas asignados a ti, y los que aparecen en tus negociaciones y prospectos. Una lista muestra a los
demás sin ellos. `people show` u `organizations show` de uno que no es tu cliente los da, como mucho para 100 de esos
contactos y empresas al día (UTC), contando juntos a ti y a tus agentes. Volver a mostrar el mismo ese día no cuenta, y
tus propios clientes nunca cuentan. La cuenta se guarda en este ordenador, así que protege de un descuido y de un
agente, no de alguien que quiere llevarse la base. Para eso están los permisos de acceso del propio Bitrix24.

## Archivos de clientes

`files list` muestra los archivos de una negociación, un prospecto, un contacto o una empresa, leídos del portal en ese
momento. `files download` guarda uno en este ordenador y lee su texto, para que `search all` lo encuentre después.

```sh
b24 work files list --deal 12                      # the deal's files, each with an id
b24 work files download deal:12:document:61        # saved in the state folder, its text in the answer
b24 work files download deal:12:document:61 --dir ~/Documents/clients
b24 work files sync                                # prefetches the files of your own deals and leads
```

Los archivos de un registro vienen de cuatro sitios del portal:

| Origen | Qué es | Permiso |
|---|---|---|
| `field` | Un archivo en uno de los campos de archivo propios del registro | `crm` |
| `document` | Un documento creado con una plantilla: un contrato, una factura, un presupuesto. El PDF cuando el portal lo ha creado, si no el archivo de Word | `crm` |
| `activity` | Un archivo adjunto a un correo, una llamada u otra actividad | `crm` y `disk` |
| `comment` | Un archivo adjunto a un comentario de la línea de tiempo | `crm` y `disk` |

Un origen que el webhook no puede leer se omite, y la respuesta lo nombra en `issues` con el permiso que hay que
añadir. Los archivos de los comentarios se listan sin `disk`, porque el comentario los nombra, pero descargar uno lo
necesita. Un archivo en un campo no tiene nombre en el portal, así que se lista con el nombre del campo y el id del
archivo. Los archivos de tus propios registros no cuentan para el límite. El registro de un compañero cuenta para el mismo límite de
100 al día que los teléfonos y correos de sus clientes, salvo que seas administrador. `sync` nunca descarga un archivo.
`files sync` descarga los archivos de la última semana de tus propias negociaciones y prospectos, dentro de los límites
de los ajustes `crm.bitrix24:<portal>.files.*` (`max_files`, `max_file_mb`, `max_run_mb`, `run_minutes`, `days`,
`max_total_mb`), que cambia `config set`.

## Qué cambió

`changes list` muestra lo que las sincronizaciones vieron cambiar en la copia: negociaciones y prospectos creados,
movidos, ganados, perdidos o pasados a otro responsable, actividades añadidas y hechas, y contactos nuevos, primero los
más recientes. Lee el último día salvo que `at:` diga otra cosa.

```sh
b24 work changes list "at>=1d"
b24 work changes list change:won "at>=7d" --json
```

`--format report` convierte esa ventana en un resumen matutino. Si lo ejecuta una programación, cada resumen empieza
donde terminó el anterior:

```sh
b24 work schedule command morning --at 08:00 -- changes list "at>=1d" --format report
```

La programación muestra cada resumen como un aviso en el escritorio. `--deliver-to` también te lo envía a Telegram o
a tu buzón de correo con tu propia herramienta `tg` o de correo, como muestra `b24 help schedule command`.

## Escribir

```sh
b24 work deals create --title "Kitchen for Example" --pipeline Sales --amount 15000 --currency EUR
b24 work deals update deal:12 --amount 18000 --close-date 2026-12-24
b24 work deals move deal:12 "Contract signed"
b24 work deals close deal:12 won
b24 work deals delete deal:12                   # asks first
b24 work leads update lead:7 --field UF_CRM_SOURCE=Website
b24 work people create --first-name Anna --last-name Ivanova
b24 work organizations update 9 --name "Example LLC" --field "Lead source=Fair"
```

Una escritura envía una petición y luego vuelve a leer el elemento en el almacén. `--stage`
recibe una etapa del propio embudo del elemento por nombre o id, y también comprueba la clave `move`. Una etapa ganada o
perdida comprueba además la clave `close`. `close` lo mueve a la primera etapa ganada o perdida de su embudo.
`--field <label or code>=<value>` fija uno de los campos propios del portal, como los nombra `fields list`. Un campo
de lista recibe la etiqueta o el id de su opción, y un valor vacío vacía el campo. Se rechaza un campo que nombra una
etapa, un embudo o un responsable: esos tienen sus propias opciones.

Un campo con varios valores recibe `--field` una vez por valor. Una etiqueta funciona cuando un `sync` ya guardó los
campos. Antes de eso, nombra el campo por su código. `people` y `organizations` reciben sus nombres, `--position` y
`--owner` como opciones. `api call` escribe cualquier otro campo.

Cada escritura responde un `operation_id`, que guarda el diario de la ejecución. Una escritura se envía una vez, y otra
vez solo cuando el portal la rechazó por su límite de peticiones, cosa que hace antes de crear nada. Si
termina con `outcome_unknown`, puede que el portal la hiciera: mira primero el elemento (`sync` y luego `show`) y
repítela solo si no está, porque Bitrix24 haría la repetición por segunda vez. `--dry-run` no envía nada y nombra cada clave de permiso que
comprueba el comando, con la opción que añade cada una: las claves de mover y cerrar de una etapa, y
`crm.assign-others` para otro responsable. Asignar un elemento a otro empleado se rechaza hasta que lo permitas,
porque Bitrix24 avisa a ese empleado: `b24 work config set permissions.crm.assign-others allow`.

`b24 work api call crm.deal.get --body '{"id":12}'` llama a cualquier otro método de Bitrix24, aquí una lectura de la negociación 12. Comprueba los mismos permisos
que el comando que hace lo mismo, y rechaza las escrituras que envían mensajes, ponen en marcha la automatización del
portal o crean tareas hasta que las permitas. Solo un administrador de Bitrix24 lee contactos, empresas o prospectos
con él (`crm.contact.*`, `crm.company.*`, `crm.lead.*`, `crm.item.*` de tipo 1, 3 o 4, requisitos, direcciones y
búsquedas de duplicados). A
cualquier otro se le rechazan, digan lo que digan los permisos. `b24 api list` y `b24 api show crm.deal.update` muestran qué comprueba cada
método.

## Salida para scripts

Todos los comandos salvo `mcp serve` por stdin y stdout aceptan `--json` e imprimen un único valor JSON en stdout. Los
errores son JSON en stderr, con un código para decidir qué hacer. La [referencia de comandos](./commands.md) muestra
los códigos.

## Agentes

`b24 skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`b24 skill install --for hermes` añade además esa carpeta a los ajustes propios de Hermes Agent, así que un
`skill install` sin más deja fuera a Hermes. `b24 guide` enumera escenarios para tareas habituales, cada uno como
comandos en orden y para qué sirve cada uno.

`b24 work mcp serve` sirve los comandos del perfil por MCP, para un cliente que no puede ejecutar comandos:

```sh
claude mcp add b24 -- b24 work mcp serve
```

El servidor ofrece todos los comandos, también los que escriben, y los permisos del perfil deciden qué se ejecuta. Por
MCP una escritura en `ask` sigue adelante, porque no hay nadie para responder. Pon `readonly` o `deny` en las
escrituras que un agente no debe hacer, o activa la aprobación en el cliente del agente. Más en
[Permisos](./permissions.md#agents-and-mcp). Cómo añadir el servidor a Claude Code o Codex, varios perfiles en un
servidor, y ChatGPT o Claude en el navegador están en [MCP](./mcp.md).
