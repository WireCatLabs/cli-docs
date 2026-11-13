---
title: "Próximas mejoras"
---

Aquí está lo que se planea para `asterisk` y aún no está hecho. Léelo antes de montar un apaño para una función que
falta: quizá ya esté en camino. El orden puede cambiar y no hay fechas. Para proponer algo, abre una
[issue en GitHub](https://github.com/WireCatLabs/asterisk-cli/issues).

## Qué funciona hoy

`asterisk` lee los registros de llamadas de una centralita Asterisk desde `Master.csv`, o desde una tabla de CDR de
MySQL, MariaDB o PostgreSQL en una sesión de solo lectura. Guarda cada llamada en el almacén local de WireCat con sus
dos personas, la enlaza con su grabación y convierte las grabaciones en texto en tu ordenador. Tú y tu agente listáis,
leéis y exportáis las llamadas sin red, desde la línea de comandos o por MCP. Consulta
[conecta tu Asterisk](./asterisk.md).

## Después

- **Leer la centralita por SFTP.** `asterisk` lee `Master.csv` y las grabaciones directamente de la centralita por
  SFTP, con un usuario de solo lectura, así que ya no copias los archivos ni montas las carpetas tú mismo.

## Qué no hará

`asterisk` sigue siendo de solo lectura frente a la centralita. No cambiará sus ajustes, no hará ni colgará llamadas y
no borrará ninguna grabación.

Qué cambió en cada versión publicada está en el [historial de cambios](./changelog.md).
