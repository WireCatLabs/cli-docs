---
title: "Crea tu CLI"
description: "Empieza una herramienta WireCat nueva desde cli-template en minutos, mira qué le da el núcleo compartido y por qué funciona así."
---

Quieres una herramienta de línea de comandos para un servicio —un calendario, una app de notas, un chat— que usen
personas y agentes de IA, y que funcione con las demás herramientas de WireCat. Lo más rápido es empezar desde la
plantilla. Esta página muestra el inicio, qué le da WireCat a tu herramienta, los pasos en breve y después por qué
funciona así.

## Empieza desde la plantilla

[cli-template](https://github.com/WireCatLabs/cli-template) crea un esqueleto que funciona: los comandos compartidos,
los ajustes, la guía para agentes y el servidor MCP se ejecutan, y pasan todas las comprobaciones de los estándares de
WireCat. Te hace unas preguntas sobre el servicio y escribe las respuestas en un archivo de diseño para ti o tu agente.

```sh
git clone https://github.com/WireCatLabs/cli-template.git
cd cli-template && pnpm install && pnpm kit:build && cd ..
node cli-template/kit/dist/main.js new acme-cli --command acme --package @example/acme-cli --owner example
cd acme-cli && pnpm install && pnpm build
node dist/bin/acme.js personal doctor
```

`personal` es el perfil: un nombre para una cuenta. Todo comando que usa una cuenta empieza por él; nunca se da por
supuesto.

`new` muestra los pasos que necesitan a una persona: crear el repositorio, configurar la publicación en npm y elegir un
día para las comprobaciones mensuales. Luego pasa `docs/dev/DESIGN.md` a tu agente y construye la herramienta.

## Qué le da WireCat a tu herramienta

- **Un almacén y una búsqueda compartidos.** Tus registros están junto a los mensajes, el correo, las reuniones y los
  documentos de las demás herramientas, y memo busca en todos.
- **Un servidor MCP para agentes.** Cada comando se ofrece a un agente, también las escrituras, tras las claves de
  permiso del perfil.
- **Cuentas bien resueltas.** El perfil siempre es explícito, y una lectura entre cuentas las cubre todas.
- **Inicio de sesión y secretos.** Los tokens se guardan en el llavero del sistema y nunca llegan a la salida ni a los
  registros.
- **Comprobaciones que te mantienen dentro de los estándares.** `cli-dev lint`, las reglas de lint compartidas y las
  comprobaciones de publicación vienen con la plantilla.

## Cómo construirla, en breve

1. **Describe el servicio.** Responde a las preguntas de `docs/dev/DESIGN.md`: qué guarda el servicio, cómo se inicia
   sesión, qué no debe guardarse nunca.
2. **Escribe el adaptador.** Una parte de tu código habla con el servicio y convierte sus objetos en los tipos de tu
   herramienta.
3. **Guarda registros de origen.** Guarda lo que devuelve el servicio a través de cli-core, con el id del servicio en
   `external_id`. cli-core los vincula con las personas, eventos y documentos que las demás herramientas ya conocen.
   Ver [Añadir una fuente](./build-add-source.md).
4. **Mantén tus tablas aparte.** Los puntos de sincronización y los datos en caché van en el archivo propio de tu herramienta.
   Ver [Guardar tus propios datos](./build-own-data.md).
5. **Nombra los comandos con las palabras compartidas.** `list`, `show`, `search`, las mismas opciones que las demás
   herramientas; `cli-dev lint` te avisa cuando un nombre no encaja.
6. **Publica.** `pnpm release:check` ejecuta todas las comprobaciones que piden los estándares. Ver
   [Cumplir los estándares y mantenerse al día](./build-stay-compliant.md).

## Por qué funciona así

**Un solo almacén, para que las respuestas crucen herramientas.** Una pregunta como «¿qué decidimos sobre el
lanzamiento?» necesita el chat, el correo y las notas de la reunión juntos. Eso solo funciona cuando todas las
herramientas escriben en el mismo almacén con los mismos nombres de campo.

**Registros de origen y entidades, para no contar nada dos veces.** La misma reunión llega de dos calendarios y de
Zoom. Cada copia es un registro de origen; la reunión es una sola entidad. Cuando las herramientas no pueden distinguir
dos candidatos, no crean vínculo y preguntan al propietario. Una fusión equivocada es peor que un duplicado. El modelo
está en [Conceptos en cinco minutos](./build-concepts.md).

**Un perfil explícito, para que ningún comando toque la cuenta equivocada.** Una herramienta que elige «la primera
cuenta» acaba enviando un mensaje de trabajo desde una cuenta personal. Sin perfil, el comando falla y lista las
opciones.

**Cada comando por MCP, tras permisos, para que los agentes hagan trabajo real con seguridad.** Un agente recibe los
mismos comandos que una persona. El propietario decide qué se ejecuta con claves de permiso, y cada escritura queda en
el registro.

**Estándares compartidos, para que el núcleo cambie sin romperte.** Las reglas están en un solo
[manual](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md), y las máquinas comprueban la
mayoría. Una herramienta que las sigue sigue funcionando cuando cambia cli-core, y el comando `upgrade` de la
plantilla trae sus cambios posteriores a tu herramienta.

## Adónde ir después

1. [Conceptos en cinco minutos](./build-concepts.md): entidades, registros de origen, `external_id`, vínculos.
2. [Añadir una fuente](./build-add-source.md): escribe los registros de tu servicio en el almacén compartido.
3. [Guardar tus propios datos](./build-own-data.md): las tablas privadas de tu herramienta.
4. [Iniciar sesión en un servicio](./build-sign-in.md): tokens, el llavero, el perfil.
5. [Cumplir los estándares y mantenerse al día](./build-stay-compliant.md): comprobaciones, versiones,
   actualizaciones.
