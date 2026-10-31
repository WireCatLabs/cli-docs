---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/mail-cli`. Una sección por versión, de la más reciente a la más antigua.

## 0.1.0 — 31.10.2026

### Añadido

- **`mail` lee un buzón por IMAP en el almacén compartido de WireCat y nunca modifica el buzón.** `memo` y las demás
  herramientas de WireCat buscan y leen después ese correo en tu ordenador. `mail` no envía correo.
- **`session start` inicia sesión de un perfil con una contraseña de aplicación.** Un perfil nuevo necesita `--address`,
  o lo pide en un terminal. Encuentra el servidor mediante una tabla incorporada (Yandex, Gmail, iCloud, Mail.ru,
  Fastmail), el registro MX, el ISPDB de Thunderbird y el archivo autoconfig del dominio; `--provider`, o `--host` con
  `--port` y `--security`, lo fija a mano y se salta esas búsquedas. Muestra los pasos para preparar el buzón, pide la
  contraseña de aplicación sin eco (o lee `MAIL_PASSWORD`), la comprueba en el servidor y solo entonces guarda el perfil
  y deja la contraseña en el llavero del sistema. Sin terminal no pregunta nunca y nombra la opción o la variable que
  falta. Una contraseña de aplicación que Himalaya ya guarda en el llavero se usa cuando `mail` no tiene ninguna. Los
  pasos de cada proveedor están en
  [Preparar el buzón](https://github.com/WireCatLabs/mail-cli/blob/main/docs/providers.md). Outlook y Microsoft 365 solo
  aceptan OAuth, así que `session start` los rechaza por ahora.
- **`session status`, `session end` y `session list` gestionan el inicio de sesión.** `session status --check` entra en
  el servidor para comprobar que la contraseña sigue funcionando; `session end` olvida la contraseña y conserva el correo
  sincronizado; `session list` no necesita perfil y muestra los perfiles de este ordenador.
- **`account check` y `folders list`** inician sesión y muestran lo que admite el servidor, y las carpetas con su función
  y su número de mensajes.
- **`sync` lee el correo nuevo en el almacén compartido y omite lo que ya está.** Lee INBOX y Sent, salvo que `--folder`
  o el perfil nombren otras carpetas, empezando por lo más reciente, desde `--since-time` (por defecto, los últimos
  30 días). Una fecha sola empieza a medianoche local, y la respuesta indica la zona horaria y la ventana en UTC.
  `--limit` limita los mensajes nuevos de una ejecución y `--rescan` vuelve a listar toda la ventana. Guarda el texto y
  las cabeceras, no los adjuntos.
- **Un buzón grande se sincroniza en varias ejecuciones.** `sync` gasta un presupuesto de peticiones calculado según su
  plazo (15 minutos en un terminal, 45 segundos por MCP; `--timeout` y `--max-pages` lo cambian), guarda tras cada parte
  y responde `state: partial` con el comando para continuar. `mail <profile> status` muestra cuánto lleva, también
  mientras se sincroniza. Si quedaron mensajes sin leer o no se comprobaron las eliminaciones, la respuesta lo indica en
  `meta.issues`.
- **`sync` resiste un servidor inestable.** Una conexión caída se reabre tras una breve espera y la ejecución continúa;
  un mensaje al que el servidor no puede responder ahora se pide de nuevo al final de la ejecución y se deja para la
  siguiente. En un servidor sin identificadores de mensaje, como Yandex, cada mensaje nuevo se descarga una vez y el
  correo ya guardado no se vuelve a leer.
- **Los agentes de IA usan `mail` mediante MCP y una skill.** `mail <profile> mcp serve` ofrece al agente los comandos
  del perfil por stdio, o por HTTP tras tu propio túnel con `--http`; los permisos del perfil deciden qué se ejecuta y
  `--permission` solo los restringe más. `mail skill install` instala las instrucciones de la herramienta para Claude
  Code, Codex, Gemini CLI y OpenClaw, y para Hermes con `--for hermes`.
- **La contraseña de aplicación pasa a un archivo privado cuando falla el llavero, y nunca se pregunta por ello.**
  `session start` guarda la contraseña en `credentials.json` (modo 600) en la carpeta de configuración, lo avisa una vez
  por stderr y responde `credential_storage`. `--credential-storage file` elige el archivo directamente, no recomendado.
  `session status` puede responder `password_from: "file"`.
- **Una ejecución con carpetas movidas nunca elimina del llavero del sistema la contraseña de aplicación del
  propietario.** Esa ejecución lee la contraseña del propietario pero nunca la sustituye ni la elimina, y guarda una
  nueva en una entrada temporal. `session end` sobre la contraseña del propietario no elimina nada y responde
  `kept: "owners-sign-in"`.
- **`wcat mail` ejecuta la herramienta, y `wcat --help` la lista.** El paquete instala `wcat-mail` junto a `mail`, y
  `wcat-mail --wcat-describe` imprime para `wcat` el nombre, la versión y la descripción de la herramienta.
- **`doctor --online` indica si hay publicada una versión más reciente.** No hace ninguna llamada al servidor de correo.
- **Los comandos que comparten todas las herramientas de WireCat:** `doctor`, `commands`, `config`, `skill`, `runs` y
  `upgrade`.
