---
title: "Hoja de ruta"
---

Esta página reúne lo que está previsto para `amo` y aún no está hecho. Léela antes de buscar un rodeo para una
función que falta: puede que ya esté en camino. El orden puede cambiar y no hay fechas. Para proponer algo, abre un
[issue en GitHub](https://github.com/WireCatLabs/amo-cli/issues).

## Qué funciona hoy

`amo` inicia sesión en una cuenta de amoCRM o Kommo con un token de larga duración o con tu propia integración en el
navegador. Copia tus negociaciones, sus contactos y empresas, los embudos y el historial de etapas al almacén local de
tu ordenador. Tú y tu agente leéis esa copia sin conexión, veis qué cambió desde ayer, recibís un resumen cada mañana
y cambiáis negociaciones, contactos y empresas dentro de los permisos que pongas, desde la línea de comandos o por
MCP. Mira [empieza aquí](./index.md).

## Siguiente

- Archivos de negociaciones y contactos: leer y descargar los archivos adjuntos a una negociación o a un cliente.
- Poner una tarea o añadir una nota a una negociación con un comando propio y su propio permiso, también por MCP. Hoy
  una tarea o una nota solo se escribe con `api call` en la terminal, después de permitir su clave.
- El embudo por comercial: cuántas negociaciones tiene cada comercial en cada etapa, la negociación media y la duración
  del ciclo de venta.
- Negociaciones paradas: las negociaciones abiertas que llevan en una etapa más tiempo del que fijes.

## Más adelante

- Leer los productos de la cuenta.
- Iniciar sesión con un botón en wirecat.dev, sin crear una integración privada en tu cuenta.

Qué cambió en cada versión publicada está en el [historial de cambios](./changelog.md).
