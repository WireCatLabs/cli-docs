---
title: "Datos de negocio"
---

Memo guarda la parte económica de un negocio pequeño junto a tus mensajes y notas: lo que vendes o compras, los contratos
y las suscripciones que hay detrás, tus cuentas bancarias y lo que se movió en ellas. Las facturas, los pagos y los pedidos están en
[Uso](./usage.md#keep-track-of-money), y las negociaciones y los leads en [Uso](./usage.md#track-deals-and-leads).

Cada lista de esta página se filtra con palabras como `status:active`, nunca con opciones. Las opciones de cada comando están en la
[referencia de comandos](./commands.md).

## Importes y monedas

Un importe es un decimal con, como mucho, tantos decimales como tiene su moneda: `50000.00` RUB, `1200` JPY (ninguno),
`1.250` BHD (tres). Memo lo guarda como un número entero de la unidad más pequeña de la moneda, así que el redondeo no
pierde nada. Rechaza un importe con más decimales o una moneda que no conoce. Nunca convierte una moneda en otra: cada
total va por moneda.

Lo pagado de una factura es neto: sus pagos confirmados menos sus devoluciones confirmadas. Una devolución es un pago en el
sentido contrario, y nunca supera el pago que devuelve:

```sh
memo payments add 5000.00 RUB --kind out --organization organization:3 --refund-of payment:9
memo invoices show invoice:4
```

Una factura devuelta por completo vuelve a estar `issued`, y se sigue debiendo, hasta que la anulas.

## Productos

Un producto es un bien o un servicio que vendes o compras, con su precio. Cualquiera lo escribe al instante, sin revisión.

```sh
memo products add 'Bike rental, month' 10000.00 RUB --kind service --unit month
memo products list kind:service
memo orders lines add order:3 12 --product product:4
```

Una línea creada a partir de un producto copia su nombre y su precio, así que un cambio de precio posterior deja la línea como estaba.

## Contratos

Un contrato guarda sus fechas, si se renueva y los días de preaviso que necesita. `contracts show` da el último día
para avisar.

```sh
memo contracts add 'Rental agreement' --kind service --start-date 2026-11-01 --end-date 2027-10-31 --auto-renew on --notice-days 30 --amount 120000.00 --currency RUB
memo contracts list expires:2026-12-31
```

Uno que añade tu agente con un importe espera tu decisión en `memo review kind:contract`.

## Suscripciones

Una suscripción es algo que facturas o pagas una y otra vez: quién lo suministra, quién paga, con qué frecuencia y cada precio
que tuvo. Un precio nuevo es una fila propia desde el día en que empieza, nunca un cambio del anterior.

```sh
memo subscriptions add Hosting 990.00 RUB --kind payable --supplier organization:3 --period 1-month --start-date 2026-11-01
memo subscriptions prices add subscription:5 1190.00 RUB --start-date 2027-01-01
memo subscriptions show subscription:5
```

Las suscripciones y los precios de tu agente esperan tu decisión en `memo review`.

## Carteras y movimientos

Una cartera es una cuenta bancaria, una tarjeta o efectivo, en una moneda. Un movimiento es lo que el banco dice que se movió. Un pago
es lo que ese movimiento salda. Solo se unen cuando los vinculas.

```sh
memo wallets add 'Main card' RUB --kind card --institution 'Bank One'
memo wallets update wallet:2 --opening-balance 15000.00 --opening-date 2026-01-01
memo transactions add wallet:2 500.00 --kind out --occurred-time 2026-11-14 --description 'Coffee shop'
memo transactions update transaction:12 --payment payment:9
memo transactions splits add transaction:12 300.00 Rent --project HRB
memo wallets show wallet:2
```

`wallets show` suma el saldo inicial y los movimientos confirmados y contabilizados. Lo pendiente o propuesto se
muestra junto al saldo, nunca dentro de él. Solo tú fijas el saldo inicial: por MCP, `wallets update` se rechaza salvo que
lo permitas.

## Traer datos de otro sistema

Un CRM, un programa de contabilidad o una exportación del banco entra como un archivo de registros (JSON, o JSONL con una línea de
cabecera). Compruébalo primero y luego impórtalo:

```sh
memo records check erp.jsonl --account example-erp:demo
memo records import erp.jsonl --account example-erp:demo
memo review list kind:invoice,payment,order,contract
```

También sirve una hoja de cálculo, un tipo por hoja. `memo records templates list` lista los tipos y sus columnas.
`memo records templates show invoice --locale ru` escribe la fila de encabezados para rellenar con `;` entre celdas,
como espera Excel en ruso o en español, y `--format json` escribe en su lugar un sobre de ejemplo. La hoja se comprueba
y se importa con su tipo:

```sh
memo records templates show invoice --locale ru > invoices.csv
memo records check invoices.csv --type invoice --account sheet:rentals
memo records import invoices.csv --type invoice --account sheet:rentals
```

Un rol toma el id externo del destino (`wallet` = `W-1`), o `organization:C-1` donde puede ser una persona o una
organización. Una fila que repite el `external_id` de una factura le añade una línea más. `10 000,50` y `09.11.2026` se
leen como los escribe Excel. Cada rechazo nombra la línea y la columna de la hoja.

El mismo archivo dos veces no cambia nada. Las personas y organizaciones que nombra se emparejan por un correo, un teléfono u
otro identificador exacto, o se crean. Nunca por el nombre. Sus facturas, pagos, pedidos, contratos con importe, suscripciones y
movimientos esperan tu decisión en `memo review`.

Para ver de dónde salió una entrada, ábrela. `memo show` y el `show` de cada entrada listan sus `sources`: los registros del
archivo del que se creó, y los registros que la nombran, como una propuesta hecha para una negociación:

```sh
memo show contract:1 deal:1
memo deals show deal:1 --json
memo records show custom:quote:Q-7 --account example-erp:demo
```

## Encontrarlo de nuevo

`memo search all` encuentra facturas, pagos, pedidos, contratos, suscripciones, productos y carteras por las palabras de
sus números y nombres, junto a tus mensajes, correo y notas. `--only business` busca solo en ellos:

```sh
memo search all 'Rental agreement' --only business
```

Los movimientos bancarios no entran en la búsqueda: son demasiados. `memo transactions list` los filtra por cartera, estado,
categoría o proyecto. Una palabra de búsqueda con un operador, como `budg*`, deja fuera los datos de negocio y dice por qué.

Por MCP, la búsqueda de un agente lee los datos de negocio salvo que lo prohíbas: pon la clave `business.list` de
[`permissions`](./configuration.md#permissions) en `deny`, y `search all` los deja fuera y lo indica.
