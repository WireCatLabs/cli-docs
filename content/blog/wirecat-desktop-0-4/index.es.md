---
title: "WireCat Desktop 0.4: ver lo que guarda y poder cambiar de opinión"
description: Una página nueva, Analítica, muestra lo que guarda WireCat y cómo lo usas. Las memorias aprobadas se pueden editar o retirar, las instalaciones muestran el progreso real y las reparaciones de ajustes nunca salen de tu ordenador.
date: 2026-11-04
tags: [release-notes, ai-agents, security]
author: viacheslav-ptsarev
draft: false
---

WireCat Desktop es la app que instala las herramientas de WireCat, inicia sesión por ti y le da a tu agente de IA tus
chats, correo, reuniones, documentos y notas, todo guardado en tu ordenador. La 0.3 trató de que la búsqueda aguantara
datos reales. Tras unos días más con la app quise dos cosas que no me daba. Quería ver qué guarda en realidad, y quería
cambiar de opinión sobre algo que ya había aprobado. La 0.4.0 hace las dos, y arregla lo que encontré el primer día
con la 0.3 en la app real.

Las herramientas también avanzaron rápido, y de casi todo nunca escribí. Por eso la segunda mitad de esta entrada se
pone al día: una herramienta de Google Calendar, una de correo, un bot de WhatsApp Business y más.

## Analítica: lo que guarda WireCat

Hay una página nueva, Analítica, dentro de Memoria. Arriba muestra lo que WireCat guarda en tu ordenador: mensajes,
chats, correos, documentos, reuniones y adjuntos, cuánto espacio ocupan, de dónde vienen y cuántos mensajes tienes por
año.

Debajo, la página muestra tus mensajes a lo largo del tiempo, cuántos enviaste tú, de quién oyes más y los chats más
activos. Luego vienen tus proyectos con sus tareas abiertas, vencidas y cerradas, y cómo crece tu memoria. Tú eliges el
periodo (7, 30 o 90 días, o todo) y qué mensajerías y cuentas contar.

Cada número sale de un comando de la propia herramienta, y cada panel nombra ese comando. La app solo suma las
respuestas. Los nombres se leen en este ordenador y se quedan en él, y **Ocultar nombres** los tapa cuando quieres
enseñar la página a alguien.

## Cambiar de opinión sobre la memoria

En la 0.3, cuando aprobabas algo en la página Memoria, la fila decía "Aprobado" y ya está. Ahora cada tipo de registro
tiene una vía de vuelta.

- Una memoria se puede editar, marcar como **Ya no es cierto** o borrar.
- Una decisión se puede editar, o puedes **Deshacer aprobación**.
- Una acción aprobada abre la tarea que creó, y un lote revisado muestra lo que hizo.

"Corregir" ahora se llama **Editar**, porque es lo que hace. Y **Aprobar** muestra cuántas filas aprueba y aprueba
exactamente las filas que ves en pantalla, así que siempre sabes a qué le estás diciendo que sí.

## Instalaciones que puedes seguir

Instalar una herramienta era un círculo girando y esperar. Ahora ves cuánto lleva, una frase sencilla sobre lo que pasa
y, para npm, una barra que se llena con el recuento del propio npm, como "Descargando 35 de 60 paquetes". Tras la
primera instalación, la app te ofrece enseñar la herramienta nueva a tus agentes. Antes de iniciar una sesión, enumera
los pasos, cuánto tardan más o menos y qué pasa con lo que compartes.

En Windows, las herramientas ahora se instalan sin permisos de administrador.

## La reparación de ajustes se queda en tu ordenador

Cuando el archivo de ajustes de una herramienta está roto, la comprobación de estado ahora ofrece **Reparar el
archivo**. Ejecuta el comando de reparación de la propia herramienta en tu ordenador, te dice qué cambió y dónde queda
el archivo viejo, y vuelve a comprobar.

También probé un botón que le pasaba el problema a tu agente de IA, y lo quité antes de publicar. Para arreglar el
archivo, el agente lo lee entero, claves incluidas, y lo envía a su proveedor de IA. Ese trato no quiero hacerlo por
ti.

