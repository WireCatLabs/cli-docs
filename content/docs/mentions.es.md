---
title: "Teléfonos, enlaces y nombres"
description: "Encuentra todos los mensajes con un número de teléfono, una dirección de correo, un enlace, un documento de Google o el nombre de alguien que conoces, se haya escrito como se haya escrito, y registra quién es."
---

Encuentra dónde alguien envió un número de teléfono, todos los enlaces a un sitio, todos los chats que mencionan un
documento o todos los mensajes que nombran a un colega. Las herramientas detectan estos valores en tus mensajes guardados: puedes buscarlos en cualquier forma y
registrar qué es cada uno. Este número es de Ana, este es de una tienda y este es un número de pedido, no un teléfono.
Necesitas el historial de los chats que quieres buscar guardado en tu ordenador.

## Qué es una mención

Una **mención** es un valor que las herramientas encontraron en un mensaje: un número de teléfono, una dirección de
correo, un enlace o un enlace a un documento de Google. En Telegram también puede ser el nombre de alguien que
conoces. Las herramientas lo buscan en el texto del mensaje, en el texto de sus archivos y en las transcripciones de
sus notas de voz.

Cada mención se guarda en una forma estándar, así que la búsqueda encuentra un valor se haya escrito como se haya
escrito. `+1 (555) 010-0100` y `+1 555 010 0100` son un mismo número; también los rusos `8 900 000-00-01` y
`+7 900 000-00-01`. `docs.google.com` y `drive.google.com` son un mismo sitio, `google.com`.

Las menciones se encuentran con reglas fijas en tu ordenador. Ningún proveedor de IA lee tus mensajes para esto y no
se envía nada al servicio de mensajería. Las reglas buscan lo que «parece un teléfono»: se omiten fechas, importes,
números de tarjeta y números después de palabras como «pedido» o «factura», pero algunos códigos aparecerán igualmente
como teléfonos. Se descartan una vez. Un número de otro país escrito sin `+` solo se encuentra después de una palabra
como «tel» o «phone», y entonces se guarda solo como dígitos.

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

- `phone:` encuentra un número con cualquier espacio, guion o paréntesis. Escríbelo con el código de país y `+`. Sin
  `+`, solo se reconocen números rusos: `8 900…` y `9…` de diez dígitos se leen como `+7`.
- `email:` encuentra una dirección en mayúsculas o minúsculas. Ponla entre comillas, porque `@` tiene su propio
  significado en una consulta.
- `domain:` encuentra todos los enlaces y direcciones de ese sitio, incluidos sus subdominios.
- `url:` encuentra un enlace. Se ignoran los parámetros de seguimiento como `utm_source` y la parte después de `#`.

Un valor encontrado en un archivo o una nota de voz encuentra el mensaje con el que llegó el archivo. Los campos se
combinan con el resto del [lenguaje de consultas](./tg/query-language.md), por ejemplo
`domain:example.com AND date>=2026-09-01`.

## Revisar lo encontrado

Para ver las menciones, de la más reciente a la más antigua:

```sh
tg personal mentions list kind:phone
tg personal mentions list domain:example.com status:found
tg personal mentions show 12
```

`list` da a cada mención un ID, la fecha, el tipo (`phone`, `email`, `url`, `document`, `person-name`), el valor, su
estado y el mensaje. `show` añade el texto alrededor y en cuántos otros lugares aparece el mismo valor.

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

Una decisión se aplica al valor, no a un mensaje. Confirma un número una vez y todos los mensajes que lo contienen
quedan vinculados a esa persona, también los que lleguen después. Recházalo y queda descartado en todas partes. Un
número o una dirección que ya pertenece a una persona de tu historial se vincula sin ti.

Confirmar y rechazar solo cambian el almacén local de tu ordenador. No se envía nada y la cuenta del servicio de
mensajería no cambia. El almacén registra quién decidió. Un comando ejecutado en la terminal de un agente que define
`AI_AGENT` o `CLAUDECODE` se registra como decisión del agente; `--as-owner` lo registra como tuya. Si los
[permisos](./permissions.mdx) de tu perfil no permiten estos cambios, el error indica el ajuste que hay que cambiar.

## Nombres de personas

En Telegram, `tg` también encuentra los nombres de las personas que has visto en un chat: el nombre de la persona y los
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
tg personal search messages 'mentions:"person:7"'
```

`show` enumera las personas que puede ser un nombre. Un nombre se vincula a una persona sin ti solo cuando en ese chat
escribió exactamente una persona con ese nombre. `mentions:"person:7"` encuentra los mensajes que nombran a la persona
7 o contienen su número o dirección confirmados.

Cuando aparezcan personas nuevas en tu historial, vuelve a leer los nombres:

```sh
tg personal mentions rebuild person-name
```

## Mensajes guardados antes

Los mensajes nuevos obtienen sus menciones al guardarse. Lee una vez el historial que guardaste antes:

```sh
tg personal mentions rebuild
max personal mentions rebuild
```

Lee cada mensaje guardado, el texto de los archivos y las transcripciones, muestra su progreso y conserva todas tus
decisiones. Puedes ejecutarlo de nuevo en cualquier momento.

## Números de teléfono y privacidad

Los números se guardan en el almacén local como dígitos, igual que ya están en los mensajes guardados. No van a
registros, mensajes de error ni registros de ejecución. Nunca se abre un enlace ni se contacta con un sitio.

## Lo que aún no existe

- Nombres de personas en `max`. Llegarán más adelante.
- Nombres de personas que las herramientas aún no conocen.
- Menciones en [notas y archivos](./memo/notes.md) y en el [correo](./email.mdx).
- Vincular un enlace con el chat o el documento guardado al que apunta. Por ahora un enlace solo se puede descartar.
- Direcciones postales.

Cuando sepas dónde apareció un número, un sitio o un nombre, [recupera el contexto con esa persona](./people.md) antes de
responder.
