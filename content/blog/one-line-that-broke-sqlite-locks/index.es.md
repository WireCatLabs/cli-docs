---
title: Una línea quitó todos los bloqueos de SQLite y rompió una base de 6 GB
description: Modo WAL, busy_timeout, sin caídas ni errores de disco, y aun así "database disk image is malformed". La causa fue un writeFileSync antes de cada apertura. Cómo lo encontré con /proc/locks, lo reproduje en un archivo vacío y por qué la recuperación decía que no se había perdido nada.
date: 2026-11-09
tags: [cli]
cover: ./cover.jpg
coverAlt: "Un candado de latón abierto con el cuerpo de vidrio ahumado, dentro unas láminas de vidrio agrietadas y desplazadas, un alfiler de costura que apenas roza su lado, junto a un frasco vacío y otro que se deshace en polvo"
author: viacheslav-ptsarev
draft: false
---

Pues se me rompió la base de datos. El almacén común de WireCat es un archivo SQLite en el que escriben a la vez varios CLI (Telegram, correo, memo, etc.), y el mío pesa 6 GB. Modo WAL, `busy_timeout` de 5 segundos, la misma versión de SQLite en todos los CLI, ni caídas ni errores de disco en el journal, y aun así en algún momento la sincronización del correo falló con "database disk image is malformed", y detrás cayó todo lo demás.

Lo rompió una línea que solo tenía que asegurarse de que el archivo existe:

```js
writeFileSync(file, "", { flag: "a", mode: 0o600 })
```

Se ejecutaba antes de cada apertura del almacén para escritura. Añadir cero bytes al final de un archivo suena de lo más inofensivo, pero en Linux bastó para quitar todos los bloqueos de SQLite a un proceso que ya tenía el almacén abierto. Lo encontré con `/proc/locks` y esa misma noche lo reproduje en un archivo vacío. Y después la recuperación dijo 2 veces de 3 que no se había perdido nada, cuando sí se había perdido.

## Cómo se notó

La primera sincronización del correo falló hacia las 17:10 UTC, y desde ese momento el temporizador de memo falló en cada ejecución, más de 60 veces hasta la noche. La búsqueda de mensajes fallaba en cada consulta. Nadie se enteró, porque un temporizador que falla escribe una línea en stderr, y solo se ve en la siguiente ejecución a mano. Mientras tanto `memo doctor` decía que el almacén estaba bien, no comprobaba ni `quick_check` ni los índices de búsqueda.

Lo encontró un agente que por la noche revisaba la búsqueda y vio `fts5: corruption`. Pasé `quick_check` sobre una copia y salieron 687 líneas de problemas en unas 36 tablas, no solo en índices sino también en las tablas de origen. Había páginas a las que apuntan dos tablas a la vez, índices con un número de entradas equivocado, páginas que nadie usa. No parece un sector dañado, más bien dos procesos escribiendo el archivo sin verse el uno al otro.

Paré los temporizadores y fui a ver quién tenía el archivo abierto. Los más sospechosos eran dos procesos `wa serve` de larga duración (el servidor del CLI de WhatsApp) que llevaban en marcha desde la madrugada. Esto es lo que tenían en `/proc/locks` (los números de proceso e inode aquí son inventados):

```
POSIX  ADVISORY  READ  4101 103:05:7777 128 128
POSIX  ADVISORY  READ  4102 103:05:7777 128 128
```

Es un bloqueo sobre un byte del archivo `-shm`, con el que SQLite sabe que un proceso sigue vivo (el dead-man lock). Y sobre el archivo de la base en sí no tenían ningún bloqueo. Una conexión normal en modo WAL tiene durante toda su vida un bloqueo compartido sobre una zona de servicio del archivo de la base, bytes alrededor de 1073741826, muy lejos de los datos, y así los demás procesos ven que alguien está usando la base. Lo comprobé luego en un archivo limpio. Estos 2 procesos no tenían ese bloqueo.

