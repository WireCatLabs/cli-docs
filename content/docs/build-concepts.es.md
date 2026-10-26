---
title: "Conceptos en cinco minutos"
description: "Entidades, registros de origen, external_id, vínculos y la lista de revisión: el modelo que sigue toda herramienta sobre el almacén compartido de WireCat."
---

Estás creando una herramienta de línea de comandos, o una integración para un agente, que lee o escribe el almacén
compartido de WireCat. Esta página te da el modelo en cinco minutos: qué tipos de registro existen, cómo se conectan y
qué reglas evitan que tu herramienta rompa las demás. Las páginas siguientes muestran cómo añadir una fuente, guardar
tus propios datos, iniciar sesión y cumplir los estándares.

## El almacén compartido

Cada herramienta de WireCat guarda sus datos en un único archivo SQLite en el ordenador del propietario, `wirecat.db`.
El paquete `@wirecat/cli-core` es dueño de ese archivo: sus tablas, sus migraciones y el código que las lee y escribe.
Una herramienta llega al archivo solo a través de cli-core, nunca con su propio SQL
([reglas del almacén](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md)).

## Entidades y registros de origen

- Una **entidad** es la cosa real a la que se refiere el propietario: una persona, un evento, un documento. No guarda
  ningún id de proveedor.
- Un **registro de origen** es lo que una fuente dice de una entidad: un usuario de Telegram, una dirección de correo,
  una reunión de Zoom, una entrada de calendario, un archivo de Drive. Guarda la cuenta de la que vino y el id propio
  del proveedor.

Una entidad reúne registros de varias fuentes. La misma reunión en Zoom y en dos calendarios es un solo evento. La misma
persona en Telegram y en el correo es una sola persona. Tu herramienta escribe registros de origen; cli-core los vincula
a las entidades.

## `external_id`

El id que un proveedor da a un registro va en `external_id`, único dentro de su cuenta. Un segundo id que el proveedor
también usa tiene una columna propia con nombre, como `ical_uid`. Nunca una columna con el nombre del proveedor, y nunca
solo dentro de `metadata` ([WC-DATA-3](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-3--a-providers-id-goes-in-external_id)).

## Vínculos

Un vínculo de un registro de origen a su entidad guarda cómo se hizo, qué seguridad tiene, quién lo hizo y cuándo. Cada
cambio queda registrado, así que un vínculo equivocado se puede deshacer. Tres reglas valen en todas partes:

1. Un vínculo que hizo el propietario nunca se sustituye por uno automático.
2. Dos candidatos igual de buenos no producen ningún vínculo.
3. Un título igual o un horario que se solapa nunca vinculan por sí solos dos registros.

Las reglas son [WC-DATA-6](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-6--every-link-records-how-it-was-made-the-owners-link-wins-ambiguity-makes-no-link).
Cómo ve los vínculos un lector está en [Cómo se vincula todo](./how-things-are-linked.md).

## Entidades compartidas y tus propias tablas

Un registro que puede necesitar más de una herramienta es una **entidad compartida**: su tabla vive en cli-core. Una
tabla que solo necesita tu herramienta, como un punto de control de sincronización o una memoria caché, vive en el
archivo SQLite propio de tu herramienta, y ninguna otra la lee
([WC-DATA-1](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-1--a-record-more-than-one-tool-needs-is-a-core-entity-in-cli-core-a-clis-own-tables-stay-private)).
Consulta [Guardar tus propios datos](./build-own-data.md).

## Más en el almacén

- **El registro de proveedores.** Tu herramienta anota su proveedor (nombre, tipo, alias, comando) en el almacén cada
  vez que se ejecuta, así todas las demás conocen la nueva fuente sin una versión de cli-core. Las filas de un
  proveedor que ninguna herramienta ha registrado se omiten y se informan, nunca se buscan como mensajes. Consulta
  [Añadir una fuente](./build-add-source.md).
- **La lista de revisión.** Los pares que las herramientas no pueden distinguir, como dos eventos para una reunión,
  esperan ahí a que el propietario decida.
- **Las entradas de calendario y los archivos** son registros de origen de eventos y documentos, y cada identidad puede
  tener una dirección de correo, para que una dirección una a una persona.
## Qué se rompe si lo omites

Un id de proveedor guardado solo en `metadata` no se puede actualizar por clave, así que cada sincronización crea un
duplicado. Un vínculo hecho solo por el título une dos reuniones distintas, y el propietario ve la grabación equivocada.
El SQL contra el archivo compartido se rompe con la siguiente migración de cli-core.

Siguiente: [Añadir una fuente](./build-add-source.md).
