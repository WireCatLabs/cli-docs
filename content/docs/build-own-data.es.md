---
title: "Guardar tus propios datos"
description: "Dónde guarda una herramienta las tablas que no necesita ninguna otra, como puntos de control y memorias caché, y cómo se refieren a los registros compartidos."
---

Tu herramienta necesita tablas que solo usa ella: un punto de control de sincronización, una memoria caché, los datos
internos del proveedor. Esta página muestra dónde van y cómo se refieren al almacén compartido, para que cli-core pueda
cambiar su esquema sin romper tu herramienta y ninguna otra herramienta llegue a depender de tus tablas internas.

## La regla

- Una tabla que solo necesita tu herramienta vive en **el archivo SQLite propio de tu herramienta**, junto al almacén
  compartido.
- Tu herramienta ejecuta sus propias migraciones sobre ese archivo.
- Tus tablas se refieren a los registros compartidos **solo por id**, como el id de una cuenta o de un documento.
- Ninguna otra herramienta abre tu archivo, y tu herramienta no abre el archivo de ninguna otra.

La regla es [WC-DATA-1](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-1--a-record-more-than-one-tool-needs-is-a-core-entity-in-cli-core-a-clis-own-tables-stay-private).
Si una segunda herramienta necesita los mismos registros, son una entidad compartida y su sitio es cli-core.

## Pasos

1. Encuentra la carpeta del almacén compartido con `storePath` de `@wirecat/cli-core/store`. Sigue a
   `MESSAGING_STORE`, así que las pruebas que mueven el almacén compartido también mueven tu archivo.
2. Abre tu archivo en esa carpeta con `openCache` del mismo módulo. Elige el SQLite del entorno de ejecución (Node o
   Bun) y aplica los mismos ajustes que el almacén compartido.
3. Crea y cambia tus tablas con migraciones que solo avanzan: añadir, nunca editar ni reconstruir
   ([WC-STORE-7](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md#wc-store-7--migrations-only-go-forward-add-never-edit-or-rebuild)).

## Ejemplo

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

## Próximamente

Una ayuda de cli-core que abre el archivo propio de una herramienta y ejecuta sus migraciones está en la lista de «más
adelante». Mientras no exista, usa `openCache` como arriba.

## Qué se rompe si lo omites

Una tabla privada dentro del almacén compartido se rompe cuando cli-core migra, y otras herramientas empiezan a leerla.
Una copia de un campo compartido en tu tabla queda desfasada cuando el propietario edita el original. Otra herramienta
que abre tu archivo se rompe con tu siguiente cambio.

Siguiente: [Iniciar sesión en un servicio](./build-sign-in.md).
