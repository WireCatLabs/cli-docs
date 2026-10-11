---
title: "Correo"
---

Esta página te ayuda a traer tu correo a Memo. Así el correo está junto a tus notas y mensajes en la
búsqueda, en el contexto de una persona y en las fuentes que lee tu agente. Memo lee el correo a
través de [Himalaya](https://github.com/pimalaya/himalaya), un programa de correo que configuras
primero. Tu buzón se abre solo para lectura: Memo nunca envía, mueve ni borra correo, y no lo marca
como leído.

## Antes de empezar

Configura tu cuenta de correo en Himalaya. Para Gmail, usa una cuenta IMAP con una
[contraseña de aplicación](https://myaccount.google.com/apppasswords) de Gmail (una contraseña aparte
para un solo programa, que puedes revocar en cualquier momento). Comprueba que Himalaya muestra tu
correo antes de continuar.

```text prompt
Help me set up Himalaya for my Gmail account with an app password, and check that it lists my inbox.
Then add the account to Memo's config and import the last 30 days of mail.
```

## Añadir la cuenta a Memo

Pon el nombre de la cuenta en el [archivo de configuración](./configuration.md#mail) de Memo,
`~/.config/cli-memo/config.json`. `name` es el nombre de la cuenta en Himalaya; `address` es tu
dirección de correo:

```json
{ "mail": { "accounts": [{ "name": "work", "address": "you@example.com" }] } }
```

Gmail es la opción predeterminada. Para otro proveedor de correo, añade `"mode": "imap"` y las
carpetas que quieres leer:

```json
{ "mail": { "accounts": [{ "name": "home", "address": "me@example.org", "mode": "imap", "folders": ["INBOX", "Archive"] }] } }
```

## Importar correo

```sh
memo mail work import --since 2026-09-01
```

`work` es el `name` de la cuenta en la configuración. Escríbelo siempre, aunque tengas una sola
cuenta: Memo nunca elige una cuenta por ti, y muestra las cuentas que conoce cuando falta el nombre o
es incorrecto.

- Sin `--since`, Memo lee los últimos 30 días.
- Cada ejecución lee hasta 200 correos nuevos (`--max` cambia esta cifra). Si lo ejecutas otra vez,
  continúa donde se detuvo; los correos ya guardados se omiten.
- `memo import` y el temporizador importan todas las cuentas de la configuración.

## Encontrar tu correo

```sh
memo search mail 'invoice'
memo search mail 'from:kai subject:budget'
memo search mail 'mailbox:starred' --account you@example.com
memo search all 'budget'
```

Las etiquetas de Gmail, como Recibidos, Importantes, Destacados y tus propias etiquetas, se convierten
en carpetas de correo, así que `mailbox:important` las encuentra. Consulta
[Búsqueda](./search.md#search-mail).

## Qué se guarda

- El remitente, los destinatarios (Para, CC y CCO), el asunto, la fecha y el texto de cada correo.
- Si un correo está leído o destacado, tal como lo muestra tu buzón.
- El texto de los adjuntos legibles, que se busca junto con el correo. Los adjuntos PDF y Word
  necesitan los [lectores opcionales](./notes.md#files-memo-can-read). Después de instalarlos,
  ejecuta `memo mail work import --retry-attachments` para leer los adjuntos que se omitieron.
- Hasta 1.000.000 de caracteres de cada correo y 200.000 de cada adjunto
  ([cambiar los límites](./configuration.md#mail)).

El correo se prepara para la búsqueda por significado cuando el modelo de búsqueda está en tu
ordenador; `--no-embed` omite este paso.

## Cuando se borra un correo

Cuando borras un correo en tu buzón, su texto sale del almacén local en la siguiente importación. El
correo movido a Spam cuenta como borrado. Para protegerte de errores:

- los dos primeros días del periodo no se revisan en busca de correos borrados;
- si una ejecución detecta que falta una parte inusualmente grande de tu correo, no borra nada y te
  avisa.

## El correo y las personas

Para incluir el correo de una persona en [su contexto](./people.md#everything-about-a-person), vincula
la dirección a esa persona en tg o max: `tg contacts link 'Kai Sample' email:kai@example.com`.

Siguiente: [mantener el correo y las notas al día con un temporizador](./archive.md).
