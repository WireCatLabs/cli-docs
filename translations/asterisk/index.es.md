---
title: "Asterisk"
---

`asterisk` lleva las llamadas de una centralita Asterisk a WireCat: para la terminal, para scripts y para agentes de
IA. Lee los registros de llamadas (CDR) de `Master.csv` o de la base de datos de CDR, enlaza cada llamada con su
grabación y las guarda en el almacén local de WireCat como reuniones. `meetings transcribe` convierte las grabaciones
en texto en este ordenador.

Solo lee: nunca cambia la centralita, sus ajustes ni una grabación. Tiene los comandos que comparten todas las CLI de
WireCat: `doctor`, `commands`, `config`, `skill`, `mcp`, `runs` y `upgrade`, además de `session`, `meetings`, `events`
y `models`.

Empieza por la [instalación](./installation.md), luego [conecta tu Asterisk](./asterisk.md) y [úsalo](./usage.md).
