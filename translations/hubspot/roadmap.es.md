---
title: "Próximas mejoras"
---

Aquí está lo que se planea para `hubspot` y aún no está hecho. Léelo antes de montar un apaño para algo que falta:
puede que ya esté en camino. El orden puede cambiar y no hay fechas. Para proponer algo, abre un
[issue en GitHub](https://github.com/WireCatLabs/hubspot-cli/issues).

## Lo que funciona hoy

`hubspot` inicia sesión en una cuenta de HubSpot con una clave de servicio o el token de una app privada. Copia los
embudos, las negociaciones y los prospectos con sus contactos y empresas, y las actividades si las activas, al
almacén local de tu ordenador. Tú y tu agente leéis esa copia sin conexión, veis qué cambió desde ayer, recibís un
resumen cada mañana y cambiáis negociaciones, contactos y empresas dentro de los permisos que fijes, desde la línea de
comandos o por MCP. Cada operación de la API del CRM de HubSpot es un comando propio. Más en la
[página de inicio](./index.md).

## Lo siguiente

- Conectar HubSpot en WireCat Desktop pegando la misma clave, sin terminal. Llega con la próxima versión de Desktop.
  Hoy `hubspot work setup` hace las mismas preguntas.
- Iniciar sesión como tú en el navegador, para que `hubspot` actúe con los permisos de tu propio usuario de HubSpot y
  `owner:me` encuentre tus negociaciones. Hoy la clave pertenece a la cuenta.

Lo que cambió en cada versión publicada está en el [registro de cambios](./changelog.md).
