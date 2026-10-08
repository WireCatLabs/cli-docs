---
title: "Primeras tareas"
description: "Prueba una petición útil, comprueba la respuesta y sigue con búsquedas, reuniones o borradores."
---

Tu cuenta está conectada. Pide al agente que encuentre un mensaje, resuma una conversación o
prepare una respuesta. Describe lo que necesitas; el agente elige los comandos.

Si aún falta configurar algo, empieza por [instalación](./installation.mdx) o
[conectar al agente](./agents.mdx). Puedes ver el proceso antes de probarlo en [Demo](./meeting-brief.mdx).


<a id="ejemplos-más-largos" />

<a id="encontrar-un-acuerdo-en-el-historial-antiguo" />

<a id="revisar-compromisos-y-preparar-respuestas" />

<a id="más-tareas-que-puedes-pedir" />

## Tus primeros cinco minutos

Elige una petición e indica tu mensajero: Telegram o MAX.

**¿Quién espera mi respuesta?**

```text prompt
Revisa mis mensajes no leídos en Telegram. Dime qué preguntas necesitan mi respuesta y muestra los mensajes de origen. Solo lee: no envíes nada ni marques mensajes como leídos.
```

**¿Qué pasó hoy?**

```text prompt
Resume los mensajes de hoy en cinco de mis chats activos. Una línea por chat, con las preguntas importantes aparte. Indica qué chats revisaste. Solo lee.
```

**Encontrar algo**

```text prompt
Encuentra el último enlace que me enviaron en mis cinco chats más recientes. Muestra el mensaje y el chat. Solo lee.
```

Obtendrás una respuesta breve con mensajes que puedes abrir o identificar. Empieza por unos pocos chats para comprobar fácilmente el resultado.

## Encontrar un acuerdo antiguo

```text prompt
En el grupo de la reforma, encuentra el precio que acordamos el mes pasado. Revisa las respuestas posteriores por si cambió. Muestra la confirmación y los mensajes de origen. Si falta historial, dímelo antes de descargar más.
```

Espera el importe confirmado y el mensaje que lo respalda. Si solo aparece una propuesta, el agente debe indicarlo. La falta de historial es un motivo para descargar ese periodo, no una prueba de que nunca hubo acuerdo.
[Encontrar un mensaje o decisión](./search.md).

## Preparar una respuesta

```text prompt
Lee mi conversación con el contratista. ¿Qué espera de mí? Prepara un borrador breve basado en nuestros acuerdos. No inventes un plazo ni envíes nada.
```

El borrador queda en tu conversación con el agente. Revisa el destinatario, los hechos y el texto. Puedes pedir una versión más breve o amable antes de enviar.

```text prompt
Envía exactamente el borrador que aprobé al chat privado del contratista que identificaste. No lo envíes al grupo ni a nadie más.
```

Enviar es un paso aparte que también depende de los permisos del instrumento. Si el destinatario es ambiguo, elige primero el chat correcto.

## Preparar una reunión

Prueba el escenario de reunión en [Demo](./meeting-brief.mdx), luego usa tu proyecto y tus chats. Pide decisiones, preguntas pendientes y una agenda; indica dónde más puede haber acuerdos importantes.

## Comprobar la respuesta

La respuesta debe indicar los chats y el periodo revisados, los mensajes que respaldan los hechos importantes y el historial que falta. Si no lo hace, pide una aclaración.

[Más ejemplos de peticiones](./prompting.mdx) · [Ayuda de Telegram](./tg/troubleshooting.md) · [Ayuda de MAX](./max/troubleshooting.md)