Dos cambios más de seguridad. La app instala una actualización de una herramienta solo si la construyó el flujo de
release de GitHub de esa herramienta desde su rama principal. Y los informes de errores y los diagnósticos ahora
ocultan los títulos de los chats y los nombres de los contactos, no solo los tokens y las claves.

## Novedades en las herramientas desde la última entrada

La app instala y actualiza estas herramientas por ti, y tu agente también puede usar cada una por su cuenta.

- **Google Calendar** tiene ahora su propia herramienta. Tu agente puede leer tu calendario sin conexión, buscar un
  hueco libre, detectar solapamientos, crear invitaciones y responderlas, y preparar un resumen corto antes de una
  reunión. También puede seguir feeds de iCalendar. ([versiones de gcal](https://github.com/WireCatLabs/gcal-cli/releases))
- El **correo** también tiene su propia herramienta. Guarda tu buzón en el mismo almacén local por IMAP, inicia sesión
  en Gmail y Outlook, y `review` muestra qué hay de nuevo, qué debes y qué espera respuesta. El envío tiene límites de
  seguridad. ([versiones de mail](https://github.com/WireCatLabs/mail-cli/releases))
- **WhatsApp Business**: la herramienta de WhatsApp puede ejecutar un bot en un número Business con la Cloud API de
  Meta, con plantillas, archivos y webhooks. ([wa 0.6.0](https://github.com/WireCatLabs/whatsapp-cli/releases/tag/v0.6.0))
- **Zoom**: `zm review` lista tus reuniones desde un momento dado, con lo que se decidió y quién habló.
  ([zm 0.37.0](https://github.com/WireCatLabs/zoom-cli/releases/tag/v0.37.0))
- **Telegram**: tu agente puede dejar un mensaje como borrador en el chat para que tú lo revises y lo envíes, y enviar
  hasta 10 fotos o archivos como un álbum.
- **Google Drive**: una carpeta local puede mantenerse sincronizada con Google Docs y Sheets en los dos sentidos.
- **Memo**: `memo review` junta en una sola lista todo lo que te espera, desde tareas propuestas hasta facturas.

## Por si te lo perdiste

Hay dos cosas en la app desde la 0.1 que nunca enseñé bien.

- **Tu agente en ChatGPT o Claude en la web.** En la página Herramientas, la sección del servidor MCP arranca el
  servidor de una herramienta y te guía con una dirección de Tailscale o Cloudflare, para que ChatGPT o Claude en el
  navegador lleguen a tus mensajes en tu ordenador. Tú eliges lo que puede hacer, y el envío puede quedarse apagado.
- **Copias de seguridad.** La página Almacenamiento copia todo lo que guarda WireCat, con una contraseña opcional.

## Arreglos menores en la app

- El panel de una herramienta vuelve a cerrarse tras una actualización, y **Eliminar esta copia** limpia una copia
  extra de una herramienta instalada con otro gestor de paquetes.
- En Linux, la barra de desplazamiento ya no queda bajo el borde por el que se cambia el tamaño de la ventana.
- Todos los diálogos tienen un botón de cerrar y se cierran al hacer clic fuera.
- Cuando un servicio limita la velocidad de sincronización, la app lo dice y muestra cuánto te pidió que esperaras.
- El número de versión abre un menú Ayuda con las versiones de tu sistema, de Node.js y de npm.
- Los enlaces a la documentación abren wirecat.dev.

## Descarga

Si tienes la 0.3, la propia app te ofrece la actualización. Si eres nuevo, descarga WireCat desde
[wirecat.dev/es/download](/es/download), para macOS, Windows o Linux. La lista completa de cambios está en las
[notas de la versión en GitHub](https://github.com/WireCatLabs/wirecat-desktop/releases/tag/v0.4.0).

Si algo falla o te parece raro, cuéntamelo en [Discord](https://discord.gg/DebENqbRrJ) o abre un issue en
[GitHub](https://github.com/WireCatLabs/wirecat-desktop/issues). Lo leo todo.
