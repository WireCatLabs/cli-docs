---
title: "Gestionar reuniones de Zoom"
---

Encuentra una llamada futura en Zoom, lee detalles e invitación o previsualiza un cambio sencillo.
Estas órdenes contactan la cuenta, no leen el archivo guardado. Identifica la llamada antes de que
el agente reúna discusiones anteriores y contexto del proyecto.

## Encuentra la próxima llamada

```text prompt
Busca mi próxima reunión Zoom sobre Research Example. Muestra fecha, zona horaria e invitación. Después reúne discusiones y preguntas abiertas del texto guardado, con fuentes. No cambies la reunión ni guardes vínculos inferidos.
```

La lista contiene las reuniones programadas del anfitrión conectado mediante la API de Zoom.
No incluye todas las invitaciones del calendario. El agente reúne fuentes locales. No sincroniza calendarios
Google/Outlook ni genera un informe automático. La lista necesita `meeting:read:list_meetings`;
detalles e invitaciones requieren [permisos adicionales](./zoom-app.md#add-archive-or-management-access).

## Leer próximas reuniones

```sh
zm personal remote-meetings list --json
zm personal remote-meetings show 123456789 --json
zm personal remote-meetings invitation 123456789 --json
```

Los identificadores remotos son IDs numéricos de Zoom; `meetings` usa IDs de la base local.
La lista requiere añadir manualmente `meeting:read:list_meetings`; detalles e invitaciones necesitan
permisos opcionales de [la guía](./zoom-app.md#add-archive-or-management-access).

Para una búsqueda acotada con continuación vinculada a cuenta y ventana, usa
[`meetings scheduled`](./usage.md#find-a-scheduled-meeting-series). La fecha inicial de una serie
recurrente no verifica por sí sola su próxima ocurrencia. Tras elegir el ID del proveedor,
[`meetings prepare <series-id>`](./usage.md#prepare-for-an-upcoming-meeting) comprueba la agenda
y devuelve el estado de verificación con contexto guardado y fuentes. Conserva la cobertura
incompleta o no verificada: una fecha listada no prueba una futura llamada.

## Crear, modificar o cancelar

Crear, modificar y cancelar preguntan antes: en una terminal zm pregunta y/N (por defecto no); sin terminal,
el comando se detiene con `confirmation_required` (código 7), salvo que `--yes` lo aplique una vez. `--dry-run`
muestra siempre la petición propuesta sin aplicarla, incluso junto a `--yes`. Un perfil cuyos
[permisos](./configuration.md#permissions) permiten `remote-meetings` aplica sin preguntar; `readonly` o `deny`
rechazan incluso con `--yes`.

```sh
zm personal remote-meetings create --title "Example planning" --start-time 2026-10-20T10:00:00Z --duration-minutes 30 --json
zm personal remote-meetings update 123456789 --title "Example review" --yes --json
zm personal remote-meetings cancel 123456789 --dry-run --json
```

Se admite crear reuniones instantáneas o programadas y cambios básicos. Las escrituras remotas no
se reintentan automáticamente. Si se envió la petición pero el resultado es incierto, comprueba
Zoom antes de repetirla; la herramienta devuelve el código de salida 14.

Revisa tema, hora y duración del plan antes de `--yes`. Cancelar afecta la reunión remota,
no solo el registro local. Después vuelve a leerla o comprueba Zoom. Usa [búsqueda y fuentes](./search.md)
para preparar el contexto cuando hayas identificado la llamada.
