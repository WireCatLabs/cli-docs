---
title: "Próximas mejoras"
---

Esta página reúne lo que está previsto para `mail` y todavía no tiene. Léela antes de montar una solución alternativa
para algo que falta: puede que ya esté en camino. El orden es aproximado y puede cambiar. Para proponer algo, abre una
[issue en GitHub](https://github.com/WireCatLabs/mail-cli/issues).

## Qué funciona hoy

`mail` lee un buzón por IMAP en el almacén compartido de WireCat y lo ordena en el servidor: marcas, movimientos,
copias, borrado a la papelera y carpetas, y cada cambio se puede deshacer con `messages restore`. Guarda borradores en
el servidor, envía, responde y reenvía por SMTP con una comprobación de destinatarios y un límite por hora, y lista y
descarga archivos adjuntos. Exporta el correo guardado a mbox o Maildir, y un temporizador (`schedule`) puede ejecutar
cualquier comando. Las reglas de correo del propietario y la limpieza de sobres pasaron aquí desde memo.

`review` muestra qué hay de nuevo desde la última vez, a qué correos debes respuesta (`--unanswered`) y cuáles esperan una
(`--waiting`), y `--holder` da a cada agente su propia marca de procesamiento, que mueve `messages acknowledge`.
`stats messages show` cuenta el correo guardado recibido y enviado por día, semana o remitente, y `stats messages top`
lista los remitentes, listas o dominios con más correo. `account inspect` agrupa un buzón por remitente y lista antes de
sincronizarlo, con una sugerencia `skip` y una puntuación de spam. `messages import` añade un archivo mbox de Google
Takeout a un perfil de Gmail. `sync` lee adjuntos hasta un tamaño que tú fijas (`read_attachments`,
`max_attachment_mb`) y puntúa a los remitentes del correo guardado, de modo que la búsqueda clasifica más abajo a los
remitentes sospechosos. `config migrate` y `config repair` mantienen el archivo de ajustes completo y válido.

Un `schedule agent` se ejecuta por defecto con Sonnet, arranca sin tus servidores MCP, habilidades ni ajustes y no inicia
más ejecuciones durante el resto del día cuando las suyas han costado 5 dólares estadounidenses. `--model` y
`--max-cost-per-day` lo cambian para una programación, y los ajustes `schedule_model_claude`, `schedule_model_codex`,
`schedule_lean_start` y `schedule_max_cost_per_day` lo cambian para cada una nueva.

Encuentra por sí mismo el servidor de una dirección nueva: una tabla incorporada, el registro MX, el ISPDB de
Thunderbird y el archivo autoconfig del dominio. Inicia sesión con una contraseña de aplicación guardada en el llavero
del sistema, lo que sirve para Yandex, Gmail, iCloud, Mail.ru, Fastmail y otros proveedores que ofrecen contraseñas de
aplicación. Outlook.com y Microsoft 365 inician sesión con OAuth mediante la aplicación de Microsoft propia de WireCat,
sin nada que registrar ([guía](./outlook.md)); Gmail puede usar OAuth con la aplicación de Google de WireCat o con la tuya
([pasos](./oauth-google.md)).

Busca y lee el correo guardado de un perfil (`search messages`, `messages show`, `conversations`) y pregunta al servidor
de correo por el correo que `sync` aún no ha leído. `memo` busca en todos los buzones junto con mensajes y notas. Un
servidor MCP da a los agentes de IA los mismos comandos, y un agente solo puede escribir al propietario. Todos los
comandos están en la [referencia de comandos](./commands.md).

## Siguiente

- **La verificación del editor de Microsoft**, que pone una insignia de verificado en la página de consentimiento y que
  algunas organizaciones exigen antes de permitir la aplicación. Se espera a que lleguen usuarios con cuentas de trabajo.
- **Una prueba en vivo de Gmail con OAuth.** El inicio de sesión está construido y aún no se ha probado con una cuenta
  real de Google.

## No previsto

JMAP, filtros Sieve en el servidor y PGP o S/MIME. Si necesitas alguno, abre un issue y explica por qué.

Lo que cambió cada versión publicada está en el [historial de cambios](./changelog.md).
