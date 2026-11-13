---
title: "Instalación"
---

Instala `pbx` una vez en cada ordenador donde lo uses tú o un agente. Necesitas Node.js 22.16 o un 22.x
posterior, o 24 o posterior. Node 23 no es compatible. Para transcribir grabaciones WAV y GSM hace falta `ffmpeg` en
el `PATH`.

```sh
npm install -g @wirecat/asterisk-cli
pbx --version
```

El comando es `pbx`, y `wcat-pbx` es la misma herramienta. Ninguno de los dos nombres es `asterisk`, así que también
puedes instalarlo en la centralita sin tapar el programa propio de Asterisk.

Comprueba la instalación:

```sh
pbx doctor
```

`doctor` no usa la red ni abre el llavero. Muestra la versión, dónde están los ajustes, qué perfiles existen y si otros
usuarios del ordenador pueden leer los ajustes. Siguiente paso: [conecta tu Asterisk](./asterisk.md).
