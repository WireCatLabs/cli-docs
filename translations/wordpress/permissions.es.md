---
title: "Permisos"
---

Deja que un agente de IA trabaje con tu sitio WordPress a través de `wordpress` y conserva la última palabra sobre lo
que se publica. La contraseña de aplicación puede hacer lo que puede tu usuario de WordPress, así que sin tus propios
límites un agente podría hacer lo mismo.

Para cada perfil, el nombre que diste al inicio de sesión de un sitio, decides qué puede solo leer un agente, qué te
pregunta antes y qué sigue adelante. Puedes dejar la publicación en tus manos con una línea, y sabes qué
comprobaciones se mantienen digan lo que digan los ajustes.

Cada comando tiene una clave de permiso, su nombre, como `posts.publish` o `api.media-delete`, o un grupo, como `api`,
y gana la clave más larga. Cada clave tiene un nivel: `deny`, `readonly`, `ask` o `allow`. `wordpress blog config set`
los pone.

**En esta página:**

1. [Los niveles](#the-levels)
2. [Lo que está puesto antes de que cambies nada](#what-is-set-before-you-change-anything)
3. [El grupo api](#the-api-group)
4. [Deja la publicación en tus manos](#keep-publishing-yours)
5. [Agentes y MCP](#agents-and-mcp)
6. [Comprobaciones que se mantienen digan lo que digan los permisos](#checks-that-hold-whatever-the-permissions-say)

## Los niveles

| Nivel | Qué pasa |
|---|---|
| `deny` | El comando se rechaza, también una lectura. |
| `readonly` | Las lecturas funcionan. Una escritura se rechaza. |
| `ask` | Una escritura pregunta antes en una terminal. Sin terminal se rechaza, salvo que se dé `--yes`. **Por MCP se ejecuta.** |
| `allow` | El comando se ejecuta sin preguntar. |

```sh
wordpress blog config set permissions.posts.publish deny   # nothing goes public from this profile
wordpress blog config set permissions.api readonly         # every api operation reads, none writes
wordpress blog config show                                 # each key with its level and where it came from
```

`blog` es el perfil, un nombre que elegiste. Un rechazo es `permission_error` (código de salida 5) y nombra la clave.
No significa que el inicio de sesión esté roto.

Un agente no puede aflojar un permiso: un `config set` o `config unset` que quitaría un límite se rechaza, salvo que
lo ejecutes tú en una terminal.

## Lo que está puesto antes de que cambies nada

| Clave | Nivel de serie | Lo comprueba |
|---|---|---|
| `posts.create` | `ask` | `posts create`, que crea un borrador. |
| `posts.update` | `ask` | `posts update`. En una entrada publicada o programada comprueba también `posts.publish`. |
| `posts.publish` | `ask` | `posts publish`, ahora o con `--at-time`. |
| `posts.unpublish` | `ask` | `posts unpublish`. |
| `posts.delete` | `ask` | `posts delete`, que mueve una entrada a la papelera. |
| `posts.delete.force` | `ask` | `posts delete --allow-delete`, que borra para siempre. |
| Cada lectura | `allow` | `sync`, `posts list`, `posts show` y las demás lecturas. |

Una escritura en una página pasa por las rutas de páginas, así que también comprueba sus claves: `pages.publish`
cuando publica o programa la página, o cambia una página publicada o programada; `pages.delete` cuando borra la
página, a la papelera o para siempre; y `pages.delete.force` con `--allow-delete`. Cada una pregunta por defecto. Tras
un sí a la clave de `posts`, la misma acción en la página no se vuelve a preguntar. `posts publish` y
`posts unpublish` todavía preguntan `posts.update` una segunda vez, para una entrada y una página, hasta la próxima
versión de cli-core.

## El grupo api

`wordpress blog api` alcanza cualquier operación de WordPress, y comprueba las mismas claves de publicar y borrar:

- **Publicar** necesita `<route>.publish`, como `posts.publish` o `pages.publish`. Es una escritura que pone `status`
  en `publish` o `future`, o que pone `date`, `date_gmt` o `password`, salvo que la misma llamada ponga `status` en
  `draft`, `pending` o `private`.
- **Borrar** necesita `<route>.delete`. Con `force=true`, que borra para siempre, necesita también
  `<route>.delete.force`. Las dos preguntan por defecto.
- **Las escrituras como las de los comandos `posts` también comprueban sus claves.** `api posts-create` y
  `api pages-create` comprueban `posts.create`, y `api posts-update` y `api pages-update` comprueban `posts.update`.
  Así, `posts.create` en `deny` detiene los borradores por cualquier camino.
- **Las escrituras de todo el sitio preguntan.** Instalar un plugin, cambiar los ajustes del sitio, crear o cambiar un
  usuario (también su rol), un comentario nuevo o cambiado, y los cambios en plantillas, partes de plantilla, widgets,
  barras laterales, menús y navegación preguntan por defecto: `api.plugins-create`, `api.comments-create` y otras. Las
  demás escrituras de api, como medios, etiquetas y categorías, se ejecutan sin pregunta.
- Crear una contraseña de aplicación nunca se ofrece: WordPress responde con la nueva contraseña en claro.
- La ruta de lotes de WordPress (`batch/v1`) nunca se ofrece: una llamada de lote ejecutaría escrituras de otras rutas
  sin pasar por sus claves.

`wordpress blog api show <operation>` enumera las claves que comprueba una operación.

## Deja la publicación en tus manos

Cualquiera de estas deja la cara pública de tu sitio en tus manos:

- **Sin publicar.** `wordpress blog config set permissions.posts.publish deny`. Los borradores siguen funcionando.
  También se rechaza un cambio en una entrada publicada, porque sería público.
- **Sin borrar para siempre.** `wordpress blog config set permissions.posts.delete.force deny`. Las entradas siguen
  yendo a la papelera, de donde vuelven.
- **Solo lectura.** `wordpress blog config set permissions.posts readonly` y
  `wordpress blog config set permissions.api readonly`. Todas las lecturas siguen funcionando.

## Agentes y MCP

Por MCP nadie está ante una terminal para responder, y el servidor no muestra ningún formulario, así que una escritura
en `ask` sigue adelante. Con los niveles de serie, un agente por MCP puede publicar y borrar para siempre. El autor lo
eligió así: un agente debe poder terminar el trabajo que le dieron. `wordpress blog runs list` muestra cada
publicación durante 7 días (`keep_successful_runs_for_days`).

Si quieres publicar tú, pon `posts.publish` en `deny` antes de conectar una app, como arriba. O deja los niveles y
activa la aprobación de la herramienta `wordpress_write` en el cliente de tu agente, para que el cliente te pregunte
antes de cada escritura.

`mcp serve --permission posts.publish=deny` y `mcp add … --permission …` hacen un nivel más estricto para ese
servidor. Nunca aflojan el perfil. Consulta [MCP](./mcp.md#publishing-over-mcp).

## Comprobaciones que se mantienen digan lo que digan los permisos

- **`WCWP_READ_ONLY=1`** rechaza todas las escrituras, para esa shell o para la app que lo pone.
- **Tu rol en WordPress.** WordPress rechaza lo que tu usuario no puede hacer, diga lo que diga el perfil. Un
  Colaborador no puede publicar, por ejemplo.
- **El texto de WordPress son datos.** Los títulos, el texto y los nombres llegan a un agente marcados como
  `untrusted`, así que un agente no los toma como instrucciones.

Más: [ajustes](./configuration.md), [seguridad](./security.md).
