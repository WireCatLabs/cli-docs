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
usuarios del ordenador pueden leer los ajustes.

## Iniciar sesión

Inicia sesión en el perfil con un token de Notion:

```sh
notion personal session start
```

El comando pide el token sin mostrarlo, o lo lee de stdin. Acepta cualquiera de los dos tipos de token:

- un [token de acceso personal](https://developers.notion.com/guides/connections-and-tokens/personal-access-tokens),
  que actúa con tus propios permisos.
- el token de una conexión interna, que solo ve las páginas compartidas con esa conexión.

Para una conexión, activa "Read user information including email addresses" (leer la información de los usuarios,
con sus direcciones de correo) en sus [capacidades](https://developers.notion.com/reference/capabilities). Sin ella,
la sincronización guarda el autor y el editor de una página solo por su id de Notion y no puede relacionarlos con las
personas que conoces por su correo.

Primero Notion comprueba el token. Después va al llavero del sistema. Donde no funciona ningún llavero, añade
`--credential-storage file` para guardarlo en un archivo privado. `notion personal session end` olvida el token en este
ordenador. El token sigue siendo válido en Notion.

Siguiente paso: [úsalo](./usage.md).
