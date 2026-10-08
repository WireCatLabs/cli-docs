---
title: "Correo y notas con Memo"
description: "Reúne correo, notas en Markdown e historial de mensajes para preparar una conversación o encontrar una decisión anterior."
---

Usa Memo cuando el contexto que necesitas está repartido entre mensajes, correo y notas.
Reúne los datos almacenados sobre una persona con enlaces a sus fuentes, para que tú o tu
agente de IA podáis preparar una reunión o comprobar un acuerdo. Importa primero tus notas
y el correo: Memo no descarga por sí mismo el historial de Telegram o MAX.

Esta guía describe **Memo 0.2.0**. Es una herramienta en una etapa temprana de desarrollo,
disponible como `@leemour/cli-memo`.

## Instala Memo

Necesitas Node.js 22.16 o posterior en la serie 22.x, o Node.js 24 o posterior, con npm.
Para incluir contexto de mensajes, [instala Telegram o MAX](./installation.mdx) y descarga
el historial necesario con esa herramienta. Memo lee su almacén local compartido en el mismo ordenador.

```sh
npm install -g @leemour/cli-memo@0.2.0
memo --version
```

La comprobación de versión debe mostrar `0.2.0`. Un agente con acceso al terminal puede
usar `memo` cuando la orden está disponible en su PATH; dale esta guía con las órdenes siguientes.

## Añade tus notas

Elige una carpeta de notas existente y sustituye `/path/to/vault` por su ruta completa.
Obsidian es el formato predeterminado; usa `--format markdown` para enlaces Markdown normales.

```sh
memo folders add /path/to/vault
memo notes import --no-embed
memo search notes 'budget' --json
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

Dale a tu agente una petición como esta, sustituyendo el nombre:

> Usa Memo para reunir lo que sabemos de Rin Example antes de nuestra reunión: mensajes recientes,
> correo, notas vinculadas y tareas abiertas. Incluye enlaces a las fuentes e indica qué datos faltan.

El agente puede reunir contexto de una persona o buscar en las fuentes importadas:

```sh
memo context telegram:"Rin Example" --json
memo search all 'budget' --json
```

`search all` busca a la vez en mensajes, correo y notas; `skipped` indica dónde no se pudo buscar. Revisa las
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

- **Orden no encontrada:** comprueba `memo --version` en el terminal del agente y vuelve a abrirlo tras la instalación.
- **No hay notas:** comprueba `memo folders list`, repite `memo notes import --no-embed` y revisa el resultado.
- **No hay cuenta de correo:** comprueba que `mail.accounts` nombra una cuenta configurada en Himalaya.
- **Persona incorrecta o nombre ambiguo:** usa el proveedor y el ID exacto; vincula las identidades explícitamente.
- **Contexto incompleto:** importa las notas y el correo pertinentes y descarga el historial que falta con tg o max.

Cuando las fuentes estén disponibles, continúa con [preparar una reunión](./meeting-brief.mdx).
Consulta las opciones con `memo --help` o el `--help` de una suborden.
La [documentación original de Memo 0.2.0](https://github.com/leemour/cli-memo/blob/v0.2.0/README.md)
también describe tareas, relaciones, etiquetas, recordatorios locales y conjuntos de fuentes.
