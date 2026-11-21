---
title: "Abre el Disk como una carpeta"
---

Mira tu Yandex Disk en tu gestor de archivos, junto a tus propias carpetas. Abre un PDF en tu visor, reproduce un
vídeo, busca en una carpeta con `grep` o apunta cualquier programa a un archivo, sin descargar nada antes y sin
instalar nada. La carpeta es de solo lectura: ningún programa, script ni descuido puede cambiar, renombrar ni borrar un
archivo del Disk a través de ella.

```sh
ydisk personal files serve /Documents
```

**En esta página:**

1. [Monta una carpeta](#mount-a-folder)
2. [Linux](#linux)
3. [macOS](#macos)
4. [Windows](#windows)
5. [Por qué es de solo lectura](#why-it-is-read-only)
6. [Quién puede llegar a ella](#who-can-reach-it)
7. [Velocidad y límites](#speed-and-limits)

## Monta una carpeta

Indica el perfil y luego la carpeta del Disk. Sin carpeta, muestra todo el Disk:

```sh
ydisk personal files serve             # the whole Disk
ydisk personal files serve /Documents  # one folder
ydisk personal files serve /Photos --port 8090
```

El comando imprime una dirección como `http://127.0.0.1:41234/Xy…/` y la forma de montarla en tu sistema, y sigue en
marcha. Déjalo abierto mientras usas la carpeta. Ctrl-C lo detiene, y la carpeta desaparece. Cada ejecución crea una
dirección nueva, así que vuelve a montarla tras reiniciar. `--port` mantiene el mismo puerto entre ejecuciones; el
resto de la dirección cambia igualmente.

Usa el inicio de sesión que hiciste con `ydisk personal session start`. No hace falta otra contraseña, ni una
contraseña de aplicación, ni un plan de pago.

## Linux

GNOME Files y los demás gestores de archivos basados en GIO la montan con un comando:

```sh
gio mount dav://127.0.0.1:41234/Xy…/
```

La carpeta aparece entonces en la barra lateral del gestor de archivos, y los programas llegan a ella en
`/run/user/$(id -u)/gvfs/dav:host=127.0.0.1,port=…,ssl=false/<secret>/`. Un programa que escribe ahí un archivo puede
informar de éxito, pero nada llega al Disk: la capa de GNOME pierde el rechazo al cerrar el archivo.
`gio mount -u dav://…` la desmonta. En un gestor de archivos también puedes escribir la dirección `dav://…` en «Otras
ubicaciones» > «Conectar al servidor».

## macOS

En Finder, elige Ir > Conectarse al servidor (Cmd+K), pega la dirección `http://127.0.0.1:…/` y pulsa Conectar. La
carpeta aparece en Ubicaciones y en `/Volumes/`. Expúlsala como cualquier disco.

## Windows

Windows la monta con su servicio WebClient, que `net use` suele iniciar por sí mismo (`sc start webclient` lo inicia
a mano):

```bat
net use * http://127.0.0.1:41234/Xy…/
```

Windows indica la letra de unidad que eligió. `net use Z: /delete` la desmonta. El cliente WebDAV de Windows rechaza
archivos de más de unos 50 MB salvo que se aumente su ajuste `FileSizeLimitInBytes`, como describe la página de
Microsoft sobre el
[WebDAV Redirector](https://learn.microsoft.com/en-us/iis/publish/using-webdav/using-the-webdav-redirector).

## Por qué es de solo lectura

Una carpeta con escritura permitiría a cualquier programa de tu ordenador, o a un `rm -rf` equivocado, borrar archivos
del Disk de golpe. Los [espejos](./mirrors.md) te protegen de eso con una papelera, versiones anteriores y una parada
ante borrados masivos; una carpeta montada se saltaría todo eso. Así que el montaje solo lee: responde a listar y leer,
y rechaza guardar, renombrar, mover, borrar, crear carpetas y bloqueos. Un programa que intenta guardar recibe un
error, y el Disk no se toca.

Para cambiar archivos, usa `ydisk personal files …` o un [espejo](./mirrors.md).

## Quién puede llegar a ella

- Escucha en 127.0.0.1, solo este ordenador. Nada de tu red ni de internet puede llegar a ella.
- La dirección lleva un secreto aleatorio, nuevo en cada ejecución. Un programa de este ordenador que no tenga la
  dirección recibe «not found». Trata la dirección como una contraseña mientras el comando funciona.
- Una página web no puede llegar a ella, ni siquiera una que engañe al navegador para llamar a 127.0.0.1: se rechazan
  las peticiones que nombran otro sitio.
- La dirección no lleva ningún token. Tu sesión de Yandex se queda en el llavero y solo se envía a la API de Yandex.
- Los agentes nunca reciben `files serve` por MCP: funciona hasta que se detiene, y la llamada de un agente tiene que
  terminar.
- Un perfil con `files.download` en `deny` tampoco puede montar, porque un montaje lee cada archivo que muestra.

## Velocidad y límites

- La lista de una carpeta se guarda 10 segundos, así que un gestor de archivos que mira una carpeta muchas veces
  pregunta al Disk una sola vez. Un archivo cambiado en el Disk aparece después de eso.
- Abrir un archivo lo lee del Disk. Un reproductor de vídeo o un visor que salta por un archivo pide partes de él; la
  documentación de Yandex no dice si sus enlaces de descarga sirven partes, así que un salto puede leer el archivo
  desde el principio.
- Una carpeta con más de 10 000 elementos muestra los primeros 10 000, ordenados por nombre, y el comando avisa.
- Cada listado cuenta contra el mismo ritmo que los demás comandos de `ydisk` del perfil. Cuando Yandex pide ir más
  despacio, el gestor de archivos recibe «service unavailable» un momento, y el comando sigue en marcha.

### Por qué no el WebDAV propio de Yandex

Yandex tiene un servidor WebDAV en `webdav.yandex.ru`, pero su
[documentación](https://yandex.ru/dev/disk/doc/ru/concepts/quickstart) dice que solo funciona con un plan de Yandex
360, y un gestor de archivos entra en él con una contraseña de aplicación, que también puede escribir y borrar.
`files serve` funciona con cualquier plan, usa el inicio de sesión que ya tienes y no puede escribir.
