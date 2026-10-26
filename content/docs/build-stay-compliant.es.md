---
title: "Cumplir los estándares y mantenerse al día"
description: "El manual de estándares, las comprobaciones que lo hacen cumplir y lo que una versión de cli-core, rompa algo o no, pide a tu herramienta."
---

Tu herramienta funciona hoy. Esta página muestra cómo mantenerla funcionando mientras cambian cli-core y cli-base: dónde
están las reglas, qué comprobaciones las demuestran y qué hacer cuando una versión cambia algo que usa tu herramienta.

## El manual

Las reglas que sigue cada herramienta de WireCat están en el
[manual de estándares](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md). Viene dentro de `@wirecat/cli-base`, así que tu
herramienta lo tiene en `node_modules/@wirecat/cli-base/docs/standards/README.md`, en la misma versión que las
comprobaciones que ejecuta. Empieza por la [lista para un CLI nuevo](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/new-cli.md): cada paso nombra la
comprobación que lo demuestra.

Las páginas que una herramienta sobre el almacén compartido lee primero:

- [Modelo de datos](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md): entidades, registros de origen, `external_id`, nombres de campos, vínculos;
- [Almacén](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md): áreas del almacén, migraciones, nada de SQL desde una herramienta;
- [Arquitectura](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/architecture.md): capas y qué va en cada paquete;
- [Seguridad](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md) y [Cuentas](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/accounts.md): secretos y el perfil explícito.

## Las comprobaciones

- **`cli-dev lint`** (de cli-base) lee los comandos que imprime tu herramienta y comprueba nombres, opciones, ayuda y
  reglas de salida. Las diferencias conocidas se anotan una vez en `lint/baseline/`; esa lista solo se reduce, y se
  permiten como mucho diez excepciones.
- **`cli-dev audit`** compara tus comandos con las otras herramientas: los comandos raíz obligatorios y el mismo
  contrato para la misma ruta de comando.
- **La configuración de análisis compartida** (Biome con los complementos de WireCat) comprueba tu código: nada de
  importaciones profundas en el interior de cli-core, nada de shell construido con cadenas.
- Una regla que ninguna máquina puede comprobar dice «review only» en el manual. Léela antes de cambiar esa parte.

## Versiones y cambios que rompen

cli-core y cli-base salen cuando un cambio está listo, y una versión puede romper a quien la usa
([WC-REL-8](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/releases.md#wc-rel-8--any-package-may-release-at-any-time)). Antes de la versión 1.0.0, una versión
menor puede romper a quien la usa, y el registro de cambios de cli-core dice cómo bajo «Changed — may break callers».

Cuando sale un cli-core nuevo:

1. Lee su sección del registro de cambios, primero la parte que rompe.
2. Sube cli-core en tu herramienta el mismo día que las demás herramientas, para que todas abran el almacén compartido
   con el mismo esquema.
3. Ejecuta tus pruebas y `cli-dev lint`, y publica.

El almacén compartido solo avanza. Un cli-core más nuevo puede migrar el archivo; una compilación antigua entonces se
niega a abrirlo y pide actualizar, en lugar de leerlo mal
([WC-STORE-10](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md#wc-store-10--an-older-build-refuses-a-store-it-cannot-read-and-says-to-upgrade)).
Por eso una herramienta que se queda en un cli-core antiguo puede dejar de funcionar cuando el propietario actualiza
otra herramienta.

Una herramienta creada con cli-template recibe también los cambios posteriores de la plantilla con
`npx @wirecat/cli-template upgrade`: consulta
[Recibe las mejoras de la plantilla](./build-create-cli.md#recibe-las-mejoras-de-la-plantilla).

## Próximamente

- **Una comprobación del código para el acceso al almacén**, para que una herramienta que importa directamente un
  controlador de SQLite no pase el análisis.

## Qué se rompe si lo omites

Una herramienta que se salta una actualización lee un almacén que ya no entiende y se niega a arrancar. Una herramienta
que desactiva una regla de análisis se aleja de las demás, y los agentes que aprendieron los comandos de una herramienta
se equivocan en la tuya.

Volver al inicio: [Conceptos en cinco minutos](./build-concepts.md).
