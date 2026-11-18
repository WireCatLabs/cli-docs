---
title: "Instalación"
---

Instala `hubspot` una vez en cada ordenador donde tú o un agente lo uséis. Necesitas Node.js 22.16 o una versión 22.x
posterior, o la 24 o posterior. Node 23 no está soportado.

```sh
npm install -g @wirecat/hubspot-cli
hubspot --version
hubspot doctor
```

`doctor` no necesita red y no abre ningún llavero. Muestra la versión, dónde viven los ajustes, los perfiles que
existen y si otros usuarios del ordenador pueden leer los ajustes.

## Crea una clave

`hubspot` inicia sesión con una clave que pertenece a una cuenta de HubSpot. Un superadministrador, o un usuario con el
permiso **Developer tools access** de HubSpot, la crea una vez
([guía de HubSpot](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/account-service-keys)):

1. Abre **Development** y luego **Keys → Service keys** en el menú de la izquierda. Algunas cuentas lo muestran en
   **Settings → Integrations → Service keys**.
2. Haz clic en **Create service key** y llámala *WireCat*.
3. Haz clic en **Add new scope**, marca cada scope de la tabla siguiente y haz clic en **Update**. Una clave recibe
   solo los scopes que tiene quien la crea.
4. Haz clic en **Create** y confirma.
5. Haz clic en el nombre de la clave, luego en **Show** y **Copy**. La clave empieza por `pat-`.

HubSpot dejó de permitir apps privadas nuevas el 26 de octubre de 2026
([aviso de HubSpot](https://developers.hubspot.com/changelog/legacy-private-app-creation-sunset)). El token de acceso
de una app privada que ya exista sigue funcionando: dale los mismos scopes y copia el token de su pestaña **Auth**.

Dale estos scopes de lectura ([lista de scopes de HubSpot](https://developers.hubspot.com/docs/apps/legacy-apps/authentication/scopes)):

| Scope | Qué lee |
| --- | --- |
| `crm.objects.contacts.read`, `crm.objects.companies.read`, `crm.objects.deals.read` | contactos, empresas y negociaciones |
| `crm.objects.owners.read` | los propietarios a los que se asignan las negociaciones |
| `crm.schemas.contacts.read`, `crm.schemas.companies.read`, `crm.schemas.deals.read` | las propiedades de cada uno |
| `sales-email-read` | los correos registrados. Las notas, llamadas, reuniones y tareas no necesitan scope propio: las lee el scope de contactos |
| `crm.objects.leads.read` | los leads, solo en Sales Hub Professional o Enterprise |
| `tickets` | los tickets, solo con `api` |

Las escrituras son opcionales. Añade estos scopes solo si `hubspot` puede cambiar registros. Sin ellos la clave solo
lee:

| Scope | Qué cambia |
| --- | --- |
| `crm.objects.deals.write` | negociaciones: crear, actualizar, mover, cerrar y borrar |
| `crm.objects.contacts.write` | contactos. Las notas, llamadas, reuniones y tareas escritas con `api` pueden pedir su propio scope: el error lo nombra |
| `crm.objects.companies.write` | empresas |

Un scope que no marques solo hace fallar los comandos que lo necesitan, y el error nombra el scope.

## Inicia sesión

Elige un nombre de perfil para la cuenta, como `work`, y pega la clave cuando te la pida:

```sh
hubspot work session start
```

La clave se lee oculta, o desde stdin (`hubspot work session start < key.txt`), nunca como argumento. `hubspot`
pregunta a HubSpot a qué cuenta pertenece la clave y la guarda con el id de la cuenta en el llavero del sistema, o en
un archivo que solo tú puedes leer con `--credential-storage file`. Se rechaza un segundo perfil en la misma cuenta.

`hubspot work setup` hace las mismas preguntas paso a paso. WireCat Desktop muestra los mismos pasos: los toma de un
documento JSON que imprime la CLI, `hubspot work setup show --json`, en inglés, español o ruso.

`WCHUBSPOT_TOKEN` en el entorno ocupa el lugar de la clave guardada para todos los perfiles, como en CI. Pon a su lado
`WCHUBSPOT_ACCOUNT` con el id de la cuenta: `hubspot work session status --check` solo con el token lo imprime como
`account`. Cada comando que llega a HubSpot comprueba antes el id contra el token. Un comando que solo lee la copia
local necesita que antes se haya ejecutado uno de esos comandos, como `sync`. `api` no conoce así la zona horaria de la
cuenta, así que cuando el límite diario se agota dice que lo intentes de nuevo después de una hora en UTC, la más
temprana en que puede volver.

Siguiente: [úsalo](./usage.md).