Y en `/proc/<pid>/fd` de los dos aparecía `wirecat.db-wal (deleted)` y `wirecat.db-shm (deleted)`. O sea, el WAL ya se había borrado del disco, y estos procesos seguían escribiendo en él, la última vez hacia las 21:20, 4 horas después del primer error. Además cada uno tenía el almacén abierto dos veces, y justo esa segunda apertura era lo que lo rompía todo.

## Una línea y los bloqueos POSIX

En Unix SQLite guarda sus bloqueos con POSIX advisory locks (`fcntl`). Tienen una propiedad muy fea - `close()` de cualquier descriptor de un archivo quita todos los bloqueos POSIX que el proceso tiene sobre ese archivo, no solo los que se tomaron con ese descriptor. Y el proceso no tiene forma de saber que sus bloqueos han desaparecido. La documentación de SQLite tiene un apartado sobre esto en [How To Corrupt An SQLite Database File](https://www.sqlite.org/howtocorrupt.html#_posix_advisory_locks_canceled_by_a_separate_thread_doing_close_). La propia librería lo esquiva, el problema solo aparece cuando algo en el mismo proceso abre el archivo de la base por fuera de SQLite.

Y `writeFileSync(file, "", { flag: "a" })` hace exactamente eso, abre el archivo, añade cero bytes y lo cierra. Por sí solo no rompe nada. Pero `wa serve` abría el almacén dos veces, la conexión principal y otra aparte para el registro de acciones del agente. La segunda apertura ejecutaba esta línea, y la primera conexión se quedaba sin bloqueos sin enterarse.

Luego la cadena va así:

1. Otro proceso cierra su última conexión. No ve ningún bloqueo de `wa serve`, así que se cree el último, hace checkpoint y borra `-wal` y `-shm`.
2. `wa serve` sigue escribiendo en su WAL, que ya está borrado. Para él no ha cambiado nada.
3. Los demás procesos mientras tanto crean un WAL nuevo y escriben en el archivo real.
4. Cuando `wa serve` junta suficientes páginas, hace su propio checkpoint y escribe páginas viejas encima de un archivo que los demás ya han cambiado hace rato.

Así salen páginas que pertenecen a dos tablas. Y probablemente por eso todo parecía normal durante horas - el almacén no se rompe cuando se pierden los bloqueos, se rompe cuando se hace checkpoint del WAL caducado, y para eso hacen falta unas 1000 páginas escritas o un checkpoint explícito.

Lo reproduje esa misma noche, sin cli-core, con tablas sintéticas. Resumido queda así (el archivo completo: [T1-minimal.mjs](https://github.com/WireCatLabs/cli-testing/blob/main/performance/store/integrity/T1-minimal.mjs)):

```js
const db = new DatabaseSync(path)                       // el proceso de larga duración
db.exec("PRAGMA journal_mode=WAL; CREATE TABLE a(...); CREATE TABLE b(...); INSERT INTO a ...")
writeFileSync(path, "", { flag: "a" })                  // la línea: ya no hay bloqueos sobre la base
execFileSync("sqlite3", [path, "INSERT INTO b ..."])    // el close de otro borra -wal y -shm
db.exec("INSERT INTO a ...")                            // escribimos en un WAL borrado
other("3000 inserciones en b")                          // otro proceso hace crecer el archivo real
for (let i = 0; i < 1500; i++) db.exec("INSERT INTO a ...")
db.exec("PRAGMA wal_checkpoint(TRUNCATE)")              // páginas viejas sobre el archivo vivo
```

En la primera prueba, antes del `writeFileSync`, en `/proc/locks` el proceso tiene el bloqueo sobre la base y el byte en `-shm`, y después solo queda el byte. Cuando `sqlite3` cierra, ya no hay `-wal` ni `-shm` en el disco, y el descriptor del WAL del primer proceso está marcado `(deleted)`. Cuando este hace checkpoint, una conexión nueva recibe el mismo "database disk image is malformed" que la sincronización del correo, y `quick_check` dice `Tree 3 page 3 cell 0: invalid page number 2904`.

La corrección también es, en el fondo, una línea: [cli-core #2578](https://github.com/WireCatLabs/cli-core/pull/2578). Si el archivo no existe, se crea con el flag `wx`, y si existe, solo se comprueba el permiso de escritura con `accessSync`, que no abre ningún descriptor. Salió en cli-core 0.599.0, y ese mismo día tg, max, wa, memo y mail pasaron a esa versión o a la siguiente. Con la corrección va un test que abre el almacén, toma `BEGIN IMMEDIATE`, cuenta las líneas de su proceso en `/proc/locks`, abre el almacén una segunda vez y comprueba que el número no cambia. Con el código viejo falla. Después los procesos empezaron a pasar a una sola conexión, para que aunque esto vuelva no haya segunda apertura.

## Quién borró el WAL

Yo pensaba que cualquier proceso que cierra el último podía borrar el WAL. En las notas que iba tomando mientras lo investigaba hasta escribí que `node:sqlite` también lo borra después de un `wal_checkpoint(TRUNCATE)` explícito. Y en el informe del incidente taché "distintas versiones de SQLite" de los sospechosos: todos los CLI corren en Node 24.19.0 con SQLite 3.53.3, y el `sqlite3` del sistema, 3.46.1, solo se usa en la copia de seguridad semanal.

Luego monté un banco de pruebas en cli-testing para romper el almacén a propósito, con datos sintéticos. Como casi todo el código de aquí, lo escribieron y lo ejecutaron agentes, y yo ponía las tareas y decidía qué hacer con los resultados. Las primeras ejecuciones con el cli-core viejo simplemente no se rompían. Una razón la encontré rápido - mi `serve` de prueba escribía y hacía checkpoint a menudo, y SQLite se salta el checkpoint al cerrar (y el borrado con él) si alguien escribió en el archivo desde la última lectura del proceso que cierra. El `wa serve` real escribía poco. Pero incluso con eso, sin `sqlite3` en el escenario el almacén seguía entero.

Así que probé cada "cerrador" por separado ([closers.mjs](https://github.com/WireCatLabs/cli-testing/blob/main/performance/store/integrity/closers.mjs)). Un proceso mantiene el almacén abierto, otro lo abre, hace una cosa y cierra. Cada variante la pasé 2 veces, una con el primer proceso sin bloqueos y otra con sus bloqueos intactos.

| Quién cierra | El primero perdió sus bloqueos | El primero mantuvo sus bloqueos |
| --- | --- | --- |
| Node (SQLite 3.53.3): solo open/close, SELECT, INSERT, INSERT y checkpoint PASSIVE o TRUNCATE | WAL sigue ahí | WAL sigue ahí |
| Bun (SQLite 3.53.0): INSERT | WAL sigue ahí | WAL sigue ahí |
| Shell `sqlite3` 3.46.1: SELECT o INSERT | WAL y shm borrados | WAL sigue ahí |

O sea, en mi máquina solo el shell viejo borró el WAL, incluso con un simple SELECT, y solo al lado de un proceso que ya había perdido sus bloqueos. Mi propia nota sobre Node no se confirmó en el banco. Lo que significa que el bug necesita un segundo actor con un SQLite más viejo, y seguramente por eso estuvo escondido tanto tiempo, en mis pruebas los procesos Node de los CLI nunca se borraron el WAL entre sí.

Por qué 3.53 no lo hace y 3.46.1 sí, no llegué a averiguarlo. La misma página de SQLite dice que desde la 3.51.0 hay defensas adicionales justo contra estos bloqueos quitados por `close()`, para WAL y varios procesos. Parece la explicación, pero no lo comprobé en el código. También es una deducción, no un hecho, que ese día abriera mi almacén el shell u otro programa con un SQLite viejo. Nada registró qué programa abrió el archivo. Y cuándo se borró el WAL lo sé solo más o menos.

En el banco, el escenario T1 (un `serve` de larga duración abre el almacén una segunda vez, al lado 3 escritores cortos y `sqlite3`, 60 segundos) rompió el almacén en 3 de 3 ejecuciones con cli-core 0.593.0, el primer error de un escritor a los 5-8 segundos. Con cli-core 0.608.0 el mismo escenario pasó 3 de 3, con `serve` abriendo el almacén una segunda vez 17-18 veces por ejecución sin que pasara nada.

## La recuperación dijo que no se había perdido nada

Restauré el almacén con `store recover run`, que un agente hizo a petición mía justo después del incidente. Copia todas las filas legibles con el `.recover` del shell `sqlite3`, vuelve a llenar los índices de búsqueda y de vectores, comprueba la copia y cambia el archivo. El archivo salió entero. Le faltaban al menos 31 correos, se encontraron por sus ids, y seguían en el servidor de correo.

Luego pasé la misma recuperación por almacenes que había roto el banco y lo comparé con los registros de los escritores, donde está apuntado cada lote confirmado.

| Almacén roto | Tiempo de recuperación | El informe dijo perdido | Mensajes confirmados en la ejecución / faltan después |
| --- | ---: | --- | --- |
| 1 | 4.0 s | nada | 970 / 50 |
| 2 | 4.0 s | 97 mensajes | 1 490 / 250 |
| 3 | 4.7 s | nada | 910 / 50 |

Cada vez el archivo recuperado pasaba `quick_check`, `integrity_check` y las 25 comprobaciones de FTS5, y aun así le faltaban mensajes confirmados, y 2 veces de 3 el informe decía que no se había perdido nada. La recuperación contaba filas antes y después de su propia copia, y las filas que el checkpoint caducado había machacado antes ya no estaban en el archivo dañado, no había nada que contar.

Luego pasé el banco 3 veces más, ya con escritores que escriben como los tg, mail y memo de verdad, y recuperé también esos 3 almacenes. En 1 ejecución de 3 todas las comprobaciones pasaron sobre el almacén tal cual, así que nadie habría lanzado una recuperación, y aun así faltaban 80 mensajes confirmados. Son las filas que `serve` escribió en el WAL que el close de otro había borrado, nunca llegaron al archivo de la base. En total, en las 6 recuperaciones (3 de la tabla y estas 3) se perdieron cada vez entre 50 y 300 mensajes confirmados (y en una ejecución además 40 notas), y ningún informe los nombró enteros: 5 veces no informó de ninguna pérdida, 1 vez 97 de 250.

El informe ya no miente así ([cli-core #2759](https://github.com/WireCatLabs/cli-core/pull/2759), salió en la 0.618.0). Antes de la copia compara cada índice del archivo dañado con su tabla. Una página caducada machaca la tabla pero los índices se quedan como estaban, y la diferencia muestra cuántas filas desaparecieron. Es una cota inferior, así que el informe dice "se perdieron al menos N" o "no se sabe cuántas se perdieron", y nunca "no se perdió nada". Y la cota queda bastante por debajo de la realidad, en el segundo almacén dice "al menos 200" donde faltan 241.

De paso empezó a devolver filas que `.recover` mete en una tabla aparte para filas sin dueño. En el segundo almacén esa tabla tenía 9 mensajes. Pero lo perdido no lo devuelve, en ese mismo almacén siguen faltando 241 de 250. Eso solo puede volver desde el origen. Por eso después de una recuperación los chats y las carpetas de correo se marcan como no descargados desde un día antes de la última comprobación profunda que pasó, y la siguiente sincronización normal los vuelve a bajar. En el banco lo comprobé en otros 3 almacenes y solo con mensajes, y la sincronización los bajó todos. El correo solo lo comprobé con un test, y con un mensajero real no lo probé. Lo que se perdió antes de esa fecha, y además las notas y todo lo que solo vivía en el almacén, no vuelve así.

Por cierto, la primera versión de ese recuento usaba `EXCEPT`, y SQLite 3.53 contó 144 filas perdidas en un índice dañado donde se habían perdido 50. Recorría el orden del índice, y un índice dañado no tiene orden. El shell 3.46 dio 50 con la misma consulta. Lo reescribimos con `GROUP BY`.

## Si tienes Node y SQLite en un mismo proceso

No abras el archivo de la base con nada que no sea SQLite mientras el proceso tenga una conexión. No solo `writeFileSync`, también `readFileSync`, `copyFileSync`, un hash del archivo, etc., cualquiera de ellos quita los bloqueos al cerrar. `statSync`, `existsSync` y `accessSync` no abren descriptor, esos se pueden usar. Para copiar una base viva está `backup()` en `node:sqlite` o `store backup`, y el `.backup` del shell `sqlite3` yo lo lanzaría sobre una copia, no sobre el archivo vivo, porque un shell viejo al lado de un proceso sin bloqueos es justo lo que borra el WAL.

Además, una conexión por proceso. Aunque alguien vuelva a meter una línea así, no habrá segunda apertura. De momento lo he comprobado solo en memo, y cualquier otra apertura del archivo con `fs` sigue quitando los bloqueos.

Tampoco una sincronización que falla debería seguir intentando escribir en silencio en un almacén roto. Mis temporizadores lo hicieron unas 5 horas, desde el primer error hasta que los paré. Ahora con el primer "malformed" aparece una marca de daño junto al almacén, y hasta que se recupere nadie lo abre para escribir. A un servidor que ya tiene una conexión abierta esto no lo para, la marca solo bloquea aperturas nuevas. Y `doctor --deep` revisa todo el archivo y recuerda la última vez que el almacén estaba entero.

Cuando intentaba entender qué se había perdido exactamente, resultó que las sincronizaciones correctas de correo y memo no dejan ningún registro, y la "última escritura limpia" hubo que reconstruirla por la hora de fin de los temporizadores. Ahora una escritura confirmada en el almacén deja un evento en el registro de la ejecución (tabla, tipo de cambio, número de filas, sin contenido). Con escrituras como las de los CLI reales cuesta un 0-3%, y en el peor caso, cuando cada transacción inserta una fila y nada más, entre un 8% con 2 000 transacciones y un 18% con 200.

Y yo no me fiaría a ciegas de un informe de recuperación, ni del mío. Después de cualquier daño, compara con el origen (el servidor de correo, el mensajero, una copia de seguridad).

El banco de pruebas ahora comprueba mucho más que este bug:

- 50 `kill -9` en medio de una transacción, 50 en medio de un checkpoint, migraciones matadas, etc. El cli-core actual lo aguantó todo.
- Lo único que lo rompió fueron otros programas que tocan los archivos del almacén por su cuenta, como un `-shm` borrado, un `-wal` cambiado o un cliente de sincronización que pone una copia vieja encima del archivo vivo.
- Así que yo no tendría el almacén en una carpeta sincronizada.
- Si SQLite deshacía ella misma una transacción por un error de entrada/salida, nuestro propio `ROLLBACK` fallaba con "cannot rollback - no transaction is active", y hacia fuera salía ese error en lugar del real. Eso también se corrigió en #2759.

## Lo que no medí

- Un corte de luz de verdad. El banco mata procesos, y la caché de páginas sobrevive a eso. Una prueba honesta necesita `dm-flakey`, y eso pide root.
- Un disco lleno de verdad. En su lugar hay un límite de tamaño de archivo por proceso, y SQLite lo reporta como error de entrada/salida.
- Ejecuciones largas. Los escenarios duraron de 1 a 2.5 minutos, la mayoría una vez por versión. Lo que pasó una vez podría haberse roto en una segunda.
- Mi almacén de 6 GB, ni ninguno de más de unos 130 MB. El del banco es pequeño a propósito, para que el checkpoint automático ocurra cada pocos segundos.
- Bun como runtime principal de los escritores.
- Los textos largos de correos en mi almacén. Sus páginas de continuación pudieron quedar machacadas, y no comprobé si se cortaron.
- Por qué SQLite 3.53 no borra el WAL donde 3.46.1 sí lo borra.

Todos los scripts y resultados están en [cli-testing](https://github.com/WireCatLabs/cli-testing/blob/main/performance/store/integrity/README.md), junto con una lista de [lo que puede volver a pasar](https://github.com/WireCatLabs/cli-testing/blob/main/performance/store/integrity/README.md#what-can-happen-again). Todo es sintético, `T1-minimal.mjs` y `closers.mjs` funcionan sin cli-core, solo hace falta el shell `sqlite3`. Si con otra versión de SQLite te sale distinto, escríbeme. Quiero saber quién más borra el WAL debajo de un proceso sin bloqueos.
