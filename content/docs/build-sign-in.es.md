---
title: "Iniciar sesión en un servicio"
description: "Cómo inicia sesión una herramienta en un proveedor, mantiene claves y tokens fuera del almacén y de la pantalla, y nombra siempre el perfil."
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

Siguiente: [Cumplir los estándares y mantenerse al día](./build-stay-compliant.md).
