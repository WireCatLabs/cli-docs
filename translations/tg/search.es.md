---
title: "Buscar mensajes"
---

`tg messages search` consulta solo el archivo local compartido, sin conectarse ni marcar mensajes como leídos.

## Primeros ejemplos

```sh
tg messages search 'invoice AND (kind:group OR kind:private)' --json
tg messages search 'from:"Alice Synthetic" date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid --json
tg messages search 'preset:secret kind:saved' --json
tg messages search 'text:/pass(port)?/' --json
tg messages search 'chat:"Work" AND body:/.*invoice.*/' --json
tg messages search 'has:file' --json
```

Sustituye los nombres de ejemplo por los tuyos. Las palabras y frases coinciden exactamente: no corrige erratas ni busca fragmentos automáticamente. `alpha OR beta gamma` significa `(alpha OR beta) AND gamma`; `alpha OR beta AND gamma` significa `alpha OR (beta AND gamma)`. Usa paréntesis para evitar dudas.

## Campos y operadores

Admite text/body/from/chat/date/kind/has/topic/in/preset, operadores booleanos, grupos de campos, intervalos inclusivos o exclusivos, comodines con límites y expresiones regulares de Lucene. topic requiere indicar un chat. kind:bot selecciona un interlocutor; in:bots selecciona cuentas de Bot API. No admite filename/mime/size/tag ni funciones de coincidencia difusa, proximidad, relevancia o intervalos. Nunca interpreta un campo desconocido como texto literal.

## Fechas y expresiones regulares

`--timezone` selecciona una zona IANA; una fecha sin hora equivale a un día del calendario. Un límite superior inclusivo incluye todo el día; uno exclusivo lo excluye. Los días con cambio de hora no siempre duran 24 horas. Pon las marcas de tiempo exactas entre comillas e incluye segundos y desplazamiento horario.

Las expresiones regulares de text coinciden con un término normalizado completo; las de body, con el texto original completo, distinguiendo mayúsculas. Usa `.*` para buscar un fragmento en body. Es un subconjunto de Lucene: no admite anticipaciones, referencias hacia atrás ni opciones de JavaScript. Superar los límites de filas, bytes, estados, trabajo o tiempo produce un error explícito; reduce el ámbito de búsqueda.

## Archivo local y respuesta para programas

No encontrar resultados no demuestra que nunca se enviara un mensaje. El JSON informa de la versión de consulta, cobertura, integridad, cuentas, chat y estado del índice incluso sin resultados. lastSyncedAt es actualmente null; el inventario de perfiles no se considera completo. JSONL contiene solo elementos; usa --json para consultar la cobertura. Si el índice de palabras está incompleto, ejecuta `tg store migrate`; descarga historial con `tg store fetch`. Los filtros de posibles credenciales no comprueban su validez.

## Migrar desde la búsqueda anterior

```sh
tg messages search 'from:alice after:7d invoice -draft' --language legacy --json
tg messages search --regex 'invoice\s+\d+' --json
```

Legacy conserva los filtros y las coincidencias aproximadas anteriores. --regex es un modo separado de JavaScript iu que consulta todo el texto en un proceso aislado y con límites; no admite --regex --language lucene. El contrato de consultas guardadas para programas incluye lenguaje y versión; la vista previa de migración compartida no puede conservar los resultados de coincidencia difusa.

## Referencia completa

La [guía canónica del lenguaje](https://github.com/leemour/cli-messaging/blob/main/docs/search/query-language.md) incluye tablas de operadores y campos, Unicode y escapes, filtros preparados, límites, errores y diez ejemplos ejecutables. La [especificación técnica](https://github.com/leemour/cli-messaging/blob/main/docs/search/query-language-spec.md) describe la gramática fijada, AST/esquema, casos de referencia y compilador. El [archivo local](./archive.md) explica descargas y cobertura; los [comandos](./commands.md) enumeran las opciones actuales.
