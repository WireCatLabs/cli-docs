---
title: "Crea tu CLI"
description: "Conecta un servicio que WireCat aún no admite: crea tu propia herramienta con nuestra plantilla y tu agente de IA, con guías para cada paso."
---

Puedes crear tu propia herramienta de línea de comandos para cualquier servicio o API, y rápido, con nuestra
plantilla y tu agente de IA. ¿Usas un CRM, un gestor de tareas o una app de notas que WireCat aún no admite? Añádelo
tú.

Esta página muestra lo que hace falta, lo que obtienes y por dónde empezar. Las guías siguientes te acompañan en cada
parte.

## Dos formas de usarla

Las dos empiezan desde la misma plantilla y tienen la misma base. La única diferencia es hasta dónde conectas tu
herramienta.

- **Una herramienta independiente.** Quieres una herramienta de línea de comandos rápida para un servicio, y nada más.
  La plantilla te da la base desde el primer día: los datos del servicio guardados en tu ordenador, búsqueda rápida en
  ellos, memoria para lo que aprende tu agente, un servidor para agentes de IA e inicio de sesión seguro. No necesitas
  ninguna otra herramienta WireCat.
- **Parte de WireCat.** También usas WireCat para chats, correo o reuniones y quieres una sola búsqueda sobre todo.
  Entonces conecta tu herramienta con las demás: lo que guarda queda junto a todo lo demás y una sola pregunta lo
  encuentra. Hacen falta unos pasos más, descritos en [Añadir una fuente](./build-concepts.md#añadir-una-fuente).

Puedes empezar con la primera y conectar tu herramienta más tarde.

## Cómo construirla, en breve

1. **Empieza desde la plantilla.** Un comando crea una herramienta que ya funciona, con todo preparado. No empiezas
   desde una carpeta vacía.
2. **Dile a tu agente de IA qué servicio conectar.** La plantilla trae instrucciones para el agente. Te hace unas
   preguntas sencillas sobre el servicio —qué guarda, cómo se inicia sesión— y luego escribe el código.
3. **Haz una prueba con tu cuenta.** Ejecuta la herramienta, mira lo que encontró y pide al agente que arregle lo que falte.
4. **Compártela, si quieres.** Las comprobaciones incluidas te dicen cuándo la herramienta está lista para publicarla
   para otras personas.

No necesitas saber cómo funciona WireCat por dentro para empezar. Las guías de abajo explican cada parte cuando la
necesites.

## Qué le da WireCat a tu herramienta

- **Tus datos en tu ordenador, con búsqueda rápida.** Lo que guarda tu herramienta queda en un archivo local. La
  búsqueda encuentra palabras en cualquier forma en inglés, ruso y español, y por significado si la activas.
- **Memoria para tu agente.** Tu agente puede guardar lo que aprendió —un resumen, una preferencia— y encontrarlo
  después.
- **Una sola búsqueda en todas tus herramientas,** si la conectas: lo que guarda queda junto a los mensajes, el
  correo, las reuniones y los documentos de las demás herramientas.
- **Trabajo con agentes de IA.** Cada comando de tu herramienta está listo para un agente, y tú decides qué puede
  cambiar.
- **Tus cuentas no se mezclan.** Siempre indicas qué cuenta usa un comando, así nada va a la cuenta equivocada.
- **Inicio de sesión y contraseñas a salvo.** Las claves se quedan en el llavero de tu ordenador y nunca aparecen en
  la salida.
- **Comprobaciones que la mantienen funcionando.** La plantilla trae las mismas comprobaciones que ejecuta toda
  herramienta WireCat, para que la tuya siga funcionando mientras WireCat crece.

## Qué necesitas

- **Una cuenta en el servicio** y una forma de que los programas lleguen a él. La mayoría de los servicios te dan una
  clave de API en sus ajustes o dejan que una app inicie sesión por ti. Un enlace a la documentación para
  desarrolladores del servicio ayuda mucho a tu agente.
- **Un agente de IA para programar que pueda ejecutar comandos**: Claude Code, Codex, Cursor, Gemini CLI u otro
  parecido.
- **Node.js, pnpm y git** en tu ordenador.

## Empieza desde la plantilla

[cli-template](https://github.com/WireCatLabs/cli-template) es donde empieza toda herramienta nueva. Este comando
hace unas preguntas cortas sobre el servicio y crea una herramienta llamada `acme` en la carpeta `acme-cli`:

```sh
npx @wirecat/cli-template new acme-cli --command acme --package @example/acme-cli --owner example
```

Comprueba que la nueva herramienta se ejecuta:

```sh
cd acme-cli && pnpm install && pnpm build
node dist/bin/acme.js personal doctor
```

`personal` es el perfil: un nombre para una de tus cuentas. Ahora abre la carpeta `acme-cli` con tu agente de IA.

## Qué pasa después

1. **Dile a tu agente lo que quieres.** Nombra el servicio, dale el enlace a la documentación para desarrolladores y
   di qué quieres hacer. Por ejemplo: «Conecta acme a la API de Acme CRM. La documentación está en
   https://example.com/api. Quiero ver mis acuerdos y encontrar uno por su nombre».
2. **Responde a sus preguntas.** El agente pregunta cómo se inicia sesión, qué guarda el servicio y qué no debe
   guardarse nunca. Bastan respuestas cortas.
3. **Prueba cada comando con tu propia cuenta.** El agente construye los comandos uno a uno, por ejemplo uno que lista
   tus acuerdos. Ejecútalos y dile al agente qué está mal o qué falta.
4. **Haz que se pueda buscar.** Pide al agente que guarde en WireCat lo que devuelve el servicio, para que la búsqueda
   y tus agentes lo encuentren junto a tus chats y tu correo. [Añadir una fuente](./build-concepts.md#añadir-una-fuente) explica cómo.
5. **Compártela, si quieres.** Cuando pasen las comprobaciones incluidas, publica la herramienta en npm. Otras
   personas la instalan con npm en un terminal, o la añaden en WireCat Desktop por su nombre en npm:
   [Prepárala para WireCat Desktop](#prepárala-para-wirecat-desktop).

## Si te atascas

- Ejecuta `node dist/bin/acme.js personal doctor` en la carpeta de la herramienta. Comprueba la instalación, los
  ajustes y los perfiles.
- Pide a tu agente que vuelva a leer las instrucciones de la plantilla. Cubren los problemas habituales.
- Abre una incidencia en [cli-template](https://github.com/WireCatLabs/cli-template/issues) para una pregunta o un
  error. No incluyas claves, contraseñas ni datos privados.

## Aparece en wirecat.dev

Una herramienta fuera de WireCatLabs puede aparecer aquí en el grupo «Herramientas de la comunidad». Abre un pull
request a [cli-docs](https://github.com/WireCatLabs/cli-docs) que la añada a `tools.json` con `"community": true`.
Sus páginas se copian entonces desde su repositorio en una etiqueta de versión revisada, como las nuestras. La
[lista de revisión](https://github.com/WireCatLabs/cli-docs/blob/main/docs/REVIEWING.md#community-tools) dice qué
comprobamos. Una herramienta de la comunidad publica en su propio ámbito de npm: `@wirecat` y el nombre «WireCat»
siguen siendo nuestros. Una herramienta de la lista con una entrada `desktop` aparece también en WireCat Desktop, con la
etiqueta **Comunidad**, para quien active **Activar herramientas de la comunidad**. Mientras no esté en la lista,
cualquiera puede añadirla por su nombre en npm, como herramienta sin revisar.
[Añade tu herramienta a WireCat](./build-list-tool.md) explica cada paso, del pull request a WireCat Desktop.

## Prepárala para WireCat Desktop

WireCat Desktop puede añadir una herramienta que WireCat no ha revisado, por su nombre en npm
([Añadir tu propia herramienta](./desktop/index.mdx#añadir-tu-propia-herramienta); llega en la próxima versión de
WireCat Desktop). Antes de instalar nada, lee tres cosas de npm: los datos del paquete, el registro de dónde lo compiló
npm y el archivo `contracts/wirecat.json` del propio paquete. Nunca ejecuta el paquete para saber qué herramienta es.
Por eso tu herramienta necesita ese archivo, una carpeta de datos con el nombre de su paquete y una versión que npm
pueda vincular a tu repositorio.

### El manifiesto

`contracts/wirecat.json` es el manifiesto: lo que tu herramienta dice de sí misma a WireCat. Lista los comandos con lo
que lee y escribe cada uno, y los comandos con los que Desktop comprueba, configura, sincroniza y conecta la
herramienta. Necesita `@wirecat/cli-base` 0.81.0 o posterior.

- **Se genera, nunca se escribe a mano.** `cli-dev manifest` lo escribe a partir del programa compilado y de una
  identidad que exportas. Tú escribes solo lo que el código no puede saber: un `tagline` (55 caracteres como mucho),
  los textos de inicio de sesión `signIn.gives` y `signIn.asks` y, con un comando `sync`, `syncs` (qué copia, 40
  caracteres como mucho).
- **Se hace commit y se publica.** Haz commit del archivo. `files` en `package.json` incluye
  `contracts/wirecat.json`, así que va dentro del paquete en npm.
- **CI lo mantiene al día.** `pnpm contracts:check` falla cuando el archivo ya no coincide con el programa.
- **No lleva versión.** Desktop lee la versión de npm, así que una versión nueva no cambia el archivo.

Una herramienta creada con cli-template 0.19.0 o posterior trae todo esto desde `new`:

- El bin llama a `wcatStart` antes de cargar el programa, con `DESKTOP` de `src/identity.ts`: el enlace a la
  documentación, la frase para Desktop (`--tagline`, hecha a partir de la descripción si no la das) y los textos de
  inicio de sesión según tu respuesta a `--sign-in`. Reescribe los textos con tus palabras. `src/wcat.ts` añade la clave
  de permiso de cada comando y exporta todo como `WCAT`.
- `package.json` nombra el programa dos veces: con la palabra del comando (`acme-crm`) y como `wcat-acme-crm`, que
  ejecuta `wcat acme-crm`.
- `pnpm generate` escribe `contracts/wirecat.json` con `cli-dev manifest`, y `pnpm contracts:check` lo comprueba.

**Para un CLI creado antes de 0.19.0:** añádelo a mano, porque `src/` y `package.json` son tuyos y `upgrade` no los
cambia. Añade la llamada a `wcatStart` en el bin, `DESKTOP` en `src/identity.ts`, `src/wcat.ts`, el nombre de programa
`wcat-<comando>` y `cli-dev manifest --program dist/program.js --identity dist/wcat.js` (con `--check` para las
comprobaciones) en los scripts `generate`, `generate:check` y `contracts:check`. Pasa a `@wirecat/cli-base` 0.82.0. Un
CLI nuevo creado con 0.19.0 muestra cada archivo.

Con el archivo en el paquete, `wcat-acme-crm --wcat-describe` responde en el formato 2: el nombre, la versión, la
descripción y el enlace a la documentación con `"wcat_describe": 2`, más la parte `desktop` del archivo y
`manifest_sha256`, el hash del archivo. Tras la instalación, Desktop lo ejecuta una vez y rechaza la herramienta si el
hash no coincide con el archivo que mostró en la revisión. La
[regla WC-CMD-29 de cli-base](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/commands.md#wc-cmd-29--answer---wcat-describe-and-take-no-name-wirecat-reserves)
tiene el formato exacto.

### La carpeta de datos

**Desinstalar y borrar datos** en Desktop borra solo las carpetas con el nombre de la herramienta, así que ese nombre
debe ser de tu herramienta. Para un paquete `@<scope>/<name>`, el `appName` de la identidad, en minúsculas, es
`<scope>-<name>` o empieza por `<scope>-<name>-`. Cada `.` y `_` del nombre del paquete pasa a ser `-`, y el nombre
entero tiene 64 caracteres como mucho: `@leemour/acme-crm-cli` → `leemour-acme-crm-cli`. cli-template 0.19.0 y posteriores lo
escriben así para todo paquete fuera de `@wirecat`, y dan el mismo nombre a la skill y a las entradas del llavero;
consérvalo si renombras la herramienta. Un CLI creado antes de 0.19.0 tiene `appName` sin el ámbito (`acme-crm-cli`):
cámbialo en `src/identity.ts` antes de su primera versión. Desktop rechaza un manifiesto que incumple esta regla.

### Publica con tu propio ámbito

Publica con tu propio ámbito de npm, como `@leemour/acme-crm-cli`. El ámbito `@wirecat`, el nombre «WireCat» y los
nombres que WireCat reserva para sus herramientas, como `tg`, `mail` o `wcat`, siguen siendo nuestros.

1. **Haz público el repositorio.** npm no registra dónde compiló un paquete de un repositorio privado, y WireCat
   Desktop muestra ese registro en su revisión.
2. **Publica la primera versión a mano** con `bin/release --local`. npm solo deja configurar un publicador de
   confianza en un paquete que ya existe.
3. **Configura el publicador de confianza** en npmjs.com, como dice la página de npm
   [Trusted publishing](https://docs.npmjs.com/trusted-publishers): tu propietario y repositorio de GitHub, el archivo
   de flujo de trabajo `release.yml` (distingue mayúsculas) y el entorno `npm`. La publicación de confianza necesita
   npm 11.5.1 o posterior.
4. **A partir de ahí, publica con `bin/release`.** Lanza `release.yml`, que publica sin token de npm, y npm registra
   dónde compiló cada versión.

### Añádela en Desktop y luego pide entrar en la lista

1. **Añádela en tu propio ordenador.** En WireCat Desktop, activa **Permitir herramientas que WireCat no ha revisado**
   en Ajustes y usa **Añadir tu propia herramienta** en la página Herramientas con tu nombre de npm. Tu herramienta
   aparece con la etiqueta **Sin revisar**. Una herramienta de un repositorio privado solo se puede añadir así.
2. **Pide entrar en la lista,** si quieres que la encuentre todo el mundo. Una herramienta de la lista aparece en
   wirecat.dev y, con la etiqueta **Comunidad**, en WireCat Desktop. La lista es para editores aprobados:
   [Añade tu herramienta a WireCat](./build-list-tool.md) explica los pasos y qué comprobamos.

## De principio a fin, con un ejemplo

Este recorrido crea `@leemour/acme-crm-cli`, una herramienta inventada para un Acme CRM inventado: los nombres son un
ejemplo, y ese paquete no existe. Usa tu propio ámbito y tu servicio.

1. **Crea la herramienta.**

   ```sh
   npx @wirecat/cli-template new acme-crm-cli --command acme-crm --package @leemour/acme-crm-cli --owner leemour \
     --category crm --tagline "Your Acme CRM deals, searchable on your computer"
   cd acme-crm-cli && pnpm install
   ```

2. **Añade un comando con tu agente.** Abre la carpeta con tu agente de IA y pídele: «Añade `deals list`: lista mis
   acuerdos de la API de Acme CRM, documentación en https://example.com/api. Solo lee». Pruébalo con tu cuenta tras
   `pnpm build`: `node dist/bin/acme-crm.js personal deals list`.
3. **Revisa lo que mostrará Desktop.** Reescribe los textos de inicio de sesión en `DESKTOP` en `src/identity.ts`, por
   ejemplo `gives: "your Acme CRM contacts and deals"` y `asks: "an Acme CRM API token"`. `appName` ya es
   `leemour-acme-crm-cli`.
4. **Genera y haz commit.** `pnpm generate` compila la herramienta y reescribe sus contratos, entre ellos el
   manifiesto `contracts/wirecat.json`:

   ```sh
   pnpm generate
   git add contracts src && git commit -m "feat: deals list"
   ```

5. **Publica.** La primera vez con `bin/release --local`; luego configura el publicador de confianza y usa
   `bin/release`, como dice [Publica con tu propio ámbito](#publica-con-tu-propio-ámbito).
6. **Añádela en Desktop.** Activa **Permitir herramientas que WireCat no ha revisado**, pulsa **Añadir tu propia
   herramienta**, escribe `@leemour/acme-crm-cli`, lee la revisión y pulsa **Añadir** e **Instalar y ejecutar**. Tras
   **Reiniciar ahora**, abre **Gestionar** en su fila, añade el perfil `personal` e inicia sesión.
7. **Conecta tu agente.** En la página Agentes, **Conectar** da a Claude Code la skill de la herramienta. En un
   terminal, lo mismo es:

   ```sh
   wcat-acme-crm skill install --for claude
   ```

8. **Pregunta a tu agente.** En Claude Code: «Usa acme-crm con el perfil personal: ¿qué acuerdos míos se cierran este
   mes y quién es el contacto de cada uno?»

## Recibe las mejoras de la plantilla

La plantilla sigue mejorando. En tu herramienta, con el árbol de trabajo de git limpio, ejecuta:

```sh
npx @wirecat/cli-template upgrade
```

Para cada archivo de la plantilla que cambió desde tu versión, pregunta qué hacer: **apply** une el cambio con tu
archivo, **replace** toma el archivo de la plantilla, **skip** conserva el tuyo y **diff** muestra antes el cambio. Un
conflicto deja las marcas habituales de git; resuelve el conflicto y vuelve a ejecutar `upgrade`. Los archivos que la plantilla
solo puso una vez, como tu código y tus páginas, nunca se tocan. `--dry-run` lista lo que cambiaría y no escribe nada.

## Detalles de la plantilla

Para cuando tú o tu agente necesitéis las opciones exactas.

### Las ocho preguntas

Cada respuesta, salvo la frase para Desktop y los idiomas, es una opción de una lista corta, y también admite `other:<tu respuesta>`. Sin
terminal, por ejemplo en un script o en la shell de un agente, pásalas como opciones. Entonces una respuesta que falta
es un error que lista las opciones; no se adivina nada.

| Pregunta | Opción | Valores (varios, separados por comas) |
| --- | --- | --- |
| ¿Qué frase debe mostrar WireCat Desktop? | `--tagline` | 55 caracteres como mucho; si falta, se hace a partir de la descripción |
| ¿Qué tipo de herramienta es? | `--category` | `messenger`, `mail`, `notes`, `files`, `meetings`, `calendar`, `crm` |
| ¿En qué idiomas está el contenido? | `--content-lang` | códigos de idioma, se admiten varios: `en,ru` |
| ¿Cómo inicia sesión una persona? | `--sign-in` | `oauth`, `token`, `session` (código por teléfono, QR), `none` |
| ¿Qué ofrece el servicio para construir? | `--api` | `official-client`, `official-docs`, `unofficial` |
| ¿Cómo filtra la gente lo que encuentra? | `--filters` | varios de `time`, `person`, `container`, `text`, `status` |
| ¿Qué nunca debe llegar al almacén, a un registro o a la salida? | `--never-store` | varios de `tokens`, `codes`, `secret-links`, `content` |
| ¿Qué entrada no fiable llega? | `--untrusted` | varios de `files`, `links`, `names`, y `messages` (messenger, mail), `records` (crm), `invitations` (calendar) o `transcripts` (meetings); o `none` solo |

La misma herramienta, creada sin ninguna pregunta:

```sh
npx @wirecat/cli-template new acme-cli --command acme --package @example/acme-cli --owner example \
  --category notes --content-lang en --sign-in token --api official-docs --filters time,text \
  --never-store tokens --untrusted messages,links
```

### Aprende de una herramienta parecida

La plantilla no trae código de ejemplo. Tu agente aprende de la herramienta WireCat más cercana a la tuya, elegida por
la primera respuesta:

| Tipo de herramienta | Herramienta de referencia |
| --- | --- |
| mensajería | [`whatsapp-cli`](https://github.com/WireCatLabs/whatsapp-cli), luego [`tg-cli`](https://github.com/WireCatLabs/tg-cli) y [`max-cli`](https://github.com/WireCatLabs/max-cli) |
| archivos y documentos | [`drive-cli`](https://github.com/WireCatLabs/drive-cli) |
| reuniones | [`zoom-cli`](https://github.com/WireCatLabs/zoom-cli) |
| notas | [`cli-memo`](https://github.com/WireCatLabs/cli-memo) |
| calendario | [`gcal-cli`](https://github.com/WireCatLabs/gcal-cli) |
| correo | [`mail-cli`](https://github.com/WireCatLabs/mail-cli) |
| CRM | [`bitrix24-cli`](https://github.com/WireCatLabs/bitrix24-cli) |
| otra | todavía ninguna: elige la más cercana con tu agente |

### Cuatro pasos que hace una persona

`new` los muestra al final. El último solo se aplica a las herramientas de la organización WireCatLabs.

1. Crea el repositorio y protege su rama `main`, como dice la
   [lista para un CLI nuevo](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/new-cli.md).
2. Publica la primera versión a mano con `bin/release --local`: npm ofrece la publicación de confianza solo para un
   paquete que ya existe. Después configura en npm la publicación de confianza para tu paquete, con `release.yml`, y
   añade los secretos que necesite. [Publica con tu propio ámbito](#publica-con-tu-propio-ámbito) da los detalles.
3. Elige para las comprobaciones mensuales un día del mes que no use ningún otro de tus repositorios. El
   `.github/workflows/monthly.yml` de la plantilla trae un valor provisional que CI rechaza hasta que lo cambies.
4. **Solo herramientas de WireCatLabs:** añade la herramienta a los grupos de comparación de cli-base, a la lista de
   herramientas WireCat de cli-core y al `tools.json` de este sitio.

Una herramienta fuera de WireCatLabs guarda en su lugar su propio archivo de grupos y ejecuta
`cli-dev audit --groups <file>`, así se compara con nuestras herramientas sin un pull request a cli-base.

## Adónde ir después

1. [Conceptos en cinco minutos](./build-concepts.md): cómo guarda WireCat registros de muchas fuentes.
2. [Añadir una fuente](./build-concepts.md#añadir-una-fuente): guarda los datos de tu servicio para que la búsqueda y los agentes los
   usen.
3. [Guardar tus propios datos](./build-concepts.md#guardar-tus-propios-datos): dónde guarda tu herramienta lo que solo ella necesita.
4. [Iniciar sesión en un servicio](./build-sign-in.md): claves, el llavero y las cuentas.
5. [Cumplir los estándares y mantenerse al día](./build-sign-in.md#cumplir-los-estándares-y-mantenerse-al-día): comprobaciones, versiones y
   actualizaciones.
