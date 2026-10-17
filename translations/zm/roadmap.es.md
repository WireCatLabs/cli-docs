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
Un agente puede combinar esas fuentes con proyectos, notas y personas de Memo. Empieza con
[preparación](./usage.md#prepare-for-an-upcoming-meeting) o [búsqueda y fuentes](./search.md).

Las copias de grabaciones usan almacenamiento compartido para los bloqueos de escritura, las
descargas reanudables y la recuperación tras interrumpirse el guardado final. Los archivos de Zoom
existentes siguen siendo compatibles; cada proveedor conserva su propio formato de metadatos.

## Guarda resultados revisados con Memo

Memo 0.58.0 permite preparar decisiones, afirmaciones y tareas de proyecto de una reunión guardada
para que el dueño las revise. Usa un vínculo confirmado entre la reunión y un proyecto existente,
lee los pasajes que las respaldan y confirma los candidatos que quieras conservar. Preparar las
propuestas no crea hechos ni tareas; repetir exactamente la operación reutiliza los registros
aceptados. [Revisa los resultados de una reunión](https://wirecat.dev/en/docs/memo/memories#meeting-findings)
explica los comandos, las comprobaciones de la vista previa y los límites. La preparación de reuniones
lee contexto guardado; no acepta estos resultados ni genera un resumen.

## Trabajo previsto

- Preparación más amplia: descubrir series candidatas, consultar documentos importados, correo, mensajes y posibles proyectos sin tener que elegir uno, y elaborar un informe con pruebas y lagunas explícitas. El comando actual incluye hechos globales aceptados de personas/proyectos, notas del dueño y fuentes elegidas explícitamente, pero no consulta fuentes ni vocabularios de proyectos no elegidos y devuelve contexto guardado sin generar resúmenes.

Los nombres alternativos de proyectos, etiquetas y notas ya pertenecen a Memo y al almacén común.
Otros proveedores usan las capacidades compartidas; esta herramienta no incluye conectores de
producción de Google Meet o Teams. Consulta los [escenarios disponibles](./index.md).
