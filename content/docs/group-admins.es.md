---
title: "Administradores de grupos"
description: "Atiende preguntas, entiende la participación y gestiona tu grupo."
---

WireCat ayuda a encontrar preguntas sin respuesta, entender la actividad y revisar miembros.
Empieza con un informe de solo lectura antes de activar la moderación.

## Encontrar lo que necesita atención

Pide al asistente preguntas pendientes y menciones con enlaces a mensajes.
Los comandos están en las guías de [Telegram](./tg/groups.md) y [MAX](./max/groups.md).

```sh
tg review --unanswered 24
max review --unanswered 24
```

Revisa las respuestas sugeridas antes de enviarlas. El informe usa el historial guardado;
los mensajes que faltan pueden cambiar su visión de la conversación.

## Entender la actividad

```sh
tg stats chats show "Equipo" --since-time 7d
max stats chats show "Equipo" --since-time 7d
```

Revisa mensajes, participantes activos y preguntas respondidas. Descarga más historial antes
de concluir si faltan datos. Pocos mensajes guardados no demuestran que alguien nunca participe.
Usa [búsqueda](./search.md) para una discusión concreta.

## Revisar miembros

Una auditoría muestra señales y razones, no un veredicto sobre una persona. Revisa las pruebas
antes de eliminarla. Telegram y MAX ofrecen datos distintos; algunas señales pueden faltar.
[Conoce a tu gente](./people.md) explica perfiles y conversaciones compartidas.

El historial empieza cuando guardas las primeras listas: no reconstruye todos los cambios
anteriores. Ambas herramientas pueden consultar grupos seguidos mientras funciona su servidor.
La guía del mensajero explica qué se guarda y cuándo se actualiza. Consulta la guía del mensajero.

## Reglas y moderación

El CLI ayuda con reglas, invitaciones y miembros. Empieza con una vista previa, revisa la acción
y las personas afectadas, y concede solo los derechos necesarios. Eliminar a alguien o cambiar
un enlace afecta al grupo inmediatamente.

[Telegram](./tg/groups.md) · [MAX](./max/groups.md) · [Permisos](./permissions.md)
