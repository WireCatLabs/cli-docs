---
title: "Próximas mejoras"
---

Aquí está lo que se planea para `pbx` y aún no está hecho. Léelo antes de montar un apaño para una función que falta:
quizá ya esté en camino. El orden puede cambiar y no hay fechas. Para proponer algo, abre una
[issue en GitHub](https://github.com/WireCatLabs/asterisk-cli/issues).

<a id="what-works-today"></a>

## Qué funciona hoy

`pbx` lee los registros de llamadas de una centralita Asterisk desde `Master.csv`, o desde una tabla de CDR (el
registro de llamadas) de MySQL, MariaDB o PostgreSQL. Lee la base de datos en una sesión de solo lectura. Si la base
de datos solo escucha en la centralita, `pbx` llega a ella por el acceso SSH de la centralita. Lee los archivos desde
este ordenador, una carpeta montada o la centralita por SFTP (transferencia segura de archivos por SSH) con la
clave del servidor fijada.

`pbx` guarda cada llamada en el almacén local de WireCat. Cada llamada tiene a quien llamó y a los empleados que la
hicieron o la contestaron. `pbx` enlaza la llamada con su grabación y convierte las grabaciones en texto en tu
ordenador. Si lo activas para un perfil, el texto lo hace OpenAI. Un perfil es el nombre que das a la conexión
con la centralita.

Tú y tu agente contáis las llamadas, las buscáis por palabras y por significado y las etiquetáis. También listáis,
leéis y exportáis las llamadas sin red, desde la línea de comandos o por MCP (la forma en que las aplicaciones
conectan herramientas). Consulta
[instala y conecta](./installation.md).

<a id="later"></a>

## Más adelante

- Encontrar llamadas perdidas y llamadas en una dirección con un filtro en `meetings list`.
- Leer el registro CEL de Asterisk (el registro de eventos de canal), donde las transferencias y las colas son exactas.
- Abrir una llamada en WireCat Desktop desde el enlace que imprime `meetings show`, cuando Desktop admita enlaces a
  llamadas.

<a id="what-it-will-not-do"></a>

## Qué no hará

`pbx` sigue siendo de solo lectura frente a la centralita. No cambiará sus ajustes, no hará ni colgará llamadas y no
borrará ninguna grabación. Una grabación solo se envía a un servicio en la nube si activas esa opción para el perfil.

Qué cambió en cada versión publicada está en el [historial de cambios](./changelog.md).
