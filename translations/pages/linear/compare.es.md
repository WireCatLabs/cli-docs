---
title: "Comparado con otras herramientas"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`linear` es una línea de comandos y un servidor MCP para Linear: incidencias, proyectos, equipos, estados, etiquetas y
comentarios. Esta página lo pone junto a las otras herramientas con las que un agente de IA lee y cambia Linear, para
que veas cuál encaja con tu trabajo. Las marcas de `linear` salen de su versión publicada, sus comandos y su
documentación, comprobados el 25 de noviembre de 2026 con linear-cli 0.4.1, no con un espacio de trabajo real. Se
comprueban otra vez en cada versión. Las marcas de las otras herramientas salen de su propia documentación y su código,
enlazados en la tabla, comprobados el 19 de noviembre de 2026. No se inició sesión en ninguna ni se probó nada en vivo,
y una herramienta puede hacer más de lo que dicen sus páginas.

Las herramientas:

- **linear**: esta herramienta. Guarda una copia de tu espacio de trabajo de Linear en tu ordenador, llega a cada
  operación de la API de Linear y decide para cada acción qué puede hacer un agente. Inicia sesión con una clave de API
  personal.
- **[Linear MCP](https://linear.app/docs/mcp)**: el servidor MCP oficial de Linear, que el propio Linear ejecuta en
  `mcp.linear.app`. Conectas una app de IA a él e inicias sesión en Linear en el navegador.
- **[schpet/linear-cli](https://github.com/schpet/linear-cli)**: la línea de comandos de código abierto para Linear
  con más estrellas (1051 estrellas, cambiada el 17 de noviembre de 2026). Su comando también se llama `linear`.
  Trabaja junto a git y jj: empieza una incidencia en una rama nueva y abre su pull request. Sus marcas siguen su rama
  principal, que es la próxima versión 4.0.
- **[linearis](https://github.com/linearis-oss/linearis)**: una línea de comandos para Linear hecha para agentes de
  IA, con salida solo en JSON (267 estrellas, cambiada el 28 de octubre de 2026). Cubre las operaciones del trabajo
  diario, no toda la API.
- **[mcp-linear](https://github.com/tacticlaunch/mcp-linear)**: el servidor MCP de código abierto para Linear con más
  estrellas entre los que siguen mantenidos (151 estrellas, cambiado el 13 de noviembre de 2026), con 240
  herramientas, en npm como `@tacticlaunch/mcp-linear`.

Linear deja entrar a un programa con una
[clave de API personal](https://linear.app/docs/api-and-webhooks), creada en los ajustes de seguridad de la cuenta.
Actúa con los permisos de ese usuario. Una clave se puede limitar a algunos permisos, como solo lectura, y a algunos
equipos. Todas las herramientas de esta página aceptan una clave así, y Linear MCP también inicia sesión con OAuth. El
servidor anterior de la comunidad,
[linear-mcp-server](https://github.com/jerhadf/linear-mcp-server/blob/5e2cb621c52762618eb015b4a8d6bf884021b29e/README.md?plain=1#L5)
(348 estrellas), ya no se mantiene y remite a Linear MCP, así que no está en la tabla. Tampoco el SDK y la API GraphQL
del propio Linear, que son para programadores que escriben su propio código.

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

## Funciones

| Tarea | linear | [Linear MCP](https://linear.app/docs/mcp) | [schpet/linear-cli](https://github.com/schpet/linear-cli) | [linearis](https://github.com/linearis-oss/linearis) | [mcp-linear](https://github.com/tacticlaunch/mcp-linear) |
|---|:-:|:-:|:-:|:-:|:-:|
| **Buscar y leer** | | | | | |
| Leer incidencias sin internet | ✅ | [❌](https://linear.app/docs/mcp) | [❌](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/config/options.rs#L20) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/src/client/graphql-client.ts#L7) | [❌](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/src/index.ts#L43-L46) |
| Encontrar una incidencia por sus palabras | ✅ | [✅](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L157-L158) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L80-L82) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L129) |
| Listar incidencias por estado o persona asignada | ✅ | ➖ | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L153-L159) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/src/commands/issues.ts#L693-L703) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/src/tools/definitions/issue-tools.ts#L276-L300) |
| Listar proyectos, equipos, usuarios, estados y etiquetas | ✅ | [🟡](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/cli/mod.rs#L130-L168) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L162-L170) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L47-L76) |
| **Cambiar** | | | | | |
| Crear y actualizar una incidencia | ✅ | [✅](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L166-L173) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L84-L85) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L130-L131) |
| Comentar una incidencia | ✅ | [✅](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L177-L181) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L97-L108) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L132) |
| Cada consulta y mutación de la API de Linear | ✅ | [🟡](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/cli/mod.rs#L180-L184) | [🟡](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L146-L152) | [🟡](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/README.md?plain=1#L16-L30) |
| Convertir una incidencia en tu tarea | ✅ | ➖ | ➖ | ➖ | ➖ |
| **Agentes y seguridad** | | | | | |
| Dejar que un agente solo lea | ✅ | [✅](https://linear.app/docs/mcp) | [🟡](https://linear.app/docs/api-and-webhooks) | [🟡](https://linear.app/docs/api-and-webhooks) | [🟡](https://linear.app/docs/api-and-webhooks) |
| Elegir para cada acción: permitir, preguntar o rechazar | ✅ | ➖ | ➖ | ➖ | ➖ |
| Borrar o archivar necesita su propio permiso | ✅ | ➖ | [🟡](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/cli/mod.rs#L218-L222) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L160) | [❌](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L170) |
| Ver lo que enviaría un cambio, sin enviarlo | ✅ | ➖ | ➖ | ➖ | ➖ |
| La clave se guarda en el llavero del sistema | ✅ | n/a | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/docs/authentication.md?plain=1#L13-L15) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/src/common/encryption.ts#L11-L14) | [❌](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/README.md?plain=1#L152-L168) |
| Un agente en una terminal trabaja con comandos, sin MCP | ✅ | n/a | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L414-L419) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L223-L231) | n/a |
| **Configuración** | | | | | |
| Un servidor MCP | ✅ | [✅](https://linear.app/docs/mcp) | [❌](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/cli/mod.rs#L129-L184) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L233-L242) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/README.md?plain=1#L5-L7) |
| Funciona desde ChatGPT o Claude en el navegador | 🟡 | [✅](https://linear.app/docs/mcp) | n/a | n/a | [❌](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/src/mcp-server.ts#L127-L128) |
| Varios espacios de trabajo, cada uno nombrado en el comando | ✅ | [🟡](https://linear.app/docs/mcp) | [🟡](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/docs/authentication.md?plain=1#L3-L11) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/src/common/auth.ts#L19-L41) | [🟡](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/README.md?plain=1#L86) |

| | linear | Linear MCP | schpet/linear-cli | linearis | mcp-linear |
|---|---|---|---|---|---|
| Instalación | npm, Node 22.16+ o 24+ | ninguna: lo ejecuta Linear, tú añades su dirección a tu app de IA | Homebrew, npm, un binario o cargo | npm, Node 22+ | npm o `npx`, Node 20+ |
| Inicio de sesión | clave de API personal | OAuth en el navegador, o una clave de API en una cabecera | clave de API personal | clave de API personal | clave de API personal, o el token OAuth de tu propia app OAuth de Linear |
| Licencia | Apache-2.0 | servicio cerrado | ISC | MIT | MIT |
| Precio | gratis | no indicado en su página | gratis | gratis | gratis |

Notas sobre la columna de `linear`:

- **Inicio de sesión.** Una clave de API personal actúa con los permisos del usuario de Linear que la creó.
  `session start` la lee de stdin o de una pregunta oculta, nunca de un argumento, y la comprueba con Linear antes de
  guardarla. Se guarda en el llavero del sistema, o en un archivo privado en un ordenador sin llavero. Mira la
  [instalación](./installation.md).
- **Sin internet.** `sync` copia equipos, usuarios, estados, etiquetas, proyectos, sprints (los ciclos de Linear),
  incidencias y comentarios al almacén local de WireCat. Los archivados se guardan también, marcados. Después de la
  primera vez lee solo lo que cambió, y una vez al día encuentra lo que Linear borró o movió a su papelera.
  `issues list`, `issues show` e `issues search` leen esta copia, también con `--offline`. La copia pertenece al
  usuario cuya clave inició sesión, porque Linear muestra a cada miembro equipos distintos.
- **Cambios.** `issues create`, `issues update` e `issues comments create` crean, cambian y comentan una incidencia
  con opciones sencillas, como `--title`, `--status` y `--text`. Cada escritura comprueba su propia clave de permiso, y
  `--dry-run` muestra lo que enviaría.
- **El grupo api.** `linear <perfil> api` tiene un comando para cada consulta y cada mutación del esquema GraphQL de
  Linear, cada uno con sus opciones y su ayuda. `api list` los nombra todos.
- **Tu tarea.** Después de cada `sync`, cada incidencia abierta asignada a ti es una tarea de WireCat, con la clave y
  el título de la incidencia, y se cierra cuando la incidencia se completa, se cancela o pasa a otra persona.
  `issues assign ENG-12` convierte cualquier otra incidencia en tu tarea. Ninguno de los dos cambia nada en Linear ni
  asigna la incidencia a nadie allí.
- **Solo lectura.** `WCLINEAR_READ_ONLY=1` rechaza cualquier cambio, digan lo que digan los ajustes. El nivel
  `readonly` hace lo mismo para una clave, como `api`.
- **Permitir, preguntar o rechazar.** Cada comando y cada operación de la API tiene su clave, con el valor `allow`,
  `ask`, `readonly` o `deny` para cada perfil en [los ajustes](./configuration.md#permissions). Un cambio pide su
  propia clave, y borrar o archivar necesita además `linear.delete`. `mcp serve --permission` hace una clave más
  estricta solo para un servidor.
- **Por MCP.** Nadie puede responder a `ask`, así que `ask` deja seguir al agente. Cada cambio que hizo un agente queda
  en `runs list`. Para impedir cambios, pon `permissions.api` en `readonly`, o una operación en `deny`.
- **Prueba en seco.** `--dry-run` muestra lo que un cambio enviaría a Linear, y no envía nada.
- **Varios espacios de trabajo.** Cada comando empieza con un perfil, un nombre que eliges para una cuenta. Nunca se
  supone un perfil, ni siquiera el único. Mira el [uso](./usage.md).
- **ChatGPT o Claude en el navegador.** `mcp serve --http` sirve la herramienta detrás de un túnel que configuras y
  mantienes en marcha tú mismo, por eso esta fila es en parte.

## Cuándo encaja mejor otra herramienta

- **Linear MCP**: quieres ChatGPT o Claude en el navegador sin ejecutar nada en tu ordenador, o prefieres iniciar
  sesión con OAuth y no crear una clave de API.
- **schpet/linear-cli**: trabajas con git o jj, y quieres empezar una incidencia en su rama y abrir su pull request
  desde la terminal. También adjunta archivos a incidencias y comentarios.
- **linearis**: un agente debe crear o actualizar muchas incidencias de una vez, o subir y bajar archivos, con una
  referencia de comandos corta en su contexto.
- **mcp-linear**: un agente trabaja solo por MCP y debe llegar a webhooks, clientes, plantillas y actualizaciones de
  proyecto con herramientas que tienen su propio nombre.

Si `linear` encaja, empieza por la [instalación](./installation.md). Para usarlo con un agente, mira el
[uso](./usage.md).
