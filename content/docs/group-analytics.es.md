---
title: "Analítica de grupos y canales"
description: "Una receta para un informe completo de un canal público de Telegram: alcance, lo que los lectores reenvían, temas, ritmo de publicación, encuestas y comentarios, con un informe de ejemplo."
---

Usa esta receta cuando quieras entender un canal de Telegram: el tuyo, el de un competidor o uno donde piensas
anunciarte. Tu agente lee las publicaciones públicas del canal con la herramienta de línea de comandos tg y escribe un
informe: cuántos suscriptores ven una publicación, cuáles reenvían los lectores, qué temas y formatos funcionan y qué
probar después. Necesitas una cuenta de Telegram que pueda abrir el canal. No hace falta ser administrador.

## Qué obtienes

Mira el [informe de ejemplo sobre @AI_DeepLearning](/channel-report-example.html), un canal en inglés de 17
mil suscriptores que reseña artículos de visión por computadora. Cubre 1.582 publicaciones de 2017 a octubre de 2026 y
un año de comentarios. Muestra:

- **Alcance:** la parte de los suscriptores que ve una publicación típica y cómo cambiaron las vistas por mes y por año.
- **Lift:** las vistas de cada publicación frente a las de alrededor, para comparar con justicia las antiguas y las
  nuevas. Una publicación con lift de 1,5 o más «despega».
- **Lo que los lectores comparten:** cuántas veces reenvían y reaccionan por cada 1.000 vistas, por formato, longitud, tema y
  primera línea.
- **Ritmo:** días y horas de publicación, y qué pasa los días con una publicación frente a los días con tres.
- **Encuestas y comentarios:** participación, las encuestas más grandes, cuántas personas comentan y con qué
  frecuencia responde el autor.
- **Una lectura:** qué funciona, qué podría mejorar y qué experimentos hacer, cada punto con una cifra.

Por ejemplo, el informe encontró que las publicaciones con el código ya publicado despegan casi tres veces más que la
media del canal, y que las vistas cayeron un 40% después de una pausa de tres meses y no se recuperaron.

Hicimos el ejemplo con nuestro script interno. El script no está publicado. Los pasos de abajo usan solo comandos
públicos de tg, así que tu agente puede hacer el mismo tipo de informe.

## Antes de empezar

- tg está instalado y con la sesión iniciada en tu cuenta de Telegram. Consulta la [instalación](./installation.mdx).
- Tu cuenta puede abrir el canal. Basta con que sea público; no hace falta unirse.
- Un agente de IA que pueda ejecutar comandos en tu ordenador. Consulta [conectar tu agente](./agents.mdx).
- Para un análisis con script, Python 3.11 o posterior. El agente también puede analizar los datos sin script.

## Pídeselo a tu agente

```text prompt
Usa tg CLI. Haz un informe de analítica del canal de Telegram @example_channel. Lee todas sus publicaciones, las encuestas y los comentarios de las publicaciones de los últimos 90 días. Guarda los datos sin procesar en una carpeta local. Después mide el alcance, el lift, los reenvíos y las reacciones por cada 1.000 vistas, los temas, el ritmo de publicación, las encuestas y los comentarios, y escribe un informe HTML de una página con gráficos y lo que crees que significa. Cuenta a quienes comentan, pero nunca los nombres. Solo lectura: no te unas, no reacciones, no votes ni comentes.
```

