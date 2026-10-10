---
title: "Administradores de grupos"
description: "Atiende preguntas, entiende la participación y gestiona tu grupo."
---

Si gestionas un grupo, usa un informe para encontrar preguntas pendientes, entender la actividad y revisar quién está en tu grupo. Empieza con peticiones de un informe de solo lectura y comprueba el resultado antes de cambiar miembros o reglas de moderación. Los cambios requieren los permisos adecuados de tu cuenta o bot en el grupo.

## Encontrar lo que necesita atención

```text prompt
Revisa los mensajes de ayer en mi grupo del proyecto. Enumera preguntas que siguen sin respuesta, con fuentes. Comprueba mensajes posteriores antes de considerarlas pendientes. Solo lee; no cambies el grupo.
```

Comprueba las preguntas, el periodo y los mensajes citados. Si falta historial, [descarga los chats necesarios](./search.md) antes de considerar completo el informe.

Pide al agente preguntas pendientes y menciones con enlaces a mensajes.
Los comandos están en las guías de [Telegram](./tg/groups.md) y [MAX](./max/groups.md).

```sh
tg review --unanswered 24h
max review --unanswered 24h
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
El comando de auditoría está en [Parece un bot](./people.md#si-la-cuenta-parece-un-bot);
[Personas](./people.md) también explica perfiles y conversaciones compartidas.

El historial empieza cuando guardas las primeras listas: no reconstruye todos los cambios
anteriores. Ambas herramientas pueden consultar grupos seguidos mientras funciona su servidor.
Consulta qué se guarda y cuándo se actualiza en las guías de grupos de [Telegram](./tg/groups.md) y [MAX](./max/groups.md).

## Reglas y moderación

El CLI ayuda con reglas, invitaciones y miembros. Empieza con una vista previa, revisa la acción
y las personas afectadas, y concede solo los derechos necesarios. Eliminar a alguien o cambiar
un enlace afecta al grupo inmediatamente.

[Telegram](./tg/groups.md) · [MAX](./max/groups.md) · [Permisos](./permissions.mdx)
