---
title: Un CLI para tu propio servicio a partir de un solo config
description: En una semana enseñé a la plantilla de WireCat a montar un CLI entero a partir de un solo archivo, wirecat.config.ts. Así salieron attio, linear y wordpress en 3 días, con sync a una copia local, servidor MCP y tests. Cuento cuánto código se escribió a mano, qué se rompió con un WordPress de verdad y si encaja con tu CRM.
date: 2026-11-21
tags: [cli, ai-agents, mcp]
cover: ./cover.jpg
coverAlt: "Una tarjeta pequeña sobre una mesa oscura, de la que salen hilos violetas luminosos hacia una consola grande y terminada con interruptores, cajoncitos de fichero y un candado pequeño en uno de los interruptores"
author: viacheslav-ptsarev
glance:
  - value: "0 líneas"
    label: "de hooks en linear y wordpress, toda la fuente está en el config"
    href: "#3-cli-en-3-días"
  - value: "42 líneas"
    label: "a mano en attio después de new, hubspot sin config tiene 2340, pero también hace mucho más"
    href: "#3-cli-en-3-días"
  - value: "1 h 55 min"
    label: "de las 2 h 54 min de linear se fueron en arreglar los paquetes comunes, no el config"
    href: "#el-tiempo-no-se-fue-en-el-config"
draft: false
---

He hecho que un CLI nuevo de WireCat se monte a partir de un solo archivo. Escribes `wirecat.config.ts` - qué servicio es, dónde está la descripción de su API, cómo comprobar un token y qué campos de sus respuestas son personas, empresas y tratos. Luego un solo comando, `new --from-config`, crea un CLI con sync a una copia local, servidor MCP y tests para su categoría. De momento hay 3 categorías: CRM, gestor de tareas y contenido (posts en un sitio), y la descripción de la API puede ser OpenAPI, un esquema GraphQL o el índice `wp-json` de un sitio WordPress.

Lo escribo sobre todo para quien tiene en su empresa un CRM o un helpdesk propio y quiere que su agente trabaje con él igual que con el correo y los chats en WireCat. Digo ya dónde está el límite: un CRM desde config de momento solo lee, y un helpdesk que solo tiene una API REST todavía no encaja en ninguna categoría (más detalles al final).

Con el config ya hay 3 CLI de verdad - attio, linear y wordpress. Los montaron agentes a partir de la plantilla, y yo respondía a sus preguntas, decidía qué arreglar y leía las revisiones. Así que los tiempos de las tablas son tiempo de los agentes, no mío.

