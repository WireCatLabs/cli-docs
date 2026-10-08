---
title: Seguridad
description: Elige el acceso del asistente, entiende adónde van tus mensajes y conoce los límites de los controles.
---

WireCat trabaja con tu propia cuenta de Telegram o MAX. Empieza leyendo, decide qué acciones
permitir y protege tu ordenador y el acceso al mensajero.

## Elegir qué puede hacer el asistente

Los [permisos](./permissions.md) permiten leer, pedir confirmación antes de cambiar algo o
rechazar una acción. También puedes limitar destinatarios y envíos por hora. Estos controles
ayudan a evitar un envío equivocado o un bucle que envía demasiados mensajes.

Un rechazo significa que los ajustes actuales no permiten esa acción. Comprueba el destinatario
y los permisos antes de repetirla. No pidas al asistente que evite la restricción para terminar la tarea.
Para respuestas importantes, pide un borrador y revisa destinatario y texto. Leer no marca los
mensajes como leídos; eso es una acción distinta.

## Adónde va tu información

Las herramientas se ejecutan en tu ordenador y conectan con el mensajero. Guardan una copia
local de los mensajes leídos para buscar y trabajar con ese historial más tarde.

El asistente de IA recibe los mensajes con los que le pides trabajar. Si eliges un modelo en
línea para análisis, respuestas o búsqueda por significado, los datos necesarios pueden enviarse
a su proveedor. Los modelos locales pueden realizar ese trabajo en tu ordenador.
Comprueba el proveedor elegido antes de usar conversaciones sensibles.

Las exportaciones, archivos descargados y transcripciones contienen la información solicitada.
Elige dónde guardarlos y quién puede acceder a la carpeta. `tg doctor` o `max doctor` muestra
las rutas exactas de tu ordenador.

<a id="lo-que-la-protección-no-puede-impedir" />

## Dónde terminan los controles

- **Alguien con acceso a tu usuario del ordenador.** Puede leer mensajes guardados y usar el
  acceso al mensajero. Usa bloqueo de pantalla, una cuenta protegida y cifrado del disco.
- **Un asistente con acceso completo al terminal o a los archivos.** Puede cambiar los mismos
  ajustes que tú. Un perfil de solo lectura es útil, pero no sustituye un entorno separado.
- **Todas las instrucciones engañosas de un mensaje.** Las herramientas identifican el texto
  como información, pero un modelo puede entenderlo mal. Limita los envíos y revisa acciones importantes.
- **Información compartida con otro servicio.** El permiso para leer un chat no controla cómo
  guarda datos el proveedor de IA. Comparte solo el contexto necesario.
- **Acciones ya realizadas.** Un mensaje puede verse antes de borrarlo. Borrar una copia local
  no borra las copias de destinatarios u otros servicios.

Las herramientas no cifran el historial local. Cerrar sesión o desinstalar no necesariamente
elimina esa copia. Revisa por separado los mensajes guardados y las exportaciones al retirar un ordenador.

## Conectar desde el navegador

La [configuración del navegador](./browser-apps.mdx) usa HTTPS y un código de un solo uso del
terminal. Autoriza solo una conexión iniciada por ti y comprueba la app de destino antes de
introducir el código. No compartas códigos ni credenciales en chats o incidencias públicas.

La aprobación de la app y el permiso del servidor son controles distintos. Si ambos permiten
enviar sin preguntar de nuevo, una llamada puede enviar inmediatamente. Usa solo lectura cuando
no necesites enviar. Detén el servidor o túnel para pausar el acceso; `tg mcp --revoke` o
`max mcp --revoke` obliga a las apps a volver a entrar.

## Qué demuestran las evaluaciones

Al pedir estadísticas, solicita los mensajes u observaciones de miembros que respaldan la respuesta
y comprueba qué historial falta. Un contador desconocido no es cero; un historial incompleto no
demuestra que una pregunta nunca recibió respuesta o que un miembro permaneció en silencio.

El [informe publicado](https://github.com/leemour/cli-messaging/blob/main/docs/dev/evaluations/2026-10-08-independent-stats-agent-evaluation.md) registra 38 tareas sintéticas en seis contextos nuevos de agentes:
interpretar informes, conservar valores desconocidos, previsualizar objetivos exactos, respetar
permisos y recuperar pruebas modificadas. Los contextos comparten tareas; el número de resultados
no es un porcentaje de fiabilidad. No se usaron cuentas reales ni adaptadores de red del mensajero;
MCP se accedió mediante un proxy de shell. No garantiza que otro modelo o tu asistente se comporte
igual ni que resista todas las instrucciones ocultas en mensajes.

Los desarrolladores pueden [repetir el procedimiento](https://github.com/leemour/cli-messaging/tree/main/scripts/evals) con datos sintéticos. Revisa las
limitaciones de modelo y SDK del informe antes de comparar puntuaciones y verifica las pruebas
antes de tomar decisiones importantes.

## Un punto de partida

1. Conecta un perfil de solo lectura.
2. Prueba búsquedas y resúmenes.
3. Permite enviar cuando lo necesites, a los destinatarios previstos.
4. Pide borradores, mantén un límite de envío y revisa los ajustes al añadir otro asistente.

## Informar de un problema

No publiques credenciales ni conversaciones privadas en una incidencia. Para un problema de
seguridad, contacta con [el mantenedor](mailto:hello@wirecat.dev) o usa informes privados en
[Telegram](https://github.com/leemour/tg-cli/security/advisories/new) o
[MAX](https://github.com/leemour/max-cli/security/advisories/new).
