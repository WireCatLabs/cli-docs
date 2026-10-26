---
title: "Seguridad"
---

Lee esta página antes de vincular `wa` a tu cuenta. Sabrás qué datos guarda en tu ordenador y qué riesgos debes considerar.

La [página de seguridad compartida](https://wirecat.dev/en/docs/security) explica lo común a las herramientas WireCat: el almacén local, los controles de envío, los permisos del agente por MCP, el texto de otras personas y cómo comunicar una vulnerabilidad. Aquí se describen las particularidades de WhatsApp.

## Qué guarda `wa`

- **Las claves del dispositivo vinculado**, en `~/.local/share/whatsapp-cli/profiles/<profile>/private.db` (en Windows, `%LOCALAPPDATA%\whatsapp-cli\Data\profiles\<profile>\private.db`). Quien copie el archivo podrá leer y enviar como tú hasta que desconectes el dispositivo desde Ajustes → Dispositivos vinculados en el teléfono. Solo tu usuario del sistema puede leer el archivo.
- **Tus chats y mensajes**, en el almacén WireCat compartido con tg y max.
- **Los ajustes**, en `~/.config/whatsapp-cli/`, sin secretos.

## Qué puede ocurrir

- **WhatsApp puede bloquear la cuenta.** Sus condiciones prohíben clientes no oficiales. Otros proyectos informan de bloqueos tras envíos masivos, mensajes a desconocidos o publicaciones de estados. `wa` no realiza esas acciones sin que se lo pidas.
- **Pérdida del portátil.** Desconecta el dispositivo desde el teléfono; las claves del portátil dejarán de funcionar.
