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

## Empieza desde la plantilla

[cli-template](https://github.com/WireCatLabs/cli-template) es donde empieza toda herramienta nueva. En un ordenador
con Node.js, pnpm y git, estos comandos crean una herramienta llamada `acme` y comprueban que se ejecuta:

```sh
git clone https://github.com/WireCatLabs/cli-template.git
cd cli-template && pnpm install && pnpm kit:build && cd ..
node cli-template/kit/dist/main.js new acme-cli --command acme --package @example/acme-cli --owner example
cd acme-cli && pnpm install && pnpm build
node dist/bin/acme.js personal doctor
```

`personal` es el perfil: un nombre para una de tus cuentas. Luego abre la carpeta `acme-cli` con tu agente de IA y
dile qué servicio conectar. Las instrucciones de la plantilla lo guían desde ahí.

## Por qué funciona así

**Un solo lugar para todos tus datos, para que las respuestas lleguen de todas las herramientas a la vez.** Una
pregunta como «¿qué decidimos sobre el lanzamiento?» necesita el chat, el correo y las notas de la reunión juntos. Eso
solo funciona cuando todas las herramientas guardan en el mismo lugar y de la misma forma.

**Nada se cuenta dos veces.** La misma reunión puede llegar de dos calendarios y de Zoom. WireCat guarda cada copia y
sabe que son una sola reunión. Cuando no puede distinguir dos cosas, te pregunta en lugar de adivinar. Los detalles
están en [Conceptos en cinco minutos](./build-concepts.md).

**Siempre la cuenta que querías.** Una herramienta que elige «la primera cuenta» acaba enviando un mensaje de trabajo
desde una cuenta personal. Una herramienta WireCat se detiene y lista tus cuentas cuando no dices cuál.

**Los agentes hacen trabajo real, con seguridad.** Un agente recibe los mismos comandos que tú. Con los permisos
decides qué puede cambiar, y cada cambio queda registrado.

**Reglas compartidas, para que WireCat crezca sin romper tu herramienta.** Las reglas están en un solo
[manual](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md), y la mayoría se comprueban
automáticamente. El comando `upgrade` de la plantilla trae sus mejoras posteriores a tu herramienta.

## Adónde ir después

1. [Conceptos en cinco minutos](./build-concepts.md): cómo guarda WireCat registros de muchas fuentes.
2. [Añadir una fuente](./build-add-source.md): guarda los datos de tu servicio para que la búsqueda y los agentes los
   usen.
3. [Guardar tus propios datos](./build-own-data.md): dónde guarda tu herramienta lo que solo ella necesita.
4. [Iniciar sesión en un servicio](./build-sign-in.md): claves, el llavero y las cuentas.
5. [Cumplir los estándares y mantenerse al día](./build-stay-compliant.md): comprobaciones, versiones y
   actualizaciones.
