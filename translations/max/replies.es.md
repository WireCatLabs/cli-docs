---
title: "Respuestas automáticas"
---

`max serve` puede responder a mensajes entrantes mediante reglas que escribes en un archivo del perfil. Actualmente, las respuestas automáticas funcionan **solo con cuentas de prueba**: una regla responde únicamente a las personas incluidas en `testers`. No se envía nada a los demás, aunque la regla coincida. Así puedes probar las reglas con tu segunda cuenta, en vez de con personas reales.

Detalles de cada orden: [commands.md](./commands.md#max-replies).

## Activar las respuestas

1. Escribe el archivo de reglas `<профиль>.replies.json` en el directorio de configuración, junto al archivo que `max config show --json` identifica como `configFile`. Ejemplo con una regla:

   ```json
   {
     "testers": [{ "id": "<id тестового аккаунта>" }],
     "rules": [
       {
         "id": "away",
         "on": true,
         "do": ["reply"],
         "where": { "kinds": ["dialog"], "chats": [], "notChats": [] },
         "when": {
           "hours": { "outside": "09:00-19:00", "days": "mon-fri", "timezone": "Europe/Madrid" },
           "words": [],
           "question": false,
           "mentionsMe": false,
           "from": { "people": [], "notPeople": [], "contactsOnly": false }
         },
         "reply": { "template": "Спасибо, {firstName}! Отвечу утром.", "model": "fill-only", "asReply": true },
         "limits": { "perChat": "1/12h", "perPerson": "1/1d" }
       }
     ]
   }
   ```

   Todos los campos son obligatorios. Un nombre de campo desconocido detiene la regla e indica el campo.

2. Comprueba qué habría respondido la regla a los mensajes ya guardados; no se envía nada:

   ```sh
   max replies test --since-time 7d
   ```

3. Permite los envíos e inicia el servidor:

   ```sh
   max config set permissions.replies.send allow
   max serve
   ```

   Sin `allow`, el servidor no envía nada. Aquí `ask` también significa que no: el servidor no tiene a quién preguntar.

## Mensajes que una regla nunca toca

- tus propios mensajes, los canales o los bots;
- mensajes ya respondidos o editados;
- mensajes recibidos antes de iniciar `max serve`: tras una semana sin conexión, no responde a toda la semana;
- en un grupo, los mensajes que no te mencionan ni te responden, salvo que la regla incluya ese grupo en `chats`.

Cada regla debe indicar los límites `perChat` y `perPerson`. Dos respondedores automáticos que se contesten entre sí se detienen al alcanzar el primer límite.

## Detener y comprobar

- `max replies pause` detiene de inmediato todas las reglas del perfil, también en un `max serve` en ejecución; no hace falta reiniciarlo. `max replies resume` vuelve a activarlas.
- `max replies status` muestra si se permiten los envíos, qué reglas están activadas y cuántas cuentas de prueba hay en la lista.
- `max sends list` muestra cada respuesta automática con `rule:<id>`, que identifica la regla que la envió.