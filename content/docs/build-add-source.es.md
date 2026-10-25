---
title: "Añadir una fuente"
description: "Llevar los registros de un proveedor nuevo al almacén compartido como registros de origen que cli-core puede vincular a personas, eventos y documentos."
---

Tienes un servicio, como un calendario, una aplicación de reuniones o un almacén de archivos, y quieres sus registros en
el almacén compartido de WireCat para que la búsqueda y las demás herramientas puedan usarlos. Esta página muestra los
pasos: elegir la entidad que alimentan tus registros, escribirlos como registros de origen, dejar que cli-core los
vincule y mantener fuera los secretos. Supone que conoces los [conceptos](./build-concepts.md).

## Pasos

1. **Elige la entidad.** Decide qué entiende el propietario por tus registros: una persona, un evento o un documento.
   Tus registros son registros de origen de esa entidad. Si nada encaja, el tipo de registro es una nueva entidad
   compartida y necesita un cambio en cli-core, no una tabla propia.
2. **Escribe a través de cli-core.** Guarda los registros con las áreas del almacén de cli-core, nunca con tu propio SQL
   ([WC-STORE-5](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md#wc-store-5--a-cli-writes-no-sql-against-the-shared-store)).
   Si a un área le falta el método que necesitas, añádelo a cli-core con su prueba.
3. **Usa como clave el id del proveedor.** Cada registro tiene su `account_id` y el id del proveedor en `external_id`.
   Guardar otra vez el mismo registro lo actualiza en lugar de añadir una copia.
4. **Usa los nombres estándar.** Un campo por el que filtras, ordenas, unes o que muestras en una lista es una columna
   con nombre estándar: `title`, `url`, `starts_at`, `ends_at`, `external_updated_at`. Las horas van en
   milisegundos UTC. Todo lo demás va en `metadata`, con una lista de campos permitidos
   ([WC-DATA-4](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-4--use-the-standard-field-names),
   [WC-DATA-5](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-5--a-field-the-store-filters-sorts-joins-or-lists-on-is-a-column-the-rest-is-allow-listed-json)).
5. **Deja que la coincidencia los vincule.** cli-core vincula tu registro a su entidad con una regla: la misma clave,
   un id compartido como el `ical_uid` de un calendario, un enlace para unirse o un hash exacto del contenido. Dos
   candidatos iguales no producen vínculo.
6. **Borra de forma suave lo que desaparece.** Cuando el proveedor deja de devolver un registro, este recibe
   `deleted_at`. Su entidad y los vínculos del propietario se quedan
   ([WC-DATA-7](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-7--a-source-record-the-provider-stops-returning-is-soft-deleted-its-entity-and-links-stay)).

## Ejemplo: reuniones de Zoom

La herramienta `zm` ya lleva así las reuniones de Zoom al almacén:

- cada reunión es una fila de `meetings`, un registro de origen, guardada con el almacén de reuniones de cli-core;
- `account_id` es la cuenta de Zoom y `external_id` es el id de la reunión en Zoom, únicos juntos;
- `event_id` apunta al evento, la entidad, y lo fija la vinculación de eventos;
- los participantes son identidades, así que un participante de Zoom y la misma persona en Telegram pueden unirse en
  una sola persona.

Una grabación que llega después encuentra la misma fila por su clave y la actualiza.

## Nunca guardes

- tokens, contraseñas ni claves ([reglas de seguridad](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md));
- códigos de acceso de reuniones, PIN ni la parte de consulta de un enlace para unirse;
- la respuesta en bruto del proveedor; guarda solo los campos permitidos.

## Registra tu proveedor

Cada vez que se ejecuta, tu herramienta anota su proveedor en el almacén: su nombre, tipo, alias y comando. Así todas
las demás herramientas conocen la nueva fuente sin una versión de cli-core. Las filas de un proveedor que ninguna
herramienta ha registrado se omiten y se informan, nunca se buscan como mensajes.

```ts
import { openStore } from "@wirecat/cli-core/store"

const store = await openStore()
await store.accounts.registerProvider({ name: "acme", kind: "meetings", aliases: ["acme"], command: "acme" })
```

`kind` es cómo la búsqueda lee tus registros: `messages`, `mail`, `notes`, `documents`, `meetings` o `events`.
## Qué se rompe si lo omites

Sin `external_id`, cada sincronización añade el mismo registro otra vez. Sin borrado suave, una sincronización fallida
borra lo que el propietario vinculó o escribió. Sin las áreas compartidas del almacén, la siguiente migración de cli-core
rompe tu herramienta.

Siguiente: [Guardar tus propios datos](./build-own-data.md).
