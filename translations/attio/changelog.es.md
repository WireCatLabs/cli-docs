---
title: "Historial de cambios"
---

Cambios destacados en `@wirecat/attio-cli`. Una sección por versión, la más nueva primero.

## 0.6.0 — 25.11.2026

### Añadido

- **Añade una nota o una tarea a una negociación, una persona o una empresa.** `activities create comment` añade una
  nota, `activities create task` una tarea con un título, un texto y una fecha límite, y `activities close` marca una
  tarea como hecha. Cada uno pregunta antes, como todo cambio en Attio. `activities list` lista las notas y tareas que
  guarda la copia, primero las tareas abiertas. Para añadirlas, el token necesita los ámbitos `note:read-write` y
  `task:read-write` ([uso](./usage.md#notes-and-tasks-on-a-deal)).

## 0.5.3 — 25.11.2026

### Corregido

- **La habilidad le dice a un agente que pregunte a `search all` por significado antes de leer cada nota.** Encuentra
  negociaciones por lo que significan sus notas y tareas una vez que `sync --embed` ha creado sus vectores, y después
  de los nombres exactos lista los nombres casi iguales y los nombres escritos en el otro alfabeto
  (`match: corrected`). En la prueba de agentes con HubSpot, un agente leyó cada nota y tomó un nombre casi igual.

## 0.5.2 — 25.11.2026

### Corregido

- **Una nota o tarea borrada en Attio sale de la copia local en la siguiente sincronización.** Se quedaba para siempre
  en `deals show` y en `search all`. Cada sincronización lee todas las notas y tareas de Attio, así que la que ya no
  aparece se marca como borrada. Cuando un token no puede leer una de las dos listas, no se quita nada. Si una
  sincronización fuera a quitar la mayoría de una vez, las retiene y lo dice hasta `attio work sync --rescan`.

## 0.5.1 — 24.11.2026

### Corregido

- **`search all` y `deals list` encuentran un nombre cirílico escrito con letras latinas**, marcado como corrección.
  Un agente que buscó el nombre de una empresa rusa en letras latinas no encontró nada y respondió mal.

## 0.5.0 — 24.11.2026

### Añadido

- **`search all` encuentra una negociación por el significado de sus notas y tareas**, con otras palabras o en otro
  idioma, después de que `sync --embed` cree los vectores. Hasta entonces busca por palabras y lo dice.
- **`search all` y `deals list` encuentran un nombre latino escrito en cirílico** (`феррара` encuentra Ferrara), y un
  nombre que difiere en una letra de una palabra de la búsqueda.

### Corregido

- **`people create` y `people update` ya no ofrecen `--owner`.** Una persona en Attio no tiene responsable, y la
  opción se rechazaba dos veces antes de la escritura. La ayuda lista solo las opciones que Attio acepta.

## 0.4.1 — 24.11.2026

### Corregido

- El `closed_date` de una negociación ganada o perdida es el día en que entró en esa etapa en Attio. Era el día de la
  primera sincronización que la vio cerrada, así que un filtro como `closed:>=90d` contaba cada negociación ganada
  antes de que instalaras `attio`.

## 0.4.0 — 24.11.2026

### Añadido

- **Notas y tareas en la copia.** Con el ajuste `activities` activado, `sync` también copia las notas y tareas de las
  negociaciones, personas y empresas que guarda. `deals show` las muestra, y `search all` encuentra una negociación
  por las palabras de sus notas. Está desactivado hasta que lo activas, y el token necesita `note:read` y `task:read`.
  Ejemplo: `attio work config set crm.attio:<workspace id>.activities on`. Ver
  [notas y tareas](./usage.md#notes-and-tasks-on-a-deal).

## 0.3.1 — 23.11.2026

### Corregido

- `organizations show` y `people show` dan la descripción del registro en Attio entre sus campos, así que un agente
  al que le preguntan a qué se dedica un cliente la encuentra.
- `people show` y `organizations show` aceptan el `person:<id>` y el `organization:<id>` que da una negociación,
  desde cli-core 0.736.0. Antes respondían `not_found`.

## 0.3.0 — 23.11.2026

### Añadido

- **Las negociaciones y las personas se escriben en Attio, y cada cambio te pregunta antes.** `deals create`,
  `update`, `move`, `close` y `delete`, y `people create` y `update`, envían el cambio a Attio y guardan su respuesta,
  como hacen los demás CLI de WireCat para CRM. Cada clave pregunta en una terminal, y también cada escritura de `api`.
  Sin terminal, una escritura espera a `--yes`. Por MCP sigue adelante, así que es tu cliente MCP el que pregunta. Una
  escritura también comprueba la clave `api` de la operación que envía, así que `permissions.api readonly` la detiene.
  `--email` y `--phone` sustituyen toda la lista. La moneda de una negociación es la del espacio de trabajo, y otra se
  rechaza. Una negociación nueva sin `--owner` es tuya, porque Attio necesita un responsable en cada negociación. Las
  empresas no se escriben aquí: una empresa de Attio no tiene atributo de correo ni de teléfono. Ejemplo:
  `attio work deals move deal:1 --stage "In Progress"`.
- **`account remove`.** Cierra la sesión de un perfil y, con `--delete-data`, borra su copia local, cosa que rechaza
  mientras otro perfil de aquí siga leyendo ese espacio de trabajo. El `session start` de un segundo perfil a un
  espacio de trabajo que tiene otro perfil se rechaza (`session.duplicate`).
- **`schedule`, como en las demás herramientas de WireCat para CRM.**
  `attio work schedule command crm --every 1h -- sync` sincroniza cada hora, y `schedule command crm-digest --at 08:00 -- changes list --format report` envía el
  resumen matutino del CRM.

### Cambiado — puede romper a quien llama

- **Un comando del CRM en un perfil sin sesión iniciada responde `session.missing`**, como todas las demás
  herramientas de WireCat. Respondía `auth.missing`, que no usa ninguna otra herramienta. Un perfil que este
  ordenador no conoce en absoluto responde ahora `profile.unknown` (`not_found`), en lo que cli-core convierte un
  `session.missing` para un perfil desconocido, y nombra los perfiles que hay. El mensaje sigue diciendo cómo iniciar
  sesión.

### Corregido

- `deals close <deal> won` encuentra la etapa ganada también por su nombre, en un espacio de trabajo donde la
  celebración de la etapa está desactivada.
- **El servidor MCP avisa al agente de cada tipo de texto externo que puede ver**: nombres de negociaciones, embudos y
  etapas y de los miembros del espacio de trabajo, direcciones de correo, teléfonos y enlaces, las notas, correos,
  comentarios y transcripciones que leen los comandos `api`, y lo que encuentra `search all`. Solo nombraba los
  nombres de registros, los valores de atributos y los nombres de miembros.
- **La skill dice cómo funciona el inicio de sesión**: solo el propietario inicia sesión, nunca con el token como
  argumento, y qué ámbitos necesita el token.
- **La descripción del paquete nombra las negociaciones** junto a personas y empresas.

## 0.2.2 — 19.11.2026

### Corregido

- **La página de inicio, la instalación, el uso y la página de fallos dicen qué lee `sync`**: cada negociación y
  luego las personas y empresas que nombra. Una persona sin negociación se encuentra en directo con `people list`.
- **`people list` y `organizations list` dicen que buscan por palabras**, porque la búsqueda propia de Attio
  encuentra registros por palabras. Su ayuda ya no ofrece condiciones `field:value`, y una condición sobre un campo
  que no sea `name` se rechaza con ese motivo.
- **`people show Anna` encuentra a Anna por su nombre.** Attio rechazaba un nombre en lugar de un id de registro, y
  `show` se detenía ahí.

## 0.2.1 — 19.11.2026

### Corregido

- **La página de uso, las próximas mejoras y la referencia de comandos dicen qué copia `sync`**: tus negociaciones y
  las personas y empresas que aparecen en ellas. La referencia de comandos empieza con lo que encuentras en ella y una
  lista de sus secciones principales.

## 0.2.0 — 19.11.2026

### Cambiado — puede romper a quien llama

- **`attio <profile> sync` copia solo las personas y empresas que aparecen en tus negociaciones**, como hace
  bitrix24-cli. Attio añade una persona y una empresa por cada dirección de tu correo, y una copia completa guardaba
  miles a las que nunca vendes. Cualquier otra se sigue encontrando con `people list` y `organizations list`, que leen
  Attio en directo.

### Corregido

- **Un espacio de trabajo con el objeto Deals de Attio desactivado se sincroniza**, y `sync` lo indica como una
  carencia. Antes fallaba con `not_found`.

## 0.1.0 — 18.11.2026

### Añadido

- Partió de `@wirecat/cli-template` 0.28.0.
- Creado a partir de un solo archivo, `wirecat.config.ts`.
- **`attio <profile> sync` copia tus negociaciones de Attio en el almacén local de WireCat**, con su etapa, su
  responsable, su importe, su empresa, sus personas y los atributos propios del espacio de trabajo, y tus personas y
  empresas. Attio no puede listar lo que cambió desde un momento dado, así que cada sincronización lista todos los
  registros.
- **`attio <profile> deals`, `pipelines`, `changes`, `fields` y `search all` leen la copia**, también sin conexión. El
  único embudo de negociaciones de Attio es `Deals`: una etapa que Attio celebra es ganada, y una con el título "Lost"
  es perdida.
- **`attio <profile> people list|show` y `organizations list|show` leen Attio en directo**, con palabras que buscan en
  nombres y correos.
- **`attio <profile> session start` inicia sesión con un token de acceso de Attio** por stdin, comprobado con
  `GET /v2/self`.
- **`attio <profile> api` ejecuta cada operación de la API de Attio**, cada una con sus propias opciones, su ayuda y
  `--json`.
- **`attio <profile> users list|show` lee en directo los miembros de tu espacio de trabajo.**
