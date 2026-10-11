---
title: "Solución de problemas"
---

Cómo reconocer un problema y resolverlo.

## Acceso

- **No se abre el navegador.** Elige uno instalado con `--browser firefox`. En una terminal interactiva
  puedes pegar los parámetros de respuesta. Sin entrada, el fallo termina rápidamente.
- **Zoom indica «Invalid redirect».** El manifiesto puede dejar sin configurar URL, lista permitida o
  Public Client OAuth; revisa pasos 5 y 6 de [la guía](./zoom-app.md#create-it-from-the-manifest).
- **La página muestra `code=…&state=…`.** El navegador no pudo llegar al listener; pega los parámetros en `zm login`.
- **CI o tuberías no abren navegador.** Necesitas una terminal con entrada; JSON o tuberías también requieren `--interactive`.
- **Falta un permiso.** El error lo indica. Añádelo en tu aplicación y conecta de nuevo.
- **Cuenta corporativa.** Un administrador puede tener que autorizar la app; mientras tanto `zm import` funciona con archivos descargados.

## Configuración

Una configuración incorrecta permite `--help` y `--version`; los comandos de configuración indican el error.

## Respuestas de Zoom

Un fallo de red comunica un error del proveedor; una respuesta incorrecta, un error de formato.
La salida diagnóstica omite el texto original del error del proveedor.

## Reuniones o transcripciones ausentes

- **No hay transcripciones.** Activa **Allow hosts to retain transcripts** en la configuración web de Zoom.
- **Faltan reuniones a las que asististe.** El API devuelve transcripciones solo al organizador. Descárgalas en Zoom y usa `zm import <folder>`.
- **La transcripción llegó después.** `pull --lookback-days 7` revisa siete días; para reuniones más antiguas usa `pull --since 2026-10-01`. El cursor no garantiza esa revisión.
- **La descarga se interrumpió.** Una reunión fallida no cambia el cursor: reintenta. Serializa las descargas de una cuenta para evitar eventos simultáneos.
- **Una lectura no encuentra el perfil.** No registra cuentas; importa o descarga primero.

## Archivos

- **Queda un bloqueo tras un fallo.** Inspecciona `recordings archive locks`, revisa `recordings archive recover`
  y añade `--yes` para quitar bloqueos reconocidos de procesos terminados ([recuperación](./archive.md#locks-and-recovery)).
- **Una descarga no coincide.** No se sobrescriben archivos existentes; usa otro destino.

## Cambios de reuniones remotas

Si se envió la petición y el resultado es incierto, el código es 14. Comprueba Zoom antes de repetir:
las escrituras remotas no se reintentan automáticamente.
