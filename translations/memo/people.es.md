---
title: "Personas y proyectos"
---

Esta página te ayuda a responder a «¿qué sé de esta persona?» antes de contestarle o de reunirte con
ella, y a llevar el control de las empresas, los equipos y los proyectos a los que pertenece. Memo
reúne en una sola respuesta los mensajes de la persona, su correo y tus notas, cada cosa con su
fuente. Nunca decide que dos cuentas son una sola persona porque los nombres coinciden: las enlazas
tú.

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
```

Nombra a la persona por su cuenta: `telegram:` o `max:` con un nombre o un ID, o `email:` con una
dirección. La respuesta reúne:

- todas las cuentas que enlazaste a la persona;
- el último mensaje en cada sentido, los mensajes recientes en chats directos y grupos, y los chats
  que compartís;
- su correo, en cuanto la dirección está enlazada a ella;
- la nota sobre ella, las notas que enlazan a ella y las notas que escribiste sobre ella en Memo;
- las tareas abiertas que tratan sobre ella o que tiene asignadas.

Una nota que solo menciona el nombre en su texto no se incluye; solo cuentan los enlaces
([por qué](./how-it-works.md#links-between-notes-and-people)). Si una parte no dio nada, la respuesta
dice por qué. `--limit` muestra más de 20 elementos de cada tipo, y `--json` da la respuesta a un
agente.

Si tienes varias cuentas en el mismo servicio de mensajería, añade `--account`, por ejemplo
`memo context telegram:101 --account 1`.

## Enlazar las cuentas de una persona

Una persona puede tener una cuenta de Telegram, una cuenta de MAX y una dirección de correo. Enlázalas
en tg o max para que Memo las trate como una sola persona:

```sh
tg contacts link 'Kai Sample' email:kai@example.com
```

Después, `memo context` para cualquiera de las cuentas muestra todo lo de todas ellas. Un nombre que
coincide nunca basta para enlazar cuentas.

Para elegir la nota principal sobre la persona, consulta [la nota sobre una persona](./notes.md#the-note-about-a-person).

## Organizaciones y proyectos

Las organizaciones y los proyectos son tuyos, no están ligados a una cuenta de un servicio de
mensajería.

- Una **organización** es una empresa, un equipo, una familia o una comunidad.
- Un **proyecto** tiene un nombre, una clave corta como `HRB` (3 o 4 letras y dígitos), un tipo y, si
  quieres, la organización a la que pertenece.

```sh
memo organizations add 'Synthetic Studio' --kind company
memo projects add 'Harbour' --key HRB --scope work --organization organization:1
memo projects list
memo projects context HRB
```

`--scope` es `personal` o `work`. `projects context` recibe la clave del proyecto o su
número. `projects context` y `organizations context` muestran las personas enlazadas al proyecto o a
la organización, las notas que tratan sobre él o que enlazan a él, y sus etiquetas. La clave
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

Una **relación** indica que una persona pertenece a una organización o trabaja en un proyecto:

```sh
memo relationships add person:PERSON_UID organization:1 --kind member-of
memo relationships add person:PERSON_UID project:1 --kind related-to --role author
memo relationships list 'about:"project:1"'
memo relationships remove 4
```

Los vínculos son afirmaciones tuyas. No unen dos cuentas en una persona. Uno añadido desde el terminal de un agente queda sin confirmar, con el agente en `provenance` (`agent:claude-code`), hasta `memo relationships confirm`; `--as-owner` lo atribuye a ti al instante.

Memo puede sugerir relaciones a partir del correo: personas que te escriben desde el mismo dominio de
empresa.

```sh
memo relationships suggest --provider email --account you@example.com
memo relationships confirm 4
```

Las sugerencias esperan hasta que las confirmes, y antes de eso no aparecen en el contexto de una
persona. Los dominios de correo gratuito habituales, como Gmail, nunca se usan para sugerencias.

## Reuniones en un proyecto

Si tus reuniones están guardadas en el almacén local, puedes enlazar una reunión a un proyecto:

```sh
memo projects meetings link HRB 5 --provider zoom --account ACCOUNT
memo projects meetings list HRB --provider zoom --account ACCOUNT
```

Nombra exactamente la cuenta de la reunión. `confirmed:false` muestra los enlaces que sugirió un agente;
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