Cambia `@example_channel` por el canal que quieras. Si el canal trata de otro tema, dile al agente cuáles son sus
temas; consulta [Ajusta los temas](#adapt-the-themes).

## Qué pasa

1. **El agente abre el canal.** Pide a Telegram el título, la descripción y el número de suscriptores.
2. **Lee todas las publicaciones, de 100 en 100.** Cada una trae sus vistas, cuántas veces se reenvió, sus reacciones y su número de
   comentarios.
3. **Lee las encuestas y los comentarios.** Abre los comentarios solo en publicaciones recientes que los tienen.
4. **Guarda los datos sin procesar en tu ordenador.** No se envía nada a ningún otro sitio.
5. **Analiza los datos y escribe el informe.** Este paso no usa Telegram.

Todos los pasos solo leen. El agente no se une al canal, no reacciona, no vota ni comenta.

## Cuánto tarda

Leer publicaciones lleva cerca de 1 minuto por cada 1.000. Los comentarios, cerca de 1 minuto por cada 15
publicaciones con comentarios. En el ejemplo, las publicaciones tardaron cerca de 1 minuto, y un año de comentarios
(71 publicaciones), cerca de 3 minutos. El análisis y el informe escrito le llevan al agente unos minutos más.

En un canal grande, usa un periodo corto de comentarios. Cada publicación con comentarios es una petición más a
Telegram, y si hay demasiadas, Telegram puede pedir a la cuenta que espere.

## Los comandos que ejecuta tu agente

Aquí el perfil se llama `personal`. Usa el nombre de tu perfil.

```sh
tg personal --json chats show @example_channel
tg personal --json messages list @example_channel --limit 100
tg personal --json messages list @example_channel 'id<1201' --limit 100
tg personal --json messages comments @example_channel 1250 --limit 100
tg personal --json polls show @example_channel 1189
```

- `chats show` da el título, la descripción y el número de suscriptores (`participants_count`).
- `messages list` da las 100 publicaciones más nuevas. Para leer las anteriores, añade `id<N`, donde N es el id más
  antiguo de la página anterior. Repite hasta que una página llegue vacía.
- Un álbum (varias fotos o vídeos enviados juntos) llega como varios mensajes con el mismo `groupedId` en
  `provider_metadata`. Cuéntalo como una publicación.
- Cada publicación tiene `views`, `forwards` y `comments` en `provider_metadata`, y sus reacciones en `reactions`.
  Las encuestas traen su pregunta y el total de votos en `provider_metadata.poll`.
- `messages comments` da los comentarios de una publicación. Cada comentario lleva el nombre de su autor, así que no
  publiques estos archivos.
- `polls show` da las respuestas de una encuesta con sus votos, cuando Telegram se los muestra a tu cuenta.

## Comprueba el resultado

Un informe completo dice cuántas publicaciones leyó y desde qué fecha. Compara ese número con el id de la publicación
más nueva. La diferencia son publicaciones borradas, partes extra de álbumes y mensajes de servicio, como «canal
creado» o un mensaje fijado. Los mensajes de servicio no tienen vistas y no son publicaciones. En el ejemplo, el id
más nuevo era 1758 y el informe contó 1.582 publicaciones.

El informe debe separar lo medido de lo supuesto. «Las vistas cayeron después de la pausa» es una medida. «Algunos
lectores silenciaron el canal» es una suposición: Telegram no lo muestra.

## Lo que no puede ver

- **Historial de suscriptores.** Telegram da el número de suscriptores solo de hoy. El crecimiento, de dónde vienen
  los suscriptores y las vistas por hora están en las estadísticas oficiales del canal, que solo ven los
  administradores.
- **Publicaciones borradas.** Ya no están en el historial.
- **Respuestas de algunas encuestas.** En una encuesta en la que tu cuenta no votó, Telegram puede dar solo el total.
- **Vistas antiguas.** Las primeras publicaciones de algunos canales no tienen número de vistas.

<a id="adapt-the-themes" />

## Ajusta los temas

El informe encuentra temas y primeras líneas por palabras clave. Una lista hecha para un canal no sirve para otro.
Dale los temas a tu agente en la petición, por ejemplo:

```text prompt
Temas de este canal: reconstrucción 3D (3D, NeRF, mesh, depth), pose y movimiento humano (pose, motion, avatar), generación de imágenes y vídeo (diffusion, GAN, text-to-video), LLM (LLM, VLM, GPT). Cuenta también las publicaciones que dicen que el código está publicado y las que dicen que solo está anunciado.
```

Lee primero las publicaciones y después elige las palabras. Revisa algunas publicaciones de cada tema. Las palabras
clave son aproximadas: «motion» también encuentra el movimiento de un robot.

## Para un grupo

Los mismos comandos leen los mensajes de un grupo, pero en un grupo los mensajes no tienen vistas ni cuentan cuántas veces se reenvían. Para tu
propio grupo, mide la actividad, las personas activas y las preguntas sin respuesta; consulta
[Administradores de grupos](./group-admins.md).

## Privacidad

- **Guarda los datos sin procesar en tu ordenador.** Los comentarios llevan los nombres y usuarios de quienes los
  escribieron.
- **No publiques los nombres de los lectores.** Cuenta a quienes comentan; no los enumeres. Antes de compartir un
  informe, revisa que no tenga nombres de usuario, enlaces a perfiles de personas, teléfonos ni correos. En el informe
  de ejemplo, los lectores solo se cuentan.
- **Las publicaciones son públicas; las personas, no.** Citar las publicaciones del propio canal está bien. Una cita
  de un comentario puede identificar a una persona privada: no la incluyas o pide permiso.

Después, compara dos canales: ejecuta la misma petición para un segundo canal con los mismos temas y pide a tu agente
que ponga los dos informes uno al lado del otro.
