---
title: "Instala e inicia sesión"
---

Configura `ydisk` una vez en cada ordenador donde lo uses tú o un agente. Tras estos pasos tu Disk queda conectado con
el nombre de perfil que elijas y la primera búsqueda funciona. Iniciar sesión significa pegar un token OAuth de
Yandex: una clave que Yandex te da para tu propia cuenta y con la que la herramienta usa tu Disk. Conseguirlo lleva
unos cinco minutos, una sola vez.

**En esta página:**

1. [Instala la herramienta](#install-the-tool)
2. [Consigue un token de Yandex](#get-a-yandex-token)
3. [Inicia sesión](#sign-in)
4. [Comprueba que funciona](#check-that-it-works)
5. [Un ordenador sin llavero](#a-computer-with-no-keyring)
6. [Actualiza](#update)
7. [Desinstala](#remove)

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

`ydisk personal session end` borra el token de este ordenador.

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

`ydisk personal session end` olvida el token del perfil en este ordenador. Después quita la herramienta:

```sh
npm uninstall -g @wirecat/yandex-disk-cli
```

Los ajustes y el almacén local se quedan en las carpetas que mostró `ydisk doctor`, para las otras herramientas de
WireCat que comparten el almacén. Bórralos a mano si ya no los necesitas.

Siguiente: [elige carpetas y sincronízalas](./usage.md).
