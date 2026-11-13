---
title: "Instalación"
---

Instala `asterisk` una vez en cada ordenador donde lo uses tú o un agente. Necesitas Node.js 22.16 o un 22.x
posterior, o 24 o posterior. Node 23 no es compatible. Para transcribir grabaciones WAV y GSM hace falta `ffmpeg` en
el `PATH`.

```sh
npm install -g @wirecat/asterisk-cli
asterisk --version
```

Instálalo en tu propio ordenador, no en la centralita. En la centralita, el programa `asterisk` del propio Asterisk va
primero en el `PATH`. Allí escribe `wcat-asterisk`: es la misma herramienta con un nombre que no tiene ningún otro
programa.

Comprueba la instalación:

```sh
asterisk doctor
```

`doctor` no usa la red ni abre el llavero. Muestra la versión, dónde están los ajustes, qué perfiles existen y si otros
usuarios del ordenador pueden leer los ajustes. Siguiente paso: [conecta tu Asterisk](./asterisk.md).
