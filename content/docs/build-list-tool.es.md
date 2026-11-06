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

## Qué necesita tu herramienta

- **Está hecha con la plantilla o cumple el mismo estándar.** Empieza por [Crea tu CLI](./build-create-cli.md). Todas
  las comprobaciones «Done when» de la
  [lista del nuevo CLI](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/new-cli.md#done-when) pasan
  en el CI de tu herramienta.
- **Cada comando nombra su perfil.** Un perfil es el nombre de una de tus cuentas, como `personal`. La herramienta
  nunca elige una cuenta por sí sola, y sin perfil da un error que lista las opciones. Esto vale para cada comando,
  ejemplo, texto de ayuda y página.
- **Publica en npm desde GitHub Actions con trusted publishing.** La publicación se ejecuta desde `release.yml` en el
  repositorio de la propia herramienta, en la rama `main`. WireCat Desktop comprueba la procedencia en npm
  (provenance) de cada versión, un registro firmado de dónde npm construyó el paquete. Rechaza una versión cuyo
  registro no apunte a ese workflow en tu repositorio. La plantilla lo configura por ti.
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

## Qué comprueba la revisión

Quien revisa sigue la
[lista de revisión de herramientas de la comunidad](https://github.com/WireCatLabs/cli-docs/blob/main/docs/REVIEWING.md#community-tools).
En resumen:

1. La lista del nuevo CLI está en verde en tu CI, en el commit etiquetado.
2. La auditoría con un agente nuevo no encontró huecos abiertos.
3. Cada comando, ejemplo, texto de ayuda y página nombra su perfil.
4. Nada usa el ámbito `@wirecat` ni el nombre «WireCat».
5. Las pruebas de cli-docs pasan. Ejecutan las mismas reglas que la app de escritorio, así que una entrada `desktop`
   incorrecta hace fallar el pull request.
6. En la versión etiquetada, los comandos doctor y setup de la entrada funcionan tal como están escritos para un
   perfil nuevo, y cada otro comando que nombra la entrada existe.
7. La carpeta de datos de `storage` es solo de tu herramienta.

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

- **Las nuevas versiones** llegan a la app a través de npm. Cada una pasa la misma comprobación de procedencia antes
  de instalarse.
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

Puedes ver tu herramienta en WireCat Desktop antes de cualquier revisión.

- **Hoy, para desarrolladores.** Inicia la app con la variable de entorno `WIRECAT_EXTRA_TOOLS=1` y pon tu entrada en
  el archivo `extra-tools.json` de la carpeta de datos de la app. La app comprueba la entrada con las mismas reglas y
  escribe cada rechazo en su consola. Las
  [notas de la app sobre herramientas de la comunidad](https://github.com/WireCatLabs/wirecat-desktop/blob/main/docs/dev/cli-registry.md#your-own-tools-not-checked)
  muestran el formato del archivo.
- **Previsto, para todos.** «Añadir tu propia herramienta» en Ajustes acepta un nombre de paquete de npm. La app
  muestra la insignia «Sin comprobar» y pide confirmación antes de instalar y antes del primer uso.

## Siguientes pasos

1. [Crea tu CLI](./build-create-cli.md) para empezar una herramienta con la plantilla.
2. [Inicio de sesión y cumplimiento](./build-sign-in.md) para las reglas que sigue cada herramienta.
