---
title: "Añade tu herramienta a WireCat"
description: "Cómo llevar una herramienta de línea de comandos que hiciste al grupo Herramientas de la comunidad de wirecat.dev y a WireCat Desktop: qué necesita, el pull request, la revisión, las actualizaciones y la retirada."
---

Hiciste una herramienta de línea de comandos y quieres que la gente la encuentre junto a las herramientas de WireCat.
Esta página es para autores fuera de WireCatLabs. Muestra qué necesita tu herramienta, cómo pedir que la incluyamos,
qué comprobamos y qué pasa después de fusionarla. Una herramienta incluida aparece en wirecat.dev, en el grupo
«Herramientas de la comunidad», y en WireCat Desktop para quien active las herramientas de la comunidad.

Estar en la lista no convierte tu herramienta en parte de WireCat. Conserva tu nombre, tu ámbito de npm y tu
repositorio. Tú sigues haciéndola y publicándola.

## Quién puede incluir una herramienta

Las herramientas de WireCat leen mensajes, correo y archivos de las personas. Por eso no incluimos herramientas de
cualquiera que lo pida. Vienen de autores aprobados, que lo solicitan o reciben una invitación, y cada una necesita la
prueba de que nuestras comprobaciones pasaron y, al final, la aprobación de una persona del equipo. Las solicitudes
aún no están abiertas. Para preguntar, abre un issue en [cli-docs](https://github.com/WireCatLabs/cli-docs/issues).

## Qué necesita tu herramienta

- **Está hecha con la plantilla o cumple el mismo estándar.** Empieza por [Crea tu CLI](./build-create-cli.md). Todas
  las comprobaciones «Done when» de la
  [lista del nuevo CLI](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/new-cli.md#done-when) pasan
  en el CI de tu herramienta.
- **Cada comando nombra su perfil.** Un perfil es el nombre de una de tus cuentas, como `personal`. La herramienta
  nunca elige una cuenta por sí sola, y sin perfil da un error que lista las opciones. Esto vale para cada comando,
  ejemplo, texto de ayuda y página.
- **Su repositorio es público.** npm no genera registro de procedencia para un paquete construido en un repositorio
  privado, y no podemos revisar código que no vemos. Una herramienta de un repositorio privado solo se puede añadir en
  tu propio ordenador, como herramienta sin revisar.
- **Publica en npm desde GitHub Actions con trusted publishing.** La publicación se ejecuta desde `release.yml` en el
  repositorio de la propia herramienta, en la rama `main`. WireCat Desktop comprueba la procedencia en npm
  (provenance) de cada versión, un registro firmado de dónde npm construyó el paquete. Rechaza una versión cuyo
  registro no apunte a ese workflow en tu repositorio. La plantilla lo configura por ti.
- **Previsto: publica a través de nuestro workflow de publicación.** Tu `release.yml` llamará a una versión fija de
  un workflow de WireCatLabs que ejecuta nuestras comprobaciones de estándares y después publica. El registro de
  procedencia nombra entonces nuestro workflow como el que construyó el paquete, y cualquiera puede ver que nuestras
  comprobaciones pasaron en esa versión.
- **Tiene su propio nombre.** Publica en tu propio ámbito de npm, como `@example/acme-cli`. El ámbito `@wirecat` y el
  nombre «WireCat» siguen siendo nuestros. No tomes un nombre que WireCat reserva para sus herramientas, como `tg`,
  `max` o `mail`.
- **Tiene una etiqueta de versión y páginas.** Una etiqueta `vX.Y.Z` que coincide con una versión de npm y, en esa
  etiqueta, una carpeta `docs` con tus páginas y un `meta.json` que las lista. El sitio copia las páginas desde ahí.

## Pide que la incluyamos

1. **Publica la versión que quieres mostrar.** Ponle la etiqueta `vX.Y.Z` y deja que `release.yml` la publique.
2. **Abre un pull request a [cli-docs](https://github.com/WireCatLabs/cli-docs).** Añade tu herramienta a
   `tools.json` con `"community": true`. Añade también su nombre a `content/docs/meta.json`, `meta.ru.json` y
   `meta.es.json`.
3. **Añade las traducciones que falten.** El sitio está en inglés, ruso y español. Las páginas en los otros dos
   idiomas van en `translations/<name>/` de cli-docs, y `pnpm docs:translation accept` las registra.
4. **Enlaza las pruebas en el pull request.** La ejecución verde del CI en el commit etiquetado y el resultado de la
   auditoría con un agente nuevo que describe la lista del nuevo CLI.

Esta es una entrada completa para una herramienta llamada `acme`:

```json
{
  "name": "acme",
  "displayName": "Acme Notes",
  "repo": "example/acme-cli",
  "package": "@example/acme-cli",
  "lang": "en",
  "summary": {
    "en": "Your Acme notes on your computer, searchable offline.",
    "ru": "Ваши заметки Acme на вашем компьютере, с поиском без сети.",
    "es": "Tus notas de Acme en tu ordenador, con búsqueda sin conexión."
  },
  "docsRef": "v1.0.0",
  "community": true,
  "desktop": {
    "tagline": "Acme notes, searchable with your WireCat data",
    "bin": "acme",
    "profiles": { "args": ["profile", "list", "--json", "--no-record"], "shape": "items" },
    "doctor": ["{profile}", "doctor", "--json", "--record"],
    "runs": null,
    "search": null,
    "setup": ["{profile}", "setup"],
    "signIn": { "gives": "your Acme notes", "asks": "an Acme API token", "guide": "https://example.com/acme/token" },
    "skill": null,
    "mcp": null,
    "mcpServer": null,
    "tasks": null,
    "sync": null,
    "storeInfo": null,
    "storeTables": null,
    "storeTableSizes": null,
    "storeCheck": null,
    "storeBackup": null,
    "storeBackupEncrypted": null,
    "storage": { "app": "acme-cli", "env": "ACME" },
    "settings": null
  }
}
```

Los campos:

- **`name`** es el comando que escribe la gente. Para la app de escritorio son de 2 a 16 letras minúsculas.
- **`repo`** es `owner/name` en GitHub, fuera de WireCatLabs. **`package`** es el nombre de npm con ámbito.
- **`lang`** es el idioma de tus páginas. **`summary`** es una línea en cada uno de los tres idiomas.
- **`docsRef`** es la etiqueta de versión desde la que el sitio copia tus páginas.
- **`desktop`** es lo que WireCat Desktop necesita para instalar, comprobar y conectar tu herramienta. Sin él, la
  herramienta aparece solo en el sitio. `tagline` tiene como máximo 55 caracteres. `bin` es el programa que instala
  npm. `storage` es el nombre de la carpeta y el prefijo de variables de entorno que tu herramienta pasa a
  `resolvePaths` de cli-base. Escribe `null` para un comando que tu herramienta no tiene.
- **Cada lista contiene solo palabras de comando simples.** Letras, cifras y `._:=,/+@-`, como mucho dos guiones al
  principio, y huecos como `{profile}`. Sin espacios, comillas ni signos del shell.

Una entrada de la comunidad no puede fijar `partOf`, `commandPrefix`, `memory`, `taskBoard`, `bot`, `storeReset`,
`storeResetPreview`, `configRepair` ni `signIn.command`. Son solo para las herramientas de WireCat.

## Qué comprobamos

Las comprobaciones van en orden. Primero las automáticas, y una persona aprueba al final.

**Automáticas, en el pull request:**

- **Ya existe:** las pruebas de cli-docs ejecutan las mismas reglas de entrada que la app de escritorio, así que una
  entrada `desktop` incorrecta hace fallar el pull request.
- **Previsto:** la procedencia de la versión nombra tu repositorio y, cuando exista, nuestro workflow de publicación.
- **Previsto:** nuestras comprobaciones de estándares se ejecutan de nuevo sobre el código de tu etiqueta.
- **Previsto:** un análisis del paquete de npm en busca de secretos y malware.
- **Previsto:** un agente nuevo audita la herramienta en el CI, solo con nuestro manual y tu repositorio.

**Una persona del equipo aprueba**, siguiendo la
[lista de revisión de herramientas de la comunidad](https://github.com/WireCatLabs/cli-docs/blob/main/docs/REVIEWING.md#community-tools).
Mientras las comprobaciones previstas no existan, comprueba esto a mano:

1. La lista del nuevo CLI está en verde en tu CI, en el commit etiquetado.
2. La auditoría con un agente nuevo no encontró huecos abiertos.
3. Cada comando, ejemplo, texto de ayuda y página nombra su perfil.
4. Nada usa el ámbito `@wirecat` ni el nombre «WireCat».
5. En la versión etiquetada, los comandos doctor y setup de la entrada funcionan tal como están escritos para un
   perfil nuevo, y cada otro comando que nombra la entrada existe.
6. La carpeta de datos de `storage` es solo de tu herramienta.

La revisión comprueba cómo se construye y publica tu herramienta. No comprueba todo lo que hace.

## Después de fusionarla

- **El sitio la muestra** en el grupo «Herramientas de la comunidad», con tus páginas de la etiqueta `docsRef`.
- **La lista de escritorio se reconstruye.** Cada despliegue del sitio construye y firma la lista de herramientas de
  la comunidad para WireCat Desktop. El despliegue se ejecuta en cada fusión y una vez al día.
- **En la app solo la ve quien lo elige.** La herramienta aparece cuando alguien activa «Activar herramientas de la
  comunidad» en Ajustes y reinicia la app. Lleva la insignia **Comunidad** y, antes de instalarla, la nota «Hecho por
  `<owner>`, no por WireCat. La app comprueba dónde npm lo compiló, no lo que hace.»
- **Cada instalación se comprueba.** Antes de instalar tu herramienta, la app comprueba que npm construyó esa versión
  desde `release.yml` de tu repositorio en `main`.

El sitio ya construye y firma la lista de escritorio. WireCat Desktop empezará a leerla en una próxima versión. Hasta
entonces, una herramienta incluida aparece solo en el sitio.

## Actualizaciones

- **Nuevas versiones.** Cómo se comprueban las nuevas versiones y cómo llegan a los usuarios se está diseñando.
- **Las páginas** del sitio vienen de la etiqueta `docsRef`. Una comprobación diaria abre un issue en cli-docs cuando
  hay una versión más nueva. Un pull request que mueve `docsRef` a la nueva etiqueta actualiza tus páginas tras la
  revisión. Puedes abrirlo tú.
- **Los cambios en la entrada `desktop`**, como un comando nuevo, pasan por un pull request y la misma revisión.

## Retirada

Retiramos una herramienta cuando incumple las reglas de arriba o cuando su autor lo pide. La entrada sale de
`tools.json`, y el siguiente despliegue publica una lista sin ella.

- **En el sitio** la herramienta desaparece del grupo «Herramientas de la comunidad».
- **En la app** la herramienta deja de ofrecerse desde el siguiente inicio con la lista nueva. La app nunca
  desinstala una copia que alguien instaló.
- **Previsto:** la app muestra una herramienta retirada que sigue instalada como «Ya no está en la lista», con un
  botón para desinstalarla.

## Prueba tu herramienta antes de pedir la inclusión

Puedes añadir tu herramienta en WireCat Desktop antes de cualquier revisión. Lleva entonces la etiqueta **Sin
revisar**. Llega en la próxima versión de WireCat Desktop.

1. En Ajustes, activa **Permitir herramientas que WireCat no ha revisado** y confirma el aviso con **Permitir**.
2. En la página Herramientas, pulsa **Añadir tu propia herramienta**, arriba junto a **Comprobar de nuevo**. Escribe
   el nombre de tu paquete en npm y pulsa **Comprobar paquete**. WireCat solo lee npm: todavía no se instala nada.
3. La pantalla de revisión muestra quién lo publica, el repositorio, la versión, dónde lo compiló npm y qué pide.
   Pulsa **Añadir** y luego **Instalar y ejecutar** en la segunda pregunta.

Desktop lee el manifiesto de la herramienta, `contracts/wirecat.json`, del paquete en npm, así que tu herramienta debe
incluirlo ([Crea tu CLI](./build-create-cli.md)). Una herramienta de un repositorio privado se puede añadir así, pero
nunca entrar en la lista. La [página de WireCat Desktop](./desktop/index.mdx#añadir-tu-propia-herramienta) muestra cada pantalla y qué significa
cada rechazo.

## Siguientes pasos

1. [Crea tu CLI](./build-create-cli.md) para empezar una herramienta con la plantilla.
2. [Inicio de sesión y cumplimiento](./build-sign-in.md) para las reglas que sigue cada herramienta.
