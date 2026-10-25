---
title: "Etiquetas"
---

Esta página te ayuda a etiquetar tus notas, correos, mensajes, personas y proyectos, y después a
encontrar todo lo que tiene una etiqueta. Una etiqueta es una palabra corta que tú eliges, como
`work`, `family` o `follow-up`. Las etiquetas viven en el almacén local: tus archivos, tus etiquetas
de Gmail y tu buzón se quedan como están.

## Añadir una etiqueta

**Lo más fácil: pídeselo a tu agente.**

```text prompt
Use memo CLI to tag the notes about the Harbour budget with follow-up.
Show me which notes you tagged.
```

**O ejecuta tú los comandos.** Primero busca la referencia de lo que quieres etiquetar, por ejemplo
con `memo search notes budget`. Después:

```sh
memo tags add follow-up --note document:3
memo tags add work follow-up --note note:12      # two tags at once
```

Una etiqueta tiene de 1 a 32 caracteres: letras a–z, dígitos y guiones. Las mayúsculas no cuentan,
así que `Work` y `work` son la misma etiqueta. Añadir una etiqueta que ya está no cambia nada.

## Qué puedes etiquetar

| Qué | Cómo nombrarlo |
|---|---|
| Una nota que escribiste | `--note note:12` |
| Un archivo de una carpeta de notas | `--note document:3` |
| Todas las notas de una carpeta, o de una carpeta que hay dentro | `--folder 1` o `--folder 1 --subfolder Projects` |
| Un mensaje o un correo | `--message 'msg:telegram/1/77/42'` (la referencia completa) |
| Un chat o un hilo de correo | `--chat 77 --account telegram:1` |
| Un contacto en una cuenta | `--contact 101 --account telegram:1` |
| Una persona cuyas cuentas enlazaste | `--person PERSON_UID` |
| Una organización, un proyecto o una tarea | `--organization 2`, `--project 1`, `--task HRB-1` |
| Una reunión | `--meeting 5 --account zoom:ACCOUNT` |

El ID de la carpeta sale de `memo folders list`. Una etiqueta en una carpeta se aplica a todas las
notas que contiene, a cualquier profundidad, incluidas las notas que añadas más tarde.

Un chat, un contacto y una reunión pertenecen a una cuenta, así que necesitan `--account`. Una
persona, una organización, un proyecto o una tarea te pertenecen a ti, así que no
necesitan cuenta.

## Etiquetas en tus archivos

Las etiquetas escritas en tus archivos de notas se importan con las notas:

- En los dos formatos, el campo `tags:` al principio de un archivo.
- En una carpeta de Obsidian, también las `#tags` en el texto.

Si quitas una etiqueta del archivo, se quita de la nota en la siguiente importación, salvo que también
hayas añadido la misma etiqueta en Memo. `memo tags list` muestra `(file)` junto a las etiquetas que
vienen de un archivo.

## Encontrar cosas por etiqueta

```sh
memo tags list tag:follow-up               # everything with this tag
memo search notes 'budget' --filter 'tag:work'  # notes with the tag that contain a word
memo search all 'tag:follow-up'             # messages, mail and notes with the tag
memo tags list                              # every tag, up to 100
```

`memo tags list` muestra 100 etiquetas cada vez; añade `--limit 500` para ver más. `type:note` o
`type:person` muestra solo un tipo.

## Quitar una etiqueta

```sh
memo tags remove follow-up --note document:3
```

Quitar una etiqueta deja la nota, el mensaje o la persona como estaban. Quitar una etiqueta que no
está no cambia nada. Una etiqueta que viene de un archivo se quita editando el archivo.

## Revisar etiquetas duplicadas

Pide a tu agente que busque etiquetas probablemente duplicadas y muestre las pruebas antes de cambiar ninguna:

```text prompt
Revisa nuestras etiquetas en busca de posibles sinónimos. Muestra primero los nombres canónicos y los
alias. Para cada par que elija, examina sus asignaciones y coincidencias. No crees alias ni fusiones nada.
```

`memo vocabulary check --limit 20 --json` sugiere coincidencias por escritura. Los nombres parecidos son
candidatos a revisar; no prueban que dos conceptos sean el mismo. Los alias existentes son nombres
alternativos de un mismo registro canónico, así que reutilízalos antes de crear otra etiqueta.

Ejecuta `memo vocabulary list --json` para leer los ID canónicos y la huella actual. Después elige
explícitamente dos entradas de **etiqueta**. Abajo, sustituye `FINGERPRINT` por la huella de esa lista sin
filtrar, `tag:1` por el duplicado que revisas y `tag:2` por el nombre que conservarías:

```sh
memo vocabulary inspect tag:1 tag:2 --fingerprint FINGERPRINT --limit 5 --json
```

Muestra las asignaciones de cada etiqueta por tipo de destino, los destinos en común, los alias, las
asignaciones automáticas y los chats compartidos, además de los enlaces en ambos sentidos. Las muestras
de asignaciones incluyen ID de fuentes y autores. No lee el texto de las transcripciones ni llama a un
modelo. No cambia etiquetas ni alias. `--limit` limita las muestras por tabla, no los recuentos completos.
`coverage.samples_complete` indica si se recortaron las muestras; `preview_fingerprint` cubre igualmente
todas las filas examinadas.

Por defecto la lectura se limita a 5.000 filas de dependencias y 1 MiB de entrada. `--max-rows` admite
hasta 20.000; `--max-read-bytes`, hasta 16 MiB; `--limit`, hasta 100 muestras por tabla. El catálogo tiene
un límite aparte. Si las dependencias son demasiado grandes, falla toda la vista previa en lugar de
devolver un recuento parcial. Una estimación prudente del tamaño puede rechazarla antes de llegar al
límite real del JSON. Si el vocabulario cambió, vuelve a listarlo y elige el par de nuevo; no reutilices
la huella caducada.

`coverage.inspected_tables` nombra las cuatro tablas cubiertas: asignaciones, alias, asignaciones
automáticas y enlaces. El texto de búsquedas guardadas, el historial de propuestas y las referencias
serializadas arbitrarias quedan fuera de esta vista previa. `coverage.apply_supported` es true: cli-core
puede aplicar esa vista previa, pero memo no tiene ningún comando que lo haga. Se rechazan temas y proyectos.
Una huella de vista previa no da permiso para fusionar. Los comandos de alias que revisa el
propietario siguen siendo aparte.

## Etiquetas en tg y max

tg y max leen las mismas etiquetas: `tg personal search messages 'tag:follow-up'` encuentra mensajes de Telegram etiquetados y `memo search mail 'tag:follow-up'` encuentra correo etiquetado. Las etiquetas de contactos también están disponibles con `tg personal tags` y `max personal tags`.

Siguiente: [busca por etiqueta y por palabras](./search.md).
