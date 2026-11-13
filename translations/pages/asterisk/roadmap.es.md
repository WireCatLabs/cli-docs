---
title: "Próximas mejoras"
---

Aquí está lo que se planea para `asterisk` y aún no está hecho. Léelo antes de montar un apaño para una función que
falta: quizá ya esté en camino. El orden puede cambiar y no hay fechas. Para proponer algo, abre una
[issue en GitHub](https://github.com/WireCatLabs/asterisk-cli/issues).

## Qué funciona hoy

`asterisk` lee los registros de llamadas de una centralita Asterisk desde `Master.csv`, o desde una tabla de CDR de
MySQL, MariaDB o PostgreSQL en una sesión de solo lectura. Lee los archivos desde este ordenador, una carpeta
montada o la centralita por SFTP con la clave del servidor fijada. Guarda cada llamada en el almacén local de WireCat
con sus dos personas, la enlaza con su grabación y convierte las grabaciones en texto en tu ordenador. Tú y tu agente listáis,
leéis y exportáis las llamadas sin red, desde la línea de comandos o por MCP. Consulta
[conecta tu Asterisk](./asterisk.md).

## Más adelante

- Encontrar las llamadas perdidas y las de un sentido con un filtro en `meetings list`.
- Estadísticas de llamadas: por extensión y por hora, y la parte de llamadas perdidas.
- Ver juntos los tramos de una llamada transferida, aunque cada uno siga siendo su propio registro.
- Leer el registro CEL de Asterisk, donde las transferencias y las colas son exactas.

## Qué no hará

`asterisk` sigue siendo de solo lectura frente a la centralita. No cambiará sus ajustes, no hará ni colgará llamadas y
no borrará ninguna grabación.

Qué cambió en cada versión publicada está en el [historial de cambios](./changelog.md).
