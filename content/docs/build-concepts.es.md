---
title: "Conceptos, fuentes y tus propios datos"
description: "El modelo del almacén compartido, cómo añadir los registros de un proveedor como registros de origen y dónde guarda una herramienta sus propias tablas."
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
Consulta [Guardar tus propios datos](./build-concepts.md#guardar-tus-propios-datos).

## Más en el almacén

- **El registro de proveedores.** Tu herramienta anota su proveedor (nombre, tipo, alias, comando) en el almacén cada
  vez que se ejecuta, así todas las demás conocen la nueva fuente sin una versión de cli-core. Las filas de un
  proveedor que ninguna herramienta ha registrado se omiten y se informan, nunca se buscan como mensajes. Consulta
  [Añadir una fuente](./build-concepts.md#añadir-una-fuente).
- **La lista de revisión.** Los pares que las herramientas no pueden distinguir, como dos eventos para una reunión,
  esperan ahí a que el propietario decida.
- **Las entradas de calendario y los archivos** son registros de origen de eventos y documentos, y cada identidad puede
  tener una dirección de correo, para que una dirección una a una persona.

## Qué se rompe si lo omites

Un id de proveedor guardado solo en `metadata` no se puede actualizar por clave, así que cada sincronización crea un
duplicado. Un vínculo hecho solo por el título une dos reuniones distintas, y el propietario ve la grabación equivocada.
El SQL contra el archivo compartido se rompe con la siguiente migración de cli-core.

Siguiente: [Añadir una fuente](./build-concepts.md#añadir-una-fuente).

## Añadir una fuente

Tienes un servicio, como un calendario, una aplicación de reuniones o un almacén de archivos, y quieres sus registros en
el almacén compartido de WireCat para que la búsqueda y las demás herramientas puedan usarlos. Esta página muestra los
pasos: elegir la entidad que alimentan tus registros, escribirlos como registros de origen, dejar que cli-core los
vincule y mantener fuera los secretos. Supone que conoces los [conceptos](./build-concepts.md).

### Pasos

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

### Ejemplo: reuniones de Zoom

La herramienta `zm` ya lleva así las reuniones de Zoom al almacén:

- cada reunión es una fila de `meetings`, un registro de origen, guardada con el almacén de reuniones de cli-core;
- `account_id` es la cuenta de Zoom y `external_id` es el id de la reunión en Zoom, únicos juntos;
- `event_id` apunta al evento, la entidad, y lo fija la vinculación de eventos;
- los participantes son identidades, así que un participante de Zoom y la misma persona en Telegram pueden unirse en
  una sola persona.

Una grabación que llega después encuentra la misma fila por su clave y la actualiza.

### Nunca guardes

- tokens, contraseñas ni claves ([reglas de seguridad](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md));
- códigos de acceso de reuniones, PIN ni la parte de consulta de un enlace para unirse;
- la respuesta en bruto del proveedor; guarda solo los campos permitidos.

### Registra tu proveedor

Cada vez que se ejecuta, tu herramienta anota su proveedor en el almacén: su nombre, tipo, alias y comando. Así todas
las demás herramientas conocen la nueva fuente sin una versión de cli-core. Las filas de un proveedor que ninguna
herramienta ha registrado se omiten y se informan, nunca se buscan como mensajes.

```ts
import { openStore } from "@wirecat/cli-core/store"

const store = await openStore()
await store.accounts.registerProvider({ name: "acme", kind: "meetings", aliases: ["acme"], command: "acme" })
```

`kind` es cómo la búsqueda lee tus registros: `messages`, `mail`, `notes`, `documents`, `meetings` o `events`.

### Qué se rompe si lo omites

Sin `external_id`, cada sincronización añade el mismo registro otra vez. Sin borrado suave, una sincronización fallida
borra lo que el propietario vinculó o escribió. Sin las áreas compartidas del almacén, la siguiente migración de cli-core
rompe tu herramienta.

Siguiente: [Guardar tus propios datos](./build-concepts.md#guardar-tus-propios-datos).

## Guardar tus propios datos

Tu herramienta necesita tablas que solo usa ella: un punto de control de sincronización, una memoria caché, los datos
internos del proveedor. Esta página muestra dónde van y cómo se refieren al almacén compartido, para que cli-core pueda
cambiar su esquema sin romper tu herramienta y ninguna otra herramienta llegue a depender de tus tablas internas.

### La regla

- Una tabla que solo necesita tu herramienta vive en **el archivo SQLite propio de tu herramienta**, junto al almacén
  compartido.
- Tu herramienta ejecuta sus propias migraciones sobre ese archivo.
- Tus tablas se refieren a los registros compartidos **solo por id**, como el id de una cuenta o de un documento.
- Ninguna otra herramienta abre tu archivo, y tu herramienta no abre el archivo de ninguna otra.

La regla es [WC-DATA-1](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-1--a-record-more-than-one-tool-needs-is-a-core-entity-in-cli-core-a-clis-own-tables-stay-private).
Si una segunda herramienta necesita los mismos registros, son una entidad compartida y su sitio es cli-core.

### Pasos

1. Encuentra la carpeta del almacén compartido con `storePath` de `@wirecat/cli-core/store`. Sigue a
   `MESSAGING_STORE`, así que las pruebas que mueven el almacén compartido también mueven tu archivo.
2. Abre tu archivo en esa carpeta con `openCache` del mismo módulo. Elige el SQLite del entorno de ejecución (Node o
   Bun) y aplica los mismos ajustes que el almacén compartido.
3. Crea y cambia tus tablas con migraciones que solo avanzan: añadir, nunca editar ni reconstruir
   ([WC-STORE-7](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md#wc-store-7--migrations-only-go-forward-add-never-edit-or-rebuild)).

### Ejemplo

Una herramienta llamada `acme-cli` guarda un punto de control de sincronización por cuenta:

```ts
import { dirname, join } from "node:path"
import { openCache, storePath } from "@wirecat/cli-core/store"

const own = await openCache(join(dirname(storePath()), "acme-cli.db"))
own.exec(`CREATE TABLE IF NOT EXISTS sync_checkpoints (
  account_id INTEGER PRIMARY KEY,
  cursor TEXT NOT NULL,
  updated_at INTEGER NOT NULL
)`)
```

`account_id` es el id de la fila de la cuenta en el almacén compartido. El punto de control nunca copia el nombre ni el
proveedor de la cuenta; los lee de cli-core cuando los necesita.

### Próximamente

Una ayuda de cli-core que abre el archivo propio de una herramienta y ejecuta sus migraciones está en la lista de «más
adelante». Mientras no exista, usa `openCache` como arriba.

### Qué se rompe si lo omites

Una tabla privada dentro del almacén compartido se rompe cuando cli-core migra, y otras herramientas empiezan a leerla.
Una copia de un campo compartido en tu tabla queda desfasada cuando el propietario edita el original. Otra herramienta
que abre tu archivo se rompe con tu siguiente cambio.

Siguiente: [Iniciar sesión en un servicio](./build-sign-in.md).
