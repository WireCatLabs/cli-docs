---
title: "Inicio de sesión y cumplimiento de estándares"
description: "Cómo inicia sesión una herramienta en un proveedor y mantiene los secretos fuera del almacén y de la pantalla, además de los estándares, las comprobaciones y las versiones de cli-core que debe seguir."
---

Tu herramienta habla con un servicio que necesita iniciar sesión, como Google o Zoom. Esta página muestra dónde viven
las claves y los tokens, cómo elige el propietario la cuenta y qué no debe hacer nunca un inicio de sesión. También muestra
el módulo de inicio de sesión compartido de cli-core.

## Las reglas

- **El perfil siempre es explícito.** El propietario nombra el perfil en cada comando, como `acme work sync`. Una
  herramienta nunca elige el primer perfil de una lista, y un perfil que falta es un error que enumera las opciones
  ([reglas de cuentas](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/accounts.md)).
- **Los secretos vienen del entorno, luego del llavero del sistema, luego de un archivo privado**
  ([WC-SECR-4](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md#wc-secr-4--secrets-come-from-the-environment-then-the-os-keyring-then-a-private-file)).
- **Un secreto nunca se recibe en la línea de comandos**, porque queda en el historial del shell
  ([WC-SECR-5](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md#wc-secr-5--a-secret-is-never-taken-on-the-command-line)).
- **Un token se queda dentro del transporte.** Nunca llega al almacén, a un registro, a un error ni a la salida
  ([WC-SECR-7](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md#wc-secr-7--a-token-stays-inside-the-transport)).

## Pasos

1. Pide el secreto al propietario con una entrada oculta, o abre la página de inicio de sesión del proveedor en el
   navegador.
2. Guarda el token con `Credentials` de `@wirecat/cli-base`, con el nombre del perfil como clave.
3. Léelo por el mismo perfil cuando un comando lo necesite, y pásalo solo al código que llama al servicio.

## Ejemplo

```ts
import { Credentials } from "@wirecat/cli-base"

const credentials = new Credentials({ service: "acme-cli", configDir, envVar: "ACME_TOKEN" })
credentials.write(profile, token)
const saved = credentials.read(profile)
```

`profile` es el nombre que escribió el propietario. `saved.secret` va al cliente del servicio y a ningún otro sitio;
`saved.source` dice si vino del entorno, del llavero o del archivo.

## Inicio de sesión en el navegador con el módulo compartido

Para un servicio en el que se inicia sesión desde su página web (OAuth), usa el módulo de inicio de sesión compartido
`@wirecat/cli-core/oauth`. Da a todas las herramientas un solo flujo:

- el inicio de sesión en el navegador con una dirección de retorno local o un código pegado, protegido con `state` y
  PKCE;
- intercambio, renovación y cierre de sesión del token;
- un bloqueo por perfil, para que dos comandos nunca renueven el mismo token a la vez;
- tu herramienta declara su proveedor; cli-core no guarda direcciones ni identificadores de ningún proveedor, y
  cualquier paso se puede reemplazar;
- un esquema de nombres para las entradas del llavero; una entrada antigua aún se puede leer, así nadie tiene que
  volver a iniciar sesión.

```ts
import { credentialStorage, type OAuthProvider, oauthAccount, standardCodec, tokenKeeper } from "@wirecat/cli-core/oauth"

const acme: OAuthProvider = {
  id: "acme",
  name: "Acme",
  authorizeUrl: "https://acme.example/oauth/authorize",
  tokenUrl: "https://acme.example/oauth/token",
  client: { clientId: "your-app-id" },
  redirect: { kind: "loopback" },
}

const keeper = tokenKeeper({
  provider: acme,
  storage: credentialStorage({
    credentials: { service: "acme-cli", configDir, envVar: "ACME_TOKEN" },
    account: oauthAccount(acme.id, profile),
    codec: standardCodec(acme.id),
  }),
  lockDir: configDir,
  fetch,
  signInCommand: `acme ${profile} sign-in`,
})

await keeper.signIn({ scopes: ["meetings:read"], openBrowser })
const accessToken = await keeper.accessToken()
```

`configDir` y `profile` son los de arriba; `openBrowser` abre una dirección en el navegador del propietario.
`accessToken()` renueva el token cuando está a punto de caducar. El token se guarda con `Credentials`, así que las
reglas de arriba siguen valiendo.

## Qué se rompe si lo omites

Un perfil por defecto lee o escribe la cuenta equivocada. Un token en la línea de comandos queda en el historial del
shell. Un token en un mensaje de error llega al chat con el agente y a sus registros.

Siguiente: [Cumplir los estándares y mantenerse al día](./build-sign-in.md#cumplir-los-estándares-y-mantenerse-al-día).

## Cumplir los estándares y mantenerse al día

Tu herramienta funciona hoy. Esta página muestra cómo mantenerla funcionando mientras cambian cli-core y cli-base: dónde
están las reglas, qué comprobaciones las demuestran y qué hacer cuando una versión cambia algo que usa tu herramienta.

### El manual

Las reglas que sigue cada herramienta de WireCat están en el
[manual de estándares](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md). Viene dentro de `@wirecat/cli-base`, así que tu
herramienta lo tiene en `node_modules/@wirecat/cli-base/docs/standards/README.md`, en la misma versión que las
comprobaciones que ejecuta. Empieza por la [lista para un CLI nuevo](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/new-cli.md): cada paso nombra la
comprobación que lo demuestra.

Las páginas que una herramienta sobre el almacén compartido lee primero:

- [Modelo de datos](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md): entidades, registros de origen, `external_id`, nombres de campos, vínculos;
- [Almacén](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md): áreas del almacén, migraciones, nada de SQL desde una herramienta;
- [Arquitectura](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/architecture.md): capas y qué va en cada paquete;
- [Seguridad](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md) y [Cuentas](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/accounts.md): secretos y el perfil explícito.

### Las comprobaciones

- **`cli-dev lint`** (de cli-base) lee los comandos que imprime tu herramienta y comprueba nombres, opciones, ayuda y
  reglas de salida. Las diferencias conocidas se anotan una vez en `lint/baseline/`; esa lista solo se reduce, y se
  permiten como mucho diez excepciones.
- **`cli-dev audit`** compara tus comandos con las otras herramientas: los comandos raíz obligatorios y el mismo
  contrato para la misma ruta de comando.
- **La configuración de análisis compartida** (Biome con los complementos de WireCat) comprueba tu código: nada de
  importaciones profundas en el interior de cli-core, nada de shell construido con cadenas.
- Una regla que ninguna máquina puede comprobar dice «review only» en el manual. Léela antes de cambiar esa parte.

### Versiones y cambios que rompen

cli-core y cli-base salen cuando un cambio está listo, y una versión puede romper a quien la usa
([WC-REL-8](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/releases.md#wc-rel-8--any-package-may-release-at-any-time)). Antes de la versión 1.0.0, una versión
menor puede romper a quien la usa, y el registro de cambios de cli-core dice cómo bajo «Changed — may break callers».

Cuando sale un cli-core nuevo:

1. Lee su sección del registro de cambios, primero la parte que rompe.
2. Sube cli-core en tu herramienta el mismo día que las demás herramientas, para que todas abran el almacén compartido
   con el mismo esquema.
3. Ejecuta tus pruebas y `cli-dev lint`, y publica.

El almacén compartido solo avanza. Un cli-core más nuevo puede migrar el archivo; una compilación antigua entonces se
niega a abrirlo y pide actualizar, en lugar de leerlo mal
([WC-STORE-10](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md#wc-store-10--an-older-build-refuses-a-store-it-cannot-read-and-says-to-upgrade)).
Por eso una herramienta que se queda en un cli-core antiguo puede dejar de funcionar cuando el propietario actualiza
otra herramienta.

Una herramienta creada con cli-template recibe también los cambios posteriores de la plantilla con
`npx @wirecat/cli-template upgrade`: consulta
[Recibe las mejoras de la plantilla](./build-create-cli.md#recibe-las-mejoras-de-la-plantilla).

### Próximamente

- **Una comprobación del código para el acceso al almacén**, para que una herramienta que importa directamente un
  controlador de SQLite no pase el análisis.

### Qué se rompe si lo omites

Una herramienta que se salta una actualización lee un almacén que ya no entiende y se niega a arrancar. Una herramienta
que desactiva una regla de análisis se aleja de las demás, y los agentes que aprendieron los comandos de una herramienta
se equivocan en la tuya.

Volver al inicio: [Conceptos en cinco minutos](./build-concepts.md).
