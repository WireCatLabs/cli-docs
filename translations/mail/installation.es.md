---
title: "Instalar"
---

Instala `mail` una vez en cada ordenador donde tú o un agente lo uséis. Necesitas Node.js 22.16 o una versión 22.x posterior, o 24 o superior; Node 23 no es compatible.

```sh
npm install -g @wirecat/mail-cli
mail --version
```

Comprueba la instalación:

```sh
mail doctor
```

`doctor` no necesita red y no abre el llavero. Muestra la versión, dónde están los ajustes, los perfiles que
existen y si otros usuarios del ordenador pueden leer los ajustes.

Después conecta un buzón. Tú eliges el nombre del perfil, la primera palabra de cada comando:

```sh
mail ya session start --address me@example.com
mail ya account check
```

## Buscar en tu correo

Tras `sync`, el correo está en el almacén común. `mail` llena el almacén. [memo](https://github.com/WireCatLabs/cli-memo)
busca en él y muestra lo que contiene:

```sh
memo search mail "invoice"
```

Las palabras de la consulta están en [memo search](https://github.com/WireCatLabs/cli-memo/blob/main/docs/search.md).

Siguiente: [úsalo](./usage.md).
