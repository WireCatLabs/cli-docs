---
title: "Google Drive: empieza aquí"
description: "Copia en tu ordenador las carpetas de Google Drive que elijas, para que tu agente de IA busque en tus Docs, Sheets y PDF sin conexión y cite la fuente."
---

Tus propuestas, presupuestos y actas de reuniones están en Google Docs, Sheets y archivos PDF de Google Drive. La
herramienta de línea de comandos `drive` copia el texto de las carpetas que elijas a tu ordenador, para que tu agente
de IA pueda buscar en ellas y usarlas como contexto, incluso sin internet.

Un agente con acceso a tus documentos encuentra el pasaje donde se escribió una decisión, lo cita y te da el título del
documento y su enlace de Google. También puede leer un árbol de carpetas, enumerar los archivos que no pudo leer y
cambiar un archivo de Google cuando se lo permitas.

`drive` guarda la copia en el almacén local, un archivo en tu ordenador que comparten todas las herramientas de
WireCat. Tus chats, tu correo y tus notas también están ahí, así que [Memo](/es/docs/memo) puede encontrar un documento
junto con la conversación sobre él. Para empezar, necesitas una cuenta de Google con acceso a las carpetas.

**En esta página:**

1. [Qué obtienes](#qué-obtienes)
2. [Dos palabras que conviene saber](#dos-palabras-que-conviene-saber)
3. [Conecta y copia una carpeta](#conecta-y-copia-una-carpeta)
4. [Qué contiene la copia](#qué-contiene-la-copia)
5. [Qué lee](#qué-lee)
6. [Encuentra una guía para tu tarea](#encuentra-una-guía-para-tu-tarea)

## Qué obtienes

- **Búsqueda sin internet.** Encuentra un pasaje por sus palabras, o por su significado cuando la copia está indexada
  para ello. Cada resultado conserva su título y su enlace original de Google.
- **Solo las carpetas que eliges.** Iniciar sesión no copia nada. Tú eliges las carpetas, y la herramienta las copia
  con sus subcarpetas.
- **Tu propio contexto junto a la fuente.** Añade etiquetas, notas y recuerdos a un documento o una carpeta. Se quedan
  en tu ordenador y sobreviven a los cambios de nombre y a las actualizaciones normales.
- **Lectura en directo cuando la necesitas.** Recorre una carpeta, o mira los permisos, comentarios y revisiones de un
  archivo en Google, sin copiar nada.
- **Cambios solo cuando los permites.** El acceso por defecto es de lectura. Crear y editar Docs, rellenar Sheets,
  copiar o mover archivos necesita un permiso de escritura aparte.
- **Tu agente conectado.** Instala la skill de la herramienta para un agente de terminal como Claude Code, o sirve la
  herramienta por MCP a una aplicación que se conecta a servidores MCP.

## Dos palabras que conviene saber

Un **perfil** nombra una cuenta de Google conectada, como `personal` o `work`. Cada comando de cuenta lo indica.

La **copia local** es el texto, los datos de los archivos y tus propias notas guardados en el ordenador donde se ejecuta
`drive`. Está separada de los archivos de Google. La búsqueda lee la copia local. Una sincronización trae las ediciones
más recientes.

## Conecta y copia una carpeta

1. [Instala `drive`](./installation.md) desde npm.
2. Inicia sesión. Los ejemplos usan el perfil `personal`; elige el tuyo. Se abre un navegador y apruebas el acceso de
   lectura a tu Google Drive.

```sh
drive personal session start
```

Google puede rechazar el inicio de sesión con la aplicación de WireCat o detenerlo con un aviso. En ese caso,
[usa tu propia aplicación de Google](./installation.md#google-shows-an-unverified-app-warning): lleva unos minutos y
no cuesta nada.

3. Elige una carpeta. Ábrela en Google Drive y copia su dirección del navegador. La dirección de aquí es un ejemplo:
   usa la tuya.

```sh
drive personal folders add https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9i0JkLmNoPqRsTuVw
```

4. Copia la carpeta y busca en ella.

```sh
drive personal sync
drive personal search 'budget' --exact
```

Una sincronización lee hasta 10 000 entradas. `drive personal status` muestra el trabajo pendiente: vuelve a
sincronizar hasta que no quede nada, y más tarde para traer lo que cambió.

5. Conecta tu agente. Un agente de terminal recibe la skill:

```sh
drive skill install
```

Una aplicación de tu ordenador que se conecta a servidores MCP ejecuta `drive personal mcp serve`; los
[comandos](./commands.md) muestran cómo añadirlo. ChatGPT, Codex o Claude en el navegador se conectan como se explica
en [aplicaciones en el navegador](./remote.md).

O pídeselo a tu agente cuando `drive` esté instalado y con la sesión iniciada:

```text prompt
Usa drive CLI con el perfil personal. Importa la carpeta de Google que yo elija y sus subcarpetas.
Encuentra la decisión sobre el presupuesto, muestra el pasaje exacto y el enlace original de Google, y enumera los archivos omitidos.
No cambies archivos de Google.
```

## Qué contiene la copia

| Información guardada | Qué puedes hacer sin Google |
| --- | --- |
| Texto de Docs (todas las pestañas, tablas y notas al pie), Sheets y archivos compatibles | Buscar pasajes, leer una fuente y preparar una respuesta con su evidencia |
| ID de Google, título, tipo, enlace original, carpetas superiores y fechas | Identificar la fuente y ver sus datos de la última sincronización |
| Propietarios y último editor que muestra Google | Ver quién trabajó en un documento |
| Carpetas y su árbol | Recorrer el árbol, listar una carpeta, etiquetarla y añadirle notas |
| Tus etiquetas, notas, vínculos con personas o proyectos, y recuerdos | Conservar el contexto entre tareas |

Los archivos cuyo contenido no se puede leer quedan en la copia con su nombre y tipo. `catalog search` los encuentra
por nombre, tipo y propietario. Los permisos, comentarios, el historial de revisiones y la actividad se leen en directo
de Google y no se guardan.

## Qué lee

La herramienta indexa Google Docs y Sheets, y archivos subidos de Markdown y texto plano, PDF con capa de texto, Word
`.docx`, Excel `.xlsx`, CSV y TSV. Los PDF escaneados, Slides, el audio y los accesos directos no tienen texto indexado.
Las imágenes se encuentran por su nombre, o por lo que muestran si activas la
[búsqueda de imágenes](./search.md#search-images-by-what-they-show). En Docs no se indexan imágenes, encabezados, pies
de página, comentarios ni sugerencias.

## Encuentra una guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar, iniciar sesión e importar una primera carpeta | [Instalar y conectar](./installation.md) |
| Importar, leer y organizar la copia local | [Úsalo](./usage.md) |
| Encontrar un pasaje, un archivo o una imagen | [Buscar](./search.md) |
| Dar a tu agente una tarea completa | [Recetas](./recipes.md) |
| Editar un Doc o una hoja | [Recetas](./recipes.md#create-a-native-doc-and-include-it-in-search) |
| Mantener archivos Markdown locales al día con Google | [Espejos](./mirrors.md) |
| Encontrar un comando o una opción | [Comandos](./commands.md) |
| Cambiar un ajuste o un permiso | [Ajustes](./configuration.md) |
| Resolver un error | [Solución de problemas](./troubleshooting.md) |
| Saber qué guarda y envía la herramienta | [Seguridad](./security.md) |
