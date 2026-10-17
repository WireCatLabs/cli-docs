---
title: "Teléfonos, enlaces, nombres y direcciones"
description: "Encuentra todos los mensajes con un número de teléfono, una dirección de correo, un enlace, un documento de Google, el nombre de una persona o una dirección postal, se haya escrito como se haya escrito, y registra qué es."
---

Encuentra dónde alguien envió un número de teléfono, todos los enlaces a un sitio, todos los chats que mencionan un
documento o todos los mensajes que nombran a un colega. Las herramientas detectan estos valores en tus mensajes guardados: puedes buscarlos en cualquier forma y
registrar qué es cada uno. Este número es de Ana, este es de una tienda y este es un número de pedido, no un teléfono.
Necesitas el historial de los chats que quieres buscar guardado en tu ordenador.

## Qué es una mención

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

## Pídeselo a tu agente

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
demuestra que nadie enviara el valor: [descarga primero ese historial](./search.md#descarga-primero-el-historial-de-los-chats-pertinentes).

## Buscar por un valor

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

### Números sin prefijo de país

La gente escribe un número local a la manera local: `612 345 678` en España, `8 900 000-00-01` en Rusia. Indica a las
herramientas en qué países están tus contactos, el más probable primero:

```sh
tg personal config set phone_countries es,ru
```

Entonces un número sin `+` se lee como número del primer país al que corresponde. El ajuste cubre la mayor parte de
Europa, Estados Unidos y Canadá, y vale para todas las herramientas que comparten el almacén local. Sin él, un número
sin `+` se lee como ruso. Después de cambiarlo, vuelve a leer los números guardados con `mentions rebuild phone`; las
decisiones que tomaste se quedan con sus números.

### Buscar en el correo

El correo guardado admite los mismos campos. La búsqueda de correo es de [memo](./email.mdx):

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

## Revisar lo encontrado

Para ver las menciones, de la más reciente a la más antigua:

```sh
tg personal mentions list kind:phone
tg personal mentions list domain:example.com status:found
tg personal mentions show 12
```

`list` da a cada mención un ID, la fecha, el tipo (`phone`, `email`, `url`, `document`, `person-name`, `place`), el valor, su
estado y el mensaje. `show` añade el texto alrededor y en cuántos otros lugares aparece el mismo valor. `list` solo
muestra menciones en mensajes; las menciones en notas, documentos y correo se pueden buscar, pero aún no se listan.

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

## Registrar qué es un valor

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
[permisos](./permissions.mdx) de tu perfil no permiten estos cambios, el error indica el ajuste que hay que cambiar.

## Nombres de personas

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

## Direcciones postales

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
primero. La mayoría de las direcciones están en firmas de correo; [memo](./email.mdx) aún no lista las menciones del
correo, así que se encuentran y se pueden buscar, pero solo se revisan desde los mensajes.

## Mensajes guardados antes

Los mensajes nuevos obtienen sus menciones al guardarse. Lee una vez el historial que guardaste antes:

```sh
tg personal mentions rebuild
max personal mentions rebuild
```

Lee cada mensaje guardado, el texto de los archivos, las transcripciones, las notas, los documentos y los correos,
muestra su progreso y conserva todas tus decisiones. Puedes ejecutarlo de nuevo en cualquier momento.

## Números de teléfono y privacidad

Los números se guardan en el almacén local como dígitos, igual que ya están en los mensajes guardados. No van a
registros, mensajes de error ni registros de ejecución. Nunca se abre un enlace ni se contacta con un sitio.

## Lo que aún no existe

- Una lista de las menciones en [notas y documentos](./memo/notes.md) y en el [correo](./email.mdx): se encuentran y
  se pueden buscar, pero `mentions list` no las muestra.
- Vincular un enlace a un sitio web corriente con algo. Ese enlace solo se puede descartar.
- Lugares que no son direcciones postales: una ciudad sola, el nombre de un edificio, un lugar descrito con palabras.
- Direcciones fuera de Europa, el Reino Unido y Estados Unidos: puede que se encuentren solo en parte.

Cuando sepas dónde apareció un número, un sitio o un nombre, [recupera el contexto con esa persona](./people.md) antes de
responder.
