---
title: "Instalación"
---

Instala `notion` una vez en cada ordenador donde lo uses tú o un agente. Necesitas Node.js 22.16 o un 22.x
posterior, o 24 o posterior. Node 23 no es compatible.

```sh
npm install -g @wirecat/notion-cli
notion --version
```

Comprueba la instalación y luego elige un nombre de perfil para tu cuenta, como `personal`:

```sh
notion doctor
```

`doctor` no usa la red ni abre el llavero. Muestra la versión, dónde están los ajustes, qué perfiles existen y si otros
usuarios del ordenador pueden leer los ajustes. Siguiente paso: [úsalo](./usage.md).
