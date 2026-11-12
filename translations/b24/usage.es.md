---
title: "Uso"
---

Esta página explica cómo se construye un comando y cómo usa la herramienta un agente. Léela antes de tu primer comando.

## El perfil va primero

Un perfil es un nombre que eliges para una cuenta. Es la primera palabra de todo comando que usa una cuenta:

```sh
b24 work config show
```

`B24_PROFILE=work` hace lo mismo para una sesión de la terminal. Nunca se da un perfil por supuesto, ni siquiera si
es el único: un comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador.

## Iniciar sesión

Crea un webhook entrante en Bitrix24 (Developer resources → Other → Incoming webhook) con los permisos de acceso `crm`,
`user_basic` (o `user`) y `department`, y copia su dirección. Sin `user_basic` la sincronización no recibe el correo
de ningún empleado, y sin `department` no recibe quién depende de quién. Más en [Quién es quién](#who-is-who). Luego:

```sh
b24 work session start
```

`b24` pide la dirección sin mostrarla, o la lee de stdin, la comprueba contra el portal y la guarda en el llavero del
sistema. `--credential-storage file` la guarda en un archivo privado, para un ordenador sin llavero. `B24_TOKEN` con
la dirección se usa antes que cualquiera de los dos. La dirección es la contraseña: quien la tenga puede hacer lo mismo
que el empleado del webhook.

`b24 work session status --check` muestra el empleado con el que actúa el webhook y si es administrador.
`b24 work session end` olvida la dirección en este ordenador; el webhook sigue en Bitrix24 hasta que lo borres allí.
`b24 session list` muestra los perfiles de este ordenador.

### Con una aplicación local

Un webhook actúa como el empleado que lo creó. Una aplicación local actúa como el empleado que inicia sesión, y sus
tokens duran solo una hora, y `b24` los renueva. La crea una vez un administrador de Bitrix24, o un empleado con
permiso para ello:

1. Developer resources → Common use cases → Other → Local application.
2. Elige el modo **Server**. En **Your handler path** pon `https://wirecat.dev/webhooks/apps/b24-callback`. Deja
   vacíos **Initial installation path** y los textos del elemento de menú, y desmarcada **Application completes the
   installation itself**, para que el portal la instale al guardar.
3. Marca los permisos de acceso `crm`, `user_basic` (o `user`) y `department`, y guarda.
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

## Sincronizar

Las negociaciones, los prospectos, los embudos y las etapas se leen del almacén local de WireCat, el mismo en el que
buscan todas las herramientas de WireCat. `sync` lo pone al día:

```sh
b24 work sync                    # what changed since the last sync; everything on the first one
b24 work sync --rescan           # everything again, every id too
b24 work store status            # how far each kind is, and how many are stored
```

Una sincronización lee por la hora de cambio de cada elemento, con un solapamiento, así que un elemento que cambió
mientras se ejecutaba vuelve a llegar la próxima vez. Una vez al día también lista todos los ids y marca como borrados
los que el portal ya no tiene; una lista que marcaría más de la mitad se retiene, porque un webhook que perdió sus
derechos no lista ninguno. Una sincronización se detiene antes de su plazo o de `--max-pages`, y la siguiente sigue
desde ahí.

### De quién son las negociaciones y los prospectos

Una sincronización copia las negociaciones y los prospectos de los usuarios de Bitrix24 que elijas en
`crm.bitrix24:<portal>.unassigned`, y los clientes que aparecen en ellos. No se elige a nadie por ti, ni siquiera al
usuario del propio webhook, porque a menudo un webhook es de un compañero. Hasta que elijas, una sincronización no copia
nada y te dice cómo hacerlo. Ninguna sincronización copia todo el CRM, tampoco la de un administrador. Cualquier otro
cliente lo encuentras en el propio portal.

```sh
b24 work users list                                                    # who is who on the portal
b24 work config set crm.bitrix24:example.bitrix24.ru.unassigned 3327   # copy the deals and leads of user 3327
b24 work config set crm.bitrix24:example.bitrix24.ru.scope mine        # the default; an old "all" is refused
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

### Mantenerla al día

`schedule` instala un temporizador (un temporizador de usuario de systemd en Linux, un agente de launchd en macOS, una
tarea del Programador de tareas en Windows) que ejecuta `sync` por su cuenta:

```sh
b24 work schedule command crm --every 1h -- sync
b24 work schedule list                           # the schedule and how its last run went
b24 work schedule remove crm
```

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
`close_date`, y `amount` como decimal en su `currency`; `--offline` lee lo mismo. Los prospectos de Bitrix24 no tienen
embudos, así que están en un único embudo llamado `Leads`.

`people` y `organizations` leen el propio portal. Su `show` da los campos propios del portal en
`provider_metadata`, cada uno por su código con su etiqueta; un campo de lista da la etiqueta de su opción, y el id de
la opción como `option_id`. `b24 work fields list deals` muestra esos campos con su tipo y sus opciones, tal como los
guardó el último `sync`; `leads`, `people` y `organizations` funcionan igual. Sus listas también filtran por esos
campos, por código o por etiqueta, cuando el portal puede filtrar por ellos, y `--json` puede añadirlos:

```sh
b24 work organizations list industry:IT
b24 work organizations list --json=id,name,provider_metadata.UF_CRM_1745512486047
```

Una lista muestra primero lo más reciente: `--limit`, `--page` y, para `people` y `organizations`, `--all` lo cambian.
Los campos por los que puede filtrar una lista están en su ayuda, `b24 help deals list`.

Los teléfonos y correos solo se ven en tus clientes, salvo que seas administrador de Bitrix24. Tus clientes son los
contactos y las empresas asignados a ti, y los que aparecen en tus negociaciones y prospectos. Una lista muestra a los
demás sin ellos. `people show` u `organizations show` de uno que no es tu cliente los da, como mucho para 100 de esos
contactos y empresas al día (UTC), contando juntos a ti y a tus agentes. Volver a mostrar el mismo ese día no cuenta, y
tus propios clientes nunca cuentan. La cuenta se guarda en este ordenador, así que protege de un descuido y de un
agente, no de alguien que quiere llevarse la base. Para eso están los permisos de acceso del propio Bitrix24.

## Escribir

```sh
b24 work deals create --title "Kitchen for Example" --pipeline Sales --amount 15000 --currency EUR
b24 work deals update deal:12 --amount 18000 --close-date 2026-12-24
b24 work deals move deal:12 "Contract signed"
b24 work deals close deal:12 won
b24 work deals delete deal:12                   # asks first
b24 work leads update lead:7 --field UF_CRM_SOURCE=Website
b24 work people create --first-name Anna --last-name Ivanova
b24 work organizations update 9 --field "Lead source=Fair" --body '{"revenue":1000}'
```

Una escritura de negociación o prospecto envía una petición y luego vuelve a leer el elemento en el almacén. `--stage`
recibe una etapa del propio embudo del elemento por nombre o id, y también comprueba la clave `move`; una etapa ganada o
perdida comprueba además la clave `close`. `close` lo mueve a la primera etapa ganada o perdida de su embudo.
`--field <label or code>=<value>` fija uno de los campos propios del portal, como los nombra `fields list`; un campo
de lista recibe la etiqueta o el id de su opción, y un valor vacío vacía el campo. Se rechaza un campo que nombra una
etapa, un embudo o un responsable: esos tienen sus propias opciones.

Para `people` y `organizations`, `--field "<label or code>=<value>"` también recibe la etiqueta, y un campo con varios
valores recibe `--field` una vez por valor; `--body` recibe los demás campos con los nombres de la REST 3.0 de
Bitrix24.

Cada escritura responde un `operation_id`, que guarda el diario de la ejecución. Una escritura se envía una vez. Si
termina con `outcome_unknown`, puede que el portal la hiciera: mira primero el elemento (`sync` y luego `show`) y
repítela solo si no está, porque Bitrix24 haría la repetición por segunda vez. `--dry-run` no envía nada y nombra cada clave de permiso que
comprueba el comando, con la opción que añade cada una: las claves de mover y cerrar de una etapa, y
`crm.assign-others` para otro responsable. Asignar un elemento a otro empleado se rechaza hasta que lo permitas,
porque Bitrix24 avisa a ese empleado: `b24 work config set permissions.crm.assign-others allow`.

`b24 work api call crm.deal.get --body '{"id":12}'` llama a cualquier otro método de Bitrix24, aquí una lectura de la negociación 12. Comprueba los mismos permisos
que el comando que hace lo mismo, y rechaza las escrituras que envían mensajes, ponen en marcha la automatización del
portal o crean tareas hasta que las permitas. Solo un administrador de Bitrix24 lee contactos o empresas con él
(`crm.contact.*`, `crm.company.*`, `crm.item.*` de tipo 3 o 4, requisitos, direcciones y búsquedas de duplicados). A
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
