---
title: "Planes"
---

Consulta qué flujos puedes usar hoy y cuáles faltan. La herramienta ya obtiene datos del anfitrión,
importa texto, copia grabaciones y busca pasajes citados. `meetings prepare` combina la prueba de
la próxima cita de una serie elegida con contexto guardado acotado, incluidas llamadas relacionadas,
hechos aceptados de personas/proyectos y notas del dueño sobre llamadas anteriores incluidas,
personas vinculadas explícitamente y proyectos confirmados. Elegir opcionalmente un proyecto existente
añade coincidencias citadas de nombre, clave y alias, separadas de la pertenencia confirmada.
Las fuentes configuradas explícitamente añaden coincidencias literales acotadas de mensajes,
correo y carpetas guardadas, con citas, cobertura y continuación.
`meetings scheduled` descubre una página acotada de posibles series; `meetings projects scan`
compara fuentes de una reunión guardada con nombres, claves y alias de proyectos existentes.
Ambos conservan la incertidumbre y no guardan asociaciones.
Un agente puede combinar esas fuentes con proyectos, notas y personas de Memo. Empieza con
[preparación](./usage.md#prepare-for-an-upcoming-meeting) o [búsqueda y fuentes](./search.md).

Las copias de grabaciones usan almacenamiento compartido para los bloqueos de escritura, las
descargas reanudables y la recuperación tras interrumpirse el guardado final. Los archivos de Zoom
existentes siguen siendo compatibles; cada proveedor conserva su propio formato de metadatos.

## Guarda resultados revisados con Memo

Memo permite preparar decisiones, afirmaciones y tareas de proyecto de una reunión guardada
para que el dueño las revise. Usa un vínculo confirmado entre la reunión y un proyecto existente,
lee los pasajes que las respaldan y confirma los candidatos que quieras conservar. Preparar las
propuestas no crea hechos ni tareas; repetir exactamente la operación reutiliza los registros
aceptados. [Revisa los resultados de una reunión](https://wirecat.dev/en/docs/memo/memories#meeting-findings)
explica los comandos, las comprobaciones de la vista previa y los límites. La preparación de reuniones
lee contexto guardado; no acepta estos resultados ni genera un resumen.

## Trabajo previsto

- Preparación más amplia: combinar descubrimiento de series, sugerencias de proyectos y contexto
  de la serie elegida en un informe revisado con fuentes y lagunas explícitas. Una investigación
  más amplia debe respetar los permisos explícitos del dueño. Los lectores actuales devuelven
  contexto guardado y candidatas sin generar resúmenes ni consultar fuentes no elegidas.

Los nombres alternativos de proyectos, etiquetas y notas ya pertenecen a Memo y al almacén común.
Otros proveedores usan las capacidades compartidas; esta herramienta no incluye conectores de
producción de Google Meet o Teams. Consulta los [escenarios disponibles](./index.md).
