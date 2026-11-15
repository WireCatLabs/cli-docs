---
title: "Asterisk"
---

Las llamadas de una empresa guardan lo que pidieron los clientes y lo que prometieron los empleados. Pero una
centralita Asterisk las guarda en un registro de llamadas y en una carpeta de grabaciones, y tu agente de IA no
puede leerlas. `pbx` es la herramienta de línea de comandos de WireCat para Asterisk. Lee el registro y las
grabaciones donde están y guarda cada llamada en tu ordenador. Cada llamada tiene cómo terminó y el texto de lo que
se dijo.

Así tu agente puede prepararte para devolver una llamada, encontrar las llamadas que nadie devolvió y repasar la
semana por empleado. Junto a cada respuesta, el agente muestra la llamada en la que se basa.

Las llamadas están junto a los chats, el correo y los negocios del CRM de la misma persona. Esto pasa porque todas
las herramientas de WireCat guardan sus datos en un mismo almacén local en tu ordenador. Para conectar `pbx`
necesitas acceso de lectura al registro de llamadas: un archivo o un usuario de base de datos que solo puede leer.

**En esta página:**

1. [Qué puedes hacer](#what-you-can-do)
2. [Cómo encaja con el resto de WireCat](#how-it-fits-with-the-rest-of-wirecat)
3. [Lo que todavía no hace](#what-it-does-not-do-yet)
4. [Por dónde empezar](#where-to-start)

<a id="what-you-can-do"></a>

## Qué puedes hacer

- **Ver cada llamada como una sola llamada.** Un grupo de timbrado (un número que hace sonar varios teléfonos a la
  vez), una cola o una transferencia escriben varios registros de una llamada. Tú recibes una sola llamada. Tiene su
  resultado: contestada, buzón de voz, ocupado o no contestada. Ves quién contestó, cuánto esperó quien llamó y
  cuánto habló.
- **Leer lo que se dijo.** Las grabaciones se convierten en texto en tu ordenador. Ninguna grabación ni
  transcripción sale de él. La única excepción es que actives la transcripción en la nube para un perfil. Un perfil
  es el nombre que das a la conexión con la centralita.
- **Contar las llamadas.** `stats calls show` muestra las llamadas por dirección y resultado, por empleado, por hora
  y por día. También muestra las llamadas perdidas y si se devolvió la llamada al cliente.
- **Encontrar una llamada por lo que se dijo.** `search meetings` encuentra llamadas por sus palabras. También las
  encuentra por su significado. Para eso funciona en tu ordenador un modelo de texto, un programa que compara el
  significado de las frases. La petición «un cliente descontento con la entrega» encuentra una llamada donde nadie
  dijo esas palabras.
- **Etiquetar llamadas.** `tags add complaint --matching "refund"` pone una etiqueta en cada llamada que encuentra la
  búsqueda. Vuelve a ejecutarlo cuando se transcriban llamadas nuevas, y etiquetará solo esas.
- **Saber quién llamó.** Si el móvil de quien llama está en tu CRM o en tus chats, es la misma persona allí. Una
  oficina que atiende a varios países indica esos países. Si un número puede ser de dos de ellos, `pbx` no lo
  adivina.
- **Pasar el trabajo a un agente.** Las llamadas por devolver, las llamadas perdidas y el día por empleado se los
  pides al agente con palabras normales. El agente responde desde el almacén local y muestra sus fuentes. Las
  peticiones están en [Úsalo](./usage.md).
- **No tocar la centralita.** `pbx` solo lee. Le basta un usuario de base de datos que solo puede leer, un archivo o
  una carpeta por SFTP (transferencia segura de archivos por SSH). Con SFTP, la clave del servidor queda fijada:
  `pbx` solo se conecta al servidor que tiene esa clave. No se instala nada en la centralita. Funciona con Asterisk
  sin más y también con FreePBX, Issabel y VitalPBX.

<a id="how-it-fits-with-the-rest-of-wirecat"></a>

## Cómo encaja con el resto de WireCat

- **Memo** responde a preguntas sobre una persona o un proyecto a partir de llamadas, chats, correo y notas.
- **Las herramientas de CRM**, como `b24` para Bitrix24, traen contactos y negocios. Así las llamadas de un cliente
  aparecen junto a su negocio.
- **Las herramientas de mensajería** (`tg`, `max`, `wa`) traen los chats con las mismas personas.
- **WireCat Desktop** conecta la centralita con un formulario, sincroniza las llamadas con un horario y las muestra
  con sus grabaciones.
- **Tu agente** usa `pbx` desde una terminal con la skill de la herramienta, o desde una aplicación por MCP (la forma
  en que las aplicaciones conectan herramientas). Cada comando se permite, se consulta o se deniega, por separado en
  cada perfil. Las palabras dichas en una llamada llegan al agente como datos, nunca como instrucciones.

<a id="what-it-does-not-do-yet"></a>

## Lo que todavía no hace

- **Resúmenes.** Tu agente lee la transcripción y escribe el resumen. `pbx` no escribe resúmenes propios.
- **Reproducir una grabación.** Una llamada enlaza su grabación por la ruta del archivo, y tú abres el archivo en un
  reproductor. No hay un enlace que la reproduzca en el navegador. `meetings show` imprime un enlace para WireCat
  Desktop. Abrirá la llamada cuando Desktop admita enlaces a llamadas.
- **Quién dijo qué en una grabación mono.** En una grabación estéreo, quien llama y el empleado están en canales
  distintos. Si defines [`recordings_channels`](./installation.md#transcribe), cada línea lleva un nombre. Una
  grabación mono es una sola pista mezclada, y su texto sale sin nombres.
- **Grabaciones largas.** Una grabación de más de una hora no se transcribe. La llamada aparece en la lista con el
  motivo, y las demás siguen.
- **Un reconocimiento perfecto.** La calidad del texto depende de la grabación y del modelo. Una línea con ruido o una
  llamada en dos idiomas dan un texto peor.

[Comparación con otras herramientas](./compare.md) pone esto junto a las herramientas propias de FreePBX, Frogman y
asterisk-ai-call-notes.

<a id="where-to-start"></a>

## Por dónde empezar

- **Si eres nuevo:** [instala y conecta](./installation.md), en WireCat Desktop o desde una terminal.
- **Si ya está conectado:** [úsalo](./usage.md), con peticiones para tu agente y un horario.
- **Si algo ha fallado:** [cuando algo falla](./troubleshooting.md).
