---
title: "Instala e inicia sesión"
---

Conecta tu Yandex Disk una vez y, desde entonces, tu agente de IA encuentra cualquier documento por lo que dice.
Yandex solo deja a un programa usar tu Disk con un token OAuth, una clave que Yandex te da para tu propia cuenta.
Conseguir el token lleva unos cinco minutos, una sola vez.

Tras estos pasos tu Disk queda conectado con el nombre de perfil que elijas y la primera búsqueda funciona. Puedes
hacerlo todo en [WireCat Desktop](https://wirecat.dev/en/docs/desktop), una aplicación que instala las herramientas por ti, o en un
terminal con npm.

**En esta página:**

1. [En WireCat Desktop](#in-wirecat-desktop)
2. [Instala la herramienta](#install-the-tool)
3. [Consigue un token de Yandex](#get-a-yandex-token)
4. [Inicia sesión](#sign-in)
5. [Comprueba que funciona](#check-that-it-works)
6. [Un ordenador sin llavero](#a-computer-with-no-keyring)
7. [Actualiza](#update)
8. [Desinstala](#remove)

## En WireCat Desktop

1. Consigue un token, como muestra [consigue un token de Yandex](#get-a-yandex-token).
2. En la página **Herramientas**, pulsa **Instalar** en la fila de Yandex Disk.
3. Pulsa **Gestionar**, escribe un nombre de cuenta, como `personal`, y pulsa **Iniciar sesión aquí**.
4. Pega el token. Después elige las carpetas que se copian.

Desktop también da a tus agentes de IA la skill de la herramienta, así que no necesitas los pasos del terminal.

## Instala la herramienta

Necesitas Node.js 22.16 o una versión 22.x posterior, o 24 o superior. Node 23 no es compatible. Comprueba tu versión
con `node --version` y descarga Node.js de [nodejs.org](https://nodejs.org/) si falta o es más antiguo.

```sh
npm install -g @wirecat/yandex-disk-cli
ydisk --version
ydisk doctor
```

`doctor` no necesita red y no abre el llavero. Muestra la versión, dónde están los ajustes y el almacén local, los
perfiles que existen y si otros usuarios del ordenador pueden leer los ajustes. Para probar la herramienta sin
instalarla, ejecuta `npx @wirecat/yandex-disk-cli --help`.

## Consigue un token de Yandex

Yandex da un token a una aplicación que registras tú mismo. La aplicación es solo un nombre y una lista de permisos de
acceso en tu cuenta de Yandex. No se publica nada. Estos pasos siguen las guías de Yandex:
[registrar una aplicación para acceder a la API](https://yandex.ru/dev/id/doc/en/register-api) y
[el inicio rápido de la API de Disk](https://yandex.ru/dev/disk-api/doc/en/concepts/quickstart). Las páginas de
Yandex están en ruso, así que abajo las etiquetas van también en ruso.

1. Abre [oauth.yandex.ru/client/new](https://oauth.yandex.ru/client/new/) e inicia sesión en Yandex con la cuenta cuyo
   Disk quieres usar. Si Yandex te ofrece elegir un tipo de aplicación, elige **Para acceder a la API o depurar**
   («Для доступа к API или отладки»).
2. Escribe cualquier nombre para la aplicación («Название вашего сервиса»), como `My laptop`, y tu correo
   («Контактная почта»).
3. En el acceso a datos («Доступ к данным»), añade los permisos de Yandex Disk que necesita la herramienta:
   - `cloud_api:disk.read`, leer todo el Disk («Чтение всего Диска»).
   - `cloud_api:disk.info`, leer información del Disk («Доступ к информации о Диске»). La herramienta lo usa para
     comprobar de quién es el token.
   - `cloud_api:disk.write`, escribir en cualquier lugar del Disk («Запись в любом месте на Диске»), para subir,
     mover, borrar y crear enlaces públicos. Omítelo si quieres un token que solo lea. Entonces todo cambio falla.
4. Crea la aplicación («Создать приложение»). Su página muestra un **ClientID**, una cadena de letras y cifras.
   Cópialo.
5. Abre esta dirección en el navegador, con tu ClientID añadido justo al final, después de `client_id=`:
   `https://oauth.yandex.ru/authorize?response_type=token&client_id=`
6. Yandex pregunta si permites que la aplicación acceda a tu Disk. Permítelo y Yandex muestra el token en su página.
   Cópialo.

Yandex puede pedirte que confirmes tu identidad antes de dejarte crear aplicaciones. Sin la confirmación muestra un
aviso y limita cuántas aplicaciones puedes crear, lo que no te impide seguir aquí. Consulta
[la página de Yandex sobre ello](https://yandex.ru/dev/id/doc/en/confirm-account).

Guarda el token como una contraseña. Quien lo tenga puede usar tu Disk con los permisos que elegiste.

## Inicia sesión

Elige un nombre de perfil para esta cuenta, como `personal`, e inicia sesión con él. La herramienta pide el token con
entrada oculta. Pégalo y pulsa Enter.

```sh
ydisk personal session start
```

Primero la herramienta comprueba el token con Yandex y solo lo guarda si Yandex lo acepta. Se guarda en el llavero
del sistema (Keychain en macOS, Credential Manager en Windows, Secret Service en Linux). El token nunca es un
argumento de comando y nunca aparece en la salida ni en un registro.

`session start` también lee el token desde stdin, así que un script puede pasarlo desde un gestor de contraseñas. Una
segunda cuenta tiene su propio perfil: `ydisk work session start`.

## Comprueba que funciona

```sh
ydisk personal session status --check
ydisk personal folders browse
```

`session status --check` pregunta a Yandex de quién es el token y muestra la cuenta. `folders browse` lista las
carpetas de la raíz de tu Disk. Ambos responden desde Yandex, así que una respuesta correcta significa que el inicio
de sesión está hecho.

Yandex mantiene válido un token durante meses y lo prolonga mientras se usa
([Yandex ID](https://yandex.ru/dev/id/doc/en/concepts/ya-oauth-intro)). Cuando Yandex deja de aceptarlo, los comandos
fallan con el código de salida 4: consigue un token nuevo del mismo modo y ejecuta `session start` otra vez.

`ydisk personal session end` borra el token de este ordenador. El token en sí sigue siendo válido en Yandex. Para
revocarlo, abre el acceso a datos ([«Доступ к данным»](https://id.yandex.ru/personal/data-access)) en Yandex ID y
quita la aplicación para la que se emitió el token. Cambiar tu contraseña de Yandex o cerrar sesión en todos los
dispositivos («Выйти на всех устройствах») también lo revoca, junto con todos los demás tokens de la cuenta
([Yandex ID](https://yandex.ru/dev/id/doc/en/tokens/token-invalidate)).

## Un ordenador sin llavero

En un servidor o un contenedor sin llavero, la herramienta guarda el token en un archivo privado que solo tú puedes
leer, y te lo dice. Para saltarte el llavero a propósito:

```sh
ydisk personal session start --credential-storage file
```

## Actualiza

```sh
ydisk upgrade
```

`ydisk upgrade --check` solo dice si existe una versión más nueva. Tras actualizar, ejecuta `ydisk skill install` otra
vez para que las instrucciones de tu agente coincidan con la versión nueva.

## Desinstala

Para olvidar una cuenta en este ordenador, quita su perfil:

```sh
ydisk personal account remove --keep-data
```

Borra el token del perfil y sus ajustes. Di qué pasa con los archivos que copió: `--keep-data` los deja en el
almacén, donde la búsqueda los sigue encontrando, y `--delete-data` los borra, con la lista de carpetas que elegiste
copiar. En tu Disk no cambia nada. En un terminal pregunta antes, `--yes` responde por un script y `--dry-run`
lista lo que quitaría sin quitar nada. El token sigue siendo válido en Yandex: revócalo en el acceso a datos
([«Доступ к данным»](https://id.yandex.ru/personal/data-access)) de Yandex ID.

`ydisk personal session end` olvida solo el token y conserva el perfil. Para quitar la herramienta:

```sh
npm uninstall -g @wirecat/yandex-disk-cli
```

Los ajustes y el almacén local se quedan en las carpetas que mostró `ydisk doctor`, para las otras herramientas de
WireCat que comparten el almacén. Bórralos a mano si ya no los necesitas.

Siguiente: [elige carpetas y sincronízalas](./usage.md).
