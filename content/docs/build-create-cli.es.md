---
title: "Crea tu CLI"
description: "Conecta un servicio que WireCat aún no admite: crea tu propia herramienta con nuestra plantilla y tu agente de IA, con guías para cada paso."
---

Puedes crear tu propia herramienta WireCat para cualquier servicio o API, y rápido, con nuestra plantilla y tu agente
de IA. ¿Usas un CRM, un gestor de tareas o una app de notas que WireCat aún no admite? Añádelo tú. Tu herramienta
funciona como las demás: tú y tus agentes podéis buscar en ella, preguntar por ella y actuar en ella junto a tus
chats, tu correo y tus reuniones.

Esta página muestra lo que hace falta, lo que obtienes y por dónde empezar. Las guías siguientes te acompañan en cada
parte.

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

- **Búsqueda en todo a la vez.** Lo que guarda tu herramienta está junto a los mensajes, el correo, las reuniones y
  los documentos de las demás herramientas, y una sola pregunta busca en todo.
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

[cli-template](https://github.com/WireCatLabs/cli-template) es donde empieza toda herramienta nueva. Estos comandos
crean una herramienta llamada `acme` y comprueban que se ejecuta:

```sh
git clone https://github.com/WireCatLabs/cli-template.git
cd cli-template && pnpm install && pnpm kit:build && cd ..
node cli-template/kit/dist/main.js new acme-cli --command acme --package @example/acme-cli --owner example
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
   y tus agentes lo encuentren junto a tus chats y tu correo. [Añadir una fuente](./build-add-source.md) explica cómo.
5. **Compártela, si quieres.** Cuando pasen las comprobaciones incluidas, publica la herramienta en npm y otras
   personas la instalarán como cualquier herramienta WireCat.

## Si te atascas

- Ejecuta `node dist/bin/acme.js personal doctor` en la carpeta de la herramienta. Comprueba la instalación, los
  ajustes y los perfiles.
- Pide a tu agente que vuelva a leer las instrucciones de la plantilla. Cubren los problemas habituales.
- Abre una incidencia en [cli-template](https://github.com/WireCatLabs/cli-template/issues) para una pregunta o un
  error. No incluyas claves, contraseñas ni datos privados.

## Adónde ir después

1. [Conceptos en cinco minutos](./build-concepts.md): cómo guarda WireCat registros de muchas fuentes, y por qué.
2. [Añadir una fuente](./build-add-source.md): guarda los datos de tu servicio para que la búsqueda y los agentes los
   usen.
3. [Guardar tus propios datos](./build-own-data.md): dónde guarda tu herramienta lo que solo ella necesita.
4. [Iniciar sesión en un servicio](./build-sign-in.md): claves, el llavero y las cuentas.
5. [Cumplir los estándares y mantenerse al día](./build-stay-compliant.md): comprobaciones, versiones y
   actualizaciones.
