---
title: "Instalación"
---

Conecta tu cuenta de HubSpot una vez y, desde entonces, tu agente de IA te dice en qué punto está cada negociación y
qué cambió, sin que abras HubSpot. HubSpot solo deja entrar a un programa con una clave creada en la cuenta: una clave
de servicio, o el token de una aplicación privada que ya tengas. Crear la clave, instalar `hubspot` e iniciar sesión
lleva unos diez minutos.

Al terminar, el agente de este ordenador lee una copia de tus negociaciones, contactos y empresas, incluso sin
internet, y solo cambia negociaciones si das a la clave los scopes de escritura.

Puedes hacerlo todo en [WireCat Desktop](/es/docs/desktop), una aplicación que instala las herramientas por ti, o en
un terminal con npm. En los dos casos, un superadministrador o un usuario con el permiso **Developer tools access** de
HubSpot crea la clave una vez.

**En esta página:**

1. [En resumen](#in-short)
2. [Crea una clave](#make-a-key)
3. [En WireCat Desktop](#in-wirecat-desktop)
4. [En un terminal](#in-a-terminal)
5. [Inicia sesión](#sign-in)
6. [Comprueba que funciona](#check-that-it-works)

<a id="in-short" />

## En resumen

1. [Crea una clave](#make-a-key) en HubSpot.
2. En WireCat Desktop: en la página **Herramientas**, pulsa **Instalar** en la fila de HubSpot, luego **Gestionar** e
   **Iniciar sesión aquí**, y pega la clave.
3. O en un terminal, instala la herramienta, inicia sesión con la clave y copia tus datos:

```sh
npm install -g @wirecat/hubspot-cli
hubspot work session start
hubspot work sync
```

<a id="make-a-key" />

## Crea una clave

`hubspot` inicia sesión con una clave que pertenece a una cuenta de HubSpot. Un superadministrador, o un usuario con el
permiso **Developer tools access** de HubSpot, la crea una vez
([guía de HubSpot](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/account-service-keys)):

1. Abre **Development** y luego **Keys → Service keys** en el menú de la izquierda. Algunas cuentas lo muestran en
   **Settings → Integrations → Service keys**.
2. Haz clic en **Create service key** y llámala *WireCat*.
3. Haz clic en **Add new scope**, marca cada scope de [los scopes de lectura](#read-scopes) y haz clic en **Update**. Una clave recibe
   solo los scopes que tiene quien la crea.
4. Haz clic en **Create** y confirma.
5. Haz clic en el nombre de la clave, luego en **Show** y **Copy**. La clave empieza por `pat-`.

HubSpot dejó de permitir apps privadas nuevas el 26 de octubre de 2026
([aviso de HubSpot](https://developers.hubspot.com/changelog/legacy-private-app-creation-sunset)). El token de acceso
de una app privada que ya exista sigue funcionando: dale los mismos scopes y copia el token de su pestaña **Auth**.

<a id="read-scopes" />

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

<a id="in-wirecat-desktop" />

## En WireCat Desktop

1. En la página **Herramientas**, pulsa **Instalar** en la fila de HubSpot.
2. Pulsa **Gestionar**, escribe un nombre de cuenta, como `work`, y pulsa **Iniciar sesión aquí**.
3. La ventana muestra los scopes y dónde pulsar en HubSpot, los mismos pasos que [crea una clave](#make-a-key). Pega la
   clave cuando te la pida. Desktop la comprueba con HubSpot antes de guardarla.

Desktop también da a tus agentes de IA la skill de la herramienta, así que puedes saltarte el resto de esta página.

<a id="in-a-terminal" />

## En un terminal

Instala `hubspot` una vez en cada ordenador donde tú o un agente lo uséis. Necesitas Node.js 22.16 o una versión 22.x
posterior, o la 24 o posterior. Node 23 no está soportado.

```sh
npm install -g @wirecat/hubspot-cli
hubspot --version
hubspot skill install
hubspot doctor
```

`skill install` da a tu agente de terminal la skill de la herramienta, la guía breve de sus comandos. `doctor` no
necesita red y no abre ningún llavero. Muestra la versión, dónde viven los ajustes, los perfiles que existen y si otros
usuarios del ordenador pueden leer los ajustes.

<a id="sign-in" />

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

<a id="check-that-it-works" />

## Comprueba que funciona

```sh
hubspot work session status --check
hubspot work sync
```

`session status --check` pregunta a HubSpot si la clave funciona y qué cuenta lee. `sync` copia las negociaciones,
los contactos y las empresas.

Siguiente: [úsalo](./usage.md).
