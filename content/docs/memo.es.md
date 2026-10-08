---
title: "Correo y notas"
description: "Ayuda a tu agente a preparar un resumen con correo, notas y mensajes, con enlaces que puedas comprobar."
---

Antes de una reunión, puede que necesites una decisión de un chat, un detalle de un correo y
una nota que guardaste. Esta página explica cómo conectar esas fuentes con Memo para que tu
agente reúna el contexto en un solo lugar. Aprenderás a añadir notas y correo, pedir un resumen
sobre una persona y comprobar las fuentes de la respuesta. Tú eliges las carpetas y cuentas
que incluyes; el historial de mensajes debe descargarse antes con tg o max.

## Antes de empezar

Usa un agente de IA con acceso al terminal en el ordenador donde están tus notas y el historial
de mensajes. Puedes empezar solo con notas y añadir correo después. Para incluir mensajes,
[conecta Telegram o MAX](./installation.mdx) y descarga el historial necesario.

## Pruébalo con tu agente

Sustituye la persona y la carpeta por las tuyas:

> Ayúdame a configurar Memo para mi carpeta de notas y la cuenta de correo que elija. Después
> prepara un resumen sobre Rin Example antes de nuestra reunión: mensajes recientes, correo,
> notas vinculadas y tareas abiertas. Incluye enlaces a las fuentes e indica qué datos faltan.

Tu agente instala Memo, registra la carpeta que elijas e importa sus notas. Si añades correo,
lo lee a través de una cuenta configurada en Himalaya. Estas importaciones guardan una copia
local; no editan las notas originales, envían correo ni lo marcan como leído. Después, el
agente reúne lo que el almacén local contiene sobre la persona.

## Comprueba el resultado

El resumen debe enlazar los mensajes, correos o notas de los que procede cada detalle relevante.
Abre una fuente para comprobar un acuerdo o una fecha. El agente también debe explicar las
carencias: por ejemplo, un periodo de correo sin importar o un enlace a una persona que no se
ha resuelto. Un resultado vacío por sí solo no demuestra que no hubiera acuerdos.

Los apartados siguientes incluyen los pasos de configuración y las órdenes para ti o tu agente.

## Instala Memo

Necesitas Node.js con npm; la [guía de instalación](./installation.mdx) explica cómo configurarlos.
Para incluir contexto de mensajes, [instala Telegram o MAX](./installation.mdx) y descarga
el historial necesario con esa herramienta. Memo lee su almacén local compartido en el mismo ordenador.

```sh
npm install -g @leemour/cli-memo
memo --help
```

La ayuda debe mostrar las órdenes de Memo. Si funciona en el terminal del agente, este puede
encontrar Memo. Dale esta guía con los pasos siguientes.

## Añade tus notas

Elige una carpeta de notas existente y sustituye `/path/to/vault` por su ruta completa.
Obsidian es el formato predeterminado; usa `--format markdown` para enlaces Markdown normales.

```sh
memo folders add /path/to/vault
memo notes import --no-embed
memo notes search 'budget' --json
```

La primera orden muestra el ID de la carpeta. La importación copia las notas al almacén local
sin cambiar los archivos originales. La búsqueda devuelve las notas encontradas con sus
referencias y el texto coincidente. `--no-embed` omite la preparación de la búsqueda por significado;
la búsqueda por palabras sigue funcionando. Repite la importación después de editar los archivos.

Para asociar una nota importada a una persona, sustituye el nombre y la ruta:

```sh
memo note telegram:"Rin Example" /path/to/vault/people/Rin.md
memo context telegram:"Rin Example" --json
```

Usa `max:<name or id>` o `email:<address>` para otra identidad. La nota debe estar ya importada.
Un nombre en texto normal no crea automáticamente una relación; asocia la nota de forma explícita
o usa un enlace compatible, como `[[Rin Example]]` en Obsidian.

## Añade correo

Memo lee correo a través de [Himalaya](https://github.com/pimalaya/himalaya). Instala Himalaya
y configura allí tu cuenta de correo primero. Memo usa el nombre y la dirección de esa cuenta;
no necesita otra copia de la contraseña del correo.

Añade `mail.accounts` a la configuración de Memo, conservando los ajustes existentes. Rutas predeterminadas:

| OS | Archivo de configuración |
| --- | --- |
| Linux | `~/.config/cli-memo/config.json` |
| macOS | `~/Library/Preferences/cli-memo/config.json` |
| Windows | `%APPDATA%\cli-memo\Config\config.json` |

`MEMO_CONFIG_DIR` cambia el directorio; en Linux, `XDG_CONFIG_HOME` también afecta a la ruta predeterminada.
El ejemplo usa una cuenta de Himalaya llamada `gmail`; sustituye el nombre y la dirección por los tuyos.

```json
{
  "mail": {
    "accounts": [{ "name": "gmail", "address": "you@example.com" }]
  }
}
```

Gmail es el modo predeterminado e importa All Mail. Para otro proveedor IMAP, añade
`"mode": "imap"` y `"folders": ["INBOX", "Archive"]` a la cuenta, con los nombres reales
de las carpetas de tu buzón.

```sh
memo mail import --account gmail --since 2026-09-01 --json
```

Elige la fecha inicial que quieras incluir. Cada ejecución lee hasta 200 mensajes nuevos
por defecto; repítela para continuar si el resultado indica que la importación está incompleta.
El buzón se abre solo para lectura: importar no envía correo ni lo marca como leído.
El correo importado se almacena localmente; repetir la importación puede eliminar del almacén
el texto de los mensajes que hayan desaparecido de la fuente.

Vincula explícitamente una dirección de correo con su identidad de mensajería mediante
`tg contacts link` o `max contacts link`; los nombres coincidentes no identifican a la misma persona.
Consulta la guía para [trabajar con personas](./people.md).

## Pide el contexto que necesitas

El agente puede reunir contexto de una persona o buscar en las fuentes importadas:

```sh
memo context telegram:"Rin Example" --json
memo search 'budget' --all --json
```

`--all` incluye explícitamente todas las cuentas almacenadas y las notas importadas. Revisa las
referencias y la cobertura antes de confiar en una respuesta. El historial que falta, el correo
fuera del periodo importado o los enlaces de notas sin resolver pueden dejar un resultado incompleto.
Añade `--account <id>` a `context` si hay varias cuentas almacenadas del mismo proveedor.

También puedes guardar una nota propia sobre la persona:

```sh
memo notes add 'Prefers morning meetings' --about telegram:'Rin Example'
memo notes list --about telegram:'Rin Example' --json
```

Estas notas viven en el almacén local. Escribirlas no cambia un archivo importado;
`memo notes export` es una acción explícita y separada para escribir archivos.

## Si falta algo

- **Orden no encontrada:** comprueba `memo --help` en el terminal del agente y vuelve a abrirlo tras la instalación.
- **No hay notas:** comprueba `memo folders list`, repite `memo notes import --no-embed` y revisa el resultado.
- **No hay cuenta de correo:** comprueba que `mail.accounts` nombra una cuenta configurada en Himalaya.
- **Persona incorrecta o nombre ambiguo:** usa el proveedor y el ID exacto; vincula las identidades explícitamente.
- **Contexto incompleto:** importa las notas y el correo pertinentes y descarga el historial que falta con tg o max.

Cuando las fuentes estén disponibles, continúa con [preparar una reunión](./meeting-brief.mdx).
Consulta las opciones con `memo --help` o el `--help` de una suborden.
La [documentación de órdenes de Memo](https://github.com/leemour/cli-memo#readme)
también describe tareas, relaciones, etiquetas, recordatorios locales y conjuntos de fuentes.
