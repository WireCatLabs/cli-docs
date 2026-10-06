---
title: "Buscar mensajes"
---

`max messages search` busca solo en el archivo local compartido, sin conectarse ni marcar mensajes como leídos.

## Inicio rápido

```sh
max messages search 'invoice AND (kind:group OR kind:private)' --json
max messages search 'from:"Alice Synthetic" date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid --json
max messages search 'preset:secret kind:saved' --json
max messages search 'text:/pass(port)?/' --json
max messages search 'chat:"Работа" AND body:/.*invoice.*/' --json
max messages search 'has:file' --json
```

Sustituye los nombres de ejemplo por los tuyos. Las palabras y frases coinciden de forma estricta, sin correcciones automáticas ni búsqueda de fragmentos. `alpha OR beta gamma` significa `(alpha OR beta) AND gamma`; `alpha OR beta AND gamma`, `alpha OR (beta AND gamma)`. Usa paréntesis para dejarlo claro.

## Campos y operadores

Admite `text/body/from/chat/date/kind/has/topic/in/preset/filename/mime/size`, grupos lógicos y de valores de campo, rangos inclusivos y exclusivos, comodines limitados y regex Lucene. `topic` exige un único chat. `kind:bot` selecciona al interlocutor; `in:bots`, cuentas Bot API. `tag` aún no está disponible; fuzzy/proximity/boost/intervals también dan error. Los campos desconocidos no se interpretan como texto.

Los archivos se buscan por nombre y tamaño, sin necesidad de texto en el mensaje: `filename:*.pdf`, `filename:*договор*` (el nombre completo, sin distinguir mayúsculas ni ё), `size>10MB`, `size:[1KB TO 300KB]` (KB/MB/GB en base 1024). MAX no informa del tipo de archivo, así que `mime:` no encuentra nada aquí: busca por extensión. Un enlace a un sitio se encuentra con una frase: `has:link AND "github.com"`.

## Fechas y regex

`--timezone` define la zona horaria IANA; una fecha sin hora representa un día de calendario. Un límite superior inclusivo incluye todo el día; uno exclusivo lo excluye. Por cambios de horario, un día puede no durar 24 horas. Escribe las horas exactas entre comillas, con segundos y desplazamiento UTC.

La regex de `text` coincide con una palabra normalizada completa; la de `body`, con todo el texto original, distinguiendo mayúsculas. Para buscar un fragmento en `body`, usa `.*`. Se admite un subconjunto de regex Lucene, sin lookaround/backreferences/flags de JS. Superar los límites de filas, bytes, estados del autómata, trabajo o tiempo devuelve un error explícito: reduce el alcance.

## Archivo y respuesta para programas

Una respuesta vacía no demuestra que el mensaje no exista en el mensajero. JSON informa de la versión de consulta, completitud, cobertura de cuentas y chats y estado del índice, incluso sin coincidencias. `lastSyncedAt` es el momento de carga más antiguo entre los chats cubiertos, o `null` si al menos un chat aún no se ha cargado. `inventoryComplete` significa que cada cuenta cubierta ha enviado al menos una vez la lista completa de chats; no promete que el historial esté completo. Tras una actualización, un archivo antiguo mantiene `false` y `null` hasta la siguiente lista completa y `store fetch`. JSONL solo incluye `items`; usa `--json` para conocer la cobertura.

Si el índice de palabras no está listo, ejecuta `max store migrate`; completa el historial con `max store fetch`. Los predicados preparados encuentran candidatos, sin confirmar que las credenciales sean válidas.

## Migrar desde legacy

```sh
max messages search 'from:alice after:7d invoice -draft' --language legacy --json
max messages search --regex 'invoice\s+\d+' --json
```

Legacy conserva los filtros anteriores y las correcciones. `--regex` es un modo JS `iu` independiente sobre el texto completo, con worker aislado y límites; se rechaza `--regex --language lucene`. El contrato de una consulta guardada contiene `language/version`; la vista previa de migración no garantiza los mismos resultados que la búsqueda con correcciones.

## Referencia completa

La [referencia del lenguaje](https://github.com/leemour/cli-messaging/blob/main/docs/search/query-language.md) incluye tablas de campos y operadores, Unicode y escape de caracteres, predicados preparados, límites, errores y diez recetas verificables.
La [especificación técnica](https://github.com/leemour/cli-messaging/blob/main/docs/search/query-language-spec.md) describe la gramática fijada, AST/schema, ejemplos de referencia y compilador.
El [archivo](./archive.md) explica las descargas y la completitud; los [comandos](./commands.md) enumeran los parámetros actuales.

## Buscar mediante MCP

`max_messages_search` usa el mismo lenguaje y servicio que `messages search`. La consulta incluye `text` o `ast` versionado; `language` elige `lucene` o `legacy`, y `timezone` define la zona horaria de calendario. `chat` admite ID o nombre de la copia local; `source`, `newest`, `context` y `limit` eligen cobertura y presentación.

La respuesta conserva `query`, `coverage`, `completeness`, `wordsReady` y `corrections` junto a la página habitual `items/page/limit/hasMore`, incluso sin coincidencias. Los metadatos describen el archivo local, no la completitud del chat remoto. El nombre y los permisos de la herramienta se conservan.

`wordsReady` indica si el índice de palabras está listo, también para consultas solo con filtros o regex. Con `false`, completa `max store migrate`; hasta entonces, la búsqueda estricta por palabras se rechaza y legacy usa la búsqueda por fragmentos de palabras.
