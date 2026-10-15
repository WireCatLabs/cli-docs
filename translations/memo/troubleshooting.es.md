---
title: "Solución de problemas"
---

Esta página te ayuda cuando Memo no hace lo que esperabas. Busca lo que dice la pantalla o lo que
notaste y sigue los pasos. Para pedir ayuda a tu agente, dale el mensaje completo que mostró Memo.

## `memo: command not found`

Memo no está instalado, o la terminal se abrió antes de instalarlo. Cierra la terminal, abre una nueva
y ejecuta `memo --help`. Si sigue fallando, instala Memo de nuevo:
`npm install -g @wirecat/cli-memo` ([instalación](./installation.md)).

## Una nota o un archivo no aparece en la búsqueda

1. Ejecuta `memo sync --only notes` y lee el informe. Muestra los archivos que no pudo leer y por qué.
2. Comprueba que la carpeta del archivo está en `memo folders list` y que `notes.ignore` no omite el
   archivo en el [archivo de configuración](./configuration.md#notes).
3. Busca una palabra que sepas que está en el archivo. Una búsqueda encuentra resultados que contienen
   **todas** las palabras, así que una frase larga a menudo no encuentra nada; usa dos o tres palabras
   clave.
4. Los archivos PDF y Word necesitan los lectores opcionales: `npm install -g unpdf mammoth` y luego
   importa de nuevo. Los PDF escaneados no tienen texto que leer.

## Aparece "Searched by words only"

El modelo de búsqueda para la búsqueda por significado no está en tu ordenador. Memo sigue encontrando
todas las notas que contienen tus palabras. Para buscar también por significado, descarga el modelo
con tg o max y luego importa:

```sh
tg models text download e5-small    # or: max models text download e5-small
memo sync
```

## Aparece "nobody by that name yet"

Una nota enlaza a un nombre, como `[[Kai Sample]]`, pero en el almacén local todavía no hay nadie con
ese nombre. El enlace empieza a funcionar cuando se descargan los chats de esa persona con tg o max.
Si dos personas tienen el mismo nombre, enlaza a la correcta con una referencia como `[Kai](person:7)`.

## La importación rechaza una carpeta

Cada carpeta necesita un ID del almacén local. Añádela con `memo folders add /path/to/folder`. Si la
carpeta se añadió en otro ordenador, conéctala en su lugar: `memo folders list` muestra su ID y
`memo folders attach ID /path/to/folder` la conecta ([detalles](./notes.md#use-the-same-notes-on-another-computer)).

## Una importación no borró nada y mostró un aviso

La importación detectó que faltaba de golpe la mayor parte de una carpeta o de un buzón y se detuvo
para proteger tus datos. Comprueba que la carpeta o el disco están ahí y que la cuenta de correo
funciona, y luego importa de nuevo.

## Aparece "no mail account" o la importación de correo pide una cuenta

`no mail account` significa que el archivo de configuración todavía no tiene cuentas de correo. Añade
una en `mail.accounts` ([correo](./mail.md#add-the-account-to-memo)).

`memo sync --account work` acepta el nombre de cuenta: el `name` de `mail.accounts` en los ajustes. Si es incorrecto, Memo enumera las cuentas conocidas. Sin `--account`, lee todas.

## Se rechaza la edición de una nota

La revisión que indicaste no es la actual: la nota cambió después de que la leyeras. Ejecuta
`memo notes show note:ID --json`, toma la `revision` actual y edita de nuevo.

## El contexto de una persona está vacío o le falta algo

- Los chats de la persona todavía no están descargados. Descárgalos con tg o max.
- Las cuentas no están vinculadas. Vincúlalas con `tg contacts link` ([detalles](./people.md#link-a-persons-accounts)).
- Si tienes varias cuentas en un servicio de mensajería, añade `--account`.
- Una nota que solo menciona el nombre en su texto no se incluye; enlázala en su lugar.

## Aparece "select --provider and, when several accounts exist, --account"

El comando trabaja en una sola cuenta y Memo no elige una por ti. Añade `--provider`, como
`telegram`, y `--account` con el ID de la cuenta.

## Faltan datos de una versión anterior

Las versiones anteriores de Memo guardaban los datos en un archivo llamado `messages.db`. La versión
actual usa el almacén local compartido, `wirecat.db`, y no lee el archivo antiguo. Añade de nuevo cada
carpeta con `memo folders add` y luego ejecuta `memo sync --only notes` y `memo sync --only mail`.

## La ayuda muestra todos los comandos

Una ruta en un solo argumento, como `memo "projects add" --help`, se rechaza indicando las palabras correctas. Un bucle puede pasarla así: en zsh, `for c in "projects add"; do memo $c --help; done` conserva `$c` entero. Usa `memo ${=c} --help` en zsh o recorre las palabras.

## Si sigues sin solución

Antes de informar de un error, compara `memo --version` con `npm view @wirecat/cli-memo version`. Si tu versión es anterior, actualiza y prueba de nuevo: el fallo puede estar corregido.

Ejecuta de nuevo el comando que falla con `--json` y da la respuesta completa a tu agente, o
[abre una incidencia](https://github.com/WireCatLabs/cli-memo/issues) con el comando y el mensaje. No
incluyas notas privadas, direcciones de correo ni mensajes.
