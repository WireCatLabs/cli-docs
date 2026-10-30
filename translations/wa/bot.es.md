---
title: "Un número de WhatsApp Business como bot"
---

`wa <profile> bot …` habla por un número de WhatsApp Business en la [Cloud API](https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started) de Meta, no por tu WhatsApp personal. Nunca vincula un dispositivo y nunca arranca el motor que utiliza `wa <profile> chats …`. Se comunica con `graph.facebook.com` a través de HTTPS con un token que guarda en el llavero del sistema.

**Nunca registres tu propio número de teléfono ni ningún número cuyo WhatsApp todavía uses en un teléfono.** Registrar un número en la Cloud API elimina la cuenta de WhatsApp de ese número. Usa el número de prueba gratuito de Meta o un número que no tenga cuenta de WhatsApp.

## Qué puedes hacer

| Comando | Qué hace |
|---|---|
| `bot auth set` | Comprueba un token de acceso con Meta y luego consérvelo. Añade `--secret app-secret` o `--secret verify-token` para los dos secretos del webhook. |
| `bot me` | El número empresarial identificado por el token y `phone_number_id`. |
| `bot messages send <chat> <text>` | Envía texto, una respuesta (`--reply-to`) o un archivo (`--file`, `--photo`, `--voice`). No se admiten envíos silenciosos, ediciones ni eliminaciones. |
| `bot templates list` | Las plantillas de mensajes de tu cuenta WhatsApp Business. |
| `bot templates send <chat> <name> [language]` | Enviar una plantilla aprobada; `--payload` llena sus marcadores de posición. `hello_world` está preaprobado en el número de prueba. |
| `bot watch --public-url <url>` | Recibe mensajes y recibos de entrega a medida que Meta los envía, guárdelos en el almacén local e imprímalos. |
| `bot webhooks set <url>` | Dirige el webhook de este número a una dirección; `bot webhooks list` y `delete` leen y eliminan. |
| `bot media download <id> --output <file>` | Guarda un archivo que alguien envió, con el ID de medio `bot watch --jsonl` impreso. |
| `bot api <operation>` | Cada operación de Cloud API que mantiene `wa` se genera a partir del archivo OpenAPI de Meta. |
| `bot mcp serve` | Los comandos del bot como herramientas MCP para un agente. |

Un chat es el número de teléfono de la persona en dígitos, como `70000000001`. Meta nombra a algunas personas solo mediante una identificación de usuario de ámbito empresarial; `bot watch` muestra ese chat como `user:<id>` y lo envías de la misma manera.

**La regla de las 24 horas.** Puedes enviar mensajes de texto libre solo dentro de las 24 horas posteriores al último mensaje de la persona al número. Después de eso, WhatsApp entrega sólo una plantilla. Cuando el almacén local contiene el último mensaje de la persona, `wa` rechaza un envío tardío de formato libre antes de salir y le indica que envíe una plantilla. Cuando no lo hace, Meta lo rechaza.

## Configurar el número de prueba

Realiza estos pasos una vez, en el Panel de aplicaciones de Meta. `wa` no puede hacerlos por ti.

1. En [Meta para desarrolladores](https://developers.facebook.com/apps/), crea una aplicación con el caso de uso "Conectarse con clientes a través de WhatsApp". Meta agrega una cuenta comercial de WhatsApp de prueba y un número de prueba.
2. En WhatsApp → Configuración de API, añade hasta cinco números de destinatario y confirma cada uno con el código que WhatsApp le envía. El número de prueba se envía sólo a estos.
3. En Configuración empresarial, crea un usuario del sistema con `business_management`, `whatsapp_business_messaging` y
   permisos `whatsapp_business_management` y generar un token que no caduque. Anota el secreto de la aplicación en Configuración de la aplicación → Básico.
4. Copia el ID del número de teléfono y el ID de la cuenta comercial de WhatsApp desde WhatsApp → Configuración de API en el perfil:

   

   ```sh
   wa cloudtest config set --bot phone_number_id 100000000000001
   wa cloudtest config set --bot waba_id 200000000000002
   ```

   `graph_version` es `v23.0` a menos que configures otro.
5. Guarda el token y los dos secretos. Cada comando pregunta en un mensaje oculto; no aparece nada en la pantalla ni en el historial del shell:

   

   ```sh
   wa cloudtest bot auth set
   wa cloudtest bot auth set --secret app-secret
   wa cloudtest bot auth set --secret verify-token
   ```

   El token de verificación es cualquier cadena que elijas. Escribe la misma cadena en el Panel de la aplicación en el paso 6.
6. Abre un túnel e inicia el receptor ([recibir mensajes](#receive-messages)). Luego, en WhatsApp → Configuración, introduce la dirección del túnel como URL de devolución de llamada con el mismo token de verificación y suscríbete al campo `messages`.

Compruébalo: `wa cloudtest bot me` indica el número de prueba y `wa cloudtest bot templates send <your verified number> hello_world` llega a tu teléfono.

## Recibir mensajes

Meta nunca permite que un cliente solicite mensajes nuevos. Envía cada uno a una dirección HTTPS que configuras y vuelve a intentarlo durante hasta siete días hasta que esa dirección responda. `bot watch --public-url` es el receptor de esa dirección: escucha en `127.0.0.1:8766` en tu ordenador y su túnel la publica.

```sh
wa cloudtest bot watch --public-url https://<name>.ts.net:8443
```

- Responde a la verificación de suscripción de Meta con el token de verificación que conservaste.
- Rechaza cualquier entrega cuyo `X-Hub-Signature-256` no coincida con el secreto de tu aplicación.
- Responde a Meta sólo después de que el mensaje está en el almacén local, por lo que una falla o un disco lleno no pierde nada: Meta lo envía nuevamente.
- `--port` cambia el puerto local. El receptor necesita su propio puerto y su propia dirección pública además de `mcp serve --http`.

El túnel debe conservar una dirección: Meta comprueba cada nueva dirección nuevamente. Usa Tailscale Funnel o un túnel de Cloudflare con nombre, configurado como en [ChatGPT, Codex o Claude en el navegador](./remote.md#webhook-receiver-for-a-bot). Un Quick Tunnel de Cloudflare cambia su dirección cada vez que se inicia.

Meta mantiene una dirección de devolución de llamada por aplicación, configurada en el Panel de la aplicación, y envía eventos de plantilla y cuenta solo allí. `bot webhooks set <url>` agrega una dirección solo para este número; configúralo con la misma dirección del túnel.

## Permisos

Un perfil de bot tiene sus propios permisos en `bot` en la configuración. Las operaciones `bot api` que no se pueden deshacer, como `register-phone-number` y `delete-template`, preguntan antes de ejecutarse. La lista de destinatarios y el límite por hora se aplican tanto a los envíos de bots como a los personales ([permisos](./permissions.md)).
