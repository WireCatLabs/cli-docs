---
title: "Asterisk"
---

Las llamadas de una empresa guardan lo que pidieron los clientes y lo que prometieron los empleados. Pero en una
centralita Asterisk están en un registro de llamadas y en una carpeta de grabaciones que ningún agente de IA puede
leer. `pbx`, la herramienta de línea de comandos de WireCat para Asterisk, las lee donde están y guarda cada llamada
en tu ordenador, con cómo terminó y lo que se dijo en ella.

Así tu agente puede prepararte para devolver una llamada, listar las llamadas que nadie devolvió, repasar un día de
llamadas por empleado y citar la llamada en la que se basa cada respuesta. Cada llamada está junto a los chats, el
correo y los negocios del CRM de la misma persona, porque todas las herramientas de WireCat guardan sus datos en un
mismo almacén local.

**En esta página:**

1. [Qué puedes hacer](#what-you-can-do)
2. [Cómo encaja con el resto de WireCat](#how-it-fits-with-the-rest-of-wirecat)
3. [Lo que todavía no hace](#what-it-does-not-do-yet)
4. [Por dónde empezar](#where-to-start)

<a id="what-you-can-do"></a>

## Qué puedes hacer

- **Ver cada llamada como una sola llamada.** Un grupo de timbrado, una cola o una transferencia escriben varios
  registros. Tú recibes una llamada con su resultado (contestada, buzón de voz, ocupado, no contestada), quién
  contestó y cuánto esperó y habló quien llamó.
- **Leer lo que se dijo.** Las grabaciones se convierten en texto en tu ordenador. Ninguna grabación ni transcripción
  sale de él.
- **Saber quién llamó.** Si el móvil de quien llama está en tu CRM o en tus chats, es la misma persona allí. Una
  oficina que atiende a varios países los indica, y un número que podría ser de dos de ellos nunca se adivina.
- **Pasar el trabajo a un agente.** Las llamadas por devolver, las llamadas perdidas y el día por empleado se
  convierten en peticiones con palabras normales. El agente responde desde el almacén local y muestra sus fuentes.
  Las peticiones están en [Úsalo](./usage.md).
- **No tocar la centralita.** `pbx` solo lee: con un usuario de base de datos que solo puede leer, con un archivo o
  con una carpeta por SFTP con la clave del servidor fijada. No se instala nada en la centralita, y funciona con
  Asterisk sin más y también con FreePBX, Issabel y VitalPBX.

<a id="how-it-fits-with-the-rest-of-wirecat"></a>

## Cómo encaja con el resto de WireCat

- **Memo** responde a preguntas sobre una persona o un proyecto a partir de llamadas, chats, correo y notas.
- **Las herramientas de CRM**, como `b24` para Bitrix24, traen contactos y negocios, así que las llamadas de un
  cliente aparecen junto a su negocio.
- **Las herramientas de mensajería** (`tg`, `max`, `wa`) traen los chats con las mismas personas.
- **WireCat Desktop** conecta la centralita con un formulario, sincroniza con un horario y muestra las llamadas con sus
  grabaciones.
- **Tu agente** llega a ella desde una terminal con la skill de la herramienta, o desde una aplicación por MCP. Cada
  comando se permite, se consulta o se deniega por perfil. Las palabras dichas en una llamada llegan al agente como
  datos, nunca como instrucciones.

<a id="what-it-does-not-do-yet"></a>

## Lo que todavía no hace

- No hay un informe listo con estadísticas de llamadas: el agente las cuenta a partir de las llamadas.
- `pbx` no escribe resúmenes propios. Tu agente lee la transcripción y escribe uno.
- Una grabación se enlaza por la ruta de su archivo. No hay un enlace que la reproduzca en el navegador.
- La calidad del reconocimiento depende de las grabaciones y del modelo: una línea con ruido o una mezcla de idiomas da
  un texto peor.

[Comparación con otras herramientas](./compare.md) pone esto junto a las herramientas propias de FreePBX, Frogman y
asterisk-ai-call-notes.

<a id="where-to-start"></a>

## Por dónde empezar

- **Si eres nuevo:** [instala y conecta](./installation.md), en WireCat Desktop o desde una terminal.
- **Si ya está conectado:** [úsalo](./usage.md), con peticiones para tu agente y un horario.
- **Si algo ha fallado:** [cuando algo falla](./troubleshooting.md).
