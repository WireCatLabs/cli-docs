---
title: "Cuando algo falla"
---

Vuelve a poner `b24` en marcha a partir del síntoma que ves. La mayoría de los fallos vienen del inicio de sesión,
de un permiso de acceso (scope) que le falta al webhook o de los permisos del perfil, y cada uno tiene una comprobación
que nombra la causa.

Busca tu síntoma en la tabla, haz la comprobación que indica y vuelve a ejecutar el comando. Si sigue fallando, ya
tienes el código de error y el nombre del perfil para una solicitud de soporte.

`b24 doctor` muestra qué está configurado sin red ni llavero. `b24 work session status --check` pregunta al portal
con qué empleado actúa el webhook.

**En esta página:**

1. [Primeras comprobaciones](#first-checks)
2. [Síntomas y qué hacer](#symptoms-and-what-to-do)
3. [Pedir ayuda](#ask-for-help)

## Primeras comprobaciones

```sh
b24 doctor                         # the version, the settings, the profiles, without the network
b24 work session status --check    # the employee the webhook acts as, and whether they are an admin
```

## Síntomas y qué hacer

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `b24 doctor`. No lee ningún llavero ni usa la red. |
| No se encuentra `b24` | Abre una terminal nueva y comprueba que la carpeta global de npm está en `PATH`. |
| "name a profile" | Pon el perfil primero, como en `b24 work config show`, o define `B24_PROFILE`. |
| El archivo de ajustes no se puede leer | `doctor` muestra cada problema del archivo en `config.issues`. Ejecuta el `config unset` que indica cada uno o corrige el archivo a mano. |
| `doctor` muestra `files.problems` | Otros usuarios del ordenador pueden leer `config.json` o entrar en su carpeta. Ejecuta cada `chmod` que `doctor` imprime tras "to make it private:". `doctor` nunca cambia por sí mismo los permisos de un archivo. |
| La sincronización copia negociaciones de otra persona, o no todas las tuyas | Una sincronización copia las negociaciones y los prospectos del usuario que inició sesión, o de los usuarios que eliges. Busca sus ids con `users list` y luego ejecuta `config set crm.bitrix24:<portal>.unassigned <ids>`. Consulta [de quién son las negociaciones y los prospectos](./usage.md#whose-deals-and-leads). |
| "not signed in" | Ejecuta `session start` con tu perfil, por ejemplo `b24 work session start`, y pega la dirección del webhook. |
| Bitrix24 rechazó este webhook o el inicio de sesión con la aplicación | El webhook se borró en Bitrix24, o un administrador editó el webhook de un compañero, y eso le da una dirección nueva. O la aplicación local se borró o cambió su clave. Copia la dirección que muestra ahora el webhook, o crea uno nuevo, y ejecuta `session start` otra vez. |
| Falta el permiso de acceso para un método, o `ERROR_METHOD_NOT_FOUND` | Añade el permiso de acceso (`crm`, `user_basic`, `department`, y `telephony` para `meetings sync`) al webhook en Bitrix24: Developer resources → Integrations, edita el webhook. |
| "this webhook may not read who made it" al iniciar sesión | Marca "Users (basic)" (`user_basic`) en el webhook, guarda y ejecuta `session start` otra vez con la dirección que muestra. Consulta [iniciar sesión](./usage.md#sign-in). |
| "already uses this webhook" al iniciar sesión | Otro perfil lo tiene. Usa ese perfil, o quita ese perfil con `b24 <profile> account remove --keep-data` y vuelve a iniciar sesión. |
| `rate_limited` | El portal permite unas 2 peticiones por segundo para todas sus aplicaciones juntas. `b24` espera por sí mismo una espera corta y te avisa si es larga. |
| `outcome_unknown` en una escritura | Puede que el portal hiciera el cambio. Mira primero el elemento (`sync` y luego `show`), y repite la escritura solo si el cambio no está: Bitrix24 haría la repetición por segunda vez. Consulta [escribir](./usage.md#write). |
| Se rechaza una escritura | Lo impiden los permisos del perfil o `B24_READ_ONLY`. Consulta los [permisos](./permissions.md). |

## Pedir ayuda

Pregunta en [Discord](https://discord.gg/DebENqbRrJ) o abre una [issue](https://github.com/WireCatLabs/bitrix24-cli/issues)
con el código de error, el nombre del perfil y el comando. Nunca pegues un token, una contraseña ni contenido privado
en una solicitud de soporte.