Antes de esto la plantilla ([cli-template](https://github.com/WireCatLabs/cli-template)) ya tenía `new --spec-url`: le das la dirección de una descripción de API y obtienes un comando por operación. Con la descripción de PokeAPI salen 102 comandos, una respuesta real y un servidor MCP que funciona en 16 segundos, sin contar lo que tarda npx en descargar la propia plantilla. Pero son solo llamadas en vivo a la API. Para que un agente busque rápido en un CRM hace falta una copia local, un sync solo de los cambios y las personas enlazadas con el resto de fuentes de WireCat. Antes todo eso se escribía a mano en cada CLI.

Ahora todo eso se describe en el config. Un ejemplo para un CRM inventado:

```ts
import { defineCli } from "@wirecat/cli-core/manifest"

export default defineCli({
  identity: { command: "acme", package: "@acme/acme-cli", prefix: "ACME", service: "Acme CRM", owner: "acme" },
  spec: { kind: "openapi", from: "https://crm.acme.example/openapi.json" },
  auth: { preset: "token", verify: { operation: "getMe", id: "workspace.id", name: "workspace.name" } },
  category: "crm",
  source: {
    provider: "acme",
    kinds: ["person"],
    entities: {
      person: {
        list: { operation: "listContacts", query: { limit: 100 } },
        changes: { operation: "listContacts", query: { limit: 100, updated_since: "{since}" }, since: "iso" },
        get: { operation: "getContact", path: { id: "{id}" } },
        map: { externalId: "id", name: "full_name", emails: { each: "emails", value: "address" } },
      },
    },
  },
})
```

```sh
npx @wirecat/cli-template new --from-config wirecat.config.ts
cd acme-cli && pnpm install && pnpm generate
node dist/bin/acme.js work session start    # toma el token y lo comprueba con la operación de auth.verify
node dist/bin/acme.js work sync             # copia los registros, después solo lo que cambió
```

`work` aquí es el nombre de un perfil, lo eliges tú, y el CLI nunca toma una cuenta por defecto. Sin `changes` el sync también funciona, solo que relee la lista entera cada vez. `pnpm source:check` comprueba que cada operación y cada ruta de `map` existen de verdad en la API generada, así que una errata en `full_name` aparece antes del primer sync. La paginación, los cursores y la base de datos local donde va la copia vienen de cli-core, el paquete común de todas las herramientas de WireCat. Lo que no se puede describir en el config (por ejemplo, que el servicio guarda los valores antiguos de un campo junto al actual) va en `src/hooks.ts`.

Además recibes tests desde el principio. Cada operación de la API se envía a un fake, un servidor de mentira dentro del test, construido a partir de la descripción de la API. Es estricto, así que rechaza cualquier petición que la descripción no permita. Y la fuente pasa por los contratos de su categoría, un conjunto común de tests que comprueba igual a todos los CRM de WireCat. Hay casos como "la lista se cortó después de la primera página, la siguiente ejecución sigue desde esa página, nada perdido ni repetido".

## 3 CLI en 3 días

El propio `--from-config` salió el 17 de noviembre y al principio solo sabía hacer CRM. Justo después los agentes empezaron a montar CLI de verdad con él, cada uno encontraba huecos, y se arreglaban en la plantilla y no en el CLI. En 4 días la plantilla pasó de un solo CRM a 3 categorías, y para el 21 de noviembre (versión 0.33.0) WordPress se monta a partir del índice completo del sitio.

Los 3 CLI tienen `wirecat.config.ts` en su primer commit:

| | [attio-cli](https://github.com/WireCatLabs/attio-cli) | [linear-cli](https://github.com/WireCatLabs/linear-cli) | [wordpress-cli](https://github.com/WireCatLabs/wordpress-cli) |
| --- | --- | --- | --- |
| Qué es | CRM, OpenAPI | gestor de tareas, GraphQL | contenido, `wp-json` |
| Plantilla | 0.28.0 | 0.31.0 | 0.32.0 |
| Líneas de config | 64 | 102 | 117 |
| Líneas de hooks | 23 | 0 | 0 |
| Código a mano después de `new`, hooks incluidos | 42 | 7 | 81 |
| Generado | 107 operaciones | 493 operaciones | 147 operaciones |
| De `new` a `cli-dev ready` en verde, sin la comprobación en vivo | unas 2 h 40 min | 2 h 54 min | unos 40 min |
| Primera versión | 18 nov | 19 nov | 19 nov |

`cli-dev ready` es un comando que pasa todas las comprobaciones antes de una versión (lint, tests, contratos, documentación, etc.) y dice de cada una si pasó o no. La comprobación en vivo es ejecutar el CLI contra una cuenta de prueba real del servicio, y no está en la tabla.

Todas las cifras son del primer montaje de cada CLI, de las mediciones en cli-testing ([attio](https://github.com/WireCatLabs/cli-testing/blob/main/performance/generation/source-manifest/README.md), [linear](https://github.com/WireCatLabs/cli-testing/blob/main/performance/generation/linear-from-config/README.md), [wordpress](https://github.com/WireCatLabs/cli-testing/blob/main/performance/generation/wordpress-from-config/README.md)). Los configs han crecido desde entonces. Para su primera versión attio ganó los tratos, el config pasó a 126 líneas y el hook bajó a 8.

Para comparar, [hubspot-cli](https://github.com/WireCatLabs/hubspot-cli) también sale de la plantilla, pero de antes del config, y tiene 2340 líneas a mano, sobre todo el mapeo de las respuestas de HubSpot a registros de CRM. De aquí no sale un porcentaje de ahorro, porque hubspot sincroniza mucho más (tratos, leads, actividades, etc.), y el primer montaje de attio solo sincronizaba personas, empresas y miembros del workspace. Se ve el orden de la diferencia, una cifra exacta no hay.

En wordpress-cli las 81 líneas a mano no tienen nada que ver con el mapeo. 10 líneas son textos que ven el usuario y Desktop, y 71 vinieron de las revisiones, casi todas sobre claves de permisos.

## Qué se rompió con un WordPress de verdad

La plantilla tenía su propio caso de prueba de WordPress con 19 rutas, y un WordPress 6.9.4 real sin plugins tiene 127 en su índice.

Con el índice completo `pnpm generate` se paró enseguida. `GET /wp/v2/block-types/{namespace}` recibió el mismo nombre de comando que leer un solo tipo de bloque, y borrar todas las contraseñas de aplicación de un usuario el mismo que borrar una. Ahora son `block-types-list-namespace` y `users-application-passwords-delete-all`.

La ruta `wp_pattern_category` rompió todavía más. El generador escribe una clave de permiso para cada operación, y todas las claves están en los mismos ajustes del CLI. La comprobación de ajustes no conocía una clave con guion bajo, y por eso no falló un test sino todos los de `api`, 151. Ahora el CI de la plantilla monta WordPress a partir de todo el índice de 6.9.4, no de un recorte, para que esto se detecte enseguida.

Después un agente hizo una comprobación en vivo con WordPress en Docker y 3 usuarios de prueba: un Contributor, un Author y un Editor. Los fakes aceptan cualquier llamada que permita la descripción de la API, pero un sitio real rechaza según el rol. Un Author y un Contributor no pueden leer etiquetas con `context=edit`, aunque el nombre y el slug de una etiqueta son públicos, así que el config ahora las lee sin él. Además WordPress responde a estos 2 roles con HTTP 400 (con un 403 dentro) a la lista de páginas, y ese rechazo tumbaba el sync de todos los posts, y cada ejecución siguiente fallaba en la misma llamada. Ahora la lista de páginas necesita el permiso `edit_pages`, sin él la llamada simplemente no se envía, y el sync dice al final qué faltó.

Y una revisión hecha por un agente nuevo encontró un agujero cuando todas las comprobaciones ya pasaban. El grupo `api` ofrecía un comando para crear una contraseña de aplicación, y WordPress devuelve la contraseña nueva en texto plano, mientras que su índice no marca ese campo como secreto de ninguna forma. O sea, un agente podía crear una contraseña y recibirla en el chat. En wordpress-cli se cerró a mano antes del primer push, y el 21 de noviembre cli-base empezó a marcar ese campo como secreto en cualquier CLI de WordPress, así que esas llamadas ya no están en `api`.

La misma revisión vio que denegar `posts create` no paraba exactamente la misma llamada por `api posts-create`, y que las escrituras que cambian todo el sitio (plugins, ajustes, usuarios) se ejecutaban sin preguntar. Ahora el CLI pregunta antes por defecto.

## El tiempo no se fue en el config

El config en sí casi no llevó tiempo. Un agente escribió attio en 1 h 20 min, luego fallaron 17 tests, y los 17 eran bugs de los paquetes comunes, ninguno de attio. Arreglarlos con revisiones llevó unas 1 h 20 min más, y 2 versiones.

En linear, unas 1 h 55 min de las 2 h 54 min se fueron en los paquetes comunes. `cli-dev ready` no conocía la categoría de gestor de tareas, cli-core no tenía un fake para pasar el contrato de tareas sobre una fuente sacada de un config (son unas 930 líneas), y el test GraphQL de `api` se quedaba sin memoria. En Linear los filtros se anidan unos dentro de otros (`IssueFilter` llega a `TeamFilter` y vuelve), y el test que intentaba rellenar cada campo opcional construía filtro dentro de filtro hasta que el worker no pudo más. Ahora las 493 operaciones de Linear pasan en unos 20 segundos.

Antes de una versión, el CI exige que cada comando del CLI y cada uno de sus flags tenga al menos un test o una razón escrita de por qué no lo tiene, si no `release:check` no deja pasar la versión. Después de la revisión a linear-cli aún le faltaba test a 562 de esos flags y comandos, por ejemplo `--body-file` y `--all` del grupo `api`, o los comandos de tareas. Esos tests pasaron a la plantilla, pero cubrían el gestor de tareas y no WordPress, así que a wordpress-cli le pasó lo mismo con 501. Esos también pasaron a la plantilla el mismo día.

El tercer CLI salió varias veces más rápido que los dos primeros: unos 40 minutos hasta un `cli-dev ready` en verde, frente a 2 h 40 min de attio y 2 h 54 min de linear. El commit de la versión de wordpress, con 2 revisiones y la comprobación en vivo, llegó 1 h 20 min después de `new`.

## Lo que estas cifras no muestran

- Linear con un workspace real en la propia medición: ahí el config se comprobó contra el esquema y un fake construido a partir de él, la comprobación en vivo pasó después, antes de la primera versión.
- Un sitio WordPress real con plugins, caché o una capa de seguridad que oculta rutas. Todas las comprobaciones en vivo fueron con 6.9.4 en Docker.
- Los tratos de attio con datos reales. El workspace de prueba no tiene ninguno, así que el mapeo de tratos se comprobó solo contra el fake.
- Mi tiempo. No me cronometré, solo sé que respondí a los agentes 3 preguntas sobre attio, 1 sobre linear y ninguna sobre wordpress.
- Una comparación exacta entre los CLI. Las cifras de attio salen de un contador de líneas distinto al de linear y wordpress, y el alcance es distinto en cada uno, así que la tabla de arriba muestra la escala aproximada.

## Si tienes tu propio CRM o helpdesk

Qué hace falta para que funcione:

- Una descripción de la API - OpenAPI 3 o Swagger 2.0, en JSON o YAML, y para un gestor de tareas un esquema GraphQL (`new` lo obtiene por introspección). Si la descripción está mal en algunos sitios, el parche con su motivo va en `scripts/spec-model.ts`. Si una lista no tiene la paginación descrita, el test de contrato falla a propósito hasta que la describas.
- Acceso con token y una operación que lea con ese token quién eres (`auth.verify`), porque la copia local se guarda bajo esa cuenta. Si distintos usuarios de tu servicio ven registros distintos, yo guardaría una copia aparte para cada usuario en vez de una por workspace. En linear una revisión pilló justo esto: el sync de un miembro podía marcar como borradas las tareas privadas de otro.
- Una cuenta de prueba. El montaje y todas las comprobaciones antes de la de en vivo corren contra el fake, pero para la comprobación en vivo y el uso real `session start` comprueba el token en el servicio de verdad.

De momento no encaja con todo. A 21 de noviembre un CRM desde config solo lee (sync, listas, búsqueda en la copia), y los comandos de escritura al CRM se escriben a mano. `new` se niega a hacer un gestor de tareas sobre OpenAPI, porque el fake de tareas de cli-core por ahora solo responde a GraphQL. O sea, un helpdesk con solo una API REST ahora no encaja en ninguna categoría de config, y le queda `new --spec-url` con llamadas en vivo, o escribir la fuente uno mismo. OAuth tampoco sale todavía del config, se conecta con el módulo `oauth` de cli-core. Y todo esto es solo Node y TypeScript.

Antes de conectar un agente yo revisaría los permisos de escritura. En una terminal cada escritura con nivel `ask` te pregunta, pero por MCP no hay nadie para responder, así que simplemente se ejecuta. Por eso `mcp add` no conecta un perfil que puede escribir hasta que añades `--allow-writes`, y cada escritura queda después en `runs list`. Si el perfil que le das al agente no debe borrar nada en tu CRM, pon `config set permissions.api readonly`, o `deny` en operaciones concretas. Este párrafo ahora se escribe solo en el README de cada CLI nuevo con grupo `api`.

Si el CLI no va a formar parte de WireCat, en `package` va tu propio scope y en `owner` tu nombre, y cómo preparar el repositorio y publicar en npm está en [Publishing outside WireCat](https://github.com/WireCatLabs/cli-template/blob/main/kit/README.md#publishing-outside-wirecat). Todos los campos de `wirecat.config.ts` están en la [referencia del kit](https://github.com/WireCatLabs/cli-template/blob/main/kit/README.md#new-name), y cómo montar tu propia herramienta con la plantilla y un agente y conectarla a WireCat está [en la documentación](/es/docs/build-create-cli).

El siguiente en el plan es Ghost, el segundo CLI de contenido después de WordPress. Para empezar con tu CRM, toma el ejemplo de arriba, pon la dirección de tu descripción, tus operaciones y tus rutas en `map`, y ejecuta `npx @wirecat/cli-template new --from-config wirecat.config.ts`.
